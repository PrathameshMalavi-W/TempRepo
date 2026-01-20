#libs-Folder => onecx-shell-ui

********************************************************************************************************************************

FIle => onecx-shell-ui > src > index-html.ts


```ts
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>OneCX Portal</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII="
      rel="icon"
      type="image/x-icon"
    />
    <!-- Force browser to use only light mode -->
    <style>
      :root {
        color-scheme: only light !important;
      }
    </style>
  </head>
  <body>
    <ocx-shell-root data-style-isolation data-style-id="shell-ui" data-no-portal-layout-styles></ocx-shell-root>
    <div class="splash">
      <div class="splash-content flex flex-column align-items-center gap-2">
        <h1>Welcome</h1>
        <svg class="splash-loader" width="60px" height="60px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
          <circle
            class="splash-path"
            fill="none"
            stroke-width="6"
            stroke-linecap="round"
            cx="33"
            cy="33"
            r="25"
          ></circle>
        </svg>
      </div>
    </div>
  </body>
</html>
```


********************************************************************************************************************************

FIle => onecx-shell-ui > src > splash.scss


```scss
@keyframes rotator {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(270deg);
  }
}

@keyframes colors {
  0% {
    stroke: #4285f4;
  }
  25% {
    stroke: #de3e35;
  }
  50% {
    stroke: #f7c223;
  }
  75% {
    stroke: #1b9a59;
  }
  100% {
    stroke: #4285f4;
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 187;
  }
  50% {
    stroke-dashoffset: 46.75;
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: 187;
    transform: rotate(450deg);
  }
}

ocx-shell-root + .splash {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  width: 100vw;
  height: 100vh;
  display: none;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #555;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  .splash-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    .splash-loader {
      animation: rotator 1.4s linear infinite;
      .splash-path {
        stroke-dasharray: 187;
        stroke-dashoffset: 0;
        transform-origin: center;
        animation:
          dash 1.4s ease-in-out infinite,
          colors 5.6s ease-in-out infinite;
      }
    }
  }
}

ocx-shell-root:empty + .splash {
  display: flex;
  opacity: 1;
}

```


********************************************************************************************************************************

FIle => onecx-shell-ui  > src > shell -styles.scss


```scss
/*
  Style sheet for shell styles.
  This file should ONLY contain styles that are meant to be applied FOR SHELL'S CONTENT.
  Shell is going to load this style sheet with a style tag on the startup and scope the styles to the Shell app only.

  IMPORTANT: Styles defined in this file will be applied only to the children of the ocx-shell-root element.

  To define global styles, please refer to global-styles.scss.
*/
@import 'node_modules/primeflex/primeflex.scss';
@import 'node_modules/primeicons/primeicons.css';

.onecx-body {
  display: flex;
  flex-direction: column;
  position: relative;
  flex-grow: 1;
}

// Important for allowing MFEs to grow and fill the available space
.onecx-body > ng-component {
  flex-grow: 1;
}

// Important for allowing MFEs to grow and fill the available space
.webcomponentwrapper {
  height: 100%;
}

```



********************************************************************************************************************************

FIle => onecx-shell-ui  > src > portal-layout-styles.scss


```scss
// Imports for portal layout styles crucial variables and styles.
// Not importing theme default variables! Those are imported via 'node_modules/@onecx/portal-layout-styles/src/styles/shell/theme_defaults.scss' on App initialization

// Portal layout styles depend on primeflex and primeicons
@import 'node_modules/primeflex/primeflex.scss';
@import 'node_modules/primeicons/primeicons.css';

@import 'node_modules/@onecx/portal-layout-styles/src/styles/shell/shell.scss';
@import 'node_modules/@onecx/portal-layout-styles/src/styles/primeng/theme-light.scss';
@import 'node_modules/@onecx/portal-layout-styles/src/styles/primeng/primeng.css';

```


********************************************************************************************************************************

FIle => onecx-shell-ui  > src > global-styles.scss >


```scss
/*
  Style sheet for global styles.
  This file should ONLY contain styles that are meant to be applied GLOBALLY.
  Shell is going to load this style sheet with a link tag on the startup.

  To define styles for Shell only, please refer to shell-styles.scss.
*/

// Import theme_defaults so default theme variables are available on the page
@import 'node_modules/@onecx/portal-layout-styles/src/styles/shell/theme_defaults.scss';

$mobileBreakpoint: 991px !default;
:root {
  --mobile-break-point: #{$mobileBreakpoint};
  font-size: var(--font-size, var(--font-size-default));
}

body {
  font-family: var(--font-family, var(--font-family-default));
  overflow: hidden;
  background-color: var(--body-bg-color, var(--body-bg-color-default));
  color: var(--text-color, var(--text-color-default));
  padding: 0;
  margin: 0;
  min-height: 100%;

  a {
    text-decoration: none;
    color: var(--text-secondary-color, var(--text-secondary-color-default));
  }
}

// disable default settings of dialogs created by portal dialog service
.buttonDialogScrollableContent {
  overflow: unset;
  max-height: unset !important;
  margin-bottom: 1rem !important;
}


```


********************************************************************************************************************************

FIle => onecx-shell-ui  > src > main.ts


```ts
import {
  angular18Preloader,
  angular19Preloader,
  angular20Preloader,
  ensurePreloaderModuleLoaded,
  loadPreloaderModule
} from './app/shell/utils/preloader.utils'

window['onecxPreloaders'] ??= {}
const preloaders = [angular18Preloader, angular19Preloader, angular20Preloader]

Promise.all([...preloaders.map(loadPreloaderModule), ...preloaders.map(ensurePreloaderModuleLoaded)]).then(() => {
  return import('./bootstrap').catch((err) => console.error(err))
})

```

********************************************************************************************************************************

FIle => onecx-shell-ui  > src > bootstrap.ts


```ts
import { bootstrapModule } from '@onecx/angular-webcomponents'
import { Capability, ShellCapabilityService } from '@onecx/angular-integration-interface'
import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

ShellCapabilityService.setCapabilities([
  Capability.PARAMETERS_TOPIC,
  Capability.CURRENT_LOCATION_TOPIC,
  Capability.ACTIVENESS_AWARE_MENUS
])
bootstrapModule(AppModule, 'shell', environment.production)
```



********************************************************************************************************************************

FIle => onecx-shell-ui  > src > scope-polyfill > css-style-sheet-updater.ts


