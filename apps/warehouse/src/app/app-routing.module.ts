import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { WarehouseLayoutComponent } from './container/warehouse-layout.component';

const routes: Routes = [
  {
    path: '',
    component: WarehouseLayoutComponent,
    data: {
      title: 'Home'
    },
    children:[
      {
        path: '',
        loadChildren: () => import('./base-module/base.module').then(m => m.BaseModule),
      }
    ]
  }
];
@NgModule({
  imports:[RouterModule.forRoot(routes, { useHash: true, initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
