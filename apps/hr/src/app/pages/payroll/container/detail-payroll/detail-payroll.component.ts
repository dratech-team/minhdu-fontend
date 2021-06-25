import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { ActivatedRoute, Router } from '@angular/router';
import { selectCurrentPayroll } from '../../+state/payroll.selector';
import { PayrollAction } from '../../+state/payroll.action';
import { MatDialog } from '@angular/material/dialog';
import { SalaryComponent } from '../../component/salary/salary.component';
import { switchMap } from 'rxjs/operators';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { of } from 'rxjs';

@Component({
  templateUrl:'detail-payroll.component.html',
  styleUrls:['detail-payroll.component.scss']
})
export class DetailPayrollComponent implements OnInit{
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
    this.store.dispatch(PayrollAction.getPayroll({id:this.getPayrollId}))
  }
  get getPayrollId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  onDetailEmployee(id: number) {
    this.router.navigate(['profile/detail-employee', id]).then();
  }

  addSalary(type: SalaryTypeEnum, id?: number): any {
    this.dialog.open(SalaryComponent, {
      width: '60%',
      data: { type, id },
    });
  }

  onEditSalary(salary: any) {

  }

  onDelete() {

  }

  removeSalary(id: number) {

  }
}
