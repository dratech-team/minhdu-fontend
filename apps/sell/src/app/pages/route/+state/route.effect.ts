import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { RouteAction } from './route.action';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { RouteService } from '../service/route.service';
import { throwError } from 'rxjs';
import { OrderEntity } from '../../order/enitities/order.interface';
import { getTotalCommodity } from '../../../../../../../libs/utils/sell.ultil';
import { RouteStore } from './route.store';
import { RouteQuery } from './route.query';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class RouteEffect {
  constructor(
    private readonly action: Actions,
    private readonly routeQuery: RouteQuery,
    private readonly routeStore: RouteStore,
    private readonly routeService: RouteService,
    private readonly message: NzMessageService
  ) {
  }

  @Effect()
  addRoute$ = this.action.pipe(
    ofType(RouteAction.addOne),
    switchMap((props) => {
        this.routeStore.update(state => ({
          ...state, added: false
        }));
        return this.routeService.addOne(props);
      }
    ),
    tap((res) => {
        this.routeStore.update(state => ({
          ...state, added: true
        }));
        this.routeStore.add(res);
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  loadAll$ = this.action.pipe(
    ofType(RouteAction.loadAll),
    switchMap((props) => {
        this.routeStore.update(state => ({
          ...state, loading: true
        }));
        return this.routeService.pagination(Object.assign(
          props.params, (props.params?.status === null || props.params?.status === undefined) ? { status: 0 } : {})
        ).pipe(
          map((responsePagination) => {
            this.routeStore.update(state => ({
              ...state, loading: false
            }));
            if (responsePagination.data.length === 0) {
              this.message.success('Đã lấy hết tuyến đường');
            } else {
              responsePagination.data.map(route => {
                route.orders.map((order: OrderEntity) => {
                  order.commodityTotal = getTotalCommodity(order.commodities);
                });
                route.totalCommodityUniq = route.orders.reduce((a, b) => a + b.totalCommodity, 0);
              });
            }
            if (props.isScroll) {
              this.routeStore.add(responsePagination.data);
            } else {
              this.routeStore.set(responsePagination.data);
            }
          })
        );
      }
    ),
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
    switchMap((props) => {
        this.routeStore.update(state => ({
          ...state, added: false
        }));
        return this.routeService.update(props.id, props.updates);
      }
    ),
    map((route) => {
      this.routeStore.update(state => ({
        ...state, added: true
      }));
      this.message.success('Cập nhật thành công');
      this.totalCommodity(route.orders);
      route.totalCommodityUniq = route.totalCommodityUniq = this.totalCommodityUniq(route.orders);
      route.orders?.map(val => val.expand = false);
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

  @Effect()
  cancelCommodity$ = this.action.pipe(
    ofType(RouteAction.cancel),
    switchMap((props) =>
      this.routeService.cancel(props.id, props.cancelDTO)),
    map((route) => {
      this.totalCommodity(route.orders);
      route.totalCommodityUniq = this.totalCommodityUniq(route.orders);
      route.orders?.map(val => val.expand = false);
      this.message.success('Cập nhật đơn hàng thành công');
      return this.routeStore.update(route.id, route);
    }),
    catchError((err) => throwError(err))
  );

  totalCommodity(orders: OrderEntity []) {
    orders.forEach(order => {
      order.totalCommodity = getTotalCommodity(order.commodities);
    });
  }

  totalCommodityUniq(orders: OrderEntity []): number {
    return orders?.reduce((a, b) => a + b.totalCommodity, 0);
  }

}


