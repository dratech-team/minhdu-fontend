import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DatetimeUnitEnum,
  EmployeeType,
  ModeEnum,
  RecipeType,
  Role,
  SalaryTypeEnum,
} from '@minhdu-fontend/enums';
import { PartialDayEnum } from '@minhdu-fontend/data-models';
import { getDaysInMonth } from '@minhdu-fontend/utils';
import { DatePipe } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, map, tap } from 'rxjs/operators';
import { PayrollQuery, PayrollStore } from '../../state';
import { PayrollActions } from '../../state/payroll.action';
import { PayrollEntity } from '../../entities';
import { tranFormSalaryType } from '../../utils';
import { PermanentSalaryComponent } from '../../../salary/components/permanent/permanent-salary.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AbsentOvertimeSalaryComponent } from '../../../salary/components/absent-overtime/absent-overtime-salary.component';
import { SalaryEntity, UnionSalary } from '../../../salary/entities';
import { PayslipComponent } from '../../components/payslip/payslip.component';
import { AllowanceSalaryComponent } from '../../../salary/components/allowance/allowance-salary.component';
import { Actions } from '@datorama/akita-ng-effects';
import {
  ModalAlertComponent,
  ModalNoteComponent,
} from '@minhdu-fontend/components';
import { ModalAlertEntity } from '@minhdu-fontend/base-entity';
import {
  AbsentSalaryService,
  AllowanceSalaryService,
  DeductionSalaryService,
  OvertimeSalaryService,
  SalaryPermanentService,
  SalaryRemoteService,
} from '../../../salary/service';
import { throwError } from 'rxjs';
import { UpdatePayrollComponent } from '../../components/update/update-payroll.component';
import { RemoteOrDayOffSalaryComponent } from '../../../salary/components/remote-or-day-off/remote-or-day-off-salary.component';
import { DeductionSalaryComponent } from '../../../salary/components/deduction/deduction-salary.component';
import { RemoteConstant } from '../../../salary/constants/remote.constant';
import { UnitSalaryConstant } from '../../../salary/constants';
import { SessionConstant } from '../../../../../shared/constants';
import { HolidaySalaryComponent } from '../../../salary/components/holiday/holiday-salary.component';
import {
  ModalAddOrUpdateAbsentOrOvertime,
  ModalAddOrUpdateAllowance,
  ModalAddOrUpdateHoliday,
  ModalAddOrUpdateRemoteOrDayOff,
  ModalPermanentSalaryData,
} from '../../../salary/data';
import { NzTableSortOrder } from 'ng-zorro-antd/table';
import { SettingSalaryStore } from '../../../setting/salary/state';
import { FilterSalaryEnum } from '../../enums/filter-salary.enum';
import { DayOffSalaryService } from '../../../salary/service/day-off-salary.service';
import { ModalAddOrUpdateDeduction } from '../../../salary/data/modal-deduction-salary.data';
import { AccountQuery } from '../../../../../../../../libs/system/src/lib/state/account-management/account.query';
import { SalaryHolidayService } from '../../../salary/service/salary-holiday.service';
import { SortSalaryUtil } from '../../utils/sort-salary.util';

@Component({
  templateUrl: 'detail-payroll.component.html',
  styleUrls: ['detail-payroll.component.scss'],
})
export class DetailPayrollComponent implements OnInit {
  payroll$ = this.payrollQuery.selectEntity(this.getPayrollId).pipe(
    map((payroll) => {
      if (payroll) {
        return JSON.parse(JSON.stringify(payroll));
      }
      return payroll;
    }),
    tap((payroll) => {
      if (payroll?.createdAt) {
        this.daysInMonth = getDaysInMonth(payroll.createdAt);
      } else {
        this.daysInMonth = new Date().getDate();
      }
    })
  );
  currentUser$ = this.accountQuery.selectCurrentUser();
  loading$ = this.payrollQuery.select((state) => state.loading);

  remoteConstant = RemoteConstant;
  unitSalaryConstant = UnitSalaryConstant;
  sessionConstant = SessionConstant;

  salaryTypeEnum = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  PartialDay = PartialDayEnum;
  employeeTypeEnum = EmployeeType;
  recipeType = RecipeType;

  daysInMonth!: number;
  isSticky = false;
  currentUser = this.accountQuery.getCurrentUser();
  roleEnum = Role;
  modeEnum = ModeEnum;
  filterSalaryEnum = FilterSalaryEnum;

