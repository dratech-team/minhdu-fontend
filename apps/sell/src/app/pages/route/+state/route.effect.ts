import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {RouteAction} from './route.action';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {RouteService} from '../service/route.service';
import {throwError} from 'rxjs';
import {OrderEntity} from '../../order/enitities/order.interface';
import {getCommodityTotal, getTotalCommodity} from '../../../../../../../libs/utils/sell.ultil';
import {RouteStore} from './route.store';
import {RouteQuery} from './route.query';
import {NzMessageService} from 'ng-zorro-antd/message';

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
        ...state,
        added: false,
        adding: true
      }));
      return this.routeService.addOne(props)
    }),
    tap((res) => {
        const expanedAll = this.routeQuery.getValue().expandedAll;
        const orders = this.handelOrder(res.orders);
        this.routeStore.update(state => ({
          ...state,
          added: true,
          adding: false
        }));
        this.routeStore.add(Object.assign(res, {orders, expand: expanedAll}));
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
        if (props.params.orderType) {
          props.params.orderType = props.params.orderType === 'ascend' ? 'asc' : 'des';
        }
        return this.routeService.pagination(Object.assign(
          props.params, (props.params?.status === null || props.params?.status === undefined) ? {status: 0} : {})
        ).pipe(
          map((response) => {
            const expanedAll = this.routeQuery.getValue().expandedAll;

            this.routeStore.update(state => ({
              ...state, loading: false,
              total: response.total
            }));
            if (response.data.length === 0) {
              this.message.success('Đã lấy hết tuyến đường');
            } else {
              const routes = response.data.map(route => {
                const orders = this.handelOrder(route.orders);
                return Object.assign(route, {
                  totalCommodityUniq: this.totalCommodityUniq(route.orders),
                  orders: orders,
                  expand: expanedAll
                });
              });
              if (props.isPagination) {
                this.routeStore.add(routes);
              } else {
                this.routeStore.set(routes);
              }
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
        this.routeStore.upsert(route.id, Object.assign(route, {
          totalCommodityUniq: this.totalCommodityUniq(route.orders),
          orders: this.handelOrder(route.orders)
        }));
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  update$ = this.action.pipe(
    ofType(RouteAction.update),
    switchMap((props) => {
      this.routeStore.update(state => ({
        ...state,
        added: false,
      }));
      return this.routeService.update(props.id, props.updates)
    }),
    map((route) => {
      const expanedAll = this.routeQuery.getValue().expandedAll;
      this.routeStore.update(state => ({
        ...state,
        added: true,
      }));
      this.message.success('Cập nhật thành công');
      return this.routeStore.update(route.id, Object.assign(route, {
        totalCommodityUniq: this.totalCommodityUniq(route.orders),
        orders: this.handelOrder(route.orders),
        expand: expanedAll
      }));
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
    switchMap((props) => this.routeService.cancel(props.id, props.cancelDTO)),
    map((route) => {
      this.message.success('Cập nhật đơn hàng thành công');
      return this.routeStore.update(route.id, Object.assign(route, {
        totalCommodityUniq: this.totalCommodityUniq(route.orders),
        orders: this.handelOrder(route.orders)
      }));
    }),
    catchError((err) => throwError(err))
  );

  private handelOrder(orders: OrderEntity []) {
    return orders.map(order => Object.assign(order, {
      commodityTotal: getCommodityTotal(order.commodities),
      totalCommodity: getTotalCommodity(order.commodities)
    }));
  }

  private totalCommodityUniq(orders: OrderEntity []): number {
    return orders.reduce((a, b) => a + b.totalCommodity, 0);
  }
}


