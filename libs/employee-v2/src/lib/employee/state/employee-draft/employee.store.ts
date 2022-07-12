import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { EmployeeEntity, EmployeeState } from '@minhdu-fontend/employee-v2';
import { Injectable } from '@angular/core';
import { StorageName } from '@minhdu-fontend/constants';

export interface EmployeeDraftState extends EntityState<EmployeeEntity> {}

export function createInitialState(): EmployeeDraftState {
  return {
    loading: false,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.EMPLOYEE_DRAFT, idKey: 'identify' })
export class EmployeeDraftStore extends EntityStore<EmployeeState> {
  constructor() {
    super(createInitialState());
  }
}
