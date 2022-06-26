import {DatePipe} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {SalaryPayroll} from '@minhdu-fontend/data-models';
import {DatetimeUnitEnum, EmployeeType, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {catchError} from 'rxjs/operators';
import {SettingSalaryQuery} from '../../../setting/salary/state';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Actions} from '@datorama/akita-ng-effects';
import {throwError} from 'rxjs';
import {PayrollActions} from '../../../payroll/state/payroll.action';
import {ResponseMessageEntity} from '@minhdu-fontend/base-entity';
import {DeductionSalaryService} from '../../service';
import {ModalAddOrUpdateDeduction} from "../../data/modal-deduction-salary.data";

@Component({
  templateUrl: 'deduction-salary.component.html'
})
export class DeductionSalaryComponent implements OnInit {
  @Input() data!: ModalAddOrUpdateDeduction;

  formGroup!: UntypedFormGroup;

  salaryPayrolls: SalaryPayroll[] = [];

  submitting = false;
  indexStep = 0;
  employeeType = EmployeeType
  today = new Date()

  constructor(
    public readonly datePipe: DatePipe,
    private readonly settingSalaryQuery: SettingSalaryQuery,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly message: NzMessageService,
    private readonly deductionSalaryService: DeductionSalaryService,
    private readonly actions$: Actions
  ) {
  }

  ngOnInit(): void {
    const salary = this.data.add?.salary || this.data?.update?.salary;
    this.formGroup = this.formBuilder.group({
      title: [salary?.title, Validators.required],
      price: [salary?.price, Validators.required],
      note: [salary?.note],
      payrollIds: [this.data.add ? [this.data.add.payroll.id] : []],
      salaryIds: [this.data.update?.multiple?.salaries.map(item => item.id)],
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
    (this.data.add ? this.deductionSalaryService.addMany(salary) : this.deductionSalaryService.updateMany(salary))
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
      note: value.note,
      unit: DatetimeUnitEnum.MONTH,
      rate: 1,
      type: SalaryTypeEnum.DEDUCTION
    };

    return Object.assign(salary,
      this.data.add
        ? {payrollIds: value.payrollIds}
        : this.data.update.multiple
          ? {salaryIds: value.salaryIds}
          : {salaryIds: [this.data.update.salary.id]}
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
    this.modalRef.close();
  }
}
