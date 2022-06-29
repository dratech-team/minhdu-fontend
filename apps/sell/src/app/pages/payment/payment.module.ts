import { NgModule } from '@angular/core';
import { PaymentModalComponent } from './components/payment-modal/payment-modal.component';
import { TablePaymentComponent } from './components/table-payment/table-payment.component';
import { ComponentsModule } from '@minhdu-fontend/components';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { SharedModule } from '../../shared/shared.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgxCurrencyModule } from 'ngx-currency';
import { AuthModule } from '@minhdu-fontend/auth';

@NgModule({
  imports: [
    CommonModule,
    NzTableModule,
    ReactiveFormsModule,
    NzInputModule,
    NzStepsModule,
    NzSelectModule,
    NzDatePickerModule,
    SharedModule,
    ComponentsModule,
    NzButtonModule,
    NgxCurrencyModule,
    AuthModule,
  ],
  exports: [TablePaymentComponent],
  declarations: [PaymentModalComponent, TablePaymentComponent],
})
export class PaymentModule {}
