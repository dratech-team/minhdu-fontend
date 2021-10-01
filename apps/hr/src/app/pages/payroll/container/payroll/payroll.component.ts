import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { Router } from '@angular/router';
import { selectedLoadedPayroll, selectorAllPayroll } from '../../+state/payroll/payroll.selector';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import { AddPayrollComponent } from '../../component/add-payroll/add-payroll.component';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';
import { UpdateConfirmComponent } from '../../component/update-comfirm/update-confirm.component';
import { Api } from '@minhdu-fontend/constants';
import { ExportService } from '@minhdu-fontend/service';
import { EmployeeAction, selectorAllEmployee } from '@minhdu-fontend/employee';
import { Position } from '@minhdu-fontend/data-models';
import { combineLatest } from 'rxjs';
import { getAllPosition, PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { DialogTimekeepingComponent } from '../../component/timekeeping/dialog-timekeeping.component';
import { DialogOvertimeMultipleComponent } from '../../component/dialog-overtime-multiple/dialog-overtime-multiple.component';

@Component({
  templateUrl: 'payroll.component.html'
})


export class PayrollComponent implements OnInit {
  formGroup = new FormGroup(
    {
      // code: new FormControl(''),
      name: new FormControl(''),
      paidAt: new FormControl(''),
      accConfirmedAt: new FormControl(''),
      manConfirmedAt: new FormControl(''),
      createdAt: new FormControl(),
    }
  );
  salaryType = SalaryTypeEnum;
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  pageSize: number = 30;
  pageIndexInit = 0;
  payroll$ = this.store.pipe(select(selectorAllPayroll));
  loaded$ = this.store.pipe(select(selectedLoadedPayroll));
  employee$ = this.store.pipe(select(selectorAllEmployee))
  code?: string;
  positions$ = this.store.pipe(select(getAllPosition));
  branches$ = this.store.pipe(select(getAllOrgchart));
  positions = new FormControl();
  branches = new FormControl();
  namePositionSearch = '';
  nameBranchSearch = '';
  constructor(
    private readonly datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly exportService: ExportService
  ) {
  }


  ngOnInit() {
    this.store.dispatch(PayrollAction.loadInit({ skip: this.pageIndexInit, take: this.pageSize }));
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
        this.namePositionSearch = this.positions.value ? this.positions.value : '';
        this.nameBranchSearch = this.branches.value ? this.branches.value : '';
        this.store.dispatch(PayrollAction.loadInit(this.Payroll(val)));
      })
    ).subscribe();
    this.positions$ = combineLatest([
      this.positions.valueChanges.pipe(startWith('')),
      this.store.pipe(select(getAllPosition))
    ]).pipe(
      map(([position, positions]) => {
        if (position) {
          return positions.filter((e) => {
            return e.name.toLowerCase().includes(position?.toLowerCase());
          });
        } else {
          this.namePositionSearch = ''
          return positions;
        }
      })
    )
    //search branch and position
    combineLatest([
      this.positions.valueChanges.pipe(startWith(this.nameBranchSearch)),
      this.branches.valueChanges.pipe(startWith(this.namePositionSearch))
    ]).pipe(
      debounceTime(2000),
      tap(([position, branch]) =>{
        this.namePositionSearch = position;
        this.nameBranchSearch = branch;
        const  val = this.formGroup.value
        this.store.dispatch(EmployeeAction.loadInit(this.Payroll(val)));
      })
    ).subscribe()
    this.branches$ = combineLatest([
      this.branches.valueChanges.pipe(startWith('')),
      this.branches$
    ]).pipe(
      map(([branch, branches]) => {
        if (branch) {
          return branches.filter((e) => {
            return e.name.toLowerCase().includes(branch?.toLowerCase());
          });
        } else {
          this.nameBranchSearch = ''
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
      paidAt: val.paidAt,
      accConfirmedAt: val.accConfirmedAt
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
      data: { id: $event?.employee?.id }
    });
    dialogRef.afterClosed().subscribe((value) => {
        if (value) {
          this.store.dispatch(PayrollAction.addPayroll({ payroll: value }));
        }
      }
    );
  }

  updateConfirmPayroll(id: number, type: string) {
    this.dialog.open(UpdateConfirmComponent, {
      width: '25%',
      data: { id, type}
    });
  }

  addSalaryOvertime(type: SalaryTypeEnum): any {
    this.dialog.open(DialogOvertimeMultipleComponent, {
      width: 'fit-content',
      data: { type: type }
    });
  }

  readPayroll($event: any) {
    this.router.navigate(['phieu-luong/chi-tiet-phieu-luong', $event.id]).then();
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
      accConfirmedAt: val.accConfirmedAt
    };
    this.exportService.print(Api.PAYROLL_EXPORT,
      val.createdAt ?
        Object.assign(payroll, { createdAt: val.createdAt }) :
        payroll
    );
  }

  exportTimekeeping() {
    this.exportService.print(Api.TIMEKEEPING_EXPORT)
  }

  Timekeeping() {
    this.store.dispatch(EmployeeAction.loadInit({}))
    this.dialog.open(DialogTimekeepingComponent, {
      width: 'fit-content',
      data: this.employee$
    })
  }

  onSelectPosition(position: Position) {
    this.namePositionSearch = position.name;
  }
  onSelectBranch(branchName: string) {
    this.nameBranchSearch = branchName;
  }
}
