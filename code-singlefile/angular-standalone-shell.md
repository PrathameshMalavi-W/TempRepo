#libs-Folder => angular-standalone-shell

********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-standalone-shell > src > 
index.ts


```ts

export * from './lib/utils/expose-standalone.utils'
export * from './lib/standalone-shell.module'
export * from './lib/components/standalone-shell-viewport/standalone-shell-viewport.component'


```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-standalone-shell > src > lib > standalone-shell.module.ts


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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-standalone-shell > src > lib > 
components > standalone-shell-viewport.componentts


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

```scss

::ng-deep {
  .layout-menu-button-hidden {
    .layout-topbar {
      .layout-topbar-left {
        padding-right: 0;

        .layout-menu-button {
          display: none;
        }
      }

      .layout-topbar-right {
        padding-left: 0;
      }
    }
  }
}

```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-standalone-shell > src > lib >
utils > expose-standalone.utils.ts


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
  console.log(`🎨 Applying theme: ${theme.name}`)
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




********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-standalone-shell > assets > styles.scss


```scss
@import 'primeflex/primeflex.scss';

body {
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 0;
  margin: 0;
  background-color: var(--body-bg-color);
  min-height: 100%;

  a {
    text-decoration: none;
    color: var(--text-secondary-color);
  }
}
```