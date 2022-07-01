import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CommodityService } from '../service';
import { CommodityAction } from './commodity.action';
import { of } from 'rxjs';
import { OrderActions } from '../../order/+state';
import { CommodityQuery } from './commodity.query';
import { CommodityStore } from './commodity.store';
import { SearchCommodityDto } from '../dto';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class CommodityEffect {
  constructor(
    private readonly actions$: Actions,
    private readonly commodityQuery: CommodityQuery,
    private readonly commodityStore: CommodityStore,
    private readonly message: NzMessageService,
    private readonly commodityService: CommodityService
  ) {}

  @Effect()
  addOne$ = this.actions$.pipe(
    ofType(CommodityAction.addOne),
    switchMap((props) => {
      this.commodityStore.update((state) => ({
        ...state,
        added: false,
      }));
      return this.commodityService.addOne(props).pipe(
        map((commodity) => {
          this.commodityStore.update((state) => ({
            ...state,
            added: true,
          }));
          this.message.success('Thêm hàng hóa thành công');
          this.commodityStore.add(commodity);
        }),
        catchError((err) => {
          this.commodityStore.update((state) => ({
            ...state,
            added: null,
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
        loading: true,
      }));
      return this.commodityService
        .pagination(props.search as SearchCommodityDto)
        .pipe(
          map((ResponsePaginate) => {
            this.commodityStore.update((state) => ({
              ...state,
              loading: false,
            }));
            if (ResponsePaginate.data.length === 0) {
              this.message.warning('Đã lấy hết hàng hoá');
            }
            this.commodityStore.update((state) => ({
              ...state,
              total: ResponsePaginate.total,
            }));
            if (props?.isPaginate) {
              this.commodityStore.add(ResponsePaginate.data);
            } else {
              this.commodityStore.set(ResponsePaginate.data);
            }
          }),
          catchError((err) => {
            this.commodityStore.update((state) => ({
              ...state,
              loading: false,
            }));
            return of(CommodityAction.error(err));
          })
        );
    })
  );

  @Effect()
  getCommodity$ = this.actions$.pipe(
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
  updateCommodity$ = this.actions$.pipe(
    ofType(CommodityAction.update),
    switchMap((props) => {
      this.commodityStore.update((state) => ({
        ...state,
        added: false,
      }));
      return this.commodityService.update(props).pipe(
        map((commodity) => {
          this.commodityStore.update((state) => ({
            ...state,
            added: true,
          }));
          this.message.success('Cập nhật hóa thành công');
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
            added: null,
          }));
          return of(CommodityAction.error(err));
        })
      );
    })
  );

  @Effect()
  deleteCommodity$ = this.actions$.pipe(
    ofType(CommodityAction.remove),
    switchMap((props) =>
      this.commodityService.delete(props.id).pipe(
        map((_) => {
          if (props.inOrder) {
            this.actions$.dispatch(
              OrderActions.loadOne({ id: props.inOrder.orderId })
            );
          }
          this.message.success('Xóa hàng hóa thành công');
          this.commodityStore.remove(props.id);
        })
      )
    ),
    catchError((err) => of(CommodityAction.error(err)))
  );
}
