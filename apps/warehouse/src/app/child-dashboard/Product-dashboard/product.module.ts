import { NgModule } from '@angular/core';
import { WarehouseLayoutComponent } from '../../container/warehouse-layout.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './container/product-warhouse/product.component';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { EffectsModule } from '@ngrx/effects';
import { ProductReducer } from './+state/product.reducer';
import { ProductEffect } from './+state/product.effect';

@NgModule({
  imports: [
    ProductRoutingModule,
    StoreModule.forFeature(FeatureName.PRODUCT, ProductReducer),
    EffectsModule.forFeature([ProductEffect]),
  ],
  declarations: [
    ProductComponent
  ],
  exports: [
    ProductComponent
  ],
  bootstrap: [WarehouseLayoutComponent]
})
export class ProductModule {
}
