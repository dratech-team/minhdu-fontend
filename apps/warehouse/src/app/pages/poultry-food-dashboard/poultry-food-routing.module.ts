import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PoultryFoodWarehouseComponent } from './container/poultry-food-warehouse/poultry-food-warehouse.component';
import { DetailPoultryFoodComponent } from '../../components/poultry-food/detail-poultry-food/detail-poultry-food.component';

const routes: Routes = [
  {
    path: '',
    component:PoultryFoodWarehouseComponent
  },
  {
    path: 'chi-tiet-thuc-pham',
    component:DetailPoultryFoodComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoultryFoodRoutingModule {
}
