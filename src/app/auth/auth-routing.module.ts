import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent, NbLogoutComponent } from '@nebular/auth';
import {AuthComponent} from './auth.component';
import {LogoutComponent} from './logout.component';
import { NgxLoginComponent} from './login/login.component'; // <---

export const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [ 
      {
        path: 'login',
        component: NgxLoginComponent, // <---
      },
      {
        path: 'logout',
        component: LogoutComponent, // <---
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {
}