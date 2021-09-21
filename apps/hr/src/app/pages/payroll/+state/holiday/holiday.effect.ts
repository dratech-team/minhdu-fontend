import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DeleteHoliday, HolidayAction } from './holiday.action';
import { HolidayService } from '../../service/holiday.service';
import { select, Store } from '@ngrx/store';
import { selectorTemplateTotal } from '../template-overtime/template-overtime.selector';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';
import { selectorHolidayTotal } from './holiday.selector';

@Injectable()
export class HolidayEffect {

  loadAll$ = createEffect(() =>
    this.action$.pipe(
      ofType(HolidayAction.LoadAllHoliday),
      switchMap(_ => this.holidayService.pagination()),
      map((responsePagination) =>
        HolidayAction.LoadInitHolidaySuccess({ holidays: responsePagination.data })),
      catchError((err) => throwError(err))
    ));

  loadInit$ = createEffect(() =>
    this.action$.pipe(
      ofType(HolidayAction.LoadInit),
      switchMap(props => this.holidayService.pagination(props)),
      map((responsePagination) =>
        HolidayAction.LoadInitHolidaySuccess({ holidays: responsePagination.data })),
      catchError((err) => throwError(err))
    ));

  loadMore$ = createEffect(() =>
    this.action$.pipe(
      ofType(HolidayAction.LoadMoreHoliday),
      withLatestFrom(this.store.pipe(select(selectorHolidayTotal))),
      map(([props, skip]) =>
        Object.assign(JSON.parse(JSON.stringify(props)), { skip: skip })
      ),
      switchMap(props => this.holidayService.pagination(props)),
      map((responsePagination) => {
          if (responsePagination.data.length === 0) {
            this.snackBar.openFromComponent(SnackBarComponent, {
              data: { content: 'Đã lấy hết ngày nghỉ' },
              duration: 2500,
              panelClass: ['background-snackbar']
            });
          }
          return HolidayAction.LoadMoreHolidaySuccess({ holidays: responsePagination.data });
        }
      ),
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
          return this.holidayService.delete(pram.id).pipe(
            map(_ => HolidayAction.LoadAllHoliday())
          );
        }
      )
    ));

  constructor(
    private readonly action$: Actions,
    private readonly holidayService: HolidayService,
    private readonly store: Store,
    private readonly snackBar: MatSnackBar
  ) {
  }
}
