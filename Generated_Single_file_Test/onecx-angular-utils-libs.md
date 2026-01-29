# Files from C:\Users\prath\onecx\onecx-ui\onecx-portal-ui-libs\libs\angular-utils

## Folder: angular-utils (11 files)

### File: angular-utils/.eslintrc.json

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
            "prefix": "lib",
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

### File: angular-utils/jest.config.ts

```ts

/* eslint-disable */
import { createReportsConfig } from '../../jest-config-factory'

export default {
  ...createReportsConfig('angular-utils'),
  displayName: 'angular-utils',
  preset: '../../jest.preset.js',
  testMatch: ['<rootDir>/src/lib/**/*.spec.ts', '<rootDir>/guards/**/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '@primeng/themes': '<rootDir>/../../node_modules/@primeng/themes/index.mjs',
  },
  transform: {
    '^.+\\.(mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
    '^.+\\.tsx?$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: { metaObjectReplacement: { url: 'https://www.url.com' } },
            },
          ],
        },
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
}


```

### File: angular-utils/migrations.json

```json

{
  "generators": {
    "migrate-onecx-to-v6": {
      "cli": "nx",
      "version": "6.0.0",
      "description": "Update package json to Angular 19, PrimeNG 19, OneCX versions to v6 and other dependencies to be compatible with Angular 19.",
      "factory": "migrations/v6/migrate-onecx-to-v6"
    },
    "replace-translation-path-factories": {
      "cli": "nx",
      "version": "6.0.0",
      "description": "Replaces deprecated translationPathFactory and remoteComponentTranslationPathFactory with provideTranslationPathFromMeta.",
      "factory": "migrations/v6/replace-translation-path-factories"
    },
    "add-import-meta-to-webpack-config": {
      "cli": "nx",
      "version": "6.0.0",
      "description": "Adds importMeta configuration to module.exports of the webpack config.",
      "factory": "migrations/v6/add-import-meta-to-webpack-config"
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

### File: angular-utils/ng-package.json

```json

{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/libs/angular-utils",
  "lib": {
    "entryFile": "src/index.ts"
  },
  "assets": ["./assets/**", "CHANGELOG.md", "./migrations.json"]
}


```

### File: angular-utils/package.json

```json

{
  "name": "@onecx/angular-utils",
  "version": "7.0.0-rc.13",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/onecx/onecx-portal-ui-libs"
  },
  "peerDependencies": {
    "@angular/common": "^19.0.0",
    "@angular/core": "^19.0.0",
    "@angular/router": "^19.0.0",
    "@ngx-translate/core": "^16.0.0",
    "@ngx-translate/http-loader": "^8.0.0",
    "@onecx/accelerator": "^7.0.0-rc.13",
    "@onecx/angular-integration-interface": "^7.0.0-rc.13",
    "@primeng/themes": "^19.0.5",
    "rxjs": "^7.8.1",
    "primeng": "^19.0.6",
    "@primeuix/styled": "^0.3.2",
    "@angular/platform-browser": "^19.0.0",
    "@nx/devkit": "^20.3.0",
    "@onecx/nx-migration-utils": "^7.0.0-rc.13",
    "@onecx/integration-interface": "^7.0.0-rc.13",
    "@jest/globals": "29.7.0",
    "jest-extended": "^6.0.0",
    "@phenomnomnominal/tsquery": "^6",
    "typescript": "^5.5.4",
    "jest-preset-angular": "^14.2.2"
  },
  "publishConfig": {
    "access": "public"
  },
  "nx-migrations": {
    "migrations": "./migrations.json"
  }
}


```

### File: angular-utils/project.json

```json

{
  "name": "angular-utils",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/angular-utils/src",
  "prefix": "lib",
  "projectType": "library",
  "tags": [],
  "targets": {
    "build-migrations": {
      "dependsOn": ["build"],
      "executor": "nx:run-commands",
      "options": {
        "commands": ["tsc -p libs/angular-utils/migrations/tsconfig.migrations.json"]
      }
    },
    "build": {
      "executor": "@nx/angular:package",
      "outputs": ["{workspaceRoot}/dist/{projectRoot}"],
      "options": {
        "project": "libs/angular-utils/ng-package.json"
      },
      "configurations": {
        "production": {
          "tsConfig": "libs/angular-utils/tsconfig.lib.prod.json"
        },
        "development": {
          "tsConfig": "libs/angular-utils/tsconfig.lib.json"
        }
      },
      "defaultConfiguration": "production"
    },
    "test-migrations": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "libs/angular-utils/migrations/jest.config.ts",
        "passWithNoTests": true
      },
      "configurations": {
        "ci": {
          "ci": true,
          "codeCoverage": true
        }
      }
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "libs/angular-utils/jest.config.ts",
        "passWithNoTests": true,
        "testPathIgnorePatterns": ["libs/angular-utils/migrations/"]
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
          "libs/angular-utils/**/*.ts",
          "libs/angular-utils/**/*.html",
          "libs/angular-utils/package.json"
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

### File: angular-utils/sonar-project.properties

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
sonar.projectKey=onecx-portal-ui-libs-angular-utils
sonar.projectName=onecx-portal-ui-libs-angular-utils
#
sonar.scm.disabled=true
sonar.sources=src
sonar.tests=src
sonar-language="js"
sonar.sourceEncoding=UTF-8
#
# reporting
sonar.javascript.coveragePlugin=lcov
sonar.javascript.lcov.reportPaths=../../reports/angular-utils/coverage/lcov.info
sonar.testExecutionReportPaths=../../reports/angular-utils/sonarqube_report.xml
sonar.working.directory=../../reports/angular-utils/.scannerwork
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

### File: angular-utils/tsconfig.json

```json

{
  "compilerOptions": {
    "target": "es2022",
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
      "path": "./tsconfig.lib.json"
    },
    {
      "path": "./tsconfig.spec.json"
    }
  ],
  "extends": "../../tsconfig.base.json",
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}


```

### File: angular-utils/tsconfig.lib.json

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "declaration": true,
    "declarationMap": true,
    "inlineSources": true,
    "types": ["node"]
  },
  "exclude": ["src/**/*.spec.ts", "src/test-setup.ts", "jest.config.ts", "src/**/*.test.ts"],
  "include": ["src/**/*.ts"]
}


```

### File: angular-utils/tsconfig.lib.prod.json

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
    },
  }
  

```

### File: angular-utils/tsconfig.spec.json

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "module": "commonjs",
    "target": "es2016",
    "types": ["jest", "node"]
  },
  "files": ["src/test-setup.ts"],
  "include": ["jest.config.ts", "src/**/*.test.ts", "src/**/*.spec.ts", "src/**/*.d.ts"],
  "exclude": ["migrations/**/*.spec.ts"]
}


```

## Folder: angular-utils/assets/i18n (2 files)

### File: angular-utils/assets/i18n/de.json

```json

{
  "OCX_PORTAL_PAGE": {
    "UNAUTHORIZED_TITLE": "Nicht autorisiert",
    "UNAUTHORIZED_MESSAGE": "Leider verfÃ¼gen Sie nicht Ã¼ber die erforderliche Berechtigung zum Anzeigen dieser Seite.",
    "MISSING_PERMISSION": "Fehlender BerechtigungsschlÃ¼ssel: {{permission}}"
  }
}


```

### File: angular-utils/assets/i18n/en.json

```json

{
  "OCX_PORTAL_PAGE": {
    "UNAUTHORIZED_TITLE": "Unauthorized",
    "UNAUTHORIZED_MESSAGE": "Sorry, you do not have the permission required to view this page.",
    "MISSING_PERMISSION": "Missing permission key: {{permission}}"
  }
}


```

## Folder: angular-utils/guards (6 files)

### File: angular-utils/guards/index.ts

```ts

export * from './src/utils/guards-utils.utils'
export * from './src/utils/activate-guards-wrapper.utils'
export * from './src/utils/deactivate-guards-wrapper.utils'
export * from './src/utils/wrap-guards.utils'
export * from './src/services/guards-navigation-controller.service'
export * from './src/services/guards-gatherer.service'
export * from './src/model/guard-navigation.model'


```

### File: angular-utils/guards/ng-package.json

```json

{
  "$schema": "../../../node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "index.ts"
  }
}


```

### File: angular-utils/guards/tsconfig.json

```json

{
    "compilerOptions": {
      "target": "es2022",
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
        "path": "./tsconfig.lib.json"
      },
      {
        "path": "./tsconfig.spec.json"
      }
    ],
    "extends": "../../../tsconfig.base.json",
    "angularCompilerOptions": {
      "enableI18nLegacyMessageIdFormat": false,
      "strictInjectionParameters": true,
      "strictInputAccessModifiers": true,
      "strictTemplates": true
    }
  }
  

```

### File: angular-utils/guards/tsconfig.lib.json

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "declaration": true,
    "declarationMap": true,
    "inlineSources": true,
    "types": ["node"]
  },
  "exclude": ["src/**/*.spec.ts", "src/test-setup.ts", "jest.config.ts", "src/**/*.test.ts"],
  "include": ["src/**/*.ts"]
}


```

### File: angular-utils/guards/tsconfig.lib.prod.json

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
    },
    "exclude": ["jest.config.ts"]
  }
  

```

### File: angular-utils/guards/tsconfig.spec.json

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "module": "commonjs",
    "target": "es2016",
    "types": ["jest", "node"]
  },
  "files": ["src/test-setup.ts"],
  "include": ["jest.config.ts", "src/**/*.test.ts", "src/**/*.spec.ts", "src/**/*.d.ts"]
}


```

## Folder: angular-utils/guards/src (2 files)

### File: angular-utils/guards/src/declarations.ts

```ts

declare global {
  interface Window {
    '@onecx/angular-utils': {
      guards?: {
        debug?: boolean
      }
    }
  }
}

window['@onecx/angular-utils'] ??= {}
window['@onecx/angular-utils'].guards ??= {}

export default globalThis


```

### File: angular-utils/guards/src/test-setup.ts

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

## Folder: angular-utils/guards/src/model (1 files)

### File: angular-utils/guards/src/model/guard-navigation.model.ts

```ts

/**
 * Scattered guards navigation state model.
 * Used to check if the guard checks are requested in the navigation state by different application.
 * This is used to perform guard checks without navigating.
 */
export interface GuardsNavigationState {
  [IS_ROUTER_SYNC]?: boolean
  [IS_INITIAL_ROUTER_SYNC]?: boolean
  [GUARD_CHECK]?: boolean
  [GUARD_CHECK_PROMISE]?: GuardCheckPromise
}

export type GuardCheckPromise = Promise<boolean>

/**
 * Indicates that the router is in sync mode.
 */
export const IS_ROUTER_SYNC = 'isRouterSync'

/**
 * Indicates that the router is in initial sync mode.
 */
export const IS_INITIAL_ROUTER_SYNC = 'isInitialRouterSync'

/**
 * Indicates that the guard check is requested.
 */
export const GUARD_CHECK = 'guardCheck'

/**
 * Indicates that the guard check promise was requested by this application.
 * This is used to wait for the external guard checks to be completed before proceeding with the navigation.
 */
export const GUARD_CHECK_PROMISE = 'guardCheckPromise'

export enum GUARD_MODE {
  INITIAL_ROUTER_SYNC = 'initialRouterSync',
  ROUTER_SYNC = 'routerSync',
  GUARD_CHECK = 'guardCheck',
  NAVIGATION_REQUESTED = 'navigationRequested',
}


```

## Folder: angular-utils/guards/src/services (4 files)

### File: angular-utils/guards/src/services/guards-gatherer.service.spec.ts

```ts

import { GuardResultResponse, GuardsGatherer } from './guards-gatherer.service'
import { Router } from '@angular/router'
import { TestBed } from '@angular/core/testing'
import { Gatherer } from '@onecx/accelerator'
import { GuardsNavigationStateController } from './guards-navigation-controller.service'
import { GUARD_CHECK } from '../model/guard-navigation.model'

jest.mock('@onecx/accelerator', () => ({
  Gatherer: jest.fn().mockImplementation(() => ({
    gather: jest.fn(),
    destroy: jest.fn(),
  })),
}))

describe('GuardsGatherer', () => {
  let service: GuardsGatherer
  const routerMock = { navigateByUrl: jest.fn() }
  const guardsNavigationStateController = {
    createGuardCheckState: jest.fn().mockReturnValue({}),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GuardsGatherer,
        { provide: Router, useValue: routerMock },
        { provide: GuardsNavigationStateController, useValue: guardsNavigationStateController },
      ],
    })

    service = TestBed.inject(GuardsGatherer)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should destroy guardsGatherer on destroy', () => {
    service.activate()
    expect(service['guardsGatherer']).toBeDefined()
    const destroySpy = jest.spyOn(service['guardsGatherer']!, 'destroy')

    service.ngOnDestroy()

    expect(destroySpy).toHaveBeenCalled()
  })

  it('should activate the gatherer', () => {
    service.activate()
    expect(Gatherer).toHaveBeenCalledWith('GuardGatherer', 1, expect.any(Function))
  })

  it('should destroy the gatherer on deactivate', () => {
    service.activate()
    expect(service['guardsGatherer']).toBeDefined()
    const destroySpy = jest.spyOn(service['guardsGatherer']!, 'destroy')

    service.deactivate()
    expect(destroySpy).toHaveBeenCalled()
  })

  it('should gather guard results', async () => {
    service.activate()
    const request = { url: '/test' }
    const response = [true, true]

    service['guardsGatherer']!.gather = jest.fn().mockResolvedValue(response)

    const result = await service.gather(request)

    expect(service['guardsGatherer']!.gather).toHaveBeenCalledWith(request)
    expect(result).toBe(response)
  })

  it('should throw error if gather is called before activation', async () => {
    const request = { url: '/test' }

    expect(() => service.gather(request)).toThrow('Guards gatherer is not active')
  })

  it('should call executeGuardsCallback on gather', async () => {
    service.activate()
    const request = { url: '/test' }
    const navigateSpy = jest.spyOn(routerMock, 'navigateByUrl')
    guardsNavigationStateController.createGuardCheckState.mockReturnValue({ [GUARD_CHECK]: true })

    // Mock the callback function call
    service['executeGuardsCallback'](request)

    expect(navigateSpy).toHaveBeenCalledWith(request.url, {
      state: guardsNavigationStateController.createGuardCheckState(),
      onSameUrlNavigation: 'reload',
    })
    expect(service['guardsChecks']).toBeDefined()
    expect(service['guardsChecks']!.get(request.url)).toBeDefined()
  })

  it('should throw an error if executeGuardsCallback is called when not active', async () => {
    await expect(() => service['executeGuardsCallback']({ url: '/test' })).rejects.toThrow(
      'Guards gatherer is not active'
    )
  })

  it('should resolve route with guard result response', () => {
    service.activate()
    expect(service['guardsChecks']).toBeDefined()
    const routeUrl = '/test'
    const promiseToResolve = new Promise<GuardResultResponse>((resolve) =>
      service['guardsChecks']!.set(routeUrl, resolve)
    )
    expect(service['guardsChecks']!.get(routeUrl)).toBeDefined()

    service.resolveRoute(routeUrl, true)
    expect(promiseToResolve).resolves.toBe(true)
    expect(service['guardsChecks']!.get(routeUrl)).toBeUndefined()
  })

  it('should throw an error if resolveRoute is called when not active', () => {
    expect(() => service.resolveRoute('/test', true)).toThrow('Guards gatherer is not active')
  })
})


```

### File: angular-utils/guards/src/services/guards-gatherer.service.ts

```ts

import { inject, Injectable, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Gatherer } from '@onecx/accelerator'
import { GuardsNavigationStateController } from './guards-navigation-controller.service'
import { logGuardsDebug } from '../utils/guards-utils.utils'

/**
 * Request for performing guard checks.
 * It contains the URL of the route for which the guard checks are requested.
 */
export type GuardResultRequest = {
  url: string
}

/**
 * Response for the guard checks.
 * It indicates whether the guard checks were successful or not.
 */
export type GuardResultResponse = boolean

export const GUARDS_GATHERER_NAME = 'GuardGatherer'

/**
 * GuardsGatherer is used to gather results of navigation guards.
 * It allows to perform guard checks of the application.
 * GuardsGatherer adds information in the navigation state to request guard checks.
 * It is expected that guards wrappers will use this information to perform checks and respond if checks are not successful. Otherwise, it will proceed with the navigation and navigation will be rejected on GuardsCheckEnd and results will be reported.
 * It uses a Gatherer to manage the requests and responses.
 */
@Injectable({
  providedIn: 'root',
})
export class GuardsGatherer implements OnDestroy {
  private guardsGatherer: Gatherer<GuardResultRequest, GuardResultResponse> | undefined
  private guardsChecks: Map<string, (value: GuardResultResponse) => void> | undefined
  private guardsNavigationStateController = inject(GuardsNavigationStateController)

  constructor(private router: Router) {}

  ngOnDestroy(): void {
    this.guardsGatherer?.destroy()
  }

  /**
   * Schedules a request to gather guard results.
   * @param request - the request to gather guard results
   * @returns Promise that resolves with the response of the guard results.
   */
  gather(request: GuardResultRequest) {
    if (this.guardsGatherer === undefined) {
      this.throwNotActiveError()
    }
    request.url = this.normalizeUrl(request.url)
    return this.guardsGatherer.gather(request)
  }

  /**
   * Resolves the guard results for a specific route.
   * @param routeUrl - the URL of the route for which the guard results are resolved
   * @param response - the response of the guard result
   */
  resolveRoute(routeUrl: string, response: GuardResultResponse) {
    if (this.guardsChecks === undefined) {
      this.throwNotActiveError()
    }
    const url = this.normalizeUrl(routeUrl)
    const resolve = this.guardsChecks.get(url)
    resolve && resolve(response)
    this.guardsChecks.delete(url)
  }

  /**
   * Activates the GuardsGatherer service.
   * It initializes the Gatherer and sets up the callback to execute guard checks.
   */
  activate(): void {
    this.guardsGatherer = new Gatherer(GUARDS_GATHERER_NAME, 1, (request) => this.executeGuardsCallback(request))
    this.guardsChecks = new Map()
  }

  /**
   * Deactivates the GuardsGatherer service.
   * It destroys the Gatherer and clears the checks.
   */
  deactivate(): void {
    this.guardsGatherer?.destroy()
    delete this.guardsChecks
  }

  private executeGuardsCallback(request: GuardResultRequest): Promise<GuardResultResponse> {
    logGuardsDebug('Executing callback for request:', request)
    const routeUrl = request.url

    // Fake navigation to request guard check
    this.router.navigateByUrl(routeUrl, {
      state: this.guardsNavigationStateController.createGuardCheckState(),
      // Important, force navigation
      // to ensure that we are checking guards
      // even if the route is already active.
      onSameUrlNavigation: 'reload',
    })

    let resolve: (value: GuardResultResponse) => void
    return new Promise<GuardResultResponse>((r) => {
      resolve = r
      if (this.guardsChecks === undefined) {
        this.throwNotActiveError()
      }
      this.guardsChecks.set(routeUrl, resolve)
    })
  }

  private normalizeUrl(url: string): string {
    let result = url
    result = result.startsWith('/') ? result : `/${result}`
    result = result.endsWith('/') ? result.slice(0, -1) : result
    return result
  }

  private throwNotActiveError(): never {
    throw new Error('Guards gatherer is not active')
  }
}


```

### File: angular-utils/guards/src/services/guards-navigation-controller.service.spec.ts

```ts

import { GuardsNavigationStateController } from './guards-navigation-controller.service'
import {
  GUARD_CHECK,
  GUARD_CHECK_PROMISE,
  GUARD_MODE,
  IS_INITIAL_ROUTER_SYNC,
  IS_ROUTER_SYNC,
} from '../model/guard-navigation.model'

describe('GuardsNavigationStateController', () => {
  let controller: GuardsNavigationStateController

  beforeEach(() => {
    controller = new GuardsNavigationStateController()
  })

  it('should return INITIAL_ROUTER_SYNC mode if IS_INITIAL_ROUTER_SYNC is true', () => {
    const state = { [IS_INITIAL_ROUTER_SYNC]: true }
    expect(controller.getMode(state)).toBe(GUARD_MODE.INITIAL_ROUTER_SYNC)
  })

  it('should return ROUTER_SYNC mode if IS_ROUTER_SYNC is true', () => {
    const state = { [IS_ROUTER_SYNC]: true }
    expect(controller.getMode(state)).toBe(GUARD_MODE.ROUTER_SYNC)
  })

  it('should return GUARD_CHECK mode if GUARD_CHECK is true', () => {
    const state = { [GUARD_CHECK]: true }
    expect(controller.getMode(state)).toBe(GUARD_MODE.GUARD_CHECK)
  })

  it('should return NAVIGATION_REQUESTED mode if no other mode is set', () => {
    const state = {}
    expect(controller.getMode(state)).toBe(GUARD_MODE.NAVIGATION_REQUESTED)
  })

  it('should create initial router sync state', () => {
    const state = controller.createInitialRouterSyncState()
    expect(state[IS_ROUTER_SYNC]).toBe(true)
    expect(state[IS_INITIAL_ROUTER_SYNC]).toBe(true)
  })

  it('should modify existing state to initial router sync state', () => {
    const existingState = {}
    const expectedState = {
      [IS_ROUTER_SYNC]: true,
      [IS_INITIAL_ROUTER_SYNC]: true,
    }

    const state = controller.createInitialRouterSyncState(existingState)

    expect(state).toBe(existingState)
    expect(state).toEqual(expectedState)
  })

  it('should create guard check state', () => {
    const state = controller.createGuardCheckState()
    expect(state[GUARD_CHECK]).toBe(true)
  })

  it('should modify existing state to guard check state', () => {
    const existingState = {}
    const state = controller.createGuardCheckState(existingState)
    expect(state).toBe(existingState)
    expect(state[GUARD_CHECK]).toBe(true)
  })

  it('should create navigation requested state', () => {
    const mockPromise = Promise.resolve(true)
    const state = controller.createNavigationRequestedState(mockPromise)
    expect(state[GUARD_CHECK_PROMISE]).toBe(mockPromise)
  })

  it('should modify existing state to navigation requested state', () => {
    const mockPromise = Promise.resolve(true)
    const existingState = {}
    const state = controller.createNavigationRequestedState(mockPromise, existingState)
    expect(state).toBe(existingState)
    expect(state[GUARD_CHECK_PROMISE]).toBe(mockPromise)
  })

  it('should retrieve GuardCheckPromise from state', () => {
    const mockPromise = Promise.resolve(true)
    const state = { [GUARD_CHECK_PROMISE]: mockPromise }
    expect(controller.getGuardCheckPromise(state)).toBe(mockPromise)
  })

  it('should return undefined if GuardCheckPromise is not in state', () => {
    const state = {}
    expect(controller.getGuardCheckPromise(state)).toBeUndefined()
  })
})


```

### File: angular-utils/guards/src/services/guards-navigation-controller.service.ts

```ts

import { Injectable } from '@angular/core'
import {
  GUARD_CHECK,
  GUARD_CHECK_PROMISE,
  GUARD_MODE,
  GuardCheckPromise,
  GuardsNavigationState,
  IS_INITIAL_ROUTER_SYNC,
  IS_ROUTER_SYNC,
} from '../model/guard-navigation.model'

/**
 * GuardsNavigationController is a service that manages the navigation state for guards.
 */
@Injectable({ providedIn: 'any' })
export class GuardsNavigationStateController {
  /**
   * Retrieves the current mode of the guards navigation state.
   * @param guardsNavigationState - the GuardsNavigationState to check
   * @returns GUARD_MODE indicating the current mode of the guards navigation state
   */
  getMode(guardsNavigationState: GuardsNavigationState): GUARD_MODE {
    if (guardsNavigationState[IS_INITIAL_ROUTER_SYNC]) {
      return GUARD_MODE.INITIAL_ROUTER_SYNC
    }

    if (guardsNavigationState[IS_ROUTER_SYNC]) {
      return GUARD_MODE.ROUTER_SYNC
    }

    if (guardsNavigationState[GUARD_CHECK]) {
      return GUARD_MODE.GUARD_CHECK
    }

    return GUARD_MODE.NAVIGATION_REQUESTED
  }

  /**
   * Creates an initial router sync state for guards navigation.
   * @param guardsNavigationState - optional GuardsNavigationState to modify
   * @returns GuardsNavigationState with initial router sync state
   */
  createInitialRouterSyncState(guardsNavigationState?: GuardsNavigationState): GuardsNavigationState {
    if (guardsNavigationState) {
      guardsNavigationState[IS_ROUTER_SYNC] = true
      guardsNavigationState[IS_INITIAL_ROUTER_SYNC] = true
      return guardsNavigationState
    }

    return {
      [IS_ROUTER_SYNC]: true,
      [IS_INITIAL_ROUTER_SYNC]: true,
    }
  }

  /**
   * Creates a router sync state for guards navigation.
   * @param guardsNavigationState - optional GuardsNavigationState to modify
   * @returns GuardsNavigationState with router sync state
   */
  createGuardCheckState(guardsNavigationState?: GuardsNavigationState): GuardsNavigationState {
    if (guardsNavigationState) {
      guardsNavigationState[GUARD_CHECK] = true
      return guardsNavigationState
    }

    return { [GUARD_CHECK]: true }
  }

  /**
   * Creates a navigation requested state for guards navigation.
   * @param guardsCheckPromise - the promise to resolve guard checks
   * @param guardsNavigationState - optional GuardsNavigationState to modify
   * @returns GuardsNavigationState with navigation requested state
   */
  createNavigationRequestedState(
    guardsCheckPromise: GuardCheckPromise,
    guardsNavigationState?: GuardsNavigationState
  ): GuardsNavigationState {
    if (guardsNavigationState) {
      guardsNavigationState[GUARD_CHECK_PROMISE] = guardsCheckPromise
      return guardsNavigationState
    }

    return { [GUARD_CHECK_PROMISE]: guardsCheckPromise }
  }

  /**
   * Retrieves the GuardCheckPromise from the provided GuardsNavigationState.
   * @param state - the GuardsNavigationState to check
   * @returns GuardCheckPromise if it exists, undefined otherwise
   */
  getGuardCheckPromise(state: GuardsNavigationState): GuardCheckPromise | undefined {
    return state[GUARD_CHECK_PROMISE]
  }
}


```

## Folder: angular-utils/guards/src/utils (8 files)

### File: angular-utils/guards/src/utils/activate-guards-wrapper.utils.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { ActivateGuardsWrapper } from './activate-guards-wrapper.utils'
import { GuardsNavigationStateController } from '../services/guards-navigation-controller.service'
import { provideGuardsGathererMock } from '@onecx/angular-utils/mocks'
import { GuardsGatherer } from '../services/guards-gatherer.service'
import { GUARD_MODE } from '../model/guard-navigation.model'
import { Injectable } from '@angular/core'

@Injectable()
class MockGuard {
  canActivate(_route: any, _state: any): Promise<boolean> {
    console.log('MockGuard canActivate')
    return Promise.resolve(true)
  }
}

@Injectable()
class GenericClass {}

