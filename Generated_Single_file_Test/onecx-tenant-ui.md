# Files from C:\Users\prath\onecx\onecx-ui\onecx-tenant-ui\src\app

## Folder: app (10 files)

### File: app/app.component.html

```html

<ocx-portal-viewport></ocx-portal-viewport>


```

### File: app/app.component.spec.ts

```ts

/* eslint-disable @typescript-eslint/no-var-requires */
import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'

import { MockAuthModule, PortalCoreModule } from '@onecx/portal-integration-angular'
import { AppComponent } from './app.component'

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        MockAuthModule,
        PortalCoreModule.forRoot('test'),
        TranslateTestingModule.withTranslations({
          de: require('./src/assets/i18n/de.json'),
          en: require('./src/assets/i18n/en.json')
        }).withDefaultLanguage('en')
      ],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })
})


```

### File: app/app.component.ts

```ts

import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {}


```

### File: app/app.module.ts

```ts

import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateLoader, TranslateModule, TranslateService, MissingTranslationHandler } from '@ngx-translate/core'

import { LetDirective } from '@ngrx/component'
import { EffectsModule } from '@ngrx/effects'
import { StoreRouterConnectingModule } from '@ngrx/router-store'
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

import { KeycloakAuthModule } from '@onecx/keycloak-auth'
import { createTranslateLoader, provideTranslationPathFromMeta } from '@onecx/angular-utils'
import { APP_CONFIG, AppStateService, ConfigurationService, UserService } from '@onecx/angular-integration-interface'
import { AngularAcceleratorMissingTranslationHandler } from '@onecx/angular-accelerator'
import {
  PortalCoreModule,
  providePortalDialogService,
  translateServiceInitializer
} from '@onecx/portal-integration-angular'

import { Configuration } from './shared/generated'
import { apiConfigProvider } from './shared/utils/apiConfigProvider.utils'

import { environment } from 'src/environments/environment'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { metaReducers, reducers } from './app.reducers'

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([]),
    KeycloakAuthModule,
    LetDirective,
    PortalCoreModule.forRoot('onecx-tenant-ui'),
    StoreRouterConnectingModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75
    }),
    TranslateModule.forRoot({
      isolate: true,
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: AngularAcceleratorMissingTranslationHandler
      }
    })
  ],
  providers: [
    { provide: APP_CONFIG, useValue: environment },
    {
      provide: Configuration,
      useFactory: apiConfigProvider,
      deps: [ConfigurationService, AppStateService]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: translateServiceInitializer,
      multi: true,
      deps: [UserService, TranslateService]
    },
    provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/'),
    provideHttpClient(withInterceptorsFromDi()),
    providePortalDialogService()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


```

### File: app/app.reducers.ts

```ts

import { routerReducer } from '@ngrx/router-store'
import { ActionReducerMap, MetaReducer } from '@ngrx/store'

import { State } from './app.state'

export const reducers: ActionReducerMap<State> = { router: routerReducer }
export const metaReducers: MetaReducer<State>[] = []


```

### File: app/app.state.ts

```ts

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface State {}


```

### File: app/app-entrypoint.component.html

```html

<router-outlet></router-outlet>


```

### File: app/app-entrypoint.component.ts

```ts

import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { PrimeNGConfig } from 'primeng/api'
import { merge, mergeMap } from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: './app-entrypoint.component.html'
})
export class AppEntrypointComponent implements OnInit {
  constructor(
    private readonly translateService: TranslateService,
    private readonly config: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    merge(
      this.translateService.onLangChange,
      this.translateService.onTranslationChange,
      this.translateService.onDefaultLangChange
    )
      .pipe(mergeMap(() => this.translateService.get('primeng')))
      .subscribe((res) => this.config.setTranslation(res))
  }
}


```

### File: app/app-routing.module.ts

```ts

import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'

import { startsWith } from '@onecx/angular-webcomponents'
import { addInitializeModuleGuard } from '@onecx/angular-integration-interface'

export const routes: Routes = [
  {
    matcher: startsWith(''),
    loadChildren: () => import('./tenant/tenant.module').then((mod) => mod.TenantModule)
  }
]

@NgModule({
  imports: [RouterModule.forRoot(addInitializeModuleGuard(routes)), TranslateModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}


```

### File: app/onecx-tenant.remote.module.ts

```ts

import { APP_INITIALIZER, DoBootstrap, Injector, NgModule, isDevMode } from '@angular/core'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule, Router } from '@angular/router'
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { Actions, EffectsModule, EffectSources, EffectsRunner } from '@ngrx/effects'
import { StoreRouterConnectingModule } from '@ngrx/router-store'
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

import { AngularAuthModule } from '@onecx/angular-auth'
import { createTranslateLoader, provideTranslationPathFromMeta } from '@onecx/angular-utils'
import { createAppEntrypoint, initializeRouter } from '@onecx/angular-webcomponents'
import { addInitializeModuleGuard, AppStateService, ConfigurationService } from '@onecx/angular-integration-interface'
import { AngularAcceleratorMissingTranslationHandler } from '@onecx/angular-accelerator'
import { PortalCoreModule } from '@onecx/portal-integration-angular'

import { Configuration } from './shared/generated'
import { apiConfigProvider } from './shared/utils/apiConfigProvider.utils'

import { AppEntrypointComponent } from './app-entrypoint.component'
import { routes } from './app-routing.module'
import { metaReducers, reducers } from './app.reducers'

// Workaround for the following issue:
// https://github.com/ngrx/platform/issues/3700
const effectProvidersForWorkaround = [EffectsRunner, EffectSources, Actions]
effectProvidersForWorkaround.forEach((p) => (p.Éµprov.providedIn = null))

@NgModule({
  declarations: [AppEntrypointComponent],
  imports: [
    AngularAuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forRoot(addInitializeModuleGuard(routes)),
    TranslateModule.forRoot({
      isolate: true,
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: AngularAcceleratorMissingTranslationHandler
      }
    }),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effectProvidersForWorkaround),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75 // maximum stack trace frames to be stored (in case trace option was provided as true)
    })
  ],
  providers: [
    { provide: Configuration, useFactory: apiConfigProvider, deps: [ConfigurationService, AppStateService] },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeRouter,
      multi: true,
      deps: [Router, AppStateService]
    },
    provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/'),
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class OneCXTenantModule implements DoBootstrap {
  constructor(private readonly injector: Injector) {
    console.info('OneCX Tenant Module constructor')
  }

  ngDoBootstrap(): void {
    createAppEntrypoint(AppEntrypointComponent, 'ocx-tenant-component', this.injector)
  }
}


```

## Folder: app/shared/generated (6 files)

### File: app/shared/generated/api.module.ts

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

### File: app/shared/generated/configuration.ts

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

### File: app/shared/generated/encoder.ts

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

### File: app/shared/generated/index.ts

```ts

export * from './api/api';
export * from './model/models';
export * from './variables';
export * from './configuration';
export * from './api.module';
export * from './param';


```

### File: app/shared/generated/param.ts

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

### File: app/shared/generated/variables.ts

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

## Folder: app/shared/generated/api (2 files)

### File: app/shared/generated/api/api.ts

```ts

export * from './tenant.service';
import { TenantBffService } from './tenant.service';
export const APIS = [TenantBffService];


```

### File: app/shared/generated/api/tenant.service.ts

