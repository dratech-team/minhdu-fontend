import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DepartmentComponent} from "./department/containers/department/department.component";
import {PositionComponent} from "./position/containers/position/position.component";
import {BranchComponent} from "./branch/containers/branch/branch.component";
import {DetailBranchComponent} from "./branch/containers/detail-branch/detail-branch.component";

const routes: Routes = [
  {
    path:'',
    component: BranchComponent
  },
  {
    path:'don-vi/chi-tiet-don-vi/:id',
    component: DetailBranchComponent
  },
  {
    path:'phong-ban',
    component: DepartmentComponent
  },
  {
    path:'chuc-vu',
    component: PositionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgchartRoutingModule {
}
