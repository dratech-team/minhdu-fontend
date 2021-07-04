import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './container/customer.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
  }
]
@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class CustomerRoutingModule{

}
