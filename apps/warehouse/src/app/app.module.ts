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
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrgchartModule } from '@minhdu-fontend/orgchart';
import { SupplierModule } from './pages/supplier/supplier.module';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { RouteGuard } from './route.guard';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../../hr/src/environments/environment';
import { WarehouseModule } from './pages/warehouse/warehosue.module';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { AccountEffects } from '../../../../libs/system/src/lib/state/account-management/account.effects';

@NgModule({
  declarations: [AppComponent],
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
    EffectsModule.forRoot(),
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true // Pauses recording actions and state changes when the extension window is not open
    }),
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
