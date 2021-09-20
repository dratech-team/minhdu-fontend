import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { FlatSalary } from '@minhdu-fontend/enums';
import {
  getAllOrgchart,
  OrgchartActions
} from '@minhdu-fontend/orgchart';
import { Branch, Department, Position } from '@minhdu-fontend/data-models';
import { DatePipe } from '@angular/common';
import { DepartmentActions, getDepartmentByBranchId } from 'libs/orgchart/src/lib/+state/department';
import { getPositionsByDepartmentId, PositionActions } from 'libs/orgchart/src/lib/+state/position';
import { EmployeeService } from 'libs/employee/src/lib/+state/service/employee.service';
import { EmployeeAction } from '@minhdu-fontend/employee';

@Component({
  templateUrl: 'BHYT.component.html'
})

export class BHYTComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(LOCALE_ID) private locale: string,
    private readonly employeeService: EmployeeService,
    private readonly formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      createdAt: [this.data?.createAt, Validators.required],
      endedAt: [this.data?.endedAt, Validators.required],
      BHYTId: [this.data?.BHYTId, Validators.required],
      PremiumRate: [this.data?.PremiumRate, Validators.required],
      provinceId: [this.data?.provinceId, Validators.required],
      IdBookBHXH: [this.data?.IdBookBHXH, Validators.required],
      codeBHXH: [this.data?.codeBHXH, Validators.required],
      registerPlaceKCB: [this.data?.registerPlaceKCB, Validators.required],
      registerPlaceId: [this.data?.registerPlaceId, Validators.required]
    });
  }

  onSubmit(): any {
    const value = this.formGroup.value;
    const BHYT = {};
    if (this.data.update) {
    } else {
    }
  }
}
