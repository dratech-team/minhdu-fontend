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
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './container/default-layout.component';
import { ComponentsModule } from '@minhdu-fontend/components';
import { RouterModule } from '@angular/router';

@NgModule({
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
  declarations: [AppComponent, DefaultLayoutComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
