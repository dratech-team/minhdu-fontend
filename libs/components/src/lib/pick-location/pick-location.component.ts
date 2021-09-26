import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  selectAllProvince,
  selectDistrictByProvinceId
} from '@minhdu-fontend/location';
import { District, Province, Ward } from '@minhdu-fontend/data-models';
import { AppState } from '../../../../../apps/sell/src/app/reducers';
import { ProvinceAction } from 'libs/location/src/lib/+state/province/nation.action';
import { WardAction } from 'libs/location/src/lib/+state/ward/ward.action';
import { DistrictAction } from 'libs/location/src/lib/+state/district/district.action';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-pick-location',
  templateUrl: 'pick-location.component.html'
})
export class PickLocationComponent implements OnInit {
  @Input() form: any;
  @Input() submitted!: boolean;
  @Input() ward?: any;
  @Input() reload$?: Subject<boolean>;
  @Output() eventSelectWard = new EventEmitter<any>();
  provinces$ = this.store.pipe(select(selectAllProvince));
  districts$!: Observable<District[]>;
  wards$!: Observable<Ward[]>;
  lstDistrict: District[] = [];
  lstWard: Ward [] = [];
  provinces = new FormControl();
  districts = new FormControl();
  wards = new FormControl();
  formGroup!: FormGroup;

  constructor(
    private controlContainer: ControlContainer,
    readonly store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.reload$?.subscribe(val => {
      if (val) {
        this.formGroup.reset();
      }
    });
    this.store.dispatch(ProvinceAction.loadAllProvinces());
    if (this.ward) {
      this.store.dispatch(DistrictAction.getDistrictsByProvinceId({ provinceId: this.ward.district.province.id }));
      this.store.dispatch(WardAction.getWardsByDistrictId({ districtId: this.ward.district.id }));
      this.store.pipe(select(selectDistrictByProvinceId(
        this.ward.district.province.id
      )));
    }
    this.formGroup = <FormGroup>this.controlContainer.control;
    ///FIXME: Chưa work đc giá trị ban đầu
    this.provinces$ = combineLatest([
      this.provinces.valueChanges,
      this.store.pipe(select(selectAllProvince))
    ]).pipe(
      map(([province, provinces]) => {
        if (province) {
          return provinces.filter((e) => {
            return e.name.toLowerCase().includes(province?.toLowerCase());
          });
        } else {
          return provinces;
        }
      })
    );

    this.districts$ = this.districts.valueChanges.pipe(
      startWith(''),
      map(District => District ? this._filterDistrict(District) : this.lstDistrict)
    );
    this.wards$ = this.wards.valueChanges.pipe(
      startWith(''),
      map(ward => ward ? this._filterWard(ward) : this.lstWard)
    );
  }

  private _filterWard(ward: string): Ward[] {
    const filterValue = ward.toLowerCase();
    return this.lstWard.filter(ward => ward.name.toLowerCase().includes(filterValue));
  }

  private _filterDistrict(District: string): District[] {
    const filterValue = District.toLowerCase();
    return this.lstDistrict.filter(district => district.name.toLowerCase().includes(filterValue));
  }

  onProvince(province: Province) {
    this.lstDistrict = province.districts;

  }

  onDistrict(district: District) {
    this.lstWard = district.wards;
  }
  onWard(ward: Ward) {
    this.eventSelectWard.emit(ward.id);
  }
}
