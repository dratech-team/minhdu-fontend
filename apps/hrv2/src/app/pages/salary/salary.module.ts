import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AkitaNgEffectsModule} from '@datorama/akita-ng-effects';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzPopoverModule} from 'ng-zorro-antd/popover';
import {PermanentSalaryComponent} from "./components/permanent/permanent-salary.component";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NgxCurrencyModule} from "ngx-currency";
import {PayrollEffect} from "../payroll/state/payroll.effect";
import {SettingSalaryEffect} from "../setting/salary/state";
import {customCurrencyMaskConfig} from "@minhdu-fontend/config";
import {PartialSalaryComponent} from "./components/partial/partial-salary.component";
import {NzTimePickerModule} from "ng-zorro-antd/time-picker";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {OnsiteSalaryComponent} from "./components/onsite/onsite-salary.component";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {TransformSalaryTypePipe} from "./pipes";

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    AkitaNgEffectsModule.forFeature([PayrollEffect, SettingSalaryEffect]),
    ReactiveFormsModule,
    FormsModule,
    NzMessageModule,
    NzModalModule,
    NzCollapseModule,
    NzRadioModule,
    NzTableModule,
    NzInputModule,
    NzButtonModule,
    NzPopoverModule,
    NzStepsModule,
    NzSelectModule,
    NgxCurrencyModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    NzTimePickerModule,
    NzDatePickerModule,
    NzCheckboxModule,
  ],
  declarations: [
    PermanentSalaryComponent,
    PartialSalaryComponent,
    OnsiteSalaryComponent,
    TransformSalaryTypePipe
  ],
  providers: [
    DatePipe,
  ]
})
export class SalaryModule {
}
