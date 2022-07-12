import { NgModule } from '@angular/core';
import { CustomerComponent, DetailCustomerComponent } from './container';
import { CustomerRoutingModule } from './customer-routing.module';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ComponentsModule } from '@minhdu-fontend/components';
import { CommonModule, DatePipe } from '@angular/common';
import { CustomerEffect } from './state';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { CustomerModalComponent, VisibleCustomerComponent } from './component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from '../../shared/shared.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { OrderEffect } from '../order/state';
import { CommodityEffect } from '../commodity/state';
import { RouteEffect } from '../route/state';
import { MatSortModule } from '@angular/material/sort';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { CustomerService, PaymentService } from './service';
import { OrderService } from '../order/service';
import { OrderModule } from '../order/order.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { EmployeeModule } from '../../../../../hrv2/src/app/pages/employee/employee.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { PaymentEffect } from '../payment/payment';
import { PaymentModule } from '../payment/payment.module';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { CustomerComponentService } from './shared';

@NgModule({
  imports: [
    ComponentsModule,
    MatSnackBarModule,
    HttpClientModule,
    CustomerRoutingModule,
    MatInputModule,
    InfiniteScrollModule,
    CommonModule,
    AkitaNgEffectsModule.forFeature([
      OrderEffect,
      CustomerEffect,
      CommodityEffect,
      RouteEffect,
      PaymentEffect
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
    OrderModule,
    NzSpinModule,
    EmployeeModule,
    NzSelectModule,
    NzStepsModule,
    NzDatePickerModule,
    PaymentModule,
    NzDropDownModule
  ],
  declarations: [
    CustomerComponent,
    DetailCustomerComponent,
    CustomerModalComponent,
    VisibleCustomerComponent
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    DatePipe,
    CustomerComponentService,
    CustomerService,
    PaymentService,
    OrderService
  ]
})
export class CustomerModule {
}
