import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { DatePipe } from '@angular/common';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { TemplateBasicSalaryService } from '../../../template/service/template-basic-salary.service';
import { Observable } from 'rxjs';
import { TemplateSalaryBasic } from '../../../template/+state/teamlate-salary-basic/template-salary-basic';
import { SalaryService } from '../../service/salary.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  templateUrl: 'dialog-basic.component.html',
})
export class DialogBasicComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  checkSalary!: boolean;
  templateBasicSalary$!: Observable<TemplateSalaryBasic[]>;

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DialogBasicComponent>,
    private readonly templateBasicSalaryService: TemplateBasicSalaryService,
    private readonly salaryService: SalaryService,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  ngOnInit(): void {
    this.templateBasicSalary$ = this.templateBasicSalaryService.getAll();
    this.formGroup = this.formBuilder.group({
      price: [this.data?.salary?.price, Validators.required],
      type: [
        this.data?.salary?.type ? this.data?.salary?.type : this.data.type,
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
    const salary = {
      title:
        value.type.trim() === this.type.BASIC_INSURANCE
          ? 'Lương cơ bản trích BH'
          : 'Lương theo PL.HĐ',
      price: this.checkSalary
        ? typeof value.price === 'string'
          ? Number(value.price.replace(this.numberChars, ''))
          : value.price
        : value.price,
      rate: value.rate,
      payrollId: this.data?.payroll?.id || undefined,
      type: value.type,
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
      /// TODO: bùa
      this.salaryService.addOne(salary).pipe(debounceTime(2000)).subscribe((val) => {
        if (val) {
          location.reload();
        }
      });
    }
    this.dialogRef.close();
  }

  //TODO
  onCheckValue(val: boolean) {
    this.checkSalary = val;
  }
}
