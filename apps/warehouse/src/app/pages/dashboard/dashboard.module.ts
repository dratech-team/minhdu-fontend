import { NgModule } from '@angular/core';
import { WarehouseLayoutComponent } from '../../container/warehouse-layout.component';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { MedicineReducer } from '../../container/dashboard/medicine/+state/medicine.reducer';
import { ApplianceReducer } from '../material-dashboard/+state/appliance.reducer';
import { PoultryFoodReducer } from '../../container/dashboard/poultry-food/+state/poultry-food.reducer';
import { RequisiteReducer } from '../../container/dashboard/requisite/+state/requisite.reducer';
import { MedicineEffect } from '../../container/dashboard/medicine/+state/medicine.effect';
import { ApplianceEffect } from '../material-dashboard/+state/appliance.effect';
import { PoultryFoodEffect } from '../../container/dashboard/poultry-food/+state/poultry-food.effect';
import { RequisiteEffect } from '../../container/dashboard/requisite/+state/requisite.effect';
import { ProductReducer } from '../../container/dashboard/Product/+state/product.reducer';
import { ProductEffect } from '../../container/dashboard/Product/+state/product.effect';
import { RequisiteModule } from '../../container/dashboard/requisite/requisite.module';
import { ProductModule } from '../../container/dashboard/Product/product.module';
import { PoultryFoodModule } from '../../container/dashboard/poultry-food/poultry-food.module';
import { MedicineModule } from '../../container/dashboard/medicine/medicine.module';
import { AppliancesModule } from '../material-dashboard/material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ComponentModule } from '../../components/component.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    DashboardRoutingModule,
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
    DashboardComponent
  ],
  exports: [
    DashboardComponent
  ],
  bootstrap: [WarehouseLayoutComponent]
})
export class DashboardModule {
}
