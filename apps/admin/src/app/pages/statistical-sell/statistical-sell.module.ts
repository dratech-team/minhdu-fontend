import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { ComponentsModule } from '@minhdu-fontend/components';
import { FeatureName } from '@minhdu-fontend/constants';
import { StoreModule } from '@ngrx/store';
import { BarChartModule } from '@swimlane/ngx-charts';
import { AdminReducer } from '../../states/admin.reducer';
import { PickDayToDayComponent } from './component/pick-day-to-day/pick-day-to-day.component';
import { PickStatisticalTypeComponent } from './component/pick-statistical-type/pick-statistical-type.component';
import { StatisticalSellComponent } from './containers/statiscal-sell/statistical-sell.component';
import { StatisticalSellRoutingModule } from './statistical-sell-routing.module';
import { StatisticalSellService } from './service/statistical-sell.service';
import { OverviewModule } from '../../../../../sell/src/app/pages/statistical/overview.module';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
    StoreModule.forFeature(FeatureName.ADMIN, AdminReducer),
    OverviewModule,
    MatDatepickerModule,
  ],
  declarations: [
    PickDayToDayComponent,
    PickStatisticalTypeComponent,
    StatisticalSellComponent,
  ],
  exports: [],
  providers: [
    StatisticalSellService,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  ],
})
export class StatisticalSellModule {}
