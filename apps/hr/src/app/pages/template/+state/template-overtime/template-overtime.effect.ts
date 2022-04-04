import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {TemplateOvertimeService} from '../../service/template-overtime.service';
import {throwError} from 'rxjs';
import {TemplateOvertimeAction} from './template-overtime.action';
import {select, Store} from '@ngrx/store';
import {selectorTemplateTotal} from './template-overtime.selector';
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable()
export class TemplateOvertimeEffect {

  loadAll$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateOvertimeAction.loadALlTemplate),
      switchMap(props => {
          return this.templateOvertimeService.pagination(props);
        }
      ),
      map((responsePagination) =>
        TemplateOvertimeAction.loadInitTempLateSuccess({
          templateOvertimes: responsePagination.data,
          total: responsePagination.total
        })),
      catchError((err) => throwError(err))
    ));

  loadInit$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateOvertimeAction.loadInit),
      switchMap(props => {
        return this.templateOvertimeService.pagination(props.templateOvertimeDTO);
      }),
      map((responsePagination) => {
          return TemplateOvertimeAction.loadInitTempLateSuccess({
            templateOvertimes: responsePagination.data,
            total: responsePagination.total
          });
        }
      ),
      catchError((err) => throwError(err))
    ));

  loadMore$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateOvertimeAction.loadMoreTemplateOverTime),
      withLatestFrom(this.store.pipe(select(selectorTemplateTotal))),
      map(([props, skip]) =>
        Object.assign(JSON.parse(JSON.stringify(props.templateOvertimeDTO)), { skip: skip })
      ),
      switchMap((props) => {
        return this.templateOvertimeService.pagination(props);
      }),
      map((responsePagination) => {
        if (responsePagination.data.length === 0) {
         this.message.warning('Đã lấy hết Mẫu tăng ca')
        }
        return TemplateOvertimeAction.loadMoreTempLateSuccess({
          templateOvertimes: responsePagination.data,
          total: responsePagination.total
        });
      }),
      catchError((err) => throwError(err))
    )
  );

  addTemplate$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateOvertimeAction.AddTemplate),
      switchMap((pram) => this.templateOvertimeService.addOne(pram.template).pipe(
        map(_ => TemplateOvertimeAction.loadInit({ templateOvertimeDTO: { take: 30, skip: 0 } })),
        catchError((err) => {
            this.store.dispatch(TemplateOvertimeAction.HandleTemplateError());
            return throwError(err);
          }
        )
      ))
    ));

  updateTemplate = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateOvertimeAction.updateTemplate),
      switchMap((pram) => this.templateOvertimeService.update(pram.id, pram.templateOvertime).pipe(
        map(_ => TemplateOvertimeAction.loadInit({ templateOvertimeDTO: { take: 30, skip: 0 } })),
        catchError((err) => {
            this.store.dispatch(TemplateOvertimeAction.HandleTemplateError());
            return throwError(err);
          }
        )
      ))
    ));

  deleteTemplate$ = createEffect(() =>
    this.action$.pipe(
      ofType(TemplateOvertimeAction.deleteTemplate),
      switchMap((pram) => {
          return this.templateOvertimeService.delete(pram.id).pipe(
            map(_ => TemplateOvertimeAction.loadInit(
              { templateOvertimeDTO: { take: 30, skip: 0 } }))
          );
        }
      )
    ));

  constructor(
    private readonly action$: Actions,
    private readonly templateOvertimeService: TemplateOvertimeService,
    private readonly store: Store,
    private readonly message: NzMessageService
  ) {
  }
}
