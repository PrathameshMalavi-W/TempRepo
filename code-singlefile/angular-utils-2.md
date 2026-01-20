//Continued

********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************


File => onecx-portal-ui-libs > libs > angular-utils > style > src > index.ts
```ts
//api
export * from './api/constants'

//utils
export * from './utils/app-styles-usage.utils'
export * from './utils/dom-style.utils'
export * from './utils/app-styles-scope.utils'
export * from './utils/app-styles-lifecycle.utils'
export * from './utils/fetch-app-css.util'
```



File => onecx-portal-ui-libs > libs > angular-utils > style > src > test-setup.ts
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


Folder => onecx-portal-ui-libs > libs > angular-utils > style > src > api 


File : constant.ts
```ts
/**
 * @constant {string} dataRcStylesKey
 * @description Marks style element as one used by the current RC.
 */
export const dataRcStylesStart = 'slot'

/**
 * @constant {string} dataAppStylesKey
 * @description Marks style element as one containing styles for scopeId (which is based on the application)
 * Such style sheet contains variables applied globally and CSS scoped to a given scope until style isolation.
 * (e.g. data-app-styles="onecx-workspace|onecx-workspace-ui")
 */
export const dataAppStylesKey = 'appStyles'

/**
 * @constant {string} dataMfeStylesKey
 * @description Marks style element as one used by the current MFE.
 */
export const dataMfeStylesKey = 'mfeStyles'

/**
 * @function dataRcStylesKey
 * @description Marks style element as one used by any component in a slot given by the SLOT_NAME.
 * @param {string} slotName - The name of the slot.
 * @returns {string} The key for the slot styles.
 */
export const dataRcStylesKey = (slotName: string) =>
  `${dataRcStylesStart}${slotName.replace(slotName.charAt(0), slotName.charAt(0).toUpperCase())}Styles`

/**
 * @constant {string} dataShellStylesKey
 * @description Marks style element as one containing styles for the shell.
 * Such style sheet contains variables applied globally and CSS scoped to a shell scope until style isolation.
 */
export const dataShellStylesKey = 'shellStyles'

/**
 * @constant {string} dataAppStylesAttribute
 * @description HTML attribute for appStyles. See {@link dataAppStylesKey} for more details.
 */
export const dataAppStylesAttribute = 'data-app-styles'

/**
 * @constant {string} dataMfeStylesAttribute
 * @description HTML attribute for mfeStyles. See {@link dataMfeStylesKey} for more details.
 */
export const dataMfeStylesAttribute = 'data-mfe-styles'

/**
 * @function dataRcStylesAttribute
 * @description HTML attribute for slot styles. See {@link dataRcStylesKey} for more details.
 * @param {string} slotName - The name of the slot.
 * @returns {string} The attribute for the slot styles.
 */
export const dataRcStylesAttribute = (slotName: string) => `data-${dataRcStylesStart}-${slotName}-styles`

/**
 * @constant {string} dataShellStylesAttribute
 * @description HTML attribute for shellStyles. See {@link dataShellStylesKey} for more details.
 */
export const dataShellStylesAttribute = 'data-shell-styles'
```



********************************************************************************************************************************


Folder => onecx-portal-ui-libs > libs > angular-utils > style > src > utils 


File : app-styles-lifecycle.utils.ts
```ts
import { scopeIdFromProductNameAndAppId } from "@onecx/angular-utils";
import { HttpClient } from "@angular/common/http";
import {
  getAppStyleByScope, 
  getStyleUsageCount, 
  fetchAppCss,
  dataAppStylesKey,
  useStyleForMfe, 
  useStyleForRc, 
  replaceStyleContent, 
  removeMfeUsageFromStyle,
  removeRcUsageFromStyle,
  createStyleUsedByMfeRc,
  createApplicationScopedCss,
  getAllStylesUsedByKey,
  dataMfeStylesAttribute,
  dataRcStylesAttribute
} from "../index";

/**
 * Update page styles.
 *
 * It removes old mfe usages and unused style elements.
 * Loads and creates new style element with MFE application styles css and registers the MFE for the usage.
 * If style element for the MFE application is already created, it only registers for the usage.
 *
 * @param productName - product name MFE belongs to
 * @param appId - id of the application MFE belongs to
 * @param httpClient - http client to make requests
 * @param mfeUrl - url of the MFE application to make requests
 */
export function updateStylesForMfeChange(
  productName: string,
  appId: string,
  httpClient: HttpClient,
  mfeUrl: string
) {
  updateStyles(
    productName,
    appId,
    httpClient,
    mfeUrl,
    {type:'mfe'},
    (document) => useStyleForMfe(document),
    (document) => removeMfeUsageFromStyle(document) 
  );
}

/**
 * Update page styles.
 *
 * Loads and creates new style element with RC application styles css and registers the RC for the usage.
 * If style element for the RC application is already created, it only registers for the usage.
 * @param productName - product name RC belongs to
 * @param appId - id of the application RC belongs to
 * @param httpClient - http client to make requests
 * @param rcUrl - url of the RC application to make requests
 * @param slotName - name of the slot hosting the RC
 */
export function updateStylesForRcCreation(
  productName: string,
  appId: string,
  httpClient: HttpClient,
  rcUrl: string,
  slotName: string
) {
  updateStyles(
    productName,
    appId,
    httpClient,
    rcUrl,
    {type:'rc',slotName:slotName},
    (document) => useStyleForRc(document, slotName),
    (document) => removeRcUsageFromStyle(document,slotName) 
  );
}

/**
 * Update page styles.
 *
 * Loads and creates new style element with RC or MFE application styles css and registers the MFE or RC for the usage depending on passed callback function.
 * If style element for application is already created, it only registers for the usage.
 * The old and unused style usages are removed based on a passed callback function.
 * @param productName - product name style belongs to
 * @param appId - id of the application style belongs to
 * @param httpClient - http client to make requests
 * @param url - url of the application to make requests
 * @param options - defines type of style together with the name of the slot hosting the style for RC
 * @param useStyleCallback - function used for style registration based on the style type
 * @param removeUsageFromStyleCallback - function used for style removal based on the style type
 */
async function updateStyles(
  productName: string,
  appId: string,
  httpClient: HttpClient,
  url: string,
  options: {type:'rc',slotName:string} | {type:'mfe'},
  useStyleCallback: (document: HTMLStyleElement) => void,
  removeUsageFromStyleCallback: (document: HTMLStyleElement) => void
){
  const scopeId = scopeIdFromProductNameAndAppId(productName, appId)

  if(options.type === 'mfe') removeAllMfeUsagesFromStyles(scopeId)
  
  const existingStyleElement = getAppStyleByScope(scopeId)

  if (existingStyleElement) {
    useStyleCallback(existingStyleElement)
    return
  }

  const styleElement = createStyleUsedByMfeRc(scopeId, options)
  const css = await fetchAppCss(httpClient, url);
  (styleElement as any).onecxOriginalCss = css

  if (!css) {
    removeUsageFromStyleCallback(styleElement)
    if (getStyleUsageCount(styleElement) === 0) {
      styleElement.remove()
    }
    return
  }
  const scopedCss = createApplicationScopedCss(css, scopeId)
  replaceStyleContent(styleElement, scopedCss)
}

/**
 * Removes usages for all MFEs not related to the given scope.
 *
 * This will remove the style element completely if no other active users are present.
 *
 * @param scopeId - id of the scope to not deactivate
 */
export function removeAllMfeUsagesFromStyles(scopeId: string) {
  removeInactiveStyles(
    scopeId,
    getAllStylesUsedByKey(dataMfeStylesAttribute),
    (style) => removeMfeUsageFromStyle(style)
  );
}

/**
 * Update page styles.
 *
 * Remove usages of the RC from the style elements it is register for.
 * If usage removal leads to style element not being used by any MFE or RC its removed from the page.
 * @param scopeId - id of the scope to not deactivate
 * @param slotName - name of the slot hosting the RC
 */
export function removeAllRcUsagesFromStyles(scopeId: string, slotName: string) {
  removeInactiveStyles(
    scopeId,
    getAllStylesUsedByKey(dataRcStylesAttribute(slotName)),
    (style) => removeRcUsageFromStyle(style,slotName)
  );
}


/**
 * Remove usage of the  RC or MFE style from elements it is registered for.
 * If usage removal leads to style element not being used by any MFE or RC its removed from the page.
 * @param scopeId - id of the scope where the style has to be removed
 * @param styles - list of the style elements that have to be modified
 * @param removeUsageCallback - function used for style removal depending on style type
 */
function removeInactiveStyles(
    scopeId: string,
    styles: HTMLStyleElement[],
    removeUsageCallback: (style: HTMLStyleElement) => void
): void{  
  styles
    .filter((styleElement) => !(styleElement.dataset[dataAppStylesKey] === scopeId))
    .forEach((style) => {
      removeUsageCallback(style);
      if (getStyleUsageCount(style) === 0) {
        style.remove();
      }
    });
}
```


