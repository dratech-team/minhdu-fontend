import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PoultryFoodWarehouseComponent } from './container/poultry-food-warehouse/poultry-food-warehouse.component';

const routes: Routes = [
  {
    path: '',
    component:PoultryFoodWarehouseComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoultryFoodRoutingModule {
}
