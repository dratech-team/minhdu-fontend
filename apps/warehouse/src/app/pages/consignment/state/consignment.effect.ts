import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConsignmentActions } from './consignment.actions';
import { ConsignmentStore } from './consignment.store';
import { ConsignmentService } from '../services';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class ConsignmentEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: ConsignmentService,
    private readonly consignmentStore: ConsignmentStore,
    private readonly message: NzMessageService
  ) {}

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(ConsignmentActions.addOne),
    switchMap((props) => {
      this.consignmentStore.update((state) => ({
        ...state,
        loading: false,
      }));
      return this.service.addOne(props).pipe(
        tap((res) => {
          this.consignmentStore.update((state) => ({
            ...state,
            loading: true,
          }));
          this.consignmentStore.add(
            Object.assign(res, { amount: props.body.amount })
          );
        }),
        catchError((err) => {
          this.consignmentStore.update((state) => ({
            ...state,
            loading: undefined,
          }));
          return of(ConsignmentActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(ConsignmentActions.loadAll),
    switchMap((props) => {
      this.consignmentStore.update((state) => ({
        ...state,
        loading: true,
      }));
      return this.service.pagination(props).pipe(
        tap((res) => {
          this.consignmentStore.update((state) => ({
            ...state,
            loading: false,
          }));
          if (res.data.length === 0) {
            this.message.warning('Đã lấy hết hàng hoá');
          }
          if (props.isPaginate) {
            this.consignmentStore.add(res.data);
          } else {
            this.consignmentStore.set(res.data);
          }
        }),
        catchError((err) => {
          this.consignmentStore.update((state) => ({
            ...state,
            loading: undefined,
          }));
          return of(ConsignmentActions.error(err));
        })
      );
    })
  );

  @Effect()
  getOne$ = this.action$.pipe(
    ofType(ConsignmentActions.getOne),
    switchMap((props) => {
      return this.service.getOne(props.id).pipe(
        tap((res) => {
          this.consignmentStore.update(res?.id, res);
        }),
        catchError((err) => {
          return of(ConsignmentActions.error(err));
        })
      );
    })
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(ConsignmentActions.update),
    switchMap((props) => {
      this.consignmentStore.update((state) => ({
        ...state,
        loading: false,
      }));
      return this.service.update(props).pipe(
        tap((res) => {
          this.consignmentStore.update((state) => ({
            ...state,
            loading: true,
          }));
          this.consignmentStore.update(res?.id, res);
        }),
        catchError((err) => {
          this.consignmentStore.update((state) => ({
            ...state,
            loading: undefined,
          }));
          return of(ConsignmentActions.error(err));
        })
      );
    })
  );

  @Effect()
  delete$ = this.action$.pipe(
    ofType(ConsignmentActions.remove),
    switchMap((props) => {
      this.consignmentStore.update((state) => ({
        ...state,
        loading: true,
      }));
      return this.service.delete(props.id).pipe(
        tap((_) => {
          this.consignmentStore.update((state) => ({
            ...state,
            loading: false,
          }));
          this.consignmentStore.remove(props?.id);
        }),
        catchError((err) => {
          this.consignmentStore.update((state) => ({
            ...state,
            loading: undefined,
          }));
          return of(ConsignmentActions.error(err));
        })
      );
    })
  );
}
