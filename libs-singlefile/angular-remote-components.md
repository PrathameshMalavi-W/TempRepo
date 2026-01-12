#libs-Folder => angular-remote-components

********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-remote-components > src > index.ts


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

FIle => onecx-portal-ui-libs > libs > angular-remote-components > src > lib > services > permission.service.ts



```ts

import { Injectable, OnDestroy } from '@angular/core'
import { PermissionsRpcTopic } from '@onecx/integration-interface'
import { filter, firstValueFrom, map } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class PermissionService implements OnDestroy {
  _permissionsTopic$: PermissionsRpcTopic | undefined
  get permissionsTopic$() {
    this._permissionsTopic$ ??= new PermissionsRpcTopic()
    return this._permissionsTopic$
  }
  set permissionsTopic$(source: PermissionsRpcTopic) {
    this._permissionsTopic$ = source
  }
  private readonly permissionCache = new Map<string, Promise<string[]>>()

  ngOnDestroy(): void {
    this._permissionsTopic$?.destroy()
  }

  async getPermissions(appId: string, productName: string): Promise<string[]> {
    const cacheKey = `${appId}:${productName}`
    if (this.permissionCache.has(cacheKey)) {
      return this.permissionCache.get(cacheKey)!
    }

    const permissions = firstValueFrom(
      this.permissionsTopic$.pipe(
        filter(
          (message) =>
            message.appId === appId && message.productName === productName && Array.isArray(message.permissions)
        ),
        map((message) => message.permissions ?? [])
      )
    )
    this.permissionCache.set(cacheKey, permissions)
    this.permissionsTopic$.publish({ appId: appId, productName: productName })
    return permissions
  }
}


```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-remote-components > src > lib > services > slot.service.ts


```ts

import { loadRemoteModule } from '@angular-architects/module-federation'
import { Injectable, InjectionToken, OnDestroy, Type, inject } from '@angular/core'
import { RemoteComponent, RemoteComponentsTopic, Technologies } from '@onecx/integration-interface'
import { Observable, map, shareReplay } from 'rxjs'
import { PermissionService } from './permission.service'

export const SLOT_SERVICE: InjectionToken<SlotService> = new InjectionToken('SLOT_SERVICE')

export type RemoteComponentInfo = {
  appId: string
  productName: string
  baseUrl: string
  technology: Technologies
  elementName?: string
}

export type SlotComponentConfiguration = {
  componentType: Promise<Type<unknown> | undefined> | Type<unknown> | undefined
  remoteComponent: RemoteComponentInfo
  permissions: Promise<string[]> | string[]
}

export interface SlotServiceInterface {
  init(): Promise<void>
  getComponentsForSlot(slotName: string): Observable<SlotComponentConfiguration[]>
  isSomeComponentDefinedForSlot(slotName: string): Observable<boolean>
}

@Injectable({ providedIn: 'root' })
export class SlotService implements SlotServiceInterface, OnDestroy {
  private permissionsService = inject(PermissionService)

  private _remoteComponents$: RemoteComponentsTopic | undefined
  get remoteComponents$() {
    this._remoteComponents$ ??= new RemoteComponentsTopic()
    return this._remoteComponents$
  }
  set remoteComponents$(source: RemoteComponentsTopic) {
    this._remoteComponents$ = source
  }

  async init(): Promise<void> {
    return Promise.resolve()
  }

  ngOnDestroy(): void {
    this._remoteComponents$?.destroy()
  }

  getComponentsForSlot(slotName: string): Observable<SlotComponentConfiguration[]> {
    return this.remoteComponents$.pipe(
      map((remoteComponentsInfo) =>
        (remoteComponentsInfo.slots?.find((slotMapping) => slotMapping.name === slotName)?.components ?? [])
          .map((remoteComponentName) => remoteComponentsInfo.components.find((rc) => rc.name === remoteComponentName))
          .filter((remoteComponent): remoteComponent is RemoteComponent => !!remoteComponent)
          .map((remoteComponent) => remoteComponent)
      ),
      map((infos) =>
        infos.map((remoteComponent) => {
          return {
            componentType: this.loadComponent(remoteComponent),
            remoteComponent,
            permissions: this.permissionsService.getPermissions(remoteComponent.appId, remoteComponent.productName),
          }
        })
      ),
      shareReplay()
    )
  }

  isSomeComponentDefinedForSlot(slotName: string): Observable<boolean> {
    return this.remoteComponents$.pipe(
      map((remoteComponentsInfo) =>
        remoteComponentsInfo.slots.some(
          (slotMapping) => slotMapping.name === slotName && slotMapping.components.length > 0
        )
      )
    )
  }

  private async loadComponent(component: {
    remoteEntryUrl: string
    exposedModule: string
    productName: string
    remoteName: string
    technology: string
  }): Promise<Type<unknown> | undefined> {
    try {
      const exposedModule = component.exposedModule.startsWith('./')
        ? component.exposedModule.slice(2)
        : component.exposedModule
      if (component.technology === Technologies.Angular || component.technology === Technologies.WebComponentModule) {
        const m = await loadRemoteModule({
          type: 'module',
          remoteEntry: component.remoteEntryUrl,
          exposedModule: './' + exposedModule,
        })
        if (component.technology === Technologies.Angular) {
          return m[exposedModule]
        }
        return undefined
      }
      await loadRemoteModule({
        type: 'script',
        remoteName: component.remoteName,
        remoteEntry: component.remoteEntryUrl,
        exposedModule: './' + exposedModule,
      })
      return undefined
    } catch (e) {
      console.log('Failed to load remote module ', component.exposedModule, component.remoteEntryUrl, e)
      return undefined
    }
  }
}


```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-remote-components > src > lib > componenets > slot.component.ts 


