import { NgModule } from '@angular/core';
import { BillRoutingModule } from './bill-routing.module';
import { BillComponent } from './container/bill/bill.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { BillReducer } from './+state/bill.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BillEffect } from './+state/bill.effect';
import { DetailBillComponent } from './container/detail-bill/detail-bill.component';
import { ComponentsModule } from '@minhdu-fontend/components';

@NgModule({
  imports: [
    ComponentsModule,
    StoreModule.forFeature(FeatureName.BILL,BillReducer),
    EffectsModule.forFeature([BillEffect]),
    BillRoutingModule,
    MatInputModule,
    InfiniteScrollModule,
    CommonModule
  ],
  declarations:[
    BillComponent,
    DetailBillComponent,
  ],
  providers: [
    DatePipe
  ],
})
export class BillModule{
}
