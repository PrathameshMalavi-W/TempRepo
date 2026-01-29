# Files from C:\Users\prath\onecx\onecx-ui\onecx-shell-ui\src

## Folder: onecx-shell-ui/src/app (5 files)

### File: onecx-shell-ui/src/app/app.component.html

```html

<ocx-shell-portal-viewport></ocx-shell-portal-viewport>


```

### File: onecx-shell-ui/src/app/app.component.spec.ts

```ts

import { TestBed } from '@angular/core/testing'

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents()
  })

  it('should ', () => {
    // do nothing for now...
  })
})


```

### File: onecx-shell-ui/src/app/app.component.ts

```ts

import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { PrimeNG } from 'primeng/config'
import { merge, mergeMap } from 'rxjs'

import { UserService } from '@onecx/angular-integration-interface'

@Component({
  standalone: false,
  selector: 'ocx-shell-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'shell'

  constructor(
    private readonly translateService: TranslateService,
    private readonly config: PrimeNG,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.lang$.subscribe((lang) => {
      document.documentElement.lang = lang;
      this.translateService.use(lang)
    })
    merge(
      this.translateService.onLangChange,
      this.translateService.onTranslationChange,
      this.translateService.onDefaultLangChange
    )
      .pipe(mergeMap(() => this.translateService.get('SHELL')))
      .subscribe((res) => {
        this.config.setTranslation(res)
      })
  }
}


```

### File: onecx-shell-ui/src/app/app.module.ts

```ts

import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { inject, NgModule, provideAppInitializer } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Router, RouterModule } from '@angular/router'
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { getLocation, getNormalizedBrowserLocales, normalizeLocales } from '@onecx/accelerator'
import { provideAuthService, provideTokenInterceptor } from '@onecx/angular-auth'
import {
  APP_CONFIG,
  AppStateService,
  CONFIG_KEY,
  ConfigurationService,
  POLYFILL_SCOPE_MODE,
  RemoteComponentsService,
  ThemeService,
  UserService
} from '@onecx/angular-integration-interface'
import { SLOT_SERVICE, SlotService } from '@onecx/angular-remote-components'
import { catchError, filter, firstValueFrom, retry } from 'rxjs'

import {
  createTranslateLoader,
  MultiLanguageMissingTranslationHandler,
  provideTranslationPathFromMeta,
  SKIP_STYLE_SCOPING
} from '@onecx/angular-utils'
import { provideThemeConfig } from '@onecx/angular-utils/theme/primeng'

import { CurrentLocationPublisher, EventsTopic, Theme, UserProfile } from '@onecx/integration-interface'

import {
  BASE_PATH,
  LoadWorkspaceConfigResponse,
  UserProfileBffService,
  WorkspaceConfigBffService
} from 'src/app/shared/generated'
import { environment } from 'src/environments/environment'

import { PermissionProxyService } from './shell/services/permission-proxy.service'
import { RoutesService } from './shell/services/routes.service'
import { initializationErrorHandler } from './shell/utils/initialization-error-handler.utils'

import { CommonModule } from '@angular/common'
import { providePrimeNG } from 'primeng/config'
import { AppComponent } from './app.component'
import { appRoutes } from './app.routes'
import { AppLoadingSpinnerComponent } from './shell/components/app-loading-spinner/app-loading-spinner.component'
import { GlobalErrorComponent } from './shell/components/error-component/global-error.component'
import { PortalViewportComponent } from './shell/components/portal-viewport/portal-viewport.component'
import { ParametersService } from './shell/services/parameters.service'
import { mapSlots } from './shell/utils/slot-names-mapper'

async function styleInitializer(
  configService: ConfigurationService,
  http: HttpClient,
  appStateService: AppStateService
) {
  const mode = await configService.getProperty(CONFIG_KEY.POLYFILL_SCOPE_MODE)
  if (mode === POLYFILL_SCOPE_MODE.PRECISION) {
    const { applyPrecisionPolyfill } = await import('src/scope-polyfill/polyfill')
    applyPrecisionPolyfill()
  } else {
    const { applyPerformancePolyfill } = await import('src/scope-polyfill/polyfill')
    applyPerformancePolyfill()
  }

  await Promise.all([
    Promise.all([
      import('./shell/utils/styles/shell-styles.utils'),
      appStateService.isAuthenticated$.isInitialized
    ]).then(async ([{ fetchShellStyles, loadShellStyles }, _]) => {
      const css = await fetchShellStyles(http)
      loadShellStyles(css)
    }),
    Promise.all([
      import('./shell/utils/styles/legacy-style.utils'),
      appStateService.isAuthenticated$.isInitialized
    ]).then(async ([{ fetchPortalLayoutStyles, loadPortalLayoutStyles }, _]) => {
      const css = await fetchPortalLayoutStyles(http)
      loadPortalLayoutStyles(css)
    })
  ])
}

function publishCurrentWorkspace(
  appStateService: AppStateService,
  loadWorkspaceConfigResponse: LoadWorkspaceConfigResponse
) {
  return appStateService.currentWorkspace$.publish({
    baseUrl: loadWorkspaceConfigResponse.workspace.baseUrl,
    portalName: loadWorkspaceConfigResponse.workspace.name,
    workspaceName: loadWorkspaceConfigResponse.workspace.name,
    routes: loadWorkspaceConfigResponse.routes,
    homePage: loadWorkspaceConfigResponse.workspace.homePage,
    microfrontendRegistrations: [],
    displayName: loadWorkspaceConfigResponse.workspace.displayName
  })
}

export async function workspaceConfigInitializer(
  workspaceConfigBffService: WorkspaceConfigBffService,
  routesService: RoutesService,
  themeService: ThemeService,
  appStateService: AppStateService,
  remoteComponentsService: RemoteComponentsService,
  parametersService: ParametersService,
  router: Router
) {
  await appStateService.isAuthenticated$.isInitialized

  const loadWorkspaceConfigResponse = await firstValueFrom(
    workspaceConfigBffService
      .loadWorkspaceConfig({
        path: getLocation().applicationPath
      })
      .pipe(
        retry({ delay: 500, count: 3 }),
        catchError((error) => initializationErrorHandler(error, router))
      )
  )

  if (loadWorkspaceConfigResponse) {
    const parsedProperties = JSON.parse(loadWorkspaceConfigResponse.theme.properties) as Record<
      string,
      Record<string, string>
    >
    const themeWithParsedProperties = {
      ...loadWorkspaceConfigResponse.theme,
      properties: parsedProperties
    }

    await Promise.all([
      publishCurrentWorkspace(appStateService, loadWorkspaceConfigResponse),
      routesService
        .init(loadWorkspaceConfigResponse.routes)
        .then(urlChangeListenerInitializer(router, appStateService)),
      apply(themeService, themeWithParsedProperties),
      remoteComponentsService.remoteComponents$.publish({
        components: loadWorkspaceConfigResponse.components,
        slots: mapSlots(loadWorkspaceConfigResponse.slots)
      })
    ])
    parametersService.initialize()
  }
}

export async function userProfileInitializer(
  userProfileBffService: UserProfileBffService,
  userService: UserService,
  appStateService: AppStateService,
  router: Router
) {
  await appStateService.isAuthenticated$.isInitialized
  const getUserProfileResponse = await firstValueFrom(
    userProfileBffService.getUserProfile().pipe(
      retry({ delay: 500, count: 3 }),
      catchError((error) => {
        return initializationErrorHandler(error, router)
      })
    )
  )

  if (getUserProfileResponse) {
    console.log('ORGANIZATION : ', getUserProfileResponse.userProfile.organization)

    const profile: UserProfile = { ...getUserProfileResponse.userProfile }
    profile.settings ??= {}
    profile.settings.locales ? normalizeLocales(profile.settings.locales) : getNormalizedBrowserLocales()

    await userService.profile$.publish(getUserProfileResponse.userProfile)
  }
}

export function slotInitializer(slotService: SlotService) {
  slotService.init()
}

export function permissionProxyInitializer(permissionProxyService: PermissionProxyService) {
  permissionProxyService.init()
}

export function configurationServiceInitializer(configurationService: ConfigurationService) {
  configurationService.init()
}

const pushState = globalThis.history.pushState
globalThis.history.pushState = (data: any, unused: string, url?: string) => {
  const isRouterSync = data?.isRouterSync
  if (data && 'isRouterSync' in data) {
    delete data.isRouterSync
  }
  if (data.navigationId !== 'undefined' && data.navigationId === -1) {
    console.warn('Navigation ID is -1, indicating a potential invalid microfrontend initialization.')
    return
  }
  pushState.bind(globalThis.history)(data, unused, url)
  if (!isRouterSync) {
    new CurrentLocationPublisher().publish({
      url,
      isFirst: false
    })
  }
}

const replaceState = globalThis.history.replaceState
globalThis.history.replaceState = (data: any, unused: string, url?: string) => {
  const isRouterSync = data?.isRouterSync
  let preventLocationPropagation = false
  if (data && 'isRouterSync' in data) {
    delete data.isRouterSync
  }
  if (data?.navigationId !== 'undefined' && data?.navigationId === -1) {
    console.warn('Navigation ID is -1, indicating a potential invalid microfrontend initialization.')
    return
  }
  // Edge Case Handling: React Router initialization with a replaceState call
  if (checkIfReactRouterInitialization(data, url)) {
    const _url = _constructCurrentURL()
    // Use current URL (instead of undefined) but keep data from react-router
    replaceState.bind(globalThis.history)(data, '', _url)
    preventLocationPropagation = true
  }

  if (!preventLocationPropagation) replaceState.bind(window.history)(data, unused, url) // NOSONAR

  if (!isRouterSync && !preventLocationPropagation) {
    new CurrentLocationPublisher().publish({
      url,
      isFirst: false
    })
  }
}

/**
 * Checks if the replaceState call is from react-router initialization
 * @param data
 * @param url
 * @returns whether the location propagation should be prevented
 */
function checkIfReactRouterInitialization(data: any, url?: string) {
  if (data && 'idx' in data && data.idx === 0 && url === undefined) {
    return true
  }
  return false
}

/**
 * Constructs the current URL relative to the deployment path
 * @returns the current URL
 */
function _constructCurrentURL() {
  return `${location.pathname.substring(getLocation().deploymentPath.length)}${location.search}${location.hash}`
}

export function urlChangeListenerInitializer(router: Router, appStateService: AppStateService) {
  return async () => {
    await appStateService.isAuthenticated$.isInitialized
    let lastUrl = ''
    let isFirstRoute = true
    const url = _constructCurrentURL()
    new CurrentLocationPublisher().publish({
      url,
      isFirst: true
    })
    appStateService.currentLocation$.subscribe(() => {
      const routerUrl = `${location.pathname.substring(
        getLocation().deploymentPath.length
      )}${location.search}${location.hash}`
      if (routerUrl !== lastUrl) {
        lastUrl = routerUrl
        if (isFirstRoute) {
          isFirstRoute = false
        } else {
          router.navigateByUrl(routerUrl, {
            replaceUrl: true,
            state: { isRouterSync: true }
          })
        }
      }
    })

    const eventsTopic = new EventsTopic()
    eventsTopic.pipe(filter((event) => event.type === 'revertNavigation')).subscribe((event) => {
      if (globalThis.history.length > 1) {
        globalThis.history.back()
      } else {
        console.log('No previous route in history.')
      }
    })
  }
}

async function apply(themeService: ThemeService, theme: Theme): Promise<void> {
  console.log(`ðŸŽ¨ Applying theme: ${theme.name}`)
  await themeService.currentTheme$.publish(theme)
  if (theme.properties) {
    for (const group of Object.values(theme.properties)) {
      for (const [key, value] of Object.entries(group)) {
        document.documentElement.style.setProperty(`--${key}`, value)
      }
    }
  }
}

declare const __webpack_share_scopes__: any

declare global {
  interface Window {
    onecxWebpackContainer: any
  }
}

export async function shareMfContainer() {
  window.onecxWebpackContainer = __webpack_share_scopes__ // NOSONAR
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterModule.forRoot(appRoutes),
    TranslateModule.forRoot({
      isolate: true,
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MultiLanguageMissingTranslationHandler
      }
    }),

    PortalViewportComponent,
    GlobalErrorComponent,
    AppLoadingSpinnerComponent
  ],
  providers: [
    provideAppInitializer(() => {
      return workspaceConfigInitializer(
        inject(WorkspaceConfigBffService),
        inject(RoutesService),
        inject(ThemeService),
        inject(AppStateService),
        inject(RemoteComponentsService),
        inject(ParametersService),
        inject(Router)
      )
    }),
    provideThemeConfig(),
    provideTokenInterceptor(),
    provideHttpClient(withInterceptorsFromDi()),
    provideAuthService(),
    providePrimeNG(),
    {
      provide: SKIP_STYLE_SCOPING,
      useValue: true
    },
    provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/'),
    { provide: APP_CONFIG, useValue: environment },
    provideAppInitializer(() => {
      permissionProxyInitializer(inject(PermissionProxyService))
    }),
    provideAppInitializer(() => {
      return configurationServiceInitializer(inject(ConfigurationService))
    }),
    provideAppInitializer(() => {
      // Load dynamic content initializer lazily to avoid static import
      const configService = inject(ConfigurationService)
      return import('./shell/utils/styles/dynamic-content-initializer.utils').then(({ dynamicContentInitializer }) =>
        dynamicContentInitializer(configService)
      )
    }),
    provideAppInitializer(() => {
      return userProfileInitializer(
        inject(UserProfileBffService),
        inject(UserService),
        inject(AppStateService),
        inject(Router)
      )
    }),
    provideAppInitializer(() => {
      return slotInitializer(inject(SLOT_SERVICE))
    }),
    provideAppInitializer(() => {
      return styleInitializer(inject(ConfigurationService), inject(HttpClient), inject(AppStateService))
    }),
    provideAppInitializer(() => {
      return shareMfContainer()
    }),
    provideAppInitializer(() => {
      // Lazily initialize style changes listener
      return import('./shell/utils/styles/style-changes-listener.utils').then(({ styleChangesListenerInitializer }) =>
        styleChangesListenerInitializer()
      )
    }),
    { provide: SLOT_SERVICE, useExisting: SlotService },
    { provide: BASE_PATH, useValue: './shell-bff' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


```

### File: onecx-shell-ui/src/app/app.routes.ts

```ts

import { Route } from '@angular/router'

// Initialization error page is lazy-loaded via InitErrorModule

export const appRoutes: Route[] = [
  {
    path: 'portal-initialization-error-page',
    data: { message: '' },
    loadChildren: () => import('src/app/init-error/init-error.module').then((m) => m.InitErrorModule),
    title: 'Initialization Error'
  },
  {
    path: 'remote-loading-error-page',
    loadChildren: () => import('src/app/error/error.module').then((m) => m.ErrorModule),
    title: 'Error'
  }
]


```

## Folder: onecx-shell-ui/src/app/error/components/error-page (1 files)

### File: onecx-shell-ui/src/app/error/components/error-page/error-page.component.ts

```ts

import { Component } from '@angular/core'
import { Location, CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'

import { getLocation } from '@onecx/accelerator'

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="p-4 flex flex-column gap-5">
      <div>
        <h1 class="md:text-xl text-lg">{{ 'ERROR_PAGE.TITLE' | translate }}</h1>
        <p class="mb-1">{{ 'ERROR_PAGE.DETAILS' | translate }}</p>
        <p>
          <span class="font-bold"> {{ 'ERROR_PAGE.REQUESTED_PAGE' | translate }} </span>
          <i>{{ requestedApplicationPath }}</i>
        </p>
      </div>
      <button
        class="w-max"
        (click)="onReloadPage()"
        [ngStyle]="{ cursor: 'pointer' }"
        routerLinkActive="router-link-active"
        [attr.aria-label]="'ERROR_PAGE.ACTION' | translate"
        [attr.title]="'ERROR_PAGE.ACTION.TOOLTIP' | translate"
      >
        {{ 'ERROR_PAGE.ACTION' | translate }}
      </button>
    </div>
  `
})
export class ErrorPageComponent {
  requestedApplicationPath: string

  constructor(private readonly route: ActivatedRoute) {
    this.requestedApplicationPath = this.route.snapshot.paramMap.get('requestedApplicationPath') ?? ''
  }

  public onReloadPage() {
    const pageLocation = getLocation()
    const reloadBaseUrl = Location.joinWithSlash(pageLocation.origin, pageLocation.deploymentPath)
    const reloadHref = Location.joinWithSlash(reloadBaseUrl, this.requestedApplicationPath)
    globalThis.location.href = reloadHref
  }
}


```

## Folder: onecx-shell-ui/src/app/error (1 files)

### File: onecx-shell-ui/src/app/error/error.module.ts

```ts

import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'

import { ErrorPageComponent } from './components/error-page/error-page.component'

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ErrorPageComponent,
    RouterModule.forChild([
      {
        path: '',
        component: ErrorPageComponent,
        title: 'Error'
      }
    ])
  ]
})
export class ErrorModule {}


```

## Folder: onecx-shell-ui/src/app/home/components/home (2 files)

### File: onecx-shell-ui/src/app/home/components/home/home.component.html

```html

<ocx-shell-welcome-message></ocx-shell-welcome-message>


```

### File: onecx-shell-ui/src/app/home/components/home/home.component.ts

```ts

import { Component } from '@angular/core'
import { map, Observable } from 'rxjs'

import { AppStateService } from '@onecx/angular-integration-interface'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { WelcomeMessageComponent } from '../welcome-message-component/welcome-message.component'
import { Workspace } from '@onecx/integration-interface'

@Component({
  standalone: true,
  selector: 'ocx-shell-home',
  imports: [CommonModule, TranslateModule, WelcomeMessageComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  workspace$: Observable<Workspace | undefined>

  constructor(private readonly appStateService: AppStateService) {
    this.workspace$ = this.appStateService.currentWorkspace$.pipe(map((currentWorkspace) => currentWorkspace))
  }
}


```

## Folder: onecx-shell-ui/src/app/home/components/welcome-message-component (2 files)

### File: onecx-shell-ui/src/app/home/components/welcome-message-component/welcome-message.component.html

```html

<!-- Simple welcome message; content rendered based on current user/workspace topics -->


```

### File: onecx-shell-ui/src/app/home/components/welcome-message-component/welcome-message.component.ts

```ts

import { Component } from '@angular/core'

import { AppStateService, UserService } from '@onecx/angular-integration-interface'
import { CurrentWorkspaceTopic, UserProfileTopic } from '@onecx/integration-interface'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  standalone: true,
  selector: 'ocx-shell-welcome-message',
  imports: [CommonModule, TranslateModule],
  templateUrl: './welcome-message.component.html'
})
export class WelcomeMessageComponent {
  user$: UserProfileTopic
  workspace$: CurrentWorkspaceTopic

  constructor(
    private readonly userService: UserService,
    private readonly appStateService: AppStateService
  ) {
    this.user$ = this.userService.profile$
    this.workspace$ = this.appStateService.currentWorkspace$
  }
}


```

## Folder: onecx-shell-ui/src/app/home (1 files)

### File: onecx-shell-ui/src/app/home/home.module.ts

```ts

import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import { HomeComponent } from './components/home/home.component'
import { WelcomeMessageComponent } from './components/welcome-message-component/welcome-message.component'

@NgModule({
  imports: [
    CommonModule,
    HomeComponent,
    WelcomeMessageComponent,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent
      }
    ])
  ]
})
export class HomeModule {}


```

## Folder: onecx-shell-ui/src/app/init-error/components/initialization-error-page (3 files)

### File: onecx-shell-ui/src/app/init-error/components/initialization-error-page/initialization-error-page.component.html

```html

<section class="p-4" [attr.aria-label]="'INITIALIZATION_ERROR_PAGE.SECTION' | translate">
  <h1 class="md:text-xl text-lg mb-1">{{ 'INITIALIZATION_ERROR_PAGE.TITLE' | translate }}</h1>
  <p class="text-base">{{ 'INITIALIZATION_ERROR_PAGE.SUBTITLE' | translate }}</p>

  <div *ngIf="error$ | async as error" class="mt-3 flex flex-column row-gap-2 md:text-base text-sm">
    <div id="onecxInitializationErrorMessage" *ngIf="error.message">
      <div class="font-bold">{{ 'INITIALIZATION_ERROR_PAGE.DETAILS.MESSAGE' | translate }}</div>
      <i>{{ error.message }}</i>
    </div>
    <div id="onecxInitializationErrorRequestedUrl" *ngIf="error.requestedUrl">
      <div class="font-bold">{{ 'INITIALIZATION_ERROR_PAGE.DETAILS.REQUESTED_URL' | translate }}</div>
      <i>{{ error.requestedUrl }}</i>
    </div>
    <div id="onecxInitializationErrorDetail" *ngIf="error.detail">
      <div class="font-bold">{{ 'INITIALIZATION_ERROR_PAGE.DETAILS.DETAILS' | translate }}</div>
      <i>{{ error.detail }}</i>
    </div>
    <div id="onecxInitializationErrorErrorCode" *ngIf="error.errorCode">
      <div class="font-bold">{{ 'INITIALIZATION_ERROR_PAGE.DETAILS.ERRORCODE' | translate }}</div>
      <i>{{ error.errorCode }}</i>
    </div>
    <div id="onecxInitializationErrorInvalidParams" *ngIf="error.invalidParams">
      <div class="font-bold">{{ 'INITIALIZATION_ERROR_PAGE.DETAILS.INVALID_PARAMS' | translate }}</div>
      <i>{{ error.invalidParams }}</i>
    </div>
    <div id="onecxInitializationErrorParams" *ngIf="error.params">
      <div class="font-bold">{{ 'INITIALIZATION_ERROR_PAGE.DETAILS.PARAMS' | translate }}</div>
      <i>{{ error.params }}</i>
    </div>
  </div>

  <button
    class="mt-4 w-max"
    (click)="onLogout()"
    [attr.aria-label]="'LOGOUT' | translate"
    [attr.title]="'LOGOUT.TOOLTIP' | translate"
  >
    {{ 'LOGOUT' | translate }}
  </button>
</section>


```

### File: onecx-shell-ui/src/app/init-error/components/initialization-error-page/initialization-error-page.component.spec.ts

```ts

import { TestBed, ComponentFixture } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { of } from 'rxjs'
import { TranslateTestingModule } from 'ngx-translate-testing'

import { InitializationErrorPageComponent } from './initialization-error-page.component'
import { TooltipModule } from 'primeng/tooltip'

describe('InitializationErrorPageComponent', () => {
  let component: InitializationErrorPageComponent
  let fixture: ComponentFixture<InitializationErrorPageComponent>
  let route: ActivatedRoute

  const fragmentParams = {
    message: 'Test Error',
    requestedUrl: 'http://example.com',
    detail: 'Detail message',
    errorCode: '404',
    invalidParams: '[param1: Invalid]',
    params: '[key1: value1]'
  }

  beforeEach(() => {
    route = {
      fragment: of(new URLSearchParams(fragmentParams).toString())
    } as any

    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        InitializationErrorPageComponent,
        TooltipModule,
        TranslateTestingModule.withTranslations({
          en: require('../../../../assets/i18n/en.json')
        }).withDefaultLanguage('en')
      ],
      providers: [{ provide: ActivatedRoute, useValue: route }]
    }).compileComponents()

    fixture = TestBed.createComponent(InitializationErrorPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  describe('initialize', () => {
    it('should create', () => {
      expect(component).toBeTruthy()
    })
  })

  describe('display', () => {
    beforeEach(() => {
      route = {
        fragment: of(new URLSearchParams(fragmentParams).toString())
      } as any
    })

    it('should display the error details in the template', () => {
      fixture.detectChanges()
      const compiled = fixture.nativeElement as HTMLElement

      expect(compiled.querySelector('#onecxInitializationErrorMessage')?.textContent).toContain('Test Error')
      expect(compiled.querySelector('#onecxInitializationErrorRequestedUrl')?.textContent).toContain(
        'http://example.com'
      )
      expect(compiled.querySelector('#onecxInitializationErrorDetail')?.textContent).toContain('Detail message')
      expect(compiled.querySelector('#onecxInitializationErrorErrorCode')?.textContent).toContain('404')
      expect(compiled.querySelector('#onecxInitializationErrorInvalidParams')?.textContent).toContain(
        '[param1: Invalid]'
      )
      expect(compiled.querySelector('#onecxInitializationErrorParams')?.textContent).toContain('[key1: value1]')
    })
  })

  it('should log out', () => {
    component.onLogout()
  })
})


```

### File: onecx-shell-ui/src/app/init-error/components/initialization-error-page/initialization-error-page.component.ts

```ts

import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable, map } from 'rxjs'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

import { EventsPublisher } from '@onecx/integration-interface'

interface InitializationError {
  message: string
  requestedUrl: string
  detail: string | null
  errorCode: string | null
  params: string | null
  invalidParams: string | null
}

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './initialization-error-page.component.html'
})
export class InitializationErrorPageComponent {
  error$: Observable<InitializationError>
  public eventsPublisher$: EventsPublisher = new EventsPublisher()

  constructor(private readonly route: ActivatedRoute) {
    this.error$ = this.route.fragment.pipe(
      map((fragment) => {
        const params = new URLSearchParams(fragment ?? '')
        return {
          message: params.get('message') ?? '',
          requestedUrl: params.get('requestedUrl') ?? '',
          detail: params.get('detail'),
          errorCode: params.get('errorCode'),
          params: params.get('params'),
          invalidParams: params.get('invalidParams')
        }
      })
    )
  }

  public onLogout(): void {
    this.eventsPublisher$.publish({ type: 'authentication#logoutButtonClicked' })
  }
}


```

## Folder: onecx-shell-ui/src/app/init-error (1 files)

### File: onecx-shell-ui/src/app/init-error/init-error.module.ts

```ts

import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'

import { InitializationErrorPageComponent } from './components/initialization-error-page/initialization-error-page.component'

@NgModule({
  imports: [
    CommonModule,
    InitializationErrorPageComponent,
    TranslateModule,
    RouterModule.forChild([
      {
        path: '',
        component: InitializationErrorPageComponent,
        title: 'Initialization Error'
      }
    ])
  ]
})
export class InitErrorModule {}


```

## Folder: onecx-shell-ui/src/app/not-found/components/not-found-page (1 files)

### File: onecx-shell-ui/src/app/not-found/components/not-found-page/not-found-page.component.ts

```ts

import { Component } from '@angular/core'
import { Observable } from 'rxjs'

import { AppStateService } from '@onecx/angular-integration-interface'
import { Workspace } from '@onecx/integration-interface'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="p-4 flex flex-column gap-5">
      <div>
        <h1 class="md:text-xl text-lg">{{ 'NOT_FOUND_PAGE.TITLE' | translate }}</h1>
        <p class="">{{ 'NOT_FOUND_PAGE.DETAILS' | translate }}</p>
      </div>
      <button
        *ngIf="workspace$ | async as workspace"
        class="w-max"
        [routerLink]="[workspace.baseUrl]"
        [ngStyle]="{ cursor: 'pointer' }"
        [attr.aria-label]="'NOT_FOUND_PAGE.ACTION' | translate"
        [attr.title]="'NOT_FOUND_PAGE.ACTION.TOOLTIP' | translate"
      >
        {{ 'NOT_FOUND_PAGE.ACTION' | translate }}
      </button>
    </div>
  `
})
export class PageNotFoundComponent {
  workspace$: Observable<Workspace>

  constructor(private readonly appStateService: AppStateService) {
    this.appStateService.currentMfe$.publish({
      appId: '',
      baseHref: '/',
      mountPath: '',
      remoteBaseUrl: '',
      shellName: 'portal',
      productName: ''
    })
    this.workspace$ = this.appStateService.currentWorkspace$.asObservable()
  }
}


```

## Folder: onecx-shell-ui/src/app/not-found (1 files)

### File: onecx-shell-ui/src/app/not-found/not-found.module.ts

```ts

import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'

import { PageNotFoundComponent } from './components/not-found-page/not-found-page.component'

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    PageNotFoundComponent,
    RouterModule.forChild([
      {
        path: '',
        component: PageNotFoundComponent,
        title: 'OneCX Error'
      }
    ])
  ]
})
export class NotFoundModule {}


```

## Folder: onecx-shell-ui/src/app/remotes/shell-toast (5 files)

### File: onecx-shell-ui/src/app/remotes/shell-toast/shell-toast.component.bootstrap.ts

```ts

import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { TranslateLoader } from '@ngx-translate/core'
import { ReplaySubject } from 'rxjs'

import { bootstrapRemoteComponent } from '@onecx/angular-webcomponents'
import { provideTranslateServiceForRoot } from '@onecx/angular-remote-components'
import {
  createTranslateLoader,
  provideTranslationPathFromMeta,
  REMOTE_COMPONENT_CONFIG,
  RemoteComponentConfig
} from '@onecx/angular-utils'

import { environment } from 'src/environments/environment'

import { OneCXShellToastComponent } from './shell-toast.component'
import { provideAnimations } from '@angular/platform-browser/animations'

bootstrapRemoteComponent(OneCXShellToastComponent, 'ocx-shell-toast-component', environment.production, [
  { provide: REMOTE_COMPONENT_CONFIG, useValue: new ReplaySubject<RemoteComponentConfig>(1) },
  provideAnimations(),
  provideTranslateServiceForRoot({
    isolate: true,
    loader: {
      provide: TranslateLoader,
      useFactory: createTranslateLoader,
      deps: [HttpClient]
    }
  }),
  provideHttpClient(withInterceptorsFromDi()),
  provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/')
])


```

### File: onecx-shell-ui/src/app/remotes/shell-toast/shell-toast.component.html

```html

<p-toast [style]="{'word-break': 'break-word'}"></p-toast>


```

### File: onecx-shell-ui/src/app/remotes/shell-toast/shell-toast.component.main.ts

```ts

import('./shell-toast.component.bootstrap').catch((err) => console.error(err)) // NOSONAR


```

### File: onecx-shell-ui/src/app/remotes/shell-toast/shell-toast.component.spec.ts