```ts

/**
 * onecx-tenant-bff
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
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
import { CreateTenantRequest } from '../model/createTenantRequest';
// @ts-ignore
import { ProblemDetailResponse } from '../model/problemDetailResponse';
// @ts-ignore
import { Tenant } from '../model/tenant';
// @ts-ignore
import { TenantPageResult } from '../model/tenantPageResult';
// @ts-ignore
import { TenantSearchCriteria } from '../model/tenantSearchCriteria';
// @ts-ignore
import { UpdateTenantRequest } from '../model/updateTenantRequest';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'any'
})
export class TenantBffService {

    protected basePath = 'https://localhost:8080';
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
     * Create new tenant
     * @param createTenantRequest 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createTenant(createTenantRequest: CreateTenantRequest, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any>;
    public createTenant(createTenantRequest: CreateTenantRequest, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<any>>;
    public createTenant(createTenantRequest: CreateTenantRequest, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<any>>;
    public createTenant(createTenantRequest: CreateTenantRequest, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (createTenantRequest === null || createTenantRequest === undefined) {
            throw new Error('Required parameter createTenantRequest was null or undefined when calling createTenant.');
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

        let localVarPath = `/tenants`;
        return this.httpClient.request<any>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: createTenantRequest,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get Tenant by id
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getTenant(id: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Tenant>;
    public getTenant(id: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Tenant>>;
    public getTenant(id: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Tenant>>;
    public getTenant(id: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getTenant.');
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

        let localVarPath = `/tenants/${this.configuration.encodeParam({name: "id", value: id, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}`;
        return this.httpClient.request<Tenant>('get', `${this.configuration.basePath}${localVarPath}`,
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

    /**
     * Search tenants by criteria
     * @param tenantSearchCriteria 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public searchTenants(tenantSearchCriteria: TenantSearchCriteria, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<TenantPageResult>;
    public searchTenants(tenantSearchCriteria: TenantSearchCriteria, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<TenantPageResult>>;
    public searchTenants(tenantSearchCriteria: TenantSearchCriteria, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<TenantPageResult>>;
    public searchTenants(tenantSearchCriteria: TenantSearchCriteria, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (tenantSearchCriteria === null || tenantSearchCriteria === undefined) {
            throw new Error('Required parameter tenantSearchCriteria was null or undefined when calling searchTenants.');
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

        let localVarPath = `/tenants/search`;
        return this.httpClient.request<TenantPageResult>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: tenantSearchCriteria,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Update tenant
     * @param id 
     * @param updateTenantRequest 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateTenant(id: string, updateTenantRequest?: UpdateTenantRequest, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Tenant>;
    public updateTenant(id: string, updateTenantRequest?: UpdateTenantRequest, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Tenant>>;
    public updateTenant(id: string, updateTenantRequest?: UpdateTenantRequest, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Tenant>>;
    public updateTenant(id: string, updateTenantRequest?: UpdateTenantRequest, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling updateTenant.');
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

        let localVarPath = `/tenants/${this.configuration.encodeParam({name: "id", value: id, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}`;
        return this.httpClient.request<Tenant>('put', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: updateTenantRequest,
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

## Folder: app/shared/generated/model (9 files)

### File: app/shared/generated/model/createTenantRequest.ts

```ts

/**
 * onecx-tenant-bff
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface CreateTenantRequest { 
    /**
     * Id of the organization
     */
    orgId: string;
    /**
     * Id of the tenant
     */
    tenantId: string;
    /**
     * Description of the tenant
     */
    description?: string;
}



```

### File: app/shared/generated/model/models.ts

```ts

export * from './createTenantRequest';
export * from './problemDetailInvalidParam';
export * from './problemDetailParam';
export * from './problemDetailResponse';
export * from './tenant';
export * from './tenantPageResult';
export * from './tenantSearchCriteria';
export * from './updateTenantRequest';


```

### File: app/shared/generated/model/problemDetailInvalidParam.ts

```ts

/**
 * onecx-tenant-bff
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
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

### File: app/shared/generated/model/problemDetailParam.ts

```ts

/**
 * onecx-tenant-bff
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
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

### File: app/shared/generated/model/problemDetailResponse.ts

```ts

/**
 * onecx-tenant-bff
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
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

### File: app/shared/generated/model/tenant.ts

```ts

/**
 * onecx-tenant-bff
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface Tenant { 
    modificationCount?: number;
    creationDate?: string;
    creationUser?: string;
    modificationDate?: string;
    modificationUser?: string;
    id: string;
    /**
     * Id of the organization
     */
    orgId?: string;
    /**
     * Id of the tenant
     */
    tenantId?: string;
    /**
     * Description of the tenant
     */
    description?: string;
}



```

### File: app/shared/generated/model/tenantPageResult.ts

```ts

/**
 * onecx-tenant-bff
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Tenant } from './tenant';


export interface TenantPageResult { 
    /**
     * The total elements in the resource.
     */
    totalElements: number;
    number?: number;
    size?: number;
    totalPages?: number;
    stream: Array<Tenant>;
}



```

### File: app/shared/generated/model/tenantSearchCriteria.ts

```ts

/**
 * onecx-tenant-bff
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface TenantSearchCriteria { 
    orgId?: string | null;
    /**
     * The number of page.
     */
    pageNumber?: number;
    /**
     * The size of page
     */
    pageSize?: number;
}



```

### File: app/shared/generated/model/updateTenantRequest.ts

```ts

/**
 * onecx-tenant-bff
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface UpdateTenantRequest { 
    /**
     * Id of the organization
     */
    orgId: string;
    /**
     * Description of the tenant
     */
    description?: string;
}



```

## Folder: app/shared/selectors (1 files)

### File: app/shared/selectors/router.selectors.ts

```ts

import { getRouterSelectors } from '@ngrx/router-store'

export const {
  selectCurrentRoute, // select the current route
  selectFragment, // select the current route fragment
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectRouteDataParam, // factory function to select a route data param
  selectUrl, // select the current url
  selectTitle // select the title if available
} = getRouterSelectors()


```

## Folder: app/shared (1 files)

### File: app/shared/shared.module.ts

```ts

import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'

import { DockModule } from 'primeng/dock'
import { FileUploadModule } from 'primeng/fileupload'
import { FloatLabelModule } from 'primeng/floatlabel'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputTextModule } from 'primeng/inputtext'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { OrderListModule } from 'primeng/orderlist'
import { RadioButtonModule } from 'primeng/radiobutton'
import { SkeletonModule } from 'primeng/skeleton'
import { TabViewModule } from 'primeng/tabview'
import { TooltipModule } from 'primeng/tooltip'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DockModule,
    FileUploadModule,
    FloatLabelModule,
    FormsModule,
    InputGroupModule,
    InputTextModule,
    InputTextareaModule,
    OrderListModule,
    RadioButtonModule,
    ReactiveFormsModule,
    SkeletonModule,
    TabViewModule,
    TooltipModule,
    TranslateModule
  ],
  exports: [
    DockModule,
    FileUploadModule,
    FloatLabelModule,
    FormsModule,
    InputGroupModule,
    InputTextModule,
    InputTextareaModule,
    RadioButtonModule,
    ReactiveFormsModule,
    OrderListModule,
    SkeletonModule,
    TabViewModule,
    TooltipModule,
    TranslateModule
  ],
  providers: []
})
export class SharedModule {}


```

## Folder: app/shared/utils (2 files)

### File: app/shared/utils/apiConfigProvider.utils.ts

```ts

import { AppStateService, ConfigurationService } from '@onecx/angular-integration-interface'
import { PortalApiConfiguration } from '@onecx/portal-integration-angular'

import { environment } from 'src/environments/environment'
import { Configuration } from '../generated'

export function apiConfigProvider(configService: ConfigurationService, appStateService: AppStateService) {
  return new PortalApiConfiguration(Configuration, environment.apiPrefix, configService, appStateService)
}


```

### File: app/shared/utils/isValidDate.utils.ts

```ts

export function isValidDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value as any)
}


```

## Folder: app/tenant/pages/tenant-search (15 files)

### File: app/tenant/pages/tenant-search/tenant-search.actions.ts

```ts

import { createActionGroup, emptyProps, props } from '@ngrx/store'

import { DataTableColumn, SearchConfigData } from '@onecx/angular-accelerator'

import { Tenant } from 'src/app/shared/generated'

import { TenantSearchCriteria } from './tenant-search.parameters'

export const TenantSearchActions = createActionGroup({
  source: 'TenantSearch',
  events: {
    'Search button clicked': props<{ searchCriteria: TenantSearchCriteria }>(),
    'Reset button clicked': emptyProps(),
    'Search config selected': props<{ searchConfig: SearchConfigData | undefined }>(),
    'tenant search results received': props<{
      results: Tenant[]
      totalElements: number
    }>(),
    'tenant search results loading failed': props<{ error: string | null }>(),
    'Displayed columns changed': props<{ displayedColumns: DataTableColumn[] }>(),
    'Chart visibility rehydrated': props<{ visible: boolean }>(),
    'Chart visibility toggled': emptyProps(),
    'View mode changed': props<{ viewMode: 'basic' | 'advanced' }>()
  }
})


```

### File: app/tenant/pages/tenant-search/tenant-search.columns.ts

```ts

import { DataTableColumn } from '@onecx/angular-accelerator'
import { ColumnType } from '@onecx/portal-integration-angular'

export const tenantSearchColumns: DataTableColumn[] = [
  {
    columnType: ColumnType.STRING,
    id: 'orgId',
    nameKey: 'TENANT_SEARCH.COLUMNS.ORG_ID',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'TENANT_SEARCH.PREDEFINED_GROUP.DEFAULT',
      'TENANT_SEARCH.PREDEFINED_GROUP.EXTENDED',
      'TENANT_SEARCH.PREDEFINED_GROUP.FULL'
    ]
  },
  {
    columnType: ColumnType.STRING,
    id: 'tenantId',
    nameKey: 'TENANT_SEARCH.COLUMNS.TENANT_ID',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'TENANT_SEARCH.PREDEFINED_GROUP.DEFAULT',
      'TENANT_SEARCH.PREDEFINED_GROUP.EXTENDED',
      'TENANT_SEARCH.PREDEFINED_GROUP.FULL'
    ]
  },
  {
    columnType: ColumnType.STRING,
    id: 'description',
    nameKey: 'TENANT_SEARCH.COLUMNS.DESCRIPTION',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'TENANT_SEARCH.PREDEFINED_GROUP.DEFAULT',
      'TENANT_SEARCH.PREDEFINED_GROUP.EXTENDED',
      'TENANT_SEARCH.PREDEFINED_GROUP.FULL'
    ]
  },
  {
    columnType: ColumnType.DATE,
    id: 'modificationDate',
    nameKey: 'TENANT_SEARCH.COLUMNS.MODIFICATION_DATE',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'TENANT_SEARCH.PREDEFINED_GROUP.DEFAULT',
      'TENANT_SEARCH.PREDEFINED_GROUP.EXTENDED',
      'TENANT_SEARCH.PREDEFINED_GROUP.FULL'
    ]
  },
  {
    columnType: ColumnType.DATE,
    id: 'creationDate',
    nameKey: 'TENANT_SEARCH.COLUMNS.CREATION_DATE',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
      'TENANT_SEARCH.PREDEFINED_GROUP.DEFAULT',
      'TENANT_SEARCH.PREDEFINED_GROUP.EXTENDED',
      'TENANT_SEARCH.PREDEFINED_GROUP.FULL'
    ]
  }
]


