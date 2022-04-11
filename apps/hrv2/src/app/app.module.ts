import {NgModule} from '@angular/core';
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
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ErrorInterceptor, JwtInterceptor} from "@minhdu-fontend/auth";

@NgModule({
  declarations: [AppComponent, PageLayoutComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    RouterModule,
    MatMenuModule,
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    AppBreadcrumbModule,
    AppFooterModule,
    NzButtonModule,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
