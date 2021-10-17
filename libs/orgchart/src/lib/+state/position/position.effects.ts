import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { OrgchartActions } from '@minhdu-fontend/orgchart';
import { PositionActions } from './position.actions';
import { PositionService } from '../../services/position.service';

@Injectable()
export class PositionEffects {
  loadPosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PositionActions.loadPosition),
      mergeMap(() => this.positionService.getAll()),
      map(position => PositionActions.loadPositionSuccess({ position })),
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
    private positionService: PositionService
  ) {
  }
}
