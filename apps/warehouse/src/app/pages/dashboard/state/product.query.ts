import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ProductState, ProductStore } from './product.store';

@Injectable({ providedIn: 'root' })
export class ProductQuery extends QueryEntity<ProductState> {
  constructor(protected store: ProductStore) {
    super(store);
  }
}
