import { Component, Inject, OnInit } from '@angular/core';
import { AppState } from '../../../../reducers';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyUnit, PaymentType } from '@minhdu-fontend/enums';
import { OrderAction } from '../../+state/order.action';
import { DatePipe } from '@angular/common';
import { District, Nation, Province, Ward } from '@minhdu-fontend/data-models';
import {
  selectAllNation,
  selectDistrictByProvinceId,
  selectorWardByDistrictId,
  selectProvincesByNationId
} from '@minhdu-fontend/location';
import { NationAction } from 'libs/location/src/lib/+state/nation/nation.action';
import { ProvinceAction } from 'libs/location/src/lib/+state/province/nation.action';
import { WardAction } from 'libs/location/src/lib/+state/ward/ward.action';
import { DistrictAction } from 'libs/location/src/lib/+state/district/district.action';
import { Customer } from '../../../customer/+state/customer/customer.interface';
import { selectorAllCustomer } from '../../../customer/+state/customer/customer.selector';
import { CustomerAction } from '../../../customer/+state/customer/customer.action';
import { selectAllCommodity } from '../../../commodity/+state/commodity.selector';
import { Commodity } from '../../../commodity/+state/commodity.interface';
import { CommodityAction } from '../../../commodity/+state/commodity.action';


@Component({
  templateUrl: 'order-dialog.component.html'
})
export class OrderDialogComponent implements OnInit {
  customers$ = this.store.pipe(select(selectorAllCustomer));
  commodities$ = this.store.pipe(select(selectAllCommodity));
  nations$ = this.store.pipe(select(selectAllNation));
  provinces$ = this.store.pipe(select(selectProvincesByNationId(
    this?.data?.order?.destination?.district?.province?.nation?.id
  )));
  districts$ = this.store.pipe(select(selectDistrictByProvinceId(
    this?.data?.order?.destination?.district?.province?.id
  )));
  wards$ = this.store.pipe(select(selectorWardByDistrictId(
    this?.data?.order?.destination?.district?.id
  )));
  numberChars = new RegExp('[^0-9]', 'g');
  payType = PaymentType;
  formGroup!: FormGroup;
  routes: number[] = [];
  customers: Customer[] = [];
  commodities: Commodity[] = [];
  commodityIds: number[] = [];
  provinces?: Province [];
  districts?: District [];
  wards?: Ward [];

  constructor(
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.store.dispatch(CustomerAction.loadInit({ take: 30, skip: 0 }));
    this.store.dispatch(CommodityAction.loadInit({ take: 30, skip: 0 }));
    this.customers$.subscribe(val => this.customers = JSON.parse(JSON.stringify(val)));
    this.commodities$.subscribe(val => this.commodities = JSON.parse(JSON.stringify(val)));
    console.log(this.commodities);
    this.store.dispatch(NationAction.loadAllNation());
    this.store.dispatch(ProvinceAction.loadAllProvinces());
    this.store.dispatch(DistrictAction.loadAllDistricts());
    this.store.dispatch(WardAction.loadAllWards());
    if (this.data) {
      this.provinces$.subscribe(val => this.provinces = val);
      this.districts$.subscribe(val => this.districts = val);
      this.wards$.subscribe(val => this.wards = val);
    }
    this.formGroup = this.formBuilder.group({
      createdAt: [this.datePipe.transform(
        this?.data?.order?.createdAt, 'yyyy-MM-dd')
        , Validators.required],
      explain: [this?.data?.order?.explain, Validators.required],
      nation: [this?.data?.order?.destination?.district?.province?.nation?.id, Validators.required],
      province: [this?.data?.order?.destination?.district?.province?.id, Validators.required],
      district: [this?.data?.order?.destination?.district?.id, Validators.required],
      ward: [this?.data?.order?.destination.id, Validators.required]
    });
  }



  onSubmit() {
    const val = this.formGroup.value;
    const order = {
      customerId: this.data.order.customerId,
      commodityIds: this.commodityIds,
      destinationId: val.ward,
      explain: val.explain
    };
    this.store.dispatch(OrderAction.updateOrder({ order: order, id: this.data.order.id }));
  }

  onNation(nation: Nation) {
    this.provinces = nation.provinces;
  }

  onProvince(province: Province) {
    this.districts = province.districts;
  }

  onDistrict(district: District) {
    this.wards = district.wards;
  }

  pickCommodity(commodityIds: number[]) {
    this.commodityIds = commodityIds;
  }
}
