import {NgModule} from '@angular/core';
import {ComponentsModule} from '@minhdu-fontend/components';
import {CommonModule, DatePipe} from '@angular/common';
import {PayrollRoutingModule} from './payroll-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {TablePayrollComponent} from "./components/table-payroll/table-payroll.component";
import {PayrollComponent} from "./containers/payroll/payroll.component";
import {AkitaNgEffectsModule} from "@datorama/akita-ng-effects";
import {PayrollEffect} from "./state/payroll.effect";
import {OrgchartV2Module} from "@minhdu-fontend/orgchart-v2";
import {DetailPayrollComponent} from "./containers/detail-payroll/detail-payroll.component";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {FilterPipe, RangeDateTimePipe} from "./pipes";
import {MatSortModule} from "@angular/material/sort";
import {NzCarouselModule} from 'ng-zorro-antd/carousel';
import {BasicSalaryComponent} from "./components/salary/basic/basic-salary.component";
import {SettingSalaryEffect} from "../setting/salary/state";


@NgModule({
  imports: [
    ComponentsModule,
    PayrollRoutingModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AkitaNgEffectsModule.forFeature([PayrollEffect,SettingSalaryEffect]),
    OrgchartV2Module,
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
    NzStepsModule,
    NzSwitchModule,
    MatSortModule,
    NzCarouselModule
  ],
  declarations: [
    PayrollComponent,
    TablePayrollComponent,
    DetailPayrollComponent,
    FilterPipe,
    RangeDateTimePipe,
    BasicSalaryComponent
  ],
  providers: [
    DatePipe,
  ]
})
export class PayrollModule {
}
