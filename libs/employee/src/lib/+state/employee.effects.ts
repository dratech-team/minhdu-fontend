import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EmployeeService } from './service/employee.service';
import { RelativeService } from './service/relative.service';
import { DegreeService } from './service/degree.service';
import { EmployeeAction, LoadEmployeesSuccess } from '@minhdu-fontend/employee';


@Injectable()
export class EmployeeEffect {

  loadEmployees$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.loadInit),
      switchMap((props) => this.employeeService.pagination(props)),
      map((responsePagination)=> EmployeeAction.LoadEmployeesSuccess({employees: responsePagination.data})),
      catchError(err => throwError(err))
    ));

  loadMoreEmployees$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.loadMoreEmployees),
      switchMap((props) => this.employeeService.pagination(props)),
      map((responsePagination)=> EmployeeAction.LoadMoreEmployeesSuccess({employees: responsePagination.data})),
      catchError(err => throwError(err))
    ));
  
  addEmployee$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.addEmployee),
      switchMap((props) => this.employeeService.addOne(props.employee)),
      map((employee) => EmployeeAction.addEmployeeSuccess({ employee })),
      catchError((err) => throwError(err))
    ));

  addRelative$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.addRelative),
      switchMap((props) => this.relativeService.addOne(props.relative).pipe(
        map(() => EmployeeAction.getEmployee({ id: props.relative.employeeId })),
        catchError((err) => throwError(err))
      ))
    ));

  addDegree$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.addDegree),
      switchMap((props) => this.degreeService.addOne(props.degree).pipe(
        map(() => EmployeeAction.getEmployee({ id: props.degree.employeeId })),
        catchError((err) => throwError(err))
      ))
    ));

  getEmployee$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.getEmployee),
      switchMap((props) => this.employeeService.getOne(props.id)),
      map((employee) => EmployeeAction.getEmployeeSuccess({ employee })),
      catchError((err) => throwError(err))
    ));

  updateEmployee$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.updateEmployee),
      switchMap((props) => this.employeeService.update(props.id, props.employee).pipe(
        map(() => EmployeeAction.getEmployee({ id: props.id })),
        catchError((err) => throwError(err))
        )
      )
    ));

  updateRelative$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.updateRelative),
      switchMap((props) => this.relativeService.update(props.id, props.relative).pipe(
        map(() => EmployeeAction.getEmployee({ id: props.employeeId })),
        catchError((err) => throwError(err))
      ))
    ));

  updateDegree$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.updateDegree),
      switchMap((props) => this.degreeService.update(props.id, props.degree).pipe(
        map(() => EmployeeAction.getEmployee({ id: props.employeeId })),
        catchError((err) => throwError(err))
      ))
    ));

  deleteEmployee$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.deleteEmployee),
      switchMap((props) => this.employeeService.delete(props.id).pipe(
        map(() => EmployeeAction.deleteEmployeeSuccess({ id: props.id })),
        catchError((err) => throwError(err))
      ))
    ));

  deleteRelative$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.deleteRelative),
      switchMap((props) => this.relativeService.delete(props.id).pipe(
        map(() => EmployeeAction.getEmployee({ id: props.employeeId })),
        catchError((err) => throwError(err))
      ))
    ));

  deleteDegree$ = createEffect(() =>
    this.action$.pipe(
      ofType(EmployeeAction.deleteDegree),
      switchMap((props) => this.degreeService.delete(props.id).pipe(
        map(() => EmployeeAction.getEmployee({ id: props.employeeId })),
        catchError((err) => throwError(err))
      ))
    ));

  constructor(
    private readonly action$: Actions,
    private readonly employeeService: EmployeeService,
    private readonly relativeService: RelativeService,
    private readonly degreeService: DegreeService
  ) {
  }
}
