import {AfterContentChecked, ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DatetimeUnitEnum, EmployeeType, partialDay, RecipeType, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../../reducers';
import {DatePipe} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {selectorAllTemplate} from '../../../../template/+state/template-overtime/template-overtime.selector';
import {TemplateOvertimeAction} from '../../../../template/+state/template-overtime/template-overtime.action';
import {PayrollAction} from '../../../+state/payroll/payroll.action';
import {map, startWith} from 'rxjs/operators';
import {TemplateOvertime} from '../../../../template/+state/template-overtime/template-overtime.interface';
import {getAllPosition} from '../../../../../../../../../libs/orgchart/src/lib/+state/position';
import {MatStepper} from '@angular/material/stepper';
import {Employee, PartialDayEnum, Position} from '@minhdu-fontend/data-models';
import {searchAutocomplete} from '../../../../../../../../../libs/utils/orgchart.ultil';
import {SalaryService} from '../../../service/salary.service';
import {getFirstDayInMonth, getLastDayInMonth} from '../../../../../../../../../libs/utils/daytime.until';
import * as lodash from 'lodash';
import {Payroll} from "../../../+state/payroll/payroll.interface";

@Component({
  templateUrl: 'dialog-overtime-multiple.component.html'
})
export class DialogOvertimeMultipleComponent implements OnInit, AfterContentChecked {
  @ViewChild(MatStepper) stepper!: MatStepper;
  positions = new FormControl();
  positions$ = this.store.pipe(select(getAllPosition));
  titleOvertimes = new FormControl();
  onAllowanceOvertime = false;
  numberChars = new RegExp('[^0-9]', 'g');
  payrollsSelected: Payroll[] = [];
  allowPayrollSelected: Payroll[] = [];
  price!: number;
  title!: string;
  unit?: DatetimeUnitEnum;
  rate!: number;
  times?: number;
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  templateId?: number;
  positionsSelected: Position[] = []
  datetimeUnitEnum = DatetimeUnitEnum;
  positionOfTempOver: Position[] = [];
  employeeType!: EmployeeType;
  recipeType?: RecipeType;
  partialDay: any;
  firstDayInMonth!: string | null;
  lastDayInMonth!: string | null;

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly salaryService: SalaryService,
    private readonly dialogRef: MatDialogRef<DialogOvertimeMultipleComponent>,
    private ref: ChangeDetectorRef,
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
    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate({}));
    if (this.data.isUpdate) {
      this.firstDayInMonth = this.datePipe.transform(
        getFirstDayInMonth(new Date(this.data.salary?.datetime)), 'yyyy-MM-dd');
      this.lastDayInMonth = this.datePipe.transform(
        getLastDayInMonth(new Date(this.data.salary?.datetime)), 'yyyy-MM-dd');
      this.title = this.data.salary.title;
      this.price = this.data.salary.price;
      this.unit = this.data.salary?.unit ? this.data.salary?.unit : DatetimeUnitEnum.OPTION;
      this.formGroup = this.formBuilder.group({
        datetime: [
          this.datePipe.transform(
            this.data.salary.datetime, 'yyyy-MM-dd'
          )],
        month: [undefined],
        note: [''],
        times: [this.data.salary?.times ? this.data.salary.times : 1],
        days: [1],
        priceAllowance: [this.data.salary?.allowance?.price],
        titleAllowance: [this.data.salary?.allowance?.title]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        datetime: [this.datePipe.transform(this.data.createdAt, 'yyyy-MM-dd'), undefined],
        month: [undefined],
        note: [''],
        times: [1],
        days: [1],
        priceAllowance: [],
        titleAllowance: []
      });
    }
    this.titleOvertimes.valueChanges
      .pipe(
        map((val) => {
          if (!val) {
            this.positionOfTempOver = [];
          }
         const param = {
           positionIds: this.positionsSelected.map(val => val.id),
           unit: this.unit
         }
          if(!this.unit){
            delete param.unit
          }
          this.store.dispatch(
            TemplateOvertimeAction.loadALlTemplate(param)
          );
        })
      )
      .subscribe();
    this.templateOvertime$ = searchAutocomplete(
      this.titleOvertimes.valueChanges.pipe(startWith('')),
      this.store.pipe(select(selectorAllTemplate))
    );

    this.positions$ = searchAutocomplete(
      this.positions.valueChanges.pipe(startWith('')),
      this.store.pipe(select(getAllPosition))
    );

    this.formGroup.get('days')?.valueChanges.subscribe(days => {
      if (days > 1) {
        this.formGroup.get('datetime')?.setValue('');
      } else {
        this.formGroup.get('month')?.setValue('');
      }
    });
  }

  ngAfterContentChecked() {
    this.ref.detectChanges()
  }

  checkAllowanceOvertime() {
    this.onAllowanceOvertime = !this.onAllowanceOvertime;
  }

  get f() {
    return this.formGroup.controls;
  }

  onSelectPosition(position: Position, event: any, positionInput: HTMLElement) {
    if (event.isUserInput) {
      if (position.id) {
        if (this.positionsSelected.some(item => item.id === position.id)) {
          this.snackBar.open('chức vụ đã được chọn', '', {duration: 1000});
        } else {
          this.positionOfTempOver = [];
          this.positionsSelected.push(position);
          this.templateId = undefined;
          this.titleOvertimes.patchValue('');
        }
      }
    }
    setTimeout(() => {
        this.positions.setValue('');
        positionInput.blur();
      }
    );
  }

  pickAllowance(employees: Payroll[]): any {
    this.allowPayrollSelected = [...employees];
  }

  pickPayrolls(employees: Payroll[]): any {
    this.payrollsSelected = [...employees]
  }

  pickOverTime(data: TemplateOvertime) {
    this.price = data.price;
    this.title = data.title;
    this.rate = data.rate;
    this.unit = data.unit;
    this.templateId = data.id;
    this.positionOfTempOver = data.positions ? data.positions : [];
    this.employeeType = data.employeeType;
  }

  selectUnitOvertime(unit?: DatetimeUnitEnum) {
    this.templateId = undefined;
    this.unit = unit;
    if (unit !== DatetimeUnitEnum.OPTION) {
      this.titleOvertimes.patchValue('');
      this.recipeType = undefined;
    } else {
      this.recipeType = RecipeType.CT4;
    }
  }

  check(): any {
    //Validate
    const value = this.formGroup.value;
    if (this.unit !== DatetimeUnitEnum.OPTION) {
      if (!this.data?.isUpdate && !this.templateId) {
        return this.snackBar.open('chưa chọn loại tăng ca', 'Đã hiểu', {
          duration: 1000
        });
      }
      if (!value.datetime && !value.month) {
        if (value.days <= 1) {
          return this.snackBar.open('Chưa chọn ngày tăng ca', '', {duration: 2000});
        } else {
          return this.snackBar.open('Chưa chọn tháng tăng ca', '', {duration: 2000});
        }
      }
    }
    this.stepper.next();
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    if (!this.data?.isUpdate && !this.templateId && this.unit !== DatetimeUnitEnum.OPTION) {
      return this.snackBar.open('chưa chọn loại tăng ca', 'Đã hiểu', {
        duration: 1000
      });
    }
    if (!value.datetime && !value.month) {
      if (this.unit === DatetimeUnitEnum.HOUR) {
        return this.snackBar.open('Chưa chọn ngày tăng ca', '', {duration: 2000});
      } else {
        return this.snackBar.open('Chưa chọn tháng tăng ca', '', {duration: 2000});
      }
    }
    if (this.unit && !value.times) {
      return this.snackBar.open('chưa nhập số giờ tăng ca', 'Đã hiểu', {
        duration: 1000
      });
    }
    const salary = {
      title: this.title,
      price: this.price,
      type: SalaryTypeEnum.OVERTIME,
      rate: this.rate || this.data?.salary?.rate,
      times: this.unit === this.datetimeUnitEnum.DAY ? value.days : value.times,
      datetime: value.days <= 1 && value.datetime ? new Date(value.datetime) :
        value.days > 1 && value.month ? new Date(value.month) : undefined,
      note: value.note,
      unit: this.unit || undefined
    };
    if (this.onAllowanceOvertime) {
      Object.assign(salary, {
        allowPayrollIds: this.allowPayrollSelected.map(e => e.id),
        allowance:
          {
            title: value.titleAllowance,
            price:
              typeof value.priceAllowance === 'string'
                ? Number(value.priceAllowance.replace(this.numberChars, ''))
                : value.priceAllowance
          }
      });
    }
    if (this.unit === DatetimeUnitEnum.OPTION) {
      if (this.partialDay) {
        Object.assign(salary, {
          times: this.partialDay.times * value.times,
          partial: this.partialDay.type,
          datetime: new Date(value.month)
        });
      }
      delete salary.unit;
    }
    if (this.data?.isUpdate) {
      Object.assign(salary, {salaryIds: this.data.salaryIds});
      this.salaryService.updateMultipleSalaryOvertime(salary).subscribe(val => {
        if (val) {
          this.snackBar.open(val.message, '', {duration: 1500});
          this.dialogRef.close(
            {
              title: this.title,
              datetime: value.datetime
            });
        }
      });
    } else {
      if (this.payrollsSelected.length === 0) {
        return this.snackBar.open('chưa chọn nhân viên', 'Đã hiểu', {
          duration: 1000
        });
      }
      Object.assign(salary, {payrollIds: this.payrollsSelected.map(e => e.id)});
      this.store.dispatch(PayrollAction.addSalary({salary: salary, isTimesheet: this.data?.isTimesheet}));
      this.dialogRef.close(
        {
          datetime: value.datetime,
          title: this.title
        });
    }

  }

  selectPartialDay(partialDay: any) {
    this.title = 'Tăng ca ' + partialDay.title;
    this.partialDay = partialDay;
  }

  removePosition(position: Position) {
    lodash.remove(this.positionsSelected, position);
    this.titleOvertimes.patchValue('');
  }
}
