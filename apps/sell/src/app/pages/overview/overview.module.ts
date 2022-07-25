import { NgModule } from '@angular/core';
import { OverviewComponent } from './container/overview/overview.component';
import { OverviewRoutingModule } from './overview-routing.module';
import { CommonModule, DatePipe } from '@angular/common';
import { BarChartModule } from '@swimlane/ngx-charts';
import { ComponentsModule } from '@minhdu-fontend/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectStatisticalComponent } from './component/select-statistical/select-statistical.component';
import { OverviewService } from './service/overview.service';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';

@NgModule({
  imports: [
    ComponentsModule,
    OverviewRoutingModule,
    CommonModule,
    BarChartModule,
    FormsModule,
    ReactiveFormsModule,
    NzMessageModule,
    NzDatePickerModule,
    NzSelectModule
  ],
  declarations: [
    OverviewComponent,
    SelectStatisticalComponent
  ],
  exports: [OverviewComponent],
  providers: [OverviewService, DatePipe]
})
export class OverviewModule {
}
