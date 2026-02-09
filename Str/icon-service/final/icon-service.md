# Shell Icon Service Code 

app.module.ts
```typescript
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { inject, NgModule, provideAppInitializer } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Router, RouterModule } from '@angular/router'
import { provideMissingTranslationHandler, provideTranslateLoader, provideTranslateService } from '@ngx-translate/core'
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
  MultiLanguageMissingTranslationHandler,
  OnecxTranslateLoader,
  provideTranslationPathFromMeta,
  SKIP_STYLE_SCOPING
} from '@onecx/angular-utils'
import { provideThemeConfig } from '@onecx/angular-utils/theme/primeng'

import { CurrentLocationTopic, EventsTopic, Theme, UserProfile } from '@onecx/integration-interface'

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
import { ImageRepositoryService } from './shell/services/image-repository.service'
import { ShellIconLoaderService } from './shell/services/icon-loader.services'

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

export function imageRepositoryServiceInitializer(imageRepositoryService: ImageRepositoryService) {
  imageRepositoryService.init()
}

const currentLocationTopic = new CurrentLocationTopic()

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
    currentLocationTopic.publish({
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
    currentLocationTopic.publish({
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
    currentLocationTopic.publish({
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
  console.log(`🎨 Applying theme: ${theme.name}`)
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
    PortalViewportComponent,
    GlobalErrorComponent,
    AppLoadingSpinnerComponent
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
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
    provideTranslateService({
      defaultLanguage: 'en',
      loader: provideTranslateLoader(OnecxTranslateLoader),
      missingTranslationHandler: provideMissingTranslationHandler(MultiLanguageMissingTranslationHandler)
    }),
    provideThemeConfig(),
    provideTokenInterceptor(),
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
    provideAppInitializer(() => {
      return imageRepositoryServiceInitializer(inject(ImageRepositoryService))
    }),
    { provide: SLOT_SERVICE, useExisting: SlotService },
    { provide: BASE_PATH, useValue: './shell-bff' },
    provideAppInitializer(() => {
      return inject(ShellIconLoaderService).init()
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

```


