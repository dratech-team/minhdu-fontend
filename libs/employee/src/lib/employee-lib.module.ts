import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FeatureName } from '@minhdu-fontend/constants';
import { EmployeeReducer } from './+state/employee.reducer';
import { EmployeeEffect } from './+state/employee.effects';
import { DegreeService, RelativeService } from './+state/service';
import { NzMessageModule } from 'ng-zorro-antd/message';

@NgModule({
  imports: [
    NzMessageModule,
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(FeatureName.EMPLOYEE, EmployeeReducer),
    EffectsModule.forFeature([EmployeeEffect]),
  ],
  providers: [DegreeService, RelativeService],
})
export class EmployeeLibModule {}
