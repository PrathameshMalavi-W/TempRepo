# Files from C:\Users\prath\onecx\onecx-ui\onecx-portal-ui-libs\libs\angular-integration-interface

## Folder: angular-integration-interface (11 files)

### File: angular-integration-interface/.eslintrc.json

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

### File: angular-integration-interface/jest.config.ts

```ts

/* eslint-disable */
import { createReportsConfig } from '../../jest-config-factory'

export default {
  displayName: 'angular-integration-interface',
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
  ...createReportsConfig('angular-integration-interface'),
}


```

### File: angular-integration-interface/migrations.json

```json

{
  "generators": {
    "migrate-onecx-to-v6": {
      "cli": "nx",
      "version": "6.0.0",
      "description": "Update package json to Angular 19, PrimeNG 19, OneCX versions to v6 and other dependencies to be compatible with Angular 19.",
      "factory": "migrations/v6/migrate-onecx-to-v6"
    },
    "remove-add-initialize-module-guard": {
      "cli": "nx",
      "version": "6.0.0",
      "description": "Removes all occurrences of addInitializeModuleGuard.",
      "factory": "migrations/v6/remove-add-initialize-module-guard"
    },
    "replace-provide-app-service-mock": {
      "cli": "nx",
      "version": "6.0.0",
      "description": "Detects and replaces all occurrences of provideAppServiceMock with provideAppStateServiceMock.",
      "factory": "migrations/v6/replace-provide-app-service-mock"
    },
    "remove-auth-service": {
      "cli": "nx",
      "version": "6.0.0",
      "description": "Removes all imports of IAuthService and AUTH_SERVICE and warns for usage.",
      "factory": "migrations/v6/remove-auth-service"
    },
    "warn-removed-properties-from-theme-service": {
      "cli": "nx",
      "version": "6.0.0",
      "description": "Warns about the properties which were removed from themeService",
      "factory": "migrations/v6/warn-removed-properties-from-theme-service"
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

### File: angular-integration-interface/ng-package.json

```json

{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/libs/angular-integration-interface",
  "lib": {
    "entryFile": "src/index.ts"
  },
  "assets": [
    "./assets/**",
    "./migrations.json"
  ]
}

```

### File: angular-integration-interface/package.json

```json

{
  "name": "@onecx/angular-integration-interface",
  "version": "7.0.0-rc.13",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/onecx/onecx-portal-ui-libs"
  },
  "peerDependencies": {
    "@angular/core": "^19.0.0",
    "@onecx/accelerator": "^7.0.0-rc.13",
    "@onecx/nx-migration-utils": "^7.0.0-rc.13",
    "@onecx/integration-interface": "^7.0.0-rc.13",
    "rxjs": "~7.8.1",
    "@nx/devkit": "^20.3.0",
    "@phenomnomnominal/tsquery": "^6",
    "ts-semaphore": "^1.0.0",
    "@jest/globals": "29.7.0",
    "jest-extended": "^6.0.0",
    "typescript": "^5.5.4"
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

### File: angular-integration-interface/project.json

```json

{
  "name": "angular-integration-interface",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/angular-integration-interface/src",
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
          "tsc -p libs/angular-integration-interface/migrations/tsconfig.migrations.json"
        ]
      }
    },
    "build": {
      "executor": "@nx/angular:package",
      "outputs": ["{workspaceRoot}/dist/{projectRoot}"],
      "options": {
        "project": "libs/angular-integration-interface/ng-package.json"
      },
      "configurations": {
        "production": {
          "tsConfig": "libs/angular-integration-interface/tsconfig.lib.prod.json"
        },
        "development": {
          "tsConfig": "libs/angular-integration-interface/tsconfig.lib.json"
        }
      },
      "defaultConfiguration": "production"
    },
    "test-migrations": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "libs/angular-integration-interface/migrations/jest.config.ts",
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
        "jestConfig": "libs/angular-integration-interface/jest.config.ts",
        "passWithNoTests": true,
        "testPathIgnorePatterns": ["libs/angular-integration-interface/migrations/"]
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
          "libs/angular-integration-interface/**/*.ts",
          "libs/angular-integration-interface/**/*.html"
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

### File: angular-integration-interface/sonar-project.properties

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
sonar.projectKey=onecx-portal-ui-libs-angular-integration-interface
sonar.projectName=onecx-portal-ui-libs-angular-integration-interface
#
sonar.scm.disabled=true
sonar.sources=src
sonar.tests=src
sonar-language="js"
sonar.sourceEncoding=UTF-8
#
# reporting
sonar.javascript.coveragePlugin=lcov
sonar.javascript.lcov.reportPaths=../../reports/angular-integration-interface/coverage/lcov.info
sonar.testExecutionReportPaths=../../reports/angular-integration-interface/sonarqube_report.xml
sonar.working.directory=../../reports/angular-integration-interface/.scannerwork
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

### File: angular-integration-interface/tsconfig.json

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

### File: angular-integration-interface/tsconfig.lib.json

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
  "include": ["**/*.ts", "mocks/**/*", "src/**/*"]
}


```

### File: angular-integration-interface/tsconfig.lib.prod.json

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

### File: angular-integration-interface/tsconfig.spec.json

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
  "include": ["jest.config.ts", "**/*.test.ts", "**/*.spec.ts", "**/*.d.ts"],
  "exclude": ["migrations/**/*.spec.ts"]
}


```

## Folder: angular-integration-interface/migrations (5 files)

### File: angular-integration-interface/migrations/index.ts

```ts

export * from './v6/migrate-onecx-to-v6'
export * from './v6/remove-add-initialize-module-guard'
export * from './v6/replace-provide-app-service-mock'
export * from './v6/remove-auth-service'
export * from './v6/warn-removed-properties-from-theme-service'


```

### File: angular-integration-interface/migrations/jest.config.ts

```ts

export default {
  displayName: 'angular-integration-interface-migrations',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../coverage/libs/angular-integration-interface/migrations',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test-utils/test-setup.ts'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
}

```

### File: angular-integration-interface/migrations/tsconfig.json

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

### File: angular-integration-interface/migrations/tsconfig.migrations.json

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

### File: angular-integration-interface/migrations/tsconfig.spec.json

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

## Folder: angular-integration-interface/migrations/test-utils (1 files)

### File: angular-integration-interface/migrations/test-utils/test-setup.ts

```ts

import { expect } from '@jest/globals'
import * as matchers from 'jest-extended'
expect.extend(matchers)

```

## Folder: angular-integration-interface/migrations/v6 (8 files)

### File: angular-integration-interface/migrations/v6/migrate-onecx-to-v6.ts

```ts

import { Tree } from '@nx/devkit'
import { commonMigrateOnecxToV6 } from '@onecx/nx-migration-utils'

export default async function migrateOnecxToV6(tree: Tree) {
  await commonMigrateOnecxToV6(tree)
}


```

### File: angular-integration-interface/migrations/v6/remove-add-initialize-module-guard.ts

```ts

import { formatFiles, Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { removeImportValuesFromModule } from '@onecx/nx-migration-utils'
import { replace } from '@phenomnomnominal/tsquery'
import { CallExpression, ScriptKind } from 'typescript'

export default async function removeAddInitializeModuleGuard(tree: Tree) {
  const ngModuleQuery = 'Decorator > CallExpression:has(Identifier[name="NgModule"])'
  removeImportValuesFromModule(
    tree,
    'src',
    '@onecx/angular-integration-interface',
    'addInitializeModuleGuard',
    ngModuleQuery
  )
  removeImportValuesFromModule(
    tree,
    'src',
    '@onecx/portal-integration-angular',
    'addInitializeModuleGuard',
    ngModuleQuery
  )

  visitNotIgnoredFiles(tree, 'src', (filePath) => {
    if (!filePath.endsWith('.ts')) return

    const content = tree.read(filePath, 'utf-8')
    if (!content) return

    const updated = replace(
      content,
      'CallExpression > CallExpression:has(Identifier[name="addInitializeModuleGuard"])',
      (node) => {
        const callExpressionNode = node as CallExpression
        const [expression] = callExpressionNode.arguments
        return expression.getText()
      },
      ScriptKind.TS
    )

    if (updated !== content) {
      tree.write(filePath, updated)
    }
  })

  await formatFiles(tree)
}


```

### File: angular-integration-interface/migrations/v6/remove-auth-service.spec.ts

```ts

import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree, logger } from '@nx/devkit'
import removeAuthService from './remove-auth-service';

