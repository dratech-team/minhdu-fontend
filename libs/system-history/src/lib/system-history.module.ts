import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { ErrorInterceptor, JwtInterceptor } from '@minhdu-fontend/auth';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../auth/src/lib/services/auth.service';
import { SystemHistoryRoutingModule } from './system-history-routing.module';
import { SystemHistoryReducer } from './+state/system-history/system-history.reducer';
import { SystemHistoryEffects } from './+state/system-history/system-history.effects';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SystemHistoryContainer } from './containers/system-history/system-history.container';
import { AccountManagementContainer } from './containers/account-management/account-management.container';
import { FeatureName } from '@minhdu-fontend/constants';
import { AccountManagementReducer } from './+state/account-management/account-management.reducer';
import { AccountManagementEffects } from './+state/account-management/account-management.effects';

@NgModule({
  imports: [
    SystemHistoryRoutingModule,
    CommonModule,
    StoreModule.forFeature('systemHistory', SystemHistoryReducer),
    StoreModule.forFeature(FeatureName.ACCOUNT, AccountManagementReducer),
    EffectsModule.forFeature([SystemHistoryEffects,AccountManagementEffects]),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    InfiniteScrollModule,
    NgxSkeletonLoaderModule.forRoot()
  ],
  declarations: [
    SystemHistoryContainer,
    AccountManagementContainer
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
export class SystemHistoryModule {
}
