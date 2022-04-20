import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd/message';
import {PositionStore} from "./position.store";
import {PositionQuery} from "./position.query";
import {PositionActions} from "./position.actions";
import {SearchPositionDto} from "../dto";
import {PositionService} from "../services/position.service";

@Injectable()
export class PositionEffects {
  constructor(
    private readonly action$: Actions,
    private readonly positionStore: PositionStore,
    private readonly positionQuery: PositionQuery,
    private readonly branchService: PositionService,
    private readonly message: NzMessageService,
  ) {
  }

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(PositionActions.loadAll),
    switchMap((props) => {
      this.positionStore.update(state => ({
        ...state, loading: true
      }));
      const params = Object.assign(props.search, props.search?.orderType
        ? {orderType: props.search.orderType === 'ascend' ? 'asc' : 'desc'}
        : {});
      return this.branchService.pagination(params as SearchPositionDto).pipe(
        map((response) => {
          this.positionStore.update(state => ({...state, loading: false, total: response.total}));
          if (response.data.length === 0) {
            this.message.warning('Đã lấy hết đơn vị');
          } else {
            this.message.success('tải danh sách đơn vị thành công');
          }
          if (props.isPaginate) {
            this.positionStore.add(response.data);
          } else {
            this.positionStore.set(response.data);
          }
        }),
        catchError((err) => {
          this.positionStore.update(state => ({
            ...state, loading: false
          }));
          return of(PositionActions.error(err))
        })
      );
    }),

  );

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(PositionActions.addOne),
    switchMap((props) => {
      this.positionStore.update(state => ({
        ...state, added: false
      }));
      return this.branchService.addOne(props).pipe(
        tap((res) => {
            this.message.success('Thêm đơn vị thành công')
            this.positionStore.update(state => ({
              ...state, added: true
            }));
            this.positionStore.add(res);
          }
        ),
        catchError(err => {
          this.positionStore.update(state => ({
            ...state, added: null
          }));
          return of(PositionActions.error(err))
        }),
      );
    }),
  );

  @Effect()
  getCustomer$ = this.action$.pipe(
    ofType(PositionActions.loadOne),
    switchMap((props) => this.branchService.getOne(props).pipe(
      map(branch => this.positionStore.upsert(branch.id, branch)),
      catchError((err) => of(PositionActions.error(err)))
    )),
  );

  @Effect()
  updateCustomer$ = this.action$.pipe(
    ofType(PositionActions.update),
    switchMap((props) => {
        this.positionStore.update(state => ({
          ...state, added: false
        }));
        return this.branchService.update(props).pipe(
          tap(response => {
            this.positionStore.update(state => ({
              ...state, added: true
            }));
            this.positionStore.update(response.id, response);
          }),
          catchError(err =>{
              this.positionStore.update(state => ({
                ...state, added: null
              }));
              return of(PositionActions.error(err))
            }
          )
        );
      }
    )
  );

  @Effect()
  remove$ = this.action$.pipe(
    ofType(PositionActions.remove),
    switchMap((props) => this.branchService.delete(props.id).pipe(
      map(() =>{
          this.message.success('Xoá khách hàng thành công')
          return  this.positionStore.remove(props.id)
        }
      ),
      catchError((err) => of(PositionActions.error(err)))
    ))
  );

}
