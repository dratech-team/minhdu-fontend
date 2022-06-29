import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SalaryActions } from './salary.actions';
import { SalaryService } from '../service';
import { SalaryQuery } from './salary.query';
import { SalaryStore } from './salary.store';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
// salary effect chưu sử dụng vì đang gọi trực tiếp service
export class SalaryEffect {
  constructor(
    private readonly action$: Actions,
    private readonly salaryStore: SalaryStore,
    private readonly salaryQuery: SalaryQuery,
    private readonly salaryService: SalaryService,
    private readonly message: NzMessageService
  ) {}

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(SalaryActions.addOne),
    switchMap((props) => {
      this.salaryStore.update((state) => ({
        ...state,
        added: false,
      }));
      return this.salaryService.addOne(props).pipe(
        tap((res) => {
          this.message.success('Thêm thành công');
          this.salaryStore.update((state) => ({
            ...state,
            added: true,
          }));
        }),
        catchError((err) => {
          this.salaryStore.update((state) => ({
            ...state,
            added: null,
          }));
          return of(SalaryActions.error(err));
        })
      );
    })
  );

  @Effect()
  addMany$ = this.action$.pipe(
    ofType(SalaryActions.addMany),
    switchMap((props) => {
      this.salaryStore.update((state) => ({
        ...state,
        added: false,
      }));
      return this.salaryService.addMany(props).pipe(
        tap((res) => {
          this.message.success(res.message);
          this.salaryStore.update((state) => ({
            ...state,
            added: true,
          }));
        }),
        catchError((err) => {
          this.salaryStore.update((state) => ({
            ...state,
            added: null,
          }));
          return of(SalaryActions.error(err));
        })
      );
    })
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(SalaryActions.update),
    switchMap((props) => {
      this.salaryStore.update((state) => ({
        ...state,
        added: false,
      }));
      return this.salaryService.update(props.id, props.updates).pipe(
        tap((response) => {
          this.salaryStore.update((state) => ({
            ...state,
            added: true,
          }));
        }),
        catchError((err) => {
          this.salaryStore.update((state) => ({
            ...state,
            added: null,
          }));
          return of(SalaryActions.error(err));
        })
      );
    })
  );

  @Effect()
  updateMany$ = this.action$.pipe(
    ofType(SalaryActions.updateMany),
    switchMap((props) => {
      this.salaryStore.update((state) => ({
        ...state,
        added: false,
      }));
      return this.salaryService.updateMany(props.updates).pipe(
        tap((response) => {
          this.salaryStore.update((state) => ({
            ...state,
            added: true,
          }));
        }),
        catchError((err) => {
          this.salaryStore.update((state) => ({
            ...state,
            added: null,
          }));
          return of(SalaryActions.error(err));
        })
      );
    })
  );

  @Effect()
  deleteSalary = this.action$.pipe(
    ofType(SalaryActions.remove),
    switchMap((props) =>
      this.salaryService.deleteMany(props.salaryIds).pipe(
        tap((res) => {
          this.message.success(res.message);
          return this.salaryStore.remove(props.salaryIds);
        }),
        catchError((err) => of(SalaryActions.error(err)))
      )
    )
  );
}
