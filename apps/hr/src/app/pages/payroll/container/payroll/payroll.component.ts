import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EmployeeAction, selectorAllEmployee } from '@minhdu-fontend/employee';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import {
  selectedAddingPayroll,
  selectedLoadedPayroll,
  selectorAllPayroll
} from '../../+state/payroll/payroll.selector';
import {
  getAllPosition,
  PositionActions
} from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { AppState } from '../../../../reducers';
import { DialogOvertimeMultipleComponent } from '../../component/dialog-overtime-multiple/dialog-overtime-multiple.component';
import { DialogTimekeepingComponent } from '../../component/timekeeping/dialog-timekeeping.component';
import { UpdateConfirmComponent } from '../../component/update-comfirm/update-confirm.component';
import { DialogExportPayrollComponent } from '../../component/dialog-export/dialog-export-payroll.component';
import { DatePipe } from '@angular/common';
import { AddPayrollComponent } from '../../component/add-Payroll/add-payroll.component';

@Component({
  templateUrl: 'payroll.component.html'
})
export class PayrollComponent implements OnInit {
  formGroup = new FormGroup({
    // code: new FormControl(''),
    name: new FormControl(''),
    paidAt: new FormControl(''),
    accConfirmedAt: new FormControl(''),
    manConfirmedAt: new FormControl(''),
    createdAt: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM')),
    position: new FormControl(''),
    branch: new FormControl('')
  });
  salaryType = SalaryTypeEnum;
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  pageSize: number = 30;
  pageIndexInit = 0;
  payroll$ = this.store.pipe(select(selectorAllPayroll));
  loaded$ = this.store.pipe(select(selectedLoadedPayroll));
  employee$ = this.store.pipe(select(selectorAllEmployee));
  code?: string;
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  adding$ = this.store.pipe(select(selectedAddingPayroll));
  monthPayroll = new Date();

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.store.dispatch(
      PayrollAction.loadInit(
        {
          skip: this.pageIndexInit,
          take: this.pageSize,
          createdAt: new Date()
        }
      )
    );
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());

    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe((val) => {
      if (val.createdAt) {
        this.monthPayroll = val.createdAt;
      } else {
        this.monthPayroll = new Date();
      }
      const month = new Date(val.createdAt);
      this.store.dispatch(PayrollAction.loadInit(this.Payroll(Object.assign(val, { createdAt: month }))));
    });
    this.positions$ = combineLatest([
      this.formGroup.get('position')!.valueChanges.pipe(startWith('')),
      this.store.pipe(select(getAllPosition))
    ]).pipe(
      map(([position, positions]) => {
        if (position) {
          return positions.filter((e) => {
            return e.name.toLowerCase().includes(position?.toLowerCase());
          });
        } else {
          return positions;
        }
      })
    );

    this.branches$ = combineLatest([
      this.formGroup.get('branch')!.valueChanges.pipe(startWith('')),
      this.branches$
    ]).pipe(
      map(([branch, branches]) => {
        if (branch) {
          return branches.filter((e) => {
            return e.name.toLowerCase().includes(branch?.toLowerCase());
          });
        } else {
          return branches;
        }
      })
    );
  }

  Payroll(val: any) {
    const payroll = {
      skip: this.pageIndexInit,
      take: this.pageSize,
      // code: val.code,
      name: val.name,
      position: val.position,
      branch: val.branch,
      createdAt: val.createdAt,
      isPaid: val.paidAt,
      isConfirm: val.accConfirmedAt
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

  addSalaryOvertime(type: SalaryTypeEnum): any {
    this.dialog.open(DialogOvertimeMultipleComponent, {
      width: 'fit-content',
      data: { type: type }
    });
  }

  readPayroll($event: any) {
    this.router
      .navigate(['phieu-luong/chi-tiet-phieu-luong', $event.id])
      .then();
  }

  exportPayroll() {
    this.dialog.open(DialogExportPayrollComponent, { width: '30%', data: this.formGroup.value });
  }

  exportTimekeeping() {
    // this.exportService.print(Api.TIMEKEEPING_EXPORT);
    /// FIXME: Hard code to release
    this.snackbar.open(
      'Tính năng sẽ được phát triển. Xin lỗi vì sự bất tiện',
      '',
      { duration: 3000 }
    );
  }

  Timekeeping() {
    this.store.dispatch(EmployeeAction.loadInit({ employee: {} }));
    this.dialog.open(DialogTimekeepingComponent, {
      width: 'fit-content',
      data: this.employee$
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
}
