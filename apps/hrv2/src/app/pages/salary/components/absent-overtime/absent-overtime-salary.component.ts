import {DatePipe} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PartialDayEnum, SalaryPayroll} from '@minhdu-fontend/data-models';
import {DatetimeUnitEnum, partialDay, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {catchError, map} from "rxjs/operators";
import {SettingSalaryActions, SettingSalaryQuery} from "../../../setting/salary/state";
import {PriceType} from "../../../setting/salary/enums";
import {PayrollEntity} from "../../../payroll/entities";
import {DeductionSalaryService, OvertimeSalaryService} from "../../service";
import {NzModalRef} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {Actions} from "@datorama/akita-ng-effects";
import {UnitSalaryConstant} from "../../constants";
import {SessionConstant, workingTime} from "../../../payroll/constants/session.constant";
import {recipesConstant} from "../../../setting/salary/constants";
import {SalarySettingEntity} from "../../../setting/salary/entities";
import {ModalAddOrUpdateOverAbsent} from "../../../payroll/entities/data-modal-absent-overtime-salary";
import {templateDeductionConstant} from "../../constants/template-deduction.constant";
import {getAfterTime, getBeforeTime} from "@minhdu-fontend/utils";
import {throwError} from "rxjs";
import {PayrollActions} from "../../../payroll/state/payroll.action";

@Component({
  templateUrl: 'absent-overtime-salary.component.html'
})
export class AbsentOvertimeSalaryComponent implements OnInit {
  @Input() data!: ModalAddOrUpdateOverAbsent
  templateSalary$ = this.settingSalaryQuery.selectAll({
    filterBy: [(entity => entity.type === this.data.type)]
  }).pipe(
    map(templates => {
      let result = templates
      if (this.data.type === SalaryTypeEnum.ABSENT) {
        result = result.concat(templateDeductionConstant)
      }
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
  recipesConstant = recipesConstant;
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
    private readonly deductionSalaryService: DeductionSalaryService,
    private readonly overtimeSalaryService: OvertimeSalaryService,
    private readonly actions$: Actions
  ) {
  }

  ngOnInit(): void {
    this.actions$.dispatch(SettingSalaryActions.loadAll({
      search: {types: [this.data.type]}
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
      isAllowance: [!!salary?.allowance],
      priceAllowance: [salary?.allowance?.price || ''],
      titleAllowance: [salary?.allowance?.title || ''],
      constraintHoliday: [],
      constraintOvertime: [],
      reference: []
    });

    this.formGroup.get('template')?.valueChanges.subscribe(template => {
      if (template?.constraints) {
        this.formGroup.get('constraintHoliday')?.setValue(template.constraints.some((item: any) => item.value === SalaryTypeEnum.HOLIDAY)
        )
        this.formGroup.get('constraintOvertime')?.setValue(template.constraints.some((item: any) => item.value === SalaryTypeEnum.HOLIDAY))
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

  getPartialDay(partial: PartialDayEnum) {
    return SessionConstant.find(item => item.value === partial)
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value
    if (value.isAllowance && (!value.priceAllowance || !value.titleAllowance)) {
      this.message.warning('chưa nhập đủ thông tin phụ cấp cho tăng ca')
    }
    const salary = this.mapSalary(value)
    this.submitting = true
    const service = this.data.type === SalaryTypeEnum.ABSENT ? this.deductionSalaryService : this.overtimeSalaryService

    if (this.data.add) {
      service.addMany(salary)
        .pipe(catchError(err => this.onSubmitError(err)))
        .subscribe(_ => {
          this.onSubmitSuccess(this.data.add?.multiple ? undefined : this.data.add?.payroll.id)
        })
    } else {
      service.updateMany(salary)
        .pipe(catchError(err => {
          this.submitting = false
          return throwError(err)
        }))
        .subscribe(_ => {
          this.onSubmitSuccess(this.data.update?.salary.payrollId)
        })
    }
  }


  mapSalary(value: any) {
    const salary = {
      rate: value.rate,
      title: value.template.id === 0 ? value.title : value.template.title,
      partial: value.template.id === 0 ? PartialDayEnum.CUSTOM : value.partialDay.value,
      unit: value.unit,
      price: value.price,
      note: value.note,
      startedAt: value.rangeDay[0],
      endedAt: value.rangeDay[1],
      startTime: value.startTime ? new Date(value.startTime) : null,
      endTime: value.endTime ? new Date(value.endTime) : null,
      settingId: value.template?.id,
    }

    if (this.data.type === SalaryTypeEnum.ABSENT) {
      if (value.template.id === 0) {
        delete salary.settingId
      }
    }

    return Object.assign(salary, this.data.add
      ? {payrollIds: this.payrollSelected.map(payroll => payroll.id).concat(this.data.add.payroll.id)}
      : {}, this.data.update
      ? {salaryIds: this.salaryPayrolls.map(salary => salary.salary.id).concat(this.data.update.salary.id)}
      : {}, value.priceAllowance && value.titleAllowance
      ? {
        allowance: {
          price: value.priceAllowance,
          title: value.titleAllowance
        }
      }
      : {}
    )
  }

  pre(): void {
    this.indexStep -= 1;
  }

  next(): void {
    this.indexStep += 1;
  }

  onSubmitError(err: string) {
    this.submitting = false
    return throwError(err)
  }

  onSubmitSuccess(payrollId?: number) {
    if (payrollId) {
      this.actions$.dispatch(PayrollActions.loadOne({
        id: payrollId
      }))
    }
    this.submitting = false
    this.modalRef.close()
  }
}
