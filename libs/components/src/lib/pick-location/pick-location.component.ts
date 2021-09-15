import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  selectAllNation, selectAllProvince,
  selectDistrictByProvinceId,
  selectorWardByDistrictId,
  selectProvincesByNationId
} from '@minhdu-fontend/location';
import { District, Nation, Province, Ward } from '@minhdu-fontend/data-models';
import { AppState } from '../../../../../apps/sell/src/app/reducers';
import { NationAction } from 'libs/location/src/lib/+state/nation/nation.action';
import { ProvinceAction } from 'libs/location/src/lib/+state/province/nation.action';
import { WardAction } from 'libs/location/src/lib/+state/ward/ward.action';
import { DistrictAction } from 'libs/location/src/lib/+state/district/district.action';
import { ControlContainer, FormGroup } from '@angular/forms';
import {  Subject } from 'rxjs';

@Component({
  selector: 'app-pick-location',
  templateUrl:'pick-location.component.html'
})
export class PickLocationComponent implements OnInit {
  @Input() data?: any;
  @Input() reload$?: Subject<boolean>
  provinces$ = this.store.pipe(select(selectAllProvince));
  districts?: District [];
  wards?: Ward [];
  formGroup!: FormGroup;
  constructor(
    private controlContainer: ControlContainer,
    readonly store: Store<AppState>
  ) {
  }
  ngOnInit() {
    console.log(this.data)
    this.reload$?.subscribe(val => {
      if(val){
        this.formGroup.reset()
      }
    })
    this.store.dispatch(ProvinceAction.loadAllProvinces());
    if(this.data){
      this.store.dispatch(DistrictAction.loadAllDistricts());
      this.store.dispatch(WardAction.loadAllWards());
    }
    this.store.pipe(select(selectDistrictByProvinceId(
      this?.data?.ward?.district?.province?.id
    ))).subscribe(val => this.districts = val);
     this.store.pipe(select(selectorWardByDistrictId(
      this?.data?.ward?.district?.id
    ))).subscribe(val => this.wards = val);
    this.formGroup = <FormGroup>this.controlContainer.control;
  }

  onProvince(province: Province) {
    this.districts = province.districts;
  }

  onDistrict(district: District) {
    this.wards = district.wards;
  }

}
