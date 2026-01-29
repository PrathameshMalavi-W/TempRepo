# Files from C:\Users\prath\onecx\onecx-ui\onecx-portal-ui-libs\libs\integration-interface

## Folder: integration-interface (9 files)

### File: integration-interface/.eslintrc.json

```json

{
  "extends": ["../../.eslintrc.json"],
  "ignorePatterns": ["!**/*"],
  "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
      "rules": {}
    },
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {}
    },
    {
      "files": ["*.js", "*.jsx"],
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

### File: integration-interface/jest.config.ts

```ts

/* eslint-disable */
import { createReportsConfig } from '../../jest-config-factory'

export default {
  displayName: 'integration-interface',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  ...createReportsConfig('integration-interface'),
}


```

### File: integration-interface/migrations.json

```json

{
  "generators": {
    "warn-for-events-topic-navigated": {
      "cli": "nx",
      "version": "5.34.6",
      "description": "Detects and warns for usage of the EventsTopic in the context of navigation",
      "factory": "migrations/v5/warn-for-events-topic-navigated"
    },
    "warn-for-events-publisher-navigated": {
      "cli": "nx",
      "version": "5.34.6",
      "description": "Detects and warns for usage of the EventsPublisher in the context of navigation",
      "factory": "migrations/v5/warn-for-events-publisher-navigated"
    },
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

### File: integration-interface/package.json

```json

{
  "name": "@onecx/integration-interface",
  "version": "7.0.0-rc.13",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/onecx/onecx-portal-ui-libs"
  },
  "peerDependencies": {
    "tslib": "^2.6.3",
    "rxjs": "^7.8.1",
    "@onecx/accelerator": "^7.0.0-rc.13",
    "@onecx/nx-migration-utils": "^7.0.0-rc.13",
    "@nx/devkit": "^20.3.0",
    "@phenomnomnominal/tsquery": "^6",
    "typescript": "^5.5.4"
  },
  "type": "commonjs",
  "main": "./src/index.js",
  "typings": "./src/index.d.ts",
  "publishConfig": {
    "access": "public"
  },
  "nx-migrations": {
    "migrations": "./migrations.json"
  }
}


```

### File: integration-interface/project.json

```json

{
  "name": "integration-interface",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/integration-interface/src",
  "projectType": "library",
  "targets": {
    "build-migrations": {
      "dependsOn": [
        "build"
      ],
      "executor": "nx:run-commands",
      "options": {
        "commands": [
          "tsc -p libs/integration-interface/migrations/tsconfig.migrations.json"
        ]
      }
    },
    "build": {
      "executor": "@nx/js:tsc",
      "outputs": [
        "{options.outputPath}"
      ],
      "options": {
        "outputPath": "dist/libs/integration-interface",
        "main": "libs/integration-interface/src/index.ts",
        "tsConfig": "libs/integration-interface/tsconfig.lib.json",
        "assets": [
          "libs/integration-interface/*.md",
          {
            "input": "./libs/integration-interface",
            "glob": "migrations.json",
            "output": "."
          }
        ]
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint",
      "outputs": [
        "{options.outputFile}"
      ],
      "options": {
        "lintFilePatterns": [
          "libs/integration-interface/**/*.ts",
          "libs/integration-interface/package.json"
        ]
      }
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": [
        "{workspaceRoot}/coverage/{projectRoot}"
      ],
      "options": {
        "jestConfig": "libs/integration-interface/jest.config.ts",
        "passWithNoTests": true
      },
      "configurations": {
        "ci": {
          "ci": true,
          "codeCoverage": true
        }
      }
    },
    "release": {
      "executor": "@onecx/release:update-build-publish",
      "options": {
        "buildTarget": "build-migrations"
      }
    }
  },
  "tags": []
}

```

### File: integration-interface/sonar-project.properties

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
sonar.projectKey=onecx-portal-ui-libs-integration-interface
sonar.projectName=onecx-portal-ui-libs-integration-interface
#
sonar.scm.disabled=true
sonar.sources=src
sonar.tests=src
sonar-language="js"
sonar.sourceEncoding=UTF-8
#
# reporting
sonar.javascript.coveragePlugin=lcov
sonar.javascript.lcov.reportPaths=../../reports/integration-interface/coverage/lcov.info
sonar.testExecutionReportPaths=../../reports/integration-interface/sonarqube_report.xml
sonar.working.directory=../../reports/integration-interface/.scannerwork
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

### File: integration-interface/tsconfig.json

```json

{
  "extends": "../../tsconfig.base.json",
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
      "path": "./tsconfig.lib.json"
    },
    {
      "path": "./tsconfig.spec.json"
    }
  ]
}


```

### File: integration-interface/tsconfig.lib.json

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "declaration": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["jest.config.ts", "src/**/*.spec.ts", "src/**/*.test.ts"]
}


```

### File: integration-interface/tsconfig.spec.json

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "module": "commonjs",
    "types": ["jest", "node"]
  },
  "include": ["jest.config.ts", "src/**/*.test.ts", "src/**/*.spec.ts", "src/**/*.d.ts"]
}


```

## Folder: integration-interface/migrations (3 files)

### File: integration-interface/migrations/index.ts

```ts

export * from './v6/migrate-onecx-to-v6'
export * from './v5/warn-for-events-topic-navigated'
export * from './v5/warn-for-events-publisher-navigated'


```

### File: integration-interface/migrations/tsconfig.json

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

### File: integration-interface/migrations/tsconfig.migrations.json

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

## Folder: integration-interface/migrations/v5 (2 files)

### File: integration-interface/migrations/v5/warn-for-events-publisher-navigated.ts

```ts

import { Tree } from '@nx/devkit'
import { detectMethodCallsInFiles, printWarnings } from '@onecx/nx-migration-utils'
import { CallExpression } from 'typescript'

function argsMatchExpectedPayload(callExpression: CallExpression): boolean {
  return callExpression.arguments.some((arg) => {
    const argText = arg.getText()
    return /type:\s*['"]navigated['"]/.test(argText)
  })
}

export default async function warnForEventsPublisherNavigated(tree: Tree) {
  const warningForPotentialMatches =
    'âš ï¸ EventsPublisher usages were detected. Please double-check if EventsPublisher is used for publishing navigation events and switch to CurrentLocationPublisher if so.'

  const warningForExactMatches =
    'âš ï¸ You are using EventsPublisher to publish navigation events. Please switch to using CurrentLocationPublisher.'

  const potentialMatches = detectMethodCallsInFiles(tree, './src', 'publish', 'EventsPublisher')

  const exactMatches = new Map<string, CallExpression[]>()
  const remainingPotentialMatches = new Map<string, CallExpression[]>()
  
  potentialMatches.forEach((calls, file) => {
    const filteredCalls = calls.filter((call) => argsMatchExpectedPayload(call))
    if (filteredCalls.length > 0) {
      exactMatches.set(file, filteredCalls)
    } else {
      remainingPotentialMatches.set(file, calls)
    }
  })

  if (exactMatches.size > 0) {
    printWarnings(warningForExactMatches, Array.from(exactMatches.keys()))
  }
  if (remainingPotentialMatches.size > 0) {
    printWarnings(warningForPotentialMatches, Array.from(remainingPotentialMatches.keys()))
  }
}


```

### File: integration-interface/migrations/v5/warn-for-events-topic-navigated.ts

```ts

import { Tree } from '@nx/devkit'
import { detectMethodCallsInFiles, printWarnings } from '@onecx/nx-migration-utils'
import { CallExpression } from 'typescript'
import { ast, query } from '@phenomnomnominal/tsquery'

function argsContainFilterForTypeNavigated(callExpression: CallExpression): boolean {
  const callExpressionAst = ast(callExpression.getText())
  const filterCallsSelector = `CallExpression:has(Identifier[name="filter"]):has(ArrowFunction:has(BinaryExpression:has(PropertyAccessExpression:has(Identifier):has(Identifier[name="type"])):has(StringLiteral[value="navigated"])))`
  const filterCalls = query(callExpressionAst, filterCallsSelector)
  return filterCalls.length > 0
}

export default async function warnForEventsTopicNavigated(tree: Tree) {
  const warningForPotentialMatches =
    'âš ï¸ EventsTopic usages were detected. Please double-check if EventsTopic is used for subscribing to navigation events and switch to CurrentLocationTopic/appStateService.currentLocation$ if so.'

  const warningForExactMatches =
    'âš ï¸ You are using EventsTopic to listen for navigation events. Please switch to using CurrentLocationTopic/appStateService.currentLocation$.'

  const potentialMatches = detectMethodCallsInFiles(tree, './src', 'pipe', 'EventsTopic')

  const exactMatches = new Map<string, CallExpression[]>()
  const remainingPotentialMatches = new Map<string, CallExpression[]>()

  potentialMatches.forEach((calls, file) => {
    const filteredCalls = calls.filter((call) => argsContainFilterForTypeNavigated(call))
    if (filteredCalls.length > 0) {
      exactMatches.set(file, filteredCalls)
    } else {
      remainingPotentialMatches.set(file, calls)
    }
  })

  if (exactMatches.size > 0) {
    printWarnings(warningForExactMatches, Array.from(exactMatches.keys()))
  }
  if (remainingPotentialMatches.size > 0) {
    printWarnings(warningForPotentialMatches, Array.from(remainingPotentialMatches.keys()))
  }
}


```

## Folder: integration-interface/migrations/v6 (1 files)

### File: integration-interface/migrations/v6/migrate-onecx-to-v6.ts

```ts

import { Tree } from '@nx/devkit'
import { commonMigrateOnecxToV6 } from '@onecx/nx-migration-utils'

export default async function migrateOnecxToV6(tree: Tree) {
  await commonMigrateOnecxToV6(tree)
}


```

## Folder: integration-interface/src (1 files)

### File: integration-interface/src/index.ts

```ts

export * from './lib/topics/current-mfe/v1/current-mfe.topic'
export * from './lib/topics/current-mfe/v1/mfe-info.model'
export * from './lib/topics/current-page/v1/current-page.topic'
export * from './lib/topics/current-page/v1/page-info.model'

export * from './lib/topics/global-error/v1/global-error.topic'

export * from './lib/topics/global-loading/v1/global-loading.topic'

export * from './lib/topics/current-theme/v1/current-theme.topic'
export * from './lib/topics/current-theme/v1/theme.model'

export * from './lib/topics/user-profile/v1/user-profile.model'
export * from './lib/topics/user-profile/v1/user-profile.topic'

export * from './lib/topics/configuration/v1/configuration.topic'

export * from './lib/topics/current-workspace/v1/current-workspace.topic'
export * from './lib/topics/current-workspace/v1/mfe-portal-registration.model'
export * from './lib/topics/current-workspace/v1/workspace.model'
export * from './lib/topics/current-workspace/v1/route.model'
export * from './lib/topics/current-workspace/v1/endpoint.model'

export * from './lib/topics/is-authenticated/v1/isAuthenticated.topic'

export * from './lib/topics/message/v1/message.model'
export * from './lib/topics/message/v1/message.topic'

export * from './lib/topics/remote-components/v1/remote-component.model'
export * from './lib/topics/remote-components/v1/remote-components-info.model'
export * from './lib/topics/remote-components/v1/slot.model'
export * from './lib/topics/remote-components/v1/remote-components.topic'

export * from './lib/topics/permissions/v1/permissions.topic'

export * from './lib/topics/permissions-rpc/v1/permissions-rpc.topic'
export * from './lib/topics/permissions-rpc/v1/permissions-rpc.model'

export * from './lib/topics/events/v1/events-topic'
export * from './lib/topics/events/v1/topic-event-type'
export * from './lib/topics/events/v1/event-type'
export * from './lib/topics/events/v1/navigated-event-type'
export * from './lib/topics/events/v1/navigated-event-payload'

export * from './lib/topics/resized-events/v1/resized-event-type'
export * from './lib/topics/resized-events/v1/resized-events.topic'
export * from './lib/topics/resized-events/v1/resized-update-requested-type'
export * from './lib/topics/resized-events/v1/slot-groups-resized-type'
export * from './lib/topics/resized-events/v1/slots-resized-type'
export * from './lib/topics/resized-events/v1/topic-resized-event-type'

export * from './lib/topics/current-location/v1/current-location.model'
export * from './lib/topics/current-location/v1/current-location.topic'

export * from './lib/topics/parameters/v1/parameters.topic'

export * from './lib/topics/resized-events/v1/resized-events.topic'


```

## Folder: integration-interface/src/lib/topics/configuration/v1 (1 files)

### File: integration-interface/src/lib/topics/configuration/v1/configuration.topic.ts

```ts

import { Topic } from '@onecx/accelerator'

export interface Config {
  [key: string]: string
}

export class ConfigurationTopic extends Topic<Config> {
  constructor() {
    super('configuration', 1)
  }
}


```

## Folder: integration-interface/src/lib/topics/current-location/v1 (2 files)

### File: integration-interface/src/lib/topics/current-location/v1/current-location.model.ts

```ts

export interface CurrentLocationTopicPayload {
    url?: string,
    isFirst: boolean
}

```

### File: integration-interface/src/lib/topics/current-location/v1/current-location.topic.ts

```ts

import { Topic, TopicPublisher } from '@onecx/accelerator'
import { CurrentLocationTopicPayload } from './current-location.model'

export class CurrentLocationPublisher extends TopicPublisher<CurrentLocationTopicPayload> {
  constructor() {
    super('currentLocation', 1)
  }
}

export class CurrentLocationTopic extends Topic<CurrentLocationTopicPayload> {
  constructor() {
    super('currentLocation', 1)
  }
}


```

## Folder: integration-interface/src/lib/topics/current-mfe/v1 (2 files)

### File: integration-interface/src/lib/topics/current-mfe/v1/current-mfe.topic.ts

```ts

import { Topic } from '@onecx/accelerator'
import { MfeInfo } from './mfe-info.model'

export class CurrentMfeTopic extends Topic<MfeInfo> {
  constructor() {
    super('currentMfe', 1)
  }
}


```

### File: integration-interface/src/lib/topics/current-mfe/v1/mfe-info.model.ts

```ts

export interface MfeInfo {
    mountPath: string
    version?: string
    remote?: string
    remoteBaseUrl: string
    baseHref: string
    shellName: string
    displayName?: string
    appId: string
    productName: string
    remoteName?: string
    elementName?: string
  }
  

```

## Folder: integration-interface/src/lib/topics/current-page/v1 (3 files)

### File: integration-interface/src/lib/topics/current-page/v1/current-page.spec.ts

```ts

/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { CurrentPageTopic } from './current-page.topic'

describe('CurrentPageTopic', () => {
  const origAddEventListener = window.addEventListener
  const origPostMessage = window.postMessage

  let listeners: any[] = []
  window.addEventListener = (_type: any, listener: any) => {
    listeners.push(listener)
  }

  window.removeEventListener = (_type: any, listener: any) => {
    listeners = listeners.filter((l) => l !== listener)
  }

  window.postMessage = (m: any) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    listeners.forEach((l) => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }))
  }

  const mutationObserverMock = jest.fn(function MutationObserver(callback) {
    this.observe = jest.fn()
    this.disconnect = jest.fn()
    this.trigger = (mockedMutationsList: any) => {
      callback(mockedMutationsList, this)
    }
    return this
  })
  global.MutationObserver = mutationObserverMock

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.postMessage = origPostMessage
  })

  let values1: any[]

  let testCurrentPageTopic1: CurrentPageTopic

  const changeLocation = (pathName: string) => {
    window.history.pushState({}, '', pathName)
    mutationObserverMock.mock.instances.forEach((m) => m.trigger())
  }

  beforeEach(() => {
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    window['@onecx/accelerator'].topic.initDate = Date.now() - 1000000

    jest.restoreAllMocks()
    listeners = []

    values1 = []

    testCurrentPageTopic1 = new CurrentPageTopic()

    testCurrentPageTopic1.subscribe((v: any) => values1.push(v))
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should have `/` if location is not changed initially', () => {
    const expected = [
      {
        path: '/',
        helpArticleId: 'help article id',
        permission: 'permission',
        pageName: 'page name',
        applicationId: 'app id',
      },
    ]

    const pageInfo1 = {
      path: window.location.pathname,
      helpArticleId: 'help article id',
      permission: 'permission',
      pageName: 'page name',
      applicationId: 'app id',
    }

    testCurrentPageTopic1.publish(pageInfo1)

    expect(values1).toEqual(expected)
  })

  it('should have pageInfo with the correct path after changeLocation and publish', () => {
    changeLocation('/test1')

    const expected = [
      undefined,
      {
        path: '/test1',
        helpArticleId: 'help article id',
        permission: 'permission',
        pageName: 'page name',
        applicationId: 'app id',
      },
    ]

    const pageInfo1 = {
      path: window.location.pathname,
      helpArticleId: 'help article id',
      permission: 'permission',
      pageName: 'page name',
      applicationId: 'app id',
    }

    testCurrentPageTopic1.publish(pageInfo1)

    expect(values1).toEqual(expected)
  })

  it('should have undefined if path of changeLocation do not match with path of pageInfo in publish ', () => {
    changeLocation('/test1')

    const expected = [undefined]

    const pageInfo1 = {
      path: '/test2',
      helpArticleId: 'help article id',
      permission: 'permission',
      pageName: 'page name',
      applicationId: 'app id',
    }

    testCurrentPageTopic1.publish(pageInfo1)

    expect(values1).toEqual(expected)
  })

  it('should throw error if document.body is null  ', () => {
    const mock = jest.spyOn(document, 'querySelector')
    mock.mockReturnValue(null)

    expect(() => new CurrentPageTopic()).toThrowError('could not listen to location changes')
  })
})


```

### File: integration-interface/src/lib/topics/current-page/v1/current-page.topic.ts

```ts

import { Topic } from '@onecx/accelerator'
import { combineLatest, distinctUntilChanged, map } from 'rxjs'
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject'
import { PageInfo } from './page-info.model'

/**
 * This topic will only fire when pageInfo.path matches document.location.pathname,
 * if not it will fire undefined.
 */
export class CurrentPageTopic extends Topic<PageInfo | undefined> {
  private currentPath$ = new BehaviorSubject<string>(document.location.pathname)

  constructor() {
    super('currentPage', 1)
    this.watchForPathChanges()
  }

  public override asObservable() {
    return combineLatest([super.asObservable(), this.currentPath$.pipe(distinctUntilChanged())]).pipe(
      map(([v, path]) => ((<PageInfo>v).path === path ? v : undefined))
    )
  }

  private watchForPathChanges() {
    const body = document.querySelector('body')
    if (body === null) {
      console.error('could not listen to location changes')
      throw new Error('could not listen to location changes')
    }
    const observer = new MutationObserver(() => {
      this.currentPath$.next(document.location.pathname)
    })
    observer.observe(body, { childList: true, subtree: true })
  }
}


```

### File: integration-interface/src/lib/topics/current-page/v1/page-info.model.ts

```ts

export interface PageInfo {
    path: string
    helpArticleId?: string
    pageName?: string
    permission?: string
    applicationId?: string
  }
  

```

## Folder: integration-interface/src/lib/topics/current-theme/v1 (2 files)

### File: integration-interface/src/lib/topics/current-theme/v1/current-theme.topic.ts

```ts

import { Topic } from '@onecx/accelerator'
import { Theme } from './theme.model'

export class CurrentThemeTopic extends Topic<Theme> {
  constructor() {
    super('currentTheme', 1)
  }
}


```

### File: integration-interface/src/lib/topics/current-theme/v1/theme.model.ts

```ts

export interface Theme {
    id?: string
    assetsUpdateDate?: string
    assetsUrl?: string
    logoUrl?: string
    faviconUrl?: string
    cssFile?: string
    description?: string
    name?: string
    previewImageUrl?: string
    properties?: { [key: string]: { [key: string]: string } }
  }

```

## Folder: integration-interface/src/lib/topics/current-workspace/v1 (5 files)

### File: integration-interface/src/lib/topics/current-workspace/v1/current-workspace.topic.ts

```ts

import { Topic } from '@onecx/accelerator'
import { Workspace } from './workspace.model'

export class CurrentWorkspaceTopic extends Topic<Workspace> {
  constructor() {
    super('currentPortal', 1)
  }
}


```

### File: integration-interface/src/lib/topics/current-workspace/v1/endpoint.model.ts

```ts

export interface Endpoint {
    name?: string
    path?: string
  }

```

### File: integration-interface/src/lib/topics/current-workspace/v1/mfe-portal-registration.model.ts

```ts

/**
 * @deprecated will be removed
 */
export interface MicrofrontendRegistration {
  creationDate?: string
  creationUser?: string
  modificationDate?: string
  modificationUser?: string
  id?: string
  appId?: string
  mfeId: string
  baseUrl: string
}


```

### File: integration-interface/src/lib/topics/current-workspace/v1/route.model.ts

```ts

import {Endpoint} from './endpoint.model'

export interface Route {
    url?: string
    baseUrl?: string
    remoteEntryUrl?: string
    appId?: string
    productName?: string
    technology?: string
    exposedModule?: string
    pathMatch?: string
    remoteName?: string
    elementName?: string
    displayName?: string
    endpoints?: Array<Endpoint>
  }

```

### File: integration-interface/src/lib/topics/current-workspace/v1/workspace.model.ts

```ts

import { MicrofrontendRegistration } from './mfe-portal-registration.model'
import { Route } from './route.model'

export interface Workspace {
  baseUrl: string
  workspaceName: string
  /**
   * @deprecated will be renamed to workspaceName
   */
  portalName: string
  displayName?: string
  homePage?: string
  routes?: Array<Route>
  /**
   * @deprecated will be removed
   */
  id?: string
  /**
   * @deprecated will be removed
   */
  description?: string
  /**
   * @deprecated will be removed
   */
  themeId?: string
  /**
   * @deprecated will be removed
   */
  themeName?: string
  /**
   * @deprecated will be removed
   */
  footerLabel?: string
  /**
   * @deprecated will be removed
   */
  companyName?: string
  /**
   * @deprecated will be removed
   */
  portalRoles?: string[]
  /**
   * @deprecated will be removed
   */
  imageUrls?: string[]
  /**
   * @deprecated will be removed
   */
  address?: {
    city?: string
    country?: string
    postalCode?: string
    street?: string
    streetNo?: string
  }
  /**
   * @deprecated will be removed
   */
  phoneNumber?: string
  /**
   * @deprecated will be removed
   */
  rssFeedUrl?: string
  /**
   * @deprecated will be removed
   */
  subjectLinks?: [
    {
      label?: string
      url?: string
    },
  ]
  /**
   * @deprecated will be removed
   */
  microfrontendRegistrations: Array<MicrofrontendRegistration>
  /**
   * @deprecated will be removed
   */
  logoUrl?: string
  /**
   * @deprecated will be removed
   */
  userUploaded?: boolean
  /**
   * @deprecated will be removed
   */
  logoSmallImageUrl?: string
}


```

## Folder: integration-interface/src/lib/topics/events/v1 (5 files)

### File: integration-interface/src/lib/topics/events/v1/events-topic.ts

```ts

import { Topic, TopicPublisher } from '@onecx/accelerator'
import { TopicEventType } from './topic-event-type'

export class EventsPublisher extends TopicPublisher<TopicEventType> {
  constructor() {
    super('events', 1)
  }
}

export class EventsTopic extends Topic<TopicEventType> {
  constructor() {
    super('events', 1, false)
  }
}


```

### File: integration-interface/src/lib/topics/events/v1/event-type.ts

```ts

export enum EventType {
  NAVIGATED = 'navigated',
  AUTH_LOGOUT_BUTTON_CLICKED = 'authentication#logoutButtonClicked',
}


```

### File: integration-interface/src/lib/topics/events/v1/navigated-event-payload.ts

```ts

export type NavigatedEventPayload = {
  url: string | undefined
  isFirst: boolean
}


```

### File: integration-interface/src/lib/topics/events/v1/navigated-event-type.ts

```ts

import { EventType } from './event-type'
import { NavigatedEventPayload } from './navigated-event-payload'
/**
 * @deprecated Use CurrentLocationTopic instead of EventsTopic for navigated events
 */
export type NavigatedEvent = {
  type: EventType.NAVIGATED
  payload: NavigatedEventPayload
}


```

### File: integration-interface/src/lib/topics/events/v1/topic-event-type.ts

```ts

import { EventType } from './event-type'
import { NavigatedEvent } from './navigated-event-type'

export type TopicEventType = NavigatedEvent | { type: EventType | string; payload?: unknown | undefined }


```

## Folder: integration-interface/src/lib/topics/global-error/v1 (1 files)

### File: integration-interface/src/lib/topics/global-error/v1/global-error.topic.ts

```ts

import { Topic } from '@onecx/accelerator'

export class GlobalErrorTopic extends Topic<string> {
  constructor() {
    super('globalError', 1)
  }
}


```

## Folder: integration-interface/src/lib/topics/global-loading/v1 (1 files)

### File: integration-interface/src/lib/topics/global-loading/v1/global-loading.topic.ts

```ts

import { Topic } from '@onecx/accelerator'

export class GlobalLoadingTopic extends Topic<boolean> {
  constructor() {
    super('globalLoading', 1)
  }
}


```

## Folder: integration-interface/src/lib/topics/is-authenticated/v1 (1 files)

### File: integration-interface/src/lib/topics/is-authenticated/v1/isAuthenticated.topic.ts

```ts

import { Topic } from '@onecx/accelerator'

export class IsAuthenticatedTopic extends Topic<void> {
  constructor() {
    super('isAuthenticated', 1)
  }
}


```

## Folder: integration-interface/src/lib/topics/message/v1 (2 files)

### File: integration-interface/src/lib/topics/message/v1/message.model.ts

```ts

export interface Message {
    severity?: string;
    summary?: string;
    detail?: string;
    id?: any;
    key?: string;
    life?: number;
    sticky?: boolean;
    closable?: boolean;
    data?: any;
    icon?: string;
    contentStyleClass?: string;
    styleClass?: string;
}

```

### File: integration-interface/src/lib/topics/message/v1/message.topic.ts

```ts

import { Topic } from '@onecx/accelerator'
import { Message } from './message.model'

export class MessageTopic extends Topic<Message> {
  constructor() {
    super('message', 1)
  }
}

```

## Folder: integration-interface/src/lib/topics/parameters/v1 (1 files)

### File: integration-interface/src/lib/topics/parameters/v1/parameters.topic.ts

```ts

import { Topic, TopicPublisher } from '@onecx/accelerator'

type ParameterValue = boolean | number | string | object

export interface Parameters {
  [key: string]: ParameterValue
}

export interface ApplicationParameters {
  productName: string,
  appId: string,
  parameters: Parameters
}

export interface ParametersTopicPayload {
  parameters: ApplicationParameters[]
}

export class ParametersPublisher extends TopicPublisher<ParametersTopicPayload> {
  constructor() {
    super('parameters', 1)
  }
}

export class ParametersTopic extends Topic<ParametersTopicPayload> {
  constructor() {
    super('parameters', 1)
  }
}


```

## Folder: integration-interface/src/lib/topics/permissions/v1 (1 files)

### File: integration-interface/src/lib/topics/permissions/v1/permissions.topic.ts

```ts

import { Topic } from '@onecx/accelerator'

export class PermissionsTopic extends Topic<string[]> {
  constructor() {
    super('permissions', 1)
  }
}


```

## Folder: integration-interface/src/lib/topics/permissions-rpc/v1 (2 files)

### File: integration-interface/src/lib/topics/permissions-rpc/v1/permissions-rpc.model.ts

```ts

export interface PermissionsRpc {
  appId: string
  productName: string
  permissions?: Array<string>
}


```

### File: integration-interface/src/lib/topics/permissions-rpc/v1/permissions-rpc.topic.ts

```ts

import { Topic } from '@onecx/accelerator'
import { PermissionsRpc } from './permissions-rpc.model'

export class PermissionsRpcTopic extends Topic<PermissionsRpc> {
  constructor() {
    super('permissionsRpc', 1, false)
  }
}


```

## Folder: integration-interface/src/lib/topics/remote-components/v1 (4 files)

### File: integration-interface/src/lib/topics/remote-components/v1/remote-component.model.ts

```ts

export enum Technologies {
  Angular = 'Angular',
  WebComponentScript = 'WebComponentScript',
  WebComponentModule = 'WebComponentModule',
}

export type RemoteComponent = {
  name: string
  baseUrl: string
  remoteEntryUrl: string
  appId: string
  productName: string
  exposedModule: string
  remoteName: string
  technology: Technologies
}


```

### File: integration-interface/src/lib/topics/remote-components/v1/remote-components.topic.ts

```ts

import { Topic } from '@onecx/accelerator'
import { RemoteComponentsInfo } from './remote-components-info.model'

export class RemoteComponentsTopic extends Topic<RemoteComponentsInfo> {
  constructor() {
    super('remoteComponentsInfo', 1)
  }
}


```

### File: integration-interface/src/lib/topics/remote-components/v1/remote-components-info.model.ts

```ts

import { RemoteComponent } from './remote-component.model'
import { Slot } from './slot.model'

export type RemoteComponentsInfo = { components: RemoteComponent[]; slots: Slot[] }


```

### File: integration-interface/src/lib/topics/remote-components/v1/slot.model.ts

```ts

export type Slot = {
  name: string
  components: Array<string>
}


```

## Folder: integration-interface/src/lib/topics/resized-events/v1 (7 files)

### File: integration-interface/src/lib/topics/resized-events/v1/resized-events.spec.ts

```ts

/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { ResizedEventType } from './resized-event-type'
import { ResizedEventsPublisher, ResizedEventsTopic } from './resized-events.topic'
import { RequestedEventsChangedEvent } from './resized-update-requested-type'
import { SlotGroupResizedEvent } from './slot-groups-resized-type'
import { SlotResizedEvent } from './slots-resized-type'
import { TopicResizedEventType } from './topic-resized-event-type'

describe('ResizedEventsTopic', () => {
  const origAddEventListener = window.addEventListener
  const origPostMessage = window.postMessage

  let listeners: any[] = []
  window.addEventListener = (_type: any, listener: any) => {
    listeners.push(listener)
  }

  window.removeEventListener = (_type: any, listener: any) => {
    listeners = listeners.filter((l) => l !== listener)
  }

  window.postMessage = (m: any) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    listeners.forEach((l) => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }))
  }

  const mutationObserverMock = jest.fn(function MutationObserver(callback) {
    this.observe = jest.fn()
    this.disconnect = jest.fn()
    this.trigger = (mockedMutationsList: any) => {
      callback(mockedMutationsList, this)
    }
    return this
  })
  global.MutationObserver = mutationObserverMock

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.postMessage = origPostMessage
  })

  let topicValues: TopicResizedEventType[]

  let resizedEventsTopic: ResizedEventsTopic

  beforeEach(() => {
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    window['@onecx/accelerator'].topic.initDate = Date.now() - 1000000

    jest.restoreAllMocks()
    listeners = []
    topicValues = []

    resizedEventsTopic = new ResizedEventsTopic()
    resizedEventsTopic.subscribe((value) => {
      topicValues.push(value)
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should initialize window properties', () => {
    expect(window['@onecx/integration-interface']).toBeDefined()
    expect(window['@onecx/integration-interface']['resizedEvents']).toBeDefined()
  })

  it('should request resized event for an entity', () => {
    ResizedEventsTopic.requestEvent(ResizedEventType.SLOT_RESIZED, 'test-slot')

    expect(window['@onecx/integration-interface']?.['resizedEvents']?.[ResizedEventType.SLOT_RESIZED]).toContain(
      'test-slot'
    )
    expect(topicValues.length).toBe(1)
    const value = topicValues[0] as RequestedEventsChangedEvent
    expect(value.type).toBe(ResizedEventType.REQUESTED_EVENTS_CHANGED)
    expect(value.payload.type).toBe(ResizedEventType.SLOT_RESIZED)
    expect(value.payload.name).toBe('test-slot')
  })

  it('should publish if not slot group or slot resized event', async () => {
    const event: TopicResizedEventType = {
      type: ResizedEventType.REQUESTED_EVENTS_CHANGED,
      payload: {
        type: ResizedEventType.SLOT_RESIZED,
        name: 'test-slot',
      },
    }

    await resizedEventsTopic.publish(event)

    expect(topicValues.length).toBe(1)
    expect(topicValues[0]).toBe(event)
  })

  describe('SlotResizedEvent', () => {
    it('should publish if someone requested slot resized event for the entity', async () => {
      ResizedEventsTopic.requestEvent(ResizedEventType.SLOT_RESIZED, 'test-slot')

      expect(topicValues.length).toBe(1) // from the requestEvent call
      topicValues = [] // reset for easier testing

      const event: SlotResizedEvent = {
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'test-slot',
          slotDetails: {
            width: 100,
            height: 200,
          },
        },
      }

      await resizedEventsTopic.publish(event)

      expect(topicValues.length).toBe(1)
      expect(topicValues[0]).toBe(event)
    })

    it('should not publish if no one requested slot resized event for the entity', async () => {
      const event: SlotResizedEvent = {
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'unrequested-slot',
          slotDetails: {
            width: 100,
            height: 200,
          },
        },
      }

      await resizedEventsTopic.publish(event)

      expect(topicValues.length).toBe(0)
    })
  })

  describe('SlotGroupResizedEvent', () => {
    it('should publish if someone requested slot group resized event for the entity', async () => {
      ResizedEventsTopic.requestEvent(ResizedEventType.SLOT_GROUP_RESIZED, 'test-slot-group')

      expect(topicValues.length).toBe(1) // from the requestEvent call
      topicValues = [] // reset for easier testing

      const event: SlotGroupResizedEvent = {
        type: ResizedEventType.SLOT_GROUP_RESIZED,
        payload: {
          slotGroupName: 'test-slot-group',
          slotGroupDetails: {
            width: 100,
            height: 200,
          },
        },
      }

      await resizedEventsTopic.publish(event)

      expect(topicValues.length).toBe(1)
      expect(topicValues[0]).toBe(event)
    })

    it('should not publish if no one requested slot group resized event for the entity', async () => {
      const event: SlotGroupResizedEvent = {
        type: ResizedEventType.SLOT_GROUP_RESIZED,
        payload: {
          slotGroupName: 'unrequested-slot-group',
          slotGroupDetails: {
            width: 100,
            height: 200,
          },
        },
      }

      await resizedEventsTopic.publish(event)

      expect(topicValues.length).toBe(0)
    })
  })

  describe('ResizedEventsPublisher', () => {
    it('should publish if someone requested resized event for the entity', async () => {
      ResizedEventsTopic.requestEvent(ResizedEventType.SLOT_RESIZED, 'test-slot')

      expect(topicValues.length).toBe(1) // from the requestEvent call
      topicValues = [] // reset for easier testing

      const event: SlotResizedEvent = {
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'test-slot',
          slotDetails: {
            width: 100,
            height: 200,
          },
        },
      }

      new ResizedEventsPublisher().publish(event)

      expect(topicValues.length).toBe(1)
      expect(topicValues[0]).toBe(event)
    })

    it('should not publish if no one requested resized event for the entity', async () => {
      const event: SlotResizedEvent = {
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'unrequested-slot',
          slotDetails: {
            width: 100,
            height: 200,
          },
        },
      }

      new ResizedEventsPublisher().publish(event)

      expect(topicValues.length).toBe(0)
    })
  })
})


```

### File: integration-interface/src/lib/topics/resized-events/v1/resized-events.topic.ts

```ts

import { Topic, TopicPublisher } from '@onecx/accelerator'
import { TopicResizedEventType } from './topic-resized-event-type'
import { ResizedEventType } from './resized-event-type'
import { SlotResizedEvent } from './slots-resized-type'
import { SlotGroupResizedEvent } from './slot-groups-resized-type'

declare global {
  interface Window {
    '@onecx/integration-interface': {
      // Keys should be equal to event types in ResizedEventType
      resizedEvents?: {
        slot_resized?: string[]
        slot_group_resized?: string[]
      }
    }
  }
}

export class ResizedEventsPublisher extends TopicPublisher<TopicResizedEventType> {
  constructor() {
    super('resizedEvents', 1)
  }

  //NOSONAR
  override publish(event: TopicResizedEventType): Promise<void> {
    if (![ResizedEventType.SLOT_GROUP_RESIZED, ResizedEventType.SLOT_RESIZED].includes(event.type)) {
      return super.publish(event)
    }

    const resizedEvent = event as SlotResizedEvent | SlotGroupResizedEvent
    const entityName = eventToEntityName(resizedEvent)

    if (window['@onecx/integration-interface']['resizedEvents']?.[resizedEvent.type]?.includes(entityName)) {
      return super.publish(event)
    }

    return Promise.resolve()
  }
}
export class ResizedEventsTopic extends Topic<TopicResizedEventType> {
  constructor() {
    super('resizedEvents', 1, false)
    window['@onecx/integration-interface'] ??= {}
    window['@onecx/integration-interface']['resizedEvents'] ??= {}
  }

  /**
   * Request resized update events for a specific entity
   * @param eventType - The type of resized event to request
   * @param entityName - The name of the entity (slot or slot group) to request events for
   */
  static requestEvent(
    eventType: ResizedEventType.SLOT_RESIZED | ResizedEventType.SLOT_GROUP_RESIZED,
    entityName: string
  ) {
    window['@onecx/integration-interface'] ??= {}
    window['@onecx/integration-interface']['resizedEvents'] ??= {}
    window['@onecx/integration-interface']['resizedEvents'][eventType] ??= []
    window['@onecx/integration-interface']['resizedEvents'][eventType].push(entityName)

    // Request an initial update when registering to make sure the listener has the latest information
    // Without this, the listener might have to wait until the next resize to get any data
    // Its important that this is called after the listener is registered
    new ResizedEventsPublisher().publish({
      type: ResizedEventType.REQUESTED_EVENTS_CHANGED,
      payload: {
        type: eventType,
        name: entityName,
      },
    })
  }

  //NOSONAR
  override publish(event: TopicResizedEventType): Promise<void> {
    if (![ResizedEventType.SLOT_GROUP_RESIZED, ResizedEventType.SLOT_RESIZED].includes(event.type)) {
      return super.publish(event)
    }

    const resizedEvent = event as SlotResizedEvent | SlotGroupResizedEvent
    const entityName = eventToEntityName(resizedEvent)

    if (window['@onecx/integration-interface']['resizedEvents']?.[resizedEvent.type]?.includes(entityName)) {
      return super.publish(event)
    }

    return Promise.resolve()
  }
}

function eventToEntityName(event: SlotResizedEvent | SlotGroupResizedEvent): string {
  switch (event.type) {
    case ResizedEventType.SLOT_RESIZED:
      return event.payload.slotName
    case ResizedEventType.SLOT_GROUP_RESIZED:
      return event.payload.slotGroupName
  }
}


```

### File: integration-interface/src/lib/topics/resized-events/v1/resized-event-type.ts

```ts

export enum ResizedEventType {
  SLOT_RESIZED = 'slot_resized',
  SLOT_GROUP_RESIZED = 'slot_group_resized',
  REQUESTED_EVENTS_CHANGED = 'requested_events_changed',
}


```

### File: integration-interface/src/lib/topics/resized-events/v1/resized-update-requested-type.ts

```ts

import { ResizedEventType } from './resized-event-type'

export type RequestedEventsChangedEventPayload = {
  type: ResizedEventType.SLOT_GROUP_RESIZED | ResizedEventType.SLOT_RESIZED
  name: string
}

export type RequestedEventsChangedEvent = {
  type: ResizedEventType.REQUESTED_EVENTS_CHANGED
  payload: RequestedEventsChangedEventPayload
}


```

### File: integration-interface/src/lib/topics/resized-events/v1/slot-groups-resized-type.ts

```ts

import { ResizedEventType } from './resized-event-type'

export type SlotGroupResizedDetails = {
  width: number
  height: number
}

export type SlotGroupResizedEventPayload = {
  slotGroupName: string
  slotGroupDetails: SlotGroupResizedDetails
}

export type SlotGroupResizedEvent = {
  type: ResizedEventType.SLOT_GROUP_RESIZED
  payload: SlotGroupResizedEventPayload
}


```

### File: integration-interface/src/lib/topics/resized-events/v1/slots-resized-type.ts

```ts

import { ResizedEventType } from './resized-event-type'

export type SlotResizedDetails = {
  width: number
  height: number
}

export type SlotResizedEventPayload = {
  slotName: string
  slotDetails: SlotResizedDetails
}

export type SlotResizedEvent = {
  type: ResizedEventType.SLOT_RESIZED
  payload: SlotResizedEventPayload
}


```

### File: integration-interface/src/lib/topics/resized-events/v1/topic-resized-event-type.ts

```ts

import { RequestedEventsChangedEvent } from './resized-update-requested-type'
import { SlotGroupResizedEvent } from './slot-groups-resized-type'
import { SlotResizedEvent } from './slots-resized-type'

export type TopicResizedEventType = SlotGroupResizedEvent | SlotResizedEvent | RequestedEventsChangedEvent


```

## Folder: integration-interface/src/lib/topics/user-profile/v1 (2 files)

### File: integration-interface/src/lib/topics/user-profile/v1/user-profile.model.ts

```ts

export interface UserProfile {
  userId: string
  person: UserPerson
  organization?: string
  tenantId?: string
  issuer?: string
  settings?: UserSettings
  accountSettings?: UserProfileAccountSettings
  /**
   * @deprecated
   */
  id?: string
  /**
   * @deprecated
   */
  identityProvider?: string
  /**
   * @deprecated
   * user id in external identity provider, e.g. in keycloak
   */
  identityProviderId?: string
  /**
   * @deprecated
   */
  tenantName?: string
  /**
   * @deprecated
   */
  avatar?: AvatarInfo
  /**
   * @deprecated
   */
  memberships?: Array<Membership>
}

export interface UserSettings {
  locales?: string[]
}

export interface UserProfileAccountSettings {
  localeAndTimeSettings?: UserProfileAccountSettingsLocaleAndTimeSettings
  layoutAndThemeSettings?: UserProfileAccountSettingsLayoutAndThemeSettings
  /**
   * @deprecated
   */
  privacySettings?: UserProfileAccountSettingsPrivacySettings
  /**
   * @deprecated
   */
  notificationSettings?: UserProfileAccountSettingsNotificationSettings
}

export interface UserProfileAccountSettingsLocaleAndTimeSettings {
  locale?: string
  timezone?: string
}

/**
 * @deprecated
 */
export interface UserProfileAccountSettingsNotificationSettings {
  todo?: string
}

export interface UserProfilePreference {
  id?: string
  applicationId?: string
  name?: string
  description?: string
  value?: string
}

/**
 * @deprecated
 */
export interface UserProfileAccountSettingsPrivacySettings {
  hideMyProfile?: string
}
export interface UserProfileAccountSettingsLayoutAndThemeSettings {
  menuMode?: 'HORIZONTAL' | 'STATIC' | 'OVERLAY' | 'SLIM' | 'SLIMPLUS'
  colorScheme?: 'AUTO' | 'LIGHT' | 'DARK'
}
export interface Membership {
  application?: string
  roleMemberships?: Array<MembershipRoles>
}
export interface PersonDTO {
  persisted?: boolean
  id?: string
  version?: number
  firstName?: string
  lastName?: string
  email?: string
  jobPosition?: string
  groupId?: string
}

export interface MembershipRoles {
  role?: string
  permissions?: Array<Permission>
}

export interface AvatarInfo {
  userUploaded?: boolean
  lastUpdateTime?: Date
  imageUrl?: string
  smallImageUrl?: string
}

export interface Permission {
  resource?: string
  action?: string
  key?: string
  name?: string
}

export interface UserPerson {
  firstName?: string
  lastName?: string
  displayName?: string
  email?: string
  address?: UserPersonAddress
  phone?: UserPersonPhone
}

export interface UserPersonAddress {
  street?: string
  streetNo?: string
  city?: string
  postalCode?: string
  country?: string
}

export interface UserPersonPhone {
  type?: PhoneType
  number?: string
}

export enum PhoneType {
  MOBILE = 'MOBILE',
  LANDLINE = 'LANDLINE',
}


```

### File: integration-interface/src/lib/topics/user-profile/v1/user-profile.topic.ts

```ts

import { Topic } from '@onecx/accelerator'
import { UserProfile } from './user-profile.model'

export class UserProfileTopic extends Topic<UserProfile> {
  constructor() {
    super('userProfile', 1)
  }
}


```


