// @ts-nocheck
import { Injectable, OnDestroy } from '@angular/core'
import { IconService as IconInterface, IconsTopic } from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class IconService implements OnDestroy {
  private readonly iconInterface = new IconInterface()

  get iconsTopic() {
    return this.iconInterface.iconsTopic
  }
  set iconsTopic(source: IconsTopic) {
    this.iconInterface.iconsTopic = source
  }

  getIconClass(name: string, classType?: 'svg' | 'background' | 'background-before'): string {
    return this.iconInterface.getIconClass(name, classType)
  }

  async getIconClassAsync(name: string, classType?: 'svg' | 'background' | 'background-before') {
    return this.iconInterface.getIconClassAsync(name, classType)
  }

  ngOnDestroy(): void {
    this.iconInterface.destroy()
  }

  destroy() {
    this.ngOnDestroy()
  }
}

