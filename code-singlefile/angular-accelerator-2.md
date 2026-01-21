<!-- Continued -->

#libs-Folder => angular-accelerator 

********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-accelerator  > src > index.ts

```ts
// injection tokens + related utilities

// directives
export * from './lib/directives/content-container.directive'
export * from './lib/directives/content.directive'
export * from './lib/directives/if-permission.directive'
export * from './lib/directives/if-breakpoint.directive'
export * from './lib/directives/src.directive'
export * from './lib/directives/advanced.directive'
export * from './lib/directives/tooltipOnOverflow.directive'
export * from './lib/directives/template.directive'
export * from './lib/directives/basic.directive'
export * from './lib/directives/loading-indicator.directive'

// components
export * from './lib/components/column-group-selection/column-group-selection.component'
export * from './lib/components/content/content.component'
export * from './lib/components/content-container/content-container.component'
export * from './lib/components/custom-group-column-selector/custom-group-column-selector.component'
export * from './lib/components/data-layout-selection/data-layout-selection.component'
export * from './lib/components/data-list-grid/data-list-grid.component'
export * from './lib/components/data-list-grid-sorting/data-list-grid-sorting.component'
export * from './lib/components/data-table/data-table.component'
export * from './lib/components/data-view/data-view.component'
export * from './lib/components/diagram/diagram.component'
export * from './lib/components/filter-view/filter-view.component'
export * from './lib/components/group-by-count-diagram/group-by-count-diagram.component'
export * from './lib/components/interactive-data-view/interactive-data-view.component'
export * from './lib/components/lifecycle/lifecycle.component'
export * from './lib/components/page-header/page-header.component'
export * from './lib/components/search-header/search-header.component'
export * from './lib/components/dialog/dialog-message-content/dialog-message-content.component'
export * from './lib/components/loading-indicator/loading-indicator.component'
export * from './lib/components/dialog/dialog-content/dialog-content.component'
export * from './lib/components/dialog/dialog-inline/dialog-inline.component'
export * from './lib/components/dialog/dialog-footer/dialog-footer.component'
export * from './lib/components/error-component/global-error.component'

// services
export * from './lib/services/breadcrumb.service'
export * from './lib/services/portal-dialog.service'
export * from './lib/services/export-data.service'

// pipes
export * from './lib/pipes/dynamic.pipe'
export * from './lib/pipes/ocxtimeago.pipe'
export * from './lib/pipes/relative-date.pipe'

// models
export * from './lib/model/breadcrumb-menu-item.model'
export * from './lib/model/column-type.model'
export * from './lib/model/data-action'
export * from './lib/model/button-dialog'
export * from './lib/model/translation.model'

// export * from './lib/model/data-column-name-id.model'
export * from './lib/model/data-sort-direction'
export * from './lib/model/data-table-column.model'
export * from './lib/model/diagram-column'
// export * from './lib/model/diagram-data'
export * from './lib/model/diagram-type'
export * from './lib/model/filter.model'

// core
export * from './lib/angular-accelerator.module'
export * from './lib/angular-accelerator-primeng.module'

// functions
export * from './lib/functions/flatten-object'
export * from './lib/functions/at-least-one-field-filled-validator'

// utils
export * from './lib/utils/colorutils'
export * from './lib/utils/data-operation-strategy'
export * from './lib/utils/dateutils'
export * from './lib/utils/objectutils'
export * from './lib/utils/primeicon.utils'
export * from './lib/utils/enum-to-dropdown-options.utils'
export * from './lib/utils/criteria.utils'
export * from './lib/utils/string-and-array-helper-functions.utils'
export * from './lib/utils/template.utils'
export * from './lib/utils/filter.utils'
export * from './lib/utils/image-logo-url.utils'

```

FIle => onecx-portal-ui-libs > libs > angular-accelerator  > src > test-setup.ts

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

********************************************************************************************************************************



Folder => onecx-portal-ui-libs > libs > angular-accelerator  > src > lib >  

File : angular-accelerator-primeng.module.ts
```ts
import { NgModule } from '@angular/core'
import { SelectModule } from 'primeng/select'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { PickListModule } from 'primeng/picklist'
import { SelectButtonModule } from 'primeng/selectbutton'
import { DataViewModule } from 'primeng/dataview'
import { TableModule } from 'primeng/table'
import { MenuModule } from 'primeng/menu'
import { ChartModule } from 'primeng/chart'
import { MultiSelectModule } from 'primeng/multiselect'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { SkeletonModule } from 'primeng/skeleton'
import { MessageModule } from 'primeng/message'
import { SharedModule } from 'primeng/api'
import { CheckboxModule } from 'primeng/checkbox'
import { FloatLabelModule } from 'primeng/floatlabel'
import { ChipModule } from 'primeng/chip'
import { PopoverModule } from 'primeng/popover'
import { FocusTrapModule } from 'primeng/focustrap'
import { TooltipModule } from 'primeng/tooltip'
import { providePrimeNG } from 'primeng/config'
import { TimelineModule } from 'primeng/timeline'

@NgModule({
  imports: [
    BreadcrumbModule,
    ChipModule,
    CheckboxModule,
    SelectModule,
    ButtonModule,
    DialogModule,
    PickListModule,
    SelectButtonModule,
    DataViewModule,
    TableModule,
    MenuModule,
    ChartModule,
    MultiSelectModule,
    SkeletonModule,
    MessageModule,
    FloatLabelModule,
    PopoverModule,
    FocusTrapModule,
    TooltipModule,
    TimelineModule,
    SelectButtonModule,
    SharedModule,
  ],
  exports: [
    BreadcrumbModule,
    ChipModule,
    CheckboxModule,
    SelectModule,
    ButtonModule,
    DialogModule,
    PickListModule,
    SelectButtonModule,
    DataViewModule,
    TableModule,
    MenuModule,
    ChartModule,
    MultiSelectModule,
    SkeletonModule,
    MessageModule,
    FloatLabelModule,
    PopoverModule,
    FocusTrapModule,
    TooltipModule,
    TimelineModule,
    SelectButtonModule,
    SharedModule,
  ],
  providers: [providePrimeNG()],
})
export class AngularAcceleratorPrimeNgModule {}

```


File : angular-accelerator.module.ts
```ts
import { CommonModule } from '@angular/common'
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'

import { AppConfigService, UserService } from '@onecx/angular-integration-interface'
import { AngularRemoteComponentsModule } from '@onecx/angular-remote-components'

import { firstValueFrom, skip } from 'rxjs'
import { AngularAcceleratorPrimeNgModule } from './angular-accelerator-primeng.module'
import { ColumnGroupSelectionComponent } from './components/column-group-selection/column-group-selection.component'
import { CustomGroupColumnSelectorComponent } from './components/custom-group-column-selector/custom-group-column-selector.component'
import { DataLayoutSelectionComponent } from './components/data-layout-selection/data-layout-selection.component'
import { DataListGridSortingComponent } from './components/data-list-grid-sorting/data-list-grid-sorting.component'
import { DataListGridComponent } from './components/data-list-grid/data-list-grid.component'
import { DataTableComponent } from './components/data-table/data-table.component'
import { DataViewComponent } from './components/data-view/data-view.component'
import { DiagramComponent } from './components/diagram/diagram.component'
import { GroupByCountDiagramComponent } from './components/group-by-count-diagram/group-by-count-diagram.component'
import { InteractiveDataViewComponent } from './components/interactive-data-view/interactive-data-view.component'
import { PageHeaderComponent } from './components/page-header/page-header.component'
import { SearchHeaderComponent } from './components/search-header/search-header.component'
import { AdvancedDirective } from './directives/advanced.directive'
import { IfBreakpointDirective } from './directives/if-breakpoint.directive'
import { IfPermissionDirective } from './directives/if-permission.directive'
import {
  providePermissionChecker,
  provideTranslationConnectionService,
  provideTranslationPathFromMeta,
  MultiLanguageMissingTranslationHandler,
} from '@onecx/angular-utils'
import { SrcDirective } from './directives/src.directive'
import { TooltipOnOverflowDirective } from './directives/tooltipOnOverflow.directive'
import { DynamicPipe } from './pipes/dynamic.pipe'
import { OcxTimeAgoPipe } from './pipes/ocxtimeago.pipe'
import { DynamicLocaleId } from './utils/dynamic-locale-id'
import { FilterViewComponent } from './components/filter-view/filter-view.component'
import { TemplateDirective } from './directives/template.directive'
import { OcxContentComponent } from './components/content/content.component'
import { OcxContentContainerComponent } from './components/content-container/content-container.component'
import { OcxContentDirective } from './directives/content.directive'
import { OcxContentContainerDirective } from './directives/content-container.directive'
import { LifecycleComponent } from './components/lifecycle/lifecycle.component'
import { DialogMessageContentComponent } from './components/dialog/dialog-message-content/dialog-message-content.component'
import { DialogContentComponent } from './components/dialog/dialog-content/dialog-content.component'
import { DialogFooterComponent } from './components/dialog/dialog-footer/dialog-footer.component'
import { DialogInlineComponent } from './components/dialog/dialog-inline/dialog-inline.component'
import { GlobalErrorComponent } from './components/error-component/global-error.component'
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component'
import { BasicDirective } from './directives/basic.directive'
import { LoadingIndicatorDirective } from './directives/loading-indicator.directive'
import { MessageService } from 'primeng/api'

export class AngularAcceleratorMissingTranslationHandler extends MultiLanguageMissingTranslationHandler {}

function appInitializer(userService: UserService) {
  return async () => {
    await firstValueFrom(userService.lang$.pipe(skip(1)))
  }
}

@NgModule({
  imports: [
    CommonModule,
    AngularAcceleratorPrimeNgModule,
    AngularRemoteComponentsModule,
    TranslateModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ColumnGroupSelectionComponent,
    CustomGroupColumnSelectorComponent,
    DataLayoutSelectionComponent,
    DataListGridSortingComponent,
    DataListGridComponent,
    DataTableComponent,
    DataViewComponent,
    InteractiveDataViewComponent,
    LifecycleComponent,
    PageHeaderComponent,
    DynamicPipe,
    SearchHeaderComponent,
    DiagramComponent,
    GroupByCountDiagramComponent,
    OcxContentComponent,
    OcxContentContainerComponent,
    IfPermissionDirective,
    IfBreakpointDirective,
    SrcDirective,
    OcxTimeAgoPipe,
    AdvancedDirective,
    TooltipOnOverflowDirective,
    FilterViewComponent,
    TemplateDirective,
    OcxContentDirective,
    OcxContentContainerDirective,
    GlobalErrorComponent,
    LoadingIndicatorComponent,
    LoadingIndicatorDirective,
    BasicDirective,
    DialogFooterComponent,
    DialogContentComponent,
    DialogInlineComponent,
    DialogMessageContentComponent,
  ],
  providers: [
    providePermissionChecker(),
    {
      provide: LOCALE_ID,
      useClass: DynamicLocaleId,
      deps: [UserService],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [UserService],
      multi: true,
    },
    provideTranslationPathFromMeta(import.meta.url, 'onecx-angular-accelerator/assets/i18n/'),
    provideTranslationPathFromMeta(import.meta.url, 'onecx-angular-accelerator/assets/i18n/primeng/'),
    {
      provide: MessageService,
      useClass: MessageService,
    },
    AppConfigService,
    provideTranslationConnectionService(),
  ],
  exports: [
    AngularRemoteComponentsModule,
    ColumnGroupSelectionComponent,
    CustomGroupColumnSelectorComponent,
    DataLayoutSelectionComponent,
    DataListGridComponent,
    DataTableComponent,
    DataViewComponent,
    InteractiveDataViewComponent,
    LifecycleComponent,
    PageHeaderComponent,
    SearchHeaderComponent,
    DiagramComponent,
    GroupByCountDiagramComponent,
    OcxContentComponent,
    OcxContentContainerComponent,
    IfPermissionDirective,
    IfBreakpointDirective,
    SrcDirective,
    OcxTimeAgoPipe,
    AdvancedDirective,
    TooltipOnOverflowDirective,
    FilterViewComponent,
    TemplateDirective,
    OcxContentDirective,
    OcxContentContainerDirective,
    GlobalErrorComponent,
    LoadingIndicatorComponent,
    LoadingIndicatorDirective,
    BasicDirective,
    DialogFooterComponent,
    DialogContentComponent,
    DialogInlineComponent,
    DialogMessageContentComponent,
  ],
})
export class AngularAcceleratorModule {}

```


File : storybook-breadcrumb.module.ts
```ts
import { ModuleWithProviders, NgModule, inject } from '@angular/core'
import { BreadCrumbMenuItem } from './model/breadcrumb-menu-item.model'
import { BreadcrumbService } from './services/breadcrumb.service'
import { StorybookTranslateModule } from './storybook-translate.module'

@NgModule({
  imports: [StorybookTranslateModule],
})
export class StorybookBreadcrumbModule {
  constructor() {
    const breadcrumbService = inject(BreadcrumbService)
    const breadcrumbs = inject<BreadCrumbMenuItem[]>('BREADCRUMBS' as any)

    breadcrumbService.setItems(breadcrumbs)
  }

  public static init(breadcrumbs: BreadCrumbMenuItem[]): ModuleWithProviders<StorybookBreadcrumbModule> {
    const module: ModuleWithProviders<StorybookBreadcrumbModule> = {
      ngModule: StorybookBreadcrumbModule,
      providers: [{ provide: 'BREADCRUMBS', useValue: breadcrumbs }],
    }
    return module
  }
}

```


File : storybook-theme.module.ts
```ts
import { NgModule } from '@angular/core'
import { providePrimeNG } from 'primeng/config'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { CustomPreset } from '@onecx/angular-utils/theme/primeng'

/**
  A utility module adding theme for Storybook stories
 **/
@NgModule({
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: CustomPreset,
        options: { darkModeSelector: false },
      },
    }),
  ],
})
export class StorybookThemeModule {}

```


File : storybook-translate.module.ts
```ts
import { registerLocaleData } from '@angular/common'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import localeDE from '@angular/common/locales/de'
import { NgModule, inject } from '@angular/core'
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { TRANSLATION_PATH, TranslateCombinedLoader, createTranslateLoader } from '@onecx/angular-utils'

export function translateLoader(http: HttpClient) {
  return new TranslateCombinedLoader(new TranslateHttpLoader(http, `./assets/i18n/`, '.json'))
}
/**
 * StorybookTranslateModule
 *
 * Add feature-specific translation files (e.g., only pageheader keys) to libs/angular-accelerator/assets/i18n/.
 *
 * Reference each file in TRANSLATION_PATH using its base path (e.g., '/assets/i18n/page-header').
 * The loader will append the language suffix and .json automatically.
 *
 * Example:
 *   { provide: TRANSLATION_PATH, useValue: '/assets/i18n/page-header', multi: true }
 **/
const STORYBOOK_TRANSLATION_PROVIDERS = [
  {
    provide: TRANSLATION_PATH,
    useValue: '/assets/i18n/',
    multi: true,
  },
  {
    provide: TRANSLATION_PATH,
    useValue: '/assets/i18n/storybook-translations/page-header/',
    multi: true,
  }
]

@NgModule({
  exports: [TranslateModule],
  imports: [
    TranslateModule.forRoot({
      isolate: true,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    provideAppStateServiceMock(),
    provideHttpClient(withInterceptorsFromDi()),
    ...STORYBOOK_TRANSLATION_PROVIDERS
  ],
})
export class StorybookTranslateModule {
  constructor(...args: unknown[])

  constructor() {
    const translateService = inject(TranslateService)
    registerLocaleData(localeDE)
    const lang = translateService.getBrowserLang()
    const supportedLanguages = ['de', 'en']
    if (lang && supportedLanguages.includes(lang)) {
      translateService.use(lang)
    } else {
      translateService.use('en')
    }
  }
}

```



********************************************************************************************************************************

Folder : onecx-portal-ui-libs > libs > angular-accelerator > src > lib > directives

File : advanced.directive.ts
```ts
import { Directive, DoCheck, TemplateRef, ViewContainerRef, inject } from '@angular/core'
import { SearchHeaderComponent } from '../components/search-header/search-header.component'

@Directive({ selector: '[ocxAdvanced]', standalone: false })
export class AdvancedDirective implements DoCheck {
  private viewContainer = inject(ViewContainerRef)
  private templateRef = inject<TemplateRef<any>>(TemplateRef, { optional: true })
  private searchHeader = inject(SearchHeaderComponent, { optional: true })

  constructor() {
    const searchHeader = this.searchHeader

    if (!searchHeader) {
      throw 'Advanced directive can only be used inside search header component'
    }
    searchHeader.hasAdvanced = true
  }
  ngDoCheck(): void {
    if (this.searchHeader?.viewMode === 'advanced') {
      if (this.templateRef && !this.viewContainer.length) {
        this.viewContainer.createEmbeddedView(this.templateRef)
      }
    } else {
      this.viewContainer.clear()
    }
  }
}

```


File : basic. directive.ts
```ts
import { Directive, DoCheck, TemplateRef, ViewContainerRef, inject } from '@angular/core'
import { SearchHeaderComponent } from '../components/search-header/search-header.component'

@Directive({ selector: '[ocxBasic]', standalone: false })
export class BasicDirective implements DoCheck {
  private viewContainer = inject(ViewContainerRef)
  private templateRef = inject<TemplateRef<any>>(TemplateRef, { optional: true })
  private searchHeader = inject(SearchHeaderComponent, { optional: true })

  constructor() {
    const searchHeader = this.searchHeader

    if (!searchHeader) {
      throw 'Basic directive can only be used inside search header component'
    }
  }
  ngDoCheck(): void {
    if (this.searchHeader?.viewMode === 'basic') {
      if (this.templateRef && !this.viewContainer.length) {
        this.viewContainer.createEmbeddedView(this.templateRef)
      }
    } else {
      this.viewContainer.clear()
    }
  }
}

```


File : content-container.directive.ts
```ts
import { Directive, ElementRef, Input, OnChanges, OnInit, inject } from '@angular/core'

@Directive({ selector: '[ocxContentContainer]', standalone: false })
export class OcxContentContainerDirective implements OnInit, OnChanges {
  private el = inject(ElementRef)

  /**
   * Used for passing the direction, in which the content inside the container should be rendered.
   * Default: horizontal
   * @example [ocxContentContainer]="horizontal"
   * @example [ocxContentContainer]="vertical"
   */
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal'

  /**
   * Used for passing in the breakpoint below which a horizontal layout should switch to a vertical layout.
   * Only necessary if horizontal layout is used
   * Default: md
   */
  @Input() breakpoint: 'sm' | 'md' | 'lg' | 'xl' = 'md'

  ngOnInit() {
    this.el.nativeElement.classList.add('flex', 'gap-3', 'flex-column', 'md:flex-row')
    this.addContainerStyles()
  }

  ngOnChanges() {
    this.addContainerStyles()
  }

  private addContainerStyles() {
    const addClasses = (classes: string[]) => this.el.nativeElement.classList.add(...classes)
    const removeClasses = (classes: string[]) => this.el.nativeElement.classList.remove(...classes)
    // We need to ensure that all breakpoint dependent flex-row classes are removed from the element
    // This way we can avoid multiple contradictory layout classes and unexpected effects
    const removeResponsiveLayoutClasses = () => {
      const classesToRemove: string[] = []
      const regexPattern = /\w+:flex-row$/
      this.el.nativeElement.classList.forEach((className: string) => {
        if (regexPattern.test(className)) {
          classesToRemove.push(className)
        }
      })
      removeClasses(classesToRemove)
    }
    const addSharedClasses = () => {
      let styleClasses = Array.from(this.el.nativeElement.classList as string[])
      const defaultClasses = ['gap-3', 'flex-column', 'md:flex-row']
      removeClasses(defaultClasses)
      if (styleClasses.some((cls) => cls.startsWith('gap-') && cls !== 'gap-3')) {
        styleClasses = styleClasses.filter((cls) => !cls.startsWith('gap-3'))
      }
      const flexClasses = ['flex-row', 'flex-row-reverse', 'flex-column-reverse']
      if (styleClasses.some((cls) => flexClasses.includes(cls))) {
        styleClasses = styleClasses.filter((cls) => cls !== 'flex-column')
      }
      if (this.layout != 'vertical') {
        const responsiveLayoutClass = `${this.breakpoint || 'md'}:flex-row`
        styleClasses.push(responsiveLayoutClass)
      }
      addClasses(styleClasses)
    }

    removeResponsiveLayoutClasses()
    addSharedClasses()
  }
}
```


