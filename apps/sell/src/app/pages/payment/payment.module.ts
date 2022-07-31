import { NgModule } from '@angular/core';
import { PaymentModalComponent, TablePaymentComponent } from './components';
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
import { SelectOrderComponent } from './components/select-order/select-order.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

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
    NzIconModule,
    NzDropDownModule
  ],
  exports: [TablePaymentComponent],
  declarations: [
    PaymentModalComponent,
    TablePaymentComponent,
    SelectOrderComponent
  ]
})
export class PaymentModule {
}
