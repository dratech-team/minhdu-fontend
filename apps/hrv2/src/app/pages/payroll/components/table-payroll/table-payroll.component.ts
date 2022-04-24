import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {PayrollEntity} from "../../entities";
import {FormGroup} from "@angular/forms";
import {PositionActions, PositionQuery} from "../../../../../../../../libs/orgchart-v2/src/lib/position/state";
import {BranchQuery} from "../../../../../../../../libs/orgchart-v2/src/lib/branch/state";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollQuery, PayrollStore} from "../../state";
import {FilterTypeEnum, ItemContextMenu} from "@minhdu-fontend/enums";
import {rageDaysInMonth} from "@minhdu-fontend/utils";
import {PaidConstant} from "../../constants/paid.constant";
import {ConfirmConstant} from "../../constants/confirm.constant";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  ModalDatePickerComponent
} from "../../../../../../../../libs/components/src/lib/modal-date-picker/modal-date-picker.component";
import {ModalAlertComponent} from "@minhdu-fontend/components";
import {ModalAlertEntity} from "../../../../../../../../libs/entities/modal-alert.entity";
import {DatePipe} from "@angular/common";
import {loadAll, PayrollActions} from "../../state/payroll.action";
import {Subject} from "rxjs";
import {ModalDatePickerEntity} from "@minhdu-fontend/base-entity";


@Component({
  selector: 'minhdu-fontend-table-payroll',
  templateUrl: 'table-payroll.component.html'
})
export class TablePayrollComponent implements OnInit {
  @Input() payrolls!: PayrollEntity[]
  @Input() formGroup!: FormGroup
  @Input() pageSize = 10;
  @Input() scroll: { x: string, y: string } = {x: '5000px', y: '56vh'}
  @Input() onChange?: Subject<void>
  @Output() onloadPayroll = new EventEmitter<{isPagination: boolean}>()
  loading$ = this.payrollQuery.select(state => state.loading)
  added$ = this.payrollQuery.select(state => state.added)
  positions$ = this.positionQuery.selectAll()
  ItemContextMenu = ItemContextMenu;
  confirmConstant = ConfirmConstant
  paidConstant = PaidConstant
  daysInMonth = rageDaysInMonth(this.payrollQuery.getValue().search.startedAt)
  filterTypeEnum = FilterTypeEnum
  compareFN = (o1: any, o2: any) => (o1 && o2 ? (o1.id == o2.id || o1 === o2.name) : o1 === o2);


  constructor(
    private readonly positionQuery: PositionQuery,
    private readonly branchQuery: BranchQuery,
    private readonly payrollStore: PayrollStore,
    private readonly payrollQuery: PayrollQuery,
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly modal: NzModalService,
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.formGroup.get('filterType')?.valueChanges.subscribe(val => {
      switch (val) {
        case FilterTypeEnum.SEASONAL:
          this.scroll = {x: '3000px', y: '56vh'}
          break
        case FilterTypeEnum.TIME_SHEET:
          this.scroll = {x: '5000px', y: '56vh'}
          break
        default:
          this.scroll = {x: '4200px', y: '56vh'}
      }
    })
    this.actions$.dispatch(PositionActions.loadAll({}))
    this.payrollQuery.select(state => state.search.startedAt).subscribe(val => {
      this.daysInMonth = rageDaysInMonth(val)
    })
    if(this.onChange){
      this.onChange.subscribe(_ => this.onAdd())
    }
  }

  onPagination(index: number) {
  }

  onAdd(employeeId?: number) {
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
          createdAt: this.payrollQuery.getValue().search.startedAt,
          employeeId: employeeId
        }))
        this.added$.subscribe(added =>{
          if(added){
            this.onloadPayroll.emit({isPagination: false})
          }
        })
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
      }
    }).afterClose.subscribe(val => {
      if (val) {
        this.onloadPayroll.emit({isPagination: false})
      }
    })
  }

  onUpdate($event: any) {
  }

  onRestore($event: any) {

  }

  onHistory($event: any) {

  }

  onConfirm($event: any) {

  }

  onPrint($event: any) {

  }

  updateConfirm(id: number, paidAt: string) {

  }

  updateManConfirm(id: number, manConfirmedAt: any, createdAt?: Date) {
  }

  async onDetail(payroll: PayrollEntity) {
    return await this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', payroll.employee.id],
      {
        queryParams: {
          isUpdate: true
        }
      });
  }
}
