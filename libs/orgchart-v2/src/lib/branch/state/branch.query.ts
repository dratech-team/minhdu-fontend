import { QueryEntity } from '@datorama/akita';
import { BranchState, BranchStore } from './branch.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BranchQuery extends QueryEntity<BranchState> {
  constructor(protected store: BranchStore) {
    super(store);
  }
}
