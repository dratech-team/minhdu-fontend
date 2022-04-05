import {Injectable} from '@angular/core';
import {EmployeeAction, selectorEmployeeTotal} from '@minhdu-fontend/employee';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {throwError} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {DegreeService} from './service/degree.service';
import {EmployeeService} from './service/employee.service';
import {RelativeService} from './service/relative.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {PayrollAction} from "../../../../../apps/hr/src/app/pages/payroll/+state/payroll/payroll.action";
import {ConvertBooleanFrontEnd} from "@minhdu-fontend/enums";

@Injectable()
export class EmployeeEffect {
  constructor(
    private readonly action$: Actions,
    private readonly employeeService: EmployeeService,
    private readonly relativeService: RelativeService,
    private readonly degreeService: DegreeService,
    private readonly message: NzMessageService,
    private readonly store: Store
  ) {
  }

  loadEmployees$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.loadInit),
      switchMap((props) => {
        return this.employeeService.pagination(
          Object.assign({}, props.employee,
            (props?.employee?.isFlatSalary === undefined || props?.employee?.isFlatSalary === null) ? {isFlatSalary: -1} : {})
        );
      }),
      map((responsePagination) => {
        this.message.success('Tải nhân viên thành công');
        return EmployeeAction.LoadEmployeesSuccess({
          employees: responsePagination.data,
          total: responsePagination.total
        });
      }),
      catchError((err) => throwError(err))
    )
  );

  loadMoreEmployees$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.loadMoreEmployees),
      withLatestFrom(this.store.pipe(select(selectorEmployeeTotal))),
      map(([props, skip]) =>
        Object.assign(JSON.parse(JSON.stringify(props.employee)), {
          skip: skip,
          isFlatSalary: (props.employee?.isFlatSalary === undefined || props?.employee?.isFlatSalary === null) ?
            -1 :
            props.employee.isFlatSalary
        })
      ),
      switchMap((props) => {
        return this.employeeService.pagination(props);
      }),
      map((responsePagination) => {
        if (responsePagination.data.length === 0) {
          this.message.warning('Lấy hết nhân viên');
        }
        return EmployeeAction.LoadMoreEmployeesSuccess({
          employees: responsePagination.data,
          total: responsePagination.total
        });
      }),
      catchError((err) => {
        return throwError(err);
      })
    )
  );

  addEmployee$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.addEmployee),
      switchMap((props) => this.employeeService.addOne(props.employee)),
      map((employee) => {
        this.message.success('Thêm nhân viên thành công');
        return EmployeeAction.addEmployeeSuccess({employee: employee});
      }),
      catchError((err) => {
        this.store.dispatch(EmployeeAction.handleEmployeeError());
        return throwError(err);
      })
    )
  );

  addRelative$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.addRelative),
      switchMap((props) => this.relativeService.addOneRelative(props.relative)),
      map((res) => {
        this.message.success('Thêm người thân thành công');
        return EmployeeAction.updateEmployeeSuccess({employee: res});
      }),
      catchError((err) => {
        this.store.dispatch(EmployeeAction.handleRelativeError());
        return throwError(err);
      })
    )
  );

  addDegree$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.addDegree),
      switchMap((props) => this.degreeService.addOneDegree(props.degree)),
      map((res) => {
        this.message.success('Thêm bằng cấp thành công');
        return EmployeeAction.updateEmployeeSuccess({employee: res});
      }),
      catchError((err) => {
        this.store.dispatch(EmployeeAction.handleDegreeError());
        return throwError(err);
      })
    )
  );

  getEmployee$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.getEmployee),
      switchMap((props) => this.employeeService.getOne(props.id)),
      map((employee) => {
        this.message.success('Tải nhân viên thành công');
        return EmployeeAction.getEmployeeSuccess({employee: employee});
      }),
      catchError((err) => throwError(err))
    )
  );

  updateEmployee$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.updateEmployee),
      switchMap((props) =>
        this.employeeService.update(props.id, props.employee)
      ),
      map((res) => {
        this.message.success('Cập nhật nhân viên thành công');
        return EmployeeAction.updateEmployeeSuccess({employee: res});
      }),
      catchError((err) => {
        this.store.dispatch(EmployeeAction.handleEmployeeError());
        return throwError(err);
      })
    )
  );

  updateRelative$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.updateRelative),
      switchMap((props) =>
        this.relativeService.update(props.id, props.relative)
      ),
      map((res) => {
        this.message.success('Cập nhật người thân thành công');
        return EmployeeAction.updateEmployeeSuccess({employee: res});
      }),
      catchError((err) => {
        this.store.dispatch(EmployeeAction.handleDegreeError());
        return throwError(err);
      })
    )
  );

  updateDegree$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.updateDegree),
      switchMap((props) => this.degreeService.update(props.id, props.degree)),
      map((res) => {
        this.message.success('Cập nhật bằng cấp thành công');
        return EmployeeAction.updateEmployeeSuccess({employee: res});
      }),
      catchError((err) => {
        this.store.dispatch(EmployeeAction.handleDegreeError());
        return throwError(err);
      })
    )
  );

  deleteEmployee$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.deleteEmployee),
      switchMap((props) =>
        this.employeeService.delete(props.id).pipe(
          map(() => {
            this.message.success('Xóa nhân viên vĩnh viễn thành công');
            return EmployeeAction.deleteEmployeeSuccess({id: props.id});
          }),
          catchError((err) => throwError(err))
        )
      )
    )
  );

  LeaveEmployee$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.leaveEmployee),
      switchMap((props) =>
        this.employeeService.leaveEmployee(props.id, props.body).pipe(
          map(() => {
            this.message.success(props.body?.leftAt ?
              'Nhân viên đã nghỉ tạm thời' :
              'Đã khôi phục nhân viên thành công');
            return EmployeeAction.deleteEmployeeSuccess({id: props.id});
          }),
          catchError((err) => throwError(err))
        )
      )
    )
  );

  deleteRelative$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.deleteRelative),
      switchMap((props) => this.relativeService.deleteRelative(props.id)),
      map((res) => {
        this.message.success('Xóa người thân thành công');
        return EmployeeAction.updateEmployeeSuccess({employee: res});
      }),
      catchError((err) => throwError(err))
    )
  );

  deleteDegree$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.deleteDegree),
      switchMap((props) => this.degreeService.deleteDegree(props.id)),
      map((res) => {
        this.message.success('Xóa bằng cấp thành công');
        return EmployeeAction.updateEmployeeSuccess({employee: res});
      }),
      catchError((err) => throwError(err))
    )
  );

  deleteContract$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.deleteContract),
      switchMap((props) =>
        this.degreeService.deleteContracts(props.id).pipe(
          map((_) => {
            this.message.success('Xóa bằng hợp đồng thành công');
            return EmployeeAction.deleteContractSuccess({
              employeeId: props.employeeId
            });
          })
        )
      ),
      catchError((err) => throwError(err))
    )
  );

  deleteWorkHistory$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.deleteWorkHistory),
      switchMap((props) =>
        this.employeeService.deleteWorkHistory(props.id).pipe(
          map((_) => {
            this.message.success('Xóa Lịch sử công tác thành công');
            return EmployeeAction.getEmployee({
              id: props.employeeId
            });
          })
        )
      ),
      catchError((err) => throwError(err))
    )
  );

  updateHistorySalary = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.updateHistorySalary),
      switchMap((props) =>
        this.employeeService.updateHistorySalary(props.id, props.salary).pipe(
          map((salary) => {
            this.store.dispatch(PayrollAction.updateStatePayroll({added: ConvertBooleanFrontEnd.TRUE}))
            this.message.success('Sửa lịch sửa lương thành công');
            return EmployeeAction.getEmployee({id: props.employeeId});
          })
        )
      ),
      catchError((err) => throwError(err))
    )
  );

  deleteHistorySalary = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.deleteHistorySalary),
      switchMap((props) =>
        this.employeeService.deleteHistorySalary(props.id).pipe(
          map((salary) => {
            this.message.success('Xoá lịch sửa lương thành công');
            return EmployeeAction.getEmployee({id: props.employeeId});
          })
        )
      ),
      catchError((err) => throwError(err))
    )
  );
}
