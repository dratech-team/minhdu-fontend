import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { BillEntity } from '../entities';
import { StorageName } from '@minhdu-fontend/constants';

export interface BillState extends EntityState<BillEntity> {
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
