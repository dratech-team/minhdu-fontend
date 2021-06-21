import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromOrgchart from './+state/orgchart.reducer';
import { OrgchartEffects } from './+state/orgchart.effects';
import { BranchService } from './services/branch.service';
import { PositionService } from './services/position.service';
import { FeatureName } from '@minhdu-fontend/constants';
import { DepartmentService } from './services/department.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(FeatureName.ORG_CHART, fromOrgchart.reducer),
    EffectsModule.forFeature([OrgchartEffects]),
    StoreModule.forFeature(
      fromOrgchart.ORGCHART_FEATURE_KEY,
      fromOrgchart.reducer
    )
  ],
  providers: [BranchService, DepartmentService, PositionService]
})
export class OrgchartModule {
}
