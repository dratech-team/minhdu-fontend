import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { getAllOrgchart, getBranchById, OrgchartActions } from '@minhdu-fontend/orgchart';
import { Branch, Department, Position } from '@minhdu-fontend/data-models';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';
import { DepartmentActions, getDepartmentById } from '../../../../../../../../libs/orgchart/src/lib/+state/department';
import { PositionActions } from '../../../../../../../../libs/orgchart/src/lib/+state/position';

@Component({
  templateUrl: 'template-overtime.component.html'
})
export class TemplateOvertimeComponent implements OnInit {
  typeUnit = DatetimeUnitEnum;
  formGroup!: FormGroup;
  departments?: Department[];
  positions?: Position[];
  branches$ = this.store.pipe(select(getAllOrgchart));
  branch$ = this.store.pipe(select(getBranchById(
    this?.data?.position?.department?.branch?.id
  )));
  department$ = this.store.pipe(select(getDepartmentById(
    this?.data?.position?.department?.id)));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store
  ) {
  }

  ngOnInit() {
    console.log(this?.data?.position?.id);
    this.store.dispatch(PositionActions.loadPosition());
    this.store.dispatch(OrgchartActions.init());
    this.store.dispatch(DepartmentActions.loadDepartment());
    this.branch$.subscribe(val => this.departments = val?.departments);
    this.department$.subscribe(val => this.positions = val?.positions);
    this.formGroup = this.formBuilder.group({
      title: [this?.data?.title, Validators.required],
      position: [this?.data?.positionId, Validators.required],
      branch: [this?.data?.position?.department?.branch?.id, Validators.required],
      department: [this?.data?.position?.department?.id, Validators.required],
      price: [this?.data?.price, Validators.required],
      unit: [this?.data?.unit, Validators.required],
      note: [this?.data?.note, Validators.required]
    });
  }

  onSubmit(): any {
    const value = this.formGroup.value;
    return {
      isUpdate: !!this.data,
      id: this?.data?.id,
      data:{
        title: value.title,
        positionId: value.position,
        price: value.price,
        unit: value.unit,
        note: value.note
      }
    };
  }

  onBranch(branch: Branch): void {
    this.departments = branch.departments;
  }

  onDepartment(department: Department): void {
    this.positions = department.positions;
  }

}
