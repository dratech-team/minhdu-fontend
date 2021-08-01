import { NgModule } from '@angular/core';
import { WarehouseLayoutComponent } from '../../container/warehouse-layout.component';
import { MaterialRoutingModule } from './material-routing.module';
import { MaterialComponent } from './container/material/material.component';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { MaterialReducer } from './+state/material.reducer';
import { MaterialEffect } from './+state/material.effect';
import { ComponentModule } from '../../components/component.module';

@NgModule({
  imports: [
    MaterialRoutingModule,
    StoreModule.forFeature(FeatureName.APPLIANCE, MaterialReducer),
    EffectsModule.forFeature([MaterialEffect]),
    ComponentModule
  ],
  declarations: [
    MaterialComponent
  ],
  exports: [
    MaterialComponent
  ],
  bootstrap: [WarehouseLayoutComponent]
})
export class MaterialModule {
}
