import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {Product} from '../entities/product.entity';

export interface ProductState extends EntityState<Product> {
  loading: boolean;
  added: boolean
}

export function createInitialState(): ProductState {
  return {
    loading: true,
    added: false
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'product'})
export class ProductStore extends EntityStore<ProductState> {
  constructor() {
    super(createInitialState());
  }
}