```

### File: app/tenant/pages/tenant-search/tenant-search.component.html

```html

<ocx-portal-page permission="TENANT#SEARCH" helpArticleId="PAGE_TENANT_SEARCH" *ngrxLet="viewModel$; let vm">
  <ocx-search-header
    [headline]="'TENANT_SEARCH.HEADER' | translate"
    [subheader]="'TENANT_SEARCH.SUB_HEADER' | translate"
    (searched)="onSearch(tenantSearchForm)"
    (resetted)="onResetSearchCriteria()"
    [manualBreadcrumbs]="false"
    [actions]="(headerActions$ | async) ?? []"
    searchConfigPermission="SEARCHCONFIG#USE"
    [viewMode]="vm.viewMode"
    pageName="PAGE_TENANT_SEARCH"
    (viewModeChanged)="viewModeChanged($event)"
    (selectedSearchConfigChanged)="searchConfigInfoSelectionChanged($event)"
  >
    <div [formGroup]="tenantSearchForm" class="flex flex-row flex-wrap gap-3">
      <span class="p-float-label">
        <input
          pInputText
          id="tm_search_orgId"
          type="text"
          class="w-15rem"
          formControlName="orgId"
          [attr.aria-label]="'TENANT_SEARCH.CRITERIA.ORGID' | translate"
          [pTooltip]="'TENANT_SEARCH.TOOLTIPS.ORGID' | translate"
          tooltipPosition="top"
          tooltipEvent="hover"
        />
        <label for="tm_search_orgId" class="text-responsive"> {{ 'TENANT_SEARCH.CRITERIA.ORGID' | translate }} </label>
      </span>
    </div>
  </ocx-search-header>

  <ocx-content-container layout="horizontal">
    <ocx-content class="w-full no-card-padding">
      <ocx-interactive-data-view
        [data]="vm.results"
        [columns]="vm.columns"
        viewPermission="TENANT#VIEW"
        searchConfigPermission="SEARCHCONFIG#USE"
        [listGridPaginator]="false"
        [emptyResultsMessage]="'TENANT_SEARCH.EMPTY_RESULTS' | translate"
        [supportedViewLayouts]="['table']"
        (displayedColumnsChange)="onDisplayedColumnsChange($event)"
        [defaultGroupKey]="'TENANT_SEARCH.PREDEFINED_GROUP.DEFAULT'"
        [pageSizes]="[10, 50, 1000]"
      >
      </ocx-interactive-data-view>
    </ocx-content>

    <ocx-content class="w-full xl:w-3" *ngIf="vm.results.length > 0 && vm.chartVisible && (diagramColumn$ | async)">
      <div class="flex flex-column md:flex-row lg:flex-column justify-content-center">
        <ocx-group-by-count-diagram
          *ngIf="diagramColumn$ | async as diagramColumn"
          [data]="vm.results"
          [column]="diagramColumn"
          sumKey="TENANT_SEARCH.DIAGRAM.SUM"
        ></ocx-group-by-count-diagram>
      </div>
    </ocx-content>
  </ocx-content-container>
</ocx-portal-page>


```

### File: app/tenant/pages/tenant-search/tenant-search.component.spec.ts

```ts

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { ofType } from '@ngrx/effects'
import { Store, StoreModule } from '@ngrx/store'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DialogService } from 'primeng/dynamicdialog'

import { ColumnType, DataTableColumn, PortalCoreModule, UserService } from '@onecx/portal-integration-angular'

import { TenantSearchActions } from './tenant-search.actions'
import { TenantSearchComponent } from './tenant-search.component'
import { initialState } from './tenant-search.reducers'
import { selectTenantSearchViewModel } from './tenant-search.selectors'
import { TenantSearchViewModel } from './tenant-search.viewmodel'
import { TenantSearchHarness } from './tenant-search.harness'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { TranslateService } from '@ngx-translate/core'
import { of } from 'rxjs'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { tenantSearchCriteriasSchema } from './tenant-search.parameters'

describe('TenantSearchComponent', () => {
  let component: TenantSearchComponent
  let fixture: ComponentFixture<TenantSearchComponent>
  let store: MockStore<Store>
  let formBuilder: FormBuilder
  let tenantSearch: TenantSearchHarness

  const mockActivatedRoute = {}

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    })
  })

  /* eslint-disable @typescript-eslint/no-var-requires */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantSearchComponent],
      imports: [
        PortalCoreModule,
        LetDirective,
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        TranslateTestingModule.withTranslations('en', require('./../../../../assets/i18n/en.json')).withTranslations(
          'de',
          require('./../../../../assets/i18n/de.json')
        ),
        NoopAnimationsModule
      ],
      providers: [
        DialogService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore({
          initialState: { tenant: { search: initialState } }
        }),
        FormBuilder,
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents()
  })
  /* eslint-disable @typescript-eslint/no-var-requires */

  beforeEach(async () => {
    const userService = TestBed.inject(UserService)
    userService.hasPermission = () => true
    const translateService = TestBed.inject(TranslateService)
    translateService.use('en')
    fixture = TestBed.createComponent(TenantSearchComponent)
    component = fixture.componentInstance
    store = TestBed.inject(MockStore)
    formBuilder = TestBed.inject(FormBuilder)
    fixture.detectChanges()
    tenantSearch = await TestbedHarnessEnvironment.harnessForFixture(fixture, TenantSearchHarness)
    window.URL.createObjectURL = jest.fn()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should dispatch searchButtonClicked action on search', (done) => {
    const formValue = formBuilder.group({ changeMe: '123' })
    component.tenantSearchForm = formValue
    component.visibleFormControls = [{ name: 'changeMe' }] as any

    store.scannedActions$.pipe(ofType(TenantSearchActions.searchButtonClicked)).subscribe((a) => {
      expect(a.searchCriteria).toEqual({ changeMe: '123' })
      done()
    })

    component.onSearch(formValue)
  })

  it('should dispatch resetButtonClicked action on reset search', (done) => {
    store.scannedActions$.pipe(ofType(TenantSearchActions.resetButtonClicked)).subscribe(() => {
      done()
    })

    component.onResetSearchCriteria()
  })

  it('should dispatch searchButtonClicked action on search', (done) => {
    const date = new Date()
    const formValue = formBuilder.group({ date: date })
    component.tenantSearchForm = formValue
    component.visibleFormControls = [{ name: 'changeMe' }] as any

    store.scannedActions$.pipe(ofType(TenantSearchActions.searchButtonClicked)).subscribe((a) => {
      expect(a.searchCriteria).toEqual({ date: null })
    })
    done()

    component.onSearch(formValue)
  })

  it('should convert valid date to UTC and falsy value to null in searchCriteria', (done) => {
    const date = new Date(2023, 5, 15, 10, 30, 0)
    const formValue = formBuilder.group({
      validDate: date,
      emptyField: '',
      pageSize: '',
      pageNumber: undefined
    })

    component.tenantSearchForm = formValue
    component.visibleFormControls = [{ name: 'validDate' }, { name: 'emptyField' }] as any

    store.scannedActions$.pipe(ofType(TenantSearchActions.searchButtonClicked)).subscribe((a) => {
      expect(a.searchCriteria).toEqual({
        validDate: new Date(Date.UTC(2023, 5, 15, 10, 30, 0)),
        emptyField: null,
        pageSize: null,
        pageNumber: null
      })
    })
    done()

    component.onSearch(formValue)
  })

  it('should transform empty string to undefined', () => {
    const parsed = tenantSearchCriteriasSchema.parse({
      pageNumber: '',
      pageSize: ''
    })

    expect(parsed.pageNumber).toBeUndefined()
    expect(parsed.pageSize).toBeUndefined()
  })

  it('should dispatch view mode change', async () => {
    jest.spyOn(store, 'dispatch')
    const baseTenantSearchViewModel: TenantSearchViewModel = {
      chartVisible: true,
      columns: [{ columnType: ColumnType.STRING, id: '1', nameKey: 'orgId' }],
      displayedColumns: [{ columnType: ColumnType.STRING, id: '1', nameKey: 'orgId' }],
      results: [{ id: '1', imagePath: ' ' }],
      searchCriteria: { orgId: '1' },
      viewMode: 'basic'
    }
    store.overrideSelector(selectTenantSearchViewModel, {
      ...baseTenantSearchViewModel,
      chartVisible: false,
      viewMode: 'advanced'
    })
    store.refreshState()

    await tenantSearch.getHeader()

    expect(store.dispatch).toHaveBeenCalledWith(TenantSearchActions.viewModeChanged({ viewMode: 'advanced' }))
  })

  it('should dispatch chart visibility change', async () => {
    jest.spyOn(store, 'dispatch')
    const baseTenantSearchViewModel: TenantSearchViewModel = {
      chartVisible: true,
      columns: [{ columnType: ColumnType.STRING, id: '1', nameKey: 'orgId' }],
      displayedColumns: [{ columnType: ColumnType.STRING, id: '1', nameKey: 'orgId' }],
      results: [{ id: '1', imagePath: ' ' }],
      searchCriteria: { orgId: '1' },
      viewMode: 'advanced'
    }
    store.overrideSelector(selectTenantSearchViewModel, {
      ...baseTenantSearchViewModel,
      chartVisible: false
    })

    store.refreshState()
    const searchHeader = await tenantSearch.getHeader()
    const pageHeader = await searchHeader.getPageHeader()
    const overflowActionButton = await pageHeader.getOverflowActionMenuButton()
    expect(overflowActionButton).toBeDefined()
    await overflowActionButton?.click()
    const showHideChartActionItem = await pageHeader.getOverFlowMenuItem('Show chart')
    await showHideChartActionItem?.selectItem()
    expect(store.dispatch).toHaveBeenCalledWith(TenantSearchActions.chartVisibilityToggled())

    //hide again
    store.overrideSelector(selectTenantSearchViewModel, {
      ...baseTenantSearchViewModel,
      chartVisible: true
    })

    store.refreshState()
    const searchHeading = await tenantSearch.getHeader()
    const pageHeading = await searchHeading.getPageHeader()
    const overflowButton = await pageHeading.getOverflowActionMenuButton()
    expect(overflowButton).toBeDefined()
    await overflowButton?.click()
    const hideChartActionItem = await pageHeading.getOverFlowMenuItem('Show chart')
    await hideChartActionItem?.selectItem()
    expect(store.dispatch).toHaveBeenCalledWith(TenantSearchActions.chartVisibilityToggled())
  })

  it('should dispatch export', async () => {
    jest.spyOn(store, 'dispatch')
    jest.spyOn(component, 'onExportItems')

    const baseTenantSearchViewModel: TenantSearchViewModel = {
      chartVisible: true,
      columns: [{ columnType: ColumnType.STRING, id: '1', nameKey: 'orgId' }],
      displayedColumns: [{ columnType: ColumnType.STRING, id: '1', nameKey: 'orgId' }],
      results: [{ id: '1', imagePath: ' ' }],
      searchCriteria: { orgId: '1' },
      viewMode: 'advanced'
    }
    store.overrideSelector(selectTenantSearchViewModel, {
      ...baseTenantSearchViewModel,
      chartVisible: false
    })

    store.refreshState()

    const searchHeader = await tenantSearch.getHeader()
    const pageHeader = await searchHeader.getPageHeader()
    console.log(pageHeader.getInlineActionButtons())
    const overflowActionButton = await pageHeader.getOverflowActionMenuButton()
    expect(overflowActionButton).toBeDefined()
    await overflowActionButton?.click()
    const exportItem = await pageHeader.getOverFlowMenuItem('Export all')
    await exportItem?.selectItem()
    expect(component.onExportItems).toHaveBeenCalled()
  })
  it('should dispatch search config changed action when search config changed', async () => {
    jest.spyOn(store, 'dispatch')

    component.searchConfigInfoSelectionChanged({
      name: 'orgId',
      displayedColumnsIds: ['orgId'],
      fieldValues: { orgId: 'org1' },
      viewMode: 'advanced'
    })
    expect(store.dispatch).toHaveBeenCalledWith(
      TenantSearchActions.searchConfigSelected({
        searchConfig: {
          name: 'orgId',
          displayedColumnsIds: ['orgId'],
          fieldValues: { orgId: 'org1' },
          viewMode: 'advanced'
        }
      })
    )
  })
  it('should emit the correct diagram column', (done) => {
    const testColumnId = 'diagram123'

    const testColumn: DataTableColumn = {
      id: testColumnId,
      nameKey: 'diagram',
      columnType: ColumnType.STRING
    }

    const testViewModel: TenantSearchViewModel = {
      columns: [testColumn],
      displayedColumns: [],
      results: [],
      searchCriteria: {},
      chartVisible: false,
      viewMode: 'advanced'
    }

    component.diagramColumnId = testColumnId
    component.viewModel$ = of(testViewModel)

    component.diagramColumn$.subscribe((result) => {
      expect(result).toEqual(testColumn)
      done()
    })
    done()
  })
})


