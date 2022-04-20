import { NgModule } from '@angular/core';
import { CustomerComponent } from './container';
import { CustomerRoutingModule } from './customer-routing.module';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ComponentsModule } from '@minhdu-fontend/components';
import { CommonModule, DatePipe } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { CustomerEffect } from './+state';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { DetailCustomerComponent } from './container';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { CustomerDialogComponent } from './component';
import { PaymentDialogComponent } from './component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from '../../shared/shared.module';
import { TablePaymentComponent } from './component';
import { PaymentReducer } from '../payment/payment/payment.reducer';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { OrderEffect } from '../order/+state';
import { CommodityEffect } from '../commodity/+state';
import { RouteEffect } from '../route/+state';
import { MatSortModule } from '@angular/material/sort';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { VisibleCustomerComponent } from './component';
import { CustomerService } from './service';
import { PaymentService } from './service';
import { OrderService } from '../order/service';
import { OrderModule } from '../order/order.module';

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
    NzInputModule,
    NzButtonModule,
    NzPopoverModule,
    OrderModule
  ],
  declarations: [
    TablePaymentComponent,
    CustomerComponent,
    DetailCustomerComponent,
    CustomerDialogComponent,
    PaymentDialogComponent,
    VisibleCustomerComponent
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    DatePipe,
    CustomerService,
    PaymentService,
    OrderService,
  ]
})
export class CustomerModule {
}
