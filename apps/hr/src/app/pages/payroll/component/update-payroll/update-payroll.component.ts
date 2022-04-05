import {Component, Inject, OnInit} from "@angular/core";
import {DatePipe} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {getAllOrgchart, OrgchartActions} from "@minhdu-fontend/orgchart";
import {Branch, Position} from "@minhdu-fontend/data-models";
import {map} from "rxjs/operators";
import {selectedAddedPayroll} from "../../+state/payroll/payroll.selector";
import {RecipeTypesConstant} from "@minhdu-fontend/constants";
import {PayrollAction} from "../../+state/payroll/payroll.action";
import {PositionActions} from "@minhdu-fontend/orgchart-position";
import {FlatSalary} from "@minhdu-fontend/enums";

@Component({
  templateUrl: 'update-payroll.component.html'
})
export class UpdatePayrollComponent implements OnInit {
  formGroup!: FormGroup
  positions?: Position[];
  recipeTypeConstant = RecipeTypesConstant
  branches$ = this.store.pipe(select(getAllOrgchart)).pipe(map(branches => {
    if (branches.length === 1) {
      this.positions = branches[0].positions
    } else {
      this.positions = branches.find(branch => branch.name === this.data.payroll.branch)?.positions
    }

    return branches
  }));
  flatSalaryEnum = FlatSalary
  compareFN = (o1: any, o2: any) => (typeof o1 === 'string' && o2 ? o1 === o2.name : o1.id === o2.id);
  compareRecipe = (o1: any, o2: any) => (typeof o1 === 'string' && o2 ? o1 === o2.value : o1.value === o2.value);

  constructor(
    private readonly datePipe: DatePipe,
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<UpdatePayrollComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init())
    this.formGroup = this.formBuilder.group({
      createdAt: [this.datePipe.transform(this.data.payroll.createdAt, 'yyyy-MM-dd'), Validators.required],
      branch: [this.data.payroll.branch, Validators.required],
      position: [this.data.payroll.position, Validators.required],
      workday: [this.data.payroll.workday, Validators.required],
      recipeType: [this.data.payroll.recipeType, Validators.required],
      isFlatSalary: [!!this.data.payroll.isFlatSalary, Validators.required],
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
    const value = this.formGroup.value
    const payroll = {
      workday: value.workday,
      createdAt: value.createdAt,
      isFlatSalary: value.isFlatSalary
    }
    if (value.tax) {
      Object.assign(payroll, {tax: value.tax / 100,})
    }
    if (value.position?.id) {
      Object.assign(payroll, {positionId: value.position.id,})
    }
    if (value.branch?.id) {
      Object.assign(payroll, {branchId: value.branch.id,})
    }
    if (value.recipeType?.value) {
      Object.assign(payroll, {recipeType: value.recipeType.value})
    }
    this.store.dispatch(PayrollAction.updatePayroll({
      id: this.data.payroll.id,
      payroll: payroll
    }))
    this.store.select(selectedAddedPayroll).subscribe(added => {
      if (added) {
        this.dialogRef.close()
      }
    })
  }
}