```

### File: app/tenant/pages/tenant-search/tenant-search.component.ts

```ts

import { Component, Inject, LOCALE_ID, OnInit, QueryList, ViewChildren } from '@angular/core'
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms'
import { Store } from '@ngrx/store'
import { distinctUntilChanged, first, map, Observable } from 'rxjs'
import { PrimeIcons } from 'primeng/api'
import * as deepEqual from 'fast-deep-equal'

import { Action, BreadcrumbService } from '@onecx/angular-accelerator'
import { DataTableColumn, ExportDataService, SearchConfigData } from '@onecx/portal-integration-angular'

import { isValidDate } from 'src/app/shared/utils/isValidDate.utils'

import { TenantSearchActions } from './tenant-search.actions'
import { TenantSearchCriteria, tenantSearchCriteriasSchema } from './tenant-search.parameters'
import { selectTenantSearchViewModel } from './tenant-search.selectors'
import { TenantSearchViewModel } from './tenant-search.viewmodel'

@Component({
  selector: 'app-tenant-search',
  templateUrl: './tenant-search.component.html',
  styleUrls: ['./tenant-search.component.scss']
})
export class TenantSearchComponent implements OnInit {
  viewModel$: Observable<TenantSearchViewModel> = this.store.select(selectTenantSearchViewModel)

  headerActions$: Observable<Action[]> = this.viewModel$.pipe(
    map((vm) => {
      const actions: Action[] = [
        {
          labelKey: 'TENANT_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          icon: PrimeIcons.DOWNLOAD,
          titleKey: 'TENANT_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          show: 'asOverflow',
          actionCallback: () => this.onExportItems()
        },
        {
          labelKey: vm.chartVisible
            ? 'TENANT_SEARCH.HEADER_ACTIONS.HIDE_CHART'
            : 'TENANT_SEARCH.HEADER_ACTIONS.SHOW_CHART',
          icon: PrimeIcons.EYE,
          titleKey: vm.chartVisible
            ? 'TENANT_SEARCH.HEADER_ACTIONS.HIDE_CHART'
            : 'TENANT_SEARCH.HEADER_ACTIONS.SHOW_CHART',
          show: 'asOverflow',
          actionCallback: () => this.toggleChartVisibility()
        }
      ]
      return actions
    })
  )

  diagramColumnId = 'tenantId'
  diagramColumn$ = this.viewModel$.pipe(
    map((vm) => vm.columns.find((e) => e.id === this.diagramColumnId) as DataTableColumn)
  )

  public tenantSearchForm: FormGroup = this.formBuilder.group({
    ...(Object.fromEntries(tenantSearchCriteriasSchema.keyof().options.map((k) => [k, null])) as Record<
      keyof TenantSearchCriteria,
      unknown
    >)
  } satisfies Record<keyof TenantSearchCriteria, unknown>)

  @ViewChildren(FormControlName) visibleFormControls!: QueryList<FormControlName>

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
    @Inject(LOCALE_ID) public readonly locale: string,
    private readonly exportDataService: ExportDataService
  ) {}

  public ngOnInit() {
    this.breadcrumbService.setItems([
      {
        titleKey: 'TENANT_SEARCH.BREADCRUMB',
        labelKey: 'TENANT_SEARCH.BREADCRUMB',
        routerLink: '/tenant'
      }
    ])

    this.viewModel$
      .pipe(
        map((vm) => vm.searchCriteria),
        distinctUntilChanged(deepEqual)
      )
      .subscribe((sc) => {
        this.tenantSearchForm.reset(sc)
      })
  }

  public searchConfigInfoSelectionChanged(searchConfig: SearchConfigData | undefined) {
    this.store.dispatch(
      TenantSearchActions.searchConfigSelected({
        searchConfig: searchConfig
      })
    )
  }

  public onSearch(formValue: FormGroup) {
    const searchCriteria = Object.entries(formValue.getRawValue()).reduce(
      (acc: Partial<TenantSearchCriteria>, [key, value]) => ({
        ...acc,
        [key]: this.isVisible(key)
          ? isValidDate(value)
            ? new Date(
                Date.UTC(
                  value.getFullYear(),
                  value.getMonth(),
                  value.getDate(),
                  value.getHours(),
                  value.getMinutes(),
                  value.getSeconds()
                )
              )
            : value || null
          : null
      }),
      {}
    ) as TenantSearchCriteria
    this.store.dispatch(TenantSearchActions.searchButtonClicked({ searchCriteria }))
  }

  public onResetSearchCriteria() {
    this.store.dispatch(TenantSearchActions.resetButtonClicked())
  }

  public onExportItems() {
    this.viewModel$.pipe(first()).subscribe((data) => {
      this.exportDataService.exportCsv(data.displayedColumns, data.results, 'tenant.csv')
    })
  }

  viewModeChanged(viewMode: 'basic' | 'advanced') {
    this.store.dispatch(
      TenantSearchActions.viewModeChanged({
        viewMode: viewMode
      })
    )
  }

  onDisplayedColumnsChange(displayedColumns: DataTableColumn[]) {
    this.store.dispatch(TenantSearchActions.displayedColumnsChanged({ displayedColumns }))
  }

  toggleChartVisibility() {
    this.store.dispatch(TenantSearchActions.chartVisibilityToggled())
  }

  private isVisible(control: string) {
    return this.visibleFormControls.some(
      (formControl) => formControl.name !== null && String(formControl.name) === control
    )
  }
}


