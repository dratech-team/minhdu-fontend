import {Injectable, OnInit} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {IoiReceiptActions} from './ioi-receipt.actions';
import {IoiReceiptStore} from './ioi-receipt.store';
import {IoiReceiptService} from '../services/ioi-receipt.service';
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable()
export class IoiReceiptEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: IoiReceiptService,
    private readonly productStore: IoiReceiptStore,
    private readonly message: NzMessageService
  ) {
  }

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(IoiReceiptActions.addOne),
    switchMap(props => {
      this.productStore.update(state => ({
        ...state, added: true
      }))
      if (!props.body?.branchId) {
        return this.service.addOne(Object.assign(props, {branch: null}));
      }
      return this.service.addOne(props);
    }),
    tap(res => {
      this.productStore.update(state => ({
        ...state, added: false
      }))
      this.productStore.upsert(res.id, res);
    })
  );

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(IoiReceiptActions.loadAll),
    switchMap((props) => {
      this.productStore.update(state => ({...state, loading: true}))
      return this.service.pagination(props.params).pipe(
        tap((res) => {
          this.productStore.update(state => ({...state, loading: false}))
          if (res.data.length === 0) {
            this.message.warning('Đã lấy hết hàng hoá')
          }
          if (props.isPagination) {
            this.productStore.add(res.data);
          } else {
            this.productStore.set(res.data);
          }
        }),
      );
    }),
    catchError((err) => throwError(err))
  );

  @Effect()
  getOne$ = this.action$.pipe(
    ofType(IoiReceiptActions.getOne),
    switchMap(props => {
      return this.service.getOne(props.id);
    }),
    tap(res => {
      this.productStore.update(res?.id, res);
    }),
    catchError(err => {
      return throwError(err)
    })
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(IoiReceiptActions.update),
    switchMap(props => {
      this.productStore.update(state => ({
        ...state, added: false
      }))
      return this.service.update(props);
    }),
    tap(res => {
      this.productStore.update(state => ({
        ...state, added: true
      }))
      this.productStore.update(res?.id, res);
    }),
    catchError(err => {
      return throwError(err)
    })
  );

  @Effect()
  delete$ = this.action$.pipe(
    ofType(IoiReceiptActions.remove),
    switchMap(props => {
      return this.service.delete(props.id).pipe(
        tap(_ => {
          this.productStore.remove(props?.id);
        }),
      );
    }),
    catchError(err => {
      return throwError(err)
    })
  );
}
