import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ConsignmentState, ConsignmentStore } from './consignment.store';

@Injectable({ providedIn: 'root' })
export class ConsignmentQuery extends QueryEntity<ConsignmentState> {
  constructor(protected store: ConsignmentStore) {
    super(store);
  }
}
