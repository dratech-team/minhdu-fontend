import { NgModule } from '@angular/core';
import { BillRoutingModule } from './bill-routing.module';
import { BillComponent } from './container/bill/bill.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BillEffect } from './+state/bill.effect';
import { DetailBillComponent } from './container/detail-bill/detail-bill.component';
import { ComponentsModule } from '@minhdu-fontend/components';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { BillService } from './service/bill.service';

@NgModule({
  imports: [
    ComponentsModule,
    AkitaNgEffectsModule.forFeature([BillEffect]),
    BillRoutingModule,
    MatInputModule,
    InfiniteScrollModule,
    CommonModule
  ],
  declarations: [
    BillComponent,
    DetailBillComponent
  ],
  providers: [
    DatePipe,
    BillService
  ]
})
export class BillModule {
}
