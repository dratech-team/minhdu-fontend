import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickOrderComponent } from './components/pick-order/pick-order.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OrderEffect } from '../pages/order/+state/order.effect';
import { ComponentsModule } from '@minhdu-fontend/components';
import { PickCommodityComponent } from './components/pick-commodity/pick-commodity.component';
import { PickCustomerComponent } from './components/pick-customer.component/pick-customer.component';
import { MatInputModule } from '@angular/material/input';
import { PickRoutesComponent } from './components/pick-routes/pick-routes.component';
import { PickCommodityService } from './components/pick-commodity/pick-commodity.service';
import { PickRoutesService } from './components/pick-routes/pick-routes.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TableOrdersComponent } from './components/table-orders/table-orders.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { CustomerEffect } from '../pages/customer/+state/customer.effect';
import { CommodityEffect } from '../pages/commodity/+state/commodity.effect';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";

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
    PickCommodityComponent,
    PickCustomerComponent,
    PickRoutesComponent

  ],
  providers: [
    DecimalPipe,
    PickCommodityService,
    PickRoutesService

  ],
  exports: [
    TableOrdersComponent,
    PickCommodityComponent,
    PickOrderComponent,
    PickCustomerComponent,
    PickRoutesComponent
  ]
})
export class SharedModule {

}
