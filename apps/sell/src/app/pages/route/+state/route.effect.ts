import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { RouteAction } from './route.action';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { RouteService } from '../service/route.service';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from 'libs/components/src/lib/snackBar/snack-bar.component';
import { OrderEntity } from '../../order/enitities/order.interface';
import { getTotalCommodity } from '../../../../../../../libs/utils/sell.ultil';
import { RouteStore } from './route.store';
import { RouteQuery } from './route.query';

@Injectable()
export class RouteEffect {
  constructor(
    private readonly action: Actions,
    private readonly routeQuery: RouteQuery,
    private readonly routeStore: RouteStore,
    private readonly routeService: RouteService,
    private readonly snackBar: MatSnackBar
  ) {
  }

  @Effect()
  addRoute$ = this.action.pipe(
    ofType(RouteAction.addOne),
    switchMap((props) => this.routeService.addOne(props)),
    tap((res) => this.routeStore.add(res)),
    catchError((err) => throwError(err))
  );

  @Effect()
  loadAll$ = this.action.pipe(
    ofType(RouteAction.loadAll),
    switchMap((props) => this.routeService.pagination(props)),
    map((responsePagination) => {
      if (responsePagination.data.length === 0) {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 2500,
          panelClass: ['background-snackbar'],
          data: { content: 'Đã lấy hết Tuyến đường' }
        });
      } else {
        responsePagination.data.map(route => {
          route.orders.map((order: OrderEntity) => {
            order.commodityTotal = getTotalCommodity(order.commodities);
          });
          route.totalCommodityUniq = route.orders.reduce((a, b) => a + b.totalCommodity, 0);
        });
        this.routeStore.add(responsePagination.data);
      }
    }),
    catchError((err) => throwError(err))
  );

  @Effect()
  getOne$ = this.action.pipe(
    ofType(RouteAction.loadOne),
    switchMap((props) => this.routeService.getOne(props.id)),
    map((route) => {
        route.orders.forEach(order => {
          order.totalCommodity = getTotalCommodity(order.commodities);
        });
        route.totalCommodityUniq = route.orders.reduce((a, b) => a + b.totalCommodity, 0);
        route.orders.map(val => val.expand = false);
        this.routeStore.upsert(route.id, route);
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  update$ = this.action.pipe(
    ofType(RouteAction.update),
    switchMap((props) => this.routeService.update(props.id, props.updates)),
    map((route) => {
      route.changes.orders?.forEach(order => {
        order.totalCommodity = getTotalCommodity(order.commodities);
      });
      route.changes.totalCommodityUniq = route.changes.orders?.reduce((a, b) => a + b.totalCommodity, 0);
      route.changes.orders?.map(val => val.expand = false);
      return this.routeStore.update(route.id, route);
    }),
    catchError((err) => throwError(err))
  );

  @Effect()
  delete$ = this.action.pipe(
    ofType(RouteAction.remove),
    switchMap((props) =>
      this.routeService.delete(props.idRoute).pipe(
        map((_) => this.routeStore.remove(props.idRoute)),
        catchError((err) => throwError(err))
      )
    )
  );
}
