import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { CommodityUniq } from '../../commodity/entities';
import { OrderEntity, OrderVisibleEntity } from '../enitities';
import { BaseSearchOrderDto } from '../dto';
import { getFirstDayInMonth, getLastDayInMonth, updateStateUiUtil } from '@minhdu-fontend/utils';
import { StorageName } from '@minhdu-fontend/constants';
import { OrderStatusEnum } from '../enums';

export interface OrderState extends EntityState<OrderEntity> {
  readonly expandedAll: boolean;
  readonly total: number;
  readonly remain: number;
  readonly commodityUniq: CommodityUniq[];
  readonly commodityTotal: number;
  readonly ui: OrderVisibleEntity;
  readonly search: BaseSearchOrderDto;
}

function createInitState(): OrderState {
  return {
    expandedAll: false,
    total: 0,
    remain: 0,
    commodityUniq: [],
    commodityTotal: 0,
    search: {
      search: '',
      paidType: '',
      customer: '',
      status: OrderStatusEnum.ALL,
      explain: '',
      startedAt_start: getFirstDayInMonth(new Date()),
      startedAt_end: getLastDayInMonth(new Date()),
      deliveredAt_start: getFirstDayInMonth(new Date()),
      deliveredAt_end: getLastDayInMonth(new Date()),
      province: '',
      bsx: '',
      commodity: ''
    },
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
        pinned: false,
        visible: true
      },
      paymentTotal: {
        pinned: false,
        visible: true
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
        visible: true
      },
      expand: {
        pinned: false,
        visible: true
      },
      paymentHistories: {
        pinned: false,
        visible: false
      },
      vans: {
        pinned: false,
        visible: true
      },
      status: {
        pinned: false,
        visible: true
      }
    }
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.ORDER, resettable: true })
export class OrderStore extends EntityStore<OrderState> {
  constructor() {
    super(createInitState());
  }

  updateUI(newState: Partial<OrderVisibleEntity>, type: 'visible' | 'pinned') {
    return this.update((state) => {
      return {
        ...state,
        ui: state.ui
          ? Object.assign(
            JSON.parse(JSON.stringify(state.ui)),
            updateStateUiUtil<OrderVisibleEntity>(newState, type)
          )
          : state.ui
      };
    });
  }
}
