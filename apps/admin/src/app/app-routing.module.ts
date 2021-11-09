import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminLayoutComponent } from './containers/layout-admin/admin-layout.component';
import { AppContainer } from './containers/app/app.container';

const routes: Routes = [
  {
    path: '',
    component: AppContainer
  },
  {
    path: 'auth/login',
    loadChildren: () => import('@minhdu-fontend/auth').then(m => m.AuthModule)
  },
  {
    path:'',
    component: AdminLayoutComponent ,
    children:[
      {
        path:'',
        loadChildren:() =>
          import('./pages/statistical-sell/statistical-sell.module').then(m => m.StatisticalSellModule)
      },
      {
        path:'kho',
        loadChildren:() =>
          import('./pages/statistical-warehosue/statistical-warehouse.module').then(m => m.StatisticalWarehouseModule)
      },
    ]
  }


];
@NgModule({
  imports:[RouterModule.forRoot(routes, { useHash: true, initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
