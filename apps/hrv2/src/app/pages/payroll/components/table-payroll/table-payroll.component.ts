import { Component, Input, OnInit } from '@angular/core';
import { PayrollEntity } from '../../entities';
import { FormGroup } from '@angular/forms';
import { PositionActions, PositionQuery } from '../../../../../../../../libs/orgchart-v2/src/lib/position/state';
import { BranchQuery } from '../../../../../../../../libs/orgchart-v2/src/lib/branch/state';
import { Actions } from '@datorama/akita-ng-effects';
import { PayrollQuery, PayrollStore } from '../../state';
import { FilterTypeEnum, ItemContextMenu } from '@minhdu-fontend/enums';
import { rageDaysInMonth } from '@minhdu-fontend/utils';
import { PaidConstant } from '../../constants/paid.constant';
import { ConfirmConstant } from '../../constants/confirm.constant';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalDatePickerComponent } from '../../../../../../../../libs/components/src/lib/modal-date-picker/modal-date-picker.component';
import { ModalDatePickerEntity } from '@minhdu-fontend/base-entity';
import { Subject } from 'rxjs';
import { PayrollActions } from '../../state/payroll.action';


@Component({
  selector: 'minhdu-fontend-table-payroll',
  templateUrl: 'table-payroll.component.html'
})
export class TablePayrollComponent implements OnInit {
  @Input() payrolls!: PayrollEntity[];
  @Input() formGroup!: FormGroup;
  @Input() onChange?: Subject<void>;
  @Input() pageSize = 10;
  @Input() history?: {
    employeeId: number
  };
  @Input() scroll: { x: string, y: string } = { x: '5000px', y: '56vh' };
  added$ = this.payrollQuery.select(state => state.added);
  loading$ = this.payrollQuery.select(state => state.loading);
  positions$ = this.positionQuery.selectAll();
  ItemContextMenu = ItemContextMenu;
  confirmConstant = ConfirmConstant;
  paidConstant = PaidConstant;
  daysInMonth = rageDaysInMonth(this.payrollQuery.getValue().search.startedAt);
  filterTypeEnum = FilterTypeEnum;
  compareFN = (o1: any, o2: any) => (o1 && o2 ? (o1.id == o2.id || o1 === o2.name) : o1 === o2);


  constructor(
    private readonly positionQuery: PositionQuery,
    private readonly branchQuery: BranchQuery,
    private readonly payrollStore: PayrollStore,
    private readonly payrollQuery: PayrollQuery,
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly modal: NzModalService
  ) {
  }

  ngOnInit() {
    this.formGroup.get('filterType')?.valueChanges.subscribe(val => {
      switch (val) {
        case FilterTypeEnum.SEASONAL:
          this.scroll = { x: '3000px', y: '56vh' };
          break;
        case FilterTypeEnum.TIME_SHEET:
          this.scroll = { x: '5000px', y: '56vh' };
          break;
        default:
          this.scroll = { x: '4200px', y: '56vh' };
      }
    });
    this.actions$.dispatch(PositionActions.loadAll({}));
    this.payrollQuery.select(state => state.search.startedAt).subscribe(val => {
      this.daysInMonth = rageDaysInMonth(val);
    });
    this.onChange?.subscribe(_ => this.onAdd());
  }

  onPagination(index: number) {
  }

  onAdd(employeeId?: number) {
    this.modal.create({
      nzTitle: 'Tạo phiếu lương',
      nzContent: ModalDatePickerComponent,
      nzComponentParams: <{ data: ModalDatePickerEntity }>{
        data: {
          type: 'month',
          dateInit: this.payrollQuery.getValue().search.startedAt
        }
      },
      nzFooter: ' '
    }).afterClose.subscribe(date => {
      if (date) {
        this.actions$.dispatch(PayrollActions.addOne({
          body: {
            createdAt: date,
            employeeId: this.history?.employeeId || employeeId
          },
          inHistory: !!this.history
        }));
      }
    });
  }

  onDelete($event: any) {

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
