import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RankComponent } from './containers/rank/rank.component';

const routes: Routes = [
  {
    path: '',
    component: RankComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RankRoutingModule {}
