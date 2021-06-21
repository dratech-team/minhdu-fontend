import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../service/employee.service';
import { addEmployee } from '../../+state/employee/employee.action';
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
      //profile
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      issuedBy: ['', Validators.required],
      religion: ['', Validators.required],
      ethnicity: ['', Validators.required],
      birthplace: ['', Validators.required],
      ward: ['', Validators.required],
      province: [ '',Validators.required],
      district: [ '',Validators.required],
      address: ['', Validators.required],
      identify: ['',Validators.required],
      idCardAt: [ '',Validators.required],
      phone: [ '',Validators.required],
      birthday: [ '',Validators.required],
      gender: [ '', Validators.required],
      note: ['', Validators.required],

      isFlatSalary: ['', Validators.required],
      branch: ['', Validators.required],
      department: ['', Validators.required],
      position: ['',Validators.required],
      stayedAt: ['', Validators.required],
      workedAt: ['', Validators.required],
      createdAt: ['', Validators.required],

    });
  }
  onSubmit(): any {
    const value = this.formGroup.value;
    const employee = {
      isFlatSalary: value.isFlatSalary === 'flat',
      positionId: value.position === '' ? 1 : value.position,
      workedAt: new Date(value.workedAt),
      note: value.note,
      createdAt: new Date(value.createdAt),
      profile: {
        firstName: value.firstName,
        lastName: value.lastName,
        gender: value.gender,
        phone: value.phone,
        birthday: new Date(value.birthday),
        birthplace: value.birthplace,
        identify: value.identify.toString(),
        idCardAt: new Date(value.idCardAt),
        issuedBy: value.issuedBy,
        wardId: value.ward === ''? 1: value.ward,
        religion: value.religion,
        ethnicity: value.ethnicity,
        address: value.address,
      }
    };
      this.store.dispatch(addEmployee({ employee: employee }));
  }
}
