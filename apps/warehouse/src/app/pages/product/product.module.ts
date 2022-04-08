import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {CommonModule, DatePipe} from '@angular/common';
import {ComponentsModule} from '@minhdu-fontend/components';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AkitaNgEffectsModule} from '@datorama/akita-ng-effects';
import {ProductService} from './services';
import {ProductEffect} from './state/product.effect';
import {CategoryService} from '../warehouse/services';
import {NgxCurrencyModule} from 'ngx-currency';
import {customCurrencyMaskConfig} from '@minhdu-fontend/config';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {ProductRoutingModule} from './product-routing.module';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzTableModule} from 'ng-zorro-antd/table';
import {WarehouseEffect} from '../warehouse/state';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzPopoverModule} from 'ng-zorro-antd/popover';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {ProductComponent} from "./container";
import {ProductDialogComponent, VisibleProductComponent} from "./components";
import {ConsignmentModule} from "../consignment/consignment.module";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {SupplierEffect} from "../supplier/state";
import {TableProductComponet} from "./components/table-product/table-product.componet";

@NgModule({
  imports: [
    ProductRoutingModule,
    NzAutocompleteModule,
    ComponentsModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    NgxSkeletonLoaderModule,
    AkitaNgEffectsModule.forFeature([ProductEffect, WarehouseEffect, SupplierEffect]),
    MatAutocompleteModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    MatExpansionModule,
    MatRadioModule,
    NzCollapseModule,
    NzTableModule,
    NzModalModule,
    NzSelectModule,
    NzInputModule,
    NzPopoverModule,
    NzButtonModule,
    ConsignmentModule,
    NzRadioModule
  ],
  declarations: [
    ProductComponent,
    ProductDialogComponent,
    VisibleProductComponent,
    TableProductComponet
  ],
  exports: [
    ProductComponent,
    TableProductComponet
  ],
  providers: [
    DatePipe,
    CategoryService,
    ProductService
  ]
})
export class ProductModule {
}
