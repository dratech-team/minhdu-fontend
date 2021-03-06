import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PayrollEntity } from '../../entities';
import { UntypedFormGroup } from '@angular/forms';
import { BranchQuery, PositionQuery } from '@minhdu-fontend/orgchart-v2';
import { Actions } from '@datorama/akita-ng-effects';
import { PayrollQuery, PayrollStore } from '../../state';
import {
  FilterTypeEnum,
  ItemContextMenu,
  ModeEnum,
  Role,
  SalaryTypeEnum,
} from '@minhdu-fontend/enums';
import { filterSameSalary, rageDaysInMonth } from '@minhdu-fontend/utils';
import { PaidConstant } from '../../constants/paid.constant';
import { ConfirmConstant } from '../../constants/confirm.constant';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalDatePickerComponent } from '@minhdu-fontend/components';
import { ModalDatePickerEntity } from '@minhdu-fontend/base-entity';
import { DatePipe } from '@angular/common';
import { PayrollActions } from '../../state/payroll.action';
import { SettingSalaryQuery } from '../../../setting/salary/state';
import { PayslipComponent } from '../payslip/payslip.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ScrollTablePayrollConstant } from '../../constants/scroll-table-payroll.constant';
import { SalaryEntity } from '../../../salary/entities';
import { ClassifySalaryComponent } from '../classify-salary/classify-salary.component';
import { PermanentSalaryComponent } from '../../../salary/components/permanent/permanent-salary.component';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {
  AbsentSalaryService,
  AllowanceSalaryService,
  DeductionSalaryService,
  OvertimeSalaryService,
  SalaryPermanentService,
} from '../../../salary/service';
import { AllowanceSalaryComponent } from '../../../salary/components/allowance/allowance-salary.component';
import { SessionConstant } from '../../../../../shared/constants';
import { AbsentOvertimeSalaryComponent } from '../../../salary/components/absent-overtime/absent-overtime-salary.component';
import { PartialDayEnum } from '@minhdu-fontend/data-models';
import { UpdatePayrollComponent } from '../update/update-payroll.component';
import { ModalSelectAddSalaryComponent } from '../modal-select-add-salary/modal-select-add-salary.component';
import {
  ModalAddOrUpdateAbsentOrOvertime,
  ModalAddOrUpdateAllowance,
  ModalAddOrUpdatePermanent,
} from '../../../salary/data';
import { AccountQuery } from '../../../../../../../../libs/system/src/lib/state/account-management/account.query';

@Component({
  selector: 'minhdu-fontend-table-payroll',
  templateUrl: 'table-payroll.component.html',
})
export class TablePayrollComponent implements OnInit {
  @Input() payrolls!: PayrollEntity[];
  @Input() formGroup!: UntypedFormGroup;
  @Input() isSalaryType: boolean = false;
  @Input() scroll?: { x: string; y: string } = ScrollTablePayrollConstant.find(
    (item) => item.type === this.payrollQuery.getValue().search.filterType
  )?.scroll;
  @Output() onloadPayroll = new EventEmitter<{ isPagination: boolean }>();
  loading$ = this.payrollQuery.select((state) => state.loading);
  total$ = this.payrollQuery.select((state) => state.total);
  remain$ = this.payrollQuery.select((state) => state.remain);
  totalSalary$ = this.payrollQuery.select((state) => state.totalSalary);
  expandAll$ = this.payrollQuery.select((state) => state.expandAll);
  count$ = this.payrollQuery.selectCount();
  positions$ = this.positionQuery.selectAll();
  currentUser$ = this.accountQuery.selectCurrentUser();

  ItemContextMenu = ItemContextMenu;
  modeEnum = ModeEnum;
  confirmConstant = ConfirmConstant;
  paidConstant = PaidConstant;
  daysInMonth = rageDaysInMonth(
    new Date(this.payrollQuery.getValue().search.startedAt)
  );
  filterTypeEnum = FilterTypeEnum;
  salaryType = SalaryTypeEnum;
  deletingSalary = false;
  salariesSelected: SalaryEntity[] = [];
  sessionConstant = SessionConstant;
  partialDay = PartialDayEnum;
  compareFN = (o1: any, o2: any) =>
    o1 && o2 ? o1.id == o2.id || o1 === o2.name : o1 === o2;

