import {DatePipe} from '@angular/common';
import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConvertBooleanFrontEnd, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {select, Store} from '@ngrx/store';
import {PayrollAction} from '../../../+state/payroll/payroll.action';
import {AppState} from '../../../../../reducers';
import {selectedAddedPayroll} from '../../../+state/payroll/payroll.selector';
import {TemplateSalaryAction} from '../../../../template/+state/teamlate-salary/template-salary.action';
import {selectorAllTemplate} from '../../../../template/+state/teamlate-salary/template-salary.selector';
import {Role} from '../../../../../../../../../libs/enums/hr/role.enum';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {SalaryService} from '../../../service/salary.service';
import {Employee, SalaryPayroll} from '@minhdu-fontend/data-models';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Payroll} from "../../../+state/payroll/payroll.interface";
import {EmployeeAction} from "@minhdu-fontend/employee";

@Component({
  templateUrl: 'dialog-basic.component.html'
})
export class DialogBasicComponent implements OnInit {
  numberChars = new RegExp('[^0-9]', 'g');
  @Output() EmitSalariesSelected = new EventEmitter<SalaryPayroll[]>();
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  checkSalary = true;
  roleEnum = Role;
  role = localStorage.getItem('role');
  templateBasicSalary$ = this.store.pipe(select(selectorAllTemplate));
  isManyPeople = false;
  payrollSelected: Payroll[] = [];
  salariesSelected: SalaryPayroll[] = [];
  tabindex = 0;
  /// FIXME: Dummy data
  salaries = [
    {title: 'Lương cơ bản trích BH', type: SalaryTypeEnum.BASIC_INSURANCE},
    {title: 'Lương theo PL.HD', type: SalaryTypeEnum.BASIC},
    {title: 'Lương Tín nhiệm', type: SalaryTypeEnum.BASIC_TRUST},
    {title: 'Lương TN quản lý thêm', type: SalaryTypeEnum.BASIC_TRUST_MANAGER}
  ];

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly message: NzMessageService,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DialogBasicComponent>,
    private readonly salaryService: SalaryService,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit(): void {
    if (this.data?.updateMultiple) {
      this.salariesSelected = this.data.salariesSelected;
    }
    if (this.data?.salary?.type === this.type.BASIC_INSURANCE) {
      this.checkSalary = false;
    }
    this.store.dispatch(TemplateSalaryAction.loadALlTemplate({salaryType: SalaryTypeEnum.BASIC}));
    if (this.data?.salary) {
      this.formGroup = this.formBuilder.group(this.data.isHistorySalary ? {
        price: [this.data.salary.price, Validators.required],
        rate: [1, Validators.required],
        datetime: [this.datePipe.transform(this.data.salary.datetime, 'yyyy-MM-dd'), Validators.required]
      } : {
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
      if (this.data.payroll) {
        this.payrollSelected.push(this.data.payroll);
      }
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
    if (this.data?.addMultiple && this.payrollSelected.length === 0) {
      return this.message.error('Chưa chọn nhân viên');
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
      datetime: new Date(this.data?.payroll?.createdAt || this.data?.createdAt)
    };
    this.store.dispatch(PayrollAction.updateStatePayroll({added: ConvertBooleanFrontEnd.FALSE}));
    if (this.data?.isUpdate) {
      if (this.data?.updateMultiple) {
        this.salaryService.updateMultipleSalaryOvertime(
          {
            salaryIds: this.salariesSelected.map(e => e.salary.id),
            title: this.data.salary.title,
            price: this.checkSalary
              ? typeof value.price === 'string'
                ? Number(value.price.replace(this.numberChars, ''))
                : value.price
              : value.price
          }).subscribe(val => {
          if (val) {
            this.message.success(val.message);
            this.store.dispatch(PayrollAction.updateStatePayroll({added: ConvertBooleanFrontEnd.FALSE}));
            this.dialogRef.close({title: this.salariesSelected[0].salary.title});
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
      if (this.data.isHistorySalary) {
        Object.assign(salary, {
          createdAt: value.datetime,
          title: this.data.salary.title
        })
        this.store.dispatch(EmployeeAction.updateHistorySalary({
          id: this.data.salary.id,
          salary: salary,
          employeeId: this.data.salary.employeeId
        }))
      } else {
        this.store.dispatch(
          PayrollAction.addSalary(
            this.payrollSelected.length === 1 &&
            this.payrollSelected[0].id == this.data?.payroll?.id ?
              {
                payrollId: this.data.payroll.id,
                salary: salary
              } :
              {
                salary: Object.assign(salary, {payrollIds: this.payrollSelected.map(val => val.id)})
              }
          )
        );
      }
    }
    this.store.pipe(select(selectedAddedPayroll)).subscribe(val => {
      if (val) {
        this.dialogRef.close({title: salary.title});
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

  pickPayroll(payrolls: Payroll[]) {
    this.payrollSelected = [...payrolls];
  }

  changeSalariesSelected($event: SalaryPayroll[]) {
    this.salariesSelected = $event;
    this.EmitSalariesSelected.emit(this.salariesSelected);
  }

  changeTab(indexTab: number) {
    this.tabindex = indexTab;
  }
}
