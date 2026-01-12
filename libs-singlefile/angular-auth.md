#libs-Folder => angular-auth 

********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-auth > src > index.ts


```ts

// modules
export * from './lib/angular-auth.module'
// services
export * from './lib/auth.service'
export * from './lib/auth-proxy.service'
export * from './lib/auth_services/keycloak-auth.service'
export * from './lib/auth_services/disabled-auth.service'
// utils
export * from './lib/auth-service-wrapper'
export * from './lib/token.interceptor'


```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-auth > src > lib > token.interceptor.ts 



```ts

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable, from, mergeMap } from 'rxjs'
import { AuthProxyService } from './auth-proxy.service'

const WHITELIST = ['assets']

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authService = inject(AuthProxyService)

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const skip = WHITELIST.some((str) => request.url.includes(str))
    if (skip) {
      return next.handle(request)
    }

    return from(this.authService.updateTokenIfNeeded()).pipe(
      mergeMap(() => {
        const headerValues = this.authService.getHeaderValues()
        let headers = request.headers
        for (const header in headerValues) {
          headers = headers.set(header, headerValues[header])
        }
        const authenticatedReq: HttpRequest<unknown> = request.clone({
          headers: headers,
        })
        return next.handle(authenticatedReq)
      })
    )
  }
}


```



********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-auth > src > lib > declarations.ts 



```ts

declare global {
    interface Window {
      onecxAngularAuth?: {
        authServiceProxy?: {
            v1?: {
                getHeaderValues: () => Record<string, string>,
                updateTokenIfNeeded: () => Promise<boolean>
            }
        }
      }
    }
}

export default globalThis

```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-auth > src > lib > auth.services.ts 


```ts

export interface AuthService {
  init(config?: Record<string, unknown>): Promise<boolean>

  getHeaderValues(): Record<string, string>

  logout(): void

  updateTokenIfNeeded(): Promise<boolean>
}

export enum Injectables {
  KEYCLOAK_AUTH_SERVICE = 'KEYCLOAK_AUTH_SERVICE',
  CONFIG = 'CONFIG',
}

export type AuthServiceFactory = (
  injectorFunction: (injectable: Injectables) => Promise<unknown> | unknown
) => AuthService | Promise<AuthService>


```



********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-auth > src > lib > auth-service-wrapper.ts 



```ts

import { loadRemoteModule } from '@angular-architects/module-federation'
import { Injectable, Injector, inject } from '@angular/core'
import { AppStateService, CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { Config, EventsTopic, EventType } from '@onecx/integration-interface'
import { filter } from 'rxjs/internal/operators/filter'
import { AuthService, AuthServiceFactory, Injectables } from './auth.service'
import { KeycloakAuthService } from './auth_services/keycloak-auth.service'
import './declarations'
import { DisabledAuthService } from './auth_services/disabled-auth.service'

@Injectable()
export class AuthServiceWrapper {
  private configService = inject(ConfigurationService)
  private appStateService = inject(AppStateService)
  private injector = inject(Injector)

  private eventsTopic$ = new EventsTopic()
  private authService: AuthService | undefined

  constructor() {
    this.eventsTopic$
      .pipe(filter((e) => e.type === EventType.AUTH_LOGOUT_BUTTON_CLICKED))
      .subscribe(() => this.authService?.logout())
    window.onecxAngularAuth ??= {}
    window.onecxAngularAuth.authServiceProxy ??= {}
    window.onecxAngularAuth.authServiceProxy.v1 ??= {
      updateTokenIfNeeded: (): Promise<boolean> => {
        return this.updateTokenIfNeeded()
      },
      getHeaderValues: (): Record<string, string> => {
        return this.getHeaderValues()
      },
    }
  }
  async init(): Promise<boolean | undefined> {
    await this.configService.isInitialized

    await this.initializeAuthService()
    const initResult = this.getInitResult()
    return initResult
  }
  async getInitResult(): Promise<boolean | undefined> {
    const initResult = await this.authService?.init()

    if (initResult) {
      await this.appStateService.isAuthenticated$.publish()
    }
    return initResult
  }
  getHeaderValues(): Record<string, string> {
    return this.authService?.getHeaderValues() ?? {}
  }
  updateTokenIfNeeded(): Promise<boolean> {
    return this.authService?.updateTokenIfNeeded() ?? Promise.reject()
  }

  async initializeAuthService(): Promise<void> {
    const serviceTypeConfig = (await this.configService.getProperty(CONFIG_KEY.AUTH_SERVICE)) ?? 'keycloak'

    switch (serviceTypeConfig) {
      case 'keycloak':
        this.authService = this.injector.get(KeycloakAuthService)
        break
      case 'custom': {
        // remote module is exposing function as default export (this is a convention)
        // this function is responsible for creating the custom auth service
        // to have access to the dependency mechanism of the shell
        // the function gets a callback which is returning the requested injectable
        const factory = await this.getAuthServiceFactory()
        this.authService = await Promise.resolve(
          factory((injectable: Injectables) => this.retrieveInjectables(injectable))
        )
        break
      }
      case 'disabled':
        this.authService = this.injector.get(DisabledAuthService)
        break
      default:
        throw new Error('Configured AuthService not found')
    }
  }

  async retrieveInjectables(injectable: Injectables): Promise<KeycloakAuthService | Config | undefined> {
    if (injectable === Injectables.KEYCLOAK_AUTH_SERVICE) {
      return this.injector.get(KeycloakAuthService)
    } else if (injectable === Injectables.CONFIG) {
      return this.configService.getConfig()
    }
    throw new Error('unknown injectable type')
  }

  async getAuthServiceFactory(): Promise<AuthServiceFactory> {
    if (await !this.configService.getProperty(CONFIG_KEY.AUTH_SERVICE_CUSTOM_URL)) {
      throw new Error('URL of the custom auth service is not defined')
    }
    const module = await loadRemoteModule({
      type: 'module',
      remoteEntry: (await this.configService.getProperty(CONFIG_KEY.AUTH_SERVICE_CUSTOM_URL)) ?? '',
      exposedModule:
        (await this.configService.getProperty(CONFIG_KEY.AUTH_SERVICE_CUSTOM_MODULE_NAME)) ?? './CustomAuth',
    })
    return module.default as AuthServiceFactory
  }
}


```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-auth > src > lib > auth-proxy.service.ts 


