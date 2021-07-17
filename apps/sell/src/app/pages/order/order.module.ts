import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {  OrderRoutingModule } from './order-routing.module';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { OrderReducer } from './+state/order.reducer';
import { EffectsModule } from '@ngrx/effects';
import { OrderEffect } from './+state/order.effect';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ComponentsModule } from '@minhdu-fontend/components';
import { OrderComponent } from './container/order/order.component';
import { DetailOrderComponent } from './container/detail-order/detail-order.component';
import { OrderDialogComponent } from './component/order-dialog/order-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { customerModule } from '../customer/customer.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommodityModule } from '../commodity/commodity.module';
import { AddOrderComponent } from './container/add-order.component/add-order.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EmployeeEffect, EmployeeReducer } from '@minhdu-fontend/employee';
import { RouteReducer } from '../route/container/+state/route.reducer';
import { RouteEffect } from '../route/container/+state/route.effect';
import { PaymentDialogComponent } from './component/payment-dialog/payment-dialog.component';
import { RouteModule } from '../route/route.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    OrderRoutingModule,
    StoreModule.forFeature(FeatureName.ORDER, OrderReducer),
    StoreModule.forFeature(FeatureName.ROUTE, RouteReducer),
    EffectsModule.forFeature([OrderEffect, RouteEffect]),
    MatInputModule,
    InfiniteScrollModule,
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    MatTabsModule,
    customerModule,
    MatCheckboxModule,
    CommodityModule,
    NgxMatSelectSearchModule,
    MatAutocompleteModule,
    RouteModule
  ],
  declarations:[
    OrderComponent,
    DetailOrderComponent,
    OrderDialogComponent,
    AddOrderComponent,
    PaymentDialogComponent
  ],
  providers:[DatePipe]
})
export class OrderModule{

}
