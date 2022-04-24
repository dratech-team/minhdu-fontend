import {DatePipe} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatetimeUnitEnum, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {NzModalRef} from "ng-zorro-antd/modal";
import {PayrollEntity} from "../../../payroll/entities";
import {SalaryPermanentService} from "../../service";
import {NzMessageService} from "ng-zorro-antd/message";
import {throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {ResponseSalaryEntity} from "../../entities";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollActions} from "../../../payroll/state/payroll.action";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";

@Component({
  templateUrl: 'onsite-salary.component.html'
})
export class OnsiteSalaryComponent implements OnInit {
  @Input() data!: {
    add?: {
      payroll: PayrollEntity
    },
    update?: {
      salary: any
    }
  }
  payrollSelected: PayrollEntity [] = []
  salaryTypeEnum = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  formGroup!: FormGroup;
  stepIndex = 0;

  constructor(
    public datePipe: DatePipe,
    public actions$: Actions,
    private readonly formBuilder: FormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly message: NzMessageService,
    private readonly service: SalaryPermanentService
  ) {
  }

  ngOnInit(): void {
    if (this.data.add) {
      this.payrollSelected.push(this.data.add.payroll)
    }
    const payroll = this.data.add?.payroll
    const salary = this.data.update?.salary
    this.formGroup = this.formBuilder.group({
      title: [salary?.title, Validators.required],
      rangeDay: [
        payroll ?
          [
            this.datePipe.transform(getFirstDayInMonth(payroll.createdAt), 'YYYY-mm-dd'),
            this.datePipe.transform(getLastDayInMonth(payroll.createdAt), 'YYYY-mm-dd')
          ]
          : [
            this.datePipe.transform(salary.startedAt, 'YYYY-mm-dd'),
            this.datePipe.transform(salary.endedAt, 'YYYY-mm-dd')
          ],
        Validators.required
      ],
      note: [salary.note],
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
    const salary = this.mapSalary(this.formGroup.value)
    if (this.data.update) {
      Object.assign(salary, {
        salaryIds: [this.data.update.salary.id]
      })
      this.service.updateMany(salary)
        .pipe(catchError(err => this.onSubmitError(err)))
        .subscribe(res => {
          if (this.data.update)
            this.onSubmitSuccess(res, this.data.update?.salary.payrollId)
        })
    }
    if (this.data.add) {
      Object.assign(salary, {
        payrollIds: this.payrollSelected.map(payroll => payroll.id)
      })
      this.service.addOne(salary)
        .pipe(catchError(err => this.onSubmitError(err)))
        .subscribe(res => {
          if (this.data.add)
            this.onSubmitSuccess(res, this.data.add.payroll.id)
        })
    }
  }

  mapSalary(value: any) {
    return {
      title: value.title,
      type: SalaryTypeEnum.WFH,
      note: value.note,
      unit: DatetimeUnitEnum.DAY,
      startedAt: value.rangeDay[0],
      endedAt: value.rangeDay[1]
    }
  }

  onSubmitError(err: string) {
    this.message.warning(err);
    return throwError(err)
  }

  onSubmitSuccess(res: ResponseSalaryEntity, payrollId: number) {
    this.actions$.dispatch(PayrollActions.loadOne({id: payrollId}))
    this.message.success(res.message)
    this.modalRef.close()
  }

  pre(): void {
    this.stepIndex -= 1;
  }

  next(): void {
    this.stepIndex += 1;
  }
}