describe('remove-auth-service', () => {
  let tree: Tree
  let spy: jest.SpyInstance;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
    spy = jest.spyOn(logger, 'warn').mockImplementation(jest.fn())
  })

  afterEach(() => {
    spy.mockRestore()
  })
  it('should remove AUTH_SERVICE import when imported from @onecx/angular-integration-interface', async () => {
    tree.write(
      'src/app/header.component.ts',
      `
      import { NgModule } from "@angular/core";
      import { AUTH_SERVICE, otherImport } from "@onecx/angular-integration-interface";
      import { KeycloakAuthService } from "./keycloak-auth.service";
      import { OtherProvider } from "other";

      @NgModule({
        providers: [
          {
            provide: AUTH_SERVICE,
            useClass: KeycloakAuthService
          },
          otherProvider
        ]
      })
      export class AuthModule {}
      `
    );
   
    await removeAuthService(tree);
    const content = tree.read('src/app/header.component.ts')?.toString();
    expect(content).toEqualIgnoringWhitespace(
      `
      import { NgModule } from "@angular/core";
      import { otherImport } from "@onecx/angular-integration-interface";
      import { KeycloakAuthService } from "./keycloak-auth.service";
      import { OtherProvider } from "other";

      @NgModule({
        providers: [
          {
            provide: AUTH_SERVICE,
            useClass: KeycloakAuthService
          },
          otherProvider
        ]
      })
      export class AuthModule {}
      `
    );
    expect(spy).toHaveBeenCalledWith(
      'AUTH_SERVICE is no longer available. Please adapt the usages accordingly and use permission service or user service instead. Found in: src/app/header.component.ts'
    )
  });

   it('should remove AUTH_SERVICE import when imported from @onecx/portal-integration-angular', async () => {
    tree.write(
      'src/app/header2.component.ts',
      `
      import { NgModule } from "@angular/core";
      import { AUTH_SERVICE } from "@onecx/portal-integration-angular";
      import { KeycloakAuthService } from "./keycloak-auth.service";
      import { OtherProvider } from "other";

      @NgModule({
        providers: [
          {
            provide: AUTH_SERVICE,
            useClass: KeycloakAuthService
          },
          otherProvider
        ]
      })
      export class AuthModule {}
      `
    );
   
    await removeAuthService(tree);
    const content = tree.read('src/app/header2.component.ts')?.toString();
    expect(content).toEqualIgnoringWhitespace(
      `
      import { NgModule } from "@angular/core";    
      import { KeycloakAuthService } from "./keycloak-auth.service";
      import { OtherProvider } from "other";

      @NgModule({
        providers: [
          {
            provide: AUTH_SERVICE,
            useClass: KeycloakAuthService
          },
          otherProvider
        ]
      })
      export class AuthModule {}
      `
    );
    expect(spy).toHaveBeenCalledWith(
      'AUTH_SERVICE is no longer available. Please adapt the usages accordingly and use permission service or user service instead. Found in: src/app/header2.component.ts'
    )
  });

  it('should not remove AUTH_SERVICE import if imported from another package', async () => {
    tree.write(
      'src/app/header3.component.ts',
      `
      import { NgModule } from "@angular/core";
      import { AUTH_SERVICE } from "other-package";
      import { KeycloakAuthService } from "./keycloak-auth.service";
      import { OtherProvider } from "other";

      @NgModule({
        providers: [
          {
            provide: AUTH_SERVICE,
            useClass: KeycloakAuthService
          },
          otherProvider
        ]
      })
      export class AuthModule {}
      `
    );
   
    await removeAuthService(tree);
    const content = tree.read('src/app/header3.component.ts')?.toString();
    expect(content).toEqualIgnoringWhitespace(
      `
      import { NgModule } from "@angular/core";
      import { AUTH_SERVICE } from "other-package";
      import { KeycloakAuthService } from "./keycloak-auth.service";
      import { OtherProvider } from "other";

      @NgModule({
        providers: [
          {
            provide: AUTH_SERVICE,
            useClass: KeycloakAuthService
          },
          otherProvider
        ]
      })
      export class AuthModule {}
      `
    );
    expect(spy).not.toHaveBeenCalledWith(
      'AUTH_SERVICE is no longer available. Please adapt the usages accordingly and use permission service or user service instead. Found in: src/app/header3.component.ts'
    )
  });

  it('should remove IAuthService import when imported from @onecx/angular-integration-interface', async () => {
    tree.write(
      'src/app/test.component.ts',
      `
      import { IAuthService } from "@onecx/angular-integration-interface";

      authService.getIdToken();

      `
    );
   
    await removeAuthService(tree);
    const content = tree.read('src/app/test.component.ts')?.toString();
    expect(content).toEqualIgnoringWhitespace(
      `
      authService.getIdToken();
      `
    );
    expect(spy).toHaveBeenCalledWith(
      'IAuthService is no longer available. Please adapt the usages accordingly. Found in: src/app/test.component.ts'
    )
  });

   it('should remove IAuthService import when imported from @onecx/portal-integration-angular', async () => {
    tree.write(
      'src/app/test.component.ts',
      `
      import { IAuthService } from "@onecx/portal-integration-angular";

      authService.getIdToken();

      `
    );
   
    await removeAuthService(tree);
    const content = tree.read('src/app/test.component.ts')?.toString();
    expect(content).toEqualIgnoringWhitespace(
      `
      authService.getIdToken();
      `
    );
    expect(spy).toHaveBeenCalledWith(
      'IAuthService is no longer available. Please adapt the usages accordingly. Found in: src/app/test.component.ts'
    )
  });

  it('should not remove IAuthService import when imported from another package', async () => {
    tree.write(
      'src/app/test.component.ts',
      `
      import { IAuthService } from "other-package";

      constructor(authService: IAuthService) {
        authService.getIdToken();
      }
      `
    );
   
    await removeAuthService(tree);
    const content = tree.read('src/app/test.component.ts')?.toString();
    expect(content).toEqualIgnoringWhitespace(
      `
      import { IAuthService } from "other-package";

      constructor(authService: IAuthService) {
        authService.getIdToken();
      }
      `
    );
    expect(spy).not.toHaveBeenCalledWith(
      'IAuthService is no longer available. Please adapt the usages accordingly. Found in: src/app/test.component.ts'
    )
  });
});

```

### File: angular-integration-interface/migrations/v6/remove-auth-service.ts

```ts

import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { printWarnings } from '@onecx/nx-migration-utils'
import { removeAndTrackImport } from './utils/remove-and-track-import'

const INTERFACE_NAME = 'IAuthService';
const AUTH_SERVICE_NAME = 'AUTH_SERVICE';
const IMPORT_PATHS = [
  '@onecx/angular-integration-interface',
  '@onecx/portal-integration-angular',
];

export default async function removeAuthService(tree: Tree) {
  const affectedFiles = new Set<string>()
  const affectedAuthServiceFiles = new Set<string>()

  visitNotIgnoredFiles(tree, 'src', (filePath) => {
    if (!filePath.endsWith('.ts')) return;
    const fileContent = tree.read(filePath, 'utf-8');
    if (!fileContent) return;

    removeAndTrackImport(tree, filePath, fileContent, IMPORT_PATHS, INTERFACE_NAME, affectedFiles);
    removeAndTrackImport(tree, filePath, fileContent, IMPORT_PATHS, AUTH_SERVICE_NAME, affectedAuthServiceFiles);
  });

  printWarnings(
    `IAuthService is no longer available. Please adapt the usages accordingly.`,
    Array.from(affectedFiles)
  );

  printWarnings(
    `AUTH_SERVICE is no longer available. Please adapt the usages accordingly and use permission service or user service instead.`,
    Array.from(affectedAuthServiceFiles)
  );
}

```

### File: angular-integration-interface/migrations/v6/replace-provide-app-service-mock.spec.ts

```ts

import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import replaceProvideAppServiceMock from './replace-provide-app-service-mock';

describe('replace-provide-app-service-mock', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })
  
  it('should replace provideAppServiceMock with provideAppStateServiceMock', async () => {
    const filePath = 'src/app/component.ts';
    tree.write(
      filePath,
      `
      import { provideAppServiceMock } from '@onecx/angular-integration-interface/mocks';
      import { OtherProvider } from 'other';
      describe('MultipleProviders', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            providers: [
              provideAppServiceMock(),
              OtherProvider,
            ]
          });
        });
      });
      `
    );
    await replaceProvideAppServiceMock(tree);
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
      import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks';
      import { OtherProvider } from 'other';
      describe('MultipleProviders', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            providers: [
              provideAppStateServiceMock(),
              OtherProvider,
            ]
          });
        });
      });
      `);
  });

  it('should not replace if provideAppServiceMock is imported from a different package', async () => {
    const filePath = 'src/app/component2.ts';
    const expectedCode =  `
      import { provideAppServiceMock } from 'some-other-package';
      import { TestBed } from '@angular/core/testing';
      describe('OtherService', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            providers: [
              provideAppServiceMock(),
            ]
          });
        });
      });`
    tree.write(filePath, expectedCode);
    await replaceProvideAppServiceMock(tree);
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(expectedCode);
  });

  it('should replace provideAppServiceMock only when imported from the correct package, even with alias', async () => {
    const filePath = 'src/app/component3.ts';
    tree.write(
      filePath,
      `
      import { provideAppServiceMock as mockProvider } from '@onecx/angular-integration-interface/mocks';
      describe('Aliased', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            providers: [
              mockProvider(),
            ]
          });
        });
      });
      `
    );
    await replaceProvideAppServiceMock(tree);
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
      import { provideAppStateServiceMock as mockProvider } from '@onecx/angular-integration-interface/mocks';
      describe('Aliased', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            providers: [
              mockProvider(),
            ]
          });
        });
      });
      `);
  });

  it('should not replace if provideAppServiceMock is not imported', async () => {
    const filePath = 'src/app/component4.ts';
    const expectedCode = `
      import { SomethingElse } from '@onecx/angular-integration-interface/mocks';
      describe('NoProviderImport', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            providers: [
              provideAppServiceMock(),
            ]
          });
        });
      });
      `
    tree.write(filePath, expectedCode);
    await replaceProvideAppServiceMock(tree);
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(expectedCode);
  });
});


```

### File: angular-integration-interface/migrations/v6/replace-provide-app-service-mock.ts

```ts

import { Tree } from '@nx/devkit';
import { replaceInFiles } from '@onecx/nx-migration-utils/angular';

const PROVIDER_NAME = 'provideAppServiceMock';
const PROVIDER_NEW_NAME = 'provideAppStateServiceMock';
const PROVIDER_IMPORT_PATH = '@onecx/angular-integration-interface/mocks';

export default async function replaceProvideAppServiceMock(tree: Tree) {
  const srcDirectoryPath = 'src';

  // Replace all usages of provideAppServiceMock with provideAppStateServiceMock in all files that import provideAppServiceMock from @onecx/angular-integration-interface/mocks
  const filterQuery = `ImportDeclaration:has(StringLiteral[value="${PROVIDER_IMPORT_PATH}"]) ImportSpecifier:has(Identifier[name="${PROVIDER_NAME}"])`;
  replaceInFiles(
    tree,
    srcDirectoryPath,
    `Identifier[name="${PROVIDER_NAME}"]`,
    PROVIDER_NEW_NAME,
    filterQuery
  );
}

```

### File: angular-integration-interface/migrations/v6/warn-removed-properties-from-theme-service.spec.ts

```ts

import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { logger, Tree } from '@nx/devkit'
import {
  warnThemeServiceRemovedProperties,
  warnThemeServiceRemovedMethods,
} from './warn-removed-properties-from-theme-service'