File : app-styles-scope.utils.ts
```ts
import { dataMfeElementAttribute, dataNoPortalLayoutStylesAttribute, dataStyleIdAttribute, dataStyleIsolationAttribute, isCssScopeRuleSupported} from "@onecx/angular-utils";
import { 
    dataAppStylesAttribute
} from "../index";

/**
 * Get the style element with application styles based on a scope.
 * @param scopeId - scope id related to the app
 * @returns {HTMLStyleElement | null} the style element related for a given scope
 */
export function getAppStyleByScope(scopeId: string): HTMLStyleElement | null {
  return document.head.querySelector<HTMLStyleElement>(`style[${dataAppStylesAttribute}="${scopeId}"]`)
}

/**
 * Replace ":root" selector with ":scope" for a given css.
 *
 * :scope === :root if "@scope" is not used
 * :scope === top level element of the scope if "@scope" is used
 * @param css - css text to transform
 * @returns {string} css with replaced selector
 */
export function replaceRootWithScope(css: string): string {
  return css.replaceAll(':root', ':scope')
}

/**
 * Replace "html" and ":root" selector with ":scope" for a given css.
 *
 * :scope === :root if "@scope" is not used
 * :scope === top level element of the scope if "@scope" is used
 * @param css - css text to transform
 * @returns {string} css with replaced selector
 */
export function replaceRootAndHtmlWithScope(css: string): string {
  return replaceRootWithScope(css.replaceAll('html',':scope'))
}

/**
 * Creates a string with application scoped css. The scope will apply the css to the element with given scopeId that has dataNoPortalLayoutStylesAttribute or dataMfeElementAttribute and will be available until element with dataStyleIsolationAttribute.
 * @param css - css for scoping
 * @param scopeId - scope id for scoping
 * @returns {string} css scoped by the given id
 */
export function createApplicationScopedCss(css: string, scopeId: string): string {
  const isScopeSupported = isCssScopeRuleSupported()
  const scopeSelector = `[${dataStyleIdAttribute}="${scopeId}"]:is([${dataNoPortalLayoutStylesAttribute}], [${dataMfeElementAttribute}])`
  // Apply styles to all v6 elements and the MFE
  return isScopeSupported
    ? `
      @scope(${scopeSelector}) to ([${dataStyleIsolationAttribute}]) {
        ${replaceRootAndHtmlWithScope(css)}
          }
      `
    : `
      @supports (@scope(${scopeSelector}) to ([${dataStyleIsolationAttribute}])) {
        ${replaceRootAndHtmlWithScope(css)}
          }
      `
}
```


File : app-styles-usage.utils.ts
```ts
import { dataMfeStylesKey, dataRcStylesKey, dataRcStylesStart } from '../index'
/**
 * Returns the count of MFEs and RCs using the style element.
 * @param styleElement - style element
 * @returns {number} number of MFEs and RCs using the style element
 */
export function getStyleUsageCount(styleElement: HTMLStyleElement): number {
  let usages = 0
  if (isStyleUsedByMfe(styleElement)) usages++
  usages += getStyleUsageCountForRc(styleElement)
  return usages
}

/**
 * Returns formatted string that reflects property name with given slot name
 * @param slotName - name of the slot hosting
 * @returns {string} - changed slot name which is a property name
 */
export function slotNameToPropertyName(slotName: string) : string{
  return slotName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

/**
 * Check if style is used by MFE.
 * @param styleElement - style element to check
 * @returns {boolean} if style is used by the MFE
 */
export function isStyleUsedByMfe(styleElement: HTMLElement): boolean {
  return styleElement.dataset[dataMfeStylesKey] !== undefined
}

/**
 * Returns the count of RCs using a given style element.
 * @param styleElement - style element to check
 * @returns {number} the count of RCs using a given style element
 */
export function getStyleUsageCountForRc(styleElement: HTMLStyleElement): number {
  return Object.keys(styleElement.dataset).filter((key) => key.startsWith(dataRcStylesStart)).length
}

/**
 * Returns all style elements with styles registered with attribute key
 * @param key - style attribute key associated with html element style
 * @returns {HTMLStyleElement[]} - a list of html elements with matching attribute key
 */
export function getAllStylesUsedByKey(key: string): HTMLStyleElement[] {
  return Array.from(document.head.querySelectorAll<HTMLStyleElement>(`style[${key}]`))
}

/**
 * Removes the MFE from list of users of the style element.
 * @param styleElement - style element to modify
 */
export function removeMfeUsageFromStyle(styleElement: HTMLStyleElement) {
    delete styleElement.dataset[dataMfeStylesKey]
}

/**
 * Removes the RC from list of users of the style element.
 * @param styleElement - style element to modify
 * @param slotName - name of the slot hosting the RC
 */
export function removeRcUsageFromStyle(styleElement: HTMLStyleElement, slotName: string) {
    delete styleElement.dataset[slotNameToPropertyName(dataRcStylesKey(slotName))]
}

/**
 * Registers the RC as a user of the style element.
 * @param styleElement - style element to register for
 * @param slotName - name of the slot hosting the RC
 */
export function useStyleForRc(styleElement: HTMLStyleElement, slotName: string) {
  styleElement.dataset[slotNameToPropertyName(dataRcStylesKey(slotName))] = ''
}

/**
 * Registers the MFE as a user of the style element.
 * @param styleElement - style element to modify
 */
export function useStyleForMfe(styleElement: HTMLStyleElement) {
  styleElement.dataset[dataMfeStylesKey] = ''
}

```


File : dom-style.utils.ts
```ts
import { dataAppStylesKey, useStyleForMfe, useStyleForRc } from '../index'

/**
 * Creates new style sheet with given content and optional dataset attributes and appends it to the document head.
 * @param content - content for new style sheet
 * @param datasetAttributes - attributes to add to new style element
 * @returns {HTMLStyleElement} new style element
 */
export function addStyleToHead(content: string, datasetAttributes?: { [key: string]: string }): HTMLStyleElement {
  const style = document.createElement('style')

  style.appendChild(document.createTextNode(content))
  if (datasetAttributes) {
    Object.keys(datasetAttributes).forEach((key) => {
      style.dataset[key] = datasetAttributes[key]
    })
  }
  document.head.appendChild(style)
  return style
}

/**
 * Replaces content of a given style element.
 * @param selectorOrElement - selector for a style element or exact element
 * @param content - content to be put in the style element
 * @returns {HTMLStyleElement} updated style element
 */
export function replaceStyleContent(
  selectorOrElement: string | HTMLStyleElement,
  content: string
): HTMLStyleElement | null {
  if (selectorOrElement instanceof HTMLStyleElement) {
    selectorOrElement.textContent = content
    return selectorOrElement
  }

  const styleElement = document.head.querySelector<HTMLStyleElement>(selectorOrElement)
  if (styleElement) styleElement.textContent = content
  return styleElement
}

/**
 * Creates new style element and register MFE or RC as the user of it
 * @param scopeId - scope id related to the app
 * @param options - registration options
 * @returns {HTMLStyleElement} style element with MFE or RC registered
 */
export function createStyleUsedByMfeRc(
    scopeId: string,
    options: {type:'rc'; slotName: string} | {type: 'mfe'}
): HTMLStyleElement {    
    const element = addStyleToHead('', {
        [dataAppStylesKey]: scopeId,
    });

    if (options.type === 'rc') {
        useStyleForRc(element, options.slotName);
    } else {
        useStyleForMfe(element);
    }

    return element;
}
```


File : fetch -app-css.util.ts
```ts
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { catchError, firstValueFrom, mergeMap, of, throwError } from 'rxjs'
import { Location } from '@angular/common'

/**
 * Fetches the css for an application.
 * @param http - http client for making requests
 * @param appUrl - url of the application used for making requests
 * @returns {Promise<string | undefined | null>} application css content
 */
export async function fetchAppCss(http: HttpClient, appUrl: string): Promise<string | undefined | null> {
  return await firstValueFrom(
    http
      .get(Location.joinWithSlash(appUrl, 'styles.css'), {
        headers: createCssRequestHeaders(),
        observe: 'response',
        responseType: 'text',
      })
      .pipe(
        mergeMap((response) => {
          if (!isResponseValidCss(response)) {
            return throwError(
              () =>
                new Error(
                  `Application returned different content type than text/css: ${response.headers.get('Content-Type')}. Please, make sure that the application exposes the styles.css file.`
                )
            )
          }

          return of(response.body)
        }),
        catchError((error: Error) => {
          console.error(
            `Error while loading app css for ${appUrl}: ${error.message}.  Please, make sure that the application exposes the styles.css file in your application.`
          )
          return of(undefined)
        })
      )
  )
}

/**
 * Creates HttpHeaders for Css request.
 */
export function createCssRequestHeaders() {
  return new HttpHeaders({}).set('Accept', 'text/css')
}

/**
 * Returns if response is valid css.
 * @param response - response to validate
 * @returns {boolean} if response is valid css
 */
export function isResponseValidCss<T>(response: HttpResponse<T>) {
  return response.headers.get('Content-Type')?.includes('text/css')
}
```










********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************


File => onecx-portal-ui-libs > libs > angular-utils > theme > primeng > src > index.ts
```ts
// preset
export * from './preset/custom-preset'
export * from './preset/preset-variables'

// services
export * from './services/custom-use-style.service'
export * from './services/theme-config.service'

// utils
export * from './utils/application-config'
export * from './utils/create-color-palette'
export * from './utils/normalize-preset-keys.utils'

```


File => onecx-portal-ui-libs > libs > angular-utils > theme > primeng > src > test-setup.ts
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


Folder => onecx-portal-ui-libs > libs > angular-utils > theme > primeng > src > preset


File : custom-preset.ts
```ts
import { definePreset } from '@primeng/themes'
import Aura from '@primeng/themes/aura'
import presetVariables from './preset-variables'
import { normalizeKeys } from '../utils/normalize-preset-keys.utils'

export const CustomPreset = definePreset(normalizeKeys(Aura), normalizeKeys(presetVariables))
CustomPreset.semantic.colorScheme.dark = {}
export default CustomPreset

```