src > app > shell > services > TS icon-loader.services.ts
```typescript
import { inject, Injectable } from '@angular/core'
import { debounceTime, filter, firstValueFrom, tap } from 'rxjs'
import { generateClassName, IconRequested, OnecxIcon } from '@onecx/integration-interface'
import { IconService, ThemeService } from '@onecx/angular-integration-interface'
import { IconBffService } from 'src/app/shared/generated'

@Injectable({ providedIn: 'root' })
export class ShellIconLoaderService {
  private themeRefId?: string
  private readonly iconService = inject(IconService)
  private readonly iconBffService = inject(IconBffService)
  private readonly themeService = inject(ThemeService)

  private requestedTypes = new Map<string, Set<'svg' | 'background' | 'background-before'>>()

  init(): void {
    this.themeService.currentTheme$.asObservable().subscribe((t) => (this.themeRefId = t?.name))

    this.iconService.iconLoaderTopic
      .pipe(
        filter((m): m is IconRequested => m.type === 'IconRequested'),
        tap((m) => this.recordRequestedType(m.name, m.classType)),
        debounceTime(100)
      )
      .subscribe(() => this.loadIcons())
  }

  private async loadIcons() {
    if (!this.themeRefId) return

    const missingIcons = Object.entries(window.onecxIcons)
      .filter(([, v]) => v === undefined)
      .map(([name]) => name)

    if (missingIcons.length > 0) {
      await this.loadMissingIcons(missingIcons, this.themeRefId)
    }

    this.requestedTypes.forEach((types, name) => {
      const icon = window.onecxIcons[name]
      if (icon?.body) {
        types.forEach((t) => this.injectCss(name, t, icon.body))
      }
      this.requestedTypes.delete(name)
    })
    this.iconService.iconLoaderTopic.publish({ type: 'IconsReceived' })
  }

  private async loadMissingIcons(missingIcons: string[], refId: string): Promise<void> {
    const res = await firstValueFrom(this.iconBffService.findIconsByNamesAndRefId(refId, { names: missingIcons }))

    const iconMap = new Map<string, OnecxIcon>()
    res?.icons?.forEach((i) => iconMap.set(i.name, i))

    missingIcons.forEach((name) => {
      const icon = iconMap.get(name) ?? null
      window.onecxIcons[name] = icon
    })
  }

  private injectCss(iconName: string, classType: 'svg' | 'background' | 'background-before', svgBody: string): void {
    const className = generateClassName(iconName, classType)
    if (document.getElementById(className)) return

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${svgBody}</svg>`
    const encoded = btoa(svg)

    const style = document.createElement('style')
    style.id = className

    if (classType === 'svg') {
      style.textContent = this.getSvgCss(className, encoded)
    } else if (classType === 'background') {
      style.textContent = this.getBackgroundCss(className, encoded)
    } else {
      style.textContent = this.getBackgroundBeforeCss(className, encoded)
    }

    document.head.appendChild(style)
  }

  private getBackgroundBeforeCss(className: string, encoded: string): string | null {
    return `.${className}{
                    display:inline-flex;
                }
                .${className}::before{
                    content:'';
                    display:inline-block;
                    width:1em;
                    height:1em;
                    background:url("data:image/svg+xml;base64,${encoded}") center/contain no-repeat;
                }`
  }

  private getBackgroundCss(className: string, encoded: string): string | null {
    return `.${className}{
                    display:inline-block;
                    width:1em;
                    height:1em;
                    background:url("data:image/svg+xml;base64,${encoded}") center/contain no-repeat;
                }`
  }

  private getSvgCss(className: string, encoded: string): string | null {
    return `.${className}{
                    display:inline-block;
                    width:1em;
                    height:1em;
                    --onecx-icon:url("data:image/svg+xml;base64,${encoded}");
                    mask:var(--onecx-icon) no-repeat center/contain;
                    -webkit-mask:var(--onecx-icon) no-repeat center/contain;
                    background-color:currentColor;
                }`
  }

  private recordRequestedType(name: string, type: IconRequested['classType']) {
    this.requestedTypes.get(name)?.add(type) ?? this.requestedTypes.set(name, new Set([type]))
  }
}


```


src > app > shell > services > TS icon-loader.services.spec.ts
```typescript
import { TestBed } from '@angular/core/testing'
import { BehaviorSubject, Subject, of } from 'rxjs'
import { ShellIconLoaderService } from './icon-loader.services'
import { IconBffService } from 'src/app/shared/generated'
import { IconService, ThemeService } from '@onecx/angular-integration-interface'

jest.mock('@onecx/integration-interface', () => ({
  generateClassName: (name: string, classType: string) => `${name}-${classType}`
}))

