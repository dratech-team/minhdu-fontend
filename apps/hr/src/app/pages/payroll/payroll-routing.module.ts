import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PayrollComponent } from './container/payroll/payroll.component';
import { DetailPayrollComponent } from './container/detail-payroll/detail-payroll.component';
import { TemplateComponent } from './container/template/template.component';
import { HolidayComponent } from './container/holiday/holiday.component';

const routes: Routes = [
  {
    path: '',
    component: PayrollComponent
  },
  {
    path: 'detail-payroll/:id',
    component: DetailPayrollComponent,
    data: {
      title: 'Chi tiết Phiếu lương'
    }
  },
  {
    path: 'template',
    component: TemplateComponent,
    data: {
      title: 'Tạo mẫu'
    }
  },
  {
    path: 'holiday',
    component: HolidayComponent,
    data: {
      title: 'Ngày lễ'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PayrollRoutingModule {
}
