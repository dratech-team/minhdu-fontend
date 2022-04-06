import { NgModule } from '@angular/core';
import { StockComponent } from './container';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule, DatePipe } from '@angular/common';
import { ComponentsModule } from '@minhdu-fontend/components';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { StockDialogComponent, VisibleStockComponent } from './components';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { StockService } from './services';
import { StockEffect } from './state/stock.effect';
import { CategoryService } from '../category/services/category.service';
import { NgxCurrencyModule } from 'ngx-currency';
import { customCurrencyMaskConfig } from '@minhdu-fontend/config';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { StockRoutingModule } from './stock-routing.module';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CategoryEffect } from '../category/state/category.effect';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  imports: [
    StockRoutingModule,
    NzAutocompleteModule,
    ComponentsModule,
    ReactiveFormsModule,
    MatInputModule,
    InfiniteScrollModule,
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    NgxSkeletonLoaderModule,
    AkitaNgEffectsModule.forFeature([StockEffect, CategoryEffect]),
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
    NzButtonModule
  ],
  declarations: [
    StockDialogComponent,
    StockComponent,
    VisibleStockComponent
  ],
  exports: [
    VisibleStockComponent
  ],
  providers: [
    DatePipe,
    CategoryService,
    StockService
  ]
})
export class StockModule {
}
