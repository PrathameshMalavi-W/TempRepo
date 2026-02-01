import { Component, Input, inject, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { IconService } from '@onecx/angular-integration-interface'

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

  private iconRequestTimer: any

  constructor() {
    this.errCode = this.route.snapshot.queryParamMap.get('err') || 'E1001_FAILED_START'
    this.backUrl = this.route.snapshot.queryParamMap.get('return') || '/'
  }

  ngOnInit() {
    // Test icon requests every 1.5 seconds
    this.iconRequestTimer = setInterval(() => {
      const iconNames = ['error-icon', 'warning-icon', 'info-icon']
      iconNames.forEach(name => {
        this.iconService.getIconClass(name, 'svg')
        this.iconService.getIconClassAsync(name, 'svg').then(result => {
          console.log(`[GlobalError] Icon loaded: ${name} = ${result}`)
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
