import {DatePipe} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PartialDayEnum, SalaryPayroll} from '@minhdu-fontend/data-models';
import {DatetimeUnitEnum, partialDay, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {catchError, map} from "rxjs/operators";
import {SettingSalaryActions, SettingSalaryQuery} from "../../../setting/salary/state";
import {PriceType} from "../../../setting/salary/enums";
import {PayrollEntity} from "../../../payroll/entities";
import {DeductionSalaryService} from "../../service";
import {NzModalRef} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {Actions} from "@datorama/akita-ng-effects";
import {UnitSalaryConstant} from "../../constants";
import {SessionConstant, workingTime} from "../../../payroll/constants/session.constant";
import {referencesConstant} from "../../../setting/salary/constants";
import {SalarySettingEntity} from "../../../setting/salary/entities";
import {DataModalAbsentSalary} from "../../../payroll/entities/data-modal-absent-salary";
import {transFormTotalOf} from "../../../setting/salary/utils/transform-total-of.util";
import {templateDeductionConstant} from "../../constants/template-deduction.constant";
import {getAfterTime, getBeforeTime} from "@minhdu-fontend/utils";
import {throwError} from "rxjs";

@Component({
  templateUrl: 'deduction-salary.component.html'
})
export class DeductionSalaryComponent implements OnInit {
  @Input() data!: DataModalAbsentSalary
  templateSalary$ = this.settingSalaryQuery.selectAll({
    filterBy: [(entity => entity.type === SalaryTypeEnum.ABSENT)]
  }).pipe(
    map(templates => {
      const result = templates.concat(templateDeductionConstant)
      if (this.data?.update) {
        this.formGroup.get('template')?.setValue(
          this.getTemplateSalary(result, this.data.update.salary.setting.id))
      }
      return result
    })
  )
  submitting = false
  salaryTypeEnum = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  formGroup!: FormGroup;
  firstDayInMonth!: string | null;
  lastDayInMonth!: string | null;
  salaryPayrolls: SalaryPayroll[] = [];
  payrollSelected: PayrollEntity[] = []
  titleSession = SessionConstant
  partialDayEnum = PartialDayEnum
  references = referencesConstant;
  indexStep = 1;
  limitStartHour: number [] = [];
  limitEndTime: number [] = []
  unitConstant = UnitSalaryConstant
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);
  disabledHoursStart = (): number[] => {
    return this.limitStartHour
  }
  disabledMinute = (hour: number): number[] => {
    if (hour === workingTime.afternoon.end.getHours()) {
      return getAfterTime(0, 'MINUTE')
    } else {
      return []
    }
  }
  disabledHoursEnd = (): number[] => {
    return this.limitEndTime
  }

  constructor(
    public readonly datePipe: DatePipe,
    private readonly settingSalaryQuery: SettingSalaryQuery,
    private readonly formBuilder: FormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly message: NzMessageService,
    private readonly service: DeductionSalaryService,
    private readonly actions$: Actions
  ) {
  }

  ngOnInit(): void {
    this.actions$.dispatch(SettingSalaryActions.loadAll({
      search: {types: [SalaryTypeEnum.ABSENT]}
    }))
    if (this.data?.update?.multiple) {
      this.salaryPayrolls = this.data.update.multiple.salaryPayrolls;
    }
    const salary = this.data?.update?.salary
    this.formGroup = this.formBuilder.group({
      template: ['', Validators.required],
      title: [salary?.title],
      rangeDay: [salary ?
        [salary.startedAt, salary.endedAt] : []],
      price: [salary?.price],
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
      this.formGroup.get('reference')?.setValue(template?.types ? PriceType.BLOCK : PriceType.PRICE)
    })

    this.formGroup.get('startTime')?.valueChanges.subscribe(val => {
      if (val) {
        this.limitEndTime = getBeforeTime(val.getHours()).concat(getAfterTime(workingTime.afternoon.end.getHours(), "HOUR"))
        if (this.formGroup.value.endTime && val.getTime() > this.formGroup.value.endTime.getTime()) {
          this.formGroup.get('endTime')?.setValue(undefined)
        }
      }
    })

    this.formGroup.get('partialDay')?.valueChanges.subscribe(item => {
      this.formGroup.get('startTime')?.setValue(item.startTime)
      this.formGroup.get('endTime')?.setValue(item.endTime)
      this.limitStartHour = getBeforeTime(item.startTime.getHours())
        .concat(getAfterTime(item.endTime.getHours(), 'HOUR'));
    })
  }


  get checkValid() {
    return this.formGroup.controls;
  }

  getTemplateSalary(template: SalarySettingEntity[], id?: number,) {
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
      unit: value.unit,
      price: value.price,
      note: value.note,
    }
    if (value.template.id !== 0) {
      Object.assign(salary, {
        startedAt: value.rangeDay[0],
        endedAt: value.rangeDay[1],
        startTime: value.startTime ? new Date(value.startTime) : null,
        endTime: value.endTime ? new Date(value.endTime) : null,
        settingId: value.template?.id,
      })
    }
    this.submitting = true
    if (this.data?.update) {
      Object.assign(salary, {
        salaryIds: this.salaryPayrolls.map(salary => salary.salary.id).concat(this.data.update.salary.id)
      })
      this.service.updateMany(
        salary, this.data.update.multiple ? undefined : {payrollId: this.data.update.salary.payrollId}
      ).pipe(catchError(err => {
        this.submitting = false
        return throwError(err)
      })).subscribe(res => {
        this.onSubmitSuccess()
      })
    }

    if (this.data.add) {
      Object.assign(salary, {
        payrollIds: this.payrollSelected.map(payroll => payroll.id).concat(this.data.add.payroll.id)
      })
      this.service.addMany(
        salary, this.data.add?.multiple ? undefined : {payrollId: this.data.add.payroll.id}).pipe(
        catchError(err => {
          this.submitting = false
          return throwError(err)
        })
      ).subscribe(_ => {
        this.onSubmitSuccess()
      })
    }
  }

  transformTotalOf(totalOf: SalaryTypeEnum[]): string {
    return transFormTotalOf(totalOf)
  }

  pre(): void {
    this.indexStep -= 1;
  }

  next(): void {
    this.indexStep += 1;
  }

  onSubmitSuccess() {
    this.submitting = false
    this.modalRef.close()
  }
}
