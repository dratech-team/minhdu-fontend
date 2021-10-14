import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { ActivatedRoute, Router } from '@angular/router';
import {
  selectCurrentPayroll,
  selectedAddingPayroll,
  selectedLoadedPayroll, selectedScannedPayroll
} from '../../+state/payroll/payroll.selector';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { MatDialog } from '@angular/material/dialog';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Salary } from '@minhdu-fontend/data-models';
import { Payroll } from '../../+state/payroll/payroll.interface';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { DialogOvertimeComponent } from '../../component/dialog-overtime/dialog-overtime.component';
import { DialogBasicComponent } from '../../component/dialog-basic/dialog-basic.component';
import { DialogAbsentComponent } from '../../component/dialog-absent/dialog-absent.component';
import { DialogStayComponent } from '../../component/dialog-stay/dialog-stay.component';
import { DialogAllowanceComponent } from '../../component/dialog-allowance/dialog-allowance.component';
import { ConfirmPayrollComponent } from '../../component/confirm-payroll/confirm-payroll.component';
import { getDaysInMonth } from '../../../../../../../../libs/untils/daytime.until';
import { LoadingComponent } from '../../component/popup-loading/loading.component';


@Component({
  templateUrl: 'detail-payroll.component.html',
  styleUrls: ['detail-payroll.component.scss']
})
export class DetailPayrollComponent implements OnInit {
  type = SalaryTypeEnum;
  payroll$ = this.store.pipe(select(selectCurrentPayroll(this.getPayrollId)));
  loaded$ = this.store.pipe(select(selectedLoadedPayroll));
  adding$ = this.store.pipe(select(selectedAddingPayroll));
  scanned$ = this.store.pipe(select(selectedScannedPayroll));
  daysInMonth!: number;
  datetimeUnit = DatetimeUnitEnum;
  isSticky = false
  employeeName!: string;

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
    this.payroll$.subscribe(val => {
        if (val) {
          this.daysInMonth = getDaysInMonth(val.createdAt);
        } else {
          this.daysInMonth = new Date().getDate();
        }
      }
    );
  }

  get getPayrollId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  addSalary(type: SalaryTypeEnum, payroll: Payroll) {
    const config = {
      width: '700px',
      data: { type, payroll, isUpdate: false }
    };
    switch (type) {
      case SalaryTypeEnum.BASIC : {
        this.dialog.open(DialogBasicComponent, Object.assign(config, { width: '400px' }));
      }
        break;
      case SalaryTypeEnum.STAY: {
        this.dialog.open(DialogStayComponent, Object.assign(config, { width: '400px' }));
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
        this.dialog.open(DialogAbsentComponent, Object.assign(config, { width: '600px' }));
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
        this.dialog.open(DialogBasicComponent, Object.assign(config, { width: '400px' }));
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
        this.dialog.open(DialogAbsentComponent, Object.assign(config, { width: '600px' }));
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

  confirmPayroll(payroll: Payroll) {
    this.dialog.open(ConfirmPayrollComponent, {
      width: 'fit-content',
      data: {
        payroll: payroll
      }
    });
  }

  historySalary(payroll: Payroll) {
    this.router.navigate(['phieu-luong/lich-su-luong', payroll.employee.id],
      { queryParams: { name: payroll.employee.firstName + ' ' + payroll.employee.lastName } }).then();
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

  scanHoliday(payrollId: number) {
    this.dialog.open(LoadingComponent, {
      width: 'fit-content',
      data: { content: 'Đang quét ngày lễ...', loaded: this.scanned$ }
    });
    this.store.dispatch(PayrollAction.scanHoliday({ PayrollId: payrollId }));
  }

  scroll(target: HTMLElement) {
    console.log(target)
    target.scrollIntoView({behavior:'smooth',block:'center'})
  }

  onSticky(sticky: HTMLElement) {
    console.log(sticky)
    if(sticky.classList.contains('hide-sticky')){
      sticky.classList?.remove('hide-sticky');
      sticky.classList?.add('show-sticky');
    }else {
      sticky.classList?.add('hide-sticky');
      sticky.classList?.remove('show-sticky');
    }
    this.isSticky = !this.isSticky
  }
}
