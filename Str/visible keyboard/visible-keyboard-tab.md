
[A11y] Visible Keyboard Focus for Interactive Elements
Estimate:	1
Details
Status:New (View Workflow)
Priority: Medium
Component/s:
OneCX-Widget
Labels:
PI-2026-01
Affects Version/s:None
Fix Version/s:None
Epic Link:[OneCX Libs] (Future) Fixing A11y issues
People
Reporter:

 Sandeep Rade, Priyanka 
Assignee:

 Unassigned
Assign to me
Dates
Created:
11/Dec/25 6:25 AM
Updated:
1 week ago 11:06 AM
Issue Links
Affects test execution of
Epic - Created by Jira Software - do not edit or delete. Issue type for a big user story that needs to be broken down. P002271-9683 [OneCX Libs] (Future) Fixing A11y issues	Medium - Has a potential to affect progress. New
Delete this link
Add Link
Description
As a keyboard user
I want all interactive elements (such as buttons and checkboxes) to have a clearly visible focus state
So that I can easily navigate and interact with the web application without losing track of my position

Acceptance Criteria:
Given I am navigating the web application using a keyboard
When I tab to any interactive element (e.g., buttons, checkboxes, chevron arrows)
Then the element must display a visible focus indicator (e.g., a border at least 2px wide with a minimum contrast ratio of 3:1)

The focus indicator must not be removed via CSS (e.g., no outline: 0 without a replacement).
The focus indicator must be visible on all states and pop-ups, including the Timeslot-Group wizard and Custom group column selection.
Edge cases such as disabled elements or elements inside modals/pop-ups must also have a visible focus if they are focusable.
Make the focus indicator width configurable. Focus color contrast cannot be guaranteed, as it depends on the consuming application.
Recommendation
Use CSS properties to clearly highlight focus, such as a border at least 2px wide and a minimum contrast ratio of 3:1.
Do not remove the system focus (e.g., using outline: 0) unless you provide a custom visible focus style.
Consider implementing a custom focus highlight (e.g., inversion of foreground and background colors) in addition to the system focus for better visibility.
Test: 

Test Case 1: Focus Indicator on Buttons

Given: The user navigates to a page with buttons using the Tab key
When: A button receives keyboard focus
Then: The button displays a visible focus indicator (e.g., a border at least 2px wide with a contrast ratio of at least 3:1)
Test Case 2: Focus Indicator on Checkboxes

Given: The user navigates to a page with checkboxes using the Tab key
When: A checkbox receives keyboard focus
Then: The checkbox displays a visible focus indicator
Test Case 3: Focus Indicator in Pop-ups/Modals

Given: The user opens a pop-up or modal with interactive elements
When: The user tabs to any interactive element inside the pop-up
Then: The element displays a visible focus indicator
Test Case 4: No Removal of System Focus

Given: The user navigates the application with a keyboard
When: Any interactive element receives focus
Then: The system focus is not removed via CSS (e.g., no outline: 0 without a replacement)




<!-- ****************************************************************************************************************************************************************** -->
<!-- ****************************************************************************************************************************************************************** -->

