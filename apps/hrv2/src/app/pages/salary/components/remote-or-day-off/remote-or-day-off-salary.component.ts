import {DatePipe} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatetimeUnitEnum, EmployeeType, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {SalaryRemoteService} from '../../service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Actions} from '@datorama/akita-ng-effects';
import {getFirstDayInMonth} from '@minhdu-fontend/utils';
import {ResponseMessageEntity} from '@minhdu-fontend/base-entity';
import {RemoteConstant} from "../../constants/remote.constant";
import {validateDayInMonth} from "../../utils/validate-day-in-month.util";
import * as moment from "moment";
import {SessionConstant} from "../../../../../shared/constants";
import {ModalAddOrUpdateRemoteOrDayOff} from "../../data";
import {DayOffSalaryService} from "../../service/day-off-salary.service";
import {UnitSalaryConstant} from "../../constants";

@Component({
  templateUrl: 'remote-or-day-off-salary.component.html'
})
export class RemoteOrDayOffSalaryComponent implements OnInit {
  @Input() data!: ModalAddOrUpdateRemoteOrDayOff;
  remoteConstant = RemoteConstant
  formGroup!: FormGroup;

  indexStep = 0;
  submitting = false;
  fistDateInMonth!: Date

  titleSession = SessionConstant;
  salaryTypeEnum = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  employeeType = EmployeeType;
  unitConstant = UnitSalaryConstant;

  disableApprenticeDate = (cur: Date): boolean => {
    return validateDayInMonth(cur, this.fistDateInMonth)
  };

  constructor(
    public datePipe: DatePipe,
    public actions$: Actions,
    private readonly formBuilder: FormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly message: NzMessageService,
    private readonly remoteService: SalaryRemoteService,
    private readonly dayOffSalaryService: DayOffSalaryService,
  ) {
  }

  ngOnInit(): void {
    this.fistDateInMonth = getFirstDayInMonth(new Date(
      this.data.add
        ? this.data.add.payroll.createdAt || new Date()
        : this.data.update.salary.startedAt || new Date()
    ))
    const payroll = this.data.add?.payroll;
    const salary = this.data.add?.salary || this.data.update?.salary;
    this.formGroup = this.formBuilder.group({
      type: [salary?.type],
      partial: [salary?.partial, Validators.required],
      rangeDay: [
        salary && this.data.update
          ? [salary?.startedAt, salary?.endedAt]
          : [this.fistDateInMonth]
        , Validators.required
      ],
      unit: [DatetimeUnitEnum.DAY],
      note: [salary?.note],
      payrollIds: [payroll ? [payroll.id] : []],
      salaryIds: [this.data.update?.multiple?.salaries.map(item => item.id)],
    })
    ;
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return;
    }
    const salary = this.mapSalary(this.formGroup.value);
    this.submitting = true;
    const service = this.data.type === SalaryTypeEnum.DAY_OFF ? this.dayOffSalaryService : this.remoteService;
    (this.data.add ? service.addMany(salary) : service.updateMany(salary))
      .pipe(catchError(err => {
        this.submitting = false;
        return this.onSubmitError(err);
      }))
      .subscribe(res => {
        this.onSubmitSuccess(res);
      });
  }

  mapSalary(value: any) {
    const salary = {
      type: this.data.type === SalaryTypeEnum.DAY_OFF ? this.data.type : value.type,
      note: value.note,
      unit: value.unit,
      partial: value.partial,
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
    };
    return Object.assign(
      salary,
      this.data.add
        ? {payrollIds: value.payrollIds}
        : this.data.update.multiple
          ? {salaryIds: value.salaryIds}
          : {salaryIds: [this.data.update.salary.id]},
      this.data.type === SalaryTypeEnum.DAY_OFF
        ? {title: 'Không đi làm'}
        : {}
    );
  }

  onSubmitError(err: string) {
    this.message.warning(err);
    return throwError(err);
  }

  onSubmitSuccess(res: ResponseMessageEntity) {
    this.message.success(res.message);
    this.modalRef.close(this.mapSalary(this.formGroup.value).type)
  }

  move(type: 'next' | 'previous'): void {
    if (this.formGroup.invalid) {
      return
    }
    type === "next" ? this.indexStep += 1 : this.indexStep -= 1
  }
}