```

### File: app/tenant/pages/tenant-search/tenant-search.effects.spec.ts

```ts

import { Type } from '@angular/core'
import {
  ActivatedRoute,
  NavigationExtras,
  Router,
  RouterState,
  RouterStateSnapshot,
  RoutesRecognized
} from '@angular/router'
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store'
import { MockStore, createMockStore } from '@ngrx/store/testing'
import { ReplaySubject, of, throwError } from 'rxjs'
import { hot } from 'jest-marbles'

import { PortalMessageService } from '@onecx/angular-integration-interface'

import { TenantBffService } from 'src/app/shared/generated'
import { TenantSearchEffects } from './tenant-search.effects'
import { TenantSearchActions } from './tenant-search.actions'
import { tenantSearchSelectors } from './tenant-search.selectors'
import { TenantSearchComponent } from './tenant-search.component'

class MockRouter implements Partial<Router> {
  constructor(effectsActions: ReplaySubject<any>) {
    this.effectsActions = effectsActions
  }
  events = new ReplaySubject<any>(1)
  routerState = {
    root: {},
    snapshot: {
      root: {}
    }
  } as RouterState
  effectsActions: ReplaySubject<any>

  routeFor = (component: Type<any>) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.routerState!.root!.component! = component
  }

  setRouterUrl = (url: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.routerState!.snapshot.url = url
  }

  configureNavigationUrl = (routerAction: RouterNavigatedAction, currentUrl: string, newUrl: string) => {
    this.setRouterUrl(currentUrl)
    routerAction.payload = {
      event: {
        urlAfterRedirects: newUrl
      }
    } as any
  }

  setRouterParams = (params: any) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.routerState!.snapshot.root.queryParams = params
  }

  configureQueryParams = (routerAction: RouterNavigatedAction, routerParams: any, actionParams: any) => {
    this.setRouterParams(routerParams)
    routerAction.payload = {
      routerState: {
        root: {
          queryParams: actionParams
        }
      }
    } as any
  }

  simulateNavigation = (routerAction: RouterNavigatedAction) => {
    ;(this.events as ReplaySubject<any>).next(new RoutesRecognized(0, '', '', {} as RouterStateSnapshot))
    this.effectsActions.next(routerAction)
  }

  navigate(commands: any[], extras?: NavigationExtras | undefined): Promise<boolean> {
    const routerNavigatedAction = {
      type: ROUTER_NAVIGATED
    } as RouterNavigatedAction
    routerNavigatedAction.payload = {
      routerState: {
        root: {
          queryParams: extras?.queryParams
        }
      }
    } as any
    this.simulateNavigation(routerNavigatedAction)
    return Promise.resolve(true)
  }
}

describe('TenantSearchEffects:', () => {
  const activatedRouteMock: Partial<ActivatedRoute> = {}
  let mockedRouter: MockRouter
  let store: MockStore
  const initialState = {}

  const mockedTenantService: Partial<TenantBffService> = {
    searchTenants: jest.fn()
  }
  const mockedMessageService: Partial<PortalMessageService> = {
    error: jest.fn()
  }

  let effectsActions: ReplaySubject<any>
  const initEffects = () => {
    return new TenantSearchEffects(
      effectsActions,
      activatedRouteMock as ActivatedRoute,
      mockedTenantService as TenantBffService,
      mockedRouter as any,
      store,
      mockedMessageService as PortalMessageService
    )
  }

  beforeEach(() => {
    effectsActions = new ReplaySubject<any>(1)
    activatedRouteMock.queryParams = new ReplaySubject<any>(1)
    mockedRouter = new MockRouter(effectsActions)
    store = createMockStore({ initialState })
    jest.resetAllMocks()
  })

  it('should display error when TenantSearchActions.tenantSearchResultsLoadingFailed dispatched', (done) => {
    const effects = initEffects()
    effectsActions.next(
      TenantSearchActions.tenantSearchResultsLoadingFailed({
        error: null
      })
    )

    effects.displayError$.subscribe(() => {
      expect(mockedMessageService.error).toHaveBeenLastCalledWith({
        summaryKey: 'TENANT_SEARCH.ERROR_MESSAGES.SEARCH_RESULTS_LOADING_FAILED'
      })
      done()
    })
  })

  it('should not display error when action without error mapping dispatched', (done) => {
    const effects = initEffects()
    // any not mapped action
    effectsActions.next(TenantSearchActions.chartVisibilityToggled())

    effects.displayError$.subscribe(() => {
      expect(mockedMessageService.error).toHaveBeenCalledTimes(0)
      done()
    })
  })

  it('should save visible: true to localStorage when TenantSearchActions.chartVisibilityToggled dispatched', (done) => {
    jest.spyOn(Storage.prototype, 'setItem')

    store.overrideSelector(tenantSearchSelectors.selectChartVisible, true)

    const effects = initEffects()
    effectsActions.next(TenantSearchActions.chartVisibilityToggled())

    effects.saveChartVisibility$.subscribe(() => {
      expect(localStorage.setItem).toHaveBeenLastCalledWith('tenantChartVisibility', 'true')
      done()
    })
  })

  it('should save visible: false to localStorage when TenantSearchActions.chartVisibilityToggled dispatched', (done) => {
    jest.spyOn(Storage.prototype, 'setItem')

    store.overrideSelector(tenantSearchSelectors.selectChartVisible, false)

    const effects = initEffects()
    effectsActions.next(TenantSearchActions.chartVisibilityToggled())

    effects.saveChartVisibility$.subscribe(() => {
      expect(localStorage.setItem).toHaveBeenLastCalledWith('tenantChartVisibility', 'false')
      done()
    })
  })

  it('should dispatch TenantSearchActions.chartVisibilityRehydrated with visible: true on TenantSearchComponent route navigation', (done) => {
    const localStorageSpy = jest.spyOn(Storage.prototype, 'getItem')
    localStorageSpy.mockReturnValue('true')

    const effects = initEffects()

    const routerNavigatedAction = {
      type: ROUTER_NAVIGATED
    } as RouterNavigatedAction
    mockedRouter.routeFor(TenantSearchComponent)
    mockedRouter.configureNavigationUrl(routerNavigatedAction, 'current_url', 'navigation_url')
    mockedRouter.simulateNavigation(routerNavigatedAction)

    effects.rehydrateChartVisibility$.subscribe((action) => {
      expect(action.visible).toBe(true)
      done()
    })
  })

  it('should dispatch TenantSearchActions.chartVisibilityRehydrated with visible: false on TenantSearchComponent route navigation', (done) => {
    const localStorageSpy = jest.spyOn(Storage.prototype, 'getItem')
    localStorageSpy.mockReturnValue('false')

    const effects = initEffects()

    const routerNavigatedAction = {
      type: ROUTER_NAVIGATED
    } as RouterNavigatedAction
    mockedRouter.routeFor(TenantSearchComponent)
    mockedRouter.configureNavigationUrl(routerNavigatedAction, 'current_url', 'navigation_url')
    mockedRouter.simulateNavigation(routerNavigatedAction)

    effects.rehydrateChartVisibility$.subscribe((action) => {
      expect(action.visible).toBe(false)
      done()
    })
  })

  it('should dispatch TenantSearchActions.tenantSearchResultsReceived with search results on new search criteria', (done) => {
    const tenants = {
      stream: [
        {
          id: '1'
        },
        {
          id: '2'
        }
      ],
      totalElements: 2
    }
    jest.spyOn(mockedTenantService, 'searchTenants').mockReturnValue(of(tenants) as any)

    const previousSearchCriteriaParams = {
      orgId: 'prev_org_id',
      pageNumber: '1',
      pageSize: '1'
    }
    const newSearchCriteriaParams = {
      orgId: 'org_id',
      pageNumber: '1',
      pageSize: '1'
    }
    const newSearchCriteria = {
      orgId: 'org_id',
      pageNumber: 1,
      pageSize: 1
    }
    store.overrideSelector(tenantSearchSelectors.selectCriteria, newSearchCriteria)

    const effects = initEffects()

    const routerNavigatedAction = {
      type: ROUTER_NAVIGATED
    } as RouterNavigatedAction
    mockedRouter.routeFor(TenantSearchComponent)
    mockedRouter.configureQueryParams(routerNavigatedAction, previousSearchCriteriaParams, newSearchCriteriaParams)
    mockedRouter.simulateNavigation(routerNavigatedAction)

    effects.searchByUrl$.subscribe((action) => {
      expect(mockedTenantService.searchTenants).toHaveBeenLastCalledWith(newSearchCriteria)
      expect(action).toEqual({
        type: TenantSearchActions.tenantSearchResultsReceived.type,
        results: tenants.stream,
        totalElements: tenants.totalElements
      })
      done()
    })
  })

  it('should dispatch TenantSearchActions.tenantSearchResultsLoadingFailed when search call fails on new search criteria', (done) => {
    const error = {
      cause: 'Bad org id'
    }
    jest.spyOn(mockedTenantService, 'searchTenants').mockReturnValue(throwError(() => error))

    const previousSearchCriteriaParams = {
      orgId: 'prev_org_id',
      pageNumber: '1',
      pageSize: '1'
    }
    const newSearchCriteriaParams = {
      orgId: 'org_id',
      pageNumber: '1',
      pageSize: '1'
    }
    const newSearchCriteria = {
      orgId: 'org_id',
      pageNumber: 1,
      pageSize: 1
    }
    store.overrideSelector(tenantSearchSelectors.selectCriteria, newSearchCriteria)

    const effects = initEffects()

    const routerNavigatedAction = {
      type: ROUTER_NAVIGATED
    } as RouterNavigatedAction
    mockedRouter.routeFor(TenantSearchComponent)
    mockedRouter.configureQueryParams(routerNavigatedAction, previousSearchCriteriaParams, newSearchCriteriaParams)
    mockedRouter.simulateNavigation(routerNavigatedAction)

    effects.searchByUrl$.subscribe((action) => {
      expect(mockedTenantService.searchTenants).toHaveBeenLastCalledWith(newSearchCriteria)
      expect(action).toEqual({
        type: TenantSearchActions.tenantSearchResultsLoadingFailed.type,
        error: error
      })
      done()
    })
  })

  it('should not dispatch anything via searchByUrl on same search criteria', () => {
    const sameSearchCriteria = {
      orgId: 'org_id',
      pageNumber: 1,
      pageSize: 1
    }

    const routerNavigatedAction = {
      type: ROUTER_NAVIGATED
    } as RouterNavigatedAction
    mockedRouter.routeFor(TenantSearchComponent)
    mockedRouter.configureQueryParams(routerNavigatedAction, sameSearchCriteria, { orgId: 'ass' })

    const effects = initEffects()
    effectsActions.next(
      hot('-a', {
        a: routerNavigatedAction
      })
    )

    const expected = hot('--')

    expect(effects.searchByUrl$).toBeObservable(expected)
  })

  it('should navigate when query params are different than search criteria on TenantSearchActions.searchButtonClicked dispatch', (done) => {
    const spy = jest.spyOn(mockedRouter, 'navigate')

    const effects = initEffects()
    ;(activatedRouteMock.queryParams as ReplaySubject<any>).next({
      orgId: 'orgId'
    })
    store.overrideSelector(tenantSearchSelectors.selectCriteria, { orgId: 'differentId' })
    effectsActions.next(
      TenantSearchActions.searchButtonClicked({
        searchCriteria: { orgId: '' }
      })
    )

    effects.syncParamsToUrl$.subscribe(() => {
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    })
  })

  it('should not navigate when query params are same as search criteria on TenantSearchActions.searchButtonClicked dispatch', (done) => {
    const spy = jest.spyOn(mockedRouter, 'navigate')

    const criteria = {
      orgId: 'orgId'
    }

    const effects = initEffects()
    ;(activatedRouteMock.queryParams as ReplaySubject<any>).next(criteria)
    store.overrideSelector(tenantSearchSelectors.selectCriteria, criteria)
    effectsActions.next(
      TenantSearchActions.searchButtonClicked({
        searchCriteria: { orgId: '' }
      })
    )

    effects.syncParamsToUrl$.subscribe(() => {
      expect(spy).toHaveBeenCalledTimes(0)
      done()
    })
  })

  it('should navigate when query params are different than search criteria on TenantSearchActions.resetButtonClicked dispatch', (done) => {
    const spy = jest.spyOn(mockedRouter, 'navigate')

    const effects = initEffects()
    ;(activatedRouteMock.queryParams as ReplaySubject<any>).next({
      orgId: 'orgId'
    })
    store.overrideSelector(tenantSearchSelectors.selectCriteria, { orgId: 'differentId' })
    effectsActions.next(TenantSearchActions.resetButtonClicked())

    effects.syncParamsToUrl$.subscribe(() => {
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    })
  })

  it('should not navigate when query params are same as search criteria on TenantSearchActions.resetButtonClicked dispatch', (done) => {
    const spy = jest.spyOn(mockedRouter, 'navigate')

    const criteria = {
      orgId: 'orgId'
    }

    const effects = initEffects()
    ;(activatedRouteMock.queryParams as ReplaySubject<any>).next(criteria)
    store.overrideSelector(tenantSearchSelectors.selectCriteria, criteria)
    effectsActions.next(TenantSearchActions.resetButtonClicked())

    effects.syncParamsToUrl$.subscribe(() => {
      expect(spy).toHaveBeenCalledTimes(0)
      done()
    })
  })
})


