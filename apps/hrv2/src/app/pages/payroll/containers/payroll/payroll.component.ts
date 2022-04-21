import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {PayrollQuery, PayrollStore} from "../../state";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollActions} from "../../state/payroll.action";
import {PaginationDto} from "@minhdu-fontend/constants";

@Component({
  templateUrl: 'payroll.component.html'
})
export class PayrollComponent implements OnInit {
  payrolls$ = this.payrollQuery.selectAll()
  statePayroll = this.payrollQuery.getValue()
  formGroup = new FormGroup({
    code: new FormControl(this.statePayroll.search.code||''),
    name: new FormControl(this.statePayroll.search.name||''),
    branch: new FormControl(this.statePayroll.branch||''),
    position: new FormControl(this.statePayroll.position||''),
    empStatus: new FormControl(this.statePayroll.search.empStatus||''),
    startedAt: new FormControl(this.statePayroll.search.startedAt||''),
    endedAt: new FormControl(this.statePayroll.search.endedAt||''),
    employeeType: new FormControl(this.statePayroll.search.employeeType||''),
  })

  constructor(
    private readonly payrollStore: PayrollStore,
    private readonly payrollQuery: PayrollQuery,
    private readonly actions$: Actions
  ) {
  }

  ngOnInit() {
    console.log(this.statePayroll.search.empStatus)
    this.actions$.dispatch(PayrollActions.loadAll({
      search: this.mapPayroll()
    }))
  }

  mapPayroll(isPagination?: boolean) {
    const param = this.formGroup.value
    Object.assign(param, {
      take: PaginationDto.take,
      skip: isPagination ? this.payrollQuery.getCount() : PaginationDto.skip
    })
    return param
  }
}
