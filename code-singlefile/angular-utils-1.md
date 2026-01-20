#libs-Folder => angular-utils

********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-utils > src > 
index.ts


```ts

// Utils
export * from './lib/utils/async-translate-loader.utils'
export * from './lib/utils/caching-translate-loader.utils'
export * from './lib/utils/create-translate-loader.utils'
export * from './lib/utils/has-permission-checker'
export * from './lib/utils/translate.combined.loader'
export * from './lib/utils/translation-path-factory.utils'
export * from './lib/utils/has-permission-checker-factory'
export * from './lib/utils/deep-merge.utils'
export * from './lib/utils/remote-component-translation-path-factory.utils'
export * from './lib/utils/scope.utils'
export * from './lib/utils/portal-api-configuration.utils'
export * from './lib/utils/provide-connection-service'
export * from './lib/utils/remote-component-translation-path-factory.utils'
export * from './lib/utils/multi-language-missing-translation-handler.utils'
export * from './lib/utils/dynamic-locale-id.utils'

// Model
export * from './lib/model/injection-tokens'
export * from './lib/model/remote-component-config.model'

// Services
export * from './lib/services/translation-cache.service'
export * from './lib/services/permission.service'
export * from './lib/services/translation-connection.service'

// Components
export * from './lib/components/portal-page/portal-page.component'

// Providers
export * from './lib/providers/angular-utils.providers'
export * from './lib/providers/translation-path.providers'
export * from './lib/providers/permission-service.providers'
export * from './lib/providers/translation-path-from-meta.providers'


```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-utils > src >  lib >  services >

File : permission.service.ts
```ts
import { inject, Injectable } from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER, HasPermissionChecker } from '../utils/has-permission-checker'
import { from, map, Observable, of } from 'rxjs'

/**
 * Service to check and list user permissions using an injected custom permission checker or the UserService.
 */
@Injectable()
export class PermissionService {
  private userService = inject(UserService, { optional: true })
  private hasPermissionChecker = inject(HAS_PERMISSION_CHECKER, { optional: true })

  /**
   * All observables are cached to avoid infinite re-rendering loops when using the permission service in templates.
   */
  private cachedPermissions = new Map<string, Observable<boolean>>()
  private undefinedObservable = of(undefined)
  private falseObservable = of(false)
  private cachedUserPermissions: Observable<string[]> = of([])

  private availableHasPermissionChecker: HasPermissionChecker | UserService | null =
    this.hasPermissionChecker || this.userService

  constructor() {
    if (!this.availableHasPermissionChecker) {
      throw new Error('UserService or HasPermissionChecker have to be provided to check permissions!')
    }
    if (this.userService) {
      this.cachedUserPermissions = this.userService.getPermissions()
    }
  }

  /**
   * Checks if the current user has the specified permission(s).
   * @param permissionKey A permission key or an array of permission keys to check.
   * @returns An observable that emits true if the user has the permission(s), false otherwise.
   */
  hasPermission(permissionKey: string | string[]): Observable<boolean> {
    return this.lookupPermission(permissionKey)
  }

  private lookupPermission(permissionKey: string | string[]): Observable<boolean> {
    const permissionChecker = this.availableHasPermissionChecker

    if (!permissionChecker) {
      return this.falseObservable
    }

    const cacheKey = JSON.stringify(permissionKey)

    if (!this.cachedPermissions.has(cacheKey)) {
      let hasPermission: Observable<boolean>
      if (this.hasPermissionChecker?.getPermissions) {
        hasPermission = this.hasPermissionChecker.getPermissions().pipe(
          map((permissions) => {
            if (Array.isArray(permissionKey)) {
              return permissionKey.every((key) => permissions?.includes(key))
            }

            return permissions.includes(permissionKey)
          })
        )
      } else {
        hasPermission = from(permissionChecker.hasPermission(permissionKey))
      }

      this.cachedPermissions.set(cacheKey, hasPermission)
    }

    return this.cachedPermissions.get(cacheKey) || this.falseObservable
  }

  /**
   * Lists the permissions of the current user.
   * @returns An observable that emits an array of permission keys or undefined if the UserService is not available.
   */
  getPermissions(): Observable<string[] | undefined> {
    if (this.userService) {
      return this.cachedUserPermissions
    }
    return this.undefinedObservable
  }
}

```


File : permission.service.spec.ts
```ts
import { TestBed } from '@angular/core/testing'
import { PermissionService } from './permission.service'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER } from '../utils/has-permission-checker'
import { of } from 'rxjs'

describe('PermissionService', () => {
  let userServiceMock: any
  let permissionCheckerMock: any

  beforeEach(() => {
    userServiceMock = {
      getPermissions: jest.fn(),
      hasPermission: jest.fn(),
    }
    permissionCheckerMock = {
      hasPermission: jest.fn(),
    }
  })

  function createServiceWithProviders({ userService, checker }: { userService?: any; checker?: any }) {
    TestBed.configureTestingModule({
      providers: [
        userService && { provide: UserService, useValue: userService },
        checker && { provide: HAS_PERMISSION_CHECKER, useValue: checker },
        PermissionService,
      ].filter(Boolean),
    })
    return TestBed.inject(PermissionService)
  }

  it('uses HasPermissionChecker if provided', () => {
    permissionCheckerMock.hasPermission.mockReturnValue(Promise.resolve(true))
    const service = createServiceWithProviders({ checker: permissionCheckerMock })
    service.hasPermission('perm').subscribe((result) => {
      expect(userServiceMock.getPermissions).not.toHaveBeenCalled()
      expect(permissionCheckerMock.hasPermission).toHaveBeenCalledWith('perm')
      expect(result).toBe(true)
    })
  })

  it('uses UserService if HasPermissionChecker is not provided', () => {
    userServiceMock.hasPermission.mockReturnValue(Promise.resolve(true))
    userServiceMock.getPermissions.mockReturnValue(of(['perm']))
    const service = createServiceWithProviders({ userService: userServiceMock })
    service.hasPermission('perm').subscribe((result) => {
      expect(permissionCheckerMock.hasPermission).not.toHaveBeenCalled()
      expect(userServiceMock.hasPermission).toHaveBeenCalledWith('perm')
      expect(result).toBe(true)
    })
  })

  it('caches permission observables for single permissions', () => {
    permissionCheckerMock.hasPermission.mockReturnValue(Promise.resolve(true))
    const service = createServiceWithProviders({ checker: permissionCheckerMock })
    const obs1 = service.hasPermission('perm')
    const obs2 = service.hasPermission('perm')
    expect(userServiceMock.getPermissions).not.toHaveBeenCalled()
    expect(permissionCheckerMock.hasPermission).toHaveBeenCalledWith('perm')
    expect(permissionCheckerMock.hasPermission).toHaveBeenCalledTimes(1)
    expect(obs1).toBe(obs2)
  })

  it('returns false observable if no checker available', () => {
    // Simulate service with no checker
    const service = Object.create(PermissionService.prototype)
    service.availableHasPermissionChecker = null
    service.falseObservable = of(false)
    expect(service.hasPermission('perm')).toBe(service.falseObservable)
  })

  it('getPermissions returns user permissions if UserService is available', () => {
    userServiceMock.getPermissions.mockReturnValue(of(['perm1', 'perm2']))
    const service = createServiceWithProviders({ userService: userServiceMock })
    service.getPermissions().subscribe((perms) => {
      expect(userServiceMock.getPermissions).toHaveBeenCalled()
      expect(perms).toEqual(['perm1', 'perm2'])
    })
  })

  it('getPermissions returns undefined observable if UserService is not available', () => {
    permissionCheckerMock.hasPermission.mockReturnValue(Promise.resolve(true))
    const service = createServiceWithProviders({ checker: permissionCheckerMock })
    service.getPermissions().subscribe((perms) => {
      expect(perms).toBeUndefined()
    })
  })

  it('supports array of permissions', () => {
    permissionCheckerMock.hasPermission.mockReturnValue(Promise.resolve(true))
    const service = createServiceWithProviders({ checker: permissionCheckerMock })
    service.hasPermission(['perm1', 'perm2']).subscribe((result) => {
      expect(result).toBe(true)
    })
  })

  it('caches permission observables for arrays of permissions', () => {
    permissionCheckerMock.hasPermission.mockReturnValue(Promise.resolve(true))
    const service = createServiceWithProviders({ checker: permissionCheckerMock })
    const obs1 = service.hasPermission(['perm1', 'perm2'])
    const obs2 = service.hasPermission(['perm1', 'perm2'])
    expect(userServiceMock.getPermissions).not.toHaveBeenCalled()
    expect(permissionCheckerMock.hasPermission).toHaveBeenCalledWith(['perm1', 'perm2'])
    expect(permissionCheckerMock.hasPermission).toHaveBeenCalledTimes(1)
    expect(obs1).toBe(obs2)
  })
})


```


File : translation-cache.service.ts
```ts
import { Injectable, OnDestroy } from '@angular/core'
import { Observable, catchError, filter, first, map, of, tap } from 'rxjs'
import { Topic } from '@onecx/accelerator'

// This topic is defined here and not in integration-interface, because
// it is not used as framework independent integration but for improving
// angular specific things
class TranslationCacheTopic extends Topic<string> {
  constructor() {
    super('translationCache', 2)
  }
}

declare global {
  interface Window {
    onecxTranslations: Record<string, any>
  }
}

@Injectable({ providedIn: 'root' })
export class TranslationCacheService implements OnDestroy {
  private _translationTopic$: TranslationCacheTopic | undefined
  get translationTopic$() {
    this._translationTopic$ ??= new TranslationCacheTopic()
    return this._translationTopic$
  }
  set translationTopic$(source: TranslationCacheTopic) {
    this._translationTopic$ = source
  }
  constructor() {
    window['onecxTranslations'] ??= {}
  }
  ngOnDestroy(): void {
    this._translationTopic$?.destroy()
  }

  /**
   * Retrieves a translation file from the cache or fetches it if not available.
   *
   * This method checks if the translation file is already cached in `window['onecxTranslations']`.
   * If it is, it returns the cached version. If not, it calls the provided `cacheMissFunction`
   * to fetch the translation file and caches it for future use.
   *
   * If the requested translation file is null, it waits for the translation topic to be published by a different application.
   *
   * In case of failed load, it logs an error, deletes the entry from the cache, and publishes the URL to notify other subscribers about the failure.
   * @param url
   * @param cacheMissFunction
   * @returns
   */
  getTranslationFile(url: string, cacheMissFunction: () => Observable<any>): Observable<any> {
    if (window['onecxTranslations'][url]) {
      return of(window['onecxTranslations'][url])
    }

    if (window['onecxTranslations'][url] === null) {
      return this.translationTopic$.pipe(
        filter((messageUrl) => messageUrl === url),
        map(() => window['onecxTranslations'][url] ?? {}),
        first()
      )
    }

    window['onecxTranslations'][url] = null
    return cacheMissFunction().pipe(
      tap((t) => {
        window['onecxTranslations'][url] = t
        this.translationTopic$.publish(url)
      }),
      map(() => window['onecxTranslations'][url]),
      catchError(() => {
        console.error(`Failed to load translation file: ${url}`)
        delete window['onecxTranslations'][url]
        this.translationTopic$.publish(url)
        return of({})
      }),
      first()
    )
  }
}

```


File : translation-cache.service.spec.ts
```ts
import { TestBed } from "@angular/core/testing";
import { ReplaySubject, of } from 'rxjs';
import { TranslationCacheService } from "./translation-cache.service";
import { FakeTopic } from "@onecx/accelerator";

describe('TranslationCacheService', () => {
  let translationCache: TranslationCacheService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [TranslationCacheService]
    }).compileComponents();
    translationCache = TestBed.inject(TranslationCacheService);
    (translationCache as any).translationTopic$ = new FakeTopic<string>();
  });

  afterEach(() => {
    window['onecxTranslations'] = {};
  });

  it('should be created', () => {
    expect(translationCache).toBeTruthy();
  });

  describe('getTranslationFile', () => {
    it('should return cached translation if available', (done) => {
      
      window['onecxTranslations'] = { 'testUrl': { key: 'cachedValue' } };
      translationCache.getTranslationFile('testUrl', () => of({ key: 'value' })).subscribe((result) => {
        expect(result).toEqual({ key: 'cachedValue' });
        done();
      });
    });
    
    it('should load and cache translation if not available', (done) => {

      const subject = new ReplaySubject<any>(1);

      let counter = 0;
      let v1 = undefined;
      let v2 = undefined;
      translationCache.getTranslationFile('testUrl', () => {counter++; return subject}).subscribe((v)=> {v1 = v});
      translationCache.getTranslationFile('testUrl', () => {counter++; return subject}).subscribe((v)=> {v2 = v});
      expect(counter).toBe(1);

      const trans = { key: 'value' };
      subject.next(trans);
      expect(v1).toBe(trans);
      expect(v2).toBe(trans);
      done();
    });
  });
});
```


File : translation-connection.service.ts
```ts
import { Injectable, OnDestroy, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from '@onecx/angular-integration-interface'
import { Subscription } from 'rxjs'

@Injectable()
export class TranslationConnectionService implements OnDestroy {
  languageSub: Subscription

  constructor() {
    const userService = inject(UserService)
    const translateService = inject(TranslateService)

    this.languageSub = userService.lang$.subscribe((lang) => translateService.use(lang))
  }
  ngOnDestroy(): void {
    this.languageSub.unsubscribe()
  }
}

```


File : translation-connection.service.spec.ts
```ts
import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { TranslationConnectionService } from './translation-connection.service'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from '@onecx/angular-integration-interface'
import { provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'

describe('ConnectionService', () => {
  let service: TranslationConnectionService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestingModule.withTranslations('en', {})],
      providers: [provideUserServiceMock()],
    })
  })

  it('should create', fakeAsync(() => {
    TestBed.runInInjectionContext(() => {
      service = new TranslationConnectionService()
    })

    const userService = TestBed.inject(UserService)
    const translateService = TestBed.inject(TranslateService)
    expect(service).toBeTruthy()
    expect(translateService.currentLang).toBe('en')

    userService.lang$.next('de')
    tick(100)
    expect(translateService.currentLang).toBe('de')
  }))
})

```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-utils > src >  lib > components > portal-page

File : porta -page.component.ts
```ts
import { Component, Input, OnInit, inject } from '@angular/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import { Observable, of } from 'rxjs'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { PermissionService } from '../../services/permission.service'

@Component({
  selector: 'ocx-portal-page',
  templateUrl: './portal-page.component.html',
  styleUrls: ['./portal-page.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class PortalPageComponent implements OnInit {
  private appState = inject(AppStateService)
  private permissionService = inject(PermissionService)
  private trueObservable = of(true)

  @Input() permission = ''
  @Input() helpArticleId = ''
  @Input() pageName = ''
  @Input() applicationId = ''

  hasAccess(): Observable<boolean> {
    return this.permission ? this.permissionService.hasPermission(this.permission) : this.trueObservable
  }

  ngOnInit(): void {
    if (!this.helpArticleId) {
      console.warn(
        `ocx-portal-page on url ${location.pathname} does not have 'helpArticleId' set. Set to some unique string in order to support help management feature.`
      )
    }
    this.appState.currentPage$.publish({
      path: document.location.pathname,
      helpArticleId: this.helpArticleId,
      permission: this.permission,
      pageName: this.pageName,
      applicationId: this.applicationId,
    })
  }
}


```

