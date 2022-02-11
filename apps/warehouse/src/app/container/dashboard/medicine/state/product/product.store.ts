import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Product } from '../warehouse/entities/product.entity';
import { Injectable } from '@angular/core';

export interface ProductState extends EntityState<Product> {
  loading: boolean;
  warehouseIdSelected: number | null;
}

export function createInitialState(): ProductState {
  return {
    loading: true,
    warehouseIdSelected: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'product' })
export class ProductStore extends EntityStore<ProductState> {
  constructor() {
    super(createInitialState());
  }
}
