import { NgModule } from '@angular/core';
import { PoultryFoodWarehouseComponent } from './container/poultry-food-warehouse/poultry-food-warehouse.component';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { PoultryFoodReducer } from './+state/poultry-food.reducer';
import { PoultryFoodEffect } from './+state/poultry-food.effect';
import { ReactiveFormsModule } from '@angular/forms';
import { PoultryFoodDialogComponent } from './components/poultry-food-dialog/poultry-food-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@minhdu-fontend/components';

@NgModule({
  imports: [
    StoreModule.forFeature(FeatureName.POULTRY_FOOD, PoultryFoodReducer),
    EffectsModule.forFeature([PoultryFoodEffect]),
    ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    InfiniteScrollModule,
    NgxSkeletonLoaderModule,
    CommonModule,
    ComponentsModule,
  ],
  declarations: [
    PoultryFoodDialogComponent,
    PoultryFoodWarehouseComponent
  ],
  exports: [
    PoultryFoodWarehouseComponent
  ],
})
export class PoultryFoodModule {
}
