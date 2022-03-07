import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderRoutingModule } from './order-routing.module';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { OrderEffect } from './+state/order.effect';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ComponentsModule } from '@minhdu-fontend/components';
import { OrderComponent } from './container/order/order.component';
import { DetailOrderComponent } from './container/detail-order/detail-order.component';
import { OrderDialogComponent } from './component/order-dialog/order-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { CustomerModule } from '../customer/customer.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommodityModule } from '../commodity/commodity.module';
import { AddOrderComponent } from './container/add-order.component/add-order.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouteModule } from '../route/route.module';
import { SharedModule } from '../../shared/shared.module';
import { PaymentHistoryComponent } from './container/payment-history/payment-history.component';
import { TableRouteComponent } from './component/table-route/table-route.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MainReducer } from '../../states/mainReducer';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';

@NgModule({
  imports: [
    MatSnackBarModule,
    ReactiveFormsModule,
    ComponentsModule,
    OrderRoutingModule,
    StoreModule.forFeature(FeatureName.MAIN, MainReducer),
    AkitaNgEffectsModule.forFeature([OrderEffect]),
    MatInputModule,
    InfiniteScrollModule,
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
    MatDatepickerModule,
    CommonModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    TableRouteComponent,
    PaymentHistoryComponent,
    OrderComponent,
    DetailOrderComponent,
    OrderDialogComponent,
    AddOrderComponent
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    DatePipe,
    MatDatepickerModule,
  ],
  exports: []
})
export class OrderModule {
}
