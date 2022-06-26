import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder } from '@angular/forms';
import { AppState } from '../../../../reducers';
import { Store } from '@ngrx/store';
import { PayrollAction } from '../../+state/payroll/payroll.action';

@Component({
  templateUrl: 'dialog-man-confirmed-at.component.html'
})
export class DialogManConfirmedAtComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly store: Store<AppState>
  ) {
  }

  onSubmit() {
    this.store.dispatch(PayrollAction.confirmPayroll(
      {
        id: this.data.id,
        dataConfirm:
          { datetime: this.data.manConfirmedAt ? null : new Date(this.data.createdAt) }
      }));
  }
}
