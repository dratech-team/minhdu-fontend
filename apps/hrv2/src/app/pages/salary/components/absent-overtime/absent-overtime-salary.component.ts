import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { PartialDayEnum } from '@minhdu-fontend/data-models';
import {
  DatetimeUnitEnum,
  EmployeeType,
  ModeEnum,
  partialDay,
  SalaryTypeEnum,
} from '@minhdu-fontend/enums';
import { catchError, map } from 'rxjs/operators';
import {
  SettingSalaryActions,
  SettingSalaryQuery,
} from '../../../setting/salary/state';
import { PriceType } from '../../../setting/salary/enums';
import { AbsentSalaryService, OvertimeSalaryService } from '../../service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Actions } from '@datorama/akita-ng-effects';
import { UnitSalaryConstant } from '../../constants';
import { SessionConstant, workingTime } from '../../../../../shared/constants';
import { recipesConstant } from '../../../setting/salary/constants';
import { SalarySettingEntity } from '../../../setting/salary/entities';
import {
  getAfterTime,
  getBeforeTime,
  getFirstDayInMonth,
} from '@minhdu-fontend/utils';
import { throwError } from 'rxjs';
import { PayrollActions } from '../../../payroll/state/payroll.action';
import { ResponseMessageEntity } from '@minhdu-fontend/base-entity';
import * as moment from 'moment';
import { validateDayInMonth } from '../../utils/validate-day-in-month.util';
import { PayrollQuery } from '../../../payroll/state';
import { SessionEntity } from '../../../../../shared/entities';
import { ModalAddOrUpdateAbsentOrOvertime } from '../../data';
import { RateConditionConstant } from '../../../setting/salary/constants/rate-condition.constant';
import { ConditionConstant } from '../../../setting/salary/constants/condition.constant';
import { AccountQuery } from '../../../../../../../../libs/system/src/lib/state/account-management/account.query';

@Component({
  templateUrl: 'absent-overtime-salary.component.html',
})
export class AbsentOvertimeSalaryComponent implements OnInit {
  @Input() data!: ModalAddOrUpdateAbsentOrOvertime;
  currentUser$ = this.accountQuery.selectCurrentUser();
  settingsLoading$ = this.settingSalaryQuery.select((state) => state.loading);
  templateSalaries$ = this.settingSalaryQuery
    .selectAll({
      filterBy: [(entity) => entity.type === this.data.type],
    })
    .pipe(
      map((templates) => {
        if (
          this.data.update?.salary?.setting ||
          this.data.add?.salary?.setting
        ) {
          this.formGroup
            .get('template')
            ?.setValue(
              this.getTemplateSalary(
                templates,
                this.data.update?.salary.setting.id ||
                  this.data.add?.salary?.setting.id
              )
            );
        }
        return templates;
      })
    );

  limitStartHour: number[] = [];
  limitEndTime: number[] = [];

  indexStep = 0;
  submitting = false;

  titleSession: SessionEntity[] = [];
  conditionConstant = ConditionConstant;
  rateConditionConstant = RateConditionConstant;
  partialDayEnum = PartialDayEnum;
  recipesConstant = recipesConstant;
  unitConstant = UnitSalaryConstant;
  salaryTypeEnum = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  fistDateInMonth!: Date;
  employeeType = EmployeeType;
  modeEnum = ModeEnum;

