import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';
import { Overtime } from '../../../../../../../../libs/data-models/hr/salary/overtime';
import { OvertimeService } from '../../service/overtime.service';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import { select, Store } from '@ngrx/store';
import {
  selectedLoadedPayroll,
  selectorAllPayrollSeasonal
} from '../../+state/payroll/payroll.selector';
import { DatePipe } from '@angular/common';
import { AddPayrollComponent } from '../add-Payroll/add-payroll.component';
import { DialogManConfirmedAtComponent } from '../dialog-manconfirmedAt/dialog-man-confirmed-at.component';
import { Observable } from 'rxjs';
import { Branch, Position } from '@minhdu-fontend/data-models';
import { Payroll } from '../../+state/payroll/payroll.interface';

@Component({
  selector: 'app-payroll-seasonal',
  templateUrl: 'payroll-seasonal.component.html'
})
export class PayrollSeasonalComponent implements OnInit {
  @Input() payroll$!: Observable<Payroll[]>
  loaded$ = this.store.pipe(select(selectedLoadedPayroll));
  @Input() formGroup!: FormGroup;
  @Input() positions$!: Observable<Position[]>;
  @Input() branches$!: Observable<Branch[]>;
  unit = DatetimeUnitEnum;
  overtime!: Overtime;
  loaded = false;
  pageType = PageTypeEnum;
  pageSize: number = 30;
  pageIndexInit = 0;
  @Output() EventHistoryPayroll = new EventEmitter<any>();
  @Output() EventRestorePayroll = new EventEmitter<any>();
  @Output() EventReadPayroll = new EventEmitter<any>();
  @Output() EventUpdateConfirm = new EventEmitter<any>();
  @Output() EventDeletePayroll = new EventEmitter<any>();
  @Output() EventSelectPosition = new EventEmitter<string>();
  @Output() EventSelectBranch = new EventEmitter<string>();

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly overtimeService: OvertimeService,
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit() {
  }

  onScroll() {

  }

  addPayroll($event?: any): void {
    const ref = this.dialog.open(AddPayrollComponent,
      { width: '30%', data: { employeeId: $event?.employee?.id, addOne: true } });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.formGroup.get('createdAt')!.patchValue(this.datePipe.transform(val, 'yyyy-MM'));
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
}
