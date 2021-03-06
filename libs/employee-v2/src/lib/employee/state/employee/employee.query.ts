import { Query, QueryEntity } from '@datorama/akita';
import { EmployeeState, EmployeeStore } from './employee.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EmployeeQuery extends QueryEntity<EmployeeState> {
  constructor(protected store: EmployeeStore) {
    super(store);
  }
}
