import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromOrgchart from './+state/Orgchart/orgchart.reducer';
import * as formDepartment from './+state/department/department.reducer';
import * as formPosition from './+state/position/position.reducer';
import { BranchService } from './services/branch.service';
import { PositionService } from './services/position.service';
import { FeatureName } from '@minhdu-fontend/constants';
import { DepartmentService } from './services/department.service';
import { OrgchartService } from './services/orgchart.service';
import { DepartmentEffects } from './+state/department';
import { OrgchartEffects } from './+state/Orgchart';
import { PositionEffects } from './+state/position';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(FeatureName.POSITION, formPosition.reducer),
    StoreModule.forFeature(FeatureName.ORG_CHART, fromOrgchart.reducer),
    StoreModule.forFeature(FeatureName.DEPARTMENT, formDepartment.reducer),
    EffectsModule.forFeature([OrgchartEffects, DepartmentEffects, PositionEffects])
  ],
  providers: [
    BranchService,
    PositionService,
    DepartmentService,
    OrgchartService
  ]

})
export class OrgchartModule {
}
