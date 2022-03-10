import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseLayoutComponent } from './container/base/warehouse-layout.component';

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
        path: 'he-thong',
        loadChildren: () => import('@minhdu-fontend/system').then(m => m.SystemModule),
        data: {
          title: 'Lịch sử hệ thống'
        },
      },
    ]
  }
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