describe('ShellIconLoaderService', () => {
  let service: ShellIconLoaderService

  const createIconLoaderTopic = () => {
    const subject = new Subject<any>()
    return {
      publish: (msg: any) => subject.next(msg),
      pipe: (...ops: any[]) => (subject as any).pipe(...ops),
      subscribe: (fn: any) => subject.subscribe(fn),
      _subject: subject
    } as any
  }

  let iconLoaderTopic: any
  let theme$: BehaviorSubject<{ name: string } | null>
  let mockBff: { findIconsByNamesAndRefId: jest.Mock }

  beforeEach(() => {
    jest.useFakeTimers()
    ;(window as any).onecxIcons = {}
    ;(globalThis as any).btoa = (str: string) => Buffer.from(str, 'binary').toString('base64')

    iconLoaderTopic = createIconLoaderTopic()
    theme$ = new BehaviorSubject<{ name: string } | null>(null)
    mockBff = {
      findIconsByNamesAndRefId: jest.fn((refId: string, { names }: { names: string[] }) =>
        of({ icons: names.map((n) => ({ name: n, body: '<path />' })) })
      )
    }

    TestBed.configureTestingModule({
      providers: [
        ShellIconLoaderService,
        { provide: IconService, useValue: { iconLoaderTopic } },
        { provide: IconBffService, useValue: mockBff },
        { provide: ThemeService, useValue: { currentTheme$: theme$ } }
      ]
    })

    service = TestBed.inject(ShellIconLoaderService)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should update themeRefId when theme changes after init', () => {
    service.init()
    theme$.next({ name: 'dark' })
    expect((service as any).themeRefId).toBe('dark')
  })

  it('should not call backend when themeRefId is undefined', async () => {
    service.init()

    const name = 'mdi:test'
    ;(window as any).onecxIcons[name] = undefined
    iconLoaderTopic.publish({ type: 'IconRequested', name, classType: 'svg' })

    jest.advanceTimersByTime(150)
    await Promise.resolve()

    expect(mockBff.findIconsByNamesAndRefId).not.toHaveBeenCalled()
  })

  it('should recordRequestedType creates and adds types without duplicates', () => {
    (service as any).recordRequestedType('a', 'svg')
    let types = (service as any).requestedTypes.get('a')
    expect(types?.has('svg')).toBe(true)
    ;(service as any).recordRequestedType('a', 'background')
    types = (service as any).requestedTypes.get('a')
    expect(types?.has('background')).toBe(true)
    ;(service as any).recordRequestedType('a', 'svg')
    expect((service as any).requestedTypes.get('a')?.size).toBe(2)
  })

  it('should not call backend when there are no missing icons', async () => {
    service.init()
    theme$.next({ name: 'default' })
    ;(window as any).onecxIcons['a'] = { name: 'a' }
    iconLoaderTopic.publish({ type: 'IconRequested', name: 'a', classType: 'svg' })

    jest.advanceTimersByTime(150)
    await Promise.resolve()

    expect(mockBff.findIconsByNamesAndRefId).not.toHaveBeenCalled()
  })

  it('should store null when backend returns no icon', async () => {
    service.init()
    theme$.next({ name: 'default' })
    ;(window as any).onecxIcons['missing'] = undefined
    mockBff.findIconsByNamesAndRefId.mockImplementation(() => of({ icons: [] }))

    iconLoaderTopic.publish({ type: 'IconRequested', name: 'missing', classType: 'svg' })
    jest.advanceTimersByTime(150)
    await Promise.resolve()

    expect((window as any).onecxIcons['missing']).toBeNull()
  })

  it('should injectCss be idempotent for the same class', () => {
    const spy = jest.spyOn(document.head, 'appendChild')
    ;(service as any).injectCss('x', 'svg', '<path />')
    ;(service as any).injectCss('x', 'svg', '<path />')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should clear requestedTypes after processing', async () => {
    service.init()
    theme$.next({ name: 'default' })
    ;(window as any).onecxIcons['a'] = undefined
    mockBff.findIconsByNamesAndRefId.mockImplementation(() => of({ icons: [{ name: 'a', body: '<path />' }] }))

    iconLoaderTopic.publish({ type: 'IconRequested', name: 'a', classType: 'svg' })
    jest.advanceTimersByTime(150)
    await Promise.resolve()
    await Promise.resolve()

    expect((service as any).requestedTypes.size).toBe(0)
  })

  it('should load missing icons and inject CSS after IconRequested', async () => {
    const iconName = 'test-icon'
    ;(window as any).onecxIcons[iconName] = undefined
    const publishSpy = jest.spyOn(iconLoaderTopic, 'publish')

    service.init()

    theme$.next({ name: 'light-theme' })

    iconLoaderTopic.publish({ type: 'IconRequested', name: iconName, classType: 'svg' })

    jest.advanceTimersByTime(150)

    await Promise.resolve()
    await Promise.resolve()

    expect(mockBff.findIconsByNamesAndRefId).toHaveBeenCalledWith('light-theme', { names: [iconName] })

    const styleEl = document.getElementById(`${iconName}-svg`)
    expect(styleEl).toBeTruthy()
    expect(styleEl?.textContent).toContain('--onecx-icon')

    expect(publishSpy).toHaveBeenCalledWith({ type: 'IconsReceived' })
  })

  it('should support background and background-before class types for same icon requested', async () => {
    const name = 'bg-icon'
    ;(window as any).onecxIcons[name] = undefined

    service.init()
    theme$.next({ name: 'dark' })

    iconLoaderTopic.publish({ type: 'IconRequested', name, classType: 'background' })
    iconLoaderTopic.publish({ type: 'IconRequested', name, classType: 'background-before' })

    jest.advanceTimersByTime(150)
    await Promise.resolve()
    await Promise.resolve()

    expect(document.getElementById(`${name}-background`)).toBeTruthy()
    expect(document.getElementById(`${name}-background-before`)).toBeTruthy()
  })
})

