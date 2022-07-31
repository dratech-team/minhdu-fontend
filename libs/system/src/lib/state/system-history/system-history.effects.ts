import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SystemHistoryActions } from './system-history.actions';
import { SystemHistoryStore } from './system-history.store';
import { RemoveAccountDto } from '../../dto/account/remove-account.dto';
import { PaginationDto } from '@minhdu-fontend/constants';
import { SystemHistoryQuery } from './system-history.query';
import { SystemHistoryService } from '../../services/system-history.service';
import { AddSystemHistoryDto } from '../../dto/system-history/add-system-history.dto';
import { SearchSystemHistoryDto } from '../../dto/system-history/search-system-history.dto';

@Injectable()
export class SystemHistoryEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly accountService: SystemHistoryService,
    private readonly message: NzMessageService,
    private readonly systemHistoryStore: SystemHistoryStore,
    private readonly systemHistoryQuery: SystemHistoryQuery
  ) {}

  @Effect()
  addOne$ = this.actions$.pipe(
    ofType(SystemHistoryActions.addOne),
    switchMap((props: AddSystemHistoryDto) => {
      this.systemHistoryStore.update((state) => ({
        ...state,
        loading: true,
      }));
      return this.accountService.addOne(props).pipe(
        tap((res) => {
          this.message.success('Thêm lịch sử hệ thống thành công');
          this.systemHistoryStore.update((state) => ({
            ...state,
            loading: false,
          }));
          this.systemHistoryStore.add(res);
        }),
        catchError((err) => {
          this.systemHistoryStore.update((state) => ({
            ...state,
            loading: undefined,
          }));
          return of(SystemHistoryActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadAll$ = this.actions$.pipe(
    ofType(SystemHistoryActions.loadAll),
    switchMap((props: SearchSystemHistoryDto) => {
      this.systemHistoryStore.update((state) => ({
        ...state,
        loading: true,
      }));
      Object.assign(props.search, {
        take: PaginationDto.take,
        skip: props.isSet
          ? this.systemHistoryQuery.getCount()
          : PaginationDto.skip,
      });
      return this.accountService.pagination(props).pipe(
        map((res) => {
          if (props.isSet) {
            this.systemHistoryStore.add(res.data);
          } else {
            this.systemHistoryStore.set(res.data);
          }
          this.systemHistoryStore.update((state) => ({
            ...state,
            loading: false,
            total: res.total,
            remain: res.total - this.systemHistoryQuery.getCount(),
          }));
        }),
        catchError((err) => {
          this.systemHistoryStore.update((state) => ({
            ...state,
            loading: undefined,
          }));
          return of(SystemHistoryActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadOne$ = this.actions$.pipe(
    ofType(SystemHistoryActions.loadOne),
    switchMap((props) => {
      return this.accountService.getOne(props).pipe(
        map((res) => {
          this.message.success('Tải lịch sử hệ thống thành công');
          this.systemHistoryStore.upsert(res.id, res);
        }),
        catchError((err) => {
          return of(SystemHistoryActions.error(err));
        })
      );
    })
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType(SystemHistoryActions.update),
    switchMap((props) => {
      this.systemHistoryStore.update((state) => ({
        ...state,
        loading: true,
      }));
      return this.accountService.update(props).pipe(
        map((res) => {
          this.systemHistoryStore.update((state) => ({
            ...state,
            loading: false,
          }));
          this.message.success('Cập nhật lịch sử hệ thống thành công');
          this.systemHistoryStore.update(res.id, res);
        }),
        catchError((err) => {
          this.systemHistoryStore.update((state) => ({
            ...state,
            loading: undefined,
          }));
          return of(SystemHistoryActions.error(err));
        })
      );
    })
  );

  @Effect()
  remove$ = this.actions$.pipe(
    ofType(SystemHistoryActions.remove),
    switchMap((props: RemoveAccountDto) => {
      return this.accountService.delete(props.id).pipe(
        map((_) => {
          this.message.success('Xoá lịch sử hệ thống thành công');
          this.systemHistoryStore.remove(props.id);
        }),
        catchError((err) => {
          return of(SystemHistoryActions.error(err));
        })
      );
    })
  );
}
