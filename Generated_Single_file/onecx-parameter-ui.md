# Files from C:\Users\prath\onecx\onecx-ui\onecx-parameter-ui\src

## Folder: onecx-parameter-ui/src/app (7 files)

### File: onecx-parameter-ui/src/app/app.component.html

```html

<ocx-portal-viewport></ocx-portal-viewport>


```

### File: onecx-parameter-ui/src/app/app.component.spec.ts

```ts

import { NO_ERRORS_SCHEMA } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { AppComponent } from './app.component'

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it(`should have as title 'onecx-ui'`, () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app.title).toEqual('onecx-ui')
  })
})


```

### File: onecx-parameter-ui/src/app/app.component.ts

```ts

import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'onecx-ui'
}


```

### File: onecx-parameter-ui/src/app/app.module.ts

```ts

import { APP_INITIALIZER, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { RouterModule, Routes } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateLoader, TranslateModule, TranslateService, MissingTranslationHandler } from '@ngx-translate/core'

import { KeycloakAuthModule } from '@onecx/keycloak-auth'
import { createTranslateLoader, provideTranslationPathFromMeta } from '@onecx/angular-utils'
import { APP_CONFIG, UserService } from '@onecx/angular-integration-interface'
import {
  translateServiceInitializer,
  PortalCoreModule,
  PortalMissingTranslationHandler
} from '@onecx/portal-integration-angular'

import { environment } from 'src/environments/environment'
import { AppComponent } from './app.component'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./parameter/parameter.module').then((m) => m.ParameterModule)
  }
]
@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    KeycloakAuthModule,
    PortalCoreModule.forRoot('onecx-parameter-ui'),
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      enableTracing: true
    }),
    TranslateModule.forRoot({
      isolate: true,
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: PortalMissingTranslationHandler }
    })
  ],
  providers: [
    { provide: APP_CONFIG, useValue: environment },
    {
      provide: APP_INITIALIZER,
      useFactory: translateServiceInitializer,
      multi: true,
      deps: [UserService, TranslateService]
    },
    provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/'),
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppModule {
  constructor() {
    console.info('OneCX Parameter Module constructor')
  }
}


```

### File: onecx-parameter-ui/src/app/app-entrypoint.component.html

```html

<router-outlet></router-outlet>


```

### File: onecx-parameter-ui/src/app/app-entrypoint.component.ts

```ts

import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app-entrypoint.component.html'
})
export class AppEntrypointComponent {}


```

### File: onecx-parameter-ui/src/app/onecx-parameter-remote.module.ts

```ts

import { APP_INITIALIZER, DoBootstrap, Injector, NgModule } from '@angular/core'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule, Routes, Router } from '@angular/router'
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { firstValueFrom } from 'rxjs'

import { AngularAuthModule } from '@onecx/angular-auth'
import { createTranslateLoader, provideTranslationPathFromMeta } from '@onecx/angular-utils'
import { createAppEntrypoint, initializeRouter, startsWith } from '@onecx/angular-webcomponents'
import {
  addInitializeModuleGuard,
  AppConfigService,
  AppStateService,
  ConfigurationService
} from '@onecx/angular-integration-interface'
import { AngularAcceleratorMissingTranslationHandler } from '@onecx/angular-accelerator'
import { PortalApiConfiguration, PortalCoreModule } from '@onecx/portal-integration-angular'

import { Configuration } from './shared/generated'
import { environment } from 'src/environments/environment'
import { AppEntrypointComponent } from './app-entrypoint.component'

function apiConfigProvider(configService: ConfigurationService, appStateService: AppStateService) {
  return new PortalApiConfiguration(Configuration, environment.apiPrefix, configService, appStateService)
}

export function appConfigServiceInitializer(appStateService: AppStateService, appConfigService: AppConfigService) {
  return async () => {
    const mfe = await firstValueFrom(appStateService.currentMfe$.asObservable())
    await appConfigService.init(mfe.remoteBaseUrl)
  }
}

const routes: Routes = [
  {
    matcher: startsWith(''),
    loadChildren: () => import('./parameter/parameter.module').then((m) => m.ParameterModule)
  }
]
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
    })
  ],
  providers: [
    ConfigurationService,
    { provide: Configuration, useFactory: apiConfigProvider, deps: [ConfigurationService, AppStateService] },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeRouter,
      multi: true,
      deps: [Router, AppStateService]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appConfigServiceInitializer,
      multi: true,
      deps: [AppStateService, AppConfigService]
    },
    provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/'),
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class OneCXParameterModule implements DoBootstrap {
  constructor(
    private readonly injector: Injector,
    private readonly appConfigService: AppConfigService
  ) {
    console.info('OneCX Parameter Module constructor')
  }

  ngDoBootstrap(): void {
    const envElementName = this.appConfigService.getProperty('APP_ELEMENT_NAME')
    createAppEntrypoint(
      AppEntrypointComponent,
      envElementName && !envElementName.includes('$') ? envElementName : 'ocx-parameter-component',
      this.injector
    )
  }
}


```

//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

## Folder: onecx-parameter-ui/src/app/parameter (1 files)

### File: onecx-parameter-ui/src/app/parameter/parameter.module.ts

```ts

import { NgModule } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'

import { InitializeModuleGuard, addInitializeModuleGuard } from '@onecx/angular-integration-interface'
import { PortalCoreModule } from '@onecx/portal-integration-angular'

import { SharedModule } from 'src/app/shared/shared.module'
import { LabelResolver } from 'src/app/shared/label.resolver'

import { ParameterSearchComponent } from './parameter-search/parameter-search.component'
import { ParameterCriteriaComponent } from './parameter-criteria/parameter-criteria.component'
import { ParameterDetailComponent } from './parameter-detail/parameter-detail.component'
import { UsageSearchComponent } from './usage-search/usage-search.component'
import { UsageDetailComponent } from './usage-detail/usage-detail.component'
import { UsageDetailCriteriaComponent } from './usage-detail/usage-detail-criteria/usage-detail-criteria.component'
import { UsageDetailListComponent } from './usage-detail/usage-detail-list/usage-detail-list.component'

const routes: Routes = [
  {
    path: '',
    component: ParameterSearchComponent,
    pathMatch: 'full'
  },
  {
    path: 'usage',
    component: UsageSearchComponent,
    pathMatch: 'full',
    data: {
      breadcrumb: 'BREADCRUMBS.USAGE',
      breadcrumbFn: (data: any) => `${data.labeli18n}`
    },
    resolve: {
      labeli18n: LabelResolver
    }
  }
]
@NgModule({
  declarations: [
    ParameterSearchComponent,
    ParameterCriteriaComponent,
    ParameterDetailComponent,
    UsageSearchComponent,
    UsageDetailComponent,
    UsageDetailCriteriaComponent,
    UsageDetailListComponent
  ],
  imports: [
    CommonModule,
    PortalCoreModule.forMicroFrontend(),
    [RouterModule.forChild(addInitializeModuleGuard(routes))],
    SharedModule
  ],
  providers: [InitializeModuleGuard, DatePipe]
})
export class ParameterModule {
  constructor() {
    console.info('Parameter Module constructor')
  }
}


```

//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

## Folder: onecx-parameter-ui/src/app/parameter/parameter-criteria (3 files)

### File: onecx-parameter-ui/src/app/parameter/parameter-criteria/parameter-criteria.component.html

```html

<ocx-search-header
  [header]="'DIALOG.' + type + '.HEADER' | translate"
  [subheader]="'DIALOG.' + type + '.SUBHEADER' | translate"
  (searched)="onSearch()"
  (resetted)="onResetCriteria()"
  [manualBreadcrumbs]="false"
  [actions]="actions"
>
  <div [formGroup]="criteriaForm" class="flex flex-wrap gap-3">
    <span class="p-float-label">
      <p-dropdown
        id="pam_search_criteria_product_name"
        styleClass="w-11rem sm:w-18rem text-responsive"
        panelStyleClass="w-11rem sm:w-18rem"
        formControlName="productName"
        [options]="productOptions"
        (onChange)="onChangeProductName($event.value)"
        [showClear]="true"
        [appendTo]="'body'"
        [emptyMessage]="'ACTIONS.SEARCH.CRITERIA.NO_PRODUCT' | translate"
        [ariaLabel]="'PARAMETER.PRODUCT_NAME' | translate"
        [pTooltip]="'PARAMETER.TOOLTIPS.PRODUCT_NAME' | translate"
        tooltipPosition="top"
        tooltipEvent="hover"
      >
      </p-dropdown>
      <label for="pam_search_criteria_product_name" aria-hidden="true">
        {{ 'PARAMETER.PRODUCT_NAME' | translate }}
      </label>
    </span>
    <span *ocxAdvanced class="p-float-label">
      <p-dropdown
        id="pam_search_criteria_application_id"
        styleClass="w-11rem sm:w-18rem text-responsive"
        panelStyleClass="w-11rem sm:w-18rem"
        formControlName="applicationId"
        [options]="appOptions"
        [showClear]="true"
        [appendTo]="'body'"
        [emptyMessage]="'ACTIONS.SEARCH.CRITERIA.NO_APP' | translate"
        [ariaLabel]="'PARAMETER.APP_NAME' | translate"
        [pTooltip]="'PARAMETER.TOOLTIPS.APP_NAME' | translate"
        tooltipPosition="top"
        tooltipEvent="hover"
      >
      </p-dropdown>
      <label for="pam_search_criteria_application_id" aria-hidden="true">{{ 'PARAMETER.APP_NAME' | translate }}</label>
    </span>
    <span class="p-float-label">
      <input
        id="pam_search_criteria_name"
        pInputText
        type="text"
        formControlName="name"
        class="w-11rem sm:w-18rem text-responsive"
        [attr.aria-label]="'PARAMETER.NAME' | translate"
        [pTooltip]="'PARAMETER.TOOLTIPS.COMBINED_NAME' | translate"
        tooltipPosition="top"
        tooltipEvent="hover"
      />
      <label for="pam_search_criteria_name" aria-hidden="true">{{ 'PARAMETER.NAME' | translate }}</label>
    </span>
  </div>
</ocx-search-header>


```

### File: onecx-parameter-ui/src/app/parameter/parameter-criteria/parameter-criteria.component.spec.ts

```ts

import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { FormControl, FormGroup } from '@angular/forms'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { SelectItem } from 'primeng/api'

import { UserService } from '@onecx/angular-integration-interface'

import { ExtendedProduct, ApplicationAbstract } from '../parameter-search/parameter-search.component'
import { ParameterCriteriaComponent, CriteriaForm } from './parameter-criteria.component'

const filledCriteria = new FormGroup<CriteriaForm>({
  productName: new FormControl<string | null>('productName'),
  applicationId: new FormControl<string | null>('applicationId'),
  name: new FormControl<string | null>('name')
})
const emptyCriteria = new FormGroup<CriteriaForm>({
  productName: new FormControl<string | null>(null),
  applicationId: new FormControl<string | null>(null),
  name: new FormControl<string | null>(null)
})
const app1: ApplicationAbstract = { appId: 'app1-svc', appName: 'OneCX app svc 1' }
const app2: ApplicationAbstract = { appId: 'app2-svc', appName: 'OneCX app svc 2' }
const usedProducts: ExtendedProduct[] = [
  { name: 'product1', displayName: 'Product 1', applications: [app1, app2] },
  { name: 'product2', displayName: 'Product 2', applications: [app2] }
]
const usedProductsSI: SelectItem[] = [
  { label: 'Product 1', value: 'product1' },
  { label: 'Product 2', value: 'product2' }
]
const appOptionsP1: SelectItem[] = [
  { label: app1.appName, value: app1.appId },
  { label: app2.appName, value: app2.appId }
]

describe('ParameterCriteriaComponent', () => {
  let component: ParameterCriteriaComponent
  let fixture: ComponentFixture<ParameterCriteriaComponent>

  const mockUserService = { lang$: { getValue: jasmine.createSpy('getValue') } }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ParameterCriteriaComponent],
      imports: [
        TranslateTestingModule.withTranslations({
          de: require('src/assets/i18n/de.json'),
          en: require('src/assets/i18n/en.json')
        }).withDefaultLanguage('en')
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: UserService, useValue: mockUserService }]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterCriteriaComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    mockUserService.lang$.getValue.and.returnValue('de')
  })

  describe('construction', () => {
    it('should create', () => {
      expect(component).toBeTruthy()
    })
  })

  describe('ngOnChange', () => {
    it('should initialize', () => {
      component.usedProducts = usedProducts

      component.ngOnChanges()

      expect(component.productOptions).toEqual(usedProductsSI)
    })
  })

  describe('onSearch & onResetCriteria', () => {
    it('should search parameters without criteria', () => {
      component.criteriaForm = emptyCriteria
      spyOn(component.searchEmitter, 'emit')

      component.onSearch()

      expect(component.searchEmitter.emit).toHaveBeenCalled()
    })

    it('should search parameters with criteria', () => {
      component.criteriaForm = filledCriteria
      spyOn(component.searchEmitter, 'emit')

      component.onSearch()

      expect(component.searchEmitter.emit).toHaveBeenCalled()
    })

    it('should reset search criteria', () => {
      component.criteriaForm = filledCriteria
      spyOn(component.searchEmitter, 'emit')

      component.onSearch()

      expect(component.searchEmitter.emit).toHaveBeenCalled()

      spyOn(component.resetSearchEmitter, 'emit')
      spyOn(component.criteriaForm, 'reset')

      component.onResetCriteria()

      expect(component.criteriaForm.reset).toHaveBeenCalled()
      expect(component.resetSearchEmitter.emit).toHaveBeenCalled()
    })
  })

  describe('onChangeProductName', () => {
    it('should reject update appOptions and clear target dropdown if no product name is provided', () => {
      component.onChangeProductName(null) // clear product name

      expect(component.appOptions).toEqual([])
    })

    it('should update appOptions based on the product name', () => {
      component.usedProducts = usedProducts
      component.onChangeProductName(usedProducts[0].name!)

      expect(component.appOptions).toEqual(appOptionsP1)
    })

    it('should clear appOptions if productName does not match', () => {
      component.usedProducts = usedProducts
      component.onChangeProductName('unknown')

      expect(component.appOptions).toEqual([])
    })
  })
})


```

### File: onecx-parameter-ui/src/app/parameter/parameter-criteria/parameter-criteria.component.ts

```ts

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { SelectItem } from 'primeng/api'

import { Action } from '@onecx/angular-accelerator'

import { ParameterSearchCriteria } from 'src/app/shared/generated'
import { dropDownSortItemsByLabel } from 'src/app/shared/utils'
import { ExtendedProduct } from '../parameter-search/parameter-search.component'

export interface CriteriaForm {
  applicationId: FormControl<string | null>
  productName: FormControl<string | null>
  name: FormControl<string | null>
}

@Component({
  selector: 'app-parameter-criteria',
  templateUrl: './parameter-criteria.component.html',
  styleUrls: ['./parameter-criteria.component.scss']
})
export class ParameterCriteriaComponent implements OnChanges {
  @Input() public type = 'PARAMETER'
  @Input() public actions: Action[] = []
  @Input() public usedProducts: ExtendedProduct[] = [] // products used with data
  @Output() public searchEmitter = new EventEmitter<ParameterSearchCriteria>()
  @Output() public resetSearchEmitter = new EventEmitter<boolean>()

  public criteriaForm: FormGroup<CriteriaForm>
  public productOptions: SelectItem[] = []
  public appOptions: SelectItem[] = []

  constructor(public readonly translate: TranslateService) {
    this.criteriaForm = new FormGroup<CriteriaForm>({
      productName: new FormControl<string | null>(null),
      applicationId: new FormControl<string | null>(null),
      name: new FormControl<string | null>(null)
    })
  }

  public ngOnChanges(): void {
    this.productOptions = []
    if (this.usedProducts && this.usedProducts.length > 0) {
      this.productOptions = this.usedProducts.map((p) => ({ label: p.displayName, value: p.name }))
    }
  }

  /****************************************************************************
   *  UI Events
   */
  public onSearch(): void {
    const criteriaRequest: ParameterSearchCriteria = {
      productName: this.criteriaForm.value.productName === null ? undefined : this.criteriaForm.value.productName,
      applicationId: this.criteriaForm.value.applicationId === null ? undefined : this.criteriaForm.value.applicationId,
      name: this.criteriaForm.value.name === null ? undefined : this.criteriaForm.value.name
    }
    this.searchEmitter.emit(criteriaRequest)
  }

  public onResetCriteria(): void {
    this.criteriaForm.reset()
    this.resetSearchEmitter.emit(true)
  }

  /* product name was changed to 
     1. null        => clear appid dropdown content and item list
     2. diff. value => clear appid dropdown content and prepare new list
  */
  public onChangeProductName(name: string | null) {
    this.appOptions = []
    this.criteriaForm.controls['applicationId'].setValue(null)
    if (!name || !this.usedProducts) return
    this.usedProducts
      .filter((p) => p.name === name)
      .forEach((p) => {
        p.applications?.forEach((app) => {
          this.appOptions.push({ label: app.appName, value: app.appId })
        })
      })
    this.appOptions.sort(dropDownSortItemsByLabel)
  }
}


```

//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

## Folder: onecx-parameter-ui/src/app/parameter/parameter-detail (3 files)

### File: onecx-parameter-ui/src/app/parameter/parameter-detail/parameter-detail.component.html

```html

<p-dialog
  [header]="'DIALOG.DETAIL.' + changeMode + '.HEADER' | translate"
  [(visible)]="displayDialog"
  (onHide)="onDialogHide()"
  [modal]="true"
  [closable]="true"
  [draggable]="true"
  [resizable]="true"
  [style]="{ width: '620px' }"
  [breakpoints]="{
    '992px': '72vw',
    '848px': '80vw',
    '768px': '88vw',
    '730px': '95vw',
    '650px': '100vw'
  }"
>
  <p-message
    *ngIf="exceptionKey"
    id="am_detail_message_error"
    severity="error"
    [text]="exceptionKey | translate"
  ></p-message>

  <p-tabView *ngIf="!exceptionKey" [formGroup]="formGroup" errorTailor>
    <p-tabPanel
      [header]="'DIALOG.DETAIL.TAB.PROPS' | translate"
      [tooltip]="'DIALOG.DETAIL.TAB.TOOLTIPS.PROPS' | translate"
      tooltipPosition="top"
      tooltipEvent="hover"
    >
      <div class="flex flex-column row-gap-4">
        <div class="flex flex-row flex-wrap gap-4 justify-content-between">
          <span class="p-float-label flex-grow-1" controlErrorAnchor>
            <p-dropdown
              id="pam_detail_form_product_name"
              class="input-field"
              styleClass="w-20rem text-responsive"
              panelStyleClass="w-20rem"
              formControlName="productName"
              [options]="productOptions"
              (onChange)="onChangeProductName($event.value)"
              [autoDisplayFirst]="true"
              [appendTo]="'body'"
              [showClear]="['COPY', 'CREATE'].includes(this.changeMode)"
              [emptyMessage]="'ACTIONS.SEARCH.CRITERIA.NO_PRODUCT' | translate"
              [ariaLabel]="'PARAMETER.PRODUCT_NAME' | translate"
              [pTooltip]="'PARAMETER.TOOLTIPS.PRODUCT_NAME' | translate"
              tooltipPosition="top"
              tooltipEvent="hover"
            >
            </p-dropdown>
            <label class="ocx-required-label" for="pam_detail_form_product_name" aria-hidden="true">
              {{ 'PARAMETER.PRODUCT_NAME' | translate }}
            </label>
          </span>
          <span class="p-float-label flex-grow-1" controlErrorAnchor>
            <p-dropdown
              id="pam_detail_form_app_id"
              class="input-field"
              styleClass="w-20rem text-responsive"
              panelStyleClass="w-20rem"
              formControlName="applicationId"
              [options]="appOptions"
              [autoDisplayFirst]="true"
              [appendTo]="'body'"
              [showClear]="['COPY', 'CREATE'].includes(this.changeMode)"
              [emptyMessage]="'ACTIONS.SEARCH.CRITERIA.NO_APP' | translate"
              [ariaLabel]="'PARAMETER.APP_NAME' | translate"
              [pTooltip]="'PARAMETER.TOOLTIPS.APP_NAME' | translate"
              tooltipPosition="top"
              tooltipEvent="hover"
            >
            </p-dropdown>
            <label class="ocx-required-label" for="pam_detail_form_app_id" aria-hidden="true">
              {{ 'PARAMETER.APP_NAME' | translate }}
            </label>
          </span>
        </div>

        <div class="flex flex-row gap-4">
          <span class="p-float-label flex-grow-1" controlErrorAnchor>
            <input
              pInputText
              type="text"
              id="pam_detail_form_name"
              formControlName="name"
              class="w-full pt-3 pb-2 text-responsive"
              [attr.aria-label]="'PARAMETER.NAME' | translate"
              [pTooltip]="'PARAMETER.TOOLTIPS.NAME' | translate"
              tooltipPosition="top"
              tooltipEvent="hover"
            />
            <label class="ocx-required-label" for="pam_detail_form_name">{{ 'PARAMETER.NAME' | translate }}</label>
          </span>
        </div>

        <div class="flex flex-row gap-4">
          <span class="p-float-label flex-grow-1" controlErrorAnchor>
            <input
              pInputText
              type="text"
              id="pam_detail_form_display_name"
              formControlName="displayName"
              class="w-full pt-3 pb-2 text-responsive"
              [attr.aria-label]="'PARAMETER.DISPLAY_NAME' | translate"
              [pTooltip]="'PARAMETER.TOOLTIPS.DISPLAY_NAME' | translate"
              tooltipPosition="top"
              tooltipEvent="hover"
            />
            <label for="pam_detail_form_display_name">{{ 'PARAMETER.DISPLAY_NAME' | translate }}</label>
          </span>
        </div>

        <div class="flex flex-row gap-4">
          <span class="p-float-label flex-grow-1" controlErrorAnchor>
            <textarea
              pInputTextarea
              id="pam_detail_form_description"
              class="w-full"
              formControlName="description"
              rows="2"
              autoResize="false"
              [ariaLabel]="'PARAMETER.DESCRIPTION' | translate"
              [pTooltip]="'PARAMETER.TOOLTIPS.DESCRIPTION' | translate"
              tooltipPosition="top"
              tooltipEvent="hover"
            >
            </textarea>
            <label for="pam_detail_form_description">{{ 'PARAMETER.DESCRIPTION' | translate }} </label>
          </span>
        </div>
      </div>
    </p-tabPanel>

    <!-- VALUE - changeable -->
    <p-tabPanel
      [header]="'DIALOG.DETAIL.TAB.VALUE' | translate"
      [tooltip]="'DIALOG.DETAIL.TAB.TOOLTIPS.VALUE' | translate"
      tooltipPosition="top"
      tooltipEvent="hover"
      *ngIf="{
        value: valueStatus$ | async,
        valueObject: valueObjectStatus$ | async,
        errors: valueObjectError$ | async
      } as validationStatus"
    >
      <div class="mb-4 flex flex-row flex-wrap justify-content-center align-items-center gap-3">
        <div class="">{{ 'PARAMETER.VALUE.TYPE' | translate }}</div>
        <div class="slim-selectbutton search-criteria-selectbutton">
          <p-selectButton
            #ValueType
            inputid="pam_detail_form_value_type_switch"
            [options]="valueTypeOptions"
            formControlName="valueType"
            [attr.aria-label]="'PARAMETER.TOOLTIPS.VALUE.TYPE.DETAIL' | translate"
            [pTooltip]="'PARAMETER.TOOLTIPS.VALUE.TYPE.DETAIL' | translate"
            tooltipPosition="top"
            tooltipEvent="hover"
          >
            <ng-template let-item pTemplate>{{ item.label | translate }}</ng-template>
          </p-selectButton>
        </div>
      </div>
      <ng-container *ngIf="ValueType.value === 'UNKNOWN'"> {{ 'PARAMETER.VALUE.EMPTY' | translate }} </ng-container>

      <div *ngIf="ValueType.value !== 'UNKNOWN'" class="relative p-fluid">
        <div class="mt-3 mb-4">
          <p-checkbox
            *ngIf="ValueType.value === 'BOOLEAN'"
            type="text"
            [binary]="true"
            id="pam_detail_form_value"
            styleClass="ml-3 cursor-auto shadow-none"
            formControlName="valueBoolean"
            [label]="'PARAMETER.VALUE' | translate"
            [pTooltip]="'PARAMETER.TOOLTIPS.VALUE' | translate"
            tooltipPosition="top"
            tooltipEvent="hover"
          ></p-checkbox>
        </div>

        <span *ngIf="ValueType.value !== 'BOOLEAN'" class="p-float-label">
          <input
            *ngIf="ValueType.value !== 'OBJECT'; else objectTemplate"
            pInputText
            type="text"
            id="pam_detail_form_value"
            class="mb-1 w-full pt-3 pb-2 text-responsive"
            formControlName="value"
            [attr.aria-label]="'PARAMETER.VALUE' | translate"
            [pTooltip]="'PARAMETER.TOOLTIPS.VALUE' | translate"
            tooltipPosition="top"
            tooltipEvent="hover"
          />
          <ng-template #objectTemplate>
            <p-badge
              severity="primary"
              [value]="5000 - ParameterValueObject.value.length"
              class="z-1 text-badge-right"
              [attr.aria-label]="'DIALOG.DETAIL.CHARACTERS' | translate"
              [pTooltip]="'DIALOG.DETAIL.CHARACTERS' | translate"
              tooltipPosition="top"
              tooltipEvent="hover"
            />
            <textarea
              #ParameterValueObject
              pInputTextarea
              id="pam_detail_form_value"
              class="w-full"
              formControlName="valueObject"
              [rows]="5"
              [ariaLabel]="'PARAMETER.VALUE' | translate"
              [pTooltip]="'PARAMETER.TOOLTIPS.VALUE' | translate"
              tooltipPosition="top"
              tooltipEvent="hover"
            >
            </textarea>
            <div class="text-xs">Format: {{ 'VALIDATION.JSON_FORMAT' | translate }}</div>
          </ng-template>
          <label *ngIf="ValueType.value !== 'BOOLEAN'" class="ocx-required-label" for="pam_detail_form_value">
            {{ 'PARAMETER.VALUE' | translate }}
          </label>
        </span>
        <label
          *ngIf="validationStatus.value === 'INVALID' || validationStatus.valueObject === 'INVALID'"
          class="block control-error"
          for="pam_detail_form_value"
        >
          {{ 'VALIDATION.ERRORS.PATTERN_ERROR' | translate }}
          <br />
          {{ formGroup.get('valueObject')?.errors?.['error'] }}
        </label>
      </div>
    </p-tabPanel>

    <!-- IMPORT VALUE - NOT changeable -->
    <p-tabPanel
      *ngIf="!['COPY', 'CREATE'].includes(changeMode)"
      [header]="'DIALOG.DETAIL.TAB.IMPORT_VALUE' | translate"
      [tooltip]="'DIALOG.DETAIL.TAB.TOOLTIPS.IMPORT_VALUE' | translate"
      tooltipPosition="top"
      tooltipEvent="hover"
    >
      <div class="mb-4 flex flex-row flex-wrap justify-content-center align-items-center gap-3">
        <div class="">{{ 'PARAMETER.VALUE.TYPE' | translate }}</div>
        <div class="slim-selectbutton search-criteria-selectbutton">
          <p-selectButton
            #ImportValueType
            inputid="pam_detail_form_import_value_type_switch"
            [options]="valueTypeOptions"
            formControlName="importValueType"
            [attr.aria-label]="'PARAMETER.VALUE.TYPE' | translate"
            [pTooltip]="'PARAMETER.TOOLTIPS.VALUE.TYPE.DETAIL' | translate"
            tooltipPosition="top"
            tooltipEvent="hover"
          >
            <ng-template let-item pTemplate>{{ item.label | translate }}</ng-template>
          </p-selectButton>
        </div>
      </div>
      <ng-container *ngIf="ImportValueType.value === 'UNKNOWN'">
        {{ 'PARAMETER.VALUE.EMPTY' | translate }}
      </ng-container>

      <div *ngIf="ImportValueType.value !== 'UNKNOWN'" class="relative p-fluid">
        <div class="mt-3 mb-4">
          <p-checkbox
            *ngIf="ImportValueType.value === 'BOOLEAN'"
            type="text"
            [binary]="true"
            id="pam_detail_form_import_value"
            styleClass="ml-3 cursor-auto shadow-none"
            formControlName="importValueBoolean"
            [label]="'PARAMETER.IMPORT_VALUE' | translate"
            [pTooltip]="'PARAMETER.TOOLTIPS.IMPORT_VALUE' | translate"
            tooltipPosition="top"
            tooltipEvent="hover"
          ></p-checkbox>
        </div>

        <span *ngIf="ImportValueType.value !== 'BOOLEAN'" class="p-float-label">
          <input
            *ngIf="ImportValueType.value !== 'OBJECT'; else objectTemplate"
            pInputText
            type="text"
            id="pam_detail_form_import_value"
            class="mb-1 w-full pt-3 pb-2 text-responsive"
            formControlName="importValue"
            [attr.aria-label]="'PARAMETER.IMPORT_VALUE' | translate"
            [pTooltip]="'PARAMETER.TOOLTIPS.IMPORT_VALUE' | translate"
            tooltipPosition="top"
            tooltipEvent="hover"
          />
          <ng-template #objectTemplate>
            <p-badge
              severity="primary"
              [value]="5000 - ParameterImportValueObject.value.length"
              class="z-1 text-badge-right"
              [attr.aria-label]="'DIALOG.DETAIL.CHARACTERS' | translate"
              [pTooltip]="'DIALOG.DETAIL.CHARACTERS' | translate"
              tooltipPosition="top"
              tooltipEvent="hover"
            />
            <textarea
              #ParameterImportValueObject
              pInputTextarea
              id="pam_detail_form_import_value"
              class="w-full"
              formControlName="importValue"
              [rows]="5"
              [ariaLabel]="'PARAMETER.IMPORT_VALUE' | translate"
              [pTooltip]="'PARAMETER.TOOLTIPS.IMPORT_VALUE' | translate"
              tooltipPosition="top"
              tooltipEvent="hover"
            >
            </textarea>
          </ng-template>
          <label for="pam_detail_form_import_value">{{ 'PARAMETER.IMPORT_VALUE' | translate }}</label>
        </span>
      </div>
    </p-tabPanel>

    <!-- INTERNALS - in case of an existing item only -->
    <p-tabPanel
      *ngIf="!['COPY', 'CREATE'].includes(changeMode)"
      [header]="'INTERNAL.HEADER' | translate"
      [attr.aria-label]="'INTERNAL.HEADER' | translate"
      [tooltip]="'INTERNAL.TOOLTIP' | translate"
      tooltipPosition="top"
      tooltipEvent="hover"
    >
      <div class="mt-1 flex flex-column row-gap-4">
        <!-- row 1 -->
        <div
          class="ml-2 sm:ml-3 mb-1 flex flex-row flex-wrap justify-content-start align-items-center column-gap-7 row-gap-2"
        >
          <p-checkbox
            inputId="pam_detail_field_operator"
            styleClass="cursor-auto shadow-none"
            [disabled]="true"
            [value]="parameter?.operator"
            [binary]="true"
            [label]="'INTERNAL.OPERATOR' | translate"
            [ariaLabel]="'INTERNAL.OPERATOR' | translate"
            [pTooltip]="'INTERNAL.TOOLTIPS.OPERATOR' | translate"
            tooltipPosition="top"
            tooltipEvent="hover"
          ></p-checkbox>
        </div>

        <!-- row 2 -->
        <div class="flex flex-row flex-wrap gap-4">
          <span class="flex-grow-1 sm:flex-grow-0 p-float-label">
            <input
              pInputText
              type="text"
              id="pam_detail_field_creation_date"
              class="w-full sm:w-15rem pt-3 pb-2 text-responsive"
              [disabled]="true"
              [value]="parameter?.creationDate ? (parameter?.creationDate | date: dateFormat) : ''"
              [attr.aria-label]="'INTERNAL.CREATION_DATE' | translate"
              [pTooltip]="'INTERNAL.TOOLTIPS.CREATION_DATE' | translate"
              tooltipPosition="top"
              tooltipEvent="hover"
            />
            <label for="pam_detail_field_creation_date">{{ 'INTERNAL.CREATION_DATE' | translate }}</label>
          </span>
          <span class="flex-grow-1 p-float-label">
            <input
              pInputText
              type="text"
              id="pam_detail_field_creation_user"
              class="w-full pt-3 pb-2 text-responsive"
              [disabled]="true"
              [value]="parameter?.creationUser"
              [attr.aria-label]="'INTERNAL.CREATION_USER' | translate"
              [pTooltip]="'INTERNAL.TOOLTIPS.CREATION_USER' | translate"
              tooltipPosition="top"
              tooltipEvent="hover"
            />
            <label for="pam_detail_field_creation_user"> {{ 'INTERNAL.CREATION_USER' | translate }} </label>
          </span>
        </div>

        <!-- row 4 -->
        <div class="flex flex-row flex-wrap gap-4">
          <span class="flex-grow-1 sm:flex-grow-0 p-float-label">
            <input
              pInputText
              type="text"
              id="pam_detail_field_modification_date"
              class="w-full sm:w-15rem pt-3 pb-2"
              [disabled]="true"
              [value]="parameter?.modificationDate ? (parameter?.modificationDate | date: dateFormat) : ''"
              [attr.aria-label]="'INTERNAL.MODIFICATION_DATE' | translate"
              [pTooltip]="'INTERNAL.TOOLTIPS.MODIFICATION_DATE' | translate"
              tooltipPosition="top"
              tooltipEvent="hover"
            />
            <label for="pam_detail_field_modification_date"> {{ 'INTERNAL.MODIFICATION_DATE' | translate }} </label>
          </span>
          <span class="flex-grow-1 p-float-label">
            <input
              pInputText
              type="text"
              id="pam_detail_field_modification_user"
              class="w-full pt-3 pb-2 text-responsive"
              [disabled]="true"
              [value]="parameter?.modificationUser"
              [attr.aria-label]="'INTERNAL.MODIFICATION_USER' | translate"
              [pTooltip]="'INTERNAL.TOOLTIPS.MODIFICATION_USER' | translate"
              tooltipPosition="top"
              tooltipEvent="hover"
            />
            <label for="pam_detail_field_modification_user"> {{ 'INTERNAL.MODIFICATION_USER' | translate }} </label>
          </span>
        </div>
      </div>
    </p-tabPanel>
  </p-tabView>

  <ng-template pTemplate="footer">
    <div class="flex flex-wrap justify-content-end gap-2 mb-1">
      <p-button
        *ngIf="exceptionKey || changeMode === 'VIEW'"
        id="pam_detail_action_close"
        icon="pi pi-times"
        (onClick)="onDialogHide()"
        [label]="'ACTIONS.NAVIGATION.CLOSE' | translate"
        [ariaLabel]="'ACTIONS.NAVIGATION.CLOSE' | translate"
        [pTooltip]="'ACTIONS.NAVIGATION.CLOSE.TOOLTIP' | translate"
        tooltipPosition="top"
        tooltipEvent="hover"
      ></p-button>
      <p-button
        *ngIf="!(exceptionKey || changeMode === 'VIEW')"
        id="pam_detail_action_cancel"
        icon="pi pi-times"
        (onClick)="onDialogHide()"
        [label]="'ACTIONS.CANCEL' | translate"
        [ariaLabel]="'ACTIONS.CANCEL' | translate"
        [pTooltip]="'ACTIONS.TOOLTIPS.CANCEL_AND_CLOSE' | translate"
        tooltipPosition="top"
        tooltipEvent="hover"
      ></p-button>
      <p-button
        *ngIf="!(exceptionKey || changeMode === 'VIEW')"
        id="pam_detail_action_save"
        icon="pi pi-save"
        (onClick)="onSave()"
        [disabled]="!formGroup.valid"
        [label]="'ACTIONS.SAVE' | translate"
        [ariaLabel]="'ACTIONS.SAVE' | translate"
        [pTooltip]="'ACTIONS.TOOLTIPS.SAVE' | translate"
        tooltipPosition="top"
        tooltipEvent="hover"
      ></p-button>
    </div>
  </ng-template>
</p-dialog>


```