```ts
import { MutationData, OcxCSSStyleSheet, SelectorPresenceMap } from './data'
import {
  animationNameValueRegex,
  appendToUniqueSelectors,
  computeRootSelectorsForElements,
  findSupportsRule,
  matchScope,
  normalize,
  removePseudoElements,
  scopeFromToUniqueId,
  splitSelectorToSubSelectors,
  supportsConditionTextToScopeRuleText
} from './utils'

export class CssStyleSheetHandler {
  //-------------------------Scope sheet creation-------------------------
  /**
   * Transforms style sheet to scoped style sheet that implements the OcxCSSStyleSheet interface.
   */
  static changeToScopedSheet(sheetWithSupportsRule: CSSStyleSheet) {
    const supportsRule = findSupportsRule(sheetWithSupportsRule)
    if (!supportsRule) {
      console.warn('Expected style sheet with supports rule, but received one without any.')
      return
    }

    const [match, from, to] = matchScope(supportsConditionTextToScopeRuleText(supportsRule.conditionText)) ?? []
    if (!match) {
      console.warn('Expected to have a scoped sheet for:', sheetWithSupportsRule)
      return
    }
    // Save data about the scope so we can access it later and not recompute
    // Save data about the scope so we can access it later and not recompute
    // @typescript-eslint/no-extra-semi
    ;(sheetWithSupportsRule as OcxCSSStyleSheet).ownerNode.ocxMatch = normalize(match)
    ;(sheetWithSupportsRule as OcxCSSStyleSheet).ownerNode.ocxFrom = normalize(from)
    ;(sheetWithSupportsRule as OcxCSSStyleSheet).ownerNode.ocxTo = normalize(to)
    ;(sheetWithSupportsRule as OcxCSSStyleSheet).ownerNode.ocxScopeUniqueId = scopeFromToUniqueId(normalize(from))
    ;(sheetWithSupportsRule as OcxCSSStyleSheet).ownerNode.ocxKeyFrames = []

    this.moveSupportsRulesToTopLevelAndApplyInitialScope(sheetWithSupportsRule as OcxCSSStyleSheet)
  }

  /**
   * Deconstructs supports css rule so every scoped rule is available in the browser in a scoped manner initially with references to 0 elements.
   */
  private static moveSupportsRulesToTopLevelAndApplyInitialScope(sheet: OcxCSSStyleSheet) {
    const supportsRule = findSupportsRule(sheet)
    if (!supportsRule) return

    sheet.deleteRule(Array.from(sheet.cssRules).findIndex((rule) => rule === supportsRule))
    for (const supportsChildRule of Array.from(supportsRule.cssRules)) {
      sheet.insertRule(
        this.createSheetDefaultRuleText(supportsChildRule, sheet),
        sheet.cssRules.length <= 0 ? 0 : sheet.cssRules.length
      )
    }

    // Save the original selector data for making updates
    for (const rule of Array.from(sheet.cssRules)) {
      this.setOcxSelectorText(rule)
    }
  }

  private static createSheetDefaultRuleText(rule: CSSRule, sheet: OcxCSSStyleSheet) {
    if (rule instanceof CSSLayerBlockRule) {
      return this.createSheetDefaultLayerRuleText(rule, sheet)
    } else if (rule instanceof CSSMediaRule) {
      return this.createSheetDefaultMediaRuleText(rule, sheet)
    } else if (rule instanceof CSSKeyframesRule) {
      return this.createSheetDefaultKeyframesRuleText(rule, sheet)
    } else if ((rule as any).selectorText === undefined) {
      // Fallback to all Rules that are not covered
      return rule.cssText
    }

    return this.createSheetDefaultStyleRuleText(rule as CSSStyleRule & CSSGroupingRule, sheet)
  }

  private static createSheetDefaultLayerRuleText(rule: CSSLayerBlockRule, sheet: OcxCSSStyleSheet) {
    let layerCss = ''
    for (const layerChildRule of Array.from(rule.cssRules)) {
      const ruleText = this.createSheetDefaultRuleText(layerChildRule, sheet)
      layerCss = `${layerCss}${ruleText}`
    }
    return `@layer ${rule.name} {${layerCss}}`
  }

  private static createSheetDefaultMediaRuleText(rule: CSSMediaRule, sheet: OcxCSSStyleSheet) {
    let mediaCss = ''
    for (const mediaChildRule of Array.from(rule.cssRules)) {
      const ruleText = this.createSheetDefaultRuleText(mediaChildRule, sheet)
      mediaCss = `${mediaCss}${ruleText}`
    }
    return `@media ${rule.conditionText} {${mediaCss}}`
  }

  private static createSheetDefaultKeyframesRuleText(rule: CSSKeyframesRule, sheet: OcxCSSStyleSheet) {
    sheet.ownerNode.ocxKeyFrames.push(rule.name)
    return rule.cssText.replace(rule.name, this.applyScopeUniqueId(rule.name, sheet))
  }

  private static createSheetDefaultStyleRuleText(rule: CSSStyleRule & CSSGroupingRule, sheet: OcxCSSStyleSheet) {
    let childrenCss = ''
    for (const styleChildRule of Array.from(rule.cssRules).filter((rule) => rule.cssText)) {
      const ruleText = this.createSheetDefaultRuleText(styleChildRule, sheet)
      childrenCss = `${childrenCss}${ruleText}`
    }
    return this.constructStyleRuleText(rule, childrenCss, sheet)
  }

  private static constructStyleRuleText(rule: CSSStyleRule, childrenCss: string, sheet: OcxCSSStyleSheet) {
    if (childrenCss) {
      let ruleStyleText = rule.style.cssText
      if (ruleStyleText) ruleStyleText = this.applyAnimationChangesToCssText(ruleStyleText, sheet)
      return `${this.constructDefaultSelector(rule)} {${ruleStyleText}${childrenCss}}`
    }

    const updatedRuleText = rule.cssText.replace(rule.selectorText, this.constructDefaultSelector(rule))
    return this.applyAnimationChangesToCssText(updatedRuleText, sheet)
  }

  private static constructDefaultSelector(rule: CSSStyleRule) {
    if (rule.selectorText === ':scope') return `${rule.selectorText}:where(0)`
    return appendToUniqueSelectors(rule.selectorText, ':where(0)')
  }

  private static applyAnimationChangesToCssText(cssText: string, sheet: OcxCSSStyleSheet) {
    return cssText.replace(animationNameValueRegex, (match, p1) => {
      let animationName = p1
      if (sheet.ownerNode.ocxKeyFrames.includes(p1)) {
        animationName = this.applyScopeUniqueId(animationName, sheet)
      }
      return `animation-name: ${animationName}`
    })
  }

  private static applyScopeUniqueId(text: string, sheet: OcxCSSStyleSheet) {
    return `${text}-${sheet.ownerNode.ocxScopeUniqueId}`
  }

  private static setOcxSelectorText(rule: CSSRule) {
    const ruleSelectorText = (rule as any).selectorText
    if (ruleSelectorText) {
      const selectorText = this.constructOriginalSelector(ruleSelectorText)
      ;(rule as any).ocxSelectorText = selectorText
      ;(rule as any).ocxQuerySelectorText = removePseudoElements(selectorText)
    }
    for (const child of (rule as any).cssRules ?? []) {
      this.setOcxSelectorText(child)
    }
  }

  private static constructOriginalSelector(selectorText: string) {
    // Parse the current selector and remove any scoping
    if (selectorText === '') return ''

    let result = ''
    let depth = 0
    let i = 0
    while (i < selectorText.length) {
      if (selectorText.slice(i, i + 7) === ':where(') {
        if (i == 0 || [' ', '+', '>', '~'].includes(selectorText[i - 1])) {
          result += '*'
        }
        depth++
        i += 6 // Skip ':where('
      } else if (selectorText[i] === '(' && depth > 0) {
        depth++
      } else if (selectorText[i] === ')' && depth > 0) {
        depth--
      } else if (depth === 0) {
        result += selectorText[i]
      }
      i++
    }
    return result === '' ? '*' : result
  }
  //-------------------------Scope sheet creation-------------------------

  //-------------------------Scope sheet update-------------------------
  static updateScopedSheet(sheet: OcxCSSStyleSheet, mutationData: MutationData, cachedSelectors: SelectorPresenceMap) {
    const nodesMatchingFromSelector = Array.from(document.querySelectorAll(normalize(sheet.ownerNode.ocxFrom)))

    for (const cssRule of Array.from(sheet.cssRules)) {
      this.updateRule(cssRule, nodesMatchingFromSelector, sheet, mutationData, cachedSelectors)
    }

    // Mark sheet as updated by polyfill
    sheet.ownerNode.dataset['adaptedByPolyfillInMemory'] = ''
  }

  private static updateRule(
    cssRule: CSSRule,
    fromNodes: Element[],
    sheet: OcxCSSStyleSheet,
    mutationData: MutationData,
    cachedSelectors: SelectorPresenceMap
  ) {
    if (cssRule instanceof CSSLayerBlockRule) {
      this.updateLayerRule(cssRule, fromNodes, sheet, mutationData, cachedSelectors)
    } else if (cssRule instanceof CSSMediaRule) {
      this.updateMediaRule(cssRule, fromNodes, sheet, mutationData, cachedSelectors)
    } else if (cssRule instanceof CSSStyleRule) {
      this.updateStyleRule(cssRule as CSSStyleRule & CSSGroupingRule, fromNodes, sheet, mutationData, cachedSelectors)
    }
  }

  private static updateLayerRule(
    cssRule: CSSLayerBlockRule,
    fromNodes: Element[],
    sheet: OcxCSSStyleSheet,
    mutationData: MutationData,
    cachedSelectors: SelectorPresenceMap
  ) {
    for (const layerChildRule of Array.from(cssRule.cssRules)) {
      this.updateRule(layerChildRule, fromNodes, sheet, mutationData, cachedSelectors)
    }
  }

  private static updateMediaRule(
    cssRule: CSSMediaRule,
    fromNodes: Element[],
    sheet: OcxCSSStyleSheet,
    mutationData: MutationData,
    cachedSelectors: SelectorPresenceMap
  ) {
    for (const mediaChildRule of Array.from(cssRule.cssRules)) {
      this.updateRule(mediaChildRule, fromNodes, sheet, mutationData, cachedSelectors)
    }
  }

  /**
   * Validate if rule requires an update. If yes then find all elements in the scope that match the rule's selector and update the selector
   */
  private static updateStyleRule(
    cssRule: CSSStyleRule & CSSGroupingRule,
    fromNodes: Element[],
    sheet: OcxCSSStyleSheet,
    mutationData: MutationData,
    cachedSelectors: SelectorPresenceMap
  ) {
    const originalQuerySelectorText = (cssRule as any).ocxQuerySelectorText
    if (originalQuerySelectorText === undefined) return
    // Special case for styles that have to be applied for the @scope root
    if (originalQuerySelectorText === ':scope') {
      return this.updateScopeSelector(cssRule, fromNodes, sheet, mutationData, cachedSelectors)
    }

    if (
      mutationData.skipMutationCheck
        ? true
        : this.doesRuleRequireUpdate(originalQuerySelectorText, mutationData.mutatedElements, cachedSelectors)
    ) {
      this.updateElementsMatchingSelectorsInScope(cssRule, fromNodes, sheet)
      for (const child of Array.from(cssRule?.cssRules) ?? []) {
        this.updateRule(child, fromNodes, sheet, mutationData, cachedSelectors)
      }
    }
  }

  private static updateScopeSelector(
    cssRule: CSSStyleRule & CSSGroupingRule,
    fromNodes: Element[],
    sheet: OcxCSSStyleSheet,
    mutationData: MutationData,
    cachedSelectors: SelectorPresenceMap
  ) {
    // :scope selector has to be replaced with the selection of found @scope root elements
    // e.g., :scope {} -> :where(:nth-child(1) > :nth-child(2)) {}
    cssRule.selectorText = computeRootSelectorsForElements(fromNodes).join(', ')
    this.updateStyleRuleChildren(cssRule, fromNodes, sheet, mutationData, cachedSelectors)
  }

  private static updateStyleRuleChildren(
    cssRule: CSSStyleRule & CSSGroupingRule,
    fromNodes: Element[],
    sheet: OcxCSSStyleSheet,
    mutationData: MutationData,
    cachedSelectors: SelectorPresenceMap
  ) {
    for (const child of Array.from(cssRule?.cssRules) ?? []) {
      this.updateRule(child, fromNodes, sheet, mutationData, cachedSelectors)
    }
  }

  // If any subselector is fully matched the rule has to be updated
  private static doesRuleRequireUpdate(
    selectorText: string,
    mutatedElements: Element[],
    cachedSelectors: SelectorPresenceMap
  ): boolean {
    const subSelectorsList = splitSelectorToSubSelectors(selectorText)
    return subSelectorsList.some((subSelectorList) => {
      for (const subSelector of subSelectorList) {
        let isApplicable = cachedSelectors.get(subSelector)
        if (isApplicable === undefined) {
          isApplicable =
            mutatedElements.length === 0
              ? true
              : mutatedElements.some((element) => element.querySelector(subSelector) !== null)
          cachedSelectors.set(subSelector, isApplicable)
        }
        if (!isApplicable) return false
      }
      return true
    })
  }

  // Find all elements matching the selector in scope and replace rule selector
  private static updateElementsMatchingSelectorsInScope(
    cssStyleRule: CSSStyleRule,
    searchStartElements: Array<Element>,
    sheet: OcxCSSStyleSheet
  ) {
    const originalQuerySelectorText = (cssStyleRule as any).ocxQuerySelectorText
    const originalSelectorText = (cssStyleRule as any).ocxSelectorText
    const elementsMatchingSelector = searchStartElements
      .map((from) =>
        from.querySelectorAll(':is(' + originalQuerySelectorText + '):not(:scope :is(' + sheet.ownerNode.ocxTo + ') *)')
      )
      .flatMap((nodeList) => Array.from(nodeList))
    const elementsRootSelectors = computeRootSelectorsForElements(elementsMatchingSelector)
    const whereSelector = elementsRootSelectors.length > 0 ? elementsRootSelectors.join(', ') : '0'
    cssStyleRule.selectorText = appendToUniqueSelectors(originalSelectorText, `:where(${whereSelector})`)
  }
  //-------------------------Scope sheet update-------------------------
}


```





********************************************************************************************************************************

FIle => onecx-shell-ui  > src > scope-polyfill > data.ts

```ts
export interface CssStyleSheetWithSupportsRule {
  sheet: CSSStyleSheet
  ownerNode: HTMLElement
  supportsRule: CSSSupportsRule
}

export type SelectorPresenceMap = Map<string, boolean>
export type ScopeSelectorPresenceMap = Map<string, SelectorPresenceMap>

export interface OcxOwnerNode extends HTMLStyleElement {
  ocxMatch: string
  ocxFrom: string
  ocxTo: string
  ocxScopeUniqueId: string
  ocxKeyFrames: string[]
}

export interface OcxCSSStyleSheet extends CSSStyleSheet {
  ownerNode: OcxOwnerNode
}

export interface MutationData {
  mutatedElements: Element[]
  skipMutationCheck: boolean
}

```





********************************************************************************************************************************

FIle => onecx-shell-ui  > src > scope-polyfill > polyfill.ts


