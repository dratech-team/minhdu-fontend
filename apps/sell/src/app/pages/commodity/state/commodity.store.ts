import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { CommodityEntity } from '../entities';
import { StorageName } from '@minhdu-fontend/constants';

export interface CommodityState extends EntityState<CommodityEntity> {
  readonly total: number;
  readonly remain: number;
}

export const createInitialState = () => ({
  loading: false,
  total: 0,
  remain: 0
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.COMMODITY })
export class CommodityStore extends EntityStore<CommodityState> {
  constructor() {
    super(createInitialState());
  }
}
