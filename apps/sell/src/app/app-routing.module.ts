import { RouterModule, Routes } from '@angular/router';
import { SellLayoutComponent } from './container/sell-layout.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: SellLayoutComponent,
    data: {
      title: 'Home'
    },
    children:[
      {
        path: '',
        loadChildren: ()=> import('./pages/customer/customer.module').then(m => m.CustomerModule),
        data:{
          title: 'Khách hàng'
        }
      },
      {
        path: 'commodity',
        loadChildren: ()=> import('./pages/commodity/commodity.module').then(m => m.CommodityModule),
        data:{
          title: 'Hàng hóa'
        }
      },
      {
        path: 'order',
        loadChildren: ()=> import('./pages/order/order.module').then(m => m.OrderModule),
        data:{
          title: 'Đơn hàng'
        }
      },
      {
        path:'route',
        loadChildren:() => import('./pages/route/route.module').then(m => m.RouteModule)
      },
      {
        path:'bill',
        loadChildren:() => import('./pages/bill/bill.module').then(m => m.BillModule)
      },
      {
        path:'statistical',
        loadChildren:() => import('./pages/statistical/statistical.module').then(m => m.StatisticalModule)
      },

      { path: '**', redirectTo: '' }
    ]
  }
];
@NgModule({
  imports:[RouterModule.forRoot(routes, { useHash: true, initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
