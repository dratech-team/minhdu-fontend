import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OverviewComponent } from './container/overview/overview.component';
import { DetailOverviewComponent } from './components/detail-overview/detail-overview.component';



const routes: Routes = [
  {
    path: '',
    component: OverviewComponent
  },
  {
    path: 'chi-tiet-luong/:id',
    component: DetailOverviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewRoutingModule {
}