```

### File: app/tenant/pages/tenant-search/tenant-search.effects.ts

```ts

import { Injectable, SkipSelf } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { routerNavigatedAction } from '@ngrx/router-store'
import { Action, Store } from '@ngrx/store'
import { concatLatestFrom } from '@ngrx/operators'
import { catchError, map, of, switchMap, tap } from 'rxjs'
import * as equal from 'fast-deep-equal'

import { PortalMessageService } from '@onecx/angular-integration-interface'
import {
  filterForNavigatedTo,
  filterOutOnlyQueryParamsChanged,
  filterOutQueryParamsHaveNotChanged
} from '@onecx/ngrx-accelerator'

import { TenantBffService } from '../../../shared/generated'
import { TenantSearchActions } from './tenant-search.actions'
import { TenantSearchComponent } from './tenant-search.component'
import { tenantSearchCriteriasSchema } from './tenant-search.parameters'
import { tenantSearchSelectors } from './tenant-search.selectors'

@Injectable()
export class TenantSearchEffects {
  constructor(
    private readonly actions$: Actions,
    @SkipSelf() private readonly route: ActivatedRoute,
    private readonly tenantService: TenantBffService,
    private readonly router: Router,
    private readonly store: Store,
    private readonly messageService: PortalMessageService
  ) {}

  pageName = 'tenant'

  syncParamsToUrl$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TenantSearchActions.searchButtonClicked, TenantSearchActions.resetButtonClicked),
        concatLatestFrom(() => [this.store.select(tenantSearchSelectors.selectCriteria), this.route.queryParams]),
        tap(([, criteria, queryParams]) => {
          const results = tenantSearchCriteriasSchema.safeParse(queryParams)
          if (!results.success || !equal(criteria, results.data)) {
            const params = {
              ...criteria
            }
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: params,
              replaceUrl: true,
              onSameUrlNavigation: 'ignore'
            })
          }
        })
      )
    },
    { dispatch: false }
  )

  searchByUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, TenantSearchComponent),
      filterOutQueryParamsHaveNotChanged(this.router, tenantSearchCriteriasSchema, true),
      concatLatestFrom(() => this.store.select(tenantSearchSelectors.selectCriteria)),
      switchMap(([, searchCriteria]) => {
        return this.tenantService.searchTenants(searchCriteria).pipe(
          map(({ stream, totalElements }) =>
            TenantSearchActions.tenantSearchResultsReceived({
              results: stream,
              totalElements
            })
          ),
          catchError((error) =>
            of(
              TenantSearchActions.tenantSearchResultsLoadingFailed({
                error
              })
            )
          )
        )
      })
    )
  })

  rehydrateChartVisibility$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, TenantSearchComponent),
      filterOutOnlyQueryParamsChanged(this.router),
      map(() =>
        TenantSearchActions.chartVisibilityRehydrated({
          visible: localStorage.getItem('tenantChartVisibility') === 'true'
        })
      )
    )
  })

  saveChartVisibility$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TenantSearchActions.chartVisibilityToggled),
        concatLatestFrom(() => this.store.select(tenantSearchSelectors.selectChartVisible)),
        tap(([, chartVisible]) => {
          localStorage.setItem('tenantChartVisibility', String(chartVisible))
        })
      )
    },
    { dispatch: false }
  )

  errorMessages: { action: Action; key: string }[] = [
    {
      action: TenantSearchActions.tenantSearchResultsLoadingFailed,
      key: 'TENANT_SEARCH.ERROR_MESSAGES.SEARCH_RESULTS_LOADING_FAILED'
    }
  ]

  displayError$ = createEffect(
    () => {
      return this.actions$.pipe(
        tap((action) => {
          const e = this.errorMessages.find((e) => e.action.type === action.type)
          if (e) {
            this.messageService.error({ summaryKey: e.key })
          }
        })
      )
    },
    { dispatch: false }
  )
}


```

### File: app/tenant/pages/tenant-search/tenant-search.harness.ts

```ts

import { ComponentHarness } from '@angular/cdk/testing'
import {
  GroupByCountDiagramHarness,
  InteractiveDataViewHarness,
  SearchHeaderHarness
} from '@onecx/angular-accelerator/testing'

export class TenantSearchHarness extends ComponentHarness {
  static readonly hostSelector = 'app-tenant-search'

  getHeader = this.locatorFor(SearchHeaderHarness)
  getSearchResults = this.locatorFor(InteractiveDataViewHarness)
  getDiagram = this.locatorForOptional(GroupByCountDiagramHarness)
}


```

### File: app/tenant/pages/tenant-search/tenant-search.parameters.ts

```ts

import { TenantSearchCriteria as TenantSearchRequest } from 'src/app/shared/generated'
import { z, ZodTypeAny } from 'zod'

