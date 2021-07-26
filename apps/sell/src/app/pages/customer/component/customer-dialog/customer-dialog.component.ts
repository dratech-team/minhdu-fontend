import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from 'apps/sell/src/app/reducers';
import { CustomerResource, CustomerType } from '@minhdu-fontend/enums';
import { CustomerAction } from '../../+state/customer/customer.action';

@Component({
  templateUrl: 'customer-dialog.component.html'
})
export class CustomerDialogComponent implements OnInit {
  formGroup!: FormGroup;
  customerType = CustomerType;
  resourceType = CustomerResource;

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
          this?.data?.idCardAt, 'yyyy-MM-dd'
        )
        , Validators.required],
      email: [this?.data?.email, Validators.required],
      phone: [this?.data?.phone, Validators.required],
      note: [this?.data?.note, Validators.required],
      firstName: [this?.data?.firstName, Validators.required],
      lastName: [this?.data?.lastName, Validators.required],
      address: [this?.data?.address, Validators.required],
      gender: [this.data?.gender, Validators.required],
      birthday: [
        this.datePipe.transform(
          this?.data?.birthday, 'yyyy-MM-dd'
        )
        , Validators.required],
      ward: [this?.data?.ward?.id, Validators.required],
      district: [this?.data?.ward?.district?.id, Validators.required],
      province: [this?.data?.ward?.district?.province?.id, Validators.required],
      nation: [this?.data?.ward?.district?.province?.nation?.id, Validators.required],
      ethnicity: [this?.data?.ethnicity, Validators.required],
      religion: [this?.data?.religion, Validators.required],
      type: [this?.data?.type, Validators.required],
      resource: [this?.data?.resource, Validators.required],
      isPotential: [this?.data?.isPotential, Validators.required]
    });
  }

  onSubmit() {
    const value = this.formGroup.value;
    const customer = {
      firstName: value.firstName ? value.firstName : undefined,
      lastName: value.lastName ? value.lastName : undefined,
      identify: value.identify.toString(),
      gender: value.gender,
      phone: value.phone,
      issuedBy: value.issuedBy,
      birthday: value.birthday,
      birthplace: value.birthplace,
      idCardAt: value.idCardAt,
      type: value.type,
      resource: value.resource,
      address: value.address,
      wardId: value.ward ? value.ward : undefined,
      email: value.email ? value.email : undefined,
      note: value.note ? value.note : undefined,
      ethnicity: value.ethnicity ? value.ethnicity : undefined,
      religion: value.religion ? value.religion : undefined,
      isPotential: value.isPotential ? value.isPotential : undefined
    };
    if (this.data) {
      this.store.dispatch(CustomerAction.updateCustomer({ customer: customer, id: this.data.id }));
    } else {
      this.store.dispatch(CustomerAction.addCustomer({ customer: customer }));
    }

  }
}


