import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {SupplierStore} from './supplier.store';
import {SupplierService} from '../services/supplier.service';
import {SupplierActions} from './supplier.action';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable()
export class SupplierEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: SupplierService,
    private readonly message: NzMessageService,
    private readonly supplierStore: SupplierStore
  ) {
  }

  @Effect({dispatch: false})
  loadSupplier$ = this.action$.pipe(
    ofType(SupplierActions.loadAll),
    switchMap((props) => {
      this.supplierStore.update(state => ({
        ...state,
        loading: true
      }))
      return this.service.pagination(props).pipe(
        tap((res) => {
          if (res.data.length === 0) {
            this.message.info('Đã lấy hết nhà cung cấp')
          }
          this.supplierStore.update(state => ({
            ...state,
            total: res.total,
            loading: false
          }))
          if (props.isPaginate) {
            this.supplierStore.add(res.data);
          } else {
            this.supplierStore.set(res.data);
          }
        }),
        catchError(err => {
          this.supplierStore.update(state => ({
            ...state,
            loading: undefined
          }))
          return of(SupplierActions.error(err))
        })
      );
    }),
  );

  @Effect()
  addSupplier$ = this.action$.pipe(
    ofType(SupplierActions.addOne),
    switchMap((provider) => {
      this.supplierStore.update(state => ({
        ...state,
        loading: true
      }))
      return this.service.addOne(provider).pipe(
        map((provider) => {
          this.message.success('Thêm nhà cung cấp thành công')
          this.supplierStore.update(state => ({
            ...state,
            loading: false
          }))
          return this.supplierStore.add(provider)
        }),
        catchError(err => {
          this.supplierStore.update(state => ({
            ...state,
            loading: undefined
          }))
          return of(SupplierActions.error(err))
        })
      );
    }),
  );

  @Effect()
  updateSupplier$ = this.action$.pipe(
    ofType(SupplierActions.update),
    switchMap((props) => {
      this.supplierStore.update(state => ({
        ...state,
        loading: true
      }))
      return this.service.update(props).pipe(
        map((provider) => {
          this.message.success('Cập nhật nhà cung cấp thành công')
          this.supplierStore.update(state => ({
            ...state,
            loading: false
          }))
          return this.supplierStore.update(provider.id, provider)
        }),
        catchError(err => {
          this.supplierStore.update(state => ({
            ...state,
            loading: undefined
          }))
          return of(SupplierActions.error(err))
        })
      );
    }),
  );

  @Effect()
  removeSupplier$ = this.action$.pipe(
    ofType(SupplierActions.remove),
    switchMap((props) => {
      this.supplierStore.update(state => ({
        ...state,
        loading: true
      }))
      return this.service.delete(props.id).pipe(
        map((provider) => {
          this.supplierStore.update(state => ({
            ...state,
            loading: false
          }))
          this.message.success('Xoá nhà cung cấp thành công')
          return this.supplierStore.remove(props.id)
        }),
        catchError(err => {
          this.supplierStore.update(state => ({
            ...state,
            loading: undefined
          }))
          return of(SupplierActions.error(err))
        })
      );
    }),
  );

}
