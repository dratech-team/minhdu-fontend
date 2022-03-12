import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {getAllDistrict, getAllWard, selectAllProvince, selectDistrictByProvinceId} from '@minhdu-fontend/location';
import {District, Province, Ward} from '@minhdu-fontend/data-models';
import {AppState} from '../../../../../apps/sell/src/app/reducers';
import {ProvinceAction} from 'libs/location/src/lib/+state/province/nation.action';
import {WardAction} from 'libs/location/src/lib/+state/ward/ward.action';
import {DistrictAction} from 'libs/location/src/lib/+state/district/district.action';
import {ControlContainer, FormControl, FormGroup} from '@angular/forms';
import {combineLatest, Observable, Subject} from 'rxjs';
import {map, startWith, tap} from 'rxjs/operators';
import {ProvinceService} from "../../../../location/src/lib/service/province.service";
import {DistrictService} from "../../../../location/src/lib/service/district..service";
import {WardService} from "../../../../location/src/lib/service/ward.service";

@Component({
  selector: 'app-pick-location',
  templateUrl: 'pick-location.component.html'
})
export class PickLocationComponent implements OnInit {
  @Input() form: any;
  @Input() submitted!: boolean;
  @Input() isRequiredWard: boolean = true;
  @Input() isRequiredProvince: boolean = true;
  @Input() isRequiredDistrict: boolean = true;
  @Input() isUpdate: boolean = false;
  @Input() province?: any;
  @Input() district?: any;
  @Input() ward?: Ward;
  @Input() reload$?: Subject<boolean>;
  @Output() eventSelectProvince = new EventEmitter<any>();
  @Output() eventSelectDistrict = new EventEmitter<any>();
  @Output() eventSelectWard = new EventEmitter<any>();
  formGroup!: FormGroup;
  provinces$ = this.provinceService.getAll().pipe()
  districts$ = new Observable<District[]>()
  wards$ = new Observable<Ward[]>();
  lstDistrict: District[] = [];
  lstWard: Ward [] = [];
  formDistrict = new FormControl();
  formWard = new FormControl();

  constructor(
    private controlContainer: ControlContainer,
    readonly provinceService: ProvinceService,
    readonly districtService: DistrictService,
    readonly wardService: WardService,
  ) {
  }

  ngOnInit() {
    this.formGroup = <FormGroup>this.controlContainer.control;
    this.reload$?.subscribe(val => {
      if (val) {
        this.formGroup.reset();
      }
    });
    this.provinces$ = combineLatest([
      this.formGroup.get('province')!.valueChanges.pipe(startWith('')),
      this.provinces$
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

    this.districts$ = this.formGroup.get('district')!.valueChanges.pipe(
      startWith(''),
      map(district => {
          if (district) {
            return this.lstDistrict.filter(item => item.name.toLowerCase().includes(district.toLowerCase()));
          } else {
            return this.lstDistrict;
          }
        }
      ));

    this.wards$ = this.formGroup.get('ward')!.valueChanges.pipe(
      startWith(''),
      map(ward => {
          if (ward) {
            return this.lstWard.filter(item => item.name.toLowerCase().includes(ward.toLowerCase()));
          } else {
            return this.lstWard;
          }
        }
      ));

    if (this.isUpdate) {
      if (this.ward) {
        console.log(this.ward)
        this.districts$ = this.districtService.getAll({provinceId: this.ward.district.province.id})
        this.wards$ = this.wardService.getAll({districtId: this.ward.district.id})
      }else {
        if (this.province) {
          this.districts$ = this.districtService.getAll({provinceId: this.province?.id})

          if (this.district) {
            this.wards$ = this.wardService.getAll({districtId: this.district?.id})
          }
        }
      }
    }
    this.districts$.subscribe(val => this.lstDistrict = val)
    this.wards$.subscribe(val => this.lstWard = val)
  }


  onProvince(province: Province) {
    this.lstDistrict = province.districts;
    this.formGroup.get('district')?.patchValue('');
    this.formGroup.get('ward')?.patchValue('');
    this.eventSelectProvince.emit(province.id);
  }

  onDistrict(district: District) {
    this.lstWard = district.wards;
    this.formGroup.get('ward')?.patchValue('');
    this.eventSelectDistrict.emit(district.id);
  }

  onWard(ward: Ward) {
    this.eventSelectWard.emit(ward.id);
  }
}
