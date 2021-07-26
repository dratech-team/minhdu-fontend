import { NgModule } from '@angular/core';
import { AppComponent } from '../../container/app.component';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { WarehouseReducer } from './+state/warehouse/warehouse.reducer';
import { WarehouseEffect } from './+state/warehouse/warehouse.effect';



@NgModule({
  imports: [
    StoreModule.forFeature(FeatureName.WAREHOUSE,WarehouseReducer),
    EffectsModule.forFeature([WarehouseEffect]),
  ],
  bootstrap: [AppComponent]
})
export class WarehouseModule {
}
