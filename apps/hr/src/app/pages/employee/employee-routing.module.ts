import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailEmployeeComponent } from './containers/detail-employee/detail-employee.component';
import { EmployeeComponent } from './containers/employee/employee.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent
  },
  {
    path: 'chi-tiet-nhan-vien/:id',
    component: DetailEmployeeComponent,
    data: {
      title: 'Chi tiết nhân viên'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {
}