  constructor(
    private readonly payrollQuery: PayrollQuery,
    private readonly payrollStore: PayrollStore,
    private readonly settingSalaryStore: SettingSalaryStore,
    private readonly actions$: Actions,
    private readonly activatedRoute: ActivatedRoute,
    public readonly router: Router,
    private readonly modal: NzModalService,
    private readonly datePipe: DatePipe,
    private readonly absentSalaryService: AbsentSalaryService,
    private readonly deductionSalaryService: DeductionSalaryService,
    private readonly permanentService: SalaryPermanentService,
    private readonly overtimeSalaryService: OvertimeSalaryService,
    private readonly allowanceSalaryService: AllowanceSalaryService,
    private readonly salaryRemoteService: SalaryRemoteService,
    private readonly salaryHolidayService: SalaryHolidayService,
    private readonly dayOffSalaryService: DayOffSalaryService,
    private readonly message: NzMessageService,
    private readonly accountQuery: AccountQuery
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    this.actions$.dispatch(PayrollActions.loadOne({ id: this.getPayrollId }));
  }

  get getPayrollId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  onAddSalary(
    type: SalaryTypeEnum,
    payroll: PayrollEntity,
    salary?: SalaryEntity
  ) {
    const config = {
      nzFooter: [],
      nzWidth: '40vw',
    };
    this.onOpenSalary(type, config, { payroll, salary });
  }

  onUpdateSalary(
    type: SalaryTypeEnum,
    salary: SalaryEntity,
    payroll?: PayrollEntity
  ) {
    const config = {
      nzFooter: [],
      nzWidth: '40vw',
    };
    this.onOpenSalary(type, config, undefined, {
      salary: Object.assign(
        {},
        salary,
        type === SalaryTypeEnum.ALLOWANCE
          ? { workedAt: payroll?.employee.workedAt }
          : {}
      ),
    });
  }

  onOpenSalary(
    type: SalaryTypeEnum,
    config: any,
    add?: {
      payroll: PayrollEntity;
      salary?: SalaryEntity;
    },
    update?: { salary: UnionSalary }
  ) {
    const ref = () => {
      switch (type) {
        case SalaryTypeEnum.ALLOWANCE: {
          return this.modal.create(
            Object.assign({}, config, {
              nzTitle: add ? 'Th??m ph??? c???p' : 'C???p nh???t ph??? c???p',
              nzContent: AllowanceSalaryComponent,
              nzComponentParams: <{ data: ModalAddOrUpdateAllowance }>{
                data: {
                  type: type,
                  add: add,
                  update: update,
                },
              },
            })
          );
        }
        case SalaryTypeEnum.OVERTIME:
        case SalaryTypeEnum.ABSENT: {
          return this.modal.create(
            Object.assign({}, config, {
              nzTitle:
                (add ? 'Th??m' : 'C???p nh???t') +
                (type === SalaryTypeEnum.ABSENT ? ' V???ng' : ' t??ng ca'),
              nzContent: AbsentOvertimeSalaryComponent,
              nzComponentParams: <{ data: ModalAddOrUpdateAbsentOrOvertime }>{
                data: {
                  type: type,
                  add: add,
                  update: update,
                },
              },
            })
          );
        }
        case SalaryTypeEnum.BASIC:
        case SalaryTypeEnum.STAY: {
          return this.modal.create(
            Object.assign({}, config, {
              nzTitle:
                (add ? 'Th??m' : 'C???p nh???t') +
                (type === SalaryTypeEnum.BASIC
                  ? ' l????ng c?? b???n'
                  : ' ph??? c???p l????ng'),
              nzContent: PermanentSalaryComponent,
              nzComponentParams: <{ data: ModalPermanentSalaryData }>{
                data: {
                  type: type,
                  add: add,
                  update: update,
                },
              },
            })
          );
        }
        case SalaryTypeEnum.WFH:
        case SalaryTypeEnum.DAY_OFF: {
          return this.modal.create(
            Object.assign({}, config, {
              nzTitle:
                (add ? 'Th??m ' : 'C???p nh???t ') +
                (type === SalaryTypeEnum.WFH
                  ? 'Remote/Onsite/WFH'
                  : 'ng??y kh??ng ??i l??m'),
              nzContent: RemoteOrDayOffSalaryComponent,
              nzComponentParams: <{ data: ModalAddOrUpdateRemoteOrDayOff }>{
                data: {
                  type: type,
                  add: add,
                  update: update,
                },
              },
            })
          );
        }
        case SalaryTypeEnum.DEDUCTION: {
          return this.modal.create(
            Object.assign(config, {
              nzTitle: add ? 'Th??m kh???u tr???' : 'C???p nh???t kh???u tr???',
              nzContent: DeductionSalaryComponent,
              nzComponentParams: <{ data: ModalAddOrUpdateDeduction }>{
                data: {
                  add: add,
                  update: update,
                },
              },
            })
          );
        }
        default: {
          return this.modal.create(
            Object.assign(config, {
              nzTitle: add ? 'Th??m ng??y l???' : 'C???p nh???t ng??y l???',
              nzContent: HolidaySalaryComponent,
              nzComponentParams: <{ data: ModalAddOrUpdateHoliday }>{
                data: {
                  add: add,
                  update: update,
                },
              },
            })
          );
        }
      }
    };

    ref().afterClose.subscribe((val) => {
      if (val) {
        if (type === SalaryTypeEnum.OVERTIME && update) {
          this.payrollStore.update(this.getPayrollId, (entity) => ({
            idUpdate: Object.assign({}, entity.idUpdate, {
              overtime: update.salary.id,
            }),
          }));
        }
        this.actions$.dispatch(
          PayrollActions.loadOne({ id: this.getPayrollId })
        );
      }
    });
  }

