import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { RouteActions } from './route.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { RouteService } from '../service';
import { of } from 'rxjs';
import { getTotalPriceOfCommodity, getTotalCommodity } from '../../../../../../../libs/utils/sell.ultil';
import { RouteStore } from './route.store';
import { RouteQuery } from './route.query';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PaginationDto } from '@minhdu-fontend/constants';
import { RouteEntity } from '../entities';

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
          this.routeStore.update((state) => ({
            ...state,
            loading: false,
            total: state.total + 1,
            error: null
          }));
          this.routeStore.add(this.mapToRoute(res));
        }),
        catchError((err) => {
          this.routeStore.update((state) => ({
            ...state,
            loading: undefined,
            error: err
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
      const search = Object.assign(
        {},
        props.search,
        props.search?.status === null || props.search?.status === undefined
          ? { status: 0 }
          : {},
        {
          take: PaginationDto.take,
          skip: props.isPaginate ? this.routeQuery.getCount() : 0
        }
      );
      return this.routeService.pagination(search).pipe(
        map((res) => {
          if (res.data.length) {
            const routes = res.data.map((route) => {
              return this.mapToRoute(route);
            });
            if (props.isPaginate) {
              this.routeStore.add(routes);
            } else {
              this.routeStore.set(routes);
            }
            this.routeStore.update(state => ({
              ...state,
              remain: res.total - this.routeQuery.getCount(),
              loading: false,
              total: res.total,
              error: null
            }));
          }
        }),
        catchError((err) => {
          this.routeStore.update((state) => ({
            ...state,
            loading: undefined,
            error: err
          }));
          return of(RouteActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadOne$ = this.action.pipe(
    ofType(RouteActions.loadOne),
    switchMap((props) => {
        this.routeStore.update((state) => ({
          ...state,
          loading: true
        }));
        return this.routeService.getOne(props.id).pipe(
          map((route) => {
            this.routeStore.upsert(route.id, this.mapToRoute(route));
            this.routeStore.update((state) => ({
              ...state,
              loading: false,
              error: null
            }));
          }),
          catchError((err) => of(RouteActions.error(err)))
        );
      }
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
        tap((route) => {
          this.message.success('Cập nhật thành công');
          this.routeStore.update(route.id, this.mapToRoute(route));
          this.routeStore.update((state) => ({
            ...state,
            loading: false,
            error: null
          }));
        }),
        catchError((err) => {
          this.routeStore.update((state) => ({
            ...state,
            loading: null,
            error: err
          }));
          return of(RouteActions.error(err));
        })
      );
    })
  );

  @Effect()
  remove$ = this.action.pipe(
    ofType(RouteActions.remove),
    switchMap((props) => {
      this.routeStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.routeService.delete(props.idRoute).pipe(
        tap((_) => {
          this.message.success('Xoá tuyến đường thành công');
          this.routeStore.remove(props.idRoute);
          this.routeStore.update((state) => ({
            ...state,
            loading: false,
            total: state.total - 1,
            error: null
          }));
        }),
        catchError((err) => {
          this.routeStore.update((state) => ({
            ...state,
            loading: null,
            error: err
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
            this.mapToRoute(route)
          );
        }),
        catchError((err) => of(RouteActions.error(err)))
      )
    )
  );

  private mapToRoute(route: RouteEntity) {
    const expandedAll = this.routeQuery.getValue().expandedAll;
    const newRoute = Object.assign(route, {
        orders: route.orders.map((order) => {
          return Object.assign(order, {
            commodities: order.commodities.sort((a, b) => a.id - b.id),
            expand: true
          });
        })
      }
    );

    return Object.assign(newRoute, {
      totalCommodityUniq: newRoute.orders.reduce((a, b) => a + b.totalCommodity, 0),
      orders: newRoute.orders.map((order) => {
          return Object.assign(order, {
            priceTotal: getTotalPriceOfCommodity(order.commodities),
            totalCommodity: getTotalCommodity(order.commodities),
            expand: true
          });
        }
      ),
      expand: expandedAll
    });
  }
}
