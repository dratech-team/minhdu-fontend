import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PositionContainer } from './container/position/position.container';
import { BranchContainer } from './container/branch/branch.container';
import { DetailBranchContainer } from './container/detail-branch/detail-branch.container';


const routes: Routes = [
  {
    path: 'chuc-vu/:id',
    component: PositionContainer
  },
  {
    path: 'don-vi',
    component: BranchContainer
  },
  {
    path: 'chi-tiet-don-vi/:id',
    component: DetailBranchContainer
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OrgchartRoutingModule {
}
