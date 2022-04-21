import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {PayrollComponent} from "./containers/payroll/payroll.component";

const routes: Routes = [
  {
    path: '',
    component: PayrollComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PayrollRoutingModule {
}
