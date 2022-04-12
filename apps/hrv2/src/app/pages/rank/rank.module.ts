import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RankRoutingModule} from "./rank-routing.module";
import {RankComponent} from "./containers/rannk/rank.component";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "@minhdu-fontend/components";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  imports: [
    CommonModule,
    RankRoutingModule,
    NzTableModule,
    NzCollapseModule,
    ReactiveFormsModule,
    ComponentsModule,
    NzDropDownModule,
    NzIconModule
  ],
  declarations:[RankComponent],
})

export class RankModule{

}
