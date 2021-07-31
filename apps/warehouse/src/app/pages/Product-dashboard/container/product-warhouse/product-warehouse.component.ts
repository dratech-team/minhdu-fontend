import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllProduct } from '../../+state/product.selector';
import { ProductAction } from '../../+state/product.action';

@Component({
  templateUrl:'product-warehouse.component.html',
})
export class ProductWarehouseComponent implements OnInit{
  products$ = this.store.pipe(select(selectorAllProduct))
  constructor(
    private readonly store: Store
  ) {
  }
  ngOnInit() {
    document.getElementById('product')!.classList.add('btn-border')
    this.store.dispatch(ProductAction.loadInit({take:30, skip: 0}))
  }
  importProduct() {
  }
}
