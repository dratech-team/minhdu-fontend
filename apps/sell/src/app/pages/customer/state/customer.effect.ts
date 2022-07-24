import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, concatMap, switchMap, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CustomerActions } from './customer.actions';
import { CustomerService } from '../service';
import { CustomerQuery } from './customer.query';
import { CustomerStore } from './customer.store';
import { OrderService } from '../../order/service';
import { AddCustomerDto, SearchCustomerDto } from '../dto';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaginationDto } from '@minhdu-fontend/constants';
import { arrayAdd } from '@datorama/akita';
import { OrderStatusEnum } from '../../order/enums';

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
  ) {
  }

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(CustomerActions.loadAll),
    switchMap((props: SearchCustomerDto) => {
      const params = Object.assign(
        {},
        props.search,
        props.search?.orderType
          ? { orderType: props.search.orderType === 'ascend' ? 'asc' : 'desc' }
          : {},
        {
          take: PaginationDto.take,
          skip: props.isSet ? PaginationDto.skip : this.customerQuery.getCount()
        }
      );
      return this.customerService.pagination(params).pipe(
        tap((res) => {
          if (props.isSet) {
            this.customerStore.set(res.data);
          } else {
            this.customerStore.add(res.data);
          }
          this.customerStore.update(state => ({
            ...state,
            loading: false,
            total: res.total,
            remain: res.total - this.customerQuery.getCount()
          }));
        }),
        catchError((err) => {
          this.action$.dispatch(CustomerActions.error(err));
          return of();
        })
      );
    })
  );

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(CustomerActions.addOne),
    switchMap((props: AddCustomerDto) => {
      return this.customerService.addOne(props).pipe(
        tap((res) => {
          this.customerStore.update((state) => ({
            ...state,
            loading: false,
            total: state.total + 1
          }));
          this.customerStore.add(res);
        }),
        catchError((err) => {
          this.action$.dispatch(CustomerActions.error(err));
          return of();
        })
      );
    })
  );

  @Effect()
  loadOne$ = this.action$.pipe(
    ofType(CustomerActions.loadOne),
    switchMap((props) =>
      this.customerService.getOne(props.id).pipe(
        tap((customer) => {
          this.customerStore.upsert(customer.id, customer);
          this.customerStore.update(state => ({ ...state, loading: false, error: null }));

          this.orderService.pagination({ customerId: props.id, status: OrderStatusEnum.DELIVERED })
            .pipe(take(1))
            .subscribe(res => {
              this.customerStore.update(props.id, { delivered: res.data });
            });

          this.orderService.pagination({ customerId: props.id, status: OrderStatusEnum.DELIVERING })
            .pipe(take(1))
            .subscribe(res => {
              this.customerStore.update(props.id, { delivering: res.data });
            });
        }),
        catchError((err) => {
          this.action$.dispatch(CustomerActions.error(err));
          return of();
        })
      )
    )
  );

  @Effect()
  updateOne$ = this.action$.pipe(
    ofType(CustomerActions.update),
    switchMap((props) => {
      return this.customerService.update(props).pipe(
        tap((response) => {
          this.customerStore.update((state) => ({
            ...state,
            loading: false
          }));
          this.customerStore.update(response.id, response);
        }),
        catchError((err) => {
          this.action$.dispatch(CustomerActions.error(err));
          return of();
        })
      );
    })
  );

  @Effect()
  removeOne = this.action$.pipe(
    ofType(CustomerActions.remove),
    switchMap((props) => {
      return this.customerService.delete(props.id).pipe(
        tap(() => {
          this.customerStore.update((state) => ({
            ...state,
            total: state.total - 1,
            loading: false,
            error: null
          }));
          this.message.success('Xoá khách hàng thành công');
          return this.customerStore.remove(props.id);
        }),
        catchError((err) => {
          this.action$.dispatch(CustomerActions.error(err));
          return of();
        })
      );
    })
  );

  @Effect()
  loadOrder$ = this.action$.pipe(
    ofType(CustomerActions.loadOrder),
    concatMap((props) => {
      const status = props.typeOrder === 'delivered' ? OrderStatusEnum.DELIVERED : OrderStatusEnum.DELIVERING;
      return this.orderService.pagination(Object.assign(props.search, { status }))
        .pipe(
          tap((res) => {
            if (props.isSet) {
              this.customerStore.update(props.search.customerId, { [props.typeOrder]: res.data });
            } else {
              this.customerStore.update(props.search.customerId, ({ delivering, delivered }) => ({
                delivering: props.typeOrder === 'delivering' ? arrayAdd(delivered, res.data) : delivered,
                delivered: props.typeOrder === 'delivered' ? arrayAdd(delivered, res.data) : delivered
              }));
            }
          }),
          catchError((err) => of(CustomerActions.error(err)))
        );
    })
  );

  @Effect()
  requesting$ = this.action$.pipe(
    ofType(
      CustomerActions.addOne,
      CustomerActions.loadOne,
      CustomerActions.loadAll,
      CustomerActions.update,
      CustomerActions.remove
    ),
    tap(() => {
      this.customerStore.update((state) => ({
        ...state,
        loading: true,
        error: null
      }));
    })
  );

  @Effect()
  error$ = this.action$.pipe(
    ofType(CustomerActions.error),
    tap((res) => {
      this.customerStore.update((state) => ({
        ...state,
        loading: null,
        error: res.error
      }));
    })
  );
}
