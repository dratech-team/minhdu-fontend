import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {CommodityUniq} from '../../commodity/entities/commodity-uniq.entity';
import {OrderEntity} from '../enitities/order.interface';
import {StorageName} from '../../../shared/constaints/storage-name.const';
import {OrderVisibleEntity} from '../enitities/order-visible.entity';
import {OrderSearchEntity} from "../enitities/order-search.entity";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";

export interface OrderState extends EntityState<OrderEntity> {
  readonly added?: boolean | null
  readonly expandedAll?: boolean
  readonly total: number;
  readonly commodityUniq: CommodityUniq[];
  readonly totalCommodity: number;
  readonly ui?: OrderVisibleEntity;
  readonly search: OrderSearchEntity
}

function createInitState(): OrderState {
  return {
    loading: true,
    added: null,
    expandedAll: false,
    total: 0,
    commodityUniq: [],
    entities: undefined,
    ids: [],
    totalCommodity: 0,
    search: {
      search: '',
      paidType: '',
      customer: '',
      status: -1,
      explain: '',
      endedAt: {
        start: getFirstDayInMonth(new Date()),
        end: getLastDayInMonth(new Date())
      },
      createdAt: {
        start: getFirstDayInMonth(new Date()),
        end: getLastDayInMonth(new Date())
      },
      deliveredAt: {
        start: getFirstDayInMonth(new Date()),
        end: getLastDayInMonth(new Date())
      },
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
        ui: state.ui ? Object.assign(JSON.parse(JSON.stringify(state.ui)), type) : state.ui
      };
    });
  }
}
