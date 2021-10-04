import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { SnackBarComponent } from 'libs/components/src/lib/snackBar/snack-bar.component';
import { throwError } from 'rxjs';
import {
  catchError,
  concatMap, debounceTime, map,
  switchMap,
  withLatestFrom
} from 'rxjs/operators';
import { PayrollService } from '../../service/payroll.service';
import { SalaryService } from '../../service/salary.service';
import { addPayrollSuccess, PayrollAction } from './payroll.action';
import { selectorPayrollTotal } from './payroll.selector';

@Injectable()
export class PayrollEffect {
  loadInit$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.loadInit),
      concatMap((requestPaginate) => {
        return this.payrollService.pagination(requestPaginate);
      }),
      map((ResponsePaginate) => {
        this.snackBar.open('Tải phiếu lương thành công', '',
          {
            duration: 1000
          });
        return PayrollAction.loadInitSuccess({
          payrolls: ResponsePaginate.data
        });
      }),
      catchError((err) => throwError(err))
    )
  );

  loadMorePayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.loadMorePayrolls),
      withLatestFrom(this.store.pipe(select(selectorPayrollTotal))),
      map(([props, skip]) =>
        Object.assign(JSON.parse(JSON.stringify(props)), { skip: skip })
      ),
      switchMap((props) => {
        return this.payrollService.pagination(props);
      }),
      map((ResponsePaginate) => {
        if (ResponsePaginate.data.length === 0) {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 2500,
            panelClass: ['background-snackbar'],
            data: { content: 'Đã lấy hết phiếu lương' }
          });
        }
        return PayrollAction.loadMorePayrollsSuccess({
          payrolls: ResponsePaginate.data
        });
      }),
      catchError((err) => throwError(err))
    )
  );

  addPayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.addPayroll),
      switchMap((props) => this.payrollService.addPayroll(props.generate).pipe(
        map((res) => {
          this.snackBar.open(res.messeage, '', {
            duration: 1000
          });
          if (props.addOne) {
            this.store.dispatch(
              PayrollAction.loadInit({ take: 30, skip: 0, employeeId: props.generate.employeeId })
            );
          }
          return PayrollAction.addPayrollSuccess();
        })
      )),
      catchError((err) => {
          this.store.dispatch(PayrollAction.handlePayrollError());
          return throwError(err);
        }
      )
    )
  );

  addSalary$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.addSalary),
      switchMap((props) =>
        this.salaryService.addOne(props.salary).pipe(
          map((_) => {
            this.snackBar.open('Thao tác thành công', '', { duration: 1000 });
            return props.payrollId
              ? PayrollAction.getPayroll({ id: props.payrollId })
              : PayrollAction.loadInit({ take: 30, skip: 0 });
          }),
          catchError((err) => {
            this.store.dispatch(PayrollAction.handleSalaryError());
            return throwError(err);
          })
        )
      )
    )
  );

  getPayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.getPayroll),
      switchMap((props) => this.payrollService.getOne(props.id)),
      map((payroll) => {
        this.snackBar.open('Tải phiếu lương thành công', '', {
          duration: 1000
        });
        return PayrollAction.getPayrollSuccess({ payroll: payroll });
      }),
      catchError((err) => throwError(err))
    )
  );

  updatePayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.updatePayroll),
      switchMap((props) =>
        this.payrollService.update(props.id, props.Payroll).pipe(
          map(() => {
            this.snackBar.open('Cập nhật thành công', '', { duration: 1000 });
            return PayrollAction.getPayroll({ id: props.id });
          }),
          catchError((err) => throwError(err))
        )
      )
    )
  );

  confirmPayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.confirmPayroll),
      switchMap((props) =>
        this.payrollService.confirmPayroll(props.id).pipe(
          map(() => {
            this.snackBar.open('Xác nhận thành công', '', { duration: 1000 });
            return PayrollAction.updatePayrollSuccess({ payrollId: props.id });
          }),
          catchError((err) => throwError(err))
        )
      )
    )
  );

  updateSalary$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.updateSalary),
      switchMap((props) => {
        return this.salaryService.update(props.id, props.salary).pipe(
          map((_) => {
            this.snackBar.open('Cập nhật thành công', '', { duration: 1000 });
            return PayrollAction.getPayroll({ id: props.payrollId });
          })
        );
      }),
      catchError((err) => {
          this.store.dispatch(PayrollAction.handleSalaryError());
          return throwError(err);
        }
      )
    )
  );

  deletePayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.deletePayroll),
      switchMap((props) =>
        this.payrollService.delete(props.id).pipe(
          map(() => PayrollAction.getPayroll({ id: props.id })),
          catchError((err) => throwError(err))
        )
      )
    )
  );

  deleteSalary$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.deleteSalary),
      switchMap((props) =>
        this.salaryService.delete(props.id).pipe(
          map(() => PayrollAction.getPayroll({ id: props.PayrollId })),
          catchError((err) => throwError(err))
        )
      )
    )
  );

  constructor(
    private readonly action$: Actions,
    private readonly payrollService: PayrollService,
    private readonly salaryService: SalaryService,
    private readonly snackBar: MatSnackBar,
    private readonly store: Store
  ) {
  }
}
