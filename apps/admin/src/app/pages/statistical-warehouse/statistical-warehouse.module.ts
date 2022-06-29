import { NgModule } from '@angular/core';
import { StatisticalWarehouseRoutingModule } from './statistical-warehouse-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { StatisticalWarehouseComponent } from './container/statistical-warehouse/statistical-warehouse.component';

@NgModule({
  imports: [
    StatisticalWarehouseRoutingModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  declarations: [StatisticalWarehouseComponent],
  exports: [],
})
export class StatisticalWarehouseModule {}
