import { QueryEntity } from '@datorama/akita';
import { PositionState, PositionStore } from './position.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PositionQuery extends QueryEntity<PositionState> {
  constructor(protected store: PositionStore) {
    super(store);
  }
}
