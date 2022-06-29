import { NgModule } from '@angular/core';
import { CommodityTemplateService } from './services';
import { commodityTemplateRoutingModule } from './commodity-template-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { CommodityTemplateEffect } from './state/commodity-template.effect';
import { CommodityTemplateComponent } from './container/commodity-template.component';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ComponentsModule } from '@minhdu-fontend/components';
import { ModalCommodityTemplateComponent } from './components/modal-commodity-template/modal-commodity-template.component';
import { NzInputModule } from 'ng-zorro-antd/input';

@NgModule({
  imports: [
    ComponentsModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    commodityTemplateRoutingModule,
    AkitaNgEffectsModule.forFeature([CommodityTemplateEffect]),
    NzCollapseModule,
    NzButtonModule,
    NzTableModule,
    NzInputModule,
  ],

  declarations: [CommodityTemplateComponent, ModalCommodityTemplateComponent],

  providers: [CommodityTemplateService],
})
export class CommodityTemplateModule {}
