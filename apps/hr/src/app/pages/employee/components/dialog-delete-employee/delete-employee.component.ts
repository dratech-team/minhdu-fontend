import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EmployeeAction, selectEmployeeDeleted } from '@minhdu-fontend/employee';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'delete-employee.component.html'
})
export class DeleteEmployeeComponent implements OnInit {
  formGroup!: FormGroup;
  submitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DeleteEmployeeComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly datePipe: DatePipe,
    private readonly store: Store,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      leftAt: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')]
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  submit(): void {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    if (this.data.permanentlyDeleted) {
      this.store.dispatch(EmployeeAction.deleteEmployee(
        {
          id: this.data.employee.id,
        }));
    } else {
      this.store.dispatch(EmployeeAction.leaveEmployee(
        {
          id: this.data.employee.id,
          body: { leftAt: this.data.leftAt ? '' : new Date(this.formGroup.value.leftAt) }
        }));
    }
    this.store.pipe(select(selectEmployeeDeleted)).subscribe(deleted => {
      if (deleted) {
        this.router.navigate(['/ho-so']).then();
        this.dialogRef.close();
      }
    });
  }
}
