import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllProduct } from '../../+state/product.selector';
import { ProductAction } from '../../+state/product.action';

@Component({
  selector:'app-product-dashboard',
  templateUrl:'product.component.html',
})
export class ProductComponent implements OnInit{
  products$ = this.store.pipe(select(selectorAllProduct))
  constructor(
    private readonly store: Store
  ) {
  }
  ngOnInit() {
    this.store.dispatch(ProductAction.loadInit({take:30, skip: 0}))
  }
  importProduct() {
  }
}
