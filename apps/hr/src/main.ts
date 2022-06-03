import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {ModeEnum} from "@minhdu-fontend/enums";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(_ => localStorage.setItem('mode', (environment.production ? ModeEnum.PROD : ModeEnum.DEV)))
  .catch((err) => console.error(err));