describe('ActivateGuardsWrapper', () => {
  let wrapper: ActivateGuardsWrapper
  let mockRouter: jest.Mocked<Router>
  let mockGuardsGatherer: GuardsGatherer
  let mockNavigationStateController: jest.Mocked<Partial<GuardsNavigationStateController>>

  beforeEach(() => {
    mockRouter = {
      getCurrentNavigation: jest.fn(),
    } as unknown as jest.Mocked<Router>
    mockNavigationStateController = {
      getMode: jest.fn().mockReturnValue('NAVIGATION_REQUESTED'),
      getGuardCheckPromise: jest.fn().mockReturnValue(Promise.resolve()),
    } as jest.Mocked<Partial<GuardsNavigationStateController>>

    TestBed.configureTestingModule({
      providers: [
        ActivateGuardsWrapper,
        { provide: Router, useValue: mockRouter },
        provideGuardsGathererMock(),
        { provide: GuardsNavigationStateController, useValue: mockNavigationStateController },
        MockGuard,
        GenericClass,
      ],
    })

    wrapper = TestBed.inject(ActivateGuardsWrapper)
    mockGuardsGatherer = TestBed.inject(GuardsGatherer)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be created', () => {
    expect(wrapper).toBeTruthy()
  })

  describe('INITIAL_ROUTER_SYNC', () => {
    it('should run guard and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.INITIAL_ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(true)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(true)
    })

    it('should run guard and return false for failed guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.INITIAL_ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(false)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(false)
    })
  })

  describe('ROUTER_SYNC', () => {
    it('should run guards and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(true)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(true)
    })
  })

  describe('GUARD_CHECK', () => {
    it('should run guards, resolve route and return false for failed guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

      const guardsGathererSpy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      const mockGuard = jest.fn().mockResolvedValue(false)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(false)
      expect(guardsGathererSpy).toHaveBeenCalledWith('test/route', false)
    })

    it('should run guards and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

      const guardsGathererSpy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      const mockGuard = jest.fn().mockResolvedValue(true)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(true)
      expect(guardsGathererSpy).not.toHaveBeenCalled()
    })
  })

  describe('NAVIGATION_REQUESTED', () => {
    it('should wait for guard check promise and return false if guard check fails', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(Promise.resolve(false))

      const mockGuard = jest.fn().mockResolvedValue(true)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('should wait for guard check promise and return true if guard check passes', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(Promise.resolve(true))

      const mockGuard = jest.fn().mockResolvedValue(true)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(true)
    })
  })

  it('should handle no route config gracefully', async () => {
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const mockGuard = jest.fn().mockResolvedValue(false)
    const route = {
      routeConfig: null,
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [mockGuard])

    expect(result).toBe(true)
    expect(mockGuard).not.toHaveBeenCalled()
  })

  it('should handle no guards gracefully', async () => {
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const mockGuard = jest.fn().mockResolvedValue(true)
    const route = {
      routeConfig: {},
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [])

    expect(result).toBe(true)
    expect(mockGuard).not.toHaveBeenCalled()
  })

  it('should handle class based guards', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const route = {
      routeConfig: {},
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [MockGuard])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('MockGuard canActivate')
  })

  it('should handle function based guards', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const mockGuard = jest.fn().mockImplementation(() => {
      console.log('mockGuard function canActivate')
      return Promise.resolve(true)
    })
    const route = {
      routeConfig: {},
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [mockGuard])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('mockGuard function canActivate')
  })

  it('should handle classes not implementing CanActivate', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const route = {
      routeConfig: {},
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [GenericClass as any])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('Guard does not implement canActivate:', expect.any(Function))
  })

  it('should handle no check promise in navigation state', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
    guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(null)

    const route = {
      routeConfig: {},
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('No guard check promise found in guards navigation state, returning true.')
  })
})


```

### File: angular-utils/guards/src/utils/activate-guards-wrapper.utils.ts

```ts

import { inject, Injectable, Injector, Type } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { GuardsGatherer } from '../services/guards-gatherer.service'
import { GuardsNavigationStateController } from '../services/guards-navigation-controller.service'
import { GUARD_MODE, GuardsNavigationState } from '../model/guard-navigation.model'
import {
  combineToBoolean,
  combineToGuardResult,
  executeRouterSyncGuard,
  getUrlFromSnapshot,
  logGuardsDebug,
  resolveToPromise,
} from './guards-utils.utils'

/**
 * Wrapper for canActivate guards that handles the navigation state and executes guards accordingly.
 *
 * It performs the activation checks in different scenarios based on the navigation state.
 */
@Injectable({ providedIn: 'root' })
export class ActivateGuardsWrapper {
  private injector = inject(Injector)
  private guardsGatherer = inject(GuardsGatherer)
  protected router = inject(Router)
  private guardsNavigationStateController = inject(GuardsNavigationStateController)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    guards: Array<CanActivateFn | Type<CanActivate>>
  ): MaybeAsync<GuardResult> {
    const guardsNavigationState = this.router.getCurrentNavigation()?.extras.state ?? ({} as GuardsNavigationState)
    const futureUrl = getUrlFromSnapshot(route)

    switch (this.guardsNavigationStateController.getMode(guardsNavigationState)) {
      // We need to let guards run if this is initial router sync
      // If navigation cannot be performed, a new event for window.history will be emitted with navigationId === -1
      // This will be handled by the Shell
      // Additionally, during GuardsCheckEnd, the results will be reported so Shell can decide what to do
      case GUARD_MODE.INITIAL_ROUTER_SYNC:
        return this.executeActivateGuards(route, state, guards, combineToBoolean)
      case GUARD_MODE.ROUTER_SYNC:
        return this.executeActivateGuards(route, state, guards, combineToBoolean).then(() => executeRouterSyncGuard())
      case GUARD_MODE.GUARD_CHECK:
        return this.executeActivateGuards(route, state, guards, combineToBoolean).then((result) => {
          if (result === false) {
            logGuardsDebug('GuardCheck - Route is guarded for activation, resolving false.')
            this.guardsGatherer.resolveRoute(futureUrl, false)
          }

          return result
        })
      case GUARD_MODE.NAVIGATION_REQUESTED: {
        //Wait until we received info from others
        let checkStartPromise = this.guardsNavigationStateController.getGuardCheckPromise(guardsNavigationState)
        if (!checkStartPromise) {
          console.warn('No guard check promise found in guards navigation state, returning true.')
          checkStartPromise = Promise.resolve(true)
        }
        return checkStartPromise.then((result) => {
          if (result === false) {
            console.warn(
              `Cannot route to ${futureUrl} because ${state.url} deactivation is guarded or ${futureUrl} activation its guarded.`
            )
            return false
          }
          return this.executeActivateGuards(route, state, guards, combineToGuardResult)
        })
      }
    }
  }

  private executeActivateGuards<T extends boolean | GuardResult>(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    guards: Array<CanActivateFn | Type<CanActivate>>,
    combineFn: (results: GuardResult[]) => T
  ): Promise<T> {
    if (!route.routeConfig) {
      console.warn('No route configuration found for canActivate guard.')
      logGuardsDebug('No route configuration found for canActivate guard.')
      return Promise.resolve(true as T)
    }

    const canActivateFunctions = guards.map((guard) => this.mapActivateGuardToFunctionReturningPromise(guard))

    const canActivateResults = Promise.all(
      canActivateFunctions.map((fn) => {
        try {
          return fn(route, state)
        } catch (error) {
          console.warn('Guard does not implement canActivate:', fn)
          return Promise.resolve(true) // Default to true if guard does not implement canActivate
        }
      })
    )
    return canActivateResults.then((results) => combineFn(results))
  }
  private mapActivateGuardToFunctionReturningPromise(
    guard: Type<CanActivate> | CanActivateFn
  ): (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Promise<GuardResult> {
    if (this.isCanActivateClassBasedGuard(guard)) {
      // guard for CanActivate is not a guard instance but class definition
      const guardInstance = this.injector.get(guard)
      return (route, state) => resolveToPromise(guardInstance.canActivate(route, state))
    }

    return (route, state) => resolveToPromise(guard(route, state))
  }

  private isCanActivateClassBasedGuard(guard: Type<CanActivate> | CanActivateFn): guard is Type<CanActivate> {
    return typeof guard === 'function' && guard.prototype && 'canActivate' in guard.prototype
  }
}


```

### File: angular-utils/guards/src/utils/deactivate-guards-wrapper.utils.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { DeactivateGuardsWrapper } from './deactivate-guards-wrapper.utils'
import { GuardsNavigationStateController } from '../services/guards-navigation-controller.service'
import { GUARD_MODE } from '../model/guard-navigation.model'
import { Injectable } from '@angular/core'
import { GuardsGatherer } from '../services/guards-gatherer.service'
import { provideGuardsGathererMock } from '@onecx/angular-utils/mocks'

@Injectable()
class MockGuard {
  canDeactivate(_component: any, _currentRoute: any, _currentState: any, _nextState: any) {
    console.log('MockGuard canDeactivate called')
    return Promise.resolve(true)
  }
}

@Injectable()
class GenericClass {}

describe('DeactivateGuardsWrapper', () => {
  let wrapper: DeactivateGuardsWrapper
  let mockRouter: jest.Mocked<Router>
  let mockGuardsGatherer: GuardsGatherer
  let mockNavigationStateController: jest.Mocked<Partial<GuardsNavigationStateController>>

  beforeEach(() => {
    mockRouter = {
      getCurrentNavigation: jest.fn(),
    } as unknown as jest.Mocked<Router>
    mockNavigationStateController = {
      getMode: jest.fn().mockReturnValue('NAVIGATION_REQUESTED'),
      getGuardCheckPromise: jest.fn().mockReturnValue(Promise.resolve()),
    } as jest.Mocked<Partial<GuardsNavigationStateController>>

    TestBed.configureTestingModule({
      providers: [
        DeactivateGuardsWrapper,
        { provide: Router, useValue: mockRouter },
        { provide: GuardsNavigationStateController, useValue: mockNavigationStateController },
        provideGuardsGathererMock(),
        MockGuard,
        GenericClass,
      ],
    })

    wrapper = TestBed.inject(DeactivateGuardsWrapper)
    mockGuardsGatherer = TestBed.inject(GuardsGatherer)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be created', () => {
    expect(wrapper).toBeTruthy()
  })

  describe('INITIAL_ROUTER_SYNC', () => {
    it('should run guard and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.INITIAL_ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(true)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(component, currentRoute, currentState, nextState)
      expect(result).toBe(true)
    })

    it('should run guard and return false for failed guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.INITIAL_ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(false)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(component, currentRoute, currentState, nextState)
      expect(result).toBe(false)
    })
  })

  describe('ROUTER_SYNC', () => {
    it('should run guards and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(true)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {} as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(component, currentRoute, currentState, nextState)
      expect(result).toBe(true)
    })
  })

  describe('GUARD_CHECK', () => {
    it('should run guards, resolve route and return false for failed guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

      const guardsGathererSpy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      const mockGuard = jest.fn().mockResolvedValue(false)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(component, currentRoute, currentState, nextState)
      expect(result).toBe(false)
      expect(guardsGathererSpy).toHaveBeenCalledWith(nextState.url, false)
    })

    it('should run guards and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

      const guardsGathererSpy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      const mockGuard = jest.fn().mockResolvedValue(true)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(component, currentRoute, currentState, nextState)
      expect(result).toBe(true)
      expect(guardsGathererSpy).not.toHaveBeenCalled()
    })
  })

  describe('NAVIGATION_REQUESTED', () => {
    it('should wait for guard check promise and return false if guard check fails', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(Promise.resolve(false))

      const mockGuard = jest.fn().mockResolvedValue(true)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(result).toBe(false)
    })

    it('should wait for guard check promise and return true if guard check passes', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(Promise.resolve(true))

      const mockGuard = jest.fn().mockResolvedValue(true)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(result).toBe(true)
    })
  })

  it('should handle no route config gracefully', async () => {
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const mockGuard = jest.fn().mockResolvedValue(true)
    const component = {}
    const currentRoute = {} as any // No routeConfig
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

    expect(result).toBe(true)
    expect(mockGuard).not.toHaveBeenCalled()
  })

  it('should handle empty guards array', async () => {
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const component = {}
    const currentRoute = {
      routeConfig: {},
    } as any
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [])

    expect(result).toBe(true)
  })

  it('should handle class based guards', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const component = {}
    const currentRoute = {
      routeConfig: {},
    } as any
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [MockGuard])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('MockGuard canDeactivate called')
  })

  it('should handle function based guards', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const mockGuard = jest.fn().mockImplementation(() => {
      console.log('mockGuard function canDeactivate')
      return Promise.resolve(true)
    })
    const component = {}
    const currentRoute = {
      routeConfig: {},
    } as any
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('mockGuard function canDeactivate')
  })

  it('should handle classes not implementing canDeactivate', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const component = {}
    const currentRoute = {
      routeConfig: {},
    } as any
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [GenericClass as any])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('Guard does not implement canDeactivate:', expect.any(Function))
  })

  it('should handle no check promise in navigation state', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
    guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(null)

    const component = {}
    const currentRoute = {
      routeConfig: {},
    } as any
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('No guard check promise found in guards navigation state, returning true.')
  })
})


```

### File: angular-utils/guards/src/utils/deactivate-guards-wrapper.utils.ts

```ts

import { inject, Injectable, Injector, Type } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  CanDeactivateFn,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { GuardsGatherer } from '../services/guards-gatherer.service'
import { GuardsNavigationStateController } from '../services/guards-navigation-controller.service'
import { GUARD_MODE, GuardsNavigationState } from '../model/guard-navigation.model'
import {
  combineToBoolean,
  combineToGuardResult,
  executeRouterSyncGuard,
  logGuardsDebug,
  resolveToPromise,
} from './guards-utils.utils'

/**
 * Wrapper for canDeactivate guards that handles the navigation state and executes guards accordingly.
 *
 * It performs the deactivation checks in different scenarios based on the navigation state
 */
@Injectable({ providedIn: 'root' })
export class DeactivateGuardsWrapper {
  private injector = inject(Injector)
  private guardsGatherer = inject(GuardsGatherer)
  protected router = inject(Router)
  private guardsNavigationStateController = inject(GuardsNavigationStateController)

  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
    guards: Array<CanDeactivateFn<any> | Type<CanDeactivate<any>>>
  ): MaybeAsync<GuardResult> {
    const guardsNavigationState = (this.router.getCurrentNavigation()?.extras.state ?? {}) as GuardsNavigationState
    const futureUrl = nextState.url

    switch (this.guardsNavigationStateController.getMode(guardsNavigationState)) {
      case GUARD_MODE.INITIAL_ROUTER_SYNC:
        return this.executeDeactivateGuards(component, currentRoute, currentState, nextState, guards, combineToBoolean)
      case GUARD_MODE.ROUTER_SYNC:
        return this.executeDeactivateGuards(
          component,
          currentRoute,
          currentState,
          nextState,
          guards,
          combineToBoolean
        ).then(() => executeRouterSyncGuard())
      case GUARD_MODE.GUARD_CHECK:
        return this.executeDeactivateGuards(
          component,
          currentRoute,
          currentState,
          nextState,
          guards,
          combineToBoolean
        ).then((result) => {
          if (result === false) {
            logGuardsDebug('GuardCheck - Route is guarded for deactivation, resolving false.')
            this.guardsGatherer.resolveRoute(futureUrl, false)
          }

          return result
        })
      case GUARD_MODE.NAVIGATION_REQUESTED: {
        //Wait until we received info from others
        let checkStartPromise = this.guardsNavigationStateController.getGuardCheckPromise(guardsNavigationState)
        if (!checkStartPromise) {
          console.warn('No guard check promise found in guards navigation state, returning true.')
          checkStartPromise = Promise.resolve(true)
        }
        return checkStartPromise.then((result) => {
          if (result === false) {
            console.warn(
              `Cannot route to ${futureUrl} because ${currentState.url} deactivation is guarded or ${futureUrl} activation its guarded.`
            )
            return false
          }
          return this.executeDeactivateGuards(
            component,
            currentRoute,
            currentState,
            nextState,
            guards,
            combineToGuardResult
          )
        })
      }
    }
  }

  private executeDeactivateGuards<T extends boolean | GuardResult>(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
    guards: Array<CanDeactivateFn<any> | Type<CanDeactivate<any>>>,
    combineFn: (results: GuardResult[]) => T
  ) {
    if (!currentRoute.routeConfig) {
      logGuardsDebug('No route configuration found for canActivate guard.')
      return Promise.resolve(true as T)
    }

    const canDeactivateFunctions = guards.map((guard) => this.mapDeactivateGuardToFunctionReturningPromise(guard))

    const canDeactivateResults = Promise.all(
      canDeactivateFunctions.map((fn) => {
        try {
          return fn(component, currentRoute, currentState, nextState)
        } catch (error) {
          console.warn('Guard does not implement canDeactivate:', fn)
          return Promise.resolve(true) // Default to true if guard does not implement canDeactivate
        }
      })
    )
    return canDeactivateResults.then((results) => combineFn(results))
  }

  private mapDeactivateGuardToFunctionReturningPromise(
    guard: Type<CanDeactivate<any>> | CanDeactivateFn<any>
  ): (
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) => Promise<GuardResult> {
    if (this.isCanDeactivateClassBasedGuard(guard)) {
      // guard for CanDeactivate is not a guard instance but class definition
      const guardInstance = this.injector.get(guard)
      return (component, currentRoute, currentState, nextState) =>
        resolveToPromise(guardInstance.canDeactivate(component, currentRoute, currentState, nextState))
    }

    return (component, currentRoute, currentState, nextState) =>
      resolveToPromise(guard(component, currentRoute, currentState, nextState))
  }

  private isCanDeactivateClassBasedGuard(
    guard: Type<CanDeactivate<any>> | CanDeactivateFn<any>
  ): guard is Type<CanDeactivate<any>> {
    return typeof guard === 'function' && guard.prototype && 'canDeactivate' in guard.prototype
  }
}


```

### File: angular-utils/guards/src/utils/guards-utils.utils.spec.ts

```ts

import {
  logGuardsDebug,
  executeRouterSyncGuard,
  combineToGuardResult,
  combineToBoolean,
  resolveToPromise,
  getUrlFromSnapshot,
} from './guards-utils.utils'
import { RedirectCommand, UrlTree, ActivatedRouteSnapshot } from '@angular/router'
import { of } from 'rxjs'

describe('logGuardsDebug', () => {
  const originalConsoleLog = console.log
  const originalDebugState = window['@onecx/angular-utils']?.guards?.debug

  beforeEach(() => {
    console.log = jest.fn()
    window['@onecx/angular-utils'] = window['@onecx/angular-utils'] || {}
    window['@onecx/angular-utils'].guards = window['@onecx/angular-utils'].guards || {}
  })

  afterEach(() => {
    console.log = originalConsoleLog
    window['@onecx/angular-utils']!.guards!.debug = originalDebugState
  })

  it('should log debug information when debug mode is enabled', () => {
    window['@onecx/angular-utils']!.guards!.debug = true

    logGuardsDebug('Test message', { key: 'value' })

    expect(console.log).toHaveBeenCalledWith('Guards:', 'Test message', { key: 'value' })
  })

  it('should not log debug information when debug mode is disabled', () => {
    window['@onecx/angular-utils']!.guards!.debug = false

    logGuardsDebug('Test message', { key: 'value' })

    expect(console.log).not.toHaveBeenCalled()
  })
})

describe('executeRouterSyncGuard', () => {
  const originalConsoleLog = console.log

  beforeEach(() => {
    console.log = jest.fn()
    window['@onecx/angular-utils']!.guards!.debug = true
  })

  afterEach(() => {
    console.log = originalConsoleLog
    window['@onecx/angular-utils']!.guards!.debug = false
  })

  it('should log a message and return true', () => {
    const result = executeRouterSyncGuard()

    expect(console.log).toHaveBeenCalledWith('Guards:', 'Was RouterSync, returning true.')
    expect(result).toBe(true)
  })
})

describe('combineToGuardResult', () => {
  it('should return false if any guard result is false', () => {
    const results = [true, false, true]
    const result = combineToGuardResult(results)
    expect(result).toBe(false)
  })

  it('should return the first UrlTree if any guard result is an UrlTree', () => {
    const mockUrlTree = new UrlTree()
    const results = [true, mockUrlTree, true]
    const result = combineToGuardResult(results)
    expect(result).toBe(mockUrlTree)
  })

  it('should return the first RedirectCommand if any guard result is a RedirectCommand', () => {
    const mockRedirectCommand = new RedirectCommand(new UrlTree())
    const results = [true, mockRedirectCommand, true]
    const result = combineToGuardResult(results)
    expect(result).toBe(mockRedirectCommand)
  })

  it('should return true if all guard results are true', () => {
    const results = [true, true, true]
    const result = combineToGuardResult(results)
    expect(result).toBe(true)
  })
})

describe('combineToBoolean', () => {
  it('should return false if any guard result is false', () => {
    const results = [true, false, true]
    const result = combineToBoolean(results)
    expect(result).toBe(false)
  })

  it('should return true if all guard results are true', () => {
    const results = [true, true, true]
    const result = combineToBoolean(results)
    expect(result).toBe(true)
  })
})

describe('resolveToPromise', () => {
  it('should resolve a Promise directly', async () => {
    const mockPromise = Promise.resolve(true)
    const result = await resolveToPromise(mockPromise)
    expect(result).toBe(true)
  })

  it('should resolve an Observable to a Promise', async () => {
    const mockObservable = of(true)
    const result = await resolveToPromise(mockObservable)
    expect(result).toBe(true)
  })

  it('should resolve a plain value to a Promise', async () => {
    const mockValue = true
    const result = await resolveToPromise(mockValue)
    expect(result).toBe(true)
  })
})

describe('getUrlFromSnapshot', () => {
  it('should return the full URL from a nested ActivatedRouteSnapshot', () => {
    const childRoute = {
      url: [{ path: 'child' }],
      parent: null,
    } as unknown as ActivatedRouteSnapshot

    const parentRoute = {
      url: [{ path: 'parent' }],
      parent: null,
    } as unknown as ActivatedRouteSnapshot

    ;(childRoute as any).parent = parentRoute

    const result = getUrlFromSnapshot(childRoute)
    expect(result).toBe('parent/child')
  })

  it('should return the URL from a single ActivatedRouteSnapshot', () => {
    const route = {
      url: [{ path: 'single' }],
      parent: null,
    } as unknown as ActivatedRouteSnapshot

    const result = getUrlFromSnapshot(route)
    expect(result).toBe('single')
  })

  it('should return an empty string if the route has no URL segments', () => {
    const route = {
      url: [],
      parent: null,
    } as unknown as ActivatedRouteSnapshot

    const result = getUrlFromSnapshot(route)
    expect(result).toBe('')
  })
})


```

### File: angular-utils/guards/src/utils/guards-utils.utils.ts

```ts

import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RedirectCommand, UrlTree } from '@angular/router'
import { isObservable, lastValueFrom } from 'rxjs'
import '../declarations'

window['@onecx/angular-utils'] = window['@onecx/angular-utils'] || {}

/**
 * Logs debug information for Guards.
 * It checks if the debug mode is enabled and logs the provided arguments.
 * This is useful for debugging guard checks and navigation state.
 * @param args - the arguments to log
 */
export function logGuardsDebug(...args: any[]): void {
  if (window['@onecx/angular-utils'].guards?.debug) {
    console.log(`Guards:`, ...args)
  }
}

/**
 * Execute router sync operation.
 * Immediately returns true to indicate that the operation was successful.
 */
export function executeRouterSyncGuard(): boolean {
  logGuardsDebug('Was RouterSync, returning true.')

  // Important to return true because it was already agreed to perform navigation in the application
  return true
}

/**
 * Returns false if any guard returned false.
 * Returns UrTree or RedirectCommand if any guard returned this value type (the first value is returned).
 * Else it returns true.
 */
export function combineToGuardResult(results: GuardResult[]): GuardResult {
  if (results.some((result) => result === false)) {
    return false
  }

  // Check for UrlTree or RedirectCommand
  // If any guard returned this, we need to return it to perform the redirection
  // We return the first one found
  const redirectResult = results.find((result) => result instanceof UrlTree || result instanceof RedirectCommand)
  if (redirectResult) {
    return redirectResult
  }

  return true
}

/**
 * Returns false if any guard returned false.
 * Else it returns true.
 */
export function combineToBoolean(results: GuardResult[]): boolean {
  if (results.some((result) => result === false)) {
    return false
  }

  return true
}

/**
 * Resolves MaybeAsync to Promise.
 * @param maybeAsync - the value to resolve
 * @returns Promise<GuardResult>
 */
export function resolveToPromise(maybeAsync: MaybeAsync<GuardResult>): Promise<GuardResult> {
  if (maybeAsync instanceof Promise) {
    return maybeAsync
  } else if (isObservable(maybeAsync)) {
    return lastValueFrom(maybeAsync)
  }

  return Promise.resolve(maybeAsync)
}

/**
 * Gets the URL from the ActivatedRouteSnapshot.
 * @param route - the route to get URL from
 * @returns string - the URL of the route
 */
export function getUrlFromSnapshot(route: ActivatedRouteSnapshot): string {
  const segments: string[] = []

  let currentRoute: ActivatedRouteSnapshot | null = route
  while (currentRoute) {
    segments.unshift(...currentRoute.url.map((segment) => segment.path))
    currentRoute = currentRoute.parent
  }

  return segments.join('/')
}


```

### File: angular-utils/guards/src/utils/wrap-guards.utils.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { OnecxRoute, wrapGuards, WRAPPED_GUARD_TAG } from './wrap-guards.utils'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  CanDeactivateFn,
  RouterStateSnapshot,
} from '@angular/router'
import { Component, Injector, runInInjectionContext, Type } from '@angular/core'
import { ActivateGuardsWrapper } from './activate-guards-wrapper.utils'
import { DeactivateGuardsWrapper } from './deactivate-guards-wrapper.utils'

class MockGuardsWrapper {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    guards: Array<CanActivateFn | Type<CanActivate>>
  ) {
    console.log('Wrapped amount:', guards.length)
    return Promise.resolve(true)
  }

  canDeactivate(
    component: any,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
    guards: Array<CanActivateFn | Type<CanActivate>>
  ) {
    console.log('Wrapped amount:', guards.length)
    return Promise.resolve(true)
  }
}

