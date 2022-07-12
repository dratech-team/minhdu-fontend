import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { SettingRankState, SettingRankStore } from './setting-rank.store';

@Injectable({ providedIn: 'root' })
export class SettingRankQuery extends QueryEntity<SettingRankState> {
  constructor(protected store: SettingRankStore) {
    super(store);
  }
}
