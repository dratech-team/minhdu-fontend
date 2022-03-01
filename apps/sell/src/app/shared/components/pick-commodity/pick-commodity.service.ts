import { CommodityActions } from '../../../pages/commodity/+state/commodity.actions';
import { Injectable } from '@angular/core';
import { CommodityQuery } from '../../../pages/commodity/+state/commodity.query';
import { Actions } from '@datorama/akita-ng-effects';

@Injectable({ providedIn: 'root' })
export class PickCommodityService {
  commodities$ = this.commodityQuery.selectAll();

  constructor(
    private readonly actions$: Actions,
    private readonly commodityQuery: CommodityQuery
  ) {
  }

  loadInit() {
    return this.actions$.dispatch(CommodityActions.loadInit({ CommodityDTO: { take: 30, skip: 0 } }));
  }

  scrollCommodities(val: any) {
    this.actions$.dispatch(CommodityActions.loadMoreCommodity(val));
  }

  commodities() {
    return this.commodities$;
  }
}
