# Files from C:\Users\prath\onecx\onecx-ui\onecx-portal-ui-libs\libs\angular-auth

## Folder: angular-auth (12 files)

### File: angular-auth/.eslintrc.json

```json

{
  "extends": ["../../.eslintrc.json"],
  "ignorePatterns": ["!**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": ["plugin:@nx/angular", "plugin:@angular-eslint/template/process-inline-templates"],
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "ocx",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "ocx",
            "style": "kebab-case"
          }
        ],
        "no-restricted-syntax": [
          "off",
          {
            "selector": "CallExpression[callee.object.name=\"console\"][callee.property.name=/^(debug|info|time|timeEnd|trace)$/]"
          }
        ]
      }
    },
    {
      "files": ["*.html"],
      "extends": ["plugin:@nx/angular-template"],
      "rules": {}
    },
    {
      "files": ["*.json"],
      "parser": "jsonc-eslint-parser",
      "rules": {
        "@nx/dependency-checks": "error"
      }
    }
  ]
}


```

### File: angular-auth/jest.config.ts

```ts

/* eslint-disable */
import { createReportsConfig } from '../../jest-config-factory'

export default {
  displayName: 'angular-auth',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],

  ...createReportsConfig('angular-auth'),
}


```

### File: angular-auth/migrations.json

```json

{
  "generators": {
    "migrate-onecx-to-v6": {
      "cli": "nx",
      "version": "6.0.0",
      "description": "Update package json to Angular 19, PrimeNG 19, OneCX versions to v6 and other dependencies to be compatible with Angular 19.",
      "factory": "migrations/v6/migrate-onecx-to-v6"
    }
  },
  "packageJsonUpdates": {
    "6.0.0": {
      "version": "6.0.0",
      "packages": {
        "@angular/cli": {
          "version": "~19.0.0",
          "alwaysAddToPackageJson": false
        },
        "@nx/angular": {
          "version": "~20.3.0",
          "alwaysAddToPackageJson": false
        },
        "@ngx-translate/core": {
          "version": "~16.0.4",
          "alwaysAddToPackageJson": false
        },
        "primeng": {
          "version": "~19.0.0",
          "alwaysAddToPackageJson": false
        }
      }
    },
    "version": "null"
  }
}

```

### File: angular-auth/ng-package.json

```json

{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/libs/angular-auth",
  "lib": {
    "entryFile": "src/index.ts"
  },
  "assets": [
    "CHANGELOG.md",
    "./assets/**",
    "./migrations.json"
  ]
}

```

### File: angular-auth/package.json

```json

{
  "name": "@onecx/angular-auth",
  "version": "7.0.0-rc.13",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/onecx/onecx-portal-ui-libs"
  },
  "peerDependencies": {
    "@angular-architects/module-federation": "^18.0.4",
    "@angular/common": "^19.0.0",
    "@angular/core": "^19.0.0",
    "@onecx/angular-integration-interface": "^7.0.0-rc.13",
    "@onecx/integration-interface": "^7.0.0-rc.13",
    "keycloak-js": "^25.0.1",
    "rxjs": "~7.8.0",
    "@nx/devkit": "^20.3.0",
    "@onecx/nx-migration-utils": "^7.0.0-rc.13"
  },
  "publishConfig": {
    "access": "public"
  },
  "nx-migrations": {
    "migrations": "./migrations.json"
  }
}


```

### File: angular-auth/package-lock.json

```json

{
  "name": "@onecx/angular-auth",
  "version": "4.17.1",
  "lockfileVersion": 1,
  "requires": true,
  "dependencies": {
    "@types/systemjs": {
      "version": "6.13.5",
      "resolved": "https://registry.npmjs.org/@types/systemjs/-/systemjs-6.13.5.tgz",
      "integrity": "sha512-VWG7Z1/cb90UQF3HjkVcE+PB2kts93mW/94XQ2XUyHk+4wpzVrTdfXw0xeoaVyI/2XUuBRuCA7Is25RhEfHXNg==",
      "dev": true
    }
  }
}


```

### File: angular-auth/project.json

```json

{
  "name": "angular-auth",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/angular-auth/src",
  "prefix": "ocx",
  "tags": [],
  "projectType": "library",
  "targets": {
    "build-migrations": {
      "dependsOn": ["build"],
      "executor": "nx:run-commands",
      "options": {
        "commands": ["tsc -p libs/angular-auth/migrations/tsconfig.migrations.json"]
      }
    },
    "build": {
      "executor": "@nx/angular:package",
      "outputs": ["{workspaceRoot}/dist/{projectRoot}"],
      "options": {
        "project": "libs/angular-auth/ng-package.json"
      },
      "configurations": {
        "production": {
          "tsConfig": "libs/angular-auth/tsconfig.lib.prod.json"
        },
        "development": {
          "tsConfig": "libs/angular-auth/tsconfig.lib.json"
        }
      },
      "defaultConfiguration": "production"
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "libs/angular-auth/jest.config.ts",
        "passWithNoTests": true
      },
      "configurations": {
        "ci": {
          "ci": true,
          "codeCoverage": true
        }
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint",
      "outputs": ["{options.outputFile}"],
      "options": {
        "lintFilePatterns": [
          "libs/angular-auth/**/*.ts",
          "libs/angular-auth/**/*.html",
          "libs/angular-auth/package.json"
        ]
      }
    },
    "release": {
      "executor": "@onecx/release:update-build-publish",
      "options": {
        "buildTarget": "build-migrations"
      }
    }
  }
}


```

### File: angular-auth/sonar-project.properties

