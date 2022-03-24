import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {RouteEntity} from '../entities/route.entity';
import {StorageName} from '../../../shared/constaints/storage-name.const';
import {SearchRouteEntity} from "../entities/search-route.entity";
import {RangeDay} from "@minhdu-fontend/data-models";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";

export interface RouteState extends EntityState<RouteEntity> {
  loading: boolean;
  added: boolean | null,
  total: number,
  expandedAll: boolean,
  search: SearchRouteEntity
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
  }
});

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.ROUTE})
export class RouteStore extends EntityStore<RouteState> {
  constructor() {
    super(createInitialState());
  }
}
