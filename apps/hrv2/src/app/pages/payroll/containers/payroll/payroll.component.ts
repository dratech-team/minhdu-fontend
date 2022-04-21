import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {PayrollQuery, PayrollStore} from "../../state";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollActions} from "../../state/payroll.action";
import {EmployeeStatusConstant, PaginationDto, PayrollConstant} from "@minhdu-fontend/constants";
import {FilterTypeEnum} from "@minhdu-fontend/enums";
import {debounceTime, map} from "rxjs/operators";
import {BranchActions, BranchQuery} from "../../../../../../../../libs/orgchart-v2/src/lib/branch/state";
import {Observable} from "rxjs";
import {Category} from "@minhdu-fontend/data-models";
import {Role} from "../../../../../../../../libs/enums/hr/role.enum";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";

@Component({
  templateUrl: 'payroll.component.html'
})
export class PayrollComponent implements OnInit {
  payrolls$ = this.payrollQuery.selectAll()
  branches$ = this.branchQuery.selectAll().pipe(map(branches => {
    if (branches.length === 1) {
      this.payrollStore.update(state => ({
        ...state, branch: branches[0]
      }))
      this.formGroup.get('branch')?.setValue(branches[0])
    }
    return branches
  }));
  categories$ = new Observable<Category[]>();
  stateSearch = this.payrollQuery.getValue().search
  empStatusContain = EmployeeStatusConstant;
  role!: string | null
  roleEnum = Role
  filterTypeEnum = FilterTypeEnum
  payrollConstant = PayrollConstant
  formGroup = new FormGroup({
    code: new FormControl(this.stateSearch.code || ''),
    name: new FormControl(this.stateSearch.name || ''),
    branch: new FormControl(this.stateSearch.branch || ''),
    position: new FormControl(this.stateSearch.position || ''),
    empStatus: new FormControl(this.stateSearch.empStatus || ''),
    startedAt: new FormControl(this.stateSearch.startedAt || ''),
    endedAt: new FormControl(this.stateSearch.endedAt || ''),
    employeeType: new FormControl(this.stateSearch.employeeType || ''),
    category: new FormControl(''),
    filterType: new FormControl(this.stateSearch.filterType || ''),
    rangeDay: new FormControl([
      this.stateSearch.startedAt,
      this.stateSearch.endedAt
    ])
  })
  compareFN = (o1: any, o2: any) => (o1 && o2 ? (o1.id == o2.id || o1 === o2.name) : o1 === o2);

  constructor(
    private readonly payrollStore: PayrollStore,
    private readonly payrollQuery: PayrollQuery,
    private readonly branchQuery: BranchQuery,
    private readonly actions$: Actions
  ) {
  }

  ngOnInit() {
    this.role = localStorage.getItem('role')
    this.actions$.dispatch(BranchActions.loadAll({}))
    this.actions$.dispatch(PayrollActions.loadAll({
      search: this.mapPayroll(this.formGroup.value)
    }))

    this.payrollQuery.select(state => state.search).subscribe(
      val => {
        this.formGroup.get('rangeDay')?.setValue([val.startedAt, val.endedAt], {emitEvent: false})
        this.formGroup.get('startedAt')?.setValue(val.startedAt, {emitEvent: false})
      }
    )

    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe(val => {
      if (val.filterType === FilterTypeEnum.OVERTIME || val.filterType === FilterTypeEnum.ABSENT) {
        Object.assign(val, {
          startedAt: new Date(val.rangeDay[0] + '-00'),
          endedAt: new Date(val.rangeDay[1] + '-00')
        })
      } else {
        Object.assign(val, {
          startedAt: new Date(getFirstDayInMonth(val.startedAt) + '-00'),
          endedAt: new Date(getLastDayInMonth(val.startedAt) + '-00')
        })
      }
      this.payrollStore.update(state => ({
        ...state, search: val
      }))
      this.actions$.dispatch(PayrollActions.loadAll({
        search: this.mapPayroll(val)
      }))
    })

    this.formGroup.get('category')?.valueChanges.subscribe(val => {
      if (val === 0) {
        this.onAddCategory()
      }
    })
  }

  mapPayroll(formData: any, isPagination?: boolean) {
    if (formData.category === 0) {
      delete formData.category
    }
    Object.assign(formData, {
      branch: formData.branch?.name || '',
      position: formData.position?.name || ''
    })
    Object.assign(formData, {
      take: PaginationDto.take,
      skip: isPagination ? this.payrollQuery.getCount() : PaginationDto.skip
    })
    return formData
  }

  onAddCategory() {
  }

  onUpdateCategory() {
  }
}
