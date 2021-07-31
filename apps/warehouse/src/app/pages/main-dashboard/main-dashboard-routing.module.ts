import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainDashboardComponent } from './container/main-warehouse/main-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component:MainDashboardComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainDashboardRoutingModule {
}
