import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {RouteActions} from '../../../route/+state/route.Actions';
import {Actions} from '@datorama/akita-ng-effects';
import {RouteQuery} from '../../../route/+state/route.query';


@Injectable({providedIn: 'root'})
export class TableRouteService {
  routes$ = this.routeQuery.selectAll();

  constructor(
    private readonly actions$: Actions,
    private readonly routeQuery: RouteQuery,
  ) {
  }

  loadInit(orderId: number) {
    return this.actions$.dispatch(RouteActions.loadAll({params: {take: 30, skip: 0, orderId: orderId}}));
  }

  scrollRoutes(val: any) {
    this.actions$.dispatch(RouteActions.loadAll({params: val, isPagination: true},));
  }

  getCommodities() {
    return this.routes$;
  }
}
