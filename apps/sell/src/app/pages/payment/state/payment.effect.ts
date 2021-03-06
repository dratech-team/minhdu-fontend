import { Injectable } from '@angular/core';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PaymentActions } from './payment.action';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { PaymentService } from '../services/payment.Service';
import { PaymentQuery } from './payment.query';
import { PaymentStore } from './payment.store';
import { RemovePaymentDto, SearchPaymentDto, UpdatePaymentDto } from '../dto';
import { PaginationDto } from '@minhdu-fontend/constants';

@Injectable()
export class PaymentEffect {
  constructor(
    private readonly action$: Actions,
    private readonly message: NzMessageService,
    private readonly paymentService: PaymentService,
    private readonly paymentQuery: PaymentQuery,
    private readonly paymentStore: PaymentStore
  ) {
  }

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(PaymentActions.addOne),
    switchMap((props) => {
      this.paymentStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.paymentService.addOne(props).pipe(
        tap((res) => {
          this.message.success('Thanh toán thành công');
          this.paymentStore.update((state) => ({
            ...state,
            loading: false
          }));
          this.paymentStore.add(res);
        }),
        catchError((err) => {
          this.paymentStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(PaymentActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(PaymentActions.loadAll),
    switchMap((props: SearchPaymentDto) => {
      this.paymentStore.update((state) => ({
        ...state,
        loading: true
      }));
      Object.assign(props.search, {
        take: PaginationDto.take,
        skip: !props.isSet
          ? this.paymentQuery.getCount()
          : PaginationDto.skip
      });
      return this.paymentService.pagination(props).pipe(
        map((response) => {
          this.paymentStore.update((state) => ({
            ...state,
            loading: false,
            total: response.total
          }));
          if (props.isSet) {
            this.paymentStore.set(response.data);
          } else {
            this.paymentStore.add(response.data);
          }
        }),
        catchError((err) => {
          this.paymentStore.update((state) => ({
            ...state,
            loading: false
          }));
          return of(PaymentActions.error(err));
        })
      );
    })
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(PaymentActions.update),
    switchMap((props: UpdatePaymentDto) => {
      this.paymentStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.paymentService.update(props).pipe(
        tap((res) => {
          this.message.success('Cập nhật thanh toán thành công');
          this.paymentStore.update((state) => ({
            ...state,
            loading: false
          }));
          this.paymentStore.update(res.id, res);
        }),
        catchError((err) => {
          this.paymentStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(PaymentActions.error(err));
        })
      );
    })
  );

  @Effect()
  remove$ = this.action$.pipe(
    ofType(PaymentActions.remove),
    switchMap((props: RemovePaymentDto) => {
      this.paymentStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.paymentService.delete(props.id).pipe(
        tap((_) => {
          this.message.success('Xoá lịch sử thành toán thành công');
          this.paymentStore.update((state) => ({
            ...state,
            loading: false
          }));
          this.paymentStore.remove(props.id);
        }),
        catchError((err) => {
          this.paymentStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(PaymentActions.error(err));
        })
      );
    })
  );
}
