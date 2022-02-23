import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { BreedLayoutComponent } from './container/base/breed-layout.component';
import { AppFooterModule } from '@coreui/angular';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from '@minhdu-fontend/auth';
import { HashLocationStrategy } from '@angular/common';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

const routes: Routes = [
  // {
  //   path: 'auth/login',
  //   loadChildren: () =>
  //     import('@minhdu-fontend/auth').then((m) => m.AuthModule)
  // },
  {
    path: '',
    component: BreedLayoutComponent,
  }
];


@NgModule({
  declarations: [AppComponent, BreedLayoutComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    AppFooterModule,
    MatTabsModule,
    MatDialogModule
    // EffectsModule.forRoot([AuthEffects]),
    // StoreModule.forRoot({}, {}),
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
