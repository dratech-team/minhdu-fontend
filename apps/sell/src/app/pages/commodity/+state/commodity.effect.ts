import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@datorama/akita-ng-effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { CommodityService } from '../service/commodity.service';
import { CommodityAction } from './commodity.action';
import { throwError } from 'rxjs';
import { OrderAction } from '../../order/+state/order.action';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommodityQuery } from './commodity.query';
import { CommodityStore } from './commodity.store';

@Injectable()
export class CommodityEffect {
  constructor(
    private readonly actions$: Actions,
    private readonly commodityQuery: CommodityQuery,
    private readonly commodityStore: CommodityStore,
    private readonly snackbar: MatSnackBar,
    private readonly commodityService: CommodityService
  ) {
  }

  loadCommodity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommodityAction.loadInit),
      switchMap((params) => this.commodityService.pagination(params.CommodityDTO)),
      map((ResponsePaginate) => {
        this.commodityStore.set(ResponsePaginate.data);
        this.commodityStore.update((state) => ({ ...state, total: ResponsePaginate.total }));
      }),
      catchError((err) => throwError(err))
    )
  );

  addCommodity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommodityAction.addCommodity),
      switchMap((props) => this.commodityService.addOne(props.commodity).pipe(
        map(commodity => {
            this.snackbar.open('Thêm hàng hóa thành công', '', { duration: 1500 });
            this.commodityStore.add(commodity);
          }
        ),
        catchError((err) => throwError(err))
      ))
    ));

  loadAllCommodities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommodityAction.loadAllCommodities),
      switchMap((_) => this.commodityService.pagination()),
      map((ResponsePaginate) => {
          this.commodityStore.set(ResponsePaginate.data);
          this.commodityStore.update((state) => ({ ...state, total: ResponsePaginate.total }));
        }
      ),
      catchError((err) => throwError(err))
    )
  );


  loadMoreCommodity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommodityAction.loadMoreCommodity),
      withLatestFrom(this.commodityQuery.selectCount()),
      map(([props, skip]) =>
        Object.assign(JSON.parse(JSON.stringify(props.commodityDTO)), {
          skip: skip
        })
      ),
      switchMap((params) => this.commodityService.pagination(params)),
      map((ResponsePaginate) => {
          this.snackbar.open(ResponsePaginate.data.length > 0 ?
            'Tải hàng hóa thành công' :
            'Đã tải hết hành hóa'
            , '', { duration: 1500 });
          this.commodityStore.add(ResponsePaginate.data);
        }
      ),
      catchError((err) => throwError(err))
    )
  );

  getCommodity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommodityAction.getCommodity),
      switchMap((props) => this.commodityService.getOne(props.id)),
      map((commodity) => {
          this.commodityStore.update(commodity.id, commodity);
        }
      ),
      catchError((err) => throwError(err))
    )
  );

  updateCommodity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommodityAction.updateCommodity),
      switchMap((props) => this.commodityService.update(props.id, props.commodity).pipe(
        map(_ => {
            this.snackbar.open('Cập nhật hóa thành công', '', { duration: 1500 });
            if (props.orderId) {
              return OrderAction.getOrder({ id: props.orderId });
            } else {
              return CommodityAction.loadInit({ CommodityDTO: { take: 30, skip: 0 } });
            }
          }
        ),
        catchError((err) => throwError(err))
      ))
    )
  );

  deleteCommodity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommodityAction.deleteCommodity),
      switchMap((props) => this.commodityService.delete(props.id).pipe(
        map(_ => {
            this.snackbar.open('Xóa hàng hóa thành công', '', { duration: 1500 });
            if (props.orderId) {
              return OrderAction.getOrder({ id: props.orderId });
            } else {
              return CommodityAction.loadInit({ CommodityDTO: { take: 30, skip: 0 } });
            }
          }
        ),
        catchError((err) => throwError(err))
      ))
    )
  );
}
