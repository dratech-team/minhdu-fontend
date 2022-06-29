import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OverviewHrComponent } from './containers/overview/overview-hr.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewHrComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverviewHrRoutingModule {}
