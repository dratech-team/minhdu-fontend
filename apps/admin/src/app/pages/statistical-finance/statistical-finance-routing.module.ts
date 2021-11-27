import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StatisticalFinanceComponent } from './container/statistical-finance/statistical-finance.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticalFinanceComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticalFinanceRoutingModule {
}
