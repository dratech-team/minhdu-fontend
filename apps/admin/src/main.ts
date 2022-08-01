import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { persistState } from '@datorama/akita';
import { StorageName } from '@minhdu-fontend/constants';

if (environment.production) {
  enableProdMode();
}

persistState({
  include: [StorageName.ACCOUNT]
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
