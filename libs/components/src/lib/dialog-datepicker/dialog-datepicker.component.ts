import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: 'dialog-datepicker.component.html'
})
export class DialogDatePickerComponent {
  @Input() datetime?: Date;
  submitted = false;
  formGroup!: FormGroup;

  constructor(
    public readonly nzModalRef: NzModalRef<DialogDatePickerComponent>,
    private readonly datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      date: new FormControl<string | null>(
        this.datePipe.transform(this.datetime || new Date(), 'MM/dd/yyyy'),
        { validators: [Validators.required] }
      )
    });
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    this.nzModalRef.close({date: new Date(this.formGroup.value.date)});
  }
}