  constructor(
    private readonly settingSalaryQuery: SettingSalaryQuery,
    private readonly positionQuery: PositionQuery,
    private readonly branchQuery: BranchQuery,
    private readonly payrollStore: PayrollStore,
    private readonly payrollQuery: PayrollQuery,
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly modal: NzModalService,
    private readonly datePipe: DatePipe,
    private readonly message: NzMessageService,
    private readonly absentSalaryService: AbsentSalaryService,
    private readonly deductionSalaryService: DeductionSalaryService,
    private readonly permanentService: SalaryPermanentService,
    private readonly overtimeSalaryService: OvertimeSalaryService,
    private readonly allowanceSalaryService: AllowanceSalaryService,
    private readonly accountQuery: AccountQuery
  ) {}

  ngOnInit() {
    this.onloadPayroll.emit({ isPagination: false });
    this.formGroup.get('filterType')?.valueChanges.subscribe((val) => {
      this.scroll = ScrollTablePayrollConstant.find(
        (item) => item.type === val
      )?.scroll;
    });

    this.payrollQuery
      .select((state) => state.search.startedAt)
      .subscribe((val) => {
        this.daysInMonth = rageDaysInMonth(new Date(val));
      });
  }

  onLoadMore() {
    this.onloadPayroll.emit({ isPagination: true });
  }

  onAdd(payroll: PayrollEntity) {
    this.modal
      .create({
        nzTitle: 'T???o phi???u l????ng',
        nzContent: ModalDatePickerComponent,
        nzComponentParams: <{ data: ModalDatePickerEntity }>{
          data: {
            type: 'month',
            dateInit: this.payrollQuery.getValue().search.startedAt,
          },
        },
        nzFooter: ' ',
      })
      .afterClose.subscribe((date) => {
        if (date) {
          this.actions$.dispatch(
            PayrollActions.addOne({
              body: {
                createdAt: new Date(date),
                employeeId: payroll.employee.id,
              },
            })
          );
        }
      });
  }

  onDelete(payroll: PayrollEntity) {
    this.modal.warning({
      nzTitle: 'Xo?? phi???u l????ng',
      nzContent:
        'b???n c?? mu???n xo?? phi???u l????ng th??ng ' +
        this.datePipe.transform(payroll.createdAt, 'MM-yyyy') +
        'c???a nh??n vi??n ' +
        payroll.employee.lastName,
      nzOkDanger: true,
      nzOnOk: () =>
        this.actions$.dispatch(PayrollActions.remove({ id: payroll.id })),
    });
  }

  onUpdate(payroll: PayrollEntity) {
    this.modal.create({
      nzTitle: 'C???p nh???t phi???u l????ng',
      nzContent: UpdatePayrollComponent,
      nzComponentParams: <{ data: { payroll: PayrollEntity } }>{
        data: {
          payroll,
        },
      },
      nzFooter: [],
    });
  }

  onRestore(payroll: PayrollEntity) {
    this.modal.info({
      nzTitle: 'Kh??i ph???c phi???u l????ng',
      nzContent: `b???n c?? ch???c ch???n mu???n kh??i ph???c phi???u l????ng th??ng
          ${this.datePipe.transform(payroll.createdAt, 'MM-yyyy')}
          cho nh??n vi??n ${payroll.employee.lastName}`,
      nzOkType: 'default',
      nzOnOk: () =>
        this.actions$.dispatch(PayrollActions.restore({ id: payroll.id })),
    });
  }

  onHistory(payroll: PayrollEntity) {
    this.router
      .navigate(['phieu-luong/lich-su-luong/', payroll.id], {
        queryParams: {
          name: payroll.employee.lastName,
        },
      })
      .then();
  }

  onConfirm(payroll: PayrollEntity) {
    if (
      this.accountQuery.getCurrentUser()?.role?.role !== Role.HUMAN_RESOURCE
    ) {
      this.modal.create({
        nzTitle:
          'X??c nh???n phi???u l????ng th??ng ' +
          this.datePipe.transform(payroll.createdAt, 'yyyy-MM'),
        nzContent: PayslipComponent,
        nzComponentParams: <{ data: { payroll: PayrollEntity } }>{
          data: {
            payroll: payroll,
          },
        },
        nzFooter: ' ',
      });
    } else {
      this.message.warning('Qu???n l?? nh??n s??? kh??ng ???????c x??c nh???n phi???u l????ng');
    }
  }

  onPrint($event: any) {}

