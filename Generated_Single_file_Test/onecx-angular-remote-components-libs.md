# Files from C:\Users\prath\onecx\onecx-ui\onecx-portal-ui-libs\libs\angular-remote-components

## Folder: angular-remote-components (11 files)

### File: angular-remote-components/.eslintrc.json

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
        ],
        "@angular-eslint/prefer-standalone": "off"
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

### File: angular-remote-components/jest.config.ts

```ts

/* eslint-disable */
import { createReportsConfig } from '../../jest-config-factory'

export default {
  displayName: 'angular-remote-components',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
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
  moduleNameMapper: {
    '^d3-(.*)$': `d3-$1/dist/d3-$1`,
    '@primeng/themes': '<rootDir>/../../node_modules/@primeng/themes/index.mjs',
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  ...createReportsConfig('angular-remote-components'),
}


```

### File: angular-remote-components/migrations.json

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

### File: angular-remote-components/ng-package.json

```json

{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/libs/angular-remote-components",
  "lib": {
    "entryFile": "src/index.ts"
  },
  "assets": [
    "./assets/**",
    "./migrations.json"
  ]
}

```

### File: angular-remote-components/package.json

```json

{
  "name": "@onecx/angular-remote-components",
  "version": "7.0.0-rc.13",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/onecx/onecx-portal-ui-libs"
  },
  "peerDependencies": {
    "@angular/cdk": "^19.0.0",
    "@angular/common": "^19.0.0",
    "@angular/core": "^19.0.0",
    "@ngx-translate/core": "^16.0.0",
    "@onecx/integration-interface": "^7.0.0-rc.13",
    "@onecx/angular-utils": "^7.0.0-rc.13",
    "@angular-architects/module-federation": "^18.0.4",
    "rxjs": "^7.8.1",
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

### File: angular-remote-components/project.json

```json

{
  "name": "angular-remote-components",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/angular-remote-components/src",
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
          "tsc -p libs/angular-remote-components/migrations/tsconfig.migrations.json"
        ]
      }
    },
    "build": {
      "executor": "@nx/angular:package",
      "outputs": ["{workspaceRoot}/dist/{projectRoot}"],
      "options": {
        "project": "libs/angular-remote-components/ng-package.json"
      },
      "configurations": {
        "production": {
          "tsConfig": "libs/angular-remote-components/tsconfig.lib.prod.json"
        },
        "development": {
          "tsConfig": "libs/angular-remote-components/tsconfig.lib.json"
        }
      },
      "defaultConfiguration": "production"
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "libs/angular-remote-components/jest.config.ts",
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
          "libs/angular-remote-components/**/*.ts",
          "libs/angular-remote-components/**/*.html",
          "libs/angular-remote-components/package.json"
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

### File: angular-remote-components/sonar-project.properties

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
sonar.projectKey=onecx-portal-ui-libs-angular-remote-components
sonar.projectName=onecx-portal-ui-libs-angular-remote-components
#
sonar.scm.disabled=true
sonar.sources=src
sonar.tests=src
sonar-language="js"
sonar.sourceEncoding=UTF-8
#
# reporting
sonar.javascript.coveragePlugin=lcov
sonar.javascript.lcov.reportPaths=../../reports/angular-remote-components/coverage/lcov.info
sonar.testExecutionReportPaths=../../reports/angular-remote-components/sonarqube_report.xml
sonar.working.directory=../../reports/angular-remote-components/.scannerwork
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

### File: angular-remote-components/tsconfig.json

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

### File: angular-remote-components/tsconfig.lib.json

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
  "exclude": [
    "src/test-setup.ts",
    "**/*.spec.ts",
    "**/*.test.ts",
    "**/*.stories.ts",
    "**/*.stories.js",
    "jest.config.ts"
  ],
  "include": ["**/*.ts"]
}


```

### File: angular-remote-components/tsconfig.lib.prod.json

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

### File: angular-remote-components/tsconfig.spec.json

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

## Folder: angular-remote-components/migrations (3 files)

### File: angular-remote-components/migrations/index.ts

```ts

export * from './v6/migrate-onecx-to-v6'

```

### File: angular-remote-components/migrations/tsconfig.json

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

### File: angular-remote-components/migrations/tsconfig.migrations.json

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

## Folder: angular-remote-components/migrations/v6 (1 files)

### File: angular-remote-components/migrations/v6/migrate-onecx-to-v6.ts

```ts

import { Tree } from '@nx/devkit'
import { commonMigrateOnecxToV6 } from '@onecx/nx-migration-utils'

export default async function migrateOnecxToV6(tree: Tree) {
  await commonMigrateOnecxToV6(tree)
}


```

## Folder: angular-remote-components/mocks (3 files)

### File: angular-remote-components/mocks/index.ts

```ts

export * from './slot-service-mock'


```

### File: angular-remote-components/mocks/ng-package.json

```json

{
  "$schema": "../../../node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "index.ts"
  }
}

```

### File: angular-remote-components/mocks/slot-service-mock.ts

```ts

import { Injectable } from '@angular/core'
import { SlotComponentConfiguration } from '@onecx/angular-remote-components'
import { BehaviorSubject, Observable, map } from 'rxjs'

@Injectable()
export class SlotServiceMock {
  _componentsDefinedForSlot: BehaviorSubject<{
    [slot_key: string]: SlotComponentConfiguration[]
  }> = new BehaviorSubject({})
  isSomeComponentDefinedForSlot(slotName: string): Observable<boolean> {
    return this._componentsDefinedForSlot.pipe(
      map((assignments) => {
        return slotName in assignments && assignments[slotName].length > 0
      })
    )
  }

  getComponentsForSlot(slotName: string) {
    return this._componentsDefinedForSlot.pipe(
      map((assignments) => {
        return Object.keys(assignments).includes(slotName) ? assignments[slotName] : []
      })
    )
  }

