import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { AuthServiceWrapper, KeycloakAuthService } from '@onecx/angular-auth'
import { ConfigurationService } from '@onecx/angular-integration-interface'

const KC_REFRESH_TOKEN_LS = 'onecx_kc_refreshToken'
const KC_ID_TOKEN_LS = 'onecx_kc_idToken'
const KC_TOKEN_LS = 'onecx_kc_token'

const TOKEN_EXPIRED_KEY = 'KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED'
const AUTH_REFRESH_ERROR_KEY = 'KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED'
const TIME_SKEW_KEY = 'KEYCLOAK_TIME_SKEW'
const UPDATE_TOKEN_MIN_VALIDITY_KEY = 'KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY'
const ENABLE_SILENT_SSO_KEY = 'KEYCLOAK_ENABLE_SILENT_SSO'
const AUTH_SERVICE_KEY = 'AUTH_SERVICE'

type CallbackName =
  | 'onReady'
  | 'onAuthSuccess'
  | 'onAuthRefreshSuccess'
  | 'onAuthError'
  | 'onActionUpdate'
  | 'onTokenExpired'
  | 'onAuthRefreshError'
  | 'onAuthLogout'

type LogLevel = 'info' | 'warn' | 'error' | 'success'

interface ConfigSnapshotEntry {
  key: string
  description: string
  value: string
  note: string
}

interface RuntimeSnapshot {
  authServiceType: string
  authProviderName: string
  keycloakAvailable: boolean
  authenticated: string
  timeSkew: string
  tokenPresent: boolean
  idTokenPresent: boolean
  refreshTokenPresent: boolean
  onReadyRegistered: boolean
  onAuthSuccessRegistered: boolean
  onAuthRefreshSuccessRegistered: boolean
  onAuthErrorRegistered: boolean
  onActionUpdateRegistered: boolean
  onTokenExpiredRegistered: boolean
  onAuthRefreshErrorRegistered: boolean
  onAuthLogoutRegistered: boolean
}

interface TokenDetails {
  label: string
  source: 'keycloak' | 'localStorage'
  present: boolean
  preview: string
  exp: string
  iat: string
  remainingSeconds: string
  note: string
}

interface ActionResult {
  title: string
  status: 'idle' | 'pass' | 'warn' | 'fail'
  summary: string
  observed: string
}

interface TestCaseDefinition {
  id: string
  title: string
  config: string
  trigger: string
  expected: string
  notes: string
}

interface LogEntry {
  at: string
  level: LogLevel
  message: string
  details?: string
}

type KeycloakLike = {
  authenticated?: boolean
  timeSkew?: number | null
  token?: string
  idToken?: string
  refreshToken?: string
  updateToken?: (minValidity?: number) => Promise<boolean>
  onReady?: () => void
  onAuthSuccess?: () => void
  onAuthRefreshSuccess?: () => void
  onAuthError?: () => void
  onActionUpdate?: () => void
  onTokenExpired?: () => void
  onAuthRefreshError?: () => void
  onAuthLogout?: () => void
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'ocx-shell-keycloak-auth-behavior',
  templateUrl: './keycloak-auth-behavior.component.html',
  styleUrls: ['./keycloak-auth-behavior.component.scss'],
})
export class KeycloakAuthBehaviorComponent implements OnInit {
  private readonly configurationService = inject(ConfigurationService)
  private readonly authServiceWrapper = inject(AuthServiceWrapper)

  readonly routePath = '/onecx-shell/keycloak-auth-behavior'
  readonly localConfigPath = 'onecx-shell-ui/src/environments/environment.ts'
  readonly containerConfigPath = 'onecx-shell-ui/src/assets/env.json'

  configEntries: ConfigSnapshotEntry[] = []
  runtimeSnapshot: RuntimeSnapshot = {
    authServiceType: 'unknown',
    authProviderName: 'unknown',
    keycloakAvailable: false,
    authenticated: 'unknown',
    timeSkew: 'unknown',
    tokenPresent: false,
    idTokenPresent: false,
    refreshTokenPresent: false,
    onReadyRegistered: false,
    onAuthSuccessRegistered: false,
    onAuthRefreshSuccessRegistered: false,
    onAuthErrorRegistered: false,
    onActionUpdateRegistered: false,
    onTokenExpiredRegistered: false,
    onAuthRefreshErrorRegistered: false,
    onAuthLogoutRegistered: false,
  }

