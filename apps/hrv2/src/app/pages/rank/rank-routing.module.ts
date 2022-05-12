import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RankComponent} from "./containers/rannk/rank.component";
import {SettingRankComponent} from "./containers/setting-rannk/setting-rank.component";
import {SettingBonusComponent} from "./containers/setting-bonus/setting-bonus.component";

const routes: Routes = [
  {
    path:'',
    component: RankComponent
  },
  {
    path:'cai-dat-xep-hang',
    component: SettingRankComponent
  },
  {
    path:'cai-dat-thuong',
    component: SettingBonusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RankRoutingModule {
}
