# Keycloak UI Test Guide

## Goal

Use the internal shell page to verify the Keycloak story changes with the real shell auth runtime after you replace the auth packages in `node_modules`.

This guide is intentionally written for local verification with the shell.

## Test Page

Route:

`/onecx-shell/keycloak-auth-behavior`

Source files:

- `onecx-shell-ui/src/app/keycloak-auth-behavior/components/keycloak-auth-behavior.component.ts`
- `onecx-shell-ui/src/app/keycloak-auth-behavior/components/keycloak-auth-behavior.component.html`
- `onecx-shell-ui/src/app/keycloak-auth-behavior/keycloak-auth-behavior.module.ts`

## Important Rule For This Page

The page does not mock auth behavior.

It uses the live shell auth runtime:

- `AuthServiceWrapper.updateTokenIfNeeded()`
- the live `KeycloakAuthService` instance already created by the shell
- the live Keycloak callback functions already registered by the shell
- live token data from the Keycloak instance
- live persisted token data from localStorage

So when you swap in the patched auth packages, this same page will start showing the new behavior.

## Where To Set Config For Local Testing

For local shell runs, use:

- `onecx-shell-ui/src/environments/environment.ts`

Reason:

- local shell config currently uses `skipRemoteConfigLoad: true`
- so `environment.ts` is the config source for local runs

For container/runtime style config, the template is:

- `onecx-shell-ui/src/assets/env.json`

But for your local verification, use `environment.ts` first.

## Recommended Local Config Block

Start from this block in `environment.ts`:

```ts
export const environment = {
  KEYCLOAK_CLIENT_ID: 'onecx-shell-ui-client',
  KEYCLOAK_URL: 'http://keycloak-app.localhost/',
  KEYCLOAK_REALM: 'onecx',
  KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED: 'false',
  KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED: 'false',
  KEYCLOAK_TIME_SKEW: '',
  KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY: '',
  skipRemoteConfigLoad: true,
  production: false,
  APP_VERSION: 'Local Shell Version'
}
```

## How To Use The Page

1. Set the config in `environment.ts`.
2. Start the shell locally the way you normally do.
3. Sign in.
4. Open `/onecx-shell/keycloak-auth-behavior`.
5. Open browser DevTools.
6. Keep both `Console` and `Network` open while testing.
7. Before every important test, click `Refresh State`.
8. Compare:
   - current config values on the page
   - runtime snapshot values on the page
   - token/localStorage snapshot on the page
   - browser console logs
   - browser network calls

## What To Watch While Verifying

### On the page

- Runtime auth service type
- Runtime auth provider name
- `authenticated`
- `timeSkew`
- whether callbacks are registered
- token presence
- token expiry timestamps
- localStorage token values

### In browser console

Watch for:

- shell logs around Keycloak callback execution
- login navigation
- refresh activity
- any errors or rejected promises

### In browser network tab

Watch for:

- token refresh requests
- unexpected duplicate refresh requests
- unexpected login navigations

## Buttons On The Page

Safe buttons:

- `Refresh State`
- `Call updateTokenIfNeeded()`
- `Call concurrent updateTokenIfNeeded() x3`
- `Invoke onReady()`
- `Invoke onAuthSuccess()`
- `Invoke onAuthRefreshSuccess()`
- `Invoke onAuthError()`
- `Invoke onActionUpdate()`

Behavior-changing buttons:

- `Invoke onTokenExpired()`
- `Invoke onAuthRefreshError()`
- `Invoke onAuthLogout()`

Navigation-warning buttons:

- `onAuthRefreshError()` when enabled can redirect to login
- `onAuthLogout()` should redirect to login
- `updateTokenIfNeeded()` can redirect to login if the session is not authenticated

## Test Matrix

### TC01: Shell is using Keycloak auth

Config:

- `AUTH_SERVICE = "keycloak"` if your local setup exposes it

Action:

- Open the page

Expected:

- Runtime auth service type should resolve to `KeycloakAuthService`
- Auth provider should resolve to `keycloak-auth`

### TC02: Baseline for disabled onTokenExpired behavior

Config:

```ts
KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED: 'false'
```

Action:

- Click `Invoke onTokenExpired()`

Expected:

- No forced login
- No new behavior should appear
- This is the old behavior baseline

### TC03: Enabled onTokenExpired behavior

Config:

```ts
KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED: 'true'
```

Action:

- Click `Invoke onTokenExpired()`

Expected:

- With the patched auth libs loaded, the live callback should try to refresh the token
- Watch console and network
- Then click `Refresh State`
- Compare access token preview and `exp` before and after

### TC04: Baseline for disabled onAuthRefreshError behavior

Config:

```ts
KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED: 'false'
```

Action:

- Click `Invoke onAuthRefreshError()`

Expected:

- No forced login redirect
- Old behavior remains

### TC05: Enabled onAuthRefreshError behavior

Config:

```ts
KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED: 'true'
```

Action:

- Click `Invoke onAuthRefreshError()`

Expected:

- With the patched auth libs loaded, the shell should redirect to Keycloak login
- This is an expected navigation

### TC06: timeSkew not configured

Config:

```ts
KEYCLOAK_TIME_SKEW: ''
```

Action:

- Reload the shell
- Open the page

Expected:

- Patched code should effectively behave as if `undefined` was passed
- Runtime `timeSkew` should come from Keycloak runtime behavior, not from your config string

### TC07: Positive timeSkew

Config:

```ts
KEYCLOAK_TIME_SKEW: '30'
```

Action:

- Reload the shell
- Open the page

Expected:

- Runtime `timeSkew` should show `30` after init when the patched package is loaded

### TC08: Negative timeSkew

Config:

```ts
KEYCLOAK_TIME_SKEW: '-30'
```

Action:

- Reload the shell
- Open the page

Expected:

- Runtime `timeSkew` should show `-30` after init when the patched package is loaded

### TC09: Invalid timeSkew

Config:

```ts
KEYCLOAK_TIME_SKEW: 'abc'
```

Action:

- Reload the shell
- Open the page

Expected:

- Patched code should treat this like `undefined`
- It should not behave like a numeric value

### TC10: minValidity not configured

Config:

```ts
KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY: ''
```

Action:

- Click `Call updateTokenIfNeeded()`

Expected:

- Patched code should pass `undefined`
- Keycloak should then use its own default behavior

### TC11: minValidity set to zero

Config:

```ts
KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY: '0'
```

Action:

- Click `Call updateTokenIfNeeded()`

Expected:

- Refresh should be less proactive than with a positive threshold like `30`

### TC12: minValidity set to 30

Config:

```ts
KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY: '30'
```

Action:

- Click `Call updateTokenIfNeeded()`

Expected:

- Refresh should become more proactive when the token is near expiry
- Compare token/network behavior with TC10 and TC11

### TC13: Invalid minValidity

Config:

```ts
KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY: 'abc'
```

Action:

- Click `Call updateTokenIfNeeded()`

Expected:

- Patched code should treat this like `undefined`
- It should not behave like a valid numeric threshold

### TC14: onReady localStorage sync

Config:

- any valid authenticated config

Action:

- Click `Invoke onReady()`
- Click `Refresh State`

Expected:

- The localStorage token snapshot should remain aligned with the current Keycloak token snapshot

### TC15: onAuthSuccess localStorage sync

Config:

- any valid authenticated config

Action:

- Click `Invoke onAuthSuccess()`
- Click `Refresh State`

Expected:

- localStorage token snapshot should remain aligned with Keycloak token snapshot

### TC16: onAuthRefreshSuccess localStorage sync

Config:

- any valid authenticated config

Action:

- Click `Invoke onAuthRefreshSuccess()`
- Click `Refresh State`

Expected:

- localStorage token snapshot should remain aligned with Keycloak token snapshot

### TC17: onAuthError localStorage sync

Config:

- any valid authenticated config

Action:

- Click `Invoke onAuthError()`
- Click `Refresh State`

Expected:

- no forced login from this callback
- localStorage sync should still happen

### TC18: onActionUpdate localStorage sync

Config:

- any valid authenticated config

Action:

- Click `Invoke onActionUpdate()`
- Click `Refresh State`

Expected:

- no forced login from this callback
- localStorage sync should still happen

### TC19: Authenticated updateTokenIfNeeded path

Config:

- authenticated session

Action:

- Click `Call updateTokenIfNeeded()`

Expected:

- promise should resolve
- if the token is close to expiry, a real refresh can happen
- page should remain stable

### TC20: Unauthenticated updateTokenIfNeeded path

Config:

- no active session

Action:

- Open the page without a valid authenticated session
- Click `Call updateTokenIfNeeded()`

Expected:

- login redirect is expected

### TC21: Concurrent updateTokenIfNeeded path

Config:

- authenticated session
- preferably token close enough to expiry to exercise refresh

Action:

- Click `Call concurrent updateTokenIfNeeded() x3`

Expected:

- all three calls should settle cleanly
- no shell crash
- no unhandled promise rejection

Important note:

- UI alone does not perfectly prove app-level semaphore behavior because Keycloak already has its own internal refresh queue
- use this test mainly to confirm stability and absence of breaking behavior

### TC22: onAuthLogout behavior

Config:

- authenticated session

Action:

- Click `Invoke onAuthLogout()`

Expected:

- localStorage token entries should be cleared
- login redirect should happen

### TC23: Expired refresh token cleanup during init

Config:

- manually seed expired refresh token data in localStorage before reload

Action:

- reload the shell
- open the page

Expected:

- stale token, idToken, and refreshToken entries should be removed on init

### TC24: Silent SSO unchanged

Config:

```ts
KEYCLOAK_ENABLE_SILENT_SSO: 'true'
```

Action:

- reload the shell
- sign in normally

Expected:

- silent SSO behavior should remain unchanged by this story

## Recommended Focus Order

Run the tests in this order first:

1. TC01
2. TC02
3. TC03
4. TC04
5. TC05
6. TC10
7. TC12
8. TC13
9. TC19
10. TC21

Then cover the remaining regression cases.

## Suggested Config Sets

### Set A: Old behavior baseline

```ts
KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED: 'false',
KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED: 'false',
KEYCLOAK_TIME_SKEW: '',
KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY: '',
```

### Set B: Main story verification

```ts
KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED: 'true',
KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED: 'true',
KEYCLOAK_TIME_SKEW: '30',
KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY: '45',
```

### Set C: Edge-case numeric parsing

```ts
KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED: 'true',
KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED: 'true',
KEYCLOAK_TIME_SKEW: 'abc',
KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY: 'abc',
```

## What You Need To Do From Your Side

1. Replace the auth packages in `node_modules` with the patched version when you are ready.
2. Set the local config in `onecx-shell-ui/src/environments/environment.ts`.
3. Reload the shell after every config change that affects init-time behavior such as `timeSkew`.
4. Keep DevTools Console and Network open during testing.
5. Use the internal test page for the live actions and token/localStorage comparison.

## What Counts As Correct

- No unexpected shell crash
- No unexpected redirect when feature is disabled
- Redirect happens when the feature is enabled and the story says it should
- Token/localStorage sync continues to work
- `timeSkew` behaves correctly only after reload
- `minValidity` behavior changes only when configured
- invalid numeric values behave like not configured values in the patched code
