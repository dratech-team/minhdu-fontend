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
import { StoreModule } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { RouteReducer } from './container/+state/route.reducer';
import { EffectsModule } from '@ngrx/effects';
import { RouteEffect } from './container/+state/route.effect';
import { DetailRouteComponent } from './container/detail-route/detail-route.component';
import { RouteDialogComponent } from './component/route-dialog/route-dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { EmployeeEffect, EmployeeReducer } from '@minhdu-fontend/employee';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    StoreModule.forFeature(FeatureName.ROUTE, RouteReducer),
    StoreModule.forFeature(FeatureName.EMPLOYEE, EmployeeReducer),
    EffectsModule.forFeature([RouteEffect, EmployeeEffect]),
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
    SharedModule

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
