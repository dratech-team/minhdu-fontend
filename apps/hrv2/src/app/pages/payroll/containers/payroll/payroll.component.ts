import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { PayrollQuery, PayrollStore } from '../../state';
import { Actions } from '@datorama/akita-ng-effects';
import { PayrollActions } from '../../state/payroll.action';
import { FilterTypeEnum, Role, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { Api, EmployeeStatusConstant, PayrollConstant } from '@minhdu-fontend/constants';
import { map, tap } from 'rxjs/operators';
import { BranchActions, BranchQuery, DepartmentActions, DepartmentQuery } from '@minhdu-fontend/orgchart-v2';
import { getFirstDayInMonth, getLastDayInMonth } from '@minhdu-fontend/utils';
import { SettingSalaryActions, SettingSalaryQuery } from '../../../setting/salary/state';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  ModalDatePickerComponent,
  ModalExportExcelComponent,
  ModalExportExcelData,
  TransformConstantPipe
} from '@minhdu-fontend/components';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { ModalDatePickerEntity } from '@minhdu-fontend/base-entity';
import { SalariesConstant } from '../../../salary/constants';

@Component({
  templateUrl: 'payroll.component.html'
})
export class PayrollComponent implements OnInit {
  payrolls$ = this.payrollQuery.selectAll().pipe(map(payrolls => JSON.parse(JSON.stringify(payrolls))));
  loading$ = this.payrollQuery.selectLoading();
  branches$ = this.branchQuery.selectAll().pipe(map(branches => {
    if (branches.length === 1) {
      this.payrollStore.update(state => ({
        ...state, branch: branches[0]
      }));
      this.formGroup.get('branch')?.setValue(branches[0], { emitEvent: false });
    }
    return branches;
  }));
  loadingSettingSalary$ = this.settingSalaryQuery.select(state => state.loading);
  categories$ = this.departmentQuery.selectAll();
  setting$ = this.settingSalaryQuery.selectAll();

  stateSearch = this.payrollQuery.getValue().search;
  empStatusContain = EmployeeStatusConstant;
  role = localStorage.getItem('role');
  roleEnum = Role;
  filterTypeEnum = FilterTypeEnum;
  payrollConstant = PayrollConstant;

  formGroup = new UntypedFormGroup({
    code: new UntypedFormControl(this.stateSearch.code || ''),
    name: new UntypedFormControl(this.stateSearch.name || ''),
    branch: new UntypedFormControl(this.stateSearch.branch || ''),
    position: new UntypedFormControl(this.stateSearch.position || ''),
    empStatus: new UntypedFormControl(this.stateSearch.empStatus || ''),
    startedAt: new UntypedFormControl(this.stateSearch.startedAt || ''),
    endedAt: new UntypedFormControl(this.stateSearch.endedAt || ''),
    employeeType: new UntypedFormControl(this.stateSearch.employeeType || ''),
    department: new UntypedFormControl(this.stateSearch.department || ''),
    filterType: new UntypedFormControl(this.stateSearch.filterType || ''),
    accConfirmed: new UntypedFormControl(this.stateSearch.accConfirmed),
    paidAt: new UntypedFormControl(this.stateSearch.paidAt),
    manConfirmedAt: new UntypedFormControl(this.stateSearch.manConfirmedAt),
    rangeDay: new UntypedFormControl([
      this.stateSearch.startedAt,
      this.stateSearch.endedAt
    ]),
    titles: new UntypedFormControl([])
  });

  compareFN = (o1: any, o2: any) => (o1 && o2 ? (o1.id == o2.id || o1 === o2.name) : o1 === o2);
  checkFilterTypeSalary = () => {
    return this.formGroup.value.filterType === FilterTypeEnum.PERMANENT
      || SalariesConstant.some(item => item.value === this.formGroup.value.filterType);
  };

