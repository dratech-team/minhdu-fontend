import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {CommodityEntity} from "../entities/commodity.entity";

export interface CommodityState extends EntityState<CommodityEntity> {
  loading: boolean;
  added: boolean
  readonly total: number;
}

export const createInitialState = () => ({loading: true, total: 0, added: false});

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'commodity'})
export class CommodityStore extends EntityStore<CommodityState> {
  constructor() {
    super(createInitialState());
  }
}
