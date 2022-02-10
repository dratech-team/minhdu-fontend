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
import { MedicineDialogComponent } from './components/medicine-dialog/medicine-dialog.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MainReducer } from '../../../states/main.reducer';
import { WarehouseService } from './state/warehouse.service';
import { WarehouseEffect } from './state/warehouse/warehouse.effect';

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
    StoreModule.forFeature(FeatureName.WAREHOUSE, MainReducer),
    EffectsModule.forFeature([WarehouseEffect])
  ],
  declarations: [
    MedicineDialogComponent,
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