File : content.directive.ts
```ts
import { Directive, ElementRef, Input, OnChanges, OnInit, inject } from '@angular/core'

@Directive({ selector: '[ocxContent]', standalone: false })
export class OcxContentDirective implements OnInit, OnChanges {
  private el = inject(ElementRef)

  /**
   * Used for passing a title text which should be rendered in the upper left corner of the content area.
   * @example [ocxContent]="My Cool Title"
   */
  @Input() ocxContent = ''

  private baseId = 'ocx_content_title_element'
  private titleElementId: string | undefined

  ngOnInit() {
    this.titleElementId = this.getUniqueTitleID(this.baseId)
    this.init()
  }

  ngOnChanges() {
    this.init()
  }

  private init() {
    this.addContentStyles()
    if (this.ocxContent) {
      this.prependTitle()
    } else {
      this.removeTitle()
    }
  }

  private addContentStyles() {
    const addClasses = (classes: string[]) => this.el.nativeElement.classList.add(...classes)
    addClasses(['card'])
  }

  private prependTitle() {
    if (this.titleElementId) {
      const titleElement = this.el.nativeElement.querySelector(`#${this.titleElementId}`)
      if (titleElement) {
        titleElement.textContent = this.ocxContent
      } else {
        const title = document.createElement('p')
        title.classList.add('font-medium')
        title.classList.add('text-lg')
        title.id = this.titleElementId
        title.textContent = this.ocxContent
        this.el.nativeElement.prepend(title)
      }
    }
  }

  private getUniqueTitleID(baseId: string) {
    let counter = 0
    let generatedID = baseId

    while (document.getElementById(generatedID)) {
      generatedID = baseId + counter
      counter++
    }

    return generatedID
  }

  private removeTitle() {
    if (this.titleElementId) {
      const titleElement = this.el.nativeElement.querySelector(`#${this.titleElementId}`)
      if (titleElement) {
        titleElement.remove()
      }
    }
  }
}

```


File : if-breakpoint.directive.ts
```ts
import { Directive, HostListener, Input, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core'

@Directive({ selector: '[ocxIfBreakpoint]', standalone: false })
export class IfBreakpointDirective implements OnInit {
  private viewContainer = inject(ViewContainerRef)
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef, { optional: true })

  @Input('ocxIfBreakpoint') breakpoint: 'mobile' | 'desktop' | undefined

  @Input()
  ocxIfBreakpointElseTemplate: TemplateRef<any> | undefined

  state: 'mobile' | 'desktop' | undefined

  ngOnInit() {
    this.onResize()
  }

  @HostListener('window:resize')
  onResize() {
    const mobileBreakpointVar = getComputedStyle(document.documentElement).getPropertyValue('--mobile-break-point')
    const isMobile = window.matchMedia(`(max-width: ${mobileBreakpointVar})`).matches
    const isDesktop = !isMobile
    const newState = isMobile ? 'mobile' : 'desktop'
    if ((this.breakpoint === 'mobile' && isMobile) || (this.breakpoint === 'desktop' && isDesktop)) {
      if (this.templateRef && newState !== this.state) {
        this.viewContainer.clear()
        this.viewContainer.createEmbeddedView(this.templateRef)
      }
    } else {
      if (this.ocxIfBreakpointElseTemplate && newState !== this.state) {
        this.viewContainer.clear()
        this.viewContainer.createEmbeddedView(this.ocxIfBreakpointElseTemplate)
      }
    }
    this.state = newState
  }
}

```


File : if-permission.directive.spects
```ts
import { Component, TemplateRef, ViewContainerRef } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Renderer2 } from '@angular/core'
import { IfPermissionDirective } from './if-permission.directive'
import { HAS_PERMISSION_CHECKER, HasPermissionChecker } from '@onecx/angular-utils'
import { BehaviorSubject, of } from 'rxjs'
import { provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { UserService } from '@onecx/angular-integration-interface'

// Simple component to test the directive
@Component({
  selector: 'ocx-simple',
  standalone: false,
  template: ` <div *ocxIfPermission="'test-permission'">Visible</div> `,
})
class SimpleComponent {}

// Component with multiple permissions
@Component({
  selector: 'ocx-simple',
  standalone: false,
  template: ` <div *ocxIfPermission="['test-permission', 'second-permission']">Visible</div> `,
})
class MultiplePermissionComponent {}

// Component with else template
@Component({
  selector: 'ocx-with-else',
  standalone: false,
  template: `
    <div *ocxIfPermission="'missing-permission'; elseTemplate: elseBlock">Hidden</div>
    <ng-template #elseBlock><div>Else Block</div></ng-template>
  `,
})
class WithElseTemplateComponent {}

// Component with onMissingPermission set to 'disable'
@Component({
  selector: 'ocx-on-missing-disabled',
  standalone: false,
  template: ` <div *ocxIfPermission="'test-disabled'; onMissingPermission: 'disable'">Disabled</div>`,
})
class OnMissingDisabledComponent {}

// Component with provided permissions array including the required permission
@Component({
  selector: 'ocx-with-provided',
  standalone: false,
  template: ` <div *ocxIfPermission="'provided-permission'; permissions: ['provided-permission']">
    Show with provided-permission
  </div>`,
})
class WithProvidedPermissionsComponent {}

// Component with provided permissions array not including the required permission
@Component({
  selector: 'ocx-with-missing-provided',
  standalone: false,
  template: ` <div *ocxIfPermission="'missing-permission'; permissions: ['provided-permission']">
    Show with provided-permission
  </div>`,
})
class WithMissingProvidedPermissionsComponent {}

// Component with undefined permission
@Component({
  selector: 'ocx-with-undefined',
  standalone: false,
  template: ` <div *ocxIfPermission="">Show not show</div>`,
})
class WithUndefinedPermissionComponent {}

// Simple component to test the negate functionality of the directive
@Component({
  selector: 'ocx-negate-simple',
  standalone: false,
  template: ` <div *ocxIfNotPermission="'test-permission'">Visible</div> `,
})
class NegateSimpleComponent {}

// Component with else template for negate
@Component({
  selector: 'ocx-negate-with-else',
  standalone: false,
  template: `
    <div *ocxIfNotPermission="'missing-permission'; elseTemplate: elseBlock">Hidden</div>
    <ng-template #elseBlock><div>Else Block</div></ng-template>
  `,
})
class NegateWithElseTemplateComponent {}

// Component with onMissingPermission set to 'disable' for negate
@Component({
  selector: 'ocx-negate-on-missing-disabled',
  standalone: false,
  template: ` <div *ocxIfNotPermission="'test-disabled'; onMissingPermission: 'disable'">Disabled</div>`,
})
class NegateOnMissingDisabledComponent {}

// Component with provided permissions array including the required permission for negate
@Component({
  selector: 'ocx-negate-with-provided',
  standalone: false,
  template: ` <div *ocxIfNotPermission="'provided-permission'; permissions: ['provided-permission']">
    Show with provided-permission
  </div>`,
})
class NegateWithProvidedPermissionsComponent {}

// Component with provided permissions array not including the required permission for negate
@Component({
  selector: 'ocx-negate-with-missing-provided',
  standalone: false,
  template: ` <div *ocxIfNotPermission="'missing-permission'; permissions: ['provided-permission']">
    Show with provided-permission
  </div>`,
})
class NegateWithMissingProvidedPermissionsComponent {}

// Component with undefined permission for negate
@Component({
  selector: 'ocx-negate-with-undefined',
  standalone: false,
  template: ` <div *ocxIfNotPermission="">Show not show</div>`,
})
class NegateWithUndefinedPermissionComponent {}

describe('IfPermissionDirective', () => {
  let fixture: ComponentFixture<any>
  let mockPermissionChecker: jest.Mocked<HasPermissionChecker>
  let getPermissionsMock: jest.Mock

  beforeEach(() => {
    mockPermissionChecker = {
      getPermissions: jest.fn(),
      hasPermission: jest.fn(),
    }

    TestBed.configureTestingModule({
      declarations: [
        SimpleComponent,
        WithElseTemplateComponent,
        OnMissingDisabledComponent,
        WithProvidedPermissionsComponent,
        WithUndefinedPermissionComponent,
        WithMissingProvidedPermissionsComponent,
        MultiplePermissionComponent,
        NegateSimpleComponent,
        NegateWithElseTemplateComponent,
        NegateOnMissingDisabledComponent,
        NegateWithProvidedPermissionsComponent,
        NegateWithUndefinedPermissionComponent,
        NegateWithMissingProvidedPermissionsComponent,
        IfPermissionDirective,
      ],
      providers: [
        Renderer2,
        ViewContainerRef,
        TemplateRef,
        { provide: HAS_PERMISSION_CHECKER, useValue: mockPermissionChecker },
        provideUserServiceMock(),
      ],
    })

    jest.resetAllMocks()
    getPermissionsMock = mockPermissionChecker.getPermissions as jest.Mock
  })

  it('should throw error if neither UserService nor HasPermissionChecker is provided', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      declarations: [SimpleComponent, IfPermissionDirective],
      providers: [
        Renderer2,
        ViewContainerRef,
        TemplateRef,
        {
          provide: HAS_PERMISSION_CHECKER,
          useValue: null,
        },
        {
          provide: UserService,
          useValue: null,
        },
      ],
    })

    expect(() => {
      fixture = TestBed.createComponent(SimpleComponent)
      fixture.detectChanges()
    }).toThrow('IfPermission requires UserService or HasPermissionChecker to be provided!')
  })

  it('should be usable with array of permissions', () => {
    getPermissionsMock.mockReturnValue(of(['test-permission', 'second-permission']))

    fixture = TestBed.createComponent(MultiplePermissionComponent)
    fixture.detectChanges()

    const visibleElement = fixture.nativeElement.querySelector('div')
    expect(visibleElement.textContent).toContain('Visible')
  })

  describe('ifPermission', () => {
    it('should display the element if user has permission', () => {
      getPermissionsMock.mockReturnValue(of(['test-permission']))

      fixture = TestBed.createComponent(SimpleComponent)
      fixture.detectChanges()

      const visibleElement = fixture.nativeElement.querySelector('div')
      expect(visibleElement.textContent).toContain('Visible')
    })

    it('should not display the element if user does not have permission', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(WithElseTemplateComponent)
      fixture.detectChanges()

      const hiddenElement = fixture.nativeElement.querySelector('div:contains("Hidden")')
      expect(hiddenElement).toBeNull()
    })

    it('should display the else block if user does not have permission', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(WithElseTemplateComponent)
      fixture.detectChanges()

      const elseBlock = fixture.nativeElement.querySelector('div')
      expect(elseBlock.textContent).toContain('Else Block')
    })

    it('should display disabled element if user does not have permission', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(OnMissingDisabledComponent)
      fixture.detectChanges()

      // Get the disabled attribute from fixture element
      const disabledDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement
      expect(disabledDiv).toBeTruthy()
      expect(disabledDiv.textContent).toContain('Disabled')
      expect(disabledDiv.hasAttribute('disabled')).toBeTruthy()
    })

    it('should use provided permissions array to check permissions', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(WithProvidedPermissionsComponent)
      fixture.detectChanges()

      const visibleDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement
      expect(visibleDiv).toBeTruthy()
      expect(visibleDiv.textContent).toContain('Show with provided-permission')
    })

    it('should log if provided permissions array does not contain permission', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(WithMissingProvidedPermissionsComponent)
      fixture.detectChanges()

      const element = fixture.nativeElement.querySelector('div')
      expect(element).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('👮‍♀️ No permission in overwrites for: `', ['missing-permission'])
    })

    it('should not show if permission is undefined', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(WithUndefinedPermissionComponent)
      fixture.detectChanges()

      const element = fixture.nativeElement.querySelector('div')
      expect(element).toBeNull()
    })

    it('should react to permission changes', () => {
      const permissionSubject$ = new BehaviorSubject<string[]>([])

      getPermissionsMock.mockImplementation((_permissions: string[] | string) => {
        return permissionSubject$.asObservable()
      })

      fixture = TestBed.createComponent(SimpleComponent)
      fixture.detectChanges()

      const element = fixture.nativeElement.querySelector('div')
      expect(element).toBeNull()

      permissionSubject$.next(['test-permission'])
      fixture.detectChanges()

      const visibleElement = fixture.nativeElement.querySelector('div')
      expect(visibleElement.textContent).toContain('Visible')
    })

    it('should remove disabled attribute when permission is granted', () => {
      const permissionSubject$ = new BehaviorSubject<string[]>([])

      getPermissionsMock.mockImplementation((_permissions: string[] | string) => {
        return permissionSubject$.asObservable()
      })

      fixture = TestBed.createComponent(OnMissingDisabledComponent)
      fixture.detectChanges()

      // Get the disabled attribute from fixture element
      let disabledDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement
      expect(disabledDiv).toBeTruthy()
      expect(disabledDiv.textContent).toContain('Disabled')
      expect(disabledDiv.hasAttribute('disabled')).toBeTruthy()

      permissionSubject$.next(['test-disabled'])
      fixture.detectChanges()

      disabledDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement
      expect(disabledDiv).toBeTruthy()
      expect(disabledDiv.textContent).toContain('Disabled')
      expect(disabledDiv.hasAttribute('disabled')).toBeFalsy()
    })
  })

  describe('ifNotPermission', () => {
    it('should not display the element if user has permission', () => {
      getPermissionsMock.mockReturnValue(of(['test-permission']))

      fixture = TestBed.createComponent(NegateSimpleComponent)
      fixture.detectChanges()

      const visibleElement = fixture.nativeElement.querySelector('div')
      expect(visibleElement).toBeNull()
    })

    it('should display the element if user does not have permission', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(NegateWithElseTemplateComponent)
      fixture.detectChanges()

      const hiddenElement = fixture.nativeElement.querySelector('div')
      expect(hiddenElement.textContent).toContain('Hidden')
    })

    it('should display the else block if user has permission', () => {
      getPermissionsMock.mockReturnValue(of(['missing-permission']))

      fixture = TestBed.createComponent(NegateWithElseTemplateComponent)
      fixture.detectChanges()

      const elseBlock = fixture.nativeElement.querySelector('div')
      expect(elseBlock.textContent).toContain('Else Block')
    })

    it('should display disabled element if user has permission', () => {
      getPermissionsMock.mockReturnValue(of(['test-disabled']))

      fixture = TestBed.createComponent(NegateOnMissingDisabledComponent)
      fixture.detectChanges()

      // Get the disabled attribute from fixture element
      const disabledDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement
      expect(disabledDiv).toBeTruthy()
      expect(disabledDiv.textContent).toContain('Disabled')
      expect(disabledDiv.hasAttribute('disabled')).toBeTruthy()
    })

    it('should use provided permissions array to check permissions', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(NegateWithMissingProvidedPermissionsComponent)
      fixture.detectChanges()

      const visibleDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement
      expect(visibleDiv).toBeTruthy()
      expect(visibleDiv.textContent).toContain('Show with provided-permission')
    })

    it('should log if provided permissions array does not contain permission', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(NegateWithMissingProvidedPermissionsComponent)
      fixture.detectChanges()

      expect(consoleSpy).toHaveBeenCalledWith('👮‍♀️ No permission in overwrites for: `', ['missing-permission'])
    })

    it('should not show if permission is undefined', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(NegateWithUndefinedPermissionComponent)
      fixture.detectChanges()

      const element = fixture.nativeElement.querySelector('div')
      expect(element).toBeNull()
    })

    it('should react to permission changes', () => {
      const permissionSubject$ = new BehaviorSubject<string[]>(['test-permission'])

      getPermissionsMock.mockImplementation((_permissions: string[] | string) => {
        return permissionSubject$.asObservable()
      })

      fixture = TestBed.createComponent(NegateSimpleComponent)
      fixture.detectChanges()

      const element = fixture.nativeElement.querySelector('div')
      expect(element).toBeNull()

      permissionSubject$.next([])
      fixture.detectChanges()

      const visibleElement = fixture.nativeElement.querySelector('div')
      expect(visibleElement.textContent).toContain('Visible')
    })

    it('should remove disabled attribute when permission is granted', () => {
      const permissionSubject$ = new BehaviorSubject<string[]>(['test-disabled'])

      getPermissionsMock.mockImplementation((_permissions: string[] | string) => {
        return permissionSubject$.asObservable()
      })

      fixture = TestBed.createComponent(NegateOnMissingDisabledComponent)
      fixture.detectChanges()

      // Get the disabled attribute from fixture element
      let disabledDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement
      expect(disabledDiv).toBeTruthy()
      expect(disabledDiv.textContent).toContain('Disabled')
      expect(disabledDiv.hasAttribute('disabled')).toBeTruthy()

      permissionSubject$.next([])
      fixture.detectChanges()

      disabledDiv = fixture.nativeElement.querySelector('div') as HTMLDivElement
      expect(disabledDiv).toBeTruthy()
      expect(disabledDiv.textContent).toContain('Disabled')
      expect(disabledDiv.hasAttribute('disabled')).toBeFalsy()
    })
  })
})

```


File : if-permission.directivets
```ts
import {
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER, HasPermissionChecker } from '@onecx/angular-utils'
import { BehaviorSubject, from, Observable, of, switchMap } from 'rxjs'

@Directive({ selector: '[ocxIfPermission], [ocxIfNotPermission]', standalone: false })
export class IfPermissionDirective implements OnInit {
  private renderer = inject(Renderer2)
  private el = inject(ElementRef)
  private viewContainer = inject(ViewContainerRef)
  private hasPermissionChecker = inject<HasPermissionChecker>(HAS_PERMISSION_CHECKER, { optional: true })
  private templateRef = inject<TemplateRef<any>>(TemplateRef, { optional: true })
  private userService = inject(UserService, { optional: true })

  @Input('ocxIfPermission') set permission(value: string | string[] | undefined) {
    this.permissionSubject$.next(value)
  }
  @Input('ocxIfNotPermission') set notPermission(value: string | string[] | undefined) {
    this.permissionSubject$.next(value)
    this.negate = true
  }

  @Input() ocxIfPermissionOnMissingPermission: 'hide' | 'disable' = 'hide'
  @Input() set ocxIfNotPermissionOnMissingPermission(value: 'hide' | 'disable') {
    this.ocxIfPermissionOnMissingPermission = value
  }
  @Input() onMissingPermission: 'hide' | 'disable' = 'hide'

  @Input() ocxIfPermissionPermissions: string[] | undefined
  @Input()
  set ocxIfNotPermissionPermissions(value: string[] | undefined) {
    this.ocxIfPermissionPermissions = value
  }

  @Input()
  ocxIfPermissionElseTemplate: TemplateRef<any> | undefined
  @Input()
  set ocxIfNotPermissionElseTemplate(value: TemplateRef<any> | undefined) {
    this.ocxIfPermissionElseTemplate = value
  }

  private permissionChecker: HasPermissionChecker
  private permissionSubject$ = new BehaviorSubject<string | string[] | undefined>(undefined)
  private isDisabled = false
  private directiveContentRef: EmbeddedViewRef<any> | undefined
  negate = false

  constructor() {
    const validChecker = this.hasPermissionChecker || this.userService
    if (!validChecker) {
      throw 'IfPermission requires UserService or HasPermissionChecker to be provided!'
    }

    this.permissionChecker = validChecker
  }

  ngOnInit() {
    this.permissionSubject$
      .pipe(
        switchMap((permission) => {
          if (!permission) {
            return of(false)
          }
          const permissionsArray = Array.isArray(permission) ? permission : [permission]
          return this.hasPermission(permissionsArray)
        })
      )
      .subscribe((hasPermission) => {
        const shouldShowTemplate = this.negate ? !hasPermission : hasPermission
        if (shouldShowTemplate) {
          return this.showTemplateOrClear()
        }

        return this.showElseTemplateOrDefaultView()
      })
  }

  private hasPermission(permission: string[]): Observable<boolean> {
    if (this.ocxIfPermissionPermissions) {
      const result = permission.every((p) => this.ocxIfPermissionPermissions?.includes(p))
      if (!result) {
        console.log('👮‍♀️ No permission in overwrites for: `', permission)
      }
      return of(result)
    }

    if (this.permissionChecker.getPermissions) {
      return this.permissionChecker.getPermissions().pipe(
        switchMap((permissions) => {
          const result = permission.every((p) => permissions.includes(p))
          if (!result) {
            console.log('👮‍♀️ No permission from permission checker for: `', permission)
          }
          return of(result)
        })
      )
    }

    return from(this.permissionChecker.hasPermission(permission))
  }

  private showTemplateOrClear() {
    this.resetView()

    if (this.templateRef) {
      this.directiveContentRef = this.viewContainer.createEmbeddedView(this.templateRef)
    }
  }

  private showElseTemplateOrDefaultView() {
    this.resetView()
    if (this.ocxIfPermissionElseTemplate) {
      this.viewContainer.createEmbeddedView(this.ocxIfPermissionElseTemplate)
      return
    }

    if (this.ocxIfPermissionOnMissingPermission === 'disable' && this.templateRef) {
      this.directiveContentRef = this.viewContainer.createEmbeddedView(this.templateRef)

      const el = this.getElement()
      el && this.renderer.setAttribute(el, 'disabled', 'disabled')
      this.isDisabled = true
    }
  }

  private resetView() {
    this.viewContainer.clear()
    if (this.isDisabled) {
      this.isDisabled = false
      const el = this.getElement()
      el && this.renderer.removeAttribute(el, 'disabled')
    }
  }

  private getElement(): Node | undefined {
    return this.directiveContentRef?.rootNodes[0]
  }
}

```


File : loading-indicator.directivescss
```scss
$overlay-bg-color: rgba(0, 0, 0, 0.5);
$loader-border-bottom-color: transparent;

/* You can add global styles to this file, and also import other style files */
@keyframes rotation {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
.element-overlay {
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: $overlay-bg-color;
		z-index: 1;
	}
	position: relative;
	width: 100%;
	cursor: default;
	pointer-events: none;
}
.loader {
	width: 28px;
	height: 28px;
	border: 3px solid var(--primary-color);
	border-bottom-color: $loader-border-bottom-color;
	border-radius: 50%;
	display: inline-block;
	box-sizing: border-box;
	animation: rotation 1s linear infinite;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 2;
	&.loader-small {
		width: 20px;
		height: 20px;
		top: 20%;
		left: 45%;
	}
}

