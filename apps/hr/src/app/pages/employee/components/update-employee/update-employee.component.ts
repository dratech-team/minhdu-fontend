import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../service/employee.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { UpdateEmployeeEnum } from './update-employee.enum';
import { FormalityEnum } from '../../../../../../../../libs/enums/formality.enum';
import { DegreeStatusEnum } from '../../../../../../../../libs/enums/degree-status.enum';
import { DegreeLevelEnum } from '../../../../../../../../libs/enums/degree-level.enum';
import { EmployeeAction } from '../../+state/employee.action';


@Component({
  templateUrl: 'update-employee.component.html'
})
export class UpdateEmployeeComponent implements OnInit {
  formalityEnum = FormalityEnum;
  status = DegreeStatusEnum;
  level = DegreeLevelEnum;
  formGroup!: FormGroup;
  updateType =UpdateEmployeeEnum;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly employeeService: EmployeeService,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>
  ) {
  }

  ngOnInit(): void {
    //General info
    this.formGroup = this.formBuilder.group({
      //CMND
      identify: [this.data.employee.profile.identify ,Validators.required],
      idCardAt: [this.data.employee.profile.idCardAt, Validators.required],
      issuedBy:[this.data.employee.profile.issuedBy, Validators.required],
      //Contact Info
      phone:[this.data.employee.profile.phone, Validators.required],
      facebook:[this.data.employee?.social?.facebook, Validators.required],
      zalo:[this.data?.employee?.social?.zalo, Validators.required],
      email:[this.data.employee?.profile?.email, Validators.required],
      birthplace:[this.data?.employee.profile.birthplace, Validators.required],

      stayedAt: [this.data?.employee?.stayedAt, Validators.required],
      workedAt: [this.data?.employee?.workedAt, Validators.required],
      note: this.data?.employee?.note,
      createdAt: [this.data?.employee?.createdAt, Validators.required]
    });
  }

  onSubmit(): any {

    const value = this.formGroup.value;
    console.log(value.religion)
    const employee = {
      isFlatSalary: value.salaryType === 'flat',
      positionId: value.position === null? 1: value.position,
      createdAt: new Date(value.createdAt),
      social:{
        facebook: value.facebook,
        zalo: value.zalo,
      },
      profile:{
        firstName: value.firstName,
        lastName: value.lastName,
        address: value.address,
        identify: value.identify.toString(),
        idCardAt: new Date(value.idCardAt),
        issuedBy: value.issuedBy,
        birthday: new Date(value.birthday),
        birthplace: value.birthplace,
        gender: value.gender,
        phone: value.phone,
        wardId: value.ward,
        ethnic: value.ethnic,
        religion: value.religion,
        ethnicity:value.ethnicity,
      },
      workedAt: new Date(value.workedAt),
      note: value.note,
    };
      this.store.dispatch(EmployeeAction.updateEmployee({id:this.data.employee.profile.id , employee: employee }));
  }
}
