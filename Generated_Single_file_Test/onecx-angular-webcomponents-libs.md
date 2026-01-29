# Files from C:\Users\prath\onecx\onecx-ui\onecx-portal-ui-libs\libs\angular-webcomponents

## Folder: angular-webcomponents (11 files)

### File: angular-webcomponents/.eslintrc.json

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

### File: angular-webcomponents/jest.config.ts

```ts

/* eslint-disable */
import { createReportsConfig } from '../../jest-config-factory'

export default {
  displayName: 'angular-webcomponents',
  preset: '../../jest.preset.js',
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
  ...createReportsConfig('angular-webcomponents'),
}


```

### File: angular-webcomponents/migrations.json

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

### File: angular-webcomponents/ng-package.json

```json

{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/libs/angular-webcomponents",
  "lib": {
    "entryFile": "src/index.ts"
  },
  "assets": [
    "./migrations.json"
  ]
}

```

### File: angular-webcomponents/package.json

```json

{
  "name": "@onecx/angular-webcomponents",
  "version": "7.0.0-rc.13",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/onecx/onecx-portal-ui-libs"
  },
  "peerDependencies": {
    "@angular/common": "^19.0.0",
    "@angular/core": "^19.0.0",
    "@angular/platform-browser": "^19.0.0",
    "@angular/elements": "^19.0.0",
    "@angular/router": "^19.0.0",
    "@onecx/accelerator": "^7.0.0-rc.13",
    "@onecx/angular-integration-interface": "^7.0.0-rc.13",
    "@onecx/integration-interface": "^7.0.0-rc.13",
    "@onecx/angular-utils": "^7.0.0-rc.13",
    "rxjs": "~7.8.1",
    "@nx/devkit": "^20.3.0",
    "@onecx/nx-migration-utils": "^7.0.0-rc.13"
  },
  "dependencies": {},
  "publishConfig": {
    "access": "public"
  },
  "nx-migrations": {
    "migrations": "./migrations.json"
  }
}


```

### File: angular-webcomponents/project.json

```json

{
  "name": "angular-webcomponents",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/angular-webcomponents/src",
  "prefix": "onecx",
  "tags": [],
  "projectType": "library",
  "targets": {
    "build-migrations": {
      "dependsOn": [
        "build"
      ],
      "executor": "nx:run-commands",
      "options": {
        "commands": [
          "tsc -p libs/angular-webcomponents/migrations/tsconfig.migrations.json"
        ]
      }
    },
    "build": {
      "executor": "@nx/angular:package",
      "outputs": ["{workspaceRoot}/dist/{projectRoot}"],
      "options": {
        "project": "libs/angular-webcomponents/ng-package.json"
      },
      "configurations": {
        "production": {
          "tsConfig": "libs/angular-webcomponents/tsconfig.lib.prod.json"
        },
        "development": {
          "tsConfig": "libs/angular-webcomponents/tsconfig.lib.json"
        }
      },
      "defaultConfiguration": "production"
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "libs/angular-webcomponents/jest.config.ts",
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
          "libs/angular-webcomponents/**/*.ts",
          "libs/angular-webcomponents/**/*.html",
          "libs/angular-webcomponents/package.json"
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

### File: angular-webcomponents/sonar-project.properties

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
sonar.projectKey=onecx-portal-ui-libs-angular-webcomponents
sonar.projectName=onecx-portal-ui-libs-angular-webcomponents
#
sonar.scm.disabled=true
sonar.sources=src
sonar.tests=src
sonar-language="js"
sonar.sourceEncoding=UTF-8
#
# reporting
sonar.javascript.coveragePlugin=lcov
sonar.javascript.lcov.reportPaths=../../reports/angular-webcomponents/coverage/lcov.info
sonar.testExecutionReportPaths=../../reports/angular-webcomponents/sonarqube_report.xml
sonar.working.directory=../../reports/angular-webcomponents/.scannerwork
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

### File: angular-webcomponents/tsconfig.json

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

### File: angular-webcomponents/tsconfig.lib.json

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "declaration": true,
    "declarationMap": true,
    "inlineSources": true,
    "types": ["node"],
    "target": "es2022",
    "useDefineForClassFields": false
  },
  "exclude": ["**/*.spec.ts", "src/test-setup.ts", "jest.config.ts", "**/*.test.ts", "**/*.stories.ts", "jest.config.ts"],
  "include": ["**/*.ts"]
}


```

### File: angular-webcomponents/tsconfig.lib.prod.json

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

### File: angular-webcomponents/tsconfig.spec.json

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
  "include": ["jest.config.ts", "**/*.test.ts", "**/*.spec.ts", "**/*.d.ts"]
}


```

## Folder: angular-webcomponents/migrations (3 files)

### File: angular-webcomponents/migrations/index.ts

```ts

export * from './v6/migrate-onecx-to-v6'