  assignComponentsToSlot(componentConfigurations: SlotComponentConfiguration[], slotName: string) {
    const currentAssignments = this._componentsDefinedForSlot.getValue()
    this._componentsDefinedForSlot.next({
      ...currentAssignments,
      [slotName]:
        slotName in currentAssignments
          ? currentAssignments[slotName].concat(...componentConfigurations)
          : [...componentConfigurations],
    })
  }

  assignComponentToSlot(componentConfiguration: SlotComponentConfiguration, slotName: string) {
    const currentAssignments = this._componentsDefinedForSlot.getValue()
    this._componentsDefinedForSlot.next({
      ...currentAssignments,
      [slotName]:
        slotName in currentAssignments
          ? currentAssignments[slotName].concat(componentConfiguration)
          : [componentConfiguration],
    })
  }

  clearAssignments() {
    this._componentsDefinedForSlot.next({})
  }
}


```

## Folder: angular-remote-components/src (2 files)

### File: angular-remote-components/src/index.ts

```ts

export * from './lib/model/remote-component'
export * from './lib/model/remote-webcomponent'
export * from './lib/components/slot/slot.component'
export * from './lib/angular-remote-components.module'
export * from './lib/services/slot.service'
export * from './lib/services/permission.service'
export * from './lib/utils/provide-translate-service-for-root.utils'

export { RemoteComponentConfig, REMOTE_COMPONENT_CONFIG } from '@onecx/angular-utils'


```

### File: angular-remote-components/src/test-setup.ts

```ts

import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone'
setupZoneTestEnv()

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})


```

## Folder: angular-remote-components/src/lib (1 files)

### File: angular-remote-components/src/lib/angular-remote-components.module.ts

```ts

import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SlotComponent } from './components/slot/slot.component'
import { SLOT_SERVICE, SlotService } from './services/slot.service'

@NgModule({
  imports: [CommonModule],
  declarations: [SlotComponent],
  exports: [SlotComponent],
  providers: [
    {
      provide: SLOT_SERVICE,
      useExisting: SlotService,
    },
  ],
})
export class AngularRemoteComponentsModule {}


```

## Folder: angular-remote-components/src/lib/components/slot (2 files)

### File: angular-remote-components/src/lib/components/slot/slot.component.spec.ts

```ts

/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideHttpClient } from '@angular/common/http'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { Component, EventEmitter, Input } from '@angular/core'
import { SlotServiceMock } from '@onecx/angular-remote-components/mocks'
import { SlotHarness } from '@onecx/angular-remote-components/testing'
import { SlotComponent } from './slot.component'
import { SLOT_SERVICE } from '../../services/slot.service'
import { ocxRemoteComponent } from '../../model/remote-component'

// Rxjs operators mock
import * as rxjsOperators from 'rxjs/operators'
import { interval } from 'rxjs'

import {
  dataStyleIdAttribute,
  RemoteComponentConfig,
  dataStyleIsolationAttribute,
} from '@onecx/angular-utils'

jest.mock('@onecx/integration-interface', () => {
  const actual = jest.requireActual('@onecx/integration-interface')
  const fakeTopic = jest.requireActual('@onecx/accelerator').FakeTopic
  return {
    ...actual,
    ResizedEventsTopic: fakeTopic,
  }
})

import { ResizedEventType, Technologies, TopicResizedEventType } from '@onecx/integration-interface'
import { FakeTopic } from '@onecx/accelerator'
import { removeAllRcUsagesFromStyles, updateStylesForRcCreation } from '@onecx/angular-utils/style'

jest.mock('@onecx/angular-utils/style', () => {
  const actual = jest.requireActual('@onecx/angular-utils/style')
  return {
    ...actual,
    removeAllRcUsagesFromStyles: jest.fn(),
    updateStylesForRcCreation: jest.fn(),
  }
})

// Mock ResizeObserver
class ResizeObserverMock {
  constructor(private readonly callback: ResizeObserverCallback) {}
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
  trigger(width: number, height: number) {
    const entry = {
      contentRect: { width, height } as DOMRectReadOnly,
      target: {} as Element,
      borderBoxSize: [] as any,
      contentBoxSize: [] as any,
      devicePixelContentBoxSize: [] as any,
    } as ResizeObserverEntry
    this.callback([entry], this as unknown as ResizeObserver)
  }
}

;(global as any).ResizeObserver = ResizeObserverMock

// Mock ResizeEventsPublisher
class ResizeEventsPublisherMock {
  publish = jest.fn()
}

// Test component
@Component({
  selector: 'ocx-mock-angular-component',
  template: `<div>Mock Angular Component</div>`,
  standalone: false,
})
class MockAngularComponent implements ocxRemoteComponent {
  ocxInitRemoteComponent(_config: RemoteComponentConfig): void {
    console.log('MockAngularComponent initialized')
  }

  @Input() set initialInput(value: string) {
    console.log('MockAngularComponent initialInput', value)
    this._initialInput = value
  }
  private _initialInput = ''
  @Input() set initialOutput(value: EventEmitter<any>) {
    console.log('MockAngularComponent initialOutput', value)
    this._initialOutput = value
  }
  private _initialOutput: EventEmitter<any> = new EventEmitter()
}