Approach 1 : 
```ts
import {
    Directive,
    Renderer2,
    OnDestroy,
    Inject,
    AfterViewInit,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    'input:not([disabled]):not([type="hidden"])',
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]',
    '[role="link"]',
    '[role="checkbox"]',
    '[role="radio"]',
    '[role="switch"]',
    '[contenteditable="true"]',
].join(",");

const ROLE_WRAPPER_MAP: Record<string, string> = {
    combobox: ".p-dropdown",
    checkbox: ".p-checkbox",
    radio: ".p-radiobutton",
    switch: ".p-inputswitch",
};

@Directive({ 
    selector: "[appGlobalFocusOutline]", 
    standalone: true 
})
export class GlobalFocusOutlineDirective implements AfterViewInit, OnDestroy {
    private lastFocused: HTMLElement | null = null;
    private unlistenFocusIn!: () => void;
    private unlistenFocusOut!: () => void;
    
    constructor(
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document,
    ) { }

    ngAfterViewInit() {
        this.unlistenFocusIn = this.renderer.listen(
            this.document,
            "focusin",
            this.onFocusIn,
        );
        this.unlistenFocusOut = this.renderer.listen(
            this.document,
            "focusout",
            this.onFocusOut,
        );
    }

    private onFocusIn = (event: FocusEvent) => {
        const target = event.target as HTMLElement;
        if (!target) return;
        this.clearOutline();
        const outlineTarget = this.resolveOutlineTarget(target);
        if (!outlineTarget) return;
        this.lastFocused = outlineTarget;
        this.renderer.addClass(this.lastFocused, "global-focus-outline");
    };

    private onFocusOut = () => {
        this.clearOutline();
    };

    private clearOutline() {
        if (this.lastFocused) {
            this.renderer.removeClass(this.lastFocused, "global-focus-outline");
            this.lastFocused = null;
        }
    }

    ngOnDestroy() {
        this.unlistenFocusIn?.();
        this.unlistenFocusOut?.();
    }

    private resolveOutlineTarget(target: HTMLElement): HTMLElement | null {
        const doc = this.document as Document;
        if (target === doc.body || target === doc.documentElement) return null;
        const role = target.getAttribute("role");
        if (role && ROLE_WRAPPER_MAP[role]) {
            const wrapper = target.closest(
                ROLE_WRAPPER_MAP[role],
            ) as HTMLElement | null;
            if (wrapper) return wrapper;
        }
        if (this.isFocusable(target) && target.tagName !== "A") {
            const descendantAnchor = target.querySelector(
                "a[href]",
            ) as HTMLElement | null;
            if (descendantAnchor) return descendantAnchor;
        }
        if (this.isFocusable(target)) {
            return target;
        }
        const nearest = target.closest(FOCUSABLE_SELECTOR) as HTMLElement | null;
        if (nearest) {
            return nearest;
        }
        return null;
    }
    
    private isFocusable(el: HTMLElement | null): boolean {
        if (!el) return false;
        const isDisabled =
            (el as any).disabled === true ||
            el.getAttribute("disabled") !== null ||
            el.getAttribute("aria-disabled") === "true";
        if (isDisabled) return false;
        if (el.tagName === "INPUT" && (el as HTMLInputElement).type === "hidden") {
            return false;
        }
        if ((el as any).matches?.(FOCUSABLE_SELECTOR)) {
            return true;
        }
        return el.tabIndex >= 0;
    }
}
```

```scss
.global-focus-outline { 
    // outline: 2px solid #1976d2; 
    outline: 3px solid black !important; 
    outline-offset: 2px !important; 
    background-color: blue !important; 
    position: relative !important; 
    z-index: 1000 !important; 
}
```


```html
<ocx-shell-portal-viewport appGlobalFocusOutline></ocx-shell-portal-viewport>
```






<!-- ****************************************************************************************************************************************************************** -->
<!-- ****************************************************************************************************************************************************************** -->

