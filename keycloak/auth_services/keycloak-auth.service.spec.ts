import { TestBed } from '@angular/core/testing'
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { KeycloakAuthService } from './keycloak-auth.service'
import * as loggerUtils from '../utils/logger.utils'

const KC_REFRESH_TOKEN_LS = 'onecx_kc_refreshToken'
const KC_ID_TOKEN_LS = 'onecx_kc_idToken'
const KC_TOKEN_LS = 'onecx_kc_token'

type Deferred<T> = {
  promise: Promise<T>
  resolve: (value: T) => void
}

describe('KeycloakAuthService', () => {
  let service: KeycloakAuthService
  let getPropertyMock: jest.Mock
  let loggerWarnFn: jest.Mock

  const configureProperties = (values: Partial<Record<CONFIG_KEY, string>>) => {
    getPropertyMock.mockImplementation((key: CONFIG_KEY) => Promise.resolve(values[key]))
  }

  const createDeferred = <T>(): Deferred<T> => {
    let resolve!: (value: T) => void
    const promise = new Promise<T>((innerResolve) => {
      resolve = innerResolve
    })
    return { promise, resolve }
  }

  const createKeycloakMock = (overrides: Record<string, unknown> = {}): any => ({
    authenticated: true,
    token: 'access-token',
    idToken: 'id-token',
    refreshToken: 'refresh-token',
    login: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn(),
    updateToken: jest.fn().mockResolvedValue(true),
    ...overrides,
  })

  const setKeycloak = (keycloak: any) => {
    ;(service as any).keycloak = keycloak
  }

  const setupEventListener = async () => {
    await (service as any).setupEventListener()
  }

  const flushMicrotasks = async (count = 3) => {
    for (let index = 0; index < count; index += 1) {
      await Promise.resolve()
    }
  }

  beforeEach(() => {
    getPropertyMock = jest.fn().mockResolvedValue(undefined)
    loggerWarnFn = jest.fn()

    jest.spyOn(loggerUtils, 'createLogger').mockReturnValue({
      debug: jest.fn() as any,
      info: jest.fn() as any,
      warn: loggerWarnFn as any,
      error: jest.fn() as any,
    })

    TestBed.configureTestingModule({
      providers: [
        KeycloakAuthService,
        {
          provide: ConfigurationService,
          useValue: {
            getProperty: getPropertyMock,
          },
        },
      ],
    })

    service = TestBed.inject(KeycloakAuthService)
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
    jest.restoreAllMocks()
  })

  it('rejects updateTokenIfNeeded when Keycloak has not been initialized', async () => {
    await expect(service.updateTokenIfNeeded()).rejects.toBe('Keycloak not initialized!')
  })

  it('returns false and triggers login when updateTokenIfNeeded is called without an authenticated session', async () => {
    const keycloak = createKeycloakMock({
      authenticated: false,
    })
    setKeycloak(keycloak)

    await expect(service.updateTokenIfNeeded()).resolves.toBe(false)

    expect(keycloak.login).toHaveBeenCalledWith(undefined)
    expect(keycloak.updateToken).not.toHaveBeenCalled()
  })

  it('passes configured minValidity to updateTokenIfNeeded', async () => {
    configureProperties({
      [CONFIG_KEY.KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY]: '30',
    })
    const keycloak = createKeycloakMock()
    setKeycloak(keycloak)

    await expect(service.updateTokenIfNeeded()).resolves.toBe(true)

    expect(keycloak.updateToken).toHaveBeenCalledWith(30)
  })

  it('uses undefined minValidity for invalid numeric config values', async () => {
    configureProperties({
      [CONFIG_KEY.KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY]: '${KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY}',
    })
    const keycloak = createKeycloakMock()
    setKeycloak(keycloak)

    await expect(service.updateTokenIfNeeded()).resolves.toBe(true)

    expect(keycloak.updateToken).toHaveBeenCalledWith(undefined)
    expect(loggerWarnFn).toHaveBeenCalledWith(
      `Ignoring invalid numeric config value for ${CONFIG_KEY.KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY}: ${'${KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY}'}`
    )
  })

  it('keeps the old token-expired behavior when the config is disabled', async () => {
    configureProperties({
      [CONFIG_KEY.KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED]: 'false',
      [CONFIG_KEY.KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED]: 'false',
    })
    const keycloak = createKeycloakMock()
    setKeycloak(keycloak)

    await setupEventListener()
    keycloak.onTokenExpired()

    expect(keycloak.updateToken).not.toHaveBeenCalled()
    expect(localStorage.getItem(KC_TOKEN_LS)).toBe('access-token')
    expect(localStorage.getItem(KC_ID_TOKEN_LS)).toBe('id-token')
    expect(localStorage.getItem(KC_REFRESH_TOKEN_LS)).toBe('refresh-token')
  })

  it('refreshes the token on expiration with the configured minValidity when enabled', async () => {
    configureProperties({
      [CONFIG_KEY.KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED]: 'false',
      [CONFIG_KEY.KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED]: 'true',
      [CONFIG_KEY.KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY]: '45',
    })
    const updateTokenCalled = createDeferred<boolean>()
    const keycloak = createKeycloakMock({
      updateToken: jest.fn().mockImplementation((minValidity?: number) => {
        updateTokenCalled.resolve(true)
        return Promise.resolve(minValidity === 45)
      }),
    })
    setKeycloak(keycloak)

    await setupEventListener()
    keycloak.onTokenExpired()
    await updateTokenCalled.promise

    expect(keycloak.updateToken).toHaveBeenCalledWith(45)
  })

  it('does not refresh the token on expiration when enabled but the session is not authenticated', async () => {
    configureProperties({
      [CONFIG_KEY.KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED]: 'false',
      [CONFIG_KEY.KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED]: 'true',
    })
    const keycloak = createKeycloakMock({
      authenticated: false,
    })
    setKeycloak(keycloak)

    await setupEventListener()
    keycloak.onTokenExpired()
    await flushMicrotasks()

    expect(keycloak.updateToken).not.toHaveBeenCalled()
  })

  it('keeps the old auth-refresh-error behavior when the config is disabled', async () => {
    configureProperties({
      [CONFIG_KEY.KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED]: 'false',
      [CONFIG_KEY.KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED]: 'false',
    })
    const keycloak = createKeycloakMock()
    setKeycloak(keycloak)

    await setupEventListener()
    keycloak.onAuthRefreshError()

    expect(keycloak.login).not.toHaveBeenCalled()
    expect(localStorage.getItem(KC_TOKEN_LS)).toBe('access-token')
    expect(localStorage.getItem(KC_ID_TOKEN_LS)).toBe('id-token')
    expect(localStorage.getItem(KC_REFRESH_TOKEN_LS)).toBe('refresh-token')
  })

  it('triggers login on refresh error when the config is enabled', async () => {
    configureProperties({
      [CONFIG_KEY.KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED]: 'true',
      [CONFIG_KEY.KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED]: 'false',
    })
    const keycloak = createKeycloakMock()
    setKeycloak(keycloak)

    await setupEventListener()
    keycloak.onAuthRefreshError()

    expect(keycloak.login).toHaveBeenCalledWith(undefined)
  })

  it('serializes concurrent updateTokenIfNeeded calls through the semaphore', async () => {
    configureProperties({
      [CONFIG_KEY.KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY]: '5',
    })

    const firstRefresh = createDeferred<boolean>()
    const secondRefresh = createDeferred<boolean>()
    let activeCalls = 0
    let maxActiveCalls = 0
    let callIndex = 0

    const keycloak = createKeycloakMock({
      updateToken: jest.fn().mockImplementation(() => {
        activeCalls += 1
        maxActiveCalls = Math.max(maxActiveCalls, activeCalls)

        const currentCall = callIndex++
        const currentRefresh = currentCall === 0 ? firstRefresh : secondRefresh
        return currentRefresh.promise.finally(() => {
          activeCalls -= 1
        })
      }),
    })
    setKeycloak(keycloak)

    const firstCall = service.updateTokenIfNeeded()
    const secondCall = service.updateTokenIfNeeded()

    await flushMicrotasks()

    expect(keycloak.updateToken).toHaveBeenCalledTimes(1)
    expect(keycloak.updateToken).toHaveBeenNthCalledWith(1, 5)
    expect(maxActiveCalls).toBe(1)

    firstRefresh.resolve(true)
    await flushMicrotasks()

    expect(keycloak.updateToken).toHaveBeenCalledTimes(2)
    expect(keycloak.updateToken).toHaveBeenNthCalledWith(2, 5)
    expect(maxActiveCalls).toBe(1)

    secondRefresh.resolve(true)

    await expect(Promise.all([firstCall, secondCall])).resolves.toEqual([true, true])
  })
})
