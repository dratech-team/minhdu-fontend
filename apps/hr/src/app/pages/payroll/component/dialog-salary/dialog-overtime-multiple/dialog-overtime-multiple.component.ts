import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  DatetimeUnitEnum,
  EmployeeType,
  RecipeType,
  SalaryTypeEnum,
} from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../../reducers';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  selectorAllTemplate,
  selectTemplateLoaded,
} from '../../../../template/+state/template-overtime/template-overtime.selector';
import { TemplateOvertimeAction } from '../../../../template/+state/template-overtime/template-overtime.action';
import { PayrollAction } from '../../../+state/payroll/payroll.action';
import { startWith } from 'rxjs/operators';
import { TemplateOvertime } from '../../../../template/+state/template-overtime/template-overtime.interface';
import {
  getAllPosition,
  PositionActions,
} from '../../../../../../../../../libs/orgchart/src/lib/+state/position';
import { MatStepper } from '@angular/material/stepper';
import { Position } from '@minhdu-fontend/data-models';
import { searchAutocomplete } from '../../../../../../../../../libs/utils/orgchart.ultil';
import { SalaryService } from '../../../service/salary.service';
import {
  getFirstDayInMonth,
  getLastDayInMonth,
} from '../../../../../../../../../libs/utils/daytime.until';
import * as lodash from 'lodash';
import { Payroll } from '../../../+state/payroll/payroll.interface';
import { NzMessageService } from 'ng-zorro-antd/message';
import { values } from 'lodash';

