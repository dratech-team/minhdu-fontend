import { NgModule } from '@angular/core';
import { MaterialComponent } from './container/material/material.component';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { MaterialReducer } from './+state/material.reducer';
import { MaterialEffect } from './+state/material.effect';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    StoreModule.forFeature(FeatureName.MATERIAL, MaterialReducer),
    EffectsModule.forFeature([MaterialEffect]),
    ReactiveFormsModule
  ],
  declarations: [
    MaterialComponent
  ],
  exports: [
    MaterialComponent
  ],
})
export class MaterialModule {
}
