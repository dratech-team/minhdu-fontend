import {Injectable, OnInit} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {of, throwError} from 'rxjs';
import {ProductActions} from './product.actions';
import {ProductStore} from './product.store';
import {ProductService} from '../services/product.service';
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable()
export class ProductEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: ProductService,
    private readonly productStore: ProductStore,
    private readonly message: NzMessageService
  ) {
  }

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(ProductActions.addOne),
    switchMap(props => {
      this.productStore.update(state => ({
        ...state, added: false
      }))
      if (props.body?.branch?.name === 'Kho tổng') {
        return this.service.addOne(Object.assign(props, {branch: null}));
      }
      return this.service.addOne(props).pipe(
        tap(res => {
          this.productStore.update(state => ({
            ...state, added: true
          }))
          this.productStore.upsert(res.id, res);
        }),
        catchError(err => {
          this.productStore.update(state => ({
            ...state, added: null
          }))
          return of(ProductActions.error(err))
        })
      );
    }),

  );

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(ProductActions.loadAll),
    switchMap((props) => {
      this.productStore.update(state => ({...state, loading: true}))
      return this.service.pagination(props).pipe(
        tap((res) => {
          this.productStore.update(state => ({...state, loading: false}))
          if (res.data.length === 0) {
            this.message.warning('Đã lấy hết hàng hoá')
          }
          if (props.isPaginate) {
            this.productStore.add(res.data);
          } else {
            this.productStore.set(res.data);
          }
        }),
        catchError((err) => {
          this.productStore.update(state => ({...state, loading: false}))
          return of(ProductActions.error(err))
        })
      );
    }),
  );

  @Effect()
  getOne$ = this.action$.pipe(
    ofType(ProductActions.getOne),
    switchMap(props => {
      return this.service.getOne(props.id).pipe(
        tap(res => {
          this.productStore.update(res?.id, res);
        }),
        catchError(err => {
          return of(ProductActions.error(err))
        })
      );
    }),
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(ProductActions.update),
    switchMap(props => {
      this.productStore.update(state => ({
        ...state, added: false
      }))
      return this.service.update(props).pipe(
        tap(res => {
          this.productStore.update(state => ({
            ...state, added: true
          }))
          this.productStore.update(res?.id, res);
        }),
        catchError(err => {
          this.productStore.update(state => ({
            ...state, added: null
          }))
          return of(ProductActions.error(err))
        })
      );
    }),
  );

  @Effect()
  delete$ = this.action$.pipe(
    ofType(ProductActions.remove),
    switchMap(props => {
      return this.service.delete(props.id).pipe(
        tap(_ => {
          this.productStore.remove(props?.id);
        }),
        catchError(err => {
          return of(ProductActions.error(err))
        })
      );
    }),
  );
}
