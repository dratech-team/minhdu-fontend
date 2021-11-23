import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { PayrollEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
import { UpdateConfirmComponent } from '../../component/update-comfirm/update-confirm.component';
import { AddPayrollComponent } from '../../component/add-Payroll/add-payroll.component';
import { PageTypeEnum } from '../../../../../../../../libs/enums/sell/page-type.enum';
import { DialogExportComponent } from '../../component/dialog-export/dialog-export.component';
import { searchAutocomplete } from '../../../../../../../../libs/utils/autocomplete.ultil';
import { DialogManConfirmedAtComponent } from '../../component/dialog-manconfirmedAt/dialog-man-confirmed-at.component';
import { DialogDeleteComponent } from '../../../../../../../../libs/components/src/lib/dialog-delete/dialog-delete.component';

@Component({
  templateUrl: 'history-payroll.component.html'
})
export class HistoryPayrollComponent implements OnInit {
  name$!: Observable<string>;
  employeeType$!: Observable<string>;
  formGroup = new FormGroup({
    name: new FormControl(''),
    paidAt: new FormControl(''),
    accConfirmedAt: new FormControl(''),
    manConfirmedAt: new FormControl(''),
    createdAt: new FormControl(),
    position: new FormControl(''),
    branch: new FormControl('')
  });
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  salaryType = SalaryTypeEnum;
  pageSize: number = 30;
  pageIndexInit = 0;
  payroll$ = this.store.pipe(select(selectorAllPayroll));
  loaded$ = this.store.pipe(select(selectedLoadedPayroll));
  code?: string;
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  adding$ = this.store.pipe(select(selectedAddingPayroll));
  PageTypeEnum = PageTypeEnum;
  payrollEnum = PayrollEnum;

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.name$ = this.activatedRoute.queryParams.pipe(map(param => param.name));
    this.employeeType$ = this.activatedRoute.queryParams.pipe(map(param => {
        console.log(param.employeeType);
        return param.employeeType;
      }
    ));
    this.store.dispatch(
      PayrollAction.loadInit({
        payrollDTO: {
          skip: this.pageIndexInit,
          take: this.pageSize,
          employeeId: this.getEmployeeId
        }
      })
    );
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());

    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe((val) => {
      this.store.dispatch(PayrollAction.loadInit(
        {
          payrollDTO: this.payroll(val)
        }
      ));
    });
    this.positions$ = searchAutocomplete(
      this.formGroup.get('position')!.valueChanges.pipe(startWith('')),
      this.store.pipe(select(getAllPosition))
    );

    this.branches$ = searchAutocomplete(
      this.formGroup.get('branch')!.valueChanges.pipe(startWith('')),
      this.branches$
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
      employeeId: this.getEmployeeId
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
    this.store.dispatch(PayrollAction.loadMorePayrolls(
      {
        payrollDTO: this.payroll(val)
      }
    ));
  }

  updateConfirmPayroll(id: number, type: string) {
    this.dialog.open(UpdateConfirmComponent, {
      width: '25%',
      data: { id, type }
    });
  }

  readPayroll($event: any) {
    this.router
      .navigate(['phieu-luong/chi-tiet-phieu-luong', $event.id])
      .then();
  }

  exportPayroll() {
    this.dialog.open(DialogExportComponent, {
      width: '30%',
      data: this.formGroup.value
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
      data: { employeeId: this.getEmployeeId, addOne: true, inHistory: true }
    });
  }

  updateManConfirm(id: number, manConfirmedAt: any, createdAt?: Date) {
    this.dialog.open(DialogManConfirmedAtComponent, {
      width: 'fit-content',
      data: { id, createdAt, manConfirmedAt: !!manConfirmedAt }
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
}
