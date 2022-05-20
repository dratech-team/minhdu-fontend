import {NgModule} from '@angular/core';
import {CommodityTemplateService} from './services';
import {commodityTemplateRoutingModule} from "./commodity-template-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AkitaNgEffectsModule} from "@datorama/akita-ng-effects";
import {CommodityTemplateEffect} from "./state/commodity-template.effect";


@NgModule({
  imports:[
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    commodityTemplateRoutingModule,
    AkitaNgEffectsModule.forFeature([CommodityTemplateEffect]),
  ],
  providers: [CommodityTemplateService]
})
export class CommodityTemplateModule {
}
