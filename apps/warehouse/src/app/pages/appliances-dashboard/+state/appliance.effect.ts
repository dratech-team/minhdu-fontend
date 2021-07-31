import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ApplianceAction } from './appliance.action';
import { ApplianceService } from '../service/appliance.service';
@Injectable()
export class ApplianceEffect {

  loadAppliances$ = createEffect(() =>
    this.action$.pipe(
      ofType(ApplianceAction.loadInit),
      switchMap((props) => {
        return this.applianceService.pagination(props);
      }),
      map((ResponsePaginate) => ApplianceAction.loadInitSuccess({
        appliances: ResponsePaginate.data
      })),
      catchError((err) => throwError(err))
    )
  );
  loadMoreAppliances$ = createEffect(() =>
    this.action$.pipe(
      ofType(ApplianceAction.loadMoreAppliances),
      switchMap((props) => this.applianceService.pagination(props)),
      map((ResponsePaginate) =>
        ApplianceAction.loadMoreAppliancesSuccess({ appliances: ResponsePaginate.data })),
      catchError((err) => throwError(err))
    )
  );

  addAppliance$ = createEffect(() =>
    this.action$.pipe(
      ofType(ApplianceAction.addAppliance),
      switchMap((props) => this.applianceService.addOne(props.appliance).pipe(
        map(() => ApplianceAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  getAppliances$ = createEffect(() =>
    this.action$.pipe(
      ofType(ApplianceAction.getAppliance),
      switchMap((props) => this.applianceService.getOne(props.id)),
      map((appliance) => ApplianceAction.getApplianceSuccess({ appliance: appliance })),
      catchError((err) => throwError(err))
    )
  );

  updateMedicine$ = createEffect(() =>
    this.action$.pipe(
      ofType(ApplianceAction.updateAppliance),
      switchMap((props) => this.applianceService.update(props.id, props.appliance).pipe(
        map(() => ApplianceAction.getAppliance({ id: props.id })),
        catchError((err) => throwError(err))
      ))
    )
  );


  deleteMedicine$ = createEffect(() =>
    this.action$.pipe(
      ofType(ApplianceAction.deleteAppliance),
      switchMap((props) => this.applianceService.delete(props.applianceId).pipe(
        map(() => ApplianceAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  constructor(
    private readonly action$: Actions,
    private readonly applianceService: ApplianceService
  ) {
  }
}
