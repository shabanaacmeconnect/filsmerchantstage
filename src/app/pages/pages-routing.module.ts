import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CausesComponent } from './causes/causes.component';
import { CharityComponent } from './charity/charity.component';
import { DefaultComponent } from './dashboards/default/default.component';
import { PayoutComponent } from './payout/payout.component';
import { SettingsComponent } from './settings/settings.component';
import { SupportComponent } from './support/support.component';
import { TransactionsComponent} from './transactions/transactions.component';
import {DrivesComponent} from './drives/drives.component'
import { AnalyticsComponent } from './dashboards/analytics/analytics.component';
const routes: Routes = [
  { path: '', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DefaultComponent },
  {path:'causes',component:CausesComponent},
  {path:'charity/:id/causes',component:CausesComponent},
  {path:'charity',component:CharityComponent},
  {path:'support',component:SupportComponent},
  {path: 'settings',component:SettingsComponent},
   {path: 'transactions',component:TransactionsComponent},
   {path:'drives',component:DrivesComponent},
   {path:'payout',component:PayoutComponent},
   {path:'analytics',component:AnalyticsComponent}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
