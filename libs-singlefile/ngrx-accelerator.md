#libs-Folder => ngrx-accelerator

********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > ngrx-accelerator > src > index.ts


```ts
// Effects
export * from './lib/utils/effects/create-query-params-effect'
export * from './lib/utils/effects/filter-for-navigated-to'
export * from './lib/utils/effects/filter-for-only-query-params-changed'
export * from './lib/utils/effects/filter-for-query-params-changed'

// Selectors
export * from './lib/utils/selectors/create-child-selectors'

// Local Storage
export * from './lib/utils/local-storage/lazy-loading-merge-reducer'
export * from './lib/utils/local-storage/create-nested-key-configuration'

// Store Connector
export * from './lib/store-connector/navigated-event-store-connector-service'
export * from './lib/store-connector/permissions-store-connector-service'
export * from './lib/store-connector/onecx-actions'
export * from './lib/store-connector/onecx-reducer'
export * from './lib/store-connector/onecx-selectors'
export * from './lib/store-connector/onecx-state'

```


********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > ngrx-accelerator > src > lib > store-connector > 

File : navigated-event-store-connector-service.ts
```ts
import { ENVIRONMENT_INITIALIZER, Injectable, OnDestroy, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { EventsTopic, EventType } from '@onecx/integration-interface'
import { filter } from 'rxjs'
import { CurrentLocationTopicPayload, TopicEventType } from '@onecx/integration-interface'
import { Capability, ShellCapabilityService } from '@onecx/angular-integration-interface'
import { Observable } from 'rxjs'
import { OneCxActions } from './onecx-actions'
import { AppStateService } from '@onecx/angular-integration-interface'

/**
 * @deprecated Please import from `@onecx/ngrx-integration-interface` instead.
 */
export function provideNavigatedEventStoreConnector() {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory() {
        return () => inject(NavigatedEventStoreConnectorService)
      },
    },
    NavigatedEventStoreConnectorService,
  ]
}

@Injectable()
export class NavigatedEventStoreConnectorService implements OnDestroy {
  private _eventsTopic$: EventsTopic | undefined
  get eventsTopic$() {
    this._eventsTopic$ ??= new EventsTopic()
    return this._eventsTopic$
  }
  set eventsTopic$(source: EventsTopic) {
    this._eventsTopic$ = source
  }

  constructor() {
    const store = inject(Store)
    const appStateService = inject(AppStateService)
    const capabilityService = inject(ShellCapabilityService)

    let observable: Observable<TopicEventType | CurrentLocationTopicPayload> =
      appStateService.currentLocation$.asObservable()
    if (!capabilityService.hasCapability(Capability.CURRENT_LOCATION_TOPIC)) {
      observable = this.eventsTopic$.pipe(filter((e) => e.type === EventType.NAVIGATED))
    }
    observable.subscribe((navigatedEvent) => {
      let event: unknown = navigatedEvent as CurrentLocationTopicPayload
      if (!capabilityService.hasCapability(Capability.CURRENT_LOCATION_TOPIC)) {
        event = (navigatedEvent as TopicEventType).payload
      }
      store.dispatch(OneCxActions.navigated({ event }))
    })
  }
  ngOnDestroy(): void {
    this._eventsTopic$?.destroy()
  }
}


```

File : onecx-actions.ts
```ts
import { createActionGroup, props } from '@ngrx/store'

export const OneCxActions = createActionGroup({
  source: 'OneCX',
  events: {
    navigated: props<{
      event: undefined | unknown
    }>(),
    permissionsChanged: props<{
      permissions: string[]
    }>(),
  },
})


```

File : onecx-reducer.ts
```ts
import { createReducer, on } from '@ngrx/store'
import { OneCxActions } from './onecx-actions'
import { OneCxState } from './onecx-state'
import { NavigatedEventPayload } from '@onecx/integration-interface'

export const oneCxReducer = createReducer<OneCxState>(
  {},
  on(
    OneCxActions.navigated,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      location: action.event as NavigatedEventPayload,
    })
  ),
  on(
    OneCxActions.permissionsChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      permissions: action.permissions,
    })
  )
)


```

File : onecx-selectors.ts
```ts
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store'
import { OneCxState } from './onecx-state'
import { LocationState } from './onecx-state'

export function createOneCxSelector<State extends Record<string, any>>(): MemoizedSelector<State, OneCxState> {
  return createFeatureSelector('onecx')
}

export type OneCxSelectors<V> = {
  selectLocation: MemoizedSelector<V, LocationState | undefined>
  selectBackNavigationPossible: MemoizedSelector<V, boolean>
  selectPermissions: MemoizedSelector<V, string[] | undefined>
}

export function getOneCxSelectors<V extends Record<string, any>>(
  selectState: (state: V) => OneCxState = createOneCxSelector<V>()
): OneCxSelectors<V> {
  const selectLocation = createSelector(selectState, (state) => state.location)
  const selectBackNavigationPossible = createSelector(selectLocation, (location) => !!location && !location?.isFirst)
  const selectPermissions = createSelector(selectState, (state) => state.permissions)
  return {
    selectLocation,
    selectBackNavigationPossible,
    selectPermissions,
  }
}


```

