import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConvertBooleanFrontEnd, DatetimeUnitEnum, partialDay, RecipeType, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../../reducers';
import {DatePipe} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  selectorAllTemplate,
  selectTemplateLoaded
} from '../../../../template/+state/template-overtime/template-overtime.selector';
import {TemplateOvertimeAction} from '../../../../template/+state/template-overtime/template-overtime.action';
import {PayrollAction} from '../../../+state/payroll/payroll.action';
import {getFirstDayInMonth, getLastDayInMonth} from '../../../../../../../../../libs/utils/daytime.until';
import {PartialDayEnum, SalaryPayroll} from '@minhdu-fontend/data-models';
import {SalaryService} from '../../../service/salary.service';
import {selectedAddedPayroll} from '../../../+state/payroll/payroll.selector';
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  templateUrl: 'dialog-overtime.component.html'
})

export class DialogOvertimeComponent implements OnInit {
  @Output() EmitSalariesSelected = new EventEmitter<SalaryPayroll[]>();
  datetimeUnitEnum = DatetimeUnitEnum;
  isAllowanceOvertime = false;
  numberChars = new RegExp('[^0-9]', 'g');
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  loadingTemplate$ = this.store.pipe(select(selectTemplateLoaded));
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  firstDayInMonth!: string | null;
  lastDayInMonth!: string | null;
  recipeType = RecipeType;
  salariesSelected: SalaryPayroll[] = [];

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly message: NzMessageService,
    private readonly dialogRef: MatDialogRef<DialogOvertimeComponent>,
    private readonly salaryService: SalaryService,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  compareFN = (o1: any, o2: any) => (typeof o1 === 'string' ? o1 == o2.title : o1.id === o2.id);

  ngOnInit(): void {
    if (!this.data?.updateMultiple) {
      this.firstDayInMonth = this.datePipe.transform(
        getFirstDayInMonth(new Date(this.data?.payroll?.createdAt)), 'yyyy-MM-dd');
      this.lastDayInMonth = this.datePipe.transform(
        getLastDayInMonth(new Date(this.data?.payroll?.createdAt)), 'yyyy-MM-dd');
    } else {
      this.salariesSelected = this.data.salariesSelected
    }
    if (this.data?.isUpdate) {
      if (this.data.salary?.allowance) {
        this.isAllowanceOvertime = true
      }
      this.formGroup = this.formBuilder.group({
        title: [this.data.salary.title],
        datetime: [
          this.datePipe.transform(
            this.data.salary.datetime, 'yyyy-MM-dd')],
        note: [this.data.salary.note],
        times: [this.data.salary?.times],
        rate: [this.data.salary?.rate],
        unit: [this.data.salary.unit],
        price: [this.data.salary.price],
        days: [this.data.salary.times],
        priceAllowance: [this.data.salary.allowance?.price],
        titleAllowance: [this.data.salary.allowance?.title],
      });
    } else {
      this.formGroup = this.formBuilder.group({
        title: [''],
        datetime: [this.datePipe.transform(
          this.data.payroll.createdAt, 'yyyy-MM-dd')],
        month: [undefined],
        note: [''],
        times: [1],
        days: [1],
        unit: [],
        rate: [],
        price: [''],
        priceAllowance: [],
        titleAllowance: [],
        partial: []
      });
    }
    this.formGroup.get('title')?.valueChanges.subscribe(title => {
      this.formGroup.get('price')?.setValue(title.price)
      this.formGroup.get('rate')?.setValue(title.rate)
      this.formGroup.get('unit')?.setValue(title.unit, {emitEvent: false})
    })

    this.formGroup.get('unit')?.valueChanges.subscribe(val => {
      this.formGroup.get('price')?.setValue(0)
      this.formGroup.get('title')?.setValue('', {emitEvent: false})
      if (val !== DatetimeUnitEnum.OPTION) {
        this.loadTemplateOvertime();
      }

    })
    this.loadTemplateOvertime();
  }

