import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { environment } from '../environments/environment';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';

@NgModule({
  declarations: [AppComponent, OrderComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    environment.production ? [] : AkitaNgDevtools.forRoot({
      maxAge: 25,
      logTrace: true
    }),
    AkitaNgEffectsModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    OrderComponent
  ]
})
export class AppModule {
}
