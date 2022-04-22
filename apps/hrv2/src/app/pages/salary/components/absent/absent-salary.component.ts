import {DatePipe} from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PartialDayEnum, SalaryPayroll} from '@minhdu-fontend/data-models';
import {DatetimeUnitEnum, partialDay, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {catchError, map} from "rxjs/operators";
import {SettingSalaryActions, SettingSalaryQuery} from "../../../setting/salary/state";
import {salaryReference} from "../../../setting/salary/enums";
import {PayrollEntity} from "../../../payroll/entities";
import {ResponseSalaryEntity} from "../../entities";
import {AbsentSalaryService} from "../../service";
import {NzModalRef} from "ng-zorro-antd/modal";
import {throwError} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollActions} from "../../../payroll/state/payroll.action";
import {UnitSalaryConstant} from "../../constants";
import {SessionConstant} from "../../../payroll/constants/session.constant";
import {referencesTypeConstant} from "../../../setting/salary/constants";
import {SalarySettingEntity} from "../../../setting/salary/entities";
import {DataModalAbsentSalary} from "../../../payroll/entities/data-modal-absent-salary";
import {transFormTotalOf} from "../../../setting/salary/utils/transform-total-of.util";

@Component({
  templateUrl: 'absent-salary.component.html'
})
export class AbsentSalaryComponent implements OnInit {
  @Input() data!: DataModalAbsentSalary
  @Output() EmitSalariesSelected = new EventEmitter<SalaryPayroll[]>();
  templateSalary$ = this.settingSalaryQuery.selectAll({
    filterBy: [(entity => entity.type === SalaryTypeEnum.ABSENT)]
  }).pipe(
    map(templates => {
      templates.push({
        id: 0,
        title: 'Khác',
        type: SalaryTypeEnum.ABSENT,
        rate: 1,
        unit: DatetimeUnitEnum.MONTH,
        totalOf: []
      })
      if (this.data?.update) {
        this.formGroup.get('template')?.setValue(
          this.getTemplateSalary(templates, this.data.update.salary.setting.id))
      }
      return templates
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
  references = referencesTypeConstant;
  indexStep = 1;
  disableTimeStartConstant: number [] = []
  disableTimeEndConstant: number [] = []
  unitConstant = UnitSalaryConstant
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    public readonly datePipe: DatePipe,
    private readonly settingSalaryQuery: SettingSalaryQuery,
    private readonly formBuilder: FormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly message: NzMessageService,
    private readonly service: AbsentSalaryService,
    private readonly actions$: Actions
  ) {
  }

  ngOnInit(): void {
    this.actions$.dispatch(SettingSalaryActions.loadAll({
      search: {types: [SalaryTypeEnum.ABSENT, SalaryTypeEnum.ABSENT]}
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
      console.log(template)
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
      } else {
        this.formGroup.get('startTime')?.setValue(item.startTime)
        this.formGroup.get('endTime')?.setValue(item.endTime)
      }
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
      type: value.template.type,
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
      this.service.updateMany(salary).pipe(catchError(err => this.onSubmitError(err))).subscribe(res => {
        if (!this.data.update?.multiple) {
          if (this.data.update?.salary.id)
            this.actions$.dispatch(PayrollActions.loadOne({
              id: this.data.update.salary.id
            }))
        }
        this.onSubmitSuccess(res)
      })
    }
    if (this.data.add) {
      Object.assign(salary, {
        payrollIds: this.payrollSelected.map(payroll => payroll.id).concat(this.data.add.payroll.id)
      })
      this.service.addOne(salary).pipe(catchError(err => this.onSubmitError(err))).subscribe(
        res => {
          this.onSubmitSuccess(res)
        }
      )
    }
  }

  transformTotalOf(totalOf: SalaryTypeEnum[]): string {
    return transFormTotalOf(totalOf)
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

  onSubmitSuccess(res: ResponseSalaryEntity) {
    this.message.success(res.message)
    this.submitting = false
    this.modalRef.close()
  }

  onSubmitError(err: string) {
    this.submitting = false
    return throwError(err)
  }

  disabledHoursStart(): number[] {
    return this.disableTimeStartConstant
  }

  disabledHoursEnd(): number[] {
    return this.disableTimeEndConstant
  }
}
