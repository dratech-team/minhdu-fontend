import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { PayrollService } from '../../service/payroll.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';
import { selectedAddedPayroll, selectedAddingPayroll } from '../../+state/payroll/payroll.selector';
import { add } from 'ngx-bootstrap/chronos';

@Component({
  templateUrl: 'add-payroll.component.html'
})
export class AddPayrollComponent implements OnInit {
  formGroup!: FormGroup;
  adding$ = this.store.pipe(select(selectedAddingPayroll));
  added$ = this.store.pipe(select(selectedAddedPayroll));

  constructor(
    private dialogRef: MatDialogRef<AddPayrollComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly payrollService: PayrollService,
    private readonly snackBar: MatSnackBar,
    private readonly store: Store,
    private readonly datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      generate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')]
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  submit(): any {
    if (this.data?.addOne) {
      const generate = {
        createdAt: new Date(this.formGroup.value.generate),
        employeeId: +this.data.employeeId
      };
      this.store.dispatch(PayrollAction.addPayroll({ generate: generate, addOne: true, inHistory: this.data.inHistory }));
    } else {
      const generate = {
        createdAt: new Date(this.formGroup.value.generate)
      };
      this.store.dispatch(PayrollAction.addPayroll({ generate: generate }));
    }
    this.store.pipe(select(selectedAddedPayroll)).subscribe(added =>{
      if(added){
        this.dialogRef.close();
      }
    })
  }
}
