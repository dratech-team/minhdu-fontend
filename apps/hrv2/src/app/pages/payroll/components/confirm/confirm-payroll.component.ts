import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, throwError} from 'rxjs';
import {EmployeeType, RecipeType} from '@minhdu-fontend/enums';
import {FormControl} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {NzMessageService} from 'ng-zorro-antd/message';
import {
  DialogSharedComponent
} from "../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component";
import {catchError} from "rxjs/operators";
import {Role} from "../../../../../../../../libs/enums/hr/role.enum";
import {PayrollEntity, PayslipEntity} from "../../entities";
import {PayslipService} from "../../services/payslip.service";
import {PayrollService} from "../../services/payroll.service";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollActions} from "../../state/payroll.action";
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  templateUrl: 'confirm-payroll.component.html',
  styleUrls: ['confirm-payroll.component.scss']
})
export class ConfirmPayrollComponent implements OnInit {
  @Input() data!: {
    payroll: PayrollEntity
  }
  accConfirmedAt = new FormControl('');
  payslip$?: Observable<PayslipEntity>;
  recipeType = RecipeType;
  isConfirmed = false;
  typeEmployee = EmployeeType;
  role?: string | null
  adding = false;

  constructor(
    private readonly actions$: Actions,
    private readonly payslipService: PayslipService,
    private readonly datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly message: NzMessageService,
    private readonly payrollService: PayrollService,
    private readonly modalRef: NzModalRef
  ) {
  }

  ngOnInit() {
    this.role = localStorage.getItem('role')
    this.payslip$ = this.payslipService.getOne(this.data.payroll.id);
    if (this.data?.payroll?.accConfirmedAt) {
      this.isConfirmed = true;
      this.accConfirmedAt.setValue(this.datePipe.transform(this.data.payroll.accConfirmedAt, 'yyyy-MM-dd'));
    }else{
      this.accConfirmedAt.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    }
  }

  confirmPayroll(reconfirm: boolean): any {
    if (this.role === Role.HUMAN_RESOURCE) {
      this.modalRef.close()
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
            this.actions$.dispatch(PayrollActions.confirmPayroll({
              id: this.data.payroll.id, data: {datetime: new Date(this.accConfirmedAt.value)}
            }));
          }
        })
      } else {
        this.actions$.dispatch(PayrollActions.confirmPayroll({
          id: this.data.payroll.id, data: {datetime: new Date(this.accConfirmedAt.value)}
        }));
      }
    } else {
      this.message.error('Chưa chọn ngày xác nhận phiếu lương');
    }
  }

  printPayroll() {
    window.print();
  }

  onCancelPayroll() {
    this.dialog.open(DialogSharedComponent, {
      data: {
        title: 'Huỷ xác nhận phiếu lương',
        description: `Bạn có chắc chắn muốn huỷ xác nhận phiếu lương của nhân viên ${this.data.payroll.employee.lastName}`
      }
    }).afterClosed().subscribe(() => {
      this.adding = true
      this.payrollService.cancelConfirmPayroll(this.data.payroll.id).pipe(catchError(err => {
        this.adding = false
        return throwError(err)
      })).subscribe(() => {
        this.adding = false
        this.message.success('Huỷ xác nhận phiếu lương thành công')
        this.actions$.dispatch(PayrollActions.loadOne({id: this.data.payroll.id}))
        this.modalRef.close();
      })
    })
  }
}