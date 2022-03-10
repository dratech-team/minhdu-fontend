import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {ProviderStore} from './provider.store';
import {ProviderService} from '../services/provider.service';
import {ProviderActions} from './provider.action';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {throwError} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable()
export class ProviderEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: ProviderService,
    private readonly message: NzMessageService,
    private readonly providerStore: ProviderStore
  ) {
  }

  @Effect({dispatch: false})
  loadProviders$ = this.action$.pipe(
    ofType(ProviderActions.loadAll),
    switchMap((props) => {
      return this.service.pagination(props.param).pipe(
        tap((res) => {
          if (res.data.length) {
            this.message.info('Đã lấy hết nhà cung cấp')
          }
          this.providerStore.update(state => ({
            ...state, total: res.total, loading: true
          }))
          if (props.isScroll) {
            this.providerStore.add(res.data);
          } else {
            this.providerStore.set(res.data);
          }
        }),
      );
    }),
    catchError(err => throwError(err))
  );

  @Effect()
  addProvider$ = this.action$.pipe(
    ofType(ProviderActions.addOne),
    switchMap((provider) => {
      this.providerStore.update(state => ({
        ...state, added: false
      }))
      return this.service.addOne(provider).pipe(
        map((provider) => {
          this.message.success('Thêm nhà cung cấp thành công')
          this.providerStore.update(state => ({
            ...state, added: true
          }))
          return this.providerStore.add(provider)
        }),
      );
    }),
    catchError(err => throwError(err))
  );

  @Effect()
  updateProvider$ = this.action$.pipe(
    ofType(ProviderActions.update),
    switchMap((props) => {
      this.providerStore.update(state => ({
        ...state, added: false
      }))
      return this.service.update(props.id, props.body).pipe(
        map((provider) => {
          this.message.success('Cập nhật nhà cung cấp thành công')
          this.providerStore.update(state => ({
            ...state, added: true
          }))
          return this.providerStore.update(provider.id, provider)
        }),
      );
    }),
    catchError(err => throwError(err))
  );

  @Effect()
  removeProvider$ = this.action$.pipe(
    ofType(ProviderActions.remove),
    switchMap((props) => {
      return this.service.delete(props.id).pipe(
        map((provider) => {
          this.message.success('Xoá nhà cung cấp thành công')
          return this.providerStore.remove(props.id)
        }),
      );
    }),
    catchError(err => throwError(err))
  );

}
