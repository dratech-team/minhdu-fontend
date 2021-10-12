import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { Payslip } from '../../+state/payslip/payslip.interface';
import { PayslipService } from '../../service/payslip.service';
import { RecipeType } from '@minhdu-fontend/enums';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: 'confirm-payroll.component.html',
  styleUrls:['cofirm-payroll.component.scss']
})
export class ConfirmPayrollComponent implements OnInit {
  accConfirmedAt = new  FormControl( this.datePipe.transform(new Date(),'yyyy-MM-dd') );
  payslip$?: Observable<Payslip>;
  recipeType = RecipeType
  constructor(
    @Inject(MAT_DIALOG_DATA) public payroll: any,
    private readonly payslipService: PayslipService,
    private readonly store: Store,
    private readonly datePipe: DatePipe,
    private readonly snackbar: MatSnackBar,
  ) {}

  ngOnInit() {
    console.log(this.data.payroll.recipeType)
    this.payslip$ = this.payslipService.getOne(this.data.payroll.id);
  }

  confirmPayroll(){
    if(this.accConfirmedAt.value){
      this.store.dispatch(PayrollAction.updatePayroll(
        {id: this.payroll.id, Payroll: {accConfirmedAt : new Date(this.accConfirmedAt.value) }}))
    }else{
      this.snackbar.open('Chua ch?n ng�y x�c nh?n phi?u luong' , '', {duration: 1500})
    }

  }

  onSubmit() {
    this.store.dispatch(PayrollAction.confirmPayroll({ id: this.data.payroll.id }));
  }

  printPayroll() {
    window.print()
  }
}
