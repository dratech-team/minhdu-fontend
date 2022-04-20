import {NgModule} from '@angular/core';
import {ComponentsModule} from '@minhdu-fontend/components';
import {CommonModule} from '@angular/common';
import {PayrollRoutingModule} from './payroll-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzInputModule} from "ng-zorro-antd/input";
import {NgxCurrencyModule} from "ngx-currency";
import {customCurrencyMaskConfig} from "@minhdu-fontend/config";
import {MatRadioModule} from "@angular/material/radio";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzTimePickerModule} from "ng-zorro-antd/time-picker";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzStepsModule} from "ng-zorro-antd/steps";

@NgModule({
  imports: [
    ComponentsModule,
    PayrollRoutingModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSkeletonLoaderModule.forRoot(),
    NzMessageModule,
    NzSelectModule,
    NzTableModule,
    NzInputModule,
    NgxCurrencyModule,
    MatRadioModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzRadioModule,
    NzCheckboxModule,
    NzButtonModule,
    NzStepsModule
  ],
  declarations: [

  ],
  providers: []
})
export class PayrollModule {
}
