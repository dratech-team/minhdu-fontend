import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {select} from '@ngrx/store';
import {DatePipe} from '@angular/common';
import {getAllOrgchart} from "@minhdu-fontend/orgchart";
import {Branch, Category, Employee} from "@minhdu-fontend/data-models";
import {MatSnackBar} from "@angular/material/snack-bar";
import {searchAutocomplete} from "@minhdu-fontend/utils";
import {catchError, startWith} from "rxjs/operators";
import {CategoryService} from "@minhdu-fontend/employee-v2";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Actions} from "@datorama/akita-ng-effects";
import {DataAddOrUpdateCategory} from "../../data/modal-category.data";
import {BranchActions, BranchQuery} from "@minhdu-fontend/orgchart-v2";
import {throwError} from "rxjs";


@Component({
  templateUrl: 'modal-category.component.html'
})

export class ModalCategoryComponent implements OnInit {
  @Input() data!: DataAddOrUpdateCategory
  branches$ = this.branchQuery.selectAll()

  employeeSelected: Employee[] = [];
  branchSelected?: Branch

  stepIndex = 0;
  submitting = false;

  formGroup!: FormGroup;

  constructor(
    public datePipe: DatePipe,
    private readonly actions$: Actions,
    private readonly formBuilder: FormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly categoryService: CategoryService,
    private readonly branchQuery: BranchQuery
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(BranchActions.loadAll({}))
    const category = this.data.add?.category || this.data.update?.category
    this.formGroup = this.formBuilder.group({
      name: [category?.name, Validators.required],
      note: [category?.note]
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

    const category = this.mapCategory();
    (this.data.add ? this.categoryService.addOne(category) : this.categoryService.update(this.data.update.category.id, category))
      .pipe(catchError(err => {
        this.submitting = false;
        return throwError(err)
      }))
      .subscribe(val => {
        if (val) {
          this.submitting = false;
          this.modalRef.close()
        }
      })
  }

  mapCategory() {
    const value = this.formGroup.value
    return {
      name: value.name,
      note: value.note,
      branchId: value.branch.id,
      employeeIds: value.employeeIds
    }
  }

  move(type: 'next' | 'pre') {
    type === 'next' ? this.stepIndex += 1 : this.stepIndex -= 1
  }
}
