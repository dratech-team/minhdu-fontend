import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { PayrollEntity } from '../../../payroll/entities';
import {SalaryPermanentService, SalaryRemoteService} from '../../service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Actions } from '@datorama/akita-ng-effects';
import { PayrollActions } from '../../../payroll/state/payroll.action';
import { getFirstDayInMonth, getLastDayInMonth } from '@minhdu-fontend/utils';
import { ResponseMessageEntity } from '@minhdu-fontend/base-entity';
import { RequireOnlyOne } from '../../../../../shared/types';
import { ModalRemoteSalaryData } from '../../data/modal-remote-salary.data';

@Component({
  templateUrl: 'remote-salary.component.html'
})
export class RemoteSalaryComponent implements OnInit {
  @Input() data!: RequireOnlyOne<ModalRemoteSalaryData>;
  payrollSelected: PayrollEntity [] = [];
  salaryTypeEnum = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  formGroup!: FormGroup;
  stepIndex = 0;
  submitting = false

  constructor(
    public datePipe: DatePipe,
    public actions$: Actions,
    private readonly formBuilder: FormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly message: NzMessageService,
    private readonly service: SalaryRemoteService
  ) {
  }

  ngOnInit(): void {
    if (this.data.add) {
      this.payrollSelected.push(this.data.add.payroll);
    }
    const payroll = this.data.add?.payroll;
    const salary = this.data.update?.salary;
    this.formGroup = this.formBuilder.group({
      title: [salary?.title, Validators.required],
      rangeDay: [
        [payroll ? getFirstDayInMonth(new Date(payroll.createdAt)) : salary?.startedAt,
          payroll ? getLastDayInMonth(new Date(payroll.createdAt)) : salary?.endedAt
        ],
        Validators.required
      ],
      note: [salary?.note],
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
    this.data.add ? this.service.addMany(salary) : this.service.updateMany(salary)
      .pipe(catchError(err => this.onSubmitError(err)))
      .subscribe(res => {
        return this.onSubmitSuccess(res, this.data.add ? this.data.add.payroll.id : this.data.update.salary.payrollId);
      });
  }

  mapSalary(value: any) {
    const salary = {
      title: value.title,
      type: SalaryTypeEnum.WFH,
      note: value.note,
      unit: DatetimeUnitEnum.DAY,
      startedAt: value.rangeDay[0],
      endedAt: value.rangeDay[1]
    };
    return Object.assign(
      salary,
      this.data.add
        ? { payrollIds: this.payrollSelected.map(payroll => payroll.id) }
        : { salaryIds: [this.data.update.salary.id] }
    );
  }

  onSubmitError(err: string) {
    this.message.warning(err);
    return throwError(err);
  }

  onSubmitSuccess(res: ResponseMessageEntity, payrollId: number) {
    this.actions$.dispatch(PayrollActions.loadOne({ id: payrollId }));
    this.message.success(res.message);
    this.modalRef.close();
  }

  move(type: 'next' | 'previous'): void {
    if (type === 'next') this.stepIndex -= 1;
    else this.stepIndex += 1;
  }
}
