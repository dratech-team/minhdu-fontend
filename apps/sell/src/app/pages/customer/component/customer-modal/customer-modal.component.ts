import {Component, Inject, Input, LOCALE_ID, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {CustomerResource, CustomerType} from '@minhdu-fontend/enums';
import {CustomerActions, CustomerQuery} from '../../+state';
import {Actions} from '@datorama/akita-ng-effects';
import {NzModalRef} from "ng-zorro-antd/modal";
import {CustomerConstant, ResourcesConstant} from "../../constants";
import {BaseAddCustomer, BaseUpdateCustomerDto} from "../../dto";

@Component({
  templateUrl: 'customer-modal.component.html'
})
export class CustomerModalComponent implements OnInit {
  @Input() data: any

  added$ = this.customerQuery.select(state => state.added)

  customerConstant = CustomerConstant.filter(item => item.value !== CustomerType.ALL)
  resourceConstant = ResourcesConstant.filter(item => item.value !== CustomerResource.ALL)

  submitted = false;
  provinceId: number | undefined;
  districtId: number | undefined;
  wardId: number | undefined;

  formGroup!: FormGroup

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private readonly formBuilder: FormBuilder,
    public datePipe: DatePipe,
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly modalRef: NzModalRef,
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
      isPotential: [this.data?.customer?.isPotential],
      province: [this.data?.customer?.province, Validators.required],
      district: [this.data?.customer?.district],
      ward: [this.data?.customer?.ward]
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
    const customer = this.mapCustomer(this.formGroup.value)
    if (this.data) {
      this.actions$.dispatch(CustomerActions.update({id: this.data.customer.id, updates: customer}));
    } else {
      this.actions$.dispatch(CustomerActions.addOne({body: customer}));
    }
    this.added$.subscribe(added => {
      if (added) {
        this.modalRef.close();
      }
    });
  }

  onSelectWard($event: number) {
    this.wardId = $event;
  }

  private mapCustomer(value: any) : BaseAddCustomer| BaseUpdateCustomerDto{
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


