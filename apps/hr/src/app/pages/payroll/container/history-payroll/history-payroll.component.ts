import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { selectorAllEmployee } from '@minhdu-fontend/employee';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';
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
import { UpdateConfirmComponent } from '../../component/update-comfirm/update-confirm.component';
import { DialogExportPayrollComponent } from '../../component/dialog-export/dialog-export-payroll.component';
import { AddPayrollComponent } from '../../component/add-Payroll/add-payroll.component';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';

@Component({
  templateUrl: 'history-payroll.component.html',
})
export class HistoryPayrollComponent implements OnInit {
    /// FIXME: Dummy data. Hieeuj Fix later
  title: string = 'rỗng';
  formGroup = new FormGroup({
    name: new FormControl(''),
    paidAt: new FormControl(''),
    accConfirmedAt: new FormControl(''),
    manConfirmedAt: new FormControl(''),
    createdAt: new FormControl(),
    position: new FormControl(''),
    branch: new FormControl(''),
  });
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  salaryType = SalaryTypeEnum;
  pageSize: number = 30;
  pageIndexInit = 0;
  payroll$ = this.store.pipe(select(selectorAllPayroll)).pipe(
    /// FIXME: Dummy data. Hieeuj Fix later
    tap((payrolls) => {
      if (payrolls?.length) {
        this.title =
          'của nhân viên ' +
          payrolls[0].employee.firstName + " "
         + payrolls[0].employee.lastName;
      }
    })
  );
  loaded$ = this.store.pipe(select(selectedLoadedPayroll));
  employee$ = this.store.pipe(select(selectorAllEmployee));
  code?: string;
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  adding$ = this.store.pipe(select(selectedAddingPayroll));
  PageTypeEnum = PageTypeEnum;
  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    /// FIXME: Reload 2 lần
    this.store.dispatch(
      PayrollAction.loadInit({
        skip: this.pageIndexInit,
        take: this.pageSize,
        employeeId: this.getEmployeeId,
      })
    );
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());

    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe((val) => {
      this.store.dispatch(PayrollAction.loadInit(this.Payroll(val)));
    });

    this.positions$ = combineLatest([
      this.formGroup.get('position')!.valueChanges.pipe(startWith('')),
      this.store.pipe(select(getAllPosition)),
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
      this.branches$,
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
      isConfirm: val.accConfirmedAt,
      employeeId: this.getEmployeeId,
    };
    if (val.createdAt) {
      return payroll;
    } else {
      delete payroll.createdAt;
      return payroll;
    }
  }

  get getEmployeeId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(PayrollAction.loadMorePayrolls(this.Payroll(val)));
  }

  updateConfirmPayroll(id: number, type: string) {
    this.dialog.open(UpdateConfirmComponent, {
      width: '25%',
      data: { id, type },
    });
  }

  readPayroll($event: any) {
    this.router
      .navigate(['phieu-luong/chi-tiet-phieu-luong', $event.id])
      .then();
  }

  exportPayroll() {
    this.dialog.open(DialogExportPayrollComponent, {
      width: '30%',
      data: this.formGroup.value,
    });
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

  onSelectPosition(positionName: string) {
    this.formGroup.get('position')!.patchValue(positionName);
  }

  onSelectBranch(branchName: string) {
    this.formGroup.get('branch')!.patchValue(branchName);
  }

  createPayroll() {
    this.dialog.open(AddPayrollComponent, {
      width: '30%',
      data: { employeeId: this.getEmployeeId, addOne: true },
    });
  }
}
