import {Component, OnInit} from "@angular/core";
import {PayrollQuery, PayrollStore} from "../../state";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollActions} from "../../state/payroll.action";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {EmployeeStatusEnum, FilterTypeEnum} from "@minhdu-fontend/enums";
import {PaginationDto} from "@minhdu-fontend/constants";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {debounceTime, map} from "rxjs/operators";
import * as _ from "lodash";
import {NzModalService} from "ng-zorro-antd/modal";
import {ModalDatePickerComponent} from "@minhdu-fontend/components";
import {ModalDatePickerEntity} from "@minhdu-fontend/base-entity";

@Component({
  templateUrl: 'history-payroll.component.html'
})
export class HistoryPayrollComponent implements OnInit {
  payrolls$ = this.payrollQuery.selectAll()
  name$: Observable<string> = this.activatedRoute.queryParams.pipe(map(param => param.name));
  loading$ = this.payrollQuery.select(state => state.loading)

  stateSearch = this.payrollQuery.getValue().searchHistory
  formGroup = new UntypedFormGroup({
    code: new UntypedFormControl(this.stateSearch.name || ''),
    name: new UntypedFormControl(this.stateSearch.code || ''),
    rangeDay: new UntypedFormControl(this.stateSearch.rangeDay),
    accConfirmed: new UntypedFormControl(this.stateSearch.accConfirmed || ''),
    filterType: new UntypedFormControl(FilterTypeEnum.PAYROLL),
    paidAt: new UntypedFormControl(this.stateSearch.paidAt || ''),
    manConfirmedAt: new UntypedFormControl(this.stateSearch.manConfirmedAt || ''),
    branch: new UntypedFormControl(this.stateSearch.branch || ''),
    position: new UntypedFormControl(this.stateSearch.position || ''),
    empStatus: new UntypedFormControl(EmployeeStatusEnum.ALL),
    employeeId: new UntypedFormControl(this.getEmployeeId)
  })

  constructor(
    private readonly payrollQuery: PayrollQuery,
    private readonly payrollStore: PayrollStore,
    private readonly actions$: Actions,
    private readonly activatedRoute: ActivatedRoute,
    private readonly modal: NzModalService,
  ) {
  }

  ngOnInit() {
    this.onLoadPayroll(false)


    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe(_ => {
      this.onLoadPayroll(false)
    })
  }

  onLoadPayroll(isPagination: boolean) {
    this.actions$.dispatch(PayrollActions.loadAll({
      search: this.mapPayroll(this.formGroup.value,),
      isPaginate: isPagination
    }))
  }

  get getEmployeeId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  mapPayroll(formData: any, isPagination?: boolean) {
    this.payrollStore.update(state => ({
      ...state, searchHistory: formData
    }))
    return Object.assign({}, _.omit(formData, 'rangeDay'), {
      startedAt: new Date(formData.rangeDay[0]),
      endedAt: new Date(formData.rangeDay[1]),
      position: formData.position?.name || '',
      branch: formData.branch?.name || '',
      take: PaginationDto.take,
      skip: isPagination ? this.payrollQuery.getCount() : PaginationDto.skip,
    })
  }

  onAdd() {
    this.modal.create({
      nzTitle: 'Tạo phiếu lương',
      nzContent: ModalDatePickerComponent,
      nzComponentParams: <{ data: ModalDatePickerEntity }>{
        data: {
          type: "month",
          dateInit: this.payrollQuery.getValue().search.startedAt
        }
      },
      nzFooter: ' '
    }).afterClose.subscribe(date => {
      if (date) {
        this.actions$.dispatch(PayrollActions.addOne({
          body: {
            createdAt: new Date(date),
            employeeId: this.getEmployeeId
          }
        }))
      }
    })
  }
}
