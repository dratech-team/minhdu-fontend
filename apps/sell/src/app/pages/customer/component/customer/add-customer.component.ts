import { Component, Inject,LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from 'apps/sell/src/app/reducers';


@Component({
  templateUrl: 'add-customer.component.html'
})
export class AddCustomerComponent implements OnInit {
  formGroup!: FormGroup;
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    public datePipe: DatePipe,
    private readonly store: Store<AppState>
  ) {
  }
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      identify: [this?.data?.identify, Validators.required],
      issuedBy: [this?.data?.issuedBy, Validators.required],
      birthplace: [this?.data?.birthplace, Validators.required],
      idCardAt: [
        this.datePipe.transform(
          this?.data?.employee?.idCardAt, 'yyyy-MM-dd'
        )
        , Validators.required],
      email: [this?.data?.email, Validators.required],
      phone: [this?.data?.phone, Validators.required],
      note: [this?.data?.note, Validators.required],
      firstName: [this?.data?.employee?.firstName, Validators.required],
      lastName: [this?.data?.employee?.lastName, Validators.required],
      address: [this?.data?.employee?.address, Validators.required],
      gender: [this.data?.employee?.gender, Validators.required],
      birthday: [
        this.datePipe.transform(
          this?.data?.employee?.birthday, 'yyyy-MM-dd'
        )
        , Validators.required],
      ward: [this?.data?.ward?.id, Validators.required],
      district: [this?.data?.ward?.district?.id, Validators.required],
      province: [this?.data?.ward?.district?.province?.id, Validators.required],
      ethnicity: [this?.data?.ethnicity, Validators.required],
      religion: [this?.data?.religion, Validators.required],
      facebook: [this?.data?.facebook, Validators.required],
      zalo: [this?.data?.zalo, Validators.required]
    });
  }
  onSubmit() {
  }
}
