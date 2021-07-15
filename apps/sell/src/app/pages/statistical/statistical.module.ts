import { NgModule } from '@angular/core';
import { StatisticalComponent } from './container/statistical/statistical.component';
import { StatisticalRoutingModule } from './statistical-routing.module';
import { CommonModule } from '@angular/common';
import { BarChartModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    StatisticalRoutingModule,
    CommonModule,
    BarChartModule
  ],
  declarations: [
    StatisticalComponent,
  ],
  providers: [],
})
export class StatisticalModule {

}