  tokenDetails: TokenDetails[] = []

  readonly callbackResults: Record<CallbackName, ActionResult> = {
    onReady: this.createIdleResult('onReady'),
    onAuthSuccess: this.createIdleResult('onAuthSuccess'),
    onAuthRefreshSuccess: this.createIdleResult('onAuthRefreshSuccess'),
    onAuthError: this.createIdleResult('onAuthError'),
    onActionUpdate: this.createIdleResult('onActionUpdate'),
    onTokenExpired: this.createIdleResult('onTokenExpired'),
    onAuthRefreshError: this.createIdleResult('onAuthRefreshError'),
    onAuthLogout: this.createIdleResult('onAuthLogout'),
  }

  updateTokenIfNeededResult = this.createIdleResult('updateTokenIfNeeded()')
  concurrentUpdateResult = this.createIdleResult('Concurrent updateTokenIfNeeded()')

  readonly testCases: TestCaseDefinition[] = [
    {
      id: 'TC01',
      title: 'Shell is using Keycloak auth',
      config: 'AUTH_SERVICE="keycloak"',
      trigger: 'Open the page and inspect the Runtime Snapshot section.',
      expected: 'Auth service type resolves to KeycloakAuthService and auth provider shows keycloak-auth.',
      notes: 'If you see another service, the rest of the tests are not valid yet.',
    },
    {
      id: 'TC02',
      title: 'Token-expired feature disabled baseline',
      config: 'KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED="false"',
      trigger: 'Click the onTokenExpired button.',
      expected: 'No forced login should happen. Old behavior should remain. Token/localStorage may stay unchanged.',
      notes: 'Use this as the regression baseline.',
    },
    {
      id: 'TC03',
      title: 'Token-expired feature enabled',
      config: 'KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED="true"',
      trigger: 'Click the onTokenExpired button while authenticated.',
      expected: 'The live Keycloak adapter should try to refresh. Watch console and Network for the token refresh call, then refresh the page snapshot and compare token/exp values.',
      notes: 'This is the main story behavior for onTokenExpired.',
    },
    {
      id: 'TC04',
      title: 'Auth-refresh-error feature disabled baseline',
      config: 'KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED="false"',
      trigger: 'Click the onAuthRefreshError button.',
      expected: 'No login redirect should happen. Old behavior should remain.',
      notes: 'Use only when you want to confirm no forced login occurs.',
    },
    {
      id: 'TC05',
      title: 'Auth-refresh-error feature enabled',
      config: 'KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED="true"',
      trigger: 'Click the onAuthRefreshError button.',
      expected: 'The shell should redirect to Keycloak login. This is an expected navigation test.',
      notes: 'Open DevTools before clicking because the page will leave the route.',
    },
    {
      id: 'TC06',
      title: 'timeSkew not configured',
      config: 'KEYCLOAK_TIME_SKEW=""',
      trigger: 'Reload the shell and inspect Runtime Snapshot.',
      expected: 'The service should effectively pass undefined, so timeSkew should be server-derived or remain null/unknown until Keycloak sets it.',
      notes: 'This must be verified after a full reload because timeSkew is applied during init.',
    },
    {
      id: 'TC07',
      title: 'timeSkew positive value',
      config: 'KEYCLOAK_TIME_SKEW="30"',
      trigger: 'Reload the shell and inspect Runtime Snapshot.',
      expected: 'The runtime timeSkew should show 30 after init if the patched package is loaded.',
      notes: 'Use positive values when the browser needs extra headroom for token expiry math.',
    },
    {
      id: 'TC08',
      title: 'timeSkew negative value',
      config: 'KEYCLOAK_TIME_SKEW="-30"',
      trigger: 'Reload the shell and inspect Runtime Snapshot.',
      expected: 'The runtime timeSkew should show -30 after init if the patched package is loaded.',
      notes: 'Useful when the browser clock is effectively ahead of server time.',
    },
    {
      id: 'TC09',
      title: 'timeSkew invalid value',
      config: 'KEYCLOAK_TIME_SKEW="abc"',
      trigger: 'Reload the shell and inspect Runtime Snapshot.',
      expected: 'Patched behavior should treat the value as undefined instead of passing NaN.',
      notes: 'This is an edge-case regression test.',
    },
    {
      id: 'TC10',
      title: 'minValidity not configured',
      config: 'KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY=""',
      trigger: 'Click updateTokenIfNeeded().',
      expected: 'Patched behavior should pass undefined to updateToken(), which lets Keycloak use its own default of 5 seconds.',
      notes: 'You usually verify this through token refresh timing and console/network observation.',
    },
    {
      id: 'TC11',
      title: 'minValidity zero',
      config: 'KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY="0"',
      trigger: 'Click updateTokenIfNeeded().',
      expected: 'Refresh should happen only when the token is already expired or exactly at threshold.',
      notes: 'Useful to compare with a more proactive threshold such as 30 or 60.',
    },
    {
      id: 'TC12',
      title: 'minValidity positive threshold',
      config: 'KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY="30"',
      trigger: 'Click updateTokenIfNeeded().',
      expected: 'If the token is near expiry, refresh should happen earlier than the Keycloak default.',
      notes: 'Recommended main-line test for the configurable updateToken parameter.',
    },
    {
      id: 'TC13',
      title: 'minValidity invalid value',
      config: 'KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY="abc"',
      trigger: 'Click updateTokenIfNeeded().',
      expected: 'Patched behavior should treat the value as undefined instead of NaN.',
      notes: 'This is another important edge-case regression test.',
    },
    {
      id: 'TC14',
      title: 'onReady keeps localStorage in sync',
      config: 'Any valid authenticated config',
      trigger: 'Click the onReady button and then inspect the Token Snapshot section.',
      expected: 'LocalStorage token entries should stay aligned with the current Keycloak token values.',
      notes: 'This verifies no regression in existing callback behavior.',
    },
    {
      id: 'TC15',
      title: 'onAuthSuccess keeps localStorage in sync',
      config: 'Any valid authenticated config',
      trigger: 'Click the onAuthSuccess button.',
      expected: 'LocalStorage token entries should stay aligned with the current Keycloak token values.',
      notes: 'Existing behavior should remain unchanged.',
    },
    {
      id: 'TC16',
      title: 'onAuthRefreshSuccess keeps localStorage in sync',
      config: 'Any valid authenticated config',
      trigger: 'Click the onAuthRefreshSuccess button.',
      expected: 'LocalStorage token entries should stay aligned with the current Keycloak token values.',
      notes: 'Run after a real refresh if you want a stronger check.',
    },
    {
      id: 'TC17',
      title: 'onAuthError keeps localStorage in sync',
      config: 'Any valid authenticated config',
      trigger: 'Click the onAuthError button.',
      expected: 'No login redirect is expected from this callback; localStorage sync should still happen.',
      notes: 'This is a non-story regression check.',
    },
    {
      id: 'TC18',
      title: 'onActionUpdate keeps localStorage in sync',
      config: 'Any valid authenticated config',
      trigger: 'Click the onActionUpdate button.',
      expected: 'No login redirect is expected; localStorage sync should still happen.',
      notes: 'Another non-story regression check.',
    },
    {
      id: 'TC19',
      title: 'Authenticated updateTokenIfNeeded() path',
      config: 'Authenticated session, any minValidity config',
      trigger: 'Click updateTokenIfNeeded().',
      expected: 'The promise should resolve without shell failure. If the token is near expiry, a real refresh can occur.',
      notes: 'Refresh the Token Snapshot after the action.',
    },
    {
      id: 'TC20',
      title: 'Unauthenticated updateTokenIfNeeded() path',
      config: 'Unauthenticated session',
      trigger: 'Open the page without a valid session and click updateTokenIfNeeded().',
      expected: 'The service should fall back to login.',
      notes: 'This is expected to navigate away.',
    },
    {
      id: 'TC21',
      title: 'Concurrent updateTokenIfNeeded() calls',
      config: 'Authenticated session, token close enough to expiry to exercise refresh',
      trigger: 'Click concurrent updateTokenIfNeeded() x3.',
      expected: 'All calls should settle cleanly. The shell should not crash or leave an unhandled rejection.',
      notes: 'From UI alone you mainly verify stability. Network timing can help, but app-level semaphore vs Keycloak internal queue is not perfectly distinguishable visually.',
    },
    {
      id: 'TC22',
      title: 'onAuthLogout behavior',
      config: 'Any authenticated session',
      trigger: 'Click the onAuthLogout button.',
      expected: 'LocalStorage token entries should be cleared and the shell should navigate to login.',
      notes: 'This is a deliberate navigation test.',
    },
    {
      id: 'TC23',
      title: 'Refresh-token-expired cleanup during init',
      config: 'Manually seed expired refresh token data in localStorage before reloading the shell',
      trigger: 'Reload the shell and inspect Token Snapshot.',
      expected: 'Patched service should clear stale token/idToken/refreshToken entries during init.',
      notes: 'This validates the existing init guard still works.',
    },
    {
      id: 'TC24',
      title: 'Silent SSO unchanged',
      config: 'KEYCLOAK_ENABLE_SILENT_SSO="true" with the same pre-existing shell setup',
      trigger: 'Reload the shell and sign in as normal.',
      expected: 'Silent SSO behavior should remain unchanged by this story.',
      notes: 'This is a regression test around untouched config.',
    },
  ]

