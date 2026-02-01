// @ts-nocheck
import { firstValueFrom } from 'rxjs'
import { filter } from 'rxjs/operators'
import { IconsTopic } from '../topics/icons/v1/icons.topic'
import { IconTopicPayload } from '../topics/icons/v1/icons.model'

declare global {
  interface Window {
    onecxIcons: { [name: string]: string | null | undefined }
  }
}

export class IconService {
  private _iconsTopic$: IconsTopic | undefined

  get iconsTopic() {
    this._iconsTopic$ ??= new IconsTopic()
    return this._iconsTopic$
  }
  set iconsTopic(source: IconsTopic) {
    this._iconsTopic$ = source
  }

  constructor() {
    window['onecxIcons'] ??= {}
  }

  destroy() {
    this._iconsTopic$?.destroy()
  }

  private buildClassName(name: string, classType: 'svg' | 'background' | 'background-before') {
    const safeName = name.replace(/[^a-z0-9_-]/gi, '-').toLowerCase()
    return `onecx-theme-icon-${classType}-${safeName}`
  }

  private ensureCssClass(name: string, svgBody: string | undefined | null, classType: 'svg' | 'background' | 'background-before') {
    const className = this.buildClassName(name, classType)
    const styleId = `onecx-icon-style-${className}`
    if (document.getElementById(styleId)) {
      return className
    }

    const style = document.createElement('style')
    style.id = styleId

    // If svgBody is not available yet, create an empty placeholder class
    if (!svgBody) {
      if (classType === 'svg') {
        style.textContent = `.${className} { display: inline-block; }`
      } else if (classType === 'background' || classType === 'background-before') {
        style.textContent = `.${className} { display:inline-block; }`
      }
      document.head.appendChild(style)
      return className
    }

    // create appropriate CSS depending on requested type
    const encoded = encodeURIComponent(svgBody)
    if (classType === 'svg') {
      // svg-css approach: provide background-image using data URI
      style.textContent = `.${className} { background-image: url("data:image/svg+xml;utf8,${svgBody}"); background-repeat:no-repeat; background-size:contain; display:inline-block; }`
    } else if (classType === 'background' || classType === 'background-before') {
      const rule = `background-image: url("data:image/svg+xml;utf8,${svgBody}"); background-repeat:no-repeat; background-size:contain;`
      if (classType === 'background') {
        style.textContent = `.${className} { ${rule} display:inline-block; }`
      } else {
        // background-before
        style.textContent = `.${className}::before { content: ''; display:inline-block; ${rule} }`
      }
    }
    document.head.appendChild(style)
    return className
  }

  /**
   * Returns CSS class name immediately. Will publish IconRequested if icon missing.
   */
  getIconClass(name: string, classType: 'svg' | 'background' | 'background-before' = 'background-before'): string {
    if (!(name in window['onecxIcons'])) {
      // mark as pending
      window['onecxIcons'][name] = undefined
      this.iconsTopic.publish({ kind: 'IconRequested', name } as IconTopicPayload)
    }

    const value = window['onecxIcons'][name]
    return this.ensureCssClass(name, typeof value === 'string' ? value : undefined, classType)
  }

  /**
   * Waits for icon to be loaded and returns class name or null if BFF indicated missing icon.
   */
  async getIconClassAsync(name: string, classType: 'svg' | 'background' | 'background-before' = 'background-before'):
    Promise<string | null> {
    if (window['onecxIcons'][name] && typeof window['onecxIcons'][name] === 'string') {
      return this.ensureCssClass(name, window['onecxIcons'][name] as string, classType)
    }

    if (window['onecxIcons'][name] === null) {
      return null
    }

    // mark as pending and request
    if (!(name in window['onecxIcons'])) {
      window['onecxIcons'][name] = undefined
      this.iconsTopic.publish({ kind: 'IconRequested', name } as IconTopicPayload)
    }

    // wait for the next IconsReceived publish and then check cache
    await firstValueFrom(this.iconsTopic.asObservable().pipe(filter((p: any) => p?.kind === 'IconsReceived')))

    const final = window['onecxIcons'][name]
    if (final === null) {
      return null
    }
    if (typeof final === 'string') {
      return this.ensureCssClass(name, final, classType)
    }
    return null
  }
}

