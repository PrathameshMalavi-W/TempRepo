# Files from C:\Users\prath\onecx\onecx-ui\onecx-portal-ui-libs\libs\ngrx-integration-interface

## Folder: ngrx-integration-interface (10 files)

### File: ngrx-integration-interface/.eslintrc.json

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

### File: ngrx-integration-interface/jest.config.ts

```ts

/* eslint-disable */
import { createReportsConfig } from '../../jest-config-factory'

export default {
  displayName: 'ngrx-integration-interface',
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
  ...createReportsConfig('ngrx-integration-interface'),
}


```

### File: ngrx-integration-interface/ng-package.json

```json

{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/libs/ngrx-integration-interface",
  "lib": {
    "entryFile": "src/index.ts"
  },
  "assets": [
    "CHANGELOG.md",
    "./migrations.json"
  ]
}

```

### File: ngrx-integration-interface/package.json

```json

{
  "name": "@onecx/ngrx-integration-interface",
  "version": "7.0.0-rc.13",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/onecx/onecx-portal-ui-libs"
  },
  "peerDependencies": {
    "@angular/core": "^19.0.0",
    "@ngrx/store": "^19.0.0",
    "@onecx/angular-integration-interface": "^7.0.0-rc.13",
    "@onecx/integration-interface": "^7.0.0-rc.13",
    "@ngneat/until-destroy": "^10.0.0",
    "rxjs": "^7.8.1"
  },
  "publishConfig": {
    "access": "public"
  }
}


```

### File: ngrx-integration-interface/project.json

```json

{
  "name": "ngrx-integration-interface",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/ngrx-integration-interface/src",
  "prefix": "onecx",
  "projectType": "library",
  "tags": [],
  "targets": {
    "build": {
      "executor": "@nx/angular:package",
      "outputs": ["{workspaceRoot}/dist/{projectRoot}"],
      "options": {
        "project": "libs/ngrx-integration-interface/ng-package.json"
      },
      "configurations": {
        "production": {
          "tsConfig": "libs/ngrx-integration-interface/tsconfig.lib.prod.json"
        },
        "development": {
          "tsConfig": "libs/ngrx-integration-interface/tsconfig.lib.json"
        }
      },
      "defaultConfiguration": "production"
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "libs/ngrx-integration-interface/jest.config.ts",
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
        "lintFilePatterns": ["libs/ngrx-integration-interface/**/*.ts", "libs/ngrx-integration-interface/package.json"]
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

### File: ngrx-integration-interface/sonar-project.properties

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
sonar.projectKey=onecx-portal-ui-libs-ngrx-integration-interface
sonar.projectName=onecx-portal-ui-libs-ngrx-integration-interface
#
sonar.scm.disabled=true
sonar.sources=src
sonar.tests=src
sonar-language="js"
sonar.sourceEncoding=UTF-8
#
# reporting
sonar.javascript.coveragePlugin=lcov
sonar.javascript.lcov.reportPaths=../../reports/ngrx-integration-interface/coverage/lcov.info
sonar.testExecutionReportPaths=../../reports/ngrx-integration-interface/sonarqube_report.xml
sonar.working.directory=../../reports/ngrx-integration-interface/.scannerwork
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

### File: ngrx-integration-interface/tsconfig.json

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
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}


```

### File: ngrx-integration-interface/tsconfig.lib.json

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
  "exclude": ["src/**/*.spec.ts", "src/test-setup.ts", "jest.config.ts", "src/**/*.test.ts"],
  "include": ["src/**/*.ts"]
}


```

### File: ngrx-integration-interface/tsconfig.lib.prod.json

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

### File: ngrx-integration-interface/tsconfig.spec.json

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

## Folder: ngrx-integration-interface/src (2 files)

### File: ngrx-integration-interface/src/index.ts

```ts

// Store Connector
export * from './lib/store-connector/store-connectors'

export * from './lib/store-connector/onecx-actions'
export * from './lib/store-connector/onecx-reducer'
export * from './lib/store-connector/onecx-selectors'
export * from './lib/store-connector/onecx-state'


