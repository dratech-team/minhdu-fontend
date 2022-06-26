import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { getBranchAdded } from '@minhdu-fontend/orgchart';
import { BranchService } from '../../../../../../../../libs/orgchart/src/lib/services/branch.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { PayrollAction } from '../../../payroll/+state/payroll/payroll.action';

@Component({
  templateUrl: 'allowance-branch.component.html'
})
export class AllowanceBranchComponent implements OnInit {
  @ViewChild('branchInput') branchInput!: ElementRef;
  formGroup!: UntypedFormGroup;
  submitted = false;
  numberChars = new RegExp('[^0-9]', 'g');

  constructor(
    private readonly dialogRef: MatDialogRef<AllowanceBranchComponent>,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly store: Store,
    private readonly branchService: BranchService,
    private readonly snackbar: MatSnackBar,
    private readonly datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    if (this.data?.isUpdate) {
      this.formGroup = this.formBuilder.group({
        branch: [this.data.allowance.name],
        title: [this.data.allowance.title],
        price: [this.data.allowance.price],
        datetime: [
          this.datePipe.transform(this.data.allowance.datetime, 'yyyy-MM-dd')
        ]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        branch: [],
        title: ['', Validators.required],
        price: ['', Validators.required],
        datetime: ['', Validators.required]
      });
    }
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onsubmit(): any {
    this.submitted = true;
    if (this.formGroup.valid) {
      const val = this.formGroup.value;
      const allowanceBranch = {
        branchId: this.data.branchId,
        title: val.title,
        price: typeof (val.price) === 'string' ? Number(val.price.replace(this.numberChars, '')) : val.price,
        datetime: new Date(val.datetime),
        unit: DatetimeUnitEnum.MONTH,
        type: SalaryTypeEnum.ALLOWANCE
      };
      if (this.data?.isUpdate) {
        this.store.dispatch(PayrollAction.updateSalary(
          { salary: allowanceBranch, id: this.data.allowance.id ,branchId: this.data.branchId}
        ));
      } else {
        this.store.dispatch(PayrollAction.addSalary(
          { salary: allowanceBranch, branchId: this.data.branchId }
        ));
      }
    } else {
      return;
    }
    this.store.pipe(select(getBranchAdded)).subscribe(added => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }

}
