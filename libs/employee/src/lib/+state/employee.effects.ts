import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee } from '@minhdu-fontend/data-models';
import {
  EmployeeAction,
  selectorAllEmployee,
  selectorEmployeeTotal
} from '@minhdu-fontend/employee';
import { SlackService } from '@minhdu-fontend/service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { SnackBarComponent } from '../../../../components/src/lib/snackBar/snack-bar.component';
import { DegreeService } from './service/degree.service';
import { EmployeeService } from './service/employee.service';
import { RelativeService } from './service/relative.service';

@Injectable()
export class EmployeeEffect {
  loadEmployees$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.loadInit),
      switchMap((props) => this.employeeService.pagination(props.employee)),
      map((responsePagination) => {
        this.snackBar.open('Tải nhân viên thành công', '', { duration: 1000 });
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
          skip: skip
        })
      ),
      switchMap((props) => {
        return this.employeeService.pagination(props);
      }),
      map((responsePagination) => {
        if (responsePagination.data.length === 0) {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 2500,
            panelClass: ['background-snackbar'],
            data: { content: 'Lấy hết nhân viên' }
          });
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
        this.snackBar.open('Thêm nhân viên thành công', '', { duration: 1000 });
        return EmployeeAction.addEmployeeSuccess({ employee: employee });
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
        this.snackBar.open('Thêm người thân thành công', '', {
          duration: 1000
        });
        return EmployeeAction.updateEmployeeSuccess({ employee: res });
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
        this.snackBar.open('Thêm bằng cấp thành công', '', { duration: 1000 });
        return EmployeeAction.updateEmployeeSuccess({ employee: res });
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
        this.snackBar.open('Tải nhân viên thành công', '', { duration: 1000 });
        return EmployeeAction.getEmployeeSuccess({ employee: employee });
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
        this.snackBar.open('Cập nhật nhân viên thành công', '', {
          duration: 1000
        });
        return EmployeeAction.updateEmployeeSuccess({ employee: res });
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
        this.snackBar.open('Cập nhật người thân thành công', '', {
          duration: 1000
        });
        return EmployeeAction.updateEmployeeSuccess({ employee: res });
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
        this.snackBar.open('Cập nhật bằng cấp thành công', '', {
          duration: 1000
        });
        return EmployeeAction.updateEmployeeSuccess({ employee: res });
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
            this.snackBar.open('Xóa nhân viên vĩnh viễn thành công', '', {
              duration: 1000
            });
            return EmployeeAction.deleteEmployeeSuccess({ id: props.id });
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
            this.snackBar.open('Xóa nhân viên thành công', '', {
              duration: 1000
            });
            return EmployeeAction.deleteEmployeeSuccess({ id: props.id });
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
        this.snackBar.open('Xóa người thân thành công', '', { duration: 1000 });
        return EmployeeAction.updateEmployeeSuccess({ employee: res });
      }),
      catchError((err) => throwError(err))
    )
  );

  deleteDegree$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.deleteDegree),
      switchMap((props) => this.degreeService.deleteDegree(props.id)),
      map((res) => {
        this.snackBar.open('Xóa bằng cấp thành công', '', { duration: 1000 });
        return EmployeeAction.updateEmployeeSuccess({ employee: res });
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
            this.snackBar.open('Xóa bằng hợp đồng thành công', '', {
              duration: 1000
            });
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
            this.snackBar.open('Xóa Lịch sử công tác thành công', '', {
              duration: 1000
            });
            return EmployeeAction.getEmployee({
              id: props.employeeId
            });
          })
        )
      ),
      catchError((err) => throwError(err))
    )
  );

  constructor(
    private readonly action$: Actions,
    private readonly employeeService: EmployeeService,
    private readonly relativeService: RelativeService,
    private readonly degreeService: DegreeService,
    private readonly snackBar: MatSnackBar,
    private readonly store: Store,
    private readonly slackService: SlackService
  ) {
  }
}
