import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../service/employee.service';
import { addEmployee, EmployeeAction } from '../../+state/employee.action';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';

@Component({
  templateUrl: 'add-employee.component.html'
})

export class AddEmployeeComponent implements OnInit {
  formGroup!: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly employeeService: EmployeeService,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      identify: [this?.data?.employee?.profile?.identify, Validators.required],
      issuedBy: [this?.data?.employee?.profile?.issuedBy, Validators.required],
      birthplace: [this?.data?.employee?.profile?.birthplace, Validators.required],
      idCardAt: [this?.data?.employee?.profile?.idCardAt, Validators.required],
      email: [this?.data?.employee?.profile?.email, Validators.required],
      phone: [this?.data?.employee?.profile?.phone, Validators.required],
      note: [this?.data?.employee?.note, Validators.required],
      workedAt: [this?.data?.employee?.workedAt, Validators.required],
      createdAt: [this?.data?.employee?.createdAt, Validators.required],
      isFlatSalary: [this?.data?.employee?.isFlatSalary, Validators.required],
      firstName: [this?.data?.employee?.profile?.firstName, Validators.required],
      lastName: [this?.data?.employee?.profile?.lastName, Validators.required],
      address: [this?.data?.employee?.profile?.address, Validators.required],
      gender: [this.data?.employee?.profile?.gender, Validators.required],
      birthday: [this?.data?.employee?.profile?.birthday, Validators.required],
      branch: [this?.data?.employee?.position?.department?.branch?.id, Validators.required],
      department: [this?.data?.employee?.position?.department?.id, Validators.required],
      position: [this?.data?.employee?.position?.id, Validators.required],
      ward: [this?.data?.employee?.profile?.ward?.id, Validators.required],
      district: [this?.data?.employee?.profile?.ward?.district?.id, Validators.required],
      province: [this?.data?.employee?.profile?.ward?.district?.province?.id, Validators.required],
      ethnicity: [this?.data?.employee?.profile?.ethnicity, Validators.required],
      religion: [this?.data?.employee?.profile?.religion, Validators.required],
      facebook: [this?.data?.employee?.social?.facebook, Validators.required],
      zalo: [this?.data?.employee?.social?.zalo, Validators.required]
    });
  }

  onSubmit(): any {
    const value = this.formGroup.value;
    const employee = {
      id: this?.data?.employee?.id,
      isFlatSalary: value.isFlatSalary === 'flat',
      positionId: value.position === null ? 1 : value.position,
      workedAt: new Date(value.workedAt),
      note: value.note,
      createdAt: new Date(value.createdAt),
      social: {
        facebook: value?.facebook,
        zalo: value?.zalo?.toString()
      },
      profile: {
        firstName: value.firstName,
        lastName: value.lastName,
        gender: value.gender,
        phone: value.phone.toString(),
        birthday: new Date(value.birthday),
        birthplace: value.birthplace,
        identify: value.identify.toString(),
        idCardAt: new Date(value.idCardAt),
        issuedBy: value.issuedBy,
        wardId: value.ward === null ? 1 : value.ward,
        religion: value.religion,
        ethnicity: value.ethnicity,
        address: value.address,
        email: value.email
      }
    };
    if (this.data !== null) {
      this.store.dispatch(EmployeeAction.updateEmployee({ id: this.data.employee.id, employee: employee }));
    } else {
      this.store.dispatch(addEmployee({ employee: employee }));
    }
  }
}
