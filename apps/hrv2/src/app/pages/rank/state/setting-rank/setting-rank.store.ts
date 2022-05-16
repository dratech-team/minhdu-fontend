import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {StorageName} from '@minhdu-fontend/constants';
import {SettingRankEntity} from "../../entities/setting-rank.entity";

export interface SettingRankState extends EntityState<SettingRankEntity> {
  loading: boolean;
  loadMore: boolean;
  added: boolean | null;
  total: number
  search?: Partial<SettingRankEntity>;
  deleted: boolean | null
}

function createInitState(): SettingRankState {
  return {
    loading: true,
    loadMore: false,
    added: null,
    total: 0,
    deleted: null
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.SETTING_RANK})
export class SettingRankStore extends EntityStore<SettingRankState> {
  constructor() {
    super(createInitState());
  }
}
