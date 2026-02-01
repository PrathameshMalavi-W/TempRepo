# Icon Service Implementation Guide

## Overview

The Icon Service provides a centralized, cached system for loading and applying SVG icons across the shell. It automatically batches requests to the BFF, debounces multiple calls, and caches results to minimize network traffic.

## Architecture

### Components

1. **`integration-interface/IconService`** (Framework-independent)
   - Core logic: caching, CSS class generation, icon requests
   - Publishes `IconRequested` and listens for `IconsReceived` via `IconsTopic`
   - Lives in `window.onecxIcons` cache

2. **`angular-integration-interface/IconService`** (Angular wrapper)
   - Injectable service with `@Injectable()` decorator
   - Wraps the core `IconService` for Angular DI
   - Implements `OnDestroy` for cleanup

3. **`shell/IconLoaderService`** (Shell-side loader)
   - Listens to `IconRequested` messages from all MFEs
   - Batches requests over 100ms (debounce)
   - Calls BFF via `IconBffService.findIconsByNamesAndRefId()`
   - Updates `window.onecxIcons` cache
   - Publishes `IconsReceived` when done

### Flow

```
Component A requests icon "home"
    ↓
IconService checks window.onecxIcons cache
    ├─ If found (string): return CSS class name immediately
    ├─ If null: icon doesn't exist, return null
    ├─ If undefined: pending, return placeholder class name
    └─ If missing: add to cache as undefined, publish IconRequested
    ↓
IconLoaderService receives IconRequested (debounces 100ms)
    ↓
Collects all pending icons and calls BFF
    ↓
BFF returns icon SVG bodies
    ↓
IconLoaderService updates window.onecxIcons cache with SVG bodies
    ↓
IconLoaderService publishes IconsReceived
    ↓
getIconClassAsync() receives IconsReceived, returns final CSS class name
```

## How to Use

### 1. Inject in Your Component

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import { IconService } from '@onecx/angular-integration-interface'

@Component({
  selector: 'app-my-component',
  standalone: true,
  template: `
    <div [class]="iconClass"></div>
    <button [class]="deleteIconClass">Delete</button>
  `
})
export class MyComponent implements OnInit, OnDestroy {
  private readonly iconService = inject(IconService)
  
  iconClass = ''
  deleteIconClass = ''

  ngOnInit() {
    // Request icons
    this.iconClass = this.iconService.getIconClass('my-icon')
    this.deleteIconClass = this.iconService.getIconClass('delete-icon', 'svg')
  }

  ngOnDestroy() {
    // Cleanup handled by IconService internally
  }
}
```

### 2. Get Icon Class Name (Synchronous)

Returns immediately, may show placeholder if icon not yet loaded.

```typescript
const className = this.iconService.getIconClass(name, classType?)

// Parameters:
// name: string - icon name (e.g., 'home-icon', 'settings')
// classType?: 'svg' | 'background' | 'background-before' (default: 'background-before')

// Returns: string
// Example: 'onecx-theme-icon-background-before-home-icon'

// Usage:
const homeClass = this.iconService.getIconClass('home-icon')
const settingsClass = this.iconService.getIconClass('settings-icon', 'svg')
const deleteClass = this.iconService.getIconClass('delete-icon', 'background')
```

### 3. Get Icon Class Name (Asynchronous)

Waits for the icon to be loaded, then returns the class name or null if not found.

```typescript
const className = await this.iconService.getIconClassAsync(name, classType?)

// Parameters:
// name: string - icon name
// classType?: 'svg' | 'background' | 'background-before' (default: 'background-before')

// Returns: Promise<string | null>
// null = BFF indicated icon does not exist
// string = CSS class name ready to use

// Usage:
const homeClass = await this.iconService.getIconClassAsync('home-icon')
if (homeClass) {
  this.homeIconClass = homeClass
} else {
  this.homeIconClass = 'fallback-icon-class'
}
```

## CSS Class Types

### 1. `background-before` (Default)

Uses SVG as `::before` pseudo-element background.

```css
.onecx-theme-icon-background-before-home-icon::before {
  content: '';
  display: inline-block;
  background-image: url("data:image/svg+xml;utf8,<svg>...</svg>");
  background-repeat: no-repeat;
  background-size: contain;
}
```

**Best for:** Icons inside text, inline elements

```typescript
<span [class]="iconService.getIconClass('home-icon', 'background-before')">Home</span>
```

### 2. `background`

Uses SVG as direct background-image on element.

```css
.onecx-theme-icon-background-home-icon {
  background-image: url("data:image/svg+xml;utf8,<svg>...</svg>");
  background-repeat: no-repeat;
  background-size: contain;
  display: inline-block;
}
```

**Best for:** Divs, standalone icon containers

```typescript
<div [class]="iconService.getIconClass('home-icon', 'background')" 
     style="width:32px; height:32px;"></div>
