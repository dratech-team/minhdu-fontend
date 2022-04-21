import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {PayrollQuery, PayrollStore} from "../../state";
import {Actions} from "@datorama/akita-ng-effects";
import {PayrollActions} from "../../state/payroll.action";
import {EmployeeStatusConstant, PaginationDto, PayrollConstant} from "@minhdu-fontend/constants";
import {FilterTypeEnum, ItemContextMenu} from "@minhdu-fontend/enums";
import {debounceTime, map} from "rxjs/operators";
import {BranchActions, BranchQuery} from "../../../../../../../../libs/orgchart-v2/src/lib/branch/state";
import {Observable} from "rxjs";
import {Category} from "@minhdu-fontend/data-models";
import {Role} from "../../../../../../../../libs/enums/hr/role.enum";

@Component({
  templateUrl: 'payroll.component.html'
})
export class PayrollComponent implements OnInit {
  payrolls$ = this.payrollQuery.selectAll()
  selectedPayroll$ = this.payrollQuery.select(state => state.selectedPayroll)
  branches$ = this.branchQuery.selectAll().pipe(map(branches => {
    if (branches.length === 1) {
      this.payrollStore.update(state => ({
        ...state, branch: branches[0]
      }))
      this.formGroup.get('branch')?.patchValue(branches[0], {emitEvent: false})
    }
    return branches
  }));
  categories$ = new Observable<Category[]>();
  statePayroll = this.payrollQuery.getValue()
  empStatusContain = EmployeeStatusConstant;
  role!: string | null
  roleEnum = Role
  filterTypeEnum = FilterTypeEnum
  payrollConstant = PayrollConstant
  formGroup = new FormGroup({
    code: new FormControl(this.statePayroll.search.code || ''),
    name: new FormControl(this.statePayroll.search.name || ''),
    branch: new FormControl(this.statePayroll.branch || ''),
    position: new FormControl(this.statePayroll.position || ''),
    empStatus: new FormControl(this.statePayroll.search.empStatus || ''),
    startedAt: new FormControl(this.statePayroll.search.startedAt || ''),
    endedAt: new FormControl(this.statePayroll.search.endedAt || ''),
    employeeType: new FormControl(this.statePayroll.search.employeeType || ''),
    category: new FormControl('')
  })
  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1 == o2.type : o1.type === o2.type);

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
      search: this.mapPayroll()
    }))

    this.formGroup.valueChanges.pipe(debounceTime(1500)).subscribe(_ => {
      this.actions$.dispatch(PayrollActions.loadAll({
        search: this.mapPayroll()
      }))
    })

    this.formGroup.get('category')?.valueChanges.subscribe(val => {
      if (val === 0) {
        this.onAddCategory()
      }
    })
  }

  mapPayroll(isPagination?: boolean) {
    const param = this.formGroup.value
    if (param.category === 0) {
      delete param.category
    }
    Object.assign(param, {
      take: PaginationDto.take,
      skip: isPagination ? this.payrollQuery.getCount() : PaginationDto.skip
    })
    return param
  }

  onAddCategory() {
  }

  onUpdateCategory(){
  }
}
