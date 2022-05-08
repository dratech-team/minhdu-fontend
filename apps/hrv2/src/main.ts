import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { persistState } from '@datorama/akita';
import { StorageName } from 'libs/orgchart-v2/src/lib/constants';

if (environment.production) {
  enableProdMode();
}

const storage = persistState({
  include: [StorageName.EMPLOYEE_DRAFT]
});

const providers = [{ provide: 'persistStorage', useValue: storage }];
platformBrowserDynamic(providers)
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
