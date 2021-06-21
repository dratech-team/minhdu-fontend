import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as OrgchartActions from './orgchart.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { BranchService } from '../services/branch.service';
import { throwError } from 'rxjs';
import { DepartmentService } from '../services/department.service';
import { PositionService } from '../services/position.service';

@Injectable()
export class OrgchartEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.init),
      mergeMap(() => this.branchService.getAll()),
      map(branches => OrgchartActions.loadOrgchartSuccess({ branches })),
      catchError(err => throwError(err))
    )
  );

  addBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.addBranch),
      switchMap(param => this.branchService.addOne(param.name).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    ), { dispatch: true }
  );

  updateBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.updateBranch),
      switchMap(param => this.branchService.update(param.id, param.name).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    ), { dispatch: true }
  );

  addDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.addDepartment),
      switchMap(param => this.departmentService.addOne(param.name, param.branchId).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    ), { dispatch: true }
  );

  updateDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.updateDepartment),
      switchMap(param => this.departmentService.update(param.id, param.name).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    )
  );

  addPosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.addPosition),
      switchMap(param => this.positionService.addOne(param.name, param.workday, param.departmentId).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    )
  );

  updatePosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.updatePosition),
      switchMap(param => this.positionService.update(param.id, param.name).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private branchService: BranchService,
    private departmentService: DepartmentService,
    private positionService: PositionService
  ) {
  }
}
