import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Consignment, ConsignmentStore } from './consignment.store';

@Injectable({ providedIn: 'root' })
export class ConsignmentQuery extends QueryEntity<Consignment> {
  constructor(protected store: ConsignmentStore) {
    super(store);
  }
}