describe('SlotComponent', () => {
  let component: SlotComponent
  let fixture: ComponentFixture<SlotComponent>
  let slotServiceMock: SlotServiceMock

  let resizeObserverMock: ResizeObserverMock
  let resizedEventsPublisherMock: ResizeEventsPublisherMock
  let resizedEventsTopic: FakeTopic<TopicResizedEventType>

  beforeEach(async () => {
    // Without this debounceTime is not working in tests with fakeAsync/tick
    jest
      .spyOn(rxjsOperators, 'debounceTime')
      .mockImplementation((timeout) => rxjsOperators.debounce(() => interval(timeout)))
    await TestBed.configureTestingModule({
      declarations: [SlotComponent, MockAngularComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: SLOT_SERVICE,
          useClass: SlotServiceMock,
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SlotComponent)
    component = fixture.componentInstance
    // These must be set before detectChanges which triggers ngOnInit
    component.name = 'test-slot'
    resizedEventsPublisherMock = new ResizeEventsPublisherMock()
    ;(component as any)['resizedEventsPublisher'] = resizedEventsPublisherMock
    fixture.detectChanges()

    slotServiceMock = TestBed.inject(SLOT_SERVICE) as unknown as SlotServiceMock
    resizeObserverMock = (component as any).resizeObserver as ResizeObserverMock
    resizedEventsTopic = component['resizedEventsTopic'] as any as FakeTopic<TopicResizedEventType>
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should log error if slot service is not defined', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    component['slotService'] = undefined as any
    component.ngOnInit()
    expect(consoleSpy).toHaveBeenCalledWith(
      'SLOT_SERVICE token was not provided. test-slot slot will not be filled with data.'
    )
    consoleSpy.mockRestore()
  })

  describe('on destroy', () => {
    it('should destroy resizedEventsTopic', () => {
      const spy = jest.spyOn(component['resizedEventsTopic'], 'destroy')
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalled()
    })

    it('should clear all subscriptions', () => {
      component['subscriptions'].push({ unsubscribe: jest.fn() } as any)
      const spy = jest.spyOn(component['subscriptions'][0], 'unsubscribe')
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalled()
    })

    it('should disconnect resizeObserver', () => {
      const spy = jest.spyOn(component['resizeObserver']!, 'disconnect')
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalled()
    })

    it('should not disconnect resizeObserver if not defined', () => {
      component['resizeObserver'] = undefined
      component.ngOnDestroy()
      expect(resizeObserverMock.disconnect).not.toHaveBeenCalled()
    })

    it('should complete componentSize$', () => {
      const spy = jest.spyOn(component['componentSize$'], 'complete')
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalled()
    })

    it('should cleanup all components', fakeAsync(() => {
      const spy = removeAllRcUsagesFromStyles as jest.Mock
      slotServiceMock.assignComponentToSlot(
        {
          componentType: Promise.resolve(MockAngularComponent),
          permissions: [],
          remoteComponent: {
            appId: 'app-id',
            productName: 'product-name',
            baseUrl: 'https://base.url',
            technology: Technologies.Angular,
          },
        },
        'test-slot'
      )
      tick(100)
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalledTimes(1)
    }))

    it('should clear view container', () => {
      const spy = jest.spyOn(component['viewContainerRef'], 'clear')
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('component creation', () => {
    describe('angular component', () => {
      it('should create', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
        slotServiceMock.assignComponentToSlot(
          {
            componentType: MockAngularComponent,
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-angular',
              productName: 'angular-product',
              baseUrl: 'https://base.url',
              technology: Technologies.Angular,
            },
          },
          'test-slot'
        )
        fixture.detectChanges()

        const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

        const element = await slotHarness.getElement('ocx-mock-angular-component')
        expect(element).not.toBeNull()

        expect(updateStylesForRcCreation).toHaveBeenCalled()
        expect(await element?.getAttribute(dataStyleIdAttribute)).toEqual('angular-product|app-angular')
        expect(await element?.getAttribute(dataStyleIsolationAttribute)).toEqual('')

        expect(consoleSpy).toHaveBeenCalledWith('MockAngularComponent initialized')

        consoleSpy.mockRestore()
      })

      it('should create if span was not found', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
        jest.spyOn(component['viewContainerRef'].element.nativeElement, 'querySelector').mockReturnValue(null)
        slotServiceMock.assignComponentToSlot(
          {
            componentType: MockAngularComponent,
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-angular-no-span',
              productName: 'angular-product-no-span',
              baseUrl: 'https://base.url',
              technology: Technologies.Angular,
            },
          },
          'test-slot'
        )
        fixture.detectChanges()

        const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

        const element = await slotHarness.getElement('ocx-mock-angular-component')
        expect(element).not.toBeNull()
        expect(consoleSpy).toHaveBeenCalledWith(
          'Component span was not found for slot component creation. The order of the components may be incorrect.'
        )
      })
    })

    describe('webcomponent', () => {
      it('should create webcomponent module component', async () => {
        slotServiceMock.assignComponentToSlot(
          {
            componentType: Promise.resolve(undefined),
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-webcomponent-module',
              productName: 'webcomponent-module-product',
              baseUrl: 'https://base.url',
              technology: Technologies.WebComponentModule,
              elementName: 'mock-webcomponent-module',
            },
          },
          'test-slot'
        )
        fixture.detectChanges()

        const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

        const element = await slotHarness.getElement('mock-webcomponent-module')
        expect(element).not.toBeNull()

        expect(updateStylesForRcCreation).toHaveBeenCalled()
        expect(await element?.getAttribute(dataStyleIdAttribute)).toEqual(
          'webcomponent-module-product|app-webcomponent-module'
        )
        expect(await element?.getAttribute(dataStyleIsolationAttribute)).toEqual('')
        expect(await element?.getProperty('ocxRemoteComponentConfig')).toEqual({
          appId: 'app-webcomponent-module',
          productName: 'webcomponent-module-product',
          baseUrl: 'https://base.url',
          permissions: ['mock-permission'],
        })
      })

      it('should create webcomponent script component', async () => {
        slotServiceMock.assignComponentToSlot(
          {
            componentType: Promise.resolve(undefined),
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-webcomponent-script',
              productName: 'webcomponent-script-product',
              baseUrl: 'https://base.url',
              technology: Technologies.WebComponentScript,
              elementName: 'mock-webcomponent-script',
            },
          },
          'test-slot'
        )
        fixture.detectChanges()

        const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

        const element = await slotHarness.getElement('mock-webcomponent-script')
        expect(element).not.toBeNull()

        expect(updateStylesForRcCreation).toHaveBeenCalled()
        expect(await element?.getAttribute(dataStyleIdAttribute)).toEqual(
          'webcomponent-script-product|app-webcomponent-script'
        )
        expect(await element?.getAttribute(dataStyleIsolationAttribute)).toEqual('')
        expect(await element?.getProperty('ocxRemoteComponentConfig')).toEqual({
          appId: 'app-webcomponent-script',
          productName: 'webcomponent-script-product',
          baseUrl: 'https://base.url',
          permissions: ['mock-permission'],
        })
      })

      it('should create webcomponent if span was not found', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
        jest.spyOn(component['viewContainerRef'].element.nativeElement, 'querySelector').mockReturnValue(null)
        slotServiceMock.assignComponentToSlot(
          {
            componentType: Promise.resolve(undefined),
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-webcomponent-no-span',
              productName: 'webcomponent-no-span-product',
              baseUrl: 'https://base.url',
              technology: Technologies.WebComponentModule,
              elementName: 'mock-webcomponent-no-span',
            },
          },
          'test-slot'
        )
        fixture.detectChanges()

        const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

        const element = await slotHarness.getElement('mock-webcomponent-no-span')
        expect(element).not.toBeNull()
        expect(consoleSpy).toHaveBeenCalledWith(
          'Component span was not found for slot component creation. The order of the components may be incorrect.'
        )
      })
    })

    it('should create multiple components', async () => {
      slotServiceMock.assignComponentsToSlot(
        [
          {
            componentType: MockAngularComponent,
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-multiple-1',
              productName: 'multiple-product',
              baseUrl: 'https://base.url',
              technology: Technologies.Angular,
            },
          },
          {
            componentType: Promise.resolve(undefined),
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-multiple-2',
              productName: 'multiple-product',
              baseUrl: 'https://base.url',
              technology: Technologies.WebComponentModule,
              elementName: 'mock-webcomponent-multiple',
            },
          },
        ],
        'test-slot'
      )
      fixture.detectChanges()

      const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

      const angularElement = await slotHarness.getElement('ocx-mock-angular-component')
      expect(angularElement).not.toBeNull()

      const webcomponentElement = await slotHarness.getElement('mock-webcomponent-multiple')
      expect(webcomponentElement).not.toBeNull()
    })

    it('should not create components if none assigned', async () => {
      const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

      const element = await slotHarness.getElement('non-existent-element')
      expect(element).toBeNull()
    })

    it('should not create component if type is undefined', async () => {
      const spy = jest.spyOn(component['viewContainerRef'], 'createComponent')
      slotServiceMock.assignComponentToSlot(
        {
          componentType: Promise.resolve(undefined),
          permissions: ['mock-permission'],
          remoteComponent: {
            appId: 'app-undefined',
            productName: 'undefined-product',
            baseUrl: 'https://base.url',
            technology: Technologies.Angular,
          },
        },
        'test-slot'
      )
      fixture.detectChanges()

      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('component update', () => {
    it('should update components after creation', async () => {
      const spy = jest.spyOn(console, 'log').mockImplementation()
      component.inputs = { initialInput: 'initialValue' }
      const eventEmitter = new EventEmitter()
      component.outputs = {
        initialOutput: eventEmitter,
      }
      slotServiceMock.assignComponentsToSlot(
        [
          {
            componentType: MockAngularComponent,
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-update',
              productName: 'update-product',
              baseUrl: 'https://base.url',
              technology: Technologies.Angular,
            },
          },
          {
            componentType: Promise.resolve(undefined),
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-update-webcomponent',
              productName: 'update-product',
              baseUrl: 'https://base.url',
              technology: Technologies.WebComponentModule,
              elementName: 'mock-webcomponent-update',
            },
          },
        ],
        'test-slot'
      )
      fixture.detectChanges()

      const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

      expect(component.inputs).toEqual({ initialInput: 'initialValue' })
      expect(component.outputs).toEqual({ initialOutput: eventEmitter })
      const angularElement = await slotHarness.getElement('ocx-mock-angular-component')
      expect(angularElement).not.toBeNull()
      expect(spy).toHaveBeenCalledWith('MockAngularComponent initialInput', 'initialValue')
      expect(spy).toHaveBeenCalledWith('MockAngularComponent initialOutput', eventEmitter)

      const webcomponentElement = await slotHarness.getElement('mock-webcomponent-update')
      expect(webcomponentElement).not.toBeNull()
      expect(await webcomponentElement?.getProperty('initialInput')).toEqual('initialValue')
      expect(await webcomponentElement?.getProperty('initialOutput')).toBe(eventEmitter)
    })
  })

  describe('size changes', () => {
    it('should publish initial size', fakeAsync(() => {
      resizedEventsPublisherMock.publish.mockClear()
      resizeObserverMock.trigger(200, 100)

      tick(200) // debounceTime

      expect(resizedEventsPublisherMock.publish).toHaveBeenCalledWith({
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'test-slot',
          slotDetails: { width: 200, height: 100 },
        },
      })
    }))
    it('should debounce size changes', fakeAsync(() => {
      resizedEventsPublisherMock.publish.mockClear()
      resizeObserverMock.trigger(200, 100)
      resizeObserverMock.trigger(300, 400)

      tick(120)

      resizeObserverMock.trigger(400, 700)

      expect(resizedEventsPublisherMock.publish).toHaveBeenCalledWith({
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'test-slot',
          slotDetails: { width: 300, height: 400 },
        },
      })

      tick(100)

      expect(resizedEventsPublisherMock.publish).toHaveBeenCalledWith({
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'test-slot',
          slotDetails: { width: 400, height: 700 },
        },
      })
    }))

    it('should publish when requestedEventsChanged emits for this slot', fakeAsync(() => {
      resizeObserverMock.trigger(200, 100)

      tick(200) // debounceTime

      resizedEventsPublisherMock.publish.mockClear()

      resizedEventsTopic.publish({
        type: ResizedEventType.REQUESTED_EVENTS_CHANGED,
        payload: {
          type: ResizedEventType.SLOT_RESIZED,
          name: 'test-slot',
        },
      })

      expect(resizedEventsPublisherMock.publish).toHaveBeenCalledWith({
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'test-slot',
          slotDetails: { width: 200, height: 100 },
        },
      })
    }))
  })
})