export const tenantSearchCriteriasSchema = z.object({
  orgId: z.string().optional(),
  pageNumber: z
    .string()
    .transform((v) => (v ? Number(v) : undefined))
    .optional(),
  pageSize: z
    .string()
    .transform((v) => (v ? Number(v) : undefined))
    .optional()
} satisfies Partial<Record<keyof TenantSearchRequest, ZodTypeAny>>)

export type TenantSearchCriteria = z.infer<typeof tenantSearchCriteriasSchema>


```

### File: app/tenant/pages/tenant-search/tenant-search.reducer.spec.ts

```ts

import { routerNavigatedAction } from '@ngrx/router-store'
import { TenantSearchActions } from './tenant-search.actions'
import { initialState, tenantSearchReducer } from './tenant-search.reducers'
import { ColumnType } from '@onecx/angular-accelerator'
import { tenantSearchCriteriasSchema } from './tenant-search.parameters'

describe('TenantSearchReducer', () => {
  describe('on tenantReceived action', () => {
    describe('with the initial state', () => {
      it('should store the results', () => {
        const tenant = {
          results: [
            { id: '123', modificationCount: 1 },
            { id: '234', modificationCount: 1 }
          ],
          totalElements: 2
        }
        const action = TenantSearchActions.tenantSearchResultsReceived(tenant)
        const nextState = tenantSearchReducer(initialState, action)
        expect(nextState).toEqual({
          ...initialState,
          results: tenant.results
        })
        expect(nextState).not.toBe(initialState)
      })
    })
  })

  it('should return the initial state', () => {
    const action = { type: 'Unknown' } as any
    const state = tenantSearchReducer(undefined, action)
    expect(state).toBe(initialState)
  })

  it('should update criteria on routerNavigatedAction with valid queryParams', () => {
    const queryParams = { orgId: 'test' }
    const action = routerNavigatedAction({
      payload: {
        routerState: {
          root: { queryParams }
        }
      } as any
    })
    const state = tenantSearchReducer(initialState, action)
    expect(state.criteria).toEqual(queryParams)
  })

  it('should return unchanged state if routerNavigatedAction has invalid queryParams', () => {
    const invalidQueryParams = { invalid: true }

    // Mock schema to simulate failure
    jest.spyOn(tenantSearchCriteriasSchema, 'safeParse').mockReturnValueOnce({
      success: false,
      error: {} as any
    })

    const action = routerNavigatedAction({
      payload: {
        routerState: {
          root: { queryParams: invalidQueryParams }
        }
      } as any
    })

    const state = tenantSearchReducer(initialState, action)
    expect(state).toBe(initialState)
  })

  it('should return unchanged state if searchConfigSelected is called with null', () => {
    const action = TenantSearchActions.searchConfigSelected({ searchConfig: null as any })
    const state = tenantSearchReducer(initialState, action)
    expect(state).toBe(initialState)
  })

  it('should return unchanged state if searchConfigSelected has invalid fieldValues', () => {
    jest.spyOn(tenantSearchCriteriasSchema, 'safeParse').mockReturnValueOnce({
      success: false,
      error: {} as any
    })

    const action = TenantSearchActions.searchConfigSelected({
      searchConfig: {
        fieldValues: { invalid: 'true' },
        displayedColumnsIds: ['id'],
        viewMode: 'basic',
        name: ''
      }
    })

    const state = tenantSearchReducer(initialState, action)
    expect(state).toBe(initialState)
  })

  it('should update criteria, displayedColumns and viewMode on searchConfigSelected', () => {
    const action = TenantSearchActions.searchConfigSelected({
      searchConfig: {
        fieldValues: { orgId: 'test' },
        displayedColumnsIds: ['orgId'],
        viewMode: 'advanced',
        name: 'name'
      }
    })
    const state = tenantSearchReducer(initialState, action)
    expect(state.criteria).toEqual({ orgId: 'test' })
    expect(state.displayedColumns).toEqual(['orgId'])
    expect(state.viewMode).toBe('advanced')
  })

  it('should update criteria on searchButtonClicked', () => {
    const action = TenantSearchActions.searchButtonClicked({
      searchCriteria: { orgId: 'orgId' }
    })
    const state = tenantSearchReducer(initialState, action)
    expect(state.criteria).toEqual({ orgId: 'orgId' })
  })

  it('should reset criteria on resetButtonClicked', () => {
    const modifiedState = { ...initialState, criteria: { orgId: 'test' } }
    const action = TenantSearchActions.resetButtonClicked()
    const state = tenantSearchReducer(modifiedState, action)
    expect(state.criteria).toEqual({})
  })

  it('should clear results on tenantSearchResultsLoadingFailed', () => {
    const modifiedState = { ...initialState, results: [{ id: '1' }] }
    const action = TenantSearchActions.tenantSearchResultsLoadingFailed({ error: '' })
    const state = tenantSearchReducer(modifiedState, action)
    expect(state.results).toEqual([])
  })

  it('should set chartVisible on chartVisibilityRehydrated', () => {
    const action = TenantSearchActions.chartVisibilityRehydrated({ visible: true })
    const state = tenantSearchReducer(initialState, action)
    expect(state.chartVisible).toBe(true)
  })

  it('should toggle chartVisible on chartVisibilityToggled', () => {
    const action = TenantSearchActions.chartVisibilityToggled()
    const state = tenantSearchReducer({ ...initialState, chartVisible: false }, action)
    expect(state.chartVisible).toBe(true)
  })

  it('should change viewMode on viewModeChanged', () => {
    const action = TenantSearchActions.viewModeChanged({ viewMode: 'advanced' })
    const state = tenantSearchReducer(initialState, action)
    expect(state.viewMode).toBe('advanced')
  })

  it('should update displayedColumns on displayedColumnsChanged', () => {
    const action = TenantSearchActions.displayedColumnsChanged({
      displayedColumns: [{ id: 'name', columnType: ColumnType.STRING, nameKey: '' }]
    })
    const state = tenantSearchReducer(initialState, action)
    expect(state.displayedColumns).toEqual(['name'])
  })
})


```

### File: app/tenant/pages/tenant-search/tenant-search.reducers.ts

```ts

import { createReducer, on } from '@ngrx/store'
import { TenantSearchActions } from './tenant-search.actions'
import { tenantSearchColumns } from './tenant-search.columns'
import { TenantSearchState } from './tenant-search.state'
import { RouterNavigatedAction, routerNavigatedAction } from '@ngrx/router-store'
import { tenantSearchCriteriasSchema } from './tenant-search.parameters'

export const initialState: TenantSearchState = {
  columns: tenantSearchColumns,
  results: [],
  displayedColumns: null,
  viewMode: 'basic',
  chartVisible: false,
  criteria: {}
}

export const tenantSearchReducer = createReducer(
  initialState,
  on(routerNavigatedAction, (state: TenantSearchState, action: RouterNavigatedAction) => {
    const results = tenantSearchCriteriasSchema.safeParse(action.payload.routerState.root.queryParams)
    if (results.success) {
      return {
        ...state,
        criteria: results.data
      }
    }
    return state
  }),
  on(TenantSearchActions.searchConfigSelected, (state: TenantSearchState, { searchConfig }): TenantSearchState => {
    if (!searchConfig) return state
    const results = tenantSearchCriteriasSchema.safeParse(searchConfig.fieldValues)
    if (results.success) {
      return {
        ...state,
        criteria: results.data,
        displayedColumns: searchConfig.displayedColumnsIds,
        viewMode: searchConfig.viewMode
      }
    }
    return state
  }),
  on(
    TenantSearchActions.searchButtonClicked,
    (state: TenantSearchState, { searchCriteria }): TenantSearchState => ({
      ...state,
      criteria: searchCriteria
    })
  ),
  on(
    TenantSearchActions.resetButtonClicked,
    (state: TenantSearchState): TenantSearchState => ({
      ...state,
      criteria: {}
    })
  ),
  on(
    TenantSearchActions.tenantSearchResultsReceived,
    (state: TenantSearchState, { results }): TenantSearchState => ({
      ...state,
      results
    })
  ),
  on(
    TenantSearchActions.tenantSearchResultsLoadingFailed,
    (state: TenantSearchState): TenantSearchState => ({
      ...state,
      results: []
    })
  ),
  on(
    TenantSearchActions.chartVisibilityRehydrated,
    (state: TenantSearchState, { visible }): TenantSearchState => ({
      ...state,
      chartVisible: visible
    })
  ),
  on(
    TenantSearchActions.chartVisibilityToggled,
    (state: TenantSearchState): TenantSearchState => ({
      ...state,
      chartVisible: !state.chartVisible
    })
  ),
  on(
    TenantSearchActions.viewModeChanged,
    (state: TenantSearchState, { viewMode }): TenantSearchState => ({
      ...state,
      viewMode: viewMode
    })
  ),
  on(TenantSearchActions.displayedColumnsChanged, (state: TenantSearchState, { displayedColumns }) => ({
    ...state,
    displayedColumns: displayedColumns.map((c) => c.id)
  }))
)


```

### File: app/tenant/pages/tenant-search/tenant-search.selectors.spec.ts

```ts

import { DataTableColumn, RowListGridData } from '@onecx/angular-accelerator'
import { ColumnType } from '@onecx/portal-integration-angular'

