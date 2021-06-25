import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PayrollComponent } from './container/payroll/payroll.component';
import { DetailPayrollComponent } from './container/detail-payroll/detail-payroll.component';

const routes: Routes = [
      {
        path: '',
        component: PayrollComponent,
      },
  {
    path: 'detail-payroll/:id',
    component: DetailPayrollComponent,
    data: {
      title: 'Chi tiết Phiếu lương'
    }
  }
];

@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PayrollRoutingModule{
}
