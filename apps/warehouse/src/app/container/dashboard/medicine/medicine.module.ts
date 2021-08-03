import { NgModule } from '@angular/core';
import { MedicineRoutingModule } from './medicine-routing.module';
import { MedicineComponent } from './container/medicine/medicine.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    MedicineRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    InfiniteScrollModule,
    CommonModule
  ],
  declarations: [
    MedicineComponent,
  ],
  exports: [
    MedicineComponent
  ],
})
export class MedicineModule {
}
