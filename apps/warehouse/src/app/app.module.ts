import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from '@minhdu-fontend/auth';
import { CommonModule, HashLocationStrategy } from '@angular/common';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AppRoutingModule } from './app-routing.module';
import { AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule } from '@coreui/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponent } from './app.component';
import { WarehouseLayoutComponent } from './container/base/warehouse-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthEffects } from '../../../../libs/auth/src/lib/+state/auth.effects';
import { OrgchartModule } from '@minhdu-fontend/orgchart';
import { ProviderModule } from './pages/provider/provider.module';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { RouteGuard } from './route.guard';
import {OrgchartEffects} from "../../../../libs/orgchart/src/lib/+state/Orgchart";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../../../hr/src/environments/environment";

@NgModule({
  declarations: [WarehouseLayoutComponent, AppComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserModule,
    EffectsModule.forRoot([AuthEffects,OrgchartEffects]),
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true // Pauses recording actions and state changes when the extension window is not open
    }),
    AkitaNgDevtools.forRoot(),
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    AppBreadcrumbModule,
    AppFooterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    OrgchartModule,
    ProviderModule,
    RouterModule,
    MatTabsModule
  ],
  providers: [
    RouteGuard,
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
    HashLocationStrategy,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