```

### File: angular-webcomponents/migrations/tsconfig.json

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

### File: angular-webcomponents/migrations/tsconfig.migrations.json

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

## Folder: angular-webcomponents/migrations/v6 (1 files)

### File: angular-webcomponents/migrations/v6/migrate-onecx-to-v6.ts

```ts

import { Tree } from '@nx/devkit'
import { commonMigrateOnecxToV6 } from '@onecx/nx-migration-utils'

export default async function migrateOnecxToV6(tree: Tree) {
  await commonMigrateOnecxToV6(tree)
}


```

## Folder: angular-webcomponents/src (2 files)

### File: angular-webcomponents/src/index.ts

```ts

export * from './lib/utils/dynamic-app-id.utils'
export * from './lib/utils/webcomponent-bootstrap.utils'
export * from './lib/utils/webcomponent-router-initializer.utils'
export * from './lib/utils/webcomponent-router.utils'
export * from './lib/utils/webcomponent-connector.utils'


```

### File: angular-webcomponents/src/test-setup.ts

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

## Folder: angular-webcomponents/src/lib/utils (6 files)

### File: angular-webcomponents/src/lib/utils/dynamic-app-id.utils.ts

```ts

export class DynamicAppId {
  public appElementName = ''

  constructor(private value = 'ng') {
    Object.getOwnPropertyNames(String.prototype).forEach((k) => {
      if (k != 'valueOf' && k != 'length') {
        ;(this as any)[k] = function (...args: any[]) {
          const str = this.valueOf()
          return str[k](...args)
        }
      }
    })
  }

  public valueOf() {
    return this.value
  }

  public get length(): number {
    return this.valueOf().length
  }

  public setValue(value: string) {
    this.value = value
  }
}


```

### File: angular-webcomponents/src/lib/utils/webcomponent-bootstrap.utils.ts

```ts

import { createCustomElement } from '@angular/elements'
import { createApplication, platformBrowser } from '@angular/platform-browser'
import {
  APP_ID,
  EnvironmentProviders,
  Injector,
  NgModuleRef,
  NgZone,
  PlatformRef,
  Provider,
  Type,
  VERSION,
  Version,
  enableProdMode,
  getPlatform,
} from '@angular/core'
import { Router } from '@angular/router'
import { dataNoPortalLayoutStylesKey } from '@onecx/angular-utils'
import { WebcomponentConnector } from './webcomponent-connector.utils'
import { DynamicAppId } from './dynamic-app-id.utils'

/**
 * Implementation inspired by @angular-architects/module-federation-plugin https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf-tools/src/lib/web-components/bootstrap-utils.ts
 */

export type AppType = 'shell' | 'microfrontend'
export type EntrypointType = 'microfrontend' | 'component'

export interface AppOptions {
  /**
   * @deprecated Don't provide anymore since portal layout styles is not available anymore. Providing the value will not change the behavior.
   */
  usePortalLayoutStyles?: boolean
}

export function bootstrapModule<M>(module: Type<M>, appType: AppType, production: boolean): Promise<NgModuleRef<M>> {
  replaceOrAddAppId((module as any)['Éµinj'].providers)

  return cachePlatform(production)
    .bootstrapModule(module, {
      ngZone: getNgZone(),
    })
    .then((ref) => {
      if (appType === 'shell') {
        setShellZone(ref.injector)
      }
      return ref
    })
}

export async function bootstrapRemoteComponent(
  component: Type<any>,
  elementName: string,
  production: boolean,
  providers: (Provider | EnvironmentProviders)[],
  options?: AppOptions
): Promise<void> {
  replaceOrAddAppId(providers)

  const app = await createApplication({
    providers: [
      getNgZone()
        ? {
            provide: NgZone,
            useValue: getNgZone(),
          }
        : [],
      ...providers,
    ],
  })

  cachePlatform(production)
  adaptRemoteComponentRoutes(app.injector)
  createEntrypoint(component, elementName, app.injector, 'component', options)
}

export function createAppEntrypoint(
  component: Type<any>,
  elementName: string,
  injector: Injector,
  options?: AppOptions
) {
  createEntrypoint(component, elementName, injector, 'microfrontend', options)
}

/**
 * Adds or replaces APP_ID provider with DynamicAppId. DynamicAppId is a wrapper around the APP_ID that adds application context.
 */
function replaceOrAddAppId(providers: Array<any>) {
  const existingProvider = findAndReplaceAppId(providers)
  if (existingProvider === null) {
    providers.push({
      provide: APP_ID,
      useValue: new DynamicAppId(),
    })
  }
}

function findAndReplaceAppId(providers: Array<any>): any {
  if (providers.length === 0) return null
  for (const provider of providers) {
    if (provider.provide === APP_ID) {
      let id = 'ng'
      if (typeof provider.useValue === 'string') {
        id = provider.useValue
      } else {
        console.warn(
          "APP_ID provider in the application was not done via useValue. Will fallback to 'ng' as the APP_ID"
        )
      }
      provider.useValue = new DynamicAppId(id)
      return provider
    }

    const subProviderResult = findAndReplaceAppId(provider.Éµproviders ?? [])
    if (subProviderResult !== null) {
      return subProviderResult
    }
  }

  return null
}