  logs: LogEntry[] = []

  async ngOnInit() {
    await this.refreshState()
    this.log('info', 'Keycloak auth behavior page loaded.', 'This page only invokes live auth service methods and live Keycloak callbacks.')
  }

  async refreshState() {
    await this.loadConfigEntries()
    this.loadRuntimeSnapshot()
    this.loadTokenDetails()
  }

  async invokeCallback(name: CallbackName) {
    const keycloak = this.getKeycloak()
    if (!keycloak || typeof keycloak[name] !== 'function') {
      this.callbackResults[name] = {
        title: name,
        status: 'fail',
        summary: `${name} is not available on the live Keycloak instance.`,
        observed: 'The patched package may not be loaded yet, or the runtime auth service is not ready.',
      }
      this.log('error', this.callbackResults[name].summary)
      return
    }

    this.log('info', `Invoking live Keycloak callback ${name}().`)

    try {
      keycloak[name]!()
      this.callbackResults[name] = {
        title: name,
        status: this.isNavigationCallback(name) ? 'warn' : 'pass',
        summary: this.getCallbackExpectedSummary(name),
        observed: this.isNavigationCallback(name)
          ? 'This callback may navigate away immediately. Check the console, login redirect, and token/localStorage state after returning.'
          : 'Callback returned without throwing. Refreshing state snapshot now.',
      }
      await this.waitForStateToSettle()
      await this.refreshState()
      this.log(
        this.isNavigationCallback(name) ? 'warn' : 'success',
        `Finished ${name}().`,
        this.callbackResults[name].observed
      )
    } catch (error) {
      this.callbackResults[name] = {
        title: name,
        status: 'fail',
        summary: `${name} threw an error.`,
        observed: this.stringify(error),
      }
      this.log('error', this.callbackResults[name].summary, this.callbackResults[name].observed)
    }
  }

