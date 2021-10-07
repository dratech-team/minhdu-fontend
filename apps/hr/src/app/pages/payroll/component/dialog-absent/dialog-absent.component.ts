import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PartialDayEnum } from '@minhdu-fontend/data-models';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { select, Store } from '@ngrx/store';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { selectedAddedPayroll } from '../../+state/payroll/payroll.selector';
import { AppState } from '../../../../reducers';
import { partialDay } from '@minhdu-fontend/constants';
import * as moment from "moment";

@Component({
  templateUrl: 'dialog-absent.component.html'
})
export class DialogAbsentComponent implements OnInit {
  @ViewChild('titleAbsent') titleAbsent!: ElementRef;
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  formGroup!: FormGroup;
  submitted = false;
  selectedIndex!: number;
  unitAbsent = false;

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<DialogAbsentComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  //DUMMY DATA Không thay đổi thứ tự index hiện tại -> thêm title ở cuối mảng
  titleAbsents = [
    { title: 'Vắng', unit: this.datetimeUnit.DAY, type: this.type.ABSENT },
    {
      title: 'Không đi làm',
      unit: this.datetimeUnit.DAY,
      type: this.type.DAY_OFF
    },
    { title: 'Đi trễ', unit: this.datetimeUnit.MINUTE, type: this.type.ABSENT },
    { title: 'Về Sớm', unit: this.datetimeUnit.MINUTE, type: this.type.ABSENT }
  ];
  //Dummy data select các buổi trong ngày
  titleSession = [
    { title: 'buổi sáng', type: PartialDayEnum.MORNING, times: partialDay.PARTIAL },
    { title: 'buổi chiều', type: PartialDayEnum.AFTERNOON, times: partialDay.PARTIAL },
    { title: 'nguyên ngày', type: PartialDayEnum.ALL_DAY, times: partialDay.ALL_DAY }
  ];

