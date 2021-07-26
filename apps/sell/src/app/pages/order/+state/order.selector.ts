import { OrderState } from './order.reducer';
import { Order } from './order.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as fromOrder from './order.reducer';

export interface state {
  order: OrderState,
}

export const getSelectedOrderId = (state: Order) => state.id;
export const selectorOrderState = createFeatureSelector<OrderState>(
  FeatureName.ORDER
)
export const selectorOrderEntities = createSelector(
  selectorOrderState,
  fromOrder.selectEntities,
);

export const selectorAllOrders = createSelector(
  selectorOrderState,
  fromOrder.selectAll,
);

export const selectorCurrentOrder = (id: number)  =>createSelector(
  selectorOrderEntities,
  (orderEntities) => orderEntities[id]
)


export const selectedLoaded = createSelector(
  selectorOrderState,
  (state) => state.loaded
)
