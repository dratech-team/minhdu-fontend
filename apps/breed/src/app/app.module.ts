import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { Routes } from '@angular/router';
import { BreedLayoutComponent } from './container/base/breed-layout.component';
import { AppFooterModule } from '@coreui/angular';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from '@minhdu-fontend/auth';
import {CommonModule, DatePipe, HashLocationStrategy} from '@angular/common';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../../../hr/src/environments/environment";
import {OrgchartModule} from "@minhdu-fontend/orgchart";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatNativeDateModule} from "@angular/material/core";
import {LocationModule} from "@minhdu-fontend/location";
import {MatSelectModule} from "@angular/material/select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AuthEffects } from '../../../../libs/auth/src/lib/+state/auth.effects';

@NgModule({
  declarations: [
    AppComponent,
    BreedLayoutComponent
  ],
  imports: [
    StoreModule,
    EffectsModule,
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
    AkitaNgDevtools.forRoot(),
    OrgchartModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    LocationModule,
    MatSelectModule,
    MatAutocompleteModule,
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
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
