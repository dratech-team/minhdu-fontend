import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Product } from '../../../../pages/warehouse/state/entities/product.entity';
import { Injectable } from '@angular/core';

export interface ProductState extends EntityState<Product> {
  loading: boolean;
}

export function createInitialState(): ProductState {
  return {
    loading: true
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'product' })
export class ProductStore extends EntityStore<ProductState> {
  constructor() {
    super(createInitialState());
  }
}
