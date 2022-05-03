import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {EmployeeRoutingModule} from "./employee-routing.module";
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
import {EmployeeLibV2Module} from "@minhdu-fontend/employee-v2";
import {EmployeeComponent} from "./containers/employee/employee.component";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {FlatSalaryTypePipe} from "./pipes/flat-salary-type.pipe";
import {OrgchartV2Module} from "@minhdu-fontend/orgchart-v2";
import {DetailEmployeeComponent} from "./containers/detail-employee/detail-employee.component";
import {WorkHistoryPipe} from "./pipes/work-history.pipe";
import {ExistPipe} from "./pipes/exist.pipe";
import {ModalCategoryComponent} from "./components/category/modal-category.component";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {ModalEmployeeComponent} from "./components/employee/modal-employee.component";
import {ProfileComponent} from "./components/profile/profile.component";

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
    OrgchartV2Module,
    EmployeeLibV2Module,
    NzDropDownModule,
    NzIconModule,
    NzSelectModule,
    NzPopoverModule,
    NzRadioModule,
    NzCheckboxModule,
    NgxCurrencyModule,
    NzButtonModule,
    NzInputModule,
    NzSpinModule,
    DragDropModule,
    NzStepsModule,
  ],

  declarations: [
    EmployeeComponent,
    DetailEmployeeComponent,
    WorkHistoryPipe,
    FlatSalaryTypePipe,
    ExistPipe,
    ModalCategoryComponent,
    ModalEmployeeComponent,
    ProfileComponent
  ],
  providers: [
    DatePipe,
  ]
})

export class EmployeeModule {

}
