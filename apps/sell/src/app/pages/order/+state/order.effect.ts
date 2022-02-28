import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {OrderService} from '../service/order.service';
import {OrderAction} from './order.action';
import {catchError, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {select, Store} from '@ngrx/store';
import {ConvertBoolean} from '@minhdu-fontend/enums';
import {CustomerAction} from '../../customer/+state/customer/customer.action';
import {selectorOrderAssignedTotal, selectorOrderTotal} from './order.selector';
import {Router} from '@angular/router';
import {SnackBarComponent} from '../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';
import {Order} from "./order.interface";
import {getTotalCommodity} from "../../../../../../../libs/utils/sell.ultil";


@Injectable()
export class OrderEffect {
  convertBoolean = ConvertBoolean;

  addOrder$ = createEffect(() =>
    this.action.pipe(
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
        this.snackBar.open('Thêm đơn hàng thành công', '', {duration: 1500});
        return OrderAction.addOrderSuccess({order: res});
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
    )
  );

  loadAllOrder$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.loadAllOrder),
      switchMap((props) => this.orderService.paginationOrder()),
      map((responsePagination) => {
          responsePagination.data.map((order: Order) => {
            order.totalCommodity = getTotalCommodity(order.commodities)
          })
          return OrderAction.loadInitSuccess({
            orders: responsePagination.data,
            total: responsePagination.total,
            commodityUniq: responsePagination.commodityUniq
          })
        }
      ),
      catchError((err) => throwError(err))
    )
  );

  loadInit$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.loadInit),
      switchMap((props) => this.orderService.paginationOrder(props.orderDTO)),
      map((responsePagination) => {
          responsePagination.data.map((order: Order) => {
            order.totalCommodity = getTotalCommodity(order.commodities)
          })
          return OrderAction.loadInitSuccess({
            orders: responsePagination.data,
            total: responsePagination.total,
            commodityUniq: responsePagination.commodityUniq
          })
        }
      ),
      catchError((err) => throwError(err))
    )
  );

  loadMoreOrders$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.loadMoreOrders),
      withLatestFrom(this.store.pipe(select(selectorOrderTotal))),
      map(([props, skip]) =>
        Object.assign(JSON.parse(JSON.stringify(props.orderDTO)), {
          skip: skip
        })
      ),
      switchMap((props) => {
        return this.orderService.paginationOrder(props);
      }),
      map((responsePagination) => {
        if (responsePagination.data.length === 0) {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 2500,
            panelClass: ['background-snackbar'],
            data: {content: 'Đã lấy hết đơn hàng'}
          });
        }
        responsePagination.data.map((order: Order) => {
          order.totalCommodity = getTotalCommodity(order.commodities)
        })
        return OrderAction.loadMoreOrdersSuccess({
          orders: responsePagination.data,
          total: responsePagination.total,
          commodityUniq: responsePagination.commodityUniq
        });
      }),
      catchError((err) => throwError(err))
    )
  );

  loadOrdersAssigned$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.loadOrdersAssigned),
      switchMap((props) => {
        return this.orderService.pagination(props);
      }),
      map((responsePagination) => {
        return OrderAction.loadOrdersAssignedSuccess({
          orders: responsePagination.data
        });
      }),
      catchError((err) => throwError(err))
    )
  );

  loadMoreOrdersAssigned$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.loadMoreOrdersAssigned),
      withLatestFrom(this.store.pipe(select(selectorOrderAssignedTotal))),
      map(([props, skip]) =>
        Object.assign(JSON.parse(JSON.stringify(props)), {skip: skip})
      ),
      switchMap((props) => {
        return this.orderService.pagination(props);
      }),
      map((responsePagination) => {
        if (responsePagination.data.length === 0) {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 2500,
            panelClass: ['background-snackbar'],
            data: {content: 'Đã lấy hết đơn hàng'}
          });
        }
        return OrderAction.loadMoreOrdersAssignedSuccess({
          orders: responsePagination.data
        });
      }),
      catchError((err) => throwError(err))
    )
  );

  getOrder$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.getOrder),
      switchMap((props) => this.orderService.getOne(props.id)),
      map((order) => OrderAction.getOrderSuccess({order: order})),
      catchError((err) => throwError(err))
    )
  );

  updateOrder$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.updateOrder),
      switchMap((props) =>
        this.orderService.update(props.id, props.order).pipe(
          map((_) => {
            switch (props.typeUpdate) {
              case 'DELIVERED':
                return OrderAction.loadInit({
                  orderDTO: {take: 30, skip: 0}
                });
              default:
                return OrderAction.getOrder({id: props.id});
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
    )
  );

  updateHideOrder$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.updateHideOrder),
      switchMap((props) =>
        this.orderService.updateHide(props.id, props.hide).pipe(
          map((_) => {
            this.store.dispatch(
              OrderAction.loadOrdersAssigned({
                take: 30,
                skip: 0,
                status: this.convertBoolean.TRUE
              })
            );
            return CustomerAction.getCustomer({id: props.customerId});
          }),
          catchError((err) => {
            this.store.dispatch(
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
    )
  );

  paymentBill$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.payment),
      switchMap((props) =>
        this.orderService.payment(props.id, props.order).pipe(
          map((_) => OrderAction.getOrder({id: props.id})),
          catchError((err) => throwError(err))
        )
      )
    )
  );

  deleteOrder$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.deleteOrder),
      switchMap((props) =>
        this.orderService.delete(props.id).pipe(
          map((_) => {
            this.snackBar.open('Xoá đơn hàng thành công','',{duration: 1500})
            if (props.customerId) {
              this.store.dispatch(
                CustomerAction.getCustomer({id: props.customerId})
              );
              return OrderAction.loadInit({
                orderDTO: {take: 30, skip: 0, customerId: props.customerId}
              });
            } else {
              return OrderAction.loadInit({orderDTO: {take: 30, skip: 0}});
            }
          }),
          catchError((err) => throwError(err))
        )
      )
    )
  );

  cancelOrder$ = createEffect(() =>
    this.action.pipe(
      ofType(OrderAction.cancelOrder),
      switchMap((prop) =>
        this.orderService.cancelOrder(prop.orderId)),
      map((_) => {
          this.snackBar.open('Huỷ đơn hàng thành công', '', {duration: 1500})
          return OrderAction.loadInit({orderDTO: {take: 30, skip: 0}})
        }
      ),
      catchError((err) => throwError(err))
    ))

  constructor(
    private snackBar: MatSnackBar,
    private readonly action: Actions,
    private readonly orderService: OrderService,
    private readonly store: Store,
    private readonly router: Router
  ) {
  }
}
