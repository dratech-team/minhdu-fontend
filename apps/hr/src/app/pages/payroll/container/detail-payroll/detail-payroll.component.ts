import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../reducers';
import {ActivatedRoute, Router} from '@angular/router';
import {
  selectCurrentPayroll,
  selectedAddingPayroll,
  selectedDeletedPayroll,
  selectedLoadedPayroll,
  selectedScannedPayroll
} from '../../+state/payroll/payroll.selector';
import {PayrollAction} from '../../+state/payroll/payroll.action';
import {MatDialog} from '@angular/material/dialog';
import {DatetimeUnitEnum, EmployeeType, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {Salary} from '@minhdu-fontend/data-models';
import {Payroll} from '../../+state/payroll/payroll.interface';
import {DialogDeleteComponent} from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import {DialogOvertimeComponent} from '../../component/dialog-salary/dialog-overtime/dialog-overtime.component';
import {DialogBasicComponent} from '../../component/dialog-salary/dialog-basic/dialog-basic.component';
import {DialogAbsentComponent} from '../../component/dialog-salary/dialog-absent/dialog-absent.component';
import {DialogStayComponent} from '../../component/dialog-salary/dialog-stay/dialog-stay.component';
import {DialogAllowanceComponent} from '../../component/dialog-salary/dialog-allowance/dialog-allowance.component';
import {ConfirmPayrollComponent} from '../../component/confirm-payroll/confirm-payroll.component';
import {getDaysInMonth} from '../../../../../../../../libs/utils/daytime.until';
import {LoadingComponent} from '../../component/popup-loading/loading.component';
import {DialogSeasonalComponent} from '../../component/dialog-salary/dialog-seasonal/dialog-seasonal.component';
import {
  DialogSharedComponent
} from '../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import {DatePipe} from '@angular/common';
import {MatDialogConfig} from '@angular/material/dialog/dialog-config';
import {DialogNoteComponent} from "../../component/dialog-note/dialog-note.component";
import {DialogWFHComponent} from "../../component/dialog-salary/dialog-WFH/dialog-WFH.component";
import {
  DialogDatePickerComponent
} from "../../../../../../../../libs/components/src/lib/dialog-datepicker/dialog-datepicker.component";
import {UpdatePayrollComponent} from "../../component/update-payroll/update-payroll.component";


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
  isSticky = false;
  employeeTypeEnum = EmployeeType;

  constructor(
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly datePipe: DatePipe
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    this.store.dispatch(PayrollAction.getPayroll({id: this.getPayrollId}));
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
      data: {type, payroll, isUpdate: false}
    };
    this.openSalary(type, config);
  }

  updateSalary(type: SalaryTypeEnum, salary: Salary, payroll?: Payroll) {
    const config = {
      width: '40%',
      data: {type, salary, isUpdate: true, payroll: payroll}
    };
    this.openSalary(type, config);
  }

  openSalary(type: SalaryTypeEnum, config: MatDialogConfig) {
    switch (type) {
      case SalaryTypeEnum.BASIC : {
        this.dialog.open(DialogBasicComponent, Object.assign(config, {width: 'fit-content'}));
        break;
      }
      case SalaryTypeEnum.STAY: {
        this.dialog.open(DialogStayComponent, Object.assign(config, {width: 'fit-content'}));
        break;
      }
      case SalaryTypeEnum.ALLOWANCE: {
        this.dialog.open(DialogAllowanceComponent, config);
        break;
      }
      case SalaryTypeEnum.OVERTIME: {
        this.dialog.open(DialogOvertimeComponent, config);
        break;
      }
      case SalaryTypeEnum.ABSENT: {
        this.dialog.open(DialogAbsentComponent, Object.assign(config, {width: '600px'}));
        break;
      }
      case SalaryTypeEnum.PART_TIME: {
        this.dialog.open(DialogSeasonalComponent, Object.assign(config, {width: 'fit-content'}));
        break;
      }
      case SalaryTypeEnum.WFH: {
        this.dialog.open(DialogWFHComponent, Object.assign(config, {width: 'fit-content'}));
        break;
      }
      default: {
        console.error('error add salary in detail payroll');
      }

    }
  }

  removeSalary(id: number, payrollId: number) {
    this.dialog.open(DialogDeleteComponent, {width: 'fit-content'}).afterClosed().subscribe((value) => {
      if (value) {
        this.store.dispatch(PayrollAction.deleteSalary({id: id, PayrollId: payrollId}));
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
      {
        queryParams: {
          name: payroll.employee.lastName,
          employeeType: payroll.employee.type
        }
      }).then();
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
    const ref = this.dialog.open(LoadingComponent, {
      width: 'fit-content',
      data: {content: 'Đang quét ngày lễ...'}
    });
    this.scanned$.subscribe(val => {
      if (val) {
        ref.close();
      }
    });
    this.store.dispatch(PayrollAction.scanHoliday({PayrollId: payrollId}));
  }

  scroll(target: HTMLElement, sticky: HTMLElement) {
    target.scrollIntoView({behavior: 'smooth', block: 'center'});
    this.onSticky(sticky);
  }

  onSticky(sticky: HTMLElement) {
    if (sticky.classList.contains('hide-sticky')) {
      sticky.classList?.remove('hide-sticky');
      sticky.classList?.add('show-sticky');
    } else {
      sticky.classList?.add('hide-sticky');
      sticky.classList?.remove('show-sticky');
    }
    this.isSticky = !this.isSticky;
  }

  deletePayroll(event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, {width: 'fit-content'});
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(PayrollAction.deletePayroll(
          {
            id: event.id
          }));
        this.store.pipe(select(selectedDeletedPayroll)).subscribe(deleted => {
          if (deleted) {
            this.router.navigate(['phieu-luong']).then();
          }
        });
      }
    });
  }

  updateTaxed(payroll: Payroll) {
    const ref = this.dialog.open(DialogSharedComponent, {
      width: 'fit-content',
      data: {
        title: 'Cập nhật tính thuế',
        description: `Bạn muốn ${payroll.taxed ? 'tắt' : 'bật'} trừ thuế cho phiếu lương của tháng
        ${this.datePipe.transform(new Date(payroll.createdAt), 'yyyy-MM')}`
      }
    });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(PayrollAction.updatePayroll({
          id: payroll.id,
          payroll: {taxed: !payroll.taxed}
        }));
      }
    });
  }

  addNote(payroll: Payroll) {
    this.dialog.open(DialogNoteComponent, {width: 'fit-content', data: {payroll}})
  }

  updatePayroll(payroll: Payroll) {
    this.dialog.open(UpdatePayrollComponent, {
      data: {payroll}
    })
  }
}
