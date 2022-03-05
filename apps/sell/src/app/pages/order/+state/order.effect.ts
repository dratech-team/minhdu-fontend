import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { OrderService } from '../service/order.service';
import { OrderActions } from './order.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConvertBoolean } from '@minhdu-fontend/enums';
import { CustomerActions } from '../../customer/+state/customerActions';
import { Router } from '@angular/router';
import { SnackBarComponent } from '../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';
import { Order } from '../enitities/order.interface';
import { getTotalCommodity } from '../../../../../../../libs/utils/sell.ultil';
import { OrderQuery } from './order.query';
import { OrderStore } from './order.store';

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
      if (!props.order?.createdAt) {
        throw this.snackBar.open('Ngày tạo đơn hàng không được để trống');
      }
      if (!props.order?.provinceId) {
        throw this.snackBar.open('Tỉnh/Thành phố không được để trống');
      }
      if (!props.order?.customerId) {
        throw this.snackBar.open('Khách hàng không được để trống');
      }
      if (!props.order?.commodityIds?.length) {
        throw this.snackBar.open('Vui lòng chọn hàng hóa');
      }
      return this.orderService.addOne(props.order);
    }),
    map((res) => {
      this.snackBar.open('Thêm đơn hàng thành công', '', { duration: 1500 });
      this.orderStore.add(res);
    }),
    tap(() => this.router.navigate(['/don-hang']).then((v => {
      /// FIXME:
      if (v) {
        location.reload();
      }
    }))),
    catchError((err) => {
      return throwError(err);
    })
  );

  @Effect()
  loadAll$ = this.actions$.pipe(
    ofType(OrderActions.loadAll),
    switchMap((props) => this.orderService.pagination(props.orderDTO)),
    map((response) => {
        if (response.data.length === 0) {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 2500,
            panelClass: ['background-snackbar'],
            data: { content: 'Đã lấy hết đơn hàng' }
          });
        } else {
          response.data.map((order: Order) => {
            order.expand = false;
            order.totalCommodity = getTotalCommodity(order.commodities);
          });
          this.orderStore.add(response.data);
          this.orderStore.update(state => ({
            ...state,
            total: response.total,
            commodityUniq: response.commodityUniq
          }));
        }
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  loadOne$ = this.actions$.pipe(
    ofType(OrderActions.loadOne),
    switchMap((props) => this.orderService.getOne(props.id)),
    map((order) => this.orderStore.update(order.id, order)),
    catchError((err) => throwError(err))
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType(OrderActions.update),
    switchMap((props) =>
      this.orderService.update(props.updateOrderDto.id, props.updateOrderDto.order).pipe(
        map((_) => {
          switch (props.updateOrderDto.typeUpdate) {
            case 'DELIVERED':
              return OrderActions.loadAll({
                orderDTO: { take: 30, skip: 0 }
              });
            case 'IN_CUSTOMER':
              return OrderActions.loadAll({
                orderDTO: { take: 30, skip: 0, customerId: props.updateOrderDto.order?.customerId }
              });
            default:
              return OrderActions.loadOne({ id: props.updateOrderDto.id });
          }
        }),
        tap(() => {
          this.snackBar.open('Cập nhật thành công');
        }),
        catchError((err) => {
          return throwError(err);
        })
      )
    )
  );

  @Effect()
  updateHide$ = this.actions$.pipe(
    ofType(OrderActions.hide),
    switchMap((props) =>
      this.orderService.updateHide(props.id, props.hide).pipe(
        map((_) => {
          // this.actions$.dispatch(
          //   OrderAction.loadOrdersAssigned({
          //     take: 30,
          //     skip: 0,
          //     status: this.convertBoolean.TRUE
          //   })
          // );
          return CustomerActions.loadOne({ id: props.customerId });
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
        map((_) => OrderActions.loadOne({ id: props.id })),
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
          this.snackBar.open('Xoá đơn hàng thành công', '', { duration: 1500 });
          if (props.customerId) {
            this.actions$.dispatch(
              CustomerActions.loadOne({ id: props.customerId })
            );
            return OrderActions.loadAll({
              orderDTO: { take: 30, skip: 0, customerId: props.customerId }
            });
          } else {
            return OrderActions.loadAll({ orderDTO: { take: 30, skip: 0 } });
          }
        }),
        catchError((err) => throwError(err))
      )
    )
  );

  @Effect()
  cancel$ = this.actions$.pipe(
    ofType(OrderActions.cancelOrder),
    switchMap((prop) =>
      this.orderService.cancelOrder(prop.orderId)),
    map((_) => {
        this.snackBar.open('Huỷ đơn hàng thành công', '', { duration: 1500 });
        return OrderActions.loadAll({ orderDTO: { take: 30, skip: 0 } });
      }
    ),
    catchError((err) => throwError(err))
  );
}
