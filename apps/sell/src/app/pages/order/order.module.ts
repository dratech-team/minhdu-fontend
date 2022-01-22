import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderRoutingModule } from './order-routing.module';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { OrderAssignedReducer, OrderReducer } from './+state/order.reducer';
import { EffectsModule } from '@ngrx/effects';
import { OrderEffect } from './+state/order.effect';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ComponentsModule } from '@minhdu-fontend/components';
import { OrderComponent } from './container/order/order.component';
import { DetailOrderComponent } from './container/detail-order/detail-order.component';
import { OrderDialogComponent } from './component/order-dialog/order-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { CustomerModule } from '../customer/customer.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommodityModule } from '../commodity/commodity.module';
import { AddOrderComponent } from './container/add-order.component/add-order.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouteReducer } from '../route/container/+state/route.reducer';
import { RouteEffect } from '../route/container/+state/route.effect';
import { RouteModule } from '../route/route.module';
import { SharedModule } from '../../shared/shared.module';
import { PaymentHistoryComponent } from './container/payment-history/payment-history.component';
import { TableRouteComponent } from './component/table-route/table-route.component';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MainReducer } from '../../states/mainReducer';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  imports: [
    MatSnackBarModule,
    ReactiveFormsModule,
    ComponentsModule,
    OrderRoutingModule,
    StoreModule.forFeature(FeatureName.ORDER, OrderReducer),
    StoreModule.forFeature(FeatureName.MAIN, MainReducer),
    StoreModule.forFeature(FeatureName.ORDER_ASSIGNED, OrderAssignedReducer),
    StoreModule.forFeature(FeatureName.ROUTE, RouteReducer),
    EffectsModule.forFeature([OrderEffect, RouteEffect]),
    MatInputModule,
    InfiniteScrollModule,
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    MatTabsModule,
    CustomerModule,
    MatCheckboxModule,
    CommodityModule,
    NgxMatSelectSearchModule,
    MatAutocompleteModule,
    RouteModule,
    SharedModule,
    NgxSkeletonLoaderModule.forRoot(),
    CommonModule
  ],
  declarations: [
    TableRouteComponent,
    PaymentHistoryComponent,
    OrderComponent,
    DetailOrderComponent,
    OrderDialogComponent,
    AddOrderComponent,
  ],
  exports: [],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    DatePipe,
    MatDatepickerModule,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  ],
})
export class OrderModule {}
