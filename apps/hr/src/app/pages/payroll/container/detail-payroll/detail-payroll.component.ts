import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { ActivatedRoute, Router } from '@angular/router';
import {
  selectCurrentPayroll,
  selectedAddingPayroll,
  selectedLoadedPayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { MatDialog } from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Salary } from '@minhdu-fontend/data-models';
import { Payroll } from '../../+state/payroll/payroll.interface';
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
  adding$ = this.store.pipe(select(selectedAddingPayroll));

  constructor(
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }

  ngOnInit() {
    this.store.dispatch(PayrollAction.getPayroll({ id: this.getPayrollId }));
  }

  get getPayrollId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  onDetailEmployee(id: number) {
    this.router.navigate(['ho-so/chi-tiet-nhan-vien', id]).then();
  }

  addSalary(type: SalaryTypeEnum, payroll: Payroll) {
    const config = {
      width: '700px',
      data: { type, payroll, isUpdate: false }
    };
    switch (type) {
      case SalaryTypeEnum.BASIC : {
        this.dialog.open(DialogBasicComponent, Object.assign(config,{width:'400px'}));
      }
        break;
      case SalaryTypeEnum.STAY: {
        this.dialog.open(DialogStayComponent, Object.assign(config,{width:'400px'}));
      }
        break;
      case SalaryTypeEnum.ALLOWANCE: {
        this.dialog.open(DialogAllowanceComponent, config);
      }
        break;
      case SalaryTypeEnum.OVERTIME: {
        this.dialog.open(DialogOvertimeComponent,config);
      }
        break;
      case SalaryTypeEnum.ABSENT: {
        this.dialog.open(DialogAbsentComponent, Object.assign(config,{width:'600px'}));
      }
        break;
      default :
        console.error('error add salary in detail payroll');
    }
  }

  updateSalary(type: SalaryTypeEnum, salary: Salary) {
    const config = {
      width: '40%',
      data: { type, salary, isUpdate: true }
    };
    switch (type) {
      case SalaryTypeEnum.BASIC : {
        this.dialog.open(DialogBasicComponent, Object.assign(config,{width:'400px'}));
      }
        break;
      case SalaryTypeEnum.STAY: {
        this.dialog.open(DialogStayComponent, config);
      }
        break;
      case SalaryTypeEnum.ALLOWANCE: {
        this.dialog.open(DialogAllowanceComponent, config);
      }
        break;
      case SalaryTypeEnum.OVERTIME: {
        this.dialog.open(DialogOvertimeComponent, config);
      }
        break;
      case SalaryTypeEnum.ABSENT: {
        this.dialog.open(DialogAbsentComponent, Object.assign(config,{width:'600px'}));
      }
        break;
      default :
        console.error('error add salary in detail payroll');
    }
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
      width: 'fit-content',
      data: { id}
    });
  }

  historySalary(employeeId: number) {
    this.router.navigate(['phieu-luong/lich-su-luong', employeeId]).then()
  }

  nextPayroll(payroll: Payroll) {
    const indexPayrollCurrent = payroll.payrollIds.indexOf(payroll.id);
    const payrollIds = payroll.payrollIds;
    if (indexPayrollCurrent < payrollIds.length - 1) {
      this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', payrollIds[indexPayrollCurrent + 1]]).then();
    } else {
      this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', payrollIds[0]]).then();
    }
  }

  prePayroll(payroll: Payroll) {
    const indexPayrollCurrent = payroll.payrollIds.indexOf(payroll.id);
    const payrollIds = payroll.payrollIds;
    if (indexPayrollCurrent > 0) {
      this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', payrollIds[indexPayrollCurrent - 1]]).then();
    } else {
      this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', payrollIds[payrollIds.length - 1]]).then();
    }

  }
}
