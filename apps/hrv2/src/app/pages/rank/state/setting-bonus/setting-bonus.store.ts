import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { StorageName } from '@minhdu-fontend/constants';
import { SettingBonusEntity } from '../../entities/setting-bonus.entity';

export interface SettingBonusState extends EntityState<SettingBonusEntity> {
  loading: boolean;
  loadMore: boolean;
  added: boolean | null;
  total: number;
  search?: Partial<SettingBonusEntity>;
  deleted: boolean | null;
}

function createInitState(): SettingBonusState {
  return {
    loading: true,
    loadMore: false,
    added: null,
    total: 0,
    deleted: null,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.SETTING_BONUS })
export class SettingBonusStore extends EntityStore<SettingBonusState> {
  constructor() {
    super(createInitState());
  }
}
