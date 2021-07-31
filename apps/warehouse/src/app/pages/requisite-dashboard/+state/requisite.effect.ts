import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { RequisiteAction } from './requisite.action';
import { RequisiteService } from '../service/requisite.service';
@Injectable()
export class RequisiteEffect {

  loadRequisite$ = createEffect(() =>
    this.action$.pipe(
      ofType(RequisiteAction.loadInit),
      switchMap((props) => {
        return this.requisiteService.pagination(props);
      }),
      map((ResponsePaginate) => RequisiteAction.loadInitSuccess({
        requisite: ResponsePaginate.data
      })),
      catchError((err) => throwError(err))
    )
  );
  loadMoreRequisite$ = createEffect(() =>
    this.action$.pipe(
      ofType(RequisiteAction.loadMoreRequisite),
      switchMap((props) => this.requisiteService.pagination(props)),
      map((ResponsePaginate) =>
        RequisiteAction.loadMoreRequisitesSuccess({ requisite: ResponsePaginate.data })),
      catchError((err) => throwError(err))
    )
  );

  addRequisite$ = createEffect(() =>
    this.action$.pipe(
      ofType(RequisiteAction.addRequisite),
      switchMap((props) => this.requisiteService.addOne(props.requisite).pipe(
        map(() => RequisiteAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  getRequisite$ = createEffect(() =>
    this.action$.pipe(
      ofType(RequisiteAction.getRequisite),
      switchMap((props) => this.requisiteService.getOne(props.id)),
      map((requisite) => RequisiteAction.getRequisiteSuccess({ requisite: requisite })),
      catchError((err) => throwError(err))
    )
  );

  updateRequisite$ = createEffect(() =>
    this.action$.pipe(
      ofType(RequisiteAction.updateRequisite),
      switchMap((props) => this.requisiteService.update(props.id, props.requisite).pipe(
        map(() => RequisiteAction.getRequisite({ id: props.id })),
        catchError((err) => throwError(err))
      ))
    )
  );


  deleteRequisite$ = createEffect(() =>
    this.action$.pipe(
      ofType(RequisiteAction.deleteRequisite),
      switchMap((props) => this.requisiteService.delete(props.requisiteId).pipe(
        map(() => RequisiteAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  constructor(
    private readonly action$: Actions,
    private readonly requisiteService: RequisiteService
  ) {
  }
}
