import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {StorageName} from '@minhdu-fontend/constants';
import {RankEntity} from "../../entities/rank.entity";

export interface RankState extends EntityState<RankEntity> {
  total: number
  remain: number
  loading: boolean;
  loadMore: boolean;
  added: boolean | null;
  search?: Partial<RankEntity>;
  deleted: boolean | null
}

function createInitState(): RankState {
  return {
    total: 0,
    remain: 0,
    loading: true,
    loadMore: false,
    added: null,
    deleted: null
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.RANK})
export class RankStore extends EntityStore<RankState> {
  constructor() {
    super(createInitState());
  }
}
