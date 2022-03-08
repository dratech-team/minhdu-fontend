import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { Payslip } from '../../+state/payslip/payslip.interface';
import { PayslipService } from '../../service/payslip.service';
import { RecipeType, EmployeeType } from '@minhdu-fontend/enums';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getFirstDayInMonth, getLastDayInMonth } from '../../../../../../../../libs/utils/daytime.until';
import { selectedConfirmedPayroll } from '../../+state/payroll/payroll.selector';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  templateUrl: 'confirm-payroll.component.html',
  styleUrls: ['confirm-payroll.component.scss']
})
export class ConfirmPayrollComponent implements OnInit {
  accConfirmedAt = new FormControl(this.datePipe.transform(
    this.data?.payroll?.accConfirmedAt ? getLastDayInMonth(
      new Date( this.data.payroll.accConfirmedAt)) :
      getLastDayInMonth(
        new Date( this.data?.payroll?.createdAt))
    , 'yyyy-MM-dd'));
  payslip$?: Observable<Payslip>;
  recipeType = RecipeType;
  isConfirmed = false;
  typeEmployee = EmployeeType;
  firstDayInMonth = this.datePipe.transform(
    getFirstDayInMonth(new Date(this.data.payroll.createdAt)), 'yyyy-MM-dd');
  lastDayInMonth = this.datePipe.transform(
    getLastDayInMonth(new Date(this.data.payroll.createdAt)), 'yyyy-MM-dd');

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly payslipService: PayslipService,
    private readonly store: Store,
    private readonly datePipe: DatePipe,
    private readonly message: NzMessageService,
    private readonly dialogRef: MatDialogRef<ConfirmPayrollComponent>
  ) {
  }

  ngOnInit() {
    this.payslip$ = this.payslipService.getOne(this.data.payroll.id);
    if (this.data?.payroll?.accConfirmedAt) {
      this.isConfirmed = true;
      this.accConfirmedAt.setValue(this.datePipe.transform(this.data.payroll.accConfirmedAt, 'yyyy-MM-dd'));
    }
  }

  confirmPayroll(reconfirm: boolean) {
    if (this.accConfirmedAt.value) {
      this.store.dispatch(PayrollAction.confirmPayroll(
        { id: this.data.payroll.id, dataConfirm: { datetime: new Date(this.accConfirmedAt.value) } }));
      this.store.pipe(select(selectedConfirmedPayroll)).subscribe(confirmed => {
        if (confirmed && !reconfirm) {
          this.isConfirmed = true;
          this.payslip$ = this.payslipService.getOne(this.data.payroll.id);
        }
        if (reconfirm) {
          this.dialogRef.close();
        }
      });
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
}
