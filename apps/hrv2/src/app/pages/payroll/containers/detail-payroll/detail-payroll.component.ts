import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatetimeUnitEnum, EmployeeType, RecipeType, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {PartialDayEnum} from '@minhdu-fontend/data-models';
import {getDaysInMonth} from '@minhdu-fontend/utils';
import {DatePipe} from '@angular/common';
import {Role} from '../../../../../../../../libs/enums/hr/role.enum';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Sort} from '@angular/material/sort';
import {map} from 'rxjs/operators';
import {PayrollQuery, PayrollStore} from '../../state';
import {PayrollActions} from '../../state/payroll.action';
import {PayrollEntity} from '../../entities';
import {tranFormSalaryType} from '../../utils';
import {PermanentSalaryComponent} from '../../../salary/components/permanent/permanent-salary.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {
  AbsentOvertimeSalaryComponent
} from '../../../salary/components/absent-overtime/absent-overtime-salary.component';
import {
  AllowanceSalaryEntity,
  DeductionSalaryEntity,
  OvertimeSalaryEntity,
  SalaryEntity
} from '../../../salary/entities';
import {PayslipComponent} from '../../components/payslip/payslip.component';
import {AllowanceSalaryComponent} from '../../../salary/components/allowance/allowance-salary.component';
import {Actions} from '@datorama/akita-ng-effects';
import {ModalAddOrUpdateAbsentOrOvertime, ModalAddOrUpdateAllowance, ModalPermanentSalaryData} from '../../data';
import {ModalNoteComponent} from "../../../../../../../../libs/components/src/lib/modal-note/modal-note.component";
import {UpdatePayrollComponent} from "../../components/update/update-payroll.component";
import {RemoteSalaryComponent} from "../../../salary/components/remote/remote-salary.component";
import {ModalAddOrUpdateRemote, ModalRemoteSalaryData} from "../../../salary/data";

@Component({
  templateUrl: 'detail-payroll.component.html',
  styleUrls: ['detail-payroll.component.scss']
})
export class DetailPayrollComponent implements OnInit {
  payroll$ = this.payrollQuery.selectEntity(this.getPayrollId).pipe(
    map(payroll => {
      if (payroll) {
        if (payroll?.createdAt) {
          this.daysInMonth = getDaysInMonth(payroll.createdAt);
        } else {
          this.daysInMonth = new Date().getDate();
        }
        this.sortedSalaryOver = JSON.parse(JSON.stringify(
          payroll?.salaries.filter(salary => salary.type === SalaryTypeEnum.OVERTIME)));
      }
      return payroll;
    })
  );
  loading$ = this.payrollQuery.select(state => state.loading);
  added$ = this.payrollQuery.select(state => state.added);
  scanned$ = this.payrollQuery.select(state => state.scanned);
  salaryTypeEnum = SalaryTypeEnum;

  daysInMonth!: number;
  datetimeUnit = DatetimeUnitEnum;
  PartialDay = PartialDayEnum;
  isSticky = false;
  employeeTypeEnum = EmployeeType;
  role!: string | null;
  roleEnum = Role;
  sortedSalaryOver: OvertimeSalaryEntity[] = [];
  recipeType = RecipeType;

  constructor(
    private readonly payrollQuery: PayrollQuery,
    private readonly payrollStore: PayrollStore,
    private readonly actions$: Actions,
    private readonly activatedRoute: ActivatedRoute,
    public readonly router: Router,
    private readonly modal: NzModalService,
    private readonly datePipe: DatePipe,
    private readonly message: NzMessageService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.actions$.dispatch(PayrollActions.loadOne({id: this.getPayrollId}));
  }

  get getPayrollId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  onAdd(type: SalaryTypeEnum, payroll: PayrollEntity) {
    const config = {
      nzFooter: ' ',
      nzWidth: 'fit-content'
    };
    this.onOpenSalary(type, config, {payroll});
  }

  updateSalary(
    type: SalaryTypeEnum,
    salary: SalaryEntity | AllowanceSalaryEntity | OvertimeSalaryEntity | DeductionSalaryEntity,
    payroll?: PayrollEntity
  ) {
    const config = {
      nzFooter: ' ',
      nzWidth: 'fit-content'
    };
    if (type === SalaryTypeEnum.ALLOWANCE) {
      Object.assign(salary, {workedAt: payroll?.employee.workedAt});
    }
    this.onOpenSalary(type, config, undefined, {salary});
  }

