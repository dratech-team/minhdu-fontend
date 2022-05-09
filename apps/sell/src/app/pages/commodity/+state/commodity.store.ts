import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { CommodityEntity } from '../entities';
import {StorageName} from "@minhdu-fontend/constants";

export interface CommodityState extends EntityState<CommodityEntity> {
  loading: boolean;
  added: boolean | null,
  readonly total: number;
}

export const createInitialState = () => ({ loading: true, total: 0, added: null });

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.COMMODITY })
export class CommodityStore extends EntityStore<CommodityState> {
  constructor() {
    super(createInitialState());
  }
}
