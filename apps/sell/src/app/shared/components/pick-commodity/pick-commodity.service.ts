import {select, Store} from '@ngrx/store';
import {CommodityAction} from '../../../pages/commodity/+state/commodity.action';
import {Injectable} from '@angular/core';
import {CommodityQuery} from '../../../pages/commodity/+state/commodity.query';
import {SearchCommodityDto} from "../../../pages/commodity/dto/search-commodity.dto";

@Injectable({providedIn: 'root'})
export class PickCommodityService {
  commodities$ = this.commodityQuery.selectAll();

  constructor(
    private readonly store: Store,
    private readonly commodityQuery: CommodityQuery
  ) {
  }

  loadInit() {
    return this.store.dispatch(CommodityAction.loadAll({params: {take: 30, skip: 0}}));
  }

  scrollCommodities(val: SearchCommodityDto) {
    this.store.dispatch(CommodityAction.loadAll({params: val, isPagination: true}));
  }

  commodities() {
    return this.commodities$;
  }
}
