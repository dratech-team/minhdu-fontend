import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  submitted = false;
  wardId!: number;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    public datePipe: DatePipe,
    private readonly store: Store<AppState>,
    private readonly dialogRef: MatDialogRef<CustomerDialogComponent>
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      identify: [this.data?.identify],
      issuedBy: [this.data?.issuedBy],
      birthplace: [this.data?.birthplace],
      idCardAt: [
        this.datePipe.transform(
          this?.data?.idCardAt, 'yyyy-MM-dd'
        )],
      email: [this.data?.email],
      phone: [this.data?.phone, Validators.required],
      note: [this.data?.note],
      firstName: [this.data?.firstName, Validators.required],
      lastName: [this.data?.lastName, Validators.required],
      address: [this.data?.address, Validators.required],
      gender: [this.data?.gender, Validators.required],
      birthday: [
        this.datePipe.transform(
          this?.data?.birthday, 'yyyy-MM-dd'
        )
        , Validators.required],
      ethnicity: [this.data?.ethnicity],
      religion: [this.data?.religion],
      type: [this.data?.type],
      resource: [this.data?.resource],
      isPotential: [this.data?.isPotential]
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const customer = {
      firstName: value.firstName ? value.firstName : undefined,
      lastName: value.lastName ? value.lastName : undefined,
      identify: value.identify? value.identify.toString() : undefined,
      gender: value.gender,
      phone: value.phone,
      issuedBy: value.issuedBy,
      birthday: value.birthday,
      birthplace: value.birthplace,
      idCardAt: value.idCardAt,
      type: value.type,
      resource: value.resource,
      address: value.address,
      wardId: this.wardId || this.data.ward.id,
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
    this.dialogRef.close();
  }

  onSelectWard($event: number) {
    this.wardId = $event;
  }
}