```

### 3. `svg`

Uses SVG as CSS background following [Iconify.design approach](https://iconify.design/docs/usage/svg-css/#example).

```css
.onecx-theme-icon-svg-home-icon {
  background-image: url("data:image/svg+xml;utf8,<svg>...</svg>");
  background-repeat: no-repeat;
  background-size: contain;
  display: inline-block;
}
```

**Best for:** Modern browsers, direct SVG support

```typescript
<span [class]="iconService.getIconClass('home-icon', 'svg')"></span>
```

## CSS Class Name Format

Generated format: `onecx-theme-icon-<classType>-<sanitized-name>`

Examples:
- `onecx-theme-icon-background-before-home-icon`
- `onecx-theme-icon-svg-delete-icon`
- `onecx-theme-icon-background-user-profile`

**Name sanitization:** Special characters are replaced with `-` and converted to lowercase.

```typescript
// Input: 'User-Profile_Icon'
// Output: 'onecx-theme-icon-background-before-user-profile-icon'
```

## Caching

The cache is stored in `window.onecxIcons` and persists for the lifetime of the app.

### Cache States

```typescript
window.onecxIcons = {
  'home-icon': '<svg>...</svg>',     // Loaded (string)
  'delete-icon': null,                // Not found (null)
  'pending-icon': undefined,          // Pending load (undefined)
}
```

### Automatic Cache Management

1. **First request** → Icon added to cache as `undefined`
2. **IconRequested published** → Shell loader collects requests
3. **Shell fetches from BFF** → Updates cache with SVG body or `null`
4. **IconsReceived published** → All waiting async calls resolve

**No manual cache invalidation needed** — cache persists for app lifetime.

## Debouncing & Batching

The `IconLoaderService` automatically:

1. **Debounces** with `bufferTime(100ms)` — collects all `IconRequested` messages for 100ms
2. **Deduplicates** — removes duplicate icon names from the batch
3. **Filters** — only requests icons not yet in cache or still pending
4. **Batches** — sends one request to BFF with all names
5. **Updates cache** — writes all results back to `window.onecxIcons`
6. **Publishes once** — one `IconsReceived` event for the entire batch

**Result:** Multiple components calling `getIconClass()` within 1 second = 1 BFF request

## Integration with BFF

The shell calls: `IconBffService.findIconsByNamesAndRefId(refId, { names })`

### BFF Contract

**Request:**
```typescript
{
  refId: string,  // theme name or workspace ID
  names: string[] // ['home-icon', 'settings-icon', ...]
}
```

**Response:**
```typescript
{
  icons: [
    { name: 'home-icon', body: '<svg>...</svg>' },
    { name: 'settings-icon', body: '<svg>...</svg>' },
    { name: 'missing-icon', body: null }
  ]
}
```

**Icon with `body: null`** → Treated as "not found", cache stores as `null`

## Complete Example: Feature Module

```typescript
// my-feature.component.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconService } from '@onecx/angular-integration-interface'

