import { NgModule } from '@angular/core';
import { StatisticalComponent } from './container/statistical/statistical.component';
import { StatisticalRoutingModule } from './statistical-routing.module';
import { CommonModule } from '@angular/common';
import { BarChartModule } from '@swimlane/ngx-charts';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickStatisticalTypeComponent } from './component/pick-statistical-type/pick-statistical-type.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PickDayToDayComponent } from './component/pick-day-to-day/pick-day-to-day.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { MainReducer } from '../../states/main.reducer';

@NgModule({
  imports: [
    ComponentsModule,
    StatisticalRoutingModule,
    CommonModule,
    BarChartModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatMenuModule,
    MatButtonModule,
    StoreModule.forFeature(FeatureName.MAIN, MainReducer),
  ],
  declarations: [
    PickDayToDayComponent,
    StatisticalComponent,
    PickStatisticalTypeComponent,
  ],
  providers: [],
})
export class StatisticalModule {

}