```


## Comments on Github

src/app/shell/services/icon-loader.services.ts
  private requestedTypes = new Map<string, Set<'svg' | 'background' | 'background-before'>>()

  init(): void {
    this.themeService.currentTheme$.asObservable().subscribe((t) => (this.themeRefId = t?.name))

Comments SchettlerKoehler : 
Use firstValueFrom and store the promise



# Libs Icon Service Code

libs > angular-integration-interface > src > index.ts
```typescript
// services
export * from './lib/services/app-config-service'
export * from './lib/services/app-state.service'
export * from './lib/services/configuration.service'
export * from './lib/services/user.service'
export * from './lib/services/parameters.service'
export * from './lib/services/portal-message.service'
export * from './lib/services/theme.service'
export * from './lib/services/remote-components.service'
export * from './lib/services/workspace.service'
export * from './lib/services/shell-capability.service'
export * from './lib/services/image-repository.service'
export * from './lib/services/icon.service'

// models
export * from './lib/model/config-key.model'

// core
export * from './lib/api/injection-tokens'

// utils

export { MfeInfo, Theme } from '@onecx/integration-interface'
```


libs > angular-integration-interface > src > lib > services > icon.service.ts
```typescript
import { Injectable, OnDestroy } from '@angular/core'
import { IconLoader, IconClassType, IconLoaderTopic } from '@onecx/integration-interface'


@Injectable({ providedIn: 'root' })
export class IconService implements OnDestroy {
  private readonly iconLoaderService = new IconLoader()

  get iconLoaderTopic() {
    return this.iconLoaderService.iconLoaderTopic;
  }
  set iconLoaderTopic(source: IconLoaderTopic) {
    this.iconLoaderService.iconLoaderTopic = source;
  }

  getIcon(name: string, type?: IconClassType): string {
    return this.iconLoaderService.getIconClass(name, type)
  }

  getIconAsync(name: string, type?: IconClassType): Promise<string | null> {
    return this.iconLoaderService.getIconClassAsync(name, type)
  }

  ngOnDestroy(): void {
    this.iconLoaderService.destroy();
  }

  destroy() {
    this.ngOnDestroy();
  }
}
```




libs > integration-interface > src > index.ts
```typescript

export * from './lib/topics/resized-events/v1/slots-resized-type'
export * from './lib/topics/resized-events/v1/topic-resized-event-type'

export * from './lib/topics/current-location/v1/current-location.model'
export * from './lib/topics/current-location/v1/current-location.topic'

export * from './lib/topics/parameters/v1/parameters.topic'

export * from './lib/topics/resized-events/v1/resized-events.topic'

export * from './lib/topics/image-repository/image-repository.model'
export * from './lib/topics/image-repository/image-repository.topic'
export * from './lib/services/image-repository.service'


export * from './lib/topics/icons/v1/icons.model'
export * from './lib/topics/icons/v1/icons.topic'
export * from './lib/topics/icons/v1/icon-type'
export * from './lib/services/icon-cache.service'
export * from './lib/services/icon-loader.service'

```


libs > integration-interface > src > lib > topics > icons > vl > icons.topic.ts
```typescript
import { Topic } from '@onecx/accelerator'
import { IconLoaderMessage } from './icons.model'

