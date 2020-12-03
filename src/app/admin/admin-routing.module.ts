import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { PlansComponent } from './plans/plans.component';
import { GamesComponent } from './games/games.component';
import { QuizComponent } from './quiz/quiz.component';
import { WouldyouratherComponent } from './wouldyourather/wouldyourather.component';
import { NevereverComponent } from './neverever/neverever.component';

import { PersonalitiesComponent } from './personalities/personalities.component';
import { UsersComponent } from './users/users.component';
import { PaymentsComponent } from './payments/payments.component';
import { RedeemsComponent } from './redeems/redeems.component';
import { VouchersComponent } from './vouchers/vouchers.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [{
  path: '',
  component: AdminComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    }, 
    {
      path: 'categories',
      component: CategoriesComponent,
    },   
    {
      path: 'games',
      component: GamesComponent,
    },  
    {
      path: 'quiz',
      component: QuizComponent,
    }, 
    {
      path: 'wouldyourather',
      component: WouldyouratherComponent,
    },
    {
      path: 'neverever',
      component: NevereverComponent,
    },
    {
      path: 'personalities',
      component: PersonalitiesComponent,
    },
    {
      path: 'users',
      component: UsersComponent,
    },
    {
      path: 'plans',
      component: PlansComponent,
    },
    {
      path: 'payments',
      component: PaymentsComponent,
    },
    {
      path: 'redeem-categories',
      component: RedeemsComponent,
    },
    {
      path: 'vouchers',
      component: VouchersComponent,
    },
    {
      path: 'settings',
      component: SettingsComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
}
