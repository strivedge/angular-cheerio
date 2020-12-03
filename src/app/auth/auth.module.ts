import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbThemeModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxAuthRoutingModule } from './auth-routing.module';
import { NbAuthModule } from '@nebular/auth';
import { NbAlertModule, NbButtonModule, NbCheckboxModule, NbInputModule } from '@nebular/theme';
import {AuthComponent} from './auth.component'
import { NgxLoginComponent } from './login/login.component'; // <---
import { LogoutComponent } from './logout.component'; // <---
import { ThemeModule } from '../@theme/theme.module';

@NgModule({
  imports: [
    NbThemeModule,
    ThemeModule,
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NgxAuthRoutingModule,
    NbAuthModule,
  ],
  declarations: [
    AuthComponent,
    LogoutComponent,
    NgxLoginComponent, // <---
  ],
})
export class NgxAuthModule {
}