import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectOrderComponent } from './components/select-order/select-order.component';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OrderEffect } from '../pages/order/+state';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { CustomerEffect } from '../pages/customer/+state';
import { CommodityEffect } from '../pages/commodity/state';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { PriceCommodityPipe } from './pipe/price-commodity.pipe';
import { SelectCommodityComponent } from './components/select-commodity/select-commodity.component';
import { SelectCustomerComponent } from './components/select-customer/select-customer.component';
import { SelectRouteComponent } from './components/select-route/select-route.component';
import { OrderListComponent } from './components/order-list/order-list.component';

@NgModule({
  imports: [
    ComponentsModule,
    AkitaNgEffectsModule.forFeature([
      OrderEffect,
      CustomerEffect,
      CommodityEffect
    ]),
    CommonModule,
    RouterModule,
    MatMenuModule,
    FormsModule,
    MatCheckboxModule,
    MatDialogModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    NgxChartsModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSlideToggleModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    NzRadioModule,
    NzDatePickerModule
  ],
  declarations: [
    OrderListComponent,
    SelectOrderComponent,
    SelectCommodityComponent,
    SelectCustomerComponent,
    SelectRouteComponent,
    PriceCommodityPipe
  ],
  providers: [DecimalPipe, CurrencyPipe],
  exports: [
    OrderListComponent,
    SelectCommodityComponent,
    SelectOrderComponent,
    SelectCustomerComponent,
    SelectRouteComponent,
    PriceCommodityPipe
  ]
})
export class SharedModule {
}
