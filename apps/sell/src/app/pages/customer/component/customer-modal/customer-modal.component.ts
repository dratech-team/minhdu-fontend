import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CustomerResource, CustomerType } from '@minhdu-fontend/enums';
import { CustomerActions, CustomerQuery } from '../../state';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { CustomerTypeConstant, ResourcesConstant } from '../../constants';
import { BaseAddCustomer, BaseUpdateCustomerDto } from '../../dto';
import { ModalCustomerData } from '../../data/modal-customer.data';

@Component({
  templateUrl: 'customer-modal.component.html'
})
export class CustomerModalComponent implements OnInit {
  @Input() data?: ModalCustomerData;

  loading$ = this.customerQuery.selectLoading();

  customerConstant = CustomerTypeConstant.filter(
    (item) => item.value !== CustomerType.ALL
  );
  resourceConstant = ResourcesConstant.filter(
    (item) => item.value !== CustomerResource.ALL
  );

  submitted = false;
  provinceId: number | undefined;
  districtId: number | undefined;
  wardId: number | undefined;

  formGroup!: UntypedFormGroup;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private readonly formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly modalRef: NzModalRef
  ) {
  }

  ngOnInit() {
    const customer = this.data?.update?.customer;
    this.formGroup = this.formBuilder.group({
      firstName: [''],
      lastName: [customer?.lastName, Validators.required],
      identify: [customer?.identify],
      issuedBy: [customer?.issuedBy],
      birthplace: [customer?.birthplace],
      idCardAt: [
        customer?.idCardAt
          ? this.datePipe.transform(customer.idCardAt, 'yyyy-MM-dd')
          : ''
      ],
      email: [customer?.email],
      phone: [customer?.phone, Validators.required],
      note: [customer?.note],
      address: [customer?.address],
      gender: [customer?.gender],
      birthday: [
        customer?.birthday
          ? this.datePipe.transform(customer.birthday, 'yyyy-MM-dd')
          : ''
      ],
      ethnicity: [customer?.ethnicity],
      religion: [customer?.religion],
      type: [customer?.type],
      resource: [customer?.resource],
      isPotential: [customer?.isPotential],
      province: [customer?.province, Validators.required],
      district: [customer?.district],
      ward: [customer?.ward]
    });
  }

  get checkValid() {
    return this.formGroup.controls;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const customer = this.mapCustomer(this.formGroup.value);
    this.actions$.dispatch(
      this.data?.update
        ? CustomerActions.update({
          id: this.data.update.customer.id,
          updates: customer
        })
        : CustomerActions.addOne({ body: customer })
    );
    this.loading$.subscribe((loading) => {
      if (loading === false) {
        this.modalRef.close();
      }
    });
  }

  onSelectWard($event: number) {
    this.wardId = $event;
  }

  private mapCustomer(value: any): BaseAddCustomer | BaseUpdateCustomerDto {
    return {
      lastName: value.lastName,
      identify: value?.identify,
      gender: value.gender,
      phone: value.phone,
      issuedBy: value.issuedBy,
      birthday: value.birthday,
      birthplace: value.birthplace,
      idCardAt: value.idCardAt,
      customerType: value.type,
      resource: value.resource,
      address: value.address,
      provinceId: value.province.id,
      districtId: value?.district?.id,
      wardId: value?.ward?.id,
      email: value?.email,
      note: value?.note,
      ethnicity: value?.ethnicity,
      religion: value?.religion,
      isPotential: value?.isPotential,
      type: value.type
    };
  }
}
