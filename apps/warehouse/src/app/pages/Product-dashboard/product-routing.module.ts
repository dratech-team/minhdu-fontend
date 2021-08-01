import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductWarehouseComponent } from './container/product-warhouse/product-warehouse.component';
import { DetailProductComponent } from '../../components/product/detail-product/detail-product.component';

const routes: Routes = [
  {
    path: '',
    component:ProductWarehouseComponent
  },
  {
    path: 'chi-tiet-trung',
    component:DetailProductComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {
}
