import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EmployeeAction } from '../../+state/employee/employee.action';
import { Relative } from '../../+state/employee/employee.interface';


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
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      identify: ['',Validators.required],
      phone: [ '',Validators.required],
      birthday: [ '',Validators.required],
      gender: [ '', Validators.required],
      email: ['',Validators.required],
      relationship:['',Validators.required],
      career:['',Validators.required],
    });
  }

  onSubmit() {
    const value = this.formGroup.value
    const relative = {
      name: value.name,
      address: value.address,
      identify: value.identify.toString(),
      phone: value.phone,
      birthday: new Date(value.birthday),
      gender: value.gender,
      email:value.email,
      relationship: value.relationship,
      career: value.career,
      employeeId: this.data
    }
    this.store.dispatch(EmployeeAction.addRelative( { relative : relative}))
  }
}
