import {Component, OnInit} from "@angular/core";
import {PayrollQuery, PayrollStore} from "../../state";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollActions} from "../../state/payroll.action";
import {FormControl, FormGroup} from "@angular/forms";
import {EmployeeStatusEnum, FilterTypeEnum} from "@minhdu-fontend/enums";
import {PaginationDto} from "@minhdu-fontend/constants";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {debounceTime, map} from "rxjs/operators";
import * as _ from "lodash";

@Component({
  templateUrl: 'history-payroll.component.html'
})
export class HistoryPayrollComponent implements OnInit {
  payrolls$ = this.payrollQuery.selectAll()
  name$: Observable<string> = this.activatedRoute.queryParams.pipe(map(param => param.name));

  stateSearch = this.payrollQuery.getValue().searchHistory
  formGroup = new FormGroup({
    code: new FormControl(this.stateSearch.name || ''),
    name: new FormControl(this.stateSearch.code || ''),
    rangeDay: new FormControl(this.stateSearch.rangeDay),
    accConfirmed: new FormControl(this.stateSearch.accConfirmed || ''),
    filterType: new FormControl(FilterTypeEnum.PAYROLL),
    paidAt: new FormControl(this.stateSearch.paidAt || ''),
    manConfirmedAt: new FormControl(this.stateSearch.manConfirmedAt || ''),
    branch: new FormControl(this.stateSearch.branch || ''),
    position: new FormControl(this.stateSearch.position || ''),
    empStatus: new FormControl(EmployeeStatusEnum.ALL),
    employeeId: new FormControl(this.getEmployeeId)
  })

  constructor(
    private readonly payrollQuery: PayrollQuery,
    private readonly payrollStore: PayrollStore,
    private readonly actions$: Actions,
    private readonly activatedRoute: ActivatedRoute
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
}
