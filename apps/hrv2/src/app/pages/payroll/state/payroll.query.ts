import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {PayrollEntityState, PayrollStore} from "./payroll.store";

@Injectable({ providedIn: 'root' })
export class PayrollQuery extends QueryEntity<PayrollEntityState> {
  constructor(protected store: PayrollStore) {
    super(store);
  }
}
