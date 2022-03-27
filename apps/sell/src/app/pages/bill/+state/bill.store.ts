import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Bill } from '../entities';
import { StorageName } from '../../../shared/constaints/storage-name.const';

export interface BillState extends EntityState<Bill> {
  readonly loading: boolean;
}

export const createInitialState = () => ({ loading: true });

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.BILL })
export class BillStore extends EntityStore<BillState> {
  constructor() {
    super(createInitialState());
  }
}
