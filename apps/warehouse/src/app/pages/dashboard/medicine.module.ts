import { NgModule } from '@angular/core';
import { MedicineComponent } from './container/medicine/medicine.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule, DatePipe } from '@angular/common';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductDialogComponent } from './components/product-dialog/product-dialog.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { ProductService } from './services/product.service';
import { ProductEffect } from './state/product.effect';
import { WarehouseService } from '../warehouse/services/warehouse.service';
import { WarehouseEffect } from '../warehouse/state/warehouse.effect';

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
    AkitaNgEffectsModule.forFeature([ProductEffect]),
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
    WarehouseService,
    ProductService
  ]
})
export class MedicineModule {
}
