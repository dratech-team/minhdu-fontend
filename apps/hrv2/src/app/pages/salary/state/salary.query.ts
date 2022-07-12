import { QueryEntity } from '@datorama/akita';
import { SalaryState, SalaryStore } from './salary.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SalaryQuery extends QueryEntity<SalaryState> {
  constructor(protected store: SalaryStore) {
    super(store);
  }
}
