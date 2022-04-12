import {NgModule} from '@angular/core';
import {TableSelectPayrollComponent} from "./components/table-select-payroll/table-select-payroll.component";
import {NzMessageModule} from "ng-zorro-antd/message";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzInputModule} from "ng-zorro-antd/input";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    TableSelectPayrollComponent
  ],
  imports: [
    NzMessageModule,
    NzTableModule,
    NzInputModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [
    TableSelectPayrollComponent
  ]
})
export class SharedModule {
}
