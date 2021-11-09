import { DatePipe } from '@angular/common';
import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PayrollConstant } from '@minhdu-fontend/constants';
import { EmployeeAction } from '@minhdu-fontend/employee';
import { EmployeeType, PayrollEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { select, Store } from '@ngrx/store';
import { debounceTime, map, startWith, takeUntil } from 'rxjs/operators';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import {
  selectedBranchPayroll,
  selectedCreateAtPayroll,
  selectedLoadedPayroll,
  selectedTypePayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { searchAutocomplete } from '../../../../../../../../libs/utils/autocomplete.ultil';
import { rageDaysInMonth } from '../../../../../../../../libs/utils/daytime.until';
import { AddPayrollComponent } from '../../component/add-Payroll/add-payroll.component';
import { DialogExportPayrollComponent } from '../../component/dialog-export-payroll/dialog-export-payroll.component';
import { DialogExportTimekeepingComponent } from '../../component/dialog-export-timekeeping/dialog-export-timekeeping.component';
import { DialogOvertimeMultipleComponent } from '../../component/dialog-salary/dialog-overtime-multiple/dialog-overtime-multiple.component';
import { DialogTimekeepingComponent } from '../../component/dialog-salary/timekeeping/dialog-timekeeping.component';
import { RestorePayrollComponent } from '../../component/restore-payroll/restore-payroll.component';
import { UpdateConfirmComponent } from '../../component/update-comfirm/update-confirm.component';
import { DialogDeleteComponent } from '../../../../../../../../libs/components/src/lib/dialog-delete/dialog-delete.component';
import { AppState } from '../../../../reducers'; 
import { getState } from '../../../../../../../../libs/utils/getState.ultils';
import { Subject } from 'rxjs';

@Component({
  templateUrl: 'payroll.component.html'
})
export class PayrollComponent implements OnInit, AfterContentChecked {
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
  selectPayroll = new FormControl(getState(selectedTypePayroll, this.store));
  selectedPayroll: PayrollEnum = getState(selectedTypePayroll, this.store);
  branchName = getState(selectedBranchPayroll, this.store);
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
  createdAt = getState(selectedCreateAtPayroll, this.store);
  pageType = PageTypeEnum;
  daysInMonth: any[] = [];
  payrollConstant = PayrollConstant;
  payrollEnum = PayrollEnum;
  private stop$ = new Subject<void>();

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.loadInitPayroll();
    this.daysInMonth = rageDaysInMonth(this.createdAt);
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());
    this.selectPayroll.valueChanges.pipe().subscribe((val) => {
      if (val === PayrollEnum.TIME_SHEET && !this.createdAt) {
        this.selectedPayroll = val;
        this.formGroup.get('createdAt')!.reset()
        this.createdAt = new Date();
        this.daysInMonth = rageDaysInMonth(new Date());
        this.store.dispatch(PayrollAction.updateStatePayroll(
          { filter: val, createdAt: new Date() }));
      } else {
        this.selectedPayroll = val;
        this.store.dispatch(PayrollAction.updateStatePayroll(
          { filter: val }));
      }
      return this.loadInitPayroll();
    });

    this.formGroup.valueChanges.pipe(
      map(val => {
        if ((!val.createdAt) && (this.selectedPayroll === PayrollEnum.TIME_SHEET)) {
          this.snackbar.open('Phiếu chấm công phải chọn tháng', 'Đóng');
          this.formGroup.get('createdAt')!.patchValue(
            this.datePipe.transform(new Date(), 'yyyy-MM'));
          takeUntil(this.stop$);
        } else {
          return val;
        }
      })
    ).pipe(debounceTime(1500)).subscribe((val) => {
      if (val) {
        this.branchName = val?.branch;
        this.createdAt = val?.createdAt;
        this.daysInMonth = rageDaysInMonth(new Date(val.createdAt));
        this.store.dispatch(PayrollAction.updateStatePayroll(
          { createdAt: new Date(this.createdAt), branch: val.branch }));
        return this.loadInitPayroll();
      }
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

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  loadInitPayroll() {
    this.store.dispatch(
      PayrollAction.loadInit(
        this.mapPayroll(this.formGroup.value)
      )
    );
  }

  mapPayroll(val: any) {
    return {
      skip: this.pageIndexInit,
      take: this.pageSize,
      name: val.name,
      position: val.position,
      branch: this.branchName,
      createdAt: this.createdAt,
      isPaid: val.paidAt,
      isConfirm: val.accConfirmedAt,
      isTimeSheet: this.selectedPayroll === PayrollEnum.TIME_SHEET,
      employeeType:
        this.selectedPayroll === PayrollEnum.PAYROLL_SEASONAL
          ? EmployeeType.EMPLOYEE_SEASONAL
          : EmployeeType.EMPLOYEE_FULL_TIME
    };
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(PayrollAction.loadMorePayrolls(this.mapPayroll(val)));
  }

  addPayroll($event?: any): void {
    const ref = this.dialog.open(AddPayrollComponent, {
      width: '30%',
      data: { employeeId: $event?.employee?.id, addOne: true }
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.formGroup
          .get('createdAt')!
          .patchValue(this.datePipe.transform(val, 'yyyy-MM'));
      }
    });
  }

  updateConfirmPayroll(id: number, type: string) {
    this.dialog.open(UpdateConfirmComponent, {
      width: '25%',
      data: { id, type }
    });
  }

  addSalaryOvertime(type: SalaryTypeEnum): any {
    this.dialog.open(DialogOvertimeMultipleComponent, {
      width: 'fit-content',
      data: {
        type: type,
        isTimesheet: this.selectedPayroll === PayrollEnum.TIME_SHEET
      }
    });
  }

  readPayroll($event: any) {
    this.router
      .navigate(['phieu-luong/chi-tiet-phieu-luong', $event.id])
      .then();
  }

  exportPayroll() {
    this.dialog.open(DialogExportPayrollComponent, {
      width: 'fit-content',
      data: this.formGroup.value
    });
  }

  exportTimekeeping() {
    this.dialog.open(DialogExportTimekeepingComponent, {
      width: 'fit-content',
      data: { datetime: this.createdAt }
    });
  }

  timekeeping() {
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
    const ref = this.dialog.open(AddPayrollComponent, {
      width: '30%',
      data: {
        employeeType:
          this.selectedPayroll === PayrollEnum.PAYROLL_SEASONAL
            ? EmployeeType.EMPLOYEE_SEASONAL
            : ''
      }
    });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.formGroup
          .get('createdAt')!
          .patchValue(this.datePipe.transform(val, 'yyyy-MM'));
      }
    });
  }

  selectMonth(event: any) {
    this.createdAt = event;
    this.formGroup
      .get('createdAt')!
      .patchValue(this.datePipe.transform(event, 'yyyy-MM'));
  }

  restorePayroll(event: any) {
    this.dialog.open(RestorePayrollComponent, {
      width: 'fit-content',
      data: { payroll: event }
    });
  }

  deletePayroll(event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: 'fit-content' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(PayrollAction.deletePayroll(
          {
            id: event.id
          }));
      }
    });
  }

  historyPayroll(event: any) {
    this.router.navigate(['phieu-luong/lich-su-luong', event.employee.id],
      {
        queryParams: {
          name: event.employee.firstName + ' ' + event.employee.lastName,
          employeeType: event.employee.type
        }
      }).then();
  }
}