File : portal-page.component.scss
```scss
:host {
  display: block;
  padding: var(--page-padding, 1rem);
  height: 100%;
}
@media (max-width: var(--mobile-break-point)) {
  :host {
    padding: var(--page-padding-lg, 1rem);
    padding-top: var(--page-padding, 1rem);
  }
}

.content-wrapper {
  width: 100%;
  height: 100%;
}

```

File : portal-page.component.spec.ts
```ts
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { PortalPageComponent } from './portal-page.component'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { provideAngularUtils } from '../../providers/angular-utils.providers'

describe('PortalPageComponent', () => {
  let component: PortalPageComponent
  let fixture: ComponentFixture<PortalPageComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        PortalPageComponent,
        TranslateTestingModule.withTranslations({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
      ],
      providers: [
        provideAngularUtils(),
        provideHttpClient(withInterceptorsFromDi()),
        provideAppStateServiceMock(),
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

```


File : portal-page.component.html
```html
<div class="content-wrapper">
  @if (hasAccess() | async) {
  <ng-content></ng-content>
  } @else {
  <h3>{{'OCX_PORTAL_PAGE.UNAUTHORIZED_TITLE' | translate}}</h3>
  <p>
    {{'OCX_PORTAL_PAGE.UNAUTHORIZED_MESSAGE' | translate}}
    <span>{{'OCX_PORTAL_PAGE.MISSING_PERMISSION' | translate : {permission: permission} }}</span>
  </p>
  }
</div>

```



********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-utils > src >  lib > providers

File : angular-utils.providers.ts
```ts
import { Provider } from '@angular/core'
import { providePermissionService } from './permission-service.providers'
import { provideTranslationPaths } from './translation-path.providers'

export type ContentType = 'microfrontend' | 'remoteComponent'

export interface AngularUtilsProviderConfig {
  contentType: ContentType
}

export function provideAngularUtils(): Provider[] {
  const providers = [...providePermissionService()]
  providers.push(provideTranslationPaths())
  return providers
}


```

File : permission-service.providers.ts
```ts
import { Provider } from '@angular/core'
import { PermissionService } from '../services/permission.service'

export function providePermissionService(): Provider[] {
  return [PermissionService]
}

```


File : translation-path-from-meta.provider.spec.ts
```ts
import { provideTranslationPathFromMeta } from './translation-path-from-meta.providers';
import { TRANSLATION_PATH } from '../utils/create-translate-loader.utils';
import { isTest } from '@onecx/accelerator';

// Mock the isTest function and Topic class
jest.mock('@onecx/accelerator', () => ({
  isTest: jest.fn(),
  Topic: class MockTopic {
  },
}));

const mockIsTest = isTest as jest.MockedFunction<typeof isTest>;

describe('provideTranslationPathFromMeta', () => {
  beforeEach(() => {
    mockIsTest.mockReset();
    // Default to non-test environment
    mockIsTest.mockReturnValue(false);
  });

  it('should remove file name and append custom path', () => {
    const url = 'https://dev.one-cx.org/mfe/workspace/3204.512.js'
    const provider = provideTranslationPathFromMeta(url, 'assets/pathName/');
    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'https://dev.one-cx.org/mfe/workspace/assets/pathName/',
      multi: true,
    });
  });

  it('should default to /i18n/ if path is undefined', () => {
    const url = 'https://dev.one-cx.org/mfe/workspace/3204.512.js'
    const provider = provideTranslationPathFromMeta(url);
    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'https://dev.one-cx.org/mfe/workspace/assets/i18n/',
      multi: true,
    });
  });

  it('should handle URLs with no file name', () => {
    const url = 'https://dev.one-cx.org/mfe/workspace/'
    const provider = provideTranslationPathFromMeta(url, 'assets/pathName/');
    expect(provider).toEqual(expect.objectContaining({ useValue: 'https://dev.one-cx.org/mfe/workspace/assets/pathName/'}));
  });

  it('should throw error for local file URLs', () => {
    mockIsTest.mockReturnValue(false);
    expect(() => {
      provideTranslationPathFromMeta('file:///some/local/file.js', 'assets/i18n/');
    }).toThrow('Cannot construct translation path from local file path. Please check whether the webpack configuration for importMeta is correct: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta');
  });

  it('should add trailing slash if path does not end with slash', () => {
    const url = 'https://dev.one-cx.org/mfe/workspace/3204.512.js'
    const provider = provideTranslationPathFromMeta(url, 'assets/i18n');
     expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'https://dev.one-cx.org/mfe/workspace/assets/i18n/',
      multi: true,
    });
  });

  it('should return relative path for local file URLs in test environment', () => {
    mockIsTest.mockReturnValue(true);
    const provider = provideTranslationPathFromMeta('file:///some/local/file.js', 'assets/i18n/');
    
    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'assets/i18n/',
      multi: true,
    });
  });

  it('should return relative path for undefined URL in test environment', () => {
    mockIsTest.mockReturnValue(true);
    const provider = provideTranslationPathFromMeta(undefined, 'assets/i18n/');
    
    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'assets/i18n/',
      multi: true,
    });
  });
});
```


File : translation-path-from-meta.providers.ts
```ts
import { Provider } from "@angular/core";
import { TRANSLATION_PATH } from "../utils/create-translate-loader.utils";
import { Location } from "@angular/common";
import { isTest } from "@onecx/accelerator";

/**
 * Returns a provider for TRANSLATION_PATH based on import.meta.url and a given path.
 * Removes the file name from import.meta.url and appends the path (default 'assets/i18n/').
 * Please make sure the webpack configuration for importMeta contains: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta.
 */
export function provideTranslationPathFromMeta(url: string | undefined, path = 'assets/i18n/'): Provider {
  if (isTest() && (!url || url.startsWith('file://'))) {
    return constructTranslationPathInTestEnv(path);
  }
  return constructTranslationPath(url, path);
}

function constructTranslationPathInTestEnv(path: string): Provider {
  return {
    provide: TRANSLATION_PATH,
    useValue: path,
    multi: true,
  };
}

function constructTranslationPath(url: string | undefined, path: string): Provider {
  if(!url || url.startsWith('file://')) {
    throw new Error('Cannot construct translation path from local file path. Please check whether the webpack configuration for importMeta is correct: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta');
  }
  const urlWithoutFileName = url.replace(/\/[^/]*$/, '');
  const translationPath = Location.joinWithSlash(urlWithoutFileName, path) + (path.endsWith('/') ? '' : '/');
  return {
    provide: TRANSLATION_PATH,
    useValue: translationPath,
    multi: true,
  };
}
```


File : translation-path.providers.ts
```ts
import { LOCALE_ID, Provider } from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'
import { provideTranslationPathFromMeta } from './translation-path-from-meta.providers'

const localProvider = {
  provide: LOCALE_ID,
  useFactory: (userService: UserService) => {
    return userService.lang$.getValue()
  },
  deps: [UserService],
}

export function provideTranslationPaths(): Provider[] {
  return [
    localProvider,
    provideTranslationPathFromMeta(import.meta.url, 'onecx-angular-utils/assets/i18n/'),
  ]
}
```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-utils > src >  lib >  models

File : injection-tokens.ts
```ts
import { InjectionToken } from '@angular/core'
import { ReplaySubject } from 'rxjs'
import { RemoteComponentConfig } from './remote-component-config.model'

export const REMOTE_COMPONENT_CONFIG = new InjectionToken<ReplaySubject<RemoteComponentConfig>>(
  'REMOTE_COMPONENT_CONFIG'
)

export const SKIP_STYLE_SCOPING = new InjectionToken<boolean>('SKIP_STYLE_SCOPING')

```

File : remote-component-config.model.ts
```ts
export type RemoteComponentConfig = {
  appId: string
  productName: string
  permissions: string[]
  baseUrl: string
}

```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-utils > src >  lib > utils

File : async-translate-loader.utils.spec.ts
```ts
import { TranslateLoader } from '@ngx-translate/core'
import { Observable, of } from 'rxjs'
import { AsyncTranslateLoader } from './async-translate-loader.utils'

describe('AsyncTranslateLoader', () => {
  class FakeTranslateLoader implements TranslateLoader {
    public lastLanguage: string | undefined
    constructor(private result: any) {}

    getTranslation(lang: string): Observable<any> {
      this.lastLanguage = lang
      return of(this.result)
    }
  }

  it('should get translations', (done) => {
    const translations = 'my translations'
    const translateLoader = new FakeTranslateLoader(translations)
    const translateLoader$ = of(translateLoader)

    expect(translateLoader.lastLanguage).toBeUndefined()

    const asyncTranslateLoader = new AsyncTranslateLoader(translateLoader$)
    asyncTranslateLoader.getTranslation('en').subscribe((t) => {
      expect(t).toEqual(translations)
      expect(translateLoader.lastLanguage).toEqual('en')
      done()
    })
  })
})


```

File : async-translate-loader.utils.ts
```ts
import { TranslateLoader } from '@ngx-translate/core'
import { defaultIfEmpty, first, mergeMap, Observable, of } from 'rxjs'

export class AsyncTranslateLoader implements TranslateLoader {
  constructor(private readonly translateLoader$: Observable<TranslateLoader>) {}

  getTranslation(lang: string): Observable<any> {
    return this.translateLoader$.pipe(
      defaultIfEmpty(undefined),
      first(),
      mergeMap((translateLoader) => translateLoader?.getTranslation(lang) ?? of({})),
    )
  }
}

```


File : caching-translate-loader.utils.spec.ts
```ts
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { TranslationCacheService } from '../services/translation-cache.service'
import { CachingTranslateLoader } from './caching-translate-loader.utils'

describe('CachingTranslateLoader', () => {
  let http: HttpClient
  let translationCache: TranslationCacheService
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents()
    http = TestBed.inject(HttpClient)
    translationCache = TestBed.inject(TranslationCacheService)
    window['onecxTranslations'] = {}
  })

  it('should get translations', (done) => {
    const translateLoader = new CachingTranslateLoader(translationCache, http, `./assets/i18n/`, '.json')
    const translation = { testKey: 'my translation' }
    http.get = jest.fn().mockReturnValue(of(translation))
    translateLoader.getTranslation('en').subscribe((t) => {
      expect(t).toEqual(translation)
      done()
    })
  })

  it('should load translations only once', (done) => {
    let httpCalls = 0
    const responses = []
    const translation = { testKey: 'my translation' }
    http.get = jest.fn().mockImplementation(() => {
      httpCalls++
      return of(translation)
    })

    const translateLoader = new CachingTranslateLoader(translationCache, http, `./assets/i18n/`, '.json')
    translateLoader.getTranslation('en').subscribe((t) => {
      responses.push(t)
      expect(t).toEqual(translation)
      expect(httpCalls).toEqual(1)
      if (responses.length == 2) {
        done()
      }
    })
    const translateLoader2 = new CachingTranslateLoader(translationCache, http, `./assets/i18n/`, '.json')
    translateLoader2.getTranslation('en').subscribe((t) => {
      responses.push(t)
      expect(t).toEqual(translation)
      expect(httpCalls).toEqual(1)
      if (responses.length == 2) {
        done()
      }
    })
  })
})

```


File : caching-translate-loader.utils.ts
```ts
import { HttpClient } from '@angular/common/http'
import { TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { Observable, retry } from 'rxjs'
import { TranslationCacheService } from '../services/translation-cache.service'

export class CachingTranslateLoader implements TranslateLoader {
  private translateLoader: TranslateHttpLoader

  constructor(
    private translationCache: TranslationCacheService,
    private http: HttpClient,
    private prefix?: string,
    private suffix?: string
  ) {
    this.translateLoader = new TranslateHttpLoader(this.http, this.prefix, this.suffix)
  }

  getTranslation(lang: string): Observable<any> {
    const url = `${this.prefix}${lang}${this.suffix}`

    return this.translationCache.getTranslationFile(url, () =>
      this.translateLoader.getTranslation(lang).pipe(retry({ delay: 50, count: 2 }))
    )
  }
}

```


File : create-translate-loader.utils.spec.ts
```ts
import { TestBed } from '@angular/core/testing'
import { MockService } from 'ng-mocks'
import { createTranslateLoader, TRANSLATION_PATH } from './create-translate-loader.utils'
import { Injector, runInInjectionContext } from '@angular/core'
import { TranslationCacheService } from '../services/translation-cache.service'
import { HttpClient } from '@angular/common/http'
import { of } from 'rxjs'

describe('CreateTranslateLoader', () => {
  const httpClientMock = MockService(HttpClient)
  httpClientMock.get = jest.fn(() => of({}, {}, {})) as any
  let translationCacheService: TranslationCacheService
  let injector: Injector

  describe('with injected TRANSLATION_PATH', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        providers: [
          {
            provide: TRANSLATION_PATH,
            useValue: 'path_1',
            multi: true,
          },
          {
            provide: TRANSLATION_PATH,
            useValue: 'path_2',
            multi: true,
          },
          {
            provide: TRANSLATION_PATH,
            useValue: of("path_3"),
            multi: true,
          },
        ],
      }).compileComponents()
  
      injector = TestBed.inject(Injector)
      translationCacheService = TestBed.inject(TranslationCacheService)
      window['onecxTranslations'] = {}
      jest.clearAllMocks()
    })
  
    describe('without TranslationCache parameter', () => {
      it('should call httpClient for each TRANSLATION_PATH', (done) => {
        const translateLoader = runInInjectionContext(injector, () =>
          createTranslateLoader(httpClientMock, undefined)
        )
  
        translateLoader.getTranslation('en').subscribe(() => {
          expect(httpClientMock.get).toHaveBeenCalledTimes(3)
          done()
        })
      })
    })
  
    describe('with TranslationCache parameter', () => {
      it('should call httpClient for each TRANSLATION_PATH', (done) => {
        const translateLoader = runInInjectionContext(injector, () =>
          createTranslateLoader(httpClientMock, undefined, translationCacheService)
        )
  
        translateLoader.getTranslation('en').subscribe(() => {
          expect(httpClientMock.get).toHaveBeenCalledTimes(3)
          done()
        })
      })
    })
  })

  describe('without injected TRANSLATION_PATH', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({}).compileComponents()
      injector = TestBed.inject(Injector)
      translationCacheService = TestBed.inject(TranslationCacheService)
      window['onecxTranslations'] = {}
      jest.clearAllMocks()
    })
  
    describe('without TranslationCache parameter', () => {
      it('should call httpClient for each TRANSLATION_PATH', (done) => {
        const translateLoader = runInInjectionContext(injector, () =>
          createTranslateLoader(httpClientMock, undefined)
        )
  
        translateLoader.getTranslation('en').subscribe(() => {
          expect(httpClientMock.get).toHaveBeenCalledTimes(0)
          done()
        })
      })
    })
  
    describe('with TranslationCache parameter', () => {
      it('should call httpClient for each TRANSLATION_PATH', (done) => {
        const translateLoader = runInInjectionContext(injector, () =>
          createTranslateLoader(httpClientMock, undefined, translationCacheService)
        )
  
        translateLoader.getTranslation('en').subscribe(() => {
          expect(httpClientMock.get).toHaveBeenCalledTimes(0)
          done()
        })
      })
    })
  })
})

```


