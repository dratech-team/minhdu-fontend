import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from '@minhdu-fontend/auth';
import { CommonModule, HashLocationStrategy } from '@angular/common';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../../sell/src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule } from '@coreui/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponent } from './app.component';
import { MedicineModule } from './container/dashboard/medicine/medicine.module';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { PoultryFoodModule } from './container/dashboard/poultry-food/poultry-food.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    MatSnackBarModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true // Pauses recording actions and state changes when the extension window is not open
    }),
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}, {}),
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
    MedicineModule,
    DashboardModule,
    PoultryFoodModule
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
    HashLocationStrategy
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
