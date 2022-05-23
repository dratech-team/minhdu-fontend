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
import {PositionEntity} from "@minhdu-fontend/orgchart-v2";

@Component({
  templateUrl: 'update-payroll.component.html'
})
export class UpdatePayrollComponent implements OnInit {
  @Input() data!: {
    payroll: PayrollEntity
  }
  formGroup!: FormGroup
  positions?: PositionEntity[];
  recipeTypeConstant = RecipeTypesConstant
  branches$ = this.branchQuery.selectAll().pipe(map(branches => {
    if (branches.length === 1) {
      this.positions = branches[0].positions
    } else {
      this.positions = branches.find(branch => branch.name === this.data.payroll.branch)?.positions
    }
    return branches
  }));
  updated$ = this.payrollQuery.select(state => state.updated)
  compareFN = (o1: any, o2: any) => (typeof o1 === 'string' && o2 ? o1 === o2.name : o1.id === o2.id);
  compareRecipe = (o1: any, o2: any) => (o1 && o2 ? (o1 === o2.value || o1.value === o2.value) : o1 === o2);

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
    const payroll = this.data.payroll
    this.actions$.dispatch(BranchActions.loadAll({}))
    this.formGroup = this.formBuilder.group({
      createdAt: [payroll.createdAt],
      branch: [payroll.branch],
      position: [payroll.position],
      workday: [payroll.workday],
      recipeType: [payroll.recipeType],
      isFlatSalary: [payroll.isFlatSalary],
      tax: [payroll.tax ? payroll.tax * 100 : ''],
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
    this.updated$.subscribe(updated => {
      if (updated) {
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