```ts

import { Injectable, inject } from '@angular/core'
import './declarations'
import { AuthServiceWrapper } from './auth-service-wrapper'

@Injectable()
export class AuthProxyService {
  authServiceWrapper?: AuthServiceWrapper | null

  getHeaderValues(): Record<string, string> {
    return (
      window.onecxAngularAuth?.authServiceProxy?.v1?.getHeaderValues() ??
      this.authServiceWrapper?.getHeaderValues() ??
      {}
    )
  }

  async updateTokenIfNeeded(): Promise<boolean> {
    if (!window.onecxAngularAuth?.authServiceProxy?.v1?.updateTokenIfNeeded) {
      console.info('AuthProxyService uses injected fallback.')
      this.authServiceWrapper = inject(AuthServiceWrapper, { optional: true })
      await this.authServiceWrapper?.init()
    }
    return (
      window.onecxAngularAuth?.authServiceProxy?.v1?.updateTokenIfNeeded() ??
      this.authServiceWrapper?.updateTokenIfNeeded() ??
      Promise.reject('No authServiceWrapper provided.')
    )
  }
}


```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-auth > src > lib > angular-auth.module.ts 



```ts

import { CommonModule } from '@angular/common'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule, inject, provideAppInitializer } from '@angular/core'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { AuthProxyService } from './auth-proxy.service'
import { AuthServiceWrapper } from './auth-service-wrapper'
import { KeycloakAuthService } from './auth_services/keycloak-auth.service'
import { TokenInterceptor } from './token.interceptor'
import { DisabledAuthService } from './auth_services/disabled-auth.service'

function provideAuthServices() {
  return [AuthServiceWrapper, KeycloakAuthService, DisabledAuthService]
}

export function provideAuthService() {
  return [
    provideAuthServices(),
    provideAppInitializer(async () => {
      const configService = inject(ConfigurationService)
      const authServiceWrapper = inject(AuthServiceWrapper)
      await configService.isInitialized
      await authServiceWrapper.init()
    }),
  ]
}

export function provideTokenInterceptor() {
  return [
    AuthProxyService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ]
}


```



FIle => onecx-portal-ui-libs > libs > angular-auth > src > lib > auth-services > disabled-auth.service.ts 

```ts

import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';

@Injectable()
export class DisabledAuthService implements AuthService {

  public async init(_config?: Record<string, unknown>): Promise<boolean> {
    return Promise.resolve(true);
  }

  getIdToken(): string | null {
    return "";
  }
  getAccessToken(): string | null {
    return "";
  }

  logout(): void {
    window.location.href = "https://github.com/onecx/";
  }

  async updateTokenIfNeeded(): Promise<boolean> {
    return Promise.resolve(true);
  }

  getHeaderValues(): Record<string, string> {
    return {};
  }
}


```



FIle => onecx-portal-ui-libs > libs > angular-auth > src > lib > auth-services > keycloask-auth.service.ts 

