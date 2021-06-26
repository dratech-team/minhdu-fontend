import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { Router } from '@angular/router';
import {selectorAllPayroll} from '../../+state/payroll.selector';
import { PayrollAction } from '../../+state/payroll.action';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { EmployeeAction } from '../../../employee/+state/employee.action';
import { MatDialog } from '@angular/material/dialog';
import { AddPayrollComponent } from '../../component/add-payroll/add-payroll.component';

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
    private readonly  dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) {
  }
  ngOnInit() {
    this.store.dispatch(PayrollAction.loadPayrolls({ skip: 0, take: 30 }));
  }
  add( $event: any): void {
   const dialogRef =this.dialog.open(AddPayrollComponent , {
      width: '30%',
      data: $event.employee.id,
    } )
  dialogRef.afterClosed().subscribe((value) =>
  {
    if(value){
      this.store.dispatch(PayrollAction.addPayroll({ payroll: value }))
    }
  }
  )
  }

  onScroll() {
    this.store.dispatch(PayrollAction.loadPayrolls({ skip: this.pageSize * this.pageIndex++, take: this.pageSize }));
  }

  readAndUpdate($event: any) {
    this.router.navigate(['payroll/detail-payroll', $event.id]).then();
  }

  delete($event: number) {

  }
}
