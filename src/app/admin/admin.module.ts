import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { AdminComponent } from './admin.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { CategoriesdModule } from './categories/categories.module';
import { PlansModule } from './plans/plans.module';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  imports: [
    AdminRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    CategoriesdModule,
    PlansModule
  ],
  declarations: [
    AdminComponent,
  ],
})
export class AdminModule {
}