describe('wrapGuards', () => {
  let mockRoute: OnecxRoute

  beforeEach(() => {
    mockRoute = {
      path: 'test',
      canActivate: [],
      canDeactivate: [],
      canActivateChild: [],
      children: [],
    }

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivateGuardsWrapper, useClass: MockGuardsWrapper },
        {
          provide: DeactivateGuardsWrapper,
          useClass: MockGuardsWrapper,
        },
      ],
    })
  })

  it('should wrap canActivate guards if not already wrapped', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const mockGuard = jest.fn()
    const secondGuard = jest.fn()
    mockRoute.canActivate = [mockGuard, secondGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const injector = TestBed.inject(Injector)
    const wrapper = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
  })

  it('should not wrap canActivate guards if already wrapped', () => {
    const wrappedGuard = jest.fn()
    ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true
    mockRoute.canActivate = [wrappedGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should wrap canDeactivate guards if not already wrapped', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const mockGuard = jest.fn()
    const secondGuard = jest.fn()
    mockRoute.canDeactivate = [mockGuard, secondGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const injector = TestBed.inject(Injector)
    const wrapper = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
  })

  it('should not wrap canDeactivate guards if already wrapped', () => {
    const wrappedGuard = jest.fn()
    ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true
    mockRoute.canDeactivate = [wrappedGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should wrap canActivateChild guards if not already wrapped', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const mockGuard = jest.fn()
    const secondGuard = jest.fn()
    mockRoute.canActivateChild = [mockGuard, secondGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const injector = TestBed.inject(Injector)
    const wrapper = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
  })

  it('should not wrap canActivateChild guards if already wrapped', () => {
    const wrappedGuard = jest.fn()
    ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true
    mockRoute.canActivateChild = [wrappedGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should recursively wrap guards for child routes', () => {
    const childRoute = {
      path: 'child',
      canActivate: [jest.fn()],
      canDeactivate: [jest.fn()],
      canActivateChild: [jest.fn()],
      children: [],
    }
    mockRoute.children = [childRoute]

    wrapGuards(mockRoute)

    expect((childRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((childRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((childRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should force guard run for the route', () => {
    mockRoute.runGuardsAndResolvers = 'paramsChange'

    wrapGuards(mockRoute)

    expect(mockRoute.runGuardsAndResolvers).toBe('always')
  })

  it('should handle empty route guards', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const injector = TestBed.inject(Injector)

    mockRoute.canActivate = []
    mockRoute.canDeactivate = []
    mockRoute.canActivateChild = []

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const activateWrapper = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      activateWrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
    consoleSpy.mockClear()

    const deactivateWrapper = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      deactivateWrapper({} as any, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
    consoleSpy.mockClear()

    const activateChildWrapper = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      activateChildWrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
  })

  it('should handle undefined route guards', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const injector = TestBed.inject(Injector)

    mockRoute.canActivate = undefined
    mockRoute.canDeactivate = undefined
    mockRoute.canActivateChild = undefined

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const activateWrapper = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      activateWrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
    consoleSpy.mockClear()

    const deactivateWrapper = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      deactivateWrapper({} as any, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
    consoleSpy.mockClear()

    const activateChildWrapper = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      activateChildWrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
  })

  it('should handle multiple child routes', () => {
    const childRoute = {
      path: 'child',
      canActivate: [jest.fn()],
      canDeactivate: [jest.fn()],
      canActivateChild: [jest.fn()],
      children: [],
    }
    const secondChildRoute = {
      path: 'second-child',
      canActivate: [jest.fn()],
      canDeactivate: [jest.fn()],
      canActivateChild: [jest.fn()],
      children: [],
    }
    mockRoute.children = [childRoute, secondChildRoute]

    wrapGuards(mockRoute)

    expect((childRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((childRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((childRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    expect((secondChildRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((secondChildRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((secondChildRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should react to dynamically added guards', () => {
    const mockGuard = jest.fn()
    const wrappedGuard = jest.fn()
    ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true
    mockRoute.canActivate = [wrappedGuard, mockGuard]
    mockRoute.canDeactivate = [wrappedGuard, mockGuard]
    mockRoute.canActivateChild = [wrappedGuard, mockGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should wrap guards based on saved state', () => {
    // Setup
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const mockGuard = jest.fn()

    // Setup 1 wrapped guard
    mockRoute.canActivate = [mockGuard]
    mockRoute.canDeactivate = [mockGuard]
    mockRoute.canActivateChild = [mockGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const injector = TestBed.inject(Injector)
    let wrapper: any = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapper = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      wrapper({} as Component, {} as ActivatedRouteSnapshot, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapper = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    // Add 2nd guard dynamically
    const newMockGuard = jest.fn()
    mockRoute.canActivate.push(newMockGuard)
    mockRoute.canDeactivate.push(newMockGuard)
    mockRoute.canActivateChild.push(newMockGuard)

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    let wrapperAfterAddition: any = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapperAfterAddition({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
    consoleSpy.mockClear()

    wrapperAfterAddition = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      wrapperAfterAddition(
        {} as Component,
        {} as ActivatedRouteSnapshot,
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      )
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
    consoleSpy.mockClear()

    wrapperAfterAddition = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapperAfterAddition({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
    consoleSpy.mockClear()
  })

  it('should not duplicate guards in saved state', () => {
    // Setup
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const mockGuard = jest.fn()

    // Setup 1 wrapped guard
    mockRoute.canActivate = [mockGuard]
    mockRoute.canDeactivate = [mockGuard]
    mockRoute.canActivateChild = [mockGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const injector = TestBed.inject(Injector)
    let wrapper: any = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapper = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      wrapper({} as Component, {} as ActivatedRouteSnapshot, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapper = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    // Add the same guard again
    mockRoute.canActivate.push(mockGuard)
    mockRoute.canDeactivate.push(mockGuard)
    mockRoute.canActivateChild.push(mockGuard)

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    let wrapperAfterAddition: any = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapperAfterAddition({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapperAfterAddition = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      wrapperAfterAddition(
        {} as Component,
        {} as ActivatedRouteSnapshot,
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      )
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapperAfterAddition = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapperAfterAddition({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()
  })
})


```

### File: angular-utils/guards/src/utils/wrap-guards.utils.ts

```ts

import { CanActivate, CanActivateFn, CanDeactivate, CanDeactivateFn, Route } from '@angular/router'
import { inject, Type } from '@angular/core'
import { ActivateGuardsWrapper } from './activate-guards-wrapper.utils'
import { DeactivateGuardsWrapper } from './deactivate-guards-wrapper.utils'
import { logGuardsDebug } from './guards-utils.utils'

/**
 * Extended Route interface to hold original guards.
 * This interface extends the Angular Route interface to include lists for original guards.
 */
export interface OnecxRoute extends Route {
  canActivateGuardList?: Array<CanActivateFn | Type<CanActivate>>
  canDeactivateGuardList?: Array<CanDeactivateFn<any> | Type<CanDeactivate<any>>>
  canActivateChildGuardList?: Array<CanActivateFn | Type<CanActivate>>
}

// Create a unique symbol to tag wrapped guards
export const WRAPPED_GUARD_TAG = Symbol('WrappedGuard')

/**
 * Wraps the guards for a given route.
 * This function will wrap CanActivate, CanDeactivate and CanActivateChild guards and force the route to always run guards and resolvers.
 * It ensures that in a multi-router environment, the guards are properly executed.
 * @param route - The route to wrap guards for.
 */
export function wrapGuards(route: Route) {
  logGuardsDebug('wrapGuards', route)
  saveOriginalGuards(route as OnecxRoute)
  wrapActivateGuards(route)
  wrapDeactivateGuards(route)
  wrapActivateChildGuards(route)

  // Important, this will ensure that guards are always run
  // even if the route is already active.
  forceGuardRun(route)

  if (route.children) {
    route.children.forEach((childRoute) => wrapGuards(childRoute))
  }
}

function wrapActivateGuards(route: Route): void {
  if (isWrappingRequired(route.canActivate)) {
    logGuardsDebug('Wrapping activate guards for route', route)
    route.canActivate = [createActivateWrapper(route)]
  }
}

function wrapDeactivateGuards(route: Route): void {
  if (isWrappingRequired(route.canDeactivate)) {
    logGuardsDebug('Wrapping deactivate guards for route', route)
    route.canDeactivate = [createDeactivateWrapper(route)]
  }
}

function wrapActivateChildGuards(route: Route): void {
  if (isWrappingRequired(route.canActivateChild)) {
    logGuardsDebug('Wrapping activate child guards for route', route)
    route.canActivateChild = [createActivateChildWrapper(route)]
  }
}

/**
 * Force the route to always run guards and resolvers.
 */
function forceGuardRun(route: Route) {
  route.runGuardsAndResolvers = 'always'
}

/**
 * Saves the state of the guards for the route.
 * This function saves the canActivate, canDeactivate, and canActivateChild guards to their respective lists.
 * @param route - The route to save the guard state for.
 */
function saveOriginalGuards(route: OnecxRoute) {
  saveCanActivateGuards(route)
  saveCanDeactivateGuards(route)
  saveCanActivateChildGuards(route)
}

/**
 * Checks if wrapping is required for the guards.
 * If the guards array has only one guard and it is already wrapped, no wrapping is needed.
 * @param guards - The array of guards to check.
 * @returns True if wrapping is required, false otherwise.
 */
function isWrappingRequired(guards: Array<any> | undefined): boolean {
  if (guards && guards.length === 1 && isGuardsWrapped(guards)) {
    return false
  }

  return true
}

/**
 * Helper function to check if guards are already wrapped.
 * Checks for a unique tag added to wrapped guards.
 * @param guards - The array of guards to check.
 * @returns True if the guards are wrapped, false otherwise.
 */
function isGuardsWrapped(guards: Array<any>): boolean {
  return guards.some((guard) => isWrapper(guard))
}

/**
 * Checks if a guard is a wrapper.
 * A guard is considered a wrapper if it has the unique WRAPPED_GUARD_TAG symbol.
 * @param guard - The guard to check.
 * @returns True if the guard is a wrapper, false otherwise.
 */
function isWrapper(guard: any): boolean {
  return guard && (guard as any)[WRAPPED_GUARD_TAG] === true
}

/**
 * Creates a wrapper for CanActivate guards.
 * Adds a unique tag to the wrapped guard for identification.
 * @param guards - The array of CanActivate guards to wrap.
 * @returns A CanActivateFn that wraps the provided guards.
 */
function createActivateWrapper(routeToWrap: OnecxRoute): CanActivateFn {
  const wrappedGuard: CanActivateFn = (route, state) => {
    return inject(ActivateGuardsWrapper).canActivate(route, state, routeToWrap.canActivateGuardList || [])
  }

  // Tag the wrapped guard with the unique symbol
  ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true

  return wrappedGuard
}

/**
 * Creates a wrapper for CanDeactivate guards.
 * @param guards - The array of CanDeactivate guards to wrap.
 * @returns A CanDeactivateFn that wraps the provided guards.
 */
function createDeactivateWrapper(routeToWrap: OnecxRoute): CanDeactivateFn<any> {
  const wrappedGuard: CanDeactivateFn<any> = (component, currentRoute, currentState, nextState) => {
    return inject(DeactivateGuardsWrapper).canDeactivate(
      component,
      currentRoute,
      currentState,
      nextState,
      routeToWrap.canDeactivateGuardList || []
    )
  }

  // Tag the wrapped guard with the unique symbol
  ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true

  return wrappedGuard
}

/**
 * Creates a wrapper for CanActivateChild guards.
 * Adds a unique tag to the wrapped guard for identification.
 * @param guards - The array of CanActivateChild guards to wrap.
 * @returns A CanActivateFn that wraps the provided guards.
 */
function createActivateChildWrapper(routeToWrap: OnecxRoute): CanActivateFn {
  const wrappedGuard: CanActivateFn = (route, state) => {
    return inject(ActivateGuardsWrapper).canActivate(route, state, routeToWrap.canActivateChildGuardList || [])
  }

  // Tag the wrapped guard with the unique symbol
  ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true

  return wrappedGuard
}

/**
 * Saves the canActivate guards to the route's canActivateGuardList.
 * @param route - The route to save the canActivate guards for.
 */
function saveCanActivateGuards(route: OnecxRoute): void {
  if (!route.canActivateGuardList) route.canActivateGuardList = []

  if (route.canActivate) {
    route.canActivateGuardList = route.canActivateGuardList.concat(
      route.canActivate.filter(
        (guard) => !isWrapper(guard) && !isSaved<CanActivateFn | Type<CanActivate>>(route.canActivateGuardList!, guard)
      )
    )
  }
}

/**
 * Saves the canActivateChild guards to the route's canActivateChildGuardList.
 * @param route - The route to save the canActivateChild guards for.
 */
function saveCanDeactivateGuards(route: OnecxRoute): void {
  if (!route.canDeactivateGuardList) route.canDeactivateGuardList = []

  if (route.canDeactivate) {
    route.canDeactivateGuardList = route.canDeactivateGuardList.concat(
      route.canDeactivate.filter(
        (guard) =>
          !isWrapper(guard) &&
          !isSaved<CanDeactivateFn<any> | Type<CanDeactivate<any>>>(route.canDeactivateGuardList!, guard)
      )
    )
  }
}

/**
 * Saves the canActivateChild guards to the route's canActivateChildGuardList.
 * @param route - The route to save the canActivateChild guards for.
 */
function saveCanActivateChildGuards(route: OnecxRoute): void {
  if (!route.canActivateChildGuardList) route.canActivateChildGuardList = []

  if (route.canActivateChild) {
    route.canActivateChildGuardList = route.canActivateChildGuardList.concat(
      route.canActivateChild.filter(
        (guard) =>
          !isWrapper(guard) && !isSaved<CanActivateFn | Type<CanActivate>>(route.canActivateChildGuardList!, guard)
      )
    )
  }
}

function isSaved<T>(list: Array<T>, guard: T) {
  return list.some((item) => item === guard)
}


```

## Folder: angular-utils/migrations (5 files)

### File: angular-utils/migrations/index.ts

```ts

export * from './v6/migrate-onecx-to-v6'
export * from './v6/replace-translation-path-factories'
export * from './v6/add-import-meta-to-webpack-config'

```

### File: angular-utils/migrations/jest.config.ts

```ts

export default {
  displayName: 'angular-utils-migrations',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../coverage/libs/angular-utils/migrations',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test-utils/test-setup.ts'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
}

```

### File: angular-utils/migrations/tsconfig.json

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
      },
      {
        "path": "./tsconfig.spec.json"
      }
    ]
  }

```

### File: angular-utils/migrations/tsconfig.migrations.json

```json

{
    "extends": "./tsconfig.json",
    "compilerOptions": {
      "outDir": "../../../dist",
      "declaration": true,
      "types": ["node"]
    },
    "include": ["**/*.ts"],
    "exclude": ["jest.config.ts", "**/*.spec.ts", "**/*.test.ts"]
  }
  

```

### File: angular-utils/migrations/tsconfig.spec.json

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../../dist/out-tsc",
    "module": "commonjs",
    "target": "es2016",
    "types": ["jest", "jest-extended", "node"]
  },
  "files": ["test-utils/test-setup.ts"],
  "include": ["jest.config.ts", "**/*.test.ts", "**/*.spec.ts", "**/*.d.ts"]
}

```

## Folder: angular-utils/migrations/test-utils (1 files)

### File: angular-utils/migrations/test-utils/test-setup.ts

```ts

import { expect } from '@jest/globals'
import * as matchers from 'jest-extended'
expect.extend(matchers)

```

## Folder: angular-utils/migrations/v6 (5 files)

### File: angular-utils/migrations/v6/add-import-meta-to-webpack-config.spec.ts

```ts

import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import addImportMetaToWebpackConfig from './add-import-meta-to-webpack-config'
describe('replace-translation-path-factories', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })
  it('should adjust webpack config for importMeta in module exports', async () => {
    const filePath = 'src/webpack.config.js'
    tree.write(
      filePath,
      `
    module.exports = {
        ...config,
        plugins,
        output: { uniqueName: 'onecx-app-ui', publicPath: 'auto' },
    };`
    )
    await addImportMetaToWebpackConfig(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
    module.exports = {
        ...config,
        plugins,
        output: { uniqueName: 'onecx-app-ui', publicPath: 'auto' },
        module: { parser: { javascript: { importMeta: false } } }
    };
    `
    )
  })

   it('should not adjust webpack config for importMeta if its already there', async () => {
    const filePath = 'src/webpack.config.js'
    tree.write(
      filePath,
      `
    module.exports = {
        ...config,
        plugins,
        output: { uniqueName: 'onecx-app-ui', publicPath: 'auto' },
        module: { parser: { javascript: { importMeta: false } } }
    };`
    )
    await addImportMetaToWebpackConfig(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
    module.exports = {
        ...config,
        plugins,
        output: { uniqueName: 'onecx-app-ui', publicPath: 'auto' },
        module: { parser: { javascript: { importMeta: false } } }
    };
    `
    )
  })
})

```

### File: angular-utils/migrations/v6/add-import-meta-to-webpack-config.ts

```ts

import { Tree, visitNotIgnoredFiles } from "@nx/devkit";
import { ast, query, replace, ScriptKind } from "@phenomnomnominal/tsquery";

export default async function addImportMetaToWebpackConfig(tree: Tree) {
  visitNotIgnoredFiles(tree, 'src', (filePath) => {
    if (!filePath.endsWith('webpack.config.js')) return;
    let fileContent = tree.read(filePath, 'utf-8');
    if (!fileContent) return;

    const moduleExportsSelector =
      'ExpressionStatement:has(PropertyAccessExpression:has(Identifier[name=module]):has(Identifier[name=exports]))  > BinaryExpression  > ObjectLiteralExpression';

    // Find module.exports assignment 
    const astSource = ast(fileContent);
    const moduleExports = query(astSource, moduleExportsSelector);

    if (moduleExports.length === 0) return;

    // Check if module property with importMeta already exists
    const hasImportMeta = fileContent.includes('importMeta: false');
    if (hasImportMeta) return;

    // Add the property
    fileContent = replace(
      fileContent,
      moduleExportsSelector,
      (node) => {
        // Remove trailing comma if present
        let text = node.getText().replace(/,?\s*$/, '');
        if (text.endsWith('}')) {
          text = text.slice(0, -1) + ', module: { parser: { javascript: { importMeta: false } } } }';
        }
        return text;
      },
      ScriptKind.JS
    );

    tree.write(filePath, fileContent);
  });
}

```

### File: angular-utils/migrations/v6/migrate-onecx-to-v6.ts

```ts

import { Tree } from '@nx/devkit'
import { commonMigrateOnecxToV6 } from '@onecx/nx-migration-utils'

export default async function migrateOnecxToV6(tree: Tree) {
  await commonMigrateOnecxToV6(tree)
}


```

### File: angular-utils/migrations/v6/replace-translation-path-factories.spec.ts

```ts

import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import replaceTranslationPathFactories from './replace-translation-path-factories'

describe('replace-translation-path-factories', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should replace provider with remoteComponentTranslationPathFactory with provideTranslationPathFromMeta', async () => {
    const filePath = 'src/app/test1.module.ts'
    tree.write(
      filePath,
      `
    import { bootstrapRemoteComponent } from '@onecx/angular-webcomponents';
    import { REMOTE_COMPONENT_CONFIG, RemoteComponentConfig, provideTranslateServiceForRoot } from '@onecx/angular-remote-components';
    import { TranslateLoader } from '@ngx-translate/core';
    import { ReplaySubject } from 'rxjs';
    import { TRANSLATION_PATH, createTranslateLoader, remoteComponentTranslationPathFactory } from '@onecx/angular-utils';

    bootstrapRemoteComponent(RemoteComponent, 'ocx-my-remote-component', environment.production, [
        { provide: REMOTE_COMPONENT_CONFIG, useValue: new ReplaySubject<RemoteComponentConfig>(1) },
        provideTranslateServiceForRoot({
            isolate: true,
            loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
            }
        }),
        {
            provide: TRANSLATION_PATH,
            useFactory: (remoteComponentConfig: ReplaySubject<RemoteComponentConfig>) =>
            remoteComponentTranslationPathFactory('path/i18n/')(remoteComponentConfig),
            multi: true,
            deps: [REMOTE_COMPONENT_CONFIG]
        },
    ]);`
    )
    await replaceTranslationPathFactories(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
    import { bootstrapRemoteComponent } from '@onecx/angular-webcomponents';
    import { REMOTE_COMPONENT_CONFIG, RemoteComponentConfig, provideTranslateServiceForRoot } from '@onecx/angular-remote-components';
    import { TranslateLoader } from '@ngx-translate/core';
    import { ReplaySubject } from 'rxjs';
    import { createTranslateLoader, provideTranslationPathFromMeta } from '@onecx/angular-utils';

    bootstrapRemoteComponent(RemoteComponent, 'ocx-my-remote-component', environment.production, [
        { provide: REMOTE_COMPONENT_CONFIG, useValue: new ReplaySubject<RemoteComponentConfig>(1) },
        provideTranslateServiceForRoot({
            isolate: true,
            loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
            }
        }),
        provideTranslationPathFromMeta(import.meta.url, 'path/i18n/')
    ]);
    `
    )
  })

  it('should replace provider with translationPathFactory with provideTranslationPathFromMeta', async () => {
    const filePath = 'src/app/test2.module.ts'
    tree.write(
      filePath,
      `
    import { APP_INITIALIZER, NgModule } from '@angular/core';
    import { TranslateService } from '@ngx-translate/core';
    import { TRANSLATION_PATH, translationPathFactory } from '@onecx/angular-utils';
    import { APP_CONFIG, AppStateService, UserService } from '@onecx/angular-integration-interface';

    @NgModule({
    providers: [
        {
        provide: APP_INITIALIZER,
        useFactory: translateServiceInitializer,
        multi: true,
        deps: [UserService, TranslateService]
        },
        {
        provide: TRANSLATION_PATH,
        useFactory: (appStateService: AppStateService) => translationPathFactory('path/to/assets/i18n/')(appStateService),
        multi: true,
        deps: [AppStateService]
        }
    ]
    })
    export class AppModule {};
    `
    )
    await replaceTranslationPathFactories(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
    import { provideTranslationPathFromMeta } from '@onecx/angular-utils';
    import { APP_INITIALIZER, NgModule } from '@angular/core';
    import { TranslateService } from '@ngx-translate/core';
    import { APP_CONFIG, AppStateService, UserService } from '@onecx/angular-integration-interface';

    @NgModule({
    providers: [
        {
        provide: APP_INITIALIZER,
        useFactory: translateServiceInitializer,
        multi: true,
        deps: [UserService, TranslateService]
        },
        provideTranslationPathFromMeta(import.meta.url, 'path/to/assets/i18n/')
    ]
    })
    export class AppModule {};
    `
    )
  })

  it('should replace provider with translationPathFactory with provideTranslationPathFromMeta in NgModule', async () => {
    const filePath = 'src/app/app-module.ts'
    tree.write(
      filePath,
      `
    import { TRANSLATION_PATH, createTranslateLoader, translationPathFactory } from '@onecx/angular-utils';
    import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
    import { AppStateService } from '@onecx/angular-integration-interface';

    @NgModule({
    providers: [
      {
        provide: TRANSLATION_PATH,
        useFactory: (appStateService: AppStateService) => translationPathFactory('assets/i18n/')(appStateService),
        multi: true,
        deps: [AppStateService]
      },
        provideHttpClient(withInterceptorsFromDi())
    ]
    })
    class AppModule {};`
    )
    await replaceTranslationPathFactories(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
    import { createTranslateLoader, provideTranslationPathFromMeta } from '@onecx/angular-utils';
    import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
    import { AppStateService } from '@onecx/angular-integration-interface';

    @NgModule({ 
    providers: [
      provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/'),
      provideHttpClient(withInterceptorsFromDi())
    ]
    })
    class AppModule {};
    `
    )
  })
})

```

### File: angular-utils/migrations/v6/replace-translation-path-factories.ts

```ts

import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { updateTranslationPathImports } from './utils/update-translation-path-imports';
import { updateTranslationPathProvider } from './utils/update-translation-path-provider';

export default async function replaceTranslationPathFactories(tree: Tree) {
  visitNotIgnoredFiles(tree, 'src', (filePath) => {
    if (!filePath.endsWith('.ts')) return;
    const fileContent = tree.read(filePath, 'utf-8');
    if (!fileContent) return;

  let updatedContent = updateTranslationPathImports(tree, filePath, fileContent);

  updatedContent = updateTranslationPathProvider(updatedContent);

  // Write back the result
  if (updatedContent) {
    tree.write(filePath, updatedContent);
  }
  });
}

```

## Folder: angular-utils/migrations/v6/utils (3 files)

### File: angular-utils/migrations/v6/utils/extract-translation-path.ts

```ts

import { query, SourceFile } from "@phenomnomnominal/tsquery";

export function extractTranslationPath(astSource: SourceFile): string | undefined {
  const queries = [
    'CallExpression[expression.name="remoteComponentTranslationPathFactory"] > StringLiteral',
    'CallExpression[expression.name="translationPathFactory"] > StringLiteral'
  ];

  for (const queryStr of queries) {
    const stringLiterals = query(astSource, queryStr);
    if (stringLiterals.length > 0) {
      return stringLiterals[0].getText();
    }
  }

  return undefined;
}


```

### File: angular-utils/migrations/v6/utils/update-translation-path-imports.ts

```ts

import { Tree } from "@nx/devkit";
import { removeImportSpecifierFromImport } from "@onecx/nx-migration-utils";
import { addProviderImportInFile } from "@onecx/nx-migration-utils/angular";

export function updateTranslationPathImports(tree: Tree, filePath: string, fileContent: string) {
    // Remove old import specifiers from @onecx/angular-utils
    const specifiers = ['TRANSLATION_PATH', 'remoteComponentTranslationPathFactory', 'translationPathFactory']
    for (const specifier of specifiers) {
        removeImportSpecifierFromImport(tree, filePath, '@onecx/angular-utils', specifier);
    }
    fileContent = tree.read(filePath, 'utf-8') ?? '';

    // Add provideTranslationPathFromMeta to imports if not present
    if (fileContent) {
        fileContent = addProviderImportInFile(fileContent, { name: 'provideTranslationPathFromMeta', importPath: '@onecx/angular-utils' });
    }

    return fileContent;
}

```

### File: angular-utils/migrations/v6/utils/update-translation-path-provider.ts

```ts

import { ast, replace } from "@phenomnomnominal/tsquery"
import { ScriptKind } from "typescript"
import { extractTranslationPath } from "./extract-translation-path";

// AST-based replacement of translation path provider
export function updateTranslationPathProvider(fileContent: string) {
 
  const astSource = ast(fileContent);
  const path = extractTranslationPath(astSource);

  // Remove provider with provide: TRANSLATION_PATH
  fileContent = replace(
    fileContent,
    'ArrayLiteralExpression > ObjectLiteralExpression:has(PropertyAssignment:has(Identifier[name="provide"]):has(Identifier[name="TRANSLATION_PATH"]))',
    () => `provideTranslationPathFromMeta(import.meta.url, ${path})`,
    ScriptKind.TS
  );

  // Remove trailing commas in providers arrays
  if (fileContent) {
    fileContent = fileContent.replace(/,\s*([\])])/g, '$1');
  }

  return fileContent;
}

```

## Folder: angular-utils/mocks (3 files)

### File: angular-utils/mocks/guards-gatherer-mock.ts

```ts

import { Injectable, OnDestroy } from '@angular/core'
import { GuardsGatherer } from '@onecx/angular-utils/guards'

export function provideGuardsGathererMock() {
  return [
    GuardsGathererMock,
    {
      provide: GuardsGatherer,
      useExisting: GuardsGathererMock,
    },
  ]
}

@Injectable()
export class GuardsGathererMock implements OnDestroy {
  private result = true

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method, @typescript-eslint/no-empty-function
  ngOnDestroy(): void {}

  setGatherResult(result: boolean): void {
    this.result = result
  }

  gather(): Promise<any> {
    return Promise.resolve(this.result)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  resolveRoute(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  activate(): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  deactivate(): void {}
}


```

### File: angular-utils/mocks/index.ts

```ts

export * from './guards-gatherer-mock'


```

### File: angular-utils/mocks/ng-package.json

```json

{
  "$schema": "../../../node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "index.ts"
  }
}


```

## Folder: angular-utils/src (2 files)

### File: angular-utils/src/index.ts

```ts

// Utils
export * from './lib/utils/async-translate-loader.utils'
export * from './lib/utils/caching-translate-loader.utils'
export * from './lib/utils/create-translate-loader.utils'
export * from './lib/utils/has-permission-checker'
export * from './lib/utils/translate.combined.loader'
export * from './lib/utils/translation-path-factory.utils'
export * from './lib/utils/has-permission-checker-factory'
export * from './lib/utils/deep-merge.utils'
export * from './lib/utils/remote-component-translation-path-factory.utils'
export * from './lib/utils/scope.utils'
export * from './lib/utils/portal-api-configuration.utils'
export * from './lib/utils/provide-connection-service'
export * from './lib/utils/remote-component-translation-path-factory.utils'
export * from './lib/utils/multi-language-missing-translation-handler.utils'
export * from './lib/utils/dynamic-locale-id.utils'

// Model
export * from './lib/model/injection-tokens'
export * from './lib/model/remote-component-config.model'

// Services
export * from './lib/services/translation-cache.service'
export * from './lib/services/permission.service'
export * from './lib/services/translation-connection.service'

// Components
export * from './lib/components/portal-page/portal-page.component'

// Providers
export * from './lib/providers/angular-utils.providers'
export * from './lib/providers/translation-path.providers'
export * from './lib/providers/permission-service.providers'
export * from './lib/providers/translation-path-from-meta.providers'


```

### File: angular-utils/src/test-setup.ts

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

## Folder: angular-utils/src/lib/components/portal-page (3 files)

### File: angular-utils/src/lib/components/portal-page/portal-page.component.html

```html

<div class="content-wrapper">
  @if (hasAccess() | async) {
  <ng-content></ng-content>
  } @else {
  <h3>{{'OCX_PORTAL_PAGE.UNAUTHORIZED_TITLE' | translate}}</h3>
  <p>
    {{'OCX_PORTAL_PAGE.UNAUTHORIZED_MESSAGE' | translate}}
    <span>{{'OCX_PORTAL_PAGE.MISSING_PERMISSION' | translate : {permission: permission} }}</span>
  </p>
  }
</div>


```

### File: angular-utils/src/lib/components/portal-page/portal-page.component.spec.ts

```ts

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { PortalPageComponent } from './portal-page.component'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { provideAngularUtils } from '../../providers/angular-utils.providers'

describe('PortalPageComponent', () => {
  let component: PortalPageComponent
  let fixture: ComponentFixture<PortalPageComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        PortalPageComponent,
        TranslateTestingModule.withTranslations({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
      ],
      providers: [
        provideAngularUtils(),
        provideHttpClient(withInterceptorsFromDi()),
        provideAppStateServiceMock(),
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})


```

### File: angular-utils/src/lib/components/portal-page/portal-page.component.ts

```ts

import { Component, Input, OnInit, inject } from '@angular/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import { Observable, of } from 'rxjs'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { PermissionService } from '../../services/permission.service'

@Component({
  selector: 'ocx-portal-page',
  templateUrl: './portal-page.component.html',
  styleUrls: ['./portal-page.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class PortalPageComponent implements OnInit {
  private appState = inject(AppStateService)
  private permissionService = inject(PermissionService)
  private trueObservable = of(true)

  @Input() permission = ''
  @Input() helpArticleId = ''
  @Input() pageName = ''
  @Input() applicationId = ''

  hasAccess(): Observable<boolean> {
    return this.permission ? this.permissionService.hasPermission(this.permission) : this.trueObservable
  }

  ngOnInit(): void {
    if (!this.helpArticleId) {
      console.warn(
        `ocx-portal-page on url ${location.pathname} does not have 'helpArticleId' set. Set to some unique string in order to support help management feature.`
      )
    }
    this.appState.currentPage$.publish({
      path: document.location.pathname,
      helpArticleId: this.helpArticleId,
      permission: this.permission,
      pageName: this.pageName,
      applicationId: this.applicationId,
    })
  }
}


```

## Folder: angular-utils/src/lib/model (2 files)

### File: angular-utils/src/lib/model/injection-tokens.ts

```ts

import { InjectionToken } from '@angular/core'
import { ReplaySubject } from 'rxjs'
import { RemoteComponentConfig } from './remote-component-config.model'

export const REMOTE_COMPONENT_CONFIG = new InjectionToken<ReplaySubject<RemoteComponentConfig>>(
  'REMOTE_COMPONENT_CONFIG'
)

export const SKIP_STYLE_SCOPING = new InjectionToken<boolean>('SKIP_STYLE_SCOPING')


```

### File: angular-utils/src/lib/model/remote-component-config.model.ts

```ts

export type RemoteComponentConfig = {
  appId: string
  productName: string
  permissions: string[]
  baseUrl: string
}


```

## Folder: angular-utils/src/lib/providers (5 files)

### File: angular-utils/src/lib/providers/angular-utils.providers.ts

```ts

import { Provider } from '@angular/core'
import { providePermissionService } from './permission-service.providers'
import { provideTranslationPaths } from './translation-path.providers'

export type ContentType = 'microfrontend' | 'remoteComponent'

export interface AngularUtilsProviderConfig {
  contentType: ContentType
}

export function provideAngularUtils(): Provider[] {
  const providers = [...providePermissionService()]
  providers.push(provideTranslationPaths())
  return providers
}


```

### File: angular-utils/src/lib/providers/permission-service.providers.ts

```ts

import { Provider } from '@angular/core'
import { PermissionService } from '../services/permission.service'

export function providePermissionService(): Provider[] {
  return [PermissionService]
}


```

### File: angular-utils/src/lib/providers/translation-path.providers.ts

```ts

import { LOCALE_ID, Provider } from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'
import { provideTranslationPathFromMeta } from './translation-path-from-meta.providers'

const localProvider = {
  provide: LOCALE_ID,
  useFactory: (userService: UserService) => {
    return userService.lang$.getValue()
  },
  deps: [UserService],
}

export function provideTranslationPaths(): Provider[] {
  return [
    localProvider,
    provideTranslationPathFromMeta(import.meta.url, 'onecx-angular-utils/assets/i18n/'),
  ]
}

```

### File: angular-utils/src/lib/providers/translation-path-from-meta.provider.spec.ts

```ts

import { provideTranslationPathFromMeta } from './translation-path-from-meta.providers';
import { TRANSLATION_PATH } from '../utils/create-translate-loader.utils';
import { isTest } from '@onecx/accelerator';

// Mock the isTest function and Topic class
jest.mock('@onecx/accelerator', () => ({
  isTest: jest.fn(),
  Topic: class MockTopic {
  },
}));

const mockIsTest = isTest as jest.MockedFunction<typeof isTest>;

describe('provideTranslationPathFromMeta', () => {
  beforeEach(() => {
    mockIsTest.mockReset();
    // Default to non-test environment
    mockIsTest.mockReturnValue(false);
  });

  it('should remove file name and append custom path', () => {
    const url = 'https://dev.one-cx.org/mfe/workspace/3204.512.js'
    const provider = provideTranslationPathFromMeta(url, 'assets/pathName/');
    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'https://dev.one-cx.org/mfe/workspace/assets/pathName/',
      multi: true,
    });
  });

  it('should default to /i18n/ if path is undefined', () => {
    const url = 'https://dev.one-cx.org/mfe/workspace/3204.512.js'
    const provider = provideTranslationPathFromMeta(url);
    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'https://dev.one-cx.org/mfe/workspace/assets/i18n/',
      multi: true,
    });
  });

  it('should handle URLs with no file name', () => {
    const url = 'https://dev.one-cx.org/mfe/workspace/'
    const provider = provideTranslationPathFromMeta(url, 'assets/pathName/');
    expect(provider).toEqual(expect.objectContaining({ useValue: 'https://dev.one-cx.org/mfe/workspace/assets/pathName/'}));
  });

  it('should throw error for local file URLs', () => {
    mockIsTest.mockReturnValue(false);
    expect(() => {
      provideTranslationPathFromMeta('file:///some/local/file.js', 'assets/i18n/');
    }).toThrow('Cannot construct translation path from local file path. Please check whether the webpack configuration for importMeta is correct: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta');
  });

  it('should add trailing slash if path does not end with slash', () => {
    const url = 'https://dev.one-cx.org/mfe/workspace/3204.512.js'
    const provider = provideTranslationPathFromMeta(url, 'assets/i18n');
     expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'https://dev.one-cx.org/mfe/workspace/assets/i18n/',
      multi: true,
    });
  });

  it('should return relative path for local file URLs in test environment', () => {
    mockIsTest.mockReturnValue(true);
    const provider = provideTranslationPathFromMeta('file:///some/local/file.js', 'assets/i18n/');
    
    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'assets/i18n/',
      multi: true,
    });
  });

  it('should return relative path for undefined URL in test environment', () => {
    mockIsTest.mockReturnValue(true);
    const provider = provideTranslationPathFromMeta(undefined, 'assets/i18n/');
    
    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'assets/i18n/',
      multi: true,
    });
  });
});

```

### File: angular-utils/src/lib/providers/translation-path-from-meta.providers.ts

```ts

import { Provider } from "@angular/core";
import { TRANSLATION_PATH } from "../utils/create-translate-loader.utils";
import { Location } from "@angular/common";
import { isTest } from "@onecx/accelerator";

/**
 * Returns a provider for TRANSLATION_PATH based on import.meta.url and a given path.
 * Removes the file name from import.meta.url and appends the path (default 'assets/i18n/').
 * Please make sure the webpack configuration for importMeta contains: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta.
 */
export function provideTranslationPathFromMeta(url: string | undefined, path = 'assets/i18n/'): Provider {
  if (isTest() && (!url || url.startsWith('file://'))) {
    return constructTranslationPathInTestEnv(path);
  }
  return constructTranslationPath(url, path);
}

function constructTranslationPathInTestEnv(path: string): Provider {
  return {
    provide: TRANSLATION_PATH,
    useValue: path,
    multi: true,
  };
}

function constructTranslationPath(url: string | undefined, path: string): Provider {
  if(!url || url.startsWith('file://')) {
    throw new Error('Cannot construct translation path from local file path. Please check whether the webpack configuration for importMeta is correct: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta');
  }
  const urlWithoutFileName = url.replace(/\/[^/]*$/, '');
  const translationPath = Location.joinWithSlash(urlWithoutFileName, path) + (path.endsWith('/') ? '' : '/');
  return {
    provide: TRANSLATION_PATH,
    useValue: translationPath,
    multi: true,
  };
}

```

## Folder: angular-utils/src/lib/services (6 files)

### File: angular-utils/src/lib/services/permission.service.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { PermissionService } from './permission.service'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER } from '../utils/has-permission-checker'
import { of } from 'rxjs'

describe('PermissionService', () => {
  let userServiceMock: any
  let permissionCheckerMock: any

  beforeEach(() => {
    userServiceMock = {
      getPermissions: jest.fn(),
      hasPermission: jest.fn(),
    }
    permissionCheckerMock = {
      hasPermission: jest.fn(),
    }
  })

  function createServiceWithProviders({ userService, checker }: { userService?: any; checker?: any }) {
    TestBed.configureTestingModule({
      providers: [
        userService && { provide: UserService, useValue: userService },
        checker && { provide: HAS_PERMISSION_CHECKER, useValue: checker },
        PermissionService,
      ].filter(Boolean),
    })
    return TestBed.inject(PermissionService)
  }

  it('uses HasPermissionChecker if provided', () => {
    permissionCheckerMock.hasPermission.mockReturnValue(Promise.resolve(true))
    const service = createServiceWithProviders({ checker: permissionCheckerMock })
    service.hasPermission('perm').subscribe((result) => {
      expect(userServiceMock.getPermissions).not.toHaveBeenCalled()
      expect(permissionCheckerMock.hasPermission).toHaveBeenCalledWith('perm')
      expect(result).toBe(true)
    })
  })

  it('uses UserService if HasPermissionChecker is not provided', () => {
    userServiceMock.hasPermission.mockReturnValue(Promise.resolve(true))
    userServiceMock.getPermissions.mockReturnValue(of(['perm']))
    const service = createServiceWithProviders({ userService: userServiceMock })
    service.hasPermission('perm').subscribe((result) => {
      expect(permissionCheckerMock.hasPermission).not.toHaveBeenCalled()
      expect(userServiceMock.hasPermission).toHaveBeenCalledWith('perm')
      expect(result).toBe(true)
    })
  })

  it('caches permission observables for single permissions', () => {
    permissionCheckerMock.hasPermission.mockReturnValue(Promise.resolve(true))
    const service = createServiceWithProviders({ checker: permissionCheckerMock })
    const obs1 = service.hasPermission('perm')
    const obs2 = service.hasPermission('perm')
    expect(userServiceMock.getPermissions).not.toHaveBeenCalled()
    expect(permissionCheckerMock.hasPermission).toHaveBeenCalledWith('perm')
    expect(permissionCheckerMock.hasPermission).toHaveBeenCalledTimes(1)
    expect(obs1).toBe(obs2)
  })

  it('returns false observable if no checker available', () => {
    // Simulate service with no checker
    const service = Object.create(PermissionService.prototype)
    service.availableHasPermissionChecker = null
    service.falseObservable = of(false)
    expect(service.hasPermission('perm')).toBe(service.falseObservable)
  })

  it('getPermissions returns user permissions if UserService is available', () => {
    userServiceMock.getPermissions.mockReturnValue(of(['perm1', 'perm2']))
    const service = createServiceWithProviders({ userService: userServiceMock })
    service.getPermissions().subscribe((perms) => {
      expect(userServiceMock.getPermissions).toHaveBeenCalled()
      expect(perms).toEqual(['perm1', 'perm2'])
    })
  })

  it('getPermissions returns undefined observable if UserService is not available', () => {
    permissionCheckerMock.hasPermission.mockReturnValue(Promise.resolve(true))
    const service = createServiceWithProviders({ checker: permissionCheckerMock })
    service.getPermissions().subscribe((perms) => {
      expect(perms).toBeUndefined()
    })
  })

  it('supports array of permissions', () => {
    permissionCheckerMock.hasPermission.mockReturnValue(Promise.resolve(true))
    const service = createServiceWithProviders({ checker: permissionCheckerMock })
    service.hasPermission(['perm1', 'perm2']).subscribe((result) => {
      expect(result).toBe(true)
    })
  })

  it('caches permission observables for arrays of permissions', () => {
    permissionCheckerMock.hasPermission.mockReturnValue(Promise.resolve(true))
    const service = createServiceWithProviders({ checker: permissionCheckerMock })
    const obs1 = service.hasPermission(['perm1', 'perm2'])
    const obs2 = service.hasPermission(['perm1', 'perm2'])
    expect(userServiceMock.getPermissions).not.toHaveBeenCalled()
    expect(permissionCheckerMock.hasPermission).toHaveBeenCalledWith(['perm1', 'perm2'])
    expect(permissionCheckerMock.hasPermission).toHaveBeenCalledTimes(1)
    expect(obs1).toBe(obs2)
  })
})


```

### File: angular-utils/src/lib/services/permission.service.ts

```ts

import { inject, Injectable } from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER, HasPermissionChecker } from '../utils/has-permission-checker'
import { from, map, Observable, of } from 'rxjs'

/**
 * Service to check and list user permissions using an injected custom permission checker or the UserService.
 */
@Injectable()
export class PermissionService {
  private userService = inject(UserService, { optional: true })
  private hasPermissionChecker = inject(HAS_PERMISSION_CHECKER, { optional: true })

  /**
   * All observables are cached to avoid infinite re-rendering loops when using the permission service in templates.
   */
  private cachedPermissions = new Map<string, Observable<boolean>>()
  private undefinedObservable = of(undefined)
  private falseObservable = of(false)
  private cachedUserPermissions: Observable<string[]> = of([])

  private availableHasPermissionChecker: HasPermissionChecker | UserService | null =
    this.hasPermissionChecker || this.userService

  constructor() {
    if (!this.availableHasPermissionChecker) {
      throw new Error('UserService or HasPermissionChecker have to be provided to check permissions!')
    }
    if (this.userService) {
      this.cachedUserPermissions = this.userService.getPermissions()
    }
  }

  /**
   * Checks if the current user has the specified permission(s).
   * @param permissionKey A permission key or an array of permission keys to check.
   * @returns An observable that emits true if the user has the permission(s), false otherwise.
   */
  hasPermission(permissionKey: string | string[]): Observable<boolean> {
    return this.lookupPermission(permissionKey)
  }

  private lookupPermission(permissionKey: string | string[]): Observable<boolean> {
    const permissionChecker = this.availableHasPermissionChecker

    if (!permissionChecker) {
      return this.falseObservable
    }

    const cacheKey = JSON.stringify(permissionKey)

    if (!this.cachedPermissions.has(cacheKey)) {
      let hasPermission: Observable<boolean>
      if (this.hasPermissionChecker?.getPermissions) {
        hasPermission = this.hasPermissionChecker.getPermissions().pipe(
          map((permissions) => {
            if (Array.isArray(permissionKey)) {
              return permissionKey.every((key) => permissions?.includes(key))
            }

            return permissions.includes(permissionKey)
          })
        )
      } else {
        hasPermission = from(permissionChecker.hasPermission(permissionKey))
      }

      this.cachedPermissions.set(cacheKey, hasPermission)
    }

    return this.cachedPermissions.get(cacheKey) || this.falseObservable
  }

  /**
   * Lists the permissions of the current user.
   * @returns An observable that emits an array of permission keys or undefined if the UserService is not available.
   */
  getPermissions(): Observable<string[] | undefined> {
    if (this.userService) {
      return this.cachedUserPermissions
    }
    return this.undefinedObservable
  }
}


```

### File: angular-utils/src/lib/services/translation-cache.service.spec.ts

```ts

import { TestBed } from "@angular/core/testing";
import { ReplaySubject, of } from 'rxjs';
import { TranslationCacheService } from "./translation-cache.service";
import { FakeTopic } from "@onecx/accelerator";

describe('TranslationCacheService', () => {
  let translationCache: TranslationCacheService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [TranslationCacheService]
    }).compileComponents();
    translationCache = TestBed.inject(TranslationCacheService);
    (translationCache as any).translationTopic$ = new FakeTopic<string>();
  });

  afterEach(() => {
    window['onecxTranslations'] = {};
  });

  it('should be created', () => {
    expect(translationCache).toBeTruthy();
  });

  describe('getTranslationFile', () => {
    it('should return cached translation if available', (done) => {
      
      window['onecxTranslations'] = { 'testUrl': { key: 'cachedValue' } };
      translationCache.getTranslationFile('testUrl', () => of({ key: 'value' })).subscribe((result) => {
        expect(result).toEqual({ key: 'cachedValue' });
        done();
      });
    });
    
    it('should load and cache translation if not available', (done) => {

      const subject = new ReplaySubject<any>(1);

      let counter = 0;
      let v1 = undefined;
      let v2 = undefined;
      translationCache.getTranslationFile('testUrl', () => {counter++; return subject}).subscribe((v)=> {v1 = v});
      translationCache.getTranslationFile('testUrl', () => {counter++; return subject}).subscribe((v)=> {v2 = v});
      expect(counter).toBe(1);

      const trans = { key: 'value' };
      subject.next(trans);
      expect(v1).toBe(trans);
      expect(v2).toBe(trans);
      done();
    });
  });
});

```

### File: angular-utils/src/lib/services/translation-cache.service.ts

```ts

import { Injectable, OnDestroy } from '@angular/core'
import { Observable, catchError, filter, first, map, of, tap } from 'rxjs'
import { Topic } from '@onecx/accelerator'

// This topic is defined here and not in integration-interface, because
// it is not used as framework independent integration but for improving
// angular specific things
class TranslationCacheTopic extends Topic<string> {
  constructor() {
    super('translationCache', 2)
  }
}

declare global {
  interface Window {
    onecxTranslations: Record<string, any>
  }
}

@Injectable({ providedIn: 'root' })
export class TranslationCacheService implements OnDestroy {
  private _translationTopic$: TranslationCacheTopic | undefined
  get translationTopic$() {
    this._translationTopic$ ??= new TranslationCacheTopic()
    return this._translationTopic$
  }
  set translationTopic$(source: TranslationCacheTopic) {
    this._translationTopic$ = source
  }
  constructor() {
    window['onecxTranslations'] ??= {}
  }
  ngOnDestroy(): void {
    this._translationTopic$?.destroy()
  }

  /**
   * Retrieves a translation file from the cache or fetches it if not available.
   *
   * This method checks if the translation file is already cached in `window['onecxTranslations']`.
   * If it is, it returns the cached version. If not, it calls the provided `cacheMissFunction`
   * to fetch the translation file and caches it for future use.
   *
   * If the requested translation file is null, it waits for the translation topic to be published by a different application.
   *
   * In case of failed load, it logs an error, deletes the entry from the cache, and publishes the URL to notify other subscribers about the failure.
   * @param url
   * @param cacheMissFunction
   * @returns
   */
  getTranslationFile(url: string, cacheMissFunction: () => Observable<any>): Observable<any> {
    if (window['onecxTranslations'][url]) {
      return of(window['onecxTranslations'][url])
    }

    if (window['onecxTranslations'][url] === null) {
      return this.translationTopic$.pipe(
        filter((messageUrl) => messageUrl === url),
        map(() => window['onecxTranslations'][url] ?? {}),
        first()
      )
    }

    window['onecxTranslations'][url] = null
    return cacheMissFunction().pipe(
      tap((t) => {
        window['onecxTranslations'][url] = t
        this.translationTopic$.publish(url)
      }),
      map(() => window['onecxTranslations'][url]),
      catchError(() => {
        console.error(`Failed to load translation file: ${url}`)
        delete window['onecxTranslations'][url]
        this.translationTopic$.publish(url)
        return of({})
      }),
      first()
    )
  }
}


```

### File: angular-utils/src/lib/services/translation-connection.service.spec.ts

```ts

import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { TranslationConnectionService } from './translation-connection.service'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from '@onecx/angular-integration-interface'
import { provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'

describe('ConnectionService', () => {
  let service: TranslationConnectionService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestingModule.withTranslations('en', {})],
      providers: [provideUserServiceMock()],
    })
  })

  it('should create', fakeAsync(() => {
    TestBed.runInInjectionContext(() => {
      service = new TranslationConnectionService()
    })

    const userService = TestBed.inject(UserService)
    const translateService = TestBed.inject(TranslateService)
    expect(service).toBeTruthy()
    expect(translateService.currentLang).toBe('en')

    userService.lang$.next('de')
    tick(100)
    expect(translateService.currentLang).toBe('de')
  }))
})


```

### File: angular-utils/src/lib/services/translation-connection.service.ts

```ts

import { Injectable, OnDestroy, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from '@onecx/angular-integration-interface'
import { Subscription } from 'rxjs'

@Injectable()
export class TranslationConnectionService implements OnDestroy {
  languageSub: Subscription

  constructor() {
    const userService = inject(UserService)
    const translateService = inject(TranslateService)

    this.languageSub = userService.lang$.subscribe((lang) => translateService.use(lang))
  }
  ngOnDestroy(): void {
    this.languageSub.unsubscribe()
  }
}


```

## Folder: angular-utils/src/lib/utils (20 files)

### File: angular-utils/src/lib/utils/async-translate-loader.utils.spec.ts

```ts

import { TranslateLoader } from '@ngx-translate/core'
import { Observable, of } from 'rxjs'
import { AsyncTranslateLoader } from './async-translate-loader.utils'

describe('AsyncTranslateLoader', () => {
  class FakeTranslateLoader implements TranslateLoader {
    public lastLanguage: string | undefined
    constructor(private result: any) {}

    getTranslation(lang: string): Observable<any> {
      this.lastLanguage = lang
      return of(this.result)
    }
  }

  it('should get translations', (done) => {
    const translations = 'my translations'
    const translateLoader = new FakeTranslateLoader(translations)
    const translateLoader$ = of(translateLoader)

    expect(translateLoader.lastLanguage).toBeUndefined()

    const asyncTranslateLoader = new AsyncTranslateLoader(translateLoader$)
    asyncTranslateLoader.getTranslation('en').subscribe((t) => {
      expect(t).toEqual(translations)
      expect(translateLoader.lastLanguage).toEqual('en')
      done()
    })
  })
})


```

### File: angular-utils/src/lib/utils/async-translate-loader.utils.ts

```ts

import { TranslateLoader } from '@ngx-translate/core'
import { defaultIfEmpty, first, mergeMap, Observable, of } from 'rxjs'

export class AsyncTranslateLoader implements TranslateLoader {
  constructor(private readonly translateLoader$: Observable<TranslateLoader>) {}

  getTranslation(lang: string): Observable<any> {
    return this.translateLoader$.pipe(
      defaultIfEmpty(undefined),
      first(),
      mergeMap((translateLoader) => translateLoader?.getTranslation(lang) ?? of({})),
    )
  }
}


```

### File: angular-utils/src/lib/utils/caching-translate-loader.utils.spec.ts

```ts

import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { TranslationCacheService } from '../services/translation-cache.service'
import { CachingTranslateLoader } from './caching-translate-loader.utils'

describe('CachingTranslateLoader', () => {
  let http: HttpClient
  let translationCache: TranslationCacheService
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents()
    http = TestBed.inject(HttpClient)
    translationCache = TestBed.inject(TranslationCacheService)
    window['onecxTranslations'] = {}
  })

  it('should get translations', (done) => {
    const translateLoader = new CachingTranslateLoader(translationCache, http, `./assets/i18n/`, '.json')
    const translation = { testKey: 'my translation' }
    http.get = jest.fn().mockReturnValue(of(translation))
    translateLoader.getTranslation('en').subscribe((t) => {
      expect(t).toEqual(translation)
      done()
    })
  })

  it('should load translations only once', (done) => {
    let httpCalls = 0
    const responses = []
    const translation = { testKey: 'my translation' }
    http.get = jest.fn().mockImplementation(() => {
      httpCalls++
      return of(translation)
    })

    const translateLoader = new CachingTranslateLoader(translationCache, http, `./assets/i18n/`, '.json')
    translateLoader.getTranslation('en').subscribe((t) => {
      responses.push(t)
      expect(t).toEqual(translation)
      expect(httpCalls).toEqual(1)
      if (responses.length == 2) {
        done()
      }
    })
    const translateLoader2 = new CachingTranslateLoader(translationCache, http, `./assets/i18n/`, '.json')
    translateLoader2.getTranslation('en').subscribe((t) => {
      responses.push(t)
      expect(t).toEqual(translation)
      expect(httpCalls).toEqual(1)
      if (responses.length == 2) {
        done()
      }
    })
  })
})


```

### File: angular-utils/src/lib/utils/caching-translate-loader.utils.ts

```ts

import { HttpClient } from '@angular/common/http'
import { TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { Observable, retry } from 'rxjs'
import { TranslationCacheService } from '../services/translation-cache.service'

export class CachingTranslateLoader implements TranslateLoader {
  private translateLoader: TranslateHttpLoader

  constructor(
    private translationCache: TranslationCacheService,
    private http: HttpClient,
    private prefix?: string,
    private suffix?: string
  ) {
    this.translateLoader = new TranslateHttpLoader(this.http, this.prefix, this.suffix)
  }

  getTranslation(lang: string): Observable<any> {
    const url = `${this.prefix}${lang}${this.suffix}`

    return this.translationCache.getTranslationFile(url, () =>
      this.translateLoader.getTranslation(lang).pipe(retry({ delay: 50, count: 2 }))
    )
  }
}


```

### File: angular-utils/src/lib/utils/create-translate-loader.utils.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { MockService } from 'ng-mocks'
import { createTranslateLoader, TRANSLATION_PATH } from './create-translate-loader.utils'
import { Injector, runInInjectionContext } from '@angular/core'
import { TranslationCacheService } from '../services/translation-cache.service'
import { HttpClient } from '@angular/common/http'
import { of } from 'rxjs'

describe('CreateTranslateLoader', () => {
  const httpClientMock = MockService(HttpClient)
  httpClientMock.get = jest.fn(() => of({}, {}, {})) as any
  let translationCacheService: TranslationCacheService
  let injector: Injector

  describe('with injected TRANSLATION_PATH', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        providers: [
          {
            provide: TRANSLATION_PATH,
            useValue: 'path_1',
            multi: true,
          },
          {
            provide: TRANSLATION_PATH,
            useValue: 'path_2',
            multi: true,
          },
          {
            provide: TRANSLATION_PATH,
            useValue: of("path_3"),
            multi: true,
          },
        ],
      }).compileComponents()
  
      injector = TestBed.inject(Injector)
      translationCacheService = TestBed.inject(TranslationCacheService)
      window['onecxTranslations'] = {}
      jest.clearAllMocks()
    })
  
    describe('without TranslationCache parameter', () => {
      it('should call httpClient for each TRANSLATION_PATH', (done) => {
        const translateLoader = runInInjectionContext(injector, () =>
          createTranslateLoader(httpClientMock, undefined)
        )
  
        translateLoader.getTranslation('en').subscribe(() => {
          expect(httpClientMock.get).toHaveBeenCalledTimes(3)
          done()
        })
      })
    })
  
    describe('with TranslationCache parameter', () => {
      it('should call httpClient for each TRANSLATION_PATH', (done) => {
        const translateLoader = runInInjectionContext(injector, () =>
          createTranslateLoader(httpClientMock, undefined, translationCacheService)
        )
  
        translateLoader.getTranslation('en').subscribe(() => {
          expect(httpClientMock.get).toHaveBeenCalledTimes(3)
          done()
        })
      })
    })
  })

  describe('without injected TRANSLATION_PATH', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({}).compileComponents()
      injector = TestBed.inject(Injector)
      translationCacheService = TestBed.inject(TranslationCacheService)
      window['onecxTranslations'] = {}
      jest.clearAllMocks()
    })
  
    describe('without TranslationCache parameter', () => {
      it('should call httpClient for each TRANSLATION_PATH', (done) => {
        const translateLoader = runInInjectionContext(injector, () =>
          createTranslateLoader(httpClientMock, undefined)
        )
  
        translateLoader.getTranslation('en').subscribe(() => {
          expect(httpClientMock.get).toHaveBeenCalledTimes(0)
          done()
        })
      })
    })
  
    describe('with TranslationCache parameter', () => {
      it('should call httpClient for each TRANSLATION_PATH', (done) => {
        const translateLoader = runInInjectionContext(injector, () =>
          createTranslateLoader(httpClientMock, undefined, translationCacheService)
        )
  
        translateLoader.getTranslation('en').subscribe(() => {
          expect(httpClientMock.get).toHaveBeenCalledTimes(0)
          done()
        })
      })
    })
  })
})


```

### File: angular-utils/src/lib/utils/create-translate-loader.utils.ts

```ts

import { HttpClient } from '@angular/common/http'
import { inject, InjectionToken } from '@angular/core'
import { TranslateLoader } from '@ngx-translate/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import { from, isObservable, map, Observable, zip } from 'rxjs'
import { TranslationCacheService } from '../services/translation-cache.service'
import { AsyncTranslateLoader } from './async-translate-loader.utils'
import { CachingTranslateLoader } from './caching-translate-loader.utils'
import { TranslateCombinedLoader } from './translate.combined.loader'

export const TRANSLATION_PATH = new InjectionToken<(string | Observable<string> | Promise<string>)[]>(
  'TRANSLATION_PATH'
)

function toObservable(path: string | Observable<string> | Promise<string>): Observable<string> {
  if (isObservable(path)) {
    return path
  }
  return from(Promise.resolve(path))
}

export function createTranslateLoader(
  http: HttpClient,
  _appStateService?: AppStateService,
  translationCacheService?: TranslationCacheService
): TranslateLoader {
  const ts = translationCacheService ?? inject(TranslationCacheService)

  const translationPaths = inject(TRANSLATION_PATH, {optional: true}) ?? []

  return new AsyncTranslateLoader(
    zip(translationPaths.map((value) => toObservable(value))).pipe(
      map((translationPaths) => {
        const uniqueTranslationPaths = [...new Set(translationPaths)]
        return new TranslateCombinedLoader(
          ...uniqueTranslationPaths.map((path) => {
            return new CachingTranslateLoader(ts, http, path, '.json')
          })
        )
      })
    )
  )
}


```

### File: angular-utils/src/lib/utils/deep-merge.utils.ts

```ts

export function isObject(item: any): any {
  return item && typeof item === 'object' && !Array.isArray(item)
}

export function mergeDeep(target: any, source: any): any {
  const output = Object.assign({}, target)
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] })
        else output[key] = mergeDeep(target[key], source[key])
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}


```

### File: angular-utils/src/lib/utils/dynamic-locale-id.utils.spec.ts

```ts

import { DynamicLocaleId } from './dynamic-locale-id.utils'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { TestBed } from '@angular/core/testing'
import { LOCALE_ID } from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'

describe('DynamicLocaleId', () => {
  let dynamicLocaleId: DynamicLocaleId
  let userServiceMock: UserServiceMock

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideUserServiceMock(),
        {
          provide: LOCALE_ID,
          useClass: DynamicLocaleId,
          deps: [UserService],
        },
      ],
    })

    userServiceMock = TestBed.inject(UserServiceMock)
    dynamicLocaleId = new DynamicLocaleId(userServiceMock as any)
  })

  it('should return the current language from userService.lang$', () => {
    userServiceMock.lang$.next('fr')
    expect(dynamicLocaleId.valueOf()).toBe('fr')
  })

  it('should return the correct length of the current language', () => {
    userServiceMock.lang$.next('es')
    expect(dynamicLocaleId.length).toBe(2)
  })

  it('should proxy string methods to the current language', () => {
    userServiceMock.lang$.next('en-US')
    const dynamicLocaleId = TestBed.inject(LOCALE_ID)
    expect(dynamicLocaleId.toLowerCase()).toBe('en-us')
    expect(dynamicLocaleId.toUpperCase()).toBe('EN-US')
  })
})


```

### File: angular-utils/src/lib/utils/dynamic-locale-id.utils.ts

```ts

import { UserService } from '@onecx/angular-integration-interface'

export class DynamicLocaleId {
  constructor(private readonly userService: UserService) {
    Object.getOwnPropertyNames(String.prototype).forEach((k) => {
      if (k != 'valueOf' && k != 'length') {
        ;(this as any)[k] = function (...args: any[]) {
          const str = this.valueOf()
          return str[k](...args)
        }
      }
    })
  }

  valueOf() {
    return this.userService.lang$.getValue()
  }

  public get length(): number {
    return this.valueOf().length
  }
}


```

### File: angular-utils/src/lib/utils/has-permission-checker.ts

```ts

import { InjectionToken, Injector, Optional, SkipSelf } from '@angular/core'
import { hasPermissionCheckerFactory } from './has-permission-checker-factory'
import { Observable } from 'rxjs'

export interface HasPermissionChecker {
  hasPermission(permissionKey: string | string[]): Promise<boolean>
  getPermissions?(): Observable<string[]>
}

/**
 * This checker always returns true, basically disabling the permission system on the UI side
 */
export class AlwaysGrantPermissionChecker implements HasPermissionChecker {
  async hasPermission(_permissionKey: string | string[]): Promise<boolean> {
    return true
  }
}

export const HAS_PERMISSION_CHECKER = new InjectionToken<HasPermissionChecker>('hasPermission')

export function providePermissionChecker() {
  return [
    {
      provide: HAS_PERMISSION_CHECKER,
      useFactory: hasPermissionCheckerFactory,
      deps: [Injector, [new Optional(), new SkipSelf(), HAS_PERMISSION_CHECKER]],
    },
  ]
}

export function provideAlwaysGrantPermissionChecker() {
  return [
    {
      provide: HAS_PERMISSION_CHECKER,
      useClass: AlwaysGrantPermissionChecker,
    },
  ]
}


```

### File: angular-utils/src/lib/utils/has-permission-checker-factory.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER } from './has-permission-checker'
import { hasPermissionCheckerFactory } from './has-permission-checker-factory'
import { Injector } from '@angular/core'

describe('hasPermissionCheckerFactory', () => {
  let injector: Injector
  const userServiceMock = {
    hasPermission: jest.fn(),
  }

  const customPermissionChecker = {
    hasPermission: jest.fn(),
    someCustomMethod: jest.fn(),
  }

  describe('withProviders', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: UserService, useValue: userServiceMock },
          { provide: HAS_PERMISSION_CHECKER, useValue: customPermissionChecker },
        ],
      })
      injector = TestBed.inject(Injector)
    })
    it('should return the provided hasPermissionChecker when it exists', () => {
      const result = hasPermissionCheckerFactory(injector, customPermissionChecker)
      expect(result).toBe(customPermissionChecker)
    })

    it('should return a UserService instance when hasPermissionChecker is not provided but UserService exists', () => {
      const result = hasPermissionCheckerFactory(injector, null)
      expect(result).toBe(userServiceMock)
    })
  })

  describe('withoutProviders', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({})
      injector = TestBed.inject(Injector)
    })
    it('should create a new UserService instance when neither hasPermissionChecker nor UserService exists', () => {
      const result = hasPermissionCheckerFactory(injector, null)
      const newUserService = injector.get(UserService, null)

      expect(result).toBe(newUserService)
      expect(newUserService).toBeTruthy()
    })
  })
})


```

### File: angular-utils/src/lib/utils/has-permission-checker-factory.ts

```ts

import { Injector, Provider, StaticProvider } from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER, HasPermissionChecker } from './has-permission-checker'

export function hasPermissionCheckerFactory(parentInjector: Injector, hasPermissionChecker: HasPermissionChecker | null) {
  if (!hasPermissionChecker) {
    const hasUserService = !!parentInjector.get(UserService, null)
    const injectorConfig: {
      providers: Array<Provider | StaticProvider>
      parent?: Injector
      name?: string
    } = {
      providers: [
        {
          provide: HAS_PERMISSION_CHECKER,
          useExisting: UserService,
        },
      ],
      parent: parentInjector,
    }
    if (!hasUserService) {
      injectorConfig.providers.push(UserService)
    }
    const injector = Injector.create(injectorConfig)
    hasPermissionChecker = injector.get(HAS_PERMISSION_CHECKER)
  }
  return hasPermissionChecker
}


```

### File: angular-utils/src/lib/utils/multi-language-missing-translation-handler.utils.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { MultiLanguageMissingTranslationHandler } from './multi-language-missing-translation-handler.utils'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { MissingTranslationHandlerParams } from '@ngx-translate/core'
import { of } from 'rxjs'
import { UserProfile } from '@onecx/integration-interface'

jest.mock('@onecx/accelerator', () => {
  const actual = jest.requireActual('@onecx/accelerator')
  return {
    ...actual,
    getNormalizedBrowserLocales: jest.fn(),
  }
})

import { getNormalizedBrowserLocales } from '@onecx/accelerator'

jest.mock('@ngx-translate/core', () => {
  const actual = jest.requireActual('@ngx-translate/core')
  return {
    ...actual,
    getValue: jest.fn((obj, key) => obj[key]),
  }
})

describe('MultiLanguageMissingTranslationHandler', () => {
  let handler: MultiLanguageMissingTranslationHandler
  let userServiceMock: UserServiceMock
  let mockedGetNormalizedBrowserLocales: jest.Mock

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideUserServiceMock(), MultiLanguageMissingTranslationHandler],
    })

    userServiceMock = TestBed.inject(UserServiceMock)
    handler = TestBed.inject(MultiLanguageMissingTranslationHandler)
    mockedGetNormalizedBrowserLocales = getNormalizedBrowserLocales as jest.Mock
  })

  it('should use locales from user profile if available', (done) => {
    mockedGetNormalizedBrowserLocales.mockReturnValue(['de'])

    userServiceMock.profile$.publish({
      settings: {
        locales: ['fr', 'en'],
      },
    } as UserProfile)

    const params: MissingTranslationHandlerParams = {
      key: 'test.key',
      translateService: {
        reloadLang: jest.fn().mockImplementation((lang) => {
          if (lang === 'fr') {
            return of({ 'test.key': 'Test French' })
          }
          return of({})
        }),
        parser: {
          interpolate: jest.fn((value) => value),
          getValue: jest.fn((obj, key) => obj[key]),
        },
      } as any,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('Test French')
      done()
    })
  })

  it('should use browser locales if locales from user profile are unavailable', (done) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    mockedGetNormalizedBrowserLocales.mockReturnValue(['de'])

    userServiceMock.profile$.publish({
      settings: {
        locales: undefined,
      },
    } as UserProfile)

    const params: MissingTranslationHandlerParams = {
      key: 'test.key',
      translateService: {
        reloadLang: jest.fn().mockImplementation((lang) => {
          if (lang === 'de') {
            return of({ 'test.key': 'Test German' })
          }
          return of({})
        }),
        parser: {
          interpolate: jest.fn((value) => value),
          getValue: jest.fn((obj, key) => obj[key]),
        },
      } as any,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('Test German')
      done()
    })
  })

  it('should try to load for every available language', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['fr', 'en', 'pl'],
      },
    } as UserProfile)

    const params: MissingTranslationHandlerParams = {
      key: 'test.key',
      translateService: {
        reloadLang: jest.fn().mockImplementation((lang) => {
          if (lang === 'pl') {
            return of({ 'test.key': 'Test Polish' })
          }
          return of({})
        }),
        parser: {
          interpolate: jest.fn((value) => value),
          getValue: jest.fn((obj, key) => obj[key]),
        },
      } as any,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('Test Polish')
      expect(params.translateService.reloadLang).toHaveBeenCalledTimes(3)
      done()
    })
  })
  it('should throw an error if no translation is found', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['fr', 'en', 'pl'],
      },
    } as UserProfile)

    const params: MissingTranslationHandlerParams = {
      key: 'missing.key',
      translateService: {
        reloadLang: jest.fn().mockReturnValue(of({})),
        parser: {
          interpolate: jest.fn((value) => value),
          getValue: jest.fn((obj, key) => obj[key]),
        },
      } as any,
    }

    handler.handle(params).subscribe({
      error: (err) => {
        expect(err.message).toBe('No translation found for key: missing.key')
        expect(params.translateService.reloadLang).toHaveBeenCalledTimes(3)
        done()
      },
    })
  })
})


```

### File: angular-utils/src/lib/utils/multi-language-missing-translation-handler.utils.ts

```ts

import { inject, Injectable } from '@angular/core'
import { getValue, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core'
import { getNormalizedBrowserLocales } from '@onecx/accelerator'
import { UserService } from '@onecx/angular-integration-interface'
import { Observable, of } from 'rxjs'
import { catchError, map, mergeMap, shareReplay, take } from 'rxjs/operators'

@Injectable()
export class MultiLanguageMissingTranslationHandler implements MissingTranslationHandler {
  private readonly userService = inject(UserService)
  handle(params: MissingTranslationHandlerParams): Observable<string> {
    const locales$ = this.userService.profile$.pipe(
      map((p) => {
        if (p.settings?.locales) {
          return p.settings?.locales
        }
        return getNormalizedBrowserLocales()
      }),
      take(1),
      shareReplay(1)
    )

    return loadTranslations(locales$, params)
  }
}
/**
 * Tries to find a translation for the given language.
 * If no translation is found, an error is thrown.
 *
 * Uses the translateService to reload the language and get the translation for the given key. Then parses the translation with provided parameters.
 * @param lang - language to find the translation for
 * @param params - parameters containing the key and translateService
 * @returns Observable that emits the translation or throws an error if not found
 */
function findTranslationForLang(lang: string, params: MissingTranslationHandlerParams): Observable<string> {
  return params.translateService.reloadLang(lang).pipe(
    map((interpolatableTranslationObject: Record<string, any>) => {
      const translatedValue = params.translateService.parser.interpolate(
        getValue(interpolatableTranslationObject, params.key),
        params.interpolateParams
      )
      if (!translatedValue) {
        throw new Error(`No translation found for key: ${params.key} in language: ${lang}`)
      }
      return translatedValue
    })
  )
}

function loadTranslations(
  langConfig: Observable<string[]>,
  params: MissingTranslationHandlerParams
): Observable<string> {
  return langConfig.pipe(
    mergeMap((l) => {
      const langs = [...l]
      const chain = (o: Observable<string[]>): Observable<any> => {
        return o.pipe(
          mergeMap((lang) => {
            return findTranslationForLang(lang[0], params)
          }),
          catchError(() => {
            langs.shift()
            if (langs.length === 0) {
              throw new Error(`No translation found for key: ${params.key}`)
            }
            return chain(of(langs))
          })
        )
      }
      return chain(of(langs))
    })
  )
}


```

### File: angular-utils/src/lib/utils/portal-api-configuration.utils.ts

```ts

import { Location } from '@angular/common'
import { inject } from '@angular/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import { BehaviorSubject, first, map } from 'rxjs'

type Config = {
  credentials: { [key: string]: string | (() => string | undefined) }
  encodeParam: (param: unknown) => string
  selectHeaderContentType(contentTypes: string[]): string | undefined
  selectHeaderAccept(accepts: string[]): string | undefined
  isJsonMime(mime: string): boolean
  lookupCredential(key: string): string | undefined
}

export class PortalApiConfiguration {
  private configuration: Config
  appStateService: AppStateService = inject(AppStateService)

  protected basePath$: BehaviorSubject<string>
  get basePath() {
    return this.basePath$.value
  }
  set basePath(_: string) {
    throw new Error('Do not set basePath')
  }

  get credentials(): { [key: string]: string | (() => string | undefined) } {
    return this.configuration.credentials
  }
  set credentials(value: { [key: string]: string | (() => string | undefined) }) {
    this.configuration.credentials = value
  }

  get encodeParam(): (param: unknown) => string {
    return this.configuration.encodeParam
  }
  set encocdeParam(value: (param: unknown) => string) {
    this.configuration.encodeParam = value
  }

  constructor(
    private configurationClassOfGenerator: unknown,
    private apiPrefix: string
  ) {
    this.configuration = this.activator(this.configurationClassOfGenerator)
    this.basePath$ = new BehaviorSubject<string>(Location.joinWithSlash('.', this.apiPrefix))
    this.appStateService.currentMfe$
      .pipe(
        first(),
        map((currentMfe) => {
          return Location.joinWithSlash(currentMfe.remoteBaseUrl, apiPrefix)
        })
      )
      .subscribe(this.basePath$)
  }

  public selectHeaderContentType(contentTypes: string[]): string | undefined {
    return this.configuration.selectHeaderContentType(contentTypes)
  }

  public selectHeaderAccept(accepts: string[]): string | undefined {
    return this.configuration.selectHeaderAccept(accepts)
  }

  public isJsonMime(mime: string): boolean {
    return this.configuration.isJsonMime(mime)
  }

  public lookupCredential(key: string): string | undefined {
    return this.configuration.lookupCredential(key)
  }

  private activator(type: unknown): Config {
    return new (<{ new (): Config }>(<unknown>type))()
  }
}


```

### File: angular-utils/src/lib/utils/provide-connection-service.ts

```ts

import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core'
import { TranslationConnectionService } from '../services/translation-connection.service'

export function provideTranslationConnectionService() {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory() {
        return () => inject(TranslationConnectionService)
      },
    },
    TranslationConnectionService,
  ]
}


```

### File: angular-utils/src/lib/utils/remote-component-translation-path-factory.utils.ts

```ts

import { map, Observable, ReplaySubject } from 'rxjs'
import { Location } from '@angular/common'
import { RemoteComponentConfig } from '../model/remote-component-config.model'

/**
 * @deprecated Please use provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/') instead of
 *  {
      provide: TRANSLATION_PATH,
      useFactory: ... =>
        remoteComponentTranslationPathFactory('assets/i18n/')...,
      ...
    }
    to provide the translation path.
    Please make sure the webpack configuration for importMeta contains: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta.
 */
export function remoteComponentTranslationPathFactory(path: string) {
  return function TranslationPathFactory(
    remoteComponentConfig: ReplaySubject<RemoteComponentConfig>
  ): Observable<string> {
    return remoteComponentConfig.pipe(
      map((config) => {
        return Location.joinWithSlash(config.baseUrl, path)
      })
    )
  }
}


```

### File: angular-utils/src/lib/utils/scope.utils.ts

```ts

import { AppStateService } from '@onecx/angular-integration-interface'
import { ReplaySubject, firstValueFrom, map } from 'rxjs'
import { RemoteComponentConfig } from '../model/remote-component-config.model'

export const shellScopeId = 'shell-ui'

const everythingNotACharacterOrNumberRegex = /[^a-zA-Z0-9-]/g
/**
 * @constant {string} dataStyleIdKey
 * @description Marks start of scope section for scopeId (e.g. data-style-id="onecx-workspace|onecx-workspace-ui")
 * Present for MFE and RC components as well as dynamic content
 */
export const dataStyleIdKey = 'styleId'

/**
 * @constant {string} dataStyleIsolationKey
 * @description Marks end of scope section
 * Present for MFE and RC components as well as dynamic content
 */
export const dataStyleIsolationKey = 'styleIsolation'

/**
 * @constant {string} dataNoPortalLayoutStylesKey
 * @description Should always be in pair with styleId
 * Marks that scope section does not request portal layout styles
 * Present for MFE and RC components as well as dynamic content since libs v6
 */
export const dataNoPortalLayoutStylesKey = 'noPortalLayoutStyles'

/**
 * @constant {string} dataMfeElementKey
 * @description Marks element as the mfe content
 * Marks that scope section does not request portal layout styles
 * Present for MFE and its dynamic content
 */
export const dataMfeElementKey = 'mfeElement'

/**
 * @constant {string} dataIntermediateStyleIdKey
 * @description Metadata used when appending dynamic content to ensure style scoping outside the application
 * (e.g. data-intermediate-style-id="onecx-workspace|onecx-workspace-ui")
 */
export const dataIntermediateStyleIdKey = 'intermediateStyleId'

/**
 * @constant {string} dataIntermediateMfeElementKey
 * @description Metadata used when appending dynamic content to ensure style scoping outside the application
 */
export const dataIntermediateMfeElementKey = 'intermediateMfeElement'

/**
 * @constant {string} dataIntermediateStyleIsolationKey
 * @description Metadata used when appending dynamic content to ensure style scoping outside the application
 */
export const dataIntermediateStyleIsolationKey = 'intermediateStyleIsolation'

/**
 * @constant {string} dataIntermediateNoPortalLayoutStylesKey
 * @description Metadata used when appending dynamic content to ensure style scoping outside the application
 */
export const dataIntermediateNoPortalLayoutStylesKey = 'intermediateNoPortalLayoutStyles'

/**
 * @constant {string} dataVariableOverrideIdKey
 * @description Marks the style element as one containing overrides for scope sections with scopeId
 */
export const dataVariableOverrideIdKey = 'VariableOverrideId'

/**
 * @constant {string} dataPortalLayoutStylesKey
 * @description Marks the style element as one containing portal layout styles styles
 */
export const dataPortalLayoutStylesKey = 'portalLayoutStylesStyles'

/**
 * @constant {string} dataDynamicPortalLayoutStylesKey
 * @description Marks the style element as one containing portal layout styles styles for the dynamic content
 */
export const dataDynamicPortalLayoutStylesKey = 'dynamicContentPortalLayoutStyles'

/**
 * @constant {string} dataStyleIdAttribute
 * @description HTML attribute for styleId. See {@link dataStyleIdKey} for more details.
 */
export const dataStyleIdAttribute = 'data-style-id'

/**
 * @constant {string} dataMfeElementAttribute
 * @description HTML attribute for mfe element. See {@link dataMfeElementKey} for more details.
 */
export const dataMfeElementAttribute = 'data-mfe-element'

/**
 * @constant {string} dataStyleIsolationAttribute
 * @description HTML attribute for styleIsolation. See {@link dataStyleIsolationKey} for more details.
 */
export const dataStyleIsolationAttribute = 'data-style-isolation'

/**
 * @constant {string} dataNoPortalLayoutStylesAttribute
 * @description HTML attribute for noPortalLayoutStyles. See {@link dataNoPortalLayoutStylesKey} for more details.
 */
export const dataNoPortalLayoutStylesAttribute = 'data-no-portal-layout-styles'

/**
 * @constant {string} dataIntermediateStyleIdAttribute
 * @description HTML attribute for intermediateStyleId. See {@link dataIntermediateStyleIdKey} for more details.
 */
export const dataIntermediateStyleIdAttribute = 'data-intermediate-style-id'

/**
 * @constant {string} dataIntermediateMfeElementAttribute
 * @description HTML attribute for intermediateMfeElement. See {@link dataIntermediateMfeElementKey} for more details.
 */
export const dataIntermediateMfeElementAttribute = 'data-intermediate-mfe-element'

/**
 * @constant {string} dataIntermediateStyleIsolationAttribute
 * @description HTML attribute for intermediateStyleIsolation. See {@link dataIntermediateStyleIsolationKey} for more details.
 */
export const dataIntermediateStyleIsolationAttribute = 'data-intermediate-style-isolation'

/**
 * @constant {string} dataIntermediateNoPortalLayoutStylesAttribute
 * @description HTML attribute for intermediateNoPortalLayoutStyles. See {@link dataIntermediateNoPortalLayoutStylesKey} for more details.
 */
export const dataIntermediateNoPortalLayoutStylesAttribute = 'data-intermediate-no-portal-layout-styles'

/**
 * @constant {string} dataVariableOverrideIdAttribute
 * @description HTML attribute for variableOverrideId. See {@link dataVariableOverrideIdKey} for more details.
 */
export const dataVariableOverrideIdAttribute = 'data-variable-override-id'

/**
 * @constant {string} dataPortalLayoutStylesAttribute
 * @description HTML attribute for portalLayoutStyles. See {@link dataPortalLayoutStylesKey} for more details.
 */
export const dataPortalLayoutStylesAttribute = 'data-portal-layout-styles'

/**
 * @constant {string} dataDynamicPortalLayoutStylesAttribute
 * @description HTML attribute for dynamicPortalLayoutStyles. See {@link dataDynamicPortalLayoutStylesKey} for more details.
 */
export const dataDynamicPortalLayoutStylesAttribute = 'data-dynamic-content-portal-layout-styles'

export const portalLayoutStylesSheetId = `[${dataStyleIdAttribute}]:not([${dataNoPortalLayoutStylesAttribute}])`
export const dynamicPortalLayoutStylesSheetId = `body>:not([${dataNoPortalLayoutStylesAttribute}])`

/**
 * Gets the scope identifier based on the application context
 */
// Style scoping should be skipped for Shell
// For Remote Components application data from config is taken
// For MFE data from currentMfe topic is taken
export async function getScopeIdentifier(
  appStateService: AppStateService,
  skipStyleScoping?: boolean,
  remoteComponentConfig?: ReplaySubject<RemoteComponentConfig>
) {
  let scopeId = ''
  if (!skipStyleScoping) {
    if (remoteComponentConfig) {
      const rcConfig = await firstValueFrom(remoteComponentConfig)
      scopeId = scopeIdFromProductNameAndAppId(rcConfig.productName, rcConfig.appId)
    } else {
      scopeId = await firstValueFrom(
        appStateService.currentMfe$.pipe(
          map((mfeInfo) => scopeIdFromProductNameAndAppId(mfeInfo.productName, mfeInfo.appId))
        )
      )
    }
  }
  return scopeId
}

// If scope rule is not supported, its wrapped via supports rule to be handled by the polyfill
export function scopePrimengCss(css: string, scopeId: string) {
  const isScopeSupported = isCssScopeRuleSupported()
  if (scopeId === '') {
    return isScopeSupported
      ? `
    @scope([${dataStyleIdAttribute}="${shellScopeId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]) {
            ${css}
        }
    `
      : `
    @supports (@scope([${dataStyleIdAttribute}="${shellScopeId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}])) {
            ${css}
        }
    `
  } else {
    return isScopeSupported
      ? `
    @scope([${dataStyleIdAttribute}="${scopeId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]) {
            ${css}
        }
    `
      : `
    @supports (@scope([${dataStyleIdAttribute}="${scopeId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}])) {
            ${css}
        }
    `
  }
}

// Primeng variables have --p- prefix and style scoping requires each scope to have its own version of such variable
export function replacePrimengPrefix(css: string, scopeId: string) {
  if (scopeId === '') {
    return css
  }

  return css.replaceAll('--p-', scopeIdentifierToVariablePrefix(scopeId))
}

export function scopeIdentifierToVariablePrefix(scopeId: string) {
  return '--' + scopeId.replace(everythingNotACharacterOrNumberRegex, '-') + '-'
}

export function scopeIdFromProductNameAndAppId(productName: string, appId: string) {
  if (productName.length === 0) {
    console.error(
      `Error while creating scope id for: productName = ${productName}, appId = ${appId}. Name of the product is empty. Please validate the microfrontend and remote components configuration.`
    )
  }
  if (appId.length === 0) {
    console.error(
      `Error while creating scope id for: productName = ${productName}, appId = ${appId}. Id of the application is empty. Please validate the microfrontend and remote components configuration.`
    )
  }
  return `${productName}|${appId}`
}

export function isCssScopeRuleSupported() {
  return typeof CSSScopeRule !== 'undefined'
}


```

### File: angular-utils/src/lib/utils/translate.combined.loader.ts

```ts

import { TranslateLoader } from '@ngx-translate/core'
import { Observable, catchError, forkJoin, map, of } from 'rxjs'
import { mergeDeep } from './deep-merge.utils'
export class TranslateCombinedLoader implements TranslateLoader {
  private _loaders: TranslateLoader[]
  constructor(...loaders: TranslateLoader[]) {
    this._loaders = loaders
  }
  getTranslation(lang: string): Observable<object> {
    return forkJoin(
      this._loaders.map((l) =>
        l.getTranslation(lang).pipe(
          catchError((err) => {
            console.error('Failed to load translation file', l, err)
            return of({})
          })
        )
      )
    ).pipe(
      map((allTranslations) => {
        let result = {}
        allTranslations.forEach((translations) => {
          result = mergeDeep(result, translations)
        })
        return result
      })
    )
  }
}


```

### File: angular-utils/src/lib/utils/translation-path-factory.utils.ts

```ts

import { combineLatest, filter, map, Observable } from "rxjs"
import { AppStateService } from "@onecx/angular-integration-interface"
import { Location } from "@angular/common"

/**
 * @deprecated Please use provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/') instead of
 *  {
      provide: TRANSLATION_PATH,
      useFactory: ... => translationPathFactory('assets/i18n/')...,
      ...
    }
    to provide the translation path. 
 *  Please make sure the webpack configuration for importMeta contains: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta.
 */
export function translationPathFactory(path: string) {
  return function TranslationPathFactory(appStateService: AppStateService): Observable<string> {
    return combineLatest([
      appStateService.currentMfe$.asObservable(),
      appStateService.globalLoading$.asObservable(),
    ]).pipe(
      filter(([, isLoading]) => !isLoading),
      map(([currentMfe]) => {
        return Location.joinWithSlash(currentMfe.remoteBaseUrl, path)
      })
    )
  }
}


```

## Folder: angular-utils/style (6 files)

### File: angular-utils/style/jest.config.ts

```ts

/* eslint-disable */
import { createReportsConfig } from '../../../jest-config-factory'

export default {
  ...createReportsConfig('angular-utils/style'),
  displayName: 'angular-utils/style',
  preset: '../../jest.preset.js',
  testMatch: ['<rootDir>/src/lib/**/*.spec.ts', '<rootDir>/guards/**/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.(mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
    '^.+\\.tsx?$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: { metaObjectReplacement: { url: 'https://www.url.com' } },
            },
          ],
        },
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
}


```

### File: angular-utils/style/ng-package.json

```json

{
  "$schema": "../../../node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "src/index.ts"
  }
}


```

### File: angular-utils/style/tsconfig.json

```json

{
  "compilerOptions": {
    "target": "es2022",
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
      "path": "./tsconfig.lib.json"
    },
    {
      "path": "./tsconfig.spec.json"
    }
  ],
  "extends": "../../../tsconfig.base.json",
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}


```

### File: angular-utils/style/tsconfig.lib.json

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../dist/out-tsc",
    "declaration": true,
    "declarationMap": true,
    "inlineSources": true,
    "types": ["node"]
  },
  "exclude": ["src/**/*.spec.ts", "src/test-setup.ts", "jest.config.ts", "src/**/*.test.ts"],
  "include": ["src/**/*.ts"]
}


```

### File: angular-utils/style/tsconfig.lib.prod.json

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
  },
  "exclude": ["jest.config.ts"]
}


```

### File: angular-utils/style/tsconfig.spec.json

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../dist/out-tsc",
    "module": "commonjs",
    "target": "es2016",
    "types": ["jest", "node"]
  },
  "files": ["src/test-setup.ts"],
  "include": ["jest.config.ts", "src/**/*.test.ts", "src/**/*.spec.ts", "src/**/*.d.ts"]
}


```

## Folder: angular-utils/style/src/api (1 files)

### File: angular-utils/style/src/api/constants.ts

```ts

/**
 * @constant {string} dataRcStylesKey
 * @description Marks style element as one used by the current RC.
 */
export const dataRcStylesStart = 'slot'

/**
 * @constant {string} dataAppStylesKey
 * @description Marks style element as one containing styles for scopeId (which is based on the application)
 * Such style sheet contains variables applied globally and CSS scoped to a given scope until style isolation.
 * (e.g. data-app-styles="onecx-workspace|onecx-workspace-ui")
 */
export const dataAppStylesKey = 'appStyles'

/**
 * @constant {string} dataMfeStylesKey
 * @description Marks style element as one used by the current MFE.
 */
export const dataMfeStylesKey = 'mfeStyles'

/**
 * @function dataRcStylesKey
 * @description Marks style element as one used by any component in a slot given by the SLOT_NAME.
 * @param {string} slotName - The name of the slot.
 * @returns {string} The key for the slot styles.
 */
export const dataRcStylesKey = (slotName: string) =>
  `${dataRcStylesStart}${slotName.replace(slotName.charAt(0), slotName.charAt(0).toUpperCase())}Styles`

/**
 * @constant {string} dataShellStylesKey
 * @description Marks style element as one containing styles for the shell.
 * Such style sheet contains variables applied globally and CSS scoped to a shell scope until style isolation.
 */
export const dataShellStylesKey = 'shellStyles'

/**
 * @constant {string} dataAppStylesAttribute
 * @description HTML attribute for appStyles. See {@link dataAppStylesKey} for more details.
 */
export const dataAppStylesAttribute = 'data-app-styles'

/**
 * @constant {string} dataMfeStylesAttribute
 * @description HTML attribute for mfeStyles. See {@link dataMfeStylesKey} for more details.
 */
export const dataMfeStylesAttribute = 'data-mfe-styles'

/**
 * @function dataRcStylesAttribute
 * @description HTML attribute for slot styles. See {@link dataRcStylesKey} for more details.
 * @param {string} slotName - The name of the slot.
 * @returns {string} The attribute for the slot styles.
 */
export const dataRcStylesAttribute = (slotName: string) => `data-${dataRcStylesStart}-${slotName}-styles`

/**
 * @constant {string} dataShellStylesAttribute
 * @description HTML attribute for shellStyles. See {@link dataShellStylesKey} for more details.
 */
export const dataShellStylesAttribute = 'data-shell-styles'

```

## Folder: angular-utils/style/src (2 files)

### File: angular-utils/style/src/index.ts

```ts

//api
export * from './api/constants'

//utils
export * from './utils/app-styles-usage.utils'
export * from './utils/dom-style.utils'
export * from './utils/app-styles-scope.utils'
export * from './utils/app-styles-lifecycle.utils'
export * from './utils/fetch-app-css.util'

```

### File: angular-utils/style/src/test-setup.ts

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

## Folder: angular-utils/style/src/utils (5 files)

### File: angular-utils/style/src/utils/app-styles-lifecycle.utils.ts

```ts

import { scopeIdFromProductNameAndAppId } from "@onecx/angular-utils";
import { HttpClient } from "@angular/common/http";
import {
  getAppStyleByScope, 
  getStyleUsageCount, 
  fetchAppCss,
  dataAppStylesKey,
  useStyleForMfe, 
  useStyleForRc, 
  replaceStyleContent, 
  removeMfeUsageFromStyle,
  removeRcUsageFromStyle,
  createStyleUsedByMfeRc,
  createApplicationScopedCss,
  getAllStylesUsedByKey,
  dataMfeStylesAttribute,
  dataRcStylesAttribute
} from "../index";

/**
 * Update page styles.
 *
 * It removes old mfe usages and unused style elements.
 * Loads and creates new style element with MFE application styles css and registers the MFE for the usage.
 * If style element for the MFE application is already created, it only registers for the usage.
 *
 * @param productName - product name MFE belongs to
 * @param appId - id of the application MFE belongs to
 * @param httpClient - http client to make requests
 * @param mfeUrl - url of the MFE application to make requests
 */
export function updateStylesForMfeChange(
  productName: string,
  appId: string,
  httpClient: HttpClient,
  mfeUrl: string
) {
  updateStyles(
    productName,
    appId,
    httpClient,
    mfeUrl,
    {type:'mfe'},
    (document) => useStyleForMfe(document),
    (document) => removeMfeUsageFromStyle(document) 
  );
}

/**
 * Update page styles.
 *
 * Loads and creates new style element with RC application styles css and registers the RC for the usage.
 * If style element for the RC application is already created, it only registers for the usage.
 * @param productName - product name RC belongs to
 * @param appId - id of the application RC belongs to
 * @param httpClient - http client to make requests
 * @param rcUrl - url of the RC application to make requests
 * @param slotName - name of the slot hosting the RC
 */
export function updateStylesForRcCreation(
  productName: string,
  appId: string,
  httpClient: HttpClient,
  rcUrl: string,
  slotName: string
) {
  updateStyles(
    productName,
    appId,
    httpClient,
    rcUrl,
    {type:'rc',slotName:slotName},
    (document) => useStyleForRc(document, slotName),
    (document) => removeRcUsageFromStyle(document,slotName) 
  );
}

/**
 * Update page styles.
 *
 * Loads and creates new style element with RC or MFE application styles css and registers the MFE or RC for the usage depending on passed callback function.
 * If style element for application is already created, it only registers for the usage.
 * The old and unused style usages are removed based on a passed callback function.
 * @param productName - product name style belongs to
 * @param appId - id of the application style belongs to
 * @param httpClient - http client to make requests
 * @param url - url of the application to make requests
 * @param options - defines type of style together with the name of the slot hosting the style for RC
 * @param useStyleCallback - function used for style registration based on the style type
 * @param removeUsageFromStyleCallback - function used for style removal based on the style type
 */
async function updateStyles(
  productName: string,
  appId: string,
  httpClient: HttpClient,
  url: string,
  options: {type:'rc',slotName:string} | {type:'mfe'},
  useStyleCallback: (document: HTMLStyleElement) => void,
  removeUsageFromStyleCallback: (document: HTMLStyleElement) => void
){
  const scopeId = scopeIdFromProductNameAndAppId(productName, appId)

  if(options.type === 'mfe') removeAllMfeUsagesFromStyles(scopeId)
  
  const existingStyleElement = getAppStyleByScope(scopeId)

  if (existingStyleElement) {
    useStyleCallback(existingStyleElement)
    return
  }

  const styleElement = createStyleUsedByMfeRc(scopeId, options)
  const css = await fetchAppCss(httpClient, url);
  (styleElement as any).onecxOriginalCss = css

  if (!css) {
    removeUsageFromStyleCallback(styleElement)
    if (getStyleUsageCount(styleElement) === 0) {
      styleElement.remove()
    }
    return
  }
  const scopedCss = createApplicationScopedCss(css, scopeId)
  replaceStyleContent(styleElement, scopedCss)
}

/**
 * Removes usages for all MFEs not related to the given scope.
 *
 * This will remove the style element completely if no other active users are present.
 *
 * @param scopeId - id of the scope to not deactivate
 */
export function removeAllMfeUsagesFromStyles(scopeId: string) {
  removeInactiveStyles(
    scopeId,
    getAllStylesUsedByKey(dataMfeStylesAttribute),
    (style) => removeMfeUsageFromStyle(style)
  );
}

/**
 * Update page styles.
 *
 * Remove usages of the RC from the style elements it is register for.
 * If usage removal leads to style element not being used by any MFE or RC its removed from the page.
 * @param scopeId - id of the scope to not deactivate
 * @param slotName - name of the slot hosting the RC
 */
export function removeAllRcUsagesFromStyles(scopeId: string, slotName: string) {
  removeInactiveStyles(
    scopeId,
    getAllStylesUsedByKey(dataRcStylesAttribute(slotName)),
    (style) => removeRcUsageFromStyle(style,slotName)
  );
}


/**
 * Remove usage of the  RC or MFE style from elements it is registered for.
 * If usage removal leads to style element not being used by any MFE or RC its removed from the page.
 * @param scopeId - id of the scope where the style has to be removed
 * @param styles - list of the style elements that have to be modified
 * @param removeUsageCallback - function used for style removal depending on style type
 */
function removeInactiveStyles(
    scopeId: string,
    styles: HTMLStyleElement[],
    removeUsageCallback: (style: HTMLStyleElement) => void
): void{  
  styles
    .filter((styleElement) => !(styleElement.dataset[dataAppStylesKey] === scopeId))
    .forEach((style) => {
      removeUsageCallback(style);
      if (getStyleUsageCount(style) === 0) {
        style.remove();
      }
    });
}

```

### File: angular-utils/style/src/utils/app-styles-scope.utils.ts

```ts

import { dataMfeElementAttribute, dataNoPortalLayoutStylesAttribute, dataStyleIdAttribute, dataStyleIsolationAttribute, isCssScopeRuleSupported} from "@onecx/angular-utils";
import { 
    dataAppStylesAttribute
} from "../index";

/**
 * Get the style element with application styles based on a scope.
 * @param scopeId - scope id related to the app
 * @returns {HTMLStyleElement | null} the style element related for a given scope
 */
export function getAppStyleByScope(scopeId: string): HTMLStyleElement | null {
  return document.head.querySelector<HTMLStyleElement>(`style[${dataAppStylesAttribute}="${scopeId}"]`)
}

/**
 * Replace ":root" selector with ":scope" for a given css.
 *
 * :scope === :root if "@scope" is not used
 * :scope === top level element of the scope if "@scope" is used
 * @param css - css text to transform
 * @returns {string} css with replaced selector
 */
export function replaceRootWithScope(css: string): string {
  return css.replaceAll(':root', ':scope')
}

/**
 * Replace "html" and ":root" selector with ":scope" for a given css.
 *
 * :scope === :root if "@scope" is not used
 * :scope === top level element of the scope if "@scope" is used
 * @param css - css text to transform
 * @returns {string} css with replaced selector
 */
export function replaceRootAndHtmlWithScope(css: string): string {
  return replaceRootWithScope(css.replaceAll('html',':scope'))
}

/**
 * Creates a string with application scoped css. The scope will apply the css to the element with given scopeId that has dataNoPortalLayoutStylesAttribute or dataMfeElementAttribute and will be available until element with dataStyleIsolationAttribute.
 * @param css - css for scoping
 * @param scopeId - scope id for scoping
 * @returns {string} css scoped by the given id
 */
export function createApplicationScopedCss(css: string, scopeId: string): string {
  const isScopeSupported = isCssScopeRuleSupported()
  const scopeSelector = `[${dataStyleIdAttribute}="${scopeId}"]:is([${dataNoPortalLayoutStylesAttribute}], [${dataMfeElementAttribute}])`
  // Apply styles to all v6 elements and the MFE
  return isScopeSupported
    ? `
      @scope(${scopeSelector}) to ([${dataStyleIsolationAttribute}]) {
        ${replaceRootAndHtmlWithScope(css)}
          }
      `
    : `
      @supports (@scope(${scopeSelector}) to ([${dataStyleIsolationAttribute}])) {
        ${replaceRootAndHtmlWithScope(css)}
          }
      `
}

```

### File: angular-utils/style/src/utils/app-styles-usage.utils.ts

```ts

import { dataMfeStylesKey, dataRcStylesKey, dataRcStylesStart } from '../index'
/**
 * Returns the count of MFEs and RCs using the style element.
 * @param styleElement - style element
 * @returns {number} number of MFEs and RCs using the style element
 */
export function getStyleUsageCount(styleElement: HTMLStyleElement): number {
  let usages = 0
  if (isStyleUsedByMfe(styleElement)) usages++
  usages += getStyleUsageCountForRc(styleElement)
  return usages
}

/**
 * Returns formatted string that reflects property name with given slot name
 * @param slotName - name of the slot hosting
 * @returns {string} - changed slot name which is a property name
 */
export function slotNameToPropertyName(slotName: string) : string{
  return slotName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

/**
 * Check if style is used by MFE.
 * @param styleElement - style element to check
 * @returns {boolean} if style is used by the MFE
 */
export function isStyleUsedByMfe(styleElement: HTMLElement): boolean {
  return styleElement.dataset[dataMfeStylesKey] !== undefined
}

/**
 * Returns the count of RCs using a given style element.
 * @param styleElement - style element to check
 * @returns {number} the count of RCs using a given style element
 */
export function getStyleUsageCountForRc(styleElement: HTMLStyleElement): number {
  return Object.keys(styleElement.dataset).filter((key) => key.startsWith(dataRcStylesStart)).length
}

/**
 * Returns all style elements with styles registered with attribute key
 * @param key - style attribute key associated with html element style
 * @returns {HTMLStyleElement[]} - a list of html elements with matching attribute key
 */
export function getAllStylesUsedByKey(key: string): HTMLStyleElement[] {
  return Array.from(document.head.querySelectorAll<HTMLStyleElement>(`style[${key}]`))
}

/**
 * Removes the MFE from list of users of the style element.
 * @param styleElement - style element to modify
 */
export function removeMfeUsageFromStyle(styleElement: HTMLStyleElement) {
    delete styleElement.dataset[dataMfeStylesKey]
}

/**
 * Removes the RC from list of users of the style element.
 * @param styleElement - style element to modify
 * @param slotName - name of the slot hosting the RC
 */
export function removeRcUsageFromStyle(styleElement: HTMLStyleElement, slotName: string) {
    delete styleElement.dataset[slotNameToPropertyName(dataRcStylesKey(slotName))]
}

/**
 * Registers the RC as a user of the style element.
 * @param styleElement - style element to register for
 * @param slotName - name of the slot hosting the RC
 */
export function useStyleForRc(styleElement: HTMLStyleElement, slotName: string) {
  styleElement.dataset[slotNameToPropertyName(dataRcStylesKey(slotName))] = ''
}

/**
 * Registers the MFE as a user of the style element.
 * @param styleElement - style element to modify
 */
export function useStyleForMfe(styleElement: HTMLStyleElement) {
  styleElement.dataset[dataMfeStylesKey] = ''
}


```

### File: angular-utils/style/src/utils/dom-style.utils.ts

```ts

import { dataAppStylesKey, useStyleForMfe, useStyleForRc } from '../index'

/**
 * Creates new style sheet with given content and optional dataset attributes and appends it to the document head.
 * @param content - content for new style sheet
 * @param datasetAttributes - attributes to add to new style element
 * @returns {HTMLStyleElement} new style element
 */
export function addStyleToHead(content: string, datasetAttributes?: { [key: string]: string }): HTMLStyleElement {
  const style = document.createElement('style')

  style.appendChild(document.createTextNode(content))
  if (datasetAttributes) {
    Object.keys(datasetAttributes).forEach((key) => {
      style.dataset[key] = datasetAttributes[key]
    })
  }
  document.head.appendChild(style)
  return style
}

/**
 * Replaces content of a given style element.
 * @param selectorOrElement - selector for a style element or exact element
 * @param content - content to be put in the style element
 * @returns {HTMLStyleElement} updated style element
 */
export function replaceStyleContent(
  selectorOrElement: string | HTMLStyleElement,
  content: string
): HTMLStyleElement | null {
  if (selectorOrElement instanceof HTMLStyleElement) {
    selectorOrElement.textContent = content
    return selectorOrElement
  }

  const styleElement = document.head.querySelector<HTMLStyleElement>(selectorOrElement)
  if (styleElement) styleElement.textContent = content
  return styleElement
}

/**
 * Creates new style element and register MFE or RC as the user of it
 * @param scopeId - scope id related to the app
 * @param options - registration options
 * @returns {HTMLStyleElement} style element with MFE or RC registered
 */
export function createStyleUsedByMfeRc(
    scopeId: string,
    options: {type:'rc'; slotName: string} | {type: 'mfe'}
): HTMLStyleElement {    
    const element = addStyleToHead('', {
        [dataAppStylesKey]: scopeId,
    });

    if (options.type === 'rc') {
        useStyleForRc(element, options.slotName);
    } else {
        useStyleForMfe(element);
    }

    return element;
}

```

### File: angular-utils/style/src/utils/fetch-app-css.util.ts

```ts

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { catchError, firstValueFrom, mergeMap, of, throwError } from 'rxjs'
import { Location } from '@angular/common'

/**
 * Fetches the css for an application.
 * @param http - http client for making requests
 * @param appUrl - url of the application used for making requests
 * @returns {Promise<string | undefined | null>} application css content
 */
export async function fetchAppCss(http: HttpClient, appUrl: string): Promise<string | undefined | null> {
  return await firstValueFrom(
    http
      .get(Location.joinWithSlash(appUrl, 'styles.css'), {
        headers: createCssRequestHeaders(),
        observe: 'response',
        responseType: 'text',
      })
      .pipe(
        mergeMap((response) => {
          if (!isResponseValidCss(response)) {
            return throwError(
              () =>
                new Error(
                  `Application returned different content type than text/css: ${response.headers.get('Content-Type')}. Please, make sure that the application exposes the styles.css file.`
                )
            )
          }

          return of(response.body)
        }),
        catchError((error: Error) => {
          console.error(
            `Error while loading app css for ${appUrl}: ${error.message}.  Please, make sure that the application exposes the styles.css file in your application.`
          )
          return of(undefined)
        })
      )
  )
}

/**
 * Creates HttpHeaders for Css request.
 */
export function createCssRequestHeaders() {
  return new HttpHeaders({}).set('Accept', 'text/css')
}

/**
 * Returns if response is valid css.
 * @param response - response to validate
 * @returns {boolean} if response is valid css
 */
export function isResponseValidCss<T>(response: HttpResponse<T>) {
  return response.headers.get('Content-Type')?.includes('text/css')
}

```

## Folder: angular-utils/theme/primeng (6 files)

### File: angular-utils/theme/primeng/jest.config.ts

```ts

/* eslint-disable */
import { createReportsConfig } from '../../../../jest-config-factory'

export default {
  ...createReportsConfig('angular-utils/theme'),
  displayName: 'angular-utils/theme',
  preset: '../../jest.preset.js',
  testMatch: ['<rootDir>/src/lib/**/*.spec.ts', '<rootDir>/guards/**/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.(mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
    '^.+\\.tsx?$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: { metaObjectReplacement: { url: 'https://www.url.com' } },
            },
          ],
        },
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
}


```

### File: angular-utils/theme/primeng/ng-package.json

```json

{
  "$schema": "../../../../node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "src/index.ts"
  }
}


```

### File: angular-utils/theme/primeng/tsconfig.json

```json

{
  "compilerOptions": {
    "target": "es2022",
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
      "path": "./tsconfig.lib.json"
    },
    {
      "path": "./tsconfig.spec.json"
    }
  ],
  "extends": "../../../../tsconfig.base.json",
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}


```

### File: angular-utils/theme/primeng/tsconfig.lib.json

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "declaration": true,
    "declarationMap": true,
    "inlineSources": true,
    "types": ["node"]
  },
  "exclude": ["src/**/*.spec.ts", "src/test-setup.ts", "jest.config.ts", "src/**/*.test.ts"],
  "include": ["src/**/*.ts"]
}


```

### File: angular-utils/theme/primeng/tsconfig.lib.prod.json

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
  },
  "exclude": ["jest.config.ts"]
}


```

### File: angular-utils/theme/primeng/tsconfig.spec.json

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "module": "commonjs",
    "target": "es2016",
    "types": ["jest", "node"]
  },
  "files": ["src/test-setup.ts"],
  "include": ["jest.config.ts", "src/**/*.test.ts", "src/**/*.spec.ts", "src/**/*.d.ts"]
}


```

## Folder: angular-utils/theme/primeng/src (2 files)

### File: angular-utils/theme/primeng/src/index.ts

```ts

// preset
export * from './preset/custom-preset'
export * from './preset/preset-variables'

// services
export * from './services/custom-use-style.service'
export * from './services/theme-config.service'

// utils
export * from './utils/application-config'
export * from './utils/create-color-palette'
export * from './utils/normalize-preset-keys.utils'


```

### File: angular-utils/theme/primeng/src/test-setup.ts

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

## Folder: angular-utils/theme/primeng/src/preset/component-presets (10 files)

### File: angular-utils/theme/primeng/src/preset/component-presets/autocomplete.ts

```ts

export default {
  autocomplete: {
    dropdown: {
      borderColor: '{primary.color}',
      hoverBorderColor: '{primary.hoverColor}'
    },
    option: {
      focusBackground: '{surface.50}',
      selectedBackground: '{list.option.selectedBackground}',
      selectedFocusBackground: '{list.option.selectedFocusBackground}'
    },
    colorScheme: {
      light: {
        dropdown: {
          background: '{primary.color}',
          hoverBackground: '{primary.hoverColor}',
          color: '{surface.0}',
          hoverColor: '{surface.0}',
        }
      }
    }
}}


```

### File: angular-utils/theme/primeng/src/preset/component-presets/breadcrumb.ts

```ts

export default {
  breadcrumb: {
    root: {
      padding: '0.75rem',
    },
    item: {
      color: '{general.textSecondaryColor}',
      hoverColor: '{general.textSecondaryColor}',
      icon: {
        color: '{general.textSecondaryColor}',
        hoverColor: '{general.textSecondaryColor}',
      },
    },
    separator: {
      color: '{general.textSecondaryColor}',
    },
  },
}


```

### File: angular-utils/theme/primeng/src/preset/component-presets/button.ts

```ts

export default {
  button: {
    root: {
      paddingY: '0.643rem',
    },
  },
}


```

### File: angular-utils/theme/primeng/src/preset/component-presets/datatable.ts

```ts

export default {
    datatable: {
        headerCell: {
            background: '{surface.0}',
            hoverBackground: '{surface.50}', 
            selectedBackground: '{surface.50}'
        },
        columnTitle: {
            fontWeight: '500'
        }
    }
}

```

### File: angular-utils/theme/primeng/src/preset/component-presets/dialog.ts

```ts

export default {
    dialog: {
        footer: {
          padding: '.75rem 1.25rem .75rem 1.25rem'
        },
        title: {
            fontWeight: '500'
        }
    }
}

```

### File: angular-utils/theme/primeng/src/preset/component-presets/fieldset.ts

```ts

export default {
    fieldset: {
        legend: {
            fontWeight: '500'
        }
    }
}

```

### File: angular-utils/theme/primeng/src/preset/component-presets/fileupload.ts

```ts

export default {
  fileupload: {
    root: {
      borderRadius: '{border.radius.sm}',
      // border width is set to only add additional border between header and content
    },
    header: {
      padding: '0.75rem',
      background: '{surface.50}',
      borderWidth: '0 0 1px 0',
    },
  },
}


```

### File: angular-utils/theme/primeng/src/preset/component-presets/floatlabel.ts

```ts

export default {
  floatlabel: {
    root: {
      fontWeight: '400',
    },
  },
}


```

### File: angular-utils/theme/primeng/src/preset/component-presets/inputtext.ts

```ts

export default {
  inputtext: {
    root: {
      color: '{general.textColor}',
      disabledBackground: '{formField.background}',
      disabledColor: '{general.textColor}',
      borderColor: '{surface.300}',
    },
  },
}


```

### File: angular-utils/theme/primeng/src/preset/component-presets/paginator.ts

```ts

export default {
    paginator:  {
        navButton: {
            hoverBackground: '{surface.50}'
        },
        currentPageReport: {
            color: '{general.textSecondaryColor}'
        } 
    }
}

```

## Folder: angular-utils/theme/primeng/src/preset (3 files)

### File: angular-utils/theme/primeng/src/preset/custom-preset.ts

```ts

import { definePreset } from '@primeng/themes'
import Aura from '@primeng/themes/aura'
import presetVariables from './preset-variables'
import { normalizeKeys } from '../utils/normalize-preset-keys.utils'

export const CustomPreset = definePreset(normalizeKeys(Aura), normalizeKeys(presetVariables))
CustomPreset.semantic.colorScheme.dark = {}
export default CustomPreset


```

### File: angular-utils/theme/primeng/src/preset/default-theme-variables.ts

```ts

export default {
  font: {
    fontFamily: 'Ubuntu, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
    fontSize: null,
  },
  topbar: {
    topbarBgColor: '#0D3650',
    topbarItemTextColor: '#ffffff',
    topbarTextColor: '#ffffff',
    topbarLeftBgColor: '#0D3650',
    topbarItemTextHoverBgColor: '#262626',
    topbarMenuButtonBgColor: 'rgb(255 0 68)',
    logoColor: '#ffffff',
  },
  sidebar: {
    menuTextColor: '#274B5F',
    menuBgColor: ' #fdfeff',
    menuItemTextColor: ' #515c66',
    menuItemBgColor: null,
    menuItemHoverBgColor: '#d0021b',
    menuActiveItemTextColor: '#515c66',
    menuActiveItemBgColor: 'rgba(0, 0, 0, 0.04)',
    menuInlineBorderColor: null,
  },
  general: {
    primaryColor: '#274B5F',
    secondaryColor: '#1C4257',
    textColor: 'rgba(0, 0, 0, 0.87)',
    textSecondaryColor: '#262626',
    bodyBgColor: '#f7f7f7',
    contentBgColor: '#ffffff',
    contentAltBgColor: null,
    overlayContentBgColor: '#ffffff',
    hoverBgColor: '#ad1457',
    solidSurfaceTextColor: '#ffffff',
    dividerColor: '#e4e4e4',
    buttonHoverBg: '#ad1457',
    buttonActiveBg: 'rgba(39, 75, 95, 0.68)',
    dangerButtonBg: '#D32F2F',
    infoMessageBg: '#b3e5fc',
    successMessageBg: '#c8e6c9',
    warningMessageBg: '#ffecb3',
    errorMessageBg: '#ffcdd2',
  },
}


```

### File: angular-utils/theme/primeng/src/preset/preset-variables.ts

```ts

import { createPalette, standardColorAdjustment } from '../utils/create-color-palette'

import defaultVariables from './default-theme-variables'
import breadcrumb from './component-presets/breadcrumb'
import autocomplete from './component-presets/autocomplete'
import button from './component-presets/button'
import datatable from './component-presets/datatable'
import dialog from './component-presets/dialog'
import fieldset from './component-presets/fieldset'
import floatlabel from './component-presets/floatlabel'
import inputtext from './component-presets/inputtext'
import paginator from './component-presets/paginator'
import fileupload from './component-presets/fileupload'

// Structure of this object has to match https://github.com/primefaces/primeuix/tree/main/packages/themes/src/presets/aura
export default {
  components: {
    ...autocomplete,
    ...breadcrumb,
    ...button,
    ...datatable,
    ...dialog,
    ...fieldset,
    ...fileupload,
    ...floatlabel,
    ...inputtext,
    ...paginator,
  },
  semantic: {
    // OneCX semantic variables extension
    extend: {
      onecx: {
        ...defaultVariables.font,
        ...defaultVariables.topbar,
        ...defaultVariables.sidebar,
        ...defaultVariables.general,
        errorColor: '#b00020',
        animationDuration: '0.2s',
      },
    },
    transitionDuration: '0.2s',
    focusRing: {
      width: '1px',
      style: 'solid',
      color: '{primary.color}',
      offset: '2px',
      shadow: 'none',
    },
    disabledOpacity: '0.6',
    iconSize: '1rem',
    anchorGutter: '2px',
    primary: {
      ...createPalette(defaultVariables.general.primaryColor, standardColorAdjustment),
    },
    formField: {
      // INFO: --input-padding from dev env has equal values 0.75rem 0.75rem
      paddingX: '0.75rem',
      // paddingY: '0.5rem',
      paddingY: '0.75rem', // equal to paddingX
      // INFO: Tokens for new small form fields
      sm: {
        fontSize: '0.875rem',
        paddingX: '0.625rem',
        // paddingY: '0.375rem',
        paddingY: '0.625rem', // equal to paddingX
      },
      // INFO: Tokens for new large form fields
      lg: {
        fontSize: '1.125rem',
        paddingX: '0.875rem',
        // paddingY: '0.625rem',
        paddingY: '0.875rem', // equal to paddingX
      },
      borderRadius: '{border.radius.md}',
      focusRing: {
        width: '0',
        style: 'none',
        color: 'transparent',
        offset: '0',
        shadow: 'none',
      },
      transitionDuration: '{transition.duration}',
    },
    // INFO: Lists in all select and list components (except for tree select and menus)
    list: {
      // INFO: List container doesn't seem to have padding in our apps
      // padding: '0.25rem 0.25rem',
      // TODO: Do we set a padding here and reduce the padding of the individual items?
      padding: '0',
      // INFO: new variable, gap between each item in list
      gap: '2px',
      header: {
        // INFO: --input-list-header-padding used
        //padding: '0.5rem 1rem 0.25rem 1rem',
        padding: '0.75rem',
      },
      option: {
        // INFO: --input-list-item-padding used
        // padding: '0.25rem 0.25rem',
        // TODO: Do we reduce this because of the newly introduced gap?
        padding: '0.75rem 0.75rem',
        // INFO: --input-list-item-border-radius used
        // borderRadius: '{border.radius.sm}',
        // TODO: If we decide to add padding to list container, a little bit of border radius would look great
        borderRadius: 0,
      },
      optionGroup: {
        // INFO: --submenu-header-padding used
        // padding: '0.5rem 0.75rem',
        padding: '0.75rem',
        // INFO: --submenu-header-font-weight used (400) -> no difference to weight of normal list item
        // TODO: Decide if we want to keep 600 or revert back to 400
        fontWeight: '600',
      },
    },
    mask: {
      // INFO: No variable for this, so probably was default PrimeNG value
      transitionDuration: '0.15s',
    },
    content: {
      // INFO: --border-radius is used
      borderRadius: '{border.radius.md}',
    },
    // INFO: All menu components
    navigation: {
      list: {
        // INFO: --vertical-menu-padding used
        // padding: '0.25rem 0.25rem',
        padding: '0.5rem 1.25rem',
        // INFO: new variable, gap between each item in list
        gap: '2px',
      },
      item: {
        // INFO: --menuitem-padding used
        // padding: '0.5rem 0.75rem',
        padding: '0.75rem 0.75rem',
        // INFO: --menuitem-border-radius used
        // borderRadius: '{border.radius.sm}',
        borderRadius: '0',
        // INFO: new variable, gap between items in a single item, e.g., icon and text
        gap: '0.5rem',
      },
      submenuLabel: {
        // INFO: --submenu-header-padding used
        // padding: '0.5rem 0.75rem',
        padding: '0.75rem',
        // INFO: --submenu-header-font-weight used
        // fontWeight: '600',
        fontWeight: '400',
      },
      submenuIcon: {
        // INFO: --menuitem-submenu-icon-font-size used
        size: '0.875rem',
      },
    },
    overlay: {
      // INFO: Components allowing selection
      select: {
        // INFO: --border-radius is used
        // TODO: Can be borderRadius: 4px
        // borderRadius: '{border.radius.md}',
        borderRadius: '{border.radius.sm}',
        // INFO: --input-overlay-shadow is used
        // shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        shadow:
          '0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12)',
      },
      // INFO: Components that pop up (p-password, tooltip)
      popover: {
        // INFO: --border-radius is used
        // TODO: Can be borderRadius: 4px
        // borderRadius: '{border.radius.md}',
        borderRadius: '{border.radius.sm}',
        // INFO: for tooltip its 0.5rem
        // INFO: for overlaypanel and password 0.75rem
        padding: '0.75rem',
        // INFO: --input-overlay-shadow used
        // shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        shadow:
          '0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12)',
      },
      // INFO: The only usage of this token is related to p-dialog
      modal: {
        // INFO: --border-radius is used
        // TODO: Can be borderRadius: 4px
        // borderRadius: '{border.radius.md}',
        borderRadius: '{border.radius.sm}',
        // INFO: --dialog-header-padding is used and --dialog-content-padding is used
        padding: '1.25rem',
        // INFO: --overlay-container-shadow is used
        // shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        shadow:
          '0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12)',
      },
      // INFO: All menu components
      navigation: {
        // INFO: --overlay-menu-shadow is used
        // shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        shadow: '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)',
      },
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f7f8f9',
          100: '#dadee3',
          200: '#bcc3cd',
          300: '#9fa9b7',
          400: '#818ea1',
          500: '#64748b',
          600: '#556376',
          700: '#465161',
          800: '#37404c',
          900: '#282e38',
          950: '#191d23',
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{onecx.button.hover.bg}', // button-hover-bg
          activeColor: '{onecx.button.active.bg}', // button-active-bg
          // if buttonActiveBg is not set, it should be primary.400
        },
        highlight: {
          // --highlight-bg is used, rgba($primaryColor, 0.12);
          background: '{primary.100}',
          // $highlightFocusBg is used, rgba($primaryColor, 0.24) !default;
          focusBackground: '{primary.200}',
          // primaryColor is used for highlightTextColor
          color: '{primary.color}',
          // textColor is used for $inputListItemTextFocusColor
          focusColor: '{text.color}',
        },
        mask: {
          // INFO: --maskbg used
          // INFO: Mask applied on image, speedDial with mask prop. Determines what color is the mask
          // background: 'rgba(0,0,0,0.4)',
          background: 'rgba(0, 0, 0, 0.32)',
          // INFO: Color of any text content inside a mask?
          color: '{surface.200}',
        },
        // TODO: Consider using theme variable for surface value so background and borders are set correctly
        formField: {
          // INFO: dev -> on focus primary color is used
          focusBorderColor: '{primary.color}',

          // TODO: When button is invalid, hover/focus is applied for border
          // INFO: $errorColor color is used for invalid border
          // invalidBorderColor: '{red.400}',
          invalidBorderColor: '{onecx.error.color}', // using $errorCode

          // INFO: $errorColor color is used for invalid border
          // invalidPlaceholderColor: '{red.600}',
          invalidPlaceholderColor: '{onecx.error.color}', // using $errorCode

          // INFO: --input-bg used input background
          // TODO: Check with surface value
          // TODO: Can be background: '#ffffff'
          background: '{surface.0}',
          // INFO: --input-filled-bg used input background
          // TODO: Check with surface value
          // TODO: Can be filledBackground: '#f5f5f5'
          filledBackground: '{surface.50}',
          // INFO: --input-filled-hover-bg used input background
          // TODO: Check with surface value
          // TODO: Can be filledHoverBackground: '#ececec'
          filledHoverBackground: '{surface.50}',
          // INFO: --input-filled-focus-bg used input background
          // TODO: Check with surface value
          // TODO: Can be filledFocusBackground: '#dcdcdc'
          filledFocusBackground: '{surface.50}',

          // INFO: no variable for disabled background of form fields, opacity for input is set, opacity: var(--disabled-opacity);
          // TODO: Check with surface value
          // TODO: Can be disabledBackground: DECIDE_VALUE
          // disabledBackground: '{surface.200}',
          disabledBackground: '{surface.100}', // lighter color than default
          // INFO: no variable for disabled color of form fields, opacity for input is set, opacity: var(--disabled-opacity);
          // TODO: Check with surface value
          // TODO: Can be disabledColor: DECIDE_VALUE
          // disabledColor: '{surface.500}',
          disabledColor: '{surface.400}', // lighter color than default

          // INFO: --emphasis-low is used for default input border color
          // TODO: Check with surface value
          // TODO: Can be borderColor: rgba(0, 0, 0, 0.38)
          // borderColor: '{surface.300}',
          borderColor: '{surface.200}', // lighter color than default
          // INFO: --emphasis-high is used for default input border color
          // TODO: Check with surface value
          // TODO: Can be hoverBorderColor: rgba(0, 0, 0, 0.87)
          hoverBorderColor: '{surface.400}',

          // INFO: --emphasis-high is used for default input text color
          // TODO: Check with surface value
          // TODO: Can be color: rgba(0, 0, 0, 0.87)
          color: '{surface.700}',
          // INFO: --emphasis-medium is used for placeholder text color
          // TODO: Check with surface value
          // TODO: Can be placeholderColor: rgba(0, 0, 0, 0.6)
          placeholderColor: '{surface.500}',
          // INFO: --emphasis-medium is used for icon color
          // TODO: Check with surface value
          // TODO: Can be iconColor: rgba(0, 0, 0, 0.6)
          iconColor: '{surface.400}',
          // INFO: no variable for shadow, no shadow seems to be there for form fields
          shadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)',

          // INFO: --emphasis-medium is used for float label text color
          // TODO: Check with surface value
          // TODO: Can be floatLabelColor: rgba(0, 0, 0, 0.6)
          floatLabelColor: '{surface.500}',
          // INFO: dev -> on focus primary color is used
          // floatLabelFocusColor: '{primary.600}',
          floatLabelFocusColor: '{primary.color}',
          // INFO: No clue what it is
          floatLabelActiveColor: '{surface.500}',
          // INFO: $errorColor color is used for invalid border
          floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
        },
        text: {
          color: '{onecx.text.color}',
          // INFO: textColor used for inplaceTextHoverColor, toggleButtonTextHoverColor
          hoverColor: '{onecx.text.secondary.color}',
          // mutedColor and hovermuted are not available in the theme
          mutedColor: '{surface.500}',
          hoverMutedColor: '{surface.600}',
        },
        content: {
          background: '{onecx.content.bg.color}',
          hoverBackground: '{onecx.hover.bg.color}',
          borderColor: '{surface.100}',
          color: '{text.color}',
          hoverColor: '{text.hover.color}',
        },
        overlay: {
          select: {
            // INFO: --input-list-bg used
            // TODO: Check with surface value
            // TODO: Can be background: '#ffffff'
            background: '{surface.0}',
            // INFO: --input-overlay-border used
            // INFO: border: 0 none
            // TODO: Should border be none or should overlay have a border?
            borderColor: '{surface.200}',
            // INFO: --text-color used
            color: '{text.color}',
          },
          popover: {
            // INFO: --panel-content-bg used
            // TODO: Check with surface value
            // TODO: Can be background: '#ffffff'
            background: '{surface.0}',
            // INFO: --panel-content-bg used
            // INFO: border: 0 none
            // TODO: Should border be none or should overlay have a border?
            borderColor: '{surface.200}',
            // INFO: --text-color used
            color: '{text.color}',
          },
          modal: {
            // INFO: --dialog-header-bg, dialog-content-bg used
            // INFO: Can be background: '#ffffff'
            background: '{surface.0}',
            // INFO: --overlay-content-border used
            // INFO: border: 0 none
            // TODO: Should border be none or should overlay have a border?
            borderColor: '{surface.200}',
            // INFO: --text-color used
            color: '{text.color}',
          },
        },
        // INFO: Lists in all select and list components (except for tree select and menus)
        list: {
          option: {
            option: {
              selectedColor: '{primary.color}',
              selectedFocusColor: '{primary.color}',
            },
            // INFO: --input-list-item-hover-bg used
            // INFO: Could be focusBackground: 'rgba(0, 0, 0, 0.04)'
            focusBackground: '{surface.100}',
            // INFO: --highlight-bg used
            selectedBackground: '{highlight.background}',
            // INFO: --highlight-bg used
            selectedFocusBackground: '{highlight.focus.background}',
            // INFO: --text-color used
            color: '{text.color}',
            // INFO: --text-color used
            // TODO: Maybe it makes sense to leave hover color?
            focusColor: '{text.hover.color}',
            // INFO: --primary-color used
            selectedColor: '{highlight.color}',
            // INFO: --primary-color used
            selectedFocusColor: '{highlight.focus.color}',
            icon: {
              // INFO: --text-secondary-color used
              // TODO: Decide on secondary color or surface
              color: '{surface.400}',
              // INFO: --text-secondary-color used
              // TODO: Decide on secondary color or surface
              focusColor: '{surface.500}',
            },
          },
          optionGroup: {
            // INFO: --submenu-header-bg used
            // INFO: Could be background: '#ffffff'
            background: '{surface.0}',
            // INFO: --text-secondary-color used
            // TODO: Decide on secondary color or text.muted
            color: '{text.muted.color}',
          },
        },
        // INFO: All menu components
        navigation: {
          item: {
            // INFO: --menuitem-focus-bg, --menuitem-hover-bg used
            // INFO: Could be focusBackground: 'rgba(0, 0, 0, 0.04)'
            focusBackground: '{surface.100}',
            // INFO: --menuitem-active-bg, --menuitem-active-focus-bg used
            // INFO: Could be activeBackground: 'rgba(0, 0, 0, 0.04)'
            activeBackground: '{surface.100}',
            // INFO: --text-color used
            color: '{text.color}',
            // INFO: --text-color used
            // TODO: Maybe it makes sense to leave hover color?
            focusColor: '{text.hover.color}',
            // INFO: --text-color used
            // TODO: Maybe it makes sense to leave hover color?
            activeColor: '{text.hover.color}',
            icon: {
              // INFO: --text-secondary-color used
              // TODO: Decide on secondary color or surface
              color: '{surface.400}',
              // INFO: --text-secondary-color used
              // TODO: Decide on secondary color or surface
              focusColor: '{surface.500}',
              // INFO: --text-secondary-color used
              // TODO: Decide on secondary color or surface
              activeColor: '{surface.500}',
            },
          },
          submenuLabel: {
            // INFO: --submenu-header-bg used
            // INFO: Could be background: '#ffffff'
            background: 'transparent',
            // INFO: --text-secondary-color used
            // TODO: Decide on secondary color or surface
            color: '{text.muted.color}',
          },
          submenuIcon: {
            // INFO: --text-secondary-color used
            // TODO: Decide on secondary color or surface
            color: '{surface.400}',
            // INFO: --text-secondary-color used
            // TODO: Decide on secondary color or surface
            focusColor: '{surface.500}',
            // INFO: --text-secondary-color used
            // TODO: Decide on secondary color or surface
            activeColor: '{surface.500}',
          },
        },
      },
    },
  },
}


```

## Folder: angular-utils/theme/primeng/src/services (4 files)

### File: angular-utils/theme/primeng/src/services/custom-use-style.service.spec.ts

```ts

import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { CustomUseStyle } from './custom-use-style.service'
import { DOCUMENT } from '@angular/common'
import { ReplaySubject } from 'rxjs'
import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { AppStateService, MfeInfo } from '@onecx/angular-integration-interface'
import { THEME_OVERRIDES } from '../utils/application-config'
import {
  dataNoPortalLayoutStylesAttribute,
  dataStyleIdAttribute,
  dataStyleIsolationAttribute,
  shellScopeId,
  SKIP_STYLE_SCOPING,
} from '@onecx/angular-utils'
import { REMOTE_COMPONENT_CONFIG } from '@onecx/angular-utils'
import { RemoteComponentConfig } from '@onecx/angular-utils'

class ElementMock {
  // extension
  tagName: string
  // Element data
  isConnected = false
  textContent = ''
  attribute = ''
  constructor(tagName: string) {
    this.tagName = tagName
  }

  setAttribute(attr: string, value: string) {
    this.attribute = `${attr}="${value}"`
  }
}

function removeSpacesAndNewlines(str?: string) {
  return str?.replace(/\s+/g, '')
}

jest.mock('@primeuix/utils', () => ({
  setAttributes: (element: ElementMock, attributes: Record<string, string>) => {
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
  },
}))

describe('CustomUseStyleService', () => {
  let service: CustomUseStyle
  let styleList: Array<ElementMock> = []
  let mockOverrides = {}

  const documentMock: Partial<Document> = {
    querySelector(selectors: string) {
      return styleList.find((s) => `style[${s.attribute}]` === selectors) ?? null
    },
    createElement(tagName: string) {
      return new ElementMock(tagName) as any as HTMLElement
    },
    head: {
      appendChild(node: ElementMock) {
        styleList.push(node)
        node.isConnected = true
      },
    } as HTMLHeadElement,
  }

  const configureShell = () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SKIP_STYLE_SCOPING,
          useValue: true,
        },
        {
          provide: DOCUMENT,
          useValue: documentMock,
        },
        {
          provide: THEME_OVERRIDES,
          useValue: mockOverrides,
        },
      ],
    })
    service = TestBed.inject(CustomUseStyle)
  }

  const configureRemoteComponent = () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: REMOTE_COMPONENT_CONFIG,
          useValue: new ReplaySubject<RemoteComponentConfig>(1),
        },
        {
          provide: DOCUMENT,
          useValue: documentMock,
        },
        {
          provide: THEME_OVERRIDES,
          useValue: mockOverrides,
        },
      ],
    })
    service = TestBed.inject(CustomUseStyle)
    const config = TestBed.inject(REMOTE_COMPONENT_CONFIG)
    config.next({
      appId: 'test-ui',
      productName: 'test',
      permissions: [],
      baseUrl: 'test',
    })
    return { styleId: 'test|test-ui', prefix: 'test-test-ui' }
  }

  const configureMfe = () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: documentMock,
        },
        provideAppStateServiceMock(),
        {
          provide: THEME_OVERRIDES,
          useValue: mockOverrides,
        },
      ],
    })
    service = TestBed.inject(CustomUseStyle)
    const appStateService = TestBed.inject(AppStateService)
    appStateService.currentMfe$.publish({
      appId: 'test-ui',
      productName: 'test',
    } as MfeInfo)
    return { styleId: 'test|test-ui', prefix: 'test-test-ui' }
  }

  const removeScopeRule = () => {
    delete (global as any).CSSScopeRule
  }

  const setScopeRule = () => {
    ;(global as any).CSSScopeRule = 'CSSScopeRule'
  }

  beforeEach(() => {
    setScopeRule()
  })

  afterEach(() => {
    styleList = []
    mockOverrides = {}
    removeScopeRule()
  })

  describe('for Shell', () => {
    beforeEach(() => {
      configureShell()
    })

    it('should create variables', fakeAsync(() => {
      const css = ":root{--p-primary-color: '#ababab';}"
      const expectedCss = `@scope([${dataStyleIdAttribute}="${shellScopeId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--p-primary-color: '#ababab';}}`
      service.use(css, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles', fakeAsync(() => {
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
      @scope([data-style-id="${shellScopeId}"][data-no-portal-layout-styles]) to ([data-style-isolation]) {
              ${css}
          }
      `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles when scope is not supported', fakeAsync(() => {
      removeScopeRule()
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
      @supports (@scope([data-style-id="${shellScopeId}"][data-no-portal-layout-styles]) to ([data-style-isolation])) {
              ${css}
          }
      `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create additional style element for overrides', fakeAsync(() => {
      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const overrides = TestBed.inject(THEME_OVERRIDES)
      overrides['semantic'] = {
        primaryColor: 'red',
      }
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="shell-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--p-primary-color:red;}}`
      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))
  })

  describe('for Remote Component', () => {
    let styleId: string
    let prefix: string
    beforeEach(() => {
      const config = configureRemoteComponent()
      styleId = config.styleId
      prefix = config.prefix
    })
    it('should create variables', fakeAsync(() => {
      const css = ":root{--p-primary-color: '#ababab'}"
      const expectedCss = `@scope([${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color: '#ababab'}}`

      service.use(css, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles', fakeAsync(() => {
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
            @scope([data-style-id="${styleId}"][data-no-portal-layout-styles]) to ([data-style-isolation]) {
                .p-button{display:inline-flex;color:var(--${prefix}-button-primary-color)}}
            `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles when scope is not supported', fakeAsync(() => {
      removeScopeRule()
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
            @supports (@scope([data-style-id="${styleId}"][data-no-portal-layout-styles]) to ([data-style-isolation])) {
                .p-button{display:inline-flex;color:var(--${prefix}-button-primary-color)}}
            `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create additional style element for overrides', fakeAsync(() => {
      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const overrides = TestBed.inject(THEME_OVERRIDES)
      overrides['semantic'] = {
        primaryColor: 'red',
      }
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color:red;}}`
      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))
  })

  describe('for MFE', () => {
    let styleId: string
    let prefix: string
    beforeEach(() => {
      const config = configureMfe()
      styleId = config.styleId
      prefix = config.prefix
    })
    it('should create variables', fakeAsync(() => {
      const css = ":root{--p-primary-color: '#ababab'}"
      const expectedCss = `@scope([${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color: '#ababab'}}`

      service.use(css, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles', fakeAsync(() => {
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
                  @scope([data-style-id="${styleId}"][data-no-portal-layout-styles]) to ([data-style-isolation]) {
                      .p-button{display:inline-flex;color:var(--${prefix}-button-primary-color)}}
                  `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles when scope is not supported', fakeAsync(() => {
      removeScopeRule()
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
                  @supports (@scope([data-style-id="${styleId}"][data-no-portal-layout-styles]) to ([data-style-isolation])) {
                      .p-button{display:inline-flex;color:var(--${prefix}-button-primary-color)}}
                  `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create additional style element for overrides', fakeAsync(() => {
      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const overrides = TestBed.inject(THEME_OVERRIDES)
      overrides['semantic'] = {
        primaryColor: 'red',
      }
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="test|test-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color:red;}}`
      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))
  })

  describe('overrides', () => {
    it('should accept object with overrides', fakeAsync(() => {
      const { prefix } = configureMfe()
      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const overrides = TestBed.inject(THEME_OVERRIDES)
      overrides['semantic'] = {
        primaryColor: 'red',
      }
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="test|test-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color:red;}}`
      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))

    it('should accept Promise with overrides', fakeAsync(() => {
      const overrides = Promise.resolve({
        semantic: {
          primaryColor: 'red',
        },
      })
      TestBed.configureTestingModule({
        providers: [
          {
            provide: DOCUMENT,
            useValue: documentMock,
          },
          provideAppStateServiceMock(),
          {
            provide: THEME_OVERRIDES,
            useValue: overrides,
          },
        ],
      })
      service = TestBed.inject(CustomUseStyle)
      const appStateService = TestBed.inject(AppStateService)
      appStateService.currentMfe$.publish({
        appId: 'test-ui',
        productName: 'test',
      } as MfeInfo)

      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="test|test-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--test-test-ui-primary-color:red;}}`

      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))

    it('should accept function returning object with overrides', fakeAsync(() => {
      const overrides = () => {
        return {
          semantic: {
            primaryColor: 'red',
          },
        }
      }
      TestBed.configureTestingModule({
        providers: [
          {
            provide: DOCUMENT,
            useValue: documentMock,
          },
          provideAppStateServiceMock(),
          {
            provide: THEME_OVERRIDES,
            useValue: overrides,
          },
        ],
      })
      service = TestBed.inject(CustomUseStyle)
      const appStateService = TestBed.inject(AppStateService)
      appStateService.currentMfe$.publish({
        appId: 'test-ui',
        productName: 'test',
      } as MfeInfo)

      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="test|test-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--test-test-ui-primary-color:red;}}`

      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))

    it('should accept function returning Promise with overrides', fakeAsync(() => {
      const overrides = () =>
        Promise.resolve({
          semantic: {
            primaryColor: 'red',
          },
        })
      TestBed.configureTestingModule({
        providers: [
          {
            provide: DOCUMENT,
            useValue: documentMock,
          },
          provideAppStateServiceMock(),
          {
            provide: THEME_OVERRIDES,
            useValue: overrides,
          },
        ],
      })
      service = TestBed.inject(CustomUseStyle)
      const appStateService = TestBed.inject(AppStateService)
      appStateService.currentMfe$.publish({
        appId: 'test-ui',
        productName: 'test',
      } as MfeInfo)

      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="test|test-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--test-test-ui-primary-color:red;}}`

      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))
  })

  describe('style element update', () => {
    it('should update existing style tag wih new css', fakeAsync(() => {
      const { styleId, prefix } = configureMfe()
      const css = ":root{--p-primary-color: '#ababab'}"
      const expectedCss = `@scope([${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color: '#ababab'}}`

      service.use(css, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))

      const newCss = ":root{--p-primary-color: '#aabbcc'}"
      const newExpectedCss = `@scope([${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color: '#aabbcc'}}`

      service.use(newCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(newExpectedCss))
    }))
  })
})


```

### File: angular-utils/theme/primeng/src/services/custom-use-style.service.ts

```ts

import { Inject, Injectable, Optional } from '@angular/core'
import { UseStyle } from 'primeng/usestyle'
import { AppStateService } from '@onecx/angular-integration-interface'
import { ReplaySubject } from 'rxjs'
import { THEME_OVERRIDES, ThemeOverrides } from '../utils/application-config'
import { REMOTE_COMPONENT_CONFIG, SKIP_STYLE_SCOPING } from '@onecx/angular-utils'
import { RemoteComponentConfig } from '@onecx/angular-utils'
import { toVariables } from '@primeuix/styled'
import {
  dataVariableOverrideIdAttribute,
  getScopeIdentifier,
  replacePrimengPrefix,
  scopePrimengCss,
  shellScopeId,
} from '@onecx/angular-utils'
import { replaceRootWithScope } from '@onecx/angular-utils/style'

@Injectable({ providedIn: 'any' })
export class CustomUseStyle extends UseStyle {
  constructor(
    private appStateService: AppStateService,
    @Optional() @Inject(SKIP_STYLE_SCOPING) private skipStyleScoping?: boolean,
    @Optional() @Inject(REMOTE_COMPONENT_CONFIG) private remoteComponentConfig?: ReplaySubject<RemoteComponentConfig>,
    @Optional() @Inject(THEME_OVERRIDES) private themeOverrides?: ThemeOverrides
  ) {
    super()
  }
  // PrimeNg defines CSS variables and styles globally in <style> elements
  // Each Application needs to isolate the CSS variables and styles from others
  override use(css: any, options?: any): { id: any; name: any; el: any; css: any } {
    getScopeIdentifier(this.appStateService, this.skipStyleScoping, this.remoteComponentConfig).then((scopeId) => {
      css = scopePrimengCss(replaceRootWithScope(replacePrimengPrefix(css, scopeId)), scopeId)

      options = {
        ...options,
        name: (options.name ?? '') + (scopeId === '' ? scopeId : '-' + scopeId),
      }
      super.use(css, options)
      return this.applyOverrides(scopeId)
    })
    // Result of this call is not used at the moment
    // Fake response ensures its possible to detect future usages of the result of this call
    return this.createFakeUseResponse(css, options)
  }

  private applyOverrides(scopeId: string): Promise<any> {
    if (!this.themeOverrides) return Promise.resolve()

    const overrides = Promise.resolve(
      typeof this.themeOverrides === 'function' ? this.themeOverrides() : this.themeOverrides
    )
    return overrides.then((resolvedOverrides) => {
      const variablesData = toVariables(resolvedOverrides)
      if (variablesData.value.length === 0) return

      const styleRef = this.createOrRetrieveOverrideElement(scopeId ? scopeId : shellScopeId)
      const prefixedOverrides = scopePrimengCss(
        replaceRootWithScope(replacePrimengPrefix(variablesData.css, scopeId)),
        scopeId
      )
      styleRef.textContent = prefixedOverrides
      // Always make sure it is the last child of the document head
      this.document.head.appendChild(styleRef)
    })
  }

  private createOrRetrieveOverrideElement(overrideId: string): Element {
    const styleRef =
      this.document.querySelector(`style[${dataVariableOverrideIdAttribute}="${overrideId}"]`) ||
      this.document.createElement('style')
    if (!styleRef.isConnected) {
      styleRef.setAttribute(`${dataVariableOverrideIdAttribute}`, overrideId)
    }
    return styleRef
  }

  private createFakeUseResponse(css: any, options: any) {
    const returnObject: {
      id: any
      css: any
      name: any
      el: any
    } = {
      id: options.id ?? undefined,
      css: css,
      name: undefined,
      el: undefined,
    }

    Object.defineProperties(returnObject, {
      name: {
        get() {
          console.error('Unexpected read of CustomUseStyle.use return value name')
          return undefined
        },
      },
      el: {
        get() {
          console.error('Unexpected read of CustomUseStyle.use return value el')
          return undefined
        },
      },
    })
    return returnObject
  }

  private isVariables(cssName: string) {
    return cssName.endsWith('-variables')
  }

  private isStyle(cssName: string) {
    return !this.isVariables(cssName)
  }
}


```

### File: angular-utils/theme/primeng/src/services/theme-config.service.spec.ts

```ts

import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { ThemeConfigService } from './theme-config.service'
import { ThemeService } from '@onecx/angular-integration-interface'
import { FakeTopic } from '@onecx/accelerator'
import { PrimeNG } from 'primeng/config'
import defaultThemeVariables from '../preset/default-theme-variables'
import { SKIP_STYLE_SCOPING } from '@onecx/angular-utils'

describe('ThemeConfigService', () => {
  let service: ThemeConfigService
  const theme = {
    id: 'my-test-theme',
    properties: {
      general: {
        'primary-color': '#ababab',
      },
      font: {},
      topbar: {},
      sidebar: {},
    },
  }

  beforeEach(() => {
    const themeServiceMock = {
      currentTheme$: new FakeTopic(),
    }

    TestBed.configureTestingModule({
      providers: [
        ThemeConfigService,
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: SKIP_STYLE_SCOPING, useValue: true },
      ],
    })

    service = TestBed.inject(ThemeConfigService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should subscribe to currentThemeTopic$', fakeAsync(() => {
    const themeService = TestBed.inject(ThemeService)
    const spy = jest.spyOn(service, 'applyThemeVariables')

    themeService.currentTheme$.publish(theme)
    tick(100)
    expect(spy).toHaveBeenCalledWith(theme)
  }))

  it('should represent old values in the new theme configuration', fakeAsync(() => {
    const themeService = TestBed.inject(ThemeService)
    const primeng = TestBed.inject(PrimeNG)
    const spy = jest.spyOn(primeng, 'setThemeConfig')

    themeService.currentTheme$.publish(theme)
    tick(100)

    const args = spy.mock.calls.pop()
    expect((args?.[0] as any).theme.preset.semantic.primary['500']).toEqual(theme.properties.general['primary-color'])
    expect((args?.[0] as any).theme.preset.semantic.extend.onecx.topbar.bg.color).toEqual(
      defaultThemeVariables.topbar.topbarBgColor
    )
  }))
})


```

### File: angular-utils/theme/primeng/src/services/theme-config.service.ts

```ts

import { ENVIRONMENT_INITIALIZER, Injectable, inject } from '@angular/core'
import { ThemeService } from '@onecx/angular-integration-interface'
import { Theme as OneCXTheme } from '@onecx/integration-interface'
import { Base } from 'primeng/base'
import { PrimeNG } from 'primeng/config'
import ThemeConfig from '../utils/theme-config'
import { CustomUseStyle } from './custom-use-style.service'
import { UseStyle } from 'primeng/usestyle'
import { Theme } from '@primeuix/styled'
import { mergeDeep } from '@onecx/angular-utils'

export function provideThemeConfigService() {
  Theme.clearLoadedStyleNames()
  Base.clearLoadedStyleNames()
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory() {
        return () => inject(ThemeConfigService)
      },
    },
    ThemeConfigService,
    {
      provide: UseStyle,
      useClass: CustomUseStyle,
    },
  ]
}

@Injectable({
  providedIn: 'root',
})
export class ThemeConfigService {
  constructor(
    private themeService: ThemeService,
    private primeNG: PrimeNG
  ) {
    this.themeService.currentTheme$.subscribe((theme) => {
      this.applyThemeVariables(theme)
    })
  }

  async applyThemeVariables(oldTheme: OneCXTheme): Promise<void> {
    const oldThemeVariables = oldTheme.properties
    const themeConfig = new ThemeConfig(oldThemeVariables)
    const preset = await (await import('../preset/custom-preset')).CustomPreset
    this.primeNG.setThemeConfig({
      theme: {
        preset: mergeDeep(preset, themeConfig.getConfig()),
        options: { darkModeSelector: false },
      },
    })
  }
}


```

## Folder: angular-utils/theme/primeng/src/utils (8 files)

### File: angular-utils/theme/primeng/src/utils/application-config.ts

```ts

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import { provideThemeConfigService } from '../services/theme-config.service'
import { InjectionToken } from '@angular/core'
import { provideAppStylesInitializer } from './app-styles-initializer'

export type ThemeOverrides = (() => Promise<any> | any) | Promise<any> | any
export const THEME_OVERRIDES = new InjectionToken<ThemeOverrides>('THEME_OVERRIDES')

export interface ThemeConfigProviderOptions {
  overrides?: ThemeOverrides
}

export function provideThemeConfig(options?: ThemeConfigProviderOptions) {
  const dynamicProviders = []
  if (options?.overrides) {
    dynamicProviders.push({
      provide: THEME_OVERRIDES,
      useValue: options.overrides,
    })
  }
  return [
    provideAnimationsAsync(),
    providePrimeNG({}),
    provideThemeConfigService(),
    provideAppStylesInitializer(),
    ...dynamicProviders,
  ]
}


```

### File: angular-utils/theme/primeng/src/utils/app-styles-initializer.ts

```ts

import { inject, provideEnvironmentInitializer } from '@angular/core'
import { SKIP_STYLE_SCOPING } from '@onecx/angular-utils'
import { getScopeIdentifier, replacePrimengPrefix } from '@onecx/angular-utils'
import { AppStateService } from '@onecx/angular-integration-interface'
import { REMOTE_COMPONENT_CONFIG } from '@onecx/angular-utils'
import { getAppStyleByScope, replaceStyleContent } from '@onecx/angular-utils/style'

export function provideAppStylesInitializer() {
  return [provideEnvironmentInitializer(updateAppStyle)]
}

async function updateAppStyle() {
  const appStateService = inject(AppStateService)
  const skipStyleScoping = inject(SKIP_STYLE_SCOPING, { optional: true }) ?? undefined
  const remoteComponentConfig = inject(REMOTE_COMPONENT_CONFIG, { optional: true }) ?? undefined
  const scopeId = await getScopeIdentifier(appStateService, skipStyleScoping, remoteComponentConfig)

  const styleElement = getAppStyleByScope(scopeId)
  if (styleElement && styleElement.textContent) {
    replaceStyleContent(styleElement, replacePrimengPrefix(styleElement.textContent, scopeId))
  }
}


```

### File: angular-utils/theme/primeng/src/utils/create-color-palette.spec.ts

```ts

import {
  ColorAdjustment,
  adjustColor,
  colorDelta,
  createPalette,
  standardColorAdjustment,
} from './create-color-palette'
interface ColorPalette {
  [key: number]: string
}
const primeNGCyanColorPalette: ColorPalette = {
  50: '#ecfeff',
  100: '#cffafe',
  200: '#a5f3fc',
  300: '#67e8f9',
  400: '#22d3ee',
  500: '#06b6d4',
  600: '#0891b2',
  700: '#0e7490',
  800: '#155e75',
  900: '#164e63',
  950: '#083344',
}

const primeNGRedColorPalette: ColorPalette = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
  950: '#450a0a',
}
const primeNGOrangeColorPalette: ColorPalette = {
  50: '#fff7ed',
  100: '#ffedd5',
  200: '#fed7aa',
  300: '#fdba74',
  400: '#fb923c',
  500: '#f97316',
  600: '#ea580c',
  700: '#c2410c',
  800: '#9a3412',
  900: '#7c2d12',
  950: '#431407',
}

const primeNGGreenColorPalette: ColorPalette = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
  950: '#052e16',
}

describe('adjustColor', () => {
  it('should lighten the color when amount is positive', () => {
    expect(adjustColor('#000000', 50)).toBe('#323232')
  })

  it('should darken the color when amount is negative', () => {
    expect(adjustColor('#ffffff', -50)).toBe('#cdcdcd')
  })

  it('should handle colors without hash', () => {
    expect(adjustColor('000000', 50)).toBe('323232')
  })

  it('should handle edge cases for color values', () => {
    expect(adjustColor('#ff0000', 300)).toBe('#ffffff')
    expect(adjustColor('#00ff00', -300)).toBe('#000000')
  })
})

describe('createPalette', () => {
  const maximumDifference = 50
  const paletteKeys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  it('should create a cyan palette with adjusted colors', () => {
    const primaryColor = primeNGCyanColorPalette[500]
    const palette = createPalette(primaryColor, standardColorAdjustment)
    paletteKeys.forEach((key: number) => {
      console.log('###', key, colorDelta(palette[key], primeNGCyanColorPalette[key]))
      expect(colorDelta(palette[key], primeNGCyanColorPalette[key])).toBeLessThanOrEqual(maximumDifference)
    })
  })

  it('should create a red color palette with adjusted colors', () => {
    const primaryColor = primeNGRedColorPalette[500]
    const palette = createPalette(primaryColor, standardColorAdjustment)
    paletteKeys.forEach((key: number) => {
      expect(colorDelta(palette[key], primeNGRedColorPalette[key])).toBeLessThanOrEqual(maximumDifference)
    })
  })

  it('should create an orange color palette with adjusted colors', () => {
    const primaryColor = primeNGOrangeColorPalette[500]
    const palette = createPalette(primaryColor, standardColorAdjustment)

    paletteKeys.forEach((key: number) => {
      expect(colorDelta(palette[key], primeNGOrangeColorPalette[key])).toBeLessThanOrEqual(maximumDifference)
    })
  })

  it('should create a green color palette with adjusted colors', () => {
    const primaryColor = primeNGGreenColorPalette[500]
    const palette = createPalette(primaryColor, standardColorAdjustment)

    paletteKeys.forEach((key: number) => {
      expect(colorDelta(palette[key], primeNGGreenColorPalette[key])).toBeLessThanOrEqual(maximumDifference)
    })
  })
  it('should calculate the euclidic distance correctly', () => {
    const hexColorCode1 = '#ff0000'
    const hexColorCode2 = '#00ff00'
    expect(colorDelta(hexColorCode1, hexColorCode2)).toBeGreaterThan(100)
  })

  it('should create a custom palette', () => {
    const primaryColor = '#4169E1'
    const adjustmentValues: number[] = [210, 195, 150, 98, 20, -25, -65, -80, -110, -140]
    const adjustments: ColorAdjustment = {
      50: adjustmentValues[0],
      100: adjustmentValues[1],
      200: adjustmentValues[2],
      300: adjustmentValues[3],
      400: adjustmentValues[4],
      500: adjustmentValues[5],
      600: adjustmentValues[6],
      700: adjustmentValues[7],
      800: adjustmentValues[8],
      900: adjustmentValues[9],
      950: adjustmentValues[10],
    }
    const exampleColorPalette: ColorPalette = Object.keys(adjustments).reduce((palette, key) => {
      palette[Number(key)] = adjustColor(primaryColor, adjustments[Number(key)])
      return palette
    }, {} as ColorPalette)

    const palette = createPalette(primaryColor, adjustments)
    console.log(palette)
    expect(palette).toEqual(exampleColorPalette)
  })

  it('should calculate the Euclidean distance between two colors in RGB space', () => {
    const color1 = '#FFFFFF'
    const color2 = '#000000'
    const result = colorDelta(color1, color2)
    expect(result).toBeCloseTo(441.67, 2)
  })

  it('should calculate the distance between two similar colors', () => {
    const color1 = '#123456'
    const color2 = '#123457'
    const result = colorDelta(color1, color2)
    expect(result).toBeCloseTo(1, 2)
  })
})


```

### File: angular-utils/theme/primeng/src/utils/create-color-palette.ts

```ts

export interface ColorAdjustment {
  [key: number]: number
}

export const standardColorAdjustment: ColorAdjustment = {
  50: 210,
  100: 195,
  200: 150,
  300: 98,
  400: 20,
  500: 0,
  600: -25,
  700: -65,
  800: -80,
  900: -110,
  950: -140,
}

/**
 * Adjusts the color by lightening or darkening it based on the provided offset.
 *
 * @param {string} color - A string representing the color in hexadecimal format (e.g., "#RRGGBB").
 * @param {number} channelOffset - A number indicating how much to lighten or darken the color.
 *                                 Positive values lighten the color, while negative values darken it.
 *                                 Valid values range from -255 to 255.
 * @returns {string} - The adjusted color in hexadecimal format.
 */
export function adjustColor(color: string, channelOffSet: number): string {
  let colorBeginsWithHash = false

  if (color[0] === '#') {
    color = color.slice(1)
    colorBeginsWithHash = true
  }

  const num = parseInt(color, 16)

  let r = (num >> 16) + channelOffSet
  if (r > 255) r = 255
  else if (r < 0) r = 0

  let g = ((num >> 8) & 0x00ff) + channelOffSet
  if (g > 255) g = 255
  else if (g < 0) g = 0

  let b = (num & 0x0000ff) + channelOffSet
  if (b > 255) b = 255
  else if (b < 0) b = 0

  return (colorBeginsWithHash ? '#' : '') + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
}

export function createPalette(primaryColor: string, adjustments: ColorAdjustment): { [key: number]: string } {
  const palette: { [key: number]: string } = {}
  Object.keys(adjustments).forEach((key) => {
    const entry = parseInt(key, 10)
    palette[entry] = adjustColor(primaryColor, adjustments[entry])
  })
  return palette
}

/**
 * Calculates the Euclidean distance between two colors in RGB space.
 *
 * @param {string} color1 - A string representing the first color in hexadecimal format (e.g., "#RRGGBB").
 * @param {string} color2 - A string representing the second color in hexadecimal format (e.g., "#RRGGBB").
 * @returns {number} - The Euclidean distance between the two colors.
 */
export function colorDelta(color1: string, color2: string): number {
  function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const color = hex.startsWith('#') ? hex.slice(1) : hex
    const bigint = parseInt(color, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return { r, g, b }
  }

  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  const delta = Math.sqrt(Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2))

  return delta
}


```

### File: angular-utils/theme/primeng/src/utils/normalize-preset-keys.utils.spec.ts

```ts

import { normalizeKeys } from './normalize-preset-keys.utils'

describe('normalizeKeys', () => {
  it('should handle keys with multiple camelCase segments and leave the value as it is', () => {
    const input = { veryDeepCamelCaseKey: '{general.textSecondaryColor}' }
    const expected = {
      very: {
        deep: {
          camel: {
            case: {
              key: '{general.textSecondaryColor}',
            },
          },
        },
      },
    }
    expect(normalizeKeys(input)).toEqual(expected)
  })

  it('should preserve the colorScheme key as-is because it is excluded', () => {
    const input = {
      colorScheme: {
        primaryColor: '#123456',
        secondaryColor: '#654321',
      },
    }

    const expected = {
      colorScheme: {
        primary: { color: '#123456' },
        secondary: { color: '#654321' },
      },
    }

    expect(normalizeKeys(input)).toEqual(expected)
  })

  it('normalizes flat camelCase keys', () => {
    const input = { hoverColor: '#fff' }
    const output = normalizeKeys(input)
    expect(output).toEqual({ hover: { color: '#fff' } })
  })

  it('normalizes nested camelCase keys', () => {
    const input = {
      hoverColor: {
        backgroundColor: '#eee',
      },
    }
    const output = normalizeKeys(input)
    expect(output).toEqual({
      hover: {
        color: {
          background: { color: '#eee' },
        },
      },
    })
  })

  it('handles mixed keys correctly', () => {
    const input = {
      hoverColor: '#fff',
      primitive: {
        baseColor: '#000',
      },
    }
    const output = normalizeKeys(input)
    expect(output).toEqual({
      hover: { color: '#fff' },
      primitive: { base: { color: '#000' } },
    })
  })
})


```

### File: angular-utils/theme/primeng/src/utils/normalize-preset-keys.utils.ts

```ts

import { isObject } from '@onecx/angular-utils'

// taken from primeng https://github.com/primefaces/primeuix/blob/main/packages/styled/src/config/index.ts#L9
const excludedKeyRegex =
  /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/i

// taken from primeng https://github.com/primefaces/primeuix/blob/main/packages/utils/src/object/methods/matchRegex.ts
function matchRegex(str: string, regex?: RegExp): boolean {
  if (regex) {
    const match = regex.test(str)

    regex.lastIndex = 0

    return match
  }
  return false
}

/**
 * Splits a camelCase string into an array of lowercase segments.
 * For example, "hoverColor" becomes ["hover", "color"].
 *
 * @param key - The camelCase string to split.
 * @returns An array of lowercase segments.
 */
function splitCamelCase(key: string): string[] {
  return key
    .replace(/([a-z])([A-Z])/g, '$1.$2')
    .toLowerCase()
    .split('.')
}

/**
 * Recursively normalizes the keys of an object by converting camelCase keys into nested objects.
 * Keys matching an excluded pattern are preserved as-is.
 * Non-object values are returned unchanged.
 *
 * @param obj - The input object to normalize.
 * @returns A new object with normalized (nested) keys.
 */
export function normalizeKeys(obj: any): Record<string, any> {
  if (!isObject(obj)) return obj

  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(obj)) {
    processKey(result, key, value)
  }

  return result
}

/**
 * Processes a key-value pair by normalizing its value and inserting it into a nested object structure.
 * If the key matches an excluded pattern, it is added to the result as-is.
 * Otherwise, the camelCase key is split into segments and the value is inserted accordingly.
 *
 * @param result - The object to insert the processed key-value pair into.
 * @param key - The key to process, potentially in camelCase.
 * @param value - The value associated with the key, which may be recursively normalized.
 */
function processKey(result: Record<string, any>, key: string, value: any) {
  const normalizedValue = normalizeKeys(value)

  if (matchRegex(key, excludedKeyRegex)) {
    result[key] = normalizedValue
    return
  }

  const decomposedKey = splitCamelCase(key)
  insertNestedValue(result, decomposedKey, normalizedValue)
}

/**
 * Inserts a value into a nested object structure based on a path of key segments.
 * Creates intermediate objects as needed to ensure the full path exists.
 *
 * @param result - The object to insert the value into.
 * @param path - An array of strings representing the nested key path (e.g., ['item', 'hover', 'color']).
 * @param value - The value to assign at the final path segment.
 *
 * @example
 * const obj = {}
 * insertNestedValue(obj, ['item,', 'hover', 'color'], '#ff0000')
 * Result: { item: { hover: { color: '#ff0000' } } }
 */
function insertNestedValue(result: Record<string, any>, decomposedKey: string[], value: any) {
  let current = result

  decomposedKey.forEach((segment, index) => {
    const isLast = index === decomposedKey.length - 1

    if (isLast) {
      // If it's the last segment, assign the value directly: { key: value }
      current[segment] = value
    } else {
      // If the segment does not exist, create an empty object: { key: {} }
      current[segment] ??= {}
      // Move to the next level in the nested structure: {}
      current = current[segment]
    }
  })
}


```

### File: angular-utils/theme/primeng/src/utils/theme-config.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import ThemeConfig from './theme-config'

describe('ThemeConfig', () => {
  const themeVariables = {
    general: {
      'primary-color': '#ababab',
    },
    font: {
      'font-size': '14px',
    },
    topbar: {},
    sidebar: {},
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    })
  })

  it('should generate config object with normalized variables', () => {
    const themeConfig = new ThemeConfig(themeVariables)

    const result = themeConfig.getConfig()
    expect(result['semantic'].extend.onecx).toEqual({
      primary: { color: '#ababab' },
      font: { size: '14px' },
    })
  })
})


```

### File: angular-utils/theme/primeng/src/utils/theme-config.ts

```ts

import { createPalette, standardColorAdjustment } from './create-color-palette'
import { normalizeKeys } from './normalize-preset-keys.utils'

interface ThemeVariables {
  [key: string]: {
    [key: string]: string
  }
}
export default class ThemeConfig {
  constructor(private themeVariables: ThemeVariables | undefined) {
    // ThemeVariables are saved in kebab case but PrimeNg expects camel case
    this.themeVariables = this.transformVariablesToCamelCase(this.themeVariables ?? {})
  }

  getConfig() {
    const primaryColor = (this.themeVariables as any)['general']['primaryColor']
    return normalizeKeys({
      semantic: {
        extend: {
          onecx: {
            ...(this.themeVariables as any)['font'],
            ...(this.themeVariables as any)['topbar'],
            ...(this.themeVariables as any)['sidebar'],
            ...(this.themeVariables as any)['general'],
          },
        },
        primary: {
          ...createPalette(primaryColor, standardColorAdjustment),
        },
        colorScheme: {
          light: {
            primary: {
              ...createPalette(primaryColor, standardColorAdjustment),
            },
          },
        },
      },
    })
  }

  private transformVariablesToCamelCase(themeVariables: ThemeVariables) {
    const transformedThemeVariables: ThemeVariables = {}
    for (const section in themeVariables) {
      const sectionCamelCaseKey = this.toCamelCase(section)
      transformedThemeVariables[sectionCamelCaseKey] = this.transformSectionToCamelCase(
        themeVariables[sectionCamelCaseKey]
      )
    }
    return transformedThemeVariables
  }

  private transformSectionToCamelCase(section: { [key: string]: string }): { [key: string]: string } {
    const transformedSectionThemeVariables: { [key: string]: string } = {}
    for (const themeVariable in section) {
      const themeVariableCamelCase = this.toCamelCase(themeVariable)
      transformedSectionThemeVariables[themeVariableCamelCase] = section[themeVariable]
    }
    return transformedSectionThemeVariables
  }

  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
  }
}


```


