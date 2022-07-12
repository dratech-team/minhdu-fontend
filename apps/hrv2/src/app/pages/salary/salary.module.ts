import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { PermanentSalaryComponent } from './components/permanent/permanent-salary.component';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgxCurrencyModule } from 'ngx-currency';
import { PayrollEffect } from '../payroll/state/payroll.effect';
import { SettingSalaryEffect } from '../setting/salary/state';
import { customCurrencyMaskConfig } from '@minhdu-fontend/config';
import { AbsentOvertimeSalaryComponent } from './components/absent-overtime/absent-overtime-salary.component';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { PartialdayPipe, TransformSalaryTypePipe } from './pipes';
import { SettingModule } from '../setting/setting.module';
import { RemoteOrDayOffSalaryComponent } from './components/remote-or-day-off/remote-or-day-off-salary.component';
import { DeductionSalaryComponent } from './components/deduction/deduction-salary.component';
import { SharedModule } from '../../../shared/shared.module';
import { HolidaySalaryComponent } from './components/holiday/holiday-salary.component';
import { TableSalarySelectedComponent } from './components/table-salaries-selected/table-salary-selected.component';
import { ComponentsModule } from '@minhdu-fontend/components';

const COMMON_MODULE = [
  HttpClientModule,
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  SharedModule,
  ComponentsModule,
];

const NZ_MODULES = [
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
  NzTimePickerModule,
  NzDatePickerModule,
  NzCheckboxModule,
];

const PIPES = [TransformSalaryTypePipe, PartialdayPipe];
const COMPONENTS = [
  PermanentSalaryComponent,
  AbsentOvertimeSalaryComponent,
  RemoteOrDayOffSalaryComponent,
  DeductionSalaryComponent,
  HolidaySalaryComponent,
  TableSalarySelectedComponent,
];

@NgModule({
  imports: [
    NZ_MODULES,
    COMMON_MODULE,
    AkitaNgEffectsModule.forFeature([PayrollEffect, SettingSalaryEffect]),
    NgxCurrencyModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    SettingModule,
  ],
  declarations: [COMPONENTS, PIPES],
  exports: [TableSalarySelectedComponent],
  providers: [DatePipe],
})
export class SalaryModule {}
