import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EmployeeAction } from '../../+state/employee/employee.action';



@Component({
  templateUrl:'add-relative.component.html'
})
export class AddRelativeComponent implements OnInit{
  formGroup!: FormGroup;
  constructor(
  @Inject(MAT_DIALOG_DATA) public data:any,
  private readonly formBuilder: FormBuilder,
  private readonly store: Store,

  ) {
  }
  ngOnInit() {
    console.log(this.data.relative);
    this.formGroup = this.formBuilder.group({
      //profile
      firstName: [this.data?.relative?.profile?.firstName, Validators.required],
      lastName: [this.data?.relative?.profile?.lastName, Validators.required],
      issuedBy: [this.data?.relative?.profile?.issuedBy, Validators.required],
      religion: [this.data?.relative?.profile?.religion, Validators.required],
      ethnicity: [this.data?.relative?.profile?.ethnicity, Validators.required],
      birthplace: [this.data?.relative?.profile?.birthplace, Validators.required],
      ward: [this.data?.relative?.profile?.ward.id, Validators.required],
      province: [ this.data?.relative?.profile?.ward.district.province.id,Validators.required],
      district: [  this.data?.relative?.profile?.ward.district.id,Validators.required],
      address: [this.data?.relative?.profile?.address, Validators.required],
      identify: [this.data?.relative?.profile?.identify,Validators.required],
      idCardAt: [ this.data?.relative?.profile?.idCardAt,Validators.required],
      phone: [  this.data?.relative?.profile?.phone,Validators.required],
      birthday: [ this.data?.relative?.profile?.birthday,Validators.required],
      gender: [ this.data?.relative?.profile?.gender, Validators.required],
      note: [this.data?.relative?.profile?.note, Validators.required],
      relationship:[this.data?.relative?.relationship,Validators.required],
      career:[this.data?.relative?.career,Validators.required],
      sos:[this.data?.relative?.sos,Validators.required],
    });
  }

  onSubmit() {
    const value = this.formGroup.value
    const relative = {
      sos: value.sos,
      relationship: value.relationship,
      career: value.career,
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
        wardId: value.ward === null? 1: value.ward,
        religion: value.religion,
        ethnicity: value.ethnicity,
        address: value.address,
      },
      employeeId: this.data.id,
    }
    if (this.data.relative){
      this.store.dispatch(EmployeeAction.updateRelative( { relative : relative, employeeId:this.data.id, }))
    }
    this.store.dispatch(EmployeeAction.addRelative( { relative : relative }))
  }
}
