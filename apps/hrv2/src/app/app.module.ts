import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { PageLayoutComponent } from './container/base/page-layout.component';
import { AppRoutingModule } from './app-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule } from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from '@minhdu-fontend/auth';
import { HashLocationStrategy, registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StoreModule } from '@ngrx/store';
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import localeVi from '@angular/common/locales/vi';
import { NgxCurrencyModule } from 'ngx-currency';
import { customCurrencyMaskConfig2 } from '@minhdu-fontend/config';
import { AccountEffects } from '../../../../libs/system/src/lib/state/account-management/account.effects';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { RouteGuard } from './route.guard';

registerLocaleData(localeVi);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(
  (key) => antDesignIcons[key]
);

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
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    AkitaNgDevtools.forRoot(),
    AkitaNgEffectsModule.forRoot([AccountEffects]),
    MatSnackBarModule,
    StoreModule.forRoot({}, {}),
    AuthModule,
    AppBreadcrumbModule,
    AppFooterModule,
    NzButtonModule,
    NzModalModule,
    NzMessageModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig2),
    NzIconModule
  ],
  providers: [
    RouteGuard,
    HashLocationStrategy,
    { provide: NZ_ICONS, useValue: icons },
    { provide: LOCALE_ID, useValue: 'vi-VN' },
    {
      provide: NZ_CONFIG,
      useValue: { message: { nzMaxStack: 1 } } as NzConfig
    },
    { provide: NZ_I18N, useValue: vi_VN },
    { provide: NZ_CONFIG, useValue: { modal: { nzMaskClosable: false } } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
