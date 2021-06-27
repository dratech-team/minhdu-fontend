import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as OrgchartActions from './orgchart.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { BranchService } from '../services/branch.service';
import { throwError } from 'rxjs';
import { DepartmentService } from '../services/department.service';
import { PositionService } from '../services/position.service';
import { OrgchartService } from '../services/orgchart.service';

@Injectable()
export class OrgchartEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.init),
      mergeMap(() => this.orgchartService.getAll()),
      map(branches => OrgchartActions.loadOrgchartSuccess({ branches })),
      catchError(err => throwError(err))
    )
  );

  addBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.addBranch),
      switchMap(param => this.branchService.addOne(param.branch).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    ), { dispatch: true }
  );

  updateBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.updateBranch),
      switchMap(param => this.branchService.update(param.id, { name: param.name }).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    ), { dispatch: true }
  );

  deleteBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.deleteBranch),
      switchMap(param => this.branchService.delete(param.id).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    ), { dispatch: true }
  );


  addDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.addDepartment),
      switchMap(param => this.departmentService.addOne(param.department).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    ), { dispatch: true }
  );

  updateDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.updateDepartment),
      switchMap(param => this.departmentService.update(param.id, { name: param.name }).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    )
  );

  deleteDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.deleteDepartment),
      switchMap(param => this.departmentService.delete(param.id).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    )
  );

  addPosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.addPosition),
      switchMap(param => this.positionService.addOne(param.position).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    )
  );

  updatePosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.updatePosition),
      switchMap(param => this.positionService.update(param.id, { name: param.name }).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    )
  );

  deletePosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.deletePosition),
      switchMap(param => this.positionService.delete(param.id).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private branchService: BranchService,
    private orgchartService: OrgchartService,
    private departmentService: DepartmentService,
    private positionService: PositionService
  ) {
  }
}
