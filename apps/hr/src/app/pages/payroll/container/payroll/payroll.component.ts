import { DatePipe } from '@angular/common';
import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Api, PayrollConstant } from '@minhdu-fontend/constants';
import { EmployeeAction } from '@minhdu-fontend/employee';
import { EmployeeType, FilterTypeEnum, PayrollEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { select, Store } from '@ngrx/store';
import { debounceTime, map, startWith, takeUntil } from 'rxjs/operators';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import {
  selectedBranchPayroll,
  selectedCreateAtPayroll,
  selectedLoadedPayroll, selectedPositionPayroll,
  selectedTypePayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { searchAutocomplete } from '../../../../../../../../libs/utils/orgchart.ultil';
import { rageDaysInMonth } from '../../../../../../../../libs/utils/daytime.until';
import { AddPayrollComponent } from '../../component/add-Payroll/add-payroll.component';
import { DialogExportComponent } from '../../component/dialog-export/dialog-export.component';
import { DialogExportTimekeepingComponent } from '../../component/dialog-export-timekeeping/dialog-export-timekeeping.component';
import { DialogOvertimeMultipleComponent } from '../../component/dialog-salary/dialog-overtime-multiple/dialog-overtime-multiple.component';
import { DialogTimekeepingComponent } from '../../component/dialog-salary/timekeeping/dialog-timekeeping.component';
import { RestorePayrollComponent } from '../../component/restore-payroll/restore-payroll.component';
import { UpdateConfirmComponent } from '../../component/update-comfirm/update-confirm.component';
import { DialogDeleteComponent } from '../../../../../../../../libs/components/src/lib/dialog-delete/dialog-delete.component';
import { AppState } from '../../../../reducers';
import { getState } from '../../../../../../../../libs/utils/getState.ultils';
import { Observable, Subject } from 'rxjs';
import { DialogAllowanceMultipleComponent } from '../../component/dialog-salary/dialog-allowance-multiple/dialog-allowance-multiple.component';
import { ExportService } from '@minhdu-fontend/service';
import { SelectAddMultiple } from '../../component/dialog-select-add-multiple/select-add-multiple';
import { SelectUpdateMultiple } from '../../component/dialog-select-update-multiple/select-update-multiple';

@Component({
  templateUrl: 'payroll.component.html'
})
export class PayrollComponent implements OnInit, AfterContentChecked {
  formGroup = new FormGroup({
    name: new FormControl(''),
    code: new FormControl(''),
    paidAt: new FormControl(''),
    accConfirmedAt: new FormControl(''),
    manConfirmedAt: new FormControl(''),
    createdAt: new FormControl(this.datePipe.transform(
      getState(selectedCreateAtPayroll, this.store), 'yyyy-MM')),
    position: new FormControl(getState(selectedPositionPayroll, this.store)),
    branch: new FormControl(getState(selectedBranchPayroll, this.store))
  });
  selectPayroll = new FormControl(getState(selectedTypePayroll, this.store));
  selectedPayroll: PayrollEnum = getState(selectedTypePayroll, this.store);
  branchName = getState(selectedBranchPayroll, this.store);
  positionName = getState(selectedPositionPayroll, this.store);
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
  overtimeTitle?: string;
  allowanceTitle?: string;
  absentTitle?: string;
  pageType = PageTypeEnum;
  daysInMonth: any[] = [];
  payrollConstant = PayrollConstant;
  payrollEnum = PayrollEnum;
  private stop$ = new Subject<void>();
  eventAddOvertime = new Subject<any>();
  eventAddAllowance = new Subject<any>();
  eventAddAbsent = new Subject<any>();
  eventExportOvertime = new Subject<boolean>();
  eventExportAbsent = new Subject<boolean>();
  eventExportBasic = new Subject<boolean>();
  eventExportStay = new Subject<boolean>();
  eventExportAllowance = new Subject<boolean>();

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private ref: ChangeDetectorRef,
    private readonly exportService: ExportService,
    private readonly activeRouter: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.activeRouter.queryParams.subscribe(val => {
      if(val?.type === 'overtime'){
        this.selectPayroll.setValue(PayrollEnum.PAYROLL_OVERTIME)
      }
    });
    this.loadInitPayroll();

    this.daysInMonth = rageDaysInMonth(this.createdAt);

    this.store.dispatch(PositionActions.loadPosition());

    this.store.dispatch(OrgchartActions.init());

    this.selectPayroll.valueChanges.pipe().subscribe((val) => {
      if (val === PayrollEnum.TIME_SHEET && !this.createdAt) {
        this.selectedPayroll = val;
        this.formGroup.get('createdAt')!.reset();
        this.createdAt = new Date();
        this.daysInMonth = rageDaysInMonth(new Date());
        this.store.dispatch(PayrollAction.updateStatePayroll(
          { filter: val, createdAt: new Date() }));
      } else {
        if (val === PayrollEnum.PAYROLL || val === PayrollEnum.TIME_SHEET) {
          this.positionName = getState(selectedPositionPayroll, this.store);
          this.branchName = getState(selectedBranchPayroll, this.store);
          this.formGroup.get('position')!.setValue(this.positionName,
            { eventEmit: false });
          this.formGroup.get('branch')!.setValue(this.branchName,
            { eventEmit: false });
        }
        this.selectedPayroll = val;
        this.store.dispatch(PayrollAction.updateStatePayroll(
          { filter: val }));
      }
      if (val !== PayrollEnum.PAYROLL_STAY
        && val !== PayrollEnum.PAYROLL_BASIC
        && val !== PayrollEnum.PAYROLL_ALLOWANCE
        && val !== PayrollEnum.PAYROLL_ABSENT) {
        this.formGroup.get('createdAt')!.setValue(this.datePipe.transform(
          getState(selectedCreateAtPayroll, this.store), 'yyyy-MM'),
          { emitEvent: false });
        return this.loadInitPayroll();
      }
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
        this.positionName = val?.position;
        this.createdAt = val?.createdAt;
        this.daysInMonth = rageDaysInMonth(new Date(val.createdAt));
        this.store.dispatch(PayrollAction.updateStatePayroll(
          {
            createdAt: new Date(val.createdAt) || new Date(val.createdAt),
            branch: val.branch,
            position: val.position
          }));
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
        {
          payrollDTO: this.mapPayroll(this.formGroup.value)
        }
      )
    );
  }

  mapPayroll(val: any) {
    return {
      skip: this.pageIndexInit,
      take: this.pageSize,
      code: val.code,
      name: val.name,
      position: this.positionName,
      branch: this.branchName,
      createdAt: getState(selectedCreateAtPayroll, this.store),
      isPaid: val.paidAt,
      isConfirm: val.accConfirmedAt,
      filterType: this.selectedPayroll === PayrollEnum.TIME_SHEET ? FilterTypeEnum.TIME_SHEET :
        this.selectedPayroll === PayrollEnum.PAYROLL_SEASONAL ? FilterTypeEnum.SEASONAL :
          this.selectedPayroll === PayrollEnum.PAYROLL ? FilterTypeEnum.PAYROLL : FilterTypeEnum.SALARY,
      employeeType:
        this.selectedPayroll === PayrollEnum.PAYROLL_SEASONAL
          ? EmployeeType.EMPLOYEE_SEASONAL
          : EmployeeType.EMPLOYEE_FULL_TIME
    };
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(PayrollAction.loadMorePayrolls(
      {
        payrollDTO: this.mapPayroll(val)
      }
    ));
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
    const ref = this.dialog.open(DialogOvertimeMultipleComponent, {
      width: 'fit-content',
      data: {
        createdAt: this.createdAt,
        type: type,
        isTimesheet: this.selectedPayroll === PayrollEnum.TIME_SHEET
      }
    });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.createdAt = new Date(val.datetime);
        this.overtimeTitle = val.title;
        this.store.dispatch(PayrollAction.updateStatePayroll(
          {
            createdAt: new Date(val.datetime)
          }));
        this.eventAddOvertime.next({
          createdAt: new Date(val.datetime),
          overtimeTitle: val.title
        });
        this.selectPayroll.setValue(PayrollEnum.PAYROLL_OVERTIME);
      }
    });
  }

  addSalaryAllowance() {
    const ref = this.dialog.open(DialogAllowanceMultipleComponent,
      {
        width: 'fit-content',
        data: {
          createdAt: this.createdAt,
          isTimesheet: this.selectedPayroll === PayrollEnum.TIME_SHEET
        }
      }
    );
    ref.afterClosed().subscribe(value => {
      if (value) {
        this.createdAt = new Date(value.datetime);
        this.allowanceTitle = value.title;
        this.store.dispatch(PayrollAction.updateStatePayroll(
          {
            createdAt: new Date(value.datetime)
          }));
        this.selectPayroll.setValue(PayrollEnum.PAYROLL_ALLOWANCE);
        this.eventAddAllowance.next({
          allowanceTitle: value.title
        });
      }
    });
  }

  timekeeping() {
    this.store.dispatch(EmployeeAction.loadInit({ employee: {} }));
    const ref = this.dialog.open(DialogTimekeepingComponent, {
      width: 'fit-content',
      data: {
        createdAt: this.createdAt,
        isTimesheet: this.selectedPayroll === PayrollEnum.TIME_SHEET
      }
    });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.createdAt = new Date(val.datetime);
        this.absentTitle = val.title;
        this.store.dispatch(PayrollAction.updateStatePayroll(
          {
            createdAt: new Date(val.datetime)
          }));
        this.eventAddAbsent.next({
          datetime: val.datetime,
          absentTitle: val.title
        });
        this.selectPayroll.setValue(PayrollEnum.PAYROLL_ABSENT);
      }
    });
  }

  readPayroll($event: any) {
    this.router
      .navigate(['phieu-luong/chi-tiet-phieu-luong', $event.id])
      .then();
  }

  exportPayroll() {
    const ref = this.dialog.open(DialogExportComponent, {
      width: 'fit-content', data: { title: 'Xuât bảng lương' }
    });
    ref.afterClosed().subscribe(val => {
      if (val) {
        const value = this.formGroup.value;
        const payroll = {
          code: value.code || '',
          name: value.name,
          position: value.position,
          branch: value.branch,
          paidAt: value.paidAt,
          accConfirmedAt: value.accConfirmedAt,
          exportType: FilterTypeEnum.PAYROLL
        };
        this.exportService.print(
          Api.HR.PAYROLL.EXPORT, Object.assign(payroll,
            value?.createdAt ? {
              createdAt: new Date(value.createdAt),
              filename: val
            } : { filename: val })
        );
      }
    });
  }

  exportTimekeeping() {
    this.dialog.open(DialogExportTimekeepingComponent, {
      width: 'fit-content',
      data: { datetime: this.createdAt }
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
      data: { PAYROLL: event }
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

  exportOvertime() {
    this.eventExportOvertime.next(true);
  }

  exportBasic() {
    this.eventExportBasic.next(true);
  }

  exportStay() {
    this.eventExportStay.next(true);
  }

  exportPayrollSeasonal() {
    //Export Payroll Seasonal
  }

  exportAllowance() {
    this.eventExportAllowance.next(true);
  }

  exportAbsent() {
    this.eventExportAbsent.next(true);
  }

  openDialogAddMultiple() {
    const ref = this.dialog.open(SelectAddMultiple, { width: 'fit-content' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        switch (val) {
          case SalaryTypeEnum.OVERTIME:
            this.addSalaryOvertime(val);
            break;
          case SalaryTypeEnum.ALLOWANCE:
            this.addSalaryAllowance();
            break;
          case SalaryTypeEnum.ABSENT:
            this.timekeeping();
            break;
        }
      }
    });
  }

  openDialogUpdateMultiple() {
    const ref = this.dialog.open(SelectUpdateMultiple,
      {
        width: 'fit-content',
        data: {
          pageType: this.selectedPayroll
        }
      });
    ref.afterClosed().subscribe(val => {
      if (val) {
        switch (val) {
          case PayrollEnum.PAYROLL:
            this.exportPayroll();
            break;
          case PayrollEnum.TIME_SHEET:
            this.exportTimekeeping();
            break;
          case PayrollEnum.PAYROLL_OVERTIME:
            this.exportOvertime();
            break;
          case PayrollEnum.PAYROLL_ABSENT:
            this.exportAbsent();
            break;
          case PayrollEnum.PAYROLL_ALLOWANCE:
            this.exportAllowance();
            break;
          case PayrollEnum.PAYROLL_STAY:
            this.exportStay();
            break;
          case PayrollEnum.PAYROLL_BASIC:
            this.exportBasic();
            break;
          case PayrollEnum.PAYROLL_SEASONAL:
            this.exportPayrollSeasonal();
            break;
        }
      }
    });
  }
}
