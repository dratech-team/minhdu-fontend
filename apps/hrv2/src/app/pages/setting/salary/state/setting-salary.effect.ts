import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {SettingSalaryStore} from './setting-salary.store';
import {NzMessageService} from "ng-zorro-antd/message";
import {SalarySettingService} from "../services";
import {SettingSalaryActions} from "./setting-salary.action";

@Injectable()
export class SettingSalaryEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: SalarySettingService,
    private readonly settingSalaryStore: SettingSalaryStore,
    private readonly message: NzMessageService
  ) {
  }

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(SettingSalaryActions.addOne),
    switchMap(props => {
      this.settingSalaryStore.update(state => ({
        ...state, added: false
      }))
      return this.service.addOne(props).pipe(
        tap(res => {
          this.settingSalaryStore.update(state => ({
            ...state, added: true
          }))
          this.settingSalaryStore.upsert(res.id, res);
        }),
        catchError(err => {
          this.settingSalaryStore.update(state => ({
            ...state, added: null
          }))
          return of(SettingSalaryActions.error(err))
        })
      );
    }),
  );

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(SettingSalaryActions.loadAll),
    switchMap((props) => {
      this.settingSalaryStore.update(state => ({...state, loading: true}))
      return this.service.pagination(props).pipe(
        tap((res) => {
          this.settingSalaryStore.update(state => ({...state, loading: false}))
          if (res.data.length === 0) {
            this.message.warning('Đã lấy hết bảng mẫu')
          }
          if (props.isPaginate) {
            this.settingSalaryStore.add(res.data);
          } else {
            this.settingSalaryStore.set(res.data);
          }
        }),
        catchError((err) => {
          this.settingSalaryStore.update(state => ({...state, loading: false}))
          return of(SettingSalaryActions.error(err))
        })
      );
    }),
  );

  @Effect()
  getOne$ = this.action$.pipe(
    ofType(SettingSalaryActions.getOne),
    switchMap(props => {
      return this.service.getOne(props.id).pipe(
        tap(res => {
          this.settingSalaryStore.update(res?.id, res);
        }),
        catchError(err => {
          return of(SettingSalaryActions.error(err))
        })
      );
    }),
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(SettingSalaryActions.update),
    switchMap(props => {
      this.settingSalaryStore.update(state => ({
        ...state, added: false
      }))
      return this.service.update(props).pipe(
        tap(res => {
          this.settingSalaryStore.update(state => ({
            ...state, added: true
          }))
          this.settingSalaryStore.update(res?.id, res);
        }),
        catchError(err => {
          this.settingSalaryStore.update(state => ({
            ...state, added: null
          }))
          return of(SettingSalaryActions.error(err))
        })
      );
    }),
  );

  @Effect()
  delete$ = this.action$.pipe(
    ofType(SettingSalaryActions.remove),
    switchMap(props => {
      return this.service.delete(props.id).pipe(
        tap(_ => {
          this.settingSalaryStore.remove(props?.id);
        }),
        catchError(err => {
          return of(SettingSalaryActions.error(err))
        })
      );
    }),
  );
}
