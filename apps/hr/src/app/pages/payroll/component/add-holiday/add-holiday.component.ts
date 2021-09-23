import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Branch, Department } from '@minhdu-fontend/data-models';
import { DatePipe } from '@angular/common';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { HolidayAction } from '../../+state/holiday/holiday.action';
import {
  DepartmentActions,
  getDepartmentByBranchId
} from '../../../../../../../../libs/orgchart/src/lib/+state/department';


@Component({
  templateUrl: 'add-holiday.component.html'
})
export class AddHolidayComponent implements OnInit {
  submitted = false;
  branches$ = this.store.pipe(select(getAllOrgchart));
  departments$ = this.store.pipe(select(getDepartmentByBranchId(
    this?.data?.department?.branchId
  )));
  formGroup!: FormGroup;
  departments?: Department[];
  branches?: Branch[];

  constructor(
    public datePipe: DatePipe,
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly store: Store<AppState>,
    private readonly dialogRef: MatDialogRef<AddHolidayComponent>
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrgchartActions.init());
    this.store.dispatch(DepartmentActions.loadDepartment());
    this.departments$.subscribe(val => {
      this.departments = val;
    });
    this.formGroup = this.formBuilder.group({
      name: [this.data?.name, Validators.required],
      datetime: [
        this.datePipe.transform(
          this.data?.datetime, 'yyyy-MM-dd'
        ),
        Validators.required],
      rate: [this.data?.rate, Validators.required],
      department: [this.data?.department?.id, Validators.required],
      branch: [this.data?.department?.branchId, Validators.required]
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const val = this.formGroup.value;
    const holiday = {
      name: val.name,
      datetime: val.datetime,
      rate: val.rate,
      departmentId: val.department
    };
    if (this.data) {
      this.store.dispatch(HolidayAction.UpdateHoliday({ id: this.data?.id, holiday: holiday }));
    } else {
      this.store.dispatch(HolidayAction.AddHoliday({ holiday: holiday }));
    }
    this.dialogRef.close();
  }

  onBranch(branch: Branch) {
    this.departments = branch.departments;
  }

}
