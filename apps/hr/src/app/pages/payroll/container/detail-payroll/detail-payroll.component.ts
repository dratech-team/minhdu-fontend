import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { ActivatedRoute, Router } from '@angular/router';
import {
  selectCurrentPayroll,
  selectedAddedPayroll,
  selectedLoadedPayroll
} from '../../+state/payroll/payroll.selector';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { MatDialog } from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Salary } from '@minhdu-fontend/data-models';
import { Payroll } from '../../+state/payroll/payroll.interface';
import { UpdateConfirmComponent } from '../../component/update-comfirm/update-confirm.component';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { DevelopmentComponent } from 'libs/components/src/lib/development/development.component';
import { DialogOvertimeComponent } from '../../component/dialog-overtime/dialog-overtime.component';
import { DialogBasicComponent } from '../../component/dialog-basic/dialog-basic.component';
import { DialogAbsentComponent } from '../../component/dialog-absent/dialog-absent.component';
import { DialogStayComponent } from '../../component/dialog-stay/dialog-stay.component';
import { DialogAllowanceComponent } from '../../component/dialog-allowance/dialog-allowance.component';
import { ConfirmPayrollComponent } from '../../component/confirm-payroll/confirm-payroll.component';


@Component({
  templateUrl: 'detail-payroll.component.html',
  styleUrls: ['detail-payroll.component.scss']
})
export class DetailPayrollComponent implements OnInit {
  type = SalaryTypeEnum;
  payroll$ = this.store.pipe(select(selectCurrentPayroll(this.getPayrollId)));
  loaded$ = this.store.pipe(select(selectedLoadedPayroll));
  constructor(
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.store.dispatch(PayrollAction.getPayroll({ id: this.getPayrollId }));
  }

  get getPayrollId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  onDetailEmployee(id: number) {
    this.router.navigate(['nhan-su/ho-so/chi-tiet-nhan-vien', id]).then();
  }


  addAndUpdateOvertime(type: SalaryTypeEnum, payroll: Payroll, salary?: Salary) {
    this.dialog.open(DialogOvertimeComponent, {
      width: '50%',
      data: { type, payroll, salary }
    });
  }

  addAndUpdateBasic(type: SalaryTypeEnum, payroll: Payroll, salary?: Salary) {
    this.dialog.open(DialogBasicComponent, {
      width: '40%',
      data: { type, payroll, salary }
    });
  }

  addAndUpdateAbsent(type: SalaryTypeEnum, payroll: Payroll, salary?: Salary) {
    this.dialog.open(DialogAbsentComponent, {
      width: '50%',
      data: { type, payroll, salary }
    });
  }

  addAndUpdateStay(type: SalaryTypeEnum, payroll: Payroll, salary?: Salary) {
    this.dialog.open(DialogStayComponent, {
      width: '40%',
      data: { type, payroll, salary }
    });
  }

  addAndUpdateAllowance(type: SalaryTypeEnum, payroll: Payroll, salary?: Salary) {
    this.dialog.open(DialogAllowanceComponent, {
      width: '40%',
      data: { type, payroll, salary }
    });
  }

  removeSalary(id: number, payrollId: number) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.store.dispatch(PayrollAction.deleteSalary({ id: id, PayrollId: payrollId }));
      }
    });
  }

  confirmPayroll(id: number) {
    this.dialog.open(ConfirmPayrollComponent, {
      width: '40%',
      data: { id: id }
    });
  }

  historySalary(employeeId: number) {
    this.dialog.open(DevelopmentComponent, { width: '30%' });
  }
}