```ts

import {
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Type,
  ViewContainerRef,
  inject,
} from '@angular/core'

import {
  ResizedEventsPublisher,
  ResizedEventsTopic,
  Technologies,
  SlotResizedEvent,
  ResizedEventType,
  RequestedEventsChangedEvent,
} from '@onecx/integration-interface'
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs'
import { ocxRemoteComponent } from '../../model/remote-component'
import { RemoteComponentInfo, SLOT_SERVICE, SlotComponentConfiguration, SlotService } from '../../services/slot.service'
import { RemoteComponentConfig, scopeIdFromProductNameAndAppId } from '@onecx/angular-utils'
import { HttpClient } from '@angular/common/http'
import { debounceTime, filter } from 'rxjs/operators'
import { updateStylesForRcCreation, removeAllRcUsagesFromStyles } from '@onecx/angular-utils/style'

interface AssignedComponent {
  refOrElement: ComponentRef<any> | HTMLElement
  remoteInfo: RemoteComponentInfo
}

@Component({
  standalone: false,
  selector: 'ocx-slot[name]',
  template: ``,
})
export class SlotComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient)
  private elementRef = inject(ElementRef)
  private readonly viewContainerRef = inject(ViewContainerRef)

  @Input()
  name!: string

  private slotService = inject<SlotService>(SLOT_SERVICE, { optional: true })
  private _assignedComponents$ = new BehaviorSubject<AssignedComponent[]>([])

  /**
   * Inputs to be passed to components inside a slot.
   *
   * @example
   *
   * ## Slot usage
   * ```
   * <ocx-slot name="my-slot-name" [inputs]="{ header: myHeaderValue }">
   * </ocx-slot>
   * ```
   *
   * ## Remote component definition
   * ```
   * export class MyRemoteComponent: {
   * ⁣@Input() header: string = ''
   * }
   * ```
   *
   * ## Remote component template
   * ```
   * <p>myInput = {{header}}</p>
   * ```
   */
  private _inputs$ = new BehaviorSubject<Record<string, unknown>>({})
  @Input()
  get inputs(): Record<string, unknown> {
    return this._inputs$.getValue()
  }
  set inputs(value: Record<string, unknown>) {
    this._inputs$.next({
      ...this._inputs$.getValue(),
      ...value,
    })
  }

  /**
   * Outputs to be passed to components inside a slot as EventEmitters. It is important that the output property is annotated with ⁣@Input().
   *
   * @example
   *
   * ## Component with slot in a template
   * ```
   * ⁣@Component({
   *  standalone: false, * selector: 'my-component',
   *  templateUrl: './my-component.component.html',
   * })
   * export class MyComponent {
   *  buttonClickedEmitter = new EventEmitter<string>()
   *  constructor() {
   *    this.buttonClickedEmitter.subscribe((msg) => {
   *      console.log(msg)
   *    })
   *  }
   * }
   * ```
   *
   * ## Slot usage in my-component.component.html
   * ```
   * <ocx-slot name="my-slot-name" [outputs]="{ buttonClicked: buttonClickedEmitter }">
   * </ocx-slot>
   * ```
   *
   * ## Remote component definition
   * ```
   * export class MyRemoteComponent: {
   *  ⁣@Input() buttonClicked = EventEmitter<string>()
   *  onButtonClick() {
   *    buttonClicked.emit('payload')
   *  }
   * }
   * ```
   *
   * ## Remote component template
   * ```
   * <button (click)="onButtonClick()">Emit message</button>
   * ```
   */
  private _outputs$ = new BehaviorSubject<Record<string, EventEmitter<any>>>({})
  @Input()
  get outputs(): Record<string, EventEmitter<any>> {
    return this._outputs$.getValue()
  }
  set outputs(value: Record<string, EventEmitter<any>>) {
    this._outputs$.next({
      ...this._outputs$.getValue(),
      ...value,
    })
  }

  subscriptions: Subscription[] = []
  components$: Observable<SlotComponentConfiguration[]> | undefined

  private resizeObserver: ResizeObserver | undefined
  private readonly componentSize$ = new BehaviorSubject<{ width: number; height: number }>({ width: -1, height: -1 })
  private resizeDebounceTimeMs = 100

  private readonly resizedEventsPublisher = new ResizedEventsPublisher()
  private _resizedEventsTopic: ResizedEventsTopic | undefined
  get resizedEventsTopic() {
    this._resizedEventsTopic ??= new ResizedEventsTopic()
    return this._resizedEventsTopic
  }
  set resizedEventsTopic(source: ResizedEventsTopic) {
    this._resizedEventsTopic = source
  }
  private readonly requestedEventsChanged$ = this.resizedEventsTopic.pipe(
    filter((event): event is RequestedEventsChangedEvent => event.type === ResizedEventType.REQUESTED_EVENTS_CHANGED)
  )

  ngOnDestroy(): void {
    this._resizedEventsTopic?.destroy()
    this.subscriptions.forEach((sub) => sub.unsubscribe())
    this.resizeObserver?.disconnect()
    this.componentSize$.complete() // Complete the subject to avoid memory leaks
    // Removes RC styles on unmount to avoid ghost styles
    this._assignedComponents$.getValue().forEach((component) => {
      const scopeId = scopeIdFromProductNameAndAppId(component.remoteInfo.productName, component.remoteInfo.appId)
      removeAllRcUsagesFromStyles(scopeId, this.name)
    })
    this.viewContainerRef.clear()
  }

  ngOnInit(): void {
    if (!this.slotService) {
      console.error(`SLOT_SERVICE token was not provided. ${this.name} slot will not be filled with data.`)
      return
    }
    this.components$ = this.slotService.getComponentsForSlot(this.name)
    const updateSub = combineLatest([this._assignedComponents$, this._inputs$, this._outputs$]).subscribe(
      ([components, inputs, outputs]) => {
        components.forEach((component) => {
          this.updateComponentData(component.refOrElement, inputs, outputs)
        })
      }
    )
    this.subscriptions.push(updateSub)

    // Components can be created only when component information is available and view containers are created for all remote components
    const createSub = this.components$.subscribe((components) => {
      this.createSpansForComponents(components)
      this.createComponents(components)
    })
    this.subscriptions.push(createSub)

    this.observeSlotSizeChanges()
  }

  private createSpansForComponents(components: SlotComponentConfiguration[]) {
    for (let i = 0; i < components.length; i++) {
      const span = document.createElement('span')
      span.dataset['index'] = i.toString()
      this.viewContainerRef.element.nativeElement.appendChild(span)
    }
  }

  private createComponents(components: SlotComponentConfiguration[]) {
    components.forEach((componentInfo, index) => {
      if (componentInfo.componentType) {
        Promise.all([Promise.resolve(componentInfo.componentType), Promise.resolve(componentInfo.permissions)]).then(
          ([componentType, permissions]) => {
            const component = this.createComponent(componentType, componentInfo, permissions, index)
            if (component) {
              this._assignedComponents$.next([
                ...this._assignedComponents$.getValue(),
                { refOrElement: component, remoteInfo: componentInfo.remoteComponent },
              ])
            }
          }
        )
      }
    })
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
      const slotResizedEvent: SlotResizedEvent = {
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: this.name,
          slotDetails: { width, height },
        },
      }
      this.resizedEventsPublisher.publish(slotResizedEvent)
    })

    this.resizeObserver.observe(this.elementRef.nativeElement)

    const requestedEventsChangedSub = this.requestedEventsChanged$.subscribe((event) => {
      if (event.payload.type === ResizedEventType.SLOT_RESIZED && event.payload.name === this.name) {
        const { width, height } = this.componentSize$.getValue()
        const slotResizedEvent: SlotResizedEvent = {
          type: ResizedEventType.SLOT_RESIZED,
          payload: {
            slotName: this.name,
            slotDetails: { width, height },
          },
        }
        this.resizedEventsPublisher.publish(slotResizedEvent)
      }
    })
    this.subscriptions.push(requestedEventsChangedSub)
  }

  private createComponent(
    componentType: Type<unknown> | undefined,
    componentInfo: { remoteComponent: RemoteComponentInfo },
    permissions: string[],
    index: number
  ): ComponentRef<any> | HTMLElement | undefined {
    if (componentType) {
      return this.createAngularComponent(componentType, componentInfo, permissions, index)
    }

    if (
      (componentInfo.remoteComponent.technology === Technologies.WebComponentModule ||
        componentInfo.remoteComponent.technology === Technologies.WebComponentScript) &&
      componentInfo.remoteComponent.elementName !== undefined
    ) {
      return this.createWebComponent(
        componentInfo as { remoteComponent: RemoteComponentInfo & { elementName: string } },
        permissions,
        index
      )
    }

    return
  }

  private createAngularComponent(
    componentType: Type<unknown>,
    componentInfo: { remoteComponent: RemoteComponentInfo },
    permissions: string[],
    index: number
  ): ComponentRef<any> {
    const componentRef = this.viewContainerRef.createComponent<any>(componentType, { index: index })
    const componentHTML = componentRef.location.nativeElement as HTMLElement
    this.updateComponentStyles(componentInfo)
    this.addDataStyleId(componentHTML, componentInfo.remoteComponent)
    this.addDataStyleIsolation(componentHTML)
    if (componentRef && 'ocxInitRemoteComponent' in componentRef.instance) {
      ;(componentRef.instance as ocxRemoteComponent).ocxInitRemoteComponent({
        appId: componentInfo.remoteComponent.appId,
        productName: componentInfo.remoteComponent.productName,
        baseUrl: componentInfo.remoteComponent.baseUrl,
        permissions: permissions,
      })
    }

    const span: HTMLSpanElement | undefined = this.viewContainerRef.element.nativeElement.querySelector(
      `span[data-index="${index}"]`
    ) as HTMLSpanElement
    if (span) {
      span.remove()
    } else {
      console.error(
        'Component span was not found for slot component creation. The order of the components may be incorrect.'
      )
    }

    componentRef.changeDetectorRef.detectChanges()
    return componentRef
  }

  private createWebComponent(
    componentInfo: { remoteComponent: RemoteComponentInfo & { elementName: string } },
    permissions: string[],
    index: number
  ): HTMLElement {
    const element = document.createElement(componentInfo.remoteComponent.elementName)
    this.updateComponentStyles(componentInfo)
    this.addDataStyleId(element, componentInfo.remoteComponent)
    this.addDataStyleIsolation(element)
    ;(element as any)['ocxRemoteComponentConfig'] = {
      appId: componentInfo.remoteComponent.appId,
      productName: componentInfo.remoteComponent.productName,
      baseUrl: componentInfo.remoteComponent.baseUrl,
      permissions: permissions,
    } satisfies RemoteComponentConfig

    const span: HTMLSpanElement | undefined = this.viewContainerRef.element.nativeElement.querySelector(
      `span[data-index="${index}"]`
    ) as HTMLSpanElement
    if (span) {
      this.viewContainerRef.element.nativeElement.insertBefore(element, span)
      span.remove()
    } else {
      console.error(
        'Component span was not found for slot component creation. The order of the components may be incorrect.'
      )
      this.viewContainerRef.element.nativeElement.appendChild(element)
    }
    return element
  }

  private addDataStyleId(element: HTMLElement, rcInfo: RemoteComponentInfo) {
    element.dataset['styleId'] = `${rcInfo.productName}|${rcInfo.appId}`
  }

  private addDataStyleIsolation(element: HTMLElement) {
    element.dataset['styleIsolation'] = ''
  }

  // Load styles exposed by the application the remote component belongs to if its not done already
  private updateComponentStyles(componentInfo: { remoteComponent: RemoteComponentInfo }) {
    updateStylesForRcCreation(
      componentInfo.remoteComponent.productName,
      componentInfo.remoteComponent.appId,
      this.http,
      componentInfo.remoteComponent.baseUrl,
      this.name
    )
  }

  private updateComponentData(
    component: ComponentRef<any> | HTMLElement,
    inputs: Record<string, unknown>,
    outputs: Record<string, EventEmitter<unknown>>
  ) {
    this.setProps(component, inputs)
    this.setProps(component, outputs)
  }

  // split props setting for HTMLElement and ComponentRef
  private setProps(component: ComponentRef<any> | HTMLElement, props: Record<string, unknown>) {
    Object.entries(props).map(([name, value]) => {
      if (component instanceof HTMLElement) {
        ;(component as any)[name] = value
      } else {
        component.setInput(name, value)
      }
    })
  }
}


```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-remote-components > src > 
lib > componenets > slot.component.spec.ts


