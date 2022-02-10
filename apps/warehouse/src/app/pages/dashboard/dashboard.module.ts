import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MedicineModule } from '../../container/dashboard/medicine/medicine.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from './dashboard.service';

@NgModule({
  imports: [
    DashboardRoutingModule,
    MedicineModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [
    DashboardService
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule {
}
