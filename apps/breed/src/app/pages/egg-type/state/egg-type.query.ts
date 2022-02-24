import { QueryEntity } from '@datorama/akita';
import { EggTypeState, EggTypeStore } from './egg-type.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EggTypeQuery extends QueryEntity<EggTypeState> {
  constructor(protected store: EggTypeStore) {
    super(store);
  }
}
