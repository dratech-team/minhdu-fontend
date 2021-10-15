import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PositionContainer } from './container/position/position.container';
import { BranchContainer } from './container/branch/branch.container';



const routes: Routes = [
  {
    path: 'chuc-vu',
    component:PositionContainer,
  },
  {
    path: 'don-vi',
    component:BranchContainer,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OrgchartNewRoutingModule {
}