```

### File: ngrx-integration-interface/src/test-setup.ts

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

## Folder: ngrx-integration-interface/src/lib/store-connector (4 files)

### File: ngrx-integration-interface/src/lib/store-connector/onecx-actions.ts

```ts

import { createActionGroup, props } from '@ngrx/store'
import { MfeInfo, PageInfo, Theme, UserProfile, Workspace } from '@onecx/integration-interface'

export const OneCxActions = createActionGroup({
  source: 'OneCX',
  events: {
    navigated: props<{
      event: undefined | unknown
    }>(),
    permissionsChanged: props<{
      permissions: string[]
    }>(),
    configChanged: props<{
      config: { [key: string]: string }
    }>(),
    currentMfeChanged: props<{
      currentMfe: MfeInfo
    }>(),
    currentPageChanged: props<{
      currentPage: PageInfo | undefined
    }>(),
    currentThemeChanged: props<{
      currentTheme: Theme
    }>(),
    currentWorkspaceChanged: props<{
      currentWorkspace: Workspace
    }>(),
    appConfigChanged: props<{
      appConfig: { [key: string]: string }
    }>(),
    userProfileChanged: props<{
      userProfile: UserProfile
    }>(),
  },
})


```

### File: ngrx-integration-interface/src/lib/store-connector/onecx-reducer.ts

```ts

import { createReducer, on } from '@ngrx/store'
import { OneCxActions } from './onecx-actions'
import { OneCxState } from './onecx-state'
import { NavigatedEventPayload } from '@onecx/integration-interface'

export const oneCxReducer = createReducer<OneCxState>(
  {},
  on(
    OneCxActions.navigated,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      location: action.event as NavigatedEventPayload,
    })
  ),
  on(
    OneCxActions.permissionsChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      permissions: action.permissions,
    })
  ),
  on(
    OneCxActions.configChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      config: action.config,
    })
  ),
  on(
    OneCxActions.currentMfeChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      currentMfe: action.currentMfe,
    })
  ),
  on(
    OneCxActions.currentPageChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      currentPage: action.currentPage,
    })
  ),
  on(
    OneCxActions.currentThemeChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      currentTheme: action.currentTheme,
    })
  ),
  on(
    OneCxActions.currentWorkspaceChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      currentWorkspace: action.currentWorkspace,
    })
  ),
  on(
    OneCxActions.appConfigChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      appConfig: action.appConfig,
    })
  ),
  on(
    OneCxActions.userProfileChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      userProfile: action.userProfile,
    })
  )
)


```

### File: ngrx-integration-interface/src/lib/store-connector/onecx-selectors.ts

```ts

import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store'
import { OneCxState } from './onecx-state'
import { LocationState } from './onecx-state'
import { MfeInfo, PageInfo, Theme, Workspace, UserProfile } from '@onecx/integration-interface'

export function createOneCxSelector<State extends Record<string, any>>(): MemoizedSelector<State, OneCxState> {
  return createFeatureSelector('onecx')
}

export type OneCxSelectors<V> = {
  selectLocation: MemoizedSelector<V, LocationState | undefined>
  selectBackNavigationPossible: MemoizedSelector<V, boolean>
  selectPermissions: MemoizedSelector<V, string[] | undefined>
  selectConfig: MemoizedSelector<V, { [key: string]: string } | undefined>
  selectCurrentMfe: MemoizedSelector<V, MfeInfo | undefined>
  selectCurrentPage: MemoizedSelector<V, PageInfo | undefined>
  selectCurrentTheme: MemoizedSelector<V, Theme | undefined>
  selectCurrentWorkspace: MemoizedSelector<V, Workspace | undefined>
  selectAppConfig: MemoizedSelector<V, { [key: string]: string } | undefined>
  selectUserProfile: MemoizedSelector<V, UserProfile | undefined>
}

