import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CommodityService } from '../service/commodity.service';
import { CommodityAction } from './commodity.action';
import { throwError } from 'rxjs';
import { OrderAction } from '../../order/+state/order.action';

@Injectable()
export class CommodityEffect {
  addCommodity$ = createEffect(() =>
    this.action.pipe(
      ofType(CommodityAction.addCommodity),
      switchMap((props) => this.commodityService.addOne(props.commodity).pipe(
        map(_ => CommodityAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    ));

  loadAllCommodities$ = createEffect(() =>
    this.action.pipe(
      ofType(CommodityAction.loadAllCommodities),
      switchMap((_) => this.commodityService.pagination()),
      map((ResponsePaginate) => CommodityAction.loadInitSuccess({ commodity: ResponsePaginate.data })),
      catchError((err) => throwError(err))
    )
  );

  loadCommodity$ = createEffect(() =>
    this.action.pipe(
      ofType(CommodityAction.loadInit),
      switchMap((params) => this.commodityService.pagination(params)),
      map((ResponsePaginate) => CommodityAction.loadInitSuccess({ commodity: ResponsePaginate.data })),
      catchError((err) => throwError(err))
    )
  );
  loadMoreCommodity$ = createEffect(() =>
    this.action.pipe(
      ofType(CommodityAction.loadMoreCommodity),
      switchMap((params) => this.commodityService.pagination(params)),
      map((ResponsePaginate) => CommodityAction.loadMoreCommoditySuccess({ commodity: ResponsePaginate.data })),
      catchError((err) => throwError(err))
    )
  );
  getCommodity$ = createEffect(() =>
    this.action.pipe(
      ofType(CommodityAction.getCommodity),
      switchMap((props) => this.commodityService.getOne(props.id)),
      map((commodity) => CommodityAction.getCommoditySuccess({ commodity: commodity })),
      catchError((err) => throwError(err))
    )
  );

  updateCommodity$ = createEffect(() =>
    this.action.pipe(
      ofType(CommodityAction.updateCommodity),
      switchMap((props) => this.commodityService.update(props.id, props.commodity).pipe(
        map(_ => CommodityAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  deleteCommodity$ = createEffect(() =>
    this.action.pipe(
      ofType(CommodityAction.deleteCommodity),
      switchMap((props) => this.commodityService.delete(props.id).pipe(
        map(_ => {
            if (props.orderId) {
              return OrderAction.getOrder({ id: props.orderId });
            } else {
              return CommodityAction.loadInit({ take: 30, skip: 0 });
            }
          }
        ),
        catchError((err) => throwError(err))
      ))
    )
  );

  constructor(
    private readonly action: Actions,
    private readonly commodityService: CommodityService
  ) {
  }
}
