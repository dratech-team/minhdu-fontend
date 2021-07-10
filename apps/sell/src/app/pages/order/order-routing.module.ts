import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrderComponent } from './container/order/order.component';
import { DetailOrderComponent } from './container/detail-order/detail-order.component';
import { AddOrderComponent } from './container/add-order.component/add-order.component';


const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
  },
  {
    path: 'detail-order',
    component: DetailOrderComponent,
  },
  {
    path: 'detail-order/add',
    component: AddOrderComponent,
  }
]
@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {

}
