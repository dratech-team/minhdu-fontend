import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EmployeeAction } from '@minhdu-fontend/employee';
import { PayrollEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { select, Store } from '@ngrx/store';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { selectedLoadedPayroll, selectorAllPayroll } from '../../+state/payroll/payroll.selector';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { AppState } from '../../../../reducers';
import { DialogOvertimeMultipleComponent } from '../../component/dialog-overtime-multiple/dialog-overtime-multiple.component';
import { DialogTimekeepingComponent } from '../../component/timekeeping/dialog-timekeeping.component';
import { UpdateConfirmComponent } from '../../component/update-comfirm/update-confirm.component';
import { DatePipe } from '@angular/common';
import { AddPayrollComponent } from '../../component/add-Payroll/add-payroll.component';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import { RestorePayrollComponent } from '../../component/restore-payroll/restore-payroll.component';
import { DialogExportPayrollComponent } from '../../component/dialog-export-payroll/dialog-export-payroll.component';
import { DialogExportTimekeepingComponent } from '../../component/dialog-export-timekeeping/dialog-export-timekeeping.component';
import { rageDaysInMonth } from '../../../../../../../../libs/utils/daytime.until';
import { DialogManConfirmedAtComponent } from '../../component/dialog-manconfirmedAt/dialog-man-confirmed-at.component';
import { PayrollConstant } from '@minhdu-fontend/constants';
import { searchAutocomplete } from '../../../../../../../../libs/utils/autocomplete.ultil';

@Component({
  templateUrl: 'payroll.component.html'
})
export class PayrollComponent implements OnInit {
  formGroup = new FormGroup({
    name: new FormControl(''),
    paidAt: new FormControl(''),
    accConfirmedAt: new FormControl(''),
    manConfirmedAt: new FormControl(''),
    createdAt: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM')),
    position: new FormControl(''),
    branch: new FormControl('')
  });
  selectPayroll = new FormControl(PayrollEnum.TIME_SHEET);
  selectedPayroll: PayrollEnum = PayrollEnum.TIME_SHEET;
  salaryType = SalaryTypeEnum;
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  pageSize: number = 30;
  pageIndexInit = 0;
  payroll$ = this.store.pipe(select(selectorAllPayroll));
  loaded$ = this.store.pipe(select(selectedLoadedPayroll));
  code?: string;
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  monthPayroll = new Date();
  pageType = PageTypeEnum;
  daysInMonth: any [] = [];
  payrollConstant = PayrollConstant;
  payrollEnum = PayrollEnum;

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.loadInitPayroll();
    this.daysInMonth = rageDaysInMonth(this.monthPayroll);
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());
    this.selectPayroll.valueChanges.subscribe(val => {
      this.selectedPayroll = val;
      if (val === PayrollEnum.TIME_SHEET) {
        this.loadInitPayroll();
      }
    });
    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe((val) => {
      if (val.createdAt) {
        this.monthPayroll = val.createdAt;
        this.daysInMonth = rageDaysInMonth(new Date(val.createdAt));
      } else {
        this.monthPayroll = new Date();
      }
      const month = new Date(val.createdAt);
      this.loadInitPayroll(month);
    });

    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')!.valueChanges.pipe(startWith('')),
      this.positions$
    );

    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')!.valueChanges.pipe(startWith('')),
      this.branches$
    );

  }

  loadInitPayroll(month?: Date) {
    this.store.dispatch(
      PayrollAction.loadInit(
        this.Payroll(
          month ?
            Object.assign(this.formGroup.value, { createdAt: month })
            : this.formGroup.value
        )
      )
    );
  }


  Payroll(val: any) {
    const payroll = {
      skip: this.pageIndexInit,
      take: this.pageSize,
      name: val.name,
      position: val.position,
      branch: val.branch,
      createdAt: val.createdAt,
      isPaid: val.paidAt,
      isConfirm: val.accConfirmedAt,
      isTimeSheet: this.selectedPayroll === PayrollEnum.TIME_SHEET
    };
    if (val.createdAt) {
      return payroll;
    } else {
      delete payroll.createdAt;
      return payroll;
    }
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(PayrollAction.loadMorePayrolls(this.Payroll(val)));
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

  updateConfirmPayroll(id: number, type: string) {
    this.dialog.open(UpdateConfirmComponent, {
      width: '25%',
      data: { id, type }
    });
  }

  updateManConfirm(id: number, createdAt?: Date, manConfirmedAt?: any) {
    console.log(!!manConfirmedAt);
    this.dialog.open(DialogManConfirmedAtComponent, {
      width: 'fit-content',
      data: { id, createdAt, manConfirmedAt: !!manConfirmedAt }
    });
  }

  addSalaryOvertime(type: SalaryTypeEnum): any {
    this.dialog.open(DialogOvertimeMultipleComponent, {
      width: 'fit-content',
      data: { type: type, isTimesheet: this.selectedPayroll === PayrollEnum.TIME_SHEET }
    });
  }

  readPayroll($event: any) {
    this.router
      .navigate(['phieu-luong/chi-tiet-phieu-luong', $event.id])
      .then();
  }

  exportPayroll() {
    this.dialog.open(DialogExportPayrollComponent,
      { width: 'fit-content', data: this.formGroup.value });
  }

  exportTimekeeping() {
    this.dialog.open(DialogExportTimekeepingComponent, {
      width: 'fit-content',
      data: { datetime: this.monthPayroll }
    });
  }

  Timekeeping() {
    this.store.dispatch(EmployeeAction.loadInit({ employee: {} }));
    this.dialog.open(DialogTimekeepingComponent, {
      width: 'fit-content',
      data: { isTimesheet: this.selectedPayroll === PayrollEnum.TIME_SHEET }
    });
  }

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')!.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')!.patchValue(branchName);
  }

  generate() {
    const ref = this.dialog.open(AddPayrollComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.formGroup.get('createdAt')!.patchValue(this.datePipe.transform(val, 'yyyy-MM'));
      }
    });
  }

  selectMonth(event: any) {
    this.monthPayroll = event;
    this.formGroup.get('createdAt')!.patchValue(this.datePipe.transform(event, 'yyyy-MM'));
  }

  restorePayroll(event: any) {
    this.dialog.open(RestorePayrollComponent, { width: 'fit-content', data: { payroll: event } });
  }

}