function createEntrypoint(
  component: Type<any>,
  elementName: string,
  injector: Injector,
  entrypointType: EntrypointType,
  _?: AppOptions
) {
  const webcomponentConnector = new WebcomponentConnector(injector, entrypointType)
  // Save element name in DynamicAppId for later use in SharedStylesHost
  const appId = injector.get(APP_ID) as any as DynamicAppId
  appId.appElementName = elementName

  const originalNgInit = component.prototype.ngOnInit

  component.prototype.ngOnInit = function () {
    webcomponentConnector.connect()
    if (originalNgInit !== undefined) {
      originalNgInit.call(this)
    }
  }
  const originalNgDestroy = component.prototype.ngOnDestroy
  component.prototype.ngOnDestroy = function () {
    webcomponentConnector.disconnect()
    if (originalNgDestroy !== undefined) {
      originalNgDestroy.call(this)
    }
  }

  const myRemoteComponentAsWebComponent = createCustomElement(component, {
    injector: injector,
  })

  const originalConnectedCallback = myRemoteComponentAsWebComponent.prototype.connectedCallback

  myRemoteComponentAsWebComponent.prototype.connectedCallback = function () {
    this.dataset[dataNoPortalLayoutStylesKey] = ''
    originalConnectedCallback.call(this)
  }

  customElements.define(elementName, myRemoteComponentAsWebComponent)
}

export function getWindowState(): any {
  const state = window as any
  state['@onecx/angular-webcomponents'] ??= {} as unknown
  return state['@onecx/angular-webcomponents']
}

function setShellZone(injector: Injector) {
  const ngZone = injector.get(NgZone, null)
  if (!ngZone) {
    console.warn('No NgZone to share found')
    return
  }
  setNgZone(ngZone)
}

function setNgZone(ngZone: NgZone): void {
  getWindowState().ngZone = ngZone
}

export function getNgZone(): NgZone {
  return getWindowState().ngZone
}

export function cachePlatform(production: boolean): PlatformRef {
  let platformCache: Map<Version, PlatformRef> = getWindowState().platformCache
  if (!platformCache) {
    platformCache = new Map<Version, PlatformRef>()
    getWindowState().platformCache = platformCache
  }
  const version = VERSION
  let platform: any = platformCache.get(version)
  if (!platform) {
    platform = getPlatform() ?? platformBrowser()
    platform && platformCache.set(version, platform)
    production ?? enableProdMode()
  }
  return platform
}

function adaptRemoteComponentRoutes(injector: Injector) {
  const router = injector.get(Router)

  if (!router) {
    return
  }

  // Fallback route is needed to make sure that router is activatable
  // and to always respond for guards scattered requests
  if (!router.config.find((val) => val.path === '**')) {
    router.resetConfig(
      router.config.concat({
        path: '**',
        children: [],
      })
    )
  }
}


