import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SettingRoutingModule} from "./setting-routing.module";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "@minhdu-fontend/components";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import { NzIconModule } from 'ng-zorro-antd/icon';
import {SharedModule} from "../../../shared/shared.module";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {TransformBlockSalaryPipe} from "./salary/pipes";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NgxCurrencyModule} from "ngx-currency";
import {SettingSalaryComponent} from "./salary/containers/setting-salary";
import {SettingSalaryDialogComponent} from "./salary/components/setting-salary";
import {VisibleSettingSalaryComponent} from "./salary/components/custom-visible";
import {NzButtonModule} from "ng-zorro-antd/button";
import {AkitaNgEffectsModule} from "@datorama/akita-ng-effects";
import {SettingSalaryEffect} from "./salary/state";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    SettingRoutingModule,
    HttpClientModule,
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
  ],
  declarations:[
    SettingSalaryComponent,
    TransformBlockSalaryPipe,
    SettingSalaryDialogComponent,
    VisibleSettingSalaryComponent
  ],
})

export class SettingModule {

}
