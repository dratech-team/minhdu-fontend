import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DetailOverviewComponent } from './container/detail-overview/detail-overview.component';
import { OverviewSalaryComponent } from './container/overview-salary/overview-salary.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewSalaryComponent,
  },
  {
    path: 'chi-tiet-luong/:id',
    component: DetailOverviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverviewSalaryRoutingModule {}
