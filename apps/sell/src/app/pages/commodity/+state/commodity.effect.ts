import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { CommodityService } from '../service/commodity.service';
import { CommodityAction } from './commodity.action';
import { throwError } from 'rxjs';
import { OrderAction } from '../../order/+state/order.action';
import { select, Store } from '@ngrx/store';
import { selectorTotalCommodityInStore } from './commodity.selector';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class CommodityEffect {
  addCommodity$ = createEffect(() =>
    this.action.pipe(
      ofType(CommodityAction.addCommodity),
      switchMap((props) => this.commodityService.addOne(props.commodity).pipe(
        map(commodity => {
            this.snackbar.open('Thêm hàng hóa thành công', '', { duration: 1500 });
            return CommodityAction.addCommoditySuccess({ commodity: commodity });
          }
        ),
        catchError((err) => throwError(err))
      ))
    ));

  loadAllCommodities$ = createEffect(() =>
    this.action.pipe(
      ofType(CommodityAction.loadAllCommodities),
      switchMap((_) => this.commodityService.pagination()),
      map((ResponsePaginate) => {
          return CommodityAction.loadInitSuccess({
            commodity: ResponsePaginate.data,
            total: ResponsePaginate.total
          });
        }
      ),
      catchError((err) => throwError(err))
    )
  );

  loadCommodity$ = createEffect(() =>
    this.action.pipe(
      ofType(CommodityAction.loadInit),
      switchMap((params) => this.commodityService.pagination(params.CommodityDTO)),
      map((ResponsePaginate) => CommodityAction.loadInitSuccess({
        commodity: ResponsePaginate.data,
        total: ResponsePaginate.total
      })),
      catchError((err) => throwError(err))
    )
  );

  loadMoreCommodity$ = createEffect(() =>
    this.action.pipe(
      ofType(CommodityAction.loadMoreCommodity),
      withLatestFrom(this.store.pipe(select(selectorTotalCommodityInStore))),
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
          return CommodityAction.loadMoreCommoditySuccess({
            commodity: ResponsePaginate.data,
            total: ResponsePaginate.total
          });
        }
      ),
      catchError((err) => throwError(err))
    )
  );

  getCommodity$ = createEffect(() =>
    this.action.pipe(
      ofType(CommodityAction.getCommodity),
      switchMap((props) => this.commodityService.getOne(props.id)),
      map((commodity) => {
          return CommodityAction.getCommoditySuccess({ commodity: commodity });
        }
      ),
      catchError((err) => throwError(err))
    )
  );

  updateCommodity$ = createEffect(() =>
    this.action.pipe(
      ofType(CommodityAction.updateCommodity),
      switchMap((props) => this.commodityService.update(props.id, props.commodity).pipe(
        map(_ => {
            this.snackbar.open('Cập nhật hóa thành công', '', { duration: 1500 });
            return CommodityAction.loadInit({ CommodityDTO: { take: 30, skip: 0 } });
          }
        ),
        catchError((err) => throwError(err))
      ))
    )
  );

  deleteCommodity$ = createEffect(() =>
    this.action.pipe(
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

  constructor(
    private readonly action: Actions,
    private readonly store: Store,
    private readonly snackbar: MatSnackBar,
    private readonly commodityService: CommodityService
  ) {
  }
}
