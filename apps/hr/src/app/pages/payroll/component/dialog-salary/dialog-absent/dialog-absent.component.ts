import {DatePipe} from '@angular/common';
import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {PartialDayEnum, Salary, SalaryPayroll} from '@minhdu-fontend/data-models';
import {DatetimeUnitEnum, partialDay, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {select, Store} from '@ngrx/store';
import {selectedAddedPayroll, selectedAddingPayroll} from '../../../+state/payroll/payroll.selector';
import {AppState} from '../../../../../reducers';
import {getFirstDayInMonth, getLastDayInMonth} from '@minhdu-fontend/utils';
import {SalaryService} from '../../../service/salary.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {selectorAllTemplate} from "../../../../template/+state/teamlate-salary/template-salary.selector";
import {SessionConstant} from "../../../constants";
import {PriceTypeConstant} from "../../../../template/constants/price-type.constant";
import {TemplateSalaryAction} from "../../../../template/+state/teamlate-salary/template-salary.action";
import {Payroll} from "../../../+state/payroll/payroll.interface";
import {PayrollAction} from "../../../+state/payroll/payroll.action";
import {map} from "rxjs/operators";

@Component({
  templateUrl: 'dialog-absent.component.html'
})
export class DialogAbsentComponent implements OnInit {
  adding$ = this.store.select(selectedAddingPayroll)
  @Output() EmitSalariesSelected = new EventEmitter<SalaryPayroll[]>();
  templateSalary$ = this.store.select(selectorAllTemplate).pipe(
    map(templates => {
      templates.push({id: 0, title:'Khác', type:SalaryTypeEnum.ABSENT, })
      return templates
    })
  )
  numberChars = new RegExp('[^0-9]', 'g');
  salaryTypeEnum = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  formGroup!: FormGroup;
  submitted = false;
  firstDayInMonth!: string | null;
  lastDayInMonth!: string | null;
  salariesSelected: SalaryPayroll[] = [];
  titleSession = SessionConstant
  partialDayEnum = PartialDayEnum
  priceTypeConstant = PriceTypeConstant
  indexStep = 1;
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id || o1 === o2.type : false);

  constructor(
    public readonly datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DialogAbsentComponent>,
    private readonly salaryService: SalaryService,
    private readonly message: NzMessageService,
    @Inject(MAT_DIALOG_DATA) public data: {
      salary?: Salary,
      updateMultiple?: boolean,
      salariesSelected?: SalaryPayroll[],
      payroll: Payroll
    }
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
    }
    if (this.data.salariesSelected) {
      this.salariesSelected = this.data.salariesSelected;
    }
    const salary = this.data?.salary
    this.formGroup = this.formBuilder.group({
      template: [salary?.salarySettingId, Validators.required],
      datetime: [
        salary ?
          this.datePipe.transform(salary.datetime, 'yyyy-MM-dd') : ''
      ],
      rangeDay: [[]],
      price: [this.data?.salary?.price],
      startTime: [],
      endTime: [],
      note: [this.data?.salary?.note],
      rate: [this.data?.salary?.rate, Validators.required],
      partialDay: [this.data.salary?.partial],
      constraintHoliday: [],
      constraintOvertime: [],
      reference: []
    });

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
    const value = this.formGroup.value
    const startedAt = value.rangeDay[0]
    const endedAt = value.rangeDay[1]
    const startTime = value.startTime
    const salary = {
      type: value.template || value.template.type,
      price: value.price || null,
      startedAt: new Date(
        startedAt.getYear(),
        startedAt.getMonth(),
        startedAt.getDate(),
        startTime.getHours(),
        startTime.getMinutes()),
      endedAt: new Date(
        endedAt.getYear(),
        endedAt.getMonth(),
        endedAt.getDate(),
        endedAt.getHours(),
        endedAt.getMinutes()),
      note: value.note,
      salarySettingId: value.template.id || this.data?.salary?.salarySettingId
    }
    if (this.data.salary) {
      if (this.data.updateMultiple) {
        Object.assign(salary, {
          salaryIds: this.salariesSelected.map(salary => salary.salary.id)
        })
        this.store.dispatch(PayrollAction.updateSalary({
          salary,
          multiple: true
        }))
      } else {
        this.store.dispatch(PayrollAction.updateSalary({
          salary,
          id: this.data.salary.id,
          payrollId: this.data.salary.payrollId
        }))
      }
    } else {
      if (this.data.updateMultiple) {
        Object.assign(salary, {payrollIds: this.salariesSelected.map(val => val.payroll.id)})
      }
      this.store.dispatch(PayrollAction.addSalary({salary: salary}))
    }
    this.store.pipe(select(selectedAddedPayroll)).subscribe(val => {
      if (val) {
        this.dialogRef.close();
      }
    });
  }

  renderTypes(){

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

  onClose() {
    this.dialogRef.close()
  }
}