### File: onecx-parameter-ui/src/app/parameter/parameter-detail/parameter-detail.component.spec.ts

```ts

import { Component, NO_ERRORS_SCHEMA } from '@angular/core'
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { FormsModule } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { of, throwError } from 'rxjs'
import { SelectItem } from 'primeng/api'

import { PortalMessageService, UserService } from '@onecx/angular-integration-interface'

import { Parameter, ParametersAPIService } from 'src/app/shared/generated'
import { ExtendedProduct, ApplicationAbstract } from '../parameter-search/parameter-search.component'
import { ParameterDetailComponent } from './parameter-detail.component'

const parameterBase: Parameter = {
  modificationCount: 0,
  id: 'id',
  productName: 'prod1',
  applicationId: 'app1',
  name: 'name',
  displayName: 'displayName',
  description: 'description'
}

const app1: ApplicationAbstract = { appId: 'app1-svc', appName: 'OneCX app svc 1' }
const app2: ApplicationAbstract = { appId: 'app2-svc', appName: 'OneCX app svc 2' }
const allProducts: ExtendedProduct[] = [
  { name: 'product1', displayName: 'Product 1', applications: [app1, app2] },
  { name: 'product2', displayName: 'Product 2', applications: [app2] }
]
const allProductsSI: SelectItem[] = [
  { label: 'Product 1', value: 'product1' },
  { label: 'Product 2', value: 'product2' }
]
const appOptionsP1: SelectItem[] = [
  { label: app1.appName, value: app1.appId },
  { label: app2.appName, value: app2.appId }
]

describe('ParameterDetailComponent', () => {
  let component: ParameterDetailComponent
  let fixture: ComponentFixture<ParameterDetailComponent>

  const msgServiceSpy = jasmine.createSpyObj<PortalMessageService>('PortalMessageService', ['success', 'error'])
  const apiServiceSpy = {
    getParameterById: jasmine.createSpy('getParameterById').and.returnValue(of({})),
    createParameter: jasmine.createSpy('createParameter').and.returnValue(of({})),
    updateParameter: jasmine.createSpy('updateParameter').and.returnValue(of({}))
  }
  const mockUserService = { lang$: { getValue: jasmine.createSpy('getValue') } }

  function initializeComponent(): void {
    fixture = TestBed.createComponent(ParameterDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ParameterDetailComponent],
      imports: [
        TranslateTestingModule.withTranslations({
          de: require('src/assets/i18n/de.json'),
          en: require('src/assets/i18n/en.json')
        }).withDefaultLanguage('en')
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserService, useValue: mockUserService },
        { provide: PortalMessageService, useValue: msgServiceSpy },
        { provide: ParametersAPIService, useValue: apiServiceSpy }
      ]
    }).compileComponents()
    // reset
    msgServiceSpy.success.calls.reset()
    msgServiceSpy.error.calls.reset()
    // to spy data: reset
    apiServiceSpy.getParameterById.calls.reset()
    apiServiceSpy.createParameter.calls.reset()
    apiServiceSpy.updateParameter.calls.reset()
    // to spy data: refill with neutral data
    apiServiceSpy.getParameterById.and.returnValue(of({}))
    apiServiceSpy.createParameter.and.returnValue(of({}))
    apiServiceSpy.updateParameter.and.returnValue(of({}))
  }))

  beforeEach(() => {
    initializeComponent()
    component.displayDialog = true
    component.allProducts = allProducts
  })

  afterEach(() => {
    component.formGroup.reset()
  })

  describe('construction', () => {
    it('should create', () => {
      expect(component).toBeTruthy()
    })

    it('should not initialize if dialog is not open', () => {
      expect(component).toBeTruthy()
      component.displayDialog = false
      component.ngOnChanges()
    })
  })

  describe('ngOnChange - init form', () => {
    describe('VIEW basics', () => {
      beforeEach(() => {
        component.displayDialog = true
      })

      it('should reject initializing if dialog is not open', () => {
        component.displayDialog = false

        component.ngOnChanges()

        expect(apiServiceSpy.getParameterById).not.toHaveBeenCalled()
      })

      it('should reject initializing if data is missed', () => {
        apiServiceSpy.getParameterById.and.returnValue(of({}))
        component.parameter = undefined
        component.changeMode = 'VIEW'

        component.ngOnChanges()

        expect(apiServiceSpy.getParameterById).not.toHaveBeenCalled()
      })

      it('should prepare viewing a parameter - successful', () => {
        const p: Parameter = { ...parameterBase, value: 'text' }
        apiServiceSpy.getParameterById.and.returnValue(of(p))
        component.parameter = p
        component.changeMode = 'VIEW'

        component.ngOnChanges()

        expect(apiServiceSpy.getParameterById).toHaveBeenCalled()
        expect(component.loading).toBeFalse()
        expect(component.formGroup.disabled).toBeTrue()
        expect(component.formGroup.controls['name'].value).toBe(p.name)
        expect(component.productOptions).toEqual(allProductsSI)
      })

      it('should prepare viewing a parameter - failed: missing id', () => {
        const p: Parameter = { ...parameterBase, id: undefined, value: 'text' }
        apiServiceSpy.getParameterById.and.returnValue(of({}))
        component.parameter = p
        component.changeMode = 'VIEW'

        component.ngOnChanges()

        expect(apiServiceSpy.getParameterById).not.toHaveBeenCalled()
      })

      it('should prepare viewing a parameter - failed', () => {
        const errorResponse = { status: 403, statusText: 'No permissions' }
        apiServiceSpy.getParameterById.and.returnValue(throwError(() => errorResponse))
        component.parameter = parameterBase
        component.changeMode = 'VIEW'
        spyOn(component.formGroup, 'reset')
        spyOn(console, 'error')

        component.ngOnChanges()

        expect(apiServiceSpy.getParameterById).toHaveBeenCalled()
        expect(component.formGroup.reset).toHaveBeenCalled()
        expect(component.formGroup.disabled).toBeTrue()
        expect(component.exceptionKey).toBe('EXCEPTIONS.HTTP_STATUS_' + errorResponse.status + '.PARAMETER')
        expect(msgServiceSpy.error).toHaveBeenCalledWith({ summaryKey: component.exceptionKey })
        expect(console.error).toHaveBeenCalledWith('getParameterById', errorResponse)
      })
    })

    describe('VIEW extras', () => {
      beforeEach(() => {
        component.displayDialog = true
      })

      it('should display string - default', () => {
        const p: Parameter = { ...parameterBase, value: 'text' }
        apiServiceSpy.getParameterById.and.returnValue(of(p))
        component.parameter = p
        component.changeMode = 'VIEW'

        component.ngOnChanges()

        expect(component.formGroup.controls['valueType'].value).toBe('STRING')
        expect(component.formGroup.controls['value'].value).toBe(p.value)
      })

      it('should display boolean', () => {
        const p: Parameter = { ...parameterBase, value: false }
        apiServiceSpy.getParameterById.and.returnValue(of(p))
        component.parameter = p
        component.changeMode = 'VIEW'

        component.ngOnChanges()

        expect(component.formGroup.controls['valueType'].value).toBe('BOOLEAN')
        expect(component.formGroup.controls['valueBoolean'].value).toBe(p.value)
      })

      it('should display number', () => {
        const p: Parameter = { ...parameterBase, value: 123 }
        apiServiceSpy.getParameterById.and.returnValue(of(p))
        component.parameter = p
        component.changeMode = 'VIEW'

        component.ngOnChanges()

        expect(component.formGroup.controls['valueType'].value).toBe('NUMBER')
        expect(component.formGroup.controls['value'].value).toBe(p.value)
      })

      it('should display string', () => {
        const p: Parameter = { ...parameterBase, value: 'text' }
        apiServiceSpy.getParameterById.and.returnValue(of(p))
        component.parameter = p
        component.changeMode = 'VIEW'

        component.ngOnChanges()

        expect(component.formGroup.controls['valueType'].value).toBe('STRING')
        expect(component.formGroup.controls['value'].value).toBe(p.value)
      })

      it('should display object', () => {
        const p: Parameter = { ...parameterBase, value: {} }
        apiServiceSpy.getParameterById.and.returnValue(of(p))
        component.parameter = p
        component.changeMode = 'VIEW'

        component.ngOnChanges()

        expect(component.formGroup.controls['valueType'].value).toBe('OBJECT')
      })
    })

    describe('EDIT', () => {
      it('should prepare editing a parameter - successful', () => {
        const p: Parameter = { ...parameterBase, value: 'text' }
        apiServiceSpy.getParameterById.and.returnValue(of(p))
        component.changeMode = 'EDIT'
        component.parameter = p

        component.ngOnChanges()

        expect(apiServiceSpy.getParameterById).toHaveBeenCalled()
        expect(component.loading).toBeFalse()
        expect(component.formGroup.enabled).toBeTrue()
        expect(component.formGroup.controls['name'].value).toEqual(p.name)
      })

      it('should prepare editing a parameter - failed: id missed', () => {
        const p: Parameter = { ...parameterBase, id: undefined }
        component.changeMode = 'EDIT'
        component.parameter = p

        component.ngOnChanges()

        expect(apiServiceSpy.getParameterById).not.toHaveBeenCalled()
      })

      it('should display error if getting the parameter fails', () => {
        const errorResponse = { status: 404, statusText: 'Not Found' }
        apiServiceSpy.getParameterById.and.returnValue(throwError(() => errorResponse))
        component.changeMode = 'EDIT'
        component.parameter = parameterBase
        spyOn(console, 'error')

        component.ngOnChanges()

        expect(component.exceptionKey).toEqual('EXCEPTIONS.HTTP_STATUS_' + errorResponse.status + '.PARAMETER')
        expect(msgServiceSpy.error).toHaveBeenCalledWith({ summaryKey: component.exceptionKey })
        expect(console.error).toHaveBeenCalledWith('getParameterById', errorResponse)
      })
    })

    describe('CREATE', () => {
      it('should prepare copying a parameter - start with data from other parameter', () => {
        component.changeMode = 'CREATE'
        component.parameter = parameterBase // will be rejected due to filled

        component.ngOnChanges()

        expect(apiServiceSpy.getParameterById).not.toHaveBeenCalled()

        component.parameter = undefined // correct

        component.ngOnChanges()

        expect(component.formGroup.enabled).toBeTrue()
        expect(component.formGroup.controls['name'].value).toEqual(null)
      })

      it('should prepare creating a parameter - start with empty form', () => {
        component.changeMode = 'CREATE'
        spyOn(component.formGroup, 'reset')

        component.ngOnChanges()

        expect(component.formGroup.reset).toHaveBeenCalled()
        expect(component.formGroup.enabled).toBeTrue()
        expect(component.formGroup.controls['name'].value).toBe(null)
      })
    })

    describe('COPY', () => {
      it('should prepare copying a parameter - use data from other parameter', () => {
        const p: Parameter = { ...parameterBase, value: 'text' }
        component.changeMode = 'COPY'
        component.parameter = p

        component.ngOnChanges()

        expect(apiServiceSpy.getParameterById).not.toHaveBeenCalled()
        expect(component.formGroup.enabled).toBeTrue()
        expect(component.formGroup.controls['name'].value).toBe(p.name)
      })
    })
  })

  describe('onSave - CREATE', () => {
    beforeEach(() => {
      component.displayDialog = true
      component.changeMode = 'CREATE'
      component.parameter = { ...parameterBase, id: undefined }
    })

    it('should create a STRING parameter - valid', () => {
      apiServiceSpy.createParameter.and.returnValue(of({}))
      spyOn(component.hideDialogAndChanged, 'emit')

      component.ngOnChanges()
      // manipulate user settings
      component.formGroup.controls['value'].setValue('text')
      component.formGroup.controls['valueType'].setValue('STRING')
      expect(component.formGroup.valid).toBeTrue()
      component.onSave()

      expect(msgServiceSpy.success).toHaveBeenCalledWith({ summaryKey: 'ACTIONS.CREATE.MESSAGE.OK' })
      expect(component.hideDialogAndChanged.emit).toHaveBeenCalledWith(true)
    })

    it('should create a BOOLEAN parameter - valid true', () => {
      apiServiceSpy.createParameter.and.returnValue(of({}))

      component.ngOnChanges()
      // manipulate user settings
      component.formGroup.controls['valueBoolean'].setValue(true)
      component.formGroup.controls['valueType'].setValue('BOOLEAN')
      expect(component.formGroup.valid).toBeTrue()
      component.onSave()

      expect(msgServiceSpy.success).toHaveBeenCalledWith({ summaryKey: 'ACTIONS.CREATE.MESSAGE.OK' })
    })

    it('should create a BOOLEAN parameter - null == false', () => {
      apiServiceSpy.createParameter.and.returnValue(of({}))

      component.ngOnChanges()
      // manipulate user settings
      //component.formGroup.controls['valueBoolean'].setValue()
      component.formGroup.controls['valueType'].setValue('BOOLEAN')
      expect(component.formGroup.valid).toBeTrue()
      component.onSave()

      expect(msgServiceSpy.success).toHaveBeenCalledWith({ summaryKey: 'ACTIONS.CREATE.MESSAGE.OK' })
    })

    it('should create a NUMBER parameter - valid number', () => {
      component.ngOnChanges()
      // manipulate user settings
      component.formGroup.controls['value'].setValue(12345)
      component.formGroup.controls['valueType'].setValue('NUMBER')
      expect(component.formGroup.valid).toBeTrue()
      component.onSave()
    })

    it('should create a NUMBER parameter - invalid number', () => {
      component.ngOnChanges()
      // manipulate user settings
      component.formGroup.controls['valueType'].setValue('NUMBER')
      component.formGroup.controls['value'].setValue({})
      expect(component.formGroup.valid).toBeFalse()
      component.onSave()
    })

    it('should create a OBJECT parameter - valid object', () => {
      apiServiceSpy.createParameter.and.returnValue(of({}))

      component.ngOnChanges()
      // manipulate user settings
      const obj = JSON.stringify({})
      component.formGroup.controls['valueObject'].setValue(obj)
      component.formGroup.controls['valueType'].setValue('OBJECT')
      expect(component.formGroup.valid).toBeTrue()
      component.onSave()

      expect(msgServiceSpy.success).toHaveBeenCalledWith({ summaryKey: 'ACTIONS.CREATE.MESSAGE.OK' })
    })

    it('should display error if creation fails', () => {
      const errorResponse = { status: 400, statusText: 'Could not create ...' }
      apiServiceSpy.createParameter.and.returnValue(throwError(() => errorResponse))
      spyOn(console, 'error')

      component.ngOnChanges()
      // manipulate user settings
      component.formGroup.controls['value'].setValue('text')
      component.formGroup.controls['valueType'].setValue('STRING')
      expect(component.formGroup.valid).toBeTrue()
      component.onSave()

      expect(msgServiceSpy.error).toHaveBeenCalledWith({ summaryKey: 'ACTIONS.CREATE.MESSAGE.NOK' })
      expect(console.error).toHaveBeenCalledWith('createParameter', errorResponse)
    })
  })

  describe('onSave - COPY', () => {
    it('should create a parameter based on another', () => {
      const p: Parameter = { ...parameterBase, value: 'text' }
      apiServiceSpy.createParameter.and.returnValue(of({}))
      component.changeMode = 'COPY'
      component.parameter = p
      spyOn(component.hideDialogAndChanged, 'emit')

      component.ngOnChanges()
      expect(component.formGroup.valid).toBeTrue()
      component.onSave()

      expect(msgServiceSpy.success).toHaveBeenCalledWith({ summaryKey: 'ACTIONS.CREATE.MESSAGE.OK' })
      expect(component.hideDialogAndChanged.emit).toHaveBeenCalledWith(true)
    })
  })

  describe('onSave - EDIT', () => {
    beforeEach(() => {
      const p: Parameter = { ...parameterBase, value: 'text' }
      apiServiceSpy.getParameterById.and.returnValue(of(p))
      component.changeMode = 'EDIT'
      component.parameter = p

      component.ngOnChanges()

      expect(component.formGroup.valid).toBeTrue()
    })

    it('should update a parameter - successful', () => {
      apiServiceSpy.updateParameter.and.returnValue(of({}))
      spyOn(component.hideDialogAndChanged, 'emit')

      component.onSave()

      expect(msgServiceSpy.success).toHaveBeenCalledWith({ summaryKey: 'ACTIONS.EDIT.MESSAGE.OK' })
      expect(component.hideDialogAndChanged.emit).toHaveBeenCalledWith(true)
    })

    it('should display error if update fails', () => {
      const errorResponse = { status: 400, statusText: 'Could not update ...' }
      apiServiceSpy.updateParameter.and.returnValue(throwError(() => errorResponse))
      spyOn(console, 'error')

      component.onSave()

      expect(msgServiceSpy.error).toHaveBeenCalledWith({ summaryKey: 'ACTIONS.EDIT.MESSAGE.NOK' })
      expect(console.error).toHaveBeenCalledWith('updateParameter', errorResponse)
    })

    it('should display error if update fails due to unique constraint violation', () => {
      const errorResponse = {
        status: 400,
        statusText: 'Could not update ...',
        error: { errorCode: 'PERSIST_ENTITY_FAILED' }
      }
      apiServiceSpy.updateParameter.and.returnValue(throwError(() => errorResponse))
      spyOn(console, 'error')

      component.onSave()

      expect(msgServiceSpy.error).toHaveBeenCalledWith({
        summaryKey: 'ACTIONS.EDIT.MESSAGE.NOK',
        detailKey: 'VALIDATION.ERRORS.PERSIST_ENTITY_FAILED'
      })
      expect(console.error).toHaveBeenCalledWith('updateParameter', errorResponse)
    })

    it('should display error if update fails due to unique constraint violation', () => {
      apiServiceSpy.getParameterById.and.returnValue(of(parameterBase))
      const errorResponse = {
        status: 400,
        statusText: 'Could not update ...',
        error: { errorCode: 'ANY_OTHER_ERROR_KEY' }
      }
      apiServiceSpy.updateParameter.and.returnValue(throwError(() => errorResponse))
      spyOn(console, 'error')

      component.onSave()

      expect(msgServiceSpy.error).toHaveBeenCalledWith({
        summaryKey: 'ACTIONS.EDIT.MESSAGE.NOK',
        detailKey: errorResponse.error.errorCode
      })
      expect(console.error).toHaveBeenCalledWith('updateParameter', errorResponse)
    })
  })

  describe('Extra logging', () => {
    beforeEach(() => {
      component.displayDialog = true
      const p: Parameter = { ...parameterBase, id: undefined, value: 'text' }
      component.parameter = p
    })

    it('should NOT log if form is not valide', () => {
      component.logErrors = false
      component.changeMode = 'CREATE'

      component.ngOnChanges()
      // manipulate user settings
      const obj = { hallo: 'test' }
      component.formGroup.controls['valueObject'].setValue(obj)
      component.formGroup.controls['valueType'].setValue('OBJECT')
      component.onSave()
    })

    it('should log if form is not valide', () => {
      component.logErrors = true
      component.changeMode = 'CREATE'
      spyOn(console, 'error')

      component.ngOnChanges()
      // manipulate user settings
      const obj = { hallo: 'test' }
      component.formGroup.controls['valueObject'].setValue(obj)
      component.formGroup.controls['valueType'].setValue('OBJECT')
      component.onSave()

      expect(console.error).toHaveBeenCalledWith('form error: ', 'valueObject', 'pattern')
    })
  })

  /*
   * UI ACTIONS
   */
  describe('Extra UI actions', () => {
    describe('Closing dialog', () => {
      it('should close the dialog if user triggers hiding', () => {
        spyOn(component.hideDialogAndChanged, 'emit')
        component.onDialogHide()

        expect(component.hideDialogAndChanged.emit).toHaveBeenCalledWith(false)
      })
    })

    describe('onChangeProductName', () => {
      it('should reject update appOptions if no product name is provided', () => {
        component.onChangeProductName(undefined)

        expect(component.appOptions).toEqual([])
      })

      it('should update appOptions based on the product name', () => {
        component.allProducts = allProducts
        component.onChangeProductName(allProducts[0].name)

        expect(component.appOptions).toEqual(appOptionsP1)
        expect(component.formGroup.controls['applicationId'].value).toBeNull()
      })

      it('should clear appOptions if productName does not match', () => {
        component.allProducts = allProducts
        component.onChangeProductName('unknown')

        expect(component.appOptions).toEqual([])
        expect(component.formGroup.controls['applicationId'].value).toBeNull()
      })
    })
  })

  // Reason: This waits for a solution
  xdescribe('Value trimming', () => {
    beforeEach(() => {
      const p: Parameter = { ...parameterBase, value: 'text' }
      apiServiceSpy.getParameterById.and.returnValue(of(p))
      component.changeMode = 'EDIT'
      component.parameter = p

      component.ngOnChanges()

      expect(component.formGroup.valid).toBeTrue()
    })

    it('should trim the value on model change: value is of type string', fakeAsync(() => {
      const inputElement = fixture.debugElement.query(By.css('input#pam_detail_form_value'))
      inputElement.nativeElement.dispatchEvent(new Event('input'))
      inputElement.nativeElement.value = '  test  '
      fixture.detectChanges()
      tick(300)

      expect(component.formGroup?.get('value')?.value).toBe('test')
    }))
  })
})

/* Test modification of built-in Angular class registerOnChange at top of the file  */
@Component({
  template: `<input type="text" [(ngModel)]="value" />`
})
class TestComponent {
  value: any = ''
}
describe('DefaultValueAccessor prototype modification', () => {
  let component: TestComponent
  let fixture: ComponentFixture<TestComponent>
  let inputElement: HTMLInputElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [FormsModule]
    }).compileComponents()

    fixture = TestBed.createComponent(TestComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    inputElement = fixture.nativeElement.querySelector('input')
  })

  it('should trim the value on model change: value is of type string', () => {
    inputElement.value = '  test  '
    inputElement.dispatchEvent(new Event('input'))
    fixture.detectChanges()

    expect(component.value).toBe('test')
  })
})


```

### File: onecx-parameter-ui/src/app/parameter/parameter-detail/parameter-detail.component.ts

