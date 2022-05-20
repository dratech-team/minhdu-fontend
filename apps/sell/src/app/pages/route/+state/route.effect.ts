import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {RouteActions} from './routeActions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {RouteService} from '../service';
import {of} from 'rxjs';
import {getCommodityTotal, getTotalCommodity} from '../../../../../../../libs/utils/sell.ultil';
import {RouteStore} from './route.store';
import {RouteQuery} from './route.query';
import {NzMessageService} from 'ng-zorro-antd/message';
import {OrderEntity} from "../../order/enitities/order.entity";

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
    ofType(RouteActions.addOne),
    switchMap((props) => {
      this.routeStore.update(state => ({
        ...state,
        added: false
      }));
      return this.routeService.addOne(props).pipe(
        tap((res) => {
            this.message.success('Thêm tuyến đường thành công')
            const expanedAll = this.routeQuery.getValue().expandedAll;
            const orders = this.handelOrder(res.orders);
            this.routeStore.update(state => ({
              ...state,
              added: true,
              total: state.total + 1
            }));
            this.routeStore.add(Object.assign(res, {orders, expand: expanedAll}));
          }
        ),
        catchError((err) => {
          this.routeStore.update(state => ({
            ...state,
            added: null,
          }));
          return of(RouteActions.error(err))
        })
      )
    }),
  );

  @Effect()
  loadAll$ = this.action.pipe(
    ofType(RouteActions.loadAll),
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
          }),
          catchError((err) => {
            this.routeStore.update(state => ({
              ...state, loading: false,
            }));
            return of(RouteActions.error(err))
          })
        );
      }
    )
  );

  @Effect()
  getOne$ = this.action.pipe(
    ofType(RouteActions.loadOne),
    switchMap((props) => this.routeService.getOne(props.id).pipe(
      map((route) => {
          this.routeStore.upsert(route.id, Object.assign(route, {
            totalCommodityUniq: this.totalCommodityUniq(route.orders),
            orders: this.handelOrder(route.orders)
          }));
        }
      ),
      catchError((err) => of(RouteActions.error(err)))
    )),
  );

  @Effect()
  update$ = this.action.pipe(
    ofType(RouteActions.update),
    switchMap((props) => {
      this.routeStore.update(state => ({
        ...state,
        added: false,
      }));
      return this.routeService.update(props).pipe(
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
        catchError((err) => {
          this.routeStore.update(state => ({
            ...state,
            added: null,
          }));
          return of(RouteActions.error(err))
        })
      )
    })
  );

  @Effect()
  delete$ = this.action.pipe(
    ofType(RouteActions.remove),
    switchMap((props) => {
        this.routeStore.update(state => ({
          ...state, deleted: false
        }))
        return this.routeService.delete(props.idRoute).pipe(
          map((_) => {
            this.routeStore.update(state => ({
              ...state, deleted: true, total: state.total - 1
            }))
            this.message.success('Xoá tuyến đường thành công')
            return this.routeStore.remove(props.idRoute)
          }),
          catchError((err) => {
            this.routeStore.update(state => ({
              ...state, deleted: null
            }))
            return of(RouteActions.error(err))
          })
        )
      }
    )
  );

  @Effect()
  cancelCommodity$ = this.action.pipe(
    ofType(RouteActions.cancel),
    switchMap((props) => this.routeService.cancel(props.id, props.cancelDTO).pipe(
      map((route) => {
        this.message.success('Cập nhật đơn hàng thành công');
        return this.routeStore.update(route.id, Object.assign(route, {
          totalCommodityUniq: this.totalCommodityUniq(route.orders),
          orders: this.handelOrder(route.orders)
        }));
      }),
      catchError((err) => of(RouteActions.error(err)))
    )),
  );

  private handelOrder(orders: OrderEntity []) {
    return orders.map(order => Object.assign(order, {
      commodityTotal: getCommodityTotal(order.commodities),
      totalCommodity: getTotalCommodity(order.commodities),
      expand: false
    }));
  }

  private totalCommodityUniq(orders: OrderEntity []): number {
    return orders.reduce((a, b) => a + b.totalCommodity, 0);
  }
}


