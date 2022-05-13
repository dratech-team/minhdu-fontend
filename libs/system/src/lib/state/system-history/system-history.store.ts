import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {StorageName} from '@minhdu-fontend/constants';
import {SystemHistoryEntity} from "../../entities/system-history.entity";
import {BaseSearchSystemHistoryDto} from "../../dto/system-history/search-system-history.dto";

export interface SystemHistoryState extends EntityState<SystemHistoryEntity> {
  loading: boolean;
  loadMore: boolean
  added: boolean | null;
  total: number
  search?: Partial<BaseSearchSystemHistoryDto>;
  deleted: boolean | null
}

function createInitState(): SystemHistoryState {
  return {
    loading: true,
    loadMore: false,
    added: null,
    total: 0,
    deleted: null
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.SYSTEM_HISTORY})
export class SystemHistoryStore extends EntityStore<SystemHistoryState> {
  constructor() {
    super(createInitState());
  }
}