```ts

/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideHttpClient } from '@angular/common/http'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { Component, EventEmitter, Input } from '@angular/core'
import { SlotServiceMock } from '@onecx/angular-remote-components/mocks'
import { SlotHarness } from '@onecx/angular-remote-components/testing'
import { SlotComponent } from './slot.component'
import { SLOT_SERVICE } from '../../services/slot.service'
import { ocxRemoteComponent } from '../../model/remote-component'

// Rxjs operators mock
import * as rxjsOperators from 'rxjs/operators'
import { interval } from 'rxjs'

import {
  dataStyleIdAttribute,
  RemoteComponentConfig,
  dataStyleIsolationAttribute,
} from '@onecx/angular-utils'

jest.mock('@onecx/integration-interface', () => {
  const actual = jest.requireActual('@onecx/integration-interface')
  const fakeTopic = jest.requireActual('@onecx/accelerator').FakeTopic
  return {
    ...actual,
    ResizedEventsTopic: fakeTopic,
  }
})

import { ResizedEventType, Technologies, TopicResizedEventType } from '@onecx/integration-interface'
import { FakeTopic } from '@onecx/accelerator'
import { removeAllRcUsagesFromStyles, updateStylesForRcCreation } from '@onecx/angular-utils/style'

jest.mock('@onecx/angular-utils/style', () => {
  const actual = jest.requireActual('@onecx/angular-utils/style')
  return {
    ...actual,
    removeAllRcUsagesFromStyles: jest.fn(),
    updateStylesForRcCreation: jest.fn(),
  }
})

// Mock ResizeObserver
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
      devicePixelContentBoxSize: [] as any,
    } as ResizeObserverEntry
    this.callback([entry], this as unknown as ResizeObserver)
  }
}

;(global as any).ResizeObserver = ResizeObserverMock

// Mock ResizeEventsPublisher
class ResizeEventsPublisherMock {
  publish = jest.fn()
}

// Test component
@Component({
  selector: 'ocx-mock-angular-component',
  template: `<div>Mock Angular Component</div>`,
  standalone: false,
})
class MockAngularComponent implements ocxRemoteComponent {
  ocxInitRemoteComponent(_config: RemoteComponentConfig): void {
    console.log('MockAngularComponent initialized')
  }

  @Input() set initialInput(value: string) {
    console.log('MockAngularComponent initialInput', value)
    this._initialInput = value
  }
  private _initialInput = ''
  @Input() set initialOutput(value: EventEmitter<any>) {
    console.log('MockAngularComponent initialOutput', value)
    this._initialOutput = value
  }
  private _initialOutput: EventEmitter<any> = new EventEmitter()
}

describe('SlotComponent', () => {
  let component: SlotComponent
  let fixture: ComponentFixture<SlotComponent>
  let slotServiceMock: SlotServiceMock

  let resizeObserverMock: ResizeObserverMock
  let resizedEventsPublisherMock: ResizeEventsPublisherMock
  let resizedEventsTopic: FakeTopic<TopicResizedEventType>

  beforeEach(async () => {
    // Without this debounceTime is not working in tests with fakeAsync/tick
    jest
      .spyOn(rxjsOperators, 'debounceTime')
      .mockImplementation((timeout) => rxjsOperators.debounce(() => interval(timeout)))
    await TestBed.configureTestingModule({
      declarations: [SlotComponent, MockAngularComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: SLOT_SERVICE,
          useClass: SlotServiceMock,
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SlotComponent)
    component = fixture.componentInstance
    // These must be set before detectChanges which triggers ngOnInit
    component.name = 'test-slot'
    resizedEventsPublisherMock = new ResizeEventsPublisherMock()
    ;(component as any)['resizedEventsPublisher'] = resizedEventsPublisherMock
    fixture.detectChanges()

    slotServiceMock = TestBed.inject(SLOT_SERVICE) as unknown as SlotServiceMock
    resizeObserverMock = (component as any).resizeObserver as ResizeObserverMock
    resizedEventsTopic = component['resizedEventsTopic'] as any as FakeTopic<TopicResizedEventType>
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should log error if slot service is not defined', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    component['slotService'] = undefined as any
    component.ngOnInit()
    expect(consoleSpy).toHaveBeenCalledWith(
      'SLOT_SERVICE token was not provided. test-slot slot will not be filled with data.'
    )
    consoleSpy.mockRestore()
  })

  describe('on destroy', () => {
    it('should destroy resizedEventsTopic', () => {
      const spy = jest.spyOn(component['resizedEventsTopic'], 'destroy')
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalled()
    })

    it('should clear all subscriptions', () => {
      component['subscriptions'].push({ unsubscribe: jest.fn() } as any)
      const spy = jest.spyOn(component['subscriptions'][0], 'unsubscribe')
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalled()
    })

    it('should disconnect resizeObserver', () => {
      const spy = jest.spyOn(component['resizeObserver']!, 'disconnect')
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalled()
    })

    it('should not disconnect resizeObserver if not defined', () => {
      component['resizeObserver'] = undefined
      component.ngOnDestroy()
      expect(resizeObserverMock.disconnect).not.toHaveBeenCalled()
    })

    it('should complete componentSize$', () => {
      const spy = jest.spyOn(component['componentSize$'], 'complete')
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalled()
    })

    it('should cleanup all components', fakeAsync(() => {
      const spy = removeAllRcUsagesFromStyles as jest.Mock
      slotServiceMock.assignComponentToSlot(
        {
          componentType: Promise.resolve(MockAngularComponent),
          permissions: [],
          remoteComponent: {
            appId: 'app-id',
            productName: 'product-name',
            baseUrl: 'https://base.url',
            technology: Technologies.Angular,
          },
        },
        'test-slot'
      )
      tick(100)
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalledTimes(1)
    }))

    it('should clear view container', () => {
      const spy = jest.spyOn(component['viewContainerRef'], 'clear')
      component.ngOnDestroy()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('component creation', () => {
    describe('angular component', () => {
      it('should create', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
        slotServiceMock.assignComponentToSlot(
          {
            componentType: MockAngularComponent,
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-angular',
              productName: 'angular-product',
              baseUrl: 'https://base.url',
              technology: Technologies.Angular,
            },
          },
          'test-slot'
        )
        fixture.detectChanges()

        const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

        const element = await slotHarness.getElement('ocx-mock-angular-component')
        expect(element).not.toBeNull()

        expect(updateStylesForRcCreation).toHaveBeenCalled()
        expect(await element?.getAttribute(dataStyleIdAttribute)).toEqual('angular-product|app-angular')
        expect(await element?.getAttribute(dataStyleIsolationAttribute)).toEqual('')

        expect(consoleSpy).toHaveBeenCalledWith('MockAngularComponent initialized')

        consoleSpy.mockRestore()
      })

      it('should create if span was not found', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
        jest.spyOn(component['viewContainerRef'].element.nativeElement, 'querySelector').mockReturnValue(null)
        slotServiceMock.assignComponentToSlot(
          {
            componentType: MockAngularComponent,
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-angular-no-span',
              productName: 'angular-product-no-span',
              baseUrl: 'https://base.url',
              technology: Technologies.Angular,
            },
          },
          'test-slot'
        )
        fixture.detectChanges()

        const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

        const element = await slotHarness.getElement('ocx-mock-angular-component')
        expect(element).not.toBeNull()
        expect(consoleSpy).toHaveBeenCalledWith(
          'Component span was not found for slot component creation. The order of the components may be incorrect.'
        )
      })
    })

    describe('webcomponent', () => {
      it('should create webcomponent module component', async () => {
        slotServiceMock.assignComponentToSlot(
          {
            componentType: Promise.resolve(undefined),
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-webcomponent-module',
              productName: 'webcomponent-module-product',
              baseUrl: 'https://base.url',
              technology: Technologies.WebComponentModule,
              elementName: 'mock-webcomponent-module',
            },
          },
          'test-slot'
        )
        fixture.detectChanges()

        const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

        const element = await slotHarness.getElement('mock-webcomponent-module')
        expect(element).not.toBeNull()

        expect(updateStylesForRcCreation).toHaveBeenCalled()
        expect(await element?.getAttribute(dataStyleIdAttribute)).toEqual(
          'webcomponent-module-product|app-webcomponent-module'
        )
        expect(await element?.getAttribute(dataStyleIsolationAttribute)).toEqual('')
        expect(await element?.getProperty('ocxRemoteComponentConfig')).toEqual({
          appId: 'app-webcomponent-module',
          productName: 'webcomponent-module-product',
          baseUrl: 'https://base.url',
          permissions: ['mock-permission'],
        })
      })

      it('should create webcomponent script component', async () => {
        slotServiceMock.assignComponentToSlot(
          {
            componentType: Promise.resolve(undefined),
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-webcomponent-script',
              productName: 'webcomponent-script-product',
              baseUrl: 'https://base.url',
              technology: Technologies.WebComponentScript,
              elementName: 'mock-webcomponent-script',
            },
          },
          'test-slot'
        )
        fixture.detectChanges()

        const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

        const element = await slotHarness.getElement('mock-webcomponent-script')
        expect(element).not.toBeNull()

        expect(updateStylesForRcCreation).toHaveBeenCalled()
        expect(await element?.getAttribute(dataStyleIdAttribute)).toEqual(
          'webcomponent-script-product|app-webcomponent-script'
        )
        expect(await element?.getAttribute(dataStyleIsolationAttribute)).toEqual('')
        expect(await element?.getProperty('ocxRemoteComponentConfig')).toEqual({
          appId: 'app-webcomponent-script',
          productName: 'webcomponent-script-product',
          baseUrl: 'https://base.url',
          permissions: ['mock-permission'],
        })
      })

      it('should create webcomponent if span was not found', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
        jest.spyOn(component['viewContainerRef'].element.nativeElement, 'querySelector').mockReturnValue(null)
        slotServiceMock.assignComponentToSlot(
          {
            componentType: Promise.resolve(undefined),
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-webcomponent-no-span',
              productName: 'webcomponent-no-span-product',
              baseUrl: 'https://base.url',
              technology: Technologies.WebComponentModule,
              elementName: 'mock-webcomponent-no-span',
            },
          },
          'test-slot'
        )
        fixture.detectChanges()

        const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

        const element = await slotHarness.getElement('mock-webcomponent-no-span')
        expect(element).not.toBeNull()
        expect(consoleSpy).toHaveBeenCalledWith(
          'Component span was not found for slot component creation. The order of the components may be incorrect.'
        )
      })
    })

    it('should create multiple components', async () => {
      slotServiceMock.assignComponentsToSlot(
        [
          {
            componentType: MockAngularComponent,
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-multiple-1',
              productName: 'multiple-product',
              baseUrl: 'https://base.url',
              technology: Technologies.Angular,
            },
          },
          {
            componentType: Promise.resolve(undefined),
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-multiple-2',
              productName: 'multiple-product',
              baseUrl: 'https://base.url',
              technology: Technologies.WebComponentModule,
              elementName: 'mock-webcomponent-multiple',
            },
          },
        ],
        'test-slot'
      )
      fixture.detectChanges()

      const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

      const angularElement = await slotHarness.getElement('ocx-mock-angular-component')
      expect(angularElement).not.toBeNull()

      const webcomponentElement = await slotHarness.getElement('mock-webcomponent-multiple')
      expect(webcomponentElement).not.toBeNull()
    })

    it('should not create components if none assigned', async () => {
      const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

      const element = await slotHarness.getElement('non-existent-element')
      expect(element).toBeNull()
    })

    it('should not create component if type is undefined', async () => {
      const spy = jest.spyOn(component['viewContainerRef'], 'createComponent')
      slotServiceMock.assignComponentToSlot(
        {
          componentType: Promise.resolve(undefined),
          permissions: ['mock-permission'],
          remoteComponent: {
            appId: 'app-undefined',
            productName: 'undefined-product',
            baseUrl: 'https://base.url',
            technology: Technologies.Angular,
          },
        },
        'test-slot'
      )
      fixture.detectChanges()

      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('component update', () => {
    it('should update components after creation', async () => {
      const spy = jest.spyOn(console, 'log').mockImplementation()
      component.inputs = { initialInput: 'initialValue' }
      const eventEmitter = new EventEmitter()
      component.outputs = {
        initialOutput: eventEmitter,
      }
      slotServiceMock.assignComponentsToSlot(
        [
          {
            componentType: MockAngularComponent,
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-update',
              productName: 'update-product',
              baseUrl: 'https://base.url',
              technology: Technologies.Angular,
            },
          },
          {
            componentType: Promise.resolve(undefined),
            permissions: ['mock-permission'],
            remoteComponent: {
              appId: 'app-update-webcomponent',
              productName: 'update-product',
              baseUrl: 'https://base.url',
              technology: Technologies.WebComponentModule,
              elementName: 'mock-webcomponent-update',
            },
          },
        ],
        'test-slot'
      )
      fixture.detectChanges()

      const slotHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SlotHarness)

      expect(component.inputs).toEqual({ initialInput: 'initialValue' })
      expect(component.outputs).toEqual({ initialOutput: eventEmitter })
      const angularElement = await slotHarness.getElement('ocx-mock-angular-component')
      expect(angularElement).not.toBeNull()
      expect(spy).toHaveBeenCalledWith('MockAngularComponent initialInput', 'initialValue')
      expect(spy).toHaveBeenCalledWith('MockAngularComponent initialOutput', eventEmitter)

      const webcomponentElement = await slotHarness.getElement('mock-webcomponent-update')
      expect(webcomponentElement).not.toBeNull()
      expect(await webcomponentElement?.getProperty('initialInput')).toEqual('initialValue')
      expect(await webcomponentElement?.getProperty('initialOutput')).toBe(eventEmitter)
    })
  })

  describe('size changes', () => {
    it('should publish initial size', fakeAsync(() => {
      resizedEventsPublisherMock.publish.mockClear()
      resizeObserverMock.trigger(200, 100)

      tick(200) // debounceTime

      expect(resizedEventsPublisherMock.publish).toHaveBeenCalledWith({
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'test-slot',
          slotDetails: { width: 200, height: 100 },
        },
      })
    }))
    it('should debounce size changes', fakeAsync(() => {
      resizedEventsPublisherMock.publish.mockClear()
      resizeObserverMock.trigger(200, 100)
      resizeObserverMock.trigger(300, 400)

      tick(120)

      resizeObserverMock.trigger(400, 700)

      expect(resizedEventsPublisherMock.publish).toHaveBeenCalledWith({
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'test-slot',
          slotDetails: { width: 300, height: 400 },
        },
      })

      tick(100)

      expect(resizedEventsPublisherMock.publish).toHaveBeenCalledWith({
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'test-slot',
          slotDetails: { width: 400, height: 700 },
        },
      })
    }))

    it('should publish when requestedEventsChanged emits for this slot', fakeAsync(() => {
      resizeObserverMock.trigger(200, 100)

      tick(200) // debounceTime

      resizedEventsPublisherMock.publish.mockClear()

      resizedEventsTopic.publish({
        type: ResizedEventType.REQUESTED_EVENTS_CHANGED,
        payload: {
          type: ResizedEventType.SLOT_RESIZED,
          name: 'test-slot',
        },
      })

      expect(resizedEventsPublisherMock.publish).toHaveBeenCalledWith({
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'test-slot',
          slotDetails: { width: 200, height: 100 },
        },
      })
    }))
  })
})


```



