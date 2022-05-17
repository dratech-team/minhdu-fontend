import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {StorageName} from '@minhdu-fontend/constants';
import {RankEntity} from "../../entities/rank.entity";

export interface RankState extends EntityState<RankEntity> {
  loading: boolean;
  loadMore: boolean;
  added: boolean | null;
  total: number
  search?: Partial<RankEntity>;
  deleted: boolean | null
}

function createInitState(): RankState {
  return {
    loading: true,
    loadMore: false,
    added: null,
    total: 0,
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