describe('warn-removed-properties-from-theme-service', () => {
  let tree: Tree
  let spy: jest.SpyInstance
  const rootDir = 'src/'

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
    spy = jest.spyOn(logger, 'warn').mockImplementation(jest.fn())
  })

  afterEach(() => {
    spy.mockRestore()
  })

  describe('ThemeService property detection', () => {
    it('should detect baseUrlV1 property usage', async () => {
      const filePath = 'src/app/component.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';
        import { ThemeService } from '@onecx/angular-integration-interface';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor(private themeService: ThemeService) {
            console.log(this.themeService.baseUrlV1);
          }
        }
      `
      )

      warnThemeServiceRemovedProperties(tree, rootDir)
      expect(spy).toHaveBeenCalledWith(
        `ThemeService property baseUrlV1 have been removed in v6. Please remove these usages and adapt your code accordingly. Found in: ${filePath}`
      )
    })
  })

  describe('ThemeService method detection', () => {
    it('should detect getThemeRef method usage', async () => {
      const filePath = 'src/app/component2.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';
        import { ThemeService } from '@onecx/angular-integration-interface';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor(private themeService: ThemeService) {
            const themeRef = this.themeService.getThemeRef('dark');
          }
        }
      `
      )

      warnThemeServiceRemovedMethods(tree, rootDir)

      expect(spy).toHaveBeenCalledWith(
        `ThemeService method 'getThemeRef' has been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly. Found in: ${filePath}`
      )
    })

    it('should detect loadAndApplyTheme method usage', async () => {
      const filePath = 'src/app/component3.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';
        import { ThemeService } from '@onecx/angular-integration-interface';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor(private themeService: ThemeService) {}

          async loadTheme() {
            await this.themeService.loadAndApplyTheme('light');
          }
        }
      `
      )

      warnThemeServiceRemovedMethods(tree, rootDir)

      expect(spy).toHaveBeenCalledWith(
        `ThemeService method 'loadAndApplyTheme' has been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly. Found in: ${filePath}`
      )
    })

    it('should detect apply method usage', async () => {
      const filePath = 'src/app/component4.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';
        import { ThemeService } from '@onecx/angular-integration-interface';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor(private themeService: ThemeService) {}

          applyCustomTheme() {
            this.themeService.apply({ primaryColor: '#ff0000' });
          }
        }
      `
      )

      warnThemeServiceRemovedMethods(tree, rootDir)

      expect(spy).toHaveBeenCalledWith(
        `ThemeService method 'apply' has been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly. Found in: ${filePath}`
      )
    })

    it('should detect multiple method usages in one file', async () => {
      const filePath = 'src/app/component5.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';
        import { ThemeService } from '@onecx/angular-integration-interface';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor(private themeService: ThemeService) {}

          manageThemes() {
            const ref = this.themeService.getThemeRef('light');
            this.themeService.loadAndApplyTheme('dark');
            this.themeService.apply({ theme: 'custom' });
          }
        }
      `
      )

      warnThemeServiceRemovedMethods(tree, rootDir)

      expect(spy).toHaveBeenCalledWith(
        `ThemeService method 'getThemeRef' has been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly. Found in: ${filePath}`
      )
      expect(spy).toHaveBeenCalledWith(
        `ThemeService method 'loadAndApplyTheme' has been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly. Found in: ${filePath}`
      )
      expect(spy).toHaveBeenCalledWith(
        `ThemeService method 'apply' has been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly. Found in: ${filePath}`
      )
    })
  })

  describe('Combined property and method detection', () => {
    it('should detect both property and method usages in same file', async () => {
      const filePath = 'src/app/component6.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';
        import { ThemeService } from '@onecx/angular-integration-interface';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor(private themeService: ThemeService) {}

          manageThemes() {
            const ref = this.themeService.getThemeRef('light');
            console.log(this.themeService.baseUrlV1);
          }
        }
      `
      )

      warnThemeServiceRemovedProperties(tree, rootDir)
      warnThemeServiceRemovedMethods(tree, rootDir)

      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenCalledWith(
        `ThemeService property baseUrlV1 have been removed in v6. Please remove these usages and adapt your code accordingly. Found in: ${filePath}`
      )
      expect(spy).toHaveBeenCalledWith(
        `ThemeService method 'getThemeRef' has been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly. Found in: ${filePath}`
      )
    })
  })

  describe('No warnings when no removed features are used', () => {
    it('should not warn when ThemeService is used but no removed properties or methods are accessed', async () => {
      const filePath = 'src/app/component7.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';
        import { ThemeService } from '@onecx/angular-integration-interface';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor(private themeService: ThemeService) {
            // Only using the allowed currentTheme$ property
            this.themeService.currentTheme$.subscribe(theme => {
              console.log('Current theme:', theme);
            });
          }
        }
      `
      )

      warnThemeServiceRemovedProperties(tree, rootDir)
      warnThemeServiceRemovedMethods(tree, rootDir)

      expect(spy).not.toHaveBeenCalled()
    })

    it('should not warn when no ThemeService is used at all', async () => {
      const filePath = 'src/app/component8.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor() {
            console.log('No ThemeService used here');
          }
        }
      `
      )

      warnThemeServiceRemovedProperties(tree, rootDir)
      warnThemeServiceRemovedMethods(tree, rootDir)

      expect(spy).not.toHaveBeenCalled()
    })
  })
})


```

### File: angular-integration-interface/migrations/v6/warn-removed-properties-from-theme-service.ts

```ts

import { Tree } from '@nx/devkit'
import { printWarnings, detectMethodCallsInFiles } from '@onecx/nx-migration-utils'

const THEME_SERVICE_REMOVED_PROPERTY = 'baseUrlV1'
const THEME_SERVICE_REMOVED_METHODS = ['getThemeRef', 'loadAndApplyTheme', 'apply']

export function warnThemeServiceRemovedProperties(tree: Tree, srcDirectoryPath: string) {
  const detectedPropertyInFiles = detectMethodCallsInFiles(
    tree,
    srcDirectoryPath,
    THEME_SERVICE_REMOVED_PROPERTY,
    'ThemeService'
  )

  if (detectedPropertyInFiles.size > 0) {
    const warningPropertyCalls = `ThemeService property ${THEME_SERVICE_REMOVED_PROPERTY} have been removed in v6. Please remove these usages and adapt your code accordingly.`
    printWarnings(warningPropertyCalls, Array.from(detectedPropertyInFiles.keys()))
  }
}

export function warnThemeServiceRemovedMethods(tree: Tree, srcDirectoryPath: string) {
  THEME_SERVICE_REMOVED_METHODS.forEach((method) => {
    const detectedMethodCalls = detectMethodCallsInFiles(tree, srcDirectoryPath, method, 'ThemeService')
    if (detectedMethodCalls.size > 0) {
      const warningMethodCall = `ThemeService method '${method}' has been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly.`
      printWarnings(warningMethodCall, Array.from(detectedMethodCalls.keys()))
    }
  })
}


```

## Folder: angular-integration-interface/migrations/v6/utils (1 files)

### File: angular-integration-interface/migrations/v6/utils/remove-and-track-import.ts

```ts

import { Tree } from "@nx/devkit";
import { removeImportSpecifierFromImport } from "@onecx/nx-migration-utils";
import { isImportSpecifierInContent } from "@onecx/nx-migration-utils";

export function removeAndTrackImport(tree: Tree, filePath: string, fileContent: string, importPaths: string[], importName: string, affectedSet: Set<string>) {
  for (const importPath of importPaths) {
    if (isImportSpecifierInContent(fileContent, importPath, importName)) {
      removeImportSpecifierFromImport(tree, filePath, importPath, importName);
      affectedSet.add(filePath);
    }
  }
}

```

## Folder: angular-integration-interface/mocks (9 files)

### File: angular-integration-interface/mocks/app-config-service-mock.ts

```ts

import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Config } from '@onecx/integration-interface'
import { AppConfigService } from '@onecx/angular-integration-interface'

export function provideAppConfigServiceMock() {
  return [AppConfigServiceMock, { provide: AppConfigService, useExisting: AppConfigServiceMock }]
}
@Injectable()
export class AppConfigServiceMock {
  config$ = new BehaviorSubject<{ [key: string]: string }>({})

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public init(baseUrl: string): Promise<void> {
    return new Promise((resolve) => {
      const mockConfig: Config = { key: 'config' }
      this.config$.next(mockConfig)
      resolve()
    })
  }

  public getProperty(key: string): string | undefined {
    return this.config$.getValue()?.[key]
  }

  public setProperty(key: string, val: string) {
    this.config$.next({ ...this.config$.value, [key]: val })
  }

  public getConfig(): { [key: string]: string } {
    return this.config$.getValue()
  }
}


```

### File: angular-integration-interface/mocks/app-state-service-mock.ts

```ts

import { Injectable } from '@angular/core'
import { CurrentLocationTopicPayload, MfeInfo, PageInfo, Workspace } from '@onecx/integration-interface'
// eslint-disable-next-line
import { AppStateService } from '@onecx/angular-integration-interface'
import { FakeTopic } from '@onecx/accelerator'

export function provideAppStateServiceMock() {
  return [AppStateServiceMock, { provide: AppStateService, useExisting: AppStateServiceMock }]
}

@Injectable()
export class AppStateServiceMock {
  globalError$ = new FakeTopic()
  globalLoading$ = new FakeTopic(false)
  currentMfe$ = new FakeTopic<MfeInfo>({
    mountPath: '/',
    remoteBaseUrl: '.',
    baseHref: '/',
    shellName: 'test',
    appId: 'test',
    productName: 'test',
  })
  currentPage$ = new FakeTopic<PageInfo | undefined>(undefined)
  currentPortal$ = new FakeTopic<Workspace>({
    baseUrl: '/',
    microfrontendRegistrations: [],
    portalName: 'Test portal',
    workspaceName: 'Test portal',
  })
  currentWorkspace$ = new FakeTopic<Workspace>({
    baseUrl: '/',
    microfrontendRegistrations: [],
    portalName: 'Test workspace',
    workspaceName: 'Test workspace',
  })
  currentLocation$ = new FakeTopic<CurrentLocationTopicPayload>({
    url: '/',
    isFirst: true,
  })
  isAuthenticated$ = new FakeTopic<null>(null)
}


```

### File: angular-integration-interface/mocks/configuration-service-mock.ts

```ts

import { Injectable } from '@angular/core'
import { Config } from '@onecx/integration-interface'
import { CONFIG_KEY } from '@onecx/angular-integration-interface'
import { firstValueFrom } from 'rxjs/internal/firstValueFrom'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { FakeTopic } from '@onecx/accelerator'

export function provideConfigurationServiceMock() {
  return [ConfigurationServiceMock, { provide: ConfigurationService, useExisting: ConfigurationServiceMock }]
}

@Injectable({ providedIn: 'root' })
export class ConfigurationServiceMock {
  config$ = new FakeTopic<Config>({})

  private resolveInitPromise!: (value: void | PromiseLike<void>) => void
  private isInitializedPromise: Promise<void>

  constructor() {
    this.isInitializedPromise = new Promise<void>((resolve) => {
      this.resolveInitPromise = resolve
    })
  }

  public init(config?: Config): Promise<boolean> {
    return this.config$.publish(config ?? {}).then(() => {
      this.resolveInitPromise()
      return true
    })
  }

  get isInitialized(): Promise<void> {
    return this.isInitializedPromise
  }