@Component({
  selector: 'app-my-feature',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toolbar">
      <!-- Sync: Shows immediately with placeholder if loading -->
      <button [class]="homeIcon">Home</button>
      
      <!-- Async: Waits for load, then shows real icon -->
      <button *ngIf="settingsIcon" [class]="settingsIcon">Settings</button>
      
      <!-- With fallback -->
      <button [class]="deleteIcon || 'fallback-delete-icon'">Delete</button>
    </div>
  `,
  styles: [`
    button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
    }
  `]
})
export class MyFeatureComponent implements OnInit, OnDestroy {
  private readonly iconService = inject(IconService)

  homeIcon = ''
  settingsIcon = ''
  deleteIcon = ''

  ngOnInit() {
    // Sync request - immediate, may be placeholder
    this.homeIcon = this.iconService.getIconClass('home-icon', 'background-before')

    // Async request - wait for actual icon
    this.iconService.getIconClassAsync('settings-icon', 'background-before').then(result => {
      this.settingsIcon = result || 'fallback-settings-icon'
    }).catch(err => {
      console.error('Failed to load settings icon:', err)
      this.settingsIcon = 'fallback-settings-icon'
    })

    // Mix: Sync with async check
    this.deleteIcon = this.iconService.getIconClass('delete-icon', 'svg')
    this.iconService.getIconClassAsync('delete-icon', 'svg').then(result => {
      if (result) this.deleteIcon = result
    })
  }

  ngOnDestroy() {
    // No cleanup needed - IconService handles it
  }
}
```

## Best Practices

### 1. Use Sync for Non-Critical Icons

Placeholder is acceptable for secondary UI elements.

```typescript
// Good: User immediately sees placeholder
const navIcon = this.iconService.getIconClass('nav-item-icon')

// Later when loaded: CSS style updates, real SVG shown
```

### 2. Use Async for Important Icons

Wait for actual icon before rendering critical UI.

```typescript
// Good: Don't show delete button until icon loads
this.iconService.getIconClassAsync('delete-icon').then(result => {
  this.deleteIconReady = !!result
})
```

### 3. Set Icon Names Once in OnInit

Don't call `getIconClass()` repeatedly in templates.

```typescript
// Bad
template: `<div [class]="iconService.getIconClass('home')"></div>`

// Good
export class MyComp {
  homeClass = this.iconService.getIconClass('home')
}
```

### 4. Handle Missing Icons

BFF may return `null` for icons that don't exist.

```typescript
const icon = await this.iconService.getIconClassAsync('maybe-missing')
if (icon) {
  this.iconClass = icon
} else {
  this.iconClass = 'default-fallback-icon'
}
```

### 5. Use Consistent Icon Names

Coordinate with your icon database schema.

```typescript
// Define as constants
export const ICON_NAMES = {
  HOME: 'home-icon',
  SETTINGS: 'settings-icon',
  DELETE: 'delete-icon'
}

// Use in component
this.homeIcon = this.iconService.getIconClass(ICON_NAMES.HOME)
```

## Testing

### Unit Test Example

```typescript
import { TestBed } from '@angular/core/testing'
import { IconService } from '@onecx/angular-integration-interface'
import { MyComponent } from './my.component'

describe('MyComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [IconService]
    })
  })

  it('should request icons on init', () => {
    const fixture = TestBed.createComponent(MyComponent)
    const comp = fixture.componentInstance
    spyOn(comp['iconService'], 'getIconClass').and.returnValue('test-class')
    
    fixture.detectChanges()
    
    expect(comp['iconService'].getIconClass).toHaveBeenCalled()
    expect(comp.homeIcon).toBe('test-class')
  })
})
```

## Troubleshooting

### Icons Not Loading

1. Check BFF is returning icons with `body` field
2. Verify icon names match your database
3. Check browser console for `[IconLoaderService]` logs
4. Verify `window.onecxIcons` cache in DevTools

### CSS Not Applying

1. Ensure width/height set on element
2. Check generated CSS class name: `onecx-theme-icon-*`
3. Verify no CSS conflicts in your styles
4. Check DevTools Computed Styles tab

### Performance Issues

1. Batch requests are debounced automatically (100ms)
2. Cache prevents duplicate requests
3. Monitor network tab for BFF calls
4. Consider using sync method for non-critical icons

## Reference

### IconService API

```typescript
// Sync: immediate return
getIconClass(name: string, classType?: 'svg' | 'background' | 'background-before'): string

// Async: wait for load
getIconClassAsync(name: string, classType?: 'svg' | 'background' | 'background-before'): Promise<string | null>

// Cleanup
destroy(): void  // Called automatically on component destroy
```

### IconsTopic API (Advanced)

```typescript
// Listen for icon updates across all MFEs
const iconsTopic = new IconsTopic()
iconsTopic.asObservable().subscribe(payload => {
  if (payload.kind === 'IconsReceived') {
    console.log('Icons received:', payload.icons)
  }
})
```

### Window Cache

```typescript
// Direct access to icon cache (for debugging)
window.onecxIcons // { [iconName]: string | null | undefined }
```

## Shell Integration (Already Done)

The `IconLoaderService` in the shell:
- ✅ Initializes `window.onecxIcons` cache
- ✅ Subscribes to `IconRequested` topic
- ✅ Debounces with 100ms buffer
- ✅ Calls BFF with batched icon names
- ✅ Updates cache with responses
- ✅ Publishes `IconsReceived` notification

**No additional setup needed** in your components — just inject `IconService` and use!
