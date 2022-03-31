import {Injectable} from '@angular/core';
import {RouteActions} from '../../../pages/route/+state/routeActions';
import {Actions} from '@datorama/akita-ng-effects';
import {RouteQuery} from '../../../pages/route/+state/route.query';

@Injectable({providedIn: 'root'})
export class PickRoutesService {
  Routes$ = this.routeQuery.selectAll();

  constructor(
    private readonly actions$: Actions,
    private readonly routeQuery: RouteQuery
  ) {
  }

  loadInit() {
    return this.actions$.dispatch(RouteActions.loadAll({params: {take: 30, skip: 0}}));
  }

  scrollRoutes(val: any) {
    const skip = this.routeQuery.getCount();
    return this.actions$.dispatch(RouteActions.loadAll({
      params: {take: 30, skip: this.routeQuery.getCount()},
      isPagination: true
    }));
  }

  searchRoutes(val: any) {
    this.actions$.dispatch(RouteActions.loadAll(val));
  }

  routes() {
    return this.Routes$;
  }
}
