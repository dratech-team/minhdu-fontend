import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { SystemHistoryState, SystemHistoryStore } from './system-history.store';

@Injectable({ providedIn: 'root' })
export class SystemHistoryQuery extends QueryEntity<SystemHistoryState> {
  constructor(protected store: SystemHistoryStore) {
    super(store);
  }
}