```

### File: angular-remote-components/src/lib/components/slot/slot.component.ts

```ts

import {
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Type,
  ViewContainerRef,
  inject,
} from '@angular/core'

import {
  ResizedEventsPublisher,
  ResizedEventsTopic,
  Technologies,
  SlotResizedEvent,
  ResizedEventType,
  RequestedEventsChangedEvent,
} from '@onecx/integration-interface'
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs'
import { ocxRemoteComponent } from '../../model/remote-component'
import { RemoteComponentInfo, SLOT_SERVICE, SlotComponentConfiguration, SlotService } from '../../services/slot.service'
import { RemoteComponentConfig, scopeIdFromProductNameAndAppId } from '@onecx/angular-utils'
import { HttpClient } from '@angular/common/http'
import { debounceTime, filter } from 'rxjs/operators'
import { updateStylesForRcCreation, removeAllRcUsagesFromStyles } from '@onecx/angular-utils/style'

interface AssignedComponent {
  refOrElement: ComponentRef<any> | HTMLElement
  remoteInfo: RemoteComponentInfo
}

@Component({
  standalone: false,
  selector: 'ocx-slot[name]',
  template: ``,
})
export class SlotComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient)
  private elementRef = inject(ElementRef)
  private readonly viewContainerRef = inject(ViewContainerRef)

  @Input()
  name!: string

  private slotService = inject<SlotService>(SLOT_SERVICE, { optional: true })
  private _assignedComponents$ = new BehaviorSubject<AssignedComponent[]>([])

  /**
   * Inputs to be passed to components inside a slot.
   *
   * @example
   *
   * ## Slot usage
   * ```
   * <ocx-slot name="my-slot-name" [inputs]="{ header: myHeaderValue }">
   * </ocx-slot>
   * ```
   *
   * ## Remote component definition
   * ```
   * export class MyRemoteComponent: {
   * â£@Input() header: string = ''
   * }
   * ```
   *
   * ## Remote component template
   * ```
   * <p>myInput = {{header}}</p>
   * ```
   */
  private _inputs$ = new BehaviorSubject<Record<string, unknown>>({})
  @Input()
  get inputs(): Record<string, unknown> {
    return this._inputs$.getValue()
  }
  set inputs(value: Record<string, unknown>) {
    this._inputs$.next({
      ...this._inputs$.getValue(),
      ...value,
    })
  }

  /**
   * Outputs to be passed to components inside a slot as EventEmitters. It is important that the output property is annotated with â£@Input().
   *
   * @example
   *
   * ## Component with slot in a template
   * ```
   * â£@Component({
   *  standalone: false, * selector: 'my-component',
   *  templateUrl: './my-component.component.html',
   * })
   * export class MyComponent {
   *  buttonClickedEmitter = new EventEmitter<string>()
   *  constructor() {
   *    this.buttonClickedEmitter.subscribe((msg) => {
   *      console.log(msg)
   *    })
   *  }
   * }
   * ```
   *
   * ## Slot usage in my-component.component.html
   * ```
   * <ocx-slot name="my-slot-name" [outputs]="{ buttonClicked: buttonClickedEmitter }">
   * </ocx-slot>
   * ```
   *
   * ## Remote component definition
   * ```
   * export class MyRemoteComponent: {
   *  â£@Input() buttonClicked = EventEmitter<string>()
   *  onButtonClick() {
   *    buttonClicked.emit('payload')
   *  }
   * }
   * ```
   *
   * ## Remote component template
   * ```
   * <button (click)="onButtonClick()">Emit message</button>
   * ```
   */
  private _outputs$ = new BehaviorSubject<Record<string, EventEmitter<any>>>({})
  @Input()
  get outputs(): Record<string, EventEmitter<any>> {
    return this._outputs$.getValue()
  }
  set outputs(value: Record<string, EventEmitter<any>>) {
    this._outputs$.next({
      ...this._outputs$.getValue(),
      ...value,
    })
  }

  subscriptions: Subscription[] = []
  components$: Observable<SlotComponentConfiguration[]> | undefined

  private resizeObserver: ResizeObserver | undefined
  private readonly componentSize$ = new BehaviorSubject<{ width: number; height: number }>({ width: -1, height: -1 })
  private resizeDebounceTimeMs = 100

  private readonly resizedEventsPublisher = new ResizedEventsPublisher()
  private _resizedEventsTopic: ResizedEventsTopic | undefined
  get resizedEventsTopic() {
    this._resizedEventsTopic ??= new ResizedEventsTopic()
    return this._resizedEventsTopic
  }
  set resizedEventsTopic(source: ResizedEventsTopic) {
    this._resizedEventsTopic = source
  }
  private readonly requestedEventsChanged$ = this.resizedEventsTopic.pipe(
    filter((event): event is RequestedEventsChangedEvent => event.type === ResizedEventType.REQUESTED_EVENTS_CHANGED)
  )

  ngOnDestroy(): void {
    this._resizedEventsTopic?.destroy()
    this.subscriptions.forEach((sub) => sub.unsubscribe())
    this.resizeObserver?.disconnect()
    this.componentSize$.complete() // Complete the subject to avoid memory leaks
    // Removes RC styles on unmount to avoid ghost styles
    this._assignedComponents$.getValue().forEach((component) => {
      const scopeId = scopeIdFromProductNameAndAppId(component.remoteInfo.productName, component.remoteInfo.appId)
      removeAllRcUsagesFromStyles(scopeId, this.name)
    })
    this.viewContainerRef.clear()
  }

  ngOnInit(): void {
    if (!this.slotService) {
      console.error(`SLOT_SERVICE token was not provided. ${this.name} slot will not be filled with data.`)
      return
    }
    this.components$ = this.slotService.getComponentsForSlot(this.name)
    const updateSub = combineLatest([this._assignedComponents$, this._inputs$, this._outputs$]).subscribe(
      ([components, inputs, outputs]) => {
        components.forEach((component) => {
          this.updateComponentData(component.refOrElement, inputs, outputs)
        })
      }
    )
    this.subscriptions.push(updateSub)

    // Components can be created only when component information is available and view containers are created for all remote components
    const createSub = this.components$.subscribe((components) => {
      this.createSpansForComponents(components)
      this.createComponents(components)
    })
    this.subscriptions.push(createSub)

    this.observeSlotSizeChanges()
  }

  private createSpansForComponents(components: SlotComponentConfiguration[]) {
    for (let i = 0; i < components.length; i++) {
      const span = document.createElement('span')
      span.dataset['index'] = i.toString()
      this.viewContainerRef.element.nativeElement.appendChild(span)
    }
  }

  private createComponents(components: SlotComponentConfiguration[]) {
    components.forEach((componentInfo, index) => {
      if (componentInfo.componentType) {
        Promise.all([Promise.resolve(componentInfo.componentType), Promise.resolve(componentInfo.permissions)]).then(
          ([componentType, permissions]) => {
            const component = this.createComponent(componentType, componentInfo, permissions, index)
            if (component) {
              this._assignedComponents$.next([
                ...this._assignedComponents$.getValue(),
                { refOrElement: component, remoteInfo: componentInfo.remoteComponent },
              ])
            }
          }
        )
      }
    })
  }

  private observeSlotSizeChanges() {
    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        const width = entry.contentRect.width
        const height = entry.contentRect.height
        this.componentSize$.next({ width, height })
      }
    })

    this.componentSize$.pipe(debounceTime(this.resizeDebounceTimeMs)).subscribe(({ width, height }) => {
      const slotResizedEvent: SlotResizedEvent = {
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: this.name,
          slotDetails: { width, height },
        },
      }
      this.resizedEventsPublisher.publish(slotResizedEvent)
    })

    this.resizeObserver.observe(this.elementRef.nativeElement)

    const requestedEventsChangedSub = this.requestedEventsChanged$.subscribe((event) => {
      if (event.payload.type === ResizedEventType.SLOT_RESIZED && event.payload.name === this.name) {
        const { width, height } = this.componentSize$.getValue()
        const slotResizedEvent: SlotResizedEvent = {
          type: ResizedEventType.SLOT_RESIZED,
          payload: {
            slotName: this.name,
            slotDetails: { width, height },
          },
        }
        this.resizedEventsPublisher.publish(slotResizedEvent)
      }
    })
    this.subscriptions.push(requestedEventsChangedSub)
  }

  private createComponent(
    componentType: Type<unknown> | undefined,
    componentInfo: { remoteComponent: RemoteComponentInfo },
    permissions: string[],
    index: number
  ): ComponentRef<any> | HTMLElement | undefined {
    if (componentType) {
      return this.createAngularComponent(componentType, componentInfo, permissions, index)
    }

    if (
      (componentInfo.remoteComponent.technology === Technologies.WebComponentModule ||
        componentInfo.remoteComponent.technology === Technologies.WebComponentScript) &&
      componentInfo.remoteComponent.elementName !== undefined
    ) {
      return this.createWebComponent(
        componentInfo as { remoteComponent: RemoteComponentInfo & { elementName: string } },
        permissions,
        index
      )
    }

    return
  }

  private createAngularComponent(
    componentType: Type<unknown>,
    componentInfo: { remoteComponent: RemoteComponentInfo },
    permissions: string[],
    index: number
  ): ComponentRef<any> {
    const componentRef = this.viewContainerRef.createComponent<any>(componentType, { index: index })
    const componentHTML = componentRef.location.nativeElement as HTMLElement
    this.updateComponentStyles(componentInfo)
    this.addDataStyleId(componentHTML, componentInfo.remoteComponent)
    this.addDataStyleIsolation(componentHTML)
    if (componentRef && 'ocxInitRemoteComponent' in componentRef.instance) {
      ;(componentRef.instance as ocxRemoteComponent).ocxInitRemoteComponent({
        appId: componentInfo.remoteComponent.appId,
        productName: componentInfo.remoteComponent.productName,
        baseUrl: componentInfo.remoteComponent.baseUrl,
        permissions: permissions,
      })
    }

    const span: HTMLSpanElement | undefined = this.viewContainerRef.element.nativeElement.querySelector(
      `span[data-index="${index}"]`
    ) as HTMLSpanElement
    if (span) {
      span.remove()
    } else {
      console.error(
        'Component span was not found for slot component creation. The order of the components may be incorrect.'
      )
    }

    componentRef.changeDetectorRef.detectChanges()
    return componentRef
  }

  private createWebComponent(
    componentInfo: { remoteComponent: RemoteComponentInfo & { elementName: string } },
    permissions: string[],
    index: number
  ): HTMLElement {
    const element = document.createElement(componentInfo.remoteComponent.elementName)
    this.updateComponentStyles(componentInfo)
    this.addDataStyleId(element, componentInfo.remoteComponent)
    this.addDataStyleIsolation(element)
    ;(element as any)['ocxRemoteComponentConfig'] = {
      appId: componentInfo.remoteComponent.appId,
      productName: componentInfo.remoteComponent.productName,
      baseUrl: componentInfo.remoteComponent.baseUrl,
      permissions: permissions,
    } satisfies RemoteComponentConfig

    const span: HTMLSpanElement | undefined = this.viewContainerRef.element.nativeElement.querySelector(
      `span[data-index="${index}"]`
    ) as HTMLSpanElement
    if (span) {
      this.viewContainerRef.element.nativeElement.insertBefore(element, span)
      span.remove()
    } else {
      console.error(
        'Component span was not found for slot component creation. The order of the components may be incorrect.'
      )
      this.viewContainerRef.element.nativeElement.appendChild(element)
    }
    return element
  }

  private addDataStyleId(element: HTMLElement, rcInfo: RemoteComponentInfo) {
    element.dataset['styleId'] = `${rcInfo.productName}|${rcInfo.appId}`
  }

  private addDataStyleIsolation(element: HTMLElement) {
    element.dataset['styleIsolation'] = ''
  }

  // Load styles exposed by the application the remote component belongs to if its not done already
  private updateComponentStyles(componentInfo: { remoteComponent: RemoteComponentInfo }) {
    updateStylesForRcCreation(
      componentInfo.remoteComponent.productName,
      componentInfo.remoteComponent.appId,
      this.http,
      componentInfo.remoteComponent.baseUrl,
      this.name
    )
  }

  private updateComponentData(
    component: ComponentRef<any> | HTMLElement,
    inputs: Record<string, unknown>,
    outputs: Record<string, EventEmitter<unknown>>
  ) {
    this.setProps(component, inputs)
    this.setProps(component, outputs)
  }

  // split props setting for HTMLElement and ComponentRef
  private setProps(component: ComponentRef<any> | HTMLElement, props: Record<string, unknown>) {
    Object.entries(props).map(([name, value]) => {
      if (component instanceof HTMLElement) {
        ;(component as any)[name] = value
      } else {
        component.setInput(name, value)
      }
    })
  }
}


