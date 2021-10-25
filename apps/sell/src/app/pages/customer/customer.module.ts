import { NgModule } from '@angular/core';
import { CustomerComponent } from './container/customer/customer.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ComponentsModule } from '@minhdu-fontend/components';
import { CommonModule, DatePipe } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { CustomerReducer } from './+state/customer/customer.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CustomerEffect } from './+state/customer/customer.effect';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DetailCustomerComponent } from './container/detail-customer/detail-customer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { CustomerDialogComponent } from './component/customer-dialog/customer-dialog.component';
import { PickCustomerService } from '../../shared/components/pick-customer.component/pick-customer.service';
import { LocationModule } from '@minhdu-fontend/location';
import { PaymentDialogComponent } from './component/payment-dialog/payment-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from '../../shared/shared.module';
import { TablePaymentComponent } from './component/table-payment/table-payment.component';
import { PaymentReducer } from './+state/payment/payment.reducer';
import { PaymentEffect } from './+state/payment/payment.effect';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
@NgModule({
  imports: [
    LocationModule,
    ComponentsModule,
    MatSnackBarModule,
    HttpClientModule,
    CustomerRoutingModule,
    MatInputModule,
    InfiniteScrollModule,
    CommonModule,
    StoreModule.forFeature(FeatureName.PAYMENT, PaymentReducer),
    StoreModule.forFeature(FeatureName.CUSTOMER, CustomerReducer),
    EffectsModule.forFeature([CustomerEffect, PaymentEffect]),
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
  ],
  declarations: [
    TablePaymentComponent,
    CustomerComponent,
    DetailCustomerComponent,
    CustomerDialogComponent,
    PaymentDialogComponent
  ],
  providers: [
    DatePipe,
    PickCustomerService
  ]

})
export class CustomerModule {
}
