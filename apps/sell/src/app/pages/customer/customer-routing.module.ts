import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent, DetailCustomerComponent } from './container';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent
  },
  {
    path: 'chi-tiet-khach-hang/:id',
    component: DetailCustomerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {
}
