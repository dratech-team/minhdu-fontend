import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './containers/profile/profile.component';
import { DetailEmployeeComponent } from './containers/detail-employee/detail-employee.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent
  },
  {
    path: 'detail-employee/:id',
    component: DetailEmployeeComponent,
    data: {
      title: 'Chi tiết nhân viên',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {
}
