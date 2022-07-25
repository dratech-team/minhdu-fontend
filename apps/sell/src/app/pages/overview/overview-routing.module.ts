import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './container/overview/overview.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: OverviewComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverviewRoutingModule {}
