import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {OrderRoutingModule} from './order-routing.module';
import {OrderEffect} from './+state/order.effect';
import {MatInputModule} from '@angular/material/input';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {ComponentsModule} from '@minhdu-fontend/components';
import {OrderComponent} from './container/order/order.component';
import {DetailOrderComponent} from './container/detail-order/detail-order.component';
import {OrderDialogComponent} from './component/order-dialog/order-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CommodityModule} from '../commodity/commodity.module';
import {AddOrderComponent} from './container/add-order.component/add-order.component';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {SharedModule} from '../../shared/shared.module';
import {PaymentHistoryComponent} from './container/payment-history/payment-history.component';
import {TableRouteComponent} from './component/table-route/table-route.component';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {AkitaNgEffectsModule} from '@datorama/akita-ng-effects';
import {CustomerEffect} from '../customer/+state/customer.effect';
import {CommodityEffect} from '../commodity/+state/commodity.effect';
import {RouteEffect} from '../route/+state/route.effect';
import {MatSortModule} from '@angular/material/sort';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzPopoverModule} from 'ng-zorro-antd/popover';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {VisibleOrderComponent} from './component/custom-visible/visible-order.component';
import {NzStepsModule} from 'ng-zorro-antd/steps';
import {OrderService} from './service/order.service';


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
    NgxMatSelectSearchModule,
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
  ],
  declarations: [
    TableRouteComponent,
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
    OrderService
  ],
  exports: []
})
export class OrderModule {
}
