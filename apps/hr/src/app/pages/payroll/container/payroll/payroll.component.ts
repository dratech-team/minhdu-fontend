import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { Router } from '@angular/router';
import { selectorAllPayroll } from '../../+state/payroll/payroll.selector';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import { AddPayrollComponent } from '../../component/add-payroll/add-payroll.component';
import { SalaryComponent } from '../../component/salary/salary.component';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { UpdateConfirmComponent } from '../../component/update-comfirm/update-confirm.component';
import { Api } from '@minhdu-fontend/constants';
import { ExportService } from '@minhdu-fontend/service';

@Component({
  templateUrl: 'payroll.component.html'
})


export class PayrollComponent implements OnInit {
  formGroup = new FormGroup(
    {
      code: new FormControl(''),
      name: new FormControl(''),
      position: new FormControl(''),
      department: new FormControl(''),
      branch: new FormControl(''),
      paidAt: new FormControl(''),
      accConfirmedAt: new FormControl(''),
      createdAt: new FormControl()
    }
  );
  salaryType = SalaryTypeEnum;
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  pageSize: number = 30;
  pageIndexInit = 0;
  payroll$ = this.store.pipe(select(selectorAllPayroll));
  code?: string;

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
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
        this.store.dispatch(PayrollAction.loadInit(this.Payroll(val)));
      })
    ).subscribe();
  }

  Payroll(val: any) {
    const payroll = {
      skip: this.pageIndexInit,
      take: this.pageSize,
      code: val.code,
      name: val.name,
      position: val.position,
      department: val.department,
      branch: val.branch,
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

  updatePayroll(id: number, type: string) {
    this.dialog.open(UpdateConfirmComponent, {
      width: '25%',
      data: { id, type }
    });
  }

  addSalary(type: SalaryTypeEnum): any {
    console.log(type)
    const dialogRef = this.dialog.open(SalaryComponent, {
      width: '50%',
      data: { type: type }
    });
    dialogRef.afterClosed().subscribe(value => {
        if (value) {
          this.store.dispatch(PayrollAction.addSalary({
            salary: value.data
          }));
        }
      }
    );
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

  exportTimekeeping(data: any) {
  }

}
