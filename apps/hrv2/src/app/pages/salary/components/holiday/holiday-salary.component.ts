import {DatePipe} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatetimeUnitEnum, EmployeeType, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Actions} from '@datorama/akita-ng-effects';
import {PayrollActions} from '../../../payroll/state/payroll.action';
import {getFirstDayInMonth} from '@minhdu-fontend/utils';
import {ResponseMessageEntity} from '@minhdu-fontend/base-entity';
import {RemoteConstant} from "../../constants/remote.constant";
import {SalaryHolidayService} from "../../service/salary-holiday.service";
import {SettingSalaryActions, SettingSalaryQuery} from "../../../setting/salary/state";
import {ModalAddOrUpdateHoliday} from "../../data/modal-holiday-salary.data";
import {SalarySettingEntity} from "../../../setting/salary/entities";

@Component({
  templateUrl: 'holiday-salary.component.html'
})
export class HolidaySalaryComponent implements OnInit {
  @Input() data!: ModalAddOrUpdateHoliday;
  templateSalaries$ = this.settingSalaryQuery.selectAll({
    filterBy: [(entity => entity.type === SalaryTypeEnum.HOLIDAY)]
  }).pipe(
    map(templates => {
      if (this.data?.update) {
        this.formGroup.get('template')?.setValue(
          this.getTemplateSalary(templates, this.data.update.salary.setting.id));
      }
      return templates;
    })
  );
  settingsLoading$ = this.settingSalaryQuery.select(state => state.loading);
  remoteConstant = RemoteConstant
  formGroup!: FormGroup;

  indexStep = 0;
  submitting = false;
  fistDateInMonth!: Date

  salaryTypeEnum = SalaryTypeEnum;
  datetimeUnit = DatetimeUnitEnum;
  employeeType = EmployeeType;

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);


  constructor(
    public datePipe: DatePipe,
    public actions$: Actions,
    private readonly formBuilder: FormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly message: NzMessageService,
    private readonly settingSalaryQuery: SettingSalaryQuery,
    private readonly holidayService: SalaryHolidayService
  ) {
  }

  ngOnInit(): void {
    this.fistDateInMonth = getFirstDayInMonth(
      new Date(this.data.add ? this.data.add.payroll.createdAt :
        (this.data.update.salary.setting.startedAt || new Date()))
    )
    this.actions$.dispatch(SettingSalaryActions.loadAll({
      search: {
        types: [SalaryTypeEnum.HOLIDAY],
        payrollId: this.data.add?.payroll.id || this.data.update?.salary.payrollId
      }
    }));

    const payroll = this.data.add?.payroll;
    const salary = this.data.update?.salary;
    this.formGroup = this.formBuilder.group({
      type: [SalaryTypeEnum.HOLIDAY, Validators.required],
      template: ['', Validators.required],
      note: [salary?.note],
      payrollIds: [payroll ? [payroll.id] : []]
    });
  }

  getTemplateSalary(template: SalarySettingEntity[], id: number) {
    return template.find(item => item.id === id);
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
    (this.data.add ? this.holidayService.addMany(salary) : this.holidayService.updateMany(salary))
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
      settingId: value.template.id
    };
    return Object.assign(
      salary,
      this.data.add
        ? {payrollIds: value.payrollIds}
        :this.data.update.multiple
          ? {salaryIds: value.salaryIds}
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

  move(type: 'next' | 'previous'): void {
    if (this.formGroup.invalid) {
      return
    }
    type === "next" ? this.indexStep += 1 : this.indexStep -= 1
  }
}
