import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { MedicineReducer } from '../../container/dashboard/medicine/+state/medicine.reducer';
import { PoultryFoodReducer } from '../../container/dashboard/poultry-food/+state/poultry-food.reducer';
import { MedicineEffect } from '../../container/dashboard/medicine/+state/medicine.effect';
import { PoultryFoodEffect } from '../../container/dashboard/poultry-food/+state/poultry-food.effect';
import { PoultryFoodModule } from '../../container/dashboard/poultry-food/poultry-food.module';
import { MedicineModule } from '../../container/dashboard/medicine/medicine.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../container/dashboard/material/material.module';

@NgModule({
  imports: [
    DashboardRoutingModule,
    StoreModule.forFeature(FeatureName.MEDICINE, MedicineReducer),
    StoreModule.forFeature(FeatureName.POULTRY_FOOD, PoultryFoodReducer),
    EffectsModule.forFeature(
      [
        MedicineEffect,
        PoultryFoodEffect
      ]
    ),
    PoultryFoodModule,
    MedicineModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    MaterialModule
  ],
  declarations: [
    DashboardComponent
  ],
  exports: [
    DashboardComponent
  ],
})
export class DashboardModule {
}