```

## Folder: angular-remote-components/src/lib/model (2 files)

### File: angular-remote-components/src/lib/model/remote-component.ts

```ts

import { RemoteComponentConfig } from '@onecx/angular-utils'

export interface ocxRemoteComponent {
  ocxInitRemoteComponent(config: RemoteComponentConfig): void
}


```

### File: angular-remote-components/src/lib/model/remote-webcomponent.ts

```ts

import { RemoteComponentConfig } from '@onecx/angular-utils'

export interface ocxRemoteWebcomponent {
  ocxRemoteComponentConfig: RemoteComponentConfig
}


```

## Folder: angular-remote-components/src/lib/services (2 files)

### File: angular-remote-components/src/lib/services/permission.service.ts

```ts

import { Injectable, OnDestroy } from '@angular/core'
import { PermissionsRpcTopic } from '@onecx/integration-interface'
import { filter, firstValueFrom, map } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class PermissionService implements OnDestroy {
  _permissionsTopic$: PermissionsRpcTopic | undefined
  get permissionsTopic$() {
    this._permissionsTopic$ ??= new PermissionsRpcTopic()
    return this._permissionsTopic$
  }
  set permissionsTopic$(source: PermissionsRpcTopic) {
    this._permissionsTopic$ = source
  }
  private readonly permissionCache = new Map<string, Promise<string[]>>()

  ngOnDestroy(): void {
    this._permissionsTopic$?.destroy()
  }

  async getPermissions(appId: string, productName: string): Promise<string[]> {
    const cacheKey = `${appId}:${productName}`
    if (this.permissionCache.has(cacheKey)) {
      return this.permissionCache.get(cacheKey)!
    }

    const permissions = firstValueFrom(
      this.permissionsTopic$.pipe(
        filter(
          (message) =>
            message.appId === appId && message.productName === productName && Array.isArray(message.permissions)
        ),
        map((message) => message.permissions ?? [])
      )
    )
    this.permissionCache.set(cacheKey, permissions)
    this.permissionsTopic$.publish({ appId: appId, productName: productName })
    return permissions
  }
}