  async callUpdateTokenIfNeeded() {
    this.log('info', 'Calling live AuthServiceWrapper.updateTokenIfNeeded().')
    try {
      const result = await this.authServiceWrapper.updateTokenIfNeeded()
      await this.waitForStateToSettle()
      await this.refreshState()
      this.updateTokenIfNeededResult = {
        title: 'updateTokenIfNeeded()',
        status: 'pass',
        summary: 'Live updateTokenIfNeeded() call completed.',
        observed: `Promise resolved with ${this.stringify(result)}. Compare the token snapshot before and after the action, plus console/network activity, to confirm refresh behavior.`,
      }
      this.log('success', this.updateTokenIfNeededResult.summary, this.updateTokenIfNeededResult.observed)
    } catch (error) {
      this.updateTokenIfNeededResult = {
        title: 'updateTokenIfNeeded()',
        status: 'fail',
        summary: 'Live updateTokenIfNeeded() call failed.',
        observed: this.stringify(error),
      }
      this.log('error', this.updateTokenIfNeededResult.summary, this.updateTokenIfNeededResult.observed)
    }
  }

  async callConcurrentUpdateTokenIfNeeded() {
    this.log('info', 'Calling live AuthServiceWrapper.updateTokenIfNeeded() three times in parallel.')
    const startedAt = Date.now()
    const results = await Promise.allSettled([
      this.authServiceWrapper.updateTokenIfNeeded(),
      this.authServiceWrapper.updateTokenIfNeeded(),
      this.authServiceWrapper.updateTokenIfNeeded(),
    ])
    const durationMs = Date.now() - startedAt

    await this.waitForStateToSettle()
    await this.refreshState()

    const fulfilledCount = results.filter((result) => result.status === 'fulfilled').length
    const rejectedCount = results.filter((result) => result.status === 'rejected').length

    this.concurrentUpdateResult = {
      title: 'Concurrent updateTokenIfNeeded()',
      status: rejectedCount === 0 ? 'pass' : 'warn',
      summary: 'Concurrent live updateTokenIfNeeded() calls finished.',
      observed: `fulfilled=${fulfilledCount}, rejected=${rejectedCount}, durationMs=${durationMs}, results=${this.stringify(results)}. Use this together with browser Network and console logs for regression checking.`,
    }

    this.log(
      rejectedCount === 0 ? 'success' : 'warn',
      this.concurrentUpdateResult.summary,
      this.concurrentUpdateResult.observed
    )
  }