```ts
import { CssStyleSheetHandler } from './css-style-sheet-updater'
import { OcxCSSStyleSheet, OcxOwnerNode, ScopeSelectorPresenceMap, SelectorPresenceMap } from './data'
import {
  dataStyleIdKey,
  containsSupportsRule,
  isScopedStyleSheet,
  mutationListToUniqueNodes,
  nodeToStyleIdSelectors,
  normalize,
  findSupportsRule,
  matchScope,
  supportsConditionTextToScopeRuleText
} from './utils'

const scopedSheetNodes = new Set()

/**
 * Applies if PRECISION mode is selected:
 * Scope polyfill is used when browser doesn't support @scope rule. This mode is performance-heavy but precise.
 */
export function applyPrecisionPolyfill() {
  applyScopePolyfill()
  overrideHtmlElementAppendAndClassChanges()
}

/**
 * Apply the scope polyfill.
 * The polyfill updates all scoped style sheets on a page based on the observed changes to the body of the document.
 * Any change in body of the document and its children related to attributes and the whole tree will cause the update.
 *
 * The polyfill assumes that:
 * - single style sheet is related to a single scope
 * - style sheet scoping is expressed by using the supports css rule wrapping scope supports rule, e.g., "@supports (@scope([data-style-id="shell-ui"]) to ([data-style-isolation]))"
 */
export function applyScopePolyfill() {
  if (typeof CSSScopeRule === 'undefined') {
    const observer = new MutationObserver((mutationList: MutationRecord[]) => updateStyleSheets(mutationList))
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true
    })
  }
}

/**
 * Applies if PERFORMANCE mode (default) is selected:
 * Does not use polyfill and allows potential leakage to reduce performance-heavy operations
 * Applies styles on the elements that are defined as "from" section of the @scope rule (e.g., "[data-style-id="shell-ui"][data-no-portal-layout-styles]")
 */
export function applyPerformancePolyfill() {
  if (typeof CSSScopeRule === 'undefined') {
    const observer = new MutationObserver((mutationList: MutationRecord[]) => {
      updateStyleSheetsForPerformanceMode(mutationList)
    })
    observer.observe(document.head, {
      subtree: true,
      childList: true,
      attributes: true
    })
    deconstructExistingStyleSheets()
  }
}

function updateStyleSheetsForPerformanceMode(mutationList: MutationRecord[]) {
  const styleElements = getStyleElementsToCheck(mutationList)
  for (const styleElement of styleElements) {
    deconstructScopeRule(styleElement)
  }
}

function getStyleElementsToCheck(mutationList: MutationRecord[]) {
  const styleElements: HTMLStyleElement[] = []
  for (const mutation of mutationList) {
    const nodesToCheck = [...Array.from(mutation.addedNodes), mutation.target]
    for (const node of nodesToCheck) {
      if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'STYLE') {
        styleElements.push(node as HTMLStyleElement)
      }
    }
  }
  return styleElements
}

/**
 * Deletes @supports rule from style sheet and reinserts rules at right position with matched scope as selector
 */
function deconstructScopeRule(styleElement: HTMLStyleElement) {
  if (!styleElement.sheet || !containsSupportsRule(styleElement.sheet)) return

  const supportsRule = findSupportsRule(styleElement.sheet)
  if (!supportsRule) return

  const [match, from] = matchScope(supportsConditionTextToScopeRuleText(supportsRule.conditionText)) ?? []
  if (!match) {
    console.warn('Expected to have a scoped sheet for:', styleElement.sheet)
    return
  }
  if (!(styleElement as any).onecxOriginalCss) {
    return legacyDeconstructScopeRule(styleElement.sheet, supportsRule, from)
  }

  return originalCssBasedDeconstructScopeRule(styleElement, supportsRule, from)
}

/**
 * This function operates on the original css that was used to create the style element.
 * It replaces :root with & and wraps all rules with the selector coming from the @scope rule.
 * The rules that cannot be wrapped (e.g., CSSKeyFramesRule and CSSFontFaceRule) are reinserted as they are on the top of the style sheet.
 *
 * Its important that this function will create a new style sheet and remove the old one. Without that operation some style will not be applied correctly (e.g., border shorthand).
 * @param styleElement - HTMLStyleElement
 * @param supportsRule - CSSSupportsRule that contains the @scope rule
 * @param fromSelector - selector coming from the @scope rule (e.g., [data-style-id="shell-ui"])
 */
function originalCssBasedDeconstructScopeRule(
  styleElement: HTMLStyleElement,
  supportsRule: CSSSupportsRule,
  fromSelector: string
) {
  if (!styleElement.sheet) return
  const originalCss = (styleElement as any).onecxOriginalCss as string

  // Construct new style element with available selector and original css with :root replaced with & and unwrappable rules extracted from supports rule to the top of the style sheet
  const actualCss = originalCss.replace(/(:root|html)\b/g, '&')
  const newStyleElement = document.createElement('style')
  const unwrappableRulesContent = Array.from(supportsRule.cssRules)
    .filter(isUnwrappableRule)
    .map((r) => r.cssText)
    .join('')
  const fromSelectorWithWhere = `:where(${fromSelector})`
  const newStyleContent = `${unwrappableRulesContent} ${fromSelectorWithWhere} {${actualCss}}`
  newStyleElement.appendChild(document.createTextNode(newStyleContent))

  // Remove old style element
  document.head.removeChild(styleElement)

  // Copy attributes from old style element to new one
  const attributes = styleElement.attributes
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes.item(i)
    if (attr) {
      newStyleElement.setAttribute(attr.name, attr.value)
    }
  }
  // Insert new style element
  document.head.appendChild(newStyleElement)
}

/**
 * This function operates on the CSSStyleSheet and deconstructs the @supports rule by deleting it and reinserting all rules inside the @supports rule.
 * Each rule that can be wrapped inside a selector (e.g., CSSStyleRule) is wrapped with the selector coming from the @scope rule.
 * @param sheet - CSSStyleSheet
 * @param supportsRule - CSSSupportsRule that contains the @scope rule
 * @param fromSelector - selector coming from the @scope rule (e.g., [data-style-id="shell-ui"])
 */
function legacyDeconstructScopeRule(sheet: CSSStyleSheet, supportsRule: CSSSupportsRule, fromSelector: string) {
  sheet.deleteRule(Array.from(sheet.cssRules).findIndex((rule) => rule === supportsRule))
  for (const rule of Array.from(supportsRule.cssRules)) {
    const index = sheet.cssRules.length <= 0 ? 0 : sheet.cssRules.length
    if (isWrappableRule(rule)) {
      const wrappedRuleText = rule.cssText.replace(/:scope/g, '&')
      const wrapped = `${normalize(fromSelector)} {${wrappedRuleText}}`
      sheet.insertRule(wrapped, index)
    } else {
      sheet.insertRule(rule.cssText, index)
    }
  }
}

function deconstructExistingStyleSheets() {
  const styleNodes = document.head.querySelectorAll('style')
  styleNodes.forEach((style) => deconstructScopeRule(style))
}

/**
 * Returns true if css rule can be wrapped inside a selector (e.g. CSSKeyFramesRule and CSSFontFaceRule can not be nested inside a selector)
 */
function isWrappableRule(rule: CSSRule) {
  return !(rule instanceof CSSKeyframesRule || rule instanceof CSSFontFaceRule)
}

/**
 * Returns true if css rule can not be wrapped inside a selector (e.g. CSSKeyFramesRule and CSSFontFaceRule can not be nested inside a selector)
 */
function isUnwrappableRule(rule: CSSRule) {
  return !isWrappableRule(rule)
}

/**
 * Ensures that all scoped style sheets are updated by the polyfill on the following events:
 * - HTMLElement.appendChild call
 * - HTMLElement.className call
 * - HTMLElement.classList's method calls
 *
 * This function overrides mentioned functionalities of all HTMLElement constructed on a page by overriding the HTMLElement.prototype
 */
export function overrideHtmlElementAppendAndClassChanges() {
  if (typeof CSSScopeRule === 'undefined') {
    overrideHtmlElementAppend()
    overrideHtmlElementClassChanges()
  }
}

/**
 * Creates an object compatible with NodeList interface based on the provided nodes.
 */
export function createNodeList(nodes: Node[]) {
  return {
    nodes: nodes,
    length: nodes.length,
    item: function (index: number) {
      return this.nodes[index]
    },
    forEach: function (callback: any) {
      this.nodes.forEach(callback)
    },
    [Symbol.iterator]: function () {
      let index = 0
      const nodes = this.nodes
      return {
        next: function () {
          if (index < nodes.length) {
            return { value: nodes[index++], done: false }
          } else {
            return { done: true }
          }
        }
      }
    }
  } as any as NodeList
}

/**
 * Updates scoped style sheets. Scope style sheet is a style sheet that was already transformed by this polyfill that implements OcxCSSStyleSheet interface.
 *
 * This function will transform new style sheets containing supports css rule to a style sheet that is understandable by all browsers that do not support the scope css rule.
 * After that operation, the style sheet will be considered updated if necessary.
 *
 * Based on the provided mutations this function will select a subset of scoped style sheets that require an update.
 *
 * An update for a style sheet consists of:
 * - Finding the HTML sections affected by the scope of the style sheet
 * - Updates css rules so each css style rule (e.g., ".custom-class { background-color: 'blue' }") has updated css selector with a path to all usages of the rule with the usage of the :where and :nth-child css selectors (e.g., ".custom-class:where(:nth-child(1) > :nth-child(2)) { background-color: 'blue' }"). Presented example means: apply "background-color: 'blue'" style to an HTMLElement that has "class='custom-class'" and is the second child of the first child of the root element.
 */
export function updateStyleSheets(mutationList: MutationRecord[]) {
  const nodesFromMutationList = mutationListToUniqueNodes(mutationList)
  if (nodesFromMutationList.length === 0) return

  const styleElements = document.styleSheets
  // Find what scope needs to be updated so no unnecessary updates are made
  const distinctStyleIdSelectors = getChangedStyleIdSelectors(mutationList)
  const scopeSelectorsCache: ScopeSelectorPresenceMap = new Map<string, Map<string, boolean>>()
  for (const sheet of Array.from(styleElements)) {
    if (containsSupportsRule(sheet)) {
      CssStyleSheetHandler.changeToScopedSheet(sheet)
      setupStyleNodeObserver(sheet as OcxCSSStyleSheet)
    }
    if (isScopedStyleSheet(sheet)) {
      if (isSelectorInChangedList(sheet.ownerNode.ocxFrom, distinctStyleIdSelectors)) {
        if (!scopeSelectorsCache.has(sheet.ownerNode.ocxMatch)) {
          scopeSelectorsCache.set(sheet.ownerNode.ocxMatch, new Map())
        }
        executeManualUpdateOfStyleSheet(
          sheet,
          nodesFromMutationList,
          scopeSelectorsCache.get(sheet.ownerNode.ocxMatch) ?? new Map()
        )
      }
    }
  }
}

function overrideHtmlElementAppend() {
  const originalAppend = HTMLElement.prototype.appendChild
  HTMLElement.prototype.appendChild = function (newChild: any): any {
    const result = originalAppend.call(this, newChild)
    updateStyleSheets([
      {
        type: 'childList',
        target: this,
        addedNodes: createNodeList([newChild]),
        attributeName: null,
        attributeNamespace: null,
        nextSibling: null,
        oldValue: null,
        previousSibling: null,
        removedNodes: createNodeList([])
      } as MutationRecord
    ])
    return result
  }
}

function overrideHtmlElementClassChanges() {
  const originalClassNameSetter = (HTMLElement.prototype as any).__lookupSetter__('className')

  Object.defineProperty(HTMLElement.prototype, 'className', {
    set: function (val) {
      let result
      if (originalClassNameSetter) {
        result = originalClassNameSetter.call(this, val)
      }
      updateStyleSheetsForClassChange(this)
      return result
    }
  })

  const originalClassListGetter = (HTMLElement.prototype as any).__lookupGetter__('classList')

  Object.defineProperty(HTMLElement.prototype, 'classList', {
    get: function () {
      const classList = originalClassListGetter.call(this)
      classList.ocxHtmlElement = this
      return classList
    },
    configurable: true
  })

  const domTokenListOriginalAdd = DOMTokenList.prototype.add

  DOMTokenList.prototype.add = function (...tokens: string[]) {
    const result = domTokenListOriginalAdd.call(this, ...tokens)
    const element = (this as any).ocxHtmlElement
    if (element) updateStyleSheetsForClassChange(element)
    return result
  }

  const domTokenListOriginalRemove = DOMTokenList.prototype.remove

  DOMTokenList.prototype.remove = function (...tokens: string[]) {
    const result = domTokenListOriginalRemove.call(this, ...tokens)
    const element = (this as any).ocxHtmlElement
    if (element) updateStyleSheetsForClassChange(element)
    return result
  }

  const domTokenListOriginalReplace = DOMTokenList.prototype.replace

  DOMTokenList.prototype.replace = function (token: string, newToken: string) {
    const result = domTokenListOriginalReplace.call(this, token, newToken)
    const element = (this as any).ocxHtmlElement
    if (element) updateStyleSheetsForClassChange(element)
    return result
  }

  const domTokenListOriginalToggle = DOMTokenList.prototype.toggle

  DOMTokenList.prototype.toggle = function (token: string, force: boolean | undefined) {
    const result = domTokenListOriginalToggle.call(this, token, force)
    const element = (this as any).ocxHtmlElement
    if (element) updateStyleSheetsForClassChange(element)
    return result
  }
}

function updateStyleSheetsForClassChange(element: Node) {
  updateStyleSheets([
    {
      type: 'attributes',
      target: element,
      addedNodes: createNodeList([]),
      attributeName: 'class',
      attributeNamespace: null,
      nextSibling: null,
      oldValue: null,
      previousSibling: null,
      removedNodes: createNodeList([])
    } as MutationRecord
  ])
}

/**
 * Returns if selector is in list of changed selector list
 */
function isSelectorInChangedList(selector: string, changedStyleIdSelectorList: Array<string>) {
  return changedStyleIdSelectorList.some((styleIdSelector) => normalize(styleIdSelector) === normalize(selector))
}

/**
 * Find what scope that need to be updated based on the mutationList
 */
function getChangedStyleIdSelectors(mutationList: MutationRecord[]) {
  const set = new Set<string>()
  for (const mutation of mutationList) {
    // If mutation was made to the body, we assume that its addition or removal of the wrapper
    if (mutation.target === document.body) {
      const styleIdSelectors = getChangedStyleIdSelectorForWrapper(mutation)
      styleIdSelectors && styleIdSelectors.forEach((selector) => set.add(selector))
      continue
    }

    // Find closest element with scope data
    let currentNode: HTMLElement | null = mutation.target as HTMLElement
    while (currentNode && isNotChildOfBodyAndHasNoStyleId(currentNode)) {
      currentNode = currentNode.parentElement
    }
    if (!currentNode) continue
    const styleIdSelectors = nodeToStyleIdSelectors(currentNode)
    styleIdSelectors && styleIdSelectors.forEach((selector) => set.add(selector))
  }

  return Array.from(set)
}

/**
 * Find style id for body change based on added and removed nodes
 */
function getChangedStyleIdSelectorForWrapper(record: MutationRecord) {
  const node = (record.addedNodes.item(0) ?? record.removedNodes.item(0)) as HTMLElement
  if (!node) return null

  return nodeToStyleIdSelectors(node)
}

function isNotChildOfBodyAndHasNoStyleId(node: Node) {
  return node.parentElement !== document.body && !(node as any)?.dataset[dataStyleIdKey]
}

/**
 * Create observer for style sheet node updates
 */
function setupStyleNodeObserver(sheet: OcxCSSStyleSheet) {
  const sheetNode = sheet.ownerNode
  if (sheetNode && !scopedSheetNodes.has(sheetNode)) {
    scopedSheetNodes.add(sheetNode)
    // Create an observer for the new style sheet
    const sheetObserver = new MutationObserver(() => existingScopedSheetCallback(sheetNode))
    sheetObserver.observe(sheetNode, {
      characterData: true,
      childList: true,
      subtree: true
    })
  }
}

/**
 * Executes update of the style sheet
 */
function executeManualUpdateOfStyleSheet(
  sheet: OcxCSSStyleSheet,
  mutatedElements: Element[],
  selectorCache: SelectorPresenceMap,
  skipMutationCheck = false
) {
  CssStyleSheetHandler.updateScopedSheet(
    sheet,
    {
      mutatedElements: mutatedElements,
      skipMutationCheck: skipMutationCheck
    },
    selectorCache
  )
}

/**
 * Callback method to fire for existing style sheet content changes
 */
function existingScopedSheetCallback(element: OcxOwnerNode) {
  const cssStyleSheet = element.sheet as OcxCSSStyleSheet
  if (!cssStyleSheet) return

  updateScopedStyleForExistingSheet(cssStyleSheet)
}

/**
 * Handles update for a change in style sheet content
 */
function updateScopedStyleForExistingSheet(sheet: OcxCSSStyleSheet) {
  if (containsSupportsRule(sheet)) {
    CssStyleSheetHandler.changeToScopedSheet(sheet)
  }

  if (isScopedStyleSheet(sheet)) {
    executeManualUpdateOfStyleSheet(sheet, [], new Map(), true)
  }
}


```




********************************************************************************************************************************

FIle => onecx-shell-ui  > src > enviroment > enviroment.ts

```ts
export const environment = {
  KEYCLOAK_CLIENT_ID: 'onecx-shell-ui-client',
  KEYCLOAK_URL: 'http://keycloak-app/',
  KEYCLOAK_REALM: 'onecx',
  skipRemoteConfigLoad: true,
  production: false,
  APP_VERSION: 'Local Shell Version'
}
```




********************************************************************************************************************************

FIle => onecx-shell-ui  > src > app > app.module.ts

