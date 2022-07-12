import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { SalaryEntity } from '../entities';

export interface SalaryState extends EntityState<SalaryEntity> {
  loading: boolean;
  added: boolean | null;
  total: number;
}

function createInitState(): SalaryState {
  return {
    loading: true,
    added: null,
    total: 0,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'salary' })
export class SalaryStore extends EntityStore<SalaryState> {
  constructor() {
    super(createInitState());
  }
}
