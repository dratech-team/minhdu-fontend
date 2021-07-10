import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { FlatSalary } from '@minhdu-fontend/enums';
import {
  getAllOrgchart,
  getBranchById,
  OrgchartActions
} from '@minhdu-fontend/orgchart';
import { Branch, Department, Position } from '@minhdu-fontend/data-models';
import { DatePipe } from '@angular/common';
import { DepartmentActions, getDepartmentById } from 'libs/orgchart/src/lib/+state/department';
import { PositionActions } from 'libs/orgchart/src/lib/+state/position';
import { EmployeeService } from 'libs/employee/src/lib/+state/service/employee.service';
import { EmployeeAction } from '@minhdu-fontend/employee';



@Component({
  templateUrl: 'add-employee.component.html'
})

export class AddEmployeeComponent implements OnInit {
  flatSalary = FlatSalary;
  formGroup!: FormGroup;
  branches$ = this.store.pipe(select(getAllOrgchart));
  branch$ = this.store.pipe(select(getBranchById(
    this?.data?.employee?.position?.department?.branch?.id
  )));
  department$ = this.store.pipe(select(getDepartmentById(
    this?.data?.employee?.position?.department?.id)));
  departments?: Department[];
  positions?: Position[];

  constructor(
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(LOCALE_ID) private locale: string,
    private readonly employeeService: EmployeeService,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(OrgchartActions.init());
    this.store.dispatch(DepartmentActions.loadDepartment());
    this.store.dispatch(PositionActions.loadPosition());
    this.branch$.subscribe(val => this.departments = val?.departments);
    this.department$.subscribe(val => this.positions = val?.positions);

    this.formGroup = this.formBuilder.group({
      identify: [this?.data?.employee?.identify, Validators.required],
      issuedBy: [this?.data?.employee?.issuedBy, Validators.required],
      birthplace: [this?.data?.employee?.birthplace, Validators.required],
      idCardAt: [
        this.datePipe.transform(
          this?.data?.employee?.idCardAt, 'yyyy-MM-dd'
        )
        , Validators.required],
      email: [this?.data?.employee?.email, Validators.required],
      phone: [this?.data?.employee?.phone, Validators.required],
      note: [this?.data?.employee.note, Validators.required],
      workedAt: [
        this.datePipe.transform(
          this?.data?.employee?.workedAt, 'yyyy-MM-dd'
        )
        , Validators.required],
      createdAt: [
        this.datePipe.transform(
          this?.data?.employee?.createdAt, 'yyyy-MM-dd'
        )
        , Validators.required],
      isFlatSalary: [this?.data?.employee?.isFlatSalary ?
        this.flatSalary.FLAT_SALARY :
        this.flatSalary.NOT_FLAT_SALARY
        , Validators.required],
      firstName: [this?.data?.employee?.firstName, Validators.required],
      lastName: [this?.data?.employee?.lastName, Validators.required],
      address: [this?.data?.employee?.address, Validators.required],
      gender: [this.data?.employee?.gender, Validators.required],
      birthday: [
        this.datePipe.transform(
          this?.data?.employee?.birthday, 'yyyy-MM-dd'
        )
        , Validators.required],
      branch: [this?.data?.employee?.position.department?.branch?.id, Validators.required],
      department: [this?.data?.employee?.position?.department.id, Validators.required],
      position: [this?.data?.employee?.position.id, Validators.required],
      ward: [this?.data?.employee?.profile?.ward?.id, Validators.required],
      district: [this?.data?.employee?.ward?.district?.id, Validators.required],
      province: [this?.data?.employee?.ward?.district?.province?.id, Validators.required],
      ethnicity: [this?.data?.employee?.ethnicity, Validators.required],
      religion: [this?.data?.employee?.religion, Validators.required],
      facebook: [this?.data?.employee?.facebook, Validators.required],
      zalo: [this?.data?.employee?.zalo, Validators.required]
    });
  }

  onSubmit(): any {
    const value = this.formGroup.value;
    const employee = {
      id: this?.data?.employee?.id,
      isFlatSalary: value.isFlatSalary === this.flatSalary.FLAT_SALARY,
      positionId: value.position,
      workedAt: new Date(value.workedAt),
      createdAt: new Date(value.createdAt),
      firstName: value.firstName,
      lastName: value.lastName,
      gender: value.gender,
      phone: value.phone.toString(),
      birthday: new Date(value.birthday),
      birthplace: value.birthplace,
      identify: value?.identify.toString(),
      idCardAt: new Date(value.idCardAt),
      issuedBy: value.issuedBy,
      wardId: value.ward === null ? 1 : value.ward,
      address: value.address,
      religion: value.religion ? value.religion: undefined,
      ethnicity: value.ethnicity ? value.ethnicity: undefined,
      email: value.email? value.email: undefined,
      facebook: value?.facebook ? value.facebook : undefined,
      zalo: value?.zalo ? value?.zalo?.toString(): undefined,
      note: value.note ? value.note : undefined,
    };
    if (this.data !== null) {
      this.store.dispatch(EmployeeAction.updateEmployee({ id: this.data.employee.id, employee: employee }));
    } else {
      this.store.dispatch(EmployeeAction.addEmployee({ employee: employee }));
    }
  }

  onBranch(branch: Branch): void {
    this.departments = branch.departments;
  }

  onDepartment(department: Department): void {
    this.positions = department.positions;
  }
}
