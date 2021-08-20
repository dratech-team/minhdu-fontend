import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { PoultryFoodModule } from '../../container/dashboard/poultry-food/poultry-food.module';
import { MedicineModule } from '../../container/dashboard/medicine/medicine.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../container/dashboard/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    DashboardRoutingModule,
    PoultryFoodModule,
    MedicineModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    MaterialModule,
    MatFormFieldModule,
    MatSelectModule
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
