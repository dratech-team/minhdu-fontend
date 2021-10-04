import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { Payslip } from '../../+state/payslip/payslip.interface';
import { PayslipService } from '../../service/payslip.service';

@Component({
  templateUrl: 'confirm-payroll.component.html'
})
export class ConfirmPayrollComponent implements OnInit {
  payslip!: Payslip;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly payslipService: PayslipService,
    private readonly store: Store
  ) {
  }

  ngOnInit() {
      this.payslipService.getOne(this.data.id).subscribe(
        payslip => {
          console.log(payslip)
          this.payslip = payslip;
        }
      );

  }

  onSubmit() {
    this.store.dispatch(PayrollAction.confirmPayroll({ id: this.data.id, detailPayroll: true}));
  }
}
