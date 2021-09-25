import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateBasicAction } from './template-basic-salary.action';
import { TemplateBasicSalaryService } from '../../service/template-basic-salary.service';
import { selectorTemplateTotal } from './template-basic-salary.selector';
import { SnackBarComponent } from '../../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';

@Injectable()
export class TemplateBasicSalaryEffect {

  loadAll$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateBasicAction.loadALlTemplate),
      switchMap(props => this.templateBasicSalaryService.pagination(props)),
      map((responsePagination) =>
        TemplateBasicAction.loadInitTempLateSuccess({ templateBasics: responsePagination.data })),
      catchError((err) => throwError(err))
    ));

  loadInit$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateBasicAction.loadInit),
      switchMap(props => this.templateBasicSalaryService.pagination(props)),
      map((responsePagination) =>
        TemplateBasicAction.loadInitTempLateSuccess({ templateBasics: responsePagination.data })),
      catchError((err) => throwError(err))
    ));

  loadMore$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateBasicAction.loadMoreTemplateBasic),
      withLatestFrom(this.store.pipe(select(selectorTemplateTotal))),
      map(([props, skip]) =>
        Object.assign(JSON.parse(JSON.stringify(props)), { skip: skip })
      ),
      switchMap((props) => {
        return this.templateBasicSalaryService.pagination(props);
      }),
      map((responsePagination) => {
        if (responsePagination.data.length === 0) {
          this.snackBar.openFromComponent(SnackBarComponent, {
            data: { content: 'Đã lấy hết bản mẫu lương cơ bản' },
            duration: 2500,
            panelClass: ['background-snackbar']
          });
        }
        return TemplateBasicAction.loadMoreTempLateSuccess({
          templateBasics: responsePagination.data
        });
      }),
      catchError((err) => throwError(err))
    )
  );

  addTemplate$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateBasicAction.AddTemplate),
      switchMap((pram) => this.templateBasicSalaryService.addOne(pram.template).pipe(
        map(_ => TemplateBasicAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    ));

  updateTemplate = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateBasicAction.updateTemplate),
      switchMap((pram) => this.templateBasicSalaryService.update(pram.id, pram.templateBasic).pipe(
        map(_ => TemplateBasicAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    ));

  deleteTemplate$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateBasicAction.deleteTemplate),
      switchMap((pram) => {
          return this.templateBasicSalaryService.delete(pram.id).pipe(
            map(_ => TemplateBasicAction.loadInit({ take: 30, skip: 0 }))
          );
        }
      )
    ));

  constructor(
    private readonly action$: Actions,
    private readonly templateBasicSalaryService: TemplateBasicSalaryService,
    private readonly store: Store,
    private readonly snackBar: MatSnackBar
  ) {
  }
}
