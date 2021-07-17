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
  selectDistrictById,
  selectProvinceById
} from '@minhdu-fontend/location';
import { ProvinceAction } from 'libs/location/src/lib/+state/province/nation.action';
import { DistrictAction } from 'libs/location/src/lib/+state/district/district.action';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-profile',
  templateUrl: 'add-profile.component.html'
})

export class AddProfileComponent implements OnInit, OnDestroy {
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
    }
    this.store.pipe(
      takeUntil(this.destroy$),
      select(selectNationById(
        this?.data?.employee?.ward?.district?.province?.nation?.id))).subscribe(
      val => {
        console.log(val)
        this.provinces = val?.provinces
      }

    );
    this.store.pipe(
      takeUntil(this.destroy$),
      select(selectProvinceById(
      this.data?.employee?.ward?.district?.province?.id))).subscribe(
      val => this.districts = val?.districts
    );
    this.store.pipe(
      takeUntil(this.destroy$),
      select(selectDistrictById(
      this.data?.employee?.ward?.district?.id))).subscribe(
      val => this.wards = val?.wards
    );
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


  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