```


File : loading-indicator.directive.ts
```ts
import {
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
  inject,
} from '@angular/core'
import { LoadingIndicatorComponent } from '../components/loading-indicator/loading-indicator.component'


@Directive({
  selector: '[ocxLoadingIndicator]',
  standalone: false,
})
export class LoadingIndicatorDirective implements OnChanges {
  private viewContainerRef = inject(ViewContainerRef)
  private el = inject(ElementRef)
  private renderer = inject(Renderer2)

  @Input() ocxLoadingIndicator = false
  @Input() overlayFullPage = false
  @Input() isLoaderSmall? = false

  private componentRef: ComponentRef<LoadingIndicatorComponent> | undefined

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ocxLoadingIndicator'] || changes['overlayFullPage']) {
      this.toggleLoadingIndicator()
    }
  }

  private elementLoader() {
    this.renderer.addClass(this.el.nativeElement, 'element-overlay')
    const loaderElement = document.createElement('div')
    loaderElement.className = 'loader'
    if (this.isLoaderSmall) {
      loaderElement.className = 'loader loader-small'
    }
    this.renderer.appendChild(this.el.nativeElement, loaderElement)
  }

  private toggleLoadingIndicator() {
    if (this.ocxLoadingIndicator) {
      if (this.overlayFullPage == false) {
        this.elementLoader()
      } else {
        this.componentRef = this.viewContainerRef.createComponent(LoadingIndicatorComponent)
      }
    } else {
      this.viewContainerRef.clear()
      if (this.componentRef) {
        this.componentRef.destroy()
      }
    }
  }
}

```


File : src.directive.ts
```ts
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Directive, ElementRef, EventEmitter, Input, Output, inject } from '@angular/core'

@Directive({ selector: '[ocxSrc]', standalone: false })
export class SrcDirective {
  private el = inject(ElementRef)
  private httpClient = inject(HttpClient)

  private _src: string | undefined

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() error = new EventEmitter<void>()

  @Input()
  get ocxSrc(): string | undefined {
    return this._src
  }
  set ocxSrc(value: string | undefined) {
    if (value && this._src !== value && window.location.hostname) {
      try {
        if (new URL(value, window.location.origin).hostname === window.location.hostname) {
          this.httpClient.get(value, { observe: 'response', responseType: 'blob' }).subscribe(
            (response: HttpResponse<Blob>) => {
              // ok with content
              if (response?.status === 200) {
                const url = URL.createObjectURL(response.body as Blob)
                this.el.nativeElement.addEventListener('load', () => {
                  URL.revokeObjectURL(url)
                })
                this.el.nativeElement.src = url
              }
              // no content
              if (response?.status === 204) {
                this.error.emit()
              }
            },
            () => {
              // on error
              this.error.emit()
            },
            () => {
              // on complete
              this.el.nativeElement.style.visibility = 'initial'
            }
          )
        } else {
          this.el.nativeElement.src = value
          this.el.nativeElement.style.visibility = 'initial'
        }
      } catch (error) {
        console.error('Cannot parse URL ', value, error)
        this.el.nativeElement.src = value
        this.el.nativeElement.style.visibility = 'initial'
      }
      this._src = value
    }
  }

  constructor() {
    this.el.nativeElement.style.visibility = 'hidden'
  }
}

```


File : template.directivespec.ts
```ts
import {
  AfterViewInit,
  Component,
  EmbeddedViewRef,
  QueryList,
  ViewChildren,
  ViewContainerRef,
  inject,
} from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TemplateDirective } from './template.directive'

@Component({
  standalone: false,
  selector: 'ocx-test-component',
  template: `<ng-template ocxTemplate="header"><p>header</p></ng-template>
    <ng-template ocxTemplate="content"><p>content</p></ng-template>
    <ng-template #footer><p>footer</p></ng-template>`,
})
class TestForTemplateDirectiveComponent implements AfterViewInit {
  viewContainerRef = inject(ViewContainerRef)

  @ViewChildren(TemplateDirective) templates!: QueryList<TemplateDirective>
  views: EmbeddedViewRef<any>[] = []

  ngAfterViewInit() {
    this.templates.forEach((template, _) => {
      const view = this.viewContainerRef.createEmbeddedView(template.template)
      this.views.push(view)
    })
  }
}

describe('TemplateDirective', () => {
  let component: TestForTemplateDirectiveComponent
  let fixture: ComponentFixture<TestForTemplateDirectiveComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestForTemplateDirectiveComponent, TemplateDirective],
    }).compileComponents()
    fixture = TestBed.createComponent(TestForTemplateDirectiveComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should have 2 ocx templates', async () => {
    expect(component.templates.length).toBe(2)
  })

  it('should take the correct data and type', () => {
    expect(component.templates.get(0)?.name).toBe('header')
    expect(component.templates.get(0)?.getType()).toBe('header')
    expect(component.templates.get(1)?.name).toBe('content')
    expect(component.templates.get(1)?.getType()).toBe('content')
  })

  it('should have a template reference', () => {
    expect(component.views[0].rootNodes[0].textContent).toBe('header')
    expect(component.views[1].rootNodes[0].textContent).toBe('content')
  })
})

```


File : template.directive.ts
```ts
import { Directive, Input, TemplateRef, inject } from '@angular/core'

@Directive({ selector: '[ocxTemplate]', standalone: false })
export class TemplateDirective {
  template = inject<TemplateRef<any>>(TemplateRef)

  @Input({
    required: true,
    alias: 'ocxTemplate',
  })
  name = ''

  getType(): string {
    return this.name
  }
}

```


File : tooltipOnOverfiow.directive.ts
```ts
import {
  AfterViewInit,
  Directive,
  Input,
  NgZone,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core'
import { Tooltip, TooltipStyle } from 'primeng/tooltip'

@Directive({ selector: '[ocxTooltipOnOverflow]', standalone: false, providers: [TooltipStyle] })
export class TooltipOnOverflowDirective extends Tooltip implements OnDestroy, AfterViewInit {
  mutationObserver = new MutationObserver(() => {
    this.zone.run(() => {
      this.disabled = this.el.nativeElement.scrollWidth <= this.el.nativeElement.offsetWidth
      this.setOption({ disabled: this.disabled })
    }, this)
  })

  @Input()
  get ocxTooltipOnOverflow(): string | TemplateRef<HTMLElement> | undefined {
    return this.content
  }
  set ocxTooltipOnOverflow(value: string | TemplateRef<HTMLElement> | undefined) {
    this.content = value
    this.setOption({ tooltipLabel: value })
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy()
    this.mutationObserver.disconnect()
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit()
    setTimeout(() => {
      // Needed to ensure change detection picks up the correct state of 'disabled'
      // Without this the tooltip for some elements won't update properly
      this.zone.run(() => {
        this.disabled = this.el.nativeElement.scrollWidth <= this.el.nativeElement.offsetWidth
        this.setOption({ disabled: this.disabled })
      }, this)
      this.mutationObserver.observe(this.el.nativeElement, { subtree: true, characterData: true, childList: true })
    }, 0)
  }
  constructor() {
    const zone = inject(NgZone)
    const renderer = inject(Renderer2)
    const viewContainer = inject(ViewContainerRef)

    super(zone, viewContainer)
    renderer.setStyle(this.el.nativeElement, 'text-overflow', 'ellipsis')
    renderer.setStyle(this.el.nativeElement, 'overflow', 'hidden')
    renderer.setStyle(this.el.nativeElement, 'white-space', 'nowrap')
    this.disabled = true
    this.setOption({ disabled: this.disabled })
  }
}

```




********************************************************************************************************************************

Folder : onecx-portal-ui-libs > libs > angular-accelerator > src > lib > functions

File : at-least-one-field-filled-validator.ts
```ts
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms'

export const atLeastOneFieldFilledValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
  if (Object.values(form.value).every((x) => x === null || x === undefined || x === '')) {
    return { allFieldsEmpty: true }
  }
  return null
}

```


File : flatten-object.spects
```ts
import { flattenObject } from './flatten-object'

describe('FlattenObject', () => {
  interface TestInterface {
    test1: number
    test2: string
    test3: Date
    test4: string[]
    'test5.test6': number
    'test5.test7': string
    'test5.test8': Date
    'test5.test9': string[]
  }

  it('moves all members to the top level', () => {
    const input = {
      test1: 5,
      test2: 'test1',
      test3: new Date(),
      test4: ['test3'],
      test5: {
        test6: 23,
        test7: 'test2',
        test8: new Date(),
        test9: ['test4'],
      },
    }
    const result: TestInterface = flattenObject(input)

    expect(result).toEqual({
      test1: input.test1,
      test2: input.test2,
      test3: input.test3,
      test4: input.test4,
      'test5.test6': input.test5.test6,
      'test5.test7': input.test5.test7,
      'test5.test8': input.test5.test8,
      'test5.test9': input.test5.test9,
    })
  })
})

```


File : flatten-object.ts
```ts
type Extend<TObj extends Record<string, unknown>, K extends string> = {
  [TKey in keyof TObj & string as `${K}${TKey}`]: TObj[TKey] extends Record<string, unknown>
    ? Extend<TObj[TKey], `${K}${TKey}.`>
    : TObj[TKey]
}

type NonObjectKeysOf<T> = {
  [K in keyof T]: T[K] extends Array<any> ? K : T[K] extends object ? (T[K] extends Date ? K : never) : K
}[keyof T]

type ObjectKeysOf<T> = {
  [K in keyof T]: T[K] extends Array<any> ? never : T[K] extends object ? K : never
}[keyof T]

type Filter<TObj extends object, TKey = keyof TObj> = TKey extends keyof TObj
  ? TObj[TKey] extends Array<any>
    ? TObj
    : TObj[TKey] extends object
    ? Filter<TObj[TKey]>
    : Pick<TObj, NonObjectKeysOf<TObj>> | Filter<Pick<TObj, ObjectKeysOf<TObj>>>
  : never

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

export type Result<TObj extends Record<string, unknown>> = UnionToIntersection<Filter<Extend<TObj, ''>>>

export function flattenObject<O extends Record<string, unknown>>(ob: O): Result<O> {
  const toReturn: Record<string, unknown> = {}

  for (const i in ob) {
    if (!Object.prototype.hasOwnProperty.call(ob, i)) continue

    if (!!ob[i] && typeof ob[i] == 'object' && !(ob[i] instanceof Date) && !Array.isArray(ob[i])) {
      const flatObject = flattenObject(ob[i] as Record<string, unknown>)
      for (const x in flatObject) {
        if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue

        toReturn[i + '.' + x] = (flatObject as any)[x]
      }
    } else {
      toReturn[i] = ob[i]
    }
  }
  return toReturn as Result<O>
}

```






********************************************************************************************************************************

Folder : onecx-portal-ui-libs > libs > angular-accelerator > src > lib > injection-tokens

File : has-permission-checker.ts
```ts
/**
 * @deprecated Please import from `@onecx/angular-utils` instead.
 */
export { HasPermissionChecker } from '@onecx/angular-utils'

/**
 * This checker always returns true, basically disabling the permission system on the UI side
 * @deprecated Please import from `@onecx/angular-utils` instead.
 */
export { AlwaysGrantPermissionChecker } from '@onecx/angular-utils'

/**
 * @deprecated Please import from `@onecx/angular-utils` instead.
 */
export { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'

```




********************************************************************************************************************************

Folder : onecx-portal-ui-libs > libs > angular-accelerator > src > lib > model

File : models
```ts
// breadcrumb-menu-item.model.ts
import { QueryParamsHandling } from '@angular/router'
import { MenuItem } from 'primeng/api'
export interface BreadCrumbMenuItem {
  labelKey?: string
  icon?: string
  command?: (event?: any) => void
  url?: string
  items?: MenuItem[]
  expanded?: boolean
  disabled?: boolean
  visible?: boolean
  target?: string
  escape?: boolean
  routerLinkActiveOptions?: any
  separator?: boolean
  badge?: string
  tooltip?: string
  tooltipPosition?: string
  badgeStyleClass?: string
  style?: any
  styleClass?: string
  titleKey?: string
  id?: string
  automationId?: any
  tabindex?: string
  routerLink?: any
  queryParams?: {
    [k: string]: any
  }
  fragment?: string
  queryParamsHandling?: QueryParamsHandling
  preserveFragment?: boolean
  skipLocationChange?: boolean
  replaceUrl?: boolean
  iconStyle?: any
  iconClass?: string
  state?: {
    [k: string]: any
  }
  tooltipOptions?: {
    tooltipLabel?: string
    tooltipPosition?: 'right' | 'left' | 'top' | 'bottom'
    tooltipEvent?: 'hover' | 'focus'
    appendTo?: any
    positionStyle?: string
    tooltipStyleClass?: string
    tooltipZIndex?: string
    escape?: boolean
    disabled?: boolean
    positionTop?: number
    positionLeft?: number
    showDelay?: number
    hideDelay?: number
    life?: number
  }
}


// button-dialog.ts
import { Type } from '@angular/core'
import { DialogButton } from '../services/portal-dialog.service'
import { PrimeIcon } from '../utils/primeicon.utils'

/**
 * Object describing details for button rendering containing key for translation, optional icon and optional parameters for translation
 *
 * @example
 * "Cancel meeting" button with X icon
 * ```
 * // assume such translation is in the translation file
 * const translations = {
 *   MY_KEY = 'Cancel {{value}}'
 * }
 * const buttonDetails: ButtonDialogButtonDetails = {
 *   key: 'MY_KEY',
 *   icon: PrimeIcons.TIMES,
 *   parameters: {
 *     value: 'meeting'
 *   }
 * }
 * ```
 */
export interface ButtonDialogButtonDetails {
  key: string
  id?: string
  icon?: PrimeIcon
  parameters?: Record<string, unknown>
  tooltipKey?: string
  tooltipPosition?: 'right' | 'left' | 'top' | 'bottom' | string | undefined
}

export interface ButtonDialogCustomButtonDetails extends ButtonDialogButtonDetails {
  id: string
  alignment: 'right' | 'left'
}

export interface ButtonDialogConfig {
  primaryButtonDetails?: ButtonDialogButtonDetails
  secondaryButtonIncluded?: boolean
  secondaryButtonDetails?: ButtonDialogButtonDetails
  customButtons?: ButtonDialogCustomButtonDetails[]
  autoFocusButton?: DialogButton
  autoFocusButtonCustomId?: string
}

export interface ButtonDialogData {
  config: ButtonDialogConfig
  component?: Type<any>
  componentData: any
}


// column-type.model.ts
export enum ColumnType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  RELATIVE_DATE = 'RELATIVE_DATE',
  TRANSLATION_KEY = 'TRANSLATION_KEY',
}


// data-action.ts
export interface DataAction {
  id?: string
  labelKey?: string
  icon?: string
  permission: string | string[]
  classes?: string[]
  disabled?: boolean
  actionVisibleField?: string
  actionEnabledField?: string
  showAsOverflow?: boolean
  callback: (data: any) => void
}


// data-column-name-id.model.ts
export interface DataColumnNameId {
  columnId: string
  columnName: string | number
}


// data-sort-direction.ts
export const enum DataSortDirection {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
  NONE = 'NONE',
}


// data-table-column.model.ts
import { ColumnType } from './column-type.model'
import { FilterType } from './filter.model'

export interface DataTableColumn {
  columnType: ColumnType
  nameKey: string
  id: string
  sortable?: boolean
  filterable?: boolean
  filterType?: FilterType
  predefinedGroupKeys?: string[]
  dateFormat?: string
}

// diagram-column.ts
import { ColumnType } from './column-type.model'

export type DiagramColumn = { columnType: ColumnType; id: string }

// diagram-data.ts
export type DiagramData = { label: string; value: number; backgroundColor?: string }


// diagram-type.ts
export const enum DiagramType {
  PIE = 'PIE',
  VERTICAL_BAR = 'VERTICAL_BAR',
  HORIZONTAL_BAR = 'HORIZONTAL_BAR',
}

// filter.model.ts
export interface ColumnFilterDataSelectOptions {
  reverse: boolean
}

export type FilterObject = { columnId: string; filterType?: FilterType }

export type Filter = FilterObject & { value: unknown }

export enum FilterType {
  ENDS_WITH = 'endsWith',
  STARTS_WITH = 'startsWith',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  EQUALS = 'equals',
  NOT_EQUALS = 'notEquals',
  LESS_THAN = 'lessThan',
  GREATER_THAN = 'greaterThan',
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
  IS_EMPTY = 'isEmpty',
  IS_NOT_EMPTY = 'isNotEmpty',
}


// translation.model.ts
/**
 * Object containing key for translation with parameters object for translation
 *
 * @example
 * ## Assume such translation is in the translation file
 * ```typescript
 * const translations = {
 *   MY_KEY = 'text with parameter value = {{value}}',
 * }
 * ```
 *
 * ## TranslationKeyWithParameters declaration
 * ```
 * // will be translated into
 * // text with parameter value = hello
 * const myKey: TranslationKeyWithParameters = {
 *   key: 'MY_KEY',
 *   parameters: {
 *     value: 'hello',
 *   },
 * }
 * ```
 */
export type TranslationKeyWithParameters = { key: string; parameters?: Record<string, unknown> }

/**
 * String with key to translation or {@link TranslationKeyWithParameters} object. If provided string cannot be translated it will be displayed as is.
 */
export type TranslationKey = string | TranslationKeyWithParameters

```





********************************************************************************************************************************

Folder : onecx-portal-ui-libs > libs > angular-accelerator > src > lib > pipes

File : dynamic.pipe.ts
```ts
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common'
import { Injector, LOCALE_ID, Pipe, PipeTransform, Type, inject } from '@angular/core'

@Pipe({
  name: 'dynamicPipe',
  standalone: false,
})
export class DynamicPipe implements PipeTransform {
  private injector = inject(Injector)

  knownPipes: { [name: string]: PipeTransform } = {}

  public constructor() {
    const locale = inject(LOCALE_ID)

    this.knownPipes = {
      currency: new CurrencyPipe(locale),
      decimal: new DecimalPipe(locale),
      date: new DatePipe(locale),
    }
  }

  transform(value: any, requiredPipe?: Type<any>, pipeArgs?: any): any {
    if (!requiredPipe) {
      return value
    }

    const injector = Injector.create({
      name: 'DynamicPipe',
      parent: this.injector,
      providers: [{ provide: requiredPipe }],
    })
    const pipe = injector.get(requiredPipe)
    return pipe.transform(value, pipeArgs)
  }

  transform2(value: any, pipeToken: any, ...pipeArgs: any[]): any {
    if (!pipeToken) {
      return value
    } else {
      // eslint-disable-next-line no-prototype-builtins
      if (pipeToken && this.knownPipes.hasOwnProperty(pipeToken)) {
        const pipe = this.knownPipes[pipeToken]
        if (Array.isArray(pipeArgs)) {
          return pipe.transform(value, ...pipeArgs)
        } else {
          return pipe.transform(value, pipeArgs)
        }
      } else {
        return value
      }
    }
  }
}

```


File : ocxtimeago.pipe.ts
```ts
import { ChangeDetectorRef, NgZone, OnDestroy, Pipe, PipeTransform, inject } from '@angular/core'
import { TranslatePipe, TranslateService } from '@ngx-translate/core'

@Pipe({
  name: 'timeago',
  standalone: false,
})
// eslint-disable-next-line @angular-eslint/use-pipe-transform-interface
export class OcxTimeAgoPipe extends TranslatePipe implements OnDestroy, PipeTransform {
  private changeDetectorRef: ChangeDetectorRef
  private ngZone = inject(NgZone)
  private translateService: TranslateService

  private timer: number | undefined | null

  constructor() {
    const changeDetectorRef = inject(ChangeDetectorRef)
    const translateService = inject(TranslateService)

    super(translateService, changeDetectorRef)

    this.changeDetectorRef = changeDetectorRef
    this.translateService = translateService
  }
  override transform(value: string) {
    this.removeTimer()
    const d = new Date(value)
    const now = new Date()
    const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000))
    const timeToUpdate = Number.isNaN(seconds) ? 1000 : this.getSecondsUntilUpdate(seconds) * 1000
    this.timer = this.ngZone.runOutsideAngular(() => {
      if (typeof window !== 'undefined') {
        return window.setTimeout(() => {
          this.ngZone.run(() => this.changeDetectorRef.markForCheck())
        }, timeToUpdate)
      }
      return null
    })
    const minutes = Math.round(Math.abs(seconds / 60))
    const hours = Math.round(Math.abs(minutes / 60))
    const days = Math.round(Math.abs(hours / 24))
    const months = Math.round(Math.abs(days / 30.416))
    const years = Math.round(Math.abs(days / 365))
    let translationKey = 'UNKNOWN'
    if (Number.isNaN(seconds)) {
      translationKey = 'NAN'
    } else if (seconds <= 45) {
      translationKey = 'A_FEW_SECONDS_AGO'
    } else if (seconds <= 90) {
      translationKey = 'A_MINUTE_AGO'
    } else if (minutes <= 45) {
      translationKey = 'MINUTES_AGO'
    } else if (minutes <= 90) {
      translationKey = 'AN_HOUR_AGO'
    } else if (hours <= 22) {
      translationKey = 'HOURS_AGO'
    } else if (hours <= 36) {
      translationKey = 'A_DAY_AGO'
    } else if (days <= 25) {
      translationKey = 'DAYS_AGO'
    } else if (days <= 45) {
      translationKey = 'A_MONTH_AGO'
    } else if (days <= 345) {
      translationKey = 'MONTHS_AGO'
    } else if (days <= 545) {
      translationKey = 'A_YEAR_AGO'
    } else {
      translationKey = 'YEARS_AGO'
    }
    return super.transform('OCX_TIMEAGO.' + translationKey, { minutes, hours, days, months, years })
  }
  override ngOnDestroy(): void {
    this.removeTimer()
    super.ngOnDestroy()
  }
  private removeTimer() {
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = null
    }
  }
  private getSecondsUntilUpdate(seconds: number) {
    const min = 60
    const hr = min * 60
    const day = hr * 24
    if (seconds < min) {
      return 2
    } else if (seconds < hr) {
      return 30
    } else if (seconds < day) {
      return 300
    } else {
      return 3600
    }
  }
}