```ts


import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { inject, NgModule, provideAppInitializer } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Router, RouterModule } from '@angular/router'
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core'
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
  createTranslateLoader,
  MultiLanguageMissingTranslationHandler,
  provideTranslationPathFromMeta,
  SKIP_STYLE_SCOPING
} from '@onecx/angular-utils'
import { provideThemeConfig } from '@onecx/angular-utils/theme/primeng'

import { CurrentLocationPublisher, EventsTopic, Theme, UserProfile } from '@onecx/integration-interface'

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



/*
* Original browser history.pushState function is saved
*/
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
    new CurrentLocationPublisher().publish({
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
    new CurrentLocationPublisher().publish({
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
    new CurrentLocationPublisher().publish({
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
    TranslateModule.forRoot({
      isolate: true,
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MultiLanguageMissingTranslationHandler
      }
    }),

    PortalViewportComponent,
    GlobalErrorComponent,
    AppLoadingSpinnerComponent
  ],
  providers: [
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
    provideThemeConfig(),
    provideTokenInterceptor(),
    provideHttpClient(withInterceptorsFromDi()),
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
    { provide: BASE_PATH, useValue: './shell-bff' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

```




********************************************************************************************************************************

FIle => onecx-shell-ui  > src > app > app.route.ts


```ts
import { Route } from '@angular/router'

// Initialization error page is lazy-loaded via InitErrorModule

export const appRoutes: Route[] = [
  {
    path: 'portal-initialization-error-page',
    data: { message: '' },
    loadChildren: () => import('src/app/init-error/init-error.module').then((m) => m.InitErrorModule),
    title: 'Initialization Error'
  },
  {
    path: 'remote-loading-error-page',
    loadChildren: () => import('src/app/error/error.module').then((m) => m.ErrorModule),
    title: 'Error'
  }
]


```


********************************************************************************************************************************

FIle => onecx-shell-ui  > src > app > app.module.ts


```ts


```


********************************************************************************************************************************

FIle => onecx-shell-ui  > src > app > app.component

File : app.componenet.ts
```ts
import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { PrimeNG } from 'primeng/config'
import { merge, mergeMap } from 'rxjs'

import { UserService } from '@onecx/angular-integration-interface'

@Component({
  standalone: false,
  selector: 'ocx-shell-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'shell'

  constructor(
    private readonly translateService: TranslateService,
    private readonly config: PrimeNG,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.lang$.subscribe((lang) => {
      document.documentElement.lang = lang;
      this.translateService.use(lang)
    })
    merge(
      this.translateService.onLangChange,
      this.translateService.onTranslationChange,
      this.translateService.onDefaultLangChange
    )
      .pipe(mergeMap(() => this.translateService.get('SHELL')))
      .subscribe((res) => {
        this.config.setTranslation(res)
      })
  }
}
```


File : app.componenet.html
```html
<ocx-shell-portal-viewport></ocx-shell-portal-viewport>
```


********************************************************************************************************************************

FIle => onecx-shell-ui  > src > app > shell > services 

File :image-repository.service.ts
```ts
import { inject, Injectable } from '@angular/core';
import { ImageRepositoryService as ImageRepositoryInterface, ThemeService } from '@onecx/angular-integration-interface';
import { catchError, EMPTY, first, from, map, mergeMap } from 'rxjs';
import { WorkspaceConfigBffService } from 'src/app/shared/generated';

@Injectable({ providedIn: 'root' })
export class ImageRepositoryService {
    private readonly imageRepositoryInterface = inject(ImageRepositoryInterface)
    private readonly workspaceConfigBffService = inject(WorkspaceConfigBffService);
    private readonly themeService = inject(ThemeService)
    
    /**
     * Triggers image loading and publishing asynchronously.
     * Returns a resolved Promise<void> immediately (non-blocking).
    */

    public async init(): Promise<void> {
        this.getAvailableImages();
    }

    private getAvailableImages(): void{
        this.themeService.currentTheme$.pipe(
            first(),
            map(theme => theme.name || ''),
            mergeMap(themeName => {
                if (!themeName) {
                    console.error('Theme name is missing');
                    return from(EMPTY);
                }
                return this.workspaceConfigBffService.getAvailableImageTypes(themeName).pipe(
                    first(),
                    map(res => {
                        if (!res?.types || !Array.isArray(res.types)) {
                            throw new Error('No available image types');
                        }
                        const availableTypes = res.types as string[];
                        if (!availableTypes.length) {
                            return {};
                        }
                        const urls: { [key: string]: string } = {};
                        availableTypes.forEach(type => {
                            urls[type] = this.constructImagePath(themeName, type);
                        });
                        return urls;
                    })
                );
            }),
            catchError(err => {
                console.error("Error: " + err.message, err);
                return from([{}]);
            })
        ).subscribe({
            next: urls => {
                if (urls) {
                    this.imageRepositoryInterface.imageRepositoryTopic.publish({ images: { ...urls } });
                }
            }
        });
    }

    private constructImagePath(themeName: string, type: string): string {           
        return `/shell-bff/workspaceConfig/themes/${themeName}/images/${type}`;   
    }
}


```


File : parameter.service.ts
```ts
import { inject, Injectable } from '@angular/core'
import {
  ApplicationParameters,
  ParametersPublisher,
  Parameters,
  RemoteComponent,
  Route
} from '@onecx/integration-interface'
import { AppStateService, RemoteComponentsService } from '@onecx/angular-integration-interface'
import { firstValueFrom } from 'rxjs'
import { GetParametersRequest, GetParametersResponse, Parameter, ParameterBffService } from 'src/app/shared/generated'

type Cache = { parameters: (ApplicationParameters & { expirationDate: number })[] }

@Injectable({ providedIn: 'root' })
export class ParametersService {
  private readonly appStateService = inject(AppStateService)
  private readonly remoteComponentsService = inject(RemoteComponentsService)
  private readonly parameterBffService = inject(ParameterBffService)
  private readonly cacheItemName = 'onecx-parameters-cache'
  private readonly cacheExpirationTimeMs = 3600 * 1000 // 1 hour
  private readonly parametersPublisher = new ParametersPublisher()

  initialize() {
    //Not awaited on purpose
    this.init()
  }

  private async init() {
    const cache: Cache = this.getCache(this.cacheItemName)
    const request: GetParametersRequest = await this.buildGetParametersRequest(
      cache,
      this.appStateService,
      this.remoteComponentsService
    )

    if (Object.keys(request.products).length !== 0) {
      const parameters = await firstValueFrom(this.parameterBffService.getParameters(request))
      this.updateCache(parameters, cache)
      localStorage.setItem(this.cacheItemName, JSON.stringify(cache))
    }
    this.parametersPublisher.publish(cache)
  }

  private async buildGetParametersRequest(
    cache: Cache,
    appStateService: AppStateService,
    remoteComponentsService: RemoteComponentsService
  ) {
    const request: GetParametersRequest = { products: {} }

    const workspace = await firstValueFrom(appStateService.currentWorkspace$.asObservable())
    this.addToGetParametersRequest(cache, request, workspace.routes ?? [])

    const remoteComponents = await firstValueFrom(remoteComponentsService.remoteComponents$.asObservable())
    this.addToGetParametersRequest(cache, request, remoteComponents.components ?? [])
    return request
  }

  private updateCache(parameters: GetParametersResponse, cache: Cache) {
    Object.keys(parameters.products).forEach((productName) => {
      Object.keys(parameters.products[productName]).forEach((appId) => {
        this.updateCacheEntry(cache, parameters, productName, appId)
      })
    })
  }

  private updateCacheEntry(cache: Cache, parameters: GetParametersResponse, productName: string, appId: string) {
    const params = parameters.products[productName][appId]
    const convertedParams = params.reduce(
      (acc: Parameters, param: Parameter) => ({ ...acc, [param.name]: param.value }),
      {}
    )

    const expirationDate = new Date()
    expirationDate.setSeconds(expirationDate.getSeconds() + this.cacheExpirationTimeMs)

    const existingParameter = cache.parameters.find((item) => item.productName === productName && item.appId === appId)
    if (existingParameter) {
      existingParameter.parameters = convertedParams
      existingParameter.expirationDate = expirationDate.getTime()
    } else {
      cache.parameters.push({
        productName: productName,
        appId: appId,
        expirationDate: expirationDate.getTime(),
        parameters: convertedParams
      })
    }
  }

  private addToGetParametersRequest(cache: Cache, request: GetParametersRequest, items: (Route | RemoteComponent)[]) {
    items.forEach((item) => {
      if (!this.hasValidCache(cache, item.productName ?? '', item.appId ?? '')) {
        request.products[item.productName ?? ''] ??= []
        if(!request.products[item.productName ?? ''].includes(item.appId ?? '')){
          request.products[item.productName ?? ''].push(item.appId ?? '')
        }
      }
    })
  }

  private getCache(cacheItemName: string): Cache {
    try {
      const cache = JSON.parse(localStorage.getItem(cacheItemName) ?? '{"parameters": []}')
      cache.parameters ??= []
      return cache
    } catch {
      console.error('Failed to parse cache from localStorage')
      return { parameters: [] }
    }
  }

  private hasValidCache(cache: Cache, productName: string, appId: string) {
    const cacheItem = cache.parameters.find((item) => item.productName === productName && item.appId === appId)
    if (cacheItem) {
      const now = new Date()
      const expirationDate = new Date(cacheItem.expirationDate)
      return now < expirationDate
    }
    return false
  }
}


```


File : permission-proxy.service.ts
```ts
import { Injectable } from '@angular/core'
import { PermissionsRpcTopic } from '@onecx/integration-interface'
import { catchError, filter, map, mergeMap, of, retry } from 'rxjs'
import { PermissionBffService } from 'src/app/shared/generated'
import { PermissionsCacheService } from './permissions-cache.service'

@Injectable({ providedIn: 'root' })
export class PermissionProxyService {
  private readonly permissionsTopic$ = new PermissionsRpcTopic()

  constructor(
    private readonly permissionsService: PermissionBffService,
    private readonly permissionsCacheService: PermissionsCacheService
  ) {}

  async init(): Promise<unknown> {
    this.permissionsTopic$
      .pipe(
        filter((message) => message.permissions === undefined),
        mergeMap((message) =>
          this.permissionsCacheService
            .getPermissions(message.appId, message.productName, (appId, productName) =>
              this.permissionsService.getPermissions({ appId, productName }).pipe(
                retry({ delay: 500, count: 3 }),
                catchError(() => {
                  console.error('Unable to load permissions for ', appId, productName)
                  return of({ permissions: [] })
                }),
                map(({ permissions }) => permissions)
              )
            )
            .pipe(map((permissions) => ({ message, permissions })))
        )
      )
      .subscribe(({ message, permissions }) => {
        const answer = {
          appId: message.appId,
          productName: message.productName,
          permissions: permissions
        }
        this.permissionsTopic$.publish(answer)
      })
    return Promise.resolve()
  }
}


```


File : permission-cache.service.ts
```ts
import { Injectable } from '@angular/core'
import { Observable, shareReplay } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class PermissionsCacheService {
  permissions: Record<string, Observable<string[]>> = {}

  getPermissions(
    appId: string,
    productName: string,
    cacheMissFkt: (appId: string, productName: string) => Observable<string[]>
  ): Observable<string[]> {
    const key = appId + '|' + productName
    if (!this.permissions[key]) {
      this.permissions[key] = cacheMissFkt(appId, productName).pipe(shareReplay())
    }
    return this.permissions[key]
  }
}


```


