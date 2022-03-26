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
        loadChildren: () => import('./pages/product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'xuat-nhap-kho',
        loadChildren: () => import('./pages/import-export/import-export.module').then(m => m.ImportExportModule),
      },
      {
        path: 'quan-ly-chi-nhanh',
        loadChildren: () => import('./pages/branch/branch.module').then(m => m.BranchModule),
      },
      {
        path: 'quan-ly-nha-cung-cap',
        loadChildren: () => import('./pages/provider/provider.module').then(m => m.ProviderModule),
      },
      {
        path: 'he-thong',
        loadChildren: () => import('@minhdu-fontend/system').then(m => m.SystemModule),
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
