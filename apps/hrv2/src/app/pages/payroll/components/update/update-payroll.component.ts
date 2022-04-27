import {Component, Input, OnInit} from "@angular/core";
import {DatePipe} from "@angular/common";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Position} from "@minhdu-fontend/data-models";
import {map} from "rxjs/operators";
import {RecipeTypesConstant} from "@minhdu-fontend/constants";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Actions} from "@datorama/akita-ng-effects";
import {BranchActions, BranchQuery} from "../../../../../../../../libs/orgchart-v2/src/lib/branch/state";
import {PayrollEntity} from "../../entities";
import {PayrollActions} from "../../state/payroll.action";
import {PayrollQuery} from "../../state";

@Component({
  templateUrl: 'update-payroll.component.html'
})
export class UpdatePayrollComponent implements OnInit {
  @Input() data!: {
    payroll: PayrollEntity
  }
  formGroup!: FormGroup
  positions?: Position[];
  recipeTypeConstant = RecipeTypesConstant
  branches$ = this.branchQuery.selectAll().pipe(map(branches => {
    if (branches.length === 1) {
      this.positions = branches[0].positions
    } else {
      this.positions = branches.find(branch => branch.name === this.data.payroll.branch)?.positions
    }
    console.log(branches)
    return branches
  }));
  added$ = this.payrollQuery.select(state => state.added)
  compareFN = (o1: any, o2: any) => (typeof o1 === 'string' && o2 ? o1 === o2.name : o1.id === o2.id);
  compareRecipe = (o1: any, o2: any) => (o1 && o2 ? ( o1 === o2.value || o1.value === o2.value) : o1 === o2);

  constructor(
    private readonly branchQuery: BranchQuery,
    private readonly payrollQuery: PayrollQuery,
    private readonly actions$: Actions,
    private readonly datePipe: DatePipe,
    private readonly formBuilder: FormBuilder,
    private readonly modalRef: NzModalRef,
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(BranchActions.loadAll({}))
    this.formGroup = this.formBuilder.group({
      createdAt: [this.data.payroll.createdAt, Validators.required],
      branch: [this.data.payroll.branch, Validators.required],
      position: [this.data.payroll.position, Validators.required],
      workday: [this.data.payroll.workday, Validators.required],
      recipeType: [this.data.payroll.recipeType, Validators.required],
      isFlatSalary: [this.data.payroll.isFlatSalary, Validators.required],
      tax: [this.data.payroll.tax ? this.data.payroll.tax * 100 : ''],
    })

    this.formGroup.get('branch')?.valueChanges.subscribe(val => {
      this.formGroup.get('position')?.setValue('')
      this.positions = val.positions
    })
  }

  onSubmit(): any {
    if (this.formGroup.invalid) {
      return
    }
    const payroll = this.mapPayroll()
    this.actions$.dispatch(PayrollActions.update({
      id: this.data.payroll.id, updates: payroll
    }))
    this.added$.subscribe(added => {
      if (added) {
        this.modalRef.close()
      }
    })
  }

  mapPayroll() {
    const value = this.formGroup.value
    const payroll = {
      workday: value.workday,
      createdAt: value.createdAt,
      isFlatSalary: value.isFlatSalary
    }
    return Object.assign(payroll,
      value.tax
        ? {tax: value.tax / 100,}
        : {},
      value.position?.id
        ? {positionId: value.position.id}
        : {},
      value.branch?.id
        ? {branchId: value.branch.id}
        : {},
      value.recipeType?.value
        ? {recipeType: value.recipeType.value}
        : {}
    )
  }
}
