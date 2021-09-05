import { OrderAssignedState, OrderState } from './order.reducer';
import { Order } from './order.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as fromOrder from './order.reducer';


export interface state {
  order: OrderState,
}
export interface OrdersAssignedState {
  order: OrderAssignedState,
}

export const getSelectedOrderId = (state: Order) => state.id;
export const selectorOrderAssignedState = createFeatureSelector<OrderAssignedState>(
  FeatureName.ORDER_ASSIGNED
)

export const selectorOrderState = createFeatureSelector<OrderState>(
  FeatureName.ORDER
)
export const selectorOrderEntities = createSelector(
  selectorOrderState,
  fromOrder.selectEntities,
);

export const selectorAllOrdersAssigned = createSelector(
  selectorOrderAssignedState,
  fromOrder.selectAll,
);

export const selectorAllOrders = createSelector(
  selectorOrderState,
  fromOrder.selectAll,
);

export const selectorCurrentOrder = (id: number)  =>createSelector(
  selectorOrderEntities,
  (orderEntities) =>{
    return  orderEntities[id]
  }
)
export const selectOrdersByIds = (ids: number[]) => createSelector(
  selectorAllOrders,
  (orders ) => {
    const result: Order[] = []
    orders.forEach(val =>{
        if(ids.includes(val.id)){
          result.push(val)
        }
    })
    return result;
  }
)


export const selectedLoaded = createSelector(
  selectorOrderState,
  (state) => state.loaded
)