File : create-translate-loader.utils.ts
```ts
import { HttpClient } from '@angular/common/http'
import { inject, InjectionToken } from '@angular/core'
import { TranslateLoader } from '@ngx-translate/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import { from, isObservable, map, Observable, zip } from 'rxjs'
import { TranslationCacheService } from '../services/translation-cache.service'
import { AsyncTranslateLoader } from './async-translate-loader.utils'
import { CachingTranslateLoader } from './caching-translate-loader.utils'
import { TranslateCombinedLoader } from './translate.combined.loader'

export const TRANSLATION_PATH = new InjectionToken<(string | Observable<string> | Promise<string>)[]>(
  'TRANSLATION_PATH'
)

function toObservable(path: string | Observable<string> | Promise<string>): Observable<string> {
  if (isObservable(path)) {
    return path
  }
  return from(Promise.resolve(path))
}

export function createTranslateLoader(
  http: HttpClient,
  _appStateService?: AppStateService,
  translationCacheService?: TranslationCacheService
): TranslateLoader {
  const ts = translationCacheService ?? inject(TranslationCacheService)

  const translationPaths = inject(TRANSLATION_PATH, {optional: true}) ?? []

  return new AsyncTranslateLoader(
    zip(translationPaths.map((value) => toObservable(value))).pipe(
      map((translationPaths) => {
        const uniqueTranslationPaths = [...new Set(translationPaths)]
        return new TranslateCombinedLoader(
          ...uniqueTranslationPaths.map((path) => {
            return new CachingTranslateLoader(ts, http, path, '.json')
          })
        )
      })
    )
  )
}

```


File : deep-merge.utils.ts
```ts
export function isObject(item: any): any {
  return item && typeof item === 'object' && !Array.isArray(item)
}

export function mergeDeep(target: any, source: any): any {
  const output = Object.assign({}, target)
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] })
        else output[key] = mergeDeep(target[key], source[key])
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}

```


File : dynamic-locale-id.utils.spec.ts
```ts
import { DynamicLocaleId } from './dynamic-locale-id.utils'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { TestBed } from '@angular/core/testing'
import { LOCALE_ID } from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'

describe('DynamicLocaleId', () => {
  let dynamicLocaleId: DynamicLocaleId
  let userServiceMock: UserServiceMock

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideUserServiceMock(),
        {
          provide: LOCALE_ID,
          useClass: DynamicLocaleId,
          deps: [UserService],
        },
      ],
    })

    userServiceMock = TestBed.inject(UserServiceMock)
    dynamicLocaleId = new DynamicLocaleId(userServiceMock as any)
  })

  it('should return the current language from userService.lang$', () => {
    userServiceMock.lang$.next('fr')
    expect(dynamicLocaleId.valueOf()).toBe('fr')
  })

  it('should return the correct length of the current language', () => {
    userServiceMock.lang$.next('es')
    expect(dynamicLocaleId.length).toBe(2)
  })

  it('should proxy string methods to the current language', () => {
    userServiceMock.lang$.next('en-US')
    const dynamicLocaleId = TestBed.inject(LOCALE_ID)
    expect(dynamicLocaleId.toLowerCase()).toBe('en-us')
    expect(dynamicLocaleId.toUpperCase()).toBe('EN-US')
  })
})

```


File : dynamic-locale-id.utils.ts
```ts
import { UserService } from '@onecx/angular-integration-interface'

export class DynamicLocaleId {
  constructor(private readonly userService: UserService) {
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


File : has-permission-checker-factory.spec.ts
```ts
import { TestBed } from '@angular/core/testing'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER } from './has-permission-checker'
import { hasPermissionCheckerFactory } from './has-permission-checker-factory'
import { Injector } from '@angular/core'

describe('hasPermissionCheckerFactory', () => {
  let injector: Injector
  const userServiceMock = {
    hasPermission: jest.fn(),
  }

  const customPermissionChecker = {
    hasPermission: jest.fn(),
    someCustomMethod: jest.fn(),
  }

  describe('withProviders', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: UserService, useValue: userServiceMock },
          { provide: HAS_PERMISSION_CHECKER, useValue: customPermissionChecker },
        ],
      })
      injector = TestBed.inject(Injector)
    })
    it('should return the provided hasPermissionChecker when it exists', () => {
      const result = hasPermissionCheckerFactory(injector, customPermissionChecker)
      expect(result).toBe(customPermissionChecker)
    })

    it('should return a UserService instance when hasPermissionChecker is not provided but UserService exists', () => {
      const result = hasPermissionCheckerFactory(injector, null)
      expect(result).toBe(userServiceMock)
    })
  })

  describe('withoutProviders', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({})
      injector = TestBed.inject(Injector)
    })
    it('should create a new UserService instance when neither hasPermissionChecker nor UserService exists', () => {
      const result = hasPermissionCheckerFactory(injector, null)
      const newUserService = injector.get(UserService, null)

      expect(result).toBe(newUserService)
      expect(newUserService).toBeTruthy()
    })
  })
})

```


File : has-permission-checker-factory.ts
```ts
import { Injector, Provider, StaticProvider } from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER, HasPermissionChecker } from './has-permission-checker'

export function hasPermissionCheckerFactory(parentInjector: Injector, hasPermissionChecker: HasPermissionChecker | null) {
  if (!hasPermissionChecker) {
    const hasUserService = !!parentInjector.get(UserService, null)
    const injectorConfig: {
      providers: Array<Provider | StaticProvider>
      parent?: Injector
      name?: string
    } = {
      providers: [
        {
          provide: HAS_PERMISSION_CHECKER,
          useExisting: UserService,
        },
      ],
      parent: parentInjector,
    }
    if (!hasUserService) {
      injectorConfig.providers.push(UserService)
    }
    const injector = Injector.create(injectorConfig)
    hasPermissionChecker = injector.get(HAS_PERMISSION_CHECKER)
  }
  return hasPermissionChecker
}

```


File : has-permission-checker.ts
```ts
import { InjectionToken, Injector, Optional, SkipSelf } from '@angular/core'
import { hasPermissionCheckerFactory } from './has-permission-checker-factory'
import { Observable } from 'rxjs'

export interface HasPermissionChecker {
  hasPermission(permissionKey: string | string[]): Promise<boolean>
  getPermissions?(): Observable<string[]>
}

/**
 * This checker always returns true, basically disabling the permission system on the UI side
 */
export class AlwaysGrantPermissionChecker implements HasPermissionChecker {
  async hasPermission(_permissionKey: string | string[]): Promise<boolean> {
    return true
  }
}

export const HAS_PERMISSION_CHECKER = new InjectionToken<HasPermissionChecker>('hasPermission')

export function providePermissionChecker() {
  return [
    {
      provide: HAS_PERMISSION_CHECKER,
      useFactory: hasPermissionCheckerFactory,
      deps: [Injector, [new Optional(), new SkipSelf(), HAS_PERMISSION_CHECKER]],
    },
  ]
}

export function provideAlwaysGrantPermissionChecker() {
  return [
    {
      provide: HAS_PERMISSION_CHECKER,
      useClass: AlwaysGrantPermissionChecker,
    },
  ]
}

```


File : multi-language-missing-translation-handler.utils.spec.ts
```ts
import { TestBed } from '@angular/core/testing'
import { MultiLanguageMissingTranslationHandler } from './multi-language-missing-translation-handler.utils'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { MissingTranslationHandlerParams } from '@ngx-translate/core'
import { of } from 'rxjs'
import { UserProfile } from '@onecx/integration-interface'

jest.mock('@onecx/accelerator', () => {
  const actual = jest.requireActual('@onecx/accelerator')
  return {
    ...actual,
    getNormalizedBrowserLocales: jest.fn(),
  }
})

import { getNormalizedBrowserLocales } from '@onecx/accelerator'

jest.mock('@ngx-translate/core', () => {
  const actual = jest.requireActual('@ngx-translate/core')
  return {
    ...actual,
    getValue: jest.fn((obj, key) => obj[key]),
  }
})

describe('MultiLanguageMissingTranslationHandler', () => {
  let handler: MultiLanguageMissingTranslationHandler
  let userServiceMock: UserServiceMock
  let mockedGetNormalizedBrowserLocales: jest.Mock

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideUserServiceMock(), MultiLanguageMissingTranslationHandler],
    })

    userServiceMock = TestBed.inject(UserServiceMock)
    handler = TestBed.inject(MultiLanguageMissingTranslationHandler)
    mockedGetNormalizedBrowserLocales = getNormalizedBrowserLocales as jest.Mock
  })

  it('should use locales from user profile if available', (done) => {
    mockedGetNormalizedBrowserLocales.mockReturnValue(['de'])

    userServiceMock.profile$.publish({
      settings: {
        locales: ['fr', 'en'],
      },
    } as UserProfile)

    const params: MissingTranslationHandlerParams = {
      key: 'test.key',
      translateService: {
        reloadLang: jest.fn().mockImplementation((lang) => {
          if (lang === 'fr') {
            return of({ 'test.key': 'Test French' })
          }
          return of({})
        }),
        parser: {
          interpolate: jest.fn((value) => value),
          getValue: jest.fn((obj, key) => obj[key]),
        },
      } as any,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('Test French')
      done()
    })
  })

  it('should use browser locales if locales from user profile are unavailable', (done) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    mockedGetNormalizedBrowserLocales.mockReturnValue(['de'])

    userServiceMock.profile$.publish({
      settings: {
        locales: undefined,
      },
    } as UserProfile)

    const params: MissingTranslationHandlerParams = {
      key: 'test.key',
      translateService: {
        reloadLang: jest.fn().mockImplementation((lang) => {
          if (lang === 'de') {
            return of({ 'test.key': 'Test German' })
          }
          return of({})
        }),
        parser: {
          interpolate: jest.fn((value) => value),
          getValue: jest.fn((obj, key) => obj[key]),
        },
      } as any,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('Test German')
      done()
    })
  })

  it('should try to load for every available language', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['fr', 'en', 'pl'],
      },
    } as UserProfile)

    const params: MissingTranslationHandlerParams = {
      key: 'test.key',
      translateService: {
        reloadLang: jest.fn().mockImplementation((lang) => {
          if (lang === 'pl') {
            return of({ 'test.key': 'Test Polish' })
          }
          return of({})
        }),
        parser: {
          interpolate: jest.fn((value) => value),
          getValue: jest.fn((obj, key) => obj[key]),
        },
      } as any,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('Test Polish')
      expect(params.translateService.reloadLang).toHaveBeenCalledTimes(3)
      done()
    })
  })
  it('should throw an error if no translation is found', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['fr', 'en', 'pl'],
      },
    } as UserProfile)

    const params: MissingTranslationHandlerParams = {
      key: 'missing.key',
      translateService: {
        reloadLang: jest.fn().mockReturnValue(of({})),
        parser: {
          interpolate: jest.fn((value) => value),
          getValue: jest.fn((obj, key) => obj[key]),
        },
      } as any,
    }

    handler.handle(params).subscribe({
      error: (err) => {
        expect(err.message).toBe('No translation found for key: missing.key')
        expect(params.translateService.reloadLang).toHaveBeenCalledTimes(3)
        done()
      },
    })
  })
})

```


File : multi-language-missing-translation-handler.utils.ts
```ts
import { inject, Injectable } from '@angular/core'
import { getValue, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core'
import { getNormalizedBrowserLocales } from '@onecx/accelerator'
import { UserService } from '@onecx/angular-integration-interface'
import { Observable, of } from 'rxjs'
import { catchError, map, mergeMap, shareReplay, take } from 'rxjs/operators'

@Injectable()
export class MultiLanguageMissingTranslationHandler implements MissingTranslationHandler {
  private readonly userService = inject(UserService)
  handle(params: MissingTranslationHandlerParams): Observable<string> {
    const locales$ = this.userService.profile$.pipe(
      map((p) => {
        if (p.settings?.locales) {
          return p.settings?.locales
        }
        return getNormalizedBrowserLocales()
      }),
      take(1),
      shareReplay(1)
    )

    return loadTranslations(locales$, params)
  }
}
/**
 * Tries to find a translation for the given language.
 * If no translation is found, an error is thrown.
 *
 * Uses the translateService to reload the language and get the translation for the given key. Then parses the translation with provided parameters.
 * @param lang - language to find the translation for
 * @param params - parameters containing the key and translateService
 * @returns Observable that emits the translation or throws an error if not found
 */
function findTranslationForLang(lang: string, params: MissingTranslationHandlerParams): Observable<string> {
  return params.translateService.reloadLang(lang).pipe(
    map((interpolatableTranslationObject: Record<string, any>) => {
      const translatedValue = params.translateService.parser.interpolate(
        getValue(interpolatableTranslationObject, params.key),
        params.interpolateParams
      )
      if (!translatedValue) {
        throw new Error(`No translation found for key: ${params.key} in language: ${lang}`)
      }
      return translatedValue
    })
  )
}

function loadTranslations(
  langConfig: Observable<string[]>,
  params: MissingTranslationHandlerParams
): Observable<string> {
  return langConfig.pipe(
    mergeMap((l) => {
      const langs = [...l]
      const chain = (o: Observable<string[]>): Observable<any> => {
        return o.pipe(
          mergeMap((lang) => {
            return findTranslationForLang(lang[0], params)
          }),
          catchError(() => {
            langs.shift()
            if (langs.length === 0) {
              throw new Error(`No translation found for key: ${params.key}`)
            }
            return chain(of(langs))
          })
        )
      }
      return chain(of(langs))
    })
  )
}

```


File : portal-api-configuration.utils.ts
```ts
import { Location } from '@angular/common'
import { inject } from '@angular/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import { BehaviorSubject, first, map } from 'rxjs'

type Config = {
  credentials: { [key: string]: string | (() => string | undefined) }
  encodeParam: (param: unknown) => string
  selectHeaderContentType(contentTypes: string[]): string | undefined
  selectHeaderAccept(accepts: string[]): string | undefined
  isJsonMime(mime: string): boolean
  lookupCredential(key: string): string | undefined
}

export class PortalApiConfiguration {
  private configuration: Config
  appStateService: AppStateService = inject(AppStateService)

  protected basePath$: BehaviorSubject<string>
  get basePath() {
    return this.basePath$.value
  }
  set basePath(_: string) {
    throw new Error('Do not set basePath')
  }

  get credentials(): { [key: string]: string | (() => string | undefined) } {
    return this.configuration.credentials
  }
  set credentials(value: { [key: string]: string | (() => string | undefined) }) {
    this.configuration.credentials = value
  }

  get encodeParam(): (param: unknown) => string {
    return this.configuration.encodeParam
  }
  set encocdeParam(value: (param: unknown) => string) {
    this.configuration.encodeParam = value
  }

  constructor(
    private configurationClassOfGenerator: unknown,
    private apiPrefix: string
  ) {
    this.configuration = this.activator(this.configurationClassOfGenerator)
    this.basePath$ = new BehaviorSubject<string>(Location.joinWithSlash('.', this.apiPrefix))
    this.appStateService.currentMfe$
      .pipe(
        first(),
        map((currentMfe) => {
          return Location.joinWithSlash(currentMfe.remoteBaseUrl, apiPrefix)
        })
      )
      .subscribe(this.basePath$)
  }

  public selectHeaderContentType(contentTypes: string[]): string | undefined {
    return this.configuration.selectHeaderContentType(contentTypes)
  }

  public selectHeaderAccept(accepts: string[]): string | undefined {
    return this.configuration.selectHeaderAccept(accepts)
  }

  public isJsonMime(mime: string): boolean {
    return this.configuration.isJsonMime(mime)
  }

  public lookupCredential(key: string): string | undefined {
    return this.configuration.lookupCredential(key)
  }

  private activator(type: unknown): Config {
    return new (<{ new (): Config }>(<unknown>type))()
  }
}

```


File : provide-connection-service.ts
```ts
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core'
import { TranslationConnectionService } from '../services/translation-connection.service'

export function provideTranslationConnectionService() {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory() {
        return () => inject(TranslationConnectionService)
      },
    },
    TranslationConnectionService,
  ]
}

