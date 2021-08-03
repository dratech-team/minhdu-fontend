import { NgModule } from '@angular/core';
import { PoultryFoodWarehouseComponent } from './container/poultry-food-warehouse/poultry-food-warehouse.component';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { PoultryFoodReducer } from './+state/poultry-food.reducer';
import { PoultryFoodEffect } from './+state/poultry-food.effect';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    StoreModule.forFeature(FeatureName.POULTRY_FOOD, PoultryFoodReducer),
    EffectsModule.forFeature([PoultryFoodEffect]),
    ReactiveFormsModule
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
