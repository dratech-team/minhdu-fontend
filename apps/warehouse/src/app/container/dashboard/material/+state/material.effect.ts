import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MaterialAction } from './material.action';
import { MaterialService } from '../service/material.service';
@Injectable()
export class MaterialEffect {

  loadAppliances$ = createEffect(() =>
    this.action$.pipe(
      ofType(MaterialAction.loadInit),
      switchMap((props) => {
        return this.applianceService.pagination(props);
      }),
      map((ResponsePaginate) => MaterialAction.loadInitSuccess({
        appliances: ResponsePaginate.data
      })),
      catchError((err) => throwError(err))
    )
  );
  loadMoreAppliances$ = createEffect(() =>
    this.action$.pipe(
      ofType(MaterialAction.loadMoreAppliances),
      switchMap((props) => this.applianceService.pagination(props)),
      map((ResponsePaginate) =>
        MaterialAction.loadMoreAppliancesSuccess({ appliances: ResponsePaginate.data })),
      catchError((err) => throwError(err))
    )
  );

  addAppliance$ = createEffect(() =>
    this.action$.pipe(
      ofType(MaterialAction.addAppliance),
      switchMap((props) => this.applianceService.addOne(props.appliance).pipe(
        map(() => MaterialAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  getAppliances$ = createEffect(() =>
    this.action$.pipe(
      ofType(MaterialAction.getAppliance),
      switchMap((props) => this.applianceService.getOne(props.id)),
      map((appliance) => MaterialAction.getApplianceSuccess({ appliance: appliance })),
      catchError((err) => throwError(err))
    )
  );

  updateMedicine$ = createEffect(() =>
    this.action$.pipe(
      ofType(MaterialAction.updateAppliance),
      switchMap((props) => this.applianceService.update(props.id, props.appliance).pipe(
        map(() => MaterialAction.getAppliance({ id: props.id })),
        catchError((err) => throwError(err))
      ))
    )
  );


  deleteMedicine$ = createEffect(() =>
    this.action$.pipe(
      ofType(MaterialAction.deleteAppliance),
      switchMap((props) => this.applianceService.delete(props.applianceId).pipe(
        map(() => MaterialAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  constructor(
    private readonly action$: Actions,
    private readonly applianceService: MaterialService
  ) {
  }
}