export class IconLoaderTopic extends Topic<IconLoaderMessage> {
  constructor() {
    super('onecx-icon-service', 1, false)
  }
}

```

libs > integration-interface > src > lib > topics > icons > vl > icons.model.ts
```typescript
import { IconClassType } from "./icon-type"

export interface OnecxIcon {
  name: string
  type: string
  body: string
  parent?: string | null
}


export interface IconRequested {
  type: 'IconRequested'
  name: string              // REAL icon name (mdi:xxx)
  classType: IconClassType
}

export interface IconsReceived {
  type: 'IconsReceived'
}

export type IconLoaderMessage = IconRequested | IconsReceived


```

libs > integration-interface > src > lib > topics > icons > vl > icon-type.ts
```typescript
export type IconClassType = 'svg' | 'background' | 'background-before'
```






libs > integration-interface > src > lib > services > icon-loader.service.ts
```typescript
import { IconLoaderTopic } from '../topics/icons/v1/icons.topic'
import { IconClassType } from '../topics/icons/v1/icon-type'
import { ensureIconCache, generateClassName } from './icon-cache.service'

const DEFAULT_CLASS_TYPE: IconClassType = 'background-before'

export class IconLoader {
  private _iconLoaderTopic$: IconLoaderTopic | undefined;
  get iconLoaderTopic() {
    this._iconLoaderTopic$ ??= new IconLoaderTopic()
    return this._iconLoaderTopic$
  }
  set iconLoaderTopic(source: IconLoaderTopic) {
    this._iconLoaderTopic$ = source
  }

  constructor() {
    ensureIconCache()
  }

  getIconClass(name: string, classType: IconClassType = DEFAULT_CLASS_TYPE): string {
    const className =  generateClassName(name, classType)

    if (!(name in window.onecxIcons)) {
      window.onecxIcons[name] = undefined
    }
    
    this.iconLoaderTopic.publish({ type: 'IconRequested', name, classType })
    return className;
  }

  async getIconClassAsync(
    name: string,
    classType: IconClassType = DEFAULT_CLASS_TYPE
  ): Promise<string | null> {
    const className = this.getIconClass(name, classType)

    const cached = window.onecxIcons[name]
    if (cached === null) return null
    if (cached) return className

    return new Promise((resolve) => {
      const sub = this.iconLoaderTopic.subscribe((e) => {
        if (e.type !== 'IconsReceived') return
        const v = window.onecxIcons[name]
        if (v !== undefined) {
          sub.unsubscribe()
          resolve(v ? className : null)
        }
      })
    })
  }

  destroy(): void {
    this.iconLoaderTopic.destroy()
  }
}
```



libs > integration-interface > src > lib > services > icon-cache.service.ts
```typescript
import { IconClassType } from "../topics/icons/v1/icon-type"
import { OnecxIcon } from "../topics/icons/v1/icons.model"

declare global {
    interface Window {
        onecxIcons: Record<string, OnecxIcon | null | undefined>
    }
}

export function ensureIconCache(): void {
    window.onecxIcons ??= {}
}

export function generateClassName(name: string, classType: IconClassType): string {
    const safeName = normalizeIconName(name)
    return `onecx-theme-icon-${classType}-${safeName}`
}

export function normalizeIconName(name: string): string {
    return name.replace(/[^a-zA-Z0-9_-]+/g, '-')
}

