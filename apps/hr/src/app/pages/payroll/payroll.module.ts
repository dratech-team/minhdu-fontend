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
import { SalaryComponent } from './component/salary/salary.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddPayrollComponent } from './component/add-payroll/add-payroll.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TemplateOvertimeComponent } from './component/template-overtime/template-overtime.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TemplateOvertimeEffect } from './+state/template-overtime/template-overtime.effect';
import { templateOvertimeReducer } from './+state/template-overtime/template-overtime.reducer';
import { TemplateComponent } from './container/template/template.component';
import { EmployeeModule } from '../employee/employee.module';
import { UpdateConfirmComponent } from './component/update-comfirm/update-confirm.component';
import { AddHolidayComponent } from './component/add-holiday/add-holiday.component';
import { HolidayComponent } from './container/holiday/holiday.component';
import { HolidayReducer } from './+state/holiday/holiday.reducer';
import { HolidayEffect } from './+state/holiday/holiday.effect';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { DialogOvertimeComponent } from './component/dialog-overtime/dialog-overtime.component';

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
    StoreModule.forFeature(FeatureName.PAYROLL, payrollReducer),
    StoreModule.forFeature(FeatureName.HOLIDAY, HolidayReducer),
    StoreModule.forFeature(FeatureName.TEMPLATE_OVERTIME, templateOvertimeReducer),
    EffectsModule.forFeature([PayrollEffect, TemplateOvertimeEffect, HolidayEffect]),
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
  ],
  declarations: [
    PayrollComponent,
    DetailPayrollComponent,
    FilterPipe,
    SalaryComponent,
    AddPayrollComponent,
    TemplateOvertimeComponent,
    TemplateComponent,
    UpdateConfirmComponent,
    AddHolidayComponent,
    HolidayComponent,
    DialogOvertimeComponent,
  ]
})
export class PayrollModule {
}