```


File : remote-component-translation-path-factory.utils.ts
```ts
import { map, Observable, ReplaySubject } from 'rxjs'
import { Location } from '@angular/common'
import { RemoteComponentConfig } from '../model/remote-component-config.model'

/**
 * @deprecated Please use provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/') instead of
 *  {
      provide: TRANSLATION_PATH,
      useFactory: ... =>
        remoteComponentTranslationPathFactory('assets/i18n/')...,
      ...
    }
    to provide the translation path.
    Please make sure the webpack configuration for importMeta contains: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta.
 */
export function remoteComponentTranslationPathFactory(path: string) {
  return function TranslationPathFactory(
    remoteComponentConfig: ReplaySubject<RemoteComponentConfig>
  ): Observable<string> {
    return remoteComponentConfig.pipe(
      map((config) => {
        return Location.joinWithSlash(config.baseUrl, path)
      })
    )
  }
}

```


File : scope.utils.ts
```ts
import { AppStateService } from '@onecx/angular-integration-interface'
import { ReplaySubject, firstValueFrom, map } from 'rxjs'
import { RemoteComponentConfig } from '../model/remote-component-config.model'

export const shellScopeId = 'shell-ui'

const everythingNotACharacterOrNumberRegex = /[^a-zA-Z0-9-]/g
/**
 * @constant {string} dataStyleIdKey
 * @description Marks start of scope section for scopeId (e.g. data-style-id="onecx-workspace|onecx-workspace-ui")
 * Present for MFE and RC components as well as dynamic content
 */
export const dataStyleIdKey = 'styleId'

/**
 * @constant {string} dataStyleIsolationKey
 * @description Marks end of scope section
 * Present for MFE and RC components as well as dynamic content
 */
export const dataStyleIsolationKey = 'styleIsolation'

/**
 * @constant {string} dataNoPortalLayoutStylesKey
 * @description Should always be in pair with styleId
 * Marks that scope section does not request portal layout styles
 * Present for MFE and RC components as well as dynamic content since libs v6
 */
export const dataNoPortalLayoutStylesKey = 'noPortalLayoutStyles'

/**
 * @constant {string} dataMfeElementKey
 * @description Marks element as the mfe content
 * Marks that scope section does not request portal layout styles
 * Present for MFE and its dynamic content
 */
export const dataMfeElementKey = 'mfeElement'

/**
 * @constant {string} dataIntermediateStyleIdKey
 * @description Metadata used when appending dynamic content to ensure style scoping outside the application
 * (e.g. data-intermediate-style-id="onecx-workspace|onecx-workspace-ui")
 */
export const dataIntermediateStyleIdKey = 'intermediateStyleId'

/**
 * @constant {string} dataIntermediateMfeElementKey
 * @description Metadata used when appending dynamic content to ensure style scoping outside the application
 */
export const dataIntermediateMfeElementKey = 'intermediateMfeElement'

/**
 * @constant {string} dataIntermediateStyleIsolationKey
 * @description Metadata used when appending dynamic content to ensure style scoping outside the application
 */
export const dataIntermediateStyleIsolationKey = 'intermediateStyleIsolation'

/**
 * @constant {string} dataIntermediateNoPortalLayoutStylesKey
 * @description Metadata used when appending dynamic content to ensure style scoping outside the application
 */
export const dataIntermediateNoPortalLayoutStylesKey = 'intermediateNoPortalLayoutStyles'

/**
 * @constant {string} dataVariableOverrideIdKey
 * @description Marks the style element as one containing overrides for scope sections with scopeId
 */
export const dataVariableOverrideIdKey = 'VariableOverrideId'

/**
 * @constant {string} dataPortalLayoutStylesKey
 * @description Marks the style element as one containing portal layout styles styles
 */
export const dataPortalLayoutStylesKey = 'portalLayoutStylesStyles'

/**
 * @constant {string} dataDynamicPortalLayoutStylesKey
 * @description Marks the style element as one containing portal layout styles styles for the dynamic content
 */
export const dataDynamicPortalLayoutStylesKey = 'dynamicContentPortalLayoutStyles'

/**
 * @constant {string} dataStyleIdAttribute
 * @description HTML attribute for styleId. See {@link dataStyleIdKey} for more details.
 */
export const dataStyleIdAttribute = 'data-style-id'

/**
 * @constant {string} dataMfeElementAttribute
 * @description HTML attribute for mfe element. See {@link dataMfeElementKey} for more details.
 */
export const dataMfeElementAttribute = 'data-mfe-element'

/**
 * @constant {string} dataStyleIsolationAttribute
 * @description HTML attribute for styleIsolation. See {@link dataStyleIsolationKey} for more details.
 */
export const dataStyleIsolationAttribute = 'data-style-isolation'

/**
 * @constant {string} dataNoPortalLayoutStylesAttribute
 * @description HTML attribute for noPortalLayoutStyles. See {@link dataNoPortalLayoutStylesKey} for more details.
 */
export const dataNoPortalLayoutStylesAttribute = 'data-no-portal-layout-styles'

/**
 * @constant {string} dataIntermediateStyleIdAttribute
 * @description HTML attribute for intermediateStyleId. See {@link dataIntermediateStyleIdKey} for more details.
 */
export const dataIntermediateStyleIdAttribute = 'data-intermediate-style-id'

/**
 * @constant {string} dataIntermediateMfeElementAttribute
 * @description HTML attribute for intermediateMfeElement. See {@link dataIntermediateMfeElementKey} for more details.
 */
export const dataIntermediateMfeElementAttribute = 'data-intermediate-mfe-element'

/**
 * @constant {string} dataIntermediateStyleIsolationAttribute
 * @description HTML attribute for intermediateStyleIsolation. See {@link dataIntermediateStyleIsolationKey} for more details.
 */
export const dataIntermediateStyleIsolationAttribute = 'data-intermediate-style-isolation'

/**
 * @constant {string} dataIntermediateNoPortalLayoutStylesAttribute
 * @description HTML attribute for intermediateNoPortalLayoutStyles. See {@link dataIntermediateNoPortalLayoutStylesKey} for more details.
 */
export const dataIntermediateNoPortalLayoutStylesAttribute = 'data-intermediate-no-portal-layout-styles'

/**
 * @constant {string} dataVariableOverrideIdAttribute
 * @description HTML attribute for variableOverrideId. See {@link dataVariableOverrideIdKey} for more details.
 */
export const dataVariableOverrideIdAttribute = 'data-variable-override-id'

/**
 * @constant {string} dataPortalLayoutStylesAttribute
 * @description HTML attribute for portalLayoutStyles. See {@link dataPortalLayoutStylesKey} for more details.
 */
export const dataPortalLayoutStylesAttribute = 'data-portal-layout-styles'

/**
 * @constant {string} dataDynamicPortalLayoutStylesAttribute
 * @description HTML attribute for dynamicPortalLayoutStyles. See {@link dataDynamicPortalLayoutStylesKey} for more details.
 */
export const dataDynamicPortalLayoutStylesAttribute = 'data-dynamic-content-portal-layout-styles'

export const portalLayoutStylesSheetId = `[${dataStyleIdAttribute}]:not([${dataNoPortalLayoutStylesAttribute}])`
export const dynamicPortalLayoutStylesSheetId = `body>:not([${dataNoPortalLayoutStylesAttribute}])`

/**
 * Gets the scope identifier based on the application context
 */
// Style scoping should be skipped for Shell
// For Remote Components application data from config is taken
// For MFE data from currentMfe topic is taken
export async function getScopeIdentifier(
  appStateService: AppStateService,
  skipStyleScoping?: boolean,
  remoteComponentConfig?: ReplaySubject<RemoteComponentConfig>
) {
  let scopeId = ''
  if (!skipStyleScoping) {
    if (remoteComponentConfig) {
      const rcConfig = await firstValueFrom(remoteComponentConfig)
      scopeId = scopeIdFromProductNameAndAppId(rcConfig.productName, rcConfig.appId)
    } else {
      scopeId = await firstValueFrom(
        appStateService.currentMfe$.pipe(
          map((mfeInfo) => scopeIdFromProductNameAndAppId(mfeInfo.productName, mfeInfo.appId))
        )
      )
    }
  }
  return scopeId
}

// If scope rule is not supported, its wrapped via supports rule to be handled by the polyfill
export function scopePrimengCss(css: string, scopeId: string) {
  const isScopeSupported = isCssScopeRuleSupported()
  if (scopeId === '') {
    return isScopeSupported
      ? `
    @scope([${dataStyleIdAttribute}="${shellScopeId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]) {
            ${css}
        }
    `
      : `
    @supports (@scope([${dataStyleIdAttribute}="${shellScopeId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}])) {
            ${css}
        }
    `
  } else {
    return isScopeSupported
      ? `
    @scope([${dataStyleIdAttribute}="${scopeId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]) {
            ${css}
        }
    `
      : `
    @supports (@scope([${dataStyleIdAttribute}="${scopeId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}])) {
            ${css}
        }
    `
  }
}

// Primeng variables have --p- prefix and style scoping requires each scope to have its own version of such variable
export function replacePrimengPrefix(css: string, scopeId: string) {
  if (scopeId === '') {
    return css
  }

  return css.replaceAll('--p-', scopeIdentifierToVariablePrefix(scopeId))
}

export function scopeIdentifierToVariablePrefix(scopeId: string) {
  return '--' + scopeId.replace(everythingNotACharacterOrNumberRegex, '-') + '-'
}

export function scopeIdFromProductNameAndAppId(productName: string, appId: string) {
  if (productName.length === 0) {
    console.error(
      `Error while creating scope id for: productName = ${productName}, appId = ${appId}. Name of the product is empty. Please validate the microfrontend and remote components configuration.`
    )
  }
  if (appId.length === 0) {
    console.error(
      `Error while creating scope id for: productName = ${productName}, appId = ${appId}. Id of the application is empty. Please validate the microfrontend and remote components configuration.`
    )
  }
  return `${productName}|${appId}`
}

export function isCssScopeRuleSupported() {
  return typeof CSSScopeRule !== 'undefined'
}

```


File : translate.combined.loader.ts
```ts
import { TranslateLoader } from '@ngx-translate/core'
import { Observable, catchError, forkJoin, map, of } from 'rxjs'
import { mergeDeep } from './deep-merge.utils'
export class TranslateCombinedLoader implements TranslateLoader {
  private _loaders: TranslateLoader[]
  constructor(...loaders: TranslateLoader[]) {
    this._loaders = loaders
  }
  getTranslation(lang: string): Observable<object> {
    return forkJoin(
      this._loaders.map((l) =>
        l.getTranslation(lang).pipe(
          catchError((err) => {
            console.error('Failed to load translation file', l, err)
            return of({})
          })
        )
      )
    ).pipe(
      map((allTranslations) => {
        let result = {}
        allTranslations.forEach((translations) => {
          result = mergeDeep(result, translations)
        })
        return result
      })
    )
  }
}

```


File : translation-path-factory.utils.ts
```ts
import { combineLatest, filter, map, Observable } from "rxjs"
import { AppStateService } from "@onecx/angular-integration-interface"
import { Location } from "@angular/common"

/**
 * @deprecated Please use provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/') instead of
 *  {
      provide: TRANSLATION_PATH,
      useFactory: ... => translationPathFactory('assets/i18n/')...,
      ...
    }
    to provide the translation path. 
 *  Please make sure the webpack configuration for importMeta contains: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta.
 */
export function translationPathFactory(path: string) {
  return function TranslationPathFactory(appStateService: AppStateService): Observable<string> {
    return combineLatest([
      appStateService.currentMfe$.asObservable(),
      appStateService.globalLoading$.asObservable(),
    ]).pipe(
      filter(([, isLoading]) => !isLoading),
      map(([currentMfe]) => {
        return Location.joinWithSlash(currentMfe.remoteBaseUrl, path)
      })
    )
  }
}

```




********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************


File => onecx-portal-ui-libs > libs > angular-utils > guards > index.ts
```ts
export * from './src/utils/guards-utils.utils'
export * from './src/utils/activate-guards-wrapper.utils'
export * from './src/utils/deactivate-guards-wrapper.utils'
export * from './src/utils/wrap-guards.utils'
export * from './src/services/guards-navigation-controller.service'
export * from './src/services/guards-gatherer.service'
export * from './src/model/guard-navigation.model'

```



********************************************************************************************************************************


Folder => onecx-portal-ui-libs > libs > angular-utils > guards > src > 


File : declaration.ts
```ts
declare global {
  interface Window {
    '@onecx/angular-utils': {
      guards?: {
        debug?: boolean
      }
    }
  }
}

window['@onecx/angular-utils'] ??= {}
window['@onecx/angular-utils'].guards ??= {}

export default globalThis

```

File : test-setup.ts
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



********************************************************************************************************************************


Folder => onecx-portal-ui-libs > libs > angular-utils > guards > src > services


File : guards-gatherer.service.spec.ts
```ts
import { GuardResultResponse, GuardsGatherer } from './guards-gatherer.service'
import { Router } from '@angular/router'
import { TestBed } from '@angular/core/testing'
import { Gatherer } from '@onecx/accelerator'
import { GuardsNavigationStateController } from './guards-navigation-controller.service'
import { GUARD_CHECK } from '../model/guard-navigation.model'

jest.mock('@onecx/accelerator', () => ({
  Gatherer: jest.fn().mockImplementation(() => ({
    gather: jest.fn(),
    destroy: jest.fn(),
  })),
}))