File : default-theme-variables.ts
```ts
export default {
  font: {
    fontFamily: 'Ubuntu, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
    fontSize: null,
  },
  topbar: {
    topbarBgColor: '#0D3650',
    topbarItemTextColor: '#ffffff',
    topbarTextColor: '#ffffff',
    topbarLeftBgColor: '#0D3650',
    topbarItemTextHoverBgColor: '#262626',
    topbarMenuButtonBgColor: 'rgb(255 0 68)',
    logoColor: '#ffffff',
  },
  sidebar: {
    menuTextColor: '#274B5F',
    menuBgColor: ' #fdfeff',
    menuItemTextColor: ' #515c66',
    menuItemBgColor: null,
    menuItemHoverBgColor: '#d0021b',
    menuActiveItemTextColor: '#515c66',
    menuActiveItemBgColor: 'rgba(0, 0, 0, 0.04)',
    menuInlineBorderColor: null,
  },
  general: {
    primaryColor: '#274B5F',
    secondaryColor: '#1C4257',
    textColor: 'rgba(0, 0, 0, 0.87)',
    textSecondaryColor: '#262626',
    bodyBgColor: '#f7f7f7',
    contentBgColor: '#ffffff',
    contentAltBgColor: null,
    overlayContentBgColor: '#ffffff',
    hoverBgColor: '#ad1457',
    solidSurfaceTextColor: '#ffffff',
    dividerColor: '#e4e4e4',
    buttonHoverBg: '#ad1457',
    buttonActiveBg: 'rgba(39, 75, 95, 0.68)',
    dangerButtonBg: '#D32F2F',
    infoMessageBg: '#b3e5fc',
    successMessageBg: '#c8e6c9',
    warningMessageBg: '#ffecb3',
    errorMessageBg: '#ffcdd2',
  },
}

```


