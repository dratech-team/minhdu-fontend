import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CommodityRoutingModule } from './commodity-routing.module';
import { CommodityComponent } from './container/commodity/commodity.component';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { CommodityEffect } from './+state/commodity.effect';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ComponentsModule } from '@minhdu-fontend/components';
import { CommodityDialogComponent } from './component/commodity-dialog/commodity-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { DetailCommodityComponent } from './container/detail-commodity/detail-commodity.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PickCommodityService } from '../../shared/components/pick-commodity/pick-commodity.service';
import { NgxCurrencyModule } from 'ngx-currency';
import { customCurrencyMaskConfig } from '@minhdu-fontend/config';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import {NzButtonModule} from "ng-zorro-antd/button";

@NgModule({
    imports: [
        ComponentsModule,
        CommodityRoutingModule,
        AkitaNgEffectsModule.forFeature([CommodityEffect]),
        MatInputModule,
        InfiniteScrollModule,
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatRadioModule,
        MatCheckboxModule,
        FormsModule,
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
        MatAutocompleteModule,
        NzButtonModule
    ],
  declarations: [
    CommodityComponent,
    CommodityDialogComponent,
    DetailCommodityComponent,
  ],
  providers: [DatePipe, PickCommodityService],
})
export class CommodityModule {}