Approach 2 : Not working complete => table skipping and menubutton not highlighted 
```ts
import {
  Directive,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[contenteditable="true"]'
].join(',');

/**
 * Minimal wrapper overrides ONLY for composite PrimeNG controls
 * (where focused element is not visually representative)
 */
const COMPOSITE_WRAPPERS = [
  '.p-checkbox',
  '.p-radiobutton',
  '.p-inputswitch',
  '.p-dropdown'
].join(',');

@Directive({
  selector: '[appGlobalFocusOutline]',
  standalone: true
})
export class GlobalFocusOutlineDirective
  implements AfterViewInit, OnDestroy {

  private lastHost: HTMLElement | null = null;
  private isKeyboardMode = false;

  private unlistenFocusIn!: () => void;
  private unlistenKeyDown!: () => void;
  private unlistenMouseDown!: () => void;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  // --------------------------------------------------
  // lifecycle
  // --------------------------------------------------
  ngAfterViewInit(): void {
    // keyboard detection
    this.unlistenKeyDown = this.renderer.listen(
      this.document,
      'keydown',
      (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          this.isKeyboardMode = true;
        }
      }
    );

    this.unlistenMouseDown = this.renderer.listen(
      this.document,
      'mousedown',
      () => {
        this.isKeyboardMode = false;
      }
    );

    // global focus handling
    this.unlistenFocusIn = this.renderer.listen(
      this.document,
      'focusin',
      this.onFocusIn
    );
  }

  ngOnDestroy(): void {
    this.unlistenFocusIn?.();
    this.unlistenKeyDown?.();
    this.unlistenMouseDown?.();
  }

  // --------------------------------------------------
  // focusin handler
  // --------------------------------------------------
  private onFocusIn = (event: FocusEvent): void => {
    if (!this.isKeyboardMode) return;

    const target = event.target as HTMLElement | null;
    if (!target) return;

    const host = this.resolveFocusHost(target);
    if (!host || host === this.lastHost) return;

    // clear previous
    this.clear();

    // mark new focus host
    host.setAttribute('data-ocx-focus-host', '');
    this.lastHost = host;
  };

  // --------------------------------------------------
  // cleanup
  // --------------------------------------------------
  private clear(): void {
    if (this.lastHost) {
      this.lastHost.removeAttribute('data-ocx-focus-host');
      this.lastHost = null;
    }
  }

  // --------------------------------------------------
  // focus host resolution (YOUR approach preserved)
  // --------------------------------------------------
  private resolveFocusHost(target: HTMLElement): HTMLElement | null {
    const doc = this.document;
    if (target === doc.body || target === doc.documentElement) {
      return null;
    }

    // 1️⃣ Composite PrimeNG controls (small, justified set)
    const composite = target.closest(COMPOSITE_WRAPPERS);
    if (composite instanceof HTMLElement) {
      return composite;
    }

    // 2️⃣ If target itself is focusable, use it (breadcrumb/menu works here)
    if (this.isFocusable(target)) {
      return target;
    }

    // 3️⃣ Fallback to nearest focusable ancestor
    return target.closest(FOCUSABLE_SELECTOR) as HTMLElement | null;
  }

  // --------------------------------------------------
  // focusable check (unchanged from your logic)
  // --------------------------------------------------
  private isFocusable(el: HTMLElement | null): boolean {
    if (!el) return false;

    if (
      (el as any).disabled === true ||
      el.getAttribute('disabled') !== null ||
      el.getAttribute('aria-disabled') === 'true'
    ) {
      return false;
    }

    if (
      el.tagName === 'INPUT' &&
      (el as HTMLInputElement).type === 'hidden'
    ) {
      return false;
    }

    if ((el as any).matches?.(FOCUSABLE_SELECTOR)) {
      return true;
    }

    return el.tabIndex >= 0;
  }
}

```

```scss
/* configurable tokens (optional but recommended) */
:root {
  --ocx-focus-width: 3px;
  --ocx-focus-offset: 2px;
  --ocx-focus-color: black;
  --ocx-focus-bg: blue;
}

/* focus-within driven focus indicator */
[data-ocx-focus-host]:focus-within {
  outline: var(--ocx-focus-width) solid var(--ocx-focus-color) !important;
  outline-offset: var(--ocx-focus-offset) !important;
  background-color: var(--ocx-focus-bg) !important;
  position: relative !important;
  z-index: 1000 !important;
}


```


```html
<ocx-shell-portal-viewport appGlobalFocusOutline>
</ocx-shell-portal-viewport>

```





<!-- ****************************************************************************************************************************************************************** -->
<!-- ****************************************************************************************************************************************************************** -->

Approach 3 :  buggy
```ts
import {
  Directive,
  Renderer2,
  Inject,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appGlobalFocusOutline]',
  standalone: true
})
export class GlobalFocusOutlineDirective
  implements AfterViewInit, OnDestroy {

  private activeHost: HTMLElement | null = null;
  private unlistenFocusIn!: () => void;
  private unlistenFocusOut!: () => void;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngAfterViewInit() {
    this.unlistenFocusIn = this.renderer.listen(
      this.document,
      'focusin',
      this.onFocusIn
    );

    this.unlistenFocusOut = this.renderer.listen(
      this.document,
      'focusout',
      this.onFocusOut
    );
  }

  private onFocusIn = (event: FocusEvent) => {
    const target = event.target as HTMLElement;
    if (!target || !this.isFocusable(target)) return;

    this.clear();

    const host =
      this.findCompositeWrapper(target) ??
      target.closest(FOCUSABLE_SELECTOR) ??
      target;

    if (!this.isValidHost(host)) return;

    this.activeHost = host;
    this.renderer.addClass(host, 'ocx-focus-host');
  };

  private onFocusOut = () => {
    this.clear();
  };

  private clear() {
    if (this.activeHost) {
      this.renderer.removeClass(this.activeHost, 'ocx-focus-host');
      this.activeHost = null;
    }
  }

  private findCompositeWrapper(el: HTMLElement): HTMLElement | null {
    return el.closest(COMPOSITE_WRAPPERS);
  }

  private isFocusable(el: HTMLElement): boolean {
    if ((el as any).disabled) return false;
    if (el.getAttribute('aria-disabled') === 'true') return false;
    if (el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'hidden') {
      return false;
    }
    return el.matches(FOCUSABLE_SELECTOR);
  }

  private isValidHost(el: HTMLElement | null): el is HTMLElement {
    if (!el) return false;

    // never highlight layout containers
    if (
      el === this.document.body ||
      el === this.document.documentElement
    ) {
      return false;
    }

    return true;
  }

  ngOnDestroy() {
    this.unlistenFocusIn?.();
    this.unlistenFocusOut?.();
  }
}


```

