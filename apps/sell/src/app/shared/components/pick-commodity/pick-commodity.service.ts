import { select, Store } from '@ngrx/store';
import { CommodityAction } from '../../../pages/commodity/+state/commodity.action';
import { Injectable } from '@angular/core';
import { CommodityQuery } from '../../../pages/commodity/+state/commodity.query';

@Injectable({ providedIn: 'root' })
export class PickCommodityService {
  commodities$ = this.commodityQuery.selectAll();

  constructor(
    private readonly store: Store,
    private readonly commodityQuery: CommodityQuery
  ) {
  }

  loadInit() {
    return this.store.dispatch(CommodityAction.loadInit({ CommodityDTO: { take: 30, skip: 0 } }));
  }

  scrollCommodities(val: any) {
    this.store.dispatch(CommodityAction.loadMoreCommodity(val));
  }

  commodities() {
    return this.commodities$;
  }
}
