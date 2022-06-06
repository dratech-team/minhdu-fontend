import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import {BaseSearchPositionDto} from "../dto";
import {PositionEntity} from "../entities/position.entity";
import { StorageName } from '@minhdu-fontend/constants';

export interface PositionState extends EntityState<PositionEntity> {
  loading?: boolean;
  total: number
  search: Partial<BaseSearchPositionDto>;
}

function createInitState(): PositionState {
  return {
    total: 0,
    search: {
      name: '',
      code: ''
    },
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.POSITION })
export class PositionStore extends EntityStore<PositionState> {
  constructor() {
    super(createInitState());
  }
}
