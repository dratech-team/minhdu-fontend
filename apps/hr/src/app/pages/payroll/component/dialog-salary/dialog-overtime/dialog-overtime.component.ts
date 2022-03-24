import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {
  ConvertBooleanFrontEnd,
  DatetimeUnitEnum,
  partialDay,
  RecipeType,
  SalaryTypeEnum
} from '@minhdu-fontend/enums';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../../reducers';
import {DatePipe} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {selectorAllTemplate} from '../../../../template/+state/template-overtime/template-overtime.selector';
import {TemplateOvertimeAction} from '../../../../template/+state/template-overtime/template-overtime.action';
import {PayrollAction} from '../../../+state/payroll/payroll.action';
import {startWith} from 'rxjs/operators';
import {TemplateOvertime} from '../../../../template/+state/template-overtime/template-overtime.interface';
import {getFirstDayInMonth, getLastDayInMonth} from '../../../../../../../../../libs/utils/daytime.until';
import {searchAutocomplete} from '../../../../../../../../../libs/utils/orgchart.ultil';
import {PartialDayEnum, SalaryPayroll} from '@minhdu-fontend/data-models';
import {SalaryService} from '../../../service/salary.service';
import {selectedAddedPayroll} from '../../../+state/payroll/payroll.selector';

@Component({
  templateUrl: 'dialog-overtime.component.html'
})

export class DialogOvertimeComponent implements OnInit {
  @Output() EmitSalariesSelected = new EventEmitter<SalaryPayroll[]>();
  datetimeUnitEnum = DatetimeUnitEnum;
  titleOvertimes = new FormControl();
  onAllowanceOvertime = false;
  numberChars = new RegExp('[^0-9]', 'g');
  price!: number;
  title!: string;
  unit?: DatetimeUnitEnum;
  rate!: number;
  times?: number;
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  firstDayInMonth!: string | null;
  lastDayInMonth!: string | null;
  recipeType = RecipeType;
  partialDay: any;
  salariesSelected: SalaryPayroll[] = [];

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogOvertimeComponent>,
    private readonly salaryService: SalaryService,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  //Dummy data select các buổi trong ngày
  titleSession = [
    {title: 'buổi sáng', type: PartialDayEnum.MORNING, times: partialDay.PARTIAL},
    {title: 'buổi chiều', type: PartialDayEnum.AFTERNOON, times: partialDay.PARTIAL},
    {title: 'buổi tối', type: PartialDayEnum.NIGHT, times: partialDay.PARTIAL},
    {title: 'nguyên ngày', type: PartialDayEnum.ALL_DAY, times: partialDay.ALL_DAY}
  ];

