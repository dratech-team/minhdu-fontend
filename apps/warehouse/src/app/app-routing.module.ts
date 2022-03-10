import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WarehouseLayoutComponent} from './container/base/warehouse-layout.component';

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
        data: {
          title: 'Hàng hoá'
        },
      },
      {
        path: 'xuat-nhap-kho',
        loadChildren: () => import('./pages/import-export/import-export.module').then(m => m.ImportExportModule),
        data: {
          title: 'Xuất nhập kho'
        },
      },
      {
        path: 'he-thong',
        loadChildren: () => import('@minhdu-fontend/system').then(m => m.SystemModule),
        data: {
          title: 'Lịch sử hệ thống'
        },
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