```


File : relative-date.pipe.ts
```ts
import { Pipe, PipeTransform, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, name: 'seconds' },
  { amount: 60, name: 'minutes' },
  { amount: 24, name: 'hours' },
  { amount: 7, name: 'days' },
  { amount: 4.34524, name: 'weeks' },
  { amount: 12, name: 'months' },
  { amount: Number.POSITIVE_INFINITY, name: 'years' },
]

@Pipe({
  name: 'relativeDate',
  standalone: false,
})
export class RelativeDatePipe implements PipeTransform {
  private readonly translateService = inject(TranslateService)

  rtf: Intl.RelativeTimeFormat

  constructor() {
    this.rtf = new Intl.RelativeTimeFormat(this.translateService.currentLang, {
      style: 'long',
    })
  }

  transform(value: any): any {
    let date: Date = new Date()
    switch (typeof value) {
      case 'string':
        date = new Date(value)
        break
      case 'object':
        date = value
        break
      default:
        break
    }

    let duration = (date.getTime() - new Date().getTime()) / 1000
    for (let i = 0; i <= DIVISIONS.length; i++) {
      const division = DIVISIONS[i]
      if (Math.abs(duration) < division.amount) {
        return this.rtf.format(Math.round(duration), division.name)
      }
      duration /= division.amount
    }
  }
}

```





********************************************************************************************************************************

Folder : onecx-portal-ui-libs > libs > angular-accelerator > src > lib > services

File : breadcrumb.service.ts
```ts
import { Injectable, OnDestroy, inject } from '@angular/core'
import { ActivatedRoute, ActivatedRouteSnapshot, Data, NavigationEnd, ParamMap, Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TranslateService } from '@ngx-translate/core'
import { Topic } from '@onecx/accelerator'
import { MenuItem } from 'primeng/api'
import { BehaviorSubject, filter, map, Observable } from 'rxjs'
import { BreadCrumbMenuItem } from '../model/breadcrumb-menu-item.model'

interface ManualBreadcrumbs {
  menuItems: MenuItem[]
}

// This topic is defined here and not in integration-interface, because
// it is not used as framework independent integration but for improving
// angular specific things
class ManualBreadcrumbsTopic extends Topic<ManualBreadcrumbs> {
  constructor() {
    super('manualBreadcrumbs', 1)
  }
}

@Injectable({ providedIn: 'any' })
@UntilDestroy()
export class BreadcrumbService implements OnDestroy {
  private readonly router = inject(Router)
  private readonly activeRoute = inject(ActivatedRoute)
  private readonly translateService = inject(TranslateService)

  private _itemSource$: ManualBreadcrumbsTopic | undefined
  private get itemsSource$() {
    this._itemSource$ ??= new ManualBreadcrumbsTopic()
    return this._itemSource$
  }
  private set itemsSource$(source: ManualBreadcrumbsTopic) {
    this._itemSource$ = source
  }
  generatedItemsSource = new BehaviorSubject<MenuItem[]>([])

  _itemsHandler: Observable<MenuItem[]> | undefined
  get itemsHandler() {
    this._itemsHandler ??= this.itemsSource$.pipe(map((manualBreadcrumbs) => manualBreadcrumbs.menuItems))
    return this._itemsHandler
  }

  constructor() {
    this.generateBreadcrumbs(this.activeRoute.snapshot)
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        const root = this.router.routerState.snapshot.root
        this.generateBreadcrumbs(root)
      })
  }

  ngOnDestroy(): void {
    this._itemSource$?.destroy()
  }

  private generateBreadcrumbs(route: ActivatedRouteSnapshot | null) {
    if (route?.data['mfeInfo']) {
      const breadcrumbs: MenuItem[] = [
        {
          label: route.data['mfeInfo'].productName,
          routerLink: route.data['mfeInfo'].baseHref,
        },
      ]
      const baseUrl: string[] = (route.data['mfeInfo'].baseHref as string).split('/').filter((value) => value)
      const parentUrl: string[] = route.url.map((url) => url.path)
      const isUsingMatcher = !parentUrl.every((item) => baseUrl.includes(item))
      if (isUsingMatcher) {
        this.createBreadcrumb(route, parentUrl, breadcrumbs)
      }
      this.addBreadcrumb(route.firstChild, parentUrl, breadcrumbs)
      this.generatedItemsSource.next(breadcrumbs)
    } else if (route?.data['breadcrumb']) {
      const breadcrumbs: MenuItem[] = []
      this.addBreadcrumb(route, [], breadcrumbs)
      this.generatedItemsSource.next(breadcrumbs)
    } else if (route) {
      this.generateBreadcrumbs(route.firstChild)
    }
  }

  private addBreadcrumb(route: ActivatedRouteSnapshot | null, parentUrl: string[], breadcrumbs: MenuItem[]) {
    if (route?.url) {
      const routeUrl = parentUrl.concat(route.url.map((url) => url.path))
      if (route.routeConfig?.path) {
        this.createBreadcrumb(route, routeUrl, breadcrumbs)
      }

      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs)
    }
  }

  private createBreadcrumb(route: ActivatedRouteSnapshot, routeUrl: string[], breadcrumbs: MenuItem[]) {
    if (route.data['breadcrumb']) {
      const breadcrumb: MenuItem = {
        label: this.getLabel(route.data, route.paramMap),
        routerLink: '/' + routeUrl.join('/'),
      }
      breadcrumbs.push(breadcrumb)
    } else {
      const breadcrumb: MenuItem = {
        label: 'NA',
        routerLink: '/' + routeUrl.join('/'),
      }
      breadcrumbs.push(breadcrumb)
    }
  }

  private getLabel(data: Data, params: ParamMap) {
    if (typeof data['breadcrumbFn'] === 'function') {
      return data['breadcrumbFn'](data, params)
    }
    return data['breadcrumb']
  }

  setItems(items: BreadCrumbMenuItem[]) {
    const translationKeys = [
      ...items.map((i) => i.labelKey ?? '').filter((l) => !!l),
      ...items.map((i) => i.titleKey ?? '').filter((l) => !!l),
    ]
    if (translationKeys.length) {
      this.translateService.get(translationKeys).subscribe((translations: any) => {
        this.itemsSource$.publish({
          menuItems: items.map((i) => ({
            ...i,
            label: translations[i.labelKey ?? ''],
            title: translations[i.titleKey ?? ''],
          })),
        })
      })
    } else {
      this.itemsSource$.publish({
        menuItems: items,
      })
    }
  }
}

```


File : export-data-service.spec.ts
```ts
import { TestBed } from '@angular/core/testing'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { ExportDataService } from './export-data.service'
import { DateUtils } from '../utils/dateutils'
import { ColumnType } from '../model/column-type.model'

describe('ExportDataService', () => {
  class ElementMock {
    attributes: Record<string, unknown> = {}
    setAttribute(name: string, value: unknown) {
      this.attributes[name] = value
    }
    click() {
      // do click
    }
  }

  function removeWhitespaces(str: string) {
    return str.replace(/\s+/g, '')
  }

  let blobs: Blob[] = []

  let translateService: TranslateService
  let exportDataService: ExportDataService
  let dateUtils: DateUtils

  const ENGLISH_LANGUAGE = 'en'
  const ENGLISH_TRANSLATIONS = {
    SOME_STATUS: 'some status',
    STATUS_EXAMPLE: 'some status example',
    STATUS_NAME_1: 'status name 1',
    STATUS_NAME_2: 'status name 2',
    STATUS_NAME_3: 'status name 3',
    COLUMN_HEADER_NAME: {
      NAME: 'Name',
      STATUS: 'Status',
      DESCRIPTION: 'Description',
      RESPONSIBLE: 'Responsible',
      START_DATE: 'Start date',
      END_DATE: 'End date',
      MODIFICATION_DATE: 'Modification date',
      CREATION_USER: 'Creation user',
      TEST_NUMBER: 'Test number',
    },
  }

  const GERMAN_LANGUAGE = 'de'
  const GERMAN_TRANSLATIONS = {
    SOME_STATUS: 'irgendein Status',
    STATUS_EXAMPLE: 'irgendein Beispielstatus',
    STATUS_NAME_1: 'Status Name 1',
    STATUS_NAME_2: 'Status Name 2',
    STATUS_NAME_3: 'Status Name 3',
    COLUMN_HEADER_NAME: {
      NAME: 'Name',
      STATUS: 'Status',
      DESCRIPTION: 'Beschreibung',
      RESPONSIBLE: 'Verantwortlich',
      START_DATE: 'Startdatum',
      END_DATE: 'Enddatum',
      MODIFICATION_DATE: 'Änderungsdatum',
      CREATION_USER: 'Erstellungsbenutzer',
      TEST_NUMBER: 'Testnummer',
    },
  }

  const TRANSLATIONS = {
    [ENGLISH_LANGUAGE]: ENGLISH_TRANSLATIONS,
    [GERMAN_LANGUAGE]: GERMAN_TRANSLATIONS,
  }

  const mockData = [
    {
      version: 0,
      creationDate: '2023-09-12T09:34:11.997048Z',
      creationUser: 'creation user',
      modificationDate: '2023-09-12T09:34:11.997048Z',
      modificationUser: '',
      id: '195ee34e-41c6-47b7-8fc4-3f245dee7651',
      name: 'some name',
      description: '',
      status: 'SOME_STATUS',
      responsible: 'someone responsible',
      endDate: '2023-09-14T09:34:09Z',
      startDate: '2023-09-13T09:34:05Z',
      imagePath: '/path/to/image',
      testNumber: '1',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:33:58.544494Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:33:58.544494Z',
      modificationUser: '',
      id: '5f8bb05b-d089-485e-a234-0bb6ff25234e',
      name: 'example',
      description: 'example description',
      status: 'STATUS_EXAMPLE',
      responsible: '',
      endDate: '2023-09-13T09:33:55Z',
      startDate: '2023-09-12T09:33:53Z',
      imagePath: '',
      testNumber: '3.141',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 1',
      description: '',
      status: 'STATUS_NAME_1',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '123456789',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 2',
      description: '',
      status: 'STATUS_NAME_2',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '12345.6789',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 3',
      description: '',
      status: 'STATUS_NAME_3',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '7.1',
    },
  ]
  const mockDataWithUndefinedDateValues = [
    {
      version: 0,
      creationDate: '2023-09-12T09:34:11.997048Z',
      creationUser: 'creation user',
      modificationDate: '2023-09-12T09:34:11.997048Z',
      modificationUser: '',
      id: '195ee34e-41c6-47b7-8fc4-3f245dee7651',
      name: 'some name',
      description: '',
      status: 'SOME_STATUS',
      responsible: 'someone responsible',
      endDate: '2023-09-14T09:34:09Z',
      startDate: '2023-09-13T09:34:05Z',
      imagePath: '/path/to/image',
      testNumber: '1',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:33:58.544494Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:33:58.544494Z',
      modificationUser: '',
      id: '5f8bb05b-d089-485e-a234-0bb6ff25234e',
      name: 'example',
      description: 'example description',
      status: 'STATUS_EXAMPLE',
      responsible: '',
      endDate: '2023-09-13T09:33:55Z',
      startDate: '2023-09-12T09:33:53Z',
      imagePath: '',
      testNumber: '3.141',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 1',
      description: '',
      status: 'STATUS_NAME_1',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '123456789',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 2',
      description: '',
      status: 'STATUS_NAME_2',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: undefined,
      imagePath: '',
      testNumber: '12345.6789',
    },
    {
      version: 0,
      creationDate: undefined,
      creationUser: '',
      modificationDate: undefined,
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 3',
      description: '',
      status: 'STATUS_NAME_3',
      responsible: '',
      endDate: undefined,
      startDate: undefined,
      imagePath: '',
      testNumber: '7.1',
    },
  ]
  const mockColumns = [
    {
      columnType: ColumnType.STRING,
      id: 'name',
      nameKey: 'COLUMN_HEADER_NAME.NAME',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'description',
      nameKey: 'COLUMN_HEADER_NAME.DESCRIPTION',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'startDate',
      nameKey: 'COLUMN_HEADER_NAME.START_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'endDate',
      nameKey: 'COLUMN_HEADER_NAME.END_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.TRANSLATION_KEY,
      id: 'status',
      nameKey: 'COLUMN_HEADER_NAME.STATUS',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'responsible',
      nameKey: 'COLUMN_HEADER_NAME.RESPONSIBLE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.RELATIVE_DATE,
      id: 'modificationDate',
      nameKey: 'COLUMN_HEADER_NAME.MODIFICATION_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'creationUser',
      nameKey: 'COLUMN_HEADER_NAME.CREATION_USER',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.NUMBER,
      id: 'testNumber',
      nameKey: 'COLUMN_HEADER_NAME.TEST_NUMBER',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [TranslateModule.forRoot(), TranslateTestingModule.withTranslations(TRANSLATIONS)],
      providers: [ExportDataService, DateUtils],
    }).compileComponents()

    translateService = TestBed.inject(TranslateService)
    exportDataService = TestBed.inject(ExportDataService)
    dateUtils = TestBed.inject(DateUtils)

    blobs = []
  })

  it('should export data as csv in en', async () => {
    translateService.use('en')
    ;(<any>exportDataService).locale = 'en'
    ;(<any>dateUtils).locale = 'en'

    const expectedCsv =
      'Name,Description,Start date,End date,Status,Responsible,Modification date,Creation user,Test number' +
      '\r\nsome name,,' +
      '"' +
      dateUtils.localizedDate('2023-09-13T09:34:05Z') +
      '"' +
      ',' +
      '"' +
      dateUtils.localizedDate('2023-09-14T09:34:09Z') +
      '"' +
      ',some status,someone responsible,' +
      '"' +
      dateUtils.localizedDate('2023-09-12T09:34:11.997048Z') +
      '"' +
      ',creation user,1' +
      '\r\nexample,example description,' +
      '"' +
      dateUtils.localizedDate('2023-09-12T09:33:53Z') +
      '"' +
      ',' +
      '"' +
      dateUtils.localizedDate('2023-09-13T09:33:55Z') +
      '"' +
      ',some status example,,' +
      '"' +
      dateUtils.localizedDate('2023-09-12T09:33:58.544494Z') +
      '"' +
      ',,3.141' +
      '\r\nname 1,,' +
      '"' +
      dateUtils.localizedDate('2023-09-14T09:34:22Z') +
      '"' +
      ',' +
      '"' +
      dateUtils.localizedDate('2023-09-15T09:34:24Z') +
      '"' +
      ',status name 1,,' +
      '"' +
      dateUtils.localizedDate('2023-09-12T09:34:27.184086Z') +
      '"' +
      ',,123456789' +
      '\r\nname 2,,' +
      '"' +
      dateUtils.localizedDate('2023-09-14T09:34:22Z') +
      '"' +
      ',' +
      '"' +
      dateUtils.localizedDate('2023-09-15T09:34:24Z') +
      '"' +
      ',status name 2,,' +
      '"' +
      dateUtils.localizedDate('2023-09-12T09:34:27.184086Z') +
      '"' +
      ',,12345.6789' +
      '\r\nname 3,,' +
      '"' +
      dateUtils.localizedDate('2023-09-14T09:34:22Z') +
      '"' +
      ',' +
      '"' +
      dateUtils.localizedDate('2023-09-15T09:34:24Z') +
      '"' +
      ',status name 3,,' +
      '"' +
      dateUtils.localizedDate('2023-09-12T09:34:27.184086Z') +
      '"' +
      ',,7.1'
    const expectedFilename = 'some-test.csv'
    const mock = new ElementMock()

    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, mockData, 'some-test.csv')

    expect(removeWhitespaces(expectedCsv)).toEqual(
      removeWhitespaces(await blobs[Number(mock.attributes['href'])].text())
    )
    expect(expectedFilename).toEqual(mock.attributes['download'])
  })

  it('should export data as csv in en which contains data of date fields that are undefined', async () => {
    translateService.use('en')
    ;(<any>exportDataService).locale = 'en'
    ;(<any>dateUtils).locale = 'en'

    const expectedCsv =
      'Name,Description,Start date,End date,Status,Responsible,Modification date,Creation user,Test number' +
      '\r\nsome name,,' +
      generateCsvContentForDate('2023-09-13T09:34:05Z', dateUtils) +
      ',' +
      generateCsvContentForDate('2023-09-14T09:34:09Z', dateUtils) +
      ',some status,someone responsible,' +
      generateCsvContentForDate('2023-09-12T09:34:11.997048Z', dateUtils) +
      ',creation user,1' +
      '\r\nexample,example description,' +
      generateCsvContentForDate('2023-09-12T09:33:53Z', dateUtils) +
      ',' +
      generateCsvContentForDate('2023-09-13T09:33:55Z', dateUtils) +
      ',some status example,,' +
      generateCsvContentForDate('2023-09-12T09:33:58.544494Z', dateUtils) +
      ',,3.141' +
      '\r\nname 1,,' +
      generateCsvContentForDate('2023-09-14T09:34:22Z', dateUtils) +
      ',' +
      generateCsvContentForDate('2023-09-15T09:34:24Z', dateUtils) +
      ',status name 1,,' +
      generateCsvContentForDate('2023-09-12T09:34:27.184086Z', dateUtils) +
      ',,123456789' +
      '\r\nname 2,,' +
      generateCsvContentForDate(undefined, dateUtils) +
      ',' +
      generateCsvContentForDate('2023-09-15T09:34:24Z', dateUtils) +
      ',status name 2,,' +
      generateCsvContentForDate('2023-09-12T09:34:27.184086Z', dateUtils) +
      ',,12345.6789' +
      '\r\nname 3,,' +
      generateCsvContentForDate(undefined, dateUtils) +
      ',' +
      generateCsvContentForDate(undefined, dateUtils) +
      ',status name 3,,' +
      generateCsvContentForDate(undefined, dateUtils) +
      ',,7.1'
    const expectedFilename = 'some-test.csv'
    const mock = new ElementMock()

    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, mockDataWithUndefinedDateValues, 'some-test.csv')

    expect(removeWhitespaces(expectedCsv)).toEqual(
      removeWhitespaces(await blobs[Number(mock.attributes['href'])].text())
    )
    expect(expectedFilename).toEqual(mock.attributes['download'])
  })

  it('should export data as csv in en which contains data of date fields that are undefined', async () => {
    translateService.use('en')
    ;(<any>exportDataService).locale = 'en'
    ;(<any>dateUtils).locale = 'en'

    const expectedCsv =
      'Name,Description,Start date,End date,Status,Responsible,Modification date,Creation user,Test number' +
      '\r\nsome name,,' +
      generateCsvContentForDate('2023-09-13T09:34:05Z', dateUtils) +
      ',' +
      generateCsvContentForDate('2023-09-14T09:34:09Z', dateUtils) +
      ',some status,someone responsible,' +
      generateCsvContentForDate('2023-09-12T09:34:11.997048Z', dateUtils) +
      ',creation user,1' +
      '\r\nexample,example description,' +
      generateCsvContentForDate('2023-09-12T09:33:53Z', dateUtils) +
      ',' +
      generateCsvContentForDate('2023-09-13T09:33:55Z', dateUtils) +
      ',some status example,,' +
      generateCsvContentForDate('2023-09-12T09:33:58.544494Z', dateUtils) +
      ',,3.141' +
      '\r\nname 1,,' +
      generateCsvContentForDate('2023-09-14T09:34:22Z', dateUtils) +
      ',' +
      generateCsvContentForDate('2023-09-15T09:34:24Z', dateUtils) +
      ',status name 1,,' +
      generateCsvContentForDate('2023-09-12T09:34:27.184086Z', dateUtils) +
      ',,123456789' +
      '\r\nname 2,,' +
      generateCsvContentForDate(undefined, dateUtils) +
      ',' +
      generateCsvContentForDate('2023-09-15T09:34:24Z', dateUtils) +
      ',status name 2,,' +
      generateCsvContentForDate('2023-09-12T09:34:27.184086Z', dateUtils) +
      ',,12345.6789' +
      '\r\nname 3,,' +
      generateCsvContentForDate(undefined, dateUtils) +
      ',' +
      generateCsvContentForDate(undefined, dateUtils) +
      ',status name 3,,' +
      generateCsvContentForDate(undefined, dateUtils) +
      ',,7.1'
    const expectedFilename = 'some-test.csv'
    const mock = new ElementMock()

    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, mockDataWithUndefinedDateValues, 'some-test.csv')

    expect(removeWhitespaces(expectedCsv)).toEqual(
      removeWhitespaces(await blobs[Number(mock.attributes['href'])].text())
    )
    expect(expectedFilename).toEqual(mock.attributes['download'])
  })

  it('should export data as csv in de', async () => {
    translateService.use('de')
    ;(<any>exportDataService).locale = 'de'
    ;(<any>dateUtils).locale = 'de'

    const expectedFilename = 'some-test.csv'
    const expectedCsv =
      'Name;Beschreibung;Startdatum;Enddatum;Status;Verantwortlich;Änderungsdatum;Erstellungsbenutzer;Testnummer' +
      '\r\nsome name;;' +
      dateUtils.localizedDate('2023-09-13T09:34:05Z') +
      ';' +
      dateUtils.localizedDate('2023-09-14T09:34:09Z') +
      ';irgendein Status;someone responsible;' +
      dateUtils.localizedDate('2023-09-12T09:34:11.997048Z') +
      ';creation user;1' +
      '\r\nexample;example description;' +
      dateUtils.localizedDate('2023-09-12T09:33:53Z') +
      ';' +
      dateUtils.localizedDate('2023-09-13T09:33:55Z') +
      ';irgendein Beispielstatus;;' +
      dateUtils.localizedDate('2023-09-12T09:33:58.544494Z') +
      ';;3.141' +
      '\r\nname 1;;' +
      dateUtils.localizedDate('2023-09-14T09:34:22Z') +
      ';' +
      dateUtils.localizedDate('2023-09-15T09:34:24Z') +
      ';Status Name 1;;' +
      dateUtils.localizedDate('2023-09-12T09:34:27.184086Z') +
      ';;123456789' +
      '\r\nname 2;;' +
      dateUtils.localizedDate('2023-09-14T09:34:22Z') +
      ';' +
      dateUtils.localizedDate('2023-09-15T09:34:24Z') +
      ';Status Name 2;;' +
      dateUtils.localizedDate('2023-09-12T09:34:27.184086Z') +
      ';;12345.6789' +
      '\r\nname 3;;' +
      dateUtils.localizedDate('2023-09-14T09:34:22Z') +
      ';' +
      dateUtils.localizedDate('2023-09-15T09:34:24Z') +
      ';Status Name 3;;' +
      dateUtils.localizedDate('2023-09-12T09:34:27.184086Z') +
      ';;7.1'
    const mock = new ElementMock()

    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, mockData, 'some-test.csv')

    expect(removeWhitespaces(expectedCsv)).toEqual(
      removeWhitespaces(await blobs[Number(mock.attributes['href'])].text())
    )
    expect(expectedFilename).toEqual(mock.attributes['download'])
  })
  it('should export data as csv in de which contains data of date fields that are undefined', async () => {
    translateService.use('de')
    ;(<any>exportDataService).locale = 'de'
    ;(<any>dateUtils).locale = 'de'

    const expectedFilename = 'some-test.csv'
    const expectedCsv =
      'Name;Beschreibung;Startdatum;Enddatum;Status;Verantwortlich;Änderungsdatum;Erstellungsbenutzer;Testnummer' +
      '\r\nsome name;;' +
      dateUtils.localizedDate('2023-09-13T09:34:05Z') +
      ';' +
      dateUtils.localizedDate('2023-09-14T09:34:09Z') +
      ';irgendein Status;someone responsible;' +
      dateUtils.localizedDate('2023-09-12T09:34:11.997048Z') +
      ';creation user;1' +
      '\r\nexample;example description;' +
      dateUtils.localizedDate('2023-09-12T09:33:53Z') +
      ';' +
      dateUtils.localizedDate('2023-09-13T09:33:55Z') +
      ';irgendein Beispielstatus;;' +
      dateUtils.localizedDate('2023-09-12T09:33:58.544494Z') +
      ';;3.141' +
      '\r\nname 1;;' +
      dateUtils.localizedDate('2023-09-14T09:34:22Z') +
      ';' +
      dateUtils.localizedDate('2023-09-15T09:34:24Z') +
      ';Status Name 1;;' +
      dateUtils.localizedDate('2023-09-12T09:34:27.184086Z') +
      ';;123456789' +
      '\r\nname 2;;' +
      dateUtils.localizedDate(undefined) +
      ';' +
      dateUtils.localizedDate('2023-09-15T09:34:24Z') +
      ';Status Name 2;;' +
      dateUtils.localizedDate('2023-09-12T09:34:27.184086Z') +
      ';;12345.6789' +
      '\r\nname 3;;' +
      dateUtils.localizedDate(undefined) +
      ';' +
      dateUtils.localizedDate(undefined) +
      ';Status Name 3;;' +
      dateUtils.localizedDate(undefined) +
      ';;7.1'

    const mock = new ElementMock()

    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, mockDataWithUndefinedDateValues, 'some-test.csv')

    expect(removeWhitespaces(expectedCsv)).toEqual(
      removeWhitespaces(await blobs[Number(mock.attributes['href'])].text())
    )
    expect(expectedFilename).toEqual(mock.attributes['download'])
  })

  it('should replace one double quotes with two double quotes', async () => {
    const data = [{ name: 'Name A"Name B' }]
    const mock = new ElementMock()
    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, data, 'test.csv')
    const csv = await blobs[Number(mock.attributes['href'])].text()
    expect(csv).toContain('Name A""Name B')
  })

  it('should wrap in quotes if delimiter is present', async () => {
    const data = [{ name: 'Name A,Name B' }]
    const mock = new ElementMock()
    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, data, 'test.csv')
    const csv = await blobs[Number(mock.attributes['href'])].text()
    expect(csv).toContain('"Name A,Name B"')
  })

  it('should wrap in quotes if line break (`\n`) is present', async () => {
    const data = [{ name: 'Name A\nName B' }]
    const mock = new ElementMock()
    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, data, 'test.csv')
    const csv = await blobs[Number(mock.attributes['href'])].text()
    expect(csv).toContain('"Name A\nName B"')
  })

  it('should wrap in quotes if line break (`\r`) is present', async () => {
    const data = [{ name: 'Name A\rName B' }]
    const mock = new ElementMock()
    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, data, 'test.csv')
    const csv = await blobs[Number(mock.attributes['href'])].text()
    expect(csv).toContain('"Name A\rName B"')
  })

  it('should not wrap in quotes if not needed', async () => {
    const data = [{ name: 'Name A' }]
    const mock = new ElementMock()
    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.exportCsv(mockColumns, data, 'test.csv')
    const csv = await blobs[Number(mock.attributes['href'])].text()
    expect(csv).toContain('Name A')
    expect(csv).not.toContain('"Name A"')
  })
})

