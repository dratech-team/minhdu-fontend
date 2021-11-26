import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StatisticalWarehouseComponent } from './container/statistical-warehouse/statistical-warehouse.component';

const routes: Routes = [
  {
    path: '',
    component:StatisticalWarehouseComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticalWarehouseRoutingModule {
}