```ts

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core'
import {
  AbstractControl,
  DefaultValueAccessor,
  FormControl,
  FormGroup,
  FormControlStatus,
  Validators,
  ValidatorFn
} from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { finalize, map, Observable, of } from 'rxjs'
import { SelectItem } from 'primeng/api'

import { PortalMessageService } from '@onecx/angular-integration-interface'

import { Parameter, ParametersAPIService, ParameterCreate, ParameterUpdate } from 'src/app/shared/generated'
import { dropDownSortItemsByLabel } from 'src/app/shared/utils'
import { ChangeMode, ExtendedProduct } from '../parameter-search/parameter-search.component'

type ErrorMessageType = { summaryKey: string; detailKey?: string }

// trim the value (string!) of a form control before passes to the control
const original = DefaultValueAccessor.prototype.registerOnChange
DefaultValueAccessor.prototype.registerOnChange = function (fn) {
  return original.call(this, (value) => {
    const trimmed = value.trim()
    return fn(trimmed)
  })
}

// used only to kick the value field validation
export function TypeValidator(): ValidatorFn {
  return (control: AbstractControl): any => {
    let isValid = false // sonar hack ;-)
    let valueControl: AbstractControl | null
    if (control.parent && control.value) {
      // disable unused fields to prevent validation
      if (['BOOLEAN'].includes(control.value)) {
        valueControl = control.parent.get('valueObject')
        valueControl?.disable()
        valueControl = control.parent.get('value')
        valueControl?.disable()
      }
      if (['NUMBER', 'STRING'].includes(control.value)) {
        valueControl = control.parent.get('valueObject')
        valueControl?.disable()
        valueControl = control.parent.get('value')
        valueControl?.enable()
        valueControl?.updateValueAndValidity()
      }
      if (['OBJECT'].includes(control.value)) {
        valueControl = control.parent.get('valueObject')
        valueControl?.enable()
        valueControl?.updateValueAndValidity() // force value & form validation
        valueControl = control.parent.get('value')
        valueControl?.disable()
      }
      isValid = true
    }
    return isValid
  }
}

// used to validate the value against type NUMBER
export function ValueValidator(): ValidatorFn {
  return (control: AbstractControl): any => {
    if (!control.parent || !control.value) return null

    // get the selected parameter type from form
    const typeControl = control.parent.get('valueType')
    if (!typeControl?.value) return null

    let isValid = true
    if (['NUMBER', 'STRING'].includes(typeControl.value)) {
      const val = control.value as any
      if (val !== undefined && val !== null && ['NUMBER'].includes(typeControl.value)) {
        const flo: any = val * Math.PI // calculate a float number
        isValid = !Number.isNaN(parseFloat(flo))
      }
    }
    return isValid ? null : { pattern: true }
  }
}

export function JsonValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) return null
    let isValid = true
    let ex: any // sonar
    const value = control.value as string
    if (value && value !== '' && value !== '{}')
      try {
        // control.value is a JavaScript object but in JSON syntax!
        JSON.parse(value) // is JSON?
      } catch (e: any) {
        ex = e.toString() // get first line with message, exclude stacktrace
        isValid = false
      }
    return isValid ? null : { pattern: true, error: ex }
  }
}

@Component({
  selector: 'app-parameter-detail',
  templateUrl: './parameter-detail.component.html',
  styleUrls: ['./parameter-detail.component.scss']
})
export class ParameterDetailComponent implements OnChanges {
  @Input() public displayDialog = false
  @Input() public changeMode: ChangeMode = 'CREATE'
  @Input() public parameter: Parameter | undefined
  @Input() public allProducts: ExtendedProduct[] = []
  @Input() public dateFormat = 'medium'
  @Output() public hideDialogAndChanged = new EventEmitter<boolean>()

  // dialog
  public loading = false
  public exceptionKey: string | undefined = undefined
  public logErrors = false
  // form
  public formGroup: FormGroup
  public valueStatus$: Observable<FormControlStatus> = of()
  public valueObjectStatus$: Observable<FormControlStatus> = of()
  public valueObjectError$: Observable<any> = of()
  // value lists
  public productOptions: SelectItem[] = []
  public appOptions: SelectItem[] = []
  public valueTypeOptions: SelectItem[] = [
    { label: 'VALUE_TYPE.BOOLEAN', value: 'BOOLEAN' },
    { label: 'VALUE_TYPE.NUMBER', value: 'NUMBER' },
    { label: 'VALUE_TYPE.STRING', value: 'STRING' },
    { label: 'VALUE_TYPE.OBJECT', value: 'OBJECT' }
  ]

  constructor(
    private readonly parameterApi: ParametersAPIService,
    private readonly translate: TranslateService,
    private readonly msgService: PortalMessageService
  ) {
    this.formGroup = new FormGroup({})
    this.formGroup.controls = {
      modificationCount: new FormControl(0),
      productName: new FormControl(null, [Validators.required]),
      applicationId: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(255)]),
      displayName: new FormControl(null, [Validators.maxLength(255)]),
      description: new FormControl(null, [Validators.maxLength(255)]),
      importValue: new FormControl(null),
      importValueType: new FormControl(null),
      importValueBoolean: new FormControl(false),
      valueBoolean: new FormControl(false)
    }
    // add extra validators with specific update event - do it separately!
    // default update strategy is 'changes' => updateOn: 'change'
    this.formGroup.addControl(
      'value',
      new FormControl(null, {
        validators: Validators.compose([ValueValidator(), Validators.required, Validators.maxLength(5000)])
      })
    )
    this.formGroup.addControl(
      'valueObject',
      new FormControl(null, {
        validators: Validators.compose([JsonValidator(), Validators.required, Validators.maxLength(5000)])
      })
    )
    this.formGroup.addControl(
      'valueType',
      new FormControl(this.valueTypeOptions[2], { validators: Validators.compose([TypeValidator()]) })
    )
    // be informed about invalid content in value fields
    const vField = this.formGroup.get('value')
    if (vField) this.valueStatus$ = vField.statusChanges.pipe(map((s) => s))
    const voField = this.formGroup.get('valueObject')
    if (voField) this.valueObjectStatus$ = voField.statusChanges.pipe(map((s) => s))
  }

  public ngOnChanges() {
    if (!this.displayDialog) return
    this.exceptionKey = undefined
    // matching mode and given data?
    if ('CREATE' === this.changeMode && this.parameter?.id) return
    if (['EDIT', 'VIEW'].includes(this.changeMode)) {
      if (!this.parameter?.id) return
      else this.getData(this.parameter.id)
    } else this.prepareForm(this.parameter) // CREATE, COPY
    // update dropdown lists
    this.productOptions = this.allProducts.map((p) => ({ label: p.displayName, value: p.name }))
  }

  private prepareForm(data?: Parameter): void {
    this.formGroup.reset()
    if (data) {
      this.onChangeProductName(data?.productName)
      this.formGroup.patchValue(data) // fill what exist
      // clear value field if special type
      if (['boolean', 'object'].includes(typeof data.value)) this.formGroup.controls['value'].setValue(null)
      // manage specifics for value fields
      this.manageValueFormFields(data.value, 'valueType', 'valueBoolean', 'valueObject')
      this.manageValueFormFields(data.importValue, 'importValueType', 'importValueBoolean', 'importValue')
    }
    switch (this.changeMode) {
      case 'COPY':
        this.formGroup.enable()
        break
      case 'CREATE':
        this.formGroup.enable()
        this.formGroup.controls['valueType'].patchValue(this.valueTypeOptions[2].value)
        break
      case 'EDIT':
        this.formGroup.enable()
        // exclude fields from change and validation
        this.formGroup.controls['productName'].disable()
        this.formGroup.controls['applicationId'].disable()
        this.formGroup.controls['name'].disable()
        this.formGroup.controls['importValue'].disable()
        this.formGroup.controls['importValueType'].disable()
        this.formGroup.controls['importValueBoolean'].disable()
        break
      case 'VIEW':
        this.formGroup.disable()
        break
    }
  }

  // find out value type and fill special form fields
  private manageValueFormFields(val: any, typeField: string, booleanField: string, objectField: string): void {
    const type = val !== undefined && val !== null ? typeof val : 'unknown'
    this.formGroup.controls[typeField].setValue(type.toUpperCase())
    if (type === 'boolean') this.formGroup.controls[booleanField].setValue(val)
    if (type === 'object' && val) {
      this.formGroup.controls[objectField].setValue(JSON.stringify(val, undefined, 2))
    }
  }

  /**
   * GET data from service
   */
  private getData(id: string): void {
    this.loading = true
    this.exceptionKey = undefined
    this.parameterApi
      .getParameterById({ id: id })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          this.parameter = data
          this.prepareForm(data)
        },
        error: (err) => {
          this.formGroup.reset()
          this.formGroup.disable()
          this.exceptionKey = 'EXCEPTIONS.HTTP_STATUS_' + err.status + '.PARAMETER'
          this.msgService.error({ summaryKey: this.exceptionKey })
          console.error('getParameterById', err)
        }
      })
  }

  /****************************************************************************
   *  UI Events
   */
  public onDialogHide(changed?: boolean) {
    this.hideDialogAndChanged.emit(changed ?? false)
    this.formGroup.reset()
  }

  // load appId dropdown with app ids from product
  public onChangeProductName(name: string | undefined) {
    this.appOptions = []
    this.formGroup.controls['applicationId'].setValue(null)
    if (!name) return
    this.allProducts
      .filter((p) => p.name === name)
      .forEach((p) => {
        p.applications?.forEach((app) => {
          this.appOptions.push({ label: app.appName, value: app.appId })
        })
      })
    this.appOptions.sort(dropDownSortItemsByLabel)
  }

  /**
   * SAVING => create or update
   */
  public onSave(): void {
    if (this.formGroup.valid) {
      // prepare parameter value from special form fields
      if (this.changeMode === 'EDIT' && this.parameter?.id) {
        const param: ParameterUpdate = {
          modificationCount: this.parameter.modificationCount,
          displayName: this.formGroup.controls['displayName'].value,
          description: this.formGroup.controls['description'].value,
          value: this.getValue(['valueType', 'value', 'valueBoolean', 'valueObject'])
        }
        this.parameterApi.updateParameter({ id: this.parameter?.id, parameterUpdate: param }).subscribe({
          next: () => {
            this.msgService.success({ summaryKey: 'ACTIONS.EDIT.MESSAGE.OK' })
            this.onDialogHide(true)
          },
          error: (err) => {
            this.createErrorMessage(err)
            console.error('updateParameter', err)
          }
        })
      }
      if (['COPY', 'CREATE'].includes(this.changeMode)) {
        const param: ParameterCreate = {
          name: this.formGroup.controls['name'].value,
          displayName: this.formGroup.controls['displayName'].value,
          description: this.formGroup.controls['description'].value,
          productName: this.formGroup.controls['productName'].value,
          applicationId: this.formGroup.controls['applicationId'].value,
          value: this.getValue(['valueType', 'value', 'valueBoolean', 'valueObject'])
        }
        this.parameterApi.createParameter({ parameterCreate: param }).subscribe({
          next: () => {
            this.msgService.success({ summaryKey: 'ACTIONS.CREATE.MESSAGE.OK' })
            this.onDialogHide(true)
          },
          error: (err) => {
            this.createErrorMessage(err)
            console.error('createParameter', err)
          }
        })
      }
    } else this.logFormErrors()
  }

  private getValue(field: string[]): any {
    let val: any
    switch (this.formGroup.controls[field[0]].value) {
      case 'BOOLEAN':
        val = this.formGroup.controls[field[2]].value
        if (!val) val = false
        break
      case 'OBJECT':
        val = JSON.parse(this.formGroup.controls[field[3]].value)
        break
      case 'NUMBER':
        val = this.formGroup.controls[field[1]].value * 1
        break
      default:
        val = this.formGroup.controls[field[1]].value + ''
    }
    return val
  }

  private createErrorMessage(err: any) {
    let errMsg: ErrorMessageType = { summaryKey: 'ACTIONS.' + this.changeMode + '.MESSAGE.NOK' }
    if (err?.error?.errorCode)
      errMsg = {
        ...errMsg,
        detailKey:
          err?.error?.errorCode === 'PERSIST_ENTITY_FAILED'
            ? 'VALIDATION.ERRORS.PERSIST_ENTITY_FAILED'
            : err.error.errorCode
      }
    this.msgService.error(errMsg)
  }

  private logFormErrors(): void {
    if (!this.logErrors) return
    Object.keys(this.formGroup.controls).forEach((key) => {
      const ctrlItem = this.formGroup.get(key)
      if (ctrlItem?.errors) {
        Object.keys(ctrlItem.errors).forEach((error) => {
          console.error('form error: ', key, error)
          ctrlItem.markAsTouched()
        })
      }
    })
  }
}


```

//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

## Folder: onecx-parameter-ui/src/app/parameter/parameter-search (3 files)

### File: onecx-parameter-ui/src/app/parameter/parameter-search/parameter-search.component.html

```html

<ocx-portal-page permission="PARAMETER#SEARCH" helpArticleId="PAGE_PARAMETER_SEARCH">
  <!-- slot getting data from product store -->
  <ocx-slot
    *ngIf="isComponentDefined$ | async"
    [name]="slotName"
    [inputs]="{ dataType: 'products', logEnabled: false, logPrefix: 'parameter' }"
    [outputs]="{ products: slotEmitter }"
  >
  </ocx-slot>

  <ng-container *ngIf="metaData$ | async as metaData">
    <app-parameter-criteria
      type="SEARCH"
      [actions]="actions"
      [usedProducts]="metaData.usedProducts"
      (searchEmitter)="onSearch($event)"
      (resetSearchEmitter)="onCriteriaReset()"
    ></app-parameter-criteria>

    <ocx-page-content>
      <p-message
        *ngIf="exceptionKey || exceptionKeyMeta"
        id="pam_search_message_error"
        severity="error"
        styleClass="m-3"
        [text]="exceptionKey ? (exceptionKey | translate) : (exceptionKeyMeta ?? '' | translate)"
      ></p-message>

      <ng-container *ngIf="data$ | async as data">
        <p-message
          *ngIf="loading"
          id="pam_search_message_loading"
          severity="info"
          styleClass="m-3"
          [text]="'ACTIONS.LOADING' | translate"
        ></p-message>
        <p-table
          *ngIf="!(loading || exceptionKey)"
          #dataTable
          id="pam_search_table"
          styleClass="mx-3 mb-2"
          [value]="data"
          dataKey="id"
          [columns]="filteredColumns"
          [globalFilterFields]="['productName', 'applicationId', 'name', 'displayName']"
          [reorderableColumns]="false"
          [scrollable]="true"
          scrollHeight="590px"
          [rows]="30"
          [rowsPerPageOptions]="[30, 100]"
          [paginator]="true"
          [alwaysShowPaginator]="true"
          paginatorPosition="bottom"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="{first} - {last} {{ 'ACTIONS.SEARCH.OF' | translate }} {totalRecords}"
        >
          <ng-template pTemplate="caption">
            <ocx-data-view-controls
              [supportedViews]="['table']"
              [enableFiltering]="true"
              [enableSorting]="false"
              [columnDefinitions]="columns"
              (columnsChange)="onColumnsChange($event)"
              (filterChange)="onFilterChange($event)"
              [translations]="(dataViewControlsTranslations$ | async) ?? {}"
            ></ocx-data-view-controls>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td id="pam_search_table_emptymessage" colspan="16">{{ 'ACTIONS.SEARCH.NO_DATA' | translate }}</td>
            </tr>
          </ng-template>

          <ng-template pTemplate="header" let-columns>
            <tr>
              <th pFrozenColumn id="pam_search_table_header_actions" class="text-center">
                {{ 'ACTIONS.LABEL' | translate }}
              </th>
              <th
                *ngFor="let col of columns"
                [id]="'pam_search_table_header_col_' + col.field"
                class="white-space-nowrap"
                [class]="col.css"
                [ngClass]="{ 'border-right-1': col.frozen }"
                pFrozenColumn
                [frozen]="col.frozen"
                [pSortableColumn]="col.field"
                [attr.aria-label]="col.translationPrefix + '.' + col.header | translate"
                [pTooltip]="col.translationPrefix + '.TOOLTIPS.' + col.header | translate"
                tooltipPosition="top"
                tooltipEvent="hover"
              >
                <span>{{ col.translationPrefix + '.' + col.header | translate }}</span>
                <p-sortIcon *ngIf="col.sort" [field]="col.field"></p-sortIcon>
                <p-columnFilter *ngIf="col.hasFilter" type="text" [field]="col.field" display="menu"></p-columnFilter>
              </th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-i="rowIndex" let-rowData let-columns="columns">
            <tr [pSelectableRow]="data">
              <!-- actions -->
              <td pFrozenColumn>
                <!-- use the following as container to wrap button within the row height -->
                <div class="flex flex-row flex-wrap sm:flex-nowrap justify-content-center align-items-center">
                  <div class="white-space-nowrap">
                    <ng-container *ocxIfNotPermission="'PARAMETER#EDIT'">
                      <p-button
                        *ocxIfPermission="'PARAMETER#VIEW'"
                        [id]="'pam_search_table_row_' + i + '_action_view'"
                        type="button"
                        pRipple
                        [text]="true"
                        [plain]="true"
                        [rounded]="true"
                        [icon]="'pi pi-eye'"
                        (click)="onDetail('VIEW', rowData, $event)"
                        [attr.aria-label]="'ACTIONS.VIEW.LABEL' | translate"
                        [pTooltip]="'ACTIONS.VIEW.LABEL' | translate"
                        tooltipPosition="top"
                        tooltipEvent="hover"
                      />
                    </ng-container>
                    <p-button
                      *ocxIfPermission="'PARAMETER#EDIT'"
                      [id]="'pam_search_table_row_' + i + '_action_edit'"
                      type="button"
                      pRipple
                      [text]="true"
                      [plain]="true"
                      [rounded]="true"
                      [icon]="'pi pi-pencil'"
                      (click)="onDetail('EDIT', rowData, $event)"
                      [attr.aria-label]="'ACTIONS.EDIT.LABEL' | translate"
                      [pTooltip]="'ACTIONS.EDIT.LABEL' | translate"
                      tooltipPosition="top"
                      tooltipEvent="hover"
                    />
                    <p-button
                      *ocxIfPermission="'PARAMETER#EDIT'"
                      [id]="'pam_search_table_row_' + i + '_action_copy'"
                      type="button"
                      pRipple
                      [text]="true"
                      [plain]="true"
                      [rounded]="true"
                      [icon]="'pi pi-copy'"
                      (click)="onDetail('COPY', rowData, $event)"
                      [attr.aria-label]="'ACTIONS.COPY.LABEL' | translate"
                      [pTooltip]="'ACTIONS.COPY.LABEL' | translate"
                      tooltipPosition="top"
                      tooltipEvent="hover"
                    />
                  </div>
                  <div class="white-space-nowrap">
                    <p-button
                      *ocxIfPermission="'USAGE#VIEW'"
                      [id]="'pam_search_table_row_' + i + '_action_usage'"
                      type="button"
                      pRipple
                      [text]="true"
                      [plain]="true"
                      [rounded]="true"
                      [icon]="'pi pi-history'"
                      (click)="onDetailUsage($event, rowData)"
                      [disabled]="!rowData['isInHistory']"
                      [attr.aria-label]="'DIALOG.NAVIGATION.DETAIL_USAGE.LABEL' | translate"
                      [pTooltip]="'DIALOG.NAVIGATION.DETAIL_USAGE.LABEL' | translate"
                      tooltipPosition="top"
                      tooltipEvent="hover"
                    />
                    <p-button
                      *ocxIfPermission="'PARAMETER#DELETE'"
                      [id]="'pam_search_table_row_' + i + '_action_delete'"
                      type="button"
                      pRipple
                      [text]="true"
                      [plain]="true"
                      [rounded]="true"
                      severity="danger"
                      [icon]="'pi pi-trash'"
                      (click)="onDelete($event, rowData)"
                      [attr.aria-label]="'ACTIONS.DELETE.LABEL' | translate"
                      [pTooltip]="'ACTIONS.DELETE.LABEL' | translate"
                      tooltipPosition="top"
                      tooltipEvent="hover"
                    />
                  </div>
                </div>
              </td>
              <td
                *ngFor="let col of columns"
                [id]="'pam_search_table_row_' + i + '_' + col.field"
                [class]="col.css"
                [ngClass]="{ 'border-right-1': col.frozen }"
                pFrozenColumn
                [frozen]="col.frozen"
              >
                @let value = rowData['value'] ?? rowData['importValue'];
                <!-- needs a div due to manage ellipsis -->
                <div
                  *ngIf="col.field === 'name'"
                  class="text-ellipsis-2-lines max-w-15rem word-break-all"
                  [ngStyle]="{
                    'min-width': rowData['displayName'].length > 15 ? '8rem' : ''
                  }"
                >
                  {{ rowData['displayName'] }}
                </div>

                @let isUnknown = [rowData['valueType'], rowData['importValueType']].includes('UNKNOWN');
                <div
                  *ngIf="col.field === 'valueType'"
                  [pTooltip]="isUnknown ? ('VALUE_TYPE.UNKNOWN.TOOLTIP' | translate) : ''"
                  tooltipPosition="top"
                  tooltipEvent="hover"
                >
                  {{ 'VALUE_TYPE.' + rowData['valueType'] | translate }}
                  <ng-container *ngIf="rowData['valueType'] !== rowData['importValueType']">
                    | {{ 'VALUE_TYPE.' + rowData['importValueType'] | translate }}
                  </ng-container>
                </div>

                <div
                  *ngIf="col.field === 'equal'"
                  [ngClass]="
                    rowData['isEqual'] === 'TRUE'
                      ? 'pi pi-check text-green-600'
                      : rowData['isEqual'] === 'FALSE'
                        ? 'pi pi-times text-red-600'
                        : ''
                  "
                  [attr.aria-label]="'PARAMETER.TOOLTIPS.EQUAL.' + rowData['isEqual'] | translate"
                  [pTooltip]="'PARAMETER.TOOLTIPS.EQUAL.' + rowData['isEqual'] | translate"
                  tooltipPosition="top"
                  tooltipEvent="hover"
                >
                  {{ rowData['isEqual'] === 'UNDEFINED' ? 'n.a.' : '' }}
                </div>

                <div
                  *ngIf="col.field === 'value'"
                  class="text-ellipsis-2-lines max-w-20rem word-break-all"
                  [ngStyle]="{ 'min-width': (value ?? '').length > 15 ? '10rem' : '' }"
                >
                  {{ rowData['displayValue'] }}
                </div>

                <div *ngIf="col.field === 'applicationId'" class="flex flex-column gap-0">
                  <div class="max-w-20rem text-responsive">
                    {{ getProductDisplayName(rowData['productName'], metaData.allProducts) }}
                  </div>
                  <div class="max-w-20rem text-responsive">
                    {{ getAppDisplayName(rowData['productName'], rowData['applicationId'], metaData.allProducts) }}
                  </div>
                </div>

                <ng-container *ngIf="col.isBoolean">
                  <span *ngIf="rowData[col.field] === true" class="pi pi-check text-green-600"></span>
                </ng-container>
                <ng-container *ngIf="col.isDate"> {{ rowData[col.field] | date: dateFormat }} </ng-container>
              </td>
            </tr>
          </ng-template>
        </p-table>

        <!-- DELETE -->
        <p-dialog
          [header]="'DIALOG.DETAIL.DELETE.HEADER' | translate"
          [(visible)]="displayDeleteDialog"
          [modal]="true"
          [closable]="true"
          [draggable]="true"
          [resizable]="false"
          [dismissableMask]="true"
          [style]="{ width: '450px' }"
        >
          <div *ngIf="item4Delete" class="flex column-gap-3 justify-content-start align-items-center">
            <div class="pi pi-question-circle text-3xl danger-action-text" aria-hidden="true"></div>
            <section class="w-11 flex flex-column row-gap-3 justify-content-start">
              <div
                id="pam_delete_message_text"
                class="mr-3 font-bold"
                [attr.aria-label]="'ACTIONS.CONFIRMATION.QUESTION' | translate"
                role="note"
              >
                {{ 'ACTIONS.DELETE.MESSAGE.TEXT' | translate }}
              </div>
              <div
                id="pam_delete_parameter_name"
                class="px-5 text-center danger-action-text text-responsive"
                [attr.aria-label]="'PARAMETER.NAME' | translate"
                role="note"
              >
                {{ item4Delete.displayName ?? item4Delete.name }}
              </div>

              <div class="px-2 flex flex-column row-gap-1">
                <div class="flex flex-row column-gap-2">
                  <div class="w-4 text-right font-bold">{{ 'PARAMETER.PRODUCT_NAME' | translate }}:</div>
                  <div class="w-7 text-left text-responsive" id="pam_delete_product_name">
                    {{ getProductDisplayName(item4Delete.productName, metaData.allProducts) }}
                  </div>
                </div>
                <div class="flex flex-row column-gap-2">
                  <div class="w-4 text-right font-bold">{{ 'PARAMETER.APP_ID' | translate }}:</div>
                  <div class="w-7 text-left text-responsive" id="pam_delete_app_id">
                    {{ getAppDisplayName(item4Delete.productName, item4Delete.applicationId, metaData.allProducts) }}
                  </div>
                </div>
              </div>

              <div>{{ 'ACTIONS.DELETE.MESSAGE.INFO' | translate }}</div>
            </section>
          </div>
          <ng-template pTemplate="footer">
            <footer class="flex flex-wrap justify-content-end column-gap-2 row-gap-1">
              <p-button
                id="pam_delete_action_no"
                icon="pi pi-times"
                pAutoFocus
                [autofocus]="true"
                (onClick)="displayDeleteDialog = false"
                [label]="'ACTIONS.CONFIRMATION.NO' | translate"
                [ariaLabel]="'ACTIONS.CONFIRMATION.NO.TOOLTIP' | translate"
                [pTooltip]="'ACTIONS.CONFIRMATION.NO.TOOLTIP' | translate"
                tooltipPosition="top"
                tooltipEvent="hover"
              ></p-button>
              <p-button
                id="pam_delete_action_yes"
                icon="pi pi-check"
                (onClick)="onDeleteConfirmation(data)"
                [label]="'ACTIONS.CONFIRMATION.YES' | translate"
                [ariaLabel]="'ACTIONS.CONFIRMATION.YES.TOOLTIP' | translate"
                [pTooltip]="'ACTIONS.CONFIRMATION.YES.TOOLTIP' | translate"
                tooltipPosition="top"
                tooltipEvent="hover"
              ></p-button>
            </footer>
          </ng-template>
        </p-dialog>
      </ng-container>
      <!-- DETAIL -->
      <app-parameter-detail
        [displayDialog]="displayDetailDialog"
        (hideDialogAndChanged)="onCloseDetail($event)"
        [parameter]="item4Detail"
        [allProducts]="metaData.allProducts"
        [changeMode]="changeMode"
        [dateFormat]="dateFormat"
      ></app-parameter-detail>
    </ocx-page-content>
  </ng-container>
</ocx-portal-page>

<app-usage-detail
  [displayDialog]="displayUsageDetailDialog"
  (hideDialog)="onCloseUsageDetail()"
  [parameter]="item4Detail"
  [dateFormat]="dateFormat"
></app-usage-detail>


```

### File: onecx-parameter-ui/src/app/parameter/parameter-search/parameter-search.component.spec.ts

