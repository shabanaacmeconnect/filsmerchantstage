import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent} from  './pagination/pagination.component'
import { ChatComponent} from './chat/chat.component'

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NotificationsComponent} from './notifications/notifications.component';

import { NgbNavModule, NgbDropdownModule, NgbModalModule, NgbTooltipModule, NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';

import { WidgetModule } from '../shared/widget/widget.module';
import { UIModule } from '../shared/ui/ui.module';

import { FullCalendarModule } from '@fullcalendar/angular';
import { QRCodeModule } from 'angularx-qrcode';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderService } from '../core/services/loader.service';
import { LoaderInterceptorService } from '../core/services/interceptors/loader-interceptor.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CausesComponent } from './causes/causes.component';
import { CharityComponent } from './charity/charity.component';
import { SettingsComponent } from './settings/settings.component';
import { SupportComponent} from './support/support.component';
import { TransactionsComponent} from './transactions/transactions.component';
import { TransactionsService } from './transactions/transactions.service';
import {PayoutComponent} from'./payout/payout.component';
import { NgbdSortableHeader } from './table-sortable';
import {DrivesComponent } from './drives/drives.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ApiComponent } from './api/api.component'
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 0.3
};

@NgModule({
  declarations: [PaginationComponent,SupportComponent,CharityComponent,DrivesComponent,
    CausesComponent,SettingsComponent,TransactionsComponent,PayoutComponent,
    ChatComponent,NgbdSortableHeader,NotificationsComponent,ApiComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbModalModule,
    PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    DashboardsModule,
    HttpClientModule,NgbAlertModule,
    UIModule,
    WidgetModule,
    FullCalendarModule,
    NgbNavModule,
    NgbTooltipModule,
    PerfectScrollbarModule,
    NgbPaginationModule,
    Ng2SearchPipeModule,
    ColorPickerModule,QRCodeModule
  ],
  exports:[NgbdSortableHeader],

  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true }
  ]
})
export class PagesModule { }
