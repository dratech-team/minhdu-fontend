import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppFooterModule,
  AppHeaderModule,
  AppSidebarModule
} from '@coreui/angular';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    AppSidebarModule,
    AppAsideModule,
    AppBreadcrumbModule,
    AppFooterModule,
    AppHeaderModule,
    PerfectScrollbarModule,
    RouterModule
  ],
  declarations: [DefaultLayoutComponent],
  exports: [DefaultLayoutComponent]
})
export class ComponentsModule {
}
