import { NgModule } from '@angular/core';
import { MedicineComponent } from './container/medicine/medicine.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { MedicineEffect } from './+state/medicine.effect';
import { MedicineReducer } from './+state/medicine.reducer';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MedicineDialogComponent } from './components/medicine-dialog/medicine-dialog.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    MatInputModule,
    InfiniteScrollModule,
    CommonModule,
    StoreModule.forFeature(FeatureName.MEDICINE, MedicineReducer),
    EffectsModule.forFeature([MedicineEffect]),
    MatSelectModule,
    MatDialogModule,
    NgxSkeletonLoaderModule
  ],
  declarations: [
    MedicineDialogComponent,
    MedicineComponent,
  ],
  exports: [
    MedicineComponent
  ],
  providers:[
    DatePipe
  ]
})
export class MedicineModule {
}