```

### File: angular-remote-components/src/lib/services/slot.service.ts

```ts

import { loadRemoteModule } from '@angular-architects/module-federation'
import { Injectable, InjectionToken, OnDestroy, Type, inject } from '@angular/core'
import { RemoteComponent, RemoteComponentsTopic, Technologies } from '@onecx/integration-interface'
import { Observable, map, shareReplay } from 'rxjs'
import { PermissionService } from './permission.service'

export const SLOT_SERVICE: InjectionToken<SlotService> = new InjectionToken('SLOT_SERVICE')

export type RemoteComponentInfo = {
  appId: string
  productName: string
  baseUrl: string
  technology: Technologies
  elementName?: string
}

export type SlotComponentConfiguration = {
  componentType: Promise<Type<unknown> | undefined> | Type<unknown> | undefined
  remoteComponent: RemoteComponentInfo
  permissions: Promise<string[]> | string[]
}

export interface SlotServiceInterface {
  init(): Promise<void>
  getComponentsForSlot(slotName: string): Observable<SlotComponentConfiguration[]>
  isSomeComponentDefinedForSlot(slotName: string): Observable<boolean>
}

@Injectable({ providedIn: 'root' })
export class SlotService implements SlotServiceInterface, OnDestroy {
  private permissionsService = inject(PermissionService)

