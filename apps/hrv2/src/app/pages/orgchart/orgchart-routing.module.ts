import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DepartmentComponent} from "./department/containers/department/department.component";
import {BranchComponent} from "./branch/containers/branch/branch.component";

const routes: Routes = [
  {
    path:'',
    component: BranchComponent
  },
  {
    path:'phong-ban',
    component: DepartmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgchartRoutingModule {
}