File : preset-variables.ts
```ts
import { createPalette, standardColorAdjustment } from '../utils/create-color-palette'

import defaultVariables from './default-theme-variables'
import breadcrumb from './component-presets/breadcrumb'
import autocomplete from './component-presets/autocomplete'
import button from './component-presets/button'
import datatable from './component-presets/datatable'
import dialog from './component-presets/dialog'
import fieldset from './component-presets/fieldset'
import floatlabel from './component-presets/floatlabel'
import inputtext from './component-presets/inputtext'
import paginator from './component-presets/paginator'
import fileupload from './component-presets/fileupload'

// Structure of this object has to match https://github.com/primefaces/primeuix/tree/main/packages/themes/src/presets/aura
export default {
  components: {
    ...autocomplete,
    ...breadcrumb,
    ...button,
    ...datatable,
    ...dialog,
    ...fieldset,
    ...fileupload,
    ...floatlabel,
    ...inputtext,
    ...paginator,
  },
  semantic: {
    // OneCX semantic variables extension
    extend: {
      onecx: {
        ...defaultVariables.font,
        ...defaultVariables.topbar,
        ...defaultVariables.sidebar,
        ...defaultVariables.general,
        errorColor: '#b00020',
        animationDuration: '0.2s',
      },
    },
    transitionDuration: '0.2s',
    focusRing: {
      width: '1px',
      style: 'solid',
      color: '{primary.color}',
      offset: '2px',
      shadow: 'none',
    },
    disabledOpacity: '0.6',
    iconSize: '1rem',
    anchorGutter: '2px',
    primary: {
      ...createPalette(defaultVariables.general.primaryColor, standardColorAdjustment),
    },
    formField: {
      // INFO: --input-padding from dev env has equal values 0.75rem 0.75rem
      paddingX: '0.75rem',
      // paddingY: '0.5rem',
      paddingY: '0.75rem', // equal to paddingX
      // INFO: Tokens for new small form fields
      sm: {
        fontSize: '0.875rem',
        paddingX: '0.625rem',
        // paddingY: '0.375rem',
        paddingY: '0.625rem', // equal to paddingX
      },
      // INFO: Tokens for new large form fields
      lg: {
        fontSize: '1.125rem',
        paddingX: '0.875rem',
        // paddingY: '0.625rem',
        paddingY: '0.875rem', // equal to paddingX
      },
      borderRadius: '{border.radius.md}',
      focusRing: {
        width: '0',
        style: 'none',
        color: 'transparent',
        offset: '0',
        shadow: 'none',
      },
      transitionDuration: '{transition.duration}',
    },
    // INFO: Lists in all select and list components (except for tree select and menus)
    list: {
      // INFO: List container doesn't seem to have padding in our apps
      // padding: '0.25rem 0.25rem',
      // TODO: Do we set a padding here and reduce the padding of the individual items?
      padding: '0',
      // INFO: new variable, gap between each item in list
      gap: '2px',
      header: {
        // INFO: --input-list-header-padding used
        //padding: '0.5rem 1rem 0.25rem 1rem',
        padding: '0.75rem',
      },
      option: {
        // INFO: --input-list-item-padding used
        // padding: '0.25rem 0.25rem',
        // TODO: Do we reduce this because of the newly introduced gap?
        padding: '0.75rem 0.75rem',
        // INFO: --input-list-item-border-radius used
        // borderRadius: '{border.radius.sm}',
        // TODO: If we decide to add padding to list container, a little bit of border radius would look great
        borderRadius: 0,
      },
      optionGroup: {
        // INFO: --submenu-header-padding used
        // padding: '0.5rem 0.75rem',
        padding: '0.75rem',
        // INFO: --submenu-header-font-weight used (400) -> no difference to weight of normal list item
        // TODO: Decide if we want to keep 600 or revert back to 400
        fontWeight: '600',
      },
    },
    mask: {
      // INFO: No variable for this, so probably was default PrimeNG value
      transitionDuration: '0.15s',
    },
    content: {
      // INFO: --border-radius is used
      borderRadius: '{border.radius.md}',
    },
    // INFO: All menu components
    navigation: {
      list: {
        // INFO: --vertical-menu-padding used
        // padding: '0.25rem 0.25rem',
        padding: '0.5rem 1.25rem',
        // INFO: new variable, gap between each item in list
        gap: '2px',
      },
      item: {
        // INFO: --menuitem-padding used
        // padding: '0.5rem 0.75rem',
        padding: '0.75rem 0.75rem',
        // INFO: --menuitem-border-radius used
        // borderRadius: '{border.radius.sm}',
        borderRadius: '0',
        // INFO: new variable, gap between items in a single item, e.g., icon and text
        gap: '0.5rem',
      },
      submenuLabel: {
        // INFO: --submenu-header-padding used
        // padding: '0.5rem 0.75rem',
        padding: '0.75rem',
        // INFO: --submenu-header-font-weight used
        // fontWeight: '600',
        fontWeight: '400',
      },
      submenuIcon: {
        // INFO: --menuitem-submenu-icon-font-size used
        size: '0.875rem',
      },
    },
    overlay: {
      // INFO: Components allowing selection
      select: {
        // INFO: --border-radius is used
        // TODO: Can be borderRadius: 4px
        // borderRadius: '{border.radius.md}',
        borderRadius: '{border.radius.sm}',
        // INFO: --input-overlay-shadow is used
        // shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        shadow:
          '0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12)',
      },
      // INFO: Components that pop up (p-password, tooltip)
      popover: {
        // INFO: --border-radius is used
        // TODO: Can be borderRadius: 4px
        // borderRadius: '{border.radius.md}',
        borderRadius: '{border.radius.sm}',
        // INFO: for tooltip its 0.5rem
        // INFO: for overlaypanel and password 0.75rem
        padding: '0.75rem',
        // INFO: --input-overlay-shadow used
        // shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        shadow:
          '0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12)',
      },
      // INFO: The only usage of this token is related to p-dialog
      modal: {
        // INFO: --border-radius is used
        // TODO: Can be borderRadius: 4px
        // borderRadius: '{border.radius.md}',
        borderRadius: '{border.radius.sm}',
        // INFO: --dialog-header-padding is used and --dialog-content-padding is used
        padding: '1.25rem',
        // INFO: --overlay-container-shadow is used
        // shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        shadow:
          '0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12)',
      },
      // INFO: All menu components
      navigation: {
        // INFO: --overlay-menu-shadow is used
        // shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        shadow: '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)',
      },
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f7f8f9',
          100: '#dadee3',
          200: '#bcc3cd',
          300: '#9fa9b7',
          400: '#818ea1',
          500: '#64748b',
          600: '#556376',
          700: '#465161',
          800: '#37404c',
          900: '#282e38',
          950: '#191d23',
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{onecx.button.hover.bg}', // button-hover-bg
          activeColor: '{onecx.button.active.bg}', // button-active-bg
          // if buttonActiveBg is not set, it should be primary.400
        },
        highlight: {
          // --highlight-bg is used, rgba($primaryColor, 0.12);
          background: '{primary.100}',
          // $highlightFocusBg is used, rgba($primaryColor, 0.24) !default;
          focusBackground: '{primary.200}',
          // primaryColor is used for highlightTextColor
          color: '{primary.color}',
          // textColor is used for $inputListItemTextFocusColor
          focusColor: '{text.color}',
        },
        mask: {
          // INFO: --maskbg used
          // INFO: Mask applied on image, speedDial with mask prop. Determines what color is the mask
          // background: 'rgba(0,0,0,0.4)',
          background: 'rgba(0, 0, 0, 0.32)',
          // INFO: Color of any text content inside a mask?
          color: '{surface.200}',
        },
        // TODO: Consider using theme variable for surface value so background and borders are set correctly
        formField: {
          // INFO: dev -> on focus primary color is used
          focusBorderColor: '{primary.color}',

          // TODO: When button is invalid, hover/focus is applied for border
          // INFO: $errorColor color is used for invalid border
          // invalidBorderColor: '{red.400}',
          invalidBorderColor: '{onecx.error.color}', // using $errorCode

          // INFO: $errorColor color is used for invalid border
          // invalidPlaceholderColor: '{red.600}',
          invalidPlaceholderColor: '{onecx.error.color}', // using $errorCode

          // INFO: --input-bg used input background
          // TODO: Check with surface value
          // TODO: Can be background: '#ffffff'
          background: '{surface.0}',
          // INFO: --input-filled-bg used input background
          // TODO: Check with surface value
          // TODO: Can be filledBackground: '#f5f5f5'
          filledBackground: '{surface.50}',
          // INFO: --input-filled-hover-bg used input background
          // TODO: Check with surface value
          // TODO: Can be filledHoverBackground: '#ececec'
          filledHoverBackground: '{surface.50}',
          // INFO: --input-filled-focus-bg used input background
          // TODO: Check with surface value
          // TODO: Can be filledFocusBackground: '#dcdcdc'
          filledFocusBackground: '{surface.50}',

          // INFO: no variable for disabled background of form fields, opacity for input is set, opacity: var(--disabled-opacity);
          // TODO: Check with surface value
          // TODO: Can be disabledBackground: DECIDE_VALUE
          // disabledBackground: '{surface.200}',
          disabledBackground: '{surface.100}', // lighter color than default
          // INFO: no variable for disabled color of form fields, opacity for input is set, opacity: var(--disabled-opacity);
          // TODO: Check with surface value
          // TODO: Can be disabledColor: DECIDE_VALUE
          // disabledColor: '{surface.500}',
          disabledColor: '{surface.400}', // lighter color than default

          // INFO: --emphasis-low is used for default input border color
          // TODO: Check with surface value
          // TODO: Can be borderColor: rgba(0, 0, 0, 0.38)
          // borderColor: '{surface.300}',
          borderColor: '{surface.200}', // lighter color than default
          // INFO: --emphasis-high is used for default input border color
          // TODO: Check with surface value
          // TODO: Can be hoverBorderColor: rgba(0, 0, 0, 0.87)
          hoverBorderColor: '{surface.400}',

          // INFO: --emphasis-high is used for default input text color
          // TODO: Check with surface value
          // TODO: Can be color: rgba(0, 0, 0, 0.87)
          color: '{surface.700}',
          // INFO: --emphasis-medium is used for placeholder text color
          // TODO: Check with surface value
          // TODO: Can be placeholderColor: rgba(0, 0, 0, 0.6)
          placeholderColor: '{surface.500}',
          // INFO: --emphasis-medium is used for icon color
          // TODO: Check with surface value
          // TODO: Can be iconColor: rgba(0, 0, 0, 0.6)
          iconColor: '{surface.400}',
          // INFO: no variable for shadow, no shadow seems to be there for form fields
          shadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)',

          // INFO: --emphasis-medium is used for float label text color
          // TODO: Check with surface value
          // TODO: Can be floatLabelColor: rgba(0, 0, 0, 0.6)
          floatLabelColor: '{surface.500}',
          // INFO: dev -> on focus primary color is used
          // floatLabelFocusColor: '{primary.600}',
          floatLabelFocusColor: '{primary.color}',
          // INFO: No clue what it is
          floatLabelActiveColor: '{surface.500}',
          // INFO: $errorColor color is used for invalid border
          floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
        },
        text: {
          color: '{onecx.text.color}',
          // INFO: textColor used for inplaceTextHoverColor, toggleButtonTextHoverColor
          hoverColor: '{onecx.text.secondary.color}',
          // mutedColor and hovermuted are not available in the theme
          mutedColor: '{surface.500}',
          hoverMutedColor: '{surface.600}',
        },
        content: {
          background: '{onecx.content.bg.color}',
          hoverBackground: '{onecx.hover.bg.color}',
          borderColor: '{surface.100}',
          color: '{text.color}',
          hoverColor: '{text.hover.color}',
        },
        overlay: {
          select: {
            // INFO: --input-list-bg used
            // TODO: Check with surface value
            // TODO: Can be background: '#ffffff'
            background: '{surface.0}',
            // INFO: --input-overlay-border used
            // INFO: border: 0 none
            // TODO: Should border be none or should overlay have a border?
            borderColor: '{surface.200}',
            // INFO: --text-color used
            color: '{text.color}',
          },
          popover: {
            // INFO: --panel-content-bg used
            // TODO: Check with surface value
            // TODO: Can be background: '#ffffff'
            background: '{surface.0}',
            // INFO: --panel-content-bg used
            // INFO: border: 0 none
            // TODO: Should border be none or should overlay have a border?
            borderColor: '{surface.200}',
            // INFO: --text-color used
            color: '{text.color}',
          },
          modal: {
            // INFO: --dialog-header-bg, dialog-content-bg used
            // INFO: Can be background: '#ffffff'
            background: '{surface.0}',
            // INFO: --overlay-content-border used
            // INFO: border: 0 none
            // TODO: Should border be none or should overlay have a border?
            borderColor: '{surface.200}',
            // INFO: --text-color used
            color: '{text.color}',
          },
        },
        // INFO: Lists in all select and list components (except for tree select and menus)
        list: {
          option: {
            option: {
              selectedColor: '{primary.color}',
              selectedFocusColor: '{primary.color}',
            },
            // INFO: --input-list-item-hover-bg used
            // INFO: Could be focusBackground: 'rgba(0, 0, 0, 0.04)'
            focusBackground: '{surface.100}',
            // INFO: --highlight-bg used
            selectedBackground: '{highlight.background}',
            // INFO: --highlight-bg used
            selectedFocusBackground: '{highlight.focus.background}',
            // INFO: --text-color used
            color: '{text.color}',
            // INFO: --text-color used
            // TODO: Maybe it makes sense to leave hover color?
            focusColor: '{text.hover.color}',
            // INFO: --primary-color used
            selectedColor: '{highlight.color}',
            // INFO: --primary-color used
            selectedFocusColor: '{highlight.focus.color}',
            icon: {
              // INFO: --text-secondary-color used
              // TODO: Decide on secondary color or surface
              color: '{surface.400}',
              // INFO: --text-secondary-color used
              // TODO: Decide on secondary color or surface
              focusColor: '{surface.500}',
            },
          },
          optionGroup: {
            // INFO: --submenu-header-bg used
            // INFO: Could be background: '#ffffff'
            background: '{surface.0}',
            // INFO: --text-secondary-color used
            // TODO: Decide on secondary color or text.muted
            color: '{text.muted.color}',
          },
        },
        // INFO: All menu components
        navigation: {
          item: {
            // INFO: --menuitem-focus-bg, --menuitem-hover-bg used
            // INFO: Could be focusBackground: 'rgba(0, 0, 0, 0.04)'
            focusBackground: '{surface.100}',
            // INFO: --menuitem-active-bg, --menuitem-active-focus-bg used
            // INFO: Could be activeBackground: 'rgba(0, 0, 0, 0.04)'
            activeBackground: '{surface.100}',
            // INFO: --text-color used
            color: '{text.color}',
            // INFO: --text-color used
            // TODO: Maybe it makes sense to leave hover color?
            focusColor: '{text.hover.color}',
            // INFO: --text-color used
            // TODO: Maybe it makes sense to leave hover color?
            activeColor: '{text.hover.color}',
            icon: {
              // INFO: --text-secondary-color used
              // TODO: Decide on secondary color or surface
              color: '{surface.400}',
              // INFO: --text-secondary-color used
              // TODO: Decide on secondary color or surface
              focusColor: '{surface.500}',
              // INFO: --text-secondary-color used
              // TODO: Decide on secondary color or surface
              activeColor: '{surface.500}',
            },
          },
          submenuLabel: {
            // INFO: --submenu-header-bg used
            // INFO: Could be background: '#ffffff'
            background: 'transparent',
            // INFO: --text-secondary-color used
            // TODO: Decide on secondary color or surface
            color: '{text.muted.color}',
          },
          submenuIcon: {
            // INFO: --text-secondary-color used
            // TODO: Decide on secondary color or surface
            color: '{surface.400}',
            // INFO: --text-secondary-color used
            // TODO: Decide on secondary color or surface
            focusColor: '{surface.500}',
            // INFO: --text-secondary-color used
            // TODO: Decide on secondary color or surface
            activeColor: '{surface.500}',
          },
        },
      },
    },
  },
}

```




********************************************************************************************************************************


Folder => onecx-portal-ui-libs > libs > angular-utils > theme > primeng > src > preset > componenet-preset > 


File : autocomplete.ts
```ts
export default {
  autocomplete: {
    dropdown: {
      borderColor: '{primary.color}',
      hoverBorderColor: '{primary.hoverColor}'
    },
    option: {
      focusBackground: '{surface.50}',
      selectedBackground: '{list.option.selectedBackground}',
      selectedFocusBackground: '{list.option.selectedFocusBackground}'
    },
    colorScheme: {
      light: {
        dropdown: {
          background: '{primary.color}',
          hoverBackground: '{primary.hoverColor}',
          color: '{surface.0}',
          hoverColor: '{surface.0}',
        }
      }
    }
}}

```


File : breadcrumb.ts
```ts
export default {
  breadcrumb: {
    root: {
      padding: '0.75rem',
    },
    item: {
      color: '{general.textSecondaryColor}',
      hoverColor: '{general.textSecondaryColor}',
      icon: {
        color: '{general.textSecondaryColor}',
        hoverColor: '{general.textSecondaryColor}',
      },
    },
    separator: {
      color: '{general.textSecondaryColor}',
    },
  },
}

```


