import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SalarySettingComponent} from "./salary/containers/salary-setting";

const routes: Routes = [
  {
    path:'luong',
    component: SalarySettingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule {
}
