import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageLayoutComponent} from "./container/base/page-layout.component";
import {TabEnum} from "./state/app.entity";
import {RouteGuard} from "./route.guard";

const routes: Routes = [
  {
    path: TabEnum.DASHBOARD,
    component: PageLayoutComponent,
    children: [
      {
        path: TabEnum.RANK,
        loadChildren: () =>
          import('./pages/rank/rank.module').then(
            (m) => m.RankModule
          ),
        canActivate: [RouteGuard]
      },
    ],
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      initialNavigation: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
