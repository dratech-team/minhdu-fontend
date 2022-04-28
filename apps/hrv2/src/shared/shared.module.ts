import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RankRoutingModule} from "../app/pages/rank/rank-routing.module";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {ReactiveFormsModule} from "@angular/forms";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzMessageModule} from "ng-zorro-antd/message";

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RankRoutingModule,
    NzTableModule,
    NzCollapseModule,
    ReactiveFormsModule,
    NzDropDownModule,
    NzIconModule,
    NzStepsModule,
    NzSelectModule,
    NzModalModule,
    NzMessageModule,
    NzButtonModule
  ],
  exports: [
  ]
})
export class SharedModule {
}
