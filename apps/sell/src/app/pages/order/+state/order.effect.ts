import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {OrderService} from '../service/order.service';
import {OrderActions} from './order.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConvertBoolean} from '@minhdu-fontend/enums';
import {Router} from '@angular/router';
import {SnackBarComponent} from '../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';
import {OrderEntity} from '../enitities/order.interface';
import {getTotalCommodity} from '../../../../../../../libs/utils/sell.ultil';
import {OrderQuery} from './order.query';
import {OrderStore} from './order.store';
import {CommodityStore} from "../../commodity/+state/commodity.store";

@Injectable()
export class OrderEffect {
  convertBoolean = ConvertBoolean;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly actions$: Actions,
    private readonly orderQuery: OrderQuery,
    private readonly orderStore: OrderStore,
    private readonly orderService: OrderService,
    private readonly router: Router
  ) {
  }

  @Effect()
  addOrder$ = this.actions$.pipe(
    ofType(OrderActions.addOne),
    switchMap((props) => {
      this.orderStore.update(state => ({
        ...state, added: false
      }))
      if (!props?.provinceId) {
        throw this.snackBar.open('Tỉnh/Thành phố không được để trống');
      }
      return this.orderService.addOne(props);
    }),
    map((res) => {
      this.orderStore.update(state => ({
        ...state, added: true
      }))
      this.snackBar.open('Thêm đơn hàng thành công', '', {duration: 1500});
      this.orderStore.add(res);
      this.router.navigate(['don-hang']).then()
    }),
    catchError((err) => {
      return throwError(err);
    })
  );

  @Effect()
  loadAll$ = this.actions$.pipe(
    ofType(OrderActions.loadAll),
    switchMap((props) => {
        this.orderStore.update(state => ({
          ...state, loading: true
        }))
        return this.orderService.pagination(props.param).pipe(
          map((response) => {
              this.orderStore.update(state => ({
                ...state, loading: false
              }))
              if (response.data.length > 0) {
                response.data.map((order: OrderEntity) => {
                  order.expand = false;
                  order.totalCommodity = getTotalCommodity(order.commodities);
                  this.orderStore.update(state => ({
                    ...state,
                    total: response.total,
                    commodityUniq: response.commodityUniq
                  }));
                });
              }else{
                if (response.data.length === 0) {
                  this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 2500,
                    panelClass: ['background-snackbar'],
                    data: {content: 'Đã lấy hết đơn hàng'}
                  });
                }
              }
              if (props.isScroll) {
                this.orderStore.add(response.data);
              } else {
                this.orderStore.set(response.data);
              }

            }
          )
        )
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  loadOne$ = this.actions$.pipe(
    ofType(OrderActions.loadOne),
    switchMap((props) => this.orderService.getOne(props.id)),
    map((order) => {
        return this.orderStore.upsert(order.id, order)
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType(OrderActions.update),
    switchMap((props) => {
        this.orderStore.update(state => ({
          ...state, added: false
        }))
        return this.orderService.update(props.id, props.updates)
      }
    ),
    map((response) => {
      this.orderStore.update(state => ({
        ...state, added: true
      }))
      this.orderStore.update(response.id, response);
    }),
    tap(() => {
      this.snackBar.open('Cập nhật thành công');
    }),
    catchError((err) => {
      return throwError(err);
    })
  );

  @Effect()
  updateHide$ = this.actions$.pipe(
    ofType(OrderActions.hide),
    switchMap((props) =>
      this.orderService.updateHide(props.id, props.hide).pipe(
        map((res) => {
          this.orderStore.update(res.id, res);
        }),
        catchError((err) => throwError(err))
      )
    )
  );

  @Effect()
  paymentBill$ = this.actions$.pipe(
    ofType(OrderActions.payment),
    switchMap((props) =>
      this.orderService.payment(props.id, props.order).pipe(
        map((_) => OrderActions.loadOne({id: props.id})),
        catchError((err) => throwError(err))
      )
    )
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType(OrderActions.remove),
    switchMap((props) =>
      this.orderService.delete(props.id).pipe(
        map((_) => {
          this.snackBar.open('Xoá đơn hàng thành công', '', {duration: 1500});
          this.orderStore.remove(props.id);
        }),
        catchError((err) => throwError(err))
      )
    )
  );

  @Effect()
  cancel$ = this.actions$.pipe(
    ofType(OrderActions.cancelOrder),
    switchMap((prop) => this.orderService.cancelOrder(prop.orderId)),
    map((res) => {
        this.snackBar.open('Huỷ đơn hàng thành công', '', {duration: 1500});
        this.orderStore.remove(res.id)
      }
    ),
    catchError((err) => throwError(err))
  );
}
