import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { StorageName } from '@minhdu-fontend/constants';
import { SystemHistoryEntity } from '../../entities/system-history.entity';

export interface SystemHistoryState extends EntityState<SystemHistoryEntity> {
  total: number;
  remain: number;
  loading?: boolean;
  search?: Partial<SystemHistoryEntity & { search: string }>;
}

function createInitState(): SystemHistoryState {
  return {
    total: 0,
    remain: 0,
    search: {},
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.SYSTEM_HISTORY })
export class SystemHistoryStore extends EntityStore<SystemHistoryState> {
  constructor() {
    super(createInitState());
  }
}
