import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SalaryBasicComponent } from './container/salary-basic/salary-basic.component';


const routes: Routes = [
  {
    path: '',
    component: SalaryBasicComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TemplateRoutingModule {
}
