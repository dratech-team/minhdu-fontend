import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StatisticalSellComponent } from './statistical-sell.component';

const routes: Routes = [
  {
    path: '',
    component:StatisticalSellComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticalSellRoutingModule {
}
