import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
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
  formProvince = new FormControl();
  formDistrict = new FormControl();
  formWard = new FormControl();
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
    this.provinces$ = combineLatest([
      this.formProvince.valueChanges.pipe(startWith('')),
      this.store.pipe(select(selectAllProvince))
    ]).pipe(
      map(([province, provinces]) => {
        if (province) {
          return provinces.filter((e) => {
            return e.name.toLowerCase().includes(province?.toLowerCase());
          });
        } else {
          this.lstDistrict = [];
          this.formDistrict.patchValue('');
          return provinces;
        }
      })
    );

    this.districts$ = this.formDistrict.valueChanges.pipe(
      startWith(''),
      map(district => {
          if (district) {
            return this.lstDistrict.filter(item => item.name.toLowerCase().includes(district.toLowerCase()));
          } else {
            this.lstWard = [];
            this.formWard.patchValue('');
            return this.lstDistrict;
          }
        }
      ));
    this.wards$ = this.formWard.valueChanges.pipe(
      startWith(''),
      map(ward => {
          if (ward) {
            return this.lstWard.filter(item => item.name.toLowerCase().includes(ward.toLowerCase()));
          } else {
            return this.lstWard;
          }
        }
      ));
  }


  onProvince(province: Province) {
    this.lstDistrict = province.districts;
    this.formDistrict.patchValue('');
  }

  onDistrict(district: District) {
    this.lstWard = district.wards;
    this.formWard.patchValue('');
  }

  onWard(ward: Ward) {
    this.eventSelectWard.emit(ward.id);
  }
}