  onConfirmPaidAtOrAccConfirm(
    payroll: PayrollEntity,
    type: 'paidAt' | 'accConfirmedAt'
  ) {
    this.modal
      .create({
        nzWidth: '250px',
        nzTitle: type === 'paidAt' ? 'X??c nh???n thanh to??n' : 'K??? to??n x??c nh???n',
        nzContent: ModalDatePickerComponent,
        nzComponentParams: <{ data: ModalDatePickerEntity }>{
          data: {
            type: 'date',
            dateInit: new Date(),
          },
        },
        nzFooter: [],
      })
      .afterClose.subscribe((val) => {
        if (val) {
          this.actions$.dispatch(
            PayrollActions.confirmPayroll({
              id: payroll.id,
              data: {
                datetime: new Date(val),
              },
            })
          );
        }
      });
  }

  onUpdateManConfirm(payroll: PayrollEntity) {
    this.modal.info({
      nzTitle: 'X??c nh???n phi???u ch???m c??ng',
      nzContent: `b???n c?? ch???c ch???n mu???n x??c nh???n phi???u ch???m c??ng th??ng
          ${this.datePipe.transform(payroll.createdAt, 'MM-yyyy')}
          cho nh??n vi??n ${payroll.employee.lastName}`,
      nzOkType: 'primary',
      nzOnOk: () =>
        this.actions$.dispatch(
          PayrollActions.confirmPayroll({
            id: payroll.id,
            data: {
              datetime: payroll.manConfirmedAt
                ? null
                : new Date(payroll.createdAt),
            },
          })
        ),
    });
  }

  async onDetail(payroll: PayrollEntity) {
    return await this.router.navigate([
      'phieu-luong/chi-tiet-phieu-luong',
      payroll.id,
    ]);
  }

  onUpdateSelectSalary(salary: any, checked: boolean) {
    this.modal
      .create({
        nzTitle: `${checked ? 'Ch???n' : 'B??? ch???n'} lo???i l????ng ${
          salary.title || salary.setting?.title
        }`,
        nzContent: ClassifySalaryComponent,
        nzComponentParams: <
          { data: { type: 'SELECT' | 'REMOVE'; salary: SalaryEntity } }
        >{
          data: {
            type: checked ? 'SELECT' : 'REMOVE',
            salary: salary,
          },
        },
        nzFooter: [],
      })
      .afterClose.subscribe((type) => {
        if (type === 'ALL') {
          this.salariesSelected = [];
          if (checked) {
            this.salariesSelected = [
              ...filterSameSalary(
                this.payrolls
                  .map((payroll) => {
                    return (
                      this.formGroup.value.filterType === FilterTypeEnum.ABSENT
                        ? payroll.absents
                        : this.formGroup.value.filterType ===
                          FilterTypeEnum.OVERTIME
                        ? payroll.overtimes
                        : this.formGroup.value.filterType ===
                          FilterTypeEnum.ALLOWANCE
                        ? payroll.allowances
                        : payroll.salariesv2
                    ).map((salary) =>
                      Object.assign(salary, { payroll: payroll })
                    );
                  })
                  .flat(),
                salary
              ),
            ];
          }
        } else {
          if (checked) {
            this.salariesSelected.push(salary);
          } else {
            const index = this.salariesSelected.findIndex(
              (item) => item.id === salary.id
            );
            this.salariesSelected.splice(index, 1);
          }
        }
      });
  }

  onExpandAll() {
    const expandAll = this.payrollQuery.getValue().expandAll;
    this.payrollQuery.getAll().forEach((payroll: PayrollEntity) => {
      this.payrollStore.update(payroll.id, { expand: !expandAll });
    });
    this.payrollStore.update((state) => ({ ...state, expandAll: !expandAll }));
  }

  checkSelect(salaryId: number): boolean {
    return this.salariesSelected.some((e) => e.id == salaryId);
  }

  onUpdateSalary() {
    const data = {
      update: {
        salary: this.salariesSelected[0],
        multiple: {
          salaries: this.salariesSelected,
        },
      },
    };
    switch (this.formGroup.value.filterType) {
      case FilterTypeEnum.OVERTIME:
      case FilterTypeEnum.ABSENT:
        this.modal
          .create({
            nzTitle: `C???p nh???t ${
              this.formGroup.value.filterType === SalaryTypeEnum.OVERTIME
                ? 't??ng ca'
                : 'v???ng'
            }`,
            nzContent: AbsentOvertimeSalaryComponent,
            nzComponentParams: <{ data: ModalAddOrUpdateAbsentOrOvertime }>{
              data: Object.assign(data, {
                type: this.salariesSelected[0]?.setting?.type,
              }),
            },
            nzFooter: [],
          })
          .afterClose.subscribe((val) => {
            if (val) {
              this.updateOrAddSalarySuccess(val);
            }
          });
        break;
      case FilterTypeEnum.ALLOWANCE:
        this.modal
          .create({
            nzTitle: 'C???p nh???t Ph??? c???p l????ng',
            nzContent: AllowanceSalaryComponent,
            nzComponentParams: <{ data: ModalAddOrUpdateAllowance }>{
              data: data,
            },
            nzFooter: [],
          })
          .afterClose.subscribe((val) => {
            if (val) {
              this.updateOrAddSalarySuccess(val);
            }
          });
        break;
      default:
        this.modal
          .create({
            nzTitle: 'C???p nh???t l????ng c??? ?????nh',
            nzContent: PermanentSalaryComponent,
            nzComponentParams: <{ data: ModalAddOrUpdatePermanent }>{
              data: Object.assign(data, {
                type: this.salariesSelected[0].type,
              }),
            },
            nzFooter: [],
          })
          .afterClose.subscribe((val) => {
            if (val) {
              this.updateOrAddSalarySuccess(val);
            }
          });
    }
  }

