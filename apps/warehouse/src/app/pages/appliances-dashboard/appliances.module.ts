import { NgModule } from '@angular/core';
import { WarehouseLayoutComponent } from '../../container/warehouse-layout.component';
import { AppliancesRoutingModule } from './appliances-routing.module';
import { ApplianceWarehouseComponent } from './container/appliance-warhouse/appliance-warehouse.component';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { ApplianceReducer } from './+state/appliance.reducer';
import { ApplianceEffect } from './+state/appliance.effect';
import { ComponentModule } from '../../components/component.module';

@NgModule({
  imports: [
    AppliancesRoutingModule,
    StoreModule.forFeature(FeatureName.APPLIANCE, ApplianceReducer),
    EffectsModule.forFeature([ApplianceEffect]),
    ComponentModule
  ],
  declarations: [
    ApplianceWarehouseComponent
  ],
  exports: [
    ApplianceWarehouseComponent
  ],
  bootstrap: [WarehouseLayoutComponent]
})
export class AppliancesModule {
}
