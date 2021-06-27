import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { Router } from '@angular/router';
import { selectorAllPayroll } from '../../+state/payroll.selector';
import { PayrollAction } from '../../+state/payroll.action';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import { AddPayrollComponent } from '../../component/add-payroll/add-payroll.component';
import { SalaryComponent } from '../../component/salary/salary.component';

@Component({
  templateUrl: 'payroll.component.html',
  styleUrls: ['payroll.component.scss']
})

export class PayrollComponent implements OnInit {
  salaryType = SalaryTypeEnum;
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  pageIndex: number = 1;
  pageSize: number = 30;
  payroll$ = this.store.pipe(select(selectorAllPayroll));
  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.store.dispatch(PayrollAction.loadPayrolls({ skip: 0, take: 30 }));
  }

  onScroll() {
    this.store.dispatch(PayrollAction.loadPayrolls({ skip: this.pageSize * this.pageIndex++, take: this.pageSize }));
  }

  addPayroll($event: any): void {
    const dialogRef = this.dialog.open(AddPayrollComponent, {
      width: '50%',
      data: $event.employee.id
    });
    dialogRef.afterClosed().subscribe((value) => {
        if (value) {
          if (value.employeesId) {
            this.store.dispatch(PayrollAction.addPayroll({ payroll: value }));
          } else {
            this.store.dispatch(PayrollAction.addPayroll({ payroll: value }));
          }
        }
      }
    );
  }

  addSalary(type: SalaryTypeEnum):any{
    this.dialog.open(SalaryComponent, {
      width: '50%',
      data:{type: type}
    })

  }

  readAndUpdate($event: any) {
    this.router.navigate(['payroll/detail-payroll', $event.id]).then();
  }
}
