import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, concatMap, switchMap, tap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
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
import { HideDebtStatusEnum, OrderStatusEnum } from '../../order/enums';

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
          if (props.isSet || res.total === 0) {
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
          this.customerStore.update(state => ({
            ...state,
            loading: false,
            error: null
          }));
          const abc = [OrderStatusEnum.DELIVERING, OrderStatusEnum.DELIVERED, OrderStatusEnum.CANCELLED]
            .map(status => {
              return this.orderService.pagination({
                search: {
                  take: PaginationDto.take,
                  skip: PaginationDto.skip,
                  customerId: props.id,
                  status: status,
                  hiddenDebt: HideDebtStatusEnum.ALL
                }
              });
            });

          return combineLatest(abc).subscribe((res) => {
            res.map((item, i) => {
              let keyUpdate = '';
              let keyLoading = '';
              let keyTotal = '';
              let keyRemain = '';

              if (i === 0) {
                keyUpdate = 'delivering';
                keyLoading = 'deliveringLoading';
                keyTotal = 'deliveringTotal';
                keyRemain = 'deliveringRemain';
              } else if (i === 1) {
                keyUpdate = 'delivered';
                keyLoading = 'deliveredLoading';
                keyTotal = 'deliveredTotal';
                keyRemain = 'deliveredRemain';
              } else {
                keyUpdate = 'cancelled';
                keyLoading = 'cancelledLoading';
                keyTotal = 'cancelledTotal';
                keyRemain = 'cancelledRemain';
              }

              this.customerStore.update(props.id, { [keyUpdate]: res[i].data });
              const count = res[i].data?.length || 0;
              this.customerStore.update((state) => ({
                ...state,
                [keyLoading]: false,
                [keyTotal]: res[i].total,
                [keyRemain]: res[i].total - count,
                error: null
              }));
            });
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
          this.message.success('Xo?? kh??ch h??ng th??nh c??ng');
          return this.customerStore.remove(props.id);
        }),
        catchError((err) => {
          this.action$.dispatch(CustomerActions.error(err));
          return of();
        })
      );
    })
  );

  @Effect({ dispatch: false })
  loadOrder$ = this.action$.pipe(
    ofType(CustomerActions.loadOrder),
    concatMap((props) => {
      const status = props.orderType === 'delivered'
        ? OrderStatusEnum.DELIVERED
        : props.orderType === 'delivering'
          ? OrderStatusEnum.DELIVERING
          : OrderStatusEnum.CANCELLED;

      const customer = this.customerQuery.getEntity(props.search.customerId);
      return this.orderService.pagination({
        search: Object.assign(
          {},
          props.search,
          {
            status,
            take: PaginationDto.take,
            skip: props.isSet
              ? PaginationDto.skip
              : props.orderType === 'delivered'
                ? (customer?.delivered?.length || 0)
                : props.orderType === 'delivering'
                  ? (customer?.delivering?.length || 0)
                  : (customer?.cancelled?.length || 0)
          }
        )
      }).pipe(
        tap((res) => {
          if (props.isSet) {
            this.customerStore.update(props.search.customerId, { [props.orderType]: res.data });
          } else {
            this.customerStore.update(props.search.customerId, ({ delivering, delivered, cancelled }) => ({
              delivering: props.orderType === 'delivering' ? arrayAdd(delivering, res.data) : delivering,
              delivered: props.orderType === 'delivered' ? arrayAdd(delivered, res.data) : delivered,
              cancelled: props.orderType === 'cancelled' ? arrayAdd(cancelled, res.data) : cancelled
            }));
          }
          this.customerStore.update((state) => {
            const customer = this.customerQuery.getEntity(props.search.customerId);
            return {
              ...state,
              deliveringLoading: props.orderType === 'delivering' ? false : state.deliveringLoading,
              deliveredLoading: props.orderType === 'delivered' ? false : state.deliveredLoading,
              cancelledLoading: props.orderType === 'cancelled' ? false : state.cancelledLoading,
              deliveringTotal: props.orderType === 'delivering' ? res.total : state.deliveringTotal,
              deliveredTotal: props.orderType === 'delivered' ? res.total : state.deliveredTotal,
              cancelledTotal: props.orderType === 'cancelled' ? res.total : state.cancelledTotal,
              deliveringRemain: props.orderType === 'delivering' ? res.total - (customer?.delivering?.length || 0) : state.deliveringRemain,
              deliveredRemain: props.orderType === 'delivered' ? res.total - (customer?.delivered?.length || 0) : state.deliveredRemain,
              cancelledRemain: props.orderType === 'cancelled' ? res.total - (customer?.cancelled?.length || 0) : state.cancelledRemain,
              error: null
            };
          });
        }),
        catchError((err) => of(CustomerActions.error(err)))
      );
    })
  );

  @Effect()
  requesting$ = this.action$.pipe(
    ofType(
      CustomerActions.addOne,
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
  requestingOrder$ = this.action$.pipe(
    ofType(CustomerActions.loadOrder),
    tap((res) => {
      this.customerStore.update((state) => {
        if (res.orderType === 'delivering') {
          return {
            ...state,
            deliveringLoading: true,
            error: null
          };
        }
        return {
          ...state,
          deliveredLoading: true,
          error: null
        };
      });
    })
  );

  @Effect()
  requestingLoadOne$ = this.action$.pipe(
    ofType(CustomerActions.loadOne),
    tap((res) => {
      this.customerStore.update((state) => {
        return {
          ...state,
          loading: true,
          deliveringLoading: true,
          deliveredLoading: true,
          error: null
        };
      });
    })
  );

  @Effect()
  loadOrderSuccess$ = this.action$.pipe(
    ofType(CustomerActions.loadOrderSuccess),
    tap((res) => {
      return this.customerStore.update((state) => {
        if (res.typeOrder === 'delivering') {
          return {
            ...state,
            deliveringLoading: false,
            deliveringTotal: res.total,
            deliveringRemain: res.total - (res.customer.delivering?.length || 0),
            error: null
          };
        }
        return {
          ...state,
          deliveringLoading: false,
          deliveringTotal: res.total,
          deliveringRemain: res.total - (state.customer.delivered?.length || 0),
          error: null
        };
      });
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
