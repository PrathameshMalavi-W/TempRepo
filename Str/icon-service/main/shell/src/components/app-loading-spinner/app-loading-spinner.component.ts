// @ts-nocheck
import { Component, OnInit, OnDestroy, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconService } from '@onecx/angular-integration-interface'
import { ICON_NAMES } from 'src/app/shared/icon-names'

interface IconLoadStatus {
  name: string
  classType: string
  cssClass: string | null
  asyncResult: string | null
  loaded: boolean
}

@Component({
  standalone: true,
  selector: 'ocx-shell-loading-spinner',
  templateUrl: 'app-loading-spinner.component.html',
  styleUrl: 'app-loading-spinner.component.scss',
  imports: [CommonModule],
})
export class AppLoadingSpinnerComponent implements OnInit, OnDestroy {
  private readonly iconService = inject(IconService)
  private iconRequestTimer: any
  iconStatuses: IconLoadStatus[] = []

  ngOnInit() {
    // Test icon requests every 2 seconds
    // Uses icon names from `src/app/shared/icon-names.ts` (populate from DB)
    this.iconRequestTimer = setInterval(() => {
      const iconNames = Array.isArray(ICON_NAMES) ? ICON_NAMES : ICON_NAMES.LOADER_ICONS || []
      const classTypes = ['background', 'mask']
      
      iconNames.forEach((name) => {
        classTypes.forEach((classType) => {
          const cssClass = this.iconService.getIconClass(name, classType)
          this.iconService.getIconClassAsync(name, classType).then((result) => {
            console.log(`[LoadingSpinner] Icon: ${name} | type: ${classType} | sync: ${cssClass} | async: ${result}`)
            const status = this.iconStatuses.find((s) => s.name === name && s.classType === classType)
            if (status) {
              status.asyncResult = result
              status.loaded = true
            } else {
              this.iconStatuses.push({
                name,
                classType,
                cssClass,
                asyncResult: result,
                loaded: true,
              })
            }
          })
        })
      })
    }, 2000)
  }

  ngOnDestroy() {
    if (this.iconRequestTimer) {
      clearInterval(this.iconRequestTimer)
    }
  }

}