```ts

import { Injectable, inject } from '@angular/core'
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import Keycloak, { KeycloakConfig } from 'keycloak-js'
import { AuthService } from '../auth.service'

const KC_REFRESH_TOKEN_LS = 'onecx_kc_refreshToken'
const KC_ID_TOKEN_LS = 'onecx_kc_idToken'
const KC_TOKEN_LS = 'onecx_kc_token'

@Injectable()
export class KeycloakAuthService implements AuthService {
  private configService = inject(ConfigurationService)
  private keycloak: Keycloak | undefined

  config?: Record<string, unknown>

  public async init(config?: Record<string, unknown>): Promise<boolean> {
    this.config = config
    let token = localStorage.getItem(KC_TOKEN_LS)
    let idToken = localStorage.getItem(KC_ID_TOKEN_LS)
    let refreshToken = localStorage.getItem(KC_REFRESH_TOKEN_LS)
    if (token && refreshToken) {
      const parsedToken = JSON.parse(atob(refreshToken.split('.')[1]))
      if (parsedToken.exp * 1000 < new Date().getTime()) {
        token = null
        refreshToken = null
        idToken = null
        this.clearKCStateFromLocalstorage()
      }
    }

    let kcConfig: KeycloakConfig | string
    const validKCConfig = await this.getValidKCConfig()
    kcConfig = { ...validKCConfig, ...(config ?? {}) }

    if (!kcConfig.clientId || !kcConfig.realm || !kcConfig.url) {
      kcConfig = './assets/keycloak.json'
    }

    const enableSilentSSOCheck =
      (await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_ENABLE_SILENT_SSO)) === 'true'

    this.keycloak = new Keycloak(kcConfig)

    this.setupEventListener()

    return this.keycloak
      .init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: enableSilentSSOCheck ? this.getSilentSSOUrl() : undefined,
        idToken: idToken || undefined,
        refreshToken: refreshToken || undefined,
        token: token || undefined,
      })
      .catch((err) => {
        console.log(`Keycloak err: ${err}, try force login`)
        return this.keycloak?.login(this.config)
      })
      .then((loginOk) => {
        if (loginOk) {
          return this.keycloak?.token
        } else {
          return this.keycloak?.login(this.config).then(() => 'login')
        }
      })
      .then(() => {
        return true
      })
      .catch((err) => {
        console.log(`KC ERROR ${err} as json ${JSON.stringify(err)}`)
        throw err
      })
  }

  protected async getValidKCConfig(): Promise<KeycloakConfig> {
    const clientId = await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_CLIENT_ID)
    if (!clientId) {
      throw new Error('Invalid KC config, missing clientId')
    }
    const realm = await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_REALM)
    if (!realm) {
      throw new Error('Invalid KC config, missing realm')
    }
    const url = await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_URL)
    return {
      url,
      clientId,
      realm,
    }
  }

  private setupEventListener() {
    if (this.keycloak) {
      this.keycloak.onAuthError = () => {
        this.updateLocalStorage()
      }
      this.keycloak.onAuthLogout = () => {
        console.log('SSO logout nav to root')
        this.clearKCStateFromLocalstorage()
        this.keycloak?.login(this.config)
      }
      this.keycloak.onAuthRefreshSuccess = () => {
        this.updateLocalStorage()
      }
      this.keycloak.onAuthRefreshError = () => {
        this.updateLocalStorage()
      }
      this.keycloak.onAuthSuccess = () => {
        this.updateLocalStorage()
      }
      this.keycloak.onTokenExpired = () => {
        this.updateLocalStorage()
      }
      this.keycloak.onActionUpdate = () => {
        this.updateLocalStorage()
      }
      this.keycloak.onReady = () => {
        this.updateLocalStorage()
      }
    }
  }

  private updateLocalStorage() {
    if (this.keycloak) {
      if (this.keycloak.token) {
        localStorage.setItem(KC_TOKEN_LS, this.keycloak.token)
      } else {
        localStorage.removeItem(KC_TOKEN_LS)
      }
      if (this.keycloak.idToken) {
        localStorage.setItem(KC_ID_TOKEN_LS, this.keycloak.idToken)
      } else {
        localStorage.removeItem(KC_ID_TOKEN_LS)
      }
      if (this.keycloak.refreshToken) {
        localStorage.setItem(KC_REFRESH_TOKEN_LS, this.keycloak.refreshToken)
      } else {
        localStorage.removeItem(KC_REFRESH_TOKEN_LS)
      }
    }
  }

  private clearKCStateFromLocalstorage() {
    localStorage.removeItem(KC_ID_TOKEN_LS)
    localStorage.removeItem(KC_TOKEN_LS)
    localStorage.removeItem(KC_REFRESH_TOKEN_LS)
  }

  private getSilentSSOUrl() {
    let currentBase = document.getElementsByTagName('base')[0].href
    if (currentBase === '/') {
      currentBase = ''
    }
    return `${currentBase}/assets/silent-check-sso.html`
  }

  getIdToken(): string | null {
    return this.keycloak?.idToken ?? null
  }
  getAccessToken(): string | null {
    return this.keycloak?.token ?? null
  }

  logout(): void {
    this.keycloak?.logout()
  }

  async updateTokenIfNeeded(): Promise<boolean> {
    if (!this.keycloak?.authenticated) {
      return this.keycloak?.login(this.config).then(() => false) ?? Promise.reject('Keycloak not initialized!')
    } else {
      return this.keycloak.updateToken()
    }
  }

  getAuthProviderName(): string {
    return 'keycloak-auth'
  }

  hasRole(_role: string): boolean {
    return false
  }

  getUserRoles(): string[] {
    return []
  }

  getHeaderValues(): Record<string, string> {
    return { 'apm-principal-token': this.getIdToken() ?? '', Authorization: `Bearer ${this.getAccessToken()}` }
  }
}


```

