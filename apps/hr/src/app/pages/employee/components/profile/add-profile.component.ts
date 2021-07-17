import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import {
  selectAllNation,
  selectNationById
} from 'libs/location/src/lib/+state/nation/nation.selector';
import { District, Nation, Province, Ward } from '@minhdu-fontend/data-models';
import { NationAction } from 'libs/location/src/lib/+state/nation/nation.action';
import {
  selectDistrictById, selectDistrictByProvinceId, selectorWardByDistrictId,
  selectProvinceById, selectProvincesByNationId
} from '@minhdu-fontend/location';
import { ProvinceAction } from 'libs/location/src/lib/+state/province/nation.action';
import { DistrictAction } from 'libs/location/src/lib/+state/district/district.action';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WardAction } from '../../../../../../../../libs/location/src/lib/+state/ward/ward.action';

@Component({
  selector: 'app-add-profile',
  templateUrl: 'add-profile.component.html'
})

export class AddProfileComponent implements OnInit {
  @Input() public data!: any;
  destroy$ = new Subject();
  formGroup!: FormGroup;
  nations$ = this.store.pipe(select(selectAllNation));
  provinces?: Province[];
  districts?: District[];
  wards?: Ward[];

  constructor(
    private controlContainer: ControlContainer,
    private readonly store: Store
  ) {
  }


  ngOnInit(): void {
    this.store.dispatch(NationAction.loadAllNation());
    if (this.data) {
      this.store.dispatch(ProvinceAction.loadAllProvinces());
      this.store.dispatch(DistrictAction.loadAllDistricts());
      this.store.dispatch(WardAction.loadAllWards());
      this.store.pipe(select(selectProvincesByNationId(
        this?.data?.employee?.ward?.district?.province?.nation?.id)))
        .subscribe(val => this.provinces = val)
      this.store.pipe(select(selectDistrictByProvinceId(
        this?.data?.employee?.ward?.district?.province?.id)))
        .subscribe(val => this.districts = val)
      this.store.pipe(select(selectorWardByDistrictId(
        this?.data?.employee?.ward?.district?.id)))
        .subscribe(val => this.wards = val)
    }
  console.log(this.wards)
    this.formGroup = <FormGroup>this.controlContainer.control;
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
}
