import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {getAllDistrict, getAllWard, selectAllProvince, selectDistrictByProvinceId} from '@minhdu-fontend/location';
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
  @Input() isRequiredProvince: boolean = true;
  @Input() isRequiredDistrict: boolean = true;
  @Input() isRequiredWard: boolean = true;
  @Input() province?: any;
  @Input() district?: any;
  @Input() ward?: Ward ;
  @Input() reload$?: Subject<boolean>;
  @Output() eventSelectProvince = new EventEmitter<any>();
  @Output() eventSelectDistrict = new EventEmitter<any>();
  @Output() eventSelectWard = new EventEmitter<any>();
  provinces$ = this.store.pipe(select(selectAllProvince));
  districts$ = this.store.pipe(select(getAllDistrict));
  wards$ = this.store.pipe(select(getAllWard)) ;
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
    if(this.ward){
      this.formProvince.setValue(this.ward?.district?.province?.name)
      this.formDistrict.setValue(this.ward?.district?.name)
      this.formWard.setValue(this.ward?.name)
    }
    this.reload$?.subscribe(val => {
      if (val) {
        this.formGroup.reset();
      }
    });
    this.store.dispatch(ProvinceAction.loadAllProvinces());
    if (this.ward) {
      this.store.dispatch(DistrictAction.getDistrictsByProvinceId({ provinceId: this.ward.district.province.id }));
      this.store.dispatch(WardAction.getWardsByDistrictId({ districtId: this.ward.district.id }));
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
    this.formWard.patchValue('');
    this.eventSelectProvince.emit(province.id);
  }

  onDistrict(district: District) {
    this.lstWard = district.wards;
    this.formWard.patchValue('');
    this.eventSelectDistrict.emit(district.id);
  }

  onWard(ward: Ward) {
    this.eventSelectWard.emit(ward.id);
  }
}
