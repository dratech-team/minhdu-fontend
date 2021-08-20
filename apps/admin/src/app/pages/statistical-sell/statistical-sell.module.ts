import { NgModule } from '@angular/core';
import { StatisticalSellRoutingModule } from './statistical-sell-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { StatisticalSellComponent } from './statistical-sell.component';

@NgModule({
  imports: [
    StatisticalSellRoutingModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  declarations: [
    StatisticalSellComponent
  ],
  exports: [
  ],
})
export class StatisticalSellModule {
}
