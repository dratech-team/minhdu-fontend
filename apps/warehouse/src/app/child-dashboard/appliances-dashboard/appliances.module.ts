import { NgModule } from '@angular/core';
import { WarehouseLayoutComponent } from '../../container/warehouse-layout.component';
import { AppliancesRoutingModule } from './appliances-routing.module';
import { ApplianceComponent } from './container/appliance-warhouse/appliance.component';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { ApplianceReducer } from './+state/appliance.reducer';
import { ApplianceEffect } from './+state/appliance.effect';

@NgModule({
  imports: [
    AppliancesRoutingModule,
    StoreModule.forFeature(FeatureName.APPLIANCE, ApplianceReducer),
    EffectsModule.forFeature([ApplianceEffect])
  ],
  declarations: [
    ApplianceComponent
  ],
  exports: [
    ApplianceComponent
  ],
  bootstrap: [WarehouseLayoutComponent]
})
export class AppliancesModule {
}
