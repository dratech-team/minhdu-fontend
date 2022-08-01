import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SettingSalaryStore } from './setting-salary.store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SalarySettingService } from '../services';
import { SettingSalaryActions } from './setting-salary.action';
import { SettingSalaryQuery } from './setting-salary.query';
import { SalarySettingEntity } from '../entities';

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
    switchMap((props) => {
      this.settingSalaryStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.service.addOne(props).pipe(
        map((res) => {
          this.sortBranchAndPosition(res);
          return res;
        }),
        tap((res) => {
          this.settingSalaryStore.update((state) => ({
            ...state,
            loading: false,
            total: state.total + 1
          }));
          this.settingSalaryStore.upsert(res.id, res);
        }),
        catchError((err) => {
          this.settingSalaryStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(SettingSalaryActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(SettingSalaryActions.loadAll),
    switchMap((props) => {
      this.settingSalaryStore.update((state) => ({
        ...state,
        loading: true
      }));
      if (props?.search) {
        Object.assign(
          props.search,
          props.search?.orderType
            ? {
              orderType:
                props.search?.orderType === 'ascend' ? 'asc' : 'desc'
            }
            : {}
        );
      }
      return this.service.pagination(props).pipe(
        map((res) => {
          res.data.map((val) => this.sortBranchAndPosition(val));
          return res;
        }),
        tap((res) => {
          if (res.data.length === 0) {
            this.message.warning('Đã lấy hết bảng mẫu');
          }
          if (props.isSet) {
            this.settingSalaryStore.set(res.data);
          } else {
            this.settingSalaryStore.add(res.data);
          }
          this.settingSalaryStore.update((state) => ({
            ...state,
            total: res.total,
            loading: false,
            remain: res.total - this.settingSalaryQuery.getCount()
          }));
        }),
        catchError((err) => {
          this.settingSalaryStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(SettingSalaryActions.error(err));
        })
      );
    })
  );

  @Effect()
  getOne$ = this.action$.pipe(
    ofType(SettingSalaryActions.getOne),
    switchMap((props) => {
      return this.service.getOne(props.id).pipe(
        map((res) => {
          this.sortBranchAndPosition(res);
          return res;
        }),
        tap((res) => {
          this.settingSalaryStore.update(res?.id, res);
        }),
        catchError((err) => {
          return of(SettingSalaryActions.error(err));
        })
      );
    })
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(SettingSalaryActions.update),
    switchMap((props) => {
      this.settingSalaryStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.service.update(props).pipe(
        map((res) => {
          this.sortBranchAndPosition(res);
          return res;
        }),
        tap((res) => {
          this.settingSalaryStore.update((state) => ({
            ...state,
            loading: false
          }));
          this.settingSalaryStore.update(res?.id, res);
        }),
        catchError((err) => {
          this.settingSalaryStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(SettingSalaryActions.error(err));
        })
      );
    })
  );

  @Effect()
  delete$ = this.action$.pipe(
    ofType(SettingSalaryActions.remove),
    switchMap((props) => {
      this.settingSalaryStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.service.delete(props.id).pipe(
        tap((_) => {
          this.settingSalaryStore.update((state) => ({
            ...state,
            loading: false,
            total: state.total - 1
          }));
          this.message.success('Xoá bản mẫu thành công');
          this.settingSalaryStore.remove(props?.id);
        }),
        catchError((err) => {
          this.settingSalaryStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(SettingSalaryActions.error(err));
        })
      );
    })
  );

  private sortBranchAndPosition(
    settingSalary: SalarySettingEntity
  ): SalarySettingEntity {
    settingSalary.branches?.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    settingSalary.positions?.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    return settingSalary;
  }
}
