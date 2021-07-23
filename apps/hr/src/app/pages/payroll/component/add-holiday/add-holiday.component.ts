import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: 'add-holiday.component.html'
})
export class AddHolidayComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      date: [Validators.required]
    });
  }

  onSubmit() {
    const val = this.formGroup.value;
    const holiday = {
      name: val.name,
      date: val.date
    };
    console.log(val)
  }
}
