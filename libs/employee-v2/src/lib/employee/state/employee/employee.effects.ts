import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {EmployeeService} from '@minhdu-fontend/employee-v2';
import {EmployeeStore} from './employee.store';
import {EmployeeActions} from './employee.actions';
import {RemoveEmployeeDto} from '../../dto/employee';
import {RelativeService} from '../../services/relative.service';
import {DegreeService} from '../../services/degree.service';
import {PaginationDto} from '@minhdu-fontend/constants';
import {EmployeeQuery} from './employee.query';

@Injectable()
export class EmployeeEffect {
  constructor(
    private readonly actions$: Actions,
    private readonly employeeStore: EmployeeStore,
    private readonly employeeQuery: EmployeeQuery,
    private readonly employeeService: EmployeeService,
    private readonly relativeService: RelativeService,
    private readonly degreeService: DegreeService,
    private readonly message: NzMessageService
  ) {
  }

  @Effect()
  addOne$ = this.actions$.pipe(
    ofType(EmployeeActions.addOne),
    switchMap((props) => {
        this.employeeStore.update(state => ({
          ...state, added: false
        }));
        return this.employeeService.addOne(props).pipe(
          map((res) => {
            this.employeeStore.update(state => ({
              ...state, added: true
            }));
            this.message.info('Thêm nhân viên thành công');
            this.employeeStore.add(res);
          }),
          catchError((err) => {
            this.employeeStore.update(state => ({
              ...state, added: null
            }));
            return of(EmployeeActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  addOneRelative$ = this.actions$.pipe(
    ofType(EmployeeActions.addOneRelative),
    switchMap((props) => {
        this.employeeStore.update(state => ({
          ...state, added: false
        }));
        return this.relativeService.addOneRelative(props).pipe(
          map((res) => {
            this.employeeStore.update(state => ({
              ...state, added: true
            }));
            this.message.info('Thêm người thân thành công');
            this.employeeStore.update(res.id, res);
          }),
          catchError((err) => {
            this.employeeStore.update(state => ({
              ...state, added: true
            }));
            return of(EmployeeActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  addOneDegree$ = this.actions$.pipe(
    ofType(EmployeeActions.addOneDegree),
    switchMap((props) => {
        this.employeeStore.update(state => ({
          ...state, added: false
        }));
        return this.degreeService.addOneDegree(props).pipe(
          map((res) => {
            this.employeeStore.update(state => ({
              ...state, added: true
            }));
            this.message.info('Thêm bằng cấp thành công');
            this.employeeStore.update(res.id, res);
          }),
          catchError((err) => {
            this.employeeStore.update(state => ({
              ...state, added: true
            }));
            return of(EmployeeActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  loadAll$ = this.actions$.pipe(
    ofType(EmployeeActions.loadAll),
    switchMap((props) => {
        this.employeeStore.update(state => ({
          ...state, loading: true
        }));
        if (props.search?.orderType) {
          Object.assign(props.search, {orderType: props.search?.orderType === 'ascend' ? 'asc' : 'desc'});
        }
        return this.employeeService.pagination(props).pipe(
          map((res) => {
            this.employeeStore.update(state => ({
              ...state, loading: false, total: res.total
            }));
            if (res.data.length === 0) {
              this.message.info('Đã lấy hết nhân viên');
              if (!props.isPaginate) {
                this.employeeStore.set(res.data);
              }
            } else {
              if (props.isPaginate) {
                this.employeeStore.add(res.data);
              } else {
                this.employeeStore.set(res.data);
              }
            }
          }),
          catchError((err) => of(EmployeeActions.error(err)))
        );
      }
    )
  );

  @Effect()
  loadOne$ = this.actions$.pipe(
    ofType(EmployeeActions.loadOne),
    switchMap((props) => {
        return this.employeeService.getOne(props).pipe(
          map((res) => {
            this.message.info('Tải nhân viên thành công');
            this.employeeStore.upsert(res.id, res);
          }),
          catchError((err) => {
            return of(EmployeeActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType(EmployeeActions.update),
    switchMap((props) => {
        this.employeeStore.update(state => ({
          ...state, added: false
        }));
        return this.employeeService.update(props).pipe(
          map((res) => {
            this.employeeStore.update(state => ({
              ...state, added: true
            }));
            this.message.info('Cập nhật nhân viên thành công');
            this.employeeStore.update(res.id, res);
          }),
          catchError((err) => {
            this.employeeStore.update(state => ({
              ...state, added: true
            }));
            return of(EmployeeActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  updateRelative$ = this.actions$.pipe(
    ofType(EmployeeActions.updateRelative),
    switchMap((props) => {
        return this.relativeService.update(props).pipe(
          map((res) => {
            this.message.info('Cập nhật người thân thành công');
            this.employeeStore.update(res.id, res);
          }),
          catchError((err) => {
            return of(EmployeeActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  updateDegree$ = this.actions$.pipe(
    ofType(EmployeeActions.updateDegree),
    switchMap((props) => {
        return this.degreeService.update(props).pipe(
          map((res) => {
            this.message.info('Cập nhật bằng cấp thành công');
            this.employeeStore.update(res.id, res);
          }),
          catchError((err) => {
            return of(EmployeeActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  updateHistorySalary$ = this.actions$.pipe(
    ofType(EmployeeActions.updateHistorySalary),
    switchMap((props) => {
        return this.employeeService.updateHistorySalary(props.id, props.salary).pipe(
          map((res) => {
            this.message.info(res.message);
            this.actions$.dispatch(EmployeeActions.loadOne({id: props.employeeId}));
          }),
          catchError((err) => {
            return of(EmployeeActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  removeEmployee$ = this.actions$.pipe(
    ofType(EmployeeActions.remove),
    switchMap((props: RemoveEmployeeDto) => {
        return this.employeeService.delete(props.id).pipe(
          map((res) => {
            this.message.info('Xoá nhân viên thành công');
            this.employeeStore.remove(props.id);
          }),
          catchError((err) => {
            return of(EmployeeActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  leaveEmployee$ = this.actions$.pipe(
    ofType(EmployeeActions.leave),
    switchMap((props) => {
        return this.employeeService.leaveEmployee(props.id, props.body).pipe(
          map((res) => {
            this.message.info(props.body?.leftAt ?
              'Nhân viên đã nghỉ tạm thời' :
              'Đã khôi phục nhân viên thành công');
            this.employeeStore.remove(props.id)
          }),
          catchError((err) => {
            return of(EmployeeActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  removeRelative$ = this.actions$.pipe(
    ofType(EmployeeActions.removeRelative),
    switchMap((props) => {
        return this.relativeService.deleteRelative(props.id).pipe(
          map((res) => {
            this.message.info('Xoá người thân thành công');
            this.employeeStore.update(res.id, res);
          }),
          catchError((err) => {
            return of(EmployeeActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  removeDegree$ = this.actions$.pipe(
    ofType(EmployeeActions.removeDegree),
    switchMap((props) => {
        return this.degreeService.deleteDegree(props.id).pipe(
          map((res) => {
            this.message.info('Xoá bằng cấp thành công');
            this.employeeStore.update(res.id, res);
          }),
          catchError((err) => {
            return of(EmployeeActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  removeContracts$ = this.actions$.pipe(
    ofType(EmployeeActions.removeContracts),
    switchMap((props) => {
        return this.degreeService.deleteContracts(props.id).pipe(
          map((res) => {
            this.message.info('Xóa bằng hợp đồng thành công');
            this.actions$.dispatch(EmployeeActions.loadOne({
              id: props.id
            }));
          }),
          catchError((err) => {
            return of(EmployeeActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  removeWorkHistory$ = this.actions$.pipe(
    ofType(EmployeeActions.removeWorkHistory),
    switchMap((props) => {
        return this.employeeService.deleteWorkHistory(props.id).pipe(
          map((res) => {
            this.message.info('Xoá lịch sử công tác thành công');
            this.actions$.dispatch(EmployeeActions.loadOne({
              id: props.id
            }));
          }),
          catchError((err) => {
            return of(EmployeeActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  removeHistorySalary$ = this.actions$.pipe(
    ofType(EmployeeActions.removeHistorySalary),
    switchMap((props) => {
        return this.employeeService.deleteHistorySalary(props.id).pipe(
          map((res) => {
            this.message.info('Xoá lịch sử lương thành công');
            this.actions$.dispatch(EmployeeActions.loadOne({
              id: props.id
            }));
          }),
          catchError((err) => {
            return of(EmployeeActions.error(err));
          })
        );
      }
    )
  );
}