  get f() {
    return this.formGroup.controls;
  }


  onSubmit(): any {
    const value = this.formGroup.value;
    if (!value.unit) {
      return this.message.warning('Chưa chọn đơn vị tăng ca')
    }
    if (!value.title) {
      return this.message.warning('Chưa chọn loại tăng ca')
    }
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const salary = {
      title: value.title?.title || this.data.salary.title,
      price: value.price,
      type: this.data.type,
      rate: value.rate,
      times: value.unit === this.datetimeUnitEnum.DAY && value.days > 1 ? value.days : value.times,
      datetime: value.datetime ? new Date(value.datetime) : undefined,
      note: value.note,
      unit: value.unit,
      payrollId: this.data?.payroll?.id ? this.data.payroll.id : this.data.salary.payrollId
    };

    if (this.isAllowanceOvertime) {
      if (!value.titleAllowance || !value.priceAllowance) {
        return this.snackBar.open('Chưa nhập đủ thông tin phụ cấp tăng ca')
      }
      Object.assign(salary, {
        allowance:
          {
            title: value.titleAllowance,
            price: typeof value.priceAllowance === 'string'
              ? Number(value.priceAllowance.replace(this.numberChars, ''))
              : value.priceAllowance
          }
      });
    }
    if (value.unit === DatetimeUnitEnum.TIMES) {
      delete salary.datetime;
    } else {
      if (!value.datetime) {
        return this.message.warning('Chưa chọn ngày tăng ca')
      }
    }
    if (this.data?.isUpdate) {
      this.store.dispatch(PayrollAction.updateStatePayroll({added: ConvertBooleanFrontEnd.FALSE}));
      Object.assign(salary, {
        allowanceDeleted: !!(!this.isAllowanceOvertime && this.data.salary?.allowance)
      });
      if (this.data?.updateMultiple) {
        Object.assign(salary, {
          salaryIds: this.salariesSelected.map(e => e.salary.id)
        })
        delete salary.payrollId;
        this.salaryService.updateMultipleSalaryOvertime(salary).subscribe(val => {
          if (val) {
            this.snackBar.open(val.message, '', {duration: 1500});
            this.dialogRef.close({title: salary.title, datetime: value.datetime});
          }
        });
      } else {
        this.store.dispatch(PayrollAction.updateSalary({
          payrollId: this.data.salary.payrollId, id: this.data.salary.id, salary: salary
        }));

      }
    } else {
      if (value.days <= 1 && !value.datetime) {
        return this.snackBar.open('Chưa chọn ngày tăng ca', '', {duration: 2000});
      }
      if (value.unit === DatetimeUnitEnum.HOUR && !value.times) {
        return this.snackBar.open('chưa nhập số giờ tăng ca', '', {duration: 2000});
      }
      this.store.dispatch(PayrollAction.addSalary({payrollId: this.data.payroll.id, salary: salary}));
    }
    this.store.select(selectedAddedPayroll).subscribe(val => {
      if (val) {
        this.dialogRef.close(salary);
      }
    });
  }

  checkAllowanceOvertime() {
    this.isAllowanceOvertime = !this.isAllowanceOvertime;
  }

  loadTemplateOvertime() {
    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate(
      this.formGroup.value.unit && this.formGroup.value.unit !== DatetimeUnitEnum.OPTION ?
        {
          branchId: this.data.payroll.employee.branchId,
          positionIds: [this.data?.payroll.employee.positionId],
          unit: this.formGroup.value.unit
        } : {
          branchId: this.data.payroll.employee.branchId,
          positionIds: [this.data?.payroll.employee.positionId],
        }
    ));
  }

  changeSalariesSelected($event: SalaryPayroll[]) {
    this.salariesSelected = $event;
    this.EmitSalariesSelected.emit(this.salariesSelected);
  }
}
