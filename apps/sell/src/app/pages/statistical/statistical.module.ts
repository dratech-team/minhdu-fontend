import { NgModule } from '@angular/core';
import { StatisticalComponent } from './container/statistical/statistical.component';
import { StatisticalRoutingModule } from './statistical-routing.module';
import { CommonModule, DatePipe } from '@angular/common';
import { BarChartModule } from '@swimlane/ngx-charts';
import { ComponentsModule } from '@minhdu-fontend/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickStatisticalTypeComponent } from './component/pick-statistical-type/pick-statistical-type.component';
import { StatisticalService } from './service/statistical/statistical.service';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';

@NgModule({
  imports: [
    ComponentsModule,
    StatisticalRoutingModule,
    CommonModule,
    BarChartModule,
    FormsModule,
    ReactiveFormsModule,
    NzMessageModule,
    NzDatePickerModule,
    NzSelectModule
  ],
  declarations: [
    StatisticalComponent,
    PickStatisticalTypeComponent
  ],
  exports: [StatisticalComponent],
  providers: [StatisticalService, DatePipe]
})
export class StatisticalModule {
}
