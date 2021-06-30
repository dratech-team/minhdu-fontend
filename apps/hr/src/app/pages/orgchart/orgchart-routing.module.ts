import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrgchartContainer } from './containers/orgchart/orgchart.container';

const routes: Routes = [
  {
    path: '',
    component: OrgchartContainer
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OrgchartRoutingModule {
}
