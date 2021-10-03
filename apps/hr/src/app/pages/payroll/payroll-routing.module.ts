import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PayrollComponent } from './container/payroll/payroll.component';
import { DetailPayrollComponent } from './container/detail-payroll/detail-payroll.component';
import { HolidayComponent } from './container/holiday/holiday.component';
import { HistoryPayrollComponent } from './container/history-payroll/history-payroll.component';

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
    path: 'lich-su-luong/:id',
    component: HistoryPayrollComponent,
    data: {
      title: 'Lịch sử lương nhân viên'
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