  onDeleteSalary() {
    this.modal.warning({
      nzTitle: `Xo?? l????ng  ${
        this.salariesSelected[0]?.title ||
        this.salariesSelected[0]?.setting?.title
      }`,
      nzContent: `B???n c?? c?? ch???c ch???n mu???n xo??
          ${this.salariesSelected.length}
          ${
            this.salariesSelected[0]?.title ||
            this.salariesSelected[0]?.setting?.title
          } n??y kh??ng`,
      nzOkDanger: true,
      nzOnOk: () => {
        this.deletingSalary = true;
        const filterType = this.formGroup.value.filterType;
        const service =
          filterType === FilterTypeEnum.PERMANENT
            ? this.permanentService
            : filterType === SalaryTypeEnum.ALLOWANCE
            ? this.allowanceSalaryService
            : filterType === SalaryTypeEnum.OVERTIME
            ? this.overtimeSalaryService
            : filterType === SalaryTypeEnum.ABSENT
            ? this.absentSalaryService
            : this.deductionSalaryService;
        service
          .deleteMany({ salaryIds: this.salariesSelected.map((e) => e.id) })
          .pipe(
            catchError((err) => {
              this.deletingSalary = false;
              this.salariesSelected = [];
              this.message.warning(err);
              return throwError(err);
            })
          )
          .subscribe((res) => {
            this.deletingSalary = false;
            this.message.success(res.message);
            this.onloadPayroll.emit({ isPagination: false });
          });
      },
    });
  }

  private updateOrAddSalarySuccess(title: string) {
    this.salariesSelected = [];
    this.formGroup.get('titles')?.setValue([title], { emitEvent: false });
    this.onloadPayroll.emit({ isPagination: false });
  }

  onAddSalary() {
    switch (this.formGroup.value.filterType) {
      case FilterTypeEnum.PERMANENT:
        this.modal
          .create({
            nzWidth: '300px',
            nzTitle: 'Ch???n Lo???i l????ng',
            nzContent: ModalSelectAddSalaryComponent,
            nzFooter: [],
          })
          .afterClose.subscribe((val) => {
            if (val) {
              this.updateOrAddSalarySuccess(val);
            }
          });
        break;
      case FilterTypeEnum.OVERTIME:
      case FilterTypeEnum.ABSENT:
        this.modal
          .create({
            nzWidth: 'fit-content',
            nzTitle: `Th??m ${
              this.formGroup.value.filterType === SalaryTypeEnum.OVERTIME
                ? 't??ng ca'
                : 'v???ng'
            }`,
            nzContent: AbsentOvertimeSalaryComponent,
            nzComponentParams: <{ data: ModalAddOrUpdateAbsentOrOvertime }>{
              data: {
                type: this.formGroup.value.filterType,
                add: {
                  multiple: true,
                },
              },
            },
            nzFooter: [],
          })
          .afterClose.subscribe((val) => {
            if (val) {
              this.updateOrAddSalarySuccess(val);
            }
          });
        break;
      case FilterTypeEnum.ALLOWANCE:
        this.modal
          .create({
            nzWidth: 'fit-content',
            nzTitle: 'Th??m ph??? c???p l????ng',
            nzContent: AllowanceSalaryComponent,
            nzComponentParams: <{ data: ModalAddOrUpdateAllowance }>{
              data: {
                add: {
                  multiple: true,
                },
              },
            },
            nzFooter: [],
          })
          .afterClose.subscribe((val) => {
            if (val) {
              this.updateOrAddSalarySuccess(val);
            }
          });
    }
  }
}
