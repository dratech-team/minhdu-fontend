import { NgModule } from '@angular/core';
import { RouteRoutingModule } from './route-routing.module';
import { RouteComponent } from './container/route/route.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule, DatePipe } from '@angular/common';
import { ComponentsModule } from '@minhdu-fontend/components';
import { RouteEffect } from './+state/route.effect';
import { DetailRouteComponent } from './container/detail-route/detail-route.component';
import { RouteDialogComponent } from './component/route-dialog/route-dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from '../../shared/shared.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {AkitaNgEffectsModule} from "@datorama/akita-ng-effects";

@NgModule({
  imports: [
    AkitaNgEffectsModule.forFeature([RouteEffect]),
    ComponentsModule,
    RouteRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    InfiniteScrollModule,
    CommonModule,
    MatRadioModule,
    MatTabsModule,
    MatCheckboxModule,
    FormsModule,
    SharedModule,
    NgxSkeletonLoaderModule.forRoot(),
    MatDatepickerModule
  ],
  declarations: [
    RouteComponent,
    DetailRouteComponent,
    RouteDialogComponent,
  ],
  providers: [
    DatePipe,
  ],

})
export class RouteModule {

}
