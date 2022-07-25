import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { CommodityEntity } from '../entities';
import { StorageName } from '@minhdu-fontend/constants';
import { VisibleEntity } from '@minhdu-fontend/data-models';

export interface CommodityState extends EntityState<CommodityEntity> {
  readonly total: number;
  readonly remain: number;
  readonly ui: VisibleEntity;
}

function createInitialState(): CommodityState {
  return {
    loading: false,
    total: 0,
    remain: 0,
    ui: { pinned: false, visible: false }
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.COMMODITY, resettable: true })
export class CommodityStore extends EntityStore<CommodityState> {
  constructor() {
    super(createInitialState());
  }
}
