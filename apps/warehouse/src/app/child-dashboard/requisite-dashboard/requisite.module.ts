import { NgModule } from '@angular/core';
import { WarehouseLayoutComponent } from '../../container/warehouse-layout.component';
import { RequisiteComponent } from './container/requisite-warehouse/requisite.component';
import { RequisiteRoutingModule } from './requisite-routing.module';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { RequisiteReducer } from './+state/requisite.reducer';
import { EffectsModule } from '@ngrx/effects';
import { RequisiteEffect } from './+state/requisite.effect';

@NgModule({
  imports: [
    RequisiteRoutingModule,
    StoreModule.forFeature(FeatureName.REQUISITE, RequisiteReducer),
    EffectsModule.forFeature([RequisiteEffect]),
  ],
  declarations: [
    RequisiteComponent
  ],
  exports: [
    RequisiteComponent
  ],
  bootstrap: [WarehouseLayoutComponent]
})
export class RequisiteModule {
}
