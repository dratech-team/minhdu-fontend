import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingSalaryComponent} from "./salary/containers/setting-salary";

const routes: Routes = [
  {
    path:'luong',
    component: SettingSalaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule {
}