export function getOneCxSelectors<V extends Record<string, any>>(
  selectState: (state: V) => OneCxState = createOneCxSelector<V>()
): OneCxSelectors<V> {
  const selectLocation = createSelector(selectState, (state) => state.location)
  const selectBackNavigationPossible = createSelector(selectLocation, (location) => !!location && !location?.isFirst)
  const selectPermissions = createSelector(selectState, (state) => state.permissions)
  const selectConfig = createSelector(selectState, (state) => state.config)
  const selectCurrentMfe = createSelector(selectState, (state) => state.currentMfe)
  const selectCurrentPage = createSelector(selectState, (state) => state.currentPage)
  const selectCurrentTheme = createSelector(selectState, (state) => state.currentTheme)
  const selectCurrentWorkspace = createSelector(selectState, (state) => state.currentWorkspace)
  const selectAppConfig = createSelector(selectState, (state) => state.appConfig)
  const selectUserProfile = createSelector(selectState, (state) => state.userProfile)
  return {
    selectLocation,
    selectBackNavigationPossible,
    selectPermissions,
    selectConfig,
    selectCurrentMfe,
    selectCurrentPage,
    selectCurrentTheme,
    selectCurrentWorkspace,
    selectAppConfig,
    selectUserProfile,
  }
}


```

### File: ngrx-integration-interface/src/lib/store-connector/onecx-state.ts

```ts

import { MfeInfo, NavigatedEventPayload, PageInfo, Theme, UserProfile, Workspace } from '@onecx/integration-interface'

export type LocationState = NavigatedEventPayload
export interface OneCxState {
  location?: LocationState | undefined
  permissions?: string[] | undefined
  config?: { [key: string]: string } | undefined
  currentMfe?: MfeInfo
  currentPage?: PageInfo | undefined
  currentTheme?: Theme
  currentWorkspace?: Workspace
  appConfig?: { [key: string]: string }
  userProfile?: UserProfile
}


```

## Folder: ngrx-integration-interface/src/lib/store-connector/store-connectors (17 files)

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/app-config-store-connector-service.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { AppConfigStoreConnectorService } from './app-config-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { AppConfigService } from '@onecx/angular-integration-interface'
import { provideAppConfigServiceMock } from '@onecx/angular-integration-interface/mocks'

describe('AppConfigStoreConnectorService', () => {
  let store: Store
  let appConfigService: any

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppConfigStoreConnectorService,
        provideAppConfigServiceMock(),
        { provide: Store, useValue: { dispatch: jest.fn() } },
      ],
    })
    store = TestBed.inject(Store)
    appConfigService = TestBed.inject(AppConfigService)
    jest.spyOn(store, 'dispatch')
    appConfigService.setProperty('key', 'test')
    TestBed.inject(AppConfigStoreConnectorService)
  })

  it('should subscribe and dispatch appConfigChanged', () => {
    const expectedAction = OneCxActions.appConfigChanged({ appConfig: { key: 'test' } })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })
})


```

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/app-config-store-connector-service.ts

```ts

import { Injectable, inject, provideEnvironmentInitializer } from '@angular/core'
import { Store } from '@ngrx/store'
import { OneCxActions } from '../onecx-actions'
import { AppConfigService } from '@onecx/angular-integration-interface'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export function provideAppConfigStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(AppConfigStoreConnectorService)),
    AppConfigStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class AppConfigStoreConnectorService {
  private appConfigService = inject(AppConfigService)
  private store = inject(Store)
  constructor() {
    this.appConfigService.config$
      .pipe(untilDestroyed(this))
      .subscribe((appConfig) => {
        this.store.dispatch(OneCxActions.appConfigChanged({ appConfig }))
      })
  }
}


```

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/configuration-store-connector-service.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { ConfigurationStoreConnectorService } from './configuration-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { ConfigurationService } from '@onecx/angular-integration-interface'

