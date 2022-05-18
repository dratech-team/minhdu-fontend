import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {PayrollEntity} from "../../entities";
import {FormGroup} from "@angular/forms";
import {BranchQuery, PositionActions, PositionQuery} from "@minhdu-fontend/orgchart-v2";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollQuery, PayrollStore} from "../../state";
import {FilterTypeEnum, ItemContextMenu, Role, SalaryTypeEnum} from "@minhdu-fontend/enums";
import {filterSameSalary, rageDaysInMonth} from "@minhdu-fontend/utils";
import {PaidConstant} from "../../constants/paid.constant";
import {ConfirmConstant} from "../../constants/confirm.constant";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {ModalAlertComponent, ModalDatePickerComponent} from "@minhdu-fontend/components";
import {ModalAlertEntity, ModalDatePickerEntity} from "@minhdu-fontend/base-entity";
import {DatePipe} from "@angular/common";
import {PayrollActions} from "../../state/payroll.action";
import {SettingSalaryActions, SettingSalaryQuery} from "../../../setting/salary/state";
import {PayslipComponent} from "../payslip/payslip.component";
import {NzMessageService} from "ng-zorro-antd/message";
import {ScrollTablePayrollConstant} from "../../constants/scroll-table-payroll.constant";
import {SalaryEntity} from "../../../salary/entities";
import {ClassifySalaryComponent} from "../classify-salary/classify-salary.component";
import {PermanentSalaryComponent} from "../../../salary/components/permanent/permanent-salary.component";
import {ModalAddOrUpdateAllowance, ModalAddOrUpdatePermanent} from "../../data";
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

@Component({
  selector: 'minhdu-fontend-table-payroll',
  templateUrl: 'table-payroll.component.html',
})
export class TablePayrollComponent implements OnInit {
  @Input() payrolls!: PayrollEntity[]
  @Input() formGroup!: FormGroup
  @Input() isSalaryType: boolean = false
  @Input() scroll?: { x: string, y: string } = ScrollTablePayrollConstant.find(item =>
    item.type === this.payrollQuery.getValue().search.filterType)?.scroll
  @Output() onloadPayroll = new EventEmitter<{ isPagination: boolean }>()
  loading$ = this.payrollQuery.select(state => state.loading)
  loadMore$ = this.payrollQuery.select(state => state.loadMore)
  added$ = this.payrollQuery.select(state => state.added)
  total$ = this.payrollQuery.select(state => state.total)
  totalSalary$ = this.payrollQuery.select(state => state.totalSalary)
  expandAll$ = this.payrollQuery.select(state => state.expandAll)
  count$ = this.payrollQuery.selectCount()
  positions$ = this.positionQuery.selectAll()

  ItemContextMenu = ItemContextMenu;
  confirmConstant = ConfirmConstant
  paidConstant = PaidConstant
  daysInMonth = rageDaysInMonth(new Date(this.payrollQuery.getValue().search.startedAt))
  filterTypeEnum = FilterTypeEnum
  salaryType = SalaryTypeEnum
  deletingSalary = false

