import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { PayrollAction } from '../../../+state/payroll/payroll.action';
import { AppState } from '../../../../../reducers';
import { selectedAddedPayroll } from '../../../+state/payroll/payroll.selector';
import { TemplateSalaryAction } from '../../../../template/+state/teamlate-salary/template-salary.action';
import { selectorAllTemplate } from '../../../../template/+state/teamlate-salary/template-salary.selector';
import { Role } from '../../../../../../../../../libs/enums/hr/role.enum';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SalaryMultipleEmployeeService } from '../../../service/salary-multiple-employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: 'dialog-basic.component.html'
})
export class DialogBasicComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  checkSalary = true;
  roleEnum = Role;
  role = localStorage.getItem('role');
  templateBasicSalary$ = this.store.pipe(select(selectorAllTemplate));
  isManyPeople = false;
  employeeIds: number[] = [];
  /// FIXME: Dummy data
  salaries = [
    { title: 'Lương cơ bản trích BH', type: SalaryTypeEnum.BASIC_INSURANCE },
    { title: 'Lương theo PL.HD', type: SalaryTypeEnum.BASIC },
    { title: 'Lương Tín nhiệm', type: SalaryTypeEnum.BASIC_TRUST }
  ];

  constructor(
    public datePipe: DatePipe,
    public multipleEmployeeService: SalaryMultipleEmployeeService,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DialogBasicComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit(): void {
    if (this.data?.salary?.type === this.type.BASIC_INSURANCE) {
      this.checkSalary = false;
    }
    this.store.dispatch(TemplateSalaryAction.loadALlTemplate({ salaryType: SalaryTypeEnum.BASIC }));

    if (this.data.isUpdate) {
      this.formGroup = this.formBuilder.group({
        price: [this.data.salary.price, Validators.required],
        type: [
          this.data.salary.title === 'Lương Tín nhiệm'
            ? this.type.BASIC_TRUST
            : this.data?.salary?.type,
          Validators.required
        ],
        rate: [1, Validators.required]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        price: ['', Validators.required],
        type: ['', Validators.required
        ],
        rate: [1, Validators.required]
      });
    }
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
      payrollId: this.data.isUpdate ? this.data.salary.payrollId : this.data.payroll.id,
      type:
        value.type === this.type.BASIC_INSURANCE ? value.type : this.type.BASIC
    };
    if (this.data.isUpdate) {
      this.store.dispatch(
        PayrollAction.updateSalary({
          id: this.data.salary.id,
          payrollId: this.data.salary.payrollId,
          salary: salary
        })
      );
    } else {
      if (this.employeeIds.length > 0) {
        Object.assign(salary);
        const data = { salary: salary, employeeIds: this.employeeIds };
        this.multipleEmployeeService.addOne(data).subscribe(val => {
          if (val) {
            this.store.dispatch(PayrollAction.getPayroll({ id: this.data.payroll.id }));
            this.dialogRef.close();
          }
        });
      } else {
        this.store.dispatch(
          PayrollAction.addSalary({
            payrollId: this.data.payroll.id,
            salary: salary
          })
        );
      }
    }
    this.store.pipe(select(selectedAddedPayroll)).subscribe(val => {
      if (val) {
        this.dialogRef.close();
      }
    });

  }

  //TODO
  onCheckValue(val: boolean) {
    this.checkSalary = val;
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

  pickEmployees(employeeIds: number[]) {
    this.employeeIds = employeeIds;
  }
}
