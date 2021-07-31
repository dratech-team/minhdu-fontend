import { NgModule } from '@angular/core';
import { WarehouseLayoutComponent } from '../../container/warehouse-layout.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProductWarehouseComponent } from './container/product-warhouse/product-warehouse.component';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { ProductReducer } from './+state/product.reducer';
import { ProductEffect } from './+state/product.effect';
import { ComponentModule } from '../../components/component.module';

@NgModule({
  imports: [
    ProductRoutingModule,
    StoreModule.forFeature(FeatureName.PRODUCT, ProductReducer),
    EffectsModule.forFeature([ProductEffect]),
    ComponentModule
  ],
  declarations: [
    ProductWarehouseComponent
  ],
  exports: [
    ProductWarehouseComponent
  ],
  bootstrap: [WarehouseLayoutComponent]
})
export class ProductModule {
}
