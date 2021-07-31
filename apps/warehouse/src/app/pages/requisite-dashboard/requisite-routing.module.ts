import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RequisiteWarehouseComponent } from './container/requisite-warehouse/requisite-warehouse.component';

const routes: Routes = [
  {
    path: '',
    component:RequisiteWarehouseComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequisiteRoutingModule {
}