  private _remoteComponents$: RemoteComponentsTopic | undefined
  get remoteComponents$() {
    this._remoteComponents$ ??= new RemoteComponentsTopic()
    return this._remoteComponents$
  }
  set remoteComponents$(source: RemoteComponentsTopic) {
    this._remoteComponents$ = source
  }

  async init(): Promise<void> {
    return Promise.resolve()
  }

  ngOnDestroy(): void {
    this._remoteComponents$?.destroy()
  }

  getComponentsForSlot(slotName: string): Observable<SlotComponentConfiguration[]> {
    return this.remoteComponents$.pipe(
      map((remoteComponentsInfo) =>
        (remoteComponentsInfo.slots?.find((slotMapping) => slotMapping.name === slotName)?.components ?? [])
          .map((remoteComponentName) => remoteComponentsInfo.components.find((rc) => rc.name === remoteComponentName))
          .filter((remoteComponent): remoteComponent is RemoteComponent => !!remoteComponent)
          .map((remoteComponent) => remoteComponent)
      ),
      map((infos) =>
        infos.map((remoteComponent) => {
          return {
            componentType: this.loadComponent(remoteComponent),
            remoteComponent,
            permissions: this.permissionsService.getPermissions(remoteComponent.appId, remoteComponent.productName),
          }
        })
      ),
      shareReplay()
    )
  }

