import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PayrollAction } from './payroll.action';
import { PayrollService } from '../service/payroll.service';
import { SalaryService } from '../service/salary.service';

@Injectable()
export class PayrollEffect {

  loadPayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.loadPayrolls),
      concatMap((requestPaginate) => this.payrollService.pagination(requestPaginate)),
      map((ResponsePaginate) => PayrollAction.loadPayrollsSuccess({ payrolls: ResponsePaginate.data })),
      catchError((err) => throwError(err))
    )
  );

  addPayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.addPayroll),
      switchMap((props) => this.payrollService.addOne(props.payroll)),
      map((payroll) => PayrollAction.addPayrollSuccess({ payroll })),
      catchError((err) => throwError(err))
    ));

  addSalary$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.addSalary),
      switchMap((props) => this.salaryService.addOne(props.salary).pipe(
        map(() => PayrollAction.getPayroll({ id: props.payrollId })),
        catchError((err) => throwError(err))
      ))
    ));

  getPayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.getPayroll),
      switchMap((props) => this.payrollService.getOne(props.id)),
      map((payroll) => PayrollAction.getPayrollSuccess({ payroll })),
      catchError((err) => throwError(err))
    ));

  updatePayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.updatePayroll),
      switchMap((props) => this.payrollService.update(props.id, props.Payroll).pipe(
        map(() => PayrollAction.getPayroll({ id: props.id })),
        catchError((err) => throwError(err))
        )
      )
    ));

  updateSalary$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.updateSalary),
      switchMap((props) => this.salaryService.update(props.id, props.salary).pipe(
        map(() => PayrollAction.getPayroll({ id: props.payrollId })),
        catchError((err) => throwError(err))
      ))
    ));

  deletePayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.deletePayroll),
      switchMap((props) => this.payrollService.delete(props.id).pipe(
        map(() => PayrollAction.getPayroll({ id: props.id })),
        catchError((err) => throwError(err))
      ))
    ));

  deleteSalary$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.deleteSalary),
      switchMap((props) => this.salaryService.delete(props.id).pipe(
        map(() => PayrollAction.getPayroll({ id: props.PayrollId })),
        catchError((err) => throwError(err))
        )
      )
    ));

  constructor(
    private readonly action$: Actions,
    private readonly payrollService: PayrollService,
    private readonly salaryService: SalaryService
  ) {
  }
}
