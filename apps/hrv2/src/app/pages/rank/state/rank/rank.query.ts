import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { RankState, RankStore } from './rank.store';

@Injectable({ providedIn: 'root' })
export class RankQuery extends QueryEntity<RankState> {
  constructor(protected store: RankStore) {
    super(store);
  }
}
