import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {of, throwError} from 'rxjs';
import {IoiReceiptActions} from './ioi-receipt.actions';
import {IoiReceiptStore} from './ioi-receipt.store';
import {IoiReceiptService} from '../services';
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable()
export class IoiReceiptEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: IoiReceiptService,
    private readonly ioiReceiptStore: IoiReceiptStore,
    private readonly message: NzMessageService
  ) {
  }

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(IoiReceiptActions.addOne),
    switchMap(props => {
      this.ioiReceiptStore.update(state => ({
        ...state, loading: true
      }))
      if (!props.body?.branchId) {
        return this.service.addOne(Object.assign(props, {branch: null}));
      }
      return this.service.addOne(props);
    }),
    tap(res => {
      this.ioiReceiptStore.update(state => ({
        ...state, loading: false
      }))
      this.ioiReceiptStore.upsert(res.id, res);
    }),
    catchError((err) => {
      this.ioiReceiptStore.update(state => ({
        ...state, loading: undefined
      }))
      return of(IoiReceiptActions.error(err))
    })
  );

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(IoiReceiptActions.loadAll),
    switchMap((props) => {
      this.ioiReceiptStore.update(state => ({
        ...state,
        loading: true
      }))
      return this.service.pagination(props.params).pipe(
        tap((res) => {
          this.ioiReceiptStore.update(state => ({
            ...state,
            loading: false
          }))
          if (res.data.length === 0) {
            this.message.warning('Đã lấy hết hàng hoá')
          }
          if (props.isPagination) {
            this.ioiReceiptStore.add(res.data);
          } else {
            this.ioiReceiptStore.set(res.data);
          }
        }),
      );
    }),
    catchError((err) => {
      this.ioiReceiptStore.update(state => ({
        ...state, loading: undefined
      }))
      return of(IoiReceiptActions.error(err))
    })
  );

  @Effect()
  getOne$ = this.action$.pipe(
    ofType(IoiReceiptActions.getOne),
    switchMap(props => {
      return this.service.getOne(props.id);
    }),
    tap(res => {
      this.ioiReceiptStore.update(res?.id, res);
    }),
    catchError((err) => {
      return of(IoiReceiptActions.error(err))
    })
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(IoiReceiptActions.update),
    switchMap(props => {
      this.ioiReceiptStore.update(state => ({
        ...state, loading: true
      }))
      return this.service.update(props);
    }),
    tap(res => {
      this.ioiReceiptStore.update(state => ({
        ...state, loading: false
      }))
      this.ioiReceiptStore.update(res?.id, res);
    }),
    catchError((err) => {
      this.ioiReceiptStore.update(state => ({
        ...state, loading: undefined
      }))
      return of(IoiReceiptActions.error(err))
    })
  );

  @Effect()
  delete$ = this.action$.pipe(
    ofType(IoiReceiptActions.remove),
    switchMap(props => {
      this.ioiReceiptStore.update(state => ({
        ...state, loading: true
      }))
      return this.service.delete(props.id).pipe(
        tap(_ => {
          this.ioiReceiptStore.update(state => ({
            ...state, loading: false
          }))
          this.ioiReceiptStore.remove(props?.id);
        }),
      );
    }),
    catchError(err => {
      this.ioiReceiptStore.update(state => ({
        ...state, loading: undefined
      }))
      return of(IoiReceiptActions.error(err))
    })
  );
}
