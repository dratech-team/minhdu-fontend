import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SettingBonusStore } from './setting-bonus.store';
import { SettingBonusQuery } from './setting-bonus.query';
import { PaginationDto } from '@minhdu-fontend/constants';
import { SearchSettingBonusDto } from '../../dto/setting-bonus/search-setting-bonus.dto';
import { SettingBonusActions } from './setting-bonus.action';
import { SettingBonusService } from '../../service/setting-bonus.service';

@Injectable()
export class SettingBonusEffect {
  constructor(
    private readonly action$: Actions,
    private readonly settingBonusStore: SettingBonusStore,
    private readonly settingBonusQuery: SettingBonusQuery,
    private readonly settingBonusService: SettingBonusService,
    private readonly message: NzMessageService
  ) {}

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(SettingBonusActions.loadAll),
    switchMap((props: SearchSettingBonusDto) => {
      this.settingBonusStore.update((state) =>
        Object.assign(
          {
            ...state,
          },
          props.isPaginate ? { loadMore: true } : { loading: true }
        )
      );
      Object.assign(props.search, {
        take: PaginationDto.take,
        skip: props.isPaginate
          ? this.settingBonusQuery.getCount()
          : PaginationDto.skip,
      });
      return this.settingBonusService.pagination(props).pipe(
        map((res) => {
          this.settingBonusStore.update((state) =>
            Object.assign(
              {
                ...state,
                total: res.total,
              },
              props.isPaginate ? { loadMore: false } : { loading: false }
            )
          );
          if (res.data.length === 0) {
            this.message.info('Đã lấy hết cài đặt thưởng');
          }
          if (props.isPaginate) {
            this.settingBonusStore.add(res.data);
          } else {
            this.settingBonusStore.set(res.data);
          }
        }),
        catchError((err) => {
          this.settingBonusStore.update((state) =>
            Object.assign(
              {
                ...state,
              },
              props.isPaginate ? { loadMore: false } : { loading: false }
            )
          );
          return of(SettingBonusActions.error(err));
        })
      );
    })
  );

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(SettingBonusActions.addOne),
    switchMap((props) => {
      this.settingBonusStore.update((state) => ({
        ...state,
        added: false,
      }));
      return this.settingBonusService.addOne(props).pipe(
        tap((res) => {
          this.message.success('Thêm cài đặt xếp hạng thành công');
          this.settingBonusStore.update((state) => ({
            ...state,
            added: true,
          }));
          this.settingBonusStore.add(res);
        }),
        catchError((err) => {
          this.settingBonusStore.update((state) => ({
            ...state,
            added: null,
          }));
          return of(SettingBonusActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadOne$ = this.action$.pipe(
    ofType(SettingBonusActions.loadOne),
    switchMap((props) =>
      this.settingBonusService.getOne(props).pipe(
        map((res) => this.settingBonusStore.upsert(res.id, res)),
        catchError((err) => of(SettingBonusActions.error(err)))
      )
    )
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(SettingBonusActions.update),
    switchMap((props) => {
      this.settingBonusStore.update((state) => ({
        ...state,
        added: false,
      }));
      return this.settingBonusService.update(props).pipe(
        tap((response) => {
          this.settingBonusStore.update((state) => ({
            ...state,
            added: true,
          }));
          this.settingBonusStore.update(response.id, response);
        }),
        catchError((err) => {
          this.settingBonusStore.update((state) => ({
            ...state,
            added: null,
          }));
          return of(SettingBonusActions.error(err));
        })
      );
    })
  );

  @Effect()
  remove$ = this.action$.pipe(
    ofType(SettingBonusActions.remove),
    switchMap((props) => {
      this.settingBonusStore.update((state) => ({
        ...state,
        deleted: false,
      }));
      return this.settingBonusService.delete(props.id).pipe(
        map(() => {
          this.settingBonusStore.update((state) => ({
            ...state,
            deleted: true,
          }));
          this.message.success('Xoá xếp hạng thành công');
          return this.settingBonusStore.remove(props.id);
        }),
        catchError((err) => {
          this.settingBonusStore.update((state) => ({
            ...state,
            deleted: null,
          }));
          return of(SettingBonusActions.error(err));
        })
      );
    })
  );
}
