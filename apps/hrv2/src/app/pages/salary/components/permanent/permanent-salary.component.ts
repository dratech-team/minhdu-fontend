import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  EmployeeType,
  ModeEnum,
  Role,
  SalaryTypeEnum,
} from '@minhdu-fontend/enums';
import { SalaryPayroll } from '@minhdu-fontend/data-models';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SalaryPermanentService } from '../../service';
import {
  SettingSalaryActions,
  SettingSalaryQuery,
} from '../../../setting/salary/state';
import { Actions } from '@datorama/akita-ng-effects';
import { PayrollActions } from '../../../payroll/state/payroll.action';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ResponseMessageEntity } from '@minhdu-fontend/base-entity';
import { EmployeeService } from '@minhdu-fontend/employee-v2';
import { PayrollQuery } from '../../../payroll/state';
import { ModalAddOrUpdatePermanent } from '../../data';
import { AccountQuery } from '../../../../../../../../libs/system/src/lib/state/account-management/account.query';

@Component({
  templateUrl: 'permanent-salary.component.html',
})
export class PermanentSalaryComponent implements OnInit {
  @Input() data!: ModalAddOrUpdatePermanent;
  @Output() EmitSalariesSelected = new EventEmitter<SalaryPayroll[]>();
  currentUser$ = this.accountQuery.selectCurrentUser();
  salariesSetting$ = this.settingSalaryQuery
    .selectAll({
      filterBy: [
        (entity) => {
          return this.data.type === SalaryTypeEnum.STAY
            ? entity.type === this.data.type
            : entity.type === SalaryTypeEnum.BASIC ||
                entity.type === SalaryTypeEnum.BASIC_INSURANCE;
        },
      ],
    })
    .pipe(
      map((templates) => {
        if (this.data.update || this.data.add.salary) {
          const template = templates.find(
            (template) =>
              template.title === this.data.update?.salary.title ||
              template.title === this.data.add?.salary?.title
          );
          if (template) {
            this.formGroup.get('template')?.setValue(template);
          }
        }
        return templates;
      })
    );
  loadingSettingSalary$ = this.settingSalaryQuery.select(
    (state) => state.loading
  );

  role = localStorage.getItem('role');
  indexStep = 0;
  submitting = false;
  employeeType = EmployeeType;
  salaryTypeEnum = SalaryTypeEnum;
  modeEnum = ModeEnum;
  createdAt = this.payrollQuery.getValue().search.startedAt;
  formGroup!: UntypedFormGroup;

  compareFn = (o1: any, o2: any) =>
    o1 && o2 ? o1.id === o2.id || o1 === o2.title : o1 === o2;

  constructor(
    private readonly actions$: Actions,
    private readonly settingSalaryQuery: SettingSalaryQuery,
    private readonly payrollQuery: PayrollQuery,
    private readonly message: NzMessageService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly service: SalaryPermanentService,
    private readonly employeeService: EmployeeService,
    private readonly accountQuery: AccountQuery
  ) {}

  ngOnInit(): void {
    this.actions$.dispatch(
      SettingSalaryActions.loadAll({
        search: {
          types:
            this.data.type === SalaryTypeEnum.BASIC
              ? [SalaryTypeEnum.BASIC_INSURANCE, SalaryTypeEnum.BASIC]
              : [SalaryTypeEnum.STAY],
        },
      })
    );
    const salary = this.data.add?.salary || this.data?.update?.salary;
    this.formGroup = this.formBuilder.group({
      template: ['', Validators.required],
      price: [salary?.price, Validators.required],
      rate: [salary?.rate, Validators.required],
      unit: [salary?.unit],
      payrollIds: [this.data.add?.payroll ? [this.data.add.payroll.id] : []],
      salaryIds: [this.data.update?.multiple?.salaries.map((item) => item.id)],
    });

    this.formGroup.get('template')?.valueChanges.subscribe((template) => {
      if (template.prices.length === 1 && this.data.add) {
        this.formGroup.get('price')?.setValue(template.prices[0]);
      }
      this.formGroup.get('unit')?.setValue(template.unit);
      this.formGroup.get('rate')?.setValue(template.rate);
      this.formGroup.get('type')?.setValue(template.type);
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
    if (this.data.add?.multiple && value.payrollIds.length === 0) {
      return this.message.warning('Chưa chọn nhân viên');
    }
    const salary = this.mapSalary(value);
    this.submitting = true;
    (this.data.add
      ? this.service.addMany(salary)
      : this.data.update.history
      ? this.employeeService.updateHistorySalary(
          this.data.update.salary.id,
          salary
        )
      : this.service.updateMany(salary)
    )
      .pipe(catchError((err) => this.onSubmitError(err)))
      .subscribe((res) =>
        this.onSubmitSuccess(
          res,
          this.data.add
            ? !this.data.add?.multiple
              ? this.data.add.payroll?.id
              : undefined
            : !this.data.update?.multiple
            ? this.data.update.salary.payrollId
            : undefined
        )
      );
  }

  mapSalary(value: any) {
    const salary = {
      type: value.template.type,
      title: value.template.title,
      price: value.price,
      note: value.note,
      settingId: value.template.id,
    };
    return Object.assign(
      salary,
      this.data.add
        ? { payrollIds: value.payrollIds }
        : this.data.update.multiple
        ? { salaryIds: value.salaryIds }
        : { salaryIds: [this.data.update.salary.id] }
    );
  }

  onSubmitSuccess(res: ResponseMessageEntity, payrollId?: number) {
    this.submitting = false;
    this.message.success(res.message);
    if (payrollId) {
      this.actions$.dispatch(PayrollActions.loadOne({ id: payrollId }));
    }
    this.modalRef.close(this.mapSalary(this.formGroup.value).title);
  }

  onSubmitError(err: string) {
    this.submitting = false;
    return throwError(err);
  }

  move(type: 'next' | 'previous'): void {
    if (this.formGroup.invalid) {
      return;
    }
    type === 'next' ? (this.indexStep += 1) : (this.indexStep -= 1);
  }
}
