# Files from C:\Users\prath\onecx\onecx-ui\onecx-portal-ui-libs\libs\angular-accelerator

## Folder: angular-accelerator (11 files)

### File: angular-accelerator/.eslintrc.json

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

### File: angular-accelerator/jest.config.ts

```ts

/* eslint-disable */
import { createReportsConfig } from '../../jest-config-factory'

export default {
  displayName: 'angular-accelerator',
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
  moduleNameMapper: {
    '^d3-(.*)$': `d3-$1/dist/d3-$1`,
    '@primeng/themes': '<rootDir>/../../node_modules/@primeng/themes/index.mjs',
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  testEnvironment: '@happy-dom/jest-environment',
  ...createReportsConfig('angular-accelerator'),
}


```

### File: angular-accelerator/migrations.json

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

### File: angular-accelerator/ng-package.json

```json

{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/libs/angular-accelerator",
  "lib": {
    "entryFile": "src/index.ts"
  },
  "assets": [
    "./assets/**",
    {
      "input": "tmp/primelocale/",
      "glob": "{en,de}.json",
      "output": "assets/i18n/primeng"
    },
    "./migrations.json"
  ]
}

```

### File: angular-accelerator/package.json

```json

{
  "name": "@onecx/angular-accelerator",
  "version": "7.0.0-rc.13",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/onecx/onecx-portal-ui-libs"
  },
  "peerDependencies": {
    "@angular/common": "^19.0.0",
    "@angular/core": "^19.0.0",
    "@angular/cdk": "^19.0.0",
    "@angular/forms": "^19.0.0",
    "@angular/platform-browser": "^19.0.0",
    "@angular/router": "^19.0.0",
    "@ngx-translate/core": "^16.0.0",
    "@ngx-translate/http-loader": "^8.0.0",
    "@ngneat/until-destroy": "^10.0.0",
    "@onecx/integration-interface": "^7.0.0-rc.13",
    "@onecx/accelerator": "^7.0.0-rc.13",
    "@onecx/angular-integration-interface": "^7.0.0-rc.13",
    "@onecx/angular-remote-components": "^7.0.0-rc.13",
    "@onecx/angular-testing": "^7.0.0-rc.13",
    "@onecx/angular-utils": "^7.0.0-rc.13",
    "chart.js": "^4.4.3",
    "d3-scale-chromatic": "^3.1.0",
    "rxjs": "~7.8.1",
    "primeng": "^19.0.0",
    "@storybook/angular": "^8.3.2",
    "@nx/devkit": "^20.3.0",
    "@onecx/nx-migration-utils": "^7.0.0-rc.13"
  },
  "dependencies": {},
  "exports": {
    ".": {
      "style": "./assets/styles.scss"
    },
    "./migrations.json": "./migrations.json"
  },
  "publishConfig": {
    "access": "public"
  },
  "nx-migrations": {
    "migrations": "./migrations.json"
  }
}


```

### File: angular-accelerator/project.json

```json

{
  "name": "angular-accelerator",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/angular-accelerator/src",
  "prefix": "onecx",
  "tags": [],
  "projectType": "library",
  "targets": {
    "copyPrimelocaleTranslations": {
      "executor": "nx:run-commands",
      "options": {
        "commands": [
          "mkdir -p libs/angular-accelerator/tmp/primelocale",
          "cp node_modules/primelocale/de.json libs/angular-accelerator/tmp/primelocale/",
          "cp node_modules/primelocale/en.json libs/angular-accelerator/tmp/primelocale/",
          "sed -i 's/\"de\":/\"primeng\":/' libs/angular-accelerator/tmp/primelocale/de.json",
          "sed -i 's/\"en\":/\"primeng\":/' libs/angular-accelerator/tmp/primelocale/en.json"
        ],
        "parallel": false
      }
    },
    "build-migrations": {
      "dependsOn": ["build"],
      "executor": "nx:run-commands",
      "options": {
        "commands": ["tsc -p libs/angular-accelerator/migrations/tsconfig.migrations.json"]
      }
    },
    "build": {
      "executor": "@nx/angular:package",
      "dependsOn": ["^build", "copyPrimelocaleTranslations"],
      "outputs": ["{workspaceRoot}/dist/{projectRoot}"],
      "options": {
        "project": "libs/angular-accelerator/ng-package.json"
      },
      "configurations": {
        "production": {
          "tsConfig": "libs/angular-accelerator/tsconfig.lib.prod.json"
        },
        "development": {
          "tsConfig": "libs/angular-accelerator/tsconfig.lib.json"
        }
      },
      "defaultConfiguration": "production"
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "libs/angular-accelerator/jest.config.ts",
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
          "libs/angular-accelerator/**/*.ts",
          "libs/angular-accelerator/**/*.html",
          "libs/angular-accelerator/package.json"
        ]
      }
    },
    "release": {
      "executor": "@onecx/release:update-build-publish",
      "options": {
        "buildTarget": "build-migrations"
      }
    },
    "storybook": {
      "executor": "@storybook/angular:start-storybook",
      "options": {
        "port": 4400,
        "configDir": "libs/angular-accelerator/.storybook",
        "browserTarget": "angular-accelerator:build-storybook",
        "compodoc": false,
        "styles": [
          "node_modules/primeicons/primeicons.css",
          "libs/angular-accelerator/assets/styles.scss",
          "libs/angular-accelerator/.storybook/storybook.css",
          "libs/angular-accelerator/.storybook/theme_defaults.scss",
          "libs/angular-accelerator/src/lib/directives/loading-indicator.directive.scss"
        ]
      },
      "configurations": {
        "ci": {
          "quiet": true
        }
      }
    },
    "build-storybook": {
      "executor": "@storybook/angular:build-storybook",
      "outputs": ["{options.outputDir}"],
      "options": {
        "outputDir": "dist/storybook/angular-accelerator",
        "configDir": "libs/angular-accelerator/.storybook",
        "browserTarget": "angular-accelerator:build-storybook",
        "compodoc": false,
        "styles": [
          "node_modules/primeicons/primeicons.css",
          "libs/angular-accelerator/assets/styles.scss",
          "libs/angular-accelerator/.storybook/storybook.css",
          "libs/angular-accelerator/.storybook/theme_defaults.scss",
          "libs/angular-accelerator/src/lib/directives/loading-indicator.directive.scss"
        ]
      },
      "configurations": {
        "ci": {
          "quiet": true
        }
      }
    }
  }
}


```

### File: angular-accelerator/sonar-project.properties

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
sonar.projectKey=onecx-portal-ui-libs-angular-accelerator
sonar.projectName=onecx-portal-ui-libs-angular-accelerator
#
sonar.scm.disabled=true
sonar.sources=src
sonar.tests=src
sonar-language="js"
sonar.sourceEncoding=UTF-8
#
# reporting
sonar.javascript.coveragePlugin=lcov
sonar.javascript.lcov.reportPaths=../../reports/angular-accelerator/coverage/lcov.info
sonar.testExecutionReportPaths=../../reports/angular-accelerator/sonarqube_report.xml
sonar.working.directory=../../reports/angular-accelerator/.scannerwork
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

### File: angular-accelerator/tsconfig.json

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
    },
    {
      "path": "./.storybook/tsconfig.json"
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

### File: angular-accelerator/tsconfig.lib.json

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "declaration": true,
    "declarationMap": true,
    "inlineSources": true,
    "types": ["node", "jest"],
    "target": "es2022",
    "useDefineForClassFields": false
  },
  "exclude": ["**/*.spec.ts", "src/test-setup.ts", "jest.config.ts", "**/*.test.ts", "**/*.stories.ts", "jest.config.ts"],
  "include": ["**/*.ts"]
}


```

### File: angular-accelerator/tsconfig.lib.prod.json

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

### File: angular-accelerator/tsconfig.spec.json

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

## Folder: angular-accelerator/.storybook (4 files)

### File: angular-accelerator/.storybook/preview.ts

```ts

import type { Preview } from '@storybook/angular'
import { InitializeOptions, initialize, mswDecorator } from 'msw-storybook-addon'

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize({
  onUnhandledRequest: 'bypass',
} as InitializeOptions)

const preview: Preview = {
  decorators: [mswDecorator],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Components', '*'],
      },
    },
  },
  tags: ['autodocs'],
}

export default preview


```

### File: angular-accelerator/.storybook/preview-head.html

```html

<style>
  html {
    font-size: var(--font-size, 1rem);
    font-family: var(
      --font-family,
      Ubuntu,
      Helvetica Neue Light,
      Helvetica Neue,
      Helvetica,
      Arial,
      Lucida Grande,
      sans-serif
    );
  }
</style>


```

### File: angular-accelerator/.storybook/storybook.css

```css

.demo-border {
  border: 5px dashed red;
}


```

### File: angular-accelerator/.storybook/tsconfig.json

```json

{
  "extends": "../tsconfig.json",
  "include": [
    "../src/**/*.stories.ts",
    "../src/**/*.stories.js",
    "../src/**/*.stories.jsx",
    "../src/**/*.stories.tsx",
    "../src/**/*.stories.mdx",
    "./preview.ts"
  ]
}


```

## Folder: angular-accelerator/assets/i18n (2 files)

### File: angular-accelerator/assets/i18n/de.json

```json

{
  "OCX_CUSTOM_GROUP_COLUMN_SELECTOR": {
    "ARIA_LABEL": "Spaltengruppe-Selektor",
    "DROPDOWN_LABEL": "Spaltengruppe",
    "OPEN_BUTTON_DETAIL": "Dialog zur Auswahl einer benutzerdefinierten Gruppe Ã¶ffnen",
    "OPEN_BUTTON_ARIA_LABEL": "Dialog zur Auswahl einer benutzerdefinierten Gruppe Ã¶ffnen",
    "ACTIVE_COLUMNS_LABEL": "Aktive Spalten",
    "INACTIVE_COLUMNS_LABEL": "Inaktive Spalten",
    "SAVE_BUTTON_LABEL": "Speichern",
    "SAVE_BUTTON_ARIA_LABEL": "Speichern",
    "CANCEL_BUTTON_LABEL": "Abbrechen",
    "CANCEL_BUTTON_ARIA_LABEL": "Abbrechen",
    "DIALOG_TITLE": "Spalten fÃ¼r benutzerdefinierte Gruppe auswÃ¤hlen",
    "CONFIGURE_ACTION_COLUMN": {
      "TITLE": "Aktionsspalte konfigurieren",
      "FREEZE": "Aktionsspalte immer anzeigen",
      "POSITION": "Position der Aktionsspalte",
      "YES": "Ja",
      "NO": "Nein",
      "LEFT": "Links",
      "RIGHT": "Rechts"
    },
    "ARIA_LABELS": {
      "UP": "Spalte nach oben verschieben",
      "TOP": "Spalte an den Anfang verschieben",
      "DOWN": "Spalte nach unten verschieben",
      "BOTTOM": "Spalte ans Ende verschieben",
      "RIGHT": "Spalte als inaktiv setzen",
      "ALL_RIGHT": "Alle Spalten als inaktiv setzen",
      "LEFT": "Spalte als aktiv setzen",
      "ALL_LEFT": "Alle Spalten als aktiv setzen",
      "CLOSE": "Dialog schlieÃŸen"
    }
  },
  "OCX_SEARCH_CONFIG": {
    "PLACEHOLDER": "Bitte geben Sie den Namen der Suchkonfiguration an.",
    "SAVE_COLUMNS_OPTION": "MÃ¶chten Sie die angezeigten Spalten speichern?",
    "SAVE_INPUT_FIELDS_OPTION": "MÃ¶chten Sie die Werte aus den Suchfeldern speichern?"
  },
  "OCX_LIST_GRID_SORT": {
    "DROPDOWN": {
      "PLACEHOLDER": "Sortierung auswÃ¤hlen",
      "ARIA_LABEL": "Sortieren nach",
      "LABEL": "Sortieren nach"
    },
    "TOGGLE_BUTTON": {
      "ASCENDING_TOOLTIP": "Aufsteigend sortieren",
      "DESCENDING_TOOLTIP": "Absteigend sortieren",
      "DEFAULT_TOOLTIP": "Standardsortierung"
    },
    "SORTING_BUTTON_ARIA_LABEL": "{{direction}} sortieren"
  },
  "OCX_DATA_TABLE": {
    "EMPTY_RESULT": "Keine Daten gefunden.",
    "EMPTY_FILTER_MESSAGE": "Keine Filter gefunden.",
    "ACTIONS_COLUMN_NAME": "Aktionen",
    "COLUMN_FILTER_ARIA_LABEL": "Spaltenfilter",
    "FILTER_TITLE": "Filter",
    "FILTER_ARIA_LABEL": "Filter {{column}}",
    "EDITED": "Bearbeitet",
    "SHOWING": "{{first}} - {{last}} von {{totalRecords}}",
    "SHOWING_WITH_TOTAL_ON_SERVER": "{{first}} - {{last}} von {{totalRecords}} ({{totalRecordsOnServer}})",
    "MORE_ACTIONS": "Weitere Aktionen",
    "ACTIONS": {
      "VIEW": "Anzeigen",
      "EDIT": "Bearbeiten",
      "DELETE": "LÃ¶schen"
    },
    "TOGGLE_BUTTON": {
      "ASCENDING_TITLE": "Aufsteigend sortieren",
      "DESCENDING_TITLE": "Absteigend sortieren",
      "DEFAULT_TITLE": "Standardsortierung",
      "ARIA_LABEL": "{{column}} {{direction}} sortieren"
    },
    "SELECT_ALL_ARIA_LABEL": "Selektiere alle Zeilen der Tabelle",
    "SELECT_ALL_TOOLTIP": "Selektiere alle",
    "SELECT_ARIA_LABEL": "Selektiere die Tabellenspalte mit der ID {{key}}",
    "FILTER_YES": "Ja",
    "FILTER_NO": "Nein"
  },
  "OCX_DATA_LIST_GRID": {
    "EMPTY_RESULT": "Keine Daten gefunden.",
    "MENU": {
      "VIEW": "Anzeigen",
      "EDIT": "Bearbeiten",
      "DELETE": "LÃ¶schen"
    },
    "MORE_ACTIONS_ARIA_LABEL": "Weitere Aktionen",
    "MORE_ACTIONS_TOOLTIP": "Weitere Aktionen anzeigen"
  },
  "OCX_DATA_LAYOUT_SELECTION": {
    "LAYOUT": {
      "LIST": "Liste",
      "GRID": "Raster",
      "TABLE": "Tabelle"
    }
  },
  "OCX_INTERACTIVE_DATA_VIEW": {
    "DEFAULT_GROUP": "Standardgruppe",
    "CUSTOM_GROUP": "Benutzerdefinierte Gruppe",
    "NO_GROUP_SELECTED": "Keine Gruppe ausgewÃ¤hlt"
  },
  "OCX_FILTER_VIEW": {
    "NO_FILTERS": "Keine Filter ausgewÃ¤hlt",
    "RESET_FILTERS_BUTTON": {
      "ARIA_LABEL": "Angewandte Filter zurÃ¼cksetzen",
      "DETAIL": "Angewandte Filter zurÃ¼cksetzen"
    },
    "FILTER_YES": "Ja",
    "FILTER_NO": "Nein",
    "MANAGE_FILTERS_BUTTON": {
      "LABEL": "Filter",
      "ARIA_LABEL": "Aktive Filter verwalten",
      "DETAIL": "Aktive Filter verwalten"
    },
    "TABLE": {
      "COLUMN_NAME": "Spaltenname",
      "VALUE": "Filterwert",
      "ACTIONS": "Aktionen",
      "REMOVE_FILTER_TITLE": "Filter lÃ¶schen",
      "REMOVE_FILTER_ARIA_LABEL": "Filter lÃ¶schen"
    },
    "PANEL_TITLE": "Filter"
  },
  "OCX_SEARCH_HEADER": {
    "TOGGLE_BUTTON": {
      "SIMPLE": {
        "TEXT": "Einfach",
        "DETAIL": "Zu einfachen Suchkriterien wechseln"
      },
      "ADVANCED": {
        "TEXT": "Erweitert",
        "DETAIL": "Zu erweiterten Suchkriterien wechseln"
      }
    },
    "OCX_SEARCH_CONFIG": {
      "DROPDOWN_DEFAULT": "Gespeicherte Suchvorlage auswÃ¤hlen"
    },
    "HEADER": "Suche",
    "RESET_BUTTON": {
      "TEXT": "ZurÃ¼cksetzen",
      "ARIA_LABEL": "Suchkriterien zurÃ¼cksetzen",
      "DETAIL": "Suchkriterien zurÃ¼cksetzen"
    },
    "SEARCH_BUTTON": {
      "TEXT": "Suchen",
      "ARIA_LABEL": "Suche starten",
      "DETAIL": "Suche starten"
    },
    "EXPORT": "Alle Ereignisse exportieren"
  },
  "OCX_PAGE_HEADER": {
    "IMAGE": "Seitentitelbild",
    "SUBHEADER": "Seiteninhalt",
    "MORE_ACTIONS": "Weitere Aktionen",
    "HOME_DEFAULT_ARIA_LABEL": "Zur Startseite navigieren",
    "HOME_ARIA_LABEL": "Zu {{page}} navigieren"
  },
  "OCX_DIAGRAM": {
    "ARIA_LABEL": "Diagramm: Gesamtanzahl: {{total}}. {{valueString}}.",
    "EMPTY_ARIA_LABEL": "Diagramm ohne Daten",
    "SUM": "Gesamtanzahl",
    "NO_DATA": "Es sind keine Daten vorhanden",
    "SWITCH_DIAGRAM_TYPE": {
      "PIE": "Zu Tortendiagramm wechseln",
      "HORIZONTAL_BAR": "Zu horizontalem Balkendiagramm wechseln",
      "VERTICAL_BAR": "Zu vertikalem Balkendiagramm wechseln"
    }
  },
  "OCX_TIMEAGO": {
    "A_DAY_AGO": "vor einem Tag",
    "A_FEW_SECONDS_AGO": "vor ein paar Sekunden",
    "AN_HOUR_AGO": "vor einer Stunde",
    "A_MINUTE_AGO": "vor einer Minute",
    "A_MONAT_AGO": "vor einem Monat",
    "A_YEAR_AGO": "vor einem Jahr",
    "DAYS_AGO": "vor {{days}} Tagen",
    "HOURS_AGO": "vor {{hours}} Stunden",
    "MINUTES_AGO": "vor {{minutes}} Minuten",
    "MONTHS_AGO": "vor {{months}} Monaten",
    "YEARS_AGO": "vor {{years}} Jahren"
  },
  "OCX_DATA_LOADING_ERROR": {
    "TITLE": "Die Daten konnten nicht geladen werden.",
    "MESSAGE": "Dies kann folgende GrÃ¼nde haben: \n -Die Daten existieren nicht oder nicht mehr.\n - Die Daten konnten aufgrund eines Fehlers im System nicht geladen werden.\n - Ihnen fehlt die nÃ¶tige Berechtigung um die Daten zu laden.\n Bitte kontaktieren Sie den Support, wenn Sie glauben, dass es sich hierbei um einen Fehler des Systems handelt."
  }
}


```

### File: angular-accelerator/assets/i18n/en.json

```json

{
  "OCX_CUSTOM_GROUP_COLUMN_SELECTOR": {
    "ARIA_LABEL": "Column group selector",
    "DROPDOWN_LABEL": "Column group",
    "OPEN_BUTTON_DETAIL": "Open custom group selection dialog",
    "OPEN_BUTTON_ARIA_LABEL": "Open custom group selection dialog",
    "ACTIVE_COLUMNS_LABEL": "Active columns",
    "INACTIVE_COLUMNS_LABEL": "Inactive columns",
    "SAVE_BUTTON_LABEL": "Save",
    "SAVE_BUTTON_ARIA_LABEL": "Save",
    "CANCEL_BUTTON_LABEL": "Cancel",
    "CANCEL_BUTTON_ARIA_LABEL": "Cancel",
    "DIALOG_TITLE": "Custom group column selection",
    "CONFIGURE_ACTION_COLUMN": {
      "TITLE": "Configure action column",
      "FREEZE": "Always show action column",
      "POSITION": "Position of action column",
      "YES": "Yes",
      "NO": "No",
      "LEFT": "Left",
      "RIGHT": "Right"
    },
    "ARIA_LABELS": {
      "UP": "Move column up",
      "TOP": "Move column to the top",
      "DOWN": "Move column down",
      "BOTTOM": "Move column to the bottom",
      "RIGHT": "Set column as inactive",
      "ALL_RIGHT": "Set all columns as inactive",
      "LEFT": "Set column as active",
      "ALL_LEFT": "Set all columns as active",
      "CLOSE": "Close dialog"
    }
  },
  "OCX_SEARCH_CONFIG": {
    "PLACEHOLDER": "Please enter the name of the search configuration",
    "SAVE_COLUMNS_OPTION": "Do you want to save the shown columns?",
    "SAVE_INPUT_FIELDS_OPTION": "Do you want to save the input values from the input fields?"
  },
  "OCX_LIST_GRID_SORT": {
    "DROPDOWN": {
      "PLACEHOLDER": "Select sorting",
      "ARIA_LABEL": "Sort by",
      "LABEL": "Sort by"
    },
    "TOGGLE_BUTTON": {
      "ASCENDING_TOOLTIP": "Sort Ascending",
      "DESCENDING_TOOLTIP": "Sort Descending",
      "DEFAULT_TOOLTIP": "Default Sort"
    },
    "SORTING_BUTTON_ARIA_LABEL": "Toggle sorting direction to {{direction}}"
  },
  "OCX_DATA_TABLE": {
    "EMPTY_RESULT": "No data found.",
    "EMPTY_FILTER_MESSAGE": "No filters found.",
    "ACTIONS_COLUMN_NAME": "Actions",
    "COLUMN_FILTER_ARIA_LABEL": "Column filter",
    "FILTER_TITLE": "Filter",
    "FILTER_ARIA_LABEL": "Filter {{column}}",
    "EDITED": "Edited",
    "SHOWING": "{{first}} - {{last}} of {{totalRecords}}",
    "SHOWING_WITH_TOTAL_ON_SERVER": "{{first}} - {{last}} of {{totalRecords}} ({{totalRecordsOnServer}})",
    "MORE_ACTIONS": "More actions",
    "ACTIONS": {
      "VIEW": "View",
      "EDIT": "Edit",
      "DELETE": "Delete"
    },
    "TOGGLE_BUTTON": {
      "ASCENDING_TITLE": "Sort Ascending",
      "DESCENDING_TITLE": "Sort Descending",
      "DEFAULT_TITLE": "Default Sort",
      "ARIA_LABEL": "Toggle {{column}} sorting direction to {{direction}}"
    },
    "SELECT_ALL_ARIA_LABEL": "Select all table rows",
    "SELECT_ALL_TOOLTIP": "Select all",
    "SELECT_ARIA_LABEL": "Select table row with id {{key}}",
    "FILTER_YES": "Yes",
    "FILTER_NO": "No"
  },
  "OCX_DATA_LIST_GRID": {
    "EMPTY_RESULT": "No data found.",
    "MENU": {
      "VIEW": "View",
      "EDIT": "Edit",
      "DELETE": "Delete"
    },
    "MORE_ACTIONS_ARIA_LABEL": "More actions",
    "MORE_ACTIONS_TOOLTIP": "Display more actions"
  },
  "OCX_DATA_LAYOUT_SELECTION": {
    "LAYOUT": {
      "LIST": "List",
      "GRID": "Grid",
      "TABLE": "Table"
    }
  },
  "OCX_INTERACTIVE_DATA_VIEW": {
    "DEFAULT_GROUP": "Default group",
    "CUSTOM_GROUP": "Custom group",
    "NO_GROUP_SELECTED": "No group selected"
  },
  "OCX_FILTER_VIEW": {
    "NO_FILTERS": "No filters selected",
    "RESET_FILTERS_BUTTON": {
      "ARIA_LABEL": "Reset applied filters",
      "DETAIL": "Reset applied filters"
    },
    "FILTER_YES": "Yes",
    "FILTER_NO": "No",
    "MANAGE_FILTERS_BUTTON": {
      "LABEL": "Filters",
      "ARIA_LABEL": "Manage active filters",
      "DETAIL": "Manage active filters"
    },
    "TABLE": {
      "COLUMN_NAME": "Column name",
      "VALUE": "Filter value",
      "ACTIONS": "Actions",
      "REMOVE_FILTER_TITLE": "Remove filter",
      "REMOVE_FILTER_ARIA_LABEL": "Remove filter"
    },
    "PANEL_TITLE": "Filters"
  },
  "OCX_SEARCH_HEADER": {
    "TOGGLE_BUTTON": {
      "SIMPLE": {
        "TEXT": "Simple",
        "DETAIL": "Switch to simple search criteria"
      },
      "ADVANCED": {
        "TEXT": "Advanced",
        "DETAIL": "Switch to advanced search criteria"
      }
    },
    "OCX_SEARCH_CONFIG": {
      "DROPDOWN_DEFAULT": "Pick predefined template"
    },
    "HEADER": "Search",
    "RESET_BUTTON": {
      "TEXT": "Reset",
      "ARIA_LABEL": "Reset search criteria",
      "DETAIL": "Reset search criteria"
    },
    "SEARCH_BUTTON": {
      "TEXT": "Search",
      "ARIA_LABEL": "Start search",
      "DETAIL": "Start search"
    },
    "EXPORT": "Export all events"
  },
  "OCX_PAGE_HEADER": {
    "IMAGE": "Page title logo",
    "SUBHEADER": "Page Content",
    "MORE_ACTIONS": "More actions",
    "HOME_DEFAULT_ARIA_LABEL": "Go to home page",
    "HOME_ARIA_LABEL": "Go to {{page}} home page"
  },
  "OCX_DIAGRAM": {
    "ARIA_LABEL": "Chart: Total amount: {{total}}. {{valueString}}.",
    "EMPTY_ARIA_LABEL": "Chart with no data",
    "SUM": "Total",
    "NO_DATA": "There is no data available",
    "SWITCH_DIAGRAM_TYPE": {
      "PIE": "Switch to pie chart",
      "HORIZONTAL_BAR": "Switch to horizontal bar chart",
      "VERTICAL_BAR": "Switch to vertical bar chart"
    }
  },
  "OCX_TIMEAGO": {
    "A_DAY_AGO": "a day ago",
    "A_FEW_SECONDS_AGO": "a few seconds ago",
    "AN_HOUR_AGO": "an hour ago",
    "A_MINUTE_AGO": "a minute ago",
    "A_MONTH_AGO": "a month ago",
    "A_YEAR_AGO": "a year ago",
    "DAYS_AGO": "{{days}} days ago",
    "HOURS_AGO": "{{hours}} hours ago",
    "MINUTES_AGO": "{{minutes}} minutes ago",
    "MONTHS_AGO": "{{months}} months ago",
    "YEARS_AGO": "{{years}} years ago"
  },
  "OCX_DATA_LOADING_ERROR": {
    "TITLE": "The data could not be loaded.",
    "MESSAGE": "This may have the following reasons:\n The data does not exist or no longer exists.\n The data could not be loaded due to an error in the system.\n You do not have the necessary permission to load the data.\n Please contact the support if you think this happened due to a system error."
  }
}


```

## Folder: angular-accelerator/assets/i18n/storybook-translations/page-header (2 files)

### File: angular-accelerator/assets/i18n/storybook-translations/page-header/de.json

```json

{
  "pageheader": {
    "header": "Funktions-Titel",
    "subheader": "Funktions-Untertitel",
    "extra": "Funktions-Extra",
    "valueTooltip": "Funktions-Wert-Tooltip",
    "labelTooltip": "Funktions-Label-Tooltip",
    "actionItemTooltip": "Funktions-Aktions-Tooltip",
    "actionItemAriaLabel": "Funktions-Aktions-Aria-Label",
    "statusLabelTooltip": "Funktions-Status-Label-Tooltip (status: {{status}})",
    "statusValueTooltip": "Funktions-Status-Wert-Tooltip (value: {{value}})"
  }
}


```

### File: angular-accelerator/assets/i18n/storybook-translations/page-header/en.json

```json

{
  "pageheader": {
    "header": "Feature Title",
    "subheader": "Feature Subtitle",
    "extra": "Feature Extra",
    "valueTooltip": "Feature Value Tooltip",
    "labelTooltip": "Feature Label Tooltip",
    "actionItemTooltip": "Feature Action Item Tooltip",
    "actionItemAriaLabel": "Feature Action Item Aria Label",
    "statusLabelTooltip": "Feature Status Label Tooltip (status: {{status}})",
    "statusValueTooltip": "Feature Status Value Tooltip (value: {{value}})"
  }
}


```

## Folder: angular-accelerator/migrations (3 files)

### File: angular-accelerator/migrations/index.ts

```ts

export * from './v6/migrate-onecx-to-v6'

```

### File: angular-accelerator/migrations/tsconfig.json

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

### File: angular-accelerator/migrations/tsconfig.migrations.json

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

## Folder: angular-accelerator/migrations/v6 (1 files)

### File: angular-accelerator/migrations/v6/migrate-onecx-to-v6.ts

```ts

import { Tree } from '@nx/devkit'
import { commonMigrateOnecxToV6 } from '@onecx/nx-migration-utils'

export default async function migrateOnecxToV6(tree: Tree) {
  await commonMigrateOnecxToV6(tree)
}


```

## Folder: angular-accelerator/src (2 files)

### File: angular-accelerator/src/index.ts

```ts

// injection tokens + related utilities

// directives
export * from './lib/directives/content-container.directive'
export * from './lib/directives/content.directive'
export * from './lib/directives/if-permission.directive'
export * from './lib/directives/if-breakpoint.directive'
export * from './lib/directives/src.directive'
export * from './lib/directives/advanced.directive'
export * from './lib/directives/tooltipOnOverflow.directive'
export * from './lib/directives/template.directive'
export * from './lib/directives/basic.directive'
export * from './lib/directives/loading-indicator.directive'

// components
export * from './lib/components/column-group-selection/column-group-selection.component'
export * from './lib/components/content/content.component'
export * from './lib/components/content-container/content-container.component'
export * from './lib/components/custom-group-column-selector/custom-group-column-selector.component'
export * from './lib/components/data-layout-selection/data-layout-selection.component'
export * from './lib/components/data-list-grid/data-list-grid.component'
export * from './lib/components/data-list-grid-sorting/data-list-grid-sorting.component'
export * from './lib/components/data-table/data-table.component'
export * from './lib/components/data-view/data-view.component'
export * from './lib/components/diagram/diagram.component'
export * from './lib/components/filter-view/filter-view.component'
export * from './lib/components/group-by-count-diagram/group-by-count-diagram.component'
export * from './lib/components/interactive-data-view/interactive-data-view.component'
export * from './lib/components/lifecycle/lifecycle.component'
export * from './lib/components/page-header/page-header.component'
export * from './lib/components/search-header/search-header.component'
export * from './lib/components/dialog/dialog-message-content/dialog-message-content.component'
export * from './lib/components/loading-indicator/loading-indicator.component'
export * from './lib/components/dialog/dialog-content/dialog-content.component'
export * from './lib/components/dialog/dialog-inline/dialog-inline.component'
export * from './lib/components/dialog/dialog-footer/dialog-footer.component'
export * from './lib/components/error-component/global-error.component'

// services
export * from './lib/services/breadcrumb.service'
export * from './lib/services/portal-dialog.service'
export * from './lib/services/export-data.service'

// pipes
export * from './lib/pipes/dynamic.pipe'
export * from './lib/pipes/ocxtimeago.pipe'
export * from './lib/pipes/relative-date.pipe'

// models
export * from './lib/model/breadcrumb-menu-item.model'
export * from './lib/model/column-type.model'
export * from './lib/model/data-action'
export * from './lib/model/button-dialog'
export * from './lib/model/translation.model'

// export * from './lib/model/data-column-name-id.model'
export * from './lib/model/data-sort-direction'
export * from './lib/model/data-table-column.model'
export * from './lib/model/diagram-column'
// export * from './lib/model/diagram-data'
export * from './lib/model/diagram-type'
export * from './lib/model/filter.model'

// core
export * from './lib/angular-accelerator.module'
export * from './lib/angular-accelerator-primeng.module'

// functions
export * from './lib/functions/flatten-object'
export * from './lib/functions/at-least-one-field-filled-validator'

// utils
export * from './lib/utils/colorutils'
export * from './lib/utils/data-operation-strategy'
export * from './lib/utils/dateutils'
export * from './lib/utils/objectutils'
export * from './lib/utils/primeicon.utils'
export * from './lib/utils/enum-to-dropdown-options.utils'
export * from './lib/utils/criteria.utils'
export * from './lib/utils/string-and-array-helper-functions.utils'
export * from './lib/utils/template.utils'
export * from './lib/utils/filter.utils'
export * from './lib/utils/image-logo-url.utils'


```

### File: angular-accelerator/src/test-setup.ts

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

## Folder: angular-accelerator/src/lib (5 files)

### File: angular-accelerator/src/lib/angular-accelerator.module.ts

```ts

import { CommonModule } from '@angular/common'
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'

import { AppConfigService, UserService } from '@onecx/angular-integration-interface'
import { AngularRemoteComponentsModule } from '@onecx/angular-remote-components'

import { firstValueFrom, skip } from 'rxjs'
import { AngularAcceleratorPrimeNgModule } from './angular-accelerator-primeng.module'
import { ColumnGroupSelectionComponent } from './components/column-group-selection/column-group-selection.component'
import { CustomGroupColumnSelectorComponent } from './components/custom-group-column-selector/custom-group-column-selector.component'
import { DataLayoutSelectionComponent } from './components/data-layout-selection/data-layout-selection.component'
import { DataListGridSortingComponent } from './components/data-list-grid-sorting/data-list-grid-sorting.component'
import { DataListGridComponent } from './components/data-list-grid/data-list-grid.component'
import { DataTableComponent } from './components/data-table/data-table.component'
import { DataViewComponent } from './components/data-view/data-view.component'
import { DiagramComponent } from './components/diagram/diagram.component'
import { GroupByCountDiagramComponent } from './components/group-by-count-diagram/group-by-count-diagram.component'
import { InteractiveDataViewComponent } from './components/interactive-data-view/interactive-data-view.component'
import { PageHeaderComponent } from './components/page-header/page-header.component'
import { SearchHeaderComponent } from './components/search-header/search-header.component'
import { AdvancedDirective } from './directives/advanced.directive'
import { IfBreakpointDirective } from './directives/if-breakpoint.directive'
import { IfPermissionDirective } from './directives/if-permission.directive'
import {
  providePermissionChecker,
  provideTranslationConnectionService,
  provideTranslationPathFromMeta,
  MultiLanguageMissingTranslationHandler,
} from '@onecx/angular-utils'
import { SrcDirective } from './directives/src.directive'
import { TooltipOnOverflowDirective } from './directives/tooltipOnOverflow.directive'
import { DynamicPipe } from './pipes/dynamic.pipe'
import { OcxTimeAgoPipe } from './pipes/ocxtimeago.pipe'
import { DynamicLocaleId } from './utils/dynamic-locale-id'
import { FilterViewComponent } from './components/filter-view/filter-view.component'
import { TemplateDirective } from './directives/template.directive'
import { OcxContentComponent } from './components/content/content.component'
import { OcxContentContainerComponent } from './components/content-container/content-container.component'
import { OcxContentDirective } from './directives/content.directive'
import { OcxContentContainerDirective } from './directives/content-container.directive'
import { LifecycleComponent } from './components/lifecycle/lifecycle.component'
import { DialogMessageContentComponent } from './components/dialog/dialog-message-content/dialog-message-content.component'
import { DialogContentComponent } from './components/dialog/dialog-content/dialog-content.component'
import { DialogFooterComponent } from './components/dialog/dialog-footer/dialog-footer.component'
import { DialogInlineComponent } from './components/dialog/dialog-inline/dialog-inline.component'
import { GlobalErrorComponent } from './components/error-component/global-error.component'
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component'
import { BasicDirective } from './directives/basic.directive'
import { LoadingIndicatorDirective } from './directives/loading-indicator.directive'
import { MessageService } from 'primeng/api'

export class AngularAcceleratorMissingTranslationHandler extends MultiLanguageMissingTranslationHandler {}

function appInitializer(userService: UserService) {
  return async () => {
    await firstValueFrom(userService.lang$.pipe(skip(1)))
  }
}

@NgModule({
  imports: [
    CommonModule,
    AngularAcceleratorPrimeNgModule,
    AngularRemoteComponentsModule,
    TranslateModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ColumnGroupSelectionComponent,
    CustomGroupColumnSelectorComponent,
    DataLayoutSelectionComponent,
    DataListGridSortingComponent,
    DataListGridComponent,
    DataTableComponent,
    DataViewComponent,
    InteractiveDataViewComponent,
    LifecycleComponent,
    PageHeaderComponent,
    DynamicPipe,
    SearchHeaderComponent,
    DiagramComponent,
    GroupByCountDiagramComponent,
    OcxContentComponent,
    OcxContentContainerComponent,
    IfPermissionDirective,
    IfBreakpointDirective,
    SrcDirective,
    OcxTimeAgoPipe,
    AdvancedDirective,
    TooltipOnOverflowDirective,
    FilterViewComponent,
    TemplateDirective,
    OcxContentDirective,
    OcxContentContainerDirective,
    GlobalErrorComponent,
    LoadingIndicatorComponent,
    LoadingIndicatorDirective,
    BasicDirective,
    DialogFooterComponent,
    DialogContentComponent,
    DialogInlineComponent,
    DialogMessageContentComponent,
  ],
  providers: [
    providePermissionChecker(),
    {
      provide: LOCALE_ID,
      useClass: DynamicLocaleId,
      deps: [UserService],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [UserService],
      multi: true,
    },
    provideTranslationPathFromMeta(import.meta.url, 'onecx-angular-accelerator/assets/i18n/'),
    provideTranslationPathFromMeta(import.meta.url, 'onecx-angular-accelerator/assets/i18n/primeng/'),
    {
      provide: MessageService,
      useClass: MessageService,
    },
    AppConfigService,
    provideTranslationConnectionService(),
  ],
  exports: [
    AngularRemoteComponentsModule,
    ColumnGroupSelectionComponent,
    CustomGroupColumnSelectorComponent,
    DataLayoutSelectionComponent,
    DataListGridComponent,
    DataTableComponent,
    DataViewComponent,
    InteractiveDataViewComponent,
    LifecycleComponent,
    PageHeaderComponent,
    SearchHeaderComponent,
    DiagramComponent,
    GroupByCountDiagramComponent,
    OcxContentComponent,
    OcxContentContainerComponent,
    IfPermissionDirective,
    IfBreakpointDirective,
    SrcDirective,
    OcxTimeAgoPipe,
    AdvancedDirective,
    TooltipOnOverflowDirective,
    FilterViewComponent,
    TemplateDirective,
    OcxContentDirective,
    OcxContentContainerDirective,
    GlobalErrorComponent,
    LoadingIndicatorComponent,
    LoadingIndicatorDirective,
    BasicDirective,
    DialogFooterComponent,
    DialogContentComponent,
    DialogInlineComponent,
    DialogMessageContentComponent,
  ],
})
export class AngularAcceleratorModule {}


```

### File: angular-accelerator/src/lib/angular-accelerator-primeng.module.ts

```ts

import { NgModule } from '@angular/core'
import { SelectModule } from 'primeng/select'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { PickListModule } from 'primeng/picklist'
import { SelectButtonModule } from 'primeng/selectbutton'
import { DataViewModule } from 'primeng/dataview'
import { TableModule } from 'primeng/table'
import { MenuModule } from 'primeng/menu'
import { ChartModule } from 'primeng/chart'
import { MultiSelectModule } from 'primeng/multiselect'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { SkeletonModule } from 'primeng/skeleton'
import { MessageModule } from 'primeng/message'
import { SharedModule } from 'primeng/api'
import { CheckboxModule } from 'primeng/checkbox'
import { FloatLabelModule } from 'primeng/floatlabel'
import { ChipModule } from 'primeng/chip'
import { PopoverModule } from 'primeng/popover'
import { FocusTrapModule } from 'primeng/focustrap'
import { TooltipModule } from 'primeng/tooltip'
import { providePrimeNG } from 'primeng/config'
import { TimelineModule } from 'primeng/timeline'

@NgModule({
  imports: [
    BreadcrumbModule,
    ChipModule,
    CheckboxModule,
    SelectModule,
    ButtonModule,
    DialogModule,
    PickListModule,
    SelectButtonModule,
    DataViewModule,
    TableModule,
    MenuModule,
    ChartModule,
    MultiSelectModule,
    SkeletonModule,
    MessageModule,
    FloatLabelModule,
    PopoverModule,
    FocusTrapModule,
    TooltipModule,
    TimelineModule,
    SelectButtonModule,
    SharedModule,
  ],
  exports: [
    BreadcrumbModule,
    ChipModule,
    CheckboxModule,
    SelectModule,
    ButtonModule,
    DialogModule,
    PickListModule,
    SelectButtonModule,
    DataViewModule,
    TableModule,
    MenuModule,
    ChartModule,
    MultiSelectModule,
    SkeletonModule,
    MessageModule,
    FloatLabelModule,
    PopoverModule,
    FocusTrapModule,
    TooltipModule,
    TimelineModule,
    SelectButtonModule,
    SharedModule,
  ],
  providers: [providePrimeNG()],
})
export class AngularAcceleratorPrimeNgModule {}


```

### File: angular-accelerator/src/lib/storybook-breadcrumb.module.ts

```ts

import { ModuleWithProviders, NgModule, inject } from '@angular/core'
import { BreadCrumbMenuItem } from './model/breadcrumb-menu-item.model'
import { BreadcrumbService } from './services/breadcrumb.service'
import { StorybookTranslateModule } from './storybook-translate.module'

@NgModule({
  imports: [StorybookTranslateModule],
})
export class StorybookBreadcrumbModule {
  constructor() {
    const breadcrumbService = inject(BreadcrumbService)
    const breadcrumbs = inject<BreadCrumbMenuItem[]>('BREADCRUMBS' as any)

    breadcrumbService.setItems(breadcrumbs)
  }

  public static init(breadcrumbs: BreadCrumbMenuItem[]): ModuleWithProviders<StorybookBreadcrumbModule> {
    const module: ModuleWithProviders<StorybookBreadcrumbModule> = {
      ngModule: StorybookBreadcrumbModule,
      providers: [{ provide: 'BREADCRUMBS', useValue: breadcrumbs }],
    }
    return module
  }
}


```

### File: angular-accelerator/src/lib/storybook-theme.module.ts

```ts

import { NgModule } from '@angular/core'
import { providePrimeNG } from 'primeng/config'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { CustomPreset } from '@onecx/angular-utils/theme/primeng'

/**
  A utility module adding theme for Storybook stories
 **/
@NgModule({
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: CustomPreset,
        options: { darkModeSelector: false },
      },
    }),
  ],
})
export class StorybookThemeModule {}


```

### File: angular-accelerator/src/lib/storybook-translate.module.ts

```ts

import { registerLocaleData } from '@angular/common'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import localeDE from '@angular/common/locales/de'
import { NgModule, inject } from '@angular/core'
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { TRANSLATION_PATH, TranslateCombinedLoader, createTranslateLoader } from '@onecx/angular-utils'

export function translateLoader(http: HttpClient) {
  return new TranslateCombinedLoader(new TranslateHttpLoader(http, `./assets/i18n/`, '.json'))
}
/**
 * StorybookTranslateModule
 *
 * Add feature-specific translation files (e.g., only pageheader keys) to libs/angular-accelerator/assets/i18n/.
 *
 * Reference each file in TRANSLATION_PATH using its base path (e.g., '/assets/i18n/page-header').
 * The loader will append the language suffix and .json automatically.
 *
 * Example:
 *   { provide: TRANSLATION_PATH, useValue: '/assets/i18n/page-header', multi: true }
 **/
const STORYBOOK_TRANSLATION_PROVIDERS = [
  {
    provide: TRANSLATION_PATH,
    useValue: '/assets/i18n/',
    multi: true,
  },
  {
    provide: TRANSLATION_PATH,
    useValue: '/assets/i18n/storybook-translations/page-header/',
    multi: true,
  }
]

@NgModule({
  exports: [TranslateModule],
  imports: [
    TranslateModule.forRoot({
      isolate: true,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    provideAppStateServiceMock(),
    provideHttpClient(withInterceptorsFromDi()),
    ...STORYBOOK_TRANSLATION_PROVIDERS
  ],
})
export class StorybookTranslateModule {
  constructor(...args: unknown[])

  constructor() {
    const translateService = inject(TranslateService)
    registerLocaleData(localeDE)
    const lang = translateService.getBrowserLang()
    const supportedLanguages = ['de', 'en']
    if (lang && supportedLanguages.includes(lang)) {
      translateService.use(lang)
    } else {
      translateService.use('en')
    }
  }
}


```

## Folder: angular-accelerator/src/lib/components/column-group-selection (2 files)

### File: angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.html

```html

<p-floatlabel variant="on">
  @if ((allGroupKeys$ | async)?.length) {
    <p-select
      inputId="columnGroupSelectionDropdown"
      id="columnGroupSelectionDropdownElement"
      (onChange)="changeGroupSelection($event)"
      [options]="(allGroupKeys$ | async) || []"
      [placeholder]="placeholderKey | translate"
      [(ngModel)]="selectedGroupKey"
      [ariaLabel]="'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABEL' | translate"
      >
      <ng-template let-item #item> {{ item ? (item | translate) : ''}} </ng-template>
      <ng-template let-item #selectedItem> {{ item ? (item | translate) : ''}} </ng-template>
    </p-select>
  }
  @if ((allGroupKeys$ | async)?.length) {
    <label for="columnGroupSelectionDropdown"
      >{{ ("OCX_CUSTOM_GROUP_COLUMN_SELECTOR.DROPDOWN_LABEL" | translate) }}</label
      >
    }
  </p-floatlabel>


```

### File: angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.ts

```ts

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs'
import { DataTableColumn } from '../../model/data-table-column.model'

export type GroupSelectionChangedEvent = { activeColumns: DataTableColumn[]; groupKey: string }
export interface ColumnGroupSelectionComponentState {
  activeColumnGroupKey?: string
  displayedColumns?: DataTableColumn[]
}
@Component({
  standalone: false,
  templateUrl: './column-group-selection.component.html',
  selector: 'ocx-column-group-selection',
  styleUrls: ['./column-group-selection.component.scss'],
})
export class ColumnGroupSelectionComponent implements OnInit {
  selectedGroupKey$ = new BehaviorSubject<string>('')
  @Input()
  get selectedGroupKey(): string {
    return this.selectedGroupKey$.getValue()
  }
  set selectedGroupKey(value: string) {
    this.selectedGroupKey$.next(value)
    if (this.selectedGroupKey === this.customGroupKey) {
      this.componentStateChanged.emit({
        activeColumnGroupKey: value,
      })
    }
  }

  columns$ = new BehaviorSubject<DataTableColumn[]>([])
  @Input()
  get columns(): DataTableColumn[] {
    return this.columns$.getValue()
  }
  set columns(value: DataTableColumn[]) {
    this.columns$.next(value)
  }
  @Input() placeholderKey = ''
  @Input() defaultGroupKey = ''
  @Input() customGroupKey = ''

  @Output() groupSelectionChanged: EventEmitter<GroupSelectionChangedEvent> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<ColumnGroupSelectionComponentState> = new EventEmitter()

  allGroupKeys$: Observable<string[]> | undefined

  ngOnInit() {
    this.allGroupKeys$ = combineLatest([this.columns$, this.selectedGroupKey$]).pipe(
      map(([columns, selectedGroupKey]) =>
        columns
          .map((keys) => keys.predefinedGroupKeys || [])
          .flat()
          .concat([this.defaultGroupKey])
          .concat([selectedGroupKey])
          .filter((value) => !!value)
          .filter((value, index, self) => self.indexOf(value) === index && value != null)
      )
    )
    if (this.selectedGroupKey === this.customGroupKey) {
      this.componentStateChanged.emit({
        activeColumnGroupKey: this.selectedGroupKey,
      })
    } else {
      const activeColumns = this.columns.filter((c) =>
        c.predefinedGroupKeys?.includes(this.selectedGroupKey$.getValue() ?? this.defaultGroupKey)
      )
      this.componentStateChanged.emit({
        activeColumnGroupKey: this.selectedGroupKey,
        displayedColumns: activeColumns,
      })
    }
  }

  changeGroupSelection(event: { value: string }) {
    if (event.value === this.customGroupKey) {
      return
    }
    const activeColumns = this.columns.filter((c) => c.predefinedGroupKeys?.includes(event.value))
    this.groupSelectionChanged.emit({ activeColumns, groupKey: event.value })
    this.componentStateChanged.emit({
      activeColumnGroupKey: event.value,
      displayedColumns: activeColumns,
    })
  }
}


```

## Folder: angular-accelerator/src/lib/components/content (4 files)

### File: angular-accelerator/src/lib/components/content/content.component.html

```html

<div [ocxContent]="title" [ngClass]="styleClass">
    <ng-content></ng-content>
</div>

```

### File: angular-accelerator/src/lib/components/content/content.component.spec.ts

```ts

import { OcxContentHarness } from '../../../../testing/content.harness'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OcxContentComponent } from './content.component'
import { OcxContentDirective } from '../../directives/content.directive'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { Component } from '@angular/core'
import { By } from '@angular/platform-browser'

@Component({
  standalone: false,
  template: `
    <ocx-content title="Test 1">
      <p>Content inside of ocx-content with title</p>
    </ocx-content>
    <ocx-content title="Test 2">
      <p>Content inside of ocx-content with title</p>
    </ocx-content>
    <ocx-content title="Test 3">
      <p>Content inside of ocx-content with title</p>
    </ocx-content>
  `,
})
class MockComponent {}

describe('OcxContentComponent', () => {
  describe('1 component per page', () => {
    let component: OcxContentComponent
    let fixture: ComponentFixture<OcxContentComponent>
    let ocxContentHarness: OcxContentHarness
    const testComponentTitle = 'My cool title'
    const titleBaseId = 'ocx_content_title_element'
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [OcxContentComponent, OcxContentDirective],
      }).compileComponents()

      fixture = TestBed.createComponent(OcxContentComponent)
      component = fixture.componentInstance
      ocxContentHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, OcxContentHarness)
    })

    it('should create', () => {
      expect(component).toBeTruthy()
    })

    it('should render a ocxContent card with no title by default', async () => {
      const expectedClasses = ['card']
      expect(await ocxContentHarness.getContentClasses()).toEqual(expectedClasses)
      expect(await ocxContentHarness.hasTitle(titleBaseId)).toEqual(false)
    })

    it('should render a ocxContent card with a title, when given a title via input', async () => {
      const expectedClasses = ['card']
      expect(await ocxContentHarness.getContentClasses()).toEqual(expectedClasses)
      expect(await ocxContentHarness.hasTitle(titleBaseId)).toEqual(false)

      component.title = testComponentTitle

      const expectedTitleClasses = ['font-medium', 'text-lg']
      expect(await ocxContentHarness.hasTitle(titleBaseId)).toEqual(true)
      expect(await ocxContentHarness.hasTitle(titleBaseId + '0')).toEqual(false)
      expect(await ocxContentHarness.getTitle(titleBaseId)).toEqual(testComponentTitle)
      expect(await ocxContentHarness.getTitleClasses(titleBaseId)).toEqual(expectedTitleClasses)
    })
    it('should apply classes specified via input', async () => {
      component.styleClass = 'py-4 mt-2'
      const expectedStyleClasses = ['card', 'py-4', 'mt-2']
      expect(await ocxContentHarness.getContentClasses()).toEqual(expectedStyleClasses)
    })
  })

  describe('Multiple components per page', () => {
    let component: MockComponent
    let fixture: ComponentFixture<MockComponent>
    const titleBaseId = 'ocx_content_title_element'
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [MockComponent, OcxContentComponent, OcxContentDirective],
      }).compileComponents()

      fixture = TestBed.createComponent(MockComponent)
      component = fixture.componentInstance
    })

    it('should create', () => {
      expect(component).toBeTruthy()
    })

    it('should render 3 ocxContent cards with different title IDs', async () => {
      fixture.detectChanges()

      const ocxContents = fixture.debugElement.queryAll(By.directive(OcxContentDirective))
      expect(ocxContents.length).toEqual(3)

      ocxContents.forEach((_content, index) => {
        const idSuffix = index > 0 ? `${index - 1}` : ''
        expect(fixture.debugElement.queryAll(By.css(`#${titleBaseId + idSuffix}`)).length).toBe(1)
      })
    })
  })
})


```

### File: angular-accelerator/src/lib/components/content/content.component.stories.ts

```ts

import { OcxContentDirective } from '../../directives/content.directive';
import { OcxContentComponent } from './content.component';
import { moduleMetadata, Meta } from '@storybook/angular'

export default {
  title: 'Components/ContentComponent',
  component: OcxContentComponent,
  decorators: [
    moduleMetadata({
      declarations: [
        OcxContentDirective,
      ]
    }),
  ],
} as Meta<OcxContentComponent>

export const WithTitle = {
  render: (args: OcxContentComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-content title="${args.title}">
            <p>Content inside of ocx-content with title</p>
        </ocx-content>
    `,
  }),
  args: {
    title: 'My Title'
  },
}

export const MultipleWithUniqueIds = {
  render: (args: OcxContentComponent) => ({
    props: {
      ...args,
    },
    template: `
        <div ocxContent="${args.title}" class="mb-4">
            <p>Content inside of a div with the ocxContent directive applied to it.</p>
        </div>
        <div ocxContent="${args.title}" class="mb-4">
            <p>Content inside of a div with the ocxContent directive applied to it.</p>
        </div>
        <div ocxContent="${args.title}">
            <p>Content inside of a div with the ocxContent directive applied to it.</p>
        </div>
    `,
  }),
  args: {
    title: 'My Title'
  },
}

export const WithoutTitle = {
  render: (args: OcxContentComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-content>
            <p>Content inside of ocx-content without title</p>
        </ocx-content>
    `,
  }),
}

export const DirectiveOnly = {
  render: (args: OcxContentComponent) => ({
    props: {
      ...args,
    },
    template: `
        <div ocxContent="${args.title}">
            <p>Content inside of a div with the ocxContent directive applied to it.</p>
        </div>
    `,
  }),
  args: {
    title: 'My Title'
  },
}

export const WithCustomStyleClasses = {
  render: (args: OcxContentComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-content title="${args.title}" styleClass="${args.styleClass}">
            <p>Content inside of ocx-content with styleClass</p>
        </ocx-content>
    `,
  }),
  args: {
    title: 'My Title',
    styleClass: 'py-4 mt-2',
  },
}


```

### File: angular-accelerator/src/lib/components/content/content.component.ts

```ts

import { Component, Input } from '@angular/core'

@Component({
  standalone: false,
  selector: 'ocx-content',
  templateUrl: './content.component.html',
})
export class OcxContentComponent {
  /**
   * Optionally allows specifying a title for the content card
   */
  @Input() title = ''

  /**
   * Optionally allows specifying styles for the content card
   */
  @Input() styleClass: string | undefined
}


```

## Folder: angular-accelerator/src/lib/components/content-container (4 files)

### File: angular-accelerator/src/lib/components/content-container/content-container.component.html

```html

<div ocxContentContainer [layout]="layout" [breakpoint]="breakpoint" [ngClass]="styleClass">
    <ng-content></ng-content>
</div>

```

### File: angular-accelerator/src/lib/components/content-container/content-container.component.spec.ts

```ts

import { OcxContentContainerHarness } from '../../../../testing/content-container.harness'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OcxContentContainerComponent } from './content-container.component'
import { OcxContentContainerDirective } from '../../directives/content-container.directive'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { By } from '@angular/platform-browser'

describe('OcxContentContainerComponent', () => {
  let component: OcxContentContainerComponent
  let fixture: ComponentFixture<OcxContentContainerComponent>
  let ocxContentContainerHarness: OcxContentContainerHarness
  let directive: OcxContentContainerDirective

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OcxContentContainerComponent, OcxContentContainerDirective],
    }).compileComponents()

    fixture = TestBed.createComponent(OcxContentContainerComponent)
    component = fixture.componentInstance
    ocxContentContainerHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, OcxContentContainerHarness)
    const directiveElement = fixture.debugElement.query(By.directive(OcxContentContainerDirective))
    directive = directiveElement.injector.get(OcxContentContainerDirective)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render a horizontal layout container with md breakpoint by default', async () => {
    const expectedClasses = ['flex', 'gap-3', 'flex-column', 'md:flex-row']
    expect(await ocxContentContainerHarness.getLayoutClasses()).toEqual(expectedClasses)
    expect(await ocxContentContainerHarness.getLayout()).toEqual('horizontal')
    expect(await ocxContentContainerHarness.getBreakpoint()).toEqual('md')
  })

  it('should render a horizontal layout container while respecting a specified breakpoint', async () => {
    component.breakpoint = 'lg'

    const expectedClassesLG = ['flex', 'gap-3', 'flex-column', 'lg:flex-row']
    expect(await ocxContentContainerHarness.getLayoutClasses()).toEqual(expectedClassesLG)
    expect(await ocxContentContainerHarness.getLayout()).toEqual('horizontal')
    expect(await ocxContentContainerHarness.getBreakpoint()).toEqual('lg')
  })

  it('should render a vertical layout container if specified', async () => {
    component.layout = 'vertical'

    const expectedClasses = ['flex', 'gap-3', 'flex-column']
    expect(await ocxContentContainerHarness.getLayoutClasses()).toEqual(expectedClasses)
    expect(await ocxContentContainerHarness.getLayout()).toEqual('vertical')
    expect(await ocxContentContainerHarness.getBreakpoint()).toBeUndefined()
  })

  it('should render a container with specified style classes and remove conflicting classes', async () => {
    let expectedStyleClasses = ['flex', 'gap-3', 'flex-column', 'md:flex-row']
    expect(await ocxContentContainerHarness.getLayoutClasses()).toEqual(expectedStyleClasses)
    component.styleClass = 'py-4 flex-row gap-2'
    fixture.detectChanges()
    await fixture.whenStable()
    directive.ngOnChanges()
    expectedStyleClasses = ['flex', 'md:flex-row', 'py-4', 'flex-row', 'gap-2']
    expect((await ocxContentContainerHarness.getLayoutClasses()).sort()).toEqual(expectedStyleClasses.sort())
  })
})


```

### File: angular-accelerator/src/lib/components/content-container/content-container.component.stories.ts

```ts

import { OcxContentContainerDirective } from '../../directives/content-container.directive'
import { OcxContentDirective } from '../../directives/content.directive'
import { OcxContentComponent } from '../content/content.component'
import { OcxContentContainerComponent } from './content-container.component'
import { moduleMetadata, Meta } from '@storybook/angular'

export default {
  title: 'Components/ContentContainerComponent',
  component: OcxContentContainerComponent,
  argTypes: {
    layout: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' },
    },
    breakpoint: {
      options: ['sm', 'md', 'lg', 'xl'],
      control: { type: 'select' },
    }
  },
  decorators: [
    moduleMetadata({
      declarations: [OcxContentContainerDirective, OcxContentComponent, OcxContentDirective],
    }),
  ],
} as Meta<OcxContentContainerComponent>

export const Basic = {
  render: (args: OcxContentContainerComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-content-container layout="${args.layout}" breakpoint="${args.breakpoint}">
            <p>Content 1 nested in ocx-content-container</p>
            <p>Content 2 nested in ocx-content-container</p>
        </ocx-content-container>
    `,
  }),
  args: {
    layout: 'horizontal',
    breakpoint: 'md'
  },
}

export const WithNestedOCXContent = {
  render: (args: OcxContentContainerComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-content-container layout="${args.layout}" breakpoint="${args.breakpoint}">
            <ocx-content class="w-full sm:w-8">
              <p>Content inside of ocx-content without title</p>
            </ocx-content>
            <ocx-content title="My Title" class="w-full sm:w-4">
              <p>Content inside of ocx-content with title</p>
            </ocx-content>
        </ocx-content-container>
    `,
  }),
  args: {
    layout: 'horizontal',
    breakpoint: 'md'
  },
}

export const WithNestedOCXContentContainer = {
  render: (args: OcxContentContainerComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-content-container layout="${args.layout}" breakpoint="${args.breakpoint}">
          <ocx-content-container>
            <p>Horizontal content in nested ocx-content-container 1</p>
            <p>Horizontal content in nested ocx-content-container 1</p>
          </ocx-content-container>
          <ocx-content-container layout="vertical">
            <p>Vertical content in nested ocx-content-container 1</p>
            <p>Vertical content in nested ocx-content-container 1</p>
          </ocx-content-container>
        </ocx-content-container>
    `,
  }),
  args: {
    layout: 'horizontal',
    breakpoint: 'md'
  },
}

export const DirectiveOnly = {
  render: (args: OcxContentContainerComponent) => ({
    props: {
      ...args,
    },
    template: `
        <div ocxContentContainer layout="${args.layout}" breakpoint="${args.breakpoint}">
            <p>Content 1 nested inside of a div with the ocxContentContainer directive applied to it.</p>
            <p>Content 2 nested inside of a div with the ocxContentContainer directive applied to it.</p>
        </div>
    `,
  }),
  args: {
    layout: 'horizontal',
    breakpoint: 'md'
  },
}

export const WithCustomStyleClasses = {
  render: (args: OcxContentContainerComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-content-container styleClass="${args.styleClass}">
            <p>Content 1 inside of ocx-content-container with styleClass</p>
            <p>Content 2 inside of ocx-content-container with styleClass</p>
        </ocx-content-container>
    `,
  }),
  args: {
    styleClass: 'py-4 flex-row',
  },
}

```

### File: angular-accelerator/src/lib/components/content-container/content-container.component.ts

```ts

import { Component, Input } from '@angular/core'

@Component({
  standalone: false,
  selector: 'ocx-content-container',
  templateUrl: './content-container.component.html',
})
export class OcxContentContainerComponent {
  /**
   * Allows specifying the layout direction of the container
   */
  @Input() layout: 'vertical' | 'horizontal' = 'horizontal'

  /**
   * Allows specifying the breakpoint below which a horizontal layout switches to a vertical layout.
   * Only necessary if horizontal layout is used
   * Default: md
   */
  @Input() breakpoint: 'sm' | 'md' | 'lg' | 'xl' = 'md'

  /**
   * Optionally allows specifying styles for the container
   */
  @Input() styleClass: string | undefined
}


```

## Folder: angular-accelerator/src/lib/components/custom-group-column-selector (4 files)

### File: angular-accelerator/src/lib/components/custom-group-column-selector/custom-group-column-selector.component.html

```html

<p-button
  id="customGroupColumnSelectorButton"
  type="button"
  (onClick)="onOpenCustomGroupColumnSelectionDialogClick()"
  [pTooltip]="openButtonTitle || (openButtonTitleKey | translate) || ('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.OPEN_BUTTON_DETAIL' | translate)"
  tooltipPosition="top"
  icon="pi pi-cog"
  styleClass="p-button"
  [ariaLabel]="(openButtonAriaLabelKey ? (openButtonAriaLabelKey | translate) : openButtonAriaLabel) || openButtonTitle || ('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.OPEN_BUTTON_DETAIL' | translate)"
  [attr.aria-controls]="visible ? 'customGroupColumnSelectorDialog' : null"
  [attr.aria-expanded]="visible ? true : false"
></p-button>

<p-dialog
  #dialog
  id="customGroupColumnSelectorDialog"
  [(visible)]="visible"
  [style]="{ width: '70%' }"
  [modal]="true"
  [closeAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.CLOSE' | translate)"
>
  <ng-template pTemplate="header">
    <span [id]="dialog.ariaLabelledBy" class="text-xl font-bold"
      >{{ dialogTitle || (dialogTitleKey | translate) || ('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.DIALOG_TITLE' | translate)
      }}</span
    >
  </ng-template>

  <p-pickList
    [source]="displayedColumnsModel"
    [target]="hiddenColumnsModel"
    [sourceHeader]="activeColumnsLabel || (activeColumnsLabelKey | translate) || ('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ACTIVE_COLUMNS_LABEL' | translate)"
    [targetHeader]="inactiveColumnsLabel || (inactiveColumnsLabelKey | translate) || ('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.INACTIVE_COLUMNS_LABEL' | translate)"
    [dragdrop]="true"
    [responsive]="false"
    [sourceStyle]="{ height: '300px' }"
    [targetStyle]="{ height: '300px' }"
    [upButtonAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.UP' | translate)"
    [topButtonAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.TOP' | translate)"
    [downButtonAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.DOWN' | translate)"
    [bottomButtonAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.BOTTOM' | translate)"
    [rightButtonAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.RIGHT' | translate)"
    [allRightButtonAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.ALL_RIGHT' | translate)"
    [leftButtonAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.LEFT' | translate)"
    [allLeftButtonAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.ALL_LEFT' | translate)"
  >
    <ng-template let-item #item>
      <div>{{ item.nameKey | translate }}</div>
    </ng-template>
  </p-pickList>

  <div class="pt-4">
    <p class="text-xl font-bold">{{'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.TITLE' | translate}}</p>
    <div class="flex gap-6 px-3">
      <div>
        <p class="mb-1">{{'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.FREEZE' | translate}}</p>
        <p-selectbutton
          [options]="frozenOptions"
          [(ngModel)]="frozenActionColumnModel"
          optionLabel="label"
          optionValue="value"
          id="frozenActionColumn"
          name="frozen-action-column-select-button"
          [allowEmpty]="false"
        >
          <ng-template #item let-option> {{option.label | translate}} </ng-template>
        </p-selectbutton>
      </div>
      <div>
        <p class="mb-1">{{'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.POSITION' | translate}}</p>
        <p-selectbutton
          [options]="alignmentOptions"
          [(ngModel)]="actionColumnPositionModel"
          optionLabel="label"
          optionValue="value"
          id="actionColumnPosition"
          name="action-column-position-select-button"
          [allowEmpty]="false"
        >
          <ng-template #item let-option> {{option.label | translate}} </ng-template>
        </p-selectbutton>
      </div>
    </div>
  </div>

  <ng-template pTemplate="footer">
    <p-button
      id="cancelButton"
      (onClick)="onCancelClick()"
      [label]="cancelButtonLabel || (cancelButtonLabelKey | translate) || ('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CANCEL_BUTTON_LABEL' | translate)"
      styleClass="p-button"
      [ariaLabel]="cancelButtonLabel || ('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CANCEL_BUTTON_ARIA_LABEL' | translate)"
    ></p-button>
    <p-button
      id="saveButton"
      (onClick)="onSaveClick()"
      [label]="saveButtonLabel || (saveButtonLabelKey | translate) || ('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.SAVE_BUTTON_LABEL' | translate)"
      [ariaLabel]="saveButtonAriaLabelKey || (saveButtonAriaLabelKey | translate) || ('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.SAVE_BUTTON_ARIA_LABEL' | translate)"
    ></p-button>
  </ng-template>
</p-dialog>


```

### File: angular-accelerator/src/lib/components/custom-group-column-selector/custom-group-column-selector.component.spec.ts

```ts

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { CustomGroupColumnSelectorComponent } from './custom-group-column-selector.component'
import { CommonModule } from '@angular/common'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { FormsModule } from '@angular/forms'

describe('CustomGroupColumnSelectorComponent', () => {
  let component: CustomGroupColumnSelectorComponent
  let fixture: ComponentFixture<CustomGroupColumnSelectorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomGroupColumnSelectorComponent],
      imports: [
        CommonModule,
        TranslateTestingModule.withTranslations({}),
        AngularAcceleratorPrimeNgModule,
        FormsModule,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(CustomGroupColumnSelectorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})


```

### File: angular-accelerator/src/lib/components/custom-group-column-selector/custom-group-column-selector.component.stories.ts

```ts

import { Meta, moduleMetadata, applicationConfig, StoryFn } from '@storybook/angular'
import { TranslateModule } from '@ngx-translate/core'
import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { SelectModule } from 'primeng/select'
import { DialogModule } from 'primeng/dialog'
import { PickListModule } from 'primeng/picklist'
import { CheckboxModule } from 'primeng/checkbox'
import { SelectButtonModule } from 'primeng/selectbutton'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { ColumnType } from '../../model/column-type.model'
import { CustomGroupColumnSelectorComponent } from './custom-group-column-selector.component'
import { TooltipModule } from 'primeng/tooltip'

type CustomGroupColumnSelectorInputs = Pick<
  CustomGroupColumnSelectorComponent,
  | 'columns'
  | 'displayedColumns'
  | 'actionColumnPosition'
  | 'frozenActionColumn'
  | 'dialogTitle'
  | 'saveButtonLabel'
  | 'cancelButtonLabel'
  | 'activeColumnsLabel'
  | 'inactiveColumnsLabel'
>
const CustomGroupColumnSelectorComponentSBConfig: Meta<CustomGroupColumnSelectorComponent> = {
  title: 'Components/CustomGroupColumnSelectorComponent',
  component: CustomGroupColumnSelectorComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(TranslateModule.forRoot({})),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [CustomGroupColumnSelectorComponent],
      imports: [
        SelectModule,
        DialogModule,
        PickListModule,
        ButtonModule,
        CheckboxModule,
        FormsModule,
        SelectButtonModule,
        TooltipModule,
        StorybookTranslateModule,
      ],
    }),
  ],
}
const Template: StoryFn = (args) => ({
  props: args,
})

const defaultComponentArgs: CustomGroupColumnSelectorInputs = {
  columns: [
    {
      id: 'product',
      columnType: ColumnType.STRING,
      nameKey: 'Product',
      sortable: false,
    },
    {
      id: 'amount',
      columnType: ColumnType.NUMBER,
      nameKey: 'Amount',
      sortable: true,
    },
  ],
  displayedColumns: [
    {
      id: 'date',
      columnType: ColumnType.DATE,
      nameKey: 'Date',
      sortable: false,
    },
  ],
  frozenActionColumn: true,
  actionColumnPosition: 'right',
  dialogTitle: 'Column configurator',
  saveButtonLabel: 'Save',
  cancelButtonLabel: 'Cancel',
  activeColumnsLabel: 'Active',
  inactiveColumnsLabel: 'Inactive',
}

export const Default = {
  render: Template,
  args: {
    ...defaultComponentArgs,
  },
  argTypes: {
    actionColumnConfigChanged: { action: 'actionColumnConfigChanged' },
  },
}

export default CustomGroupColumnSelectorComponentSBConfig


```

### File: angular-accelerator/src/lib/components/custom-group-column-selector/custom-group-column-selector.component.ts

```ts

import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableColumn } from '../../model/data-table-column.model'

export type ColumnSelectionChangedEvent = { activeColumns: DataTableColumn[] }
export type ActionColumnChangedEvent = {
  frozenActionColumn: boolean
  actionColumnPosition: 'left' | 'right'
}

export interface CustomGroupColumnSelectorComponentState {
  actionColumnConfig?: {
    frozen: boolean
    position: 'left' | 'right'
  }
  displayedColumns?: DataTableColumn[]
  activeColumnGroupKey?: string
}

@Component({
  standalone: false,
  selector: 'ocx-custom-group-column-selector',
  templateUrl: './custom-group-column-selector.component.html',
  styleUrls: ['./custom-group-column-selector.component.scss'],
})
export class CustomGroupColumnSelectorComponent implements OnInit {
  private translate = inject(TranslateService)

  @Input() columns: DataTableColumn[] = []
  private _displayedColumns: DataTableColumn[] = []
  @Input()
  get displayedColumns() {
    return this._displayedColumns
  }
  set displayedColumns(value: DataTableColumn[]) {
    this._displayedColumns = value
    this.componentStateChanged.emit({
      actionColumnConfig: {
        frozen: this.frozenActionColumn,
        position: this.actionColumnPosition,
      },
      displayedColumns: this._displayedColumns,
    })
  }
  @Input() customGroupKey = ''
  @Input() dialogTitle = ''
  @Input() dialogTitleKey = ''
  @Input() openButtonTitle = ''
  @Input() openButtonTitleKey = ''
  @Input() openButtonAriaLabel = ''
  @Input() openButtonAriaLabelKey = ''
  @Input() saveButtonLabel = ''
  @Input() saveButtonLabelKey = ''
  @Input() saveButtonAriaLabel = ''
  @Input() saveButtonAriaLabelKey = ''
  @Input() cancelButtonLabel = ''
  @Input() cancelButtonLabelKey = ''
  @Input() cancelButtonAriaLabel = ''
  @Input() cancelButtonAriaLabelKey = ''
  @Input() activeColumnsLabel = ''
  @Input() activeColumnsLabelKey = ''
  @Input() inactiveColumnsLabel = ''
  @Input() inactiveColumnsLabelKey = ''
  @Input() frozenActionColumn = false
  @Input() actionColumnPosition: 'left' | 'right' = 'right'

  @Output() columnSelectionChanged: EventEmitter<ColumnSelectionChangedEvent> = new EventEmitter()
  @Output() actionColumnConfigChanged: EventEmitter<ActionColumnChangedEvent> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<CustomGroupColumnSelectorComponentState> = new EventEmitter()

  hiddenColumnsModel: DataTableColumn[] = []
  displayedColumnsModel: DataTableColumn[] = []
  frozenActionColumnModel = false
  actionColumnPositionModel: 'left' | 'right' = 'right'
  visible = false
  alignmentOptions = [
    {
      label: 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.LEFT',
      value: 'left',
    },
    {
      label: 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.RIGHT',
      value: 'right',
    },
  ]

  frozenOptions = [
    {
      label: 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.YES',
      value: true,
    },
    {
      label: 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.NO',
      value: false,
    },
  ]

  ngOnInit(): void {
    this.componentStateChanged.emit({
      actionColumnConfig: {
        frozen: this.frozenActionColumn,
        position: this.actionColumnPosition,
      },
      displayedColumns: this.displayedColumns,
    })
  }

  onOpenCustomGroupColumnSelectionDialogClick() {
    this.displayedColumnsModel = [...this.displayedColumns]
    this.hiddenColumnsModel = this.columns.filter(
      (column) => !this.displayedColumnsModel.map((c) => c.id).includes(column.id)
    )
    this.frozenActionColumnModel = this.frozenActionColumn
    this.actionColumnPositionModel = this.actionColumnPosition
    this.visible = true
  }

  onSaveClick() {
    this.visible = false
    const colIdsBefore = this.displayedColumns.map((column) => column.id)
    const colIdsAfter = this.displayedColumnsModel.map((column) => column.id)

    if (!colIdsAfter.every((colId, i) => colId === colIdsBefore[i]) || colIdsAfter.length != colIdsBefore.length) {
      this.columnSelectionChanged.emit({ activeColumns: [...this.displayedColumnsModel] })
      this.componentStateChanged.emit({
        displayedColumns: [...this.displayedColumnsModel],
      })
    }

    if (
      this.frozenActionColumn != this.frozenActionColumnModel ||
      this.actionColumnPosition != this.actionColumnPositionModel
    ) {
      this.actionColumnConfigChanged.emit({
        frozenActionColumn: this.frozenActionColumnModel,
        actionColumnPosition: this.actionColumnPositionModel,
      })
      this.componentStateChanged.emit({
        displayedColumns: [...this.displayedColumnsModel],
        actionColumnConfig: {
          frozen: this.frozenActionColumnModel,
          position: this.actionColumnPositionModel,
        },
        activeColumnGroupKey: this.customGroupKey,
      })
    }
  }

  onCancelClick() {
    this.visible = false
  }
}


```

## Folder: angular-accelerator/src/lib/components/data-layout-selection (3 files)

### File: angular-accelerator/src/lib/components/data-layout-selection/data-layout-selection.component.html

```html

<div class="flex flex-wrap justify-content-between align-items-center py-1 gap-2">
  @if (viewingLayouts.length > 1) {
    <p-selectbutton
      [options]="viewingLayouts"
      [(ngModel)]="selectedViewLayout"
      optionLabel="id"
      (onChange)="onDataViewLayoutChange($event.value)"
      >
      <ng-template #item let-item>
        <i [class]="item.icon" [pTooltip]="item.tooltipKey | translate" tooltipPosition="top"></i>
        <label style="display: none" id="{{item.id}}">{{item.labelKey | translate}}</label>
      </ng-template>
    </p-selectbutton>
  }
</div>


```

### File: angular-accelerator/src/lib/components/data-layout-selection/data-layout-selection.component.spec.ts

```ts

import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DataLayoutSelectionComponent } from './data-layout-selection.component'

describe('DataLayoutSelectionComponent', () => {
  let component: DataLayoutSelectionComponent
  let fixture: ComponentFixture<DataLayoutSelectionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataLayoutSelectionComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(DataLayoutSelectionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})


```

### File: angular-accelerator/src/lib/components/data-layout-selection/data-layout-selection.component.ts

```ts

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { PrimeIcons } from 'primeng/api'
import { PrimeIcon } from '../../utils/primeicon.utils'

interface ViewingLayouts {
  id: string
  icon: PrimeIcon
  layout: 'grid' | 'list' | 'table'
  tooltip?: string
  tooltipKey: string
  label?: string
  labelKey: string
}

const ALL_VIEW_LAYOUTS: ViewingLayouts[] = [
  {
    id: 'ocx-data-layout-selection-list',
    icon: PrimeIcons.LIST,
    layout: 'list',
    tooltipKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.LIST',
    labelKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.LIST',
  },
  {
    id: 'ocx-data-layout-selection-grid',
    icon: PrimeIcons.TH_LARGE,
    layout: 'grid',
    tooltipKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.GRID',
    labelKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.GRID',
  },
  {
    id: 'ocx-data-layout-selection-table',
    icon: PrimeIcons.TABLE,
    layout: 'table',
    tooltipKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.TABLE',
    labelKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.TABLE',
  },
]

export interface DataLayoutSelectionComponentState {
  layout?: 'grid' | 'list' | 'table'
}
@Component({
  standalone: false,
  selector: 'ocx-data-layout-selection',
  templateUrl: './data-layout-selection.component.html',
  styleUrls: ['./data-layout-selection.component.scss'],
})
export class DataLayoutSelectionComponent implements OnInit {
  @Input() supportedViewLayouts: Array<string> = []
  @Input()
  set layout(value: 'grid' | 'list' | 'table') {
    this.selectedViewLayout = ALL_VIEW_LAYOUTS.find((v) => v.layout === value)
  }
  get layout(): 'grid' | 'list' | 'table' {
    return this.selectedViewLayout?.layout || 'table'
  }

  @Output() dataViewLayoutChange: EventEmitter<'grid' | 'list' | 'table'> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<DataLayoutSelectionComponentState> = new EventEmitter()

  viewingLayouts: ViewingLayouts[] = []
  selectedViewLayout: ViewingLayouts | undefined

  ngOnInit(): void {
    this.viewingLayouts = ALL_VIEW_LAYOUTS.filter((vl) => this.supportedViewLayouts.includes(vl.layout))
    this.componentStateChanged.emit({
      layout: this.layout,
    })
  }

  onDataViewLayoutChange(event: { icon: PrimeIcon; layout: 'grid' | 'list' | 'table' }): void {
    this.dataViewLayoutChange.emit(event.layout)
    this.componentStateChanged.emit({
      layout: event.layout,
    })
  }
}


```

## Folder: angular-accelerator/src/lib/components/data-list-grid (4 files)

### File: angular-accelerator/src/lib/components/data-list-grid/data-list-grid.component.html

```html

@if ((displayedPageSize$ | async); as displayedPageSize) { @if ((columnTemplates$ | async) ?? {}; as columnTemplates) {
<p-dataView
  [value]="(displayedItems$ | async) ?? []"
  [paginator]="paginator"
  [first]="page * displayedPageSize"
  (onPage)="onPageChange($event)"
  [rows]="displayedPageSize"
  [layout]="layout"
  [showCurrentPageReport]="true"
  currentPageReportTemplate="{{ (totalRecordsOnServer ? currentPageShowingWithTotalOnServerKey : currentPageShowingKey) | translate:params }}"
  [rowsPerPageOptions]="this.pageSizes ?? []"
  id="dataListGrid_{{name}}"
  paginatorDropdownAppendTo="body"
>
  <ng-template #grid let-rows>
    <div class="grid grid-cols-12 gap-4">
      @for (item of rows; track item) {
      <ng-container
        [ngTemplateOutlet]="_gridItem ? _gridItem : defaultGridItem"
        [ngTemplateOutletContext]="{$implicit:item}"
      ></ng-container>
      }
    </div>
  </ng-template>
  <ng-template #list let-rows>
    <div class="p-grid p-nogutter grid grid-nogutter">
      @for (item of rows; track item; let first = $first) { @defer (on viewport; on idle){
      <ng-container
        [ngTemplateOutlet]="_listItem ? _listItem : defaultListItem"
        [ngTemplateOutletContext]="{
              $implicit: item,
              item:item,
              first:first,
              columnTemplates: columnTemplates
              }"
      ></ng-container>
      } @placeholder {
      <div style="width: 100%; height: 80px"></div>
      } }
    </div>
  </ng-template>
  <ng-template pTemplate="empty">
    <span>{{ emptyResultsMessage || ("OCX_DATA_LIST_GRID.EMPTY_RESULT" | translate) }}</span>
  </ng-template>
</p-dataView>
} }

<ng-template #defaultGridItem let-item>
  <div class="col-12 lg:col-6 xl:col-4 p-1 flex justify-content-center grid-border-divider">
    <div class="data-grid-item card flex flex-column justify-content-between w-12 lg:w-11 mb-4 mt-4 align-self-stretch">
      <div class="flex justify-content-center mb-3">
        <img
          class="image"
          src="{{ item.imagePath || (fallbackImagePath$ | async) }}"
          (error)="imgError(item)"
          alt="{{resolveFieldData(item, titleLineId)|| ''}}"
        />
      </div>
      <div class="flex flex-row justify-content-between align-items-center">
        <div class="data-grid-items flex-row">
          <div class="item-name font-medium mr-3 text-2xl">
            <ng-container *ngIf="hasViewPermission$ | async as hasViewPermission; else noViewPermission">
              <a [routerLink]="" (click)="onViewRow(item)">{{ resolveFieldData(item, titleLineId) || '' }}</a>
            </ng-container>
            <ng-template #noViewPermission>
              <a [routerLink]="">{{ resolveFieldData(item, titleLineId) || '' }}</a>
            </ng-template>
          </div>
          <ng-container
            [ngTemplateOutlet]="_gridItemSubtitleLines ? _gridItemSubtitleLines : defaultGridItemSubtitleLines"
            [ngTemplateOutletContext]="{$implicit:item}"
          ></ng-container>
        </div>
        <div *ngIf="(gridMenuItems$ | async) as gridMenuItems">
          <p-menu #menu [model]="gridMenuItems" [popup]="true" appendTo="body"></p-menu>
          <button
            pButton
            (click)="setSelectedItem(item); menu.toggle($event)"
            icon="pi pi-ellipsis-v"
            [attr.aria-label]="'OCX_DATA_LIST_GRID.MORE_ACTIONS_ARIA_LABEL' | translate"
            class="more-actions-menu-button menu-btn"
            [attr.name]="'data-grid-item-menu-button'"
            [pTooltip]="'OCX_DATA_LIST_GRID.MORE_ACTIONS_TOOLTIP' | translate"
            tooltipPosition="top"
          ></button>
        </div>
      </div>
    </div>
  </div>
</ng-template>
<ng-template #defaultGridItemSubtitleLines let-item>
  @for (subtitleLineId of subtitleLineIds; track subtitleLineId) {
  <div class="subtitleLine edit-time text-xl my-3">{{ resolveFieldData(item, subtitleLineId) }}</div>
  }
</ng-template>
<ng-template #defaultListItem let-item="item" let-first="first" let-columnTemplates="columnTemplates">
  @if (columnTemplates) {
  <div class="col-12">
    <div class="data-list-items p-1" [ngClass]="{ 'list-border-divider': !first }">
      <div class="item-name-row flex flex-row justify-content-between">
        <div class="item-name mr-3 text-2xl font-medium align-content-center">
          @if (titleLineId) {
          <span>{{ resolveFieldData(item, titleLineId) || '' }}</span>
          }
        </div>
        <div class="flex flex-row">
          @if (viewItemObserved && (!viewActionVisibleField || fieldIsTruthy(item, viewActionVisibleField))) {
          <button
            id="{{resolveFieldData(item, 'id')}}-viewButton"
            type="button"
            icon="pi pi-eye"
            pButton
            class="p-button-rounded p-button-text mb-1 mr-2 viewListItemButton"
            [pTooltip]="(viewMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.VIEW') | translate"
            tooltipPosition="top"
            [tooltipOptions]="{
              disabled: !!viewActionEnabledField && !fieldIsTruthy(item, viewActionEnabledField)
            }"
            [attr.aria-label]="(viewMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.VIEW') | translate"
            (click)="onViewRow(item)"
            *ocxIfPermission="viewPermission"
            [disabled]="!!viewActionEnabledField && !fieldIsTruthy(item, viewActionEnabledField)"
            [attr.name]="'data-list-action-button'"
          ></button>
          } @if (editItemObserved && (!editActionVisibleField || fieldIsTruthy(item, editActionVisibleField))) {
          <button
            id="{{resolveFieldData(item, 'id')}}-editButton"
            type="button"
            class="p-button-rounded p-button-text mb-1 mr-2 editListItemButton"
            icon="pi pi-pencil"
            pButton
            [pTooltip]="(editMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.EDIT') | translate"
            tooltipPosition="top"
            [tooltipOptions]="{
              disabled: !!editActionEnabledField && !fieldIsTruthy(item, editActionEnabledField)
            }"
            [attr.aria-label]="(editMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.EDIT') | translate"
            (click)="onEditRow(item)"
            *ocxIfPermission="editPermission"
            [disabled]="!!editActionEnabledField && !fieldIsTruthy(item, editActionEnabledField)"
            [attr.name]="'data-list-action-button'"
          ></button>
          } @if (deleteItemObserved && (!deleteActionVisibleField || fieldIsTruthy(item, deleteActionVisibleField))) {
          <button
            id="{{resolveFieldData(item, 'id')}}-deleteButton"
            type="button"
            icon="pi pi-trash"
            class="p-button-rounded p-button-text p-button-danger mb-1 mr-2 deleteListItemButton"
            pButton
            [pTooltip]="(deleteMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.DELETE') | translate"
            tooltipPosition="top"
            [tooltipOptions]="{
              disabled: !!deleteActionEnabledField && !fieldIsTruthy(item, deleteActionEnabledField)
            }"
            [attr.aria-label]="(deleteMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.DELETE') | translate"
            (click)="onDeleteRow(item)"
            *ocxIfPermission="deletePermission"
            [disabled]="!!deleteActionEnabledField && !fieldIsTruthy(item, deleteActionEnabledField)"
            [attr.name]="'data-list-action-button'"
          ></button>
          } @for (action of inlineListActions$ | async; track action) { @if ((!action.actionVisibleField ||
          fieldIsTruthy(item, action.actionVisibleField))) {
          <button
            id="{{resolveFieldData(item, 'id')}}-{{action.id ? action.id.concat('ActionButton') : 'inlineActionButton'}}"
            *ocxIfPermission="action.permission"
            pButton
            class="p-button-rounded p-button-text"
            [ngClass]="action.classes"
            [icon]="action.icon || ''"
            (click)="action.callback(item)"
            [pTooltip]="action.labelKey ? (action.labelKey | translate) : ''"
            tooltipPosition="top"
            [tooltipOptions]="{
              disabled: action.disabled || (!!action.actionEnabledField && !fieldIsTruthy(item, action.actionEnabledField))
            }"
            [attr.aria-label]="action.labelKey ? (action.labelKey | translate) : ''"
            [disabled]="action.disabled || (!!action.actionEnabledField && !fieldIsTruthy(item, action.actionEnabledField))"
            [attr.name]="'data-list-action-button'"
          ></button>
          } } @if (hasVisibleOverflowMenuItems(item) | async) {
          <p-menu #menu [model]="(overflowListMenuItems$ | async) || []" [popup]="true" appendTo="body"></p-menu>
          <button
            pButton
            class="p-button-rounded p-button-text"
            [icon]="'pi pi-ellipsis-v'"
            (click)="toggleOverflowMenu($event, menu, item)"
            [attr.aria-label]="'OCX_DATA_LIST_GRID.MORE_ACTIONS_ARIA_LABEL' | translate"
            [pTooltip]="'OCX_DATA_LIST_GRID.MORE_ACTIONS_TOOLTIP' | translate"
            tooltipPosition="top"
            [attr.name]="'data-list-overflow-item-menu-button'"
          ></button>
          }
        </div>
      </div>
      <div class="text-base font-light my-1">
        <ng-container
          [ngTemplateOutlet]="_listItemSubtitleLines ? _listItemSubtitleLines : defaultListItemSubtitleLines"
          [ngTemplateOutletContext]="{$implicit:item}"
        ></ng-container>
      </div>
      <div class="flex flex-wrap">
        @for (col of getFilteredColumns(); track col) {
        <div class="w-12rem my-2 mr-2">
          <div class="font-bold" [ocxTooltipOnOverflow]="col.nameKey | translate" tooltipPosition="top">
            {{ col.nameKey | translate }}
          </div>
          <div
            [ocxTooltipOnOverflow]="col.columnType === columnType.TRANSLATION_KEY ? (resolveFieldData(item,col.id) | translate) : resolveFieldData(item, col.id)"
            tooltipPosition="top"
          >
            @defer(on viewport;){
            <ng-container
              [ngTemplateOutlet]="_listValue ? _listValue: defaultListValue"
              [ngTemplateOutletContext]="{
                rowObject: item,
                column: col,
                columnTemplates: columnTemplates
                }"
            >
            </ng-container>
            } @placeholder {
            <p-skeleton width="5rem" />
            }
          </div>
        </div>
        }
      </div>
    </div>
  </div>
  }
</ng-template>
<ng-template #defaultListItemSubtitleLines let-item="$implicit">
  @for (subtitleLineId of subtitleLineIds; track subtitleLineId) {
  <div class="subtitleLine text-xl my-3">{{ resolveFieldData(item, subtitleLineId) }}</div>
  }
</ng-template>

<ng-template #defaultListValue let-rowObject="rowObject" let-column="column" let-columnTemplates="columnTemplates">
  @if (columnTemplates[column.id]) {
  <ng-container
    [ngTemplateOutlet]="columnTemplates[column.id]"
    [ngTemplateOutletContext]="{
                rowObject: rowObject,
                column: column
            }"
  >
  </ng-container>
  }
</ng-template>

<ng-template pTemplate="defaultStringListValue" let-rowObject="rowObject" let-column="column">
  <ng-container> {{ resolveFieldData(rowObject, column.id) }} </ng-container>
</ng-template>

<ng-template pTemplate="defaultNumberListValue" let-rowObject="rowObject" let-column="column">
  <ng-container> {{ resolveFieldData(rowObject, column.id) | number }} </ng-container>
</ng-template>

<ng-template pTemplate="defaultDateListValue" let-rowObject="rowObject" let-column="column">
  <ng-container> {{ resolveFieldData(rowObject, column.id) | date: column.dateFormat ?? 'medium' }} </ng-container>
</ng-template>

<ng-template pTemplate="defaultRelativeDateListValue" let-rowObject="rowObject" let-column="column">
  <ng-container>
    {{ 'OCX_DATA_TABLE.EDITED' | translate }} {{ resolveFieldData(rowObject, column.id) | timeago }}
  </ng-container>
</ng-template>

<ng-template pTemplate="defaultTranslationKeyListValue" let-rowObject="rowObject" let-column="column">
  <ng-container> {{ resolveFieldData(rowObject, column.id) | translate }} </ng-container>
</ng-template>


```

### File: angular-accelerator/src/lib/components/data-list-grid/data-list-grid.component.spec.ts

```ts

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import {
  provideAppStateServiceMock,
  provideUserServiceMock,
  UserServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { TooltipStyle } from 'primeng/tooltip'
import { DataListGridHarness } from '../../../../testing/data-list-grid.harness'
import { DataTableHarness } from '../../../../testing/data-table.harness'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { ColumnType } from '../../model/column-type.model'
import { DataListGridComponent } from './data-list-grid.component'
import { ensureIntersectionObserverMockExists, ensureOriginMockExists } from '@onecx/angular-testing'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { UserService } from '@onecx/angular-integration-interface'

ensureOriginMockExists()
ensureIntersectionObserverMockExists()

describe('DataListGridComponent', () => {
  const mutationObserverMock = jest.fn(function MutationObserver(callback) {
    this.observe = jest.fn()
    this.disconnect = jest.fn()
    this.trigger = (mockedMutationsList: any) => {
      callback(mockedMutationsList, this)
    }
    return this
  })
  global.MutationObserver = mutationObserverMock

  let fixture: ComponentFixture<DataListGridComponent>
  let component: DataListGridComponent
  let translateService: TranslateService
  let listGrid: DataListGridHarness

  const ENGLISH_LANGUAGE = 'en'
  const ENGLISH_TRANSLATIONS = {
    OCX_DATA_TABLE: {
      SHOWING: '{{first}} - {{last}} of {{totalRecords}}',
      SHOWING_WITH_TOTAL_ON_SERVER: '{{first}} - {{last}} of {{totalRecords}} ({{totalRecordsOnServer}})',
    },
  }

  const GERMAN_LANGUAGE = 'de'
  const GERMAN_TRANSLATIONS = {
    OCX_DATA_TABLE: {
      SHOWING: '{{first}} - {{last}} von {{totalRecords}}',
      SHOWING_WITH_TOTAL_ON_SERVER: '{{first}} - {{last}} von {{totalRecords}} ({{totalRecordsOnServer}})',
    },
  }

  const TRANSLATIONS = {
    [ENGLISH_LANGUAGE]: ENGLISH_TRANSLATIONS,
    [GERMAN_LANGUAGE]: GERMAN_TRANSLATIONS,
  }

  const mockData = [
    {
      version: 0,
      creationDate: '2023-09-12T09:34:11.997048Z',
      creationUser: 'creation user',
      modificationDate: '2023-09-12T09:34:11.997048Z',
      modificationUser: '',
      id: '195ee34e-41c6-47b7-8fc4-3f245dee7651',
      name: 'some name',
      description: '',
      status: 'some status',
      responsible: 'someone responsible',
      endDate: '2023-09-14T09:34:09Z',
      startDate: '2023-09-13T09:34:05Z',
      imagePath: '/path/to/image',
      testNumber: '1',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:33:58.544494Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:33:58.544494Z',
      modificationUser: '',
      id: '5f8bb05b-d089-485e-a234-0bb6ff25234e',
      name: 'example',
      description: 'example description',
      status: 'status example',
      responsible: '',
      endDate: '2023-09-13T09:33:55Z',
      startDate: '2023-09-12T09:33:53Z',
      imagePath: '',
      testNumber: '3.141',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 1',
      description: '',
      status: 'status name 1',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '123456789',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: '734e21ba-14d7-4565-ba0d-ddd25f807931',
      name: 'name 2',
      description: '',
      status: 'status name 2',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '12345.6789',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: '02220a5a-b556-4d7a-ac6e-6416911a00f2',
      name: 'name 3',
      description: '',
      status: 'status name 3',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '7.1',
    },
  ]
  const mockColumns = [
    {
      columnType: ColumnType.STRING,
      id: 'name',
      nameKey: 'COLUMN_HEADER_NAME.NAME',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'description',
      nameKey: 'COLUMN_HEADER_NAME.DESCRIPTION',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'startDate',
      nameKey: 'COLUMN_HEADER_NAME.START_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'endDate',
      nameKey: 'COLUMN_HEADER_NAME.END_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.TRANSLATION_KEY,
      id: 'status',
      nameKey: 'COLUMN_HEADER_NAME.STATUS',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'responsible',
      nameKey: 'COLUMN_HEADER_NAME.RESPONSIBLE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.RELATIVE_DATE,
      id: 'modificationDate',
      nameKey: 'COLUMN_HEADER_NAME.MODIFICATION_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'creationUser',
      nameKey: 'COLUMN_HEADER_NAME.CREATION_USER',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.NUMBER,
      id: 'testNumber',
      nameKey: 'COLUMN_HEADER_NAME.TEST_NUMBER',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
  ]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataListGridComponent],
      imports: [
        AngularAcceleratorPrimeNgModule,
        TranslateModule.forRoot(),
        TranslateTestingModule.withTranslations(TRANSLATIONS),
        AngularAcceleratorModule,
        RouterModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        provideUserServiceMock(),
        provideAppStateServiceMock(),
        TooltipStyle,
        {
          provide: HAS_PERMISSION_CHECKER,
          useExisting: UserService,
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DataListGridComponent)
    component = fixture.componentInstance
    component.data = mockData
    component.columns = mockColumns
    component.paginator = true
    translateService = TestBed.inject(TranslateService)
    translateService.use('en')
    const userServiceMock = TestBed.inject(UserServiceMock)
    userServiceMock.permissionsTopic$.publish(['VIEW', 'EDIT', 'DELETE'])
    fixture.detectChanges()
    listGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
  })

  it('should create the data list grid component', () => {
    expect(component).toBeTruthy()
  })

  it('loads dataListGrid', async () => {
    const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
    expect(dataListGrid).toBeTruthy()
  })

  describe('should display the paginator currentPageReport -', () => {
    it('de', async () => {
      translateService.use('de')
      const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
      const paginator = await dataListGrid.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 von 5')
    })

    it('en', async () => {
      translateService.use('en')
      const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
      const paginator = await dataListGrid.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 of 5')
    })
  })

  describe('should display the paginator currentPageReport  with totalRecordsOnServer -', () => {
    it('de', async () => {
      component.totalRecordsOnServer = 10
      translateService.use('de')
      const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
      const paginator = await dataListGrid.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 von 5 (10)')
    })

    it('en', async () => {
      component.totalRecordsOnServer = 10
      translateService.use('en')
      const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
      const paginator = await dataListGrid.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 of 5 (10)')
    })
  })

  it('should display the paginator rowsPerPageOptions', async () => {
    const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
    const paginator = await dataListGrid.getPaginator()
    const rowsPerPageOptions = await paginator.getRowsPerPageOptions()
    const rowsPerPageOptionsText = await rowsPerPageOptions.selectedSelectItemText(0)
    expect(rowsPerPageOptionsText).toEqual('10')
  })

  const setUpListActionButtonMockData = async () => {
    component.columns = [
      ...mockColumns,
      {
        columnType: ColumnType.STRING,
        id: 'ready',
        nameKey: 'Ready',
      },
    ]

    component.data = [
      {
        version: 0,
        creationDate: '2023-09-12T09:34:27.184086Z',
        creationUser: '',
        modificationDate: '2023-09-12T09:34:27.184086Z',
        modificationUser: '',
        id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
        name: 'name 3',
        description: '',
        status: 'status name 3',
        responsible: '',
        endDate: '2023-09-15T09:34:24Z',
        startDate: '2023-09-14T09:34:22Z',
        imagePath: '',
        testNumber: '7.1',
        ready: false,
      },
    ]
    component.viewItem.subscribe(() => console.log())
    component.editItem.subscribe(() => console.log())
    component.deleteItem.subscribe(() => console.log())
    component.viewPermission = 'VIEW'
    component.editPermission = 'EDIT'
    component.deletePermission = 'DELETE'

    fixture.autoDetectChanges()
    await fixture.whenStable()
  }
  describe('Disable list action buttons based on field path', () => {
    it('should not disable any list action button by default', async () => {
      component.layout = 'list'

      expect(component.viewItemObserved).toBe(false)
      expect(component.editItemObserved).toBe(false)
      expect(component.deleteItemObserved).toBe(false)

      await setUpListActionButtonMockData()

      expect(component.viewItemObserved).toBe(true)
      expect(component.editItemObserved).toBe(true)
      expect(component.deleteItemObserved).toBe(true)

      const listActions = await listGrid.getActionButtons('list')
      expect(listActions.length).toBe(3)
      const expectedIcons = ['pi pi-eye', 'pi pi-trash', 'pi pi-pencil']

      for (const action of listActions) {
        expect(await listGrid.actionButtonIsDisabled(action, 'list')).toBe(false)
        const icon = await action.getAttribute('icon')
        if (icon) {
          const index = expectedIcons.indexOf(icon)
          expect(index).toBeGreaterThanOrEqual(0)
          expectedIcons.splice(index, 1)
        }
      }

      expect(expectedIcons.length).toBe(0)
    })

    it('should dynamically enable/disable an action button based on the contents of a specified field', async () => {
      component.layout = 'list'
      await setUpListActionButtonMockData()
      component.viewActionEnabledField = 'ready'

      let listActions = await listGrid.getActionButtons('list')
      expect(listActions.length).toBe(3)

      for (const action of listActions) {
        const icon = await action.getAttribute('icon')
        const isDisabled = await listGrid.actionButtonIsDisabled(action, 'list')
        if (icon === 'pi pi-eye') {
          expect(isDisabled).toBe(true)
        } else {
          expect(isDisabled).toBe(false)
        }
      }

      const tempData = [...component.data]

      tempData[0]['ready'] = true

      component.data = [...tempData]

      listActions = await listGrid.getActionButtons('list')

      for (const action of listActions) {
        expect(await listGrid.actionButtonIsDisabled(action, 'list')).toBe(false)
      }
    })
  })

  describe('Hide list action buttons based on field path', () => {
    it('should not hide any list action button by default', async () => {
      component.layout = 'list'

      expect(component.viewItemObserved).toBe(false)
      expect(component.editItemObserved).toBe(false)
      expect(component.deleteItemObserved).toBe(false)

      await setUpListActionButtonMockData()

      expect(component.viewItemObserved).toBe(true)
      expect(component.editItemObserved).toBe(true)
      expect(component.deleteItemObserved).toBe(true)

      const listActions = await listGrid.getActionButtons('list')
      expect(listActions.length).toBe(3)
      const expectedIcons = ['pi pi-eye', 'pi pi-trash', 'pi pi-pencil']

      for (const action of listActions) {
        const icon = await action.getAttribute('icon')
        if (icon) {
          const index = expectedIcons.indexOf(icon)
          expect(index).toBeGreaterThanOrEqual(0)
          expectedIcons.splice(index, 1)
        }
      }

      expect(expectedIcons.length).toBe(0)
    })

    it('should dynamically hide/show an action button based on the contents of a specified field', async () => {
      component.layout = 'list'
      await setUpListActionButtonMockData()
      component.viewActionVisibleField = 'ready'

      let listActions = await listGrid.getActionButtons('list')
      expect(listActions.length).toBe(2)

      for (const action of listActions) {
        const icon = await action.getAttribute('icon')
        expect(icon === 'pi pi-eye').toBe(false)
      }

      const tempData = [...component.data]

      tempData[0]['ready'] = true

      component.data = [...tempData]

      listActions = await listGrid.getActionButtons('list')

      expect(listActions.length).toBe(3)
    })
  })
  describe('Assign ids to list action buttons', () => {
    beforeEach(() => {
      component.layout = 'list'

      component.data = [
        {
          version: 0,
          creationDate: '2023-09-12T09:34:27.184086Z',
          creationUser: '',
          modificationDate: '2023-09-12T09:34:27.184086Z',
          modificationUser: '',
          id: 'rowId',
          name: 'name 3',
          description: '',
          status: 'status name 3',
          responsible: '',
          endDate: '2023-09-15T09:34:24Z',
          startDate: '2023-09-14T09:34:22Z',
          imagePath: '',
          testNumber: '7.1',
          ready: false,
        },
      ]
    })

    it('should assign id to view button', async () => {
      component.viewItem.subscribe(() => console.log())
      component.viewPermission = 'VIEW'

      fixture.autoDetectChanges()
      await fixture.whenStable()

      expect(component.viewItemObserved).toBe(true)

      const tableActions = await listGrid.getActionButtons('list')
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-viewButton')
    })

    it('should assign id to edit button', async () => {
      component.editItem.subscribe(() => console.log())
      component.editPermission = 'EDIT'

      fixture.autoDetectChanges()
      await fixture.whenStable()

      expect(component.editItemObserved).toBe(true)

      const tableActions = await listGrid.getActionButtons('list')
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-editButton')
    })

    it('should assign id to delete button', async () => {
      component.deleteItem.subscribe(() => console.log())
      component.deletePermission = 'DELETE'

      fixture.autoDetectChanges()
      await fixture.whenStable()

      expect(component.deleteItemObserved).toBe(true)

      const tableActions = await listGrid.getActionButtons('list')
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-deleteButton')
    })

    it('should assign id to additional action button', async () => {
      component.additionalActions = [
        {
          permission: 'VIEW',
          callback: () => {
            console.log('custom action clicked')
          },
          id: 'actionId',
        },
      ]

      fixture.autoDetectChanges()
      await fixture.whenStable()

      const tableActions = await listGrid.getActionButtons('list')
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-actionIdActionButton')
    })
  })

  const setUpGridActionButtonMockData = async () => {
    component.columns = [
      ...mockColumns,
      {
        columnType: ColumnType.STRING,
        id: 'ready',
        nameKey: 'Ready',
      },
    ]
    component.data = [
      {
        id: 'Test',
        imagePath:
          'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        property1: 'Card 1',
        ready: false,
      },
    ]
    component.titleLineId = 'property1'
    component.viewItem.subscribe(() => console.log())
    component.editItem.subscribe(() => console.log())
    component.deleteItem.subscribe(() => console.log())
    component.viewPermission = 'VIEW'
    component.editPermission = 'EDIT'
    component.deletePermission = 'DELETE'

    fixture.detectChanges()
    await fixture.whenStable()
  }
  describe('Disable grid action buttons based on field path', () => {
    it('should not disable any grid action button by default', async () => {
      component.layout = 'grid'
      expect(component.viewItemObserved).toBe(false)
      expect(component.editItemObserved).toBe(false)
      expect(component.deleteItemObserved).toBe(false)

      await setUpGridActionButtonMockData()

      expect(component.viewItemObserved).toBe(true)
      expect(component.editItemObserved).toBe(true)
      expect(component.deleteItemObserved).toBe(true)

      const gridMenuButton = await listGrid.getMenuButton()

      await gridMenuButton.click()

      const gridActions = await listGrid.getActionButtons('grid')
      expect(gridActions.length).toBe(3)

      for (const action of gridActions) {
        expect(await listGrid.actionButtonIsDisabled(action, 'grid')).toBe(false)
      }
    })

    it('should dynamically enable/disable an action button based on the contents of a specified field', async () => {
      component.layout = 'grid'
      await setUpGridActionButtonMockData()
      component.viewActionEnabledField = 'ready'
      const gridMenuButton = await listGrid.getMenuButton()

      await gridMenuButton.click()

      let gridActions = await listGrid.getActionButtons('grid')
      expect(gridActions.length).toBe(3)

      for (const action of gridActions) {
        const isDisabled = await listGrid.actionButtonIsDisabled(action, 'grid')
        const text = await action.text()
        if (gridActions.indexOf(action) === 0) {
          expect(text).toBe('OCX_DATA_LIST_GRID.MENU.VIEW')
          expect(isDisabled).toBe(true)
        } else {
          expect(text === 'OCX_DATA_LIST_GRID.MENU.VIEW').toBe(false)
          expect(isDisabled).toBe(false)
        }
      }

      const tempData = [...component.data]

      tempData[0]['ready'] = true

      component.data = [...tempData]

      await gridMenuButton.click()
      await gridMenuButton.click()

      gridActions = await listGrid.getActionButtons('grid')

      for (const action of gridActions) {
        expect(await listGrid.actionButtonIsDisabled(action, 'grid')).toBe(false)
      }
    })
  })

  describe('Hide grid action buttons based on field path', () => {
    it('should not hide any grid action button by default', async () => {
      component.layout = 'grid'
      expect(component.viewItemObserved).toBe(false)
      expect(component.editItemObserved).toBe(false)
      expect(component.deleteItemObserved).toBe(false)

      await setUpGridActionButtonMockData()

      expect(component.viewItemObserved).toBe(true)
      expect(component.editItemObserved).toBe(true)
      expect(component.deleteItemObserved).toBe(true)

      const gridMenuButton = await listGrid.getMenuButton()

      await gridMenuButton.click()

      const gridActions = await listGrid.getActionButtons('grid')
      expect(gridActions.length).toBe(3)
    })

    it('should dynamically hide/show an action button based on the contents of a specified field', async () => {
      component.layout = 'grid'
      await setUpGridActionButtonMockData()
      const gridMenuButton = await listGrid.getMenuButton()

      await gridMenuButton.click()

      let gridActions = await listGrid.getActionButtons('grid')
      expect(gridActions.length).toBe(3)
      await gridMenuButton.click()

      component.viewActionVisibleField = 'ready'

      await gridMenuButton.click()
      gridActions = await listGrid.getActionButtons('grid')
      expect(gridActions.length).toBe(2)

      for (const action of gridActions) {
        const text = await action.text()
        expect(text === 'OCX_DATA_LIST_GRID.MENU.VIEW').toBe(false)
      }

      const tempData = [...component.data]

      tempData[0]['ready'] = true

      component.data = [...tempData]

      await gridMenuButton.click()
      await gridMenuButton.click()
      gridActions = await listGrid.getActionButtons('grid')
      expect(gridActions.length).toBe(3)
    })
  })

  describe('permissions for action buttons', () => {
    let userService: UserServiceMock

    beforeEach(() => {
      component.data = [
        {
          version: 0,
          creationDate: '2023-09-12T09:34:11.997048Z',
          creationUser: 'creation user',
          modificationDate: '2023-09-12T09:34:11.997048Z',
          modificationUser: '',
          id: 'id1',
          name: 'name1',
          description: 'desc1',
          status: 'status1',
          responsible: 'responsible1',
          endDate: '2023-09-14T09:34:09Z',
          startDate: '2023-09-13T09:34:05Z',
          imagePath: '/path/to/image1',
          testNumber: '1',
        },
      ]

      component.viewItem.subscribe(() => console.log('view item'))
      component.editItem.subscribe(() => console.log('edit item'))
      component.deleteItem.subscribe(() => console.log('delete item'))

      userService = TestBed.inject(UserService) as unknown as UserServiceMock
    })

    describe('list layout', () => {
      beforeEach(() => {
        component.layout = 'list'
        component.viewPermission = 'LIST#VIEW'
        component.editPermission = 'LIST#EDIT'
        component.deletePermission = 'LIST#DELETE'
        component.additionalActions = []
      })

      it('should show view, delete and edit action buttons when user has VIEW, EDIT and DELETE permissions', async () => {
        userService.permissionsTopic$.publish(['LIST#VIEW', 'LIST#EDIT', 'LIST#DELETE'])

        fixture.detectChanges()
        await fixture.whenStable()

        let listActions = await listGrid.getActionButtons('list')
        expect(listActions.length).toBe(3)

        expect(await listActions[0].getAttribute('icon')).toEqual('pi pi-eye')
        expect(await listActions[1].getAttribute('icon')).toEqual('pi pi-pencil')
        expect(await listActions[2].getAttribute('icon')).toEqual('pi pi-trash')

        userService.permissionsTopic$.publish([])

        listActions = await listGrid.getActionButtons('list')
        expect(listActions.length).toBe(0)
      })

      it('should show custom inline actions if user has the required permission', async () => {
        userService.permissionsTopic$.publish(['CUSTOM#ACTION'])

        component.additionalActions = [
          {
            permission: 'CUSTOM#ACTION',
            callback: () => {
              console.log('custom action clicked')
            },
            id: 'customAction',
            icon: 'pi pi-check',
            showAsOverflow: false,
          },
        ]

        fixture.detectChanges()
        await fixture.whenStable()

        let listActions = await listGrid.getActionButtons('list')
        expect(listActions.length).toBe(1)
        expect(await listActions[0].getAttribute('id')).toEqual('id1-customActionActionButton')
        userService.permissionsTopic$.publish([])

        listActions = await listGrid.getActionButtons('list')
        expect(listActions.length).toBe(0)
      })

      it('should show overflow menu when user has permission for at least one action', async () => {
        userService.permissionsTopic$.publish(['OVERFLOW#ACTION'])

        component.additionalActions = [
          {
            permission: 'OVERFLOW#ACTION',
            callback: () => {
              console.log('overflow action clicked')
            },
            id: 'overflowAction',
            labelKey: 'OVERFLOW_ACTION_KEY',
            showAsOverflow: true,
          },
        ]

        fixture.detectChanges()
        await fixture.whenStable()

        const button = await listGrid.getListOverflowMenuButton()
        await button.click()

        const overflowMenu = await listGrid.getListOverflowMenu()
        expect(overflowMenu).toBeTruthy()
        const menuItems = await overflowMenu?.getAllMenuItems()
        expect(menuItems!.length).toBe(1)
        expect(await menuItems![0].getText()).toEqual('OVERFLOW_ACTION_KEY')

        userService.permissionsTopic$.publish([])
        const newMenuItems = await overflowMenu?.getAllMenuItems()
        expect(newMenuItems!.length).toBe(0)
      })
      it('should display action buttons based on multiple permissions', async () => {
        component.additionalActions = [
          {
            permission: ['CUSTOM#ACTION1', 'CUSTOM#ACTION2'],
            callback: () => {
              console.log('custom action clicked')
            },
            id: 'customAction',
            icon: 'pi pi-check',
            showAsOverflow: false,
          },
          {
            permission: ['OVERFLOW#ACTION1', 'OVERFLOW#ACTION2'],
            callback: () => {
              console.log('overflow action clicked')
            },
            id: 'overflowAction',
            labelKey: 'OVERFLOW_ACTION_KEY',
            showAsOverflow: true,
          },
        ]

        component.viewPermission = ['LIST#VIEW1', 'LIST#VIEW2']
        component.editPermission = ['LIST#EDIT1', 'LIST#EDIT2']
        component.deletePermission = ['LIST#DELETE1', 'LIST#DELETE2']

        userService.permissionsTopic$.publish([
          'LIST#VIEW1',
          'LIST#VIEW2',
          'LIST#EDIT1',
          'LIST#EDIT2',
          'LIST#DELETE1',
          'LIST#DELETE2',
          'CUSTOM#ACTION1',
          'CUSTOM#ACTION2',
          'OVERFLOW#ACTION1',
          'OVERFLOW#ACTION2',
        ])

        fixture.detectChanges()
        await fixture.whenStable()

        const listActions = await listGrid.getActionButtons('list')
        expect(listActions.length).toBe(4)
        expect(await listActions[0].getAttribute('icon')).toEqual('pi pi-eye')
        expect(await listActions[1].getAttribute('icon')).toEqual('pi pi-pencil')
        expect(await listActions[2].getAttribute('icon')).toEqual('pi pi-trash')
        expect(await listActions[3].getAttribute('id')).toEqual('id1-customActionActionButton')

        const button = await listGrid.getListOverflowMenuButton()
        await button.click()

        const overflowMenu = await listGrid.getListOverflowMenu()
        expect(overflowMenu).toBeTruthy()
        const menuItems = await overflowMenu?.getAllMenuItems()
        expect(menuItems!.length).toBe(1)
        expect(await menuItems![0].getText()).toEqual('OVERFLOW_ACTION_KEY')
      })
    })

    describe('grid layout', () => {
      beforeEach(() => {
        component.layout = 'grid'
        component.viewPermission = 'GRID#VIEW'
        component.viewMenuItemKey = 'GRID_VIEW_KEY'
        component.editPermission = 'GRID#EDIT'
        component.editMenuItemKey = 'GRID_EDIT_KEY'
        component.deletePermission = 'GRID#DELETE'
        component.deleteMenuItemKey = 'GRID_DELETE_KEY'
        component.additionalActions = []
      })
      it('should show view, delete and edit action buttons when user has VIEW, DELETE and EDIT permissions', async () => {
        userService.permissionsTopic$.publish(['GRID#VIEW', 'GRID#EDIT', 'GRID#DELETE'])

        const gridMenuButton = await listGrid.getMenuButton()
        await gridMenuButton.click()

        let gridActions = await listGrid.getActionButtons('grid')
        expect(gridActions.length).toBe(3)

        expect(await gridActions[0].text()).toEqual('GRID_VIEW_KEY')
        expect(await gridActions[1].text()).toEqual('GRID_EDIT_KEY')
        expect(await gridActions[2].text()).toEqual('GRID_DELETE_KEY')

        userService.permissionsTopic$.publish([])

        await gridMenuButton.click()
        gridActions = await listGrid.getActionButtons('grid')
        expect(gridActions.length).toBe(0)
      })

      it('should show custom additional action buttons when user has the required permission', async () => {
        userService.permissionsTopic$.publish(['CUSTOM#ACTION'])

        component.additionalActions = [
          {
            permission: 'CUSTOM#ACTION',
            callback: () => {
              console.log('custom action clicked')
            },
            id: 'customAction',
            labelKey: 'CUSTOM_ACTION_KEY',
          },
        ]

        const gridMenuButton = await listGrid.getMenuButton()
        await gridMenuButton.click()

        let gridActions = await listGrid.getActionButtons('grid')
        expect(gridActions.length).toBe(1)
        expect(await gridActions[0].text()).toEqual('CUSTOM_ACTION_KEY')

        userService.permissionsTopic$.publish([])

        await gridMenuButton.click()
        gridActions = await listGrid.getActionButtons('grid')
        expect(gridActions.length).toBe(0)
      })

      it('should display action buttons based on multiple permissions', async () => {
        component.additionalActions = [
          {
            permission: ['CUSTOM#ACTION1', 'CUSTOM#ACTION2'],
            callback: () => {
              console.log('custom action clicked')
            },
            id: 'customAction',
            labelKey: 'CUSTOM_ACTION_KEY',
          },
        ]

        component.viewPermission = ['GRID#VIEW1', 'GRID#VIEW2']
        component.editPermission = ['GRID#EDIT1', 'GRID#EDIT2']
        component.deletePermission = ['GRID#DELETE1', 'GRID#DELETE2']

        userService.permissionsTopic$.publish([
          'GRID#VIEW1',
          'GRID#VIEW2',
          'GRID#EDIT1',
          'GRID#EDIT2',
          'GRID#DELETE1',
          'GRID#DELETE2',
          'CUSTOM#ACTION1',
          'CUSTOM#ACTION2',
        ])

        const gridMenuButton = await listGrid.getMenuButton()
        await gridMenuButton.click()

        const gridActions = await listGrid.getActionButtons('grid')
        expect(gridActions.length).toBe(4)
        expect(await gridActions[0].text()).toEqual('GRID_VIEW_KEY')
        expect(await gridActions[1].text()).toEqual('GRID_EDIT_KEY')
        expect(await gridActions[2].text()).toEqual('GRID_DELETE_KEY')
        expect(await gridActions[3].text()).toEqual('CUSTOM_ACTION_KEY')
      })
    })
  })
})


```

### File: angular-accelerator/src/lib/components/data-list-grid/data-list-grid.component.stories.ts

```ts

import { Meta, moduleMetadata, applicationConfig, StoryFn } from '@storybook/angular'
import { RouterModule } from '@angular/router'
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ButtonModule } from 'primeng/button'
import { MultiSelectModule } from 'primeng/multiselect'
import { DataViewModule } from 'primeng/dataview'
import { MenuModule } from 'primeng/menu'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { StorybookTranslateModule } from './../../storybook-translate.module'
import { DataListGridComponent } from './data-list-grid.component'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { TooltipOnOverflowDirective } from '../../directives/tooltipOnOverflow.directive'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { TooltipModule } from 'primeng/tooltip'
import { UserService } from '@onecx/angular-integration-interface'

const DataListGridComponentSBConfig: Meta<DataListGridComponent> = {
  title: 'Components/DataListGridComponent',
  component: DataListGridComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        provideUserServiceMock(),
        { provide: HAS_PERMISSION_CHECKER, useExisting: UserServiceMock },
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
        importProvidersFrom(StorybookThemeModule),
        {
          provide: APP_INITIALIZER,
          useFactory: (userService: UserService) => () => {
            const userServiceMock = userService as unknown as UserServiceMock
            userServiceMock.permissionsTopic$.publish([
              'TEST_MGMT#TEST_DELETE',
              'TEST_MGMT#TEST_EDIT',
              'TEST_MGMT#TEST_VIEW',
            ])
          },
          multi: true,
          deps: [UserService],
        },
      ],
    }),
    moduleMetadata({
      declarations: [DataListGridComponent, IfPermissionDirective, TooltipOnOverflowDirective],
      imports: [DataViewModule, MenuModule, ButtonModule, MultiSelectModule, TooltipModule, StorybookTranslateModule],
    }),
  ],
}
const Template: StoryFn = (args) => ({
  props: args,
})

const defaultComponentArgs = {
  data: [
    {
      id: 'Test',
      imagePath:
        'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      property1: 'Card 1',
      available: true,
    },
    {
      id: 'Test2',
      imagePath:
        'https://images.unsplash.com/photo-1710092662335-065cdbfb9781?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      property1: 'Card 2',
      available: false,
    },
  ],
  emptyResultsMessage: 'No results',
  titleLineId: 'property1',
  layout: 'list',
  deletePermission: 'TEST_MGMT#TEST_DELETE',
  editPermission: 'TEST_MGMT#TEST_EDIT',
  viewPermission: 'TEST_MGMT#TEST_VIEW',
}
const defaultArgTypes = {
  deleteItem: { action: 'deleteItem' },
  editItem: { action: 'editItem' },
  viewItem: { action: 'viewItem' },
}
const extendedMockData = [
  {
    id: 'Test',
    imagePath:
      'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 1',
    available: true,
  },
  {
    id: 'Test2',
    imagePath:
      'https://images.unsplash.com/photo-1710092662335-065cdbfb9781?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 2',
    available: false,
  },
  {
    id: 'Test',
    imagePath:
      'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 1',
    available: true,
  },
  {
    id: 'Test2',
    imagePath:
      'https://images.unsplash.com/photo-1710092662335-065cdbfb9781?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 2',
    available: false,
  },
  {
    id: 'Test',
    imagePath:
      'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 1',
    available: true,
  },
  {
    id: 'Test2',
    imagePath:
      'https://images.unsplash.com/photo-1710092662335-065cdbfb9781?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 2',
    available: false,
  },
  {
    id: 'Test',
    imagePath:
      'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 1',
    available: true,
  },
  {
    id: 'Test2',
    imagePath:
      'https://images.unsplash.com/photo-1710092662335-065cdbfb9781?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 2',
    available: false,
  },
  {
    id: 'Test',
    imagePath:
      'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 1',
    available: true,
  },
  {
    id: 'Test2',
    imagePath:
      'https://images.unsplash.com/photo-1710092662335-065cdbfb9781?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 2',
    available: false,
  },
]

export const ListWithMockData = {
  render: Template,
  argTypes: defaultArgTypes,
  args: defaultComponentArgs,
}

export const ListWithNoData = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultComponentArgs,
    data: [],
  },
}

export const ListWithConditionallyDisabledActionButtons = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    deleteActionEnabledField: 'available',
    editActionEnabledField: 'available',
  },
}

export const ListWithConditionallyHiddenActionButtons = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
  },
}

export const ListWithAdditionalActions = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
      },
    ],
  },
}

export const ListWithConditionallyEnabledAdditionalActions = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        actionEnabledField: 'available',
      },
    ],
  },
}

export const ListWithConditionallyVisibleAdditionalActions = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        actionVisibleField: 'available',
      },
    ],
  },
}

export const ListWithAdditionalOverflowActions = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional Action',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
      },
      {
        id: '2',
        labelKey: 'Conditionally Hidden',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionVisibleField: 'available',
      },
      {
        id: '3',
        labelKey: 'Conditionally Enabled',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionEnabledField: 'available',
      },
    ],
  },
}

export const ListWithOnlyAdditionalOverflowActions = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    deleteItem: null,
    editItem: null,
    viewItem: null,
    deletePermission: null,
    editPermission: null,
    viewPermission: null,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional Action',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
      },
      {
        id: '2',
        labelKey: 'Conditionally Hidden',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionVisibleField: 'available',
      },
      {
        id: '3',
        labelKey: 'Conditionally Enabled',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionEnabledField: 'available',
      },
    ],
  },
}

export const ListWithPageSizes = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    pageSizes: [2, 15, 25],
    data: extendedMockData,
    showAllOption: false,
  },
}

export const GridWithMockData = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultComponentArgs,
    layout: 'grid',
  },
}

export const GridWithNoData = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultComponentArgs,
    data: [],
    layout: 'grid',
  },
}

export const GridWithConditionallyDisabledActionButtons = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    deleteActionEnabledField: 'available',
    editActionEnabledField: 'available',
    layout: 'grid',
  },
}

export const GridWithConditionallyHiddenActionButtons = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
    layout: 'grid',
  },
}

export const GridWithAdditionalActions = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    layout: 'grid',
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
      },
    ],
  },
}

export const GridWithConditionallyEnabledAdditionalActions = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    layout: 'grid',
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        actionEnabledField: 'available',
      },
    ],
  },
}

export const GridWithConditionallyVisibleAdditionalActions = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    layout: 'grid',
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        actionVisibleField: 'available',
      },
    ],
  },
}

export const GridWithPageSizes = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    layout: 'grid',
    pageSizes: [2, 15, 25],
    data: extendedMockData,
    showAllOption: false,
  },
}

export default DataListGridComponentSBConfig


```

### File: angular-accelerator/src/lib/components/data-list-grid/data-list-grid.component.ts

```ts

import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  EventEmitter,
  Injector,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChildren,
  inject,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AppStateService, UserService } from '@onecx/angular-integration-interface'
import { MfeInfo } from '@onecx/integration-interface'
import { MenuItem, PrimeIcons, PrimeTemplate } from 'primeng/api'
import { Menu } from 'primeng/menu'
import { BehaviorSubject, Observable, combineLatest, debounceTime, first, map, mergeMap, of, switchMap } from 'rxjs'
import { ColumnType } from '../../model/column-type.model'
import { DataAction } from '../../model/data-action'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { Filter } from '../../model/filter.model'
import { ObjectUtils } from '../../utils/objectutils'
import { DataSortBase } from '../data-sort-base/data-sort-base'
import { Row } from '../data-table/data-table.component'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'

export type ListGridData = {
  id: string | number
  imagePath: string | number
  [columnId: string]: unknown
}

type RowListGridData = ListGridData & Row

export interface ListGridDataMenuItem extends MenuItem {
  permission: string
}

export interface DataListGridComponentState {
  activePage?: number
  pageSize?: number
}

@Component({
  standalone: false,
  selector: 'ocx-data-list-grid',
  templateUrl: './data-list-grid.component.html',
  styleUrls: ['./data-list-grid.component.scss'],
})
export class DataListGridComponent extends DataSortBase implements OnInit, DoCheck, AfterContentInit {
  private userService = inject(UserService)
  private router = inject(Router)
  private injector = inject(Injector)
  private appStateService = inject(AppStateService)
  private hasPermissionChecker = inject(HAS_PERMISSION_CHECKER, { optional: true })

  @Input() titleLineId: string | undefined
  @Input() subtitleLineIds: string[] = []
  @Input() clientSideSorting = true
  @Input() clientSideFiltering = true
  @Input() sortStates: DataSortDirection[] = []

  _pageSizes$ = new BehaviorSubject<number[]>([10, 25, 50])
  @Input()
  get pageSizes(): number[] {
    return this._pageSizes$.getValue()
  }
  set pageSizes(value: number[]) {
    this._pageSizes$.next(value)
  }

  displayedPageSize$: Observable<number>
  _pageSize$ = new BehaviorSubject<number | undefined>(undefined)
  @Input()
  get pageSize(): number | undefined {
    return this._pageSize$.getValue()
  }
  set pageSize(value: number | undefined) {
    this._pageSize$.next(value)
  }

  @Input() emptyResultsMessage: string | undefined
  @Input() fallbackImage = 'placeholder.png'
  @Input() layout: 'grid' | 'list' = 'grid'
  _viewPermission$ = new BehaviorSubject<string | string[] | undefined>(undefined)
  @Input()
  get viewPermission(): string | string[] | undefined {
    return this._viewPermission$.getValue()
  }
  set viewPermission(value: string | string[] | undefined) {
    this._viewPermission$.next(value)
  }
  @Input() editPermission: string | string[] | undefined
  @Input() deletePermission: string | string[] | undefined
  @Input() deleteActionVisibleField: string | undefined
  @Input() deleteActionEnabledField: string | undefined
  @Input() viewActionVisibleField: string | undefined
  @Input() viewActionEnabledField: string | undefined
  @Input() editActionVisibleField: string | undefined
  @Input() editActionEnabledField: string | undefined
  @Input() viewMenuItemKey: string | undefined
  @Input() editMenuItemKey: string | undefined
  @Input() deleteMenuItemKey: string | undefined
  @Input() paginator = true
  @Input() page = 0
  columnTemplates$: Observable<Record<string, TemplateRef<any> | null>> | undefined
  _columns$ = new BehaviorSubject<DataTableColumn[]>([])
  @Input()
  get columns(): DataTableColumn[] {
    return this._columns$.getValue()
  }
  set columns(value: DataTableColumn[]) {
    this._columns$.next(value)
    const obs = value.map((c) => this.getTemplate(c))
    this.columnTemplates$ = combineLatest(obs).pipe(
      map((values) => Object.fromEntries(value.map((c, i) => [c.id, values[i]]))),
      debounceTime(50)
    )
  }
  @Input() name = ''
  @Input()
  get totalRecordsOnServer(): number | undefined {
    return this.params['totalRecordsOnServer'] ? Number(this.params['totalRecordsOnServer']) : undefined
  }
  set totalRecordsOnServer(value: number | undefined) {
    this.params['totalRecordsOnServer'] = value?.toString() ?? '0'
  }
  @Input() currentPageShowingKey = 'OCX_DATA_TABLE.SHOWING'
  @Input() currentPageShowingWithTotalOnServerKey = 'OCX_DATA_TABLE.SHOWING_WITH_TOTAL_ON_SERVER'
  params: { [key: string]: string } = {
    currentPage: '{currentPage}',
    totalPages: '{totalPages}',
    rows: '{rows}',
    first: '{first}',
    last: '{last}',
    totalRecords: '{totalRecords}',
  }

  _data$ = new BehaviorSubject<RowListGridData[]>([])
  @Input()
  get data(): RowListGridData[] {
    return this._data$.getValue()
  }
  set data(value: RowListGridData[]) {
    if (this._data$.getValue().length) this.resetPage()
    this._originalData = [...value]
    this._data$.next([...value])
  }
  _filters$ = new BehaviorSubject<Filter[]>([])
  @Input()
  get filters(): Filter[] {
    return this._filters$.getValue()
  }
  set filters(value: Filter[]) {
    if (this._filters$.getValue().length) this.resetPage()
    this._filters$.next(value)
  }
  _originalData: RowListGridData[] = []
  _sortDirection$ = new BehaviorSubject<DataSortDirection>(DataSortDirection.NONE)
  @Input()
  get sortDirection(): DataSortDirection {
    return this._sortDirection$.getValue()
  }
  set sortDirection(value: DataSortDirection) {
    if (value === DataSortDirection.NONE) {
      this._data$.next([...this._originalData])
    }
    this._sortDirection$.next(value)
  }
  _sortField$ = new BehaviorSubject<string>('')
  @Input()
  get sortField(): string {
    return this?._sortField$.getValue()
  }
  set sortField(value: string) {
    this._sortField$.next(value)
  }

  @Input() gridItemSubtitleLinesTemplate: TemplateRef<any> | undefined
  @ContentChild('gridItemSubtitleLines') gridItemSubtitleLinesChildTemplate: TemplateRef<any> | undefined
  get _gridItemSubtitleLines(): TemplateRef<any> | undefined {
    return this.gridItemSubtitleLinesTemplate || this.gridItemSubtitleLinesChildTemplate
  }

  @Input() listItemSubtitleLinesTemplate: TemplateRef<any> | undefined
  @ContentChild('listItemSubtitleLines') listItemSubtitleLinesChildTemplate: TemplateRef<any> | undefined
  get _listItemSubtitleLines(): TemplateRef<any> | undefined {
    return this.listItemSubtitleLinesTemplate || this.listItemSubtitleLinesChildTemplate
  }

  @Input() listItemTemplate: TemplateRef<any> | undefined
  @ContentChild('listItem') listItemChildTemplate: TemplateRef<any> | undefined
  get _listItem(): TemplateRef<any> | undefined {
    return this.listItemTemplate || this.listItemChildTemplate
  }

  @Input() gridItemTemplate: TemplateRef<any> | undefined
  @ContentChild('gridItem') gridItemChildTemplate: TemplateRef<any> | undefined
  get _gridItem(): TemplateRef<any> | undefined {
    return this.gridItemTemplate || this.gridItemChildTemplate
  }

  @Input() listValueTemplate: TemplateRef<any> | undefined
  @ContentChild('listValue') listValueChildTemplate: TemplateRef<any> | undefined
  get _listValue(): TemplateRef<any> | undefined {
    return this.listValueTemplate || this.listValueChildTemplate
  }

  @Input() translationKeyListValueTemplate: TemplateRef<any> | undefined
  @ContentChild('translationKeyListValue') translationKeyListValueChildTemplate: TemplateRef<any> | undefined
  get _translationKeyListValue(): TemplateRef<any> | undefined {
    return this.translationKeyListValueTemplate || this.translationKeyListValueChildTemplate
  }

  @Input() numberListValueTemplate: TemplateRef<any> | undefined
  @ContentChild('numberListValue') numberListValueChildTemplate: TemplateRef<any> | undefined
  get _numberListValue(): TemplateRef<any> | undefined {
    return this.numberListValueTemplate || this.numberListValueChildTemplate
  }

  @Input() relativeDateListValueTemplate: TemplateRef<any> | undefined
  @ContentChild('relativeDateListValue') relativeDateListValueChildTemplate: TemplateRef<any> | undefined
  get _relativeDateListValue(): TemplateRef<any> | undefined {
    return this.relativeDateListValueTemplate || this.relativeDateListValueChildTemplate
  }

  @Input() stringListValueTemplate: TemplateRef<any> | undefined
  @ContentChild('stringListValue') stringListValueChildTemplate: TemplateRef<any> | undefined
  get _stringListValue(): TemplateRef<any> | undefined {
    return this.stringListValueTemplate || this.stringListValueChildTemplate
  }

  @Input() dateListValueTemplate: TemplateRef<any> | undefined
  @ContentChild('dateListValue') dateListValueChildTemplate: TemplateRef<any> | undefined
  get _dateListValue(): TemplateRef<any> | undefined {
    return this.dateListValueTemplate || this.dateListValueChildTemplate
  }

  inlineListActions$: Observable<DataAction[]>
  overflowListActions$: Observable<DataAction[]>
  overflowListMenuItems$: Observable<MenuItem[]>
  currentMenuRow$ = new BehaviorSubject<Row | null>(null)
  _additionalActions$ = new BehaviorSubject<DataAction[]>([])
  @Input()
  get additionalActions(): DataAction[] {
    return this._additionalActions$.getValue()
  }
  set additionalActions(value: DataAction[]) {
    this._additionalActions$.next(value)
  }

  @Output() viewItem = new EventEmitter<ListGridData>()
  @Output() editItem = new EventEmitter<ListGridData>()
  @Output() deleteItem = new EventEmitter<ListGridData>()
  @Output() pageChanged = new EventEmitter<number>()
  @Output() pageSizeChanged = new EventEmitter<number>()
  @Output() componentStateChanged = new EventEmitter<DataListGridComponentState>()

  get viewItemObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.viewItemObserved || dv?.viewItem.observed || this.viewItem.observed
  }
  get editItemObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.editItemObserved || dv?.editItem.observed || this.editItem.observed
  }
  get deleteItemObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.deleteItemObserved || dv?.deleteItem.observed || this.deleteItem.observed
  }

  get sortDirectionNumber(): number {
    if (this.sortDirection === DataSortDirection.ASCENDING) return 1
    if (this.sortDirection === DataSortDirection.DESCENDING) return -1
    return 0
  }

  gridMenuItems$: Observable<MenuItem[]>
  _selectedItem$ = new BehaviorSubject<ListGridData | undefined>(undefined)
  observedOutputs$ = new BehaviorSubject<number>(0)

  displayedItems$: Observable<unknown[]> | undefined
  fallbackImagePath$!: Observable<string>

  templates$: BehaviorSubject<QueryList<PrimeTemplate> | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | undefined
  >(undefined)
  @ContentChildren(PrimeTemplate)
  set templates(value: QueryList<PrimeTemplate> | undefined) {
    this.templates$.next(value)
  }

  viewTemplates$: BehaviorSubject<QueryList<PrimeTemplate> | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | undefined
  >(undefined)
  @ViewChildren(PrimeTemplate)
  set viewTemplates(value: QueryList<PrimeTemplate> | undefined) {
    this.viewTemplates$.next(value)
  }

  parentTemplates$: BehaviorSubject<QueryList<PrimeTemplate> | null | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | null | undefined
  >(undefined)
  @Input()
  set parentTemplates(value: QueryList<PrimeTemplate> | null | undefined) {
    this.parentTemplates$.next(value)
  }

  columnType = ColumnType
  templatesObservables: Record<string, Observable<TemplateRef<any> | null>> = {}
  hasViewPermission$: Observable<boolean>

  private cachedOverflowMenuItemsVisibility$: Observable<boolean> | undefined

  constructor() {
    const locale = inject(LOCALE_ID)
    const translateService = inject(TranslateService)

    super(locale, translateService)
    this.name = this.name || this.router.url.replace(/[^A-Za-z0-9]/, '_')
    this.fallbackImagePath$ = this.appStateService.currentMfe$.pipe(
      map((currentMfe) => this.getFallbackImagePath(currentMfe))
    )
    this.displayedPageSize$ = combineLatest([this._pageSize$, this._pageSizes$]).pipe(
      map(([pageSize, pageSizes]) => pageSize ?? pageSizes.find((val): val is number => typeof val === 'number') ?? 50)
    )
    this.inlineListActions$ = this._additionalActions$.pipe(
      map((actions) => actions.filter((action) => !action.showAsOverflow))
    )
    this.overflowListActions$ = this._additionalActions$.pipe(
      map((actions) => actions.filter((action) => action.showAsOverflow))
    )
    this.overflowListMenuItems$ = combineLatest([this.overflowListActions$, this.currentMenuRow$]).pipe(
      switchMap(([actions, row]) =>
        this.filterActionsBasedOnPermissions(actions).pipe(
          map((permittedActions) => ({ actions: permittedActions, row: row }))
        )
      ),
      mergeMap(({ actions, row }) => {
        if (actions.length === 0) {
          return of([])
        }
        return this.translateService.get([...actions.map((a) => a.labelKey || '')]).pipe(
          map((translations) => {
            return actions.map((a) => ({
              label: translations[a.labelKey || ''],
              icon: a.icon,
              styleClass: (a.classes || []).join(' '),
              disabled: a.disabled || (!!a.actionEnabledField && !this.fieldIsTruthy(row, a.actionEnabledField)),
              visible: !a.actionVisibleField || this.fieldIsTruthy(row, a.actionVisibleField),
              command: () => a.callback(row),
            }))
          })
        )
      })
    )
    this.hasViewPermission$ = this._viewPermission$.pipe(
      map((permission) => {
        if (!permission) return []
        return Array.isArray(permission) ? permission : [permission]
      }),
      switchMap((permissionArray) => {
        if (permissionArray.length === 0) {
          return of(true)
        }
        return this.getPermissions().pipe(map((permissions) => permissionArray.every((p) => permissions.includes(p))))
      })
    )
    this.gridMenuItems$ = combineLatest([
      this.getPermissions(),
      this._additionalActions$.asObservable(),
      this._selectedItem$.asObservable(),
      this.observedOutputs$.asObservable(),
    ]).pipe(
      switchMap(([permissions, additionalActions, selectedItem, _observedOutputs]) =>
        this.filterActionsBasedOnPermissions(additionalActions, permissions).pipe(
          map((permittedActions) => ({ permissions, additionalActions: permittedActions, selectedItem }))
        )
      ),
      switchMap(({ permissions, additionalActions, selectedItem }) => {
        return this.getGridActionsTranslations(additionalActions, permissions).pipe(
          map((translations) => ({ permissions, additionalActions, selectedItem, translations }))
        )
      }),
      map(({ permissions, additionalActions, selectedItem, translations }) =>
        this.mapGridMenuItems(permissions, additionalActions, selectedItem, translations)
      )
    )
  }

  ngDoCheck(): void {
    const observedOutputs = <any>this.viewItem.observed + <any>this.deleteItem.observed + <any>this.editItem.observed
    if (this.observedOutputs$.getValue() !== observedOutputs) {
      this.observedOutputs$.next(observedOutputs)
    }
  }

  ngOnInit(): void {
    this.displayedItems$ = combineLatest([this._data$, this._filters$, this._sortField$, this._sortDirection$]).pipe(
      mergeMap((params) => this.translateItems(params, this.columns, this.clientSideFiltering, this.clientSideSorting)),
      map((params) => this.filterItems(params, this.clientSideFiltering)),
      map((params) => this.sortItems(params, this.columns, this.clientSideSorting)),
      map(([items]) => items)
    )

    this.emitComponentStateChanged()
  }

  ngAfterContentInit() {
    this.templates$.value?.forEach((item) => {
      switch (item.getType()) {
        case 'listValue':
          this.listValueChildTemplate = item.template
          break
        case 'translationKeyListValue':
          this.translationKeyListValueChildTemplate = item.template
          break
        case 'numberListValue':
          this.numberListValueChildTemplate = item.template
          break
        case 'relativeDateListValue':
          this.relativeDateListValueChildTemplate = item.template
          break
        case 'stringListValue':
          this.stringListValueChildTemplate = item.template
          break
        case 'dateListValue':
          this.dateListValueChildTemplate = item.template
          break
      }
    })
  }

  onDeleteRow(element: ListGridData) {
    this.deleteItem.emit(element)
  }

  onViewRow(element: ListGridData) {
    this.viewItem.emit(element)
  }

  onEditRow(element: ListGridData) {
    this.editItem.emit(element)
  }

  imgError(item: ListGridData) {
    item.imagePath = ''
  }

  getFallbackImagePath(mfeInfo: MfeInfo) {
    return mfeInfo?.remoteBaseUrl
      ? `${mfeInfo.remoteBaseUrl}/onecx-portal-lib/assets/images/${this.fallbackImage}`
      : `./onecx-portal-lib/assets/images/${this.fallbackImage}`
  }

  setSelectedItem(item: ListGridData) {
    this._selectedItem$.next(item)
  }

  resolveFieldData(object: any, key: any) {
    return ObjectUtils.resolveFieldData(object, key)
  }

  emitComponentStateChanged(state: DataListGridComponentState = {}) {
    this.displayedPageSize$.pipe(first()).subscribe((pageSize) => {
      this.componentStateChanged.emit({
        pageSize,
        activePage: this.page,
        ...state,
      })
    })
  }

  onPageChange(event: any) {
    const page = event.first / event.rows
    this.page = page
    this.pageSize = event.rows
    this.pageChanged.emit(page)
    this.pageSizeChanged.emit(event.rows)
    this.emitComponentStateChanged({
      activePage: page,
      pageSize: event.rows,
    })
  }

  resetPage() {
    this.page = 0
    this.pageChanged.emit(this.page)
    this.emitComponentStateChanged()
  }

  fieldIsTruthy(object: any, key: any) {
    return !!this.resolveFieldData(object, key)
  }

  hasVisibleOverflowMenuItems(row: any) {
    return this.overflowListActions$.pipe(
      switchMap((actions) => this.filterActionsBasedOnPermissions(actions)),
      map((actions) => actions.some((a) => !a.actionVisibleField || this.fieldIsTruthy(row, a.actionVisibleField)))
    )
  }

  toggleOverflowMenu(event: MouseEvent, menu: Menu, row: Row) {
    this.currentMenuRow$.next(row)
    menu.toggle(event)
  }

  getFilteredColumns() {
    let ids: string[] = [...(this.subtitleLineIds ?? [])]
    if (this.titleLineId) {
      ids = [this.titleLineId, ...(this.subtitleLineIds ?? [])]
    }
    return this.columns.filter((c) => !ids.includes(c.id))
  }

  findTemplate(templates: PrimeTemplate[], names: string[]): PrimeTemplate | undefined {
    for (let index = 0; index < names.length; index++) {
      const name = names[index]
      const template = templates.find((template) => template.name === name)
      if (template) {
        return template
      }
    }
    return undefined
  }

  getTemplate(column: DataTableColumn): Observable<TemplateRef<any> | null> {
    if (!this.templatesObservables[column.id]) {
      this.templatesObservables[column.id] = combineLatest([
        this.templates$,
        this.viewTemplates$,
        this.parentTemplates$,
      ]).pipe(
        map(([t, vt, pt]) => {
          const templates = [...(t ?? []), ...(vt ?? []), ...(pt ?? [])]
          const columnTemplate = templates.find((template) => template.name === column.id + 'IdListValue')?.template
          if (columnTemplate) {
            return columnTemplate
          }
          switch (column.columnType) {
            case ColumnType.DATE:
              return (
                this._dateListValue ??
                this.findTemplate(templates, ['dateListValue', 'defaultDateListValue'])?.template ??
                null
              )
            case ColumnType.NUMBER:
              return (
                this._numberListValue ??
                this.findTemplate(templates, ['numberListValue', 'defaultNumberListValue'])?.template ??
                null
              )
            case ColumnType.RELATIVE_DATE:
              return (
                this._relativeDateListValue ??
                this.findTemplate(templates, ['relativeDateListValue', 'defaultRelativeDateListValue'])?.template ??
                null
              )
            case ColumnType.TRANSLATION_KEY:
              return (
                this._translationKeyListValue ??
                this.findTemplate(templates, ['translationKeyListValue', 'defaultTranslationKeyListValue'])?.template ??
                null
              )
            default:
              return (
                this._stringListValue ??
                this.findTemplate(templates, ['stringListValue', 'defaultStringListValue'])?.template ??
                null
              )
          }
        })
      )
    }
    return this.templatesObservables[column.id]
  }

  private mapGridMenuItems(
    permissions: string[],
    additionalActions: DataAction[],
    selectedItem: ListGridData | undefined,
    translations: Record<string, string>
  ): MenuItem[] {
    let deleteDisabled = false
    let editDisabled = false
    let viewDisabled = false

    let deleteVisible = true
    let editVisible = true
    let viewVisible = true

    if (selectedItem) {
      viewDisabled = !!this.viewActionEnabledField && !this.fieldIsTruthy(selectedItem, this.viewActionEnabledField)
      editDisabled = !!this.editActionEnabledField && !this.fieldIsTruthy(selectedItem, this.editActionEnabledField)
      deleteDisabled =
        !!this.deleteActionEnabledField && !this.fieldIsTruthy(selectedItem, this.deleteActionEnabledField)

      viewVisible = !this.viewActionVisibleField || this.fieldIsTruthy(selectedItem, this.viewActionVisibleField)
      editVisible = !this.editActionVisibleField || this.fieldIsTruthy(selectedItem, this.editActionVisibleField)
      deleteVisible = !this.deleteActionVisibleField || this.fieldIsTruthy(selectedItem, this.deleteActionVisibleField)
    }

    const menuItems: MenuItem[] = []
    const automationId = 'data-grid-action-button'
    const automationIdHidden = 'data-grid-action-button-hidden'
    if (this.shouldDisplayAction(this.viewPermission, this.viewItem, permissions)) {
      menuItems.push({
        label: translations[this.viewMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.VIEW'],
        icon: PrimeIcons.EYE,
        command: () => this.viewItem.emit(selectedItem),
        disabled: viewDisabled,
        visible: viewVisible,
        automationId: viewVisible ? automationId : automationIdHidden,
      })
    }
    if (this.shouldDisplayAction(this.editPermission, this.editItem, permissions)) {
      menuItems.push({
        label: translations[this.editMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.EDIT'],
        icon: PrimeIcons.PENCIL,
        command: () => this.editItem.emit(selectedItem),
        disabled: editDisabled,
        visible: editVisible,
        automationId: editVisible ? automationId : automationIdHidden,
      })
    }
    if (this.shouldDisplayAction(this.deletePermission, this.deleteItem, permissions)) {
      menuItems.push({
        label: translations[this.deleteMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.DELETE'],
        icon: PrimeIcons.TRASH,
        command: () => this.deleteItem.emit(selectedItem),
        disabled: deleteDisabled,
        visible: deleteVisible,
        automationId: deleteVisible ? automationId : automationIdHidden,
      })
    }
    const val = menuItems.concat(
      additionalActions.map((a) => {
        const isVisible = !a.actionVisibleField || this.fieldIsTruthy(selectedItem, a.actionVisibleField)
        return {
          label: translations[a.labelKey || ''],
          icon: a.icon,
          styleClass: (a.classes || []).join(' '),
          disabled: a.disabled || (!!a.actionEnabledField && !this.fieldIsTruthy(selectedItem, a.actionEnabledField)),
          visible: isVisible,
          command: () => a.callback(selectedItem),
          automationId: isVisible ? automationId : automationIdHidden,
        }
      })
    )
    return val
  }

  private getGridActionsTranslations(
    additionalActions: DataAction[],
    permissions: string[]
  ): Observable<Record<string, string>> {
    return this.translateService.get([
      this.viewMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.VIEW',
      this.editMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.EDIT',
      this.deleteMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.DELETE',
      ...additionalActions
        .filter((action) => {
          const permissionsArray = Array.isArray(action.permission) ? action.permission : [action.permission]
          return permissionsArray.every((p) => permissions.includes(p))
        })
        .map((a) => a.labelKey || ''),
    ])
  }

  private shouldDisplayAction(
    permission: string | string[] | undefined,
    emitter: EventEmitter<any>,
    userPermissions: string[]
  ): boolean {
    const permissions = Array.isArray(permission) ? permission : permission ? [permission] : []
    return emitter.observed && permissions.every((p) => userPermissions.includes(p))
  }

  private filterActionsBasedOnPermissions(actions: DataAction[], permissions?: string[]): Observable<DataAction[]> {
    const permissions$ = permissions ? of(permissions) : this.getPermissions()
    return permissions$.pipe(
      map((permissions) => {
        return actions.filter((action) => {
          const actionPermissions = Array.isArray(action.permission) ? action.permission : [action.permission]
          return actionPermissions.every((p) => permissions.includes(p))
        })
      })
    )
  }

  private getPermissions(): Observable<string[]> {
    if (this.hasPermissionChecker?.getPermissions) {
      return this.hasPermissionChecker.getPermissions()
    }

    return this.userService.getPermissions()
  }
}


```

## Folder: angular-accelerator/src/lib/components/data-list-grid-sorting (3 files)

### File: angular-accelerator/src/lib/components/data-list-grid-sorting/data-list-grid-sorting.component.html

```html

<div class="flex align-items-center gap-2">
  <p-floatLabel variant="on">
    <p-select
      id="dataListGridSortingDropdown"
      inputId="dataListGridSortingDropdownInput"
      [(ngModel)]="selectedSortingOption"
      [options]="dropdownOptions"
      (onChange)="selectSorting($event)"
      [ariaLabel]="('OCX_LIST_GRID_SORT.DROPDOWN.ARIA_LABEL' | translate)"
    >
      <ng-template let-item #item> {{ item?.columnName ? (item.columnName | translate) : ''}} </ng-template>
      <ng-template let-item #selectedItem>
        {{ item?.columnName ? (item.columnName | translate) : ''}}
      </ng-template></p-select
    >
    <label for="dataListGridSortingDropdownInput">{{ ("OCX_LIST_GRID_SORT.DROPDOWN.LABEL" | translate) }}</label>
  </p-floatLabel>
  <p-button
    id="dataListGridSortingButton"
    type="button"
    icon="pi {{sortIcon()}}"
    styleClass="p-button-outlined"
    (onClick)="sortDirectionChanged()"
    [pTooltip]="(sortIconTitle() | translate)"
    tooltipPosition="top"
    [ariaLabel]="('OCX_LIST_GRID_SORT.SORTING_BUTTON_ARIA_LABEL' | translate:{direction: (sortDirectionToTitle(nextSortDirection())) | translate})"
  ></p-button>
</div>


```

### File: angular-accelerator/src/lib/components/data-list-grid-sorting/data-list-grid-sorting.component.spec.ts

```ts

import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormsModule } from '@angular/forms'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DataListGridSortingComponent } from './data-list-grid-sorting.component'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'

describe('DataListGridSortingComponent', () => {
  let component: DataListGridSortingComponent
  let fixture: ComponentFixture<DataListGridSortingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataListGridSortingComponent],
      imports: [TranslateTestingModule.withTranslations({}), AngularAcceleratorPrimeNgModule, FormsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(DataListGridSortingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})


```

### File: angular-accelerator/src/lib/components/data-list-grid-sorting/data-list-grid-sorting.component.ts

```ts

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataColumnNameId } from '../../model/data-column-name-id.model'
import { DataTableColumn } from '../../model/data-table-column.model'
import { SelectChangeEvent } from 'primeng/select'

export type ListGridSort = { sortColumn: string; sortDirection: DataSortDirection }
export interface DataListGridSortingComponentState {
  sorting?: ListGridSort
}

@Component({
  standalone: false,
  selector: 'ocx-data-list-grid-sorting',
  templateUrl: './data-list-grid-sorting.component.html',
  styleUrls: ['./data-list-grid-sorting.component.scss'],
})
export class DataListGridSortingComponent implements OnInit {
  @Input() columns: DataTableColumn[] = []
  @Input() sortStates: DataSortDirection[] = [DataSortDirection.ASCENDING, DataSortDirection.DESCENDING]
  _sortDirection$ = new BehaviorSubject<DataSortDirection>(DataSortDirection.NONE)
  @Input()
  get sortDirection(): DataSortDirection {
    return this._sortDirection$.getValue()
  }
  set sortDirection(value: DataSortDirection) {
    this._sortDirection$.next(value)
  }
  _sortField$ = new BehaviorSubject<string>('')
  @Input()
  get sortField(): string {
    return this?._sortField$.getValue()
  }
  set sortField(value: string) {
    this._sortField$.next(value)
  }

  @Output() sortChange: EventEmitter<string> = new EventEmitter()
  @Output() sortDirectionChange: EventEmitter<DataSortDirection> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<DataListGridSortingComponentState> = new EventEmitter()
  @Output() columnsChange: EventEmitter<string[]> = new EventEmitter()
  selectedSortingOption: DataColumnNameId | undefined
  dropdownOptions: DataColumnNameId[] = []

  ngOnInit(): void {
    this.columns.forEach((element) => {
      if (element.sortable) {
        this.dropdownOptions.push({ columnId: element.id, columnName: element.nameKey });
      }
    })
    this.selectedSortingOption = this.dropdownOptions.find((e) => e.columnId === this?.sortField)
    this.emitComponentStateChange()
  }

  selectSorting(event: SelectChangeEvent): void {
    this._sortField$.next(event.value.columnId)
    this.sortChange.emit(event.value.columnId)
    this.emitComponentStateChange()
  }
  sortDirectionChanged(): void {
    const newSortDirection = this.nextSortDirection()
    this._sortDirection$.next(newSortDirection)
    this.sortDirectionChange.emit(newSortDirection)
    this.emitComponentStateChange()
  }

  nextSortDirection() {
    return this.sortStates[(this.sortStates.indexOf(this.sortDirection) + 1) % this.sortStates.length]
  }

  emitComponentStateChange() {
    this.componentStateChanged.emit({
      sorting: {
        sortColumn: this.sortField,
        sortDirection: this.sortDirection,
      },
    })
  }

  sortIcon() {
    switch (this.sortDirection) {
      case DataSortDirection.ASCENDING:
        return 'pi-sort-amount-up'
      case DataSortDirection.DESCENDING:
        return 'pi-sort-amount-down'
      default:
        return 'pi-sort-alt'
    }
  }

  sortIconTitle() {
    return this.sortDirectionToTitle(
      this.nextSortDirection()
    )
  }

  sortDirectionToTitle(sortDirection: DataSortDirection) {
    switch (sortDirection) {
      case DataSortDirection.ASCENDING:
        return 'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.ASCENDING_TOOLTIP'
      case DataSortDirection.DESCENDING:
        return 'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.DESCENDING_TOOLTIP'
      default:
        return 'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.DEFAULT_TOOLTIP'
    }
  }
}


```

## Folder: angular-accelerator/src/lib/components/data-sort-base (1 files)

### File: angular-accelerator/src/lib/components/data-sort-base/data-sort-base.ts

```ts

import { TranslateService } from '@ngx-translate/core'
import { Observable, map, of } from 'rxjs'
import { flattenObject } from '../../functions/flatten-object'
import { ColumnType } from '../../model/column-type.model'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { ListGridData } from '../../components/data-list-grid/data-list-grid.component'
import { Row } from '../../components/data-table/data-table.component'
import { ObjectUtils } from '../../utils/objectutils'
import { Filter, FilterType } from '../../model/filter.model'

type RowListGridData = ListGridData | Row

export class DataSortBase {
  constructor(
    protected locale: string,
    protected translateService: TranslateService
  ) {}

  translateItems(
    [items, filters, sortColumn, sortDirection]: [RowListGridData[], Filter[], string, DataSortDirection],
    columns: DataTableColumn[],
    clientSideFiltering: boolean,
    clientSideSorting: boolean
  ): Observable<[RowListGridData[], Filter[], string, DataSortDirection, Record<string, Record<string, string>>]> {
    if (clientSideFiltering || clientSideSorting) {
      let translationKeys: string[] = []
      const translatedColumns = columns.filter((c) => c.columnType === ColumnType.TRANSLATION_KEY)
      translatedColumns.forEach((c) => {
        translationKeys = [
          ...translationKeys,
          ...items.map((i) => ObjectUtils.resolveFieldData(i, c.id)?.toString()).filter((v) => !!v),
        ]
      })
      if (translationKeys.length) {
        return this.translateService.get(translationKeys).pipe(
          map((translatedValues: Record<string, string>) => {
            const translations: Record<string, Record<string, string>> = {}
            translatedColumns.forEach((c) => {
              translations[c.id] = Object.fromEntries(
                items.map((i) => [
                  ObjectUtils.resolveFieldData(i, c.id)?.toString() || '',
                  translatedValues[ObjectUtils.resolveFieldData(i, c.id)?.toString()],
                ])
              )
            })
            return [items, filters, sortColumn, sortDirection, translations]
          })
        )
      }
    }
    return of([items, filters, sortColumn, sortDirection, {}])
  }

  filterItems(
    [items, filters, sortColumn, sortDirection, translations]: [
      RowListGridData[],
      Filter[],
      string,
      DataSortDirection,
      Record<string, Record<string, string>>,
    ],
    clientSideFiltering: boolean
  ): [RowListGridData[], Filter[], string, DataSortDirection, Record<string, Record<string, string>>] {
    if (!clientSideFiltering) {
      return [items, filters, sortColumn, sortDirection, translations]
    }
    return [
      items.filter((item) =>
        filters
          .map((filter) => filter.columnId)
          .filter((value, index, self) => self.indexOf(value) === index && value != null)
          .every((filterColumnId) =>
            filters
              .filter((filter) => filter.columnId === filterColumnId)
              .some((filter) => {
                const value = (
                  translations[filter.columnId]?.[ObjectUtils.resolveFieldData(item, filter.columnId)?.toString()] ||
                  ObjectUtils.resolveFieldData(item, filter.columnId)
                )?.toString()
                switch (filter.filterType) {
                  case undefined:
                  case FilterType.EQUALS:
                    return value === String(filter.value)
                  case FilterType.IS_NOT_EMPTY: {
                    return filter.value ? !!value : !value
                  }
                  default:
                    return true
                }
              })
          )
      ),
      filters,
      sortColumn,
      sortDirection,
      translations,
    ]
  }

  sortItems(
    [items, filters, sortColumn, sortDirection, translations]: [
      RowListGridData[],
      Filter[],
      string,
      DataSortDirection,
      Record<string, Record<string, string>>,
    ],
    columns: DataTableColumn[],
    clientSideSorting: boolean
  ): [RowListGridData[], Filter[], string, DataSortDirection, Record<string, Record<string, string>>] {
    if (!clientSideSorting || sortColumn === '') {
      return [items, filters, sortColumn, sortDirection, translations]
    }
    const column = columns.find((h) => h.id === sortColumn)
    let colValues: Record<string, string>
    if (column?.columnType === ColumnType.DATE || column?.columnType === ColumnType.RELATIVE_DATE) {
      colValues = Object.fromEntries(
        items.map((i) => [
          ObjectUtils.resolveFieldData(i, sortColumn) as Date,
          ObjectUtils.resolveFieldData(i, sortColumn) as Date,
        ])
      )
    } else {
      colValues = Object.fromEntries(
        items.map((i) => [
          ObjectUtils.resolveFieldData(i, sortColumn)?.toString(),
          ObjectUtils.resolveFieldData(i, sortColumn)?.toString(),
        ])
      )
    }
    if (column?.columnType === ColumnType.TRANSLATION_KEY) {
      colValues = translations[sortColumn]
    }
    return [
      [...items].sort(this.createCompareFunction(colValues, sortColumn, sortDirection)),
      filters,
      sortColumn,
      sortDirection,
      translations,
    ]
  }

  flattenItems(items: RowListGridData[]) {
    return items.map((i) => flattenObject(i))
  }

  createCompareFunction(
    translatedColValues: Record<string, string>,
    sortColumn: string,
    sortDirection: DataSortDirection
  ): (a: Record<string, any>, b: Record<string, any>) => number {
    let direction = 0
    if (sortDirection === DataSortDirection.ASCENDING) {
      direction = 1
    } else if (sortDirection === DataSortDirection.DESCENDING) {
      direction = -1
    }
    return (data1, data2) => {
      if (direction === 0) {
        return 0
      }
      let result
      const value1 = translatedColValues[ObjectUtils.resolveFieldData(data1, sortColumn)]
      const value2 = translatedColValues[ObjectUtils.resolveFieldData(data2, sortColumn)]

      if (value1 == null && value2 != null) result = -1
      else if (value1 != null && value2 == null) result = 1
      else if (value1 == null && value2 == null) result = 0
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2, [this.locale, 'en', 'de'], { numeric: true })
      else {
        if (value1 < value2) {
          result = -1
        } else if (value1 > value2) {
          result = 1
        } else {
          result = 0
        }
      }
      return direction * result
    }
  }
}


```

## Folder: angular-accelerator/src/lib/components/data-table (4 files)

### File: angular-accelerator/src/lib/components/data-table/data-table.component.html

```html

<ng-template #actionColumn let-rowObject="localRowObject">
  @if (anyRowActionObserved || this.additionalActions.length > 0 || ((this.overflowActions$ | async) ?? []).length > 0)
  {
  <td
    class="actions"
    pFrozenColumn
    [frozen]="frozenActionColumn"
    [alignFrozen]="actionColumnPosition"
    [attr.name]="actionColumnPosition === 'left' ? 'action-column-left' : 'action-column-right'"
    [ngClass]="(frozenActionColumn && actionColumnPosition === 'left') ? 'border-right-1' : (frozenActionColumn && actionColumnPosition === 'right') ? 'border-left-1' : ''"
  >
    <div class="icon-button-row-wrapper">
      @if (viewTableRowObserved && (!viewActionVisibleField || fieldIsTruthy(rowObject, viewActionVisibleField))) {
      <button
        id="{{resolveFieldData(rowObject, 'id')}}-viewButton"
        *ocxIfPermission="viewPermission"
        [disabled]="!!viewActionEnabledField && !fieldIsTruthy(rowObject, viewActionEnabledField)"
        pButton
        class="p-button-rounded p-button-text viewTableRowButton"
        title="{{ 'OCX_DATA_TABLE.ACTIONS.VIEW' | translate }}"
        [attr.aria-label]="'OCX_DATA_TABLE.ACTIONS.VIEW' | translate"
        icon="pi pi-eye"
        (click)="onViewRow(rowObject)"
        [attr.name]="'data-table-action-button'"
      ></button>
      } @if (editTableRowObserved && (!editActionVisibleField || fieldIsTruthy(rowObject, editActionVisibleField))) {
      <button
        id="{{resolveFieldData(rowObject, 'id')}}-editButton"
        *ocxIfPermission="editPermission"
        [disabled]="!!editActionEnabledField && !fieldIsTruthy(rowObject, editActionEnabledField)"
        pButton
        class="p-button-rounded p-button-text editTableRowButton"
        title="{{ 'OCX_DATA_TABLE.ACTIONS.EDIT' | translate }}"
        [attr.aria-label]="'OCX_DATA_TABLE.ACTIONS.EDIT' | translate"
        icon="pi pi-pencil"
        (click)="onEditRow(rowObject)"
        [attr.name]="'data-table-action-button'"
      ></button>
      } @if (deleteTableRowObserved && (!deleteActionVisibleField || fieldIsTruthy(rowObject,
      deleteActionVisibleField))) {
      <button
        id="{{resolveFieldData(rowObject, 'id')}}-deleteButton"
        *ocxIfPermission="deletePermission"
        [disabled]="!!deleteActionEnabledField && !fieldIsTruthy(rowObject, deleteActionEnabledField)"
        pButton
        class="p-button-rounded p-button-text p-button-danger deleteTableRowButton"
        title="{{ 'OCX_DATA_TABLE.ACTIONS.DELETE' | translate }}"
        [attr.aria-label]="'OCX_DATA_TABLE.ACTIONS.DELETE' | translate"
        icon="pi pi-trash"
        (click)="onDeleteRow(rowObject)"
        [attr.name]="'data-table-action-button'"
      ></button>
      } @for (action of inlineActions$ | async; track action) { @if ((!action.actionVisibleField ||
      fieldIsTruthy(rowObject, action.actionVisibleField))) {
      <button
        id="{{resolveFieldData(rowObject, 'id')}}-{{action.id ? action.id.concat('ActionButton') : 'inlineActionButton'}}"
        *ocxIfPermission="action.permission"
        pButton
        class="p-button-rounded p-button-text"
        [ngClass]="action.classes"
        [icon]="action.icon || ''"
        (click)="action.callback(rowObject)"
        [title]="action.labelKey ? (action.labelKey | translate) : ''"
        [attr.aria-label]="action.labelKey ? (action.labelKey | translate) : ''"
        [disabled]="action.disabled || (!!action.actionEnabledField && !fieldIsTruthy(rowObject, action.actionEnabledField))"
        [attr.name]="'data-table-action-button'"
      ></button>
      } } @if (hasVisibleOverflowMenuItems(rowObject) | async) {
      <p-menu #menu [model]="(overflowMenuItems$ | async) || []" [popup]="true" appendTo="body"></p-menu>
      <button
        pButton
        class="p-button-rounded p-button-text"
        [icon]="'pi pi-ellipsis-v'"
        (click)="toggleOverflowMenu($event, menu, rowObject)"
        [attr.aria-label]="'OCX_DATA_TABLE.MORE_ACTIONS' | translate"
        [title]="'OCX_DATA_TABLE.MORE_ACTIONS' | translate"
        [name]="'data-table-overflow-action-button'"
      ></button>
      }
    </div>
  </td>
  }
</ng-template>

<ng-template #actionColumnHeader>
  @if (anyRowActionObserved || this.additionalActions.length > 0 || ((this.overflowActions$ | async) ?? []).length > 0)
  {
  <th
    pFrozenColumn
    [frozen]="frozenActionColumn"
    [alignFrozen]="actionColumnPosition"
    [ngClass]="(frozenActionColumn && actionColumnPosition === 'left') ? 'border-right-1' : (frozenActionColumn && actionColumnPosition === 'right') ? 'border-left-1' : ''"
    [attr.name]="actionColumnPosition === 'left' ? 'action-column-header-left' : 'action-column-header-right'"
  >
    {{ 'OCX_DATA_TABLE.ACTIONS_COLUMN_NAME' | translate }}
  </th>
  }
</ng-template>

@if ((displayedPageSize$ | async); as displayedPageSize) { @if ((columnTemplates$ | async) ?? {}; as columnTemplates) {
<p-table
  [value]="(displayedRows$ | async) ?? []"
  responsiveLayout="scroll"
  [paginator]="paginator"
  [first]="page * displayedPageSize"
  (onPage)="onPageChange($event)"
  [rows]="displayedPageSize"
  [showCurrentPageReport]="true"
  currentPageReportTemplate="{{ (totalRecordsOnServer ? currentPageShowingWithTotalOnServerKey : currentPageShowingKey) | translate:params }}"
  [rowsPerPageOptions]="this.pageSizes ?? []"
  id="dataTable_{{name}}"
  (selectionChange)="onSelectionChange($event)"
  dataKey="id"
  [rowTrackBy]="rowTrackByFunction"
  [selection]="(selectedRows$ | async) ?? []"
  [scrollable]="true"
  scrollHeight="flex"
  [style]="tableStyle"
  paginatorDropdownAppendTo="body"
  [rowSelectable]="rowSelectable"
  tableStyleClass="h-full"
>
  <ng-template #header>
    <tr style="vertical-align: top">
      @if (selectionChangedObserved) {
      <th style="width: 4rem" scope="col">
        @if (allowSelectAll) {
        <p-tableHeaderCheckbox
          pTooltip="{{'OCX_DATA_TABLE.SELECT_ALL_TOOLTIP' | translate}}"
          ariaLabel="{{'OCX_DATA_TABLE.SELECT_ALL_ARIA_LABEL' | translate}}"
        ></p-tableHeaderCheckbox>
        }
      </th>
      } @if (actionColumnPosition === 'left';) {
      <ng-container *ngTemplateOutlet="actionColumnHeader"></ng-container>
      } @for (column of columns; track column) { @if (column.sortable || column.filterable) {
      <th scope="col">
        <div
          class="table-header-wrapper flex flex-column justify-content-between align-items-start"
          style="height: 100%"
        >
          <span class="flex" id="{{column.id}}-header-name">{{ column.nameKey | translate }}</span>
          <span class="flex icon-button-header-wrapper">
            @if (column.sortable) {
            <button
              class="pi sortButton pl-0"
              [class.pi-sort-alt]="(column?.id === sortColumn && sortDirection === 'NONE') || column?.id !== sortColumn"
              [class.pi-sort-amount-up]="column?.id === sortColumn && sortDirection === 'ASCENDING'"
              [class.pi-sort-amount-down]="column?.id === sortColumn && sortDirection === 'DESCENDING'"
              (click)="onSortColumnClick(column.id)"
              [pTooltip]="sortIconTitle(column.id) | translate "
              tooltipPosition="bottom"
              [attr.aria-label]="('OCX_DATA_TABLE.TOGGLE_BUTTON.ARIA_LABEL' | translate: { column: (column.nameKey | translate), direction: (sortDirectionToTitle(columnNextSortDirection(column.id)) | translate)})"
            ></button>
            } @if (currentEqualFilterOptions$ | async; as equalFilterOptions) { @if (columnFilterTemplates$ | async; as
            columnFilterTemplates) { @if (column.filterable && (!column.filterType || column.filterType ===
            FilterType.EQUALS)) {
            <p-multiselect
              class="filterMultiSelect"
              [options]="equalFilterOptions.column?.id === column.id ? equalFilterOptions.options : []"
              [ngModel]="(currentEqualSelectedFilters$ | async) || []"
              [showToggleAll]="true"
              emptyFilterMessage="{{ 'OCX_DATA_TABLE.EMPTY_FILTER_MESSAGE' | translate }}"
              [displaySelectedLabel]="false"
              [resetFilterOnHide]="true"
              (onChange)="onMultiselectFilterChange(column, $event)"
              placeholder=" "
              appendTo="body"
              filterBy="toFilterBy"
              (onFocus)="onFilterChosen(column)"
              [title]="'OCX_DATA_TABLE.FILTER_TITLE' | translate"
              [ariaLabel]="'OCX_DATA_TABLE.COLUMN_FILTER_ARIA_LABEL' | translate"
              [ariaFilterLabel]="('OCX_DATA_TABLE.FILTER_ARIA_LABEL' | translate: { column: column.nameKey | translate})"
            >
              <ng-template #selecteditems let-value>
                <div
                  class="pi"
                  [class.pi-filter]="!((filterAmounts$ | async) || {})[column.id]"
                  [class.pi-filter-fill]="((filterAmounts$ | async) || {})[column.id] > 0"
                ></div>
              </ng-template>
              <ng-template #item let-value>
                @if (columnFilterTemplates[column.id]; as template) {
                <ng-container
                  [ngTemplateOutlet]="template"
                  [ngTemplateOutletContext]="{
                      rowObject: getRowObjectFromMultiselectItem(value, column),
                      column: column
                  }"
                >
                </ng-container>
                }
              </ng-template>
            </p-multiselect>
            } } } @if (column.filterable && column.filterType === FilterType.IS_NOT_EMPTY) {
            <p-multiselect
              class="filterMultiSelect"
              [options]="truthyFilterOptions"
              [ngModel]="(currentTruthySelectedFilters$ | async) || []"
              [showToggleAll]="true"
              emptyFilterMessage="{{ 'OCX_DATA_TABLE.EMPTY_FILTER_MESSAGE' | translate }}"
              [displaySelectedLabel]="false"
              [resetFilterOnHide]="true"
              (onChange)="onMultiselectFilterChange(column, $event)"
              placeholder=" "
              appendTo="body"
              (onFocus)="onFilterChosen(column)"
              [title]="'OCX_DATA_TABLE.FILTER_TITLE' | translate"
              [ariaLabel]="'OCX_DATA_TABLE.COLUMN_FILTER_ARIA_LABEL' | translate"
              [ariaFilterLabel]="('OCX_DATA_TABLE.FILTER_ARIA_LABEL' | translate: { column: column.nameKey | translate})"
            >
              <ng-template #selecteditems let-value>
                <div
                  class="pi"
                  [class.pi-filter]="!((filterAmounts$ | async) || {})[column.id]"
                  [class.pi-filter-fill]="((filterAmounts$ | async) || {})[column.id] > 0"
                ></div>
              </ng-template>
              <ng-template #item let-value> {{value.key | translate}} </ng-template>
            </p-multiselect>
            }
          </span>
        </div>
      </th>
      } @else {
      <th scope="col">{{ column.nameKey | translate }}</th>
      } } @if (actionColumnPosition === 'right';) {
      <ng-container *ngTemplateOutlet="actionColumnHeader"></ng-container>
      }
    </tr>
  </ng-template>
  <ng-template #body let-rowObject>
    @if (columnTemplates) {
    <tr>
      @if (selectionChangedObserved) {
      <td>
        @if (isRowSelectionDisabled(rowObject) && isSelected(rowObject)) {
        <p-checkbox
          [(ngModel)]="checked"
          [binary]="true"
          [disabled]="true"
          [ariaLabel]="'OCX_DATA_TABLE.SELECT_ARIA_LABEL' | translate: { key: rowObject.id}"
        ></p-checkbox>
        } @else {
        <p-tableCheckbox
          [value]="rowObject"
          [disabled]="isRowSelectionDisabled(rowObject)"
          [ariaLabel]="'OCX_DATA_TABLE.SELECT_ARIA_LABEL' | translate: { key: rowObject.id}"
        ></p-tableCheckbox>
        }
      </td>
      } @if (actionColumnPosition === 'left';) {
      <ng-container *ngTemplateOutlet="actionColumn; context: {localRowObject: rowObject}"></ng-container>
      } @for (column of columns; track column) {
      <td>
        @defer(on viewport){ @if (columnTemplates[column.id]) {
        <ng-container
          [ngTemplateOutlet]="
                _cell ? _cell: columnTemplates[column.id]
              "
          [ngTemplateOutletContext]="{
                  rowObject: rowObject,
                  column: column,
              }"
        >
        </ng-container>
        } } @placeholder {
        <p-skeleton width="3rem" />
        }
      </td>
      } @if (actionColumnPosition === 'right';) {
      <ng-container *ngTemplateOutlet="actionColumn; context: {localRowObject: rowObject}"></ng-container>
      }
    </tr>
    }
  </ng-template>
  <ng-template #emptymessage>
    <tr>
      <!-- If allowSelectAll is set to true, an additional column for checkbox selection is added and
       the colSpan needs to be increased by one so that the row is rendered the whole width of the table. -->
      <td
        [colSpan]="columns.length + ((anyRowActionObserved || this.additionalActions.length > 0) ? 1 : 0) +
  (allowSelectAll ? 1 : 0)"
      >
        {{ emptyResultsMessage || ("OCX_DATA_TABLE.EMPTY_RESULT" | translate) }}
      </td>
    </tr>
  </ng-template>
</p-table>
} }

<ng-template pTemplate="defaultStringCell" let-rowObject="rowObject" let-column="column">
  <ng-container> {{ resolveFieldData(rowObject, column.id)}} </ng-container>
</ng-template>

<ng-template pTemplate="defaultNumberCell" let-rowObject="rowObject" let-column="column">
  <ng-container> {{ resolveFieldData(rowObject, column.id) | number }} </ng-container>
</ng-template>

<ng-template pTemplate="defaultDateCell" let-rowObject="rowObject" let-column="column">
  <ng-container> {{ resolveFieldData(rowObject, column.id) | date: column.dateFormat ?? 'medium' }} </ng-container>
</ng-template>

<ng-template pTemplate="defaultRelativeDateCell" let-rowObject="rowObject" let-column="column">
  <ng-container>
    {{ 'OCX_DATA_TABLE.EDITED' | translate }} {{ resolveFieldData(rowObject, column.id) | timeago }}
  </ng-container>
</ng-template>

<ng-template pTemplate="defaultTranslationKeyCell" let-rowObject="rowObject" let-column="column">
  <ng-container> {{ resolveFieldData(rowObject, column.id) | translate }} </ng-container>
</ng-template>


```

### File: angular-accelerator/src/lib/components/data-table/data-table.component.spec.ts

```ts

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { provideUserServiceMock, UserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { PTableCheckboxHarness } from '@onecx/angular-testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DataTableHarness } from '../../../../testing'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { ColumnType } from '../../model/column-type.model'
import { DataTableComponent, Row } from './data-table.component'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { UserService } from '@onecx/angular-integration-interface'

describe('DataTableComponent', () => {
  let fixture: ComponentFixture<DataTableComponent>
  let component: DataTableComponent
  let translateService: TranslateService
  let dataTable: DataTableHarness
  let unselectedCheckBoxes: PTableCheckboxHarness[]
  let selectedCheckBoxes: PTableCheckboxHarness[]

  const ENGLISH_LANGUAGE = 'en'
  const ENGLISH_TRANSLATIONS = {
    OCX_DATA_TABLE: {
      SHOWING: '{{first}} - {{last}} of {{totalRecords}}',
      SHOWING_WITH_TOTAL_ON_SERVER: '{{first}} - {{last}} of {{totalRecords}} ({{totalRecordsOnServer}})',
    },
  }

  const GERMAN_LANGUAGE = 'de'
  const GERMAN_TRANSLATIONS = {
    OCX_DATA_TABLE: {
      SHOWING: '{{first}} - {{last}} von {{totalRecords}}',
      SHOWING_WITH_TOTAL_ON_SERVER: '{{first}} - {{last}} von {{totalRecords}} ({{totalRecordsOnServer}})',
    },
  }

  const TRANSLATIONS = {
    [ENGLISH_LANGUAGE]: ENGLISH_TRANSLATIONS,
    [GERMAN_LANGUAGE]: GERMAN_TRANSLATIONS,
  }

  const mockData = [
    {
      version: 0,
      creationDate: '2023-09-12T09:34:11.997048Z',
      creationUser: 'creation user',
      modificationDate: '2023-09-12T09:34:11.997048Z',
      modificationUser: '',
      id: '195ee34e-41c6-47b7-8fc4-3f245dee7651',
      name: 'some name',
      description: '',
      status: 'some status',
      responsible: 'someone responsible',
      endDate: '2023-09-14T09:34:09Z',
      startDate: '2023-09-13T09:34:05Z',
      imagePath: '/path/to/image',
      testNumber: '1',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:33:58.544494Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:33:58.544494Z',
      modificationUser: '',
      id: '5f8bb05b-d089-485e-a234-0bb6ff25234e',
      name: 'example',
      description: 'example description',
      status: 'status example',
      responsible: '',
      endDate: '2023-09-13T09:33:55Z',
      startDate: '2023-09-12T09:33:53Z',
      imagePath: '',
      testNumber: '3.141',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 1',
      description: '',
      status: 'status name 1',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '123456789',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: '734e21ba-14d7-4565-ba0d-ddd25f807931',
      name: 'name 2',
      description: '',
      status: 'status name 2',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '12345.6789',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: '02220a5a-b556-4d7a-ac6e-6416911a00f2',
      name: 'name 3',
      description: '',
      status: 'status name 3',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '7.1',
    },
  ]
  const mockColumns = [
    {
      columnType: ColumnType.STRING,
      id: 'name',
      nameKey: 'COLUMN_HEADER_NAME.NAME',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'description',
      nameKey: 'COLUMN_HEADER_NAME.DESCRIPTION',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'startDate',
      nameKey: 'COLUMN_HEADER_NAME.START_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'endDate',
      nameKey: 'COLUMN_HEADER_NAME.END_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.TRANSLATION_KEY,
      id: 'status',
      nameKey: 'COLUMN_HEADER_NAME.STATUS',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'responsible',
      nameKey: 'COLUMN_HEADER_NAME.RESPONSIBLE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.RELATIVE_DATE,
      id: 'modificationDate',
      nameKey: 'COLUMN_HEADER_NAME.MODIFICATION_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'creationUser',
      nameKey: 'COLUMN_HEADER_NAME.CREATION_USER',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.NUMBER,
      id: 'testNumber',
      nameKey: 'COLUMN_HEADER_NAME.TEST_NUMBER',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
  ]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataTableComponent],
      imports: [
        AngularAcceleratorPrimeNgModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        TranslateTestingModule.withTranslations(TRANSLATIONS),
        AngularAcceleratorModule,
      ],
      providers: [
        provideUserServiceMock(),
        {
          provide: HAS_PERMISSION_CHECKER,
          useExisting: UserService,
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DataTableComponent)
    component = fixture.componentInstance
    component.rows = mockData
    component.columns = mockColumns
    component.paginator = true
    translateService = TestBed.inject(TranslateService)
    translateService.use('en')
    const userServiceMock = TestBed.inject(UserServiceMock)
    userServiceMock.permissionsTopic$.publish(['VIEW', 'EDIT', 'DELETE'])
    fixture.detectChanges()
    dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
  })

  it('should create the data table component', () => {
    expect(component).toBeTruthy()
  })

  it('loads dataTableHarness', async () => {
    const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
    expect(dataTable).toBeTruthy()
  })

  describe('should display the paginator currentPageReport -', () => {
    it('de', async () => {
      translateService.use('de')
      const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
      const paginator = await dataTable.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 von 5')
    })

    it('en', async () => {
      translateService.use('en')
      const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
      const paginator = await dataTable.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 of 5')
    })
  })

  describe('should display the paginator currentPageReport  with totalRecordsOnServer -', () => {
    it('de', async () => {
      component.totalRecordsOnServer = 10
      translateService.use('de')
      const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
      const paginator = await dataTable.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 von 5 (10)')
    })

    it('en', async () => {
      component.totalRecordsOnServer = 10
      translateService.use('en')
      const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
      const paginator = await dataTable.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 of 5 (10)')
    })
  })

  it('should display the paginator rowsPerPageOptions', async () => {
    const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
    const paginator = await dataTable.getPaginator()
    const rowsPerPageOptions = await paginator.getRowsPerPageOptions()
    const rowsPerPageOptionsText = await rowsPerPageOptions.selectedSelectItemText(0)
    expect(rowsPerPageOptionsText).toEqual('10')
  })

  it('should display 10 rows by default for 1000 rows', async () => {
    component.rows = Array.from(Array(1000).keys()).map((number) => {
      return {
        id: number,
        name: number,
      }
    })
    component.columns = [
      {
        columnType: ColumnType.NUMBER,
        id: 'name',
        nameKey: 'COLUMN_HEADER_NAME.NAME',
      },
    ]
    component.paginator = true
    fixture.detectChanges()

    const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
    const rows = await dataTable.getRows()
    expect(rows.length).toBe(10)
  })

  describe('Table row selection', () => {
    it('should initially show a table without selection checkboxes', async () => {
      expect(dataTable).toBeTruthy()
      expect(await dataTable.rowSelectionIsEnabled()).toEqual(false)
    })

    it('should show a table with selection checkboxes if the parent binds to the event emitter', async () => {
      expect(await dataTable.rowSelectionIsEnabled()).toEqual(false)
      component.selectionChanged.subscribe()
      expect(await dataTable.rowSelectionIsEnabled()).toEqual(true)
    })

    it('should pre-select rows given through selectedRows input', async () => {
      component.selectionChanged.subscribe()

      unselectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('unchecked')
      selectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('checked')
      expect(unselectedCheckBoxes.length).toBe(5)
      expect(selectedCheckBoxes.length).toBe(0)
      component.selectedRows = mockData.slice(0, 2)

      unselectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('unchecked')
      selectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('checked')
      expect(selectedCheckBoxes.length).toBe(2)
      expect(unselectedCheckBoxes.length).toBe(3)
    })

    it('should emit all selected elements when checkbox is clicked', async () => {
      let selectionChangedEvent: Row[] | undefined

      component.selectionChanged.subscribe((event) => (selectionChangedEvent = event))
      unselectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('unchecked')
      selectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('checked')
      expect(unselectedCheckBoxes.length).toBe(5)
      expect(selectedCheckBoxes.length).toBe(0)
      expect(selectionChangedEvent).toBeUndefined()

      const firstRowCheckBox = unselectedCheckBoxes[0]
      await firstRowCheckBox.checkBox()
      unselectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('unchecked')
      selectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('checked')
      expect(unselectedCheckBoxes.length).toBe(4)
      expect(selectedCheckBoxes.length).toBe(1)
      expect(selectionChangedEvent).toEqual([mockData[0]])
    })

    it('should not change selection if selection disabled', async () => {
      let selectionChangedEvent: Row[] | undefined

      component.selectionEnabledField = 'selectionEnabled'

      component.rows = mockData.map((m) => ({
        ...m,
        selectionEnabled: false,
      }))

      component.selectionChanged.subscribe((event) => (selectionChangedEvent = event))
      unselectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('unchecked')
      selectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('checked')
      expect(unselectedCheckBoxes.length).toBe(5)
      expect(selectedCheckBoxes.length).toBe(0)
      expect(selectionChangedEvent).toBeUndefined()

      const firstRowCheckBox = unselectedCheckBoxes[0]
      await firstRowCheckBox.checkBox()
      unselectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('unchecked')
      selectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('checked')
      expect(unselectedCheckBoxes.length).toBe(5)
      expect(selectedCheckBoxes.length).toBe(0)
    })
  })

  describe('Frozen action column', () => {
    it('should render an unpinnend action column on the right side of the table by default', async () => {
      component.viewTableRow.subscribe((event) => console.log(event))

      expect(component.frozenActionColumn).toBe(false)
      expect(component.actionColumnPosition).toBe('right')
      expect(await dataTable.getActionColumnHeader('left')).toBe(null)
      expect(await dataTable.getActionColumn('left')).toBe(null)

      const rightActionColumnHeader = await dataTable.getActionColumnHeader('right')
      const rightActionColumn = await dataTable.getActionColumn('right')
      expect(rightActionColumnHeader).toBeTruthy()
      expect(rightActionColumn).toBeTruthy()
      expect(await dataTable.columnIsFrozen(rightActionColumnHeader)).toBe(false)
      expect(await dataTable.columnIsFrozen(rightActionColumn)).toBe(false)
    })

    it('should render a pinned action column on the specified side of the table', async () => {
      component.viewTableRow.subscribe((event) => console.log(event))

      component.frozenActionColumn = true
      component.actionColumnPosition = 'left'

      expect(await dataTable.getActionColumnHeader('right')).toBe(null)
      expect(await dataTable.getActionColumn('right')).toBe(null)

      const leftActionColumnHeader = await dataTable.getActionColumnHeader('left')
      const leftActionColumn = await dataTable.getActionColumn('left')
      expect(leftActionColumnHeader).toBeTruthy()
      expect(leftActionColumn).toBeTruthy()
      expect(await dataTable.columnIsFrozen(leftActionColumnHeader)).toBe(true)
      expect(await dataTable.columnIsFrozen(leftActionColumn)).toBe(true)
    })
  })

  const setUpActionButtonMockData = async () => {
    component.columns = [
      ...mockColumns,
      {
        columnType: ColumnType.STRING,
        id: 'ready',
        nameKey: 'Ready',
      },
    ]

    component.rows = [
      {
        version: 0,
        creationDate: '2023-09-12T09:34:27.184086Z',
        creationUser: '',
        modificationDate: '2023-09-12T09:34:27.184086Z',
        modificationUser: '',
        id: 'bd7962b8-4887-420e-bb27-36978ebf10ab',
        name: 'name 3',
        description: '',
        status: 'status name 3',
        responsible: '',
        endDate: '2023-09-15T09:34:24Z',
        startDate: '2023-09-14T09:34:22Z',
        imagePath: '',
        testNumber: '7.1',
        ready: false,
      },
    ]
    component.viewTableRow.subscribe(() => console.log())
    component.editTableRow.subscribe(() => console.log())
    component.deleteTableRow.subscribe(() => console.log())
    component.viewPermission = 'VIEW'
    component.editPermission = 'EDIT'
    component.deletePermission = 'DELETE'

    fixture.detectChanges()
    await fixture.whenStable()
  }

  describe('Disable action buttons based on field path', () => {
    it('should not disable any action button by default', async () => {
      expect(component.viewTableRowObserved).toBe(false)
      expect(component.editTableRowObserved).toBe(false)
      expect(component.deleteTableRowObserved).toBe(false)

      await setUpActionButtonMockData()

      expect(component.viewTableRowObserved).toBe(true)
      expect(component.editTableRowObserved).toBe(true)
      expect(component.deleteTableRowObserved).toBe(true)

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(3)
      const expectedIcons = ['pi pi-eye', 'pi pi-trash', 'pi pi-pencil']

      for (const action of tableActions) {
        expect(await action.matchesSelector('.p-button:disabled')).toBe(false)
        const icon = await action.getAttribute('icon')
        if (icon) {
          const index = expectedIcons.indexOf(icon)
          expect(index).toBeGreaterThanOrEqual(0)
          expectedIcons.splice(index, 1)
        }
      }

      expect(expectedIcons.length).toBe(0)
    })

    it('should dynamically enable/disable an action button based on the contents of a specified column', async () => {
      await setUpActionButtonMockData()
      component.viewActionEnabledField = 'ready'

      let tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(3)

      for (const action of tableActions) {
        const icon = await action.getAttribute('icon')
        const isDisabled = await dataTable.actionButtonIsDisabled(action)
        if (icon === 'pi pi-eye') {
          expect(isDisabled).toBe(true)
        } else {
          expect(isDisabled).toBe(false)
        }
      }

      const tempRows = [...component.rows]

      tempRows[0]['ready'] = true

      component.rows = [...tempRows]

      tableActions = await dataTable.getActionButtons()

      for (const action of tableActions) {
        expect(await dataTable.actionButtonIsDisabled(action)).toBe(false)
      }
    })
  })

  describe('Hide action buttons based on field path', () => {
    it('should not hide any action button by default', async () => {
      expect(component.viewTableRowObserved).toBe(false)
      expect(component.editTableRowObserved).toBe(false)
      expect(component.deleteTableRowObserved).toBe(false)

      await setUpActionButtonMockData()

      expect(component.viewTableRowObserved).toBe(true)
      expect(component.editTableRowObserved).toBe(true)
      expect(component.deleteTableRowObserved).toBe(true)

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(3)
      const expectedIcons = ['pi pi-eye', 'pi pi-trash', 'pi pi-pencil']

      for (const action of tableActions) {
        const icon = await action.getAttribute('icon')
        if (icon) {
          const index = expectedIcons.indexOf(icon)
          expect(index).toBeGreaterThanOrEqual(0)
          expectedIcons.splice(index, 1)
        }
      }

      expect(expectedIcons.length).toBe(0)
    })

    it('should dynamically hide/show an action button based on the contents of a specified column', async () => {
      await setUpActionButtonMockData()
      component.viewActionVisibleField = 'ready'

      let tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(2)

      for (const action of tableActions) {
        const icon = await action.getAttribute('icon')
        expect(icon === 'pi pi-eye').toBe(false)
      }

      const tempRows = [...component.rows]

      tempRows[0]['ready'] = true

      component.rows = [...tempRows]

      fixture.detectChanges()
      await fixture.whenStable()

      tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(3)
      const expectedIcons = ['pi pi-eye', 'pi pi-trash', 'pi pi-pencil']

      for (const action of tableActions) {
        const icon = await action.getAttribute('icon')
        if (icon) {
          const index = expectedIcons.indexOf(icon)
          expect(index).toBeGreaterThanOrEqual(0)
          expectedIcons.splice(index, 1)
        }
      }

      expect(expectedIcons.length).toBe(0)
    })
  })

  describe('Assign ids to action buttons', () => {
    beforeEach(() => {
      component.rows = [
        {
          version: 0,
          creationDate: '2023-09-12T09:34:27.184086Z',
          creationUser: '',
          modificationDate: '2023-09-12T09:34:27.184086Z',
          modificationUser: '',
          id: 'rowId',
          name: 'name 3',
          description: '',
          status: 'status name 3',
          responsible: '',
          endDate: '2023-09-15T09:34:24Z',
          startDate: '2023-09-14T09:34:22Z',
          imagePath: '',
          testNumber: '7.1',
          ready: false,
        },
      ]
    })

    it('should assign id to view button', async () => {
      component.viewTableRow.subscribe(() => console.log())
      component.viewPermission = 'VIEW'
      fixture.detectChanges()
      await fixture.whenStable()

      expect(component.viewTableRowObserved).toBe(true)

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-viewButton')
    })

    it('should assign id to edit button', async () => {
      component.editTableRow.subscribe(() => console.log())
      component.editPermission = 'EDIT'
      fixture.detectChanges()
      await fixture.whenStable()

      expect(component.editTableRowObserved).toBe(true)

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-editButton')
    })

    it('should assign id to delete button', async () => {
      component.deleteTableRow.subscribe(() => console.log())
      component.deletePermission = 'DELETE'
      fixture.detectChanges()
      await fixture.whenStable()

      expect(component.deleteTableRowObserved).toBe(true)

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-deleteButton')
    })

    it('should assign id to additional action button', async () => {
      component.additionalActions = [
        {
          permission: 'VIEW',
          callback: () => {
            console.log('custom action clicked')
          },
          id: 'actionId',
        },
      ]
      fixture.detectChanges()
      await fixture.whenStable()

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-actionIdActionButton')
    })
  })

  describe('permissions for action buttons', () => {
    let userService: UserServiceMock
    beforeEach(() => {
      component.rows = [
        {
          version: 0,
          creationDate: '2023-09-12T09:34:27.184086Z',
          creationUser: '',
          modificationDate: '2023-09-12T09:34:27.184086Z',
          modificationUser: '',
          id: 'rowId',
          name: 'name 3',
          description: '',
          status: 'status name 3',
          responsible: '',
          endDate: '2023-09-15T09:34:24Z',
          startDate: '2023-09-14T09:34:22Z',
          imagePath: '',
          testNumber: '7.1',
          ready: false,
        },
      ]

      // Show actions
      component.viewTableRow.subscribe(() => console.log())
      component.editTableRow.subscribe(() => console.log())
      component.deleteTableRow.subscribe(() => console.log())
      component.viewPermission = 'TABLE#VIEW'
      component.editPermission = 'TABLE#EDIT'
      component.deletePermission = 'TABLE#DELETE'
      component.additionalActions = []

      userService = TestBed.inject(UserService) as unknown as UserServiceMock
    })

    it('should show view, delete and edit action buttons when user has VIEW, EDIT and DELETE permissions', async () => {
      userService.permissionsTopic$.publish(['TABLE#VIEW', 'TABLE#EDIT', 'TABLE#DELETE'])

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(3)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-viewButton')
      expect(await tableActions[1].getAttribute('id')).toEqual('rowId-editButton')
      expect(await tableActions[2].getAttribute('id')).toEqual('rowId-deleteButton')

      userService.permissionsTopic$.publish([])

      const newTableActions = await dataTable.getActionButtons()
      expect(newTableActions.length).toBe(0)
    })

    it('should show custom inline actions if user has permission', async () => {
      userService.permissionsTopic$.publish(['ADDITIONAL#VIEW'])

      component.additionalActions = [
        {
          permission: 'ADDITIONAL#VIEW',
          callback: () => {
            console.log('custom action clicked')
          },
          id: 'actionId',
        },
      ]

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-actionIdActionButton')

      userService.permissionsTopic$.publish([])

      const newTableActions = await dataTable.getActionButtons()
      expect(newTableActions.length).toBe(0)
    })

    it('should show overflow menu when user has permission for at least one action', async () => {
      userService.permissionsTopic$.publish(['OVERFLOW#VIEW'])

      component.additionalActions = [
        {
          permission: 'OVERFLOW#VIEW',
          callback: () => {
            console.log('custom action clicked')
          },
          id: 'actionId',
          labelKey: 'Label',
          showAsOverflow: true,
        },
      ]

      await (await dataTable.getOverflowActionMenuButton())?.click()
      const overflowMenu = await dataTable.getOverflowMenu()
      expect(overflowMenu).toBeTruthy()

      const menuItems = await overflowMenu!.getAllMenuItems()
      expect(menuItems!.length).toBe(1)
      const menuItemText = await menuItems![0].getText()
      expect(menuItemText).toBe('Label')

      userService.permissionsTopic$.publish([])
      const newMenuItems = await overflowMenu!.getAllMenuItems()
      expect(newMenuItems!.length).toBe(0)
    })

    it('should display action buttons based on multiple permissions', async () => {
      userService.permissionsTopic$.publish(['ADDITIONAL#VIEW1', 'ADDITIONAL#VIEW2', 'OVERFLOW#VIEW', 'OVERFLOW#VIEW2'])

      component.additionalActions = [
        {
          permission: ['ADDITIONAL#VIEW1', 'ADDITIONAL#VIEW2'],
          callback: () => {
            console.log('custom action clicked')
          },
          id: 'actionId',
        },
        {
          permission: ['OVERFLOW#VIEW', 'OVERFLOW#VIEW2'],
          callback: () => {
            console.log('custom action clicked')
          },
          id: 'actionId',
          labelKey: 'Label',
          showAsOverflow: true,
        },
      ]

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-actionIdActionButton')

      await (await dataTable.getOverflowActionMenuButton())?.click()
      const overflowMenu = await dataTable.getOverflowMenu()
      expect(overflowMenu).toBeTruthy()

      const menuItems = await overflowMenu!.getAllMenuItems()
      expect(menuItems!.length).toBe(1)
      const menuItemText = await menuItems![0].getText()
      expect(menuItemText).toBe('Label')
    })
  })
})


```

### File: angular-accelerator/src/lib/components/data-table/data-table.component.stories.ts

```ts

import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { LOCALE_ID, importProvidersFrom, inject, provideAppInitializer } from '@angular/core'
import { Meta, moduleMetadata, applicationConfig, StoryFn } from '@storybook/angular'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { MultiSelectModule } from 'primeng/multiselect'
import { UserService } from '@onecx/angular-integration-interface'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { DataTableComponent } from './data-table.component'
import { StorybookTranslateModule } from './../../storybook-translate.module'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { ColumnType } from '../../model/column-type.model'
import { MenuModule } from 'primeng/menu'
import { DynamicLocaleId } from '../../utils/dynamic-locale-id'
import { CheckboxModule } from 'primeng/checkbox'
import { FormsModule } from '@angular/forms'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { TooltipModule } from 'primeng/tooltip'
import { SkeletonModule } from 'primeng/skeleton'

type DataTableInputTypes = Pick<DataTableComponent, 'rows' | 'columns' | 'emptyResultsMessage' | 'selectedRows'>

const DataTableComponentSBConfig: Meta<DataTableComponent> = {
  title: 'Components/DataTableComponent',
  component: DataTableComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        provideUserServiceMock(),
        { provide: HAS_PERMISSION_CHECKER, useExisting: UserServiceMock },
        {
          provide: LOCALE_ID,
          useClass: DynamicLocaleId,
          deps: [UserService],
        },
        importProvidersFrom(StorybookThemeModule),
        provideAppInitializer(() => {
          const userServiceMock = inject(UserService) as unknown as UserServiceMock
          userServiceMock.permissionsTopic$.publish([
            'TEST_MGMT#TEST_DELETE',
            'TEST_MGMT#TEST_EDIT',
            'TEST_MGMT#TEST_VIEW',
          ])
        }),
      ],
    }),
    moduleMetadata({
      declarations: [DataTableComponent, IfPermissionDirective],
      imports: [
        TableModule,
        ButtonModule,
        MultiSelectModule,
        StorybookTranslateModule,
        MenuModule,
        CheckboxModule,
        FormsModule,
        TooltipModule,
        SkeletonModule,
      ],
    }),
  ],
}
const Template: StoryFn = (args) => ({
  props: args,
})

const dataTableActionsArgTypes = {
  deleteTableRow: { action: 'deleteTableRow' },
  editTableRow: { action: 'editTableRow' },
  viewTableRow: { action: 'viewTableRow' },
}

const dataTableSelectionArgTypes = {
  selectionChanged: { action: 'selectionChanged' },
  componentStateChanged: { action: 'componentStateChanged' },
}

const defaultComponentArgs: DataTableInputTypes = {
  columns: [
    {
      id: 'product',
      columnType: ColumnType.STRING,
      nameKey: 'Product',
      sortable: false,
    },
    {
      id: 'amount',
      columnType: ColumnType.NUMBER,
      nameKey: 'Amount',
      sortable: true,
      filterable: true,
    },
    {
      id: 'available',
      columnType: ColumnType.STRING,
      nameKey: 'Available',
      sortable: false,
      filterable: true,
    },
    {
      id: 'expiration',
      columnType: ColumnType.DATE,
      nameKey: 'Expiration Date',
      sortable: true,
    },
  ],
  rows: [
    {
      id: 1,
      product: 'Apples',
      amount: 2,
      available: false,
      expiration: new Date(2021, 5, 4),
    },
    {
      id: 2,
      product: 'Bananas',
      amount: 10,
      available: true,
      expiration: new Date(2021, 6, 4),
    },
    {
      id: 3,
      product: 'Strawberries',
      amount: 5,
      available: false,
      expiration: new Date(2021, 7, 4),
    },
  ],
  emptyResultsMessage: 'No results',
  selectedRows: [],
}

export const WithMockData = {
  render: Template,
  args: defaultComponentArgs,
}

export const NoData = {
  render: Template,
  args: {
    ...defaultComponentArgs,
    rows: [],
  },
}

export const WithRowSelection = {
  argTypes: dataTableSelectionArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
  },
}

export const WithRowSelectionAndDefaultSelection = {
  argTypes: dataTableSelectionArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    selectedRows: [
      {
        id: 1,
      },
    ],
  },
}

export const WithRowSelectionAndDisabledDefaultSelection = {
  argTypes: dataTableSelectionArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    selectedRows: [1],
    selectionEnabledField: 'available',
  },
}

const extendedComponentArgs: DataTableInputTypes = {
  columns: [
    {
      id: '1',
      columnType: ColumnType.STRING,
      nameKey: 'Column 1',
    },
    {
      id: '2',
      columnType: ColumnType.STRING,
      nameKey: 'Column 2',
    },
    {
      id: '3',
      columnType: ColumnType.STRING,
      nameKey: 'Column 3',
    },
    {
      id: '4',
      columnType: ColumnType.STRING,
      nameKey: 'Column 4',
    },
    {
      id: '5',
      columnType: ColumnType.STRING,
      nameKey: 'Column 5',
    },
    {
      id: '6',
      columnType: ColumnType.STRING,
      nameKey: 'Column 6',
    },
    {
      id: '7',
      columnType: ColumnType.STRING,
      nameKey: 'Column 7',
    },
    {
      id: '8',
      columnType: ColumnType.STRING,
      nameKey: 'Column 8',
    },
    {
      id: '9',
      columnType: ColumnType.STRING,
      nameKey: 'Column 9',
    },
    {
      id: '10',
      columnType: ColumnType.STRING,
      nameKey: 'Column 10',
    },
    {
      id: '11',
      columnType: ColumnType.STRING,
      nameKey: 'Column 11',
    },
    {
      id: '12',
      columnType: ColumnType.STRING,
      nameKey: 'Column 12',
    },
  ],
  rows: [
    {
      id: 1,
      1: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      2: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      3: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      4: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      5: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      6: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      7: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      8: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      9: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      10: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      11: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      12: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
    },
  ],
  emptyResultsMessage: 'No results',
  selectedRows: [],
}

export const ResponsiveWithScroll = {
  render: Template,
  args: extendedComponentArgs,
}

export const ResponsiveWithScrollAndFrozenActionsColumn = {
  argTypes: dataTableActionsArgTypes,
  render: Template,
  args: {
    ...extendedComponentArgs,
    deletePermission: 'TEST_MGMT#TEST_DELETE',
    editPermission: 'TEST_MGMT#TEST_EDIT',
    viewPermission: 'TEST_MGMT#TEST_VIEW',
    frozenActionColumn: true,
    actionColumnPosition: 'left',
  },
}

export const WithConditionallyDisabledActionButtons = {
  argTypes: dataTableActionsArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    deleteActionEnabledField: 'available',
    editActionEnabledField: 'available',
    deletePermission: 'TEST_MGMT#TEST_DELETE',
    editPermission: 'TEST_MGMT#TEST_EDIT',
    viewPermission: 'TEST_MGMT#TEST_VIEW',
  },
}

export const WithConditionallyHiddenActionButtons = {
  argTypes: dataTableActionsArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
    deletePermission: 'TEST_MGMT#TEST_DELETE',
    editPermission: 'TEST_MGMT#TEST_EDIT',
    viewPermission: 'TEST_MGMT#TEST_VIEW',
  },
}

export const WithAdditionalActions = {
  argTypes: dataTableActionsArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
    deletePermission: 'TEST_MGMT#TEST_DELETE',
    editPermission: 'TEST_MGMT#TEST_EDIT',
    viewPermission: 'TEST_MGMT#TEST_VIEW',
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
      },
    ],
  },
}

export const WithConditionallyEnabledAdditionalActions = {
  argTypes: dataTableActionsArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
    deletePermission: 'TEST_MGMT#TEST_DELETE',
    editPermission: 'TEST_MGMT#TEST_EDIT',
    viewPermission: 'TEST_MGMT#TEST_VIEW',
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        actionEnabledField: 'available',
      },
    ],
  },
}

export const WithConditionallyVisibleAdditionalActions = {
  argTypes: dataTableActionsArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
    deletePermission: 'TEST_MGMT#TEST_DELETE',
    editPermission: 'TEST_MGMT#TEST_EDIT',
    viewPermission: 'TEST_MGMT#TEST_VIEW',
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        actionVisibleField: 'available',
      },
    ],
  },
}

export const WithAdditionalOverflowActions = {
  argTypes: dataTableActionsArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    deletePermission: 'TEST_MGMT#TEST_DELETE',
    editPermission: 'TEST_MGMT#TEST_EDIT',
    viewPermission: 'TEST_MGMT#TEST_VIEW',
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional Action',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
      },
      {
        id: '2',
        labelKey: 'Conditionally Hidden',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionVisibleField: 'available',
      },
      {
        id: '3',
        labelKey: 'Conditionally Enabled',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionEnabledField: 'available',
      },
    ],
  },
}

export const WithOnlyOverflowActions = {
  render: Template,
  args: {
    ...defaultComponentArgs,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional Action',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
      },
      {
        id: '2',
        labelKey: 'Conditionally Hidden',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionVisibleField: 'available',
      },
      {
        id: '3',
        labelKey: 'Conditionally Enabled',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionEnabledField: 'available',
      },
    ],
  },
}

export const WithPageSizes = {
  render: Template,
  args: {
    ...defaultComponentArgs,
    pageSizes: [2, 15, 25],
    showAllOption: false,
  },
}

export default DataTableComponentSBConfig


```

### File: angular-accelerator/src/lib/components/data-table/data-table.component.ts

```ts

import { formatDate } from '@angular/common'
import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Injector,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChildren,
  inject,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { isValidDate } from '@onecx/accelerator'
import { UserService } from '@onecx/angular-integration-interface'
import { MenuItem, PrimeTemplate, SelectItem } from 'primeng/api'
import { Menu } from 'primeng/menu'
import { MultiSelectItem } from 'primeng/multiselect'
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  filter,
  first,
  map,
  mergeMap,
  of,
  shareReplay,
  switchMap,
  withLatestFrom,
} from 'rxjs'
import { ColumnType } from '../../model/column-type.model'
import { DataAction } from '../../model/data-action'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { Filter, FilterType } from '../../model/filter.model'
import { ObjectUtils } from '../../utils/objectutils'
import { findTemplate } from '../../utils/template.utils'
import { DataSortBase } from '../data-sort-base/data-sort-base'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'

export type Primitive = number | string | boolean | bigint | Date
export type Row = {
  id: string | number
  [columnId: string]: unknown
}

export enum TemplateType {
  CELL = 'CELL',
  FILTERCELL = 'FILTERCELL',
}

interface TemplatesData {
  templatesObservables: Record<string, Observable<TemplateRef<any> | null>>
  idSuffix: Array<string>
  templateNames: Record<ColumnType, Array<string>>
}

export type Sort = { sortColumn: string; sortDirection: DataSortDirection }

export interface DataTableComponentState {
  filters?: Filter[]
  sorting?: Sort
  selectedRows?: Row[]
  activePage?: number
  pageSize?: number
}

@Component({
  standalone: false,
  selector: 'ocx-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent extends DataSortBase implements OnInit, AfterContentInit {
  private readonly router = inject(Router)
  private readonly injector = inject(Injector)
  private readonly userService = inject(UserService)
  private readonly hasPermissionChecker = inject(HAS_PERMISSION_CHECKER, { optional: true })

  FilterType = FilterType
  TemplateType = TemplateType
  checked = true
  _rows$ = new BehaviorSubject<Row[]>([])
  @Input()
  get rows(): Row[] {
    return this._rows$.getValue()
  }
  set rows(value: Row[]) {
    !this._rows$.getValue().length
    this._rows$.next(value)
  }
  _selectionIds$ = new BehaviorSubject<(string | number)[]>([])
  @Input()
  set selectedRows(value: Row[] | string[] | number[]) {
    this._selectionIds$.next(
      value.map((row) => {
        if (typeof row === 'object') {
          return row.id
        }
        return row
      })
    )
  }

  _filters$ = new BehaviorSubject<Filter[]>([])
  @Input()
  get filters(): Filter[] {
    return this._filters$.getValue()
  }
  set filters(value: Filter[]) {
    !this._filters$.getValue().length
    this._filters$.next(value)
  }
  _sortDirection$ = new BehaviorSubject<DataSortDirection>(DataSortDirection.NONE)
  @Input()
  get sortDirection(): DataSortDirection {
    return this._sortDirection$.getValue()
  }
  set sortDirection(value: DataSortDirection) {
    this._sortDirection$.next(value)
  }
  _sortColumn$ = new BehaviorSubject<string>('')
  @Input()
  get sortColumn(): string {
    return this?._sortColumn$.getValue()
  }
  set sortColumn(value: string) {
    this?._sortColumn$.next(value)
  }
  columnTemplates$: Observable<Record<string, TemplateRef<any> | null>> | undefined
  columnFilterTemplates$: Observable<Record<string, TemplateRef<any> | null>> | undefined
  _columns$ = new BehaviorSubject<DataTableColumn[]>([])
  @Input()
  get columns(): DataTableColumn[] {
    return this._columns$.getValue()
  }
  set columns(value: DataTableColumn[]) {
    this._columns$.next(value)
    const obs = value.map((c) => this.getTemplate(c, TemplateType.CELL))
    const filterObs = value.map((c) => this.getTemplate(c, TemplateType.FILTERCELL))
    this.columnTemplates$ = combineLatest(obs).pipe(
      map((values) => Object.fromEntries(value.map((c, i) => [c.id, values[i]]))),
      debounceTime(50)
    )
    this.columnFilterTemplates$ = combineLatest(filterObs).pipe(
      map((values) => Object.fromEntries(value.map((c, i) => [c.id, values[i]])))
    )
  }
  @Input() clientSideFiltering = true
  @Input() clientSideSorting = true
  @Input() sortStates: DataSortDirection[] = [DataSortDirection.ASCENDING, DataSortDirection.DESCENDING]

  _pageSizes$ = new BehaviorSubject<number[]>([10, 25, 50])
  @Input()
  get pageSizes(): number[] {
    return this._pageSizes$.getValue()
  }
  set pageSizes(value: number[]) {
    this._pageSizes$.next(value)
  }
  displayedPageSize$: Observable<number>
  _pageSize$ = new BehaviorSubject<number | undefined>(undefined)
  @Input()
  get pageSize(): number | undefined {
    return this._pageSize$.getValue()
  }
  set pageSize(value: number | undefined) {
    this._pageSize$.next(value)
  }

  @Input() emptyResultsMessage: string | undefined
  @Input() name = ''
  @Input() deletePermission: string | string[] | undefined
  @Input() viewPermission: string | string[] | undefined
  @Input() editPermission: string | string[] | undefined
  @Input() deleteActionVisibleField: string | undefined
  @Input() deleteActionEnabledField: string | undefined
  @Input() viewActionVisibleField: string | undefined
  @Input() viewActionEnabledField: string | undefined
  @Input() editActionVisibleField: string | undefined
  @Input() editActionEnabledField: string | undefined
  @Input() selectionEnabledField: string | undefined
  @Input() allowSelectAll = true
  @Input() paginator = true

  _page$ = new BehaviorSubject<number>(0)
  @Input()
  get page(): number {
    return this._page$.getValue()
  }
  set page(value: number) {
    this._page$.next(value)
  }

  @Input() tableStyle: { [klass: string]: any } | undefined
  @Input()
  get totalRecordsOnServer(): number | undefined {
    return this.params['totalRecordsOnServer'] ? Number(this.params['totalRecordsOnServer']) : undefined
  }
  set totalRecordsOnServer(value: number | undefined) {
    this.params['totalRecordsOnServer'] = value?.toString() ?? '0'
  }
  @Input() currentPageShowingKey = 'OCX_DATA_TABLE.SHOWING'
  @Input() currentPageShowingWithTotalOnServerKey = 'OCX_DATA_TABLE.SHOWING_WITH_TOTAL_ON_SERVER'
  params: { [key: string]: string } = {
    currentPage: '{currentPage}',
    totalPages: '{totalPages}',
    rows: '{rows}',
    first: '{first}',
    last: '{last}',
    totalRecords: '{totalRecords}',
  }

  @Input() stringCellTemplate: TemplateRef<any> | undefined
  @ContentChild('stringCell') stringCellChildTemplate: TemplateRef<any> | undefined
  get _stringCell(): TemplateRef<any> | undefined {
    return this.stringCellTemplate || this.stringCellChildTemplate
  }

  @Input() numberCellTemplate: TemplateRef<any> | undefined
  @ContentChild('numberCell') numberCellChildTemplate: TemplateRef<any> | undefined
  get _numberCell(): TemplateRef<any> | undefined {
    return this.numberCellTemplate || this.numberCellChildTemplate
  }

  @Input() dateCellTemplate: TemplateRef<any> | undefined
  @ContentChild('dateCell') dateCellChildTemplate: TemplateRef<any> | undefined
  get _dateCell(): TemplateRef<any> | undefined {
    return this.dateCellTemplate || this.dateCellChildTemplate
  }

  @Input() relativeDateCellTemplate: TemplateRef<any> | undefined
  @ContentChild('relativeDateCell') relativeDateCellChildTemplate: TemplateRef<any> | undefined
  get _relativeDateCell(): TemplateRef<any> | undefined {
    return this.relativeDateCellTemplate || this.relativeDateCellChildTemplate
  }

  @Input() cellTemplate: TemplateRef<any> | undefined
  @ContentChild('cell') cellChildTemplate: TemplateRef<any> | undefined
  get _cell(): TemplateRef<any> | undefined {
    return this.cellTemplate || this.cellChildTemplate
  }
  @Input() translationKeyCellTemplate: TemplateRef<any> | undefined
  @ContentChild('translationKeyCell') translationKeyCellChildTemplate: TemplateRef<any> | undefined
  get _translationKeyCell(): TemplateRef<any> | undefined {
    return this.translationKeyCellTemplate || this.translationKeyCellChildTemplate
  }
  @Input() stringFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('stringFilterCell') stringFilterCellChildTemplate: TemplateRef<any> | undefined
  get _stringFilterCell(): TemplateRef<any> | undefined {
    return this.stringFilterCellTemplate || this.stringFilterCellChildTemplate
  }
  @Input() numberFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('numberFilterCell') numberFilterCellChildTemplate: TemplateRef<any> | undefined
  get _numberFilterCell(): TemplateRef<any> | undefined {
    return this.numberFilterCellTemplate || this.numberFilterCellChildTemplate
  }
  @Input() dateFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('dateFilterCell') dateFilterCellChildTemplate: TemplateRef<any> | undefined
  get _dateFilterCell(): TemplateRef<any> | undefined {
    return this.dateFilterCellTemplate || this.dateFilterCellChildTemplate
  }
  @Input() relativeDateFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('relativeDateFilterCell') relativeDateFilterCellChildTemplate: TemplateRef<any> | undefined
  get _relativeDateFilterCell(): TemplateRef<any> | undefined {
    return this.relativeDateFilterCellTemplate || this.relativeDateFilterCellChildTemplate
  }
  @Input() filterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('filterCell') filterCellChildTemplate: TemplateRef<any> | undefined
  get _filterCell(): TemplateRef<any> | undefined {
    return this.filterCellTemplate || this.filterCellChildTemplate
  }
  @Input() translationKeyFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('translationKeyFilterCell') translationKeyFilterCellChildTemplate: TemplateRef<any> | undefined
  get _translationKeyFilterCell(): TemplateRef<any> | undefined {
    return this.translationKeyFilterCellTemplate || this.translationKeyFilterCellChildTemplate
  }

  _additionalActions$ = new BehaviorSubject<DataAction[]>([])
  @Input()
  get additionalActions(): DataAction[] {
    return this._additionalActions$.getValue()
  }
  set additionalActions(value: DataAction[]) {
    this._additionalActions$.next(value)
  }
  @Input() frozenActionColumn = false
  @Input() actionColumnPosition: 'left' | 'right' = 'right'

  @Output() filtered = new EventEmitter<Filter[]>()
  @Output() sorted = new EventEmitter<Sort>()
  @Output() viewTableRow = new EventEmitter<Row>()
  @Output() editTableRow = new EventEmitter<Row>()
  @Output() deleteTableRow = new EventEmitter<Row>()
  @Output() selectionChanged = new EventEmitter<Row[]>()
  @Output() pageChanged = new EventEmitter<number>()
  @Output() pageSizeChanged = new EventEmitter<number>()
  @Output() componentStateChanged = new EventEmitter<DataTableComponentState>()

  displayedRows$: Observable<unknown[]> | undefined
  selectedRows$: Observable<unknown[]> | undefined

  currentFilterColumn$ = new BehaviorSubject<DataTableColumn | null>(null)
  currentEqualFilterOptions$: Observable<{ options: SelectItem[]; column: DataTableColumn | undefined }> | undefined
  currentEqualSelectedFilters$: Observable<unknown[]> | undefined
  truthyFilterOptions = [
    {
      key: 'OCX_DATA_TABLE.FILTER_YES',
      value: true,
    },
    {
      key: 'OCX_DATA_TABLE.FILTER_NO',
      value: false,
    },
  ]
  currentTruthySelectedFilters$: Observable<unknown[]> | undefined
  filterAmounts$: Observable<Record<string, number>> | undefined

  overflowActions$: Observable<DataAction[]>
  inlineActions$: Observable<DataAction[]>
  overflowMenuItems$: Observable<MenuItem[]>
  currentMenuRow$ = new BehaviorSubject<Row | null>(null)

  templates$: BehaviorSubject<QueryList<PrimeTemplate> | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | undefined
  >(undefined)
  @ContentChildren(PrimeTemplate)
  set templates(value: QueryList<PrimeTemplate> | undefined) {
    this.templates$.next(value)
  }

  viewTemplates$: BehaviorSubject<QueryList<PrimeTemplate> | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | undefined
  >(undefined)
  @ViewChildren(PrimeTemplate)
  set viewTemplates(value: QueryList<PrimeTemplate> | undefined) {
    this.viewTemplates$.next(value)
  }

  parentTemplates$: BehaviorSubject<QueryList<PrimeTemplate> | null | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | null | undefined
  >(undefined)
  @Input()
  set parentTemplates(value: QueryList<PrimeTemplate> | null | undefined) {
    this.parentTemplates$.next(value)
  }

  get viewTableRowObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.viewItemObserved || dv?.viewItem.observed || this.viewTableRow.observed
  }
  get editTableRowObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.editItemObserved || dv?.editItem.observed || this.editTableRow.observed
  }
  get deleteTableRowObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.deleteItemObserved || dv?.deleteItem.observed || this.deleteTableRow.observed
  }
  get anyRowActionObserved(): boolean {
    return this.viewTableRowObserved || this.editTableRowObserved || this.deleteTableRowObserved
  }

  get selectionChangedObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.selectionChangedObserved || dv?.selectionChanged.observed || this.selectionChanged.observed
  }

  templatesObservables: Record<string, Observable<TemplateRef<any> | null>> = {}

  private cachedOverflowActions$: Observable<DataAction[]>
  private cachedOverflowMenuItemsVisibility$: Observable<boolean> | undefined

  constructor() {
    const locale = inject(LOCALE_ID)
    const translateService = inject(TranslateService)

    super(locale, translateService)
    this.name = this.name || this.router.url.replace(/[^A-Za-z0-9]/, '_')
    this.displayedPageSize$ = combineLatest([this._pageSize$, this._pageSizes$]).pipe(
      map(([pageSize, pageSizes]) => pageSize ?? pageSizes.find((val): val is number => typeof val === 'number') ?? 50)
    )
    this.overflowActions$ = this._additionalActions$.pipe(
      map((actions) => actions.filter((action) => action.showAsOverflow))
    )
    this.inlineActions$ = this._additionalActions$.pipe(
      map((actions) => actions.filter((action) => !action.showAsOverflow))
    )
    this.overflowMenuItems$ = combineLatest([this.overflowActions$, this.currentMenuRow$]).pipe(
      switchMap(([actions, row]) =>
        this.filterActionsBasedOnPermissions(actions).pipe(
          map((permittedActions) => ({ actions: permittedActions, row: row }))
        )
      ),
      mergeMap(({ actions, row }) => {
        if (actions.length === 0) {
          return of([])
        }

        return this.translateService.get([...actions.map((a) => a.labelKey || '')]).pipe(
          map((translations) => {
            return actions.map((a) => ({
              label: translations[a.labelKey || ''],
              icon: a.icon,
              styleClass: (a.classes || []).join(' '),
              disabled: a.disabled || (!!a.actionEnabledField && !this.fieldIsTruthy(row, a.actionEnabledField)),
              visible: !a.actionVisibleField || this.fieldIsTruthy(row, a.actionVisibleField),
              command: () => a.callback(row),
            }))
          })
        )
      })
    )

    this.rowSelectable = this.rowSelectable.bind(this)

    this.cachedOverflowActions$ = this.overflowActions$.pipe(
      shareReplay(1) // Cache the last emitted value
    )
  }

  ngOnInit(): void {
    this.displayedRows$ = combineLatest([this._rows$, this._filters$, this._sortColumn$, this._sortDirection$]).pipe(
      mergeMap((params) => this.translateItems(params, this.columns, this.clientSideFiltering, this.clientSideSorting)),
      map((params) => this.filterItems(params, this.clientSideFiltering)),
      map((params) => this.sortItems(params, this.columns, this.clientSideSorting)),
      map(([rows]) => this.flattenItems(rows))
    )
    this.currentTruthySelectedFilters$ = combineLatest([this._filters$, this.currentFilterColumn$]).pipe(
      map(([filters, currentFilterColumn]) => {
        return filters
          .filter(
            (filter) =>
              filter.columnId === currentFilterColumn?.id && currentFilterColumn.filterType === FilterType.IS_NOT_EMPTY
          )
          .map((filter) => filter.value)
      })
    )
    this.currentEqualSelectedFilters$ = combineLatest([this._filters$, this.currentFilterColumn$]).pipe(
      map(([filters, currentFilterColumn]) => {
        return filters
          .filter(
            (filter) =>
              filter.columnId === currentFilterColumn?.id &&
              (!currentFilterColumn.filterType || currentFilterColumn.filterType === FilterType.EQUALS)
          )
          .map((filter) => filter.value)
      })
    )
    this.currentEqualFilterOptions$ = combineLatest([this._rows$, this.currentFilterColumn$, this._filters$]).pipe(
      filter(
        ([_, currentFilterColumn, __]) =>
          !currentFilterColumn?.filterType || currentFilterColumn.filterType === FilterType.EQUALS
      ),
      mergeMap(([rows, currentFilterColumn, filters]) => {
        if (!currentFilterColumn?.id) {
          return of({ options: [], column: undefined })
        }

        const currentFilters = filters
          .filter(
            (filter) =>
              filter.columnId === currentFilterColumn?.id &&
              (!currentFilterColumn.filterType || currentFilterColumn.filterType === FilterType.EQUALS)
          )
          .map((filter) => filter.value)

        const columnValues = rows
          .map((row) => row[currentFilterColumn?.id])
          .filter((value) => value !== null && value !== undefined && value !== '')

        if (currentFilterColumn.columnType === ColumnType.DATE) {
          return of({
            options: columnValues.map(
              (c) =>
                ({
                  label: c,
                  value: c,
                  toFilterBy: formatDate(`${c}`, currentFilterColumn.dateFormat ?? 'medium', this.locale),
                }) as SelectItem
            ),
            column: currentFilterColumn,
          })
        }

        const translateObservable =
          this.columns.find((c) => c.id === currentFilterColumn?.id)?.columnType === ColumnType.TRANSLATION_KEY
            ? this.translateColumnValues(columnValues as string[])
            : of(Object.fromEntries(columnValues.map((cv) => [cv, cv])))
        return translateObservable.pipe(
          map((translatedValues) => {
            return Object.values(translatedValues)
              .concat(currentFilters)
              .filter((value, index, self) => self.indexOf(value) === index && value !== null && value !== '')
              .map(
                (filterOption) =>
                  ({
                    label: filterOption,
                    value: filterOption,
                    toFilterBy: filterOption,
                  }) as SelectItem
              )
          }),
          map((options) => {
            return {
              options: options,
              column: currentFilterColumn,
            }
          })
        )
      })
    )
    this.filterAmounts$ = this._filters$.pipe(
      map((filters) =>
        filters
          .map((filter) => filter.columnId)
          .map((columnId) => [columnId, filters.filter((filter) => filter.columnId === columnId).length])
      ),
      map((amounts) => Object.fromEntries(amounts))
    )
    this.mapSelectionToRows()
    this.emitComponentStateChanged()
  }

  translateColumnValues(columnValues: string[]): Observable<any> {
    return columnValues.length ? this.translateService.get(columnValues as string[]) : of({})
  }

  emitComponentStateChanged(state: DataTableComponentState = {}) {
    this.displayedPageSize$
      .pipe(withLatestFrom(this._selectionIds$, this._rows$), first())
      .subscribe(([pageSize, selectedIds, rows]) => {
        this.componentStateChanged.emit({
          filters: this.filters,
          sorting: {
            sortColumn: this.sortColumn,
            sortDirection: this.sortDirection,
          },
          pageSize,
          activePage: this.page,
          selectedRows: rows.filter((row) => selectedIds.includes(row.id)),
          ...state,
        })
      })
  }

  ngAfterContentInit() {
    this.templates$.value?.forEach((item) => {
      switch (item.getType()) {
        case 'stringCell':
          this.stringCellChildTemplate = item.template
          break
        case 'numberCell':
          this.numberCellChildTemplate = item.template
          break
        case 'dateCell':
          this.dateCellChildTemplate = item.template
          break
        case 'relativeDateCell':
          this.relativeDateCellChildTemplate = item.template
          break
        case 'cellTemplate':
          this.cellChildTemplate = item.template
          break
        case 'translationKeyCell':
          this.translationKeyCellChildTemplate = item.template
          break
        case 'stringFilterCell':
          this.stringFilterCellChildTemplate = item.template
          break
        case 'numberFilterCell':
          this.numberFilterCellChildTemplate = item.template
          break
        case 'dateFilterCell':
          this.dateFilterCellChildTemplate = item.template
          break
        case 'relativeDateFilterCell':
          this.relativeDateFilterCellChildTemplate = item.template
          break
        case 'filterCellTemplate':
          this.filterCellChildTemplate = item.template
          break
        case 'translationKeyFilterCell':
          this.translationKeyFilterCellChildTemplate = item.template
          break
      }
    })
  }

  onSortColumnClick(sortColumn: string) {
    const newSortDirection = this.columnNextSortDirection(sortColumn)

    this._sortColumn$.next(sortColumn)
    this._sortDirection$.next(newSortDirection)

    this.sorted.emit({ sortColumn: sortColumn, sortDirection: newSortDirection })
    this.emitComponentStateChanged({
      sorting: {
        sortColumn: sortColumn,
        sortDirection: newSortDirection,
      },
    })
  }

  columnNextSortDirection(sortColumn: string) {
    return sortColumn !== this.sortColumn
      ? this.sortStates[0]
      : this.sortStates[(this.sortStates.indexOf(this.sortDirection) + 1) % this.sortStates.length]
  }

  onDeleteRow(selectedTableRow: Row) {
    this.deleteTableRow.emit(selectedTableRow)
  }

  onViewRow(selectedTableRow: Row) {
    this.viewTableRow.emit(selectedTableRow)
  }

  onEditRow(selectedTableRow: Row) {
    this.editTableRow.emit(selectedTableRow)
  }

  onFilterChosen(column: DataTableColumn) {
    this.currentFilterColumn$.next(column)
  }

  onMultiselectFilterChange(column: DataTableColumn, event: any) {
    const filters = this.filters
      .filter((filter) => filter.columnId !== column.id)
      .concat(
        event.value.map((value: Primitive) => ({
          columnId: column.id,
          value,
          filterType: column.filterType,
        }))
      )
    if (this.clientSideFiltering) {
      this.filters = filters
    }
    this.filtered.emit(filters)
    this.emitComponentStateChanged({
      filters,
    })
    this.resetPage()
  }

  getSelectedFilters(columnId: string): unknown[] | undefined {
    return this.filters.filter((filter) => filter.columnId === columnId).map((filter) => filter.value)
  }

  sortIconTitle(sortColumn: string) {
    return this.sortDirectionToTitle(
      this.columnNextSortDirection(sortColumn)
    )
  }

  sortDirectionToTitle(sortDirection: DataSortDirection) {
    switch (sortDirection) {
      case DataSortDirection.ASCENDING:
        return 'OCX_DATA_TABLE.TOGGLE_BUTTON.ASCENDING_TITLE'
      case DataSortDirection.DESCENDING:
        return 'OCX_DATA_TABLE.TOGGLE_BUTTON.DESCENDING_TITLE'
      default:
        return 'OCX_DATA_TABLE.TOGGLE_BUTTON.DEFAULT_TITLE'
    }
  }

  mapSelectionToRows() {
    // Include _page$ to force fresh array references on page navigation
    // to satisfy PrimeNG DataTable selection tracking, because it needs new object references to detect changes
    this.selectedRows$ = combineLatest([this._selectionIds$, this._rows$, this._page$]).pipe(
      map(([selectedRowIds, rows, _]) => {
        return selectedRowIds
          .map((rowId) => rows.find((r) => r.id === rowId))
          .filter((row): row is Row => row !== undefined)
      })
    )
  }

  isRowSelectionDisabled(rowObject: Row) {
    return !!this.selectionEnabledField && !this.fieldIsTruthy(rowObject, this.selectionEnabledField)
  }

  rowSelectable(event: any) {
    return !this.isRowSelectionDisabled(event.data)
  }

  onSelectionChange(selection: Row[]) {
    let newSelectionIds = selection.map((row) => row.id)
    const rows = this._rows$.getValue()

    if (this.selectionEnabledField) {
      const disabledRowIds = rows.filter((r) => !this.fieldIsTruthy(r, this.selectionEnabledField)).map((row) => row.id)
      if (disabledRowIds.length > 0) {
        newSelectionIds = this.mergeWithDisabledKeys(newSelectionIds, disabledRowIds)
      }
    }

    this._selectionIds$.next(newSelectionIds)
    this.emitSelectionChanged()
    this.emitComponentStateChanged()
  }

  emitSelectionChanged() {
    this.selectionChanged.emit(this._rows$.getValue().filter((row) => this._selectionIds$.getValue().includes(row.id)))
  }

  mergeWithDisabledKeys(newSelectionIds: (string | number)[], disabledRowIds: (string | number)[]) {
    const previousSelectionIds = this._selectionIds$.getValue()
    const previouslySelectedAndDisabled = previousSelectionIds.filter((id) => disabledRowIds.includes(id))
    const disabledAndPreviouslyDeselected = disabledRowIds.filter((id) => !previousSelectionIds.includes(id))
    const updatedSelection = [...newSelectionIds]

    previouslySelectedAndDisabled.forEach((id) => {
      if (!updatedSelection.includes(id)) {
        updatedSelection.push(id)
      }
    })

    disabledAndPreviouslyDeselected.forEach((id) => {
      const index = updatedSelection.indexOf(id)
      if (index > -1) {
        updatedSelection.splice(index, 1)
      }
    })

    return updatedSelection
  }

  isSelected(row: Row) {
    return this._selectionIds$.getValue().includes(row.id)
  }

  onPageChange(event: any) {
    const page = event.first / event.rows
    this.page = page
    this.pageSize = event.rows
    this.pageChanged.emit(page)
    this.pageSizeChanged.emit(event.rows)
    this.emitComponentStateChanged({
      activePage: page,
      pageSize: event.rows,
    })
  }

  resetPage() {
    this.page = 0
    this.pageChanged.emit(this.page)
    this.emitComponentStateChanged()
  }

  fieldIsTruthy(object: any, key: any) {
    return !!ObjectUtils.resolveFieldData(object, key)
  }

  toggleOverflowMenu(event: MouseEvent, menu: Menu, row: Row) {
    this.currentMenuRow$.next(row)
    menu.toggle(event)
  }

  hasVisibleOverflowMenuItems(row: any) {
    return this.overflowActions$.pipe(
      switchMap((actions) => this.filterActionsBasedOnPermissions(actions)),
      map((actions) => actions.some((a) => !a.actionVisibleField || this.fieldIsTruthy(row, a.actionVisibleField)))
    )
  }

  isDate(value: Date | string | number) {
    if (value instanceof Date) {
      return true
    }
    const d = new Date(value)
    return isValidDate(d)
  }

  cellTemplatesData: TemplatesData = {
    templatesObservables: {},
    idSuffix: ['IdTableCell', 'IdCell'],
    templateNames: {
      [ColumnType.DATE]: ['dateCell', 'dateTableCell', 'defaultDateCell'],
      [ColumnType.NUMBER]: ['numberCell', 'numberTableCell', 'defaultNumberCell'],
      [ColumnType.RELATIVE_DATE]: ['relativeDateCell', 'relativeDateTableCell', 'defaultRelativeDateCell'],
      [ColumnType.TRANSLATION_KEY]: ['translationKeyCell', 'translationKeyTableCell', 'defaultTranslationKeyCell'],
      [ColumnType.STRING]: ['stringCell', 'stringTableCell', 'defaultStringCell'],
    },
  }

  filterTemplatesData: TemplatesData = {
    templatesObservables: {},
    idSuffix: ['IdTableFilterCell', 'IdFilterCell', 'IdTableCell', 'IdCell'],
    templateNames: {
      [ColumnType.DATE]: ['dateFilterCell', 'dateTableFilterCell', 'dateCell', 'dateTableCell', 'defaultDateCell'],
      [ColumnType.NUMBER]: [
        'numberFilterCell',
        'numberTableFilterCell',
        'numberCell',
        'numberTableCell',
        'defaultNumberCell',
      ],
      [ColumnType.RELATIVE_DATE]: [
        'relativeDateFilterCell',
        'relativeDateTableFilterCell',
        'relativeDateCell',
        'relativeDateTableCell',
        'defaultRelativeDateCell',
      ],
      [ColumnType.TRANSLATION_KEY]: [
        'translationKeyFilterCell',
        'translationKeyTableFilterCell',
        'defaultTranslationKeyCell',
        'translationKeyCell',
        'translationKeyTableCell',
      ],
      [ColumnType.STRING]: [
        'stringFilterCell',
        'stringTableFilterCell',
        'stringCell',
        'stringTableCell',
        'defaultStringCell',
      ],
    },
  }

  templatesDataMap: Record<TemplateType, TemplatesData> = {
    [TemplateType.CELL]: this.cellTemplatesData,
    [TemplateType.FILTERCELL]: this.filterTemplatesData,
  }

  getColumnTypeTemplate(templates: PrimeTemplate[], columnType: ColumnType, templateType: TemplateType) {
    let template: TemplateRef<any> | undefined

    switch (templateType) {
      case TemplateType.CELL:
        switch (columnType) {
          case ColumnType.DATE:
            template = this._dateCell
            break
          case ColumnType.NUMBER:
            template = this._numberCell
            break
          case ColumnType.RELATIVE_DATE:
            template = this._relativeDateCell
            break
          case ColumnType.TRANSLATION_KEY:
            template = this._translationKeyCell
            break
          default:
            template = this._stringCell
        }
        break
      case TemplateType.FILTERCELL:
        switch (columnType) {
          case ColumnType.DATE:
            template = this._dateFilterCell
            break
          case ColumnType.NUMBER:
            template = this._numberFilterCell
            break
          case ColumnType.RELATIVE_DATE:
            template = this._relativeDateFilterCell
            break
          case ColumnType.TRANSLATION_KEY:
            template = this._translationKeyFilterCell
            break
          default:
            template = this._stringFilterCell
        }
        break
    }

    return (
      template ??
      findTemplate(templates, this.templatesDataMap[templateType].templateNames[columnType])?.template ??
      null
    )
  }

  getTemplate(column: DataTableColumn, templateType: TemplateType): Observable<TemplateRef<any> | null> {
    const templatesData = this.templatesDataMap[templateType]

    if (!templatesData.templatesObservables[column.id]) {
      templatesData.templatesObservables[column.id] = combineLatest([
        this.templates$,
        this.viewTemplates$,
        this.parentTemplates$,
      ]).pipe(
        map(([t, vt, pt]) => {
          const templates = [...(t ?? []), ...(vt ?? []), ...(pt ?? [])]
          const columnTemplate = findTemplate(
            templates,
            templatesData.idSuffix.map((suffix) => column.id + suffix)
          )?.template
          if (columnTemplate) {
            return columnTemplate
          }
          return this.getColumnTypeTemplate(templates, column.columnType, templateType)
        })
      )
    }
    return templatesData.templatesObservables[column.id]
  }

  resolveFieldData(object: any, key: any) {
    return ObjectUtils.resolveFieldData(object, key)
  }

  getRowObjectFromMultiselectItem(value: MultiSelectItem, column: DataTableColumn): Record<string, string | undefined> {
    return {
      [column.id]: value.label,
    }
  }

  rowTrackByFunction = (item: any) => {
    return item.id
  }

  private filterActionsBasedOnPermissions(actions: DataAction[]): Observable<DataAction[]> {
    const getPermissions =
      this.hasPermissionChecker?.getPermissions?.bind(this.hasPermissionChecker) ||
      this.userService.getPermissions.bind(this.userService)

    return getPermissions().pipe(
      map((permissions) => {
        return actions.filter((action) => {
          const actionPermissions = Array.isArray(action.permission) ? action.permission : [action.permission]
          return actionPermissions.every((p) => permissions.includes(p))
        })
      })
    )
  }
}


```

## Folder: angular-accelerator/src/lib/components/data-view (4 files)

### File: angular-accelerator/src/lib/components/data-view/data-view.component.css

```css



```

### File: angular-accelerator/src/lib/components/data-view/data-view.component.html

```html

@if (layout !== 'table') {
<div>
  <ocx-data-list-grid
    #ocxdatalistgrid
    [name]="name"
    [data]="data"
    [columns]="columns"
    [filters]="filters"
    [sortDirection]="sortDirection"
    [sortField]="sortField"
    [sortStates]="sortStates"
    [clientSideFiltering]="clientSideFiltering"
    [clientSideSorting]="clientSideSorting"
    [titleLineId]="titleLineId"
    [subtitleLineIds]="subtitleLineIds"
    [clientSideSorting]="true"
    [pageSizes]="pageSizes"
    [pageSize]="pageSize"
    [paginator]="listGridPaginator"
    [page]="page"
    (pageChanged)="onPageChange($event)"
    (pageSizeChanged)="onPageSizeChange($event)"
    (componentStateChanged)="dataListGridComponentState$.next($event)"
    [emptyResultsMessage]="emptyResultsMessage"
    [layout]="layout"
    [deletePermission]="deletePermission"
    [editPermission]="editPermission"
    [viewPermission]="viewPermission"
    [deleteActionEnabledField]="deleteActionEnabledField"
    [deleteActionVisibleField]="deleteActionVisibleField"
    [editActionEnabledField]="editActionEnabledField"
    [editActionVisibleField]="editActionVisibleField"
    [viewActionEnabledField]="viewActionEnabledField"
    [viewActionVisibleField]="viewActionVisibleField"
    [additionalActions]="additionalActions"
    [gridItemSubtitleLinesTemplate]="_gridItemSubtitleLines ? gridItemSubtitleLines : undefined"
    [listItemSubtitleLinesTemplate]="_listItemSubtitleLines ? listItemSubtitleLines : undefined"
    [listItemTemplate]="_listItem ? listItem : undefined"
    [listValueTemplate]="_listValue ? listValue : undefined"
    [translationKeyListValueTemplate]="_translationKeyListValue ? translationKeyListValue : undefined"
    [numberListValueTemplate]="_numberListValue ? numberListValue : undefined"
    [relativeDateListValueTemplate]="_relativeDateListValue ? relativeDateListValue : undefined"
    [stringListValueTemplate]="_stringListValue ? stringListValue : undefined"
    [dateListValueTemplate]="_dateListValue ? dateListValue : undefined"
    [gridItemTemplate]="_gridItem ? gridItem  : undefined"
    [totalRecordsOnServer]="totalRecordsOnServer"
    [parentTemplates]="templatesForChildren$ | async"
  >
  </ocx-data-list-grid>
  <ng-template #listItemSubtitleLines let-item>
    @if (_listItemSubtitleLines) {
    <ng-container [ngTemplateOutlet]="_listItemSubtitleLines" [ngTemplateOutletContext]="{$implicit:item}">
    </ng-container>
    }</ng-template
  >
  <ng-template #gridItemSubtitleLines let-item>
    @if (_gridItemSubtitleLines) {
    <ng-container [ngTemplateOutlet]="_gridItemSubtitleLines" [ngTemplateOutletContext]="{$implicit:item}">
    </ng-container>
    }</ng-template
  >
  <ng-template #gridItem let-item>
    @if (_gridItem) {
    <ng-container [ngTemplateOutlet]="_gridItem" [ngTemplateOutletContext]="{$implicit:item}"> </ng-container>
    }</ng-template
  >
  <ng-template #listItem let-item>
    @if (_listItem) {
    <ng-container [ngTemplateOutlet]="_listItem" [ngTemplateOutletContext]="{$implicit:item}"> </ng-container>
    }</ng-template
  >
  <ng-template #listValue let-rowObject="rowObject" let-column="column">
    @if (_listValue) {
    <ng-container [ngTemplateOutlet]="_listValue" [ngTemplateOutletContext]="{rowObject: rowObject, column:column}">
    </ng-container>
    }</ng-template
  >
  <ng-template #translationKeyListValue let-rowObject="rowObject" let-column="column">
    @if (_translationKeyListValue) {
    <ng-container
      [ngTemplateOutlet]="_translationKeyListValue"
      [ngTemplateOutletContext]="{rowObject: rowObject, column:column}"
    >
    </ng-container>
    }</ng-template
  >
  <ng-template #numberListValue let-rowObject="rowObject" let-column="column">
    @if (_numberListValue) {
    <ng-container
      [ngTemplateOutlet]="_numberListValue"
      [ngTemplateOutletContext]="{rowObject: rowObject, column:column}"
    >
    </ng-container>
    }</ng-template
  >
  <ng-template #relativeDateListValue let-rowObject="rowObject" let-column="column">
    @if (_relativeDateListValue) {
    <ng-container
      [ngTemplateOutlet]="_relativeDateListValue"
      [ngTemplateOutletContext]="{rowObject: rowObject, column:column}"
    >
    </ng-container>
    }</ng-template
  >
  <ng-template #stringListValue let-rowObject="rowObject" let-column="column">
    @if (_stringListValue) {
    <ng-container
      [ngTemplateOutlet]="_stringListValue"
      [ngTemplateOutletContext]="{rowObject: rowObject, column:column}"
    >
    </ng-container>
    }</ng-template
  >
  <ng-template #dateListValue let-rowObject="rowObject" let-column="column">
    @if (_dateListValue) {
    <ng-container [ngTemplateOutlet]="_dateListValue" [ngTemplateOutletContext]="{rowObject: rowObject, column:column}">
    </ng-container>
    }</ng-template
  >
</div>
} @if (layout === 'table') {
<div>
  <ocx-data-table
    #ocxdatatable
    [rows]="data"
    [columns]="columns"
    [filters]="filters"
    [sortDirection]="sortDirection"
    [sortColumn]="sortField"
    [sortStates]="sortStates"
    [clientSideFiltering]="clientSideFiltering"
    [clientSideSorting]="clientSideSorting"
    [pageSizes]="pageSizes"
    [pageSize]="pageSize"
    [paginator]="tablePaginator"
    [page]="page"
    (pageChanged)="onPageChange($event)"
    (pageSizeChanged)="onPageSizeChange($event)"
    (componentStateChanged)="dataTableComponentState$.next($event)"
    [selectedRows]="selectedRows"
    [frozenActionColumn]="frozenActionColumn"
    [actionColumnPosition]="actionColumnPosition"
    [emptyResultsMessage]="emptyResultsMessage"
    [name]="name"
    [deletePermission]="deletePermission"
    [editPermission]="editPermission"
    [viewPermission]="viewPermission"
    [deleteActionEnabledField]="deleteActionEnabledField"
    [deleteActionVisibleField]="deleteActionVisibleField"
    [editActionEnabledField]="editActionEnabledField"
    [editActionVisibleField]="editActionVisibleField"
    [viewActionEnabledField]="viewActionEnabledField"
    [viewActionVisibleField]="viewActionVisibleField"
    [additionalActions]="additionalActions"
    [stringCellTemplate]="_stringTableCell ? stringCell : undefined"
    [numberCellTemplate]="_numberTableCell ? numberCell : undefined"
    [dateCellTemplate]="_dateTableCell ? dateCell : undefined"
    [relativeDateCellTemplate]="_relativeDateTableCell ? relativeDateCell : undefined"
    [cellTemplate]="_tableCell ? cell : undefined"
    [translationKeyCellTemplate]="_translationKeyTableCell ? translationKeyCell : undefined"
    [filterCellTemplate]="_tableFilterCell ? filterCell : undefined"
    [dateFilterCellTemplate]="_dateTableFilterCell ? dateFilterCell : undefined"
    [numberFilterCellTemplate]="_numberTableFilterCell ? numberFilterCell : undefined"
    [stringFilterCellTemplate]="_stringTableFilterCell ? stringFilterCell : undefined"
    [relativeDateFilterCellTemplate]="_relativeDateTableFilterCell ? relativeDateFilterCell : undefined"
    [translationKeyFilterCellTemplate]="_translationKeyTableFilterCell ? translationKeyFilterCell : undefined"
    (sorted)="sorting($event)"
    (filtered)="filtering($event)"
    [totalRecordsOnServer]="totalRecordsOnServer"
    [currentPageShowingKey]="currentPageShowingKey"
    [currentPageShowingWithTotalOnServerKey]="currentPageShowingWithTotalOnServerKey"
    [parentTemplates]="templatesForChildren$ | async"
    [allowSelectAll]="tableAllowSelectAll"
    [selectionEnabledField]="tableSelectionEnabledField"
  >
  </ocx-data-table>
  <ng-template #stringCell let-rowObject="rowObject" let-column="column">
    @if (_stringTableCell) {
    <ng-container
      [ngTemplateOutlet]="_stringTableCell"
      [ngTemplateOutletContext]="{rowObject: rowObject, column:column}"
    >
    </ng-container>
    }</ng-template
  >
  <ng-template #numberCell let-rowObject="rowObject" let-column="column">
    @if (_numberTableCell) {
    <ng-container
      [ngTemplateOutlet]="_numberTableCell"
      [ngTemplateOutletContext]="{rowObject: rowObject, column:column}"
    >
    </ng-container>
    }</ng-template
  >
  <ng-template #dateCell let-rowObject="rowObject" let-column="column">
    @if (_dateTableCell) {
    <ng-container [ngTemplateOutlet]="_dateTableCell" [ngTemplateOutletContext]="{rowObject:rowObject, column:column}">
    </ng-container>
    }</ng-template
  >
  <ng-template #relativeDateCell let-rowObject="rowObject" let-column="column">
    @if (_relativeDateTableCell) {
    <ng-container
      [ngTemplateOutlet]="_relativeDateTableCell"
      [ngTemplateOutletContext]="{rowObject:rowObject, column:column}"
    >
    </ng-container>
    }</ng-template
  >
  <ng-template #cell let-rowObject="rowObject" let-column="column">
    @if (_tableCell) {
    <ng-container [ngTemplateOutlet]="_tableCell" [ngTemplateOutletContext]="{rowObject: rowObject, column:column}">
    </ng-container>
    }</ng-template
  >
  <ng-template #translationKeyCell let-rowObject="rowObject" let-column="column">
    @if (_translationKeyTableCell) {
    <ng-container
      [ngTemplateOutlet]="_translationKeyTableCell"
      [ngTemplateOutletContext]="{rowObject:rowObject, column:column}"
    >
    </ng-container>
    }</ng-template
  >
  <ng-template #stringFilterCell let-rowObject="rowObject" let-column="column">
    @if (_stringTableFilterCell) {
    <ng-container
      [ngTemplateOutlet]="_stringTableFilterCell"
      [ngTemplateOutletContext]="{rowObject:rowObject, column:column}"
    >
    </ng-container>
    }</ng-template
  >
  <ng-template #filterCell let-rowObject="rowObject" let-column="column">
    @if (_tableFilterCell) {
    <ng-container
      [ngTemplateOutlet]="_tableFilterCell"
      [ngTemplateOutletContext]="{rowObject:rowObject, column:column}"
    >
    </ng-container>
    }
  </ng-template>
  <ng-template #dateFilterCell let-rowObject="rowObject" let-column="column">
    @if (_dateTableFilterCell) {
    <ng-container
      [ngTemplateOutlet]="_dateTableFilterCell"
      [ngTemplateOutletContext]="{rowObject:rowObject, column:column}"
    >
    </ng-container>
    }
  </ng-template>
  <ng-template #numberFilterCell let-rowObject="rowObject" let-column="column">
    @if (_numberTableFilterCell) {
    <ng-container
      [ngTemplateOutlet]="_numberTableFilterCell"
      [ngTemplateOutletContext]="{rowObject:rowObject, column:column}"
    >
    </ng-container>
    }
  </ng-template>
  <ng-template #relativeDateFilterCell let-rowObject="rowObject" let-column="column">
    @if (_relativeDateTableFilterCell) {
    <ng-container
      [ngTemplateOutlet]="_relativeDateTableFilterCell"
      [ngTemplateOutletContext]="{rowObject:rowObject, column:column}"
    >
    </ng-container>
    }
  </ng-template>
  <ng-template #translationKeyFilterCell let-rowObject="rowObject" let-column="column">
    @if (_translationKeyTableFilterCell) {
    <ng-container
      [ngTemplateOutlet]="_translationKeyTableFilterCell"
      [ngTemplateOutletContext]="{rowObject:rowObject, column:column}"
    >
    </ng-container>
    }
  </ng-template>
</div>
}


```

### File: angular-accelerator/src/lib/components/data-view/data-view.component.spec.ts

```ts

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DataViewModule } from 'primeng/dataview'

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { DataListGridHarness, DataTableHarness, DataViewHarness } from '@onecx/angular-accelerator/testing'
import {
  provideAppStateServiceMock,
  provideUserServiceMock,
  UserServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { TooltipStyle } from 'primeng/tooltip'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { ColumnType } from '../../model/column-type.model'
import { DataListGridComponent } from '../data-list-grid/data-list-grid.component'
import { DataTableComponent } from '../data-table/data-table.component'
import { DataViewComponent } from './data-view.component'

describe('DataViewComponent', () => {
  const mutationObserverMock = jest.fn(function MutationObserver(callback) {
    this.observe = jest.fn()
    this.disconnect = jest.fn()
    this.trigger = (mockedMutationsList: any) => {
      callback(mockedMutationsList, this)
    }
    return this
  })
  global.MutationObserver = mutationObserverMock

  let component: DataViewComponent
  let fixture: ComponentFixture<DataViewComponent>
  let dataViewHarness: DataViewHarness

  const ENGLISH_LANGUAGE = 'en'
  const ENGLISH_TRANSLATIONS = {
    OCX_DATA_TABLE: {
      SHOWING: '{{first}} - {{last}} of {{totalRecords}}',
      SHOWING_WITH_TOTAL_ON_SERVER: '{{first}} - {{last}} of {{totalRecords}} ({{totalRecordsOnServer}})',
    },
  }

  const TRANSLATIONS = {
    [ENGLISH_LANGUAGE]: ENGLISH_TRANSLATIONS,
  }

  const mockData = [
    {
      version: 0,
      creationDate: '2023-09-12T09:34:11.997048Z',
      creationUser: 'creation user',
      modificationDate: '2023-09-12T09:34:11.997048Z',
      modificationUser: '',
      id: '195ee34e-41c6-47b7-8fc4-3f245dee7651',
      name: 'some name',
      description: '',
      status: 'some status',
      responsible: 'someone responsible',
      endDate: '2023-09-14T09:34:09Z',
      startDate: '2023-09-13T09:34:05Z',
      imagePath: '/path/to/image',
      testNumber: '1',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:33:58.544494Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:33:58.544494Z',
      modificationUser: '',
      id: '5f8bb05b-d089-485e-a234-0bb6ff25234e',
      name: 'example',
      description: 'example description',
      status: 'status example',
      responsible: '',
      endDate: '2023-09-13T09:33:55Z',
      startDate: '2023-09-12T09:33:53Z',
      imagePath: '',
      testNumber: '3.141',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 1',
      description: '',
      status: 'status name 1',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '123456789',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 2',
      description: '',
      status: 'status name 2',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '12345.6789',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 3',
      description: '',
      status: 'status name 3',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '7.1',
    },
  ]
  const mockColumns = [
    {
      columnType: ColumnType.STRING,
      id: 'name',
      nameKey: 'COLUMN_HEADER_NAME.NAME',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'description',
      nameKey: 'COLUMN_HEADER_NAME.DESCRIPTION',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'startDate',
      nameKey: 'COLUMN_HEADER_NAME.START_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'endDate',
      nameKey: 'COLUMN_HEADER_NAME.END_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.TRANSLATION_KEY,
      id: 'status',
      nameKey: 'COLUMN_HEADER_NAME.STATUS',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'responsible',
      nameKey: 'COLUMN_HEADER_NAME.RESPONSIBLE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.RELATIVE_DATE,
      id: 'modificationDate',
      nameKey: 'COLUMN_HEADER_NAME.MODIFICATION_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'creationUser',
      nameKey: 'COLUMN_HEADER_NAME.CREATION_USER',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.NUMBER,
      id: 'testNumber',
      nameKey: 'COLUMN_HEADER_NAME.TEST_NUMBER',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataViewComponent, DataListGridComponent, DataTableComponent],
      imports: [
        DataViewModule,
        TranslateTestingModule.withTranslations(TRANSLATIONS),
        AngularAcceleratorModule,
        RouterModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideUserServiceMock(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideAppStateServiceMock(),
        TooltipStyle,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DataViewComponent)
    component = fixture.componentInstance
    component.data = mockData
    component.columns = mockColumns
    const userServiceMock = TestBed.inject(UserServiceMock)
    userServiceMock.permissionsTopic$.publish(['VIEW', 'EDIT', 'DELETE'])
    fixture.detectChanges()
    dataViewHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataViewHarness)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('Table row selection ', () => {
    let dataTable: DataTableHarness | null

    beforeEach(async () => {
      component.layout = 'table'
      dataTable = await dataViewHarness?.getDataTable()
    })

    it('should initially show a table without selection checkboxes', async () => {
      expect(dataTable).toBeTruthy()
      expect(await dataTable?.rowSelectionIsEnabled()).toEqual(false)
    })

    it('should show a table with selection checkboxes if the parent binds to the event emitter', async () => {
      expect(dataTable).toBeTruthy()
      expect(await dataTable?.rowSelectionIsEnabled()).toEqual(false)
      component.selectionChanged.subscribe()
      expect(await dataTable?.rowSelectionIsEnabled()).toEqual(true)
    })

    it('should render an unpinnend action column on the right side of the table by default', async () => {
      component.viewItem.subscribe((event) => console.log(event))

      expect(component.frozenActionColumn).toBe(false)
      expect(component.actionColumnPosition).toBe('right')
      expect(await dataTable?.getActionColumnHeader('left')).toBe(null)
      expect(await dataTable?.getActionColumn('left')).toBe(null)

      const rightActionColumnHeader = await dataTable?.getActionColumnHeader('right')
      const rightActionColumn = await dataTable?.getActionColumn('right')
      expect(rightActionColumnHeader).toBeTruthy()
      expect(rightActionColumn).toBeTruthy()
      expect(await dataTable?.columnIsFrozen(rightActionColumnHeader)).toBe(false)
      expect(await dataTable?.columnIsFrozen(rightActionColumn)).toBe(false)
    })

    it('should render an pinned action column on the specified side of the table', async () => {
      component.viewItem.subscribe((event) => console.log(event))

      component.frozenActionColumn = true
      component.actionColumnPosition = 'left'

      expect(await dataTable?.getActionColumnHeader('right')).toBe(null)
      expect(await dataTable?.getActionColumn('right')).toBe(null)

      const leftActionColumnHeader = await dataTable?.getActionColumnHeader('left')
      const leftActionColumn = await dataTable?.getActionColumn('left')
      expect(leftActionColumnHeader).toBeTruthy()
      expect(leftActionColumn).toBeTruthy()
      expect(await dataTable?.columnIsFrozen(leftActionColumnHeader)).toBe(true)
      expect(await dataTable?.columnIsFrozen(leftActionColumn)).toBe(true)
    })
  })

  it('should stay on the same page after layout change', async () => {
    component.data = [
      ...component.data,
      {
        id: 'mock1',
        imagePath: '/path/to/image',
        modificationDate: '2023-09-12T09:34:27.184086Z',
      },
      {
        id: 'mock2',
        imagePath: '/path/to/image',
        modificationDate: '2023-09-12T09:34:27.184086Z',
      },
      {
        id: 'mock3',
        imagePath: '/path/to/image',
        modificationDate: '2023-09-12T09:34:27.184086Z',
      },
      {
        id: 'mock4',
        imagePath: '/path/to/image',
        modificationDate: '2023-09-12T09:34:27.184086Z',
      },
      {
        id: 'mock5',
        imagePath: '/path/to/image',
        modificationDate: '2023-09-12T09:34:27.184086Z',
      },
      {
        id: 'mock6',
        imagePath: '/path/to/image',
        modificationDate: '2023-09-12T09:34:27.184086Z',
      },
    ]

    dataViewHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataViewHarness)
    const dataList = await dataViewHarness.getHarness(DataListGridHarness)
    const dataListPaginator = await dataList.getPaginator()
    let dataListRaport = await dataListPaginator.getCurrentPageReportText()
    expect(dataListRaport).toEqual('1 - 10 of 11')
    await dataListPaginator.clickNextPage()
    dataListRaport = await dataListPaginator.getCurrentPageReportText()
    expect(dataListRaport).toEqual('11 - 11 of 11')

    component.layout = 'table'
    const dataTable = await dataViewHarness.getHarness(DataTableHarness)
    const dataTablePaginator = await dataTable.getPaginator()
    const dataTableRaport = await dataTablePaginator.getCurrentPageReportText()
    expect(dataTableRaport).toEqual('11 - 11 of 11')
  })

  describe('Dynamically disable/hide based on field path in data view', () => {
    const setUpMockData = async (viewType: 'grid' | 'list' | 'table') => {
      component.viewItem.subscribe(() => console.log())
      component.editItem.subscribe(() => console.log())
      component.deleteItem.subscribe(() => console.log())
      component.viewPermission = 'VIEW'
      component.editPermission = 'EDIT'
      component.deletePermission = 'DELETE'
      component.layout = viewType
      component.columns = [
        {
          columnType: ColumnType.STRING,
          id: 'name',
          nameKey: 'COLUMN_HEADER_NAME.NAME',
        },
        {
          columnType: ColumnType.STRING,
          id: 'ready',
          nameKey: 'Ready',
        },
      ]
      component.data = [
        {
          id: 'Test',
          imagePath:
            'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          name: 'Card 1',
          ready: false,
        },
      ]
      component.titleLineId = 'name'

      fixture.detectChanges()
      await fixture.whenStable()
    }

    describe('Disable list action buttons based on field path', () => {
      it('should not disable any buttons initially', async () => {
        await setUpMockData('list')
        const dataView = await dataViewHarness.getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 0)).toBe(true)
      })

      it('should disable a button based on a given field path', async () => {
        await setUpMockData('list')
        component.viewActionEnabledField = 'ready'
        const dataView = await dataViewHarness.getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 1)).toBe(true)
      })
    })

    describe('Disable grid action buttons based on field path', () => {
      it('should not disable any buttons initially', async () => {
        await setUpMockData('grid')
        const dataView = await dataViewHarness.getDataListGrid()
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 0)).toBe(true)
      })

      it('should disable a button based on a given field path', async () => {
        await setUpMockData('grid')
        component.viewActionEnabledField = 'ready'
        const dataView = await dataViewHarness.getDataListGrid()
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 1)).toBe(true)
      })
    })

    describe('Disable table action buttons based on field path', () => {
      it('should not disable any buttons initially', async () => {
        await setUpMockData('table')
        const dataTable = await dataViewHarness.getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(3)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(0)).toBe(true)
      })

      it('should disable a button based on a given field path', async () => {
        await setUpMockData('table')
        component.viewActionEnabledField = 'ready'
        const dataTable = await dataViewHarness.getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(3)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(1)).toBe(true)
      })
    })

    describe('Hide list action buttons based on field path', () => {
      it('should not hide any buttons initially', async () => {
        await setUpMockData('list')
        const dataView = await dataViewHarness.getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 0)).toBe(true)
      })

      it('should hide a button based on a given field path', async () => {
        await setUpMockData('list')
        component.viewActionVisibleField = 'ready'
        const dataView = await dataViewHarness.getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 2)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 0)).toBe(true)
      })
    })

    describe('Hide grid action buttons based on field path', () => {
      it('should not hide any buttons initially', async () => {
        await setUpMockData('grid')
        const dataView = await dataViewHarness.getDataListGrid()
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 0)).toBe(true)
      })

      it('should hide a button based on a given field path', async () => {
        await setUpMockData('grid')
        const dataView = await dataViewHarness.getDataListGrid()
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        await (await dataView?.getMenuButton())?.click()

        component.viewActionVisibleField = 'ready'
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 2)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 0)).toBe(true)
      })
    })

    describe('Hide table action buttons based on field path', () => {
      it('should not hide any buttons initially', async () => {
        await setUpMockData('table')
        const dataTable = await dataViewHarness.getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(3)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(0)).toBe(true)
      })

      it('should hide a button based on a given field path', async () => {
        await setUpMockData('table')
        component.viewActionVisibleField = 'ready'
        const dataTable = await dataViewHarness.getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(2)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(0)).toBe(true)
      })
    })
  })
})


```

### File: angular-accelerator/src/lib/components/data-view/data-view.component.ts

```ts

import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core'
import { PrimeTemplate } from 'primeng/api'
import { BehaviorSubject, Observable, ReplaySubject, combineLatest, map, startWith, timestamp } from 'rxjs'
import { DataAction } from '../../model/data-action'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { Filter } from '../../model/filter.model'
import { orderAndMergeValuesByTimestamp } from '../../utils/rxjs-utils'
import {
  DataListGridComponent,
  DataListGridComponentState,
  ListGridData,
} from '../data-list-grid/data-list-grid.component'
import { DataTableComponent, DataTableComponentState, Row, Sort } from '../data-table/data-table.component'

export type RowListGridData = ListGridData & Row

export type DataViewComponentState = DataListGridComponentState & DataTableComponentState

@Component({
  standalone: false,
  selector: 'ocx-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css'],
  providers: [{ provide: 'DataViewComponent', useExisting: DataViewComponent }],
})
export class DataViewComponent implements DoCheck, OnInit, AfterContentInit {
  private readonly injector = inject(Injector)

  _dataListGridComponent: DataListGridComponent | undefined
  @ViewChild(DataListGridComponent) set listGrid(ref: DataListGridComponent | undefined) {
    this._dataListGridComponent = ref
    this.registerEventListenerForListGrid()
  }
  get listGrid(): DataListGridComponent | undefined {
    return this._dataListGridComponent
  }

  _dataTableComponent: DataTableComponent | undefined
  @ViewChild(DataTableComponent) set dataTable(ref: DataTableComponent | undefined) {
    this._dataTableComponent = ref
    this.registerEventListenerForDataTable()
  }
  get dataTable(): DataTableComponent | undefined {
    return this._dataTableComponent
  }

  dataTableComponentState$ = new ReplaySubject<DataTableComponentState>(1)
  dataListGridComponentState$ = new ReplaySubject<DataListGridComponentState>(1)

  @Input() deletePermission: string | string[] | undefined
  @Input() editPermission: string | string[] | undefined
  @Input() viewPermission: string | string[] | undefined
  @Input() deleteActionVisibleField: string | undefined
  @Input() deleteActionEnabledField: string | undefined
  @Input() viewActionVisibleField: string | undefined
  @Input() viewActionEnabledField: string | undefined
  @Input() editActionVisibleField: string | undefined
  @Input() editActionEnabledField: string | undefined
  @Input() tableSelectionEnabledField: string | undefined
  @Input() tableAllowSelectAll = true
  @Input() data: RowListGridData[] = []
  @Input() name = 'Data table'
  @Input() titleLineId: string | undefined
  @Input() subtitleLineIds: string[] = []
  @Input() layout: any = ['grid', 'list', 'table']
  @Input() columns: DataTableColumn[] = []
  @Input() emptyResultsMessage: string | undefined
  @Input() clientSideSorting = true
  @Input() clientSideFiltering = true
  @Input() fallbackImage = 'placeholder.png'
  @Input() filters: Filter[] = []
  @Input() sortField: any = ''
  @Input() sortDirection: DataSortDirection = DataSortDirection.NONE
  @Input() listGridPaginator = true
  @Input() tablePaginator = true
  @Input() page = 0
  @Input() totalRecordsOnServer: number | undefined
  @Input() currentPageShowingKey = 'OCX_DATA_TABLE.SHOWING'
  @Input() currentPageShowingWithTotalOnServerKey = 'OCX_DATA_TABLE.SHOWING_WITH_TOTAL_ON_SERVER'
  @Input() selectedRows: Row[] = []
  @Input() frozenActionColumn = false
  @Input() actionColumnPosition: 'left' | 'right' = 'right'

  @Input()
  get paginator(): boolean {
    return this.listGridPaginator && this.tablePaginator
  }
  set paginator(value: boolean) {
    this.listGridPaginator = value
    this.tablePaginator = value
  }

  @Input() sortStates: DataSortDirection[] = [DataSortDirection.ASCENDING, DataSortDirection.DESCENDING]
  @Input() pageSizes: number[] = [10, 25, 50]
  @Input() pageSize: number | undefined

  @Input() stringTableCellTemplate: TemplateRef<any> | undefined
  @ContentChild('stringTableCell') stringTableCellChildTemplate: TemplateRef<any> | undefined
  get _stringTableCell(): TemplateRef<any> | undefined {
    return this.stringTableCellTemplate || this.stringTableCellChildTemplate
  }

  @Input() numberTableCellTemplate: TemplateRef<any> | undefined
  @ContentChild('numberTableCell') numberTableCellChildTemplate: TemplateRef<any> | undefined
  get _numberTableCell(): TemplateRef<any> | undefined {
    return this.numberTableCellTemplate || this.numberTableCellChildTemplate
  }

  @Input() dateTableCellTemplate: TemplateRef<any> | undefined
  @ContentChild('dateTableCell') dateTableCellChildTemplate: TemplateRef<any> | undefined
  get _dateTableCell(): TemplateRef<any> | undefined {
    return this.dateTableCellTemplate || this.dateTableCellChildTemplate
  }

  @Input() tableCellTemplate: TemplateRef<any> | undefined
  @ContentChild('tableCell') tableCellChildTemplate: TemplateRef<any> | undefined
  get _tableCell(): TemplateRef<any> | undefined {
    return this.tableCellTemplate || this.tableCellChildTemplate
  }

  @Input() translationKeyTableCellTemplate: TemplateRef<any> | undefined
  @ContentChild('translationKeyTableCell') translationKeyTableCellChildTemplate: TemplateRef<any> | undefined
  get _translationKeyTableCell(): TemplateRef<any> | undefined {
    return this.translationKeyTableCellTemplate || this.translationKeyTableCellChildTemplate
  }

  @Input() gridItemSubtitleLinesTemplate: TemplateRef<any> | undefined
  @ContentChild('gridItemSubtitleLines') gridItemSubtitleLinesChildTemplate: TemplateRef<any> | undefined
  get _gridItemSubtitleLines(): TemplateRef<any> | undefined {
    return this.gridItemSubtitleLinesTemplate || this.gridItemSubtitleLinesChildTemplate
  }

  @Input() listItemSubtitleLinesTemplate: TemplateRef<any> | undefined
  @ContentChild('listItemSubtitleLines') listItemSubtitleLinesChildTemplate: TemplateRef<any> | undefined
  get _listItemSubtitleLines(): TemplateRef<any> | undefined {
    return this.listItemSubtitleLinesTemplate || this.listItemSubtitleLinesChildTemplate
  }
  @Input() gridItemTemplate: TemplateRef<any> | undefined
  @ContentChild('gridItem') gridItemChildTemplate: TemplateRef<any> | undefined
  get _gridItem(): TemplateRef<any> | undefined {
    return this.gridItemTemplate || this.gridItemChildTemplate
  }

  @Input() listItemTemplate: TemplateRef<any> | undefined
  @ContentChild('listItem') listItemChildTemplate: TemplateRef<any> | undefined
  get _listItem(): TemplateRef<any> | undefined {
    return this.listItemTemplate || this.listItemChildTemplate
  }

  @Input() relativeDateTableCellTemplate: TemplateRef<any> | undefined
  @ContentChild('relativeDateTableCell') relativeDateTableCellChildTemplate: TemplateRef<any> | undefined
  get _relativeDateTableCell(): TemplateRef<any> | undefined {
    return this.relativeDateTableCellTemplate || this.relativeDateTableCellChildTemplate
  }

  @Input() listValueTemplate: TemplateRef<any> | undefined
  @ContentChild('listValue') listValueChildTemplate: TemplateRef<any> | undefined
  get _listValue(): TemplateRef<any> | undefined {
    return this.listValueTemplate || this.listValueChildTemplate
  }
  @Input() translationKeyListValueTemplate: TemplateRef<any> | undefined
  @ContentChild('translationKeyListValue') translationKeyListValueChildTemplate: TemplateRef<any> | undefined
  get _translationKeyListValue(): TemplateRef<any> | undefined {
    return this.translationKeyListValueTemplate || this.translationKeyListValueChildTemplate
  }
  @Input() numberListValueTemplate: TemplateRef<any> | undefined
  @ContentChild('numberListValue') numberListValueChildTemplate: TemplateRef<any> | undefined
  get _numberListValue(): TemplateRef<any> | undefined {
    return this.numberListValueTemplate || this.numberListValueChildTemplate
  }
  @Input() relativeDateListValueTemplate: TemplateRef<any> | undefined
  @ContentChild('relativeDateListValue') relativeDateListValueChildTemplate: TemplateRef<any> | undefined
  get _relativeDateListValue(): TemplateRef<any> | undefined {
    return this.relativeDateListValueTemplate || this.relativeDateListValueChildTemplate
  }
  @Input() stringListValueTemplate: TemplateRef<any> | undefined
  @ContentChild('stringListValue') stringListValueChildTemplate: TemplateRef<any> | undefined
  get _stringListValue(): TemplateRef<any> | undefined {
    return this.stringListValueTemplate || this.stringListValueChildTemplate
  }
  @Input() dateListValueTemplate: TemplateRef<any> | undefined
  @ContentChild('dateListValue') dateListValueChildTemplate: TemplateRef<any> | undefined
  get _dateListValue(): TemplateRef<any> | undefined {
    return this.dateListValueTemplate || this.dateListValueChildTemplate
  }
  @Input() tableFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('tableFilterCell') tableFilterCellChildTemplate: TemplateRef<any> | undefined
  get _tableFilterCell(): TemplateRef<any> | undefined {
    return this.tableFilterCellTemplate || this.tableFilterCellChildTemplate
  }
  @Input() dateTableFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('dateFilterCell') dateTableFilterCellChildTemplate: TemplateRef<any> | undefined
  get _dateTableFilterCell(): TemplateRef<any> | undefined {
    return this.dateTableFilterCellTemplate || this.dateTableFilterCellChildTemplate
  }
  @Input() relativeDateTableFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('relativeDateTableFilterCell') relativeDateTableFilterCellChildTemplate: TemplateRef<any> | undefined
  get _relativeDateTableFilterCell(): TemplateRef<any> | undefined {
    return this.relativeDateTableFilterCellTemplate || this.relativeDateTableFilterCellChildTemplate
  }
  @Input() translationKeyTableFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('translationKeyTableFilterCell') translationKeyTableFilterCellChildTemplate:
    | TemplateRef<any>
    | undefined
  get _translationKeyTableFilterCell(): TemplateRef<any> | undefined {
    return this.translationKeyTableFilterCellTemplate || this.translationKeyTableFilterCellChildTemplate
  }
  @Input() stringTableFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('stringTableFilterCell') stringTableFilterCellChildTemplate: TemplateRef<any> | undefined
  get _stringTableFilterCell(): TemplateRef<any> | undefined {
    return this.stringTableFilterCellTemplate || this.stringTableFilterCellChildTemplate
  }
  @Input() numberTableFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('numberTableFilterCell') numberTableFilterCellChildTemplate: TemplateRef<any> | undefined
  get _numberTableFilterCell(): TemplateRef<any> | undefined {
    return this.numberTableFilterCellTemplate || this.numberTableFilterCellChildTemplate
  }

  @Input() additionalActions: DataAction[] = []

  @Output() filtered = new EventEmitter<Filter[]>()
  @Output() sorted = new EventEmitter<Sort>()
  @Output() deleteItem = new EventEmitter<RowListGridData>()
  @Output() viewItem = new EventEmitter<RowListGridData>()
  @Output() editItem = new EventEmitter<RowListGridData>()
  @Output() selectionChanged = new EventEmitter<Row[]>()
  @Output() pageChanged = new EventEmitter<number>()
  @Output() pageSizeChanged = new EventEmitter<number>()
  @Output() componentStateChanged = new EventEmitter<DataViewComponentState>()
  isDeleteItemObserved: boolean | undefined
  isViewItemObserved: boolean | undefined
  IsEditItemObserved: boolean | undefined
  firstColumnId: string | undefined

  parentTemplates$: BehaviorSubject<QueryList<PrimeTemplate> | null | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | null | undefined
  >(undefined)
  @Input()
  set parentTemplates(value: QueryList<PrimeTemplate> | null | undefined) {
    this.parentTemplates$.next(value)
  }

  templates$: BehaviorSubject<QueryList<PrimeTemplate> | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | undefined
  >(undefined)
  @ContentChildren(PrimeTemplate)
  set templates(value: QueryList<PrimeTemplate> | undefined) {
    this.templates$.next(value)
  }

  templatesForChildren$: Observable<QueryList<PrimeTemplate> | undefined> = combineLatest([
    this.templates$,
    this.parentTemplates$,
  ]).pipe(
    map(([t, pt]) => {
      const ql = new QueryList<PrimeTemplate>()
      ql.reset([...(t?.toArray() ?? []), ...(pt?.toArray() ?? [])])
      return ql
    })
  )

  get viewItemObserved(): boolean {
    return this.injector.get('InteractiveDataViewComponent', null)?.viewItem.observed || this.viewItem.observed
  }
  get editItemObserved(): boolean {
    return this.injector.get('InteractiveDataViewComponent', null)?.editItem.observed || this.editItem.observed
  }
  get deleteItemObserved(): boolean {
    return this.injector.get('InteractiveDataViewComponent', null)?.deleteItem.observed || this.deleteItem.observed
  }
  get selectionChangedObserved(): boolean {
    return (
      this.injector.get('InteractiveDataViewComponent', null)?.selectionChanged.observed ||
      this.selectionChanged.observed
    )
  }

  ngOnInit(): void {
    this.firstColumnId = this.columns[0]?.id

    let dataTableComponentState$: Observable<DataTableComponentState | Record<string, never>> =
      this.dataTableComponentState$
    let dataListGridComponentState$: Observable<DataListGridComponentState | Record<string, never>> =
      this.dataListGridComponentState$
    if (this.layout === 'table') {
      dataListGridComponentState$ = dataListGridComponentState$.pipe(startWith({}))
    } else {
      dataTableComponentState$ = dataTableComponentState$.pipe(startWith({}))
    }

    combineLatest([dataTableComponentState$.pipe(timestamp()), dataListGridComponentState$.pipe(timestamp())])
      .pipe(
        map((componentStates) => {
          return orderAndMergeValuesByTimestamp(componentStates)
        })
      )
      .subscribe((val) => {
        this.componentStateChanged.emit(val)
      })
  }

  ngAfterContentInit() {
    this.templates$.value?.forEach((item) => {
      switch (item.getType()) {
        case 'stringTableCell':
          this.stringTableCellChildTemplate = item.template
          break
        case 'numberTableCell':
          this.numberTableCellChildTemplate = item.template
          break
        case 'dateTableCell':
          this.dateTableCellChildTemplate = item.template
          break
        case 'tableCell':
          this.tableCellChildTemplate = item.template
          break
        case 'translationKeyTableCell':
          this.translationKeyTableCellChildTemplate = item.template
          break
        case 'gridItemSubtitleLines':
          this.gridItemSubtitleLinesChildTemplate = item.template
          break
        case 'listItemSubtitleLines':
          this.listItemSubtitleLinesChildTemplate = item.template
          break
        case 'gridItem':
          this.gridItemChildTemplate = item.template
          break
        case 'listItem':
          this.listItemChildTemplate = item.template
          break
        case 'relativeDateTableCell':
          this.relativeDateTableCellChildTemplate = item.template
          break
        case 'listValue':
          this.listValueChildTemplate = item.template
          break
        case 'translationKeyListValue':
          this.translationKeyListValueChildTemplate = item.template
          break
        case 'numberListValue':
          this.numberListValueChildTemplate = item.template
          break
        case 'relativeDateListValue':
          this.relativeDateListValueChildTemplate = item.template
          break
        case 'stringListValue':
          this.stringListValueChildTemplate = item.template
          break
        case 'dateListValue':
          this.dateListValueChildTemplate = item.template
          break
        case 'tableFilterCell':
          this.tableFilterCellChildTemplate = item.template
          break
        case 'dateTableFilterCell':
          this.dateTableFilterCellChildTemplate = item.template
          break
        case 'relativeDateTableFilterCell':
          this.relativeDateTableFilterCellChildTemplate = item.template
          break
        case 'translationKeyTableFilterCell':
          this.translationKeyTableFilterCellChildTemplate = item.template
          break
        case 'stringTableFilterCell':
          this.stringTableFilterCellChildTemplate = item.template
          break
        case 'numberTableFilterCell':
          this.numberTableFilterCellChildTemplate = item.template
          break
      }
    })
  }

  ngDoCheck(): void {
    this.registerEventListenerForDataTable()
    this.registerEventListenerForListGrid()
  }

  registerEventListenerForListGrid() {
    if (this.layout !== 'table') {
      if (this.deleteItem.observed) {
        this.isDeleteItemObserved = true
        if (!this._dataListGridComponent?.deleteItem.observed) {
          this._dataListGridComponent?.deleteItem.subscribe((event) => {
            this.deletingElement(event)
          })
        }
      }
      if (this.viewItem.observed) {
        this.isViewItemObserved = true
        if (!this._dataListGridComponent?.viewItem.observed) {
          this._dataListGridComponent?.viewItem.subscribe((event) => {
            this.viewingElement(event)
          })
        }
      }
      if (this.editItem.observed) {
        this.IsEditItemObserved = true
        if (!this._dataListGridComponent?.editItem.observed) {
          this._dataListGridComponent?.editItem.subscribe((event) => {
            this.editingElement(event)
          })
        }
      }
    }
  }

  registerEventListenerForDataTable() {
    if (this.layout === 'table') {
      if (this.deleteItem.observed) {
        this.isDeleteItemObserved = true
        if (!this._dataTableComponent?.deleteTableRow.observed) {
          this._dataTableComponent?.deleteTableRow.subscribe((event) => {
            this.deletingElement(event)
          })
        }
      }
      if (this.viewItem.observed) {
        this.isViewItemObserved = true
        if (!this._dataTableComponent?.viewTableRow.observed) {
          this._dataTableComponent?.viewTableRow.subscribe((event) => {
            this.viewingElement(event)
          })
        }
      }
      if (this.editItem.observed) {
        this.IsEditItemObserved = true
        if (!this._dataTableComponent?.editTableRow.observed) {
          this._dataTableComponent?.editTableRow.subscribe((event) => {
            this.editingElement(event)
          })
        }
      }
      if (this.selectionChangedObserved) {
        if (!this._dataTableComponent?.selectionChanged.observed) {
          this._dataTableComponent?.selectionChanged.subscribe((event) => {
            this.onRowSelectionChange(event)
          })
        }
      }
    }
  }

  filtering(event: any) {
    this.filters = event
    this.filtered.emit(event)
  }

  sorting(event: any) {
    this.sortDirection = event.sortDirection
    this.sortField = event.sortColumn
    this.sorted.emit(event)
  }

  deletingElement(event: any) {
    if (this.isDeleteItemObserved) {
      this.deleteItem.emit(event)
    }
  }

  viewingElement(event: any) {
    if (this.isViewItemObserved) {
      this.viewItem.emit(event)
    }
  }
  editingElement(event: any) {
    if (this.IsEditItemObserved) {
      this.editItem.emit(event)
    }
  }

  onRowSelectionChange(event: Row[]) {
    if (this.selectionChangedObserved) {
      this.selectionChanged.emit(event)
    }
  }

  onPageChange(event: number) {
    this.page = event
    this.pageChanged.emit(event)
  }

  onPageSizeChange(event: number) {
    this.pageSize = event
    this.pageSizeChanged.emit(event)
  }
}


```

## Folder: angular-accelerator/src/lib/components/diagram (4 files)

### File: angular-accelerator/src/lib/components/diagram/diagram.component.html

```html

@if (this.data) {
  @if (shownDiagramTypes.length > 1) {
    <div class="flex justify-content-center pb-2">
      <p-selectbutton
        [options]="shownDiagramTypes"
        [(ngModel)]="selectedDiagramType"
        optionLabel="id"
        (onChange)="onDiagramTypeChanged($event)"
        name="diagram-type-select-button"
        [allowEmpty]="false"
        >
        <ng-template #item let-item>
          <i
            [class]="item.icon"
            [pTooltip]="item.tooltipKey | translate"
            tooltipPosition="top"
            tooltipEvent="hover"
          ></i>
          <label style="display: none" id="{{item.id}}"> {{item.label ? item.label : item.labelKey | translate}} </label>
        </ng-template>
      </p-selectbutton>
    </div>
  }
  <div class="w-full flex justify-content-center">
    <p-chart
      id="diagram"
      [type]="chartType"
      [data]="chartData"
      [responsive]="false"
      [options]="chartOptions"
      (onDataSelect)="dataClicked($event)"
      [ariaLabel]="(data ? 'OCX_DIAGRAM.ARIA_LABEL' : 'OCX_DIAGRAM.EMPTY_ARIA_LABEL') | translate: {total: generateTotal(data), valueString: generateDiagramValueString(data)}"
    ></p-chart>
  </div>
  <div class="w-full flex justify-content-center mt-2 sumKey">
    <p class="text-md font-medium text-700">
      <span name="sumLabel"> {{ sumKey | translate }}</span> : <span name="amountOfData">{{ amountOfData}}</span>
    </p>
  </div>
}

@if (!this.data) {
  <div class="w-full flex justify-content-center">
    <p-message severity="info" text="{{ 'OCX_DIAGRAM.NO_DATA' | translate }}"></p-message>
  </div>
}


```

### File: angular-accelerator/src/lib/components/diagram/diagram.component.spec.ts

```ts

import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import 'jest-canvas-mock'
import { PrimeIcons } from 'primeng/api'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DiagramHarness, TestbedHarnessEnvironment } from '../../../../testing'
import { DiagramType } from '../../model/diagram-type'
import { DiagramComponent, DiagramLayouts } from './diagram.component'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { ColorUtils } from '../../utils/colorutils'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'

describe('DiagramComponent', () => {
  let translateService: TranslateService
  let component: DiagramComponent
  let fixture: ComponentFixture<DiagramComponent>

  const definedSumKey = 'OCX_DIAGRAM.SUM'

  // Use the power of 2 (2^n) to identify the error of a possibly failed test more quickly
  const diagramData: { label: string; value: number }[] = [
    { label: 'test0', value: 1 },
    { label: 'test1', value: 2 },
    { label: 'test2', value: 4 },
    { label: 'test3', value: 8 },
    { label: 'test4', value: 16 },
    { label: 'test5', value: 32 },
    { label: 'test6', value: 64 },
  ]
  const numberOfResults = Math.pow(2, diagramData.length) - 1

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiagramComponent],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        AngularAcceleratorPrimeNgModule,
        TranslateTestingModule.withTranslations({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents()

    fixture = TestBed.createComponent(DiagramComponent)
    component = fixture.componentInstance
    component.data = diagramData
    component.sumKey = definedSumKey
    translateService = TestBed.inject(TranslateService)
    translateService.setDefaultLang('en')
    translateService.use('en')
  })

  it('should create the diagram component', () => {
    expect(component).toBeTruthy()
  })

  it('loads diagramHarness', async () => {
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    expect(diagram).toBeTruthy()
  })

  it('should display the sumKey on the diagram component', async () => {
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const displayedText = await diagram.getSumLabel()
    const definedSumKeyTranslation = translateService.instant(definedSumKey)
    expect(displayedText).toEqual(definedSumKeyTranslation)
  })

  it('should be created', () => {
    expect(translateService).toBeTruthy()
  })

  it('should display the amountOfData on the diagram component', async () => {
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const displayedNumber = await diagram.getTotalNumberOfResults()
    expect(displayedNumber).toEqual(numberOfResults)
  })

  it('should display pie chart by default', async () => {
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const chartHarness = await diagram.getChart()
    const chartType = await chartHarness.getType()
    expect(chartType).toEqual('pie')
  })

  it('should display horizontal bar chart', async () => {
    component.diagramType = DiagramType.HORIZONTAL_BAR
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const chartHarness = await diagram.getChart()
    const chartType = await chartHarness.getType()
    expect(chartType).toEqual('bar')
  })

  it('should display vertical bar chart', async () => {
    component.diagramType = DiagramType.VERTICAL_BAR
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const chartHarness = await diagram.getChart()
    const chartType = await chartHarness.getType()
    expect(chartType).toEqual('bar')
  })

  it('should not display a diagramType select button by default', async () => {
    expect(component.supportedDiagramTypes).toEqual([])
    expect(component.shownDiagramTypes).toEqual([])

    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const diagramTypeSelectButton = await diagram.getDiagramTypeSelectButton()

    expect(diagramTypeSelectButton).toBe(null)
  })

  it('should render a diagramType select button if supportedDiagramTypes is specified', async () => {
    const expectedDiagramLayouts: DiagramLayouts[] = [
      {
        id: 'diagram-pie',
        icon: PrimeIcons.CHART_PIE,
        layout: DiagramType.PIE,
        tooltipKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.PIE',
        labelKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.PIE',
      },
      {
        id: 'diagram-horizontal-bar',
        icon: PrimeIcons.BARS,
        layout: DiagramType.HORIZONTAL_BAR,
        tooltipKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.HORIZONTAL_BAR',
        labelKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.HORIZONTAL_BAR',
      },
    ]

    component.supportedDiagramTypes = [DiagramType.PIE, DiagramType.HORIZONTAL_BAR]
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const diagramTypeSelectButton = await diagram.getDiagramTypeSelectButton()
    const diagramTypeSelectButtonOptions = await diagram.getAllSelectionButtons()

    expect(component.shownDiagramTypes).toEqual(expectedDiagramLayouts)
    expect(diagramTypeSelectButton).toBeTruthy()
    expect(diagramTypeSelectButtonOptions.length).toBe(2)
  })

  it('should change the rendered diagram whenever the select button is used to change the diagramType', async () => {
    component.supportedDiagramTypes = [DiagramType.PIE, DiagramType.HORIZONTAL_BAR]

    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const diagramTypeSelectButton = await diagram.getDiagramTypeSelectButton()
    const diagramTypeSelectButtonOptions = await diagram.getAllSelectionButtons()

    let diagramTypeChangedEvent: DiagramType | undefined
    component.diagramTypeChanged.subscribe((event) => (diagramTypeChangedEvent = event))

    expect(diagramTypeSelectButton).toBeTruthy()
    expect(component.diagramType).toBe(DiagramType.PIE)
    let chartHarness = await diagram.getChart()
    let chartType = await chartHarness.getType()
    expect(chartType).toEqual('pie')

    await diagramTypeSelectButtonOptions[1].click()
    expect(component.diagramType).toBe(DiagramType.HORIZONTAL_BAR)
    chartHarness = await diagram.getChart()
    chartType = await chartHarness.getType()
    expect(chartType).toEqual('bar')
    expect(diagramTypeChangedEvent).toBe(DiagramType.HORIZONTAL_BAR)

    await diagramTypeSelectButtonOptions[0].click()
    expect(component.diagramType).toBe(DiagramType.PIE)
    chartHarness = await diagram.getChart()
    chartType = await chartHarness.getType()
    expect(chartType).toEqual('pie')
    expect(diagramTypeChangedEvent).toBe(DiagramType.PIE)
  })

  it('should dynamically add/remove options to/from the diagramType select button', async () => {
    const allDiagramLayouts: DiagramLayouts[] = [
      {
        id: 'diagram-pie',
        icon: PrimeIcons.CHART_PIE,
        layout: DiagramType.PIE,
        tooltipKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.PIE',
        labelKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.PIE',
      },
      {
        id: 'diagram-horizontal-bar',
        icon: PrimeIcons.BARS,
        layout: DiagramType.HORIZONTAL_BAR,
        tooltipKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.HORIZONTAL_BAR',
        labelKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.HORIZONTAL_BAR',
      },
      {
        id: 'diagram-vertical-bar',
        icon: PrimeIcons.CHART_BAR,
        layout: DiagramType.VERTICAL_BAR,
        tooltipKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.VERTICAL_BAR',
        labelKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.VERTICAL_BAR',
      },
    ]

    expect(component.shownDiagramTypes).toEqual([])

    component.supportedDiagramTypes = [DiagramType.PIE, DiagramType.HORIZONTAL_BAR]
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const diagramTypeSelectButton = await diagram.getDiagramTypeSelectButton()

    expect(diagramTypeSelectButton).toBeTruthy()
    expect(component.shownDiagramTypes).toEqual(allDiagramLayouts.slice(0, 2))
    const diagramTypeSelectButtonOptions = await diagram.getAllSelectionButtons()
    expect(diagramTypeSelectButtonOptions.length).toBe(2)

    component.supportedDiagramTypes = [DiagramType.PIE, DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR]
    const diagramTypeSelectButtonAfterUpdate = await diagram.getDiagramTypeSelectButton()
    const diagramTypeSelectButtonOptionsAfterUpdate = await diagram.getAllSelectionButtons()
    expect(diagramTypeSelectButtonAfterUpdate).toBeTruthy()
    expect(component.shownDiagramTypes).toEqual(allDiagramLayouts)
    expect(diagramTypeSelectButtonOptionsAfterUpdate.length).toBe(3)
  })

  it('should automatically select the button for the currently displayed diagram', async () => {
    component.supportedDiagramTypes = [DiagramType.PIE, DiagramType.HORIZONTAL_BAR]
    component.diagramType = DiagramType.HORIZONTAL_BAR

    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const diagramTypeSelectButtonOptions = await diagram.getAllSelectionButtons()

    expect(await diagramTypeSelectButtonOptions[0].hasClass('p-togglebutton-checked')).toBe(false)
    expect(await diagramTypeSelectButtonOptions[1].hasClass('p-togglebutton-checked')).toBe(true)
  })

  it('should interpolate colors by default', () => {
    const mockResult = diagramData.map((v, i) => i.toString())
    jest.spyOn(ColorUtils, 'interpolateColors').mockReturnValue(mockResult)

    component.ngOnChanges()

    expect(component.chartData?.datasets).toEqual([
      {
        data: diagramData.map((d) => d.value),
        backgroundColor: mockResult,
      },
    ])
  })

  it('should use custom colors', () => {
    component.data = [
      { label: 'test0', value: 1, backgroundColor: 'blue' },
      { label: 'test1', value: 2, backgroundColor: 'red' },
    ]

    component.ngOnChanges()

    expect(component.chartData?.datasets).toEqual([
      {
        data: [1, 2],
        backgroundColor: ['blue', 'red'],
      },
    ])
  })
  it('should interpolate all colors if not all items have custom colors and filling missing colors is not allowed', () => {
    const mockData = [
      { label: 'test0', value: 1, backgroundColor: 'blue' },
      { label: 'test1', value: 2 },
    ]
    const mockResult = mockData.map((v, i) => i.toString())
    jest.spyOn(ColorUtils, 'interpolateColors').mockReturnValue(mockResult)
    component.fillMissingColors = false

    component.data = mockData

    component.ngOnChanges()

    expect(component.chartData?.datasets).toEqual([
      {
        data: [1, 2],
        backgroundColor: ['0', '1'],
      },
    ])
  })
  it('should use custom colors and interpolate undefined ones if custom colors are forced', () => {
    const mockData = [
      { label: 'test0', value: 1, backgroundColor: 'blue' },
      { label: 'test1', value: 2 },
    ]
    const mockResult = mockData.map((v, i) => i.toString())
    jest.spyOn(ColorUtils, 'interpolateColors').mockReturnValue(mockResult)

    component.data = mockData

    component.ngOnChanges()

    expect(component.chartData?.datasets).toEqual([
      {
        data: [1, 2],
        backgroundColor: ['blue', '0'],
      },
    ])
  })
})


```

### File: angular-accelerator/src/lib/components/diagram/diagram.component.stories.ts

```ts

import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { SkeletonModule } from 'primeng/skeleton'
import { ChartModule } from 'primeng/chart'
import { SelectButtonModule } from 'primeng/selectbutton'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { DiagramComponent } from './diagram.component'
import { DiagramType } from '../../model/diagram-type'
import { DiagramData } from '../../model/diagram-data'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { TooltipModule } from 'primeng/tooltip';

export default {
  title: 'Components/DiagramComponent',
  component: DiagramComponent,
  argTypes: {
    diagramType: {
      options: [DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR, DiagramType.PIE],
      control: { type: 'select' },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [DiagramComponent, DynamicPipe],
      imports: [
        MenuModule,
        BreadcrumbModule,
        ButtonModule,
        SkeletonModule,
        StorybookTranslateModule,
        ChartModule,
        SelectButtonModule,
        FormsModule,
        TooltipModule,
      ],
    }),
  ],
} as Meta<DiagramComponent>

const Template: StoryFn<DiagramComponent> = (args) => ({
  props: args,
})

const mockData: DiagramData[] = [
  {
    label: 'Apples',
    value: 10,
  },
  {
    label: 'Bananas',
    value: 7,
  },
  {
    label: 'Oranges',
    value: 3,
  },
]

export const PieChart = {
  render: Template,

  args: {
    diagramType: DiagramType.PIE,
    data: mockData,
  },
}

export const HorizontalBarChart = {
  render: Template,

  args: {
    diagramType: DiagramType.HORIZONTAL_BAR,
    data: mockData,
  },
}

export const VerticalBarChart = {
  render: Template,

  args: {
    diagramType: DiagramType.VERTICAL_BAR,
    data: mockData,
  },
}

export const WithDiagramTypeSelection = {
  render: Template,
  args: {
    diagramType: DiagramType.PIE,
    data: mockData,
    supportedDiagramTypes: [DiagramType.PIE, DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR],
  },
}

const mockDataWithColors: DiagramData[] = [
  {
    label: 'Apples',
    value: 10,
    backgroundColor: 'yellow',
  },
  {
    label: 'Bananas',
    value: 7,
    backgroundColor: 'orange',
  },
  {
    label: 'Oranges',
    value: 3,
    backgroundColor: 'red',
  },
]

export const WithCustomColors = {
  render: Template,
  args: {
    diagramType: DiagramType.PIE,
    data: mockDataWithColors,
    supportedDiagramTypes: [DiagramType.PIE, DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR],
  },
}

export const WithForcedCustomColors = {
  render: Template,
  args: {
    diagramType: DiagramType.PIE,
    data: [
      ...mockData,
      {
        label: 'Peaches',
        value: 2,
        backgroundColor: 'Yellow',
      },
    ],
    supportedDiagramTypes: [DiagramType.PIE, DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR],
    fillMissingColors: true,
  },
}


```

### File: angular-accelerator/src/lib/components/diagram/diagram.component.ts

```ts

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ChartData, ChartOptions } from 'chart.js'
import * as d3 from 'd3-scale-chromatic'
import { PrimeIcons } from 'primeng/api'
import { DiagramData } from '../../model/diagram-data'
import { DiagramType } from '../../model/diagram-type'
import { ColorUtils } from '../../utils/colorutils'
import { PrimeIcon } from '../../utils/primeicon.utils'

export interface DiagramLayouts {
  id: string
  icon: PrimeIcon
  layout: DiagramType
  tooltip?: string
  tooltipKey: string
  label?: string
  labelKey: string
}

export interface DiagramComponentState {
  activeDiagramType?: DiagramType
}

const allDiagramTypes: DiagramLayouts[] = [
  {
    id: 'diagram-pie',
    icon: PrimeIcons.CHART_PIE,
    layout: DiagramType.PIE,
    tooltipKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.PIE',
    labelKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.PIE',
  },
  {
    id: 'diagram-horizontal-bar',
    icon: PrimeIcons.BARS,
    layout: DiagramType.HORIZONTAL_BAR,
    tooltipKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.HORIZONTAL_BAR',
    labelKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.HORIZONTAL_BAR',
  },
  {
    id: 'diagram-vertical-bar',
    icon: PrimeIcons.CHART_BAR,
    layout: DiagramType.VERTICAL_BAR,
    tooltipKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.VERTICAL_BAR',
    labelKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.VERTICAL_BAR',
  },
]

@Component({
  standalone: false,
  selector: 'ocx-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss'],
})
export class DiagramComponent implements OnInit, OnChanges {
  private translateService = inject(TranslateService)

  @Input() data: DiagramData[] | undefined
  @Input() sumKey = 'OCX_DIAGRAM.SUM'
  /**
   * This property determines if diagram should generate the colors for the data that does not have any set.
   *
   * Setting this property to false will result in using the provided colors only if every data item has one. In the scenario where at least one item does not have a color set, diagram will generate all colors.
   */
  @Input() fillMissingColors = true
  private _diagramType: DiagramType = DiagramType.PIE
  selectedDiagramType: DiagramLayouts | undefined
  public chartType: 'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar' = 'pie'
  @Input()
  get diagramType(): DiagramType {
    return this._diagramType
  }
  set diagramType(value: DiagramType) {
    this._diagramType = value
    this.selectedDiagramType = allDiagramTypes.find((v) => v.layout === value)
    this.chartType = this.diagramTypeToChartType(value)
  }
  private _supportedDiagramTypes: DiagramType[] = []
  @Input()
  get supportedDiagramTypes(): DiagramType[] {
    return this._supportedDiagramTypes
  }
  set supportedDiagramTypes(value: DiagramType[]) {
    this._supportedDiagramTypes = value
    this.shownDiagramTypes = allDiagramTypes.filter((vl) => this.supportedDiagramTypes.includes(vl.layout))
  }
  @Output() dataSelected: EventEmitter<any> = new EventEmitter()
  @Output() diagramTypeChanged: EventEmitter<DiagramType> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<DiagramComponentState> = new EventEmitter()
  chartOptions: ChartOptions | undefined
  chartData: ChartData | undefined
  amountOfData: number | undefined | null
  shownDiagramTypes: DiagramLayouts[] = []
  // Changing the colorRangeInfo, will change the range of the color palette of the diagram.
  private colorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false,
  }
  // Changing the colorScale, will change the thematic color appearance of the diagram.
  private colorScale = d3.interpolateCool

  ngOnChanges(): void {
    this.generateChart(this.colorScale, this.colorRangeInfo)
  }
  ngOnInit(): void {
    this.generateChart(this.colorScale, this.colorRangeInfo)
  }

  public generateChart(colorScale: any, colorRangeInfo: any) {
    if (this.data) {
      const inputData = this.data.map((diagramData) => diagramData.value)

      this.amountOfData = this.data.reduce((acc, current) => acc + current.value, 0)
      const COLORS = this.generateColors(this.data, colorScale, colorRangeInfo)
      this.chartData = {
        labels: this.data.map((data) => data.label),
        datasets: [
          {
            data: inputData,
            backgroundColor: COLORS,
          },
        ],
      }
    }

    this.chartOptions = {
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
      maintainAspectRatio: false,
      ...(this._diagramType === DiagramType.VERTICAL_BAR && {
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { precision: 0 } } },
      }),
      ...(this._diagramType === DiagramType.HORIZONTAL_BAR && {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { precision: 0 } } },
      }),
    }
  }

  generateColors(data: DiagramData[], colorScale: any, colorRangeInfo: any) {
    const dataColors = data.map((diagramData) => diagramData.backgroundColor)
    if (dataColors.filter((v) => v !== undefined).length === data.length) {
      return dataColors
    } else if (this.fillMissingColors) {
      // it is intended to generate more colors than needed, so interval for generated colors is same as amount of items on the diagram
      const interpolatedColors = interpolateColors(dataColors.length, colorScale, colorRangeInfo)
      let interpolatedIndex = 0
      return dataColors.map((color) => (color === undefined ? interpolatedColors[interpolatedIndex++] : color))
    } else {
      return interpolateColors(data.length, colorScale, colorRangeInfo)
    }
  }

  generateTotal(data: DiagramData[]): number {
    return data.reduce((acc, current) => acc + current.value, 0)
  }

  generateDiagramValueString(data: DiagramData[]): string {
    return data.map((item) => `${item.label}:${item.value}`).join(', ')
  }

  private diagramTypeToChartType(
    value: DiagramType
  ): 'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar' {
    if (value === DiagramType.PIE) return 'pie'
    else if (value === DiagramType.HORIZONTAL_BAR || value === DiagramType.VERTICAL_BAR) return 'bar'
    return 'pie'
  }

  dataClicked(event: []) {
    this.dataSelected.emit(event.length)
  }

  onDiagramTypeChanged(event: any) {
    this.diagramType = event.value.layout
    this.generateChart(this.colorScale, this.colorRangeInfo)
    this.diagramTypeChanged.emit(event.value.layout)
    this.componentStateChanged.emit({
      activeDiagramType: event.value.layout,
    })
  }
}
function interpolateColors(amountOfData: number, colorScale: any, colorRangeInfo: any) {
  return ColorUtils.interpolateColors(amountOfData, colorScale, colorRangeInfo)
}


```

## Folder: angular-accelerator/src/lib/components/dialog/dialog-content (3 files)

### File: angular-accelerator/src/lib/components/dialog/dialog-content/dialog-content.component.html

```html

<div class="buttonDialogScrollableContent">
  <ng-container #container></ng-container>
  <ng-content></ng-content>
</div>


```

### File: angular-accelerator/src/lib/components/dialog/dialog-content/dialog-content.component.spec.ts

```ts

import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing'
import { DialogContentComponent } from './dialog-content.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { Component, EventEmitter } from '@angular/core'
import {
  DialogButtonClicked,
  DialogCustomButtonsDisabled,
  DialogPrimaryButtonDisabled,
  DialogResult,
  DialogSecondaryButtonDisabled,
  DialogState,
} from '../../../services/portal-dialog.service'
import { Observable } from 'rxjs'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DialogMessageContentComponent } from '../dialog-message-content/dialog-message-content.component'
import { DivHarness, TestbedHarnessEnvironment } from '@onecx/angular-testing'
import { DialogContentHarness } from '../../../../../testing'

@Component({
  standalone: false,
  template: `<ocx-dialog-content>
    <div class="host">HostComponentContent</div>
  </ocx-dialog-content>`,
})
class TestBaseHostComponent {}

@Component({
  standalone: false,
  template: ` <div class="test">Test Component</div>`,
})
class TestWithDialogResultComponent implements DialogResult<string> {
  dialogResult = ''
}

@Component({
  standalone: false,
  template: ` <div class="test">Test Component</div>`,
})
class TestWithButtonClickedComponent implements DialogButtonClicked {
  ocxDialogButtonClicked(
    state: DialogState<unknown>
  ): boolean | void | Promise<boolean> | Observable<boolean> | undefined {
    if (this.returnUndefined) return undefined
    if (state.button === this.expectedButton) {
      return true
    }
    return false
  }

  returnUndefined = false
  expectedButton = 'primary'
}

@Component({
  standalone: false,
  template: ` <div class="test">Test Component</div>`,
})
class TestWithDialogResultAndButtonClickedComponent implements DialogResult<string>, DialogButtonClicked {
  ocxDialogButtonClicked(
    state: DialogState<unknown>
  ): boolean | void | Promise<boolean> | Observable<boolean> | undefined {
    if (state.button === this.expectedButton && state.result === this.expectedResult) {
      return true
    }
    return false
  }

  dialogResult = ''

  returnUndefined = false
  expectedButton = 'primary'
  expectedResult = ''
}

@Component({
  standalone: false,
  template: ` <div class="test">Test Component</div>`,
})
class TestWithButtonDisableComponent
  implements DialogPrimaryButtonDisabled, DialogSecondaryButtonDisabled, DialogCustomButtonsDisabled
{
  primaryState = false
  secondaryState = false
  customState = false
  customButtonEnabled: EventEmitter<{ id: string; enabled: boolean }> = new EventEmitter()
  secondaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()

  togglePrimaryButtonEnable() {
    this.primaryState = !this.primaryState
    this.primaryButtonEnabled.emit(this.primaryState)
  }

  toggleSecondaryButtonEnable() {
    this.secondaryState = !this.secondaryState
    this.secondaryButtonEnabled.emit(this.secondaryState)
  }

  toggleCustomButtonEnable() {
    this.customState = !this.customState
    this.customButtonEnabled.emit({
      id: 'id',
      enabled: this.customState,
    })
  }
}

describe('DialogContentComponent', () => {
  let component: DialogContentComponent
  let fixture: ComponentFixture<DialogContentComponent>

  let fixtureWithHost
  let harnessLoader

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogContentComponent, DialogMessageContentComponent],
      imports: [TranslateTestingModule.withTranslations({})],
      providers: [DynamicDialogConfig, DynamicDialogRef],
    }).compileComponents()

    jest.resetAllMocks()
  })

  it('should ue ng-content', async () => {
    fixtureWithHost = TestBed.createComponent(TestBaseHostComponent)
    fixtureWithHost.detectChanges()
    harnessLoader = await TestbedHarnessEnvironment.loader(fixtureWithHost)
    const contentHarness = await harnessLoader.getHarness(DialogContentHarness)

    const contentDiv = await contentHarness.getHarness(DivHarness.with({ class: 'host' }))
    expect(contentDiv).toBeDefined()
    expect(await contentDiv.getText()).toBe('HostComponentContent')
  })

  it('should close dialog with result of button click', () => {
    const buttonClickedEmitter = new EventEmitter<DialogState<unknown>>()
    const dialogConfig = TestBed.inject(DynamicDialogConfig)
    dialogConfig.data = {
      portalDialogServiceData: {
        buttonClicked$: buttonClickedEmitter,
      },
    }
    const dynamicDialogRef = TestBed.inject(DynamicDialogRef)
    const dynamicDialogRefSpy = jest.spyOn(dynamicDialogRef, 'close')

    fixture = TestBed.createComponent(DialogContentComponent)
    fixture.detectChanges()
    component = fixture.componentInstance

    const clickedState: DialogState<unknown> = {
      button: 'primary',
      result: undefined,
      id: undefined,
    }
    buttonClickedEmitter.emit(clickedState)

    expect(dynamicDialogRefSpy).toHaveBeenCalledWith(clickedState)
  })
  it('should close dialog with overwritten state result with component result if DialogResult is implemented', async () => {
    const buttonClickedEmitter = new EventEmitter<DialogState<unknown>>()
    const dialogConfig = TestBed.inject(DynamicDialogConfig)
    dialogConfig.data = {
      component: TestWithDialogResultComponent,
      portalDialogServiceData: {
        buttonClicked$: buttonClickedEmitter,
      },
    }
    const dynamicDialogRef = TestBed.inject(DynamicDialogRef)
    const dynamicDialogRefSpy = jest.spyOn(dynamicDialogRef, 'close')

    fixture = TestBed.createComponent(DialogContentComponent)
    fixture.detectChanges()
    component = fixture.componentInstance

    component.componentRef.instance.dialogResult = 'componentResult'
    buttonClickedEmitter.emit({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })

    expect(dynamicDialogRefSpy).toHaveBeenCalledWith({
      button: 'primary',
      result: 'componentResult',
      id: undefined,
    })
  })
  it('should close dialog with state result if DialogButtonClicked resulted in undefined', async () => {
    const buttonClickedEmitter = new EventEmitter<DialogState<unknown>>()
    const dialogConfig = TestBed.inject(DynamicDialogConfig)
    dialogConfig.data = {
      component: TestWithButtonClickedComponent,
      portalDialogServiceData: {
        buttonClicked$: buttonClickedEmitter,
      },
    }
    const dynamicDialogRef = TestBed.inject(DynamicDialogRef)
    const dynamicDialogRefSpy = jest.spyOn(dynamicDialogRef, 'close')

    fixture = TestBed.createComponent(DialogContentComponent)
    fixture.detectChanges()
    component = fixture.componentInstance

    component.componentRef.instance.returnUndefined = true
    buttonClickedEmitter.emit({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })

    expect(dynamicDialogRefSpy).toHaveBeenCalledWith({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })
  })
  it('should close dialog with overwritten state result if DialogButtonClicked resulted in undefined', async () => {
    const buttonClickedEmitter = new EventEmitter<DialogState<unknown>>()
    const dialogConfig = TestBed.inject(DynamicDialogConfig)
    dialogConfig.data = {
      component: TestWithButtonClickedComponent,
      portalDialogServiceData: {
        buttonClicked$: buttonClickedEmitter,
      },
    }
    const dynamicDialogRef = TestBed.inject(DynamicDialogRef)
    const dynamicDialogRefSpy = jest.spyOn(dynamicDialogRef, 'close')

    fixture = TestBed.createComponent(DialogContentComponent)
    fixture.detectChanges()
    component = fixture.componentInstance

    component.componentRef.instance.returnUndefined = true

    buttonClickedEmitter.emit({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })

    expect(dynamicDialogRefSpy).toHaveBeenCalledWith({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })
  })
  it('should close dialog with state result if DialogButtonClicked resulted in true', fakeAsync(() => {
    const buttonClickedEmitter = new EventEmitter<DialogState<unknown>>()
    const dialogConfig = TestBed.inject(DynamicDialogConfig)
    dialogConfig.data = {
      component: TestWithButtonClickedComponent,
      portalDialogServiceData: {
        buttonClicked$: buttonClickedEmitter,
      },
    }
    const dynamicDialogRef = TestBed.inject(DynamicDialogRef)
    const dynamicDialogRefSpy = jest.spyOn(dynamicDialogRef, 'close')

    fixture = TestBed.createComponent(DialogContentComponent)
    fixture.detectChanges()
    component = fixture.componentInstance

    component.componentRef.instance.expectedButton = 'primary'

    buttonClickedEmitter.emit({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })

    flush()

    expect(dynamicDialogRefSpy).toHaveBeenCalledWith({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })
  }))
  it('should close dialog with overwritten state result if DialogButtonClicked resulted in true', fakeAsync(() => {
    const buttonClickedEmitter = new EventEmitter<DialogState<unknown>>()
    const dialogConfig = TestBed.inject(DynamicDialogConfig)
    dialogConfig.data = {
      component: TestWithDialogResultAndButtonClickedComponent,
      portalDialogServiceData: {
        buttonClicked$: buttonClickedEmitter,
      },
    }
    const dynamicDialogRef = TestBed.inject(DynamicDialogRef)
    const dynamicDialogRefSpy = jest.spyOn(dynamicDialogRef, 'close')

    fixture = TestBed.createComponent(DialogContentComponent)
    fixture.detectChanges()
    component = fixture.componentInstance

    component.componentRef.instance.expectedButton = 'primary'
    component.componentRef.instance.expectedResult = 'my-result'
    component.componentRef.instance.dialogResult = 'my-result'

    buttonClickedEmitter.emit({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })

    flush()

    expect(dynamicDialogRefSpy).toHaveBeenCalledWith({
      button: 'primary',
      result: 'my-result',
      id: undefined,
    })
  }))
  it('should not close dialog if DialogButtonClicked resulted in false', async () => {
    const buttonClickedEmitter = new EventEmitter<DialogState<unknown>>()
    const dialogConfig = TestBed.inject(DynamicDialogConfig)
    dialogConfig.data = {
      component: TestWithDialogResultAndButtonClickedComponent,
      portalDialogServiceData: {
        buttonClicked$: buttonClickedEmitter,
      },
    }
    const dynamicDialogRef = TestBed.inject(DynamicDialogRef)
    const dynamicDialogRefSpy = jest.spyOn(dynamicDialogRef, 'close')

    fixture = TestBed.createComponent(DialogContentComponent)
    fixture.detectChanges()
    component = fixture.componentInstance

    component.componentRef.instance.expectedButton = 'primary'
    component.componentRef.instance.expectedResult = 'my-result'
    component.componentRef.instance.dialogResult = 'my-other-result'

    buttonClickedEmitter.emit({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })

    expect(dynamicDialogRefSpy).toHaveBeenCalledTimes(0)
  })

  describe('buttons enablement', () => {
    it('should emit when primary button enablement changes', () => {
      const primaryButtonEnabledEmitter = new EventEmitter<boolean>()
      const dialogConfig = TestBed.inject(DynamicDialogConfig)
      dialogConfig.data = {
        component: TestWithButtonDisableComponent,
        portalDialogServiceData: {
          primaryButtonEnabled$: primaryButtonEnabledEmitter,
          buttonClicked$: new EventEmitter(),
        },
      }

      fixture = TestBed.createComponent(DialogContentComponent)
      fixture.detectChanges()
      component = fixture.componentInstance

      const emitterSpy = jest.spyOn(primaryButtonEnabledEmitter, 'emit')
      component.componentRef.instance.togglePrimaryButtonEnable()

      expect(emitterSpy).toHaveBeenCalledWith(true)
    })
    it('should emit when secondary button enablement changes', () => {
      const secondaryButtonEnabledEmitter = new EventEmitter<boolean>()
      const dialogConfig = TestBed.inject(DynamicDialogConfig)
      dialogConfig.data = {
        component: TestWithButtonDisableComponent,
        portalDialogServiceData: {
          secondaryButtonEnabled$: secondaryButtonEnabledEmitter,
          buttonClicked$: new EventEmitter(),
        },
      }

      fixture = TestBed.createComponent(DialogContentComponent)
      fixture.detectChanges()
      component = fixture.componentInstance

      const emitterSpy = jest.spyOn(secondaryButtonEnabledEmitter, 'emit')
      component.componentRef.instance.toggleSecondaryButtonEnable()

      expect(emitterSpy).toHaveBeenCalledWith(true)
    })
    it('should emit when custom button enablement changes', () => {
      const customButtonEnabledEmitter = new EventEmitter<{ id: string; enabled: boolean }>()
      const dialogConfig = TestBed.inject(DynamicDialogConfig)
      dialogConfig.data = {
        component: TestWithButtonDisableComponent,
        portalDialogServiceData: {
          customButtonEnabled$: customButtonEnabledEmitter,
          buttonClicked$: new EventEmitter(),
        },
      }

      fixture = TestBed.createComponent(DialogContentComponent)
      fixture.detectChanges()
      component = fixture.componentInstance

      const emitterSpy = jest.spyOn(customButtonEnabledEmitter, 'emit')
      component.componentRef.instance.toggleCustomButtonEnable()

      expect(emitterSpy).toHaveBeenCalledWith({
        id: 'id',
        enabled: true,
      })
    })
  })
})


```

### File: angular-accelerator/src/lib/components/dialog/dialog-content/dialog-content.component.ts

```ts

import { Component, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef, inject } from '@angular/core'
import { Observable, Subscription, from, isObservable, of, startWith } from 'rxjs'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ButtonDialogData } from '../../../model/button-dialog'
import { DialogMessageContentComponent } from '../dialog-message-content/dialog-message-content.component'
import {
  DialogButtonClicked,
  DialogCustomButtonsDisabled,
  DialogPrimaryButtonDisabled,
  DialogResult,
  DialogSecondaryButtonDisabled,
  PortalDialogServiceData,
} from '../../../services/portal-dialog.service'

@Component({
  standalone: false,
  selector: 'ocx-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss'],
})
export class DialogContentComponent implements OnInit, OnDestroy {
  dynamicDialogConfig = inject(DynamicDialogConfig)
  dynamicDialogRef = inject(DynamicDialogRef)

  defaultDialogData: ButtonDialogData = {
    component: DialogMessageContentComponent,
    config: {},
    componentData: {},
  }

  @ViewChild('container', { static: true, read: ViewContainerRef })
  dialogHost!: ViewContainerRef

  dialogData: ButtonDialogData = this.defaultDialogData
  componentRef!: ComponentRef<any>

  primaryButtonEnabledSub?: Subscription
  secondaryButtonEnabledSub?: Subscription
  customButtonEnabledSub?: Subscription
  buttonClickedSub?: Subscription

  ngOnInit(): void {
    this.loadComponent()
  }

  ngOnDestroy(): void {
    this.primaryButtonEnabledSub?.unsubscribe()
    this.secondaryButtonEnabledSub?.unsubscribe()
    this.customButtonEnabledSub?.unsubscribe()
    this.buttonClickedSub?.unsubscribe()
  }

  loadComponent() {
    if (this.dynamicDialogConfig.data) {
      this.setUpDialogDataForDynamicConfig()
    }
  }

  setUpDialogDataForDynamicConfig() {
    const dynamicConfigData: ButtonDialogData = this.dynamicDialogConfig.data
    const portalDialogServiceData: PortalDialogServiceData = this.dynamicDialogConfig.data.portalDialogServiceData
    if (dynamicConfigData.component) {
      this.dialogData.component = dynamicConfigData.component
    }
    if (dynamicConfigData.componentData) {
      this.dialogData.componentData = dynamicConfigData.componentData
    }

    const viewContainerRef = this.dialogHost
    viewContainerRef.clear()

    this.buttonClickedSub = portalDialogServiceData.buttonClicked$.subscribe((state) => {
      const component = this.componentRef.instance

      const hasDialogResult = this.isDialogResultImplemented(component)
      if (hasDialogResult) {
        state.result = component.dialogResult
      }
      const closeResult = state
      // check if component implements DialogButtonClicked
      if (this.isDialogButtonClickedImplemented(component)) {
        const buttonResult = component.ocxDialogButtonClicked(state)
        // If undefined or void is returned, close dialog and return result
        if (buttonResult === undefined) {
          if (hasDialogResult) {
            closeResult.result = component.dialogResult
          }
          return this.dynamicDialogRef.close(closeResult)
        }
        this.toObservable(buttonResult).subscribe((result: boolean) => {
          if (result === true) {
            if (hasDialogResult) {
              closeResult.result = component.dialogResult
            }
            this.dynamicDialogRef.close(closeResult)
          }
        })
      } else {
        return this.dynamicDialogRef.close(closeResult)
      }
    })

    if (this.dialogData.component) {
      const componentRef = viewContainerRef.createComponent<any>(this.dialogData.component)

      if (this.isDialogPrimaryButtonDisabledImplemented(componentRef.instance)) {
        this.primaryButtonEnabledSub = componentRef.instance.primaryButtonEnabled
          .pipe(startWith(false))
          .subscribe((isEnabled) => {
            portalDialogServiceData.primaryButtonEnabled$.emit(isEnabled)
          })
      }
      if (this.isDialogSecondaryButtonDisabledImplemented(componentRef.instance)) {
        this.secondaryButtonEnabledSub = componentRef.instance.secondaryButtonEnabled
          .pipe(startWith(false))
          .subscribe((isEnabled) => {
            portalDialogServiceData.secondaryButtonEnabled$.emit(isEnabled)
          })
      }
      if (this.isDialogCustomButtonDisabledImplemented(componentRef.instance)) {
        this.customButtonEnabledSub = componentRef.instance.customButtonEnabled.subscribe((buttonEnabled) => {
          portalDialogServiceData.customButtonEnabled$.emit(buttonEnabled)
        })
      }

      //populate container
      Object.keys(this.dialogData.componentData).forEach((k) => {
        componentRef.setInput(k, this.dialogData.componentData[k])
      })
      this.componentRef = componentRef
    }
  }

  private toObservable(
    ocxDialogButtonClickedResult: boolean | Observable<boolean> | Promise<boolean> | undefined
  ): Observable<boolean> {
    if (ocxDialogButtonClickedResult === undefined) {
      return of(true)
    }
    if (isObservable(ocxDialogButtonClickedResult)) {
      return ocxDialogButtonClickedResult
    }
    return from(Promise.resolve(ocxDialogButtonClickedResult))
  }

  private isDialogResultImplemented(component: any): component is DialogResult<unknown> {
    return 'dialogResult' in component
  }

  private isDialogButtonClickedImplemented(component: any): component is DialogButtonClicked {
    return typeof component.ocxDialogButtonClicked === 'function'
  }

  private isDialogPrimaryButtonDisabledImplemented(component: any): component is DialogPrimaryButtonDisabled {
    return 'primaryButtonEnabled' in component
  }

  private isDialogSecondaryButtonDisabledImplemented(component: any): component is DialogSecondaryButtonDisabled {
    return 'secondaryButtonEnabled' in component
  }

  private isDialogCustomButtonDisabledImplemented(component: any): component is DialogCustomButtonsDisabled {
    return 'customButtonEnabled' in component
  }
}


```

## Folder: angular-accelerator/src/lib/components/dialog/dialog-footer (3 files)

### File: angular-accelerator/src/lib/components/dialog/dialog-footer/dialog-footer.component.html

```html

<div class="w-full flex-row justify-content-end flex flex-wrap gap-2">
  @for (button of leftCustomButtons; track button; let i = $index) {
    <div [ngStyle]="{'margin-right': (i === leftCustomButtons.length - 1) ? 'auto' : 0}">
      <ng-container *ngTemplateOutlet="customButtonTemplate; context: {button: button}"> </ng-container>
    </div>
  }
  @for (button of rightCustomButtons; track button) {
    <div>
      <ng-container *ngTemplateOutlet="customButtonTemplate; context: {button: button}"> </ng-container>
    </div>
  }
  <div>
    @if (dialogData.config.secondaryButtonIncluded) {
      <button
        #secondaryButton
        id="{{dialogData.config.secondaryButtonDetails?.id ?? 'buttonDialogSecondaryButton'}}"
        pButton
        [icon]="dialogData.config.secondaryButtonDetails!.icon !== undefined ? dialogData.config.secondaryButtonDetails!.icon : ''"
        (click)="secondaryButtonAction()"
        [label]="dialogData.config.secondaryButtonDetails!.key | translate:dialogData.config.secondaryButtonDetails?.parameters"
        [disabled]="secondaryButtonDisabled$ | async"
        pTooltip="dialogData.config.secondaryButtonDetails!.tooltipKey ? (dialogData.config.secondaryButtonDetails!.tooltipKey | translate) : null"
        tooltipPosition="dialogData.config.secondaryButtonDetails?.tooltipPosition ?? ''"
        [attr.aria-label]="dialogData.config.secondaryButtonDetails!.key | translate:dialogData.config.secondaryButtonDetails?.parameters"
      ></button>
    }
  </div>
  <div>
    <button
      #primaryButton
      id="{{dialogData.config.primaryButtonDetails?.id ?? 'buttonDialogPrimaryButton'}}"
      pButton
      autofocus
      [icon]="dialogData.config.primaryButtonDetails!.icon !== undefined ? dialogData.config.primaryButtonDetails!.icon : ''"
      (click)="primaryButtonAction()"
      [label]="dialogData.config.primaryButtonDetails!.key | translate:dialogData.config.primaryButtonDetails?.parameters"
      [disabled]="primaryButtonDisabled$ | async"
      pTooltip="dialogData.config.primaryButtonDetails!.tooltipKey ? (dialogData.config.primaryButtonDetails!.tooltipKey | translate) : null"
      tooltipPosition="dialogData.config.primaryButtonDetails?.tooltipPosition ?? ''"
      [attr.aria-label]="dialogData.config.primaryButtonDetails!.key | translate:dialogData.config.primaryButtonDetails?.parameters"
    ></button>
  </div>
</div>

<ng-template #customButtonTemplate let-button="button">
  <button
    #customButton
    id="{{button.id}}"
    pButton
    [icon]="button.icon !== undefined ? button.icon : ''"
    (click)="customButtonAction(button)"
    [label]="button.key | translate:button.parameters"
    [disabled]="resolveCustomButtonDisabled((customButtonsDisabled$ | async) ?? {}, button.id)"
    pTooltip="button.tooltipKey ? (button.tooltipKey | translate) : null"
    tooltipPosition="button.tooltipPosition ?? ''"
    [attr.aria-label]="button.key | translate:button.parameters"
  ></button>
</ng-template>


```

### File: angular-accelerator/src/lib/components/dialog/dialog-footer/dialog-footer.component.spec.ts

```ts

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DialogFooterComponent } from './dialog-footer.component'
import { ButtonModule } from 'primeng/button'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { PrimeIcons } from 'primeng/api'
import { DialogFooterHarness, TestbedHarnessEnvironment } from '../../../../../testing'

describe('DialogFooterComponent', () => {
  let component: DialogFooterComponent
  let fixture: ComponentFixture<DialogFooterComponent>
  let dialogFooterHarness: DialogFooterHarness

  const translations: any = {
    CUSTOM_PRI: 'primaryTranslation',
    CUSTOM_SEC: 'secondaryTranslation',
    CUSTOM_PRI_PARAM: 'primary-{{val}}',
    CUSTOM_SEC_PARAM: 'secondary-{{val}}',
    OCX_BUTTON_DIALOG: {
      CONFIRM: 'Confirm',
      CANCEL: 'Cancel',
    },
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogFooterComponent],
      imports: [
        ButtonModule,
        TranslateTestingModule.withTranslations({
          en: translations,
        }),
      ],
      providers: [DynamicDialogConfig, DynamicDialogRef],
    }).compileComponents()
    fixture = TestBed.createComponent(DialogFooterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    dialogFooterHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, DialogFooterHarness)
  })

  it('should create dialog-footer component', () => {
    expect(component).toBeTruthy()
  })

  it('should create default dialog-footer without passing config', async () => {
    // expect correct default initialization
    expect(component.dialogData.component).toEqual(undefined)
    expect(component.dialogData.componentData).toEqual({})
    expect(component.dialogData.config.primaryButtonDetails).toEqual(component.defaultPrimaryButtonDetails)
    expect(component.dialogData.config.secondaryButtonIncluded).toEqual(true)
    expect(component.dialogData.config.secondaryButtonDetails).toEqual(component.defaultSecondaryButtonDetails)

    // expect default emitted value to be label
    jest.spyOn(component.buttonClickedEmitter, 'emit')
    await dialogFooterHarness.clickPrimaryButton()

    expect(component.buttonClickedEmitter.emit).toHaveBeenCalledWith({
      button: 'primary',
      result: undefined,
      id: undefined,
    })

    jest.resetAllMocks()

    await dialogFooterHarness.clickSecondaryButton()

    expect(component.buttonClickedEmitter.emit).toHaveBeenCalledWith({
      button: 'secondary',
      result: undefined,
      id: undefined,
    })

    // expect default label
    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('Confirm')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('Cancel')
    // expect no icon
    expect(await dialogFooterHarness.getPrimaryButtonIcon()).toBe('')
    expect(await dialogFooterHarness.getSecondaryButtonIcon()).toBe('')
  })

  it('should create customized button-dialog with passing config', async () => {
    component.dialogData.config = {
      primaryButtonDetails: {
        key: 'CustomMain',
        icon: PrimeIcons.CHECK,
      },
      secondaryButtonIncluded: true,
      secondaryButtonDetails: {
        key: 'CustomSide',
        icon: PrimeIcons.TIMES,
      },
    }

    // expect correct label
    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('CustomMain')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('CustomSide')
    // expect correct icon
    expect(await dialogFooterHarness.getPrimaryButtonIcon()).toBe(PrimeIcons.CHECK)
    expect(await dialogFooterHarness.getSecondaryButtonIcon()).toBe(PrimeIcons.TIMES)
  })

  it('should translate button keys', async () => {
    component.dialogData.config = {
      primaryButtonDetails: {
        key: 'CUSTOM_PRI',
      },
      secondaryButtonIncluded: true,
      secondaryButtonDetails: {
        key: 'CUSTOM_SEC',
      },
    }

    // expect correct label
    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe(translations['CUSTOM_PRI'])
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe(translations['CUSTOM_SEC'])
  })

  it('should translate button keys with parameters', async () => {
    component.dialogData.config = {
      primaryButtonDetails: {
        key: 'CUSTOM_PRI_PARAM',
        parameters: {
          val: 'firstParam',
        },
      },
      secondaryButtonIncluded: true,
      secondaryButtonDetails: {
        key: 'CUSTOM_SEC_PARAM',
        parameters: {
          val: 'secondParam',
        },
      },
    }

    // expect correct label
    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('primary-firstParam')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('secondary-secondParam')
  })

  it('should create Confirm/Cancel button-dialog when sideButton is enabled', async () => {
    component.dialogData.config.secondaryButtonIncluded = true

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('Confirm')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('Cancel')
  })

  it('should create Confirm only button-dialog when sideButton is disabled', async () => {
    component.dialogData.config.secondaryButtonIncluded = false

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('Confirm')
    expect(await dialogFooterHarness.getSecondaryButton()).toBeNull()
  })

  it('should create CustmMain/Cancel button-dialog when mainButton is defined', async () => {
    component.dialogData.config.primaryButtonDetails = {
      key: 'CustomMain',
    }

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('CustomMain')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('Cancel')
  })

  it('should create Confirm/CustomSide button-dialog when sideButton is defined', async () => {
    component.dialogData.config.secondaryButtonDetails = {
      key: 'CustomSide',
    }

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('Confirm')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('CustomSide')
  })

  it('should create CustomMain/CustomSide button-dialog when both buttons are defined', async () => {
    component.dialogData.config.primaryButtonDetails = {
      key: 'CustomMain',
    }
    component.dialogData.config.secondaryButtonDetails = {
      key: 'CustomSide',
    }

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('CustomMain')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('CustomSide')
  })

  it('should create CustomMain only button-dialog when sideButton is disabled', async () => {
    component.dialogData.config.primaryButtonDetails = {
      key: 'CustomMain',
    }
    component.dialogData.config.secondaryButtonIncluded = false

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('CustomMain')
    expect(await dialogFooterHarness.getSecondaryButton()).toBeNull()
  })

  it('should create CustomMain/Cancel button-dialog when sideButton is enabled', async () => {
    component.dialogData.config.primaryButtonDetails = {
      key: 'CustomMain',
    }
    component.dialogData.config.secondaryButtonIncluded = true

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('CustomMain')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('Cancel')
  })

  it('should create Confirm only button-dialog when sideButton is defined but is disabled', async () => {
    component.dialogData.config.secondaryButtonDetails = {
      key: 'CustomSide',
    }
    component.dialogData.config.secondaryButtonIncluded = false

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('Confirm')
    expect(await dialogFooterHarness.getSecondaryButton()).toBeNull()
  })

  it('should create Confirm/CustomSide button-dialog when sideButton is defined and enabled', async () => {
    component.dialogData.config.secondaryButtonDetails = {
      key: 'CustomSide',
    }
    component.dialogData.config.secondaryButtonIncluded = true

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('Confirm')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('CustomSide')
  })

  it('should create CustomMain only button-dialog when sideButton is defined but is disabled', async () => {
    component.dialogData.config = {
      primaryButtonDetails: {
        key: 'CustomMain',
      },
      secondaryButtonDetails: {
        key: 'CustomSide',
      },
      secondaryButtonIncluded: false,
    }

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('CustomMain')
    expect(await dialogFooterHarness.getSecondaryButton()).toBeNull()
  })
})


```

### File: angular-accelerator/src/lib/components/dialog/dialog-footer/dialog-footer.component.ts

```ts

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  inject,
} from '@angular/core'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { BehaviorSubject, Observable, map, withLatestFrom } from 'rxjs'
import {
  ButtonDialogButtonDetails,
  ButtonDialogConfig,
  ButtonDialogCustomButtonDetails,
  ButtonDialogData,
} from '../../../model/button-dialog'
import {
  DialogState,
  DialogStateButtonClicked,
  PortalDialogServiceData,
} from '../../../services/portal-dialog.service'

@Component({
  standalone: false,
  selector: 'ocx-dialog-footer',
  templateUrl: './dialog-footer.component.html',
  styleUrls: ['./dialog-footer.component.scss'],
})
export class DialogFooterComponent implements OnInit, AfterViewInit {
  dynamicDialogConfig = inject(DynamicDialogConfig)
  dynamicDialogRef = inject(DynamicDialogRef)

  defaultPrimaryButtonDetails: ButtonDialogButtonDetails = {
    key: 'OCX_BUTTON_DIALOG.CONFIRM',
  }

  defaultSecondaryButtonDetails: ButtonDialogButtonDetails = {
    key: 'OCX_BUTTON_DIALOG.CANCEL',
  }

  defaultDialogData: ButtonDialogData = {
    config: {
      primaryButtonDetails: this.defaultPrimaryButtonDetails,
      secondaryButtonIncluded: true,
      secondaryButtonDetails: this.defaultSecondaryButtonDetails,
    },
    componentData: {},
  }

  @Input() config: ButtonDialogConfig = {}

  dialogData: ButtonDialogData = this.defaultDialogData
  primaryButtonDisabled$: Observable<boolean | undefined> | undefined
  secondaryButtonDisabled$: Observable<boolean | undefined> | undefined
  customButtonsDisabled$: BehaviorSubject<Record<string, boolean>> = new BehaviorSubject({})
  leftCustomButtons: ButtonDialogCustomButtonDetails[] = []
  rightCustomButtons: ButtonDialogCustomButtonDetails[] = []

  @Output() buttonClickedEmitter: EventEmitter<DialogState<unknown>> = new EventEmitter()

  @ViewChild('primaryButton', { static: true, read: ViewContainerRef })
  primaryButton!: ViewContainerRef
  _secondaryButton!: ViewContainerRef
  @ViewChild('secondaryButton', { static: false, read: ViewContainerRef })
  set secondaryButton(content: ViewContainerRef) {
    if (content) {
      this._secondaryButton = content
    }
  }
  get secondaryButton(): ViewContainerRef {
    return this._secondaryButton
  }
  @ViewChildren('customButton') customButtons!: QueryList<ElementRef>

  ngAfterViewInit(): void {
    if (!(this.dynamicDialogConfig.data && this.dynamicDialogConfig.data.config)) return

    const config = this.dynamicDialogConfig.data.config
    if (config.autoFocusButton === 'primary') {
      this.primaryButton.element.nativeElement.focus()
    } else if (config.autoFocusButton === 'secondary') {
      this.secondaryButton.element.nativeElement.focus()
    } else if (config.autoFocusButton === 'custom') {
      const button = this.customButtons.find((customButton) => {
        return customButton.nativeElement.id === config.autoFocusButtonCustomId
      })
      setTimeout(() => {
        button?.nativeElement.focus()
      })
    }
  }

  ngOnInit(): void {
    this.loadComponent()
  }

  primaryButtonAction() {
    return this.buttonAction('primary')
  }

  secondaryButtonAction() {
    return this.buttonAction('secondary')
  }

  customButtonAction(button: ButtonDialogCustomButtonDetails) {
    return this.buttonAction(`custom`, button.id)
  }

  resolveCustomButtonDisabled(customButtonsDisabled: Record<string, boolean>, buttonId: string) {
    return buttonId in customButtonsDisabled ? customButtonsDisabled[buttonId] : true
  }

  loadComponent() {
    if (this.dynamicDialogConfig.data) {
      this.setUpDialogDataForDynamicConfig()
    } else {
      this.setUpDialogDataForInput()
    }
  }

  setUpDialogDataForInput() {
    if (this.config) {
      if (!!this.config.primaryButtonDetails && !!this.config.primaryButtonDetails.key) {
        this.dialogData.config.primaryButtonDetails = this.config.primaryButtonDetails
      }
      if (this.config.secondaryButtonIncluded) {
        this.dialogData.config.secondaryButtonIncluded = this.config.secondaryButtonIncluded
      }
      if (!!this.config.secondaryButtonDetails && !!this.config.secondaryButtonDetails.key) {
        this.dialogData.config.secondaryButtonDetails = this.config.secondaryButtonDetails
      }
    }
    this.dialogData.config.customButtons = this.config.customButtons
    this.setupCustomButtons(this.dialogData)
  }

  setUpDialogDataForDynamicConfig() {
    const dynamicConfigData: ButtonDialogData = this.dynamicDialogConfig.data
    const portalDialogServiceData: PortalDialogServiceData = this.dynamicDialogConfig.data.portalDialogServiceData
    if (dynamicConfigData.config) {
      const dialogConfig = dynamicConfigData.config
      if (!!dialogConfig.primaryButtonDetails && !!dialogConfig.primaryButtonDetails.key) {
        this.dialogData.config.primaryButtonDetails = dialogConfig.primaryButtonDetails
      }
      if (dialogConfig.secondaryButtonIncluded !== undefined) {
        this.dialogData.config.secondaryButtonIncluded = dialogConfig.secondaryButtonIncluded
      }
      if (!!dialogConfig.secondaryButtonDetails && !!dialogConfig.secondaryButtonDetails.key) {
        this.dialogData.config.secondaryButtonDetails = dialogConfig.secondaryButtonDetails
      }
    }

    this.setupCustomButtons(dynamicConfigData)

    this.primaryButtonDisabled$ = portalDialogServiceData.primaryButtonEnabled$.pipe(map((isEnabled) => !isEnabled))
    this.secondaryButtonDisabled$ = portalDialogServiceData.secondaryButtonEnabled$.pipe(map((isEnabled) => !isEnabled))

    const initCustomButtons: Record<string, boolean> = {}
    this.rightCustomButtons.concat(this.leftCustomButtons).map((button) => {
      initCustomButtons[button.id] = true
    })
    this.customButtonsDisabled$.next(initCustomButtons)
    portalDialogServiceData.customButtonEnabled$
      .pipe(
        withLatestFrom(this.customButtonsDisabled$),
        map(([buttonEnabled, customButtonsDisabled]) => {
          if (customButtonsDisabled[buttonEnabled.id] !== !buttonEnabled.enabled) {
            customButtonsDisabled[buttonEnabled.id] = !buttonEnabled.enabled
          }
          return customButtonsDisabled
        })
      )
      .subscribe(this.customButtonsDisabled$)

    this.buttonClickedEmitter = portalDialogServiceData.buttonClicked$
  }

  private buttonAction(resultButtonClickedName: DialogStateButtonClicked, buttonId?: string) {
    const state: DialogState<unknown> = {
      button: resultButtonClickedName,
      result: undefined,
      id: buttonId,
    }

    this.buttonClickedEmitter?.emit(state)
  }

  private setupCustomButtons(dialogData: ButtonDialogData) {
    this.leftCustomButtons = dialogData.config.customButtons?.filter((button) => button.alignment === 'left') ?? []
    this.rightCustomButtons = dialogData.config.customButtons?.filter((button) => button.alignment === 'right') ?? []
  }
}


```

## Folder: angular-accelerator/src/lib/components/dialog/dialog-inline (4 files)

### File: angular-accelerator/src/lib/components/dialog/dialog-inline/dialog-inline.component.html

```html

<div>
  <ocx-dialog-content>
    <ng-content></ng-content>
  </ocx-dialog-content>
  <ocx-dialog-footer [config]="config" (buttonClickedEmitter)="buttonClicked($event)"></ocx-dialog-footer>
</div>


```

### File: angular-accelerator/src/lib/components/dialog/dialog-inline/dialog-inline.component.spec.ts

```ts

import { Component, Input } from '@angular/core'
import { ButtonDialogConfig } from '../../../model/button-dialog'
import { PrimeIcons } from 'primeng/api'
import { DialogInlineComponent } from './dialog-inline.component'
import { TestBed } from '@angular/core/testing'
import {
  DialogContentHarness,
  DialogFooterHarness,
  DivHarness,
  TestbedHarnessEnvironment,
} from '../../../../../testing'
import { DialogFooterComponent } from '../dialog-footer/dialog-footer.component'
import { DialogContentComponent } from '../dialog-content/dialog-content.component'
import { ButtonModule } from 'primeng/button'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

@Component({
  standalone: false,
  template: `<ocx-dialog-inline>
    <div class="host">HostComponentContent</div>
  </ocx-dialog-inline>`,
})
class TestBaseHostComponent {}

const config: ButtonDialogConfig = {
  primaryButtonDetails: {
    key: 'inlineMain',
    icon: PrimeIcons.PLUS,
  },
  secondaryButtonIncluded: true,
  secondaryButtonDetails: {
    key: 'inlineSide',
    icon: PrimeIcons.TIMES,
  },
}

@Component({
  standalone: false,
  template: ` <ocx-dialog-inline [config]="this.buttonDialogConfig">
    <div class="host">HostComponentContent</div>
  </ocx-dialog-inline>`,
})
class TestHostWithConfigComponent {
  @Input() buttonDialogConfig: ButtonDialogConfig = config
}

@Component({
  standalone: false,
  template: ` <ocx-dialog-inline (resultEmitter)="handleResult($event)">
    <div class="host">HostComponentContent</div>
  </ocx-dialog-inline>`,
})
class TestHostWithResultSubComponent {
  @Input() buttonDialogConfig: ButtonDialogConfig = config
  public handleResult(result: any): void {
    console.log(result)
  }
}

describe('DialogInlineComponent', () => {
  const translations: any = {
    CUSTOM_PRI: 'primaryTranslation',
    CUSTOM_SEC: 'secondaryTranslation',
    CUSTOM_PRI_PARAM: 'primary-{{val}}',
    CUSTOM_SEC_PARAM: 'secondary-{{val}}',
    OCX_BUTTON_DIALOG: {
      CONFIRM: 'Confirm',
      CANCEL: 'Cancel',
    },
  }

  let fixtureWithHost
  let harnessLoader

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DialogInlineComponent,
        DialogFooterComponent,
        DialogContentComponent,
        TestHostWithConfigComponent,
        TestBaseHostComponent,
        TestHostWithResultSubComponent,
      ],
      imports: [
        ButtonModule,
        TranslateTestingModule.withTranslations({
          en: translations,
        }),
      ],
      providers: [DynamicDialogConfig, DynamicDialogRef],
    }).compileComponents()
  })

  it('should use ng-content', async () => {
    fixtureWithHost = TestBed.createComponent(TestBaseHostComponent)
    fixtureWithHost.detectChanges()
    harnessLoader = await TestbedHarnessEnvironment.loader(fixtureWithHost)
    const contentHarness = await harnessLoader.getHarness(DialogContentHarness)

    const contentDiv = await contentHarness.getHarness(DivHarness.with({ class: 'host' }))
    expect(contentDiv).toBeDefined()
    expect(await contentDiv.getText()).toBe('HostComponentContent')
  })

  it('should use passed config', async () => {
    fixtureWithHost = TestBed.createComponent(TestHostWithConfigComponent)
    fixtureWithHost.detectChanges()
    harnessLoader = await TestbedHarnessEnvironment.loader(fixtureWithHost)
    const footerHarness = await harnessLoader.getHarness(DialogFooterHarness)

    expect(await footerHarness.getPrimaryButtonLabel()).toBe('inlineMain')
    expect(await footerHarness.getPrimaryButtonIcon()).toBe(PrimeIcons.PLUS)
    expect(await footerHarness.getSecondaryButtonLabel()).toBe('inlineSide')
    expect(await footerHarness.getSecondaryButtonIcon()).toBe(PrimeIcons.TIMES)
  })

  it('should use default emitter inline', async () => {
    await TestBed.compileComponents()
    fixtureWithHost = TestBed.createComponent(TestHostWithResultSubComponent)
    fixtureWithHost.detectChanges()
    const footerHarness = await TestbedHarnessEnvironment.harnessForFixture(fixtureWithHost, DialogFooterHarness)

    jest.spyOn(console, 'log')

    await footerHarness.clickPrimaryButton()
    expect(console.log).toHaveBeenCalledWith('primary')

    jest.resetAllMocks()

    await footerHarness.clickSecondaryButton()
    expect(console.log).toHaveBeenCalledWith('secondary')
  })
})


```

### File: angular-accelerator/src/lib/components/dialog/dialog-inline/dialog-inline.component.stories.ts

```ts

import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, applicationConfig, argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular'
import { StorybookTranslateModule } from '../../../storybook-translate.module'
import { ButtonModule } from 'primeng/button'
import { PrimeIcons } from 'primeng/api'
import { DialogInlineComponent } from './dialog-inline.component'
import { DialogContentComponent } from '../dialog-content/dialog-content.component'
import { DialogFooterComponent } from '../dialog-footer/dialog-footer.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { TooltipModule } from 'primeng/tooltip'
import { StorybookThemeModule } from '../../../storybook-theme.module'

export default {
  title: 'Components/DialogInlineComponent',
  component: DialogInlineComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookThemeModule),
        DynamicDialogConfig,
        DynamicDialogRef,
      ],
    }),
    moduleMetadata({
      declarations: [DialogInlineComponent, DialogContentComponent, DialogFooterComponent],
      imports: [StorybookTranslateModule, ButtonModule, TooltipModule],
    }),
    componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`),
  ],
} as Meta<DialogInlineComponent>

export const DialogInlineDefaultButtons = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
          <ocx-dialog-inline>
              <p>My message to display</p>
          </ocx-dialog-inline>
      `,
  }),
  args: {},
}

export const DialogInlineWithButtons = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-dialog-inline ${argsToTemplate(args)}>
            <p>My message to display</p>
        </ocx-dialog-inline>
    `,
  }),
  args: {
    config: {
      primaryButtonDetails: {
        key: 'KEY',
        icon: PrimeIcons.BOOK,
      },
      secondaryButtonIncluded: true,
      secondaryButtonDetails: {
        key: 'Times',
        icon: PrimeIcons.TIMES,
      },
    },
  },
}

export const DialogInlineWithCustomButtons = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
          <ocx-dialog-inline ${argsToTemplate(args)}>
              <p>My message to display</p>
          </ocx-dialog-inline>
      `,
  }),
  args: {
    config: {
      primaryButtonDetails: {
        key: 'KEY',
        icon: PrimeIcons.BOOK,
      },
      secondaryButtonIncluded: true,
      secondaryButtonDetails: {
        key: 'Times',
        icon: PrimeIcons.TIMES,
      },
      customButtons: [
        {
          id: 'custom-1',
          alignment: 'left',
          key: 'custom 1',
        },
        {
          id: 'custom-2',
          alignment: 'right',
          key: 'custom 2',
        },
      ],
    },
  },
}


```

### File: angular-accelerator/src/lib/components/dialog/dialog-inline/dialog-inline.component.ts

```ts

import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ButtonDialogConfig } from '../../../model/button-dialog'
import { DialogState } from '../../../services/portal-dialog.service'

@Component({
  standalone: false,
  selector: 'ocx-dialog-inline',
  templateUrl: './dialog-inline.component.html',
  styleUrls: ['./dialog-inline.component.scss'],
})
export class DialogInlineComponent {
  @Input() config: ButtonDialogConfig = {}

  @Output() resultEmitter = new EventEmitter()

  buttonClicked(event: DialogState<unknown>) {
    this.resultEmitter.emit(event.button)
  }
}


```

## Folder: angular-accelerator/src/lib/components/dialog/dialog-message-content (2 files)

### File: angular-accelerator/src/lib/components/dialog/dialog-message-content/dialog-message-content.component.html

```html

<div class="dialogMessageContent">
  <div>
    @if (icon !== '') {
      <i [class]="icon"></i>
    }
    <span id="dialogMessage">{{message | translate:messageParameters}}</span>
  </div>
</div>

```

### File: angular-accelerator/src/lib/components/dialog/dialog-message-content/dialog-message-content.component.ts

```ts

import { Component, Input } from '@angular/core'

@Component({
  standalone: false,
  templateUrl: `./dialog-message-content.component.html`,
})
export class DialogMessageContentComponent {
  @Input() message = 'message'
  @Input() messageParameters: object = {}
  @Input() icon = ''
}


```

## Folder: angular-accelerator/src/lib/components/error-component (2 files)

### File: angular-accelerator/src/lib/components/error-component/global-error.component.html

```html

<div class="pages-body error-page flex flex-column">
  <div class="align-self-center mt-auto mb-auto">
    <div class="pages-panel card flex flex-column">
      <div class="pages-header px-3 py-1">
        <h2>ERROR</h2>
      </div>
      <div class="card mt-3 px-6">
        <img src="assets/images/error.png" alt="" />
      </div>
      <div class="pages-detail pb-6">{{errCode}}</div>
      <button pButton pRipple type="button" label="Try Again" (click)="reload()" class="p-button-text"></button>
    </div>
  </div>
</div>


```

### File: angular-accelerator/src/lib/components/error-component/global-error.component.ts

```ts

import { Component, Input, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  standalone: false,
  selector: 'ocx-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.scss'],
})
export class GlobalErrorComponent {
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  @Input()
  errCode: string | undefined
  backUrl: string

  constructor() {
    this.errCode = this.route.snapshot.queryParamMap.get('err') || 'E1001_FAILED_START'
    this.backUrl = this.route.snapshot.queryParamMap.get('return') || '/'
  }

  onGoBack() {
    this.router.navigateByUrl(this.backUrl)
  }

  reload() {
    window.location.reload()
  }
}


```

## Folder: angular-accelerator/src/lib/components/filter-view (2 files)

### File: angular-accelerator/src/lib/components/filter-view/filter-view.component.html

```html

@if (columns$ | async; as columns) { @if (filters$ | async; as filters) {
<div class="flex flex-wrap align-items-center gap-2">
  @if (displayMode === 'chips') {
  <ng-container *ocxIfBreakpoint="'desktop'; elseTemplate: noChipsContent">
    @if (selectDisplayedChips(filters, columns); as selectedFilters) {
    <p-button
      #chipFilterResetButton
      id="ocxFilterViewReset"
      (onClick)="onResetFilersClick()"
      icon="pi pi-eraser"
      pTooltip="{{ 'OCX_FILTER_VIEW.RESET_FILTERS_BUTTON.DETAIL' | translate }}"
      tooltipPosition="top"
      tooltipEvent="hover"
      [ariaLabel]="'OCX_FILTER_VIEW.RESET_FILTERS_BUTTON.ARIA_LABEL' | translate"
    ></p-button>
    @if (filters.length <= 0) { @if (_fitlerViewNoSelection) {
    <ng-container [ngTemplateOutlet]="_fitlerViewNoSelection"> </ng-container>
    } @else {
    <span id="ocxFilterViewNoFilters">{{ 'OCX_FILTER_VIEW.NO_FILTERS' | translate }}</span>
    } } @if ((chipTemplates$ | async) ?? {}; as templates) { @for (filter of selectedFilters; track filter) { @if
    (getColumnForFilter(filter, columns); as column) {
    <p-chip [removable]="true" (onRemove)="onChipRemove(filter)" [styleClass]="chipStyleClass">
      @if (_filterViewChipContent) {
      <ng-container
        [ngTemplateOutlet]="_filterViewChipContent"
        [ngTemplateOutletContext]="{
                filter: filter,
                column: column,
                filterValueTemplates: templates,
                truthyTemplate: truthyTemplate,
                filterValueTemplate: chipTemplate
              }"
      >
      </ng-container>
      } @else { @if (columns$ | async; as columns) {
      <span style="white-space: nowrap" class="p-chip-text flex flex-nowrap"
        >{{column?.nameKey ?? '' | translate }}:@if (filter.filterType === FilterType.EQUALS || !filter.filterType) {
        <ng-container
          [ngTemplateOutlet]="chipTemplate"
          [ngTemplateOutletContext]="{
                        templates: templates,
                        filter: filter,
                        column: column
                      }"
        ></ng-container>
        } @if (filter.filterType === FilterType.IS_NOT_EMPTY) {
        <ng-container
          [ngTemplateOutlet]="truthyTemplate"
          [ngTemplateOutletContext]="{
                      value: filter.value
                    }"
        ></ng-container>
        }
      </span>
      } }
    </p-chip>
    } } @if (selectedFilters.length < filters.length) {
    <p-chip
      #showMoreChip
      id="ocxFilterViewShowMore"
      tabindex="0"
      role="button"
      (click)="showPanel($event)"
      class="cursor-pointer filter-view-focusable"
      (keydown.enter)="showPanel($event)"
      (keydown.space)="showPanel($event)"
    >
      @if (_filterViewShowMoreChip) {
      <ng-container
        [ngTemplateOutlet]="_filterViewShowMoreChip"
        [ngTemplateOutletContext]="{
            $implicit: filters.length - selectedFilters.length
          }"
      >
      </ng-container>
      } @else {
      <span class="p-chip-text flex flex-nowrap"> +{{filters.length - selectedFilters.length}} </span>
      }
      <ng-container [ngTemplateOutlet]="filterTablePanel"></ng-container>
    </p-chip>
    } } }
  </ng-container>
  } @else {
  <ng-container [ngTemplateOutlet]="noChipsContent"></ng-container>
  }
  <ng-template #noChipsContent>
    <p-button
      #manageButton
      id="ocxFilterViewManage"
      (onClick)="showPanel($event)"
      icon="pi pi-sliders-h"
      label="{{ 'OCX_FILTER_VIEW.MANAGE_FILTERS_BUTTON.LABEL' | translate }}"
      pTooltip="{{ 'OCX_FILTER_VIEW.MANAGE_FILTERS_BUTTON.DETAIL' | translate }}"
      tooltipPosition="top"
      tooltipEvent="hover"
      [badge]="filters.length.toString()"
      [ariaLabel]="'OCX_FILTER_VIEW.MANAGE_FILTERS_BUTTON.ARIA_LABEL' | translate"
    ></p-button>
    <ng-container [ngTemplateOutlet]="filterTablePanel"></ng-container>
  </ng-template>
  <ng-template #filterTablePanel>
    @if (tableTemplates$ | async; as templates) {
    <p-popover #op [style]="panelStyle" (onHide)="focusTrigger()">
      <ng-template pTemplate="content">
        <div pFocusTrap>
          <div class="flex justify-content-between align-items-center mb-2">
            <span class="text-2xl font-medium">{{'OCX_FILTER_VIEW.PANEL_TITLE' | translate}}</span>
            <div>
              <p-button
                pAutoFocus
                [autofocus]="true"
                id="ocxFilterViewOverlayReset"
                (onClick)="onResetFilersClick()"
                icon="pi pi-eraser"
                pTooltip="{{ 'OCX_FILTER_VIEW.RESET_FILTERS_BUTTON.DETAIL' | translate }}"
                tooltipPosition="top"
                tooltipEvent="hover"
                [ariaLabel]="'OCX_FILTER_VIEW.RESET_FILTERS_BUTTON.ARIA_LABEL' | translate"
              ></p-button>
            </div>
          </div>
          <ocx-data-table
            id="ocxFilterViewDataTable"
            [rows]="(columnFilterDataRows$ | async) ?? []"
            [columns]="columnFilterTableColumns"
            [emptyResultsMessage]="'OCX_FILTER_VIEW.NO_FILTERS' | translate"
            [paginator]="false"
            [tableStyle]="tableStyle"
          >
            <ng-template pTemplate="columnIdCell" let-rowObject="rowObject" let-column="column">
              <ng-container
                [ngTemplateOutlet]="templates[column.id]"
                [ngTemplateOutletContext]="{
            rowObject: rowObject,
            column: column,
          }"
              >
              </ng-container>
            </ng-template>
            <ng-template pTemplate="valueIdCell" let-rowObject="rowObject" let-column="column">
              @if (getColumn(rowObject['valueColumnId'], columns); as valueColumn) { @if (!valueColumn.filterType ||
              valueColumn.filterType === FilterType.EQUALS) {
              <ng-container
                [ngTemplateOutlet]="templates[valueColumn.id]"
                [ngTemplateOutletContext]="{
              rowObject: getRowForValueColumn(rowObject),
              column: valueColumn
            }"
              >
              </ng-container>
              } @if (valueColumn.filterType === FilterType.IS_NOT_EMPTY) {
              <ng-container
                [ngTemplateOutlet]="truthyTemplate"
                [ngTemplateOutletContext]="{
        value: resolveFieldData(rowObject, column.id)
      }"
              >
              </ng-container>
              } }
            </ng-template>
            <ng-template pTemplate="actionsIdCell" let-rowObject="rowObject" let-column="column">
              <div>
                <button
                  pButton
                  class="p-button-rounded p-button-danger p-button-text"
                  title="{{ 'OCX_FILTER_VIEW.TABLE.REMOVE_FILTER_TITLE' | translate }}"
                  [attr.aria-label]="'OCX_FILTER_VIEW.TABLE.REMOVE_FILTER_ARIA_LABEL' | translate"
                  icon="pi pi-trash"
                  (click)="onFilterDelete(rowObject)"
                ></button>
              </div>
            </ng-template>
          </ocx-data-table>
        </div>
      </ng-template>
    </p-popover>
    }
  </ng-template>
</div>
} }

<ng-template #chipTemplate let-templates="templates" let-filter="filter" let-column="column">
  @if (templates[column.id]; as template) {
  <ng-container
    [ngTemplateOutlet]="template"
    [ngTemplateOutletContext]="{
            rowObject: getRowObjectFromFiterData(filter),
            column: column
          }"
  >
  </ng-container>
  }
</ng-template>

<ng-template #truthyTemplate let-value="value">
  @if (value) { {{'OCX_FILTER_VIEW.FILTER_YES' | translate}} } @if (!value) { {{'OCX_FILTER_VIEW.FILTER_NO' |
  translate}} }
</ng-template>

<ng-template pTemplate="defaultStringValue" let-rowObject="rowObject" let-column="column">
  <ng-container> {{ resolveFieldData(rowObject, column.id)}} </ng-container>
</ng-template>

<ng-template pTemplate="defaultNumberValue" let-rowObject="rowObject" let-column="column">
  <ng-container> {{ resolveFieldData(rowObject, column.id) | number }} </ng-container>
</ng-template>

<ng-template pTemplate="defaultCustomValue" let-rowObject="rowObject" let-column="column"> </ng-template>

<ng-template pTemplate="defaultDateValue" let-rowObject="rowObject" let-column="column">
  <ng-container> {{ resolveFieldData(rowObject, column.id) | date: column.dateFormat ?? 'medium' }} </ng-container>
</ng-template>

<ng-template pTemplate="defaultRelativeDateValue" let-rowObject="rowObject" let-column="column">
  <ng-container>
    {{ 'OCX_DATA_TABLE.EDITED' | translate }} {{ resolveFieldData(rowObject, column.id) | timeago }}
  </ng-container>
</ng-template>

<ng-template pTemplate="defaultTranslationKeyValue" let-rowObject="rowObject" let-column="column">
  <ng-container> {{ resolveFieldData(rowObject, column.id) | translate }}</ng-container>
</ng-template>


```

### File: angular-accelerator/src/lib/components/filter-view/filter-view.component.ts

```ts

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core'
import { Filter, FilterType } from '../../model/filter.model'
import { DataTableColumn } from '../../model/data-table-column.model'
import { BehaviorSubject, Observable, combineLatest, debounceTime, map } from 'rxjs'
import { ColumnType } from '../../model/column-type.model'
import { PrimeTemplate } from 'primeng/api'
import { findTemplate } from '../../utils/template.utils'
import { ObjectUtils } from '../../utils/objectutils'
import { limit } from '../../utils/filter.utils'
import { Popover } from 'primeng/popover'
import { Row } from '../data-table/data-table.component'
import { Button } from 'primeng/button'

export type FilterViewDisplayMode = 'chips' | 'button'
export type FilterViewRowDisplayData = {
  id: string
  column: string
  value: unknown
}
export type FilterViewRowDetailData = FilterViewRowDisplayData & {
  valueColumnId: string
}

export interface FilterViewComponentState {
  filters?: Filter[]
}

@Component({
  standalone: false,
  selector: 'ocx-filter-view',
  templateUrl: './filter-view.component.html',
  styleUrls: ['./filter-view.component.scss'],
})
export class FilterViewComponent implements OnInit {
  ColumnType = ColumnType
  FilterType = FilterType
  filters$ = new BehaviorSubject<Filter[]>([])
  @Input()
  get filters(): Filter[] {
    return this.filters$.getValue()
  }
  set filters(value: Filter[]) {
    this.filters$.next(value)
  }
  columns$ = new BehaviorSubject<DataTableColumn[]>([])
  @Input()
  get columns(): DataTableColumn[] {
    return this.columns$.getValue()
  }
  set columns(value: DataTableColumn[]) {
    this.columns$.next(value)
    const chipObs = value.map((c) => this.getTemplate(c, this.chipTemplateNames, this.chipTemplates, this.chipIdSuffix))
    this.chipTemplates$ = combineLatest(chipObs).pipe(
      map((values) => Object.fromEntries(value.map((c, i) => [c.id, values[i]])))
    )

    const tableTemplateColumns = value.concat(this.columnFilterTableColumns)
    this.tableTemplates$ = combineLatest(
      tableTemplateColumns.map((c) =>
        this.getTemplate(c, this.tableTemplateNames, this.tableTemplates, this.tableIdSuffix)
      )
    ).pipe(map((values) => Object.fromEntries(tableTemplateColumns.map((c, i) => [c.id, values[i]]))))
  }

  columnFilterDataRows$: Observable<FilterViewRowDisplayData[]> | undefined

  @Input() displayMode: FilterViewDisplayMode = 'button'
  @Input() selectDisplayedChips: (filters: Filter[], columns: DataTableColumn[]) => Filter[] = (filters) =>
    limit(filters, 3, { reverse: true })
  @Input() chipStyleClass = ''
  @Input() tableStyle: { [klass: string]: any } = { 'max-height': '50vh' }
  @Input() panelStyle: { [klass: string]: any } = { 'max-width': '90%' }

  @Output() filtered: EventEmitter<Filter[]> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<FilterViewComponentState> = new EventEmitter()

  columnFilterTableColumns: DataTableColumn[] = [
    {
      id: 'column',
      columnType: ColumnType.TRANSLATION_KEY,
      nameKey: 'OCX_FILTER_VIEW.TABLE.COLUMN_NAME',
    },
    { id: 'value', columnType: ColumnType.STRING, nameKey: 'OCX_FILTER_VIEW.TABLE.VALUE' },
    {
      id: 'actions',
      columnType: ColumnType.STRING,
      nameKey: 'OCX_FILTER_VIEW.TABLE.ACTIONS',
    },
  ]

  ngOnInit(): void {
    this.columnFilterDataRows$ = combineLatest([this.filters$, this.columns$]).pipe(
      map(([filters, columns]) => {
        const columnIds = columns.map((c) => c.id)
        return filters
          .map((f) => {
            const filterColumn = this.getColumnForFilter(f, columns)
            if (!filterColumn) return undefined
            return {
              id: `${f.columnId}-${f.value}`,
              column: filterColumn.nameKey,
              value: f.value,
              valueColumnId: filterColumn.id,
            } satisfies FilterViewRowDetailData
          })
          .filter((v): v is FilterViewRowDetailData => v !== undefined)
          .slice()
          .sort((a, b) => columnIds.indexOf(a.valueColumnId) - columnIds.indexOf(b.valueColumnId))
      })
    )
    this.componentStateChanged.emit({
      filters: this.filters,
    })
  }

  @ViewChild(Popover) panel!: Popover
  @ViewChild('manageButton') manageButton!: Button
  trigger: HTMLElement | undefined

  fitlerViewNoSelection: TemplateRef<any> | undefined
  get _fitlerViewNoSelection(): TemplateRef<any> | undefined {
    return this.fitlerViewNoSelection
  }

  filterViewChipContent: TemplateRef<any> | undefined
  get _filterViewChipContent(): TemplateRef<any> | undefined {
    return this.filterViewChipContent
  }

  filterViewShowMoreChip: TemplateRef<any> | undefined
  get _filterViewShowMoreChip(): TemplateRef<any> | undefined {
    return this.filterViewShowMoreChip
  }

  defaultTemplates$: BehaviorSubject<QueryList<PrimeTemplate> | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | undefined
  >(undefined)
  @ViewChildren(PrimeTemplate)
  set defaultTemplates(value: QueryList<PrimeTemplate> | undefined) {
    this.defaultTemplates$.next(value)
  }

  parentTemplates$: BehaviorSubject<QueryList<PrimeTemplate> | null | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | null | undefined
  >(undefined)
  @Input()
  set templates(value: QueryList<PrimeTemplate> | null | undefined) {
    this.parentTemplates$.next(value)
    value?.forEach((item) => {
      switch (item.getType()) {
        case 'fitlerViewNoSelection':
          this.fitlerViewNoSelection = item.template
          break
        case 'filterViewChipContent':
          this.filterViewChipContent = item.template
          break
        case 'filterViewShowMoreChip':
          this.filterViewShowMoreChip = item.template
          break
      }
    })
  }

  chipTemplates$: Observable<Record<string, TemplateRef<any> | null>> | undefined
  tableTemplates$: Observable<Record<string, TemplateRef<any> | null>> | undefined

  chipIdSuffix: Array<string> = ['IdFilterChip', 'IdTableFilterCell', 'IdTableCell']
  chipTemplateNames: Record<ColumnType, Array<string>> = {
    [ColumnType.DATE]: ['dateFilterChipValue', 'dateTableFilterCell', 'dateTableCell', 'defaultDateValue'],
    [ColumnType.NUMBER]: ['numberFilterChipValue', 'numberTableFilterCell', 'numberTableCell', 'defaultNumberValue'],
    [ColumnType.RELATIVE_DATE]: [
      'relativeDateFilterChipValue',
      'relativeDateTableFilterCell',
      'relativeDateTableCell',
      'defaultRelativeDateValue',
    ],
    [ColumnType.TRANSLATION_KEY]: [
      'translationKeyFilterChipValue',
      'translationKeyTableFilterCell',
      'translationKeyTableCell',
      'defaultTranslationKeyValue',
    ],
    [ColumnType.STRING]: ['stringFilterChipValue', 'stringTableFilterCell', 'stringTableCell', 'defaultStringValue'],
  }
  chipTemplates: Record<string, Observable<TemplateRef<any> | null>> = {}

  tableIdSuffix: Array<string> = ['IdFilterViewCell', 'IdTableFilterCell', 'IdTableCell']
  tableTemplateNames: Record<ColumnType, Array<string>> = {
    [ColumnType.DATE]: ['dateFilterViewCell', 'dateTableFilterCell', 'dateTableCell', 'defaultDateValue'],
    [ColumnType.NUMBER]: ['numberFilterViewCell', 'numberTableFilterCell', 'numberTableCell', 'defaultNumberValue'],
    [ColumnType.RELATIVE_DATE]: [
      'relativeDateFilterViewCell',
      'relativeDateTableFilterCell',
      'relativeDateTableCell',
      'defaultRelativeDateValue',
    ],
    [ColumnType.TRANSLATION_KEY]: [
      'translationKey',
      'translationKeyTableFilterCell',
      'translationKeyTableCell',
      'defaultTranslationKeyValue',
    ],
    [ColumnType.STRING]: ['stringFilterViewCell', 'stringTableFilterCell', 'stringTableCell', 'defaultStringValue'],
  }
  tableTemplates: Record<string, Observable<TemplateRef<any> | null>> = {}

  getTemplate(
    column: DataTableColumn,
    templateNames: Record<ColumnType, Array<string>>,
    templates: Record<string, Observable<TemplateRef<any> | null>>,
    idSuffix: Array<string>
  ): Observable<TemplateRef<any> | null> {
    if (!templates[column.id]) {
      templates[column.id] = combineLatest([this.defaultTemplates$, this.parentTemplates$]).pipe(
        map(([dt, t]) => {
          const templates = [...(dt ?? []), ...(t ?? [])]
          const columnTemplate = findTemplate(
            templates,
            idSuffix.map((suffix) => column.id + suffix)
          )?.template
          if (columnTemplate) {
            return columnTemplate
          }
          return findTemplate(templates, templateNames[column.columnType])?.template ?? null
        }),
        debounceTime(50)
      )
    }
    return templates[column.id]
  }

  onResetFilersClick() {
    this.filters = []
    this.filtered.emit([])
    this.componentStateChanged.emit({
      filters: [],
    })
  }

  onChipRemove(filter: Filter) {
    const filters = this.filters.filter((f) => f.value !== filter.value)
    this.filters = filters
    this.filtered.emit(filters)
    this.componentStateChanged.emit({
      filters: filters,
    })
  }

  onFilterDelete(row: Row) {
    const filters = this.filters.filter((f) => !(f.columnId === row['valueColumnId'] && f.value === row['value']))
    this.filters = filters
    this.filtered.emit(filters)
    this.componentStateChanged.emit({
      filters: filters,
    })
  }

  focusTrigger() {
    if (this.trigger?.id === 'ocxFilterViewShowMore') {
      this.trigger?.focus()
    } else {
      this.manageButton.el.nativeElement.firstChild.focus()
    }
  }

  showPanel(event: any) {
    this.trigger = event.srcElement
    this.panel.toggle(event)
  }

  getColumnForFilter(filter: Filter, columns: DataTableColumn[]) {
    return columns.find((c) => c.id === filter.columnId)
  }

  getColumn(colId: string, columns: DataTableColumn[]) {
    return columns.find((c) => c.id === colId)
  }

  resolveFieldData(object: any, key: any) {
    return ObjectUtils.resolveFieldData(object, key)
  }

  getRowObjectFromFiterData(filter: Filter): Record<string, unknown> {
    return {
      [filter.columnId]: filter.value,
    }
  }

  getRowForValueColumn(row: Row): Row {
    return {
      id: row.id,
      [row['valueColumnId'] as string]: row['value'],
    }
  }
}


```

## Folder: angular-accelerator/src/lib/components/group-by-count-diagram (4 files)

### File: angular-accelerator/src/lib/components/group-by-count-diagram/group-by-count-diagram.component.html

```html

<ocx-diagram
  [data]="(diagramData$ | async) || []"
  [fillMissingColors]="fillMissingColors"
  [sumKey]="sumKey"
  [diagramType]="diagramType"
  (onDataSelect)="dataClicked($event)"
  [supportedDiagramTypes]="supportedDiagramTypes"
  (diagramTypeChanged)="onDiagramTypeChanged($event)"
></ocx-diagram>


```

### File: angular-accelerator/src/lib/components/group-by-count-diagram/group-by-count-diagram.component.spec.ts

```ts

import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateService } from '@ngx-translate/core'
import 'jest-canvas-mock'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { firstValueFrom, of } from 'rxjs'
import { DiagramHarness } from '../../../../testing'
import { ColumnType } from '../../model/column-type.model'
import { DiagramComponent } from '../diagram/diagram.component'
import { GroupByCountDiagramComponent } from './group-by-count-diagram.component'
import { DiagramType } from '../../model/diagram-type'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { FormsModule } from '@angular/forms'

describe('GroupByCountDiagramComponent', () => {
  let translateService: TranslateService
  let component: GroupByCountDiagramComponent
  let fixture: ComponentFixture<GroupByCountDiagramComponent>
  let loader: HarnessLoader

  const definedSumKey = 'Total'

  const diagramData: { label: string; value: number }[] = [
    { label: 'test0', value: 1 },
    { label: 'test1', value: 2 },
    { label: 'test2', value: 4 },
  ]

  const originalData = [
    {
      version: 0,
      creationDate: '2023-09-12T09:34:11.997048Z',
      creationUser: 'creation user',
      modificationDate: '2023-09-12T09:34:11.997048Z',
      modificationUser: '',
      id: '195ee34e-41c6-47b7-8fc4-3f245dee7651',
      name: 'some name',
      description: '',
      status: 'some status',
      responsible: 'someone responsible',
      endDate: '2023-09-14T09:34:09Z',
      startDate: '2023-09-13T09:34:05Z',
      imagePath: '/path/to/image',
      testNumber: 'test0',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:33:58.544494Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:33:58.544494Z',
      modificationUser: '',
      id: '5f8bb05b-d089-485e-a234-0bb6ff25234e',
      name: 'example',
      description: 'example description',
      status: 'status example',
      responsible: '',
      endDate: '2023-09-13T09:33:55Z',
      startDate: '2023-09-12T09:33:53Z',
      imagePath: '',
      testNumber: 'test1',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 1',
      description: '',
      status: 'status name 1',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: 'test1',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 2',
      description: '',
      status: 'status name 2',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: 'test2',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 3',
      description: '',
      status: 'status name 3',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: 'test2',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 3',
      description: '',
      status: 'status name 4',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: 'test2',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 3',
      description: '',
      status: 'status name 5',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: 'test2',
    },
  ]

  const inputColumn = { columnType: ColumnType.STRING, id: 'testNumber' }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupByCountDiagramComponent, DiagramComponent],
      imports: [
        AngularAcceleratorPrimeNgModule,
        FormsModule,
        TranslateTestingModule.withTranslations({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents()

    fixture = TestBed.createComponent(GroupByCountDiagramComponent)
    component = fixture.componentInstance

    component.data = originalData
    component.column = inputColumn
    component.sumKey = definedSumKey

    translateService = TestBed.inject(TranslateService)
    translateService.setDefaultLang('en')
    translateService.use('en')

    fixture.detectChanges()
    loader = TestbedHarnessEnvironment.loader(fixture)
  })

  it('should create the group-by-count-diagram component', () => {
    expect(component).toBeTruthy()
  })

  it('should convert the data properly to diagramData', async () => {
    const result = await firstValueFrom(component.diagramData$ ?? of())
    expect(result).toEqual(diagramData)
  })

  it('should load diagram harness', async () => {
    const diagram = await loader.getHarness(DiagramHarness)
    expect(diagram).toBeTruthy()
  })

  it('should display the sumKey on the diagram component', async () => {
    const diagram = await loader.getHarness(DiagramHarness)
    const displayedText = await diagram.getSumLabel()
    const definedSumKeyTranslation = translateService.instant(definedSumKey)
    expect(displayedText).toEqual(definedSumKeyTranslation)
  })

  it('should not display a selectButton on the diagram by default', async () => {
    expect(component.supportedDiagramTypes).toEqual([])

    const diagram = await loader.getHarness(DiagramHarness)
    const diagramTypeSelectButton = await diagram.getDiagramTypeSelectButton()

    expect(diagramTypeSelectButton).toBe(null)
  })

  it('should display a selectButton on the diagram if supportedDiagramTypes is specified', async () => {
    component.supportedDiagramTypes = [DiagramType.PIE, DiagramType.HORIZONTAL_BAR]

    const diagram = await loader.getHarness(DiagramHarness)
    const diagramTypeSelectButton = await diagram.getDiagramTypeSelectButton()

    expect(diagramTypeSelectButton).toBeTruthy()
  })
})


```

### File: angular-accelerator/src/lib/components/group-by-count-diagram/group-by-count-diagram.component.stories.ts

```ts

import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { SkeletonModule } from 'primeng/skeleton'
import { ChartModule } from 'primeng/chart'
import { SelectButtonModule } from 'primeng/selectbutton'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { DiagramType } from '../../model/diagram-type'
import { GroupByCountDiagramComponent } from './group-by-count-diagram.component'
import { DiagramComponent } from '../diagram/diagram.component'
import { ColumnType } from '../../model/column-type.model'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { TooltipModule } from 'primeng/tooltip';

export default {
  title: 'Components/GroupByCountDiagramComponent',
  component: GroupByCountDiagramComponent,
  argTypes: {
    diagramType: {
      options: [DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR, DiagramType.PIE],
      control: { type: 'select' },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [GroupByCountDiagramComponent, DiagramComponent, DynamicPipe],
      imports: [
        MenuModule,
        BreadcrumbModule,
        ButtonModule,
        SkeletonModule,
        StorybookTranslateModule,
        ChartModule,
        SelectButtonModule,
        TooltipModule,
      ],
    }),
  ],
} as Meta<GroupByCountDiagramComponent>

const Template: StoryFn<GroupByCountDiagramComponent> = (args) => ({
  props: args,
})

const mockData = [
  {
    id: 1,
    fruitType: 'Apple',
    name: 'Apple1',
  },
  {
    id: 2,
    fruitType: 'Apple',
    name: 'Apple2',
  },
  {
    id: 3,
    fruitType: 'Apple',
    name: 'Apple3',
  },
  {
    id: 4,
    fruitType: 'Banana',
    name: 'Banana1',
  },
  {
    id: 5,
    fruitType: 'Banana',
    name: 'Banana2',
  },
]

export const PieChart = {
  render: Template,

  args: {
    diagramType: DiagramType.PIE,
    data: mockData,
    column: {
      id: 'fruitType',
      type: ColumnType.STRING,
    },
    sumKey: 'Total',
  },
}

export const HorizontalBarChart = {
  render: Template,

  args: {
    diagramType: DiagramType.HORIZONTAL_BAR,
    data: mockData,
    column: {
      id: 'fruitType',
      type: ColumnType.STRING,
    },
    sumKey: 'Total',
  },
}

export const VerticalBarChart = {
  render: Template,

  args: {
    diagramType: DiagramType.VERTICAL_BAR,
    data: mockData,
    column: {
      id: 'fruitType',
      type: ColumnType.STRING,
    },
    sumKey: 'Total',
  },
}

export const WithDiagramTypeSelection = {
  render: Template,
  args: {
    diagramType: DiagramType.PIE,
    data: mockData,
    supportedDiagramTypes: [DiagramType.PIE, DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR],
    column: {
      id: 'fruitType',
      type: ColumnType.STRING,
    },
    sumKey: 'Total',
  },
}

export const WithCustomColors = {
  render: Template,
  args: {
    diagramType: DiagramType.PIE,
    data: mockData,
    supportedDiagramTypes: [DiagramType.PIE, DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR],
    column: {
      id: 'fruitType',
      type: ColumnType.STRING,
    },
    sumKey: 'Total',
    colors: {
      ['Apple']: 'green',
      ['Banana']: 'yellow',
    },
  },
}

export const WithForcedCustomColors = {
  render: Template,
  args: {
    diagramType: DiagramType.PIE,
    data: mockData,
    supportedDiagramTypes: [DiagramType.PIE, DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR],
    column: {
      id: 'fruitType',
      type: ColumnType.STRING,
    },
    sumKey: 'Total',
    colors: {
      ['Apple']: 'green',
    },
    fillMissingColors: true,
  },
}


```

### File: angular-accelerator/src/lib/components/group-by-count-diagram/group-by-count-diagram.component.ts

```ts

import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { BehaviorSubject, Observable, combineLatest, map, mergeMap, of } from 'rxjs'
import { ColumnType } from '../../model/column-type.model'
import { DiagramColumn } from '../../model/diagram-column'
import { DiagramData } from '../../model/diagram-data'
import { DiagramType } from '../../model/diagram-type'
import { ObjectUtils } from '../../utils/objectutils'

export interface GroupByCountDiagramComponentState {
  activeDiagramType?: DiagramType
}

@Component({
  standalone: false,
  selector: 'ocx-group-by-count-diagram',
  templateUrl: './group-by-count-diagram.component.html',
})
export class GroupByCountDiagramComponent implements OnInit {
  private translateService = inject(TranslateService)

  @Input() sumKey = 'SEARCH.SUMMARY_TITLE'
  @Input() diagramType = DiagramType.PIE
  /**
   * This property determines if diagram should generate the colors for the data that does not have any set.
   *
   * Setting this property to false will result in using the provided colors only if every data item has one. In the scenario where at least one item does not have a color set, diagram will generate all colors.
   */
  @Input() fillMissingColors = true
  @Input() supportedDiagramTypes: DiagramType[] = []
  private _data$ = new BehaviorSubject<unknown[]>([])
  @Input()
  get data(): unknown[] {
    return this._data$.getValue()
  }
  set data(value: unknown[]) {
    this._data$.next(value)
  }
  diagramData$: Observable<DiagramData[]> | undefined

  private _columnType$ = new BehaviorSubject<ColumnType>(ColumnType.STRING)
  @Input()
  get columnType(): ColumnType {
    return this._columnType$.getValue()
  }
  set columnType(value: ColumnType) {
    this._columnType$.next(value)
  }

  private _columnField$ = new BehaviorSubject<string>('')
  @Input()
  get columnField(): string {
    return this._columnField$.getValue()
  }
  set columnField(value: string) {
    this._columnField$.next(value)
  }

  @Input()
  get column(): DiagramColumn {
    return { columnType: this.columnType, id: this.columnField }
  }
  set column(value: DiagramColumn) {
    this.columnType = value.columnType
    this.columnField = value.id
  }

  private _colors$ = new BehaviorSubject<Record<string, string>>({})
  @Input()
  get colors(): Record<string, string> {
    return this._colors$.getValue()
  }
  set colors(value: Record<string, string>) {
    this._colors$.next(value)
  }

  @Output() dataSelected: EventEmitter<any> = new EventEmitter()
  @Output() diagramTypeChanged: EventEmitter<DiagramType> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<GroupByCountDiagramComponentState> = new EventEmitter()

  ngOnInit(): void {
    this.diagramData$ = combineLatest([this._data$, this._columnField$, this._columnType$, this._colors$]).pipe(
      mergeMap(([data, columnField, columnType, colors]) => {
        const columnData = data.map((d) => ObjectUtils.resolveFieldData(d, columnField))
        const occurrences = columnData.reduce((acc, current) => {
          return acc.some((e: { label: any }) => e.label === current)
            ? (acc.find((e: { label: any }) => e.label === current).value++, acc)
            : [...acc, { label: current, value: 1, backgroundColor: colors[current.toString()] }]
        }, [])
        if (columnType === ColumnType.TRANSLATION_KEY && occurrences.length > 0) {
          return this.translateService.get(occurrences.map((o: { label: any }) => o.label)).pipe(
            map((translations: { [x: string]: any }) =>
              occurrences.map((o: { label: string; value: any; backgroundColor: string | undefined }) => ({
                label: translations[o.label],
                value: o.value,
                backgroundColor: o.backgroundColor,
              }))
            )
          )
        } else {
          return of(occurrences)
        }
      })
    )
  }

  dataClicked(event: any) {
    this.dataSelected.emit(event)
  }

  onDiagramTypeChanged(newDiagramType: DiagramType) {
    this.diagramType = newDiagramType
    this.diagramTypeChanged.emit(newDiagramType)
    this.componentStateChanged.emit({
      activeDiagramType: newDiagramType,
    })
  }
}


```

## Folder: angular-accelerator/src/lib/components/interactive-data-view (7 files)

### File: angular-accelerator/src/lib/components/interactive-data-view/interactive-data-view.component.css

```css



```

### File: angular-accelerator/src/lib/components/interactive-data-view/interactive-data-view.component.html

```html

<div class="p-3 border-bottom-1 surface-border" [ngClass]="headerStyleClass" id="interactiveDataViewHeader">
  <div class="flex flex-wrap justify-content-between align-items-center py-1 gap-2">
    <div class="flex flex-wrap justify-content-start align-items-center gap-2">
      <ocx-data-layout-selection
        [supportedViewLayouts]="supportedViewLayouts"
        [layout]="layout"
        (dataViewLayoutChange)="onDataViewLayoutChange($event)"
        (componentStateChanged)="dataLayoutComponentState$.next($event)"
      ></ocx-data-layout-selection>
      @if (!disableFilterView) {
      <ocx-filter-view
        [filters]="filters"
        [columns]="columns"
        [templates]="templates$ | async"
        [displayMode]="filterViewDisplayMode"
        [selectDisplayedChips]="selectDisplayedChips"
        [chipStyleClass]="filterViewChipStyleClass"
        [tableStyle]="filterViewTableStyle"
        (filtered)="filtering($event)"
        (componentStateChanged)="filterViewComponentState$.next($event)"
      ></ocx-filter-view>
      }
    </div>

    @if (topCenter) {
    <div>
      <ng-container [ngTemplateOutlet]="topCenter"> </ng-container>
    </div>
    } @if (layout !== 'table') {
    <div class="flex align-items-center gap-2">
      <ocx-data-list-grid-sorting
        [sortDirection]="sortDirection"
        [sortField]="sortField"
        [columns]="(displayedColumns$ | async) ?? []"
        [sortStates]="sortStates"
        (sortChange)="onSortChange($event)"
        (sortDirectionChange)="onSortDirectionChange($event)"
        (componentStateChanged)="dataListGridSortingComponentState$.next($event)"
      ></ocx-data-list-grid-sorting>
    </div>
    }

    <div
      [ngStyle]="layout !== 'table' ? {
      'position': 'absolute'
    } : {}"
      class="flex flex-wrap justify-content-between align-items-center gap-2"
    >
      @if (isColumnGroupSelectionComponentDefined$ | async) { @if (displayedColumnKeys$ | async; as displayedColumnKeys)
      {
      <ocx-slot
        [ngStyle]="layout !== 'table' ? {'display' : 'none'}  : {}"
        *ocxIfPermission="searchConfigPermission; elseTemplate: defaultColumnGroupSelectionComponent"
        name="{{columnGroupSlotName}}"
        [inputs]="{ placeholderKey: groupSelectionNoGroupSelectedKey, defaultGroupKey: defaultGroupKey, customGroupKey: customGroupKey, columns: columns, selectedGroupKey: selectedGroupKey, layout: layout, displayedColumnsIds: displayedColumnKeys }"
        [outputs]="{ groupSelectionChanged: groupSelectionChangedSlotEmitter }"
      >
        <ng-template #skeleton>
          <div class="flex">
            <p-skeleton width="18rem" height="3rem"></p-skeleton>
          </div>
        </ng-template>
      </ocx-slot>
      } } @else {
      <ng-container [ngTemplateOutlet]="defaultColumnGroupSelectionComponent"></ng-container>
      } @if (layout === 'table') {
      <ocx-custom-group-column-selector
        [columns]="columns"
        [displayedColumns]="(displayedColumns$ | async) ?? []"
        [customGroupKey]="customGroupKey"
        (columnSelectionChanged)="onColumnSelectionChange($event)"
        [frozenActionColumn]="frozenActionColumn"
        [actionColumnPosition]="actionColumnPosition"
        (actionColumnConfigChanged)="onActionColumnConfigChange($event)"
        (componentStateChanged)="customGroupColumnSelectorComponentState$.next($event)"
      ></ocx-custom-group-column-selector>
      }
    </div>
  </div>
</div>
<div class="p-3" [ngClass]="contentStyleClass" id="interactiveDataViewContent">
  <ocx-data-view
    [columns]="(displayedColumns$ | async) ?? []"
    [sortStates]="sortStates"
    [sortField]="sortField"
    [filters]="filters"
    [data]="data"
    [sortDirection]="sortDirection"
    [titleLineId]="titleLineId"
    [subtitleLineIds]="subtitleLineIds"
    [clientSideSorting]="clientSideSorting"
    [clientSideFiltering]="clientSideFiltering"
    [pageSizes]="pageSizes"
    [pageSize]="pageSize"
    [emptyResultsMessage]="emptyResultsMessage"
    [layout]="layout"
    [name]="name"
    [deletePermission]="deletePermission"
    [editPermission]="editPermission"
    [viewPermission]="viewPermission"
    [deleteActionEnabledField]="deleteActionEnabledField"
    [deleteActionVisibleField]="deleteActionVisibleField"
    [editActionEnabledField]="editActionEnabledField"
    [editActionVisibleField]="editActionVisibleField"
    [viewActionEnabledField]="viewActionEnabledField"
    [viewActionVisibleField]="viewActionVisibleField"
    [additionalActions]="additionalActions"
    [listGridPaginator]="listGridPaginator"
    [tablePaginator]="tablePaginator"
    [page]="page"
    (pageChanged)="onPageChange($event)"
    (pageSizeChanged)="onPageSizeChange($event)"
    [selectedRows]="selectedRows"
    [frozenActionColumn]="frozenActionColumn"
    [actionColumnPosition]="actionColumnPosition"
    [stringTableCellTemplate]="primeNgStringTableCell ?? _stringTableCell"
    [numberTableCellTemplate]="primeNgNumberTableCell ?? _numberTableCell"
    [dateTableCellTemplate]="primeNgDateTableCell ?? _dateTableCell"
    [relativeDateTableCellTemplate]="primeNgRelativeDateTableCell ?? _relativeDateTableCell"
    [tableCellTemplate]="primeNgTableCell ?? _tableCell"
    [translationKeyTableCellTemplate]="primeNgTranslationKeyTableCell ?? _translationKeyTableCell"
    [gridItemSubtitleLinesTemplate]="primeNgGridItemSubtitleLines ?? _gridItemSubtitleLines"
    [listItemSubtitleLinesTemplate]="primeNgListItemSubtitleLines ?? _listItemSubtitleLines"
    [listItemTemplate]="primeNgListItem ?? _listItem"
    [listValueTemplate]="primeNgListValue ?? _listValue"
    [translationKeyListValueTemplate]="primeNgTranslationKeyListValue ?? _translationKeyListValue"
    [numberListValueTemplate]="primeNgNumberListValue ?? _numberListValue"
    [relativeDateListValueTemplate]="primeNgRelativeDateListValue ?? _relativeDateListValue"
    [stringListValueTemplate]="primeNgStringListValue ?? _stringListValue"
    [dateListValueTemplate]="primeNgDateListValue ?? _dateListValue"
    [gridItemTemplate]="primeNgGridItem ?? _gridItem"
    [tableFilterCellTemplate]="primeNgTableFilterCell ?? _tableFilterCell"
    [dateTableFilterCellTemplate]="primeNgDateTableFilterCell ?? _dateTableFilterCell"
    [numberTableFilterCellTemplate]="primeNgNumberTableFilterCell ?? _numberTableFilterCell"
    [stringTableFilterCellTemplate]="primeNgStringTableFilterCell ?? _stringTableFilterCell"
    [relativeDateTableFilterCellTemplate]="primeNgRelativeDateTableFilterCell ?? _relativeDateTableFilterCell"
    [translationKeyTableFilterCellTemplate]="primeNgTranslationKeyTableFilterCell ?? _translationKeyTableFilterCell"
    (sorted)="sorting($event)"
    (filtered)="filtering($event)"
    [totalRecordsOnServer]="totalRecordsOnServer"
    [currentPageShowingKey]="currentPageShowingKey"
    [currentPageShowingWithTotalOnServerKey]="currentPageShowingWithTotalOnServerKey"
    (componentStateChanged)="dataViewComponentState$.next($event)"
    [parentTemplates]="templates$ | async"
    [tableAllowSelectAll]="tableAllowSelectAll"
    [tableSelectionEnabledField]="tableSelectionEnabledField"
  >
  </ocx-data-view>
</div>

<ng-template #defaultColumnGroupSelectionComponent>
  @if (layout === 'table') {
  <ocx-column-group-selection
    [selectedGroupKey]="selectedGroupKey ?? defaultGroupKey"
    [columns]="columns"
    [defaultGroupKey]="defaultGroupKey !== customGroupKey ? defaultGroupKey : ''"
    [customGroupKey]="customGroupKey"
    [placeholderKey]="groupSelectionNoGroupSelectedKey"
    (groupSelectionChanged)="onColumnGroupSelectionChange($event)"
    (componentStateChanged)="columnGroupSelectionComponentState$.next($event)"
  ></ocx-column-group-selection>
  }
</ng-template>

<ng-template #stringTableCell let-rowObject="rowObject" let-column="column">
  @if (_stringTableCell) {
  <ng-container [ngTemplateOutlet]="_stringTableCell" [ngTemplateOutletContext]="{rowObject: rowObject, column:column}">
  </ng-container>
  }</ng-template
>
<ng-template #numberTableCell let-rowObject="rowObject" let-column="column">
  @if (_numberTableCell) {
  <ng-container [ngTemplateOutlet]="_numberTableCell" [ngTemplateOutletContext]="{rowObject: rowObject, column:column}">
  </ng-container>
  }</ng-template
>
<ng-template #dateTableCell let-rowObject="rowObject" let-column="column">
  @if (_dateTableCell) {
  <ng-container [ngTemplateOutlet]="_dateTableCell" [ngTemplateOutletContext]="{rowObject:rowObject, column:column}">
  </ng-container>
  }</ng-template
>
<ng-template #relativeDateTableCell let-rowObject="rowObject" let-column="column">
  @if (_relativeDateTableCell) {
  <ng-container
    [ngTemplateOutlet]="_relativeDateTableCell"
    [ngTemplateOutletContext]="{rowObject:rowObject, column:column}"
  >
  </ng-container>
  }</ng-template
>
<ng-template #tableCell let-rowObject="rowObject" let-column="column">
  @if (_tableCell) {
  <ng-container [ngTemplateOutlet]="_tableCell" [ngTemplateOutletContext]="{rowObject: rowObject, column:column}">
  </ng-container>
  }</ng-template
>
<ng-template #translationKeyTableCell let-rowObject="rowObject" let-column="column">
  @if (_translationKeyTableCell) {
  <ng-container
    [ngTemplateOutlet]="_translationKeyTableCell"
    [ngTemplateOutletContext]="{rowObject: rowObject, column:column}"
  >
  </ng-container>
  }</ng-template
>
<ng-template #gridItemSubtitleLines let-item>
  @if (_gridItemSubtitleLines) {
  <ng-container [ngTemplateOutlet]="_gridItemSubtitleLines" [ngTemplateOutletContext]="{$implicit:item}">
  </ng-container>
  }
</ng-template>
<ng-template #listItemSubtitleLines let-item>
  @if (_listItemSubtitleLines) {
  <ng-container [ngTemplateOutlet]="_listItemSubtitleLines" [ngTemplateOutletContext]="{$implicit:item}">
  </ng-container>
  }</ng-template
>
<ng-template #gridItem let-item>
  @if (_gridItem) {
  <ng-container [ngTemplateOutlet]="_gridItem" [ngTemplateOutletContext]="{$implicit:item}"> </ng-container>
  }</ng-template
>
<ng-template #listItem let-item>
  @if (_listItem) {
  <ng-container [ngTemplateOutlet]="_listItem" [ngTemplateOutletContext]="{$implicit:item}"> </ng-container>
  }</ng-template
>
<ng-template #listValue let-rowObject="rowObject" let-column="column">
  @if (_listValue) {
  <ng-container [ngTemplateOutlet]="_listValue" [ngTemplateOutletContext]="{rowObject: rowObject, column:column}">
  </ng-container>
  }</ng-template
>
<ng-template #translationKeyListValue let-rowObject="rowObject" let-column="column">
  @if (_translationKeyListValue) {
  <ng-container
    [ngTemplateOutlet]="_translationKeyListValue"
    [ngTemplateOutletContext]="{rowObject: rowObject, column:column}"
  >
  </ng-container>
  }</ng-template
>
<ng-template #numberListValue let-rowObject="rowObject" let-column="column">
  @if (_numberListValue) {
  <ng-container [ngTemplateOutlet]="_numberListValue" [ngTemplateOutletContext]="{rowObject: rowObject, column:column}">
  </ng-container>
  }</ng-template
>
<ng-template #relativeDateListValue let-rowObject="rowObject" let-column="column">
  @if (_relativeDateListValue) {
  <ng-container
    [ngTemplateOutlet]="_relativeDateListValue"
    [ngTemplateOutletContext]="{rowObject: rowObject, column:column}"
  >
  </ng-container>
  }</ng-template
>
<ng-template #stringListValue let-rowObject="rowObject" let-column="column">
  @if (_stringListValue) {
  <ng-container [ngTemplateOutlet]="_stringListValue" [ngTemplateOutletContext]="{rowObject: rowObject, column:column}">
  </ng-container>
  }</ng-template
>
<ng-template #dateListValue let-rowObject="rowObject" let-column="column">
  @if (_dateListValue) {
  <ng-container [ngTemplateOutlet]="_dateListValue" [ngTemplateOutletContext]="{rowObject: rowObject, column:column}">
  </ng-container>
  }</ng-template
>

<ng-template #stringTableFilterCell let-rowObject="rowObject" let-column="column">
  @if (_stringTableFilterCell) {
  <ng-container
    [ngTemplateOutlet]="_stringTableFilterCell"
    [ngTemplateOutletContext]="{rowObject: rowObject, column:column}"
  >
  </ng-container>
  }</ng-template
>
<ng-template #numberTableFilterCell let-rowObject="rowObject" let-column="column">
  @if (_numberTableFilterCell) {
  <ng-container
    [ngTemplateOutlet]="_numberTableFilterCell"
    [ngTemplateOutletContext]="{rowObject: rowObject, column:column}"
  >
  </ng-container>
  }</ng-template
>
<ng-template #dateTableFilterCell let-rowObject="rowObject" let-column="column">
  @if (_dateTableFilterCell) {
  <ng-container
    [ngTemplateOutlet]="_dateTableFilterCell"
    [ngTemplateOutletContext]="{rowObject: rowObject, column:column}"
  >
  </ng-container>
  }</ng-template
>
<ng-template #relativeDateTableFilterCell let-rowObject="rowObject" let-column="column">
  @if (_relativeDateTableFilterCell) {
  <ng-container
    [ngTemplateOutlet]="_relativeDateTableFilterCell"
    [ngTemplateOutletContext]="{rowObject: rowObject, column:column}"
  >
  </ng-container>
  }</ng-template
>
<ng-template #translationKeyTableFilterCell let-rowObject="rowObject" let-column="column">
  @if (_translationKeyTableFilterCell) {
  <ng-container
    [ngTemplateOutlet]="_translationKeyTableFilterCell"
    [ngTemplateOutletContext]="{rowObject: rowObject, column:column}"
  >
  </ng-container>
  }</ng-template
>


```

### File: angular-accelerator/src/lib/components/interactive-data-view/interactive-data-view.component.spec.ts

```ts

import { HarnessLoader, parallel, TestElement } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { DatePipe } from '@angular/common'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import {
  provideAppStateServiceMock,
  provideUserServiceMock,
  UserServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { SlotComponentConfiguration, SlotService } from '@onecx/angular-remote-components'
import { SlotServiceMock } from '@onecx/angular-remote-components/mocks'
import {
  ButtonHarness,
  ListItemHarness,
  PButtonHarness,
  PMultiSelectListItemHarness,
  PPicklistHarness,
  PSelectHarness,
  TableHeaderColumnHarness,
  TableRowHarness,
} from '@onecx/angular-testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { PrimeIcons } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { DomHandler } from 'primeng/dom'
import { PickListModule } from 'primeng/picklist'
import { TooltipStyle } from 'primeng/tooltip'
import {
  ColumnGroupSelectionHarness,
  CustomGroupColumnSelectorHarness,
  DataLayoutSelectionHarness,
  DataListGridHarness,
  DataTableHarness,
  DataViewHarness,
  DefaultGridItemHarness,
  DefaultListItemHarness,
  FilterViewHarness,
  InteractiveDataViewHarness,
  SlotHarness,
} from '../../../../testing'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { ColumnType } from '../../model/column-type.model'
import { FilterType } from '../../model/filter.model'
import { DateUtils } from '../../utils/dateutils'
import { limit } from '../../utils/filter.utils'
import { ColumnGroupSelectionComponent } from '../column-group-selection/column-group-selection.component'
import { CustomGroupColumnSelectorComponent } from '../custom-group-column-selector/custom-group-column-selector.component'
import { DataLayoutSelectionComponent } from '../data-layout-selection/data-layout-selection.component'
import { DataViewComponent, RowListGridData } from '../data-view/data-view.component'
import { FilterViewComponent } from '../filter-view/filter-view.component'
import { InteractiveDataViewComponent } from './interactive-data-view.component'
import { Technologies } from '@onecx/integration-interface'

// primeng version 19.0.6 workaround for frozen column failing in tests
DomHandler.siblings = (element) => {
  return Array.prototype.filter.call(element.closest('*').children, function (child) {
    return child !== element
  })
}

// primeng version 19.0.6 workaround for frozen column failing in tests
DomHandler.index = (element) => {
  const children = element.closest('*').childNodes
  let num = 0
  for (let i = 0; i < children.length; i++) {
    if (children[i] == element) return num
    if (children[i].nodeType == 1) num++
  }
  return -1
}

jest.setTimeout(20_000)

jest.setTimeout(20_000)

// Tests are disabled because of very high flakiness
// TODO: Remove flakiness and enable the tests
xdescribe('InteractiveDataViewComponent', () => {
  const mutationObserverMock = jest.fn(function MutationObserver(callback) {
    this.observe = jest.fn()
    this.disconnect = jest.fn()
    this.trigger = (mockedMutationsList: any) => {
      callback(mockedMutationsList, this)
    }
    return this
  })
  global.MutationObserver = mutationObserverMock

  let component: InteractiveDataViewComponent
  let fixture: ComponentFixture<InteractiveDataViewComponent>
  let loader: HarnessLoader
  let interactiveDataViewHarness: InteractiveDataViewHarness

  let viewItemEvent: RowListGridData | undefined
  let editItemEvent: RowListGridData | undefined
  let deleteItemEvent: RowListGridData | undefined

  let dateUtils: DateUtils
  let slotService: SlotServiceMock
  let userServiceMock: UserServiceMock

  const mock1 = {
    version: 0,
    creationDate: '2023-09-12T09:34:11.997048Z',
    creationUser: 'creation user 1',
    modificationDate: '2023-09-12T09:34:11.997048Z',
    modificationUser: 'mod user 1',
    id: '195ee34e-41c6-47b7-8fc4-3f245dee7651',
    name: 'some name',
    description: 'dsc 1',
    status: 'some status',
    responsible: 'someone responsible',
    endDate: '2023-09-14T09:34:09Z',
    startDate: '2023-09-13T09:34:05Z',
    imagePath: '/path/to/image',
    testNumber: '1',
    testTruthy: 'value',
  }

  const mock2 = {
    version: 0,
    creationDate: '2023-09-12T09:33:58.544494Z',
    creationUser: 'creation user 2',
    modificationDate: '2023-09-12T09:33:58.544494Z',
    modificationUser: 'mod user 2',
    id: '5f8bb05b-d089-485e-a234-0bb6ff25234e',
    name: 'example',
    description: 'example description',
    status: 'status example',
    responsible: 'someone responsible 2',
    endDate: '2023-09-13T09:33:55Z',
    startDate: '2023-09-12T09:33:53Z',
    imagePath: '/path/to/image2',
    testNumber: '3.141',
    testTruthy: 'value2',
  }

  const mock3 = {
    version: 0,
    creationDate: '2023-09-12T09:34:27.184086Z',
    creationUser: 'creation user 3',
    modificationDate: '2023-09-12T09:34:27.184086Z',
    modificationUser: 'mod user 3',
    id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
    name: 'name 1',
    description: 'dsc 3',
    status: 'status name 1',
    responsible: 'someone responsible 3',
    endDate: '2023-09-15T09:34:24Z',
    startDate: '2023-09-14T09:34:22Z',
    imagePath: '/path/to/image3',
    testNumber: '123456789',
  }

  const mock4 = {
    version: 0,
    creationDate: '2023-09-12T09:34:27.184086Z',
    creationUser: 'creation user 4',
    modificationDate: '2023-09-12T09:34:27.184086Z',
    modificationUser: 'mod user 4',
    id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
    name: 'name 2',
    description: 'dsc 4',
    status: 'status name 2',
    responsible: 'someone responsible 4',
    endDate: '2023-09-15T09:34:24Z',
    startDate: '2023-09-14T09:34:22Z',
    imagePath: '/path/to/image4',
    testNumber: '12345.6789',
    testTruthy: 'value3',
  }

  const mock5 = {
    version: 0,
    creationDate: '2023-09-12T09:34:27.184086Z',
    creationUser: 'creation user 5',
    modificationDate: '2023-09-12T09:34:27.184086Z',
    modificationUser: 'mod user 5',
    id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
    name: 'name 3',
    description: 'dsc 5',
    status: 'status name 3',
    responsible: 'someone responsible 5',
    endDate: '2023-09-15T09:34:24Z',
    startDate: '2023-09-14T09:34:22Z',
    imagePath: '',
    testNumber: '7.1',
  }

  const mockData = [mock1, mock2, mock3, mock4, mock5]
  const mockColumns = [
    {
      columnType: ColumnType.STRING,
      id: 'name',
      nameKey: 'COLUMN_HEADER_NAME.NAME',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'description',
      nameKey: 'COLUMN_HEADER_NAME.DESCRIPTION',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'startDate',
      nameKey: 'COLUMN_HEADER_NAME.START_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'endDate',
      nameKey: 'COLUMN_HEADER_NAME.END_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.TRANSLATION_KEY,
      id: 'status',
      nameKey: 'COLUMN_HEADER_NAME.STATUS',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'responsible',
      nameKey: 'COLUMN_HEADER_NAME.RESPONSIBLE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.RELATIVE_DATE,
      id: 'modificationDate',
      nameKey: 'COLUMN_HEADER_NAME.MODIFICATION_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'creationUser',
      nameKey: 'COLUMN_HEADER_NAME.CREATION_USER',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.NUMBER,
      id: 'testNumber',
      nameKey: 'COLUMN_HEADER_NAME.TEST_NUMBER',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'testTruthy',
      nameKey: 'COLUMN_HEADER_NAME.TEST_TRUTHY',
      filterable: true,
      sortable: true,
      filterType: FilterType.IS_NOT_EMPTY,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
  ]

  const columnGroupSelectionComponent: SlotComponentConfiguration = {
    componentType: Promise.resolve(undefined),
    remoteComponent: {
      appId: 'app-id',
      productName: 'product-name',
      baseUrl: 'https://base-url',
      technology: Technologies.WebComponentModule,
      elementName: 'column-group-selection',
    },
    permissions: [],
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InteractiveDataViewComponent,
        DataLayoutSelectionComponent,
        DataViewComponent,
        ColumnGroupSelectionComponent,
        CustomGroupColumnSelectorComponent,
        IfPermissionDirective,
        FilterViewComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        ButtonModule,
        DialogModule,
        PickListModule,
        AngularAcceleratorModule,
        NoopAnimationsModule,
        AngularAcceleratorPrimeNgModule,
        TranslateTestingModule.withTranslations({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
      ],
      providers: [
        provideUserServiceMock(),
        {
          provide: SlotService,
          useClass: SlotServiceMock,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([]),
        provideAppStateServiceMock(),
        TooltipStyle,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(InteractiveDataViewComponent)
    component = fixture.componentInstance
    userServiceMock = TestBed.inject(UserServiceMock)
    userServiceMock.permissionsTopic$.publish(['TEST_MGMT#TEST_View', 'TEST_MGMT#TEST_EDIT', 'TEST_MGMT#TEST_DELETE'])
    component.viewPermission = 'TEST_MGMT#TEST_View'
    component.editPermission = 'TEST_MGMT#TEST_EDIT'
    component.deletePermission = 'TEST_MGMT#TEST_DELETE'
    component.defaultGroupKey = 'PREDEFINED_GROUP.DEFAULT'
    component.searchConfigPermission = 'PRODUCT#USE_SEARCHCONFIG'
    component.viewItem.subscribe((event) => (viewItemEvent = event))
    component.editItem.subscribe((event) => (editItemEvent = event))
    component.deleteItem.subscribe((event) => (deleteItemEvent = event))
    component.titleLineId = 'name'
    component.subtitleLineIds = ['startDate']
    component.data = mockData
    component.columns = mockColumns

    fixture.detectChanges()

    loader = TestbedHarnessEnvironment.loader(fixture)
    interactiveDataViewHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, InteractiveDataViewHarness)

    dateUtils = TestBed.inject(DateUtils)
    slotService = TestBed.inject(SlotService) as any as SlotServiceMock
    slotService.clearAssignments()

    viewItemEvent = undefined
    editItemEvent = undefined
    deleteItemEvent = undefined

    console.log('Global IntersectionObserver', global.IntersectionObserver)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should load data view harness', async () => {
    const dataView = await loader.getHarness(DataViewHarness)
    expect(dataView).toBeTruthy()
  })

  it('should load DataLayoutSelection', async () => {
    const dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)
    expect(dataLayoutSelection).toBeTruthy()
  })

  it('should load column-group-selection slot', async () => {
    userServiceMock.permissionsTopic$.publish(['PRODUCT#USE_SEARCHCONFIG'])
    slotService.assignComponentToSlot(columnGroupSelectionComponent, component.columnGroupSlotName)
    fixture.detectChanges()

    const slot = await loader.getHarness(SlotHarness)
    expect(slot).toBeTruthy()
  })

  it('should load ColumnGroupSelectionDropdown', async () => {
    userServiceMock.permissionsTopic$.publish([])
    const columnGroupSelectionDropdown = await loader.getHarness(ColumnGroupSelectionHarness)
    expect(columnGroupSelectionDropdown).toBeTruthy()

    slotService.assignComponentToSlot(columnGroupSelectionComponent, component.columnGroupSlotName)

    const columnGroupSelectionDropdownNoPermission = await loader.getHarness(ColumnGroupSelectionHarness)
    expect(columnGroupSelectionDropdownNoPermission).toBeTruthy()
  })

  it('should load CustomGroupColumnSelector', async () => {
    const customGroupColumnSelectorButton = await loader.getHarness(CustomGroupColumnSelectorHarness)
    expect(customGroupColumnSelectorButton).toBeTruthy()
  })

  it('should load FilterView', async () => {
    component.disableFilterView = false
    fixture.detectChanges()

    const filterView = await loader.getHarness(FilterViewHarness)
    expect(filterView).toBeTruthy()
  })

  it('should load DataListGridSortingDropdown', async () => {
    const dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)
    await dataLayoutSelection.selectGridLayout()

    const dataListGridSortingDropdown = await loader.getHarness(
      PSelectHarness.with({ id: 'dataListGridSortingDropdown' })
    )
    expect(dataListGridSortingDropdown).toBeTruthy()
  })

  it('should load DataListGridSortingButton', async () => {
    const dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)
    await dataLayoutSelection.selectGridLayout()

    const dataListGridSortingButton = await loader.getHarness(PButtonHarness.with({ id: 'dataListGridSortingButton' }))
    expect(dataListGridSortingButton).toBeTruthy()
  })

  describe('Table view ', () => {
    let dataLayoutSelection: DataLayoutSelectionHarness
    let dataView: DataViewHarness
    let dataTable: DataTableHarness | null
    let tableHeaders: TableHeaderColumnHarness[]
    let tableRows: TableRowHarness[]
    let allFilterOptions: PMultiSelectListItemHarness[] | undefined

    beforeEach(async () => {
      dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)
      dataView = await loader.getHarness(DataViewHarness)
      dataTable = await dataView?.getDataTable()
      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      tableRows = (await dataTable?.getRows()) ?? []

      allFilterOptions = undefined
    })

    const expectedInitialHeaders = [
      'COLUMN_HEADER_NAME.NAME',
      'COLUMN_HEADER_NAME.DESCRIPTION',
      'COLUMN_HEADER_NAME.STATUS',
      'COLUMN_HEADER_NAME.RESPONSIBLE',
      'Actions',
    ]
    const expectedInitialRowsData = [
      ['some name', 'dsc 1', 'some status', 'someone responsible'],
      ['example', 'example description', 'status example', 'someone responsible 2'],
      ['name 1', 'dsc 3', 'status name 1', 'someone responsible 3'],
      ['name 2', 'dsc 4', 'status name 2', 'someone responsible 4'],
      ['name 3', 'dsc 5', 'status name 3', 'someone responsible 5'],
    ]

    it('should load table', async () => {
      expect(dataTable).toBeTruthy()
      expect(await dataLayoutSelection.getCurrentLayout()).toEqual('table')
    })

    it('should get table data', async () => {
      const headers = await parallel(() => tableHeaders.map((header) => header.getText()))
      const rows = await parallel(() => tableRows.map((row) => row.getData()))
      expect(headers).toEqual(expectedInitialHeaders)
      expect(rows).toEqual(expectedInitialRowsData)
    })

    it('should sort data by first table column in ascending order', async () => {
      const expectedRowsDataAfterSorting = [
        ['example', 'example description', 'status example', 'someone responsible 2'],
        ['name 1', 'dsc 3', 'status name 1', 'someone responsible 3'],
        ['name 2', 'dsc 4', 'status name 2', 'someone responsible 4'],
        ['name 3', 'dsc 5', 'status name 3', 'someone responsible 5'],
        ['some name', 'dsc 1', 'some status', 'someone responsible'],
      ]
      const sortButton = await tableHeaders[0].getSortButton()
      await sortButton.click()
      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsDataAfterSorting)
    })

    it('should sort data by third table column in ascending order', async () => {
      const expectedRowsDataAfterSorting = [
        ['some name', 'dsc 1', 'some status', 'someone responsible'],
        ['example', 'example description', 'status example', 'someone responsible 2'],
        ['name 1', 'dsc 3', 'status name 1', 'someone responsible 3'],
        ['name 2', 'dsc 4', 'status name 2', 'someone responsible 4'],
        ['name 3', 'dsc 5', 'status name 3', 'someone responsible 5'],
      ]
      const sortButton = await tableHeaders[2].getSortButton()
      await sortButton.click()

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsDataAfterSorting)
    })

    it('should sort data by first table column in descending order', async () => {
      const expectedRowsDataAfterSorting = [
        ['some name', 'dsc 1', 'some status', 'someone responsible'],
        ['name 3', 'dsc 5', 'status name 3', 'someone responsible 5'],
        ['name 2', 'dsc 4', 'status name 2', 'someone responsible 4'],
        ['name 1', 'dsc 3', 'status name 1', 'someone responsible 3'],
        ['example', 'example description', 'status example', 'someone responsible 2'],
      ]
      const sortButton = await tableHeaders[0].getSortButton()
      await sortButton.click()
      await sortButton.click()

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsDataAfterSorting)
    })

    it('should sort data by third table column in descending order', async () => {
      const expectedRowsDataAfterSorting = [
        ['name 3', 'dsc 5', 'status name 3', 'someone responsible 5'],
        ['name 2', 'dsc 4', 'status name 2', 'someone responsible 4'],
        ['name 1', 'dsc 3', 'status name 1', 'someone responsible 3'],
        ['example', 'example description', 'status example', 'someone responsible 2'],
        ['some name', 'dsc 1', 'some status', 'someone responsible'],
      ]
      const sortButton = await tableHeaders[2].getSortButton()
      await sortButton.click()
      await sortButton.click()

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsDataAfterSorting)
    })

    it('should sort data by first table column back to default order', async () => {
      const sortButton = await tableHeaders[0].getSortButton()
      await sortButton.click()
      await sortButton.click()
      await sortButton.click()

      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedInitialRowsData)
    })

    it('should sort data by third table column back to default order', async () => {
      const sortButton = await tableHeaders[2].getSortButton()
      await sortButton.click()
      await sortButton.click()
      await sortButton.click()

      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedInitialRowsData)
    })

    it('should filter data by first table column with second filter option', async () => {
      const expectedRowsDataAfterFilter = [
        ['example', 'example description', 'status example', 'someone responsible 2'],
      ]

      const filterMultiSelect = await tableHeaders[0].getFilterMultiSelect()
      allFilterOptions = await filterMultiSelect.getAllOptions()
      await allFilterOptions[1].click()

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsDataAfterFilter)
    })

    it('should filter data by first table column with second and third filter option', async () => {
      const expectedSelectedOptions = ['example', 'name 1']
      const expectedRowsDataAfterFilter = [
        ['example', 'example description', 'status example', 'someone responsible 2'],
        ['name 1', 'dsc 3', 'status name 1', 'someone responsible 3'],
      ]

      const filterMultiSelect = await tableHeaders[0].getFilterMultiSelect()
      allFilterOptions = await filterMultiSelect.getAllOptions()
      await allFilterOptions[1].click()

      allFilterOptions = await filterMultiSelect.getAllOptions()
      await allFilterOptions[2].click()

      expect(await filterMultiSelect.getSelectedOptions()).toEqual(expectedSelectedOptions)

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsDataAfterFilter)
    })

    it('should filter data by first table column with third filter option after selecting second and third option then unselecting second option', async () => {
      const expectedSelectedOption = ['name 1']
      const expectedRowsDataAfterFilter = [['name 1', 'dsc 3', 'status name 1', 'someone responsible 3']]

      const filterMultiSelect = await tableHeaders[0].getFilterMultiSelect()
      allFilterOptions = await filterMultiSelect.getAllOptions()
      await allFilterOptions[1].click()

      allFilterOptions = await filterMultiSelect.getAllOptions()
      await allFilterOptions[2].click()

      allFilterOptions = await filterMultiSelect.getAllOptions()
      await allFilterOptions[1].click()

      expect(await filterMultiSelect.getSelectedOptions()).toEqual(expectedSelectedOption)

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsDataAfterFilter)
    })

    it('should get event viewItem with first data row when view action row button of first row is clicked', async () => {
      const viewButton = await tableRows[0].getViewButton()
      await viewButton?.click()

      expect(viewItemEvent).toEqual(component.data[0])
    })

    it('should get event viewItem with third data row when view action row button of third row is clicked', async () => {
      const viewButton = await tableRows[2].getViewButton()
      await viewButton?.click()

      expect(viewItemEvent).toEqual(component.data[2])
    })

    it('should get event editItem with first data row when edit action row button of first row is clicked', async () => {
      const editButton = await tableRows[0].getEditButton()
      await editButton?.click()

      expect(editItemEvent).toEqual(component.data[0])
    })

    it('should get event editItem with third data row when edit action row button of third row is clicked', async () => {
      const editButton = await tableRows[2].getEditButton()
      await editButton?.click()

      expect(editItemEvent).toEqual(component.data[2])
    })

    it('should get event deleteItem with first data row when delete action row button of first row is clicked', async () => {
      const deleteButton = await tableRows[0].getDeleteButton()
      await deleteButton?.click()

      expect(deleteItemEvent).toEqual(component.data[0])
    })

    it('should get event deleteItem with first data row when delete action row button of third row is clicked', async () => {
      const deleteButton = await tableRows[2].getDeleteButton()
      await deleteButton?.click()

      expect(deleteItemEvent).toEqual(component.data[2])
    })

    it('should select option in column group selection dropdown', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      const expectedHeaders = [
        'COLUMN_HEADER_NAME.NAME',
        'COLUMN_HEADER_NAME.DESCRIPTION',
        'COLUMN_HEADER_NAME.START_DATE',
        'COLUMN_HEADER_NAME.END_DATE',
        'COLUMN_HEADER_NAME.STATUS',
        'COLUMN_HEADER_NAME.RESPONSIBLE',
        'COLUMN_HEADER_NAME.TEST_NUMBER',
        'COLUMN_HEADER_NAME.TEST_TRUTHY',
        'Actions',
      ]
      const expectedRowsData = [
        [
          'some name',
          'dsc 1',
          dateUtils.localizedDate('2023-09-13T09:34:05Z'),
          dateUtils.localizedDate('2023-09-14T09:34:09Z'),
          'some status',
          'someone responsible',
          '1',
          'value',
        ],
        [
          'example',
          'example description',
          dateUtils.localizedDate('2023-09-12T09:33:53Z'),
          dateUtils.localizedDate('2023-09-13T09:33:55Z'),
          'status example',
          'someone responsible 2',
          '3.141',
          'value2',
        ],
        [
          'name 1',
          'dsc 3',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 1',
          'someone responsible 3',
          '123,456,789',
          '',
        ],
        [
          'name 2',
          'dsc 4',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 2',
          'someone responsible 4',
          '12,345.679',
          'value3',
        ],
        [
          'name 3',
          'dsc 5',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 3',
          'someone responsible 5',
          '7.1',
          '',
        ],
      ]

      const columnGroupSelectionDropdown = await loader.getHarness(
        PSelectHarness.with({ inputId: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getSelectItems()
      await dropdownItems[1].selectItem()

      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      tableRows = (await dataTable?.getRows()) ?? []
      const headers = await parallel(() => tableHeaders.map((header) => header.getText()))
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(headers).toEqual(expectedHeaders)
      expect(rows).toEqual(expectedRowsData)
    })

    it('should select option in column group selection dropdown and sort ascending', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      const expectedRowsData = [
        [
          'some name',
          'dsc 1',
          dateUtils.localizedDate('2023-09-13T09:34:05Z'),
          dateUtils.localizedDate('2023-09-14T09:34:09Z'),
          'some status',
          'someone responsible',
          '1',
          'value',
        ],
        [
          'example',
          'example description',
          dateUtils.localizedDate('2023-09-12T09:33:53Z'),
          dateUtils.localizedDate('2023-09-13T09:33:55Z'),
          'status example',
          'someone responsible 2',
          '3.141',
          'value2',
        ],
        [
          'name 3',
          'dsc 5',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 3',
          'someone responsible 5',
          '7.1',
          '',
        ],
        [
          'name 2',
          'dsc 4',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 2',
          'someone responsible 4',
          '12,345.679',
          'value3',
        ],
        [
          'name 1',
          'dsc 3',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 1',
          'someone responsible 3',
          '123,456,789',
          '',
        ],
      ]

      const columnGroupSelectionDropdown = await loader.getHarness(
        PSelectHarness.with({ inputId: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getSelectItems()
      await dropdownItems[1].selectItem()

      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      const sortButton = await tableHeaders[6].getSortButton()
      await sortButton.click()

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsData)
    })

    it('should select option in column group selection dropdown and sort descending', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      const expectedRowsData = [
        [
          'name 1',
          'dsc 3',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 1',
          'someone responsible 3',
          '123,456,789',
          '',
        ],
        [
          'name 2',
          'dsc 4',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 2',
          'someone responsible 4',
          '12,345.679',
          'value3',
        ],
        [
          'name 3',
          'dsc 5',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 3',
          'someone responsible 5',
          '7.1',
          '',
        ],
        [
          'example',
          'example description',
          dateUtils.localizedDate('2023-09-12T09:33:53Z'),
          dateUtils.localizedDate('2023-09-13T09:33:55Z'),
          'status example',
          'someone responsible 2',
          '3.141',
          'value2',
        ],
        [
          'some name',
          'dsc 1',
          dateUtils.localizedDate('2023-09-13T09:34:05Z'),
          dateUtils.localizedDate('2023-09-14T09:34:09Z'),
          'some status',
          'someone responsible',
          '1',
          'value',
        ],
      ]

      const columnGroupSelectionDropdown = await loader.getHarness(
        PSelectHarness.with({ inputId: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getSelectItems()
      await dropdownItems[1].selectItem()

      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      const sortButton = await tableHeaders[6].getSortButton()
      await sortButton.click()
      await sortButton.click()

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsData)
    })

    it('should select option in column group selection dropdown and sort default', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      const expectedRowsData = [
        [
          'some name',
          'dsc 1',
          dateUtils.localizedDate('2023-09-13T09:34:05Z'),
          dateUtils.localizedDate('2023-09-14T09:34:09Z'),
          'some status',
          'someone responsible',
          '1',
          'value',
        ],
        [
          'example',
          'example description',
          dateUtils.localizedDate('2023-09-12T09:33:53Z'),
          dateUtils.localizedDate('2023-09-13T09:33:55Z'),
          'status example',
          'someone responsible 2',
          '3.141',
          'value2',
        ],
        [
          'name 1',
          'dsc 3',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 1',
          'someone responsible 3',
          '123,456,789',
          '',
        ],
        [
          'name 2',
          'dsc 4',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 2',
          'someone responsible 4',
          '12,345.679',
          'value3',
        ],
        [
          'name 3',
          'dsc 5',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 3',
          'someone responsible 5',
          '7.1',
          '',
        ],
      ]

      const columnGroupSelectionDropdown = await loader.getHarness(
        PSelectHarness.with({ inputId: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getSelectItems()
      await dropdownItems[1].selectItem()

      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      const sortButton = await tableHeaders[6].getSortButton()
      await sortButton.click()
      await sortButton.click()
      await sortButton.click()

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsData)
    })

    it('should render an unpinnend action column on the right side of the table by default', async () => {
      component.viewItem.subscribe((event) => console.log(event))

      expect(component.frozenActionColumn).toBe(false)
      expect(component.actionColumnPosition).toBe('right')
      expect(await dataTable?.getActionColumnHeader('left')).toBe(null)
      expect(await dataTable?.getActionColumn('left')).toBe(null)

      const rightActionColumnHeader = await dataTable?.getActionColumnHeader('right')
      const rightActionColumn = await dataTable?.getActionColumn('right')
      expect(rightActionColumnHeader).toBeTruthy()
      expect(rightActionColumn).toBeTruthy()
      expect(await dataTable?.columnIsFrozen(rightActionColumnHeader)).toBe(false)
      expect(await dataTable?.columnIsFrozen(rightActionColumn)).toBe(false)
    })

    it('should render an pinned action column on the specified side of the table', async () => {
      component.viewItem.subscribe((event) => console.log(event))

      component.frozenActionColumn = true
      component.actionColumnPosition = 'left'

      expect(await dataTable?.getActionColumnHeader('right')).toBe(null)
      expect(await dataTable?.getActionColumn('right')).toBe(null)

      const leftActionColumnHeader = await dataTable?.getActionColumnHeader('left')
      const leftActionColumn = await dataTable?.getActionColumn('left')
      expect(leftActionColumnHeader).toBeTruthy()
      expect(leftActionColumn).toBeTruthy()
      expect(await dataTable?.columnIsFrozen(leftActionColumnHeader)).toBe(true)
      expect(await dataTable?.columnIsFrozen(leftActionColumn)).toBe(true)
    })
  })

  describe('Table row selection ', () => {
    let dataLayoutSelection: DataLayoutSelectionHarness
    let dataView: DataViewHarness
    let dataTable: DataTableHarness | null

    beforeEach(async () => {
      dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)
      dataView = await interactiveDataViewHarness.getDataView()
      dataTable = await dataView?.getDataTable()
    })

    it('should initially show a table without selection checkboxes', async () => {
      expect(dataTable).toBeTruthy()
      expect(await dataLayoutSelection.getCurrentLayout()).toEqual('table')
      expect(await dataTable?.rowSelectionIsEnabled()).toEqual(false)
    })

    it('should show a table with selection checkboxes if the parent binds to the event emitter', async () => {
      expect(dataTable).toBeTruthy()
      expect(await dataLayoutSelection.getCurrentLayout()).toEqual('table')
      expect(await dataTable?.rowSelectionIsEnabled()).toEqual(false)

      component.selectionChanged.subscribe()

      expect(await dataTable?.rowSelectionIsEnabled()).toEqual(true)
      component.selectionChanged.unsubscribe()
    })
  })

  describe('Table view custom group column selector ', () => {
    let dataView: DataViewHarness
    let dataTable: DataTableHarness | null
    let tableHeaders: TableHeaderColumnHarness[]
    let tableRows: TableRowHarness[]

    let customGroupColumnSelector: CustomGroupColumnSelectorHarness
    let picklist: PPicklistHarness
    let activeColumnsList: ListItemHarness[]
    let inActiveColumnsList: ListItemHarness[]
    let sourceControlsButtons: ButtonHarness[]
    let transferControlsButtons: ButtonHarness[]
    let dialogSaveButton: PButtonHarness
    let frozenActionColumnSelectButtons: TestElement[]
    let actionColumnPositionSelectButtons: TestElement[]

    beforeEach(async () => {
      dataView = await loader.getHarness(DataViewHarness)
      dataTable = await dataView?.getDataTable()
      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      tableRows = (await dataTable?.getRows()) ?? []

      customGroupColumnSelector = await loader.getHarness(CustomGroupColumnSelectorHarness)
      await customGroupColumnSelector.openCustomGroupColumnSelectorDialog()

      picklist = await customGroupColumnSelector.getPicklist()
      activeColumnsList = await picklist.getSourceListItems()
      inActiveColumnsList = await picklist.getTargetListItems()
      sourceControlsButtons = await picklist.getSourceControlsButtons()
      transferControlsButtons = await picklist.getTransferControlsButtons()
      dialogSaveButton = await customGroupColumnSelector.getSaveButton()
      frozenActionColumnSelectButtons = await customGroupColumnSelector.getFrozenActionColumnSelectButton()
      actionColumnPositionSelectButtons = await customGroupColumnSelector.getActionColumnPositionSelectButtons()
    })

    it('should move item up in picklist active columns list', async () => {
      const spy = jest.spyOn(CustomGroupColumnSelectorComponent.prototype, 'onSaveClick')
      const expectedHeaders = [
        'COLUMN_HEADER_NAME.DESCRIPTION',
        'COLUMN_HEADER_NAME.NAME',
        'COLUMN_HEADER_NAME.STATUS',
        'COLUMN_HEADER_NAME.RESPONSIBLE',
        'Actions',
      ]
      const expectedRowsData = [
        ['dsc 1', 'some name', 'some status', 'someone responsible'],
        ['example description', 'example', 'status example', 'someone responsible 2'],
        ['dsc 3', 'name 1', 'status name 1', 'someone responsible 3'],
        ['dsc 4', 'name 2', 'status name 2', 'someone responsible 4'],
        ['dsc 5', 'name 3', 'status name 3', 'someone responsible 5'],
      ]
      await activeColumnsList[1].selectItem()
      await sourceControlsButtons[0].click()
      await dialogSaveButton.click()
      expect(spy).toHaveBeenCalled()
      dataTable = await dataView.getDataTable()
      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      tableRows = (await dataTable?.getRows()) ?? []
      const headers = await parallel(() => tableHeaders.map((header) => header.getText()))
      const rows = await parallel(() => tableRows.map((row) => row.getData()))
      expect(headers).toEqual(expectedHeaders)
      expect(rows).toEqual(expectedRowsData)
    })

    it('should move item down in picklist active columns list', async () => {
      const spy = jest.spyOn(CustomGroupColumnSelectorComponent.prototype, 'onSaveClick')
      const expectedHeaders = [
        'COLUMN_HEADER_NAME.NAME',
        'COLUMN_HEADER_NAME.STATUS',
        'COLUMN_HEADER_NAME.DESCRIPTION',
        'COLUMN_HEADER_NAME.RESPONSIBLE',
        'Actions',
      ]
      const expectedRowsData = [
        ['some name', 'some status', 'dsc 1', 'someone responsible'],
        ['example', 'status example', 'example description', 'someone responsible 2'],
        ['name 1', 'status name 1', 'dsc 3', 'someone responsible 3'],
        ['name 2', 'status name 2', 'dsc 4', 'someone responsible 4'],
        ['name 3', 'status name 3', 'dsc 5', 'someone responsible 5'],
      ]

      await activeColumnsList[1].selectItem()
      await sourceControlsButtons[2].click()
      await dialogSaveButton.click()

      expect(spy).toHaveBeenCalled()

      dataTable = await dataView.getDataTable()
      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      tableRows = (await dataTable?.getRows()) ?? []
      const headers = await parallel(() => tableHeaders.map((header) => header.getText()))
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(headers).toEqual(expectedHeaders)
      expect(rows).toEqual(expectedRowsData)
    })

    it('should move item in picklist from active to inactive', async () => {
      const spy = jest.spyOn(CustomGroupColumnSelectorComponent.prototype, 'onSaveClick')
      const expectedHeaders = [
        'COLUMN_HEADER_NAME.DESCRIPTION',
        'COLUMN_HEADER_NAME.STATUS',
        'COLUMN_HEADER_NAME.RESPONSIBLE',
        'Actions',
      ]
      const expectedRowsData = [
        ['dsc 1', 'some status', 'someone responsible'],
        ['example description', 'status example', 'someone responsible 2'],
        ['dsc 3', 'status name 1', 'someone responsible 3'],
        ['dsc 4', 'status name 2', 'someone responsible 4'],
        ['dsc 5', 'status name 3', 'someone responsible 5'],
      ]

      await activeColumnsList[0].selectItem()
      await transferControlsButtons[0].click()
      await dialogSaveButton.click()

      expect(spy).toHaveBeenCalled()

      dataTable = await dataView.getDataTable()
      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      tableRows = (await dataTable?.getRows()) ?? []
      const headers = await parallel(() => tableHeaders.map((header) => header.getText()))
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(headers).toEqual(expectedHeaders)
      expect(rows).toEqual(expectedRowsData)
    })

    it('should move item in picklist from inactive to active', async () => {
      const spy = jest.spyOn(CustomGroupColumnSelectorComponent.prototype, 'onSaveClick')
      const expectedHeaders = [
        'COLUMN_HEADER_NAME.NAME',
        'COLUMN_HEADER_NAME.DESCRIPTION',
        'COLUMN_HEADER_NAME.STATUS',
        'COLUMN_HEADER_NAME.RESPONSIBLE',
        'COLUMN_HEADER_NAME.START_DATE',
        'Actions',
      ]
      const expectedRowsData = [
        ['some name', 'dsc 1', 'some status', 'someone responsible', dateUtils.localizedDate('2023-09-13T09:34:05Z')],
        [
          'example',
          'example description',
          'status example',
          'someone responsible 2',
          dateUtils.localizedDate('2023-09-12T09:33:53Z'),
        ],
        ['name 1', 'dsc 3', 'status name 1', 'someone responsible 3', dateUtils.localizedDate('2023-09-14T09:34:22Z')],
        ['name 2', 'dsc 4', 'status name 2', 'someone responsible 4', dateUtils.localizedDate('2023-09-14T09:34:22Z')],
        ['name 3', 'dsc 5', 'status name 3', 'someone responsible 5', dateUtils.localizedDate('2023-09-14T09:34:22Z')],
      ]

      await inActiveColumnsList[0].selectItem()
      await transferControlsButtons[2].click()
      await dialogSaveButton.click()
      expect(spy).toHaveBeenCalled()

      dataTable = await dataView.getDataTable()
      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      tableRows = (await dataTable?.getRows()) ?? []
      const headers = await parallel(() => tableHeaders.map((header) => header.getText()))
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(headers).toEqual(expectedHeaders)
      expect(rows).toEqual(expectedRowsData)
    })

    it('should allow users to configure the action column position', async () => {
      const spy = jest.spyOn(CustomGroupColumnSelectorComponent.prototype, 'onSaveClick')
      expect(component.actionColumnPosition).toBe('right')
      expect(component.frozenActionColumn).toBe(false)
      await actionColumnPositionSelectButtons[0].click()
      await dialogSaveButton.click()

      expect(spy).toHaveBeenCalled()

      expect(component.actionColumnPosition).toBe('left')

      expect(await dataTable?.getActionColumnHeader('right')).toBe(null)
      expect(await dataTable?.getActionColumn('right')).toBe(null)

      const leftActionColumnHeader = await dataTable?.getActionColumnHeader('left')
      const leftActionColumn = await dataTable?.getActionColumn('left')
      expect(leftActionColumnHeader).toBeTruthy()
      expect(leftActionColumn).toBeTruthy()
      expect(await dataTable?.columnIsFrozen(leftActionColumnHeader)).toBe(false)
      expect(await dataTable?.columnIsFrozen(leftActionColumn)).toBe(false)
    })

    it('should allow users to freeze action column', async () => {
      const spy = jest.spyOn(CustomGroupColumnSelectorComponent.prototype, 'onSaveClick')
      expect(component.actionColumnPosition).toBe('right')
      expect(component.frozenActionColumn).toBe(false)
      await frozenActionColumnSelectButtons[0].click()
      await dialogSaveButton.click()

      expect(spy).toHaveBeenCalled()

      expect(component.frozenActionColumn).toBe(true)

      expect(await dataTable?.getActionColumnHeader('left')).toBe(null)
      expect(await dataTable?.getActionColumn('left')).toBe(null)

      const rightActionColumnHeader = await dataTable?.getActionColumnHeader('right')
      const rightActionColumn = await dataTable?.getActionColumn('right')
      expect(rightActionColumnHeader).toBeTruthy()
      expect(rightActionColumn).toBeTruthy()
      expect(await dataTable?.columnIsFrozen(rightActionColumnHeader)).toBe(true)
      expect(await dataTable?.columnIsFrozen(rightActionColumn)).toBe(true)
    })
  })

  describe('Filter view ', () => {
    let dataTable: DataTableHarness | null
    let tableHeaders: TableHeaderColumnHarness[]

    let filterViewHarness: FilterViewHarness

    beforeEach(async () => {
      component.disableFilterView = false
      fixture.detectChanges()
      // select FULL group
      const columnGroupSelectionDropdown = await loader.getHarness(
        PSelectHarness.with({ inputId: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getSelectItems()
      await dropdownItems[2].selectItem()

      const dataView = await loader.getHarness(DataViewHarness)
      expect(dataView).toBeDefined()
      dataTable = await dataView.getDataTable()
      expect(dataTable).toBeDefined()
      tableHeaders = await dataTable!.getHeaderColumns()

      expect(await tableHeaders[2].getText()).toBe('COLUMN_HEADER_NAME.START_DATE')
      const startDateFilterMultiSelect = await tableHeaders[2].getFilterMultiSelect()
      const startDateAllFilterOptions = await startDateFilterMultiSelect.getAllOptions()
      await startDateAllFilterOptions[0].click()
      await startDateFilterMultiSelect.close()

      expect(await tableHeaders[0].getText()).toBe('COLUMN_HEADER_NAME.NAME')
      const nameFilterMultiSelect = await tableHeaders[0].getFilterMultiSelect()
      const nameAllFilterOptions = await nameFilterMultiSelect.getAllOptions()
      await nameAllFilterOptions[0].click()
      await nameFilterMultiSelect.close()

      expect(await tableHeaders[4].getText()).toBe('COLUMN_HEADER_NAME.STATUS')
      const statusFilterMultiSelect = await tableHeaders[4].getFilterMultiSelect()
      const statusAllFilterOptions = await statusFilterMultiSelect.getAllOptions()
      await statusAllFilterOptions[0].click()
      await statusFilterMultiSelect.close()

      expect(await tableHeaders[9].getText()).toBe('COLUMN_HEADER_NAME.TEST_TRUTHY')
      const testTruthyFilterMultiSelect = await tableHeaders[9].getFilterMultiSelect()
      const testTruthyAllFilterOptions = await testTruthyFilterMultiSelect.getAllOptions()
      await testTruthyAllFilterOptions[0].click()
      await testTruthyFilterMultiSelect.close()

      filterViewHarness = await loader.getHarness(FilterViewHarness)
    })

    it('should show button by default', async () => {
      const filtersButton = await filterViewHarness.getFiltersButton()
      expect(filtersButton).toBeTruthy()
      expect(await filtersButton?.getLabel()).toBe('Filters')
      expect(await filtersButton?.getBadgeValue()).toBe('4')
    })

    describe('chip section', () => {
      it('should show chips when specified and breakpoint is not mobile', async () => {
        component.filterViewDisplayMode = 'chips'
        fixture.detectChanges()
        let filtersButton = await filterViewHarness.getFiltersButton()
        expect(filtersButton).toBeFalsy()

        let chipResetFiltersButton = await filterViewHarness.getChipsResetFiltersButton()
        expect(chipResetFiltersButton).toBeTruthy()
        expect(await chipResetFiltersButton?.getIcon()).toBe(PrimeIcons.ERASER)

        let chips = await filterViewHarness.getChips()
        expect(chips).toBeTruthy()
        expect(chips.length).toBe(4)

        expect(await chips[0].getContent()).toBe('COLUMN_HEADER_NAME.TEST_TRUTHY: Yes')
        expect(await chips[1].getContent()).toBe('COLUMN_HEADER_NAME.STATUS: some status')
        expect(await chips[2].getContent()).toBe('COLUMN_HEADER_NAME.NAME: some name')
        expect(await chips[3].getContent()).toBe('+1')

        const orgMatchMedia = window.matchMedia
        window.matchMedia = jest.fn(() => {
          return {
            matches: true,
          }
        }) as any
        window.dispatchEvent(new Event('resize'))

        fixture.detectChanges()
        filtersButton = await filterViewHarness.getFiltersButton()
        expect(filtersButton).toBeTruthy()

        chipResetFiltersButton = await filterViewHarness.getChipsResetFiltersButton()
        expect(chipResetFiltersButton).toBeFalsy()

        chips = await filterViewHarness.getChips()
        expect(chips.length).toBe(0)

        window.matchMedia = orgMatchMedia
      })

      it('should show no filters message when no filters selected', async () => {
        component.filters = []
        component.filterViewDisplayMode = 'chips'
        fixture.detectChanges()

        const chipResetFiltersButton = await filterViewHarness.getChipsResetFiltersButton()
        expect(chipResetFiltersButton).toBeTruthy()

        const chips = await filterViewHarness.getChips()
        expect(chips.length).toBe(0)

        const noFilters = await filterViewHarness.getNoFiltersMessage()
        expect(noFilters).toBeTruthy()
        expect(await noFilters?.getText()).toBe('No filters selected')
      })

      it('should reset filters on reset filters button click', async () => {
        component.filterViewDisplayMode = 'chips'
        fixture.detectChanges()

        const chips = await filterViewHarness.getChips()
        expect(chips.length).toBe(4)

        const chipResetFiltersButton = await filterViewHarness.getChipsResetFiltersButton()
        await chipResetFiltersButton?.click()
        expect(component.filters).toEqual([])
        const chipsAfterReset = await filterViewHarness.getChips()
        expect(chipsAfterReset.length).toBe(0)
      })

      it('should use provided chip selection strategy', async () => {
        const datePipe = new DatePipe('en')
        component.filterViewDisplayMode = 'chips'
        component.selectDisplayedChips = (data) => limit(data, 1, { reverse: false })
        fixture.detectChanges()

        const chips = await filterViewHarness.getChips()
        expect(chips.length).toBe(2)

        expect(await chips[0].getContent()).toBe(
          'COLUMN_HEADER_NAME.START_DATE: ' + datePipe.transform('2023-09-13T09:34:05Z', 'medium')
        )
      })

      it('should remove filter on chip removal', async () => {
        component.filterViewDisplayMode = 'chips'
        fixture.detectChanges()

        const chips = await filterViewHarness.getChips()
        expect(chips.length).toBe(4)
        expect(component.filters.length).toBe(4)
        await chips[0].clickRemove()

        const chipsAfterRemove = await filterViewHarness.getChips()
        expect(chipsAfterRemove.length).toBe(3)
        expect(component.filters.length).toBe(3)
        expect(await chipsAfterRemove[0].getContent()).toBe('COLUMN_HEADER_NAME.STATUS: some status')
      })

      it('should show panel on show more chips click', async () => {
        component.filterViewDisplayMode = 'chips'
        fixture.detectChanges()

        let dataTable = await filterViewHarness.getDataTable()
        expect(dataTable).toBeFalsy()

        const chips = await filterViewHarness.getChips()
        expect(chips.length).toBe(4)
        expect(await chips[3].getContent()).toBe('+1')
        await chips[3].click()
        fixture.detectChanges()

        dataTable = await filterViewHarness.getDataTable()
        expect(dataTable).toBeTruthy()
      })
    })

    describe('without chips', () => {
      it('should show panel on button click', async () => {
        let dataTable = await filterViewHarness.getDataTable()
        expect(dataTable).toBeFalsy()

        const filtersButton = await filterViewHarness.getFiltersButton()
        await filtersButton?.click()
        fixture.detectChanges()

        dataTable = await filterViewHarness.getDataTable()
        expect(dataTable).toBeTruthy()
      })
    })

    describe('overlay', () => {
      it('should show data table with column filters', async () => {
        const datePipe = new DatePipe('en')
        let dataTable = await filterViewHarness.getDataTable()
        expect(dataTable).toBeFalsy()

        const filtersButton = await filterViewHarness.getFiltersButton()
        await filtersButton?.click()
        fixture.detectChanges()

        dataTable = await filterViewHarness.getDataTable()
        expect(dataTable).toBeTruthy()

        if (dataTable) {
          const headers = await dataTable.getHeaderColumns()
          expect(headers).toBeTruthy()
          expect(headers.length).toBe(3)
          expect(await headers[0].getText()).toBe('Column name')
          expect(await headers[1].getText()).toBe('Filter value')
          expect(await headers[2].getText()).toBe('Actions')

          if (dataTable) {
            const rows = await dataTable.getRows()
            expect(rows.length).toBe(4)
            expect(await rows[0].getData()).toEqual(['COLUMN_HEADER_NAME.NAME', 'some name', ''])
            expect(await rows[1].getData()).toEqual([
              'COLUMN_HEADER_NAME.START_DATE',
              datePipe.transform('2023-09-13T09:34:05Z', 'medium'),
              '',
            ])
            expect(await rows[2].getData()).toEqual(['COLUMN_HEADER_NAME.STATUS', 'some status', ''])
            expect(await rows[3].getData()).toEqual(['COLUMN_HEADER_NAME.TEST_TRUTHY', 'Yes', ''])
          }
        }
      })

      it('should show reset all filters button above the table', async () => {
        const filtersButton = await filterViewHarness.getFiltersButton()
        await filtersButton?.click()
        fixture.detectChanges()

        const resetButton = await filterViewHarness.getOverlayResetFiltersButton()
        expect(resetButton).toBeTruthy()

        const dataTable = await filterViewHarness.getDataTable()
        if (dataTable) {
          expect((await dataTable.getRows()).length).toBe(4)

          await resetButton?.click()
          const rows = await dataTable.getRows()
          expect(rows.length).toBe(1)
          expect(await rows[0].getData()).toEqual(['No filters selected'])
        }
      })

      it('should show remove filter in action column', async () => {
        const filtersButton = await filterViewHarness.getFiltersButton()
        await filtersButton?.click()
        fixture.detectChanges()

        const dataTable = await filterViewHarness.getDataTable()
        if (dataTable) {
          let rows = await dataTable.getRows()
          expect(rows.length).toBe(4)
          const buttons = await rows[0].getAllActionButtons()
          expect(buttons.length).toBe(1)
          await buttons[0].click()

          rows = await dataTable.getRows()
          expect(rows.length).toBe(3)
          expect(component.filters.length).toBe(3)
        }
      })
    })
  })

  describe('Grid view ', () => {
    let dataLayoutSelection: DataLayoutSelectionHarness
    let dataView: DataViewHarness
    let dataGrid: DataListGridHarness | null
    let gridItems: DefaultGridItemHarness[]

    let sortingDropdown: PSelectHarness
    let sortingDropdownItems: ListItemHarness[]
    let dataListGridSortingButton: PButtonHarness

    beforeEach(async () => {
      dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)

      await dataLayoutSelection.selectGridLayout()

      dataView = await loader.getHarness(DataViewHarness)
      dataGrid = await dataView?.getDataListGrid()
      sortingDropdown = await loader.getHarness(PSelectHarness.with({ id: 'dataListGridSortingDropdown' }))
      sortingDropdownItems = await sortingDropdown.getSelectItems()
      dataListGridSortingButton = await loader.getHarness(PButtonHarness.with({ id: 'dataListGridSortingButton' }))
    })
    const expectedInitialGridItemsData = [
      ['/path/to/image', 'some name', '2023-09-13T09:34:05Z'],
      ['/path/to/image2', 'example', '2023-09-12T09:33:53Z'],
      ['/path/to/image3', 'name 1', '2023-09-14T09:34:22Z'],
      ['/path/to/image4', 'name 2', '2023-09-14T09:34:22Z'],
      ['./onecx-portal-lib/assets/images/placeholder.png', 'name 3', '2023-09-14T09:34:22Z'],
    ]

    it('should load grid', async () => {
      expect(dataGrid).toBeTruthy()
      expect(await dataLayoutSelection.getCurrentLayout()).toEqual('grid')
    })

    it('should get grid data', async () => {
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedInitialGridItemsData)
    })

    it('should be sorted by first sorting dropdown item in ascending order', async () => {
      const expectedGridItemsDataAfterSorting = [
        ['/path/to/image2', 'example', '2023-09-12T09:33:53Z'],
        ['/path/to/image3', 'name 1', '2023-09-14T09:34:22Z'],
        ['/path/to/image4', 'name 2', '2023-09-14T09:34:22Z'],
        ['./onecx-portal-lib/assets/images/placeholder.png', 'name 3', '2023-09-14T09:34:22Z'],
        ['/path/to/image', 'some name', '2023-09-13T09:34:05Z'],
      ]

      await sortingDropdownItems[0].selectItem()
      await dataListGridSortingButton.click()

      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedGridItemsDataAfterSorting)
    })

    it('should be sorted by first sorting dropdown item in descending order', async () => {
      const expectedGridItemsDataAfterSorting = [
        ['/path/to/image', 'some name', '2023-09-13T09:34:05Z'],
        ['./onecx-portal-lib/assets/images/placeholder.png', 'name 3', '2023-09-14T09:34:22Z'],
        ['/path/to/image4', 'name 2', '2023-09-14T09:34:22Z'],
        ['/path/to/image3', 'name 1', '2023-09-14T09:34:22Z'],
        ['/path/to/image2', 'example', '2023-09-12T09:33:53Z'],
      ]

      await sortingDropdownItems[0].selectItem()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()

      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedGridItemsDataAfterSorting)
    })

    it('should be sorted by first sorting dropdown item back to default order', async () => {
      await sortingDropdownItems[0].selectItem()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()

      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedInitialGridItemsData)
    })

    it('should get view actions menu button of first grid item and get event viewItem with first data grid item when clicked', async () => {
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemMoreActionsMenu = await gridItems[0].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[0].selectItem()

      expect(viewItemEvent).toEqual(component.data[0])
    })

    it('should get view actions menu button of third grid item and get event viewItem with third data grid item when clicked', async () => {
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemMoreActionsMenu = await gridItems[2].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[0].selectItem()

      expect(viewItemEvent).toEqual(component.data[2])
    })

    it('should get edit actions menu button first grid item and get event editItem with first data grid item when clicked', async () => {
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemMoreActionsMenu = await gridItems[0].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[1].selectItem()

      expect(editItemEvent).toEqual(component.data[0])
    })

    it('should get edit actions menu button third grid item and get event editItem with third data grid item when clicked', async () => {
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemMoreActionsMenu = await gridItems[2].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[1].selectItem()

      expect(editItemEvent).toEqual(component.data[2])
    })

    it('should get delete actions menu button first grid item and get event deleteItem with first data grid item when clicked', async () => {
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemMoreActionsMenu = await gridItems[0].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[2].selectItem()

      expect(deleteItemEvent).toEqual(component.data[0])
    })

    it('should get delete actions menu button third grid item and get event deleteItem with third data grid item when clicked', async () => {
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemMoreActionsMenu = await gridItems[2].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[2].selectItem()

      expect(deleteItemEvent).toEqual(component.data[2])
    })
  })

  describe('List view ', () => {
    let dataLayoutSelection: DataLayoutSelectionHarness
    let dataView: DataViewHarness
    let dataList: DataListGridHarness | null
    let listItems: DefaultListItemHarness[]

    let sortingDropdown: PSelectHarness
    let sortingDropdownItems: ListItemHarness[]
    let dataListGridSortingButton: PButtonHarness

    beforeEach(async () => {
      dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)
      await dataLayoutSelection.selectListLayout()

      fixture.detectChanges()
      await fixture.whenStable()

      dataView = await loader.getHarness(DataViewHarness)
      dataList = await dataView?.getDataListGrid()
      sortingDropdown = await loader.getHarness(PSelectHarness.with({ id: 'dataListGridSortingDropdown' }))
      sortingDropdownItems = await sortingDropdown.getSelectItems()
      dataListGridSortingButton = await loader.getHarness(PButtonHarness.with({ id: 'dataListGridSortingButton' }))
    })
    const expectedInitialListItemsData = [
      ['some name', '2023-09-13T09:34:05Z'],
      ['example', '2023-09-12T09:33:53Z'],
      ['name 1', '2023-09-14T09:34:22Z'],
      ['name 2', '2023-09-14T09:34:22Z'],
      ['name 3', '2023-09-14T09:34:22Z'],
    ]

    it('should load list', async () => {
      expect(dataList).toBeTruthy()
      expect(await dataLayoutSelection.getCurrentLayout()).toEqual('list')
    })

    it('should get list data', async () => {
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedInitialListItemsData)
    })

    it('should be sorted by first sorting dropdown item in ascending order', async () => {
      const expectedListItemsDataAfterSorting = [
        ['example', '2023-09-12T09:33:53Z'],
        ['name 1', '2023-09-14T09:34:22Z'],
        ['name 2', '2023-09-14T09:34:22Z'],
        ['name 3', '2023-09-14T09:34:22Z'],
        ['some name', '2023-09-13T09:34:05Z'],
      ]

      await sortingDropdownItems[0].selectItem()
      await dataListGridSortingButton.click()

      listItems = (await dataList?.getDefaultListItems()) ?? []
      const listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedListItemsDataAfterSorting)
    })

    it('should be sorted by first sorting dropdown item in descending order', async () => {
      const expectedListItemsDataAfterSorting = [
        ['some name', '2023-09-13T09:34:05Z'],
        ['name 3', '2023-09-14T09:34:22Z'],
        ['name 2', '2023-09-14T09:34:22Z'],
        ['name 1', '2023-09-14T09:34:22Z'],
        ['example', '2023-09-12T09:33:53Z'],
      ]

      await sortingDropdownItems[0].selectItem()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()

      listItems = (await dataList?.getDefaultListItems()) ?? []
      const listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedListItemsDataAfterSorting)
    })

    it('should be sorted by first sorting dropdown item back to default order', async () => {
      await sortingDropdownItems[0].selectItem()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()

      listItems = (await dataList?.getDefaultListItems()) ?? []
      const listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedInitialListItemsData)
    })

    it('should get list item view button of first list item and get event viewItem with first data list item when clicked', async () => {
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const viewButton = await listItems[0].getViewButton()
      await viewButton?.click()

      expect(viewItemEvent).toEqual(component.data[0])
    })

    it('should get list item view button of third list item and get event viewItem with third data list item when clicked', async () => {
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const viewButton = await listItems[2].getViewButton()
      await viewButton?.click()

      expect(viewItemEvent).toEqual(component.data[2])
    })

    it('should get list item view button of first list item and get event editItem with first data list item when clicked', async () => {
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const editButton = await listItems[0].getEditButton()
      await editButton?.click()

      expect(editItemEvent).toEqual(component.data[0])
    })

    it('should get list item view button of third list item and get event editItem with third data list item when clicked', async () => {
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const editButton = await listItems[2].getEditButton()
      await editButton?.click()

      expect(editItemEvent).toEqual(component.data[2])
    })

    it('should get list item view button of first list item and get event deleteItem with first data list item when clicked', async () => {
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const deleteButton = await listItems[0].getDeleteButton()
      await deleteButton?.click()

      expect(deleteItemEvent).toEqual(component.data[0])
    })

    it('should get list item view button of third list item and get event deleteItem with third data list item when clicked', async () => {
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const deleteButton = await listItems[2].getDeleteButton()
      await deleteButton?.click()

      expect(deleteItemEvent).toEqual(component.data[2])
    })
  })

  describe('Data ', () => {
    let dataLayoutSelection: DataLayoutSelectionHarness
    let dataView: DataViewHarness

    let dataTable: DataTableHarness | null
    let tableHeaders: TableHeaderColumnHarness[]
    let tableRows: TableRowHarness[]
    let allFilterOptions: PMultiSelectListItemHarness[] | undefined

    let dataList: DataListGridHarness | null
    let listItems: DefaultListItemHarness[]

    let dataGrid: DataListGridHarness | null
    let gridItems: DefaultGridItemHarness[]

    beforeEach(async () => {
      component.subtitleLineIds = ['startDate', 'testNumber']

      dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)

      dataView = await loader.getHarness(DataViewHarness)
      dataTable = await dataView.getDataTable()
      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      tableRows = (await dataTable?.getRows()) ?? []

      allFilterOptions = undefined
    })
    const expectedSortedListItemsDataAscending = [
      ['some name', '2023-09-13T09:34:05Z', '1'],
      ['example', '2023-09-12T09:33:53Z', '3.141'],
      ['name 3', '2023-09-14T09:34:22Z', '7.1'],
      ['name 2', '2023-09-14T09:34:22Z', '12345.6789'],
      ['name 1', '2023-09-14T09:34:22Z', '123456789'],
    ]
    const expectedSortedListItemsDataDescending = [
      ['name 1', '2023-09-14T09:34:22Z', '123456789'],
      ['name 2', '2023-09-14T09:34:22Z', '12345.6789'],
      ['name 3', '2023-09-14T09:34:22Z', '7.1'],
      ['example', '2023-09-12T09:33:53Z', '3.141'],
      ['some name', '2023-09-13T09:34:05Z', '1'],
    ]
    const expectedSortedGridItemsDataDescending = [
      ['/path/to/image3', 'name 1', '2023-09-14T09:34:22Z', '123456789'],
      ['/path/to/image4', 'name 2', '2023-09-14T09:34:22Z', '12345.6789'],
      ['./onecx-portal-lib/assets/images/placeholder.png', 'name 3', '2023-09-14T09:34:22Z', '7.1'],
      ['/path/to/image2', 'example', '2023-09-12T09:33:53Z', '3.141'],
      ['/path/to/image', 'some name', '2023-09-13T09:34:05Z', '1'],
    ]
    const expectedSortedGridItemsDataAscending = [
      ['/path/to/image', 'some name', '2023-09-13T09:34:05Z', '1'],
      ['/path/to/image2', 'example', '2023-09-12T09:33:53Z', '3.141'],
      ['./onecx-portal-lib/assets/images/placeholder.png', 'name 3', '2023-09-14T09:34:22Z', '7.1'],
      ['/path/to/image4', 'name 2', '2023-09-14T09:34:22Z', '12345.6789'],
      ['/path/to/image3', 'name 1', '2023-09-14T09:34:22Z', '123456789'],
    ]

    it('should remain sorted after switching data view from table view to grid view and to list view', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      const columnGroupSelectionDropdown = await loader.getHarness(
        PSelectHarness.with({ inputId: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getSelectItems()
      await dropdownItems[1].selectItem()

      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      const sortButton = await tableHeaders?.[6].getSortButton()
      await sortButton?.click()

      await dataLayoutSelection.selectGridLayout()

      dataGrid = await dataView.getDataListGrid()
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedSortedGridItemsDataAscending)

      await dataLayoutSelection.selectListLayout()

      dataList = await dataView.getDataListGrid()
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedSortedListItemsDataAscending)
    })

    it('should remain sorted after switching data view from table view to list view then sort again and switch to grid view', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      const columnGroupSelectionDropdown = await loader.getHarness(
        PSelectHarness.with({ inputId: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getSelectItems()
      await dropdownItems[1].selectItem()

      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      const sortButton = await tableHeaders?.[6].getSortButton()
      await sortButton?.click()

      await dataLayoutSelection.selectListLayout()

      dataList = await dataView.getDataListGrid()
      listItems = (await dataList?.getDefaultListItems()) ?? []
      let listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedSortedListItemsDataAscending)

      const sortingDropdown = await loader.getHarness(PSelectHarness.with({ id: 'dataListGridSortingDropdown' }))
      const dataListGridSortingButton = await loader.getHarness(
        PButtonHarness.with({ id: 'dataListGridSortingButton' })
      )

      expect(await (await sortingDropdown.host()).text()).toEqual('COLUMN_HEADER_NAME.TEST_NUMBER')
      await dataListGridSortingButton.click()

      listItems = (await dataList?.getDefaultListItems()) ?? []
      listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedSortedListItemsDataDescending)

      await dataLayoutSelection.selectGridLayout()

      dataGrid = await dataView.getDataListGrid()
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedSortedGridItemsDataDescending)
    })

    it('should remain filtered with third filter option after switching view data view from table view to grid view and to list view', async () => {
      const expectedFilteredRowsData = [['name 1', 'dsc 3', 'status name 1', 'someone responsible 3']]
      const expectedFilteredListItemsData = [['name 1', '2023-09-14T09:34:22Z', '123456789']]
      const expectedFilteredGridItemsData = [['/path/to/image3', 'name 1', '2023-09-14T09:34:22Z', '123456789']]
      const filterMultiSelect = await tableHeaders?.[0].getFilterMultiSelect()

      allFilterOptions = await filterMultiSelect?.getAllOptions()
      await allFilterOptions?.[2].click()

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedFilteredRowsData)

      await dataLayoutSelection.selectGridLayout()

      dataGrid = await dataView.getDataListGrid()
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedFilteredGridItemsData)

      await dataLayoutSelection.selectListLayout()

      dataList = await dataView.getDataListGrid()
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedFilteredListItemsData)
    })
  })
  describe('Dynamically disable/hide based on field path in interactive data view', () => {
    const setUpMockData = async (viewType: 'grid' | 'list' | 'table') => {
      const userServiceMock = TestBed.inject(UserServiceMock)
      userServiceMock.permissionsTopic$.publish(['VIEW', 'EDIT', 'DELETE'])
      component.viewItem.subscribe(() => console.log())
      component.editItem.subscribe(() => console.log())
      component.deleteItem.subscribe(() => console.log())
      component.viewPermission = 'VIEW'
      component.editPermission = 'EDIT'
      component.deletePermission = 'DELETE'
      component.layout = viewType
      component.columns = [
        {
          columnType: ColumnType.STRING,
          id: 'name',
          nameKey: 'COLUMN_HEADER_NAME.NAME',
        },
        {
          columnType: ColumnType.STRING,
          id: 'ready',
          nameKey: 'Ready',
        },
      ]
      component.data = [
        {
          id: 'Test',
          imagePath:
            'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          name: 'Card 1',
          ready: false,
        },
      ]
      component.titleLineId = 'name'

      fixture.detectChanges()
      await fixture.whenStable()
    }

    describe('Disable list action buttons based on field path', () => {
      it('should not disable any buttons initially', async () => {
        await setUpMockData('list')
        const dataView = await (await interactiveDataViewHarness.getDataView()).getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 0)).toBe(true)
      })

      it('should disable a button based on a given field path', async () => {
        await setUpMockData('list')
        component.viewActionEnabledField = 'ready'
        const dataView = await (await interactiveDataViewHarness.getDataView()).getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 1)).toBe(true)
      })
    })

    describe('Disable grid action buttons based on field path', () => {
      it('should not disable any buttons initially', async () => {
        await setUpMockData('grid')
        const dataView = await (await interactiveDataViewHarness.getDataView()).getDataListGrid()
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 0)).toBe(true)
      })

      it('should disable a button based on a given field path', async () => {
        await setUpMockData('grid')
        component.viewActionEnabledField = 'ready'
        const dataView = await (await interactiveDataViewHarness.getDataView()).getDataListGrid()
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 1)).toBe(true)
      })
    })

    describe('Disable table action buttons based on field path', () => {
      it('should not disable any buttons initially', async () => {
        await setUpMockData('table')
        const dataTable = await (await interactiveDataViewHarness.getDataView()).getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(3)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(0)).toBe(true)
      })

      it('should disable a button based on a given field path', async () => {
        await setUpMockData('table')
        component.viewActionEnabledField = 'ready'
        const dataTable = await (await interactiveDataViewHarness.getDataView()).getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(3)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(1)).toBe(true)
      })
    })

    describe('Hide list action buttons based on field path', () => {
      it('should not hide any buttons initially', async () => {
        await setUpMockData('list')
        const dataView = await (await interactiveDataViewHarness.getDataView()).getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 0)).toBe(true)
      })

      it('should hide a button based on a given field path', async () => {
        await setUpMockData('list')
        component.viewActionVisibleField = 'ready'
        const dataView = await (await interactiveDataViewHarness.getDataView()).getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 2)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 0)).toBe(true)
      })
    })

    describe('Hide grid action buttons based on field path', () => {
      it('should not hide any buttons initially', async () => {
        await setUpMockData('grid')
        const dataView = await (await interactiveDataViewHarness.getDataView()).getDataListGrid()
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        expect(await dataView?.hasAmountOfActionButtons('grid-hidden', 0)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 0)).toBe(true)
      })

      it('should hide a button based on a given field path', async () => {
        await setUpMockData('grid')
        const dataView = await (await interactiveDataViewHarness.getDataView()).getDataListGrid()
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        await (await dataView?.getMenuButton())?.click()

        component.viewActionVisibleField = 'ready'
        await (await dataView?.getMenuButton())?.click()

        expect(await dataView?.hasAmountOfActionButtons('grid', 2)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 0)).toBe(true)
      })
    })

    describe('Hide table action buttons based on field path', () => {
      it('should not hide any buttons initially', async () => {
        await setUpMockData('table')
        const dataTable = await (await interactiveDataViewHarness.getDataView()).getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(3)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(0)).toBe(true)
      })

      it('should hide a button based on a given field path', async () => {
        await setUpMockData('table')
        component.viewActionVisibleField = 'ready'
        const dataTable = await (await interactiveDataViewHarness.getDataView()).getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(2)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(0)).toBe(true)
      })
    })
  })

  it('should react on group selection change event emit', () => {
    const columnsChangeSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')
    const columnKeysChangeSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')

    component.groupSelectionChangedSlotEmitter.emit({
      activeColumns: [
        {
          id: 'first-col',
        } as any,
        {
          id: 'second-col',
        } as any,
      ],
      groupKey: 'my-search-config',
    })

    expect(component.displayedColumnKeys).toStrictEqual(['first-col', 'second-col'])
    expect(component.selectedGroupKey).toBe('my-search-config')
    expect(columnsChangeSpy).toHaveBeenCalled()
    expect(columnKeysChangeSpy).toHaveBeenCalledWith(['first-col', 'second-col'])
  })

  it('should render the header with a class, when given a headerStyleClass via input', async () => {
    component.headerStyleClass = 'mt-4'

    const expectedStyleClasses = ['p-3', 'border-bottom-1', 'surface-border', 'mt-4']
    expect(await interactiveDataViewHarness.getHeaderStyleClasses()).toEqual(expectedStyleClasses)
  })

  it('should render the content with a class, when given a contentStyleClass via input', async () => {
    component.contentStyleClass = 'mt-4'

    const expectedStyleClasses = ['p-3', 'mt-4']
    expect(await interactiveDataViewHarness.getContentStyleClasses()).toEqual(expectedStyleClasses)
  })
})


```

### File: angular-accelerator/src/lib/components/interactive-data-view/interactive-data-view.component.stories.ts

```ts

import { Meta, StoryFn } from '@storybook/angular'
import { InteractiveDataViewComponent } from './interactive-data-view.component'
import {
  InteractiveDataViewComponentSBConfig,
  defaultInteractiveDataViewArgs,
  InteractiveDataViewTemplate,
  defaultInteractiveDataViewArgTypes,
} from './storybook-config'
import { ColumnType } from '../../model/column-type.model'

const InteractiveDataViewComponentDefaultSBConfig: Meta<InteractiveDataViewComponent> = {
  ...InteractiveDataViewComponentSBConfig,
  title: 'Components/InteractiveDataViewComponent',
}
type InteractiveDataViewInputTypes = Pick<InteractiveDataViewComponent, 'data' | 'columns' | 'emptyResultsMessage'>

const defaultComponentArgs: InteractiveDataViewInputTypes = {
  ...defaultInteractiveDataViewArgs,
}

const defaultComponentArgTypes = {
  ...defaultInteractiveDataViewArgTypes,
}

export const WithMockData = {
  argTypes: {
    ...defaultComponentArgTypes,
    componentStateChanged: { action: 'componentStateChanged' },
    selectionChanged: { action: 'selectionChanged' },
  },
  render: InteractiveDataViewTemplate,
  args: {
    ...defaultComponentArgs,
    selectedRows: [],
  },
}

function generateColumns(count: number) {
  const data = []
  for (let i = 0; i < count; i++) {
    const row = {
      id: `${i + 1}`,
      columnType: ColumnType.STRING,
      nameKey: `Product${i + 1}`,
      sortable: false,
      filterable: true,
      predefinedGroupKeys: ['test'],
    }
    data.push(row)
  }
  return data
}

function generateRows(rowCount: number, columnCount: number) {
  const data = []
  for (let i = 0; i < rowCount; i++) {
    const row = {} as any
    for (let j = 0; j < columnCount; j++) {
      row[j + 1] = `Test value for ${j + 1}`
    }
    data.push(row)
  }
  return data
}

function generateColumnTemplates(columnCount: number) {
  let templates = ''
  for (let i = 0; i < columnCount; i++) {
    templates += `
    <ng-template pTemplate="${i + 1}IdListValue" let-rowObject="rowObject" let-column="column">
      <ng-container>${i + 1} {{ rowObject[${i + 1}] }} </ng-container>
    </ng-template>`
  }
  return templates
}

const columnCount = 30
const rowCount = 500

const HugeMockDataTemplate: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data">
    ${generateColumnTemplates(Math.ceil(columnCount / 3))}
  </ocx-interactive-data-view>`,
})

export const WithHugeMockData = {
  argTypes: {
    ...defaultComponentArgTypes,
    componentStateChanged: { action: 'componentStateChanged' },
    selectionChanged: { action: 'selectionChanged' },
  },
  render: HugeMockDataTemplate,
  args: {
    ...defaultComponentArgs,
    columns: generateColumns(columnCount),
    data: generateRows(rowCount, columnCount),
    emptyResultsMessage: 'No results',
    selectedRows: [],
    pageSize: 50,
  },
}

export const WithPageSizes = {
  argTypes: {
    ...defaultComponentArgTypes,
    componentStateChanged: { action: 'componentStateChanged' },
  },
  render: InteractiveDataViewTemplate,
  args: {
    ...defaultComponentArgs,
    pageSizes: [2, 15, 25],
    showAllOption: false,
  },
}

export const WithCustomStyleClasses = {
  argTypes: {
    componentStateChanged: { action: 'componentStateChanged' },
  },
  render: InteractiveDataViewTemplate,
  args: {
    ...defaultComponentArgs,
    headerStyleClass: 'py-2',
    contentStyleClass: 'py-4',
  },
}

const CustomContentInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data">
    <ng-template #list let-item>
      <div class="w-full px-4 py-2 card mb-4">
        <p>{{item.product}}</p>
        <p-progressBar [value]="item.amount" />
      </div>
    </ng-template>
    <ng-template #grid let-item>
      <div class="w-3 px-4 py-2 card m-0 mr-4">
        <p>{{item.product}}</p>
        <p-progressBar [value]="item.amount" showValue="false"/>
      </div>
  </ng-template>
  <ng-template #topCenter>
    <input pInputText placeholder="Custom input injected via template" class="border-round w-18rem p-2" />
  </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithCustomContentTemplates = {
  render: CustomContentInteractiveDataView,
  args: defaultComponentArgs,
}

const CustomTableCellsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data">
    <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>DATE: {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="numberTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>NUMBER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithCustomTableCellTemplates = {
  render: CustomTableCellsInteractiveDataView,
  args: {
    ...defaultComponentArgs,
  },
}

const CustomTableFilterCellsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data">
    <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="stringTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING FILTER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>DATE: {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>DATE FILTER: {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="numberTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>NUMBER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithCustomTableFilterCellTemplates = {
  render: CustomTableFilterCellsInteractiveDataView,
  args: {
    ...defaultComponentArgs,
  },
}

const CustomTableColumnCellsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data">
    <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="stringTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING FILTER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="productIdTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container> PRODUCT (ID): {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="productIdTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container> PRODUCT FILTER (ID): {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>DATE: {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>DATE FILTER: {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateIdTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container> DATE (ID): {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateIdTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container> DATE FILTER (ID): {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="numberTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>NUMBER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithCustomTableColumnTemplates = {
  render: CustomTableColumnCellsInteractiveDataView,
  args: {
    ...defaultComponentArgs,
  },
}

const ExampleTemplate: StoryFn<InteractiveDataViewComponent & { content: any }> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data">
    ${args.content}
  </ocx-interactive-data-view>`,
})

export const ExampleWithTemplateControl = {
  render: ExampleTemplate,
  args: {
    ...defaultComponentArgs,
    content: `<ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
  <ng-container>MY STRING TEMPLATE PROVIDED VIA CONTENT CONTROL: {{ rowObject[column.id] }} </ng-container>
</ng-template>`,
  },
}

export default InteractiveDataViewComponentDefaultSBConfig


```

### File: angular-accelerator/src/lib/components/interactive-data-view/interactive-data-view.component.ts

```ts

import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core'
import { SlotService } from '@onecx/angular-remote-components'
import { PrimeTemplate } from 'primeng/api'
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  combineLatest,
  distinctUntilChanged,
  map,
  startWith,
  timestamp,
  withLatestFrom,
} from 'rxjs'
import { DataAction } from '../../model/data-action'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { Filter } from '../../model/filter.model'
import { limit } from '../../utils/filter.utils'
import { orderAndMergeValuesByTimestamp } from '../../utils/rxjs-utils'
import {
  ColumnGroupSelectionComponentState,
  GroupSelectionChangedEvent,
} from '../column-group-selection/column-group-selection.component'
import {
  ActionColumnChangedEvent,
  ColumnSelectionChangedEvent,
  CustomGroupColumnSelectorComponentState,
} from '../custom-group-column-selector/custom-group-column-selector.component'
import { DataLayoutSelectionComponentState } from '../data-layout-selection/data-layout-selection.component'
import { DataListGridSortingComponentState } from '../data-list-grid-sorting/data-list-grid-sorting.component'
import { Row, Sort } from '../data-table/data-table.component'
import { DataViewComponent, DataViewComponentState, RowListGridData } from '../data-view/data-view.component'
import { FilterViewComponentState, FilterViewDisplayMode } from '../filter-view/filter-view.component'

export type InteractiveDataViewComponentState = ColumnGroupSelectionComponentState &
  CustomGroupColumnSelectorComponentState &
  DataLayoutSelectionComponentState &
  DataListGridSortingComponentState &
  DataViewComponentState &
  FilterViewComponentState

export interface ColumnGroupData {
  activeColumns: DataTableColumn[]
  groupKey: string
}
@Component({
  standalone: false,
  selector: 'ocx-interactive-data-view',
  templateUrl: './interactive-data-view.component.html',
  styleUrls: ['./interactive-data-view.component.css'],
  providers: [{ provide: 'InteractiveDataViewComponent', useExisting: InteractiveDataViewComponent }],
})
export class InteractiveDataViewComponent implements OnInit, AfterContentInit {
  private readonly slotService = inject(SlotService)

  _dataViewComponent: DataViewComponent | undefined
  @ViewChild(DataViewComponent) set dataView(ref: DataViewComponent | undefined) {
    this._dataViewComponent = ref
    this.registerEventListenerForDataView()
  }
  get dataView(): DataViewComponent | undefined {
    return this._dataViewComponent
  }

  columnGroupSelectionComponentState$ = new ReplaySubject<ColumnGroupSelectionComponentState>(1)
  customGroupColumnSelectorComponentState$ = new ReplaySubject<CustomGroupColumnSelectorComponentState>(1)
  dataLayoutComponentState$ = new ReplaySubject<DataLayoutSelectionComponentState>(1)
  dataListGridSortingComponentState$ = new ReplaySubject<DataListGridSortingComponentState>(1)
  dataViewComponentState$ = new ReplaySubject<DataViewComponentState>(1)
  filterViewComponentState$ = new ReplaySubject<FilterViewComponentState>(1)

  @Input() searchConfigPermission: string | string[] | undefined
  @Input() deletePermission: string | string[] | undefined
  @Input() editPermission: string | string[] | undefined
  @Input() viewPermission: string | string[] | undefined
  @Input() deleteActionVisibleField: string | undefined
  @Input() deleteActionEnabledField: string | undefined
  @Input() viewActionVisibleField: string | undefined
  @Input() viewActionEnabledField: string | undefined
  @Input() editActionVisibleField: string | undefined
  @Input() editActionEnabledField: string | undefined
  @Input() tableSelectionEnabledField: string | undefined
  @Input() tableAllowSelectAll = true
  @Input() name = 'Data'
  @Input() titleLineId: string | undefined
  @Input() subtitleLineIds: string[] = []
  @Input() supportedViewLayouts: ('grid' | 'list' | 'table')[] = ['grid', 'list', 'table']
  @Input() columns: DataTableColumn[] = []
  @Input() emptyResultsMessage: string | undefined
  @Input() clientSideSorting = true
  @Input() clientSideFiltering = true
  @Input() fallbackImage = 'placeholder.png'
  @Input() filters: Filter[] = []
  @Input() sortDirection: DataSortDirection = DataSortDirection.NONE
  @Input() sortField: any = ''
  @Input() sortStates: DataSortDirection[] = [
    DataSortDirection.ASCENDING,
    DataSortDirection.DESCENDING,
    DataSortDirection.NONE,
  ]
  @Input() pageSizes: number[] = [10, 25, 50]
  @Input() pageSize: number | undefined
  @Input() totalRecordsOnServer: number | undefined
  @Input() layout: 'grid' | 'list' | 'table' = 'table'
  @Input() defaultGroupKey = ''
  @Input() customGroupKey = 'OCX_INTERACTIVE_DATA_VIEW.CUSTOM_GROUP'
  @Input() groupSelectionNoGroupSelectedKey = 'OCX_INTERACTIVE_DATA_VIEW.NO_GROUP_SELECTED'
  @Input() currentPageShowingKey = 'OCX_DATA_TABLE.SHOWING'
  @Input() currentPageShowingWithTotalOnServerKey = 'OCX_DATA_TABLE.SHOWING_WITH_TOTAL_ON_SERVER'
  @Input() additionalActions: DataAction[] = []
  @Input() listGridPaginator = true
  @Input() tablePaginator = true
  @Input() disableFilterView = true
  @Input() filterViewDisplayMode: FilterViewDisplayMode = 'button'
  @Input() filterViewChipStyleClass = ''
  @Input() filterViewTableStyle: { [klass: string]: any } = { 'max-height': '50vh' }
  @Input() filterViewPanelStyle: { [klass: string]: any } = { 'max-width': '90%' }
  @Input() selectDisplayedChips: (filters: Filter[], columns: DataTableColumn[]) => Filter[] = (filters) =>
    limit(filters, 3, { reverse: true })
  @Input() page = 0
  @Input() selectedRows: Row[] = []
  displayedColumnKeys$ = new BehaviorSubject<string[]>([])
  displayedColumns$: Observable<DataTableColumn[]> | undefined
  @Input()
  get displayedColumnKeys(): string[] {
    return this.displayedColumnKeys$.getValue()
  }
  set displayedColumnKeys(value: string[]) {
    this.displayedColumnKeys$.next(value)
  }
  @Input() frozenActionColumn = false
  @Input() actionColumnPosition: 'left' | 'right' = 'right'
  @Input() headerStyleClass: string | undefined
  @Input() contentStyleClass: string | undefined
  @ContentChild('tableCell') tableCell: TemplateRef<any> | undefined
  primeNgTableCell: TemplateRef<any> | undefined
  @ContentChild('dateTableCell') dateTableCell: TemplateRef<any> | undefined
  primeNgDateTableCell: TemplateRef<any> | undefined

  @ContentChild('relativeDateTableCell') relativeDateTableCell: TemplateRef<any> | undefined
  primeNgRelativeDateTableCell: TemplateRef<any> | undefined

  @ContentChild('translationKeyTableCell') translationKeyTableCell: TemplateRef<any> | undefined
  primeNgTranslationKeyTableCell: TemplateRef<any> | undefined

  @ContentChild('gridItemSubtitleLines') gridItemSubtitleLines: TemplateRef<any> | undefined
  primeNgGridItemSubtitleLines: TemplateRef<any> | undefined
  @ContentChild('listItemSubtitleLines') listItemSubtitleLines: TemplateRef<any> | undefined
  primeNgListItemSubtitleLines: TemplateRef<any> | undefined
  // TODO: Implement same fix for other templates and child components
  @ContentChild('stringTableCell') stringTableCell: TemplateRef<any> | undefined
  primeNgStringTableCell: TemplateRef<any> | undefined
  @ContentChild('numberTableCell') numberTableCell: TemplateRef<any> | undefined
  primeNgNumberTableCell: TemplateRef<any> | undefined
  @ContentChild('gridItem') gridItem: TemplateRef<any> | undefined
  primeNgGridItem: TemplateRef<any> | undefined
  @ContentChild('listItem') listItem: TemplateRef<any> | undefined
  primeNgListItem: TemplateRef<any> | undefined
  @ContentChild('topCenter') topCenter: TemplateRef<any> | undefined
  primeNgTopCenter: TemplateRef<any> | undefined
  @ContentChild('listValue') listValue: TemplateRef<any> | undefined
  primeNgListValue: TemplateRef<any> | undefined
  @ContentChild('translationKeyListValue') translationKeyListValue: TemplateRef<any> | undefined
  primeNgTranslationKeyListValue: TemplateRef<any> | undefined
  @ContentChild('numberListValue') numberListValue: TemplateRef<any> | undefined
  primeNgNumberListValue: TemplateRef<any> | undefined
  @ContentChild('relativeDateListValue') relativeDateListValue: TemplateRef<any> | undefined
  primeNgRelativeDateListValue: TemplateRef<any> | undefined
  @ContentChild('stringListValue') stringListValue: TemplateRef<any> | undefined
  primeNgStringListValue: TemplateRef<any> | undefined
  @ContentChild('dateListValue') dateListValue: TemplateRef<any> | undefined
  primeNgDateListValue: TemplateRef<any> | undefined
  @ContentChild('tableFilterCell') tableFilterCell: TemplateRef<any> | undefined
  primeNgTableFilterCell: TemplateRef<any> | undefined
  @ContentChild('dateTableFilterCell') dateTableFilterCell: TemplateRef<any> | undefined
  primeNgDateTableFilterCell: TemplateRef<any> | undefined
  @ContentChild('relativeDateTableFilterCell') relativeDateTableFilterCell: TemplateRef<any> | undefined
  primeNgRelativeDateTableFilterCell: TemplateRef<any> | undefined
  @ContentChild('translationKeyTableFilterCell') translationKeyTableFilterCell: TemplateRef<any> | undefined
  primeNgTranslationKeyTableFilterCell: TemplateRef<any> | undefined
  @ContentChild('stringTableFilterCell') stringTableFilterCell: TemplateRef<any> | undefined
  primeNgStringTableFilterCell: TemplateRef<any> | undefined
  @ContentChild('numberTableFilterCell') numberTableFilterCell: TemplateRef<any> | undefined
  primeNgNumberTableFilterCell: TemplateRef<any> | undefined

  templates$: BehaviorSubject<QueryList<PrimeTemplate> | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | undefined
  >(undefined)
  @ContentChildren(PrimeTemplate)
  set templates(value: QueryList<PrimeTemplate> | undefined) {
    this.templates$.next(value)
  }

  @Output() filtered = new EventEmitter<Filter[]>()
  @Output() sorted = new EventEmitter<Sort>()
  @Output() deleteItem = new EventEmitter<RowListGridData>()
  @Output() viewItem = new EventEmitter<RowListGridData>()
  @Output() editItem = new EventEmitter<RowListGridData>()
  @Output() dataViewLayoutChange = new EventEmitter<'grid' | 'list' | 'table'>()
  @Output() displayedColumnKeysChange = new EventEmitter<string[]>()
  @Output() selectionChanged: EventEmitter<Row[]> = new EventEmitter()

  @Output() pageChanged: EventEmitter<number> = new EventEmitter()
  @Output() pageSizeChanged = new EventEmitter<number>()

  @Output() componentStateChanged = new EventEmitter<InteractiveDataViewComponentState>()

  selectedGroupKey$ = new BehaviorSubject<string | undefined>('')
  get selectedGroupKey(): string | undefined {
    return this.selectedGroupKey$.getValue()
  }
  set selectedGroupKey(value: string | undefined) {
    this.selectedGroupKey$.next(value)
  }
  isDeleteItemObserved: boolean | undefined
  isViewItemObserved: boolean | undefined
  isEditItemObserved: boolean | undefined
  firstColumnId: string | undefined

  @Input()
  get paginator(): boolean {
    return this.listGridPaginator && this.tablePaginator
  }
  set paginator(value: boolean) {
    this.listGridPaginator = value
    this.tablePaginator = value
  }

  get _gridItemSubtitleLines(): TemplateRef<any> | undefined {
    return this.gridItemSubtitleLines
  }
  get _listItemSubtitleLines(): TemplateRef<any> | undefined {
    return this.listItemSubtitleLines
  }
  get _tableCell(): TemplateRef<any> | undefined {
    return this.tableCell
  }
  get _stringTableCell(): TemplateRef<any> | undefined {
    return this.stringTableCell
  }
  get _numberTableCell(): TemplateRef<any> | undefined {
    return this.numberTableCell
  }
  get _dateTableCell(): TemplateRef<any> | undefined {
    return this.dateTableCell
  }
  get _relativeDateTableCell(): TemplateRef<any> | undefined {
    return this.relativeDateTableCell
  }
  get _translationKeyTableCell(): TemplateRef<any> | undefined {
    return this.translationKeyTableCell
  }
  get _gridItem(): TemplateRef<any> | undefined {
    return this.gridItem
  }
  get _listItem(): TemplateRef<any> | undefined {
    return this.listItem
  }
  get _listValue(): TemplateRef<any> | undefined {
    return this.listValue
  }
  get _translationKeyListValue(): TemplateRef<any> | undefined {
    return this.translationKeyListValue
  }
  get _numberListValue(): TemplateRef<any> | undefined {
    return this.numberListValue
  }
  get _relativeDateListValue(): TemplateRef<any> | undefined {
    return this.relativeDateListValue
  }
  get _stringListValue(): TemplateRef<any> | undefined {
    return this.stringListValue
  }
  get _dateListValue(): TemplateRef<any> | undefined {
    return this.dateListValue
  }
  get _tableFilterCell(): TemplateRef<any> | undefined {
    return this.tableFilterCell
  }
  get _dateTableFilterCell(): TemplateRef<any> | undefined {
    return this.dateTableFilterCell
  }
  get _relativeDateTableFilterCell(): TemplateRef<any> | undefined {
    return this.relativeDateTableFilterCell
  }
  get _translationKeyTableFilterCell(): TemplateRef<any> | undefined {
    return this.translationKeyTableFilterCell
  }
  get _stringTableFilterCell(): TemplateRef<any> | undefined {
    return this.stringTableFilterCell
  }
  get _numberTableFilterCell(): TemplateRef<any> | undefined {
    return this.numberTableFilterCell
  }

  _data: RowListGridData[] = []
  @Input()
  get data(): RowListGridData[] {
    return this._data
  }
  set data(value: RowListGridData[]) {
    this._data = value
  }

  columnGroupSlotName = 'onecx-column-group-selection'
  isColumnGroupSelectionComponentDefined$: Observable<boolean>
  groupSelectionChangedSlotEmitter = new EventEmitter<ColumnGroupData | undefined>()

  constructor() {
    this.isColumnGroupSelectionComponentDefined$ = this.slotService
      .isSomeComponentDefinedForSlot(this.columnGroupSlotName)
      .pipe(startWith(true))

    this.groupSelectionChangedSlotEmitter.subscribe((event: ColumnGroupData | undefined) => {
      event ??= {
        activeColumns: this.getDisplayedColumns(),
        groupKey: this.selectedGroupKey ?? this.defaultGroupKey,
      }
      this.displayedColumnKeys$.next(event.activeColumns.map((col) => col.id))
      this.selectedGroupKey$.next(event.groupKey)
      this.displayedColumnKeysChange.emit(this.displayedColumnKeys)
      this.columnGroupSelectionComponentState$.next({
        activeColumnGroupKey: event.groupKey,
        displayedColumns: event.activeColumns,
      })
    })

    this.dataViewLayoutChange
      .pipe(withLatestFrom(this.isColumnGroupSelectionComponentDefined$))
      .subscribe(([_, columnGroupComponentDefined]) => {
        if (columnGroupComponentDefined) {
          if (
            !(
              this.columns.find((c) => c.nameKey === this.selectedGroupKey) ||
              this.selectedGroupKey === this.customGroupKey
            )
          ) {
            this.selectedGroupKey$.next(undefined)
          }
        }
      })
  }

  ngOnInit(): void {
    this.selectedGroupKey = this.defaultGroupKey
    if (this.defaultGroupKey && this.defaultGroupKey !== this.customGroupKey) {
      this.displayedColumnKeys = this.columns
        .filter((column) => column.predefinedGroupKeys?.includes(this.defaultGroupKey))
        .map((column) => column.id)
    }
    this.displayedColumns$ = this.displayedColumnKeys$.pipe(
      distinctUntilChanged((prev, curr) => prev.length === curr.length && prev.every((v, i) => curr[i] === v)),
      map(
        (columnKeys) =>
          (columnKeys.map((key) => this.columns.find((col) => col.id === key)).filter((d) => d) as DataTableColumn[]) ??
          []
      )
    )
    this.displayedColumnKeysChange.emit(this.displayedColumnKeys)
    if (!this.groupSelectionNoGroupSelectedKey) {
      this.groupSelectionNoGroupSelectedKey = 'OCX_INTERACTIVE_DATA_VIEW.NO_GROUP_SELECTED'
    }
    this.firstColumnId = this.columns[0]?.id

    let dataListGridSortingComponentState$: Observable<DataListGridSortingComponentState | Record<string, never>> =
      this.dataListGridSortingComponentState$
    let columnGroupSelectionComponentState$: Observable<ColumnGroupSelectionComponentState | Record<string, never>> =
      this.columnGroupSelectionComponentState$
    let customGroupColumnSelectorComponentState$: Observable<
      CustomGroupColumnSelectorComponentState | Record<string, never>
    > = this.customGroupColumnSelectorComponentState$

    if (this.layout === 'table') {
      dataListGridSortingComponentState$ = dataListGridSortingComponentState$.pipe(startWith({}))
    } else {
      columnGroupSelectionComponentState$ = columnGroupSelectionComponentState$.pipe(
        startWith({
          activeColumnGroupKey: this.selectedGroupKey,
          displayedColumns: this.getDisplayedColumns(),
        })
      )
      customGroupColumnSelectorComponentState$ = customGroupColumnSelectorComponentState$.pipe(
        startWith({
          actionColumnConfig: {
            frozen: this.frozenActionColumn,
            position: this.actionColumnPosition,
          },
          displayedColumns: this.getDisplayedColumns(),
          activeColumnGroupKey: this.selectedGroupKey,
        })
      )
    }

    let filterViewComponentState$: Observable<FilterViewComponentState | Record<string, never>> =
      this.filterViewComponentState$
    if (this.disableFilterView) {
      filterViewComponentState$ = filterViewComponentState$.pipe(
        startWith({
          filters: this.filters,
        })
      )
    }

    combineLatest([
      columnGroupSelectionComponentState$.pipe(timestamp()),
      customGroupColumnSelectorComponentState$.pipe(timestamp()),
      this.dataLayoutComponentState$.pipe(timestamp()),
      dataListGridSortingComponentState$.pipe(timestamp()),
      this.dataViewComponentState$.pipe(timestamp()),
      filterViewComponentState$.pipe(timestamp()),
    ])
      .pipe(
        map((componentStates) => {
          return orderAndMergeValuesByTimestamp(componentStates)
        })
      )
      .subscribe((val) => {
        this.componentStateChanged.emit(val)
      })
  }

  ngAfterContentInit() {
    this.templates$.value?.forEach((item) => {
      switch (item.getType()) {
        case 'tableCell':
          this.primeNgTableCell = item.template
          break
        case 'dateTableCell':
          this.primeNgDateTableCell = item.template
          break
        case 'relativeDateTableCell':
          this.primeNgRelativeDateTableCell = item.template
          break
        case 'translationKeyTableCell':
          this.primeNgTranslationKeyTableCell = item.template
          break
        case 'gridItemSubtitleLines':
          this.primeNgGridItemSubtitleLines = item.template
          break
        case 'listItemSubtitleLines':
          this.primeNgListItemSubtitleLines = item.template
          break
        case 'stringTableCell':
          this.primeNgStringTableCell = item.template
          break
        case 'numberTableCell':
          this.primeNgNumberTableCell = item.template
          break
        case 'gridItem':
          this.primeNgGridItem = item.template
          break
        case 'listItem':
          this.primeNgListItem = item.template
          break
        case 'topCenter':
          this.primeNgTopCenter = item.template
          break
        case 'listValue':
          this.primeNgListValue = item.template
          break
        case 'translationKeyListValue':
          this.primeNgTranslationKeyListValue = item.template
          break
        case 'numberListValue':
          this.primeNgNumberListValue = item.template
          break
        case 'relativeDateListValue':
          this.primeNgRelativeDateListValue = item.template
          break
        case 'stringListValue':
          this.primeNgStringListValue = item.template
          break
        case 'dateListValue':
          this.primeNgDateListValue = item.template
          break
        case 'tableFilterCell':
          this.primeNgTableFilterCell = item.template
          break
        case 'dateTableFilterCell':
          this.primeNgDateTableFilterCell = item.template
          break
        case 'relativeDateTableFilterCell':
          this.primeNgRelativeDateTableFilterCell = item.template
          break
        case 'translationKeyTableFilterCell':
          this.primeNgTranslationKeyTableFilterCell = item.template
          break
        case 'stringTableFilterCell':
          this.primeNgStringTableFilterCell = item.template
          break
        case 'numberTableFilterCell':
          this.primeNgNumberTableFilterCell = item.template
          break
      }
    })
  }

  filtering(event: any) {
    this.filters = event
    this.filtered.emit(event)
  }

  sorting(event: any) {
    this.sortDirection = event.sortDirection
    this.sortField = event.sortColumn
    this.sorted.emit(event)
  }

  onDeleteElement(element: RowListGridData) {
    if (this.isDeleteItemObserved) {
      this.deleteItem.emit(element)
    }
  }

  onViewElement(element: RowListGridData) {
    if (this.isViewItemObserved) {
      this.viewItem.emit(element)
    }
  }

  onEditElement(element: RowListGridData) {
    if (this.isEditItemObserved) {
      this.editItem.emit(element)
    }
  }

  onDataViewLayoutChange(layout: 'grid' | 'list' | 'table') {
    this.layout = layout
    this.dataViewLayoutChange.emit(layout)
  }

  onSortChange($event: any) {
    this.sortField = $event
    this.sorted.emit({ sortColumn: this.sortField, sortDirection: this.sortDirection })
  }

  onSortDirectionChange($event: any) {
    this.sortDirection = $event
    this.sorted.emit({ sortColumn: this.sortField, sortDirection: this.sortDirection })
  }

  onColumnGroupSelectionChange(event: GroupSelectionChangedEvent) {
    this.displayedColumnKeys = event.activeColumns.map((col) => col.id)
    this.selectedGroupKey = event.groupKey
    this.displayedColumnKeysChange.emit(this.displayedColumnKeys)
  }

  registerEventListenerForDataView() {
    if (this.deleteItem.observed) {
      this.isDeleteItemObserved = true
      if (!this._dataViewComponent?.deleteItem.observed) {
        this._dataViewComponent?.deleteItem.subscribe((event) => {
          this.onDeleteElement(event)
        })
      }
    }
    if (this.viewItem.observed) {
      this.isViewItemObserved = true
      if (!this._dataViewComponent?.viewItem.observed) {
        this._dataViewComponent?.viewItem.subscribe((event) => {
          this.onViewElement(event)
        })
      }
    }
    if (this.editItem.observed) {
      this.isEditItemObserved = true
      if (!this._dataViewComponent?.editItem.observed) {
        this._dataViewComponent?.editItem.subscribe((event) => {
          this.onEditElement(event)
        })
      }
    }
    if (this.selectionChanged.observed) {
      if (!this._dataViewComponent?.selectionChanged.observed) {
        this._dataViewComponent?.selectionChanged.subscribe((event) => {
          this.onRowSelectionChange(event)
        })
      }
    }
  }

  onColumnSelectionChange(event: ColumnSelectionChangedEvent) {
    this.displayedColumnKeys = event.activeColumns.map((col) => col.id)
    this.selectedGroupKey = this.customGroupKey
    this.displayedColumnKeysChange.emit(this.displayedColumnKeys)
  }

  onActionColumnConfigChange(event: ActionColumnChangedEvent) {
    this.frozenActionColumn = event.frozenActionColumn
    this.actionColumnPosition = event.actionColumnPosition
  }

  onRowSelectionChange(event: Row[]) {
    if (this.selectionChanged.observed) {
      this.selectionChanged.emit(event)
    }
  }

  onPageChange(event: number) {
    this.page = event
    this.pageChanged.emit(event)
  }

  onPageSizeChange(event: number) {
    this.pageSize = event
    this.pageSizeChanged.emit(event)
  }

  getDisplayedColumns(): DataTableColumn[] {
    return (
      (this.displayedColumnKeys
        .map((key) => this.columns.find((c) => c.id === key))
        .filter((d) => d) as DataTableColumn[]) ?? []
    )
  }
}


```

### File: angular-accelerator/src/lib/components/interactive-data-view/interactive-data-view-filter-view.component.stories.ts

```ts

import { Meta, StoryFn } from '@storybook/angular'
import { InteractiveDataViewComponent } from './interactive-data-view.component'
import { Filter } from '../../model/filter.model'
import {
  defaultInteractiveDataViewArgs,
  defaultInteractiveDataViewArgTypes,
  InteractiveDataViewComponentSBConfig,
  InteractiveDataViewTemplate,
} from './storybook-config'

const InteractiveDataViewComponentFilterViewSBConfig: Meta<InteractiveDataViewComponent> = {
  ...InteractiveDataViewComponentSBConfig,
  title: 'Components/InteractiveDataViewComponent/Filtering',
}

type InteractiveDataViewFilterViewInputTypes = Pick<
  InteractiveDataViewComponent,
  'data' | 'columns' | 'emptyResultsMessage' | 'disableFilterView' | 'filterViewDisplayMode'
>
const defaultArgs: InteractiveDataViewFilterViewInputTypes = {
  ...defaultInteractiveDataViewArgs,
  disableFilterView: true,
  filterViewDisplayMode: 'button',
}

const defaultComponentArgTypes = {
  ...defaultInteractiveDataViewArgTypes,
}

const CustomContentInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
    <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data">
      <ng-template #list let-item>
        <div class="w-full px-4 py-2 card mb-4">
          <p>{{item.product}}</p>
          <p-progressBar [value]="item.amount" />
        </div>
      </ng-template>
      <ng-template #grid let-item>
        <div class="w-3 px-4 py-2 card m-0 mr-4">
          <p>{{item.product}}</p>
          <p-progressBar [value]="item.amount" />
        </div>
    </ng-template>
    <ng-template #topCenter>
      <input pInputText placeholder="Custom input injected via template" class="border-round w-18rem p-2" />
    </ng-template>
    </ocx-interactive-data-view>`,
})

export const WithFilterViewChips = {
  argTypes: {
    ...defaultComponentArgTypes,
  },
  render: CustomContentInteractiveDataView,
  args: {
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

export const WithFilterViewButton = {
  argTypes: {
    ...defaultComponentArgTypes,
  },
  render: CustomContentInteractiveDataView,
  args: {
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
  },
}

const CustomFilterViewChipsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
    <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
      <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
        <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
      </ng-template>
      <ng-template pTemplate="stringTableFilterCell" let-rowObject="rowObject" let-column="column">
        <ng-container>STRING FILTER: {{ rowObject[column.id] }} </ng-container>
      </ng-template>
      <ng-template pTemplate="stringFilterChipValue" let-rowObject="rowObject" let-column="column">
        <ng-container>CHIP: {{ rowObject[column.id] }} </ng-container>
      </ng-template>
    </ocx-interactive-data-view>`,
})

export const WithFilterViewCustomChipsTemplates = {
  argTypes: {
    ...defaultComponentArgTypes,
  },
  render: CustomFilterViewChipsInteractiveDataView,
  args: {
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

const CustomFilterViewChipsByColumnInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
    <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
      <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
        <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
      </ng-template>
      <ng-template pTemplate="stringTableFilterCell" let-rowObject="rowObject" let-column="column">
        <ng-container>STRING FILTER: {{ rowObject[column.id] }} </ng-container>
      </ng-template>
      <ng-template pTemplate="stringFilterChipValue" let-rowObject="rowObject" let-column="column">
        <ng-container>CHIP: {{ rowObject[column.id] }} </ng-container>
      </ng-template>
      <ng-template pTemplate="productIdTableCell" let-rowObject="rowObject" let-column="column">
        <ng-container>PRODUCT (ID): {{ rowObject[column.id] }} </ng-container>
      </ng-template>
      <ng-template pTemplate="productIdTableFilterCell" let-rowObject="rowObject" let-column="column">
        <ng-container>PRODUCT FILTER (ID): {{ rowObject[column.id] }} </ng-container>
      </ng-template>
      <ng-template pTemplate="productIdFilterChip" let-rowObject="rowObject" let-column="column">
        <ng-container>PRODUCT CHIP (ID): {{ rowObject[column.id] }} </ng-container>
      </ng-template>
    </ocx-interactive-data-view>`,
})

export const WithFilterViewCustomChipsByColumnTemplates = {
  argTypes: {
    ...defaultComponentArgTypes,
  },
  render: CustomFilterViewChipsByColumnInteractiveDataView,
  args: {
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

const CustomFilterViewCellsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
    <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
      <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
        <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
      </ng-template>
      <ng-template pTemplate="stringTableFilterCell" let-rowObject="rowObject" let-column="column">
        <ng-container>STRING FILTER: {{ rowObject[column.id] }} </ng-container>
      </ng-template>
      <ng-template pTemplate="stringFilterViewCell" let-rowObject="rowObject" let-column="column">
        <ng-container>STRING FILTER VIEW: {{ rowObject[column.id] }} </ng-container>
      </ng-template>
    </ocx-interactive-data-view>`,
})

export const WithFilterViewCustomCellTemplates = {
  argTypes: {
    ...defaultComponentArgTypes,
  },
  render: CustomFilterViewCellsInteractiveDataView,
  args: {
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
  },
}

const CustomFilterViewCellsByColumnInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
    <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
      <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
        <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
      </ng-template>
      <ng-template pTemplate="stringTableFilterCell" let-rowObject="rowObject" let-column="column">
        <ng-container>STRING FILTER: {{ rowObject[column.id] }} </ng-container>
      </ng-template>
      <ng-template pTemplate="stringFilterViewCell" let-rowObject="rowObject" let-column="column">
        <ng-container>STRING FILTER VIEW: {{ rowObject[column.id] }} </ng-container>
      </ng-template>
      <ng-template pTemplate="productIdTableCell" let-rowObject="rowObject" let-column="column">
        <ng-container>PRODUCT (ID): {{ rowObject[column.id] }} </ng-container>
      </ng-template>
      <ng-template pTemplate="productIdTableFilterCell" let-rowObject="rowObject" let-column="column">
        <ng-container>PRODUCT FILTER (ID): {{ rowObject[column.id] }} </ng-container>
      </ng-template>
      <ng-template pTemplate="productIdFilterViewCell" let-rowObject="rowObject" let-column="column">
        <ng-container>PRODUCT FILTER VIEW (ID): {{ rowObject[column.id] }} </ng-container>
      </ng-template>
    </ocx-interactive-data-view>`,
})

export const WithFilterViewCustomCellByColumnTemplates = {
  argTypes: {
    ...defaultComponentArgTypes,
  },
  render: CustomFilterViewCellsByColumnInteractiveDataView,
  args: {
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
  },
}

const CustomFilterViewNoFiltersInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
    <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
      <ng-template pTemplate="fitlerViewNoSelection">
        <span>Filter data to display chips</span>
      </ng-template>
    </ocx-interactive-data-view>`,
})

export const WithFilterViewCustomNoFiltersTemplate = {
  argTypes: {
    ...defaultComponentArgTypes,
  },
  render: CustomFilterViewNoFiltersInteractiveDataView,
  args: {
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

const CustomFilterViewChipContentInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
    <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data" filterViewChipStyleClass="pl-0 pr-3">
      <ng-template pTemplate="filterViewChipContent" let-filter="filter" let-column="column" let-filterValueTemplates="filterValueTemplates" let-truthyTemplate="truthyTemplate" let-filterValueTemplate="filterValueTemplate">
        <span class="bg-primary border-circle w-2rem h-2rem flex align-items-center justify-content-center">{{(column.nameKey | translate).at(0)}}</span>
        <span class="p-chip-text">
          <ng-container *ngIf="filter.filterType === 'TRUTHY'; else myChipValue">
            {{filter.value ? 'MY_YES' : 'MY_NO'}}
          </ng-container>
          <ng-template #myChipValue>
            <ng-container [ngTemplateOutlet]="filterValueTemplate"
            [ngTemplateOutletContext]="{
              templates: filterValueTemplates,
              filter: filter,
              column: column
            }">
            </ng-container>
          </ng-template>
        </span>
      </ng-template>
      <ng-template pTemplate="productIdFilterChip" let-rowObject="rowObject" let-column="column">
        <ng-container>
          [P]{{ rowObject[column.id] }}
        </ng-container>
      </ng-template>
      <ng-template pTemplate="dateTableCell" let-rowObject="rowObject" let-column="column">
        <ng-container>D: {{ rowObject[column.id] | date }} </ng-container>
      </ng-template>
    </ocx-interactive-data-view>`,
})

export const WithFilterViewCustomChipContentTemplate = {
  argTypes: {
    ...defaultComponentArgTypes,
  },
  render: CustomFilterViewChipContentInteractiveDataView,
  args: {
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

const CustomFilterViewShowMoreChipInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
    <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
      <ng-template pTemplate="filterViewShowMoreChip" let-value>
      <span class="p-chip-text flex flex-nowrap align-items-center">
        <i class="pi pi-plus"></i> {{value}}
      </span>
      </ng-template>
    </ocx-interactive-data-view>`,
})

export const WithFilterViewCustomShowMoreChipTemplate = {
  argTypes: {
    ...defaultComponentArgTypes,
  },
  render: CustomFilterViewShowMoreChipInteractiveDataView,
  args: {
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
  },
}

export const WithFilterViewCustomChipSelection = {
  argTypes: {
    ...defaultComponentArgTypes,
  },
  render: InteractiveDataViewTemplate,
  args: {
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'chips',
    selectDisplayedChips: (filters: Filter[]) => {
      return filters.slice(0, 2).reverse()
    },
  },
}

export const WithFilterViewCustomStyles = {
  argTypes: {
    ...defaultComponentArgTypes,
  },
  render: InteractiveDataViewTemplate,
  args: {
    ...defaultArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
    filterViewTableStyle: { 'max-height': '30vh' },
    filterViewPanelStyle: { 'max-width': '80%' },
  },
}

export default InteractiveDataViewComponentFilterViewSBConfig


```

### File: angular-accelerator/src/lib/components/interactive-data-view/storybook-config.ts

```ts

import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { InteractiveDataViewComponent } from './interactive-data-view.component'
import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { ActivatedRoute } from '@angular/router'
import { SlotService } from '@onecx/angular-remote-components'
import { of } from 'rxjs'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { IfBreakpointDirective } from '../../directives/if-breakpoint.directive'
import { CustomGroupColumnSelectorComponent } from '../custom-group-column-selector/custom-group-column-selector.component'
import { ColumnGroupSelectionComponent } from '../column-group-selection/column-group-selection.component'
import { DataViewComponent } from '../data-view/data-view.component'
import { DataTableComponent } from '../data-table/data-table.component'
import { DataLayoutSelectionComponent } from '../data-layout-selection/data-layout-selection.component'
import { DataListGridComponent } from '../data-list-grid/data-list-grid.component'
import { DataListGridSortingComponent } from '../data-list-grid-sorting/data-list-grid-sorting.component'
import { FilterViewComponent } from '../filter-view/filter-view.component'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { MultiSelectModule } from 'primeng/multiselect'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { MenuModule } from 'primeng/menu'
import { PickListModule } from 'primeng/picklist'
import { SelectButtonModule } from 'primeng/selectbutton'
import { DialogModule } from 'primeng/dialog'
import { DataViewModule } from 'primeng/dataview'
import { SelectModule } from 'primeng/select'
import { FormsModule } from '@angular/forms'
import { ProgressBarModule } from 'primeng/progressbar'
import { InputTextModule } from 'primeng/inputtext'
import { FloatLabelModule } from 'primeng/floatlabel'
import { PopoverModule } from 'primeng/popover'
import { FocusTrapModule } from 'primeng/focustrap'
import { ChipModule } from 'primeng/chip'
import { ColumnType } from '../../model/column-type.model'
import { FilterType } from '../../model/filter.model'
import { TooltipOnOverflowDirective } from '../../directives/tooltipOnOverflow.directive'
import { SkeletonModule } from 'primeng/skeleton'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { TooltipModule } from 'primeng/tooltip'
import { TooltipStyle } from 'primeng/tooltip'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'

export const InteractiveDataViewComponentSBConfig: Meta<InteractiveDataViewComponent> = {
  title: 'Components/InteractiveDataViewComponent',
  component: InteractiveDataViewComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        {
          provide: SlotService,
          useValue: {
            isSomeComponentDefinedForSlot() {
              return of(false)
            },
          },
        },
        provideUserServiceMock(),
        { provide: HAS_PERMISSION_CHECKER, useExisting: UserServiceMock },
        importProvidersFrom(StorybookThemeModule),
        TooltipStyle,
      ],
    }),
    moduleMetadata({
      declarations: [
        InteractiveDataViewComponent,
        IfPermissionDirective,
        IfBreakpointDirective,
        CustomGroupColumnSelectorComponent,
        ColumnGroupSelectionComponent,
        DataViewComponent,
        DataTableComponent,
        DataLayoutSelectionComponent,
        DataListGridComponent,
        DataListGridSortingComponent,
        FilterViewComponent,
        TooltipOnOverflowDirective,
      ],
      imports: [
        TableModule,
        ButtonModule,
        MultiSelectModule,
        StorybookTranslateModule,
        MenuModule,
        PickListModule,
        SelectButtonModule,
        DialogModule,
        DataViewModule,
        SelectModule,
        FormsModule,
        ProgressBarModule,
        InputTextModule,
        FloatLabelModule,
        PopoverModule,
        FocusTrapModule,
        ChipModule,
        SkeletonModule,
        TooltipModule,
      ],
    }),
  ],
  argTypes: {
    selectDisplayedChips: { type: 'function', control: false },
  },
}
export const InteractiveDataViewTemplate: StoryFn = (args) => ({
  props: args,
})

export const defaultInteractiveDataViewArgs = {
  columns: [
    {
      id: 'product',
      columnType: ColumnType.STRING,
      nameKey: 'Product',
      sortable: false,
      filterable: true,
      predefinedGroupKeys: ['test'],
    },
    {
      id: 'amount',
      columnType: ColumnType.NUMBER,
      nameKey: 'Amount',
      sortable: true,
      predefinedGroupKeys: ['test', 'test1'],
    },
    {
      id: 'available',
      columnType: ColumnType.STRING,
      nameKey: 'Available',
      sortable: false,
      filterable: true,
      filterType: FilterType.IS_NOT_EMPTY,
      predefinedGroupKeys: ['test2'],
    },
    {
      id: 'date',
      columnType: ColumnType.DATE,
      nameKey: 'Date',
      sortable: false,
      filterable: true,
      predefinedGroupKeys: ['test2'],
    },
  ],
  data: [
    {
      id: 1,
      product: 'Apples',
      amount: 2,
      available: false,
      imagePath: '',
      date: new Date(2022, 1, 1, 13, 14, 55, 120),
    },
    {
      id: 2,
      product: 'Bananas',
      amount: 10,
      imagePath: '',
      date: new Date(2022, 1, 1, 13, 14, 55, 120),
    },
    {
      id: 3,
      product: 'Strawberries',
      amount: 5,
      imagePath: '',
      date: new Date(2022, 1, 3, 13, 14, 55, 120),
    },
  ],
  emptyResultsMessage: 'No results',
  deletePermission: 'TEST_MGMT#TEST_DELETE',
  editPermission: 'TEST_MGMT#TEST_EDIT',
  viewPermission: 'TEST_MGMT#TEST_VIEW',
}

export const defaultInteractiveDataViewArgTypes = {
  deleteItem: { action: 'deleteItem' },
  editItem: { action: 'editItem' },
  viewItem: { action: 'viewItem' },
}


```

## Folder: angular-accelerator/src/lib/components/lifecycle (4 files)

### File: angular-accelerator/src/lib/components/lifecycle/lifecycle.component.html

```html

<p-timeline [value]="steps">
  <ng-template pTemplate="marker" let-step>
    <span class="p-timeline-event-marker" [ngClass]="activeStepId && activeStepId === step.id ? 'bg-primary' : ''"></span>
  </ng-template>
  <ng-template pTemplate="content" let-step>
    <div class="pb-4 h-full">
      <div class="card h-full" [ngClass]="activeStepId && activeStepId === step.id ? 'bg-primary' : ''">
        <p class="font-bold text-xl" [ngClass]="step.details ? 'mb-2' : ''">{{ step.title }}</p>
        @if (step.details) {
          <p [ngClass]="activeStepId && activeStepId === step.id ? '' : 'text-color-secondary'">{{ step.details }}</p>
        }
      </div>
    </div>
  </ng-template>
</p-timeline>


```

### File: angular-accelerator/src/lib/components/lifecycle/lifecycle.component.spec.ts

```ts

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LifecycleComponent, LifecycleStep } from './lifecycle.component'
import { TimelineModule } from 'primeng/timeline'
import { LifecycleHarness, TestbedHarnessEnvironment } from '../../../../testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'

const mockSteps: LifecycleStep[] = [
  {
    id: 'test1',
    title: 'Test 1',
  },
  {
    id: 'test2',
    title: 'Test 2',
    details: 'Test 2 description',
  },
  {
    id: 'test3',
    title: 'Test 3',
  },
]

describe('LifecycleComponent', () => {
  let component: LifecycleComponent
  let fixture: ComponentFixture<LifecycleComponent>
  let lifecycle: LifecycleHarness

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LifecycleComponent],
      imports: [
        TimelineModule,
        AngularAcceleratorModule,
        BrowserAnimationsModule,
        TranslateTestingModule.withTranslations('en', {}),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(LifecycleComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    lifecycle = await TestbedHarnessEnvironment.harnessForFixture(fixture, LifecycleHarness)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
    expect(lifecycle).toBeTruthy()
  })

  it('should not render any initial lifecycle steps', async () => {
    const steps = await lifecycle.getSteps()
    expect(steps.length).toBe(0)
  })

  it('should render given lifecycle steps', async () => {
    component.steps = mockSteps
    const steps = await lifecycle.getSteps()
    const highlightedSteps = await lifecycle.getHighlightedSteps()
    expect(steps.length).toBe(3)
    expect(highlightedSteps.length).toBe(0)
    mockSteps.forEach(async (step, index) => {
      expect(await steps[index].text()).toEqual(step.title + (step.details ?? ''))
    })
  })

  it('should highlight a given lifecycle step', async () => {
    component.steps = mockSteps
    component.activeStepId = 'test2'
    const steps = await lifecycle.getSteps()
    const highlightedSteps = await lifecycle.getHighlightedSteps()
    mockSteps.forEach(async (step, index) => {
      if (step.id == component.activeStepId) {
        expect(await steps[index].hasClass('bg-primary')).toEqual(true)
      }
    })
    expect(steps.length).toBe(3)
    expect(highlightedSteps.length).toBe(1)
  })
})


```

### File: angular-accelerator/src/lib/components/lifecycle/lifecycle.component.stories.ts

```ts

import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { LifecycleComponent, LifecycleStep } from './lifecycle.component'
import { TimelineModule } from 'primeng/timeline'
import { CardModule } from 'primeng/card'

export default {
  title: 'Components/LifecycleComponent',
  component: LifecycleComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserModule), importProvidersFrom(BrowserAnimationsModule)],
    }),
    moduleMetadata({
      declarations: [LifecycleComponent],
      imports: [StorybookTranslateModule, TimelineModule, CardModule],
    }),
  ],
} as Meta<LifecycleComponent>

const Template: StoryFn<LifecycleComponent> = (args: LifecycleComponent) => ({
  props: args,
})

const mockData: LifecycleStep[] = [
    {
        id: "todo",
        title: "ToDo"
    },
    {
        id: "in_progress",
        title: "In Progress",
        details: "This event is currently in progress"
    },
    {
        id: "done",
        title: "Done"
    }
]

export const WithoutHighlightedStep = {
  render: Template,
  args: {
    steps: mockData
  }
}

export const WithHighlightedStep = {
    render: Template,
    args: {
      steps: mockData,
      activeStepId: 'in_progress'
    }
  }

```

### File: angular-accelerator/src/lib/components/lifecycle/lifecycle.component.ts

```ts

import { Component, Input } from '@angular/core'

export interface LifecycleStep {
  id: string
  title: string
  details?: string
}

@Component({
  standalone: false,
  selector: 'ocx-lifecycle',
  templateUrl: './lifecycle.component.html',
})
export class LifecycleComponent {
  @Input() steps: LifecycleStep[] = []
  @Input() activeStepId: string | undefined
}


```

## Folder: angular-accelerator/src/lib/components/loading-indicator (3 files)

### File: angular-accelerator/src/lib/components/loading-indicator/loading-indicator.component.html

```html

<div class="full-overlay">
  <div class="overlay">
    <span class="loader"></span>
  </div>
</div>

```

### File: angular-accelerator/src/lib/components/loading-indicator/loading-indicator.component.stories.ts

```ts

import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { LoadingIndicatorComponent } from './loading-indicator.component'
import { StorybookThemeModule } from '../../storybook-theme.module'

export default {
  title: 'Components/LoadaingIndicatorComponent',
  component: LoadingIndicatorComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [LoadingIndicatorComponent],
      imports: [StorybookTranslateModule],
    }),
  ],
} as Meta<LoadingIndicatorComponent>

const Template: StoryFn<LoadingIndicatorComponent> = (args: LoadingIndicatorComponent) => ({
  props: args,
})

export const Basic = {
  render: Template,
  args: {},
}


```

### File: angular-accelerator/src/lib/components/loading-indicator/loading-indicator.component.ts

```ts

import { Component } from '@angular/core'

@Component({
  standalone: false,
  selector: 'ocx-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss'],
})
export class LoadingIndicatorComponent {}


```

## Folder: angular-accelerator/src/lib/components/page-header (4 files)

### File: angular-accelerator/src/lib/components/page-header/page-header.component.html

```html

<div class="onecx-page-header mb-4" name="ocx-page-header-wrapper">
  @if (showBreadcrumbs) { @if (breadcrumbs$ | async ; as items) {
  <p-breadcrumb
    [model]="items"
    [home]="(home$ | async)?.menuItem ?? {}"
    [homeAriaLabel]="(home$ | async)?.page ? ('OCX_PAGE_HEADER.HOME_ARIA_LABEL' | translate: { page: (home$ | async)?.page}) : ('OCX_PAGE_HEADER.HOME_DEFAULT_ARIA_LABEL' | translate)"
    [attr.manual]="manualBreadcrumbs"
  ></p-breadcrumb>
  } }
  <div class="title-bar flex flex-row md:justify-content-between align-items-center p-3">
    <div class="title-wrap">
      @if (showFigure) {
      <div class="mr-2 figure relative flex h-2rem w-2rem md:h-3rem md:w-3rem">
        <div #previewImage class="figure-image absolute top-0 left-0 right-0 bottom-0">
          <ng-content select="[figureImage]"></ng-content>
          @if (figureImage && !figureImageLoadError) {
          <img [ocxSrc]="figureImage" alt="Figure Image" class="w-full border-round-sm" (error)="handleImageError()" />
          }
        </div>
        @if (previewImage.children.length === 0 || figureImageLoadError) {
        <div class="colorblob flex-1 border-round"></div>
        }
      </div>
      } @if (!loading) {
      <div class="header">
        @if (!!header) {
        <h1 id="page-header">{{ header }}</h1>
        } @if (!!subheader) {
        <div id="page-subheader" role="note" [attr.aria-label]="'OCX_PAGE_HEADER.SUBHEADER' | translate">
          {{ subheader }}
        </div>
        }
      </div>
      } @else {
      <div class="header justify-content-evenly">
        <p-skeleton width="10rem"></p-skeleton>
        <p-skeleton width="10rem"></p-skeleton>
      </div>
      }
    </div>

    <div class="action-items-wrap mt-2 md:mt-0">
      @if (additionalToolbarContentLeft) {
      <ng-container [ngTemplateOutlet]="additionalToolbarContentLeft"> </ng-container>
      } @if (!loading) { @if( inlineActions$ | async; as inlineActions) { @if (inlineActions && inlineActions.length >
      0) {
      <div class="toolbar flex flex-wrap gap-1 sm:gap-2">
        @for (action of inlineActions; track action) {
        <span
          [pTooltip]="action.disabled ? (action.disabledTooltipKey ? (action.disabledTooltipKey | translate) : action.disabledTooltip) : (action.titleKey ? (action.titleKey | translate) : action.title)"
          tooltipPosition="top"
          tooltipEvent="hover"
        >
          <p-button
            [id]="action.id"
            [icon]="action.icon ?? ''"
            [iconPos]="action.iconPos ?? 'left'"
            type="button"
            class="action-button"
            (onClick)="action.actionCallback()"
            [disabled]="action.disabled ? action.disabled : false"
            [attr.name]="action.icon ? 'ocx-page-header-inline-action-icon-button' : 'ocx-page-header-inline-action-button'"
            [label]="action.labelKey ? (action.labelKey | translate) : action.label"
            [ariaLabel]=" (action.ariaLabelKey ? (action.ariaLabelKey | translate) : action.ariaLabel) || (action.titleKey ? (action.titleKey | translate) : action.title) || (action.labelKey ? (action.labelKey | translate) : action.label)"
          ></p-button>
        </span>
        }
      </div>
      } }
      <ng-content select="[toolbarItems]"></ng-content>
      <ng-container>
        @if(overflowActions$ | async; as overflowActions) {@if (overflowActions.length !== 0) {
        <div>
          <button
            id="pageHeaderMenuButton"
            type="button"
            pButton
            icon="pi pi-ellipsis-v"
            class="more-actions-menu-button action-button ml-2"
            (click)="menu.toggle($event)"
            name="ocx-page-header-overflow-action-button"
            [attr.aria-label]="'OCX_PAGE_HEADER.MORE_ACTIONS' | translate"
            [pTooltip]="'OCX_PAGE_HEADER.MORE_ACTIONS' | translate"
            tooltipEvent="hover"
            tooltipPosition="top"
          ></button>
          <p-menu #menu [popup]="true" [model]="overflowActions" appendTo="body"></p-menu>
        </div>
        } }
      </ng-container>
      } @else {
      <div class="flex">
        <p-skeleton shape="circle" size="2rem" styleClass="mr-2"></p-skeleton>
        <p-skeleton shape="circle" size="2rem" styleClass="mb-2"></p-skeleton>
      </div>
      } @if (additionalToolbarContent) {
      <ng-container [ngTemplateOutlet]="additionalToolbarContent"> </ng-container>
      }
    </div>
  </div>

  <div class="object-panel" [ngClass]="getObjectPanelLayoutClasses()">
    @if (objectDetails) { @for (item of objectDetails; track item) {
    <div class="object-info" [ngClass]="getObjectInfoLayoutClasses()">
      <span
        class="flex font-medium text-600 object-info-grid-label"
        name="object-detail-label"
        [pTooltip]="item.labelTooltipKey ? ((typeof item.labelTooltipKey === 'string' ? item.labelTooltipKey : item.labelTooltipKey.key) | translate : (typeof item.labelTooltipKey === 'object' ? item.labelTooltipKey.parameters : undefined)) : ''"
        tooltipEvent="hover"
        tooltipPosition="top"
      >
        {{ item.label | dynamicPipe:item.labelPipe }}
      </span>
      @if (item.icon || item.value) {
      <span class="object-info-grid-value">
        <span
          class="flex text-900 align-items-center gap-2 w-max"
          [ngClass]="generateItemStyle(item)"
          name="object-detail-value"
        >
          <span
            class="flex align-items-center gap-2"
            [pTooltip]="item.valueTooltipKey ? ((typeof item.valueTooltipKey === 'string' ? item.valueTooltipKey : item.valueTooltipKey.key) | translate : (typeof item.valueTooltipKey === 'object' ? item.valueTooltipKey.parameters : undefined)) : ''"
            tooltipEvent="hover"
            tooltipPosition="top"
          >
            @if (item.icon) {
            <i [class]="item.icon + ' ' + (item.iconStyleClass ?? '')" name="object-detail-icon"></i>
            } {{ item.value | dynamicPipe:item.valuePipe:item.valuePipeArgs}}
          </span>
          @if (item.actionItemIcon && item.actionItemCallback) {
          <p-button
            [icon]="item.actionItemIcon"
            styleClass="p-button-text p-0 w-full"
            [ariaLabel]="item.actionItemAriaLabelKey ? ((typeof item.actionItemAriaLabelKey === 'string' ? item.actionItemAriaLabelKey : item.actionItemAriaLabelKey.key) | translate : (typeof item.actionItemAriaLabelKey === 'object' ? item.actionItemAriaLabelKey.parameters : undefined)) : 'button for ' + item.actionItemIcon"
            [pTooltip]="item.actionItemTooltipKey ? ((typeof item.actionItemTooltipKey === 'string' ? item.actionItemTooltipKey : item.actionItemTooltipKey.key) | translate : (typeof item.actionItemTooltipKey === 'object' ? item.actionItemTooltipKey.parameters : undefined)) : ''"
            tooltipPosition="top"
            tooltipEvent="hover"
            (onClick)="item.actionItemCallback()"
          ></p-button>
          }
        </span>
      </span>
      }
    </div>
    } }
    <ng-content></ng-content>
  </div>
</div>


```

### File: angular-accelerator/src/lib/components/page-header/page-header.component.spec.ts

```ts

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import {
  AppStateServiceMock,
  provideAppStateServiceMock,
  provideUserServiceMock,
  UserServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { PrimeIcons } from 'primeng/api'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { TooltipModule } from 'primeng/tooltip'
import { PageHeaderHarness, TestbedHarnessEnvironment } from '../../../../testing'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { Action, ObjectDetailItem, PageHeaderComponent } from './page-header.component'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { UserService } from '@onecx/angular-integration-interface'
import { TranslateService } from '@ngx-translate/core'

const mockActions: Action[] = [
  {
    label: 'My Test Action',
    show: 'always',
    actionCallback: () => {
      console.log('My Test Action')
    },
    permission: 'TEST#TEST_PERMISSION',
  },
  {
    label: 'My Test Overflow Action',
    show: 'asOverflow',
    actionCallback: () => {
      console.log('My Test Overflow Action')
    },
    permission: 'TEST#TEST_PERMISSION',
  },
  {
    label: 'My Test Overflow Disabled Action',
    show: 'asOverflow',
    actionCallback: () => {
      console.log('My Test Overflow Disabled Action')
    },
    permission: 'TEST#TEST_PERMISSION',
    disabled: true,
  },
]

describe('PageHeaderComponent', () => {
  let mockAppStateService: AppStateServiceMock
  let component: PageHeaderComponent
  let fixture: ComponentFixture<PageHeaderComponent>
  let pageHeaderHarness: PageHeaderHarness
  let userServiceMock: UserServiceMock

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageHeaderComponent, PageHeaderComponent, DynamicPipe],
      imports: [
        RouterTestingModule,
        TranslateTestingModule.withTranslations({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
        BreadcrumbModule,
        MenuModule,
        ButtonModule,
        NoopAnimationsModule,
        TooltipModule,
      ],
      providers: [
        provideUserServiceMock(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideAppStateServiceMock(),
        {
          provide: HAS_PERMISSION_CHECKER,
          useExisting: UserService,
        },
      ],
    }).compileComponents()

    mockAppStateService = TestBed.inject(AppStateServiceMock)
    userServiceMock = TestBed.inject(UserServiceMock)
    userServiceMock.permissionsTopic$.publish(['TEST#TEST_PERMISSION'])
    mockAppStateService.currentWorkspace$.publish({
      id: 'i-am-test-portal',
      portalName: 'test',
      workspaceName: 'test',
      baseUrl: '',
      microfrontendRegistrations: [],
    })
  })

  beforeEach(async () => {
    fixture = TestBed.createComponent(PageHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    pageHeaderHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, PageHeaderHarness)
    jest.restoreAllMocks()
  })

  it('should create', async () => {
    expect(component).toBeTruthy()
    const pageHeaderWrapper = await pageHeaderHarness.getPageHeaderWrapperHarness()
    expect(pageHeaderWrapper).toBeTruthy()
  })

  it("should check permissions and not render button that user isn't allowed to see", async () => {
    userServiceMock.permissionsTopic$.publish([])

    expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(0)
    expect(await pageHeaderHarness.getOverflowActionMenuButton()).toBeNull()

    component.actions = mockActions

    expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(0)
    expect(await pageHeaderHarness.getElementByAriaLabel('My Test Action')).toBeFalsy()
    expect(await pageHeaderHarness.getOverFlowMenuItems()).toHaveLength(0)
    expect(await pageHeaderHarness.getElementByAriaLabel('More actions')).toBeFalsy()
  })

  it('should react to permission changes', async () => {
    expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(0)
    expect(await pageHeaderHarness.getOverflowActionMenuButton()).toBeNull()

    component.actions = mockActions

    expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(1)
    expect(await pageHeaderHarness.getElementByAriaLabel('My Test Action')).toBeTruthy()
    await (await pageHeaderHarness.getOverflowActionMenuButton())?.click()
    expect(await pageHeaderHarness.getOverFlowMenuItems()).toHaveLength(2)
    expect(await pageHeaderHarness.getElementByAriaLabel('More actions')).toBeTruthy()

    userServiceMock.permissionsTopic$.publish([])

    expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(0)
    expect(await pageHeaderHarness.getElementByAriaLabel('My Test Action')).toBeFalsy()
    expect(await pageHeaderHarness.getOverFlowMenuItems()).toHaveLength(0)
    expect(await pageHeaderHarness.getElementByAriaLabel('More actions')).toBeFalsy()
  })

  it('should render inline actions buttons with icons', async () => {
    component.actions = [
      {
        label: 'Action with left icon',
        show: 'always',
        actionCallback: () => {
          console.log('My Test Action')
        },
        permission: 'TEST#TEST_PERMISSION',
        icon: PrimeIcons.LOCK,
      },
      {
        label: 'Action with right icon',
        show: 'always',
        actionCallback: () => {
          console.log('My Test Action')
        },
        permission: 'TEST#TEST_PERMISSION',
        icon: PrimeIcons.LOCK,
        iconPos: 'right',
      },
    ]

    const inlineButtons = await pageHeaderHarness.getInlineActionButtons()
    expect(inlineButtons).toHaveLength(2)
    expect(await (await inlineButtons[0].getIconSpan())?.checkHasClass('p-button-icon-left')).toBeTruthy()
    expect(await (await inlineButtons[1].getIconSpan())?.checkHasClass('p-button-icon-right')).toBeTruthy()
  })

  it('should render inline actions buttons with icons', async () => {
    component.actions = [
      {
        label: 'Action with left icon',
        show: 'always',
        actionCallback: () => {
          console.log('My Test Action')
        },
        permission: 'TEST#TEST_PERMISSION',
        icon: PrimeIcons.LOCK,
      },
      {
        label: 'Action with right icon',
        show: 'always',
        actionCallback: () => {
          console.log('My Test Action')
        },
        permission: 'TEST#TEST_PERMISSION',
        icon: PrimeIcons.LOCK,
        iconPos: 'right',
      },
    ]

    const inlineButtons = await pageHeaderHarness.getInlineActionButtons()
    expect(inlineButtons).toHaveLength(2)
    expect(await (await inlineButtons[0].getIconSpan())?.checkHasClass('p-button-icon-left')).toBeTruthy()
    expect(await (await inlineButtons[1].getIconSpan())?.checkHasClass('p-button-icon-right')).toBeTruthy()
  })

  it('should render objectDetails as object info in the page header', async () => {
    const objectDetailsWithoutIcons = [
      {
        label: 'Venue',
        value: 'AIE Munich',
      },
      {
        label: 'Status',
        value: 'Confirmed',
      },
    ]
    expect((await pageHeaderHarness.getObjectInfos()).length).toEqual(0)

    component.objectDetails = objectDetailsWithoutIcons

    expect((await pageHeaderHarness.getObjectInfos()).length).toEqual(2)

    const firstDetail = await pageHeaderHarness.getObjectInfoByLabel('Venue')
    expect(await firstDetail?.getLabel()).toEqual('Venue')
    expect(await firstDetail?.getValue()).toEqual('AIE Munich')
    expect(await firstDetail?.getIcon()).toBeUndefined()
    const secondDetail = await pageHeaderHarness.getObjectInfoByLabel('Status')
    expect(await secondDetail?.getLabel()).toEqual('Status')
    expect(await secondDetail?.getValue()).toEqual('Confirmed')
    expect(await secondDetail?.getIcon()).toBeUndefined()
  })

  it('should render objectDetails with icons as object info in the page header', async () => {
    const objectDetailsWithIcons: ObjectDetailItem[] = [
      {
        label: 'Venue',
        value: 'AIE Munich',
      },
      {
        label: 'Status',
        value: 'Confirmed',
        icon: PrimeIcons.CHECK,
      },
      {
        label: 'Done?',
        icon: PrimeIcons.EXCLAMATION_CIRCLE,
      },
      {
        label: 'Empty',
      },
    ]
    expect((await pageHeaderHarness.getObjectInfos()).length).toEqual(0)

    component.objectDetails = objectDetailsWithIcons

    expect((await pageHeaderHarness.getObjectInfos()).length).toEqual(4)
    const firstDetail = await pageHeaderHarness.getObjectInfoByLabel('Venue')
    expect(await firstDetail?.getLabel()).toEqual('Venue')
    expect(await firstDetail?.getValue()).toEqual('AIE Munich')
    expect(await firstDetail?.getIcon()).toBeUndefined()
    const secondDetail = await pageHeaderHarness.getObjectInfoByLabel('Status')
    expect(await secondDetail?.getLabel()).toEqual('Status')
    expect(await secondDetail?.getValue()).toEqual('Confirmed')
    expect(await secondDetail?.getIcon()).toEqual(PrimeIcons.CHECK)
    const thirdDetail = await pageHeaderHarness.getObjectInfoByLabel('Done?')
    expect(await thirdDetail?.getLabel()).toEqual('Done?')
    expect(await thirdDetail?.getValue()).toEqual('')
    expect(await thirdDetail?.getIcon()).toEqual(PrimeIcons.EXCLAMATION_CIRCLE)
    const fourthDetail = await pageHeaderHarness.getObjectInfoByLabel('Empty')
    expect(await fourthDetail?.getLabel()).toEqual('Empty')
    expect(await fourthDetail?.getValue()).toBeUndefined()
    expect(await fourthDetail?.getIcon()).toBeUndefined()
  })

  it('should use styles to render objectDetails in the page header', async () => {
    const objectDetailsWithIcons: ObjectDetailItem[] = [
      {
        label: 'Venue',
        value: 'AIE Munich',
        valueCssClass: 'bg-green-400 text-white',
      },
    ]
    expect((await pageHeaderHarness.getObjectInfos()).length).toEqual(0)

    component.objectDetails = objectDetailsWithIcons

    expect((await pageHeaderHarness.getObjectInfos()).length).toEqual(1)
    const firstDetail = await pageHeaderHarness.getObjectInfoByLabel('Venue')
    const firstDetailStyles = await firstDetail?.getValueStyles()
    expect(firstDetailStyles?.includes('bg-green-400')).toBeTruthy()
    expect(firstDetailStyles?.includes('text-white')).toBeTruthy()
  })

  it('should show overflow actions when menu overflow button clicked', async () => {
    component.actions = mockActions

    fixture.detectChanges()
    await fixture.whenStable()

    const menuOverflowButton = await pageHeaderHarness.getOverflowActionMenuButton()

    expect(menuOverflowButton).toBeTruthy()
    await menuOverflowButton?.click()

    const menuItems = await pageHeaderHarness.getOverFlowMenuItems()
    expect(menuItems.length).toBe(2)
    expect(await menuItems[0].getText()).toBe('My Test Overflow Action')
    expect(await menuItems[1].getText()).toBe('My Test Overflow Disabled Action')
  })

  it('should use provided action callback on overflow button click', async () => {
    jest.spyOn(console, 'log')

    component.actions = mockActions

    fixture.detectChanges()
    await fixture.whenStable()

    const menuOverflowButton = await pageHeaderHarness.getOverflowActionMenuButton()

    expect(menuOverflowButton).toBeTruthy()
    await menuOverflowButton?.click()

    const menuItems = await pageHeaderHarness.getOverFlowMenuItems()
    expect(menuItems.length).toBe(2)
    const enabledActionElement = await menuItems[0].host()
    expect(await enabledActionElement.hasClass('p-disabled')).toBe(false)
    await enabledActionElement.click()
    expect(console.log).toHaveBeenCalledWith('My Test Overflow Action')
  })

  it('should disable overflow button when action is disabled', async () => {
    jest.spyOn(console, 'log')

    component.actions = mockActions

    fixture.detectChanges()
    await fixture.whenStable()

    const menuOverflowButton = await pageHeaderHarness.getOverflowActionMenuButton()
    expect(menuOverflowButton).toBeTruthy()
    await menuOverflowButton?.click()

    const overFlowMenuItems = await pageHeaderHarness.getOverFlowMenuItems()
    const disabledActionElement = overFlowMenuItems[1]

    expect(overFlowMenuItems).toBeTruthy()
    expect(overFlowMenuItems?.length).toBe(2)
    expect(disabledActionElement).toBeTruthy()
    expect(await (await disabledActionElement.host()).hasClass('p-disabled')).toBe(true)
    await (await disabledActionElement.host()).click()
    expect(console.log).not.toHaveBeenCalledWith('My Test Overflow Disabled Action')
  })

  it('should render labelTooltipKey, valueTooltipKey, and actionItemTooltipKey as translated tooltips when language is changed', async () => {
    const translate = TestBed.inject(TranslateService)

    translate.setTranslation(
      'en',
      {
        LABEL_TOOLTIP_KEY: 'Label Tooltip Key EN',
        VALUE_TOOLTIP_KEY: 'Value Tooltip Key EN',
        ACTION_TOOLTIP_KEY: 'Action Tooltip Key EN',
      },
      true
    )
    translate.setTranslation(
      'de',
      {
        LABEL_TOOLTIP_KEY: 'Label Tooltip Key DE',
        VALUE_TOOLTIP_KEY: 'Value Tooltip Key DE',
        ACTION_TOOLTIP_KEY: 'Action Tooltip Key DE',
      },
      true
    )
    translate.use('en')

    component.objectDetails = [
      {
        label: 'Venue',
        value: 'AIE Munich',
        labelTooltipKey: 'LABEL_TOOLTIP_KEY',
        valueTooltipKey: 'VALUE_TOOLTIP_KEY',
        actionItemTooltipKey: 'ACTION_TOOLTIP_KEY',
        actionItemIcon: 'pi pi-copy',
        actionItemCallback: () => {
          console.log('Action!')
        },
      },
    ]
    fixture.detectChanges()

    const objectInfo = (await pageHeaderHarness.getObjectInfos())[0]

    expect(await objectInfo.getLabelTooltipContent()).toBe('Label Tooltip Key EN')
    expect(await objectInfo.getValueTooltipContent()).toBe('Value Tooltip Key EN')
    expect(await objectInfo.getActionItemTooltipContent()).toBe('Action Tooltip Key EN')

    translate.use('de')
    await fixture.whenStable()
    fixture.detectChanges()

    expect(await objectInfo.getLabelTooltipContent()).toBe('Label Tooltip Key DE')
    expect(await objectInfo.getValueTooltipContent()).toBe('Value Tooltip Key DE')
    expect(await objectInfo.getActionItemTooltipContent()).toBe('Action Tooltip Key DE')
  })

  it('should fallback to empty string if *Key properties are not provided', async () => {
    component.objectDetails = [
      {
        label: 'Venue',
        value: 'AIE Munich',
        actionItemIcon: 'pi pi-copy',
        actionItemCallback: () => {
          console.log('Action!')
        },
      },
    ]
    fixture.detectChanges()

    const objectInfo = (await pageHeaderHarness.getObjectInfos())[0]

    //tooltips should not be initialise for undefined keys
    expect(await objectInfo.getLabelTooltipContent()).toBeNull();
    expect(await objectInfo.getValueTooltipContent()).toBeNull();
    expect(await objectInfo.getActionItemTooltipContent()).toBeNull();
  })
})


```

### File: angular-accelerator/src/lib/components/page-header/page-header.component.stories.ts

```ts

import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { action } from '@storybook/addon-actions'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { PrimeIcons } from 'primeng/api'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { SkeletonModule } from 'primeng/skeleton'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { StorybookBreadcrumbModule } from './../../storybook-breadcrumb.module'
import { Action, ObjectDetailItem, PageHeaderComponent } from './page-header.component'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { TooltipModule } from 'primeng/tooltip'
import { provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { UserService } from '@onecx/angular-integration-interface'

export default {
  title: 'Components/PageHeaderComponent',
  component: PageHeaderComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
        importProvidersFrom(StorybookThemeModule),
        provideUserServiceMock(),
        {
          provide: HAS_PERMISSION_CHECKER,
          useExisting: UserService,
        },
      ],
    }),
    moduleMetadata({
      declarations: [PageHeaderComponent, DynamicPipe],
      imports: [
        MenuModule,
        BreadcrumbModule,
        ButtonModule,
        SkeletonModule,
        StorybookTranslateModule,
        StorybookBreadcrumbModule.init([
          { labelKey: 'Level 1', routerLink: ['/something'] },
          { labelKey: 'Level 2', url: '/' },
        ]),
        TooltipModule,
      ],
    }),
  ],
} as Meta<PageHeaderComponent>

const Template: StoryFn<PageHeaderComponent> = (args) => ({
  props: args,
})

const demoActions: Action[] = [
  {
    label: 'Save',
    actionCallback: () => {
      console.log(`you clicked 'Save'`)
      action('actionButtonClick')({ button: 'Save' })
    },
    title: 'Tooltip for Save',
  },
  {
    label: 'Reload',
    actionCallback: () => {
      console.log(`you clicked 'Reload'`)
      action('actionButtonClick')({ button: 'Reload' })
    },
    title: 'Tooltip for Reload',
    show: 'always',
    icon: PrimeIcons.REFRESH,
  },
  {
    label: 'Delete',
    actionCallback: () => {
      console.log(`you clicked 'Delete'`)
      action('actionButtonClick')({ button: 'Delete' })
    },
    title: 'Tooltip for Delete',
    show: 'always',
    icon: PrimeIcons.TRASH,
  },
  {
    label: 'Some action that has a long text',
    actionCallback: () => {
      console.log(`you clicked 'Some action'`)
    },
    show: 'asOverflow',
    icon: PrimeIcons.ADDRESS_BOOK,
    title: 'Tooltip for some action',
  },
  {
    label: 'Other action',
    actionCallback: () => {
      console.log(`you clicked 'Other Action'`)
    },
    show: 'asOverflow',
  },
  {
    label: 'Disabled',
    actionCallback: () => {
      console.log(`you clicked 'Disabled'`)
    },
    title: 'Tooltip for Disabled',
    disabled: true,
  },
  {
    icon: PrimeIcons.BOOK,
    actionCallback: () => {
      console.log(`you clicked 'BOOK'`)
    },
    show: 'always',
    ariaLabel: 'Aria label for BOOK action',
  },
]

const demoFields: ObjectDetailItem[] = [
  {
    label: 'Venue',
    value: 'AIE Munich ',
    labelTooltipKey: 'Label Tooltip',
    actionItemIcon: PrimeIcons.COPY,
    actionItemTooltipKey: 'Copy to clipboard',
    actionItemCallback: () => {
      console.log('Copy to clipboard')
    },
  },
  {
    label: 'Status',
    value: 'Confirmed',
    icon: PrimeIcons.CHECK_CIRCLE,
  },
  {
    label: 'Start Date',
    value: '14.3.2022',
    icon: PrimeIcons.CALENDAR,
    actionItemIcon: PrimeIcons.COPY,
    actionItemCallback: () => {
      console.log('Copy to clipboard')
    },
    actionItemAriaLabel: 'Copy to clipboard',
  },
  {
    label: 'End Date',
    value: '19.06.2024',
    icon: PrimeIcons.CALENDAR,
  },
]

export const Primary = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    loading: false,
    objectDetails: demoFields,
    showBreadcrumbs: false,
  },
}

export const TitleBarOnly = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    showBreadcrumbs: false,
  },
}

export const WithCustomButtons = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    actions: demoActions,
    objectDetails: demoFields,
    disableDefaultActions: true,
    showBreadcrumbs: false,
  },
}

export const WithBreadcrumbs = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    actions: demoActions,
    objectDetails: demoFields,
    disableDefaultActions: true,
    showBreadcrumbs: true,
    manualBreadcrumbs: true,
  },
}

export const WithImageUrl = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    actions: demoActions,
    objectDetails: demoFields,
    disableDefaultActions: true,
    showBreadcrumbs: true,
    manualBreadcrumbs: true,
  },
}

export const WithImageWithoutBG = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'Figure/image is shown without colored background',
    actions: demoActions,
    objectDetails: demoFields,
    disableDefaultActions: true,
    showBreadcrumbs: true,
    figureBackground: false,
    manualBreadcrumbs: true,
  },
}

export const WithoutFigure = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'No figure/image is shown to the left',
    actions: demoActions,
    objectDetails: demoFields,
    disableDefaultActions: true,
    showBreadcrumbs: true,
    showFigure: false,
    manualBreadcrumbs: true,
  },
}

export const WithLoadingState = {
  render: Template,

  args: {
    loading: true,
    header: 'My title',
    subheader: 'My subtitle',
    actions: demoActions,
    objectDetails: demoFields,
    showBreadcrumbs: false,
  },
}

const TemplateWithProjection: StoryFn<PageHeaderComponent> = (args) => ({
  props: args,
  template: `
  <ocx-page-header [header]="header" [subheader]="subheader" [actions]="actions">
    <div>
      <span>My dynamic content</span>
      <ul>
        <li>Can be anything you want</li>
        <li>Will be rendered under title bar</li>
      </ul>
    </div>
  </ocx-page-header>`,
})

const TemplateWithFigureProjection: StoryFn<PageHeaderComponent> = (args) => ({
  props: args,
  template: `
  <ocx-page-header [header]="header" [subheader]="subheader" [actions]="actions" [figureBackground]="false">
    <div figureImage [ngStyle]="{backgroundColor:'var(--p-orange-500)'}" class="text-white w-full h-full">
      <div><i class="pi pi-user"></i></div>
    </div>
    <div>
      The figure is an html with the following content:
      <textarea readonly class="block w-full"><div [ngStyle]="{backgroundColor:'var(--p-orange-500)'}" class="text-white"><i class="pi pi-user"></i></div></textarea>
    </div>
  </ocx-page-header>`,
})

export const WithCustomFigureContent = {
  render: TemplateWithFigureProjection,

  args: {
    header: 'My header title',
    subheader: 'Figure to the left is completely controlled by the host',
    actions: demoActions,
    figureBackground: false,
    objectDetails: demoFields,
  },
}

export const WithCustomContent = {
  render: TemplateWithProjection,

  args: {
    header: 'My header title',
    subheader: 'My subtitle',
    actions: demoActions,
    objectDetails: demoFields,
  },
}

const objectDetailsWithoutIcons: ObjectDetailItem[] = [
  {
    label: 'Venue',
    value: 'AIE Munich ',
  },
  {
    label: 'Status',
    value: 'Confirmed',
  },
  {
    label: 'Start Date',
    value: '14.3.2022',
  },
]

export const WithObjectDetails = {
  render: Template,

  args: {
    header: 'Test Page',
    subheader: 'Page header with text based objectDetails and no icons',
    loading: false,
    objectDetails: objectDetailsWithoutIcons,
    showBreadcrumbs: false,
  },
}

const objectDetailsWithIcons: ObjectDetailItem[] = [
  {
    label: 'Venue',
    value: 'AIE Munich ',
  },
  {
    label: 'Event Completed',
    icon: PrimeIcons.CHECK_CIRCLE,
  },
  {
    label: 'Start Date',
    value: '14.3.2022',
    icon: PrimeIcons.CLOCK,
  },
  {
    label: 'I have no value',
  },
  {
    label: 'Status with style',
    value: 'Completed',
    icon: PrimeIcons.CHECK_SQUARE,
    valueCssClass: 'bg-green-400 text-white border-round-sm p-1',
  },
]

export const WithObjectDetailsAndIcons = {
  render: Template,

  args: {
    header: 'Test Page',
    subheader: 'Page header with text and icon based objectDetails',
    loading: false,
    objectDetails: objectDetailsWithIcons,
    showBreadcrumbs: false,
  },
}

export const WithObjectDetailsAndStyledIcons = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    loading: false,
    objectDetails: [
      ...demoFields,
      {
        label: 'Styled Icon',
        value: 'Confirmed',
        icon: PrimeIcons.CHECK_CIRCLE,
        iconStyleClass: 'text-red-400 fadein animation-duration-1000 animation-iteration-infinite',
      },
    ],
    showBreadcrumbs: false,
  },
}

export const DefaultLayout = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    loading: false,
    objectDetails: demoFields,
    showBreadcrumbs: false,
  },
}

export const ForcedColumnLayout = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    loading: false,
    objectDetails: demoFields,
    showBreadcrumbs: false,
    enableGridView: false,
  },
}

export const ForcedGridLayout = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    loading: false,
    objectDetails: demoFields,
    showBreadcrumbs: false,
    enableGridView: true,
  },
}

export const ForcedGridLayoutWithColumnAmount = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    loading: false,
    objectDetails: demoFields,
    showBreadcrumbs: false,
    enableGridView: true,
    gridLayoutDesktopColumns: 4,
  },
}

const demoFieldsWithTranslationKeys: ObjectDetailItem[] = [
  {
    label: 'Venue',
    value: 'AIE Munich 11',
    valueTooltipKey: 'pageheader.valueTooltip',
    labelTooltipKey: 'pageheader.labelTooltip',
    actionItemTooltipKey: 'pageheader.actionItemTooltip',
    actionItemAriaLabelKey: 'pageheader.actionItemAriaLabel',
    actionItemIcon: PrimeIcons.COPY,
    actionItemCallback: () => {
      console.log('Copy to clipboard')
    },
  },
  {
    label: 'Start Date',
    value: '14.3.2022',
    icon: PrimeIcons.CALENDAR,
    labelTooltipKey: 'Simple string tooltip for label',
    valueTooltipKey: 'Simple string tooltip for value',
  },
  {
    label: 'End Date',
    value: '19.06.2024',
    icon: PrimeIcons.CALENDAR,
    actionItemIcon: PrimeIcons.COPY,
    actionItemTooltipKey: 'Simple string tooltip for action',
    actionItemAriaLabel: 'Simple string aria label for action',
    actionItemCallback: () => {
      console.log('Copy to clipboard')
    },
  },
  {
    label: 'Status',
    value: 'Confirmed',
    icon: PrimeIcons.CHECK_CIRCLE,
    labelTooltipKey: { key: 'pageheader.statusLabelTooltip', parameters: { status: 'confirmed' } },
    valueTooltipKey: { key: 'pageheader.statusValueTooltip', parameters: { value: 'Confirmed' } },
  },
  {
    label: 'Fallback Test',
    value: 'No tooltips provided',
    icon: PrimeIcons.INFO_CIRCLE,
    actionItemIcon: PrimeIcons.COPY,
    actionItemCallback: () => {
      console.log('Copy to clipboard')
    },
  },
]

export const TranslationKeysAndParams = {
  render: Template,
  args: {
    header: 'My title',
    subheader: 'My subtitle',
    loading: false,
    actions: demoActions,
    objectDetails: demoFieldsWithTranslationKeys,
    showBreadcrumbs: false,
  }
}

```

### File: angular-accelerator/src/lib/components/page-header/page-header.component.ts

```ts

import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  Type,
  ViewEncapsulation,
  inject,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { AppStateService, UserService } from '@onecx/angular-integration-interface'
import { MenuItem, PrimeIcons } from 'primeng/api'
import { BehaviorSubject, Observable, concat, map, of, switchMap } from 'rxjs'
import { BreadcrumbService } from '../../services/breadcrumb.service'
import { PrimeIcon } from '../../utils/primeicon.utils'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { TranslationKey } from '../../model/translation.model'

/**
 * Action definition.
 */
export interface Action {
  id?: string
  label?: string
  labelKey?: string
  icon?: string
  iconPos?: 'left' | 'right' | 'top' | 'bottom'
  /**
   * Permission for this action. If the current user does not have this permission, the action will not be shown.
   */
  permission?: string
  title?: string
  titleKey?: string
  ariaLabel?: string
  ariaLabelKey?: string
  btnClass?: string
  actionCallback(): void
  disabled?: boolean
  disabledTooltip?: string
  disabledTooltipKey?: string
  show?: 'always' | 'asOverflow'
  conditional?: boolean
  // Note: This currently doesn't work with dynamic values, since a passed in Action is just a copy of the original object.
  // As a workaround, you can manually update/replace the passed in Action if you wish to update a showCondition
  showCondition?: boolean
}

export interface ObjectDetailItem {
  label: string
  value?: string
  icon?: PrimeIcon
  iconStyleClass?: string
  labelPipe?: Type<any>
  valuePipe?: Type<any>
  valuePipeArgs?: string
  valueCssClass?: string
  actionItemIcon?: PrimeIcon
  actionItemCallback?: () => void
  actionItemAriaLabel?: string
  actionItemAriaLabelKey?: TranslationKey
  actionItemTooltipKey?: TranslationKey
  labelTooltipKey?: TranslationKey
  valueTooltipKey?: TranslationKey
}

export interface HomeItem {
  menuItem: MenuItem
  page?: string
}

export type GridColumnOptions = 1 | 2 | 3 | 4 | 6 | 12

@Component({
  standalone: false,
  selector: 'ocx-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PageHeaderComponent implements OnInit {
  private translateService = inject(TranslateService)
  private appStateService = inject(AppStateService)
  private userService = inject(UserService)
  private readonly hasPermissionChecker = inject(HAS_PERMISSION_CHECKER, { optional: true })

  @Input()
  public header: string | undefined

  @Input()
  loading = false

  @Input()
  figureBackground = true

  @Input()
  showFigure = true

  //image fot preview in top-header left side
  @Input()
  figureImage: string | undefined

  @Input()
  disableDefaultActions = false

  @Input()
  subheader: string | undefined

  _actions = new BehaviorSubject<Action[]>([])
  @Input()
  get actions() {
    return this._actions.getValue()
  }
  set actions(value) {
    this._actions.next(value)
  }

  @Input()
  objectDetails: ObjectDetailItem[] | undefined

  @Input()
  showBreadcrumbs = true

  @Input()
  manualBreadcrumbs = false

  @Input()
  enableGridView: undefined | boolean

  @Input()
  gridLayoutDesktopColumns: undefined | GridColumnOptions

  @Output()
  save = new EventEmitter()

  @ContentChild('additionalToolbarContent')
  additionalToolbarContent: TemplateRef<any> | undefined

  @ContentChild('additionalToolbarContentLeft')
  additionalToolbarContentLeft: TemplateRef<any> | undefined

  overflowActions$ = new BehaviorSubject<MenuItem[]>([])
  inlineActions$ = new BehaviorSubject<Action[]>([])
  dd = new Date()
  breadcrumbs$!: Observable<MenuItem[]>

  home$!: Observable<HomeItem>

  figureImageLoadError = false

  objectPanelGridLayoutClasses = 'grid row-gap-2 m-0'
  objectPanelColumnLayoutClasses = 'flex flex-row justify-content-between overflow-x-auto'

  objectPanelDefaultLayoutClasses = 'flex flex-column row-gap-2 md:flex-row md:justify-content-between'

  objectInfoGridLayoutClasses = 'col-12 flex gap-4 md:col-6 align-items-center p-0'
  objectInfoColumnLayoutClasses = 'flex flex-column align-items-center gap-2 min-w-120'

  objectInfoDefaultLayoutClasses = 'flex flex-row md:flex-column md:align-items-center md:gap-2'

  protected breadcrumbs: BreadcrumbService

  constructor() {
    const breadcrumbs = inject(BreadcrumbService)

    this.breadcrumbs = breadcrumbs
    this.home$ = concat(
      of({ menuItem: { icon: PrimeIcons.HOME, routerLink: '/' } }),
      this.appStateService.currentWorkspace$.pipe(
        map((workspace) => ({
          menuItem: {
            icon: PrimeIcons.HOME,
            routerLink: workspace.baseUrl,
          },
          page: workspace.workspaceName,
        }))
      )
    )
    this._actions
      .pipe(
        map(this.filterInlineActions),
        switchMap((actions) => this.filterActionsBasedOnPermissions(actions))
      )
      .subscribe(this.inlineActions$)

    this._actions
      .pipe(
        map(this.filterOverflowActions),
        switchMap((actions) => {
          return this.getActionTranslationKeys(actions).pipe(map((translations) => ({ actions, translations })))
        }),
        switchMap(({ actions, translations }) => {
          return this.filterActionsBasedOnPermissions(actions).pipe(
            map((filteredActions) => ({ filteredActions, translations }))
          )
        }),
        map(({ filteredActions, translations }) => this.mapOverflowActionsToMenuItems(filteredActions, translations))
      )
      .subscribe(this.overflowActions$)
  }

  ngOnInit(): void {
    if (!this.manualBreadcrumbs) {
      this.breadcrumbs$ = this.breadcrumbs.generatedItemsSource
    } else {
      this.breadcrumbs$ = this.breadcrumbs.itemsHandler
    }
  }

  onAction(action: string) {
    switch (action) {
      case 'save':
        this.save.emit()
        break
      default:
        break
    }
  }

  handleImageError() {
    this.figureImageLoadError = true
  }

  public generateItemStyle(item: ObjectDetailItem): string {
    let style = ''
    if (item.icon) style = style.concat(style, ' ', 'gap-1 align-items-center')
    if (item.valueCssClass) style = style.concat(style, ' ', item.valueCssClass)
    return style
  }

  public getObjectPanelLayoutClasses() {
    if (this.enableGridView) {
      return this.objectPanelGridLayoutClasses
    }
    if (this.enableGridView === false) {
      return this.objectPanelColumnLayoutClasses
    }
    return this.objectPanelDefaultLayoutClasses
  }

  public getObjectInfoLayoutClasses() {
    if (this.enableGridView) {
      return `${this.objectInfoGridLayoutClasses} lg:col-${
        this.gridLayoutDesktopColumns ? 12 / this.gridLayoutDesktopColumns : 4
      }`
    }
    if (this.enableGridView === false) {
      return this.objectInfoColumnLayoutClasses
    }
    return this.objectInfoDefaultLayoutClasses
  }

  private filterInlineActions(actions: Action[]): Action[] {
    return actions
      .filter((a) => a.show === 'always')
      .filter((a) => {
        if (a.conditional) {
          return a.showCondition
        }
        return true
      })
  }

  private filterOverflowActions(actions: Action[]): Action[] {
    return actions
      .filter((a) => a.show === 'asOverflow')
      .filter((a) => {
        if (a.conditional) {
          return a.showCondition
        }
        return true
      })
  }

  private filterActionsBasedOnPermissions(actions: Action[]): Observable<Action[]> {
    const getPermissions =
      this.hasPermissionChecker?.getPermissions?.bind(this.hasPermissionChecker) ||
      this.userService.getPermissions.bind(this.userService)
    return getPermissions().pipe(
      map((permissions) => {
        return actions.filter((action) => {
          if (action.permission) {
            return permissions.includes(action.permission!)
          }
          return true
        })
      })
    )
  }

  private getActionTranslationKeys(actions: Action[]): Observable<{ [key: string]: string }> {
    const translationKeys = [
      ...actions.map((a) => a.labelKey || '').filter((a) => !!a),
      ...actions.map((a) => a.titleKey || '').filter((a) => !!a),
    ]
    return translationKeys.length ? this.translateService.get(translationKeys) : of({})
  }

  private mapOverflowActionsToMenuItems(actions: Action[], translations: { [key: string]: string }): MenuItem[] {
    return actions.map<MenuItem>((a) => ({
      id: a.id,
      label: a.labelKey ? translations[a.labelKey] : a.label,
      icon: a.icon,
      tooltipOptions: {
        tooltipLabel: a.titleKey ? translations[a.titleKey] : a.title,
        tooltipEvent: 'hover',
        tooltipPosition: 'top',
      },
      command: a.actionCallback,
      disabled: a.disabled,
    }))
  }
}


```

## Folder: angular-accelerator/src/lib/components/search-header (4 files)

### File: angular-accelerator/src/lib/components/search-header/search-header.component.html

```html

<ng-template #searchBtn>
  <p-button
    id="searchButton"
    icon="pi pi-search"
    (onClick)="onSearchClicked()"
    [disabled]="searchButtonDisabled || formGroup?.invalid"
    [label]="'OCX_SEARCH_HEADER.SEARCH_BUTTON.TEXT' | translate"
    [ariaLabel]="'OCX_SEARCH_HEADER.SEARCH_BUTTON.ARIA_LABEL' | translate"
    [pTooltip]="'OCX_SEARCH_HEADER.SEARCH_BUTTON.DETAIL' | translate"
    tooltipPosition="top"
    tooltipEvent="hover"
  ></p-button>
</ng-template>
<ng-template #resetBtn>
  <p-button
    id="resetButton"
    icon="pi pi-eraser"
    (onClick)="onResetClicked()"
    [disabled]="resetButtonDisabled"
    [label]="'OCX_SEARCH_HEADER.RESET_BUTTON.TEXT' | translate"
    [ariaLabel]="'OCX_SEARCH_HEADER.RESET_BUTTON.ARIA_LABEL' | translate"
    [pTooltip]="'OCX_SEARCH_HEADER.RESET_BUTTON.DETAIL' | translate"
    tooltipPosition="top"
    tooltipEvent="hover"
  ></p-button>
</ng-template>

<ocx-page-header
  [header]="header || ('OCX_SEARCH_HEADER.HEADER' | translate)"
  [subheader]="subheader"
  [manualBreadcrumbs]="manualBreadcrumbs"
  [actions]="headerActions"
>
  <ng-template #additionalToolbarContentLeft>
    @if (searchConfigChangeObserved && pageName) {
    <ocx-slot
      *ocxIfPermission="searchConfigPermission"
      name="onecx-search-config"
      [inputs]="{ pageName: pageName, currentFieldValues: fieldValues$ | async, viewMode: viewMode }"
      [outputs]="{ searchConfigSelected: searchConfigChangedSlotEmitter }"
    >
      <ng-template #skeleton>
        <div class="flex">
          <p-skeleton width="18rem" height="3rem"></p-skeleton>
        </div>
      </ng-template>
    </ocx-slot>
    } @if (_additionalToolbarContentLeft) {
    <ng-container [ngTemplateOutlet]="_additionalToolbarContentLeft"></ng-container>
    }
  </ng-template>
  <ng-template #additionalToolbarContent>
    @if (_additionalToolbarContent) {
    <ng-container [ngTemplateOutlet]="_additionalToolbarContent"></ng-container>
    }
  </ng-template>
  <div class="flex row-gap-3 column-gap-6 flex-wrap align-items-center">
    <section #searchParameterFields [attr.aria-label]="'Search Criteria'">
      <ng-content></ng-content>
    </section> 
    <section
      class="flex flex-wrap gap-2"
      [ngClass]="'flex-row'"
      [attr.aria-label]="'Search Controls'"
    >
      <ng-container *ngIf="(searchButtonsReversed$ | async); else normalOrder">
        <ng-container [ngTemplateOutlet]="searchBtn"></ng-container>
        <ng-container *ngIf="resetted.observed" [ngTemplateOutlet]="resetBtn"></ng-container>
      </ng-container>

      <ng-template #normalOrder>
        <ng-container *ngIf="resetted.observed" [ngTemplateOutlet]="resetBtn"></ng-container>
        <ng-container [ngTemplateOutlet]="searchBtn"></ng-container>
      </ng-template>
    </section>
  </div>
</ocx-page-header>


```

### File: angular-accelerator/src/lib/components/search-header/search-header.component.spec.ts

```ts

import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { SlotHarness } from '@onecx/angular-accelerator/testing'
import { AppStateService } from '@onecx/angular-integration-interface'
import {
  AppStateServiceMock,
  provideAppStateServiceMock,
  provideUserServiceMock,
  UserServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { PageHeaderComponent } from '../page-header/page-header.component'
import { SearchHeaderComponent } from './search-header.component'

describe('SearchHeaderComponent', () => {
  let mockAppStateService: AppStateServiceMock
  let component: SearchHeaderComponent
  let fixture: ComponentFixture<SearchHeaderComponent>
  let loader: HarnessLoader

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchHeaderComponent, PageHeaderComponent, IfPermissionDirective],
      imports: [
        TranslateTestingModule.withTranslations({}),
        RouterTestingModule,
        ButtonModule,
        BreadcrumbModule,
        AngularAcceleratorModule,
      ],
      providers: [
        AppStateService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideAppStateServiceMock(),
        provideUserServiceMock(),
      ],
    }).compileComponents()

    mockAppStateService = TestBed.inject(AppStateServiceMock)
    mockAppStateService.currentWorkspace$.publish({
      id: 'i-am-test-portal',
      portalName: 'test',
      workspaceName: 'test',
      baseUrl: '',
      microfrontendRegistrations: [],
    })

    fixture = TestBed.createComponent(SearchHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    loader = TestbedHarnessEnvironment.loader(fixture)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should not display search config slot if search config change is not observed', async () => {
    const slot = await loader.getHarnessOrNull(SlotHarness)
    expect(slot).toBeFalsy()
  })

  it('should display search config slot if search config change is observed, pageName is defined and permission is met', async () => {
    const userServiceMock = TestBed.inject(UserServiceMock)
    userServiceMock.permissionsTopic$.publish(['PRODUCT#USE_SEARCHCONFIGS'])
    const sub = component.selectedSearchConfigChanged.subscribe()
    component.pageName = 'myPageName'
    component.searchConfigPermission = 'PRODUCT#USE_SEARCHCONFIGS'

    fixture.detectChanges()
    await fixture.whenStable()

    const slot = await loader.getHarness(SlotHarness)
    expect(slot).toBeTruthy()

    sub.unsubscribe()
  })
})


```

### File: angular-accelerator/src/lib/components/search-header/search-header.component.ts

```ts

import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core'
import { FormControlName, FormGroup, FormGroupDirective } from '@angular/forms'
import { Observable, combineLatest, debounceTime, from, map, of, startWith } from 'rxjs'
import { getLocation } from '@onecx/accelerator'
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { Action } from '../page-header/page-header.component'

export interface SearchHeaderComponentState {
  activeViewMode?: 'basic' | 'advanced'
  selectedSearchConfig?: string | null
}

export interface SearchConfigData {
  name: string | undefined
  fieldValues: { [key: string]: string }
  displayedColumnsIds: string[]
  viewMode: 'basic' | 'advanced'
}

/**
 * To trigger the search when Enter key is pressed inside a search parameter field,
 * an EventListener for keyup enter event is added for HTML elements which have an input.
 * Please add the EventListener yourself manually, if you want to have that functionality for some other elements
 * which do not have an input element.
 */
@Component({
  standalone: false,
  selector: 'ocx-search-header',
  templateUrl: './search-header.component.html',
  providers: [],
})
export class SearchHeaderComponent implements AfterContentInit, AfterViewInit {
  @Input() header = ''
  @Input() subheader: string | undefined
  _viewMode: 'basic' | 'advanced' = 'basic'
  @Input()
  get viewMode(): 'basic' | 'advanced' {
    return this._viewMode
  }
  set viewMode(viewMode: 'basic' | 'advanced') {
    if (this.viewMode !== viewMode) {
      this._viewMode = viewMode
      this.viewModeChanged?.emit(this.viewMode)
      this.componentStateChanged.emit({
        activeViewMode: this.viewMode,
      })
      this.updateHeaderActions()
      setTimeout(() => this.addKeyUpEventListener())
    }
  }
  @Input() manualBreadcrumbs = false
  _actions: Action[] = []
  @Input()
  get actions() {
    return this._actions
  }
  set actions(value) {
    this._actions = value
    this.updateHeaderActions()
  }
  @Input() searchConfigPermission: string | string[] | undefined
  @Input() searchButtonDisabled = false
  @Input() resetButtonDisabled = false
  @Input() pageName: string | undefined = getLocation().applicationPath

  @Output() searched: EventEmitter<any> = new EventEmitter()
  @Output() resetted: EventEmitter<any> = new EventEmitter()
  @Output() selectedSearchConfigChanged: EventEmitter<SearchConfigData | undefined> = new EventEmitter()
  @Output() viewModeChanged: EventEmitter<'basic' | 'advanced'> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<SearchHeaderComponentState> = new EventEmitter()
  @ContentChild('additionalToolbarContent')
  additionalToolbarContent: TemplateRef<any> | undefined

  get _additionalToolbarContent(): TemplateRef<any> | undefined {
    return this.additionalToolbarContent
  }
  @ContentChild('additionalToolbarContentLeft')
  additionalToolbarContentLeft: TemplateRef<any> | undefined

  get _additionalToolbarContentLeft(): TemplateRef<any> | undefined {
    return this.additionalToolbarContentLeft
  }

  get searchConfigChangeObserved(): boolean {
    return this.selectedSearchConfigChanged.observed
  }

  @ContentChild(FormGroupDirective) formGroup: FormGroup | undefined
  @ContentChildren(FormControlName, { descendants: true }) visibleFormControls!: QueryList<FormControlName>

  @ViewChild('searchParameterFields') searchParameterFields: ElementRef | undefined

  hasAdvanced = false

  simpleAdvancedAction: Action = {
    id: 'simpleAdvancedButton',
    actionCallback: () => this.toggleViewMode(),
    show: 'always',
  }
  headerActions: Action[] = []
  searchButtonsReversed$ = of(false)
  fieldValues$: Observable<{ [key: string]: unknown }> | undefined = of({})
  searchConfigChangedSlotEmitter: EventEmitter<SearchConfigData | undefined> = new EventEmitter()

  constructor() {
    const configurationService = inject(ConfigurationService)

    this.searchConfigChangedSlotEmitter.subscribe((config) => {
      this.componentStateChanged.emit({
        selectedSearchConfig: config?.name ?? null,
      })
      this.selectedSearchConfigChanged.emit(config)
    })
    this.searchButtonsReversed$ = from(
      configurationService.getProperty(CONFIG_KEY.ONECX_PORTAL_SEARCH_BUTTONS_REVERSED)
    ).pipe(map((config) => config === 'true'))
  }

  ngAfterContentInit(): void {
    if (this.formGroup) {
      this.fieldValues$ = combineLatest([
        this.formGroup.valueChanges.pipe(startWith({})),
        this.visibleFormControls.changes.pipe(startWith(null)),
      ]).pipe(
        debounceTime(100),
        map(([values, _]) =>
          Object.entries(values ?? {}).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: this.isVisible(key) ? value || undefined : undefined,
            }),
            {}
          )
        )
      )
    }
  }

  ngAfterViewInit(): void {
    this.addKeyUpEventListener()
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'basic' ? 'advanced' : 'basic'
  }

  onResetClicked() {
    this.resetted.emit()
  }

  onSearchClicked() {
    this.searched.emit()
  }

  updateHeaderActions() {
    const headerActions: Action[] = []
    if (this.hasAdvanced) {
      ;(this.simpleAdvancedAction.labelKey =
        this.viewMode === 'basic'
          ? 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.ADVANCED.TEXT'
          : 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.SIMPLE.TEXT'),
        (this.simpleAdvancedAction.titleKey =
          this.viewMode === 'basic'
            ? 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.ADVANCED.DETAIL'
            : 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.SIMPLE.DETAIL'),
        headerActions.push(this.simpleAdvancedAction)
    }
    this.headerActions = headerActions.concat(this.actions)
  }

  addKeyUpEventListener() {
    const inputElements = this.searchParameterFields?.nativeElement.querySelectorAll('input')
    inputElements.forEach((inputElement: any) => {
      if (!inputElement.listenerAdded) {
        inputElement.addEventListener('keyup', (event: any) => this.onSearchKeyup(event))
        inputElement.listenerAdded = true
      }
    })
  }

  onSearchKeyup(event: any) {
    if (event.code === 'Enter') {
      this.onSearchClicked()
    }
  }

  private isVisible(control: string) {
    return this.visibleFormControls.some(
      (formControl) => formControl.name !== null && String(formControl.name) === control
    )
  }
}


```

### File: angular-accelerator/src/lib/components/search-header/search-header.stories.ts

```ts

import { importProvidersFrom } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { SelectModule } from 'primeng/select'
import { InputTextModule } from 'primeng/inputtext'
import { MenuModule } from 'primeng/menu'
import { SkeletonModule } from 'primeng/skeleton'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { PageHeaderComponent } from '../page-header/page-header.component'
import { StorybookBreadcrumbModule } from './../../storybook-breadcrumb.module'
import { SearchHeaderComponent } from './search-header.component'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { provideHttpClient } from '@angular/common/http'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { TooltipModule } from 'primeng/tooltip'
import { FloatLabelModule } from 'primeng/floatlabel'

export default {
  title: 'Components/SearchHeaderComponent',
  component: SearchHeaderComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
        importProvidersFrom(ConfigurationService),
        provideHttpClient(),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [SearchHeaderComponent, DynamicPipe, PageHeaderComponent],
      imports: [
        MenuModule,
        InputTextModule,
        BreadcrumbModule,
        ButtonModule,
        SelectModule,
        ReactiveFormsModule,
        SkeletonModule,
        StorybookTranslateModule,
        StorybookBreadcrumbModule.init([
          { labelKey: 'Level 1', routerLink: ['/something'] },
          { labelKey: 'Level 2', url: '/' },
        ]),
        TooltipModule,
        FloatLabelModule,
      ],
    }),
  ],
} as Meta<SearchHeaderComponent>

const Template: StoryFn<SearchHeaderComponent> = (args) => ({
  props: args,
})

export const Basic = {
  render: Template,

  args: {
    header: 'My title',
  },
}

const BasicSearchHeader: StoryFn<SearchHeaderComponent> = (args) => ({
  props: args,
  template: `
    <ocx-search-header [header]="header" (resetted)="resetted">
        <form>
          <div class="flex flex-wrap gap-3">
            <p-floatlabel variant="on">
                <input
                    id="name"
                    pInputText
                    type="text"
                    class="w-18rem"
                    [pTooltip]="'Name'"
                    tooltipPosition="top"
                    tooltipEvent="hover"
                />
                <label for="name" style="white-space: nowrap">
                    Name
                </label>
            </p-floatlabel>
            <p-floatlabel variant="on">
                <input
                    id="name"
                    pInputText
                    type="text"
                    class="w-18rem"
                    [pTooltip]="'Name'"
                    tooltipPosition="top"
                    tooltipEvent="hover"
                />
                <label for="name" style="white-space: nowrap">
                    Name
                </label>
            </p-floatlabel>
            <p-floatlabel variant="on">
                <input
                    id="name"
                    pInputText
                    type="text"
                    class="w-18rem"
                    [pTooltip]="'Name'"
                    tooltipPosition="top"
                    tooltipEvent="hover"
                />
                <label for="name" style="white-space: nowrap">
                    Name
                </label>
            </p-floatlabel>
          </div>
        </form>
    </ocx-search-header>
    `,
})

export const WithCustomTemplates = {
  render: BasicSearchHeader,
  argTypes: {
    resetted: { action: 'resetted' },
  },
  args: {
    header: 'My title',
  },
}


```

## Folder: angular-accelerator/src/lib/directives (12 files)

### File: angular-accelerator/src/lib/directives/advanced.directive.ts

```ts

import { Directive, DoCheck, TemplateRef, ViewContainerRef, inject } from '@angular/core'
import { SearchHeaderComponent } from '../components/search-header/search-header.component'

@Directive({ selector: '[ocxAdvanced]', standalone: false })
export class AdvancedDirective implements DoCheck {
  private viewContainer = inject(ViewContainerRef)
  private templateRef = inject<TemplateRef<any>>(TemplateRef, { optional: true })
  private searchHeader = inject(SearchHeaderComponent, { optional: true })

  constructor() {
    const searchHeader = this.searchHeader

    if (!searchHeader) {
      throw 'Advanced directive can only be used inside search header component'
    }
    searchHeader.hasAdvanced = true
  }
  ngDoCheck(): void {
    if (this.searchHeader?.viewMode === 'advanced') {
      if (this.templateRef && !this.viewContainer.length) {
        this.viewContainer.createEmbeddedView(this.templateRef)
      }
    } else {
      this.viewContainer.clear()
    }
  }
}


```

### File: angular-accelerator/src/lib/directives/basic.directive.ts

```ts

import { Directive, DoCheck, TemplateRef, ViewContainerRef, inject } from '@angular/core'
import { SearchHeaderComponent } from '../components/search-header/search-header.component'

@Directive({ selector: '[ocxBasic]', standalone: false })
export class BasicDirective implements DoCheck {
  private viewContainer = inject(ViewContainerRef)
  private templateRef = inject<TemplateRef<any>>(TemplateRef, { optional: true })
  private searchHeader = inject(SearchHeaderComponent, { optional: true })

  constructor() {
    const searchHeader = this.searchHeader

    if (!searchHeader) {
      throw 'Basic directive can only be used inside search header component'
    }
  }
  ngDoCheck(): void {
    if (this.searchHeader?.viewMode === 'basic') {
      if (this.templateRef && !this.viewContainer.length) {
        this.viewContainer.createEmbeddedView(this.templateRef)
      }
    } else {
      this.viewContainer.clear()
    }
  }
}


```

### File: angular-accelerator/src/lib/directives/content.directive.ts

```ts

import { Directive, ElementRef, Input, OnChanges, OnInit, inject } from '@angular/core'

@Directive({ selector: '[ocxContent]', standalone: false })
export class OcxContentDirective implements OnInit, OnChanges {
  private el = inject(ElementRef)

  /**
   * Used for passing a title text which should be rendered in the upper left corner of the content area.
   * @example [ocxContent]="My Cool Title"
   */
  @Input() ocxContent = ''

  private baseId = 'ocx_content_title_element'
  private titleElementId: string | undefined

  ngOnInit() {
    this.titleElementId = this.getUniqueTitleID(this.baseId)
    this.init()
  }

  ngOnChanges() {
    this.init()
  }

  private init() {
    this.addContentStyles()
    if (this.ocxContent) {
      this.prependTitle()
    } else {
      this.removeTitle()
    }
  }

  private addContentStyles() {
    const addClasses = (classes: string[]) => this.el.nativeElement.classList.add(...classes)
    addClasses(['card'])
  }

  private prependTitle() {
    if (this.titleElementId) {
      const titleElement = this.el.nativeElement.querySelector(`#${this.titleElementId}`)
      if (titleElement) {
        titleElement.textContent = this.ocxContent
      } else {
        const title = document.createElement('p')
        title.classList.add('font-medium')
        title.classList.add('text-lg')
        title.id = this.titleElementId
        title.textContent = this.ocxContent
        this.el.nativeElement.prepend(title)
      }
    }
  }

  private getUniqueTitleID(baseId: string) {
    let counter = 0
    let generatedID = baseId

    while (document.getElementById(generatedID)) {
      generatedID = baseId + counter
      counter++
    }

    return generatedID
  }

  private removeTitle() {
    if (this.titleElementId) {
      const titleElement = this.el.nativeElement.querySelector(`#${this.titleElementId}`)
      if (titleElement) {
        titleElement.remove()
      }
    }
  }
}


```

### File: angular-accelerator/src/lib/directives/content-container.directive.ts

```ts

import { Directive, ElementRef, Input, OnChanges, OnInit, inject } from '@angular/core'

@Directive({ selector: '[ocxContentContainer]', standalone: false })
export class OcxContentContainerDirective implements OnInit, OnChanges {
  private el = inject(ElementRef)

  /**
   * Used for passing the direction, in which the content inside the container should be rendered.
   * Default: horizontal
   * @example [ocxContentContainer]="horizontal"
   * @example [ocxContentContainer]="vertical"
   */
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal'

  /**
   * Used for passing in the breakpoint below which a horizontal layout should switch to a vertical layout.
   * Only necessary if horizontal layout is used
   * Default: md
   */
  @Input() breakpoint: 'sm' | 'md' | 'lg' | 'xl' = 'md'

  ngOnInit() {
    this.el.nativeElement.classList.add('flex', 'gap-3', 'flex-column', 'md:flex-row')
    this.addContainerStyles()
  }

  ngOnChanges() {
    this.addContainerStyles()
  }

  private addContainerStyles() {
    const addClasses = (classes: string[]) => this.el.nativeElement.classList.add(...classes)
    const removeClasses = (classes: string[]) => this.el.nativeElement.classList.remove(...classes)
    // We need to ensure that all breakpoint dependent flex-row classes are removed from the element
    // This way we can avoid multiple contradictory layout classes and unexpected effects
    const removeResponsiveLayoutClasses = () => {
      const classesToRemove: string[] = []
      const regexPattern = /\w+:flex-row$/
      this.el.nativeElement.classList.forEach((className: string) => {
        if (regexPattern.test(className)) {
          classesToRemove.push(className)
        }
      })
      removeClasses(classesToRemove)
    }
    const addSharedClasses = () => {
      let styleClasses = Array.from(this.el.nativeElement.classList as string[])
      const defaultClasses = ['gap-3', 'flex-column', 'md:flex-row']
      removeClasses(defaultClasses)
      if (styleClasses.some((cls) => cls.startsWith('gap-') && cls !== 'gap-3')) {
        styleClasses = styleClasses.filter((cls) => !cls.startsWith('gap-3'))
      }
      const flexClasses = ['flex-row', 'flex-row-reverse', 'flex-column-reverse']
      if (styleClasses.some((cls) => flexClasses.includes(cls))) {
        styleClasses = styleClasses.filter((cls) => cls !== 'flex-column')
      }
      if (this.layout != 'vertical') {
        const responsiveLayoutClass = `${this.breakpoint || 'md'}:flex-row`
        styleClasses.push(responsiveLayoutClass)
      }
      addClasses(styleClasses)
    }

    removeResponsiveLayoutClasses()
    addSharedClasses()
  }
}

```

### File: angular-accelerator/src/lib/directives/if-breakpoint.directive.ts

```ts

import { Directive, HostListener, Input, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core'

@Directive({ selector: '[ocxIfBreakpoint]', standalone: false })
export class IfBreakpointDirective implements OnInit {
  private viewContainer = inject(ViewContainerRef)
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef, { optional: true })

  @Input('ocxIfBreakpoint') breakpoint: 'mobile' | 'desktop' | undefined

  @Input()
  ocxIfBreakpointElseTemplate: TemplateRef<any> | undefined

  state: 'mobile' | 'desktop' | undefined

  ngOnInit() {
    this.onResize()
  }

  @HostListener('window:resize')
  onResize() {
    const mobileBreakpointVar = getComputedStyle(document.documentElement).getPropertyValue('--mobile-break-point')
    const isMobile = window.matchMedia(`(max-width: ${mobileBreakpointVar})`).matches
    const isDesktop = !isMobile
    const newState = isMobile ? 'mobile' : 'desktop'
    if ((this.breakpoint === 'mobile' && isMobile) || (this.breakpoint === 'desktop' && isDesktop)) {
      if (this.templateRef && newState !== this.state) {
        this.viewContainer.clear()
        this.viewContainer.createEmbeddedView(this.templateRef)
      }
    } else {
      if (this.ocxIfBreakpointElseTemplate && newState !== this.state) {
        this.viewContainer.clear()
        this.viewContainer.createEmbeddedView(this.ocxIfBreakpointElseTemplate)
      }
    }
    this.state = newState
  }
}


```

### File: angular-accelerator/src/lib/directives/if-permission.directive.spec.ts

```ts

import { Component, TemplateRef, ViewContainerRef } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Renderer2 } from '@angular/core'
import { IfPermissionDirective } from './if-permission.directive'
import { HAS_PERMISSION_CHECKER, HasPermissionChecker } from '@onecx/angular-utils'
import { BehaviorSubject, of } from 'rxjs'
import { provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { UserService } from '@onecx/angular-integration-interface'

// Simple component to test the directive
@Component({
  selector: 'ocx-simple',
  standalone: false,
  template: ` <div *ocxIfPermission="'test-permission'">Visible</div> `,
})
class SimpleComponent {}

// Component with multiple permissions
@Component({
  selector: 'ocx-simple',
  standalone: false,
  template: ` <div *ocxIfPermission="['test-permission', 'second-permission']">Visible</div> `,
})
class MultiplePermissionComponent {}

// Component with else template
@Component({
  selector: 'ocx-with-else',
  standalone: false,
  template: `
    <div *ocxIfPermission="'missing-permission'; elseTemplate: elseBlock">Hidden</div>
    <ng-template #elseBlock><div>Else Block</div></ng-template>
  `,
})
class WithElseTemplateComponent {}

// Component with onMissingPermission set to 'disable'
@Component({
  selector: 'ocx-on-missing-disabled',
  standalone: false,
  template: ` <div *ocxIfPermission="'test-disabled'; onMissingPermission: 'disable'">Disabled</div>`,
})
class OnMissingDisabledComponent {}

// Component with provided permissions array including the required permission
@Component({
  selector: 'ocx-with-provided',
  standalone: false,
  template: ` <div *ocxIfPermission="'provided-permission'; permissions: ['provided-permission']">
    Show with provided-permission
  </div>`,
})
class WithProvidedPermissionsComponent {}

// Component with provided permissions array not including the required permission
@Component({
  selector: 'ocx-with-missing-provided',
  standalone: false,
  template: ` <div *ocxIfPermission="'missing-permission'; permissions: ['provided-permission']">
    Show with provided-permission
  </div>`,
})
class WithMissingProvidedPermissionsComponent {}

// Component with undefined permission
@Component({
  selector: 'ocx-with-undefined',
  standalone: false,
  template: ` <div *ocxIfPermission="">Show not show</div>`,
})
class WithUndefinedPermissionComponent {}

// Simple component to test the negate functionality of the directive
@Component({
  selector: 'ocx-negate-simple',
  standalone: false,
  template: ` <div *ocxIfNotPermission="'test-permission'">Visible</div> `,
})
class NegateSimpleComponent {}

// Component with else template for negate
@Component({
  selector: 'ocx-negate-with-else',
  standalone: false,
  template: `
    <div *ocxIfNotPermission="'missing-permission'; elseTemplate: elseBlock">Hidden</div>
    <ng-template #elseBlock><div>Else Block</div></ng-template>
  `,
})
class NegateWithElseTemplateComponent {}

// Component with onMissingPermission set to 'disable' for negate
@Component({
  selector: 'ocx-negate-on-missing-disabled',
  standalone: false,
  template: ` <div *ocxIfNotPermission="'test-disabled'; onMissingPermission: 'disable'">Disabled</div>`,
})
class NegateOnMissingDisabledComponent {}

// Component with provided permissions array including the required permission for negate
@Component({
  selector: 'ocx-negate-with-provided',
  standalone: false,
  template: ` <div *ocxIfNotPermission="'provided-permission'; permissions: ['provided-permission']">
    Show with provided-permission
  </div>`,
})
class NegateWithProvidedPermissionsComponent {}

// Component with provided permissions array not including the required permission for negate
@Component({
  selector: 'ocx-negate-with-missing-provided',
  standalone: false,
  template: ` <div *ocxIfNotPermission="'missing-permission'; permissions: ['provided-permission']">
    Show with provided-permission
  </div>`,
})
class NegateWithMissingProvidedPermissionsComponent {}

// Component with undefined permission for negate
@Component({
  selector: 'ocx-negate-with-undefined',
  standalone: false,
  template: ` <div *ocxIfNotPermission="">Show not show</div>`,
})
class NegateWithUndefinedPermissionComponent {}

describe('IfPermissionDirective', () => {
  let fixture: ComponentFixture<any>
  let mockPermissionChecker: jest.Mocked<HasPermissionChecker>
  let getPermissionsMock: jest.Mock

  beforeEach(() => {
    mockPermissionChecker = {
      getPermissions: jest.fn(),
      hasPermission: jest.fn(),
    }

    TestBed.configureTestingModule({
      declarations: [
        SimpleComponent,
        WithElseTemplateComponent,
        OnMissingDisabledComponent,
        WithProvidedPermissionsComponent,
        WithUndefinedPermissionComponent,
        WithMissingProvidedPermissionsComponent,
        MultiplePermissionComponent,
        NegateSimpleComponent,
        NegateWithElseTemplateComponent,
        NegateOnMissingDisabledComponent,
        NegateWithProvidedPermissionsComponent,
        NegateWithUndefinedPermissionComponent,
        NegateWithMissingProvidedPermissionsComponent,
        IfPermissionDirective,
      ],
      providers: [
        Renderer2,
        ViewContainerRef,
        TemplateRef,
        { provide: HAS_PERMISSION_CHECKER, useValue: mockPermissionChecker },
        provideUserServiceMock(),
      ],
    })

    jest.resetAllMocks()
    getPermissionsMock = mockPermissionChecker.getPermissions as jest.Mock
  })

  it('should throw error if neither UserService nor HasPermissionChecker is provided', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      declarations: [SimpleComponent, IfPermissionDirective],
      providers: [
        Renderer2,
        ViewContainerRef,
        TemplateRef,
        {
          provide: HAS_PERMISSION_CHECKER,
          useValue: null,
        },
        {
          provide: UserService,
          useValue: null,
        },
      ],
    })

    expect(() => {
      fixture = TestBed.createComponent(SimpleComponent)
      fixture.detectChanges()
    }).toThrow('IfPermission requires UserService or HasPermissionChecker to be provided!')
  })

  it('should be usable with array of permissions', () => {
    getPermissionsMock.mockReturnValue(of(['test-permission', 'second-permission']))

    fixture = TestBed.createComponent(MultiplePermissionComponent)
    fixture.detectChanges()

    const visibleElement = fixture.nativeElement.querySelector('div')
    expect(visibleElement.textContent).toContain('Visible')
  })

  describe('ifPermission', () => {
    it('should display the element if user has permission', () => {
      getPermissionsMock.mockReturnValue(of(['test-permission']))

      fixture = TestBed.createComponent(SimpleComponent)
      fixture.detectChanges()

      const visibleElement = fixture.nativeElement.querySelector('div')
      expect(visibleElement.textContent).toContain('Visible')
    })

    it('should not display the element if user does not have permission', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(WithElseTemplateComponent)
      fixture.detectChanges()

      const hiddenElement = fixture.nativeElement.querySelector('div:contains("Hidden")')
      expect(hiddenElement).toBeNull()
    })

    it('should display the else block if user does not have permission', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(WithElseTemplateComponent)
      fixture.detectChanges()

      const elseBlock = fixture.nativeElement.querySelector('div')
      expect(elseBlock.textContent).toContain('Else Block')
    })

    it('should display disabled element if user does not have permission', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(OnMissingDisabledComponent)
      fixture.detectChanges()

      // Get the disabled attribute from fixture element
      const disabledDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement
      expect(disabledDiv).toBeTruthy()
      expect(disabledDiv.textContent).toContain('Disabled')
      expect(disabledDiv.hasAttribute('disabled')).toBeTruthy()
    })

    it('should use provided permissions array to check permissions', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(WithProvidedPermissionsComponent)
      fixture.detectChanges()

      const visibleDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement
      expect(visibleDiv).toBeTruthy()
      expect(visibleDiv.textContent).toContain('Show with provided-permission')
    })

    it('should log if provided permissions array does not contain permission', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(WithMissingProvidedPermissionsComponent)
      fixture.detectChanges()

      const element = fixture.nativeElement.querySelector('div')
      expect(element).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('ðŸ‘®â€â™€ï¸ No permission in overwrites for: `', ['missing-permission'])
    })

    it('should not show if permission is undefined', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(WithUndefinedPermissionComponent)
      fixture.detectChanges()

      const element = fixture.nativeElement.querySelector('div')
      expect(element).toBeNull()
    })

    it('should react to permission changes', () => {
      const permissionSubject$ = new BehaviorSubject<string[]>([])

      getPermissionsMock.mockImplementation((_permissions: string[] | string) => {
        return permissionSubject$.asObservable()
      })

      fixture = TestBed.createComponent(SimpleComponent)
      fixture.detectChanges()

      const element = fixture.nativeElement.querySelector('div')
      expect(element).toBeNull()

      permissionSubject$.next(['test-permission'])
      fixture.detectChanges()

      const visibleElement = fixture.nativeElement.querySelector('div')
      expect(visibleElement.textContent).toContain('Visible')
    })

    it('should remove disabled attribute when permission is granted', () => {
      const permissionSubject$ = new BehaviorSubject<string[]>([])

      getPermissionsMock.mockImplementation((_permissions: string[] | string) => {
        return permissionSubject$.asObservable()
      })

      fixture = TestBed.createComponent(OnMissingDisabledComponent)
      fixture.detectChanges()

      // Get the disabled attribute from fixture element
      let disabledDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement
      expect(disabledDiv).toBeTruthy()
      expect(disabledDiv.textContent).toContain('Disabled')
      expect(disabledDiv.hasAttribute('disabled')).toBeTruthy()

      permissionSubject$.next(['test-disabled'])
      fixture.detectChanges()

      disabledDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement
      expect(disabledDiv).toBeTruthy()
      expect(disabledDiv.textContent).toContain('Disabled')
      expect(disabledDiv.hasAttribute('disabled')).toBeFalsy()
    })
  })

  describe('ifNotPermission', () => {
    it('should not display the element if user has permission', () => {
      getPermissionsMock.mockReturnValue(of(['test-permission']))

      fixture = TestBed.createComponent(NegateSimpleComponent)
      fixture.detectChanges()

      const visibleElement = fixture.nativeElement.querySelector('div')
      expect(visibleElement).toBeNull()
    })

    it('should display the element if user does not have permission', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(NegateWithElseTemplateComponent)
      fixture.detectChanges()

      const hiddenElement = fixture.nativeElement.querySelector('div')
      expect(hiddenElement.textContent).toContain('Hidden')
    })

    it('should display the else block if user has permission', () => {
      getPermissionsMock.mockReturnValue(of(['missing-permission']))

      fixture = TestBed.createComponent(NegateWithElseTemplateComponent)
      fixture.detectChanges()

      const elseBlock = fixture.nativeElement.querySelector('div')
      expect(elseBlock.textContent).toContain('Else Block')
    })

    it('should display disabled element if user has permission', () => {
      getPermissionsMock.mockReturnValue(of(['test-disabled']))

      fixture = TestBed.createComponent(NegateOnMissingDisabledComponent)
      fixture.detectChanges()

      // Get the disabled attribute from fixture element
      const disabledDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement
      expect(disabledDiv).toBeTruthy()
      expect(disabledDiv.textContent).toContain('Disabled')
      expect(disabledDiv.hasAttribute('disabled')).toBeTruthy()
    })

    it('should use provided permissions array to check permissions', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(NegateWithMissingProvidedPermissionsComponent)
      fixture.detectChanges()

      const visibleDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement
      expect(visibleDiv).toBeTruthy()
      expect(visibleDiv.textContent).toContain('Show with provided-permission')
    })

    it('should log if provided permissions array does not contain permission', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(NegateWithMissingProvidedPermissionsComponent)
      fixture.detectChanges()

      expect(consoleSpy).toHaveBeenCalledWith('ðŸ‘®â€â™€ï¸ No permission in overwrites for: `', ['missing-permission'])
    })

    it('should not show if permission is undefined', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(NegateWithUndefinedPermissionComponent)
      fixture.detectChanges()

      const element = fixture.nativeElement.querySelector('div')
      expect(element).toBeNull()
    })

    it('should react to permission changes', () => {
      const permissionSubject$ = new BehaviorSubject<string[]>(['test-permission'])

      getPermissionsMock.mockImplementation((_permissions: string[] | string) => {
        return permissionSubject$.asObservable()
      })

      fixture = TestBed.createComponent(NegateSimpleComponent)
      fixture.detectChanges()

      const element = fixture.nativeElement.querySelector('div')
      expect(element).toBeNull()

      permissionSubject$.next([])
      fixture.detectChanges()

      const visibleElement = fixture.nativeElement.querySelector('div')
      expect(visibleElement.textContent).toContain('Visible')
    })

    it('should remove disabled attribute when permission is granted', () => {
      const permissionSubject$ = new BehaviorSubject<string[]>(['test-disabled'])

      getPermissionsMock.mockImplementation((_permissions: string[] | string) => {
        return permissionSubject$.asObservable()
      })

      fixture = TestBed.createComponent(NegateOnMissingDisabledComponent)
      fixture.detectChanges()

      // Get the disabled attribute from fixture element
      let disabledDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement
      expect(disabledDiv).toBeTruthy()
      expect(disabledDiv.textContent).toContain('Disabled')
      expect(disabledDiv.hasAttribute('disabled')).toBeTruthy()

      permissionSubject$.next([])
      fixture.detectChanges()

      disabledDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement
      expect(disabledDiv).toBeTruthy()
      expect(disabledDiv.textContent).toContain('Disabled')
      expect(disabledDiv.hasAttribute('disabled')).toBeFalsy()
    })
  })
})


```

### File: angular-accelerator/src/lib/directives/if-permission.directive.ts

```ts

import {
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER, HasPermissionChecker } from '@onecx/angular-utils'
import { BehaviorSubject, from, Observable, of, switchMap } from 'rxjs'

@Directive({ selector: '[ocxIfPermission], [ocxIfNotPermission]', standalone: false })
export class IfPermissionDirective implements OnInit {
  private renderer = inject(Renderer2)
  private el = inject(ElementRef)
  private viewContainer = inject(ViewContainerRef)
  private hasPermissionChecker = inject<HasPermissionChecker>(HAS_PERMISSION_CHECKER, { optional: true })
  private templateRef = inject<TemplateRef<any>>(TemplateRef, { optional: true })
  private userService = inject(UserService, { optional: true })

  @Input('ocxIfPermission') set permission(value: string | string[] | undefined) {
    this.permissionSubject$.next(value)
  }
  @Input('ocxIfNotPermission') set notPermission(value: string | string[] | undefined) {
    this.permissionSubject$.next(value)
    this.negate = true
  }

  @Input() ocxIfPermissionOnMissingPermission: 'hide' | 'disable' = 'hide'
  @Input() set ocxIfNotPermissionOnMissingPermission(value: 'hide' | 'disable') {
    this.ocxIfPermissionOnMissingPermission = value
  }
  @Input() onMissingPermission: 'hide' | 'disable' = 'hide'

  @Input() ocxIfPermissionPermissions: string[] | undefined
  @Input()
  set ocxIfNotPermissionPermissions(value: string[] | undefined) {
    this.ocxIfPermissionPermissions = value
  }

  @Input()
  ocxIfPermissionElseTemplate: TemplateRef<any> | undefined
  @Input()
  set ocxIfNotPermissionElseTemplate(value: TemplateRef<any> | undefined) {
    this.ocxIfPermissionElseTemplate = value
  }

  private permissionChecker: HasPermissionChecker
  private permissionSubject$ = new BehaviorSubject<string | string[] | undefined>(undefined)
  private isDisabled = false
  private directiveContentRef: EmbeddedViewRef<any> | undefined
  negate = false

  constructor() {
    const validChecker = this.hasPermissionChecker || this.userService
    if (!validChecker) {
      throw 'IfPermission requires UserService or HasPermissionChecker to be provided!'
    }

    this.permissionChecker = validChecker
  }

  ngOnInit() {
    this.permissionSubject$
      .pipe(
        switchMap((permission) => {
          if (!permission) {
            return of(false)
          }
          const permissionsArray = Array.isArray(permission) ? permission : [permission]
          return this.hasPermission(permissionsArray)
        })
      )
      .subscribe((hasPermission) => {
        const shouldShowTemplate = this.negate ? !hasPermission : hasPermission
        if (shouldShowTemplate) {
          return this.showTemplateOrClear()
        }

        return this.showElseTemplateOrDefaultView()
      })
  }

  private hasPermission(permission: string[]): Observable<boolean> {
    if (this.ocxIfPermissionPermissions) {
      const result = permission.every((p) => this.ocxIfPermissionPermissions?.includes(p))
      if (!result) {
        console.log('ðŸ‘®â€â™€ï¸ No permission in overwrites for: `', permission)
      }
      return of(result)
    }

    if (this.permissionChecker.getPermissions) {
      return this.permissionChecker.getPermissions().pipe(
        switchMap((permissions) => {
          const result = permission.every((p) => permissions.includes(p))
          if (!result) {
            console.log('ðŸ‘®â€â™€ï¸ No permission from permission checker for: `', permission)
          }
          return of(result)
        })
      )
    }

    return from(this.permissionChecker.hasPermission(permission))
  }

  private showTemplateOrClear() {
    this.resetView()

    if (this.templateRef) {
      this.directiveContentRef = this.viewContainer.createEmbeddedView(this.templateRef)
    }
  }

  private showElseTemplateOrDefaultView() {
    this.resetView()
    if (this.ocxIfPermissionElseTemplate) {
      this.viewContainer.createEmbeddedView(this.ocxIfPermissionElseTemplate)
      return
    }

    if (this.ocxIfPermissionOnMissingPermission === 'disable' && this.templateRef) {
      this.directiveContentRef = this.viewContainer.createEmbeddedView(this.templateRef)

      const el = this.getElement()
      el && this.renderer.setAttribute(el, 'disabled', 'disabled')
      this.isDisabled = true
    }
  }

  private resetView() {
    this.viewContainer.clear()
    if (this.isDisabled) {
      this.isDisabled = false
      const el = this.getElement()
      el && this.renderer.removeAttribute(el, 'disabled')
    }
  }

  private getElement(): Node | undefined {
    return this.directiveContentRef?.rootNodes[0]
  }
}


```

### File: angular-accelerator/src/lib/directives/loading-indicator.directive.ts

```ts

import {
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
  inject,
} from '@angular/core'
import { LoadingIndicatorComponent } from '../components/loading-indicator/loading-indicator.component'


@Directive({
  selector: '[ocxLoadingIndicator]',
  standalone: false,
})
export class LoadingIndicatorDirective implements OnChanges {
  private viewContainerRef = inject(ViewContainerRef)
  private el = inject(ElementRef)
  private renderer = inject(Renderer2)

  @Input() ocxLoadingIndicator = false
  @Input() overlayFullPage = false
  @Input() isLoaderSmall? = false

  private componentRef: ComponentRef<LoadingIndicatorComponent> | undefined

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ocxLoadingIndicator'] || changes['overlayFullPage']) {
      this.toggleLoadingIndicator()
    }
  }

  private elementLoader() {
    this.renderer.addClass(this.el.nativeElement, 'element-overlay')
    const loaderElement = document.createElement('div')
    loaderElement.className = 'loader'
    if (this.isLoaderSmall) {
      loaderElement.className = 'loader loader-small'
    }
    this.renderer.appendChild(this.el.nativeElement, loaderElement)
  }

  private toggleLoadingIndicator() {
    if (this.ocxLoadingIndicator) {
      if (this.overlayFullPage == false) {
        this.elementLoader()
      } else {
        this.componentRef = this.viewContainerRef.createComponent(LoadingIndicatorComponent)
      }
    } else {
      this.viewContainerRef.clear()
      if (this.componentRef) {
        this.componentRef.destroy()
      }
    }
  }
}


```

### File: angular-accelerator/src/lib/directives/src.directive.ts

```ts

import { HttpClient, HttpResponse } from '@angular/common/http'
import { Directive, ElementRef, EventEmitter, Input, Output, inject } from '@angular/core'

@Directive({ selector: '[ocxSrc]', standalone: false })
export class SrcDirective {
  private el = inject(ElementRef)
  private httpClient = inject(HttpClient)

  private _src: string | undefined

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() error = new EventEmitter<void>()

  @Input()
  get ocxSrc(): string | undefined {
    return this._src
  }
  set ocxSrc(value: string | undefined) {
    if (value && this._src !== value && window.location.hostname) {
      try {
        if (new URL(value, window.location.origin).hostname === window.location.hostname) {
          this.httpClient.get(value, { observe: 'response', responseType: 'blob' }).subscribe(
            (response: HttpResponse<Blob>) => {
              // ok with content
              if (response?.status === 200) {
                const url = URL.createObjectURL(response.body as Blob)
                this.el.nativeElement.addEventListener('load', () => {
                  URL.revokeObjectURL(url)
                })
                this.el.nativeElement.src = url
              }
              // no content
              if (response?.status === 204) {
                this.error.emit()
              }
            },
            () => {
              // on error
              this.error.emit()
            },
            () => {
              // on complete
              this.el.nativeElement.style.visibility = 'initial'
            }
          )
        } else {
          this.el.nativeElement.src = value
          this.el.nativeElement.style.visibility = 'initial'
        }
      } catch (error) {
        console.error('Cannot parse URL ', value, error)
        this.el.nativeElement.src = value
        this.el.nativeElement.style.visibility = 'initial'
      }
      this._src = value
    }
  }

  constructor() {
    this.el.nativeElement.style.visibility = 'hidden'
  }
}


```

### File: angular-accelerator/src/lib/directives/template.directive.spec.ts

```ts

import {
  AfterViewInit,
  Component,
  EmbeddedViewRef,
  QueryList,
  ViewChildren,
  ViewContainerRef,
  inject,
} from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TemplateDirective } from './template.directive'

@Component({
  standalone: false,
  selector: 'ocx-test-component',
  template: `<ng-template ocxTemplate="header"><p>header</p></ng-template>
    <ng-template ocxTemplate="content"><p>content</p></ng-template>
    <ng-template #footer><p>footer</p></ng-template>`,
})
class TestForTemplateDirectiveComponent implements AfterViewInit {
  viewContainerRef = inject(ViewContainerRef)

  @ViewChildren(TemplateDirective) templates!: QueryList<TemplateDirective>
  views: EmbeddedViewRef<any>[] = []

  ngAfterViewInit() {
    this.templates.forEach((template, _) => {
      const view = this.viewContainerRef.createEmbeddedView(template.template)
      this.views.push(view)
    })
  }
}

describe('TemplateDirective', () => {
  let component: TestForTemplateDirectiveComponent
  let fixture: ComponentFixture<TestForTemplateDirectiveComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestForTemplateDirectiveComponent, TemplateDirective],
    }).compileComponents()
    fixture = TestBed.createComponent(TestForTemplateDirectiveComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should have 2 ocx templates', async () => {
    expect(component.templates.length).toBe(2)
  })

  it('should take the correct data and type', () => {
    expect(component.templates.get(0)?.name).toBe('header')
    expect(component.templates.get(0)?.getType()).toBe('header')
    expect(component.templates.get(1)?.name).toBe('content')
    expect(component.templates.get(1)?.getType()).toBe('content')
  })

  it('should have a template reference', () => {
    expect(component.views[0].rootNodes[0].textContent).toBe('header')
    expect(component.views[1].rootNodes[0].textContent).toBe('content')
  })
})


```

### File: angular-accelerator/src/lib/directives/template.directive.ts

```ts

import { Directive, Input, TemplateRef, inject } from '@angular/core'

@Directive({ selector: '[ocxTemplate]', standalone: false })
export class TemplateDirective {
  template = inject<TemplateRef<any>>(TemplateRef)

  @Input({
    required: true,
    alias: 'ocxTemplate',
  })
  name = ''

  getType(): string {
    return this.name
  }
}


```

### File: angular-accelerator/src/lib/directives/tooltipOnOverflow.directive.ts

```ts

import {
  AfterViewInit,
  Directive,
  Input,
  NgZone,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core'
import { Tooltip, TooltipStyle } from 'primeng/tooltip'

@Directive({ selector: '[ocxTooltipOnOverflow]', standalone: false, providers: [TooltipStyle] })
export class TooltipOnOverflowDirective extends Tooltip implements OnDestroy, AfterViewInit {
  mutationObserver = new MutationObserver(() => {
    this.zone.run(() => {
      this.disabled = this.el.nativeElement.scrollWidth <= this.el.nativeElement.offsetWidth
      this.setOption({ disabled: this.disabled })
    }, this)
  })

  @Input()
  get ocxTooltipOnOverflow(): string | TemplateRef<HTMLElement> | undefined {
    return this.content
  }
  set ocxTooltipOnOverflow(value: string | TemplateRef<HTMLElement> | undefined) {
    this.content = value
    this.setOption({ tooltipLabel: value })
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy()
    this.mutationObserver.disconnect()
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit()
    setTimeout(() => {
      // Needed to ensure change detection picks up the correct state of 'disabled'
      // Without this the tooltip for some elements won't update properly
      this.zone.run(() => {
        this.disabled = this.el.nativeElement.scrollWidth <= this.el.nativeElement.offsetWidth
        this.setOption({ disabled: this.disabled })
      }, this)
      this.mutationObserver.observe(this.el.nativeElement, { subtree: true, characterData: true, childList: true })
    }, 0)
  }
  constructor() {
    const zone = inject(NgZone)
    const renderer = inject(Renderer2)
    const viewContainer = inject(ViewContainerRef)

    super(zone, viewContainer)
    renderer.setStyle(this.el.nativeElement, 'text-overflow', 'ellipsis')
    renderer.setStyle(this.el.nativeElement, 'overflow', 'hidden')
    renderer.setStyle(this.el.nativeElement, 'white-space', 'nowrap')
    this.disabled = true
    this.setOption({ disabled: this.disabled })
  }
}


```

## Folder: angular-accelerator/src/lib/functions (3 files)

### File: angular-accelerator/src/lib/functions/at-least-one-field-filled-validator.ts

```ts

import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms'

export const atLeastOneFieldFilledValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
  if (Object.values(form.value).every((x) => x === null || x === undefined || x === '')) {
    return { allFieldsEmpty: true }
  }
  return null
}


```

### File: angular-accelerator/src/lib/functions/flatten-object.spec.ts

```ts

import { flattenObject } from './flatten-object'

describe('FlattenObject', () => {
  interface TestInterface {
    test1: number
    test2: string
    test3: Date
    test4: string[]
    'test5.test6': number
    'test5.test7': string
    'test5.test8': Date
    'test5.test9': string[]
  }

  it('moves all members to the top level', () => {
    const input = {
      test1: 5,
      test2: 'test1',
      test3: new Date(),
      test4: ['test3'],
      test5: {
        test6: 23,
        test7: 'test2',
        test8: new Date(),
        test9: ['test4'],
      },
    }
    const result: TestInterface = flattenObject(input)

    expect(result).toEqual({
      test1: input.test1,
      test2: input.test2,
      test3: input.test3,
      test4: input.test4,
      'test5.test6': input.test5.test6,
      'test5.test7': input.test5.test7,
      'test5.test8': input.test5.test8,
      'test5.test9': input.test5.test9,
    })
  })
})


```

### File: angular-accelerator/src/lib/functions/flatten-object.ts

```ts

type Extend<TObj extends Record<string, unknown>, K extends string> = {
  [TKey in keyof TObj & string as `${K}${TKey}`]: TObj[TKey] extends Record<string, unknown>
    ? Extend<TObj[TKey], `${K}${TKey}.`>
    : TObj[TKey]
}

type NonObjectKeysOf<T> = {
  [K in keyof T]: T[K] extends Array<any> ? K : T[K] extends object ? (T[K] extends Date ? K : never) : K
}[keyof T]

type ObjectKeysOf<T> = {
  [K in keyof T]: T[K] extends Array<any> ? never : T[K] extends object ? K : never
}[keyof T]

type Filter<TObj extends object, TKey = keyof TObj> = TKey extends keyof TObj
  ? TObj[TKey] extends Array<any>
    ? TObj
    : TObj[TKey] extends object
    ? Filter<TObj[TKey]>
    : Pick<TObj, NonObjectKeysOf<TObj>> | Filter<Pick<TObj, ObjectKeysOf<TObj>>>
  : never

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

export type Result<TObj extends Record<string, unknown>> = UnionToIntersection<Filter<Extend<TObj, ''>>>

export function flattenObject<O extends Record<string, unknown>>(ob: O): Result<O> {
  const toReturn: Record<string, unknown> = {}

  for (const i in ob) {
    if (!Object.prototype.hasOwnProperty.call(ob, i)) continue

    if (!!ob[i] && typeof ob[i] == 'object' && !(ob[i] instanceof Date) && !Array.isArray(ob[i])) {
      const flatObject = flattenObject(ob[i] as Record<string, unknown>)
      for (const x in flatObject) {
        if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue

        toReturn[i + '.' + x] = (flatObject as any)[x]
      }
    } else {
      toReturn[i] = ob[i]
    }
  }
  return toReturn as Result<O>
}


```

## Folder: angular-accelerator/src/lib/injection-tokens (1 files)

### File: angular-accelerator/src/lib/injection-tokens/has-permission-checker.ts

```ts

/**
 * @deprecated Please import from `@onecx/angular-utils` instead.
 */
export { HasPermissionChecker } from '@onecx/angular-utils'

/**
 * This checker always returns true, basically disabling the permission system on the UI side
 * @deprecated Please import from `@onecx/angular-utils` instead.
 */
export { AlwaysGrantPermissionChecker } from '@onecx/angular-utils'

/**
 * @deprecated Please import from `@onecx/angular-utils` instead.
 */
export { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'


```

## Folder: angular-accelerator/src/lib/model (12 files)

### File: angular-accelerator/src/lib/model/breadcrumb-menu-item.model.ts

```ts

import { QueryParamsHandling } from '@angular/router'
import { MenuItem } from 'primeng/api'
export interface BreadCrumbMenuItem {
  labelKey?: string
  icon?: string
  command?: (event?: any) => void
  url?: string
  items?: MenuItem[]
  expanded?: boolean
  disabled?: boolean
  visible?: boolean
  target?: string
  escape?: boolean
  routerLinkActiveOptions?: any
  separator?: boolean
  badge?: string
  tooltip?: string
  tooltipPosition?: string
  badgeStyleClass?: string
  style?: any
  styleClass?: string
  titleKey?: string
  id?: string
  automationId?: any
  tabindex?: string
  routerLink?: any
  queryParams?: {
    [k: string]: any
  }
  fragment?: string
  queryParamsHandling?: QueryParamsHandling
  preserveFragment?: boolean
  skipLocationChange?: boolean
  replaceUrl?: boolean
  iconStyle?: any
  iconClass?: string
  state?: {
    [k: string]: any
  }
  tooltipOptions?: {
    tooltipLabel?: string
    tooltipPosition?: 'right' | 'left' | 'top' | 'bottom'
    tooltipEvent?: 'hover' | 'focus'
    appendTo?: any
    positionStyle?: string
    tooltipStyleClass?: string
    tooltipZIndex?: string
    escape?: boolean
    disabled?: boolean
    positionTop?: number
    positionLeft?: number
    showDelay?: number
    hideDelay?: number
    life?: number
  }
}


```

### File: angular-accelerator/src/lib/model/button-dialog.ts

```ts

import { Type } from '@angular/core'
import { DialogButton } from '../services/portal-dialog.service'
import { PrimeIcon } from '../utils/primeicon.utils'

/**
 * Object describing details for button rendering containing key for translation, optional icon and optional parameters for translation
 *
 * @example
 * "Cancel meeting" button with X icon
 * ```
 * // assume such translation is in the translation file
 * const translations = {
 *   MY_KEY = 'Cancel {{value}}'
 * }
 * const buttonDetails: ButtonDialogButtonDetails = {
 *   key: 'MY_KEY',
 *   icon: PrimeIcons.TIMES,
 *   parameters: {
 *     value: 'meeting'
 *   }
 * }
 * ```
 */
export interface ButtonDialogButtonDetails {
  key: string
  id?: string
  icon?: PrimeIcon
  parameters?: Record<string, unknown>
  tooltipKey?: string
  tooltipPosition?: 'right' | 'left' | 'top' | 'bottom' | string | undefined
}

export interface ButtonDialogCustomButtonDetails extends ButtonDialogButtonDetails {
  id: string
  alignment: 'right' | 'left'
}

export interface ButtonDialogConfig {
  primaryButtonDetails?: ButtonDialogButtonDetails
  secondaryButtonIncluded?: boolean
  secondaryButtonDetails?: ButtonDialogButtonDetails
  customButtons?: ButtonDialogCustomButtonDetails[]
  autoFocusButton?: DialogButton
  autoFocusButtonCustomId?: string
}

export interface ButtonDialogData {
  config: ButtonDialogConfig
  component?: Type<any>
  componentData: any
}


```

### File: angular-accelerator/src/lib/model/column-type.model.ts

```ts

export enum ColumnType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  RELATIVE_DATE = 'RELATIVE_DATE',
  TRANSLATION_KEY = 'TRANSLATION_KEY',
}


```

### File: angular-accelerator/src/lib/model/data-action.ts

```ts

export interface DataAction {
  id?: string
  labelKey?: string
  icon?: string
  permission: string | string[]
  classes?: string[]
  disabled?: boolean
  actionVisibleField?: string
  actionEnabledField?: string
  showAsOverflow?: boolean
  callback: (data: any) => void
}


```

### File: angular-accelerator/src/lib/model/data-column-name-id.model.ts

```ts

export interface DataColumnNameId {
  columnId: string
  columnName: string | number
}


```

### File: angular-accelerator/src/lib/model/data-sort-direction.ts

```ts

export const enum DataSortDirection {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
  NONE = 'NONE',
}


```

### File: angular-accelerator/src/lib/model/data-table-column.model.ts

```ts

import { ColumnType } from './column-type.model'
import { FilterType } from './filter.model'

export interface DataTableColumn {
  columnType: ColumnType
  nameKey: string
  id: string
  sortable?: boolean
  filterable?: boolean
  filterType?: FilterType
  predefinedGroupKeys?: string[]
  dateFormat?: string
}


```

### File: angular-accelerator/src/lib/model/diagram-column.ts

```ts

import { ColumnType } from './column-type.model'

export type DiagramColumn = { columnType: ColumnType; id: string }


```

### File: angular-accelerator/src/lib/model/diagram-data.ts

```ts

export type DiagramData = { label: string; value: number; backgroundColor?: string }


```

### File: angular-accelerator/src/lib/model/diagram-type.ts

```ts

export const enum DiagramType {
  PIE = 'PIE',
  VERTICAL_BAR = 'VERTICAL_BAR',
  HORIZONTAL_BAR = 'HORIZONTAL_BAR',
}


```

### File: angular-accelerator/src/lib/model/filter.model.ts

```ts

export interface ColumnFilterDataSelectOptions {
  reverse: boolean
}

export type FilterObject = { columnId: string; filterType?: FilterType }

export type Filter = FilterObject & { value: unknown }

export enum FilterType {
  ENDS_WITH = 'endsWith',
  STARTS_WITH = 'startsWith',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  EQUALS = 'equals',
  NOT_EQUALS = 'notEquals',
  LESS_THAN = 'lessThan',
  GREATER_THAN = 'greaterThan',
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
  IS_EMPTY = 'isEmpty',
  IS_NOT_EMPTY = 'isNotEmpty',
}


```

### File: angular-accelerator/src/lib/model/translation.model.ts

```ts

/**
 * Object containing key for translation with parameters object for translation
 *
 * @example
 * ## Assume such translation is in the translation file
 * ```typescript
 * const translations = {
 *   MY_KEY = 'text with parameter value = {{value}}',
 * }
 * ```
 *
 * ## TranslationKeyWithParameters declaration
 * ```
 * // will be translated into
 * // text with parameter value = hello
 * const myKey: TranslationKeyWithParameters = {
 *   key: 'MY_KEY',
 *   parameters: {
 *     value: 'hello',
 *   },
 * }
 * ```
 */
export type TranslationKeyWithParameters = { key: string; parameters?: Record<string, unknown> }

/**
 * String with key to translation or {@link TranslationKeyWithParameters} object. If provided string cannot be translated it will be displayed as is.
 */
export type TranslationKey = string | TranslationKeyWithParameters

```

## Folder: angular-accelerator/src/lib/pipes (3 files)

### File: angular-accelerator/src/lib/pipes/dynamic.pipe.ts

```ts

import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common'
import { Injector, LOCALE_ID, Pipe, PipeTransform, Type, inject } from '@angular/core'

@Pipe({
  name: 'dynamicPipe',
  standalone: false,
})
export class DynamicPipe implements PipeTransform {
  private injector = inject(Injector)

  knownPipes: { [name: string]: PipeTransform } = {}

  public constructor() {
    const locale = inject(LOCALE_ID)

    this.knownPipes = {
      currency: new CurrencyPipe(locale),
      decimal: new DecimalPipe(locale),
      date: new DatePipe(locale),
    }
  }

  transform(value: any, requiredPipe?: Type<any>, pipeArgs?: any): any {
    if (!requiredPipe) {
      return value
    }

    const injector = Injector.create({
      name: 'DynamicPipe',
      parent: this.injector,
      providers: [{ provide: requiredPipe }],
    })
    const pipe = injector.get(requiredPipe)
    return pipe.transform(value, pipeArgs)
  }

  transform2(value: any, pipeToken: any, ...pipeArgs: any[]): any {
    if (!pipeToken) {
      return value
    } else {
      // eslint-disable-next-line no-prototype-builtins
      if (pipeToken && this.knownPipes.hasOwnProperty(pipeToken)) {
        const pipe = this.knownPipes[pipeToken]
        if (Array.isArray(pipeArgs)) {
          return pipe.transform(value, ...pipeArgs)
        } else {
          return pipe.transform(value, pipeArgs)
        }
      } else {
        return value
      }
    }
  }
}


```

### File: angular-accelerator/src/lib/pipes/ocxtimeago.pipe.ts

```ts

import { ChangeDetectorRef, NgZone, OnDestroy, Pipe, PipeTransform, inject } from '@angular/core'
import { TranslatePipe, TranslateService } from '@ngx-translate/core'

@Pipe({
  name: 'timeago',
  standalone: false,
})
// eslint-disable-next-line @angular-eslint/use-pipe-transform-interface
export class OcxTimeAgoPipe extends TranslatePipe implements OnDestroy, PipeTransform {
  private changeDetectorRef: ChangeDetectorRef
  private ngZone = inject(NgZone)
  private translateService: TranslateService

  private timer: number | undefined | null

  constructor() {
    const changeDetectorRef = inject(ChangeDetectorRef)
    const translateService = inject(TranslateService)

    super(translateService, changeDetectorRef)

    this.changeDetectorRef = changeDetectorRef
    this.translateService = translateService
  }
  override transform(value: string) {
    this.removeTimer()
    const d = new Date(value)
    const now = new Date()
    const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000))
    const timeToUpdate = Number.isNaN(seconds) ? 1000 : this.getSecondsUntilUpdate(seconds) * 1000
    this.timer = this.ngZone.runOutsideAngular(() => {
      if (typeof window !== 'undefined') {
        return window.setTimeout(() => {
          this.ngZone.run(() => this.changeDetectorRef.markForCheck())
        }, timeToUpdate)
      }
      return null
    })
    const minutes = Math.round(Math.abs(seconds / 60))
    const hours = Math.round(Math.abs(minutes / 60))
    const days = Math.round(Math.abs(hours / 24))
    const months = Math.round(Math.abs(days / 30.416))
    const years = Math.round(Math.abs(days / 365))
    let translationKey = 'UNKNOWN'
    if (Number.isNaN(seconds)) {
      translationKey = 'NAN'
    } else if (seconds <= 45) {
      translationKey = 'A_FEW_SECONDS_AGO'
    } else if (seconds <= 90) {
      translationKey = 'A_MINUTE_AGO'
    } else if (minutes <= 45) {
      translationKey = 'MINUTES_AGO'
    } else if (minutes <= 90) {
      translationKey = 'AN_HOUR_AGO'
    } else if (hours <= 22) {
      translationKey = 'HOURS_AGO'
    } else if (hours <= 36) {
      translationKey = 'A_DAY_AGO'
    } else if (days <= 25) {
      translationKey = 'DAYS_AGO'
    } else if (days <= 45) {
      translationKey = 'A_MONTH_AGO'
    } else if (days <= 345) {
      translationKey = 'MONTHS_AGO'
    } else if (days <= 545) {
      translationKey = 'A_YEAR_AGO'
    } else {
      translationKey = 'YEARS_AGO'
    }
    return super.transform('OCX_TIMEAGO.' + translationKey, { minutes, hours, days, months, years })
  }
  override ngOnDestroy(): void {
    this.removeTimer()
    super.ngOnDestroy()
  }
  private removeTimer() {
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = null
    }
  }
  private getSecondsUntilUpdate(seconds: number) {
    const min = 60
    const hr = min * 60
    const day = hr * 24
    if (seconds < min) {
      return 2
    } else if (seconds < hr) {
      return 30
    } else if (seconds < day) {
      return 300
    } else {
      return 3600
    }
  }
}


```

### File: angular-accelerator/src/lib/pipes/relative-date.pipe.ts

```ts

import { Pipe, PipeTransform, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, name: 'seconds' },
  { amount: 60, name: 'minutes' },
  { amount: 24, name: 'hours' },
  { amount: 7, name: 'days' },
  { amount: 4.34524, name: 'weeks' },
  { amount: 12, name: 'months' },
  { amount: Number.POSITIVE_INFINITY, name: 'years' },
]

@Pipe({
  name: 'relativeDate',
  standalone: false,
})
export class RelativeDatePipe implements PipeTransform {
  private readonly translateService = inject(TranslateService)

  rtf: Intl.RelativeTimeFormat

  constructor() {
    this.rtf = new Intl.RelativeTimeFormat(this.translateService.currentLang, {
      style: 'long',
    })
  }

  transform(value: any): any {
    let date: Date = new Date()
    switch (typeof value) {
      case 'string':
        date = new Date(value)
        break
      case 'object':
        date = value
        break
      default:
        break
    }

    let duration = (date.getTime() - new Date().getTime()) / 1000
    for (let i = 0; i <= DIVISIONS.length; i++) {
      const division = DIVISIONS[i]
      if (Math.abs(duration) < division.amount) {
        return this.rtf.format(Math.round(duration), division.name)
      }
      duration /= division.amount
    }
  }
}


```

## Folder: angular-accelerator/src/lib/services (6 files)

### File: angular-accelerator/src/lib/services/breadcrumb.service.ts

```ts

import { Injectable, OnDestroy, inject } from '@angular/core'
import { ActivatedRoute, ActivatedRouteSnapshot, Data, NavigationEnd, ParamMap, Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TranslateService } from '@ngx-translate/core'
import { Topic } from '@onecx/accelerator'
import { MenuItem } from 'primeng/api'
import { BehaviorSubject, filter, map, Observable } from 'rxjs'
import { BreadCrumbMenuItem } from '../model/breadcrumb-menu-item.model'

interface ManualBreadcrumbs {
  menuItems: MenuItem[]
}

// This topic is defined here and not in integration-interface, because
// it is not used as framework independent integration but for improving
// angular specific things
class ManualBreadcrumbsTopic extends Topic<ManualBreadcrumbs> {
  constructor() {
    super('manualBreadcrumbs', 1)
  }
}

@Injectable({ providedIn: 'any' })
@UntilDestroy()
export class BreadcrumbService implements OnDestroy {
  private readonly router = inject(Router)
  private readonly activeRoute = inject(ActivatedRoute)
  private readonly translateService = inject(TranslateService)

  private _itemSource$: ManualBreadcrumbsTopic | undefined
  private get itemsSource$() {
    this._itemSource$ ??= new ManualBreadcrumbsTopic()
    return this._itemSource$
  }
  private set itemsSource$(source: ManualBreadcrumbsTopic) {
    this._itemSource$ = source
  }
  generatedItemsSource = new BehaviorSubject<MenuItem[]>([])

  _itemsHandler: Observable<MenuItem[]> | undefined
  get itemsHandler() {
    this._itemsHandler ??= this.itemsSource$.pipe(map((manualBreadcrumbs) => manualBreadcrumbs.menuItems))
    return this._itemsHandler
  }

  constructor() {
    this.generateBreadcrumbs(this.activeRoute.snapshot)
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        const root = this.router.routerState.snapshot.root
        this.generateBreadcrumbs(root)
      })
  }

  ngOnDestroy(): void {
    this._itemSource$?.destroy()
  }

  private generateBreadcrumbs(route: ActivatedRouteSnapshot | null) {
    if (route?.data['mfeInfo']) {
      const breadcrumbs: MenuItem[] = [
        {
          label: route.data['mfeInfo'].productName,
          routerLink: route.data['mfeInfo'].baseHref,
        },
      ]
      const baseUrl: string[] = (route.data['mfeInfo'].baseHref as string).split('/').filter((value) => value)
      const parentUrl: string[] = route.url.map((url) => url.path)
      const isUsingMatcher = !parentUrl.every((item) => baseUrl.includes(item))
      if (isUsingMatcher) {
        this.createBreadcrumb(route, parentUrl, breadcrumbs)
      }
      this.addBreadcrumb(route.firstChild, parentUrl, breadcrumbs)
      this.generatedItemsSource.next(breadcrumbs)
    } else if (route?.data['breadcrumb']) {
      const breadcrumbs: MenuItem[] = []
      this.addBreadcrumb(route, [], breadcrumbs)
      this.generatedItemsSource.next(breadcrumbs)
    } else if (route) {
      this.generateBreadcrumbs(route.firstChild)
    }
  }

  private addBreadcrumb(route: ActivatedRouteSnapshot | null, parentUrl: string[], breadcrumbs: MenuItem[]) {
    if (route?.url) {
      const routeUrl = parentUrl.concat(route.url.map((url) => url.path))
      if (route.routeConfig?.path) {
        this.createBreadcrumb(route, routeUrl, breadcrumbs)
      }

      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs)
    }
  }

  private createBreadcrumb(route: ActivatedRouteSnapshot, routeUrl: string[], breadcrumbs: MenuItem[]) {
    if (route.data['breadcrumb']) {
      const breadcrumb: MenuItem = {
        label: this.getLabel(route.data, route.paramMap),
        routerLink: '/' + routeUrl.join('/'),
      }
      breadcrumbs.push(breadcrumb)
    } else {
      const breadcrumb: MenuItem = {
        label: 'NA',
        routerLink: '/' + routeUrl.join('/'),
      }
      breadcrumbs.push(breadcrumb)
    }
  }

  private getLabel(data: Data, params: ParamMap) {
    if (typeof data['breadcrumbFn'] === 'function') {
      return data['breadcrumbFn'](data, params)
    }
    return data['breadcrumb']
  }

  setItems(items: BreadCrumbMenuItem[]) {
    const translationKeys = [
      ...items.map((i) => i.labelKey ?? '').filter((l) => !!l),
      ...items.map((i) => i.titleKey ?? '').filter((l) => !!l),
    ]
    if (translationKeys.length) {
      this.translateService.get(translationKeys).subscribe((translations: any) => {
        this.itemsSource$.publish({
          menuItems: items.map((i) => ({
            ...i,
            label: translations[i.labelKey ?? ''],
            title: translations[i.titleKey ?? ''],
          })),
        })
      })
    } else {
      this.itemsSource$.publish({
        menuItems: items,
      })
    }
  }
}


```

### File: angular-accelerator/src/lib/services/export-data.service.ts

```ts

import { Injectable, LOCALE_ID, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable, firstValueFrom, map, of } from 'rxjs'
import { DateUtils } from '../utils/dateutils'
import { ColumnType } from '../model/column-type.model'
import { ObjectUtils } from '../utils/objectutils'

@Injectable({ providedIn: 'any' })
export class ExportDataService {
  private readonly dateUtils = inject(DateUtils)
  private readonly translateService = inject(TranslateService)
  private readonly locale = inject(LOCALE_ID)

  async exportCsv<T extends string | number | symbol>(
    columns: { id: string; nameKey: string; columnType: ColumnType }[],
    data: Partial<Record<T, unknown | undefined>>[],
    fileName: string
  ): Promise<void> {
    if (!columns.length) {
      return
    }
    const flattenedData = data.map((d) =>
      columns.reduce((obj, c) => ({ ...obj, [c.id]: ObjectUtils.resolveFieldData(d, c.id) }), {})
    )
    const translatedData = await firstValueFrom(this.translateData(columns, flattenedData))
    const dataToExport = this.formatData(columns, translatedData)
    const delimiter = this.locale.startsWith('de') ? ';' : ','
    const dataString = dataToExport
      .map((d) =>
        columns
          .reduce((arr: unknown[], c) => [...arr, d[c.id]], [])
          .map((d) => this.escapeDelimiterAndLineBreaks(delimiter, d))
          .join(delimiter)
      )
      .join('\r\n')
    const headerString = (await firstValueFrom(this.translateColumnNames(columns)))
      .map((c) => c.name)
      .map((c) => this.escapeDelimiterAndLineBreaks(delimiter, c))
      .join(delimiter)

    const csvString = headerString + '\r\n' + dataString

    const blob = new Blob(['\ufeff' + csvString], {
      type: 'text/csv;charset=utf-8;',
    })
    const dwldLink = document.createElement('a')
    const url = URL.createObjectURL(blob)

    dwldLink.setAttribute('href', url)

    dwldLink.setAttribute('download', fileName)
    dwldLink.click()
  }

  private translateColumnNames(
    columns: { id: string; nameKey: string; columnType: ColumnType }[]
  ): Observable<{ id: string; name: string; columnType: ColumnType }[]> {
    return this.translateService
      .get(columns.map((c) => c.nameKey))
      .pipe(map((translations) => columns.map((c) => ({ ...c, name: translations[c.nameKey] }))))
  }

  private formatData(
    columns: { id: string; nameKey: string; columnType: ColumnType }[],
    data: Record<string, unknown>[]
  ): { [columnId: string]: unknown }[] {
    return data.map((d) =>
      columns.reduce((obj, c) => {
        if (c.columnType === ColumnType.DATE || c.columnType === ColumnType.RELATIVE_DATE) {
          return {
            ...obj,
            [c.id]: this.dateUtils.localizedDate(d[c.id] ? String(d[c.id]) : undefined),
          }
        }
        return { ...obj, [c.id]: d[c.id] }
      }, {})
    )
  }

  private translateData(
    columns: { id: string; nameKey: string; columnType: ColumnType }[],
    data: Record<string, unknown>[]
  ): Observable<{ [columnId: string]: unknown }[]> {
    let translationKeys: string[] = []
    const translatedColumns = columns.filter((c) => c.columnType === ColumnType.TRANSLATION_KEY)
    translatedColumns.forEach((c) => {
      translationKeys = [...translationKeys, ...data.map((i) => i[c.id]?.toString() ?? '')]
    })
    if (translationKeys.length) {
      return this.translateService.get(translationKeys).pipe(
        map((translatedValues: Record<string, string>) => {
          return data.map((d) =>
            columns.reduce(
              (obj, c) => ({
                ...obj,
                [c.id]: c.columnType === ColumnType.TRANSLATION_KEY ? translatedValues[String(d[c.id])] : d[c.id],
              }),
              {}
            )
          )
        })
      )
    }
    return of(data)
  }

  private escapeDelimiterAndLineBreaks(delimiter: ';' | ',', data: unknown) {
    if (data === null || data === undefined) {
      return data
    }

    let str = String(data)

    if (str.includes('"')) {
      str = str.replaceAll('"', '""')
    }

    if (str.includes(delimiter) || str.includes('\n') || str.includes('\r')) {
      str = `"${str}"`
    }
    return str
  }
}


```

### File: angular-accelerator/src/lib/services/export-data-service.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { ExportDataService } from './export-data.service'
import { DateUtils } from '../utils/dateutils'
import { ColumnType } from '../model/column-type.model'

describe('ExportDataService', () => {
  class ElementMock {
    attributes: Record<string, unknown> = {}
    setAttribute(name: string, value: unknown) {
      this.attributes[name] = value
    }
    click() {
      // do click
    }
  }

  function removeWhitespaces(str: string) {
    return str.replace(/\s+/g, '')
  }

  let blobs: Blob[] = []

  let translateService: TranslateService
  let exportDataService: ExportDataService
  let dateUtils: DateUtils

  const ENGLISH_LANGUAGE = 'en'
  const ENGLISH_TRANSLATIONS = {
    SOME_STATUS: 'some status',
    STATUS_EXAMPLE: 'some status example',
    STATUS_NAME_1: 'status name 1',
    STATUS_NAME_2: 'status name 2',
    STATUS_NAME_3: 'status name 3',
    COLUMN_HEADER_NAME: {
      NAME: 'Name',
      STATUS: 'Status',
      DESCRIPTION: 'Description',
      RESPONSIBLE: 'Responsible',
      START_DATE: 'Start date',
      END_DATE: 'End date',
      MODIFICATION_DATE: 'Modification date',
      CREATION_USER: 'Creation user',
      TEST_NUMBER: 'Test number',
    },
  }

  const GERMAN_LANGUAGE = 'de'
  const GERMAN_TRANSLATIONS = {
    SOME_STATUS: 'irgendein Status',
    STATUS_EXAMPLE: 'irgendein Beispielstatus',
    STATUS_NAME_1: 'Status Name 1',
    STATUS_NAME_2: 'Status Name 2',
    STATUS_NAME_3: 'Status Name 3',
    COLUMN_HEADER_NAME: {
      NAME: 'Name',
      STATUS: 'Status',
      DESCRIPTION: 'Beschreibung',
      RESPONSIBLE: 'Verantwortlich',
      START_DATE: 'Startdatum',
      END_DATE: 'Enddatum',
      MODIFICATION_DATE: 'Ã„nderungsdatum',
      CREATION_USER: 'Erstellungsbenutzer',
      TEST_NUMBER: 'Testnummer',
    },
  }

  const TRANSLATIONS = {
    [ENGLISH_LANGUAGE]: ENGLISH_TRANSLATIONS,
    [GERMAN_LANGUAGE]: GERMAN_TRANSLATIONS,
  }

  const mockData = [
    {
      version: 0,
      creationDate: '2023-09-12T09:34:11.997048Z',
      creationUser: 'creation user',
      modificationDate: '2023-09-12T09:34:11.997048Z',
      modificationUser: '',
      id: '195ee34e-41c6-47b7-8fc4-3f245dee7651',
      name: 'some name',
      description: '',
      status: 'SOME_STATUS',
      responsible: 'someone responsible',
      endDate: '2023-09-14T09:34:09Z',
      startDate: '2023-09-13T09:34:05Z',
      imagePath: '/path/to/image',
      testNumber: '1',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:33:58.544494Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:33:58.544494Z',
      modificationUser: '',
      id: '5f8bb05b-d089-485e-a234-0bb6ff25234e',
      name: 'example',
      description: 'example description',
      status: 'STATUS_EXAMPLE',
      responsible: '',
      endDate: '2023-09-13T09:33:55Z',
      startDate: '2023-09-12T09:33:53Z',
      imagePath: '',
      testNumber: '3.141',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 1',
      description: '',
      status: 'STATUS_NAME_1',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '123456789',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 2',
      description: '',
      status: 'STATUS_NAME_2',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '12345.6789',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 3',
      description: '',
      status: 'STATUS_NAME_3',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '7.1',
    },
  ]
  const mockDataWithUndefinedDateValues = [
    {
      version: 0,
      creationDate: '2023-09-12T09:34:11.997048Z',
      creationUser: 'creation user',
      modificationDate: '2023-09-12T09:34:11.997048Z',
      modificationUser: '',
      id: '195ee34e-41c6-47b7-8fc4-3f245dee7651',
      name: 'some name',
      description: '',
      status: 'SOME_STATUS',
      responsible: 'someone responsible',
      endDate: '2023-09-14T09:34:09Z',
      startDate: '2023-09-13T09:34:05Z',
      imagePath: '/path/to/image',
      testNumber: '1',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:33:58.544494Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:33:58.544494Z',
      modificationUser: '',
      id: '5f8bb05b-d089-485e-a234-0bb6ff25234e',
      name: 'example',
      description: 'example description',
      status: 'STATUS_EXAMPLE',
      responsible: '',
      endDate: '2023-09-13T09:33:55Z',
      startDate: '2023-09-12T09:33:53Z',
      imagePath: '',
      testNumber: '3.141',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 1',
      description: '',
      status: 'STATUS_NAME_1',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '123456789',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 2',
      description: '',
      status: 'STATUS_NAME_2',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: undefined,
      imagePath: '',
      testNumber: '12345.6789',
    },
    {
      version: 0,
      creationDate: undefined,
      creationUser: '',
      modificationDate: undefined,
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 3',
      description: '',
      status: 'STATUS_NAME_3',
      responsible: '',
      endDate: undefined,
      startDate: undefined,
      imagePath: '',
      testNumber: '7.1',
    },
  ]
  const mockColumns = [
    {
      columnType: ColumnType.STRING,
      id: 'name',
      nameKey: 'COLUMN_HEADER_NAME.NAME',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'description',
      nameKey: 'COLUMN_HEADER_NAME.DESCRIPTION',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'startDate',
      nameKey: 'COLUMN_HEADER_NAME.START_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'endDate',
      nameKey: 'COLUMN_HEADER_NAME.END_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.TRANSLATION_KEY,
      id: 'status',
      nameKey: 'COLUMN_HEADER_NAME.STATUS',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'responsible',
      nameKey: 'COLUMN_HEADER_NAME.RESPONSIBLE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.RELATIVE_DATE,
      id: 'modificationDate',
      nameKey: 'COLUMN_HEADER_NAME.MODIFICATION_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'creationUser',
      nameKey: 'COLUMN_HEADER_NAME.CREATION_USER',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.NUMBER,
      id: 'testNumber',
      nameKey: 'COLUMN_HEADER_NAME.TEST_NUMBER',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [TranslateModule.forRoot(), TranslateTestingModule.withTranslations(TRANSLATIONS)],
      providers: [ExportDataService, DateUtils],
    }).compileComponents()

    translateService = TestBed.inject(TranslateService)
    exportDataService = TestBed.inject(ExportDataService)
    dateUtils = TestBed.inject(DateUtils)

    blobs = []
  })

  it('should export data as csv in en', async () => {
    translateService.use('en')
    ;(<any>exportDataService).locale = 'en'
    ;(<any>dateUtils).locale = 'en'

    const expectedCsv =
      'Name,Description,Start date,End date,Status,Responsible,Modification date,Creation user,Test number' +
      '\r\nsome name,,' +
      '"' +
      dateUtils.localizedDate('2023-09-13T09:34:05Z') +
      '"' +
      ',' +
      '"' +
      dateUtils.localizedDate('2023-09-14T09:34:09Z') +
      '"' +
      ',some status,someone responsible,' +
      '"' +
      dateUtils.localizedDate('2023-09-12T09:34:11.997048Z') +
      '"' +
      ',creation user,1' +
      '\r\nexample,example description,' +
      '"' +
      dateUtils.localizedDate('2023-09-12T09:33:53Z') +
      '"' +
      ',' +
      '"' +
      dateUtils.localizedDate('2023-09-13T09:33:55Z') +
      '"' +
      ',some status example,,' +
      '"' +
      dateUtils.localizedDate('2023-09-12T09:33:58.544494Z') +
      '"' +
      ',,3.141' +
      '\r\nname 1,,' +
      '"' +
      dateUtils.localizedDate('2023-09-14T09:34:22Z') +
      '"' +
      ',' +
      '"' +
      dateUtils.localizedDate('2023-09-15T09:34:24Z') +
      '"' +
      ',status name 1,,' +
      '"' +
      dateUtils.localizedDate('2023-09-12T09:34:27.184086Z') +
      '"' +
      ',,123456789' +
      '\r\nname 2,,' +
      '"' +
      dateUtils.localizedDate('2023-09-14T09:34:22Z') +
      '"' +
      ',' +
      '"' +
      dateUtils.localizedDate('2023-09-15T09:34:24Z') +
      '"' +
      ',status name 2,,' +
      '"' +
      dateUtils.localizedDate('2023-09-12T09:34:27.184086Z') +
      '"' +
      ',,12345.6789' +
      '\r\nname 3,,' +
      '"' +
      dateUtils.localizedDate('2023-09-14T09:34:22Z') +
      '"' +
      ',' +
      '"' +
      dateUtils.localizedDate('2023-09-15T09:34:24Z') +
      '"' +
      ',status name 3,,' +
      '"' +
      dateUtils.localizedDate('2023-09-12T09:34:27.184086Z') +
      '"' +
      ',,7.1'
    const expectedFilename = 'some-test.csv'
    const mock = new ElementMock()

    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, mockData, 'some-test.csv')

    expect(removeWhitespaces(expectedCsv)).toEqual(
      removeWhitespaces(await blobs[Number(mock.attributes['href'])].text())
    )
    expect(expectedFilename).toEqual(mock.attributes['download'])
  })

  it('should export data as csv in en which contains data of date fields that are undefined', async () => {
    translateService.use('en')
    ;(<any>exportDataService).locale = 'en'
    ;(<any>dateUtils).locale = 'en'

    const expectedCsv =
      'Name,Description,Start date,End date,Status,Responsible,Modification date,Creation user,Test number' +
      '\r\nsome name,,' +
      generateCsvContentForDate('2023-09-13T09:34:05Z', dateUtils) +
      ',' +
      generateCsvContentForDate('2023-09-14T09:34:09Z', dateUtils) +
      ',some status,someone responsible,' +
      generateCsvContentForDate('2023-09-12T09:34:11.997048Z', dateUtils) +
      ',creation user,1' +
      '\r\nexample,example description,' +
      generateCsvContentForDate('2023-09-12T09:33:53Z', dateUtils) +
      ',' +
      generateCsvContentForDate('2023-09-13T09:33:55Z', dateUtils) +
      ',some status example,,' +
      generateCsvContentForDate('2023-09-12T09:33:58.544494Z', dateUtils) +
      ',,3.141' +
      '\r\nname 1,,' +
      generateCsvContentForDate('2023-09-14T09:34:22Z', dateUtils) +
      ',' +
      generateCsvContentForDate('2023-09-15T09:34:24Z', dateUtils) +
      ',status name 1,,' +
      generateCsvContentForDate('2023-09-12T09:34:27.184086Z', dateUtils) +
      ',,123456789' +
      '\r\nname 2,,' +
      generateCsvContentForDate(undefined, dateUtils) +
      ',' +
      generateCsvContentForDate('2023-09-15T09:34:24Z', dateUtils) +
      ',status name 2,,' +
      generateCsvContentForDate('2023-09-12T09:34:27.184086Z', dateUtils) +
      ',,12345.6789' +
      '\r\nname 3,,' +
      generateCsvContentForDate(undefined, dateUtils) +
      ',' +
      generateCsvContentForDate(undefined, dateUtils) +
      ',status name 3,,' +
      generateCsvContentForDate(undefined, dateUtils) +
      ',,7.1'
    const expectedFilename = 'some-test.csv'
    const mock = new ElementMock()

    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, mockDataWithUndefinedDateValues, 'some-test.csv')

    expect(removeWhitespaces(expectedCsv)).toEqual(
      removeWhitespaces(await blobs[Number(mock.attributes['href'])].text())
    )
    expect(expectedFilename).toEqual(mock.attributes['download'])
  })

  it('should export data as csv in en which contains data of date fields that are undefined', async () => {
    translateService.use('en')
    ;(<any>exportDataService).locale = 'en'
    ;(<any>dateUtils).locale = 'en'

    const expectedCsv =
      'Name,Description,Start date,End date,Status,Responsible,Modification date,Creation user,Test number' +
      '\r\nsome name,,' +
      generateCsvContentForDate('2023-09-13T09:34:05Z', dateUtils) +
      ',' +
      generateCsvContentForDate('2023-09-14T09:34:09Z', dateUtils) +
      ',some status,someone responsible,' +
      generateCsvContentForDate('2023-09-12T09:34:11.997048Z', dateUtils) +
      ',creation user,1' +
      '\r\nexample,example description,' +
      generateCsvContentForDate('2023-09-12T09:33:53Z', dateUtils) +
      ',' +
      generateCsvContentForDate('2023-09-13T09:33:55Z', dateUtils) +
      ',some status example,,' +
      generateCsvContentForDate('2023-09-12T09:33:58.544494Z', dateUtils) +
      ',,3.141' +
      '\r\nname 1,,' +
      generateCsvContentForDate('2023-09-14T09:34:22Z', dateUtils) +
      ',' +
      generateCsvContentForDate('2023-09-15T09:34:24Z', dateUtils) +
      ',status name 1,,' +
      generateCsvContentForDate('2023-09-12T09:34:27.184086Z', dateUtils) +
      ',,123456789' +
      '\r\nname 2,,' +
      generateCsvContentForDate(undefined, dateUtils) +
      ',' +
      generateCsvContentForDate('2023-09-15T09:34:24Z', dateUtils) +
      ',status name 2,,' +
      generateCsvContentForDate('2023-09-12T09:34:27.184086Z', dateUtils) +
      ',,12345.6789' +
      '\r\nname 3,,' +
      generateCsvContentForDate(undefined, dateUtils) +
      ',' +
      generateCsvContentForDate(undefined, dateUtils) +
      ',status name 3,,' +
      generateCsvContentForDate(undefined, dateUtils) +
      ',,7.1'
    const expectedFilename = 'some-test.csv'
    const mock = new ElementMock()

    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, mockDataWithUndefinedDateValues, 'some-test.csv')

    expect(removeWhitespaces(expectedCsv)).toEqual(
      removeWhitespaces(await blobs[Number(mock.attributes['href'])].text())
    )
    expect(expectedFilename).toEqual(mock.attributes['download'])
  })

  it('should export data as csv in de', async () => {
    translateService.use('de')
    ;(<any>exportDataService).locale = 'de'
    ;(<any>dateUtils).locale = 'de'

    const expectedFilename = 'some-test.csv'
    const expectedCsv =
      'Name;Beschreibung;Startdatum;Enddatum;Status;Verantwortlich;Ã„nderungsdatum;Erstellungsbenutzer;Testnummer' +
      '\r\nsome name;;' +
      dateUtils.localizedDate('2023-09-13T09:34:05Z') +
      ';' +
      dateUtils.localizedDate('2023-09-14T09:34:09Z') +
      ';irgendein Status;someone responsible;' +
      dateUtils.localizedDate('2023-09-12T09:34:11.997048Z') +
      ';creation user;1' +
      '\r\nexample;example description;' +
      dateUtils.localizedDate('2023-09-12T09:33:53Z') +
      ';' +
      dateUtils.localizedDate('2023-09-13T09:33:55Z') +
      ';irgendein Beispielstatus;;' +
      dateUtils.localizedDate('2023-09-12T09:33:58.544494Z') +
      ';;3.141' +
      '\r\nname 1;;' +
      dateUtils.localizedDate('2023-09-14T09:34:22Z') +
      ';' +
      dateUtils.localizedDate('2023-09-15T09:34:24Z') +
      ';Status Name 1;;' +
      dateUtils.localizedDate('2023-09-12T09:34:27.184086Z') +
      ';;123456789' +
      '\r\nname 2;;' +
      dateUtils.localizedDate('2023-09-14T09:34:22Z') +
      ';' +
      dateUtils.localizedDate('2023-09-15T09:34:24Z') +
      ';Status Name 2;;' +
      dateUtils.localizedDate('2023-09-12T09:34:27.184086Z') +
      ';;12345.6789' +
      '\r\nname 3;;' +
      dateUtils.localizedDate('2023-09-14T09:34:22Z') +
      ';' +
      dateUtils.localizedDate('2023-09-15T09:34:24Z') +
      ';Status Name 3;;' +
      dateUtils.localizedDate('2023-09-12T09:34:27.184086Z') +
      ';;7.1'
    const mock = new ElementMock()

    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, mockData, 'some-test.csv')

    expect(removeWhitespaces(expectedCsv)).toEqual(
      removeWhitespaces(await blobs[Number(mock.attributes['href'])].text())
    )
    expect(expectedFilename).toEqual(mock.attributes['download'])
  })
  it('should export data as csv in de which contains data of date fields that are undefined', async () => {
    translateService.use('de')
    ;(<any>exportDataService).locale = 'de'
    ;(<any>dateUtils).locale = 'de'

    const expectedFilename = 'some-test.csv'
    const expectedCsv =
      'Name;Beschreibung;Startdatum;Enddatum;Status;Verantwortlich;Ã„nderungsdatum;Erstellungsbenutzer;Testnummer' +
      '\r\nsome name;;' +
      dateUtils.localizedDate('2023-09-13T09:34:05Z') +
      ';' +
      dateUtils.localizedDate('2023-09-14T09:34:09Z') +
      ';irgendein Status;someone responsible;' +
      dateUtils.localizedDate('2023-09-12T09:34:11.997048Z') +
      ';creation user;1' +
      '\r\nexample;example description;' +
      dateUtils.localizedDate('2023-09-12T09:33:53Z') +
      ';' +
      dateUtils.localizedDate('2023-09-13T09:33:55Z') +
      ';irgendein Beispielstatus;;' +
      dateUtils.localizedDate('2023-09-12T09:33:58.544494Z') +
      ';;3.141' +
      '\r\nname 1;;' +
      dateUtils.localizedDate('2023-09-14T09:34:22Z') +
      ';' +
      dateUtils.localizedDate('2023-09-15T09:34:24Z') +
      ';Status Name 1;;' +
      dateUtils.localizedDate('2023-09-12T09:34:27.184086Z') +
      ';;123456789' +
      '\r\nname 2;;' +
      dateUtils.localizedDate(undefined) +
      ';' +
      dateUtils.localizedDate('2023-09-15T09:34:24Z') +
      ';Status Name 2;;' +
      dateUtils.localizedDate('2023-09-12T09:34:27.184086Z') +
      ';;12345.6789' +
      '\r\nname 3;;' +
      dateUtils.localizedDate(undefined) +
      ';' +
      dateUtils.localizedDate(undefined) +
      ';Status Name 3;;' +
      dateUtils.localizedDate(undefined) +
      ';;7.1'

    const mock = new ElementMock()

    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, mockDataWithUndefinedDateValues, 'some-test.csv')

    expect(removeWhitespaces(expectedCsv)).toEqual(
      removeWhitespaces(await blobs[Number(mock.attributes['href'])].text())
    )
    expect(expectedFilename).toEqual(mock.attributes['download'])
  })

  it('should replace one double quotes with two double quotes', async () => {
    const data = [{ name: 'Name A"Name B' }]
    const mock = new ElementMock()
    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, data, 'test.csv')
    const csv = await blobs[Number(mock.attributes['href'])].text()
    expect(csv).toContain('Name A""Name B')
  })

  it('should wrap in quotes if delimiter is present', async () => {
    const data = [{ name: 'Name A,Name B' }]
    const mock = new ElementMock()
    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, data, 'test.csv')
    const csv = await blobs[Number(mock.attributes['href'])].text()
    expect(csv).toContain('"Name A,Name B"')
  })

  it('should wrap in quotes if line break (`\n`) is present', async () => {
    const data = [{ name: 'Name A\nName B' }]
    const mock = new ElementMock()
    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, data, 'test.csv')
    const csv = await blobs[Number(mock.attributes['href'])].text()
    expect(csv).toContain('"Name A\nName B"')
  })

  it('should wrap in quotes if line break (`\r`) is present', async () => {
    const data = [{ name: 'Name A\rName B' }]
    const mock = new ElementMock()
    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, data, 'test.csv')
    const csv = await blobs[Number(mock.attributes['href'])].text()
    expect(csv).toContain('"Name A\rName B"')
  })

  it('should not wrap in quotes if not needed', async () => {
    const data = [{ name: 'Name A' }]
    const mock = new ElementMock()
    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, data, 'test.csv')
    const csv = await blobs[Number(mock.attributes['href'])].text()
    expect(csv).toContain('Name A')
    expect(csv).not.toContain('"Name A"')
  })
})

function generateCsvContentForDate(value: string | undefined, dateUtils: DateUtils): string {
  if (value) {
    return '"' + dateUtils.localizedDate(value) + '"'
  }
  return dateUtils.localizedDate(value)
}


```

### File: angular-accelerator/src/lib/services/portal-dialog.service.spec.ts

```ts

import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { ButtonModule } from 'primeng/button'
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog'
import { Observable, of } from 'rxjs'

import { DivHarness, InputHarness } from '@onecx/angular-testing'
import { PrimeIcons } from 'primeng/api'
import { DialogContentHarness, DialogFooterHarness } from '../../../testing/index'
import { DialogMessageContentComponent } from '../components/dialog/dialog-message-content/dialog-message-content.component'
import { DialogContentComponent } from '../components/dialog/dialog-content/dialog-content.component'
import { DialogFooterComponent } from '../components/dialog/dialog-footer/dialog-footer.component'
import {
  DialogButtonClicked,
  DialogPrimaryButtonDisabled,
  DialogResult,
  DialogSecondaryButtonDisabled,
  DialogState,
  PortalDialogService,
} from './portal-dialog.service'
import { provideShellCapabilityServiceMock } from '@onecx/angular-integration-interface/mocks'
import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

// This component is in charge of dialog display
@Component({
  standalone: false,
  template: `<h1>BaseTestComponent</h1>`,
})
class BaseTestComponent {
  portalDialogService = inject(PortalDialogService)

  resultFromShow: DialogState<any> | undefined = undefined
  nameResult: string | undefined
  surnameResult: string | undefined

  show(title: any, message: any, button1: any, button2?: any, showXButton: any = true) {
    this.portalDialogService.openDialog(title, message, button1, button2, showXButton).subscribe({
      next: (result) => {
        this.resultFromShow = result
      },
    })
  }

  showWithType() {
    this.portalDialogService
      .openDialog(
        'Enter credentials',
        {
          type: CompleteDialogComponent,
        },
        'Validate',
        'Hint: Doe'
      )
      .subscribe((result) => {
        this.nameResult = result.result?.name
        this.surnameResult = result.result?.surname
        this.resultFromShow = result
      })
  }
}

// This component should be displayed for testing inputs
@Component({
  standalone: false,
  template: `<div class="testHeader">{{ header }}</div>`,
})
class TestWithInputsComponent {
  @Input() header = 'header'
}

// This component should be displayed for testing result manipulation
@Component({
  standalone: false,
  template: `<h1>DialogResultTestComponent</h1>`,
})
class DialogResultTestComponent implements DialogResult<string> {
  portalDialogService = inject(PortalDialogService)

  @Input() dialogResult = ''
}

// This component should be displayed for testing state validation on button click
// It will only allow dialog to be closed if dialogResult === expectedDialogResult
// Each time button is clicked, dialogResult is increased by 1
@Component({
  standalone: false,
  template: `<h1>DialogButtonClickedWithResultComponent</h1>`,
})
class DialogButtonClickedWithResultComponent implements DialogResult<number>, DialogButtonClicked {
  portalDialogService = inject(PortalDialogService)

  @Input() dialogResult = 13
  @Input() returnType: 'boolean' | 'observable' | 'promise' | 'undefined' = 'boolean'
  @Input() expectedDialogResult = 25

  ocxDialogButtonClicked(state: DialogState<number>): boolean | Observable<boolean> | Promise<boolean> | undefined {
    if (state.result !== this.expectedDialogResult) {
      this.dialogResult++
    }

    if (this.returnType === 'boolean') {
      if (state.result === this.expectedDialogResult) {
        return true
      } else {
        return false
      }
    } else if (this.returnType === 'observable') {
      if (state.result === this.expectedDialogResult) {
        return of(true)
      } else {
        return of(false)
      }
    } else if (this.returnType === 'promise') {
      if (state.result === this.expectedDialogResult) {
        return Promise.resolve(true)
      } else {
        return Promise.resolve(false)
      }
    }

    return undefined
  }
}

// This component should be displayed for testing primary button enablement
@Component({
  standalone: false,
  template: `<h1>DialogPrimaryButtonDisabledComponent</h1>`,
})
class DialogPrimaryButtonDisabledComponent implements DialogPrimaryButtonDisabled {
  @Output()
  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
}

// This component should be displayed for testing secondary button enablement
@Component({
  standalone: false,
  template: `<h1>DialogSecondaryButtonDisabledComponent</h1>`,
})
class DialogSecondaryButtonDisabledComponent implements DialogSecondaryButtonDisabled {
  @Output()
  secondaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
}

interface NameAndSurnameObject {
  name: string
  surname: string
}

// This component should be displayed for testing every part of the PortalDialogService feature
@Component({
  standalone: false,
  template: `<div>
    <h1>CompleteDialogComponent</h1>
    @if (!isNameValid) {
      <div class="nameError">Name is not correct</div>
    }
    <label for="name">Name:</label>
    <input id="name" type="text" (change)="onNameChange($event)" />
    <label for="surname">Surname:</label>
    <input id="surname" type="text" (change)="onSurnameChange($event)" />
    @if (message !== undefined) {
      <div class="message">{{ message }}</div>
    }
  </div>`,
})
export class CompleteDialogComponent
  implements
    DialogSecondaryButtonDisabled,
    DialogPrimaryButtonDisabled,
    DialogButtonClicked,
    DialogResult<NameAndSurnameObject>
{
  @Output()
  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
  @Output()
  secondaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()

  dialogResult: NameAndSurnameObject = {
    name: '',
    surname: '',
  }

  isNameValid = false

  message: string | undefined = undefined

  onNameChange(event: any) {
    const newNameValue: string = event.target.value
    this.dialogResult.name = newNameValue
    if (newNameValue.length < 4 || newNameValue.length == 0) {
      this.isNameValid = false
      this.primaryButtonEnabled.emit(false)
    } else {
      this.isNameValid = true
      this.primaryButtonEnabled.emit(true)
    }
  }

  onSurnameChange(event: any) {
    const newSurnameValue: string = event.target.value
    this.dialogResult.surname = newSurnameValue
    if (newSurnameValue === 'Doe') {
      this.secondaryButtonEnabled.emit(true)
    } else {
      this.secondaryButtonEnabled.emit(false)
    }
  }

  ocxDialogButtonClicked(
    state: DialogState<NameAndSurnameObject>
  ): boolean | Observable<boolean> | Promise<boolean> | undefined {
    if (state.button === 'primary') {
      if (state.result?.name == 'John' && state.result.surname === 'Doe') {
        // use message service
        this.message = 'Welcome John'
        this.dialogResult.name = 'Submitted John'
        this.dialogResult.surname = 'Submitted Doe'
        return true
      }
      this.message = 'Wrong credentials'
      return false
    } else {
      this.message = 'Smart but name should be correct too'
      return false
    }
  }
}

describe('PortalDialogService', () => {
  let pDialogService: DialogService
  let rootLoader: HarnessLoader
  let fixture: ComponentFixture<BaseTestComponent>

  const translations = {
    TITLE_TRANSLATE: 'simpleTitle',
    TITLE_TRANSLATE_PARAM: 'translatedTitle {{val}}',
    MESSAGE: 'myMessage',
    MESSAGE_PARAM: 'myMessage {{val}}',
    BUTTON: 'myButton',
    BUTTON_PARAM: 'myButton {{val}}',
  }

  async function closeBasicDialog(button: 'primary' | 'secondary') {
    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    if (button === 'primary') {
      await footerHarness.clickPrimaryButton()
    } else {
      await footerHarness.clickSecondaryButton()
    }
  }

  const removeChildSpy = jest.fn()
  Object.defineProperty(global.document.body, 'removeChild', { value: removeChildSpy })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BaseTestComponent,
        DialogContentComponent,
        DialogFooterComponent,
        DialogMessageContentComponent,
        CompleteDialogComponent,
        DialogButtonClickedWithResultComponent,
        DialogPrimaryButtonDisabledComponent,
        DialogSecondaryButtonDisabledComponent,
        TestWithInputsComponent,
        DialogResultTestComponent,
      ],
      imports: [
        TranslateTestingModule.withTranslations('en', translations),
        DynamicDialogModule,
        CommonModule,
        NoopAnimationsModule,
        ButtonModule,
      ],
      providers: [
        PortalDialogService,
        DialogService,
        provideShellCapabilityServiceMock(),
        provideAppStateServiceMock(),
      ],
    }).compileComponents()
    fixture = TestBed.createComponent(BaseTestComponent)
    pDialogService = TestBed.inject(DialogService)
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture)
    jest.clearAllMocks()
  })

  it('should display dialog with translated title', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('TITLE_TRANSLATE', 'message', 'button1', 'button2')

    expect(pDialogService.open).toHaveBeenCalledWith(
      DialogContentComponent,
      expect.objectContaining({
        header: translations['TITLE_TRANSLATE'],
      })
    )

    closeBasicDialog('primary')
  })

  it('should display dialog with translated title with parameters', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      { key: 'TITLE_TRANSLATE_PARAM', parameters: { val: 'myParam' } },
      'message',
      'button1',
      'button2'
    )

    expect(pDialogService.open).lastCalledWith(
      DialogContentComponent,
      expect.objectContaining({
        header: 'translatedTitle myParam',
      })
    )

    closeBasicDialog('primary')
  })

  it('should display dialog with translated message', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'MESSAGE', 'button1', 'button2')

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const dialogMessageContentHarness = await contentHarness.getDialogMessageContent()
    expect(await dialogMessageContentHarness?.getMessageContent()).toEqual(translations['MESSAGE'])

    closeBasicDialog('primary')
  })

  it('should display dialog with translated message with parameters', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      { key: 'MESSAGE_PARAM', parameters: { val: 'myMsgParam' } },
      'button1',
      'button2'
    )

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const dialogMessageContentHarness = await contentHarness.getDialogMessageContent()
    const message = await dialogMessageContentHarness?.getMessageContent()
    expect(message).toEqual('myMessage myMsgParam')

    closeBasicDialog('primary')
  })

  it('should display dialog with translated buttons', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'BUTTON', 'BUTTON')

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const primaryButtonLabel = await footerHarness.getPrimaryButtonLabel()
    expect(primaryButtonLabel).toBe(translations['BUTTON'])
    const secondaryButtonLabel = await footerHarness.getSecondaryButtonLabel()
    expect(secondaryButtonLabel).toBe(translations['BUTTON'])

    closeBasicDialog('primary')
  })

  it('should display dialog with translated buttons with parameters', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      'message',
      { key: 'BUTTON_PARAM', parameters: { val: 'myButtonParam1' } },
      { key: 'BUTTON_PARAM', parameters: { val: 'myButtonParam2' } }
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const primaryButtonLabel = await footerHarness.getPrimaryButtonLabel()
    expect(primaryButtonLabel).toBe('myButton myButtonParam1')
    const secondaryButtonLabel = await footerHarness.getSecondaryButtonLabel()
    expect(secondaryButtonLabel).toBe('myButton myButtonParam2')

    closeBasicDialog('primary')
  })

  it('should display dialog with translated buttons with icons', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      'message',
      { key: 'BUTTON', icon: PrimeIcons.TIMES },
      { key: 'BUTTON', icon: PrimeIcons.TRASH }
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const primaryButtonLabel = await footerHarness.getPrimaryButtonLabel()
    const primaryButtonIcon = await footerHarness.getPrimaryButtonIcon()
    expect(primaryButtonLabel).toBe(translations['BUTTON'])
    expect(primaryButtonIcon).toBe(PrimeIcons.TIMES)

    const secondaryButtonLabel = await footerHarness.getSecondaryButtonLabel()
    const secondaryButtonIcon = await footerHarness.getSecondaryButtonIcon()
    expect(secondaryButtonLabel).toBe(translations['BUTTON'])
    expect(secondaryButtonIcon).toBe(PrimeIcons.TRASH)

    closeBasicDialog('primary')
  })

  it('should display dialog with message and icon if DialogMessage provided as string and icon', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', { message: 'MESSAGE', icon: PrimeIcons.TIMES }, 'button1', 'button2')

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const dialogMessageContentHarness = await contentHarness.getDialogMessageContent()
    const message = await dialogMessageContentHarness?.getMessageContent()
    expect(message).toEqual(translations['MESSAGE'])
    const icon = await dialogMessageContentHarness?.getIconValue()
    expect(icon).toContain(PrimeIcons.TIMES)

    closeBasicDialog('primary')
  })

  it('should display dialog with message and icon if DialogMessage provided as TranslationKey and icon', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      { message: { key: 'MESSAGE_PARAM', parameters: { val: 'dialogMessageParam' } }, icon: PrimeIcons.TIMES },
      'button1',
      'button2'
    )

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const dialogMessageContentHarness = await contentHarness.getDialogMessageContent()
    const message = await dialogMessageContentHarness?.getMessageContent()
    expect(message).toEqual('myMessage dialogMessageParam')
    const icon = await dialogMessageContentHarness?.getIconValue()
    expect(icon).toContain(PrimeIcons.TIMES)

    closeBasicDialog('primary')
  })

  it('should display dialog with custom component if provided', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', TestWithInputsComponent, 'button1', 'button2')

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const headerDiv = await contentHarness.getHarness(DivHarness.with({ class: 'testHeader' }))
    const headerValue = await headerDiv.getText()
    expect(headerValue).toEqual('header')

    closeBasicDialog('primary')
  })

  it('should display dialog with custom component and inputs if provided', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: TestWithInputsComponent,
        inputs: {
          header: 'myCustomHeader',
        },
      },
      'button1',
      'button2'
    )

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const headerDiv = await contentHarness.getHarness(DivHarness.with({ class: 'testHeader' }))
    const headerValue = await headerDiv.getText()
    expect(headerValue).toEqual('myCustomHeader')

    closeBasicDialog('primary')
  })

  it('should display dialog with single button if secondary not provided', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1')

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const primaryButtonLabel = await footerHarness.getPrimaryButtonLabel()
    expect(primaryButtonLabel).toBe('button1')
    const secondaryButtonLabel = await footerHarness.getSecondaryButtonLabel()
    expect(secondaryButtonLabel).toBeUndefined()

    closeBasicDialog('primary')
  })

  it('should display dialog without top close button when one button defined', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1', undefined, true)

    expect(pDialogService.open).toHaveBeenCalledWith(
      DialogContentComponent,
      expect.objectContaining({
        closable: false,
      })
    )

    closeBasicDialog('primary')
  })

  it('should display dialog without top close button when both buttons defined but specified to remove the button', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1', 'button2', false)

    expect(pDialogService.open).toHaveBeenCalledWith(
      DialogContentComponent,
      expect.objectContaining({
        closable: false,
      })
    )

    closeBasicDialog('primary')
  })

  it('should display dialog with top close button when both buttons defined and enabled', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1', 'button2', true)

    expect(pDialogService.open).toHaveBeenCalledWith(
      DialogContentComponent,
      expect.objectContaining({
        closable: true,
      })
    )

    closeBasicDialog('primary')
  })

  it('should return dialogState with primary on primaryButton click', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1', 'button2')

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('primary')
    expect(result?.result).toBeUndefined()
  })

  it('should return dialogState with secondary on primaryButton click', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1', 'button2')

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickSecondaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('secondary')
    expect(result?.result).toBeUndefined()
  })

  it('should return dialogState with primary and dialogResult on primaryButton click when component implements DialogResult<T>', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      { type: DialogResultTestComponent, inputs: { dialogResult: 'resultAssignedLater' } },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('primary')
    expect(result?.result).toBe('resultAssignedLater')
  })

  it('should not close dialog when ocxDialogButtonClicked returns false', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'boolean',
          dialogResult: 1,
          expectedDialogResult: 2,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeUndefined()

    // Close dialog
    await footerHarness.clickPrimaryButton()
    const finalResult = fixture.componentInstance.resultFromShow
    expect(finalResult).toBeDefined()
  })

  it('should close dialog when ocxDialogButtonClicked returns true', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'boolean',
          dialogResult: 1,
          expectedDialogResult: 1,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('primary')
    expect(result?.result).toBe(1)
  })

  it('should not close dialog when ocxDialogButtonClicked returns Observable of false', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'observable',
          dialogResult: 1,
          expectedDialogResult: 2,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeUndefined()

    // Close dialog
    await footerHarness.clickPrimaryButton()
    const finalResult = fixture.componentInstance.resultFromShow
    expect(finalResult).toBeDefined()
  })

  it('should close dialog when ocxDialogButtonClicked returns Observable of true', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'observable',
          dialogResult: 4,
          expectedDialogResult: 4,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('primary')
    expect(result?.result).toBe(4)
  })

  it('should not close dialog when ocxDialogButtonClicked returns Promise of false', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'promise',
          dialogResult: 1,
          expectedDialogResult: 2,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeUndefined()

    // Close dialog
    await footerHarness.clickPrimaryButton()
    const finalResult = fixture.componentInstance.resultFromShow
    expect(finalResult).toBeDefined()
  })

  it('should close dialog when ocxDialogButtonClicked returns Promise of true', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'promise',
          dialogResult: 10,
          expectedDialogResult: 10,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('primary')
    expect(result?.result).toBe(10)
  })

  it('should close dialog when ocxDialogButtonClicked returns undefined', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'undefined',
          dialogResult: 13,
          expectedDialogResult: 10,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result?.button).toBe('primary')
    // 14 because dialogResult is increased on each button click
    expect(result?.result).toBe(14)
  })

  it('should disable primary button when component implements DialogPrimaryButtonDisabled interface', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogPrimaryButtonDisabledComponent,
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const isPrimaryButtonDisabled = await footerHarness.getPrimaryButtonDisabled()
    expect(isPrimaryButtonDisabled).toBeTruthy()

    closeBasicDialog('secondary')
  })

  it('should disable secondary button when component implements DialogSecondaryButtonDisabled interface', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogSecondaryButtonDisabledComponent,
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const isSecondaryButtonDisabled = await footerHarness.getSecondaryButtonDisabled()
    expect(isSecondaryButtonDisabled).toBeTruthy()

    closeBasicDialog('primary')
  })

  it('should react to complex component behavior and return when it decides', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.showWithType()

    // init state
    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    let isPrimaryButtonDisabled = await footerHarness.getPrimaryButtonDisabled()
    expect(isPrimaryButtonDisabled).toBeTruthy()
    let isSecondaryButtonDisabled = await footerHarness.getSecondaryButtonDisabled()
    expect(isSecondaryButtonDisabled).toBeTruthy()
    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    let nameErrorDiv = await contentHarness.getHarnessOrNull(DivHarness.with({ class: 'nameError' }))
    const nameErrorDivText = await nameErrorDiv?.getText()
    expect(nameErrorDivText).toBe('Name is not correct')

    // change surname input to Doe
    const surnameInput = await contentHarness.getHarness(InputHarness.with({ id: 'surname' }))
    await surnameInput.setValue('Doe')
    await (await surnameInput.getTestElement()).dispatchEvent('change')

    const surnameValue = await surnameInput.getValue()
    expect(surnameValue).toBe('Doe')

    isPrimaryButtonDisabled = await footerHarness.getPrimaryButtonDisabled()
    expect(isPrimaryButtonDisabled).toBeTruthy()
    isSecondaryButtonDisabled = await footerHarness.getSecondaryButtonDisabled()
    expect(isSecondaryButtonDisabled).toBeFalsy()

    // click secondary button
    await footerHarness.clickSecondaryButton()

    const messageDiv = await contentHarness.getHarness(DivHarness.with({ class: 'message' }))
    let messageText = await messageDiv.getText()
    expect(messageText).toBe('Smart but name should be correct too')

    // change name input to Albert
    const nameInput = await contentHarness.getHarness(InputHarness.with({ id: 'name' }))
    await nameInput.setValue('Albert')
    await (await nameInput.getTestElement()).dispatchEvent('change')

    let nameValue = await nameInput.getValue()
    expect(nameValue).toBe('Albert')
    nameErrorDiv = await contentHarness.getHarnessOrNull(DivHarness.with({ class: 'nameError' }))
    expect(nameErrorDiv).toBeNull()

    isPrimaryButtonDisabled = await footerHarness.getPrimaryButtonDisabled()
    expect(isPrimaryButtonDisabled).toBeFalsy()
    isSecondaryButtonDisabled = await footerHarness.getSecondaryButtonDisabled()
    expect(isSecondaryButtonDisabled).toBeFalsy()

    // click primary button
    await footerHarness.clickPrimaryButton()

    messageText = await messageDiv.getText()
    expect(messageText).toBe('Wrong credentials')

    //change name input to John
    await nameInput.setValue('John')
    await (await nameInput.getTestElement()).dispatchEvent('change')

    nameValue = await nameInput.getValue()
    expect(nameValue).toBe('John')

    isPrimaryButtonDisabled = await footerHarness.getPrimaryButtonDisabled()
    expect(isPrimaryButtonDisabled).toBeFalsy()
    isSecondaryButtonDisabled = await footerHarness.getSecondaryButtonDisabled()
    expect(isSecondaryButtonDisabled).toBeFalsy()

    // click primary button
    await footerHarness.clickPrimaryButton()

    // expect dialog to close with observable containing last state
    const result = fixture.componentInstance.resultFromShow
    expect(result?.button).toBe('primary')
    expect(result?.result).toEqual({
      name: 'Submitted John',
      surname: 'Submitted Doe',
    })
    expect(fixture.componentInstance.nameResult).toBe('Submitted John')
    expect(fixture.componentInstance.surnameResult).toBe('Submitted Doe')
  })

  it('should close dialog and remove it from html on destroy', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      { key: 'MESSAGE_PARAM', parameters: { val: 'myMsgParam' } },
      'button1',
      'button2'
    )

    const dialogService = TestBed.inject(DialogService)
    expect(dialogService.dialogComponentRefMap.size).toBe(1)
    const dialogRef = dialogService.dialogComponentRefMap.keys().next().value as DynamicDialogRef
    expect(dialogRef).toBeDefined()
    const dialogRefSpy = jest.spyOn(dialogRef, 'close')

    const dialogElement = dialogService.getInstance(dialogRef).el.nativeElement

    fixture.detectChanges()

    fixture.componentInstance.portalDialogService.ngOnDestroy()
    expect(dialogRefSpy).toHaveBeenCalledTimes(1)
    expect(removeChildSpy).toHaveBeenCalledWith(dialogElement)
  })
})


```

### File: angular-accelerator/src/lib/services/portal-dialog.service.ts

```ts

import { EventEmitter, Injectable, OnDestroy, Type, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DialogService, DynamicDialogComponent } from 'primeng/dynamicdialog'
import { Observable, filter, mergeMap } from 'rxjs'

import { ButtonDialogButtonDetails, ButtonDialogCustomButtonDetails, ButtonDialogData } from '../model/button-dialog'
import { NavigationStart, Router } from '@angular/router'
import {
  SKIP_STYLE_SCOPING,
  dataNoPortalLayoutStylesKey,
  dataStyleIdKey,
  getScopeIdentifier,
} from '@onecx/angular-utils'
import { REMOTE_COMPONENT_CONFIG } from '@onecx/angular-remote-components'
import { CurrentLocationTopicPayload, EventsTopic, EventType, TopicEventType } from '@onecx/integration-interface'
import { Capability, ShellCapabilityService, AppStateService } from '@onecx/angular-integration-interface'
import { PrimeIcon } from '../utils/primeicon.utils'
import { DialogContentComponent } from '../components/dialog/dialog-content/dialog-content.component'
import { DialogFooterComponent } from '../components/dialog/dialog-footer/dialog-footer.component'
import { DialogMessageContentComponent } from '../components/dialog/dialog-message-content/dialog-message-content.component'
import { TranslationKey, TranslationKeyWithParameters } from '../model/translation.model'

/**
 * Object containing message of type {@link TranslationKey} and icon to be displayed along the message.
 *
 * @example
 * DialogMessage with TranslationKey will display 'text with parameter value = hello' and question mark icon
 *
 * ## Assume such translation is in the translation file
 * ```
 * const translations = {
 *   MY_KEY = 'text with parameter value = {{value}}',
 * }
 * ```
 *
 * ## DialogMessage declaration
 * ```
 * const myDialogMessage: DialogMessage = {
 *   message: {
 *     key: 'MY_KEY',
 *     parameters: {
 *       value = 'hello',
 *     },
 *   },
 *   icon: PrimeIcons.QUESTION
 * }
 * ```
 */
type DialogMessage = { message: TranslationKey; icon: PrimeIcon }

/**
 * Implement via component class to be displayed by {@link PortalDialogService.openDialog}
 *
 * Use if you want {@link PortalDialogService.openDialog} to return state of displayed component's current dialogResult value alongside the clicked button.
 *
 * @example
 * Display component implementing DialogResult<string> and react on the returned value
 *
 * ## Component declaration
 * ```
 * â£@Component({template: `<div>
 * <input (change)="onInputChange($event)">
 * </div>`})
 * export class MyInputComponent implements DialogResult<string> {
 *   dialogResult: string = ''
 *
 *   onInputChange(event: any) {
 *     this.dialogResult = event.target.value
 *   }
 * }
 * ```
 *
 * ## PortalDialogService call
 * ```
 * portalDialogService.openDialog(title, { type: MyInputComponent }, primaryButton, ...).subscribe((result: DialogState<string>) => {
 * // result.value === MyInputComponent.dialogResult (during button click)
 * // behavior when dialog closes
 * })
 * ```
 *
 */
export interface DialogResult<T> {
  dialogResult: T
}
/**
 * Implement via component class to be displayed by {@link PortalDialogService.openDialog}
 *
 * Use to control the state of the primary button (disabled or enabled). Whenever your component wants to disable/enable primary button it should emit boolean equal to whether primary button should be enabled.
 *
 * If you implement this interface then primary button will be disabled until the emitter emits true
 */
export interface DialogPrimaryButtonDisabled {
  primaryButtonEnabled: EventEmitter<boolean>
}
/**
 * Implement via component class to be displayed by {@link PortalDialogService.openDialog}
 *
 * Use to control the state of the secondary button (disabled or enabled). Whenever your component wants to disable/enable secondary button it should emit boolean equal to whether secondary button should be enabled.
 *
 * If you implement this interface then secondary button will be disabled until the emitter emits true
 */
export interface DialogSecondaryButtonDisabled {
  secondaryButtonEnabled: EventEmitter<boolean>
}

/**
 * Implement via component class to be displayed by {@link PortalDialogService.openDialog}
 *
 * Use to control the state of custom buttons (disabled or enabled). Whenever your component wants to disable/enable any custom button it should emit an object indicating which button should be disabled/enabled. This object should contain id property (string) related to previously defined button and enabled property (boolean) equal to whether custom button should be enabled.
 *
 * If you implement this interface then all custom buttons will be disabled until the emitter emits true
 */
export interface DialogCustomButtonsDisabled {
  customButtonEnabled: EventEmitter<{ id: string; enabled: boolean }>
}
/**
 * Implement via component class to be displayed by {@link PortalDialogService.openDialog}
 *
 * Use to add behavior on button clicks. {@link DialogButtonClicked.ocxDialogButtonClicked} method will be called everytime any button is clicked and should return boolean value (or Observable<boolean> or Promise<boolean>) equal to whether dialog should be closed or not.
 *
 * {@link DialogButtonClicked.ocxDialogButtonClicked} will recieve object containing component's state captured on button click. It will have button property with value 'primary' or 'secondary' which determines which button was clicked.
 *
 * It will also have result property which by default will be undefined, however if you want to add any properties to the state please combine this interface with {@link DialogResult}. That way result will be equal to component's dialogResult property captured on button click.
 *
 * @example
 * Display component implementing DialogResult<string> and DialogButtonClicked which should not close dialog on clear click but should close when send clicked and api call was sucessful
 *
 * ## Component declaration
 * ```
 * â£@Component({template: `<div>
 * <input (change)="onInputChange($event)">
 * </div>`})
 * export class MyInputComponent implements DialogResult<string>, DialogButtonClicked {
 *   dialogResult: string = ''
 *
 *   onInputChange(event: any) {
 *     this.dialogResult = event.target.value
 *   }
 *
 *   ocxDialogButtonClicked(state: DialogState<string>) {
 *     // here you can do any operations you desire
 *     // such as form validation
 *     // api calls and so on
 *     if (state.button === 'primary') {
 *       // send form data to server
 *       this.apiService.postInput(state.result, ...).pipe(
 *         // map response to boolean meaning if call was successfull
 *       )
 *       return true // if dialog should be closed return true
 *     } else {
 *       // clear input
 *       return false // don't want to close the dialog, only to clear it
 *     }
 *   }
 * }
 * ```
 *
 * ## PortalDialogService call
 * ```
 * portalDialogService.openDialog(title, { type: MyInputComponent }, "Send", "Clear").subscribe((result: DialogState<string>) => {
 * // behavior to be fired when dialog closes
 * })
 * ```
 */
export interface DialogButtonClicked<T = unknown> {
  ocxDialogButtonClicked(state: DialogState<T>): Observable<boolean> | Promise<boolean> | boolean | undefined | void
}

/**
 * Object containing component type to be displayed and inputs to populate the component.
 *
 * @example
 *
 * ```
 * â£@Component({template: `<h1>{{content}}</h1>`})
 * export class MyComponent {
 *   â£@Input() content: string = ''
 * }
 * const myComponent = {
 *   type: MyComponent,
 *   inputs: {
 *     content: 'My header content',
 *   },
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
type Component<T extends unknown> = unknown extends T
  ? {
      type: Type<any>
      inputs?: Record<string, unknown>
    }
  : {
      type: Type<DialogResult<T>>
      inputs?: Record<string, unknown>
    }

export type DialogButton = 'primary' | 'secondary' | 'custom'
export type DialogStateButtonClicked = 'primary' | 'secondary' | 'custom'

/**
 * Object containing information about clicked button ('primary' or 'secondary') and displayed component state captured on button click (only if component implements {@link DialogResult} interface)
 */
export type DialogState<T> = {
  button: DialogStateButtonClicked
  result: T | undefined
  id?: string
}

export type PortalDialogConfig = {
  showXButton?: boolean
  customButtons?: ButtonDialogCustomButtonDetails[]
  autoFocusButton?: DialogButton
  autoFocusButtonCustomId?: string
  ariaLabelledBy?: string
  width?: string
  height?: string
  closeOnEscape?: boolean
  focusOnShow?: boolean
  focusTrap?: boolean
  baseZIndex?: number
  autoZIndex?: boolean
  dismissableMask?: boolean
  showHeader?: boolean
  modal?: boolean
  resizable?: boolean
  draggable?: boolean
  keepInViewport?: boolean
  minX?: number
  minY?: number
  maximizable?: boolean
  maximizeIcon?: string
  minimizeIcon?: string
  position?: string
  closeAriaLabel?: string
}

export interface PortalDialogServiceData {
  primaryButtonEnabled$: EventEmitter<boolean>
  secondaryButtonEnabled$: EventEmitter<boolean>
  customButtonEnabled$: EventEmitter<{ id: string; enabled: boolean }>
  buttonClicked$: EventEmitter<DialogState<unknown>>
}

@Injectable({ providedIn: 'any' })
export class PortalDialogService implements OnDestroy {
  private dialogService = inject(DialogService)
  private translateService = inject(TranslateService)
  private router = inject(Router)
  private _eventsTopic$: EventsTopic | undefined
  get eventsTopic() {
    this._eventsTopic$ ??= new EventsTopic()
    return this._eventsTopic$
  }
  set eventsTopic(source: EventsTopic) {
    this._eventsTopic$ = source
  }
  private skipStyleScoping = inject(SKIP_STYLE_SCOPING, { optional: true })
  private remoteComponentConfig = inject(REMOTE_COMPONENT_CONFIG, { optional: true })
  private appStateService = inject(AppStateService)
  private capabilityService = inject(ShellCapabilityService)

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.cleanupAndCloseDialog()
      }
    })
    let observable: Observable<TopicEventType | CurrentLocationTopicPayload> =
      this.appStateService.currentLocation$.asObservable()
    if (!this.capabilityService.hasCapability(Capability.CURRENT_LOCATION_TOPIC)) {
      observable = this.eventsTopic.pipe(filter((e) => e.type === EventType.NAVIGATED))
    }
    observable.subscribe(() => {
      this.cleanupAndCloseDialog()
    })
  }

  ngOnDestroy(): void {
    this.cleanupAndCloseDialog()
    this._eventsTopic$?.destroy()
  }

  /**
   * Opens dialog with a component or message to display and one or two buttons. This method allows you to customize the dialog using parameters and by implementic specific interfaces via component to be displayed. The dialog is only shown if if you subscribe to this function.
   *
   * Displaying component inisde the dialog can be achieved by providing the component class with optional inputs. By default the component will be shown without any interaction with the dialog, however you can implement the following interfaces by your component class to allow for some interactions:
   * - {@link DialogResult} - dialog state will contain dialogResult property
   *
   * - {@link DialogButtonClicked} - on button click ocxDialogButtonClicked function will be called with dialog state as a parameter. You should return true if you want dialog to be close or false if not and add any operations on your component.
   *
   * - {@link DialogPrimaryButtonDisabled} - dialog will use the EventEmitter to determine if the primary button should be disabled
   *
   * - {@link DialogSecondaryButtonDisabled} - dialog will use the EventEmitter to determine if the secondary button should be disabled
   *
   * - {@link DialogCustomButtonsDisabled} - dialog will use the EventEmitter to determine if the custom buttons should be disabled
   *
   * @param title Translation key for dialog title
   * @param componentOrMessage Either a component or a translation key of a message with optional parameters and icon to be displayed next to the message
   * @param primaryButtonTranslationKeyOrDetails Translation key with optional parameters and icon to be displayed next to the text of the button
   * @param secondaryButtonTranslationKeyOrDetails Translation key with optional parameters and icon to be displayed next to the text of the button
   * @param extras Configuration object allowing for customization of the dialog behavior and visual aspects
   * @returns Observable containing dialog state on close
   *
   *
   * @example
   * Display dialog with message and two buttons using translation keys
   *
   * ```
   * // assume 'TITLE_KEY', 'WELCOME_MESSAGE', 'OK_BUTTON' and 'REFRESH_BUTTON' are translation keys
   * this.portalDialogService.openDialog('TITLE_KEY', 'WELCOME_MESSAGE', 'OK_BUTTON', 'REFRESH_BUTTON').subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * Display dialog message with icon and single button
   *
   * ```
   * // Welcome message with question mark icon
   * const dialogMessage = {
   *   key: 'WELCOME_MESSAGE',
   *   icon: PrimeIcons.QUESTION
   * }
   * this.portalDialogService.openDialog('TITLE_KEY', dialogMessage, 'OK_BUTTON').subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * Display dialog message with two customized buttons
   *
   * ```
   * // Ok button with check icon
   * const primaryButton = {
   *   key: 'OK_BUTTON',
   *   icon: PrimeIcons.CHECK
   *   tooltipKey: 'OK_TOOLTIP',
   *   tooltipPosition: 'bottom'
   * }
   *
   * // Refresh button with refresh icon
   * const secondaryButton = {
   *   key: 'REFRESH_BUTTON',
   *   icon: PrimeIcons.REFRESH
   *   tooltipKey: 'REFRESH_TOOLTIP',
   *   tooltipPosition: 'right'
   * }
   *
   * this.portalDialogService.openDialog('TITLE_KEY', 'WELCOME_MESSAGE', primaryButton, secondaryButton).subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * Display dialog message without X button in top right corner
   *
   * ```
   * this.portalDialogService.openDialog('TITLE_KEY', 'WELCOME_MESSAGE', 'OK_BUTTON', 'REFRESH_BUTTON', false).subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * React on dialog closing
   *
   * ```
   * this.portalDialogService.openDialog('TITLE_KEY', 'WELCOME_MESSAGE', 'OK_BUTTON', 'REFRESH_BUTTON').subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * Display dialog with component
   *
   * ## Component declaration
   * ```
   * â£@Component({template: `<div>
   * <h1>{{header | translate}}</h1>
   * <input (change)="onInputChange($event)">
   * </div>`})
   * export class MyInputComponent implements DialogResult<string>,  DialogButtonClicked, DialogPrimaryButtonDisabled, DialogSecondaryButtonDisabled {
   *   â£@Input() header: string = ''
   *   // change value to manipulate component state visible by dialog
   *   dialogResult: string = ''
   *   // emit true/false to disable primary button
   *   â£@Output() primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
   *   // emit true/false to disable secondary button
   *   â£@Output() secondaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
   *
   *   // implement operations to be done on button clicks and return if the dialog should be closed
   *   ocxDialogButtonClicked(state: DialogState<string>) {
   *     return true
   *   }
   *
   *   onInputChange(event: any) {
   *     this.dialogResult = event.target.value
   *   }
   * }
   * ```
   *
   * ## PortalDialogService call
   * ```
   * const myComponent = {
   *   type: MyInputComponent,
   *   inputs: {
   *     header: 'DIALOG_HEADER'
   *   }
   * }
   * this.portalDialogService.openDialog('TITLE_KEY', myComponent, 'OK_BUTTON', 'REFRESH_BUTTON').subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * Display dialog with component without passing inputs
   *
   * ## PortalDialogService call
   * ```
   * this.portalDialogService.openDialog('TITLE_KEY', MyInputComponent, 'OK_BUTTON', 'REFRESH_BUTTON').subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   */
  openDialog<T>(
    title: TranslationKey | null,
    componentOrMessage: Type<any> | Type<DialogResult<T>> | Component<T> | TranslationKey | DialogMessage,
    primaryButtonTranslationKeyOrDetails: TranslationKey | ButtonDialogButtonDetails,
    secondaryButtonTranslationKeyOrDetails?: TranslationKey | ButtonDialogButtonDetails,
    extras?: PortalDialogConfig
  ): Observable<DialogState<T>>
  openDialog<T>(
    title: TranslationKey | null,
    componentOrMessage: Type<any> | Type<DialogResult<T>> | Component<T> | TranslationKey | DialogMessage,
    primaryButtonTranslationKeyOrDetails: TranslationKey | ButtonDialogButtonDetails,
    secondaryButtonTranslationKeyOrDetails?: TranslationKey | ButtonDialogButtonDetails,
    extrasOrShowXButton: PortalDialogConfig | boolean = {}
  ): Observable<DialogState<T>> {
    const dialogOptions: PortalDialogConfig =
      typeof extrasOrShowXButton === 'object'
        ? extrasOrShowXButton
        : {
            showXButton: extrasOrShowXButton,
          }
    const translateParams = this.prepareTitleForTranslation(title)

    const componentToRender: Component<any> = this.getComponentToRender(componentOrMessage)
    const dynamicDialogDataConfig: ButtonDialogData = {
      component: componentToRender.type as Type<any>,
      config: {
        primaryButtonDetails: this.buttonDetailsOrTranslationKey(primaryButtonTranslationKeyOrDetails),
        secondaryButtonIncluded: secondaryButtonTranslationKeyOrDetails !== undefined,
        secondaryButtonDetails: this.buttonDetailsOrTranslationKey(secondaryButtonTranslationKeyOrDetails),
        customButtons: dialogOptions.customButtons?.map(
          (button) => this.buttonDetailsOrTranslationKey(button) as ButtonDialogCustomButtonDetails
        ),
        autoFocusButton: dialogOptions.autoFocusButton,
        autoFocusButtonCustomId: dialogOptions.autoFocusButtonCustomId,
      },
      componentData: componentToRender.inputs,
    }

    return this.translateService.get(translateParams.key, translateParams.parameters).pipe(
      mergeMap((dialogTitle) => {
        const dialogRef = this.dialogService.open(DialogContentComponent, {
          header: dialogTitle,
          data: {
            ...dynamicDialogDataConfig,
            portalDialogServiceData: {
              primaryButtonEnabled$: new EventEmitter(),
              secondaryButtonEnabled$: new EventEmitter(),
              customButtonEnabled$: new EventEmitter(),
              buttonClicked$: new EventEmitter(),
            } satisfies PortalDialogServiceData,
          },
          closable: dialogOptions.showXButton && secondaryButtonTranslationKeyOrDetails !== undefined,
          modal: true,
          ...dialogOptions,
          focusOnShow: false,
          appendTo: 'body', // Important for the function findBodyChild
          duplicate: true, // Since dialog always opens DialogContentComponent, duplicates must be always allowed
          templates: {
            footer: DialogFooterComponent,
          },
        })
        this.setScopeIdentifier(this.dialogService.getInstance(dialogRef))
        return dialogRef.onClose
      })
    )
  }

  private cleanupAndCloseDialog() {
    if (this.dialogService.dialogComponentRefMap.size > 0) {
      this.dialogService.dialogComponentRefMap.forEach((_, dialogRef) => {
        const dialogComponent = this.dialogService.getInstance(dialogRef)
        dialogRef.close()
        this.removeDialogFromHtml(dialogComponent)
      })
    }
  }

  private removeDialogFromHtml(dialogComponent: DynamicDialogComponent) {
    const bodyChild = this.findDialogComponentBodyChild(dialogComponent)
    bodyChild && document.body.removeChild(bodyChild)
  }

  private setScopeIdentifier(dialogComponent: DynamicDialogComponent) {
    getScopeIdentifier(
      this.appStateService,
      this.skipStyleScoping ?? undefined,
      this.remoteComponentConfig ?? undefined
    ).then((scopeId) => {
      const bodyChild = this.findDialogComponentBodyChild(dialogComponent)
      if (bodyChild) {
        bodyChild.dataset[dataStyleIdKey] = scopeId
        bodyChild.dataset[dataNoPortalLayoutStylesKey] = ''
      }
    })
  }

  private findDialogComponentBodyChild(dialogComponent: DynamicDialogComponent) {
    const element = dialogComponent.el.nativeElement
    if (!element) return
    return this.findBodyChild(element)
  }

  private findBodyChild(element: HTMLElement) {
    let currentNode = element
    while (currentNode.parentElement && currentNode.parentElement != document.body) {
      currentNode = currentNode.parentElement
    }
    return currentNode.parentElement === document.body ? currentNode : undefined
  }

  private prepareTitleForTranslation(title: TranslationKey | null): TranslationKeyWithParameters {
    if (!title) return { key: '', parameters: {} }
    if (this.isString(title)) return { key: title, parameters: {} }
    return title
  }

  private buttonDetailsOrTranslationKey(
    buttonTranslationKeyOrDetails:
      | TranslationKey
      | ButtonDialogButtonDetails
      | ButtonDialogCustomButtonDetails
      | undefined
  ): ButtonDialogButtonDetails | ButtonDialogCustomButtonDetails | undefined {
    if (buttonTranslationKeyOrDetails === undefined) {
      return undefined
    }

    let buttonDetails

    if (this.isString(buttonTranslationKeyOrDetails)) {
      buttonDetails = {
        key: buttonTranslationKeyOrDetails,
      }
    } else {
      buttonDetails = buttonTranslationKeyOrDetails
    }

    return buttonDetails
  }

  private getComponentToRender(
    componentOrMessage: Type<any> | Type<DialogResult<any>> | Component<any> | TranslationKey | DialogMessage
  ): Component<any> {
    if (this.isTranslationKey(componentOrMessage)) {
      return {
        type: DialogMessageContentComponent,
        inputs: {
          message: this.isString(componentOrMessage) ? componentOrMessage : componentOrMessage.key,
          messageParameters: this.isString(componentOrMessage) ? {} : componentOrMessage.parameters,
        },
      }
    } else if (this.isDialogMessage(componentOrMessage)) {
      return {
        type: DialogMessageContentComponent,
        inputs: {
          message: this.isString(componentOrMessage.message)
            ? componentOrMessage.message
            : componentOrMessage.message.key,
          icon: componentOrMessage.icon,
          messageParameters: this.isString(componentOrMessage.message) ? {} : componentOrMessage.message.parameters,
        },
      }
    } else if (this.isType(componentOrMessage)) {
      return {
        type: componentOrMessage,
      }
    }
    return componentOrMessage
  }

  private isTranslationKey(obj: any): obj is TranslationKey {
    return this.isString(obj) || ('key' in obj && 'parameters' in obj)
  }

  private isString(obj: any): obj is string {
    return typeof obj === 'string' || obj instanceof String
  }

  private isDialogMessage(obj: any): obj is DialogMessage {
    return 'message' in obj && 'icon' in obj
  }

  private isType(obj: any): obj is Type<any> {
    return obj instanceof Type
  }
}

export function providePortalDialogService() {
  return [DialogService, PortalDialogService]
}


```

### File: angular-accelerator/src/lib/services/portal-dialog-service.stories.ts

```ts

import { Component, EventEmitter, Input, OnInit, importProvidersFrom, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, applicationConfig, argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular'
import { PrimeIcons } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { TooltipModule } from 'primeng/tooltip'
import { Observable } from 'rxjs'
import { DialogMessageContentComponent } from '../components/dialog/dialog-message-content/dialog-message-content.component'
import { DialogContentComponent } from '../components/dialog/dialog-content/dialog-content.component'
import { DialogFooterComponent } from '../components/dialog/dialog-footer/dialog-footer.component'
import { StorybookTranslateModule } from '../storybook-translate.module'
import {
  DialogButtonClicked,
  DialogCustomButtonsDisabled,
  DialogPrimaryButtonDisabled,
  DialogResult,
  DialogSecondaryButtonDisabled,
  DialogState,
  PortalDialogService,
} from './portal-dialog.service'
import { StorybookThemeModule } from '../storybook-theme.module'

@Component({
  standalone: false,
  selector: 'ocx-button-dialog-with-portal-dialog-service',
  template: `<p-button label="Open dialog" (click)="openDialog()" />`,
})
class ButtonDialogWithPortalDialogServiceComponent {
  private portalDialogService = inject(PortalDialogService)

  @Input() title = 'Title'
  @Input() messageOrComponent = 'Message'
  @Input() primaryKey = 'Primary'
  @Input() secondaryKey = 'Secondary'
  @Input() extras = {}

  openDialog() {
    this.portalDialogService
      .openDialog(this.title, this.messageOrComponent, this.primaryKey, this.secondaryKey, this.extras)
      .subscribe(() => {
        console.log('dialog closed')
      })
  }
}

@Component({
  standalone: false,
  selector: 'ocx-my-component-to-display',
  template: `<p>Component to display with disabled buttons</p>
    <div class="flex gap-2">
      <p-button label="Toggle custom button" (click)="clickCustom()" />
      <p-button label="Toggle secondary button" (click)="click2()" />
      <p-button label="Toggle primary button" (click)="click1()" />
    </div>`,
})
class WithDisabledButtonsComponent
  implements DialogPrimaryButtonDisabled, DialogSecondaryButtonDisabled, DialogCustomButtonsDisabled
{
  secondaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
  customButtonEnabled: EventEmitter<{ id: string; enabled: boolean }> = new EventEmitter()

  primaryState = false
  secondaryState = false
  customState = false

  click1() {
    this.primaryState = !this.primaryState
    this.primaryButtonEnabled.emit(this.primaryState)
  }
  click2() {
    this.secondaryState = !this.secondaryState
    this.secondaryButtonEnabled.emit(this.secondaryState)
  }
  clickCustom() {
    this.customState = !this.customState
    this.customButtonEnabled.emit({
      id: 'custom1',
      enabled: this.customState,
    })
  }
}

export default {
  title: 'Components/PortalDialogService',
  component: ButtonDialogWithPortalDialogServiceComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        DynamicDialogConfig,
        DynamicDialogRef,
        PortalDialogService,
        DialogService,
        importProvidersFrom(StorybookTranslateModule),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [
        DialogMessageContentComponent,
        DialogFooterComponent,
        DialogContentComponent,
        WithDisabledButtonsComponent,
      ],
      imports: [StorybookTranslateModule, ButtonModule, TooltipModule, FormsModule],
    }),
    componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`),
  ],
} as Meta<ButtonDialogWithPortalDialogServiceComponent>

export const Basic = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
      <ocx-button-dialog-with-portal-dialog-service>
      </ocx-button-dialog-with-portal-dialog-service>
        `,
  }),
  args: {},
}

export const CustomData = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
        </ocx-button-dialog-with-portal-dialog-service>
          `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: 'Custom message',
    primaryKey: 'Primary Button',
    secondaryKey: 'Secondary Button',
    extras: {},
  },
}

export const CustomDataWithExtendedButtons = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
          <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
          </ocx-button-dialog-with-portal-dialog-service>
            `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: 'Custom message',
    primaryKey: {
      key: 'PRIMARY_KEY',
      icon: PrimeIcons.BOOKMARK,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'right',
    },
    secondaryKey: {
      key: 'SECONDARY_KEY',
      icon: PrimeIcons.SEARCH,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'left',
    },
    extras: {},
  },
}

@Component({
  standalone: false,
  selector: 'ocx-my-component-to-display',
  template: `<p>Hello, its my component to display</p>`,
})
class ComponentToDisplayComponent {}

export const ComponentDisplayed = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
            <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
            </ocx-button-dialog-with-portal-dialog-service>
              `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: {
      type: ComponentToDisplayComponent,
    },
    primaryKey: {
      key: 'PRIMARY_KEY',
      icon: PrimeIcons.BOOKMARK,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'right',
    },
    secondaryKey: {
      key: 'SECONDARY_KEY',
      icon: PrimeIcons.SEARCH,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'left',
    },
    extras: {},
  },
}

export const ComponentDisplayedWithDisabledButtons = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
            <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
            </ocx-button-dialog-with-portal-dialog-service>
              `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: {
      type: WithDisabledButtonsComponent,
    },
    primaryKey: {
      key: 'PRIMARY_KEY',
      icon: PrimeIcons.BOOKMARK,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'right',
    },
    secondaryKey: {
      key: 'SECONDARY_KEY',
      icon: PrimeIcons.SEARCH,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'left',
    },
    extras: {
      customButtons: [
        {
          id: 'custom1',
          alignment: 'right',
          key: 'MY_CUSTOM_BUTTON',
        },
      ],
    },
  },
}

@Component({
  standalone: false,
  selector: 'ocx-my-component-to-display',
  template: `<p>Component to display with validation</p>
    <p>It is impossible to close the dialog by clicking secondary button</p>
    <p>Type result to be able to close the dialog via primary button click</p>
    <input type="text" (change)="onInputChange($event)" />`,
})
class WithValidationComponent implements DialogResult<string>, DialogButtonClicked {
  dialogResult = ''

  onInputChange(event: any) {
    const value: string = event.target.value
    this.dialogResult = value
  }

  ocxDialogButtonClicked(
    state: DialogState<unknown>
  ): boolean | void | Observable<boolean> | Promise<boolean> | undefined {
    if (state.button === 'primary' && this.dialogResult === 'result') return true

    return false
  }
}

export const ComponentDisplayedWithValidation = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
            <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
            </ocx-button-dialog-with-portal-dialog-service>
              `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: {
      type: WithValidationComponent,
    },
    primaryKey: {
      key: 'PRIMARY_KEY',
      icon: PrimeIcons.BOOKMARK,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'right',
    },
    secondaryKey: {
      key: 'SECONDARY_KEY',
      icon: PrimeIcons.SEARCH,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'left',
    },
  },
}

export const CustomAutofocus = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
        </ocx-button-dialog-with-portal-dialog-service>
          `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: 'Custom message',
    primaryKey: 'Primary Button',
    secondaryKey: 'Secondary Button',
    extras: {
      autoFocusButton: 'secondary',
    },
  },
}

@Component({
  standalone: false,
  selector: 'ocx-my-component-to-display',
  template: `<p>Hello, its my component to display custom buttons</p>`,
})
class ComponentToDisplayCustomButtonsComponent implements DialogCustomButtonsDisabled, OnInit {
  customButtonEnabled: EventEmitter<{ id: string; enabled: boolean }> = new EventEmitter()
  ngOnInit(): void {
    this.customButtonEnabled.emit({ id: 'custom1', enabled: true })
  }
}

export const CustomButtonsWithAutofocus = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
            <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
            </ocx-button-dialog-with-portal-dialog-service>
              `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: {
      type: ComponentToDisplayCustomButtonsComponent,
    },
    primaryKey: {
      key: 'PRIMARY_KEY',
      icon: PrimeIcons.BOOKMARK,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'right',
    },
    secondaryKey: {
      key: 'SECONDARY_KEY',
      icon: PrimeIcons.SEARCH,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'left',
    },
    extras: {
      customButtons: [
        {
          id: 'custom1',
          alignment: 'right',
          key: 'CUSTOM_KEY',
          icon: 'pi pi-times',
        },
      ],
      autoFocusButton: 'custom',
      autoFocusButtonCustomId: 'custom1',
    },
  },
}


```

## Folder: angular-accelerator/src/lib/utils (15 files)

### File: angular-accelerator/src/lib/utils/colorutils.ts

```ts

export class ColorUtils {
  public static calculatePoint(
    i: number,
    intervalSize: number,
    colorRangeInfo: { colorStart: any; colorEnd: any; useEndAsStart: any }
  ): any {
    const { colorStart, colorEnd, useEndAsStart } = colorRangeInfo
    return useEndAsStart ? colorEnd - i * intervalSize : colorStart + i * intervalSize
  }

  public static interpolateColors(
    dataLength: number,
    colorScale: (arg0: any) => any,
    colorRangeInfo: { colorStart: any; colorEnd: any; useEndAsStart: any }
  ): any {
    const { colorStart, colorEnd } = colorRangeInfo
    const colorRange = colorEnd - colorStart
    const intervalSize = colorRange / dataLength
    let i, colorPoint
    const colorArray = []

    for (i = 0; i < dataLength; i++) {
      colorPoint = this.calculatePoint(i, intervalSize, colorRangeInfo)
      colorArray.push(colorScale(colorPoint))
    }

    return colorArray
  }
}


```

### File: angular-accelerator/src/lib/utils/criteria.utils.ts

```ts

import { QueryList } from '@angular/core'
import { getUTCDateWithoutTimezoneIssues, isValidDate } from '@onecx/accelerator'
import { DatePicker } from 'primeng/datepicker'

export type hasShowTimeFunction = (key: string) => boolean
/**
 * removeNullValues: whether to remove entries from the search criteria where the value is null
 */
export interface BuildSearchCriteriaParameters {
  removeNullValues: boolean
}

function _hasShowTime(datePickers: QueryList<DatePicker>, formKey: string): boolean {
  return (
    datePickers.find((d) => {
      return d.name === formKey
    })?.showTime === true
  )
}

/**
 * Safely builds the search criteria based on form values
 * @param formRawValue the raw value of the form to use
 * @param datePickers a list of primeng datePickers of the form (use `@ViewChildren(DatePicker) datePickers!: QueryList<DatePicker>;`)
 * @param parameters {@link BuildSearchCriteriaParameters}  to use when building the search criteria
 * @returns the search criteria as a partial of T (T = type of the search criteria)
 */
export function buildSearchCriteria<T>(
  formRawValue: any,
  datePickers: QueryList<DatePicker>,
  { removeNullValues = false }: BuildSearchCriteriaParameters
) {
  return Object.entries(formRawValue).reduce((acc: Partial<T>, [key, value]) => {
    if (value == null && removeNullValues) {
      return acc
    }
    if (isValidDate(value) && !_hasShowTime(datePickers, key)) {
      value = getUTCDateWithoutTimezoneIssues(value)
    }
    return {
      ...acc,
      [key]: value,
    }
  }, {})
}


```

### File: angular-accelerator/src/lib/utils/data-operation-strategy.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { DataOperationStrategy } from './data-operation-strategy'
import { DataTableColumn } from '../model/data-table-column.model'
import { FilterObject, FilterType } from '../model/filter.model'
import { ColumnType } from '../model/column-type.model'

/* eslint-disable @typescript-eslint/no-unused-vars */
class NumberOperationStrategy extends DataOperationStrategy {
  override equals(column: DataTableColumn, value: unknown, target: unknown): boolean {
    return Number(value) === Number(target)
  }
  override lessThan(column: DataTableColumn, value: unknown, target: unknown): boolean {
    return Number(value) < Number(target)
  }
  override compare(a: unknown, b: unknown, column: DataTableColumn): number {
    return Number(a) - Number(b)
  }
}

class DateOperationStrategy extends DataOperationStrategy {
  override equals(column: DataTableColumn, value: unknown, target: unknown): boolean {
    if (!value || !(value instanceof Date) || !(target instanceof Date)) return false
    // different implementation based on the column
    let precision: 'day' | 'year' = 'year'
    if (column.id === 'dayCol') precision = 'day'

    if (precision === 'day') {
      return (
        value.getFullYear() === target.getFullYear() &&
        value.getMonth() === target.getMonth() &&
        value.getDate() === target.getDate()
      )
    }
    return value.getFullYear() === target.getFullYear()
  }

  override isNotEmpty(column: DataTableColumn, value: unknown): boolean {
    return !!value
  }

  override compare(a: Date, b: Date, column: DataTableColumn): number {
    let precision: 'day' | 'year' = 'year'
    if (column.id === 'dayCol') precision = 'day'

    const aYear = a.getFullYear()
    const aMonth = a.getMonth()
    const aDay = a.getDate()

    const bYear = b.getFullYear()
    const bMonth = b.getMonth()
    const bDay = b.getDate()

    if (aYear !== bYear || precision === 'year') {
      return aYear - bYear
    }
    if (aMonth !== bMonth) {
      return aMonth - bMonth
    }
    return aDay - bDay
  }

  override filterOptions(hayStack: unknown[], filterObject: FilterObject, columns: DataTableColumn[]) {
    if (filterObject.filterType === FilterType.IS_NOT_EMPTY) {
      return ['yes', 'no']
    }

    const hayStackValues = hayStack
      .map((item) => this.mapHaystackItemToValue(item, filterObject))
      .filter((item) => !!item)
    const column = columns.find((c) => c.id === filterObject.columnId)
    if (!column) {
      console.warn('Filter does not have a column id set. All items will be considered a valid option')
      return hayStackValues
    }

    let precision: 'day' | 'year' = 'year'
    if (column.id === 'dayCol') precision = 'day'

    return hayStackValues.filter(
      (item, index, self) => index === self.findIndex((t) => this.compare(t, item, column) === 0)
    )
  }
}

describe('DataOperationStrategy', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
    }).compileComponents()
  })

  describe('NumberOperationStrategy', () => {
    const items = [
      {
        col: 1,
      },
      {
        col: 2,
      },
      {
        col: 3,
      },
      {
        col: 2,
      },
      {
        col: 4,
      },
    ]
    const strategy = new NumberOperationStrategy()
    const columns: DataTableColumn[] = [
      {
        id: 'col',
        nameKey: '',
        columnType: ColumnType.NUMBER,
      },
    ]

    it('should result in equal numbers for filter', () => {
      const result = strategy.filter(
        items,
        {
          value: 2,
          filterType: FilterType.EQUALS,
          columnId: 'col',
        },
        columns
      )
      expect(result).toEqual([{ col: 2 }, { col: 2 }])
    })

    it('should result in lower numbers for filter', () => {
      const result = strategy.filter(
        items,
        {
          value: 3,
          filterType: FilterType.LESS_THAN,
          columnId: 'col',
        },
        columns
      )
      expect(result).toEqual([{ col: 1 }, { col: 2 }, { col: 2 }])
    })

    it('should result in unique numbers for filterOptions', () => {
      const result = strategy.filterOptions(
        items,
        {
          filterType: FilterType.LESS_THAN,
          columnId: 'col',
        },
        columns
      )
      expect(result).toEqual([1, 2, 3, 4])
    })

    it('should return all items for filter if filter type not set', () => {
      const result = strategy.filter(
        items,
        {
          value: 3,
          columnId: 'col',
        },
        columns
      )
      expect(result).toEqual(items)
    })
    it('should return all items for filter if column not found', () => {
      const result = strategy.filter(
        items,
        {
          value: 3,
          filterType: FilterType.EQUALS,
          columnId: 'col',
        },
        []
      )
      expect(result).toEqual(items)
    })
    it('should return all items for filterOptions if column not found', () => {
      const result = strategy.filterOptions(
        items,
        {
          filterType: FilterType.LESS_THAN,
          columnId: 'col',
        },
        []
      )
      expect(result).toEqual(items.map((i) => i.col))
    })
  })

  describe('DateOperationStrategy', () => {
    const items = [
      {
        yearCol: new Date(2020, 1, 13),
        dayCol: new Date(2020, 1, 13),
      },
      {
        yearCol: new Date(2020, 1, 13),
        dayCol: new Date(2020, 1, 13),
      },
      {
        yearCol: new Date(2021, 1, 13),
        dayCol: new Date(2021, 1, 13),
      },
      {
        yearCol: new Date(2022, 7, 20),
        dayCol: new Date(2022, 7, 20),
      },
      {
        yearCol: new Date(2022, 1, 13),
        dayCol: new Date(2022, 1, 13),
      },
      {
        yearCol: new Date(2024, 7, 20),
        dayCol: new Date(2024, 7, 20),
      },
      {
        yearCol: undefined,
        dayCol: undefined,
      },
    ]
    const strategy = new DateOperationStrategy()
    const columns: DataTableColumn[] = [
      {
        id: 'yearCol',
        nameKey: '',
        columnType: ColumnType.DATE,
      },
      {
        id: 'dayCol',
        nameKey: '',
        columnType: ColumnType.DATE,
      },
    ]
    const yearCol = 'yearCol'
    const dayCol = 'dayCol'

    it('should result in equal dates with year precision', () => {
      const result = strategy.filter(
        items,
        {
          columnId: yearCol,
          filterType: FilterType.EQUALS,
          value: new Date(2022, 7, 20),
        },
        columns
      )

      expect(result).toEqual([
        { yearCol: new Date(2022, 7, 20), dayCol: new Date(2022, 7, 20) },
        { yearCol: new Date(2022, 1, 13), dayCol: new Date(2022, 1, 13) },
      ])
    })

    it('should result in equal dates with day precision', () => {
      const result = strategy.filter(
        items,
        {
          columnId: dayCol,
          filterType: FilterType.EQUALS,
          value: new Date(2020, 1, 13),
        },
        columns
      )

      expect(result).toEqual([
        { yearCol: new Date(2020, 1, 13), dayCol: new Date(2020, 1, 13) },
        { yearCol: new Date(2020, 1, 13), dayCol: new Date(2020, 1, 13) },
      ])
    })
    it('should result in non empty dates', () => {
      const result = strategy.filter(
        items,
        {
          columnId: yearCol,
          filterType: FilterType.IS_NOT_EMPTY,
          value: 'yes',
        },
        columns
      )

      expect(result.length).toEqual(items.length - 1)
    })
    it('should result in unique dates with year precision', () => {
      const result = strategy.filterOptions(
        items,
        {
          columnId: yearCol,
          filterType: FilterType.EQUALS,
        },
        columns
      )

      expect(result).toEqual([
        new Date(2020, 1, 13),
        new Date(2021, 1, 13),
        new Date(2022, 7, 20),
        new Date(2024, 7, 20),
      ])
    })
    it('should result in unique dates with day precision', () => {
      const result = strategy.filterOptions(
        items,
        {
          columnId: dayCol,
          filterType: FilterType.EQUALS,
        },
        columns
      )

      expect(result).toEqual([
        new Date(2020, 1, 13),
        new Date(2021, 1, 13),
        new Date(2022, 7, 20),
        new Date(2022, 1, 13),
        new Date(2024, 7, 20),
      ])
    })
    it('should result in yes and no options with not empty filter', () => {
      const result = strategy.filterOptions(
        items,
        {
          columnId: dayCol,
          filterType: FilterType.IS_NOT_EMPTY,
        },
        columns
      )

      expect(result).toEqual(['yes', 'no'])
    })
  })
})


```

### File: angular-accelerator/src/lib/utils/data-operation-strategy.ts

```ts

import { DataTableColumn } from '../model/data-table-column.model'
import { Filter, FilterObject } from '../model/filter.model'
import { ObjectUtils } from './objectutils'

/* eslint-disable @typescript-eslint/no-unused-vars */
export abstract class DataOperationStrategy {
  endsWith(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('endsWith method not implemented')
    return true
  }

  startsWith(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('startsWith method not implemented')
    return true
  }

  contains(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('contains method not implemented')
    return true
  }

  notContains(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('notContains method not implemented')
    return true
  }

  equals(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('equals method not implemented')
    return true
  }

  notEquals(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('notEquals method not implemented')
    return true
  }

  lessThan(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('lessThan method not implemented')
    return true
  }

  greaterThan(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('greaterThan method not implemented')
    return true
  }

  lessThanOrEqual(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('lessThanOrEqual method not implemented')
    return true
  }

  greaterThanOrEqual(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('greaterThanOrEqual method not implemented')
    return true
  }

  isEmpty(column: DataTableColumn, value: unknown): boolean {
    console.error('isEmpty method not implemented')
    return true
  }

  isNotEmpty(column: DataTableColumn, value: unknown): boolean {
    console.error('isNotEmpty method not implemented')
    return true
  }

  compare(a: unknown, b: unknown, column: DataTableColumn): number {
    console.error('compare method not implemented')
    return 0
  }

  filterOptions(hayStack: unknown[], filterObject: FilterObject, columns: DataTableColumn[]): unknown[] {
    const hayStackOptions = hayStack.map((item) => this.mapHaystackItemToValue(item, filterObject))
    const column = columns.find((c) => c.id === filterObject.columnId)
    if (!column) {
      console.warn('Filter does not have a column id set. All items will be considered a valid option')
      return hayStackOptions
    }
    return hayStackOptions.filter(
      (item, index, self) => index === self.findIndex((t) => this.compare(t, item, column) === 0)
    )
  }

  filter(hayStack: unknown[], filter: Filter, columns: DataTableColumn[]): unknown[] {
    const { filterType, value } = filter
    if (!filterType) {
      console.warn('Filter does not have a type set. All items will resolve as true')
      return hayStack
    }
    const column = columns.find((c) => c.id === filter.columnId)
    if (!column) {
      console.warn('Filter does not have a column id set. All items will be considered a valid option')
      return hayStack
    }
    return hayStack.filter((item) => this[filterType](column, this.mapHaystackItemToValue(item, filter), value))
  }

  mapHaystackItemToValue(item: unknown, filter: Filter | FilterObject) {
    return ObjectUtils.resolveFieldData(item, filter.columnId)
  }
}


```

### File: angular-accelerator/src/lib/utils/dateutils.ts

```ts

import { Injectable, LOCALE_ID, inject } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class DateUtils {
  protected locale = inject(LOCALE_ID)

  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }

  localizedDate(date: string | number | Date | undefined): string {
    return date
      ? new Intl.DateTimeFormat(this.locale, this.options).format(date instanceof Date ? date : new Date(date))
      : ''
  }
}


```

### File: angular-accelerator/src/lib/utils/dynamic-locale-id.ts

```ts

import { UserService } from '@onecx/angular-integration-interface'

/**
 * @deprecated Use DynamicLocaleId from @onecx/angular-utils instead
 */
export class DynamicLocaleId {
  constructor(private userService: UserService) {
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

### File: angular-accelerator/src/lib/utils/enum-to-dropdown-options.utils.ts

```ts

import { TranslateService } from '@ngx-translate/core'
import { Observable, map } from 'rxjs'

export function enumToDropdownOptions<T extends object>(
  translateService: TranslateService,
  enumType: T,
  translationKeyPrefix: string
): Observable<{ label: string; value: T }[]> {
  return translateService.get(Object.values(enumType).map((v) => translationKeyPrefix + v)).pipe(
    map((translations) =>
      Object.values(enumType).map((v) => ({
        label: translations[translationKeyPrefix + v],
        value: v,
      }))
    )
  )
}


```

### File: angular-accelerator/src/lib/utils/filter.utils.ts

```ts

import { ColumnFilterDataSelectOptions, Filter } from '../model/filter.model'

export function limit(columnFilterData: Filter[], amount: number, options: ColumnFilterDataSelectOptions): Filter[] {
  return options.reverse
    ? columnFilterData.slice(-amount, columnFilterData.length).reverse()
    : columnFilterData.slice(0, amount)
}


```

### File: angular-accelerator/src/lib/utils/image-logo-url.utils.ts

```ts

export class ImageLogoUrlUtils {
  public static createLogoUrl(apiPrefix: string, url?: string): string | undefined {
    //if the url is from the backend, then we insert the apiPrefix
    if ((url && !url.match(/^(http|https)/g)) ) {
      return apiPrefix + url
    } else {
      return url
    }
  }
}

```

### File: angular-accelerator/src/lib/utils/objectutils.ts

```ts

export class ObjectUtils {
  public static resolveFieldData(data: any, field: any): any {
    if (data && field) {
      if (this.isFunction(field)) {
        return field(data)
      } else if (field.indexOf('.') == -1) {
        return data[field]
      } else {
        const fields: string[] = field.split('.')
        let value = data
        for (let i = 0, len = fields.length; i < len; ++i) {
          if (value == null) {
            return null
          }
          value = value[fields[i]]
        }
        return value
      }
    } else {
      return null
    }
  }

  public static isFunction(obj: any) {
    return !!(obj && obj.constructor && obj.call && obj.apply)
  }
}


```

### File: angular-accelerator/src/lib/utils/primeicon.utils.ts

```ts

import { PrimeIcons } from 'primeng/api'
/**
 * @example let myIcon : PrimeIcon = PrimeIcons.myIcon
 */
export type PrimeIcon = (typeof PrimeIcons)[keyof Omit<typeof PrimeIcons, 'prototype'>]


```

### File: angular-accelerator/src/lib/utils/rxjs-utils.ts

```ts

import { Timestamp } from 'rxjs'

export function orderValuesByTimestamp(valuesWithTimestamp: Timestamp<any>[]) {
  return valuesWithTimestamp.sort((a, b) => b.timestamp - a.timestamp).map((obj) => obj.value)
}

function mergeValues(values: any[]) {
  return values.reduce((acc, curr) => {
    return { ...acc, ...curr }
  })
}

export function orderAndMergeValuesByTimestamp(valuesWithTimestamp: Timestamp<any>[]) {
  const sortedValues = valuesWithTimestamp.sort((a, b) => a.timestamp - b.timestamp).map((obj) => obj.value)
  return mergeValues(sortedValues)
}


```

### File: angular-accelerator/src/lib/utils/string-and-array-helper-functions.utils.spec.ts

```ts

import {
  findEntryWithKeyword,
  removeKeyword,
  searchPrefixWithSpecialChars,
} from './string-and-array-helper-functions.utils'

describe('findEntryWithKeyword', () => {
  it('should find the entry containing the keyword', () => {
    expect(findEntryWithKeyword(['entry1', 'entry2', 'keywordEntry'], 'keyword')).toBe('keywordEntry')
    expect(findEntryWithKeyword(['entry1', 'entry2', 'entry3'], 'keyword')).toBe(null)
    expect(findEntryWithKeyword(undefined, 'keyword')).toBe(null)
  })
})

describe('removeKeyword', () => {
  it('should remove the keyword and trailing details from the input string', () => {
    expect(removeKeyword('/onecx-mgmt-page/keyword/123', 'keyword')).toBe('/onecx-mgmt-page')
    expect(removeKeyword('/onecx-mgmt-page/keyword/123/', 'keyword')).toBe('/onecx-mgmt-page')
    expect(removeKeyword('/onecx-mgmt-page/search/123', 'keyword')).toBe('/onecx-mgmt-page/search/123')
  })

  describe('searchPrefixWithSpecialChars', () => {
    it('should return the latest string starting with the prefix followed by ? or #', () => {
      const exampleUrls1 = ['onecx-mgmt-page?id', 'onecx-mgmt-page#id', 'ibt-order-mgmt-page#id']
      const exampleUrls2 = ['onecx-mgmt-page#id', 'onecx-mgmt-page#id', 'onecx-mgmt-page?id']
      const prefix = 'onecx-mgmt-page'
      const expected1 = 'onecx-mgmt-page#id'
      const expected2 = 'onecx-mgmt-page?id'
      expect(searchPrefixWithSpecialChars(exampleUrls1, prefix)).toEqual(expected1)
      expect(searchPrefixWithSpecialChars(exampleUrls2, prefix)).toEqual(expected2)
    })

    it('should return the latest string of an array starting with the prefix followed by ? or #', () => {
      const strings = ['test?case', 'test#case', 'test case', 'example?test', 'example#test']
      const prefix = 'test'
      const expected = 'test#case'
      expect(searchPrefixWithSpecialChars(strings, prefix)).toEqual(expected)
    })
  })
})


```

### File: angular-accelerator/src/lib/utils/string-and-array-helper-functions.utils.ts

```ts

export function findEntryWithKeyword(
  array: string[] | undefined,
  keyword: string,
): string | null {
  const entry = array?.find((entry) => entry.includes(keyword));
  return entry || null;
}

export function removeKeyword(input: string, keyword: string): string {
  let result = input.replace(new RegExp(`/${keyword}.*`), '');
  if (result.endsWith('/')) {
    result = result.slice(0, -1);
  }
  return result;
}

export function searchPrefixWithSpecialChars(
  strings: string[],
  prefix: string,
): string | null {
  for (let i = strings.length - 1; i >= 0; i--) {
    const str = strings[i];
    if (
      str.startsWith(prefix) &&
      (str[prefix.length] === '?' || str[prefix.length] === '#')
    ) {
      return str;
    }
  }
  return null;
}


```

### File: angular-accelerator/src/lib/utils/template.utils.ts

```ts

import { PrimeTemplate } from 'primeng/api'

export function findTemplate(templates: PrimeTemplate[], names: string[]): PrimeTemplate | undefined {
  for (let index = 0; index < names.length; index++) {
    const name = names[index]
    const template = templates.find((template) => template.name === name)
    if (template) {
      return template
    }
  }
  return undefined
}


```

## Folder: angular-accelerator/testing (25 files)

### File: angular-accelerator/testing/column-group-selection.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'
import { PSelectHarness } from '@onecx/angular-testing'

export class ColumnGroupSelectionHarness extends ComponentHarness {
  static hostSelector = 'ocx-column-group-selection'

  getPSelect = this.locatorFor(PSelectHarness)
}


```

### File: angular-accelerator/testing/content.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'
import { DivHarness, PHarness } from '@onecx/angular-testing'

export class OcxContentHarness extends ComponentHarness {
  static hostSelector = 'ocx-content'

  async getContentClasses() {
    const div = await this.locatorFor(DivHarness)()
    const actualClassList = await div.getClassList()

    return actualClassList
  }

  async getTitleClasses(titleElementId: string) {
    const p = await this.getTitleHarness(titleElementId)
    if (p) {
      const actualClassList = await p.getClassList()
      return actualClassList
    }
    return null
  }

  async getTitle(titleElementId: string) {
    const p = await this.getTitleHarness(titleElementId)
    if (p) {
      const titleContent = await p.getText()
      return titleContent
    }
    return null
  }

  async getTitleHarness(titleElementId: string) {
    const pHarness = await this.locatorForOptional(PHarness.with({ id: titleElementId }))()
    return pHarness
  }

  async hasTitle(titleElementId: string): Promise<boolean> {
    const title = await this.getTitleHarness(titleElementId)
    return !!title
  }
}


```

### File: angular-accelerator/testing/content-container.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'
import { DivHarness } from '@onecx/angular-testing'

export class OcxContentContainerHarness extends ComponentHarness {
  static hostSelector = 'ocx-content-container'

  async getLayoutClasses() {
    const div = await this.locatorFor(DivHarness)()
    const actualClassList = await div.getClassList()

    return actualClassList
  }

  async getLayout(): Promise<'horizontal' | 'vertical'> {
    const layoutClassses = await this.getLayoutClasses()
    return layoutClassses.find((c) => c.endsWith(':flex-row')) ? 'horizontal' : 'vertical'
  }

  async getBreakpoint(): Promise<'sm' | 'md' | 'lg' | 'xl' | undefined> {
    const layoutClassses = await this.getLayoutClasses()
    const layoutClass = layoutClassses.find((c) => c.endsWith(':flex-row'))
    return layoutClass?.split(':')[0] as 'sm' | 'md' | 'lg' | 'xl' | undefined
  }
}


```

### File: angular-accelerator/testing/custom-group-column-selector.harness.ts

```ts

import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { PDialogHarness, PPicklistHarness, PButtonHarness } from '@onecx/angular-testing'

export class CustomGroupColumnSelectorHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-custom-group-column-selector'

  getCustomGroupColumnSelectorButton = this.locatorFor(
    PButtonHarness.with({
      id: 'customGroupColumnSelectorButton',
    })
  )

  getDialog = this.locatorFor(PDialogHarness)
  getCancelButton = this.locatorFor(PButtonHarness.with({ id: 'cancelButton' }))
  getSaveButton = this.locatorFor(PButtonHarness.with({ id: 'saveButton' }))
  getPicklist = this.locatorFor(PPicklistHarness)
  getSelectButtons = this.locatorForOptional('[name]')

  async getFrozenActionColumnSelectButton() {
    return await this.locatorForAll(`[name="frozen-action-column-select-button"] .p-togglebutton`)()
  }

  async getActionColumnPositionSelectButtons() {
    return await this.locatorForAll(`[name="action-column-position-select-button"] .p-togglebutton`)()
  }

  async openCustomGroupColumnSelectorDialog() {
    if (!(await (await this.getDialog()).isVisible())) {
      await (await this.getCustomGroupColumnSelectorButton()).click()
    } else {
      console.warn('Unable to open CustomGroupColumnSelectionDialog, because it is already open.')
    }
  }
}


```

### File: angular-accelerator/testing/data-layout-selection.harness.ts

```ts

import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { PToggleButtonHarness } from '@onecx/angular-testing'

export class DataLayoutSelectionHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-layout-selection'

  getListLayoutSelectionToggleButton = this.locatorFor(
    PToggleButtonHarness.with({ onLabel: 'ocx-data-layout-selection-list' })
  )
  getGridLayoutSelectionToggleButton = this.locatorFor(
    PToggleButtonHarness.with({ onLabel: 'ocx-data-layout-selection-grid' })
  )
  getTableLayoutSelectionToggleButton = this.locatorFor(
    PToggleButtonHarness.with({ onLabel: 'ocx-data-layout-selection-table' })
  )

  async getCurrentLayout() {
    return await (await this.host()).getAttribute('ng-reflect-layout')
  }

  async selectListLayout() {
    await (await this.getListLayoutSelectionToggleButton()).click()
  }

  async selectGridLayout() {
    await (await this.getGridLayoutSelectionToggleButton()).click()
  }

  async selectTableLayout() {
    await (await this.getTableLayoutSelectionToggleButton()).click()
  }
}


```

### File: angular-accelerator/testing/data-list-grid.harness.ts

```ts

import { ContentContainerComponentHarness, TestElement, parallel } from '@angular/cdk/testing'
import { PMenuHarness, PPaginatorHarness } from '@onecx/angular-testing'
import { DefaultGridItemHarness } from './default-grid-item.harness'
import { DefaultListItemHarness } from './default-list-item.harness'
import { waitForDeferredViewsToBeRendered } from '@onecx/angular-testing'

export class DataListGridHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-list-grid'

  getDefaultGridItems = this.locatorForAll(DefaultGridItemHarness)
  getPaginator = this.locatorFor(PPaginatorHarness)
  getMenuButton = this.locatorFor(`[name="data-grid-item-menu-button"]`)
  getListOverflowMenuButton = this.locatorFor(`[name="data-list-overflow-item-menu-button"]`)
  getListOverflowMenu = this.locatorForOptional(PMenuHarness)

  async getDefaultListItems() {
    await waitForDeferredViewsToBeRendered(this)
    return await this.locatorForAll(DefaultListItemHarness)()
  }

  async getActionButtons(actionButtonType: 'list' | 'grid' | 'grid-hidden') {
    if (actionButtonType === 'list') {
      return await this.locatorForAll(`[name="data-list-action-button"]`)()
    } else if (actionButtonType === 'grid-hidden') {
      return await this.documentRootLocatorFactory().locatorForAll(
        `[data-automationid="data-grid-action-button-hidden"]`
      )()
    } else {
      return await this.documentRootLocatorFactory().locatorForAll(`[data-automationid="data-grid-action-button"]`)()
    }
  }

  async getListOverflowMenuItems() {
    const menu = await this.getListOverflowMenu()
    const menuItems = await menu?.getAllMenuItems()
    return menuItems ?? []
  }

  async actionButtonIsDisabled(actionButton: TestElement, viewType: 'list' | 'grid'): Promise<boolean> {
    if (viewType === 'list') {
      return await actionButton.getProperty('disabled')
    } else {
      return await actionButton.hasClass('p-disabled')
    }
  }

  async hasAmountOfActionButtons(actionButtonType: 'list' | 'grid' | 'grid-hidden', amount: number) {
    return (await this.getActionButtons(actionButtonType)).length === amount
  }

  async hasAmountOfDisabledActionButtons(viewType: 'list' | 'grid', amount: number) {
    let disabledActionButtonsCount = 0
    const actionButtons = await this.getActionButtons(viewType)
    await parallel(() =>
      actionButtons.map(async (actionButton) => {
        if ((await this.actionButtonIsDisabled(actionButton, viewType)) === true) {
          disabledActionButtonsCount++
        }
      })
    )
    return disabledActionButtonsCount === amount
  }
}


```

### File: angular-accelerator/testing/data-table.harness.ts

```ts

import {
  BaseHarnessFilters,
  ContentContainerComponentHarness,
  HarnessPredicate,
  TestElement,
  parallel,
} from '@angular/cdk/testing'
import {
  TableHeaderColumnHarness,
  TableRowHarness,
  PPaginatorHarness,
  PTableCheckboxHarness,
  PMenuHarness,
  MenuItemHarness,
} from '@onecx/angular-testing'

export interface DataTableHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class DataTableHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-table'

  static with(options: DataTableHarnessFilters): HarnessPredicate<DataTableHarness> {
    return new HarnessPredicate(DataTableHarness, options).addOption('id', options.id, (harness, id) =>
      HarnessPredicate.stringMatches(harness.getId(), id)
    )
  }

  getHeaderColumns = this.locatorForAll(TableHeaderColumnHarness)
  getRows = this.locatorForAll(TableRowHarness)
  getPaginator = this.locatorFor(PPaginatorHarness)
  getOverflowMenu = this.locatorForOptional(PMenuHarness)

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async rowSelectionIsEnabled(): Promise<boolean> {
    const pTableCheckbox = await this.getHarnessesForCheckboxes('all')
    return pTableCheckbox.length > 0
  }

  async getHarnessesForCheckboxes(type: 'all' | 'checked' | 'unchecked'): Promise<PTableCheckboxHarness[]> {
    let checkBoxHarnesses: PTableCheckboxHarness[]
    if (type === 'checked') {
      checkBoxHarnesses = await this.getAllHarnesses(PTableCheckboxHarness.with({ isSelected: true }))
      return checkBoxHarnesses
    }
    if (type === 'unchecked') {
      checkBoxHarnesses = await this.getAllHarnesses(PTableCheckboxHarness.with({ isSelected: false }))
      return checkBoxHarnesses
    } else {
      checkBoxHarnesses = await this.getAllHarnesses(PTableCheckboxHarness)
      return checkBoxHarnesses
    }
  }

  async getActionColumnHeader(position: 'left' | 'right') {
    return await this.locatorForOptional(`[name="action-column-header-${position}"]`)()
  }

  async getActionColumn(position: 'left' | 'right') {
    return await this.locatorForOptional(`[name="action-column-${position}"]`)()
  }

  async getActionButtons() {
    return await this.locatorForAll(`[name="data-table-action-button"]`)()
  }

  async getOverflowActionMenuButton() {
    return await this.locatorForOptional('[name="data-table-overflow-action-button"]')()
  }

  async getOverFlowMenuItems() {
    const menu = await this.getOverflowMenu()
    const menuItems = await menu?.getAllMenuItems()
    return menuItems ?? []
  }

  async getOverFlowMenuItem(itemText: string): Promise<MenuItemHarness | undefined | null> {
    const menu = await this.getOverflowMenu()
    return await menu?.getMenuItem(itemText)
  }

  async actionButtonIsDisabled(actionButton: TestElement) {
    const isDisabled = await actionButton.getProperty('disabled')
    return isDisabled
  }

  async hasAmountOfActionButtons(amount: number) {
    return (await this.getActionButtons()).length === amount
  }

  async hasAmountOfDisabledActionButtons(amount: number) {
    let disabledActionButtonsCount = 0
    const actionButtons = await this.getActionButtons()
    await parallel(() =>
      actionButtons.map(async (actionButton) => {
        if ((await this.actionButtonIsDisabled(actionButton)) === true) {
          disabledActionButtonsCount++
        }
      })
    )
    return disabledActionButtonsCount === amount
  }

  async columnIsFrozen(column: TestElement | null | undefined) {
    if (column === null || column === undefined) {
      throw new Error('Given column is null')
    }
    return await column.hasClass('p-datatable-frozen-column')
  }
}


```

### File: angular-accelerator/testing/data-view.harness.ts

```ts

import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { DataListGridHarness } from './data-list-grid.harness'
import { DataTableHarness } from './data-table.harness'

export class DataViewHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-view'

  getDataTable = this.locatorForOptional(DataTableHarness)
  getDataListGrid = this.locatorForOptional(DataListGridHarness)
}


```

### File: angular-accelerator/testing/default-grid-item.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'
import { DivHarness } from '@onecx/angular-testing'
import { MoreActionsMenuButtonHarness } from './more-actions-menu-button.harness'

export class DefaultGridItemHarness extends ComponentHarness {
  static hostSelector = '.data-grid-item'

  getMoreActionsButton = this.locatorFor(MoreActionsMenuButtonHarness)
  private getAllDivs = this.locatorForAll(DivHarness)
  private getGridImg = this.locatorFor('img')

  async getData() {
    const isDataGridItemsDiv = await Promise.all(
      (await this.getAllDivs()).map((divHarness) => this.checkDivsHasClasses(divHarness))
    )
    const divHarnesses = (await this.getAllDivs()).filter((_v, index) => isDataGridItemsDiv[index])
    const getDivTexts: (string | null)[] = await Promise.all(divHarnesses.map((divHarness) => divHarness.getText()))
    getDivTexts.unshift(await (await this.getGridImg()).getAttribute('src'))
    return getDivTexts
  }

  async checkDivsHasClasses(value: DivHarness) {
    const hasClass = (await value.checkHasClass('item-name')) || (await value.checkHasClass('subtitleLine'))
    return hasClass
  }
}


```

### File: angular-accelerator/testing/default-list-item.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'
import { ButtonHarness, DivHarness } from '@onecx/angular-testing'
import { waitForDeferredViewsToBeRendered } from '@onecx/angular-testing'

export class DefaultListItemHarness extends ComponentHarness {
  static hostSelector = '.data-list-items'

  getAllActionButtons = this.locatorForAll('button')
  getViewButton = this.locatorForOptional(ButtonHarness.with({ class: 'viewListItemButton' }))
  getEditButton = this.locatorForOptional(ButtonHarness.with({ class: 'editListItemButton' }))
  getDeleteButton = this.locatorForOptional(ButtonHarness.with({ class: 'deleteListItemButton' }))

  private getAllDivs = this.locatorForAll(DivHarness)

  async getData() {
    await waitForDeferredViewsToBeRendered(this)
    const isDataListItemsDiv = await Promise.all(
      (await this.getAllDivs()).map((innerDivHarness) => this.checkDivsHasClasses(innerDivHarness))
    )
    const divHarnesses = (await this.getAllDivs()).filter((_v, index) => isDataListItemsDiv[index])
    const getDivTexts = await Promise.all(divHarnesses.map((divHarness) => divHarness.getText()))
    return getDivTexts
  }

  async checkDivsHasClasses(value: DivHarness) {
    const hasClass = (await value.checkHasClass('item-name-row')) || (await value.checkHasClass('subtitleLine'))
    return hasClass
  }
}


```

### File: angular-accelerator/testing/diagram.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'
import { PChartHarness, PSelectButtonHarness } from '@onecx/angular-testing'

export class DiagramHarness extends ComponentHarness {
  static hostSelector = 'ocx-diagram'

  getChart = this.locatorFor(PChartHarness)

  async getTotalNumberOfResults(): Promise<number | undefined> {
    return (await this.locatorForOptional('.sumKey span[name="amountOfData"]')())?.text().then((s) => Number(s))
  }

  async getSumLabel(): Promise<string | undefined> {
    return (await this.locatorForOptional('.sumKey span[name="sumLabel"]')())?.text()
  }

  async getDiagramTypeSelectButton() {
    return await this.locatorForOptional('p-selectbutton[name="diagram-type-select-button"]')()
  }

  async getAllSelectionButtons() {
    return await (await this.locatorFor(PSelectButtonHarness)()).getAllButtons()
  }
}


```

### File: angular-accelerator/testing/dialog-content.harness.ts

```ts

import { ContentContainerComponentHarness } from '@onecx/angular-testing'
import { DialogMessageContentHarness } from './dialog-message-content.harness'

export class DialogContentHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-dialog-content'

  getDialogMessageContent = this.locatorForOptional(DialogMessageContentHarness)
}


```

### File: angular-accelerator/testing/dialog-footer.harness.ts

```ts

import { ContentContainerComponentHarness, PButtonDirectiveHarness } from '@onecx/angular-testing'

export class DialogFooterHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-dialog-footer'

  getPrimaryButton = this.locatorFor(PButtonDirectiveHarness.with({ id: 'buttonDialogPrimaryButton' }))
  getSecondaryButton = this.locatorForOptional(PButtonDirectiveHarness.with({ id: 'buttonDialogSecondaryButton' }))

  async clickPrimaryButton() {
    await (await this.getPrimaryButton()).click()
  }

  async clickSecondaryButton() {
    await (await this.getSecondaryButton())?.click()
  }

  async getPrimaryButtonLabel(): Promise<string | null> {
    return await (await this.getPrimaryButton()).getLabel()
  }

  async getPrimaryButtonIcon(): Promise<string | null> {
    return await (await this.getPrimaryButton()).getIcon()
  }

  async getSecondaryButtonLabel(): Promise<string | null | undefined> {
    return await (await this.getSecondaryButton())?.getLabel()
  }

  async getSecondaryButtonIcon(): Promise<string | null | undefined> {
    return await (await this.getSecondaryButton())?.getIcon()
  }

  async getPrimaryButtonDisabled(): Promise<boolean> {
    return await (await this.getPrimaryButton()).getDisabled()
  }

  async getSecondaryButtonDisabled(): Promise<boolean | undefined> {
    return await (await this.getSecondaryButton())?.getDisabled()
  }
}


```

### File: angular-accelerator/testing/dialog-inline.harness.ts

```ts

import { ContentContainerComponentHarness } from '@onecx/angular-testing'
import { DialogContentHarness } from './dialog-content.harness'
import { DialogFooterHarness } from './dialog-footer.harness'

export class DialogInlineHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-dialog-inline'

  getDialogContent = this.locatorFor(DialogContentHarness)
  getDialogFooter = this.locatorFor(DialogFooterHarness)
}


```

### File: angular-accelerator/testing/dialog-message-content.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'

export class DialogMessageContentHarness extends ComponentHarness {
  static hostSelector = '.dialogMessageContent'

  private getMessageSpan = this.locatorFor('#dialogMessage')
  private getIcon = this.locatorForOptional('i')

  async getMessageContent(): Promise<string> {
    return await (await this.getMessageSpan()).text()
  }

  async getIconValue(): Promise<string | null | undefined> {
    return await (await this.getIcon())?.getAttribute('class')
  }
}


```

### File: angular-accelerator/testing/filter-view.harness.ts

```ts

import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { DataTableHarness } from './data-table.harness'
import { PButtonHarness, PChipHarness, SpanHarness } from '@onecx/angular-testing'

export class FilterViewHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-filter-view'

  getOverlayResetFiltersButton = this.documentRootLocatorFactory().locatorForOptional(
    PButtonHarness.with({ id: 'ocxFilterViewOverlayReset' })
  )
  getFiltersButton = this.locatorForOptional(PButtonHarness.with({ id: 'ocxFilterViewManage' }))
  getChipsResetFiltersButton = this.locatorForOptional(PButtonHarness.with({ id: 'ocxFilterViewReset' }))
  getChips = this.locatorForAll(PChipHarness)
  getNoFiltersMessage = this.locatorForOptional(SpanHarness.with({ id: 'ocxFilterViewNoFilters' }))

  async getDataTable() {
    return await this.documentRootLocatorFactory().locatorForOptional(
      DataTableHarness.with({ id: 'ocxFilterViewDataTable' })
    )()
  }
}


```

### File: angular-accelerator/testing/group-by-count-diagram.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'
import { DiagramHarness } from './diagram.harness'

export class GroupByCountDiagramHarness extends ComponentHarness {
    static hostSelector = 'ocx-group-by-count-diagram'

    getDiagram = this.locatorFor(DiagramHarness)
}

```

### File: angular-accelerator/testing/index.ts

```ts

import { ensureIntersectionObserverMockExists, ensureOriginMockExists } from '@onecx/angular-testing'

export * from './column-group-selection.harness'
export * from './content-container.harness'
export * from './content.harness'
export * from './custom-group-column-selector.harness'
export * from './data-layout-selection.harness'
export * from './data-list-grid.harness'
export * from './data-table.harness'
export * from './data-view.harness'
export * from './default-grid-item.harness'
export * from './default-list-item.harness'
export * from './diagram.harness'
export * from './filter-view.harness'
export * from './group-by-count-diagram.harness'
export * from './interactive-data-view.harness'
export * from './lifecycle.harness'
export * from './more-actions-menu-button.harness'
export * from './page-header.harness'
export * from './slot.harness'
export * from './search-header.harness'
export * from '../testing/dialog-content.harness'
export * from '../testing/dialog-footer.harness'
export * from '../testing/dialog-inline.harness'
export * from '../testing/dialog-message-content.harness'

export * from '@angular/cdk/testing'
export * from '@angular/cdk/testing/testbed'
export * from '@onecx/angular-testing'

ensureIntersectionObserverMockExists()
ensureOriginMockExists()


```

### File: angular-accelerator/testing/interactive-data-view.harness.ts

```ts

import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { DivHarness, PButtonHarness } from '@onecx/angular-testing'
import { PSelectHarness } from '@onecx/angular-testing'
import { DataLayoutSelectionHarness } from './data-layout-selection.harness'
import { DataViewHarness } from './data-view.harness'
import { SlotHarness } from './slot.harness'
import { CustomGroupColumnSelectorHarness } from './custom-group-column-selector.harness'

export class InteractiveDataViewHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-interactive-data-view'

  async getHeaderStyleClasses() {
    const headerDiv = await this.locatorFor(DivHarness.with({ id: 'interactiveDataViewHeader' }))()
    const headerClassList = await headerDiv.getClassList()
    return headerClassList
  }

  async getContentStyleClasses() {
    const contentDiv = await this.locatorFor(DivHarness.with({ id: 'interactiveDataViewContent' }))()
    const contentClassList = await contentDiv.getClassList()
    return contentClassList
  }

  getDataLayoutSelection = this.locatorFor(DataLayoutSelectionHarness)
  getColumnGroupSelectionSelect = this.locatorForOptional(PSelectHarness.with({ id: 'columnGroupSelectionSelect' }))
  getCustomGroupColumnSelector = this.locatorForOptional(CustomGroupColumnSelectorHarness)
  getCustomGroupColumnSelectorSlot = this.locatorForOptional(SlotHarness)
  getDataListGridSortingSelect = this.locatorForOptional(PSelectHarness.with({ id: 'dataListGridSortingSelect' }))
  getDataListGridSortingButton = this.locatorForOptional(PButtonHarness.with({ id: 'dataListGridSortingButton' }))
  getDataView = this.locatorFor(DataViewHarness)
}


```

### File: angular-accelerator/testing/lifecycle.harness.ts

```ts

import { ContentContainerComponentHarness } from "@angular/cdk/testing"

export class LifecycleHarness extends ContentContainerComponentHarness {
    static hostSelector = 'ocx-lifecycle'

    getSteps = this.locatorForAll('.p-timeline-event-content .card')
    getHighlightedSteps = this.locatorForAll('.p-timeline-event-content .card.bg-primary')
}

```

### File: angular-accelerator/testing/more-actions-menu-button.harness.ts

```ts

import { ContentContainerComponentHarness, HarnessLoader } from '@angular/cdk/testing'
import { MenuItemHarness } from '@onecx/angular-testing'

export class MoreActionsMenuButtonHarness extends ContentContainerComponentHarness {
  static hostSelector = '.more-actions-menu-button'

  async getHarnessLoaderForPMenuOverlay(): Promise<HarnessLoader | null> {
    return this.documentRootLocatorFactory().harnessLoaderForOptional('.p-menu-overlay')
  }

  async isOpen(): Promise<boolean> {
    return !!(await this.getHarnessLoaderForPMenuOverlay())
  }

  async open() {
    if (!(await this.isOpen())) {
      await (await this.host()).click()
    } else {
      console.warn('Unable to open multiSelect, because it is already open.')
    }
  }

  async close() {
    if (await this.isOpen()) {
      await (await this.host()).click()
    } else {
      console.warn('Unable to open multiSelect, because it is already open.')
    }
  }

  async getAllActionsMenuItems() {
    await this.open()
    if (await this.getHarnessLoaderForPMenuOverlay()) {
      return this.documentRootLocatorFactory().locatorForAll(MenuItemHarness)()
    }
    return []
  }
}


```

### File: angular-accelerator/testing/ng-package.json

```json

{
  "$schema": "../../../node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "./index.ts"
  }
}

```

### File: angular-accelerator/testing/page-header.harness.ts

```ts

import { BaseHarnessFilters, ComponentHarness, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import {
  ListItemHarness,
  MenuItemHarness,
  PBreadcrumbHarness,
  PButtonHarness,
  PMenuHarness,
} from '@onecx/angular-testing'

export class PageHeaderHarness extends ComponentHarness {
  static hostSelector = 'ocx-page-header'

  getPageHeaderWrapperHarness = this.locatorForAll('[name="ocx-page-header-wrapper"]')
  getBreadcrumb = this.locatorForOptional(PBreadcrumbHarness)
  getMenu = this.locatorForOptional(PMenuHarness)

  async getElementByTitle(title: string) {
    return await this.locatorForOptional(`[title="${title}"]`)()
  }

  async getElementByAriaLabel(ariaLabel: string) {
    return await this.locatorForOptional(`[aria-label="${ariaLabel}"]`)()
  }

  async getObjectInfos() {
    return await this.locatorForAll(ObjectDetailItemHarness)()
  }

  async getObjectInfoByLabel(objectInfolabel: string) {
    return await this.locatorForOptional(ObjectDetailItemHarness.with({ label: objectInfolabel }))()
  }

  async getInlineActionButtons() {
    const inlineActionButtons = await this.locatorForAll(
      PButtonHarness.with({ name: 'ocx-page-header-inline-action-button' })
    )()
    const inlineActionIconButtons = await this.locatorForAll(
      PButtonHarness.with({ name: 'ocx-page-header-inline-action-icon-button' })
    )()
    return inlineActionButtons.concat(inlineActionIconButtons)
  }

  async getInlineActionButtonByLabel(buttonLabel: string) {
    return await this.locatorForOptional(PButtonHarness.with({ label: buttonLabel }))()
  }

  async getInlineActionButtonByIcon(buttonIcon: string) {
    return await this.locatorForOptional(PButtonHarness.with({ icon: buttonIcon }))()
  }

  async getOverflowActionMenuButton() {
    return await this.locatorForOptional('[name="ocx-page-header-overflow-action-button"]')()
  }

  async getOverFlowMenuItems() {
    const menu = await this.getMenu()
    const menuItems = await menu?.getAllMenuItems()
    return menuItems ?? []
  }

  async getOverFlowMenuItem(itemText: string): Promise<MenuItemHarness | undefined | null> {
    const menu = await this.getMenu()
    return await menu?.getMenuItem(itemText)
  }

  async getBreadcrumbItem(itemText: string): Promise<ListItemHarness | undefined | null> {
    const breadcrumb = await this.getBreadcrumb()
    return await breadcrumb?.getBreadcrumbItem(itemText)
  }

  async getHeaderText(): Promise<string | undefined> {
    return await (await this.locatorForOptional('#page-header')())?.text()
  }

  async getSubheaderText(): Promise<string | undefined> {
    return await (await this.locatorForOptional('#page-subheader')())?.text()
  }
}

interface ObjectDetailItemHarnessFilters extends BaseHarnessFilters {
  label?: string
}

class ObjectDetailItemHarness extends ContentContainerComponentHarness {
  static hostSelector = '.object-info'

  getLabelElement = this.locatorFor('[name="object-detail-label"]')
  getValueElement = this.locatorForOptional('[name="object-detail-value"]')
  getIconElement = this.locatorForOptional('[name="object-detail-icon"]')

  static with(options: ObjectDetailItemHarnessFilters): HarnessPredicate<ObjectDetailItemHarness> {
    return new HarnessPredicate(ObjectDetailItemHarness, options).addOption('label', options.label, (harness, label) =>
      HarnessPredicate.stringMatches(harness.getLabel(), label)
    )
  }

  async getLabel() {
    return (await this.getLabelElement()).text()
  }

  async getValue() {
    return (await this.getValueElement())?.text()
  }

  async getValueStyles() {
    return (await this.getValueElement())?.getAttribute('class')
  }

  async getIcon() {
    return (await this.getIconElement())?.getAttribute('class')
  }

  async getLabelTooltipContent(): Promise<string | null> {
    return this.getTooltipFromElement(await this.getLabelElement())
  }

  async getValueTooltipContent(): Promise<string | null> {
    return this.getTooltipFromElement(
      await this.locatorForOptional('[name="object-detail-value"] > span:first-of-type')()
    )
  }

  async getActionItemTooltipContent(): Promise<string | null> {
    return this.getTooltipFromElement(
      await this.locatorForOptional('[name="object-detail-value"] p-button')()
    )
  }

  private async getTooltipFromElement(element: any): Promise<string | null> {
    if (!element) return null
    
    await element.hover()
    await this.forceStabilize()
    
    const rootLocator = this.documentRootLocatorFactory()
    const tooltipEl = await rootLocator.locatorForOptional('.p-tooltip .p-tooltip-text')()
    if (tooltipEl) {
      const text = await tooltipEl.text()
      await element.mouseAway()
      await this.forceStabilize()
      return text
    }
    
    return null
  }
}


```

### File: angular-accelerator/testing/search-header.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'
import { PButtonHarness } from '@onecx/angular-testing'
import { PageHeaderHarness } from './page-header.harness'
import { MoreActionsMenuButtonHarness } from './more-actions-menu-button.harness'

export class SearchHeaderHarness extends ComponentHarness {
  static hostSelector = 'ocx-search-header'

  getPageHeader = this.locatorFor(PageHeaderHarness)
  getSearchButton = this.locatorFor(
    PButtonHarness.with({
      id: 'searchButton',
    })
  )

  getResetButton = this.locatorFor(
    PButtonHarness.with({
      id: 'resetButton',
    })
  )

  getSimpleAdvancedButton = this.locatorForOptional(
    PButtonHarness.with({
      id: 'simpleAdvancedButton',
    })
  )

  getMoreActionsMenuButton = this.locatorForOptional(MoreActionsMenuButtonHarness)

  async clickResetButton() {
    await (await this.getResetButton()).click()
  }

  async clickSearchButton() {
    await (await this.getSearchButton()).click()
  }

  async toggleSimpleAdvanced() {
    if (await this.getSimpleAdvancedButton()) {
      await (await this.getSimpleAdvancedButton())?.click()
    } else {
      console.warn('No SimpleAdvancedButton is being displayed to toggle, because no advanced form field is defined.')
    }
  }
}


```

### File: angular-accelerator/testing/slot.harness.ts

```ts

import { BaseHarnessFilters, ContentContainerComponentHarness } from '@angular/cdk/testing'

export interface SlotHarnessFilters extends BaseHarnessFilters {
  name?: string
}

export class SlotHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-slot'
}


```


