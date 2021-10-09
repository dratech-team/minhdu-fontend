import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SalaryBasicComponent } from './container/salary-basic/salary-basic.component';
import { TemplateOvertimeComponent } from './container/overtime-template/template-overtime.component';
import { HolidayComponent } from './container/holiday/holiday.component';


const routes: Routes = [
  {
    path: '',
    component: SalaryBasicComponent
  },
  {
    path: 'tang-ca',
    component: TemplateOvertimeComponent
  },
  {
    path: 'ngay-le',
    component: HolidayComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TemplateRoutingModule {
}
