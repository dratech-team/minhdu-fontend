import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PartialDayEnum } from '@minhdu-fontend/data-models';
import {
  DatetimeUnitEnum,
  partialDay,
  SalaryTypeEnum,
} from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { PayrollAction } from '../../../+state/payroll/payroll.action';
import { selectedAddedPayroll } from '../../../+state/payroll/payroll.selector';
import { AppState } from '../../../../../reducers';
import * as moment from 'moment';
import { getFirstDayInMonth, getLastDayInMonth } from '@minhdu-fontend/utils';

@Component({
  templateUrl: 'dialog-absent.component.html',
})
export class DialogAbsentComponent implements OnInit {
  @ViewChild('titleAbsent') titleAbsent!: ElementRef;
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  formGroup!: UntypedFormGroup;
  submitted = false;
  selectedIndex?: number;
  unitMinute = false;
  unitAbsent = false;
  firstDayInMonth!: string | null;
  lastDayInMonth!: string | null;

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogAbsentComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  //DUMMY DATA Không thay đổi thứ tự index hiện tại -> thêm title ở cuối mảng
  titleAbsents = [
    { title: 'Vắng', unit: this.datetimeUnit.DAY, type: this.type.ABSENT },
    {
      title: 'Không đi làm',
      unit: this.datetimeUnit.DAY,
      type: this.type.DAY_OFF,
    },
    { title: 'Đi trễ', unit: this.datetimeUnit.MINUTE, type: this.type.ABSENT },
    { title: 'Về Sớm', unit: this.datetimeUnit.MINUTE, type: this.type.ABSENT },
    {
      title: 'Quên bổ sung công',
      unit: this.datetimeUnit.TIMES,
      type: this.type.ABSENT,
    },
  ];
  //Dummy data select các buổi trong ngày
  titleSession = [
    {
      title: 'buổi sáng',
      type: PartialDayEnum.MORNING,
      times: partialDay.PARTIAL,
    },
    {
      title: 'buổi chiều',
      type: PartialDayEnum.AFTERNOON,
      times: partialDay.PARTIAL,
    },
    {
      title: 'nguyên ngày',
      type: PartialDayEnum.ALL_DAY,
      times: partialDay.ALL_DAY,
    },
  ];