describe('ConfigurationStoreConnectorService', () => {
  let store: Store
  let mockConfigService: any

  beforeEach(() => {
    mockConfigService = { getConfig: jest.fn().mockResolvedValue({ foo: 'bar' }) }
    TestBed.configureTestingModule({
      providers: [
        ConfigurationStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: ConfigurationService, useValue: mockConfigService },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
    TestBed.inject(ConfigurationStoreConnectorService)
  })

  it('should get config and dispatch configChanged', async () => {
    const expectedAction = OneCxActions.configChanged({ config: { foo: 'bar' } })
    await Promise.resolve()
    expect(mockConfigService.getConfig).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })
})


```

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/configuration-store-connector-service.ts

```ts

import { Injectable, inject, provideEnvironmentInitializer } from '@angular/core'
import { UntilDestroy } from '@ngneat/until-destroy'
import { Store } from '@ngrx/store'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { OneCxActions } from '../onecx-actions'

export function provideConfigurationStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(ConfigurationStoreConnectorService)),
    ConfigurationStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class ConfigurationStoreConnectorService {
  private configService = inject(ConfigurationService)
  private store = inject(Store)
  constructor() {
    this.configService.getConfig().then((config: any) => {
      if (config) {
        this.store.dispatch(OneCxActions.configChanged({ config }))
      }
    })
  }
}


```

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/current-mfe-store-connector-service.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentMfeStoreConnectorService } from './current-mfe-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { MfeInfo } from '@onecx/integration-interface'
import { AppStateServiceMock, provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'

describe('CurrentMfeStoreConnectorService', () => {
  let store: Store
  let appStateServiceMock: AppStateServiceMock
  const mockMfe: MfeInfo = {
    mountPath: '/mfe1',
    remoteBaseUrl: 'http://localhost:4201',
    baseHref: '/mfe1/',
    shellName: 'shell',
    appId: 'mfe1',
    productName: 'MFE 1',
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CurrentMfeStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        provideAppStateServiceMock(),
      ],
    })
    store = TestBed.inject(Store)
    appStateServiceMock = TestBed.inject(AppStateServiceMock)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe and dispatch currentMfeChanged', () => {
    TestBed.inject(CurrentMfeStoreConnectorService)
    
    appStateServiceMock.currentMfe$.publish(mockMfe)
    
    const expectedAction = OneCxActions.currentMfeChanged({ currentMfe: mockMfe })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })
})


```

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/current-mfe-store-connector-service.ts

```ts

import { Injectable, inject, provideEnvironmentInitializer } from '@angular/core'
import { Store } from '@ngrx/store'
import { MfeInfo } from '@onecx/integration-interface'
import { OneCxActions } from '../onecx-actions'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { AppStateService } from '@onecx/angular-integration-interface'

export function provideCurrentMfeStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(CurrentMfeStoreConnectorService)),
    CurrentMfeStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class CurrentMfeStoreConnectorService {
  private appStateService = inject(AppStateService)
  private store = inject(Store)
  constructor() {
    this.appStateService.currentMfe$
      .pipe(untilDestroyed(this))
      .subscribe((currentMfe: MfeInfo) => {
        this.store.dispatch(OneCxActions.currentMfeChanged({ currentMfe }))
      })
  }
}


```

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/current-page-store-connector-service.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentPageStoreConnectorService } from './current-page-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { PageInfo } from '@onecx/integration-interface'
import { AppStateServiceMock, provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'

describe('CurrentPageStoreConnectorService', () => {
  let store: Store
  let appStateServiceMock: AppStateServiceMock
  const mockPage: PageInfo = { path: '/path' }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CurrentPageStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        provideAppStateServiceMock(),
      ],
    })
    store = TestBed.inject(Store)
    appStateServiceMock = TestBed.inject(AppStateServiceMock)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe and dispatch currentPageChanged', () => {
    TestBed.inject(CurrentPageStoreConnectorService)
    appStateServiceMock.currentPage$.publish(mockPage)
    
    const expectedAction = OneCxActions.currentPageChanged({ currentPage: mockPage })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })
})


```

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/current-page-store-connector-service.ts

```ts

