import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {RouteEntity} from '../entities/route.entity';
import {StorageName} from '../../../shared/constaints/storage-name.const';
import {SearchRouteEntity} from "../entities/search-route.entity";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";
import {routeVisibleEntity} from "../entities/route-visible.entity";
import {CustomerVisibleEntity} from "../../customer/entities/customer-visible.entity";
import {updateStateUiUtil} from "../../../utils/update-state-ui.util";

export interface RouteState extends EntityState<RouteEntity> {
  loading: boolean;
  added: boolean | null,
  total: number,
  expandedAll: boolean,
  search: SearchRouteEntity,
  readonly ui?: routeVisibleEntity;
}

export const createInitialState = () => ({
  loading: true,
  added: null,
  total: 0,
  expandedAll: false,
  search: {
    search: '',
    startedAt: {
      start: getFirstDayInMonth(new Date()),
      end: getLastDayInMonth(new Date())
    },
    endedAt: {
      start: getFirstDayInMonth(new Date()),
      end: getLastDayInMonth(new Date())
    },
    status: -1
  },
  ui: {
    stt: {
      pinned: true,
      visible: true
    },
    name: {
      pinned: false,
      visible: true
    },
    startedAt: {
      pinned: false,
      visible: true
    },
    endedAt: {
      pinned: false,
      visible: true
    },
    driver: {
      pinned: false,
      visible: true
    },
    customer: {
      pinned: false,
      visible: true
    },
    BSX: {
      pinned: false,
      visible: true
    },
    garage: {
      pinned: false,
      visible: true
    },
    status: {
      pinned: false,
      visible: true
    }
  }
});

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.ROUTE})
export class RouteStore extends EntityStore<RouteState> {
  constructor() {
    super(createInitialState());
  }

  updateUI(newState: Partial<routeVisibleEntity>, type: 'visible' | 'pinned') {
    return this.update(state => {
      return {
        ...state,
        ui: state.ui ? Object.assign(JSON.parse(JSON.stringify(state.ui)), updateStateUiUtil<routeVisibleEntity>(newState, type)) : state.ui
      };
    });
  }
}
