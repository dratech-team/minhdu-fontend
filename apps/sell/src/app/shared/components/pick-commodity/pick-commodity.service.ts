import {select, Store} from '@ngrx/store';
import {CommodityAction} from '../../../pages/commodity/+state/commodity.action';
import {Injectable} from '@angular/core';
import {CommodityQuery} from '../../../pages/commodity/+state/commodity.query';
import {CommodityDTO} from "../../../pages/commodity/dto/commodity.dto";

@Injectable({providedIn: 'root'})
export class PickCommodityService {
  commodities$ = this.commodityQuery.selectAll();

  constructor(
    private readonly store: Store,
    private readonly commodityQuery: CommodityQuery
  ) {
  }

  loadInit() {
    return this.store.dispatch(CommodityAction.loadAll({take: 30, skip: 0}));
  }

  scrollCommodities(val: CommodityDTO) {
    this.store.dispatch(CommodityAction.loadAll(val));
  }

  commodities() {
    return this.commodities$;
  }
}
