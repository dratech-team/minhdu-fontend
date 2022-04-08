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
import {ContainerService} from './services';
import {ProductEffect} from './state/product.effect';
import {CategoryService} from '../category/services';
import {NgxCurrencyModule} from 'ngx-currency';
import {customCurrencyMaskConfig} from '@minhdu-fontend/config';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {ContainerRoutingModule} from './container-routing.module';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzTableModule} from 'ng-zorro-antd/table';
import {CategoryEffect} from '../category/state';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzPopoverModule} from 'ng-zorro-antd/popover';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {ConsignmentModule} from "../consignment/consignment.module";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {SupplierEffect} from "../supplier/state";

@NgModule({
  imports: [
    ContainerRoutingModule,
    NzAutocompleteModule,
    ComponentsModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    NgxSkeletonLoaderModule,
    AkitaNgEffectsModule.forFeature([ProductEffect, CategoryEffect, SupplierEffect]),
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
  declarations: [],
  exports: [],
  providers: [
    DatePipe,
    CategoryService,
    ContainerService
  ]
})
export class ContainerModule {
}
