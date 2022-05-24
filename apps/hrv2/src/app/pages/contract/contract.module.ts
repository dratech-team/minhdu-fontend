import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "@minhdu-fontend/components";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzIconModule} from 'ng-zorro-antd/icon';
import {SharedModule} from "../../../shared/shared.module";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NgxCurrencyModule} from "ngx-currency";
import {AkitaNgEffectsModule} from "@datorama/akita-ng-effects";
import {ContractEffect} from "./state/contract/contract.effect";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
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
    AkitaNgEffectsModule.forFeature([ContractEffect])
  ],
})

export class ContractModule {
}
