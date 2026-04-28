import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { KeycloakAuthBehaviorComponent } from './components/keycloak-auth-behavior.component'

const routes: Routes = [
  {
    path: '',
    component: KeycloakAuthBehaviorComponent,
    title: 'Keycloak Auth Behavior'
  }
]

@NgModule({
  imports: [
    CommonModule,
    KeycloakAuthBehaviorComponent,
    RouterModule.forChild(routes)
  ]
})
export class KeycloakAuthBehaviorModule {}
