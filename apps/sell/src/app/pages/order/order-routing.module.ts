import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrderComponent } from './container/order/order.component';


const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
  }
]
@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {

}
