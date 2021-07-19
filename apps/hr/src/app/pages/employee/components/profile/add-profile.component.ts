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
  formGroup!: FormGroup;
  constructor(
    private controlContainer: ControlContainer,
  ) {
  }
  ngOnInit(): void {
    this.formGroup = <FormGroup>this.controlContainer.control;
  }
}
