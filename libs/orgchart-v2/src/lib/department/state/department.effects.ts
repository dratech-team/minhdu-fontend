import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DepartmentStore } from './department.store';
import { DepartmentQuery } from './department.query';
import { DepartmentService } from '../services/department.service';
import { DepartmentActions } from './department.actions';

@Injectable({ providedIn: 'root' })
export class DepartmentEffects {
  constructor(
    private readonly action$: Actions,
    private readonly departmentStore: DepartmentStore,
    private readonly departmentQuery: DepartmentQuery,
    private readonly departmentService: DepartmentService
  ) {
  }

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(DepartmentActions.loadAll),
    switchMap((props) => {
      this.departmentStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.departmentService.pagination(props).pipe(
        map((response) => {
          this.departmentStore.update((state) => ({
            ...state,
            loading: false,
            total: response.total
          }));
          if (props.isSet) {
            this.departmentStore.set(response.data);
          } else {
            this.departmentStore.add(response.data);
          }
        }),
        catchError((err) => {
          this.departmentStore.update((state) => ({
            ...state,
            loading: false
          }));
          return of(DepartmentActions.error(err));
        })
      );
    })
  );

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(DepartmentActions.addOne),
    switchMap((props) => {
      this.departmentStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.departmentService.addOne(props).pipe(
        tap((res) => {
          this.departmentStore.update((state) => ({
            ...state,
            loading: false
          }));
          this.departmentStore.add(res);
        }),
        catchError((err) => {
          this.departmentStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(DepartmentActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadOne$ = this.action$.pipe(
    ofType(DepartmentActions.loadOne),
    switchMap((props) =>
      this.departmentService.getOne(props).pipe(
        map((branch) => this.departmentStore.upsert(branch.id, branch)),
        catchError((err) => of(DepartmentActions.error(err)))
      )
    )
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(DepartmentActions.update),
    switchMap((props) => {
      this.departmentStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.departmentService.update(props).pipe(
        tap((response) => {
          this.departmentStore.update((state) => ({
            ...state,
            loading: false
          }));
          this.departmentStore.update(response.id, response);
        }),
        catchError((err) => {
          this.departmentStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(DepartmentActions.error(err));
        })
      );
    })
  );

  @Effect()
  remove$ = this.action$.pipe(
    ofType(DepartmentActions.remove),
    switchMap((props) =>
      this.departmentService.delete(props.id).pipe(
        map(() => {
          return this.departmentStore.remove(props.id);
        }),
        catchError((err) => of(DepartmentActions.error(err)))
      )
    )
  );

  @Effect()
  removeEmployee$ = this.action$.pipe(
    ofType(DepartmentActions.removeEmployee),
    switchMap((props) => {
      this.departmentStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.departmentService.removeEmployee(props.id, props.body).pipe(
        map((_) => {
          this.departmentStore.update((state) => ({
            ...state,
            loading: false
          }));
        }),
        catchError((err) => {
          this.departmentStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(DepartmentActions.error(err));
        })
      );
    })
  );
}
