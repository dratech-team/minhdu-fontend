import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  templateUrl: 'add-payroll.component.html'
})
export class AddPayrollComponent implements OnInit {
  employeeIds: number[] = [];
  isManyPeople = false;
  formGroup!: FormGroup;
  type!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      createdAt: ['', Validators.required]
    });
  }

  onSubmit() {
    return {
      employeeId: this.data?.id,
      createdAt: new Date(this.formGroup.value.createdAt),
      // employeesId: this.employeeIds.length > 0? this.employeeIds: undefined,
    };
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
