import {NgModule} from '@angular/core';
import {RouteRoutingModule} from './route-routing.module';
import {RouteComponent} from './container/route/route.component';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {CommonModule, DatePipe} from '@angular/common';
import {ComponentsModule} from '@minhdu-fontend/components';
import {RouteEffect} from './+state/route.effect';
import {DetailRouteComponent} from './container/detail-route/detail-route.component';
import {RouteDialogComponent} from './component/route-dialog/route-dialog.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SharedModule} from '../../shared/shared.module';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NzTableModule} from 'ng-zorro-antd/table';
import {AkitaNgEffectsModule} from '@datorama/akita-ng-effects';
import {CompleteRouteDialogComponent} from './component';
import {OrderEffect} from '../order/+state';
import {CustomerEffect} from '../customer/+state';
import {CommodityEffect} from '../commodity/+state';
import {MatSortModule} from '@angular/material/sort';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzStepsModule} from 'ng-zorro-antd/steps';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzPopoverModule} from 'ng-zorro-antd/popover';
import {VisibleRouteComponent} from './component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {RouteService} from './service';
import {RouteMiddleware} from './middlewares/route.middleware';
import {NzSpinModule} from "ng-zorro-antd/spin";

@NgModule({
    imports: [
        AkitaNgEffectsModule.forFeature([
            OrderEffect,
            CustomerEffect,
            CommodityEffect,
            RouteEffect
        ]),
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
        MatDatepickerModule,
        NzTableModule,
        MatSortModule,
        NzCollapseModule,
        NzRadioModule,
        NzModalModule,
        NzStepsModule,
        NzInputModule,
        NzButtonModule,
        NzPopoverModule,
        NzSpinModule
    ],
  declarations: [
    RouteComponent,
    DetailRouteComponent,
    RouteDialogComponent,
    CompleteRouteDialogComponent,
    VisibleRouteComponent
  ],
  exports: [
    VisibleRouteComponent
  ],
  providers: [
    DatePipe,
    RouteService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RouteMiddleware,
      multi: true,
    },
  ]

})
export class RouteModule {

}
