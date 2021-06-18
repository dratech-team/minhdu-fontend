import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../service/employee.service';
import { addEmployee } from '../../+state/employee/employee.action';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { Employee } from '../../+state/employee/employee.interface';
import { UpdateEmployeeEnum } from './update-employee.enum';
import { FormalityEnum } from '../../../../../../../../libs/enums/formality.enum';
import { StatusEnum } from '../../../../../../../../libs/enums/degree-status.enum';
import { LevelEnum } from '../../../../../../../../libs/enums/level.enum';

@Component({
  templateUrl: 'update-employee.component.html'
})
export class UpdateEmployeeComponent implements OnInit {
  formalityEnum = FormalityEnum;
  status = StatusEnum;
  level = LevelEnum;
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
      typeSalary: ['', Validators.required],
      name: [this.data?.employee?.name, Validators.required],
      gender: [ this.data?.employee?.gender, Validators.required],
      birthday: [ this.data?.employee?.birthday,Validators.required],
      address: [this.data?.employee?.address, Validators.required],
      branchId: [this.data?.employee?.branchId, Validators.required],
      departmentId:[this.data?.employee?.departmentId, Validators.required],
      positionId: [this.data?.employee?.positionId,Validators.required],
      ethnic:[this.data?.employee?.religion, Validators.required],
      nation:[this.data?.employee?.nation, Validators.required],
      //CMND
      identify: [this.data.employee.identify,Validators.required],
      idCardAt: [this.data.employee.idCardAt, Validators.required],
      issuedBy:[this.data?.employee?.issuedBy, Validators.required],
      //FAMILY MEMBER
      marital: [this.data?.employee?.marital, Validators.required],
      familyMember:[this.data?.employee?.familyMember, Validators.required],
      //ACADEMIC LEVEL
      startedAt:[this.data?.employee?.startedAt, Validators.required],
      endedAt:[this.data?.employee?.endedAt, Validators.required],
      certificate:[this.data?.employee?.certificate, Validators.required],
      trainingBy:[this.data?.employee?.trainingBy, Validators.required],
      major: [this.data?.employee?.major, Validators.required],
      formality:[this.data?.employee?.formality, Validators.required],
      level:[this.data?.employee?.level, Validators.required],
      //Contact Info
      phone:[this.data?.employee?.level, Validators.required],
      facebook:[this.data?.employee?.level, Validators.required],
      zalo:[this.data?.employee?.zalo, Validators.required],
      email:[this.data?.employee?.email, Validators.required],
      birthplace:[this.data?.employee?.birthplace, Validators.required],
      //contact sos
      nameSOS:[this.data?.employee?.nameSOS, Validators.required],
      phoneSOS:[this.data?.employee?.phoneSOS, Validators.required],
      emailSOS:[this.data?.employee?.emailSOS, Validators.required],
      addressSOS:[this.data?.employee?.emailSOS, Validators.required],
      relationship:[this.data?.employee?.relationship, Validators.required],

      salaryType: ['',Validators.required],
      stayedAt: [this.data?.employee?.stayedAt, Validators.required],
      workedAt: [this.data?.employee?.workedAt, Validators.required],
      note: this.data?.employee?.note,
      createdAt: [this.data?.employee?.createdAt, Validators.required]
    });
  }

  onSubmit(): any {
    const value = this.formGroup.value;
    const employee = {
      name: value?.name,
      address: value.address,
      birthday: new Date(value.birthday),
      gender: value.gender,
      branchId: 1,
      departmentId: 1,
      positionId: 1,
      ethnic: value?.ethnic,
      religion: value?.religion,


      identify: value.identify.toString(),
      idCardAt: new Date(value.idCardAt),
      phone: value.phone,
      isFlatSalary: value.salaryType === 'flat',
      workedAt: new Date(value.workedAt),
      note: value.note,
      stayedAt: value.stayedAt ? new Date(value.stayedAt) : null,
      birthplace: 'sadasds',
      createdAt: new Date(value.createdAt)
    };
      this.store.dispatch(addEmployee({ employee: employee }));
  }
}
