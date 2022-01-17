import { CommonModule, HashLocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppFooterModule } from '@coreui/angular';
import { ErrorInterceptor, JwtInterceptor } from '@minhdu-fontend/auth';
import { FeatureName } from '@minhdu-fontend/constants';
import { OrgchartModule } from '@minhdu-fontend/orgchart';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NxModule } from '@nrwl/angular';
import { AuthEffects } from '../../../../libs/auth/src/lib/+state/auth.effects';
import { environment } from '../../../sell/src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppContainer } from './containers/app/app.container';
import { AdminLayoutComponent } from './containers/layout-admin/admin-layout.component';
import { AdminReducer } from './states/admin.reducer';

@NgModule({
  imports: [
    OrgchartModule,
    MatSnackBarModule,
    MatDialogModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    EffectsModule.forRoot([AuthEffects]),
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    StoreModule.forFeature(FeatureName.ADMIN, AdminReducer),
    NxModule.forRoot(),
    AppFooterModule,
    MatMenuModule,
  ],
  declarations: [AdminLayoutComponent, AppComponent, AppContainer],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    HashLocationStrategy,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  ],
})
export class AppModule {}
