import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MedicineAction } from './medicine.action'
import { MedicineService } from '../service/medicine.service';

@Injectable()
export class MedicineEffect {

  loadMedicines$ = createEffect(() =>
    this.action$.pipe(
      ofType(MedicineAction.loadInit),
      switchMap((props) => {
        return this.medicineService.Pagination(props);
      }),
      map((ResponsePaginate) => {
        return MedicineAction.loadInitSuccess({
          medicines: ResponsePaginate
        })
      }),
      catchError((err) => throwError(err))
    )
  );
  loadMoreMedicines$ = createEffect(() =>
    this.action$.pipe(
      ofType(MedicineAction.loadMoreMedicines),
      switchMap((props) => this.medicineService.pagination(props)),
      map((ResponsePaginate) =>
        MedicineAction.loadMoreMedicinesSuccess({ medicines: ResponsePaginate.data })),
      catchError((err) => throwError(err))
    )
  );

  addMedicine$ = createEffect(() =>
    this.action$.pipe(
      ofType(MedicineAction.addMedicine),
      switchMap((props) => this.medicineService.addOne(props.medicine).pipe(
        map(() => MedicineAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  getMedicine$ = createEffect(() =>
    this.action$.pipe(
      ofType(MedicineAction.getMedicine),
      switchMap((props) => this.medicineService.getOne(props.id)),
      map((Material) => MedicineAction.getMedicineSuccess({ medicine: Material })),
      catchError((err) => throwError(err))
    )
  );

  updateMedicine$ = createEffect(() =>
    this.action$.pipe(
      ofType(MedicineAction.updateMedicine),
      switchMap((props) => this.medicineService.update(props.id, props.medicine).pipe(
        map(() => MedicineAction.getMedicine({ id: props.id })),
        catchError((err) => throwError(err))
      ))
    )
  );


  deleteMaterial$ = createEffect(() =>
    this.action$.pipe(
      ofType(MedicineAction.deleteMedicine),
      switchMap((props) => this.medicineService.delete(props.medicineId).pipe(
        map(() => MedicineAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  constructor(
    private readonly action$: Actions,
    private readonly medicineService: MedicineService
  ) {
  }
}
