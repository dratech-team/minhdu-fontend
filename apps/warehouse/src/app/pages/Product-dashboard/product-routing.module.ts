import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductWarehouseComponent } from './container/product-warhouse/product-warehouse.component';

const routes: Routes = [
  {
    path: '',
    component:ProductWarehouseComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {
}
