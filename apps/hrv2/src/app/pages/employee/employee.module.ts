import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {EmployeeRoutingModule} from "./employee-routing.module";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "@minhdu-fontend/components";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import { NzIconModule } from 'ng-zorro-antd/icon';
import {SharedModule} from "../../../shared/shared.module";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NgxCurrencyModule} from "ngx-currency";
import {NzButtonModule} from "ng-zorro-antd/button";
import {AkitaNgEffectsModule} from "@datorama/akita-ng-effects";
import {HttpClientModule} from "@angular/common/http";
import {NzInputModule} from "ng-zorro-antd/input";
import {EmployeeLibV2Module} from "@minhdu-fontend/employee-v2";
import {EmployeeComponent} from "./containers/employee/employee.component";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    HttpClientModule,
    EmployeeRoutingModule,
    NzTableModule,
    NzCollapseModule,
    ReactiveFormsModule,
    ComponentsModule,
    EmployeeLibV2Module,
    NzDropDownModule,
    NzIconModule,
    NzSelectModule,
    NzPopoverModule,
    NzRadioModule,
    NzCheckboxModule,
    NgxCurrencyModule,
    NzButtonModule,
    NzInputModule
  ],

  declarations:[
    EmployeeComponent
  ],
  providers:[
    DatePipe,
  ]
})

export class EmployeeModule {

}
