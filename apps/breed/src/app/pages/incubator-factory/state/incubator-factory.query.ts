import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { IncubatorFactoryState, IncubatorFactoryStore } from './incubator-factory.store';

@Injectable({ providedIn: 'root' })
export class IncubatorFactoryQuery extends QueryEntity<IncubatorFactoryState> {
  constructor(protected store: IncubatorFactoryStore) {
    super(store);
  }
}