```ts

import { CommonModule } from '@angular/common'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { TestBed, waitForAsync, fakeAsync } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { ReplaySubject, firstValueFrom } from 'rxjs'

import { ConfigurationService } from '@onecx/angular-integration-interface'
import { PortalMessageServiceMock, providePortalMessageServiceMock } from '@onecx/angular-integration-interface/mocks'
import { REMOTE_COMPONENT_CONFIG, RemoteComponentConfig } from '@onecx/angular-utils'

import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { OneCXShellToastComponent } from './shell-toast.component'

function setUp() {
  const fixture = TestBed.createComponent(OneCXShellToastComponent)
  const component = fixture.componentInstance

  // Get services from component's injector (not TestBed) because overrideComponent provides separate instances
  const messageService = fixture.componentRef.injector.get(MessageService)
  const portalMessageServiceMock = fixture.componentRef.injector.get(PortalMessageServiceMock)

  const messageServiceSpy = jest.spyOn(messageService, 'add')

  TestBed.inject(ConfigurationService)
  fixture.detectChanges()

  return { fixture, component, messageService, portalMessageServiceMock, messageServiceSpy }
}

describe('OneCXShellExtensionsComponent', () => {
  const rcConfig = new ReplaySubject<RemoteComponentConfig>(1)
  const defaultRCConfig = {
    productName: 'prodName',
    appId: 'appId',
    baseUrl: 'base',
    permissions: ['permission']
  }
  rcConfig.next(defaultRCConfig) // load default

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        TranslateTestingModule.withTranslations({
          de: require('./../../../assets/i18n/de.json'),
          en: require('./../../../assets/i18n/en.json')
        }).withDefaultLanguage('en'),
        NoopAnimationsModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: REMOTE_COMPONENT_CONFIG, useValue: rcConfig },
        MessageService
      ]
    })
      .overrideComponent(OneCXShellToastComponent, {
        set: {
          imports: [TranslateTestingModule, CommonModule, ToastModule],
          providers: [
            providePortalMessageServiceMock(),
            { provide: REMOTE_COMPONENT_CONFIG, useValue: new ReplaySubject<string>(1) },
            MessageService
          ]
        }
      })
      .compileComponents()
  }))

  describe('initialize', () => {
    it('should create', () => {
      const { component } = setUp()

      expect(component).toBeTruthy()
    })

    it('should call ocxInitRemoteComponent with the correct config', async () => {
      const { component } = setUp()
      const mockConfig: RemoteComponentConfig = {
        productName: 'prodName',
        appId: 'appId',
        baseUrl: 'base',
        permissions: ['permission']
      }
      component.ocxRemoteComponentConfig = mockConfig

      const rcConfigValue = await firstValueFrom(rcConfig)

      expect(rcConfigValue).toEqual(mockConfig)
    })

    it('should subscribe to portalMessageService.message$ and call messageService.add in constructor', fakeAsync(() => {
      const { portalMessageServiceMock, messageServiceSpy } = setUp()

      portalMessageServiceMock.success({
        summaryKey: 'TEST_SUCCESS_MESSAGE_KEY'
      })

      expect(messageServiceSpy).toHaveBeenCalledTimes(1)
      expect(messageServiceSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'success',
          summaryKey: 'TEST_SUCCESS_MESSAGE_KEY'
        })
      )
    }))
  })
})


```

### File: onecx-shell-ui/src/app/remotes/shell-toast/shell-toast.component.ts

```ts

import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import { UntilDestroy } from '@ngneat/until-destroy'
import { ReplaySubject } from 'rxjs'

import { AngularAcceleratorModule } from '@onecx/angular-accelerator'
import { Message, PortalMessageService } from '@onecx/angular-integration-interface'
import {
  AngularRemoteComponentsModule,
  ocxRemoteComponent,
  ocxRemoteWebcomponent
} from '@onecx/angular-remote-components'
import { REMOTE_COMPONENT_CONFIG, RemoteComponentConfig } from '@onecx/angular-utils'
import { MessageService } from 'primeng/api'
import { PrimeNG } from 'primeng/config'
import { ToastModule } from 'primeng/toast'

// Should be moved out of shell to another repo later, so that primeNG dependency can be started to be removed from shell
@Component({
  selector: 'ocx-shell-toast',
  templateUrl: './shell-toast.component.html',
  standalone: true,
  imports: [AngularRemoteComponentsModule, CommonModule, AngularAcceleratorModule, ToastModule],
  providers: [{ provide: REMOTE_COMPONENT_CONFIG, useValue: new ReplaySubject<string>(1) }, MessageService]
})
@UntilDestroy()
export class OneCXShellToastComponent implements ocxRemoteComponent, ocxRemoteWebcomponent, OnInit {
  private readonly rcConfig = inject<ReplaySubject<RemoteComponentConfig>>(REMOTE_COMPONENT_CONFIG)
  private readonly primengConfig = inject(PrimeNG)
  private readonly messageService = inject(MessageService)
  private readonly portalMessageService = inject(PortalMessageService)

  @Input() set ocxRemoteComponentConfig(rcConfig: RemoteComponentConfig) {
    this.ocxInitRemoteComponent(rcConfig)
  }

  constructor() {
    this.portalMessageService.message$.subscribe((message: Message) => this.messageService.add(message))
  }

  ngOnInit() {
    this.primengConfig.ripple.set(true)
  }

  public ocxInitRemoteComponent(rcConfig: RemoteComponentConfig) {
    this.rcConfig.next(rcConfig)
  }
}


```

## Folder: onecx-shell-ui/src/app/remotes/version-info (5 files)

### File: onecx-shell-ui/src/app/remotes/version-info/version-info.component.bootstrap.ts

```ts

import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { TranslateLoader } from '@ngx-translate/core'
import { ReplaySubject } from 'rxjs'

import { bootstrapRemoteComponent } from '@onecx/angular-webcomponents'
import { provideTranslateServiceForRoot } from '@onecx/angular-remote-components'
import {
  createTranslateLoader,
  provideTranslationPathFromMeta,
  REMOTE_COMPONENT_CONFIG,
  RemoteComponentConfig
} from '@onecx/angular-utils'

import { environment } from 'src/environments/environment'

import { OneCXVersionInfoComponent } from './version-info.component'

bootstrapRemoteComponent(OneCXVersionInfoComponent, 'ocx-version-info-component', environment.production, [
  { provide: REMOTE_COMPONENT_CONFIG, useValue: new ReplaySubject<RemoteComponentConfig>(1) },
  provideTranslateServiceForRoot({
    isolate: true,
    loader: {
      provide: TranslateLoader,
      useFactory: createTranslateLoader,
      deps: [HttpClient]
    }
  }),
  provideHttpClient(withInterceptorsFromDi()),
  provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/')
])


```

### File: onecx-shell-ui/src/app/remotes/version-info/version-info.component.html

```html

<div
  *ngIf="versionInfo$ | async as version"
  class="w-full text-right"
  [attr.aria-label]="'Version Information'"
  role="note"
>
  <span [attr.aria-label]="'Workspace'" [attr.title]="'Workspace'" role="note"> {{ version.workspaceName }} </span>
  <span [attr.aria-label]="'Shell'" [attr.title]="'Shell'" role="note"> {{ version.shellInfo }} </span>
  <span aria-hidden="true">{{ version.separator }}</span>
  <span [attr.aria-label]="'Microfrontend'" [attr.title]="'Microfrontend'" role="note"> {{ version.mfeInfo }} </span>
</div>


```

### File: onecx-shell-ui/src/app/remotes/version-info/version-info.component.main.ts

```ts

import('./version-info.component.bootstrap').catch((err) => console.error(err))


```

### File: onecx-shell-ui/src/app/remotes/version-info/version-info.component.spec.ts

```ts

import { TestBed, waitForAsync } from '@angular/core/testing'
import { CommonModule } from '@angular/common'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { ReplaySubject, firstValueFrom } from 'rxjs'

import { REMOTE_COMPONENT_CONFIG, RemoteComponentConfig } from '@onecx/angular-utils'
import { ConfigurationService, MfeInfo } from '@onecx/angular-integration-interface'
import {
  AppStateServiceMock,
  ConfigurationServiceMock,
  provideAppStateServiceMock,
  provideConfigurationServiceMock
} from '@onecx/angular-integration-interface/mocks'
import { CONFIG_KEY } from '@onecx/angular-integration-interface'

import { OneCXVersionInfoComponent, Version } from './version-info.component'
import { Workspace } from '@onecx/integration-interface'

describe('OneCXVersionInfoComponent', () => {
  const rcConfig = new ReplaySubject<RemoteComponentConfig>(1)
  const defaultRCConfig = {
    productName: 'prodName',
    appId: 'appId',
    baseUrl: 'base',
    permissions: ['permission']
  }
  rcConfig.next(defaultRCConfig) // load default

  function setUp() {
    const fixture = TestBed.createComponent(OneCXVersionInfoComponent)
    const component = fixture.componentInstance
    TestBed.inject(ConfigurationService)
    component.config.init()
    fixture.detectChanges()
    return { fixture, component }
  }

  let mockConfigurationService: ConfigurationServiceMock
  let mockAppStateService: AppStateServiceMock

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        TranslateTestingModule.withTranslations({
          de: require('./../../../assets/i18n/de.json'),
          en: require('./../../../assets/i18n/en.json')
        }).withDefaultLanguage('en'),
        NoopAnimationsModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAppStateServiceMock(),
        provideConfigurationServiceMock(),
        { provide: REMOTE_COMPONENT_CONFIG, useValue: rcConfig }
      ]
    })
      .overrideComponent(OneCXVersionInfoComponent, {
        set: {
          imports: [TranslateTestingModule, CommonModule]
        }
      })
      .compileComponents()

    // Set initial values
    mockConfigurationService = TestBed.inject(ConfigurationServiceMock)
    mockConfigurationService.config$.publish({ [CONFIG_KEY.APP_VERSION]: 'v1' })

    mockAppStateService = TestBed.inject(AppStateServiceMock)
    mockAppStateService.currentMfe$.publish({ displayName: 'OneCX Workspace UI', version: '1.0.0' } as MfeInfo)
    mockAppStateService.currentWorkspace$.publish({ workspaceName: 'ADMIN' } as Workspace)
  }))

  describe('initialize', () => {
    it('should create', () => {
      const { component } = setUp()

      expect(component).toBeTruthy()
    })

    it('should call ocxInitRemoteComponent with the correct config', async () => {
      const { component } = setUp()
      const mockConfig: RemoteComponentConfig = {
        productName: 'prodName',
        appId: 'appId',
        baseUrl: 'base',
        permissions: ['permission']
      }
      component.ocxRemoteComponentConfig = mockConfig

      const rcConfigValue = await firstValueFrom(rcConfig)

      expect(rcConfigValue).toEqual(mockConfig)
    })

    it('should getting version info', async () => {
      mockAppStateService.currentMfe$.publish({ displayName: 'OneCX Workspace UI', version: 'v1.0.0' } as MfeInfo)
      mockAppStateService.currentWorkspace$.publish({ workspaceName: 'ADMIN' } as Workspace)
      const { component } = setUp()
      const mockVersion: Version = {
        workspaceName: 'ADMIN',
        shellInfo: 'v1',
        mfeInfo: 'OneCX Workspace UI v1.0.0',
        separator: ' - '
      }

      const versionInfo = await firstValueFrom(component.versionInfo$)

      expect(versionInfo).toEqual(mockVersion)
    })

    it('should getting version info - no workspace version', async () => {
      const mfe = { displayName: 'OneCX Workspace UI' } as MfeInfo
      mockAppStateService.currentMfe$.publish(mfe)
      const w = { workspaceName: 'ADMIN' } as Workspace
      mockAppStateService.currentWorkspace$.publish({ workspaceName: 'ADMIN' } as Workspace)
      const mockVersion: Version = {
        workspaceName: w.workspaceName,
        shellInfo: 'v1',
        mfeInfo: mfe.displayName, // no version
        separator: ' - '
      }

      const { component } = setUp()

      const versionInfo = await firstValueFrom(component.versionInfo$)
      expect(versionInfo).toEqual(mockVersion)
    })

    it('should getting version info - no workspace version', async () => {
      const mfe = {} as MfeInfo
      mockAppStateService.currentMfe$.publish(mfe)
      const w = { workspaceName: 'ADMIN' } as Workspace
      mockAppStateService.currentWorkspace$.publish({ workspaceName: 'ADMIN' } as Workspace)
      const mockVersion: Version = {
        workspaceName: w.workspaceName,
        shellInfo: 'v1',
        mfeInfo: '', // empty
        separator: ''
      }

      const { component } = setUp()

      const versionInfo = await firstValueFrom(component.versionInfo$)
      expect(versionInfo).toEqual(mockVersion)
    })
  })
})


```

### File: onecx-shell-ui/src/app/remotes/version-info/version-info.component.ts

```ts

import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UntilDestroy } from '@ngneat/until-destroy'
import { combineLatest, from, map, Observable, ReplaySubject } from 'rxjs'

import { REMOTE_COMPONENT_CONFIG, RemoteComponentConfig } from '@onecx/angular-utils'
import {
  AngularRemoteComponentsModule,
  ocxRemoteComponent,
  ocxRemoteWebcomponent
} from '@onecx/angular-remote-components'
import { AppStateService, CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { AngularAcceleratorModule } from '@onecx/angular-accelerator'

export type Version = {
  workspaceName: string
  shellInfo?: string
  mfeInfo?: string
  separator?: string
}

@Component({
  selector: 'ocx-shell-version-info',
  templateUrl: './version-info.component.html',
  standalone: true,
  imports: [AngularRemoteComponentsModule, CommonModule, AngularAcceleratorModule],
  providers: [{ provide: REMOTE_COMPONENT_CONFIG, useValue: new ReplaySubject<string>(1) }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
@UntilDestroy()
export class OneCXVersionInfoComponent implements ocxRemoteComponent, ocxRemoteWebcomponent {
  private readonly rcConfig = inject<ReplaySubject<RemoteComponentConfig>>(REMOTE_COMPONENT_CONFIG)
  private readonly appState = inject(AppStateService)
  public readonly config = inject(ConfigurationService)

  @Input() set ocxRemoteComponentConfig(rcConfig: RemoteComponentConfig) {
    this.ocxInitRemoteComponent(rcConfig)
  }

  public versionInfo$: Observable<Version | undefined> = combineLatest([
    this.appState.currentMfe$.asObservable(),
    this.appState.currentWorkspace$.asObservable(),
    this.config.getProperty(CONFIG_KEY.APP_VERSION),
    from(this.config.isInitialized)
  ]).pipe(
    map(([mfe, workspace, hostVersion]) => {
      const mfeVersion = mfe.version ?? ''
      const mfeInfo = mfe.displayName + (mfe.version ? ' ' + mfeVersion : '')
      const version: Version = {
        workspaceName: workspace.workspaceName,
        shellInfo: hostVersion,
        mfeInfo: mfe.displayName ? mfeInfo : '',
        separator: mfe.displayName || mfe.version ? ' - ' : ''
      }
      return version
    })
  )

  public ocxInitRemoteComponent(rcConfig: RemoteComponentConfig) {
    this.rcConfig.next(rcConfig)
  }
}


```

## Folder: onecx-shell-ui/src/app/shared/generated (6 files)

### File: onecx-shell-ui/src/app/shared/generated/api.module.ts

```ts

import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}


```

### File: onecx-shell-ui/src/app/shared/generated/configuration.ts

```ts

import { HttpParameterCodec } from '@angular/common/http';
import { Param } from './param';

export interface ConfigurationParameters {
    /**
     *  @deprecated Since 5.0. Use credentials instead
     */
    apiKeys?: {[ key: string ]: string};
    username?: string;
    password?: string;
    /**
     *  @deprecated Since 5.0. Use credentials instead
     */
    accessToken?: string | (() => string);
    basePath?: string;
    withCredentials?: boolean;
    /**
     * Takes care of encoding query- and form-parameters.
     */
    encoder?: HttpParameterCodec;
    /**
     * Override the default method for encoding path parameters in various
     * <a href="https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#style-values">styles</a>.
     * <p>
     * See {@link README.md} for more details
     * </p>
     */
    encodeParam?: (param: Param) => string;
    /**
     * The keys are the names in the securitySchemes section of the OpenAPI
     * document. They should map to the value used for authentication
     * minus any standard prefixes such as 'Basic' or 'Bearer'.
     */
    credentials?: {[ key: string ]: string | (() => string | undefined)};
}

export class Configuration {
    /**
     *  @deprecated Since 5.0. Use credentials instead
     */
    apiKeys?: {[ key: string ]: string};
    username?: string;
    password?: string;
    /**
     *  @deprecated Since 5.0. Use credentials instead
     */
    accessToken?: string | (() => string);
    basePath?: string;
    withCredentials?: boolean;
    /**
     * Takes care of encoding query- and form-parameters.
     */
    encoder?: HttpParameterCodec;
    /**
     * Encoding of various path parameter
     * <a href="https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#style-values">styles</a>.
     * <p>
     * See {@link README.md} for more details
     * </p>
     */
    encodeParam: (param: Param) => string;
    /**
     * The keys are the names in the securitySchemes section of the OpenAPI
     * document. They should map to the value used for authentication
     * minus any standard prefixes such as 'Basic' or 'Bearer'.
     */
    credentials: {[ key: string ]: string | (() => string | undefined)};

    constructor(configurationParameters: ConfigurationParameters = {}) {
        this.apiKeys = configurationParameters.apiKeys;
        this.username = configurationParameters.username;
        this.password = configurationParameters.password;
        this.accessToken = configurationParameters.accessToken;
        this.basePath = configurationParameters.basePath;
        this.withCredentials = configurationParameters.withCredentials;
        this.encoder = configurationParameters.encoder;
        if (configurationParameters.encodeParam) {
            this.encodeParam = configurationParameters.encodeParam;
        }
        else {
            this.encodeParam = param => this.defaultEncodeParam(param);
        }
        if (configurationParameters.credentials) {
            this.credentials = configurationParameters.credentials;
        }
        else {
            this.credentials = {};
        }
    }

    /**
     * Select the correct content-type to use for a request.
     * Uses {@link Configuration#isJsonMime} to determine the correct content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param contentTypes - the array of content types that are available for selection
     * @returns the selected content-type or <code>undefined</code> if no selection could be made.
     */
    public selectHeaderContentType (contentTypes: string[]): string | undefined {
        if (contentTypes.length === 0) {
            return undefined;
        }

        const type = contentTypes.find((x: string) => this.isJsonMime(x));
        if (type === undefined) {
            return contentTypes[0];
        }
        return type;
    }

    /**
     * Select the correct accept content-type to use for a request.
     * Uses {@link Configuration#isJsonMime} to determine the correct accept content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param accepts - the array of content types that are available for selection.
     * @returns the selected content-type or <code>undefined</code> if no selection could be made.
     */
    public selectHeaderAccept(accepts: string[]): string | undefined {
        if (accepts.length === 0) {
            return undefined;
        }

        const type = accepts.find((x: string) => this.isJsonMime(x));
        if (type === undefined) {
            return accepts[0];
        }
        return type;
    }

    /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param mime - MIME (Multipurpose Internet Mail Extensions)
     * @return True if the given MIME is JSON, false otherwise.
     */
    public isJsonMime(mime: string): boolean {
        const jsonMime: RegExp = new RegExp('^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
        return mime !== null && (jsonMime.test(mime) || mime.toLowerCase() === 'application/json-patch+json');
    }

    public lookupCredential(key: string): string | undefined {
        const value = this.credentials[key];
        return typeof value === 'function'
            ? value()
            : value;
    }

    private defaultEncodeParam(param: Param): string {
        // This implementation exists as fallback for missing configuration
        // and for backwards compatibility to older typescript-angular generator versions.
        // It only works for the 'simple' parameter style.
        // Date-handling only works for the 'date-time' format.
        // All other styles and Date-formats are probably handled incorrectly.
        //
        // But: if that's all you need (i.e.: the most common use-case): no need for customization!

        const value = param.dataFormat === 'date-time' && param.value instanceof Date
            ? (param.value as Date).toISOString()
            : param.value;

        return encodeURIComponent(String(value));
    }
}


```

### File: onecx-shell-ui/src/app/shared/generated/encoder.ts

```ts

import { HttpParameterCodec } from '@angular/common/http';

/**
 * Custom HttpParameterCodec
 * Workaround for https://github.com/angular/angular/issues/18261
 */
export class CustomHttpParameterCodec implements HttpParameterCodec {
    encodeKey(k: string): string {
        return encodeURIComponent(k);
    }
    encodeValue(v: string): string {
        return encodeURIComponent(v);
    }
    decodeKey(k: string): string {
        return decodeURIComponent(k);
    }
    decodeValue(v: string): string {
        return decodeURIComponent(v);
    }
}


```

### File: onecx-shell-ui/src/app/shared/generated/index.ts

```ts

export * from './api/api';
export * from './model/models';
export * from './variables';
export * from './configuration';
export * from './api.module';
export * from './param';


```

### File: onecx-shell-ui/src/app/shared/generated/param.ts

```ts

/**
 * Standard parameter styles defined by OpenAPI spec
 */
export type StandardParamStyle =
  | 'matrix'
  | 'label'
  | 'form'
  | 'simple'
  | 'spaceDelimited'
  | 'pipeDelimited'
  | 'deepObject'
  ;

/**
 * The OpenAPI standard {@link StandardParamStyle}s may be extended by custom styles by the user.
 */
export type ParamStyle = StandardParamStyle | string;

/**
 * Standard parameter locations defined by OpenAPI spec
 */
export type ParamLocation = 'query' | 'header' | 'path' | 'cookie';

/**
 * Standard types as defined in <a href="https://swagger.io/specification/#data-types">OpenAPI Specification: Data Types</a>
 */
export type StandardDataType =
  | "integer"
  | "number"
  | "boolean"
  | "string"
  | "object"
  | "array"
  ;

/**
 * Standard {@link DataType}s plus your own types/classes.
 */
export type DataType = StandardDataType | string;

/**
 * Standard formats as defined in <a href="https://swagger.io/specification/#data-types">OpenAPI Specification: Data Types</a>
 */
export type StandardDataFormat =
  | "int32"
  | "int64"
  | "float"
  | "double"
  | "byte"
  | "binary"
  | "date"
  | "date-time"
  | "password"
  ;

export type DataFormat = StandardDataFormat | string;

/**
 * The parameter to encode.
 */
export interface Param {
  name: string;
  value: unknown;
  in: ParamLocation;
  style: ParamStyle,
  explode: boolean;
  dataType: DataType;
  dataFormat: DataFormat | undefined;
}


```

### File: onecx-shell-ui/src/app/shared/generated/variables.ts

```ts

import { InjectionToken } from '@angular/core';

export const BASE_PATH = new InjectionToken<string>('basePath');
export const COLLECTION_FORMATS = {
    'csv': ',',
    'tsv': '   ',
    'ssv': ' ',
    'pipes': '|'
}


```

## Folder: onecx-shell-ui/src/app/shared/generated/api (5 files)

### File: onecx-shell-ui/src/app/shared/generated/api/api.ts

```ts

export * from './parameter.service';
import { ParameterBffService } from './parameter.service';
export * from './permission.service';
import { PermissionBffService } from './permission.service';
export * from './userProfile.service';
import { UserProfileBffService } from './userProfile.service';
export * from './workspaceConfig.service';
import { WorkspaceConfigBffService } from './workspaceConfig.service';
export const APIS = [ParameterBffService, PermissionBffService, UserProfileBffService, WorkspaceConfigBffService];


```

### File: onecx-shell-ui/src/app/shared/generated/api/parameter.service.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { GetParametersRequest } from '../model/getParametersRequest';
// @ts-ignore
import { GetParametersResponse } from '../model/getParametersResponse';
// @ts-ignore
import { ProblemDetailResponse } from '../model/problemDetailResponse';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'any'
})
export class ParameterBffService {

