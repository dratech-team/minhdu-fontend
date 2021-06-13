import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppFooterModule,
  AppHeaderModule,
  AppSidebarModule
} from '@coreui/angular';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ComponentsModule } from './../../../../libs/components/src/lib/components.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './container/default-layout.component';

@NgModule({
  declarations: [AppComponent, DefaultLayoutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentsModule,
    AppSidebarModule,
    AppAsideModule,
    AppBreadcrumbModule,
    AppFooterModule,
    AppHeaderModule,
    PerfectScrollbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
