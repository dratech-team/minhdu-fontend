import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {select, Store} from '@ngrx/store';
import {Observable, throwError} from 'rxjs';
import {PayrollAction} from '../../+state/payroll/payroll.action';
import {Payslip} from '../../+state/payslip/payslip.interface';
import {PayslipService} from '../../service/payslip.service';
import {EmployeeType, RecipeType, Role} from '@minhdu-fontend/enums';
import {FormControl} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {getFirstDayInMonth, getLastDayInMonth} from '@minhdu-fontend/utils';
import {selectedConfirmedPayroll} from '../../+state/payroll/payroll.selector';
import {NzMessageService} from 'ng-zorro-antd/message';
import {
  DialogSharedComponent
} from "../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component";
import {catchError} from "rxjs/operators";
import {PayrollService} from "../../service/payroll.service";
import {AccountQuery} from "../../../../../../../../libs/system/src/lib/state/account-management/account.query";

@Component({
  templateUrl: 'confirm-payroll.component.html',
  styleUrls: ['confirm-payroll.component.scss']
})
export class ConfirmPayrollComponent implements OnInit {
  accConfirmedAt = new FormControl(this.datePipe.transform(
    this.data?.payroll?.accConfirmedAt ? getLastDayInMonth(
        new Date(this.data.payroll.accConfirmedAt)) :
      getLastDayInMonth(
        new Date(this.data?.payroll?.createdAt))
    , 'yyyy-MM-dd'));
  payslip$?: Observable<Payslip>;
  recipeType = RecipeType;
  isConfirmed = false;
  typeEmployee = EmployeeType;
  firstDayInMonth = this.datePipe.transform(
    getFirstDayInMonth(new Date(this.data.payroll.createdAt)), 'yyyy-MM-dd');
  lastDayInMonth = this.datePipe.transform(
    getLastDayInMonth(new Date(this.data.payroll.createdAt)), 'yyyy-MM-dd');
  currentUser = this.accountQuery.getCurrentUser();
  adding = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly payslipService: PayslipService,
    private readonly store: Store,
    private readonly datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly message: NzMessageService,
    private readonly payrollService: PayrollService,
    private readonly dialogRef: MatDialogRef<ConfirmPayrollComponent>,
    private readonly accountQuery: AccountQuery
  ) {
  }

  ngOnInit() {
    this.payslip$ = this.payslipService.getOne(this.data.payroll.id);
    if (this.data?.payroll?.accConfirmedAt) {
      this.isConfirmed = true;
      this.accConfirmedAt.setValue(this.datePipe.transform(this.data.payroll.accConfirmedAt, 'yyyy-MM-dd'));
    }
  }

  confirmPayroll(reconfirm: boolean): any {
    if(this.currentUser?.role?.role === Role.HUMAN_RESOURCE){
      this.dialogRef.close()
      return this.message.warning('Quản lý nhân sự không được phép xác nhận phiếu lương')
    }
    if (this.accConfirmedAt.value) {
      if (reconfirm) {
        this.dialog.open(DialogSharedComponent, {
          width: '400px',
          data: {
            title: 'Xác nhận phiếu lương',
            description: 'Việc Xác nhận phiếu lương sẽ làm đóng băng các thao tác trên phiếu lương, bạn có chắc chắn muốn xác nhận'
          }
        }).afterClosed().subscribe(val => {
          if (val) {
            this.store.dispatch(PayrollAction.confirmPayroll(
              {id: this.data.payroll.id, dataConfirm: {datetime: new Date(this.accConfirmedAt.value)}}));
            this.store.pipe(select(selectedConfirmedPayroll)).subscribe(_ => {
              this.dialogRef.close();
            });
          }
        })
      } else {
        this.store.dispatch(PayrollAction.confirmPayroll(
          {id: this.data.payroll.id, dataConfirm: {datetime: new Date(this.accConfirmedAt.value)}}));
        this.store.pipe(select(selectedConfirmedPayroll)).subscribe(confirmed => {
          if (confirmed) {
            this.isConfirmed = true;
            this.payslip$ = this.payslipService.getOne(this.data.payroll.id);
          }
        });
      }
    } else {
      this.message.error('Chưa chọn ngày xác nhận phiếu lương');
    }
  }

  changeDateConfirm() {
    this.isConfirmed = false;
  }

  printPayroll() {
    window.print();
  }

  onCancelPayroll() {

    this.dialog.open(DialogSharedComponent,{
      data:{
        title: 'Huỷ xác nhận phiếu lương',
        description: `Bạn có chắc chắn muốn huỷ xác nhận phiếu lương của nhân viên ${this.data.payroll.employee.lastName}`
      }
    }).afterClosed().subscribe(() => {
      this.adding = true
      this.payrollService.cancelConfirmPayroll(this.data.payroll.id).pipe(catchError(err =>{
        this.adding = false
        return throwError(err)
      })).subscribe(() => {
        this.adding = false
        this.message.success('Huỷ xác nhận phiếu lương thành công')
        this.store.dispatch(PayrollAction.getPayroll({id: this.data.payroll.id}))
        this.dialogRef.close();
      })
    })
  }
}