```

### File: angular-webcomponents/src/lib/utils/webcomponent-connector.utils.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { GuardsCheckEnd, GuardsCheckStart, Router, RouterStateSnapshot, RoutesRecognized } from '@angular/router'
import { Injector } from '@angular/core'
import { provideGuardsGathererMock } from '@onecx/angular-utils/mocks'
import {
  GUARD_CHECK_PROMISE,
  GUARD_MODE,
  GuardCheckPromise,
  GuardsGatherer,
  GuardsNavigationState,
  GuardsNavigationStateController,
  IS_INITIAL_ROUTER_SYNC,
  IS_ROUTER_SYNC,
  wrapGuards,
} from '@onecx/angular-utils/guards'
import { AppStateService, ShellCapabilityService } from '@onecx/angular-integration-interface'
import { FakeTopic, provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { WebcomponentConnector } from './webcomponent-connector.utils'
import { ReplaySubject, Subject } from 'rxjs'
import { Location } from '@angular/common'
import { Route } from '@onecx/integration-interface'

const deploymentPathMock = '/mock-path/'
const applicationPathMock = 'admin/ui'
const locationPathMock = Location.joinWithSlash(deploymentPathMock, applicationPathMock)

jest.mock('@onecx/accelerator', () => {
  const actual = jest.requireActual('@onecx/accelerator')
  return {
    ...actual,
    getLocation: jest.fn().mockReturnValue({ deploymentPath: '/mock-path/' }),
  }
})

jest.mock('@onecx/angular-utils/guards', () => {
  const actual = jest.requireActual('@onecx/angular-utils/guards')
  return {
    ...actual,
    wrapGuards: jest.fn(),
  }
})

const changeLocation = (pathName: string) => {
  window.history.pushState({}, '', pathName)
}

describe('WebcomponentConnector', () => {
  let connector: WebcomponentConnector
  let mockGuardsNavigationStateController: jest.Mocked<GuardsNavigationStateController>
  let mockCapabilityService: jest.Mocked<ShellCapabilityService>
  let mockRouter: jest.Mocked<Router>
  let mockAppStateService: AppStateService
  let eventsTopic: FakeTopic<any>
  let mockGuardsGatherer: GuardsGatherer
  let consoleWarnSpy: jest.SpyInstance

  beforeEach(() => {
    mockGuardsNavigationStateController = {
      getMode: jest.fn(),
      createNavigationRequestedState: jest.fn(),
    } as unknown as jest.Mocked<GuardsNavigationStateController>

    mockCapabilityService = {
      hasCapability: jest.fn().mockReturnValue(true),
    } as unknown as jest.Mocked<ShellCapabilityService>

    mockRouter = {
      events: new Subject<any>(),
      navigateByUrl: jest.fn(),
      getCurrentNavigation: jest.fn().mockReturnValue({ extras: { state: {} } }),
    } as unknown as jest.Mocked<Router>

    TestBed.configureTestingModule({
      providers: [
        provideGuardsGathererMock(),
        { provide: GuardsNavigationStateController, useValue: mockGuardsNavigationStateController },
        { provide: Router, useValue: mockRouter },
        provideAppStateServiceMock(),
      ],
    })

    connector = new WebcomponentConnector(TestBed.inject(Injector), 'microfrontend')
    eventsTopic = new FakeTopic<any>()
    connector['eventsTopic'] = eventsTopic as any
    connector['capabilityService'] = mockCapabilityService
    mockGuardsGatherer = TestBed.inject(GuardsGatherer)
    mockAppStateService = TestBed.inject(AppStateService)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    changeLocation(locationPathMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should activate guards gatherer on connect', () => {
    const spy = jest.spyOn(mockGuardsGatherer, 'activate')
    connector.connect()

    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('should deactivate guards gatherer and destroy events topic on disconnect', () => {
    connector.connect()

    const destroySpy = jest.spyOn(eventsTopic, 'destroy')
    const deactivateSpy = jest.spyOn(mockGuardsGatherer, 'deactivate')

    connector.disconnect()

    expect(destroySpy).toHaveBeenCalled()
    expect(deactivateSpy).toHaveBeenCalled()
  })

  it('should warn if no router is found', () => {
    const injector = TestBed.inject(Injector)
    jest.spyOn(injector, 'get').mockReturnValueOnce(null)

    connector.connect()

    expect(consoleWarnSpy).toHaveBeenCalledWith('No router to connect found')
  })

  it('should warn if no AppStateService is found', () => {
    const injector = TestBed.inject(Injector)
    jest.spyOn(injector, 'get').mockReturnValueOnce(mockRouter).mockReturnValueOnce(null)

    connector.connect()

    expect(consoleWarnSpy).toHaveBeenCalledWith('No appStateService found')
  })

  it('should perform initial navigation on connect', () => {
    const navigationSpy = jest.spyOn(mockRouter, 'navigateByUrl')

    connector.connect()

    expect(navigationSpy).toHaveBeenCalledWith(applicationPathMock, {
      replaceUrl: true,
      state: {
        [IS_ROUTER_SYNC]: true,
        [IS_INITIAL_ROUTER_SYNC]: true,
      },
    })
  })

  it('should perform router sync on currentLocation change', () => {
    const navigationSpy = jest.spyOn(mockRouter, 'navigateByUrl')

    connector.connect()

    navigationSpy.mockClear()
    changeLocation(`${deploymentPathMock}/new-path`)
    mockAppStateService.currentLocation$.publish({
      url: 'url',
      isFirst: false,
    })

    expect(navigationSpy).toHaveBeenCalledWith('/new-path', {
      replaceUrl: true,
      state: {
        [IS_ROUTER_SYNC]: true,
      },
    })
  })

  it('should not perform router sync if currentLocation is not changed', () => {
    const navigationSpy = jest.spyOn(mockRouter, 'navigateByUrl')

    connector.connect()

    navigationSpy.mockClear()
    mockAppStateService.currentLocation$.publish({
      url: 'url',
      isFirst: false,
    })

    expect(navigationSpy).not.toHaveBeenCalled()
  })

  it('should perform router sync on events topic navigated message', () => {
    mockCapabilityService.hasCapability.mockReturnValue(false)
    const navigationSpy = jest.spyOn(mockRouter, 'navigateByUrl')

    connector.connect()

    navigationSpy.mockClear()
    changeLocation(`${deploymentPathMock}/new-path`)
    eventsTopic.publish({ type: 'navigated', payload: { url: '/url' } })

    expect(navigationSpy).toHaveBeenCalledWith('/new-path', {
      replaceUrl: true,
      state: {
        [IS_ROUTER_SYNC]: true,
      },
    })
  })

  describe('RoutesRecognized', () => {
    it('should wrap guards on route recognized', () => {
      connector.connect()

      const childRouteConfig = {
        canActivate: [],
        canActivateChild: [],
      } as Route

      const parentRouteConfig = {
        canActivate: [],
        canDeactivate: [],
      } as Route
      const routesRecognizedMock = new RoutesRecognized(1, '', '', {
        root: {
          routeConfig: parentRouteConfig,
          children: [
            {
              routeConfig: childRouteConfig,
            },
          ],
        },
      } as RouterStateSnapshot)

      ;(mockRouter.events as ReplaySubject<any>).next(routesRecognizedMock)

      expect(wrapGuards).toHaveBeenCalledWith(parentRouteConfig)
      expect(wrapGuards).toHaveBeenCalledWith(childRouteConfig)
    })

    it('should not wrap guards on route recognized if no route config', () => {
      connector.connect()

      const routesRecognizedMock = new RoutesRecognized(1, '', '', {
        root: {
          children: [],
        },
      } as any as RouterStateSnapshot)

      ;(mockRouter.events as ReplaySubject<any>).next(routesRecognizedMock)

      expect(wrapGuards).not.toHaveBeenCalled()
    })
  })

  describe('GuardsCheckStart', () => {
    it('should schedule guards results gathering on GuardsCheckStart', async () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'gather').mockReturnValue(Promise.resolve([true, true]))
      connector.connect()

      const navigationObject = {} as GuardsNavigationState

      mockRouter.getCurrentNavigation = jest.fn().mockReturnValue({ extras: { state: navigationObject } })
      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      mockGuardsNavigationStateController.createNavigationRequestedState.mockImplementation(
        (promise: GuardCheckPromise, state?: GuardsNavigationState | undefined) => {
          if (state) state[GUARD_CHECK_PROMISE] = promise
          return state ?? {}
        }
      )

      const guardsCheckStartMock = new GuardsCheckStart(1, '', '/test', {} as RouterStateSnapshot)

      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckStartMock)

      expect(spy).toHaveBeenCalledWith({ url: guardsCheckStartMock.urlAfterRedirects })
      expect(navigationObject[GUARD_CHECK_PROMISE]).toBeDefined()
      const guardCheckResult = await navigationObject[GUARD_CHECK_PROMISE]
      expect(guardCheckResult).toBe(true)
    })

    it('should not schedule guards results gathering if no current navigation', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'gather')
      connector.connect()

      mockRouter.getCurrentNavigation = jest.fn().mockReturnValue(null)

      const guardsCheckStartMock = new GuardsCheckStart(1, '', '/test', {} as RouterStateSnapshot)

      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckStartMock)

      expect(spy).not.toHaveBeenCalled()
    })

    it('should not schedule guards results gathering if guard mode is INITIAL_ROUTER_SYNC', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'gather')
      connector.connect()

      mockRouter.getCurrentNavigation = jest.fn().mockReturnValue({ extras: { state: {} } })
      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.INITIAL_ROUTER_SYNC)

      const guardsCheckStartMock = new GuardsCheckStart(1, '', '/test', {} as RouterStateSnapshot)

      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckStartMock)

      expect(spy).not.toHaveBeenCalled()
    })

    it('should not schedule guards results gathering if guard mode is GUARD_CHECK', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'gather')
      connector.connect()

      mockRouter.getCurrentNavigation = jest.fn().mockReturnValue({ extras: { state: {} } })
      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.GUARD_CHECK)

      const guardsCheckStartMock = new GuardsCheckStart(1, '', '/test', {} as RouterStateSnapshot)

      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckStartMock)

      expect(spy).not.toHaveBeenCalled()
    })

    it('should not schedule guards results gathering if guard mode is ROUTER_SYNC', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'gather')
      connector.connect()

      mockRouter.getCurrentNavigation = jest.fn().mockReturnValue({ extras: { state: {} } })
      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.ROUTER_SYNC)

      const guardsCheckStartMock = new GuardsCheckStart(1, '', '/test', {} as RouterStateSnapshot)

      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckStartMock)

      expect(spy).not.toHaveBeenCalled()
    })

    it('should not schedule guards results gathering if no navigation state', async () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'gather').mockReturnValue(Promise.resolve([true, true]))
      connector.connect()

      const extrasObject = {} as any

      mockRouter.getCurrentNavigation = jest.fn().mockReturnValue({ extras: extrasObject })
      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      mockGuardsNavigationStateController.createNavigationRequestedState.mockImplementation(
        (promise: GuardCheckPromise, state?: GuardsNavigationState | undefined) => {
          if (state) state[GUARD_CHECK_PROMISE] = promise
          return state ?? {}
        }
      )

      const guardsCheckStartMock = new GuardsCheckStart(1, '', '/test', {} as RouterStateSnapshot)

      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckStartMock)

      expect(spy).toHaveBeenCalledWith({ url: guardsCheckStartMock.urlAfterRedirects })
      expect(extrasObject['state'][GUARD_CHECK_PROMISE]).toBeDefined()
      const guardCheckResult = await extrasObject['state'][GUARD_CHECK_PROMISE]
      expect(guardCheckResult).toBe(true)
    })
  })

  describe('GuardsCheckEnd', () => {
    it('should request navigation revert on INITIAL_ROUTER_SYNC failure', async () => {
      const spy = jest.spyOn(eventsTopic, 'publish')
      connector.connect()

      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.INITIAL_ROUTER_SYNC)
      const guardsCheckEndMock = new GuardsCheckEnd(1, '', '/test', {} as RouterStateSnapshot, false)

      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckEndMock)

      expect(spy).toHaveBeenCalledWith({
        type: 'revertNavigation',
      })
    })

    it('should resolve guard check on GUARD_CHECK if should activate the route', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      connector.connect()

      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.GUARD_CHECK)
      const guardsCheckEndMock = new GuardsCheckEnd(1, '', '/test', {} as RouterStateSnapshot, true)

      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckEndMock)

      expect(spy).toHaveBeenCalledWith(guardsCheckEndMock.urlAfterRedirects, true)
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(mockRouter.url, {
        skipLocationChange: true,
        state: { [IS_ROUTER_SYNC]: true },
      })
    })

    it('should not resolve guard check on GUARD_CHECK if should not activate the route', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      connector.connect()

      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.GUARD_CHECK)
      const guardsCheckEndMock = new GuardsCheckEnd(1, '', '/test', {} as RouterStateSnapshot, false)

      mockRouter.navigateByUrl.mockClear()
      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckEndMock)

      expect(spy).not.toHaveBeenCalled()
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled()
    })

    it('should not resolve guard check on ROUTER_SYNC', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      connector.connect()

      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.ROUTER_SYNC)
      const guardsCheckEndMock = new GuardsCheckEnd(1, '', '/test', {} as RouterStateSnapshot, true)

      mockRouter.navigateByUrl.mockClear()
      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckEndMock)

      expect(spy).not.toHaveBeenCalled()
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled()
    })

    it('should not resolve guard check on NAVIGATION_REQUESTED', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      connector.connect()

      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      const guardsCheckEndMock = new GuardsCheckEnd(1, '', '/test', {} as RouterStateSnapshot, true)

      mockRouter.navigateByUrl.mockClear()
      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckEndMock)

      expect(spy).not.toHaveBeenCalled()
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled()
    })

    it('should not resolve guard check if no navigation state', () => {
      const spy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      connector.connect()

      mockRouter.getCurrentNavigation = jest.fn().mockReturnValue({ extras: {} })
      mockGuardsNavigationStateController.getMode.mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      const guardsCheckEndMock = new GuardsCheckEnd(1, '', '/test', {} as RouterStateSnapshot, true)

      mockRouter.navigateByUrl.mockClear()
      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckEndMock)

      expect(spy).not.toHaveBeenCalled()
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled()
      expect(mockGuardsNavigationStateController.getMode).toHaveBeenCalledWith({})
    })

    it('should have empty navigation state if no current navigation', () => {
      connector.connect()

      mockRouter.getCurrentNavigation = jest.fn().mockReturnValue(null)
      const guardsCheckEndMock = new GuardsCheckEnd(1, '', '/test', {} as RouterStateSnapshot, true)

      mockRouter.navigateByUrl.mockClear()
      ;(mockRouter.events as ReplaySubject<any>).next(guardsCheckEndMock)

      expect(mockGuardsNavigationStateController.getMode).toHaveBeenCalledWith({})
    })
  })
})


```

