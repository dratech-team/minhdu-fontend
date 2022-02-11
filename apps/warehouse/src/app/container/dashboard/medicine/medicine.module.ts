import { NgModule } from '@angular/core';
import { MedicineComponent } from './container/medicine/medicine.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule, DatePipe } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductDialogComponent } from './components/product-dialog/product-dialog.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { WarehouseService } from './state/warehouse.service';
import { WarehouseEffect } from './state/warehouse/warehouse.effect';
import { warehouseReducer } from './state/warehouse/warehouse.reducer';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    MatInputModule,
    InfiniteScrollModule,
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    NgxSkeletonLoaderModule,
    StoreModule.forFeature(FeatureName.WAREHOUSE, warehouseReducer),
    EffectsModule.forFeature([WarehouseEffect]),
    MatAutocompleteModule,
  ],
  declarations: [
    ProductDialogComponent,
    MedicineComponent
  ],
  exports: [
    MedicineComponent
  ],
  providers: [
    DatePipe,
    WarehouseService
  ]
})
export class MedicineModule {
}
