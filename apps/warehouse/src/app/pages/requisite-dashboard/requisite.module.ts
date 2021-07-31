import { NgModule } from '@angular/core';
import { WarehouseLayoutComponent } from '../../container/warehouse-layout.component';
import { RequisiteWarehouseComponent } from './container/requisite-warehouse/requisite-warehouse.component';
import { RequisiteRoutingModule } from './requisite-routing.module';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { RequisiteReducer } from './+state/requisite.reducer';
import { EffectsModule } from '@ngrx/effects';
import { RequisiteEffect } from './+state/requisite.effect';
import { ComponentModule } from '../../components/component.module';

@NgModule({
  imports: [
    RequisiteRoutingModule,
    StoreModule.forFeature(FeatureName.REQUISITE, RequisiteReducer),
    EffectsModule.forFeature([RequisiteEffect]),
    ComponentModule
  ],
  declarations: [
    RequisiteWarehouseComponent
  ],
  exports: [
    RequisiteWarehouseComponent
  ],
  bootstrap: [WarehouseLayoutComponent]
})
export class RequisiteModule {
}
