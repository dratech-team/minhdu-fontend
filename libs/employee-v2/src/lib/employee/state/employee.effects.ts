import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Actions, Effect, ofType} from "@datorama/akita-ng-effects";
import {EmployeeService} from "../services/employee.service";
import {EmployeeStore} from "./employee.store";
import {EmployeeAction} from "./employee.actions";
import {RemoveEmployeeDto, SearchEmployeeDto} from "../dto/employee";
import {RelativeService} from "../services/relative.service";
import {DegreeService} from "../services/degree.service";
import {PaginationDto} from "@minhdu-fontend/constants";

@Injectable()
export class EmployeeEffect {
  constructor(
    private readonly actions$: Actions,
    private readonly employeeStore: EmployeeStore,
    private readonly employeeService: EmployeeService,
    private readonly relativeService: RelativeService,
    private readonly degreeService: DegreeService,
    private readonly message: NzMessageService,
  ) {
  }

  @Effect()
  addOne$ = this.actions$.pipe(
    ofType(EmployeeAction.addOne),
    switchMap((props) => {
        this.employeeStore.update(state => ({
          ...state, added: false
        }))
        return this.employeeService.addOne(props).pipe(
          map((res) => {
            this.employeeStore.update(state => ({
              ...state, added: true
            }))
            this.message.info('Thêm nhân viên thành công')
            this.employeeStore.add(res)
          }),
          catchError((err) => {
            this.employeeStore.update(state => ({
              ...state, added: true
            }))
            return of(EmployeeAction.error(err))
          })
        )
      }
    )
  );

  addOneRelative$ = this.actions$.pipe(
    ofType(EmployeeAction.addOneRelative),
    switchMap((props) => {
        this.employeeStore.update(state => ({
          ...state, added: false
        }))
        return this.relativeService.addOneRelative(props).pipe(
          map((res) => {
            this.employeeStore.update(state => ({
              ...state, added: true
            }))
            this.message.info('Thêm người thân thành công')
            this.employeeStore.update(res.id, res)
          }),
          catchError((err) => {
            this.employeeStore.update(state => ({
              ...state, added: true
            }))
            return of(EmployeeAction.error(err))
          })
        )
      }
    )
  );

  addOneDegree$ = this.actions$.pipe(
    ofType(EmployeeAction.addOneDegree),
    switchMap((props) => {
        this.employeeStore.update(state => ({
          ...state, added: false
        }))
        return this.degreeService.addOneDegree(props).pipe(
          map((res) => {
            this.employeeStore.update(state => ({
              ...state, added: true
            }))
            this.message.info('Thêm bằng cấp thành công')
            this.employeeStore.update(res.id, res)
          }),
          catchError((err) => {
            this.employeeStore.update(state => ({
              ...state, added: true
            }))
            return of(EmployeeAction.error(err))
          })
        )
      }
    )
  );

  loadAll$ = this.actions$.pipe(
    ofType(EmployeeAction.loadAll),
    switchMap((props) => {
        this.employeeStore.update(state => ({
          ...state, loading: true
        }))
        return this.employeeService.pagination(props).pipe(
          map((res) => {
            this.employeeStore.update(state => ({
              ...state, loading: false, total: res.total
            }))
            if (res.data.length === 0) {
              this.message.info('Đã lấy hết nhân viên')
              if (props.isPaginate) {
                this.employeeStore.set(res.data)
              }
            } else {
              if (props.isPaginate) {
                this.employeeStore.add(res.data)
              } else {
                this.employeeStore.set(res.data)
              }
            }
          }),
          catchError((err) => of(EmployeeAction.error(err)))
        )
      }
    )
  );


  loadOne$ = this.actions$.pipe(
    ofType(EmployeeAction.loadOne),
    switchMap((props) => {
        return this.employeeService.getOne(props).pipe(
          map((res) => {
            this.message.info('Tải nhân viên thành công')
            this.employeeStore.upsert(res.id, res)
          }),
          catchError((err) => {
            return of(EmployeeAction.error(err))
          })
        )
      }
    )
  );


  update$ = this.actions$.pipe(
    ofType(EmployeeAction.update),
    switchMap((props) => {
        this.employeeStore.update(state => ({
          ...state, added: false
        }))
        return this.employeeService.update(props).pipe(
          map((res) => {
            this.employeeStore.update(state => ({
              ...state, added: true
            }))
            this.message.info('Cập nhật nhân viên thành công')
            this.employeeStore.update(res.id, res)
          }),
          catchError((err) => {
            this.employeeStore.update(state => ({
              ...state, added: true
            }))
            return of(EmployeeAction.error(err))
          })
        )
      }
    )
  );

