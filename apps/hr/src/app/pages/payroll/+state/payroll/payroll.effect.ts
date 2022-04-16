import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {throwError} from 'rxjs';
import {catchError, concatMap, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {OvertimeService} from '../../service/overtime.service';
import {PayrollService} from '../../service/payroll.service';
import {SalaryService} from '../../service/salary.service';
import {PayrollAction} from './payroll.action';
import {AddPayroll} from './payroll.interface';
import {selectorPayrollTotal} from './payroll.selector';
import {OrgchartActions} from '@minhdu-fontend/orgchart';
import {NzMessageService} from 'ng-zorro-antd/message';

@Injectable()
export class PayrollEffect {
  constructor(
    private readonly action$: Actions,
    private readonly payrollService: PayrollService,
    private readonly salaryService: SalaryService,
    private readonly overtimeService: OvertimeService,
    private readonly message: NzMessageService,
    private readonly store: Store
  ) {
  }

  loadInit$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.loadInit),
      concatMap((requestPaginate) => {
        return this.payrollService.paginationPayroll(requestPaginate.payrollDTO);
      }),
      map((ResponsePaginate) => {
        this.message.success('Tải bảng lương thành công!!');
        return PayrollAction.loadInitSuccess({
          payrolls: ResponsePaginate.data,
          total: ResponsePaginate.total,
          totalOvertime: ResponsePaginate.totalSalary
        });
      }),
      catchError((err) => throwError(err))
    )
  );

  loadMorePayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.loadMorePayrolls),
      withLatestFrom(this.store.pipe(select(selectorPayrollTotal))),
      map(([props, skip]) => {
          return Object.assign(JSON.parse(JSON.stringify(props.payrollDTO)), {skip: skip})
        }
      ),
      switchMap((props) => {
        return this.payrollService.paginationPayroll(props);
      }),
      map((ResponsePaginate) => {
        if (ResponsePaginate.data.length === 0) {
          this.message.warning('Đã lấy hết dữ liệu');
        }
        return PayrollAction.loadMorePayrollsSuccess({
          payrolls: ResponsePaginate.data,
          total: ResponsePaginate.total,
          totalOvertime: ResponsePaginate.totalSalary
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
            {employeeType: props.generate.employeeType}
          )
          .pipe(
            map((res) => {
              this.message.success(res?.message ? res.message : 'Thao tác thành công ');
              if (props.inHistory) {
                this.store.dispatch(
                  PayrollAction.loadInit({
                    payrollDTO: {
                      take: 30,
                      skip: 0,
                      employeeId: props.generate.employeeId
                    }
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
      switchMap((props) => {
          if (props.salary.settingId) {
            if (!props.salary.partial) {
              this.message.warning('chưa chọn buổi')
              this.store.dispatch(PayrollAction.handleSalaryError());
              return throwError('chưa chọn buổi')
            }
            if (!props.salary.statedAt && !props.salary.endedAt) {
              this.message.warning('chưa chọn từ ngày đến ngày')
              this.store.dispatch(PayrollAction.handleSalaryError());
              return throwError('chưa chọn từ ngày đến ngày')
            }
          } else {
            if (!props.salary?.price) {
              this.message.warning('Chưa nhập đơn giá')
              this.store.dispatch(PayrollAction.handleSalaryError());
              return throwError('Chưa nhập đơn giá')
            }
          }
          if (!props.salary.title) {
            this.message.warning('Chưa nhập tiêu đề vắng')
            this.store.dispatch(PayrollAction.handleSalaryError());
            return throwError('Chưa nhập tiêu đề vắng')
          }
          return this.salaryService.addOne(props.salary).pipe(
            map((res) => {
              if (props.branchId) {
                return PayrollAction.getPayroll({id: props.payrollId})
              }
              this.message.success(res.message);
              if (props.isDetailPayroll) {
                return PayrollAction.getPayroll({id: props.payrollId})
              } else {
                return PayrollAction.addSalaryMultipleSuccess();
              }
            }),
            catchError((err) => {
              this.store.dispatch(PayrollAction.handleSalaryError());
              return throwError(err);
            })
          );
        }
      )
    )
  );

  getPayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.getPayroll),
      switchMap((props) => this.payrollService.getOne(props.id)),
      map((payroll) => {
        this.message.success('Tải phiếu lương thành công');
        return PayrollAction.getPayrollSuccess({payroll: payroll});
      }),
      catchError((err) => throwError(err))
    )
  );

  updatePayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.updatePayroll),
      switchMap((props) => this.payrollService.update(props.id, props.payroll)),
      map((payroll) => {
        this.message.success('Cập nhật phiếul lương thành công')
        return PayrollAction.updatePayrollSuccess({payroll: payroll});
      }),
      catchError((err) => {
        this.store.dispatch(PayrollAction.handlePayrollError());
        return throwError(err)
      })
    )
  );

  confirmPayroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.confirmPayroll),
      switchMap((props) =>
        this.payrollService.confirmPayroll(props.id, props.dataConfirm).pipe(
          map((Payroll) => {
            console.log(Payroll);
            this.message.success('Xác nhận thành công');
            return PayrollAction.confirmPayrollSuccess({payroll: Payroll});
          }),
          catchError((err) => {
            return throwError(err)
          })
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
            this.message.success('Cập nhật thành công');
            if (props.branchId) {
              return OrgchartActions.getBranch({id: props.branchId});
            } else {
              if (props.multiple) {
                return PayrollAction.updateSalaryMultipleSuccess();
              } else {
                return PayrollAction.getPayroll({id: props.payrollId});
              }
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
            this.message.success('xóa phiếu lương thành công');
            return PayrollAction.deletePayrollSuccess({id: props.id});
          }),
          catchError((err) => {
              this.store.dispatch(PayrollAction.handlePayrollError());
              return throwError(err);
            }
          )
        )
      )
    )
  );

  deleteSalary$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.deleteSalary),
      switchMap((props) =>
        this.salaryService.delete(props.id).pipe(
          map(() => {
            return PayrollAction.getPayroll({id: props.PayrollId});
          })
        )
      ),
      catchError((err) => throwError(err))
    )
  );

  scanHoliday$ = createEffect(() =>
    this.action$.pipe(
      ofType(PayrollAction.scanHoliday),
      switchMap((props) =>
        this.payrollService.scanHoliday(props.PayrollId).pipe(
          map((_) => {
            return PayrollAction.getPayroll({id: props.PayrollId});
          }),
          catchError((err) => {
            this.store.dispatch(PayrollAction.scanHolidayError());
            return throwError(err);
          })
        )
      )
    )
  );
}