  clearLogs() {
    this.logs = []
  }

  private async loadConfigEntries() {
    const [authService, tokenExpired, authRefreshError, timeSkew, minValidity, silentSso] = await Promise.all([
      this.readConfig(AUTH_SERVICE_KEY),
      this.readConfig(TOKEN_EXPIRED_KEY),
      this.readConfig(AUTH_REFRESH_ERROR_KEY),
      this.readConfig(TIME_SKEW_KEY),
      this.readConfig(UPDATE_TOKEN_MIN_VALIDITY_KEY),
      this.readConfig(ENABLE_SILENT_SSO_KEY),
    ])

    this.configEntries = [
      {
        key: AUTH_SERVICE_KEY,
        description: 'Which auth implementation the shell should boot with.',
        value: authService,
        note: 'Must be "keycloak" for this page to be meaningful.',
      },
      {
        key: TOKEN_EXPIRED_KEY,
        description: 'Controls whether onTokenExpired triggers refresh.',
        value: tokenExpired,
        note: 'Default false keeps the old behavior.',
      },
      {
        key: AUTH_REFRESH_ERROR_KEY,
        description: 'Controls whether onAuthRefreshError triggers login.',
        value: authRefreshError,
        note: 'Default false keeps the old behavior.',
      },
      {
        key: TIME_SKEW_KEY,
        description: 'Optional Keycloak init timeSkew in seconds.',
        value: timeSkew,
        note: 'Verify only after a full reload.',
      },
      {
        key: UPDATE_TOKEN_MIN_VALIDITY_KEY,
        description: 'Optional updateToken(minValidity) threshold in seconds.',
        value: minValidity,
        note: 'Empty should behave like undefined in patched code.',
      },
      {
        key: ENABLE_SILENT_SSO_KEY,
        description: 'Existing silent SSO flag, included for regression checking.',
        value: silentSso,
        note: 'This story should not break it.',
      },
    ]
  }

  private loadRuntimeSnapshot() {
    const authService = this.getRuntimeAuthService() as any
    const keycloak = this.getKeycloak()

    this.runtimeSnapshot = {
      authServiceType: authService?.constructor?.name ?? 'unknown',
      authProviderName: typeof authService?.getAuthProviderName === 'function' ? authService.getAuthProviderName() : 'unknown',
      keycloakAvailable: !!keycloak,
      authenticated: this.stringify(keycloak?.authenticated),
      timeSkew: this.stringify(keycloak?.timeSkew),
      tokenPresent: !!keycloak?.token,
      idTokenPresent: !!keycloak?.idToken,
      refreshTokenPresent: !!keycloak?.refreshToken,
      onReadyRegistered: typeof keycloak?.onReady === 'function',
      onAuthSuccessRegistered: typeof keycloak?.onAuthSuccess === 'function',
      onAuthRefreshSuccessRegistered: typeof keycloak?.onAuthRefreshSuccess === 'function',
      onAuthErrorRegistered: typeof keycloak?.onAuthError === 'function',
      onActionUpdateRegistered: typeof keycloak?.onActionUpdate === 'function',
      onTokenExpiredRegistered: typeof keycloak?.onTokenExpired === 'function',
      onAuthRefreshErrorRegistered: typeof keycloak?.onAuthRefreshError === 'function',
      onAuthLogoutRegistered: typeof keycloak?.onAuthLogout === 'function',
    }
  }

