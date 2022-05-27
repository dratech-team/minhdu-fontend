import { Injectable } from '@angular/core';
import {Order, QueryConfig, QueryEntity} from '@datorama/akita';
import { SettingSalaryState, SettingSalaryStore } from './setting-salary.store';

@Injectable({ providedIn: 'root' })
export class SettingSalaryQuery extends QueryEntity<SettingSalaryState> {
  constructor(protected store: SettingSalaryStore) {
    super(store);
  }
}
