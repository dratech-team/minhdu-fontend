import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {CommodityUniq} from '../../commodity/entities/commodity-uniq.entity';
import {OrderEntity} from '../enitities/order.interface';
import {StorageName} from '../../../shared/constaints/storage-name.const';
import {OrderVisibleEntity} from '../enitities/order-visible.entity';

export interface OrderState extends EntityState<OrderEntity> {
  readonly loading: boolean;
  readonly added?: boolean
  readonly total?: number;
  readonly commodityUniq?: CommodityUniq[];
  readonly totalCommodity?: number;
  readonly ui?: OrderVisibleEntity;
}

function createInitState(): OrderState {
  return {
    loading: true,
    added: false,
    total: 0,
    commodityUniq: [],
    entities: undefined,
    ids: [],
    totalCommodity: 0,
    ui: {
      stt: {
        pinned: true,
        visible: true
      },
      customer: {
        pinned: true,
        visible: true
      },
      createdAt: {
        pinned: false,
        visible: true
      },
      explain: {
        pinned: false,
        visible: false
      },
      commodityTotal: {
        pinned: true,
        visible: true
      },
      paymentTotal: {
        pinned: false,
        visible: false
      },
      deliveredAt: {
        pinned: true,
        visible: true
      },
      commodities: {
        pinned: false,
        visible: true
      },
      currency: {
        pinned: false,
        visible: false
      },
      paidAt: {
        pinned: false,
        visible: false
      },
      payType: {
        pinned: false,
        visible: false
      },
      paidTotal: {
        pinned: false,
        visible: false
      },
      debt: {
        pinned: false,
        visible: false
      },
      destination: {
        pinned: false,
        visible: true
      },
      endedAt: {
        pinned: true,
        visible: true
      },
      totalCommodity: {
        pinned: false,
        visible: false
      },
      expand: {
        pinned: false,
        visible: false
      },
      paymentHistories: {
        pinned: false,
        visible: false
      },
      vans:{
        pinned: false,
        visible: false
      }
    }
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.ORDER})
export class OrderStore extends EntityStore<OrderState> {
  constructor() {
    super(createInitState());
  }

  updateUI(type: Partial<OrderVisibleEntity>) {
    return this.update(state => {
      return {
        ...state,
        ui: type
      };
    });
  }
}