  public getProperty(key: CONFIG_KEY): Promise<string | undefined> {
    return firstValueFrom(this.config$.asObservable()).then((config) => config[key])
  }

  public async setProperty(key: string, val: string): Promise<void> {
    const currentValues = await firstValueFrom(this.config$.asObservable())
    currentValues[key] = val
    await this.config$.publish(currentValues)
  }

  public getConfig(): Promise<Config | undefined> {
    return firstValueFrom(this.config$.asObservable())
  }
}


```

### File: angular-integration-interface/mocks/index.ts

```ts

export * from './app-config-service-mock'
export * from './app-state-service-mock'
export * from './configuration-service-mock'
export * from './portal-message-service-mock'
export * from './remote-components-service-mock'
export * from './user-service-mock'
export * from './shell-capability-service-mock'
export * from '@onecx/accelerator'


```

### File: angular-integration-interface/mocks/ng-package.json

```json

{
  "$schema": "../../../node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "index.ts"
  }
}

```

### File: angular-integration-interface/mocks/portal-message-service-mock.ts

```ts

import { Injectable } from '@angular/core'
import { FakeTopic } from '@onecx/accelerator'
import { Message as PortalMessage, PortalMessageService } from '@onecx/angular-integration-interface'
import { Message } from '@onecx/integration-interface'

export function providePortalMessageServiceMock() {
  return [PortalMessageServiceMock, { provide: PortalMessageService, useExisting: PortalMessageServiceMock }]
}
@Injectable({ providedIn: 'any' })
export class PortalMessageServiceMock {
  message$ = new FakeTopic<Message>()

  success(msg: PortalMessage) {
    this.addTranslated('success', msg)
  }

  info(msg: PortalMessage) {
    this.addTranslated('info', msg)
  }

  error(msg: PortalMessage) {
    this.addTranslated('error', msg)
  }

  warning(msg: PortalMessage) {
    this.addTranslated('warning', msg)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private addTranslated(severity: string, msg: PortalMessage) {
    this.message$.publish({
      ...msg,
      severity: severity,
    })
  }
}


```

### File: angular-integration-interface/mocks/remote-components-service-mock.ts

```ts

import { Injectable } from '@angular/core'
import { RemoteComponentsInfo } from '@onecx/integration-interface'
import { RemoteComponentsService } from '@onecx/angular-integration-interface'
import { FakeTopic } from '@onecx/accelerator'

export function provideRemoteComponentsServiceMock() {
  return [RemoteComponentsServiceMock, { provide: RemoteComponentsService, useExisting: RemoteComponentsServiceMock }]
}
@Injectable({ providedIn: 'root' })
export class RemoteComponentsServiceMock {
  remoteComponents$ = new FakeTopic<RemoteComponentsInfo>()
}


```

### File: angular-integration-interface/mocks/shell-capability-service-mock.ts

```ts

import { Injectable } from '@angular/core'
import { Capability, ShellCapabilityService } from '@onecx/angular-integration-interface'

export function provideShellCapabilityServiceMock() {
  return [ShellCapabilityServiceMock, { provide: ShellCapabilityService, useExisting: ShellCapabilityServiceMock }]
}

@Injectable()
export class ShellCapabilityServiceMock {
  static capabilities: Capability[] = []

  static setCapabilities(capabilities: Capability[]): void {
    ShellCapabilityServiceMock.capabilities = capabilities
  }

  hasCapability(capability: Capability): boolean {
    return ShellCapabilityServiceMock.capabilities?.includes(capability) ?? false
  }
}


```

### File: angular-integration-interface/mocks/user-service-mock.ts

```ts

import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { UserProfile } from '@onecx/integration-interface'
import { UserService } from '@onecx/angular-integration-interface'
import { FakeTopic } from '@onecx/accelerator'

export function provideUserServiceMock() {
  return [UserServiceMock, { provide: UserService, useExisting: UserServiceMock }]
}

@Injectable({ providedIn: 'root' })
export class UserServiceMock {
  profile$ = new FakeTopic<UserProfile>()
  permissionsTopic$ = new FakeTopic<string[]>(['mocked-permission'])
  lang$ = new BehaviorSubject('en')

  async hasPermission(permissionKey: string | string[]): Promise<boolean> {
    if (Array.isArray(permissionKey)) {
      return permissionKey.every(async (key) => await this.hasPermission(key))
    }

    const result = this.permissionsTopic$.getValue()?.includes(permissionKey)
    if (!result) {
      console.log(`ðŸ‘®â€â™€ï¸ No permission for: ${permissionKey}`)
    }
    return !!result
  }

  getPermissions(): Observable<string[]> {
    return this.permissionsTopic$.asObservable()
  }

  determineLanguage(): string | undefined {
    return 'mocked-lang'
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  extractPermissions(userProfile: UserProfile): string[] | null {
    return ['mocked-permission']
  }

  get isInitialized(): Promise<void> {
    return Promise.resolve()
  }
}

export type MockUserService = UserServiceMock


```

## Folder: angular-integration-interface/src (2 files)

### File: angular-integration-interface/src/index.ts

```ts

// services
export * from './lib/services/app-config-service'
export * from './lib/services/app-state.service'
export * from './lib/services/configuration.service'
export * from './lib/services/user.service'
export * from './lib/services/portal-message.service'
export * from './lib/services/theme.service'
export * from './lib/services/remote-components.service'
export * from './lib/services/workspace.service'
export * from './lib/services/shell-capability.service'

// models
export * from './lib/model/config-key.model'

// core
export * from './lib/api/injection-tokens'

// utils

export { MfeInfo, Theme } from '@onecx/integration-interface'


```

### File: angular-integration-interface/src/test-setup.ts

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

## Folder: angular-integration-interface/src/lib/api (2 files)

### File: angular-integration-interface/src/lib/api/constants.ts

```ts

export const API_PREFIX = 'portal-api'

export const DEFAULT_LANG = 'en'


```

### File: angular-integration-interface/src/lib/api/injection-tokens.ts

```ts

import { InjectionToken } from '@angular/core'

export interface LibConfig {
  appId: string
  portalId: string
  /**
   * If true, the tkit-module will not try to load remote env values from server(GET /assets/env.json)
   */
  skipRemoteConfigLoad: boolean
  /**
   * URL from which the remote config will be loaded, default: '/assets/env.json'
   */
  remoteConfigURL: string
}
export const APP_CONFIG = new InjectionToken<LibConfig>('APP_CONFIG')

export const SANITY_CHECK = new InjectionToken<string>('OCXSANITY_CHECK')

export const APPLICATION_NAME = new InjectionToken<string>('APPLICATION_NAME')


```

## Folder: angular-integration-interface/src/lib/model (1 files)

### File: angular-integration-interface/src/lib/model/config-key.model.ts

```ts

export enum CONFIG_KEY {
  TKIT_PORTAL_DEFAULT_THEME = 'TKIT_PORTAL_DEFAULT_THEME',
  TKIT_PORTAL_DISABLE_THEME_MANAGEMENT = 'TKIT_PORTAL_DISABLE_THEME_MANAGEMENT',
  TKIT_PORTAL_THEME_SERVER_URL = 'TKIT_PORTAL_THEME_SERVER_URL',
  TKIT_TOKEN_ROLE_CLAIM_NAME = 'TKIT_TOKEN_ROLE_CLAIM_NAME',
  TKIT_PORTAL_ID = 'TKIT_PORTAL_ID',
  TKIT_SUPPORTED_LANGUAGES = 'TKIT_SUPPORTED_LANGUAGES',
  TKIT_SEARCH_BASE_URL = 'TKIT_SEARCH_BASE_URL',
  APP_BASE_HREF = 'APP_BASE_HREF',
  KEYCLOAK_REALM = 'KEYCLOAK_REALM',
  KEYCLOAK_ENABLE_SILENT_SSO = 'KEYCLOAK_ENABLE_SILENT_SSO',
  KEYCLOAK_URL = 'KEYCLOAK_URL',
  KEYCLOAK_CLIENT_ID = 'KEYCLOAK_CLIENT_ID',
  ONECX_PORTAL_FAVORITES_DISABLED = 'ONECX_PORTAL_FAVORITES_DISABLED',
  ONECX_PORTAL_FEEDBACK_DISABLED = 'ONECX_PORTAL_FEEDBACK_DISABLED',
  ONECX_PORTAL_SEARCH_DISABLED = 'ONECX_PORTAL_SEARCH_DISABLED',
  ONECX_PORTAL_SUPPORT_TICKET_DISABLED = 'ONECX_PORTAL_SUPPORT_TICKET_DISABLED',
  ONECX_PORTAL_ANNOUNCEMENTS_DISABLED = 'ONECX_PORTAL_ANNOUNCEMENTS_DISABLED',
  ONECX_PORTAL_PASSWORD_CHANGE_DISABLED = 'ONECX_PORTAL_PASSWORD_CHANGE_DISABLED',
  ONECX_PORTAL_SETTINGS_DISABLED = 'ONECX_PORTAL_SETTINGS_DISABLED',
  ONECX_PORTAL_MY_ROLES_PERMISSIONS_DISABLED = 'ONECX_PORTAL_MY_ROLES_PERMISSIONS_DISABLED',
  ONECX_PORTAL_HELP_DISABLED = 'ONECX_PORTAL_HELP_DISABLED',
  ONECX_PORTAL_SEARCH_BUTTONS_REVERSED = 'ONECX_PORTAL_SEARCH_BUTTONS_REVERSED',
  APP_VERSION = 'APP_VERSION',
  IS_SHELL = 'IS_SHELL',
  AUTH_SERVICE = 'AUTH_SERVICE',
  AUTH_SERVICE_CUSTOM_URL = 'AUTH_SERVICE_CUSTOM_URL',
  AUTH_SERVICE_CUSTOM_MODULE_NAME = 'AUTH_SERVICE_CUSTOM_MODULE_NAME',
  POLYFILL_SCOPE_MODE = 'POLYFILL_SCOPE_MODE'
}

export enum POLYFILL_SCOPE_MODE {
  PERFORMANCE = 'PERFORMANCE',
  PRECISION = 'PRECISION',
}

```

## Folder: angular-integration-interface/src/lib/services (15 files)

### File: angular-integration-interface/src/lib/services/app-config-service.ts

```ts

import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Config } from '@onecx/integration-interface'
import { BehaviorSubject, firstValueFrom } from 'rxjs'

@Injectable()
export class AppConfigService {
  private http = inject(HttpClient)

  config$ = new BehaviorSubject<{ [key: string]: string }>({})