File : route.service.ts
```ts
import { Injectable } from '@angular/core'
import { Location } from '@angular/common'
import { LoadRemoteModuleOptions, loadRemoteModule } from '@angular-architects/module-federation'
import { NavigationEnd, NavigationSkipped, Route, Router } from '@angular/router'
import { BehaviorSubject, filter, firstValueFrom, map } from 'rxjs'

import { getLocation } from '@onecx/accelerator'
import {
  AppStateService,
  CONFIG_KEY,
  ConfigurationService,
  PortalMessageService
} from '@onecx/angular-integration-interface'
import { PermissionsTopic } from '@onecx/integration-interface'

import { appRoutes } from 'src/app/app.routes'
import { Route as BffGeneratedRoute, PathMatch, PermissionBffService, Technologies } from 'src/app/shared/generated'

import { WebcomponentLoaderModule } from '../web-component-loader/webcomponent-loader.module'
import { updateStylesForMfeChange } from '@onecx/angular-utils/style'
import { HttpClient } from '@angular/common/http'
import { PermissionsCacheService } from './permissions-cache.service'

export const DEFAULT_CATCH_ALL_ROUTE: Route = {
  path: '**',
  loadChildren: () => import('src/app/not-found/not-found.module').then((m) => m.NotFoundModule),
  title: 'OneCX Error'
}

@Injectable({ providedIn: 'root' })
export class RoutesService {
  private readonly permissionsTopic$ = new PermissionsTopic()
  private isFirstLoad = true
  showContent$ = new BehaviorSubject<boolean>(true)

  constructor(
    private readonly router: Router,
    private readonly appStateService: AppStateService,
    private readonly portalMessageService: PortalMessageService,
    private readonly configurationService: ConfigurationService,
    private readonly permissionsCacheService: PermissionsCacheService,
    private readonly permissionsService: PermissionBffService,
    private readonly httpClient: HttpClient
  ) {
    router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd || e instanceof NavigationSkipped),
        map(() => true)
      )
      .subscribe(this.showContent$)
  }

  async init(routes: BffGeneratedRoute[]): Promise<void> {
    routes.sort(this.sortRoutes)
    const generatedRoutes = await Promise.all(routes.map((r) => this.convertToRoute(r)))
    if (!(await this.containsRouteForWorkspace(routes))) {
      console.log('🧭 Adding fallback route')
      generatedRoutes.push(await this.createFallbackRoute())
    }
    this.router.resetConfig([...appRoutes, ...generatedRoutes, DEFAULT_CATCH_ALL_ROUTE])
    console.log('🧭 Adding Workspace routes:\n' + this.listRoutes(routes))
  }

  private listRoutes(routes: BffGeneratedRoute[]): string {
    return routes.map((lr) => `\t${lr.url} -> ${JSON.stringify(lr.baseUrl)}`).join('\n')
  }

  private sortRoutes(a: BffGeneratedRoute, b: BffGeneratedRoute): number {
    return (b.url ?? '').length - (a.url ?? '').length
  }

  private async convertToRoute(r: BffGeneratedRoute): Promise<Route> {
    return {
      path: await this.toRouteUrl(r.baseUrl),
      data: {
        module: r.exposedModule,
        breadcrumb: r.productName
      },
      pathMatch: r.pathMatch ?? (r.baseUrl.endsWith('$') ? 'full' : 'prefix'),
      loadChildren: async () => await this.loadChildren(r, r.baseUrl),
      canActivateChild: [() => this.updateAppEnvironment(r, r.baseUrl)],
      title: r.displayName
    }
  }

  private async loadChildren(r: BffGeneratedRoute, joinedBaseUrl: string) {
    this.showContent$.next(false)
    await this.appStateService.globalLoading$.publish(true)
    console.log(`➡ Load remote module ${r.exposedModule}`)
    try {
      try {
        await this.updateAppEnvironment(r, joinedBaseUrl)
        const m = await loadRemoteModule(this.toLoadRemoteEntryOptions(r))
        const exposedModule = r.exposedModule.startsWith('./') ? r.exposedModule.slice(2) : r.exposedModule
        console.log(`Load remote module ${exposedModule} finished.`)
        if (r.technology === Technologies.Angular) {
          return m[exposedModule]
        } else {
          return WebcomponentLoaderModule
        }
      } catch (err) {
        return await this.onRemoteLoadError(err)
      }
    } finally {
      await this.appStateService.globalLoading$.publish(false)
    }
  }

  private async updateAppEnvironment(r: BffGeneratedRoute, joinedBaseUrl: string): Promise<boolean> {
    this.updateAppStyles(r)
    return this.updateAppState(r, joinedBaseUrl)
  }

  private async updateAppState(r: BffGeneratedRoute, joinedBaseUrl: string): Promise<boolean> {
    const currentGlobalLoading = await firstValueFrom(this.appStateService.globalLoading$.asObservable())
    let currentMfeInfo: { remoteBaseUrl?: string } | undefined
    if (!this.isFirstLoad) {
      currentMfeInfo = await firstValueFrom(this.appStateService.currentMfe$.asObservable())
    }

    if (this.isFirstLoad || (currentMfeInfo?.remoteBaseUrl ?? undefined) !== r.url) {
      this.isFirstLoad = false
      if (!currentGlobalLoading) {
        this.showContent$.next(false)
        await this.appStateService.globalLoading$.publish(true)
      }

      await Promise.all([this.updateMfeInfo(r, joinedBaseUrl), this.updatePermissions(r)])

      if (!currentGlobalLoading) {
        await this.appStateService.globalLoading$.publish(false)
      }
    }
    return true
  }

  private async updateAppStyles(r: BffGeneratedRoute) {
    await updateStylesForMfeChange(r.productName, r.appId, this.httpClient, r.url)
  }

  private async updateMfeInfo(r: BffGeneratedRoute, joinedBaseUrl: string) {
    const mfeInfo = {
      baseHref: joinedBaseUrl,
      version: r.productVersion,
      mountPath: joinedBaseUrl,
      shellName: 'portal',
      remoteBaseUrl: r.url,
      displayName: r.displayName,
      appId: r.appId,
      productName: r.productName,
      remoteName: r.remoteName,
      elementName: r.elementName
    }
    return await this.appStateService.currentMfe$.publish(mfeInfo)
  }

  private async updatePermissions(r: BffGeneratedRoute) {
    const permissions = await firstValueFrom(
      this.permissionsCacheService.getPermissions(r.appId, r.productName, (appId, productName) =>
        this.permissionsService.getPermissions({ appId, productName }).pipe(map(({ permissions }) => permissions))
      )
    )
    await this.permissionsTopic$.publish(permissions)
  }

  private async onRemoteLoadError(err: unknown) {
    console.log(`Failed to load remote module: ${err}`)
    this.portalMessageService.error({
      summaryKey: 'ERROR_MESSAGES.ON_REMOTE_LOAD_ERROR'
    })

    const routerParams = {
      requestedApplicationPath: getLocation().applicationPath
    }

    this.router.navigate(['remote-loading-error-page', routerParams])
    throw err
  }

  private toLoadRemoteEntryOptions(r: BffGeneratedRoute): LoadRemoteModuleOptions {
    const exposedModule = r.exposedModule.startsWith('./') ? r.exposedModule.slice(2) : r.exposedModule
    if (r.technology === Technologies.Angular || r.technology === Technologies.WebComponentModule) {
      return {
        type: 'module',
        remoteEntry: r.remoteEntryUrl,
        exposedModule: './' + exposedModule
      }
    }
    return {
      type: 'script',
      remoteName: r.remoteName ?? '',
      remoteEntry: r.remoteEntryUrl,
      exposedModule: './' + exposedModule
    }
  }

  private async toRouteUrl(url: string | undefined) {
    if (!url) {
      return url
    }
    const SHELL_BASE_HREF = await this.configurationService.getProperty(CONFIG_KEY.APP_BASE_HREF)
    if (SHELL_BASE_HREF && url.startsWith(SHELL_BASE_HREF)) {
      url = url.slice(SHELL_BASE_HREF.length)
    }

    if (url?.startsWith('/')) {
      url = url.substring(1)
    }
    if (url.endsWith('$')) {
      url = url.substring(0, url.length - 1)
    }
    if (url.endsWith('/')) {
      url = url.substring(0, url.length - 1)
    }
    return url
  }

  private async containsRouteForWorkspace(routes: BffGeneratedRoute[]): Promise<boolean> {
    const baseUrl = (await firstValueFrom(this.appStateService.currentWorkspace$.asObservable())).baseUrl
    const routeUrl = await this.toRouteUrl(baseUrl)
    return routes.some((r) => r.baseUrl === routeUrl)
  }

  private async createFallbackRoute(): Promise<Route> {
    const currentWorkspace = await firstValueFrom(this.appStateService.currentWorkspace$.asObservable())
    const route = {
      path: await this.toRouteUrl(currentWorkspace.baseUrl),
      pathMatch: PathMatch.full
    }

    if (!currentWorkspace.homePage) {
      return {
        ...route,
        loadChildren: () => import('src/app/home/home.module').then((m) => m.HomeModule)
      }
    }
    return {
      ...route,
      redirectTo: await this.createHomePageUrl(currentWorkspace.baseUrl, currentWorkspace.homePage)
    }
  }

  private createHomePageUrl(baseUrl: string, homePage: string) {
    return this.toRouteUrl(Location.joinWithSlash(baseUrl, homePage))
  }
}


```



********************************************************************************************************************************

FIle => onecx-shell-ui  > src > app > shell > web-componenet-loader

File : webcomponent-loader.module.ts
```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebcomponentLoaderComponent } from './webcomponent-loader.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [WebcomponentLoaderComponent],
  imports: [
    CommonModule,
    [
      RouterModule.forChild([
        { path: '**', component: WebcomponentLoaderComponent },
      ]),
    ],
  ],
})
export class WebcomponentLoaderModule {}


```


File : webcomponent-loader.componenet.ts
```ts
import { AfterContentInit, Component, ElementRef, ViewChild } from '@angular/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import { dataMfeElementKey } from '@onecx/angular-utils'
import { firstValueFrom } from 'rxjs'
import { dataStyleIdKey, dataStyleIsolationKey } from 'src/scope-polyfill/utils'

@Component({
  standalone: false,
  template: '<div class="webcomponentwrapper" #wrapper></div>'
})
export class WebcomponentLoaderComponent implements AfterContentInit {
  @ViewChild('wrapper', { read: ElementRef, static: true })
  wrapper?: ElementRef

  constructor(private readonly appStateService: AppStateService) {}

  async ngAfterContentInit() {
    const currentMfe = await firstValueFrom(this.appStateService.currentMfe$.asObservable())

    if (!currentMfe.elementName) throw new Error('elementName is missing in the configuration')

    const styleId = `${currentMfe.productName}|${currentMfe.appId}`

    const element = document.createElement(currentMfe.elementName)
    element.dataset[dataStyleIdKey] = styleId
    element.dataset[dataStyleIsolationKey] = ''
    element.dataset[dataMfeElementKey] = ''
    this.wrapper?.nativeElement.appendChild(element)
  }
}


```






********************************************************************************************************************************

FIle => onecx-shell-ui  > src > app > shell > utils

File :initialization-error-handler.utils.ts
```ts
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { Observable, of } from 'rxjs'

import { ProblemDetailResponse } from 'src/app/shared/generated'

type InitializationErrorDetails = ProblemDetailResponse

interface InitializationError {
  message: string
  details?: InitializationErrorDetails
}

export function initializationErrorHandler(error: any, router: Router): Observable<any> {
  console.error(error)
  const initError: InitializationError = { message: '' }
  if (error instanceof ErrorEvent) {
    initError.message = error.error.message
  } else if (error instanceof HttpErrorResponse) {
    initError.details = error.error
    initError.message = error.message
  }

  const params = new URLSearchParams()
  params.set('message', initError.message)
  params.set('requestedUrl', window.location.href)
  params.set('detail', initError.details?.detail ?? '')
  params.set('errorCode', initError.details?.errorCode ?? '')
  params.set(
    'invalidParams',
    initError.details?.invalidParams
      ? '['.concat(initError.details.invalidParams.map((p) => `${p.name}: ${p.message}`).join(',')).concat(']')
      : ''
  )
  params.set(
    'params',
    initError.details?.params
      ? '['.concat(initError.details.params.map((p) => `${p.key}: ${p.value}`).join(',')).concat(']')
      : ''
  )

  // only on first time: redirect and add message
  if (!params.toString().includes('portal-initialization-error-page'))
    router.navigate(['portal-initialization-error-page'], { fragment: params.toString() })
  return of(undefined)
}


```


File :normalize-classes.utils.ts
```ts
import { NgClassInputType } from '../components/slot-group/slot-group.component'

/**
 * Normalizes various class input formats into a single space-separated string.
 *
 * This is needed because custom classes can be provided as arrays, sets, or objects
 * (e.g.: { 'active': true }), but we need to merge them with base class strings.
 *
 * @param classes - CSS classes in string, array, set, or object format
 * @returns A space-separated string of CSS class names
 */
export function normalizeClassesToString(classes: NgClassInputType): string {
  if (!classes) return ''

  if (Array.isArray(classes) || classes instanceof Set) {
    return [...classes].join(' ')
  }

  if (typeof classes === 'object') {
    return Object.keys(classes)
      .filter((key) => classes[key])
      .join(' ')
  }

  return classes.trim()
}


```


File :preloader.utils.ts
```ts
declare global {
  interface Window {
    onecxPreloaders: Record<string, any>
  }
}

export interface Preloader {
  relativeRemoteEntryUrl: string
  windowKey: string
  exposedModule: string
}

export const angular18Preloader: Preloader = {
  relativeRemoteEntryUrl: 'pre_loaders/onecx-angular-18-loader/remoteEntry.js',
  windowKey: 'angular-18',
  exposedModule: './Angular18Loader'
}

export const angular19Preloader: Preloader = {
  relativeRemoteEntryUrl: 'pre_loaders/onecx-angular-19-loader/remoteEntry.js',
  windowKey: 'angular-19',
  exposedModule: './Angular19Loader'
}

export const angular20Preloader: Preloader = {
  relativeRemoteEntryUrl: 'pre_loaders/onecx-angular-20-loader/remoteEntry.js',
  windowKey: 'angular-20',
  exposedModule: './Angular20Loader'
}

export async function loadPreloaderModule(preloader: Preloader) {
  const moduleFederation = await import('@angular-architects/module-federation')
  return moduleFederation.loadRemoteModule({
    type: 'module',
    remoteEntry: `${getLocation().deploymentPath}${preloader.relativeRemoteEntryUrl}`,
    exposedModule: preloader.exposedModule
  })
}

export function ensurePreloaderModuleLoaded(preloader: Preloader) {
  return new Promise((resolve) => {
    if (window['onecxPreloaders'][preloader.windowKey]) {
      resolve(true)
      return
    }
    const ensureIntevalId = setInterval(() => {
      if (window['onecxPreloaders'][preloader.windowKey]) {
        clearInterval(ensureIntevalId)
        resolve(true)
      }
    }, 50)
  })
}

export function getLocation() {
  const baseHref = document.getElementsByTagName('base')[0]?.href ?? window.location.origin + '/'
  const location = window.location as any
  location.deploymentPath = baseHref.substring(window.location.origin.length)
  location.applicationPath = window.location.href.substring(baseHref.length - 1)

  return location
}


```


