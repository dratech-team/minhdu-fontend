import { NgModule } from '@angular/core';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MatDialogModule } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PayrollComponent } from './container/payroll/payroll.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FeatureName } from '@minhdu-fontend/constants';
import { payrollReducer } from './+state/payroll/payroll.reducers';
import { PayrollEffect } from './+state/payroll/payroll.effect';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { DetailPayrollComponent } from './container/detail-payroll/detail-payroll.component';
import { PayrollRoutingModule } from './payroll-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EmployeeModule } from '../employee/employee.module';
import { UpdateConfirmComponent } from './component/update-comfirm/update-confirm.component';
import { HolidayReducer } from '../template/+state/holiday/holiday.reducer';
import { HolidayEffect } from '../template/+state/holiday/holiday.effect';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { DialogOvertimeComponent } from './component/dialog-overtime/dialog-overtime.component';
import { DialogBasicComponent } from './component/dialog-basic/dialog-basic.component';
import { DialogAbsentComponent } from './component/dialog-absent/dialog-absent.component';
import { DialogStayComponent } from './component/dialog-stay/dialog-stay.component';
import { DialogAllowanceComponent } from './component/dialog-allowance/dialog-allowance.component';
import { templateOvertimeReducer } from '../template/+state/template-overtime/template-overtime.reducer';
import { TemplateOvertimeEffect } from '../template/+state/template-overtime/template-overtime.effect';
import { templateBasicReducer } from '../template/+state/teamlate-salary-basic/template-basic-salary.reducer';
import { TemplateBasicSalaryEffect } from '../template/+state/teamlate-salary-basic/template-basic-salary.effect';
import { ConfirmPayrollComponent } from './component/confirm-payroll/confirm-payroll.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ConvertTimePipe } from './pipes/convert-time.pipe';
import { PickEmployeeAbsentComponent } from './component/pick-employee-absent/pick-employee-absent.component';
import { DialogTimekeepingComponent } from './component/timekeeping/dialog-timekeeping.component';
import { PickEmployeeOvertimeComponent } from './component/pick-employee-overtime/pick-employee-overtime.component';
import { DialogOvertimeMultipleComponent } from './component/dialog-overtime-multiple/dialog-overtime-multiple.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogExportPayrollComponent } from './component/dialog-export/dialog-export-payroll.component';
import { HistoryPayrollComponent } from './container/history-payroll/history-payroll.component';
import { AddPayrollComponent } from './component/add-Payroll/add-payroll.component';
import { OvertimeComponent } from './container/overtime/overtime.component';
import { SalaryReducer } from './+state/payroll/salary.reducer';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  imports: [
    ComponentsModule,
    PayrollRoutingModule,
    ComponentsModule,
    MatDialogModule,
    StoreModule,
    MatDialogModule,
    EffectsModule,
    InfiniteScrollModule,
    StoreModule.forFeature(FeatureName.TEMPLATE_BASIC, templateBasicReducer),
    StoreModule.forFeature(FeatureName.PAYROLL, payrollReducer),
    StoreModule.forFeature(FeatureName.SALARY, SalaryReducer),
    StoreModule.forFeature(FeatureName.HOLIDAY, HolidayReducer),
    StoreModule.forFeature(FeatureName.TEMPLATE_OVERTIME, templateOvertimeReducer),
    EffectsModule.forFeature([
      PayrollEffect,
      HolidayEffect,
      TemplateOvertimeEffect,
      TemplateBasicSalaryEffect
    ]),
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTabsModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    EmployeeModule,
    FormsModule,
    NgxSkeletonLoaderModule.forRoot(),
    MatProgressBarModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatStepperModule
  ],
  declarations: [
    PayrollComponent,
    DetailPayrollComponent,
    FilterPipe,
    DialogAllowanceComponent,
    UpdateConfirmComponent,
    DialogOvertimeComponent,
    DialogBasicComponent,
    DialogAbsentComponent,
    DialogStayComponent,
    ConfirmPayrollComponent,
    PickEmployeeAbsentComponent,
    DialogTimekeepingComponent,
    PickEmployeeOvertimeComponent,
    DialogOvertimeMultipleComponent,
    ConvertTimePipe,
    AddPayrollComponent,
    DialogExportPayrollComponent,
    HistoryPayrollComponent,
    OvertimeComponent,
  ],
  providers:[
    MatDatepickerModule
  ]
})

export class PayrollModule {
}
