import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllRoute } from '../../../route/container/+state/Route.selector';
import { RouteAction } from '../../../route/container/+state/route.action';


@Injectable({providedIn: 'root'})
export class TableRouteService {
    routes$ = this.store.pipe(select(selectorAllRoute))
  constructor(
    private readonly store: Store,
  ) {
  }
  loadInit(orderId:number){
    return this.store.dispatch(RouteAction.loadInit({take:30, skip: 0 ,orderId: orderId }))
  }
  scrollRoutes(val: any){
    this.store.dispatch(RouteAction.loadMoreRoutes(val));
  }

  getCommodities() {
    return this.routes$
  }
}
