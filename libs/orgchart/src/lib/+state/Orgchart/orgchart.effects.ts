import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as OrgchartActions from './orgchart.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { BranchService } from '../../services/branch.service';
import { throwError } from 'rxjs';
import { OrgchartService } from '../../services/orgchart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class OrgchartEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.init),
      switchMap(() => this.orgchartService.getAll()),
      map(branches => {
        this.snackBar.open('Tải đơn vị thành công', '', { duration: 1500 });
        return OrgchartActions.loadOrgchartSuccess({ branches });
      }),
      catchError(err => throwError(err))
    )
  );

  searchBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.searchBranch),
      mergeMap((params) => this.orgchartService.getAll(params)),
      map(branches => {
        this.snackBar.open('Tải đơn vị thành công', '', { duration: 1500 });
        return OrgchartActions.loadOrgchartSuccess({ branches });
      }),
      catchError(err => throwError(err))
    )
  );

  addBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.addBranch),
      switchMap(param => this.branchService.addOne(param.branch)),
      map(branch => {
          this.snackBar.open('Thêm đơn vị thành công', '', { duration: 1500 });
          return OrgchartActions.addBranchSuccess({ branch });
        }
      ),
      catchError(err => throwError(err))
    ), { dispatch: true }
  );

  getBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.getBranch),
      switchMap(param => this.branchService.getOne(param.id)),
      map((branch) => OrgchartActions.getBranchSuccess({ branch: branch }),
        catchError(err => throwError(err))
      )
    ), { dispatch: true }
  );

  updateBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.updateBranch),
      switchMap(param => this.branchService.update(param.id,
        {
          name: param.name,
          positionIds: param.positionIds
        })),
      map(res => {
        this.snackBar.open('Cập nhật đơn vị thành công', '', { duration: 1500 });
        return OrgchartActions.updateBranchSuccess({ branch: res });
      }),
      catchError(err => throwError(err))
    ), { dispatch: true }
  );

  deleteBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.deleteBranch),
      switchMap(param => this.branchService.delete(param.id).pipe(
        map(_ => {
          this.snackBar.open('Xóa đơn vị thành công', '', { duration: 1500 });
          return OrgchartActions.init();
        }),
        catchError(err => throwError(err))
      ))
    ), { dispatch: true }
  );

  deleteAllowanceInBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrgchartActions.deleteAllowanceInBranch),
      switchMap(param => this.branchService.deleteAllowanceInBranch(param.salaryId).pipe(
        map(res => {
          this.snackBar.open('Xóa phụ cấp thành công', '', { duration: 1500 });
          return OrgchartActions.updateBranchSuccess({ branch: res });
        }),
        catchError(err => throwError(err))
      ))
    ), { dispatch: true }
  );

  constructor(
    private snackBar: MatSnackBar,
    private actions$: Actions,
    private branchService: BranchService,
    private orgchartService: OrgchartService
  ) {
  }
}
