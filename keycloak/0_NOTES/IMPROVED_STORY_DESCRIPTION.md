# Improve Keycloak Service Configuration

## 1. Improved Story Description

Enhance the OneCX Keycloak integration in `@onecx/shell-auth` so the shell can configure token-refresh behavior instead of hardcoding it.

### Scope

- Add config-controlled support for `onTokenExpired`.
- Add config-controlled support for `onAuthRefreshError`.
- Make `timeSkew` configurable for Keycloak init.
- Make `updateToken(minValidity)` configurable wherever the service refreshes tokens.
- Guard service-level `updateToken` execution with `Semaphore(1)` in the same style already used by `ConfigurationService`.
- Expose the new config keys through the shell config surface used in this workspace.

### Required behavior

- `onTokenExpired` must keep the old behavior by default.
- If enabled by config, `onTokenExpired` must trigger token refresh from the service layer.
- `onAuthRefreshError` must keep the old behavior by default.
- If enabled by config, `onAuthRefreshError` must trigger login.
- `timeSkew` must be optional. If not configured, the service must pass `undefined`.
- `minValidity` must be optional. If not configured, the service must pass `undefined`, which keeps the Keycloak adapter default.
- Invalid numeric config values must be treated as "not configured", not as `NaN`.

### Why this is needed

- The current shell auth architecture refreshes tokens mainly from the HTTP interceptor path via `TokenInterceptor -> AuthProxyService -> AuthServiceWrapper -> KeycloakAuthService`.
- Client-side callback support for `onTokenExpired` and `onAuthRefreshError` was missing as configurable behavior.
- `keycloak.updateToken(minValidity?: number)` already supports a caller-provided threshold, but the shell service only partially used that.
- `keycloak.init({ timeSkew?: number })` accepts a caller-provided skew value, but the shell must only pass a valid number or `undefined`.

## 2. Exact Solution Steps and Places to Modify

### A. Shared config keys

File:
- `onecx-portal-ui-libs/libs/angular-integration-interface/src/lib/model/config-key.model.ts`

Add:
- `KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED`
- `KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED`
- `KEYCLOAK_TIME_SKEW`
- `KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY`

Reason:
- These keys are consumed by `KeycloakAuthService` through `ConfigurationService`.

### B. Keycloak service behavior

File:
- `onecx-portal-ui-libs/libs/shell-auth/src/lib/auth_services/keycloak-auth.service.ts`

Modify:
- Read `KEYCLOAK_TIME_SKEW` through a numeric parser that returns `undefined` for empty or invalid values.
- Await `setupEventListener()` before `keycloak.init(...)` so callback registration is not left racing behind initialization.
- Add a service helper that reads `KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY` and calls `keycloak.updateToken(minValidity)`.
- Reuse that helper from both:
  - `updateTokenIfNeeded()`
  - the configurable `onTokenExpired` branch
- Keep `Semaphore(1)` around service-level refresh execution.

Callback rules:
- `onTokenExpired`
  - always update local storage
  - only refresh if `KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED === 'true'`
- `onAuthRefreshError`
  - always update local storage
  - only login if `KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED === 'true'`

### C. Shell config surface

Files:
- `onecx-shell-ui/src/assets/env.json`
- `onecx-shell-ui/src/environments/environment.ts`

Add:
- `KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED`
- `KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED`
- `KEYCLOAK_TIME_SKEW`
- `KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY`

Observation from this workspace:
- The runtime shell config template is `src/assets/env.json`.
- Local shell startup uses `src/environments/environment.ts` because `skipRemoteConfigLoad: true` is enabled there.
- I did not find separate version-specific shell env templates in this checkout, so these two files are the real config entry points here.

### D. Verification coverage

File:
- `onecx-portal-ui-libs/libs/shell-auth/src/lib/auth_services/keycloak-auth.service.spec.ts`

Add tests for:
- configured `minValidity`
- invalid numeric config -> `undefined`
- disabled `onTokenExpired` keeps old behavior
- enabled `onTokenExpired` refreshes through the service path
- enabled `onAuthRefreshError` triggers login
- concurrent service refresh calls are serialized by the semaphore

## 3. Solution Explanation and References

### Current auth architecture in this workspace

