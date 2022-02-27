import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {RouteAction} from './route.action';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {RouteService} from '../service/route.service';
import {throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {select, Store} from '@ngrx/store';
import {SnackBarComponent} from 'libs/components/src/lib/snackBar/snack-bar.component';
import {selectorRouteTotal} from "./route.selector";
import {Order} from "../../order/+state/order.interface";
import {getTotalCommodity} from "../../../../../../../libs/utils/sell.ultil";

@Injectable()
export class RouteEffect {
  addRoute$ = createEffect(() =>
    this.action.pipe(
      ofType(RouteAction.addRoute),
      switchMap((props) => this.routeService.addOne(props.route)),
      map(() => RouteAction.loadInit({take: 30, skip: 0})),
      catchError((err) => throwError(err))
    )
  );

  loadInit$ = createEffect(() =>
    this.action.pipe(
      ofType(RouteAction.loadInit),
      switchMap((props) => this.routeService.pagination(props)),
      map((responsePagination) => {
        responsePagination.data.map(route => {
          route.orders.map(order => {
            order.commodityTotal = getTotalCommodity(order.commodities);
          })
          Object.assign(route, {
            customers: route.orders.map((order: Order) => order.customer.lastName),
          })
        })
        return RouteAction.loadInitSuccess({
          routes: responsePagination.data
        });
      }),
      catchError((err) => throwError(err))
    )
  );

  loadMoreRoutes$ = createEffect(() =>
    this.action.pipe(
      ofType(RouteAction.loadMoreRoutes),
      withLatestFrom(this.store.pipe(select(selectorRouteTotal))),
      map(([props, skip]) =>
        Object.assign(JSON.parse(JSON.stringify(props)), {skip: skip})
      ),
      switchMap((props) => {
        return this.routeService.pagination(props);
      }),
      map((responsePagination) => {
        if (responsePagination.data.length === 0) {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 2500,
            panelClass: ['background-snackbar'],
            data: {content: 'Đã lấy hết Tuyến đường'},
          });
        }
        responsePagination.data.map(route => {
          route.orders.map(order => {
            order.commodityTotal = getTotalCommodity(order.commodities);
          })
          Object.assign(route, {
            customers: route.orders.map((order: Order) => order.customer.lastName),
          })
        })
        return RouteAction.loadMoreRoutesSuccess({
          routes: responsePagination.data,
        });
      }),
      catchError((err) => throwError(err))
    )
  );

  getRoute$ = createEffect(() =>
    this.action.pipe(
      ofType(RouteAction.getRoute),
      switchMap((props) => this.routeService.getOne(props.id)),
      map((route) => {
          route.orders.forEach(order => {
            order.totalCommodity = getTotalCommodity(order.commodities)
          })
          route.totalCommodityUniq = route.orders.reduce((a, b) => a + b.totalCommodity, 0)
          return RouteAction.getRouteSuccess({route: route})
        }
      ),
      catchError((err) => throwError(err))
    )
  );

  updateRoute$ = createEffect(() =>
    this.action.pipe(
      ofType(RouteAction.updateRoute),
      switchMap((props) =>
        this.routeService.update(props.id, props.route).pipe(
          map((_) => RouteAction.getRoute({id: props.id})),
          catchError((err) => throwError(err))
        )
      )
    )
  );

  deleteRoute$ = createEffect(() =>
    this.action.pipe(
      ofType(RouteAction.deleteRoute),
      switchMap((props) =>
        this.routeService.delete(props.idRoute).pipe(
          map((_) => RouteAction.loadInit({take: 30, skip: 0})),
          catchError((err) => throwError(err))
        )
      )
    )
  );

  constructor(
    private readonly action: Actions,
    private readonly routeService: RouteService,
    private readonly snackBar: MatSnackBar,
    private readonly store: Store
  ) {
  }
}
