import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageLayoutComponent} from "./container/base/page-layout.component";
import {TabEnum} from "./state/app.entity";
import {RouteGuard} from "./route.guard";

const routes: Routes = [
  {
    path: 'auth/login',
    loadChildren: () =>
      import('@minhdu-fontend/auth').then((m) => m.AuthModule)
  },
  {
    path: TabEnum.DASHBOARD,
    component: PageLayoutComponent,
    children: [
      {
        path: TabEnum.EMPLOYEE,
        loadChildren: () =>
          import('./pages/employee/employee.module').then(
            (m) => m.EmployeeModule
          ),
        canActivate: [RouteGuard]
      },
      {
        path: TabEnum.SETTING,
        loadChildren: () =>
          import('./pages/setting/setting.module').then(
            (m) => m.SettingModule
          ),
        canActivate: [RouteGuard]
      },
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
