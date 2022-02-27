import { select, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { selectorAllRoute } from '../../../pages/route/+state/route.selector';
import { RouteAction } from '../../../pages/route/+state/route.action';

@Injectable({providedIn:'root'})
export class PickRoutesService {
  Routes$ = this.store.pipe(select(selectorAllRoute))
  constructor(
    private readonly store: Store,
  ) {
  }
  loadInit(){
    return this.store.dispatch(RouteAction.loadInit({take:30, skip: 0}))
  }
  scrollRoutes(val: any){
    this.store.dispatch(RouteAction.loadMoreRoutes(val));
  }
  searchRoutes(val: any){
    this.store.dispatch(RouteAction.loadInit(val))
  }
  routes() {
    return this.Routes$
  }
}
