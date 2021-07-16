import { NgModule } from '@angular/core';
import { StatisticalComponent } from './container/statistical/statistical.component';
import { StatisticalRoutingModule } from './statistical-routing.module';
import { CommonModule } from '@angular/common';
import { BarChartModule } from '@swimlane/ngx-charts';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    ComponentsModule,
    StatisticalRoutingModule,
    CommonModule,
    BarChartModule,
    MatSelectModule
  ],
  declarations: [
    StatisticalComponent,
  ],
  providers: [],
})
export class StatisticalModule {

}
