import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {RouteActions} from './route.action';
import {catchError, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {RouteService} from '../service/route.service';
import {throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {getTotalCommodity} from "../../../../../../../libs/utils/sell.ultil";
import {RouteStore} from "./route.store";
import {Route} from "../entities/route.entity";
import {OrderEntity} from "../../order/entities/order.entity";

@Injectable()
export class RouteEffect {

  constructor(
    private readonly actions$: Actions,
    private readonly routeService: RouteService,
    private readonly snackbar: MatSnackBar,
    private readonly store: RouteStore
  ) {
  }

  @Effect()
  addRoute$ = this.actions$.pipe(
    ofType(RouteActions.addOne),
    switchMap((props) => this.routeService.addOne(props)),
    tap(route => {
      this.store.add(route);
      this.snackbar.open('Thêm tuyến đường thành công', '', {duration: 1500});
    }),
    catchError((err) => throwError(err))
  );

  @Effect()
  loadAllRoute$ = this.actions$.pipe(
    ofType(RouteActions.loadAll),
    switchMap((params) => this.routeService.pagination(params).pipe(
      map((response) => {
          response.data.map(route => {
            route.orders.map(order => {
              order.commodityTotal = getTotalCommodity(order.commodities);
            })

            route.totalCommodityUniq = route.orders.reduce((a, b) => a + b.totalCommodity, 0)

            Object.assign(route, {
              customers: route.orders.map((order: OrderEntity) => order.customer.lastName),
            })
          })
          if (params.skip && params.skip > 0) {
            return this.store.add(response.data)
          } else {
            return this.store.set(response.data)
          }
        }
      )
    )),
    catchError((err) => throwError(err))
  );

  @Effect()
  getCommodity$ = this.actions$.pipe(
    ofType(RouteActions.getOne),
    switchMap((props) => this.routeService.getOne(props.id)),
    tap((route) => {
        route.orders.forEach(order => {
          order.totalCommodity = getTotalCommodity(order.commodities)
        })
        route.totalCommodityUniq = route.orders.reduce((a, b) => a + b.totalCommodity, 0)
        return this.store.update(route.id, route)
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  updateRoute$ = this.actions$.pipe(
    ofType(RouteActions.update),
    switchMap((props) =>
      this.routeService.update(props.id, props.updates).pipe(
        tap((_) => RouteActions.getOne({id: props.id})),
        catchError((err) => throwError(err))
      )
    )
  );

  @Effect()
  deleteRoute$ = this.actions$.pipe(
    ofType(RouteActions.remove),
    switchMap((props) => this.routeService.delete(props.id)),
    map((route) => {
        this.snackbar.open('Xóa tuyến đường thành công', '', {duration: 1500});
        return this.store.remove((route as Route).id)
      }
    ),
    catchError((err) => throwError(err))
  );
}
