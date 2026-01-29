# Files from C:\Users\prath\onecx\onecx-ui\onecx-portal-ui-libs\libs\angular-standalone-shell

## Folder: angular-standalone-shell (10 files)

### File: angular-standalone-shell/.eslintrc.json

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

### File: angular-standalone-shell/jest.config.ts

```ts

export default {
  displayName: 'angular-standalone-shell',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/libs/angular-standalone-shell',
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
}


```

### File: angular-standalone-shell/migrations.json

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

### File: angular-standalone-shell/ng-package.json

```json

{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/libs/angular-standalone-shell",
  "lib": {
    "entryFile": "src/index.ts"
  },
  "assets": ["CHANGELOG.md", "./assets/**", "./migrations.json"]
}


```

### File: angular-standalone-shell/package.json

```json

{
  "name": "@onecx/angular-standalone-shell",
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
    "@onecx/angular-integration-interface": "^7.0.0-rc.13",
    "@onecx/angular-webcomponents": "^7.0.0-rc.13",
    "@onecx/angular-utils": "^7.0.0-rc.13",
    "@onecx/integration-interface": "^7.0.0-rc.13",
    "@onecx/angular-auth": "^7.0.0-rc.13",
    "@onecx/nx-migration-utils": "^7.0.0-rc.13",
    "@nx/devkit": "^20.3.0",
    "primeng": "^19.0.0",
    "@ngx-translate/core": "^16.0.0"
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

### File: angular-standalone-shell/project.json

```json