  public init(baseUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const loadConfigPromise: Promise<Config> = firstValueFrom(
        this.http.get<Config>(Location.joinWithSlash(baseUrl, 'assets/env.json'))
      )

      loadConfigPromise
        .then(async (config) => {
          if (config) {
            this.config$.next(config)
            resolve()
          }
        })
        .catch((e) => {
          console.log(`Failed to load env configuration`)
          reject(e)
        })
    })
  }

  public getProperty(key: string): string | undefined {
    return this.config$.getValue()?.[key]
  }

  public setProperty(key: string, val: string) {
    this.config$.next({ ...this.config$.value, [key]: val })
  }

  public getConfig(): { [key: string]: string } {
    return this.config$.getValue()
  }
}


```

### File: angular-integration-interface/src/lib/services/app-state.service.ts

```ts

import { Injectable, OnDestroy } from '@angular/core'
import {
  GlobalErrorTopic,
  GlobalLoadingTopic,
  CurrentMfeTopic,
  CurrentPageTopic,
  CurrentWorkspaceTopic,
  IsAuthenticatedTopic,
  CurrentLocationTopic,
} from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class AppStateService implements OnDestroy {
  private _globalError$: GlobalErrorTopic | undefined
  get globalError$(): GlobalErrorTopic {
    this._globalError$ ??= new GlobalErrorTopic()
    return this._globalError$
  }
  set globalError$(source: GlobalErrorTopic) {
    this._globalError$ = source
  }
  private _globalLoading$: GlobalLoadingTopic | undefined
  get globalLoading$(): GlobalLoadingTopic {
    this._globalLoading$ ??= new GlobalLoadingTopic()
    return this._globalLoading$
  }
  set globalLoading$(source: GlobalLoadingTopic) {
    this._globalLoading$ = source
  }
  private _currentMfe$: CurrentMfeTopic | undefined
  get currentMfe$(): CurrentMfeTopic {
    this._currentMfe$ ??= new CurrentMfeTopic()
    return this._currentMfe$
  }
  set currentMfe$(source: CurrentMfeTopic) {
    this._currentMfe$ = source
  }
  private _currentLocation$: CurrentLocationTopic | undefined
  get currentLocation$(): CurrentLocationTopic {
    this._currentLocation$ ??= new CurrentLocationTopic()
    return this._currentLocation$
  }
  set currentLocation$(source: CurrentLocationTopic) {
    this._currentLocation$ = source
  }

  private _currentPage$: CurrentPageTopic | undefined
  /**
   * This topic will only fire when pageInfo.path matches document.location.pathname,
   * if not it will fire undefined.
   */
  get currentPage$(): CurrentPageTopic {
    this._currentPage$ ??= new CurrentPageTopic()
    return this._currentPage$
  }
  set currentPage$(source: CurrentPageTopic) {
    this._currentPage$ = source
  }
  _currentWorkspace$: CurrentWorkspaceTopic | undefined
  get currentWorkspace$(): CurrentWorkspaceTopic {
    this._currentWorkspace$ ??= new CurrentWorkspaceTopic()
    return this._currentWorkspace$
  }
  set currentWorkspace$(source: CurrentWorkspaceTopic) {
    this._currentWorkspace$ = source
  }

  /**
   * This Topic is initialized as soon as the authentication is done
   */
  private _isAuthenticated$: IsAuthenticatedTopic | undefined
  get isAuthenticated$(): IsAuthenticatedTopic {
    this._isAuthenticated$ ??= new IsAuthenticatedTopic()
    return this._isAuthenticated$
  }
  set isAuthenticated$(source: IsAuthenticatedTopic) {
    this._isAuthenticated$ = source
  }

  ngOnDestroy(): void {
    this._globalError$?.destroy()
    this._globalLoading$?.destroy()
    this._currentMfe$?.destroy()
    this._currentPage$?.destroy()
    this._currentLocation$?.destroy()
    this._currentWorkspace$?.destroy()
    this._isAuthenticated$?.destroy()
  }
}


```

### File: angular-integration-interface/src/lib/services/configuration.service.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ConfigurationService } from './configuration.service'
import { FakeTopic } from '@onecx/accelerator'
import { CONFIG_KEY } from '../model/config-key.model'
import { Config } from '@onecx/integration-interface'

describe('ConfigurationService', () => {
  let configuration: ConfigurationService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [ConfigurationService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents()
    configuration = TestBed.inject(ConfigurationService)
    ;(configuration as any).config$ = new FakeTopic<Config>()
    ;(configuration as any).config$.publish({ [CONFIG_KEY.IS_SHELL]: 'true' })
  })

  it('should be created', () => {
    expect(configuration).toBeTruthy()
  })

  describe('getProperty', () => {
    it('should return the property value for a valid key that was set before', async () => {
      const expectedValue = '1.x.0'
      await configuration.setProperty(CONFIG_KEY.APP_VERSION, expectedValue)
      const value = await configuration.getProperty(CONFIG_KEY.APP_VERSION)

      expect(value).toBe(expectedValue)
    })

    it('should log an error for an invalid key', async () => {
      console.error = jest.fn()
      await configuration.getProperty('invalidKey' as unknown as CONFIG_KEY)
      expect(console.error).toHaveBeenCalledWith('Invalid config key ', 'invalidKey')
    })
  })
})


```

### File: angular-integration-interface/src/lib/services/configuration.service.ts

```ts

import { HttpClient } from '@angular/common/http'
import { Injectable, OnDestroy, inject } from '@angular/core'
import { firstValueFrom, map } from 'rxjs'
import { Config, ConfigurationTopic } from '@onecx/integration-interface'
import { APP_CONFIG } from '../api/injection-tokens'
import { CONFIG_KEY } from '../model/config-key.model'
import Semaphore from 'ts-semaphore'

@Injectable({ providedIn: 'root' })
export class ConfigurationService implements OnDestroy {
  private http = inject(HttpClient)
  private defaultConfig = inject<{
    [key: string]: string
  }>(APP_CONFIG, { optional: true })

  _config$: ConfigurationTopic | undefined
  get config$() {
    this._config$ ??= new ConfigurationTopic()
    return this._config$
  }
  set config$(source: ConfigurationTopic) {
    this._config$ = source
  }
  private semaphore = new Semaphore(1)

  ngOnDestroy(): void {
    this._config$?.destroy()
  }

  public init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const skipRemoteConfigLoad = this.defaultConfig && this.defaultConfig['skipRemoteConfigLoad']
      let loadConfigPromise: Promise<Config>

      const inlinedConfig = (window as typeof window & { APP_CONFIG: Config })['APP_CONFIG']
      if (inlinedConfig) {
        console.log(`ENV resolved from injected config`)
        loadConfigPromise = Promise.resolve(inlinedConfig)
      } else {
        if (skipRemoteConfigLoad) {
          console.log(
            'ðŸ“¢ TKA001: Remote config load is disabled. To enable it, remove the "skipRemoteConfigLoad" key in your environment.json'
          )
          loadConfigPromise = Promise.resolve(this.defaultConfig || {})
        } else {
          loadConfigPromise = firstValueFrom(
            this.http.get<Config>((this.defaultConfig && this.defaultConfig['remoteConfigURL']) || 'assets/env.json')
          )
        }
      }

      loadConfigPromise
        .then(async (config) => {
          await this.config$.publish({ ...this.defaultConfig, ...(config ?? {}) }).then(() => {
            resolve(true)
          })
        })
        .catch((e) => {
          console.log(`Failed to load env configuration`)
          reject(e)
        })
    })
  }

  get isInitialized(): Promise<void> {
    return this.config$.isInitialized
  }

  public async getProperty(key: CONFIG_KEY): Promise<string | undefined> {
    if (!Object.values(CONFIG_KEY).includes(key)) {
      console.error('Invalid config key ', key)
    }
    return firstValueFrom(this.config$.pipe(map((config) => config[key])))
  }

  public async setProperty(key: string, val: string) {
    return this.semaphore.use(async () => {
      const currentValues = await firstValueFrom(this.config$.asObservable())
      currentValues[key] = val
      await this.config$.publish(currentValues)
    })
  }

  public async getConfig(): Promise<Config | undefined> {
    return firstValueFrom(this.config$.asObservable())
  }
}


```

### File: angular-integration-interface/src/lib/services/parameters.service.spec.ts

```ts

import {
  FakeTopic,
  provideAppStateServiceMock,
  provideShellCapabilityServiceMock,
  ShellCapabilityServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { ParametersService } from './parameters.service'
import { Capability } from './shell-capability.service'
import { ParametersTopicPayload } from '@onecx/integration-interface'
import { TestBed } from '@angular/core/testing'

describe('ParametersService', () => {
  let parametersService: ParametersService
  let parametersTopic: FakeTopic<ParametersTopicPayload>

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideShellCapabilityServiceMock(), provideAppStateServiceMock()],
    })
    parametersService = TestBed.inject(ParametersService)
    parametersTopic = new FakeTopic<ParametersTopicPayload>()
    parametersService['parameters$'] = parametersTopic as any
  })

  it('should be created', () => {
    expect(parametersService).toBeTruthy()
  })

  it('should return the default value if capability is not available', async () => {
    ShellCapabilityServiceMock.setCapabilities([])

    const defaultValue = 'default'
    const result = await parametersService.get('key', defaultValue)

    expect(result).toBe(defaultValue)
  })

  it('should return the parameter value if capability is available', async () => {
    ShellCapabilityServiceMock.setCapabilities([Capability.PARAMETERS_TOPIC])

    const key = 'key'
    const value = 'value'
    await parametersTopic.publish({
      parameters: [{ productName: 'test', appId: 'test', parameters: { [key]: value } }],
    })

    const result = await parametersService.get(key, 'default')

    expect(result).toBe(value)
  })

  it('should return the default value if parameter value is undefined', async () => {
    ShellCapabilityServiceMock.setCapabilities([Capability.PARAMETERS_TOPIC])

    const key = 'key'
    await parametersTopic.publish({ parameters: [{ productName: 'test', appId: 'test', parameters: {} }] })

    const defaultValue = 'default'
    const result = await parametersService.get(key, defaultValue)

    expect(result).toBe(defaultValue)
  })

  it('should return the default value if no parameters for the app are in payload', async () => {
    ShellCapabilityServiceMock.setCapabilities([Capability.PARAMETERS_TOPIC])

    const key = 'key'
    await parametersTopic.publish({
      parameters: [{ productName: 'test', appId: 'test2', parameters: { [key]: 'test' } }],
    })

    const defaultValue = 'default'
    const result = await parametersService.get(key, defaultValue)

    expect(result).toBe(defaultValue)
  })

  it('should return the value of the promise provided as default value if parameter value is undefined', async () => {
    ShellCapabilityServiceMock.setCapabilities([Capability.PARAMETERS_TOPIC])

    const key = 'key'
    await parametersTopic.publish({ parameters: [] })

    const defaultValue = 'default'
    const result = await parametersService.get(key, Promise.resolve(defaultValue))

    expect(result).toBe(defaultValue)
  })
})


```

