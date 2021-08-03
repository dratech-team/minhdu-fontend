import { NgModule } from '@angular/core';
import { PoultryFoodRoutingModule } from './poultry-food-routing.module';
import { PoultryFoodWarehouseComponent } from './container/poultry-food-warehouse/poultry-food-warehouse.component';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { PoultryFoodReducer } from './+state/poultry-food.reducer';
import { PoultryFoodEffect } from './+state/poultry-food.effect';

@NgModule({
  imports: [
    PoultryFoodRoutingModule,
    StoreModule.forFeature(FeatureName.POULTRY_FOOD, PoultryFoodReducer),
    EffectsModule.forFeature([PoultryFoodEffect]),
  ],
  declarations: [
    PoultryFoodWarehouseComponent
  ],
  exports: [
    PoultryFoodWarehouseComponent
  ],
})
export class PoultryFoodModule {
}