  ngOnInit(): void {
    this.firstDayInMonth = this.datePipe.transform(
      getFirstDayInMonth(new Date(this.data.payroll.createdAt)),
      'yyyy-MM-dd'
    );
    this.lastDayInMonth = this.datePipe.transform(
      getLastDayInMonth(new Date(this.data.payroll.createdAt)),
      'yyyy-MM-dd'
    );
    if (this.data.isUpdate) {
      if (this.data.salary.unit === DatetimeUnitEnum.MINUTE) {
        this.unitMinute = true;
      } else if (
        this.data.salary.unit === DatetimeUnitEnum.DAY &&
        this.data.salary.type === this.type.ABSENT
      ) {
        this.unitAbsent = true;
      }
      this.formGroup = this.formBuilder.group({
        datetime: [
          this.datePipe.transform(this.data.salary?.datetime, 'yyyy-MM-dd'),
        ],
        startedAt: [
          this.datePipe.transform(this.data.salary?.startedAt, 'yyyy-MM-dd'),
        ],
        endedAt: [
          this.datePipe.transform(this.data.salary?.endedAt, 'yyyy-MM-dd'),
        ],
        forgot: [this.data.salary?.forgot],
        times: [
          this.data.salary.unit === DatetimeUnitEnum.MINUTE
            ? Math.floor(this.data.salary.times / 60)
            : this.data.salary.times,
        ],
        unit: [this.data.salary.unit],
        minutes: [
          this.data.salary.unit === DatetimeUnitEnum.MINUTE
            ? this.data.salary.times % 60
            : undefined,
        ],
        note: [this.data.salary.note],
        type: [this.data.type],
        rate: [1],
        partialDay: [],
      });
    } else {
      this.formGroup = this.formBuilder.group({
        datetime: [
          this.datePipe.transform(this.data.payroll.createdAt, 'yyyy-MM-dd'),
        ],
        startedAt: [],
        endedAt: [],
        times: [],
        minutes: [],
        type: [this.data.type, Validators.required],
        rate: [1, Validators.required],
        note: [],
        forgot: [],
        partialDay: [],
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
    if (
      (this.formGroup.value.unit === DatetimeUnitEnum.MINUTE ||
        (typeof this.selectedIndex === 'number' &&
          this.titleAbsents[this.selectedIndex]?.unit) ===
          DatetimeUnitEnum.MINUTE) &&
      !this.formGroup.value.times &&
      !this.formGroup.value.minutes
    ) {
      return this.snackBar.open('chưa nhập Số phút', '', { duration: 2000 });
    }

    const value = this.formGroup.value;
    const salary = {
      title: this.data?.salary?.title,
      type: this.data?.salary?.type
        ? this.data.salary.type
        : typeof this.selectedIndex === 'number'
        ? this.titleAbsents[this.selectedIndex]?.type
        : undefined,
      rate: value.rate,
      forgot: value.forgot,
      note: value.note,
      unit: value.unit
        ? value.unit
        : typeof this.selectedIndex === 'number'
        ? this.titleAbsents[this.selectedIndex]?.unit
        : undefined,
      payrollId: this.data?.payroll
        ? this.data.payroll.id
        : this.data.salary.payrollId,
      times: value.times,
    };
    if (
      ((typeof this.selectedIndex === 'number' &&
        this.titleAbsents[this.selectedIndex]?.unit ===
          DatetimeUnitEnum.TIMES) ||
        this.data?.salary?.unit === DatetimeUnitEnum.TIMES) &&
      !value.times
    ) {
      return this.snackBar.open('chưa nhập Số lần', '', { duration: 2000 });
    }
    if (
      typeof this.selectedIndex === 'number' &&
      this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.MINUTE &&
      !value.times &&
      !value.minutes
    ) {
      return this.snackBar.open('chưa nhập thời gian', '', { duration: 2000 });
    }

    if (
      value.unit === DatetimeUnitEnum.MINUTE ||
      (typeof this.selectedIndex === 'number' &&
        this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.MINUTE)
    ) {
      Object.assign(salary, {
        datetime: new Date(value.datetime),
        times: value.times ? value.times * 60 + value.minutes : value.minutes,
      });
    }
    if (this.data.isUpdate) {
      if (this.data.salary.unit === DatetimeUnitEnum.DAY) {
        if (this.data.salary?.startedAt) {
          if (
            moment(value.startedAt).format('YYYY-MM-DD') ===
            moment(value.endedAt).format('YYYY-MM-DD')
          ) {
            return this.snackBar.open(
              'Không được sửa vắng từ ngày đến ngày thành một ngày',
              '',
              { duration: 1500 }
            );
          } else {
            Object.assign(salary, {
              times:
                new Date(value.endedAt).getDate() -
                new Date(value.startedAt).getDate() +
                1,
              startedAt: new Date(value.startedAt + '-00'),
              endedAt: new Date(value.endedAt + '-00'),
            });
          }
        } else {
          Object.assign(salary, {
            datetime: new Date(value.datetime),
          });
        }
      }
      this.store.dispatch(
        PayrollAction.updateSalary({
          id: this.data.salary.id,
          payrollId: this.data.salary.payrollId,
          salary: salary,
        })
      );
    } else {
      if (typeof this.selectedIndex !== 'number') {
        return this.snackBar.open('Chưa chọn Loại', '', { duration: 2000 });
      }
      if (
        this.titleAbsents[this.selectedIndex].unit === DatetimeUnitEnum.DAY &&
        typeof value.partialDay !== 'number'
      ) {
        return this.snackBar.open('Chưa chọn buổi ', '', { duration: 2000 });
      }

      if (
        this.titleAbsents[this.selectedIndex].unit ===
          DatetimeUnitEnum.MINUTE &&
        !value.datetime
      ) {
        return this.snackBar.open('Chưa chọn ngày ', '', { duration: 2000 });
      }
      if (
        this.titleAbsents[this.selectedIndex].unit === DatetimeUnitEnum.DAY &&
        value.partialDay === 2 &&
        (!value.startedAt || !value.endedAt)
      ) {
        return this.snackBar.open('Chưa chọn từ ngày đến ngày ', '', {
          duration: 2000,
        });
      }

      if (
        this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.TIMES
      ) {
        Object.assign(salary, {
          title: this.titleAbsents[this.selectedIndex]?.title,
        });
      }

      if (
        this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.DAY
      ) {
        if (typeof value.partialDay !== 'number') {
          return this.snackBar.open('chưa chọn buổi', '', { duration: 2000 });
        }
        if (value.partialDay === 2) {
          if (
            moment(value.startedAt).format('YYYY-MM-DD') ===
            moment(value.endedAt).format('YYYY-MM-DD')
          ) {
            Object.assign(salary, {
              title:
                this.titleAbsents[this.selectedIndex]?.title +
                ' ' +
                this.titleSession[value.partialDay]?.title,
              times: this.titleSession[value.partialDay].times,
              datetime: new Date(value.startedAt + '-00'),
            });
          } else {
            Object.assign(salary, {
              title:
                this.titleAbsents[this.selectedIndex]?.title +
                ' ' +
                this.titleSession[value.partialDay]?.title,
              times:
                this.titleSession[value.partialDay].times *
                (new Date(value.endedAt).getDate() -
                  new Date(value.startedAt).getDate() +
                  1),
              startedAt: new Date(value.startedAt + '-00'),
              endedAt: new Date(value.endedAt + '-00'),
            });
          }
        } else {
          Object.assign(salary, {
            title:
              this.titleAbsents[this.selectedIndex]?.title +
              ' ' +
              this.titleSession[value.partialDay]?.title,
            times: this.titleSession[value.partialDay].times,
            datetime: new Date(value.datetime),
          });
        }
      }
      if (
        this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.MINUTE
      ) {
        Object.assign(salary, {
          title: this.titleAbsents[this.selectedIndex]?.title,
          times: value.times ? value.times * 60 + value.minutes : value.minutes,
        });
      }
      this.store.dispatch(
        PayrollAction.addSalary({
          payrollId: this.data.payroll.id,
          salary: salary,
          isDetailPayroll: true,
        })
      );
    }
    this.store.pipe(select(selectedAddedPayroll)).subscribe((added) => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }

  onSelectAbsent(index: number) {
    this.selectedIndex = index;
  }
}