File : button.ts
```ts
export default {
  button: {
    root: {
      paddingY: '0.643rem',
    },
  },
}

```


File : datatable.ts
```ts
export default {
    datatable: {
        headerCell: {
            background: '{surface.0}',
            hoverBackground: '{surface.50}', 
            selectedBackground: '{surface.50}'
        },
        columnTitle: {
            fontWeight: '500'
        }
    }
}
```


File : dialog.ts
```ts
export default {
    dialog: {
        footer: {
          padding: '.75rem 1.25rem .75rem 1.25rem'
        },
        title: {
            fontWeight: '500'
        }
    }
}
```


File : fieldset.ts
```ts
export default {
    fieldset: {
        legend: {
            fontWeight: '500'
        }
    }
}
```


File : fileupload.ts
```ts
export default {
  fileupload: {
    root: {
      borderRadius: '{border.radius.sm}',
      // border width is set to only add additional border between header and content
    },
    header: {
      padding: '0.75rem',
      background: '{surface.50}',
      borderWidth: '0 0 1px 0',
    },
  },
}

```


File : floatlabel.ts
```ts
export default {
  floatlabel: {
    root: {
      fontWeight: '400',
    },
  },
}

```


File : inputtext.ts
```ts
export default {
  inputtext: {
    root: {
      color: '{general.textColor}',
      disabledBackground: '{formField.background}',
      disabledColor: '{general.textColor}',
      borderColor: '{surface.300}',
    },
  },
}

```


File : paginator.ts
```ts
export default {
    paginator:  {
        navButton: {
            hoverBackground: '{surface.50}'
        },
        currentPageReport: {
            color: '{general.textSecondaryColor}'
        } 
    }
}
```


********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > angular-utils > theme > primeng > src > services


