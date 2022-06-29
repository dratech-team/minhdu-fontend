import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommodityComponent } from './container/commodity/commodity.component';
import { DetailCommodityComponent } from './container/detail-commodity/detail-commodity.component';

const routes: Routes = [
  {
    path: '',
    component: CommodityComponent,
  },
  {
    path: 'chi-tiet-hang-hoa/:id',
    component: DetailCommodityComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommodityRoutingModule {}
