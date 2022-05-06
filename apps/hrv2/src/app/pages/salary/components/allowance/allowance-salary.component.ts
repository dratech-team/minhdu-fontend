import {DatePipe} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {DatetimeUnitEnum, EmployeeType, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {getFirstDayInMonth, getLastDayInMonth, isEqualDatetime} from 'libs/utils/daytime.until';
import {SalaryPayroll} from '@minhdu-fontend/data-models';
import {AllowanceSalaryService} from '../../service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Actions} from '@datorama/akita-ng-effects';
import {PayrollActions} from '../../../payroll/state/payroll.action';
import {ResponseMessageEntity} from '@minhdu-fontend/base-entity';
import {ModalAddOrUpdateAllowance} from '../../../payroll/data';
import {validateDayInMonth} from '../../utils/validate-day-in-month.util';
import * as moment from 'moment';
import {MoveStepUtil} from "../../utils/move-step.util";

@Component({
  templateUrl: 'allowance-salary.component.html'
})
export class AllowanceSalaryComponent implements OnInit {
  @Input() data!: ModalAddOrUpdateAllowance;

  formGroup!: FormGroup;
  salariesSelected: SalaryPayroll [] = [];

  indexStep = 0;
  submitting = false;
  workedAt!: Date;
  fistDateInMonth!: Date;
  salaryTypeEnum = SalaryTypeEnum;
  employeeType = EmployeeType

  disableApprenticeDate = (cur: Date): boolean => {
    return validateDayInMonth(cur, this.fistDateInMonth);
  };

  constructor(
    public datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly formBuilder: FormBuilder,
    private readonly service: AllowanceSalaryService,
    private readonly message: NzMessageService,
    private readonly modal: NzModalService,
    private readonly modalRef: NzModalRef,
    private readonly actions$: Actions
  ) {
  }

  ngOnInit(): void {
    this.workedAt = this.data.add ? this.data.add.payroll.employee.workedAt : this.data.update.salary.workedAt;
    this.fistDateInMonth = getFirstDayInMonth(new Date(
      this.data.add
        ? this.data.add.payroll.createdAt
        : this.data.update.salary.startedAt
    ));

    if (this.data.update?.multiple) {
      this.salariesSelected = [...this.data.update.multiple.salariesSelected];
    }
    const salary = this.data.update?.salary;
    const payroll = this.data.add?.payroll;
    this.formGroup = this.formBuilder.group({
      title: [salary?.title, Validators.required],
      price: [salary?.price, Validators.required],
      note: [salary?.note],
      month: [salary?.startedAt || payroll?.createdAt],
      rangeDay: [
        [salary?.startedAt || this.fistDateInMonth,
          salary?.endedAt || getLastDayInMonth(this.fistDateInMonth)
        ],
        Validators.required
      ],
      inOffice: [this.data.update ? salary?.inOffice : true],
      endedAt: [salary?.endedAt],
      rate: [salary?.rate || 1],
      inWorkday: [this.data.update ? salary?.inWorkday : true],
      payrollIds: [payroll ? [payroll.id] : []]
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

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const salary = this.mapSalary(value);
    this.submitting = true;
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
      note: value.note,
      startedAt: moment(value.rangeDay[0]).set({
        hours: new Date().getHours(),
        minutes: new Date().getMinutes(),
        seconds: new Date().getSeconds()
      }).toDate(),
      endedAt: moment(value.rangeDay[1]).set({
        hours: new Date().getHours(),
        minutes: new Date().getMinutes(),
        seconds: new Date().getSeconds()
      }).toDate(),
      inOffice: value.inOffice,
      inWorkday: value.inWorkday
    };

    return Object.assign(salary,
      this.data.add
        ? {payrollIds: value.payrollIds}
        : {salaryIds: this.salariesSelected.map(item => item.salary.id).concat([this.data.update.salary.id])}
    );
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

  move(type: 'next' | 'previous'): void {
    this.indexStep = MoveStepUtil(type, this.indexStep, this.formGroup)
  }

  onSelectWorkedAt() {
    this.modal.info({
      nzTitle: 'Chọn từ ngày đến ngày',
      nzContent: `Nhân viên bắt đầu làm việc chính thức từ ngày
        ${this.datePipe.transform(
        this.data.add
          ? this.data.add.payroll.employee.workedAt
          : this.data.update.salary.workedAt, 'dd/MM/yyyy')},
            bạn có muốn chọn ngày này làm ngày bắt đầu
            `,
      nzOnOk: () => this.formGroup.get('rangeDay')?.setValue(
        [
          this.workedAt,
          getLastDayInMonth(this.fistDateInMonth)
        ])
    });
  }

  checkWorkedAt(): boolean {
    return isEqualDatetime(this.workedAt, this.fistDateInMonth, 'month');
  }
}
