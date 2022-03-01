import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { OrderService } from '../service/order.service';
import { OrderAction } from './order.action';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConvertBoolean } from '@minhdu-fontend/enums';
import { CustomerAction } from '../../customer/+state/customer.action';
import { Router } from '@angular/router';
import { OrderStore } from './order.store';


@Injectable()
export class OrderEffect {
  convertBoolean = ConvertBoolean;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly actions$: Actions,
    private readonly store: OrderStore,
    private readonly orderService: OrderService,
    private readonly router: Router
  ) {
  }

  @Effect()
  addOrder$ = this.actions$.pipe(
    ofType(OrderAction.addOne),
    switchMap((order) => {
      this.onValidate(order);
      return this.orderService.addOne(order);

    }),
    tap((res) => {
      this.snackBar.open('Thêm đơn hàng thành công', '', { duration: 1500 });
      this.store.add(res);
      this.router.navigate(['/don-hang']).then();
    }),
    catchError((err) => throwError(err))
  );

  @Effect()
  loadAllOrder$ = this.actions$.pipe(
    ofType(OrderAction.loadAll),
    switchMap((props) => this.orderService.pagination(props)),
    tap((response) => {
        this.store.set(response.data);
      }
    ),
    catchError((err) => throwError(err))
  );

  // @Effect()
  // loadOrdersAssigned$ = this.actions$.pipe(
  //   ofType(OrderAction.loadOrdersAssigned),
  //   switchMap((props) => {
  //     return this.orderService.pagination(props);
  //   }),
  //   map((responsePagination) => {
  //     return OrderAction.loadOrdersAssignedSuccess({
  //       orders: responsePagination.data
  //     });
  //   }),
  //   catchError((err) => throwError(err))
  // );

  @Effect()
  getOrder$ = this.actions$.pipe(
    ofType(OrderAction.getOne),
    switchMap((props) => this.orderService.getOne(props.id)),
    tap((order) => this.store.update(order.id, order)),
    catchError((err) => throwError(err))
  );

  @Effect()
  updateOrder$ = this.actions$.pipe(
    ofType(OrderAction.update),
    switchMap((props) => this.orderService.update(props.id, props)),
    tap((_) => {

    }),
    tap(() => {
      this.snackBar.open('Cập nhật thành công');
    }),
    catchError((err) => {
      return throwError(err);
    })
  );

  @Effect()
  updateHideOrder$ = this.actions$.pipe(
    ofType(OrderAction.hide),
    switchMap((props) => this.orderService.updateHide(props.id, props.hide)),
    map((_) => {
      // this.store.dispatch(
      //   OrderAction.loadOrdersAssigned({
      //     take: 30,
      //     skip: 0,
      //     status: this.convertBoolean.TRUE
      //   })
      // );
      // return CustomerAction.getCustomer({ id: props.customerId });
    }),
    catchError((err) => throwError(err))
  );

  @Effect()
  paymentBill$ = this.actions$.pipe(
    ofType(OrderAction.payment),
    switchMap((props) => this.orderService.payment(props.id, props.order))
    // map((_) => OrderAction.getOrder({ id: props.id })),
    // catchError((err) => throwError(err))
  );

  @Effect()
  deleteOrder$ = this.actions$.pipe(
    ofType(OrderAction.remove),
    switchMap((props) => this.orderService.delete(props.id)),
    tap(() => {
      //   this.snackBar.open('Xoá đơn hàng thành công', '', { duration: 1500 });
      //   if (props.customerId) {
      //     this.store.dispatch(
      //       CustomerAction.getCustomer({ id: props.customerId })
      //     );
      //     return OrderAction.loadInit({
      //       orderDTO: { take: 30, skip: 0, customerId: props.customerId }
      //     });
      //   } else {
      //     return OrderAction.loadInit({ orderDTO: { take: 30, skip: 0 } });
      //   }
      // }),
      // catchError((err) => throwError(err))
    })
  );

  @Effect()
  cancelOrder$ = this.actions$.pipe(
    ofType(OrderAction.cancelOrder),
    switchMap((prop) => this.orderService.cancelOrder(prop.orderId)),
    map((_) => {
        this.snackBar.open('Huỷ đơn hàng thành công', '', { duration: 1500 });
        // return OrderAction.loadInit({ orderDTO: { take: 30, skip: 0 } });
      }
    ),
    catchError((err) => throwError(err))
  );

  onValidate(order: any) {
    if (!order?.createdAt) {
      throw this.snackBar.open('Ngày tạo đơn hàng không được để trống');
    }
    if (!order?.provinceId) {
      throw this.snackBar.open('Tỉnh/Thành phố không được để trống');
    }
    if (!order?.customerId) {
      throw this.snackBar.open('Khách hàng không được để trống');
    }
    if (!order?.commodityIds?.length) {
      throw this.snackBar.open('Vui lòng chọn hàng hóa');
    }
  }
}
