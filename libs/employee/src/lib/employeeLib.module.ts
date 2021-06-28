import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import * as formEmployee from './+state/employee.reducers';
import { EmployeeEffect } from './+state/employee.effect';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(FeatureName.EMPLOYEE, formEmployee.employeeReducer),
    EffectsModule.forFeature([EmployeeEffect]),
    StoreModule.forFeature(
      formEmployee.EMPLOYEE_FEATURE_KEY,
      formEmployee.employeeReducer
    )
  ]
})
export class EmployeeLibModule {
}