File :slot-names-mapper.ts
```ts
import { Slot } from '@onecx/integration-interface'

export const slotNamesMapping: Record<string, string> = {
  'onecx-shell-vertical-menu': 'onecx-shell-body-start.start',
  'onecx-shell-horizontal-menu': 'onecx-shell-header.center',
  'onecx-shell-header-left': 'onecx-shell-header.start',
  'onecx-shell-header-right': 'onecx-shell-header.end',
  'onecx-shell-sub-header': 'onecx-shell-body-header.center',
  'onecx-shell-footer': 'onecx-shell-body-footer.start',
  'onecx-page-footer': 'onecx-shell-body-footer.start'
}

/**
 * Maps slot names in the given slots array using slotNamesMapping.
 * @param slots Array of Slot objects to map.
 * @returns Array of Slot objects with mapped names.
 */
function mapSlotNames(slots: Slot[]): Slot[] {
  return slots.map((slot: Slot) => ({
    ...slot,
    name: slotNamesMapping[slot.name] ?? slot.name
  }))
}

/**
 * Merges slots with the same name, combining their components and removing duplicates.
 * @param slots Array of Slot objects (with mapped names).
 * @returns Array of merged Slot objects.
 */
function mergeSlotsByName(slots: Slot[]): Slot[] {
  const slotMap: Record<string, Slot> = {}
  for (const slot of slots) {
    if (slotMap[slot.name]) {
      const existingSlot = slotMap[slot.name]
      slotMap[slot.name] = {
        ...existingSlot,
        components: [...existingSlot.components, ...slot.components.filter((c) => !existingSlot.components.includes(c))]
      }
    } else {
      slotMap[slot.name] = { ...slot, components: [...slot.components] }
    }
  }
  return Object.values(slotMap)
}

/**
 * Normalizes slot names to the slot group naming convention.
 * - Slot names listed in slotNamesMapping are replaced with their mapped values.
 * - All other slot names remain unchanged.
 * - After mapping, slots with the same name are merged, combining their components and removing duplicates.
 *
 * @param slots Array of Slot objects to normalize.
 * @returns Normalized and merged slots.
 */
export function mapSlots(slots: Slot[]): Slot[] {
  const mappedSlots = mapSlotNames(slots)
  const mergedSlots = mergeSlotsByName(mappedSlots)

  return mergedSlots
}


```




********************************************************************************************************************************

FIle => onecx-shell-ui  > src > app > shell > utils > styles

File : angular-material-overwrites.utils.ts
```ts
import { getOnecxTriggerElement } from './onecx-trigger-element.utils'
import { appendIntermediateStyleData, getStyleDataOrIntermediateStyleData, markElement } from './style-data.utils'

// When creating elements in Angular Material make sure to include the style id data in them so when appending to the body we don't lose context of the current App
export function ensureMaterialDynamicDataIncludesIntermediateStyleData() {
  // eslint-disable-next-line @typescript-eslint/no-extra-semi
  ;(document as any).createElementFromMaterial = function (context: any, tagName: any, options?: any): HTMLElement {
    const el = document.createElement(tagName, options)
    const onecxTrigger = getOnecxTriggerElement()
    const styleData = onecxTrigger ? getStyleDataOrIntermediateStyleData(onecxTrigger) : null
    // Append intermediate data so the isolation does not happen by coincidence
    if (styleData) {
      appendIntermediateStyleData(el, styleData)
    }
    markElement(el, 'createElementFromMaterial')
    return el
  }
}


```


File : body-overwrites.utils.ts
```ts
import { POLYFILL_SCOPE_MODE } from '@onecx/angular-integration-interface'
import { isCssScopeRuleSupported } from '@onecx/angular-utils'
import { createNodeList, updateStyleSheets } from 'src/scope-polyfill/polyfill'
import {
  findStyleDataWrapper,
  getStyleDataOrIntermediateStyleData,
  markElement,
  removeStyleDataRecursive,
  wrapWithDiv
} from './style-data.utils'
import { getOnecxTriggerElement } from './onecx-trigger-element.utils'

export function ensureBodyChangesIncludeStyleData(polyfillMode: string | undefined) {
  overwriteAppendChild(polyfillMode)
  overwriteRemoveChild()
}

// When appending children to body create a wrapper with style isolation data and recompute style sheets for browsers not supporting @scope rule so all added elements are styled correctly immediately on the page
function overwriteAppendChild(polyfillMode: string | undefined) {
  const originalAppendChild = document.body.appendChild
  document.body.appendChild = function (newChild: Node): any {
    let childToAppend = newChild
    markElement(newChild, 'overwriteAppendChild')
    if (newChild.nodeType === Node.ELEMENT_NODE && newChild instanceof HTMLElement) {
      const onecxTriggerElement = getOnecxTriggerElement()
      const triggerElementStyleData = onecxTriggerElement
        ? getStyleDataOrIntermediateStyleData(onecxTriggerElement)
        : null
      const childElementStyleData = getStyleDataOrIntermediateStyleData(newChild)
      const styleData = childElementStyleData ?? triggerElementStyleData ?? undefined
      childToAppend = wrapWithDiv(newChild, styleData)
      removeStyleDataRecursive(newChild)
    }
    const result = originalAppendChild.call(this, childToAppend)
    if (!isCssScopeRuleSupported() && polyfillMode === POLYFILL_SCOPE_MODE.PRECISION) {
      updateStyleSheets([
        {
          type: 'childList',
          target: document.body,
          addedNodes: createNodeList([childToAppend]),
          attributeName: null,
          attributeNamespace: null,
          nextSibling: null,
          oldValue: null,
          previousSibling: null,
          removedNodes: createNodeList([])
        } as MutationRecord
      ])
    }
    return result
  }
}

// When removing children from the body make sure to remove the wrapper with style isolation data
function overwriteRemoveChild() {
  const originalRemoveChild = document.body.removeChild
  document.body.removeChild = function (child: Node): any {
    let childToRemove = child
    if (child.nodeType === Node.ELEMENT_NODE && child instanceof HTMLElement) {
      childToRemove = findStyleDataWrapper(child) ?? child
    }
    return originalRemoveChild.call(this, childToRemove)
  }
}


```


File : dynamic-content-initializer.utils.ts
```ts
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { ensurePrimengDynamicDataIncludesIntermediateStyleData } from './primeng-overwrites.utils'
import { ensureBodyChangesIncludeStyleData } from './body-overwrites.utils'
import { ensureMaterialDynamicDataIncludesIntermediateStyleData } from './angular-material-overwrites.utils'
import { initializeOnecxTriggerElementListener } from './onecx-trigger-element.utils'
import { ensureAngularComponentStylesContainStyleId } from './shared-styles-host-overwrites.utils'

export async function dynamicContentInitializer(configService: ConfigurationService) {
  const polyfillMode = await configService.getProperty(CONFIG_KEY.POLYFILL_SCOPE_MODE)
  ensureAngularComponentStylesContainStyleId()
  ensureBodyChangesIncludeStyleData(polyfillMode)
  ensurePrimengDynamicDataIncludesIntermediateStyleData()
  ensureMaterialDynamicDataIncludesIntermediateStyleData()
  initializeOnecxTriggerElementListener()
}


```


File : legacy-style.utils.ts
```ts
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import {
  dataNoPortalLayoutStylesAttribute,
  dataStyleIdAttribute,
  dataStyleIsolationAttribute,
  dataPortalLayoutStylesKey,
  dataDynamicPortalLayoutStylesKey,
  isCssScopeRuleSupported
} from '@onecx/angular-utils'
import { addStyleToHead, replaceRootWithScope } from '@onecx/angular-utils/style'
import { markElement } from './style-data.utils'

export async function fetchPortalLayoutStyles(http: HttpClient) {
  return await firstValueFrom(http.request('get', `./portal-layout-styles.css`, { responseType: 'text' }))
}

export function loadPortalLayoutStyles(css: string) {
  loadPortalLayoutStylesStyles(css)
  loadDynamicPortalLayoutStylesStyles(css)
}

function loadPortalLayoutStylesStyles(css: string) {
  if (isCssScopeRuleSupported()) {
    const styleElement = addStyleToHead(
      `
      @scope([${dataStyleIdAttribute}]:not([${dataNoPortalLayoutStylesAttribute}])) to ([${dataStyleIsolationAttribute}]) {
      ${replaceRootWithScope(css)}
    }
    `,
      {
        [dataPortalLayoutStylesKey]: ''
      }
    )
    markElement(styleElement, dataPortalLayoutStylesKey)
  } else {
    const styleElement = addStyleToHead(
      `
      @supports(@scope([${dataStyleIdAttribute}]:not([${dataNoPortalLayoutStylesAttribute}])) to ([${dataStyleIsolationAttribute}])) {
          ${replaceRootWithScope(css)}
        }
        `,
      {
        [dataPortalLayoutStylesKey]: ''
      }
    )
    ;(styleElement as any).onecxOriginalCss = css
    markElement(styleElement, dataPortalLayoutStylesKey)
  }
}

// This could be merged with loadPortalLayoutStylesStyles but its important to preserve functionality of PRECISION mode polyfill
// which most likely relies on the fact that the dynamic styles are in a separate style element
function loadDynamicPortalLayoutStylesStyles(css: string) {
  if (isCssScopeRuleSupported()) {
    const styleElement = addStyleToHead(
      `
      @scope(body > :not([${dataNoPortalLayoutStylesAttribute}])) to ([${dataStyleIsolationAttribute}]) {
      ${replaceRootWithScope(css)}
    }
      `,
      {
        [dataDynamicPortalLayoutStylesKey]: ''
      }
    )
    markElement(styleElement, dataDynamicPortalLayoutStylesKey)
  } else {
    const styleElement = addStyleToHead(
      `
      @supports(@scope(body > :not([${dataNoPortalLayoutStylesAttribute}])) to ([${dataStyleIsolationAttribute}])) {
      ${replaceRootWithScope(css)}
    }
    `,
      {
        [dataDynamicPortalLayoutStylesKey]: ''
      }
    )
    ;(styleElement as any).onecxOriginalCss = css
    markElement(styleElement, dataDynamicPortalLayoutStylesKey)
  }
}


```


File : onecx-trigger-element.utils.ts
```ts
declare global {
  // eslint-disable-next-line no-var
  var onecxTriggerElement: EventTarget | null
}

/**
 * Initializes the OneCX trigger element listener to track the last interacted element.
 *
 * The following events are considered as trigger changes:
 * - Mouseover: When the user hovers over an element.
 * - Focusin: When an element gains focus (e.g., via keyboard navigation).
 *
 * The last interacted element is stored in `window.onecxTriggerElement`.
 */
export function initializeOnecxTriggerElementListener() {
  // Detect last used element and save it as the current trigger
  document.addEventListener('mouseover', (event) => {
    updateOnecxTriggerElement(event.target)
  })

  document.addEventListener('focusin', (event) => {
    updateOnecxTriggerElement(event.target)
  })
}

/**
 * Retrieves the current OneCX trigger element.
 *
 * If the trigger element is null, it falls back to the first element with a `data-style-id` attribute
 * within the `.onecx-body` container.
 * @returns The current OneCX trigger element or a fallback element. Returns null if no suitable element is found.
 */
export function getOnecxTriggerElement() {
  if (globalThis.onecxTriggerElement !== null) {
    return globalThis.onecxTriggerElement
  }

  console.warn('OneCX Trigger Element is null, will fallback to app trigger element as content source.')
  const bodyElement = document.querySelector('.onecx-body')
  if (!bodyElement) {
    console.warn('OneCX Body Element not found. Could not create fallback trigger element.')
    return null
  }
  const appElement = bodyElement.querySelector('[data-style-id]')
  if (!appElement) {
    console.warn('No element with data-style-id found inside OneCX Body. Could not create fallback trigger element.')
    return null
  }

  return appElement
}

function updateOnecxTriggerElement(target: EventTarget | null) {
  globalThis.onecxTriggerElement = target
}


```


File : primeng-overwriteswutils.ts
```ts
import { getOnecxTriggerElement } from './onecx-trigger-element.utils'
import { appendIntermediateStyleData, getStyleDataOrIntermediateStyleData, markElement } from './style-data.utils'

// When creating elements in PrimeNg make sure to include the style id data in them so when appending to the body we don't lose context of the current App
export function ensurePrimengDynamicDataIncludesIntermediateStyleData() {
  // eslint-disable-next-line @typescript-eslint/no-extra-semi
  ;(document as any).createElementFromPrimeNg = function (context: any, tagName: any, options?: any): HTMLElement {
    const el = document.createElement(tagName, options)
    const contextElement = context['this']?.el?.nativeElement
    const onecxTrigger = getOnecxTriggerElement()
    const styleData =
      (contextElement ? getStyleDataOrIntermediateStyleData(contextElement) : null) ??
      (onecxTrigger ? getStyleDataOrIntermediateStyleData(onecxTrigger) : null)
    // Append intermediate data so the isolation does not happen by coincidence
    if (styleData) {
      appendIntermediateStyleData(el, styleData)
    }
    markElement(el, 'createElementFromPrimeNg')
    return el
  }
}


```


