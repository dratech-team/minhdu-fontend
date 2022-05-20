import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrderComponent } from './container';
import { DetailOrderComponent } from './container';
import { AddOrderComponent } from './container';
import { PaymentHistoryComponent } from './container';


const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
  },
  {
    path: 'them-don-hang',
    component: AddOrderComponent,
  },
  {
    path: 'chi-tiet-don-hang/:id',
    component: DetailOrderComponent,
  },
  {
    path: 'lich-su-thanh-toan',
    component: PaymentHistoryComponent,
  },
]
@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {

}
