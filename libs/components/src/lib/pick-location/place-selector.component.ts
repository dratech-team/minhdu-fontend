import { Component, Input, OnInit } from '@angular/core';
import { District, Province, Ward } from '@minhdu-fontend/data-models';
import { ControlContainer, UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { DistrictService, ProvinceService, WardService } from '@minhdu-fontend/location';

@Component({
  selector: 'place-selector',
  templateUrl: 'place-selector.component.html'
})
export class PlaceSelectorComponent implements OnInit {
  @Input() form: any;
  @Input() submitting!: boolean;
  @Input() isRequiredWard = true;
  @Input() isRequiredProvince = true;
  @Input() isRequiredDistrict = true;
  @Input() isUpdate = false;
  @Input() isUpdateEmployee = false;
  @Input() province?: any;
  @Input() district?: any;
  @Input() ward?: Ward;
  @Input() reload$?: Subject<boolean>;

  formGroup!: UntypedFormGroup;
  provinces$ = this.provinceService.getAll();
  lstDistrict: District[] = [];
  lstWard: Ward[] = [];

  constructor(
    private controlContainer: ControlContainer,
    readonly provinceService: ProvinceService,
    readonly districtService: DistrictService,
    readonly wardService: WardService
  ) {
  }

  ngOnInit() {
    this.formGroup = <UntypedFormGroup>this.controlContainer.control;

    // init data from input
    this.formGroup.get('province')?.setValue(this.province);
    this.formGroup.get('district')?.setValue(this.district);
    this.formGroup.get('ward')?.setValue(this.ward);


    this.reload$?.subscribe((val) => {
      if (val) {
        this.formGroup.reset();
      }
    });
    this.formGroup.get('province')?.valueChanges.subscribe((val: Province) => {
      this.formGroup.get('district')?.setValue('');
      this.lstDistrict = val.districts;
    });

    this.formGroup.get('district')?.valueChanges.subscribe((val: District) => {
      this.formGroup.get('ward')?.setValue('');
      this.lstWard = val.wards;
    });

    if (this.isUpdate) {
      if (this.isUpdateEmployee && this.ward) {
        this.wardService
          .getAll({ districtId: this.ward.district.id })
          .subscribe((val) => (this.lstWard = val));
        this.districtService
          .getAll({ provinceId: this.ward.district.province.id })
          .subscribe((val) => (this.lstDistrict = val));
      } else {
        if (this.district) {
          this.wardService
            .getAll({ districtId: this.district.id })
            .subscribe((val) => (this.lstWard = val));
        }
        if (this.province) {
          this.districtService
            .getAll({ provinceId: this.province.id })
            .subscribe((val) => (this.lstDistrict = val));
        }
      }
    }
  }

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.value == o2.value : o1 === o2);
}
