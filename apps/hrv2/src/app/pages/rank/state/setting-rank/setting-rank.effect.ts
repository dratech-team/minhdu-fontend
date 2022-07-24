import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SettingRankStore } from './setting-rank.store';
import { SettingRankQuery } from './setting-rank.query';
import { PaginationDto } from '@minhdu-fontend/constants';
import { SettingRankService } from '../../service/setting-rank.service';
import { SettingRankActions } from './setting-rank.action';
import { SearchSettingRankDto } from '../../dto/setting-rank/search-setting-rank.dto';

@Injectable()
export class SettingRankEffect {
  constructor(
    private readonly action$: Actions,
    private readonly settingRankStore: SettingRankStore,
    private readonly rankQuery: SettingRankQuery,
    private readonly settingRankService: SettingRankService,
    private readonly message: NzMessageService
  ) {}

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(SettingRankActions.loadAll),
    switchMap((props: SearchSettingRankDto) => {
      this.settingRankStore.update((state) =>
        Object.assign(
          {
            ...state,
          },
          props.isSet ? { loadMore: true } : { loading: true }
        )
      );
      Object.assign(props.search, {
        take: PaginationDto.take,
        skip: props.isSet ? this.rankQuery.getCount() : PaginationDto.skip,
      });
      return this.settingRankService.pagination(props).pipe(
        map((res) => {
          this.settingRankStore.update((state) =>
            Object.assign(
              {
                ...state,
                total: res.total,
              },
              props.isSet ? { loadMore: false } : { loading: false }
            )
          );
          if (res.data.length === 0) {
            this.message.info('Đã lấy hết cài đặt xếp hạng');
          }
          if (props.isSet) {
            this.settingRankStore.add(res.data);
          } else {
            this.settingRankStore.set(res.data);
          }
        }),
        catchError((err) => {
          this.settingRankStore.update((state) =>
            Object.assign(
              {
                ...state,
              },
              props.isSet ? { loadMore: false } : { loading: false }
            )
          );
          return of(SettingRankActions.error(err));
        })
      );
    })
  );

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(SettingRankActions.addOne),
    switchMap((props) => {
      this.settingRankStore.update((state) => ({
        ...state,
        added: false,
      }));
      return this.settingRankService.addOne(props).pipe(
        tap((res) => {
          this.message.success('Thêm cài đặt xếp hạng thành công');
          this.settingRankStore.update((state) => ({
            ...state,
            added: true,
          }));
          this.settingRankStore.add(res);
        }),
        catchError((err) => {
          this.settingRankStore.update((state) => ({
            ...state,
            added: null,
          }));
          return of(SettingRankActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadOne$ = this.action$.pipe(
    ofType(SettingRankActions.loadOne),
    switchMap((props) =>
      this.settingRankService.getOne(props).pipe(
        map((res) => this.settingRankStore.upsert(res.id, res)),
        catchError((err) => of(SettingRankActions.error(err)))
      )
    )
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(SettingRankActions.update),
    switchMap((props) => {
      this.settingRankStore.update((state) => ({
        ...state,
        added: false,
      }));
      return this.settingRankService.update(props).pipe(
        tap((response) => {
          this.settingRankStore.update((state) => ({
            ...state,
            added: true,
          }));
          this.settingRankStore.update(response.id, response);
        }),
        catchError((err) => {
          this.settingRankStore.update((state) => ({
            ...state,
            added: null,
          }));
          return of(SettingRankActions.error(err));
        })
      );
    })
  );

  @Effect()
  remove$ = this.action$.pipe(
    ofType(SettingRankActions.remove),
    switchMap((props) => {
      this.settingRankStore.update((state) => ({
        ...state,
        deleted: false,
      }));
      return this.settingRankService.delete(props.id).pipe(
        map(() => {
          this.settingRankStore.update((state) => ({
            ...state,
            deleted: true,
          }));
          this.message.success('Xoá xếp hạng thành công');
          return this.settingRankStore.remove(props.id);
        }),
        catchError((err) => {
          this.settingRankStore.update((state) => ({
            ...state,
            deleted: null,
          }));
          return of(SettingRankActions.error(err));
        })
      );
    })
  );
}
