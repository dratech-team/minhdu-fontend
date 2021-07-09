import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {  OrderRoutingModule } from './order-routing.module';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { OrderReducer } from './container/+state/order.reducer';
import { EffectsModule } from '@ngrx/effects';
import { OrderEffect } from './container/+state/order.effect';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ComponentsModule } from '@minhdu-fontend/components';
import { OrderComponent } from './container/order/order.component';
import { DetailOrderComponent } from './container/detail-order/detail-order.component';
import { OrderDialogComponent } from './component/order-dialog/order-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    OrderRoutingModule,
    StoreModule.forFeature(FeatureName.ORDER, OrderReducer),
    EffectsModule.forFeature([OrderEffect]),
    MatInputModule,
    InfiniteScrollModule,
    CommonModule,
    MatDialogModule,
    MatSelectModule
  ],
  declarations:[
    OrderComponent,
    DetailOrderComponent,
    OrderDialogComponent,
  ],
  providers:[DatePipe]
})
export class OrderModule{

}
