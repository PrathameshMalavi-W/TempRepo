import { Component, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconService } from '@onecx/angular-integration-interface'

@Component({
  selector: 'app-icon-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="icon-test-container">
      <h3>Icon Service Test (auto-requesting icons every 1s)</h3>
      <div class="test-icons">
        <div class="icon-item" *ngFor="let icon of testIcons">
          <span class="icon-name">{{ icon.name }}</span>
          <div [class]="icon.className" style="width:32px; height:32px; border: 1px solid #ccc;"></div>
          <span class="icon-status">{{ icon.status }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .icon-test-container {
      padding: 16px;
      border: 1px solid #ddd;
      margin: 8px;
      border-radius: 4px;
      background: #f9f9f9;
    }
    h3 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #333;
    }
    .test-icons {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
    }
    .icon-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: white;
    }
    .icon-name {
      font-size: 12px;
      font-weight: bold;
      color: #555;
    }
    .icon-status {
      font-size: 11px;
      color: #888;
    }
  `]
})
export class IconTestComponent implements OnInit, OnDestroy {
  testIcons = [
    { name: 'home-icon', className: '', status: 'pending' },
    { name: 'settings-icon', className: '', status: 'pending' },
    { name: 'user-icon', className: '', status: 'pending' },
    { name: 'search-icon', className: '', status: 'pending' },
    { name: 'menu-icon', className: '', status: 'pending' },
    { name: 'close-icon', className: '', status: 'pending' }
  ]

  private timer: any
  private callCount = 0

  constructor(private iconService: IconService) {}

  ngOnInit() {
    // Start requesting icons every 1 second
    // This will test:
    // 1. Debouncing (multiple requests within 100ms should batch)
    // 2. Batching in shell loader service
    // 3. Caching (subsequent requests should use cache)
    this.timer = setInterval(() => {
      this.callCount++
      console.log(`[IconTest] Timer tick #${this.callCount} - requesting icons...`)
      
      this.testIcons.forEach(icon => {
        // Request sync class name (immediate, may show placeholder)
        const className = this.iconService.getIconClass(icon.name, 'background-before')
        icon.className = className
        icon.status = 'class requested'

        // Also request async to wait for actual load
        this.iconService.getIconClassAsync(icon.name, 'background-before').then(result => {
          if (result) {
            icon.className = result
            icon.status = 'loaded'
          } else {
            icon.status = 'not found'
          }
        }).catch(err => {
          icon.status = 'error'
          console.error(`Failed to load icon ${icon.name}:`, err)
        })
      })
    }, 1000)
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
