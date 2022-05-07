import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {OrgchartRoutingModule} from "./orgchart-routing.module";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "@minhdu-fontend/components";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzIconModule} from 'ng-zorro-antd/icon';
import {SharedModule} from "../../../shared/shared.module";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NgxCurrencyModule} from "ngx-currency";
import {NzButtonModule} from "ng-zorro-antd/button";
import {HttpClientModule} from "@angular/common/http";
import {NzInputModule} from "ng-zorro-antd/input";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {DepartmentComponent} from "./department/containers/department/department.component";
import {OrgchartV2Module} from "@minhdu-fontend/orgchart-v2";
import {ModalDepartmentComponent} from "./department/components/category/modal-department.component";
import {NzStepsModule} from "ng-zorro-antd/steps";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    HttpClientModule,
    OrgchartRoutingModule,
    NzTableModule,
    NzCollapseModule,
    ReactiveFormsModule,
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
    NzStepsModule
  ],
  declarations: [
    DepartmentComponent,
    ModalDepartmentComponent
  ],
  exports: [
  ],
  providers: [
    DatePipe,
  ]
})

export class OrgchartModule {

}
