import {Injectable, OnInit} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {StockActions} from './stock.actions';
import {StockStore} from './stock.store';
import {StockService} from '../services/stock.service';
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable()
export class StockEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: StockService,
    private readonly productStore: StockStore,
    private readonly message: NzMessageService
  ) {
  }

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(StockActions.addOne),
    switchMap(props => {
      this.productStore.update(state => ({
        ...state, added: true
      }))
      if (props.body?.branch?.name === 'Kho tổng') {
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
    ofType(StockActions.loadAll),
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
    ofType(StockActions.getOne),
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
    ofType(StockActions.update),
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
    ofType(StockActions.remove),
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
