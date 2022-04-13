import {DatePipe} from '@angular/common';
import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {PartialDayEnum, SalaryPayroll} from '@minhdu-fontend/data-models';
import {DatetimeUnitEnum, partialDay, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {Store} from '@ngrx/store';
import {selectedAddingPayroll} from '../../../+state/payroll/payroll.selector';
import {AppState} from '../../../../../reducers';
import {getFirstDayInMonth, getLastDayInMonth} from '@minhdu-fontend/utils';
import {SalaryService} from '../../../service/salary.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {selectorAllTemplate} from "../../../../template/+state/teamlate-salary/template-salary.selector";
import {SessionConstant} from "../../../constants";
import {PriceTypeConstant} from "../../../../template/constants/price-type.constant";
import {TemplateSalaryAction} from "../../../../template/+state/teamlate-salary/template-salary.action";

@Component({
  templateUrl: 'dialog-absent.component.html'
})
export class DialogAbsentComponent implements OnInit {
  adding$ = this.store.select(selectedAddingPayroll)
  @Output() EmitSalariesSelected = new EventEmitter<SalaryPayroll[]>();
  templateSalary$ = this.store.select(selectorAllTemplate)
  numberChars = new RegExp('[^0-9]', 'g');
  type = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  formGroup!: FormGroup;
  submitted = false;
  unitMinute = false;
  unitAbsent = false;
  firstDayInMonth!: string | null;
  lastDayInMonth!: string | null;
  salariesSelected: SalaryPayroll[] = [];
  titleSession = SessionConstant
  partialDayEnum = PartialDayEnum
  priceTypeConstant = PriceTypeConstant
  indexStep = 1;

  constructor(
    public readonly datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DialogAbsentComponent>,
    private readonly salaryService: SalaryService,
    private readonly message: NzMessageService,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(TemplateSalaryAction.loadALlTemplate({
      salaryType: SalaryTypeEnum.ABSENT
    }));
    if (!this.data?.updateMultiple) {
      this.firstDayInMonth = this.datePipe.transform(
        getFirstDayInMonth(new Date(this.data.payroll.createdAt)), 'yyyy-MM-dd');
      this.lastDayInMonth = this.datePipe.transform(
        getLastDayInMonth(new Date(this.data.payroll.createdAt)), 'yyyy-MM-dd');
    } else {
      this.salariesSelected = this.data.salariesSelected;
    }
    if (this.data?.isUpdate) {
      if (this.data.salary?.unit === DatetimeUnitEnum.MINUTE) {
        this.unitMinute = true;
      } else if (
        this.data.salary?.unit === DatetimeUnitEnum.DAY &&
        this.data.salary.type === this.type.ABSENT
      ) {
        this.unitAbsent = true;
      }
      this.formGroup = this.formBuilder.group({
        datetime: [
          this.datePipe.transform(this.data.salary?.datetime, 'yyyy-MM-dd')
        ],
        price: [this.data?.salary?.price],
        times: [
          this.data.salary?.unit === DatetimeUnitEnum.MINUTE
            ? Math.floor(this.data.salary.times / 60)
            : this.data.salary?.times
        ],
        unit: [this.data.salary?.unit],
        minutes: [
          this.data.salary?.unit === DatetimeUnitEnum.MINUTE
            ? this.data.salary.times % 60
            : undefined
        ],
        note: [this.data.salary?.note],
        type: [this.data.type],
        rate: [1],
        partialDay: [this.data.salary?.partial]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        template: [],
        price: [],
        rangeDay: [[]],
        startTime: [],
        endTime: [],
        type: [this.data.type, Validators.required],
        rate: [1, Validators.required],
        note: [],
        partialDay: [],
        constraintHoliday: [],
        constraintOvertime: [],
        reference: []
      });
    }
    this.formGroup.get('template')?.valueChanges.subscribe(template => {
      this.formGroup.get('price')?.setValue(template.price)
      this.formGroup.get('constraintHoliday')?.setValue('')
      this.formGroup.get('constraintHoliday')?.setValue('')
      this.formGroup.get('reference')?.setValue(template.reference)
    })

    this.formGroup.get('partialDay')?.valueChanges.subscribe(item => {
      switch (item.value) {
        case PartialDayEnum.ALL_DAY:
          this.formGroup.get('startTime')?.setValue(new Date(0, 0, 0, 7, 0, 0))
          this.formGroup.get('endTime')?.setValue(new Date(0, 0, 0, 17, 0, 0))
          break
        case PartialDayEnum.MORNING:
          this.formGroup.get('startTime')?.setValue(new Date(0, 0, 0, 7, 0, 0))
          this.formGroup.get('endTime')?.setValue(new Date(0, 0, 0, 11, 30, 0))
          break
        case PartialDayEnum.AFTERNOON:
          this.formGroup.get('startTime')?.setValue(new Date(0, 0, 0, 13, 30, 0))
          this.formGroup.get('endTime')?.setValue(new Date(0, 0, 0, 17, 0, 0))
          break
      }

    })
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    this.dialogRef.close()
  }


  changeSalariesSelected($event: SalaryPayroll[]) {
    this.salariesSelected = $event;
    this.EmitSalariesSelected.emit(this.salariesSelected);
  }

  pre(): void {
    this.indexStep -= 1;
  }

  next(): void {
    this.indexStep += 1;
  }
}