@Component({
  templateUrl: 'dialog-overtime-multiple.component.html',
})
export class DialogOvertimeMultipleComponent
  implements OnInit, AfterContentChecked
{
  @ViewChild(MatStepper) stepper!: MatStepper;
  positions = new UntypedFormControl();
  positions$ = this.store.pipe(select(getAllPosition));
  isAllowanceOvertime = false;
  numberChars = new RegExp('[^0-9]', 'g');
  payrollsSelected: Payroll[] = [];
  allowPayrollSelected: Payroll[] = [];
  times?: number;
  type = SalaryTypeEnum;
  formGroup!: UntypedFormGroup;
  submitted = false;
  positionsSelected: Position[] = [];
  datetimeUnitEnum = DatetimeUnitEnum;
  positionOfTempOver: Position[] = [];
  employeeType!: EmployeeType;
  recipeType?: RecipeType;
  firstDayInMonth!: string | null;
  lastDayInMonth!: string | null;
  templateOvertime$ = this.store.pipe(select(selectorAllTemplate));
  loadingTemplate$ = this.store.pipe(select(selectTemplateLoaded));

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly salaryService: SalaryService,
    private readonly message: NzMessageService,
    private readonly dialogRef: MatDialogRef<DialogOvertimeMultipleComponent>,
    private ref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  compareFN = (o1: any, o2: any) =>
    typeof o1 === 'string' ? o1 == o2.title : o1.id === o2.id;

  ngOnInit(): void {
    this.store.dispatch(PositionActions.loadPosition());
    if (this.data?.salary) {
      this.firstDayInMonth = this.datePipe.transform(
        getFirstDayInMonth(new Date(this.data.salary?.datetime)),
        'yyyy-MM-dd'
      );
      this.lastDayInMonth = this.datePipe.transform(
        getLastDayInMonth(new Date(this.data.salary?.datetime)),
        'yyyy-MM-dd'
      );
      if (this.data.salary?.allowance) {
        this.isAllowanceOvertime = true;
      }
      if (!this.data.salary?.unit) {
        this.recipeType = RecipeType.CT4;
      }
      this.formGroup = this.formBuilder.group({
        title: [this.data.salary.title],
        datetime: [
          this.datePipe.transform(this.data.salary.datetime, 'yyyy-MM-dd'),
        ],
        month: [
          !this.data.salary.unit
            ? this.datePipe.transform(this.data.salary.datetime, 'yyyy-MM')
            : undefined,
        ],
        price: [this.data.salary.price],
        unit: [this.data.salary.unit],
        note: [''],
        rate: [this.data.salary?.rate],
        times: [this.data.salary.times],
        days: [1],
        priceAllowance: [this.data.salary?.allowance?.price],
        titleAllowance: [this.data.salary?.allowance?.title],
      });
    } else {
      this.formGroup = this.formBuilder.group({
        title: [''],
        datetime: [
          this.datePipe.transform(this.data.createdAt, 'yyyy-MM-dd'),
          undefined,
        ],
        month: [undefined],
        note: [''],
        times: [1],
        days: [1],
        price: [''],
        unit: [''],
        rate: [''],
        priceAllowance: [],
        titleAllowance: [],
      });
    }
    this.loadTemplateOvertime();

    this.formGroup
      .get('title')
      ?.valueChanges.subscribe((val: TemplateOvertime) => {
        if (!val) {
          this.positionOfTempOver = [];
        }
        if (val.unit) {
          this.formGroup.get('unit')?.setValue(val.unit, { emitEvent: false });
        }
        this.formGroup.get('rate')?.setValue(val.rate);
        this.formGroup.get('price')?.setValue(val.price);
        this.positionOfTempOver = val.positions ? val.positions : [];
      });

    this.formGroup.get('unit')?.valueChanges.subscribe((val) => {
      this.formGroup.get('title')?.patchValue('');
      this.loadTemplateOvertime();
    });

    this.positions$ = searchAutocomplete(
      this.positions.valueChanges.pipe(startWith('')),
      this.positions$
    );

    this.formGroup.get('days')?.valueChanges.subscribe((days) => {
      if (days > 1) {
        this.formGroup.get('datetime')?.setValue('');
      } else {
        this.formGroup.get('month')?.setValue('');
      }
    });
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  checkAllowanceOvertime() {
    this.isAllowanceOvertime = !this.isAllowanceOvertime;
  }

  get f() {
    return this.formGroup.controls;
  }

  onSelectPosition(position: Position, event: any, positionInput: HTMLElement) {
    if (event.isUserInput) {
      if (position.id) {
        if (this.positionsSelected.some((item) => item.id === position.id)) {
          this.snackBar.open('ch???c v??? ???? ???????c ch???n', '', { duration: 1000 });
        } else {
          this.positionOfTempOver = [];
          this.positionsSelected.push(position);
          this.formGroup.get('title')?.patchValue('');
        }
      }
    }
    setTimeout(() => {
      this.positions.setValue('');
      positionInput.blur();
    });
  }

  pickAllowance(employees: Payroll[]): any {
    this.allowPayrollSelected = [...employees];
  }

  pickPayrolls(employees: Payroll[]): any {
    this.payrollsSelected = [...employees];
  }

  check(): any {
    //Validate
    const value = this.formGroup.value;
    if (value.unit !== DatetimeUnitEnum.OPTION) {
      if (!value.datetime && !value.month) {
        if (value.days <= 1) {
          return this.snackBar.open('Ch??a ch???n ng??y t??ng ca', '', {
            duration: 2000,
          });
        } else {
          return this.snackBar.open('Ch??a ch???n th??ng t??ng ca', '', {
            duration: 2000,
          });
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
    if (
      !this.data?.isUpdate &&
      !value.title &&
      value.unit !== DatetimeUnitEnum.OPTION
    ) {
      return this.snackBar.open('ch??a ch???n lo???i t??ng ca', '???? hi???u', {
        duration: 1000,
      });
    }
    if (!value.datetime && !value.month) {
      if (value.unit === DatetimeUnitEnum.HOUR) {
        return this.snackBar.open('Ch??a ch???n ng??y t??ng ca', '', {
          duration: 2000,
        });
      } else {
        return this.snackBar.open('Ch??a ch???n th??ng t??ng ca', '', {
          duration: 2000,
        });
      }
    }
    if (value.unit && !value.times) {
      return this.snackBar.open('ch??a nh???p s??? gi??? t??ng ca', '???? hi???u', {
        duration: 1000,
      });
    }
    const salary = {
      title: value.title?.title || this.data?.salary?.title,
      price: value.price,
      type: SalaryTypeEnum.OVERTIME,
      rate: value.rate || this.data?.salary?.rate,
      times:
        value.unit === this.datetimeUnitEnum.DAY ? value.days : value.times,
      datetime:
        value.days <= 1 && value.datetime
          ? new Date(value.datetime)
          : value.days > 1 && value.month
          ? new Date(value.month)
          : undefined,
      note: value.note,
      unit: value.unit || undefined,
    };
    if (this.isAllowanceOvertime) {
      Object.assign(salary, {
        allowPayrollIds: this.allowPayrollSelected.map((e) => e.id),
        allowance: {
          title: value.titleAllowance,
          price:
            typeof value.priceAllowance === 'string'
              ? Number(value.priceAllowance.replace(this.numberChars, ''))
              : value.priceAllowance,
        },
      });
    }
    if (this.data?.isUpdate) {
      Object.assign(salary, { salaryIds: this.data.salaryIds });
      this.salaryService
        .updateMultipleSalaryOvertime(salary)
        .subscribe((val) => {
          if (val) {
            this.snackBar.open(val.message, '', { duration: 1500 });
            this.dialogRef.close({
              title: val.title?.title || this.data.salary.title,
              datetime: value.datetime,
            });
          }
        });
    } else {
      if (this.payrollsSelected.length === 0) {
        return this.snackBar.open('ch??a ch???n nh??n vi??n', '???? hi???u', {
          duration: 1000,
        });
      }
      Object.assign(salary, {
        payrollIds: this.payrollsSelected.map((e) => e.id),
      });
      this.store.dispatch(
        PayrollAction.addSalary({
          salary: salary,
          isTimesheet: this.data?.isTimesheet,
        })
      );
      this.dialogRef.close({
        datetime: value.datetime,
        title: value.title?.title || value.title,
      });
    }
  }

  removePosition(position: Position) {
    lodash.remove(this.positionsSelected, position);
    this.formGroup.get('title')?.patchValue('');
  }

  loadTemplateOvertime() {
    this.store.dispatch(
      TemplateOvertimeAction.loadALlTemplate(
        this.formGroup.value?.unit
          ? {
              unit: this.formGroup.value.unit,
              positionIds: this.positionsSelected.map((value) => value.id),
            }
          : {
              positionIds: this.positionsSelected.map((value) => value.id),
            }
      )
    );
  }
}