  salariesSelected: SalaryEntity[] = []
  role = localStorage.getItem('role')
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
  ) {
  }

  ngOnInit() {
    this.added$.subscribe(added => {
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

  onPagination() {
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
    this.modal.create({
      nzTitle: 'Xoá phiếu lương',
      nzContent: ModalAlertComponent,
      nzComponentParams: <{ data: ModalAlertEntity }>{
        data: {
          description: 'bạn có muốn xoá phiếu lương tháng ' +
            this.datePipe.transform(payroll.createdAt, 'MM-yyyy') +
            'của nhân viên ' + payroll.employee.lastName
        }
      },
      nzFooter: []
    }).afterClose.subscribe(val => {
      if (val) {
        this.actions$.dispatch(PayrollActions.remove({id: payroll.id}))
      }
    })
  }

  onUpdate($event: any) {
  }

  onRestore(payroll: PayrollEntity) {
    this.modal.create({
      nzTitle: 'Khôi phục phiếu lương',
      nzContent: ModalAlertComponent,
      nzComponentParams: <{ data: ModalAlertEntity }>{
        data: {
          description: `bạn có chắc chắn muốn khôi phục phiếu lương tháng
          ${this.datePipe.transform(payroll.createdAt, 'MM-yyyy')}
          cho nhân viên ${payroll.employee.lastName}`
        }
      },
      nzFooter: []
    }).afterClose.subscribe(val => {
      if (val) {
        this.actions$.dispatch(PayrollActions.restore({id: payroll.id}))
      }
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
    if (this.role !== Role.HUMAN_RESOURCE) {
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
    this.modal.create({
      nzTitle: 'Xác nhận phiếu chấm công',
      nzContent: ModalAlertComponent,
      nzComponentParams: <{ data: ModalAlertEntity }>{
        data: {
          description: `bạn có chắc chắn muốn xác nhận phiếu chấm công tháng
          ${this.datePipe.transform(payroll.createdAt, 'MM-yyyy')}
          cho nhân viên ${payroll.employee.lastName}`
        }
      },
      nzFooter: []
    }).afterClose.subscribe(val => {
      if (val) {
        this.actions$.dispatch(PayrollActions.confirmPayroll({
          id: payroll.id,
          data: {
            datetime: payroll.manConfirmedAt ? null : new Date(payroll.createdAt)
          }
        }))
      }
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

  onLoadSettingSalary(type: SalaryTypeEnum) {
    this.actions$.dispatch(SettingSalaryActions.loadAll({
      search: {
        types: type === SalaryTypeEnum.BASIC
          ? [SalaryTypeEnum.BASIC, SalaryTypeEnum.BASIC_INSURANCE]
          : [type]
      }
    }))
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
              switch (this.formGroup.value.filterType) {
                case FilterTypeEnum.ALLOWANCE:
                  console.log(payroll.allowances.map(salary => Object.assign(salary, {payroll: payroll})))
                  return payroll.allowances.map(salary => Object.assign(salary, {payroll: payroll}))
                default:
                  return payroll.salariesv2.map(salary => Object.assign(salary, {payroll: payroll}))
              }
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
           this.updateSalarySuccess(val)
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
            this.updateSalarySuccess(val)
          }
        })
    }
  }

  onDeleteSalary() {
    this.modal.create({
      nzTitle: `Xoá lương  ${this.salariesSelected[0]?.title || this.salariesSelected[0]?.setting?.title}`,
      nzContent: ModalAlertComponent,
      nzComponentParams: <{ data: ModalAlertEntity }>{
        data: {
          description: `Bạn có có chắc chắn muốn xoá
          ${this.salariesSelected.length} bảng lương
          ${this.salariesSelected[0]?.title || this.salariesSelected[0]?.setting?.title}`
        }
      },
      nzFooter: []
    }).afterClose.subscribe(value => {
      if (value) {
        this.deletingSalary = true
        const service = ((this.salariesSelected[0].type === SalaryTypeEnum.BASIC
            || this.salariesSelected[0].type === SalaryTypeEnum.STAY
            || this.salariesSelected[0].type === SalaryTypeEnum.BASIC_INSURANCE
          )
            ? this.permanentService
            : this.salariesSelected[0].type === SalaryTypeEnum.ALLOWANCE
              ? this.allowanceSalaryService
              : this.salariesSelected[0].type === SalaryTypeEnum.OVERTIME
                ? this.overtimeSalaryService
                : this.salariesSelected[0].type === SalaryTypeEnum.ABSENT
                  ? this.absentSalaryService
                  : this.deductionSalaryService
        );
        service.deleteMany({salaryIds: this.salariesSelected.map(e => e.id)}).pipe(
          catchError(err => {
            this.deletingSalary = false
            this.message.warning(err);
            return throwError(err);
          })
        ).subscribe(res => {
          this.deletingSalary = false
          this.message.success(res.message);
          this.onloadPayroll.emit({isPagination: false})
        });
      }
    });
  }

  private updateSalarySuccess(title: string){
    this.salariesSelected = []
    this.formGroup.get('titles')?.setValue([title], {emitEvent: false})
    this.onloadPayroll.emit({isPagination: false})
  }
}