### File: angular-integration-interface/src/lib/services/parameters.service.ts

```ts

import { Injectable, OnDestroy, inject } from '@angular/core'
import { ParametersTopic } from '@onecx/integration-interface'
import { firstValueFrom, map } from 'rxjs'
import { AppStateService } from './app-state.service'
import { Capability, ShellCapabilityService } from './shell-capability.service'

type Parameter = boolean | number | string | object

@Injectable({ providedIn: 'root' })
export class ParametersService implements OnDestroy {
  private shellCapabilityService = inject(ShellCapabilityService)
  private appStateService = inject(AppStateService)
  _parameters$: ParametersTopic | undefined
  get parameters$() {
    this._parameters$ ??= new ParametersTopic()
    return this._parameters$
  }
  set parameters$(source: ParametersTopic) {
    this._parameters$ = source
  }

  ngOnDestroy(): void {
    this._parameters$?.destroy()
  }

  /**
   * Use this method to get a parameter value in applications.
   *
   * @param key The key of the parameter to get. This is defined when the parameter is configured in parameter management.
   * @param defaultValue The default value that will be returned if the parameter is not found or if the shell is not yet providing the parameters because it is too old.
   */
  public async get<T extends Parameter>(key: string, defaultValue: T | Promise<T>): Promise<T>

  /**
   * Use this method to get a parameter value in remote components.
   *
   * @param key The key of the parameter to get. This is defined when the parameter is configured in parameter management.
   * @param defaultValue The default value that will be returned if the parameter is not found or if the shell is not yet providing the parameters because it is too old.
   * @param productName The name of the product in which the parameter is defined.
   * @param appId The id of the application in which the parameter is defined.
   * @returns The value of the parameter or the default value.
   */
  public async get<T extends Parameter>(
    key: string,
    defaultValue: T | Promise<T>,
    productName: string | undefined = undefined,
    appId: string | undefined = undefined
  ): Promise<T> {
    if (!this.shellCapabilityService.hasCapability(Capability.PARAMETERS_TOPIC)) {
      return Promise.resolve(defaultValue)
    }

    if (!productName) {
      productName = await firstValueFrom(this.appStateService.currentMfe$.pipe(map((mfe) => mfe.productName)))
    }
    if (!appId) {
      appId = await firstValueFrom(this.appStateService.currentMfe$.pipe(map((mfe) => mfe.appId)))
    }

    return firstValueFrom(
      this.parameters$.pipe(
        map(
          (payload) =>
            payload.parameters.find((p) => p.productName === productName && p.appId === appId)?.parameters[key] as T
        )
      )
    ).then((value): Promise<T> => {
      if (value === undefined) {
        return Promise.resolve(defaultValue)
      } else {
        return Promise.resolve(value)
      }
    })
  }
}


```

### File: angular-integration-interface/src/lib/services/portal-message.service.spec.ts

```ts

import { TestBed, fakeAsync } from '@angular/core/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { Message, MessageTopic } from '@onecx/integration-interface'
import { PortalMessageService } from './portal-message.service'
import { FakeTopic } from '@onecx/accelerator'

describe('PortalMessageService', () => {
  let portalMessageService: PortalMessageService
  let message: Message

  const translations = {
    unit: {
      test: {
        message: 'Hello {{username}}',
      },
    },
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [TranslateTestingModule.withTranslations('en', translations)],
      providers: [PortalMessageService],
    }).compileComponents()
    portalMessageService = TestBed.inject(PortalMessageService)
    portalMessageService.message$ = new FakeTopic<Message>() as unknown as MessageTopic
  })

  afterEach(() => {
    message = {}
    portalMessageService.message$.destroy()
  })

  describe('success', () => {
    it('with summary adds correct data', () => {
      portalMessageService.success({ summaryKey: 'unit.test.message' })
      portalMessageService.message$.subscribe((m) => (message = m))

      expect(message).toEqual(
        expect.objectContaining({
          severity: 'success',
          summary: 'Hello {{username}}',
        })
      )
    })

    it('with summary and detail adds correct data', () => {
      portalMessageService.success({ summaryKey: 'unit.test.message', detailKey: 'unit.test.message' })
      portalMessageService.message$.subscribe((m) => (message = m))

      expect(message).toEqual(
        expect.objectContaining({
          severity: 'success',
          summary: 'Hello {{username}}',
          detail: 'Hello {{username}}',
        })
      )
    })

    it('with summary with parameter adds correct data', () => {
      portalMessageService.success({ summaryKey: 'unit.test.message', summaryParameters: { username: 'user' } })
      portalMessageService.message$.subscribe((m) => (message = m))

      expect(message).toEqual(expect.objectContaining({ severity: 'success', summary: 'Hello user' }))
    })

    it('with summary with parameter and detail with parameter adds correct data', () => {
      portalMessageService.success({
        summaryKey: 'unit.test.message',
        detailKey: 'unit.test.message',
        summaryParameters: { username: 'user1' },
        detailParameters: { username: 'user2' },
      })
      portalMessageService.message$.subscribe((m) => (message = m))

      expect(message).toEqual(
        expect.objectContaining({
          severity: 'success',
          summary: 'Hello user1',
          detail: 'Hello user2',
        })
      )
    })
  })

  it('info sets correct severity', fakeAsync(() => {
    portalMessageService.info({ summaryKey: 'unit.test.message' })
    portalMessageService.message$.subscribe((m) => (message = m))

    expect(message).toEqual(expect.objectContaining({ severity: 'info' }))
  }))

  it('error sets correct severity', fakeAsync(() => {
    portalMessageService.error({ summaryKey: 'unit.test.message' })
    portalMessageService.message$.subscribe((m) => (message = m))

    expect(message).toEqual(expect.objectContaining({ severity: 'error' }))
  }))

  it('warning sets correct severity', fakeAsync(() => {
    portalMessageService.warning({ summaryKey: 'unit.test.message' })
    portalMessageService.message$.subscribe((m) => (message = m))

    expect(message).toEqual(expect.objectContaining({ severity: 'warning' }))
  }))
})


```

### File: angular-integration-interface/src/lib/services/portal-message.service.ts

```ts

import { Injectable, OnDestroy, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { MessageTopic } from '@onecx/integration-interface'
import { combineLatest, first, of } from 'rxjs'

export type Message = {
  summaryKey?: string
  summaryParameters?: object
  detailKey?: string
  detailParameters?: object
  id?: any
  key?: string
  life?: number
  sticky?: boolean
  closable?: boolean
  data?: any
  icon?: string
  contentStyleClass?: string
  styleClass?: string
}

@Injectable({ providedIn: 'any' })
export class PortalMessageService implements OnDestroy {
  private translateService = inject(TranslateService)

  _message$: MessageTopic | undefined
  get message$() {
    this._message$ ??= new MessageTopic()
    return this._message$
  }
  set message$(source: MessageTopic) {
    this._message$ = source
  }

  success(msg: Message) {
    this.addTranslated('success', msg)
  }

  info(msg: Message) {
    this.addTranslated('info', msg)
  }

  error(msg: Message) {
    this.addTranslated('error', msg)
  }

  warning(msg: Message) {
    this.addTranslated('warning', msg)
  }

  private addTranslated(severity: string, msg: Message) {
    combineLatest([
      msg.summaryKey ? this.translateService.get(msg.summaryKey || '', msg.summaryParameters) : of(undefined),
      msg.detailKey ? this.translateService.get(msg.detailKey, msg.detailParameters) : of(undefined),
    ])
      .pipe(first())
      .subscribe(([summaryTranslation, detailTranslation]: string[]) => {
        this.message$.publish({
          ...msg,
          severity: severity,
          summary: summaryTranslation,
          detail: detailTranslation,
        })
      })
  }

  ngOnDestroy(): void {
    this._message$?.destroy()
  }
}


```

### File: angular-integration-interface/src/lib/services/remote-components.service.ts

```ts

import { Injectable, OnDestroy } from '@angular/core'
import { RemoteComponentsTopic } from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class RemoteComponentsService implements OnDestroy {
  _remoteComponents$: RemoteComponentsTopic | undefined
  get remoteComponents$() {
    this._remoteComponents$ ??= new RemoteComponentsTopic()
    return this._remoteComponents$
  }
  set remoteComponents$(source: RemoteComponentsTopic) {
    this._remoteComponents$ = source
  }

  ngOnDestroy(): void {
    this._remoteComponents$?.destroy()
  }
}


```

### File: angular-integration-interface/src/lib/services/shell-capability.service.ts

```ts

import { Injectable } from '@angular/core'

declare global {
  interface Window {
    'onecx-shell-capabilities': Capability[]
  }
}

export enum Capability {
  CURRENT_LOCATION_TOPIC = 'currentLocationTopic',
  PARAMETERS_TOPIC = 'parametersTopic',
  ACTIVENESS_AWARE_MENUS = 'activenessAwareMenus',
}

@Injectable({ providedIn: 'root' })
export class ShellCapabilityService {
  static setCapabilities(capabilities: Capability[]): void {
    window['onecx-shell-capabilities'] = capabilities
  }

  hasCapability(capability: Capability): boolean {
    return window['onecx-shell-capabilities']?.includes(capability) ?? false
  }
}


```

### File: angular-integration-interface/src/lib/services/theme.service.ts

```ts

import { Injectable, OnDestroy } from '@angular/core'
import { CurrentThemeTopic } from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  _currentTheme$: CurrentThemeTopic | undefined
  get currentTheme$() {
    this._currentTheme$ ??= new CurrentThemeTopic()
    return this._currentTheme$
  }
  set currentTheme$(source: CurrentThemeTopic) {
    this._currentTheme$ = source
  }
  ngOnDestroy(): void {
    this._currentTheme$?.destroy()
  }
}


```

### File: angular-integration-interface/src/lib/services/user.service.spec.ts