### File: angular-webcomponents/src/lib/utils/webcomponent-connector.utils.ts

```ts

import { Injector } from '@angular/core'
import { EntrypointType } from './webcomponent-bootstrap.utils'
import { CurrentLocationTopicPayload, EventsTopic, TopicEventType } from '@onecx/integration-interface'
import { filter, Observable, Subscription } from 'rxjs'
import { AppStateService, Capability, ShellCapabilityService } from '@onecx/angular-integration-interface'
import {
  combineToBoolean,
  GUARD_MODE,
  GuardsGatherer,
  GuardsNavigationState,
  GuardsNavigationStateController,
  IS_INITIAL_ROUTER_SYNC,
  IS_ROUTER_SYNC,
  logGuardsDebug,
  wrapGuards,
} from '@onecx/angular-utils/guards'
import { ActivatedRouteSnapshot, GuardsCheckEnd, GuardsCheckStart, Router, RoutesRecognized } from '@angular/router'
import { getLocation } from '@onecx/accelerator'

/**
 * WebcomponentConnector is a utility class that connects Angular web components.
 * It manages the router connection with other web components and handles the navigation state.
 */
export class WebcomponentConnector {
  private readonly connectionSubscriptions: Subscription[] = []
  private capabilityService: ShellCapabilityService //NOSONAR
  private _eventsTopic$: EventsTopic | undefined
  get eventsTopic() {
    this._eventsTopic$ ??= new EventsTopic()
    return this._eventsTopic$
  }
  set eventsTopic(source: EventsTopic) {
    this._eventsTopic$ = source
  }
  private readonly guardsGatherer: GuardsGatherer
  private readonly guardsNavigationStateController: GuardsNavigationStateController

  constructor(
    private readonly injector: Injector,
    private readonly entrypointType: EntrypointType
  ) {
    this.capabilityService = new ShellCapabilityService()
    this.guardsGatherer = this.injector.get(GuardsGatherer)
    this.guardsNavigationStateController = this.injector.get(GuardsNavigationStateController)
  }

  connect() {
    this.guardsGatherer.activate()
    this.connectionSubscriptions.push(...this.connectRouter())
  }

  disconnect() {
    for (const sub of this.connectionSubscriptions) {
      sub.unsubscribe()
    }
    this._eventsTopic$?.destroy()
    this.guardsGatherer.deactivate()
  }

  /**
   * Connects the router of the web component.
   * It sets up the necessary subscriptions to handle navigation and guard checks.
   * @returns Array of subscriptions for the router connection
   */
  private connectRouter(): Subscription[] {
    const router = this.injector.get(Router, null)
    const appStateService = this.injector.get(AppStateService, null)
    if (!router) {
      if (this.entrypointType === 'microfrontend') {
        console.warn('No router to connect found')
      }
      return []
    }

    if (!appStateService) {
      console.warn('No appStateService found')
      return []
    }

    return [...this.connectRouterGuards(router), this.connectLocationChange(router, appStateService)]
  }

  /**
   * Connects the location change of the web component's router.
   * It sets up the initial URL and subscribes to location changes to update the router accordingly.
   * @param router - The router to connect location change for
   * @param appStateService - The app state service to use for current location topic
   * @returns Subscription for the location change connection
   */
  private connectLocationChange(router: Router, appStateService: AppStateService): Subscription {
    const initialUrl = `${location.pathname.substring(getLocation().deploymentPath.length)}${location.search}${location.hash}`
    router.navigateByUrl(initialUrl, {
      replaceUrl: true,
      state: { [IS_ROUTER_SYNC]: true, [IS_INITIAL_ROUTER_SYNC]: true },
    })
    let lastUrl = initialUrl
    let observable: Observable<TopicEventType | CurrentLocationTopicPayload> =
      appStateService.currentLocation$.asObservable()
    const currentLocationCapabilityAvailable = this.capabilityService.hasCapability(Capability.CURRENT_LOCATION_TOPIC)
    if (!currentLocationCapabilityAvailable) {
      observable = this.eventsTopic.pipe(filter((e) => e.type === 'navigated'))
    }
    return observable.subscribe(() => {
      const routerUrl = `${location.pathname.substring(getLocation().deploymentPath.length)}${location.search}${location.hash}`
      if (routerUrl !== lastUrl) {
        lastUrl = routerUrl
        router.navigateByUrl(routerUrl, {
          replaceUrl: true,
          state: { isRouterSync: true },
        })
      }
    })
  }

  /**
   * Connects the router guards for the web component's router.
   * It sets up the necessary subscriptions to handle guard checks and navigation states.
   * @param router - The router to connect guards for
   * @returns Array of subscriptions for the router guards connection
   */
  private connectRouterGuards(router: Router): Subscription[] {
    return [
      this.wrapGuardsOnRouteRecognized(router),
      this.gatherGuardsOnGuardsCheckStart(router),
      this.resolveGuardsOnGuardsCheckEnd(router),
    ]
  }

  /**
   * Wraps guards for the given router on RoutesRecognized event.
   * This will ensure that guards are wrapped for the routes recognized by the router.
   * @param router - The router to wrap guards for.
   */
  private wrapGuardsOnRouteRecognized(router: Router): Subscription {
    return router.events
      .pipe(filter((event) => event instanceof RoutesRecognized))
      .subscribe((event: RoutesRecognized) => {
        const rootSnapshot = event.state.root
        this.wrapGuardsForRoute(rootSnapshot)
      })
  }

  /**
   * Gathers guards on GuardsCheckStart event.
   * This will ensure that guards are gathered when the resolve starts.
   * It checks the GuardsNavigationState to determine the state of the router.
   * @param router - The router to gather guards for.
   */
  private gatherGuardsOnGuardsCheckStart(router: Router): Subscription {
    return router.events
      .pipe(filter((event) => event instanceof GuardsCheckStart))
      .subscribe((event: GuardsCheckStart) => {
        const currentNavigation = router.getCurrentNavigation()
        if (!currentNavigation) {
          logGuardsDebug('No current navigation found, skipping guards gathering.')
          return
        }

        const guardsNavigationState = (currentNavigation.extras.state ?? {}) as GuardsNavigationState
        const guardMode = this.guardsNavigationStateController.getMode(guardsNavigationState)

        switch (guardMode) {
          case GUARD_MODE.NAVIGATION_REQUESTED: {
            const guardsPromise = this.guardsGatherer
              .gather({ url: event.urlAfterRedirects })
              .then((results) => Array.isArray(results) && combineToBoolean(results))

            this.guardsNavigationStateController.createNavigationRequestedState(guardsPromise, guardsNavigationState)
            currentNavigation.extras.state = guardsNavigationState
            return
          }
          case GUARD_MODE.INITIAL_ROUTER_SYNC:
          case GUARD_MODE.GUARD_CHECK:
          case GUARD_MODE.ROUTER_SYNC:
            return
        }
      })
  }

  private resolveGuardsOnGuardsCheckEnd(router: Router): Subscription {
    return router.events.pipe(filter((event) => event instanceof GuardsCheckEnd)).subscribe((event: GuardsCheckEnd) => {
      const guardsNavigationState = (router.getCurrentNavigation()?.extras.state ?? {}) as GuardsNavigationState
      const mode = this.guardsNavigationStateController.getMode(guardsNavigationState)

      switch (mode) {
        case GUARD_MODE.INITIAL_ROUTER_SYNC:
          if (!event.shouldActivate) {
            console.warn(
              'Initial router sync failed, reverting navigation. This is expected when the app was loaded and the initial navigation was made to a guarded route.'
            )
            this.eventsTopic.publish({
              type: 'revertNavigation',
            })
          }
          return
        case GUARD_MODE.GUARD_CHECK:
          // If event.shouldActivate is false, it means that the navigation was cancelled already and response has been sent
          if (event.shouldActivate) {
            logGuardsDebug('Guard check state detected, sending positive result back and cancelling navigation.')
            this.guardsGatherer.resolveRoute(event.urlAfterRedirects, true)
            router.navigateByUrl(router.url, { skipLocationChange: true, state: { [IS_ROUTER_SYNC]: true } })
          }
          return
        case GUARD_MODE.ROUTER_SYNC:
        case GUARD_MODE.NAVIGATION_REQUESTED:
          return
      }
    })
  }

  /**
   * Wraps guards for the given route and its children.
   * @param route - The route to wrap guards for.
   */
  private wrapGuardsForRoute(route: ActivatedRouteSnapshot): void {
    if (!route.routeConfig) {
      logGuardsDebug('No routeConfig found for route', route)
    }
    route.routeConfig && wrapGuards(route.routeConfig)
    for (const child of route.children) {
      this.wrapGuardsForRoute(child)
    }
  }
}


```

