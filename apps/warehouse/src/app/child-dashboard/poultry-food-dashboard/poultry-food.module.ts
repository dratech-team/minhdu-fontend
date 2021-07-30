import { NgModule } from '@angular/core';
import { WarehouseLayoutComponent } from '../../container/warehouse-layout.component';
import { PoultryFoodRoutingModule } from './poultry-food-routing.module';
import { PoultryFoodComponent } from './container/poultry-food-warehouse/poultry-food.component';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { PoultryFoodReducer } from './+state/poultry-food.reducer';
import { PoultryFoodEffect } from './+state/poultry-food.effect';

@NgModule({
  imports: [
    PoultryFoodRoutingModule,
    StoreModule.forFeature(FeatureName.POULTRY_FOOD, PoultryFoodReducer),
    EffectsModule.forFeature([PoultryFoodEffect])
  ],
  declarations: [
    PoultryFoodComponent
  ],
  exports: [
    PoultryFoodComponent
  ],
  bootstrap: [WarehouseLayoutComponent]
})
export class PoultryFoodModule {
}
