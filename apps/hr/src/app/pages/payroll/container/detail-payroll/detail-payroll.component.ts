import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { ActivatedRoute, Router } from '@angular/router';
import { selectCurrentPayroll,selectedAddedPayroll } from '../../+state/payroll/payroll.selector';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { MatDialog } from '@angular/material/dialog';
import { SalaryComponent } from '../../component/salary/salary.component';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Salary } from '@minhdu-fontend/data-models';
import { Payroll } from '../../+state/payroll/payroll.interface';
import { UpdateConfirmComponent } from '../../component/update-comfirm/update-confirm.component';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { DevelopmentComponent } from 'libs/components/src/lib/development/development.component';
import { DialogOvertimeComponent } from '../../component/dialog-overtime/dialog-overtime.component';


@Component({
  templateUrl: 'detail-payroll.component.html',
  styleUrls: ['detail-payroll.component.scss']
})
export class DetailPayrollComponent implements OnInit {
  type = SalaryTypeEnum;
  payroll$ = this.store.pipe(select(selectCurrentPayroll(this.getPayrollId)));
  adding$ = this.store.pipe(select(selectedAddedPayroll))
  constructor(
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.store.dispatch(PayrollAction.getPayroll({ id: this.getPayrollId }));
  }

  get getPayrollId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  onDetailEmployee(id: number) {
    this.router.navigate(['nhan-su/ho-so/chi-tiet-nhan-vien', id]).then();
  }

  addAndUpdateSalary(type: SalaryTypeEnum, payroll: Payroll, salary?: Salary): any {
    const dialogRef = this.dialog.open(SalaryComponent, {
      width: '50%',
      data: { type, salary ,payroll}
    });
    dialogRef.afterClosed().subscribe(
      (value) => {
        if (value) {
          if (value.update) {
              this.store.dispatch(PayrollAction.updateSalary({
                id: salary?.id,
                payrollId: payroll.id,
                salary: value.data
              }));
          } else {
              this.store.dispatch(PayrollAction.addSalary({
                payrollId: payroll.id,
                salary: value.data
              }));
          }
        }
      }
    );
  }

  addAndUpdateOvertime(type: SalaryTypeEnum, payroll: Payroll, salary?: Salary){
    this.dialog.open(DialogOvertimeComponent, {
      width: '50%',
      data:{type, payroll, salary}
    })
  }

  removeSalary(id: number, payrollId: number) {
    const dialogRef = this.dialog.open(DialogDeleteComponent,{width:'30%'});
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.store.dispatch(PayrollAction.deleteSalary({ id: id, PayrollId: payrollId }));
      }
    });
  }
  confirmPayroll(id: number){
    this.dialog.open(UpdateConfirmComponent , {
        width: "25%",
        data: {id: id, type: 'accConfirmedAt'}
    })
  }

  historySalary(employeeId: number) {
    this.dialog.open(DevelopmentComponent, {width:'30%'})
  }
}
