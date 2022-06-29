import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommodityTemplateService } from '../services';
import { CommodityTemplateStore } from './commodity-template.store';
import { CommodityTemplateActions } from './commodity-template.action';
import { SearchCommodityTemplateDto } from '../dto/search-commodity-template.dto';
import { UpdateCommodityTemplateDto } from '../dto/update-commodity-template.dto';

@Injectable()
export class CommodityTemplateEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: CommodityTemplateService,
    private readonly store: CommodityTemplateStore,
    private readonly message: NzMessageService
  ) {}

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(CommodityTemplateActions.addOne),
    switchMap((props) => {
      this.store.update((state) => ({
        ...state,
        added: false,
      }));
      return this.service.addOne(props).pipe(
        tap((res) => {
          this.store.update((state) => ({
            ...state,
            added: true,
            total: state.total + 1,
          }));
          this.store.upsert(res.id, res);
        }),
        catchError((err) => {
          this.store.update((state) => ({
            ...state,
            added: true,
          }));
          return of(CommodityTemplateActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(CommodityTemplateActions.loadAll),
    switchMap((props) => {
      this.store.update((state) =>
        Object.assign(
          {
            ...state,
          },
          props.isPaginate ? { loadMore: true } : { loading: true }
        )
      );
      return this.service.pagination(props).pipe(
        tap((res) => {
          this.store.update((state) =>
            Object.assign(
              {
                ...state,
                total: res.total,
              },
              props.isPaginate ? { loadMore: false } : { loading: false }
            )
          );
          if (res.data.length === 0) {
            this.message.warning('Đã lấy hết bảng mẫu');
          }
          if (props.isPaginate) {
            this.store.add(res.data);
          } else {
            this.store.set(res.data);
          }
        }),
        catchError((err) => {
          this.store.update((state) =>
            Object.assign(
              {
                ...state,
              },
              props.isPaginate ? { loadMore: false } : { loading: false }
            )
          );
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
      this.store.update((state) => ({
        ...state,
        added: false,
      }));
      return this.service.update(props).pipe(
        tap((res) => {
          this.store.update((state) => ({
            ...state,
            added: true,
          }));
          this.store.update(res?.id, res);
        }),
        catchError((err) => {
          this.store.update((state) => ({
            ...state,
            added: null,
          }));
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
            total: state.total - 1,
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
