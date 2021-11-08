import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatetimeUnitEnum, EmployeeType } from '@minhdu-fontend/enums';
import { Overtime } from '../../../../../../../../libs/data-models/hr/salary/overtime';
import { OvertimeService } from '../../service/overtime.service';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import { select, Store } from '@ngrx/store';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import {
  selectedBranchPayroll,
  selectedCreateAtPayroll,
  selectedLoadedPayroll,
  selectorAllPayrollSeasonal
} from '../../+state/payroll/payroll.selector';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { debounceTime } from 'rxjs/operators';
import { rageDaysInMonth } from '../../../../../../../../libs/utils/daytime.until';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { DatePipe } from '@angular/common';
import { AddPayrollComponent } from '../add-Payroll/add-payroll.component';
import { DialogManConfirmedAtComponent } from '../dialog-manconfirmedAt/dialog-man-confirmed-at.component';
import { getState } from '../../../../../../../../libs/utils/getState.ultils';

@Component({
  selector: 'app-payroll-seasonal',
  templateUrl: 'payroll-seasonal.component.html'
})
export class PayrollSeasonalComponent implements OnInit {
  @Input() monthPayroll!: Date;
  payroll$ = this.store.pipe(select(selectorAllPayrollSeasonal));
  loaded$ = this.store.pipe(select(selectedLoadedPayroll));
  formGroup = new FormGroup({
    name: new FormControl(''),
    paidAt: new FormControl(''),
    accConfirmedAt: new FormControl(''),
    manConfirmedAt: new FormControl(''),
    createdAt: new FormControl(this.datePipe.transform(
      getState(selectedCreateAtPayroll, this.store), 'yyyy-MM')),
    position: new FormControl(''),
    branch: new FormControl(getState(selectedBranchPayroll, this.store))
  });
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  unit = DatetimeUnitEnum;
  overtime!: Overtime;
  loaded = false;
  pageType = PageTypeEnum;
  pageSize: number = 30;
  pageIndexInit = 0;
  daysInMonth: any [] = [];
  @Output() EventHistoryPayroll = new EventEmitter<any>();
  @Output() EventRestorePayroll = new EventEmitter<any>();
  @Output() EventReadPayroll = new EventEmitter<any>();
  @Output() EventUpdateConfirm = new EventEmitter<any>();
  @Output() EventDeletePayroll = new EventEmitter<any>();

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly overtimeService: OvertimeService,
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.loadInitPayroll(this.monthPayroll);
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());
    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe((val) => {
      if (val.branch) {
        this.store.dispatch(PayrollAction.updateStatePayroll({ branch: val.branch }));
      }
      if (val.createdAt) {
        this.store.dispatch(PayrollAction.updateStatePayroll({ createdAt: val.createdAt }));
        this.monthPayroll = val.createdAt;
        this.daysInMonth = rageDaysInMonth(new Date(val.createdAt));
      } else {
        this.monthPayroll = new Date();
      }
      const month = new Date(val.createdAt);
      this.loadInitPayroll(month);
    });
  }

  onScroll() {

  }

  loadInitPayroll(month?: Date) {
    this.store.dispatch(
      PayrollAction.loadInit(
        this.payroll(
          month ?
            Object.assign(this.formGroup.value, { createdAt: month })
            : this.formGroup.value
        )
      )
    );
  }

  payroll(val: any) {
    const payroll = {
      skip: this.pageIndexInit,
      take: this.pageSize,
      name: val.name,
      position: val.position,
      branch: val.branch,
      createdAt: val.createdAt,
      isPaid: val.paidAt,
      isConfirm: val.accConfirmedAt,
      employeeType: EmployeeType.EMPLOYEE_SEASONAL
    };
    if (val.createdAt) {
      return payroll;
    } else {
      delete payroll.createdAt;
      return payroll;
    }
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
    this.formGroup.get('position')!.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')!.patchValue(branchName);
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
