import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { SettingSalaryState, SettingSalaryStore } from './setting-salary.store';

@Injectable({ providedIn: 'root' })
export class SettingSalaryQuery extends QueryEntity<SettingSalaryState> {
  constructor(protected store: SettingSalaryStore) {
    super(store);
  }
}
