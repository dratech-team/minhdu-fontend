import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { selectAllNation, selectCurrentNation } from 'libs/location/src/lib/+state/nation/nation.selector';
import { District, Employee, Nation, Province, Ward } from '@minhdu-fontend/data-models';
import { NationAction } from 'libs/location/src/lib/+state/nation/nation.action';
import { selectCurrentDistrict, selectCurrentProvince, selectorCurrentWard } from '@minhdu-fontend/location';
import { ProvinceAction } from 'libs/location/src/lib/+state/province/nation.action';
import { DistrictAction } from 'libs/location/src/lib/+state/district/district.action';
import { WardAction } from 'libs/location/src/lib/+state/ward/ward.action';


@Component({
  selector: 'app-add-profile',
  templateUrl: 'add-profile.component.html'
})

export class AddProfileComponent implements OnInit {
  @Input() public data!: Employee;
  formGroup!: FormGroup;
  nations$ = this.store.pipe(select(selectAllNation));
  nation$ = this.store.pipe(select(selectCurrentNation(this.data?.ward?.district?.province?.nation?.id)));
  province$ = this.store.pipe(select(selectCurrentProvince(this.data?.ward?.district?.province?.id)));
  district$ = this.store.pipe(select(selectCurrentDistrict(this.data?.ward?.district?.id)));
  provinces?: Province[];
  districts?: District[];
  wards?: Ward[];

  constructor(
    private controlContainer: ControlContainer,
    private readonly store: Store
  ) {
  }

  ngOnInit(): void {
    console.log(this.data);
    this.store.dispatch(NationAction.loadAllNation());
    if (this.data) {
      this.store.dispatch(NationAction.getNation({
        idNation: this.data?.ward?.district?.province?.nation?.id
      }));
      this.store.dispatch(ProvinceAction.getProvince({
        idProvince: this.data?.ward?.district?.province?.id
      }));
      this.store.dispatch(DistrictAction.getDistrict({
        idDistrict: this.data?.ward?.district?.id
      }));
      this.store.dispatch(WardAction.getWard({
        idWard: this.data?.ward?.id
      }));
    }
    this.nation$.subscribe(val => this.provinces = val?.provinces);
    this.province$.subscribe(val => this.districts = val?.districts);
    this.district$.subscribe(val => this.wards = val?.wards);
    this.formGroup = <FormGroup>this.controlContainer.control;
  }

  onNation(nation: Nation) {
    console.log(nation);
    this.provinces = nation.provinces;
  }

  onProvince(province: Province) {
    this.districts = province.districts;
  }

  onDistrict(district: District) {
    this.wards = district.wards;
  }
}
