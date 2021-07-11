import { select, Store } from '@ngrx/store';
import { CommodityAction } from '../../container/+state/commodity.action';
import { selectAllCommodity } from '../../container/+state/commodity.selector';
import { Injectable } from '@angular/core';

@Injectable({providedIn:'root'})
export class PickCommodityService {
  commodities$ = this.store.pipe(select(selectAllCommodity))
  constructor(
    private readonly store: Store,
  ) {
  }
  loadInit(){
    return this.store.dispatch(CommodityAction.loadInit({take:30, skip: 0}))
  }
  scrollCommodities(val: any){
    this.store.dispatch(CommodityAction.loadMoreCommodity(val));
  }
  searchCommodities(val: any){
    this.store.dispatch(CommodityAction.loadInit(val))
  }
  commodities() {
    return this.commodities$
  }
}