Relevant files:
- `onecx-portal-ui-libs/libs/angular-auth/src/lib/token.interceptor.ts`
- `onecx-portal-ui-libs/libs/angular-auth/src/lib/auth-proxy.service.ts`
- `onecx-portal-ui-libs/libs/shell-auth/src/lib/auth-service-wrapper.ts`
- `onecx-portal-ui-libs/libs/shell-auth/src/lib/auth_services/keycloak-auth.service.ts`

Flow:
1. `TokenInterceptor` waits for auth initialization.
2. It calls `AuthProxyService.updateTokenIfNeeded()`.
3. That forwards to the shell wrapper proxy.
4. `AuthServiceWrapper` delegates to `KeycloakAuthService.updateTokenIfNeeded()`.
5. `KeycloakAuthService` owns the real Keycloak adapter instance and refresh behavior.

This is why the story belongs primarily in `KeycloakAuthService`, not in the interceptor.

### Keycloak API references validated from installed packages

From:
- `onecx-portal-ui-libs/node_modules/keycloak-js/lib/keycloak.d.ts` version `26.2.3`
- `onecx-shell-ui/node_modules/keycloak-js/dist/keycloak.d.ts` version `25.0.6`

Confirmed API facts:
- `onTokenExpired?(): void`
- `onAuthRefreshError?(): void`
- `updateToken(minValidity?: number): Promise<boolean>`
- If `minValidity` is not specified, Keycloak uses `5`
- `timeSkew?: number` is a valid init option

Important correction:
- The callback type in the installed Keycloak typings is `() => void`, so the service should not rely on the callback return value for adapter behavior.

### Why the numeric parser matters

The shell config files store values as strings. Unresolved placeholders or invalid values such as:

- `${KEYCLOAK_TIME_SKEW}`
- `${KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY}`
- `abc`

would produce `NaN` with raw `parseInt(...)`.

That is not the same as Jan's requirement of "undefined if not available".

So the correct behavior is:
- blank or missing -> `undefined`
- invalid number -> log warning and use `undefined`
- valid integer string -> parsed number

### Why the callback refresh should reuse the service helper

Jan explicitly called out that `updateToken` should use configurable `minValidity` in the various refresh locations.

If `onTokenExpired` calls `this.keycloak.updateToken()` directly:
- it bypasses configured `minValidity`
- it bypasses the service semaphore
- it creates a different refresh path than the interceptor path

Using the same service helper keeps all refresh entry points aligned.

### Why `await setupEventListener()` is correct

After making callback setup asynchronous with config lookups, calling it without `await` leaves a race between:
- callback registration
- `keycloak.init(...)`

Awaiting registration ensures the service has attached handlers before initialization proceeds.

### Semaphore note

Reference:
- `onecx-portal-ui-libs/libs/angular-integration-interface/src/lib/services/configuration.service.ts`

The story input explicitly points to `ConfigurationService` and `Semaphore(1)`, so the service follows the same pattern.

Important nuance:
- `Semaphore(1)` serializes refresh execution.
- It does not turn multiple callers into a single shared promise result forever.
- That is still acceptable here because the requirement asked for a mutex pattern, not a custom deduplication cache.

## 4. Implemented Changes

Implemented in this workspace:

- Added the four new config keys to the shared config enum.
- Added the four shell config entries to `src/assets/env.json`.
- Added matching local shell defaults to `src/environments/environment.ts`.
- Tightened `KeycloakAuthService` so:
  - `timeSkew` parsing is safe
  - `minValidity` parsing is safe
  - callback refresh uses the same service refresh logic
  - service refresh stays behind `Semaphore(1)`
  - event listener registration is awaited
- Added unit tests for the new behavior.

## 5. Recommended Story Acceptance Criteria

- Shell auth exposes config keys for token-expired handling, refresh-error handling, time skew, and update-token min validity.
- If the new keys are absent, the service keeps the previous behavior.
- If `KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED` is `true`, token expiration triggers a service-managed refresh.
- If `KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED` is `true`, refresh failure triggers login.
- If `KEYCLOAK_TIME_SKEW` is absent or invalid, the adapter receives `undefined`.
- If `KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY` is absent or invalid, the adapter receives `undefined`.
- Service refresh execution is serialized with `Semaphore(1)`.
- Shell config entry points include the new keys for runtime and local development in this repo.
