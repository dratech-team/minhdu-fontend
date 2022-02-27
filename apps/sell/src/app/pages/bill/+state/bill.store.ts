import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Bill } from './Bill.interface';
import { Injectable } from '@angular/core';

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
