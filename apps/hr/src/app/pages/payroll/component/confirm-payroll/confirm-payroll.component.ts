import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { AppState } from '../../../../reducers';
import { Store } from '@ngrx/store';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { PayslipService } from '../../service/payslip.service';
import { Payslip } from '../../+state/payslip/payslip.interface';

@Component({
  templateUrl: 'confirm-payroll.component.html'
})
export class ConfirmPayrollComponent implements OnInit{
  payslip!: Payslip
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly payslipService :PayslipService,
    private readonly store: Store
  ) {
  }
  ngOnInit() {
    this.payslipService.getOne(this.data.id).subscribe(
      val => this.payslip = val
    )
  }
  onSubmit() {
    this.store.dispatch(PayrollAction.confirmPayroll({ id: this.data.id }));
  }
}
