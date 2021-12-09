import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import {
  selectedAddedPayroll,
  selectedAddingPayroll,
  selectedCreateAtPayroll
} from '../../+state/payroll/payroll.selector';
import { getSelectors } from '../../../../../../../../libs/utils/getState.ultils';
import { LoadingComponent } from '../popup-loading/loading.component';

@Component({
  templateUrl: 'add-payroll.component.html',
})
export class AddPayrollComponent implements OnInit {
  formGroup!: FormGroup;
  adding$ = this.store.pipe(select(selectedAddingPayroll));
  createdAt = getSelectors<Date>(selectedCreateAtPayroll, this.store);

  constructor(
    private dialogRef: MatDialogRef<AddPayrollComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly datePipe: DatePipe,
    private readonly dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      generate: [this.datePipe.transform(this.createdAt, 'yyyy-MM')],
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  submit(): any {
    const ref = this.dialog.open(LoadingComponent, {
      width: 'fit-content',
      disableClose: true,
      data: {
        content: 'Đang khởi tạo phiếu lương...',
      },
    });
    this.adding$.subscribe((val) => {
      if (val) {
        ref.close();
      }
    });
    if (this.data?.addOne) {
      const generate = {
        createdAt: new Date(this.formGroup.value.generate),
        employeeId: +this.data.employeeId,
        employeeType: this.data?.employeeType,
      };
      this.store.dispatch(
        PayrollAction.addPayroll({
          generate: generate,
          addOne: true,
          inHistory: this.data.inHistory,
        })
      );
    } else {
      const generate = {
        createdAt: new Date(this.formGroup.value.generate),
        employeeType: this.data?.employeeType,
      };
      this.store.dispatch(PayrollAction.addPayroll({ generate: generate }));
    }
    this.store.pipe(select(selectedAddedPayroll)).subscribe((added) => {
      if (added) {
        this.dialogRef.close(new Date(this.formGroup.value.generate));
      }
    });
  }
}
