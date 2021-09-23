import { DatePipe } from '@angular/common';
import { Component, Inject, isDevMode, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Branch, Department, Position } from '@minhdu-fontend/data-models';
import { EmployeeAction, selectEmployeeAdded } from '@minhdu-fontend/employee';
import { FlatSalary } from '@minhdu-fontend/enums';
import { getAllOrgchart, OrgchartActions } from '@minhdu-fontend/orgchart';
import { select, Store } from '@ngrx/store';
import { EmployeeService } from 'libs/employee/src/lib/+state/service/employee.service';
import {
  DepartmentActions,
  getDepartmentByBranchId
} from 'libs/orgchart/src/lib/+state/department';
import {
  getPositionsByDepartmentId,
  PositionActions
} from 'libs/orgchart/src/lib/+state/position';
import { AppState } from '../../../../reducers';

@Component({
  templateUrl: 'add-employee.component.html',
})
export class AddEmployeeComponent implements OnInit {
  flatSalary = FlatSalary;
  formGroup!: FormGroup;
  positions$ = this.store.pipe(
    select(
      getPositionsByDepartmentId(this?.data?.employee?.position?.department?.id)
    )
  );
  departments$ = this.store.pipe(
    select(
      getDepartmentByBranchId(
        this?.data?.employee?.position?.department?.branch?.id
      )
    )
  );
  branches$ = this.store.pipe(select(getAllOrgchart));
  added$ = this.store.pipe(select(selectEmployeeAdded));
  departments?: Department[];
  branches?: Branch[];
  positions?: Position[];
  submitted = false;

  constructor(
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(LOCALE_ID) private locale: string,
    private readonly employeeService: EmployeeService,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly dialogRef: MatDialogRef<AddEmployeeComponent>
  ) {}

  ngOnInit(): void {
    this.added$.subscribe((val) => console.log(val));
    this.store.dispatch(OrgchartActions.init());
    this.store.dispatch(DepartmentActions.loadDepartment());
    this.store.dispatch(PositionActions.loadPosition());
    this.departments$.subscribe((val) => (this.departments = val));
    this.positions$.subscribe((val) => (this.positions = val));
    this.formGroup = this.formBuilder.group({
      identify: [
        isDevMode() ? '123456789' : this.data?.employee?.identify,
        Validators.required,
      ],
      issuedBy: [
        isDevMode() ? 'CA Bình Định' : this.data?.employee?.issuedBy,
        Validators.required,
      ],
      birthplace: [
        isDevMode() ? 'Phước Hiệp' : this.data?.employee?.birthplace,
        Validators.required,
      ],
      idCardAt: [
        isDevMode()
          ? this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          : this.datePipe.transform(
              this?.data?.employee?.idCardAt,
              'yyyy-MM-dd'
            ),
        Validators.required,
      ],
      email: [this.data?.employee?.email],
      phone: [
        isDevMode() ? '0337552146' : this.data?.employee?.phone,
        Validators.required,
      ],
      note: [this.data?.employee.note],
      workedAt: [
        isDevMode()
          ? this.datePipe.transform(new Date())
          : this.datePipe.transform(
              this.data?.employee?.workedAt,
              'yyyy-MM-dd'
            ),
        Validators.required,
      ],
      createdAt: [
        isDevMode()
          ? this.datePipe.transform(new Date())
          : this.datePipe.transform(
              this.data?.employee?.createdAt,
              'yyyy-MM-dd'
            ),
        Validators.required,
      ],
      isFlatSalary: [
        this.data?.employee?.isFlatSalary
          ? this.flatSalary.FLAT_SALARY
          : this.flatSalary.NOT_FLAT_SALARY,
        Validators.required,
      ],
      firstName: [
        isDevMode() ? 'Trần' : this.data?.employee?.firstName,
        Validators.required,
      ],
      lastName: [
        isDevMode() ? 'Long' : this.data?.employee?.lastName,
        Validators.required,
      ],
      address: [
        isDevMode() ? 'Đội 2' : this.data?.employee?.firstName,
        this.data?.employee?.address,
        Validators.required,
      ],
      gender: [this.data?.employee?.gender, Validators.required],
      birthday: [
        isDevMode()
          ? this.datePipe.transform(new Date())
          : this.datePipe.transform(
              this.data?.employee?.birthday,
              'yyyy-MM-dd'
            ),
        Validators.required,
      ],
      branch: [
        this.data?.employee?.position.department?.branch?.id,
        Validators.required,
      ],
      department: [
        this.data?.employee?.position?.department.id,
        Validators.required,
      ],
      position: [this.data?.employee?.position.id, Validators.required],
      ward: [this.data?.employee?.ward?.id, Validators.required],
      district: [this.data?.employee?.ward?.district?.id, Validators.required],
      province: [
        this.data?.employee?.ward?.district?.province?.id,
        Validators.required,
      ],
      // nation: [this.data?.employee?.ward?.district?.province?.nation?.id, Validators.required],
      ethnicity: [this.data?.employee?.ethnicity],
      religion: [this.data?.employee?.religion],
      facebook: [this.data?.employee?.facebook],
      zalo: [this.data?.employee?.zalo],
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const employee = {
      id: this?.data?.employee?.id,
      isFlatSalary: value.isFlatSalary === this.flatSalary.FLAT_SALARY,
      positionId: value.position,
      workedAt: value.workedAt,
      createdAt: value.createdAt,
      firstName: value.firstName,
      lastName: value.lastName,
      gender: value.gender,
      phone: value.phone.toString(),
      birthday: value.birthday,
      birthplace: value.birthplace,
      identify: value?.identify.toString(),
      idCardAt: value.idCardAt,
      issuedBy: value.issuedBy,
      wardId: value.ward === null ? 1 : value.ward,
      address: value.address,
      religion: value.religion ? value.religion : undefined,
      ethnicity: value.ethnicity ? value.ethnicity : undefined,
      email: value.email ? value.email : undefined,
      facebook: value?.facebook ? value.facebook : undefined,
      zalo: value?.zalo ? value?.zalo?.toString() : undefined,
      note: value.note ? value.note : undefined,
    };
    if (this.data !== null) {
      this.store.dispatch(
        EmployeeAction.updateEmployee({
          id: this.data.employee.id,
          employee: employee,
        })
      );
    } else {
      this.store.dispatch(EmployeeAction.addEmployee({ employee: employee }));
    }
    ///TODO: handle later
    this.store.pipe(select(selectEmployeeAdded)).subscribe((added) => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }

  onBranch(branch: Branch): void {
    this.departments = branch.departments;
  }

  onDepartment(department: Department): void {
    this.positions = department.positions;
  }
}
