import { NgModule } from '@angular/core';
import { WarehouseLayoutComponent } from '../../container/warehouse-layout.component';
import { MedicineRoutingModule } from './medicine-routing.module';
import { MedicineWarehouseComponent } from './container/medicine-warhouse/medicine-warehouse.component';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { MedicineReducer } from './+state/medicine.reducer';
import { MedicineEffect } from './+state/medicine.effect';
import { DetailMedicineComponent } from '../../components/medicine/detail-medicine/detail-medicine.component';
import { ComponentModule } from '../../components/component.module';

@NgModule({
  imports: [
    MedicineRoutingModule,
    StoreModule.forFeature(FeatureName.MEDICINE, MedicineReducer),
    EffectsModule.forFeature([MedicineEffect]),
    ComponentModule
  ],
  declarations: [
    MedicineWarehouseComponent,
  ],
  exports: [
    MedicineWarehouseComponent
  ],
  bootstrap: [WarehouseLayoutComponent]
})
export class MedicineModule {
}
