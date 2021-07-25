import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PoultryFoodComponent } from './container/poultry-food.component';

const routes: Routes = [
  {
    path: '',
    component:PoultryFoodComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoultryFoodRoutingModule {
}