describe('GuardsGatherer', () => {
  let service: GuardsGatherer
  const routerMock = { navigateByUrl: jest.fn() }
  const guardsNavigationStateController = {
    createGuardCheckState: jest.fn().mockReturnValue({}),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GuardsGatherer,
        { provide: Router, useValue: routerMock },
        { provide: GuardsNavigationStateController, useValue: guardsNavigationStateController },
      ],
    })

    service = TestBed.inject(GuardsGatherer)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should destroy guardsGatherer on destroy', () => {
    service.activate()
    expect(service['guardsGatherer']).toBeDefined()
    const destroySpy = jest.spyOn(service['guardsGatherer']!, 'destroy')

    service.ngOnDestroy()

    expect(destroySpy).toHaveBeenCalled()
  })

  it('should activate the gatherer', () => {
    service.activate()
    expect(Gatherer).toHaveBeenCalledWith('GuardGatherer', 1, expect.any(Function))
  })

  it('should destroy the gatherer on deactivate', () => {
    service.activate()
    expect(service['guardsGatherer']).toBeDefined()
    const destroySpy = jest.spyOn(service['guardsGatherer']!, 'destroy')

    service.deactivate()
    expect(destroySpy).toHaveBeenCalled()
  })

  it('should gather guard results', async () => {
    service.activate()
    const request = { url: '/test' }
    const response = [true, true]

    service['guardsGatherer']!.gather = jest.fn().mockResolvedValue(response)

    const result = await service.gather(request)

    expect(service['guardsGatherer']!.gather).toHaveBeenCalledWith(request)
    expect(result).toBe(response)
  })

  it('should throw error if gather is called before activation', async () => {
    const request = { url: '/test' }

    expect(() => service.gather(request)).toThrow('Guards gatherer is not active')
  })

  it('should call executeGuardsCallback on gather', async () => {
    service.activate()
    const request = { url: '/test' }
    const navigateSpy = jest.spyOn(routerMock, 'navigateByUrl')
    guardsNavigationStateController.createGuardCheckState.mockReturnValue({ [GUARD_CHECK]: true })

    // Mock the callback function call
    service['executeGuardsCallback'](request)

    expect(navigateSpy).toHaveBeenCalledWith(request.url, {
      state: guardsNavigationStateController.createGuardCheckState(),
      onSameUrlNavigation: 'reload',
    })
    expect(service['guardsChecks']).toBeDefined()
    expect(service['guardsChecks']!.get(request.url)).toBeDefined()
  })

  it('should throw an error if executeGuardsCallback is called when not active', async () => {
    await expect(() => service['executeGuardsCallback']({ url: '/test' })).rejects.toThrow(
      'Guards gatherer is not active'
    )
  })

  it('should resolve route with guard result response', () => {
    service.activate()
    expect(service['guardsChecks']).toBeDefined()
    const routeUrl = '/test'
    const promiseToResolve = new Promise<GuardResultResponse>((resolve) =>
      service['guardsChecks']!.set(routeUrl, resolve)
    )
    expect(service['guardsChecks']!.get(routeUrl)).toBeDefined()

    service.resolveRoute(routeUrl, true)
    expect(promiseToResolve).resolves.toBe(true)
    expect(service['guardsChecks']!.get(routeUrl)).toBeUndefined()
  })

  it('should throw an error if resolveRoute is called when not active', () => {
    expect(() => service.resolveRoute('/test', true)).toThrow('Guards gatherer is not active')
  })
})

```


File : guards-gatherer.service.ts
```ts
import { inject, Injectable, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Gatherer } from '@onecx/accelerator'
import { GuardsNavigationStateController } from './guards-navigation-controller.service'
import { logGuardsDebug } from '../utils/guards-utils.utils'

/**
 * Request for performing guard checks.
 * It contains the URL of the route for which the guard checks are requested.
 */
export type GuardResultRequest = {
  url: string
}

/**
 * Response for the guard checks.
 * It indicates whether the guard checks were successful or not.
 */
export type GuardResultResponse = boolean

export const GUARDS_GATHERER_NAME = 'GuardGatherer'

/**
 * GuardsGatherer is used to gather results of navigation guards.
 * It allows to perform guard checks of the application.
 * GuardsGatherer adds information in the navigation state to request guard checks.
 * It is expected that guards wrappers will use this information to perform checks and respond if checks are not successful. Otherwise, it will proceed with the navigation and navigation will be rejected on GuardsCheckEnd and results will be reported.
 * It uses a Gatherer to manage the requests and responses.
 */
@Injectable({
  providedIn: 'root',
})
export class GuardsGatherer implements OnDestroy {
  private guardsGatherer: Gatherer<GuardResultRequest, GuardResultResponse> | undefined
  private guardsChecks: Map<string, (value: GuardResultResponse) => void> | undefined
  private guardsNavigationStateController = inject(GuardsNavigationStateController)

  constructor(private router: Router) {}

  ngOnDestroy(): void {
    this.guardsGatherer?.destroy()
  }

  /**
   * Schedules a request to gather guard results.
   * @param request - the request to gather guard results
   * @returns Promise that resolves with the response of the guard results.
   */
  gather(request: GuardResultRequest) {
    if (this.guardsGatherer === undefined) {
      this.throwNotActiveError()
    }
    request.url = this.normalizeUrl(request.url)
    return this.guardsGatherer.gather(request)
  }

  /**
   * Resolves the guard results for a specific route.
   * @param routeUrl - the URL of the route for which the guard results are resolved
   * @param response - the response of the guard result
   */
  resolveRoute(routeUrl: string, response: GuardResultResponse) {
    if (this.guardsChecks === undefined) {
      this.throwNotActiveError()
    }
    const url = this.normalizeUrl(routeUrl)
    const resolve = this.guardsChecks.get(url)
    resolve && resolve(response)
    this.guardsChecks.delete(url)
  }

  /**
   * Activates the GuardsGatherer service.
   * It initializes the Gatherer and sets up the callback to execute guard checks.
   */
  activate(): void {
    this.guardsGatherer = new Gatherer(GUARDS_GATHERER_NAME, 1, (request) => this.executeGuardsCallback(request))
    this.guardsChecks = new Map()
  }

  /**
   * Deactivates the GuardsGatherer service.
   * It destroys the Gatherer and clears the checks.
   */
  deactivate(): void {
    this.guardsGatherer?.destroy()
    delete this.guardsChecks
  }

  private executeGuardsCallback(request: GuardResultRequest): Promise<GuardResultResponse> {
    logGuardsDebug('Executing callback for request:', request)
    const routeUrl = request.url

    // Fake navigation to request guard check
    this.router.navigateByUrl(routeUrl, {
      state: this.guardsNavigationStateController.createGuardCheckState(),
      // Important, force navigation
      // to ensure that we are checking guards
      // even if the route is already active.
      onSameUrlNavigation: 'reload',
    })

    let resolve: (value: GuardResultResponse) => void
    return new Promise<GuardResultResponse>((r) => {
      resolve = r
      if (this.guardsChecks === undefined) {
        this.throwNotActiveError()
      }
      this.guardsChecks.set(routeUrl, resolve)
    })
  }

  private normalizeUrl(url: string): string {
    let result = url
    result = result.startsWith('/') ? result : `/${result}`
    result = result.endsWith('/') ? result.slice(0, -1) : result
    return result
  }

  private throwNotActiveError(): never {
    throw new Error('Guards gatherer is not active')
  }
}

```


File : guards-navigation-controller.service.spec.ts
```ts
import { GuardsNavigationStateController } from './guards-navigation-controller.service'
import {
  GUARD_CHECK,
  GUARD_CHECK_PROMISE,
  GUARD_MODE,
  IS_INITIAL_ROUTER_SYNC,
  IS_ROUTER_SYNC,
} from '../model/guard-navigation.model'

describe('GuardsNavigationStateController', () => {
  let controller: GuardsNavigationStateController

  beforeEach(() => {
    controller = new GuardsNavigationStateController()
  })

  it('should return INITIAL_ROUTER_SYNC mode if IS_INITIAL_ROUTER_SYNC is true', () => {
    const state = { [IS_INITIAL_ROUTER_SYNC]: true }
    expect(controller.getMode(state)).toBe(GUARD_MODE.INITIAL_ROUTER_SYNC)
  })

  it('should return ROUTER_SYNC mode if IS_ROUTER_SYNC is true', () => {
    const state = { [IS_ROUTER_SYNC]: true }
    expect(controller.getMode(state)).toBe(GUARD_MODE.ROUTER_SYNC)
  })

  it('should return GUARD_CHECK mode if GUARD_CHECK is true', () => {
    const state = { [GUARD_CHECK]: true }
    expect(controller.getMode(state)).toBe(GUARD_MODE.GUARD_CHECK)
  })

  it('should return NAVIGATION_REQUESTED mode if no other mode is set', () => {
    const state = {}
    expect(controller.getMode(state)).toBe(GUARD_MODE.NAVIGATION_REQUESTED)
  })

  it('should create initial router sync state', () => {
    const state = controller.createInitialRouterSyncState()
    expect(state[IS_ROUTER_SYNC]).toBe(true)
    expect(state[IS_INITIAL_ROUTER_SYNC]).toBe(true)
  })

  it('should modify existing state to initial router sync state', () => {
    const existingState = {}
    const expectedState = {
      [IS_ROUTER_SYNC]: true,
      [IS_INITIAL_ROUTER_SYNC]: true,
    }

    const state = controller.createInitialRouterSyncState(existingState)

    expect(state).toBe(existingState)
    expect(state).toEqual(expectedState)
  })

  it('should create guard check state', () => {
    const state = controller.createGuardCheckState()
    expect(state[GUARD_CHECK]).toBe(true)
  })

  it('should modify existing state to guard check state', () => {
    const existingState = {}
    const state = controller.createGuardCheckState(existingState)
    expect(state).toBe(existingState)
    expect(state[GUARD_CHECK]).toBe(true)
  })

  it('should create navigation requested state', () => {
    const mockPromise = Promise.resolve(true)
    const state = controller.createNavigationRequestedState(mockPromise)
    expect(state[GUARD_CHECK_PROMISE]).toBe(mockPromise)
  })

  it('should modify existing state to navigation requested state', () => {
    const mockPromise = Promise.resolve(true)
    const existingState = {}
    const state = controller.createNavigationRequestedState(mockPromise, existingState)
    expect(state).toBe(existingState)
    expect(state[GUARD_CHECK_PROMISE]).toBe(mockPromise)
  })

  it('should retrieve GuardCheckPromise from state', () => {
    const mockPromise = Promise.resolve(true)
    const state = { [GUARD_CHECK_PROMISE]: mockPromise }
    expect(controller.getGuardCheckPromise(state)).toBe(mockPromise)
  })

  it('should return undefined if GuardCheckPromise is not in state', () => {
    const state = {}
    expect(controller.getGuardCheckPromise(state)).toBeUndefined()
  })
})

```


File : guards-navigation-controller.service.ts
```ts
import { Injectable } from '@angular/core'
import {
  GUARD_CHECK,
  GUARD_CHECK_PROMISE,
  GUARD_MODE,
  GuardCheckPromise,
  GuardsNavigationState,
  IS_INITIAL_ROUTER_SYNC,
  IS_ROUTER_SYNC,
} from '../model/guard-navigation.model'

/**
 * GuardsNavigationController is a service that manages the navigation state for guards.
 */
@Injectable({ providedIn: 'any' })
export class GuardsNavigationStateController {
  /**
   * Retrieves the current mode of the guards navigation state.
   * @param guardsNavigationState - the GuardsNavigationState to check
   * @returns GUARD_MODE indicating the current mode of the guards navigation state
   */
  getMode(guardsNavigationState: GuardsNavigationState): GUARD_MODE {
    if (guardsNavigationState[IS_INITIAL_ROUTER_SYNC]) {
      return GUARD_MODE.INITIAL_ROUTER_SYNC
    }

    if (guardsNavigationState[IS_ROUTER_SYNC]) {
      return GUARD_MODE.ROUTER_SYNC
    }

    if (guardsNavigationState[GUARD_CHECK]) {
      return GUARD_MODE.GUARD_CHECK
    }

    return GUARD_MODE.NAVIGATION_REQUESTED
  }

  /**
   * Creates an initial router sync state for guards navigation.
   * @param guardsNavigationState - optional GuardsNavigationState to modify
   * @returns GuardsNavigationState with initial router sync state
   */
  createInitialRouterSyncState(guardsNavigationState?: GuardsNavigationState): GuardsNavigationState {
    if (guardsNavigationState) {
      guardsNavigationState[IS_ROUTER_SYNC] = true
      guardsNavigationState[IS_INITIAL_ROUTER_SYNC] = true
      return guardsNavigationState
    }

    return {
      [IS_ROUTER_SYNC]: true,
      [IS_INITIAL_ROUTER_SYNC]: true,
    }
  }

  /**
   * Creates a router sync state for guards navigation.
   * @param guardsNavigationState - optional GuardsNavigationState to modify
   * @returns GuardsNavigationState with router sync state
   */
  createGuardCheckState(guardsNavigationState?: GuardsNavigationState): GuardsNavigationState {
    if (guardsNavigationState) {
      guardsNavigationState[GUARD_CHECK] = true
      return guardsNavigationState
    }

    return { [GUARD_CHECK]: true }
  }

  /**
   * Creates a navigation requested state for guards navigation.
   * @param guardsCheckPromise - the promise to resolve guard checks
   * @param guardsNavigationState - optional GuardsNavigationState to modify
   * @returns GuardsNavigationState with navigation requested state
   */
  createNavigationRequestedState(
    guardsCheckPromise: GuardCheckPromise,
    guardsNavigationState?: GuardsNavigationState
  ): GuardsNavigationState {
    if (guardsNavigationState) {
      guardsNavigationState[GUARD_CHECK_PROMISE] = guardsCheckPromise
      return guardsNavigationState
    }

    return { [GUARD_CHECK_PROMISE]: guardsCheckPromise }
  }

  /**
   * Retrieves the GuardCheckPromise from the provided GuardsNavigationState.
   * @param state - the GuardsNavigationState to check
   * @returns GuardCheckPromise if it exists, undefined otherwise
   */
  getGuardCheckPromise(state: GuardsNavigationState): GuardCheckPromise | undefined {
    return state[GUARD_CHECK_PROMISE]
  }
}

