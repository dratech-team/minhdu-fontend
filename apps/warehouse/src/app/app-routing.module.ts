import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseLayoutComponent } from './container/warehouse-layout.component';
import { RouteGuard } from './route.guard';

const routes: Routes = [
  {
    path: 'auth/login',
    loadChildren: () =>
      import('@minhdu-fontend/auth').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: WarehouseLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        canActivate: [RouteGuard],
      },
      {
        path: 'san-pham',
        loadChildren: () =>
          import('./pages/product/product.module').then((m) => m.ProductModule),
        canActivate: [RouteGuard],
      },
      {
        path: 'ton-kho',
        loadChildren: () =>
          import('./pages/stock/stock.module').then((m) => m.StockModule),
        canActivate: [RouteGuard],
      },
      {
        path: 'phieu-xuat-nhap-kho',
        loadChildren: () =>
          import('./pages/ioi-receipt/ioi-receipt.module').then(
            (m) => m.IoiReceiptModule
          ),
        canActivate: [RouteGuard],
      },
      {
        path: 'quan-ly-chi-nhanh',
        loadChildren: () =>
          import('./pages/branch/branch.module').then((m) => m.BranchModule),
        canActivate: [RouteGuard],
      },
      {
        path: 'quan-ly-nha-cung-cap',
        loadChildren: () =>
          import('./pages/supplier/supplier.module').then(
            (m) => m.SupplierModule
          ),
        canActivate: [RouteGuard],
      },
      {
        path: 'he-thong',
        loadChildren: () =>
          import('@minhdu-fontend/system').then((m) => m.SystemModule),
        canActivate: [RouteGuard],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
