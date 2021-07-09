import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FeatureName } from '@minhdu-fontend/constants';
import { EmployeeReducer } from './+state/employee.reducer';
import { EmployeeEffect } from './+state/employee.effects';
import { DegreeService } from './+state/service/degree.service';
import { EmployeeService } from './+state/service/employee.service';
import { RelativeService } from './+state/service/relative.service';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(FeatureName.EMPLOYEE,EmployeeReducer ),
    EffectsModule.forFeature([EmployeeEffect]),
  ],
  providers: [
    DegreeService,
    EmployeeService,
    RelativeService,
  ]

})
export class EmployeeLibModule {
}
