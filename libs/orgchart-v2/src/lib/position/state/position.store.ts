import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import {BaseSearchPositionDto} from "../dto";
import {StorageName} from "../../constants";
import {PositionEntity} from "../entities/position.entity";

export interface PositionState extends EntityState<PositionEntity> {
  loading: boolean;
  added: boolean | null;
  total: number
  search: Partial<BaseSearchPositionDto>;
}

function createInitState(): PositionState {
  return {
    loading: true,
    added: null,
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