### File: angular-webcomponents/src/lib/utils/webcomponent-router.utils.ts

```ts

import { Route, UrlMatcher, UrlSegment, UrlSegmentGroup } from '@angular/router'

export function startsWith(prefix: string): UrlMatcher {
  return (url: UrlSegment[], _urlSegmentGroup: UrlSegmentGroup, route: Route) => {
    const baseHref = getBaseHrefOfRoute(route)
    if (`/${url.map((s) => s.path).join('/')}/`.startsWith(baseHref)) {
      const urlWithoutBaseHref = sliceBaseHref(route, url)

      const fullUrl = urlWithoutBaseHref.map((u) => u.path).join('/')
      if (fullUrl.startsWith(prefix)) {
        const prefixLength = prefix.split('/').filter((value) => value).length
        return { consumed: url.slice(0, baseHrefSegmentAmount(url, urlWithoutBaseHref) + prefixLength) }
      }
    }
    return null
  }
}

export function getBaseHrefOfRoute(route: Route): string {
  const mfeBaseHref: string = route?.data?.['mfeInfo']?.baseHref
  if (!mfeBaseHref) {
    console.warn(
      'mfeInfo was not provided for route. initializeRouter function is required to be registered as app initializer.'
    )
  }
  return mfeBaseHref
}

export function sliceBaseHref(route: Route, url: UrlSegment[]): UrlSegment[] {
  const mfeBaseHref = getBaseHrefOfRoute(route)

  const baseHrefSegmentAmount = mfeBaseHref.split('/').filter((value) => value).length
  return url.slice(baseHrefSegmentAmount)
}

export function baseHrefSegmentAmount(url: UrlSegment[], urlWithoutBaseHref: UrlSegment[]) {
  return url.length - urlWithoutBaseHref.length
}


```

### File: angular-webcomponents/src/lib/utils/webcomponent-router-initializer.utils.ts

```ts

import { Location } from '@angular/common'
import { Router } from '@angular/router'
import { AppStateService } from '@onecx/angular-integration-interface'
import { firstValueFrom, map } from 'rxjs'

export function initializeRouter(router: Router, appStateService: AppStateService) {
  return () =>
    firstValueFrom(
      appStateService.currentMfe$.asObservable().pipe(
        map((mfeInfo) => {
          const routes = router.config
          routes.forEach((route) => {
            ;((route.data = {
              ...route.data,
              mfeInfo: mfeInfo,
            }),
              (route.redirectTo =
                route.redirectTo && typeof route.redirectTo === 'string'
                  ? Location.joinWithSlash(mfeInfo.baseHref, route.redirectTo)
                  : route.redirectTo))
          })
          routes.push({
            path: '**',
            children: [],
          })
          router.resetConfig(routes)
        })
      )
    )
}


```


