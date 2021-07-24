import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DeleteHoliday, HolidayAction } from './holiday.action';
import { HolidayService } from '../../service/holiday.service';

@Injectable()
export class HolidayEffect {

  loadHoliday$ = createEffect(() =>
    this.action$.pipe(
      ofType(HolidayAction.LoadAllHoliday),
      switchMap(_ => this.holidayService.getAll()),
      map((holiday) =>
        HolidayAction.LoadAllHolidaySuccess({ holidays: holiday })),
      catchError((err) => throwError(err))
    ));

  addHoliday$ = createEffect(() =>
    this.action$.pipe(
      ofType(HolidayAction.AddHoliday),
      switchMap((pram) => this.holidayService.addOne(pram.holiday).pipe(
        map(_ => HolidayAction.LoadAllHoliday()),
        catchError((err) => throwError(err))
      ))
    ));

  updateHoliday$ = createEffect(() =>
    this.action$.pipe(
      ofType(HolidayAction.UpdateHoliday),
      switchMap((pram) => this.holidayService.update(pram.id, pram.holiday).pipe(
        map(_ => HolidayAction.LoadAllHoliday()),
        catchError((err) => throwError(err))
      ))
    ));

  deleteHoliday$ = createEffect(() =>
    this.action$.pipe(
      ofType(HolidayAction.DeleteHoliday),
      switchMap((pram) => {
       return  this.holidayService.delete(pram.id).pipe(
          map(_ => HolidayAction.LoadAllHoliday())
        )
        }
      )
    ));

  constructor(
    private readonly action$: Actions,
    private readonly holidayService: HolidayService
  ) {
  }
}
