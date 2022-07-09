import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { RouteActions } from './route.Actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { RouteService } from '../service';
import { of } from 'rxjs';
import { getCommodityTotal, getTotalCommodity } from '../../../../../../../libs/utils/sell.ultil';
import { RouteStore } from './route.store';
import { RouteQuery } from './route.query';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderEntity } from '../../order/enitities/order.entity';
import { PaginationDto } from '@minhdu-fontend/constants';

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
  addOne$ = this.action.pipe(
    ofType(RouteActions.addOne),
    switchMap((props) => {
      this.routeStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.routeService.addOne(props).pipe(
        tap((res) => {
          this.message.success('Thêm tuyến đường thành công');
          const expandedAll = this.routeQuery.getValue().expandedAll;
          const orders = this.handelOrder(res.orders);
          this.routeStore.update((state) => ({
            ...state,
            loading: false,
            total: state.total + 1
          }));
          this.routeStore.add(
            Object.assign(res, { orders, expand: expandedAll })
          );
        }),
        catchError((err) => {
          this.routeStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(RouteActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadAll$ = this.action.pipe(
    ofType(RouteActions.loadAll),
    switchMap((props) => {
      this.routeStore.update((state) => ({
        ...state,
        loading: true
      }));
      if (props.search.orderType) {
        props.search.orderType =
          props.search.orderType === 'ascend' ? 'asc' : 'des';
      }
      return this.routeService.pagination(
        Object.assign(
          props.search,
          props.search?.status === null || props.search?.status === undefined
            ? { status: 0 }
            : {},
          {
            take: PaginationDto.take,
            skip: props.isPaginate ? this.routeQuery.getCount() : 0
          }
        )
      )
        .pipe(
          map((res) => {
            const expandedAll = this.routeQuery.getValue().expandedAll;

            this.routeStore.update((state) => ({
              ...state,
              loading: false,
              total: res.total
            }));
            if (res.data.length) {
              const routes = res.data.map((route) => {
                const orders = this.handelOrder(route.orders);
                return Object.assign(route, {
                  totalCommodityUniq: this.totalCommodityUniq(route.orders),
                  orders: orders,
                  expand: expandedAll
                });
              });
              if (props.isPaginate) {
                this.routeStore.add(routes);
              } else {
                this.routeStore.set(routes);
              }
              this.routeStore.update(state => ({
                ...state,
                remain: res.total - this.routeQuery.getCount()
              }));
            }
          }),
          catchError((err) => {
            this.routeStore.update((state) => ({
              ...state,
              loading: undefined
            }));
            return of(RouteActions.error(err));
          })
        );
    })
  );

  @Effect()
  loadOne$ = this.action.pipe(
    ofType(RouteActions.loadOne),
    switchMap((props) =>
      this.routeService.getOne(props.id).pipe(
        map((route) => {
          this.routeStore.upsert(
            route.id,
            Object.assign(route, {
              totalCommodityUniq: this.totalCommodityUniq(route.orders),
              orders: this.handelOrder(route.orders)
            })
          );
        }),
        catchError((err) => of(RouteActions.error(err)))
      )
    )
  );

  @Effect()
  update$ = this.action.pipe(
    ofType(RouteActions.update),
    switchMap((props) => {
      this.routeStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.routeService.update(props).pipe(
        map((route) => {
          const expanedAll = this.routeQuery.getValue().expandedAll;
          this.routeStore.update((state) => ({
            ...state,
            loading: false
          }));
          this.message.success('Cập nhật thành công');
          return this.routeStore.update(
            route.id,
            Object.assign(route, {
              totalCommodityUniq: this.totalCommodityUniq(route.orders),
              orders: this.handelOrder(route.orders),
              expand: expanedAll
            })
          );
        }),
        catchError((err) => {
          this.routeStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(RouteActions.error(err));
        })
      );
    })
  );

  @Effect()
  delete$ = this.action.pipe(
    ofType(RouteActions.remove),
    switchMap((props) => {
      this.routeStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.routeService.delete(props.idRoute).pipe(
        map((_) => {
          this.routeStore.update((state) => ({
            ...state,
            loading: false,
            total: state.total - 1
          }));
          this.message.success('Xoá tuyến đường thành công');
          return this.routeStore.remove(props.idRoute);
        }),
        catchError((err) => {
          this.routeStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(RouteActions.error(err));
        })
      );
    })
  );

  @Effect()
  cancelCommodity$ = this.action.pipe(
    ofType(RouteActions.cancel),
    switchMap((props) =>
      this.routeService.cancel(props.id, props.cancelDTO).pipe(
        map((route) => {
          this.message.success('Cập nhật đơn hàng thành công');
          return this.routeStore.update(
            route.id,
            Object.assign(route, {
              totalCommodityUniq: this.totalCommodityUniq(route.orders),
              orders: this.handelOrder(route.orders)
            })
          );
        }),
        catchError((err) => of(RouteActions.error(err)))
      )
    )
  );

  private handelOrder(orders: OrderEntity[]) {
    return orders.map((order) =>
      Object.assign(order, {
        commodityTotal: getCommodityTotal(order.commodities),
        totalCommodity: getTotalCommodity(order.commodities),
        expand: false
      })
    );
  }

  private totalCommodityUniq(orders: OrderEntity[]): number {
    return orders.reduce((a, b) => a + b.totalCommodity, 0);
  }
}