import { Injectable, inject, provideEnvironmentInitializer } from '@angular/core'
import { Store } from '@ngrx/store'
import { PageInfo } from '@onecx/integration-interface'
import { OneCxActions } from '../onecx-actions'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { AppStateService } from '@onecx/angular-integration-interface'

export function provideCurrentPageStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(CurrentPageStoreConnectorService)),
    CurrentPageStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class CurrentPageStoreConnectorService {
  private appStateService = inject(AppStateService)
  private store = inject(Store)
  constructor() {
    this.appStateService.currentPage$
      .pipe(untilDestroyed(this))
      .subscribe((currentPage: PageInfo | undefined) => {
        this.store.dispatch(OneCxActions.currentPageChanged({ currentPage }))
      })
  }
}


```

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/current-theme-store-connector-service.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentThemeStoreConnectorService } from './current-theme-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { Theme } from '@onecx/integration-interface'
import { FakeTopic } from '@onecx/accelerator'

jest.mock('@onecx/integration-interface', () => {
  const actual = jest.requireActual('@onecx/integration-interface')
  return {
    ...actual,
    CurrentThemeTopic: jest.fn().mockImplementation(() => {
      return new FakeTopic<Theme>()
    }),
  }
})

describe('CurrentThemeStoreConnectorService', () => {
  let store: Store
  let fakeTopic: FakeTopic<Theme>
  const mockTheme: Theme = { id: 'theme1', name: 'Theme 1', properties: {} }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CurrentThemeStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe and dispatch currentThemeChanged', () => {
    const service = TestBed.inject(CurrentThemeStoreConnectorService)
    fakeTopic = (service as any).currentThemeTopic$ as FakeTopic<Theme>
    
    fakeTopic.publish(mockTheme)
    const expectedAction = OneCxActions.currentThemeChanged({ currentTheme: mockTheme })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })

  it('should destroy on ngOnDestroy', () => {
    const service = TestBed.inject(CurrentThemeStoreConnectorService)
    fakeTopic = (service as any).currentThemeTopic$ as FakeTopic<Theme>

    const destroySpy = jest.spyOn(fakeTopic, 'destroy')
    service.ngOnDestroy()
    expect(destroySpy).toHaveBeenCalled()
  })
})


```

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/current-theme-store-connector-service.ts

```ts

import { Injectable, OnDestroy, inject, provideEnvironmentInitializer } from '@angular/core'
import { Store } from '@ngrx/store'
import { OneCxActions } from '../onecx-actions'
import { CurrentThemeTopic, Theme } from '@onecx/integration-interface'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export function provideCurrentThemeStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(CurrentThemeStoreConnectorService)),
    CurrentThemeStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class CurrentThemeStoreConnectorService implements OnDestroy {
  private currentThemeTopic$ = new CurrentThemeTopic()
  private store = inject(Store)
  constructor() {
    this.currentThemeTopic$
      .pipe(untilDestroyed(this))
      .subscribe((currentTheme: Theme) => {
        this.store.dispatch(OneCxActions.currentThemeChanged({ currentTheme }))
      })
  }
  ngOnDestroy(): void {
    this.currentThemeTopic$.destroy()
  }
}


```

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/current-workspace-store-connector-service.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentWorkspaceStoreConnectorService } from './current-workspace-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { Workspace } from '@onecx/integration-interface'
import { AppStateServiceMock, provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'

describe('CurrentWorkspaceStoreConnectorService', () => {
  let store: Store
  let appStateServiceMock: AppStateServiceMock
  const mockWorkspace: Workspace = {
    id: 'ws1',
    baseUrl: 'http://localhost',
    workspaceName: 'Workspace 1',
    portalName: 'Portal',
    microfrontendRegistrations: [],
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CurrentWorkspaceStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        provideAppStateServiceMock(),
      ],
    })
    store = TestBed.inject(Store)
    appStateServiceMock = TestBed.inject(AppStateServiceMock)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe and dispatch currentWorkspaceChanged', () => {
    TestBed.inject(CurrentWorkspaceStoreConnectorService)
    appStateServiceMock.currentWorkspace$.publish(mockWorkspace)
    const expectedAction = OneCxActions.currentWorkspaceChanged({ currentWorkspace: mockWorkspace })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })
})


