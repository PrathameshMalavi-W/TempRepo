// @ts-nocheck
import { inject, Injectable } from '@angular/core'
import { IconsTopic } from '@onecx/integration-interface'
import { bufferTime, filter, map } from 'rxjs/operators'
import { firstValueFrom } from 'rxjs'
import { IconBffService } from 'src/app/shared/generated'
import { ThemeService } from '@onecx/angular-integration-interface'

declare global {
  interface Window {
    onecxIcons: { [name: string]: string | null | undefined }
  }
}

@Injectable({ providedIn: 'root' })
export class IconLoaderService {
  private readonly iconsTopic = new IconsTopic()
  private readonly iconBff = inject(IconBffService)
  private readonly themeService = inject(ThemeService)

  constructor() {
    window['onecxIcons'] ??= {}
  }

  public init(): void {
    // subscribe to IconRequested messages, collect them for 100ms and then request
    this.iconsTopic.asObservable()
      .pipe(
        filter((p: any) => p?.kind === 'IconRequested'),
        map((p: any) => p.name),
        bufferTime(100),
        filter((names: string[]) => !!names && names.length > 0),
        map((names: string[]) => Array.from(new Set(names)))
      )
      .subscribe(async (names: string[]) => {
        // filter only those not yet requested
        const toRequest = names.filter(n => !(n in window['onecxIcons']) || window['onecxIcons'][n] === undefined)
        if (!toRequest.length) {
          return
        }

        // mark pending entries
        toRequest.forEach(n => { window['onecxIcons'][n] = undefined })

        // determine refId from theme name as best-effort
        const themeName = await firstValueFrom(this.themeService.currentTheme$).catch(() => undefined)
        const refId = (themeName && (themeName as any).name) || (typeof themeName === 'string' ? themeName : '')

        if (!refId) {
          // try empty refId request; set entries to null to indicate missing
          toRequest.forEach(n => { window['onecxIcons'][n] = null })
          this.iconsTopic.publish({ kind: 'IconsReceived', icons: {} })
          return
        }

        try {
          const resp = await this.iconBff.findIconsByNamesAndRefId(refId, { names: toRequest }).toPromise()
          const icons: { [k: string]: string | null } = {}
          if (resp && resp.icons && Array.isArray(resp.icons)) {
            resp.icons.forEach((i: any) => {
              if (i && i.name) {
                window['onecxIcons'][i.name] = i.body ?? null
                icons[i.name] = i.body ?? null
              }
            })
          }
          // mark not found ones as null
          toRequest.forEach(n => {
            if (!(n in icons)) {
              window['onecxIcons'][n] = null
              icons[n] = null
            }
          })

          this.iconsTopic.publish({ kind: 'IconsReceived', icons })
        } catch (err) {
          console.error('Failed to load icons', err)
          // on error set to null and publish
          const icons: { [k: string]: null } = {}
          toRequest.forEach(n => {
            window['onecxIcons'][n] = null
            icons[n] = null
          })
          this.iconsTopic.publish({ kind: 'IconsReceived', icons })
        }
      })
  }
}