```








## Commments

libs/integration-interface/src/lib/services/icon-cache.service.ts
@@ -0,0 +1,21 @@
import { IconClassType } from "../topics/icons/v1/icon-type"
import { OnecxIcon } from "../topics/icons/v1/icons.model"

Commment : @SchettlerKoehler
Why is this stuff in an extra file and the functions not part of the IconLoaderService?





libs/integration-interface/src/lib/services/icon-loader.service.ts

const DEFAULT_CLASS_TYPE: IconClassType = 'background-before'

export class IconLoader {

Comment : @SchettlerKoehler
Should have the same name are the one in angular-integration-interface. Use name rewrite while importing.





libs/integration-interface/src/lib/topics/icons/v1/icons.topic.ts
import { Topic } from '@onecx/accelerator'
import { IconLoaderMessage } from './icons.model'

export class IconLoaderTopic extends Topic<IconLoaderMessage> {

Comment : @SchettlerKoehler

Why is the file called icon.topic.ts and the topic IconLoaderTopic? This does not match. I like IconTopic better






libs/integration-interface/src/lib/topics/icons/v1/icons.topic.ts

export class IconLoaderTopic extends Topic<IconLoaderMessage> {
  constructor() {
    super('onecx-icon-service', 1, false)

Comment : @SchettlerKoehler
name should be aligned with the topic name




libs/integration-interface/src/lib/topics/icons/v1/icon-type.ts
@@ -0,0 +1 @@
export type IconClassType = 'svg' | 'background' | 'background-before'

Comment : @SchettlerKoehler
Why is this in a seperate file?





libs/integration-interface/src/lib/services/icon-loader.service.ts

    return new Promise((resolve) => {
      const sub = this.iconLoaderTopic.subscribe((e) => {
        if (e.type !== 'IconsReceived') return

Comment : @SchettlerKoehler
Use filter






libs/integration-interface/src/lib/services/icon-loader.service.ts
    if (cached) return className

    return new Promise((resolve) => {
      const sub = this.iconLoaderTopic.subscribe((e) => {

Comment : @SchettlerKoehler
Use firstValueFrom





libs/integration-interface/src/lib/services/icon-loader.service.ts
    ensureIconCache()
  }

  getIconClass(name: string, classType: IconClassType = DEFAULT_CLASS_TYPE): string {

Comment : @SchettlerKoehler
This should be called requestIcon or something





## Specs files

libs > angular-integration-interface > src > lib > services > icon.service.spec.ts
```typescript
/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */
import { TestBed } from '@angular/core/testing'
import { IconService } from './icon.service'
import { FakeTopic } from '@onecx/accelerator';

describe('IconService', () => {
  let service: IconService

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [IconService] })
    ;(window as any).onecxIcons = {}
    service = TestBed.inject(IconService)
  })

  afterEach(() => {
    ;(window as any).onecxIcons = {}
    jest.clearAllMocks()
  })

  it('should create', () => {
    expect(service).toBeTruthy()
  })

  describe('getIcon', () => {
    it('should return normalized class and publish IconRequested', () => {
      const topic = FakeTopic.create<any>()
      service.iconLoaderTopic = topic as any

      const name = 'mdi:home-battery'
      const publishSpy = jest.spyOn(topic, 'publish')

      const result = service.getIcon(name)

      expect(result).toBe('onecx-theme-icon-background-before-mdi-home-battery')
      expect(publishSpy).toHaveBeenCalledWith({ type: 'IconRequested', name, classType: 'background-before' })
    })

    it('should honor explicit IconClassType', () => {
      const topic = FakeTopic.create<any>()
      service.iconLoaderTopic = topic as any

      const result = service.getIcon('prime:check-circle', 'svg')
      expect(result).toBe('onecx-theme-icon-svg-prime-check-circle')
    })
  })

  describe('getIconAsync', () => {
    it('should return null immediately when cached null', async () => {
      const topic = FakeTopic.create<any>()
      service.iconLoaderTopic = topic as any

      const name = 'mdi:ghost'
      ;(window as any).onecxIcons[name] = null
      const res = await service.getIconAsync(name)
      expect(res).toBeNull()
    })

    it('should return class immediately when cached icon exists', async () => {
      const topic = FakeTopic.create<any>()
      service.iconLoaderTopic = topic as any

      const name = 'mdi:car'
      ;(window as any).onecxIcons[name] = { name, type: 'svg', body: '' }
      const res = await service.getIconAsync(name, 'svg')
      expect(res).toBe('onecx-theme-icon-svg-mdi-car')
    })

    it('should resolve with class after IconsReceived when icon becomes available', async () => {
      const topic = FakeTopic.create<any>()
      service.iconLoaderTopic = topic as any

      const name = 'mdi:star'
      const promise = service.getIconAsync(name) // default background-before
      ;(window as any).onecxIcons[name] = { name, type: 'svg', body: '' }
      await topic.publish({ type: 'IconsReceived' })
      const res = await promise
      expect(res).toBe('onecx-theme-icon-background-before-mdi-star')
    })

    it('should resolve null after IconsReceived when icon resolved to null', async () => {
      const topic = FakeTopic.create<any>()
      service.iconLoaderTopic = topic as any

      const name = 'mdi:unknown'
      const promise = service.getIconAsync(name, 'svg')
      ;(window as any).onecxIcons[name] = null
      await topic.publish({ type: 'IconsReceived' })
      const res = await promise
      expect(res).toBeNull()
    })
  })

  describe('ngOnDestroy', () => {
    it('should destroy the underlying topic', () => {
      const topic = FakeTopic.create<any>()
      service.iconLoaderTopic = topic as any
      const spy = jest.spyOn(topic, 'destroy')
      service.ngOnDestroy()
      expect(spy).toHaveBeenCalled()
    })
  })
})