```ts

/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { TestBed } from '@angular/core/testing'
import { UserService } from './user.service'
import { UserProfile } from '@onecx/integration-interface'
import { FakeTopic } from '@onecx/angular-integration-interface/mocks'
import { DEFAULT_LANG } from '../api/constants'

jest.mock('@onecx/accelerator', () => {
  const actual = jest.requireActual('@onecx/accelerator')
  return {
    ...actual,
    getNormalizedBrowserLocales: jest.fn(),
  }
})

import { getNormalizedBrowserLocales } from '@onecx/accelerator'

jest.mock('@onecx/integration-interface', () => {
  const actual = jest.requireActual('@onecx/integration-interface')
  return {
    ...actual,
    UserProfileTopic: jest.fn().mockImplementation(() => {
      return new FakeTopic<UserProfile>()
    }),
  }
})

describe('UserService', () => {
  const originalNavigator = window.navigator

  let userService: UserService
  let mockProfile$: FakeTopic<UserProfile>
  let mockedGetNormalizedBrowserLocales: jest.Mock

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
    })

    userService = TestBed.inject(UserService)
    mockProfile$ = userService.profile$ as any as FakeTopic<UserProfile>
    mockedGetNormalizedBrowserLocales = getNormalizedBrowserLocales as jest.Mock
  })

  afterEach(() => {
    // Restore the original navigator object after each test
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      configurable: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create', () => {
    expect(userService).toBeTruthy()
  })

  describe('lang$', () => {
    describe('old style language setting', () => {
      it('should set to DEFAULT_LANG if no locales are provided and window has no browser languages', () => {
        mockProfile$.publish({} as UserProfile)

        expect(userService.lang$.getValue()).toBe(DEFAULT_LANG)
      })

      it('should set to DEFAULT_LANG if no locales are provided and window navigator is not defined', () => {
        Object.defineProperty(window, 'navigator', {
          value: undefined,
          configurable: true,
        })
        mockProfile$.publish({} as UserProfile)

        expect(userService.lang$.getValue()).toBe(DEFAULT_LANG)
      })

      it('should set to DEFAULT_LANG if no locales are provided and window navigator language and languages are not defined', () => {
        Object.defineProperty(window, 'navigator', {
          value: {
            language: undefined,
            languages: undefined,
          },
          configurable: true,
        })
        mockProfile$.publish({} as UserProfile)

        expect(userService.lang$.getValue()).toBe(DEFAULT_LANG)
      })

      it('should set to first browser language if no locales are provided and window has browser languages separated with -', () => {
        Object.defineProperty(window, 'navigator', {
          value: { languages: ['de-DE', 'fr-FR'] },
          configurable: true,
        })

        mockProfile$.publish({} as UserProfile)

        expect(userService.lang$.getValue()).toBe('de')
      })

      it('should set to first browser language if no locales are provided and window has browser languages separated with _', () => {
        Object.defineProperty(window, 'navigator', {
          value: { languages: ['de_DE', 'fr_FR'] },
          configurable: true,
        })

        mockProfile$.publish({} as UserProfile)

        expect(userService.lang$.getValue()).toBe('de')
      })

      it('should set to user locale if no locales are provided and preferred locale is defined', () => {
        mockProfile$.publish({
          accountSettings: {
            localeAndTimeSettings: {
              locale: 'es',
            },
          },
        } as UserProfile)

        expect(userService.lang$.getValue()).toBe('es')
      })
    })

    it('should use first general language from locales if provided', () => {
      mockProfile$.publish({
        settings: {
          locales: ['fr-FR', 'fr'],
        },
      } as UserProfile)

      expect(userService.lang$.getValue()).toBe('fr')
    })

    it('should use default language if no general language is in locales', () => {
      mockProfile$.publish({
        settings: {
          locales: ['fr-FR', 'de-DE'],
        },
      } as UserProfile)

      expect(userService.lang$.getValue()).toBe(DEFAULT_LANG)
    })

    it('should use first language from normalized browser languages if locales is an empty array', () => {
      mockedGetNormalizedBrowserLocales.mockReturnValue(['en-US', 'en', 'fr-FR', 'fr'])

      mockProfile$.publish({
        settings: {
          locales: [] as string[],
        },
      } as UserProfile)

      expect(userService.lang$.getValue()).toBe('en')
    })
  })
})


```

### File: angular-integration-interface/src/lib/services/user.service.ts

```ts

import { Injectable, OnDestroy } from '@angular/core'
import { PermissionsTopic, UserProfile, UserProfileTopic } from '@onecx/integration-interface'
import { BehaviorSubject, firstValueFrom, map } from 'rxjs'
import { DEFAULT_LANG } from '../api/constants'
import { getNormalizedBrowserLocales } from '@onecx/accelerator'

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  profile$ = new UserProfileTopic()
  lang$ = new BehaviorSubject(this.determineLanguage() ?? DEFAULT_LANG)

  _permissionsTopic$: PermissionsTopic | undefined
  get permissionsTopic$() {
    this._permissionsTopic$ ??= new PermissionsTopic()
    return this._permissionsTopic$
  }
  set permissionsTopic$(source: PermissionsTopic) {
    this._permissionsTopic$ = source
  }

  constructor() {
    this.profile$
      .pipe(
        map((profile) => {
          let locales = profile.settings?.locales

          if (!locales) {
            return this.useOldLangSetting(profile)
          }

          if (locales.length === 0) {
            locales = getNormalizedBrowserLocales()
          }

          // the lang$ should contain the first language, because locales is an ordered list
          // length of 2 is checked because we need the general language
          // never choose 'en-US', but choose 'en'
          const firstLang = locales.find((l) => l.length === 2) ?? DEFAULT_LANG
          return firstLang
        })
      )
      .subscribe(this.lang$)
  }

  ngOnDestroy(): void {
    this.profile$.destroy()
    this._permissionsTopic$?.destroy()
  }

  useOldLangSetting(profile: UserProfile): string {
    return profile.accountSettings?.localeAndTimeSettings?.locale ?? this.determineLanguage() ?? DEFAULT_LANG
  }

  getPermissions() {
    return this.permissionsTopic$.asObservable()
  }

  async hasPermission(permissionKey: string | string[] | undefined): Promise<boolean> {
    if (!permissionKey) return true

    if (Array.isArray(permissionKey)) {
      const permissions = await Promise.all(permissionKey.map((key) => this.hasPermission(key)))
      return permissions.every((hasPermission) => hasPermission)
    }

    return firstValueFrom(
      this.permissionsTopic$.pipe(
        map((permissions) => {
          const result = permissions.includes(permissionKey)
          if (!result) {
            console.log(`ðŸ‘®â€â™€ï¸ No permission for: ${permissionKey}`)
          }
          return !!result
        })
      )
    )
  }

  private determineLanguage(): string | undefined {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return undefined
    }

    let browserLang: any = window.navigator.languages ? window.navigator.languages[0] : null
    browserLang = browserLang || window.navigator.language

    if (typeof browserLang === 'undefined') {
      return undefined
    }

    if (browserLang.indexOf('-') !== -1) {
      browserLang = browserLang.split('-')[0]
    }

    if (browserLang.indexOf('_') !== -1) {
      browserLang = browserLang.split('_')[0]
    }

    return browserLang
  }

  get isInitialized(): Promise<void> {
    return Promise.all([
      this.permissionsTopic$.isInitialized,
      this.profile$.isInitialized,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
    ]).then(() => {})
  }
}


```

