import {DatePipe} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {DatetimeUnitEnum, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {isEqualDatetime} from 'libs/utils/daytime.until';
import {SalaryPayroll} from '@minhdu-fontend/data-models';
import {AllowanceSalaryService} from '../../service/allowance-salary.service';
import {PayrollEntity} from '../../../payroll/entities';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {differenceInCalendarDays} from 'date-fns';
import * as moment from 'moment';
import {Actions} from '@datorama/akita-ng-effects';
import {PayrollActions} from '../../../payroll/state/payroll.action';
import {ResponseMessageEntity} from '@minhdu-fontend/base-entity';
import {ModalAddOrUpdateAllowance} from '../../../payroll/data';
import {RequireOnlyOne} from "../../../../../shared/types";

@Component({
  templateUrl: 'allowance-salary.component.html'
})
export class AllowanceSalaryComponent implements OnInit {
  @Input() data!: ModalAddOrUpdateAllowance;
  salaryTypeEnum = SalaryTypeEnum;
  datetimeEnum = DatetimeUnitEnum;
  formGroup!: FormGroup;
  isApprentice = false;
  salariesSelected: SalaryPayroll [] = [];
  payrollSelected: PayrollEntity [] = [];
  indexStep = 0;
  submitting = false;
  disableApprenticeDate = (cur: Date): boolean => {
    if (this.data.add) {
      const workedAt = this.data.add.payroll.employee.workedAt;
      return !((differenceInCalendarDays(cur, moment(workedAt).add(-1, 'days').toDate()) > 0 &&
        (differenceInCalendarDays(cur, moment(workedAt).endOf('month').add(1, 'days').toDate()) < 0)
      ));
    } else {
      const workedAt = this.data.update.salary.workedAt;
      return !((differenceInCalendarDays(cur, moment(workedAt).add(-1, 'days').toDate()) > 0 &&
        (differenceInCalendarDays(cur, moment(workedAt).endOf('month').add(1, 'days').toDate()) < 0)
      ));
    }
  };

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly formBuilder: FormBuilder,
    private readonly service: AllowanceSalaryService,
    private readonly message: NzMessageService,
    private readonly modalRef: NzModalRef,
    private readonly actions$: Actions
  ) {
  }

  ngOnInit(): void {

    if (this.data.add) {
      this.indexStep = 1;
    }
    if (this.data.update?.multiple) {
      this.salariesSelected = [...this.data.update.multiple.salariesSelected];
    }
    const salary = this.data.update?.salary;
    const payroll = this.data.add?.payroll;
    this.formGroup = this.formBuilder.group({
      title: [salary?.title, Validators.required],
      unit: [salary?.unit, Validators.required],
      price: [salary?.price, Validators.required],
      note: [salary?.note],
      datetime: [salary?.datetime || payroll?.createdAt],
      rate: [salary?.rate || 1],
      isAllDay: [true]
    });

    this.formGroup.get('unit')?.valueChanges.subscribe(unit => {
      switch (unit) {
        case DatetimeUnitEnum.DAY:
          this.formGroup.get('datetime')?.setValue('');
          break;
        case DatetimeUnitEnum.MONTH:
          this.formGroup.get('datetime')?.setValue(this.data.add?.payroll.createdAt);
      }
    });
  }

  isShowDatePicker(): boolean {
    if (this.data.add) {
      return isEqualDatetime(this.data.add.payroll.employee.workedAt, this.data.add.payroll.createdAt, 'month');
    } else {
      return isEqualDatetime(this.data.update.salary.workedAt, this.data.update.salary.datetime, 'month');
    }
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const salary = this.mapSalary(value);
    (this.data.add ? this.service.addMany(salary) : this.service.updateMany(salary))
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
      title: value.title,
      price: value.price,
      type: SalaryTypeEnum.ALLOWANCE,
      rate: value.rate,
      datetime:
        value.unit === DatetimeUnitEnum.MONTH ||
        (value.unit === DatetimeUnitEnum.DAY && value.datetime)
          ? new Date(value.datetime)
          : undefined,
      note: value.note,
      unit: value.unit ? value.unit : undefined
    };

    return Object.assign(salary,
      this.data.add
        ? {payrollIds: this.payrollSelected.map(payroll => payroll.id).concat([this.data.add.payroll.id])}
        : {salaryIds: this.salariesSelected.map(item => item.salary.id).concat([this.data.update.salary.id])}
    )
  }

  onWaringApprentice() {
    if (!this.isApprentice) {
      this.message.warning('Tính từ ngày chỉ được sử dụng cho phụ cấp sau khi thử việc');
    }
    this.isApprentice = true;
    this.formGroup.get('datetime')?.setValue(this.data.add?.payroll.createdAt);
  }

  pre(): void {
    this.indexStep -= 1;
  }

  next(): void {
    this.indexStep += 1;
  }

  onSubmitError(err: string) {
    this.submitting = false;
    return throwError(err);
  }

  onSubmitSuccess(res: ResponseMessageEntity, payrollId?: number) {
    this.message.success(res.message);
    if (payrollId) {
      this.actions$.dispatch(PayrollActions.loadOne({
        id: payrollId
      }));
    }
    this.submitting = false;
    this.modalRef.close();
  }
}