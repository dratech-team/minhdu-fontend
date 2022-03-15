import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { persistState, PersistStateSelectFn } from '@datorama/akita';
import { StorageName } from './app/shared/constaints/storage-name.const';
import { OrderState } from './app/pages/order/+state/order.store';

if (environment.production) {
  enableProdMode();
}

const selectOrder: PersistStateSelectFn<OrderState> = (state) => ({ token: state.token });
selectOrder.storeName = StorageName.ORDER;

const storage = persistState({
  include: [StorageName.APP],
  select: [selectOrder]
});

const providers = [{ provide: 'persistStorage', useValue: storage }];

platformBrowserDynamic(providers)
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
