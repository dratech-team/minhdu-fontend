import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../service/employee.service';
import { addEmployee, EmployeeAction } from '../../+state/employee.action';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { FlatSalary } from '@minhdu-fontend/enums';

@Component({
  templateUrl: 'add-employee.component.html'
})

export class AddEmployeeComponent implements OnInit {
  flatSalary = FlatSalary;
  formGroup!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(LOCALE_ID) private locale: string,
    private readonly employeeService: EmployeeService,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      identify: [this?.data?.employee?.identify, Validators.required],
      issuedBy: [this?.data?.employee?.issuedBy, Validators.required],
      birthplace: [this?.data?.employee?.birthplace, Validators.required],
      idCardAt: [this?.data?.employee?.idCardAt, Validators.required],
      email: [this?.data?.employee?.email, Validators.required],
      phone: [this?.data?.employee?.phone, Validators.required],
      note: [this?.data?.employee.note, Validators.required],
      workedAt: [this?.data?.employee?.workedAt, Validators.required],
      createdAt: [this?.data?.employee?.createdAt, Validators.required],
      isFlatSalary: [this?.data?.employee?.isFlatSalary ?
        this.flatSalary.FLAT_SALARY :
        this.flatSalary.NOT_FLAT_SALARY
        , Validators.required],
      firstName: [this?.data?.employee?.firstName, Validators.required],
      lastName: [this?.data?.employee?.lastName, Validators.required],
      address: [this?.data?.employee?.address, Validators.required],
      gender: [this.data?.employee?.gender, Validators.required],
      birthday: [this?.data?.employee?.birthday, Validators.required],
      branch: [this?.data?.employee?.department?.branch?.id, Validators.required],
      department: [this?.data?.employee?.position?.department?.id, Validators.required],
      position: [this?.data?.employee?.position?.id, Validators.required],
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
      positionId: value.position === null ? 1 : value.position,
      workedAt: new Date(value.workedAt),
      note: value.note,
      createdAt: new Date(value.createdAt),
      facebook: value?.facebook,
      zalo: value?.zalo?.toString(),
      firstName: value.firstName,
      lastName: value.lastName,
      gender: value.gender,
      phone: value.phone.toString(),
      birthday: new Date(value.birthday),
      birthplace: value.birthplace,
      identify: value.identify.toString(),
      idCardAt: new Date(value.idCardAt),
      issuedBy: value.issuedBy,
      wardId: value.ward === null ? 3 : value.ward,
      religion: value.religion,
      ethnicity: value.ethnicity,
      address: value.address,
      email: value.email
    };
    if (this.data !== null) {
      this.store.dispatch(EmployeeAction.updateEmployee({ id: this.data.employee.id, employee: employee }));
    } else {
      this.store.dispatch(addEmployee({ employee: employee }));
    }
  }
}
