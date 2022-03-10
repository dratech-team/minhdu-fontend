import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellLayoutComponent } from './container/sell-layout.component';
import { RouteGuard } from './route.guard';
import { TabEnum } from './state/app.entity';

const routes: Routes = [
  {
    path: 'auth/login',
    loadChildren: () =>
      import('@minhdu-fontend/auth').then((m) => m.AuthModule)
  },
  {
    path: '',
    component: SellLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: TabEnum.DASHBOARD,
        loadChildren: () =>
          import('./pages/statistical/statistical.module').then(
            (m) => m.StatisticalModule
          ),
        canActivate: [RouteGuard]
      },
      {
        path: TabEnum.CUSTOMER,
        loadChildren: () =>
          import('./pages/customer/customer.module').then(
            (m) => m.CustomerModule
          ),
        data: {
          title: 'Khách hàng'
        },
        canActivate: [RouteGuard]
      },
      {
        path: 'hang-hoa',
        loadChildren: () =>
          import('./pages/commodity/commodity.module').then(
            (m) => m.CommodityModule
          ),
        data: {
          title: 'Hàng hóa'
        },
        canActivate: [RouteGuard]
      },
      {
        path: TabEnum.ORDER,
        loadChildren: () =>
          import('./pages/order/order.module').then((m) => m.OrderModule),
        data: {
          title: 'Đơn hàng'
        },
        canActivate: [RouteGuard]
      },
      {
        path: TabEnum.ROUTE,
        loadChildren: () =>
          import('./pages/route/route.module').then((m) => m.RouteModule),
        canActivate: [RouteGuard]
      },
      {
        path: 'hoa-don',
        loadChildren: () =>
          import('./pages/bill/bill.module').then((m) => m.BillModule),
        canActivate: [RouteGuard]
      },
      {
        path: TabEnum.HISTORY,
        loadChildren: () =>
          import('@minhdu-fontend/system').then((m) => m.SystemModule),
        canActivate: [RouteGuard]
      },
      { path: '**', redirectTo: '' }
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
