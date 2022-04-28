import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd/message';
import {BranchStore} from "./branch.store";
import {BranchQuery} from "./branch.query";
import {BranchService} from "../services/branch.service";
import {BranchActions} from "./branch.actions";
import {SearchBranchDto} from "../dto";
import {PositionStore} from "../../position/state";

@Injectable()
export class BranchEffects {
  constructor(
    private readonly action$: Actions,
    private readonly branchStore: BranchStore,
    private readonly branchQuery: BranchQuery,
    private readonly positionStore: PositionStore,
    private readonly branchService: BranchService,
    private readonly message: NzMessageService,
  ) {
  }

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(BranchActions.loadAll),
    switchMap((props) => {
      this.branchStore.update(state => ({
        ...state, loading: true
      }));
      return this.branchService.pagination(props as SearchBranchDto).pipe(
        map((response) => {
          this.branchStore.update(state => ({...state, loading: false, total: response.total}));
          if (response.data.length === 0) {
            this.message.warning('Đã lấy hết đơn vị');
          } else {
            this.message.success('tải danh sách đơn vị thành công');
          }
          if(response.data.length === 1 && response.data[0].positions){
            this.positionStore.set(response.data[0].positions)
          }
          if (props.isPaginate) {
            this.branchStore.add(response.data);
          } else {
            this.branchStore.set(response.data);
          }
        }),
        catchError((err) => {
          this.branchStore.update(state => ({
            ...state, loading: false
          }));
          return of(BranchActions.error(err))
        })
      );
    }),
  );

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(BranchActions.addOne),
    switchMap((props) => {
      this.branchStore.update(state => ({
        ...state, added: false
      }));
      return this.branchService.addOne(props).pipe(
        tap((res) => {
            this.message.success('Thêm đơn vị thành công')
            this.branchStore.update(state => ({
              ...state, added: true
            }));
            this.branchStore.add(res);
          }
        ),
        catchError(err => {
          this.branchStore.update(state => ({
            ...state, added: null
          }));
          return of(BranchActions.error(err))
        }),
      );
    }),
  );

  @Effect()
  getCustomer$ = this.action$.pipe(
    ofType(BranchActions.loadOne),
    switchMap((props) => this.branchService.getOne(props).pipe(
      map(branch => this.branchStore.upsert(branch.id, branch)),
      catchError((err) => of(BranchActions.error(err)))
    )),
  );

  @Effect()
  updateCustomer$ = this.action$.pipe(
    ofType(BranchActions.update),
    switchMap((props) => {
        this.branchStore.update(state => ({
          ...state, added: false
        }));
        return this.branchService.update(props).pipe(
          tap(response => {
            this.branchStore.update(state => ({
              ...state, added: true
            }));
            this.branchStore.update(response.id, response);
          }),
          catchError(err =>{
              this.branchStore.update(state => ({
                ...state, added: null
              }));
              return of(BranchActions.error(err))
            }
          )
        );
      }
    )
  );

  @Effect()
  remove$ = this.action$.pipe(
    ofType(BranchActions.remove),
    switchMap((props) => this.branchService.delete(props.id).pipe(
      map(() =>{
          this.message.success('Xoá khách hàng thành công')
          return  this.branchStore.remove(props.id)
        }
      ),
      catchError((err) => of(BranchActions.error(err)))
    ))
  );

  @Effect()
  deleteAllowance$ = this.action$.pipe(
    ofType(BranchActions.deleteAllowance),
    switchMap((props) => this.branchService.deleteAllowanceInBranch(props.salaryId).pipe(
      map((branch) =>{
          this.message.success('Xoá Phụ cấp cho đơn vị thành công')
          return  this.branchStore.update(branch.id, branch)
        }
      ),
      catchError((err) => of(BranchActions.error(err)))
    ))
  );

}
