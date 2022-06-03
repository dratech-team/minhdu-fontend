import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {persistState} from '@datorama/akita';
import {StorageName} from '@minhdu-fontend/constants';
import {ModeEnum} from "@minhdu-fontend/enums";

if (environment.production) {
  enableProdMode();
}

const storage = persistState({
  include: [StorageName.EMPLOYEE_DRAFT]
});

const providers = [{provide: 'persistStorage', useValue: storage}];
platformBrowserDynamic(providers)
  .bootstrapModule(AppModule)
  .then(_ => localStorage.setItem('mode', (environment.production ? ModeEnum.PROD : ModeEnum.DEV)))
  .catch((err) => console.error(err));