  updateRelative$ = this.actions$.pipe(
    ofType(EmployeeAction.updateRelative),
    switchMap((props) => {
        return this.relativeService.update(props).pipe(
          map((res) => {
            this.message.info('Cập nhật người thân thành công')
            this.employeeStore.update(res.id, res)
          }),
          catchError((err) => {
            return of(EmployeeAction.error(err))
          })
        )
      }
    )
  );

  updateDegree$ = this.actions$.pipe(
    ofType(EmployeeAction.updateDegree),
    switchMap((props) => {
        return this.degreeService.update(props).pipe(
          map((res) => {
            this.message.info('Cập nhật bằng cấp thành công')
            this.employeeStore.update(res.id, res)
          }),
          catchError((err) => {
            return of(EmployeeAction.error(err))
          })
        )
      }
    )
  );

  updateHistorySalary$ = this.actions$.pipe(
    ofType(EmployeeAction.updateHistorySalary),
    switchMap((props) => {
        return this.employeeService.updateHistorySalary(props.id, props.salary).pipe(
          map((res) => {
            this.message.info('Cập nhật lịch sử lương thành công')
            this.actions$.dispatch(EmployeeAction.loadOne({id: props.id}))
          }),
          catchError((err) => {
            return of(EmployeeAction.error(err))
          })
        )
      }
    )
  );

  removeEmployee$ = this.actions$.pipe(
    ofType(EmployeeAction.remove),
    switchMap((props: RemoveEmployeeDto) => {
        return this.employeeService.delete(props.id).pipe(
          map((res) => {
            this.message.info('Xoá nhân viên thành công')
            this.employeeStore.remove(props.id)
          }),
          catchError((err) => {
            return of(EmployeeAction.error(err))
          })
        )
      }
    )
  );

  leaveEmployee$ = this.actions$.pipe(
    ofType(EmployeeAction.leave),
    switchMap((props) => {
        return this.employeeService.leaveEmployee(props.id, props.body).pipe(
          map((res) => {
            this.message.info(props.body?.leftAt ?
              'Nhân viên đã nghỉ tạm thời' :
              'Đã khôi phục nhân viên thành công')
            this.actions$.dispatch(EmployeeAction.loadAll({
              search: {take: PaginationDto.take, skip: PaginationDto.skip}
            }))
          }),
          catchError((err) => {
            return of(EmployeeAction.error(err))
          })
        )
      }
    )
  );

  removeRelative$ = this.actions$.pipe(
    ofType(EmployeeAction.removeRelative),
    switchMap((props) => {
        return this.relativeService.deleteRelative(props.id).pipe(
          map((res) => {
            this.message.info('Xoá người thân thành công')
            this.employeeStore.update(res.id, res)
          }),
          catchError((err) => {
            return of(EmployeeAction.error(err))
          })
        )
      }
    )
  );

  removeDegree$ = this.actions$.pipe(
    ofType(EmployeeAction.removeDegree),
    switchMap((props) => {
        return this.degreeService.deleteDegree(props.id).pipe(
          map((res) => {
            this.message.info('Xoá bằng cấp thành công')
            this.employeeStore.update(res.id, res)
          }),
          catchError((err) => {
            return of(EmployeeAction.error(err))
          })
        )
      }
    )
  );

  removeContracts$ = this.actions$.pipe(
    ofType(EmployeeAction.removeContracts),
    switchMap((props) => {
        return this.degreeService.deleteContracts(props.id).pipe(
          map((res) => {
            this.message.info('Xóa bằng hợp đồng thành công')
            this.actions$.dispatch(EmployeeAction.loadOne({
              id: props.id
            }))
          }),
          catchError((err) => {
            return of(EmployeeAction.error(err))
          })
        )
      }
    )
  );

  removeWorkHistory$ = this.actions$.pipe(
    ofType(EmployeeAction.removeWorkHistory),
    switchMap((props) => {
        return this.employeeService.deleteWorkHistory(props.id).pipe(
          map((res) => {
            this.message.info('Xoá lịch sử công tác thành công')
            this.actions$.dispatch(EmployeeAction.loadOne({
              id: props.id
            }))
          }),
          catchError((err) => {
            return of(EmployeeAction.error(err))
          })
        )
      }
    )
  );

  removeHistorySalary$ = this.actions$.pipe(
    ofType(EmployeeAction.removeHistorySalary),
    switchMap((props) => {
        return this.employeeService.deleteHistorySalary(props.id).pipe(
          map((res) => {
            this.message.info('Xoá lịch sử lương thành công')
            this.actions$.dispatch(EmployeeAction.loadOne({
              id: props.id
            }))
          }),
          catchError((err) => {
            return of(EmployeeAction.error(err))
          })
        )
      }
    )
  );
}
