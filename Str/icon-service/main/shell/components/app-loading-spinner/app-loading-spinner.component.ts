import { Component, OnInit, OnDestroy, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconService } from '@onecx/angular-integration-interface'

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

  ngOnInit() {
    // Test icon requests every 2 seconds
    this.iconRequestTimer = setInterval(() => {
      const iconNames = ['spinner-icon', 'loading-icon', 'progress-icon']
      iconNames.forEach(name => {
        this.iconService.getIconClass(name, 'background')
        this.iconService.getIconClassAsync(name, 'background').then(result => {
          console.log(`[LoadingSpinner] Icon loaded: ${name} = ${result}`)
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
