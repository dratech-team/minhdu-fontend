import {DatePipe} from '@angular/common';
import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {PartialDayEnum, Salary, SalaryPayroll} from '@minhdu-fontend/data-models';
import {DatetimeUnitEnum, partialDay, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {select, Store} from '@ngrx/store';
import {selectedAddedPayroll, selectedAddingPayroll} from '../../../+state/payroll/payroll.selector';
import {AppState} from '../../../../../reducers';
import {selectorAllTemplate} from "../../../../template/+state/teamlate-salary/template-salary.selector";
import {DisableTimeConstant, SessionConstant} from "../../../constants";
import {referencesTypeConstant} from "../../../../template/constants/references-type.constant";
import {TemplateSalaryAction} from "../../../../template/+state/teamlate-salary/template-salary.action";
import {Payroll} from "../../../+state/payroll/payroll.interface";
import {PayrollAction} from "../../../+state/payroll/payroll.action";
import {map} from "rxjs/operators";
import {salaryReference} from "../../../../template/enums";
import {tranFormSalaryType} from "../../../utils";
import {UnitSalaryConstant} from "../../../../template/constants/unit-salary.constant";
import {SalarySetting} from "../../../../template/+state/teamlate-salary/salary-setting";

@Component({
  templateUrl: 'dialog-absent.component.html'
})
export class DialogAbsentComponent implements OnInit {
  adding$ = this.store.select(selectedAddingPayroll)
  @Output() EmitSalariesSelected = new EventEmitter<SalaryPayroll[]>();
  templateSalary$ = this.store.select(selectorAllTemplate).pipe(
    map(templates => {
      templates.push({
        id: 0,
        title: 'Khác',
        type: SalaryTypeEnum.ABSENT,
        rate: 1,
        unit: DatetimeUnitEnum.MONTH,
        types: []
      })
      if (this.data?.salary) {
        this.formGroup.get('template')?.setValue(
          this.getTemplateSalary( templates,this.data.salary.settingId))
      }
      return templates
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
  disableTimeStartConstant: number [] = []
  disableTimeEndConstant: number [] = []
  unitConstant = UnitSalaryConstant
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    public readonly datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DialogAbsentComponent>,
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
      title: [this.data?.salary?.title],
      rangeDay: [salary ?
        [salary.startedAt, salary.endedAt] : []],
      price: [this.data?.salary?.price],
      startTime: [salary?.startedAt ? new Date(salary.startedAt) : undefined],
      endTime: [salary?.endedAt ? new Date(salary.endedAt) : undefined],
      note: [salary?.note],
      rate: [1],
      unit: [salary?.unit ? salary.unit : DatetimeUnitEnum.MONTH],
      partialDay: [salary?.partial ? this.getPartialDay(salary.partial) : ''],
      constraintHoliday: [],
      constraintOvertime: [],
      reference: []
    });

    this.formGroup.get('template')?.valueChanges.subscribe(template => {
      if (template?.constraints) {
        this.formGroup.get('constraintHoliday')?.setValue(
          this.transFormConstraintType(template.constraints, SalaryTypeEnum.HOLIDAY)
        )
        this.formGroup.get('constraintOvertime')?.setValue(
          this.transFormConstraintType(template.constraints, SalaryTypeEnum.OVERTIME)
        )
      }
      this.formGroup.get('rate')?.setValue(template?.rate)
      this.formGroup.get('unit')?.setValue(template?.unit)
      this.formGroup.get('reference')?.setValue(template?.types ? salaryReference.BLOCK : salaryReference.PRICE)
    })

    this.formGroup.get('partialDay')?.valueChanges.subscribe(item => {
      if (item.value === PartialDayEnum.CUSTOM) {
        this.disableTimeStartConstant = [...DisableTimeConstant]
        this.disableTimeEndConstant = [...DisableTimeConstant]
      } else {
        this.formGroup.get('startTime')?.setValue(item.startTime)
        this.formGroup.get('endTime')?.setValue(item.endTime)
      }
    })
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  getTemplateSalary(template: SalarySetting[], id?: number,) {
  return template.find(item => item.id === (id ? id : 0))
  }

  transFormConstraintType(constraints: SalaryTypeEnum [], salaryTypeEnum: SalaryTypeEnum): boolean {
    return constraints.some(constraint => constraint === salaryTypeEnum)
  }

  getPartialDay(partial: PartialDayEnum) {
    return SessionConstant.find(item => item.value === partial)
  }


  onSubmit(): any {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value
    const salary = {
      rate: value.rate,
      title: value.template.id === 0 ? value.title : value.template.title,
      partial: value.template.id === 0 ? PartialDayEnum.CUSTOM : value.partialDay.value,
      type: value.template.type,
      startedAt: value.rangeDay[0],
      endedAt: value.rangeDay[1],
      startTime: value.startTime ? new Date(value.startTime) : null,
      endTime: value.endTime ? new Date(value.endTime) : null,
      unit: value.unit,
      price: value.price,
      note: value.note,
      settingId: value.template?.id,
    }
    if (this.data?.salary) {
      Object.assign(salary, {
        salaryIds: this.salaryPayrolls.map(salary => salary.salary.id).concat(this.data.salary.id)
      })
      this.store.dispatch(PayrollAction.updateSalary({
        salary,
        multiple: true
      }))
    } else {
      Object.assign(salary , {
        payrollIds: this.data.multiple ?
          [this.salaryPayrolls.map(salaryPayroll => salaryPayroll.payroll.id)] :
          [this.data.payroll.id]
      })
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

  disabledHoursStart(): number[] {
    return this.disableTimeStartConstant
  }

  disabledHoursEnd(): number[] {
    return this.disableTimeEndConstant
  }
}
