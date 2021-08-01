import { NgModule } from '@angular/core';
import { WarehouseLayoutComponent } from '../../container/warehouse-layout.component';
import { PoultryFoodRoutingModule } from './poultry-food-routing.module';
import { PoultryFoodWarehouseComponent } from './container/poultry-food-warehouse/poultry-food-warehouse.component';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { PoultryFoodReducer } from './+state/poultry-food.reducer';
import { PoultryFoodEffect } from './+state/poultry-food.effect';
import { ComponentModule } from '../../../components/component.module';

@NgModule({
  imports: [
    PoultryFoodRoutingModule,
    StoreModule.forFeature(FeatureName.POULTRY_FOOD, PoultryFoodReducer),
    EffectsModule.forFeature([PoultryFoodEffect]),
    ComponentModule
  ],
  declarations: [
    PoultryFoodWarehouseComponent
  ],
  exports: [
    PoultryFoodWarehouseComponent
  ],
  bootstrap: [WarehouseLayoutComponent]
})
export class PoultryFoodModule {
}
