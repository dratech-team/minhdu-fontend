import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EmployeeService } from 'libs/employee/src/lib/+state/service/employee.service';

@Component({
  templateUrl: 'BHYT.component.html'
})

export class BHYTComponent implements OnInit {
  formGroup!: FormGroup;
  submitted = false;

  constructor(
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(LOCALE_ID) private locale: string,
    private readonly employeeService: EmployeeService,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<BHYTComponent>
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      createdAt: [this.data?.createAt, Validators.required],
      endedAt: [this.data?.endedAt, Validators.required],
      BHYTId: [this.data?.BHYTId, Validators.required],
      PremiumRate: [this.data?.PremiumRate, Validators.required],
      provinceId: [this.data?.provinceId, Validators.required],
      IdBookBHXH: [this.data?.IdBookBHXH, Validators.required],
      codeBHXH: [this.data?.codeBHXH, Validators.required],
      registerPlaceKCB: [this.data?.registerPlaceKCB, Validators.required],
      registerPlaceId: [this.data?.registerPlaceId, Validators.required]
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const BHYT = {};
    if (this.data.update) {
    } else {
    }
    this.dialogRef.close()
  }
}
