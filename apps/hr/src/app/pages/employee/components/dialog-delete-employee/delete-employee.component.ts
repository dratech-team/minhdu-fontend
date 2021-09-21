import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: 'delete-employee.component.html'
})
export class DeleteEmployeeComponent implements OnInit {
  formGroup!:FormGroup;
  submitted = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DeleteEmployeeComponent>,
    private readonly formBuilder:FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      leftAt: ['', Validators.required],
    })
  }

  get f() { return this.formGroup.controls; }

  submit(): void {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const val = this.formGroup.value
    this.dialogRef.close({
      leftAt: val.leftAt
    });
  }
}
