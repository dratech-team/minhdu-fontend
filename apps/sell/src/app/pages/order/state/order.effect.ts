import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { OrderHistoryService, OrderService } from '../service';
import { OrderActions } from './order.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConvertBoolean } from '@minhdu-fontend/enums';
import { OrderQuery } from './order.query';
import { OrderStore } from './order.store';
import { CommodityUniq } from '../../commodity/entities';
import { BaseOrderEntity, OrderEntity } from '../enitities';
import { AddOrderDto, UpdateOrderDto } from '../dto';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PaginationDto } from '@minhdu-fontend/constants';
import { chain, flattenDeep, uniq } from 'lodash';
import { RouteEntity } from '../../route/entities';
import { ResponsePaginateOrderEntity } from '../enitities/response-paginate-order.entity';
import { arrayAdd } from '@datorama/akita';
import { CustomerStore } from '../../customer/state';

@Injectable()
export class OrderEffect {
  convertBoolean = ConvertBoolean;

  constructor(
    private readonly message: NzMessageService,
    private readonly actions$: Actions,
    private readonly orderQuery: OrderQuery,
    private readonly orderStore: OrderStore,
    private readonly customerStore: CustomerStore,
    private readonly orderService: OrderService,
    private readonly orderHistoryService: OrderHistoryService
  ) {
  }

  @Effect({ dispatch: true })
  addOne$ = this.actions$.pipe(
    ofType(OrderActions.addOne),
    switchMap((props: AddOrderDto) => {
      return this.orderService.addOne(props).pipe(
        map((res) => {
          this.orderStore.add(this.mapToOrder(res));
          if (res.customerId) {
            this.customerStore.update(res.customerId, ({ delivering }) => ({
              delivering: arrayAdd(delivering, res)
            }));
          }
          return OrderActions.addOneSuccess(res);
        }),
        catchError((err) => {
          return of(OrderActions.error(err));
        })
      );
    })
  );

  @Effect({ dispatch: true })
  loadAll$ = this.actions$.pipe(
    ofType(OrderActions.loadAll),
    switchMap((props) => {
      const search = Object.assign(
        props.search,
        (props.search?.status === undefined || props.search?.status === null)
          ? { status: 0 }
          : {},
        { take: PaginationDto.take, skip: !props.isSet ? this.orderQuery.getCount() : 0 }
      );
      return this.orderService.pagination({ search: search }).pipe(
        map((res: ResponsePaginateOrderEntity) => {
          const data = res.data.map(order => this.mapToOrder(order));
          if (props.isSet) {
            this.orderStore.set(data);
          } else {
            this.orderStore.add(data);
          }
          return OrderActions.loadAllSuccess(res);
        }),
        catchError((error) => {
          return of(OrderActions.error(error));
        })
      );
    })
  );

  @Effect({ dispatch: true })
  loadOne$ = this.actions$.pipe(
    ofType(OrderActions.loadOne),
    switchMap((props) => {
        return this.orderService.getOne(props.id).pipe(
          map((order) => {
            this.orderStore.upsert(order.id, this.mapToOrder(order));
            return OrderActions.orderHistory({ orderId: order.id });
          }),
          catchError((err) => of(OrderActions.error(err)))
        );
      }
    )
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType(OrderActions.update),
    switchMap((props: UpdateOrderDto) => {
      return this.orderService.update(props.id, props.updates).pipe(
        tap((res) => {
          this.orderStore.update(res.id, this.mapToOrder(res));
        }),
        catchError((err) => {
          return of(OrderActions.error(err));
        })
      );
    })
  );

  @Effect({ dispatch: true })
  hide$ = this.actions$.pipe(
    ofType(OrderActions.hide),
    switchMap((props) =>
      this.orderService.hide(props.id, props.hide).pipe(
        map((res) => {
          this.orderStore.update(res.id, res);
        }),
        catchError((err) => of(OrderActions.error(err)))
      )
    )
  );

  @Effect()
  paymentBill$ = this.actions$.pipe(
    ofType(OrderActions.payment),
    switchMap((props) =>
      this.orderService.payment(props.id, props.order).pipe(
        map((_) => OrderActions.loadOne({ id: props.id })),
        catchError((err) => of(OrderActions.error(err)))
      )
    )
  );

  @Effect({ dispatch: true })
  remove$ = this.actions$.pipe(
    ofType(OrderActions.remove),
    switchMap((props) => {
      return this.orderService.delete(props.id).pipe(
        map((_) => {
          const res = this.orderQuery.getEntity(props.id);
          this.orderStore.remove(props.id);
          return res && OrderActions.removeOneSuccess(res);
        }),
        catchError((err) => of(OrderActions.error(err)))
      );
    })
  );

  @Effect({ dispatch: true })
  cancel$ = this.actions$.pipe(
    ofType(OrderActions.cancel),
    switchMap((props) =>
      this.orderService.cancel(props.id, { reason: props.reason }).pipe(
        map((res) => {
          const entity = this.orderQuery.getEntity(props.id);
          this.orderStore.remove(res.id);
          return entity && OrderActions.removeOneSuccess(entity);
        }),
        catchError((err) => of(OrderActions.error(err)))
      )
    )
  );

