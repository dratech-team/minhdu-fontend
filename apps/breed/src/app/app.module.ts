import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { BreedLayoutComponent } from './container/base/breed-layout.component';
import { AppFooterModule } from '@coreui/angular';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from '@minhdu-fontend/auth';
import {CommonModule, HashLocationStrategy} from '@angular/common';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {AppRoutingModule} from "./app-routing.module";
import {EffectsModule} from "@ngrx/effects";
import {StoreModule} from "@ngrx/store";
import {AuthEffects} from "../../../../libs/auth/src/lib/+state/auth.effects";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

const routes: Routes = [
  {
    path: '',
    component: BreedLayoutComponent,
  }
];


@NgModule({
  declarations: [
    AppComponent,
    BreedLayoutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AppFooterModule,
    MatTabsModule,
    MatDialogModule,
    EffectsModule.forRoot([AuthEffects]),
    StoreModule.forRoot({}, {}),
    MatSnackBarModule,
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
    HashLocationStrategy,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
