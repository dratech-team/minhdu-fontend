import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment';
import {SellLayoutComponent} from './container/sell-layout.component';
import {AppRoutingModule} from './app-routing.module';
import {StoreModule} from '@ngrx/store';
import {AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from '@minhdu-fontend/auth';
import {HashLocationStrategy, registerLocaleData} from '@angular/common';
import {EffectsModule} from '@ngrx/effects';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {ComponentsModule} from '@minhdu-fontend/components';
import {NxModule} from '@nrwl/angular';
import {SharedModule} from './shared/shared.module';
import {PickMenuComponent} from './components/pick-menu-mobile/pick-menu.component';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig, MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import localeVi from '@angular/common/locales/vi';
import {NZ_ICONS} from 'ng-zorro-antd/icon';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {IconDefinition} from '@ant-design/icons-angular';
import {NZ_I18N, vi_VN} from 'ng-zorro-antd/i18n';
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools';
import {RouteGuard} from './route.guard';
import {NZ_CONFIG, NzConfig} from 'ng-zorro-antd/core/config';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {CommodityTemplateModule} from './pages/commodity-template/commodity-template.module';
import {RouteModule} from './pages/route/route.module';
import {AkitaNgEffectsModule} from "@datorama/akita-ng-effects";
import {AccountEffects} from "../../../../libs/system/src/lib/state/account-management/account.effects";

registerLocaleData(localeVi);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    FormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatSnackBarModule,
    HttpClientModule,
    AppRoutingModule,
    AkitaNgEffectsModule.forRoot([AccountEffects]),
    AkitaNgDevtools.forRoot(),
    NxModule.forRoot(),
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    AppBreadcrumbModule,
    AppFooterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    NzMessageModule,
    CommodityTemplateModule,
    RouteModule,
    AuthModule
  ],
  declarations: [PickMenuComponent, AppComponent, SellLayoutComponent],
  providers: [
    HashLocationStrategy,
    RouteGuard,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: LOCALE_ID, useValue: 'vi-VN'},
    {provide: NZ_I18N, useValue: vi_VN},
    {provide: NZ_ICONS, useValue: icons},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true, disableClose: true} as MatDialogConfig},
    {provide: NZ_CONFIG, useValue: {message: {nzMaxStack: 1}} as NzConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
