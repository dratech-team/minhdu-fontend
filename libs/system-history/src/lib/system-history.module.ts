import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { ErrorInterceptor, JwtInterceptor } from '@minhdu-fontend/auth';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from '../../../auth/src/lib/+state/auth.effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../auth/src/lib/services/auth.service';
import { SystemHistoryRoutingModule } from './system-history-routing.module';
import { SystemHistoryContainer } from './containers/system-history.container';
import { SystemHistoryReducer } from './+state/system-history.reducer';
import { SystemHistoryEffects } from './+state/system-history.effects';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    SystemHistoryRoutingModule,
    CommonModule,
    StoreModule.forFeature('systemHistory', SystemHistoryReducer),
    EffectsModule.forFeature([SystemHistoryEffects]),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    InfiniteScrollModule
  ],
  declarations: [
    SystemHistoryContainer
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