  private loadTokenDetails() {
    const keycloak = this.getKeycloak()

    this.tokenDetails = [
      this.createTokenDetails('Access Token', 'keycloak', keycloak?.token, 'Current token exposed by the live Keycloak instance.'),
      this.createTokenDetails('ID Token', 'keycloak', keycloak?.idToken, 'Current ID token exposed by the live Keycloak instance.'),
      this.createTokenDetails('Refresh Token', 'keycloak', keycloak?.refreshToken, 'Current refresh token exposed by the live Keycloak instance.'),
      this.createTokenDetails('Access Token', 'localStorage', localStorage.getItem(KC_TOKEN_LS), 'Persisted by updateLocalStorage().'),
      this.createTokenDetails('ID Token', 'localStorage', localStorage.getItem(KC_ID_TOKEN_LS), 'Persisted by updateLocalStorage().'),
      this.createTokenDetails('Refresh Token', 'localStorage', localStorage.getItem(KC_REFRESH_TOKEN_LS), 'Persisted by updateLocalStorage().'),
    ]
  }

  private createTokenDetails(label: string, source: 'keycloak' | 'localStorage', token: string | null | undefined, note: string): TokenDetails {
    if (!token) {
      return {
        label,
        source,
        present: false,
        preview: '(missing)',
        exp: 'n/a',
        iat: 'n/a',
        remainingSeconds: 'n/a',
        note,
      }
    }

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1])) as { exp?: number; iat?: number }
      const nowInSeconds = Math.floor(Date.now() / 1000)
      return {
        label,
        source,
        present: true,
        preview: `${token.slice(0, 12)}...${token.slice(-12)}`,
        exp: tokenPayload.exp ? new Date(tokenPayload.exp * 1000).toLocaleString() : 'missing',
        iat: tokenPayload.iat ? new Date(tokenPayload.iat * 1000).toLocaleString() : 'missing',
        remainingSeconds: tokenPayload.exp ? String(tokenPayload.exp - nowInSeconds) : 'missing',
        note,
      }
    } catch (error) {
      return {
        label,
        source,
        present: true,
        preview: `${token.slice(0, 12)}...${token.slice(-12)}`,
        exp: 'unparseable',
        iat: 'unparseable',
        remainingSeconds: 'unparseable',
        note: `${note} Parse error: ${this.stringify(error)}`,
      }
    }
  }

  private getRuntimeAuthService(): KeycloakAuthService | Record<string, unknown> | undefined {
    const wrapperService = (this.authServiceWrapper as any).authService as KeycloakAuthService | undefined
    if (wrapperService) {
      return wrapperService
    }

    return undefined
  }

  private getKeycloak(): KeycloakLike | undefined {
    return (this.getRuntimeAuthService() as any)?.keycloak
  }

  private async readConfig(key: string): Promise<string> {
    const value = await this.configurationService.getProperty(key as any)
    return value ?? '(empty)'
  }

  private createIdleResult(title: string): ActionResult {
    return {
      title,
      status: 'idle',
      summary: 'Not executed yet.',
      observed: 'Use the matching action button on this page.',
    }
  }

  private getCallbackExpectedSummary(name: CallbackName): string {
    switch (name) {
      case 'onReady':
      case 'onAuthSuccess':
      case 'onAuthRefreshSuccess':
      case 'onAuthError':
      case 'onActionUpdate':
        return `${name} should keep localStorage in sync without unexpected navigation.`
      case 'onTokenExpired':
        return 'With the patched libs, this should refresh only when KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED is true.'
      case 'onAuthRefreshError':
        return 'With the patched libs, this should redirect to login only when KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED is true.'
      case 'onAuthLogout':
        return 'This should clear localStorage and navigate to login.'
    }
  }

  private isNavigationCallback(name: CallbackName): boolean {
    return name === 'onAuthRefreshError' || name === 'onAuthLogout'
  }

  private log(level: LogLevel, message: string, details?: string) {
    const entry: LogEntry = {
      at: new Date().toLocaleTimeString(),
      level,
      message,
      details,
    }
    this.logs = [entry, ...this.logs]
    const logger = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
    logger(`[keycloak-auth-behavior] ${message}`, details ?? '')
  }

  private stringify(value: unknown): string {
    if (value === undefined) {
      return 'undefined'
    }
    if (value === null) {
      return 'null'
    }
    if (typeof value === 'string') {
      return value
    }
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }

  private async waitForStateToSettle() {
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
}
