import {DatePipe} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatetimeUnitEnum, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {NzModalRef} from "ng-zorro-antd/modal";
import {PayrollEntity} from "../../../payroll/entities";
import {SalaryRemoteService} from "../../service";
import {NzMessageService} from "ng-zorro-antd/message";
import {throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Actions} from "@datorama/akita-ng-effects";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";
import {DataModalRemoteSalary} from "../../../payroll/entities/data-modal-remote-salary";

@Component({
  templateUrl: 'remote-salary.component.html'
})
export class RemoteSalaryComponent implements OnInit {
  @Input() data!: DataModalRemoteSalary
  payrollSelected: PayrollEntity [] = []
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
      this.payrollSelected.push(this.data.add.payroll)
    }
    const payroll = this.data.add?.payroll
    const salary = this.data.update?.salary
    console.log(payroll?.createdAt)
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
    const salary = this.mapSalary(this.formGroup.value)
    if (this.data.update) {
      Object.assign(salary, {
        salaryIds: [this.data.update.salary.id]
      })
      this.service.updateMany(
        salary,
        this.data.update.multiple ? undefined : {payrollId: this.data.update.salary.id}
      ).pipe(catchError(err => {
        this.submitting = false
        return throwError(err)
      }))
        .subscribe(res => {
          if (this.data.update)
            this.onSubmitSuccess()
        })
    }
    if (this.data.add) {
      Object.assign(salary, {
        payrollIds: this.payrollSelected.map(payroll => payroll.id)
      })
      this.service.addMany(salary,
        this.data.add.multiple ? undefined : {payrollId: this.data.add.payroll.id})
        .pipe(catchError(err => {
          this.submitting = false
          return throwError(err)
        }))
        .subscribe(res => {
          if (this.data.add)
            this.onSubmitSuccess()
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


  onSubmitSuccess() {
    this.submitting = false
    this.modalRef.close()
  }

  pre(): void {
    this.stepIndex -= 1;
  }

  next(): void {
    this.stepIndex += 1;
  }
}
