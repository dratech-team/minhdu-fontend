import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { persistState, PersistStateSelectFn } from '@datorama/akita';
import { StorageName } from '@minhdu-fontend/constants';
import { CustomerState } from './app/pages/customer/state';
import { OrderState } from './app/pages/order/state';
import { RouteState } from './app/pages/route/state';
import { CommodityState } from './app/pages/commodity/state';
import { CommodityTemplateState } from './app/pages/commodity-template/state/commodity-template.store';
import { PaymentState } from './app/pages/payment/state';

if (environment.production) {
  enableProdMode();
}

const selectUICustomer: PersistStateSelectFn<CustomerState> = ({ ui }) => {
  return { ui };
};
const selectUIOrder: PersistStateSelectFn<OrderState> = ({ ui }) => {
  return { ui };
};
const selectUIRoute: PersistStateSelectFn<RouteState> = ({ ui, expandedAll }) => {
  return { ui, expandedAll };
};
const selectUICommodity: PersistStateSelectFn<CommodityState> = ({ ui }) => {
  return { ui };
};
const selectUICommodityTemplate: PersistStateSelectFn<CommodityTemplateState> = ({ ui }) => {
  return { ui };
};
const selectUIPayment: PersistStateSelectFn<PaymentState> = ({ ui }) => {
  return { ui };
};

selectUICustomer.storeName = StorageName.CUSTOMER;
selectUIOrder.storeName = StorageName.ORDER;
selectUIRoute.storeName = StorageName.ROUTE;
selectUICommodity.storeName = StorageName.COMMODITY;
selectUICommodityTemplate.storeName = StorageName.COMMODITY_TEMPLATE;
selectUIPayment.storeName = StorageName.PAYMENT;


persistState({
  select: [
    selectUICustomer,
    selectUIOrder,
    selectUIRoute,
    selectUICommodity,
    selectUICommodityTemplate,
    selectUIPayment
  ]
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
