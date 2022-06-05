import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {PayrollEntity} from "../../entities";
import {FormGroup} from "@angular/forms";
import {BranchQuery, PositionActions, PositionQuery} from "@minhdu-fontend/orgchart-v2";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollQuery, PayrollStore} from "../../state";
import { FilterTypeEnum, ItemContextMenu, ModeEnum, Role, SalaryTypeEnum } from '@minhdu-fontend/enums';
import {filterSameSalary, rageDaysInMonth} from "@minhdu-fontend/utils";
import {PaidConstant} from "../../constants/paid.constant";
import {ConfirmConstant} from "../../constants/confirm.constant";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {ModalDatePickerComponent} from "@minhdu-fontend/components";
import {ModalDatePickerEntity} from "@minhdu-fontend/base-entity";
import {DatePipe} from "@angular/common";
import {PayrollActions} from "../../state/payroll.action";
import {SettingSalaryQuery} from "../../../setting/salary/state";
import {PayslipComponent} from "../payslip/payslip.component";
import {NzMessageService} from "ng-zorro-antd/message";
import {ScrollTablePayrollConstant} from "../../constants/scroll-table-payroll.constant";
import {SalaryEntity} from "../../../salary/entities";
import {ClassifySalaryComponent} from "../classify-salary/classify-salary.component";
import {PermanentSalaryComponent} from "../../../salary/components/permanent/permanent-salary.component";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {
  AbsentSalaryService,
  AllowanceSalaryService,
  DeductionSalaryService,
  OvertimeSalaryService,
  SalaryPermanentService
} from "../../../salary/service";
import {AllowanceSalaryComponent} from "../../../salary/components/allowance/allowance-salary.component";
import {SessionConstant} from "../../../../../shared/constants";
import {
  AbsentOvertimeSalaryComponent
} from "../../../salary/components/absent-overtime/absent-overtime-salary.component";
import {PartialDayEnum} from "@minhdu-fontend/data-models";
import {UpdatePayrollComponent} from "../update/update-payroll.component";
import {ModalSelectAddSalaryComponent} from "../modal-select-add-salary/modal-select-add-salary.component";
import {
  ModalAddOrUpdateAbsentOrOvertime,
  ModalAddOrUpdateAllowance,
  ModalAddOrUpdatePermanent
} from "../../../salary/data";
import {AccountQuery} from "../../../../../../../../libs/system/src/lib/state/account-management/account.query";

@Component({
  selector: 'minhdu-fontend-table-payroll',
  templateUrl: 'table-payroll.component.html',
})
export class TablePayrollComponent implements OnInit {
  @Input() payrolls!: PayrollEntity[];
  @Input() formGroup!: FormGroup;
  @Input() isSalaryType: boolean = false;
  @Input() scroll?: { x: string, y: string } = ScrollTablePayrollConstant.find(item =>
    item.type === this.payrollQuery.getValue().search.filterType)?.scroll;
  @Output() onloadPayroll = new EventEmitter<{ isPagination: boolean }>();
  loading$ = this.payrollQuery.select(state => state.loading);
  total$ = this.payrollQuery.select(state => state.total);
  remain$ = this.payrollQuery.select(state => state.remain);
  totalSalary$ = this.payrollQuery.select(state => state.totalSalary);
  expandAll$ = this.payrollQuery.select(state => state.expandAll);
  count$ = this.payrollQuery.selectCount();
  positions$ = this.positionQuery.selectAll();
  currentUser$ = this.accountQuery.selectCurrentUser()

