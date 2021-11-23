import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { PayrollAction } from '../../../+state/payroll/payroll.action';
import { AppState } from '../../../../../reducers';
import { TemplateSalaryAction } from '../../../../template/+state/teamlate-salary/template-salary.action';
import { selectorAllTemplate } from '../../../../template/+state/teamlate-salary/template-salary.selector';
import { Role } from '../../../../../../../../../libs/enums/hr/role.enum';
import { SalaryMultipleEmployeeService } from '../../../service/salary-multiple-employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Salary } from '@minhdu-fontend/data-models';
import { SalaryService } from '../../../service/salary.service';

@Component({
  templateUrl: 'salary-basic-multiple.component.html'
})
export class SalaryBasicMultipleComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  checkSalary = false;
  roleEnum = Role;
  role = localStorage.getItem('role');
  templateBasicSalary$ = this.store.pipe(select(selectorAllTemplate));

  constructor(
    public datePipe: DatePipe,
    public multipleEmployeeService: SalaryMultipleEmployeeService,
    private readonly dialog: MatDialog,
    private readonly salaryService: SalaryService,
    private readonly snackbar: MatSnackBar,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<SalaryBasicMultipleComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit(): void {
    if (this.data.salariesSelected.type === SalaryTypeEnum.BASIC_INSURANCE) {
      this.checkSalary = true;
      this.store.dispatch(TemplateSalaryAction.loadALlTemplate({ salaryType: SalaryTypeEnum.BASIC }));
    }
    this.formGroup = this.formBuilder.group({
      price: ['', Validators.required]
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    this.salaryService.updateMultipleSalaryOvertime(
      {
        salaryIds: this.data.salaryIds,
        title: this.data.salariesSelected.title,
        price: !this.checkSalary
          ? typeof value.price === 'string'
            ? Number(value.price.replace(this.numberChars, ''))
            : value.price
          : value.price
      }).subscribe(val => {
        if(val){
          this.dialogRef.close();
        }
    })
  }
}
