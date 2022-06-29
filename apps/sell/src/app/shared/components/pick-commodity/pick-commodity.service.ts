import { Store } from '@ngrx/store';
import {
  CommodityAction,
  CommodityQuery,
} from '../../../pages/commodity/+state';
import { Injectable } from '@angular/core';
import { SearchCommodityDto } from '../../../pages/commodity/dto';

@Injectable({ providedIn: 'root' })
export class PickCommodityService {
  commodities$ = this.commodityQuery.selectAll();

  constructor(
    private readonly store: Store,
    private readonly commodityQuery: CommodityQuery
  ) {}

  loadInit() {
    return this.store.dispatch(
      CommodityAction.loadAll({ search: { take: 30, skip: 0 } })
    );
  }

  scrollCommodities(val: SearchCommodityDto['search']) {
    this.store.dispatch(
      CommodityAction.loadAll({ search: val, isPaginate: true })
    );
  }

  commodities() {
    return this.commodities$;
  }
}
