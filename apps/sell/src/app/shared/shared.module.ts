import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickOrderComponent } from './components/pick-order/pick-order.component';
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
import { PickRoutesComponent } from './components/pick-routes/pick-routes.component';
import { PickRoutesService } from './components/pick-routes/pick-routes.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TableOrdersComponent } from './components/table-orders/table-orders.component';
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
    TableOrdersComponent,
    PickOrderComponent,
    SelectCommodityComponent,
    SelectCustomerComponent,
    PickRoutesComponent,
    PriceCommodityPipe
  ],
  providers: [DecimalPipe, PickRoutesService, CurrencyPipe],
  exports: [
    TableOrdersComponent,
    SelectCommodityComponent,
    PickOrderComponent,
    SelectCustomerComponent,
    PickRoutesComponent,
    PriceCommodityPipe
  ]
})
export class SharedModule {
}
