import { NgModule } from '@angular/core';
import { StatisticalSellRoutingModule } from './statistical-sell-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { StatisticalSellComponent } from './containers/statiscal-sell/statistical-sell.component';
import { ComponentsModule } from '@minhdu-fontend/components';
import { BarChartModule } from '@swimlane/ngx-charts';
import { PickStatisticalTypeComponent } from './component/pick-statistical-type/pick-statistical-type.component';
import { PickDayToDayComponent } from './component/pick-day-to-day/pick-day-to-day.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  imports: [
    MatSnackBarModule,
    BarChartModule,
    ComponentsModule,
    StatisticalSellRoutingModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    PickDayToDayComponent,
    PickStatisticalTypeComponent,
    StatisticalSellComponent
  ],
  exports: [
  ],
})
export class StatisticalSellModule {
}
