import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: 'route-dialog.component.html'
})
export class RouteDialogComponent implements OnInit {
  formGroup!: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: [this?.data?.route?.name, Validators.required],
      endedAt: [this?.data?.route?.endedAt, Validators.required],
      startedAt: [this?.data?.route?.startedAt, Validators.required],
      bsx: [this?.data?.route?.bsx, Validators.required],
    });
  }

  onSubmit() {

  }
}
