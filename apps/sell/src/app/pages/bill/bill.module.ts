import { NgModule } from '@angular/core';
import { BillRoutingModule } from './bill-routing.module';
import { BillComponent } from './container';
import { CommonModule, DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BillEffect } from './+state';
import { DetailBillComponent } from './container';
import { ComponentsModule } from '@minhdu-fontend/components';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { BillService } from './service';

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