File : onecx-state.ts
```ts
import { NavigatedEventPayload } from '@onecx/integration-interface'

export type LocationState = NavigatedEventPayload
export interface OneCxState {
  location?: LocationState | undefined
  permissions?: string[] | undefined
}


```

File : permissions-store-connector-service.
```ts
import { ENVIRONMENT_INITIALIZER, Injectable, OnDestroy, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { PermissionsTopic } from '@onecx/integration-interface'
import { OneCxActions } from './onecx-actions'

/**
 * @deprecated Please import from `@onecx/ngrx-integration-interface` instead.
 */
export function providePermissionsStoreConnector() {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory() {
        return () => inject(PermissionsStoreConnectorService)
      },
    },
    PermissionsStoreConnectorService,
  ]
}

@Injectable()
export class PermissionsStoreConnectorService implements OnDestroy {
  permissionsTopic$ = new PermissionsTopic()
  constructor(store: Store) {
    this.permissionsTopic$.subscribe((permissions) => {
      store.dispatch(OneCxActions.permissionsChanged({ permissions }))
    })
  }
  ngOnDestroy(): void {
    this.permissionsTopic$.destroy()
  }
}


```

********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > ngrx-accelerator > src > lib > utils > effects

File : create-query-params-effect.ts
```ts
import { ActivatedRoute, Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatLatestFrom } from '@ngrx/operators'
import { ActionCreator, Creator } from '@ngrx/store'
import { tap } from 'rxjs'

export function createQueryParamsEffect<AC extends ActionCreator<string, Creator>>(
  actions$: Actions,
  actionType: AC,
  router: Router,
  activatedRoute: ActivatedRoute,
  reducer: (state: Record<string, any>, action: ReturnType<AC>) => Record<string, any>
) {
  return createEffect(
    () => {
      return actions$.pipe(
        ofType(actionType),
        concatLatestFrom(() => activatedRoute.queryParams),
        tap(([action, queryParams]) => {
          const params = reducer(queryParams, action)
          router.navigate([], {
            relativeTo: activatedRoute,
            queryParams: params,
            replaceUrl: true,
            onSameUrlNavigation: 'reload',
          })
        })
      )
    },
    { dispatch: false }
  )
}


```


File : filter-for-navigated-to.ts
```ts
import { filter, MonoTypeOperatorFunction } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { Type } from '@angular/core'
import { RouterNavigatedAction } from '@ngrx/router-store'

export function filterForNavigatedTo<A extends RouterNavigatedAction>(
  router: Router,
  component: Type<any>
): MonoTypeOperatorFunction<A> {
  return (source) => {
    return source.pipe(
      filter(() => {
        return checkForComponent(component, router.routerState.root)
      })
    )
  }
}

function checkForComponent(component: any, route: ActivatedRoute): boolean {
  if (route.component === component) {
    return true
  }
  for (const c of route.children) {
    const r = checkForComponent(component, c)
    if (r) {
      return true
    }
  }
  return false
}


```


File : filter-for-only-query-params-changed.ts
```ts
import { Router, RoutesRecognized } from '@angular/router'
import { RouterNavigatedAction } from '@ngrx/router-store'
import { filter, map, MonoTypeOperatorFunction, withLatestFrom } from 'rxjs'

export function filterOutOnlyQueryParamsChanged<A extends RouterNavigatedAction>(
  router: Router
): MonoTypeOperatorFunction<A> {
  return (source) => {
    return source.pipe(
      withLatestFrom(
        router.events.pipe(
          filter((e) => e instanceof RoutesRecognized),
          map(() => router.routerState)
        )
      ),
      filter(([action, previousRouterState]) => {
        const previousPath = previousRouterState.snapshot.url.split('?')[0]
        const currentPath = action.payload.event.urlAfterRedirects.split('?')[0]

        return previousPath !== currentPath
      }),
      map(([action]) => action)
    )
  }
}


```


