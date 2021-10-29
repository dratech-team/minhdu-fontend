import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../reducers';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PayrollAction } from '../../../+state/payroll/payroll.action';
import { selectedAddedPayroll } from '../../../+state/payroll/payroll.selector';
import { selectorAllTemplate } from '../../../../template/+state/teamlate-salary/template-salary.selector';
import { TemplateSalaryAction } from '../../../../template/+state/teamlate-salary/template-salary.action';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SalaryMultipleEmployeeService } from '../../../service/salary-multiple-employee.service';

@Component({
  templateUrl: 'dialog-stay.component.html'
})
export class DialogStayComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  indexTitle = 0;
  salariesStay$ = this.store.pipe(select(selectorAllTemplate));
  employeeIds: number[] = [];
  isManyPeople = false;

  constructor(
    public datePipe: DatePipe,
    public multipleEmployeeService: SalaryMultipleEmployeeService,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogStayComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }


  ngOnInit(): void {
    console.log(this.data.salary);
    this.store.dispatch(TemplateSalaryAction.loadALlTemplate({ salaryType: SalaryTypeEnum.STAY }));
    if (this.data.isUpdate) {
      this.formGroup = this.formBuilder.group({
        title: [this.data?.salary?.title],
        price: [this.data?.salary?.price, Validators.required],
        rate: [1, Validators.required]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        title: [undefined, Validators.required],
        price: [undefined, Validators.required],
        rate: [1, Validators.required]
      });
    }
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
    const salary = {
      title: value.title ? value.title : this.data?.salary?.title,
      price: typeof (value.price) === 'string' ? Number(value.price.replace(this.numberChars, '')) : value.price,
      type: this.data.type,
      rate: value.rate,
      payrollId: this.data?.payroll?.id ? this.data.payroll.id : undefined
    };
    if (this.data.salary) {
      this.store.dispatch(PayrollAction.updateSalary({
        payrollId: this.data.salary.payrollId, id: this.data.salary.id, salary: salary
      }));
    } else {
      if (this.employeeIds.length > 0) {
        Object.assign(salary, { employeeIds: this.employeeIds });
        this.multipleEmployeeService.addOne({salary: salary, employeeIds: this.employeeIds})
          .subscribe(val => {
          if (val) {
            location.reload()
            this.dialogRef.close();
          }
        });
      } else {
        this.store.dispatch(PayrollAction.addSalary({ payrollId: this.data.payroll.id, salary: salary }));
      }
    }
    this.store.pipe(select(selectedAddedPayroll)).subscribe(added => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }

  setPrice(price: number) {
    this.formGroup.get('price')!.setValue(price);
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
    console.log(this.employeeIds);
  }
}
