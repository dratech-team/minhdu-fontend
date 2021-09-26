import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { AppState } from '../../../../reducers';
import { TemplateBasicAction } from '../../../template/+state/teamlate-salary-basic/template-basic-salary.action';
import { selectorAllTemplate } from '../../../template/+state/teamlate-salary-basic/template-basic-salary.selector';

@Component({
  templateUrl: 'dialog-basic.component.html',
})
export class DialogBasicComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  checkSalary = true;
  templateBasicSalary$ = this.store.pipe(select(selectorAllTemplate));
  /// FIXME: Dummy data
  salaries = [
    { title: 'Lương cơ bản trích BH', type: SalaryTypeEnum.BASIC_INSURANCE },
    { title: 'Lương theo PL.HD', type: SalaryTypeEnum.BASIC },
    { title: 'Lương Tín nhiệm', type: SalaryTypeEnum.BASIC_TRUST },
  ];

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DialogBasicComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  ngOnInit(): void {
    if (this.data?.salary?.type === this.type.BASIC_INSURANCE) {
      this.checkSalary = false;
    }
    this.store.dispatch(TemplateBasicAction.loadALlTemplate());
    this.formGroup = this.formBuilder.group({
      price: [this.data?.salary?.price, Validators.required],
      type: [
        this.data?.salary?.title === 'Lương Tín nhiệm'
          ? this.type.BASIC_TRUST
          : this.data?.salary?.type,
        Validators.required,
      ],
      rate: [1, Validators.required],
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
    const titleSalary = this.salaries.find((val) => val.type === value.type);
    const salary = {
      title: titleSalary?.title,
      price: this.checkSalary
        ? typeof value.price === 'string'
          ? Number(value.price.replace(this.numberChars, ''))
          : value.price
        : value.price,
      rate: value.rate,
      payrollId: this.data?.payroll?.id || undefined,
      type:
        value.type === this.type.BASIC_INSURANCE ? value.type : this.type.BASIC,
    };
    if (this.data.salary) {
      this.store.dispatch(
        PayrollAction.updateSalary({
          id: this.data.salary.id,
          payrollId: this.data.payroll.id,
          salary: salary,
        })
      );
    } else {
      this.store.dispatch(
        PayrollAction.addSalary({
          payrollId: this.data.payroll.id,
          salary: salary,
        })
      );
    }
    this.dialogRef.close();
  }

  //TODO
  onCheckValue(val: boolean) {
    this.checkSalary = val;
  }
}
