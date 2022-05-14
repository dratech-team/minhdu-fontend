import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {PayrollEntity} from "../../entities";
import {FormGroup} from "@angular/forms";
import {BranchQuery, PositionActions, PositionQuery} from "@minhdu-fontend/orgchart-v2";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollQuery, PayrollStore} from "../../state";
import {FilterTypeEnum, ItemContextMenu, Role} from "@minhdu-fontend/enums";
import {rageDaysInMonth} from "@minhdu-fontend/utils";
import {PaidConstant} from "../../constants/paid.constant";
import {ConfirmConstant} from "../../constants/confirm.constant";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {ModalAlertComponent, ModalDatePickerComponent} from "@minhdu-fontend/components";
import {ModalAlertEntity, ModalDatePickerEntity} from "@minhdu-fontend/base-entity";
import {DatePipe} from "@angular/common";
import {PayrollActions} from "../../state/payroll.action";
import {PayslipComponent} from "../payslip/payslip.component";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzTableComponent} from "ng-zorro-antd/table";

@Component({
  selector: 'minhdu-fontend-table-payroll',
  templateUrl: 'table-payroll.component.html'
})
export class TablePayrollComponent implements OnInit{
  @ViewChild('tablePayroll') tablePayroll!: NzTableComponent<any>
  @Input() payrolls!: PayrollEntity[]
  @Input() formGroup!: FormGroup
  @Input() scroll: { x: string, y: string } = {x: '5000px', y: '51vh'}
  @Output() onloadPayroll = new EventEmitter<{ isPagination: boolean }>()
  loading$ = this.payrollQuery.select(state => state.loading)
  loadMore$ = this.payrollQuery.select(state => state.loadMore)
  added$ = this.payrollQuery.select(state => state.added)
  total$ = this.payrollQuery.select(state => state.total)
  count$ = this.payrollQuery.selectCount()
  positions$ = this.positionQuery.selectAll()

  ItemContextMenu = ItemContextMenu;
  confirmConstant = ConfirmConstant
  paidConstant = PaidConstant
  daysInMonth = rageDaysInMonth(new Date(this.payrollQuery.getValue().search.startedAt))
  filterTypeEnum = FilterTypeEnum
  role = localStorage.getItem('role')
  compareFN = (o1: any, o2: any) => (o1 && o2 ? (o1.id == o2.id || o1 === o2.name) : o1 === o2);


  constructor(
    private readonly positionQuery: PositionQuery,
    private readonly branchQuery: BranchQuery,
    private readonly payrollStore: PayrollStore,
    private readonly payrollQuery: PayrollQuery,
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly modal: NzModalService,
    private readonly datePipe: DatePipe,
    private readonly message: NzMessageService,
  ) {
  }

  ngOnInit() {
    this.added$.subscribe(added => {
      if (added) {
        this.onloadPayroll.emit({isPagination: false})
      }
    })

    this.formGroup.get('filterType')?.valueChanges.subscribe(val => {
      switch (val) {
        case FilterTypeEnum.SEASONAL:
          this.scroll = {x: '3000px', y: '51vh'}
          break
        case FilterTypeEnum.TIME_SHEET:
          this.scroll = {x: '5000px', y: '51vh'}
          break
        default:
          this.scroll = {x: '4200px', y: '51vh'}
      }
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
    console.log(payroll)
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
}
