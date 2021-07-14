import { NgModule } from '@angular/core';
import { StatisticalComponent } from './container/statistical/statistical.component';
import { StatisticalRoutingModule } from './statistical-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    StatisticalRoutingModule,
    CommonModule
  ],
  declarations: [
    StatisticalComponent,
  ],
  providers: [],
})
export class StatisticalModule {

}