File : shared -styles-host-overwrites.utils.ts
```ts
import { DynamicAppId } from '@onecx/angular-webcomponents'
import { getStyleDataOrIntermediateStyleData, markElement } from './style-data.utils'

export const MARKED_FOR_WRAPPING = 'markedForWrapping'
export const MARKED_AS_WRAPPED = 'markedAsWrapped'

// When creating style elements via Renderer from Angular Core, make sure to include the style id data in the style elements so when appending to the head we don't lose context of the current App
export function ensureAngularComponentStylesContainStyleId() {
  // eslint-disable-next-line @typescript-eslint/no-extra-semi
  ;(document as any).createElementFromSharedStylesHost = function (
    context: any,
    tagName: any,
    options?: any
  ): HTMLElement {
    const el = document.createElement(tagName, options)
    const sharedStylesHost = context['this']
    if (!sharedStylesHost?.appId) {
      console.warn('Expected to overwrite SharedStyleHost createElement method, but no appId found on context.')
      return el
    }
    const dynamicAppId = sharedStylesHost.appId as DynamicAppId
    if (!dynamicAppId.appElementName) {
      console.warn(
        'Expected to overwrite SharedStyleHost createElement method, but appId is not instance of DynamicAppId.'
      )
      return el
    }
    const contextElementName = dynamicAppId.appElementName
    const contextElement = document.getElementsByTagName(contextElementName)[0]
    if (!contextElement) {
      console.warn(
        `Expected to overwrite SharedStyleHost createElement method, but could not find context element for Angular component styles: ${contextElementName}`
      )
      return el
    }
    const styleData = contextElement ? getStyleDataOrIntermediateStyleData(contextElement) : null
    if (!styleData) {
      console.warn(
        `Expected to overwrite SharedStyleHost createElement method, but could not find style data for Angular component styles in context element: ${contextElementName}`
      )
      return el
    }
    el.dataset[MARKED_FOR_WRAPPING] = styleData.styleId
    markElement(el, 'ensureAngularComponentStylesContainStyleId')

    return el
  }
}


```


File : shell-styles.utils.ts
```ts
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import {
  dataStyleIdAttribute,
  dataStyleIsolationAttribute,
  isCssScopeRuleSupported,
  shellScopeId
} from '@onecx/angular-utils'
import { addStyleToHead, replaceRootWithScope } from '@onecx/angular-utils/style'
import { markElement } from './style-data.utils'

export async function fetchShellStyles(http: HttpClient) {
  return await firstValueFrom(http.request('get', `./shell-styles.css`, { responseType: 'text' }))
}

export function loadShellStyles(css: string) {
  if (isCssScopeRuleSupported()) {
    const styleElement = addStyleToHead(
      `
      @scope([${dataStyleIdAttribute}="${shellScopeId}"]) to ([${dataStyleIsolationAttribute}]) {
          ${replaceRootWithScope(css)}
        }
      `,
      {
        shellStylesStyles: ''
      }
    )
    markElement(styleElement, 'shellStylesStyles')
  } else {
    const styleElement = addStyleToHead(
      `
      @supports (@scope([${dataStyleIdAttribute}="${shellScopeId}"]) to ([${dataStyleIsolationAttribute}])) {
          ${replaceRootWithScope(css)}
          }
      `,
      {
        shellStylesStyles: ''
      }
    )
    ;(styleElement as any).onecxOriginalCss = css
    markElement(styleElement, 'shellStylesStyles')
  }
}


```


File : style-changes-listener.utils.ts
```ts
import { updateAngularComponentsStyles } from './update-angular-components-styles.utils'
import { updateRequiredWrappingStyles } from './update-required-wrapping-styles.utils'

/**
 * Registers a listener that utilizes MutationObserver to validate styles added to the document head.
 *
 * Whenever new style element, containing Angular component styles, is added to head of the document, this initializer is going to replace PrimeNg prefix of all CSS variables with the scopeId of the application.
 *
 * The listener assumes that the style element containing the "_nghost" attribute is Angular component style.
 *
 * The listener finds the scopeId data by looking for "_nghost" owner and looking for the closest styleId element.
 */
export async function styleChangesListenerInitializer() {
  const observer = new MutationObserver((mutationList: MutationRecord[]) => updateStyles(mutationList))
  observer.observe(document.head, {
    childList: true
  })
}

function updateStyles(mutationList: MutationRecord[]) {
  updateAngularComponentsStyles(mutationList)
  updateRequiredWrappingStyles(mutationList)
}


```


File : style-data.utils.ts
```ts
import {
  dataIntermediateMfeElementKey,
  dataIntermediateNoPortalLayoutStylesKey,
  dataIntermediateStyleIdKey,
  dataMfeElementKey,
  dataNoPortalLayoutStylesKey,
  dataStyleIdKey,
  dataStyleIsolationKey
} from '@onecx/angular-utils'

interface StyleData {
  styleId: string | undefined
  noPortalLayoutStyles: string | undefined
  mfeElement: string | undefined
}

export const dataWrapperElementAttribute = 'data-dynamic-wrapper-element'
export const dataWrapperElementKey = 'dynamicWrapperElement'

/**
 * Marks an element with a specific value for tracking purposes.
 * @param element - The element to be marked.
 * @param value - The value to mark the element with.
 */
export function markElement(element: any, value: string) {
  element.onecx ??= {}
  element.onecx.markers ??= []
  element.onecx.markers.push(value)
}

/**
 * Wraps an HTMLElement a div element with style data attributes.
 * @param element HTMLElement to wrap
 * @param styleData StyleData object containing style information.
 * @returns A new HTMLElement that wraps the original element with style data attributes.
 */
export function wrapWithDiv(element: HTMLElement, styleData?: StyleData) {
  const dataStyleWrapper = createWrapper(styleData)

  dataStyleWrapper.appendChild(element)
  observeStyleDataWrapper(dataStyleWrapper)
  return dataStyleWrapper
}

/**
 * Creates a wrapper element with style data attributes.
 * @param styleData StyleData object containing style information.
 * @returns A new HTMLElement that wraps the style data.
 */
export function createWrapper(styleData?: StyleData) {
  const wrapper = document.createElement('div')
  wrapper.dataset[dataWrapperElementKey] = ''
  styleData && appendStyleData(wrapper, styleData)

  return wrapper
}

/**
 * Observes a wrapper element for child changes and removes it if it has no children.
 * @param wrapper HTMLElement to observe for child changes
 * Creates a MutationObserver that listens for childList changes on the wrapper element.
 * If the wrapper has no children after a change, it removes itself and disconnects the observer
 * to prevent further observations.
 */
export function observeStyleDataWrapper(wrapper: HTMLElement) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && wrapper.childNodes.length === 0) {
        wrapper.remove()
        observer.disconnect()
      }
    })
  })

  observer.observe(wrapper, { childList: true })
}

/**
 * Finds the closest parent element with style data.
 * @param element HTMLElement to search from
 * @returns The closest parent element with style data, the element itself if it has style data or null if no style data is found.
 */
export function findStyleDataWrapper(element: HTMLElement): HTMLElement | null {
  let currentNode = element
  while (currentNode.dataset[dataWrapperElementKey] !== '' && currentNode.parentElement) {
    currentNode = currentNode.parentElement
  }
  if (currentNode.dataset[dataWrapperElementKey] === '') {
    return currentNode
  }
  return null
}

/**
 * Recursively removes style data from an element and its children.
 * @param element HTMLElement to remove style data from.
 */
export function removeStyleDataRecursive(element: HTMLElement): void {
  if (element.dataset) {
    delete element.dataset[dataStyleIsolationKey]
    delete element.dataset[dataStyleIdKey]
    delete element.dataset[dataNoPortalLayoutStylesKey]
    delete element.dataset[dataMfeElementKey]
  }

  for (const child of Array.from(element.children)) {
    child instanceof HTMLElement && removeStyleDataRecursive(child)
  }
}

/**
 * Appends style data to an element.
 * @param element HTMLElement to append style data to.
 * @param styleData StyleData object containing style information.
 */
export function appendStyleData(element: HTMLElement, styleData: StyleData): void {
  element.dataset[dataStyleIsolationKey] = ''

  if (styleData.styleId) {
    element.dataset[dataStyleIdKey] = styleData.styleId
  }
  if (styleData.noPortalLayoutStyles || styleData.noPortalLayoutStyles === '') {
    element.dataset[dataNoPortalLayoutStylesKey] = styleData.noPortalLayoutStyles
  }
  if (styleData.mfeElement || styleData.mfeElement === '') {
    element.dataset[dataMfeElementKey] = styleData.mfeElement
  }
}

/**
 * Appends intermediate style data to an element.
 * @param element HTMLElement to append style data to.
 * @param styleData StyleData object containing style information.
 */
export function appendIntermediateStyleData(element: HTMLElement, styleData: StyleData): void {
  element.dataset[dataIntermediateStyleIdKey] = ''

  if (styleData.styleId) {
    element.dataset[dataIntermediateStyleIdKey] = styleData.styleId
  }
  if (styleData.noPortalLayoutStyles || styleData.noPortalLayoutStyles === '') {
    element.dataset[dataIntermediateNoPortalLayoutStylesKey] = styleData.noPortalLayoutStyles
  }
  if (styleData.mfeElement || styleData.mfeElement === '') {
    element.dataset[dataIntermediateMfeElementKey] = styleData.mfeElement
  }
}

/**
 * Gets the style data from an element or its intermediate style data if it exists.
 * @param element HTMLElement to get style data from
 * @returns StyleData object or null if no style data is found.
 */
export function getStyleDataOrIntermediateStyleData(element: Node | EventTarget): StyleData | null {
  const styleElement = findElementWithStyleDataOrIntermediateStyleData(element)
  if (!styleElement) return null

  return {
    styleId: styleElement.dataset[dataStyleIdKey] ?? styleElement.dataset[dataIntermediateStyleIdKey],
    noPortalLayoutStyles:
      styleElement.dataset[dataNoPortalLayoutStylesKey] ??
      styleElement.dataset[dataIntermediateNoPortalLayoutStylesKey],
    mfeElement: styleElement.dataset[dataMfeElementKey] ?? styleElement.dataset[dataIntermediateMfeElementKey]
  }
}

/**
 * Finds the closest parent element with style data or intermediate style data.
 * @param startNode Starting node to search from
 * @returns The closest parent element with style data or intermediate style data, or null if not found.
 */
export function findElementWithStyleDataOrIntermediateStyleData(startNode: Node | EventTarget): HTMLElement | null {
  let currentNode = startNode
  const hasStyleData = (node: HTMLElement) => node.dataset[dataStyleIdKey] || node.dataset[dataIntermediateStyleIdKey]
  while (currentNode instanceof HTMLElement && !hasStyleData(currentNode) && currentNode.parentElement) {
    currentNode = currentNode.parentElement
  }
  return currentNode instanceof HTMLElement && hasStyleData(currentNode) ? currentNode : null
}


```


File : update-angular-components-styles.utils.ts
```ts
import { dataNoPortalLayoutStylesKey, dataStyleIdKey, replacePrimengPrefix } from '@onecx/angular-utils'

/**
 * Updates styles of Angular components added to the document head.
 *
 * Affects only styles that:
 * - are Angular component styles (contain "_nghost" attribute).
 * - have styleId defined.
 * - do not have noPortalLayoutStyles defined.
 * - require PrimeNg prefix replacement.
 * @param mutationList
 */
export function updateAngularComponentsStyles(mutationList: MutationRecord[]) {
  const newComponentStyleNodes = mutationList
    .flatMap((mutation) => Array.from(mutation.addedNodes))
    .filter((node) => isAngularComponentStyle(node))

  newComponentStyleNodes.forEach((node) => {
    if (!node.textContent) {
      return
    }

    const { styleId, noPortalLayoutStyles } = getStyleDataFromNodeContent(node.textContent)
    if (!styleId || !doesStyleDataRequireReplacement(styleId, noPortalLayoutStyles)) {
      return
    }

    node.textContent = replacePrimengPrefix(node.textContent, styleId)
  })
}

function doesStyleDataRequireReplacement(styleId: string | null, noPortalLayoutStyles: string | null | undefined) {
  if (!styleId) return false

  return noPortalLayoutStyles === ''
}

function isAngularComponentStyle(node: Node): boolean {
  return node.textContent?.includes('[_nghost') ?? false
}

function getStyleDataFromNodeContent(nodeContent: string): {
  styleId: string | null
  noPortalLayoutStyles: string | null | undefined
} {
  const ngHostAttribute = getNgHostAttributeFromNodeContent(nodeContent)
  if (!ngHostAttribute)
    return {
      styleId: null,
      noPortalLayoutStyles: null
    }

  const ngHostElement = getElementWithNgHostAttribute(ngHostAttribute)
  if (!ngHostElement)
    return {
      styleId: null,
      noPortalLayoutStyles: null
    }

  return getScopeDataForElement(ngHostElement)
}

function getNgHostAttributeFromNodeContent(css: string): string | null {
  const ngHostAttributeRegex = /_nghost-([^\]]*)/
  const ngHostAttributeMatch = css.match(ngHostAttributeRegex) // NOSONAR
  if (ngHostAttributeMatch) {
    return ngHostAttributeMatch[0]
  }

  return null
}

function getElementWithNgHostAttribute(ngHostAttribute: string): HTMLElement | null {
  return document.querySelector(`[${ngHostAttribute}]`)
}

function getScopeDataForElement(element: HTMLElement): {
  styleId: string | null
  noPortalLayoutStyles: string | null | undefined
} {
  let currentElement: HTMLElement | null = element
  while (currentElement) {
    if (currentElement.dataset[dataStyleIdKey])
      return {
        styleId: currentElement.dataset[dataStyleIdKey],
        noPortalLayoutStyles: currentElement.dataset[dataNoPortalLayoutStylesKey]
      }
    currentElement = currentElement.parentElement
  }
  return {
    styleId: null,
    noPortalLayoutStyles: null
  }
}


```