function generateCsvContentForDate(value: string | undefined, dateUtils: DateUtils): string {
  if (value) {
    return '"' + dateUtils.localizedDate(value) + '"'
  }
  return dateUtils.localizedDate(value)
}

```


File : export-data.setvice.ts
```ts
import { Injectable, LOCALE_ID, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable, firstValueFrom, map, of } from 'rxjs'
import { DateUtils } from '../utils/dateutils'
import { ColumnType } from '../model/column-type.model'
import { ObjectUtils } from '../utils/objectutils'

@Injectable({ providedIn: 'any' })
export class ExportDataService {
  private readonly dateUtils = inject(DateUtils)
  private readonly translateService = inject(TranslateService)
  private readonly locale = inject(LOCALE_ID)

  async exportCsv<T extends string | number | symbol>(
    columns: { id: string; nameKey: string; columnType: ColumnType }[],
    data: Partial<Record<T, unknown | undefined>>[],
    fileName: string
  ): Promise<void> {
    if (!columns.length) {
      return
    }
    const flattenedData = data.map((d) =>
      columns.reduce((obj, c) => ({ ...obj, [c.id]: ObjectUtils.resolveFieldData(d, c.id) }), {})
    )
    const translatedData = await firstValueFrom(this.translateData(columns, flattenedData))
    const dataToExport = this.formatData(columns, translatedData)
    const delimiter = this.locale.startsWith('de') ? ';' : ','
    const dataString = dataToExport
      .map((d) =>
        columns
          .reduce((arr: unknown[], c) => [...arr, d[c.id]], [])
          .map((d) => this.escapeDelimiterAndLineBreaks(delimiter, d))
          .join(delimiter)
      )
      .join('\r\n')
    const headerString = (await firstValueFrom(this.translateColumnNames(columns)))
      .map((c) => c.name)
      .map((c) => this.escapeDelimiterAndLineBreaks(delimiter, c))
      .join(delimiter)

    const csvString = headerString + '\r\n' + dataString

    const blob = new Blob(['\ufeff' + csvString], {
      type: 'text/csv;charset=utf-8;',
    })
    const dwldLink = document.createElement('a')
    const url = URL.createObjectURL(blob)

    dwldLink.setAttribute('href', url)

    dwldLink.setAttribute('download', fileName)
    dwldLink.click()
  }

  private translateColumnNames(
    columns: { id: string; nameKey: string; columnType: ColumnType }[]
  ): Observable<{ id: string; name: string; columnType: ColumnType }[]> {
    return this.translateService
      .get(columns.map((c) => c.nameKey))
      .pipe(map((translations) => columns.map((c) => ({ ...c, name: translations[c.nameKey] }))))
  }

  private formatData(
    columns: { id: string; nameKey: string; columnType: ColumnType }[],
    data: Record<string, unknown>[]
  ): { [columnId: string]: unknown }[] {
    return data.map((d) =>
      columns.reduce((obj, c) => {
        if (c.columnType === ColumnType.DATE || c.columnType === ColumnType.RELATIVE_DATE) {
          return {
            ...obj,
            [c.id]: this.dateUtils.localizedDate(d[c.id] ? String(d[c.id]) : undefined),
          }
        }
        return { ...obj, [c.id]: d[c.id] }
      }, {})
    )
  }

  private translateData(
    columns: { id: string; nameKey: string; columnType: ColumnType }[],
    data: Record<string, unknown>[]
  ): Observable<{ [columnId: string]: unknown }[]> {
    let translationKeys: string[] = []
    const translatedColumns = columns.filter((c) => c.columnType === ColumnType.TRANSLATION_KEY)
    translatedColumns.forEach((c) => {
      translationKeys = [...translationKeys, ...data.map((i) => i[c.id]?.toString() ?? '')]
    })
    if (translationKeys.length) {
      return this.translateService.get(translationKeys).pipe(
        map((translatedValues: Record<string, string>) => {
          return data.map((d) =>
            columns.reduce(
              (obj, c) => ({
                ...obj,
                [c.id]: c.columnType === ColumnType.TRANSLATION_KEY ? translatedValues[String(d[c.id])] : d[c.id],
              }),
              {}
            )
          )
        })
      )
    }
    return of(data)
  }

  private escapeDelimiterAndLineBreaks(delimiter: ';' | ',', data: unknown) {
    if (data === null || data === undefined) {
      return data
    }

    let str = String(data)

    if (str.includes('"')) {
      str = str.replaceAll('"', '""')
    }

    if (str.includes(delimiter) || str.includes('\n') || str.includes('\r')) {
      str = `"${str}"`
    }
    return str
  }
}

```


File : portal-dialog-service.stories.ts
```ts
import { Component, EventEmitter, Input, OnInit, importProvidersFrom, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, applicationConfig, argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular'
import { PrimeIcons } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { TooltipModule } from 'primeng/tooltip'
import { Observable } from 'rxjs'
import { DialogMessageContentComponent } from '../components/dialog/dialog-message-content/dialog-message-content.component'
import { DialogContentComponent } from '../components/dialog/dialog-content/dialog-content.component'
import { DialogFooterComponent } from '../components/dialog/dialog-footer/dialog-footer.component'
import { StorybookTranslateModule } from '../storybook-translate.module'
import {
  DialogButtonClicked,
  DialogCustomButtonsDisabled,
  DialogPrimaryButtonDisabled,
  DialogResult,
  DialogSecondaryButtonDisabled,
  DialogState,
  PortalDialogService,
} from './portal-dialog.service'
import { StorybookThemeModule } from '../storybook-theme.module'

@Component({
  standalone: false,
  selector: 'ocx-button-dialog-with-portal-dialog-service',
  template: `<p-button label="Open dialog" (click)="openDialog()" />`,
})
class ButtonDialogWithPortalDialogServiceComponent {
  private portalDialogService = inject(PortalDialogService)

  @Input() title = 'Title'
  @Input() messageOrComponent = 'Message'
  @Input() primaryKey = 'Primary'
  @Input() secondaryKey = 'Secondary'
  @Input() extras = {}

  openDialog() {
    this.portalDialogService
      .openDialog(this.title, this.messageOrComponent, this.primaryKey, this.secondaryKey, this.extras)
      .subscribe(() => {
        console.log('dialog closed')
      })
  }
}

@Component({
  standalone: false,
  selector: 'ocx-my-component-to-display',
  template: `<p>Component to display with disabled buttons</p>
    <div class="flex gap-2">
      <p-button label="Toggle custom button" (click)="clickCustom()" />
      <p-button label="Toggle secondary button" (click)="click2()" />
      <p-button label="Toggle primary button" (click)="click1()" />
    </div>`,
})
class WithDisabledButtonsComponent
  implements DialogPrimaryButtonDisabled, DialogSecondaryButtonDisabled, DialogCustomButtonsDisabled
{
  secondaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
  customButtonEnabled: EventEmitter<{ id: string; enabled: boolean }> = new EventEmitter()

  primaryState = false
  secondaryState = false
  customState = false

  click1() {
    this.primaryState = !this.primaryState
    this.primaryButtonEnabled.emit(this.primaryState)
  }
  click2() {
    this.secondaryState = !this.secondaryState
    this.secondaryButtonEnabled.emit(this.secondaryState)
  }
  clickCustom() {
    this.customState = !this.customState
    this.customButtonEnabled.emit({
      id: 'custom1',
      enabled: this.customState,
    })
  }
}

export default {
  title: 'Components/PortalDialogService',
  component: ButtonDialogWithPortalDialogServiceComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        DynamicDialogConfig,
        DynamicDialogRef,
        PortalDialogService,
        DialogService,
        importProvidersFrom(StorybookTranslateModule),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [
        DialogMessageContentComponent,
        DialogFooterComponent,
        DialogContentComponent,
        WithDisabledButtonsComponent,
      ],
      imports: [StorybookTranslateModule, ButtonModule, TooltipModule, FormsModule],
    }),
    componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`),
  ],
} as Meta<ButtonDialogWithPortalDialogServiceComponent>

export const Basic = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
      <ocx-button-dialog-with-portal-dialog-service>
      </ocx-button-dialog-with-portal-dialog-service>
        `,
  }),
  args: {},
}

export const CustomData = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
        </ocx-button-dialog-with-portal-dialog-service>
          `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: 'Custom message',
    primaryKey: 'Primary Button',
    secondaryKey: 'Secondary Button',
    extras: {},
  },
}

export const CustomDataWithExtendedButtons = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
          <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
          </ocx-button-dialog-with-portal-dialog-service>
            `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: 'Custom message',
    primaryKey: {
      key: 'PRIMARY_KEY',
      icon: PrimeIcons.BOOKMARK,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'right',
    },
    secondaryKey: {
      key: 'SECONDARY_KEY',
      icon: PrimeIcons.SEARCH,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'left',
    },
    extras: {},
  },
}

@Component({
  standalone: false,
  selector: 'ocx-my-component-to-display',
  template: `<p>Hello, its my component to display</p>`,
})
class ComponentToDisplayComponent {}

export const ComponentDisplayed = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
            <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
            </ocx-button-dialog-with-portal-dialog-service>
              `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: {
      type: ComponentToDisplayComponent,
    },
    primaryKey: {
      key: 'PRIMARY_KEY',
      icon: PrimeIcons.BOOKMARK,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'right',
    },
    secondaryKey: {
      key: 'SECONDARY_KEY',
      icon: PrimeIcons.SEARCH,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'left',
    },
    extras: {},
  },
}

export const ComponentDisplayedWithDisabledButtons = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
            <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
            </ocx-button-dialog-with-portal-dialog-service>
              `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: {
      type: WithDisabledButtonsComponent,
    },
    primaryKey: {
      key: 'PRIMARY_KEY',
      icon: PrimeIcons.BOOKMARK,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'right',
    },
    secondaryKey: {
      key: 'SECONDARY_KEY',
      icon: PrimeIcons.SEARCH,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'left',
    },
    extras: {
      customButtons: [
        {
          id: 'custom1',
          alignment: 'right',
          key: 'MY_CUSTOM_BUTTON',
        },
      ],
    },
  },
}

@Component({
  standalone: false,
  selector: 'ocx-my-component-to-display',
  template: `<p>Component to display with validation</p>
    <p>It is impossible to close the dialog by clicking secondary button</p>
    <p>Type result to be able to close the dialog via primary button click</p>
    <input type="text" (change)="onInputChange($event)" />`,
})
class WithValidationComponent implements DialogResult<string>, DialogButtonClicked {
  dialogResult = ''

  onInputChange(event: any) {
    const value: string = event.target.value
    this.dialogResult = value
  }

  ocxDialogButtonClicked(
    state: DialogState<unknown>
  ): boolean | void | Observable<boolean> | Promise<boolean> | undefined {
    if (state.button === 'primary' && this.dialogResult === 'result') return true

    return false
  }
}

export const ComponentDisplayedWithValidation = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
            <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
            </ocx-button-dialog-with-portal-dialog-service>
              `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: {
      type: WithValidationComponent,
    },
    primaryKey: {
      key: 'PRIMARY_KEY',
      icon: PrimeIcons.BOOKMARK,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'right',
    },
    secondaryKey: {
      key: 'SECONDARY_KEY',
      icon: PrimeIcons.SEARCH,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'left',
    },
  },
}

export const CustomAutofocus = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
        </ocx-button-dialog-with-portal-dialog-service>
          `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: 'Custom message',
    primaryKey: 'Primary Button',
    secondaryKey: 'Secondary Button',
    extras: {
      autoFocusButton: 'secondary',
    },
  },
}

@Component({
  standalone: false,
  selector: 'ocx-my-component-to-display',
  template: `<p>Hello, its my component to display custom buttons</p>`,
})
class ComponentToDisplayCustomButtonsComponent implements DialogCustomButtonsDisabled, OnInit {
  customButtonEnabled: EventEmitter<{ id: string; enabled: boolean }> = new EventEmitter()
  ngOnInit(): void {
    this.customButtonEnabled.emit({ id: 'custom1', enabled: true })
  }
}

export const CustomButtonsWithAutofocus = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
            <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
            </ocx-button-dialog-with-portal-dialog-service>
              `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: {
      type: ComponentToDisplayCustomButtonsComponent,
    },
    primaryKey: {
      key: 'PRIMARY_KEY',
      icon: PrimeIcons.BOOKMARK,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'right',
    },
    secondaryKey: {
      key: 'SECONDARY_KEY',
      icon: PrimeIcons.SEARCH,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'left',
    },
    extras: {
      customButtons: [
        {
          id: 'custom1',
          alignment: 'right',
          key: 'CUSTOM_KEY',
          icon: 'pi pi-times',
        },
      ],
      autoFocusButton: 'custom',
      autoFocusButtonCustomId: 'custom1',
    },
  },
}

```


