
File : onecx-parameter-ui / src / app /
onecx-parameter-remote.module.ts
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



File : src/app/app.component.ts
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


File : src/app/app.component.html
```ts
<ocx-portal-viewport></ocx-portal-viewport>
```



File : src/app/parameter/parameter.module.ts
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



File : src/app/parameter/parameter-criteria/parameter-criteria.component.ts
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



File : src/app/parameter/parameter-criteria/parameter-criteria.component.spec.ts
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


File : src/app/parameter/parameter-criteria/parameter-criteria.component.scss
```scss
@import '/src/app/_pm-mixins.scss';

@include correct-search-criteria;
@include displaying-text-responsive;
```


File : src/app/parameter/parameter-criteria/parameter-criteria.component.html
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



File : src/app/parameter/parameter-detail/parameter-detail.component.ts
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



File : src/app/parameter/parameter-detail/parameter-detail.component.spec.ts
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



File : 
```scss
@import '/src/app/_pm-mixins.scss';

@include text-badges;
@include correct-select-button;
@include search-criteria-select-button;
@include search-criteria-select-button-slim;
@include readable-disabled-components;
@include dialog-footer-buttons;
@include dialog-non-full-size-modal;
@include displaying-text-responsive;
@include tabview-reduce-padding;
@include tabview-fix-color-selected-tab;

:host ::ng-deep {
  label.float-label {
    color: var(--emphasis-medium);
  }
  .error-tailor-has-error ~ control-error {
    text-align: left;
  }
}
```



File : src/app/parameter/parameter-detail/parameter-detail.component.html
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



File : src/app/parameter/parameter-search/parameter-search.component.ts
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



File : src/app/parameter/parameter-search/parameter-search.component.spec.ts
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



File : src/app/parameter/parameter-search/parameter-search.component.scss
```scss
@import '/src/app/_pm-mixins.scss';

@include text-badges;
@include danger-action;
@include word-break-all;
@include displaying-text-responsive;
@include table-inline-buttons;
@include table-zebra-rows;
@include table-responsive-columns;
@include dialog-footer-buttons;

:host ::ng-deep {
  .text-badge-right {
    right: 0px;
    height: 1.4rem;
    width: 1.4rem;
  }
  .p-datatable {
    .p-datatable-thead > tr > th {
      border-bottom-width: 2px;
    }
  }
  --table-body-cell-padding: 0.5rem;

  // hide unusable stuff
  ocx-column-group-selection,
  ocx-data-view-controls div div button {
    display: none;
  }
  ocx-data-view-controls div {
    justify-content: center !important;
  }

  .max-height-for-2-lines {
    max-height: 2.5rem;
  }
  .text-ellipsis-2-lines {
    @include displaying-text-ellipsis(2);
  }
}
```



File : src/app/parameter/parameter-search/parameter-search.component.html
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



File : src/app/parameter/usage-detail/usage-detail.component.ts
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



File : src/app/parameter/usage-detail/usage-detail.component.spec.ts
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



File : src/app/parameter/usage-detail/usage-detail.component.scss
```scss
@import '/src/app/_pm-mixins.scss';

@include readable-disabled-components;
@include dialog-footer-buttons;
@include dialog-non-full-size-modal;
@include displaying-text-responsive;
@include tabview-fix-color-selected-tab;

:host ::ng-deep {
  .p-fieldset {
    &.p-fieldset-toggleable .p-fieldset-legend a,
    .p-fieldset-legend {
      background-color: transparent;
      padding: 0.3rem 0.4rem;
    }
    .p-fieldset-content {
      padding: 0rem 0.2rem 0rem;
    }
  }
}
```



File : src/app/parameter/usage-detail/usage-detail.component.html
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



File : src/app/parameter/usage-detail/usage-detail-list/usage-detail-list.component.ts
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



File : src/app/parameter/usage-detail/usage-detail-list/usage-detail-list.component.html
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



File : src/app/parameter/usage-detail/usage-detail-list/usage-detail-list.component.spec.ts
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



File : src/app/parameter/usage-detail/usage-detail-criteria/usage-detail-criteria.component.ts
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



File : src/app/parameter/usage-detail/usage-detail-criteria/usage-detail-criteria.component.spec.ts
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



File : src/app/parameter/usage-detail/usage-detail-criteria/usage-detail-criteria.component.html
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



File : 
```ts

```



File : 
```ts

```



File : 
```ts

```



File : 
```ts

```



File : 
```ts

```



File : 
```ts

```



File : 
```ts

```



File : 
```ts

```



File : 
```ts

```





