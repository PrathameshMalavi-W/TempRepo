# Files from C:\Users\prath\onecx\onecx-ui\onecx-portal-ui-libs\libs\angular-testing

## Folder: angular-testing (11 files)

### File: angular-testing/.eslintrc.json

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

### File: angular-testing/jest.config.ts

```ts

/* eslint-disable */
import { createReportsConfig } from '../../jest-config-factory'

export default {
  displayName: 'angular-testing',
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
  ...createReportsConfig('angular-testing'),
}


```

### File: angular-testing/migrations.json

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

### File: angular-testing/ng-package.json

```json

{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/libs/angular-testing",
  "lib": {
    "entryFile": "src/index.ts"
  },
  "assets": [
    "./migrations.json"
  ]
}

```

### File: angular-testing/package.json

```json

{
  "name": "@onecx/angular-testing",
  "version": "7.0.0-rc.13",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/onecx/onecx-portal-ui-libs"
  },
  "peerDependencies": {
    "@angular/cdk": "^19.0.0",
    "primeng": "^19.0.0",
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

### File: angular-testing/project.json

```json

{
  "name": "angular-testing",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/angular-testing/src",
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
          "tsc -p libs/angular-testing/migrations/tsconfig.migrations.json"
        ]
      }
    },
    "build": {
      "executor": "@nx/angular:package",
      "outputs": ["{workspaceRoot}/dist/{projectRoot}"],
      "options": {
        "project": "libs/angular-testing/ng-package.json"
      },
      "configurations": {
        "production": {
          "tsConfig": "libs/angular-testing/tsconfig.lib.prod.json"
        },
        "development": {
          "tsConfig": "libs/angular-testing/tsconfig.lib.json"
        }
      },
      "defaultConfiguration": "production"
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "libs/angular-testing/jest.config.ts",
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
          "libs/angular-testing/**/*.ts",
          "libs/angular-testing/**/*.html",
          "libs/angular-testing/package.json"
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

### File: angular-testing/sonar-project.properties

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
sonar.projectKey=onecx-portal-ui-libs-angular-testing
sonar.projectName=onecx-portal-ui-libs-angular-testing
#
sonar.scm.disabled=true
sonar.sources=src
sonar.tests=src
sonar-language="js"
sonar.sourceEncoding=UTF-8
#
# reporting
sonar.javascript.coveragePlugin=lcov
sonar.javascript.lcov.reportPaths=../../reports/angular-testing/coverage/lcov.info
sonar.testExecutionReportPaths=../../reports/angular-testing/sonarqube_report.xml
sonar.working.directory=../../reports/angular-testing/.scannerwork
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

### File: angular-testing/tsconfig.json

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
    "esModuleInterop": true,
    "types": ["jest", "node"],
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

### File: angular-testing/tsconfig.lib.json

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "declaration": true,
    "declarationMap": true,
    "inlineSources": true,
    "target": "es2022",
    "useDefineForClassFields": false,
    "types": ["node"],
  },
  "exclude": ["**/*.spec.ts", "src/test-setup.ts", "jest.config.ts", "**/*.test.ts", "**/*.stories.ts", "jest.config.ts"],
  "include": ["**/*.ts"]
}


```

### File: angular-testing/tsconfig.lib.prod.json

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

### File: angular-testing/tsconfig.spec.json

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

## Folder: angular-testing/migrations (3 files)

### File: angular-testing/migrations/index.ts

```ts

export * from './v6/migrate-onecx-to-v6'

```

### File: angular-testing/migrations/tsconfig.json

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

### File: angular-testing/migrations/tsconfig.migrations.json

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

## Folder: angular-testing/migrations/v6 (1 files)

### File: angular-testing/migrations/v6/migrate-onecx-to-v6.ts

```ts

import { Tree } from '@nx/devkit'
import { commonMigrateOnecxToV6 } from '@onecx/nx-migration-utils'

export default async function migrateOnecxToV6(tree: Tree) {
  await commonMigrateOnecxToV6(tree)
}


```

## Folder: angular-testing/src (2 files)

### File: angular-testing/src/index.ts

```ts

export * from './lib/harnesses/primeng/p-accordion.harness'
export * from './lib/harnesses/primeng/p-accordion-tab.harness'
export * from './lib/harnesses/primeng/p-breadcrumb.harness'
export * from './lib/harnesses/primeng/p-button-directive.harness'
export * from './lib/harnesses/primeng/p-button.harness'
export * from './lib/harnesses/primeng/p-chart.harness'
export * from './lib/harnesses/primeng/p-checkbox.harness'
export * from './lib/harnesses/primeng/p-chip.harness'
export * from './lib/harnesses/primeng/p-dialog.harness'
export * from './lib/harnesses/primeng/p-select.harness'
export * from './lib/harnesses/primeng/p-menu-item.harness'
export * from './lib/harnesses/primeng/p-menu.harness'
export * from './lib/harnesses/primeng/p-menubar.harness'
export * from './lib/harnesses/primeng/p-multiSelect.harness'
export * from './lib/harnesses/primeng/p-multiSelectListItem.harness'
export * from './lib/harnesses/primeng/p-panelmenu-item.harness'
export * from './lib/harnesses/primeng/p-panelmenu.harness'
export * from './lib/harnesses/primeng/p-paginator.harness'
export * from './lib/harnesses/primeng/p-password.harness'
export * from './lib/harnesses/primeng/p-picklist.harness'
export * from './lib/harnesses/primeng/p-selectButton.harness'
export * from './lib/harnesses/primeng/p-togglebutton.harness'