```scss

.ocx-focus-host:focus-within {
  outline: var(--ocx-focus-width, 3px) solid black !important;
  outline-offset: 2px !important;
  position: relative;
  z-index: 1000;
}

```







<!-- ****************************************************************************************************************************************************************** -->
<!-- ****************************************************************************************************************************************************************** -->
Works but some bugs like double border and menu focus
Approach 4 : 
```ts
import {
  Directive,
  Renderer2,
  Inject,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[contenteditable="true"]'
].join(',');

/**
 * Visual composite wrappers (PrimeNG + similar)
 * These are NOT required to be exhaustive.
 */
const COMPOSITE_WRAPPERS = [
  '.p-checkbox',
  '.p-radiobutton',
  '.p-inputswitch',
  '.p-dropdown',
  '.p-multiselect',
  '.p-treeselect',
  '.p-autocomplete',
  '.p-cascadeselect'
].join(',');

@Directive({
  selector: '[appGlobalFocusOutline]',
  standalone: true
})
export class GlobalFocusOutlineDirective
  implements AfterViewInit, OnDestroy {

  private activeHost: HTMLElement | null = null;
  private isKeyboardMode = false;

  private unlistenFocusIn!: () => void;
  private unlistenFocusOut!: () => void;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngAfterViewInit() {
    // Keyboard modality detection
    this.renderer.listen(this.document, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        this.isKeyboardMode = true;
      }
    });

    this.renderer.listen(this.document, 'mousedown', () => {
      this.isKeyboardMode = false;
    });

    this.unlistenFocusIn = this.renderer.listen(
      this.document,
      'focusin',
      this.onFocusIn
    );

    this.unlistenFocusOut = this.renderer.listen(
      this.document,
      'focusout',
      this.onFocusOut
    );
  }

  private onFocusIn = (event: FocusEvent) => {
    if (!this.isKeyboardMode) return;

    const target = event.target as HTMLElement;
    if (!this.isFocusable(target)) return;

    this.clear();

    const host =
      target.closest(COMPOSITE_WRAPPERS) ??
      target.closest(FOCUSABLE_SELECTOR) ??
      target;

    if (!this.isValidHost(host)) return;

    this.activeHost = host;

    // Mark focus host
    this.renderer.addClass(host, 'ocx-focus-host');

    // Mark layout safety
    const layoutSafe = this.isLayoutSafe(host);
    this.renderer.setAttribute(
      host,
      'data-ocx-layout-safe',
      String(layoutSafe)
    );
  };

  private onFocusOut = () => {
    this.clear();
  };

  private clear() {
    if (this.activeHost) {
      this.renderer.removeClass(this.activeHost, 'ocx-focus-host');
      this.renderer.removeAttribute(this.activeHost, 'data-ocx-layout-safe');
      this.activeHost = null;
    }
  }

  private isFocusable(el: HTMLElement | null): boolean {
    if (!el) return false;
    if ((el as any).disabled) return false;
    if (el.getAttribute('aria-disabled') === 'true') return false;
    if (el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'hidden') {
      return false;
    }
    return el.matches(FOCUSABLE_SELECTOR);
  }

  private isValidHost(el: HTMLElement | null): el is HTMLElement {
    return !!el && el !== this.document.body && el !== this.document.documentElement;
  }

  /**
   * Determines whether applying outline would break layout.
   */
  private isLayoutSafe(el: HTMLElement): boolean {
    const style = window.getComputedStyle(el);

    if (style.position === 'sticky') return false;
    if (style.transform !== 'none') return false;
    if (style.overflow !== 'visible') return false;

    return true;
  }

  ngOnDestroy() {
    this.unlistenFocusIn?.();
    this.unlistenFocusOut?.();
  }
}


```