{
  "name": "angular-standalone-shell",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/angular-standalone-shell/src",
  "prefix": "onecx",
  "projectType": "library",
  "tags": [],
  "targets": {
    "build-migrations": {
      "dependsOn": ["build"],
      "executor": "nx:run-commands",
      "options": {
        "commands": ["tsc -p libs/angular-standalone-shell/migrations/tsconfig.migrations.json"]
      }
    },
    "build": {
      "executor": "@nx/angular:package",
      "outputs": ["{workspaceRoot}/dist/{projectRoot}"],
      "options": {
        "project": "libs/angular-standalone-shell/ng-package.json"
      },
      "configurations": {
        "production": {
          "tsConfig": "libs/angular-standalone-shell/tsconfig.lib.prod.json"
        },
        "development": {
          "tsConfig": "libs/angular-standalone-shell/tsconfig.lib.json"
        }
      },
      "defaultConfiguration": "production"
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "libs/angular-standalone-shell/jest.config.ts",
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
          "libs/angular-standalone-shell/**/*.ts",
          "libs/angular-standalone-shell/**/*.html",
          "libs/angular-standalone-shell/package.json"
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

### File: angular-standalone-shell/tsconfig.json

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

### File: angular-standalone-shell/tsconfig.lib.json

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

### File: angular-standalone-shell/tsconfig.lib.prod.json

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

### File: angular-standalone-shell/tsconfig.spec.json

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

## Folder: angular-standalone-shell/migrations (3 files)

### File: angular-standalone-shell/migrations/index.ts

```ts

export * from './v6/migrate-onecx-to-v6'

```

### File: angular-standalone-shell/migrations/tsconfig.json

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

### File: angular-standalone-shell/migrations/tsconfig.migrations.json

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

## Folder: angular-standalone-shell/migrations/v6 (1 files)

### File: angular-standalone-shell/migrations/v6/migrate-onecx-to-v6.ts

```ts

import { Tree } from '@nx/devkit'
import { commonMigrateOnecxToV6 } from '@onecx/nx-migration-utils'

export default async function migrateOnecxToV6(tree: Tree) {
  await commonMigrateOnecxToV6(tree)
}


```

## Folder: angular-standalone-shell/src (2 files)

### File: angular-standalone-shell/src/index.ts

```ts

export * from './lib/utils/expose-standalone.utils'
export * from './lib/standalone-shell.module'
export * from './lib/components/standalone-shell-viewport/standalone-shell-viewport.component'


```

### File: angular-standalone-shell/src/test-setup.ts

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

## Folder: angular-standalone-shell/src/lib/components/standalone-shell-viewport (1 files)

### File: angular-standalone-shell/src/lib/components/standalone-shell-viewport/standalone-shell-viewport.component.ts

```ts

import { AfterContentInit, Component, ElementRef, Input, inject } from '@angular/core'
import { Message, PortalMessageService } from '@onecx/angular-integration-interface'
import { MessageService } from 'primeng/api'

@Component({
  standalone: false,
  selector: 'ocx-standalone-shell-viewport',
  template: `
    <ng-content>
      <router-outlet></router-outlet>
      <p-toast [style]="{ 'word-break': 'break-word' }"></p-toast>
    </ng-content>
  `,
  styleUrls: ['./standalone-shell-viewport.component.scss'],
})
export class StandaloneShellViewportComponent implements AfterContentInit {
  private el = inject(ElementRef)
  private messageService = inject(MessageService)
  private portalMessageService = inject(PortalMessageService)

  constructor() {
    this.portalMessageService.message$.subscribe((message: Message) => this.messageService.add(message))
  }

  ngAfterContentInit(): void {
    if (!this.isRouterDefined()) {
      console.warn(
        'RouterOutlet component was not found in the content. If you are using content projection, please make sure that RouterOutlet is in your template.'
      )
    }
  }
  // TODO: Enable by default once we know how to move forward with standalone styling
  @Input()
  set displayOneCXShellLayout(value: boolean) {
    console.warn('The displayOneCXShellLayout input is not implemented yet.')
  }

  private isRouterDefined() {
    const nodes = Array.from(this.el.nativeElement.childNodes as NodeList)
    while (nodes.length > 0) {
      const child = nodes.shift()
      if (child && child.nodeName === 'ROUTER-OUTLET') return true
      if (child && child.childNodes.length > 0) nodes.push(...Array.from(child.childNodes))
    }
    return false
  }
}


```

## Folder: angular-standalone-shell/src/lib (1 files)

### File: angular-standalone-shell/src/lib/standalone-shell.module.ts

```ts

import { NgModule } from '@angular/core'
import { StandaloneShellViewportComponent } from './components/standalone-shell-viewport/standalone-shell-viewport.component'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { ToastModule } from 'primeng/toast'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [StandaloneShellViewportComponent],
  imports: [CommonModule, RouterModule, ToastModule, TranslateModule],
  exports: [StandaloneShellViewportComponent, ToastModule, TranslateModule],
  providers: [],
})
export class StandaloneShellModule {}


```

## Folder: angular-standalone-shell/src/lib/utils (1 files)

### File: angular-standalone-shell/src/lib/utils/expose-standalone.utils.ts

```ts

import { APP_INITIALIZER, InjectionToken } from '@angular/core'

import {
  AppStateService,
  ConfigurationService,
  MfeInfo,
  ThemeService,
  UserService,
} from '@onecx/angular-integration-interface'
import { initializeRouter } from '@onecx/angular-webcomponents'
import { Router } from '@angular/router'
import { PermissionsTopic, Theme, UserProfile, Workspace } from '@onecx/integration-interface'
import { provideAlwaysGrantPermissionChecker, provideTranslationPathFromMeta } from '@onecx/angular-utils'
import { provideAuthService, provideTokenInterceptor } from '@onecx/angular-auth'
import { MessageService } from 'primeng/api'

async function apply(themeService: ThemeService, theme: Theme): Promise<void> {
  console.log(`ðŸŽ¨ Applying theme: ${theme.name}`)
  await themeService.currentTheme$.publish(theme)
  if (theme.properties) {
    Object.values(theme.properties).forEach((group) => {
      for (const [key, value] of Object.entries(group)) {
        document.documentElement.style.setProperty(`--${key}`, value)
      }
    })
  }
}

const appInitializer = (
  appStateService: AppStateService,
  userService: UserService,
  configService: ConfigurationService,
  themeService: ThemeService,
  providerConfig?: Partial<ProvideStandaloneProvidersConfig>
) => {
  return async () => {
    const standaloneMfeInfo: MfeInfo = {
      mountPath: '/',
      remoteBaseUrl: '.',
      baseHref: '/',
      shellName: 'standalone',
      appId: '',
      productName: '',
      ...(providerConfig?.mfeInfo ?? {}),
    }
    await appStateService.globalLoading$.publish(true)
    await appStateService.currentMfe$.publish(standaloneMfeInfo)
    await appStateService.globalLoading$.publish(false)
    await configService.init()
    await userService.profile$.publish({
      person: {},
      userId: 'standaloneMockUser',
      accountSettings: {
        localeAndTimeSettings: {
          locale: 'en',
          ...(providerConfig?.userProfile?.accountSettings?.localeAndTimeSettings ?? {}),
        },
        layoutAndThemeSettings: {
          menuMode: 'HORIZONTAL',
          colorScheme: 'AUTO',
          ...(providerConfig?.userProfile?.accountSettings?.layoutAndThemeSettings ?? {}),
        },
        ...(providerConfig?.userProfile?.accountSettings ?? {}),
      },
      ...(providerConfig?.userProfile ?? {}),
    })
    const permissionsTopic = new PermissionsTopic()
    await permissionsTopic.publish(providerConfig?.permissions ?? [])
    permissionsTopic.destroy()
    await appStateService.currentWorkspace$.publish({
      workspaceName: 'Standalone',
      baseUrl: '/',
      portalName: 'Standalone',
      microfrontendRegistrations: [],
      ...(providerConfig?.workspace ?? {}),
    })
    await apply(themeService, {
      ...(providerConfig?.theme ?? {}),
    })
  }
}

export interface ProvideStandaloneProvidersConfig {
  workspace: Partial<Workspace>
  userProfile: Partial<UserProfile>
  mfeInfo: Partial<MfeInfo>
  theme: Partial<Theme>
  permissions?: string[]
}

export const PROVIDE_STANDALONE_PROVIDERS_CONFIG = new InjectionToken<ProvideStandaloneProvidersConfig>(
  'provideStandaloneProvidersConfig'
)

export function provideStandaloneProviders(config?: Partial<ProvideStandaloneProvidersConfig>) {
  return [
    {
      provide: PROVIDE_STANDALONE_PROVIDERS_CONFIG,
      useValue: config,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AppStateService, UserService, ConfigurationService, ThemeService, PROVIDE_STANDALONE_PROVIDERS_CONFIG],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeRouter,
      multi: true,
      deps: [Router, AppStateService],
    },
    provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/'),
    provideAlwaysGrantPermissionChecker(),
    provideTokenInterceptor(),
    provideAuthService(),
    MessageService,
  ]
}


```


