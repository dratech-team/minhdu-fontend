import {DatePipe} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PartialDayEnum} from '@minhdu-fontend/data-models';
import {DatetimeUnitEnum, EmployeeType, partialDay, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {catchError, map} from 'rxjs/operators';
import {SettingSalaryActions, SettingSalaryQuery} from '../../../setting/salary/state';
import {PriceType} from '../../../setting/salary/enums';
import {AbsentSalaryService, OvertimeSalaryService} from '../../service';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Actions} from '@datorama/akita-ng-effects';
import {UnitSalaryConstant} from '../../constants';
import {SessionConstant, workingTime} from '../../../../../shared/constants';
import {recipesConstant} from '../../../setting/salary/constants';
import {SalarySettingEntity} from '../../../setting/salary/entities';
import {getAfterTime, getBeforeTime, getFirstDayInMonth, getLastDayInMonth} from '@minhdu-fontend/utils';
import {throwError} from 'rxjs';
import {PayrollActions} from '../../../payroll/state/payroll.action';
import {ModalAddOrUpdateAbsentOrOvertime} from '../../../payroll/data';
import {ResponseMessageEntity} from '@minhdu-fontend/base-entity';
import * as moment from "moment";
import {validateDayInMonth} from "../../utils/validate-day-in-month.util";

@Component({
  templateUrl: 'absent-overtime-salary.component.html'
})
export class AbsentOvertimeSalaryComponent implements OnInit {
  @Input() data!: ModalAddOrUpdateAbsentOrOvertime;

  formGroup!: FormGroup;

  templateSalaries$ = this.settingSalaryQuery.selectAll({
    filterBy: [(entity => entity.type === this.data.type)]
  }).pipe(
    map(templates => {
      if (this.data.update?.salary?.setting) {
        this.formGroup.get('template')?.setValue(
          this.getTemplateSalary(templates, this.data.update.salary.setting.id));
      }
      return templates;
    })
  );
  settingsLoading$ = this.settingSalaryQuery.select(state => state.loading);

  limitStartHour: number [] = [];
  limitEndTime: number [] = [];

  indexStep = 0;
  submitting = false;

