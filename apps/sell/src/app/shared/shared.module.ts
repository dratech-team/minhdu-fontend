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
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { OrderAssignedReducer, OrderReducer } from '../pages/order/+state/order.reducer';
import { OrderEffect } from '../pages/order/+state/order.effect';
import { ComponentsModule } from '@minhdu-fontend/components';
import { PickCommodityComponent } from './components/pick-commodity/pick-commodity.component';
import { PickCustomerComponent } from './components/pick-customer.component/pick-customer.component';
import { MatInputModule } from '@angular/material/input';
import { PickRoutesComponent } from './components/pick-routes/pick-routes.component';
import { RouteReducer } from '../pages/route/+state/route.reducer';
import { CustomerReducer } from '../pages/customer/+state/customer/customer.reducer';
import { CommodityReducer } from '../pages/commodity/+state/commodity.reducer';
import { CustomerEffect } from '../pages/customer/+state/customer/customer.effect';
import { CommodityEffect } from '../pages/commodity/+state/commodity.effect';
import { RouteEffect } from '../pages/route/+state/route.effect';
import { PickCustomerService } from './components/pick-customer.component/pick-customer.service';
import { PickCommodityService } from './components/pick-commodity/pick-commodity.service';
import { PickRoutesService } from './components/pick-routes/pick-routes.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TableOrdersComponent } from './components/table-orders/table-orders.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {NzTableModule} from "ng-zorro-antd/table";

@NgModule({
  imports: [
    ComponentsModule,
    StoreModule.forFeature(FeatureName.ORDER, OrderReducer),
    StoreModule.forFeature(FeatureName.ORDER_ASSIGNED, OrderAssignedReducer),
    StoreModule.forFeature(FeatureName.ROUTE, RouteReducer),
    StoreModule.forFeature(FeatureName.CUSTOMER, CustomerReducer),
    StoreModule.forFeature(FeatureName.COMMODITY, CommodityReducer),
    EffectsModule.forFeature([
      OrderEffect,
      CustomerEffect,
      CommodityEffect,
      RouteEffect
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
    NzTableModule
  ],
  declarations: [
    TableOrdersComponent,
    PickOrderComponent,
    PickCommodityComponent,
    PickCustomerComponent,
    PickRoutesComponent,

  ],
  providers:[
    DecimalPipe,
    PickCustomerService,
    PickCommodityService,
    PickRoutesService
  ],
  exports: [
    TableOrdersComponent,
    PickCommodityComponent,
    PickOrderComponent,
    PickCustomerComponent,
    PickRoutesComponent,

  ],
})
export class SharedModule {

}
