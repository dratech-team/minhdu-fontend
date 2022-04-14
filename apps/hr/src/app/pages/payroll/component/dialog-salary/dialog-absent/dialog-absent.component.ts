import {DatePipe} from '@angular/common';
import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {PartialDayEnum, Salary, SalaryPayroll} from '@minhdu-fontend/data-models';
import {DatetimeUnitEnum, partialDay, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {select, Store} from '@ngrx/store';
import {selectedAddedPayroll, selectedAddingPayroll} from '../../../+state/payroll/payroll.selector';
import {AppState} from '../../../../../reducers';
import {NzMessageService} from 'ng-zorro-antd/message';
import {selectorAllTemplate} from "../../../../template/+state/teamlate-salary/template-salary.selector";
import {SessionConstant} from "../../../constants";
import {referencesTypeConstant} from "../../../../template/constants/references-type.constant";
import {TemplateSalaryAction} from "../../../../template/+state/teamlate-salary/template-salary.action";
import {Payroll} from "../../../+state/payroll/payroll.interface";
import {PayrollAction} from "../../../+state/payroll/payroll.action";
import {map} from "rxjs/operators";
import {salaryReference} from "../../../../template/enums";
import {SalaryConstraint, SalarySetting} from "../../../../template/+state/teamlate-salary/salary-setting";
import {tranFormSalaryType} from "../../../utils";

@Component({
  templateUrl: 'dialog-absent.component.html'
})
export class DialogAbsentComponent implements OnInit {
  adding$ = this.store.select(selectedAddingPayroll)
  @Output() EmitSalariesSelected = new EventEmitter<SalaryPayroll[]>();
  templateSalaries: SalarySetting [] = []
  templateSalary$ = this.store.select(selectorAllTemplate).pipe(
    map(templates => {
      this.templateSalaries = templates.concat([{
        id: 0,
        title: 'Khác',
        type: SalaryTypeEnum.ABSENT,
        rate: 1,
        types: []
      }])
      return this.templateSalaries
    })
  )

  numberChars = new RegExp('[^0-9]', 'g');
  salaryTypeEnum = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  formGroup!: FormGroup;
  firstDayInMonth!: string | null;
  lastDayInMonth!: string | null;
  salariesSelected: SalaryPayroll[] = [];
  titleSession = SessionConstant
  partialDayEnum = PartialDayEnum
  references = referencesTypeConstant;
  indexStep = 1;
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    public readonly datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DialogAbsentComponent>,
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
    if (this.data?.salariesSelected) {
      this.salariesSelected = this.data.salariesSelected;
    }
    const salary = this.data?.salary
    this.formGroup = this.formBuilder.group({
      template: ['', Validators.required],
      rangeDay: [salary ?
        [salary.startedAt, salary.endedAt,] : [], Validators.required],
      price: [this.data?.salary?.price],
      startTime: [
        salary?.startedAt ?
          new Date(0, 0, 0, salary?.startedAt.getHours(), salary?.startedAt.getMinutes()) : undefined],
      endTime: [
        salary?.endedAt ?
          new Date(0, 0, 0, salary?.startedAt.getHours(), salary?.startedAt.getMinutes()) : undefined],
      note: [salary?.note],
      rate: ['', Validators.required],
      partialDay: [salary ? this.transFormPartial(salary.startedAt, salary.endedAt) : ''],
      constraintHoliday: [],
      constraintOvertime: [],
      reference: []
    });

    if (salary?.salarySettingId) {
      this.formGroup.get('template')?.setValue(this.getTemplateSalary(salary.salarySettingId))
    }
    this.formGroup.get('template')?.valueChanges.subscribe(template => {
      this.formGroup.get('price')?.setValue(template.price)
      if (template.constraints) {
        this.formGroup.get('constraintHoliday')?.setValue(
          this.transFormConstraintType(template.constraints, SalaryTypeEnum.HOLIDAY)
        )
        this.formGroup.get('constraintOvertime')?.setValue(
          this.transFormConstraintType(template.constraints, SalaryTypeEnum.OVERTIME)
        )
      }
      this.formGroup.get('rate')?.setValue(template.rate)
      this.formGroup.get('reference')?.setValue(template.types ? salaryReference.BLOCK : salaryReference.PRICE)
    })
    this.formGroup.get('partialDay')?.valueChanges.subscribe(item => {
      switch (item.value) {
        case PartialDayEnum.ALL_DAY:
          this.formGroup.get('startTime')?.setValue(new Date(0, 0, 0, 7, 0))
          this.formGroup.get('endTime')?.setValue(new Date(0, 0, 0, 17, 0))
          break
        case PartialDayEnum.MORNING:
          this.formGroup.get('startTime')?.setValue(new Date(0, 0, 0, 7, 0))
          this.formGroup.get('endTime')?.setValue(new Date(0, 0, 0, 11, 30))
          break
        case PartialDayEnum.AFTERNOON:
          this.formGroup.get('startTime')?.setValue(new Date(0, 0, 0, 13, 30))
          this.formGroup.get('endTime')?.setValue(new Date(0, 0, 0, 17, 0))
          break
      }
    })
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  getTemplateSalary(id: number) {
    this.templateSalaries.find(template => template.id === id)
  }

  transFormConstraintType(constraints: SalaryConstraint [], salaryTypeEnum: SalaryTypeEnum): boolean {
    return constraints.some(constraint => constraint.type == salaryTypeEnum)
  }

  transFormPartial(start: Date, end: Date): PartialDayEnum {
    const startHour = start.getHours()
    const startMinutes = start.getMinutes()
    const endHour = end.getHours()
    const endMinutes = end.getMinutes()
    if (startHour === 7 && startMinutes === 0 && endHour === 11 && endMinutes === 30) {
      return PartialDayEnum.MORNING
    } else if (startHour === 13 && startMinutes === 30 && endHour === 17 && endMinutes === 0) {
      return PartialDayEnum.AFTERNOON
    } else if (startHour === 7 && startMinutes === 0 && endHour === 17 && endMinutes === 0) {
      return PartialDayEnum.ALL_DAY
    } else {
      return PartialDayEnum.OTHER
    }
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value
    const startedAt = value.rangeDay[0]
    const endedAt = value.rangeDay[1]
    const startTime = value.startTime
    const endTime = value.endTime
    const salary = {
      type: value.template.type || value.template,
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
        endTime.getHours(),
        endTime.getMinutes()),
      note: value.note,
      salarySettingId: value.template?.id || this.data?.salary?.salarySettingId
    }
    if (this.data?.salary) {
      if (this.data?.updateMultiple) {
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
      if (this.data?.updateMultiple) {
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

  tranFormType(salaryTypes: SalaryTypeEnum[]) {
    return tranFormSalaryType(salaryTypes)
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
