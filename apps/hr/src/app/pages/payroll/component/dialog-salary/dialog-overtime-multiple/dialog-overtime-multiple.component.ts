import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatetimeUnitEnum, EmployeeType, partialDay, RecipeType, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../reducers';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectorAllTemplate } from '../../../../template/+state/template-overtime/template-overtime.selector';
import { TemplateOvertimeAction } from '../../../../template/+state/template-overtime/template-overtime.action';
import { PayrollAction } from '../../../+state/payroll/payroll.action';
import { map, startWith } from 'rxjs/operators';
import { TemplateOvertime } from '../../../../template/+state/template-overtime/template-overtime.interface';
import { getAllPosition } from '../../../../../../../../../libs/orgchart/src/lib/+state/position';
import { MatStepper } from '@angular/material/stepper';
import { PartialDayEnum, Position } from '@minhdu-fontend/data-models';
import { searchAutocomplete } from '../../../../../../../../../libs/utils/autocomplete.ultil';

@Component({
  templateUrl: 'dialog-overtime-multiple.component.html'
})
export class DialogOvertimeMultipleComponent implements OnInit {
  @ViewChild(MatStepper) stepper!: MatStepper;
  positions = new FormControl();
  positions$ = this.store.pipe(select(getAllPosition));
  titleOvertimes = new FormControl();
  onAllowanceOvertime = false;
  numberChars = new RegExp('[^0-9]', 'g');
  employeeIds: number[] = [];
  allowEmpIds: number[] = [];
  price!: number;
  title!: string;
  unit?: DatetimeUnitEnum;
  rate!: number;
  times?: number;
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  isManyPeople = false;
  type = SalaryTypeEnum;
  formGroup!: FormGroup;
  submitted = false;
  templateId?: number;
  positionId?: number;
  datetimeUnitEnum = DatetimeUnitEnum;
  positionOfTempOver: Position[] = [];
  employeeType!: EmployeeType;
  recipeType?: RecipeType;
  partialDay: any;

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogOvertimeMultipleComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  //Dummy data select các buổi trong ngày
  titleSession = [
    { title: 'buổi sáng', type: PartialDayEnum.MORNING, times: partialDay.PARTIAL },
    { title: 'buổi chiều', type: PartialDayEnum.AFTERNOON, times: partialDay.PARTIAL },
    { title: 'buổi tối', type: PartialDayEnum.NIGHT, times: partialDay.PARTIAL },
    { title: 'nguyên ngày', type: PartialDayEnum.ALL_DAY, times: partialDay.ALL_DAY }
  ];

  ngOnInit(): void {
    this.store.dispatch(TemplateOvertimeAction.loadALlTemplate({}));
    this.formGroup = this.formBuilder.group({
      datetime: [undefined],
      month: [undefined],
      note: [''],
      times: [1],
      days: [1],
      priceAllowance: [],
      titleAllowance: []
    });
    this.titleOvertimes.valueChanges
      .pipe(
        map((_) => {
          this.store.dispatch(
            TemplateOvertimeAction.loadALlTemplate({
              positionId: this.positionId || '',
              unit: this.unit ? this.unit : ''
            })
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

    this.formGroup.get('days')!.valueChanges.subscribe(days => {
      if (days > 1) {
        this.formGroup.get('datetime')!.setValue('');
      } else {
        this.formGroup.get('month')!.setValue('');
      }
    });
  }

  checkAllowanceOvertime() {
    this.onAllowanceOvertime = !this.onAllowanceOvertime;
  }

  get f() {
    return this.formGroup.controls;
  }

  onSelectPosition(positionId: number) {
    this.positionOfTempOver = [];
    this.positionId = positionId;
    this.templateId = undefined;
    this.titleOvertimes.patchValue('');
  }

  pickAllowance(allowEmpIds: number[]) {
    this.allowEmpIds = allowEmpIds;
  }

  pickEmployees(employeeIds: number[]): any {
    this.employeeIds = employeeIds;
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
      if (!this.templateId) {
        return this.snackBar.open('chưa chọn loại tăng ca', 'Đã hiểu', {
          duration: 1000
        });
      }
      if (!value.datetime && !value.month) {
        if (value.days <= 1) {
          return this.snackBar.open('Chưa chọn ngày tăng ca', '', { duration: 2000 });
        } else {
          return this.snackBar.open('Chưa chọn tháng tăng ca', '', { duration: 2000 });
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
    if (!this.templateId && this.unit!== DatetimeUnitEnum.OPTION) {
      return this.snackBar.open('chưa chọn loại tăng ca', 'Đã hiểu', {
        duration: 1000
      });
    }
    if (!value.datetime && !value.month) {
      if (this.unit === DatetimeUnitEnum.HOUR) {
        return this.snackBar.open('Chưa chọn ngày tăng ca', '', { duration: 2000 });
      } else {
        return this.snackBar.open('Chưa chọn tháng tăng ca', '', { duration: 2000 });
      }
    }
    if (this.unit && !value.times) {
      return this.snackBar.open('chưa nhập số giờ tăng ca', 'Đã hiểu', {
        duration: 1000
      });
    }
    if (this.employeeIds.length === 0) {
      return this.snackBar.open('chưa chọn nhân viên', 'Đã hiểu', {
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
      unit: this.unit || undefined,
      employeeIds: this.employeeIds
    };
    if (this.onAllowanceOvertime) {
      Object.assign(salary, {
        allowEmpIds: this.allowEmpIds,
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

    this.store.dispatch(PayrollAction.addSalary({ salary: salary, isTimesheet: this.data?.isTimesheet }));
    this.dialogRef.close();
  }

  selectPartialDay(partialDay: any) {
    this.title = 'Tăng ca ' + partialDay.title;
    this.partialDay = partialDay;
  }
}