********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-remote-components > src > lib > model > remote-component.ts

```ts

import { RemoteComponentConfig } from '@onecx/angular-utils'

export interface ocxRemoteComponent {
  ocxInitRemoteComponent(config: RemoteComponentConfig): void
}


```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-remote-components > src > lib > model > remote-webcomponent.ts

```ts

import { RemoteComponentConfig } from '@onecx/angular-utils'

export interface ocxRemoteWebcomponent {
  ocxRemoteComponentConfig: RemoteComponentConfig
}


```


********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-remote-components > src > lib > utils > provide-translate-service-for-root.util.ts

```ts

import {
  DEFAULT_LANGUAGE,
  FakeMissingTranslationHandler,
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateDefaultParser,
  TranslateFakeCompiler,
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModuleConfig,
  TranslateParser,
  TranslateService,
  TranslateStore,
  USE_DEFAULT_LANG,
  USE_EXTEND,
  ISOLATE_TRANSLATE_SERVICE,
} from '@ngx-translate/core'

export function provideTranslateServiceForRoot(config: TranslateModuleConfig = {}) {
  return [
    config.loader || { provide: TranslateLoader, useClass: TranslateFakeLoader },
    config.compiler || { provide: TranslateCompiler, useClass: TranslateFakeCompiler },
    config.parser || { provide: TranslateParser, useClass: TranslateDefaultParser },
    config.missingTranslationHandler || { provide: MissingTranslationHandler, useClass: FakeMissingTranslationHandler },
    TranslateStore,
    { provide: ISOLATE_TRANSLATE_SERVICE, useValue: config.isolate },
    { provide: USE_DEFAULT_LANG, useValue: config.useDefaultLang },
    { provide: USE_EXTEND, useValue: config.extend },
    { provide: DEFAULT_LANGUAGE, useValue: config.defaultLanguage },
    TranslateService,
  ]
}


```

