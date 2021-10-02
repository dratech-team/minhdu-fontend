import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Api } from '@minhdu-fontend/constants';
import { Position } from '@minhdu-fontend/data-models';
import { EmployeeAction, selectorAllEmployee } from '@minhdu-fontend/employee';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { ExportService } from '@minhdu-fontend/service';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import {
  selectedAddingPayroll,
  selectedLoadedPayroll,
  selectorAllPayroll,
} from '../../+state/payroll/payroll.selector';
import {
  getAllPosition,
  PositionActions,
} from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { AppState } from '../../../../reducers';
import { AddPayrollComponent } from '../../component/add-payroll/add-payroll.component';
import { DialogOvertimeMultipleComponent } from '../../component/dialog-overtime-multiple/dialog-overtime-multiple.component';
import { DialogTimekeepingComponent } from '../../component/timekeeping/dialog-timekeeping.component';
import { UpdateConfirmComponent } from '../../component/update-comfirm/update-confirm.component';
import { PayrollService } from '../../service/payroll.service';

@Component({
  templateUrl: 'payroll.component.html',
})
export class PayrollComponent implements OnInit {
  formGroup = new FormGroup({
    // code: new FormControl(''),
    name: new FormControl(''),
    paidAt: new FormControl(''),
    accConfirmedAt: new FormControl(''),
    manConfirmedAt: new FormControl(''),
    createdAt: new FormControl(),
  });
  salaryType = SalaryTypeEnum;
  generating = false;
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
  positions = new FormControl();
  branches = new FormControl();
  namePositionSearch = '';
  nameBranchSearch = '';

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly exportService: ExportService,
    private readonly payrollService: PayrollService
  ) {}

  ngOnInit() {
    /// FIXME: Reload 2 lần
    this.store.dispatch(
      PayrollAction.loadInit({ skip: this.pageIndexInit, take: this.pageSize })
    );
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());

    this.formGroup.valueChanges.pipe(debounceTime(1000)).subscribe((val) => {
      this.namePositionSearch = this.positions.value
        ? this.positions.value
        : '';
      this.nameBranchSearch = this.branches.value ? this.branches.value : '';
      this.store.dispatch(PayrollAction.loadInit(this.Payroll(val)));
    });

    this.positions$ = combineLatest([
      this.positions.valueChanges.pipe(startWith('')),
      this.store.pipe(select(getAllPosition)),
    ]).pipe(
      map(([position, positions]) => {
        if (position) {
          return positions.filter((e) => {
            return e.name.toLowerCase().includes(position?.toLowerCase());
          });
        } else {
          this.namePositionSearch = '';
          return positions;
        }
      })
    );

    //search branch and position
    combineLatest([
      this.positions.valueChanges.pipe(startWith('')),
      this.branches.valueChanges.pipe(startWith('')),
    ])
      .pipe(debounceTime(1000))
      .subscribe(([position, branch]) => {
        this.namePositionSearch = position;
        this.nameBranchSearch = branch;
        const val = this.formGroup.value;
        this.store.dispatch(PayrollAction.loadInit(this.Payroll(val)));
      });

    this.branches$ = combineLatest([
      this.branches.valueChanges.pipe(startWith('')),
      this.branches$,
    ]).pipe(
      map(([branch, branches]) => {
        if (branch) {
          return branches.filter((e) => {
            return e.name.toLowerCase().includes(branch?.toLowerCase());
          });
        } else {
          this.nameBranchSearch = '';
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
      position: this.namePositionSearch,
      branch: this.nameBranchSearch,
      createdAt: val.createdAt,
      isPaid: val.paidAt,
      isConfirm: val.accConfirmedAt,
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
    const dialogRef = this.dialog.open(AddPayrollComponent, {
      width: '50%',
      data: { id: $event?.employee?.id },
    });

    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.store.dispatch(PayrollAction.addPayroll({ payroll: value }));
      }
    });
  }

  updateConfirmPayroll(id: number, type: string) {
    this.dialog.open(UpdateConfirmComponent, {
      width: '25%',
      data: { id, type },
    });
  }

  addSalaryOvertime(type: SalaryTypeEnum): any {
    this.dialog.open(DialogOvertimeMultipleComponent, {
      width: 'fit-content',
      data: { type: type },
    });
  }

  readPayroll($event: any) {
    this.router
      .navigate(['phieu-luong/chi-tiet-phieu-luong', $event.id])
      .then();
  }

  exportPayroll() {
    const val = this.formGroup.value;
    const payroll = {
      code: val.code,
      name: val.name,
      position: val.position,
      department: val.department,
      branch: val.branch,
      paidAt: val.paidAt,
      accConfirmedAt: val.accConfirmedAt,
    };
    this.exportService.print(
      Api.PAYROLL_EXPORT,
      val.createdAt
        ? Object.assign(payroll, { createdAt: val.createdAt })
        : payroll
    );
  }

  exportTimekeeping() {
    // this.exportService.print(Api.TIMEKEEPING_EXPORT);
    /// FIXME: Hard code to release
    this.snackbar.open(
      'Tính năng sẽ được hoàn thành vào ngày 6/10/2021. Xin lỗi vì sự bất tiện',
      '',
      { duration: 3000 }
    );
  }

  Timekeeping() {
    this.store.dispatch(EmployeeAction.loadInit({}));
    this.dialog.open(DialogTimekeepingComponent, {
      width: 'fit-content',
      data: this.employee$,
    });
  }

  onSelectPosition(position: Position) {
    this.namePositionSearch = position.name;
  }
  onSelectBranch(branchName: string) {
    this.nameBranchSearch = branchName;
  }

  generate() {
    this.generating = true;
    this.payrollService.generate().subscribe((res) => {
      this.generating = false;
      this.snackbar.open(res.message, '', { duration: 1000 });
      console.log('sss');
      this.store.dispatch(
        PayrollAction.loadInit({
          skip: this.pageIndexInit,
          take: this.pageSize,
        })
      );
    });
  }
}
