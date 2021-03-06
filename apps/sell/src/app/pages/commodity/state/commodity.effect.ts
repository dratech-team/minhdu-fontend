import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CommodityService } from '../service';
import { CommodityAction } from './commodity.action';
import { of } from 'rxjs';
import { OrderActions } from '../../order/state';
import { CommodityQuery } from './commodity.query';
import { CommodityStore } from './commodity.store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PaginationDto } from '@minhdu-fontend/constants';

@Injectable()
export class CommodityEffect {
  constructor(
    private readonly actions$: Actions,
    private readonly commodityQuery: CommodityQuery,
    private readonly commodityStore: CommodityStore,
    private readonly message: NzMessageService,
    private readonly commodityService: CommodityService
  ) {
  }

  @Effect()
  addOne$ = this.actions$.pipe(
    ofType(CommodityAction.addOne),
    switchMap((props) => {
      this.commodityStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.commodityService.addOne(props).pipe(
        map((commodity) => {
          this.commodityStore.add(commodity);
          this.commodityStore.update((state) => ({
            ...state,
            loading: false,
            active: commodity.id
          }));
        }),
        catchError((err) => {
          this.commodityStore.update((state) => ({
            ...state,
            loading: null,
            error: err
          }));
          return of(CommodityAction.error(err));
        })
      );
    })
  );

  @Effect()
  loadAll$ = this.actions$.pipe(
    ofType(CommodityAction.loadAll),
    switchMap((props) => {
      this.commodityStore.update((state) => ({
        ...state,
        loading: true
      }));
      const param = Object.assign(props, Object.assign(props.search, {
        take: PaginationDto.take,
        skip: !props.isSet ? this.commodityQuery.getCount() : 0
      }));
      return this.commodityService.pagination(param)
        .pipe(
          map((res) => {
            if (props?.isSet || res.total === 0) {
              this.commodityStore.set(res.data);
            } else {
              this.commodityStore.add(res.data);
            }
            this.commodityStore.update((state) => ({
              ...state,
              loading: false,
              total: res.total,
              remain: res.total - this.commodityQuery.getCount()
            }));
          }),
          catchError((err) => {
            this.commodityStore.update((state) => ({
              ...state,
              loading: false
            }));
            return of(CommodityAction.error(err));
          })
        );
    })
  );

  @Effect()
  getOne$ = this.actions$.pipe(
    ofType(CommodityAction.getOne),
    switchMap((props) =>
      this.commodityService.getOne(props.id).pipe(
        map((commodity) => {
          this.commodityStore.upsert(commodity.id, commodity);
        }),
        catchError((err) => of(CommodityAction.error(err)))
      )
    )
  );

  @Effect()
  updateOne$ = this.actions$.pipe(
    ofType(CommodityAction.update),
    switchMap((props) => {
      this.commodityStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.commodityService.update(props).pipe(
        map((commodity) => {
          this.commodityStore.update((state) => ({
            ...state,
            loading: false
          }));
          this.message.success('C???p nh???t h??a th??nh c??ng');
          if (props.updates?.orderId) {
            this.actions$.dispatch(
              OrderActions.loadOne({ id: props.updates.orderId })
            );
          }
          return this.commodityStore.update(commodity.id, commodity);
        }),
        catchError((err) => {
          this.commodityStore.update((state) => ({
            ...state,
            loading: null
          }));
          return of(CommodityAction.error(err));
        })
      );
    })
  );

  @Effect()
  removeOne$ = this.actions$.pipe(
    ofType(CommodityAction.remove),
    switchMap((props) =>
      this.commodityService.delete(props.id).pipe(
        map((_) => {
          if (props.inOrder) {
            this.actions$.dispatch(
              OrderActions.loadOne({ id: props.inOrder.orderId })
            );
          }
          this.message.success('X??a h??ng h??a th??nh c??ng');
          this.commodityStore.remove(props.id);
        })
      )
    ),
    catchError((err) => of(CommodityAction.error(err)))
  );
}
