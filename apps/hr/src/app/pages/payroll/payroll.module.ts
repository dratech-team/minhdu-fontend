import { NgModule } from '@angular/core';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MatDialogModule } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PayrollComponent } from './container/payroll/payroll.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FeatureName } from '@minhdu-fontend/constants';
import { payrollReducer } from './+state/payroll.reducers';
import { PayrollEffect } from './+state/payroll.effect';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { DetailPayrollComponent } from './container/detail-payroll/detail-payroll.component';
import { PayrollRoutingModule } from './payroll-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';
import { SalaryComponent } from './component/salary/salary.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    PayrollRoutingModule,
    ComponentsModule,
    MatDialogModule,
    StoreModule,
    MatDialogModule,
    EffectsModule,
    InfiniteScrollModule,
    StoreModule.forFeature(FeatureName.PAYROLL, payrollReducer),
    EffectsModule.forFeature([PayrollEffect]),
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  declarations:[
    PayrollComponent,
    DetailPayrollComponent,
    FilterPipe,
    SalaryComponent,
  ]
})
export class PayrollModule{
}
