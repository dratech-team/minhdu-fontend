import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  templateUrl: 'add-payroll.component.html'
})
export class AddPayrollComponent implements OnInit {
  employeeIds: number[] = [];
  isManyPeople = false;
  formGroup!: FormGroup;
  type!: string;
  submitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddPayrollComponent>
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      createdAt: ['', Validators.required]
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const payroll = {
      employeeId: this.data?.id,
      createdAt: this.formGroup.value.createdAt
      // employeesId: this.employeeIds.length > 0? this.employeeIds: undefined,
    };
    this.dialogRef.close(payroll);
  }

  tabChanged($event: MatTabChangeEvent) {
    switch ($event.index) {
      case 2:
        this.isManyPeople = true;
        break;
      default:
        this.isManyPeople = false;
    }
  }

  pickEmployees(employeeIds: number []): any {
    this.employeeIds = employeeIds;
  }
}
