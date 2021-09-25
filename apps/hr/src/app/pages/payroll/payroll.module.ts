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
import { AddPayrollComponent } from './component/add-payroll/add-payroll.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EmployeeModule } from '../employee/employee.module';
import { UpdateConfirmComponent } from './component/update-comfirm/update-confirm.component';
import { AddHolidayComponent } from './component/add-holiday/add-holiday.component';
import { HolidayComponent } from './container/holiday/holiday.component';
import { HolidayReducer } from './+state/holiday/holiday.reducer';
import { HolidayEffect } from './+state/holiday/holiday.effect';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { DialogOvertimeComponent } from './component/dialog-overtime/dialog-overtime.component';
import { DialogBasicComponent } from './component/dialog-basic/dialog-basic.component';
import { DialogAbsentComponent } from './component/dialog-absent/dialog-absent.component';
import { DialogStayComponent } from './component/dialog-stay/dialog-stay.component';
import { DialogAllowanceComponent } from './component/dialog-allowance/dialog-allowance.component';
import { templateOvertimeReducer } from '../template/+state/template-overtime/template-overtime.reducer';
import { TemplateOvertimeEffect } from '../template/+state/template-overtime/template-overtime.effect';

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
    EffectsModule.forFeature([PayrollEffect, HolidayEffect, TemplateOvertimeEffect]),
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
    DialogAllowanceComponent,
    AddPayrollComponent,
    UpdateConfirmComponent,
    AddHolidayComponent,
    HolidayComponent,
    DialogOvertimeComponent,
    DialogBasicComponent,
    DialogAbsentComponent,
    DialogStayComponent,
  ]
})
export class PayrollModule {
}
