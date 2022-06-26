import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { AppState } from '../../../../reducers';
import { Store } from '@ngrx/store';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: 'update-confirm.component.html'
})
export class UpdateConfirmComponent {
  dayConfirm = new UntypedFormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly store: Store<AppState>,
    private readonly datePipe: DatePipe
  ) {
  }

  onSubmit() {
    this.store.dispatch(PayrollAction.confirmPayroll(
      {
        id: this.data.id,
        dataConfirm:
          { datetime: new Date(this.dayConfirm.value) }
      }));
  }
}
