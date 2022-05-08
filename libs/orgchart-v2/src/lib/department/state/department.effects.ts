import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd/message';
import {DepartmentStore} from "./department.store";
import {DepartmentQuery} from "./department.query";
import {DepartmentService} from "../services/department.service";
import {DepartmentActions} from "./department.actions";

@Injectable()
export class DepartmentEffects {
  constructor(
    private readonly action$: Actions,
    private readonly departmentStore: DepartmentStore,
    private readonly departmentQuery: DepartmentQuery,
    private readonly departmentService: DepartmentService,
    private readonly message: NzMessageService,
  ) {
  }

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(DepartmentActions.loadAll),
    switchMap((props) => {
      this.departmentStore.update(state => ({
        ...state, loading: true
      }));
      console.log(props)
      return this.departmentService.pagination(props).pipe(
        map((response) => {
          console.log(response)
          this.departmentStore.update(state => ({...state, loading: false, total: response.total}));
          if (response.data.length === 0) {
            this.message.warning('Đã lấy hết phòng ban');
          } else {
            this.message.success('tải danh sách phòng ban thành công');
          }
          if (props.isPaginate) {
            this.departmentStore.add(response.data);
          } else {
            this.departmentStore.set(response.data);
          }
        }),
        catchError((err) => {
          this.departmentStore.update(state => ({
            ...state, loading: false
          }));
          return of(DepartmentActions.error(err))
        })
      );
    }),
  );

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(DepartmentActions.addOne),
    switchMap((props) => {
      this.departmentStore.update(state => ({
        ...state, addeds: false
      }));
      return this.departmentService.addOne(props).pipe(
        tap((res) => {
            this.message.success('Thêm đơn vị thành công')
            this.departmentStore.update(state => ({
              ...state, addeds: true
            }));
            this.departmentStore.add(res);
          }
        ),
        catchError(err => {
          this.departmentStore.update(state => ({
            ...state, addeds: null
          }));
          return of(DepartmentActions.error(err))
        }),
      );
    }),
  );

  @Effect()
  getCustomer$ = this.action$.pipe(
    ofType(DepartmentActions.loadOne),
    switchMap((props) => this.departmentService.getOne(props).pipe(
      map(branch => this.departmentStore.upsert(branch.id, branch)),
      catchError((err) => of(DepartmentActions.error(err)))
    )),
  );

  @Effect()
  updateCustomer$ = this.action$.pipe(
    ofType(DepartmentActions.update),
    switchMap((props) => {
        this.departmentStore.update(state => ({
          ...state, addeds: false
        }));
        return this.departmentService.update(props).pipe(
          tap(response => {
            this.departmentStore.update(state => ({
              ...state, addeds: true
            }));
            this.departmentStore.update(response.id, response);
          }),
          catchError(err => {
              this.departmentStore.update(state => ({
                ...state, addeds: null
              }));
              return of(DepartmentActions.error(err))
            }
          )
        );
      }
    )
  );

  @Effect()
  remove$ = this.action$.pipe(
    ofType(DepartmentActions.remove),
    switchMap((props) => this.departmentService.delete(props.id).pipe(
      map(() => {
          this.message.success('Xoá khách hàng thành công')
          return this.departmentStore.remove(props.id)
        }
      ),
      catchError((err) => of(DepartmentActions.error(err)))
    ))
  );

  @Effect()
  removeEmployee$ = this.action$.pipe(
    ofType(DepartmentActions.removeEmployee),
    switchMap((props) => {
      this.departmentStore.update(state => ({
        ...state, removeEmp: false
      }))
        return this.departmentService.removeEmployee(props.id, props.body).pipe(
          map(_ => {
              this.departmentStore.update(state => ({
                ...state, removeEmp: true
              }))
              this.message.success('Xoá nhân viên khỏi phòng ban thành công')
            }
          ),
          catchError((err) => of(DepartmentActions.error(err)))
        )
      }
    )
  );

}