File : update-required-wrapping-styles.utils.ts
```ts
import { dataStyleIdAttribute, dataStyleIsolationAttribute, isCssScopeRuleSupported } from '@onecx/angular-utils'
import { replaceRootAndHtmlWithScope } from '@onecx/angular-utils/style'
import { MARKED_FOR_WRAPPING, MARKED_AS_WRAPPED } from './shared-styles-host-overwrites.utils'

/**
 * Updates styles that require wrapping added to the document head.
 *
 * Affects only styles that:
 * - have attribute MARKED_FOR_WRAPPING defined
 * - are not already wrapped by scope or supports rules
 * - are not already wrapped by nghost attributes
 * @param mutationList - list of mutations to process
 */
export function updateRequiredWrappingStyles(mutationList: MutationRecord[]) {
  const newStyleNodesRequiringWrapping = mutationList
    .flatMap((mutation) => Array.from(mutation.addedNodes))
    .filter((node) => doesStyleRequireWrapping(node))

  newStyleNodesRequiringWrapping.forEach((node) => {
    if (!node.textContent) {
      markAsWrapped(node)
      return
    }

    const styleElement = node as HTMLStyleElement
    const markedForWrapping = styleElement.dataset[MARKED_FOR_WRAPPING]
    if (!markedForWrapping) {
      markAsWrapped(node)
      return
    }

    replaceAndWrapStyle(styleElement, markedForWrapping)
  })
}

/**
 * Checks if style requires wrapping.
 *
 * Style requires wrapping if it contains attribute MARKED_FOR_WRAPPING.
 * @param node - node to check
 * @returns {boolean} whether style requires wrapping
 */
function doesStyleRequireWrapping(node: Node): boolean {
  // Check if node is style node and contains attribute called MARKED_FOR_WRAPPING
  if (node.nodeName !== 'STYLE') {
    return false
  }

  const styleElement = node as HTMLStyleElement
  const markedForWrapping = styleElement.dataset[MARKED_FOR_WRAPPING]
  return !!markedForWrapping
}

/**
 * Deletes the MARKED_FOR_WRAPPING attribute from the style element and adds MARKED_AS_WRAPPED attribute.
 * @param styleElement - style element to mark
 */
function markAsWrapped(styleElement: Node) {
  if (styleElement.nodeName !== 'STYLE') {
    return
  }

  const styleEl = styleElement as HTMLStyleElement
  delete styleEl.dataset[MARKED_FOR_WRAPPING]
  styleEl.dataset[MARKED_AS_WRAPPED] = ''
}

/**
 * Replaces and wraps style content with scope rule.
 * @param styleElement - style element to replace
 * @param styleId - style id to use for wrapping
 * @returns {void}
 */
function replaceAndWrapStyle(styleElement: HTMLStyleElement, styleId: string) {
  if (!styleElement.textContent || isStyleWrapped(styleElement, styleId)) {
    markAsWrapped(styleElement)
    return
  }

  const newStyleElement = document.createElement('style')
  if (isCssScopeRuleSupported()) {
    const content = `
      @scope([${dataStyleIdAttribute}="${styleId}"]) to ([${dataStyleIsolationAttribute}]) {
        ${replaceRootAndHtmlWithScope(styleElement.textContent)}
      }
      `
    newStyleElement.appendChild(document.createTextNode(content))
  } else {
    const content = `
      @supports(@scope([${dataStyleIdAttribute}="${styleId}"]) to ([${dataStyleIsolationAttribute}])) {
        ${replaceRootAndHtmlWithScope(styleElement.textContent)}
      }
      `
    newStyleElement.appendChild(document.createTextNode(content))
    ;(newStyleElement as any).onecxOriginalCss = styleElement.textContent
  }

  copyDataset(styleElement.dataset, newStyleElement.dataset)
  markAsWrapped(newStyleElement)

  styleElement.replaceWith(newStyleElement)
}

/**
 * Checks if style is already wrapped.
 *
 * Style is considered wrapped if:
 * - it contains Angular component styles ([_nghost] attribute)
 * - it is marked as wrapped via MARKED_AS_WRAPPED attribute
 * - it contains scope rule for the given styleId
 * - it contains supports rule for the given styleId (in case scope rules are not supported)
 * @param styleElement
 * @param styleId
 * @returns {boolean} whether style is already wrapped
 */
function isStyleWrapped(styleElement: HTMLStyleElement, styleId: string): boolean {
  if (styleElement.textContent?.includes('[_nghost') || styleElement.dataset[MARKED_AS_WRAPPED] !== undefined) {
    return true
  }
  if (isCssScopeRuleSupported()) {
    return styleElement.textContent?.includes(`@scope([${dataStyleIdAttribute}="${styleId}"]`) ?? false
  } else {
    return styleElement.textContent?.includes(`@supports(@scope([${dataStyleIdAttribute}="${styleId}"]`) ?? false
  }
}

/**
 * Copies dataset from source to target.
 * @param source - source dataset
 * @param target - target dataset
 */
function copyDataset(source: DOMStringMap, target: DOMStringMap) {
  Object.keys(source).forEach((key) => {
    target[key] = source[key]
  })
}


```



********************************************************************************************************************************

FIle => onecx-shell-ui  > src > remotes > shell-toast > 

File : shell-toastcomponent.bootstrap.main.ts
```ts
import('./shell-toast.component.bootstrap').catch((err) => console.error(err)) // NOSONAR
```

File :  shell-toast.component.ts
```ts
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { TranslateLoader } from '@ngx-translate/core'
import { ReplaySubject } from 'rxjs'

import { bootstrapRemoteComponent } from '@onecx/angular-webcomponents'
import { provideTranslateServiceForRoot } from '@onecx/angular-remote-components'
import {
  createTranslateLoader,
  provideTranslationPathFromMeta,
  REMOTE_COMPONENT_CONFIG,
  RemoteComponentConfig
} from '@onecx/angular-utils'

import { environment } from 'src/environments/environment'

import { OneCXShellToastComponent } from './shell-toast.component'
import { provideAnimations } from '@angular/platform-browser/animations'

bootstrapRemoteComponent(OneCXShellToastComponent, 'ocx-shell-toast-component', environment.production, [
  { provide: REMOTE_COMPONENT_CONFIG, useValue: new ReplaySubject<RemoteComponentConfig>(1) },
  provideAnimations(),
  provideTranslateServiceForRoot({
    isolate: true,
    loader: {
      provide: TranslateLoader,
      useFactory: createTranslateLoader,
      deps: [HttpClient]
    }
  }),
  provideHttpClient(withInterceptorsFromDi()),
  provideTranslationPathFromMeta(import.meta.url, 'assets/i18n/')
])

```


File :  shell-toastcomponent.bootstrap.html
```html
<p-toast [style]="{'word-break': 'break-word'}"></p-toast>
```

File :  shell-toastcomponent.ts
```ts
import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import { UntilDestroy } from '@ngneat/until-destroy'
import { ReplaySubject } from 'rxjs'

import { AngularAcceleratorModule } from '@onecx/angular-accelerator'
import { Message, PortalMessageService } from '@onecx/angular-integration-interface'
import {
  AngularRemoteComponentsModule,
  ocxRemoteComponent,
  ocxRemoteWebcomponent
} from '@onecx/angular-remote-components'
import { REMOTE_COMPONENT_CONFIG, RemoteComponentConfig } from '@onecx/angular-utils'
import { MessageService } from 'primeng/api'
import { PrimeNG } from 'primeng/config'
import { ToastModule } from 'primeng/toast'

// Should be moved out of shell to another repo later, so that primeNG dependency can be started to be removed from shell
@Component({
  selector: 'ocx-shell-toast',
  templateUrl: './shell-toast.component.html',
  standalone: true,
  imports: [AngularRemoteComponentsModule, CommonModule, AngularAcceleratorModule, ToastModule],
  providers: [{ provide: REMOTE_COMPONENT_CONFIG, useValue: new ReplaySubject<string>(1) }, MessageService]
})
@UntilDestroy()
export class OneCXShellToastComponent implements ocxRemoteComponent, ocxRemoteWebcomponent, OnInit {
  private readonly rcConfig = inject<ReplaySubject<RemoteComponentConfig>>(REMOTE_COMPONENT_CONFIG)
  private readonly primengConfig = inject(PrimeNG)
  private readonly messageService = inject(MessageService)
  private readonly portalMessageService = inject(PortalMessageService)

  @Input() set ocxRemoteComponentConfig(rcConfig: RemoteComponentConfig) {
    this.ocxInitRemoteComponent(rcConfig)
  }

  constructor() {
    this.portalMessageService.message$.subscribe((message: Message) => this.messageService.add(message))
  }

  ngOnInit() {
    this.primengConfig.ripple.set(true)
  }

  public ocxInitRemoteComponent(rcConfig: RemoteComponentConfig) {
    this.rcConfig.next(rcConfig)
  }
}

```




********************************************************************************************************************************

FIle => onecx-shell-ui  > src > remotes > version-info > 


File : version-info.componenent.bootstrap.ts
```ts
import('./shell-toast.component.bootstrap').catch((err) => console.error(err)) // NOSONAR
```

File :  version-info.comonenet.main.ts
```ts
import('./version-info.component.bootstrap').catch((err) => console.error(err))
```


File :  version-info.componenent.html
```html
<div
  *ngIf="versionInfo$ | async as version"
  class="w-full text-right"
  [attr.aria-label]="'Version Information'"
  role="note"
>
  <span [attr.aria-label]="'Workspace'" [attr.title]="'Workspace'" role="note"> {{ version.workspaceName }} </span>
  <span [attr.aria-label]="'Shell'" [attr.title]="'Shell'" role="note"> {{ version.shellInfo }} </span>
  <span aria-hidden="true">{{ version.separator }}</span>
  <span [attr.aria-label]="'Microfrontend'" [attr.title]="'Microfrontend'" role="note"> {{ version.mfeInfo }} </span>
</div>

```

File :  version-info.componenet.ts
```ts
import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UntilDestroy } from '@ngneat/until-destroy'
import { combineLatest, from, map, Observable, ReplaySubject } from 'rxjs'

import { REMOTE_COMPONENT_CONFIG, RemoteComponentConfig } from '@onecx/angular-utils'
import {
  AngularRemoteComponentsModule,
  ocxRemoteComponent,
  ocxRemoteWebcomponent
} from '@onecx/angular-remote-components'
import { AppStateService, CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { AngularAcceleratorModule } from '@onecx/angular-accelerator'

export type Version = {
  workspaceName: string
  shellInfo?: string
  mfeInfo?: string
  separator?: string
}

@Component({
  selector: 'ocx-shell-version-info',
  templateUrl: './version-info.component.html',
  standalone: true,
  imports: [AngularRemoteComponentsModule, CommonModule, AngularAcceleratorModule],
  providers: [{ provide: REMOTE_COMPONENT_CONFIG, useValue: new ReplaySubject<string>(1) }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
@UntilDestroy()
export class OneCXVersionInfoComponent implements ocxRemoteComponent, ocxRemoteWebcomponent {
  private readonly rcConfig = inject<ReplaySubject<RemoteComponentConfig>>(REMOTE_COMPONENT_CONFIG)
  private readonly appState = inject(AppStateService)
  public readonly config = inject(ConfigurationService)

  @Input() set ocxRemoteComponentConfig(rcConfig: RemoteComponentConfig) {
    this.ocxInitRemoteComponent(rcConfig)
  }

  public versionInfo$: Observable<Version | undefined> = combineLatest([
    this.appState.currentMfe$.asObservable(),
    this.appState.currentWorkspace$.asObservable(),
    this.config.getProperty(CONFIG_KEY.APP_VERSION),
    from(this.config.isInitialized)
  ]).pipe(
    map(([mfe, workspace, hostVersion]) => {
      const mfeVersion = mfe.version ?? ''
      const mfeInfo = mfe.displayName + (mfe.version ? ' ' + mfeVersion : '')
      const version: Version = {
        workspaceName: workspace.workspaceName,
        shellInfo: hostVersion,
        mfeInfo: mfe.displayName ? mfeInfo : '',
        separator: mfe.displayName || mfe.version ? ' - ' : ''
      }
      return version
    })
  )

  public ocxInitRemoteComponent(rcConfig: RemoteComponentConfig) {
    this.rcConfig.next(rcConfig)
  }
}


```






Rem -- 
modules
shared folder
shell - compoenents
scope-utils
assets