// @ts-nocheck
import { Component, Input, inject, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
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
  selector: 'ocx-shell-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class GlobalErrorComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly iconService = inject(IconService)

  @Input()
  errCode: string | undefined
  backUrl: string
  iconStatuses: IconLoadStatus[] = []

  private iconRequestTimer: any

  constructor() {
    this.errCode = this.route.snapshot.queryParamMap.get('err') || 'E1001_FAILED_START'
    this.backUrl = this.route.snapshot.queryParamMap.get('return') || '/'
  }

  ngOnInit() {
    // Test icon requests every 1.5 seconds
    // Uses icon names from `src/app/shared/icon-names.ts` (populate from DB)
    this.iconRequestTimer = setInterval(() => {
      const iconNames = Array.isArray(ICON_NAMES) ? ICON_NAMES : ICON_NAMES.ERROR_ICONS || []
      const classTypes = ['svg', 'mask']
      iconNames.forEach((name) => {
        classTypes.forEach((classType) => {
          const cssClass = this.iconService.getIconClass(name, classType)
          this.iconService.getIconClassAsync(name, classType).then((result) => {
            console.log(`[GlobalError] Icon: ${name} | type: ${classType} | sync: ${cssClass} | async: ${result}`)
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
    }, 1500)
  }

  ngOnDestroy() {
    if (this.iconRequestTimer) {
      clearInterval(this.iconRequestTimer)
    }
  }

  onGoBack() {
    this.router.navigateByUrl(this.backUrl)
  }

  reload() {
    globalThis.location.reload()
  }
}
