import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Bill } from '../entities/bill.entity';

export interface BillState extends EntityState<Bill> {
  readonly loading: boolean;
}

export const createInitialState = () => ({ loading: true });

@Injectable({providedIn: "root"})
@StoreConfig({ name: 'bill' })
export class BillStore extends EntityStore<BillState> {
  constructor() {
    super(createInitialState());
  }
}
