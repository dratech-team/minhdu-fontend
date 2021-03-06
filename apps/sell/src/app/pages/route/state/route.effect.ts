import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { RouteActions } from './route.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { RouteService } from '../service';
import { of } from 'rxjs';
import { RouteStore } from './route.store';
import { RouteQuery } from './route.query';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PaginationDto } from '@minhdu-fontend/constants';
import { BaseRouteEntity, RouteEntity } from '../entities';
import { CommodityEntity } from '../../commodity/entities';
import { CancelEnum } from '../enums';

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
          skip: !props.isSet ? this.routeQuery.getCount() : 0
        }
      );
      return this.routeService.pagination(search).pipe(
        tap((res) => {
          const routes = res.data.map((route) => {
            return this.mapToRoute(route);
          });
          if (props.isSet || res.total === 0) {
            this.routeStore.set(routes);
          } else {
            this.routeStore.add(routes);
          }
          this.routeStore.update(state => ({
            ...state,
            remain: res.total - this.routeQuery.getCount(),
            loading: false,
            total: res.total,
            error: null
          }));
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
          tap((route) => {
            this.routeStore.upsert(route.id, this.mapToRoute(route));
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
  restore$ = this.action.pipe(
    ofType(RouteActions.restore),
    switchMap((props) =>
      this.routeService.restore(props.id).pipe(
        tap((route) => {
          this.routeStore.update(
            route.id,
            this.mapToRoute(route)
          );
        }),
        catchError((err) => of(RouteActions.error(err)))
      )
    )
  );

  @Effect()
  cancel$ = this.action.pipe(
    ofType(RouteActions.cancel),
    switchMap((props) =>
      this.routeService.cancel(props.id, props.cancelDTO).pipe(
        map((route) => {
          if (props.cancelDTO.cancelType === CancelEnum.COMMODITY) {
            return this.routeStore.update(
              route.id,
              this.mapToRoute(route)
            );
          }
          return this.routeStore.update(
            route.id,
            { orders: [] }
          );
        }),
        catchError((err) => of(RouteActions.error(err)))
      )
    )
  );

  private mapToRoute(route: BaseRouteEntity): RouteEntity {
    const expandedAll = this.routeQuery.getValue().expandedAll;
    return {
      ...route,
      expand: expandedAll,
      orders: route.orders.map((order) => {
        return {
          ...order,
          commodities: order.commodities.sort((a: CommodityEntity, b: CommodityEntity) => a.id - b.id),
          commodityTotal: order.commodities.reduce((a, b) => a + b.amount + (b.more?.amount || 0) + (b.gift || 0), 0),
          expand: expandedAll
        };
      })
    };
  }
}
