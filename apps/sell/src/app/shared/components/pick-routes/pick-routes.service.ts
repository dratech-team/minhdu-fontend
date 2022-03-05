import { Injectable } from '@angular/core';
import { RouteAction } from '../../../pages/route/+state/route.action';
import { Actions } from '@datorama/akita-ng-effects';
import { RouteQuery } from '../../../pages/route/+state/route.query';

@Injectable({ providedIn: 'root' })
export class PickRoutesService {
  Routes$ = this.routeQuery.selectAll();

  constructor(
    private readonly actions$: Actions,
    private readonly routeQuery: RouteQuery
  ) {
  }

  loadInit() {
    return this.actions$.dispatch(RouteAction.loadInit({ take: 30, skip: 0 }));
  }

  scrollRoutes(val: any) {
    this.actions$.dispatch(RouteAction.loadMoreRoutes(val));
  }

  searchRoutes(val: any) {
    this.actions$.dispatch(RouteAction.loadInit(val));
  }

  routes() {
    return this.Routes$;
  }
}
