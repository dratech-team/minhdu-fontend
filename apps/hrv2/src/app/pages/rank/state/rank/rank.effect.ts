import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd/message';
import {RankStore} from "./rank.store";
import {RankQuery} from "./rank.query";
import {RankService} from "../../service/rank.service";
import {RankActions} from "./rank.action";
import {SearchRankDto} from "../../dto/rank/search-rank.dto";
import {PaginationDto} from "@minhdu-fontend/constants";

@Injectable()
export class RankEffect {
  constructor(
    private readonly action$: Actions,
    private readonly rankStore: RankStore,
    private readonly rankQuery: RankQuery,
    private readonly rankService: RankService,
    private readonly message: NzMessageService,
  ) {
  }

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(RankActions.loadAll),
    switchMap((props: SearchRankDto) => {
      this.rankStore.update(state => (
        Object.assign({
            ...state,
          }, props.isPaginate
            ? {loadMore: true}
            : {loading: true}
        )
      ));
      Object.assign(props.search,
        {
          take: PaginationDto.take,
          skip: props.isPaginate ? this.rankQuery.getCount() : PaginationDto.skip
        }
      )
      return this.rankService.pagination(props).pipe(
        map((res) => {
          this.rankStore.update(state => (  Object.assign({
                ...state, total: res.total
              }, props.isPaginate
                ? {loadMore: false}
                : {loading: false}
            )
          ));
          if(res.data.length === 0){
            this.message.info('Đã lấy hết xếp hạng')
          }
          if (props.isPaginate) {
            this.rankStore.add(res.data);
          } else {
            this.rankStore.set(res.data);
          }
        }),
        catchError((err) => {
          this.rankStore.update(state => (  Object.assign({
                ...state
              }, props.isPaginate
                ? {loadMore: false}
                : {loading: false}
            )
          ));
          return of(RankActions.error(err))
        })
      );
    }),
  );

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(RankActions.addOne),
    switchMap((props) => {
      this.rankStore.update(state => ({
        ...state, added: false
      }));
      return this.rankService.addOne(props).pipe(
        tap((res) => {
            this.message.success('Thêm xếp hạng thành công')
            this.rankStore.update(state => ({
              ...state, added: true
            }));
            this.rankStore.add(res);
          }
        ),
        catchError(err => {
          this.rankStore.update(state => ({
            ...state, added: null
          }));
          return of(RankActions.error(err))
        }),
      );
    }),
  );

  @Effect()
  loadOne$ = this.action$.pipe(
    ofType(RankActions.loadOne),
    switchMap((props) => this.rankService.getOne(props).pipe(
      map(res => this.rankStore.upsert(res.id, res)),
      catchError((err) => of(RankActions.error(err)))
    )),
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(RankActions.update),
    switchMap((props) => {
        this.rankStore.update(state => ({
          ...state, added: false
        }));
        return this.rankService.update(props).pipe(
          tap(response => {
            this.rankStore.update(state => ({
              ...state, added: true
            }));
            this.rankStore.update(response.id, response);
          }),
          catchError(err => {
              this.rankStore.update(state => ({
                ...state, added: null
              }));
              return of(RankActions.error(err))
            }
          )
        );
      }
    )
  );

  @Effect()
  remove$ = this.action$.pipe(
    ofType(RankActions.remove),
    switchMap((props) => {
        this.rankStore.update(state => ({
          ...state, deleted: false
        }))
        return this.rankService.delete(props.id).pipe(
          map(() => {
              this.rankStore.update(state => ({
                ...state, deleted: true
              }))
              this.message.success('Xoá xếp hạng thành công')
              return this.rankStore.remove(props.id)
            }
          ),
          catchError((err) => {
              this.rankStore.update(state => ({
                ...state, deleted: null
              }))
              return of(RankActions.error(err))
            }
          )
        )
      }
    )
  );
}
