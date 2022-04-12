import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RankComponent} from "./containers/rannk/rank.component";

const routes: Routes = [
  {
    path:'',
    component: RankComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RankRoutingModule {
}
