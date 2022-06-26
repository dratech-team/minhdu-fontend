import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellLayoutComponent } from './container/sell-layout.component';
import { RouteGuard } from './route.guard';
import { HrefEnum } from './enums/href.enum';

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
        path: HrefEnum.DASHBOARD,
        loadChildren: () =>
          import('./pages/statistical/statistical.module').then(
            (m) => m.StatisticalModule
          ),
        canActivate: [RouteGuard],
      },
      {
        path: HrefEnum.CUSTOMER,
        loadChildren: () =>
          import('./pages/customer/customer.module').then(
            (m) => m.CustomerModule
          ),
        data: {
          title: 'Khách hàng',
        },
        canActivate: [RouteGuard],
      },
      /**
       * @deprecated
       * hàng hoá không cần page riêng để hiển thiị
       * */
      {
        path: 'hang-hoa',
        loadChildren: () =>
          import('./pages/commodity/commodity.module').then(
            (m) => m.CommodityModule
          ),
        data: {
          title: 'Hàng hóa',
        },
        canActivate: [RouteGuard],
      },
      {
        path: HrefEnum.ORDER,
        loadChildren: () =>
          import('./pages/order/order.module').then((m) => m.OrderModule),
        data: {
          title: 'Đơn hàng',
        },
        canActivate: [RouteGuard],
      },
      {
        path: HrefEnum.ROUTE,
        loadChildren: () =>
          import('./pages/route/route.module').then((m) => m.RouteModule),
        canActivate: [RouteGuard],
      },

      /**
       * @deprecated
       * không sử dụng nữa vì ko có quản lý hoá đơn
       * */
      {
        path: 'bill',
        loadChildren: () =>
          import('./pages/bill/bill.module').then((m) => m.BillModule),
        canActivate: [RouteGuard],
      },
      {
        path: HrefEnum.COMMODITY_TEMPLATE,
        loadChildren: () =>
          import('./pages/commodity-template/commodity-template.module').then(
            (m) => m.CommodityTemplateModule
          ),
        canActivate: [RouteGuard],
      },
      {
        path: HrefEnum.SYSTEM,
        loadChildren: () =>
          import('@minhdu-fontend/system').then((m) => m.SystemModule),
        canActivate: [RouteGuard],
      },
      { path: '**', redirectTo: '' },
    ],
  },
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
