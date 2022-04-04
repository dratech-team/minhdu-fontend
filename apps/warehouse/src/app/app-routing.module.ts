import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WarehouseLayoutComponent} from './container/base/warehouse-layout.component';
import {RouteGuard} from "./route.guard";

const routes: Routes = [
  {
    path: 'auth/login',
    loadChildren: () =>
      import('@minhdu-fontend/auth').then((m) => m.AuthModule)
  },
  {
    path: '',
    component: WarehouseLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [RouteGuard]
      },
      {
        path: 'hang-hoa',
        loadChildren: () => import('./pages/product/product.module').then(m => m.ProductModule),
        canActivate: [RouteGuard]
      },
      {
        path: 'xuat-nhap-kho',
        loadChildren: () => import('./pages/migrate/migrate.module').then(m => m.MigrateModule),
        canActivate: [RouteGuard]
      },
      {
        path: 'quan-ly-chi-nhanh',
        loadChildren: () => import('./pages/branch/branch.module').then(m => m.BranchModule),
        canActivate: [RouteGuard]
      },
      {
        path: 'quan-ly-nha-cung-cap',
        loadChildren: () => import('./pages/provider/provider.module').then(m => m.ProviderModule),
        canActivate: [RouteGuard]
      },
      {
        path: 'he-thong',
        loadChildren: () => import('@minhdu-fontend/system').then(m => m.SystemModule),
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
