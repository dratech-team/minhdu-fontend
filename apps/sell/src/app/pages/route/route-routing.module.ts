import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DetailRouteComponent, RouteComponent } from './container';

const routes: Routes = [
  {
    path: '',
    component: RouteComponent
  },
  {
    path: 'chi-tiet-tuyen-duong/:id',
    component: DetailRouteComponent,
    data: {
      title: 'Chi tiết tuyền đường'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule {
}
