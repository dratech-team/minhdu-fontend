import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as DepartmentAction from './department.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DepartmentService } from '../../services/department.service';
import { OrgchartActions } from '@minhdu-fontend/orgchart';

@Injectable()
export class DepartmentEffects {
  loadDepartments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentAction.loadDepartment),
      mergeMap(() => this.departmentService.getAll()),
      map(departments => DepartmentAction.loadDepartmentSuccess({ departments })),
      catchError(err => throwError(err))
    )
  );

  addDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentAction.addDepartment),
      switchMap(param => this.departmentService.addOne(param.department).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    ), { dispatch: true }
  );

  getDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentAction.getDepartment),
      mergeMap((pram) => this.departmentService.getOne(pram.id)),
      map(_ => DepartmentAction.loadDepartment()),
      catchError(err => throwError(err))
    )
  );

  updateDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentAction.updateDepartment),
      switchMap(param => this.departmentService.update(param.id, { name: param.name }).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    )
  );

  deleteDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentAction.deleteDepartment),
      switchMap(param => this.departmentService.delete(param.id).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    )
  );
  constructor(
    private actions$: Actions,
    private departmentService: DepartmentService,
  ) {
  }
}