  isSomeComponentDefinedForSlot(slotName: string): Observable<boolean> {
    return this.remoteComponents$.pipe(
      map((remoteComponentsInfo) =>
        remoteComponentsInfo.slots.some(
          (slotMapping) => slotMapping.name === slotName && slotMapping.components.length > 0
        )
      )
    )
  }

  private async loadComponent(component: {
    remoteEntryUrl: string
    exposedModule: string
    productName: string
    remoteName: string
    technology: string
  }): Promise<Type<unknown> | undefined> {
    try {
      const exposedModule = component.exposedModule.startsWith('./')
        ? component.exposedModule.slice(2)
        : component.exposedModule
      if (component.technology === Technologies.Angular || component.technology === Technologies.WebComponentModule) {
        const m = await loadRemoteModule({
          type: 'module',
          remoteEntry: component.remoteEntryUrl,
          exposedModule: './' + exposedModule,
        })
        if (component.technology === Technologies.Angular) {
          return m[exposedModule]
        }
        return undefined
      }
      await loadRemoteModule({
        type: 'script',
        remoteName: component.remoteName,
        remoteEntry: component.remoteEntryUrl,
        exposedModule: './' + exposedModule,
      })
      return undefined
    } catch (e) {
      console.log('Failed to load remote module ', component.exposedModule, component.remoteEntryUrl, e)
      return undefined
    }
  }
}


```

## Folder: angular-remote-components/src/lib/utils (1 files)

### File: angular-remote-components/src/lib/utils/provide-translate-service-for-root.utils.ts

```ts

import {
  DEFAULT_LANGUAGE,
  FakeMissingTranslationHandler,
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateDefaultParser,
  TranslateFakeCompiler,
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModuleConfig,
  TranslateParser,
  TranslateService,
  TranslateStore,
  USE_DEFAULT_LANG,
  USE_EXTEND,
  ISOLATE_TRANSLATE_SERVICE,
} from '@ngx-translate/core'

export function provideTranslateServiceForRoot(config: TranslateModuleConfig = {}) {
  return [
    config.loader || { provide: TranslateLoader, useClass: TranslateFakeLoader },
    config.compiler || { provide: TranslateCompiler, useClass: TranslateFakeCompiler },
    config.parser || { provide: TranslateParser, useClass: TranslateDefaultParser },
    config.missingTranslationHandler || { provide: MissingTranslationHandler, useClass: FakeMissingTranslationHandler },
    TranslateStore,
    { provide: ISOLATE_TRANSLATE_SERVICE, useValue: config.isolate },
    { provide: USE_DEFAULT_LANG, useValue: config.useDefaultLang },
    { provide: USE_EXTEND, useValue: config.extend },
    { provide: DEFAULT_LANGUAGE, useValue: config.defaultLanguage },
    TranslateService,
  ]
}


```

## Folder: angular-remote-components/testing (3 files)

### File: angular-remote-components/testing/index.ts

```ts

export * from './slot.harness'


```

### File: angular-remote-components/testing/ng-package.json

```json

{
  "$schema": "../../../node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "./index.ts"
  }
}


```

### File: angular-remote-components/testing/slot.harness.ts

```ts

import {
  BaseHarnessFilters,
  ContentContainerComponentHarness,
  HarnessPredicate,
  TestElement,
} from '@angular/cdk/testing'

export interface SlotHarnessFilters extends BaseHarnessFilters {
  name?: string
}

/**
 * Harness for interacting with an OCX slot component in tests.
 *
 * Provides methods to inspect slot div containers, their styles, classes,
 * and content when multiple components are assigned to a slot.
 */
export class SlotHarness extends ContentContainerComponentHarness {
  static readonly hostSelector = 'ocx-slot'

  static with(options: SlotHarnessFilters = {}): HarnessPredicate<SlotHarness> {
    return new HarnessPredicate(SlotHarness, options).addOption('name', options.name, (harness, name) =>
      HarnessPredicate.stringMatches(harness.getName(), name)
    )
  }

  /**
   * Gets a child element within the slot by its tag name.
   * @param tagName - The tag name of the child element to retrieve.
   * @returns A promise that resolves to the child element or null if not found.
   */
  async getElement(tagName: string): Promise<TestElement | null> {
    return await this.documentRootLocatorFactory().locatorForOptional(tagName)()
  }

  /**
   * Gets the name of the slot from either the 'name' attribute or 'ng-reflect-name' attribute.
   * Checks both for robust detection during different Angular compilation modes.
   * @returns Promise that resolves to the slot name or null if not found.
   */
  async getName(): Promise<string | null> {
    const host = await this.host()

    const nameAttr = await host.getAttribute('name')
    if (nameAttr !== null) {
      return nameAttr
    }

    const reflectName = await host.getAttribute('ng-reflect-name')
    if (reflectName !== null) {
      return reflectName
    }

    return null
  }

  /**
   * Gets a specific CSS property value from a child element within the slot by its tag name.
   * @param tagName - The tag name of the child element.
   * @param property - The CSS property name to retrieve.
   * @returns Promise that resolves to the CSS property value or empty string if element not found.
   */
  async getComponentCssProperty(tagName: string, property: string): Promise<string> {
    const element = await this.getElement(tagName)
    if (!element) {
      return ''
    }
    return await element.getCssValue(property)
  }

  /**
   * Gets the list of CSS classes applied to a child element within the slot by its tag name.
   * @param tagName - The tag name of the child element.
   * @returns Promise that resolves to an array of CSS class names or empty array if element not found.
   */
  async getComponentClasses(tagName: string): Promise<string[]> {
    const element = await this.getElement(tagName)
    if (!element) {
      return []
    }
    const attributeString = await element.getAttribute('class')
    if (attributeString) {
      return attributeString.trim().split(' ')
    }
    return []
  }
}


```


