import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseLayoutComponent } from './container/base/warehouse-layout.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@minhdu-fontend/auth').then((m) => m.AuthModule),
  },
  {
    path: 'trang-chu',
    component: WarehouseLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
    ],
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
