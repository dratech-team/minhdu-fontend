import { NgModule } from '@angular/core';
import { AppComponent } from '../../container/app.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './container/product.component';

@NgModule({
  imports: [
    ProductRoutingModule
  ],
  declarations: [
    ProductComponent
  ],
  exports: [
    ProductComponent
  ],
  bootstrap: [AppComponent]
})
export class ProductModule {
}