```

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/current-workspace-store-connector-service.ts

```ts

import { Injectable, inject, provideEnvironmentInitializer } from '@angular/core'
import { Store } from '@ngrx/store'
import { OneCxActions } from '../onecx-actions'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Workspace } from '@onecx/integration-interface'
import { AppStateService } from '@onecx/angular-integration-interface'

export function provideCurrentWorkspaceStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(CurrentWorkspaceStoreConnectorService)),
    CurrentWorkspaceStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class CurrentWorkspaceStoreConnectorService {
  private appStateService = inject(AppStateService)
  private store = inject(Store)
  constructor() {
    this.appStateService.currentWorkspace$
      .pipe(untilDestroyed(this))
      .subscribe((currentWorkspace: Workspace) => {
        this.store.dispatch(OneCxActions.currentWorkspaceChanged({ currentWorkspace }))
      })
  }
}


```

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/index.ts

```ts

export * from './navigated-event-store-connector-service'
export * from './permissions-store-connector-service'
export * from './configuration-store-connector-service'
export * from './current-mfe-store-connector-service'
export * from './current-page-store-connector-service'
export * from './current-theme-store-connector-service'
export * from './current-workspace-store-connector-service'
export * from './app-config-store-connector-service'

```

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/navigated-event-store-connector-service.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { NavigatedEventStoreConnectorService } from './navigated-event-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { EventType, CurrentLocationTopicPayload } from '@onecx/integration-interface'
import { Capability } from '@onecx/angular-integration-interface'
import { AppStateServiceMock, provideAppStateServiceMock, provideShellCapabilityServiceMock, ShellCapabilityServiceMock } from '@onecx/angular-integration-interface/mocks'
import { FakeTopic } from '@onecx/accelerator'

jest.mock('@onecx/integration-interface', () => {
  const actual = jest.requireActual('@onecx/integration-interface')
  return {
    ...actual,
    EventsTopic: jest.fn().mockImplementation(() => {
      return new FakeTopic<any>()
    }),
  }
})

describe('NavigatedEventStoreConnectorService', () => {
  let store: any
  let service: NavigatedEventStoreConnectorService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavigatedEventStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        provideShellCapabilityServiceMock(),
        provideAppStateServiceMock()
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe to currentLocation$ and dispatch when capability is present', () => {
    ShellCapabilityServiceMock.setCapabilities([Capability.CURRENT_LOCATION_TOPIC])
    const mockLocationPayload: CurrentLocationTopicPayload = { url: '/test-page', isFirst: false }
    service = TestBed.inject(NavigatedEventStoreConnectorService)
    const appStateServiceMock = TestBed.inject(AppStateServiceMock)
    
    appStateServiceMock.currentLocation$.publish(mockLocationPayload)
    
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.navigated({ event: mockLocationPayload }))
  })

  it('should subscribe to eventsTopic$ and dispatch when capability is missing', () => {
    ShellCapabilityServiceMock.setCapabilities([Capability.PARAMETERS_TOPIC])
    const mockEventPayload = { foo: 'bar' }
    service = TestBed.inject(NavigatedEventStoreConnectorService)
    const eventsTopic = (service as any).eventsTopic$ as FakeTopic<any>
    
    eventsTopic.publish({ type: EventType.NAVIGATED, payload: mockEventPayload })
    
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.navigated({ event: mockEventPayload }))
  })

  it('should destroy eventsTopic$ on ngOnDestroy', () => {
    service = TestBed.inject(NavigatedEventStoreConnectorService)
    const eventsTopic = (service as any).eventsTopic$ as FakeTopic<any>
    const destroySpy = jest.spyOn(eventsTopic, 'destroy')
    
    service.ngOnDestroy()
    
    expect(destroySpy).toHaveBeenCalled()
  })
})


```

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/navigated-event-store-connector-service.ts