```ts

import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideRouter, Router, ActivatedRoute } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { of, throwError } from 'rxjs'

import { PortalMessageService, UserService } from '@onecx/angular-integration-interface'
import { Column } from '@onecx/portal-integration-angular'

import { Parameter, ParametersAPIService, Product } from 'src/app/shared/generated'
import {
  ApplicationAbstract,
  ExtendedParameter,
  ExtendedProduct,
  ParameterSearchComponent,
  ProductAbstract
} from './parameter-search.component'
import { UsageSearchComponent } from '../usage-search/usage-search.component'

// response data of parameter search service
const paramRespData: Parameter[] = [
  {
    modificationCount: 0,
    id: 'id0',
    productName: 'product1',
    applicationId: 'app1',
    name: 'name0',
    displayName: 'Name 0',
    value: 'val1',
    importValue: 'val1'
  },
  {
    modificationCount: 0,
    id: 'id1',
    productName: 'product1',
    applicationId: 'app2',
    name: 'name1',
    displayName: 'Name 1',
    value: true,
    importValue: false
  },
  {
    modificationCount: 0,
    id: 'id2',
    productName: 'product1',
    applicationId: 'app2',
    name: 'name2',
    displayName: 'name2',
    value: { v: 'v2' },
    importValue: { v: 'v2' }
  },
  {
    modificationCount: 0,
    id: 'id4',
    productName: 'product1',
    applicationId: 'app2',
    name: 'name3',
    displayName: 'Name 3',
    value: { v: 'v2' },
    importValue: { v: 'v2', w: true }
  },
  {
    modificationCount: 0,
    id: 'id4',
    productName: 'product1',
    applicationId: 'app2',
    name: 'name4',
    displayName: 'Name 4',
    value: 'text',
    importValue: false
  },
  {
    modificationCount: 0,
    id: 'id5',
    productName: 'product1',
    applicationId: 'app2',
    name: 'name5',
    displayName: 'Name 5',
    importValue: false
  },
  {
    modificationCount: 0,
    id: 'id6',
    productName: 'product1',
    applicationId: 'app2',
    name: 'name6',
    value: undefined,
    importValue: undefined
  }
]
// data in component
const parameterData: ExtendedParameter[] = [
  { ...paramRespData[0], valueType: 'STRING', importValueType: 'STRING', displayValue: 'val1', isEqual: 'TRUE' },
  { ...paramRespData[1], valueType: 'BOOLEAN', importValueType: 'BOOLEAN', displayValue: 'true', isEqual: 'FALSE' },
  { ...paramRespData[2], valueType: 'OBJECT', importValueType: 'OBJECT', displayValue: '{ ... }', isEqual: 'TRUE' },
  { ...paramRespData[3], valueType: 'OBJECT', importValueType: 'OBJECT', displayValue: '{ ... }', isEqual: 'FALSE' },
  { ...paramRespData[4], valueType: 'STRING', importValueType: 'BOOLEAN', displayValue: 'text', isEqual: 'FALSE' },
  { ...paramRespData[5], valueType: 'UNKNOWN', importValueType: 'BOOLEAN', displayValue: 'false', isEqual: 'FALSE' },
  {
    ...paramRespData[6],
    valueType: 'UNKNOWN',
    importValueType: 'UNKNOWN',
    displayValue: '',
    isEqual: 'UNDEFINED',
    displayName: 'name6'
  }
]
// Original form BFF: unsorted and not complete
const usedProductsOrg: Product[] = [
  { productName: 'product2', displayName: undefined, applications: ['app2-svc'] },
  { productName: 'product1', displayName: undefined, applications: ['app1-svc'] }
]
const app1: ApplicationAbstract = {
  appId: 'app1-svc',
  appName: 'OneCX app svc 1',
  undeployed: false,
  deprecated: false
}
const app2: ApplicationAbstract = {
  appId: 'app2-svc',
  appName: 'OneCX app svc 2',
  undeployed: false,
  deprecated: false
}
// product store products
const allProductsOrg: ProductAbstract[] = [
  { name: 'product1', displayName: 'Product 1', undeployed: false, applications: [app1] },
  { name: 'product2', displayName: 'Product 2', undeployed: true, applications: [app2] },
  { name: 'product3', displayName: 'Product 3', applications: [{ appId: 'app3-svc' }, { appId: 'app3-bff' }] },
  { name: 'product4', displayName: 'Product 4', applications: [{ appId: 'app4-svc' }, { appId: 'app4-bff' }] },
  { name: 'product5' }
]
const allProducts: ExtendedProduct[] = [
  { name: 'product1', displayName: 'Product 1', undeployed: false, applications: [app1] },
  { name: 'product2', displayName: 'Product 2', undeployed: true, applications: [app2] },
  { name: 'product3', displayName: 'Product 3', applications: [{ appId: 'app3-svc' }, { appId: 'app3-bff' }] },
  { name: 'product4', displayName: 'Product 4', applications: [{ appId: 'app4-svc' }, { appId: 'app4-bff' }] },
  { name: 'product5', displayName: 'product5', applications: [] }
]

describe('ParameterSearchComponent', () => {
  let component: ParameterSearchComponent
  let fixture: ComponentFixture<ParameterSearchComponent>
  const routerSpy = jasmine.createSpyObj('router', ['navigate'])
  const routeMock = { snapshot: { paramMap: new Map() } }

  const mockUserService = { lang$: { getValue: jasmine.createSpy('getValue') } }
  const msgServiceSpy = jasmine.createSpyObj<PortalMessageService>('PortalMessageService', ['success', 'error', 'info'])
  const apiServiceSpy = {
    deleteParameter: jasmine.createSpy('deleteParameter').and.returnValue(of(null)),
    getAllProducts: jasmine.createSpy('getAllProducts').and.returnValue(of([])),
    searchParametersByCriteria: jasmine.createSpy('searchParametersByCriteria').and.returnValue(of({}))
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ParameterSearchComponent],
      imports: [
        TranslateTestingModule.withTranslations({
          de: require('src/assets/i18n/de.json'),
          en: require('src/assets/i18n/en.json')
        }).withDefaultLanguage('en')
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'usage', component: UsageSearchComponent }]),
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: UserService, useValue: mockUserService },
        { provide: PortalMessageService, useValue: msgServiceSpy },
        { provide: ParametersAPIService, useValue: apiServiceSpy }
      ]
    }).compileComponents()
    msgServiceSpy.success.calls.reset()
    msgServiceSpy.error.calls.reset()
    msgServiceSpy.info.calls.reset()
    mockUserService.lang$.getValue.and.returnValue('de')
    // reset data services
    apiServiceSpy.searchParametersByCriteria.calls.reset()
    apiServiceSpy.getAllProducts.calls.reset()
    apiServiceSpy.deleteParameter.calls.reset()
    // to spy data: refill with neutral data
    apiServiceSpy.searchParametersByCriteria.and.returnValue(of({}))
    apiServiceSpy.getAllProducts.and.returnValue(of([]))
    apiServiceSpy.deleteParameter.and.returnValue(of(null))
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterSearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  describe('construction', () => {
    it('should create', () => {
      expect(component).toBeTruthy()
    })

    it('should call OnInit and populate filteredColumns/actions correctly', () => {
      component.ngOnInit()
      expect(component.filteredColumns[0]).toEqual(component.columns[0])
    })

    it('dataview translations', (done) => {
      const translationData = {
        'DIALOG.DATAVIEW.FILTER': 'filter'
      }
      const translateService = TestBed.inject(TranslateService)
      spyOn(translateService, 'get').and.returnValue(of(translationData))

      component.ngOnInit()

      component.dataViewControlsTranslations$?.subscribe({
        next: (data) => {
          if (data) {
            expect(data.filterInputPlaceholder).toEqual('filter')
          }
          done()
        },
        error: done.fail
      })
    })
  })

  describe('page actions', () => {
    it('should open create dialog', () => {
      spyOn(component, 'onDetail')

      component.ngOnInit()
      component.actions[0].actionCallback()

      expect(component.onDetail).toHaveBeenCalled()
    })

    it('should go to latest usage page', () => {
      spyOn(component, 'onGoToLatestUsagePage')

      component.ngOnInit()
      component.actions[1].actionCallback()

      expect(component.onGoToLatestUsagePage).toHaveBeenCalled()
    })

    it('should navigate to latest usage page', () => {
      component.onGoToLatestUsagePage()

      expect(routerSpy.navigate).toHaveBeenCalledWith(['./usage'], { relativeTo: routeMock })
    })
  })

  describe('search', () => {
    it('should search parameters without search criteria', (done) => {
      apiServiceSpy.searchParametersByCriteria.and.returnValue(of({ stream: paramRespData }))

      component.onSearch({})

      component.data$?.subscribe({
        next: (data) => {
          expect(data).toEqual(parameterData)
          done()
        },
        error: done.fail
      })
    })

    it('should display an info message if there is no result', (done) => {
      apiServiceSpy.searchParametersByCriteria.and.returnValue(of({ totalElements: 0, stream: [] }))

      component.onSearch({})

      component.data$?.subscribe({
        next: (data) => {
          expect(data.length).toEqual(0)
          expect(msgServiceSpy.info).toHaveBeenCalledOnceWith({ summaryKey: 'ACTIONS.SEARCH.MESSAGE.NO_RESULTS' })
          done()
        },
        error: done.fail
      })
    })

    it('should display an error message if the search fails', (done) => {
      const errorResponse = { status: '403', statusText: 'Not authorized' }
      apiServiceSpy.searchParametersByCriteria.and.returnValue(throwError(() => errorResponse))
      spyOn(console, 'error')

      component.onSearch({})

      component.data$?.subscribe({
        next: (data) => {
          expect(data).toEqual([])
          done()
        },
        error: () => {
          expect(msgServiceSpy.error).toHaveBeenCalledWith({ summaryKey: 'ACTIONS.SEARCH.MESSAGE.SEARCH_FAILED' })
          expect(console.error).toHaveBeenCalledWith('searchParametersByCriteria', errorResponse)
          done.fail
        }
      })
    })
  })

  /**
   * META data: which were assigned to data
   */
  describe('service data', () => {
    it('should get products which are assigned to data', (done) => {
      apiServiceSpy.getAllProducts.and.returnValue(of(usedProductsOrg))

      component.ngOnInit()

      component.usedProducts$?.subscribe({
        next: (data) => {
          expect(data).toEqual(usedProductsOrg)
          done()
        },
        error: done.fail
      })
    })

    it('should get all products assigned to', (done) => {
      const errorResponse = { status: '404', statusText: 'An error occur' }
      apiServiceSpy.getAllProducts.and.returnValue(throwError(() => errorResponse))
      spyOn(console, 'error')

      component.ngOnInit()

      component.usedProducts$?.subscribe({
        next: (data) => {
          expect(data).toEqual([])
          done()
        },
        error: () => {
          expect(component.exceptionKeyMeta).toBe('EXCEPTIONS.HTTP_STATUS_' + errorResponse.status + '.PRODUCTS')
          expect(console.error).toHaveBeenCalledOnceWith('getAllProducts', errorResponse)
          done.fail
        }
      })
    })
  })

  describe('META data', () => {
    it('should get product store products - successful', (done) => {
      component.slotEmitter.emit(allProductsOrg)
      apiServiceSpy.getAllProducts.and.returnValue(of(usedProductsOrg))

      component.ngOnInit()

      component.usedProducts$?.subscribe({
        next: (data) => {
          expect(data).toEqual(usedProductsOrg)
          done()
        },
        error: done.fail
      })
    })
  })

  /*
   * UI ACTIONS
   */
  describe('detail actions', () => {
    it('should prepare the creation of a new parameter', () => {
      const ev: MouseEvent = new MouseEvent('type')
      spyOn(ev, 'stopPropagation')
      const mode = 'CREATE'

      component.onDetail(mode, undefined, ev)

      expect(ev.stopPropagation).toHaveBeenCalled()
      expect(component.changeMode).toEqual(mode)
      expect(component.item4Detail).toBe(undefined)
      expect(component.displayDetailDialog).toBeTrue()

      component.onCloseDetail(false)

      expect(component.displayDetailDialog).toBeFalse()
    })

    it('should show details of a parameter', () => {
      const mode = 'EDIT'

      component.onDetail(mode, parameterData[0])

      expect(component.changeMode).toEqual(mode)
      expect(component.itemId).toBe(parameterData[0].id)
      expect(component.displayDetailDialog).toBeTrue()
    })

    it('should prepare the copy of a parameter', () => {
      const mode = 'COPY'

      component.onDetail(mode, parameterData[0])

      expect(component.changeMode).toEqual(mode)
      expect(component.item4Detail).toBe(parameterData[0])
      expect(component.displayDetailDialog).toBeTrue()

      component.onCloseDetail(true)

      expect(component.displayDetailDialog).toBeFalse()
    })
  })

  describe('deletion', () => {
    let items4Deletion: Parameter[] = []

    beforeEach(() => {
      items4Deletion = [
        { id: 'id1', productName: 'product1', applicationId: 'app1', name: 'name1' },
        { id: 'id2', productName: 'product1', applicationId: 'app1', name: 'name2' },
        { id: 'id3', productName: 'product3', applicationId: 'app1', name: 'name2' }
      ]
    })

    it('should prepare the deletion of a parameter - ok', () => {
      const ev: MouseEvent = new MouseEvent('type')
      spyOn(ev, 'stopPropagation')

      component.onDelete(ev, items4Deletion[0])

      expect(ev.stopPropagation).toHaveBeenCalled()
      expect(component.item4Delete).toBe(items4Deletion[0])
      expect(component.displayDeleteDialog).toBeTrue()
    })

    it('should delete a parameter with confirmation', () => {
      apiServiceSpy.deleteParameter.and.returnValue(of(null))
      const ev: MouseEvent = new MouseEvent('type')

      component.onDelete(ev, items4Deletion[1])
      component.onDeleteConfirmation(items4Deletion) // remove but not the last of the product

      expect(component.displayDeleteDialog).toBeFalse()
      expect(msgServiceSpy.success).toHaveBeenCalledWith({ summaryKey: 'ACTIONS.DELETE.MESSAGE.OK' })

      component.onDelete(ev, items4Deletion[2])
      component.onDeleteConfirmation(items4Deletion) // remove and this was the last of the product
    })

    it('should display error if deleting a parameter fails', () => {
      const errorResponse = { status: '400', statusText: 'Error on deletion' }
      apiServiceSpy.deleteParameter.and.returnValue(throwError(() => errorResponse))
      const ev: MouseEvent = new MouseEvent('type')
      spyOn(console, 'error')

      component.onDelete(ev, items4Deletion[0])
      component.onDeleteConfirmation(items4Deletion)

      expect(msgServiceSpy.error).toHaveBeenCalledWith({ summaryKey: 'ACTIONS.DELETE.MESSAGE.NOK' })
      expect(console.error).toHaveBeenCalledWith('deleteParameter', errorResponse)
    })

    it('should reject confirmation if param was not set', () => {
      component.onDeleteConfirmation(items4Deletion)

      expect(apiServiceSpy.deleteParameter).not.toHaveBeenCalled()
    })
  })

  describe('filter columns', () => {
    it('should update the columns that are seen in data', () => {
      const columns: Column[] = [
        { field: 'productName', header: 'PRODUCT_NAME' },
        { field: 'description', header: 'DESCRIPTION' }
      ]
      const expectedColumn = { field: 'productName', header: 'PRODUCT_NAME' }
      component.columns = columns

      component.onColumnsChange(['productName'])

      expect(component.filteredColumns).not.toContain(columns[1])
      expect(component.filteredColumns).toEqual([jasmine.objectContaining(expectedColumn)])
    })

    it('should apply a filter to the result table', () => {
      component.dataTable = jasmine.createSpyObj('dataTable', ['filterGlobal'])

      component.onFilterChange('test')

      expect(component.dataTable?.filterGlobal).toHaveBeenCalledWith('test', 'contains')
    })
  })

  describe('UI displaying product/app names', () => {
    it('should manage empty product lists', () => {
      const name = component.getProductDisplayName(allProducts[0].name, [])

      expect(name).toBe(allProducts[0].name)
    })

    it('should get product display name - found', () => {
      const name = component.getProductDisplayName(allProducts[0].name, allProducts)

      expect(name).toBe(allProducts[0].displayName)
    })

    it('should get product display name - not found', () => {
      const name = component.getProductDisplayName('unknown', allProducts)

      expect(name).toBe('unknown')
    })

    describe('apps', () => {
      const ap = allProducts[0]
      const apps = ap.applications
      const app = apps[0]

      it('should manage empty product lists', () => {
        const name = component.getAppDisplayName(allProducts[0].name, app.appId, [])

        expect(name).toBe(allProducts[0].name)
      })

      it('should get app display name - found', () => {
        const name = component.getAppDisplayName(allProducts[0].name, app.appId, allProducts)

        expect(name).toBe(app.appName)
      })

      it('should get product display name - not found', () => {
        const name = component.getAppDisplayName(allProducts[2].name, 'unknown', allProducts)

        expect(name).toBe('unknown')
      })
    })
  })

  describe('row actions', () => {
    it('should display usage detail dialog', () => {
      const event = new MouseEvent('click')
      spyOn(event, 'stopPropagation')

      component.onDetailUsage(event, parameterData[0])

      expect(event.stopPropagation).toHaveBeenCalled()
      expect(component.item4Detail).toEqual(parameterData[0])
      expect(component.displayUsageDetailDialog).toBeTrue()
    })

    it('should hide the usage detail dialog', () => {
      component.displayUsageDetailDialog = true

      component.onCloseUsageDetail()

      expect(component.displayUsageDetailDialog).toBeFalse()
    })
  })

  describe('onCriteriaReset', () => {
    it('should reset criteria, reset the form group, and disable the applicationId control', () => {
      component.criteria = { name: 'name' }

      component.onCriteriaReset()

      expect(component.criteria).toEqual({})
    })
  })

  /**
   * Language tests
   */
  describe('Language tests', () => {
    it('should set a German date format', () => {
      expect(component.dateFormat).toEqual('dd.MM.yyyy HH:mm:ss')
    })

    it('should set default date format', () => {
      mockUserService.lang$.getValue.and.returnValue('en')
      fixture = TestBed.createComponent(ParameterSearchComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
      expect(component.dateFormat).toEqual('M/d/yy, hh:mm:ss a')
    })
  })
})


```

### File: onecx-parameter-ui/src/app/parameter/parameter-search/parameter-search.component.ts

```ts

import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { BehaviorSubject, catchError, combineLatest, finalize, map, tap, Observable, of, ReplaySubject } from 'rxjs'
import { Table } from 'primeng/table'

import { PortalMessageService, UserService } from '@onecx/angular-integration-interface'
import { Action } from '@onecx/angular-accelerator'
import { Column, DataViewControlTranslations } from '@onecx/portal-integration-angular'
import { SlotService } from '@onecx/angular-remote-components'

import {
  Parameter,
  ParameterPageResult,
  ParameterSearchCriteria,
  ParametersAPIService,
  Product
} from 'src/app/shared/generated'
import { displayEqualityState, displayValue2, displayValueType, sortByDisplayName } from 'src/app/shared/utils'

export type ChangeMode = 'VIEW' | 'COPY' | 'CREATE' | 'EDIT'
type ExtendedColumn = Column & {
  hasFilter?: boolean
  isBoolean?: boolean
  isDate?: boolean
  isDuration?: boolean
  isText?: boolean
  isValue?: boolean
  frozen?: boolean
  css?: string
  sort?: boolean
}
export type ExtendedParameter = Parameter & {
  valueType: string
  importValueType: string
  displayValue: string
  isEqual: string
}
export type ExtendedProduct = {
  name: string
  displayName: string
  applications: Array<ApplicationAbstract>
  undeployed?: boolean
}
type AllMetaData = {
  allProducts: ExtendedProduct[]
  usedProducts: ExtendedProduct[]
}
// DATA structures of product store response
export type ApplicationAbstract = {
  appName?: string
  appId?: string
  undeployed?: boolean
  deprecated?: boolean
}
export type ProductAbstract = {
  id?: string
  name: string
  version?: string
  description?: string
  imageUrl?: string
  displayName?: string
  classifications?: Array<string>
  undeployed?: boolean
  provider?: string
  applications?: Array<ApplicationAbstract>
}

@Component({
  selector: 'app-parameter-search',
  templateUrl: './parameter-search.component.html',
  styleUrls: ['./parameter-search.component.scss']
})
export class ParameterSearchComponent implements OnInit {
  // dialog
  public loading = false
  public exceptionKey: string | undefined = undefined
  public exceptionKeyMeta: string | undefined = undefined
  public changeMode: ChangeMode = 'VIEW'
  public dateFormat: string
  public refreshUsedProducts = false
  public displayDetailDialog = false
  public displayDeleteDialog = false
  public displayUsageDetailDialog = false
  public actions: Action[] = []
  public filteredColumns: Column[] = []

  @ViewChild('dataTable', { static: false }) dataTable: Table | undefined
  public dataViewControlsTranslations$: Observable<DataViewControlTranslations> | undefined

  // data
  public data$: Observable<ExtendedParameter[]> | undefined
  public criteria: ParameterSearchCriteria = {}
  public metaData$!: Observable<AllMetaData>
  public usedProducts$ = new ReplaySubject<Product[]>(1) // getting data from bff endpoint
  public itemId: string | undefined // used on detail
  public item4Detail: Parameter | undefined // used on detail
  public item4Delete: Parameter | undefined // used on deletion
  // slot configuration: get product infos via remote component
  public slotName = 'onecx-product-data'
  public isComponentDefined$: Observable<boolean> | undefined // check
  public productData$ = new BehaviorSubject<ProductAbstract[] | undefined>(undefined) // product infos
  public slotEmitter = new EventEmitter<ProductAbstract[]>()

  public columns: ExtendedColumn[] = [
    {
      field: 'name',
      header: 'COMBINED_NAME',
      translationPrefix: 'PARAMETER',
      active: true,
      frozen: true,
      sort: true,
      css: 'word-break-all'
    },
    {
      field: 'value',
      header: 'VALUE',
      translationPrefix: 'PARAMETER',
      active: true,
      isValue: true,
      css: 'text-center'
    },
    {
      field: 'valueType',
      header: 'VALUE.TYPE',
      translationPrefix: 'PARAMETER',
      active: true,
      css: 'text-center'
    },
    {
      field: 'equal',
      header: 'EQUAL',
      translationPrefix: 'PARAMETER',
      active: true,
      css: 'text-center'
    },
    {
      field: 'applicationId',
      header: 'PRODUCT_APP',
      translationPrefix: 'PARAMETER',
      active: true,
      sort: true
    },
    {
      field: 'operator',
      header: 'OPERATOR',
      active: true,
      translationPrefix: 'PARAMETER',
      isBoolean: true,
      css: 'text-center'
    },
    {
      field: 'modificationDate',
      header: 'MODIFICATION_DATE',
      translationPrefix: 'INTERNAL',
      active: true,
      sort: true,
      isDate: true
    }
  ]

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly user: UserService,
    private readonly slotService: SlotService,
    private readonly translate: TranslateService,
    private readonly msgService: PortalMessageService,
    private readonly parameterApi: ParametersAPIService
  ) {
    this.dateFormat = this.user.lang$.getValue() === 'de' ? 'dd.MM.yyyy HH:mm:ss' : 'M/d/yy, hh:mm:ss a'
    this.filteredColumns = this.columns.filter((a) => a.active === true)
    this.isComponentDefined$ = this.slotService.isSomeComponentDefinedForSlot(this.slotName)
  }

  public ngOnInit(): void {
    this.slotEmitter.subscribe(this.productData$)
    this.onReload()
    this.getMetaData() // and trigger search
    this.prepareDialogTranslations()
    this.preparePageActions()
  }

  private onReload(): void {
    this.getUsedProducts()
    this.onSearch({}, true)
  }
  public onGoToLatestUsagePage(): void {
    this.router.navigate(['./usage'], { relativeTo: this.route })
  }

  /****************************************************************************
   * GET DATA
   */
  // get used products (used === assigned to data)
  private getUsedProducts() {
    this.parameterApi
      .getAllProducts()
      .pipe(
        catchError((err) => {
          this.exceptionKeyMeta = 'EXCEPTIONS.HTTP_STATUS_' + err.status + '.PRODUCTS'
          console.error('getAllProducts', err)
          return of([])
        })
      )
      .subscribe((v) => this.usedProducts$.next(v))
  }

  // combine used products with product info from product store
  private getMetaData() {
    this.exceptionKeyMeta = undefined
    // combine all product infos and used products to one meta data structure
    this.metaData$ = combineLatest([this.productData$, this.usedProducts$]).pipe(
      map(([aP, uP]: [ProductAbstract[] | undefined, Product[]]) => {
        return this.combineProducts(
          this.convertProductAbstract2ExtendedProduct(aP),
          this.convertProduct2ExtendedProduct(uP)
        )
      })
    )
  }
  /****************************************************************************
   * HELPER
   */
  // map:  ProductAbstract[] => ExtendedProduct[]
  private convertProductAbstract2ExtendedProduct(aP: ProductAbstract[] | undefined): ExtendedProduct[] {
    const aps: ExtendedProduct[] = []
    if (aP && aP.length > 0) {
      aP.forEach((p) =>
        aps.push({
          name: p.name,
          displayName: p.displayName ?? p.name,
          undeployed: p.undeployed,
          applications: p.applications ?? []
        })
      )
      aps.sort(sortByDisplayName)
    }
    return aps
  }
  // map:  Product[] => ExtendedProduct[]
  private convertProduct2ExtendedProduct(uP: Product[]): ExtendedProduct[] {
    const ups: ExtendedProduct[] = []
    uP.forEach((p) => {
      const apps: ApplicationAbstract[] = []
      p.applications?.forEach((s) => {
        apps.push({ appName: s, appId: s } as ApplicationAbstract)
      })
      ups.push({ name: p.productName, displayName: p.productName, applications: apps } as ExtendedProduct)
    })
    ups.sort(sortByDisplayName)
    return ups
  }

  private combineProducts(aP: ExtendedProduct[], uP: ExtendedProduct[]): AllMetaData {
    // convert/enrich used products if product data are available
    if (aP?.length > 0 && uP.length > 0) {
      uP.forEach((p) => {
        const pi = aP.find((ap) => ap.name === p.name) // get product data
        if (pi) {
          p.displayName = pi.displayName!
          p.undeployed = pi.undeployed
          // collect apps: only used
          const uApps: ApplicationAbstract[] = []
          p.applications?.forEach((papp) => {
            // app still exists?
            const app = pi.applications?.find((app) => app.appId === papp.appId)
            if (app) uApps.push(app)
          })
          p.applications = uApps
        }
      })
      uP.sort(sortByDisplayName)
    }
    // if service is not running or product data are not yet available
    if (aP.length === 0) aP = uP
    return { allProducts: aP, usedProducts: [...uP] } // meta data
  }

  /****************************************************************************
   *  SEARCH data
   */
  public onSearch(criteria: ParameterSearchCriteria, reuseCriteria = false): void {
    this.loading = true
    this.exceptionKey = undefined
    if (!reuseCriteria) this.criteria = { ...criteria }
    this.data$ = this.parameterApi.searchParametersByCriteria({ parameterSearchCriteria: { ...this.criteria } }).pipe(
      tap((data: any) => {
        if (data.totalElements === 0) {
          this.msgService.info({ summaryKey: 'ACTIONS.SEARCH.MESSAGE.NO_RESULTS' })
          return data.size
        }
      }),
      map((data: ParameterPageResult) => {
        if (!data.stream) return [] as ExtendedParameter[]
        return data.stream.map(
          (p) =>
            ({
              ...p,
              displayName: p.displayName ?? p.name,
              valueType: displayValueType(p.value),
              importValueType: displayValueType(p.importValue),
              displayValue: displayValue2(p.value, p.importValue),
              isEqual: displayEqualityState(p.value, p.importValue)
            }) as ExtendedParameter
        )
      }),
      catchError((err) => {
        this.exceptionKey = 'EXCEPTIONS.HTTP_STATUS_' + err.status + '.PARAMETERS'
        console.error('searchParametersByCriteria', err)
        return of([] as ExtendedParameter[])
      }),
      finalize(() => (this.loading = false))
    )
  }

  /**
   * Dialog preparation
   */
  private prepareDialogTranslations(): void {
    this.dataViewControlsTranslations$ = this.translate
      .get([
        'PARAMETER.PRODUCT_NAME',
        'PARAMETER.APP_ID',
        'PARAMETER.NAME',
        'PARAMETER.DISPLAY_NAME',
        'DIALOG.DATAVIEW.FILTER'
      ])
      .pipe(
        map((data) => {
          return {
            filterInputPlaceholder: data['DIALOG.DATAVIEW.FILTER'],
            filterInputTooltip:
              data['PARAMETER.PRODUCT_NAME'] +
              ', ' +
              data['PARAMETER.APP_ID'] +
              ', ' +
              data['PARAMETER.DISPLAY_NAME'] +
              ', ' +
              data['PARAMETER.NAME']
          } as DataViewControlTranslations
        })
      )
  }

  private preparePageActions(): void {
    this.actions = [
      {
        labelKey: 'ACTIONS.CREATE.LABEL',
        titleKey: 'ACTIONS.CREATE.TOOLTIP',
        actionCallback: () => this.onDetail('CREATE', undefined),
        icon: 'pi pi-plus',
        show: 'always',
        permission: 'PARAMETER#EDIT'
      },
      {
        labelKey: 'DIALOG.NAVIGATION.LATEST_USAGE.LABEL',
        titleKey: 'DIALOG.NAVIGATION.LATEST_USAGE.TOOLTIP',
        actionCallback: () => this.onGoToLatestUsagePage(),
        icon: 'pi pi-history',
        show: 'always',
        permission: 'USAGE#SEARCH'
      }
    ]
  }

  /****************************************************************************
   *  UI Events
   */
  public onCriteriaReset(): void {
    this.criteria = {}
  }
  public onColumnsChange(activeIds: string[]) {
    this.filteredColumns = activeIds.map((id) => this.columns.find((col) => col.field === id)) as Column[]
  }
  public onFilterChange(event: string): void {
    this.dataTable?.filterGlobal(event, 'contains')
  }

  // Detail => CREATE, COPY, EDIT, VIEW
  public onDetail(mode: ChangeMode, item: Parameter | undefined, ev?: Event): void {
    ev?.stopPropagation()
    this.changeMode = mode
    this.item4Detail = item
    this.itemId = item?.id
    this.displayDetailDialog = true
  }
  public onCloseDetail(refresh: boolean): void {
    this.displayDetailDialog = false
    this.itemId = undefined
    if (refresh) {
      this.onReload()
    }
  }

  // DELETE => Ask for confirmation
  public onDelete(ev: Event, item: Parameter): void {
    ev.stopPropagation()
    this.item4Delete = item
    this.displayDeleteDialog = true
  }
  // user confirmed deletion
  public onDeleteConfirmation(data: Parameter[]): void {
    if (!this.item4Delete?.id) return
    this.parameterApi.deleteParameter({ id: this.item4Delete?.id }).subscribe({
      next: () => {
        this.msgService.success({ summaryKey: 'ACTIONS.DELETE.MESSAGE.OK' })
        // remove item from data
        data = data?.filter((d) => d.id !== this.item4Delete?.id)
        // check remaing data if product still exists - if not then reload
        const d = data?.filter((d) => d.productName === this.item4Delete?.productName)
        this.item4Delete = undefined
        this.displayDeleteDialog = false
        if (d?.length === 0)
          this.onReload() // deletion forces reload
        else this.onSearch({}, true)
      },
      error: (err) => {
        this.msgService.error({ summaryKey: 'ACTIONS.DELETE.MESSAGE.NOK' })
        console.error('deleteParameter', err)
      }
    })
  }

  // Usage / History
  public onDetailUsage(ev: Event, item: Parameter) {
    ev.stopPropagation()
    this.item4Detail = item
    this.displayUsageDetailDialog = true
  }
  public onCloseUsageDetail() {
    this.displayUsageDetailDialog = false
    this.item4Detail = undefined
  }

  /****************************************************************************
   *  UI Helper
   */
  public getProductDisplayName(name: string | undefined, allProducts: ExtendedProduct[]): string | undefined {
    if (allProducts.length === 0) return name
    return allProducts.find((item) => item.name === name)?.displayName ?? name
  }
  public getAppDisplayName(
    productName: string | undefined,
    appId: string | undefined,
    allProducts: ExtendedProduct[]
  ): string | undefined {
    if (allProducts.length === 0) return productName
    return (
      allProducts.find((item) => item.name === productName)?.applications?.find((a) => a.appId === appId)?.appName ??
      appId
    )
  }
}


```

//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

## Folder: onecx-parameter-ui/src/app/parameter/usage-detail (3 files)

### File: onecx-parameter-ui/src/app/parameter/usage-detail/usage-detail.component.html

```html

<p-dialog
  [header]="'DIALOG.USAGE.HEADER' | translate"
  [(visible)]="displayDialog"
  (onHide)="onDialogHide()"
  [modal]="true"
  [closable]="true"
  [draggable]="true"
  [resizable]="true"
  [maximizable]="true"
  [style]="{ width: '800px' }"
  [breakpoints]="{
    '992px': '75vw',
    '768px': '90vw',
    '630px': '100vw'
  }"
>
  <app-usage-detail-criteria
    [history]="history"
    [parameter]="parameter"
    (criteriaEmitter)="onSearch($event)"
  ></app-usage-detail-criteria>

  <app-usage-detail-list
    [loading]="loading"
    [exceptionKey]="exceptionKey"
    [history]="history"
    [parameter]="parameter"
    [dateFormat]="dateFormat"
    [data]="(data$ | async) ?? []"
  ></app-usage-detail-list>

  <ng-template pTemplate="footer">
    <div class="flex flex-wrap justify-content-end gap-2 mb-1">
      <p-button
        id="pam_usage_detail_action_close"
        icon="pi pi-times"
        (onClick)="onDialogHide()"
        [label]="'ACTIONS.NAVIGATION.CLOSE' | translate"
        [ariaLabel]="'ACTIONS.NAVIGATION.CLOSE' | translate"
        [pTooltip]="'ACTIONS.NAVIGATION.CLOSE.TOOLTIP' | translate"
        tooltipPosition="top"
        tooltipEvent="hover"
      ></p-button>
    </div>
  </ng-template>
</p-dialog>


```

