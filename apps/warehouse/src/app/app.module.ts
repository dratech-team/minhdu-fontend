import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from '@minhdu-fontend/auth';
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
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrgchartModule } from '@minhdu-fontend/orgchart';
import { SupplierModule } from './pages/supplier/supplier.module';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { RouteGuard } from './route.guard';
import { WarehouseModule } from './pages/warehouse/warehosue.module';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { AccountEffects } from '../../../../libs/system/src/lib/state/account-management/account.effects';
import { WarehouseLayoutComponent } from './container/warehouse-layout.component';

@NgModule({
  declarations: [AppComponent, WarehouseLayoutComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserModule,
    AkitaNgEffectsModule.forRoot([AccountEffects]),
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
    SupplierModule,
    RouterModule,
    MatTabsModule,
    WarehouseModule,
    AuthModule
  ],
  providers: [
    RouteGuard,
    HashLocationStrategy,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
