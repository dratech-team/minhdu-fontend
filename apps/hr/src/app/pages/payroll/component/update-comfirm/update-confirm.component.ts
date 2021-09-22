import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { AppState } from '../../../../reducers';
import { Store } from '@ngrx/store';
import { PayrollAction } from '../../+state/payroll/payroll.action';

@Component({
  templateUrl: 'update-confirm.component.html'
})
export class UpdateConfirmComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>
  ) {
  }

  onSubmit() {
    // xác phận thanh toán
    if (this.data.type === 'paidAt') {
      this.store.dispatch(PayrollAction.confirmPaidAtPayroll({ id: this.data.id}));
    }
    //xác nhân phiếu lương
    if(this.data.type === 'accConfirmedAt'){
      this.store.dispatch(PayrollAction.confirmPayroll({ id: this.data.id }));
    }
  }
}