  ngOnInit(): void {
    if (!this.data?.updateMultiple) {
      this.firstDayInMonth = this.datePipe.transform(
        getFirstDayInMonth(new Date(this.data?.payroll?.createdAt)), 'yyyy-MM-dd');
      this.lastDayInMonth = this.datePipe.transform(
        getLastDayInMonth(new Date(this.data?.payroll?.createdAt)), 'yyyy-MM-dd');
      if ((this.data?.isUpdate && this.data.salary.allowance)) {
        this.onAllowanceOvertime = true;
      }
    } else {
      this.salariesSelected = this.data.salariesSelected
    }
    if (this.data?.isUpdate) {
      if (!this.data.salary?.unit)
        this.partialDay = this.titleSession.find(e => e.type === this.data.salary.partial);
      this.price = this.data.salary.price;
      this.times = this.data.salary.times;
      this.unit = !this.data.updateMultiple && this.data?.payroll.employee.recipeType === RecipeType.CT4
      && !this.data.salary.unit ?
        DatetimeUnitEnum.OPTION
        : this.data.salary.unit;
      this.formGroup = this.formBuilder.group({
        datetime: [
          this.datePipe.transform(
            this.data.salary.datetime, 'yyyy-MM-dd')],
        note: [this.data.salary.note],
        times: [!this.data.salary?.unit && this.data.salary.partial !== PartialDayEnum.ALL_DAY ?
          this.data.salary.times * 2
          : this.data.salary.times
        ],
        days: [this.data.salary.times],
        priceAllowance: [this.data.salary.allowance?.price],
        titleAllowance: [this.data.salary.allowance?.title],
        partial: [this.data.salary.partial]
      });
    } else {
      this.loadTemplateOvertime();
      this.formGroup = this.formBuilder.group({
        datetime: [this.datePipe.transform(
          this.data.payroll.createdAt, 'yyyy-MM-dd')],
        month: [undefined],
        note: [''],
        times: [1],
        days: [1],
        priceAllowance: [],
        titleAllowance: [],
        partial: []
      });
    }

    this.templateOvertime$ = searchAutocomplete(
      this.titleOvertimes.valueChanges.pipe(startWith('')),
      this.store.pipe(select(selectorAllTemplate))
    );
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
    let salary = {
      title: this.title || this.data?.salary?.title,
      price: this.price || this.data?.salary?.price,
      type: this.data.type,
      rate: this.rate || this.data?.salary?.rate,
      times: this.unit === this.datetimeUnitEnum.DAY && value.days > 1 ? value.days : value.times,
      datetime: value.datetime ? new Date(value.datetime) : undefined,
      note: value.note,
      unit: this.unit || undefined,
      payrollId: this.data?.payroll?.id ? this.data.payroll.id : this.data.salary.payrollId
    };
    if (this.onAllowanceOvertime) {
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
    if (this.unit === DatetimeUnitEnum.OPTION) {
      Object.assign(salary, {
        times: this.partialDay.times * value.times,
        partial: value.partial
      });
      delete salary.unit;
      delete salary.datetime;
    }
    if (this.data?.isUpdate) {
      this.store.dispatch(PayrollAction.updateStatePayroll({added: ConvertBooleanFrontEnd.FALSE}));
      this.unit = this.data.salary.unit;
      this.title = this.data.salary.title;
      if (this.data?.updateMultiple) {
        delete salary.payrollId;
        Object.assign(salary, {
          allowanceDeleted: !this.onAllowanceOvertime && this.data.salary.allowance,
          salaryIds: this.salariesSelected.map(e => e.salary.id)
        });
        this.salaryService.updateMultipleSalaryOvertime(salary).subscribe(val => {
          if (val) {
            this.snackBar.open(val.message, '', {duration: 1500});
            this.dialogRef.close({title: this.title, datetime: value.datetime});
          }
        });
      } else {
        if (!this.onAllowanceOvertime && this.data.salary.allowance) {
          this.store.dispatch(PayrollAction.deleteSalary(
            {id: this.data.salary.allowance.id, PayrollId: this.data.salary.payrollId}));
        }
        this.store.dispatch(PayrollAction.updateSalary({
          payrollId: this.data.salary.payrollId, id: this.data.salary.id, salary: salary
        }));

      }
    } else {
      if (!this.title) {
        return this.snackBar.open('Chưa chọn loại tăng ca', '', {duration: 2000});
      }
      if (value.days <= 1 && !value.datetime) {
        return this.snackBar.open('Chưa chọn ngày tăng ca', '', {duration: 2000});
      }
      if (this.unit === DatetimeUnitEnum.HOUR && !value.times) {
        return this.snackBar.open('chưa nhập số giờ tăng ca', '', {duration: 2000});
      }
      this.store.dispatch(PayrollAction.addSalary({payrollId: this.data.payroll.id, salary: salary}));
    }
    this.store.select(selectedAddedPayroll).subscribe(val => {
      if (val) {
        this.dialogRef.close();
      }
    });
  }

  pickOverTime(data: TemplateOvertime) {
    this.price = data.price;
    this.title = data.title;
    this.rate = data.rate;
    this.unit = data.unit;
  }

  checkAllowanceOvertime() {
    this.onAllowanceOvertime = !this.onAllowanceOvertime;
  }

  selectUnitOvertime(unit?: DatetimeUnitEnum) {
    this.unit = unit;
    this.title = '';
    this.price = 0;
    if (unit !== DatetimeUnitEnum.OPTION) {
      this.loadTemplateOvertime(unit);
      this.titleOvertimes.patchValue('');
    }
  }

  selectPartialDay(partialDay: any) {
    this.title = 'Tăng ca ' + partialDay.title;
    this.partialDay = partialDay;
  }

  loadTemplateOvertime(unit?: DatetimeUnitEnum) {
    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate(
      unit ?
        {
          branchId: this.data.payroll.employee.branch.id,
          positionIds: [this.data?.payroll.employee.position.id],
          unit: this.unit
        } : {
          branchId: this.data.payroll.employee.branch.id,
          positionIds: [this.data?.payroll.employee.position.id],
        }
    ));
    this.titleOvertimes.patchValue('');
  }

  changeSalariesSelected($event: SalaryPayroll[]) {
    this.salariesSelected = $event;
    this.EmitSalariesSelected.emit(this.salariesSelected);
  }
}
