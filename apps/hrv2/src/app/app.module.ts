import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {PageLayoutComponent} from "./container/base/page-layout.component";
import {AppRoutingModule} from "./app-routing.module";
import {MatMenuModule} from "@angular/material/menu";
import {AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from "@coreui/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {NzButtonModule} from "ng-zorro-antd/button";
import {RouteGuard} from "../../../warehouse/src/app/route.guard";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ErrorInterceptor, JwtInterceptor} from "@minhdu-fontend/auth";
import {HashLocationStrategy, registerLocaleData} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NZ_ICONS} from "ng-zorro-antd/icon";
import * as AllIcons from "@ant-design/icons-angular/icons";
import {IconDefinition} from "@ant-design/icons-angular";
import {NzModalModule} from "ng-zorro-antd/modal";
import {AkitaNgDevtools} from "@datorama/akita-ngdevtools";
import {NxModule} from "@nrwl/angular";
import {EffectsModule} from "@ngrx/effects";
import {AuthEffects} from "../../../../libs/auth/src/lib/+state/auth.effects";
import {StoreModule} from "@ngrx/store";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {NZ_CONFIG, NzConfig} from "ng-zorro-antd/core/config";
import {NZ_I18N, vi_VN} from "ng-zorro-antd/i18n";
import {NgxCurrencyModule} from "ngx-currency";
import {customCurrencyMaskConfig2} from "@minhdu-fontend/config";
import localeVi from "@angular/common/locales/vi";
registerLocaleData(localeVi);
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

@NgModule({
  declarations: [AppComponent, PageLayoutComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    RouterModule,
    MatMenuModule,
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    AkitaNgDevtools.forRoot(),
    MatSnackBarModule,
    EffectsModule.forRoot([AuthEffects]),
    StoreModule.forRoot({}, {}),
    AppBreadcrumbModule,
    AppFooterModule,
    NzButtonModule,
    NzModalModule,
    NxModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig2),
  ],
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
    RouteGuard,
    HashLocationStrategy,
    {provide: NZ_ICONS, useValue: icons},
    { provide: LOCALE_ID, useValue: 'vi-VN' },
    { provide: NZ_CONFIG, useValue: { message: { nzMaxStack: 1 } } as NzConfig },
    {provide: NZ_I18N, useValue: vi_VN},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
