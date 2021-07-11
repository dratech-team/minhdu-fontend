import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CommodityRoutingModule } from './commodity-routing.module';
import { CommodityComponent } from './container/commodity/commodity.component';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { CommodityReducer } from './container/+state/commodity.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CommodityEffect } from './container/+state/commodity.effect';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ComponentsModule } from '@minhdu-fontend/components';
import { CommodityDialogComponent } from './component/commodity-dialog/commodity-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { DetailCommodityComponent } from './container/detail-commodity/detail-commodity.component';
import { PickCommodityComponent } from './component/pick-commodity.component/pick-commodity.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PickCommodityService } from './component/pick-commodity.component/pick-commodity.service';

@NgModule({
  imports: [
    ComponentsModule,
    CommodityRoutingModule,
    StoreModule.forFeature(FeatureName.COMMODITY, CommodityReducer),
    EffectsModule.forFeature([CommodityEffect]),
    MatInputModule,
    InfiniteScrollModule,
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    FormsModule
  ],
  declarations: [
    CommodityComponent,
    CommodityDialogComponent,
    DetailCommodityComponent,
    PickCommodityComponent
  ],
  exports: [
    PickCommodityComponent
  ],
  providers: [
    DatePipe,
    PickCommodityService,
  ]
})
export class CommodityModule {

}