  @Effect({ dispatch: true })
  restore$ = this.actions$.pipe(
    ofType(OrderActions.restore),
    switchMap((props) => {
      return this.orderService.restore(props.id).pipe(
        tap((res) => {
          this.orderStore.update(res.id, { deliveredAt: null });
        }),
        catchError((err) => of(OrderActions.error(err)))
      );
    })
  );

  @Effect()
  historyOrder$ = this.actions$.pipe(
    ofType(OrderActions.orderHistory),
    switchMap((props) => {
        const count = this.orderQuery.getEntity(props.orderId)?.orderHistories?.length || 0;
        const params = Object.assign({}, props, { take: PaginationDto.take, skip: count });
        return this.orderHistoryService.pagination(params).pipe(tap((res) => {
            if (props?.loadMore) {
              this.orderStore.update(props.orderId, ({ orderHistories }) => ({
                orderHistories: arrayAdd(orderHistories, res.data)
              }));
            } else {
              this.orderStore.update(props.orderId, { orderHistories: res.data });
            }
          }),
          catchError((err) => of(OrderActions.error(err)))
        );
      }
    )
  );

  @Effect()
  requesting$ = this.actions$.pipe(
    ofType(
      OrderActions.addOne,
      OrderActions.loadOne,
      OrderActions.loadAll,
      OrderActions.update,
      OrderActions.remove,
      OrderActions.restore,
      OrderActions.cancel
    ),
    tap(() => {
      this.orderStore.update((state) => ({
        ...state,
        loading: true,
        error: null
      }));
    })
  );

  @Effect()
  addOneSuccess$ = this.actions$.pipe(
    ofType(OrderActions.addOneSuccess),
    tap((res) => {
      this.orderStore.update((state) => {
        const merge = state.commodityUniq.concat(res.commodities || []);
        const commodityUniq = flattenDeep(
          chain(merge)
            .groupBy('code')
            .map((value, key) => ({ code: key, commodities: value }))
            .value().map(value => value.commodities)
        );
        return {
          ...state,
          loading: false,
          error: null,
          total: state.total + 1,
          remain: (state.total + 1) - this.orderQuery.getCount(),
          commodityTotal: state.commodityTotal + res.commodities?.reduce((a, b) => a + b.amount, 0),
          commodityUniq: commodityUniq
        };
      });
    })
  );

  @Effect()
  loadAllSuccess$ = this.actions$.pipe(
    ofType(OrderActions.loadAllSuccess),
    tap((res) => {
      this.orderStore.update(state => ({
        ...state,
        loading: false,
        error: null,
        remain: res.total - this.orderQuery.getCount(),
        total: res.total,
        commodityTotal: res.commodityUniq.reduce(
          (x, y) => x + y.amount,
          0
        ),
        commodityUniq: res.commodityUniq
      }));
    })
  );

  @Effect()
  removeOneSuccess$ = this.actions$.pipe(
    ofType(OrderActions.removeOneSuccess),
    tap((res) => {
      this.orderStore.update((state) => {
        const commoditiesUniq = flattenDeep(
          chain(res.commodities)
            .groupBy('code')
            .map((value, key) => ({ code: key, commodities: value }))
            .value().map(value => value.commodities)
        );

        const commodityUniq = state.commodityUniq.reduce((commodities, commodity, i) => {
          if (
            commoditiesUniq.some(commodity => commodity.code === commodity.code) &&
            commodity.amount - (commoditiesUniq.find(e => e.code === commodity.code)?.amount || 0) !== 0
          ) {
            return commodities.concat({
              ...commodity,
              amount: commodity.amount - (commoditiesUniq.find(e => e.code === commodity.code)?.amount || 0)
            });
          }
          return commodities;
        }, [] as CommodityUniq[]);
        return {
          ...state,
          loading: false,
          error: null,
          commodityTotal: state.commodityTotal - res.commodities?.reduce((a, b) => a + b.amount, 0),
          total: state.total - 1,
          commodityUniq: commodityUniq
        };
      });
    })
  );

  @Effect()
  error$ = this.actions$.pipe(
    ofType(OrderActions.error),
    tap((res) => {
      this.orderStore.update((state) => ({
        ...state,
        loading: null,
        error: res.error
      }));
    })
  );

  private mapToOrder(order: BaseOrderEntity): OrderEntity {
    const expandedAll = this.orderQuery.getValue().expandedAll;
    const priceTotal = order.commodities.reduce((a, commodity) => {
      return a + ((commodity.amount * commodity.price) + ((commodity.more?.amount || 0) * (commodity?.more?.price || 0)));
    }, 0);

    const routeIds = uniq(order.commodities.map(commodity => commodity.routeId));
    const routes = routeIds.map(routeId => {
      const commodity = order.commodities.find(commodity => commodity.routeId === routeId);
      return commodity?.route as RouteEntity;
    }).filter(route => route) as RouteEntity[];
    return {
      ...order,
      expand: expandedAll,
      priceTotal: priceTotal,
      routes: routes,
      orderHistories: []
    };
  }
}
