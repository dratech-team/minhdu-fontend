import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {Product} from '../entities/product.entity';
import {ProviderEntity} from "../../provider/entities/search-provider.entity";

export interface ProductState extends EntityState<Product> {
  loading: boolean;
  added: boolean;
  search:ProviderEntity;
}

export function createInitialState(): ProductState {
  return {
    loading: true,
    added: false,
    search:{
      search: '',
      inventoryType: -1,
      warehouseType: -1
    }
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'product'})
export class ProductStore extends EntityStore<ProductState> {
  constructor() {
    super(createInitialState());
  }
}
