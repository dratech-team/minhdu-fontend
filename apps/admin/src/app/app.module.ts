import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminLayoutComponent } from './containers/layout-admin/admin-layout.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../../sell/src/environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ErrorInterceptor, JwtInterceptor } from '@minhdu-fontend/auth';
import { AppFooterModule } from '@coreui/angular';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthEffects } from '../../../../libs/auth/src/lib/+state/auth.effects';
import { AppContainer } from './containers/app/app.container';
import { FeatureName } from '@minhdu-fontend/constants';
import { NxModule } from '@nrwl/angular';
import { AdminReducer } from './states/admin.reducer';
import { OrgchartModule } from '@minhdu-fontend/orgchart';

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
      autoPause: true // Pauses recording actions and state changes when the extension window is not open
    }),
    StoreModule.forFeature(FeatureName.ADMIN, AdminReducer),
    NxModule.forRoot(),
    AppFooterModule,
    MatMenuModule
  ],
  declarations: [
    AdminLayoutComponent,
    AppComponent,
    AppContainer
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    HashLocationStrategy
  ]
})
export class AppModule {
}
