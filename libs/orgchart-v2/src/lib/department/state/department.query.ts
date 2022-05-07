import { QueryEntity } from '@datorama/akita';
import { DepartmentState, DepartmentStore } from './department.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DepartmentQuery extends QueryEntity<DepartmentState> {
  constructor(protected store: DepartmentStore) {
    super(store);
  }
}
