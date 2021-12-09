import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConvertBooleanFrontEnd, SalaryTypeEnum } from '@minhdu-fontend/enums';
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
import { SalaryService } from '../../../service/salary.service';
import { Employee } from '@minhdu-fontend/data-models';

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
  employeeSelected: Employee[] = [];
  /// FIXME: Dummy data
  salaries = [
    { title: 'Lương cơ bản trích BH', type: SalaryTypeEnum.BASIC_INSURANCE },
    { title: 'Lương theo PL.HD', type: SalaryTypeEnum.BASIC },
    { title: 'Lương Tín nhiệm', type: SalaryTypeEnum.BASIC_TRUST },
    { title: 'Lương TN quản lý thêm', type: SalaryTypeEnum.BASIC_TRUST_MANAGER }
  ];

  constructor(
    public datePipe: DatePipe,
    public multipleEmployeeService: SalaryMultipleEmployeeService,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DialogBasicComponent>,
    private readonly salaryService: SalaryService,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit(): void {
    if (this.data?.salary?.type === this.type.BASIC_INSURANCE) {
      this.checkSalary = false;
    }
    this.store.dispatch(TemplateSalaryAction.loadALlTemplate({ salaryType: SalaryTypeEnum.BASIC }));
    if (this.data?.isUpdate) {
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
    if(this.data?.addMultiple && this.employeeSelected.length === 0){
      return  this.snackbar.open('Chưa chọn nhân viên', 'Đóng')
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
      payrollId: this.data?.isUpdate ? this.data.salary.payrollId : this.data?.payroll?.id,
      type:
        value.type === this.type.BASIC_INSURANCE ? value.type : this.type.BASIC,
      datetime: new Date(this.data?.payroll?.createdAt|| this.data?.createdAt)
    };
    this.store.dispatch(PayrollAction.updateStatePayroll({added: ConvertBooleanFrontEnd.FALSE}))
    if (this.data?.isUpdate) {
      if (this.data?.updateMultiple) {
        this.salaryService.updateMultipleSalaryOvertime(
          {
            salaryIds: this.data.salaryIds,
            title: this.data.salary.title,
            price: this.checkSalary
              ? typeof value.price === 'string'
                ? Number(value.price.replace(this.numberChars, ''))
                : value.price
              : value.price
          }).subscribe(val => {
          if (val) {
            this.snackbar.open(val.message, '', { duration: 1500 });
            this.store.dispatch(PayrollAction.updateStatePayroll({ added: ConvertBooleanFrontEnd.FALSE }));
            this.dialogRef.close(true);
          }
        });
      } else {
        this.store.dispatch(
          PayrollAction.updateSalary({
            id: this.data.salary.id,
            payrollId: this.data.salary.payrollId,
            salary: salary
          })
        );
      }
    } else {
      if (this.employeeSelected.length === 1 && this.employeeSelected[0] == this.data.payroll?.employee?.id) {
        this.store.dispatch(
          PayrollAction.addSalary({
            payrollId: this.data.payroll.id,
            salary: salary
          })
        );
      } else {
        const data = { salary: salary, employeeIds: this.employeeSelected.map(e=> e.id) };
        this.multipleEmployeeService.addOne(data).subscribe(val => {
          if (val) {
            if (this.data?.addMultiple) {
              this.dialogRef.close({ title: titleSalary?.title });
            } else {
              this.store.dispatch(PayrollAction.getPayroll({ id: this.data.payroll.id }));
              this.dialogRef.close();
            }
          }
        });
      }
    }
    this.store.pipe(select(selectedAddedPayroll)).subscribe(val => {
      if (val) {
        this.dialogRef.close(true);
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

  pickEmployees(employees: Employee[]) {
    this.employeeSelected = employees;
  }
}
