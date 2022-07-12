import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  templateUrl: 'dialog-datepicker.component.html'
})
export class DialogDatePickerComponent {
  submitted = false;
  formGroup = new FormGroup({
    date: new FormControl<Date | null>(null, { validators: [Validators.required] })
  });

  constructor(public readonly nzModalRef: NzModalRef<DialogDatePickerComponent>) {
  }

  ngOnInit() {
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    this.nzModalRef.close(this.formGroup.value);
  }
}
