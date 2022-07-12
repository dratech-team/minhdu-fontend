import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CommodityRoutingModule } from './commodity-routing.module';
import { CommodityComponent, DetailCommodityComponent } from './container';
import { CommodityEffect } from './state';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ComponentsModule } from '@minhdu-fontend/components';
import { CommodityDialogComponent } from './component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxCurrencyModule } from 'ngx-currency';
import { customCurrencyMaskConfig } from '@minhdu-fontend/config';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommodityService } from './service';
import { CommodityTemplateEffect } from '../commodity-template/state/commodity-template.effect';

@NgModule({
  imports: [
    ComponentsModule,
    CommodityRoutingModule,
    AkitaNgEffectsModule.forFeature([CommodityEffect, CommodityTemplateEffect]),
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
    DetailCommodityComponent
  ],
  providers: [DatePipe, CommodityService]
})
export class CommodityModule {
}
