import {NgModule} from '@angular/core';
import {CustomerComponent} from './container/customer/customer.component';
import {CustomerRoutingModule} from './customer-routing.module';
import {MatInputModule} from '@angular/material/input';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {ComponentsModule} from '@minhdu-fontend/components';
import {CommonModule, DatePipe} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {FeatureName} from '@minhdu-fontend/constants';
import {CustomerEffect} from './+state/customer.effect';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {HttpClientModule} from '@angular/common/http';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {DetailCustomerComponent} from './container/detail-customer/detail-customer.component';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {CustomerDialogComponent} from './component/customer-dialog/customer-dialog.component';
import {PaymentDialogComponent} from './component/payment-dialog/payment-dialog.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatStepperModule} from '@angular/material/stepper';
import {SharedModule} from '../../shared/shared.module';
import {TablePaymentComponent} from './component/table-payment/table-payment.component';
import {PaymentReducer} from '../payment/payment/payment.reducer';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {AkitaNgEffectsModule} from '@datorama/akita-ng-effects';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {OrderEffect} from "../order/+state/order.effect";
import {CommodityEffect} from "../commodity/+state/commodity.effect";
import {RouteEffect} from "../route/+state/route.effect";
import {MatSortModule} from "@angular/material/sort";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzTableModule} from "ng-zorro-antd/table";

@NgModule({
  imports: [
    ComponentsModule,
    MatSnackBarModule,
    HttpClientModule,
    CustomerRoutingModule,
    MatInputModule,
    InfiniteScrollModule,
    CommonModule,
    StoreModule.forFeature(FeatureName.PAYMENT, PaymentReducer),
    AkitaNgEffectsModule.forFeature([
      OrderEffect,
      CustomerEffect,
      CommodityEffect,
      RouteEffect
    ]),
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
    FormsModule,
    MatTabsModule,
    MatStepperModule,
    SharedModule,
    NgxSkeletonLoaderModule.forRoot(),
    NzMessageModule,
    MatSortModule,
    NzModalModule,
    NzCollapseModule,
    NzRadioModule,
    NzTableModule,
  ],
  declarations: [
    TablePaymentComponent,
    CustomerComponent,
    DetailCustomerComponent,
    CustomerDialogComponent,
    PaymentDialogComponent
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    DatePipe,
  ]
})
export class CustomerModule {
}
