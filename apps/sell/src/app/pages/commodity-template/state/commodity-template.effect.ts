import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommodityTemplateService } from '../services';
import { CommodityTemplateStore } from './commodity-template.store';
import { CommodityTemplateActions } from './commodity-template.action';
import { UpdateCommodityTemplateDto } from '../dto/update-commodity-template.dto';
import { CommodityTemplateQuery } from './commodity-template.query';

@Injectable()
export class CommodityTemplateEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: CommodityTemplateService,
    private readonly store: CommodityTemplateStore,
    private readonly query: CommodityTemplateQuery,
    private readonly message: NzMessageService
  ) {
  }

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(CommodityTemplateActions.addOne),
    switchMap((props) => {
      return this.service.addOne(props).pipe(
        tap((res) => {
          this.store.upsert(res.id, res);
        }),
        catchError((err) => {
          return of(CommodityTemplateActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(CommodityTemplateActions.loadAll),
    switchMap((props) => {
      this.store.update((state) => ({ ...state, loading: true }));
      return this.service.pagination(props).pipe(
        tap((res) => {
          this.store.update((state) => ({ ...state, loading: false }));
          if (props.isPaginate) {
            this.store.add(res.data);
          } else {
            this.store.set(res.data);
          }
          this.store.update(state => ({
            ...state,
            remain: res.total - this.query.getCount()
          }));
        }),
        catchError((err) => {
          this.store.update((state) => ({ ...state, loading: false }));
          return of(CommodityTemplateActions.error(err));
        })
      );
    })
  );

  @Effect()
  getOne$ = this.action$.pipe(
    ofType(CommodityTemplateActions.loadOne),
    switchMap((props) => {
      return this.service.getOne(props).pipe(
        tap((res) => {
          this.store.update(res?.id, res);
        }),
        catchError((err) => {
          return of(CommodityTemplateActions.error(err));
        })
      );
    })
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(CommodityTemplateActions.update),
    switchMap((props: UpdateCommodityTemplateDto) => {
      return this.service.update(props).pipe(
        tap((res) => {
          this.store.update(res?.id, res);
        }),
        catchError((err) => {
          return of(CommodityTemplateActions.error(err));
        })
      );
    })
  );

  @Effect()
  delete$ = this.action$.pipe(
    ofType(CommodityTemplateActions.remove),
    switchMap((props) => {
      return this.service.delete(props.id).pipe(
        tap((_) => {
          this.message.success('Xoá bản mẫu thành công');
          this.store.update((state) => ({
            ...state,
            total: state.total - 1
          }));
          this.store.remove(props?.id);
        }),
        catchError((err) => {
          return of(CommodityTemplateActions.error(err));
        })
      );
    })
  );
}