  ngOnInit(): void {
    if (this.data.isUpdate) {
      if (this.data.salary.unit === DatetimeUnitEnum.DAY &&
        this.data.salary.type === this.type.ABSENT) {
        this.unitAbsent = true;
      }
      //INIT FORM
      if (this.data.unit === DatetimeUnitEnum.DAY) {
        this.formGroup = this.formBuilder.group({
          start: [this.datePipe.transform(this.data.salary.datetime.start, 'yyyy-MM-dd')],
          end: [this.datePipe.transform(this.data.salary.datetime.end, 'yyyy-MM-dd')],
          forgot: [this.data.salary?.forgot],
          times: [
            this.data.salary.unit === DatetimeUnitEnum.MINUTE
              ? Math.floor(this.data.salary.times / 60)
              : this.data.salary.times
          ],
          unit: [this.data.salary.unit],
          minutes: [
            this.data.salary.unit === DatetimeUnitEnum.MINUTE
              ? this.data.salary.times % 60
              : undefined
          ],
          note: [this.data.salary.note],
          type: [this.data.type],
          rate: [1],
          partialDay: []
        });
      } else {
        this.formGroup = this.formBuilder.group({
          datetime: [
            this.datePipe.transform(this.data.salary.datetime, 'yyyy-MM-dd')
          ],
          forgot: [this.data.salary?.forgot],
          times: [
            this.data.salary.unit === DatetimeUnitEnum.MINUTE
              ? Math.floor(this.data.salary.times / 60)
              : this.data.salary.times
          ],
          unit: [this.data.salary.unit],
          minutes: [
            this.data.salary.unit === DatetimeUnitEnum.MINUTE
              ? this.data.salary.times % 60
              : undefined
          ],
          note: [this.data.salary.note],
          type: [this.data.type],
          rate: [1],
          partialDay: []
        });
      }
    } else {
      this.formGroup = this.formBuilder.group({
        datetime: [undefined],
        start: [undefined],
        end: [undefined],
        times: [],
        minutes: [],
        type: [this.data.type, Validators.required],
        rate: [1, Validators.required],
        note: [],
        forgot: [],
        partialDay: []
      });
    }
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    console.log(this.formGroup);
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const salary = {
      title: this.data?.salary?.title,
      type: this.data?.salary?.type
        ? this.data.salary.type
        : this.titleAbsents[this.selectedIndex]?.type,
      rate: value.rate,
      datetime: value.datetime ? new Date(value.datetime) : undefined,
      forgot: value.forgot,
      note: value.note,
      unit: value.unit
        ? value.unit
        : this.titleAbsents[this.selectedIndex]?.unit,
      payrollId: this.data?.payroll
        ? this.data.payroll.id
        : this.data.salary.payrollId,
      times: value.times
    };
    //Validate khi chọn đi trễ mà không nhập giờ
    if (
      (this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.MINUTE ||
        this.data?.salary?.unit === DatetimeUnitEnum.MINUTE)
      && !value.times
      && !value.minutes
    ) {
      return this.snackBar.open('chưa nhập thời gian', '', { duration: 2000 });
    }
    //Validate khi chọn vắng hoặc không đi làm mà không chọn từ ngày đến ngày
    if (
      this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.DAY &&
      (!value.start || !value.end)
    ) {
      return this.snackBar.open('chưa chọn từ ngày đến ngày', '', { duration: 2000 });
    }
    //Validate Khi chọn đi trễ về sớm mà không nhập ngày
    if (
      this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.MINUTE && !value.datetime
    ) {
      return this.snackBar.open('chưa chọn ngày', '', { duration: 2000 });
    }

    if (this.data.isUpdate) {
      if (this.data.salary.unit === DatetimeUnitEnum.DAY) {
        if (
          this.data.salary.type === this.type.ABSENT &&
          typeof value.partialDay === 'number'
        ) {
          Object.assign(salary, {
            title: 'Vắng ' + this.titleSession[value.partialDay]?.title,
            times: this.titleSession[value.partialDay].times,
            datetime: { start: value.start, end: value.end }
          });
        }
        if (
          this.data.salary.type === this.type.DAY_OFF &&
          typeof value.partialDay === 'number'
        ) {
          Object.assign(salary, {
            title: 'Không đi làm ' + this.titleSession[value.partialDay]?.title,
            times: this.titleSession[value.partialDay].times,
            datetime: { start: value.start, end: value.end }
          });
        }
      } else {
        Object.assign(salary, {
          times: value.times ? value.times * 60 + value.minutes : value.minutes
        });
      }
      this.store.dispatch(
        PayrollAction.updateSalary({
          id: this.data.salary.id,
          payrollId: this.data.salary.payrollId,
          salary: salary
        })
      );
    } else {
      if (!this.titleAbsents[this.selectedIndex]?.type) {
        return this.snackBar.open('Chưa chọn Loại', '', { duration: 2000 });
      }

      if (
        this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.DAY
      ) {
        if (typeof value.partialDay !== 'number') {
          return this.snackBar.open('Chưa chọn buổi ', '', { duration: 2000 });
        }
        console.log(new Date(value.start))
        Object.assign(salary, {
          title:
            this.titleAbsents[this.selectedIndex]?.title +
            ' ' +
            this.titleSession[value.partialDay]?.title,
          times: this.titleSession[value.partialDay].times,
          datetime: moment(value.start).format('YYYY-MM-DD')  === moment(value.end).format('YYYY-MM-DD')
            ? value.start :
            {
              start: value.start,
              end: value.end
            }
        });
      } else {
        Object.assign(salary, {
          title: this.titleAbsents[this.selectedIndex]?.title,
          times: value.times ? value.times * 60 + value.minutes : value.minutes
        });
      }
      this.store.dispatch(
        PayrollAction.addSalary({
          payrollId: this.data.payroll.id,
          salary: salary
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
