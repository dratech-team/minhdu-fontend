import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, FormGroup} from "@angular/forms";
import {Store} from "@ngrx/store";
import {PayrollAction} from "../../+state/payroll/payroll.action";

@Component({
  templateUrl: 'dialog-note.component.html',
})
export class DialogNoteComponent {
  formGroup = new FormGroup({
      note: new FormControl(this.data?.payroll?.note)
    }
  )

  constructor(
    private readonly store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }


  onSubmit() {
    this.store.dispatch(PayrollAction.updatePayroll({
      id: this.data.payroll.id,
      payroll: {note: this.formGroup.value?.note}}))
  }
}
