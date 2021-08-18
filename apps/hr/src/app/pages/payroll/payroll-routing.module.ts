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
    path: 'chi-tiet-phieu-luong/:id',
    component: DetailPayrollComponent,
    data: {
      title: 'Chi tiết Phiếu lương'
    }
  },
  {
    path: 'ban-mau',
    component: TemplateComponent,
    data: {
      title: 'Tạo mẫu'
    }
  },
  {
    path: 'ngay-le',
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
