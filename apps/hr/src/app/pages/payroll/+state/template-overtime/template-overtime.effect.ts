import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TemplateOvertimeService } from '../../service/template-overtime.service';
import { throwError } from 'rxjs';
import { TemplateOvertimeAction } from './template-overtime.action';

@Injectable()
export class TemplateOvertimeEffect {

  loadTemplate$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateOvertimeAction.loadAllTempLate),
      switchMap(_ => this.templateOvertimeService.getAll()),
      map((templateOvertime) =>
        TemplateOvertimeAction.loadAllTempLateSuccess({ templateOvertime: templateOvertime })),
      catchError((err) => throwError(err))
    ));

  addTemplate$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateOvertimeAction.AddTemplate),
      switchMap((pram) => this.templateOvertimeService.addOne(pram.templateOvertime).pipe(
        map(_ => TemplateOvertimeAction.loadAllTempLate()),
        catchError((err) => throwError(err))
      ))
    ));

  updateTemplate = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateOvertimeAction.updateTemplate),
      switchMap((pram) => this.templateOvertimeService.update(pram.id, pram.templateOvertime).pipe(
        map(_ => TemplateOvertimeAction.loadAllTempLate()),
        catchError((err) => throwError(err))
      ))
    ));

  deleteTemplate$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateOvertimeAction.deleteTemplate),
      switchMap((pram) => this.templateOvertimeService.delete(pram.id).pipe(
        map(_ => TemplateOvertimeAction.loadAllTempLate())
      ))
    ));

  constructor(
    private readonly action$: Actions,
    private readonly templateOvertimeService: TemplateOvertimeService
  ) {
  }
}
