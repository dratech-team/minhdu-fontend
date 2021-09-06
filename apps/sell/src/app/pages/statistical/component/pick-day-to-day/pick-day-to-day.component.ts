import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  templateUrl: 'pick-day-to-day.component.html'
})
export class PickDayToDayComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      startedAt: [Validators.required],
      endedAt: [Validators.required]
    });
  }

  onSubmit() {
    const val = this.formGroup.value;
    return {
      startedAt: new Date(val.startedAt),
      endedAt: new Date(val.endedAt)
    };
  }

  print() {
    const val = this.formGroup.value;
    return {
      startedAt: new Date(val.startedAt),
      endedAt: new Date(val.endedAt),
      print: true
    };
  }
}
