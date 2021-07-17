import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WardService } from './service/ward.service';
import { DistrictService } from './service/district..service';
import { ProvinceService } from './service/province.service';
import { NationService } from './service/nation.service';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { WardReducer } from './+state/ward/ward.reducer';
import { DistrictReducer } from './+state/district/district.reducer';
import { ProvinceReducer } from './+state/province/province.reducer';
import { NationReducer } from './+state/nation/nation.reducer';
import { EffectsModule } from '@ngrx/effects';
import { WardEffect } from './+state/ward/ward.effect';
import { DistrictEffect } from './+state/district/district.effect';
import { ProvinceEffect } from './+state/province/province.effect';
import { NationEffect } from './+state/nation/nation.effect';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(FeatureName.WARD, WardReducer),
    StoreModule.forFeature(FeatureName.DISTRICT, DistrictReducer),
    StoreModule.forFeature(FeatureName.PROVINCE, ProvinceReducer),
    StoreModule.forFeature(FeatureName.NATION, NationReducer),
    EffectsModule.forFeature([WardEffect,DistrictEffect,ProvinceEffect,NationEffect])
  ],
  providers: [
    WardService,
    DistrictService,
    ProvinceService,
    NationService,
  ]
})
export class LocationModule {}