File : custom-use-style.service.spec.ts
```ts
import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { CustomUseStyle } from './custom-use-style.service'
import { DOCUMENT } from '@angular/common'
import { ReplaySubject } from 'rxjs'
import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { AppStateService, MfeInfo } from '@onecx/angular-integration-interface'
import { THEME_OVERRIDES } from '../utils/application-config'
import {
  dataNoPortalLayoutStylesAttribute,
  dataStyleIdAttribute,
  dataStyleIsolationAttribute,
  shellScopeId,
  SKIP_STYLE_SCOPING,
} from '@onecx/angular-utils'
import { REMOTE_COMPONENT_CONFIG } from '@onecx/angular-utils'
import { RemoteComponentConfig } from '@onecx/angular-utils'

class ElementMock {
  // extension
  tagName: string
  // Element data
  isConnected = false
  textContent = ''
  attribute = ''
  constructor(tagName: string) {
    this.tagName = tagName
  }

  setAttribute(attr: string, value: string) {
    this.attribute = `${attr}="${value}"`
  }
}

function removeSpacesAndNewlines(str?: string) {
  return str?.replace(/\s+/g, '')
}

jest.mock('@primeuix/utils', () => ({
  setAttributes: (element: ElementMock, attributes: Record<string, string>) => {
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
  },
}))

describe('CustomUseStyleService', () => {
  let service: CustomUseStyle
  let styleList: Array<ElementMock> = []
  let mockOverrides = {}

  const documentMock: Partial<Document> = {
    querySelector(selectors: string) {
      return styleList.find((s) => `style[${s.attribute}]` === selectors) ?? null
    },
    createElement(tagName: string) {
      return new ElementMock(tagName) as any as HTMLElement
    },
    head: {
      appendChild(node: ElementMock) {
        styleList.push(node)
        node.isConnected = true
      },
    } as HTMLHeadElement,
  }

  const configureShell = () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SKIP_STYLE_SCOPING,
          useValue: true,
        },
        {
          provide: DOCUMENT,
          useValue: documentMock,
        },
        {
          provide: THEME_OVERRIDES,
          useValue: mockOverrides,
        },
      ],
    })
    service = TestBed.inject(CustomUseStyle)
  }

  const configureRemoteComponent = () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: REMOTE_COMPONENT_CONFIG,
          useValue: new ReplaySubject<RemoteComponentConfig>(1),
        },
        {
          provide: DOCUMENT,
          useValue: documentMock,
        },
        {
          provide: THEME_OVERRIDES,
          useValue: mockOverrides,
        },
      ],
    })
    service = TestBed.inject(CustomUseStyle)
    const config = TestBed.inject(REMOTE_COMPONENT_CONFIG)
    config.next({
      appId: 'test-ui',
      productName: 'test',
      permissions: [],
      baseUrl: 'test',
    })
    return { styleId: 'test|test-ui', prefix: 'test-test-ui' }
  }

  const configureMfe = () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: documentMock,
        },
        provideAppStateServiceMock(),
        {
          provide: THEME_OVERRIDES,
          useValue: mockOverrides,
        },
      ],
    })
    service = TestBed.inject(CustomUseStyle)
    const appStateService = TestBed.inject(AppStateService)
    appStateService.currentMfe$.publish({
      appId: 'test-ui',
      productName: 'test',
    } as MfeInfo)
    return { styleId: 'test|test-ui', prefix: 'test-test-ui' }
  }

  const removeScopeRule = () => {
    delete (global as any).CSSScopeRule
  }

  const setScopeRule = () => {
    ;(global as any).CSSScopeRule = 'CSSScopeRule'
  }

  beforeEach(() => {
    setScopeRule()
  })

  afterEach(() => {
    styleList = []
    mockOverrides = {}
    removeScopeRule()
  })

  describe('for Shell', () => {
    beforeEach(() => {
      configureShell()
    })

    it('should create variables', fakeAsync(() => {
      const css = ":root{--p-primary-color: '#ababab';}"
      const expectedCss = `@scope([${dataStyleIdAttribute}="${shellScopeId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--p-primary-color: '#ababab';}}`
      service.use(css, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles', fakeAsync(() => {
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
      @scope([data-style-id="${shellScopeId}"][data-no-portal-layout-styles]) to ([data-style-isolation]) {
              ${css}
          }
      `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles when scope is not supported', fakeAsync(() => {
      removeScopeRule()
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
      @supports (@scope([data-style-id="${shellScopeId}"][data-no-portal-layout-styles]) to ([data-style-isolation])) {
              ${css}
          }
      `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create additional style element for overrides', fakeAsync(() => {
      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const overrides = TestBed.inject(THEME_OVERRIDES)
      overrides['semantic'] = {
        primaryColor: 'red',
      }
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="shell-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--p-primary-color:red;}}`
      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))
  })

  describe('for Remote Component', () => {
    let styleId: string
    let prefix: string
    beforeEach(() => {
      const config = configureRemoteComponent()
      styleId = config.styleId
      prefix = config.prefix
    })
    it('should create variables', fakeAsync(() => {
      const css = ":root{--p-primary-color: '#ababab'}"
      const expectedCss = `@scope([${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color: '#ababab'}}`

      service.use(css, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles', fakeAsync(() => {
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
            @scope([data-style-id="${styleId}"][data-no-portal-layout-styles]) to ([data-style-isolation]) {
                .p-button{display:inline-flex;color:var(--${prefix}-button-primary-color)}}
            `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles when scope is not supported', fakeAsync(() => {
      removeScopeRule()
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
            @supports (@scope([data-style-id="${styleId}"][data-no-portal-layout-styles]) to ([data-style-isolation])) {
                .p-button{display:inline-flex;color:var(--${prefix}-button-primary-color)}}
            `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create additional style element for overrides', fakeAsync(() => {
      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const overrides = TestBed.inject(THEME_OVERRIDES)
      overrides['semantic'] = {
        primaryColor: 'red',
      }
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color:red;}}`
      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))
  })

  describe('for MFE', () => {
    let styleId: string
    let prefix: string
    beforeEach(() => {
      const config = configureMfe()
      styleId = config.styleId
      prefix = config.prefix
    })
    it('should create variables', fakeAsync(() => {
      const css = ":root{--p-primary-color: '#ababab'}"
      const expectedCss = `@scope([${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color: '#ababab'}}`

      service.use(css, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles', fakeAsync(() => {
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
                  @scope([data-style-id="${styleId}"][data-no-portal-layout-styles]) to ([data-style-isolation]) {
                      .p-button{display:inline-flex;color:var(--${prefix}-button-primary-color)}}
                  `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create styles when scope is not supported', fakeAsync(() => {
      removeScopeRule()
      const css = '.p-button{display:inline-flex;color:var(--p-button-primary-color)}'
      const expectedCss = `
                  @supports (@scope([data-style-id="${styleId}"][data-no-portal-layout-styles]) to ([data-style-isolation])) {
                      .p-button{display:inline-flex;color:var(--${prefix}-button-primary-color)}}
                  `

      service.use(css, {
        name: 'button-styles',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))
    }))

    it('should create additional style element for overrides', fakeAsync(() => {
      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const overrides = TestBed.inject(THEME_OVERRIDES)
      overrides['semantic'] = {
        primaryColor: 'red',
      }
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="test|test-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color:red;}}`
      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))
  })

  describe('overrides', () => {
    it('should accept object with overrides', fakeAsync(() => {
      const { prefix } = configureMfe()
      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const overrides = TestBed.inject(THEME_OVERRIDES)
      overrides['semantic'] = {
        primaryColor: 'red',
      }
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="test|test-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color:red;}}`
      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))

    it('should accept Promise with overrides', fakeAsync(() => {
      const overrides = Promise.resolve({
        semantic: {
          primaryColor: 'red',
        },
      })
      TestBed.configureTestingModule({
        providers: [
          {
            provide: DOCUMENT,
            useValue: documentMock,
          },
          provideAppStateServiceMock(),
          {
            provide: THEME_OVERRIDES,
            useValue: overrides,
          },
        ],
      })
      service = TestBed.inject(CustomUseStyle)
      const appStateService = TestBed.inject(AppStateService)
      appStateService.currentMfe$.publish({
        appId: 'test-ui',
        productName: 'test',
      } as MfeInfo)

      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="test|test-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--test-test-ui-primary-color:red;}}`

      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))

    it('should accept function returning object with overrides', fakeAsync(() => {
      const overrides = () => {
        return {
          semantic: {
            primaryColor: 'red',
          },
        }
      }
      TestBed.configureTestingModule({
        providers: [
          {
            provide: DOCUMENT,
            useValue: documentMock,
          },
          provideAppStateServiceMock(),
          {
            provide: THEME_OVERRIDES,
            useValue: overrides,
          },
        ],
      })
      service = TestBed.inject(CustomUseStyle)
      const appStateService = TestBed.inject(AppStateService)
      appStateService.currentMfe$.publish({
        appId: 'test-ui',
        productName: 'test',
      } as MfeInfo)

      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="test|test-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--test-test-ui-primary-color:red;}}`

      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))

    it('should accept function returning Promise with overrides', fakeAsync(() => {
      const overrides = () =>
        Promise.resolve({
          semantic: {
            primaryColor: 'red',
          },
        })
      TestBed.configureTestingModule({
        providers: [
          {
            provide: DOCUMENT,
            useValue: documentMock,
          },
          provideAppStateServiceMock(),
          {
            provide: THEME_OVERRIDES,
            useValue: overrides,
          },
        ],
      })
      service = TestBed.inject(CustomUseStyle)
      const appStateService = TestBed.inject(AppStateService)
      appStateService.currentMfe$.publish({
        appId: 'test-ui',
        productName: 'test',
      } as MfeInfo)

      const regularCss = ":root{--p-primary-color: '#ababab';}"
      const expectedOverrideCss = `@scope([${dataStyleIdAttribute}="test|test-ui"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--test-test-ui-primary-color:red;}}`

      service.use(regularCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(2)
      expect(removeSpacesAndNewlines(styleList.at(1)?.textContent)).toEqual(
        removeSpacesAndNewlines(expectedOverrideCss)
      )
    }))
  })

  describe('style element update', () => {
    it('should update existing style tag wih new css', fakeAsync(() => {
      const { styleId, prefix } = configureMfe()
      const css = ":root{--p-primary-color: '#ababab'}"
      const expectedCss = `@scope([${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color: '#ababab'}}`

      service.use(css, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(expectedCss))

      const newCss = ":root{--p-primary-color: '#aabbcc'}"
      const newExpectedCss = `@scope([${dataStyleIdAttribute}="${styleId}"][${dataNoPortalLayoutStylesAttribute}]) to ([${dataStyleIsolationAttribute}]){:scope{--${prefix}-primary-color: '#aabbcc'}}`

      service.use(newCss, {
        name: 'semantic-variables',
      })

      tick(100)
      expect(styleList.length).toBe(1)
      expect(removeSpacesAndNewlines(styleList.at(0)?.textContent)).toEqual(removeSpacesAndNewlines(newExpectedCss))
    }))
  })
})

```

File : custom-use-style.service.ts
```ts
import { Inject, Injectable, Optional } from '@angular/core'
import { UseStyle } from 'primeng/usestyle'
import { AppStateService } from '@onecx/angular-integration-interface'
import { ReplaySubject } from 'rxjs'
import { THEME_OVERRIDES, ThemeOverrides } from '../utils/application-config'
import { REMOTE_COMPONENT_CONFIG, SKIP_STYLE_SCOPING } from '@onecx/angular-utils'
import { RemoteComponentConfig } from '@onecx/angular-utils'
import { toVariables } from '@primeuix/styled'
import {
  dataVariableOverrideIdAttribute,
  getScopeIdentifier,
  replacePrimengPrefix,
  scopePrimengCss,
  shellScopeId,
} from '@onecx/angular-utils'
import { replaceRootWithScope } from '@onecx/angular-utils/style'

@Injectable({ providedIn: 'any' })
export class CustomUseStyle extends UseStyle {
  constructor(
    private appStateService: AppStateService,
    @Optional() @Inject(SKIP_STYLE_SCOPING) private skipStyleScoping?: boolean,
    @Optional() @Inject(REMOTE_COMPONENT_CONFIG) private remoteComponentConfig?: ReplaySubject<RemoteComponentConfig>,
    @Optional() @Inject(THEME_OVERRIDES) private themeOverrides?: ThemeOverrides
  ) {
    super()
  }
  // PrimeNg defines CSS variables and styles globally in <style> elements
  // Each Application needs to isolate the CSS variables and styles from others
  override use(css: any, options?: any): { id: any; name: any; el: any; css: any } {
    getScopeIdentifier(this.appStateService, this.skipStyleScoping, this.remoteComponentConfig).then((scopeId) => {
      css = scopePrimengCss(replaceRootWithScope(replacePrimengPrefix(css, scopeId)), scopeId)

      options = {
        ...options,
        name: (options.name ?? '') + (scopeId === '' ? scopeId : '-' + scopeId),
      }
      super.use(css, options)
      return this.applyOverrides(scopeId)
    })
    // Result of this call is not used at the moment
    // Fake response ensures its possible to detect future usages of the result of this call
    return this.createFakeUseResponse(css, options)
  }

  private applyOverrides(scopeId: string): Promise<any> {
    if (!this.themeOverrides) return Promise.resolve()

    const overrides = Promise.resolve(
      typeof this.themeOverrides === 'function' ? this.themeOverrides() : this.themeOverrides
    )
    return overrides.then((resolvedOverrides) => {
      const variablesData = toVariables(resolvedOverrides)
      if (variablesData.value.length === 0) return

      const styleRef = this.createOrRetrieveOverrideElement(scopeId ? scopeId : shellScopeId)
      const prefixedOverrides = scopePrimengCss(
        replaceRootWithScope(replacePrimengPrefix(variablesData.css, scopeId)),
        scopeId
      )
      styleRef.textContent = prefixedOverrides
      // Always make sure it is the last child of the document head
      this.document.head.appendChild(styleRef)
    })
  }

  private createOrRetrieveOverrideElement(overrideId: string): Element {
    const styleRef =
      this.document.querySelector(`style[${dataVariableOverrideIdAttribute}="${overrideId}"]`) ||
      this.document.createElement('style')
    if (!styleRef.isConnected) {
      styleRef.setAttribute(`${dataVariableOverrideIdAttribute}`, overrideId)
    }
    return styleRef
  }

  private createFakeUseResponse(css: any, options: any) {
    const returnObject: {
      id: any
      css: any
      name: any
      el: any
    } = {
      id: options.id ?? undefined,
      css: css,
      name: undefined,
      el: undefined,
    }

    Object.defineProperties(returnObject, {
      name: {
        get() {
          console.error('Unexpected read of CustomUseStyle.use return value name')
          return undefined
        },
      },
      el: {
        get() {
          console.error('Unexpected read of CustomUseStyle.use return value el')
          return undefined
        },
      },
    })
    return returnObject
  }

  private isVariables(cssName: string) {
    return cssName.endsWith('-variables')
  }

  private isStyle(cssName: string) {
    return !this.isVariables(cssName)
  }
}

```


File : theme-configservice.spects
```ts
import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { ThemeConfigService } from './theme-config.service'
import { ThemeService } from '@onecx/angular-integration-interface'
import { FakeTopic } from '@onecx/accelerator'
import { PrimeNG } from 'primeng/config'
import defaultThemeVariables from '../preset/default-theme-variables'
import { SKIP_STYLE_SCOPING } from '@onecx/angular-utils'

describe('ThemeConfigService', () => {
  let service: ThemeConfigService
  const theme = {
    id: 'my-test-theme',
    properties: {
      general: {
        'primary-color': '#ababab',
      },
      font: {},
      topbar: {},
      sidebar: {},
    },
  }

  beforeEach(() => {
    const themeServiceMock = {
      currentTheme$: new FakeTopic(),
    }

    TestBed.configureTestingModule({
      providers: [
        ThemeConfigService,
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: SKIP_STYLE_SCOPING, useValue: true },
      ],
    })

    service = TestBed.inject(ThemeConfigService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should subscribe to currentThemeTopic$', fakeAsync(() => {
    const themeService = TestBed.inject(ThemeService)
    const spy = jest.spyOn(service, 'applyThemeVariables')

    themeService.currentTheme$.publish(theme)
    tick(100)
    expect(spy).toHaveBeenCalledWith(theme)
  }))

  it('should represent old values in the new theme configuration', fakeAsync(() => {
    const themeService = TestBed.inject(ThemeService)
    const primeng = TestBed.inject(PrimeNG)
    const spy = jest.spyOn(primeng, 'setThemeConfig')

    themeService.currentTheme$.publish(theme)
    tick(100)

    const args = spy.mock.calls.pop()
    expect((args?.[0] as any).theme.preset.semantic.primary['500']).toEqual(theme.properties.general['primary-color'])
    expect((args?.[0] as any).theme.preset.semantic.extend.onecx.topbar.bg.color).toEqual(
      defaultThemeVariables.topbar.topbarBgColor
    )
  }))
})

```


File : theme-configservice.ts
```ts
import { ENVIRONMENT_INITIALIZER, Injectable, inject } from '@angular/core'
import { ThemeService } from '@onecx/angular-integration-interface'
import { Theme as OneCXTheme } from '@onecx/integration-interface'
import { Base } from 'primeng/base'
import { PrimeNG } from 'primeng/config'
import ThemeConfig from '../utils/theme-config'
import { CustomUseStyle } from './custom-use-style.service'
import { UseStyle } from 'primeng/usestyle'
import { Theme } from '@primeuix/styled'
import { mergeDeep } from '@onecx/angular-utils'

export function provideThemeConfigService() {
  Theme.clearLoadedStyleNames()
  Base.clearLoadedStyleNames()
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory() {
        return () => inject(ThemeConfigService)
      },
    },
    ThemeConfigService,
    {
      provide: UseStyle,
      useClass: CustomUseStyle,
    },
  ]
}

