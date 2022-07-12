import { NgModule } from '@angular/core';
import { StatisticalPersonnelRoutingModule } from './statistical-personnel-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { StatisticalPersonnelComponent } from './container/statistical-personnel/statistical-personnel.component';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MatNativeDateModule } from '@angular/material/core';
import { OverviewHrModule } from '../../../../../hr/src/app/pages/overview/overview-hr.module';

@NgModule({
  imports: [
    MatNativeDateModule,
    ComponentsModule,
    StatisticalPersonnelRoutingModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    OverviewHrModule,
  ],
  declarations: [StatisticalPersonnelComponent],
  exports: [],
})
export class StatisticalPersonnelModule {}
