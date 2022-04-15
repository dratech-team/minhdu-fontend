import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingSalaryComponent} from "./salary/containers/setting-salary/setting-salary.component";

const routes: Routes = [
  {
    path:'',
    component: SettingSalaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule {
}