```ts

import { Injectable, OnDestroy, inject, provideEnvironmentInitializer } from '@angular/core'
import { Store } from '@ngrx/store'
import { EventsTopic, EventType } from '@onecx/integration-interface'
import { filter } from 'rxjs'
import { CurrentLocationTopicPayload, TopicEventType } from '@onecx/integration-interface'
import { Capability, ShellCapabilityService } from '@onecx/angular-integration-interface'
import { Observable } from 'rxjs'
import { OneCxActions } from '../onecx-actions'
import { AppStateService } from '@onecx/angular-integration-interface'

export function provideNavigatedEventStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(NavigatedEventStoreConnectorService)),
    NavigatedEventStoreConnectorService,
  ]
}

@Injectable()
export class NavigatedEventStoreConnectorService implements OnDestroy {
  private appStateService = inject(AppStateService)
  private capabilityService = inject(ShellCapabilityService)
  private _eventsTopic$: EventsTopic | undefined
  get eventsTopic$() {
    this._eventsTopic$ ??= new EventsTopic()
    return this._eventsTopic$
  }
  set eventsTopic$(source: EventsTopic) {
    this._eventsTopic$ = source
  }
  private store = inject(Store)
  constructor() {
    let observable: Observable<TopicEventType | CurrentLocationTopicPayload> =
      this.appStateService.currentLocation$.asObservable()
    if (!this.capabilityService.hasCapability(Capability.CURRENT_LOCATION_TOPIC)) {
      observable = this.eventsTopic$.pipe(filter((e) => e.type === EventType.NAVIGATED))
    }
    observable.subscribe((navigatedEvent) => {
      let event: unknown = navigatedEvent as CurrentLocationTopicPayload
      if (!this.capabilityService.hasCapability(Capability.CURRENT_LOCATION_TOPIC)) {
        event = (navigatedEvent as TopicEventType).payload
      }
      this.store.dispatch(OneCxActions.navigated({ event }))
    })
  }
  ngOnDestroy(): void {
    this._eventsTopic$?.destroy()
  }
}


```

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/permissions-store-connector-service.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { PermissionsStoreConnectorService } from './permissions-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { UserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { UserService } from '@onecx/angular-integration-interface'

describe('PermissionsStoreConnectorService', () => {
  let store: Store
  let userServiceMock: UserServiceMock
  const mockPermissions = ['perm1', 'perm2']

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PermissionsStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        UserServiceMock,
        { provide: UserService, useExisting: UserServiceMock },
      ],
    })
    store = TestBed.inject(Store)
    userServiceMock = TestBed.inject(UserServiceMock)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe and dispatch permissionsChanged', () => {
    TestBed.inject(PermissionsStoreConnectorService)
    userServiceMock.permissionsTopic$.publish(mockPermissions)
    const expectedAction = OneCxActions.permissionsChanged({ permissions: mockPermissions })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })
})


```

### File: ngrx-integration-interface/src/lib/store-connector/store-connectors/permissions-store-connector-service.ts

```ts

import { Injectable, inject, provideEnvironmentInitializer } from '@angular/core'
import { Store } from '@ngrx/store'
import { OneCxActions } from '../onecx-actions'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { UserService } from '@onecx/angular-integration-interface'

export function providePermissionsStoreConnector() {
  return [
    provideEnvironmentInitializer(() => inject(PermissionsStoreConnectorService)),
    PermissionsStoreConnectorService,
  ]
}

@UntilDestroy()
@Injectable()
export class PermissionsStoreConnectorService {
  private userService = inject(UserService)
  private store = inject(Store)
  constructor() {
    this.userService.getPermissions()
      .pipe(untilDestroyed(this))
      .subscribe((permissions) => {
        this.store.dispatch(OneCxActions.permissionsChanged({ permissions }))
      })
  }
}


```


