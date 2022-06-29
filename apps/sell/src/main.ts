import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { persistState, PersistStateSelectFn } from '@datorama/akita';
import { OrderState } from './app/pages/order/+state';
import { RouteState } from './app/pages/route/+state';
import { StorageName } from '@minhdu-fontend/constants';

if (environment.production) {
  enableProdMode();
}

const selectOrder: PersistStateSelectFn<OrderState> = (state) => ({
  ui: state.ui,
});
const selectRoute: PersistStateSelectFn<RouteState> = (state) => ({
  ui: state.ui,
});
selectOrder.storeName = StorageName.ORDER;
selectRoute.storeName = StorageName.ROUTE;

const storage = persistState({
  select: [selectOrder, selectRoute],
});

const providers = [{ provide: 'persistStorage', useValue: storage }];

platformBrowserDynamic(providers)
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
