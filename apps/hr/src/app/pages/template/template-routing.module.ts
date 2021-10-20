import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TemplateOvertimeComponent } from './container/overtime-template/template-overtime.component';
import { HolidayComponent } from './container/holiday/holiday.component';
import { SalaryComponent } from './container/salary/salary.component';


const routes: Routes = [
  {
    path: '',
    component: SalaryComponent
  },
  {
    path: 'tang-ca',
    component: TemplateOvertimeComponent
  },
  {
    path: 'ngay-le',
    component: HolidayComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TemplateRoutingModule {
}