### File: onecx-parameter-ui/src/app/parameter/usage-detail/usage-detail.component.spec.ts

```ts

import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { DatePipe } from '@angular/common'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { FormBuilder } from '@angular/forms'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { of, throwError } from 'rxjs'

import { UserService } from '@onecx/angular-integration-interface'

import { History, HistoriesAPIService, HistoryCriteria, HistoryPageResult, Parameter } from 'src/app/shared/generated'
import { UsageDetailComponent } from './usage-detail.component'
import { ExtendedHistory } from '../usage-search/usage-search.component'

// response data of parameter search service
const historyRespData: History[] = [
  {
    id: 'id0',
    productName: 'product1',
    applicationId: 'app1',
    name: 'name0',
    usedValue: 'Val',
    defaultValue: 'Val',
    start: '2024-01-01T00:00:00Z',
    end: '2024-01-01T00:10:00Z'
  },
  {
    id: 'id1',
    productName: 'product1',
    applicationId: 'app1',
    name: 'name1',
    usedValue: 1234,
    defaultValue: true,
    start: '2024-01-01T00:20:00Z',
    end: '2024-01-01T00:25:00Z'
  },
  {
    id: 'id2',
    productName: 'product1',
    applicationId: 'app1',
    name: 'name2',
    usedValue: { hallo: 'test', hi: 'all' },
    defaultValue: { hallo: 'test' },
    start: '2024-01-01T00:20:00Z',
    end: '2024-01-01T00:25:00Z'
  },
  {
    id: 'id3',
    productName: 'product1',
    applicationId: 'app1',
    name: 'name3',
    usedValue: { hallo: 'test', hi: 'all' },
    start: '2024-01-01T00:20:00Z',
    end: '2024-01-01T00:25:00Z'
  },
  {
    id: 'id4',
    productName: 'product1',
    applicationId: 'app1',
    name: 'no data',
    start: '2024-01-01T00:20:00Z',
    end: '2024-01-01T00:25:00Z'
  },
  {
    id: 'id5',
    productName: 'product1',
    applicationId: 'app1',
    name: 'boolean comparison',
    usedValue: false,
    defaultValue: false,
    start: '2024-01-01T00:20:00Z',
    end: '2024-01-01T00:25:00Z'
  }
]
const historyData: ExtendedHistory[] = [
  {
    ...historyRespData[0],
    valueType: 'STRING',
    defaultValueType: 'STRING',
    displayUsedValue: 'Val',
    displayDefaultValue: 'Val',
    isEqual: 'TRUE'
  },
  {
    ...historyRespData[1],
    valueType: 'NUMBER',
    defaultValueType: 'BOOLEAN',
    displayUsedValue: '1234',
    displayDefaultValue: 'true',
    isEqual: 'FALSE'
  },
  {
    ...historyRespData[2],
    valueType: 'OBJECT',
    defaultValueType: 'OBJECT',
    displayUsedValue: '{ ... }',
    displayDefaultValue: '{ ... }',
    isEqual: 'FALSE'
  },
  {
    ...historyRespData[3],
    valueType: 'OBJECT',
    defaultValueType: 'UNKNOWN',
    displayUsedValue: '{ ... }',
    displayDefaultValue: '',
    isEqual: 'FALSE'
  },
  {
    ...historyRespData[4],
    valueType: 'UNKNOWN',
    defaultValueType: 'UNKNOWN',
    displayUsedValue: '',
    displayDefaultValue: '',
    isEqual: 'UNDEFINED'
  },
  {
    ...historyRespData[5],
    valueType: 'BOOLEAN',
    defaultValueType: 'BOOLEAN',
    displayUsedValue: 'false',
    displayDefaultValue: 'false',
    isEqual: 'TRUE'
  }
]
const parameter: Parameter = {
  id: 'pid',
  productName: 'prod1',
  applicationId: 'app1',
  name: 'name',
  displayName: 'displayName',
  value: 'value'
}

describe('HistoryComponent', () => {
  let component: UsageDetailComponent
  let fixture: ComponentFixture<UsageDetailComponent>
  let datePipe: DatePipe

  const historyApiSpy = {
    getAllHistory: jasmine.createSpy('getAllHistory').and.returnValue(of({}))
  }
  const mockUserService = { lang$: { getValue: jasmine.createSpy('getValue') } }

  beforeEach(waitForAsync(() => {
    datePipe = new DatePipe('en-US')

    TestBed.configureTestingModule({
      declarations: [UsageDetailComponent],
      imports: [
        TranslateTestingModule.withTranslations({
          de: require('src/assets/i18n/de.json'),
          en: require('src/assets/i18n/en.json')
        }).withDefaultLanguage('en')
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserService, useValue: mockUserService },
        { provide: HistoriesAPIService, useValue: historyApiSpy },
        { provide: DatePipe, useValue: datePipe }
      ]
    }).compileComponents()
    // to spy data: reset
    historyApiSpy.getAllHistory.calls.reset()
    // to spy data: refill with neutral data
    historyApiSpy.getAllHistory.and.returnValue(of({}))
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    component.displayDialog = true
  })

  afterEach(() => {})

  describe('construction', () => {
    it('should create', () => {
      expect(component).toBeTruthy()
    })
  })

  it('should close the dialog', () => {
    spyOn(component.hideDialog, 'emit')
    component.onDialogHide()

    expect(component.hideDialog.emit).toHaveBeenCalled()
  })

  describe('search', () => {
    it('should search history - get result', (done) => {
      const criteria: HistoryCriteria = {
        name: parameter.name,
        productName: parameter.productName,
        applicationId: parameter.applicationId
      }
      const response: HistoryPageResult = { stream: historyRespData }
      historyApiSpy.getAllHistory.and.returnValue(of(response))

      component.onSearch(criteria)

      component.data$?.subscribe({
        next: (data) => {
          expect(data).toEqual(historyData)
          done()
        },
        error: done.fail
      })
    })

    it('should search history - get empty result', (done) => {
      const criteria: HistoryCriteria = {
        name: parameter.name,
        productName: parameter.productName,
        applicationId: parameter.applicationId
      }
      const response: HistoryPageResult = { stream: [] }
      historyApiSpy.getAllHistory.and.returnValue(of(response))

      component.onSearch(criteria)

      component.data$?.subscribe({
        next: (data) => {
          expect(data.length).toEqual(0)
          done()
        },
        error: done.fail
      })
    })

    it('should search history - get no result', (done) => {
      const criteria: HistoryCriteria = {
        name: parameter.name,
        productName: parameter.productName,
        applicationId: parameter.applicationId
      }
      const result: HistoryPageResult = { stream: undefined }
      historyApiSpy.getAllHistory.and.returnValue(of(result))

      component.onSearch(criteria)

      component.data$?.subscribe({
        next: (data) => {
          expect(data.length).toEqual(0)
          done()
        },
        error: done.fail
      })
    })

    it('should search history - missing criteria', () => {
      const criteria: HistoryCriteria = {
        name: parameter.name,
        productName: parameter.productName
      }
      spyOn(console, 'error')

      component.onSearch(criteria)

      expect(console.error).toHaveBeenCalledWith('Missing search criteria for getting parameter usage', criteria)
    })

    it('should search history - get error', (done) => {
      const criteria: HistoryCriteria = {
        name: parameter.name,
        productName: parameter.productName,
        applicationId: parameter.applicationId
      }
      const errorResponse = { status: '403', statusText: 'Not authorized' }
      historyApiSpy.getAllHistory.and.returnValue(throwError(() => errorResponse))
      spyOn(console, 'error')

      component.onSearch(criteria)

      component.data$?.subscribe({
        next: (data) => {
          expect(data).toEqual([])
          done()
        },
        error: () => {
          expect(component.exceptionKey).toBe('EXCEPTIONS.HTTP_STATUS_' + errorResponse.status + '.USAGE')
          expect(console.error).toHaveBeenCalledWith('getAllHistory', errorResponse)
          done.fail
        }
      })
    })
  })
})


```

### File: onecx-parameter-ui/src/app/parameter/usage-detail/usage-detail.component.ts

```ts

import { Component, EventEmitter, Input, Output } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { catchError, finalize, map, Observable, of } from 'rxjs'

import { HistoriesAPIService, HistoryCriteria, HistoryPageResult, Parameter } from 'src/app/shared/generated'
import { displayEqualityState, displayValue, displayValueType } from 'src/app/shared/utils'

import { ExtendedHistory } from '../usage-search/usage-search.component'

@Component({
  selector: 'app-usage-detail',
  templateUrl: './usage-detail.component.html',
  styleUrls: ['./usage-detail.component.scss']
})
export class UsageDetailComponent {
  @Input() public displayDialog = false
  @Input() public history: ExtendedHistory | undefined
  @Input() public parameter: Parameter | undefined
  @Input() public dateFormat: string | undefined = undefined
  @Output() public hideDialog = new EventEmitter()

  // dialog
  public loading = false
  public exceptionKey: string | undefined = undefined
  // data
  public data$: Observable<ExtendedHistory[]> = of([])

  constructor(
    private readonly translate: TranslateService,
    private readonly historyApiService: HistoriesAPIService
  ) {}

  public onDialogHide() {
    this.hideDialog.emit()
  }

  /****************************************************************************
   *  SEARCH usage data
   */
  public onSearch(criteria: HistoryCriteria): void {
    if (!criteria.name || !criteria.productName || !criteria.applicationId) {
      console.error('Missing search criteria for getting parameter usage', criteria)
      return
    }
    this.loading = true
    this.data$ = this.historyApiService.getAllHistory({ historyCriteria: criteria }).pipe(
      map((data: HistoryPageResult) => {
        if (!data.stream) return [] as ExtendedHistory[]
        return data.stream.map(
          (h) =>
            ({
              ...h,
              valueType: displayValueType(h.usedValue),
              defaultValueType: displayValueType(h.defaultValue),
              displayDefaultValue: displayValue(h.defaultValue),
              displayUsedValue: displayValue(h.usedValue),
              isEqual: displayEqualityState(h.usedValue, h.defaultValue)
            }) as ExtendedHistory
        )
      }),
      catchError((err) => {
        this.exceptionKey = 'EXCEPTIONS.HTTP_STATUS_' + err.status + '.USAGE'
        console.error('getAllHistory', err)
        return of([])
      }),
      finalize(() => (this.loading = false))
    )
  }
}


```

//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

## Folder: onecx-parameter-ui/src/app/parameter/usage-detail/usage-detail-criteria (3 files)

### File: onecx-parameter-ui/src/app/parameter/usage-detail/usage-detail-criteria/usage-detail-criteria.component.html

```html

<div [formGroup]="criteriaForm" class="mt-1 mb-4 flex flex-row flex-wrap gap-3">
  <span class="p-float-label flex-grow-1">
    <input
      id="pam_usage_detail_criteria_name"
      pInputText
      type="text"
      formControlName="name"
      class="w-full text-responsive"
      [attr.aria-label]="'PARAMETER.NAME' | translate"
      [pTooltip]="'PARAMETER.TOOLTIPS.COMBINED_NAME' | translate"
      tooltipPosition="top"
      tooltipEvent="hover"
    />
    <label for="pam_usage_detail_criteria_name">{{ 'PARAMETER.NAME' | translate }}</label>
  </span>
  <span class="p-float-label flex-grow-1">
    <input
      id="pam_usage_detail_criteria_product_name"
      pInputText
      type="text"
      formControlName="productName"
      class="w-full text-responsive"
      [attr.aria-label]="'PARAMETER.PRODUCT_NAME' | translate"
      [pTooltip]="'PARAMETER.TOOLTIPS.PRODUCT_NAME' | translate"
      tooltipPosition="top"
      tooltipEvent="hover"
    />
    <label for="pam_usage_detail_criteria_product_name">{{ 'PARAMETER.PRODUCT_NAME' | translate }}</label>
  </span>
  <span class="p-float-label flex-grow-1">
    <input
      id="pam_usage_detail_criteria_application_id"
      pInputText
      type="text"
      formControlName="applicationId"
      class="w-full text-responsive"
      [attr.aria-label]="'PARAMETER.APP_NAME' | translate"
      [pTooltip]="'PARAMETER.TOOLTIPS.APP_NAME' | translate"
      tooltipPosition="top"
      tooltipEvent="hover"
    />
    <label for="pam_usage_detail_criteria_application_id">{{ 'PARAMETER.APP_NAME' | translate }}</label>
  </span>
</div>


```

### File: onecx-parameter-ui/src/app/parameter/usage-detail/usage-detail-criteria/usage-detail-criteria.component.spec.ts

```ts

import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'

import { UserService } from '@onecx/angular-integration-interface'

import { HistoryCriteria, Parameter } from 'src/app/shared/generated'
import { UsageDetailCriteriaComponent } from './usage-detail-criteria.component'
import { ExtendedHistory } from '../../usage-search/usage-search.component'

const parameter: Parameter = {
  id: 'pid',
  productName: 'prod1',
  applicationId: 'app1',
  name: 'name',
  displayName: 'displayName',
  value: 'value'
}

const history: ExtendedHistory = {
  id: 'pid',
  productName: 'prod1',
  applicationId: 'app1',
  name: 'name',
  usedValue: 'used value',
  defaultValue: 'default value',
  valueType: 'STRING',
  defaultValueType: 'STRING',
  displayUsedValue: '',
  displayDefaultValue: '',
  isEqual: 'FALSE'
}

describe('HistoryCriteriaComponent', () => {
  let component: UsageDetailCriteriaComponent
  let fixture: ComponentFixture<UsageDetailCriteriaComponent>

  const mockUserService = { lang$: { getValue: jasmine.createSpy('getValue') } }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UsageDetailCriteriaComponent],
      imports: [
        TranslateTestingModule.withTranslations({
          de: require('src/assets/i18n/de.json'),
          en: require('src/assets/i18n/en.json')
        }).withDefaultLanguage('en')
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: UserService, useValue: mockUserService }]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageDetailCriteriaComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    mockUserService.lang$.getValue.and.returnValue('de')
  })

  describe('construction', () => {
    it('should create', () => {
      expect(component).toBeTruthy()
      expect(component.criteriaForm).toBeDefined()
    })
  })

  describe('ngOnChange', () => {
    it('should fill form with parameter', () => {
      component.parameter = parameter
      const criteria: HistoryCriteria = {
        name: parameter.name,
        productName: parameter.productName,
        applicationId: parameter.applicationId
      }
      spyOn(component.criteriaEmitter, 'emit')

      component.ngOnChanges()

      expect(component.criteriaForm.value).toEqual(criteria)
      expect(component.criteriaEmitter.emit).toHaveBeenCalled()
    })
  })

  it('should fill form with history', () => {
    component.history = history
    const criteria: HistoryCriteria = {
      name: parameter.name,
      productName: parameter.productName,
      applicationId: parameter.applicationId
    }
    spyOn(component.criteriaEmitter, 'emit')

    component.ngOnChanges()

    expect(component.criteriaForm.value).toEqual(criteria)
    expect(component.criteriaEmitter.emit).toHaveBeenCalled()
  })
})


```

### File: onecx-parameter-ui/src/app/parameter/usage-detail/usage-detail-criteria/usage-detail-criteria.component.ts

```ts

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'

import { HistoryCriteria, Parameter } from 'src/app/shared/generated'
import { ExtendedHistory } from '../../usage-search/usage-search.component'

export interface CriteriaForm {
  name: FormControl<string | undefined>
  productName: FormControl<string | undefined>
  applicationId: FormControl<string | undefined>
}

@Component({
  selector: 'app-usage-detail-criteria',
  templateUrl: './usage-detail-criteria.component.html'
})
export class UsageDetailCriteriaComponent implements OnChanges {
  @Input() public history: ExtendedHistory | undefined = undefined
  @Input() public parameter: Parameter | undefined = undefined
  @Output() public criteriaEmitter = new EventEmitter<HistoryCriteria>()

  public criteriaForm: FormGroup<CriteriaForm>

  constructor(public readonly translate: TranslateService) {
    this.criteriaForm = new FormGroup<CriteriaForm>({
      name: new FormControl<string | undefined>({ value: undefined, disabled: true }, { nonNullable: true }),
      productName: new FormControl<string | undefined>({ value: undefined, disabled: true }, { nonNullable: true }),
      applicationId: new FormControl<string | undefined>({ value: undefined, disabled: true }, { nonNullable: true })
    })
  }

  public ngOnChanges(): void {
    if (this.history || this.parameter) {
      this.criteriaForm.setValue({
        name: this.parameter?.name ?? this.history?.name,
        productName: this.parameter?.productName ?? this.history?.productName,
        applicationId: this.parameter?.applicationId ?? this.history?.applicationId
      })
      const criteria: HistoryCriteria = {
        productName: this.criteriaForm.value.productName,
        applicationId: this.criteriaForm.value.applicationId,
        name: this.criteriaForm.value.name
      }
      this.criteriaEmitter.emit(criteria)
    }
  }
}


```

//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

## Folder: onecx-parameter-ui/src/app/parameter/usage-detail/usage-detail-list (3 files)

### File: onecx-parameter-ui/src/app/parameter/usage-detail/usage-detail-list/usage-detail-list.component.html

```html

<p-message
  *ngIf="loading"
  id="pam_usage_detail_message_loading"
  severity="info"
  styleClass="my-3"
  [text]="'ACTIONS.LOADING' | translate"
></p-message>
<p-message
  *ngIf="exceptionKey"
  id="pam_usage_detail_message_error"
  severity="error"
  styleClass="my-3"
  [text]="exceptionKey | translate"
></p-message>

<p-table
  *ngIf="!loading && !exceptionKey"
  #dataTable
  id="pam_usage_detail_list_table"
  styleClass=""
  [value]="data"
  dataKey="id"
  [columns]="filteredColumns"
  [reorderableColumns]="false"
  [scrollable]="true"
  scrollHeight="590px"
  expandableRows="true"
  [expandedRowKeys]="expandedRows"
  rowExpandMode="single"
  [rows]="10"
  [rowsPerPageOptions]="[10, 30, 100]"
  [paginator]="true"
  [alwaysShowPaginator]="true"
  paginatorPosition="bottom"
  [showCurrentPageReport]="true"
  currentPageReportTemplate="{first} - {last} {{ 'ACTIONS.SEARCH.OF' | translate }} {totalRecords}"
>
  <ng-template pTemplate="emptymessage">
    <tr>
      <td id="pam_usage_detail_list_table_emptymessage" colspan="16">{{ 'ACTIONS.SEARCH.NO_DATA' | translate }}</td>
    </tr>
  </ng-template>

  <ng-template pTemplate="header" let-columns>
    <tr>
      <th pFrozenColumn id="pam_usage_detail_table_header_actions" class="text-center white-space-nowrap">
        {{ 'ACTIONS.LABEL' | translate }}
      </th>
      <th
        *ngFor="let col of columns"
        [id]="'pam_usage_detail_list_table_header_col_' + col.field"
        class="white-space-nowrap"
        [class]="col.css"
        [pSortableColumn]="col.field"
        [attr.aria-label]="col.translationPrefix + '.' + col.header | translate"
        [pTooltip]="col.translationPrefix + '.TOOLTIPS.' + col.header | translate"
        tooltipPosition="top"
        tooltipEvent="hover"
      >
        <span>{{ col.translationPrefix + '.' + col.header | translate }}</span>
        <p-sortIcon *ngIf="col.sort" [field]="col.field"></p-sortIcon>
        <p-columnFilter *ngIf="col.hasFilter" type="text" [field]="col.field" display="menu"></p-columnFilter>
      </th>
    </tr>
  </ng-template>

  <ng-template pTemplate="body" let-rowData let-i="rowIndex" let-columns="columns" let-expanded="expanded">
    <tr [id]="'pam_usage_detail_table_row_' + i">
      <!-- actions -->
      <td pFrozenColumn class="align-items-center text-center white-space-nowrap">
        <p-button
          *ocxIfPermission="'USAGE#VIEW'"
          type="button"
          pRipple
          [id]="'pam_usage_detail_table_row_' + i + '_action_expand'"
          [pRowToggler]="rowData"
          [text]="true"
          [rounded]="true"
          [plain]="true"
          [icon]="expanded ? 'pi pi-eye-slash' : 'pi pi-eye'"
          [attr.aria-label]="'DIALOG.USAGE.DETAIL.LABEL' | translate"
          [pTooltip]="'DIALOG.USAGE.DETAIL.LABEL' | translate"
          tooltipPosition="top"
          tooltipEvent="hover"
        />
      </td>
      <td *ngFor="let col of columns" [id]="'pam_usage_detail_list_table_row_' + i + '_' + col.field" [class]="col.css">
        <!-- needs a div due to manage ellipsis -->
        <div
          *ngIf="col.isValue"
          class="text-ellipsis-2-lines"
          [attr.aria-label]="'VALUE_TYPE.' + rowData['valueType'] | translate"
          [pTooltip]="'VALUE_TYPE.' + rowData['valueType'] | translate"
          tooltipPosition="top"
          tooltipEvent="hover"
        >
          {{ rowData[col.field] }}
        </div>
        <span
          *ngIf="col.field === 'equal'"
          [ngClass]="
            rowData['isEqual'] === 'TRUE'
              ? 'pi pi-check text-green-600'
              : rowData['isEqual'] === 'FALSE'
                ? 'pi pi-times text-red-600'
                : ''
          "
          [attr.aria-label]="'PARAMETER.TOOLTIPS.EQUAL.' + rowData['isEqual'] | translate"
          [pTooltip]="'PARAMETER.TOOLTIPS.EQUAL.' + rowData['isEqual'] | translate"
          tooltipPosition="top"
          tooltipEvent="hover"
        >
          {{ rowData['isEqual'] === 'UNDEFINED' ? 'n.a.' : '' }}
        </span>

        <ng-container *ngIf="col.isText">{{ rowData[col.field] }}</ng-container>
        <ng-container *ngIf="col.isDate">{{ rowData[col.field] | date: dateFormat }}</ng-container>
        <ng-container *ngIf="col.isDuration">{{ onCalcDuration(rowData['start'], rowData['end']) }}</ng-container>
      </td>
    </tr>
  </ng-template>

  <ng-template pTemplate="rowexpansion" let-rowData let-index="rowIndex" let-columns="columns">
    <tr>
      <td></td>
      <td [attr.colspan]="columns.length">
        <div class="flex flex-row flex-wrap gap-4 justify-content-around align-items-start">
          <ng-container
            [ngTemplateOutlet]="historyDetailTemplate"
            [ngTemplateOutletContext]="{
              $implicit: rowData,
              data: {
                type: rowData.valueType,
                value: rowData.usedValue,
                labelKey: 'USAGE.USED_VALUE',
                tooltipKey: 'USAGE.TOOLTIPS.USED_VALUE'
              },
              index: index
            }"
          />
          <ng-container
            [ngTemplateOutlet]="historyDetailTemplate"
            [ngTemplateOutletContext]="{
              $implicit: rowData,
              data: {
                type: rowData.defaultValueType,
                value: rowData.defaultValue,
                labelKey: 'USAGE.DEFAULT_VALUE',
                tooltipKey: 'USAGE.TOOLTIPS.DEFAULT_VALUE'
              },
              index: index
            }"
          />
        </div>
      </td>
    </tr>
  </ng-template>
</p-table>

<ng-template #historyDetailTemplate let-data="data" let-index="index">
  <p-fieldset
    [toggleable]="false"
    [collapsed]="false"
    [styleClass]="'px-2 w-22rem' + (index % 2 === 1 ? ' surface-100' : '')"
    [style]="{ 'margin-top': '-0.5rem' }"
  >
    <ng-template pTemplate="header">{{ data.labelKey | translate }} </ng-template>

    <div class="mt-1 flex flex-row flex-wrap gap-3">
      <ng-container *ngIf="data.type === 'UNKNOWN'"> {{ 'PARAMETER.VALUE.EMPTY' | translate }} </ng-container>
      <ng-container *ngIf="data.type !== 'UNKNOWN'">
        <div [pTooltip]="'PARAMETER.TOOLTIPS.VALUE.TYPE.DETAIL' | translate" tooltipPosition="top" tooltipEvent="hover">
          {{ 'VALUE_TYPE.' + data.type | translate }}
        </div>

        <div class="flex-grow-1">
          <p-checkbox
            *ngIf="data.type === 'BOOLEAN'"
            type="text"
            [binary]="true"
            id="pam_usage_detail_form_value"
            styleClass="ml-3 cursor-auto shadow-none"
            [value]="data.value"
            [label]="'PARAMETER.VALUE' | translate"
            [pTooltip]="'PARAMETER.TOOLTIPS.VALUE' | translate"
            tooltipPosition="top"
            tooltipEvent="hover"
          ></p-checkbox>

          <span *ngIf="data.type !== 'BOOLEAN'" class="p-float-label">
            <input
              *ngIf="data.type !== 'OBJECT'"
              pInputText
              type="text"
              id="pam_usage_detail_form_value"
              class="mb-1 w-full pt-3 pb-2 text-responsive"
              [value]="data.value"
              [attr.aria-label]="'PARAMETER.VALUE' | translate"
              [pTooltip]="'PARAMETER.TOOLTIPS.VALUE' | translate"
              tooltipPosition="top"
              tooltipEvent="hover"
            />
            <textarea
              *ngIf="data.type === 'OBJECT'"
              pInputTextarea
              id="pam_usage_detail_form_value"
              class="w-full"
              [rows]="5"
              [value]="toJsonFormat(data.value)"
              [ariaLabel]="data.labelKey | translate"
              [pTooltip]="data.tooltipKey | translate"
              tooltipPosition="top"
              tooltipEvent="hover"
            >
            </textarea>
            <label *ngIf="data.type !== 'BOOLEAN'" for="pam_usage_detail_form_value">
              {{ 'PARAMETER.VALUE' | translate }}
            </label>
          </span>
        </div>
      </ng-container>
    </div>
  </p-fieldset>
</ng-template>


```

### File: onecx-parameter-ui/src/app/parameter/usage-detail/usage-detail-list/usage-detail-list.component.spec.ts

```ts

import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'

import { UserService } from '@onecx/angular-integration-interface'

import { UsageDetailListComponent } from './usage-detail-list.component'

describe('HistoryListComponent', () => {
  let component: UsageDetailListComponent
  let fixture: ComponentFixture<UsageDetailListComponent>

  const mockUserService = { lang$: { getValue: jasmine.createSpy('getValue') } }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UsageDetailListComponent],
      imports: [
        TranslateTestingModule.withTranslations({
          de: require('src/assets/i18n/de.json'),
          en: require('src/assets/i18n/en.json')
        }).withDefaultLanguage('en')
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: UserService, useValue: mockUserService }]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageDetailListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  describe('construction', () => {
    it('should create', () => {
      expect(component).toBeTruthy()
    })
  })

  describe('utility functions', () => {
    it('should calc duration - with both values', () => {
      const duration = component.onCalcDuration('2024-01-01T01:00:00Z', '2024-01-01T01:10:00Z')

      expect(duration).toBe('00:10:00')
    })

    it('should calc duration - with mission values', () => {
      const duration = component.onCalcDuration('', '2024-01-01T01:10:00Z')

      expect(duration).toBe('')
    })

    it('should calc duration - with mission values', () => {
      const duration = component.onCalcDuration('2024-01-01T01:00:00Z', '')

      expect(duration).toBe('')
    })

    it('should format JSON', () => {
      component.toJsonFormat('{ json: true}')
    })
  })
})


```

### File: onecx-parameter-ui/src/app/parameter/usage-detail/usage-detail-list/usage-detail-list.component.ts

```ts

import { Component, Input } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

import { Column } from '@onecx/portal-integration-angular'

import { Parameter } from 'src/app/shared/generated'
import { ExtendedHistory } from '../../usage-search/usage-search.component'

type ExtendedColumn = Column & {
  hasFilter?: boolean
  isBoolean?: boolean
  isDate?: boolean
  isDuration?: boolean
  isValue?: boolean
  isText?: boolean
  limit?: boolean
  sort?: boolean
  css?: string
}

@Component({
  selector: 'app-usage-detail-list',
  templateUrl: './usage-detail-list.component.html'
})
export class UsageDetailListComponent {
  @Input() public loading = false
  @Input() public exceptionKey: string | undefined = undefined
  @Input() public history: ExtendedHistory | undefined = undefined
  @Input() public parameter: Parameter | undefined = undefined
  @Input() public data: ExtendedHistory[] = []
  @Input() public dateFormat: string | undefined = undefined

  public item4Detail: ExtendedHistory | undefined = undefined
  public displayDetailDialog = false
  public expandedRows: { [s: string]: boolean } = {}
  public filteredColumns: Column[]
  public columns: ExtendedColumn[] = [
    {
      field: 'start',
      header: 'START',
      translationPrefix: 'USAGE',
      active: true,
      isDate: true,
      sort: true
    },
    {
      field: 'displayUsedValue',
      header: 'USED_VALUE',
      translationPrefix: 'USAGE',
      active: true,
      isValue: true,
      css: 'text-center'
    },
    {
      field: 'displayDefaultValue',
      header: 'DEFAULT_VALUE',
      translationPrefix: 'USAGE',
      active: true,
      isValue: true,
      css: 'text-center'
    },
    {
      field: 'equal',
      header: 'EQUAL',
      translationPrefix: 'USAGE',
      active: true,
      css: 'text-center'
    },
    {
      field: 'duration',
      header: 'DURATION',
      translationPrefix: 'USAGE',
      active: false,
      isDuration: true
    },
    {
      field: 'count',
      header: 'COUNT',
      translationPrefix: 'USAGE',
      active: true,
      isText: true,
      css: 'text-center'
    },
    {
      field: 'instanceId',
      header: 'INSTANCE_ID',
      translationPrefix: 'USAGE',
      active: true,
      isText: true,
      sort: true,
      css: 'text-center'
    },
    {
      field: 'creationDate',
      header: 'CREATION_DATE',
      translationPrefix: 'INTERNAL',
      active: false,
      isDate: true,
      sort: true
    }
  ]

  constructor(public readonly translate: TranslateService) {
    this.filteredColumns = this.columns.filter((a) => a.active === true)
  }

  public onCalcDuration(start: string, end: string): string {
    if (!start || start === '' || !end || end === '') return ''
    return new Date(Date.parse(end) - Date.parse(start)).toUTCString().split(' ')[4]
  }

  // display pretty JSON
  public toJsonFormat(val: any): any {
    return JSON.stringify(val, undefined, 2)
  }
}


```