### File: angular-integration-interface/src/lib/services/workspace.service.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { WorkspaceService } from './workspace.service'
import { AppStateServiceMock, provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'

describe('WorkspaceService', () => {
  let service: WorkspaceService
  let mockAppStateService: AppStateServiceMock
  const endpointParameters: Record<string, unknown> = {
    id: 5,
    key: 'xy',
  }

  const endpointParametersWrong: Record<string, unknown> = {
    idx: 5,
  }

  const appId = 'onecx-workspace-ui'
  const productName = 'onecx-workspace'

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideAppStateServiceMock()],
    })

    service = TestBed.inject(WorkspaceService)
    mockAppStateService = TestBed.inject(AppStateServiceMock)

    mockAppStateService.currentWorkspace$.publish({
      workspaceName: 'test-workspace',
      portalName: 'test-workspace',
      microfrontendRegistrations: [],
      baseUrl: 'http://example.com',
      routes: [
        {
          appId: 'onecx-workspace-ui',
          productName: 'onecx-workspace',
          baseUrl: 'http://example.com/workspace/baseurl',
          endpoints: [
            { name: 'details', path: '/details/{id}' },
            { name: 'edit', path: '[[details]]' },
            { name: 'change', path: '[[edit]]' },
          ],
        },
      ],
    })
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('getUrl', () => {
    it('should find endpoint and return correct url from route and endpoint ', (done) => {
      service.getUrl(productName, appId, 'details', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details/5')
        done()
      })
    })

    it('should return empty string when workspace baseUrl is empty string"', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        workspaceName: 'test-workspace',
        portalName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: '',
        routes: [],
      })

      service.getUrl(productName, appId, 'detailswrong', endpointParameters).subscribe((url) => {
        expect(url).toBe('')
        done()
      })
    })

    it('should return workspace baseUrl when workspace has no routes at all"', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        workspaceName: 'test-workspace',
        portalName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
      })

      service.getUrl(productName, appId, 'detailswrong', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com')
        done()
      })
    })

    it('should return workspace baseUrl when workspace.routes is empty"', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        workspaceName: 'test-workspace',
        portalName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [],
      })

      service.getUrl(productName, appId, 'detailswrong', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com')
        done()
      })
    })

    it('should return workspace baseUrl when route for productName and appId was not found"', (done) => {
      service.getUrl('wrong-productname', appId, 'details', {}).subscribe((url) => {
        expect(url).toBe('http://example.com')
        done()
      })
    })

    it('should return workspace baseUrl and endpoints when route has no baseUrl', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        workspaceName: 'test-workspace',
        portalName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            endpoints: [
              { name: 'details', path: '/details/{id}' },
              { name: 'edit', path: '[[details]]' },
              { name: 'change', path: '[[edit]]' },
            ],
          },
        ],
      })

      service.getUrl(productName, appId, 'details', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/details/5')
        done()
      })
    })

    it('should return workspace baseUrl with endpoints when route has empty baseUrl', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        workspaceName: 'test-workspace',
        portalName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: '',
            endpoints: [
              { name: 'details', path: '/details/{id}' },
              { name: 'edit', path: '[[details]]' },
              { name: 'change', path: '[[edit]]' },
            ],
          },
        ],
      })

      service.getUrl(productName, appId, 'details', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/details/5')
        done()
      })
    })

    it('should return route.baseUrl when endpoints are empty"', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        workspaceName: 'test-workspace',
        portalName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl',
            endpoints: [],
          },
        ],
      })

      service.getUrl(productName, appId, 'detailswrong', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl')
        done()
      })
    })

    it('should return route.baseUrl when endpoint was not found', (done) => {
      service.getUrl(productName, appId, 'detailswrong', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl')
        done()
      })
    })

    it('should return well formed url for endpoint with 1 alias', (done) => {
      service.getUrl(productName, appId, 'edit', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details/5')
        done()
      })
    })

    it('should return well formed url for endpoint with 2 alias ', (done) => {
      service.getUrl(productName, appId, 'change', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details/5')
        done()
      })
    })

    it('should return baseurl when endpoint was not found', (done) => {
      service.getUrl(productName, appId, 'changexy', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl')
        done()
      })
    })

    it('should return baseurl when endpoint has wrong alias', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        workspaceName: 'test-workspace',
        portalName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl',
            endpoints: [
              { name: 'details', path: '/details/{id}/{key}' },
              { name: 'change', path: '[[edit]]' },
            ],
          },
        ],
      })

      service.getUrl(productName, appId, 'change', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl')
        done()
      })
    })

    it('should return baseurl + endpoint with no endpointparameters', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        workspaceName: 'test-workspace',
        portalName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl',
            endpoints: [
              { name: 'details', path: '/details' },
              { name: 'change', path: '[[edit]]' },
            ],
          },
        ],
      })

      service.getUrl(productName, appId, 'details').subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details')
        done()
      })
    })

    it('should return baseurl + endpoint with no endpointparameters', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        workspaceName: 'test-workspace',
        portalName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl',
            endpoints: [
              { name: 'details', path: '/details' },
              { name: 'change', path: '[[edit]]' },
            ],
          },
        ],
      })

      service.getUrl(productName, appId, 'details', undefined).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details')
        done()
      })
    })

    it('should return baseurl when param was not found"', (done) => {
      service.getUrl(productName, appId, 'details', endpointParametersWrong).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl')
        done()
      })
    })

    it('should return baseurl when no endpointName and endpointParameters are given"', (done) => {
      service.getUrl(productName, appId).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl')
        done()
      })
    })

    it('should baseurl without endpoint when endpointParameters are empty"', (done) => {
      service.getUrl(productName, appId, 'details', {}).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl')
        done()
      })
    })

    it('should return well formed url with 2 endpointParameters in endpoint', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        workspaceName: 'test-workspace',
        portalName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl/',
            endpoints: [
              { name: 'details', path: '/details/{id}/{key}' },
              { name: 'edit', path: '[[details]]' },
              { name: 'change', path: '[[edit]]' },
            ],
          },
        ],
      })

      service.getUrl(productName, appId, 'details', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details/5/xy')
        done()
      })
    })

    it('should return route.baseUrl when no endpoints are available"', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        workspaceName: 'test-workspace',
        portalName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl',
          },
        ],
      })

      service.getUrl(productName, appId, 'detailswrong', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl')
        done()
      })
    })

    it('should return well formed url although double / are retrieved', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        workspaceName: 'test-workspace',
        portalName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl/',
            endpoints: [
              { name: 'details', path: '/details/{id}' },
              { name: 'edit', path: '[[details]]' },
              { name: 'change', path: '[[edit]]' },
            ],
          },
        ],
      })

      service.getUrl(productName, appId, 'details', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details/5')
        done()
      })
    })
  })

  describe('doesUrlExistFor', () => {
    it('should find endpoint by name and return true', (done) => {
      service.doesUrlExistFor(productName, appId, 'details').subscribe((result) => {
        expect(result).toBe(true)
        done()
      })
    })
    it('should find no endpoint by name and return false', (done) => {
      service.doesUrlExistFor(productName, appId, 'detailsx').subscribe((result) => {
        expect(result).toBe(false)
        done()
      })
    })
    it('should find empty endpoint list in route and return false', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        workspaceName: 'test-workspace',
        portalName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl/',
            endpoints: [],
          },
        ],
      })
      service.doesUrlExistFor(productName, appId, 'details').subscribe((result) => {
        expect(result).toBe(false)
        done()
      })
    })
    it('should find no endpoint in route and return false', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        workspaceName: 'test-workspace',
        portalName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl/',
          },
        ],
      })
      service.doesUrlExistFor(productName, appId, 'details').subscribe((result) => {
        expect(result).toBe(false)
        done()
      })
    })
    it('should check existing route baseUrl and return true', (done) => {
      service.doesUrlExistFor(productName, appId).subscribe((result) => {
        expect(result).toBe(true)
        done()
      })
    })
    it('should check empty route baseUrl and return false', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        workspaceName: 'test-workspace',
        portalName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: '',
          },
        ],
      })
      service.doesUrlExistFor(productName, appId).subscribe((result) => {
        expect(result).toBe(false)
        done()
      })
    })

    it('should check route with no baseUrl and return false', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        workspaceName: 'test-workspace',
        portalName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: '',
          },
        ],
      })
      service.doesUrlExistFor(productName, appId).subscribe((result) => {
        expect(result).toBe(false)
        done()
      })
    })

    it('should check not existing route baseUrl and return false', (done) => {
      service.doesUrlExistFor(productName, 'wrongappId').subscribe((result) => {
        expect(result).toBe(false)
        done()
      })
    })
  })
})


```

### File: angular-integration-interface/src/lib/services/workspace.service.ts

```ts

import { Location } from '@angular/common'
import { Injectable, inject } from '@angular/core'
import { Endpoint, Route } from '@onecx/integration-interface'
import { Observable, map } from 'rxjs'
import { AppStateService } from './app-state.service'

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  protected appStateService = inject(AppStateService)

  private aliasStart = '[['
  private aliasEnd = ']]'
  private paramStart = '{'
  private paramEnd = '}'

  getUrl(
    productName: string,
    appId: string,
    endpointName?: string,
    endpointParameters?: Record<string, unknown>
  ): Observable<string> {
    return this.appStateService.currentWorkspace$.pipe(
      map((workspace) => {
        const finalUrl = this.constructRouteUrl(workspace, appId, productName, endpointName, endpointParameters)
        return finalUrl
      })
    )
  }

  doesUrlExistFor(productName: string, appId: string, endpointName?: string): Observable<boolean> {
    return this.appStateService.currentWorkspace$.pipe(
      map((workspace) => {
        const checkEndpoint = endpointName !== undefined && endpointName.length > 0

        if (workspace.routes == undefined) {
          return false
        }
        const route = this.filterRouteFromList(workspace.routes, appId, productName)

        if (checkEndpoint) {
          if (!route || route.endpoints === undefined || route.endpoints.length == 0) {
            return false
          }

          const endpoint = route.endpoints.find((ep) => ep.name === endpointName)
          return !!(endpoint && endpoint.path && endpoint.path.length > 0)
        } else {
          return !!(route && route.baseUrl && route.baseUrl.length > 0)
        }
      })
    )
  }

  private constructBaseUrlFromWorkspace(workspace: any): string {
    if (workspace.baseUrl === undefined) {
      console.log('WARNING: There was no baseUrl for received workspace.')
      return ''
    }
    return workspace.baseUrl
  }

  private constructRouteUrl(
    workspace: any,
    appId: string,
    productName: string,
    endpointName?: string,
    endpointParameters?: Record<string, unknown>
  ): string {
    const route = this.filterRouteFromList(workspace.routes, appId, productName)
    let url = this.constructBaseUrlFromWorkspace(workspace)
    if (!route) {
      console.log(
        `WARNING: No route.baseUrl could be found for given appId "${appId}" and productName "${productName}"`
      )

      return url
    }

    if (route.baseUrl !== undefined && route.baseUrl.length > 0) {
      url = route.baseUrl
    }
    if (endpointName == undefined) {
      return url
    }

    url = Location.joinWithSlash(url, this.constructEndpointUrl(route, endpointName, endpointParameters))
    return url
  }

  private constructEndpointUrl(
    route: any,
    endpointName: string,
    endpointParameters: Record<string, unknown> = {}
  ): string {
    if (!route.endpoints) {
      return ''
    }
    const finalEndpoint = this.dissolveEndpoint(endpointName, route.endpoints)
    if (!finalEndpoint || finalEndpoint.path === undefined) {
      console.log('WARNING: No endpoint or endpoint.path could be found')
      return ''
    }

    const paramsFilled = this.fillParamsForPath(finalEndpoint.path, endpointParameters)
    if (paramsFilled === undefined) {
      console.log('WARNING: Params could not be filled correctly')
      return ''
    }

    return paramsFilled
  }

  private filterRouteFromList(routes: Array<Route>, appId: string, productName: string): Route | undefined {
    if (!routes) {
      return undefined
    }

    const productRoutes = routes.filter((route) => route.appId === appId && route.productName === productName)

    if (productRoutes.length === 0) {
      return undefined
    }

    if (productRoutes.length > 1) {
      console.log('WARNING: There were more than one route. First route has been used.')
    }

    return productRoutes[0]
  }

  private dissolveEndpoint(endpointName: string, endpoints: Array<Endpoint>): Endpoint | undefined {
    let endpoint = endpoints.find((ep) => ep.name === endpointName)

    if (!endpoint) {
      return undefined
    }

    while (endpoint.path?.includes(this.aliasStart)) {
      const path: string = endpoint.path
      const startIdx = path.indexOf(this.aliasStart) + this.aliasStart.length
      const endIdx = path.lastIndexOf(this.aliasEnd)
      if (endIdx <= startIdx) {
        return undefined
      }
      const aliasName = path.substring(startIdx, endIdx)
      endpoint = endpoints.find((ep) => ep.name === aliasName)

      if (!endpoint) {
        return undefined
      }
    }

    return endpoint
  }

  private fillParamsForPath(path: string, endpointParameters: Record<string, unknown>): string {
    while (path.includes(this.paramStart)) {
      const paramName = path.substring(
        path.indexOf(this.paramStart) + this.paramStart.length,
        path.indexOf(this.paramEnd)
      )
      const paramValue = this.getStringFromUnknown(endpointParameters[paramName])
      if (paramValue != undefined && paramValue.length > 0) {
        path = path.replace(this.paramStart.concat(paramName).concat(this.paramEnd), paramValue)
      } else {
        console.log(`WARNING: Searched param "${paramName}" was not found in given param list `)
        return ''
      }
    }
    return path
  }

  private getStringFromUnknown(value: unknown): string {
    if (value === null || value === undefined) {
      return ''
    } else if (typeof value === 'string') {
      return value
    } else {
      return String(value)
    }
  }
}


```