File : filter-for-query-params-changed.ts
```ts
import { RouterNavigatedAction } from '@ngrx/router-store'
import { ZodType } from 'zod'
import { MonoTypeOperatorFunction, filter, withLatestFrom, map } from 'rxjs'
import equal from 'fast-deep-equal'
import { Router, RoutesRecognized } from '@angular/router'

export function filterOutQueryParamsHaveNotChanged<A extends RouterNavigatedAction>(
  router: Router,
  queryParamsTypeDef: ZodType,
  allowEmptyQueryParamsList = false
): MonoTypeOperatorFunction<A> {
  return (source) => {
    return source.pipe(
      withLatestFrom(
        router.events.pipe(
          filter((e) => e instanceof RoutesRecognized),
          map(() => router.routerState)
        )
      ),
      filter(([action, previousRouterState]) => {
        if (
          !allowEmptyQueryParamsList &&
          Object.keys(action?.payload?.routerState?.root?.queryParams || {}).length === 0
        ) {
          return false
        }
        const currentQueryParams = previousRouterState.snapshot.root.queryParams
        const actionResult = queryParamsTypeDef.safeParse(action?.payload?.routerState?.root?.queryParams)
        const currentResult = queryParamsTypeDef.safeParse(currentQueryParams)

        if (actionResult.success && currentResult.success) {
          const actionParams = actionResult.data
          const currentParams = currentResult.data
          if (
            allowEmptyQueryParamsList &&
            Object.keys(actionParams).length === 0 &&
            Object.keys(currentParams).length === 0
          ) {
            return true
          }
          return !equal(actionParams, currentParams)
        }
        return false
      }),
      map(([action]) => action)
    )
  }
}


```



********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > ngrx-accelerator > src > lib >  utils > local-storage

File : create-nested-key-configuration.ts
```ts
export interface Options {
  serialize?: (state: any) => any
  deserialize?: (state: any) => any
  reviver?: (key: string, value: any) => any
  replacer?: ((key: string, value: any) => any) | string[]
  encrypt?: (message: string) => string
  decrypt?: (message: string) => string
  filter?: string[]
  space?: string | number
}

type CommonKeyConfigurationTypes = Options | ((key: string, value: any) => any)

export interface KeyConfiguration {
  [key: string]: string[] | number[] | KeyConfiguration[] | CommonKeyConfigurationTypes
}

export interface NestedKeyConfiguration {
    [key: string]: (string | number | NestedKeyConfiguration)[] | CommonKeyConfigurationTypes
  }

export function createNestedKeyConfiguration(nestedKeyConfiguration: (string | NestedKeyConfiguration)[]): KeyConfiguration[] {
  return nestedKeyConfiguration as KeyConfiguration[]
}


```


File : lazy-loading-merge-reducer.ts
```ts
import deepmerge from 'deepmerge'

export const lazyLoadingMergeReducer = (state: any, rehydratedState: any, _action: any) => {
  const overwriteMerge = (_destinationArray: any, sourceArray: any, _options: any) => sourceArray
  const options: deepmerge.Options = {
    arrayMerge: overwriteMerge,
  }
  const keysToRehydrate = Object.keys(rehydratedState).filter((key) => state[key])
  if (keysToRehydrate.length) {
    const stateToRehydrate = Object.keys(rehydratedState).reduce((acc: Record<string, unknown>, key) => {
      if (keysToRehydrate.includes(key)) {
        acc[key] = rehydratedState[key]
      }
      return acc
    }, {})
    state = deepmerge(state, stateToRehydrate, options)
    keysToRehydrate.forEach((key) => {
      delete rehydratedState[key]
    })
  }
  return state
}


```



********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > ngrx-accelerator > src > lib >  utils > selectors

File : create-child-selectors.ts
```ts
import { MemoizedSelector, createSelector } from '@ngrx/store'

type Primitive = string | number | bigint | boolean | null | undefined

type ChildSelectors<State extends Record<string, any>, ChildState> = ChildState extends Primitive | unknown[] | Date
  ? Record<string, never>
  : {
      [K in keyof ChildState & string as `select${Capitalize<K>}`]: MemoizedSelector<State, ChildState[K]>
    }

function capitalize<T extends string>(text: T): Capitalize<T> {
  return (text.charAt(0).toUpperCase() + text.substring(1)) as Capitalize<T>
}

export function createChildSelectors<State extends Record<string, any>, ChildState extends Record<string, any>>(
  featureSelector: MemoizedSelector<State, ChildState>,
  initialChildState: ChildState
): ChildSelectors<State, ChildState> {
  return Object.keys(initialChildState).reduce(
    (nestedSelectors, nestedKey) => ({
      ...nestedSelectors,
      [`select${capitalize(nestedKey)}`]: createSelector(featureSelector, (parentState) => parentState?.[nestedKey]),
    }),
    {} as ChildSelectors<State, ChildState>
  )
}


```

