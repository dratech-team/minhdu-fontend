import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RankRoutingModule} from "./rank-routing.module";
import {RankComponent} from "./containers/rannk/rank.component";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "@minhdu-fontend/components";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzIconModule} from 'ng-zorro-antd/icon';
import {SharedModule} from "../../../shared/shared.module";
import {SettingRankComponent} from "./containers/setting-rannk/setting-rank.component";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {SettingBonusComponent} from "./containers/setting-bonus/setting-bonus.component";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NgxCurrencyModule} from "ngx-currency";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RankRoutingModule,
    NzTableModule,
    NzCollapseModule,
    ReactiveFormsModule,
    ComponentsModule,
    NzDropDownModule,
    NzIconModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NgxCurrencyModule,
  ],
  declarations: [
    RankComponent,
    SettingRankComponent,
    SettingBonusComponent
  ],
})

export class RankModule {
}
