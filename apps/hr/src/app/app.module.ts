import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@minhdu-fontend/components';
import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppFooterModule,
  AppHeaderModule,
  AppSidebarModule
} from '@coreui/angular';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from '@minhdu-fontend/auth';
import { HashLocationStrategy, registerLocaleData } from '@angular/common';
import { NxModule } from '@nrwl/angular';
import { DefaultLayoutComponent } from './container/default-layout.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { OrgchartModule } from '@minhdu-fontend/orgchart';
import { EmployeeModule } from './pages/employee/employee.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PayrollModule } from './pages/payroll/payroll.module';
import localeVi from '@angular/common/locales/vi';
import { AuthEffects } from '../../../../libs/auth/src/lib/+state/auth.effects';
import { NgxCurrencyModule } from 'ngx-currency';
import {customCurrencyMaskConfig, customCurrencyMaskConfig2} from '@minhdu-fontend/config';
import { MatDialogConfig } from '@angular/material/dialog/dialog-config';
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';

registerLocaleData(localeVi);

@NgModule({
  imports: [
    MatDialogModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ComponentsModule,
    AppSidebarModule,
    AppAsideModule,
    AppBreadcrumbModule,
    AppFooterModule,
    AppHeaderModule,
    PerfectScrollbarModule,
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true // Pauses recording actions and state changes when the extension window is not open
    }),
    EffectsModule.forRoot([AuthEffects]),
    NxModule.forRoot(),
    MatSnackBarModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    OrgchartModule,
    PayrollModule,
    EmployeeModule,
    MatSidenavModule,
    MatButtonModule,
    MatCheckboxModule,
    InfiniteScrollModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig2)
  ],
  declarations: [AppComponent, DefaultLayoutComponent],
  bootstrap: [AppComponent],
  providers: [
    HashLocationStrategy,
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
    { provide: LOCALE_ID, useValue: 'vi-VN' },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { disableClose: true, hasBackdrop: true } as MatDialogConfig },
    { provide: NZ_CONFIG, useValue: { message: { nzMaxStack: 1 } } as NzConfig },
    {provide: NZ_I18N, useValue: vi_VN},
  ]
})
export class AppModule {
}
