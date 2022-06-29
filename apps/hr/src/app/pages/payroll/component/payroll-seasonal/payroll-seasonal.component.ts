import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatetimeUnitEnum, ItemContextMenu } from '@minhdu-fontend/enums';
import { OvertimeService } from '../../service/overtime.service';
import { select, Store } from '@ngrx/store';
import { selectedLoadedPayroll } from '../../+state/payroll/payroll.selector';
import { DatePipe } from '@angular/common';
import { AddPayrollComponent } from '../add-Payroll/add-payroll.component';
import { DialogManConfirmedAtComponent } from '../dialog-manconfirmedAt/dialog-man-confirmed-at.component';
import { Observable } from 'rxjs';
import { Branch, Position } from '@minhdu-fontend/data-models';
import { Payroll } from '../../+state/payroll/payroll.interface';
import { checkInputNumber } from '@minhdu-fontend/utils';
import { ExportService } from '@minhdu-fontend/service';

@Component({
  selector: 'minhdu-fontend-payroll-seasonal',
  templateUrl: 'payroll-seasonal.component.html',
})
export class PayrollSeasonalComponent {
  @Input() payroll$!: Observable<Payroll[]>;
  @Input() total$!: Observable<number>;
  @Input() formGroup!: UntypedFormGroup;
  @Input() positions$!: Observable<Position[]>;
  @Input() branches$!: Observable<Branch[]>;
  @Output() EventHistoryPayroll = new EventEmitter<any>();
  @Output() EventRestorePayroll = new EventEmitter<any>();
  @Output() EventReadPayroll = new EventEmitter<any>();
  @Output() EventUpdateConfirm = new EventEmitter<any>();
  @Output() EventDeletePayroll = new EventEmitter<any>();
  @Output() EventSelectBranch = new EventEmitter<string>();
  @Output() EventScroll = new EventEmitter<any>();
  @Output() EventPrint = new EventEmitter<Payroll>();

  unit = DatetimeUnitEnum;
  loaded = false;
  ItemContextMenu = ItemContextMenu;
  pageSize = 30;
  pageIndexInit = 0;
  loaded$ = this.store.pipe(select(selectedLoadedPayroll));
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly overtimeService: OvertimeService,
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly datePipe: DatePipe,
    private readonly exportService: ExportService
  ) {}

  onScroll() {
    this.EventScroll.emit();
  }

  addPayroll($event?: any): void {
    const ref = this.dialog.open(AddPayrollComponent, {
      width: '30%',
      data: { employeeId: $event?.employee?.id, addOne: true },
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.formGroup
          .get('createdAt')
          ?.patchValue(this.datePipe.transform(val, 'yyyy-MM'));
      }
    });
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
      data: { id, createdAt, manConfirmedAt: !!manConfirmedAt },
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

  onPrint(payroll: Payroll) {
    this.EventPrint.emit(payroll);
  }
}
