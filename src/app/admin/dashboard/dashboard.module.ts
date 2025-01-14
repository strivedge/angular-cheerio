import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';


@NgModule({
  imports: [
    NbCardModule,
    NbIconModule,
    ThemeModule,
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