File : portal-dialog.service.spec.ts
```ts
import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { ButtonModule } from 'primeng/button'
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog'
import { Observable, of } from 'rxjs'

import { DivHarness, InputHarness } from '@onecx/angular-testing'
import { PrimeIcons } from 'primeng/api'
import { DialogContentHarness, DialogFooterHarness } from '../../../testing/index'
import { DialogMessageContentComponent } from '../components/dialog/dialog-message-content/dialog-message-content.component'
import { DialogContentComponent } from '../components/dialog/dialog-content/dialog-content.component'
import { DialogFooterComponent } from '../components/dialog/dialog-footer/dialog-footer.component'
import {
  DialogButtonClicked,
  DialogPrimaryButtonDisabled,
  DialogResult,
  DialogSecondaryButtonDisabled,
  DialogState,
  PortalDialogService,
} from './portal-dialog.service'
import { provideShellCapabilityServiceMock } from '@onecx/angular-integration-interface/mocks'
import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

// This component is in charge of dialog display
@Component({
  standalone: false,
  template: `<h1>BaseTestComponent</h1>`,
})
class BaseTestComponent {
  portalDialogService = inject(PortalDialogService)

  resultFromShow: DialogState<any> | undefined = undefined
  nameResult: string | undefined
  surnameResult: string | undefined

  show(title: any, message: any, button1: any, button2?: any, showXButton: any = true) {
    this.portalDialogService.openDialog(title, message, button1, button2, showXButton).subscribe({
      next: (result) => {
        this.resultFromShow = result
      },
    })
  }

  showWithType() {
    this.portalDialogService
      .openDialog(
        'Enter credentials',
        {
          type: CompleteDialogComponent,
        },
        'Validate',
        'Hint: Doe'
      )
      .subscribe((result) => {
        this.nameResult = result.result?.name
        this.surnameResult = result.result?.surname
        this.resultFromShow = result
      })
  }
}

// This component should be displayed for testing inputs
@Component({
  standalone: false,
  template: `<div class="testHeader">{{ header }}</div>`,
})
class TestWithInputsComponent {
  @Input() header = 'header'
}

// This component should be displayed for testing result manipulation
@Component({
  standalone: false,
  template: `<h1>DialogResultTestComponent</h1>`,
})
class DialogResultTestComponent implements DialogResult<string> {
  portalDialogService = inject(PortalDialogService)

  @Input() dialogResult = ''
}

// This component should be displayed for testing state validation on button click
// It will only allow dialog to be closed if dialogResult === expectedDialogResult
// Each time button is clicked, dialogResult is increased by 1
@Component({
  standalone: false,
  template: `<h1>DialogButtonClickedWithResultComponent</h1>`,
})
class DialogButtonClickedWithResultComponent implements DialogResult<number>, DialogButtonClicked {
  portalDialogService = inject(PortalDialogService)

  @Input() dialogResult = 13
  @Input() returnType: 'boolean' | 'observable' | 'promise' | 'undefined' = 'boolean'
  @Input() expectedDialogResult = 25

  ocxDialogButtonClicked(state: DialogState<number>): boolean | Observable<boolean> | Promise<boolean> | undefined {
    if (state.result !== this.expectedDialogResult) {
      this.dialogResult++
    }

    if (this.returnType === 'boolean') {
      if (state.result === this.expectedDialogResult) {
        return true
      } else {
        return false
      }
    } else if (this.returnType === 'observable') {
      if (state.result === this.expectedDialogResult) {
        return of(true)
      } else {
        return of(false)
      }
    } else if (this.returnType === 'promise') {
      if (state.result === this.expectedDialogResult) {
        return Promise.resolve(true)
      } else {
        return Promise.resolve(false)
      }
    }

    return undefined
  }
}

// This component should be displayed for testing primary button enablement
@Component({
  standalone: false,
  template: `<h1>DialogPrimaryButtonDisabledComponent</h1>`,
})
class DialogPrimaryButtonDisabledComponent implements DialogPrimaryButtonDisabled {
  @Output()
  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
}

// This component should be displayed for testing secondary button enablement
@Component({
  standalone: false,
  template: `<h1>DialogSecondaryButtonDisabledComponent</h1>`,
})
class DialogSecondaryButtonDisabledComponent implements DialogSecondaryButtonDisabled {
  @Output()
  secondaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
}

interface NameAndSurnameObject {
  name: string
  surname: string
}

// This component should be displayed for testing every part of the PortalDialogService feature
@Component({
  standalone: false,
  template: `<div>
    <h1>CompleteDialogComponent</h1>
    @if (!isNameValid) {
      <div class="nameError">Name is not correct</div>
    }
    <label for="name">Name:</label>
    <input id="name" type="text" (change)="onNameChange($event)" />
    <label for="surname">Surname:</label>
    <input id="surname" type="text" (change)="onSurnameChange($event)" />
    @if (message !== undefined) {
      <div class="message">{{ message }}</div>
    }
  </div>`,
})
export class CompleteDialogComponent
  implements
    DialogSecondaryButtonDisabled,
    DialogPrimaryButtonDisabled,
    DialogButtonClicked,
    DialogResult<NameAndSurnameObject>
{
  @Output()
  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
  @Output()
  secondaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()

  dialogResult: NameAndSurnameObject = {
    name: '',
    surname: '',
  }

  isNameValid = false

  message: string | undefined = undefined

  onNameChange(event: any) {
    const newNameValue: string = event.target.value
    this.dialogResult.name = newNameValue
    if (newNameValue.length < 4 || newNameValue.length == 0) {
      this.isNameValid = false
      this.primaryButtonEnabled.emit(false)
    } else {
      this.isNameValid = true
      this.primaryButtonEnabled.emit(true)
    }
  }

  onSurnameChange(event: any) {
    const newSurnameValue: string = event.target.value
    this.dialogResult.surname = newSurnameValue
    if (newSurnameValue === 'Doe') {
      this.secondaryButtonEnabled.emit(true)
    } else {
      this.secondaryButtonEnabled.emit(false)
    }
  }

  ocxDialogButtonClicked(
    state: DialogState<NameAndSurnameObject>
  ): boolean | Observable<boolean> | Promise<boolean> | undefined {
    if (state.button === 'primary') {
      if (state.result?.name == 'John' && state.result.surname === 'Doe') {
        // use message service
        this.message = 'Welcome John'
        this.dialogResult.name = 'Submitted John'
        this.dialogResult.surname = 'Submitted Doe'
        return true
      }
      this.message = 'Wrong credentials'
      return false
    } else {
      this.message = 'Smart but name should be correct too'
      return false
    }
  }
}

describe('PortalDialogService', () => {
  let pDialogService: DialogService
  let rootLoader: HarnessLoader
  let fixture: ComponentFixture<BaseTestComponent>

  const translations = {
    TITLE_TRANSLATE: 'simpleTitle',
    TITLE_TRANSLATE_PARAM: 'translatedTitle {{val}}',
    MESSAGE: 'myMessage',
    MESSAGE_PARAM: 'myMessage {{val}}',
    BUTTON: 'myButton',
    BUTTON_PARAM: 'myButton {{val}}',
  }

  async function closeBasicDialog(button: 'primary' | 'secondary') {
    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    if (button === 'primary') {
      await footerHarness.clickPrimaryButton()
    } else {
      await footerHarness.clickSecondaryButton()
    }
  }

  const removeChildSpy = jest.fn()
  Object.defineProperty(global.document.body, 'removeChild', { value: removeChildSpy })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BaseTestComponent,
        DialogContentComponent,
        DialogFooterComponent,
        DialogMessageContentComponent,
        CompleteDialogComponent,
        DialogButtonClickedWithResultComponent,
        DialogPrimaryButtonDisabledComponent,
        DialogSecondaryButtonDisabledComponent,
        TestWithInputsComponent,
        DialogResultTestComponent,
      ],
      imports: [
        TranslateTestingModule.withTranslations('en', translations),
        DynamicDialogModule,
        CommonModule,
        NoopAnimationsModule,
        ButtonModule,
      ],
      providers: [
        PortalDialogService,
        DialogService,
        provideShellCapabilityServiceMock(),
        provideAppStateServiceMock(),
      ],
    }).compileComponents()
    fixture = TestBed.createComponent(BaseTestComponent)
    pDialogService = TestBed.inject(DialogService)
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture)
    jest.clearAllMocks()
  })

  it('should display dialog with translated title', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('TITLE_TRANSLATE', 'message', 'button1', 'button2')

    expect(pDialogService.open).toHaveBeenCalledWith(
      DialogContentComponent,
      expect.objectContaining({
        header: translations['TITLE_TRANSLATE'],
      })
    )

    closeBasicDialog('primary')
  })

  it('should display dialog with translated title with parameters', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      { key: 'TITLE_TRANSLATE_PARAM', parameters: { val: 'myParam' } },
      'message',
      'button1',
      'button2'
    )

    expect(pDialogService.open).lastCalledWith(
      DialogContentComponent,
      expect.objectContaining({
        header: 'translatedTitle myParam',
      })
    )

    closeBasicDialog('primary')
  })

  it('should display dialog with translated message', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'MESSAGE', 'button1', 'button2')

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const dialogMessageContentHarness = await contentHarness.getDialogMessageContent()
    expect(await dialogMessageContentHarness?.getMessageContent()).toEqual(translations['MESSAGE'])

    closeBasicDialog('primary')
  })

  it('should display dialog with translated message with parameters', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      { key: 'MESSAGE_PARAM', parameters: { val: 'myMsgParam' } },
      'button1',
      'button2'
    )

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const dialogMessageContentHarness = await contentHarness.getDialogMessageContent()
    const message = await dialogMessageContentHarness?.getMessageContent()
    expect(message).toEqual('myMessage myMsgParam')

    closeBasicDialog('primary')
  })

  it('should display dialog with translated buttons', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'BUTTON', 'BUTTON')

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const primaryButtonLabel = await footerHarness.getPrimaryButtonLabel()
    expect(primaryButtonLabel).toBe(translations['BUTTON'])
    const secondaryButtonLabel = await footerHarness.getSecondaryButtonLabel()
    expect(secondaryButtonLabel).toBe(translations['BUTTON'])

    closeBasicDialog('primary')
  })

  it('should display dialog with translated buttons with parameters', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      'message',
      { key: 'BUTTON_PARAM', parameters: { val: 'myButtonParam1' } },
      { key: 'BUTTON_PARAM', parameters: { val: 'myButtonParam2' } }
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const primaryButtonLabel = await footerHarness.getPrimaryButtonLabel()
    expect(primaryButtonLabel).toBe('myButton myButtonParam1')
    const secondaryButtonLabel = await footerHarness.getSecondaryButtonLabel()
    expect(secondaryButtonLabel).toBe('myButton myButtonParam2')

    closeBasicDialog('primary')
  })

  it('should display dialog with translated buttons with icons', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      'message',
      { key: 'BUTTON', icon: PrimeIcons.TIMES },
      { key: 'BUTTON', icon: PrimeIcons.TRASH }
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const primaryButtonLabel = await footerHarness.getPrimaryButtonLabel()
    const primaryButtonIcon = await footerHarness.getPrimaryButtonIcon()
    expect(primaryButtonLabel).toBe(translations['BUTTON'])
    expect(primaryButtonIcon).toBe(PrimeIcons.TIMES)

    const secondaryButtonLabel = await footerHarness.getSecondaryButtonLabel()
    const secondaryButtonIcon = await footerHarness.getSecondaryButtonIcon()
    expect(secondaryButtonLabel).toBe(translations['BUTTON'])
    expect(secondaryButtonIcon).toBe(PrimeIcons.TRASH)

    closeBasicDialog('primary')
  })

  it('should display dialog with message and icon if DialogMessage provided as string and icon', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', { message: 'MESSAGE', icon: PrimeIcons.TIMES }, 'button1', 'button2')

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const dialogMessageContentHarness = await contentHarness.getDialogMessageContent()
    const message = await dialogMessageContentHarness?.getMessageContent()
    expect(message).toEqual(translations['MESSAGE'])
    const icon = await dialogMessageContentHarness?.getIconValue()
    expect(icon).toContain(PrimeIcons.TIMES)

    closeBasicDialog('primary')
  })

  it('should display dialog with message and icon if DialogMessage provided as TranslationKey and icon', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      { message: { key: 'MESSAGE_PARAM', parameters: { val: 'dialogMessageParam' } }, icon: PrimeIcons.TIMES },
      'button1',
      'button2'
    )

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const dialogMessageContentHarness = await contentHarness.getDialogMessageContent()
    const message = await dialogMessageContentHarness?.getMessageContent()
    expect(message).toEqual('myMessage dialogMessageParam')
    const icon = await dialogMessageContentHarness?.getIconValue()
    expect(icon).toContain(PrimeIcons.TIMES)

    closeBasicDialog('primary')
  })

  it('should display dialog with custom component if provided', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', TestWithInputsComponent, 'button1', 'button2')

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const headerDiv = await contentHarness.getHarness(DivHarness.with({ class: 'testHeader' }))
    const headerValue = await headerDiv.getText()
    expect(headerValue).toEqual('header')

    closeBasicDialog('primary')
  })

  it('should display dialog with custom component and inputs if provided', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: TestWithInputsComponent,
        inputs: {
          header: 'myCustomHeader',
        },
      },
      'button1',
      'button2'
    )

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const headerDiv = await contentHarness.getHarness(DivHarness.with({ class: 'testHeader' }))
    const headerValue = await headerDiv.getText()
    expect(headerValue).toEqual('myCustomHeader')

    closeBasicDialog('primary')
  })

  it('should display dialog with single button if secondary not provided', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1')

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const primaryButtonLabel = await footerHarness.getPrimaryButtonLabel()
    expect(primaryButtonLabel).toBe('button1')
    const secondaryButtonLabel = await footerHarness.getSecondaryButtonLabel()
    expect(secondaryButtonLabel).toBeUndefined()

    closeBasicDialog('primary')
  })

  it('should display dialog without top close button when one button defined', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1', undefined, true)

    expect(pDialogService.open).toHaveBeenCalledWith(
      DialogContentComponent,
      expect.objectContaining({
        closable: false,
      })
    )

    closeBasicDialog('primary')
  })

  it('should display dialog without top close button when both buttons defined but specified to remove the button', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1', 'button2', false)

    expect(pDialogService.open).toHaveBeenCalledWith(
      DialogContentComponent,
      expect.objectContaining({
        closable: false,
      })
    )

    closeBasicDialog('primary')
  })

  it('should display dialog with top close button when both buttons defined and enabled', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1', 'button2', true)

    expect(pDialogService.open).toHaveBeenCalledWith(
      DialogContentComponent,
      expect.objectContaining({
        closable: true,
      })
    )

    closeBasicDialog('primary')
  })

  it('should return dialogState with primary on primaryButton click', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1', 'button2')

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('primary')
    expect(result?.result).toBeUndefined()
  })

  it('should return dialogState with secondary on primaryButton click', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1', 'button2')

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickSecondaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('secondary')
    expect(result?.result).toBeUndefined()
  })

  it('should return dialogState with primary and dialogResult on primaryButton click when component implements DialogResult<T>', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      { type: DialogResultTestComponent, inputs: { dialogResult: 'resultAssignedLater' } },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('primary')
    expect(result?.result).toBe('resultAssignedLater')
  })

  it('should not close dialog when ocxDialogButtonClicked returns false', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'boolean',
          dialogResult: 1,
          expectedDialogResult: 2,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeUndefined()

    // Close dialog
    await footerHarness.clickPrimaryButton()
    const finalResult = fixture.componentInstance.resultFromShow
    expect(finalResult).toBeDefined()
  })

  it('should close dialog when ocxDialogButtonClicked returns true', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'boolean',
          dialogResult: 1,
          expectedDialogResult: 1,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('primary')
    expect(result?.result).toBe(1)
  })

  it('should not close dialog when ocxDialogButtonClicked returns Observable of false', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'observable',
          dialogResult: 1,
          expectedDialogResult: 2,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeUndefined()

    // Close dialog
    await footerHarness.clickPrimaryButton()
    const finalResult = fixture.componentInstance.resultFromShow
    expect(finalResult).toBeDefined()
  })

  it('should close dialog when ocxDialogButtonClicked returns Observable of true', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'observable',
          dialogResult: 4,
          expectedDialogResult: 4,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('primary')
    expect(result?.result).toBe(4)
  })

  it('should not close dialog when ocxDialogButtonClicked returns Promise of false', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'promise',
          dialogResult: 1,
          expectedDialogResult: 2,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeUndefined()

    // Close dialog
    await footerHarness.clickPrimaryButton()
    const finalResult = fixture.componentInstance.resultFromShow
    expect(finalResult).toBeDefined()
  })

  it('should close dialog when ocxDialogButtonClicked returns Promise of true', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'promise',
          dialogResult: 10,
          expectedDialogResult: 10,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('primary')
    expect(result?.result).toBe(10)
  })

  it('should close dialog when ocxDialogButtonClicked returns undefined', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'undefined',
          dialogResult: 13,
          expectedDialogResult: 10,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result?.button).toBe('primary')
    // 14 because dialogResult is increased on each button click
    expect(result?.result).toBe(14)
  })

  it('should disable primary button when component implements DialogPrimaryButtonDisabled interface', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogPrimaryButtonDisabledComponent,
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const isPrimaryButtonDisabled = await footerHarness.getPrimaryButtonDisabled()
    expect(isPrimaryButtonDisabled).toBeTruthy()

    closeBasicDialog('secondary')
  })

  it('should disable secondary button when component implements DialogSecondaryButtonDisabled interface', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogSecondaryButtonDisabledComponent,
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const isSecondaryButtonDisabled = await footerHarness.getSecondaryButtonDisabled()
    expect(isSecondaryButtonDisabled).toBeTruthy()

    closeBasicDialog('primary')
  })

  it('should react to complex component behavior and return when it decides', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.showWithType()

    // init state
    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    let isPrimaryButtonDisabled = await footerHarness.getPrimaryButtonDisabled()
    expect(isPrimaryButtonDisabled).toBeTruthy()
    let isSecondaryButtonDisabled = await footerHarness.getSecondaryButtonDisabled()
    expect(isSecondaryButtonDisabled).toBeTruthy()
    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    let nameErrorDiv = await contentHarness.getHarnessOrNull(DivHarness.with({ class: 'nameError' }))
    const nameErrorDivText = await nameErrorDiv?.getText()
    expect(nameErrorDivText).toBe('Name is not correct')

    // change surname input to Doe
    const surnameInput = await contentHarness.getHarness(InputHarness.with({ id: 'surname' }))
    await surnameInput.setValue('Doe')
    await (await surnameInput.getTestElement()).dispatchEvent('change')

    const surnameValue = await surnameInput.getValue()
    expect(surnameValue).toBe('Doe')

    isPrimaryButtonDisabled = await footerHarness.getPrimaryButtonDisabled()
    expect(isPrimaryButtonDisabled).toBeTruthy()
    isSecondaryButtonDisabled = await footerHarness.getSecondaryButtonDisabled()
    expect(isSecondaryButtonDisabled).toBeFalsy()

    // click secondary button
    await footerHarness.clickSecondaryButton()

    const messageDiv = await contentHarness.getHarness(DivHarness.with({ class: 'message' }))
    let messageText = await messageDiv.getText()
    expect(messageText).toBe('Smart but name should be correct too')

    // change name input to Albert
    const nameInput = await contentHarness.getHarness(InputHarness.with({ id: 'name' }))
    await nameInput.setValue('Albert')
    await (await nameInput.getTestElement()).dispatchEvent('change')

    let nameValue = await nameInput.getValue()
    expect(nameValue).toBe('Albert')
    nameErrorDiv = await contentHarness.getHarnessOrNull(DivHarness.with({ class: 'nameError' }))
    expect(nameErrorDiv).toBeNull()

    isPrimaryButtonDisabled = await footerHarness.getPrimaryButtonDisabled()
    expect(isPrimaryButtonDisabled).toBeFalsy()
    isSecondaryButtonDisabled = await footerHarness.getSecondaryButtonDisabled()
    expect(isSecondaryButtonDisabled).toBeFalsy()

    // click primary button
    await footerHarness.clickPrimaryButton()

    messageText = await messageDiv.getText()
    expect(messageText).toBe('Wrong credentials')

    //change name input to John
    await nameInput.setValue('John')
    await (await nameInput.getTestElement()).dispatchEvent('change')

    nameValue = await nameInput.getValue()
    expect(nameValue).toBe('John')

    isPrimaryButtonDisabled = await footerHarness.getPrimaryButtonDisabled()
    expect(isPrimaryButtonDisabled).toBeFalsy()
    isSecondaryButtonDisabled = await footerHarness.getSecondaryButtonDisabled()
    expect(isSecondaryButtonDisabled).toBeFalsy()

    // click primary button
    await footerHarness.clickPrimaryButton()

    // expect dialog to close with observable containing last state
    const result = fixture.componentInstance.resultFromShow
    expect(result?.button).toBe('primary')
    expect(result?.result).toEqual({
      name: 'Submitted John',
      surname: 'Submitted Doe',
    })
    expect(fixture.componentInstance.nameResult).toBe('Submitted John')
    expect(fixture.componentInstance.surnameResult).toBe('Submitted Doe')
  })

  it('should close dialog and remove it from html on destroy', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      { key: 'MESSAGE_PARAM', parameters: { val: 'myMsgParam' } },
      'button1',
      'button2'
    )

    const dialogService = TestBed.inject(DialogService)
    expect(dialogService.dialogComponentRefMap.size).toBe(1)
    const dialogRef = dialogService.dialogComponentRefMap.keys().next().value as DynamicDialogRef
    expect(dialogRef).toBeDefined()
    const dialogRefSpy = jest.spyOn(dialogRef, 'close')

    const dialogElement = dialogService.getInstance(dialogRef).el.nativeElement

    fixture.detectChanges()

    fixture.componentInstance.portalDialogService.ngOnDestroy()
    expect(dialogRefSpy).toHaveBeenCalledTimes(1)
    expect(removeChildSpy).toHaveBeenCalledWith(dialogElement)
  })
})

```


