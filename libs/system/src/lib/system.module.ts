import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { ErrorInterceptor, JwtInterceptor } from '@minhdu-fontend/auth';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../auth/src/lib/services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AccountManagementContainer } from './containers/account-management/account-management.container';
import { FeatureName } from '@minhdu-fontend/constants';
import { AccountManagementReducer } from './+state/account-management/account-management.reducer';
import { AccountManagementEffects } from './+state/account-management/account-management.effects';
import { AuthEffects } from '../../../auth/src/lib/+state/auth.effects';
import { ComponentsModule } from '@minhdu-fontend/components';
import { SystemRoutingModule } from './system-routing.module';
import { TransformRolePipe } from './pipes/transform-role.pipe';
import { SystemHistoryContainer } from './containers/system-history/system-history/system-history.container';
import { SystemHistoryEffects } from './+state/system-history/system-history/system-history.effects';
import { SystemHistoryReducer } from './+state/system-history/system-history/system-history.reducer';
import { TransformAppPipe } from './pipes/transform-app.pipe';
import { TransformMethodPipe } from './pipes/transform-method.pipe';
import { LimitedAccessContainer } from './containers/limited-access/limited-access.container';
import {NzTableModule} from "ng-zorro-antd/table";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";


@NgModule({
  imports: [
    SystemRoutingModule,
    ComponentsModule,
    CommonModule,
    StoreModule.forFeature('systemHistory', SystemHistoryReducer),
    StoreModule.forFeature(FeatureName.ACCOUNT, AccountManagementReducer),
    EffectsModule.forFeature(
      [
        SystemHistoryEffects,
        AccountManagementEffects,
        AuthEffects
      ]),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    InfiniteScrollModule,
    NgxSkeletonLoaderModule.forRoot(),
    NzTableModule,
    NzInputModule,
    NzSelectModule
  ],
  declarations: [
    SystemHistoryContainer,
    AccountManagementContainer,
    TransformRolePipe,
    TransformAppPipe,
    TransformMethodPipe,
    LimitedAccessContainer
  ],
  exports: [
    TransformAppPipe
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]

})
export class SystemModule {
}
