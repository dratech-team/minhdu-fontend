import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { StorageName } from '@minhdu-fontend/constants';

export interface OrderHistoryState {
   key: string;
}

export function createInitialState(): OrderHistoryState {
  return {
    key: ''
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.ORDER_HISTORY })
export class OrderHistoryStore extends Store<OrderHistoryState> {

  constructor() {
    super(createInitialState());
  }

}
