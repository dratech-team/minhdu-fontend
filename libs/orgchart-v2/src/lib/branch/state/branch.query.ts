import { Order, QueryConfig, QueryEntity } from '@datorama/akita';
import { BranchState, BranchStore } from './branch.store';
import { Injectable } from '@angular/core';
import { BranchEntity } from '../entities/branch.entity';

@Injectable({ providedIn: 'root' })
@QueryConfig({
  sortBy: (a: BranchEntity, b: BranchEntity) => a.name.localeCompare(b.name),
  sortByOrder: Order.ASC,
})
export class BranchQuery extends QueryEntity<BranchState> {
  constructor(protected store: BranchStore) {
    super(store);
  }
}