  onRemoveSalary(type: SalaryTypeEnum, salary: SalaryEntity) {
    this.modal.warning({
      nzTitle: `Xo?? ${
        salary?.title ||
        salary?.setting?.title ||
        salary.setting?.type ||
        salary.type
      }`,
      nzContent: `B???n c?? ch???c ch???n mu???n xo?? ${
        salary?.title ||
        salary?.setting?.title ||
        salary.setting?.type ||
        salary?.type
      }`,
      nzOkDanger: true,
      nzOnOk: () => {
        const service =
          type === SalaryTypeEnum.BASIC || type === SalaryTypeEnum.STAY
            ? this.permanentService
            : type === SalaryTypeEnum.ALLOWANCE
            ? this.allowanceSalaryService
            : type === SalaryTypeEnum.OVERTIME
            ? this.overtimeSalaryService
            : type === SalaryTypeEnum.WFH
            ? this.salaryRemoteService
            : type === SalaryTypeEnum.ABSENT
            ? this.absentSalaryService
            : type === SalaryTypeEnum.HOLIDAY
            ? this.salaryHolidayService
            : type === SalaryTypeEnum.DAY_OFF
            ? this.dayOffSalaryService
            : this.deductionSalaryService;

        service
          .deleteMany({ salaryIds: [salary.id] })
          .pipe(
            catchError((err) => {
              this.message.warning(err);
              return throwError(err);
            })
          )
          .subscribe((res) => {
            this.message.success(res.message);
            this.actions$.dispatch(
              PayrollActions.loadOne({ id: salary.payrollId })
            );
          });
      },
    });
  }

  confirmPayroll(payroll: PayrollEntity) {
    if (this.currentUser?.role.role !== Role.HUMAN_RESOURCE) {
      this.modal.create({
        nzTitle:
          'X??c nh???n phi???u l????ng th??ng ' +
          this.datePipe.transform(payroll.createdAt, 'yyyy-MM'),
        nzContent: PayslipComponent,
        nzComponentParams: <{ data: { payroll: PayrollEntity } }>{
          data: {
            payroll,
          },
        },
        nzFooter: ' ',
      });
    } else {
      if (payroll.accConfirmedAt !== null) {
        this.modal
          .create({
            nzTitle: 'Kh??i ph???c phi???u l????ng',
            nzContent: ModalAlertComponent,
            nzComponentParams: <{ data: ModalAlertEntity }>{
              data: {
                description: `b???n c?? ch???c ch???n mu???n kh??i ph???c phi???u l????ng th??ng
          ${this.datePipe.transform(payroll.createdAt, 'MM-yyyy')}
          cho nh??n vi??n ${payroll.employee.lastName}`,
              },
            },
            nzFooter: [],
          })
          .afterClose.subscribe((val) => {
            if (val) {
              this.actions$.dispatch(
                PayrollActions.restore({ id: payroll.id })
              );
            }
          });
      } else {
        this.message.warning('Phi???u l????ng ch??a ???????c x??c nh???n');
      }
    }
  }

  historySalary(payroll: PayrollEntity) {
    this.router
      .navigate(['phieu-luong/lich-su-luong', payroll.employee.id], {
        queryParams: {
          name: payroll.employee.lastName,
          employeeType: payroll.employee.type,
        },
      })
      .then();
  }

