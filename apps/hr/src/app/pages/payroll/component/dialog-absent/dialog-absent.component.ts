import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';
import { PayrollAction } from '../../+state/payroll/payroll.action';
import { PartialDayEnum } from '@minhdu-fontend/data-models';

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
  unitMinute = false;
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
    { title: 'Vắng', unit: this.datetimeUnit.DAY , type: this.type.ABSENT  },
    { title: 'Không đi làm', unit: this.datetimeUnit.DAY,type: this.type.DAY_OFF  },
    { title: 'Đi trễ', unit: this.datetimeUnit.MINUTE,type: this.type.ABSENT  },
    { title: 'Về Sớm', unit: this.datetimeUnit.MINUTE,type: this.type.ABSENT  }
  ];
  //Dummy data select các buổi trong ngày
  titleSession = [
    { title: 'buổi sáng', type: PartialDayEnum.MORNING },
    { title: 'buổi chiều', type: PartialDayEnum.AFTERNOON },
    { title: 'nguyên ngày', type: PartialDayEnum.ALL_DAY }
  ];

  ngOnInit(): void {
    if (this.data.isUpdate) {
      if (this.data.salary.unit === DatetimeUnitEnum.MINUTE) {
        this.unitMinute = true;
      } else if (this.data.salary.unit === DatetimeUnitEnum.DAY && this.data.type === this.type.ABSENT) {
        this.unitAbsent = true;
      }
      this.formGroup = this.formBuilder.group({
        datetime: [
          this.datePipe.transform(
            this.data.salary.datetime, 'yyyy-MM-dd')
        ],
        forgot: [this.data.salary?.forgot],
        times: [this.data.salary.unit === DatetimeUnitEnum.MINUTE ?
          Math.floor(this.data.salary.times / 60) : this.data.salary.times
        ],
        unit: [this.data.salary.unit],
        minutes: [this.data.salary.unit === DatetimeUnitEnum.MINUTE ?
          this.data.salary.times % 60 : undefined],
        note: [this.data.salary.note],
        type: [this.data.type],
        rate: [1],
        partialDay: []
      });
    } else {
      this.formGroup = this.formBuilder.group({
        datetime: ['', Validators.required],
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
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    if (this.formGroup.value.unit === DatetimeUnitEnum.MINUTE &&
      this.formGroup.value.times == 0 && this.formGroup.value.minutes == 0) {
      this.snackBar.openFromComponent(SnackBarComponent,
        {
          data: { content: 'thơi gian phải lớn hơn 0' },
          panelClass: ['background-snackbar-validate'],
          duration: 2500
        });
      return;
    }

    const value = this.formGroup.value;
    console.log(this.titleAbsents[this.selectedIndex]?.type)
    const salary = {
      title: this.data?.salary?.title,
      type: this.data?.salary?.type? this.data.salary.type : this.titleAbsents[this.selectedIndex]?.type,
      rate: value.rate,
      datetime: value.datetime ? new Date(value.datetime) : undefined,
      forgot: value.forgot,
      note: value.note,
      unit: value.unit ? value.unit : this.titleAbsents[this.selectedIndex]?.unit,
      payrollId: this.data?.payroll ? this.data.payroll.id : this.data.salary.payrollId,
      times: value.times
    };
    if (value.unit === DatetimeUnitEnum.MINUTE || this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.MINUTE) {
      Object.assign(salary, { times: value.times ? value.times * 60 + value.minutes : value.minutes });
    }
    if (this.data.isUpdate) {
      Object.assign(salary, { title: this.data.salary.title });
      if (this.data.salary.unit === DatetimeUnitEnum.DAY) {
        if(this.data.salary.type ===this.type.ABSENT && value.partialDay){
          Object.assign(
            salary, {
              title: 'Vắng ' + this.titleSession[value.partialDay]?.title,
              times: this.titleSession[value.partialDay]?.type === PartialDayEnum.ALL_DAY ? 1 : 0.5
            }
          );
        }else if(this.data.salary.type ===this.type.DAY_OFF && value.partialDay){
          Object.assign(
            salary, {
              title: 'Không đi làm ' + this.titleSession[value.partialDay].title,
              times: this.titleSession[value.partialDay]?.type === PartialDayEnum.ALL_DAY ? 1 : 0.5
            }
          );
        }
      }
      this.store.dispatch(PayrollAction.updateSalary({
        id: this.data.salary.id,
        payrollId: this.data.salary.payrollId, salary: salary
      }));
    } else {
      if (this.titleAbsents[this.selectedIndex]?.unit === DatetimeUnitEnum.DAY) {
          Object.assign(
            salary, {
              title: this.titleAbsents[this.selectedIndex]?.title + ' ' + this.titleSession[value.partialDay]?.title,
              times: this.titleSession[value.session]?.type === PartialDayEnum.ALL_DAY ? 1 : 0.5
            }
          );
      }else{
        Object.assign(
          salary, {
            title: this.titleAbsents[this.selectedIndex]?.title,
            times: value.times? value.times * 60 + value.minutes: value.minutes,
          }
        );
      }
      this.store.dispatch(PayrollAction.addSalary({
        payrollId: this.data.payroll.id, salary: salary
      }));
    }
    this.dialogRef.close();

  }

  onSelectAbsent(index: number) {
    this.selectedIndex = index;
  }
}
