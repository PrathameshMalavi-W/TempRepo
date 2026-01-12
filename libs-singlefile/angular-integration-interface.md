#libs-Folder => angular-integration-interface

********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > index.ts


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
export * from './lib/services/image-repository.service'

// models
export * from './lib/model/config-key.model'

// core
export * from './lib/api/injection-tokens'

// utils

export { MfeInfo, Theme } from '@onecx/integration-interface'


```



********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > app-config-service.ts


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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > app-state.semce.ts .


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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > configuration.service.ts


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
            '📢 TKA001: Remote config load is disabled. To enable it, remove the "skipRemoteConfigLoad" key in your environment.json'
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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > configuration.service.spec.ts


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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > image-repository.service.ts


```ts

import { Injectable, OnDestroy } from "@angular/core";
import { ImageRepositoryService as ImageRepositryInterface, ImageRepositoryTopic } from '@onecx/integration-interface'

@Injectable({providedIn: 'root'}) 
export class ImageRepositoryService implements OnDestroy {
    private readonly imageRepositoryInterface = new ImageRepositryInterface();
    get imageRepositoryTopic() {
        return this.imageRepositoryInterface.imageRepositoryTopic;
    }

    set imageRepositoryTopic(source: ImageRepositoryTopic) {
        this.imageRepositoryInterface.imageRepositoryTopic = source;
    }

    async getUrl(names: string[]): Promise<string | undefined>;
    async getUrl(names: string[], fallbackUrl: string): Promise<string>;
    async getUrl(names: string[], fallbackUrl?: string): Promise<string | undefined> {
        if (fallbackUrl) {
            return this.imageRepositoryInterface.getUrl(names, fallbackUrl);
        }
        return this.imageRepositoryInterface.getUrl(names);
    }   

    ngOnDestroy(): void {
        this.imageRepositoryInterface.destroy();
    }

    destroy() {
        this.ngOnDestroy();
    }
}

```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > image-repository.service.spec.ts


```ts

import { TestBed } from '@angular/core/testing';
import { ImageRepositoryService as ImageRepositryInterface, ImageRepositoryInfo } from '@onecx/integration-interface';
import { FakeTopic } from '@onecx/accelerator';
import { ImageRepositoryService } from './image-repository.service';

const URL_NAME = 'logo1';
const EXPECTED_URL = '/logo1-url';
const FALLBACK_URL = '/fallback-url';
const MOCK_URLS: ImageRepositoryInfo = { images: { [URL_NAME]: EXPECTED_URL, 'logo2': '/logo2-url' } };

describe('ImageRepositoryService', () => {
  let service: ImageRepositoryService;
  let imageRepositoryInterface: ImageRepositryInterface;

  beforeEach(() => {
    TestBed.configureTestingModule({
		providers: [ImageRepositoryService]
	});
    service = TestBed.inject(ImageRepositoryService);
    imageRepositoryInterface = (service as any).imageRepositoryInterface;
    imageRepositoryInterface.imageRepositoryTopic = FakeTopic.create<ImageRepositoryInfo>();
    imageRepositoryInterface.imageRepositoryTopic?.publish(MOCK_URLS);
  });

  it('should call getUrl without fallback', async () => {
    const expectedUrl = MOCK_URLS.images[URL_NAME];
    const spyGetUrl = jest.spyOn(imageRepositoryInterface, 'getUrl').mockResolvedValue(expectedUrl);

    const result = await service.getUrl([URL_NAME]);

    expect(result).toBe(expectedUrl);
	  expect(spyGetUrl).toHaveBeenCalledWith([URL_NAME]);
	  expect(result).toEqual(EXPECTED_URL);
  });

  it('should call getUrl with fallback', async () => {
	  const NOT_FOUND_NAME = 'notfound';
    const spyGetUrl = jest.spyOn(imageRepositoryInterface, 'getUrl').mockResolvedValue(FALLBACK_URL);

    const result = await service.getUrl([NOT_FOUND_NAME], FALLBACK_URL);

    expect(spyGetUrl).toHaveBeenCalledWith([NOT_FOUND_NAME], FALLBACK_URL);
    expect(result).toBe(FALLBACK_URL);
  });

  it('should call destroy on ngOnDestroy', () => {
    const spyDestroy = jest.spyOn(imageRepositoryInterface, 'destroy');

    service.ngOnDestroy();

    expect(spyDestroy).toHaveBeenCalled();
  });

  it('should call ngOnDestroy from destroy()', () => {
    const spyDestroy = jest.spyOn(service, 'ngOnDestroy');

    service.destroy();
	
    expect(spyDestroy).toHaveBeenCalled();
  });  

  it('should test topic getter/setter', async () => {   
    service.imageRepositoryTopic = imageRepositoryInterface.imageRepositoryTopic;

    expect(service.imageRepositoryTopic).toBe(imageRepositoryInterface.imageRepositoryTopic);
  });
});


```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > parameter.service.ts


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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > parameter.service.spec.ts


```ts

import {
  FakeTopic,
  provideAppStateServiceMock,
  provideShellCapabilityServiceMock,
  ShellCapabilityServiceMock,
  Topic,
} from '@onecx/angular-integration-interface/mocks'
import { ParametersService } from './parameters.service'
import { Capability } from './shell-capability.service'
import { ParametersTopicPayload } from '@onecx/integration-interface'
import { TestBed } from '@angular/core/testing'

describe('ParametersService', () => {
  let parametersService: ParametersService
  let parametersTopic: Topic<ParametersTopicPayload>

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideShellCapabilityServiceMock(), provideAppStateServiceMock()],
    })
    parametersService = TestBed.inject(ParametersService)
    parametersTopic = FakeTopic.create<ParametersTopicPayload>()
    parametersService.parameters$ = parametersTopic
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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > portal-message.service.ts


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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > portal-message.service.spec.ts


```ts

import { TestBed, fakeAsync } from '@angular/core/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { Message } from '@onecx/integration-interface'
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
    portalMessageService.message$ = FakeTopic.create<Message>()
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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > remote-components.service. ts


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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > shell-capability.service.ts


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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > theme.service.ts


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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > user.service. ts


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
            console.log(`👮‍♀️ No permission for: ${permissionKey}`)
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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > user.service..spec.ts


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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > workspace.service.ts


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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > services > workspace.service.spec.ts


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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > model > config-key.model.ts 


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


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > api > constants.ts 


```ts

export const API_PREFIX = 'portal-api'

export const DEFAULT_LANG = 'en'


```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-integration-interface > src > lib > api > injection-tokens.ts


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

