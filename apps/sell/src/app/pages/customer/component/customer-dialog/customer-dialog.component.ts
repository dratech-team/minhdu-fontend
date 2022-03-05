import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { select } from '@ngrx/store';
import { CustomerResource, CustomerType } from '@minhdu-fontend/enums';
import { CustomerAction } from '../../+state/customer.action';
import { Actions } from '@datorama/akita-ng-effects';
import { CustomerQuery } from '../../+state/customer.query';

@Component({
  templateUrl: 'customer-dialog.component.html'
})
export class CustomerDialogComponent implements OnInit {
  formGroup!: FormGroup;
  customerType = CustomerType;
  resourceType = CustomerResource;
  submitted = false;
  provinceId: number | undefined;
  districtId: number | undefined;
  wardId: number | undefined;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    public datePipe: DatePipe,
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly dialogRef: MatDialogRef<CustomerDialogComponent>
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      firstName: [this.data?.customer?.firstName],
      lastName: [this.data?.customer?.lastName, Validators.required],
      identify: [this.data?.customer?.identify],
      issuedBy: [this.data?.customer?.issuedBy],
      birthplace: [this.data?.customer?.birthplace],
      idCardAt: [
        this.datePipe.transform(
          this.data?.customer?.idCardAt, 'yyyy-MM-dd'
        )],
      email: [this.data?.customer?.email],
      phone: [this.data?.customer?.phone, Validators.required],
      note: [this.data?.customer?.note],
      address: [this.data?.customer?.address],
      gender: [this.data?.customer?.gender],
      birthday: [
        this.datePipe.transform(
          this.data?.customer?.birthday, 'yyyy-MM-dd'
        )],
      ethnicity: [this.data?.customer?.ethnicity],
      religion: [this.data?.customer?.religion],
      type: [this.data?.customer?.type],
      resource: [this.data?.customer?.resource],
      isPotential: [this.data?.customer?.isPotential]
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
      identify: value.identify ? value.identify.toString() : undefined,
      gender: value.gender,
      phone: value.phone,
      issuedBy: value.issuedBy,
      birthday: value.birthday,
      birthplace: value.birthplace,
      idCardAt: value.idCardAt,
      type: value.type,
      resource: value.resource,
      address: value.address,
      provinceId: this.provinceId || this.data?.customer?.province?.id,
      districtId: this.districtId || this.data?.customer?.district?.id,
      wardId: this.wardId || this.data?.customer?.ward?.id,
      email: value.email ? value.email : undefined,
      note: value.note ? value.note : undefined,
      ethnicity: value.ethnicity ? value.ethnicity : undefined,
      religion: value.religion ? value.religion : undefined,
      isPotential: value.isPotential ? value.isPotential : undefined
    };

    if (this.data) {
      this.actions$.dispatch(CustomerAction.updateCustomer({ customer: customer, id: this.data.customer.id }));
    } else {
      this.actions$.dispatch(CustomerAction.addOne({ customer: customer }));
    }
    this.customerQuery.selectLoading().subscribe(added => {
      if (added) {
        this.dialogRef.close();
      }
    });
  }

  onSelectWard($event: number) {
    this.wardId = $event;
  }
}