  titleSession = SessionConstant;
  partialDayEnum = PartialDayEnum;
  recipesConstant = recipesConstant;
  unitConstant = UnitSalaryConstant;
  salaryTypeEnum = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  fistDateInMonth!: Date
  employeeType = EmployeeType

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);
  disabledHoursStart = (): number[] => {
    return this.limitStartHour;
  };
  disabledMinute = (hour: number): number[] => {
    if (hour === workingTime.afternoon.end.getHours()) {
      return getAfterTime(0, 'MINUTE');
    } else {
      return [];
    }
  };
  disabledHoursEnd = (): number[] => {
    return this.limitEndTime;
  };

  disableApprenticeDate = (cur: Date): boolean => {
    return validateDayInMonth(cur, this.fistDateInMonth)
  };

  constructor(
    public readonly datePipe: DatePipe,
    private readonly settingSalaryQuery: SettingSalaryQuery,
    private readonly formBuilder: FormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly message: NzMessageService,
    private readonly absentSalaryService: AbsentSalaryService,
    private readonly overtimeSalaryService: OvertimeSalaryService,
    private readonly actions$: Actions
  ) {
  }

  ngOnInit(): void {
    this.fistDateInMonth = getFirstDayInMonth(
      new Date(this.data.add ? this.data.add.payroll.createdAt : this.data.update.salary.startedAt || new Date())
    )
    this.actions$.dispatch(SettingSalaryActions.loadAll({
      search: {types: [this.data.type]}
    }));
    const salary = this.data?.update?.salary;
    this.formGroup = this.formBuilder.group({
      template: ['', Validators.required],
      title: [salary?.title],
      rangeDay: [salary
        ? [salary.startedAt, salary.endedAt]
        : [this.fistDateInMonth, getLastDayInMonth(this.fistDateInMonth)]
        , Validators.required],
      price: [salary?.price],
      startTime: [salary?.startTime ? new Date(salary.startTime) : undefined],
      endTime: [salary?.endTime ? new Date(salary.endTime) : undefined],
      note: [salary?.note],
      rate: [1],
      unit: [salary?.setting?.unit ? salary.setting.unit : DatetimeUnitEnum.MONTH],
      partialDay: [salary?.partial ? this.getPartialDay(salary.partial) : ''],
      isAllowance: [!!salary?.allowance],
      priceAllowance: [salary?.allowance?.price || ''],
      titleAllowance: [salary?.allowance?.title || ''],
      constraintHoliday: [],
      constraintOvertime: [],
      hasConstraints: [],
      reference: [],
      payrollIds: [this.data.add ? [this.data.add.payroll.id] : []],
      salaryIds: [this.data.update?.multiple?.salaries.map(item => item.id)],
    });

    this.formGroup.get('template')?.valueChanges.subscribe(template => {
      if (template) {
        this.formGroup.get('constraintHoliday')?.setValue(template?.constraints?.some((item: any) => item.value === SalaryTypeEnum.HOLIDAY));
        this.formGroup.get('constraintOvertime')?.setValue(template?.constraints?.some((item: any) => item.value === SalaryTypeEnum.HOLIDAY));
        this.formGroup.get('rate')?.setValue(template?.rate);
        this.formGroup.get('unit')?.setValue(template?.unit);
        this.formGroup.get('reference')?.setValue(template?.totalOf.length > 0 ? PriceType.BLOCK : PriceType.PRICE);
        if (template.type === SalaryTypeEnum.OVERTIME) {
          this.formGroup.get('hasConstraints')?.setValue(template?.hasConstraints);
        }
      }
    });

    this.formGroup.get('startTime')?.valueChanges.subscribe(val => {
      if (val) {
        this.limitEndTime = getBeforeTime(val.getHours()).concat(
          getAfterTime(this.formGroup.get('partialDay')?.value.endTime.getHours(), 'HOUR')
        );
        if (this.formGroup.value.endTime && val.getTime() > this.formGroup.value.endTime.getTime()) {
          this.formGroup.get('endTime')?.setValue(undefined);
        }
      }
    });

    this.formGroup.get('partialDay')?.valueChanges.subscribe(item => {
      this.formGroup.get('startTime')?.setValue(item.startTime);
      this.formGroup.get('endTime')?.setValue(item.endTime);
      this.limitStartHour = getBeforeTime(item.startTime.getHours())
        .concat(getAfterTime(item.endTime.getHours(), 'HOUR'));
    });
  }


  get checkValid() {
    return this.formGroup.controls;
  }

  getTemplateSalary(template: SalarySettingEntity[], id: number) {
    return template.find(item => item.id === id);
  }

  getPartialDay(partial: PartialDayEnum) {
    return SessionConstant.find(item => item.value === partial);
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    if (value.isAllowance && (!value.priceAllowance || !value.titleAllowance)) {
      return this.message.warning('Chưa nhập đủ thông tin phụ cấp cho tăng ca');
    }
    const salary = this.mapSalary(value);
    this.submitting = true;
    const service = this.data.type === SalaryTypeEnum.ABSENT ? this.absentSalaryService : this.overtimeSalaryService;
    (this.data.add
        ? service.addMany(salary)
        : service.updateMany(salary)
    )
      .pipe(catchError(err => {
        this.submitting = false;
        return this.onSubmitError(err);
      }))
      .subscribe(res => {
        this.onSubmitSuccess(res, this.data.add
          ? (
            !this.data.add?.multiple
              ? this.data.add?.payroll.id
              : undefined
          )
          : (!this.data.update.multiple
            ? this.data.update.salary.payrollId
            : undefined)
        );
      });
  }


  mapSalary(value: any) {
    const salary = {
      rate: value.rate,
      title: value.template.title,
      partial: value.partialDay.value,
      price: value.price,
      note: value.note,
      startedAt: moment(value.rangeDay[0]).set(
        {
          hours: new Date().getHours(),
          minutes: new Date().getMinutes(),
          seconds: new Date().getSeconds()
        }
      ).toDate(),
      endedAt: moment(value.rangeDay[1]).set(
        {
          hours: new Date().getHours(),
          minutes: new Date().getMinutes(),
          seconds: new Date().getSeconds()
        }
      ).toDate(),
      startTime: value.startTime ? new Date(value.startTime) : null,
      endTime: value.endTime ? new Date(value.endTime) : null,
      settingId: value.template?.id
    };

    return Object.assign(salary,
      this.data.update
        ? this.data.update.multiple
          ? {salaryIds: value.salaryIds}
          : this.data.update.multiple
            ? {salaryIds: value.salaryIds}
            : {salaryIds: [this.data.update.salary.id]}
        : {payrollIds: value.payrollIds},
      value.priceAllowance && value.titleAllowance
        ? {
          allowance: {
            price: value.priceAllowance,
            title: value.titleAllowance
          }
        }
        : {}
    );
  }

  move(type: 'next' | 'previous'): void {
    if (this.formGroup.invalid) {
      return
    }
    type === "next" ? this.indexStep += 1 : this.indexStep -= 1
  }

  private onSubmitError(err: string) {
    this.submitting = false;
    return throwError(err);
  }

  private onSubmitSuccess(res: ResponseMessageEntity, payrollId?: number) {
    this.message.success(res.message);
    if (payrollId) {
      this.actions$.dispatch(PayrollActions.loadOne({id: payrollId}));
    }
    this.submitting = false;
    this.modalRef.close(this.formGroup.value.template.title);
  }
}
