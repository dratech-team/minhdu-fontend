import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './container/customer/customer.component';
import { NgModule } from '@angular/core';
import { DetailCustomerComponent } from './container/detail-customer/detail-customer.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
  },
  {
    path: 'detail-customer/:id',
    component: DetailCustomerComponent,
  }
]
@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class CustomerRoutingModule{

}
