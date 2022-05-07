import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Branch, Employee} from "@minhdu-fontend/data-models";
import {Actions} from "@datorama/akita-ng-effects";
import {DataAddOrUpdateCategory} from "../../data/modal-department.data";
import {BranchActions, BranchQuery, DepartmentActions} from "@minhdu-fontend/orgchart-v2";
import {tap} from "rxjs/operators";


@Component({
  templateUrl: 'modal-department.component.html'
})

export class ModalDepartmentComponent implements OnInit {
  @Input() data?: DataAddOrUpdateCategory
  branches$ = this.branchQuery.selectAll()
    .pipe(
      tap(branches => {
        if (branches.length === 1 && !this.data?.update) {
          this.formGroup.get('branch')?.setValue(branches[0])
        }
      }))

  employeeSelected: Employee[] = [];
  branchSelected?: Branch

  stepIndex = 0;
  submitting = false;

  formGroup!: FormGroup;
  compareFn = (o1: any, o2: any) => (o1 && o2 ? (o1 == o2.id || o1.id === o2.id) : o1 === o2);

  constructor(
    public datePipe: DatePipe,
    private readonly actions$: Actions,
    private readonly formBuilder: FormBuilder,
    private readonly branchQuery: BranchQuery,
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(BranchActions.loadAll({}))
    const department = this.data?.add?.department || this.data?.update?.department
    this.formGroup = this.formBuilder.group({
      branch: [department?.branch, Validators.required],
      name: [department?.name, Validators.required],
      note: [department?.note],
      employeeIds: [department?.employeeIds || []]
    });
  }


  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit() {
    this.submitting = true;

    if (this.formGroup.invalid) {
      return;
    }

    const department = this.mapDepartment();
    this.actions$.dispatch(
      this.data?.update
        ? DepartmentActions.update({id: this.data.update.department.id, updates: department})
        : DepartmentActions.addOne({body: department})
    )
  }

  mapDepartment() {
    const value = this.formGroup.value
    return {
      name: value.name,
      note: value.note,
      branchId: value.branch.id || value.branch,
      employeeIds: value.employeeIds
    }
  }

  move(type: 'next' | 'pre') {
    type === 'next' ? this.stepIndex += 1 : this.stepIndex -= 1
  }
}
