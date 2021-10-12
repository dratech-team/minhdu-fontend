import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { Payslip } from '../../+state/payslip/payslip.interface';
import { PayslipService } from '../../service/payslip.service';
import { RecipeType } from '@minhdu-fontend/enums';

@Component({
  templateUrl: 'confirm-payroll.component.html',
  styleUrls:['cofirm-payroll.component.scss']
})
export class ConfirmPayrollComponent implements OnInit {
  payslip$?: Observable<Payslip>;
  recipeType = RecipeType
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly payslipService: PayslipService,
    private readonly store: Store
  ) {}

  ngOnInit() {
    console.log(this.data.payroll.recipeType)
    this.payslip$ = this.payslipService.getOne(this.data.payroll.id);
  }

  onSubmit() {
    this.store.dispatch(PayrollAction.confirmPayroll({ id: this.data.payroll.id }));
  }

  printPayroll() {
    window.print()
  }
}
