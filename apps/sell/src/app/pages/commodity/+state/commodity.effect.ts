import {Injectable} from '@angular/core';
import {Actions, createEffect, Effect, ofType} from '@datorama/akita-ng-effects';
import {catchError, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {CommodityService} from '../service/commodity.service';
import {CommodityAction} from './commodity.action';
import {throwError} from 'rxjs';
import {OrderActions} from '../../order/+state/order.actions';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CommodityQuery} from './commodity.query';
import {CommodityStore} from './commodity.store';
import {CommodityEntity} from "../entities/commodity.entity";

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

  @Effect()
  addOne$ = this.actions$.pipe(
    ofType(CommodityAction.addOne),
    switchMap((props) => {
        this.commodityStore.update(state => ({
          ...state, added: false
        }))
        return this.commodityService.addOne(props)
      }
    ),
    map(commodity => {
        this.commodityStore.update(state => ({
          ...state, added: true
        }))
        this.snackbar.open('Thêm hàng hóa thành công', '', {duration: 1500});
        this.commodityStore.add(commodity);
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  loadAll$ = this.actions$.pipe(
    ofType(CommodityAction.loadAll),
    switchMap((props) => {
        this.commodityStore.update(state => ({
          ...state, loading: true
        }))
        return this.commodityService.pagination(props.params).pipe(
          map((ResponsePaginate) => {
              this.commodityStore.update(state => ({
                ...state, loading: false
              }))
              if (props?.isScroll) {
                if (ResponsePaginate.data.length === 0) {
                  this.snackbar.open('Đã lấy hết hàng hoá', '', {duration: 1500})
                } else {
                  this.commodityStore.update((state) => ({...state, total: ResponsePaginate.total}));
                }
                this.commodityStore.add(ResponsePaginate.data);
              } else {
                this.commodityStore.set(ResponsePaginate.data);
                this.commodityStore.update((state) => ({...state, total: ResponsePaginate.total}));
              }
            }
          ),
        )
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  getCommodity$ = this.actions$.pipe(
    ofType(CommodityAction.getOne),
    switchMap((props) => this.commodityService.getOne(props.id)),
    map((commodity) => {
        this.commodityStore.upsert(commodity.id, commodity);
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  updateCommodity$ = this.actions$.pipe(
    ofType(CommodityAction.update),
    switchMap((props) => {
        this.commodityStore.update(state => ({
          ...state, added: false
        }))
        return this.commodityService.update(props.id, props.updateCommodityDto).pipe(
          map(_ => {
              this.commodityStore.update(state => ({
                ...state, added: true
              }))
              this.snackbar.open('Cập nhật hóa thành công', '', {duration: 1500});
              if (props.updateCommodityDto.orderId) {
                this.actions$.dispatch(OrderActions.loadOne({id: props.updateCommodityDto.orderId}))
              }
              return CommodityAction.loadAll({params: {take: 30, skip: 0}});
            }
          ),
        )
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  deleteCommodity$ = this.actions$.pipe(
    ofType(CommodityAction.remove),
    switchMap((props) => this.commodityService.delete(props.id).pipe(
      map(_ => {
        this.snackbar.open('Xóa hàng hóa thành công', '', {duration: 1500});
        this.commodityStore.remove(props.id)
      })
    )),
    catchError((err) => throwError(err))
  );
}