//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

## Folder: onecx-parameter-ui/src/app/parameter/usage-search (3 files)

### File: onecx-parameter-ui/src/app/parameter/usage-search/usage-search.component.html

```html

<ocx-portal-page permission="USAGE#SEARCH" helpArticleId="PAGE_PARAMETER_USAGE">
  <!-- slot getting data from product store -->
  <ocx-slot
    *ngIf="isComponentDefined$ | async"
    [name]="slotName"
    [inputs]="{ dataType: 'products', logEnabled: false, logPrefix: 'parameter' }"
    [outputs]="{ products: slotEmitter }"
  >
  </ocx-slot>

  <ng-container *ngIf="metaData$ | async as metaData">
    <app-parameter-criteria
      type="USAGE"
      [actions]="actions"
      type="USAGE"
      [usedProducts]="metaData.usedProducts"
      (searchEmitter)="onSearch($event)"
      (resetSearchEmitter)="onCriteriaReset()"
    ></app-parameter-criteria>

    <ocx-page-content>
      <p-message
        *ngIf="exceptionKey || exceptionKeyMeta"
        id="pam_usage_search_message_error"
        severity="error"
        styleClass="m-3"
        [text]="exceptionKey ? (exceptionKey | translate) : (exceptionKeyMeta ?? '' | translate)"
      ></p-message>

      <ng-container *ngIf="data$ | async as data">
        <p-message
          *ngIf="loading"
          id="pam_usage_search_message_loading"
          severity="info"
          styleClass="m-3"
          [text]="'ACTIONS.LOADING' | translate"
        ></p-message>
        <p-table
          *ngIf="!(loading || exceptionKey)"
          #dataTable
          id="pam_usage_table"
          styleClass="mx-3 mb-2"
          [value]="data"
          [columns]="filteredColumns"
          dataKey="id"
          [globalFilterFields]="['productName', 'applicationId', 'name', 'displayName']"
          [reorderableColumns]="false"
          [scrollable]="true"
          scrollHeight="590px"
          [rows]="10"
          [rowsPerPageOptions]="[10, 30, 100]"
          [paginator]="true"
          [alwaysShowPaginator]="true"
          paginatorPosition="bottom"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="{first} - {last} {{ 'ACTIONS.SEARCH.OF' | translate }} {totalRecords}"
        >
          <ng-template pTemplate="caption">
            <ocx-data-view-controls
              [supportedViews]="['table']"
              [enableFiltering]="true"
              [enableSorting]="false"
              [columnDefinitions]="columns"
              (columnsChange)="onColumnsChange($event)"
              (filterChange)="onFilterChange($event)"
              [translations]="(dataViewControlsTranslations$ | async) ?? {}"
            ></ocx-data-view-controls>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td id="pam_usage_table_emptymessage" colspan="16">{{ 'ACTIONS.SEARCH.NO_DATA' | translate }}</td>
            </tr>
          </ng-template>

          <ng-template pTemplate="header" let-columns>
            <tr>
              <th pFrozenColumn id="pam_usage_table_header_actions" class="text-center white-space-nowrap">
                {{ 'ACTIONS.LABEL' | translate }}
              </th>
              <th
                *ngFor="let col of columns"
                [id]="'pam_usage_table_header_col_' + col.field"
                class="white-space-nowrap"
                [class]="col.css"
                [ngClass]="{ 'border-right-1': col.frozen }"
                pFrozenColumn
                [frozen]="col.frozen"
                [pSortableColumn]="col.field"
                [attr.aria-label]="col.translationPrefix + '.' + col.header | translate"
                [pTooltip]="col.translationPrefix + '.TOOLTIPS.' + col.header | translate"
                tooltipPosition="top"
                tooltipEvent="hover"
              >
                <span>{{ col.translationPrefix + '.' + col.header | translate }}</span>
                <p-sortIcon *ngIf="col.sort" [field]="col.field"></p-sortIcon>
                <p-columnFilter *ngIf="col.hasFilter" type="text" [field]="col.field" display="menu"></p-columnFilter>
              </th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-i="rowIndex" let-rowData let-columns="columns">
            <tr [pSelectableRow]="data">
              <!-- actions -->
              <td pFrozenColumn class="align-items-center text-center white-space-nowrap">
                <ng-container *ocxIfNotPermission="'PARAMETER#EDIT'">
                  <p-button
                    *ocxIfPermission="'PARAMETER#VIEW'"
                    type="button"
                    pRipple
                    [id]="'pam_usage_search_table_row_' + i + '_action_view'"
                    [text]="true"
                    [plain]="true"
                    [rounded]="true"
                    [icon]="'pi pi-eye'"
                    (click)="onDetail('VIEW', rowData, $event)"
                    [disabled]="!rowData.parameterId"
                    [attr.aria-label]="'ACTIONS.VIEW.LABEL' | translate"
                    [pTooltip]="'ACTIONS.VIEW.LABEL' | translate"
                    tooltipPosition="top"
                    tooltipEvent="hover"
                  />
                </ng-container>
                <p-button
                  *ocxIfPermission="'PARAMETER#EDIT'"
                  type="button"
                  pRipple
                  [id]="'pam_usage_search_table_row_' + i + '_action_edit'"
                  [text]="true"
                  [plain]="true"
                  [rounded]="true"
                  [icon]="'pi pi-pencil'"
                  (click)="onDetail('EDIT', rowData, $event)"
                  [disabled]="!rowData.parameterId"
                  [attr.aria-label]="'ACTIONS.EDIT.LABEL' | translate"
                  [pTooltip]="'ACTIONS.EDIT.LABEL' | translate"
                  tooltipPosition="top"
                  tooltipEvent="hover"
                />
                <p-button
                  *ocxIfPermission="'USAGE#VIEW'"
                  type="button"
                  pRipple
                  [id]="'pam_usage_search_table_row_' + i + '_action_usage'"
                  [text]="true"
                  [plain]="true"
                  [rounded]="true"
                  [icon]="'pi pi-history'"
                  (click)="onUsage($event, rowData)"
                  [attr.aria-label]="'DIALOG.NAVIGATION.DETAIL_USAGE.LABEL' | translate"
                  [pTooltip]="'DIALOG.NAVIGATION.DETAIL_USAGE.LABEL' | translate"
                  tooltipPosition="top"
                  tooltipEvent="hover"
                />
              </td>
              <td
                *ngFor="let col of columns"
                [id]="'pam_usage_table_row_' + i + '_' + col.field"
                [class]="col.css"
                [ngClass]="{ 'border-right-1': col.frozen }"
                pFrozenColumn
                [frozen]="col.frozen"
              >
                <!-- needs a div due to manage ellipsis -->
                <div
                  *ngIf="col.field === 'name'"
                  class="text-ellipsis-2-lines max-w-15rem word-break-all"
                  [ngStyle]="{ 'min-width': (rowData['name'] ?? '').length > 15 ? '8rem' : '' }"
                >
                  {{ rowData['name'] }}
                </div>

                @let isUnknown = [rowData['valueType'], rowData['defaultValueType']].includes('UNKNOWN');
                <span
                  *ngIf="col.field === 'valueType'"
                  [pTooltip]="isUnknown ? ('VALUE_TYPE.UNKNOWN.TOOLTIP' | translate) : ''"
                  tooltipPosition="top"
                  tooltipEvent="hover"
                >
                  {{ 'VALUE_TYPE.' + rowData['valueType'] | translate }}
                  <ng-container *ngIf="rowData['valueType'] !== rowData['defaultValueType']">
                    | {{ 'VALUE_TYPE.' + rowData['defaultValueType'] | translate }}
                  </ng-container>
                </span>

                <span
                  *ngIf="col.field === 'equal'"
                  [ngClass]="
                    rowData['isEqual'] === 'TRUE'
                      ? 'pi pi-check text-green-600'
                      : rowData['isEqual'] === 'FALSE'
                        ? 'pi pi-times text-red-600'
                        : ''
                  "
                  [attr.aria-label]="'PARAMETER.TOOLTIPS.EQUAL.' + rowData['isEqual'] | translate"
                  [pTooltip]="'PARAMETER.TOOLTIPS.EQUAL.' + rowData['isEqual'] | translate"
                  tooltipPosition="top"
                  tooltipEvent="hover"
                >
                  {{ rowData['isEqual'] === 'UNDEFINED' ? 'n.a.' : '' }}
                </span>

                <div
                  *ngIf="col.isValue"
                  class="text-ellipsis-2-lines max-w-20rem word-break-all"
                  [ngStyle]="{
                    'min-width': (rowData[col.field] ?? '').length > 15 ? '10rem' : ''
                  }"
                >
                  {{ rowData[col.field] }}
                </div>

                <!-- product & app -->
                <ng-container *ngIf="col.field === 'applicationName'">
                  {{ getProductDisplayName(rowData['productName'], metaData.allProducts) }}
                  <br />
                  {{ getAppDisplayName(rowData['productName'], rowData['applicationId'], metaData.allProducts) }}
                </ng-container>

                <!-- special formats -->
                <ng-container *ngIf="col.isText">{{ rowData[col.field] }}</ng-container>
                <ng-container *ngIf="col.isBoolean">
                  <span *ngIf="rowData[col.field]" class="pi pi-check"></span>
                </ng-container>
                <ng-container *ngIf="col.isDate">{{ rowData[col.field] | date: dateFormat }}</ng-container>
                <ng-container *ngIf="col.isDuration">
                  {{ onCalcDuration(rowData['start'], rowData['end']) }}
                </ng-container>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </ng-container>
      <!-- DETAIL -->
      <app-parameter-detail
        [displayDialog]="displayDetailDialog"
        (hideDialogAndChanged)="onCloseDetail($event)"
        [parameter]="{ id: item4Detail?.parameterId }"
        [allProducts]="metaData.allProducts"
        [changeMode]="changeMode"
        [dateFormat]="dateFormat"
      ></app-parameter-detail>
    </ocx-page-content>
  </ng-container>
</ocx-portal-page>

<app-usage-detail
  [displayDialog]="displayUsageDialog"
  (hideDialog)="onCloseUsage()"
  [history]="item4Detail"
  [dateFormat]="dateFormat"
></app-usage-detail>


```

### File: onecx-parameter-ui/src/app/parameter/usage-search/usage-search.component.spec.ts

```ts

import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideRouter, Router, ActivatedRoute } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { of, throwError } from 'rxjs'

import { PortalMessageService, UserService } from '@onecx/angular-integration-interface'
import { Column } from '@onecx/portal-integration-angular'

import { History, HistoriesAPIService, Product } from 'src/app/shared/generated'
import {
  ApplicationAbstract,
  ExtendedHistory,
  ExtendedProduct,
  UsageSearchComponent,
  ProductAbstract
} from './usage-search.component'
import { ParameterSearchComponent } from '../parameter-search/parameter-search.component'

// response data of parameter search service
const historyRespData: History[] = [
  {
    id: 'id0',
    productName: 'product1',
    applicationId: 'app1',
    name: 'name0',
    usedValue: 'Val',
    defaultValue: 'Val',
    start: '2024-01-01T00:00:00Z',
    end: '2024-01-01T00:10:00Z'
  },
  {
    id: 'id1',
    productName: 'product1',
    applicationId: 'app1',
    name: 'name1',
    usedValue: 1234,
    defaultValue: true,
    start: '2024-01-01T00:20:00Z',
    end: '2024-01-01T00:25:00Z'
  },
  {
    id: 'id2',
    productName: 'product1',
    applicationId: 'app1',
    name: 'name2',
    usedValue: { hallo: 'test', hi: 'all' },
    defaultValue: { hallo: 'test' },
    start: '2024-01-01T00:20:00Z',
    end: '2024-01-01T00:25:00Z'
  },
  {
    id: 'id3',
    productName: 'product1',
    applicationId: 'app1',
    name: 'name3',
    usedValue: { hallo: 'test', hi: 'all' },
    start: '2024-01-01T00:20:00Z',
    end: '2024-01-01T00:25:00Z'
  },
  {
    id: 'id4',
    productName: 'product1',
    applicationId: 'app1',
    name: 'no data',
    start: '2024-01-01T00:20:00Z',
    end: '2024-01-01T00:25:00Z'
  },
  {
    id: 'id5',
    productName: 'product1',
    applicationId: 'app1',
    name: 'boolean comparison',
    usedValue: false,
    defaultValue: false,
    start: '2024-01-01T00:20:00Z',
    end: '2024-01-01T00:25:00Z'
  }
]
const historyData: ExtendedHistory[] = [
  {
    ...historyRespData[0],
    valueType: 'STRING',
    defaultValueType: 'STRING',
    displayUsedValue: 'Val',
    displayDefaultValue: 'Val',
    isEqual: 'TRUE'
  },
  {
    ...historyRespData[1],
    valueType: 'NUMBER',
    defaultValueType: 'BOOLEAN',
    displayUsedValue: '1234',
    displayDefaultValue: 'true',
    isEqual: 'FALSE'
  },
  {
    ...historyRespData[2],
    valueType: 'OBJECT',
    defaultValueType: 'OBJECT',
    displayUsedValue: '{ ... }',
    displayDefaultValue: '{ ... }',
    isEqual: 'FALSE'
  },
  {
    ...historyRespData[3],
    valueType: 'OBJECT',
    defaultValueType: 'UNKNOWN',
    displayUsedValue: '{ ... }',
    displayDefaultValue: '',
    isEqual: 'FALSE'
  },
  {
    ...historyRespData[4],
    valueType: 'UNKNOWN',
    defaultValueType: 'UNKNOWN',
    displayUsedValue: '',
    displayDefaultValue: '',
    isEqual: 'UNDEFINED'
  },
  {
    ...historyRespData[5],
    valueType: 'BOOLEAN',
    defaultValueType: 'BOOLEAN',
    displayUsedValue: 'false',
    displayDefaultValue: 'false',
    isEqual: 'TRUE'
  }
]
// Original form BFF: unsorted and not complete
const usedProductsOrg: Product[] = [
  { productName: 'product2', displayName: undefined, applications: ['app2-svc'] },
  { productName: 'product1', displayName: undefined, applications: ['app1-svc'] }
]
const app1: ApplicationAbstract = {
  appId: 'app1-svc',
  appName: 'OneCX app svc 1',
  undeployed: false,
  deprecated: false
}
const app2: ApplicationAbstract = {
  appId: 'app2-svc',
  appName: 'OneCX app svc 2',
  undeployed: false,
  deprecated: false
}
// product store products
const allProductsOrg: ProductAbstract[] = [
  { name: 'product1', displayName: 'Product 1', undeployed: false, applications: [app1] },
  { name: 'product2', displayName: 'Product 2', undeployed: true, applications: [app2] },
  { name: 'product3', displayName: 'Product 3', applications: [{ appId: 'app3-svc' }, { appId: 'app3-bff' }] },
  { name: 'product4', displayName: 'Product 4', applications: [{ appId: 'app4-svc' }, { appId: 'app4-bff' }] },
  { name: 'product5' }
]
const allProducts: ExtendedProduct[] = [
  { name: 'product1', displayName: 'Product 1', undeployed: false, applications: [app1] },
  { name: 'product2', displayName: 'Product 2', undeployed: true, applications: [app2] },
  { name: 'product3', displayName: 'Product 3', applications: [{ appId: 'app3-svc' }, { appId: 'app3-bff' }] },
  { name: 'product4', displayName: 'Product 4', applications: [{ appId: 'app4-svc' }, { appId: 'app4-bff' }] },
  { name: 'product5', displayName: 'product5', applications: [] }
]

describe('UsageSearchComponent', () => {
  let component: UsageSearchComponent
  let fixture: ComponentFixture<UsageSearchComponent>
  const routerSpy = jasmine.createSpyObj('router', ['navigate'])
  const routeMock = { snapshot: { paramMap: new Map() } }

  const mockUserService = { lang$: { getValue: jasmine.createSpy('getValue') } }
  const msgServiceSpy = jasmine.createSpyObj<PortalMessageService>('PortalMessageService', ['success', 'error', 'info'])
  const historyApiSpy = {
    getAllHistoryLatest: jasmine.createSpy('getAllHistoryLatest').and.returnValue(of([])),
    getAllHistoryProducts: jasmine.createSpy('getAllHistoryProducts').and.returnValue(of([]))
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UsageSearchComponent],
      imports: [
        TranslateTestingModule.withTranslations({
          de: require('src/assets/i18n/de.json'),
          en: require('src/assets/i18n/en.json')
        }).withDefaultLanguage('en')
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: '', component: ParameterSearchComponent }]),
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: UserService, useValue: mockUserService },
        { provide: PortalMessageService, useValue: msgServiceSpy },
        { provide: HistoriesAPIService, useValue: historyApiSpy }
      ]
    }).compileComponents()
    msgServiceSpy.success.calls.reset()
    msgServiceSpy.error.calls.reset()
    msgServiceSpy.info.calls.reset()
    mockUserService.lang$.getValue.and.returnValue('de')
    // reset data services
    historyApiSpy.getAllHistoryLatest.calls.reset()
    historyApiSpy.getAllHistoryProducts.calls.reset()
    // to spy data: refill with neutral data
    historyApiSpy.getAllHistoryLatest.and.returnValue(of({}))
    historyApiSpy.getAllHistoryProducts.and.returnValue(of([]))
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageSearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  describe('construction', () => {
    it('should create', () => {
      expect(component).toBeTruthy()
    })

    it('should call OnInit and populate filteredColumns/actions correctly', () => {
      component.ngOnInit()
      expect(component.filteredColumns[0]).toEqual(component.columns[0])
    })

    it('dataview translations', (done) => {
      const translationData = {
        'DIALOG.DATAVIEW.FILTER': 'filter'
      }
      const translateService = TestBed.inject(TranslateService)
      spyOn(translateService, 'get').and.returnValue(of(translationData))

      component.ngOnInit()

      component.dataViewControlsTranslations$?.subscribe({
        next: (data) => {
          if (data) {
            expect(data.filterInputPlaceholder).toEqual('filter')
          }
          done()
        },
        error: done.fail
      })
    })
  })

  describe('page actions', () => {
    it('should go to parameter search', () => {
      spyOn(component, 'onGoToParameterSearchPage')

      component.ngOnInit()
      component.actions[0].actionCallback()

      expect(component.onGoToParameterSearchPage).toHaveBeenCalled()
    })
  })

  describe('search', () => {
    it('should search parameters without search criteria', (done) => {
      historyApiSpy.getAllHistoryLatest.and.returnValue(of({ stream: historyRespData }))

      component.onSearch({})

      component.data$?.subscribe({
        next: (data) => {
          expect(data).toEqual(historyData)
          done()
        },
        error: done.fail
      })
    })

    it('should display an info message if there is no result', (done) => {
      historyApiSpy.getAllHistoryLatest.and.returnValue(of({ totalElements: 0, stream: [] }))

      component.onSearch({})

      component.data$?.subscribe({
        next: (data) => {
          expect(data.length).toEqual(0)
          expect(msgServiceSpy.info).toHaveBeenCalledOnceWith({ summaryKey: 'ACTIONS.SEARCH.MESSAGE.NO_RESULTS' })
          done()
        },
        error: done.fail
      })
    })

    it('should display an error message if the search fails', (done) => {
      const errorResponse = { status: '403', statusText: 'Not authorized' }
      historyApiSpy.getAllHistoryLatest.and.returnValue(throwError(() => errorResponse))
      spyOn(console, 'error')

      component.onSearch({})

      component.data$?.subscribe({
        next: (data) => {
          expect(data).toEqual([])
          done()
        },
        error: () => {
          expect(msgServiceSpy.error).toHaveBeenCalledWith({ summaryKey: 'ACTIONS.SEARCH.MESSAGE.SEARCH_FAILED' })
          expect(console.error).toHaveBeenCalledWith('getAllHistoryLatest', errorResponse)
          done.fail
        }
      })
    })
  })

  /**
   * META data: which were assigned to data
   */
  describe('service data', () => {
    it('should get products which are assigned to data', (done) => {
      historyApiSpy.getAllHistoryProducts.and.returnValue(of(usedProductsOrg))

      component.ngOnInit()

      component.usedProducts$?.subscribe({
        next: (data) => {
          expect(data).toEqual(usedProductsOrg)
          done()
        },
        error: done.fail
      })
    })

    it('should get all products assigned to', (done) => {
      const errorResponse = { status: '404', statusText: 'An error occur' }
      historyApiSpy.getAllHistoryProducts.and.returnValue(throwError(() => errorResponse))
      spyOn(console, 'error')

      component.ngOnInit()

      component.usedProducts$?.subscribe({
        next: (data) => {
          expect(data).toEqual([])
          done()
        },
        error: () => {
          expect(console.error).toHaveBeenCalledOnceWith('getAllHistoryProducts', errorResponse)
          done.fail
        }
      })
    })
  })

  describe('META data', () => {
    it('should get product store products - successful', (done) => {
      component.slotEmitter.emit(allProductsOrg)
      historyApiSpy.getAllHistoryProducts.and.returnValue(of(usedProductsOrg))

      component.ngOnInit()

      component.usedProducts$?.subscribe({
        next: (data) => {
          expect(data).toEqual(usedProductsOrg)
          done()
        },
        error: done.fail
      })
    })
  })

  /*
   * UI ACTIONS
   */
  describe('detail actions', () => {
    it('should prepare the creation of a new parameter', () => {
      const ev: MouseEvent = new MouseEvent('type')
      spyOn(ev, 'stopPropagation')
      const mode = 'CREATE'

      component.onDetail(mode, undefined, ev)

      expect(ev.stopPropagation).toHaveBeenCalled()
      expect(component.changeMode).toEqual(mode)
      expect(component.item4Detail).toBe(undefined)
      expect(component.displayDetailDialog).toBeTrue()

      component.onCloseDetail(false)

      expect(component.displayDetailDialog).toBeFalse()
    })

    it('should show details of a parameter', () => {
      const mode = 'EDIT'

      component.onDetail(mode, historyData[0])

      expect(component.changeMode).toEqual(mode)
      expect(component.item4Detail).toBe(historyData[0])
      expect(component.displayDetailDialog).toBeTrue()
    })

    it('should prepare the copy of a parameter', () => {
      const mode = 'COPY'

      component.onDetail(mode, historyData[0])

      expect(component.changeMode).toEqual(mode)
      expect(component.item4Detail).toBe(historyData[0])
      expect(component.displayDetailDialog).toBeTrue()

      component.onCloseDetail(true)

      expect(component.displayDetailDialog).toBeFalse()
    })
  })

  describe('filter columns', () => {
    it('should update the columns that are seen in data', () => {
      const columns: Column[] = [
        { field: 'productName', header: 'PRODUCT_NAME' },
        { field: 'description', header: 'DESCRIPTION' }
      ]
      const expectedColumn = { field: 'productName', header: 'PRODUCT_NAME' }
      component.columns = columns

      component.onColumnsChange(['productName'])

      expect(component.filteredColumns).not.toContain(columns[1])
      expect(component.filteredColumns).toEqual([jasmine.objectContaining(expectedColumn)])
    })

    it('should apply a filter to the result table', () => {
      component.dataTable = jasmine.createSpyObj('dataTable', ['filterGlobal'])

      component.onFilterChange('test')

      expect(component.dataTable?.filterGlobal).toHaveBeenCalledWith('test', 'contains')
    })
  })

  describe('display names', () => {
    it('should get product display name - found', () => {
      const name = component.getProductDisplayName(allProducts[0].name, allProducts)

      expect(name).toBe(allProducts[0].displayName)
    })

    it('should get product display name - not found', () => {
      const name = component.getProductDisplayName('unknown', allProducts)

      expect(name).toBe('unknown')
    })

    it('should get app display name - found', () => {
      const ap = allProducts[0]
      const apps = ap.applications
      const app = apps[0]
      const name = component.getAppDisplayName(allProducts[0].name, app.appId, allProducts)

      expect(name).toBe(app.appName)
    })

    it('should get product display name - not found', () => {
      const name = component.getAppDisplayName(allProducts[2].name, 'unknown', allProducts)

      expect(name).toBe('unknown')
    })
  })

  describe('onUsage', () => {
    it('should stop event propagation, set parameter, and display history dialog', () => {
      const event = new MouseEvent('click')
      spyOn(event, 'stopPropagation')

      component.onUsage(event, historyData[0])

      expect(event.stopPropagation).toHaveBeenCalled()
      expect(component.item4Detail).toEqual(historyData[0])
      expect(component.displayUsageDialog).toBeTrue()
    })

    it('should hide the history dialog', () => {
      component.displayUsageDialog = true

      component.onCloseUsage()

      expect(component.displayUsageDialog).toBeFalse()
    })
  })

  describe('onCriteriaReset', () => {
    it('should reset criteria, reset the form group, and disable the applicationId control', () => {
      component.criteria = { name: 'name' }

      component.onCriteriaReset()

      expect(component.criteria).toEqual({})
    })
  })

  it('should navigate back onBack', () => {
    component.onGoToParameterSearchPage()

    expect(routerSpy.navigate).toHaveBeenCalledWith(['../'], { relativeTo: routeMock })
  })

  /**
   * Language tests
   */
  describe('Language tests', () => {
    it('should set a German date format', () => {
      expect(component.dateFormat).toEqual('dd.MM.yyyy HH:mm:ss')
    })

    it('should set default date format', () => {
      mockUserService.lang$.getValue.and.returnValue('en')
      fixture = TestBed.createComponent(UsageSearchComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
      expect(component.dateFormat).toEqual('M/d/yy, hh:mm:ss a')
    })
  })

  /**
   * Utility tests
   */
  describe('utility functions', () => {
    it('should calc duration - with both values', () => {
      const duration = component.onCalcDuration('2024-01-01T01:00:00Z', '2024-01-01T01:10:00Z')

      expect(duration).toBe('00:10:00')
    })

    it('should calc duration - with mission values', () => {
      const duration = component.onCalcDuration('', '2024-01-01T01:10:00Z')

      expect(duration).toBe('')
    })

    it('should calc duration - with mission values', () => {
      const duration = component.onCalcDuration('2024-01-01T01:00:00Z', '')

      expect(duration).toBe('')
    })
  })
})


```

### File: onecx-parameter-ui/src/app/parameter/usage-search/usage-search.component.ts

