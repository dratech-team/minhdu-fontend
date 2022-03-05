import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@datorama/akita-ng-effects';
import { OrderService } from '../service/order.service';
import { OrderAction } from './order.action';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConvertBoolean } from '@minhdu-fontend/enums';
import { CustomerAction } from '../../customer/+state/customer.action';
import { Router } from '@angular/router';
import { SnackBarComponent } from '../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';
import { Order } from './order.interface';
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
    ofType(OrderAction.addOrder),
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
  loadInit$ = this.actions$.pipe(
    ofType(OrderAction.loadInit),
    switchMap((props) => this.orderService.pagination(props.orderDTO)),
    map((responsePagination) => {
        responsePagination.data.map((order: Order) => {
          order.expand = false;
          order.totalCommodity = getTotalCommodity(order.commodities);
        });
        this.orderStore.set(responsePagination.data);
        this.orderStore.update(state => ({
          ...state,
          total: responsePagination.total,
          commodityUniq: responsePagination.commodityUniq
        }));
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  loadMoreOrders$ = this.actions$.pipe(
    ofType(OrderAction.loadMoreOrders),
    withLatestFrom(this.orderQuery.selectCount()),
    map(([props, skip]) =>
      Object.assign(JSON.parse(JSON.stringify(props.orderDTO)), {
        skip: skip
      })
    ),
    switchMap((props) => {
      return this.orderService.pagination(props);
    }),
    map((responsePagination) => {
      if (responsePagination.data.length === 0) {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 2500,
          panelClass: ['background-snackbar'],
          data: { content: 'Đã lấy hết đơn hàng' }
        });
      }
      responsePagination.data.map((order: Order) => {
        order.expand = false;
        order.totalCommodity = getTotalCommodity(order.commodities);
      });
      this.orderStore.add(responsePagination.data);
      this.orderStore.update(state => ({
        ...state,
        total: responsePagination.total,
        commodityUniq: responsePagination.commodityUniq
      }));
    }),
    catchError((err) => throwError(err))
  );

  @Effect()
  getOrder$ = this.actions$.pipe(
    ofType(OrderAction.getOrder),
    switchMap((props) => this.orderService.getOne(props.id)),
    map((order) => this.orderStore.update(order.id, order)),
    catchError((err) => throwError(err))
  );

  @Effect()
  updateOrder$ = this.actions$.pipe(
    ofType(OrderAction.updateOrder),
    switchMap((props) =>
      this.orderService.update(props.updateOrderDto.id, props.updateOrderDto.order).pipe(
        map((_) => {
          switch (props.updateOrderDto.typeUpdate) {
            case 'DELIVERED':
              return OrderAction.loadInit({
                orderDTO: { take: 30, skip: 0 }
              });
            case 'IN_CUSTOMER':
              this.actions$.dispatch(OrderAction.loadOrdersAssigned({
                take: 30, skip: 0, customerId: props.updateOrderDto.order?.customerId
              }));
              return OrderAction.loadInit({
                orderDTO: { take: 30, skip: 0, customerId: props.updateOrderDto.order?.customerId }
              });
            default:
              return OrderAction.getOrder({ id: props.updateOrderDto.id });
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
  updateHideOrder$ = this.actions$.pipe(
    ofType(OrderAction.updateHideOrder),
    switchMap((props) =>
      this.orderService.updateHide(props.id, props.hide).pipe(
        map((_) => {
          this.actions$.dispatch(
            OrderAction.loadOrdersAssigned({
              take: 30,
              skip: 0,
              status: this.convertBoolean.TRUE
            })
          );
          return CustomerAction.getCustomer({ id: props.customerId });
        }),
        catchError((err) => {
          this.actions$.dispatch(
            OrderAction.loadOrdersAssigned({
              take: 30,
              skip: 0,
              status: this.convertBoolean.TRUE
            })
          );
          return throwError(err);
        })
      )
    )
  );

  @Effect()
  paymentBill$ = this.actions$.pipe(
    ofType(OrderAction.payment),
    switchMap((props) =>
      this.orderService.payment(props.id, props.order).pipe(
        map((_) => OrderAction.getOrder({ id: props.id })),
        catchError((err) => throwError(err))
      )
    )
  );

  @Effect()
  deleteOrder$ = this.actions$.pipe(
    ofType(OrderAction.deleteOrder),
    switchMap((props) =>
      this.orderService.delete(props.id).pipe(
        map((_) => {
          this.snackBar.open('Xoá đơn hàng thành công', '', { duration: 1500 });
          if (props.customerId) {
            this.actions$.dispatch(
              CustomerAction.getCustomer({ id: props.customerId })
            );
            return OrderAction.loadInit({
              orderDTO: { take: 30, skip: 0, customerId: props.customerId }
            });
          } else {
            return OrderAction.loadInit({ orderDTO: { take: 30, skip: 0 } });
          }
        }),
        catchError((err) => throwError(err))
      )
    )
  );

  @Effect()
  cancelOrder$ = this.actions$.pipe(
    ofType(OrderAction.cancelOrder),
    switchMap((prop) =>
      this.orderService.cancelOrder(prop.orderId)),
    map((_) => {
        this.snackBar.open('Huỷ đơn hàng thành công', '', { duration: 1500 });
        return OrderAction.loadInit({ orderDTO: { take: 30, skip: 0 } });
      }
    ),
    catchError((err) => throwError(err))
  );
}
