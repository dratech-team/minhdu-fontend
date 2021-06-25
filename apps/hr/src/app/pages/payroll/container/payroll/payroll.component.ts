import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { Router } from '@angular/router';
import {selectorAllPayroll} from '../../+state/payroll.selector';
import { PayrollAction } from '../../+state/payroll.action';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { EmployeeAction } from '../../../employee/+state/employee.action';

@Component({
  templateUrl:'payroll.component.html',
  styleUrls:['payroll.component.scss'],
})

export class PayrollComponent implements OnInit{
  salaryType = SalaryTypeEnum;
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  pageIndex: number = 1;
  pageSize: number = 30;
  payroll$ = this.store.pipe(select(selectorAllPayroll));
  constructor(
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) {
  }
  ngOnInit() {
    this.store.dispatch(PayrollAction.loadPayrolls({ skip: 0, take: 30 }));
  }
  add(): void {

  }

  onScroll() {
    this.store.dispatch(PayrollAction.loadPayrolls({ skip: this.pageSize * this.pageIndex++, take: this.pageSize }));
  }

  readAndUpdate(id: number) {
    this.router.navigate(['payroll/detail-payroll', id]).then();
  }

  delete(id: number) {

  }
}