    protected basePath = 'http://onecx-shell-bff:8080';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string|string[], @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (Array.isArray(basePath) && basePath.length > 0) {
                basePath = basePath[0];
            }

            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    // @ts-ignore
    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key, (value as Date).toISOString().substring(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * @param getParametersRequest 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getParameters(getParametersRequest: GetParametersRequest, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<GetParametersResponse>;
    public getParameters(getParametersRequest: GetParametersRequest, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<GetParametersResponse>>;
    public getParameters(getParametersRequest: GetParametersRequest, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<GetParametersResponse>>;
    public getParameters(getParametersRequest: GetParametersRequest, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (getParametersRequest === null || getParametersRequest === undefined) {
            throw new Error('Required parameter getParametersRequest was null or undefined when calling getParameters.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/parameters`;
        return this.httpClient.request<GetParametersResponse>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: getParametersRequest,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}


```

### File: onecx-shell-ui/src/app/shared/generated/api/permission.service.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { GetPermissionsRequest } from '../model/getPermissionsRequest';
// @ts-ignore
import { GetPermissionsResponse } from '../model/getPermissionsResponse';
// @ts-ignore
import { ProblemDetailResponse } from '../model/problemDetailResponse';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'any'
})
export class PermissionBffService {

    protected basePath = 'http://onecx-shell-bff:8080';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string|string[], @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (Array.isArray(basePath) && basePath.length > 0) {
                basePath = basePath[0];
            }

            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    // @ts-ignore
    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key, (value as Date).toISOString().substring(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * @param getPermissionsRequest 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getPermissions(getPermissionsRequest: GetPermissionsRequest, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<GetPermissionsResponse>;
    public getPermissions(getPermissionsRequest: GetPermissionsRequest, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<GetPermissionsResponse>>;
    public getPermissions(getPermissionsRequest: GetPermissionsRequest, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<GetPermissionsResponse>>;
    public getPermissions(getPermissionsRequest: GetPermissionsRequest, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (getPermissionsRequest === null || getPermissionsRequest === undefined) {
            throw new Error('Required parameter getPermissionsRequest was null or undefined when calling getPermissions.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/permissions`;
        return this.httpClient.request<GetPermissionsResponse>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: getPermissionsRequest,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}


```

### File: onecx-shell-ui/src/app/shared/generated/api/userProfile.service.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { GetUserProfileResponse } from '../model/getUserProfileResponse';
// @ts-ignore
import { ProblemDetailResponse } from '../model/problemDetailResponse';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'any'
})
export class UserProfileBffService {

    protected basePath = 'http://onecx-shell-bff:8080';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string|string[], @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (Array.isArray(basePath) && basePath.length > 0) {
                basePath = basePath[0];
            }

            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    // @ts-ignore
    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key, (value as Date).toISOString().substring(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getUserProfile(observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<GetUserProfileResponse>;
    public getUserProfile(observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<GetUserProfileResponse>>;
    public getUserProfile(observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<GetUserProfileResponse>>;
    public getUserProfile(observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/userProfile`;
        return this.httpClient.request<GetUserProfileResponse>('get', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}


```

### File: onecx-shell-ui/src/app/shared/generated/api/workspaceConfig.service.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { LoadWorkspaceConfigRequest } from '../model/loadWorkspaceConfigRequest';
// @ts-ignore
import { LoadWorkspaceConfigResponse } from '../model/loadWorkspaceConfigResponse';
// @ts-ignore
import { ProblemDetailResponse } from '../model/problemDetailResponse';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'any'
})
export class WorkspaceConfigBffService {

    protected basePath = 'http://onecx-shell-bff:8080';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string|string[], @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (Array.isArray(basePath) && basePath.length > 0) {
                basePath = basePath[0];
            }

            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    // @ts-ignore
    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key, (value as Date).toISOString().substring(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * Load favicon by theme name
     * @param name 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getThemeFaviconByName(name: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'image/x-icon', context?: HttpContext}): Observable<Blob>;
    public getThemeFaviconByName(name: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'image/x-icon', context?: HttpContext}): Observable<HttpResponse<Blob>>;
    public getThemeFaviconByName(name: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'image/x-icon', context?: HttpContext}): Observable<HttpEvent<Blob>>;
    public getThemeFaviconByName(name: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'image/x-icon', context?: HttpContext}): Observable<any> {
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling getThemeFaviconByName.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'image/x-icon'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let localVarPath = `/workspaceConfig/themes/${this.configuration.encodeParam({name: "name", value: name, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}/favicon`;
        return this.httpClient.request('get', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                responseType: "blob",
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Load logo by theme name
     * @param name 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getThemeLogoByName(name: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'image/*', context?: HttpContext}): Observable<Blob>;
    public getThemeLogoByName(name: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'image/*', context?: HttpContext}): Observable<HttpResponse<Blob>>;
    public getThemeLogoByName(name: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'image/*', context?: HttpContext}): Observable<HttpEvent<Blob>>;
    public getThemeLogoByName(name: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'image/*', context?: HttpContext}): Observable<any> {
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling getThemeLogoByName.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'image/*'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let localVarPath = `/workspaceConfig/themes/${this.configuration.encodeParam({name: "name", value: name, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}/logo`;
        return this.httpClient.request('get', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                responseType: "blob",
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Load all data needed by startup of OneCX UI (components, routes, slots, theme, workspace)
     * @param loadWorkspaceConfigRequest 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public loadWorkspaceConfig(loadWorkspaceConfigRequest: LoadWorkspaceConfigRequest, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<LoadWorkspaceConfigResponse>;
    public loadWorkspaceConfig(loadWorkspaceConfigRequest: LoadWorkspaceConfigRequest, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<LoadWorkspaceConfigResponse>>;
    public loadWorkspaceConfig(loadWorkspaceConfigRequest: LoadWorkspaceConfigRequest, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<LoadWorkspaceConfigResponse>>;
    public loadWorkspaceConfig(loadWorkspaceConfigRequest: LoadWorkspaceConfigRequest, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (loadWorkspaceConfigRequest === null || loadWorkspaceConfigRequest === undefined) {
            throw new Error('Required parameter loadWorkspaceConfigRequest was null or undefined when calling loadWorkspaceConfig.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/workspaceConfig`;
        return this.httpClient.request<LoadWorkspaceConfigResponse>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: loadWorkspaceConfigRequest,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}


```

## Folder: onecx-shell-ui/src/app/shared/generated/model (31 files)

### File: onecx-shell-ui/src/app/shared/generated/model/accountSettings.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { LayoutAndThemeSettings } from './layoutAndThemeSettings';
import { LocaleAndTimeSettings } from './localeAndTimeSettings';


export interface AccountSettings { 
    layoutAndThemeSettings?: LayoutAndThemeSettings;
    localeAndTimeSettings?: LocaleAndTimeSettings;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/colorScheme.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export enum ColorScheme {
    AUTO = 'AUTO',
    LIGHT = 'LIGHT',
    DARK = 'DARK'
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/getParametersRequest.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface GetParametersRequest { 
    products: { [key: string]: Array<string>; };
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/getParametersResponse.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Parameter } from './parameter';


export interface GetParametersResponse { 
    products: { [key: string]: { [key: string]: Array<Parameter>; }; };
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/getPermissionsRequest.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface GetPermissionsRequest { 
    appId: string;
    productName: string;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/getPermissionsResponse.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface GetPermissionsResponse { 
    permissions: Array<string>;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/getUserProfileResponse.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { UserProfile } from './userProfile';


export interface GetUserProfileResponse { 
    userProfile: UserProfile;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/layoutAndThemeSettings.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ColorScheme } from './colorScheme';
import { MenuMode } from './menuMode';


export interface LayoutAndThemeSettings { 
    colorScheme?: ColorScheme;
    menuMode?: MenuMode;
}





```

### File: onecx-shell-ui/src/app/shared/generated/model/loadWorkspaceConfigRequest.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface LoadWorkspaceConfigRequest { 
    path: string;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/loadWorkspaceConfigResponse.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { RemoteComponent } from './remoteComponent';
import { Slot } from './slot';
import { Theme } from './theme';
import { Route } from './route';
import { Workspace } from './workspace';


export interface LoadWorkspaceConfigResponse { 
    routes: Array<Route>;
    theme: Theme;
    workspace: Workspace;
    components: Array<RemoteComponent>;
    slots: Array<Slot>;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/localeAndTimeSettings.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface LocaleAndTimeSettings { 
    locale?: string;
    timezone?: string;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/menuMode.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export enum MenuMode {
    HORIZONTAL = 'HORIZONTAL',
    STATIC = 'STATIC',
    OVERLAY = 'OVERLAY',
    SLIM = 'SLIM',
    SLIMPLUS = 'SLIMPLUS'
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/models.ts

```ts

export * from './accountSettings';
export * from './colorScheme';
export * from './getParametersRequest';
export * from './getParametersResponse';
export * from './getPermissionsRequest';
export * from './getPermissionsResponse';
export * from './getUserProfileResponse';
export * from './layoutAndThemeSettings';
export * from './loadWorkspaceConfigRequest';
export * from './loadWorkspaceConfigResponse';
export * from './localeAndTimeSettings';
export * from './menuMode';
export * from './parameter';
export * from './parameterValue';
export * from './pathMatch';
export * from './phoneType';
export * from './problemDetailInvalidParam';
export * from './problemDetailParam';
export * from './problemDetailResponse';
export * from './remoteComponent';
export * from './route';
export * from './slot';
export * from './technologies';
export * from './theme';
export * from './uIEndpoint';
export * from './userPerson';
export * from './userPersonAddress';
export * from './userPersonPhone';
export * from './userProfile';
export * from './workspace';


```

### File: onecx-shell-ui/src/app/shared/generated/model/parameter.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ParameterValue } from './parameterValue';


export interface Parameter { 
    displayName?: string;
    description?: string;
    applicationId: string;
    productName: string;
    name: string;
    value: ParameterValue;
    importValue?: ParameterValue;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/parameterValue.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


/**
 * @type ParameterValue
 * @export
 */
export type ParameterValue = boolean | number | object | string;



```

### File: onecx-shell-ui/src/app/shared/generated/model/pathMatch.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export enum PathMatch {
    full = 'full',
    prefix = 'prefix'
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/phoneType.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export enum PhoneType {
    MOBILE = 'MOBILE',
    LANDLINE = 'LANDLINE'
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/problemDetailInvalidParam.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface ProblemDetailInvalidParam { 
    name?: string;
    message?: string;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/problemDetailParam.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface ProblemDetailParam { 
    key?: string;
    value?: string;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/problemDetailResponse.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ProblemDetailInvalidParam } from './problemDetailInvalidParam';
import { ProblemDetailParam } from './problemDetailParam';


export interface ProblemDetailResponse { 
    errorCode?: string;
    detail?: string;
    params?: Array<ProblemDetailParam>;
    invalidParams?: Array<ProblemDetailInvalidParam>;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/remoteComponent.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Technologies } from './technologies';


export interface RemoteComponent { 
    name: string;
    baseUrl: string;
    remoteEntryUrl: string;
    appId: string;
    productName: string;
    productVersion?: string;
    exposedModule: string;
    remoteName?: string;
    elementName?: string;
    technology?: Technologies;
}





```

### File: onecx-shell-ui/src/app/shared/generated/model/route.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { PathMatch } from './pathMatch';
import { UIEndpoint } from './uIEndpoint';
import { Technologies } from './technologies';


export interface Route { 
    url: string;
    baseUrl: string;
    remoteEntryUrl: string;
    appId: string;
    productName: string;
    productVersion: string;
    technology?: Technologies;
    exposedModule: string;
    pathMatch: PathMatch;
    remoteName?: string;
    elementName?: string;
    displayName: string;
    endpoints?: Array<UIEndpoint>;
}





```

### File: onecx-shell-ui/src/app/shared/generated/model/slot.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface Slot { 
    name: string;
    components: Array<string>;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/technologies.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export enum Technologies {
    Angular = 'Angular',
    WebComponent = 'WebComponent',
    WebComponentScript = 'WebComponentScript',
    WebComponentModule = 'WebComponentModule'
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/theme.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface Theme { 
    displayName?: string;
    name: string;
    cssFile?: string;
    description?: string;
    assetsUrl?: string;
    logoUrl?: string;
    faviconUrl?: string;
    previewImageUrl?: string;
    assetsUpdateDate?: string;
    properties: string;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/uIEndpoint.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface UIEndpoint { 
    path?: string;
    name?: string;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/userPerson.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { UserPersonPhone } from './userPersonPhone';
import { UserPersonAddress } from './userPersonAddress';


export interface UserPerson { 
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email?: string;
    address?: UserPersonAddress;
    phone?: UserPersonPhone;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/userPersonAddress.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface UserPersonAddress { 
    street?: string;
    streetNo?: string;
    city?: string;
    postalCode?: string;
    country?: string;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/userPersonPhone.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { PhoneType } from './phoneType';


export interface UserPersonPhone { 
    type?: PhoneType;
    number?: string;
}





```

### File: onecx-shell-ui/src/app/shared/generated/model/userProfile.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { AccountSettings } from './accountSettings';
import { UserPerson } from './userPerson';


export interface UserProfile { 
    userId: string;
    organization?: string;
    issuer?: string;
    tenantId?: string;
    person: UserPerson;
    accountSettings?: AccountSettings;
    settings?: object;
}



```

### File: onecx-shell-ui/src/app/shared/generated/model/workspace.ts

```ts

/**
 * onecx-shell-bff
 * Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface Workspace { 
    displayName?: string;
    name: string;
    baseUrl: string;
    homePage?: string;
}



```

## Folder: onecx-shell-ui/src/app/shell/components/app-loading-spinner (2 files)

### File: onecx-shell-ui/src/app/shell/components/app-loading-spinner/app-loading-spinner.component.html

```html

<div class="w-full h-full absolute top-0 left-0 element-overlay">
    <div class="loader"></div>
</div>

```

### File: onecx-shell-ui/src/app/shell/components/app-loading-spinner/app-loading-spinner.component.ts

```ts

import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  standalone: true,
  selector: 'ocx-shell-loading-spinner',
  templateUrl: 'app-loading-spinner.component.html',
  styleUrl: 'app-loading-spinner.component.scss',
  imports: [CommonModule],
})
export class AppLoadingSpinnerComponent {}


```

## Folder: onecx-shell-ui/src/app/shell/components/error-component (2 files)

### File: onecx-shell-ui/src/app/shell/components/error-component/global-error.component.html

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

### File: onecx-shell-ui/src/app/shell/components/error-component/global-error.component.ts

```ts

import { Component, Input, inject } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

@Component({
  standalone: true,
  selector: 'ocx-shell-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class GlobalErrorComponent {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)

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
    globalThis.location.reload()
  }
}


```

## Folder: onecx-shell-ui/src/app/shell/components/portal-viewport (2 files)

### File: onecx-shell-ui/src/app/shell/components/portal-viewport/portal-viewport.component.html

```html

<div *ngIf="!globalErrMsg; else globalError" class="onecx-viewport-wrapper">
  <ng-container *ngIf="themeService.currentTheme$ | async; else noTheme">
    <!-- Header slot group -->
    <header class="onecx-header" id="ocx_header">
      <section [ngStyle]="{width: '100%'}" [attr.aria-label]="'Start'">
        <ocx-shell-slot-group
          name="onecx-shell-header"
          direction="row"
          [slotInputs]="slotHeaderInputs"
          [slotOutputs]="slotHeaderOutputs"
        ></ocx-shell-slot-group>
      </section>
    </header>

    <!-- SubHeader slot group -->
    <ocx-shell-slot-group class="onecx-subheader" name="onecx-shell-sub-header"></ocx-shell-slot-group>
    <div class="onecx-body-wrapper">
      <!-- BodyStart slot group -->
      <ocx-shell-slot-group
        class="onecx-body-start"
        name="onecx-shell-body-start"
        direction="column"
      ></ocx-shell-slot-group>
      <div class="onecx-body-center">
        <!-- BodyHeader slot group -->
        <ocx-shell-slot-group class="onecx-body-header" name="onecx-shell-body-header"></ocx-shell-slot-group>
        <div class="onecx-body">
          <ng-container *ngIf="!routesService || (routesService.showContent$ | async); else appLoading">
            <ng-content></ng-content>
            <router-outlet></router-outlet>
          </ng-container>
        </div>
        <!-- BodyFooter slot group -->
        <ocx-shell-slot-group class="onecx-body-footer" name="onecx-shell-body-footer"></ocx-shell-slot-group>
      </div>
      <!-- BodyEnd slot group -->
      <ocx-shell-slot-group
        class="onecx-body-end"
        name="onecx-shell-body-end"
        direction="column"
      ></ocx-shell-slot-group>
    </div>

    <!-- Footer slot group -->
    <footer>
      <ocx-shell-slot-group name="onecx-shell-footer"></ocx-shell-slot-group>
    </footer>
  </ng-container>
</div>

<ng-template #noTheme>
  <div class="onecx-no-theme-main">
    <div class="onecx-no-theme-content relative">
      <ng-content></ng-content>
      <router-outlet></router-outlet>
    </div>
  </div>
</ng-template>

<ng-template #globalError>
  <ocx-shell-error [errCode]="globalErrMsg"></ocx-shell-error>
</ng-template>

<ng-template #appLoading>
  <ocx-shell-loading-spinner></ocx-shell-loading-spinner>
</ng-template>

<!-- Extensions slot for adding custom functionality -->
<ocx-slot class="extensions-slot" name="onecx-shell-extensions"></ocx-slot>


```

### File: onecx-shell-ui/src/app/shell/components/portal-viewport/portal-viewport.component.ts

```ts

import { animate, style, transition, trigger } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, EventEmitter, inject, OnInit } from '@angular/core'
import { RouterModule } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { AppStateService, Theme, ThemeService, UserService } from '@onecx/angular-integration-interface'
import { AngularRemoteComponentsModule } from '@onecx/angular-remote-components'
import { filter, first, from, mergeMap, Observable, of } from 'rxjs'
import { WorkspaceConfigBffService } from 'src/app/shared/generated/api/workspaceConfig.service'
import { RoutesService } from '../../services/routes.service'
import { AppLoadingSpinnerComponent } from '../app-loading-spinner/app-loading-spinner.component'
import { GlobalErrorComponent } from '../error-component/global-error.component'
import { SlotGroupComponent } from '../slot-group/slot-group.component'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    AngularRemoteComponentsModule,
    GlobalErrorComponent,
    AppLoadingSpinnerComponent,
    RouterModule,
    SlotGroupComponent
  ],
  selector: 'ocx-shell-portal-viewport',
  templateUrl: './portal-viewport.component.html',
  styleUrls: ['./portal-viewport.component.scss'],
  animations: [
    trigger('topbarActionPanelAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleY(0.8)' }),
        animate('.12s cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 1, transform: '*' }))
      ]),
      transition(':leave', [animate('.1s linear', style({ opacity: 0 }))])
    ])
  ]
})
@UntilDestroy()
export class PortalViewportComponent implements OnInit {
  private readonly appStateService = inject(AppStateService)
  private readonly userService = inject(UserService)
  themeService = inject(ThemeService)
  private readonly httpClient = inject(HttpClient)
  routesService = inject(RoutesService)
  workspaceConfigBffService = inject(WorkspaceConfigBffService)

  menuButtonTitle = ''

  colorScheme: 'auto' | 'light' | 'dark' = 'light'
  menuMode: 'horizontal' | 'static' | 'overlay' | 'slim' | 'slimplus' = 'static'
  inputStyle = 'outline'
  ripple = true
  globalErrMsg: string | undefined
  verticalMenuSlotName = 'onecx-shell-vertical-menu'
  footerSlotName = 'onecx-shell-footer'

  public currentTheme$: Observable<Theme>
  public logoLoadingEmitter = new EventEmitter<boolean>()
  public themeLogoLoadingFailed = false

  slotHeaderInputs = {
    imageStyleClass: 'max-h-3rem max-w-9rem vertical-align-middle'
  }

  slotHeaderOutputs = {
    imageLoadingFailed: this.logoLoadingEmitter
  }

  constructor() {
    this.userService.profile$.pipe(untilDestroyed(this)).subscribe((profile) => {
      this.menuMode =
        (profile?.accountSettings?.layoutAndThemeSettings?.menuMode?.toLowerCase() as
          | typeof this.menuMode
          | undefined) ?? this.menuMode

      this.colorScheme =
        (profile?.accountSettings?.layoutAndThemeSettings?.colorScheme?.toLowerCase() as
          | typeof this.colorScheme
          | undefined) ?? this.colorScheme
    })

    this.themeService.currentTheme$
      .pipe(
        first(),
        mergeMap((theme) => {
          return (
            theme.faviconUrl
              ? this.httpClient.get(theme.faviconUrl ?? '', { responseType: 'blob' })
              : (this.workspaceConfigBffService?.getThemeFaviconByName(theme.name ?? '') ?? of())
          ).pipe(
            filter((blob) => !!blob),
            mergeMap((blob) => from(this.readBlobAsDataURL(blob)))
          )
        })
      )
      .subscribe((url) => {
        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']")
        if (!link) {
          link = document.createElement('link')
          link.rel = 'icon'
          document.head.appendChild(link)
        }
        if (typeof url === 'string' && url !== null) {
          link.href = url
        }
      })

    this.currentTheme$ = this.themeService.currentTheme$.asObservable()
    this.logoLoadingEmitter.subscribe((data: boolean) => {
      this.themeLogoLoadingFailed = data
    })
  }

  private readBlobAsDataURL(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result ?? null)
      reader.readAsDataURL(blob)
    })
  }

  ngOnInit() {
    this.appStateService.globalError$
      .pipe(untilDestroyed(this))
      .pipe(filter((i) => i !== undefined))
      .subscribe((err: string | undefined) => {
        console.error('global error')
        this.globalErrMsg = err
      })
  }
}


```

## Folder: onecx-shell-ui/src/app/shell/components/slot-group (4 files)

### File: onecx-shell-ui/src/app/shell/components/slot-group/slot-group.component.html

```html

<ocx-slot
  class="flex align-items-center"
  [name]="name() + '.start'"
  [ngStyle]="slotStyles()"
  [ngClass]="computedSlotClasses()"
  [inputs]="slotInputsStart()"
  [outputs]="slotOutputs()"
></ocx-slot>
<ocx-slot
  class="flex align-items-center flex-grow-1"
  [name]="name() + '.center'"
  [ngStyle]="slotStyles()"
  [ngClass]="computedSlotClasses()"
  [inputs]="slotInputsCenter()"
  [outputs]="slotOutputs()"
></ocx-slot>
<ocx-slot
  class="flex align-items-center"
  [name]="name() + '.end'"
  [ngStyle]="slotStyles()"
  [ngClass]="computedSlotClasses()"
  [inputs]="slotInputsEnd()"
  [outputs]="slotOutputs()"
></ocx-slot>


```

### File: onecx-shell-ui/src/app/shell/components/slot-group/slot-group.component.spec.ts

```ts

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { SlotGroupComponent } from './slot-group.component'
import { ComponentRef, ElementRef, EventEmitter } from '@angular/core'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { SlotServiceMock } from '@onecx/angular-remote-components/mocks'
import { SlotGroupHarness } from './slot-group.harness'
import { By } from '@angular/platform-browser'
import { SLOT_SERVICE, SlotComponent, SlotService } from '@onecx/angular-remote-components'

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
      devicePixelContentBoxSize: [] as any
    } as ResizeObserverEntry
    this.callback([entry], this as unknown as ResizeObserver)
  }
}
globalThis.ResizeObserver = ResizeObserverMock

class ResizedEventsPublisherMock {
  publish = jest.fn()
}

jest.mock('@onecx/integration-interface', () => {
  const actual = jest.requireActual('@onecx/integration-interface')
  const fakeTopic = jest.requireActual('@onecx/accelerator').FakeTopic
  class ResizedEventsPublisherMock {
    publish = jest.fn()
  }

  return {
    ...actual,
    ResizedEventsTopic: fakeTopic,
    ResizedEventsPublisher: ResizedEventsPublisherMock
  }
})

import {
  ResizedEventType,
  SlotGroupResizedEvent,
  Technologies,
  TopicResizedEventType
} from '@onecx/integration-interface'
import { FakeTopic } from '@onecx/accelerator'

function sortClasses(classes: string[]): string[] {
  return [...classes].sort((a, b) => a.localeCompare(b))
}

describe('SlotGroupComponent', () => {
  let component: SlotGroupComponent
  let fixture: ComponentFixture<SlotGroupComponent>
  let componentRef: ComponentRef<SlotGroupComponent>
  let slotGroupHarness: SlotGroupHarness
  let slotServiceMock: SlotServiceMock

  let resizeEventsPublisher: ResizedEventsPublisherMock
  let resizeObserverMock: ResizeObserverMock
  let resizedEventsTopic: FakeTopic<TopicResizedEventType>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlotGroupComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: SlotService,
          useClass: SlotServiceMock
        }
      ]
    }).compileComponents()
  })

  beforeEach(async () => {
    fixture = TestBed.createComponent(SlotGroupComponent)
    component = fixture.componentInstance
    componentRef = fixture.componentRef
    componentRef.setInput('name', 'test-slot')
    resizeEventsPublisher = component['resizedEventsPublisher'] as any as ResizedEventsPublisherMock
    fixture.detectChanges()

    resizeObserverMock = (component as any).resizeObserver as ResizeObserverMock
    slotServiceMock = TestBed.inject(SLOT_SERVICE) as unknown as SlotServiceMock
    resizedEventsTopic = component['resizedEventsTopic'] as any as FakeTopic<TopicResizedEventType>

    const testComponentConfig = {
      componentType: Promise.resolve(class TestComp {}),
      remoteComponent: {
        appId: 'test-app',
        productName: 'test-product',
        baseUrl: 'http://localhost',
        technology: Technologies.Angular
      },
      permissions: Promise.resolve(['test-permission'])
    }

    slotServiceMock.assignComponentToSlot(testComponentConfig, 'test-slot.start')
    slotServiceMock.assignComponentToSlot(testComponentConfig, 'test-slot.center')
    slotServiceMock.assignComponentToSlot(testComponentConfig, 'test-slot.end')

    slotGroupHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotGroupHarness)
  })

  afterEach(() => {
    slotServiceMock.clearAssignments()
  })

  it('should observe the native element on init', () => {
    expect(resizeObserverMock.observe).toHaveBeenCalledTimes(1)

    const elRef = (component as any).elementRef as ElementRef<HTMLElement>

    expect(resizeObserverMock.observe).toHaveBeenCalledWith(elRef.nativeElement)
  })

  it('should debounce resize events and publish SLOT_GROUP_RESIZED once', fakeAsync(() => {
    resizeEventsPublisher.publish.mockClear()

    // Simulate multiple rapid size changes
    resizeObserverMock.trigger(100, 50)
    resizeObserverMock.trigger(120, 60)
    resizeObserverMock.trigger(140, 70)

    // Nothing yet because of debounce (100ms in component)
    expect(resizeEventsPublisher.publish).not.toHaveBeenCalled()

    // Advance time by slightly more than debounce
    tick(110)

    expect(resizeEventsPublisher.publish).toHaveBeenCalledTimes(1)

    const arg = resizeEventsPublisher.publish.mock.calls[0][0] as SlotGroupResizedEvent

    expect(arg.type).toBe(ResizedEventType.SLOT_GROUP_RESIZED)
    expect(arg.payload.slotGroupName).toBe('test-slot')
    expect(arg.payload.slotGroupDetails).toEqual({ width: 140, height: 70 })
  }))

  it('should publish SLOT_GROUP_RESIZED when requestedEventsChanged$ emits for this slot group', fakeAsync(() => {
    // Simulate initial size
    resizeObserverMock.trigger(200, 100)

    tick(110) // Wait for debounce

    resizeEventsPublisher.publish.mockClear()

    resizedEventsTopic.publish({
      type: ResizedEventType.REQUESTED_EVENTS_CHANGED,
      payload: {
        type: ResizedEventType.SLOT_GROUP_RESIZED,
        name: 'test-slot'
      }
    })

    expect(resizeEventsPublisher.publish).toHaveBeenCalledWith({
      type: ResizedEventType.SLOT_GROUP_RESIZED,
      payload: {
        slotGroupName: 'test-slot',
        slotGroupDetails: { width: 200, height: 100 }
      }
    })
  }))

  it('should disconnect ResizeObserver and complete subject on destroy', () => {
    const disconnectSpy = jest.spyOn(resizeObserverMock, 'disconnect')

    fixture.destroy()

    expect(disconnectSpy).toHaveBeenCalled()
  })

  it('does not throw if resizeObserver is undefined on destroy (covers optional chain false branch)', () => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(component as any).resizeObserver = undefined
    expect(() => fixture.destroy()).not.toThrow()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have created 3 slots', async () => {
    const slots = await slotGroupHarness.getAllSlots()

    expect(slots).toHaveLength(3)
  })

  describe('Input Signals', () => {
    describe('name input signal', () => {
      it('should get name of the slot group component with name', async () => {
        const slotGroupName = await slotGroupHarness.getName()

        expect(slotGroupName).toBe('test-slot')
      })

      it('should pass name to child slots with correct suffixes', async () => {
        componentRef.setInput('name', 'new-test-slot')

        const startSlot = await slotGroupHarness.getStartSlot()
        const centerSlot = await slotGroupHarness.getCenterSlot()
        const endSlot = await slotGroupHarness.getEndSlot()

        expect(await startSlot?.getName()).toBe('new-test-slot.start')
        expect(await centerSlot?.getName()).toBe('new-test-slot.center')
        expect(await endSlot?.getName()).toBe('new-test-slot.end')
      })
    })

    describe('direction input signal', () => {
      it('should have default direction value as row', () => {
        expect(component.direction()).toBe('row')
      })
    })

    describe('slotInputs input signal', () => {
      it('should have default empty object for slotInputs', () => {
        expect(component.slotInputs()).toEqual({})
      })

      it('should pass computed inputs to respective child slots', async () => {
        const inputs = { data: 'test' }
        componentRef.setInput('slotInputs', inputs)

        const slots = await slotGroupHarness.getAllSlots()

        // Use By.directive to get SlotComponent instances
        const slotDebugElements = fixture.debugElement.queryAll(By.directive(SlotComponent))

        expect(slotDebugElements).toHaveLength(slots.length)

        for (let index = 0; index < slots.length; index++) {
          const slotComponentInstance = slotDebugElements[index].componentInstance as SlotComponent
          expect(slotComponentInstance.inputs).toEqual(inputs)
        }
      })
    })

    describe('slotOutputs input signal', () => {
      it('should have default empty object for slotOutputs', () => {
        expect(component.slotOutputs()).toEqual({})
      })

      it('should pass slotOutputs to all child slots', async () => {
        const outputs = {
          event: new EventEmitter<void>()
        }

        componentRef.setInput('slotOutputs', outputs)

        const slots = await slotGroupHarness.getAllSlots()

        // Use By.directive to get SlotComponent instances
        const slotDebugElements = fixture.debugElement.queryAll(By.directive(SlotComponent))

        expect(slotDebugElements).toHaveLength(slots.length)

        for (let index = 0; index < slots.length; index++) {
          const slotComponentInstance = slotDebugElements[index].componentInstance as SlotComponent

          expect(slotComponentInstance.outputs).toEqual(outputs)
        }
      })
    })

    describe('slotGroupStyles input signal', () => {
      it('should have default empty object for slotGroupStyles', () => {
        expect(component.slotGroupStyles()).toEqual({})
      })

      it('should update slotGroupStyles signal value', () => {
        const styles = { backgroundColor: 'green', padding: '10px' }
        componentRef.setInput('slotGroupStyles', styles)

        expect(component.slotGroupStyles()).toEqual(styles)
      })

      it('should apply slotGroupStyles of type object to container div', async () => {
        const slotGroupStylesObject = { color: 'blue', padding: '15px' }
        const expectedStyles = { color: 'blue', padding: '15px' }

        componentRef.setInput('slotGroupStyles', slotGroupStylesObject)

        const containerSlotStyles = await slotGroupHarness.getContainerStyles(['color', 'padding'])

        expect(containerSlotStyles).toEqual(expectedStyles)
      })
    })

    describe('slotStyles input signal', () => {
      it('should have default empty object for slotStyles', () => {
        expect(component.slotStyles()).toEqual({})
      })

      it('should update slotStyles signal value', () => {
        const styles = { color: 'red', 'font-size': '14px' }
        componentRef.setInput('slotStyles', styles)

        expect(component.slotStyles()).toEqual(styles)
      })
    })

    describe('slotClasses input signal', () => {
      it('should have default empty string for slotClasses', () => {
        expect(component.slotClasses()).toBe('')
      })

      it('should update slotClasses signal value', () => {
        const classes = 'custom-class another-class'
        componentRef.setInput('slotClasses', classes)

        expect(component.slotClasses()).toBe(classes)
      })
    })

    describe('slotGroupClasses input signal', () => {
      it('should have default empty string for slotGroupClasses', () => {
        expect(component.slotGroupClasses()).toBe('')
      })

      it('should apply slotGroupClasses of type string to the slot-group host element', async () => {
        const slotGroupClassesString = 'test-group-class another-class'
        const expectedClasses = [
          'flex',
          'justify-content-between',
          'flex-row',
          'w-full',
          'test-group-class',
          'another-class'
        ]

        componentRef.setInput('slotGroupClasses', slotGroupClassesString)
        fixture.detectChanges()

        const containerSlotClasses = await slotGroupHarness.getContainerGroupClasses()
        expect(sortClasses(containerSlotClasses)).toEqual(sortClasses(expectedClasses))
      })

      it('should apply slotGroupClasses of type string array to the slot-group host element', async () => {
        const slotGroupClassesArray = ['test-group-class', 'another-class']
        const expectedClasses = [
          'flex',
          'justify-content-between',
          'flex-row',
          'w-full',
          'test-group-class',
          'another-class'
        ]

        componentRef.setInput('slotGroupClasses', slotGroupClassesArray)
        fixture.detectChanges()

        const containerSlotClasses = await slotGroupHarness.getContainerGroupClasses()
        expect(sortClasses(containerSlotClasses)).toEqual(sortClasses(expectedClasses))
      })

      it('should apply slotGroupClasses of type Set to the slot-group host element', async () => {
        const slotGroupClassesSet = new Set(['test-group-class', 'another-class'])
        const expectedClasses = [
          'flex',
          'justify-content-between',
          'flex-row',
          'w-full',
          'test-group-class',
          'another-class'
        ]

        componentRef.setInput('slotGroupClasses', slotGroupClassesSet)
        fixture.detectChanges()

        const containerSlotClasses = await slotGroupHarness.getContainerGroupClasses()
        expect(sortClasses(containerSlotClasses)).toEqual(sortClasses(expectedClasses))
      })

      it('should apply slotGroupClasses of type object to the slot-group host element', async () => {
        const slotGroupClassesObject = { 'test-group-class': true, 'another-class': false, 'third-class': true }
        const expectedClasses = [
          'flex',
          'justify-content-between',
          'flex-row',
          'w-full',
          'test-group-class',
          'third-class'
        ]

        componentRef.setInput('slotGroupClasses', slotGroupClassesObject)
        fixture.detectChanges()

        const containerSlotClasses = await slotGroupHarness.getContainerGroupClasses()
        expect(sortClasses(containerSlotClasses)).toEqual(sortClasses(expectedClasses))
      })
    })

    describe('computedSlotGroupClasses computed signal', () => {
      it('should compute computedSlotGroupClasses with default direction', () => {
        const computedSlotGroupClasses = component.computedSlotGroupClasses()

        expect(computedSlotGroupClasses).toBe('flex-row w-full')
      })

      it('should update classes when direction changes to column', () => {
        componentRef.setInput('direction', 'column')

        const computedSlotGroupClasses = component.computedSlotGroupClasses()

        expect(computedSlotGroupClasses).toBe('flex-column h-full')
      })

      it('should apply correct classes for row-reverse direction', () => {
        componentRef.setInput('direction', 'row-reverse')

        const computedSlotGroupClasses = component.computedSlotGroupClasses()

        expect(computedSlotGroupClasses).toBe('flex-row-reverse w-full')
      })

      it('should apply correct classes for column-reverse direction', () => {
        componentRef.setInput('direction', 'column-reverse')

        const computedSlotGroupClasses = component.computedSlotGroupClasses()

        expect(computedSlotGroupClasses).toBe('flex-column-reverse h-full')
      })

      it('should merge custom slotGroupClasses with base classes', () => {
        componentRef.setInput('slotGroupClasses', 'custom-class another-class')

        const computedSlotGroupClasses = component.computedSlotGroupClasses()

        expect(computedSlotGroupClasses).toBe('flex-row w-full custom-class another-class')
      })
    })

    describe('computedSlotClasses computed signal', () => {
      it('should compute slot classes with default direction', () => {
        const slotClasses = component.computedSlotClasses()

        expect(slotClasses).toBe('flex-row')
      })

      it('should update classes when direction changes to column', () => {
        componentRef.setInput('direction', 'column')

        const slotClasses = component.computedSlotClasses()

        expect(slotClasses).toBe('flex-column')
      })

      it('should merge custom slotClasses with base classes', () => {
        componentRef.setInput('slotClasses', 'custom-slot-class')

        const slotClasses = component.computedSlotClasses()

        expect(slotClasses).toBe('flex-row custom-slot-class')
      })
    })

    //   describe('slotStyles and slotClasses with multiple components in a slot', () => {
    //     it('should apply slotStyles and slotClasses to every start slot div when multiple components are assigned to start slot', async () => {
    //       slotServiceMock.assignComponentToSlot(
    //         {
    //           componentType: Promise.resolve(undefined),
    //           remoteComponent: {
    //             appId: 'test-app-2',
    //             productName: 'test-product-2',
    //             baseUrl: 'http://localhost',
    //             technology: Technologies.WebComponentModule,
    //             elementName: 'test-component-2'
    //           },
    //           permissions: Promise.resolve(['test-permission-2'])
    //         },
    //         'test-slot.start'
    //       )

    //       const styles = { padding: '10px', color: 'blue' }
    //       const expectedStyles = { padding: '10px', color: 'blue' }

    //       const classes = 'multi-class another-class'
    //       const expectedClasses = ['multi-class', 'another-class']

    //       componentRef.setInput('rcWrapperStyles', styles)
    //       componentRef.setInput('rcWrapperClasses', classes)

    //       const startSlotDivs = await slotGroupHarness.getStartSlotDivContainers()

    //       expect(startSlotDivs?.length).toBe(2)

    //       const startSlotStyles = await slotGroupHarness.getStartSlotStyles(['padding', 'color'])

    //       for (let index = 0; index < startSlotDivs.length; index++) {
    //         expect(startSlotStyles[index]).toEqual(expectedStyles)
    //       }

    //       const startSlotClasses = await slotGroupHarness.getStartSlotClasses()

    //       for (let index = 0; index < startSlotDivs.length; index++) {
    //         expect(startSlotClasses[index]).toEqual(expectedClasses)
    //       }
    //     })

    //     it('should apply slotStyles and slotClasses to every center slot div when multiple components are assigned to center slot', async () => {
    //       slotServiceMock.assignComponentToSlot('test-component-2', 'test-slot.center')

    //       const styles = { padding: '10px', color: 'blue' }
    //       const expectedStyles = { padding: '10px', color: 'blue' }

    //       const classes = 'multi-class another-class'
    //       const expectedClasses = ['multi-class', 'another-class']

    //       componentRef.setInput('rcWrapperStyles', styles)
    //       componentRef.setInput('rcWrapperClasses', classes)

    //       const centerSlotDivs = await slotGroupHarness.getCenterSlotDivContainers()

    //       expect(centerSlotDivs.length).toBe(2)

    //       const centerSlotStyles = await slotGroupHarness.getCenterSlotStyles(['padding', 'color'])

    //       for (let index = 0; index < centerSlotDivs.length; index++) {
    //         expect(centerSlotStyles[index]).toEqual(expectedStyles)
    //       }

    //       const centerSlotClasses = await slotGroupHarness.getCenterSlotClasses()

    //       for (let index = 0; index < centerSlotDivs.length; index++) {
    //         expect(centerSlotClasses[index]).toEqual(expectedClasses)
    //       }
    //     })

    //     it('should apply slotStyles and slotClasses to every end slot div when multiple components are assigned to end slot', async () => {
    //       slotServiceMock.assignComponentToSlot('test-component-2', 'test-slot.end')

    //       const styles = { padding: '10px', color: 'blue' }
    //       const expectedStyles = { padding: '10px', color: 'blue' }

    //       const classes = 'multi-class another-class'
    //       const expectedClasses = ['multi-class', 'another-class']

    //       componentRef.setInput('rcWrapperStyles', styles)
    //       componentRef.setInput('rcWrapperClasses', classes)

    //       const endSlotDivs = await slotGroupHarness.getEndSlotDivContainers()

    //       expect(endSlotDivs.length).toBe(2)

    //       const endSlotStyles = await slotGroupHarness.getEndSlotStyles(['padding', 'color'])

    //       for (let index = 0; index < endSlotDivs.length; index++) {
    //         expect(endSlotStyles[index]).toEqual(expectedStyles)
    //       }

    //       const endSlotClasses = await slotGroupHarness.getEndSlotClasses()

    //       for (let index = 0; index < endSlotDivs.length; index++) {
    //         expect(endSlotClasses[index]).toEqual(expectedClasses)
    //       }
    //     })

    //     it('should apply slotStyles and slotClasses to every slot div in all slots when multiple components are assigned to all slots', async () => {
    //       slotServiceMock.assignComponentToSlot('test-component-2', 'test-slot.start')
    //       slotServiceMock.assignComponentToSlot('test-component-2', 'test-slot.center')
    //       slotServiceMock.assignComponentToSlot('test-component-2', 'test-slot.end')

    //       const styles = { padding: '10px', color: 'blue' }
    //       const expectedStyles = { padding: '10px', color: 'blue' }

    //       const classes = 'multi-class another-class'
    //       const expectedClasses = ['multi-class', 'another-class']

    //       componentRef.setInput('rcWrapperStyles', styles)
    //       componentRef.setInput('rcWrapperClasses', classes)

    //       const allSlotDivs = await slotGroupHarness.getAllSlotDivContainers()
    //       const allSlots = await slotGroupHarness.getAllSlots()

    //       expect(allSlotDivs.length).toBe(6)

    //       for (const slot of allSlots) {
    //         const slotStyles = await slot.getAllSlotStylesForProperties(['padding', 'color'])

    //         for (const slotStyle of slotStyles) {
    //           expect(slotStyle).toEqual(expectedStyles)
    //         }

    //         const slotClasses = await slot.getAllSlotClasses()
    //         for (const slotClass of slotClasses) {
    //           expect(slotClass).toEqual(expectedClasses)
    //         }
    //       }
    //     })
    //   })
  })
})


```

### File: onecx-shell-ui/src/app/shell/components/slot-group/slot-group.component.ts

```ts

import { CommonModule } from '@angular/common'
import { Component, computed, ElementRef, EventEmitter, inject, input, OnDestroy, OnInit } from '@angular/core'
import { AngularRemoteComponentsModule } from '@onecx/angular-remote-components'
import {
  ResizedEventsPublisher,
  SlotGroupResizedEvent,
  ResizedEventsTopic,
  RequestedEventsChangedEvent,
  ResizedEventType
} from '@onecx/integration-interface'
import { BehaviorSubject, debounceTime, filter, Subscription } from 'rxjs'
import { normalizeClassesToString } from '../../utils/normalize-classes.utils'

export type NgClassInputType = string | string[] | Set<string> | { [key: string]: any }

@Component({
  selector: 'ocx-shell-slot-group[name]',
  templateUrl: './slot-group.component.html',
  imports: [AngularRemoteComponentsModule, CommonModule],
  host: {
    '[attr.name]': 'name()',
    '[class]': '"flex justify-content-between " + computedSlotGroupClasses()',
    '[style]': 'slotGroupStyles()'
  },
  standalone: true
})
export class SlotGroupComponent implements OnInit, OnDestroy {
  name = input.required<string>()

  direction = input<'row' | 'row-reverse' | 'column' | 'column-reverse'>('row')

  slotStyles = input<{ [key: string]: any }>({})

  slotClasses = input<NgClassInputType>('')

  slotInputs = input<Record<string, unknown>>({})

  slotOutputs = input<Record<string, EventEmitter<any>>>({})

  slotGroupStyles = input<{ [key: string]: any }>({})

  slotGroupClasses = input<NgClassInputType>('')

  // Compute slot-group classes with direction
  computedSlotGroupClasses = computed(() => {
    const directionClasses = {
      row: 'flex-row w-full',
      'row-reverse': 'flex-row-reverse w-full',
      column: 'flex-column h-full',
      'column-reverse': 'flex-column-reverse h-full'
    }

    const baseClasses = directionClasses[this.direction()]
    const customClasses = normalizeClassesToString(this.slotGroupClasses())

    return `${baseClasses} ${customClasses}`.trim()
  })

  // Compute slot classes with direction
  computedSlotClasses = computed(() => {
    const directionClasses = {
      row: 'flex-row',
      'row-reverse': 'flex-row-reverse',
      column: 'flex-column',
      'column-reverse': 'flex-column-reverse'
    }

    const baseClasses = directionClasses[this.direction()]
    const customClasses = normalizeClassesToString(this.slotClasses())

    return `${baseClasses} ${customClasses}`.trim()
  })

  // we need to control one input of the slots individually later
  slotInputsStart = computed(() => {
    return {
      ...this.slotInputs()
    }
  })

  slotInputsCenter = computed(() => {
    return {
      ...this.slotInputs()
    }
  })

  slotInputsEnd = computed(() => {
    return {
      ...this.slotInputs()
    }
  })

  private readonly subscriptions: Subscription[] = []

  private resizeObserver: ResizeObserver | undefined
  private readonly componentSize$ = new BehaviorSubject<{ width: number; height: number }>({
    width: -1,
    height: -1
  })
  private readonly resizeDebounceTimeMs = 100

  private readonly resizedEventsPublisher = new ResizedEventsPublisher()
  private readonly resizedEventsTopic = new ResizedEventsTopic()
  private readonly requestedEventsChanged$ = this.resizedEventsTopic.pipe(
    filter((event): event is RequestedEventsChangedEvent => event.type === ResizedEventType.REQUESTED_EVENTS_CHANGED)
  )

  private readonly elementRef = inject(ElementRef)

  ngOnInit(): void {
    this.observeSlotSizeChanges()
  }

  ngOnDestroy(): void {
    this.resizedEventsTopic.destroy()
    this.subscriptions.forEach((sub) => sub.unsubscribe())
    this.resizeObserver?.disconnect()
    this.componentSize$.complete()
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
      const slotGroupResizedEvent: SlotGroupResizedEvent = {
        type: ResizedEventType.SLOT_GROUP_RESIZED,
        payload: {
          slotGroupName: this.name(),
          slotGroupDetails: { width, height }
        }
      }
      this.resizedEventsPublisher.publish(slotGroupResizedEvent)
    })

    this.resizeObserver.observe(this.elementRef.nativeElement)

    const requestedEventsChangedSub = this.requestedEventsChanged$.subscribe((event) => {
      if (event.payload.type === ResizedEventType.SLOT_GROUP_RESIZED && event.payload.name === this.name()) {
        const { width, height } = this.componentSize$.getValue()
        const slotGroupResizedEvent: SlotGroupResizedEvent = {
          type: ResizedEventType.SLOT_GROUP_RESIZED,
          payload: {
            slotGroupName: this.name(),
            slotGroupDetails: { width, height }
          }
        }
        this.resizedEventsPublisher.publish(slotGroupResizedEvent)
      }
    })

    this.subscriptions.push(requestedEventsChangedSub)
  }
}


```

### File: onecx-shell-ui/src/app/shell/components/slot-group/slot-group.harness.ts

```ts

import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { SlotHarness } from '@onecx/angular-remote-components/testing'

export interface SlotGroupHarnessFilters extends BaseHarnessFilters {
  name?: string
}

/**
 * Harness for interacting with an OCX slot group component in tests.
 *
 * Provides methods to inspect the container and individual slots (start, center, end)
 * within a slot group, including their styles, classes, and content.
 */
export class SlotGroupHarness extends ContentContainerComponentHarness {
  static readonly hostSelector = 'ocx-slot-group'

  static with(options: SlotGroupHarnessFilters = {}): HarnessPredicate<SlotGroupHarness> {
    return new HarnessPredicate(SlotGroupHarness, options).addOption('name', options.name, (harness, name) =>
      HarnessPredicate.stringMatches(harness.getName(), name)
    )
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
   * Gets specific CSS property values from the slot group's host element.
   * @param properties Array of CSS property names to retrieve.
   * @returns Promise that resolves to an object mapping property names to their CSS values.
   */
  async getContainerStyles(properties: string[]): Promise<Record<string, string>> {
    const host = await this.host()
    const result: Record<string, string> = {}

    for (const property of properties) {
      result[property] = await host.getCssValue(property)
    }
    return result
  }

  /**
   * Gets the CSS classes from the slot group's host element.
   * @returns Promise that resolves to an array of CSS class names.
   */
  async getContainerGroupClasses(): Promise<string[]> {
    const host = await this.host()
    const classAttr = await host.getAttribute('class')
    console.log('Container class attribute:', classAttr)
    return classAttr ? classAttr.split(' ') : []
  }

  /**
   * Gets all slot harnesses within the slot group.
   * @returns Promise that resolves to an array of all slot harnesses.
   */
  async getAllSlots(): Promise<SlotHarness[]> {
    return await this.locatorForAll(SlotHarness)()
  }

  /**
   * Gets the start slot harness (slot with name ending in '.start').
   * @returns Promise that resolves to the start slot harness or null if not found.
   */
  async getStartSlot(): Promise<SlotHarness | null> {
    const slots = await this.getAllSlots()
    for (const slot of slots) {
      const name = await slot.getName()
      if (name?.endsWith('.start')) {
        return slot
      }
    }
    return null
  }

  /**
   * Gets the center slot harness (slot with name ending in '.center').
   * @returns Promise that resolves to the center slot harness or null if not found.
   */
  async getCenterSlot(): Promise<SlotHarness | null> {
    const slots = await this.getAllSlots()
    for (const slot of slots) {
      const name = await slot.getName()
      if (name?.endsWith('.center')) {
        return slot
      }
    }
    return null
  }

  /**
   * Gets the end slot harness (slot with name ending in '.end').
   * @returns Promise that resolves to the end slot harness or null if not found.
   */
  async getEndSlot(): Promise<SlotHarness | null> {
    const slots = await this.getAllSlots()
    for (const slot of slots) {
      const name = await slot.getName()
      if (name?.endsWith('.end')) {
        return slot
      }
    }
    return null
  }
}


```

## Folder: onecx-shell-ui/src/app/shell/services (5 files)

### File: onecx-shell-ui/src/app/shell/services/parameters.service.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import {
  AppStateServiceMock,
  FakeTopic,
  provideAppStateServiceMock,
  provideRemoteComponentsServiceMock,
  RemoteComponentsServiceMock
} from '@onecx/angular-integration-interface/mocks'
import { ParametersTopicPayload, RemoteComponent, RemoteComponentsInfo, Workspace } from '@onecx/integration-interface'
import { firstValueFrom, of } from 'rxjs'
import { GetParametersResponse, Parameter, ParameterBffService } from 'src/app/shared/generated'
import { ParametersService } from './parameters.service'

describe('ParametersService', () => {
  let parametersService: ParametersService
  let appStateServiceMock: AppStateServiceMock
  let remoteComponentsServiceMock: RemoteComponentsServiceMock
  let parameterBffService: ParameterBffService
  let parametersPublisherMock: FakeTopic<ParametersTopicPayload>

  function publishWorkspace(workspace: Partial<Workspace>) {
    return appStateServiceMock.currentWorkspace$.publish({
      ...(appStateServiceMock.currentWorkspace$.getValue() as Workspace),
      ...workspace
    })
  }

  function publishRemoteComponents(remoteComponents: Partial<RemoteComponentsInfo>) {
    return remoteComponentsServiceMock.remoteComponents$.publish({ components: [], slots: [], ...remoteComponents })
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ParametersService,
        provideAppStateServiceMock(),
        provideRemoteComponentsServiceMock(),
        { provide: ParameterBffService, useValue: { getParameters: jest.fn() } }
      ]
    })
    parametersPublisherMock = new FakeTopic<ParametersTopicPayload>()
    parametersService = TestBed.inject(ParametersService)
    ;(parametersService as any).parametersPublisher = parametersPublisherMock

    appStateServiceMock = TestBed.inject(AppStateServiceMock)
    remoteComponentsServiceMock = TestBed.inject(RemoteComponentsServiceMock)
    parameterBffService = TestBed.inject(ParameterBffService)
  })

  it('should be created', () => {
    expect(parametersService).toBeTruthy()
  })

  it('should not call service if there are no apps in workspace', async () => {
    const cache = { parameters: [] }
    const parameters: GetParametersResponse = { products: {} }

    Storage.prototype.getItem = jest.fn().mockReturnValue(JSON.stringify(cache))
    Storage.prototype.setItem = jest.fn()

    await publishWorkspace({ routes: [] })
    await publishRemoteComponents({ components: [] })
    jest.spyOn(parameterBffService, 'getParameters').mockReturnValue(of(parameters) as any)

    parametersService.initialize()

    const publishedParameters = await firstValueFrom(parametersPublisherMock.asObservable())

    expect(parameterBffService.getParameters).not.toHaveBeenCalled()
    expect(publishedParameters).toEqual(cache)
  })

  it('should call service with all uncached apps in workspace', async () => {
    const cache = {
      parameters: [
        {
          appId: 'cachedAppId1',
          productName: 'product1',
          parameters: { key1: 'value1' },
          expirationDate: new Date().getTime() + 3600 * 1000
        },
        {
          appId: 'cachedAppId2',
          productName: 'product2',
          parameters: { key2: 'value2' },
          expirationDate: new Date().getTime()
        },
        {
          appId: 'cachedAppId3',
          productName: 'product2',
          parameters: { key3: 'value3' },
          expirationDate: new Date().getTime() + 3600 * 1000
        }
      ]
    }
    const bffResponse: GetParametersResponse = {
      products: {
        product1: {
          uncachedAppId2: [{ name: 'key4', value: 'value2' } as Parameter, { name: 'key5', value: true } as Parameter],
          uncachedAppId1: [{ name: 'key6', value: 42 } as Parameter]
        },
        product2: {
          uncachedAppId6: [],
          cachedAppId2: []
        }
      }
    }

    Storage.prototype.getItem = jest.fn().mockReturnValue(JSON.stringify(cache))
    Storage.prototype.setItem = jest.fn()

    await publishWorkspace({
      routes: [
        { appId: 'uncachedAppId1', productName: 'product1' },
        { appId: 'uncachedAppId2', productName: 'product1' },
        { appId: 'cachedAppId1', productName: 'product1' },
        { appId: 'uncachedAppId3', productName: 'product2' }
      ]
    })
    await publishRemoteComponents({
      components: [
        { appId: 'uncachedAppId4', productName: 'product1' } as RemoteComponent,
        { appId: 'uncachedAppId5', productName: 'product1' } as RemoteComponent,
        { appId: 'cachedAppId2', productName: 'product2' } as RemoteComponent,
        { appId: 'uncachedAppId6', productName: 'product2' } as RemoteComponent,
        { appId: 'uncachedAppId3', productName: 'product2' } as RemoteComponent //already in workspace
      ]
    })
    jest.spyOn(parameterBffService, 'getParameters').mockReturnValue(of(bffResponse) as any)

    parametersService.initialize()

    const publishedParameters = await firstValueFrom(parametersPublisherMock.asObservable())

    expect(parameterBffService.getParameters).toHaveBeenCalledWith({
      products: {
        product1: ['uncachedAppId1', 'uncachedAppId2', 'uncachedAppId4', 'uncachedAppId5'],
        product2: ['uncachedAppId3', 'cachedAppId2', 'uncachedAppId6']
      }
    })

    expect(publishedParameters.parameters.length).toEqual(6)

    // In cache and was up-to-date -> we have not asked for an update -> unchanged
    expect(publishedParameters.parameters[0].productName).toEqual(cache.parameters[0].productName)
    expect(publishedParameters.parameters[0].appId).toEqual(cache.parameters[0].appId)
    expect(publishedParameters.parameters[0].parameters).toEqual(cache.parameters[0].parameters)
    expect((publishedParameters.parameters[0] as any)['expirationDate']).toEqual(cache.parameters[0].expirationDate)

    // In cache but outdated -> asked for an update and got it from BFF
    expect(publishedParameters.parameters[1].productName).toEqual(cache.parameters[1].productName)
    expect(publishedParameters.parameters[1].appId).toEqual(cache.parameters[1].appId)
    expect(publishedParameters.parameters[1].parameters).toEqual({})
    expect((publishedParameters.parameters[1] as any)['expirationDate']).not.toEqual(cache.parameters[1].expirationDate)

    // In cache but app not in workspace -> no change
    expect(publishedParameters.parameters[2].productName).toEqual(cache.parameters[2].productName)
    expect(publishedParameters.parameters[2].appId).toEqual(cache.parameters[2].appId)
    expect(publishedParameters.parameters[2].parameters).toEqual(cache.parameters[2].parameters)
    expect((publishedParameters.parameters[2] as any)['expirationDate']).toEqual(cache.parameters[2].expirationDate)

    // Apps that have not been in the cache and have been newly requested and added
    expect(publishedParameters.parameters[3].productName).toEqual('product1')
    expect(publishedParameters.parameters[3].appId).toEqual('uncachedAppId2')
    expect(publishedParameters.parameters[3].parameters).toEqual({
      key4: 'value2',
      key5: true
    })
    expect((publishedParameters.parameters[3] as any)['expirationDate']).toBeDefined()

    expect(publishedParameters.parameters[4].productName).toEqual('product1')
    expect(publishedParameters.parameters[4].appId).toEqual('uncachedAppId1')
    expect(publishedParameters.parameters[4].parameters).toEqual({
      key6: 42
    })
    expect((publishedParameters.parameters[4] as any)['expirationDate']).toBeDefined()

    expect(publishedParameters.parameters[5].productName).toEqual('product2')
    expect(publishedParameters.parameters[5].appId).toEqual('uncachedAppId6')
    expect(publishedParameters.parameters[5].parameters).toEqual({})
    expect((publishedParameters.parameters[5] as any)['expirationDate']).toBeDefined()
  })

  it('should not fail if cache is corrupted', async () => {
    const parameters: GetParametersResponse = { products: {} }

    Storage.prototype.getItem = jest.fn().mockReturnValue('invalid json [')
    Storage.prototype.setItem = jest.fn()

    await publishWorkspace({ routes: [] })
    await publishRemoteComponents({ components: [] })
    jest.spyOn(parameterBffService, 'getParameters').mockReturnValue(of(parameters) as any)

    parametersService.initialize()

    const publishedParameters = await firstValueFrom(parametersPublisherMock.asObservable())

    expect(parameterBffService.getParameters).not.toHaveBeenCalled()
    expect(publishedParameters).toEqual({ parameters: [] })
  })

  it('should not fail if cache structure is wrong', async () => {
    const parameters: GetParametersResponse = { products: {} }

    Storage.prototype.getItem = jest.fn().mockReturnValue('{ "parameters2": "invalid" }')
    Storage.prototype.setItem = jest.fn()

    await publishWorkspace({ routes: [] })
    await publishRemoteComponents({ components: [] })
    jest.spyOn(parameterBffService, 'getParameters').mockReturnValue(of(parameters) as any)

    parametersService.initialize()

    const publishedParameters = await firstValueFrom(parametersPublisherMock.asObservable())

    expect(parameterBffService.getParameters).not.toHaveBeenCalled()
    expect(publishedParameters.parameters).toEqual([])
  })

  it('should not fail if cache is not yet there', async () => {
    const parameters: GetParametersResponse = { products: {} }

    Storage.prototype.getItem = jest.fn().mockReturnValue(undefined)
    Storage.prototype.setItem = jest.fn()

    await publishWorkspace({ routes: [] })
    await publishRemoteComponents({ components: [] })
    jest.spyOn(parameterBffService, 'getParameters').mockReturnValue(of(parameters) as any)

    parametersService.initialize()

    const publishedParameters = await firstValueFrom(parametersPublisherMock.asObservable())

    expect(parameterBffService.getParameters).not.toHaveBeenCalled()
    expect(publishedParameters.parameters).toEqual([])
  })

  it('should not fail with invalid route or remoteComponent config', async () => {
    const cache = { parameters: [] }
    const parameters: GetParametersResponse = { products: {} }

    Storage.prototype.getItem = jest.fn().mockReturnValue(JSON.stringify(cache))
    Storage.prototype.setItem = jest.fn()

    await publishWorkspace({ routes: undefined })
    await publishRemoteComponents({ components: undefined })
    jest.spyOn(parameterBffService, 'getParameters').mockReturnValue(of(parameters) as any)

    parametersService.initialize()

    const publishedParameters = await firstValueFrom(parametersPublisherMock.asObservable())

    expect(parameterBffService.getParameters).not.toHaveBeenCalled()
    expect(publishedParameters).toEqual(cache)
  })

  it('should not fail with corrupted route config', async () => {
    const cache = { parameters: [] }
    const parameters: GetParametersResponse = { products: {} }

    Storage.prototype.getItem = jest.fn().mockReturnValue(JSON.stringify(cache))
    Storage.prototype.setItem = jest.fn()

    await publishWorkspace({ routes: [{}] })
    await publishRemoteComponents({ components: [] })
    jest.spyOn(parameterBffService, 'getParameters').mockReturnValue(of(parameters) as any)

    parametersService.initialize()

    const publishedParameters = await firstValueFrom(parametersPublisherMock.asObservable())

    expect(publishedParameters).toEqual(cache)
  })
})


```

### File: onecx-shell-ui/src/app/shell/services/parameters.service.ts

```ts

import { inject, Injectable } from '@angular/core'
import {
  ApplicationParameters,
  ParametersPublisher,
  Parameters,
  RemoteComponent,
  Route
} from '@onecx/integration-interface'
import { AppStateService, RemoteComponentsService } from '@onecx/angular-integration-interface'
import { firstValueFrom } from 'rxjs'
import { GetParametersRequest, GetParametersResponse, Parameter, ParameterBffService } from 'src/app/shared/generated'

type Cache = { parameters: (ApplicationParameters & { expirationDate: number })[] }

@Injectable({ providedIn: 'root' })
export class ParametersService {
  private readonly appStateService = inject(AppStateService)
  private readonly remoteComponentsService = inject(RemoteComponentsService)
  private readonly parameterBffService = inject(ParameterBffService)
  private readonly cacheItemName = 'onecx-parameters-cache'
  private readonly cacheExpirationTimeMs = 3600 * 1000 // 1 hour
  private readonly parametersPublisher = new ParametersPublisher()

  initialize() {
    //Not awaited on purpose
    this.init()
  }

  private async init() {
    const cache: Cache = this.getCache(this.cacheItemName)
    const request: GetParametersRequest = await this.buildGetParametersRequest(
      cache,
      this.appStateService,
      this.remoteComponentsService
    )

    if (Object.keys(request.products).length !== 0) {
      const parameters = await firstValueFrom(this.parameterBffService.getParameters(request))
      this.updateCache(parameters, cache)
      localStorage.setItem(this.cacheItemName, JSON.stringify(cache))
    }
    this.parametersPublisher.publish(cache)
  }

  private async buildGetParametersRequest(
    cache: Cache,
    appStateService: AppStateService,
    remoteComponentsService: RemoteComponentsService
  ) {
    const request: GetParametersRequest = { products: {} }

    const workspace = await firstValueFrom(appStateService.currentWorkspace$.asObservable())
    this.addToGetParametersRequest(cache, request, workspace.routes ?? [])

    const remoteComponents = await firstValueFrom(remoteComponentsService.remoteComponents$.asObservable())
    this.addToGetParametersRequest(cache, request, remoteComponents.components ?? [])
    return request
  }

  private updateCache(parameters: GetParametersResponse, cache: Cache) {
    Object.keys(parameters.products).forEach((productName) => {
      Object.keys(parameters.products[productName]).forEach((appId) => {
        this.updateCacheEntry(cache, parameters, productName, appId)
      })
    })
  }

  private updateCacheEntry(cache: Cache, parameters: GetParametersResponse, productName: string, appId: string) {
    const params = parameters.products[productName][appId]
    const convertedParams = params.reduce(
      (acc: Parameters, param: Parameter) => ({ ...acc, [param.name]: param.value }),
      {}
    )

    const expirationDate = new Date()
    expirationDate.setSeconds(expirationDate.getSeconds() + this.cacheExpirationTimeMs)

    const existingParameter = cache.parameters.find((item) => item.productName === productName && item.appId === appId)
    if (existingParameter) {
      existingParameter.parameters = convertedParams
      existingParameter.expirationDate = expirationDate.getTime()
    } else {
      cache.parameters.push({
        productName: productName,
        appId: appId,
        expirationDate: expirationDate.getTime(),
        parameters: convertedParams
      })
    }
  }

  private addToGetParametersRequest(cache: Cache, request: GetParametersRequest, items: (Route | RemoteComponent)[]) {
    items.forEach((item) => {
      if (!this.hasValidCache(cache, item.productName ?? '', item.appId ?? '')) {
        request.products[item.productName ?? ''] ??= []
        if(!request.products[item.productName ?? ''].includes(item.appId ?? '')){
          request.products[item.productName ?? ''].push(item.appId ?? '')
        }
      }
    })
  }

  private getCache(cacheItemName: string): Cache {
    try {
      const cache = JSON.parse(localStorage.getItem(cacheItemName) ?? '{"parameters": []}')
      cache.parameters ??= []
      return cache
    } catch {
      console.error('Failed to parse cache from localStorage')
      return { parameters: [] }
    }
  }

  private hasValidCache(cache: Cache, productName: string, appId: string) {
    const cacheItem = cache.parameters.find((item) => item.productName === productName && item.appId === appId)
    if (cacheItem) {
      const now = new Date()
      const expirationDate = new Date(cacheItem.expirationDate)
      return now < expirationDate
    }
    return false
  }
}


```

### File: onecx-shell-ui/src/app/shell/services/permission-proxy.service.ts

```ts

import { Injectable } from '@angular/core'
import { PermissionsRpcTopic } from '@onecx/integration-interface'
import { catchError, filter, map, mergeMap, of, retry } from 'rxjs'
import { PermissionBffService } from 'src/app/shared/generated'
import { PermissionsCacheService } from './permissions-cache.service'

@Injectable({ providedIn: 'root' })
export class PermissionProxyService {
  private readonly permissionsTopic$ = new PermissionsRpcTopic()

  constructor(
    private readonly permissionsService: PermissionBffService,
    private readonly permissionsCacheService: PermissionsCacheService
  ) {}

  async init(): Promise<unknown> {
    this.permissionsTopic$
      .pipe(
        filter((message) => message.permissions === undefined),
        mergeMap((message) =>
          this.permissionsCacheService
            .getPermissions(message.appId, message.productName, (appId, productName) =>
              this.permissionsService.getPermissions({ appId, productName }).pipe(
                retry({ delay: 500, count: 3 }),
                catchError(() => {
                  console.error('Unable to load permissions for ', appId, productName)
                  return of({ permissions: [] })
                }),
                map(({ permissions }) => permissions)
              )
            )
            .pipe(map((permissions) => ({ message, permissions })))
        )
      )
      .subscribe(({ message, permissions }) => {
        const answer = {
          appId: message.appId,
          productName: message.productName,
          permissions: permissions
        }
        this.permissionsTopic$.publish(answer)
      })
    return Promise.resolve()
  }
}


```

### File: onecx-shell-ui/src/app/shell/services/permissions-cache.service.ts

```ts

import { Injectable } from '@angular/core'
import { Observable, shareReplay } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class PermissionsCacheService {
  permissions: Record<string, Observable<string[]>> = {}

  getPermissions(
    appId: string,
    productName: string,
    cacheMissFkt: (appId: string, productName: string) => Observable<string[]>
  ): Observable<string[]> {
    const key = appId + '|' + productName
    if (!this.permissions[key]) {
      this.permissions[key] = cacheMissFkt(appId, productName).pipe(shareReplay())
    }
    return this.permissions[key]
  }
}


```

### File: onecx-shell-ui/src/app/shell/services/routes.service.ts

```ts

import { Injectable } from '@angular/core'
import { Location } from '@angular/common'
import { LoadRemoteModuleOptions, loadRemoteModule } from '@angular-architects/module-federation'
import { NavigationEnd, NavigationSkipped, Route, Router } from '@angular/router'
import { BehaviorSubject, filter, firstValueFrom, map } from 'rxjs'

import { getLocation } from '@onecx/accelerator'
import {
  AppStateService,
  CONFIG_KEY,
  ConfigurationService,
  PortalMessageService
} from '@onecx/angular-integration-interface'
import { PermissionsTopic } from '@onecx/integration-interface'

import { appRoutes } from 'src/app/app.routes'
import { Route as BffGeneratedRoute, PathMatch, PermissionBffService, Technologies } from 'src/app/shared/generated'

import { WebcomponentLoaderModule } from '../web-component-loader/webcomponent-loader.module'
import { updateStylesForMfeChange } from '@onecx/angular-utils/style'
import { HttpClient } from '@angular/common/http'
import { PermissionsCacheService } from './permissions-cache.service'

export const DEFAULT_CATCH_ALL_ROUTE: Route = {
  path: '**',
  loadChildren: () => import('src/app/not-found/not-found.module').then((m) => m.NotFoundModule),
  title: 'OneCX Error'
}

@Injectable({ providedIn: 'root' })
export class RoutesService {
  private readonly permissionsTopic$ = new PermissionsTopic()
  private isFirstLoad = true
  showContent$ = new BehaviorSubject<boolean>(true)

  constructor(
    private readonly router: Router,
    private readonly appStateService: AppStateService,
    private readonly portalMessageService: PortalMessageService,
    private readonly configurationService: ConfigurationService,
    private readonly permissionsCacheService: PermissionsCacheService,
    private readonly permissionsService: PermissionBffService,
    private readonly httpClient: HttpClient
  ) {
    router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd || e instanceof NavigationSkipped),
        map(() => true)
      )
      .subscribe(this.showContent$)
  }

  async init(routes: BffGeneratedRoute[]): Promise<void> {
    routes.sort(this.sortRoutes)
    const generatedRoutes = await Promise.all(routes.map((r) => this.convertToRoute(r)))
    if (!(await this.containsRouteForWorkspace(routes))) {
      console.log('ðŸ§­ Adding fallback route')
      generatedRoutes.push(await this.createFallbackRoute())
    }
    this.router.resetConfig([...appRoutes, ...generatedRoutes, DEFAULT_CATCH_ALL_ROUTE])
    console.log('ðŸ§­ Adding Workspace routes:\n' + this.listRoutes(routes))
  }

  private listRoutes(routes: BffGeneratedRoute[]): string {
    return routes.map((lr) => `\t${lr.url} -> ${JSON.stringify(lr.baseUrl)}`).join('\n')
  }

  private sortRoutes(a: BffGeneratedRoute, b: BffGeneratedRoute): number {
    return (b.url ?? '').length - (a.url ?? '').length
  }

  private async convertToRoute(r: BffGeneratedRoute): Promise<Route> {
    return {
      path: await this.toRouteUrl(r.baseUrl),
      data: {
        module: r.exposedModule,
        breadcrumb: r.productName
      },
      pathMatch: r.pathMatch ?? (r.baseUrl.endsWith('$') ? 'full' : 'prefix'),
      loadChildren: async () => await this.loadChildren(r, r.baseUrl),
      canActivateChild: [() => this.updateAppEnvironment(r, r.baseUrl)],
      title: r.displayName
    }
  }

  private async loadChildren(r: BffGeneratedRoute, joinedBaseUrl: string) {
    this.showContent$.next(false)
    await this.appStateService.globalLoading$.publish(true)
    console.log(`âž¡ Load remote module ${r.exposedModule}`)
    try {
      try {
        await this.updateAppEnvironment(r, joinedBaseUrl)
        const m = await loadRemoteModule(this.toLoadRemoteEntryOptions(r))
        const exposedModule = r.exposedModule.startsWith('./') ? r.exposedModule.slice(2) : r.exposedModule
        console.log(`Load remote module ${exposedModule} finished.`)
        if (r.technology === Technologies.Angular) {
          return m[exposedModule]
        } else {
          return WebcomponentLoaderModule
        }
      } catch (err) {
        return await this.onRemoteLoadError(err)
      }
    } finally {
      await this.appStateService.globalLoading$.publish(false)
    }
  }

  private async updateAppEnvironment(r: BffGeneratedRoute, joinedBaseUrl: string): Promise<boolean> {
    this.updateAppStyles(r)
    return this.updateAppState(r, joinedBaseUrl)
  }

  private async updateAppState(r: BffGeneratedRoute, joinedBaseUrl: string): Promise<boolean> {
    const currentGlobalLoading = await firstValueFrom(this.appStateService.globalLoading$.asObservable())
    let currentMfeInfo: { remoteBaseUrl?: string } | undefined
    if (!this.isFirstLoad) {
      currentMfeInfo = await firstValueFrom(this.appStateService.currentMfe$.asObservable())
    }

    if (this.isFirstLoad || (currentMfeInfo?.remoteBaseUrl ?? undefined) !== r.url) {
      this.isFirstLoad = false
      if (!currentGlobalLoading) {
        this.showContent$.next(false)
        await this.appStateService.globalLoading$.publish(true)
      }

      await Promise.all([this.updateMfeInfo(r, joinedBaseUrl), this.updatePermissions(r)])

      if (!currentGlobalLoading) {
        await this.appStateService.globalLoading$.publish(false)
      }
    }
    return true
  }

  private async updateAppStyles(r: BffGeneratedRoute) {
    await updateStylesForMfeChange(r.productName, r.appId, this.httpClient, r.url)
  }

  private async updateMfeInfo(r: BffGeneratedRoute, joinedBaseUrl: string) {
    const mfeInfo = {
      baseHref: joinedBaseUrl,
      version: r.productVersion,
      mountPath: joinedBaseUrl,
      shellName: 'portal',
      remoteBaseUrl: r.url,
      displayName: r.displayName,
      appId: r.appId,
      productName: r.productName,
      remoteName: r.remoteName,
      elementName: r.elementName
    }
    return await this.appStateService.currentMfe$.publish(mfeInfo)
  }

  private async updatePermissions(r: BffGeneratedRoute) {
    const permissions = await firstValueFrom(
      this.permissionsCacheService.getPermissions(r.appId, r.productName, (appId, productName) =>
        this.permissionsService.getPermissions({ appId, productName }).pipe(map(({ permissions }) => permissions))
      )
    )
    await this.permissionsTopic$.publish(permissions)
  }

  private async onRemoteLoadError(err: unknown) {
    console.log(`Failed to load remote module: ${err}`)
    this.portalMessageService.error({
      summaryKey: 'ERROR_MESSAGES.ON_REMOTE_LOAD_ERROR'
    })

    const routerParams = {
      requestedApplicationPath: getLocation().applicationPath
    }

    this.router.navigate(['remote-loading-error-page', routerParams])
    throw err
  }

  private toLoadRemoteEntryOptions(r: BffGeneratedRoute): LoadRemoteModuleOptions {
    const exposedModule = r.exposedModule.startsWith('./') ? r.exposedModule.slice(2) : r.exposedModule
    if (r.technology === Technologies.Angular || r.technology === Technologies.WebComponentModule) {
      return {
        type: 'module',
        remoteEntry: r.remoteEntryUrl,
        exposedModule: './' + exposedModule
      }
    }
    return {
      type: 'script',
      remoteName: r.remoteName ?? '',
      remoteEntry: r.remoteEntryUrl,
      exposedModule: './' + exposedModule
    }
  }

  private async toRouteUrl(url: string | undefined) {
    if (!url) {
      return url
    }
    const SHELL_BASE_HREF = await this.configurationService.getProperty(CONFIG_KEY.APP_BASE_HREF)
    if (SHELL_BASE_HREF && url.startsWith(SHELL_BASE_HREF)) {
      url = url.slice(SHELL_BASE_HREF.length)
    }

    if (url?.startsWith('/')) {
      url = url.substring(1)
    }
    if (url.endsWith('$')) {
      url = url.substring(0, url.length - 1)
    }
    if (url.endsWith('/')) {
      url = url.substring(0, url.length - 1)
    }
    return url
  }

  private async containsRouteForWorkspace(routes: BffGeneratedRoute[]): Promise<boolean> {
    const baseUrl = (await firstValueFrom(this.appStateService.currentWorkspace$.asObservable())).baseUrl
    const routeUrl = await this.toRouteUrl(baseUrl)
    return routes.some((r) => r.baseUrl === routeUrl)
  }

  private async createFallbackRoute(): Promise<Route> {
    const currentWorkspace = await firstValueFrom(this.appStateService.currentWorkspace$.asObservable())
    const route = {
      path: await this.toRouteUrl(currentWorkspace.baseUrl),
      pathMatch: PathMatch.full
    }

    if (!currentWorkspace.homePage) {
      return {
        ...route,
        loadChildren: () => import('src/app/home/home.module').then((m) => m.HomeModule)
      }
    }
    return {
      ...route,
      redirectTo: await this.createHomePageUrl(currentWorkspace.baseUrl, currentWorkspace.homePage)
    }
  }

  private createHomePageUrl(baseUrl: string, homePage: string) {
    return this.toRouteUrl(Location.joinWithSlash(baseUrl, homePage))
  }
}


```

## Folder: onecx-shell-ui/src/app/shell/utils (8 files)

### File: onecx-shell-ui/src/app/shell/utils/initialization-error-handler.utils.spec.ts

```ts

import { TestBed } from '@angular/core/testing'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'

import { initializationErrorHandler } from './initialization-error-handler.utils'

describe('initializationErrorHandler', () => {
  let router: Router

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { navigate: jest.fn() } }]
    })

    router = TestBed.inject(Router)
    //jest.spyOn(console, 'error').mockImplementation(jest.fn()) // disable console output
  })

  it('should log the error and navigate to the error page with fragment parameters for ErrorEvent', () => {
    const errorEvent = new ErrorEvent('Network error', { error: { message: 'A Network error has occurred' } })
    const consoleSpy = jest.spyOn(console, 'error')

    initializationErrorHandler(errorEvent, router)

    expect(consoleSpy).toHaveBeenCalledWith(errorEvent)
    expect(router.navigate).toHaveBeenCalledWith(['portal-initialization-error-page'], {
      fragment: expect.stringContaining('Network+error')
    })

    consoleSpy.mockRestore()
  })

  it('should log the error and navigate to the error page with fragment parameters for HttpErrorResponse', () => {
    const httpErrorResponse = new HttpErrorResponse({
      error: {
        detail: 'Detail message',
        errorCode: '404',
        invalidParams: [{ name: 'param1', message: 'Invalid' }],
        params: [{ key: 'key1', value: 'value1' }]
      },
      status: 404,
      statusText: 'Not Found',
      url: 'http://example.com'
    })
    ;(httpErrorResponse as any)['message'] = 'HTTP error occurred'
    const consoleSpy = jest.spyOn(console, 'error')

    initializationErrorHandler(httpErrorResponse, router)

    expect(consoleSpy).toHaveBeenCalledWith(httpErrorResponse)
    expect(router.navigate).toHaveBeenCalledWith(['portal-initialization-error-page'], {
      fragment: expect.stringContaining('message=HTTP+error+occurred')
    })
    expect(router.navigate).toHaveBeenCalledWith(['portal-initialization-error-page'], {
      fragment: expect.stringContaining('detail=Detail+message')
    })
    expect(router.navigate).toHaveBeenCalledWith(['portal-initialization-error-page'], {
      fragment: expect.stringContaining('errorCode=404')
    })
    expect(router.navigate).toHaveBeenCalledWith(['portal-initialization-error-page'], {
      fragment: expect.stringContaining('invalidParams=%5Bparam1%3A+Invalid%5D')
    })
    expect(router.navigate).toHaveBeenCalledWith(['portal-initialization-error-page'], {
      fragment: expect.stringContaining('params=%5Bkey1%3A+value1%5D')
    })

    consoleSpy.mockRestore()
  })

  it('should handle unknown error types gracefully', () => {
    const unknownError = { anything: 'Unknown error' }
    const consoleSpy = jest.spyOn(console, 'error')

    initializationErrorHandler(unknownError, router)

    expect(consoleSpy).toHaveBeenCalledWith(unknownError)
    expect(router.navigate).toHaveBeenCalledWith(['portal-initialization-error-page'], {
      fragment: expect.stringContaining('message=')
    })

    consoleSpy.mockRestore()
  })
})


```

### File: onecx-shell-ui/src/app/shell/utils/initialization-error-handler.utils.ts

```ts

import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { Observable, of } from 'rxjs'

import { ProblemDetailResponse } from 'src/app/shared/generated'

type InitializationErrorDetails = ProblemDetailResponse

interface InitializationError {
  message: string
  details?: InitializationErrorDetails
}

export function initializationErrorHandler(error: any, router: Router): Observable<any> {
  console.error(error)
  const initError: InitializationError = { message: '' }
  if (error instanceof ErrorEvent) {
    initError.message = error.error.message
  } else if (error instanceof HttpErrorResponse) {
    initError.details = error.error
    initError.message = error.message
  }

  const params = new URLSearchParams()
  params.set('message', initError.message)
  params.set('requestedUrl', window.location.href)
  params.set('detail', initError.details?.detail ?? '')
  params.set('errorCode', initError.details?.errorCode ?? '')
  params.set(
    'invalidParams',
    initError.details?.invalidParams
      ? '['.concat(initError.details.invalidParams.map((p) => `${p.name}: ${p.message}`).join(',')).concat(']')
      : ''
  )
  params.set(
    'params',
    initError.details?.params
      ? '['.concat(initError.details.params.map((p) => `${p.key}: ${p.value}`).join(',')).concat(']')
      : ''
  )

  // only on first time: redirect and add message
  if (!params.toString().includes('portal-initialization-error-page'))
    router.navigate(['portal-initialization-error-page'], { fragment: params.toString() })
  return of(undefined)
}


```

### File: onecx-shell-ui/src/app/shell/utils/normalize-classes.spec.ts

```ts

import { normalizeClassesToString } from './normalize-classes.utils'

describe('normalizeClassesToString utility', () => {
  it('should return empty string for falsy values', () => {
    expect(normalizeClassesToString('')).toBe('')
    expect(normalizeClassesToString(null as any)).toBe('')
    expect(normalizeClassesToString(undefined as any)).toBe('')
  })

  it('should handle array input', () => {
    expect(normalizeClassesToString(['class1', 'class2'])).toBe('class1 class2')
    expect(normalizeClassesToString([])).toBe('')
  })

  it('should handle Set input', () => {
    expect(normalizeClassesToString(new Set(['class1', 'class2']))).toBe('class1 class2')
    expect(normalizeClassesToString(new Set())).toBe('')
  })

  it('should handle object input with truthy values', () => {
    expect(normalizeClassesToString({ class1: true, class2: false, class3: true })).toBe('class1 class3')
  })

  it('should handle object input with all falsy values', () => {
    expect(normalizeClassesToString({ class1: false, class2: false })).toBe('')
  })

  it('should handle empty object input', () => {
    expect(normalizeClassesToString({})).toBe('')
  })

  it('should handle string input', () => {
    expect(normalizeClassesToString('class1 class2')).toBe('class1 class2')
    expect(normalizeClassesToString('  trimmed  ')).toBe('trimmed')
  })
})


```

### File: onecx-shell-ui/src/app/shell/utils/normalize-classes.utils.ts

```ts

import { NgClassInputType } from '../components/slot-group/slot-group.component'

/**
 * Normalizes various class input formats into a single space-separated string.
 *
 * This is needed because custom classes can be provided as arrays, sets, or objects
 * (e.g.: { 'active': true }), but we need to merge them with base class strings.
 *
 * @param classes - CSS classes in string, array, set, or object format
 * @returns A space-separated string of CSS class names
 */
export function normalizeClassesToString(classes: NgClassInputType): string {
  if (!classes) return ''

  if (Array.isArray(classes) || classes instanceof Set) {
    return [...classes].join(' ')
  }

  if (typeof classes === 'object') {
    return Object.keys(classes)
      .filter((key) => classes[key])
      .join(' ')
  }

  return classes.trim()
}


```

### File: onecx-shell-ui/src/app/shell/utils/preloader.utils.spec.ts

```ts

import { loadPreloaderModule, ensurePreloaderModuleLoaded } from './preloader.utils'
import * as moduleFederation from '@angular-architects/module-federation'

jest.mock('@angular-architects/module-federation', () => ({
  loadRemoteModule: jest.fn().mockResolvedValue('MockModule')
}))

describe('Preloader Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('loadPreloaderModule', () => {
    it('should load a remote module using module federation with document base href', async () => {
      const dom = document
      jest.spyOn(dom, 'getElementsByTagName').mockReturnValue([{ href: 'http://localhost/base/' }] as any)
      const mockPreloader = {
        relativeRemoteEntryUrl: 'mock/remoteEntry.js',
        windowKey: 'mock-key',
        exposedModule: './MockModule'
      }

      const result = await loadPreloaderModule(mockPreloader)

      expect(moduleFederation.loadRemoteModule).toHaveBeenCalledWith({
        type: 'module',
        remoteEntry: `/base/${mockPreloader.relativeRemoteEntryUrl}`,
        exposedModule: mockPreloader.exposedModule
      })
      expect(result).toBe('MockModule')
    })

    it('should load a remote module using module federation with location origin', async () => {
      const dom = document
      jest.spyOn(dom, 'getElementsByTagName').mockReturnValue([undefined as any] as any)
      Object.defineProperty(window, 'location', {
        value: {
          origin: 'http://localhost/baseOrigin/',
          href: 'http://localhost/baseOrigin/admin'
        },
        writable: true
      })
      const mockPreloader = {
        relativeRemoteEntryUrl: 'mock/remoteEntry.js',
        windowKey: 'mock-key',
        exposedModule: './MockModule'
      }

      const result = await loadPreloaderModule(mockPreloader)

      expect(moduleFederation.loadRemoteModule).toHaveBeenCalledWith({
        type: 'module',
        remoteEntry: `/${mockPreloader.relativeRemoteEntryUrl}`,
        exposedModule: mockPreloader.exposedModule
      })
      expect(result).toBe('MockModule')
    })
  })

  describe('ensurePreloaderModuleLoaded', () => {
    it('should resolve immediately if the preloader module is already loaded', async () => {
      window.onecxPreloaders = { 'mock-key': true }

      const mockPreloader = {
        relativeRemoteEntryUrl: 'mock/remoteEntry.js',
        windowKey: 'mock-key',
        exposedModule: './MockModule'
      }

      const result = await ensurePreloaderModuleLoaded(mockPreloader)
      expect(result).toBe(true)
    })

    it('should wait until the preloader module is loaded', async () => {
      window.onecxPreloaders = {}

      const mockPreloader = {
        relativeRemoteEntryUrl: 'mock/remoteEntry.js',
        windowKey: 'mock-key',
        exposedModule: './MockModule'
      }

      setTimeout(() => {
        window.onecxPreloaders['mock-key'] = true
      }, 100)

      const result = await ensurePreloaderModuleLoaded(mockPreloader)
      expect(result).toBe(true)
    })
  })
})


```

### File: onecx-shell-ui/src/app/shell/utils/preloader.utils.ts

```ts

declare global {
  interface Window {
    onecxPreloaders: Record<string, any>
  }
}

export interface Preloader {
  relativeRemoteEntryUrl: string
  windowKey: string
  exposedModule: string
}

export const angular18Preloader: Preloader = {
  relativeRemoteEntryUrl: 'pre_loaders/onecx-angular-18-loader/remoteEntry.js',
  windowKey: 'angular-18',
  exposedModule: './Angular18Loader'
}

export const angular19Preloader: Preloader = {
  relativeRemoteEntryUrl: 'pre_loaders/onecx-angular-19-loader/remoteEntry.js',
  windowKey: 'angular-19',
  exposedModule: './Angular19Loader'
}

export const angular20Preloader: Preloader = {
  relativeRemoteEntryUrl: 'pre_loaders/onecx-angular-20-loader/remoteEntry.js',
  windowKey: 'angular-20',
  exposedModule: './Angular20Loader'
}

export async function loadPreloaderModule(preloader: Preloader) {
  const moduleFederation = await import('@angular-architects/module-federation')
  return moduleFederation.loadRemoteModule({
    type: 'module',
    remoteEntry: `${getLocation().deploymentPath}${preloader.relativeRemoteEntryUrl}`,
    exposedModule: preloader.exposedModule
  })
}

export function ensurePreloaderModuleLoaded(preloader: Preloader) {
  return new Promise((resolve) => {
    if (window['onecxPreloaders'][preloader.windowKey]) {
      resolve(true)
      return
    }
    const ensureIntevalId = setInterval(() => {
      if (window['onecxPreloaders'][preloader.windowKey]) {
        clearInterval(ensureIntevalId)
        resolve(true)
      }
    }, 50)
  })
}

export function getLocation() {
  const baseHref = document.getElementsByTagName('base')[0]?.href ?? window.location.origin + '/'
  const location = window.location as any
  location.deploymentPath = baseHref.substring(window.location.origin.length)
  location.applicationPath = window.location.href.substring(baseHref.length - 1)

  return location
}


```

### File: onecx-shell-ui/src/app/shell/utils/slot-names-mapper.spec.ts

```ts

import { mapSlots, slotNamesMapping } from './slot-names-mapper'

describe('mapSlots', () => {
  it('should map old slot names to new slot-group slot names', () => {
    const oldSlotName = Object.keys(slotNamesMapping)[0]
    const newSlotName = slotNamesMapping[oldSlotName]
    const slots = [{ name: oldSlotName, components: [] }]
    const mappedSlots = mapSlots(slots)

    expect(mappedSlots[0].name).toBe(newSlotName)
  })

  it('should not map slot names that are not in the mapping', () => {
    const slots = [{ name: 'other-slot', components: [] }]
    const mappedSlots = mapSlots(slots)

    expect(mappedSlots[0].name).toBe('other-slot')
  })

  it('should map multiple slots', () => {
    const slots = [
      { name: 'onecx-shell-vertical-menu', components: [] },
      { name: 'onecx-shell-header-left', components: [] },
      { name: 'other-slot', components: [] }
    ]
    const mappedSlots = mapSlots(slots)

    expect(mappedSlots[0].name).toBe(slotNamesMapping['onecx-shell-vertical-menu'])
    expect(mappedSlots[1].name).toBe(slotNamesMapping['onecx-shell-header-left'])
    expect(mappedSlots[2].name).toBe('other-slot')
  })

  it('should return empty array if slots is empty', () => {
    const slots = [] as { name: string; components: string[] }[]
    const mappedSlots = mapSlots(slots)

    expect(mappedSlots).toEqual([])
  })

  it('should merge slots with the same mapped name and combine their components', () => {
    const slots = [
      { name: 'onecx-shell-footer', components: ['A'] },
      { name: 'onecx-page-footer', components: ['B'] }
    ]
    const mappedSlots = mapSlots(slots)

    expect(mappedSlots.length).toBe(1)
    expect(mappedSlots[0].name).toBe(slotNamesMapping['onecx-shell-footer'])
    expect(mappedSlots[0].components).toEqual(expect.arrayContaining(['A', 'B']))
  })

  it('should remove duplicate components when merging slots', () => {
    const slots = [
      { name: 'onecx-shell-footer', components: ['A', 'B'] },
      { name: 'onecx-page-footer', components: ['B', 'C'] }
    ]
    const mappedSlots = mapSlots(slots)

    expect(mappedSlots.length).toBe(1)
    expect(mappedSlots[0].components).toEqual(expect.arrayContaining(['A', 'B', 'C']))
    expect(mappedSlots[0].components.filter((c) => c === 'B').length).toBe(1)
  })
})


```

### File: onecx-shell-ui/src/app/shell/utils/slot-names-mapper.ts

```ts

import { Slot } from '@onecx/integration-interface'

export const slotNamesMapping: Record<string, string> = {
  'onecx-shell-vertical-menu': 'onecx-shell-body-start.start',
  'onecx-shell-horizontal-menu': 'onecx-shell-header.center',
  'onecx-shell-header-left': 'onecx-shell-header.start',
  'onecx-shell-header-right': 'onecx-shell-header.end',
  'onecx-shell-sub-header': 'onecx-shell-body-header.center',
  'onecx-shell-footer': 'onecx-shell-body-footer.start',
  'onecx-page-footer': 'onecx-shell-body-footer.start'
}

/**
 * Maps slot names in the given slots array using slotNamesMapping.
 * @param slots Array of Slot objects to map.
 * @returns Array of Slot objects with mapped names.
 */
function mapSlotNames(slots: Slot[]): Slot[] {
  return slots.map((slot: Slot) => ({
    ...slot,
    name: slotNamesMapping[slot.name] ?? slot.name
  }))
}

/**
 * Merges slots with the same name, combining their components and removing duplicates.
 * @param slots Array of Slot objects (with mapped names).
 * @returns Array of merged Slot objects.
 */
function mergeSlotsByName(slots: Slot[]): Slot[] {
  const slotMap: Record<string, Slot> = {}
  for (const slot of slots) {
    if (slotMap[slot.name]) {
      const existingSlot = slotMap[slot.name]
      slotMap[slot.name] = {
        ...existingSlot,
        components: [...existingSlot.components, ...slot.components.filter((c) => !existingSlot.components.includes(c))]
      }
    } else {
      slotMap[slot.name] = { ...slot, components: [...slot.components] }
    }
  }
  return Object.values(slotMap)
}

/**
 * Normalizes slot names to the slot group naming convention.
 * - Slot names listed in slotNamesMapping are replaced with their mapped values.
 * - All other slot names remain unchanged.
 * - After mapping, slots with the same name are merged, combining their components and removing duplicates.
 *
 * @param slots Array of Slot objects to normalize.
 * @returns Normalized and merged slots.
 */
export function mapSlots(slots: Slot[]): Slot[] {
  const mappedSlots = mapSlotNames(slots)
  const mergedSlots = mergeSlotsByName(mappedSlots)

  return mergedSlots
}


```

## Folder: onecx-shell-ui/src/app/shell/utils/styles (12 files)

### File: onecx-shell-ui/src/app/shell/utils/styles/angular-material-overwrites.utils.ts

```ts

import { getOnecxTriggerElement } from './onecx-trigger-element.utils'
import { appendIntermediateStyleData, getStyleDataOrIntermediateStyleData, markElement } from './style-data.utils'

// When creating elements in Angular Material make sure to include the style id data in them so when appending to the body we don't lose context of the current App
export function ensureMaterialDynamicDataIncludesIntermediateStyleData() {
  // eslint-disable-next-line @typescript-eslint/no-extra-semi
  ;(document as any).createElementFromMaterial = function (context: any, tagName: any, options?: any): HTMLElement {
    const el = document.createElement(tagName, options)
    const onecxTrigger = getOnecxTriggerElement()
    const styleData = onecxTrigger ? getStyleDataOrIntermediateStyleData(onecxTrigger) : null
    // Append intermediate data so the isolation does not happen by coincidence
    if (styleData) {
      appendIntermediateStyleData(el, styleData)
    }
    markElement(el, 'createElementFromMaterial')
    return el
  }
}


```

### File: onecx-shell-ui/src/app/shell/utils/styles/body-overwrites.utils.ts

```ts

import { POLYFILL_SCOPE_MODE } from '@onecx/angular-integration-interface'
import { isCssScopeRuleSupported } from '@onecx/angular-utils'
import { createNodeList, updateStyleSheets } from 'src/scope-polyfill/polyfill'
import {
  findStyleDataWrapper,
  getStyleDataOrIntermediateStyleData,
  markElement,
  removeStyleDataRecursive,
  wrapWithDiv
} from './style-data.utils'
import { getOnecxTriggerElement } from './onecx-trigger-element.utils'

export function ensureBodyChangesIncludeStyleData(polyfillMode: string | undefined) {
  overwriteAppendChild(polyfillMode)
  overwriteRemoveChild()
}

// When appending children to body create a wrapper with style isolation data and recompute style sheets for browsers not supporting @scope rule so all added elements are styled correctly immediately on the page
function overwriteAppendChild(polyfillMode: string | undefined) {
  const originalAppendChild = document.body.appendChild
  document.body.appendChild = function (newChild: Node): any {
    let childToAppend = newChild
    markElement(newChild, 'overwriteAppendChild')
    if (newChild.nodeType === Node.ELEMENT_NODE && newChild instanceof HTMLElement) {
      const onecxTriggerElement = getOnecxTriggerElement()
      const triggerElementStyleData = onecxTriggerElement
        ? getStyleDataOrIntermediateStyleData(onecxTriggerElement)
        : null
      const childElementStyleData = getStyleDataOrIntermediateStyleData(newChild)
      const styleData = childElementStyleData ?? triggerElementStyleData ?? undefined
      childToAppend = wrapWithDiv(newChild, styleData)
      removeStyleDataRecursive(newChild)
    }
    const result = originalAppendChild.call(this, childToAppend)
    if (!isCssScopeRuleSupported() && polyfillMode === POLYFILL_SCOPE_MODE.PRECISION) {
      updateStyleSheets([
        {
          type: 'childList',
          target: document.body,
          addedNodes: createNodeList([childToAppend]),
          attributeName: null,
          attributeNamespace: null,
          nextSibling: null,
          oldValue: null,
          previousSibling: null,
          removedNodes: createNodeList([])
        } as MutationRecord
      ])
    }
    return result
  }
}

// When removing children from the body make sure to remove the wrapper with style isolation data
function overwriteRemoveChild() {
  const originalRemoveChild = document.body.removeChild
  document.body.removeChild = function (child: Node): any {
    let childToRemove = child
    if (child.nodeType === Node.ELEMENT_NODE && child instanceof HTMLElement) {
      childToRemove = findStyleDataWrapper(child) ?? child
    }
    return originalRemoveChild.call(this, childToRemove)
  }
}


```

### File: onecx-shell-ui/src/app/shell/utils/styles/dynamic-content-initializer.utils.ts

```ts

import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { ensurePrimengDynamicDataIncludesIntermediateStyleData } from './primeng-overwrites.utils'
import { ensureBodyChangesIncludeStyleData } from './body-overwrites.utils'
import { ensureMaterialDynamicDataIncludesIntermediateStyleData } from './angular-material-overwrites.utils'
import { initializeOnecxTriggerElementListener } from './onecx-trigger-element.utils'
import { ensureAngularComponentStylesContainStyleId } from './shared-styles-host-overwrites.utils'

export async function dynamicContentInitializer(configService: ConfigurationService) {
  const polyfillMode = await configService.getProperty(CONFIG_KEY.POLYFILL_SCOPE_MODE)
  ensureAngularComponentStylesContainStyleId()
  ensureBodyChangesIncludeStyleData(polyfillMode)
  ensurePrimengDynamicDataIncludesIntermediateStyleData()
  ensureMaterialDynamicDataIncludesIntermediateStyleData()
  initializeOnecxTriggerElementListener()
}


```

### File: onecx-shell-ui/src/app/shell/utils/styles/legacy-style.utils.ts

```ts

import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import {
  dataNoPortalLayoutStylesAttribute,
  dataStyleIdAttribute,
  dataStyleIsolationAttribute,
  dataPortalLayoutStylesKey,
  dataDynamicPortalLayoutStylesKey,
  isCssScopeRuleSupported
} from '@onecx/angular-utils'
import { addStyleToHead, replaceRootWithScope } from '@onecx/angular-utils/style'
import { markElement } from './style-data.utils'

export async function fetchPortalLayoutStyles(http: HttpClient) {
  return await firstValueFrom(http.request('get', `./portal-layout-styles.css`, { responseType: 'text' }))
}

export function loadPortalLayoutStyles(css: string) {
  loadPortalLayoutStylesStyles(css)
  loadDynamicPortalLayoutStylesStyles(css)
}

function loadPortalLayoutStylesStyles(css: string) {
  if (isCssScopeRuleSupported()) {
    const styleElement = addStyleToHead(
      `
      @scope([${dataStyleIdAttribute}]:not([${dataNoPortalLayoutStylesAttribute}])) to ([${dataStyleIsolationAttribute}]) {
      ${replaceRootWithScope(css)}
    }
    `,
      {
        [dataPortalLayoutStylesKey]: ''
      }
    )
    markElement(styleElement, dataPortalLayoutStylesKey)
  } else {
    const styleElement = addStyleToHead(
      `
      @supports(@scope([${dataStyleIdAttribute}]:not([${dataNoPortalLayoutStylesAttribute}])) to ([${dataStyleIsolationAttribute}])) {
          ${replaceRootWithScope(css)}
        }
        `,
      {
        [dataPortalLayoutStylesKey]: ''
      }
    )
    ;(styleElement as any).onecxOriginalCss = css
    markElement(styleElement, dataPortalLayoutStylesKey)
  }
}

// This could be merged with loadPortalLayoutStylesStyles but its important to preserve functionality of PRECISION mode polyfill
// which most likely relies on the fact that the dynamic styles are in a separate style element
function loadDynamicPortalLayoutStylesStyles(css: string) {
  if (isCssScopeRuleSupported()) {
    const styleElement = addStyleToHead(
      `
      @scope(body > :not([${dataNoPortalLayoutStylesAttribute}])) to ([${dataStyleIsolationAttribute}]) {
      ${replaceRootWithScope(css)}
    }
      `,
      {
        [dataDynamicPortalLayoutStylesKey]: ''
      }
    )
    markElement(styleElement, dataDynamicPortalLayoutStylesKey)
  } else {
    const styleElement = addStyleToHead(
      `
      @supports(@scope(body > :not([${dataNoPortalLayoutStylesAttribute}])) to ([${dataStyleIsolationAttribute}])) {
      ${replaceRootWithScope(css)}
    }
    `,
      {
        [dataDynamicPortalLayoutStylesKey]: ''
      }
    )
    ;(styleElement as any).onecxOriginalCss = css
    markElement(styleElement, dataDynamicPortalLayoutStylesKey)
  }
}


```

### File: onecx-shell-ui/src/app/shell/utils/styles/onecx-trigger-element.utils.ts

```ts

declare global {
  // eslint-disable-next-line no-var
  var onecxTriggerElement: EventTarget | null
}

/**
 * Initializes the OneCX trigger element listener to track the last interacted element.
 *
 * The following events are considered as trigger changes:
 * - Mouseover: When the user hovers over an element.
 * - Focusin: When an element gains focus (e.g., via keyboard navigation).
 *
 * The last interacted element is stored in `window.onecxTriggerElement`.
 */
export function initializeOnecxTriggerElementListener() {
  // Detect last used element and save it as the current trigger
  document.addEventListener('mouseover', (event) => {
    updateOnecxTriggerElement(event.target)
  })

  document.addEventListener('focusin', (event) => {
    updateOnecxTriggerElement(event.target)
  })
}

/**
 * Retrieves the current OneCX trigger element.
 *
 * If the trigger element is null, it falls back to the first element with a `data-style-id` attribute
 * within the `.onecx-body` container.
 * @returns The current OneCX trigger element or a fallback element. Returns null if no suitable element is found.
 */
export function getOnecxTriggerElement() {
  if (globalThis.onecxTriggerElement !== null) {
    return globalThis.onecxTriggerElement
  }

  console.warn('OneCX Trigger Element is null, will fallback to app trigger element as content source.')
  const bodyElement = document.querySelector('.onecx-body')
  if (!bodyElement) {
    console.warn('OneCX Body Element not found. Could not create fallback trigger element.')
    return null
  }
  const appElement = bodyElement.querySelector('[data-style-id]')
  if (!appElement) {
    console.warn('No element with data-style-id found inside OneCX Body. Could not create fallback trigger element.')
    return null
  }

  return appElement
}

function updateOnecxTriggerElement(target: EventTarget | null) {
  globalThis.onecxTriggerElement = target
}


```

### File: onecx-shell-ui/src/app/shell/utils/styles/primeng-overwrites.utils.ts

```ts

import { getOnecxTriggerElement } from './onecx-trigger-element.utils'
import { appendIntermediateStyleData, getStyleDataOrIntermediateStyleData, markElement } from './style-data.utils'

// When creating elements in PrimeNg make sure to include the style id data in them so when appending to the body we don't lose context of the current App
export function ensurePrimengDynamicDataIncludesIntermediateStyleData() {
  // eslint-disable-next-line @typescript-eslint/no-extra-semi
  ;(document as any).createElementFromPrimeNg = function (context: any, tagName: any, options?: any): HTMLElement {
    const el = document.createElement(tagName, options)
    const contextElement = context['this']?.el?.nativeElement
    const onecxTrigger = getOnecxTriggerElement()
    const styleData =
      (contextElement ? getStyleDataOrIntermediateStyleData(contextElement) : null) ??
      (onecxTrigger ? getStyleDataOrIntermediateStyleData(onecxTrigger) : null)
    // Append intermediate data so the isolation does not happen by coincidence
    if (styleData) {
      appendIntermediateStyleData(el, styleData)
    }
    markElement(el, 'createElementFromPrimeNg')
    return el
  }
}


```

### File: onecx-shell-ui/src/app/shell/utils/styles/shared-styles-host-overwrites.utils.ts

```ts

import { DynamicAppId } from '@onecx/angular-webcomponents'
import { getStyleDataOrIntermediateStyleData, markElement } from './style-data.utils'

export const MARKED_FOR_WRAPPING = 'markedForWrapping'
export const MARKED_AS_WRAPPED = 'markedAsWrapped'

// When creating style elements via Renderer from Angular Core, make sure to include the style id data in the style elements so when appending to the head we don't lose context of the current App
export function ensureAngularComponentStylesContainStyleId() {
  // eslint-disable-next-line @typescript-eslint/no-extra-semi
  ;(document as any).createElementFromSharedStylesHost = function (
    context: any,
    tagName: any,
    options?: any
  ): HTMLElement {
    const el = document.createElement(tagName, options)
    const sharedStylesHost = context['this']
    if (!sharedStylesHost?.appId) {
      console.warn('Expected to overwrite SharedStyleHost createElement method, but no appId found on context.')
      return el
    }
    const dynamicAppId = sharedStylesHost.appId as DynamicAppId
    if (!dynamicAppId.appElementName) {
      console.warn(
        'Expected to overwrite SharedStyleHost createElement method, but appId is not instance of DynamicAppId.'
      )
      return el
    }
    const contextElementName = dynamicAppId.appElementName
    const contextElement = document.getElementsByTagName(contextElementName)[0]
    if (!contextElement) {
      console.warn(
        `Expected to overwrite SharedStyleHost createElement method, but could not find context element for Angular component styles: ${contextElementName}`
      )
      return el
    }
    const styleData = contextElement ? getStyleDataOrIntermediateStyleData(contextElement) : null
    if (!styleData) {
      console.warn(
        `Expected to overwrite SharedStyleHost createElement method, but could not find style data for Angular component styles in context element: ${contextElementName}`
      )
      return el
    }
    el.dataset[MARKED_FOR_WRAPPING] = styleData.styleId
    markElement(el, 'ensureAngularComponentStylesContainStyleId')

    return el
  }
}


```

### File: onecx-shell-ui/src/app/shell/utils/styles/shell-styles.utils.ts

```ts

import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import {
  dataStyleIdAttribute,
  dataStyleIsolationAttribute,
  isCssScopeRuleSupported,
  shellScopeId
} from '@onecx/angular-utils'
import { addStyleToHead, replaceRootWithScope } from '@onecx/angular-utils/style'
import { markElement } from './style-data.utils'

export async function fetchShellStyles(http: HttpClient) {
  return await firstValueFrom(http.request('get', `./shell-styles.css`, { responseType: 'text' }))
}

export function loadShellStyles(css: string) {
  if (isCssScopeRuleSupported()) {
    const styleElement = addStyleToHead(
      `
      @scope([${dataStyleIdAttribute}="${shellScopeId}"]) to ([${dataStyleIsolationAttribute}]) {
          ${replaceRootWithScope(css)}
        }
      `,
      {
        shellStylesStyles: ''
      }
    )
    markElement(styleElement, 'shellStylesStyles')
  } else {
    const styleElement = addStyleToHead(
      `
      @supports (@scope([${dataStyleIdAttribute}="${shellScopeId}"]) to ([${dataStyleIsolationAttribute}])) {
          ${replaceRootWithScope(css)}
          }
      `,
      {
        shellStylesStyles: ''
      }
    )
    ;(styleElement as any).onecxOriginalCss = css
    markElement(styleElement, 'shellStylesStyles')
  }
}


```

### File: onecx-shell-ui/src/app/shell/utils/styles/style-changes-listener.utils.ts

```ts

import { updateAngularComponentsStyles } from './update-angular-components-styles.utils'
import { updateRequiredWrappingStyles } from './update-required-wrapping-styles.utils'

/**
 * Registers a listener that utilizes MutationObserver to validate styles added to the document head.
 *
 * Whenever new style element, containing Angular component styles, is added to head of the document, this initializer is going to replace PrimeNg prefix of all CSS variables with the scopeId of the application.
 *
 * The listener assumes that the style element containing the "_nghost" attribute is Angular component style.
 *
 * The listener finds the scopeId data by looking for "_nghost" owner and looking for the closest styleId element.
 */
export async function styleChangesListenerInitializer() {
  const observer = new MutationObserver((mutationList: MutationRecord[]) => updateStyles(mutationList))
  observer.observe(document.head, {
    childList: true
  })
}

function updateStyles(mutationList: MutationRecord[]) {
  updateAngularComponentsStyles(mutationList)
  updateRequiredWrappingStyles(mutationList)
}


```

### File: onecx-shell-ui/src/app/shell/utils/styles/style-data.utils.ts

```ts

import {
  dataIntermediateMfeElementKey,
  dataIntermediateNoPortalLayoutStylesKey,
  dataIntermediateStyleIdKey,
  dataMfeElementKey,
  dataNoPortalLayoutStylesKey,
  dataStyleIdKey,
  dataStyleIsolationKey
} from '@onecx/angular-utils'

interface StyleData {
  styleId: string | undefined
  noPortalLayoutStyles: string | undefined
  mfeElement: string | undefined
}

export const dataWrapperElementAttribute = 'data-dynamic-wrapper-element'
export const dataWrapperElementKey = 'dynamicWrapperElement'

/**
 * Marks an element with a specific value for tracking purposes.
 * @param element - The element to be marked.
 * @param value - The value to mark the element with.
 */
export function markElement(element: any, value: string) {
  element.onecx ??= {}
  element.onecx.markers ??= []
  element.onecx.markers.push(value)
}

/**
 * Wraps an HTMLElement a div element with style data attributes.
 * @param element HTMLElement to wrap
 * @param styleData StyleData object containing style information.
 * @returns A new HTMLElement that wraps the original element with style data attributes.
 */
export function wrapWithDiv(element: HTMLElement, styleData?: StyleData) {
  const dataStyleWrapper = createWrapper(styleData)

  dataStyleWrapper.appendChild(element)
  observeStyleDataWrapper(dataStyleWrapper)
  return dataStyleWrapper
}

/**
 * Creates a wrapper element with style data attributes.
 * @param styleData StyleData object containing style information.
 * @returns A new HTMLElement that wraps the style data.
 */
export function createWrapper(styleData?: StyleData) {
  const wrapper = document.createElement('div')
  wrapper.dataset[dataWrapperElementKey] = ''
  styleData && appendStyleData(wrapper, styleData)

  return wrapper
}

/**
 * Observes a wrapper element for child changes and removes it if it has no children.
 * @param wrapper HTMLElement to observe for child changes
 * Creates a MutationObserver that listens for childList changes on the wrapper element.
 * If the wrapper has no children after a change, it removes itself and disconnects the observer
 * to prevent further observations.
 */
export function observeStyleDataWrapper(wrapper: HTMLElement) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && wrapper.childNodes.length === 0) {
        wrapper.remove()
        observer.disconnect()
      }
    })
  })

  observer.observe(wrapper, { childList: true })
}

/**
 * Finds the closest parent element with style data.
 * @param element HTMLElement to search from
 * @returns The closest parent element with style data, the element itself if it has style data or null if no style data is found.
 */
export function findStyleDataWrapper(element: HTMLElement): HTMLElement | null {
  let currentNode = element
  while (currentNode.dataset[dataWrapperElementKey] !== '' && currentNode.parentElement) {
    currentNode = currentNode.parentElement
  }
  if (currentNode.dataset[dataWrapperElementKey] === '') {
    return currentNode
  }
  return null
}

/**
 * Recursively removes style data from an element and its children.
 * @param element HTMLElement to remove style data from.
 */
export function removeStyleDataRecursive(element: HTMLElement): void {
  if (element.dataset) {
    delete element.dataset[dataStyleIsolationKey]
    delete element.dataset[dataStyleIdKey]
    delete element.dataset[dataNoPortalLayoutStylesKey]
    delete element.dataset[dataMfeElementKey]
  }

  for (const child of Array.from(element.children)) {
    child instanceof HTMLElement && removeStyleDataRecursive(child)
  }
}

/**
 * Appends style data to an element.
 * @param element HTMLElement to append style data to.
 * @param styleData StyleData object containing style information.
 */
export function appendStyleData(element: HTMLElement, styleData: StyleData): void {
  element.dataset[dataStyleIsolationKey] = ''

  if (styleData.styleId) {
    element.dataset[dataStyleIdKey] = styleData.styleId
  }
  if (styleData.noPortalLayoutStyles || styleData.noPortalLayoutStyles === '') {
    element.dataset[dataNoPortalLayoutStylesKey] = styleData.noPortalLayoutStyles
  }
  if (styleData.mfeElement || styleData.mfeElement === '') {
    element.dataset[dataMfeElementKey] = styleData.mfeElement
  }
}

/**
 * Appends intermediate style data to an element.
 * @param element HTMLElement to append style data to.
 * @param styleData StyleData object containing style information.
 */
export function appendIntermediateStyleData(element: HTMLElement, styleData: StyleData): void {
  element.dataset[dataIntermediateStyleIdKey] = ''

  if (styleData.styleId) {
    element.dataset[dataIntermediateStyleIdKey] = styleData.styleId
  }
  if (styleData.noPortalLayoutStyles || styleData.noPortalLayoutStyles === '') {
    element.dataset[dataIntermediateNoPortalLayoutStylesKey] = styleData.noPortalLayoutStyles
  }
  if (styleData.mfeElement || styleData.mfeElement === '') {
    element.dataset[dataIntermediateMfeElementKey] = styleData.mfeElement
  }
}

/**
 * Gets the style data from an element or its intermediate style data if it exists.
 * @param element HTMLElement to get style data from
 * @returns StyleData object or null if no style data is found.
 */
export function getStyleDataOrIntermediateStyleData(element: Node | EventTarget): StyleData | null {
  const styleElement = findElementWithStyleDataOrIntermediateStyleData(element)
  if (!styleElement) return null

  return {
    styleId: styleElement.dataset[dataStyleIdKey] ?? styleElement.dataset[dataIntermediateStyleIdKey],
    noPortalLayoutStyles:
      styleElement.dataset[dataNoPortalLayoutStylesKey] ??
      styleElement.dataset[dataIntermediateNoPortalLayoutStylesKey],
    mfeElement: styleElement.dataset[dataMfeElementKey] ?? styleElement.dataset[dataIntermediateMfeElementKey]
  }
}

/**
 * Finds the closest parent element with style data or intermediate style data.
 * @param startNode Starting node to search from
 * @returns The closest parent element with style data or intermediate style data, or null if not found.
 */
export function findElementWithStyleDataOrIntermediateStyleData(startNode: Node | EventTarget): HTMLElement | null {
  let currentNode = startNode
  const hasStyleData = (node: HTMLElement) => node.dataset[dataStyleIdKey] || node.dataset[dataIntermediateStyleIdKey]
  while (currentNode instanceof HTMLElement && !hasStyleData(currentNode) && currentNode.parentElement) {
    currentNode = currentNode.parentElement
  }
  return currentNode instanceof HTMLElement && hasStyleData(currentNode) ? currentNode : null
}


```

### File: onecx-shell-ui/src/app/shell/utils/styles/update-angular-components-styles.utils.ts

```ts

import { dataNoPortalLayoutStylesKey, dataStyleIdKey, replacePrimengPrefix } from '@onecx/angular-utils'

/**
 * Updates styles of Angular components added to the document head.
 *
 * Affects only styles that:
 * - are Angular component styles (contain "_nghost" attribute).
 * - have styleId defined.
 * - do not have noPortalLayoutStyles defined.
 * - require PrimeNg prefix replacement.
 * @param mutationList
 */
export function updateAngularComponentsStyles(mutationList: MutationRecord[]) {
  const newComponentStyleNodes = mutationList
    .flatMap((mutation) => Array.from(mutation.addedNodes))
    .filter((node) => isAngularComponentStyle(node))

  newComponentStyleNodes.forEach((node) => {
    if (!node.textContent) {
      return
    }

    const { styleId, noPortalLayoutStyles } = getStyleDataFromNodeContent(node.textContent)
    if (!styleId || !doesStyleDataRequireReplacement(styleId, noPortalLayoutStyles)) {
      return
    }

    node.textContent = replacePrimengPrefix(node.textContent, styleId)
  })
}

function doesStyleDataRequireReplacement(styleId: string | null, noPortalLayoutStyles: string | null | undefined) {
  if (!styleId) return false

  return noPortalLayoutStyles === ''
}

function isAngularComponentStyle(node: Node): boolean {
  return node.textContent?.includes('[_nghost') ?? false
}

function getStyleDataFromNodeContent(nodeContent: string): {
  styleId: string | null
  noPortalLayoutStyles: string | null | undefined
} {
  const ngHostAttribute = getNgHostAttributeFromNodeContent(nodeContent)
  if (!ngHostAttribute)
    return {
      styleId: null,
      noPortalLayoutStyles: null
    }

  const ngHostElement = getElementWithNgHostAttribute(ngHostAttribute)
  if (!ngHostElement)
    return {
      styleId: null,
      noPortalLayoutStyles: null
    }

  return getScopeDataForElement(ngHostElement)
}

function getNgHostAttributeFromNodeContent(css: string): string | null {
  const ngHostAttributeRegex = /_nghost-([^\]]*)/
  const ngHostAttributeMatch = css.match(ngHostAttributeRegex) // NOSONAR
  if (ngHostAttributeMatch) {
    return ngHostAttributeMatch[0]
  }

  return null
}

function getElementWithNgHostAttribute(ngHostAttribute: string): HTMLElement | null {
  return document.querySelector(`[${ngHostAttribute}]`)
}

function getScopeDataForElement(element: HTMLElement): {
  styleId: string | null
  noPortalLayoutStyles: string | null | undefined
} {
  let currentElement: HTMLElement | null = element
  while (currentElement) {
    if (currentElement.dataset[dataStyleIdKey])
      return {
        styleId: currentElement.dataset[dataStyleIdKey],
        noPortalLayoutStyles: currentElement.dataset[dataNoPortalLayoutStylesKey]
      }
    currentElement = currentElement.parentElement
  }
  return {
    styleId: null,
    noPortalLayoutStyles: null
  }
}


```

### File: onecx-shell-ui/src/app/shell/utils/styles/update-required-wrapping-styles.utils.ts

```ts

import { dataStyleIdAttribute, dataStyleIsolationAttribute, isCssScopeRuleSupported } from '@onecx/angular-utils'
import { replaceRootAndHtmlWithScope } from '@onecx/angular-utils/style'
import { MARKED_FOR_WRAPPING, MARKED_AS_WRAPPED } from './shared-styles-host-overwrites.utils'

/**
 * Updates styles that require wrapping added to the document head.
 *
 * Affects only styles that:
 * - have attribute MARKED_FOR_WRAPPING defined
 * - are not already wrapped by scope or supports rules
 * - are not already wrapped by nghost attributes
 * @param mutationList - list of mutations to process
 */
export function updateRequiredWrappingStyles(mutationList: MutationRecord[]) {
  const newStyleNodesRequiringWrapping = mutationList
    .flatMap((mutation) => Array.from(mutation.addedNodes))
    .filter((node) => doesStyleRequireWrapping(node))

  newStyleNodesRequiringWrapping.forEach((node) => {
    if (!node.textContent) {
      markAsWrapped(node)
      return
    }

    const styleElement = node as HTMLStyleElement
    const markedForWrapping = styleElement.dataset[MARKED_FOR_WRAPPING]
    if (!markedForWrapping) {
      markAsWrapped(node)
      return
    }

    replaceAndWrapStyle(styleElement, markedForWrapping)
  })
}

/**
 * Checks if style requires wrapping.
 *
 * Style requires wrapping if it contains attribute MARKED_FOR_WRAPPING.
 * @param node - node to check
 * @returns {boolean} whether style requires wrapping
 */
function doesStyleRequireWrapping(node: Node): boolean {
  // Check if node is style node and contains attribute called MARKED_FOR_WRAPPING
  if (node.nodeName !== 'STYLE') {
    return false
  }

  const styleElement = node as HTMLStyleElement
  const markedForWrapping = styleElement.dataset[MARKED_FOR_WRAPPING]
  return !!markedForWrapping
}

/**
 * Deletes the MARKED_FOR_WRAPPING attribute from the style element and adds MARKED_AS_WRAPPED attribute.
 * @param styleElement - style element to mark
 */
function markAsWrapped(styleElement: Node) {
  if (styleElement.nodeName !== 'STYLE') {
    return
  }

  const styleEl = styleElement as HTMLStyleElement
  delete styleEl.dataset[MARKED_FOR_WRAPPING]
  styleEl.dataset[MARKED_AS_WRAPPED] = ''
}

/**
 * Replaces and wraps style content with scope rule.
 * @param styleElement - style element to replace
 * @param styleId - style id to use for wrapping
 * @returns {void}
 */
function replaceAndWrapStyle(styleElement: HTMLStyleElement, styleId: string) {
  if (!styleElement.textContent || isStyleWrapped(styleElement, styleId)) {
    markAsWrapped(styleElement)
    return
  }

  const newStyleElement = document.createElement('style')
  if (isCssScopeRuleSupported()) {
    const content = `
      @scope([${dataStyleIdAttribute}="${styleId}"]) to ([${dataStyleIsolationAttribute}]) {
        ${replaceRootAndHtmlWithScope(styleElement.textContent)}
      }
      `
    newStyleElement.appendChild(document.createTextNode(content))
  } else {
    const content = `
      @supports(@scope([${dataStyleIdAttribute}="${styleId}"]) to ([${dataStyleIsolationAttribute}])) {
        ${replaceRootAndHtmlWithScope(styleElement.textContent)}
      }
      `
    newStyleElement.appendChild(document.createTextNode(content))
    ;(newStyleElement as any).onecxOriginalCss = styleElement.textContent
  }

  copyDataset(styleElement.dataset, newStyleElement.dataset)
  markAsWrapped(newStyleElement)

  styleElement.replaceWith(newStyleElement)
}

/**
 * Checks if style is already wrapped.
 *
 * Style is considered wrapped if:
 * - it contains Angular component styles ([_nghost] attribute)
 * - it is marked as wrapped via MARKED_AS_WRAPPED attribute
 * - it contains scope rule for the given styleId
 * - it contains supports rule for the given styleId (in case scope rules are not supported)
 * @param styleElement
 * @param styleId
 * @returns {boolean} whether style is already wrapped
 */
function isStyleWrapped(styleElement: HTMLStyleElement, styleId: string): boolean {
  if (styleElement.textContent?.includes('[_nghost') || styleElement.dataset[MARKED_AS_WRAPPED] !== undefined) {
    return true
  }
  if (isCssScopeRuleSupported()) {
    return styleElement.textContent?.includes(`@scope([${dataStyleIdAttribute}="${styleId}"]`) ?? false
  } else {
    return styleElement.textContent?.includes(`@supports(@scope([${dataStyleIdAttribute}="${styleId}"]`) ?? false
  }
}

/**
 * Copies dataset from source to target.
 * @param source - source dataset
 * @param target - target dataset
 */
function copyDataset(source: DOMStringMap, target: DOMStringMap) {
  Object.keys(source).forEach((key) => {
    target[key] = source[key]
  })
}


```

## Folder: onecx-shell-ui/src/app/shell/web-component-loader (2 files)

### File: onecx-shell-ui/src/app/shell/web-component-loader/webcomponent-loader.component.ts

```ts

import { AfterContentInit, Component, ElementRef, ViewChild } from '@angular/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import { dataMfeElementKey } from '@onecx/angular-utils'
import { firstValueFrom } from 'rxjs'
import { dataStyleIdKey, dataStyleIsolationKey } from 'src/scope-polyfill/utils'

@Component({
  standalone: false,
  template: '<div class="webcomponentwrapper" #wrapper></div>'
})
export class WebcomponentLoaderComponent implements AfterContentInit {
  @ViewChild('wrapper', { read: ElementRef, static: true })
  wrapper?: ElementRef

  constructor(private readonly appStateService: AppStateService) {}

  async ngAfterContentInit() {
    const currentMfe = await firstValueFrom(this.appStateService.currentMfe$.asObservable())

    if (!currentMfe.elementName) throw new Error('elementName is missing in the configuration')

    const styleId = `${currentMfe.productName}|${currentMfe.appId}`

    const element = document.createElement(currentMfe.elementName)
    element.dataset[dataStyleIdKey] = styleId
    element.dataset[dataStyleIsolationKey] = ''
    element.dataset[dataMfeElementKey] = ''
    this.wrapper?.nativeElement.appendChild(element)
  }
}


```

### File: onecx-shell-ui/src/app/shell/web-component-loader/webcomponent-loader.module.ts

```ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebcomponentLoaderComponent } from './webcomponent-loader.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [WebcomponentLoaderComponent],
  imports: [
    CommonModule,
    [
      RouterModule.forChild([
        { path: '**', component: WebcomponentLoaderComponent },
      ]),
    ],
  ],
})
export class WebcomponentLoaderModule {}


```

## Folder: onecx-shell-ui/src/assets/api (1 files)

### File: onecx-shell-ui/src/assets/api/openapi-bff.yaml

```yaml

---
openapi: 3.0.3
info:
  title: onecx-shell-bff
  description: Backend-For-Frontend (BFF) service for OneCX Shell. This API provides base configuration information for frontends.
  version: 1.0.0
  contact:
    email: tkit_dev@1000kit.org
  license:
    name: Apache 2.0
    url: http://www.apache.org/licenses/LICENSE-2.0.html
servers:
  - url: http://onecx-shell-bff:8080/
paths:
  /workspaceConfig:
    post:
      x-onecx:
        permissions:
          workspaceConfig:
            - read
      tags:
        - "WorkspaceConfig"
      description: Load all data needed by startup of OneCX UI (components, routes, slots, theme, workspace)
      operationId: loadWorkspaceConfig
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoadWorkspaceConfigRequest'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LoadWorkspaceConfigResponse'
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
        '404':
          description: 'Not Found'
  /workspaceConfig/themes/{name}/favicon:
    get:
      x-onecx:
        permissions:
          workspaceConfig:
            - read
      tags:
        - "WorkspaceConfig"
      description: Load favicon by theme name
      operationId: getThemeFaviconByName
      parameters:
        - name: name
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: OK
          content:
            image/x-icon:
              schema:
                minimum: 1
                maximum: 110000
                type: string
                format: binary
        404:
          description: Not found

  /workspaceConfig/themes/{name}/logo:
    get:
      x-onecx:
        permissions:
          workspaceConfig:
            - read
      tags:
        - "WorkspaceConfig"
      description: Load logo by theme name
      operationId: getThemeLogoByName
      parameters:
        - name: name
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: OK
          content:
            image/*:
              schema:
                minimum: 1
                maximum: 110000
                type: string
                format: binary
        404:
          description: Not found
  /parameters:
    post:
      x-onecx:
        permissions:
          parameter:
            - read
      tags:
        - parameter
      operationId: getParameters
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GetParametersRequest'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetParametersResponse'
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
  /userProfile:
    get:
      x-onecx:
        permissions:
          userProfile:
            - read
      tags:
        - userProfile
      operationId: getUserProfile
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetUserProfileResponse'
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
        '404':
          description: 'Not Found'

  /permissions:
    post:
      x-onecx:
        permissions:
          permission:
            - read
      tags:
        - permission
      operationId: getPermissions
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GetPermissionsRequest'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetPermissionsResponse'
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
        '404':
          description: 'Not Found'
components:
  schemas:
    GetParametersRequest:
      type: object
      required:
        - products
      properties:
        products:
          type: object
          additionalProperties:
            uniqueItems: true
            type: array
            items:
              type: string
    GetParametersResponse:
      type: object
      required:
        - products
      properties:
        products:
          type: object
          additionalProperties:
            type: object
            additionalProperties:
              type: array
              items:
                $ref: '#/components/schemas/Parameter'
    Parameter:
      type: object
      required:
        - name
        - applicationId
        - productName
        - value
      properties:
        displayName:
          type: string
        description:
          type: string
        applicationId:
          type: string
        productName:
          type: string
        name:
          type: string
        value:
          $ref: '#/components/schemas/ParameterValue'
        importValue:
          $ref: '#/components/schemas/ParameterValue'
    ParameterValue:
      oneOf:
        - type: string
        - type: number
        - type: boolean
        - type: integer
        - type: object
    LoadWorkspaceConfigRequest:
      type: object
      required:
        - path
      properties:
        path:
          type: string
    LoadWorkspaceConfigResponse:
      type: object
      required:
        - 'routes'
        - 'theme'
        - 'workspace'
        - 'components'
        - 'slots'
      properties:
        routes:
          type: array
          items:
            $ref: '#/components/schemas/Route'
        theme:
          $ref: '#/components/schemas/Theme'
        workspace:
          $ref: '#/components/schemas/Workspace'
        components:
          type: array
          items:
            $ref: '#/components/schemas/RemoteComponent'
        slots:
          type: array
          items:
            $ref: '#/components/schemas/Slot'
    Slot:
      type: object
      required:
        - 'name'
        - 'components'
      properties:
        name:
          type: string
        components:
          type: array
          items:
            type: string
    GetPermissionsRequest:
      type: object
      required:
        - appId
        - productName
      properties:
        appId:
          type: string
        productName:
          type: string
    Workspace:
      type: object
      required:
        - name
        - baseUrl
      properties:
        displayName:
          type: string
        name:
          type: string
        baseUrl:
          type: string
        homePage:
          type: string
    Theme:
      required:
      - name
      - properties
      type: object
      properties:
        displayName:
          type: string
        name:
          minLength: 2
          type: string
        cssFile:
          type: string
        description:
          type: string
        assetsUrl:
          type: string
        logoUrl:
          type: string
        faviconUrl:
          type: string
        previewImageUrl:
          type: string
        assetsUpdateDate:
          type: string
        properties:
          type: string
    Route:
      type: object
      required:
        - 'url'
        - 'baseUrl'
        - 'remoteEntryUrl'
        - 'type'
        - 'exposedModule'
        - 'appId'
        - 'productName'
        - 'productVersion'
        - 'pathMatch'
        - 'displayName'
      properties:
        url:
          type: string
        baseUrl:
          type: string
        remoteEntryUrl:
          type: string
        appId:
          type: string
        productName:
          type: string
        productVersion:
          type: string
        technology:
          $ref: '#/components/schemas/Technologies'
        exposedModule:
          type: string
        pathMatch:
          $ref: '#/components/schemas/PathMatch'
        remoteName:
          type: string
        elementName:
          type: string
        displayName:
          type: string
        endpoints:
          type: array
          items:
            $ref: '#/components/schemas/UIEndpoint'
    UIEndpoint:
      type: object
      properties:
        path:
          type: string
        name:
          type: string
    Technologies:
      type: string
      enum: ['Angular', 'WebComponent', 'WebComponentScript', 'WebComponentModule' ]
    PathMatch:
      type: string
      enum: ['full', 'prefix']
    RemoteComponent:
      type: object
      required:
        - 'name'
        - 'url'
        - 'baseUrl'
        - 'remoteEntryUrl'
        - 'exposedModule'
        - 'appId'
        - 'productName'
      properties:
        name:
          type: string
        baseUrl:
          type: string
        remoteEntryUrl:
          type: string
        appId:
          type: string
        productName:
          type: string
        productVersion:
          type: string
        exposedModule:
          type: string
        remoteName:
          type: string
        elementName:
          type: string
        technology:
          $ref: '#/components/schemas/Technologies'
    GetUserProfileResponse:
      type: object
      required:
        - 'userProfile'
      properties:
        userProfile:
          $ref: '#/components/schemas/UserProfile'
    UserProfile:
      type: object
      required:
        - 'userId'
        - 'person'
      properties:
        userId:
          type: string
        organization:
          type: string
        issuer:
          type: string
        tenantId:
          type: string
        person:
          $ref: '#/components/schemas/UserPerson'
        accountSettings:
          $ref: '#/components/schemas/AccountSettings'
        settings:
          type: object
    UserPerson:
      type: object
      properties:
        firstName:
          type: string
        lastName:
          type: string
        displayName:
          type: string
        email:
          type: string
        address:
          $ref: '#/components/schemas/UserPersonAddress'
        phone:
          $ref: '#/components/schemas/UserPersonPhone'
    UserPersonAddress:
      type: object
      properties:
        street:
          type: string
        streetNo:
          type: string
        city:
          type: string
        postalCode:
          type: string
        country:
          type: string
    UserPersonPhone:
      type: object
      properties:
        type:
          $ref: '#/components/schemas/PhoneType'
        number:
          type: string
    PhoneType:
      type: string
      enum: ['MOBILE', 'LANDLINE']
    AccountSettings:
      type: object
      properties:
        layoutAndThemeSettings:
          $ref: '#/components/schemas/LayoutAndThemeSettings'
        localeAndTimeSettings:
          $ref: '#/components/schemas/LocaleAndTimeSettings'
    LayoutAndThemeSettings:
      type: object
      properties:
        colorScheme:
          $ref: '#/components/schemas/ColorScheme'
        menuMode:
          $ref: '#/components/schemas/MenuMode'
    ColorScheme:
      type: string
      enum: ['AUTO', 'LIGHT', 'DARK']
    MenuMode:
      type: string
      enum: ['HORIZONTAL', 'STATIC', 'OVERLAY', 'SLIM', 'SLIMPLUS']
    LocaleAndTimeSettings:
      type: object
      properties:
        locale:
          type: string
        timezone:
          type: string
    GetPermissionsResponse:
      type: object
      required:
        - permissions
      properties:
        permissions:
          type: array
          items:
            type: string
    ProblemDetailResponse:
      type: object
      properties:
        errorCode:
          type: string
        detail:
          type: string
        params:
          type: array
          items:
            $ref: '#/components/schemas/ProblemDetailParam'
        invalidParams:
          type: array
          items:
            $ref: '#/components/schemas/ProblemDetailInvalidParam'
    ProblemDetailParam:
      type: object
      properties:
        key:
          type: string
        value:
          type: string
    ProblemDetailInvalidParam:
      type: object
      properties:
        name:
          type: string
        message:
          type: string

```

## Folder: onecx-shell-ui/src/assets (2 files)

### File: onecx-shell-ui/src/assets/env.json

```json

{
  "APP_BASE_HREF": "${APP_BASE_HREF}",
  "KEYCLOAK_REALM": "${KEYCLOAK_REALM}",
  "KEYCLOAK_URL": "${KEYCLOAK_URL}",
  "KEYCLOAK_CLIENT_ID": "${KEYCLOAK_CLIENT_ID}",
  "APP_VERSION": "${APP_VERSION}",
  "IS_SHELL": true,
  "AUTH_SERVICE": "${AUTH_SERVICE}",
  "AUTH_SERVICE_CUSTOM_URL": "${AUTH_SERVICE_CUSTOM_URL}",
  "AUTH_SERVICE_CUSTOM_MODULE_NAME": "${AUTH_SERVICE_CUSTOM_MODULE_NAME}",
  "AUTH_SERVICE_CUSTOM_BFF_URL": "${AUTH_SERVICE_CUSTOM_BFF_URL}",
  "ONECX_PORTAL_SEARCH_BUTTONS_REVERSED": "${ONECX_PORTAL_SEARCH_BUTTONS_REVERSED}",
  "POLYFILL_SCOPE_MODE": "${POLYFILL_SCOPE_MODE}"
}


```

### File: onecx-shell-ui/src/assets/silent-check-sso.html

```html

<!DOCTYPE html>
<html lang="en">
  <head>
    <title></title>
  </head>
  <body>
    <script>
      parent.postMessage(location.href, location.origin);
    </script>
  </body>
</html>


```

## Folder: onecx-shell-ui/src/assets/i18n (2 files)

### File: onecx-shell-ui/src/assets/i18n/de.json

```json

{
  "SHELL": "",
  "ERROR_MESSAGES": {
    "ON_REMOTE_LOAD_ERROR": "Teile der Anwendung konnten nicht geladen werden."
  },
  "LOGOUT": "Abmelden",
  "LOGOUT.TOOLTIP": "Abmelden und zur Anmeldeseite wechseln",
  "WELCOME": {
    "TITLE": "Hallo"
  },
  "NOT_FOUND_PAGE": {
    "TITLE": "Die Seite konnte nicht gefunden werden.",
    "DETAILS": "Die Seite, auf die Sie zugreifen mÃ¶chten, ist im aktuellen Workspace nicht vorhanden.",
    "ACTION": "Workspace Startseite",
    "ACTION.TOOLTIP": "Zur Workspace Startseite wechseln"
  },
  "ERROR_PAGE": {
    "TITLE": "Die Seite konnte nicht geladen werden.",
    "DETAILS": "Versuchen Sie es erneut oder kontaktieren Sie einen Workspace Administrator.",
    "REQUESTED_PAGE": "Angefragte Seite:",
    "ACTION": "Neuladen",
    "ACTION.TOOLTIP": "Die Seite erneut aufrufen."
  },
  "INITIALIZATION_ERROR_PAGE": {
    "TITLE": "Fehler bei der Initialisierung des Workspaces",
    "SUBTITLE": "Bitte kontaktieren Sie einen Workspace Administrator mit den folgenden Informationen:",
    "SECTION": "Fehlermeldung",
    "DETAILS": {
      "MESSAGE": "Fehlermeldung",
      "REQUESTED_URL": "Aufgerufene URL",
      "DETAILS": "Details",
      "ERRORCODE": "Fehlercode",
      "INVALID_PARAMS": "UngÃ¼ltige Parameter",
      "PARAMS": "Parameter"
    }
  },
  "OCX_HEADER": {
    "HEADER_LEFT": "Kopfzeile links",
    "HEADER_CENTER": "Kopfzeile mitte",
    "HEADER_RIGHT": "Kopfzeile rechts"
  }
}


```

### File: onecx-shell-ui/src/assets/i18n/en.json

```json

{
  "SHELL": "",
  "ERROR_MESSAGES": {
    "ON_REMOTE_LOAD_ERROR": "Parts of the application could not be loaded."
  },
  "LOGOUT": "Log out",
  "LOGOUT.TOOLTIP": "Log out and go to Login Page",
  "WELCOME": {
    "TITLE": "Hello"
  },
  "NOT_FOUND_PAGE": {
    "TITLE": "Page not found",
    "DETAILS": "The page you tried to access does not exist in the current Workspace.",
    "ACTION": "Workspace Home",
    "ACTION.TOOLTIP": "Go to Workspace Home page"
  },
  "ERROR_PAGE": {
    "TITLE": "Something went wrong",
    "DETAILS": "The page you tried to access could not be loaded. Please try again or contact a Workspace administrator.",
    "REQUESTED_PAGE": "Requested page:",
    "ACTION": "Reload",
    "ACTION.TOOLTIP": "Reload of the requested page."
  },
  "INITIALIZATION_ERROR_PAGE": {
    "TITLE": "Something went wrong during Workspace initialization.",
    "SUBTITLE": "Please contact a Workspace administrator with the following information:",
    "SECTION": "Error Message",
    "DETAILS": {
      "MESSAGE": "Error message",
      "REQUESTED_URL": "Requested URL",
      "DETAILS": "Details",
      "ERRORCODE": "Error code",
      "INVALID_PARAMS": "Invalid parameter",
      "PARAMS": "Parameter"
    }
  },
  "OCX_HEADER": {
    "HEADER_LEFT": "Header left",
    "HEADER_CENTER": "Header center",
    "HEADER_RIGHT": "Header right"
  }
}


```

## Folder: onecx-shell-ui/src (4 files)

### File: onecx-shell-ui/src/bootstrap.ts

```ts

import { bootstrapModule } from '@onecx/angular-webcomponents'
import { Capability, ShellCapabilityService } from '@onecx/angular-integration-interface'
import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

ShellCapabilityService.setCapabilities([
  Capability.PARAMETERS_TOPIC,
  Capability.CURRENT_LOCATION_TOPIC,
  Capability.ACTIVENESS_AWARE_MENUS
])
bootstrapModule(AppModule, 'shell', environment.production)


```

### File: onecx-shell-ui/src/index.html

```html

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>OneCX Portal</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII="
      rel="icon"
      type="image/x-icon"
    />
    <!-- Force browser to use only light mode -->
    <style>
      :root {
        color-scheme: only light !important;
      }
    </style>
  </head>
  <body>
    <ocx-shell-root data-style-isolation data-style-id="shell-ui" data-no-portal-layout-styles></ocx-shell-root>
    <div class="splash">
      <div class="splash-content flex flex-column align-items-center gap-2">
        <h1>Welcome</h1>
        <svg class="splash-loader" width="60px" height="60px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
          <circle
            class="splash-path"
            fill="none"
            stroke-width="6"
            stroke-linecap="round"
            cx="33"
            cy="33"
            r="25"
          ></circle>
        </svg>
      </div>
    </div>
  </body>
</html>


```

### File: onecx-shell-ui/src/main.ts

```ts

import {
  angular18Preloader,
  angular19Preloader,
  angular20Preloader,
  ensurePreloaderModuleLoaded,
  loadPreloaderModule
} from './app/shell/utils/preloader.utils'

window['onecxPreloaders'] ??= {}
const preloaders = [angular18Preloader, angular19Preloader, angular20Preloader]

Promise.all([...preloaders.map(loadPreloaderModule), ...preloaders.map(ensurePreloaderModuleLoaded)]).then(() => {
  return import('./bootstrap').catch((err) => console.error(err))
})


```

### File: onecx-shell-ui/src/test-setup.ts

```ts

const teo = {
  teardown: {
    destroyAfterEach: false,
    rethrowErrors: true
  },
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true
}

// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: teo
}

// deprecated
import 'jest-preset-angular/setup-jest'

/*
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone/index.mjs'

setupZoneTestEnv(teo)
*/


```

## Folder: onecx-shell-ui/src/environments (1 files)

### File: onecx-shell-ui/src/environments/environment.ts

```ts

export const environment = {
  KEYCLOAK_CLIENT_ID: 'onecx-shell-ui-client',
  KEYCLOAK_URL: 'http://keycloak-app/',
  KEYCLOAK_REALM: 'onecx',
  skipRemoteConfigLoad: true,
  production: false,
  APP_VERSION: 'Local Shell Version'
}


```

## Folder: onecx-shell-ui/src/scope-polyfill (4 files)

### File: onecx-shell-ui/src/scope-polyfill/css-style-sheet-updater.ts

```ts

import { MutationData, OcxCSSStyleSheet, SelectorPresenceMap } from './data'
import {
  animationNameValueRegex,
  appendToUniqueSelectors,
  computeRootSelectorsForElements,
  findSupportsRule,
  matchScope,
  normalize,
  removePseudoElements,
  scopeFromToUniqueId,
  splitSelectorToSubSelectors,
  supportsConditionTextToScopeRuleText
} from './utils'

export class CssStyleSheetHandler {
  //-------------------------Scope sheet creation-------------------------
  /**
   * Transforms style sheet to scoped style sheet that implements the OcxCSSStyleSheet interface.
   */
  static changeToScopedSheet(sheetWithSupportsRule: CSSStyleSheet) {
    const supportsRule = findSupportsRule(sheetWithSupportsRule)
    if (!supportsRule) {
      console.warn('Expected style sheet with supports rule, but received one without any.')
      return
    }

    const [match, from, to] = matchScope(supportsConditionTextToScopeRuleText(supportsRule.conditionText)) ?? []
    if (!match) {
      console.warn('Expected to have a scoped sheet for:', sheetWithSupportsRule)
      return
    }
    // Save data about the scope so we can access it later and not recompute
    // Save data about the scope so we can access it later and not recompute
    // @typescript-eslint/no-extra-semi
    ;(sheetWithSupportsRule as OcxCSSStyleSheet).ownerNode.ocxMatch = normalize(match)
    ;(sheetWithSupportsRule as OcxCSSStyleSheet).ownerNode.ocxFrom = normalize(from)
    ;(sheetWithSupportsRule as OcxCSSStyleSheet).ownerNode.ocxTo = normalize(to)
    ;(sheetWithSupportsRule as OcxCSSStyleSheet).ownerNode.ocxScopeUniqueId = scopeFromToUniqueId(normalize(from))
    ;(sheetWithSupportsRule as OcxCSSStyleSheet).ownerNode.ocxKeyFrames = []

    this.moveSupportsRulesToTopLevelAndApplyInitialScope(sheetWithSupportsRule as OcxCSSStyleSheet)
  }

  /**
   * Deconstructs supports css rule so every scoped rule is available in the browser in a scoped manner initially with references to 0 elements.
   */
  private static moveSupportsRulesToTopLevelAndApplyInitialScope(sheet: OcxCSSStyleSheet) {
    const supportsRule = findSupportsRule(sheet)
    if (!supportsRule) return

    sheet.deleteRule(Array.from(sheet.cssRules).findIndex((rule) => rule === supportsRule))
    for (const supportsChildRule of Array.from(supportsRule.cssRules)) {
      sheet.insertRule(
        this.createSheetDefaultRuleText(supportsChildRule, sheet),
        sheet.cssRules.length <= 0 ? 0 : sheet.cssRules.length
      )
    }

    // Save the original selector data for making updates
    for (const rule of Array.from(sheet.cssRules)) {
      this.setOcxSelectorText(rule)
    }
  }

  private static createSheetDefaultRuleText(rule: CSSRule, sheet: OcxCSSStyleSheet) {
    if (rule instanceof CSSLayerBlockRule) {
      return this.createSheetDefaultLayerRuleText(rule, sheet)
    } else if (rule instanceof CSSMediaRule) {
      return this.createSheetDefaultMediaRuleText(rule, sheet)
    } else if (rule instanceof CSSKeyframesRule) {
      return this.createSheetDefaultKeyframesRuleText(rule, sheet)
    } else if ((rule as any).selectorText === undefined) {
      // Fallback to all Rules that are not covered
      return rule.cssText
    }

    return this.createSheetDefaultStyleRuleText(rule as CSSStyleRule & CSSGroupingRule, sheet)
  }

  private static createSheetDefaultLayerRuleText(rule: CSSLayerBlockRule, sheet: OcxCSSStyleSheet) {
    let layerCss = ''
    for (const layerChildRule of Array.from(rule.cssRules)) {
      const ruleText = this.createSheetDefaultRuleText(layerChildRule, sheet)
      layerCss = `${layerCss}${ruleText}`
    }
    return `@layer ${rule.name} {${layerCss}}`
  }

  private static createSheetDefaultMediaRuleText(rule: CSSMediaRule, sheet: OcxCSSStyleSheet) {
    let mediaCss = ''
    for (const mediaChildRule of Array.from(rule.cssRules)) {
      const ruleText = this.createSheetDefaultRuleText(mediaChildRule, sheet)
      mediaCss = `${mediaCss}${ruleText}`
    }
    return `@media ${rule.conditionText} {${mediaCss}}`
  }

  private static createSheetDefaultKeyframesRuleText(rule: CSSKeyframesRule, sheet: OcxCSSStyleSheet) {
    sheet.ownerNode.ocxKeyFrames.push(rule.name)
    return rule.cssText.replace(rule.name, this.applyScopeUniqueId(rule.name, sheet))
  }

  private static createSheetDefaultStyleRuleText(rule: CSSStyleRule & CSSGroupingRule, sheet: OcxCSSStyleSheet) {
    let childrenCss = ''
    for (const styleChildRule of Array.from(rule.cssRules).filter((rule) => rule.cssText)) {
      const ruleText = this.createSheetDefaultRuleText(styleChildRule, sheet)
      childrenCss = `${childrenCss}${ruleText}`
    }
    return this.constructStyleRuleText(rule, childrenCss, sheet)
  }

  private static constructStyleRuleText(rule: CSSStyleRule, childrenCss: string, sheet: OcxCSSStyleSheet) {
    if (childrenCss) {
      let ruleStyleText = rule.style.cssText
      if (ruleStyleText) ruleStyleText = this.applyAnimationChangesToCssText(ruleStyleText, sheet)
      return `${this.constructDefaultSelector(rule)} {${ruleStyleText}${childrenCss}}`
    }

    const updatedRuleText = rule.cssText.replace(rule.selectorText, this.constructDefaultSelector(rule))
    return this.applyAnimationChangesToCssText(updatedRuleText, sheet)
  }

  private static constructDefaultSelector(rule: CSSStyleRule) {
    if (rule.selectorText === ':scope') return `${rule.selectorText}:where(0)`
    return appendToUniqueSelectors(rule.selectorText, ':where(0)')
  }

  private static applyAnimationChangesToCssText(cssText: string, sheet: OcxCSSStyleSheet) {
    return cssText.replace(animationNameValueRegex, (match, p1) => {
      let animationName = p1
      if (sheet.ownerNode.ocxKeyFrames.includes(p1)) {
        animationName = this.applyScopeUniqueId(animationName, sheet)
      }
      return `animation-name: ${animationName}`
    })
  }

  private static applyScopeUniqueId(text: string, sheet: OcxCSSStyleSheet) {
    return `${text}-${sheet.ownerNode.ocxScopeUniqueId}`
  }

  private static setOcxSelectorText(rule: CSSRule) {
    const ruleSelectorText = (rule as any).selectorText
    if (ruleSelectorText) {
      const selectorText = this.constructOriginalSelector(ruleSelectorText)
      ;(rule as any).ocxSelectorText = selectorText
      ;(rule as any).ocxQuerySelectorText = removePseudoElements(selectorText)
    }
    for (const child of (rule as any).cssRules ?? []) {
      this.setOcxSelectorText(child)
    }
  }

  private static constructOriginalSelector(selectorText: string) {
    // Parse the current selector and remove any scoping
    if (selectorText === '') return ''

    let result = ''
    let depth = 0
    let i = 0
    while (i < selectorText.length) {
      if (selectorText.slice(i, i + 7) === ':where(') {
        if (i == 0 || [' ', '+', '>', '~'].includes(selectorText[i - 1])) {
          result += '*'
        }
        depth++
        i += 6 // Skip ':where('
      } else if (selectorText[i] === '(' && depth > 0) {
        depth++
      } else if (selectorText[i] === ')' && depth > 0) {
        depth--
      } else if (depth === 0) {
        result += selectorText[i]
      }
      i++
    }
    return result === '' ? '*' : result
  }
  //-------------------------Scope sheet creation-------------------------

  //-------------------------Scope sheet update-------------------------
  static updateScopedSheet(sheet: OcxCSSStyleSheet, mutationData: MutationData, cachedSelectors: SelectorPresenceMap) {
    const nodesMatchingFromSelector = Array.from(document.querySelectorAll(normalize(sheet.ownerNode.ocxFrom)))

    for (const cssRule of Array.from(sheet.cssRules)) {
      this.updateRule(cssRule, nodesMatchingFromSelector, sheet, mutationData, cachedSelectors)
    }

    // Mark sheet as updated by polyfill
    sheet.ownerNode.dataset['adaptedByPolyfillInMemory'] = ''
  }

  private static updateRule(
    cssRule: CSSRule,
    fromNodes: Element[],
    sheet: OcxCSSStyleSheet,
    mutationData: MutationData,
    cachedSelectors: SelectorPresenceMap
  ) {
    if (cssRule instanceof CSSLayerBlockRule) {
      this.updateLayerRule(cssRule, fromNodes, sheet, mutationData, cachedSelectors)
    } else if (cssRule instanceof CSSMediaRule) {
      this.updateMediaRule(cssRule, fromNodes, sheet, mutationData, cachedSelectors)
    } else if (cssRule instanceof CSSStyleRule) {
      this.updateStyleRule(cssRule as CSSStyleRule & CSSGroupingRule, fromNodes, sheet, mutationData, cachedSelectors)
    }
  }

  private static updateLayerRule(
    cssRule: CSSLayerBlockRule,
    fromNodes: Element[],
    sheet: OcxCSSStyleSheet,
    mutationData: MutationData,
    cachedSelectors: SelectorPresenceMap
  ) {
    for (const layerChildRule of Array.from(cssRule.cssRules)) {
      this.updateRule(layerChildRule, fromNodes, sheet, mutationData, cachedSelectors)
    }
  }

  private static updateMediaRule(
    cssRule: CSSMediaRule,
    fromNodes: Element[],
    sheet: OcxCSSStyleSheet,
    mutationData: MutationData,
    cachedSelectors: SelectorPresenceMap
  ) {
    for (const mediaChildRule of Array.from(cssRule.cssRules)) {
      this.updateRule(mediaChildRule, fromNodes, sheet, mutationData, cachedSelectors)
    }
  }

  /**
   * Validate if rule requires an update. If yes then find all elements in the scope that match the rule's selector and update the selector
   */
  private static updateStyleRule(
    cssRule: CSSStyleRule & CSSGroupingRule,
    fromNodes: Element[],
    sheet: OcxCSSStyleSheet,
    mutationData: MutationData,
    cachedSelectors: SelectorPresenceMap
  ) {
    const originalQuerySelectorText = (cssRule as any).ocxQuerySelectorText
    if (originalQuerySelectorText === undefined) return
    // Special case for styles that have to be applied for the @scope root
    if (originalQuerySelectorText === ':scope') {
      return this.updateScopeSelector(cssRule, fromNodes, sheet, mutationData, cachedSelectors)
    }

    if (
      mutationData.skipMutationCheck
        ? true
        : this.doesRuleRequireUpdate(originalQuerySelectorText, mutationData.mutatedElements, cachedSelectors)
    ) {
      this.updateElementsMatchingSelectorsInScope(cssRule, fromNodes, sheet)
      for (const child of Array.from(cssRule?.cssRules) ?? []) {
        this.updateRule(child, fromNodes, sheet, mutationData, cachedSelectors)
      }
    }
  }

  private static updateScopeSelector(
    cssRule: CSSStyleRule & CSSGroupingRule,
    fromNodes: Element[],
    sheet: OcxCSSStyleSheet,
    mutationData: MutationData,
    cachedSelectors: SelectorPresenceMap
  ) {
    // :scope selector has to be replaced with the selection of found @scope root elements
    // e.g., :scope {} -> :where(:nth-child(1) > :nth-child(2)) {}
    cssRule.selectorText = computeRootSelectorsForElements(fromNodes).join(', ')
    this.updateStyleRuleChildren(cssRule, fromNodes, sheet, mutationData, cachedSelectors)
  }

  private static updateStyleRuleChildren(
    cssRule: CSSStyleRule & CSSGroupingRule,
    fromNodes: Element[],
    sheet: OcxCSSStyleSheet,
    mutationData: MutationData,
    cachedSelectors: SelectorPresenceMap
  ) {
    for (const child of Array.from(cssRule?.cssRules) ?? []) {
      this.updateRule(child, fromNodes, sheet, mutationData, cachedSelectors)
    }
  }

  // If any subselector is fully matched the rule has to be updated
  private static doesRuleRequireUpdate(
    selectorText: string,
    mutatedElements: Element[],
    cachedSelectors: SelectorPresenceMap
  ): boolean {
    const subSelectorsList = splitSelectorToSubSelectors(selectorText)
    return subSelectorsList.some((subSelectorList) => {
      for (const subSelector of subSelectorList) {
        let isApplicable = cachedSelectors.get(subSelector)
        if (isApplicable === undefined) {
          isApplicable =
            mutatedElements.length === 0
              ? true
              : mutatedElements.some((element) => element.querySelector(subSelector) !== null)
          cachedSelectors.set(subSelector, isApplicable)
        }
        if (!isApplicable) return false
      }
      return true
    })
  }

  // Find all elements matching the selector in scope and replace rule selector
  private static updateElementsMatchingSelectorsInScope(
    cssStyleRule: CSSStyleRule,
    searchStartElements: Array<Element>,
    sheet: OcxCSSStyleSheet
  ) {
    const originalQuerySelectorText = (cssStyleRule as any).ocxQuerySelectorText
    const originalSelectorText = (cssStyleRule as any).ocxSelectorText
    const elementsMatchingSelector = searchStartElements
      .map((from) =>
        from.querySelectorAll(':is(' + originalQuerySelectorText + '):not(:scope :is(' + sheet.ownerNode.ocxTo + ') *)')
      )
      .flatMap((nodeList) => Array.from(nodeList))
    const elementsRootSelectors = computeRootSelectorsForElements(elementsMatchingSelector)
    const whereSelector = elementsRootSelectors.length > 0 ? elementsRootSelectors.join(', ') : '0'
    cssStyleRule.selectorText = appendToUniqueSelectors(originalSelectorText, `:where(${whereSelector})`)
  }
  //-------------------------Scope sheet update-------------------------
}


```

### File: onecx-shell-ui/src/scope-polyfill/data.ts

```ts

export interface CssStyleSheetWithSupportsRule {
  sheet: CSSStyleSheet
  ownerNode: HTMLElement
  supportsRule: CSSSupportsRule
}

export type SelectorPresenceMap = Map<string, boolean>
export type ScopeSelectorPresenceMap = Map<string, SelectorPresenceMap>

export interface OcxOwnerNode extends HTMLStyleElement {
  ocxMatch: string
  ocxFrom: string
  ocxTo: string
  ocxScopeUniqueId: string
  ocxKeyFrames: string[]
}

export interface OcxCSSStyleSheet extends CSSStyleSheet {
  ownerNode: OcxOwnerNode
}

export interface MutationData {
  mutatedElements: Element[]
  skipMutationCheck: boolean
}


```

### File: onecx-shell-ui/src/scope-polyfill/polyfill.ts

```ts

import { CssStyleSheetHandler } from './css-style-sheet-updater'
import { OcxCSSStyleSheet, OcxOwnerNode, ScopeSelectorPresenceMap, SelectorPresenceMap } from './data'
import {
  dataStyleIdKey,
  containsSupportsRule,
  isScopedStyleSheet,
  mutationListToUniqueNodes,
  nodeToStyleIdSelectors,
  normalize,
  findSupportsRule,
  matchScope,
  supportsConditionTextToScopeRuleText
} from './utils'

const scopedSheetNodes = new Set()

/**
 * Applies if PRECISION mode is selected:
 * Scope polyfill is used when browser doesn't support @scope rule. This mode is performance-heavy but precise.
 */
export function applyPrecisionPolyfill() {
  applyScopePolyfill()
  overrideHtmlElementAppendAndClassChanges()
}

/**
 * Apply the scope polyfill.
 * The polyfill updates all scoped style sheets on a page based on the observed changes to the body of the document.
 * Any change in body of the document and its children related to attributes and the whole tree will cause the update.
 *
 * The polyfill assumes that:
 * - single style sheet is related to a single scope
 * - style sheet scoping is expressed by using the supports css rule wrapping scope supports rule, e.g., "@supports (@scope([data-style-id="shell-ui"]) to ([data-style-isolation]))"
 */
export function applyScopePolyfill() {
  if (typeof CSSScopeRule === 'undefined') {
    const observer = new MutationObserver((mutationList: MutationRecord[]) => updateStyleSheets(mutationList))
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true
    })
  }
}

/**
 * Applies if PERFORMANCE mode (default) is selected:
 * Does not use polyfill and allows potential leakage to reduce performance-heavy operations
 * Applies styles on the elements that are defined as "from" section of the @scope rule (e.g., "[data-style-id="shell-ui"][data-no-portal-layout-styles]")
 */
export function applyPerformancePolyfill() {
  if (typeof CSSScopeRule === 'undefined') {
    const observer = new MutationObserver((mutationList: MutationRecord[]) => {
      updateStyleSheetsForPerformanceMode(mutationList)
    })
    observer.observe(document.head, {
      subtree: true,
      childList: true,
      attributes: true
    })
    deconstructExistingStyleSheets()
  }
}

function updateStyleSheetsForPerformanceMode(mutationList: MutationRecord[]) {
  const styleElements = getStyleElementsToCheck(mutationList)
  for (const styleElement of styleElements) {
    deconstructScopeRule(styleElement)
  }
}

function getStyleElementsToCheck(mutationList: MutationRecord[]) {
  const styleElements: HTMLStyleElement[] = []
  for (const mutation of mutationList) {
    const nodesToCheck = [...Array.from(mutation.addedNodes), mutation.target]
    for (const node of nodesToCheck) {
      if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'STYLE') {
        styleElements.push(node as HTMLStyleElement)
      }
    }
  }
  return styleElements
}

/**
 * Deletes @supports rule from style sheet and reinserts rules at right position with matched scope as selector
 */
function deconstructScopeRule(styleElement: HTMLStyleElement) {
  if (!styleElement.sheet || !containsSupportsRule(styleElement.sheet)) return

  const supportsRule = findSupportsRule(styleElement.sheet)
  if (!supportsRule) return

  const [match, from] = matchScope(supportsConditionTextToScopeRuleText(supportsRule.conditionText)) ?? []
  if (!match) {
    console.warn('Expected to have a scoped sheet for:', styleElement.sheet)
    return
  }
  if (!(styleElement as any).onecxOriginalCss) {
    return legacyDeconstructScopeRule(styleElement.sheet, supportsRule, from)
  }

  return originalCssBasedDeconstructScopeRule(styleElement, supportsRule, from)
}

/**
 * This function operates on the original css that was used to create the style element.
 * It replaces :root with & and wraps all rules with the selector coming from the @scope rule.
 * The rules that cannot be wrapped (e.g., CSSKeyFramesRule and CSSFontFaceRule) are reinserted as they are on the top of the style sheet.
 *
 * Its important that this function will create a new style sheet and remove the old one. Without that operation some style will not be applied correctly (e.g., border shorthand).
 * @param styleElement - HTMLStyleElement
 * @param supportsRule - CSSSupportsRule that contains the @scope rule
 * @param fromSelector - selector coming from the @scope rule (e.g., [data-style-id="shell-ui"])
 */
function originalCssBasedDeconstructScopeRule(
  styleElement: HTMLStyleElement,
  supportsRule: CSSSupportsRule,
  fromSelector: string
) {
  if (!styleElement.sheet) return
  const originalCss = (styleElement as any).onecxOriginalCss as string

  // Construct new style element with available selector and original css with :root replaced with & and unwrappable rules extracted from supports rule to the top of the style sheet
  const actualCss = originalCss.replace(/(:root|html)\b/g, '&')
  const newStyleElement = document.createElement('style')
  const unwrappableRulesContent = Array.from(supportsRule.cssRules)
    .filter(isUnwrappableRule)
    .map((r) => r.cssText)
    .join('')
  const fromSelectorWithWhere = `:where(${fromSelector})`
  const newStyleContent = `${unwrappableRulesContent} ${fromSelectorWithWhere} {${actualCss}}`
  newStyleElement.appendChild(document.createTextNode(newStyleContent))

  // Remove old style element
  document.head.removeChild(styleElement)

  // Copy attributes from old style element to new one
  const attributes = styleElement.attributes
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes.item(i)
    if (attr) {
      newStyleElement.setAttribute(attr.name, attr.value)
    }
  }
  // Insert new style element
  document.head.appendChild(newStyleElement)
}

/**
 * This function operates on the CSSStyleSheet and deconstructs the @supports rule by deleting it and reinserting all rules inside the @supports rule.
 * Each rule that can be wrapped inside a selector (e.g., CSSStyleRule) is wrapped with the selector coming from the @scope rule.
 * @param sheet - CSSStyleSheet
 * @param supportsRule - CSSSupportsRule that contains the @scope rule
 * @param fromSelector - selector coming from the @scope rule (e.g., [data-style-id="shell-ui"])
 */
function legacyDeconstructScopeRule(sheet: CSSStyleSheet, supportsRule: CSSSupportsRule, fromSelector: string) {
  sheet.deleteRule(Array.from(sheet.cssRules).findIndex((rule) => rule === supportsRule))
  for (const rule of Array.from(supportsRule.cssRules)) {
    const index = sheet.cssRules.length <= 0 ? 0 : sheet.cssRules.length
    if (isWrappableRule(rule)) {
      const wrappedRuleText = rule.cssText.replace(/:scope/g, '&')
      const wrapped = `${normalize(fromSelector)} {${wrappedRuleText}}`
      sheet.insertRule(wrapped, index)
    } else {
      sheet.insertRule(rule.cssText, index)
    }
  }
}

function deconstructExistingStyleSheets() {
  const styleNodes = document.head.querySelectorAll('style')
  styleNodes.forEach((style) => deconstructScopeRule(style))
}

/**
 * Returns true if css rule can be wrapped inside a selector (e.g. CSSKeyFramesRule and CSSFontFaceRule can not be nested inside a selector)
 */
function isWrappableRule(rule: CSSRule) {
  return !(rule instanceof CSSKeyframesRule || rule instanceof CSSFontFaceRule)
}

/**
 * Returns true if css rule can not be wrapped inside a selector (e.g. CSSKeyFramesRule and CSSFontFaceRule can not be nested inside a selector)
 */
function isUnwrappableRule(rule: CSSRule) {
  return !isWrappableRule(rule)
}

/**
 * Ensures that all scoped style sheets are updated by the polyfill on the following events:
 * - HTMLElement.appendChild call
 * - HTMLElement.className call
 * - HTMLElement.classList's method calls
 *
 * This function overrides mentioned functionalities of all HTMLElement constructed on a page by overriding the HTMLElement.prototype
 */
export function overrideHtmlElementAppendAndClassChanges() {
  if (typeof CSSScopeRule === 'undefined') {
    overrideHtmlElementAppend()
    overrideHtmlElementClassChanges()
  }
}

/**
 * Creates an object compatible with NodeList interface based on the provided nodes.
 */
export function createNodeList(nodes: Node[]) {
  return {
    nodes: nodes,
    length: nodes.length,
    item: function (index: number) {
      return this.nodes[index]
    },
    forEach: function (callback: any) {
      this.nodes.forEach(callback)
    },
    [Symbol.iterator]: function () {
      let index = 0
      const nodes = this.nodes
      return {
        next: function () {
          if (index < nodes.length) {
            return { value: nodes[index++], done: false }
          } else {
            return { done: true }
          }
        }
      }
    }
  } as any as NodeList
}

/**
 * Updates scoped style sheets. Scope style sheet is a style sheet that was already transformed by this polyfill that implements OcxCSSStyleSheet interface.
 *
 * This function will transform new style sheets containing supports css rule to a style sheet that is understandable by all browsers that do not support the scope css rule.
 * After that operation, the style sheet will be considered updated if necessary.
 *
 * Based on the provided mutations this function will select a subset of scoped style sheets that require an update.
 *
 * An update for a style sheet consists of:
 * - Finding the HTML sections affected by the scope of the style sheet
 * - Updates css rules so each css style rule (e.g., ".custom-class { background-color: 'blue' }") has updated css selector with a path to all usages of the rule with the usage of the :where and :nth-child css selectors (e.g., ".custom-class:where(:nth-child(1) > :nth-child(2)) { background-color: 'blue' }"). Presented example means: apply "background-color: 'blue'" style to an HTMLElement that has "class='custom-class'" and is the second child of the first child of the root element.
 */
export function updateStyleSheets(mutationList: MutationRecord[]) {
  const nodesFromMutationList = mutationListToUniqueNodes(mutationList)
  if (nodesFromMutationList.length === 0) return

  const styleElements = document.styleSheets
  // Find what scope needs to be updated so no unnecessary updates are made
  const distinctStyleIdSelectors = getChangedStyleIdSelectors(mutationList)
  const scopeSelectorsCache: ScopeSelectorPresenceMap = new Map<string, Map<string, boolean>>()
  for (const sheet of Array.from(styleElements)) {
    if (containsSupportsRule(sheet)) {
      CssStyleSheetHandler.changeToScopedSheet(sheet)
      setupStyleNodeObserver(sheet as OcxCSSStyleSheet)
    }
    if (isScopedStyleSheet(sheet)) {
      if (isSelectorInChangedList(sheet.ownerNode.ocxFrom, distinctStyleIdSelectors)) {
        if (!scopeSelectorsCache.has(sheet.ownerNode.ocxMatch)) {
          scopeSelectorsCache.set(sheet.ownerNode.ocxMatch, new Map())
        }
        executeManualUpdateOfStyleSheet(
          sheet,
          nodesFromMutationList,
          scopeSelectorsCache.get(sheet.ownerNode.ocxMatch) ?? new Map()
        )
      }
    }
  }
}

function overrideHtmlElementAppend() {
  const originalAppend = HTMLElement.prototype.appendChild
  HTMLElement.prototype.appendChild = function (newChild: any): any {
    const result = originalAppend.call(this, newChild)
    updateStyleSheets([
      {
        type: 'childList',
        target: this,
        addedNodes: createNodeList([newChild]),
        attributeName: null,
        attributeNamespace: null,
        nextSibling: null,
        oldValue: null,
        previousSibling: null,
        removedNodes: createNodeList([])
      } as MutationRecord
    ])
    return result
  }
}

function overrideHtmlElementClassChanges() {
  const originalClassNameSetter = (HTMLElement.prototype as any).__lookupSetter__('className')

  Object.defineProperty(HTMLElement.prototype, 'className', {
    set: function (val) {
      let result
      if (originalClassNameSetter) {
        result = originalClassNameSetter.call(this, val)
      }
      updateStyleSheetsForClassChange(this)
      return result
    }
  })

  const originalClassListGetter = (HTMLElement.prototype as any).__lookupGetter__('classList')

  Object.defineProperty(HTMLElement.prototype, 'classList', {
    get: function () {
      const classList = originalClassListGetter.call(this)
      classList.ocxHtmlElement = this
      return classList
    },
    configurable: true
  })

  const domTokenListOriginalAdd = DOMTokenList.prototype.add

  DOMTokenList.prototype.add = function (...tokens: string[]) {
    const result = domTokenListOriginalAdd.call(this, ...tokens)
    const element = (this as any).ocxHtmlElement
    if (element) updateStyleSheetsForClassChange(element)
    return result
  }

  const domTokenListOriginalRemove = DOMTokenList.prototype.remove

  DOMTokenList.prototype.remove = function (...tokens: string[]) {
    const result = domTokenListOriginalRemove.call(this, ...tokens)
    const element = (this as any).ocxHtmlElement
    if (element) updateStyleSheetsForClassChange(element)
    return result
  }

  const domTokenListOriginalReplace = DOMTokenList.prototype.replace

  DOMTokenList.prototype.replace = function (token: string, newToken: string) {
    const result = domTokenListOriginalReplace.call(this, token, newToken)
    const element = (this as any).ocxHtmlElement
    if (element) updateStyleSheetsForClassChange(element)
    return result
  }

  const domTokenListOriginalToggle = DOMTokenList.prototype.toggle

  DOMTokenList.prototype.toggle = function (token: string, force: boolean | undefined) {
    const result = domTokenListOriginalToggle.call(this, token, force)
    const element = (this as any).ocxHtmlElement
    if (element) updateStyleSheetsForClassChange(element)
    return result
  }
}

function updateStyleSheetsForClassChange(element: Node) {
  updateStyleSheets([
    {
      type: 'attributes',
      target: element,
      addedNodes: createNodeList([]),
      attributeName: 'class',
      attributeNamespace: null,
      nextSibling: null,
      oldValue: null,
      previousSibling: null,
      removedNodes: createNodeList([])
    } as MutationRecord
  ])
}

/**
 * Returns if selector is in list of changed selector list
 */
function isSelectorInChangedList(selector: string, changedStyleIdSelectorList: Array<string>) {
  return changedStyleIdSelectorList.some((styleIdSelector) => normalize(styleIdSelector) === normalize(selector))
}

/**
 * Find what scope that need to be updated based on the mutationList
 */
function getChangedStyleIdSelectors(mutationList: MutationRecord[]) {
  const set = new Set<string>()
  for (const mutation of mutationList) {
    // If mutation was made to the body, we assume that its addition or removal of the wrapper
    if (mutation.target === document.body) {
      const styleIdSelectors = getChangedStyleIdSelectorForWrapper(mutation)
      styleIdSelectors && styleIdSelectors.forEach((selector) => set.add(selector))
      continue
    }

    // Find closest element with scope data
    let currentNode: HTMLElement | null = mutation.target as HTMLElement
    while (currentNode && isNotChildOfBodyAndHasNoStyleId(currentNode)) {
      currentNode = currentNode.parentElement
    }
    if (!currentNode) continue
    const styleIdSelectors = nodeToStyleIdSelectors(currentNode)
    styleIdSelectors && styleIdSelectors.forEach((selector) => set.add(selector))
  }

  return Array.from(set)
}

/**
 * Find style id for body change based on added and removed nodes
 */
function getChangedStyleIdSelectorForWrapper(record: MutationRecord) {
  const node = (record.addedNodes.item(0) ?? record.removedNodes.item(0)) as HTMLElement
  if (!node) return null

  return nodeToStyleIdSelectors(node)
}

function isNotChildOfBodyAndHasNoStyleId(node: Node) {
  return node.parentElement !== document.body && !(node as any)?.dataset[dataStyleIdKey]
}

/**
 * Create observer for style sheet node updates
 */
function setupStyleNodeObserver(sheet: OcxCSSStyleSheet) {
  const sheetNode = sheet.ownerNode
  if (sheetNode && !scopedSheetNodes.has(sheetNode)) {
    scopedSheetNodes.add(sheetNode)
    // Create an observer for the new style sheet
    const sheetObserver = new MutationObserver(() => existingScopedSheetCallback(sheetNode))
    sheetObserver.observe(sheetNode, {
      characterData: true,
      childList: true,
      subtree: true
    })
  }
}

/**
 * Executes update of the style sheet
 */
function executeManualUpdateOfStyleSheet(
  sheet: OcxCSSStyleSheet,
  mutatedElements: Element[],
  selectorCache: SelectorPresenceMap,
  skipMutationCheck = false
) {
  CssStyleSheetHandler.updateScopedSheet(
    sheet,
    {
      mutatedElements: mutatedElements,
      skipMutationCheck: skipMutationCheck
    },
    selectorCache
  )
}

/**
 * Callback method to fire for existing style sheet content changes
 */
function existingScopedSheetCallback(element: OcxOwnerNode) {
  const cssStyleSheet = element.sheet as OcxCSSStyleSheet
  if (!cssStyleSheet) return

  updateScopedStyleForExistingSheet(cssStyleSheet)
}

/**
 * Handles update for a change in style sheet content
 */
function updateScopedStyleForExistingSheet(sheet: OcxCSSStyleSheet) {
  if (containsSupportsRule(sheet)) {
    CssStyleSheetHandler.changeToScopedSheet(sheet)
  }

  if (isScopedStyleSheet(sheet)) {
    executeManualUpdateOfStyleSheet(sheet, [], new Map(), true)
  }
}


```

### File: onecx-shell-ui/src/scope-polyfill/utils.ts

```ts

import { OcxCSSStyleSheet } from './data'

// Duplicate definitions for some constants because cannot import libs in polyfill
export const shellScopeId = 'shell-ui'

export const dataStyleIdKey = 'styleId'
export const dataMfeElementKey = 'mfeElement'
export const dataStyleIsolationKey = 'styleIsolation'
export const dataNoPortalLayoutStylesKey = 'noPortalLayoutStyles'
export const dataIntermediateStyleIdKey = 'intermediateStyleId'
export const dataIntermediateMfeElementKey = 'intermediateMfeElement'
export const dataIntermediateStyleIsolationKey = 'intermediateStyleIsolation'
export const dataIntermediateNoPortalLayoutStylesKey = 'intermediateNoPortalLayoutStyles'
export const dataStyleIdAttribute = 'data-style-id'
export const dataMfeElementAttribute = 'data-mfe-element'
export const dataStyleIsolationAttribute = 'data-style-isolation'
export const dataNoPortalLayoutStylesAttribute = 'data-no-portal-layout-styles'
export const dataIntermediateStyleIdAttribute = 'data-intermediate-style-id'
export const dataIntermediateMfeElementAttribute = 'data-intermediate-mfe-element'
export const dataIntermediateStyleIsolationAttribute = 'data-intermediate-style-isolation'
export const dataIntermediateNoPortalLayoutStylesAttribute = 'data-intermediate-no-portal-layout-styles'

export const portalLayoutStylesSheetId = `[${dataStyleIdAttribute}]:not([${dataNoPortalLayoutStylesAttribute}])`
export const dynamicPortalLayoutStylesSheetId = `body>:not([${dataNoPortalLayoutStylesAttribute}])`
export const shellStylesSheetId = `[${dataStyleIdAttribute}="${shellScopeId}"]`

// eslint-disable-next-line no-useless-escape
export const animationNameValueRegex = /animation-name:\s*([^\;]*)/
const everythingNotACharacterOrNumberRegex = /[^a-zA-Z0-9-]/g
// eslint-disable-next-line no-useless-escape
const pseudoElementsRegex = /::[a-zA-Z\-]*[\s\{\:]?/g
/**
 * Maps mutationRecord list to unique nodes that were changed
 */
export function mutationListToUniqueNodes(mutationList: MutationRecord[]) {
  const set = new Set<Element>()
  for (const mutation of mutationList) {
    let nodes: Element[] = []
    if (mutation.type === 'attributes') nodes = attributeMutationToNodes(mutation)
    else {
      nodes = childMutationToNodes(mutation)
    }

    nodes.forEach((node) => set.add(node))
  }
  return Array.from(set)
}

/**
 * Returns if style sheet contains supports rule with scope
 * */
export function containsSupportsRule(sheet: CSSStyleSheet) {
  return Array.from(sheet.cssRules).filter((rule) => rule instanceof CSSSupportsRule).length > 0
}

/**
 * Returns the supports rule from a style sheet or null
 */
export function findSupportsRule(sheet: CSSStyleSheet) {
  return Array.from(sheet.cssRules).find((rule) => rule instanceof CSSSupportsRule) as CSSSupportsRule
}

/**
 * Returns if style sheet is a OneCX scoped style sheet
 */
export function isScopedStyleSheet(sheet: CSSStyleSheet): sheet is OcxCSSStyleSheet {
  return (sheet.ownerNode as any).ocxMatch !== undefined
}

/**
 * Finds a match for scope rule in a text.
 */
export function matchScope(content: string): RegExpMatchArray | null {
  const scopeRegex =
    // eslint-disable-next-line no-useless-escape
    /@scope\s*\((.*)(?=\)\s*)\)\s*to\s*\((.*)(?=\)\s*)\)/
  return scopeRegex.exec(content)
}

/**
 * Removes pseudo elements (without parameters) from a selector.
 *
 * Example: ".pi-chevron-right::before" -> ".pi-chevron-right"
 */
export function removePseudoElements(selectorText: string) {
  const matches = selectorText.match(pseudoElementsRegex)
  if (!matches) return selectorText

  let modifiedSelectorText = selectorText
  for (const match of matches) {
    const lastMatchChar = match[match.length - 1]
    modifiedSelectorText = modifiedSelectorText.replace(match, [' {:'].includes(lastMatchChar) ? lastMatchChar : '')
  }
  return modifiedSelectorText
}

/**
 * Appends a value to a selector before the first pseudo element.
 *
 * Example: ".pi::before" with value: ":where(:nth-child(1))" -> ".pi:where(:nth-child(1))::before"
 */
export function appendBeforeFirstPseudoElement(selectorText: string, valueToAppend: string): string {
  const pseudoElementIndex = selectorText.search(pseudoElementsRegex)
  if (pseudoElementIndex === -1) return `${selectorText}${valueToAppend}`

  return `${selectorText.substring(0, pseudoElementIndex)}${valueToAppend}${selectorText.substring(pseudoElementIndex, selectorText.length)}`
}

/**
 * Split selector into list of sub selectors.
 *
 * Example: ".pi, .pi .pi-chevron-right" -> [[".pi"], [".pi", ".pi pi-chevron-right"]]
 */
export function splitSelectorToSubSelectors(selectorText: string) {
  const uniqueSelectors = splitSelectorToUniqueSelectors(selectorText)
  const subSelectors: Array<Array<string>> = []
  for (const selector of uniqueSelectors) {
    const chunks = new SelectorToChunksMapper().map(selector)
    subSelectors.push(chunks)
  }
  return subSelectors
}

/**
 * Appends a value to each unique selector. Always appends before the first pseudo element.
 *
 * This is done because :where selector cannot be placed after pseudo elements like ::before because the selector is than invalid.
 *
 * Example: ".pi, .pi pi-chevron-right" with value: ":where(:nth-child(1))" -> ".pi:where(:nth-child(1)), .pi pi-chevron-right:where(:nth-child(1))"
 */
export function appendToUniqueSelectors(selectorText: string, valueToAppend: string) {
  return selectorText
    .split(',')
    .map((s) => appendBeforeFirstPseudoElement(s.trim(), valueToAppend))
    .join(',')
}

/**
 * Returns selector for all elements starting from root of the document using nth-child
 *
 * Example for first child of the root: ":root > :nth-child(1)"
 */
export function computeRootSelectorsForElements(elements: Array<Element>) {
  const selectors = []
  for (const element of elements) {
    const selector = computeRootSelectorForElement(element)
    selectors.push(`:root ${selector}`)
  }
  return selectors
}

/**
 * Remove white spaces, new lines, etc. from a string
 */
export function normalize(str: string): string {
  const newLineRegexGlobal = /\s+/g
  return str.replace(newLineRegexGlobal, '') ?? ''
}

/**
 * Map HTMLElement node to css selector based on the node dataset attributes.
 *
 * Returns:
 * - dynamic portal layout style selector for node with no information
 * - shell style selectors if node was in shell's scope
 * - portal layout styles selector if node was in app scope that needs portal layout styles
 * - found scope selector if node was in app scope that does not need portal layout styles
 */
export function nodeToStyleIdSelectors(node: HTMLElement) {
  const styleId = node.dataset[dataStyleIdKey]
  const noPortalLayoutStyles = node.dataset[dataNoPortalLayoutStylesKey] === ''

  // Node without styleId means it must have been added dynamically
  if (!styleId) {
    return [dynamicPortalLayoutStylesSheetId]
  }

  if (styleId === shellScopeId) {
    return [
      `[${dataStyleIdAttribute}="${shellScopeId}"]`,
      `[${dataStyleIdAttribute}="${shellScopeId}"][${dataNoPortalLayoutStylesAttribute}]`
    ]
  }

  const appStyles = `[${dataStyleIdAttribute}="${styleId}"]:is([${dataNoPortalLayoutStylesAttribute}], [${dataMfeElementAttribute}])`
  const primengAppStyles = `[${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]`

  return noPortalLayoutStyles ? [appStyles, primengAppStyles] : [appStyles, portalLayoutStylesSheetId]
}

/**
 * Map scope css rule from section to a unique style scope id
 */
export function scopeFromToUniqueId(from: string) {
  if (from === portalLayoutStylesSheetId) {
    return 'portal-layout-styles'
  } else if (from === dynamicPortalLayoutStylesSheetId) {
    return 'dynamic-portal-layout-styles'
  }

  const styleIdMatch = /\[data-style-id="([^"]+)"/.exec(from)
  return styleIdMatch ? styleIdMatch[1].replace(everythingNotACharacterOrNumberRegex, '-') : ''
}

/**
 * Map mutation type 'attribute' to elements
 */
function attributeMutationToNodes(mutation: MutationRecord): Element[] {
  return takeTargeNodeParentIfExistElseTargetNode(mutation)
}

/**
 * Map mutation type 'children' to elements
 */
function childMutationToNodes(mutation: MutationRecord) {
  let nodes: Element[] = []
  if (mutation.target === document.body) {
    return bodyMutationToNodes(mutation)
  }

  if (mutation.addedNodes.length > 0) {
    nodes = mutationWithAddedNodesToNodes(mutation)
  }
  if (mutation.removedNodes.length > 0) {
    nodes = mutationWithRemovedNodesToNodes(mutation)
  }

  return nodes
}

/**
 * Map mutation made to body element to elements
 */
function bodyMutationToNodes(mutation: MutationRecord) {
  return [...Array.from(mutation.addedNodes), ...Array.from(mutation.removedNodes)].filter(
    (node): node is Element => node.nodeType === Node.ELEMENT_NODE
  )
}

/**
 * Map mutation with added nodes to elements
 */
function mutationWithAddedNodesToNodes(mutation: MutationRecord) {
  return takeTargeNodeParentIfExistElseTargetNode(mutation)
}

/**
 * Map mutation with removed nodes to elements
 */
function mutationWithRemovedNodesToNodes(mutation: MutationRecord) {
  return Array.from(mutation.removedNodes).filter((n): n is Element => n.nodeType === Node.ELEMENT_NODE)
}

/**
 * Returns mutation's target node parent or target node
 */
function takeTargeNodeParentIfExistElseTargetNode(mutation: MutationRecord) {
  if (mutation.target.parentElement) {
    return mutation.target.parentElement.nodeType === Node.ELEMENT_NODE
      ? [mutation.target.parentElement as Element]
      : []
  }
  return mutation.target.nodeType === Node.ELEMENT_NODE ? [mutation.target as Element] : []
}

/**
 * Returns selector list from selector by splitting them via comma
 */
function splitSelectorToUniqueSelectors(selectorText: string) {
  return selectorText.split(',').map((s) => s.trim())
}

/**
 * Mapper class for mapping css selectors into sub selector chunks
 */
class SelectorToChunksMapper {
  currentSelector = ''
  chunks: string[] = []
  inPseudo = false
  pseudoDepth = 0

  private reset() {
    this.currentSelector = ''
    this.chunks = []
    this.inPseudo = false
  }

  private mapOpeningBrace() {
    this.inPseudo = true
    this.pseudoDepth++
    this.currentSelector += '('
  }

  private mapClosingBrace() {
    if (this.inPseudo) {
      this.pseudoDepth--
      if (this.pseudoDepth === 0) this.inPseudo = false
    }
    this.currentSelector += ')'
  }

  private mapHash(previousCharacter: string) {
    this.mapDotOrHash(previousCharacter, '#')
  }

  private mapDot(previousCharacter: string) {
    this.mapDotOrHash(previousCharacter, '.')
  }

  private mapDotOrHash(previousCharacter: string, character: string) {
    if (!this.inPseudo && previousCharacter !== ' ') {
      this.currentSelector && this.chunks.push(this.currentSelector)
    }
    this.currentSelector += character
  }

  private mapSpace() {
    if (!this.inPseudo) {
      this.chunks.push(this.currentSelector)
    }
    this.currentSelector += ' '
  }

  private mapPlus(selectorText: string, iterator: number) {
    return this.mapPlusArrowRightOrTilde(selectorText, '+', iterator)
  }

  private mapArrowRight(selectorText: string, iterator: number) {
    return this.mapPlusArrowRightOrTilde(selectorText, '>', iterator)
  }

  private mapTilde(selectorText: string, iterator: number) {
    return this.mapPlusArrowRightOrTilde(selectorText, '~', iterator)
  }

  private mapPlusArrowRightOrTilde(selectorText: string, character: string, iterator: number) {
    this.currentSelector =
      selectorText[iterator - 1] === ' ' ? this.chunks[this.chunks.length - 1] + ' ' : this.currentSelector
    this.currentSelector += character + ' '
    while (selectorText[++iterator] == ' ' && iterator < selectorText.length);
    iterator--
    return iterator
  }

  /**
   * Maps css selector to sub selector chunks
   */
  map(selectorText: string) {
    this.reset()

    let i = 0
    while (i < selectorText.length) {
      const letter = selectorText[i]
      switch (letter) {
        case '(':
          this.mapOpeningBrace()
          break
        case ')':
          this.mapClosingBrace()
          break

        case '#':
          this.mapHash(selectorText[i - 1])
          break
        case '.':
          this.mapDot(selectorText[i - 1])
          break
        case ' ':
          this.mapSpace()
          break

        case '+':
          i = this.mapPlus(selectorText, i)
          break
        case '>':
          i = this.mapArrowRight(selectorText, i)
          break
        case '~':
          i = this.mapTilde(selectorText, i)
          break

        default:
          this.currentSelector += letter
      }
      i++
    }

    if (
      this.chunks.length === 0 ||
      (this.chunks.length > 0 && this.chunks[this.chunks.length - 1] !== this.currentSelector)
    ) {
      this.chunks.push(this.currentSelector)
    }
    if (this.chunks.length > 0 && this.chunks[0] === '&') this.chunks.shift()
    return this.chunks
  }
}

/**
 * Returns selector for element starting from root of the document using nth-child
 *
 * Example for first child of the root: " > :nth-child(1)"
 */
function computeRootSelectorForElement(element: Element) {
  let currentElement: Element | null = element
  let selector = ''
  while (currentElement && currentElement !== document.body.parentElement) {
    const index = Array.prototype.indexOf.call(currentElement.parentElement?.children ?? [], currentElement)
    selector = ` > :nth-child(${index + 1}) ${selector}`
    currentElement = currentElement.parentElement
  }
  return selector
}


export function supportsConditionTextToScopeRuleText(conditionText: string) {
  // Removing braces from condition since its always wrapped with braces e.g., coditionText = (@scope(...))
  return conditionText.slice(1, -1)
}

```


