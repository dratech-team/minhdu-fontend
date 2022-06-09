import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {SettingRoutingModule} from "./setting-routing.module";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "@minhdu-fontend/components";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzIconModule} from 'ng-zorro-antd/icon';
import {SharedModule} from "../../../shared/shared.module";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {BlockSalaryPipe} from "./salary/pipes";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NgxCurrencyModule} from "ngx-currency";
import {SettingSalaryComponent} from "./salary/containers/setting-salary";
import {ModalSettingSalaryComponent} from "./salary/components/setting-salary";
import {VisibleSalarySettingComponent} from "./salary/components/custom-visible";
import {NzButtonModule} from "ng-zorro-antd/button";
import {AkitaNgEffectsModule} from "@datorama/akita-ng-effects";
import {SettingSalaryEffect} from "./salary/state";
import {HttpClientModule} from "@angular/common/http";
import {NzInputModule} from "ng-zorro-antd/input";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {PricesPipe} from "./salary/pipes/prices.pipe";
import {SalaryTypePipe} from "./salary/pipes/salary-type.pipe";
import {OrgchartV2Module} from "@minhdu-fontend/orgchart-v2";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {PriceSettingSalaryPipe} from "./salary/pipes/price-setting-salary.pipe";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {ModalRateConditionComponent} from "./salary/components/modal-rate-condition/modal-rate-condition.component";
import {RateConditionComponent} from "./salary/components/rate-condition/rate-condition.component";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    HttpClientModule,
    SettingRoutingModule,
    NzTableModule,
    NzCollapseModule,
    ReactiveFormsModule,
    AkitaNgEffectsModule.forFeature([SettingSalaryEffect]),
    ComponentsModule,
    NzDropDownModule,
    NzIconModule,
    NzSelectModule,
    NzPopoverModule,
    NzRadioModule,
    NzCheckboxModule,
    NgxCurrencyModule,
    NzButtonModule,
    NzInputModule,
    MatChipsModule,
    MatIconModule,
    OrgchartV2Module,
    NzDatePickerModule,
    NzToolTipModule,
  ],
  declarations: [
    SettingSalaryComponent,
    BlockSalaryPipe,
    ModalSettingSalaryComponent,
    VisibleSalarySettingComponent,
    PricesPipe,
    SalaryTypePipe,
    PriceSettingSalaryPipe,
    ModalRateConditionComponent,
    RateConditionComponent
  ],
  exports: [
    SalaryTypePipe,
    PricesPipe,
    PriceSettingSalaryPipe
  ],
  providers: [
    DatePipe,
    SalaryTypePipe,
    PricesPipe,
  ]
})

export class SettingModule {

}
