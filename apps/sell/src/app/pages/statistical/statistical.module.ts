import { NgModule } from '@angular/core';
import { StatisticalComponent } from './container/statistical/statistical.component';
import { StatisticalRoutingModule } from './statistical-routing.module';
import { CommonModule } from '@angular/common';
import { BarChartModule } from '@swimlane/ngx-charts';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ComponentsModule,
    StatisticalRoutingModule,
    CommonModule,
    BarChartModule,
    MatSelectModule,
    FormsModule
  ],
  declarations: [
    StatisticalComponent,
  ],
  providers: [],
})
export class StatisticalModule {

}
