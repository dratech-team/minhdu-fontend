import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EmployeeService } from './service/employee.service';
import { RelativeService } from './service/relative.service';
import { DegreeService } from './service/degree.service';
import {
  EmployeeAction, handleRelativeError,
  selectorEmployeeTotal
} from '@minhdu-fontend/employee';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../components/src/lib/snackBar/snack-bar.component';
import { select, Store } from '@ngrx/store';
import { SlackService } from '@minhdu-fontend/service';

@Injectable()
export class EmployeeEffect {
  loadEmployees$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.loadInit),
      switchMap((props) => this.employeeService.pagination(props)),
      map((responsePagination) => {
        this.snackBar.open('Tải nhân viên thành công', '', { duration: 1000 });
        return EmployeeAction.LoadEmployeesSuccess({
          employees: responsePagination.data
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
        Object.assign(JSON.parse(JSON.stringify(props)), { skip: skip })
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
          employees: responsePagination.data
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
      debounceTime(20000),
      map((employee) => {
          this.snackBar.open('Thêm nhân viên thành công', '', { duration: 1000 });
          return EmployeeAction.addEmployeeSuccess({ employee });
        }
      ),
      catchError((err) => {
        this.store.dispatch(EmployeeAction.handleEmployeeError());
        return throwError(err);
      })
    )
  );

  addRelative$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.addRelative),
      switchMap((props) =>
        this.relativeService.addOne(props.relative).pipe(
          map(() => {
              this.snackBar.open('Thêm người thân thành công', '', { duration: 1000 });
              return EmployeeAction.getEmployee({ id: props.relative.employeeId });
            }
          ),
          catchError((err) => {
            this.store.dispatch(EmployeeAction.handleRelativeError());
            return throwError(err);
          })
        )
      )
    )
  );

  addDegree$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.addDegree),
      switchMap((props) =>
        this.degreeService.addOne(props.degree).pipe(
          map(() => {
              this.snackBar.open('Thêm bằng cấp thành công', '', { duration: 1000 });
              return EmployeeAction.getEmployee({ id: props.degree.employeeId });
            }
          ),
          catchError((err) => {
              this.store.dispatch(EmployeeAction.handleDegreeError());
              return throwError(err);
            }
          )
        )
      )
    )
  );

  getEmployee$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.getEmployee),
      switchMap((props) => this.employeeService.getOne(props.id)),
      map((employee) => {
        this.snackBar.open('Tải nhân viên thành công', '', { duration: 1000 });
        return EmployeeAction.getEmployeeSuccess({ employee });
      }),
      catchError((err) => throwError(err))
    )
  );

  updateEmployee$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.updateEmployee),
      switchMap((props) =>
        this.employeeService.update(props.id, props.employee).pipe(
          map(() => {
              this.snackBar.open('Cập nhật nhân viên thành công', '', { duration: 1000 });
              return EmployeeAction.getEmployee({ id: props.id });
            }
          ),
          catchError((err) =>
          {
            this.store.dispatch(EmployeeAction.handleEmployeeError())
           return  throwError(err)
          }
            )
        )
      )
    )
  );

  updateRelative$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.updateRelative),
      switchMap((props) =>
        this.relativeService.update(props.id, props.relative).pipe(
          map(() => {
              this.snackBar.open('Cập nhật nhân viên thành công', '', { duration: 1000 });
              return EmployeeAction.getEmployee({ id: props.employeeId });
            }
          ),
          catchError((err) => {
              this.store.dispatch(EmployeeAction.handleDegreeError());
              return throwError(err);
            }
          )
        )
      )
    )
  );

  updateDegree$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.updateDegree),
      switchMap((props) =>
        this.degreeService.update(props.id, props.degree).pipe(
          map(() => {
              this.snackBar.open('Cập nhật bằng cấp thành công', '', { duration: 1000 });
              return EmployeeAction.getEmployee({ id: props.employeeId });
            }
          ),
          catchError((err) => {
              this.store.dispatch(EmployeeAction.handleDegreeError());
              return throwError(err);
            }
          )
        )
      )
    )
  );

  deleteEmployee$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.deleteEmployee),
      switchMap((props) =>
        this.employeeService.delete(props.id).pipe(
          map(() => {
              this.snackBar.open('Xóa nhân viên thành công', '', { duration: 1000 });
              return EmployeeAction.deleteEmployeeSuccess({ id: props.id });
            }
          ),
          catchError((err) => throwError(err))
        )
      )
    )
  );

  deleteRelative$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.deleteRelative),
      switchMap((props) =>
        this.relativeService.delete(props.id).pipe(
          map(() => {
              this.snackBar.open('Xóa người thân thành công', '', { duration: 1000 });
              return EmployeeAction.getEmployee({ id: props.employeeId });
            }
          ),
          catchError((err) => throwError(err))
        )
      )
    )
  );

  deleteDegree$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.deleteDegree),
      switchMap((props) =>
        this.degreeService.delete(props.id).pipe(
          map(() => {
              this.snackBar.open('Xóa bằng cấp thành công', '', { duration: 1000 });
              return EmployeeAction.getEmployee({ id: props.employeeId });
            }
          ),
          catchError((err) => throwError(err))
        )
      )
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