File : portal-dialog.service.ts
```ts
import { EventEmitter, Injectable, OnDestroy, Type, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DialogService, DynamicDialogComponent } from 'primeng/dynamicdialog'
import { Observable, filter, mergeMap } from 'rxjs'

import { ButtonDialogButtonDetails, ButtonDialogCustomButtonDetails, ButtonDialogData } from '../model/button-dialog'
import { NavigationStart, Router } from '@angular/router'
import {
  SKIP_STYLE_SCOPING,
  dataNoPortalLayoutStylesKey,
  dataStyleIdKey,
  getScopeIdentifier,
} from '@onecx/angular-utils'
import { REMOTE_COMPONENT_CONFIG } from '@onecx/angular-remote-components'
import { CurrentLocationTopicPayload, EventsTopic, EventType, TopicEventType } from '@onecx/integration-interface'
import { Capability, ShellCapabilityService, AppStateService } from '@onecx/angular-integration-interface'
import { PrimeIcon } from '../utils/primeicon.utils'
import { DialogContentComponent } from '../components/dialog/dialog-content/dialog-content.component'
import { DialogFooterComponent } from '../components/dialog/dialog-footer/dialog-footer.component'
import { DialogMessageContentComponent } from '../components/dialog/dialog-message-content/dialog-message-content.component'
import { TranslationKey, TranslationKeyWithParameters } from '../model/translation.model'

/**
 * Object containing message of type {@link TranslationKey} and icon to be displayed along the message.
 *
 * @example
 * DialogMessage with TranslationKey will display 'text with parameter value = hello' and question mark icon
 *
 * ## Assume such translation is in the translation file
 * ```
 * const translations = {
 *   MY_KEY = 'text with parameter value = {{value}}',
 * }
 * ```
 *
 * ## DialogMessage declaration
 * ```
 * const myDialogMessage: DialogMessage = {
 *   message: {
 *     key: 'MY_KEY',
 *     parameters: {
 *       value = 'hello',
 *     },
 *   },
 *   icon: PrimeIcons.QUESTION
 * }
 * ```
 */
type DialogMessage = { message: TranslationKey; icon: PrimeIcon }

/**
 * Implement via component class to be displayed by {@link PortalDialogService.openDialog}
 *
 * Use if you want {@link PortalDialogService.openDialog} to return state of displayed component's current dialogResult value alongside the clicked button.
 *
 * @example
 * Display component implementing DialogResult<string> and react on the returned value
 *
 * ## Component declaration
 * ```
 * ⁣@Component({template: `<div>
 * <input (change)="onInputChange($event)">
 * </div>`})
 * export class MyInputComponent implements DialogResult<string> {
 *   dialogResult: string = ''
 *
 *   onInputChange(event: any) {
 *     this.dialogResult = event.target.value
 *   }
 * }
 * ```
 *
 * ## PortalDialogService call
 * ```
 * portalDialogService.openDialog(title, { type: MyInputComponent }, primaryButton, ...).subscribe((result: DialogState<string>) => {
 * // result.value === MyInputComponent.dialogResult (during button click)
 * // behavior when dialog closes
 * })
 * ```
 *
 */
export interface DialogResult<T> {
  dialogResult: T
}
/**
 * Implement via component class to be displayed by {@link PortalDialogService.openDialog}
 *
 * Use to control the state of the primary button (disabled or enabled). Whenever your component wants to disable/enable primary button it should emit boolean equal to whether primary button should be enabled.
 *
 * If you implement this interface then primary button will be disabled until the emitter emits true
 */
export interface DialogPrimaryButtonDisabled {
  primaryButtonEnabled: EventEmitter<boolean>
}
/**
 * Implement via component class to be displayed by {@link PortalDialogService.openDialog}
 *
 * Use to control the state of the secondary button (disabled or enabled). Whenever your component wants to disable/enable secondary button it should emit boolean equal to whether secondary button should be enabled.
 *
 * If you implement this interface then secondary button will be disabled until the emitter emits true
 */
export interface DialogSecondaryButtonDisabled {
  secondaryButtonEnabled: EventEmitter<boolean>
}

/**
 * Implement via component class to be displayed by {@link PortalDialogService.openDialog}
 *
 * Use to control the state of custom buttons (disabled or enabled). Whenever your component wants to disable/enable any custom button it should emit an object indicating which button should be disabled/enabled. This object should contain id property (string) related to previously defined button and enabled property (boolean) equal to whether custom button should be enabled.
 *
 * If you implement this interface then all custom buttons will be disabled until the emitter emits true
 */
export interface DialogCustomButtonsDisabled {
  customButtonEnabled: EventEmitter<{ id: string; enabled: boolean }>
}
/**
 * Implement via component class to be displayed by {@link PortalDialogService.openDialog}
 *
 * Use to add behavior on button clicks. {@link DialogButtonClicked.ocxDialogButtonClicked} method will be called everytime any button is clicked and should return boolean value (or Observable<boolean> or Promise<boolean>) equal to whether dialog should be closed or not.
 *
 * {@link DialogButtonClicked.ocxDialogButtonClicked} will recieve object containing component's state captured on button click. It will have button property with value 'primary' or 'secondary' which determines which button was clicked.
 *
 * It will also have result property which by default will be undefined, however if you want to add any properties to the state please combine this interface with {@link DialogResult}. That way result will be equal to component's dialogResult property captured on button click.
 *
 * @example
 * Display component implementing DialogResult<string> and DialogButtonClicked which should not close dialog on clear click but should close when send clicked and api call was sucessful
 *
 * ## Component declaration
 * ```
 * ⁣@Component({template: `<div>
 * <input (change)="onInputChange($event)">
 * </div>`})
 * export class MyInputComponent implements DialogResult<string>, DialogButtonClicked {
 *   dialogResult: string = ''
 *
 *   onInputChange(event: any) {
 *     this.dialogResult = event.target.value
 *   }
 *
 *   ocxDialogButtonClicked(state: DialogState<string>) {
 *     // here you can do any operations you desire
 *     // such as form validation
 *     // api calls and so on
 *     if (state.button === 'primary') {
 *       // send form data to server
 *       this.apiService.postInput(state.result, ...).pipe(
 *         // map response to boolean meaning if call was successfull
 *       )
 *       return true // if dialog should be closed return true
 *     } else {
 *       // clear input
 *       return false // don't want to close the dialog, only to clear it
 *     }
 *   }
 * }
 * ```
 *
 * ## PortalDialogService call
 * ```
 * portalDialogService.openDialog(title, { type: MyInputComponent }, "Send", "Clear").subscribe((result: DialogState<string>) => {
 * // behavior to be fired when dialog closes
 * })
 * ```
 */
export interface DialogButtonClicked<T = unknown> {
  ocxDialogButtonClicked(state: DialogState<T>): Observable<boolean> | Promise<boolean> | boolean | undefined | void
}

/**
 * Object containing component type to be displayed and inputs to populate the component.
 *
 * @example
 *
 * ```
 * ⁣@Component({template: `<h1>{{content}}</h1>`})
 * export class MyComponent {
 *   ⁣@Input() content: string = ''
 * }
 * const myComponent = {
 *   type: MyComponent,
 *   inputs: {
 *     content: 'My header content',
 *   },
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
type Component<T extends unknown> = unknown extends T
  ? {
      type: Type<any>
      inputs?: Record<string, unknown>
    }
  : {
      type: Type<DialogResult<T>>
      inputs?: Record<string, unknown>
    }

export type DialogButton = 'primary' | 'secondary' | 'custom'
export type DialogStateButtonClicked = 'primary' | 'secondary' | 'custom'

/**
 * Object containing information about clicked button ('primary' or 'secondary') and displayed component state captured on button click (only if component implements {@link DialogResult} interface)
 */
export type DialogState<T> = {
  button: DialogStateButtonClicked
  result: T | undefined
  id?: string
}

export type PortalDialogConfig = {
  showXButton?: boolean
  customButtons?: ButtonDialogCustomButtonDetails[]
  autoFocusButton?: DialogButton
  autoFocusButtonCustomId?: string
  ariaLabelledBy?: string
  width?: string
  height?: string
  closeOnEscape?: boolean
  focusOnShow?: boolean
  focusTrap?: boolean
  baseZIndex?: number
  autoZIndex?: boolean
  dismissableMask?: boolean
  showHeader?: boolean
  modal?: boolean
  resizable?: boolean
  draggable?: boolean
  keepInViewport?: boolean
  minX?: number
  minY?: number
  maximizable?: boolean
  maximizeIcon?: string
  minimizeIcon?: string
  position?: string
  closeAriaLabel?: string
}

export interface PortalDialogServiceData {
  primaryButtonEnabled$: EventEmitter<boolean>
  secondaryButtonEnabled$: EventEmitter<boolean>
  customButtonEnabled$: EventEmitter<{ id: string; enabled: boolean }>
  buttonClicked$: EventEmitter<DialogState<unknown>>
}

@Injectable({ providedIn: 'any' })
export class PortalDialogService implements OnDestroy {
  private dialogService = inject(DialogService)
  private translateService = inject(TranslateService)
  private router = inject(Router)
  private _eventsTopic$: EventsTopic | undefined
  get eventsTopic() {
    this._eventsTopic$ ??= new EventsTopic()
    return this._eventsTopic$
  }
  set eventsTopic(source: EventsTopic) {
    this._eventsTopic$ = source
  }
  private skipStyleScoping = inject(SKIP_STYLE_SCOPING, { optional: true })
  private remoteComponentConfig = inject(REMOTE_COMPONENT_CONFIG, { optional: true })
  private appStateService = inject(AppStateService)
  private capabilityService = inject(ShellCapabilityService)

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.cleanupAndCloseDialog()
      }
    })
    let observable: Observable<TopicEventType | CurrentLocationTopicPayload> =
      this.appStateService.currentLocation$.asObservable()
    if (!this.capabilityService.hasCapability(Capability.CURRENT_LOCATION_TOPIC)) {
      observable = this.eventsTopic.pipe(filter((e) => e.type === EventType.NAVIGATED))
    }
    observable.subscribe(() => {
      this.cleanupAndCloseDialog()
    })
  }

  ngOnDestroy(): void {
    this.cleanupAndCloseDialog()
    this._eventsTopic$?.destroy()
  }

  /**
   * Opens dialog with a component or message to display and one or two buttons. This method allows you to customize the dialog using parameters and by implementic specific interfaces via component to be displayed. The dialog is only shown if if you subscribe to this function.
   *
   * Displaying component inisde the dialog can be achieved by providing the component class with optional inputs. By default the component will be shown without any interaction with the dialog, however you can implement the following interfaces by your component class to allow for some interactions:
   * - {@link DialogResult} - dialog state will contain dialogResult property
   *
   * - {@link DialogButtonClicked} - on button click ocxDialogButtonClicked function will be called with dialog state as a parameter. You should return true if you want dialog to be close or false if not and add any operations on your component.
   *
   * - {@link DialogPrimaryButtonDisabled} - dialog will use the EventEmitter to determine if the primary button should be disabled
   *
   * - {@link DialogSecondaryButtonDisabled} - dialog will use the EventEmitter to determine if the secondary button should be disabled
   *
   * - {@link DialogCustomButtonsDisabled} - dialog will use the EventEmitter to determine if the custom buttons should be disabled
   *
   * @param title Translation key for dialog title
   * @param componentOrMessage Either a component or a translation key of a message with optional parameters and icon to be displayed next to the message
   * @param primaryButtonTranslationKeyOrDetails Translation key with optional parameters and icon to be displayed next to the text of the button
   * @param secondaryButtonTranslationKeyOrDetails Translation key with optional parameters and icon to be displayed next to the text of the button
   * @param extras Configuration object allowing for customization of the dialog behavior and visual aspects
   * @returns Observable containing dialog state on close
   *
   *
   * @example
   * Display dialog with message and two buttons using translation keys
   *
   * ```
   * // assume 'TITLE_KEY', 'WELCOME_MESSAGE', 'OK_BUTTON' and 'REFRESH_BUTTON' are translation keys
   * this.portalDialogService.openDialog('TITLE_KEY', 'WELCOME_MESSAGE', 'OK_BUTTON', 'REFRESH_BUTTON').subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * Display dialog message with icon and single button
   *
   * ```
   * // Welcome message with question mark icon
   * const dialogMessage = {
   *   key: 'WELCOME_MESSAGE',
   *   icon: PrimeIcons.QUESTION
   * }
   * this.portalDialogService.openDialog('TITLE_KEY', dialogMessage, 'OK_BUTTON').subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * Display dialog message with two customized buttons
   *
   * ```
   * // Ok button with check icon
   * const primaryButton = {
   *   key: 'OK_BUTTON',
   *   icon: PrimeIcons.CHECK
   *   tooltipKey: 'OK_TOOLTIP',
   *   tooltipPosition: 'bottom'
   * }
   *
   * // Refresh button with refresh icon
   * const secondaryButton = {
   *   key: 'REFRESH_BUTTON',
   *   icon: PrimeIcons.REFRESH
   *   tooltipKey: 'REFRESH_TOOLTIP',
   *   tooltipPosition: 'right'
   * }
   *
   * this.portalDialogService.openDialog('TITLE_KEY', 'WELCOME_MESSAGE', primaryButton, secondaryButton).subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * Display dialog message without X button in top right corner
   *
   * ```
   * this.portalDialogService.openDialog('TITLE_KEY', 'WELCOME_MESSAGE', 'OK_BUTTON', 'REFRESH_BUTTON', false).subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * React on dialog closing
   *
   * ```
   * this.portalDialogService.openDialog('TITLE_KEY', 'WELCOME_MESSAGE', 'OK_BUTTON', 'REFRESH_BUTTON').subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * Display dialog with component
   *
   * ## Component declaration
   * ```
   * ⁣@Component({template: `<div>
   * <h1>{{header | translate}}</h1>
   * <input (change)="onInputChange($event)">
   * </div>`})
   * export class MyInputComponent implements DialogResult<string>,  DialogButtonClicked, DialogPrimaryButtonDisabled, DialogSecondaryButtonDisabled {
   *   ⁣@Input() header: string = ''
   *   // change value to manipulate component state visible by dialog
   *   dialogResult: string = ''
   *   // emit true/false to disable primary button
   *   ⁣@Output() primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
   *   // emit true/false to disable secondary button
   *   ⁣@Output() secondaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
   *
   *   // implement operations to be done on button clicks and return if the dialog should be closed
   *   ocxDialogButtonClicked(state: DialogState<string>) {
   *     return true
   *   }
   *
   *   onInputChange(event: any) {
   *     this.dialogResult = event.target.value
   *   }
   * }
   * ```
   *
   * ## PortalDialogService call
   * ```
   * const myComponent = {
   *   type: MyInputComponent,
   *   inputs: {
   *     header: 'DIALOG_HEADER'
   *   }
   * }
   * this.portalDialogService.openDialog('TITLE_KEY', myComponent, 'OK_BUTTON', 'REFRESH_BUTTON').subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * Display dialog with component without passing inputs
   *
   * ## PortalDialogService call
   * ```
   * this.portalDialogService.openDialog('TITLE_KEY', MyInputComponent, 'OK_BUTTON', 'REFRESH_BUTTON').subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   */
  openDialog<T>(
    title: TranslationKey | null,
    componentOrMessage: Type<any> | Type<DialogResult<T>> | Component<T> | TranslationKey | DialogMessage,
    primaryButtonTranslationKeyOrDetails: TranslationKey | ButtonDialogButtonDetails,
    secondaryButtonTranslationKeyOrDetails?: TranslationKey | ButtonDialogButtonDetails,
    extras?: PortalDialogConfig
  ): Observable<DialogState<T>>
  openDialog<T>(
    title: TranslationKey | null,
    componentOrMessage: Type<any> | Type<DialogResult<T>> | Component<T> | TranslationKey | DialogMessage,
    primaryButtonTranslationKeyOrDetails: TranslationKey | ButtonDialogButtonDetails,
    secondaryButtonTranslationKeyOrDetails?: TranslationKey | ButtonDialogButtonDetails,
    extrasOrShowXButton: PortalDialogConfig | boolean = {}
  ): Observable<DialogState<T>> {
    const dialogOptions: PortalDialogConfig =
      typeof extrasOrShowXButton === 'object'
        ? extrasOrShowXButton
        : {
            showXButton: extrasOrShowXButton,
          }
    const translateParams = this.prepareTitleForTranslation(title)

    const componentToRender: Component<any> = this.getComponentToRender(componentOrMessage)
    const dynamicDialogDataConfig: ButtonDialogData = {
      component: componentToRender.type as Type<any>,
      config: {
        primaryButtonDetails: this.buttonDetailsOrTranslationKey(primaryButtonTranslationKeyOrDetails),
        secondaryButtonIncluded: secondaryButtonTranslationKeyOrDetails !== undefined,
        secondaryButtonDetails: this.buttonDetailsOrTranslationKey(secondaryButtonTranslationKeyOrDetails),
        customButtons: dialogOptions.customButtons?.map(
          (button) => this.buttonDetailsOrTranslationKey(button) as ButtonDialogCustomButtonDetails
        ),
        autoFocusButton: dialogOptions.autoFocusButton,
        autoFocusButtonCustomId: dialogOptions.autoFocusButtonCustomId,
      },
      componentData: componentToRender.inputs,
    }

    return this.translateService.get(translateParams.key, translateParams.parameters).pipe(
      mergeMap((dialogTitle) => {
        const dialogRef = this.dialogService.open(DialogContentComponent, {
          header: dialogTitle,
          data: {
            ...dynamicDialogDataConfig,
            portalDialogServiceData: {
              primaryButtonEnabled$: new EventEmitter(),
              secondaryButtonEnabled$: new EventEmitter(),
              customButtonEnabled$: new EventEmitter(),
              buttonClicked$: new EventEmitter(),
            } satisfies PortalDialogServiceData,
          },
          closable: dialogOptions.showXButton && secondaryButtonTranslationKeyOrDetails !== undefined,
          modal: true,
          ...dialogOptions,
          focusOnShow: false,
          appendTo: 'body', // Important for the function findBodyChild
          duplicate: true, // Since dialog always opens DialogContentComponent, duplicates must be always allowed
          templates: {
            footer: DialogFooterComponent,
          },
        })
        this.setScopeIdentifier(this.dialogService.getInstance(dialogRef))
        return dialogRef.onClose
      })
    )
  }

  private cleanupAndCloseDialog() {
    if (this.dialogService.dialogComponentRefMap.size > 0) {
      this.dialogService.dialogComponentRefMap.forEach((_, dialogRef) => {
        const dialogComponent = this.dialogService.getInstance(dialogRef)
        dialogRef.close()
        this.removeDialogFromHtml(dialogComponent)
      })
    }
  }

  private removeDialogFromHtml(dialogComponent: DynamicDialogComponent) {
    const bodyChild = this.findDialogComponentBodyChild(dialogComponent)
    bodyChild && document.body.removeChild(bodyChild)
  }

  private setScopeIdentifier(dialogComponent: DynamicDialogComponent) {
    getScopeIdentifier(
      this.appStateService,
      this.skipStyleScoping ?? undefined,
      this.remoteComponentConfig ?? undefined
    ).then((scopeId) => {
      const bodyChild = this.findDialogComponentBodyChild(dialogComponent)
      if (bodyChild) {
        bodyChild.dataset[dataStyleIdKey] = scopeId
        bodyChild.dataset[dataNoPortalLayoutStylesKey] = ''
      }
    })
  }

  private findDialogComponentBodyChild(dialogComponent: DynamicDialogComponent) {
    const element = dialogComponent.el.nativeElement
    if (!element) return
    return this.findBodyChild(element)
  }

  private findBodyChild(element: HTMLElement) {
    let currentNode = element
    while (currentNode.parentElement && currentNode.parentElement != document.body) {
      currentNode = currentNode.parentElement
    }
    return currentNode.parentElement === document.body ? currentNode : undefined
  }

  private prepareTitleForTranslation(title: TranslationKey | null): TranslationKeyWithParameters {
    if (!title) return { key: '', parameters: {} }
    if (this.isString(title)) return { key: title, parameters: {} }
    return title
  }

  private buttonDetailsOrTranslationKey(
    buttonTranslationKeyOrDetails:
      | TranslationKey
      | ButtonDialogButtonDetails
      | ButtonDialogCustomButtonDetails
      | undefined
  ): ButtonDialogButtonDetails | ButtonDialogCustomButtonDetails | undefined {
    if (buttonTranslationKeyOrDetails === undefined) {
      return undefined
    }

    let buttonDetails

    if (this.isString(buttonTranslationKeyOrDetails)) {
      buttonDetails = {
        key: buttonTranslationKeyOrDetails,
      }
    } else {
      buttonDetails = buttonTranslationKeyOrDetails
    }

    return buttonDetails
  }

  private getComponentToRender(
    componentOrMessage: Type<any> | Type<DialogResult<any>> | Component<any> | TranslationKey | DialogMessage
  ): Component<any> {
    if (this.isTranslationKey(componentOrMessage)) {
      return {
        type: DialogMessageContentComponent,
        inputs: {
          message: this.isString(componentOrMessage) ? componentOrMessage : componentOrMessage.key,
          messageParameters: this.isString(componentOrMessage) ? {} : componentOrMessage.parameters,
        },
      }
    } else if (this.isDialogMessage(componentOrMessage)) {
      return {
        type: DialogMessageContentComponent,
        inputs: {
          message: this.isString(componentOrMessage.message)
            ? componentOrMessage.message
            : componentOrMessage.message.key,
          icon: componentOrMessage.icon,
          messageParameters: this.isString(componentOrMessage.message) ? {} : componentOrMessage.message.parameters,
        },
      }
    } else if (this.isType(componentOrMessage)) {
      return {
        type: componentOrMessage,
      }
    }
    return componentOrMessage
  }

  private isTranslationKey(obj: any): obj is TranslationKey {
    return this.isString(obj) || ('key' in obj && 'parameters' in obj)
  }

  private isString(obj: any): obj is string {
    return typeof obj === 'string' || obj instanceof String
  }

  private isDialogMessage(obj: any): obj is DialogMessage {
    return 'message' in obj && 'icon' in obj
  }

  private isType(obj: any): obj is Type<any> {
    return obj instanceof Type
  }
}

