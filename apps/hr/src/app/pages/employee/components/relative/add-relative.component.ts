import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EmployeeAction } from '@minhdu-fontend/employee';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: 'add-relative.component.html'
})
export class AddRelativeComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store
  ) {
  }

  ngOnInit() {
    console.log(this.data?.relative?.profile?.firstName);
    this.formGroup = this.formBuilder.group({
      firstName: [this.data?.relative?.firstName, Validators.required],
      lastName: [this.data?.relative?.lastName, Validators.required],
      issuedBy: [this.data?.relative?.issuedBy, Validators.required],
      religion: [this.data?.relative?.religion, Validators.required],
      ethnicity: [this.data?.relative?.ethnicity, Validators.required],

      birthplace: [
        this.data?.relative?.birthplace, Validators.required],
      ward: [this.data?.relative?.ward?.id, Validators.required],
      province: [this.data?.relative?.ward?.district?.province?.id, Validators.required],
      district: [this.data?.relative?.ward?.district?.id, Validators.required],
      address: [this.data?.relative?.address, Validators.required],
      identify: [this.data?.relative?.identify, Validators.required],
      idCardAt: [
        this.datePipe.transform(
          this?.data?.relative?.idCardAt, 'yyyy-MM-dd'
        )
        , Validators.required],
      phone: [this.data?.relative?.phone, Validators.required],
      birthday: [
        this.datePipe.transform(
          this?.data?.relative?.birthday, 'yyyy-MM-dd'
        )
        , Validators.required],
      gender: [this.data?.relative?.gender, Validators.required],
      note: [this.data?.relative?.note, Validators.required],
      relationship: [this.data?.relative?.relationship, Validators.required],
      career: [this.data?.relative?.career, Validators.required],
      sos: [this.data?.relative?.sos, Validators.required]
    });
  }

  onSubmit() {
    const value = this.formGroup.value;
    const relative = {
      sos: value.sos,
      relationship: value.relationship,
      career: value.career,
      firstName: value.firstName,
      lastName: value.lastName,
      gender: value.gender,
      phone: value.phone,
      birthplace: value.birthplace,
      identify: value.identify.toString(),
      issuedBy: value.issuedBy,
      wardId: value.ward === null ? 1 : value.ward,
      address: value.address,
      employeeId: this?.data?.employeeId,
      birthday: value.birthday ? new Date(value.birthday) : undefined,
      idCardAt: value.idCardAt ? new Date(value.idCardAt) : undefined,
      religion: value.religion ? value.religion: undefined,
      ethnicity: value.ethnicity ? value.ethnicity: undefined,
    };
    if (this.data.relative) {
      this.store.dispatch(EmployeeAction.updateRelative(
        { relative: relative, id: this.data.id, employeeId: this.data.employeeId }));
    } else {
      this.store.dispatch(EmployeeAction.addRelative({ relative: relative }));
    }
  }
}
