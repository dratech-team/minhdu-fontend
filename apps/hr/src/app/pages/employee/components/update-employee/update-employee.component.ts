import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../service/employee.service';
import { addEmployee, addRelative } from '../../+state/employee.action';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { UpdateEmployeeEnum } from './update-employee.enum';
import { FormalityEnum } from '../../../../../../../../libs/enums/formality.enum';
import { DegreeStatusEnum } from '../../../../../../../../libs/enums/degree-status.enum';
import { DegreeLevelEnum } from '../../../../../../../../libs/enums/degree-level.enum';
import { RelationshipEnum } from '../../../../../../../../libs/enums/relationship.enum';

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
      isFlatSalary: [this.data.employee.isFlatSalary, Validators.required],
      firstName: [this.data.employee.profile.firstName, Validators.required],
      lastName: [this.data.employee.profile.lastName, Validators.required],
      address: [this.data.employee.profile.address, Validators.required],
      gender: [ this.data?.employee.profile.gender, Validators.required],
      birthday: [ this.data.employee.profile.birthday,Validators.required],
      branch: [this.data.employee.position.department.branch.id, Validators.required],
      department:[this.data.employee.position.department.id, Validators.required],
      position: [this.data.employee.position.id,Validators.required],
      ward: [this.data.employee.profile.ward.id, Validators.required],
      district: [this.data.employee.profile.ward.district.id,Validators.required],
      province: [ this.data.employee.profile.ward.district.province.id,Validators.required],
      religion:[this.data.employee.profile?.religion, Validators.required],
      ethnicity:[this.data.employee.profile?.ethnicity,Validators.required],
      //CMND
      identify: [this.data.employee.profile.identify ,Validators.required],
      idCardAt: [this.data.employee.profile.idCardAt, Validators.required],
      issuedBy:[this.data.employee.profile.issuedBy, Validators.required],
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
      phone:[this.data.employee.profile.phone, Validators.required],
      facebook:[this.data.employee?.social?.facebook, Validators.required],
      zalo:[this.data?.employee?.social?.zalo, Validators.required],
      email:[this.data.employee?.profile?.email, Validators.required],
      birthplace:[this.data?.employee.profile.birthplace, Validators.required],

      //Relative
      nameSOS:[this.data?.relative?.nameRelative, Validators.required],
      phoneSOS:[this.data?.relative?.phoneRelative, Validators.required],
      emailSOS:[this.data?.relative?.emailRelative, Validators.required],
      SOS:[this.data?.relative?.SOS, Validators.required],
      relationship:[this.data?.relative?.relationship, Validators.required],
      career:[this.data?.relative?.career, Validators.required],


      salaryType: ['',Validators.required],
      stayedAt: [this.data?.employee?.stayedAt, Validators.required],
      workedAt: [this.data?.employee?.workedAt, Validators.required],
      note: this.data?.employee?.note,
      createdAt: [this.data?.employee?.createdAt, Validators.required]
    });
  }

  onSubmit(): any {
    const value = this.formGroup.value;
    const relative = {
        sos: value.SOS,
        relationship: value.relationship,
        career: value.career,

        profile:{
          id: this.data.relative.id,
          name: value?.name,
          address: value.address,
          identify: value.identify.toString(),
          idCardAt: new Date(value.idCardAt),
          issuedBy: value.issuedBy,
          birthday: new Date(value.birthday),
          birthplace: value.birthplace,
          gender: value.gender,
          phone: value.phone,
          wardId: value.ward,
          ethnic: value?.ethnic,
          religion: value?.religion,
        }
    }
    const employee = {
      isFlatSalary: value.salaryType === 'flat',
      positionId: value.position === null? 1: value.position,
      createdAt: new Date(value.createdAt),
      social:{
        facebook: value.facebook,
        zalo: value.zalo,
      },
      profile:{
        name: value?.name,
        address: value.address,
        identify: value.identify.toString(),
        idCardAt: new Date(value.idCardAt),
        issuedBy: value.issuedBy,
        birthday: new Date(value.birthday),
        birthplace: value.birthplace,
        gender: value.gender,
        phone: value.phone,
        wardId: value.ward,
        ethnic: value?.ethnic,
        religion: value?.religion,
      },
      workedAt: new Date(value.workedAt),
      note: value.note,
      // stayedAt: value.stayedAt ? new Date(value.stayedAt) : null,
    };
      this.store.dispatch(addEmployee({ employee: employee }));
  }
}
