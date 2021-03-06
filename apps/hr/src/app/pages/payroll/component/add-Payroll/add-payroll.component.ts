import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import {
  selectedAddedPayroll,
  selectedAddingPayroll,
  selectedRangeDayPayroll,
} from '../../+state/payroll/payroll.selector';
import { getSelectors } from '../../../../../../../../libs/utils/getState.ultils';
import { LoadingComponent } from '../popup-loading/loading.component';
import { RangeDay } from '@minhdu-fontend/data-models';
import { getFirstDayInMonth, getLastDayInMonth } from '@minhdu-fontend/utils';

@Component({
  templateUrl: 'add-payroll.component.html',
})
export class AddPayrollComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  adding$ = this.store.pipe(select(selectedAddingPayroll));
  createdAt = getSelectors<RangeDay>(selectedRangeDayPayroll, this.store).start;
  constructor(
    private dialogRef: MatDialogRef<AddPayrollComponent>,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly store: Store,
    private readonly datePipe: DatePipe,
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