```scss
/* Base focus indicator */
.ocx-focus-host:focus,
.ocx-focus-host:focus-within {
  outline: var(--ocx-focus-width, 3px) solid black;
  outline-offset: 2px;
}

/* Layout-safe override for layout-sensitive elements */
.ocx-focus-host[data-ocx-layout-safe="false"]:focus,
.ocx-focus-host[data-ocx-layout-safe="false"]:focus-within {
  outline: none;
  box-shadow: inset 0 0 0 var(--ocx-focus-width, 3px) black;
}

```




<!-- ****************************************************************************************************************************************************************** -->
<!-- ****************************************************************************************************************************************************************** -->

Approach 5 : 
```ts
import {
  Directive,
  Renderer2,
  Inject,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[contenteditable="true"]'
].join(',');

const COMPOSITE_WRAPPERS = [
  '.p-checkbox',
  '.p-radiobutton',
  '.p-inputswitch',
  '.p-dropdown',
  '.p-multiselect',
  '.p-treeselect',
  '.p-autocomplete',
  '.p-cascadeselect'
].join(',');

@Directive({
  selector: '[appGlobalFocusOutline]',
  standalone: true
})
export class GlobalFocusOutlineDirective
  implements AfterViewInit, OnDestroy {

  private activeHost: HTMLElement | null = null;
  private keyboardMode = false;

  private unlistenFocusIn!: () => void;
  private unlistenFocusOut!: () => void;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngAfterViewInit() {
    // keyboard modality detection
    this.renderer.listen(this.document, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        this.keyboardMode = true;
      }
    });

    this.renderer.listen(this.document, 'mousedown', () => {
      this.keyboardMode = false;
    });

    this.unlistenFocusIn = this.renderer.listen(
      this.document,
      'focusin',
      this.onFocusIn
    );

    this.unlistenFocusOut = this.renderer.listen(
      this.document,
      'focusout',
      this.clear
    );
  }

  private onFocusIn = (event: FocusEvent) => {
    if (!this.keyboardMode) return;

    const target = event.target as HTMLElement;
    if (!this.isFocusable(target)) return;

    this.clear();

    const host =
      target.closest(COMPOSITE_WRAPPERS) ??
      target.closest(FOCUSABLE_SELECTOR) ??
      target;

    if (!host || host === this.document.body || host === this.document.documentElement) {
      return;
    }

    this.activeHost = host;
    this.renderer.addClass(host, 'ocx-focus-host');
  };

  private clear = () => {
    if (this.activeHost) {
      this.renderer.removeClass(this.activeHost, 'ocx-focus-host');
      this.activeHost = null;
    }
  };

  private isFocusable(el: HTMLElement | null): boolean {
    if (!el) return false;
    if ((el as any).disabled) return false;
    if (el.getAttribute('aria-disabled') === 'true') return false;
    if (el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'hidden') {
      return false;
    }
    return el.matches(FOCUSABLE_SELECTOR);
  }

  ngOnDestroy() {
    this.unlistenFocusIn?.();
    this.unlistenFocusOut?.();
  }
}


```

```scss
/* Global keyboard focus indicator */
.ocx-focus-host:is(:focus, :focus-within) {
  /* remove native focus to avoid double border */
  outline: none !important;

  /* custom focus indicator */
  box-shadow: inset 0 0 0 var(--ocx-focus-width, 3px) black;

  /* testing visibility */
  background-color: blue !important;

  position: relative;
  z-index: 1000;
}

```


<!-- ****************************************************************************************************************************************************************** -->
<!-- ****************************************************************************************************************************************************************** -->

Approach 6 : 
```ts


```

```scss


```


```html


```





<!-- ****************************************************************************************************************************************************************** -->
<!-- ****************************************************************************************************************************************************************** -->

Approach 7 : 
```ts


```

```scss


```


```html


```





<!-- ****************************************************************************************************************************************************************** -->
<!-- ****************************************************************************************************************************************************************** -->

Approach 8 : 
```ts


```

```scss


```


```html


```





<!-- ****************************************************************************************************************************************************************** -->
<!-- ****************************************************************************************************************************************************************** -->

Approach 9 : 
```ts


```

```scss


```


```html


```