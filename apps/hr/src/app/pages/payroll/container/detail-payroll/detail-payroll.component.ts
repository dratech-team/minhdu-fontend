import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { ActivatedRoute, Router } from '@angular/router';
import { selectCurrentPayroll } from '../../+state/payroll.selector';
import { PayrollAction } from '../../+state/payroll.action';
import { MatDialog } from '@angular/material/dialog';
import { SalaryComponent } from '../../component/salary/salary.component';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Salary } from '@minhdu-fontend/data-models';
import { Payroll } from '../../+state/payroll.interface';
import { DialogDeleteComponent } from '../../../../../../../../libs/components/src/lib/dialog-delete/dialog-delete.component';

@Component({
  templateUrl: 'detail-payroll.component.html',
  styleUrls: ['detail-payroll.component.scss']
})
export class DetailPayrollComponent implements OnInit {
  type = SalaryTypeEnum;
  payroll$ = this.store.pipe(select(selectCurrentPayroll(this.getPayrollId)));

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
    this.router.navigate(['profile/detail-employee', id]).then();
  }

  addAndUpdateSalary(type: SalaryTypeEnum, payroll: Payroll, salary?: Salary): any {
    const dialogRef = this.dialog.open(SalaryComponent, {
      width: '50%',
      data: { type, salary }
    });
    dialogRef.afterClosed().subscribe(

      (value) => {
        if (value) {
          const add = {
            title: value.title,
            price: value.price,
            type: value.type,
            payrollId: payroll.id,
            employeeIds: value.employeeIds.length > 0 ? value.employeeIds : undefined,
            unit: value.unit,
            times: value.times,
            datetime: new Date(value.datetime),
          };
          if (value.update) {
              this.store.dispatch(PayrollAction.updateSalary({
                id: salary?.id,
                payrollId: payroll.id,
                salary: add
              }));
          } else {
              this.store.dispatch(PayrollAction.addSalary({
                payrollId: payroll.id,
                salary: add
              }));
          }
        }
      }
    );
  }

  removeSalary(id: number, payrollId: number) {
    const dialogRef = this.dialog.open(DialogDeleteComponent);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.store.dispatch(PayrollAction.deleteSalary({ id: id, PayrollId: payrollId }));
      }
    });
  }
}