@Injectable({
  providedIn: 'root',
})
export class ThemeConfigService {
  constructor(
    private themeService: ThemeService,
    private primeNG: PrimeNG
  ) {
    this.themeService.currentTheme$.subscribe((theme) => {
      this.applyThemeVariables(theme)
    })
  }

  async applyThemeVariables(oldTheme: OneCXTheme): Promise<void> {
    const oldThemeVariables = oldTheme.properties
    const themeConfig = new ThemeConfig(oldThemeVariables)
    const preset = await (await import('../preset/custom-preset')).CustomPreset
    this.primeNG.setThemeConfig({
      theme: {
        preset: mergeDeep(preset, themeConfig.getConfig()),
        options: { darkModeSelector: false },
      },
    })
  }
}

```


********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > angular-utils > theme > primeng > src > utils


File : app-styles-initializer.ts
```ts
import { inject, provideEnvironmentInitializer } from '@angular/core'
import { SKIP_STYLE_SCOPING } from '@onecx/angular-utils'
import { getScopeIdentifier, replacePrimengPrefix } from '@onecx/angular-utils'
import { AppStateService } from '@onecx/angular-integration-interface'
import { REMOTE_COMPONENT_CONFIG } from '@onecx/angular-utils'
import { getAppStyleByScope, replaceStyleContent } from '@onecx/angular-utils/style'

export function provideAppStylesInitializer() {
  return [provideEnvironmentInitializer(updateAppStyle)]
}

async function updateAppStyle() {
  const appStateService = inject(AppStateService)
  const skipStyleScoping = inject(SKIP_STYLE_SCOPING, { optional: true }) ?? undefined
  const remoteComponentConfig = inject(REMOTE_COMPONENT_CONFIG, { optional: true }) ?? undefined
  const scopeId = await getScopeIdentifier(appStateService, skipStyleScoping, remoteComponentConfig)

  const styleElement = getAppStyleByScope(scopeId)
  if (styleElement && styleElement.textContent) {
    replaceStyleContent(styleElement, replacePrimengPrefix(styleElement.textContent, scopeId))
  }
}

```


File : application-config.ts
```ts
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config'
import { provideThemeConfigService } from '../services/theme-config.service'
import { InjectionToken } from '@angular/core'
import { provideAppStylesInitializer } from './app-styles-initializer'

export type ThemeOverrides = (() => Promise<any> | any) | Promise<any> | any
export const THEME_OVERRIDES = new InjectionToken<ThemeOverrides>('THEME_OVERRIDES')

export interface ThemeConfigProviderOptions {
  overrides?: ThemeOverrides
}

export function provideThemeConfig(options?: ThemeConfigProviderOptions) {
  const dynamicProviders = []
  if (options?.overrides) {
    dynamicProviders.push({
      provide: THEME_OVERRIDES,
      useValue: options.overrides,
    })
  }
  return [
    provideAnimationsAsync(),
    providePrimeNG({}),
    provideThemeConfigService(),
    provideAppStylesInitializer(),
    ...dynamicProviders,
  ]
}

```


File : create-color-palettespec.ts
```ts
import {
  ColorAdjustment,
  adjustColor,
  colorDelta,
  createPalette,
  standardColorAdjustment,
} from './create-color-palette'
interface ColorPalette {
  [key: number]: string
}
const primeNGCyanColorPalette: ColorPalette = {
  50: '#ecfeff',
  100: '#cffafe',
  200: '#a5f3fc',
  300: '#67e8f9',
  400: '#22d3ee',
  500: '#06b6d4',
  600: '#0891b2',
  700: '#0e7490',
  800: '#155e75',
  900: '#164e63',
  950: '#083344',
}

const primeNGRedColorPalette: ColorPalette = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
  950: '#450a0a',
}
const primeNGOrangeColorPalette: ColorPalette = {
  50: '#fff7ed',
  100: '#ffedd5',
  200: '#fed7aa',
  300: '#fdba74',
  400: '#fb923c',
  500: '#f97316',
  600: '#ea580c',
  700: '#c2410c',
  800: '#9a3412',
  900: '#7c2d12',
  950: '#431407',
}

const primeNGGreenColorPalette: ColorPalette = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
  950: '#052e16',
}

describe('adjustColor', () => {
  it('should lighten the color when amount is positive', () => {
    expect(adjustColor('#000000', 50)).toBe('#323232')
  })

  it('should darken the color when amount is negative', () => {
    expect(adjustColor('#ffffff', -50)).toBe('#cdcdcd')
  })

  it('should handle colors without hash', () => {
    expect(adjustColor('000000', 50)).toBe('323232')
  })

  it('should handle edge cases for color values', () => {
    expect(adjustColor('#ff0000', 300)).toBe('#ffffff')
    expect(adjustColor('#00ff00', -300)).toBe('#000000')
  })
})

describe('createPalette', () => {
  const maximumDifference = 50
  const paletteKeys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  it('should create a cyan palette with adjusted colors', () => {
    const primaryColor = primeNGCyanColorPalette[500]
    const palette = createPalette(primaryColor, standardColorAdjustment)
    paletteKeys.forEach((key: number) => {
      console.log('###', key, colorDelta(palette[key], primeNGCyanColorPalette[key]))
      expect(colorDelta(palette[key], primeNGCyanColorPalette[key])).toBeLessThanOrEqual(maximumDifference)
    })
  })

  it('should create a red color palette with adjusted colors', () => {
    const primaryColor = primeNGRedColorPalette[500]
    const palette = createPalette(primaryColor, standardColorAdjustment)
    paletteKeys.forEach((key: number) => {
      expect(colorDelta(palette[key], primeNGRedColorPalette[key])).toBeLessThanOrEqual(maximumDifference)
    })
  })

  it('should create an orange color palette with adjusted colors', () => {
    const primaryColor = primeNGOrangeColorPalette[500]
    const palette = createPalette(primaryColor, standardColorAdjustment)

    paletteKeys.forEach((key: number) => {
      expect(colorDelta(palette[key], primeNGOrangeColorPalette[key])).toBeLessThanOrEqual(maximumDifference)
    })
  })

  it('should create a green color palette with adjusted colors', () => {
    const primaryColor = primeNGGreenColorPalette[500]
    const palette = createPalette(primaryColor, standardColorAdjustment)

    paletteKeys.forEach((key: number) => {
      expect(colorDelta(palette[key], primeNGGreenColorPalette[key])).toBeLessThanOrEqual(maximumDifference)
    })
  })
  it('should calculate the euclidic distance correctly', () => {
    const hexColorCode1 = '#ff0000'
    const hexColorCode2 = '#00ff00'
    expect(colorDelta(hexColorCode1, hexColorCode2)).toBeGreaterThan(100)
  })

  it('should create a custom palette', () => {
    const primaryColor = '#4169E1'
    const adjustmentValues: number[] = [210, 195, 150, 98, 20, -25, -65, -80, -110, -140]
    const adjustments: ColorAdjustment = {
      50: adjustmentValues[0],
      100: adjustmentValues[1],
      200: adjustmentValues[2],
      300: adjustmentValues[3],
      400: adjustmentValues[4],
      500: adjustmentValues[5],
      600: adjustmentValues[6],
      700: adjustmentValues[7],
      800: adjustmentValues[8],
      900: adjustmentValues[9],
      950: adjustmentValues[10],
    }
    const exampleColorPalette: ColorPalette = Object.keys(adjustments).reduce((palette, key) => {
      palette[Number(key)] = adjustColor(primaryColor, adjustments[Number(key)])
      return palette
    }, {} as ColorPalette)

    const palette = createPalette(primaryColor, adjustments)
    console.log(palette)
    expect(palette).toEqual(exampleColorPalette)
  })

  it('should calculate the Euclidean distance between two colors in RGB space', () => {
    const color1 = '#FFFFFF'
    const color2 = '#000000'
    const result = colorDelta(color1, color2)
    expect(result).toBeCloseTo(441.67, 2)
  })

  it('should calculate the distance between two similar colors', () => {
    const color1 = '#123456'
    const color2 = '#123457'
    const result = colorDelta(color1, color2)
    expect(result).toBeCloseTo(1, 2)
  })
})

```


File : create-color-palette.ts
```ts
export interface ColorAdjustment {
  [key: number]: number
}

export const standardColorAdjustment: ColorAdjustment = {
  50: 210,
  100: 195,
  200: 150,
  300: 98,
  400: 20,
  500: 0,
  600: -25,
  700: -65,
  800: -80,
  900: -110,
  950: -140,
}

