import { Injectable } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EmployeeAction } from './employee.action';
import { RequestPaginate } from '@minhdu-fontend/data-models';

@Injectable()
export class EmployeeEffect {

  loadEmployees$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.loadEmployees),
      concatMap((requestPaginate) => this.employeeService.pagination(requestPaginate)),
      map((ResponsePaginate) => EmployeeAction.LoadEmployeesSuccess({ employees: ResponsePaginate.data })),
      catchError((err) => throwError(err))
    )
  );
  addEmployee$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.addEmployee),
      switchMap((props) => this.employeeService.addOne(props.employee)),
      map((employee) => EmployeeAction.addEmployeeSuccess({ employee })),
      catchError((err) => throwError(err))
    ));
  updateEmployee$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.updateEmployee),
      switchMap((props) => this.employeeService.update(props.id, props.employee)),
      map((employee) => EmployeeAction.updateEmployeeSuccess({ employee })),
      catchError((err) => throwError(err))
    ));
  deleteEmployee$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.deleteEmployee),
      switchMap((props) => this.employeeService.delete(props.id).pipe(
        map(()=>EmployeeAction.deleteEmployeeSuccess({ id : props.id})),
        catchError((err) => throwError(err))
      )),
    ));

  constructor(
    private readonly action$: Actions,
    private readonly employeeService: EmployeeService
  ) {
  }
}