export function providePortalDialogService() {
  return [DialogService, PortalDialogService]
}

```





********************************************************************************************************************************

Folder : onecx-portal-ui-libs > libs > angular-accelerator > src > lib > utils

File : colorutils.ts
```ts
export class ColorUtils {
  public static calculatePoint(
    i: number,
    intervalSize: number,
    colorRangeInfo: { colorStart: any; colorEnd: any; useEndAsStart: any }
  ): any {
    const { colorStart, colorEnd, useEndAsStart } = colorRangeInfo
    return useEndAsStart ? colorEnd - i * intervalSize : colorStart + i * intervalSize
  }

  public static interpolateColors(
    dataLength: number,
    colorScale: (arg0: any) => any,
    colorRangeInfo: { colorStart: any; colorEnd: any; useEndAsStart: any }
  ): any {
    const { colorStart, colorEnd } = colorRangeInfo
    const colorRange = colorEnd - colorStart
    const intervalSize = colorRange / dataLength
    let i, colorPoint
    const colorArray = []

    for (i = 0; i < dataLength; i++) {
      colorPoint = this.calculatePoint(i, intervalSize, colorRangeInfo)
      colorArray.push(colorScale(colorPoint))
    }

    return colorArray
  }
}

```


File : criteria.utils.ts
```ts
import { QueryList } from '@angular/core'
import { getUTCDateWithoutTimezoneIssues, isValidDate } from '@onecx/accelerator'
import { DatePicker } from 'primeng/datepicker'

export type hasShowTimeFunction = (key: string) => boolean
/**
 * removeNullValues: whether to remove entries from the search criteria where the value is null
 */
export interface BuildSearchCriteriaParameters {
  removeNullValues: boolean
}

function _hasShowTime(datePickers: QueryList<DatePicker>, formKey: string): boolean {
  return (
    datePickers.find((d) => {
      return d.name === formKey
    })?.showTime === true
  )
}

/**
 * Safely builds the search criteria based on form values
 * @param formRawValue the raw value of the form to use
 * @param datePickers a list of primeng datePickers of the form (use `@ViewChildren(DatePicker) datePickers!: QueryList<DatePicker>;`)
 * @param parameters {@link BuildSearchCriteriaParameters}  to use when building the search criteria
 * @returns the search criteria as a partial of T (T = type of the search criteria)
 */
export function buildSearchCriteria<T>(
  formRawValue: any,
  datePickers: QueryList<DatePicker>,
  { removeNullValues = false }: BuildSearchCriteriaParameters
) {
  return Object.entries(formRawValue).reduce((acc: Partial<T>, [key, value]) => {
    if (value == null && removeNullValues) {
      return acc
    }
    if (isValidDate(value) && !_hasShowTime(datePickers, key)) {
      value = getUTCDateWithoutTimezoneIssues(value)
    }
    return {
      ...acc,
      [key]: value,
    }
  }, {})
}

```


File : data-operation-strategy.spec.ts
```ts
import { TestBed } from '@angular/core/testing'
import { DataOperationStrategy } from './data-operation-strategy'
import { DataTableColumn } from '../model/data-table-column.model'
import { FilterObject, FilterType } from '../model/filter.model'
import { ColumnType } from '../model/column-type.model'

/* eslint-disable @typescript-eslint/no-unused-vars */
class NumberOperationStrategy extends DataOperationStrategy {
  override equals(column: DataTableColumn, value: unknown, target: unknown): boolean {
    return Number(value) === Number(target)
  }
  override lessThan(column: DataTableColumn, value: unknown, target: unknown): boolean {
    return Number(value) < Number(target)
  }
  override compare(a: unknown, b: unknown, column: DataTableColumn): number {
    return Number(a) - Number(b)
  }
}

class DateOperationStrategy extends DataOperationStrategy {
  override equals(column: DataTableColumn, value: unknown, target: unknown): boolean {
    if (!value || !(value instanceof Date) || !(target instanceof Date)) return false
    // different implementation based on the column
    let precision: 'day' | 'year' = 'year'
    if (column.id === 'dayCol') precision = 'day'

    if (precision === 'day') {
      return (
        value.getFullYear() === target.getFullYear() &&
        value.getMonth() === target.getMonth() &&
        value.getDate() === target.getDate()
      )
    }
    return value.getFullYear() === target.getFullYear()
  }

  override isNotEmpty(column: DataTableColumn, value: unknown): boolean {
    return !!value
  }

  override compare(a: Date, b: Date, column: DataTableColumn): number {
    let precision: 'day' | 'year' = 'year'
    if (column.id === 'dayCol') precision = 'day'

    const aYear = a.getFullYear()
    const aMonth = a.getMonth()
    const aDay = a.getDate()

    const bYear = b.getFullYear()
    const bMonth = b.getMonth()
    const bDay = b.getDate()

    if (aYear !== bYear || precision === 'year') {
      return aYear - bYear
    }
    if (aMonth !== bMonth) {
      return aMonth - bMonth
    }
    return aDay - bDay
  }

  override filterOptions(hayStack: unknown[], filterObject: FilterObject, columns: DataTableColumn[]) {
    if (filterObject.filterType === FilterType.IS_NOT_EMPTY) {
      return ['yes', 'no']
    }

    const hayStackValues = hayStack
      .map((item) => this.mapHaystackItemToValue(item, filterObject))
      .filter((item) => !!item)
    const column = columns.find((c) => c.id === filterObject.columnId)
    if (!column) {
      console.warn('Filter does not have a column id set. All items will be considered a valid option')
      return hayStackValues
    }

    let precision: 'day' | 'year' = 'year'
    if (column.id === 'dayCol') precision = 'day'

    return hayStackValues.filter(
      (item, index, self) => index === self.findIndex((t) => this.compare(t, item, column) === 0)
    )
  }
}

describe('DataOperationStrategy', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
    }).compileComponents()
  })

  describe('NumberOperationStrategy', () => {
    const items = [
      {
        col: 1,
      },
      {
        col: 2,
      },
      {
        col: 3,
      },
      {
        col: 2,
      },
      {
        col: 4,
      },
    ]
    const strategy = new NumberOperationStrategy()
    const columns: DataTableColumn[] = [
      {
        id: 'col',
        nameKey: '',
        columnType: ColumnType.NUMBER,
      },
    ]

    it('should result in equal numbers for filter', () => {
      const result = strategy.filter(
        items,
        {
          value: 2,
          filterType: FilterType.EQUALS,
          columnId: 'col',
        },
        columns
      )
      expect(result).toEqual([{ col: 2 }, { col: 2 }])
    })

    it('should result in lower numbers for filter', () => {
      const result = strategy.filter(
        items,
        {
          value: 3,
          filterType: FilterType.LESS_THAN,
          columnId: 'col',
        },
        columns
      )
      expect(result).toEqual([{ col: 1 }, { col: 2 }, { col: 2 }])
    })

    it('should result in unique numbers for filterOptions', () => {
      const result = strategy.filterOptions(
        items,
        {
          filterType: FilterType.LESS_THAN,
          columnId: 'col',
        },
        columns
      )
      expect(result).toEqual([1, 2, 3, 4])
    })

    it('should return all items for filter if filter type not set', () => {
      const result = strategy.filter(
        items,
        {
          value: 3,
          columnId: 'col',
        },
        columns
      )
      expect(result).toEqual(items)
    })
    it('should return all items for filter if column not found', () => {
      const result = strategy.filter(
        items,
        {
          value: 3,
          filterType: FilterType.EQUALS,
          columnId: 'col',
        },
        []
      )
      expect(result).toEqual(items)
    })
    it('should return all items for filterOptions if column not found', () => {
      const result = strategy.filterOptions(
        items,
        {
          filterType: FilterType.LESS_THAN,
          columnId: 'col',
        },
        []
      )
      expect(result).toEqual(items.map((i) => i.col))
    })
  })

  describe('DateOperationStrategy', () => {
    const items = [
      {
        yearCol: new Date(2020, 1, 13),
        dayCol: new Date(2020, 1, 13),
      },
      {
        yearCol: new Date(2020, 1, 13),
        dayCol: new Date(2020, 1, 13),
      },
      {
        yearCol: new Date(2021, 1, 13),
        dayCol: new Date(2021, 1, 13),
      },
      {
        yearCol: new Date(2022, 7, 20),
        dayCol: new Date(2022, 7, 20),
      },
      {
        yearCol: new Date(2022, 1, 13),
        dayCol: new Date(2022, 1, 13),
      },
      {
        yearCol: new Date(2024, 7, 20),
        dayCol: new Date(2024, 7, 20),
      },
      {
        yearCol: undefined,
        dayCol: undefined,
      },
    ]
    const strategy = new DateOperationStrategy()
    const columns: DataTableColumn[] = [
      {
        id: 'yearCol',
        nameKey: '',
        columnType: ColumnType.DATE,
      },
      {
        id: 'dayCol',
        nameKey: '',
        columnType: ColumnType.DATE,
      },
    ]
    const yearCol = 'yearCol'
    const dayCol = 'dayCol'

    it('should result in equal dates with year precision', () => {
      const result = strategy.filter(
        items,
        {
          columnId: yearCol,
          filterType: FilterType.EQUALS,
          value: new Date(2022, 7, 20),
        },
        columns
      )

      expect(result).toEqual([
        { yearCol: new Date(2022, 7, 20), dayCol: new Date(2022, 7, 20) },
        { yearCol: new Date(2022, 1, 13), dayCol: new Date(2022, 1, 13) },
      ])
    })

    it('should result in equal dates with day precision', () => {
      const result = strategy.filter(
        items,
        {
          columnId: dayCol,
          filterType: FilterType.EQUALS,
          value: new Date(2020, 1, 13),
        },
        columns
      )

      expect(result).toEqual([
        { yearCol: new Date(2020, 1, 13), dayCol: new Date(2020, 1, 13) },
        { yearCol: new Date(2020, 1, 13), dayCol: new Date(2020, 1, 13) },
      ])
    })
    it('should result in non empty dates', () => {
      const result = strategy.filter(
        items,
        {
          columnId: yearCol,
          filterType: FilterType.IS_NOT_EMPTY,
          value: 'yes',
        },
        columns
      )

      expect(result.length).toEqual(items.length - 1)
    })
    it('should result in unique dates with year precision', () => {
      const result = strategy.filterOptions(
        items,
        {
          columnId: yearCol,
          filterType: FilterType.EQUALS,
        },
        columns
      )

      expect(result).toEqual([
        new Date(2020, 1, 13),
        new Date(2021, 1, 13),
        new Date(2022, 7, 20),
        new Date(2024, 7, 20),
      ])
    })
    it('should result in unique dates with day precision', () => {
      const result = strategy.filterOptions(
        items,
        {
          columnId: dayCol,
          filterType: FilterType.EQUALS,
        },
        columns
      )

      expect(result).toEqual([
        new Date(2020, 1, 13),
        new Date(2021, 1, 13),
        new Date(2022, 7, 20),
        new Date(2022, 1, 13),
        new Date(2024, 7, 20),
      ])
    })
    it('should result in yes and no options with not empty filter', () => {
      const result = strategy.filterOptions(
        items,
        {
          columnId: dayCol,
          filterType: FilterType.IS_NOT_EMPTY,
        },
        columns
      )

      expect(result).toEqual(['yes', 'no'])
    })
  })
})

```


File : data-operation-strategy.ts
```ts
import { DataTableColumn } from '../model/data-table-column.model'
import { Filter, FilterObject } from '../model/filter.model'
import { ObjectUtils } from './objectutils'

/* eslint-disable @typescript-eslint/no-unused-vars */
export abstract class DataOperationStrategy {
  endsWith(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('endsWith method not implemented')
    return true
  }

  startsWith(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('startsWith method not implemented')
    return true
  }

  contains(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('contains method not implemented')
    return true
  }

  notContains(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('notContains method not implemented')
    return true
  }

  equals(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('equals method not implemented')
    return true
  }

  notEquals(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('notEquals method not implemented')
    return true
  }

  lessThan(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('lessThan method not implemented')
    return true
  }

  greaterThan(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('greaterThan method not implemented')
    return true
  }

  lessThanOrEqual(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('lessThanOrEqual method not implemented')
    return true
  }

  greaterThanOrEqual(column: DataTableColumn, value: unknown, target: unknown): boolean {
    console.error('greaterThanOrEqual method not implemented')
    return true
  }

  isEmpty(column: DataTableColumn, value: unknown): boolean {
    console.error('isEmpty method not implemented')
    return true
  }

  isNotEmpty(column: DataTableColumn, value: unknown): boolean {
    console.error('isNotEmpty method not implemented')
    return true
  }

  compare(a: unknown, b: unknown, column: DataTableColumn): number {
    console.error('compare method not implemented')
    return 0
  }

  filterOptions(hayStack: unknown[], filterObject: FilterObject, columns: DataTableColumn[]): unknown[] {
    const hayStackOptions = hayStack.map((item) => this.mapHaystackItemToValue(item, filterObject))
    const column = columns.find((c) => c.id === filterObject.columnId)
    if (!column) {
      console.warn('Filter does not have a column id set. All items will be considered a valid option')
      return hayStackOptions
    }
    return hayStackOptions.filter(
      (item, index, self) => index === self.findIndex((t) => this.compare(t, item, column) === 0)
    )
  }

  filter(hayStack: unknown[], filter: Filter, columns: DataTableColumn[]): unknown[] {
    const { filterType, value } = filter
    if (!filterType) {
      console.warn('Filter does not have a type set. All items will resolve as true')
      return hayStack
    }
    const column = columns.find((c) => c.id === filter.columnId)
    if (!column) {
      console.warn('Filter does not have a column id set. All items will be considered a valid option')
      return hayStack
    }
    return hayStack.filter((item) => this[filterType](column, this.mapHaystackItemToValue(item, filter), value))
  }

  mapHaystackItemToValue(item: unknown, filter: Filter | FilterObject) {
    return ObjectUtils.resolveFieldData(item, filter.columnId)
  }
}

```


File : dateutils.ts
```ts
import { Injectable, LOCALE_ID, inject } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class DateUtils {
  protected locale = inject(LOCALE_ID)

  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }

  localizedDate(date: string | number | Date | undefined): string {
    return date
      ? new Intl.DateTimeFormat(this.locale, this.options).format(date instanceof Date ? date : new Date(date))
      : ''
  }
}

```


File : dynamic-locale-id.ts
```ts
import { UserService } from '@onecx/angular-integration-interface'

/**
 * @deprecated Use DynamicLocaleId from @onecx/angular-utils instead
 */
export class DynamicLocaleId {
  constructor(private userService: UserService) {
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


File : enum-to-dropdown-options.utils.ts
```ts
import { TranslateService } from '@ngx-translate/core'
import { Observable, map } from 'rxjs'

export function enumToDropdownOptions<T extends object>(
  translateService: TranslateService,
  enumType: T,
  translationKeyPrefix: string
): Observable<{ label: string; value: T }[]> {
  return translateService.get(Object.values(enumType).map((v) => translationKeyPrefix + v)).pipe(
    map((translations) =>
      Object.values(enumType).map((v) => ({
        label: translations[translationKeyPrefix + v],
        value: v,
      }))
    )
  )
}

```


File : filter.utils.ts
```ts
import { ColumnFilterDataSelectOptions, Filter } from '../model/filter.model'

export function limit(columnFilterData: Filter[], amount: number, options: ColumnFilterDataSelectOptions): Filter[] {
  return options.reverse
    ? columnFilterData.slice(-amount, columnFilterData.length).reverse()
    : columnFilterData.slice(0, amount)
}

```


File : image-logo-url.utils.ts
```ts
export class ImageLogoUrlUtils {
  public static createLogoUrl(apiPrefix: string, url?: string): string | undefined {
    //if the url is from the backend, then we insert the apiPrefix
    if ((url && !url.match(/^(http|https)/g)) ) {
      return apiPrefix + url
    } else {
      return url
    }
  }
}
```


File : objectutils.ts
```ts
export class ObjectUtils {
  public static resolveFieldData(data: any, field: any): any {
    if (data && field) {
      if (this.isFunction(field)) {
        return field(data)
      } else if (field.indexOf('.') == -1) {
        return data[field]
      } else {
        const fields: string[] = field.split('.')
        let value = data
        for (let i = 0, len = fields.length; i < len; ++i) {
          if (value == null) {
            return null
          }
          value = value[fields[i]]
        }
        return value
      }
    } else {
      return null
    }
  }

  public static isFunction(obj: any) {
    return !!(obj && obj.constructor && obj.call && obj.apply)
  }
}

```


File : primeicon.utils.ts
```ts
import { PrimeIcons } from 'primeng/api'
/**
 * @example let myIcon : PrimeIcon = PrimeIcons.myIcon
 */
export type PrimeIcon = (typeof PrimeIcons)[keyof Omit<typeof PrimeIcons, 'prototype'>]

```


File : rxjs-utils.ts
```ts
import { PrimeIcons } from 'primeng/api'
/**
 * @example let myIcon : PrimeIcon = PrimeIcons.myIcon
 */
export type PrimeIcon = (typeof PrimeIcons)[keyof Omit<typeof PrimeIcons, 'prototype'>]

import { Timestamp } from 'rxjs'

export function orderValuesByTimestamp(valuesWithTimestamp: Timestamp<any>[]) {
  return valuesWithTimestamp.sort((a, b) => b.timestamp - a.timestamp).map((obj) => obj.value)
}

function mergeValues(values: any[]) {
  return values.reduce((acc, curr) => {
    return { ...acc, ...curr }
  })
}

export function orderAndMergeValuesByTimestamp(valuesWithTimestamp: Timestamp<any>[]) {
  const sortedValues = valuesWithTimestamp.sort((a, b) => a.timestamp - b.timestamp).map((obj) => obj.value)
  return mergeValues(sortedValues)
}

```


File : string-and-array-helper-functions.utils.spec.ts
```ts
import {
  findEntryWithKeyword,
  removeKeyword,
  searchPrefixWithSpecialChars,
} from './string-and-array-helper-functions.utils'

describe('findEntryWithKeyword', () => {
  it('should find the entry containing the keyword', () => {
    expect(findEntryWithKeyword(['entry1', 'entry2', 'keywordEntry'], 'keyword')).toBe('keywordEntry')
    expect(findEntryWithKeyword(['entry1', 'entry2', 'entry3'], 'keyword')).toBe(null)
    expect(findEntryWithKeyword(undefined, 'keyword')).toBe(null)
  })
})

describe('removeKeyword', () => {
  it('should remove the keyword and trailing details from the input string', () => {
    expect(removeKeyword('/onecx-mgmt-page/keyword/123', 'keyword')).toBe('/onecx-mgmt-page')
    expect(removeKeyword('/onecx-mgmt-page/keyword/123/', 'keyword')).toBe('/onecx-mgmt-page')
    expect(removeKeyword('/onecx-mgmt-page/search/123', 'keyword')).toBe('/onecx-mgmt-page/search/123')
  })

  describe('searchPrefixWithSpecialChars', () => {
    it('should return the latest string starting with the prefix followed by ? or #', () => {
      const exampleUrls1 = ['onecx-mgmt-page?id', 'onecx-mgmt-page#id', 'ibt-order-mgmt-page#id']
      const exampleUrls2 = ['onecx-mgmt-page#id', 'onecx-mgmt-page#id', 'onecx-mgmt-page?id']
      const prefix = 'onecx-mgmt-page'
      const expected1 = 'onecx-mgmt-page#id'
      const expected2 = 'onecx-mgmt-page?id'
      expect(searchPrefixWithSpecialChars(exampleUrls1, prefix)).toEqual(expected1)
      expect(searchPrefixWithSpecialChars(exampleUrls2, prefix)).toEqual(expected2)
    })

    it('should return the latest string of an array starting with the prefix followed by ? or #', () => {
      const strings = ['test?case', 'test#case', 'test case', 'example?test', 'example#test']
      const prefix = 'test'
      const expected = 'test#case'
      expect(searchPrefixWithSpecialChars(strings, prefix)).toEqual(expected)
    })
  })
})

```


File : string-and-array-helper-functions.utils.ts
```ts
export function findEntryWithKeyword(
  array: string[] | undefined,
  keyword: string,
): string | null {
  const entry = array?.find((entry) => entry.includes(keyword));
  return entry || null;
}

export function removeKeyword(input: string, keyword: string): string {
  let result = input.replace(new RegExp(`/${keyword}.*`), '');
  if (result.endsWith('/')) {
    result = result.slice(0, -1);
  }
  return result;
}

export function searchPrefixWithSpecialChars(
  strings: string[],
  prefix: string,
): string | null {
  for (let i = strings.length - 1; i >= 0; i--) {
    const str = strings[i];
    if (
      str.startsWith(prefix) &&
      (str[prefix.length] === '?' || str[prefix.length] === '#')
    ) {
      return str;
    }
  }
  return null;
}

```


File : template.utils.ts
```ts
import { PrimeTemplate } from 'primeng/api'

export function findTemplate(templates: PrimeTemplate[], names: string[]): PrimeTemplate | undefined {
  for (let index = 0; index < names.length; index++) {
    const name = names[index]
    const template = templates.find((template) => template.name === name)
    if (template) {
      return template
    }
  }
  return undefined
}

```
