export * from './lib/harnesses/utils/primeicon.utils'

export * from './lib/harnesses/button.harness'
export * from './lib/harnesses/div.harness'
export * from './lib/harnesses/input.harness'
export * from './lib/harnesses/list-item.harness'
export * from './lib/harnesses/menu-item.harness'
export * from './lib/harnesses/menu-item-with-icon.harness'
export * from './lib/harnesses/primeng/p-tableCheckbox.harness'
export * from './lib/harnesses/p.harness'
export * from './lib/harnesses/span.harness'
export * from './lib/harnesses/table-header-column.harness'
export * from './lib/harnesses/table-row.harness'

export * from '@angular/cdk/testing'
export * from '@angular/cdk/testing/testbed'

export * from './lib/mocks/IntersectionObserverMock'
export * from './lib/mocks/OriginMock'
export * from './lib/utils/waitForDeferredViewsToBeRendered'


```

### File: angular-testing/src/test-setup.ts

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

## Folder: angular-testing/src/lib/harnesses (10 files)

### File: angular-testing/src/lib/harnesses/button.harness.ts

```ts

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface ButtonHarnessFilters extends BaseHarnessFilters {
  id?: string
  icon?: string
  class?: string
}

export class ButtonHarness extends ComponentHarness {
  static hostSelector = 'button'

  static with(options: ButtonHarnessFilters): HarnessPredicate<ButtonHarness> {
    return new HarnessPredicate(ButtonHarness, options)
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.getId(), id))
      .addOption('icon', options.icon, (harness, icon) => HarnessPredicate.stringMatches(harness.getIcon(), icon))
      .addOption('class', options.class, (harness, c) => HarnessPredicate.stringMatches(harness.getByClass(c), c))
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }
  async getIcon(): Promise<string | null> {
    return await (await this.host()).getAttribute('icon')
  }
  async getByClass(c: string): Promise<string | null> {
    return (await (await this.host()).hasClass(c)) ? c : ''
  }

  async click() {
    if (!(await this.isDisabled())) {
      await (await this.host()).click()
    } else {
      console.warn('Button cannot be clicked, because it is disabled!')
    }
    await this.waitForTasksOutsideAngular()
  }

  async isDisabled(): Promise<boolean> {
    return await (await this.host()).getProperty('disabled')
  }
}


```

### File: angular-testing/src/lib/harnesses/div.harness.ts

```ts

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface DivHarnessFilters extends BaseHarnessFilters {
  class?: string
  id?: string
}

export class DivHarness extends ComponentHarness {
  static hostSelector = 'div'

  static with(options: DivHarnessFilters): HarnessPredicate<DivHarness> {
    return new HarnessPredicate(DivHarness, options)
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.getId(), id))
      .addOption('class', options.class, (harness, c) => HarnessPredicate.stringMatches(harness.getByClass(c), c)
    )
  }

  async getByClass(c: string): Promise<string> {
    return (await (await this.host()).hasClass(c)) ? c : ''
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async checkHasClass(value: string) {
    return await (await this.host()).hasClass(value)
  }

  async getText(): Promise<string> {
    return await (await this.host()).text()
  }

  async getClassList() {
    const host = await this.host()
    const attributeString = await host.getAttribute('class')
    if (attributeString) {
      return attributeString.trim().split(' ')
    }
    return []
  }

  async click(): Promise<void> {
    await (await this.host()).click()
  }
}


```

### File: angular-testing/src/lib/harnesses/input.harness.ts

```ts

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing'

export interface InputHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class InputHarness extends ComponentHarness {
  static hostSelector = 'input'

