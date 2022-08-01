import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { BaseSearchBranchDto } from '../dto';
import { BranchEntity } from '../entities';
import { StorageName } from '@minhdu-fontend/constants';
import { BranchStatusEnum } from '../enums/branch-status.enum';

export interface BranchState extends EntityState<BranchEntity> {
  loading?: boolean;
  total: number;
  search: Partial<BaseSearchBranchDto>;
}

function createInitState(): BranchState {
  return {
    loading: true,
    total: 0,
    search: {
      name: '',
      code: '',
      status: BranchStatusEnum.ALL
    }
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.BRANCH })
export class BranchStore extends EntityStore<BranchState> {
  constructor() {
    super(createInitState());
  }
}
