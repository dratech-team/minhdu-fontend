import { CommonModule, HashLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppFooterModule } from '@coreui/angular';
import { NxModule } from '@nrwl/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppContainer } from './containers/app/app.container';
import { AdminLayoutComponent } from './containers/layout-admin/admin-layout.component';
import { AuthModule } from '@minhdu-fontend/auth';
import { OrgchartV2Module } from '@minhdu-fontend/orgchart-v2';
import { AppService } from './services/app.service';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { AccountEffects } from '../../../../libs/system/src/lib/state/account-management/account.effects';

@NgModule({
  imports: [
    OrgchartV2Module,
    MatSnackBarModule,
    MatDialogModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    AkitaNgEffectsModule.forRoot([AccountEffects]),
    NxModule.forRoot(),
    AppFooterModule,
    MatMenuModule,
    AuthModule,
    AkitaNgDevtools.forRoot()
  ],
  declarations: [AdminLayoutComponent, AppComponent, AppContainer],
  bootstrap: [AppComponent],
  providers: [
    HashLocationStrategy,
    AppService,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } }
  ]
})
export class AppModule {
}
