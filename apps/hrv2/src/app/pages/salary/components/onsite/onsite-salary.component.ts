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
  numberChars = new RegExp('[^0-9]', 'g');
  salaryTypeEnum = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  formGroup!: FormGroup;

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
    const payroll = this.data.add?.payroll
    const salary = this.data.update?.salary
    this.formGroup = this.formBuilder.group({
      title: [salary?.title, Validators.required],
      rangeDay: [[
        payroll ?
          this.datePipe.transform(payroll.createdAt, 'YYYY-mm-dd') :
          this.datePipe.transform(salary.startedAt, 'YYYY-mm-dd'),
        payroll ?
          this.datePipe.transform(payroll.createdAt, 'YYYY-mm-dd') :
          this.datePipe.transform(salary.endedAt, 'YYYY-mm-dd')

      ], Validators.required],
      note: [salary.note],
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
    const salary = {
      title: value.title,
      type: SalaryTypeEnum.WFH,
      note: value.note,
      unit: DatetimeUnitEnum.DAY,
      startedAt: value.rangeDay[0],
      endedAt: value.rangeDay[1]
    };
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
        payrollIds: [this.data.add?.payroll.id]
      })
      this.service.addOne(salary)
        .pipe(catchError(err => this.onSubmitError(err)))
        .subscribe(res => {
          if (this.data.add)
            this.onSubmitSuccess(res, this.data.add.payroll.id)
        })
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
}
