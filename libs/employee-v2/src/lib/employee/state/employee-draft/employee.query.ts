import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { EmployeeStore } from '@minhdu-fontend/employee-v2';
import { EmployeeDraftState } from './employee.store';

@Injectable({ providedIn: 'root' })
export class EmployeeQuery extends QueryEntity<EmployeeDraftState> {
  constructor(protected store: EmployeeStore) {
    super(store);
  }
}