```




libs > integration-interface > src > lib > services > icon-loader.service.spec.ts
```typescript
/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */
import { IconLoader } from './icon-loader.service'
import { IconClassType } from '../topics/icons/v1/icon-type'
import { OnecxIcon } from '../topics/icons/v1/icons.model'
import { FakeTopic } from '@onecx/accelerator'

jest.mock('../topics/icons/v1/icons.topic', () => {
  const actual = jest.requireActual('../topics/icons/v1/icons.topic')
  const { FakeTopic } = jest.requireActual('@onecx/accelerator')
  return {
    ...actual,
    IconLoaderTopic: jest.fn().mockImplementation(() => new FakeTopic()),
  }
})

describe('IconLoader', () => {
  let loader: IconLoader

  beforeEach(() => {
    ;(window as any).onecxIcons = {}
    loader = new IconLoader()
  })

  afterEach(() => {
    ;(window as any).onecxIcons = {}
    jest.clearAllMocks()
  })

  it('initializes global icon cache', () => {
    expect((window as any).onecxIcons).toBeDefined()
    expect(typeof (window as any).onecxIcons).toBe('object')
  })

  describe('getIconClass', () => {
    it('should return normalized class and publish IconRequested', () => {
      const name = 'mdi:home-battery'
      const classType: IconClassType = 'background-before'
      const topic = (loader.iconLoaderTopic as unknown) as FakeTopic<any>
      const publishSpy = jest.spyOn(topic, 'publish')

      const cls = loader.getIconClass(name, classType)

      expect((window as any).onecxIcons[name]).toBeUndefined()
      expect(publishSpy).toHaveBeenCalledWith({ type: 'IconRequested', name, classType })
      expect(cls).toBe('onecx-theme-icon-background-before-mdi-home-battery')
    })

    it('should publish IconRequested even if icon is already cached or null', () => {
      const topic = (loader.iconLoaderTopic as unknown) as FakeTopic<any>
      const publishSpy = jest.spyOn(topic, 'publish')

      ;(window as any).onecxIcons['prime:user'] = { name: 'prime:user' } as OnecxIcon
      loader.getIconClass('prime:user', 'background')
      expect(publishSpy).toHaveBeenCalledWith({ type: 'IconRequested', name: 'prime:user', classType: 'background' })

      publishSpy.mockClear()
      ;(window as any).onecxIcons['mdi:missing'] = null
      loader.getIconClass('mdi:missing')
      expect(publishSpy).toHaveBeenCalledWith({ type: 'IconRequested', name: 'mdi:missing', classType: 'background-before' })
    })

    it('should use default classType when none provided', () => {
      const topic = (loader.iconLoaderTopic as unknown) as FakeTopic<any>
      const publishSpy = jest.spyOn(topic, 'publish')
      loader.getIconClass('mdi:settings')
      expect(publishSpy).toHaveBeenCalledWith({ type: 'IconRequested', name: 'mdi:settings', classType: 'background-before' })
    })
  })

  describe('getIconClassAsync', () => {
    it('should return null immediately when cached null', async () => {
      const name = 'mdi:ghost'
      ;(window as any).onecxIcons[name] = null
      const res = await loader.getIconClassAsync(name)
      expect(res).toBeNull()
    })

    it('should return class immediately when cached icon exists', async () => {
      const name = 'mdi:car'
      ;(window as any).onecxIcons[name] = { name, type: 'svg', body: '' }
      const res = await loader.getIconClassAsync(name, 'svg')
      expect(res).toBe('onecx-theme-icon-svg-mdi-car')
    })

    it('should resolve with class after IconsReceived when icon becomes available', async () => {
      const name = 'prime:check'
      const promise = loader.getIconClassAsync(name, 'background')
      ;(window as any).onecxIcons[name] = { name, type: 'svg', body: '' }
      const topic = (loader.iconLoaderTopic as unknown) as FakeTopic<any>
      await topic.publish({ type: 'IconsReceived' })
      const res = await promise
      expect(res).toBe('onecx-theme-icon-background-prime-check')
    })

    it('should resolve null after IconsReceived when icon resolved to null', async () => {
      const name = 'mdi:unknown'
      const promise = loader.getIconClassAsync(name)
      ;(window as any).onecxIcons[name] = null
      const topic = (loader.iconLoaderTopic as unknown) as FakeTopic<any>
      await topic.publish({ type: 'IconsReceived' })
      const res = await promise
      expect(res).toBeNull()
    })
  })

  it('should call topic.destroy when destroy is called', () => {
    const topic = (loader.iconLoaderTopic as unknown) as FakeTopic<any>
    const spy = jest.spyOn(topic, 'destroy')
    loader.destroy()
    expect(spy).toHaveBeenCalled()
  })
})