  ItemContextMenu = ItemContextMenu;
  modeEnum = ModeEnum;
  confirmConstant = ConfirmConstant
  paidConstant = PaidConstant
  daysInMonth = rageDaysInMonth(new Date(this.payrollQuery.getValue().search.startedAt))
  filterTypeEnum = FilterTypeEnum
  salaryType = SalaryTypeEnum
  deletingSalary = false
  salariesSelected: SalaryEntity[] = []
  sessionConstant = SessionConstant;
  partialDay = PartialDayEnum
  compareFN = (o1: any, o2: any) => (o1 && o2 ? (o1.id == o2.id || o1 === o2.name) : o1 === o2);

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
  ) {
  }

  ngOnInit() {
    this.loading$.subscribe(added => {
      if (added) {
        this.onloadPayroll.emit({isPagination: false})
      }
    })

    this.formGroup.get('filterType')?.valueChanges.subscribe(val => {
      this.scroll = ScrollTablePayrollConstant.find(item => item.type === val)?.scroll
    })

    this.actions$.dispatch(PositionActions.loadAll({}))
    this.payrollQuery.select(state => state.search.startedAt).subscribe(val => {
      this.daysInMonth = rageDaysInMonth(new Date(val))
    })
  }

  onLoadMore() {
    this.onloadPayroll.emit({isPagination: true})
  }

  onAdd(payroll: PayrollEntity) {
    this.modal.create({
      nzTitle: 'Tạo phiếu lương',
      nzContent: ModalDatePickerComponent,
      nzComponentParams: <{ data: ModalDatePickerEntity }>{
        data: {
          type: "month",
          dateInit: this.payrollQuery.getValue().search.startedAt
        }
      },
      nzFooter: ' '
    }).afterClose.subscribe(date => {
      if (date) {
        this.actions$.dispatch(PayrollActions.addOne({
          body: {
            createdAt: this.payrollQuery.getValue().search.startedAt,
            employeeId: payroll.employee.id
          }
        }))
      }
    })
  }

  onDelete(payroll: PayrollEntity) {
    this.modal.warning({
      nzTitle: 'Xoá phiếu lương',
      nzContent: 'bạn có muốn xoá phiếu lương tháng ' +
        this.datePipe.transform(payroll.createdAt, 'MM-yyyy') +
        'của nhân viên ' + payroll.employee.lastName,
      nzOkDanger: true,
      nzOnOk: () => this.actions$.dispatch(PayrollActions.remove({id: payroll.id})),
    })
  }

  onUpdate(payroll: PayrollEntity) {
    this.modal.create({
      nzTitle: 'Cập nhật phiếu lương',
      nzContent: UpdatePayrollComponent,
      nzComponentParams: <{ data: { payroll: PayrollEntity } }>{
        data: {
          payroll
        }
      },
      nzFooter: []
    });
  }

  onRestore(payroll: PayrollEntity) {
    this.modal.info({
      nzTitle: 'Khôi phục phiếu lương',
      nzContent: `bạn có chắc chắn muốn khôi phục phiếu lương tháng
          ${this.datePipe.transform(payroll.createdAt, 'MM-yyyy')}
          cho nhân viên ${payroll.employee.lastName}`,
      nzOkType: 'default',
      nzOnOk: () => this.actions$.dispatch(PayrollActions.restore({id: payroll.id}))
    })
  }

  onHistory(payroll: PayrollEntity) {
    this.router.navigate(['phieu-luong/lich-su-luong/', payroll.id], {
      queryParams: {
        name: payroll.employee.lastName
      }
    }).then()
  }

  onConfirm(payroll: PayrollEntity) {
    if (this.accountQuery.getCurrentUser()?.role?.role !== Role.HUMAN_RESOURCE) {
      this.modal.create({
        nzTitle: 'Xác nhận phiếu lương tháng ' + this.datePipe.transform(payroll.createdAt, 'yyyy-MM'),
        nzContent: PayslipComponent,
        nzComponentParams: <{ data: { payroll: PayrollEntity } }>{
          data: {
            payroll: payroll
          }
        },
        nzFooter: ' '
      });
    } else {
      this.message.warning('Quản lý nhân sự không được xác nhận phiếu lương')
    }
  }

  onPrint($event: any) {

  }

  onConfirmPaidAtOrAccConfirm(payroll: PayrollEntity, type: 'paidAt' | 'accConfirmedAt') {
    this.modal.create({
      nzWidth: '250px',
      nzTitle: type === "paidAt" ? 'Xác nhận thanh toán' : 'Kế toán xác nhận',
      nzContent: ModalDatePickerComponent,
      nzComponentParams: <{ data: ModalDatePickerEntity }>{
        data: {
          type: 'date',
          dateInit: new Date()
        }
      },
      nzFooter: []
    }).afterClose.subscribe(val => {
      if (val) {
        this.actions$.dispatch(PayrollActions.confirmPayroll({
          id: payroll.id,
          data: {
            datetime: new Date(val)
          }
        }))
      }
    })
  }

  onUpdateManConfirm(payroll: PayrollEntity,) {
    this.modal.info({
      nzTitle: 'Xác nhận phiếu chấm công',
      nzContent: `bạn có chắc chắn muốn xác nhận phiếu chấm công tháng
          ${this.datePipe.transform(payroll.createdAt, 'MM-yyyy')}
          cho nhân viên ${payroll.employee.lastName}`,
      nzOkType: 'primary',
      nzOnOk: () => this.actions$.dispatch(PayrollActions.confirmPayroll({
        id: payroll.id,
        data: {
          datetime: payroll.manConfirmedAt ? null : new Date(payroll.createdAt)
        }
      }))
    })
  }

  async onDetail(payroll: PayrollEntity) {
    return await this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', payroll.id],
      {
        queryParams: {
          isUpdate: true
        }
      });
  }

  onUpdateSelectSalary(salary: any, checked: boolean) {
    this.modal.create({
      nzTitle: `${checked ? 'Chọn' : 'Bỏ chọn'} loại lương ${salary.title || salary.setting?.title}`,
      nzContent: ClassifySalaryComponent,
      nzComponentParams: <{ data: { type: 'SELECT' | 'REMOVE', salary: SalaryEntity } }>{
        data: {
          type: checked ? 'SELECT' : 'REMOVE',
          salary: salary
        }
      },
      nzFooter: []
    }).afterClose.subscribe(type => {
      if (type === 'ALL') {
        this.salariesSelected = []
        if (checked) {
          this.salariesSelected = [...filterSameSalary(
            this.payrolls.map(payroll => {
              return (this.formGroup.value.filterType === FilterTypeEnum.ABSENT
                ? payroll.absents
                : this.formGroup.value.filterType === FilterTypeEnum.OVERTIME
                  ? payroll.overtimes
                  : this.formGroup.value.filterType === FilterTypeEnum.ALLOWANCE
                    ? payroll.allowances
                    : payroll.salariesv2)
                .map(salary => Object.assign(salary, {payroll: payroll}))
            }).flat()
            , salary)]
        }
      } else {
        if (checked) {
          this.salariesSelected.push(salary)
        } else {
          const index = this.salariesSelected.findIndex(item => item.id === salary.id)
          this.salariesSelected.splice(index, 1)
        }
      }
    })
  }

  onExpandAll() {
    const expandAll = this.payrollQuery.getValue().expandAll;
    this.payrollQuery.getAll().forEach((payroll: PayrollEntity) => {
      this.payrollStore.update(payroll.id, {expand: !expandAll});
    });
    this.payrollStore.update(state => ({...state, expandAll: !expandAll}));
  }

  checkSelect(salaryId: number): boolean {
    return this.salariesSelected.some(e => e.id == salaryId)
  }

  onUpdateSalary() {
    const data = {
      update: {
        salary: this.salariesSelected[0],
        multiple: {
          salaries: this.salariesSelected
        }
      }
    }
    switch (this.formGroup.value.filterType) {
      case FilterTypeEnum.OVERTIME:
      case FilterTypeEnum.ABSENT:
        this.modal.create({
          nzTitle: `Cập nhật ${this.formGroup.value.filterType === SalaryTypeEnum.OVERTIME ? 'tăng ca' : 'vắng'}`,
          nzContent: AbsentOvertimeSalaryComponent,
          nzComponentParams: <{ data: ModalAddOrUpdateAbsentOrOvertime }>{
            data: Object.assign(data, {type: this.salariesSelected[0]?.setting?.type})
          },
          nzFooter: []
        }).afterClose.subscribe(val => {
          if (val) {
            this.updateOrAddSalarySuccess(val)
          }
        })
        break
      case FilterTypeEnum.ALLOWANCE:
        this.modal.create({
          nzTitle: 'Cập nhật Phụ cấp lương',
          nzContent: AllowanceSalaryComponent,
          nzComponentParams: <{ data: ModalAddOrUpdateAllowance }>{
            data: data
          },
          nzFooter: []
        }).afterClose.subscribe(val => {
          if (val) {
            this.updateOrAddSalarySuccess(val)
          }
        })
        break
      default:
        this.modal.create({
          nzTitle: 'Cập nhật lương cố định',
          nzContent: PermanentSalaryComponent,
          nzComponentParams: <{ data: ModalAddOrUpdatePermanent }>{
            data: Object.assign(data, {type: this.salariesSelected[0].type})
          },
          nzFooter: []
        }).afterClose.subscribe(val => {
          if (val) {
            this.updateOrAddSalarySuccess(val)
          }
        })
    }
  }

  onDeleteSalary() {
    this.modal.warning({
      nzTitle: `Xoá lương  ${this.salariesSelected[0]?.title || this.salariesSelected[0]?.setting?.title}`,
      nzContent: `Bạn có có chắc chắn muốn xoá
          ${this.salariesSelected.length}
          ${this.salariesSelected[0]?.title || this.salariesSelected[0]?.setting?.title} này không`,
      nzOkDanger: true,
      nzOnOk: () => {
        this.deletingSalary = true
        const filterType = this.formGroup.value.filterType
        const service = (filterType === FilterTypeEnum.PERMANENT
            ? this.permanentService
            : filterType === SalaryTypeEnum.ALLOWANCE
              ? this.allowanceSalaryService
              : filterType === SalaryTypeEnum.OVERTIME
                ? this.overtimeSalaryService
                : filterType === SalaryTypeEnum.ABSENT
                  ? this.absentSalaryService
                  : this.deductionSalaryService
        );
        service.deleteMany({salaryIds: this.salariesSelected.map(e => e.id)}).pipe(
          catchError(err => {
            this.deletingSalary = false
            this.salariesSelected = []
            this.message.warning(err);
            return throwError(err);
          })
        ).subscribe(res => {
          this.deletingSalary = false
          this.message.success(res.message);
          this.onloadPayroll.emit({isPagination: false})
        });
      }
    })
  }

  private updateOrAddSalarySuccess(title: string) {
    this.salariesSelected = []
    this.formGroup.get('titles')?.setValue([title], {emitEvent: false})
    this.onloadPayroll.emit({isPagination: false})
  }

  onAddSalary() {
    switch (this.formGroup.value.filterType) {
      case FilterTypeEnum.PERMANENT:
        this.modal.create({
          nzWidth: '300px',
          nzTitle: 'Chọn Loại lương',
          nzContent: ModalSelectAddSalaryComponent,
          nzFooter: []
        }).afterClose.subscribe(val => {
          if (val) {
            this.updateOrAddSalarySuccess(val)
          }
        })
        break
      case FilterTypeEnum.OVERTIME:
      case FilterTypeEnum.ABSENT:
        this.modal.create({
          nzWidth: 'fit-content',
          nzTitle: `Thêm ${this.formGroup.value.filterType === SalaryTypeEnum.OVERTIME ? 'tăng ca' : 'vắng'}`,
          nzContent: AbsentOvertimeSalaryComponent,
          nzComponentParams: <{ data: ModalAddOrUpdateAbsentOrOvertime }>{
            data: {
              type: this.formGroup.value.filterType,
              add: {
                multiple: true
              }
            }
          },
          nzFooter: []
        }).afterClose.subscribe(val => {
          if (val) {
            this.updateOrAddSalarySuccess(val)
          }
        })
        break
      case FilterTypeEnum.ALLOWANCE:
        this.modal.create({
          nzWidth: 'fit-content',
          nzTitle: 'Thêm phụ cấp lương',
          nzContent: AllowanceSalaryComponent,
          nzComponentParams: <{ data: ModalAddOrUpdateAllowance }>{
            data: {
              add: {
                multiple: true
              }
            }
          },
          nzFooter: []
        }).afterClose.subscribe(val => {
          if (val) {
            this.updateOrAddSalarySuccess(val)
          }
        })
    }
  }
}