```ts

import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { BehaviorSubject, catchError, combineLatest, finalize, map, tap, Observable, of, ReplaySubject } from 'rxjs'
import { Table } from 'primeng/table'

import { PortalMessageService, UserService } from '@onecx/angular-integration-interface'
import { Action, Column, DataViewControlTranslations } from '@onecx/portal-integration-angular'
import { SlotService } from '@onecx/angular-remote-components'

import {
  History,
  HistoriesAPIService,
  HistoryPageResult,
  ParameterSearchCriteria,
  Product
} from 'src/app/shared/generated'
import { displayEqualityState, displayValue, displayValueType, sortByDisplayName } from 'src/app/shared/utils'

export type ChangeMode = 'VIEW' | 'COPY' | 'CREATE' | 'EDIT'
type ExtendedColumn = Column & {
  hasFilter?: boolean
  isBoolean?: boolean
  isDate?: boolean
  isDuration?: boolean
  isValue?: boolean
  isText?: boolean
  limit?: boolean
  frozen?: boolean
  sort?: boolean
  css?: string
}
export type ExtendedHistory = History & {
  valueType: string
  defaultValueType: string
  displayUsedValue: string
  displayDefaultValue: string
  isEqual: string
}
export type ExtendedProduct = {
  name: string
  displayName: string
  applications: Array<ApplicationAbstract>
  undeployed?: boolean
}
type AllMetaData = {
  allProducts: ExtendedProduct[]
  usedProducts: ExtendedProduct[]
}
// DATA structures of product store response
export type ApplicationAbstract = {
  appName?: string
  appId?: string
  undeployed?: boolean
  deprecated?: boolean
}
export type ProductAbstract = {
  id?: string
  name: string
  version?: string
  description?: string
  imageUrl?: string
  displayName?: string
  classifications?: Array<string>
  undeployed?: boolean
  provider?: string
  applications?: Array<ApplicationAbstract>
}

@Component({
  selector: 'app-usage-search',
  templateUrl: './usage-search.component.html',
  styleUrls: ['./usage-search.component.scss']
})
export class UsageSearchComponent implements OnInit {
  // dialog
  public loading = false
  public exceptionKey: string | undefined = undefined
  public exceptionKeyMeta: string | undefined = undefined
  public changeMode: ChangeMode = 'VIEW'
  public dateFormat: string
  public refreshUsedProducts = false
  public displayDetailDialog = false
  public displayUsageDialog = false
  public actions: Action[] = []
  public sortByDisplayName = sortByDisplayName

  @ViewChild('dataTable', { static: false }) dataTable: Table | undefined
  public dataViewControlsTranslations$: Observable<DataViewControlTranslations> | undefined

  // data
  public data$: Observable<ExtendedHistory[]> | undefined
  public criteria: ParameterSearchCriteria = {}
  public metaData$!: Observable<AllMetaData>
  public usedProducts$ = new ReplaySubject<Product[]>(1) // getting data from bff endpoint
  public itemId: string | undefined // used on detail
  public item4Detail: ExtendedHistory | undefined
  public item4Delete: History | undefined // used on deletion
  // slot configuration: get product infos via remote component
  public slotName = 'onecx-product-data'
  public isComponentDefined$: Observable<boolean> | undefined // check
  public productData$ = new BehaviorSubject<ProductAbstract[] | undefined>(undefined) // product data
  public slotEmitter = new EventEmitter<ProductAbstract[]>()

  public filteredColumns: Column[] = []
  public columns: ExtendedColumn[] = [
    {
      field: 'name',
      header: 'COMBINED_NAME',
      translationPrefix: 'PARAMETER',
      active: true,
      limit: false,
      frozen: true,
      sort: true,
      css: 'word-break-all'
    },
    {
      field: 'displayUsedValue',
      header: 'USED_VALUE',
      translationPrefix: 'USAGE',
      active: true,
      isValue: true,
      css: 'text-center word-break-all'
    },
    {
      field: 'displayDefaultValue',
      header: 'DEFAULT_VALUE',
      translationPrefix: 'USAGE',
      active: true,
      isValue: true,
      css: 'text-center word-break-all'
    },
    {
      field: 'valueType',
      translationPrefix: 'PARAMETER',
      header: 'VALUE.TYPE',
      active: true,
      isValue: false,
      css: 'text-center'
    },
    {
      field: 'equal',
      header: 'EQUAL',
      translationPrefix: 'USAGE',
      active: true,
      css: 'text-center'
    },
    {
      field: 'start',
      header: 'START',
      translationPrefix: 'USAGE',
      active: true,
      isDate: true,
      sort: true
    },
    {
      field: 'duration',
      header: 'DURATION',
      translationPrefix: 'USAGE',
      active: true,
      isDuration: true
    },
    {
      field: 'count',
      header: 'COUNT',
      translationPrefix: 'USAGE',
      active: true,
      isText: true,
      css: 'text-center'
    },
    {
      field: 'applicationName',
      header: 'APP_NAME',
      translationPrefix: 'PARAMETER',
      active: true,
      sort: true
    },
    {
      field: 'instanceId',
      header: 'INSTANCE_ID',
      translationPrefix: 'USAGE',
      active: true,
      isText: true,
      sort: true,
      css: 'text-center'
    }
  ]

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly user: UserService,
    private readonly slotService: SlotService,
    private readonly translate: TranslateService,
    private readonly msgService: PortalMessageService,
    private readonly historyApi: HistoriesAPIService
  ) {
    this.dateFormat = this.user.lang$.getValue() === 'de' ? 'dd.MM.yyyy HH:mm:ss' : 'M/d/yy, hh:mm:ss a'
    this.filteredColumns = this.columns.filter((a) => a.active === true)
    this.isComponentDefined$ = this.slotService.isSomeComponentDefinedForSlot(this.slotName)
  }

  public ngOnInit(): void {
    this.slotEmitter.subscribe(this.productData$)
    this.onReload()
    this.getMetaData() // and trigger search
    this.prepareDialogTranslations()
    this.preparePageActions()
  }

  private onReload(): void {
    this.getUsedProducts()
    this.onSearch({}, true)
  }

  /****************************************************************************
   * GET DATA
   */
  // get used products (used === assigned to data)
  private getUsedProducts() {
    this.historyApi
      .getAllHistoryProducts()
      .pipe(
        catchError((err) => {
          this.exceptionKeyMeta = 'EXCEPTIONS.HTTP_STATUS_' + err.status + '.PRODUCTS'
          console.error('getAllHistoryProducts', err)
          return of([])
        })
      )
      .subscribe((v) => this.usedProducts$.next(v))
  }

  // combine used products with product data from product store
  private getMetaData() {
    this.exceptionKeyMeta = undefined
    // combine all product data and used products to one meta data structure
    this.metaData$ = combineLatest([this.productData$, this.usedProducts$]).pipe(
      map(([aP, uP]: [ProductAbstract[] | undefined, Product[]]) => {
        return this.combineProducts(
          this.convertProductAbstract2ExtendedProduct(aP),
          this.convertProduct2ExtendedProduct(uP)
        )
      })
    )
  }
  /****************************************************************************
   * HELPER
   */
  // map:  ProductAbstract[] => ExtendedProduct[]
  private convertProductAbstract2ExtendedProduct(aP: ProductAbstract[] | undefined): ExtendedProduct[] {
    const aps: ExtendedProduct[] = []
    if (aP && aP.length > 0) {
      aP.forEach((p) =>
        aps.push({
          name: p.name,
          displayName: p.displayName ?? p.name,
          undeployed: p.undeployed,
          applications: p.applications ?? []
        })
      )
      aps.sort(this.sortByDisplayName)
    }
    return aps
  }
  // map:  Product[] => ExtendedProduct[]
  private convertProduct2ExtendedProduct(uP: Product[]): ExtendedProduct[] {
    const ups: ExtendedProduct[] = []
    uP.forEach((p) => {
      const apps: ApplicationAbstract[] = []
      p.applications?.forEach((s) => {
        apps.push({ appName: s, appId: s } as ApplicationAbstract)
      })
      ups.push({ name: p.productName, displayName: p.productName, applications: apps } as ExtendedProduct)
    })
    ups.sort(this.sortByDisplayName)
    return ups
  }

  private combineProducts(aP: ExtendedProduct[], uP: ExtendedProduct[]): AllMetaData {
    // convert/enrich used products if product data are available
    console.log('combineProducts', aP, uP)
    if (aP && uP && uP.length > 0) {
      uP.forEach((p) => {
        const pi = aP.find((ap) => ap.name === p.name) // get product data
        if (pi) {
          p.displayName = pi.displayName!
          p.undeployed = pi.undeployed
          // collect apps: only used
          const uApps: ApplicationAbstract[] = []
          p.applications?.forEach((papp) => {
            // app still exists?
            const app = pi.applications?.find((app) => app.appId === papp.appId)
            if (app) uApps.push(app)
          })
          p.applications = uApps
        }
      })
      uP.sort(this.sortByDisplayName)
    }
    // if service is not running or product data are not yet available
    if (aP.length === 0) aP = uP
    return { allProducts: aP, usedProducts: [...uP] } // meta data
  }

  /****************************************************************************
   *  SEARCH data
   */
  public onSearch(criteria: ParameterSearchCriteria, reuseCriteria = false): void {
    this.loading = true
    this.exceptionKey = undefined
    if (!reuseCriteria) this.criteria = { ...criteria }
    this.data$ = this.historyApi.getAllHistoryLatest({ historyCriteria: { ...this.criteria } }).pipe(
      tap((data: any) => {
        if (data.totalElements === 0) {
          this.msgService.info({ summaryKey: 'ACTIONS.SEARCH.MESSAGE.NO_RESULTS' })
          return data.size
        }
      }),
      map((data: HistoryPageResult) => {
        if (!data.stream) return [] as ExtendedHistory[]
        return data.stream.map(
          (h) =>
            ({
              ...h,
              valueType: displayValueType(h.usedValue),
              defaultValueType: displayValueType(h.defaultValue),
              displayDefaultValue: displayValue(h.defaultValue),
              displayUsedValue: displayValue(h.usedValue),
              isEqual: displayEqualityState(h.usedValue, h.defaultValue)
            }) as ExtendedHistory
        )
      }),
      catchError((err) => {
        this.exceptionKey = 'EXCEPTIONS.HTTP_STATUS_' + err.status + '.PARAMETER'
        console.error('getAllHistoryLatest', err)
        return of([] as ExtendedHistory[])
      }),
      finalize(() => (this.loading = false))
    )
  }

  /**
   * Dialog preparation
   */
  private prepareDialogTranslations(): void {
    this.dataViewControlsTranslations$ = this.translate
      .get([
        'PARAMETER.PRODUCT_NAME',
        'PARAMETER.APP_ID',
        'PARAMETER.NAME',
        'PARAMETER.DISPLAY_NAME',
        'DIALOG.DATAVIEW.FILTER'
      ])
      .pipe(
        map((data) => {
          return {
            filterInputPlaceholder: data['DIALOG.DATAVIEW.FILTER'],
            filterInputTooltip:
              data['PARAMETER.PRODUCT_NAME'] +
              ', ' +
              data['PARAMETER.APP_ID'] +
              ', ' +
              data['PARAMETER.DISPLAY_NAME'] +
              ', ' +
              data['PARAMETER.NAME']
          } as DataViewControlTranslations
        })
      )
  }

  public preparePageActions(): void {
    this.actions = [
      {
        labelKey: 'DIALOG.NAVIGATION.SEARCH.LABEL',
        titleKey: 'DIALOG.NAVIGATION.SEARCH.TOOLTIP',
        actionCallback: () => this.onGoToParameterSearchPage(),
        icon: 'pi pi-list',
        show: 'always'
      }
    ]
  }

  /****************************************************************************
   *  UI Events
   */
  public onCriteriaReset(): void {
    this.criteria = {}
  }

  public onGoToParameterSearchPage() {
    this.router.navigate(['../'], { relativeTo: this.route })
  }

  // Detail => CREATE, COPY, EDIT, VIEW
  public onDetail(mode: ChangeMode, item: ExtendedHistory | undefined, ev?: Event): void {
    ev?.stopPropagation()
    this.changeMode = mode
    this.item4Detail = item // do not manipulate this item here
    this.displayDetailDialog = true
  }
  public onCloseDetail(refresh: boolean): void {
    this.displayDetailDialog = false
    this.itemId = undefined
    if (refresh) {
      this.onReload()
    }
  }

  // History
  public onUsage(ev: Event, item: ExtendedHistory) {
    ev.stopPropagation()
    this.item4Detail = item
    this.displayUsageDialog = true
  }
  public onCloseUsage() {
    this.displayUsageDialog = false
    this.item4Detail = undefined
  }

  public onColumnsChange(activeIds: string[]) {
    this.filteredColumns = activeIds.map((id) => this.columns.find((col) => col.field === id)) as Column[]
  }

  public onFilterChange(event: string): void {
    this.dataTable?.filterGlobal(event, 'contains')
  }

  // getting display names within HTML
  public getProductDisplayName(name: string | undefined, allProducts: ExtendedProduct[]): string | undefined {
    return allProducts.find((item) => item.name === name)?.displayName ?? name
  }
  public getAppDisplayName(
    productName: string | undefined,
    appId: string | undefined,
    allProducts: ExtendedProduct[]
  ): string | undefined {
    return (
      allProducts.find((item) => item.name === productName)?.applications?.find((a) => a.appId === appId)?.appName ??
      appId
    )
  }

  public onCalcDuration(start: string, end: string): string {
    if (!start || start === '' || !end || end === '') return ''
    return new Date(Date.parse(end) - Date.parse(start)).toUTCString().split(' ')[4]
  }
}


```

//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

## Folder: onecx-parameter-ui/src/app/shared/generated (6 files)

### File: onecx-parameter-ui/src/app/shared/generated/api.module.ts

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

### File: onecx-parameter-ui/src/app/shared/generated/configuration.ts

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

### File: onecx-parameter-ui/src/app/shared/generated/encoder.ts

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

### File: onecx-parameter-ui/src/app/shared/generated/index.ts

```ts

export * from './api/api';
export * from './model/models';
export * from './variables';
export * from './configuration';
export * from './api.module';
export * from './param';


```

### File: onecx-parameter-ui/src/app/shared/generated/param.ts

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

### File: onecx-parameter-ui/src/app/shared/generated/variables.ts

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

//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

## Folder: onecx-parameter-ui/src/app/shared/generated/api (3 files)

### File: onecx-parameter-ui/src/app/shared/generated/api/api.ts

```ts

export * from './histories.service';
import { HistoriesAPIService } from './histories.service';
export * from './parameters.service';
import { ParametersAPIService } from './parameters.service';
export const APIS = [HistoriesAPIService, ParametersAPIService];


```

### File: onecx-parameter-ui/src/app/shared/generated/api/histories.service.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
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
import { History } from '../model/history';
// @ts-ignore
import { HistoryCount } from '../model/historyCount';
// @ts-ignore
import { HistoryCountCriteria } from '../model/historyCountCriteria';
// @ts-ignore
import { HistoryCriteria } from '../model/historyCriteria';
// @ts-ignore
import { HistoryPageResult } from '../model/historyPageResult';
// @ts-ignore
import { ProblemDetailResponse } from '../model/problemDetailResponse';
// @ts-ignore
import { Product } from '../model/product';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


export interface GetAllHistoryRequestParams {
    historyCriteria?: HistoryCriteria;
}

export interface GetAllHistoryLatestRequestParams {
    historyCriteria?: HistoryCriteria;
}

export interface GetCountsByCriteriaRequestParams {
    historyCountCriteria?: HistoryCountCriteria;
}

export interface GetHistoryByIdRequestParams {
    id: string;
}


@Injectable({
  providedIn: 'any'
})
export class HistoriesAPIService {