```


libs > integration-interface > src > lib > services > icon-cache.service.spec.ts
```typescript
/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */
import {
  ensureIconCache,
  generateClassName,
} from './icon-cache.service'
import { OnecxIcon } from '../topics/icons/v1/icons.model'

describe('icon-cache utilities', () => {
  beforeEach(() => {
    delete (window as any).onecxIcons
  })

  describe('ensureIconCache', () => {
    it('should initialize window.onecxIcons if not present', () => {
      expect(window.onecxIcons).toBeUndefined()

      ensureIconCache()

      expect(window.onecxIcons).toBeDefined()
      expect(window.onecxIcons).toEqual({})
    })

    it('should not overwrite existing icon cache', () => {
      const existing: Record<string, OnecxIcon | null | undefined> = {
        'mdi:home': undefined,
        'prime:user': null
      }

      window.onecxIcons = existing

      ensureIconCache()

      expect(window.onecxIcons).toBe(existing)
      expect(window.onecxIcons['mdi:home']).toBeUndefined()
      expect(window.onecxIcons['prime:user']).toBeNull()
    })
  })

  describe('generateClassName', () => {
    it('should generate correct class name for mdi icon (svg)', () => {
      const result = generateClassName('mdi:car-tire-alert', 'svg')

      expect(result).toBe(
        'onecx-theme-icon-svg-mdi-car-tire-alert'
      )
    })

    it('should generate correct class name for prime icon (background)', () => {
      const result = generateClassName('prime:check-circle', 'background')

      expect(result).toBe(
        'onecx-theme-icon-background-prime-check-circle'
      )
    })

    it('should generate correct class name for background-before', () => {
      const result = generateClassName(
        'mdi:settings-remote',
        'background-before'
      )

      expect(result).toBe(
        'onecx-theme-icon-background-before-mdi-settings-remote'
      )
    })

    it('should normalize icon name internally', () => {
      const result = generateClassName(
        'mdi:home@battery!',
        'svg'
      )

      expect(result).toBe(
        'onecx-theme-icon-svg-mdi-home-battery-'
      )
    })
  })
})

```