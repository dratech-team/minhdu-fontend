import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PayrollComponent} from "./containers/payroll/payroll.component";
import {DetailPayrollComponent} from "./containers/detail-payroll/detail-payroll.component";
import {HistoryPayrollComponent} from "./containers/history-payroll/history-payroll.component";

const routes: Routes = [
  {
    path: '',
    component: PayrollComponent
  },
  {
    path: 'chi-tiet-phieu-luong/:id',
    component: DetailPayrollComponent
  },
  {
    path: 'lich-su-luong/:id',
    component: HistoryPayrollComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PayrollRoutingModule {
}