import { selectTenantSearchViewModel, selectDisplayedColumns, selectResults } from './tenant-search.selectors'

describe('Tenant search selectors:', () => {
  describe('selectSearchResultsCount', () => {
    it('should return the amount of results', () => {
      expect(selectDisplayedColumns.projector([], [])).toHaveLength(0)
    })

    it('should return 0 when results are not defined', () => {
      expect(selectResults.projector([])).toHaveLength(0)
    })
  })

  it('should filter out undefined columns when displayedColumns contains unknown ids', () => {
    const columns: DataTableColumn[] = [
      { id: 'name', nameKey: 'Name', columnType: ColumnType.STRING },
      { id: 'email', nameKey: 'Email', columnType: ColumnType.STRING }
    ]

    const displayedColumns = ['name', 'unknown', 'email']

    const result = selectDisplayedColumns.projector(columns, displayedColumns)

    expect(result).toEqual([
      { id: 'name', nameKey: 'Name', columnType: ColumnType.STRING },
      { id: 'email', nameKey: 'Email', columnType: ColumnType.STRING }
    ])
  })

  describe('selectTenantSearchViewModel', () => {
    it('should combine the input to be the viewmodel', () => {
      const columns: DataTableColumn[] = [
        {
          columnType: ColumnType.STRING,
          id: 'id',
          nameKey: 'TENANT_SEARCH.COLUMNS.ID',
          filterable: true,
          sortable: true,
          predefinedGroupKeys: [
            'TENANT_SEARCH.PREDEFINED_GROUP.DEFAULT',
            'TENANT_SEARCH.PREDEFINED_GROUP.EXTENDED',
            'TENANT_SEARCH.PREDEFINED_GROUP.FULL'
          ]
        },
        {
          columnType: ColumnType.STRING,
          id: 'orgId',
          nameKey: 'TENANT_SEARCH.COLUMNS.ORG_ID',
          filterable: true,
          sortable: true,
          predefinedGroupKeys: [
            'TENANT_SEARCH.PREDEFINED_GROUP.DEFAULT',
            'TENANT_SEARCH.PREDEFINED_GROUP.EXTENDED',
            'TENANT_SEARCH.PREDEFINED_GROUP.FULL'
          ]
        }
      ]

      const searchCriteria = {
        orgId: '1'
      }
      const results: RowListGridData[] = [{ id: 1, imagePath: '' }]
      const displayedColumns: DataTableColumn[] = [
        {
          columnType: ColumnType.STRING,
          id: 'id',
          nameKey: 'TENANT_SEARCH.COLUMNS.ID',
          filterable: true,
          sortable: true,
          predefinedGroupKeys: [
            'TENANT_SEARCH.PREDEFINED_GROUP.DEFAULT',
            'TENANT_SEARCH.PREDEFINED_GROUP.EXTENDED',
            'TENANT_SEARCH.PREDEFINED_GROUP.FULL'
          ]
        },
        {
          columnType: ColumnType.STRING,
          id: 'orgId',
          nameKey: 'TENANT_SEARCH.COLUMNS.ORG_ID',
          filterable: true,
          sortable: true,
          predefinedGroupKeys: [
            'TENANT_SEARCH.PREDEFINED_GROUP.DEFAULT',
            'TENANT_SEARCH.PREDEFINED_GROUP.EXTENDED',
            'TENANT_SEARCH.PREDEFINED_GROUP.FULL'
          ]
        }
      ]
      const viewMode = 'advanced' as 'basic' | 'advanced'
      const chartVisible = false
      expect(
        selectTenantSearchViewModel.projector(
          columns,
          searchCriteria,
          results,
          displayedColumns,
          viewMode,
          chartVisible
        )
      ).toEqual({
        columns: columns,
        searchCriteria: searchCriteria,
        results: results,
        displayedColumns: displayedColumns,
        viewMode: viewMode,
        chartVisible: chartVisible
      })
    })

    it('should map results and add imagePath', () => {
      const input = [
        { id: '1', name: 'Tenant A' },
        { id: '2', name: 'Tenant B' }
      ]

      const result = selectResults.projector(input)

      expect(result).toEqual([
        { imagePath: '', id: '1', name: 'Tenant A' },
        { imagePath: '', id: '2', name: 'Tenant B' }
      ])
    })
  })
})


```

### File: app/tenant/pages/tenant-search/tenant-search.selectors.ts

```ts

import { createSelector } from '@ngrx/store'

import { RowListGridData } from '@onecx/angular-accelerator'
import { DataTableColumn } from '@onecx/portal-integration-angular'
import { createChildSelectors } from '@onecx/ngrx-accelerator'

import { tenantFeature } from '../../tenant.reducers'
import { initialState } from './tenant-search.reducers'
import { TenantSearchViewModel } from './tenant-search.viewmodel'

export const tenantSearchSelectors = createChildSelectors(tenantFeature.selectSearch, initialState)

export const selectResults = createSelector(tenantSearchSelectors.selectResults, (results): RowListGridData[] => {
  return results.map((item) => ({
    imagePath: '',
    ...item
    // ACTION S6: Here you can create a mapping of the items and their corresponding translation strings
  }))
})

export const selectDisplayedColumns = createSelector(
  tenantSearchSelectors.selectColumns,
  tenantSearchSelectors.selectDisplayedColumns,
  (columns, displayedColumns): DataTableColumn[] => {
    return (displayedColumns?.map((d) => columns.find((c) => c.id === d)).filter((d) => d) as DataTableColumn[]) ?? []
  }
)

export const selectTenantSearchViewModel = createSelector(
  tenantSearchSelectors.selectColumns,
  tenantSearchSelectors.selectCriteria,
  selectResults,
  selectDisplayedColumns,
  tenantSearchSelectors.selectViewMode,
  tenantSearchSelectors.selectChartVisible,
  (columns, searchCriteria, results, displayedColumns, viewMode, chartVisible): TenantSearchViewModel => ({
    columns,
    searchCriteria,
    results,
    displayedColumns,
    viewMode,
    chartVisible
  })
)


```

### File: app/tenant/pages/tenant-search/tenant-search.state.ts

```ts

import { DataTableColumn } from '@onecx/angular-accelerator'

import { Tenant } from 'src/app/shared/generated'
import { TenantSearchCriteria } from './tenant-search.parameters'

export interface TenantSearchState {
  columns: DataTableColumn[]
  criteria: TenantSearchCriteria
  results: Tenant[]
  displayedColumns: string[] | null
  viewMode: 'basic' | 'advanced'
  chartVisible: boolean
}


```

### File: app/tenant/pages/tenant-search/tenant-search.viewmodel.ts

```ts

import { DataTableColumn, RowListGridData } from '@onecx/angular-accelerator'

import { TenantSearchCriteria } from './tenant-search.parameters'

export interface TenantSearchViewModel {
  columns: DataTableColumn[]
  searchCriteria: TenantSearchCriteria
  results: RowListGridData[]
  displayedColumns: DataTableColumn[]
  viewMode: 'basic' | 'advanced'
  chartVisible: boolean
}


```

## Folder: app/tenant (5 files)

### File: app/tenant/tenant.module.ts

```ts

import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { CalendarModule } from 'primeng/calendar'

import { providePortalDialogService, PortalCoreModule } from '@onecx/portal-integration-angular'
import { addInitializeModuleGuard } from '@onecx/angular-integration-interface'

import { SharedModule } from 'src/app/shared/shared.module'
import { tenantFeature } from './tenant.reducers'
import { routes } from './tenant.routes'

import { TenantSearchComponent } from './pages/tenant-search/tenant-search.component'
import { TenantSearchEffects } from './pages/tenant-search/tenant-search.effects'

@NgModule({
  providers: [providePortalDialogService()],
  declarations: [TenantSearchComponent],
  imports: [
    CalendarModule,
    CommonModule,
    EffectsModule.forFeature([TenantSearchEffects]),
    LetDirective,
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forChild(addInitializeModuleGuard(routes)),
    SharedModule,
    StoreModule.forFeature(tenantFeature)
  ]
})
export class TenantModule {}


```

### File: app/tenant/tenant.reducers.ts

```ts

import { combineReducers, createFeature } from '@ngrx/store'

import { TenantState } from './tenant.state'
import { tenantSearchReducer } from './pages/tenant-search/tenant-search.reducers'

export const tenantFeature = createFeature({
  name: 'tenant',
  reducer: combineReducers<TenantState>({
    search: tenantSearchReducer
  })
})


```

### File: app/tenant/tenant.routes.ts

```ts

import { Routes } from '@angular/router'

import { TenantSearchComponent } from './pages/tenant-search/tenant-search.component'

export const routes: Routes = [
  {
    path: '',
    component: TenantSearchComponent,
    pathMatch: 'full'
  }
]


```

### File: app/tenant/tenant.selectors.ts

```ts

import { createFeatureSelector } from '@ngrx/store'
import { tenantFeature } from './tenant.reducers'
import { TenantState } from './tenant.state'

export const selectTenantFeature = createFeatureSelector<TenantState>(tenantFeature.name)


```

### File: app/tenant/tenant.state.ts

```ts

import { TenantSearchState } from './pages/tenant-search/tenant-search.state'

export interface TenantState {
  search: TenantSearchState
}


```


