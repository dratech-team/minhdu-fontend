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
import {PayrollActions} from '../../../payroll/state/payroll.action';
import {getFirstDayInMonth, getLastDayInMonth} from '@minhdu-fontend/utils';
import {ResponseMessageEntity} from '@minhdu-fontend/base-entity';
import {ModalAddOrUpdateRemote} from '../../data';
import {RemoteConstant} from "../../constants/remote.constant";
import {validateDayInMonth} from "../../utils/validate-day-in-month.util";
import * as moment from "moment";
import {SessionConstant} from "../../../../../shared/constants";
import {MoveStepUtil} from "../../utils/move-step.util";

@Component({
  templateUrl: 'remote-salary.component.html'
})
export class RemoteSalaryComponent implements OnInit {
  @Input() data!: ModalAddOrUpdateRemote;
  remoteConstant = RemoteConstant
  formGroup!: FormGroup;

  indexStep = 0;
  submitting = false;
  fistDateInMonth!: Date

  titleSession = SessionConstant;
  salaryTypeEnum = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  employeeType = EmployeeType;

  disableApprenticeDate = (cur: Date): boolean => {
    return validateDayInMonth(cur, this.fistDateInMonth)
  };

  constructor(
    public datePipe: DatePipe,
    public actions$: Actions,
    private readonly formBuilder: FormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly message: NzMessageService,
    private readonly remoteService: SalaryRemoteService
  ) {
  }

  ngOnInit(): void {
    this.fistDateInMonth = getFirstDayInMonth(new Date(
      this.data.add
        ? this.data.add.payroll.createdAt
        : this.data.update.salary.startedAt
    ))

    const payroll = this.data.add?.payroll;
    const salary = this.data.update?.salary;
    this.formGroup = this.formBuilder.group({
      type: [salary?.type, Validators.required],
      partial: [salary?.partial, Validators.required],
      rangeDay: [
        [payroll ? getFirstDayInMonth(new Date(payroll.createdAt)) : salary?.startedAt,
          payroll ? getLastDayInMonth(new Date(payroll.createdAt)) : salary?.endedAt
        ],
        Validators.required
      ],
      note: [salary?.note],
      payrollIds: [payroll ? [payroll.id] : []]
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
    (this.data.add ? this.remoteService.addMany(salary) : this.remoteService.updateMany(salary))
      .pipe(catchError(err => {
        this.submitting = false;
        return this.onSubmitError(err);
      }))
      .subscribe(res => {
        this.onSubmitSuccess(res, this.data.add
          ? (
            !this.data.add?.multiple
              ? this.data.add.payroll.id
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
      type: value.type,
      note: value.note,
      unit: DatetimeUnitEnum.DAY,
      partial: value.partial,
      startedAt: moment(value.rangeDay[0]).set(
        {
          hours: new Date().getHours(),
          minutes: new Date().getMinutes(),
          seconds: new Date().getSeconds()
        }
      ),
      endedAt: moment(value.rangeDay[1]).set(
        {
          hours: new Date().getHours(),
          minutes: new Date().getMinutes(),
          seconds: new Date().getSeconds()
        }
      ),
    };
    return Object.assign(
      salary,
      this.data.add
        ? {payrollIds: value.payrollIds}
        : {salaryIds: [this.data.update.salary.id]}
    );
  }

  onSubmitError(err: string) {
    this.message.warning(err);
    return throwError(err);
  }

  onSubmitSuccess(res: ResponseMessageEntity, payrollId?: number) {
    if (payrollId) {
      this.actions$.dispatch(PayrollActions.loadOne({id: payrollId}));
    }
    this.message.success(res.message);
    this.modalRef.close();
  }

  move(type: 'next' | 'previous'): any {
    this.indexStep = MoveStepUtil(type, this.indexStep, this.formGroup)
  }
}
