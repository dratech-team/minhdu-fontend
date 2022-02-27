import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CommodityService } from '../service/commodity.service';
import { CommodityAction } from './commodity.action';
import { throwError } from 'rxjs';
import { OrderAction } from '../../order/+state/order.action';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommodityStore } from './commodity.store';
import { CommodityQuery } from './commodity.query';
import { Commodity } from '../entities/commodity.entity';

@Injectable()
export class CommodityEffect {
  constructor(
    private readonly actions$: Actions,
    private readonly store: CommodityStore,
    private readonly query: CommodityQuery,
    private readonly snackbar: MatSnackBar,
    private readonly commodityService: CommodityService
  ) {
  }

  @Effect()
  addCommodity$ = this.actions$.pipe(
    ofType(CommodityAction.addCommodity),
    switchMap((props) => this.commodityService.addOne(props.commodity)),
    tap(commodity => {
        this.store.add(Object.assign(commodity, { selected: true }));
        this.snackbar.open('Thêm hàng hóa thành công', '', { duration: 1500 });
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  loadAllCommodities$ = this.actions$.pipe(
    ofType(CommodityAction.loadAllCommodities),
    switchMap(() => this.commodityService.pagination()),
    tap((response) => this.store.add(response.data)),
    catchError((err) => throwError(err))
  );

  @Effect()
  loadCommodity$ = this.actions$.pipe(
    ofType(CommodityAction.loadInit),
    switchMap((params) => this.commodityService.pagination(params.CommodityDTO)),
    tap((response) => this.store.set(response.data)),
    catchError((err) => throwError(err))
  );

  @Effect()
  loadMoreCommodity$ = this.actions$.pipe(
    ofType(CommodityAction.loadMoreCommodity),
    map((props) => Object.assign(JSON.parse(JSON.stringify(props.commodityDTO)), {
      skip: this.query.getCount()
    })),
    switchMap((params) => this.commodityService.pagination(params)),
    tap((response) => {
        this.store.add(response.data);
        this.snackbar.open(response.data.length > 0 ?
          'Tải hàng hóa thành công' :
          'Đã tải hết hành hóa'
          , '', { duration: 1500 });
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  getCommodity$ = this.actions$.pipe(
    ofType(CommodityAction.getCommodity),
    switchMap((props) => this.commodityService.getOne(props.id)),
    tap((commodity) => this.store.update(commodity.id, commodity)),
    catchError((err) => throwError(err))
  );

  @Effect()
  updateCommodity$ = this.actions$.pipe(
    ofType(CommodityAction.updateCommodity),
    switchMap((props) => this.commodityService.update(props.id, props.commodity).pipe(
      map(_ => {
          this.snackbar.open('Cập nhật hóa thành công', '', { duration: 1500 });
          if (props.orderId) {
            return OrderAction.getOrder({ id: props.orderId });
          } else {
            return CommodityAction.loadInit({ CommodityDTO: { take: 30, skip: 0 } });
          }
          ;
        }
      ),
      catchError((err) => throwError(err))
    ))
  );

  @Effect()
  deleteCommodity$ = this.actions$.pipe(
    ofType(CommodityAction.deleteCommodity),
    switchMap((props) => this.commodityService.delete(props.id)),
    map((commodity) => {
        this.snackbar.open('Xóa hàng hóa thành công', '', { duration: 1500 });
        this.store.remove((commodity as Commodity).id);
      }
    ),
    catchError((err) => throwError(err))
  );
}
