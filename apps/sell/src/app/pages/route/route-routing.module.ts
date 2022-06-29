import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouteComponent } from './container/route/route.component';
import { DetailRouteComponent } from './container/detail-route/detail-route.component';

const routes: Routes = [
  {
    path: '',
    component: RouteComponent,
  },
  {
    path: 'chi-tiet-tuyen-duong/:id',
    component: DetailRouteComponent,
    data: {
      title: 'Chi tiết tuyền đường',
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