    protected basePath = 'http://onecx-parameter-bff:8080';
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
     * Find all history entries by criteria
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getAllHistory(requestParameters: GetAllHistoryRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HistoryPageResult>;
    public getAllHistory(requestParameters: GetAllHistoryRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<HistoryPageResult>>;
    public getAllHistory(requestParameters: GetAllHistoryRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<HistoryPageResult>>;
    public getAllHistory(requestParameters: GetAllHistoryRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const historyCriteria = requestParameters.historyCriteria;

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

        let localVarPath = `/histories`;
        return this.httpClient.request<HistoryPageResult>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: historyCriteria,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Find all latest histories by criteria
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getAllHistoryLatest(requestParameters: GetAllHistoryLatestRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HistoryPageResult>;
    public getAllHistoryLatest(requestParameters: GetAllHistoryLatestRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<HistoryPageResult>>;
    public getAllHistoryLatest(requestParameters: GetAllHistoryLatestRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<HistoryPageResult>>;
    public getAllHistoryLatest(requestParameters: GetAllHistoryLatestRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const historyCriteria = requestParameters.historyCriteria;

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

        let localVarPath = `/histories/latest`;
        return this.httpClient.request<HistoryPageResult>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: historyCriteria,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get all products from history entries
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getAllHistoryProducts(observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<Product>>;
    public getAllHistoryProducts(observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<Product>>>;
    public getAllHistoryProducts(observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<Product>>>;
    public getAllHistoryProducts(observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {

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

        let localVarPath = `/histories/products`;
        return this.httpClient.request<Array<Product>>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Get creation dates and counts of histories by criteria
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCountsByCriteria(requestParameters: GetCountsByCriteriaRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<HistoryCount>>;
    public getCountsByCriteria(requestParameters: GetCountsByCriteriaRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<HistoryCount>>>;
    public getCountsByCriteria(requestParameters: GetCountsByCriteriaRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<HistoryCount>>>;
    public getCountsByCriteria(requestParameters: GetCountsByCriteriaRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const historyCountCriteria = requestParameters.historyCountCriteria;

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

        let localVarPath = `/histories/counts`;
        return this.httpClient.request<Array<HistoryCount>>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: historyCountCriteria,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get a history by its id
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getHistoryById(requestParameters: GetHistoryByIdRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<History>;
    public getHistoryById(requestParameters: GetHistoryByIdRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<History>>;
    public getHistoryById(requestParameters: GetHistoryByIdRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<History>>;
    public getHistoryById(requestParameters: GetHistoryByIdRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const id = requestParameters.id;
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getHistoryById.');
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

        let localVarPath = `/histories/${this.configuration.encodeParam({name: "id", value: id, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}`;
        return this.httpClient.request<History>('get', `${this.configuration.basePath}${localVarPath}`,
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

### File: onecx-parameter-ui/src/app/shared/generated/api/parameters.service.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
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
import { ExportParameterRequest } from '../model/exportParameterRequest';
// @ts-ignore
import { ImportParameterResponse } from '../model/importParameterResponse';
// @ts-ignore
import { NamesPageResult } from '../model/namesPageResult';
// @ts-ignore
import { Parameter } from '../model/parameter';
// @ts-ignore
import { ParameterCreate } from '../model/parameterCreate';
// @ts-ignore
import { ParameterPageResult } from '../model/parameterPageResult';
// @ts-ignore
import { ParameterSearchCriteria } from '../model/parameterSearchCriteria';
// @ts-ignore
import { ParameterSnapshot } from '../model/parameterSnapshot';
// @ts-ignore
import { ParameterUpdate } from '../model/parameterUpdate';
// @ts-ignore
import { ProblemDetailResponse } from '../model/problemDetailResponse';
// @ts-ignore
import { Product } from '../model/product';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


export interface CreateParameterRequestParams {
    parameterCreate: ParameterCreate;
}

export interface DeleteParameterRequestParams {
    id: string;
}

export interface ExportParametersRequestParams {
    exportParameterRequest: ExportParameterRequest;
}

export interface GetAllNamesRequestParams {
    productName: string;
    applicationId?: string;
}

export interface GetParameterByIdRequestParams {
    id: string;
}

export interface ImportParametersRequestParams {
    parameterSnapshot: ParameterSnapshot;
}

export interface SearchParametersByCriteriaRequestParams {
    parameterSearchCriteria: ParameterSearchCriteria;
}

export interface UpdateParameterRequestParams {
    id: string;
    parameterUpdate: ParameterUpdate;
}


@Injectable({
  providedIn: 'any'
})
export class ParametersAPIService {

    protected basePath = 'http://onecx-parameter-bff:8080';
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
     * Create a new parameter
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createParameter(requestParameters: CreateParameterRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any>;
    public createParameter(requestParameters: CreateParameterRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<any>>;
    public createParameter(requestParameters: CreateParameterRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<any>>;
    public createParameter(requestParameters: CreateParameterRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const parameterCreate = requestParameters.parameterCreate;
        if (parameterCreate === null || parameterCreate === undefined) {
            throw new Error('Required parameter parameterCreate was null or undefined when calling createParameter.');
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
        return this.httpClient.request<any>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: parameterCreate,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Delete a parameter by its id
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteParameter(requestParameters: DeleteParameterRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any>;
    public deleteParameter(requestParameters: DeleteParameterRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<any>>;
    public deleteParameter(requestParameters: DeleteParameterRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<any>>;
    public deleteParameter(requestParameters: DeleteParameterRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const id = requestParameters.id;
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling deleteParameter.');
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

        let localVarPath = `/parameters/${this.configuration.encodeParam({name: "id", value: id, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}`;
        return this.httpClient.request<any>('delete', `${this.configuration.basePath}${localVarPath}`,
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
     * Export a list of parameters
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public exportParameters(requestParameters: ExportParametersRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<ParameterSnapshot>;
    public exportParameters(requestParameters: ExportParametersRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<ParameterSnapshot>>;
    public exportParameters(requestParameters: ExportParametersRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<ParameterSnapshot>>;
    public exportParameters(requestParameters: ExportParametersRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const exportParameterRequest = requestParameters.exportParameterRequest;
        if (exportParameterRequest === null || exportParameterRequest === undefined) {
            throw new Error('Required parameter exportParameterRequest was null or undefined when calling exportParameters.');
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

        let localVarPath = `/parameters/export`;
        return this.httpClient.request<ParameterSnapshot>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: exportParameterRequest,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get all parameter names for a specific application id and product name
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getAllNames(requestParameters: GetAllNamesRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<NamesPageResult>;
    public getAllNames(requestParameters: GetAllNamesRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<NamesPageResult>>;
    public getAllNames(requestParameters: GetAllNamesRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<NamesPageResult>>;
    public getAllNames(requestParameters: GetAllNamesRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const productName = requestParameters.productName;
        if (productName === null || productName === undefined) {
            throw new Error('Required parameter productName was null or undefined when calling getAllNames.');
        }
        const applicationId = requestParameters.applicationId;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (applicationId !== undefined && applicationId !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>applicationId, 'applicationId');
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

        let localVarPath = `/parameters/names/${this.configuration.encodeParam({name: "productName", value: productName, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}`;
        return this.httpClient.request<NamesPageResult>('get', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Find all products to which parameters are assigned to
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getAllProducts(observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<Product>>;
    public getAllProducts(observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<Product>>>;
    public getAllProducts(observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<Product>>>;
    public getAllProducts(observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {

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

        let localVarPath = `/parameters/products`;
        return this.httpClient.request<Array<Product>>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Get a parameter by its id
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getParameterById(requestParameters: GetParameterByIdRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Parameter>;
    public getParameterById(requestParameters: GetParameterByIdRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Parameter>>;
    public getParameterById(requestParameters: GetParameterByIdRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Parameter>>;
    public getParameterById(requestParameters: GetParameterByIdRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const id = requestParameters.id;
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getParameterById.');
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

        let localVarPath = `/parameters/${this.configuration.encodeParam({name: "id", value: id, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}`;
        return this.httpClient.request<Parameter>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Import a list of parameters
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public importParameters(requestParameters: ImportParametersRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<ImportParameterResponse>;
    public importParameters(requestParameters: ImportParametersRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<ImportParameterResponse>>;
    public importParameters(requestParameters: ImportParametersRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<ImportParameterResponse>>;
    public importParameters(requestParameters: ImportParametersRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const parameterSnapshot = requestParameters.parameterSnapshot;
        if (parameterSnapshot === null || parameterSnapshot === undefined) {
            throw new Error('Required parameter parameterSnapshot was null or undefined when calling importParameters.');
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

        let localVarPath = `/parameters/import`;
        return this.httpClient.request<ImportParameterResponse>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: parameterSnapshot,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Find all parameters by criteria
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public searchParametersByCriteria(requestParameters: SearchParametersByCriteriaRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<ParameterPageResult>;
    public searchParametersByCriteria(requestParameters: SearchParametersByCriteriaRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<ParameterPageResult>>;
    public searchParametersByCriteria(requestParameters: SearchParametersByCriteriaRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<ParameterPageResult>>;
    public searchParametersByCriteria(requestParameters: SearchParametersByCriteriaRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const parameterSearchCriteria = requestParameters.parameterSearchCriteria;
        if (parameterSearchCriteria === null || parameterSearchCriteria === undefined) {
            throw new Error('Required parameter parameterSearchCriteria was null or undefined when calling searchParametersByCriteria.');
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

        let localVarPath = `/parameters/search`;
        return this.httpClient.request<ParameterPageResult>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: parameterSearchCriteria,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Update a parameter by its id
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateParameter(requestParameters: UpdateParameterRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any>;
    public updateParameter(requestParameters: UpdateParameterRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<any>>;
    public updateParameter(requestParameters: UpdateParameterRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<any>>;
    public updateParameter(requestParameters: UpdateParameterRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const id = requestParameters.id;
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling updateParameter.');
        }
        const parameterUpdate = requestParameters.parameterUpdate;
        if (parameterUpdate === null || parameterUpdate === undefined) {
            throw new Error('Required parameter parameterUpdate was null or undefined when calling updateParameter.');
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

        let localVarPath = `/parameters/${this.configuration.encodeParam({name: "id", value: id, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}`;
        return this.httpClient.request<any>('put', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: parameterUpdate,
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

//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

## Folder: onecx-parameter-ui/src/app/shared/generated/model (22 files)

### File: onecx-parameter-ui/src/app/shared/generated/model/eximParameter.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface EximParameter { 
    displayName?: string;
    description?: string;
    applicationId?: string;
    productName?: string;
    name?: string;
    value?: object;
    importValue?: object;
    operator?: boolean;
}



```

### File: onecx-parameter-ui/src/app/shared/generated/model/exportParameterRequest.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface ExportParameterRequest { 
    productNames?: Array<string>;
}



```

### File: onecx-parameter-ui/src/app/shared/generated/model/history.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ParameterValue } from './parameterValue';


export interface History { 
    id: string;
    modificationCount?: number;
    creationDate?: string;
    creationUser?: string;
    modificationDate?: string;
    modificationUser?: string;
    applicationId: string;
    productName: string;
    name: string;
    usedValue?: ParameterValue;
    defaultValue?: ParameterValue;
    instanceId?: string;
    count?: number;
    start?: string;
    end?: string;
    parameterId?: string;
}



```

### File: onecx-parameter-ui/src/app/shared/generated/model/historyCount.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface HistoryCount { 
    creationDate?: string;
    count?: number;
}



```

### File: onecx-parameter-ui/src/app/shared/generated/model/historyCountCriteria.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface HistoryCountCriteria { 
    applicationId?: string;
    productName?: string;
    name?: string;
    pageNumber?: number;
    pageSize?: number;
    type?: Array<string>;
}



```

### File: onecx-parameter-ui/src/app/shared/generated/model/historyCriteria.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface HistoryCriteria { 
    applicationId?: string;
    productName?: string;
    name?: string;
    pageNumber?: number;
    pageSize?: number;
}



```

### File: onecx-parameter-ui/src/app/shared/generated/model/historyPageResult.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { History } from './history';


export interface HistoryPageResult { 
    /**
     * The total elements in the resource.
     */
    totalElements?: number;
    number?: number;
    size?: number;
    totalPages?: number;
    stream?: Array<History>;
}



```

### File: onecx-parameter-ui/src/app/shared/generated/model/importParameterResponse.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ImportParameterResponseStatus } from './importParameterResponseStatus';


export interface ImportParameterResponse { 
    /**
     * ID of the request
     */
    id?: string;
    parameters?: { [key: string]: ImportParameterResponseStatus; };
}



```

### File: onecx-parameter-ui/src/app/shared/generated/model/importParameterResponseStatus.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export enum ImportParameterResponseStatus {
    Update = 'UPDATE',
    Created = 'CREATED',
    Skip = 'SKIP'
}



```

### File: onecx-parameter-ui/src/app/shared/generated/model/models.ts

```ts

export * from './eximParameter';
export * from './exportParameterRequest';
export * from './history';
export * from './historyCount';
export * from './historyCountCriteria';
export * from './historyCriteria';
export * from './historyPageResult';
export * from './importParameterResponse';
export * from './importParameterResponseStatus';
export * from './namesPageResult';
export * from './parameter';
export * from './parameterCreate';
export * from './parameterPageResult';
export * from './parameterSearchCriteria';
export * from './parameterSnapshot';
export * from './parameterUpdate';
export * from './parameterValue';
export * from './problemDetailInvalidParam';
export * from './problemDetailParam';
export * from './problemDetailResponse';
export * from './product';


```

### File: onecx-parameter-ui/src/app/shared/generated/model/namesPageResult.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface NamesPageResult { 
    /**
     * The total elements in the resource.
     */
    totalElements?: number;
    number?: number;
    size?: number;
    totalPages?: number;
    stream?: Array<string>;
}



```

### File: onecx-parameter-ui/src/app/shared/generated/model/parameter.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ParameterValue } from './parameterValue';


export interface Parameter { 
    id?: string;
    modificationCount?: number;
    creationDate?: string;
    creationUser?: string;
    modificationDate?: string;
    modificationUser?: string;
    description?: string;
    applicationId?: string;
    productName?: string;
    name?: string;
    displayName?: string;
    value?: ParameterValue;
    importValue?: ParameterValue;
    operator?: boolean;
    isInHistory?: boolean;
}



```

### File: onecx-parameter-ui/src/app/shared/generated/model/parameterCreate.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ParameterValue } from './parameterValue';


export interface ParameterCreate { 
    name: string;
    displayName?: string;
    applicationId: string;
    productName: string;
    value?: ParameterValue;
    description?: string;
}



```

### File: onecx-parameter-ui/src/app/shared/generated/model/parameterPageResult.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Parameter } from './parameter';


export interface ParameterPageResult { 
    /**
     * The total elements in the resource.
     */
    totalElements?: number;
    number?: number;
    size?: number;
    totalPages?: number;
    stream?: Array<Parameter>;
}



```

### File: onecx-parameter-ui/src/app/shared/generated/model/parameterSearchCriteria.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface ParameterSearchCriteria { 
    applicationId?: string;
    productName?: string;
    name?: string;
    displayName?: string;
    /**
     * The number of page
     */
    pageNumber?: number;
    /**
     * The size of page
     */
    pageSize?: number;
}



```

### File: onecx-parameter-ui/src/app/shared/generated/model/parameterSnapshot.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { EximParameter } from './eximParameter';


export interface ParameterSnapshot { 
    /**
     * ID of the request
     */
    id?: string;
    created?: string;
    products?: { [key: string]: Array<EximParameter>; };
}



```

### File: onecx-parameter-ui/src/app/shared/generated/model/parameterUpdate.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ParameterValue } from './parameterValue';


export interface ParameterUpdate { 
    value?: ParameterValue;
    description?: string;
    displayName?: string;
    modificationCount?: number;
}



```

### File: onecx-parameter-ui/src/app/shared/generated/model/parameterValue.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
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

### File: onecx-parameter-ui/src/app/shared/generated/model/problemDetailInvalidParam.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
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

### File: onecx-parameter-ui/src/app/shared/generated/model/problemDetailParam.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
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

### File: onecx-parameter-ui/src/app/shared/generated/model/problemDetailResponse.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
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

### File: onecx-parameter-ui/src/app/shared/generated/model/product.ts

```ts

/**
 * onecx-parameter-bff
 * Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
 *
 * The version of the OpenAPI document: 2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface Product { 
    productName?: string;
    displayName?: string;
    applications?: Array<string>;
}



```

//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

## Folder: onecx-parameter-ui/src/app/shared (6 files)

### File: onecx-parameter-ui/src/app/shared/label.resolver.spec.ts

```ts

import { Observable, of } from 'rxjs'
import { LabelResolver } from './label.resolver'

let labelResolver: LabelResolver

describe('LabelResolver', () => {
  const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['get'])

  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', [], {
    routeConfig: {
      path: 'path'
    },
    data: {}
  })

  const routerStateSpy = jasmine.createSpyObj('RouterStateSnapshot', [''])

  beforeEach(async () => {
    labelResolver = new LabelResolver(translateServiceSpy)
    translateServiceSpy.get.calls.reset()
    const dataSpy = Object.getOwnPropertyDescriptor(activatedRouteSpy, 'data')?.get as jasmine.Spy<() => {}>
    dataSpy.and.returnValue({})
  })

  it('should translate if breadcrumb is present', (done: DoneFn) => {
    const dataSpy = Object.getOwnPropertyDescriptor(activatedRouteSpy, 'data')?.get as jasmine.Spy<() => {}>
    dataSpy.and.returnValue({
      breadcrumb: 'defined'
    })
    translateServiceSpy.get.and.returnValue(of('translation'))

    const obsResult = labelResolver.resolve(activatedRouteSpy, routerStateSpy) as Observable<string>
    obsResult.subscribe((result) => {
      expect(result).toBe('translation')
      expect(translateServiceSpy.get).toHaveBeenCalledOnceWith('defined')

      done()
    })
  })

  it('should use route path if breadcrumb is not present', () => {
    const result = labelResolver.resolve(activatedRouteSpy, routerStateSpy)

    expect(result).toBe('path')
    expect(translateServiceSpy.get).toHaveBeenCalledTimes(0)
  })

  it('should return an empty string if neither breadcrumb nor route.routeConfig.path are present', () => {
    const routeConfigSpy = Object.getOwnPropertyDescriptor(activatedRouteSpy, 'routeConfig')?.get as jasmine.Spy<
      () => {}
    >
    routeConfigSpy.and.returnValue({})
    const result = labelResolver.resolve(activatedRouteSpy, routerStateSpy)

    expect(result).toBe('')
    expect(translateServiceSpy.get).toHaveBeenCalledTimes(0)
  })
})


```

### File: onecx-parameter-ui/src/app/shared/label.resolver.ts

```ts

import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Observable, map } from 'rxjs'

//dont use `providedIn root` - wont work when we are in shell
@Injectable()
export class LabelResolver implements Resolve<string> {
  constructor(private readonly translate: TranslateService) {}
  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
    return route.data['breadcrumb']
      ? this.translate.get(route.data['breadcrumb']).pipe(map((t) => t.toString()))
      : (route.routeConfig?.path ?? '')
  }
}


```

### File: onecx-parameter-ui/src/app/shared/shared.module.spec.ts

```ts

import { NO_ERRORS_SCHEMA } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { provideHttpClient, HttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'

import { MfeInfo } from '@onecx/integration-interface'

import { environment } from 'src/environments/environment'

describe('SharedModule', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpClient: HttpClient

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })

    httpClient = TestBed.inject(HttpClient)
  })

  it('should return the correct basePath with mfeInfo', () => {
    const mfeInfo: MfeInfo = {
      mountPath: '',
      remoteBaseUrl: 'http://localhost:4200/',
      baseHref: '',
      shellName: '',
      productName: '',
      appId: ''
    }
    const result = mfeInfo.remoteBaseUrl + '' + environment.apiPrefix
    expect(result).toEqual('http://localhost:4200/bff')
  })
})


```

### File: onecx-parameter-ui/src/app/shared/shared.module.ts

```ts

import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { provideErrorTailorConfig, errorTailorImports } from '@ngneat/error-tailor'

import { AutoCompleteModule } from 'primeng/autocomplete'
import { CalendarModule } from 'primeng/calendar'
import { CardModule } from 'primeng/card'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ConfirmPopupModule } from 'primeng/confirmpopup'
import { ConfirmationService } from 'primeng/api'
import { DataViewModule } from 'primeng/dataview'
import { DialogModule } from 'primeng/dialog'
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog'
import { DropdownModule } from 'primeng/dropdown'
import { FieldsetModule } from 'primeng/fieldset'
import { InputTextModule } from 'primeng/inputtext'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { KeyFilterModule } from 'primeng/keyfilter'
import { ListboxModule } from 'primeng/listbox'
import { MultiSelectModule } from 'primeng/multiselect'
import { SelectButtonModule } from 'primeng/selectbutton'
import { TableModule } from 'primeng/table'
import { TabViewModule } from 'primeng/tabview'
import { ToastModule } from 'primeng/toast'
import { TooltipModule } from 'primeng/tooltip'

import { PortalCoreModule, PortalDialogService } from '@onecx/portal-integration-angular'

import { LabelResolver } from './label.resolver'

@NgModule({
  declarations: [],
  imports: [
    PortalCoreModule.forMicroFrontend(),
    AutoCompleteModule,
    CalendarModule,
    CardModule,
    CommonModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    DataViewModule,
    DialogModule,
    DropdownModule,
    DynamicDialogModule,
    FieldsetModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    KeyFilterModule,
    ListboxModule,
    MultiSelectModule,
    ReactiveFormsModule,
    SelectButtonModule,
    TableModule,
    TabViewModule,
    ToastModule,
    TooltipModule,
    TranslateModule,
    errorTailorImports
  ],
  exports: [
    AutoCompleteModule,
    CalendarModule,
    CardModule,
    CommonModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    DataViewModule,
    DialogModule,
    DropdownModule,
    DynamicDialogModule,
    FieldsetModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    KeyFilterModule,
    ListboxModule,
    MultiSelectModule,
    ReactiveFormsModule,
    SelectButtonModule,
    TableModule,
    TabViewModule,
    ToastModule,
    TooltipModule,
    TranslateModule,
    errorTailorImports
  ],
  //this is not elegant, for some reason the injection token from primeng does not work across federated module
  providers: [
    ConfirmationService,
    LabelResolver,
    { provide: DialogService, useClass: PortalDialogService },
    provideErrorTailorConfig({
      controlErrorsOn: { async: true, blur: true, change: true },
      errors: {
        useFactory: (i18n: TranslateService) => {
          return {
            required: () => i18n.instant('VALIDATION.ERRORS.EMPTY_REQUIRED_FIELD'),
            maxlength: ({ requiredLength }) =>
              i18n.instant('VALIDATION.ERRORS.MAXIMUM_LENGTH').replace('{{chars}}', requiredLength),
            minlength: ({ requiredLength }) =>
              i18n.instant('VALIDATION.ERRORS.MINIMUM_LENGTH').replace('{{chars}}', requiredLength),
            pattern: () => i18n.instant('VALIDATION.ERRORS.PATTERN_ERROR')
          }
        },
        deps: [TranslateService]
      },
      //this is required because primeng calendar wraps things in an ugly way
      blurPredicate: (element: Element) => {
        return ['INPUT', 'TEXTAREA', 'SELECT', 'CUSTOM-DATE', 'P-CALENDAR', 'P-DROPDOWN'].some(
          (selector) => element.tagName === selector
        )
      }
    })
  ]
})
export class SharedModule {}


```

### File: onecx-parameter-ui/src/app/shared/utils.spec.ts

```ts

import { FormGroup, FormControl } from '@angular/forms'
import { SelectItem } from 'primeng/api'

import {
  limitText,
  copyToClipboard,
  forceFormValidation,
  displayEqualityState,
  displayValue,
  displayValue2,
  displayValueType,
  dropDownSortItemsByLabel,
  dropDownGetLabelByValue,
  sortByLocale,
  sortByDisplayName
} from './utils'

describe('util functions', () => {
  describe('limitText', () => {
    it('should truncate text that exceeds the specified limit', () => {
      const result = limitText('hello', 4)

      expect(result).toEqual('hell...')
    })

    it('should return the original text if it does not exceed the limit', () => {
      const result = limitText('hello', 6)

      expect(result).toEqual('hello')
    })

    it('should return an empty string for undefined input', () => {
      const str: any = undefined
      const result = limitText(str, 5)

      expect(result).toEqual('')
    })
  })

  describe('copyToClipboard', () => {
    let writeTextSpy: jasmine.Spy

    beforeEach(() => {
      writeTextSpy = spyOn(navigator.clipboard, 'writeText')
    })

    it('should copy text to clipboard', () => {
      copyToClipboard('text')

      expect(writeTextSpy).toHaveBeenCalledWith('text')
    })
  })

  describe('forceFormValidation', () => {
    it('should mark controls as dirty and touched', () => {
      const group = new FormGroup({
        control1: new FormControl(''),
        control2: new FormControl('')
      })

      forceFormValidation(group)

      expect(group.dirty).toBeTrue()
      expect(group.touched).toBeTrue()
    })
  })

  describe('dropDownSortItemsByLabel', () => {
    it('should correctly sort items by label', () => {
      const items: SelectItem[] = [
        { label: 'label2', value: 2 },
        { label: 'label1', value: 1 }
      ]

      const sortedItems = items.sort(dropDownSortItemsByLabel)

      expect(sortedItems[0].label).toEqual('label1')
    })
    it("should treat falsy values for SelectItem.label as ''", () => {
      const items: SelectItem[] = [
        { label: undefined, value: 1 },
        { label: undefined, value: 2 },
        { label: 'label1', value: 2 }
      ]

      const sortedItems = items.sort(dropDownSortItemsByLabel)

      expect(sortedItems[0].label).toEqual(undefined)
    })
  })

  describe('dropDownGetLabelByValue', () => {
    it('should return the label corresponding to the value', () => {
      const items: SelectItem[] = [
        { label: 'label2', value: 2 },
        { label: 'label1', value: 1 }
      ]

      const result = dropDownGetLabelByValue(items, '1')

      expect(result).toEqual('label1')
    })
  })

  describe('sortByLocale', () => {
    it('should sort strings based on locale', () => {
      const strings: string[] = ['str2', 'str1']

      const sortedStrings = strings.sort(sortByLocale)

      expect(sortedStrings[0]).toEqual('str1')
    })
  })

  describe('sortByDisplayName', () => {
    it('should return negative value when first product name comes before second alphabetically', () => {
      const productA = { id: 'a', name: 'name', displayName: 'Admin' }
      const productB = { id: 'b', name: 'name', displayName: 'User' }
      expect(sortByDisplayName(productA, productB)).toBeLessThan(0)
    })

    it('should return positive value when first product name comes after second alphabetically', () => {
      const productA = { id: 'a', name: 'name', displayName: 'User' }
      const productB = { id: 'b', name: 'name', displayName: 'Admin' }
      expect(sortByDisplayName(productA, productB)).toBeGreaterThan(0)
    })

    it('should return zero when product names are the same', () => {
      const productA = { id: 'a', name: 'name', displayName: 'Admin' }
      const productB = { id: 'b', name: 'name', displayName: 'Admin' }
      expect(sortByDisplayName(productA, productB)).toBe(0)
    })

    it('should be case-insensitive', () => {
      const productA = { id: 'a', name: 'name', displayName: 'admin' }
      const productB = { id: 'b', name: 'name', displayName: 'Admin' }
      expect(sortByDisplayName(productA, productB)).toBe(0)
    })

    it('should handle undefined names', () => {
      const productA = { id: 'a', name: 'name', displayName: undefined }
      const productB = { id: 'b', name: 'name', displayName: 'Admin' }
      expect(sortByDisplayName(productA, productB)).toBeLessThan(0)
    })

    it('should handle empty string names', () => {
      const productA = { id: 'a', name: 'name', displayName: '' }
      const productB = { id: 'b', name: 'name', displayName: 'Admin' }
      expect(sortByDisplayName(productA, productB)).toBeLessThan(0)
    })

    it('should handle both names being undefined', () => {
      const productA = { id: 'a', name: 'name', displayName: undefined }
      const productB = { id: 'b', name: 'name', displayName: undefined }
      expect(sortByDisplayName(productA, productB)).toBe(0)
    })
  })

  describe('display data with various types', () => {
    it('should identify value type', () => {
      let data: any = undefined
      expect(displayValueType(data)).toBe('UNKNOWN')
      data = null
      expect(displayValueType(data)).toBe('UNKNOWN')

      data = 'text'
      expect(displayValueType(data)).toBe('STRING')

      data = 123
      expect(displayValueType(data)).toBe('NUMBER')

      data = true
      expect(displayValueType(data)).toBe('BOOLEAN')

      data = { hallo: 'test' }
      expect(displayValueType(data)).toBe('OBJECT')
    })

    it('should display value as string', () => {
      let data: any = undefined
      expect(displayValue(data)).toBe('')
      data = null
      expect(displayValue(data)).toBe('')

      data = 'text'
      expect(displayValue(data)).toBe('text')

      data = 123
      expect(displayValue(data)).toBe('123')

      data = true
      expect(displayValue(data)).toBe('true')

      data = { hallo: 'test' }
      expect(displayValue(data)).toBe('{ ... }')
    })

    it('should display value as string', () => {
      let data1: any = undefined
      let data2: any = undefined
      expect(displayValue2(data1, data2)).toBe('')
      data2 = null
      expect(displayValue2(data1, data2)).toBe('')

      data2 = 'text2'
      expect(displayValue2(data1, data2)).toBe('text2')
      data1 = 'text1'
      expect(displayValue2(data1, data2)).toBe('text1')

      data1 = false
      data2 = true
      expect(displayValue2(data1, data2)).toBe('false')

      data1 = 123
      data2 = false
      expect(displayValue2(data1, data2)).toBe('123')

      data1 = { hallo: 'test' }
      data2 = { hallo: 'test' }
      expect(displayValue2(data1, data2)).toBe('{ ... }')
    })

    it('should identify equality state', () => {
      let data1: any = undefined
      let data2: any = undefined
      expect(displayEqualityState(data1, data2)).toBe('UNDEFINED')
      data1 = null
      expect(displayEqualityState(data1, data2)).toBe('FALSE')

      data1 = '123'
      expect(displayEqualityState(data1, data2)).toBe('FALSE')
      data1 = 123
      expect(displayEqualityState(data1, data2)).toBe('FALSE')
      data1 = false
      expect(displayEqualityState(data1, data2)).toBe('FALSE')

      data1 = 'text1'
      data2 = 'text1'
      expect(displayEqualityState(data1, data2)).toBe('TRUE')
      data2 = 'text2'
      expect(displayEqualityState(data1, data2)).toBe('FALSE')

      data1 = true
      data2 = true
      expect(displayEqualityState(data1, data2)).toBe('TRUE')
      data2 = false
      expect(displayEqualityState(data1, data2)).toBe('FALSE')

      data1 = 123
      data2 = 123
      expect(displayEqualityState(data1, data2)).toBe('TRUE')
      data2 = 1234
      expect(displayEqualityState(data1, data2)).toBe('FALSE')

      data1 = { hallo: 'test' }
      data2 = { hallo: 'test' }
      expect(displayEqualityState(data1, data2)).toBe('TRUE')
      data2 = { hallo: 'test', hi: 'all' }
      expect(displayEqualityState(data1, data2)).toBe('FALSE')
    })
  })
})


```

### File: onecx-parameter-ui/src/app/shared/utils.ts

```ts

import { AbstractControl, FormArray, FormGroup } from '@angular/forms'
import { SelectItem } from 'primeng/api'

export function limitText(text: string | undefined, limit: number): string {
  if (text) {
    return text.length < limit ? text : text.substring(0, limit) + '...'
  } else {
    return ''
  }
}

export function copyToClipboard(text?: string): void {
  if (text) navigator.clipboard.writeText(text)
}

/**
 *  FORM
 */
export function forceFormValidation(form: AbstractControl): void {
  if (form instanceof FormGroup || form instanceof FormArray) {
    for (const inner in form.controls) {
      const control = form.get(inner)
      control && forceFormValidation(control)
    }
  } else {
    form.markAsDirty()
    form.markAsTouched()
    form.updateValueAndValidity()
  }
}

/**
 *  DROPDOWN
 */
export type DropDownChangeEvent = MouseEvent & { value: any }

export function dropDownSortItemsByLabel(a: SelectItem, b: SelectItem): number {
  return (a.label ? (a.label as string).toUpperCase() : '').localeCompare(
    b.label ? (b.label as string).toUpperCase() : ''
  )
}
export function dropDownGetLabelByValue(ddArray: SelectItem[], val: string): string | undefined {
  const a: any = ddArray.find((item: SelectItem) => {
    return item?.value == val
  })
  return a.label
}

/**
 *  SORTING
 */
export function sortByLocale(a: any, b: any): number {
  return a.toUpperCase().localeCompare(b.toUpperCase())
}
export function sortByDisplayName(a: any, b: any): number {
  return (a.displayName ? a.displayName.toUpperCase() : '').localeCompare(
    b.displayName ? b.displayName.toUpperCase() : ''
  )
}

/****************************************************************************
 *  HELPER to manage fields wit various content type
 *    Important do not calculate such things in HTML!
 */
export function displayValueType(val: any): string {
  if (val === undefined || val === null) return 'UNKNOWN'
  return (typeof val).toUpperCase()
}
export function displayValue(val: any): string {
  if (typeof val === 'boolean') return '' + val // true | false
  if (!val) return ''
  return typeof val === 'object' ? '{ ... }' : '' + val
}
export function displayValue2(val: any, impVal: any): string {
  if (typeof val === 'boolean') return '' + val // true | false
  const v = val ?? impVal
  if (typeof v === 'boolean') return '' + v
  if (!v) return ''
  return typeof v === 'object' ? '{ ... }' : '' + v
}
// value can be boolean
export function displayEqualityState(val1: any, val2: any): string {
  if (typeof val1 !== typeof val2) return 'FALSE'
  if (typeof val1 === 'boolean') return (val1 === val2).toString().toLocaleUpperCase()
  if (!val1 && !val2) return 'UNDEFINED' // typeof null == object!
  if (typeof val1 === 'object') return (JSON.stringify(val1) === JSON.stringify(val2)).toString().toLocaleUpperCase()
  return (val1 === val2).toString().toLocaleUpperCase()
}


```

//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

## Folder: onecx-parameter-ui/src/assets/api (1 files)

### File: onecx-parameter-ui/src/assets/api/openapi-bff.yaml

```yaml

---
openapi: 3.0.3
info:
  title: onecx-parameter-bff
  description: Backend-For-Frontend (BFF) service for onecx-parameter. This API provides endpoints to manage Parameters and Histories
  version: "2.0"
servers:
  - url: http://onecx-parameter-bff:8080/
tags:
  - name: histories
    description: Managing Parameter Histories
  - name: parameters
    description: Managing Parameters
paths:
  /histories:
    post:
      x-onecx:
        permissions:
          parameter:
            - read
      tags:
        - histories
      description: Find all history entries by criteria
      operationId: getAllHistory
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HistoryCriteria'
      responses:
        "200":
          description: History search results retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HistoryPageResult'
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
  /histories/counts:
    post:
      x-onecx:
        permissions:
          parameter:
            - read
      tags:
        - histories
      description: Get creation dates and counts of histories by criteria
      operationId: getCountsByCriteria
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HistoryCountCriteria'
      responses:
        "200":
          description: History counts retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/HistoryCount'
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
  /histories/latest:
    post:
      x-onecx:
        permissions:
          parameter:
            - read
      tags:
        - histories
      description: Find all latest histories by criteria
      operationId: getAllHistoryLatest
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HistoryCriteria'
      responses:
        "200":
          description: History search results retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HistoryPageResult'
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
  /histories/{id}:
    get:
      x-onecx:
        permissions:
          parameter:
            - read
      tags:
        - histories
      description: Get a history by its id
      operationId: getHistoryById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: History retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/History'
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
        "404":
          description: History not found
  /histories/products:
    get:
      x-onecx:
        permissions:
          parameter:
            - read
      tags:
        - histories
      description: Get all products from history entries
      operationId: getAllHistoryProducts
      responses:
        "200":
          description: Products retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
  /parameters/search:
    post:
      x-onecx:
        permissions:
          parameter:
            - read
      tags:
        - parameters
      description: Find all parameters by criteria
      operationId: searchParametersByCriteria
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ParameterSearchCriteria'
      responses:
        "200":
          description: Parameter search results retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ParameterPageResult'
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
  /parameters:
    post:
      x-onecx:
        permissions:
          parameter:
            - write
      tags:
        - parameters
      description: Create a new parameter
      operationId: createParameter
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ParameterCreate'
      responses:
        "204":
          description: Parameter created successfully
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
        "404":
          description: Not found
  /parameters/products:
    get:
      x-onecx:
        permissions:
          parameter:
            - read
      tags:
        - parameters
      description: Find all products to which parameters are assigned to
      operationId: getAllProducts
      responses:
        "200":
          description: Products retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
  /parameters/names/{productName}:
    get:
      x-onecx:
        permissions:
          parameter:
            - read
      tags:
        - parameters
      description: Get all parameter names for a specific application id and product name
      operationId: getAllNames
      parameters:
        - name: applicationId
          in: query
          schema:
            description: The application parameter id.
            type: string
        - name: productName
          required: true
          in: path
          schema:
            description: The product name.
            type: string
      responses:
        "200":
          description: Parameter retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/NamesPageResult'
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
  /parameters/{id}:
    get:
      x-onecx:
        permissions:
          parameter:
            - read
      tags:
        - parameters
      description: Get a parameter by its id
      operationId: getParameterById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Parameter retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Parameter'
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
        "404":
          description: Parameter not found
    put:
      x-onecx:
        permissions:
          parameter:
            - write
      tags:
        - parameters
      description: Update a parameter by its id
      operationId: updateParameter
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ParameterUpdate'
      responses:
        "204":
          description: Parameter updated successfully
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
        "404":
          description: Parameter not found
    delete:
      x-onecx:
        permissions:
          parameter:
            - delete
      tags:
        - parameters
      description: Delete a parameter by its id
      operationId: deleteParameter
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "204":
          description: Parameter deleted successfully
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
  /parameters/export:
    post:
      x-onecx:
        permissions:
          parameter:
            - read
      tags:
        - parameters
      description: Export a list of parameters
      operationId: exportParameters
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExportParameterRequest'
      responses:
        "200":
          description: Parameters exported successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ParameterSnapshot'
        "404":
          description: Parameters not found
  /parameters/import:
    post:
      x-onecx:
        permissions:
          parameter:
            - write
      tags:
        - parameters
      description: Import a list of parameters
      operationId: importParameters
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ParameterSnapshot'
      responses:
        "200":
          description: Parameters imported successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ImportParameterResponse'
        "400":
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
components:
  schemas:
    ParameterCreate:
      type: object
      required:
        - name
        - productName
        - applicationId
      properties:
        name:
          type: string
        displayName:
          type: string
        applicationId:
          type: string
        productName:
          type: string
        value:
          $ref: '#/components/schemas/ParameterValue'
        description:
          type: string
    Parameter:
      type: object
      properties:
        id:
          type: string
        modificationCount:
          format: int32
          type: integer
        creationDate:
          format: date-time
          type: string
          example: 2022-03-10T12:15:50-04:00
        creationUser:
          type: string
        modificationDate:
          format: date-time
          type: string
          example: 2022-03-10T12:15:50-04:00
        modificationUser:
          type: string
        description:
          type: string
        applicationId:
          type: string
        productName:
          type: string
        name:
          type: string
        displayName:
          type: string
        value:
          $ref: '#/components/schemas/ParameterValue'
        importValue:
          $ref: '#/components/schemas/ParameterValue'
        operator:
          type: boolean
        isInHistory:
          type: boolean
    ParameterValue:
      oneOf:
        - type: string
        - type: number
        - type: boolean
        - type: integer
        - type: object
    History:
      type: object
      required:
        - name
        - productName
        - applicationId
        - id
      properties:
        id:
          type: string
        modificationCount:
          format: int32
          type: integer
        creationDate:
          format: date-time
          type: string
          example: 2022-03-10T12:15:50-04:00
        creationUser:
          type: string
        modificationDate:
          format: date-time
          type: string
          example: 2022-03-10T12:15:50-04:00
        modificationUser:
          type: string
        applicationId:
          type: string
        productName:
          type: string
        name:
          type: string
        usedValue:
          $ref: '#/components/schemas/ParameterValue'
        defaultValue:
          $ref: '#/components/schemas/ParameterValue'
        instanceId:
          type: string
        count:
          type: integer
          format: int64
        start:
          format: date-time
          type: string
          example: 2022-03-10T12:15:50-04:00
        end:
          format: date-time
          type: string
          example: 2022-03-10T12:15:50-04:00
        parameterId:
          type: string
    HistoryCriteria:
      type: object
      properties:
        applicationId:
          type: string
        productName:
          type: string
        name:
          type: string
        pageNumber:
          type: integer
          format: int32
          default: 0
        pageSize:
          type: integer
          format: int32
          default: 100
    HistoryPageResult:
      type: object
      properties:
        totalElements:
          format: int64
          description: The total elements in the resource.
          type: integer
        number:
          format: int32
          type: integer
        size:
          format: int32
          type: integer
        totalPages:
          format: int64
          type: integer
        stream:
          type: array
          items:
            $ref: '#/components/schemas/History'
    ParameterPageResult:
      type: object
      properties:
        totalElements:
          format: int64
          description: The total elements in the resource.
          type: integer
        number:
          format: int32
          type: integer
        size:
          format: int32
          type: integer
        totalPages:
          format: int64
          type: integer
        stream:
          type: array
          items:
            $ref: '#/components/schemas/Parameter'
    ParameterUpdate:
      type: object
      properties:
        value:
          $ref: '#/components/schemas/ParameterValue'
        description:
          type: string
        displayName:
          type: string
        modificationCount:
          format: int32
          type: integer
    Product:
      type: object
      properties:
        productName:
          type: string
        displayName:
          type: string
        applications:
          type: array
          items:
            type: string
    NamesPageResult:
      type: object
      properties:
        totalElements:
          format: int64
          description: The total elements in the resource.
          type: integer
        number:
          format: int32
          type: integer
        size:
          format: int32
          type: integer
        totalPages:
          format: int64
          type: integer
        stream:
          type: array
          items:
            type: string
    HistoryCountCriteria:
      type: object
      properties:
        applicationId:
          type: string
        productName:
          type: string
        name:
          type: string
        pageNumber:
          format: int32
          default: 0
          type: integer
        pageSize:
          format: int32
          default: 100
          type: integer
        type:
          type: array
          items:
            type: string
    HistoryCount:
      type: object
      properties:
        creationDate:
          format: date-time
          type: string
          example: 2022-03-10T12:15:50
        count:
          format: int64
          type: integer
    ParameterSearchCriteria:
      type: object
      properties:
        applicationId:
          type: string
        productName:
          type: string
        name:
          type: string
        displayName:
          type: string
        pageNumber:
          format: int32
          description: The number of page
          default: 0
          type: integer
        pageSize:
          format: int32
          description: The size of page
          default: 100
          type: integer
    ExportParameterRequest:
      type: object
      properties:
        productNames:
          type: array
          uniqueItems: true
          items:
            type: string
    ParameterSnapshot:
      type: object
      properties:
        id:
          type: string
          minLength: 10
          description: ID of the request
        created:
          $ref: '#/components/schemas/OffsetDateTime'
        products:
          type: object
          nullable: false
          additionalProperties:
            type: array
            items:
              $ref: '#/components/schemas/EximParameter'
    ImportParameterResponse:
      type: object
      properties:
        id:
          type: string
          minLength: 10
          description: ID of the request
        parameters:
          additionalProperties:
            $ref: '#/components/schemas/ImportParameterResponseStatus'
    ImportParameterResponseStatus:
      type: string
      enum:
        - UPDATE
        - CREATED
        - SKIP
    EximParameter:
      type: object
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
          type: object
        importValue:
          type: object
        operator:
          type: boolean
    OffsetDateTime:
      format: date-time
      type: string
      example: 2022-03-10T12:15:50-04:00
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

//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

## Folder: onecx-parameter-ui/src (5 files)

### File: onecx-parameter-ui/src/bootstrap.ts

```ts

import { environment } from 'src/environments/environment'
import { OneCXParameterModule } from './app/onecx-parameter-remote.module'
import { bootstrapModule } from '@onecx/angular-webcomponents'

bootstrapModule(OneCXParameterModule, 'microfrontend', environment.production)


```

### File: onecx-parameter-ui/src/index.html

```html

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>OneCX Parameter</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
  </head>
  <body>
    <app-root>&nbsp;</app-root>
  </body>
</html>


```

### File: onecx-parameter-ui/src/main.ts

```ts

import('./bootstrap').catch((err) => console.error(err))


```

### File: onecx-parameter-ui/src/polyfills.ts

```ts

/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes recent versions of Safari, Chrome (including
 * Opera), Edge on the desktop, and iOS and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 * because those flags need to be set before `zone.js` being loaded, and webpack
 * will put import in the top of bundle, so user need to create a separate file
 * in this directory (for example: zone-flags.ts), and put the following flags
 * into that file, and then add the following code before importing zone.js.
 * import './zone-flags';
 *
 * The flags allowed in zone-flags.ts are listed here.
 *
 * The following flags will work for all browsers.
 *
 * (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
 * (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
 * (window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
 *
 *  in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
 *  with the following flag, it will bypass `zone.js` patch for IE/Edge
 *
 *  (window as any).__Zone_enable_cross_context_check = true;
 *
 */

/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js' // Included with Angular CLI.

/***************************************************************************************************
 * APPLICATION IMPORTS
 */


```

### File: onecx-parameter-ui/src/test.ts

```ts

// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing'
import { getTestBed } from '@angular/core/testing'
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing'

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())


```

//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

## Folder: onecx-parameter-ui/src/environments (2 files)

### File: onecx-parameter-ui/src/environments/environment.prod.ts

```ts

export const environment = {
  production: true,
  BASE_PATH: '/bff',
  apiPrefix: 'bff'
}


```

### File: onecx-parameter-ui/src/environments/environment.ts

```ts

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  KEYCLOAK_URL: 'http://keycloak-app/',
  KEYCLOAK_REALM: 'OneCX',
  KEYCLOAK_CLIENT_ID: 'tkit-angular-example',
  TKIT_PORTAL_ID: 'ADMIN',
  skipRemoteConfigLoad: true,
  apiPrefix: 'bff'
}


```

//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************


