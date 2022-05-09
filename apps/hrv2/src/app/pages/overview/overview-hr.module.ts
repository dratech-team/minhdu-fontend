import {NgModule} from '@angular/core';
import {ComponentsModule} from '@minhdu-fontend/components';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OverviewHrRoutingModule} from './overview-hr-routing.module';
import {OverviewHrComponent} from './containers/overview/overview-hr.component';
import {StatisticalEmployeeComponent} from './components/dialog-statistical-employee/statistical-employee.component';
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzModalModule} from "ng-zorro-antd/modal";
import {OrgchartV2Module} from "@minhdu-fontend/orgchart-v2";


@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    OverviewHrRoutingModule,
    NzDatePickerModule,
    NzSelectModule,
    NzWaveModule,
    NzButtonModule,
    NzModalModule,
    OrgchartV2Module
  ],
  exports: [
    OverviewHrComponent
  ],
  declarations: [
    OverviewHrComponent,
    StatisticalEmployeeComponent
  ]
})
export class OverviewHrModule {
}