  static with(options: InputHarnessFilters): HarnessPredicate<InputHarness> {
    return new HarnessPredicate(InputHarness, options).addOption('id', options.id, (harness, id) =>
      HarnessPredicate.stringMatches(harness.getId(), id)
    )
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getValue(): Promise<string | null> {
    return await (await this.host()).getProperty<string>('value')
  }
  async getChecked(): Promise<boolean> {
    return await (await this.host()).getProperty<boolean>('checked')
  }

  async setValue(value: string | Date): Promise<void> {
    if (value instanceof Date) {
      await (
        await this.host()
      ).setInputValue(
        `${value.toLocaleDateString([], {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        })} ${value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      )
    } else {
      await (await this.host()).clear()
      if (value) {
        await (await this.host()).sendKeys(value)
      }
      await (await this.host()).setInputValue(value)
    }
  }

  async getTestElement(): Promise<TestElement> {
    return await this.host()
  }

  async click() {
    await (await this.host()).click()
  }
}


```

### File: angular-testing/src/lib/harnesses/list-item.harness.ts

```ts

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface ListItemHarnessFilters extends BaseHarnessFilters {
  text?: string
}

export class ListItemHarness extends ComponentHarness {
  static hostSelector = 'li'

  static with(options: ListItemHarnessFilters): HarnessPredicate<ListItemHarness> {
    return new HarnessPredicate(ListItemHarness, options).addOption('text', options.text, (harness, text) =>
      HarnessPredicate.stringMatches(harness.getText(), text)
    )
  }

  async getText() {
    return await (await this.host()).text()
  }

  async isSelected(): Promise<boolean> {
    return (await (await this.host()).getAttribute('aria-selected')) === 'true' ? true : false
  }

  async selectItem() {
    await (await this.host()).click()
  }
}


```

### File: angular-testing/src/lib/harnesses/menu-item.harness.ts

```ts

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface MenuItemHarnessFilters extends BaseHarnessFilters {
  text?: string
}

export class MenuItemHarness extends ComponentHarness {
  static hostSelector = 'li>div>a'

  static with(options: MenuItemHarnessFilters): HarnessPredicate<MenuItemHarness> {
    return new HarnessPredicate(MenuItemHarness, options).addOption('text', options.text, (harness, text) =>
      HarnessPredicate.stringMatches(harness.getText(), text)
    )
  }

  async getText(): Promise<string> {
    return await (await this.host()).text()
  }

  async selectItem() {
    await (await this.host()).click()
  }

  async getLink(): Promise<string | null> {
    return await (await this.host()).getAttribute('href')
  }
}


```

### File: angular-testing/src/lib/harnesses/menu-item-with-icon.harness.ts

```ts

import { MenuItemHarness } from './menu-item.harness'

export class MenuItemWithIconHarness extends MenuItemHarness {
  async hasIcon(icon: string): Promise<boolean | undefined> {
    const classList = await (await this.locatorForOptional('i')())?.getAttribute('class')
    return classList?.includes(icon)
  }
}


```

### File: angular-testing/src/lib/harnesses/p.harness.ts

```ts

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface PHarnessFilters extends BaseHarnessFilters {
  class?: string
  id?: string
}

export class PHarness extends ComponentHarness {
  static hostSelector = 'p'

  static with(options: PHarnessFilters): HarnessPredicate<PHarness> {
    return new HarnessPredicate(PHarness, options)
      .addOption('class', options.class, (harness, c) => HarnessPredicate.stringMatches(harness.getByClass(c), c))
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.hasId(id), id))
  }

  async getByClass(c: string): Promise<string> {
    return (await (await this.host()).hasClass(c)) ? c : ''
  }

  async hasId(id: string): Promise<string> {
    return (await (await this.host()).matchesSelector('#' + id)) ? id : ''
  }

  async checkHasClass(value: string) {
    return await (await this.host()).hasClass(value)
  }

  async getText(): Promise<string> {
    return await (await this.host()).text()
  }

  async getClassList() {
    const host = await this.host()
    const attributeString = await host.getAttribute('class')
    if (attributeString) {
      return attributeString.trim().split(' ')
    }
    return []
  }
}


```

### File: angular-testing/src/lib/harnesses/span.harness.ts

```ts

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface SpanHarnessFilters extends BaseHarnessFilters {
  id?: string
  class?: string
  classes?: Array<string>
}

export class SpanHarness extends ComponentHarness {
  static hostSelector = 'span'

  static with(options: SpanHarnessFilters): HarnessPredicate<SpanHarness> {
    return new HarnessPredicate(SpanHarness, options)
      .addOption('class', options.class, (harness, c) => HarnessPredicate.stringMatches(harness.getByClass(c), c))
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.getId(), id))
  }

  static without(options: SpanHarnessFilters): HarnessPredicate<SpanHarness> {
    return new HarnessPredicate(SpanHarness, options).addOption(
      'classes',
      options.classes,
      (harness, classes: Array<string>) => {
        return Promise.all(classes.map((c) => harness.checkHasClass(c))).then((classContainedArr) =>
          classContainedArr.every((classContained) => !classContained)
        )
      }
    )
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getByClass(c: string): Promise<string> {
    return (await (await this.host()).hasClass(c)) ? c : ''
  }

  async checkHasClass(value: string) {
    return await (await this.host()).hasClass(value)
  }

  async hasAnyClass(classes: Array<string>) {
    const ret: Promise<boolean>[] = []
    classes.forEach((c) => ret.push(this.checkHasClass(c)))
    const res = await Promise.all(ret)
    return res.some((res) => res) ? 'true' : 'false'
  }

  async getText(): Promise<string> {
    return await (await this.host()).text()
  }
}


```

### File: angular-testing/src/lib/harnesses/table-header-column.harness.ts

```ts

import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { ButtonHarness } from './button.harness'
import { PMultiSelectHarness } from './primeng/p-multiSelect.harness'

export class TableHeaderColumnHarness extends ContentContainerComponentHarness {
  static hostSelector = 'th'

  getSortButton = this.locatorFor(
    ButtonHarness.with({
      class: 'sortButton',
    })
  )

  getFilterMultiSelect = this.locatorFor(
    PMultiSelectHarness.with({
      class: 'filterMultiSelect',
    })
  )

  async getText(): Promise<string> {
    return (await this.host()).text()
  }
}


```

### File: angular-testing/src/lib/harnesses/table-row.harness.ts

```ts

import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { ButtonHarness } from './button.harness'
import { waitForDeferredViewsToBeRendered } from '../utils/waitForDeferredViewsToBeRendered'

export class TableRowHarness extends ContentContainerComponentHarness {
  static hostSelector = 'tbody > tr'

  getAllActionButtons = this.locatorForAll('button')
  getViewButton = this.locatorForOptional(ButtonHarness.with({ class: 'viewTableRowButton' }))
  getEditButton = this.locatorForOptional(ButtonHarness.with({ class: 'editTableRowButton' }))
  getDeleteButton = this.locatorForOptional(ButtonHarness.with({ class: 'deleteTableRowButton' }))

  async getData(): Promise<string[]> {
    await waitForDeferredViewsToBeRendered(this)
    const tds = await this.locatorForAll('td')()
    const isActionsTd = await Promise.all(tds.map((t) => t.hasClass('actions')))
    const textTds = tds.filter((_v, index) => !isActionsTd[index])
    return Promise.all(textTds.map((t) => t.text()))
  }
}


```

## Folder: angular-testing/src/lib/harnesses/primeng (23 files)

### File: angular-testing/src/lib/harnesses/primeng/p-accordion.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'
import { PAccordionTabHarness } from './p-accordion-tab.harness'

export class PAccordionHarness extends ComponentHarness {
  static hostSelector = 'p-accordion'

  getAllAccordionTabs = this.locatorForAll(PAccordionTabHarness)
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-accordion-tab.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'

export class PAccordionTabHarness extends ComponentHarness {
  static hostSelector = 'p-accordiontab'

  getButton = this.locatorFor('a.p-accordion-header-link')

  async expand() {
    await (await this.getButton()).click()
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-breadcrumb.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'
import { ListItemHarness } from '../list-item.harness'

export class PBreadcrumbHarness extends ComponentHarness {
  static hostSelector = 'p-breadcrumb'

  getBreadcrumbItems = this.locatorForAll(ListItemHarness)

  async getBreadcrumbItem(itemText: string): Promise<ListItemHarness | null> {
    return await this.locatorForOptional(ListItemHarness.with({ text: itemText }))()
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-button.harness.ts

```ts

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { SpanHarness } from '../span.harness'

export interface PButtonHarnessFilters extends BaseHarnessFilters {
  id?: string
  name?: string
  label?: string
  icon?: string
}

export class PButtonHarness extends ComponentHarness {
  static hostSelector = 'p-button'

  getLabelSpan = this.locatorForOptional(SpanHarness.without({ classes: ['p-badge', 'p-button-icon'] }))
  getIconSpan = this.locatorForOptional(SpanHarness.with({ class: 'p-button-icon' }))

  static with(options: PButtonHarnessFilters): HarnessPredicate<PButtonHarness> {
    return new HarnessPredicate(PButtonHarness, options)
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.getId(), id))
      .addOption('name', options.name, (harness, name) => HarnessPredicate.stringMatches(harness.getName(), name))
      .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label))
      .addOption('icon', options.icon, (harness, icon) => HarnessPredicate.stringMatches(harness.getIcon(), icon))
  }
  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getName(): Promise<string | null> {
    return await (await this.host()).getAttribute('name')
  }

  async getLabel(): Promise<string | null> {
    return (await (await this.getLabelSpan())?.getText()) ?? null
  }

  async getIcon(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-icon')
  }

  async click() {
    await (await this.locatorFor('button')()).click()
  }

  async getBadgeValue() {
    return await (await this.host()).getAttribute('ng-reflect-badge')
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-button-directive.harness.ts

```ts

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface PButtonDirectiveHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class PButtonDirectiveHarness extends ComponentHarness {
  static hostSelector = 'button[pButton]'

  static with(options: PButtonDirectiveHarnessFilters): HarnessPredicate<PButtonDirectiveHarness> {
    return new HarnessPredicate(PButtonDirectiveHarness, options).addOption('id', options.id, (harness, id) =>
      HarnessPredicate.stringMatches(harness.getId(), id)
    )
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async click() {
    await (await this.host()).click()
  }

  async getLabel(): Promise<string | null> {
    return await (await this.host()).text()
  }

  async getIcon(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-icon')
  }

  async getDisabled(): Promise<boolean> {
    return await (await this.host()).getProperty('disabled')
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-chart.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'

export class PChartHarness extends ComponentHarness {
  static hostSelector = 'p-chart'

  async getType(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-type')
  }
  async getOptions(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-options')
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-checkbox.harness.ts

```ts

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { DivHarness } from '../div.harness'
import { InputHarness } from '../input.harness'

export interface PCheckBoxHarnessFilters extends BaseHarnessFilters {
  inputid?: string
}
export class PCheckboxHarness extends ComponentHarness {
  static hostSelector = 'p-checkbox'

  getCheckBoxDiv = this.locatorForOptional(DivHarness.with({ class: 'p-checkbox-box' }))

  static with(options: PCheckBoxHarnessFilters): HarnessPredicate<PCheckboxHarness> {
    return new HarnessPredicate(PCheckboxHarness, options).addOption('inputid', options.inputid, (harness, inputid) =>
      HarnessPredicate.stringMatches(harness.getId(), inputid)
    )
  }

  async isChecked(): Promise<boolean> {
    return (await this.locatorFor(InputHarness)()).getChecked()
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('inputId')
  }

  async isHidden(): Promise<boolean> {
    const attr = await (await this.host()).getAttribute('hidden')
    return Boolean(attr)
  }

  async click(): Promise<void> {
    await (await this.getCheckBoxDiv())?.click()
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-chip.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'

export class PChipHarness extends ComponentHarness {
  static hostSelector = 'p-chip'

  getRemoveButton = this.locatorForOptional('.p-chip-remove-icon')

  async getContent() {
    return await (await this.host()).text()
  }

  async clickRemove() {
    await (await this.getRemoveButton())?.click()
  }

  async click() {
    await (await this.host()).click()
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-dialog.harness.ts

```ts

import { BaseHarnessFilters, ContentContainerComponentHarness, TestKey } from '@angular/cdk/testing'
import { DivHarness } from '../div.harness'

export interface PDialogHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class PDialogHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-dialog'

  getHeader = this.locatorForOptional(DivHarness.with({ class: 'p-dialog-header' }))
  getFooter = this.locatorForOptional(DivHarness.with({ class: 'p-dialog-footer' }))

  async getDialogTitle(): Promise<string | undefined> {
    return await (await this.getHeader())?.getText()
  }

  async close() {
    if (await this.isVisible()) {
      await (await this.host()).sendKeys(TestKey.ESCAPE)
    } else {
      console.warn('Unable to close CustomGroupColumnSelectionDialog, because it is not open.')
    }
  }

  async isVisible(): Promise<boolean> {
    return (await (await this.host()).getAttribute('ng-reflect-visible')) === 'true' ? true : false
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-menu.harness.ts

```ts

import { ContentContainerComponentHarness, HarnessLoader } from '@angular/cdk/testing'
import { MenuItemHarness } from '../menu-item.harness'

export class PMenuHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-menu'

  async getHarnessLoaderForPMenuOverlay(): Promise<HarnessLoader | null> {
    return this.documentRootLocatorFactory().harnessLoaderForOptional('.p-menu-overlay')
  }

  async isOpen(): Promise<boolean> {
    return !!(await this.getHarnessLoaderForPMenuOverlay())
  }

  async getAllMenuItems(): Promise<MenuItemHarness[] | undefined> {
    if (await this.isOpen()) {
      return await (await this.getHarnessLoaderForPMenuOverlay())?.getAllHarnesses(MenuItemHarness)
    } else {
      console.warn('Cannot get menu items because menu is closed.')
    }
    return []
  }

  async getMenuItem(itemText: string): Promise<MenuItemHarness | undefined | null> {
    if (await this.isOpen()) {
      return await (
        await this.getHarnessLoaderForPMenuOverlay()
      )?.getHarnessOrNull(MenuItemHarness.with({ text: itemText }))
    } else {
      console.warn('Cannot get menu items because menu is closed.')
    }
    return undefined
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-menubar.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'
import { PMenuItemHarness } from './p-menu-item.harness'

export class PMenuBarHarness extends ComponentHarness {
  static hostSelector = 'p-menubar'

  getAllMenuItems = this.locatorForAll(PMenuItemHarness)
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-menu-item.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'
import { SpanHarness } from '../span.harness'

export class PMenuItemHarness extends ComponentHarness {
  static hostSelector = 'li.p-menuitem'

  getAnchor = this.locatorFor('a')
  getChildren = this.locatorForAll(PMenuItemHarness)
  getIconSpan = this.locatorForOptional(SpanHarness.with({ class: 'p-menuitem-icon' }))

  async getText(): Promise<string> {
    return await (await this.getAnchor()).text()
  }

  async hasIcon(icon: string): Promise<boolean | undefined> {
    const classList = await (await (await this.getIconSpan())?.host())?.getAttribute('class')
    return classList?.includes(icon)
  }

  async click() {
    return await (await this.getAnchor()).click()
  }

  async getLink(): Promise<string | null> {
    return await (await this.getAnchor()).getAttribute('href')
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-multiSelect.harness.ts

```ts

import { BaseHarnessFilters, ComponentHarness, HarnessLoader, HarnessPredicate } from '@angular/cdk/testing'
import { PMultiSelectListItemHarness } from './p-multiSelectListItem.harness'

export interface PMultiSelectHarnessFilters extends BaseHarnessFilters {
  id?: string
  class?: string
}

export class PMultiSelectHarness extends ComponentHarness {
  static hostSelector = 'p-multiselect'

  static with(options: PMultiSelectHarnessFilters): HarnessPredicate<PMultiSelectHarness> {
    return new HarnessPredicate(PMultiSelectHarness, options)
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.getId(), id))
      .addOption('class', options.class, (harness, c) => HarnessPredicate.stringMatches(harness.getByClass(c), c))
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getByClass(c: string): Promise<string | null> {
    return (await (await this.host()).hasClass(c)) ? c : ''
  }

  async getHarnessLoaderForPMultiSelectPanel(): Promise<HarnessLoader | null> {
    const rootLocator = this.documentRootLocatorFactory()
    return rootLocator.harnessLoaderForOptional('.p-multiselect-overlay')
  }

  async getAllOptions(): Promise<PMultiSelectListItemHarness[]> {
    if (!(await this.isOpen())) {
      await this.open()
    }
    const panel = await this.getHarnessLoaderForPMultiSelectPanel()
    if (!panel) {
      throw new Error('Unable to access multiselect panel after opening.')
    }
    return await panel.getAllHarnesses(PMultiSelectListItemHarness)
  }

  async isOpen(): Promise<boolean> {
    const panel = await this.getHarnessLoaderForPMultiSelectPanel()
    if (!panel) return false
    return true
  }

  async open() {
    if (!(await this.isOpen())) {
      await (await this.locatorFor('div')()).click()
    } else {
      console.warn('Unable to open multiSelect, because it is already open.')
    }
  }

  async close() {
    if (await this.isOpen()) {
      await (await this.locatorFor('div')()).click()
    } else {
      console.warn('Unable to close multiSelect, because it is not open.')
    }
  }

  async isHighlighted(PMultiSelectListItem: PMultiSelectListItemHarness): Promise<boolean> {
    return (await (await PMultiSelectListItem.getTestElement()).getAttribute('data-p-highlight')) === 'true'
      ? true
      : false
  }

  async getSelectedOptions(): Promise<string[] | null> {
    const allOptions = await this.getAllOptions()
    const selectedOptions: string[] = []
    for (let index = 0; index < allOptions.length; index++) {
      const option = allOptions[index]
      if (await this.isHighlighted(option)) {
        selectedOptions.push(await option.getText())
      }
    }
    return selectedOptions
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-multiSelectListItem.harness.ts

```ts

import { ComponentHarness, TestElement } from '@angular/cdk/testing'

export class PMultiSelectListItemHarness extends ComponentHarness {
  static hostSelector = 'li'

  async getTestElement(): Promise<TestElement> {
    return await this.host()
  }

  async click(): Promise<void> {
    await (await this.host()).click()
  }

  async getText(): Promise<string> {
    return await (await this.host()).text()
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-paginator.harness.ts

```ts

import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { SpanHarness } from '../span.harness'
import { PSelectHarness } from './p-select.harness'
import { ButtonHarness } from '../button.harness'

export class PPaginatorHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-paginator'
  getCurrentPageReport = this.locatorFor(SpanHarness.with({ class: 'p-paginator-current' }))
  getRowsPerPageOptions = this.locatorFor(PSelectHarness)
  getNextPageButton = this.locatorFor(ButtonHarness.with({ class: 'p-paginator-next' }))

  async getCurrentPageReportText(): Promise<string | undefined> {
    return await (await this.getCurrentPageReport()).getText()
  }

  async clickNextPage() {
    ;(await this.getNextPageButton()).click()
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-panelmenu.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'
import { PanelMenuItemHarness } from './p-panelmenu-item.harness'

export class PPanelMenuHarness extends ComponentHarness {
  static hostSelector = 'p-panelmenu'

  getAllPanels = this.locatorForAll(PanelMenuItemHarness)
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-panelmenu-item.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'
import { SpanHarness } from '../span.harness'
import { PMenuItemHarness } from './p-menu-item.harness'

export class PanelMenuItemHarness extends ComponentHarness {
  static hostSelector = 'div.p-panelmenu-panel'

  getAnchor = this.locatorFor('a')
  getChildren = this.locatorForAll(PMenuItemHarness)
  getIconSpan = this.locatorForOptional(SpanHarness.with({ class: 'p-menuitem-icon' }))

  async getText(): Promise<string> {
    return await (await this.getAnchor()).text()
  }

  async hasIcon(icon: string): Promise<boolean | undefined> {
    const classList = await (await (await this.getIconSpan())?.host())?.getAttribute('class')
    return classList?.includes(icon)
  }

  async click() {
    await (await this.getAnchor()).click()
  }

  async getLink(): Promise<string | null> {
    return await (await this.getAnchor()).getAttribute('href')
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-password.harness.ts

```ts

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { InputHarness } from '../input.harness'

export interface PPasswordHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class PPasswordHarness extends ComponentHarness {
  static hostSelector = 'p-password'

  getInput = this.locatorFor(InputHarness)

  static with(options: PPasswordHarnessFilters): HarnessPredicate<PPasswordHarness> {
    return new HarnessPredicate(PPasswordHarness, options).addOption('id', options.id, (harness, id) =>
      HarnessPredicate.stringMatches(harness.getId(), id)
    )
  }
  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getPromptLabel(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-prompt-label')
  }

  async getWeakLabel(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-weak-label')
  }

  async getMediumLabel(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-medium-label')
  }

  async getStrongLabel(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-strong-label')
  }

  async getValue(): Promise<string | null> {
    return await (await this.getInput()).getValue()
  }

  async setValue(value: string) {
    return await (await this.getInput()).setValue(value)
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-picklist.harness.ts

```ts

import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { ButtonHarness } from '../button.harness'
import { DivHarness } from '../div.harness'
import { ListItemHarness } from '../list-item.harness'

export interface PPicklistControlsButtonsFilters extends BaseHarnessFilters {
  class?: string
}

export interface PPicklistListWrapperFilters extends BaseHarnessFilters {
  class?: string
}

export class PPicklistControlsButtonsHarness extends ContentContainerComponentHarness {
  static hostSelector = '.p-picklist-controls'

  getButtons = this.locatorForAll(ButtonHarness)

  static with(options: PPicklistControlsButtonsFilters): HarnessPredicate<PPicklistControlsButtonsHarness> {
    return new HarnessPredicate(PPicklistControlsButtonsHarness, options).addOption(
      'class',
      options.class,
      (harness, c) => HarnessPredicate.stringMatches(harness.getByClass(c), c)
    )
  }

  async getByClass(c: string) {
    return (await (await this.host()).hasClass(c)) ? c : ''
  }
}

export class PPicklistListWrapperHarness extends ContentContainerComponentHarness {
  static hostSelector = '.p-picklist-list-container'

  getHeader = this.locatorFor(DivHarness.with({ class: 'p-picklist-header' }))
  getAllListItems = this.locatorForAll(ListItemHarness)

  static with(options: PPicklistListWrapperFilters): HarnessPredicate<PPicklistListWrapperHarness> {
    return new HarnessPredicate(PPicklistListWrapperHarness, options).addOption('class', options.class, (harness, c) =>
      HarnessPredicate.stringMatches(harness.getByClass(c), c)
    )
  }

  async getByClass(c: string) {
    return (await (await this.host()).hasClass(c)) ? c : ''
  }
}

export class PPicklistHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-picklist'

  private getPicklistSourceControls = this.locatorFor(
    PPicklistControlsButtonsHarness.with({ class: 'p-picklist-source-controls' })
  )
  private getPicklistTransferControls = this.locatorFor(
    PPicklistControlsButtonsHarness.with({ class: 'p-picklist-transfer-controls' })
  )
  private getPicklistTargetControls = this.locatorFor(
    PPicklistControlsButtonsHarness.with({ class: 'p-picklist-target-controls' })
  )

  private getPicklistSource = this.locatorFor(PPicklistListWrapperHarness.with({ class: 'p-picklist-source-list-container' }))
  private getPicklistTarget = this.locatorFor(PPicklistListWrapperHarness.with({ class: 'p-picklist-target-list-container' }))

  async getSourceControlsButtons(): Promise<ButtonHarness[]> {
    return await (await this.getPicklistSourceControls()).getButtons()
  }

  async getTransferControlsButtons(): Promise<ButtonHarness[]> {
    return await (await this.getPicklistTransferControls()).getButtons()
  }

  async getTargetControlsButtons(): Promise<ButtonHarness[]> {
    return await (await this.getPicklistTargetControls()).getButtons()
  }

  async getSourceHeader(): Promise<string> {
    return await (await (await this.getPicklistSource()).getHeader()).getText()
  }

  async getTargetHeader(): Promise<string> {
    return await (await (await this.getPicklistTarget()).getHeader()).getText()
  }

  async getSourceListItems(): Promise<ListItemHarness[]> {
    return await (await this.getPicklistSource()).getAllListItems()
  }

  async getTargetListItems(): Promise<ListItemHarness[]> {
    return await (await this.getPicklistTarget()).getAllListItems()
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-select.harness.ts

```ts

import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { ListItemHarness } from '../list-item.harness'

export interface PSelectHarnessFilters extends BaseHarnessFilters {
  id?: string
  inputId?: string
}

export class PSelectHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-select'

  static with(options: PSelectHarnessFilters): HarnessPredicate<PSelectHarness> {
    return new HarnessPredicate(PSelectHarness, options)
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.getId(), id))
      .addOption('inputId', options.inputId, (harness, inputId) =>
        HarnessPredicate.stringMatches(harness.getInputId(), inputId)
      )
  }

  async getInputId(): Promise<string | null> {
    return await (await this.host()).getAttribute('inputId')
  }

  async getAriaLabel(): Promise<string | null | undefined> {
    return (await this.locatorForOptional('span.p-placeholder')())?.getAttribute('aria-label')
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getDefaultText() {
    return (await this.locatorForOptional('span.p-placeholder')())?.text()
  }

  async getSelectedText() {
    return (await this.locatorForOptional('span.p-select-label')())?.text()
  }

  async isOpen(): Promise<boolean> {
    return (await this.host()).hasClass('p-select-open')
  }

  async open() {
    if (!(await this.isOpen())) {
      await (await this.locatorFor('div')()).click()
    } else {
      console.warn('Unable to open p-select, because it is already open.')
    }
  }

  async close() {
    if (await this.isOpen()) {
      await (await this.locatorFor('div')()).click()
    } else {
      console.warn('Unable to close p-select, because it is not open.')
    }
  }

  async getSelectItems() {
    await this.open()
    const rootLocator = this.documentRootLocatorFactory()
    const items = await rootLocator.harnessLoaderFor('.p-select-list')
    return await items.getAllHarnesses(ListItemHarness)
  }

  async getSelectItem(itemText: string): Promise<ListItemHarness | null> {
    return await this.locatorForOptional(ListItemHarness.with({ text: itemText }))()
  }

  async selectedSelectItem(position: number) {
    const selectedColumnGroup = await Promise.all(
      (await this.getSelectItems()).filter((listItem) => listItem.isSelected())
    )
    return selectedColumnGroup[position]
  }

  async selectedSelectItemText(position: number) {
    return (await this.selectedSelectItem(position)).getText()
  }

  async hasClearOption() {
    return (await this.locatorFor('div')()).hasClass('p-select-clearable')
  }

  async clear() {
    if (await this.hasClearOption()) {
      return await (await this.locatorFor('.p-select-clear-icon')()).click()
    } else {
      console.warn('Unable to clear p-select, because it has no clear option')
    }
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-selectButton.harness.ts

```ts

import { ContentContainerComponentHarness } from '@angular/cdk/testing'

export class PSelectButtonHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-selectbutton'

  getAllButtons = this.locatorForAll('p-togglebutton')
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-tableCheckbox.harness.ts

```ts

import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing'

export interface PTableCheckboxHarnessFilter extends BaseHarnessFilters {
  isSelected?: boolean
}

export class PTableCheckboxHarness extends ComponentHarness {
  static hostSelector = 'p-tablecheckbox'

  static with<T extends PTableCheckboxHarness>(this: ComponentHarnessConstructor<T>, options: PTableCheckboxHarnessFilter = {}): HarnessPredicate<T> {
    return new HarnessPredicate(this, options).addOption('isSelected', options.isSelected, async (harness, selected) => {
        return (await harness.isChecked()) === selected
    })
  }

  async isChecked(): Promise<boolean> {
    const allChecked = await this.locatorForAll('checkicon')()
    return allChecked.length === 1
  }

  async checkBox(): Promise<void> {
    const checkBoxElement = await this.locatorFor('.p-checkbox-input')()
    return checkBoxElement.click()
  }
}


```

### File: angular-testing/src/lib/harnesses/primeng/p-togglebutton.harness.ts

```ts

import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface PToggleButtonHarnessFilters extends BaseHarnessFilters {
  onLabel?: string
}

export class PToggleButtonHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-togglebutton'

  static with(options: PToggleButtonHarnessFilters): HarnessPredicate<PToggleButtonHarness> {
    return new HarnessPredicate(PToggleButtonHarness, options).addOption(
      'onLabel',
      options.onLabel,
      (harness, onLabel) => HarnessPredicate.stringMatches(harness.getOnLabel(), onLabel)
    )
  }

  async getOnLabel() {
    return await (await this.host()).getAttribute('ng-reflect-on-label')
  }

  async click() {
    await (await this.host()).click()
  }
}


```

## Folder: angular-testing/src/lib/harnesses/utils (1 files)

### File: angular-testing/src/lib/harnesses/utils/primeicon.utils.ts

```ts

import { PrimeIcons } from 'primeng/api'

export type PrimeIcon = (typeof PrimeIcons)[keyof Omit<typeof PrimeIcons, 'prototype'>]


```

## Folder: angular-testing/src/lib/mocks (2 files)

### File: angular-testing/src/lib/mocks/IntersectionObserverMock.ts

```ts

export class IntersectionObserverMock {
  private callback: any
  private entries: any[]
  root: any
  rootMargin: any
  thresholds: any
  constructor(callback: any, _options: any) {
    this.callback = callback
    this.entries = []
  }

  observe(target: Element) {
    const entry = {
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRatio: 1,
      isIntersecting: true,
      target: target,
    }
    this.entries.push(entry)
    setTimeout(() => {
      this.callback(this.entries, this)
    })
  }

  takeRecords() {
    return this.entries
  }

  unobserve(target: any) {
    this.entries = this.entries.filter((entry) => entry.target !== target)
  }

  disconnect() {
    this.entries = []
  }
}

export function ensureIntersectionObserverMockExists() {
  if (!global.IntersectionObserver || global.IntersectionObserver !== IntersectionObserverMock) {
    global.IntersectionObserver = IntersectionObserverMock
  }
}


```

### File: angular-testing/src/lib/mocks/OriginMock.ts

```ts

export function ensureOriginMockExists() {
  if (!global.origin) {
    global.origin = ''
  }
}


```

## Folder: angular-testing/src/lib/utils (1 files)

### File: angular-testing/src/lib/utils/waitForDeferredViewsToBeRendered.ts

```ts

import { ComponentHarness, ContentContainerComponentHarness } from '@angular/cdk/testing'

export async function waitForDeferredViewsToBeRendered(harness: ComponentHarness | ContentContainerComponentHarness) {
  return await new Promise<void>((resolve) => {
    setTimeout(() => {
      // Warning was removed for logs readability reasons
      // console.warn(
      //   'waitForTasksOutsideAngular has not finished within 500ms. We are not waiting any longer to not cause timeouts.'
      // );
      ;(harness as any).forceStabilize().then(() => resolve())
    }, 2_000)
    // waitForTasksOutsideAngular makes sure that the observe method of the IntersectionObserver is called for each defer block.
    // setTimeout makes sure that we are only continuing after the IntersectionObserverMock has called ther callback for each
    // defer block, because js scheduling is making sure that all methods which are scheduled via setTimeout are executed in the
    // respective order. This guarentees that the resolve method is called after the defer block was rendered.
    ;(harness as any).waitForTasksOutsideAngular().then(() => setTimeout(() => resolve()))
  })
}


```


