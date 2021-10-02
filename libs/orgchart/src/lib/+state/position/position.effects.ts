import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { OrgchartActions } from '@minhdu-fontend/orgchart';
import { PositionActions } from './position.actions';
import { PositionService } from '../../services/position.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class PositionEffects {
  loadAllPosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PositionActions.loadPosition),
      mergeMap((prams) => this.positionService.getAll(prams)),
      map(position => {
          this.snackBar.open('Tải chức vụ thành công', '', { duration: 1000 });
          return PositionActions.loadPositionSuccess({ position });
        }
      ),
      catchError(err => throwError(err))
    )
  );

  searchPosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PositionActions.searchPosition),
      mergeMap((props) => this.positionService.getAll(props)),
      map(position => {
        this.snackBar.open('Tải chức vụ thành công', '', { duration: 1000 });
        return PositionActions.loadPositionSuccess({ position });
      }),
      catchError(err => throwError(err))
    )
  );

  addPosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PositionActions.addPosition),
      switchMap(param => this.positionService.addOne(param)),
      map(position => PositionActions.addPositionSuccess({ position })),
      catchError(err => throwError(err))
    )
  );


  updatePosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PositionActions.updatePosition),
      switchMap(param => this.positionService.update(param.id,
        { name: param.name, workday: param.workday }).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    )
  );

  deletePosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PositionActions.deletePosition),
      switchMap(param => this.positionService.delete(param.id).pipe(
        map(_ => OrgchartActions.init()),
        catchError(err => throwError(err))
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private positionService: PositionService
  ) {
  }
}