  formGroup!: UntypedFormGroup;

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);
  disabledHoursStart = (): number[] => this.limitStartHour;
  disabledMinute = (hour: number): number[] =>
    hour === workingTime.afternoon.end.getHours()
      ? getAfterTime(0, 'MINUTE')
      : [];
  disabledHoursEnd = (): number[] => this.limitEndTime;
  disableApprenticeDate = (cur: Date): boolean =>
    validateDayInMonth(cur, this.fistDateInMonth);

  constructor(
    public readonly datePipe: DatePipe,
    private readonly settingSalaryQuery: SettingSalaryQuery,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly message: NzMessageService,
    private readonly absentSalaryService: AbsentSalaryService,
    private readonly overtimeSalaryService: OvertimeSalaryService,
    private readonly actions$: Actions,
    private readonly payrollQuery: PayrollQuery,
    private readonly accountQuery: AccountQuery
  ) {}

  ngOnInit(): void {
    this.titleSession = SessionConstant.filter((item) =>
      item.types.includes(this.data.type)
    );
    this.fistDateInMonth = getFirstDayInMonth(
      new Date(
        this.data.add
          ? this.data.add.payroll?.createdAt ||
            this.payrollQuery.getValue().search.startedAt
          : this.data.update.salary.startedAt ||
            this.payrollQuery.getValue().search.startedAt
      )
    );
    this.actions$.dispatch(
      SettingSalaryActions.loadAll({
        search: { types: [this.data.type] },
      })
    );
    const salary = this.data.add?.salary || this.data?.update?.salary;
    this.formGroup = this.formBuilder.group({
      template: ['', Validators.required],
      title: [salary?.title],
      // FIXME : khi th??m salary, init ng??y b???t ?????u ?????  khi ch???n ng??y l???ch s??? n???m trong th??ng c???a phi???u l????ng ( v?? ??ang ch???n ch???n ng??y kh??c th??ng phi???u l????ng)
      rangeDay: [
        salary && this.data.update
          ? [salary.startedAt, salary.endedAt]
          : [this.fistDateInMonth],
        Validators.required,
      ],
      price: [salary?.price],
      startTime: [salary?.startTime ? new Date(salary.startTime) : undefined],
      endTime: [salary?.endTime ? new Date(salary.endTime) : undefined],
      note: [salary?.note],
      rate: [1],
      unit: [
        salary?.setting?.unit ? salary.setting.unit : DatetimeUnitEnum.MONTH,
      ],
      partialDay: [salary?.partial ? this.getPartialDay(salary.partial) : ''],
      isAllowance: [salary?.allowances && salary.allowances.length > 0],
      priceAllowance: [
        salary?.allowances && salary.allowances.length > 0
          ? salary.allowances[0].price
          : '',
      ],
      titleAllowance: [
        salary?.allowances && salary.allowances.length > 0
          ? salary.allowances[0].title
          : '',
      ],
      constraintHoliday: [],
      constraintOvertime: [],
      rateCondition: [],
      reference: [],
      payrollIds: [this.data.add?.payroll ? [this.data.add.payroll?.id] : []],
      salaryIds: [this.data.update?.multiple?.salaries.map((item) => item.id)],
    });

    this.formGroup.get('template')?.valueChanges.subscribe((template) => {
      if (template) {
        this.formGroup
          .get('constraintHoliday')
          ?.setValue(
            template?.constraints?.some(
              (item: any) => item.value === SalaryTypeEnum.HOLIDAY
            )
          );
        this.formGroup
          .get('constraintOvertime')
          ?.setValue(
            template?.constraints?.some(
              (item: any) => item.value === SalaryTypeEnum.HOLIDAY
            )
          );
        this.formGroup.get('rate')?.setValue(template?.rate);
        this.formGroup.get('unit')?.setValue(template?.unit);
        this.formGroup
          .get('reference')
          ?.setValue(
            template?.totalOf.length > 0 ? PriceType.BLOCK : PriceType.PRICE
          );
        this.formGroup.get('rateCondition')?.setValue(template?.rateCondition);
      }
    });

    this.formGroup.get('startTime')?.valueChanges.subscribe((val) => {
      if (val) {
        this.limitEndTime = getBeforeTime(val.getHours()).concat(
          getAfterTime(
            this.formGroup.get('partialDay')?.value.endTime.getHours(),
            'HOUR'
          )
        );
        if (
          this.formGroup.value.endTime &&
          val.getTime() > this.formGroup.value.endTime.getTime()
        ) {
          this.formGroup.get('endTime')?.setValue(undefined);
        }
      }
    });

    this.formGroup.get('partialDay')?.valueChanges.subscribe((item) => {
      this.formGroup.get('startTime')?.setValue(item.startTime);
      this.formGroup.get('endTime')?.setValue(item.endTime);
      this.limitStartHour = getBeforeTime(item.startTime.getHours()).concat(
        getAfterTime(item.endTime.getHours(), 'HOUR')
      );
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  getTemplateSalary(template: SalarySettingEntity[], id: number | undefined) {
    return id ? template.find((item) => item.id === id) : '';
  }

  getPartialDay = (partial: PartialDayEnum) =>
    SessionConstant.find((item) => item.value === partial);

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    if (this.data.add?.multiple && value.payrollIds.length === 0) {
      return this.message.warning('Ch??a ch???n nh??n vi??n');
    }
    if (value.isAllowance && (!value.priceAllowance || !value.titleAllowance)) {
      return this.message.warning('Ch??a nh???p ????? th??ng tin ph??? c???p cho t??ng ca');
    }
    const salary = this.mapSalary(value);
    this.submitting = true;
    const service =
      this.data.type === SalaryTypeEnum.ABSENT
        ? this.absentSalaryService
        : this.overtimeSalaryService;
    (this.data.add ? service.addMany(salary) : service.updateMany(salary))
      .pipe(
        catchError((err) => {
          this.submitting = false;
          return this.onSubmitError(err);
        })
      )
      .subscribe((res) => {
        this.onSubmitSuccess(res);
      });
  }

  move(type: 'next' | 'previous'): void {
    if (this.formGroup.invalid) {
      return;
    }
    type === 'next' ? (this.indexStep += 1) : (this.indexStep -= 1);
  }

  private mapSalary(value: any) {
    const salary = {
      rate: value.rate,
      title: value.template.title,
      partial: value.partialDay.value,
      price: value.price,
      note: value.note,
      startedAt: moment(value.rangeDay[0])
        .set({
          hours: new Date().getHours(),
          minutes: new Date().getMinutes(),
          seconds: new Date().getSeconds(),
        })
        .toDate(),
      endedAt: moment(value.rangeDay[1])
        .set({
          hours: new Date().getHours(),
          minutes: new Date().getMinutes(),
          seconds: new Date().getSeconds(),
        })
        .toDate(),
      startTime: value.startTime ? new Date(value.startTime) : null,
      endTime: value.endTime ? new Date(value.endTime) : null,
      settingId: value.template?.id,
    };

    return Object.assign(
      salary,
      this.data.update
        ? this.data.update.multiple
          ? { salaryIds: value.salaryIds }
          : this.data.update.multiple
          ? { salaryIds: value.salaryIds }
          : { salaryIds: [this.data.update.salary.id] }
        : { payrollIds: value.payrollIds },
      value.isAllowance &&
        value.priceAllowance &&
        value.titleAllowance &&
        this.data.add
        ? {
            allowances: {
              price: value.priceAllowance,
              title: value.titleAllowance,
            },
          }
        : value.isAllowance &&
          value.priceAllowance &&
          value.titleAllowance &&
          this.data.update?.salary.allowances
        ? {
            allowances: {
              id: this.data.update.salary?.allowances[0]?.id,
              price: value.priceAllowance,
              title: value.titleAllowance,
            },
          }
        : {}
    );
  }

  private onSubmitError(err: string) {
    this.submitting = false;
    return throwError(err);
  }

  private onSubmitSuccess(res: ResponseMessageEntity) {
    this.message.success(res.message);
    this.submitting = false;
    this.modalRef.close(this.formGroup.value.template.title);
  }
}
