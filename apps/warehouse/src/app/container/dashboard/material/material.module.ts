import { NgModule } from '@angular/core';
import { MaterialComponent } from './container/material/material.component';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { MaterialReducer } from './+state/material.reducer';
import { MaterialEffect } from './+state/material.effect';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialDialogComponent } from './components/material-dialog/material-dialog.component';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { MainReducer } from '../../../states/main.reducer';


@NgModule({
  imports: [
    ComponentsModule,
    StoreModule.forFeature(FeatureName.MATERIAL, MaterialReducer),
    StoreModule.forFeature(FeatureName.MAIN, MainReducer),
    EffectsModule.forFeature([MaterialEffect]),
    ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    InfiniteScrollModule,
    CommonModule
  ],
  declarations: [
    MaterialComponent,
    MaterialDialogComponent,
  ],
  exports: [
    MaterialComponent
  ],
})
export class MaterialModule {
}
