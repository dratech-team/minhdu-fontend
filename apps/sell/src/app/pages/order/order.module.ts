import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderRoutingModule } from './order-routing.module';
import { OrderEffect } from './state';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ComponentsModule } from '@minhdu-fontend/components';
import { AddOrderComponent, DetailOrderComponent, OrderComponent, PaymentHistoryComponent } from './container';
import { OrderDialogComponent, VisibleOrderComponent } from './component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommodityModule } from '../commodity/commodity.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from '../../shared/shared.module';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { CustomerEffect } from '../customer/state';
import { CommodityEffect } from '../commodity/state';
import { RouteEffect } from '../route/state';
import { MatSortModule } from '@angular/material/sort';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { OrderService } from './service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { OrderComponentService } from './shared';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CustomNgSortPipe } from '../../shared/pipe/sort.pipe';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  imports: [
    AkitaNgEffectsModule.forFeature([
      OrderEffect,
      CustomerEffect,
      CommodityEffect,
      RouteEffect
    ]),
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule,
    OrderRoutingModule,
    MatInputModule,
    InfiniteScrollModule,
    MatDialogModule,
    MatSelectModule,
    MatTabsModule,
    MatCheckboxModule,
    CommodityModule,
    MatAutocompleteModule,
    SharedModule,
    NgxSkeletonLoaderModule.forRoot(),
    MatDatepickerModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatSortModule,
    NzModalModule,
    MatExpansionModule,
    MatRadioModule,
    NzTableModule,
    NzPopoverModule,
    NzButtonModule,
    NzCollapseModule,
    NzInputModule,
    NzRadioModule,
    NzStepsModule,
    MatDatepickerModule,
    NzSpinModule,
    NzDropDownModule,
    NzToolTipModule,
    NzIconModule
  ],
  declarations: [
    PaymentHistoryComponent,
    OrderComponent,
    DetailOrderComponent,
    OrderDialogComponent,
    AddOrderComponent,
    VisibleOrderComponent
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    DatePipe,
    OrderComponentService,
    OrderService,
    CustomNgSortPipe
  ],
  exports: []
})
export class OrderModule {
}