```



********************************************************************************************************************************


Folder => onecx-portal-ui-libs > libs > angular-utils > guards > src > utils


File : activate-guards-wrapper.utils.spec.ts
```ts
import { TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { ActivateGuardsWrapper } from './activate-guards-wrapper.utils'
import { GuardsNavigationStateController } from '../services/guards-navigation-controller.service'
import { provideGuardsGathererMock } from '@onecx/angular-utils/mocks'
import { GuardsGatherer } from '../services/guards-gatherer.service'
import { GUARD_MODE } from '../model/guard-navigation.model'
import { Injectable } from '@angular/core'

@Injectable()
class MockGuard {
  canActivate(_route: any, _state: any): Promise<boolean> {
    console.log('MockGuard canActivate')
    return Promise.resolve(true)
  }
}

@Injectable()
class GenericClass {}

describe('ActivateGuardsWrapper', () => {
  let wrapper: ActivateGuardsWrapper
  let mockRouter: jest.Mocked<Router>
  let mockGuardsGatherer: GuardsGatherer
  let mockNavigationStateController: jest.Mocked<Partial<GuardsNavigationStateController>>

  beforeEach(() => {
    mockRouter = {
      getCurrentNavigation: jest.fn(),
    } as unknown as jest.Mocked<Router>
    mockNavigationStateController = {
      getMode: jest.fn().mockReturnValue('NAVIGATION_REQUESTED'),
      getGuardCheckPromise: jest.fn().mockReturnValue(Promise.resolve()),
    } as jest.Mocked<Partial<GuardsNavigationStateController>>

    TestBed.configureTestingModule({
      providers: [
        ActivateGuardsWrapper,
        { provide: Router, useValue: mockRouter },
        provideGuardsGathererMock(),
        { provide: GuardsNavigationStateController, useValue: mockNavigationStateController },
        MockGuard,
        GenericClass,
      ],
    })

    wrapper = TestBed.inject(ActivateGuardsWrapper)
    mockGuardsGatherer = TestBed.inject(GuardsGatherer)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be created', () => {
    expect(wrapper).toBeTruthy()
  })

  describe('INITIAL_ROUTER_SYNC', () => {
    it('should run guard and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.INITIAL_ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(true)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(true)
    })

    it('should run guard and return false for failed guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.INITIAL_ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(false)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(false)
    })
  })

  describe('ROUTER_SYNC', () => {
    it('should run guards and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(true)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(true)
    })
  })

  describe('GUARD_CHECK', () => {
    it('should run guards, resolve route and return false for failed guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

      const guardsGathererSpy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      const mockGuard = jest.fn().mockResolvedValue(false)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(false)
      expect(guardsGathererSpy).toHaveBeenCalledWith('test/route', false)
    })

    it('should run guards and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

      const guardsGathererSpy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      const mockGuard = jest.fn().mockResolvedValue(true)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(true)
      expect(guardsGathererSpy).not.toHaveBeenCalled()
    })
  })

  describe('NAVIGATION_REQUESTED', () => {
    it('should wait for guard check promise and return false if guard check fails', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(Promise.resolve(false))

      const mockGuard = jest.fn().mockResolvedValue(true)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('should wait for guard check promise and return true if guard check passes', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(Promise.resolve(true))

      const mockGuard = jest.fn().mockResolvedValue(true)
      const route = {
        routeConfig: {},
        url: [{ path: 'test' }, { path: 'route' }],
      } as any
      const state = {} as any

      const result = await wrapper.canActivate(route, state, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(route, state)
      expect(result).toBe(true)
    })
  })

  it('should handle no route config gracefully', async () => {
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const mockGuard = jest.fn().mockResolvedValue(false)
    const route = {
      routeConfig: null,
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [mockGuard])

    expect(result).toBe(true)
    expect(mockGuard).not.toHaveBeenCalled()
  })

  it('should handle no guards gracefully', async () => {
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const mockGuard = jest.fn().mockResolvedValue(true)
    const route = {
      routeConfig: {},
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [])

    expect(result).toBe(true)
    expect(mockGuard).not.toHaveBeenCalled()
  })

  it('should handle class based guards', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const route = {
      routeConfig: {},
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [MockGuard])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('MockGuard canActivate')
  })

  it('should handle function based guards', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const mockGuard = jest.fn().mockImplementation(() => {
      console.log('mockGuard function canActivate')
      return Promise.resolve(true)
    })
    const route = {
      routeConfig: {},
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [mockGuard])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('mockGuard function canActivate')
  })

  it('should handle classes not implementing CanActivate', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const route = {
      routeConfig: {},
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [GenericClass as any])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('Guard does not implement canActivate:', expect.any(Function))
  })

  it('should handle no check promise in navigation state', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
    guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(null)

    const route = {
      routeConfig: {},
      url: [{ path: 'test' }, { path: 'route' }],
    } as any
    const state = {} as any

    const result = await wrapper.canActivate(route, state, [])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('No guard check promise found in guards navigation state, returning true.')
  })
})

```


File : activate-guards-wrapper.utils.ts
```ts
import { inject, Injectable, Injector, Type } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { GuardsGatherer } from '../services/guards-gatherer.service'
import { GuardsNavigationStateController } from '../services/guards-navigation-controller.service'
import { GUARD_MODE, GuardsNavigationState } from '../model/guard-navigation.model'
import {
  combineToBoolean,
  combineToGuardResult,
  executeRouterSyncGuard,
  getUrlFromSnapshot,
  logGuardsDebug,
  resolveToPromise,
} from './guards-utils.utils'

/**
 * Wrapper for canActivate guards that handles the navigation state and executes guards accordingly.
 *
 * It performs the activation checks in different scenarios based on the navigation state.
 */
@Injectable({ providedIn: 'root' })
export class ActivateGuardsWrapper {
  private injector = inject(Injector)
  private guardsGatherer = inject(GuardsGatherer)
  protected router = inject(Router)
  private guardsNavigationStateController = inject(GuardsNavigationStateController)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    guards: Array<CanActivateFn | Type<CanActivate>>
  ): MaybeAsync<GuardResult> {
    const guardsNavigationState = this.router.getCurrentNavigation()?.extras.state ?? ({} as GuardsNavigationState)
    const futureUrl = getUrlFromSnapshot(route)

    switch (this.guardsNavigationStateController.getMode(guardsNavigationState)) {
      // We need to let guards run if this is initial router sync
      // If navigation cannot be performed, a new event for window.history will be emitted with navigationId === -1
      // This will be handled by the Shell
      // Additionally, during GuardsCheckEnd, the results will be reported so Shell can decide what to do
      case GUARD_MODE.INITIAL_ROUTER_SYNC:
        return this.executeActivateGuards(route, state, guards, combineToBoolean)
      case GUARD_MODE.ROUTER_SYNC:
        return this.executeActivateGuards(route, state, guards, combineToBoolean).then(() => executeRouterSyncGuard())
      case GUARD_MODE.GUARD_CHECK:
        return this.executeActivateGuards(route, state, guards, combineToBoolean).then((result) => {
          if (result === false) {
            logGuardsDebug('GuardCheck - Route is guarded for activation, resolving false.')
            this.guardsGatherer.resolveRoute(futureUrl, false)
          }

          return result
        })
      case GUARD_MODE.NAVIGATION_REQUESTED: {
        //Wait until we received info from others
        let checkStartPromise = this.guardsNavigationStateController.getGuardCheckPromise(guardsNavigationState)
        if (!checkStartPromise) {
          console.warn('No guard check promise found in guards navigation state, returning true.')
          checkStartPromise = Promise.resolve(true)
        }
        return checkStartPromise.then((result) => {
          if (result === false) {
            console.warn(
              `Cannot route to ${futureUrl} because ${state.url} deactivation is guarded or ${futureUrl} activation its guarded.`
            )
            return false
          }
          return this.executeActivateGuards(route, state, guards, combineToGuardResult)
        })
      }
    }
  }

  private executeActivateGuards<T extends boolean | GuardResult>(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    guards: Array<CanActivateFn | Type<CanActivate>>,
    combineFn: (results: GuardResult[]) => T
  ): Promise<T> {
    if (!route.routeConfig) {
      console.warn('No route configuration found for canActivate guard.')
      logGuardsDebug('No route configuration found for canActivate guard.')
      return Promise.resolve(true as T)
    }

    const canActivateFunctions = guards.map((guard) => this.mapActivateGuardToFunctionReturningPromise(guard))

    const canActivateResults = Promise.all(
      canActivateFunctions.map((fn) => {
        try {
          return fn(route, state)
        } catch (error) {
          console.warn('Guard does not implement canActivate:', fn)
          return Promise.resolve(true) // Default to true if guard does not implement canActivate
        }
      })
    )
    return canActivateResults.then((results) => combineFn(results))
  }
  private mapActivateGuardToFunctionReturningPromise(
    guard: Type<CanActivate> | CanActivateFn
  ): (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Promise<GuardResult> {
    if (this.isCanActivateClassBasedGuard(guard)) {
      // guard for CanActivate is not a guard instance but class definition
      const guardInstance = this.injector.get(guard)
      return (route, state) => resolveToPromise(guardInstance.canActivate(route, state))
    }

    return (route, state) => resolveToPromise(guard(route, state))
  }

  private isCanActivateClassBasedGuard(guard: Type<CanActivate> | CanActivateFn): guard is Type<CanActivate> {
    return typeof guard === 'function' && guard.prototype && 'canActivate' in guard.prototype
  }
}

```


File : deactivate-guards-wrapper.utils.spec.ts
```ts
import { TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { DeactivateGuardsWrapper } from './deactivate-guards-wrapper.utils'
import { GuardsNavigationStateController } from '../services/guards-navigation-controller.service'
import { GUARD_MODE } from '../model/guard-navigation.model'
import { Injectable } from '@angular/core'
import { GuardsGatherer } from '../services/guards-gatherer.service'
import { provideGuardsGathererMock } from '@onecx/angular-utils/mocks'

@Injectable()
class MockGuard {
  canDeactivate(_component: any, _currentRoute: any, _currentState: any, _nextState: any) {
    console.log('MockGuard canDeactivate called')
    return Promise.resolve(true)
  }
}

@Injectable()
class GenericClass {}

describe('DeactivateGuardsWrapper', () => {
  let wrapper: DeactivateGuardsWrapper
  let mockRouter: jest.Mocked<Router>
  let mockGuardsGatherer: GuardsGatherer
  let mockNavigationStateController: jest.Mocked<Partial<GuardsNavigationStateController>>

  beforeEach(() => {
    mockRouter = {
      getCurrentNavigation: jest.fn(),
    } as unknown as jest.Mocked<Router>
    mockNavigationStateController = {
      getMode: jest.fn().mockReturnValue('NAVIGATION_REQUESTED'),
      getGuardCheckPromise: jest.fn().mockReturnValue(Promise.resolve()),
    } as jest.Mocked<Partial<GuardsNavigationStateController>>

    TestBed.configureTestingModule({
      providers: [
        DeactivateGuardsWrapper,
        { provide: Router, useValue: mockRouter },
        { provide: GuardsNavigationStateController, useValue: mockNavigationStateController },
        provideGuardsGathererMock(),
        MockGuard,
        GenericClass,
      ],
    })

    wrapper = TestBed.inject(DeactivateGuardsWrapper)
    mockGuardsGatherer = TestBed.inject(GuardsGatherer)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be created', () => {
    expect(wrapper).toBeTruthy()
  })

  describe('INITIAL_ROUTER_SYNC', () => {
    it('should run guard and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.INITIAL_ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(true)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(component, currentRoute, currentState, nextState)
      expect(result).toBe(true)
    })

    it('should run guard and return false for failed guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.INITIAL_ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(false)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(component, currentRoute, currentState, nextState)
      expect(result).toBe(false)
    })
  })

  describe('ROUTER_SYNC', () => {
    it('should run guards and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.ROUTER_SYNC)

      const mockGuard = jest.fn().mockResolvedValue(true)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {} as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(component, currentRoute, currentState, nextState)
      expect(result).toBe(true)
    })
  })

  describe('GUARD_CHECK', () => {
    it('should run guards, resolve route and return false for failed guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

      const guardsGathererSpy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      const mockGuard = jest.fn().mockResolvedValue(false)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(component, currentRoute, currentState, nextState)
      expect(result).toBe(false)
      expect(guardsGathererSpy).toHaveBeenCalledWith(nextState.url, false)
    })

    it('should run guards and return true for successful guard check', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

      const guardsGathererSpy = jest.spyOn(mockGuardsGatherer, 'resolveRoute')
      const mockGuard = jest.fn().mockResolvedValue(true)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(mockGuard).toHaveBeenCalledWith(component, currentRoute, currentState, nextState)
      expect(result).toBe(true)
      expect(guardsGathererSpy).not.toHaveBeenCalled()
    })
  })

  describe('NAVIGATION_REQUESTED', () => {
    it('should wait for guard check promise and return false if guard check fails', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(Promise.resolve(false))

      const mockGuard = jest.fn().mockResolvedValue(true)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(result).toBe(false)
    })

    it('should wait for guard check promise and return true if guard check passes', async () => {
      const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
      guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
      guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(Promise.resolve(true))

      const mockGuard = jest.fn().mockResolvedValue(true)
      const component = {}
      const currentRoute = {
        routeConfig: {},
      } as any
      const currentState = {} as any
      const nextState = {
        url: 'test/url',
      } as any

      const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

      expect(result).toBe(true)
    })
  })

  it('should handle no route config gracefully', async () => {
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const mockGuard = jest.fn().mockResolvedValue(true)
    const component = {}
    const currentRoute = {} as any // No routeConfig
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

    expect(result).toBe(true)
    expect(mockGuard).not.toHaveBeenCalled()
  })

  it('should handle empty guards array', async () => {
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const component = {}
    const currentRoute = {
      routeConfig: {},
    } as any
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [])

    expect(result).toBe(true)
  })

  it('should handle class based guards', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const component = {}
    const currentRoute = {
      routeConfig: {},
    } as any
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [MockGuard])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('MockGuard canDeactivate called')
  })

  it('should handle function based guards', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const mockGuard = jest.fn().mockImplementation(() => {
      console.log('mockGuard function canDeactivate')
      return Promise.resolve(true)
    })
    const component = {}
    const currentRoute = {
      routeConfig: {},
    } as any
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [mockGuard])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('mockGuard function canDeactivate')
  })

  it('should handle classes not implementing canDeactivate', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.GUARD_CHECK)

    const component = {}
    const currentRoute = {
      routeConfig: {},
    } as any
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [GenericClass as any])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('Guard does not implement canDeactivate:', expect.any(Function))
  })

  it('should handle no check promise in navigation state', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const guardsNavigationStateController = TestBed.inject(GuardsNavigationStateController)
    guardsNavigationStateController.getMode = jest.fn().mockReturnValue(GUARD_MODE.NAVIGATION_REQUESTED)
    guardsNavigationStateController.getGuardCheckPromise = jest.fn().mockReturnValue(null)

    const component = {}
    const currentRoute = {
      routeConfig: {},
    } as any
    const currentState = {} as any
    const nextState = {
      url: 'test/url',
    } as any

    const result = await wrapper.canDeactivate(component, currentRoute, currentState, nextState, [])

    expect(result).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('No guard check promise found in guards navigation state, returning true.')
  })
})

```


File : deactivate-guards-wrapper.utils.ts
```ts
import { inject, Injectable, Injector, Type } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  CanDeactivateFn,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { GuardsGatherer } from '../services/guards-gatherer.service'
import { GuardsNavigationStateController } from '../services/guards-navigation-controller.service'
import { GUARD_MODE, GuardsNavigationState } from '../model/guard-navigation.model'
import {
  combineToBoolean,
  combineToGuardResult,
  executeRouterSyncGuard,
  logGuardsDebug,
  resolveToPromise,
} from './guards-utils.utils'

