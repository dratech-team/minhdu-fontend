import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { PayslipService } from '../../service/payslip.service';
import { PayslipCT1, PayslipCT2 } from '../../+state/payslip/payslip.interface';

@Component({
  templateUrl: 'confirm-payroll.component.html'
})
export class ConfirmPayrollComponent implements OnInit {
  payslipCT1!: PayslipCT1;
  payslipCT2!: PayslipCT2;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly payslipService: PayslipService,
    private readonly store: Store
  ) {
  }

  ngOnInit() {
    console.log(this.data.recipeType)
    if(this.data.recipeType === 'CT1'){
      this.payslipService.getOneCT1(this.data.id).subscribe(
        payslip => {
          this.payslipCT1 = payslip;
        }
      );
    }else {
      this.payslipService.getOneCT2(this.data.id).subscribe(
        payslip => {
          this.payslipCT2 = payslip;
        }
      );
    }

  }

  onSubmit() {
    this.store.dispatch(PayrollAction.confirmPayroll({ id: this.data.id }));
  }
}
