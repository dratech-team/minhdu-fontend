import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import {ContractState, ContractStore} from "./contract.store";

@Injectable({ providedIn: 'root' })
export class ContractQuery extends QueryEntity<ContractState> {
  constructor(protected store: ContractStore) {
    super(store);
  }
}
