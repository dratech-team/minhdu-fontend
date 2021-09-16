import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellLayoutComponent } from './container/sell-layout.component';

const routes: Routes = [
  {
    path: 'auth/login',
    loadChildren: () =>
      import('@minhdu-fontend/auth').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: SellLayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/statistical/statistical.module').then(
            (m) => m.StatisticalModule
          ),
      },
      {
        path: 'khach-hang',
        loadChildren: () =>
          import('./pages/customer/customer.module').then(
            (m) => m.CustomerModule
          ),
        data: {
          title: 'Khách hàng',
        },
      },
      {
        path: 'hang-hoa',
        loadChildren: () =>
          import('./pages/commodity/commodity.module').then(
            (m) => m.CommodityModule
          ),
        data: {
          title: 'Hàng hóa',
        },
      },
      {
        path: 'don-hang',
        loadChildren: () =>
          import('./pages/order/order.module').then((m) => m.OrderModule),
        data: {
          title: 'Đơn hàng',
        },
      },
      {
        path: 'tuyen-duong',
        loadChildren: () =>
          import('./pages/route/route.module').then((m) => m.RouteModule),
      },
      {
        path: 'hoa-don',
        loadChildren: () =>
          import('./pages/bill/bill.module').then((m) => m.BillModule),
      },
      { path: '**', redirectTo: '' },
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
