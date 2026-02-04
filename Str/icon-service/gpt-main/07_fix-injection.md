```ts
import { Injectable } from '@angular/core'
import { debounceTime, filter } from 'rxjs'
import {
  IconLoaderTopic,
  IconRequested,
  OnecxIcon,
  IconClassType,
  ensureIconCache
} from '@onecx/integration-interface'
import { ThemeService } from '@onecx/angular-integration-interface'
import { IconBffService } from 'src/app/shared/generated'

@Injectable({ providedIn: 'root' })
export class ShellIconLoaderService {
  private readonly topic = new IconLoaderTopic()
  private themeRefId?: string

  constructor(
    private readonly themeService: ThemeService,
    private readonly iconBffService: IconBffService
  ) {
    ensureIconCache()
  }

  init(): void {
    this.themeService.currentTheme$
      .asObservable()
      .subscribe((t) => (this.themeRefId = t?.name))

    this.topic
      .pipe(
        filter((m): m is IconRequested => m.type === 'IconRequested'),
        debounceTime(100)
      )
      .subscribe((m) => this.onIconRequested(m))
  }

  private onIconRequested(m: IconRequested): void {
    const icon = window.onecxIcons[m.name]

    // icon already fetched → inject CSS immediately
    if (icon) {
      this.injectCssIfNeeded(m.name, m.classType, icon.body)
      return
    }

    // icon missing → fetch
    if (icon === undefined) {
      this.fetchMissingIcons()
    }
  }

  private fetchMissingIcons(): void {
    if (!this.themeRefId) return

    const missing = Object.entries(window.onecxIcons)
      .filter(([, v]) => v === undefined)
      .map(([name]) => name)

    if (!missing.length) return

    this.iconBffService
      .findIconsByNamesAndRefId(this.themeRefId, { names: missing })
      .subscribe((res) => {
        const map = new Map<string, OnecxIcon>()
        res?.icons?.forEach((i) => map.set(i.name, i))

        missing.forEach((name) => {
          window.onecxIcons[name] = map.get(name) ?? null
        })

        this.injectCssForRenderedIcons()
        this.topic.publish({ type: 'IconsReceived' })
      })
  }

  private injectCssForRenderedIcons(): void {
    Object.entries(window.onecxIcons).forEach(([name, icon]) => {
      if (!icon) return

      ;(['svg', 'background', 'background-before'] as IconClassType[]).forEach(
        (type) => {
          const className = `onecx-theme-icon-${type}-${name}`
          if (document.querySelector(`.${className}`)) {
            this.injectCssIfNeeded(name, type, icon.body)
          }
        }
      )
    })
  }

  private injectCssIfNeeded(
    name: string,
    type: IconClassType,
    svg: string
  ): void {
    const className = `onecx-theme-icon-${type}-${name}`
    if (document.getElementById(className)) return
    this.injectCss(className, type, svg)
  }

  private injectCss(
    className: string,
    type: IconClassType,
    body: string
  ): void {
    const encoded = btoa(body)
    const style = document.createElement('style')
    style.id = className

    switch (type) {
      case 'svg':
        style.textContent = `
.${className}{
  --onecx-icon:url("data:image/svg+xml;base64,${encoded}");
  mask:var(--onecx-icon) no-repeat center/contain;
  -webkit-mask:var(--onecx-icon) no-repeat center/contain;
  background-color:currentColor;
}`
        break

      case 'background':
        style.textContent = `
.${className}{
  background:url("data:image/svg+xml;base64,${encoded}") center/contain no-repeat;
}`
        break

      default:
        style.textContent = `
.${className}::before{
  content:'';
  display:inline-block;
  width:1em;
  height:1em;
  background:url("data:image/svg+xml;base64,${encoded}") center/contain no-repeat;
}`
    }

    document.head.appendChild(style)
  }
}




```



```ts

private injectCss(
  className: string,
  type: IconClassType,
  body: string
): void {
  if (document.getElementById(className)) return

  const encoded = btoa(body)
  const style = document.createElement('style')
  style.id = className

  switch (type) {
    case 'svg':
      style.textContent = `
.${className} {
  --onecx-svg: url("data:image/svg+xml;base64,${encoded}");
  -webkit-mask: var(--onecx-svg) no-repeat center / contain;
  mask: var(--onecx-svg) no-repeat center / contain;
  background-color: currentColor;
  display: inline-block;
  width: 1em;
  height: 1em;
}`
      break

    case 'background':
      style.textContent = `
.${className} {
  background-image: url("data:image/svg+xml;base64,${encoded}");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  display: inline-block;
  width: 1em;
  height: 1em;
}`
      break

    default: // background-before
      style.textContent = `
.${className}::before {
  content: '';
  display: inline-block;
  width: 1em;
  height: 1em;
  background-image: url("data:image/svg+xml;base64,${encoded}");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}`
  }

  document.head.appendChild(style)
}

```