/**
 * Wrapper for canDeactivate guards that handles the navigation state and executes guards accordingly.
 *
 * It performs the deactivation checks in different scenarios based on the navigation state
 */
@Injectable({ providedIn: 'root' })
export class DeactivateGuardsWrapper {
  private injector = inject(Injector)
  private guardsGatherer = inject(GuardsGatherer)
  protected router = inject(Router)
  private guardsNavigationStateController = inject(GuardsNavigationStateController)

  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
    guards: Array<CanDeactivateFn<any> | Type<CanDeactivate<any>>>
  ): MaybeAsync<GuardResult> {
    const guardsNavigationState = (this.router.getCurrentNavigation()?.extras.state ?? {}) as GuardsNavigationState
    const futureUrl = nextState.url

    switch (this.guardsNavigationStateController.getMode(guardsNavigationState)) {
      case GUARD_MODE.INITIAL_ROUTER_SYNC:
        return this.executeDeactivateGuards(component, currentRoute, currentState, nextState, guards, combineToBoolean)
      case GUARD_MODE.ROUTER_SYNC:
        return this.executeDeactivateGuards(
          component,
          currentRoute,
          currentState,
          nextState,
          guards,
          combineToBoolean
        ).then(() => executeRouterSyncGuard())
      case GUARD_MODE.GUARD_CHECK:
        return this.executeDeactivateGuards(
          component,
          currentRoute,
          currentState,
          nextState,
          guards,
          combineToBoolean
        ).then((result) => {
          if (result === false) {
            logGuardsDebug('GuardCheck - Route is guarded for deactivation, resolving false.')
            this.guardsGatherer.resolveRoute(futureUrl, false)
          }

          return result
        })
      case GUARD_MODE.NAVIGATION_REQUESTED: {
        //Wait until we received info from others
        let checkStartPromise = this.guardsNavigationStateController.getGuardCheckPromise(guardsNavigationState)
        if (!checkStartPromise) {
          console.warn('No guard check promise found in guards navigation state, returning true.')
          checkStartPromise = Promise.resolve(true)
        }
        return checkStartPromise.then((result) => {
          if (result === false) {
            console.warn(
              `Cannot route to ${futureUrl} because ${currentState.url} deactivation is guarded or ${futureUrl} activation its guarded.`
            )
            return false
          }
          return this.executeDeactivateGuards(
            component,
            currentRoute,
            currentState,
            nextState,
            guards,
            combineToGuardResult
          )
        })
      }
    }
  }

  private executeDeactivateGuards<T extends boolean | GuardResult>(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
    guards: Array<CanDeactivateFn<any> | Type<CanDeactivate<any>>>,
    combineFn: (results: GuardResult[]) => T
  ) {
    if (!currentRoute.routeConfig) {
      logGuardsDebug('No route configuration found for canActivate guard.')
      return Promise.resolve(true as T)
    }

    const canDeactivateFunctions = guards.map((guard) => this.mapDeactivateGuardToFunctionReturningPromise(guard))

    const canDeactivateResults = Promise.all(
      canDeactivateFunctions.map((fn) => {
        try {
          return fn(component, currentRoute, currentState, nextState)
        } catch (error) {
          console.warn('Guard does not implement canDeactivate:', fn)
          return Promise.resolve(true) // Default to true if guard does not implement canDeactivate
        }
      })
    )
    return canDeactivateResults.then((results) => combineFn(results))
  }

  private mapDeactivateGuardToFunctionReturningPromise(
    guard: Type<CanDeactivate<any>> | CanDeactivateFn<any>
  ): (
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) => Promise<GuardResult> {
    if (this.isCanDeactivateClassBasedGuard(guard)) {
      // guard for CanDeactivate is not a guard instance but class definition
      const guardInstance = this.injector.get(guard)
      return (component, currentRoute, currentState, nextState) =>
        resolveToPromise(guardInstance.canDeactivate(component, currentRoute, currentState, nextState))
    }

    return (component, currentRoute, currentState, nextState) =>
      resolveToPromise(guard(component, currentRoute, currentState, nextState))
  }

  private isCanDeactivateClassBasedGuard(
    guard: Type<CanDeactivate<any>> | CanDeactivateFn<any>
  ): guard is Type<CanDeactivate<any>> {
    return typeof guard === 'function' && guard.prototype && 'canDeactivate' in guard.prototype
  }
}

```


File : guards-utils.utils.spec.ts
```ts
import {
  logGuardsDebug,
  executeRouterSyncGuard,
  combineToGuardResult,
  combineToBoolean,
  resolveToPromise,
  getUrlFromSnapshot,
} from './guards-utils.utils'
import { RedirectCommand, UrlTree, ActivatedRouteSnapshot } from '@angular/router'
import { of } from 'rxjs'

describe('logGuardsDebug', () => {
  const originalConsoleLog = console.log
  const originalDebugState = window['@onecx/angular-utils']?.guards?.debug

  beforeEach(() => {
    console.log = jest.fn()
    window['@onecx/angular-utils'] = window['@onecx/angular-utils'] || {}
    window['@onecx/angular-utils'].guards = window['@onecx/angular-utils'].guards || {}
  })

  afterEach(() => {
    console.log = originalConsoleLog
    window['@onecx/angular-utils']!.guards!.debug = originalDebugState
  })

  it('should log debug information when debug mode is enabled', () => {
    window['@onecx/angular-utils']!.guards!.debug = true

    logGuardsDebug('Test message', { key: 'value' })

    expect(console.log).toHaveBeenCalledWith('Guards:', 'Test message', { key: 'value' })
  })

  it('should not log debug information when debug mode is disabled', () => {
    window['@onecx/angular-utils']!.guards!.debug = false

    logGuardsDebug('Test message', { key: 'value' })

    expect(console.log).not.toHaveBeenCalled()
  })
})

describe('executeRouterSyncGuard', () => {
  const originalConsoleLog = console.log

  beforeEach(() => {
    console.log = jest.fn()
    window['@onecx/angular-utils']!.guards!.debug = true
  })

  afterEach(() => {
    console.log = originalConsoleLog
    window['@onecx/angular-utils']!.guards!.debug = false
  })

  it('should log a message and return true', () => {
    const result = executeRouterSyncGuard()

    expect(console.log).toHaveBeenCalledWith('Guards:', 'Was RouterSync, returning true.')
    expect(result).toBe(true)
  })
})

describe('combineToGuardResult', () => {
  it('should return false if any guard result is false', () => {
    const results = [true, false, true]
    const result = combineToGuardResult(results)
    expect(result).toBe(false)
  })

  it('should return the first UrlTree if any guard result is an UrlTree', () => {
    const mockUrlTree = new UrlTree()
    const results = [true, mockUrlTree, true]
    const result = combineToGuardResult(results)
    expect(result).toBe(mockUrlTree)
  })

  it('should return the first RedirectCommand if any guard result is a RedirectCommand', () => {
    const mockRedirectCommand = new RedirectCommand(new UrlTree())
    const results = [true, mockRedirectCommand, true]
    const result = combineToGuardResult(results)
    expect(result).toBe(mockRedirectCommand)
  })

  it('should return true if all guard results are true', () => {
    const results = [true, true, true]
    const result = combineToGuardResult(results)
    expect(result).toBe(true)
  })
})

describe('combineToBoolean', () => {
  it('should return false if any guard result is false', () => {
    const results = [true, false, true]
    const result = combineToBoolean(results)
    expect(result).toBe(false)
  })

  it('should return true if all guard results are true', () => {
    const results = [true, true, true]
    const result = combineToBoolean(results)
    expect(result).toBe(true)
  })
})

describe('resolveToPromise', () => {
  it('should resolve a Promise directly', async () => {
    const mockPromise = Promise.resolve(true)
    const result = await resolveToPromise(mockPromise)
    expect(result).toBe(true)
  })

  it('should resolve an Observable to a Promise', async () => {
    const mockObservable = of(true)
    const result = await resolveToPromise(mockObservable)
    expect(result).toBe(true)
  })

  it('should resolve a plain value to a Promise', async () => {
    const mockValue = true
    const result = await resolveToPromise(mockValue)
    expect(result).toBe(true)
  })
})

describe('getUrlFromSnapshot', () => {
  it('should return the full URL from a nested ActivatedRouteSnapshot', () => {
    const childRoute = {
      url: [{ path: 'child' }],
      parent: null,
    } as unknown as ActivatedRouteSnapshot

    const parentRoute = {
      url: [{ path: 'parent' }],
      parent: null,
    } as unknown as ActivatedRouteSnapshot

    ;(childRoute as any).parent = parentRoute

    const result = getUrlFromSnapshot(childRoute)
    expect(result).toBe('parent/child')
  })

  it('should return the URL from a single ActivatedRouteSnapshot', () => {
    const route = {
      url: [{ path: 'single' }],
      parent: null,
    } as unknown as ActivatedRouteSnapshot

    const result = getUrlFromSnapshot(route)
    expect(result).toBe('single')
  })

  it('should return an empty string if the route has no URL segments', () => {
    const route = {
      url: [],
      parent: null,
    } as unknown as ActivatedRouteSnapshot

    const result = getUrlFromSnapshot(route)
    expect(result).toBe('')
  })
})

```


File : guards-utils.utils.ts
```ts
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RedirectCommand, UrlTree } from '@angular/router'
import { isObservable, lastValueFrom } from 'rxjs'
import '../declarations'

window['@onecx/angular-utils'] = window['@onecx/angular-utils'] || {}

/**
 * Logs debug information for Guards.
 * It checks if the debug mode is enabled and logs the provided arguments.
 * This is useful for debugging guard checks and navigation state.
 * @param args - the arguments to log
 */
export function logGuardsDebug(...args: any[]): void {
  if (window['@onecx/angular-utils'].guards?.debug) {
    console.log(`Guards:`, ...args)
  }
}

/**
 * Execute router sync operation.
 * Immediately returns true to indicate that the operation was successful.
 */
export function executeRouterSyncGuard(): boolean {
  logGuardsDebug('Was RouterSync, returning true.')

  // Important to return true because it was already agreed to perform navigation in the application
  return true
}

/**
 * Returns false if any guard returned false.
 * Returns UrTree or RedirectCommand if any guard returned this value type (the first value is returned).
 * Else it returns true.
 */
export function combineToGuardResult(results: GuardResult[]): GuardResult {
  if (results.some((result) => result === false)) {
    return false
  }

  // Check for UrlTree or RedirectCommand
  // If any guard returned this, we need to return it to perform the redirection
  // We return the first one found
  const redirectResult = results.find((result) => result instanceof UrlTree || result instanceof RedirectCommand)
  if (redirectResult) {
    return redirectResult
  }

  return true
}

/**
 * Returns false if any guard returned false.
 * Else it returns true.
 */
export function combineToBoolean(results: GuardResult[]): boolean {
  if (results.some((result) => result === false)) {
    return false
  }

  return true
}

/**
 * Resolves MaybeAsync to Promise.
 * @param maybeAsync - the value to resolve
 * @returns Promise<GuardResult>
 */
export function resolveToPromise(maybeAsync: MaybeAsync<GuardResult>): Promise<GuardResult> {
  if (maybeAsync instanceof Promise) {
    return maybeAsync
  } else if (isObservable(maybeAsync)) {
    return lastValueFrom(maybeAsync)
  }

  return Promise.resolve(maybeAsync)
}

/**
 * Gets the URL from the ActivatedRouteSnapshot.
 * @param route - the route to get URL from
 * @returns string - the URL of the route
 */
export function getUrlFromSnapshot(route: ActivatedRouteSnapshot): string {
  const segments: string[] = []

  let currentRoute: ActivatedRouteSnapshot | null = route
  while (currentRoute) {
    segments.unshift(...currentRoute.url.map((segment) => segment.path))
    currentRoute = currentRoute.parent
  }

  return segments.join('/')
}


```


File : wrap-guards.utils.spec.ts
```ts
import { TestBed } from '@angular/core/testing'
import { OnecxRoute, wrapGuards, WRAPPED_GUARD_TAG } from './wrap-guards.utils'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  CanDeactivateFn,
  RouterStateSnapshot,
} from '@angular/router'
import { Component, Injector, runInInjectionContext, Type } from '@angular/core'
import { ActivateGuardsWrapper } from './activate-guards-wrapper.utils'
import { DeactivateGuardsWrapper } from './deactivate-guards-wrapper.utils'

class MockGuardsWrapper {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    guards: Array<CanActivateFn | Type<CanActivate>>
  ) {
    console.log('Wrapped amount:', guards.length)
    return Promise.resolve(true)
  }

  canDeactivate(
    component: any,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
    guards: Array<CanActivateFn | Type<CanActivate>>
  ) {
    console.log('Wrapped amount:', guards.length)
    return Promise.resolve(true)
  }
}