  onOpenSalary(
    type: SalaryTypeEnum,
    config: any,
    add?: { payroll: PayrollEntity },
    update?: { salary: SalaryEntity }
  ) {
    if (type === SalaryTypeEnum.ALLOWANCE) {
      this.modal.create(Object.assign(config, {
        nzTitle: add ? 'Thêm phụ cấp' : 'Cập nhật phụ cấp',
        nzContent: AllowanceSalaryComponent,
        nzComponentParams: <{ data: ModalAddOrUpdateAllowance }>{
          data: {
            type: type,
            add: add,
            update: update
          }
        }
      }));
    }
    if (type === SalaryTypeEnum.OVERTIME || type === SalaryTypeEnum.ABSENT) {
      this.modal.create(Object.assign(config, {
        nzTitle: (add ? 'Thêm' : 'Cập nhật') + (type === SalaryTypeEnum.ABSENT ? ' Khấu trừ' : ' tăng ca'),
        nzContent: AbsentOvertimeSalaryComponent,
        nzComponentParams: <{ data: ModalAddOrUpdateAbsentOrOvertime }>{
          data: {
            type: type,
            add: add,
            update: update
          }
        }
      }));
    }
    if (type === SalaryTypeEnum.BASIC || type === SalaryTypeEnum.STAY) {
      this.modal.create(Object.assign(config, {
        nzTitle: (add ? 'Thêm' : 'Cập nhật') + (type === SalaryTypeEnum.BASIC ? ' lương cơ bản' : ' phụ cấp lương'),
        nzContent: PermanentSalaryComponent,
        nzComponentParams: <{ data: ModalPermanentSalaryData }>{
          data: {
            type: type,
            add: add,
            update: update
          }
        }
      }));
    }
    if (type === SalaryTypeEnum.WFH) {
      this.modal.create(Object.assign(config, {
        nzTitle: add ? 'Thêm chú thích ngày' : 'Cập nhật chú thích ngày',
        nzContent: RemoteSalaryComponent,
        nzComponentParams: <{ data: ModalAddOrUpdateRemote }>{
          data: {
            add: add,
            update: update
          }
        },
      }))
    }
  }

  removeSalary(id: number, payrollId: number) {
  }

  confirmPayroll(payroll: PayrollEntity) {
    this.modal.create({
      nzTitle: 'Xác nhận phiếu lương tháng ' + this.datePipe.transform(payroll.createdAt, 'yyyy-MM'),
      nzContent: PayslipComponent,
      nzComponentParams: <{ data: { payroll: PayrollEntity } }>{
        data: {
          payroll
        }
      },
      nzFooter: ' '
    });
    // if(this.role !== Role.HUMAN_RESOURCE){
    //
    // }else{
    //   if(payroll.accConfirmedAt !== null){
    //     // restore payroll
    //   }else{
    //     this.message.warning('Phiếu lương chưa được xác nhận')
    //   }
    // }

  }

  historySalary(payroll: PayrollEntity) {
    this.router.navigate(['phieu-luong/lich-su-luong', payroll.employee.id],
      {
        queryParams: {
          name: payroll.employee.lastName,
          employeeType: payroll.employee.type
        }
      }).then();
  }

  navigatePayroll(payroll: PayrollEntity) {
    if (payroll.payrollIds) {
      const indexPayrollCurrent = payroll.payrollIds.indexOf(payroll.id);
      const payrollIds = payroll.payrollIds;
      if (indexPayrollCurrent < payrollIds.length - 1) {
        this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', payrollIds[indexPayrollCurrent + 1]]).then();
      } else {
        this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', payrollIds[0]]).then();
      }
    }
  }

  scanHoliday(payrollId: number) {
    this.actions$.dispatch(PayrollActions.scanHoliday({payrollId}))
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

  }

  updateTaxed(payroll: PayrollEntity) {
  }

  addOrUpdateNote(payroll: PayrollEntity) {
    this.modal.create({
      nzTitle: payroll.note ? ' Thêm chú thích' : 'Sửa chú thích',
      nzContent: ModalNoteComponent,
      nzComponentParams: <{ data?: { noteInit?: string } }>{
        data: {
          noteInit: payroll?.note
        }
      },
      nzFooter: ' '
    }).afterClose.subscribe(val => {
      this.actions$.dispatch(PayrollActions.update({id: payroll.id, updates: {note: val}}))
    })
  }

  updatePayroll(payroll: PayrollEntity) {
    this.modal.create({
      nzTitle: 'Cập nhật phiếu lương',
      nzContent: UpdatePayrollComponent,
      nzComponentParams: <{ data: { payroll: PayrollEntity } }>{
        data: {
          payroll
        }
      },
      nzFooter: ' '
    })
  }

  sortData(sort: Sort) {
    this.sortedSalaryOver = this.sortedSalaryOver.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title':
          return this.compare(b.title, a.title, isAsc);
        case 'datetime':
          return this.compare(b.startedAt, a.endedAt, isAsc);
        case 'unit':
          return this.compare(b.unit, a.unit, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  tranFormType(salaryTypes: SalaryTypeEnum[]): string {
    return tranFormSalaryType(salaryTypes);
  }

  onSalarySetting(title: string | undefined) {
    if (title) {
      this.router.navigate(['ban-mau'], {
        queryParams: {
          title: title
        }
      }).then();
    }
  }
}
