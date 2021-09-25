import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SalaryBasicComponent } from './container/salary-basic/salary-basic.component';
import { TemplateOvertimeComponent } from './container/overtime-template/template-overtime.component';


const routes: Routes = [
  {
    path: '',
    component: SalaryBasicComponent
  },
  {
    path: 'tang-ca',
    component: TemplateOvertimeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TemplateRoutingModule {
}