  navigatePayroll(payroll: PayrollEntity) {
    if (payroll.payrollIds) {
      const indexPayrollCurrent = payroll.payrollIds.indexOf(payroll.id);
      const payrollIds = payroll.payrollIds;
      if (indexPayrollCurrent < payrollIds.length - 1) {
        this.router
          .navigate([
            'phieu-luong/chi-tiet-phieu-luong',
            payrollIds[indexPayrollCurrent + 1],
          ])
          .then();
      } else {
        this.router
          .navigate(['phieu-luong/chi-tiet-phieu-luong', payrollIds[0]])
          .then();
      }
    }
  }

  scroll(target: HTMLElement, sticky: HTMLElement) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  deletePayroll(event: any) {}

  updateTaxed(payroll: PayrollEntity) {
    this.modal
      .create({
        nzTitle: 'C???p nh???t t??nh th???u',
        nzContent: ModalAlertComponent,
        nzWidth: '500px',
        nzComponentParams: <{ data: ModalAlertEntity }>{
          data: {
            description: `B???n mu???n ${
              payroll.taxed ? 't???t' : 'b???t'
            } tr??? thu??? cho phi???u l????ng th??ng
          ${this.datePipe.transform(
            new Date(payroll.createdAt),
            'MM-yyyy'
          )} c???a nh??n vi??n
          ${payroll.employee.lastName}`,
          },
        },
        nzFooter: ' ',
      })
      .afterClose.subscribe((value) => {
        if (value) {
          this.actions$.dispatch(
            PayrollActions.update({
              id: payroll.id,
              updates: { taxed: !payroll.taxed },
            })
          );
        }
      });
  }

  addOrUpdateNote(payroll: PayrollEntity) {
    this.modal
      .create({
        nzTitle: payroll.note ? ' Th??m ch?? th??ch' : 'S???a ch?? th??ch',
        nzContent: ModalNoteComponent,
        nzComponentParams: <{ data?: { noteInit?: string } }>{
          data: {
            noteInit: payroll?.note,
          },
        },
        nzFooter: ' ',
      })
      .afterClose.subscribe((val) => {
        this.actions$.dispatch(
          PayrollActions.update({ id: payroll.id, updates: { note: val } })
        );
      });
  }

  updatePayroll(payroll: PayrollEntity) {
    this.modal.create({
      nzTitle: 'C???p nh???t phi???u l????ng',
      nzContent: UpdatePayrollComponent,
      nzComponentParams: <{ data: { payroll: PayrollEntity } }>{
        data: {
          payroll,
        },
      },
      nzFooter: ' ',
    });
  }

  tranFormType(salaryTypes: SalaryTypeEnum[]): string {
    return tranFormSalaryType(salaryTypes);
  }

  onSalarySetting(title: string | undefined) {
    if (title) {
      this.settingSalaryStore.update((state) => ({
        ...state,
        search: Object.assign(JSON.parse(JSON.stringify(state.search)), {
          search: title,
        }),
      }));
      this.router.navigate(['cai-dat']).then();
    }
  }

  onSort(
    column: FilterSalaryEnum,
    type: NzTableSortOrder,
    salaries: SalaryEntity[],
    salaryType?: SalaryTypeEnum
  ) {
    if (salaryType === SalaryTypeEnum.OVERTIME) {
      this.payrollStore.update(this.getPayrollId, {
        overtimes: SortSalaryUtil(column, type, salaries),
      });
    } else {
      SortSalaryUtil(column, type, salaries);
    }
  }

  prePayroll(payroll: PayrollEntity) {
    const indexPayrollCurrent = payroll.payrollIds.indexOf(payroll.id);
    if (indexPayrollCurrent > 0) {
      this.router
        .navigate([
          'phieu-luong/chi-tiet-phieu-luong',
          payroll.payrollIds[indexPayrollCurrent - 1],
        ])
        .then();
    } else {
      this.router
        .navigate([
          'phieu-luong/chi-tiet-phieu-luong',
          payroll.payrollIds.slice(-1)[0],
        ])
        .then();
    }
  }

  nextPayroll(payroll: PayrollEntity) {
    const indexPayrollCurrent = payroll.payrollIds.indexOf(payroll.id);
    if (indexPayrollCurrent < payroll.payrollIds.length - 1) {
      this.router
        .navigate([
          'phieu-luong/chi-tiet-phieu-luong',
          payroll.payrollIds[indexPayrollCurrent + 1],
        ])
        .then();
    } else {
      this.router
        .navigate(['phieu-luong/chi-tiet-phieu-luong', payroll.payrollIds[0]])
        .then();
    }
  }
}
