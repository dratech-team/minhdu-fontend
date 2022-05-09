import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {PayrollQuery, PayrollStore} from "../../state";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollActions} from "../../state/payroll.action";
import {EmployeeStatusConstant, PaginationDto, PayrollConstant} from "@minhdu-fontend/constants";
import {FilterTypeEnum, Role, SalaryTypeEnum} from "@minhdu-fontend/enums";
import {debounceTime, map} from "rxjs/operators";
import {BranchActions, BranchQuery, DepartmentActions, DepartmentQuery} from "@minhdu-fontend/orgchart-v2";
import {Subject} from "rxjs";
import {getFirstDayInMonth, getLastDayInMonth} from "@minhdu-fontend/utils";
import {SettingSalaryActions} from "../../../setting/salary/state";

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
      this.formGroup.get('branch')?.setValue(branches[0], {emitEvent: false})
    }
    return branches
  }));
  categories$ = this.departmentQuery.selectAll();
  onChange = new Subject<void>();

  stateSearch = this.payrollQuery.getValue().search
  empStatusContain = EmployeeStatusConstant;
  role = localStorage.getItem('role');
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
    department: new FormControl(this.stateSearch.department || ''),
    filterType: new FormControl(this.stateSearch.filterType || ''),
    accConfirmed: new FormControl(this.stateSearch.accConfirmed),
    paidAt: new FormControl(this.stateSearch.paidAt),
    manConfirmedAt: new FormControl(this.stateSearch.manConfirmedAt),
    rangeDay: new FormControl([
      this.stateSearch.startedAt,
      this.stateSearch.endedAt
    ]),
    titles: new FormControl([])
  })

  compareFN = (o1: any, o2: any) => (o1 && o2 ? (o1.id == o2.id || o1 === o2.name) : o1 === o2);

  constructor(
    private readonly payrollStore: PayrollStore,
    private readonly payrollQuery: PayrollQuery,
    private readonly branchQuery: BranchQuery,
    private readonly departmentQuery: DepartmentQuery,
    private readonly actions$: Actions
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(BranchActions.loadAll({}))

    this.actions$.dispatch(DepartmentActions.loadAll({}))

    this.onLoadPayroll(false)
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
      this.onLoadPayroll(false)
      if (val.filterType in SalaryTypeEnum) {
        this.actions$.dispatch(SettingSalaryActions.loadAll({
          search: {
            types: val.filterType === SalaryTypeEnum.BASIC
              ? [SalaryTypeEnum.BASIC, SalaryTypeEnum.BASIC_INSURANCE]
              : [val.filterType]
          }
        }))
      }

    })

    this.formGroup.get('category')?.valueChanges.subscribe(val => {
      if (val === 0) {
        this.onAddCategory()
      }
    })
  }

  onLoadPayroll(isPagination: boolean) {
    this.actions$.dispatch(PayrollActions.loadAll({
      search: this.mapPayroll(this.formGroup.value,),
      isPaginate: isPagination
    }))
  }

  mapPayroll(formData: any, isPagination?: boolean) {
    this.payrollStore.update(state => ({
      ...state, search: formData
    }))
    return Object.assign({}, formData, {
      categoryId: formData.department?.id || '',
      branch: formData.branch?.name || '',
      position: formData.position?.name || '',
      take: PaginationDto.take,
      skip: isPagination ? this.payrollQuery.getCount() : PaginationDto.skip
    })
  }

  onAddCategory() {
  }

  onUpdateCategory() {
  }

  onAdd() {
    this.onChange.next()
  }
}
