import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { SnackBarComponent } from 'libs/components/src/lib/snackBar/snack-bar.component';
import { throwError } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  switchMap,
  withLatestFrom
} from 'rxjs/operators';
import { OvertimeService } from '../../service/overtime.service';
import { PayrollService } from '../../service/payroll.service';
import { SalaryService } from '../../service/salary.service';
import { PayrollAction } from './payroll.action';
import { AddPayroll } from './payroll.interface';
import { selectorPayrollTotal } from './payroll.selector';
import { OrgchartActions } from '@minhdu-fontend/orgchart';

@Injectable()
export class PayrollEffect {
  loadInit$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.loadInit),
      concatMap((requestPaginate) => {
        return this.payrollService.pagination(requestPaginate);
      }),
      map((ResponsePaginate) => {
        /// FIXME: Add nhiều load lại che mất thông báo cho thêm hàng loạt. nên handle lại logic.
        // this.snackBar.open('Tải phiếu lương thành công', '', {
        //   duration: 1000,
        // });
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

  loadOvertime$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.filterOvertime),
      concatMap((params) => {
        return this.overtimeService.getOvertime(params);
      }),
      map((res) => {
        return PayrollAction.filterOvertimeSuccess({
          overtime: res
        });
      }),
      catchError((err) => throwError(err))
    )
  );

  //  createdAt: new Date(this.formGroup.value.generate),
  // employeeId: +this.data.employeeId,
  // employeeType: this.data?.employeeType
  addPayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.addPayroll),
      switchMap((props) =>
        this.payrollService
          .addPayroll<AddPayroll>(
            {
              createdAt: props.generate.createdAt,
              employeeId: props.generate.employeeId
            },
            { employeeType: props.generate.employeeType }
          )
          .pipe(
            map((res) => {
              this.snackBar.open(
                res?.message ? res.message : 'Thao tác thành công ',
                'Đóng'
              );
              if (props.inHistory) {
                this.store.dispatch(
                  PayrollAction.loadInit({
                    take: 30,
                    skip: 0,
                    employeeId: props.generate.employeeId
                  })
                );
              }
              return PayrollAction.addPayrollSuccess();
            })
          )
      ),
      catchError((err) => {
        this.store.dispatch(PayrollAction.handlePayrollError());
        return throwError(err);
      })
    )
  );

  addSalary$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.addSalary),
      switchMap((props) =>
        this.salaryService.addOne(props.salary).pipe(
          map((res) => {
            /// FIXME: Add nhiều load lại che mất thông báo cho thêm hàng loạt. nên handle lại logic.
            if (res?.status === 201) {
              this.snackBar.open(res.message, 'Xác nhận');
            } else {
              this.snackBar.open('Thao tác thành công', '', { duration: 1000 });
            }
            if (props.branchId) {
              return OrgchartActions.getBranch({ id: props.branchId });
            } else {
              return props.payrollId
                ? PayrollAction.getPayroll({ id: props.payrollId })
                : PayrollAction.loadInit({
                  take: 30,
                  skip: 0,
                  createdAt: new Date(),
                  isTimeSheet: !!props.isTimesheet
                });
            }
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
          panelClass: ['z-index-snackbar'],
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
      switchMap((props) => this.payrollService.update(props.id, props.Payroll)),
      map((payroll) => {
        return PayrollAction.updatePayrollSuccess({ payroll: payroll });
      }),
      catchError((err) => throwError(err))
    )
  );

  confirmPayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.confirmPayroll),
      switchMap((props) =>
        this.payrollService.confirmPayroll(props.id, props.dataConfirm).pipe(
          map((Payroll) => {
            console.log(Payroll);
            this.snackBar.open('Xác nhận thành công', '', { duration: 1000 });
            return PayrollAction.confirmPayrollSuccess({ payroll: Payroll });
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
            if (props.branchId) {
              return OrgchartActions.getBranch({ id: props.branchId });
            } else {
              return PayrollAction.getPayroll({ id: props.payrollId });
            }
          })
        );
      }),
      catchError((err) => {
        this.store.dispatch(PayrollAction.handleSalaryError());
        return throwError(err);
      })
    )
  );

  deletePayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.deletePayroll),
      switchMap((props) =>
        this.payrollService.delete(props.id).pipe(
          map(() => {
            this.snackBar.open('xóa phiếu lương thành công', '',{duration:1500})
            return PayrollAction.deletePayrollSuccess({ id: props.id });
          }),
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

  scanHoliday$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.scanHoliday),
      switchMap((props) =>
        this.payrollService.scanHoliday(props.PayrollId).pipe(
          map((_) => {
            return PayrollAction.getPayroll({ id: props.PayrollId });
          }),
          catchError((err) => {
            this.store.dispatch(PayrollAction.scanHolidayError());
            return throwError(err);
          })
        )
      )
    )
  );

  constructor(
    private readonly action$: Actions,
    private readonly payrollService: PayrollService,
    private readonly salaryService: SalaryService,
    private readonly overtimeService: OvertimeService,
    private readonly snackBar: MatSnackBar,
    private readonly store: Store
  ) {
  }
}
