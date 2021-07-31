import { NgModule } from '@angular/core';
import { WarehouseLayoutComponent } from '../../container/warehouse-layout.component';
import { MainDashboardComponent } from './container/main-warehouse/main-dashboard.component';
import { MainDashboardRoutingModule } from './main-dashboard-routing.module';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { MedicineReducer } from '../medicine-dashboard/+state/medicine.reducer';
import { ApplianceReducer } from '../appliances-dashboard/+state/appliance.reducer';
import { PoultryFoodReducer } from '../poultry-food-dashboard/+state/poultry-food.reducer';
import { RequisiteReducer } from '../requisite-dashboard/+state/requisite.reducer';
import { MedicineEffect } from '../medicine-dashboard/+state/medicine.effect';
import { ApplianceEffect } from '../appliances-dashboard/+state/appliance.effect';
import { PoultryFoodEffect } from '../poultry-food-dashboard/+state/poultry-food.effect';
import { RequisiteEffect } from '../requisite-dashboard/+state/requisite.effect';
import { ProductReducer } from '../Product-dashboard/+state/product.reducer';
import { ProductEffect } from '../Product-dashboard/+state/product.effect';
import { RequisiteModule } from '../requisite-dashboard/requisite.module';
import { ProductModule } from '../Product-dashboard/product.module';
import { PoultryFoodModule } from '../poultry-food-dashboard/poultry-food.module';
import { MedicineModule } from '../medicine-dashboard/medicine.module';
import { AppliancesModule } from '../appliances-dashboard/appliances.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ComponentModule } from '../../components/component.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    MainDashboardRoutingModule,
    StoreModule.forFeature(FeatureName.MEDICINE, MedicineReducer),
    StoreModule.forFeature(FeatureName.APPLIANCE, ApplianceReducer),
    StoreModule.forFeature(FeatureName.PRODUCT, ProductReducer),
    StoreModule.forFeature(FeatureName.POULTRY_FOOD, PoultryFoodReducer),
    StoreModule.forFeature(FeatureName.REQUISITE, RequisiteReducer),
    EffectsModule.forFeature(
      [
        ProductEffect,
        MedicineEffect,
        ApplianceEffect,
        PoultryFoodEffect,
        RequisiteEffect
      ]
    ),
    RequisiteModule,
    ProductModule,
    PoultryFoodModule,
    MedicineModule,
    AppliancesModule,
    MatMenuModule,
    MatButtonModule,
    ComponentModule,
    CommonModule
  ],
  declarations: [
    MainDashboardComponent
  ],
  exports: [
    MainDashboardComponent
  ],
  bootstrap: [WarehouseLayoutComponent]
})
export class MainDashboardModule {
}
