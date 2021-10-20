import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateSalaryAction } from './template-salary.action';
import { TemplateSalaryService } from '../../service/template-salary.service';
import { selectorTemplateTotal } from './template-salary.selector';
import { SnackBarComponent } from '../../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';

@Injectable()
export class TemplateSalaryEffect {

  loadAll$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateSalaryAction.loadALlTemplate),
      switchMap((props: any) => {
        console.log(props.SalaryType);
        return this.templateSalaryService.pagination(Object.assign(JSON.parse(JSON.stringify(props)), { type: props.SalaryType }));
      }),
      map((responsePagination) =>
        TemplateSalaryAction.loadInitTempLateSuccess({ templateSalary: responsePagination.data })),
      catchError((err) => throwError(err))
    ));

  loadInit$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateSalaryAction.loadInit),
      switchMap(props => this.templateSalaryService.pagination(props)),
      map((responsePagination) => {
          console.log(responsePagination);
          return TemplateSalaryAction.loadInitTempLateSuccess({ templateSalary: responsePagination.data });
        }
      ),
      catchError((err) => throwError(err))
    ));

  loadMore$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateSalaryAction.loadMoreTemplateBasic),
      withLatestFrom(this.store.pipe(select(selectorTemplateTotal))),
      map(([props, skip]) =>
        Object.assign(JSON.parse(JSON.stringify(props)), { skip: skip })
      ),
      switchMap((props) => {
        return this.templateSalaryService.pagination(props);
      }),
      map((responsePagination) => {
        if (responsePagination.data.length === 0) {
          this.snackBar.openFromComponent(SnackBarComponent, {
            data: { content: 'Đã lấy hết bản mẫu lương cơ bản' },
            duration: 2500,
            panelClass: ['background-snackbar']
          });
        }
        return TemplateSalaryAction.loadMoreTempLateSuccess({
          templateSalary: responsePagination.data
        });
      }),
      catchError((err) => throwError(err))
    )
  );

  addTemplate$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateSalaryAction.AddTemplate),
      switchMap((pram) => this.templateSalaryService.addOne(pram.template).pipe(
        map(_ => TemplateSalaryAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => {
            this.store.dispatch(TemplateSalaryAction.HandelTemplateError());
            return throwError(err);
          }
        )
      ))
    ));

  updateTemplate = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateSalaryAction.updateTemplate),
      switchMap((pram) => this.templateSalaryService.update(pram.id, pram.template).pipe(
        map(_ => TemplateSalaryAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => {
            this.store.dispatch(TemplateSalaryAction.HandelTemplateError());
            return throwError(err);
          }
        )
      ))
    ));

  deleteTemplate$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateSalaryAction.deleteTemplate),
      switchMap((pram) => {
          return this.templateSalaryService.delete(pram.id).pipe(
            map(_ => TemplateSalaryAction.loadInit({ take: 30, skip: 0 }))
          );
        }
      )
    ));

  constructor(
    private readonly action$: Actions,
    private readonly templateSalaryService: TemplateSalaryService,
    private readonly store: Store,
    private readonly snackBar: MatSnackBar
  ) {
  }
}
