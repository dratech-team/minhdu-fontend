import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RequisiteWarehouseComponent } from './container/requisite-warehouse/requisite-warehouse.component';
import { DetailRequisiteComponent } from '../../components/requisite/detail-requisite/detail-requisite.component';

const routes: Routes = [
  {
    path: '',
    component:RequisiteWarehouseComponent
  },
  {
    path: 'chi-tiet-van-phong-pham',
    component:DetailRequisiteComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequisiteRoutingModule {
}
