import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { TemplateOvertimeService } from '../../service/template-overtime.service';
import { throwError } from 'rxjs';
import { TemplateOvertimeAction } from './template-overtime.action';
import { select, Store } from '@ngrx/store';
import { SnackBarComponent } from '../../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';
import { selectorTemplateTotal } from './template-overtime.selector';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class TemplateOvertimeEffect {

  loadAll$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateOvertimeAction.loadALlTemplate),
      switchMap(_ => this.templateOvertimeService.pagination()),
      map((responsePagination) =>
        TemplateOvertimeAction.loadInitTempLateSuccess({ templateOvertime: responsePagination.data })),
      catchError((err) => throwError(err))
    ));

  loadInit$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateOvertimeAction.loadInit),
      switchMap(props => this.templateOvertimeService.pagination(props)),
      map((responsePagination) =>
        TemplateOvertimeAction.loadInitTempLateSuccess({ templateOvertime: responsePagination.data })),
      catchError((err) => throwError(err))
    ));

  loadMore$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateOvertimeAction.loadMoreTemplateOverTime),
      withLatestFrom(this.store.pipe(select(selectorTemplateTotal))),
      map(([props, skip]) =>
        Object.assign(JSON.parse(JSON.stringify(props)), { skip: skip })
      ),
      switchMap((props) => {
        return this.templateOvertimeService.pagination(props);
      }),
      map((responsePagination) => {
        if (responsePagination.data.length === 0) {
          this.snackBar.openFromComponent(SnackBarComponent, {
            data: { content: 'Đã lấy hết bản mẫu' },
            duration: 2500,
            panelClass: ['background-snackbar']
          });
        }
        return TemplateOvertimeAction.loadMoreTempLateSuccess({
          templateOvertime: responsePagination.data
        });
      }),
      catchError((err) => throwError(err))
    )
  );

  addTemplate$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateOvertimeAction.AddTemplate),
      switchMap((pram) => this.templateOvertimeService.addOne(pram.templateOvertime).pipe(
        map(_ => TemplateOvertimeAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    ));

  updateTemplate = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateOvertimeAction.updateTemplate),
      switchMap((pram) => this.templateOvertimeService.update(pram.id, pram.templateOvertime).pipe(
        map(_ => TemplateOvertimeAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    ));

  deleteTemplate$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateOvertimeAction.deleteTemplate),
      switchMap((pram) => {
          console.log(pram);
          return this.templateOvertimeService.delete(pram.id).pipe(
            map(_ => TemplateOvertimeAction.loadInit({ take: 30, skip: 0 }))
          );
        }
      )
    ));

  constructor(
    private readonly action$: Actions,
    private readonly templateOvertimeService: TemplateOvertimeService,
    private readonly store: Store,
    private readonly snackBar: MatSnackBar
  ) {
  }
}
