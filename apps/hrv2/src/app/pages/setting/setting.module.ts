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
import {TransformBlockSalaryPipe} from "./salary/pipes";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NgxCurrencyModule} from "ngx-currency";
import {SalarySettingComponent} from "./salary/containers/salary-setting";
import {SettingSalaryDialogComponent} from "./salary/components/salary-setting";
import {VisibleSalarySettingComponent} from "./salary/components/custom-visible";
import {NzButtonModule} from "ng-zorro-antd/button";
import {AkitaNgEffectsModule} from "@datorama/akita-ng-effects";
import {SettingSalaryEffect} from "./salary/state";
import {HttpClientModule} from "@angular/common/http";
import {NzInputModule} from "ng-zorro-antd/input";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {FilterTotalOfPipe} from "./salary/pipes/filter-total-of.pipe";
import {TransformPricesPipe} from "./salary/pipes/transform-prices.pipe";
import {TransformSalaryTypePipe} from "./salary/pipes/transform-salary-type.pipe";

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
    MatIconModule
  ],
  declarations: [
    SalarySettingComponent,
    TransformBlockSalaryPipe,
    SettingSalaryDialogComponent,
    VisibleSalarySettingComponent,
    FilterTotalOfPipe,
    TransformPricesPipe,
    TransformSalaryTypePipe
  ],
  exports: [
    TransformSalaryTypePipe
  ],
  providers: [
    DatePipe,
    FilterTotalOfPipe
  ]
})

export class SettingModule {

}
