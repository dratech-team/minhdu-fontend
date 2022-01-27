import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatetimeUnitEnum, EmployeeType, FilterTypeEnum, ItemContextMenu } from '@minhdu-fontend/enums';
import { OvertimeService } from '../../service/overtime.service';
import { select, Store } from '@ngrx/store';
import { selectedLoadedPayroll } from '../../+state/payroll/payroll.selector';
import { DatePipe } from '@angular/common';
import { AddPayrollComponent } from '../add-Payroll/add-payroll.component';
import { DialogManConfirmedAtComponent } from '../dialog-manconfirmedAt/dialog-man-confirmed-at.component';
import { Observable, Subject } from 'rxjs';
import { Branch, Position } from '@minhdu-fontend/data-models';
import { Payroll } from '../../+state/payroll/payroll.interface';
import { checkInputNumber } from '@minhdu-fontend/utils';
import { DialogExportComponent } from '@minhdu-fontend/components';
import { Api } from '@minhdu-fontend/constants';

@Component({
  selector: 'minhdu-fontend-payroll-seasonal',
  templateUrl: 'payroll-seasonal.component.html'
})
export class PayrollSeasonalComponent implements OnInit {
  @Input() payroll$!: Observable<Payroll[]>;
  @Input() total$!: Observable<number>;
  @Input() eventExportSeasonal?: Subject<any>;
  @Input() formGroup!: FormGroup;
  @Input() positions$!: Observable<Position[]>;
  @Input() branches$!: Observable<Branch[]>;
  @Output() EventHistoryPayroll = new EventEmitter<any>();
  @Output() EventRestorePayroll = new EventEmitter<any>();
  @Output() EventReadPayroll = new EventEmitter<any>();
  @Output() EventUpdateConfirm = new EventEmitter<any>();
  @Output() EventDeletePayroll = new EventEmitter<any>();
  @Output() EventSelectPosition = new EventEmitter<string>();
  @Output() EventSelectBranch = new EventEmitter<string>();
  @Output() EventScroll = new EventEmitter<any>();

  unit = DatetimeUnitEnum;
  loaded = false;
  ItemContextMenu = ItemContextMenu;
  pageSize = 30;
  pageIndexInit = 0;
  loaded$ = this.store.pipe(select(selectedLoadedPayroll));

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly overtimeService: OvertimeService,
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.eventExportSeasonal?.subscribe((val) => {
      if (val) {
        const value = this.formGroup.value;
        const payrollSeasonal = {
          code: value.code || '',
          name: value.name,
          position: value.position,
          branch: value.branch,
          exportType: FilterTypeEnum.SEASONAL,
          paidAt: value.paidAt,
          accConfirmedAt: value.accConfirmedAt,
          employeeType: EmployeeType.EMPLOYEE_SEASONAL
        };
        if (value.createdAt) {
          Object.assign(payrollSeasonal, { createdAt: value.createdAt });
        }
        this.dialog.open(DialogExportComponent, {
          width: 'fit-content',
          data: {
            title: 'Xuât bảng lương công nhật',
            exportType: FilterTypeEnum.SEASONAL,
            params: payrollSeasonal,
            isPayroll: true,
            api: Api.HR.PAYROLL.EXPORT
          }
        });
      }
    });
  }


  onScroll() {
    this.EventScroll.emit();
  }

  addPayroll($event?: any): void {
    const ref = this.dialog.open(AddPayrollComponent,
      { width: '30%', data: { employeeId: $event?.employee?.id, addOne: true } });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.formGroup.get('createdAt')?.patchValue(this.datePipe.transform(val, 'yyyy-MM'));
      }
    });
  }

  onSelectPosition(positionName: string) {
    this.EventSelectPosition.emit(positionName);
  }

  onSelectBranch(branchName: string) {
    this.EventSelectBranch.emit(branchName);
  }

  readPayroll($event: any) {
    this.EventReadPayroll.emit($event);
  }

  restorePayroll(event: any) {
    this.EventRestorePayroll.emit(event);
  }

  updateConfirmPayroll(id: number, type: string) {
    this.EventUpdateConfirm.emit({ id, type });
  }

  updateManConfirm(id: number, manConfirmedAt: any, createdAt?: Date) {
    this.dialog.open(DialogManConfirmedAtComponent, {
      width: 'fit-content',
      data: { id, createdAt, manConfirmedAt: !!manConfirmedAt }
    });
  }

  deletePayroll(event: any) {
    this.EventDeletePayroll.emit(event);
  }

  historyPayroll(event: any) {
    this.EventHistoryPayroll.emit(event);
  }

  checkInputNumber(event: any) {
    return checkInputNumber(event);
  }
}
