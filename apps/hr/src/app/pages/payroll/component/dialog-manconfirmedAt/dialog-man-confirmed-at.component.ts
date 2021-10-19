import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl } from '@angular/forms';
import { AppState } from '../../../../reducers';
import { Store } from '@ngrx/store';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: 'dialog-man-confirmed-at.component.html'
})
export class DialogManConfirmedAtComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
  ) {
  }

  onSubmit() {
    this.store.dispatch(PayrollAction.confirmPayroll(
      {
        id: this.data.id,
        dataConfirm:
          { datetime: this.data.manConfirmedAt ? null: new Date(this.data.createdAt)}
      }));
  }
}
