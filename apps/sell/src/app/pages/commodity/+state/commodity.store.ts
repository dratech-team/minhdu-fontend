import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Commodity } from '../entities/commodity.entity';
import { Injectable } from '@angular/core';

export interface CommodityState extends EntityState<Commodity> {
  readonly loading: boolean;
}

export const createInitialState = () => ({ loading: true });

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'commodity' })
export class CommodityStore extends EntityStore<CommodityState> {
  constructor() {
    super(createInitialState());
  }
}
