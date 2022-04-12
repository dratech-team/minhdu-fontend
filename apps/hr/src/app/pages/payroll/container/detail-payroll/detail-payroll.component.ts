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
import {DatetimeUnitEnum, EmployeeType, RecipeType, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {Salary} from '@minhdu-fontend/data-models';
import {Payroll} from '../../+state/payroll/payroll.interface';
import {DialogDeleteComponent} from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import {DialogOvertimeComponent} from '../../component/dialog-salary/dialog-overtime/dialog-overtime.component';
import {DialogBasicComponent} from '../../component/dialog-salary/dialog-basic/dialog-basic.component';
import {DialogAbsentComponent} from '../../component/dialog-salary/dialog-absent/dialog-absent.component';
import {DialogStayComponent} from '../../component/dialog-salary/dialog-stay/dialog-stay.component';
import {DialogAllowanceComponent} from '../../component/dialog-salary/dialog-allowance/dialog-allowance.component';
import {ConfirmPayrollComponent} from '../../component/confirm-payroll/confirm-payroll.component';
import {getDaysInMonth} from '@minhdu-fontend/utils';
import {LoadingComponent} from '../../component/popup-loading/loading.component';
import {DialogSeasonalComponent} from '../../component/dialog-salary/dialog-seasonal/dialog-seasonal.component';
import {
  DialogSharedComponent
} from '../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import {DatePipe} from '@angular/common';
import {MatDialogConfig} from '@angular/material/dialog/dialog-config';
import {DialogNoteComponent} from "../../component/dialog-note/dialog-note.component";
import {DialogWFHComponent} from "../../component/dialog-salary/dialog-WFH/dialog-WFH.component";
import {UpdatePayrollComponent} from "../../component/update-payroll/update-payroll.component";
import {Role} from "../../../../../../../../libs/enums/hr/role.enum";
import {RestorePayrollComponent} from "../../component/restore-payroll/restore-payroll.component";
import {NzMessageService} from "ng-zorro-antd/message";
import {Sort} from "@angular/material/sort";
import {map} from "rxjs/operators";
import {UpdateHolidayComponent} from "../../component/dialog-salary/dialog-holiday/update-holiday.component";


@Component({
  templateUrl: 'detail-payroll.component.html',
  styleUrls: ['detail-payroll.component.scss']
})
export class DetailPayrollComponent implements OnInit {
  type = SalaryTypeEnum;
  payroll$ = this.store.pipe(select(selectCurrentPayroll(this.getPayrollId))).pipe(
    map(payroll =>{
      if(payroll){
        if (payroll?.createdAt){
          this.daysInMonth = getDaysInMonth(payroll.createdAt);
        }else{
          this.daysInMonth = new Date().getDate();
        }
        this.sortedSalaryOver = JSON.parse(JSON.stringify(
          payroll?.salaries.filter(salary => salary.type === SalaryTypeEnum.OVERTIME)))
      }
      return payroll
    })
  );
  loaded$ = this.store.pipe(select(selectedLoadedPayroll));
  adding$ = this.store.pipe(select(selectedAddingPayroll));
  scanned$ = this.store.pipe(select(selectedScannedPayroll));
  daysInMonth!: number;
  datetimeUnit = DatetimeUnitEnum;
  isSticky = false;
  employeeTypeEnum = EmployeeType;
  role!: string|null
  roleEnum =  Role;
  sortedSalaryOver: Salary[] = []
  recipeType = RecipeType
  constructor(
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private readonly message: NzMessageService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    this.role = localStorage.getItem('role')
    this.store.dispatch(PayrollAction.getPayroll({id: this.getPayrollId}));
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
        Object.assign(config.data, {selectEmp: true})
        this.dialog.open(DialogBasicComponent, Object.assign(config, {width: 'fit-content'}));
        break;
      }
      case SalaryTypeEnum.STAY: {
        Object.assign(config.data, {selectEmp: true})
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
      case SalaryTypeEnum.HOLIDAY: {
        this.dialog.open(UpdateHolidayComponent, Object.assign(config, {width: 'fit-content'}));
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
    if(this.role !== Role.HUMAN_RESOURCE){
      this.dialog.open(ConfirmPayrollComponent, {
        width: 'fit-content',
        data: {
          payroll: payroll
        }
      });
    }else{
      if(payroll.accConfirmedAt !== null){
        this.dialog.open(RestorePayrollComponent, {
          width: 'fit-content',
          data: {payroll: payroll}
        });
      }else{
        this.message.warning('Phiếu lương chưa được xác nhận')
      }
    }
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

  sortData(sort: Sort) {
    this.sortedSalaryOver = this.sortedSalaryOver.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title':
          return this.compare(b.title, a.title, isAsc);
        case 'datetime':
          return this.compare(b.datetime,a.datetime, isAsc);
        case 'unit':
          return this.compare(b.unit, a.unit, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string| Date, b: number | string|Date, isAsc: boolean) {
    console.log(typeof  a)
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
