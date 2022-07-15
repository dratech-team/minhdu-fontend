import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { persistState, PersistStateSelectFn } from '@datorama/akita';
import { StorageName } from '@minhdu-fontend/constants';
import { CustomerState } from './app/pages/customer/state';
import { OrderState } from './app/pages/order/state';
import { RouteState } from './app/pages/route/state';

if (environment.production) {
  enableProdMode();
}

const selectUICustomer: PersistStateSelectFn<CustomerState> = (state) => ({ ui: state.ui });
const selectUIOrder: PersistStateSelectFn<OrderState> = (state) => ({ ui: state.ui });
const selectUIRoute: PersistStateSelectFn<RouteState> = (state) => ({ ui: state.ui });

selectUICustomer.storeName = StorageName.CUSTOMER;
selectUIOrder.storeName = StorageName.ORDER;
selectUIRoute.storeName = StorageName.ROUTE;

const selectStorage = persistState({
  select: [selectUICustomer, selectUIOrder, selectUIRoute]
});

const includeStorage = persistState({
  select: [selectUICustomer, selectUIOrder, selectUIRoute]
});

platformBrowserDynamic([
  { provide: 'persistStorage', useValue: selectStorage, multi: true },
  { provide: 'persistStorage', useValue: includeStorage, multi: true },
])
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