describe('wrapGuards', () => {
  let mockRoute: OnecxRoute

  beforeEach(() => {
    mockRoute = {
      path: 'test',
      canActivate: [],
      canDeactivate: [],
      canActivateChild: [],
      children: [],
    }

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivateGuardsWrapper, useClass: MockGuardsWrapper },
        {
          provide: DeactivateGuardsWrapper,
          useClass: MockGuardsWrapper,
        },
      ],
    })
  })

  it('should wrap canActivate guards if not already wrapped', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const mockGuard = jest.fn()
    const secondGuard = jest.fn()
    mockRoute.canActivate = [mockGuard, secondGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const injector = TestBed.inject(Injector)
    const wrapper = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
  })

  it('should not wrap canActivate guards if already wrapped', () => {
    const wrappedGuard = jest.fn()
    ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true
    mockRoute.canActivate = [wrappedGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should wrap canDeactivate guards if not already wrapped', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const mockGuard = jest.fn()
    const secondGuard = jest.fn()
    mockRoute.canDeactivate = [mockGuard, secondGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const injector = TestBed.inject(Injector)
    const wrapper = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
  })

  it('should not wrap canDeactivate guards if already wrapped', () => {
    const wrappedGuard = jest.fn()
    ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true
    mockRoute.canDeactivate = [wrappedGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should wrap canActivateChild guards if not already wrapped', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const mockGuard = jest.fn()
    const secondGuard = jest.fn()
    mockRoute.canActivateChild = [mockGuard, secondGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const injector = TestBed.inject(Injector)
    const wrapper = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
  })

  it('should not wrap canActivateChild guards if already wrapped', () => {
    const wrappedGuard = jest.fn()
    ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true
    mockRoute.canActivateChild = [wrappedGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should recursively wrap guards for child routes', () => {
    const childRoute = {
      path: 'child',
      canActivate: [jest.fn()],
      canDeactivate: [jest.fn()],
      canActivateChild: [jest.fn()],
      children: [],
    }
    mockRoute.children = [childRoute]

    wrapGuards(mockRoute)

    expect((childRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((childRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((childRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should force guard run for the route', () => {
    mockRoute.runGuardsAndResolvers = 'paramsChange'

    wrapGuards(mockRoute)

    expect(mockRoute.runGuardsAndResolvers).toBe('always')
  })

  it('should handle empty route guards', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const injector = TestBed.inject(Injector)

    mockRoute.canActivate = []
    mockRoute.canDeactivate = []
    mockRoute.canActivateChild = []

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const activateWrapper = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      activateWrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
    consoleSpy.mockClear()

    const deactivateWrapper = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      deactivateWrapper({} as any, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
    consoleSpy.mockClear()

    const activateChildWrapper = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      activateChildWrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
  })

  it('should handle undefined route guards', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const injector = TestBed.inject(Injector)

    mockRoute.canActivate = undefined
    mockRoute.canDeactivate = undefined
    mockRoute.canActivateChild = undefined

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const activateWrapper = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      activateWrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
    consoleSpy.mockClear()

    const deactivateWrapper = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      deactivateWrapper({} as any, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
    consoleSpy.mockClear()

    const activateChildWrapper = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      activateChildWrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 0)
  })

  it('should handle multiple child routes', () => {
    const childRoute = {
      path: 'child',
      canActivate: [jest.fn()],
      canDeactivate: [jest.fn()],
      canActivateChild: [jest.fn()],
      children: [],
    }
    const secondChildRoute = {
      path: 'second-child',
      canActivate: [jest.fn()],
      canDeactivate: [jest.fn()],
      canActivateChild: [jest.fn()],
      children: [],
    }
    mockRoute.children = [childRoute, secondChildRoute]

    wrapGuards(mockRoute)

    expect((childRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((childRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((childRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    expect((secondChildRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((secondChildRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect((secondChildRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should react to dynamically added guards', () => {
    const mockGuard = jest.fn()
    const wrappedGuard = jest.fn()
    ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true
    mockRoute.canActivate = [wrappedGuard, mockGuard]
    mockRoute.canDeactivate = [wrappedGuard, mockGuard]
    mockRoute.canActivateChild = [wrappedGuard, mockGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
  })

  it('should wrap guards based on saved state', () => {
    // Setup
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const mockGuard = jest.fn()

    // Setup 1 wrapped guard
    mockRoute.canActivate = [mockGuard]
    mockRoute.canDeactivate = [mockGuard]
    mockRoute.canActivateChild = [mockGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const injector = TestBed.inject(Injector)
    let wrapper: any = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapper = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      wrapper({} as Component, {} as ActivatedRouteSnapshot, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapper = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    // Add 2nd guard dynamically
    const newMockGuard = jest.fn()
    mockRoute.canActivate.push(newMockGuard)
    mockRoute.canDeactivate.push(newMockGuard)
    mockRoute.canActivateChild.push(newMockGuard)

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    let wrapperAfterAddition: any = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapperAfterAddition({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
    consoleSpy.mockClear()

    wrapperAfterAddition = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      wrapperAfterAddition(
        {} as Component,
        {} as ActivatedRouteSnapshot,
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      )
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
    consoleSpy.mockClear()

    wrapperAfterAddition = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapperAfterAddition({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 2)
    consoleSpy.mockClear()
  })

  it('should not duplicate guards in saved state', () => {
    // Setup
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const mockGuard = jest.fn()

    // Setup 1 wrapped guard
    mockRoute.canActivate = [mockGuard]
    mockRoute.canDeactivate = [mockGuard]
    mockRoute.canActivateChild = [mockGuard]

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    const injector = TestBed.inject(Injector)
    let wrapper: any = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapper = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      wrapper({} as Component, {} as ActivatedRouteSnapshot, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapper = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapper({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    // Add the same guard again
    mockRoute.canActivate.push(mockGuard)
    mockRoute.canDeactivate.push(mockGuard)
    mockRoute.canActivateChild.push(mockGuard)

    wrapGuards(mockRoute)

    expect(mockRoute.canActivate).toHaveLength(1)
    expect((mockRoute.canActivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canDeactivate).toHaveLength(1)
    expect((mockRoute.canDeactivate![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)
    expect(mockRoute.canActivateChild).toHaveLength(1)
    expect((mockRoute.canActivateChild![0] as any)[WRAPPED_GUARD_TAG]).toBe(true)

    let wrapperAfterAddition: any = mockRoute.canActivate![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapperAfterAddition({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapperAfterAddition = mockRoute.canDeactivate![0] as CanDeactivateFn<any>
    runInInjectionContext(injector, () => {
      wrapperAfterAddition(
        {} as Component,
        {} as ActivatedRouteSnapshot,
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      )
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()

    wrapperAfterAddition = mockRoute.canActivateChild![0] as CanActivateFn
    runInInjectionContext(injector, () => {
      wrapperAfterAddition({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    })

    expect(consoleSpy).toHaveBeenCalledWith('Wrapped amount:', 1)
    consoleSpy.mockClear()
  })
})

```


File : wrap-guards.utils.ts
```ts
import { CanActivate, CanActivateFn, CanDeactivate, CanDeactivateFn, Route } from '@angular/router'
import { inject, Type } from '@angular/core'
import { ActivateGuardsWrapper } from './activate-guards-wrapper.utils'
import { DeactivateGuardsWrapper } from './deactivate-guards-wrapper.utils'
import { logGuardsDebug } from './guards-utils.utils'

/**
 * Extended Route interface to hold original guards.
 * This interface extends the Angular Route interface to include lists for original guards.
 */
export interface OnecxRoute extends Route {
  canActivateGuardList?: Array<CanActivateFn | Type<CanActivate>>
  canDeactivateGuardList?: Array<CanDeactivateFn<any> | Type<CanDeactivate<any>>>
  canActivateChildGuardList?: Array<CanActivateFn | Type<CanActivate>>
}

// Create a unique symbol to tag wrapped guards
export const WRAPPED_GUARD_TAG = Symbol('WrappedGuard')

/**
 * Wraps the guards for a given route.
 * This function will wrap CanActivate, CanDeactivate and CanActivateChild guards and force the route to always run guards and resolvers.
 * It ensures that in a multi-router environment, the guards are properly executed.
 * @param route - The route to wrap guards for.
 */
export function wrapGuards(route: Route) {
  logGuardsDebug('wrapGuards', route)
  saveOriginalGuards(route as OnecxRoute)
  wrapActivateGuards(route)
  wrapDeactivateGuards(route)
  wrapActivateChildGuards(route)

  // Important, this will ensure that guards are always run
  // even if the route is already active.
  forceGuardRun(route)

  if (route.children) {
    route.children.forEach((childRoute) => wrapGuards(childRoute))
  }
}

function wrapActivateGuards(route: Route): void {
  if (isWrappingRequired(route.canActivate)) {
    logGuardsDebug('Wrapping activate guards for route', route)
    route.canActivate = [createActivateWrapper(route)]
  }
}

function wrapDeactivateGuards(route: Route): void {
  if (isWrappingRequired(route.canDeactivate)) {
    logGuardsDebug('Wrapping deactivate guards for route', route)
    route.canDeactivate = [createDeactivateWrapper(route)]
  }
}

function wrapActivateChildGuards(route: Route): void {
  if (isWrappingRequired(route.canActivateChild)) {
    logGuardsDebug('Wrapping activate child guards for route', route)
    route.canActivateChild = [createActivateChildWrapper(route)]
  }
}

/**
 * Force the route to always run guards and resolvers.
 */
function forceGuardRun(route: Route) {
  route.runGuardsAndResolvers = 'always'
}

/**
 * Saves the state of the guards for the route.
 * This function saves the canActivate, canDeactivate, and canActivateChild guards to their respective lists.
 * @param route - The route to save the guard state for.
 */
function saveOriginalGuards(route: OnecxRoute) {
  saveCanActivateGuards(route)
  saveCanDeactivateGuards(route)
  saveCanActivateChildGuards(route)
}

/**
 * Checks if wrapping is required for the guards.
 * If the guards array has only one guard and it is already wrapped, no wrapping is needed.
 * @param guards - The array of guards to check.
 * @returns True if wrapping is required, false otherwise.
 */
function isWrappingRequired(guards: Array<any> | undefined): boolean {
  if (guards && guards.length === 1 && isGuardsWrapped(guards)) {
    return false
  }

  return true
}

/**
 * Helper function to check if guards are already wrapped.
 * Checks for a unique tag added to wrapped guards.
 * @param guards - The array of guards to check.
 * @returns True if the guards are wrapped, false otherwise.
 */
function isGuardsWrapped(guards: Array<any>): boolean {
  return guards.some((guard) => isWrapper(guard))
}

/**
 * Checks if a guard is a wrapper.
 * A guard is considered a wrapper if it has the unique WRAPPED_GUARD_TAG symbol.
 * @param guard - The guard to check.
 * @returns True if the guard is a wrapper, false otherwise.
 */
function isWrapper(guard: any): boolean {
  return guard && (guard as any)[WRAPPED_GUARD_TAG] === true
}

/**
 * Creates a wrapper for CanActivate guards.
 * Adds a unique tag to the wrapped guard for identification.
 * @param guards - The array of CanActivate guards to wrap.
 * @returns A CanActivateFn that wraps the provided guards.
 */
function createActivateWrapper(routeToWrap: OnecxRoute): CanActivateFn {
  const wrappedGuard: CanActivateFn = (route, state) => {
    return inject(ActivateGuardsWrapper).canActivate(route, state, routeToWrap.canActivateGuardList || [])
  }

  // Tag the wrapped guard with the unique symbol
  ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true

  return wrappedGuard
}

/**
 * Creates a wrapper for CanDeactivate guards.
 * @param guards - The array of CanDeactivate guards to wrap.
 * @returns A CanDeactivateFn that wraps the provided guards.
 */
function createDeactivateWrapper(routeToWrap: OnecxRoute): CanDeactivateFn<any> {
  const wrappedGuard: CanDeactivateFn<any> = (component, currentRoute, currentState, nextState) => {
    return inject(DeactivateGuardsWrapper).canDeactivate(
      component,
      currentRoute,
      currentState,
      nextState,
      routeToWrap.canDeactivateGuardList || []
    )
  }

  // Tag the wrapped guard with the unique symbol
  ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true

  return wrappedGuard
}

/**
 * Creates a wrapper for CanActivateChild guards.
 * Adds a unique tag to the wrapped guard for identification.
 * @param guards - The array of CanActivateChild guards to wrap.
 * @returns A CanActivateFn that wraps the provided guards.
 */
function createActivateChildWrapper(routeToWrap: OnecxRoute): CanActivateFn {
  const wrappedGuard: CanActivateFn = (route, state) => {
    return inject(ActivateGuardsWrapper).canActivate(route, state, routeToWrap.canActivateChildGuardList || [])
  }

  // Tag the wrapped guard with the unique symbol
  ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true

  return wrappedGuard
}

/**
 * Saves the canActivate guards to the route's canActivateGuardList.
 * @param route - The route to save the canActivate guards for.
 */
function saveCanActivateGuards(route: OnecxRoute): void {
  if (!route.canActivateGuardList) route.canActivateGuardList = []

  if (route.canActivate) {
    route.canActivateGuardList = route.canActivateGuardList.concat(
      route.canActivate.filter(
        (guard) => !isWrapper(guard) && !isSaved<CanActivateFn | Type<CanActivate>>(route.canActivateGuardList!, guard)
      )
    )
  }
}

/**
 * Saves the canActivateChild guards to the route's canActivateChildGuardList.
 * @param route - The route to save the canActivateChild guards for.
 */
function saveCanDeactivateGuards(route: OnecxRoute): void {
  if (!route.canDeactivateGuardList) route.canDeactivateGuardList = []

  if (route.canDeactivate) {
    route.canDeactivateGuardList = route.canDeactivateGuardList.concat(
      route.canDeactivate.filter(
        (guard) =>
          !isWrapper(guard) &&
          !isSaved<CanDeactivateFn<any> | Type<CanDeactivate<any>>>(route.canDeactivateGuardList!, guard)
      )
    )
  }
}

/**
 * Saves the canActivateChild guards to the route's canActivateChildGuardList.
 * @param route - The route to save the canActivateChild guards for.
 */
function saveCanActivateChildGuards(route: OnecxRoute): void {
  if (!route.canActivateChildGuardList) route.canActivateChildGuardList = []

  if (route.canActivateChild) {
    route.canActivateChildGuardList = route.canActivateChildGuardList.concat(
      route.canActivateChild.filter(
        (guard) =>
          !isWrapper(guard) && !isSaved<CanActivateFn | Type<CanActivate>>(route.canActivateChildGuardList!, guard)
      )
    )
  }
}

function isSaved<T>(list: Array<T>, guard: T) {
  return list.some((item) => item === guard)
}

```




********************************************************************************************************************************


Folder => onecx-portal-ui-libs > libs > angular-utils > guards > src > model


File : guards-navigation.model.ts
```ts
/**
 * Scattered guards navigation state model.
 * Used to check if the guard checks are requested in the navigation state by different application.
 * This is used to perform guard checks without navigating.
 */
export interface GuardsNavigationState {
  [IS_ROUTER_SYNC]?: boolean
  [IS_INITIAL_ROUTER_SYNC]?: boolean
  [GUARD_CHECK]?: boolean
  [GUARD_CHECK_PROMISE]?: GuardCheckPromise
}

export type GuardCheckPromise = Promise<boolean>

/**
 * Indicates that the router is in sync mode.
 */
export const IS_ROUTER_SYNC = 'isRouterSync'

/**
 * Indicates that the router is in initial sync mode.
 */
export const IS_INITIAL_ROUTER_SYNC = 'isInitialRouterSync'

/**
 * Indicates that the guard check is requested.
 */
export const GUARD_CHECK = 'guardCheck'

/**
 * Indicates that the guard check promise was requested by this application.
 * This is used to wait for the external guard checks to be completed before proceeding with the navigation.
 */
export const GUARD_CHECK_PROMISE = 'guardCheckPromise'

export enum GUARD_MODE {
  INITIAL_ROUTER_SYNC = 'initialRouterSync',
  ROUTER_SYNC = 'routerSync',
  GUARD_CHECK = 'guardCheck',
  NAVIGATION_REQUESTED = 'navigationRequested',
}
```








********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************


File => onecx-portal-ui-libs > libs > angular-utils > mocks > index.ts
```ts
export * from './guards-gatherer-mock'
```


File => onecx-portal-ui-libs > libs > angular-utils > mocks > guard-gatherer-mock.ts
```ts
import { Injectable, OnDestroy } from '@angular/core'
import { GuardsGatherer } from '@onecx/angular-utils/guards'

export function provideGuardsGathererMock() {
  return [
    GuardsGathererMock,
    {
      provide: GuardsGatherer,
      useExisting: GuardsGathererMock,
    },
  ]
}

@Injectable()
export class GuardsGathererMock implements OnDestroy {
  private result = true

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method, @typescript-eslint/no-empty-function
  ngOnDestroy(): void {}

  setGatherResult(result: boolean): void {
    this.result = result
  }

  gather(): Promise<any> {
    return Promise.resolve(this.result)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  resolveRoute(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  activate(): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  deactivate(): void {}
}

```




