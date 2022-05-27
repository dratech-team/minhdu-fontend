import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {SettingSalaryStore} from './setting-salary.store';
import {NzMessageService} from "ng-zorro-antd/message";
import {SalarySettingService} from "../services";
import {SettingSalaryActions} from "./setting-salary.action";
import {SearchSalarySettingDto} from "../dto";
import {SettingSalaryQuery} from "./setting-salary.query";
import {SalarySettingEntity} from "../entities";
import {CompareSortUtil} from "../../../payroll/utils/compare-sort.util";

@Injectable()
export class SettingSalaryEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: SalarySettingService,
    private readonly settingSalaryStore: SettingSalaryStore,
    private readonly settingSalaryQuery: SettingSalaryQuery,
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
        map(res => {
          this.sortBranchAndPosition(res)
          return res
        }),
        tap(res => {
          this.settingSalaryStore.update(state => ({
            ...state, added: true, total: state.total + 1
          }))
          this.settingSalaryStore.upsert(res.id, res);
        }),
        catchError(err => {
          this.settingSalaryStore.update(state => ({
            ...state, added: true
          }))
          return of(SettingSalaryActions.error(err))
        })
      )
        ;
    }),
  );

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(SettingSalaryActions.loadAll),
    switchMap((props: SearchSalarySettingDto) => {
      this.settingSalaryStore.update(state => (
        Object.assign({
            ...state,
          }, props.isPaginate
            ? {loadMore: true}
            : {loading: true}
        )
      ));
      return this.service.pagination(props).pipe(
        map(res => {
          res.data.map(val => this.sortBranchAndPosition(val))
          return res
        }),
        tap((res) => {
          if (res.data.length === 0) {
            this.message.warning('Đã lấy hết bảng mẫu')
          }
          if (props.isPaginate) {
            this.settingSalaryStore.add(res.data);
          } else {
            this.settingSalaryStore.set(res.data);
          }
          this.settingSalaryStore.update(state => (
            Object.assign({
                ...state, total: res.total, remain: res.total - this.settingSalaryQuery.getCount()
              }, props.isPaginate
                ? {loadMore: false}
                : {loading: false}
            )
          ));
        }),
        catchError((err) => {
          this.settingSalaryStore.update(state => (
            Object.assign({
                ...state,
              }, props.isPaginate
                ? {loadMore: false}
                : {loading: false}
            )
          ));
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
        map(res => {
          this.sortBranchAndPosition(res)
          return res
        }),
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
        map(res => {
          this.sortBranchAndPosition(res)
          return res
        }),
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
          this.settingSalaryStore.update(state => ({
            ...state, added: true, total: state.total - 1
          }))
          this.message.success('Xoá bản mẫu thành công')
          this.settingSalaryStore.remove(props?.id);
        }),
        catchError(err => {
          return of(SettingSalaryActions.error(err))
        })
      );
    }),
  );

  private sortBranchAndPosition(settingSalary: SalarySettingEntity): SalarySettingEntity {
    settingSalary.branches?.sort((a, b) => {
      return CompareSortUtil(a.name, b.name, true)
    })
    settingSalary.positions?.sort((a, b) => {
      return CompareSortUtil(a.name, b.name, true)
    })
    return settingSalary
  }
}
