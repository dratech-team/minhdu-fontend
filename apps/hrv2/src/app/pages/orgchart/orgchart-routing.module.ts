import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DepartmentComponent} from "./department/containers/department/department.component";
import {PositionComponent} from "./position/containers/position/position.component";

const routes: Routes = [
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
