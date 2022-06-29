import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CustomerActions } from './customer.actions';
import { CustomerService } from '../service';
import { CustomerQuery } from './customer.query';
import { CustomerStore } from './customer.store';
import { OrderService } from '../../order/service';
import { AddCustomerDto, SearchCustomerDto } from '../dto';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class CustomerEffect {
  constructor(
    private readonly action$: Actions,
    private readonly customerStore: CustomerStore,
    private readonly customerQuery: CustomerQuery,
    private readonly customerService: CustomerService,
    private readonly message: NzMessageService,
    private readonly snackbar: MatSnackBar,
    private readonly orderService: OrderService
  ) {}

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(CustomerActions.loadAll),
    switchMap((props: SearchCustomerDto) => {
      this.customerStore.update((state) => ({
        ...state,
        loading: true,
      }));
      const params = Object.assign(
        props.search,
        props.search?.orderType
          ? { orderType: props.search.orderType === 'ascend' ? 'asc' : 'desc' }
          : {}
      );
      return this.customerService.pagination(params).pipe(
        map((response) => {
          this.customerStore.update((state) => ({
            ...state,
            loading: false,
            total: response.total,
          }));
          if (response.data.length === 0) {
            this.message.warning('Đã lấy hết khách hàng');
          } else {
            this.message.success('Tải danh sách khách hàng thành công!!');
          }
          if (props.isPaginate) {
            this.customerStore.add(response.data);
          } else {
            this.customerStore.set(response.data);
          }
        }),
        catchError((err) => {
          this.customerStore.update((state) => ({
            ...state,
            loading: undefined,
          }));
          return of(CustomerActions.error(err));
        })
      );
    })
  );

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(CustomerActions.addOne),
    switchMap((props: AddCustomerDto) => {
      this.customerStore.update((state) => ({
        ...state,
        loading: true,
        total: state.total + 1,
      }));
      return this.customerService.addOne(props).pipe(
        tap((res) => {
          this.message.success('Thêm khác hành thành công');
          this.customerStore.update((state) => ({
            ...state,
            loading: false,
          }));
          this.customerStore.add(res);
        }),
        catchError((err) => {
          this.customerStore.update((state) => ({
            ...state,
            loading: undefined,
          }));
          return of(CustomerActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadOne$ = this.action$.pipe(
    ofType(CustomerActions.loadOne),
    switchMap((props) =>
      this.customerService.getOne(props.id).pipe(
        map((customer) => this.customerStore.upsert(customer.id, customer)),
        catchError((err) => of(CustomerActions.error(err)))
      )
    )
  );

  @Effect()
  updateOne$ = this.action$.pipe(
    ofType(CustomerActions.update),
    switchMap((props) => {
      this.customerStore.update((state) => ({
        ...state,
        loading: true,
      }));
      return this.customerService.update(props).pipe(
        tap((response) => {
          this.customerStore.update((state) => ({
            ...state,
            loading: false,
          }));
          this.customerStore.update(response.id, response);
        }),
        catchError((err) => {
          this.customerStore.update((state) => ({
            ...state,
            loading: undefined,
          }));
          return of(CustomerActions.error(err));
        })
      );
    })
  );

  @Effect()
  removeOne = this.action$.pipe(
    ofType(CustomerActions.remove),
    switchMap((props) => {
      this.customerStore.update((state) => ({
        ...state,
        loading: true,
      }));
      return this.customerService.delete(props.id).pipe(
        map(() => {
          this.customerStore.update((state) => ({
            ...state,
            total: state.total - 1,
            loading: false,
          }));
          this.message.success('Xoá khách hàng thành công');
          return this.customerStore.remove(props.id);
        }),
        catchError((err) => {
          this.customerStore.update((state) => ({
            ...state,
            loading: undefined,
          }));
          return of(CustomerActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadOrder$ = this.action$.pipe(
    ofType(CustomerActions.loadOrder),
    concatMap((props) => {
      this.customerStore.update((state) => ({
        ...state,
        deliveringLoading:
          props?.typeOrder === 'delivering' ? true : state.deliveringLoading,
        deliveredLoading:
          props?.typeOrder === 'delivered' ? true : state.deliveredLoading,
      }));
      return this.orderService
        .pagination(
          Object.assign(props.params, {
            status: props.typeOrder === 'delivered' ? 1 : 0,
          })
        )
        .pipe(
          tap((res) => {
            if (res.data.length === 0) {
              this.message.warning('Đã lấy hết đơn hàng');
            }
            if (props?.isPagination) {
              if (props.typeOrder === 'delivering') {
                this.customerStore.update(props.params.customerId, {
                  delivering: this.customerQuery
                    .getEntity(props.params.customerId)
                    ?.delivering.concat(res.data),
                });
              } else {
                this.customerStore.update(props.params.customerId, {
                  delivered: this.customerQuery
                    .getEntity(props.params.customerId)
                    ?.delivered.concat(res.data),
                });
              }
            } else {
              if (props.typeOrder === 'delivering') {
                this.customerStore.update(props.params.customerId, {
                  delivering: res.data,
                });
              } else {
                this.customerStore.update(props.params.customerId, {
                  delivered: res.data,
                });
              }
            }
            this.customerStore.update((state) => ({
              ...state,
              deliveringLoading: false,
              deliveredLoading: false,
            }));
          }),
          catchError((err) => of(CustomerActions.error(err)))
        );
    })
  );
}
