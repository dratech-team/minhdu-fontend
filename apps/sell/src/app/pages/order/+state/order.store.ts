import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { CommodityUniq } from '../../commodity/entities/commodity-uniq.entity';
import { OrderEntity } from '../enitities/order.interface';
import { StorageName } from '../../../shared/constaints/storage-name.const';

export interface OrderState extends EntityState<OrderEntity> {
  loading: boolean;
  added: boolean
  readonly total: number;
  readonly commodityUniq: CommodityUniq[];
}

const createInitState = () => ({
  loading: true,
  added: false,
  total: 0,
  commodityUniq: []
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.ORDER })
export class OrderStore extends EntityStore<OrderState> {
  constructor() {
    super(createInitState());
  }
}