/**
 * Adjusts the color by lightening or darkening it based on the provided offset.
 *
 * @param {string} color - A string representing the color in hexadecimal format (e.g., "#RRGGBB").
 * @param {number} channelOffset - A number indicating how much to lighten or darken the color.
 *                                 Positive values lighten the color, while negative values darken it.
 *                                 Valid values range from -255 to 255.
 * @returns {string} - The adjusted color in hexadecimal format.
 */
export function adjustColor(color: string, channelOffSet: number): string {
  let colorBeginsWithHash = false

  if (color[0] === '#') {
    color = color.slice(1)
    colorBeginsWithHash = true
  }

  const num = parseInt(color, 16)

  let r = (num >> 16) + channelOffSet
  if (r > 255) r = 255
  else if (r < 0) r = 0

  let g = ((num >> 8) & 0x00ff) + channelOffSet
  if (g > 255) g = 255
  else if (g < 0) g = 0

  let b = (num & 0x0000ff) + channelOffSet
  if (b > 255) b = 255
  else if (b < 0) b = 0

  return (colorBeginsWithHash ? '#' : '') + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
}

export function createPalette(primaryColor: string, adjustments: ColorAdjustment): { [key: number]: string } {
  const palette: { [key: number]: string } = {}
  Object.keys(adjustments).forEach((key) => {
    const entry = parseInt(key, 10)
    palette[entry] = adjustColor(primaryColor, adjustments[entry])
  })
  return palette
}

/**
 * Calculates the Euclidean distance between two colors in RGB space.
 *
 * @param {string} color1 - A string representing the first color in hexadecimal format (e.g., "#RRGGBB").
 * @param {string} color2 - A string representing the second color in hexadecimal format (e.g., "#RRGGBB").
 * @returns {number} - The Euclidean distance between the two colors.
 */
export function colorDelta(color1: string, color2: string): number {
  function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const color = hex.startsWith('#') ? hex.slice(1) : hex
    const bigint = parseInt(color, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return { r, g, b }
  }

  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  const delta = Math.sqrt(Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2))

  return delta
}

```


File : normalize-preset-keys.utils.spec.ts
```ts
import { normalizeKeys } from './normalize-preset-keys.utils'

describe('normalizeKeys', () => {
  it('should handle keys with multiple camelCase segments and leave the value as it is', () => {
    const input = { veryDeepCamelCaseKey: '{general.textSecondaryColor}' }
    const expected = {
      very: {
        deep: {
          camel: {
            case: {
              key: '{general.textSecondaryColor}',
            },
          },
        },
      },
    }
    expect(normalizeKeys(input)).toEqual(expected)
  })

  it('should preserve the colorScheme key as-is because it is excluded', () => {
    const input = {
      colorScheme: {
        primaryColor: '#123456',
        secondaryColor: '#654321',
      },
    }

    const expected = {
      colorScheme: {
        primary: { color: '#123456' },
        secondary: { color: '#654321' },
      },
    }

    expect(normalizeKeys(input)).toEqual(expected)
  })

  it('normalizes flat camelCase keys', () => {
    const input = { hoverColor: '#fff' }
    const output = normalizeKeys(input)
    expect(output).toEqual({ hover: { color: '#fff' } })
  })

  it('normalizes nested camelCase keys', () => {
    const input = {
      hoverColor: {
        backgroundColor: '#eee',
      },
    }
    const output = normalizeKeys(input)
    expect(output).toEqual({
      hover: {
        color: {
          background: { color: '#eee' },
        },
      },
    })
  })

  it('handles mixed keys correctly', () => {
    const input = {
      hoverColor: '#fff',
      primitive: {
        baseColor: '#000',
      },
    }
    const output = normalizeKeys(input)
    expect(output).toEqual({
      hover: { color: '#fff' },
      primitive: { base: { color: '#000' } },
    })
  })
})

```


File : normalize-preset-keys.utils.ts
```ts
import { isObject } from '@onecx/angular-utils'

// taken from primeng https://github.com/primefaces/primeuix/blob/main/packages/styled/src/config/index.ts#L9
const excludedKeyRegex =
  /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/i

// taken from primeng https://github.com/primefaces/primeuix/blob/main/packages/utils/src/object/methods/matchRegex.ts
function matchRegex(str: string, regex?: RegExp): boolean {
  if (regex) {
    const match = regex.test(str)

    regex.lastIndex = 0

    return match
  }
  return false
}

/**
 * Splits a camelCase string into an array of lowercase segments.
 * For example, "hoverColor" becomes ["hover", "color"].
 *
 * @param key - The camelCase string to split.
 * @returns An array of lowercase segments.
 */
function splitCamelCase(key: string): string[] {
  return key
    .replace(/([a-z])([A-Z])/g, '$1.$2')
    .toLowerCase()
    .split('.')
}

/**
 * Recursively normalizes the keys of an object by converting camelCase keys into nested objects.
 * Keys matching an excluded pattern are preserved as-is.
 * Non-object values are returned unchanged.
 *
 * @param obj - The input object to normalize.
 * @returns A new object with normalized (nested) keys.
 */
export function normalizeKeys(obj: any): Record<string, any> {
  if (!isObject(obj)) return obj

  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(obj)) {
    processKey(result, key, value)
  }

  return result
}

/**
 * Processes a key-value pair by normalizing its value and inserting it into a nested object structure.
 * If the key matches an excluded pattern, it is added to the result as-is.
 * Otherwise, the camelCase key is split into segments and the value is inserted accordingly.
 *
 * @param result - The object to insert the processed key-value pair into.
 * @param key - The key to process, potentially in camelCase.
 * @param value - The value associated with the key, which may be recursively normalized.
 */
function processKey(result: Record<string, any>, key: string, value: any) {
  const normalizedValue = normalizeKeys(value)

  if (matchRegex(key, excludedKeyRegex)) {
    result[key] = normalizedValue
    return
  }

  const decomposedKey = splitCamelCase(key)
  insertNestedValue(result, decomposedKey, normalizedValue)
}

/**
 * Inserts a value into a nested object structure based on a path of key segments.
 * Creates intermediate objects as needed to ensure the full path exists.
 *
 * @param result - The object to insert the value into.
 * @param path - An array of strings representing the nested key path (e.g., ['item', 'hover', 'color']).
 * @param value - The value to assign at the final path segment.
 *
 * @example
 * const obj = {}
 * insertNestedValue(obj, ['item,', 'hover', 'color'], '#ff0000')
 * Result: { item: { hover: { color: '#ff0000' } } }
 */
function insertNestedValue(result: Record<string, any>, decomposedKey: string[], value: any) {
  let current = result

  decomposedKey.forEach((segment, index) => {
    const isLast = index === decomposedKey.length - 1

    if (isLast) {
      // If it's the last segment, assign the value directly: { key: value }
      current[segment] = value
    } else {
      // If the segment does not exist, create an empty object: { key: {} }
      current[segment] ??= {}
      // Move to the next level in the nested structure: {}
      current = current[segment]
    }
  })
}

```


File : theme-configspec.ts
```ts
import { TestBed } from '@angular/core/testing'
import ThemeConfig from './theme-config'

describe('ThemeConfig', () => {
  const themeVariables = {
    general: {
      'primary-color': '#ababab',
    },
    font: {
      'font-size': '14px',
    },
    topbar: {},
    sidebar: {},
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    })
  })

  it('should generate config object with normalized variables', () => {
    const themeConfig = new ThemeConfig(themeVariables)

    const result = themeConfig.getConfig()
    expect(result['semantic'].extend.onecx).toEqual({
      primary: { color: '#ababab' },
      font: { size: '14px' },
    })
  })
})

```


File : theme-config.ts
```ts
import { createPalette, standardColorAdjustment } from './create-color-palette'
import { normalizeKeys } from './normalize-preset-keys.utils'

interface ThemeVariables {
  [key: string]: {
    [key: string]: string
  }
}
export default class ThemeConfig {
  constructor(private themeVariables: ThemeVariables | undefined) {
    // ThemeVariables are saved in kebab case but PrimeNg expects camel case
    this.themeVariables = this.transformVariablesToCamelCase(this.themeVariables ?? {})
  }

  getConfig() {
    const primaryColor = (this.themeVariables as any)['general']['primaryColor']
    return normalizeKeys({
      semantic: {
        extend: {
          onecx: {
            ...(this.themeVariables as any)['font'],
            ...(this.themeVariables as any)['topbar'],
            ...(this.themeVariables as any)['sidebar'],
            ...(this.themeVariables as any)['general'],
          },
        },
        primary: {
          ...createPalette(primaryColor, standardColorAdjustment),
        },
        colorScheme: {
          light: {
            primary: {
              ...createPalette(primaryColor, standardColorAdjustment),
            },
          },
        },
      },
    })
  }

  private transformVariablesToCamelCase(themeVariables: ThemeVariables) {
    const transformedThemeVariables: ThemeVariables = {}
    for (const section in themeVariables) {
      const sectionCamelCaseKey = this.toCamelCase(section)
      transformedThemeVariables[sectionCamelCaseKey] = this.transformSectionToCamelCase(
        themeVariables[sectionCamelCaseKey]
      )
    }
    return transformedThemeVariables
  }

  private transformSectionToCamelCase(section: { [key: string]: string }): { [key: string]: string } {
    const transformedSectionThemeVariables: { [key: string]: string } = {}
    for (const themeVariable in section) {
      const themeVariableCamelCase = this.toCamelCase(themeVariable)
      transformedSectionThemeVariables[themeVariableCamelCase] = section[themeVariable]
    }
    return transformedSectionThemeVariables
  }

  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
  }
}

```



********************************************************************************************************************************