```properties

# sonar.verbose=true
# run locally:
#   docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest
#      user/pwd: admin/admin
#      generate project token and use it in sonar.token!
# start:
#   npm run sonar
#
sonar.host.url=http://localhost:9000
sonar.token=<SONAR_TOKEN>
sonar.verbose=false
#
sonar.organization=onecx
sonar.projectKey=onecx-portal-ui-libs-angular-auth
sonar.projectName=onecx-portal-ui-libs-angular-auth
#
sonar.scm.disabled=true
sonar.sources=src
sonar.tests=src
sonar-language="js"
sonar.sourceEncoding=UTF-8
#
# reporting
sonar.javascript.coveragePlugin=lcov
sonar.javascript.lcov.reportPaths=../../reports/angular-auth/coverage/lcov.info
sonar.testExecutionReportPaths=../../reports/angular-auth/sonarqube_report.xml
sonar.working.directory=../../reports/angular-auth/.scannerwork
# files
sonar.exclusions=src/assets/**/*,src/migrations/**/*,src/mocks/**/*
sonar.cpd.exclusions=src/**/*.ts,src/**/*.html
sonar.coverage.exclusions=*.ts,*.js,src/*.ts,**/*.spec.ts,**/*.test.ts,**/*.stories.ts,**/*.harness.ts,**/environments/**,**/assets/**,**/generated/**,**/*.module.ts,**/*.main.ts
sonar.test.inclusions=src/**/*.spec.ts, src/**/*.test.ts
# issue exceptions
sonar.issue.ignore.multicriteria=e1
# ignore rule to allow async actions inside constructors
sonar.issue.ignore.multicriteria.e1.ruleKey=typescript:S7059
sonar.issue.ignore.multicriteria.e1.resourceKey=**/*.ts

```

### File: angular-auth/tsconfig.json

```json

{
  "compilerOptions": {
    "target": "es2022",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  },
  "files": [],
  "include": [],
  "references": [
    {
      "path": "./tsconfig.lib.json"
    },
    {
      "path": "./tsconfig.lib.prod.json"
    },
    {
      "path": "./tsconfig.spec.json"
    }
  ],
  "extends": "../../tsconfig.base.json",
  "angularCompilerOptions": {
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}


```

### File: angular-auth/tsconfig.lib.json

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "declaration": true,
    "declarationMap": true,
    "inlineSources": true,
    "types": ["node"],
    "target": "es2022"
  },
  "exclude": ["src/**/*.spec.ts", "src/test-setup.ts", "jest.config.ts", "src/**/*.test.ts"],
  "include": ["src/**/*.ts"]
}


```

### File: angular-auth/tsconfig.lib.prod.json

```json

{
  "extends": "./tsconfig.lib.json",
  "compilerOptions": {
    "declarationMap": false,
    "target": "es2022",
    "useDefineForClassFields": false
  },
  "angularCompilerOptions": {
    "compilationMode": "partial"
  }
}


```

### File: angular-auth/tsconfig.spec.json

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "module": "commonjs",
    "target": "es2022",
    "types": ["jest", "node"]
  },
  "files": ["src/test-setup.ts"],
  "include": ["jest.config.ts", "src/**/*.test.ts", "src/**/*.spec.ts", "src/**/*.d.ts"]
}


```

## Folder: angular-auth/migrations (3 files)

### File: angular-auth/migrations/index.ts

```ts

export * from './v6/migrate-onecx-to-v6'

```

### File: angular-auth/migrations/tsconfig.json

```json

{
    "extends": "../../../tsconfig.base.json",
    "compilerOptions": {
      "module": "commonjs",
      "forceConsistentCasingInFileNames": true,
      "strict": true,
      "noImplicitOverride": true,
      "noPropertyAccessFromIndexSignature": true,
      "noImplicitReturns": true,
      "noFallthroughCasesInSwitch": true
    },
    "files": [],
    "include": [],
    "references": [
      {
        "path": "./tsconfig.migrations.json"
      }
    ]
  }

```

### File: angular-auth/migrations/tsconfig.migrations.json

```json

{
    "extends": "./tsconfig.json",
    "compilerOptions": {
      "outDir": "../../../dist",
      "declaration": true,
      "types": ["node"]
    },
    "include": ["**/*.ts"],
    "exclude": ["jest.config.ts", "src/**/*.spec.ts", "src/**/*.test.ts"]
  }
  

```

## Folder: angular-auth/migrations/v6 (1 files)

### File: angular-auth/migrations/v6/migrate-onecx-to-v6.ts

```ts

import { Tree } from '@nx/devkit'
import { commonMigrateOnecxToV6 } from '@onecx/nx-migration-utils'

export default async function migrateOnecxToV6(tree: Tree) {
  await commonMigrateOnecxToV6(tree)
}


```

## Folder: angular-auth/src (2 files)

### File: angular-auth/src/index.ts

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

### File: angular-auth/src/test-setup.ts

```ts

// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
}
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone'
setupZoneTestEnv()


```

## Folder: angular-auth/src/lib (6 files)

### File: angular-auth/src/lib/angular-auth.module.ts

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

@NgModule({
  imports: [CommonModule],
  providers: [
    provideTokenInterceptor(),
    provideAuthServices(), // Only needed as fallback if shell uses lib version without new auth mechanism
  ],
})
export class AngularAuthModule {}


```

### File: angular-auth/src/lib/auth.service.ts

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

### File: angular-auth/src/lib/auth-proxy.service.ts

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

### File: angular-auth/src/lib/auth-service-wrapper.ts

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

### File: angular-auth/src/lib/declarations.ts

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

### File: angular-auth/src/lib/token.interceptor.ts

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

## Folder: angular-auth/src/lib/auth_services (2 files)

### File: angular-auth/src/lib/auth_services/disabled-auth.service.ts

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

### File: angular-auth/src/lib/auth_services/keycloak-auth.service.ts

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


