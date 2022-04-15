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
import {SalarySetting} from "../../../../template/+state/teamlate-salary/salary-setting";
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
  salaryPayrolls: SalaryPayroll[] = [];
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
      multiple?: {
        salaryPayrolls?: SalaryPayroll[]
      },
      payroll: Payroll
    }
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(TemplateSalaryAction.loadALlTemplate({
      salaryType: SalaryTypeEnum.ABSENT
    }));
    if (this.data?.multiple?.salaryPayrolls) {
      this.salaryPayrolls = this.data.multiple.salaryPayrolls;
    }
    const salary = this.data?.salary
    this.formGroup = this.formBuilder.group({
      template: ['', Validators.required],
      title: [this.data.salary?.salarySettingId === 0 ? this.data.salary.title : ''],
      rangeDay: [salary ?
        [salary.startedAt, salary.endedAt] : []],
      price: [this.data?.salary?.price],
      startTime: [
        salary?.startedTime ? salary.startedTime : undefined],
      endTime: [
        salary?.endedTime ? salary.endedTime : undefined],
      note: [salary?.note],
      rate: [1],
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

  transFormConstraintType(constraints: SalaryTypeEnum [], salaryTypeEnum: SalaryTypeEnum): boolean {
    return constraints.some(constraint => constraint === salaryTypeEnum)
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
      return PartialDayEnum.CUSTOM
    }
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value
    const salary = {
      title: value.template.id === 0 ? value.title : value.template.title,
      partial: value.template.id === 0 ? PartialDayEnum.MONTH : value.partialDay.value,
      type: value.template.type,
      price: value.price || null,
      startedAt: value.rangeDay[0],
      endedAt: value.rangeDay[1],
      startTime: value.startTime,
      endTime: value.endTime,
      note: value.note,
      salarySettingId: value.template?.id || this.data?.salary?.salarySettingId,
      payrollIds: this.data.multiple ?
        [this.salaryPayrolls.map(salaryPayroll => salaryPayroll.payroll.id)] :
        [this.data.payroll.id]
    }
    if (this.data?.salary) {
      if (this.data?.multiple) {
        Object.assign(salary, {
          salaryIds: this.salaryPayrolls.map(salary => salary.salary.id)
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
      if (this.data?.multiple) {
        this.store.dispatch(PayrollAction.addSalary({salary: salary}))
      } else {
        this.store.dispatch(PayrollAction.addSalary({
          salary: salary,
          payrollId: this.data.payroll.id,
          isDetailPayroll: true
        }))

      }

    }
    this.store.pipe(select(selectedAddedPayroll)).subscribe(val => {
      if (val) {
        this.dialogRef.close();
      }
    });
  }

  tranFormType(salaryTypes: SalaryTypeEnum[]): string {
    return tranFormSalaryType(salaryTypes)
  }

  changeSalariesSelected($event: SalaryPayroll[]) {
    this.salaryPayrolls = $event;
    this.EmitSalariesSelected.emit(this.salaryPayrolls);
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