  constructor(
    private readonly transformConstant: TransformConstantPipe,
    private readonly datePipe: DatePipe,
    private readonly payrollStore: PayrollStore,
    private readonly payrollQuery: PayrollQuery,
    private readonly branchQuery: BranchQuery,
    private readonly departmentQuery: DepartmentQuery,
    private readonly actions$: Actions,
    private readonly modal: NzModalService,
    private readonly settingSalaryQuery: SettingSalaryQuery
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(BranchActions.loadAll({}));
    this.actions$.dispatch(DepartmentActions.loadAll({}));
    this.actions$.dispatch(SettingSalaryActions.loadAll({}));

    this.payrollQuery.select(state => state.search).subscribe(
      val => {
        this.formGroup.get('rangeDay')?.setValue([val.startedAt, val.endedAt], { emitEvent: false });
        this.formGroup.get('startedAt')?.setValue(val.startedAt, { emitEvent: false });
      }
    );

    this.formGroup.valueChanges.pipe().subscribe(val => {
      this.onLoadPayroll(false);
    });

    this.formGroup.get('filterType')?.valueChanges.subscribe(item => {
      if (item in SalaryTypeEnum || item === FilterTypeEnum.PERMANENT) {
        this.actions$.dispatch(SettingSalaryActions.loadAll({
          search: {
            types: item === FilterTypeEnum.PERMANENT
              ? [SalaryTypeEnum.BASIC, SalaryTypeEnum.BASIC_INSURANCE, SalaryTypeEnum.STAY]
              : [item]
          }
        }));
      }
    });
  }

  onLoadPayroll(isPagination: boolean) {
    this.actions$.dispatch(PayrollActions.loadAll({
      search: this.mapPayroll(this.formGroup.value),
      isPaginate: isPagination
    }));
  }

  mapPayroll(formData: any) {
    this.payrollStore.update(state => ({
      ...state, search: formData
    }));
    return Object.assign({},
      _.omit(formData, ['rangeDay', 'department']),
      {
        categoryId: formData.department?.id || '',
        branch: formData.branch?.name || '',
        position: formData.position?.name || ''
      },
      formData.filterType === FilterTypeEnum.OVERTIME || formData.filterType === FilterTypeEnum.ABSENT
        ? {
          startedAt: new Date(formData.rangeDay[0] + '-00'),
          endedAt: new Date(formData.rangeDay[1] + '-00')
        }
        : {
          startedAt: new Date(getFirstDayInMonth(formData.startedAt) + '-00'),
          endedAt: new Date(getLastDayInMonth(formData.startedAt) + '-00')
        }
    );
  }

  onAddMany() {
    this.modal.create({
      nzTitle: 'Tạo tự động phiếu lương',
      nzContent: ModalDatePickerComponent,
      nzComponentParams: <{ data: ModalDatePickerEntity }>{
        data: {
          dateInit: this.formGroup.value.startedAt,
          type: 'month'
        }
      },
      nzFooter: []
    }).afterClose.subscribe(val => {
      if (val) {
        this.actions$.dispatch(PayrollActions.addMany({ body: { createdAt: new Date(val) } }));
      }
    });
  }

  onPrint() {
    const payroll = Object.assign(
      _.omit(this.mapPayroll(this.formGroup.value), ['take', 'skip']),
      { exportType: this.formGroup.value.filterType }
    );
    const data = {
      filename: `Xuất ${this.transformConstant.transform(payroll.filterType, PayrollConstant)}`
        + ` từ ngày ${this.datePipe.transform(payroll.startedAt, 'dd-MM-yyy')}`
        + ` đến ngày ${this.datePipe.transform(payroll.endedAt, 'dd-MM-yyy')}`,
      params: payroll,
      selectDatetime: true,
      api: Api.HR.PAYROLL.EXPORT
    };
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: `Xuất bảng ${this.transformConstant.transform(payroll.filterType, PayrollConstant)}`,
      nzContent: ModalExportExcelComponent,
      nzComponentParams: <{ data: ModalExportExcelData }>{
        data: Object.assign(data,
          payroll.filterType === FilterTypeEnum.OVERTIME || payroll.filterType === FilterTypeEnum.ABSENT
            ? { typeDate: 'RANGE_DATETIME' }
            : {}
        )
      },
      nzFooter: []
    });
  }
}
